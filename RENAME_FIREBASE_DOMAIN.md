# How to Rename/Customize Firebase Auth Domain

The domain `foundrverse-71575.firebaseapp.com` is automatically generated from your Firebase project ID. Here are your options:

## Option 1: Change Project Display Name (Recommended - Easy)

This changes how the project appears in Firebase Console, but **doesn't change the auth domain**.

### Steps:
1. Go to [Firebase Console](https://console.firebase.google.com/project/foundrverse-71575/settings/general)
2. Click on **Project Settings** → **General**
3. Click the edit icon next to **Project name**
4. Enter your new display name
5. Click **Save**

**Note:** The auth domain will still be `foundrverse-71575.firebaseapp.com` because it's based on the project ID, not the display name.

## Option 2: Use Custom Domain (Advanced)

If you want to use your own domain (e.g., `auth.yourdomain.com`), you need to:

1. **Set up Firebase Hosting:**
   - Go to Firebase Console → Hosting
   - Add a custom domain
   - Follow the DNS verification steps

2. **Update your `.env.local`:**
   ```bash
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourdomain.com
   ```

**Note:** This requires domain ownership and DNS configuration.

## Option 3: Create New Firebase Project (Not Recommended)

If you want a completely different project ID and domain:

1. Create a new Firebase project with your desired name
2. Copy all the new credentials
3. Update your `.env.local` with new values
4. Re-download service account JSON
5. Re-enable Google Authentication

**Warning:** This is a lot of work and you'll lose any existing data.

## Current Configuration

Your current auth domain is: `foundrverse-71575.firebaseapp.com`

This is **normal and expected** - it's how Firebase works. The domain is automatically generated and secure.

## Recommendation

**Keep the current domain** - it's working correctly and is the standard Firebase setup. The domain name doesn't affect functionality or security.

If you just want a nicer display name, use **Option 1** to change the project display name in Firebase Console.

