# Firebase Google Authentication

This project ships with a full Firebase Authentication flow that exchanges a browser Google Sign-In for a server-trusted session cookie. Use this guide to configure Firebase and run locally.

## 1. Create or reuse a Firebase project

1. Visit [console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. Enable Google authentication: **Build → Authentication → Sign-in method → Google → Enable**.
3. Add your local and production domains under **Authentication → Settings → Authorized domains** (e.g. `localhost`, `127.0.0.1`, your staging host).

## 2. Configure a Web App for client SDK

1. Under **Project Overview → Web**, register a web app (no hosting required).
2. Copy the config fields (`apiKey`, `authDomain`, etc.) and place them in `.env.local` using the keys listed in `.env.example`.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
SESSION_COOKIE_SECRET=change_me_super_secret_32_chars_min
```

> Keep `.env.local` out of source control. `.gitignore` already excludes it; never commit secrets.

## 3. Create a service account for server verification

1. In the Firebase console, open **Project Settings → Service Accounts**.
2. Click **Generate new private key** and download the JSON file.
3. Either:
   - Set `FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json` and place the JSON file locally (never commit).
   - Or copy the JSON into `FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account", ...}'` (keep the newlines escaped as `\n`).
4. Ensure the JSON contains `client_email`, `private_key`, and `project_id`.

## 4. Install dependencies & run

```bash
npm install
npm install firebase firebase-admin
npm run dev
```

Use `ngrok http 3000` (or similar) if you need a public callback URL for local testing. Add the temporary HTTPS domain to Firebase authorized domains before testing redirects.

## 5. How the flow works

1. The client component `GoogleSignIn` initializes Firebase Web SDK and authenticates via Google (popup on desktop, redirect on mobile).
2. After Firebase returns an `idToken`, the browser posts it to `/api/auth/session`.
3. The server verifies the token using `firebase-admin`, mints a 5-day session cookie, signs it with `SESSION_COOKIE_SECRET`, and stores it as an HTTP-only cookie.
4. Server routes (`/api/auth/me`, `/api/protected`) and SSR pages (`/dashboard`) call `verifySessionCookie` to trust only server-issued cookies.
5. `/api/auth/logout` clears cookies and revokes refresh tokens for safety.

## 6. Testing the integration

1. Visit `/login` and click **Continue with Google**.
2. After signing in, you are redirected to `/dashboard`, which renders server-verified claims.
3. Call `/api/auth/me` (e.g. via `curl`) to confirm the cookie is required.
4. Use the included Jest test (`tests/auth/verify.test.ts`) to validate the server helper:

```bash
npm test tests/auth/verify.test.ts
```

## 7. Production notes

- Serve the site over HTTPS so cookies marked `Secure` stay protected.
- Rotate `SESSION_COOKIE_SECRET` periodically (sessions will reset).
- Replace the in-memory mock user store with your real database (call `upsertMockUser` as a hint).
- For multi-region deployments, ensure `firebase-admin` runs in a trusted environment; do not expose service account files to the client.

With these steps complete, the Google sign-in experience will match the design screenshot and remain verifiable on the server.

