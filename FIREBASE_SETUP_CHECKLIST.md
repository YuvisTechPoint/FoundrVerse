# Firebase Setup Checklist

## ✅ Already Completed

- [x] Firebase credentials configured in `.env.local`
- [x] Service account file created (`service-account.json`)
- [x] Firebase SDK integrated in code
- [x] Error handling implemented

## ⚠️ REQUIRED: Enable Google Authentication

The error `auth/configuration-not-found` means **Google Authentication is not enabled** in Firebase Console.

### Quick Fix (5 steps):

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

## Verification

After enabling Google Authentication:

1. ✅ The error should disappear
2. ✅ You can test login at `/login`
3. ✅ Google Sign-In button should work

## Troubleshooting

If you still see errors after enabling:

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Restart dev server** completely
3. **Check authorized domains** in Firebase Console:
   - Authentication → Settings → Authorized domains
   - Ensure `localhost` is listed

## Need Help?

See `docs/FIREBASE_AUTH.md` for detailed instructions.

