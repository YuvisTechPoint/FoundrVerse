# Razorpay Keys Setup - Quick Guide

## Get Your Razorpay Keys

1. **Go to Razorpay Dashboard:**
   - Visit: https://dashboard.razorpay.com
   - Sign up or log in

2. **Get Test Keys (for development):**
   - Go to: https://dashboard.razorpay.com/app/keys
   - Click on **Test Mode** tab
   - Copy **Key ID** (starts with `rzp_test_...`)
   - Click **Reveal** next to **Key Secret** and copy it

3. **Add to `.env.local`:**
   
   Open `.env.local` and replace the placeholder values:
   
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
   RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_KEY
   ```

4. **Restart Dev Server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

5. **Test Payment:**
   - Go to `/payment` page
   - Click "Pay ₹1,499"
   - Razorpay payment gateway will open
   - Use test card: `4111 1111 1111 1111` (any CVV, future expiry)

## Test Cards

- **Success:** `4111 1111 1111 1111`
- **Failure:** `4000 0000 0000 0002`
- **CVV:** Any 3 digits
- **Expiry:** Any future date

## Need Help?

- Razorpay Dashboard: https://dashboard.razorpay.com
- API Keys: https://dashboard.razorpay.com/app/keys
- Documentation: https://razorpay.com/docs/

