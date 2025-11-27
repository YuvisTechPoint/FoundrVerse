# How to Use a Shorter Firebase Auth Domain (foundrverse.firebase.app)

You can use a shorter custom domain like `foundrverse.firebase.app` instead of `foundrverse-71575.firebaseapp.com`.

## Option 1: Use Firebase Hosting Custom Domain (Recommended)

Firebase allows you to use a custom domain through Firebase Hosting. This gives you a shorter, cleaner domain.

### Steps:

1. **Enable Firebase Hosting:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/foundrverse-71575/hosting)
   - Click **Get Started** if you haven't enabled Hosting yet
   - Follow the setup wizard

2. **Add Custom Domain:**
   - In Firebase Hosting, click **Add custom domain**
   - Enter your desired domain: `foundrverse.firebase.app`
   - Firebase will verify the domain and provide DNS records if needed
   - Wait for domain verification (can take a few minutes)

3. **Update Environment Variables:**
   
   **In `.env.local` (for local development):**
   ```bash
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=foundrverse.firebase.app
   ```
   
   **In Vercel Dashboard (for production):**
   - Go to your project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` to `foundrverse.firebase.app`
   - Redeploy your application

4. **Add Domain to Authorized Domains:**
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Click **Add domain**
   - Enter `foundrverse.firebase.app`
   - Click **Add**

5. **Update OAuth Redirect URIs (if using Google Sign-In):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Find your OAuth 2.0 Client ID
   - Add `https://foundrverse.firebase.app/__/auth/handler` to Authorized redirect URIs
   - Save changes

## Option 2: Use Your Own Custom Domain

If you own a domain (e.g., `foundrverse.com`), you can use a subdomain for auth:

1. **Set up custom domain in Firebase Hosting:**
   - Add `auth.foundrverse.com` as a custom domain
   - Follow DNS verification steps

2. **Update environment variables:**
   ```bash
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth.foundrverse.com
   ```

3. **Add to authorized domains in Firebase Console**

## Important Notes

- The domain must be verified and active in Firebase Hosting
- DNS changes can take up to 48 hours to propagate
- Make sure to add the domain to Firebase Authentication → Authorized domains
- Update OAuth redirect URIs if using Google Sign-In
- After changing the domain, users may need to clear browser cache

## Current vs New Domain

- **Current:** `foundrverse-71575.firebaseapp.com` (default Firebase domain)
- **New:** `foundrverse.firebase.app` (custom Firebase Hosting domain)

Both work the same way - the custom domain is just shorter and more professional!

## Troubleshooting

If authentication stops working after changing the domain:

1. Verify the domain is added to **Authorized domains** in Firebase Console
2. Check that OAuth redirect URIs are updated in Google Cloud Console
3. Clear browser cache and cookies
4. Verify DNS records are correct (if using your own domain)
5. Wait a few minutes for DNS propagation

## Quick Setup Checklist

- [ ] Firebase Hosting enabled
- [ ] Custom domain added in Firebase Hosting
- [ ] Domain verified and active
- [ ] Domain added to Firebase Authentication → Authorized domains
- [ ] OAuth redirect URIs updated (if using Google Sign-In)
- [ ] Environment variable updated in `.env.local`
- [ ] Environment variable updated in Vercel Dashboard
- [ ] Application redeployed
