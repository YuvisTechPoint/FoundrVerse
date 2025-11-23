import { NextRequest } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import {
  createPayment,
  findPaymentByReceiptOrIdempotency,
} from '@/data/payments-mock';
import { generateReceiptId } from '@/lib/razorpay-utils';
import { errorResponse, successResponse, validateNumber, ApiException, withErrorHandling } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json().catch(() => {
    throw new ApiException('Invalid JSON in request body', 400, 'INVALID_JSON');
  });

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

  // Validate amount
  const amountValidation = validateNumber(amount, 0.01);
  if (!amountValidation.isValid) {
    throw new ApiException(
      amountValidation.error || 'Invalid amount. Amount must be greater than 0.',
      400,
      'INVALID_AMOUNT'
    );
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Check for idempotency (prevent duplicate orders)
  const idempotencyKey = idempotency_key || request.headers.get('idempotency-key');
  const existingPayment = findPaymentByReceiptOrIdempotency(receiptId, idempotencyKey || undefined);
  
  if (existingPayment) {
    // Return existing order
    return successResponse({
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
  const razorpay = getRazorpayClient();
  const orderOptions = {
    amount: Math.round(numericAmount * 100), // Convert to paise (smallest currency unit)
    currency: currency.toUpperCase(),
    receipt: finalReceiptId,
    payment_capture: 1, // Auto-capture payment (set to 0 for manual capture)
    notes: {
      userId,
      userEmail,
      courseId,
      cohort,
      ...metadata,
    },
  };

  const razorpayOrder = await razorpay.orders.create(orderOptions);

  // Store payment record
  const payment = createPayment({
    orderId: razorpayOrder.id,
    amount: numericAmount,
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

  logger.info('Razorpay order created', {
    orderId: razorpayOrder.id,
    amount: numericAmount,
    receiptId: finalReceiptId,
  });

  return successResponse({
    orderId: razorpayOrder.id,
    amount: (razorpayOrder.amount as number) / 100, // Convert back from paise
    currency: razorpayOrder.currency,
    receipt: razorpayOrder.receipt,
    status: razorpayOrder.status,
    id: payment.id,
  });
});

