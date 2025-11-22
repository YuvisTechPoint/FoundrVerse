import { NextRequest, NextResponse } from 'next/server';
import {
  getPaymentByOrderId,
  getPaymentByPaymentId,
  updatePaymentByOrderId,
  isWebhookEventProcessed,
  markWebhookEventProcessed,
  createPayment,
} from '@/data/payments-mock';
import { verifyWebhookSignature } from '@/lib/razorpay-utils';

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getRawBody(request: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();
  
  if (!reader) {
    return '';
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
  return buffer.toString('utf-8');
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(request);
    
    // Get signature from header
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RZP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      const { logger } = await import('@/lib/logger');
      logger.error('Razorpay webhook secret is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const { event, payload: eventPayload } = payload;

    // Idempotency check
    const eventId = payload.id || `${event}_${eventPayload?.payment?.id || eventPayload?.order?.id || Date.now()}`;
    if (isWebhookEventProcessed(eventId)) {
      const { logger } = await import('@/lib/logger');
      logger.info('Webhook event already processed, ignoring', { eventId });
      return NextResponse.json({ received: true, message: 'Event already processed' });
    }

    // Handle different event types
    switch (event) {
      case 'payment.authorized': {
        const payment = eventPayload.payment.entity;
        let paymentRecord = getPaymentByOrderId(payment.order_id);
        
        if (!paymentRecord) {
          // Create new payment record if order exists but payment record doesn't
          paymentRecord = createPayment({
            orderId: payment.order_id,
            paymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: 'authorized',
            method: payment.method,
            notes: payment.notes || {},
            metadata: {
              webhook: true,
              authorizedAt: new Date().toISOString(),
            },
          });
        } else {
          // Update existing payment
          updatePaymentByOrderId(payment.order_id, {
            paymentId: payment.id,
            status: 'authorized',
            method: payment.method,
            notes: payment.notes || {},
          });
        }
        break;
      }

      case 'payment.captured': {
        const payment = eventPayload.payment.entity;
        const paymentRecord = getPaymentByOrderId(payment.order_id);
        
        if (paymentRecord) {
          updatePaymentByOrderId(payment.order_id, {
            paymentId: payment.id,
            status: 'captured',
            paidAt: new Date(payment.captured_at * 1000).toISOString(),
            method: payment.method,
          });
        }
        break;
      }

      case 'payment.failed': {
        const payment = eventPayload.payment.entity;
        const paymentRecord = getPaymentByOrderId(payment.order_id);
        
        if (paymentRecord) {
          updatePaymentByOrderId(payment.order_id, {
            status: 'failed',
          });
        }
        break;
      }

      case 'order.paid': {
        const order = eventPayload.order.entity;
        const paymentRecord = getPaymentByOrderId(order.id);
        
        if (paymentRecord) {
          updatePaymentByOrderId(order.id, {
            status: 'paid',
            paidAt: new Date().toISOString(),
          });
          
          // TODO: Trigger enrollment activation
          // await enrollUser(paymentRecord.userId, paymentRecord.courseId, paymentRecord.cohort);
        }
        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        const refund = eventPayload.refund.entity;
        const paymentRecord = getPaymentByPaymentId(refund.payment_id);
        
        if (paymentRecord) {
          // Add refund record
          if (!paymentRecord.refunds) {
            paymentRecord.refunds = [];
          }
          paymentRecord.refunds.push({
            id: `ref_${refund.id}`,
            refundId: refund.id,
            paymentId: refund.payment_id,
            amount: refund.amount / 100,
            status: refund.status === 'processed' ? 'processed' : 'pending',
            reason: refund.notes?.comment,
            createdAt: new Date(refund.created_at * 1000).toISOString(),
          });
          
          // Update payment status
          const totalRefunded = (paymentRecord.refunds || []).reduce(
            (sum, r) => sum + r.amount,
            0
          );
          
          if (totalRefunded >= paymentRecord.amount) {
            paymentRecord.status = 'refunded';
          } else {
            paymentRecord.status = 'partially_refunded';
          }
          
          updatePaymentByOrderId(paymentRecord.orderId, paymentRecord);
        }
        break;
      }

      default: {
        const { logger } = await import('@/lib/logger');
        logger.warn('Unhandled webhook event', { event });
      }
    }

    // Mark event as processed
    markWebhookEventProcessed(eventId);

    // Respond quickly (within 5 seconds as per Razorpay docs)
    return NextResponse.json({ received: true, event });
  } catch (error: unknown) {
    const { logger } = await import('@/lib/logger');
    logger.error('Error processing webhook', error);
    // Still return 200 to prevent Razorpay from retrying
    // Log error for manual investigation
    return NextResponse.json(
      { 
        error: 'Webhook processing failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 200 }
    );
  }
}

// Test endpoint for local development (dev only)
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  
  return NextResponse.json({
    message: 'Razorpay webhook endpoint is active',
    instructions: 'POST webhook events to this endpoint',
    note: 'Use ngrok for local testing: ngrok http 3000',
  });
}

