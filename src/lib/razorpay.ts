import Razorpay from 'razorpay';
import {
  verifyPaymentSignature as verifyPaymentSignatureUtil,
  verifyWebhookSignature as verifyWebhookSignatureUtil,
} from './razorpay-utils';

function resolveKeyId() {
  return process.env.RZP_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
}

function resolveKeySecret() {
  return process.env.RZP_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
}

export function ensureRazorpayKeys() {
  const keyId = resolveKeyId();
  const keySecret = resolveKeySecret();

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay keys not configured. Set RZP_KEY_ID/RZP_KEY_SECRET (or legacy RAZORPAY_* vars) in .env.local.'
    );
  }

  return { keyId, keySecret };
}

export function getRazorpayClient() {
  const { keyId, keySecret } = ensureRazorpayKeys();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

interface CreateOrderParams {
  amount: number; // in rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export async function createOrder(params: CreateOrderParams) {
  try {
    const client = getRazorpayClient();
    const { amount, currency = 'INR', receipt, notes } = params;

    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount supplied to createOrder.');
    }

    const order = await client.orders.create({
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt,
      notes,
      payment_capture: 1,
    } as any);

    return order;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating Razorpay order:', error);
    throw new Error(`Failed to create order: ${errorMessage}`);
  }
}

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = ensureRazorpayKeys();
  return verifyPaymentSignatureUtil(orderId, paymentId, signature, keySecret);
}

export function verifyWebhook(body: string, signature: string) {
  if (!process.env.RZP_WEBHOOK_SECRET) {
    throw new Error('Razorpay webhook secret not configured. Set RZP_WEBHOOK_SECRET in env.');
  }
  return verifyWebhookSignatureUtil(body, signature, process.env.RZP_WEBHOOK_SECRET);
}