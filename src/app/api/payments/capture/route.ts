import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import {
  getPaymentByPaymentId,
  updatePaymentByOrderId,
} from '@/data/payments-mock';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Get payment record
    const payment = getPaymentByPaymentId(paymentId);
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Capture payment via Razorpay
    const captureOptions: any = {};
    if (amount) {
      captureOptions.amount = Math.round(amount * 100); // Convert to paise
    }

    const capturedPayment = await razorpay.payments.capture(
      paymentId,
      captureOptions.amount || undefined
    );

    // Update payment record
    updatePaymentByOrderId(payment.orderId, {
      status: 'captured',
      paidAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      paymentId: capturedPayment.id,
      status: capturedPayment.status,
      amount: capturedPayment.amount / 100,
      capturedAt: new Date(capturedPayment.captured_at * 1000).toISOString(),
    });
  } catch (error: any) {
    console.error('Error capturing payment:', error);
    return NextResponse.json(
      {
        error: 'Failed to capture payment',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

