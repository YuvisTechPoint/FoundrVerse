import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createOrder, ensureRazorpayKeys } from '@/lib/razorpay';
import { createPayment } from '@/data/payments-mock';
import { generateReceiptId } from '@/lib/razorpay-utils';
import { verifySessionCookie } from '@/lib/verifySession';

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication first
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

    const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required', message: 'Please login to continue' },
        { status: 401 }
      );
    }

    // Use authenticated user's ID from session (not client-provided)
    const authenticatedUserId = decoded.uid;
    const authenticatedUserEmail = decoded.email;

    const body = await request.json();
    const { userId: clientUserId, enrollmentId, amount, currency = 'INR', metadata = {} } = body;
    
    // Use authenticated userId (prioritize session over client-provided)
    const userId = authenticatedUserId || clientUserId;

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

    // Ensure we have email - try multiple sources
    const paymentEmail = authenticatedUserEmail || metadata?.userEmail || metadata?.email || body.userEmail || '';
    
    const payment = createPayment({
      orderId: order.id,
      amount,
      currency: order.currency,
      status: 'created',
      userId: authenticatedUserId, // CRITICAL: Always use authenticated userId from session
      userEmail: paymentEmail, // CRITICAL: Save email for lookup
      courseId: enrollmentId,
      receiptId,
      metadata: {
        ...metadata,
        authenticatedUserId, // Store authenticated ID in metadata
        authenticatedUserEmail: paymentEmail, // Store authenticated email in metadata
        clientUserId, // Store client-provided ID for reference
        createdAt: new Date().toISOString(),
      },
    });

    console.log('Payment order created with authenticated user:', {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      userId: payment.userId,
      userEmail: payment.userEmail,
      authenticatedUserId,
      authenticatedUserEmail: paymentEmail,
      status: payment.status,
      note: 'Payment linked to authenticated user account with email',
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
