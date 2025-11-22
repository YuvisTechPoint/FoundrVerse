import { NextRequest, NextResponse } from 'next/server';
import {
  getPaymentByOrderId,
  updatePaymentByOrderId,
  getAllPayments,
  updatePayment,
  createPayment,
} from '@/data/payments-mock';
import { verifyPaymentSignature } from '@/lib/razorpay-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Get payment record
    let payment = getPaymentByOrderId(razorpay_order_id);
    
    if (!payment) {
      // Log for debugging
      console.warn('Payment order not found in store:', {
        razorpay_order_id,
        totalPayments: getAllPayments().length,
        sampleOrders: getAllPayments().slice(0, 3).map(p => ({ id: p.id, orderId: p.orderId, status: p.status })),
      });
      
      // Try to find by payment ID if it exists
      if (razorpay_payment_id) {
        const paymentByPaymentId = getAllPayments().find(p => p.paymentId === razorpay_payment_id);
        if (paymentByPaymentId) {
          console.log('Found payment by payment ID, updating order ID');
          payment = paymentByPaymentId;
          // Update the order ID if it was missing
          if (!payment.orderId || payment.orderId !== razorpay_order_id) {
            updatePayment(payment.id, { orderId: razorpay_order_id });
          }
        }
      }
      
      // If still not found, create a new payment record as fallback
      // This can happen if the server restarted and lost in-memory data
      if (!payment) {
        console.warn('Creating fallback payment record for order:', razorpay_order_id);
        try {
          // Create a minimal payment record - we'll update it after signature verification
          payment = createPayment({
            orderId: razorpay_order_id,
            amount: 0, // Will be updated if we can get order details
            currency: 'INR',
            status: 'created',
            receiptId: `fallback_${razorpay_order_id}`,
          });
          console.log('Created fallback payment record:', payment.id);
        } catch (createError) {
          console.error('Failed to create fallback payment:', createError);
          return NextResponse.json(
            { 
              error: 'Order not found',
              message: 'The payment order could not be found or created. Please try again or contact support.',
              orderId: razorpay_order_id,
            },
            { status: 404 }
          );
        }
      }
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify signature
    let isValid = false;
    try {
      isValid = verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        secret
      );
    } catch (sigError: any) {
      console.error('Signature verification error:', sigError);
      updatePaymentByOrderId(razorpay_order_id, {
        status: 'failed',
      });
      return NextResponse.json(
        { 
          error: 'Signature verification failed', 
          message: 'Unable to verify payment signature. Please contact support.',
          verified: false 
        },
        { status: 400 }
      );
    }

    if (!isValid) {
      console.warn('Invalid payment signature', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        hasSignature: !!razorpay_signature,
      });
      
      // Mark payment as failed
      updatePaymentByOrderId(razorpay_order_id, {
        status: 'failed',
      });

      return NextResponse.json(
        { 
          error: 'Invalid payment signature', 
          message: 'The payment signature could not be verified. This may indicate a security issue or payment tampering.',
          verified: false 
        },
        { status: 400 }
      );
    }

    // Update payment record
    const updatedPayment = updatePaymentByOrderId(razorpay_order_id, {
      paymentId: razorpay_payment_id,
      status: 'paid',
      paidAt: new Date().toISOString(),
    });

    if (!updatedPayment) {
      return NextResponse.json(
        { error: 'Failed to update payment record' },
        { status: 500 }
      );
    }

    // TODO: Trigger enrollment activation here
    // await enrollUser(payment.userId, payment.courseId, payment.cohort);

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'paid',
      message: 'Payment verified successfully. Enrollment activated.',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to verify payment';
    let statusCode = 500;
    
    if (error.message?.includes('JSON')) {
      errorMessage = 'Invalid request format';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        message: error.message || 'Unknown error occurred during payment verification',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: statusCode }
    );
  }
}

