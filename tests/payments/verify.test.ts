/**
 * Unit tests for Razorpay signature verification
 * Run with: npm test or jest tests/payments/verify.test.ts
 */

import { verifyPaymentSignature, verifyWebhookSignature } from '@/lib/razorpay-utils';

describe('Razorpay Signature Verification', () => {
  const secret = 'test_secret_key_12345';

  describe('verifyPaymentSignature', () => {
    it('should verify a valid payment signature', () => {
      const orderId = 'order_test123';
      const paymentId = 'pay_test456';
      
      // Generate expected signature manually using crypto
      const crypto = require('crypto');
      const payload = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const isValid = verifyPaymentSignature(
        orderId,
        paymentId,
        expectedSignature,
        secret
      );

      expect(isValid).toBe(true);
    });

    it('should reject an invalid payment signature', () => {
      const orderId = 'order_test123';
      const paymentId = 'pay_test456';
      const invalidSignature = 'invalid_signature_here';

      const isValid = verifyPaymentSignature(
        orderId,
        paymentId,
        invalidSignature,
        secret
      );

      expect(isValid).toBe(false);
    });

    it('should reject signature with wrong order ID', () => {
      const orderId = 'order_test123';
      const paymentId = 'pay_test456';
      const wrongOrderId = 'order_wrong789';
      
      const crypto = require('crypto');
      const payload = `${orderId}|${paymentId}`;
      const correctSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      // Try to verify with wrong order ID
      const isValid = verifyPaymentSignature(
        wrongOrderId,
        paymentId,
        correctSignature,
        secret
      );

      expect(isValid).toBe(false);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify a valid webhook signature', () => {
      const body = JSON.stringify({
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              amount: 10000,
            },
          },
        },
      });

      // Generate expected signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      const isValid = verifyWebhookSignature(body, expectedSignature, secret);

      expect(isValid).toBe(true);
    });

    it('should reject an invalid webhook signature', () => {
      const body = JSON.stringify({
        event: 'payment.captured',
        payload: {},
      });
      const invalidSignature = 'invalid_webhook_signature';

      const isValid = verifyWebhookSignature(body, invalidSignature, secret);

      expect(isValid).toBe(false);
    });

    it('should reject signature for modified body', () => {
      const originalBody = JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: 'pay_test123' } } },
      });
      const modifiedBody = JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: 'pay_different' } } },
      });

      const crypto = require('crypto');
      const signatureForOriginal = crypto
        .createHmac('sha256', secret)
        .update(originalBody)
        .digest('hex');

      // Try to verify modified body with original signature
      const isValid = verifyWebhookSignature(
        modifiedBody,
        signatureForOriginal,
        secret
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Real Razorpay signature examples', () => {
    // These are example values that match Razorpay's signature format
    it('should handle real-world signature format', () => {
      const orderId = 'order_MN1234567890';
      const paymentId = 'pay_MN9876543210';
      const secret = 'rzp_test_secret_key_example';

      const crypto = require('crypto');
      const payload = `${orderId}|${paymentId}`;
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const isValid = verifyPaymentSignature(
        orderId,
        paymentId,
        signature,
        secret
      );

      expect(isValid).toBe(true);
      expect(signature).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex format
    });
  });
});

