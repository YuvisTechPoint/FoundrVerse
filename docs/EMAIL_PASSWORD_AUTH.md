# Email/Password Authentication Setup

This guide explains how to enable email/password authentication in Firebase Console.

## Enable Email/Password Authentication

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/foundrverse-71575/authentication/providers
   ```

2. **Click on "Email/Password"** in the Sign-in providers list

3. **Toggle "Enable" to ON**

4. **Enable "Email link (passwordless sign-in)"** if you want passwordless authentication (optional)

5. **Click "Save"**

## How It Works

### Signup Flow:
1. User fills out form (name, email, phone, password)
2. Client creates Firebase user with `createUserWithEmailAndPassword`
3. User profile is updated with name
4. Backend API stores additional data (phone) in custom claims
5. Session cookie is created
6. User is redirected to payment/dashboard

### Login Flow:
1. User enters email and password
2. Client signs in with `signInWithEmailAndPassword`
3. ID token is obtained
4. Session cookie is created
5. User is redirected to dashboard

## API Endpoints

### POST `/api/auth/signup`
- Receives: `{ idToken, name, phone }`
- Updates user profile with additional information
- Sets custom claims

### POST `/api/auth/login`
- Receives: `{ idToken }`
- Creates session cookie
- Returns user information

### POST `/api/auth/session`
- Receives: `{ idToken }`
- Creates secure session cookie
- Works for both Google and Email/Password auth

## User Data Stored

- **Email**: Stored in Firebase Auth
- **Password**: Hashed and stored by Firebase
- **Name**: Stored in `displayName` and custom claims
- **Phone**: Stored in custom claims (optional)

## Security Notes

- Passwords are never stored in plain text
- All authentication is handled by Firebase
- Session cookies are HTTP-only and secure
- Custom claims are verified server-side

