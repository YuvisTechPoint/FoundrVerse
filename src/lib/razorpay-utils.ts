import crypto from 'crypto';

/**
 * Verify Razorpay payment signature
 * @param orderId - Razorpay order ID
 * @param paymentId - Razorpay payment ID
 * @param signature - Signature received from Razorpay
 * @param secret - RAZORPAY_KEY_SECRET
 * @returns true if signature is valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  try {
    if (!orderId || !paymentId || !signature || !secret) {
      console.error('Missing required parameters for signature verification', {
        hasOrderId: !!orderId,
        hasPaymentId: !!paymentId,
        hasSignature: !!signature,
        hasSecret: !!secret,
      });
      return false;
    }

    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    // Ensure buffers are the same length for timingSafeEqual
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      console.error('Signature length mismatch', {
        received: signatureBuffer.length,
        expected: expectedBuffer.length,
      });
      return false;
    }
    
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error: any) {
    console.error('Error in verifyPaymentSignature:', error);
    return false;
  }
}

/**
 * Verify Razorpay webhook signature
 * @param body - Raw request body (string)
 * @param signature - Signature from x-razorpay-signature header
 * @param secret - RAZORPAY_WEBHOOK_SECRET
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  // Constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Generate a unique receipt ID
 */
export function generateReceiptId(prefix = 'rcpt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

