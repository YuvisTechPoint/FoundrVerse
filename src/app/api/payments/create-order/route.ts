import { NextRequest, NextResponse } from 'next/server';
import { createOrder, ensureRazorpayKeys } from '@/lib/razorpay';
import { createPayment } from '@/data/payments-mock';
import { generateReceiptId } from '@/lib/razorpay-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, enrollmentId, amount, currency = 'INR', metadata = {} } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    try {
      // Ensure Razorpay keys are configured
      ensureRazorpayKeys();
    } catch (error: any) {
      // Return error response if Razorpay keys are not configured
      return NextResponse.json(
        {
          error: 'Razorpay keys not configured',
          message: 'Please set RZP_KEY_ID and RZP_KEY_SECRET environment variables to enable payments.',
        },
        { status: 500 }
      );
    }

    const receiptId = generateReceiptId('enroll');

    const order = await createOrder({
      amount,
      currency,
      receipt: receiptId,
      notes: { userId, enrollmentId, ...metadata },
    });

    const payment = createPayment({
      orderId: order.id,
      amount,
      currency: order.currency,
      status: 'created',
      userId,
      courseId: enrollmentId,
      receiptId,
      metadata,
    });

    console.log('Payment order created:', {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      userId: payment.userId,
      status: payment.status,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: Number(order.amount) / 100,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      paymentId: payment.id,
      keyId: process.env.NEXT_PUBLIC_RZP_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order (create-order):', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
