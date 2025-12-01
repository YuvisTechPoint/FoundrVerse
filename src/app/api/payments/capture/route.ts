import { NextRequest } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import {
  getPaymentByPaymentId,
  updatePaymentByOrderId,
} from '@/data/payments-mock';
import { errorResponse, successResponse, validateRequired, validateNumber, ApiException, withErrorHandling } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json().catch(() => {
    throw new ApiException('Invalid JSON in request body', 400, 'INVALID_JSON');
  });

  const { paymentId, amount } = body;

  const validation = validateRequired(body, ['paymentId']);
  if (!validation.isValid) {
    throw new ApiException('Payment ID is required', 400, 'MISSING_PAYMENT_ID');
  }

  // Get payment record
  const payment = getPaymentByPaymentId(paymentId);
  if (!payment) {
    throw new ApiException('Payment not found', 404, 'PAYMENT_NOT_FOUND');
  }

  // Validate amount if provided
  if (amount !== undefined) {
    const amountValidation = validateNumber(amount, 0.01);
    if (!amountValidation.isValid) {
      throw new ApiException(
        amountValidation.error || 'Invalid amount',
        400,
        'INVALID_AMOUNT'
      );
    }
  }

  // Capture payment via Razorpay
  const razorpay = getRazorpayClient();
  const captureAmount = amount ? Math.round((typeof amount === 'string' ? parseFloat(amount) : amount) * 100) : undefined;

  // Razorpay capture signature: capture(paymentId, amount, currency, receipt)
  const capturedPayment = await razorpay.payments.capture(
    paymentId,
    captureAmount || payment.amount * 100, // amount in paise
    payment.currency || 'INR' // currency
  ).catch((error: unknown) => {
    logger.error('Failed to capture payment via Razorpay', error);
    throw new ApiException(
      `Failed to capture payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
      'CAPTURE_FAILED'
    );
  });

  // Update payment record
  updatePaymentByOrderId(payment.orderId, {
    status: 'captured',
    paidAt: new Date().toISOString(),
  });

  logger.info('Payment captured successfully', {
    paymentId: capturedPayment.id,
    orderId: payment.orderId,
  });

  return successResponse({
    paymentId: capturedPayment.id,
    status: capturedPayment.status,
    amount: (capturedPayment.amount as number) / 100,
    capturedAt: new Date().toISOString(), // Use current time since payment was just captured
  });
});

