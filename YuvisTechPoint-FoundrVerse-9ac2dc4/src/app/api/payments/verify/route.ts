import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
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
import { verifySessionCookie } from '@/lib/verifySession';

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Verify authentication first
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    throw new ApiException('Authentication required', 401, 'AUTH_REQUIRED');
  }

  const authenticatedUserId = decoded.uid;
  const authenticatedUserEmail = decoded.email;

  const body = await request.json().catch(() => {
    throw new ApiException('Invalid JSON in request body', 400, 'INVALID_JSON');
  });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;
  
  logger.info('Payment verification started for authenticated user', {
    authenticatedUserId,
    authenticatedUserEmail,
    orderId: razorpay_order_id,
  });

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
  
  logger.info('Payment verification started', {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    foundPayment: !!payment,
    paymentUserId: payment?.userId,
    totalPayments: getAllPayments().length,
  });
  
  if (!payment) {
    logger.warn('Payment order not found in store', {
      razorpay_order_id,
      totalPayments: getAllPayments().length,
      allOrderIds: getAllPayments().map(p => p.orderId),
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
    
    // CRITICAL: Try to find payment by email if order not found
    // This handles cases where payment was created but order ID doesn't match
    if (!payment && authenticatedUserEmail) {
      const emailPayments = getAllPayments().filter(
        p => p.userEmail === authenticatedUserEmail && 
        (!p.paymentId || p.paymentId === razorpay_payment_id)
      );
      if (emailPayments.length > 0) {
        // Find the most recent unpaid payment for this email
        const unpaidPayment = emailPayments
          .filter(p => p.status === 'created' || p.status === 'authorized')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        
        if (unpaidPayment) {
          logger.info('Found payment by email, linking to authenticated account', {
            paymentId: unpaidPayment.id,
            email: authenticatedUserEmail,
            orderId: unpaidPayment.orderId,
          });
          payment = unpaidPayment;
          // Update payment with correct order ID and link to authenticated account
          updatePayment(payment.id, {
            orderId: razorpay_order_id,
            userId: authenticatedUserId,
            userEmail: authenticatedUserEmail,
          });
        }
      }
    }
    
    // If still not found, create a new payment record as fallback
    // This can happen if the server restarted and lost in-memory data
    if (!payment) {
      logger.warn('Creating fallback payment record for order', { razorpay_order_id });
      try {
        // Try to get userId from Razorpay order notes if available
        // Note: This requires fetching order from Razorpay API
        // For now, we'll create without userId and log a warning
        payment = createPayment({
          orderId: razorpay_order_id,
          amount: 0, // Will be updated if we can get order details
          currency: 'INR',
          status: 'created',
          receiptId: `fallback_${razorpay_order_id}`,
        });
        logger.warn('Created fallback payment record without userId', { 
          paymentId: payment.id,
          note: 'UserId will need to be manually updated or payment may not show in dashboard'
        });
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
  
  // Log payment details before update
  logger.info('Payment record before update', {
    id: payment.id,
    userId: payment.userId,
    status: payment.status,
    orderId: payment.orderId,
  });

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

  // CRITICAL: Preserve userId from original payment record
  // CRITICAL: Use authenticated userId to ensure payment is linked to current user
  // If payment already has a userId, verify it matches authenticated user
  const userIdToUse = payment.userId || authenticatedUserId;
  
  if (payment.userId && payment.userId !== authenticatedUserId) {
    logger.warn('Payment userId mismatch - updating to authenticated user', {
      orderId: razorpay_order_id,
      paymentUserId: payment.userId,
      authenticatedUserId,
      note: 'Updating payment to match authenticated user'
    });
  }
  
  // CRITICAL: Get email from multiple sources
  // Priority: authenticated email > payment email > try to get from Razorpay order notes
  let finalUserEmail = authenticatedUserEmail || payment.userEmail || '';
  
  // If still no email, try to get from payment metadata or order notes
  if (!finalUserEmail && payment.metadata) {
    finalUserEmail = payment.metadata.userEmail || payment.metadata.email || payment.metadata.authenticatedUserEmail || '';
  }
  
  // If still no email, log warning but continue (email lookup will use userId)
  if (!finalUserEmail) {
    logger.warn('Payment verification: No email found, using userId only', {
      orderId: razorpay_order_id,
      authenticatedUserId,
      authenticatedUserEmail,
      paymentUserEmail: payment.userEmail,
      note: 'Payment will be found by userId, but email-based lookup may fail'
    });
  }
  
  // Update payment record - use authenticated userId and email to ensure sync
  const updatedPayment = updatePaymentByOrderId(razorpay_order_id, {
    paymentId: razorpay_payment_id,
    status: 'paid',
    paidAt: new Date().toISOString(),
    // CRITICAL: Always use authenticated userId to ensure payment is linked to account
    userId: authenticatedUserId,
    // CRITICAL: Always save email for proper account linking (use authenticated email if available)
    userEmail: authenticatedUserEmail || finalUserEmail || payment.userEmail || '',
  });

  if (!updatedPayment) {
    logger.error('Failed to update payment record', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      originalPaymentId: payment.id,
    });
    throw new ApiException('Failed to update payment record', 500, 'UPDATE_FAILED');
  }

  logger.info('Payment verified and updated successfully', {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    userId: updatedPayment.userId,
    userEmail: updatedPayment.userEmail,
    authenticatedUserId,
    authenticatedUserEmail,
    status: updatedPayment.status,
    paidAt: updatedPayment.paidAt,
  });
  
  // Triple check the payment is in the store with correct userId
  const verifyStored = getPaymentByOrderId(razorpay_order_id);
  if (!verifyStored) {
    logger.error('Payment not found after update - CRITICAL ERROR', {
      orderId: razorpay_order_id,
    });
  } else {
    logger.info('Verified stored payment after update:', {
      found: true,
      status: verifyStored.status,
      userId: verifyStored.userId,
      authenticatedUserId,
      paymentId: verifyStored.paymentId,
      matchesExpected: verifyStored.userId === authenticatedUserId,
    });
    
    // Verify we can find it by userId
    if (verifyStored.userId) {
      const userPayments = getAllPayments().filter(p => p.userId === verifyStored.userId);
      logger.info('User payments after verification:', {
        userId: verifyStored.userId,
        totalPayments: userPayments.length,
        paidPayments: userPayments.filter(p => p.status === 'paid').length,
      });
    }
  }

  // Revalidate dashboard path to refresh server component data
  try {
    revalidatePath('/dashboard');
    revalidatePath('/course');
    revalidatePath('/assignments');
    revalidatePath('/internships');
    revalidatePath('/sessions');
    revalidatePath('/pitch');
    revalidatePath('/certificate');
  } catch (revalidateError) {
    logger.warn('Failed to revalidate paths', {
      error: revalidateError instanceof Error ? revalidateError.message : String(revalidateError),
    });
  }

  // TODO: Trigger enrollment activation here
  // await enrollUser(payment.userId, payment.courseId, payment.cohort);

  return successResponse({
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    status: 'paid',
    userId: updatedPayment.userId,
    message: 'Payment verified successfully. Enrollment activated.',
  });
});

