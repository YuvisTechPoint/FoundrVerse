import { NextRequest } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import {
  getPaymentByPaymentId,
  addRefund,
} from '@/data/payments-mock';
import { errorResponse, successResponse, validateRequired, validateNumber, ApiException, withErrorHandling } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json().catch(() => {
    throw new ApiException('Invalid JSON in request body', 400, 'INVALID_JSON');
  });

  const { paymentId, amount, reason, notes } = body;

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

  // Prepare refund options
  const refundOptions: {
    amount?: number;
    notes?: Record<string, string>;
  } = {};
  
  if (amount) {
    refundOptions.amount = Math.round((typeof amount === 'string' ? parseFloat(amount) : amount) * 100); // Convert to paise
  }
  
  if (notes && typeof notes === 'object') {
    refundOptions.notes = notes as Record<string, string>;
  }

  // Create refund via Razorpay
  const razorpay = getRazorpayClient();
  const refund = await razorpay.payments.refund(paymentId, refundOptions).catch((error) => {
    logger.error('Failed to create refund via Razorpay', error);
    throw new ApiException(
      `Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
      'REFUND_FAILED'
    );
  });
  
  // Handle potentially undefined amount with proper type checking
  const refundAmountInPaise = (refund.amount !== undefined && refund.amount !== null) 
    ? (refund.amount as number) 
    : (amount ? Math.round((typeof amount === 'string' ? parseFloat(amount) : amount) * 100) : 0);
  
  addRefund(paymentId, {
    refundId: refund.id,
    paymentId,
    amount: refundAmountInPaise / 100,
    status: refund.status === 'processed' ? 'processed' : 'pending',
    reason: reason || (refund.notes as { comment?: string })?.comment || 'Refund requested',
  });

  logger.info('Refund created successfully', {
    refundId: refund.id,
    paymentId,
    amount: refundAmountInPaise / 100,
  });

  return successResponse({
    refundId: refund.id,
    paymentId,
    amount: refundAmountInPaise / 100,
    status: refund.status,
    createdAt: new Date().toISOString(), // Use current time since refund was just created
  });
});

