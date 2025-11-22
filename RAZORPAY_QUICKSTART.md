# Razorpay Integration - Quick Start

## ✅ Implementation Complete

Full Razorpay payment integration has been implemented with:

- ✅ Order creation API with idempotency
- ✅ Client-side checkout component
- ✅ Server-side signature verification
- ✅ Webhook endpoint with signature verification
- ✅ Admin payments UI with filters and export
- ✅ Capture and refund endpoints
- ✅ Tests and documentation

## 🚀 Quick Setup (3 Steps)

### 1. Install Dependencies

```bash
npm install razorpay csv-stringify @types/csv-stringify
```

### 2. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

Get keys from: https://dashboard.razorpay.com/app/keys

### 3. Test Payment Flow

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/test-payment
3. Use test card: `4111 1111 1111 1111` (any CVV, future expiry)

## 📁 Files Created

### API Routes
- `src/app/api/payments/order/route.ts` - Create order
- `src/app/api/payments/verify/route.ts` - Verify payment
- `src/app/api/payments/capture/route.ts` - Capture payment
- `src/app/api/payments/refund/route.ts` - Create refund
- `src/app/api/webhooks/razorpay/route.ts` - Webhook handler
- `src/app/api/admin/payments/route.ts` - List payments
- `src/app/api/admin/payments/export/route.ts` - Export CSV

### Components
- `src/components/payments/RazorpayCheckout.tsx` - Checkout component

### Pages
- `src/app/payment/page.tsx` - Updated with Razorpay
- `src/app/test-payment/page.tsx` - Test page
- `src/app/admin/payments/page.tsx` - Admin UI

### Utilities & Data
- `src/lib/razorpay-utils.ts` - Signature verification
- `src/data/payments-mock.ts` - Payment data store

### Tests & Docs
- `tests/payments/verify.test.ts` - Unit tests
- `docs/RAZORPAY.md` - Full documentation

## 🧪 Testing Locally

### Test Payment
```bash
# Visit test page
http://localhost:3000/test-payment

# Use test cards:
# Success: 4111 1111 1111 1111
# Failure: 4000 0000 0000 0002
```

### Test Webhooks (with ngrok)
```bash
# Terminal 1: Start app
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000 --host-header=localhost:3000

# Copy ngrok URL and configure in Razorpay Dashboard:
# Settings → Webhooks → Add New Webhook
# URL: https://your-ngrok-url.ngrok.io/api/webhooks/razorpay
# Copy webhook secret to .env.local
```

## 📖 Full Documentation

See `docs/RAZORPAY.md` for complete guide including:
- Architecture overview
- API reference
- Security best practices
- Troubleshooting

## 🔒 Security Notes

- ✅ Secret keys are server-side only
- ✅ Payment signatures verified server-side
- ✅ Webhook signatures verified
- ✅ Idempotency implemented
- ✅ Constant-time signature comparison

## 🎯 Next Steps

1. Get Razorpay test keys from dashboard
2. Add keys to `.env.local`
3. Test payment flow on `/test-payment`
4. Configure webhooks for production
5. Replace mock data store with database

---

**One-line confirmation:** ✅ Razorpay integration implemented — Orders API, client checkout, server verification, webhook endpoint, admin UI, tests and docs added.

