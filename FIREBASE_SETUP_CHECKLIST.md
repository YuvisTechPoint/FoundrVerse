# Firebase Setup Checklist

## 🚨 For Vercel Deployment (Production)

**If you're seeing Firebase errors on your deployed site (foundrverse.vercel.app), you need to configure environment variables in Vercel!**

### Quick Fix for Vercel:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your **FoundrVerse** project

2. **Navigate to Environment Variables:**
   - Click **Settings** tab
   - Click **Environment Variables** in the sidebar

3. **Add Firebase Environment Variables:**
   
   Add these variables one by one (get values from Firebase Console):
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=foundrverse.firebase.app
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=foundrverse-71575
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=foundrverse-71575.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   
   **For each variable:**
   - Click **Add New**
   - Enter the variable name
   - Paste the value from Firebase Console
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

4. **Add Service Account (Admin):**
   
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"foundrverse-71575",...}
   ```
   
   - Get from: Firebase Console → Project Settings → Service Accounts → Generate new private key
   - Copy the entire JSON and paste as a single-line string
   - **Important:** Keep `\n` characters in the private_key field

5. **Redeploy:**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

📖 **Detailed Guide:** See [`VERCEL_ENV_SETUP.md`](VERCEL_ENV_SETUP.md) for complete instructions

---

## ✅ Local Development Setup

- [x] Firebase credentials configured in `.env.local`
- [x] Service account file created (`service-account.json`)
- [x] Firebase SDK integrated in code
- [x] Error handling implemented

## ⚠️ REQUIRED: Enable Google Authentication

The error `auth/configuration-not-found` means **Google Authentication is not enabled** in Firebase Console.

### Quick Fix (6 steps):

1. **Open Firebase Console:**
   ```
   https://console.firebase.google.com/project/foundrverse-71575/authentication/providers
   ```

2. **Click on "Google"** in the Sign-in providers list

3. **Toggle "Enable" to ON**

4. **Enter your support email** (your email address)

5. **Click "Save"**

6. **Restart your dev server:**
   ```powershell
   npm run dev
   ```

### Visual Guide:

```
Firebase Console → Authentication → Sign-in method → Google → Enable
```

## 🔒 Update Authorized Domains (For Vercel)

After deploying to Vercel, add your domain to Firebase:

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add these domains:
   - `foundrverse.vercel.app`
   - `www.foundrverse.vercel.app` (if applicable)
   - Your custom domain (if configured)

## Verification

### Local Development:
1. ✅ The error should disappear
2. ✅ You can test login at `http://localhost:3000/login`
3. ✅ Google Sign-In button should work

### Vercel Deployment:
1. ✅ All environment variables are set in Vercel
2. ✅ Domain added to Firebase authorized domains
3. ✅ Test signup/login on deployed site
4. ✅ No Firebase configuration errors

## Troubleshooting

### Local Development Issues:

If you still see errors after enabling:

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Restart dev server** completely
3. **Check authorized domains** in Firebase Console:
   - Authentication → Settings → Authorized domains
   - Ensure `localhost` is listed

### Vercel Deployment Issues:

**Error: "Missing Firebase config"**
- ✅ Check all `NEXT_PUBLIC_FIREBASE_*` variables are set in Vercel
- ✅ Verify variable names match exactly (case-sensitive)
- ✅ Ensure values don't have extra spaces or quotes
- ✅ Redeploy after adding variables

**Error: "Firebase auth domain not authorized"**
- ✅ Add your Vercel domain to Firebase authorized domains
- ✅ Wait a few minutes for changes to propagate

**Error: "Signup failed" or "Login failed"**
- ✅ Check Firebase Console → Authentication → Sign-in method → Google is enabled
- ✅ Verify all environment variables are set correctly
- ✅ Check Vercel deployment logs for detailed errors

## Need Help?

- 📖 **Vercel Setup:** See [`VERCEL_ENV_SETUP.md`](VERCEL_ENV_SETUP.md)
- 📖 **Firebase Auth:** See [`docs/FIREBASE_AUTH.md`](docs/FIREBASE_AUTH.md)
- 📖 **Vercel Deployment:** See [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md)

