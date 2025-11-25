# 🔥 Quick Fix: Firebase Configuration in Vercel

**Follow these exact steps to fix the Firebase error on your deployed site.**

## ⚡ Step-by-Step Instructions

### Step 1: Get Your Firebase Credentials

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/project/foundrverse-71575/settings/general

2. **Find Your Web App Config:**
   - Scroll down to **"Your apps"** section
   - Click on your web app (or create one if you don't have one)
   - You'll see a config object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "foundrverse-71575.firebaseapp.com",
     projectId: "foundrverse-71575",
     storageBucket: "foundrverse-71575.firebasestorage.app",
     messagingSenderId: "413817556532",
     appId: "1:413817556532:web:..."
   };
   ```
   - **Copy each value** - you'll need them in Step 2

3. **Get Service Account Key:**
   - Go to: https://console.firebase.google.com/project/foundrverse-71575/settings/serviceaccounts/adminsdk
   - Click **"Generate new private key"**
   - Download the JSON file
   - Open it and copy the **entire JSON content**
   - Convert it to a **single line** (remove line breaks, but keep `\n` in the `private_key` field)

---

### Step 2: Add Variables in Vercel

1. **Open Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Click on your **FoundrVerse** project

2. **Go to Environment Variables:**
   - Click **"Settings"** tab (left sidebar)
   - Click **"Environment Variables"** (in the Settings menu)

3. **Add Each Variable (One by One):**

   Click **"Add New"** for each of these:

   #### Variable 1:
   - **Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`
   - **Value:** [Paste your API key from Firebase Console]
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 2:
   - **Name:** `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - **Value:** `foundrverse-71575.firebaseapp.com`
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 3:
   - **Name:** `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - **Value:** `foundrverse-71575`
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 4:
   - **Name:** `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - **Value:** `foundrverse-71575.firebasestorage.app`
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 5:
   - **Name:** `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - **Value:** [Paste your messaging sender ID from Firebase Console]
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 6:
   - **Name:** `NEXT_PUBLIC_FIREBASE_APP_ID`
   - **Value:** [Paste your app ID from Firebase Console]
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 7 (Optional but Recommended):
   - **Name:** `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - **Value:** [Paste your measurement ID from Firebase Console, if available]
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

   #### Variable 8 (CRITICAL - Service Account):
   - **Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value:** [Paste the entire service-account.json as a single line]
   - **Format Example:**
     ```
     {"type":"service_account","project_id":"foundrverse-71575","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
     ```
   - **Important:** Keep the `\n` characters in the private_key field!
   - **Environments:** ✅ Production, ✅ Preview
   - Click **"Save"**

---

### Step 3: Verify All Variables Are Added

Check that you have **at least 7 variables** in Vercel:
- ✅ NEXT_PUBLIC_FIREBASE_API_KEY
- ✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
- ✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- ✅ NEXT_PUBLIC_FIREBASE_APP_ID
- ✅ FIREBASE_SERVICE_ACCOUNT_KEY

---

### Step 4: Redeploy Your Project

1. **Go to Deployments Tab:**
   - In Vercel Dashboard, click **"Deployments"** tab

2. **Redeploy:**
   - Find your latest deployment
   - Click the **⋯** (three dots) menu
   - Click **"Redeploy"**
   - Wait for deployment to complete (2-5 minutes)

---

### Step 5: Test

1. **Visit your site:** https://foundrverse.vercel.app
2. **Try to sign up or log in**
3. **The Firebase error should be gone!**
4. **Google Sign-In button should work**

---

## 🆘 Still Not Working?

### Check These:

1. **All variables are set?**
   - Go to Vercel → Settings → Environment Variables
   - Verify all 7 variables are listed
   - Check that values are not empty

2. **Variables are for Production?**
   - Make sure each variable has ✅ Production checked
   - Preview is optional but recommended

3. **Service Account Format is Correct?**
   - Should be valid JSON
   - Should be a single line
   - Should have `\n` in private_key field

4. **Project Redeployed?**
   - Environment variables only take effect after redeployment
   - Check deployment logs for any errors

5. **Firebase Console Settings:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Make sure **Google** is enabled
   - Go to Authentication → Settings → Authorized domains
   - Make sure `foundrverse.vercel.app` is listed

---

## 📋 Quick Checklist

Copy this and check off as you go:

- [ ] Opened Firebase Console
- [ ] Copied API Key
- [ ] Copied Auth Domain
- [ ] Copied Project ID
- [ ] Copied Storage Bucket
- [ ] Copied Messaging Sender ID
- [ ] Copied App ID
- [ ] Generated Service Account Key
- [ ] Opened Vercel Dashboard
- [ ] Went to Settings → Environment Variables
- [ ] Added NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] Added NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] Added NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] Added NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] Added NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] Added NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] Added FIREBASE_SERVICE_ACCOUNT_KEY
- [ ] Verified all variables are set
- [ ] Redeployed project
- [ ] Tested signup/login
- [ ] Firebase error is gone ✅

---

## 🔗 Direct Links

- **Firebase Console:** https://console.firebase.google.com/project/foundrverse-71575
- **Firebase Config:** https://console.firebase.google.com/project/foundrverse-71575/settings/general
- **Service Account:** https://console.firebase.google.com/project/foundrverse-71575/settings/serviceaccounts/adminsdk
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Environment Variables:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

---

**Once you complete these steps, the Firebase error will be fixed and Google Sign-In will work!** 🎉

