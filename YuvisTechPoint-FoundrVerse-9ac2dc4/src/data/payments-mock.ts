// Mock payments data store
// TODO: Replace with Prisma/database when backend is ready

export interface Payment {
  id: string;
  orderId: string; // Razorpay order ID
  paymentId?: string; // Razorpay payment ID (after payment)
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  userId?: string;
  userEmail?: string;
  courseId?: string;
  cohort?: string;
  receiptId?: string;
  idempotencyKey?: string;
  method?: string; // payment method (card, upi, netbanking, etc.)
  notes?: Record<string, any>;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  refunds?: Refund[];
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  refundId: string; // Razorpay refund ID
  paymentId: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  reason?: string;
  createdAt: string;
}

// In-memory store (replace with database in production)
// Using a Map for better performance and to maintain state across hot reloads in development
const paymentsStore: Payment[] = [];
const processedWebhookEvents = new Set<string>(); // For idempotency

// Add test payment data for development
if (process.env.NODE_ENV === 'development') {
  // This will help test the purchased state
  console.log('Payments Mock Store initialized with', paymentsStore.length, 'payments');
}

export function createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
  const newPayment: Payment = {
    ...payment,
    id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  paymentsStore.push(newPayment);
  console.log('Payment Created:', {
    id: newPayment.id,
    userId: newPayment.userId,
    status: newPayment.status,
    amount: newPayment.amount,
    totalPayments: paymentsStore.length
  });
  return newPayment;
}

export function getPaymentById(id: string): Payment | undefined {
  return paymentsStore.find((p) => p.id === id);
}

export function getPaymentByOrderId(orderId: string): Payment | undefined {
  return paymentsStore.find((p) => p.orderId === orderId);
}

export function getPaymentByPaymentId(paymentId: string): Payment | undefined {
  return paymentsStore.find((p) => p.paymentId === paymentId);
}

export function updatePayment(id: string, updates: Partial<Payment>): Payment | null {
  const index = paymentsStore.findIndex((p) => p.id === id);
  if (index === -1) {
    console.log('Payment not found for update:', id);
    return null;
  }
  
  paymentsStore[index] = {
    ...paymentsStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  console.log('Payment Updated:', {
    id: paymentsStore[index].id,
    userId: paymentsStore[index].userId,
    status: paymentsStore[index].status,
    paymentId: paymentsStore[index].paymentId,
  });
  
  return paymentsStore[index];
}

export function updatePaymentByOrderId(orderId: string, updates: Partial<Payment>): Payment | null {
  const payment = getPaymentByOrderId(orderId);
  if (!payment) return null;
  return updatePayment(payment.id, updates);
}

export function getAllPayments(): Payment[] {
  return [...paymentsStore];
}

export function getPaymentsByStatus(status: Payment['status']): Payment[] {
  return paymentsStore.filter((p) => p.status === status);
}

export function getPaymentsByUserId(userId: string): Payment[] {
  const userPayments = paymentsStore.filter((p) => p.userId === userId);
  console.log(`Getting payments for user ${userId}:`, {
    count: userPayments.length,
    payments: userPayments.map(p => ({
      id: p.id,
      status: p.status,
      amount: p.amount,
      paidAt: p.paidAt,
      userId: p.userId,
      userEmail: p.userEmail
    }))
  });
  return userPayments;
}

export function getPaymentsByEmail(email: string): Payment[] {
  const emailPayments = paymentsStore.filter((p) => p.userEmail === email);
  console.log(`Getting payments for email ${email}:`, {
    count: emailPayments.length,
    payments: emailPayments.map(p => ({
      id: p.id,
      status: p.status,
      amount: p.amount,
      paidAt: p.paidAt,
      userId: p.userId,
      userEmail: p.userEmail
    }))
  });
  return emailPayments;
}

// Backfill email for payments that are missing it
export function backfillPaymentEmail(paymentId: string, email: string): Payment | null {
  const payment = getPaymentById(paymentId);
  if (!payment) return null;
  
  if (!payment.userEmail && email) {
    return updatePayment(paymentId, { userEmail: email });
  }
  
  return payment;
}

// Backfill email for all payments by userId that are missing email
export function backfillPaymentsEmailByUserId(userId: string, email: string): number {
  const userPayments = getPaymentsByUserId(userId);
  let updated = 0;
  
  for (const payment of userPayments) {
    if (!payment.userEmail && email) {
      updatePayment(payment.id, { userEmail: email });
      updated++;
    }
  }
  
  if (updated > 0) {
    console.log(`Backfilled email for ${updated} payments for user ${userId}`);
  }
  
  return updated;
}

export function addRefund(paymentId: string, refund: Omit<Refund, 'id' | 'createdAt'>): Refund {
  const payment = getPaymentByPaymentId(paymentId);
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  const newRefund: Refund = {
    ...refund,
    id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  if (!payment.refunds) {
    payment.refunds = [];
  }
  payment.refunds.push(newRefund);
  
  // Update payment status
  if (refund.amount === payment.amount) {
    payment.status = 'refunded';
  } else {
    payment.status = 'partially_refunded';
  }
  
  updatePayment(payment.id, payment);
  return newRefund;
}

// Webhook event idempotency
export function isWebhookEventProcessed(eventId: string): boolean {
  return processedWebhookEvents.has(eventId);
}

export function markWebhookEventProcessed(eventId: string): void {
  processedWebhookEvents.add(eventId);
}

// Check if order already exists (for idempotency)
export function findPaymentByReceiptOrIdempotency(
  receiptId?: string,
  idempotencyKey?: string
): Payment | undefined {
  if (receiptId) {
    return paymentsStore.find((p) => p.receiptId === receiptId);
  }
  if (idempotencyKey) {
    return paymentsStore.find((p) => p.idempotencyKey === idempotencyKey);
  }
  return undefined;
}

