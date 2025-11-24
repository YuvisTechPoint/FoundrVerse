# Vercel Environment Variables Setup Guide

This guide will help you configure Firebase and other required environment variables in Vercel for your FoundrVerse deployment.

> **⚠️ Important:** After adding environment variables, you **must redeploy** your project for changes to take effect.

## Required Environment Variables

You need to add these environment variables in your Vercel project settings:

### Firebase Client Configuration (Required for Authentication)

1. **NEXT_PUBLIC_FIREBASE_API_KEY**
   - Get from: Firebase Console → Project Settings → General → Your apps → Web app config
   - Example: `AIzaSyCYm9zNzLIAfNlgNdjQ_em89UUy_dMaXU4`

2. **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
   - Format: `{project-id}.firebaseapp.com`
   - Example: `foundrverse-71575.firebaseapp.com`

3. **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
   - Your Firebase project ID
   - Example: `foundrverse-71575`

4. **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
   - Format: `{project-id}.appspot.com` or `{project-id}.firebasestorage.app`
   - Example: `foundrverse-71575.firebasestorage.app`

5. **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
   - Get from Firebase Console
   - Example: `413817556532`

6. **NEXT_PUBLIC_FIREBASE_APP_ID**
   - Get from Firebase Console
   - Example: `1:413817556532:web:bcb4edbfe1fde947f30461`

7. **NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID** (Optional)
   - For Firebase Analytics
   - Example: `G-YRLHCZT889`

### Firebase Admin Configuration (Required for Server-side Auth)

8. **FIREBASE_SERVICE_ACCOUNT_KEY**
   - Get from: Firebase Console → Project Settings → Service Accounts → Generate new private key
   - Format: Copy the entire JSON and paste it as a single-line string (escape newlines)
   - Or use: **FIREBASE_SERVICE_ACCOUNT_PATH** pointing to a file (not recommended for Vercel)

### Razorpay Configuration (Required for Payments)

9. **RAZORPAY_KEY_ID**
   - Get from: Razorpay Dashboard → Settings → API Keys
   - Example: `rzp_test_xxxxxxxxxxxxx`

10. **RAZORPAY_KEY_SECRET**
    - Get from: Razorpay Dashboard → Settings → API Keys
    - **Keep this secret!** Never commit to Git

11. **RAZORPAY_WEBHOOK_SECRET** (Optional but Recommended)
    - Get from: Razorpay Dashboard → Settings → Webhooks → Create webhook
    - Used to verify webhook requests from Razorpay

### Session Configuration

12. **SESSION_COOKIE_SECRET**
    - Generate a random 32+ character string
    - You can generate one using: `openssl rand -base64 32`
    - Example: `your-super-secret-32-chars-minimum-random-string`

## How to Add Environment Variables in Vercel

### Step 1: Go to Vercel Project Settings

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **FoundrVerse** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the sidebar

### Step 2: Add Each Variable

1. Click **Add New**
2. Enter the **Name** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. Enter the **Value** (your actual value)
4. Select environments where it applies:
   - ✅ **Production** (for production deployments)
   - ✅ **Preview** (for pull request previews)
   - ✅ **Development** (for local development via Vercel CLI)

5. Click **Save**

### Step 3: Repeat for All Variables

Add all the variables listed above. Make sure to:
- Use exact variable names (case-sensitive)
- Don't include quotes around values
- For JSON values (like `FIREBASE_SERVICE_ACCOUNT_KEY`), paste the entire JSON as a single string

### Step 4: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeployment

## Verification

After redeploying, verify that:

1. ✅ The Firebase error no longer appears
2. ✅ Google Sign-In button works
3. ✅ Payment processing works (test with Razorpay test mode)
4. ✅ Admin dashboard authentication works

## Troubleshooting

### "Firebase not configured" Error

- ✅ Check all `NEXT_PUBLIC_FIREBASE_*` variables are set
- ✅ Ensure values don't have extra spaces or quotes
- ✅ Redeploy after adding variables

### "Google sign-in failed" Error

- ✅ Check Firebase Console → Authentication → Sign-in method → Google is enabled
- ✅ Add your Vercel domain to Firebase authorized domains:
  - Go to Firebase Console → Authentication → Settings → Authorized domains
  - Add: `your-domain.vercel.app` and `www.your-domain.com` (if using custom domain)

### Payment Errors

- ✅ Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- ✅ Ensure Razorpay webhook URL is configured:
  - Format: `https://your-domain.vercel.app/api/webhooks/razorpay`
  - Add this URL in Razorpay Dashboard → Settings → Webhooks

### Admin Dashboard Not Working

- ✅ Check `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly
- ✅ Ensure the service account JSON is properly formatted (single-line string)
- ✅ Verify service account has proper permissions in Firebase

## Quick Copy Checklist

Copy these variable names and add them one by one in Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)
FIREBASE_SERVICE_ACCOUNT_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET (optional)
SESSION_COOKIE_SECRET
```

## Common Issues After Deployment

### Firebase Error Still Appears

If you see "Google sign-in is currently unavailable" or "Authentication service is temporarily unavailable":

1. ✅ **Verify all Firebase variables are set** - Check that all 7 `NEXT_PUBLIC_FIREBASE_*` variables are present
2. ✅ **Check for typos** - Variable names are case-sensitive
3. ✅ **No quotes needed** - Don't wrap values in quotes
4. ✅ **Redeploy required** - After adding variables, trigger a new deployment
5. ✅ **Check Firebase Console** - Ensure Google Authentication is enabled

### How to Redeploy

**Option 1: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

**Option 2: Via Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Testing Environment Variables

After deployment, you can test if variables are set correctly:

1. Visit your deployed site
2. Try to sign in with Google
3. If it works → ✅ Variables are configured correctly
4. If you see error → Check Vercel logs and verify variables

### Viewing Deployment Logs

1. Go to **Deployments** tab in Vercel
2. Click on a deployment
3. Click **Build Logs** or **Function Logs**
4. Look for Firebase initialization errors

## Need Help?

- Check `docs/FIREBASE_AUTH.md` for Firebase setup details
- Check `docs/RAZORPAY.md` for Razorpay setup details
- Review Vercel documentation: https://vercel.com/docs/concepts/projects/environment-variables
- Check Firebase Console: https://console.firebase.google.com

