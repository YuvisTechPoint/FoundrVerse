import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import {
  createPayment,
  findPaymentByReceiptOrIdempotency,
} from '@/data/payments-mock';
import { generateReceiptId } from '@/lib/razorpay-utils';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'INR',
      receiptId,
      userId,
      userEmail,
      courseId,
      cohort,
      metadata = {},
      idempotency_key,
    } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    // Check for idempotency (prevent duplicate orders)
    const idempotencyKey = idempotency_key || request.headers.get('idempotency-key');
    const existingPayment = findPaymentByReceiptOrIdempotency(receiptId, idempotencyKey || undefined);
    
    if (existingPayment) {
      // Return existing order
      return NextResponse.json({
        orderId: existingPayment.orderId,
        amount: existingPayment.amount,
        currency: existingPayment.currency,
        receipt: existingPayment.receiptId,
        status: existingPayment.status,
        id: existingPayment.id,
      });
    }

    // Generate receipt ID if not provided
    const finalReceiptId = receiptId || generateReceiptId();

    // Create Razorpay order
    const orderOptions: any = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: currency.toUpperCase(),
      receipt: finalReceiptId,
      payment_capture: 1, // Auto-capture payment (set to 0 for manual capture)
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Store payment record
    const payment = createPayment({
      orderId: razorpayOrder.id,
      amount,
      currency: currency.toUpperCase(),
      status: 'created',
      userId,
      userEmail,
      courseId,
      cohort,
      receiptId: finalReceiptId,
      idempotencyKey: idempotencyKey || undefined,
      metadata,
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // Convert back from paise
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status,
      id: payment.id,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

