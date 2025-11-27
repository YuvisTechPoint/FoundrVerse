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

  // Return keys (empty if not configured - will be validated in createOrder)
  return { keyId: keyId || '', keySecret: keySecret || '' };
}

export function getRazorpayClient() {
  const { keyId, keySecret } = ensureRazorpayKeys();
  
  // Only create client if keys are available
  if (!keyId || !keySecret) {
    // Return a mock client for test mode instead of throwing
    return {
      orders: {
        create: async () => {
          throw new Error('Razorpay keys not configured - use createOrder() which handles test mode');
        }
      }
    } as any;
  }
  
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
    const { keyId, keySecret } = ensureRazorpayKeys();
    const { amount, currency = 'INR', receipt, notes } = params;

    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount supplied to createOrder.');
    }

    // Require Razorpay keys to create actual orders
    if (!keyId || !keySecret) {
      throw new Error('Razorpay keys not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. Get keys from https://dashboard.razorpay.com/app/keys');
    }

    const client = getRazorpayClient();
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
    const { logger } = await import('./logger');
    logger.error('Error creating Razorpay order', error);
    
    // Check if this is a Razorpay configuration error
    const isConfigError = 
      errorMessage.includes('Razorpay keys not configured') ||
      errorMessage.includes('key') && errorMessage.includes('required') ||
      errorMessage.includes('authentication') ||
      errorMessage.includes('unauthorized');
    
    // Provide more helpful error message for configuration issues
    if (isConfigError) {
      const isLocalhost = process.env.NODE_ENV === 'development';
      const errorMsg = isLocalhost
        ? 'Razorpay keys are not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. See docs/RAZORPAY.md for setup instructions.'
        : 'Payment gateway is not configured. Please contact support or see docs/RAZORPAY.md for setup instructions.';
      throw new Error(errorMsg);
    }
    
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