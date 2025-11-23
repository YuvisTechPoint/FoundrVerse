# 🚀 Vercel Deployment Guide

Complete guide to deploy FoundrVerse on Vercel.

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **GitHub Repository** - Your code must be pushed to GitHub (already done ✅)
3. **Firebase Project** - Set up Firebase project with authentication enabled
4. **Razorpay Account** - Set up Razorpay account (optional, for payments)

---

## 🎯 Quick Deploy (5 Steps)

### Step 1: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository: `YuvisTechPoint/FoundrVerse`
5. Click **"Import"**

### Step 2: Configure Project Settings

Vercel will auto-detect Next.js. Keep these settings:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 3: Set Environment Variables

**⚠️ IMPORTANT**: Add all environment variables before deploying!

Click **"Environment Variables"** and add:

#### Firebase Client Configuration (NEXT_PUBLIC_*)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional
```

#### Firebase Admin (Service Account)

**Important**: Use the inline JSON string format for Vercel:

1. Open your `service-account.json` file
2. Copy the entire JSON content
3. Remove all line breaks (make it a single line)
4. Escape quotes if needed
5. Add to Vercel as:

```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

**⚠️ Make sure to keep `\n` in the private_key field!**

#### Razorpay Configuration

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### Application Configuration

```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
SESSION_COOKIE_SECRET=your_random_32_char_secret
```

**💡 Tip**: Generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 4: Set Environment Scope

For each environment variable:
- ✅ **Production** - Required
- ✅ **Preview** - Recommended (for branch previews)
- ✅ **Development** - Optional

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

---

## 🔧 Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication → Settings → Authorized domains**
4. Add your Vercel domain:
   - `your-project.vercel.app`
   - `www.your-project.vercel.app` (if using custom domain)
   - Your custom domain (if configured)

### 2. Update Razorpay Webhook URL

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings → Webhooks**
3. Add/Update webhook:
   - **URL**: `https://your-project.vercel.app/api/webhooks/razorpay`
   - **Events**: Select all payment events
4. Copy the webhook secret and add to Vercel environment variables:
   - `RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`

### 3. Update NEXT_PUBLIC_APP_URL

After deployment, update the environment variable:
- Go to **Vercel Dashboard → Settings → Environment Variables**
- Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
- Redeploy or wait for auto-redeploy

---

## 🎨 Custom Domain Setup (Optional)

### Add Custom Domain in Vercel

1. Go to **Project Settings → Domains**
2. Enter your domain (e.g., `foundrverse.com`)
3. Follow the DNS configuration instructions
4. Update Firebase Authorized Domains with your custom domain
5. Update `NEXT_PUBLIC_APP_URL` environment variable

---

## 🔄 Automatic Deployments

Vercel automatically deploys:

- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches (creates preview URLs)
- **Manual**: You can trigger deploys from the dashboard

---

## 🐛 Troubleshooting

### Build Failures

**Error**: "Missing environment variables"
- **Solution**: Check all required env vars are set in Vercel dashboard

**Error**: "Firebase initialization failed"
- **Solution**: 
  - Verify Firebase env vars are correct
  - Check `FIREBASE_SERVICE_ACCOUNT_KEY` format (must be valid JSON string)
  - Ensure private_key has `\n` preserved

**Error**: "Razorpay keys not configured"
- **Solution**: Verify Razorpay env vars are set (if using payments)

### Runtime Errors

**Error**: "Firebase auth domain not authorized"
- **Solution**: Add your Vercel domain to Firebase Authorized Domains

**Error**: "Payment verification failed"
- **Solution**: 
  - Verify Razorpay keys are correct
  - Check webhook secret matches Razorpay dashboard
  - Ensure webhook URL is correctly configured

### Service Account Issues

If `FIREBASE_SERVICE_ACCOUNT_KEY` doesn't work:

1. Convert JSON to single-line string:
   ```bash
   # On Linux/Mac
   cat service-account.json | jq -c
   
   # Or manually:
   # Copy entire JSON, remove line breaks, keep \n in private_key
   ```

2. Verify format in Vercel:
   - Should start with `{"type":"service_account",...}`
   - Should be valid JSON (test with online JSON validator)

3. Alternative: Use Vercel Secrets (recommended):
   - Store entire service-account.json content as Vercel Secret
   - Reference in environment variable (if your code supports it)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

- **Analytics**: View page views, performance metrics
- **Speed Insights**: Core Web Vitals tracking
- **Logs**: Real-time function logs and errors

Access from **Vercel Dashboard → Analytics**

### Firebase Analytics

If you configured `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`:
- View analytics in Firebase Console
- Track user engagement, events, conversions

---

## 🔐 Security Checklist

- ✅ All environment variables set in Vercel (not in code)
- ✅ `service-account.json` NOT committed to git
- ✅ `.env.local` in `.gitignore`
- ✅ Firebase authorized domains updated
- ✅ Razorpay webhook secret configured
- ✅ `SESSION_COOKIE_SECRET` is strong and random
- ✅ Using production Razorpay keys (not test keys) in production

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting Alternatives](https://firebase.google.com/docs/hosting)
- [Razorpay Webhooks](https://razorpay.com/docs/webhooks/)

---

## 🆘 Need Help?

1. Check Vercel deployment logs in the dashboard
2. Review Firebase Console for authentication issues
3. Check Razorpay Dashboard for webhook events
4. Review this guide's troubleshooting section
5. Check project README.md for more info

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Firebase authorized domains updated
- [ ] Razorpay webhook URL configured
- [ ] `NEXT_PUBLIC_APP_URL` set correctly
- [ ] Test authentication flow
- [ ] Test payment flow (if applicable)
- [ ] Verify admin dashboard access
- [ ] Check build logs for warnings
- [ ] Test on mobile devices
- [ ] Configure custom domain (optional)

---

**Happy Deploying! 🚀**

