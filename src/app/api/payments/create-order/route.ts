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
    const { userId: clientUserId, enrollmentId, amount, currency = 'INR', metadata = {}, userEmail: bodyUserEmail } = body;
    
    // Use authenticated userId (prioritize session over client-provided)
    const userId = authenticatedUserId || clientUserId;

    // CRITICAL: Get email from multiple sources - prioritize body, then metadata, then session
    const paymentEmail = bodyUserEmail || metadata?.userEmail || metadata?.email || authenticatedUserEmail || '';
    
    if (!paymentEmail) {
      console.warn('Payment creation: No email found', {
        authenticatedUserEmail,
        bodyUserEmail,
        metadataEmail: metadata?.userEmail || metadata?.email,
        note: 'Email should be provided in request body'
      });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    // Check Razorpay keys - require them for actual payments
    const { keyId, keySecret } = ensureRazorpayKeys();
    
    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error: 'Razorpay configuration missing',
          message: 'Razorpay keys are not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. Get keys from https://dashboard.razorpay.com/app/keys',
          setupRequired: true,
        },
        { status: 503 }
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
      userId: authenticatedUserId, // CRITICAL: Always use authenticated userId from session
      userEmail: paymentEmail, // CRITICAL: Save email for lookup (from body/metadata/session)
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
      authenticatedUserEmail,
      paymentEmail,
      emailSource: bodyUserEmail ? 'body' : (metadata?.userEmail || metadata?.email ? 'metadata' : (authenticatedUserEmail ? 'session' : 'none')),
      status: payment.status,
      note: paymentEmail ? 'Payment linked to authenticated user account with email' : 'WARNING: Payment created without email',
    });

    // Get keyId for client (use test key if not configured)
    const clientKeyId = process.env.NEXT_PUBLIC_RZP_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    return NextResponse.json({
      orderId: order.id,
      amount: Number(order.amount) / 100,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      paymentId: payment.id,
      keyId: clientKeyId || null, // Return null if not configured - client will handle
    });
  } catch (error: any) {
    // Better error extraction
    let errorMessage = 'Unknown error';
    let errorDetails: any = {};

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = (error as any).message || (error as any).error?.message || JSON.stringify(error);
      errorDetails = error;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    console.error('Error creating Razorpay order (create-order) - Full details:', {
      error,
      errorMessage,
      errorDetails,
      errorType: typeof error,
      isError: error instanceof Error,
    });
    
    // Check if this is a Razorpay configuration error
    const isConfigError = errorMessage.includes('Razorpay') && 
                         (errorMessage.includes('not configured') || 
                          errorMessage.includes('configuration') ||
                          errorMessage.includes('keys are not configured'));

    // Check for authentication errors
    const isAuthError = errorMessage.includes('authentication') ||
                       errorMessage.includes('unauthorized') ||
                       errorMessage.includes('Invalid key') ||
                       errorMessage.includes('API key');

    const isConfigOrAuthError = isConfigError || isAuthError;
    
    return NextResponse.json(
      {
        error: isConfigOrAuthError ? 'Razorpay configuration missing' : 'Failed to create order',
        message: isConfigOrAuthError 
          ? (process.env.NODE_ENV === 'development' || request.headers.get('host')?.includes('localhost')
              ? 'Razorpay keys are not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. See docs/RAZORPAY.md for setup instructions.'
              : 'Payment gateway is not configured. Please contact support or see docs/RAZORPAY.md for setup instructions.')
          : errorMessage,
        setupRequired: isConfigOrAuthError,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined, // Only in dev
      },
      { status: isConfigOrAuthError ? 503 : 500 }
    );
  }
}
