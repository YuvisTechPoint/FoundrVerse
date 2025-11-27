// Payment database service
// Replaces payments-mock.ts

import { collections, dbHelpers } from '../index';
import type { Payment, Refund } from '../types';
import { logger } from '@/lib/logger';

export async function createPayment(
  payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Payment> {
  try {
    const docData = dbHelpers.createDoc(payment);
    const docRef = await collections.payments().add(docData);
    
    const newPayment: Payment = {
      ...docData,
      id: docRef.id,
    };
    
    logger.info('Payment created in database', {
      paymentId: newPayment.id,
      userId: newPayment.userId,
      orderId: newPayment.orderId,
    });
    
    return newPayment;
  } catch (error: any) {
    logger.error('Failed to create payment', error);
    throw error;
  }
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  try {
    const doc = await collections.payments().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as Payment;
  } catch (error: any) {
    logger.error('Failed to get payment by ID', error);
    throw error;
  }
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
  try {
    const snapshot = await collections.payments()
      .where('orderId', '==', orderId)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0]!;
    return {
      id: doc.id,
      ...doc.data(),
    } as Payment;
  } catch (error: any) {
    logger.error('Failed to get payment by order ID', error);
    throw error;
  }
}

export async function getPaymentByPaymentId(paymentId: string): Promise<Payment | null> {
  try {
    const snapshot = await collections.payments()
      .where('paymentId', '==', paymentId)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0]!;
    return {
      id: doc.id,
      ...doc.data(),
    } as Payment;
  } catch (error: any) {
    logger.error('Failed to get payment by payment ID', error);
    throw error;
  }
}

export async function updatePayment(
  id: string,
  updates: Partial<Payment>
): Promise<Payment | null> {
  try {
    const docRef = collections.payments().doc(id);
    const updateData = dbHelpers.updateDoc(updates);
    
    await docRef.update(updateData);
    
    const updated = await getPaymentById(id);
    logger.info('Payment updated in database', {
      paymentId: id,
      updates: Object.keys(updates),
    });
    
    return updated;
  } catch (error: any) {
    logger.error('Failed to update payment', error);
    throw error;
  }
}

export async function updatePaymentByOrderId(
  orderId: string,
  updates: Partial<Payment>
): Promise<Payment | null> {
  const payment = await getPaymentByOrderId(orderId);
  if (!payment) return null;
  return updatePayment(payment.id, updates);
}

export async function getAllPayments(): Promise<Payment[]> {
  try {
    const snapshot = await collections.payments()
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Payment));
  } catch (error: any) {
    logger.error('Failed to get all payments', error);
    throw error;
  }
}

export async function getPaymentsByStatus(status: Payment['status']): Promise<Payment[]> {
  try {
    const snapshot = await collections.payments()
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Payment));
  } catch (error: any) {
    logger.error('Failed to get payments by status', error);
    throw error;
  }
}

export async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  try {
    const snapshot = await collections.payments()
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Payment));
  } catch (error: any) {
    logger.error('Failed to get payments by user ID', error);
    throw error;
  }
}

export async function getPaymentsByEmail(email: string): Promise<Payment[]> {
  try {
    const snapshot = await collections.payments()
      .where('userEmail', '==', email)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Payment));
  } catch (error: any) {
    logger.error('Failed to get payments by email', error);
    throw error;
  }
}

export async function addRefund(
  paymentId: string,
  refund: Omit<Refund, 'id' | 'createdAt'>
): Promise<Refund> {
  try {
    const payment = await getPaymentByPaymentId(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    const newRefund: Refund = {
      ...refund,
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: dbHelpers.timestamp(),
    };
    
    const refunds = payment.refunds || [];
    refunds.push(newRefund);
    
    // Update payment status
    let newStatus: Payment['status'] = payment.status;
    if (refund.amount === payment.amount) {
      newStatus = 'refunded';
    } else if (refund.amount < payment.amount) {
      newStatus = 'partially_refunded';
    }
    
    await updatePayment(payment.id, {
      refunds,
      status: newStatus,
    });
    
    logger.info('Refund added to payment', {
      paymentId: payment.id,
      refundId: newRefund.id,
    });
    
    return newRefund;
  } catch (error: any) {
    logger.error('Failed to add refund', error);
    throw error;
  }
}

export async function findPaymentByReceiptOrIdempotency(
  receiptId?: string,
  idempotencyKey?: string
): Promise<Payment | null> {
  try {
    if (receiptId) {
      const snapshot = await collections.payments()
        .where('receiptId', '==', receiptId)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]!;
        return {
          id: doc.id,
          ...doc.data(),
        } as Payment;
      }
    }
    
    if (idempotencyKey) {
      const snapshot = await collections.payments()
        .where('idempotencyKey', '==', idempotencyKey)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]!;
        return {
          id: doc.id,
          ...doc.data(),
        } as Payment;
      }
    }
    
    return null;
  } catch (error: any) {
    logger.error('Failed to find payment by receipt/idempotency', error);
    throw error;
  }
}

// Webhook event tracking
export async function isWebhookEventProcessed(eventId: string): Promise<boolean> {
  try {
    const doc = await collections.webhookEvents().doc(eventId).get();
    return doc.exists && (doc.data()?.processed === true);
  } catch (error: any) {
    logger.error('Failed to check webhook event', error);
    return false;
  }
}

export async function markWebhookEventProcessed(eventId: string): Promise<void> {
  try {
    await collections.webhookEvents().doc(eventId).set({
      id: eventId,
      processed: true,
      processedAt: dbHelpers.timestamp(),
      createdAt: dbHelpers.timestamp(),
    });
  } catch (error: any) {
    logger.error('Failed to mark webhook event as processed', error);
    throw error;
  }
}

