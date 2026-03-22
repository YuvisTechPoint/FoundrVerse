import { NextRequest, NextResponse } from 'next/server';
import {
  isWebhookEventProcessed,
  markWebhookEventProcessed,
  updatePaymentByOrderId,
} from '@/data/payments-mock';
import { verifyWebhook } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyWebhook(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (!event?.id || !event?.type) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Idempotency
    if (isWebhookEventProcessed(event.id)) {
      return NextResponse.json({ success: true, idempotent: true });
    }

    const entity = event.payload?.payment?.entity || event.payload?.order?.entity;

    if (event.type === 'payment.captured' && entity) {
      const orderId = entity.order_id;
      if (orderId) {
        updatePaymentByOrderId(orderId, {
          status: 'paid',
          paymentId: entity.id,
          method: entity.method,
          paidAt: new Date().toISOString(),
        });
      }
    }

    // Mark event processed
    markWebhookEventProcessed(event.id);

    // TODO: trigger enrollment activation / welcome email / WhatsApp invite here

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
