import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import {
  getPaymentByPaymentId,
  addRefund,
} from '@/data/payments-mock';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount, reason, notes } = body;

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

    // Prepare refund options
    const refundOptions: any = {};
    if (amount) {
      refundOptions.amount = Math.round(amount * 100); // Convert to paise
    }
    if (notes) {
      refundOptions.notes = notes;
    }

    // Create refund via Razorpay
    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    // Store refund record
    const refundRecord = addRefund(paymentId, {
      refundId: refund.id,
      paymentId,
      amount: refund.amount / 100,
      status: refund.status === 'processed' ? 'processed' : 'pending',
      reason: reason || refund.notes?.comment || 'Refund requested',
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      paymentId,
      amount: refund.amount / 100,
      status: refund.status,
      createdAt: new Date(refund.created_at * 1000).toISOString(),
    });
  } catch (error: any) {
    console.error('Error creating refund:', error);
    return NextResponse.json(
      {
        error: 'Failed to create refund',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

