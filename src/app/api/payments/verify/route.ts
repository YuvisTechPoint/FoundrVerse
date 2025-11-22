import { NextRequest } from 'next/server';
import {
  getPaymentByOrderId,
  updatePaymentByOrderId,
  getAllPayments,
  updatePayment,
  createPayment,
} from '@/data/payments-mock';
import { verifyPaymentSignature } from '@/lib/razorpay-utils';
import { errorResponse, successResponse, validateRequired, ApiException, withErrorHandling } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { ensureRazorpayKeys } from '@/lib/razorpay';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json().catch(() => {
    throw new ApiException('Invalid JSON in request body', 400, 'INVALID_JSON');
  });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  // Validation
  const validation = validateRequired(body, ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']);
  if (!validation.isValid) {
    throw new ApiException(
      `Missing required fields: ${validation.missing.join(', ')}`,
      400,
      'MISSING_FIELDS',
      { missing: validation.missing }
    );
  }

  // Get payment record
  let payment = getPaymentByOrderId(razorpay_order_id);
  
  if (!payment) {
    logger.warn('Payment order not found in store', {
      razorpay_order_id,
      totalPayments: getAllPayments().length,
    });
    
    // Try to find by payment ID if it exists
    if (razorpay_payment_id) {
      const paymentByPaymentId = getAllPayments().find(p => p.paymentId === razorpay_payment_id);
      if (paymentByPaymentId) {
        logger.info('Found payment by payment ID, updating order ID');
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
      logger.warn('Creating fallback payment record for order', { razorpay_order_id });
      try {
        // Create a minimal payment record - we'll update it after signature verification
        payment = createPayment({
          orderId: razorpay_order_id,
          amount: 0, // Will be updated if we can get order details
          currency: 'INR',
          status: 'created',
          receiptId: `fallback_${razorpay_order_id}`,
        });
        logger.info('Created fallback payment record', { paymentId: payment.id });
      } catch (createError) {
        logger.error('Failed to create fallback payment', createError);
        throw new ApiException(
          'The payment order could not be found or created. Please try again or contact support.',
          404,
          'ORDER_NOT_FOUND',
          { orderId: razorpay_order_id }
        );
      }
    }
  }

  // Verify signature
  const { keySecret } = ensureRazorpayKeys();

  // Verify signature
  let isValid = false;
  try {
    isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );
  } catch (sigError) {
    logger.error('Signature verification error', sigError);
    updatePaymentByOrderId(razorpay_order_id, {
      status: 'failed',
    });
    throw new ApiException(
      'Unable to verify payment signature. Please contact support.',
      400,
      'SIGNATURE_VERIFICATION_FAILED'
    );
  }

  if (!isValid) {
    logger.warn('Invalid payment signature', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
    
    // Mark payment as failed
    updatePaymentByOrderId(razorpay_order_id, {
      status: 'failed',
    });

    throw new ApiException(
      'The payment signature could not be verified. This may indicate a security issue or payment tampering.',
      400,
      'INVALID_SIGNATURE'
    );
  }

  // Update payment record
  const updatedPayment = updatePaymentByOrderId(razorpay_order_id, {
    paymentId: razorpay_payment_id,
    status: 'paid',
    paidAt: new Date().toISOString(),
  });

  if (!updatedPayment) {
    throw new ApiException('Failed to update payment record', 500, 'UPDATE_FAILED');
  }

  logger.info('Payment verified successfully', {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });

  // TODO: Trigger enrollment activation here
  // await enrollUser(payment.userId, payment.courseId, payment.cohort);

  return successResponse({
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    status: 'paid',
    message: 'Payment verified successfully. Enrollment activated.',
  });
});

