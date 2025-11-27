# 🚀 Quick Fix: Firebase Configuration Error

## The Problem
You're seeing: **"Firebase configuration is missing. Please configure environment variables in Vercel Dashboard."**

## The Solution (5 Steps)

### Step 1: Get Firebase Config Values
1. Go to [Firebase Console](https://console.firebase.google.com/project/foundrverse-71575/settings/general)
2. Scroll to **"Your apps"** section
3. Click on your **web app** (or create one if it doesn't exist)
4. Copy these values from the `firebaseConfig` object:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 2: Get Service Account Key
1. Go to [Service Accounts](https://console.firebase.google.com/project/foundrverse-71575/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Click **"Generate key"** to confirm
4. A JSON file will download - **open it and copy the entire content**

### Step 3: Add Variables to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **FoundrVerse** project
3. Click **Settings** → **Environment Variables**
4. For each variable below, click **"Add New"** and add:

   **Variable Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`  
   **Value:** (paste from Step 1)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

   **Variable Name:** `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  
   **Value:** (paste from Step 1)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

   **Variable Name:** `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  
   **Value:** (paste from Step 1)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

   **Variable Name:** `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  
   **Value:** (paste from Step 1)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

   **Variable Name:** `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  
   **Value:** (paste from Step 1)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

   **Variable Name:** `NEXT_PUBLIC_FIREBASE_APP_ID`  
   **Value:** (paste from Step 1)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

   **Variable Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`  
   **Value:** (paste the ENTIRE JSON from Step 2 - all on one line)  
   **Environments:** ✅ Production, ✅ Preview, ✅ Development  
   **Click Save**

### Step 4: Redeploy
1. Go to **Deployments** tab in Vercel
2. Click **⋯** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-5 minutes for deployment to complete

### Step 5: Verify
1. Visit your site: `https://foundrverse.vercel.app`
2. Go to `/setup-help` to check configuration status
3. Try logging in - the error should be gone!

## ⚠️ Important Notes

- **Don't add quotes** around values in Vercel
- **Check all 3 environments** (Production, Preview, Development) for each variable
- **Redeploy is required** - variables won't work until you redeploy
- **Service Account Key** must be the entire JSON as a single line

## Need More Help?

- Visit `/setup-help` on your site for interactive guide
- See `VERCEL_ENV_SETUP.md` for detailed instructions
- Check Firebase Console if values are missing

## Quick Links

- [Firebase Project Settings](https://console.firebase.google.com/project/foundrverse-71575/settings/general)
- [Service Accounts](https://console.firebase.google.com/project/foundrverse-71575/settings/serviceaccounts/adminsdk)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Setup Help Page](/setup-help)

