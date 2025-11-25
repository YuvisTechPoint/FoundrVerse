# 🚀 Quick Vercel Setup Guide

This guide will help you quickly set up all environment variables in Vercel.

## Option 1: Using Vercel CLI (Recommended - Automated)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Run the Setup Script

**For Windows (PowerShell):**
```powershell
.\setup-vercel-env.ps1
```

**For Mac/Linux:**
```bash
chmod +x setup-vercel-env.sh
./setup-vercel-env.sh
```

The script will prompt you for each value and automatically add them to Vercel.

---

## Option 2: Manual Setup via Vercel Dashboard

### Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **foundrverse-71575**
3. Go to **Project Settings** (gear icon) → **General** tab
4. Scroll down to **Your apps** section
5. Click on your web app (or create one if needed)
6. Copy the config values

### Step 2: Get Service Account Key

1. In Firebase Console, go to **Project Settings** → **Service Accounts** tab
2. Click **Generate new private key**
3. Download the JSON file
4. Open the file and copy the entire JSON content
5. Convert it to a single line (remove line breaks, but keep `\n` in the `private_key` field)

### Step 3: Add Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **FoundrVerse** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** for each variable below

### Required Variables (Copy & Paste)

Add these one by one in Vercel:

#### Firebase Client Config

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: [From Firebase Console - Your API Key]
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: foundrverse-71575.firebaseapp.com
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: foundrverse-71575
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: foundrverse-71575.firebasestorage.app
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: [From Firebase Console - Your Sender ID]
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: [From Firebase Console - Your App ID]
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (Optional)
Value: [From Firebase Console - Your Measurement ID]
Environments: ✅ Production, ✅ Preview
```

#### Firebase Admin (Service Account)

```
Name: FIREBASE_SERVICE_ACCOUNT_KEY
Value: [Paste entire service-account.json as single line]
Environments: ✅ Production, ✅ Preview
```

**Important:** The value should look like:
```
{"type":"service_account","project_id":"foundrverse-71575","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

#### Razorpay Config

```
Name: RAZORPAY_KEY_ID
Value: [From Razorpay Dashboard]
Environments: ✅ Production, ✅ Preview

Name: RAZORPAY_KEY_SECRET
Value: [From Razorpay Dashboard]
Environments: ✅ Production, ✅ Preview

Name: RAZORPAY_WEBHOOK_SECRET (Optional)
Value: [From Razorpay Dashboard]
Environments: ✅ Production, ✅ Preview
```

#### Session Secret

```
Name: SESSION_COOKIE_SECRET
Value: [Generate a random 32+ character string]
Environments: ✅ Production, ✅ Preview
```

**Generate secret:**
- Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- Mac/Linux: `openssl rand -base64 32`

---

## Step 4: Redeploy

After adding all variables:

1. Go to **Deployments** tab in Vercel
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Step 5: Verify

1. Visit your deployed site: `https://foundrverse.vercel.app`
2. Try to sign up or log in
3. The Firebase error should be gone
4. Google Sign-In should work

---

## Need Help?

- 📖 See `VERCEL_ENV_SETUP.md` for detailed instructions
- 📖 See `FIREBASE_SETUP_CHECKLIST.md` for Firebase-specific setup
- 🔍 Check Vercel deployment logs if errors persist

---

## Quick Checklist

- [ ] All Firebase `NEXT_PUBLIC_*` variables added
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` added (as single-line JSON)
- [ ] Razorpay variables added (if using payments)
- [ ] `SESSION_COOKIE_SECRET` generated and added
- [ ] All variables set for **Production** and **Preview** environments
- [ ] Project redeployed
- [ ] Tested signup/login on deployed site

---

**That's it! Your deployment should now work correctly.** 🎉

