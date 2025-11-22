# Razorpay Payment Integration Guide

This document provides a complete guide for setting up and using the Razorpay payment integration in this Next.js application.

## Table of Contents

1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [Architecture Overview](#architecture-overview)
4. [API Endpoints](#api-endpoints)
5. [Client Components](#client-components)
6. [Webhook Configuration](#webhook-configuration)
7. [Testing](#testing)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

## Setup

### 1. Install Dependencies

The required packages are already installed:

```bash
npm install razorpay csv-stringify @types/csv-stringify
```

### 2. Get Razorpay Keys

1. Sign up or log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **API Keys**
3. Generate test keys (for development) or live keys (for production)
4. Copy the **Key ID** and **Key Secret**

### 3. Configure Environment Variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Fill in your Razorpay credentials:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**⚠️ IMPORTANT:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public key for client-side checkout | Yes |
| `RAZORPAY_KEY_ID` | Key ID for server-side API calls | Yes |
| `RAZORPAY_KEY_SECRET` | Secret key for server-side API calls | Yes |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for webhook signature verification | Yes (for webhooks) |

## Architecture Overview

The integration follows this flow:

```
1. Client → POST /api/payments/order
   ↓
2. Server creates Razorpay order
   ↓
3. Client opens Razorpay Checkout modal
   ↓
4. User completes payment
   ↓
5. Client → POST /api/payments/verify (with signature)
   ↓
6. Server verifies signature and marks payment as paid
   ↓
7. Webhook → POST /api/webhooks/razorpay (optional, for reliability)
```

### Payment States

- `created` - Order created, payment pending
- `authorized` - Payment authorized (if manual capture)
- `captured` - Payment captured
- `paid` - Payment completed successfully
- `failed` - Payment failed
- `refunded` - Payment refunded
- `partially_refunded` - Partial refund issued

## API Endpoints

### Create Order

**POST** `/api/payments/order`

Creates a Razorpay order and stores payment record.

**Request Body:**
```json
{
  "amount": 1499,
  "currency": "INR",
  "userId": "user_123",
  "userEmail": "user@example.com",
  "courseId": "course_123",
  "cohort": "Batch 2024-01",
  "metadata": {},
  "receiptId": "optional_receipt_id",
  "idempotency_key": "optional_idempotency_key"
}
```

**Response:**
```json
{
  "orderId": "order_MN1234567890",
  "amount": 1499,
  "currency": "INR",
  "receipt": "rcpt_1234567890",
  "status": "created",
  "id": "pay_internal_id"
}
```

### Verify Payment

**POST** `/api/payments/verify`

Verifies payment signature after successful checkout.

**Request Body:**
```json
{
  "razorpay_order_id": "order_MN1234567890",
  "razorpay_payment_id": "pay_MN9876543210",
  "razorpay_signature": "signature_hash_here"
}
```

**Response:**
```json
{
  "verified": true,
  "paymentId": "pay_MN9876543210",
  "orderId": "order_MN1234567890",
  "status": "paid",
  "message": "Payment verified successfully. Enrollment activated."
}
```

### Webhook Endpoint

**POST** `/api/webhooks/razorpay`

Handles Razorpay webhook events. Automatically verifies signature.

**Supported Events:**
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `order.paid`
- `refund.created`
- `refund.processed`

### Capture Payment

**POST** `/api/payments/capture`

Manually capture an authorized payment (if `payment_capture=0` was used).

**Request Body:**
```json
{
  "paymentId": "pay_MN9876543210",
  "amount": 1499  // optional, defaults to full amount
}
```

### Create Refund

**POST** `/api/payments/refund`

Create a refund for a payment.

**Request Body:**
```json
{
  "paymentId": "pay_MN9876543210",
  "amount": 1499,  // optional, defaults to full refund
  "reason": "Customer request",
  "notes": {}
}
```

### Admin Endpoints

**GET** `/api/admin/payments`

Fetch payments with pagination, search, and filters.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 25)
- `search` - Search term
- `status` - Filter by status

**GET** `/api/admin/payments/export`

Export all payments as CSV.

## Client Components

### RazorpayCheckout Component

A reusable component for initiating Razorpay payments.

**Usage:**
```tsx
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";

<RazorpayCheckout
  options={{
    amount: 1499,
    currency: "INR",
    name: "FoundrVerse",
    description: "Course Enrollment",
    prefill: {
      email: "user@example.com",
      contact: "9876543210",
      name: "John Doe",
    },
    onSuccess: (paymentId, orderId) => {
      console.log("Payment successful!", paymentId);
    },
    onError: (error) => {
      console.error("Payment failed:", error);
    },
  }}
  className="btn-primary"
>
  Pay Now
</RazorpayCheckout>
```

## Webhook Configuration

### Setting Up Webhooks Locally

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com
   ```

2. **Start your Next.js app:**
   ```bash
   npm run dev
   ```

3. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000 --host-header=localhost:3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure in Razorpay Dashboard:**
   - Go to **Settings** → **Webhooks**
   - Click **Add New Webhook**
   - Enter URL: `https://your-ngrok-url.ngrok.io/api/webhooks/razorpay`
   - Select events:
     - `payment.authorized`
     - `payment.captured`
     - `payment.failed`
     - `order.paid`
     - `refund.created`
     - `refund.processed`
   - Save and copy the **Webhook Secret**
   - Add to `.env.local`: `RAZORPAY_WEBHOOK_SECRET=whsec_xxx`

### Production Webhook Setup

1. Deploy your application to production
2. Configure webhook URL in Razorpay Dashboard:
   - URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Select all required events
   - Copy webhook secret to production environment variables

## Testing

### Manual Testing

1. **Test Payment Flow:**
   - Navigate to `/payment` or `/test-payment`
   - Click "Pay Now"
   - Use Razorpay test cards:
     - **Success:** `4111 1111 1111 1111`
     - **Failure:** `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Test Webhook Locally:**
   - Use Razorpay Dashboard → **Webhooks** → **Send Test Webhook**
   - Or use the test endpoint: `POST /api/webhooks/razorpay/test` (dev only)

### Unit Tests

Run signature verification tests:

```bash
# If Jest is configured
npm test tests/payments/verify.test.ts
```

### Test Cards

Razorpay provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4111 1111 1111 1111` | Successful payment |
| `4000 0000 0000 0002` | Payment failure |
| `5104 0600 0000 0008` | 3D Secure authentication |

Full list: https://razorpay.com/docs/payments/test-cards/

## Security Best Practices

### ✅ DO

- ✅ Keep `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` server-side only
- ✅ Always verify payment signatures server-side
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on webhook endpoint
- ✅ Use idempotency keys to prevent duplicate orders
- ✅ Store webhook event IDs to prevent duplicate processing
- ✅ Use constant-time comparison for signature verification
- ✅ Validate and sanitize all user inputs

### ❌ DON'T

- ❌ Never expose secret keys in client-side code
- ❌ Never trust client-side payment verification alone
- ❌ Never skip signature verification
- ❌ Never commit `.env.local` or secrets to version control
- ❌ Never process payments without server-side verification

## Troubleshooting

### Payment Modal Not Opening

- Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Verify Razorpay script is loaded (check browser console)
- Ensure you're using HTTPS in production (or localhost for development)

### Signature Verification Failing

- Verify `RAZORPAY_KEY_SECRET` matches the key used to create the order
- Ensure order ID and payment ID are correct
- Check that signature is not modified (no URL encoding issues)

### Webhook Not Receiving Events

- Verify webhook URL is accessible (use ngrok for local testing)
- Check webhook secret is correct
- Ensure webhook endpoint returns 200 OK quickly (< 5 seconds)
- Check Razorpay Dashboard → Webhooks → Logs for delivery status

### Order Creation Failing

- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Check amount is in paise (multiply by 100)
- Ensure currency code is valid (e.g., "INR")
- Check Razorpay account is active

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)
- [Razorpay Checkout Integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Webhook Events Reference](https://razorpay.com/docs/webhooks/)

## Support

For issues specific to this integration, check the code comments or create an issue in the repository.

For Razorpay-specific issues, contact [Razorpay Support](https://razorpay.com/support/).

