// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

type FirebaseGlobals = typeof globalThis & {
  __FIREBASE_APP__?: FirebaseApp;
  __FIREBASE_AUTH__?: Auth;
  __FIREBASE_ANALYTICS__?: Analytics;
};

const firebaseGlobal = globalThis as FirebaseGlobals;

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const requiredEnv: Record<
  keyof Omit<FirebaseConfig, "measurementId">,
  string
> = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

function ensureClientSide() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client APIs can only run in the browser context.");
  }
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// This config is loaded from environment variables (better for Next.js)
// Console equivalent: const firebaseConfig = { apiKey: "...", ... }
function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
  };

  const missing = (Object.keys(requiredEnv) as Array<keyof typeof requiredEnv>)
    .filter((key) => !config[key])
    .map((key) => requiredEnv[key]);

  if (missing.length) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    let errorMessage: string;
    if (isProduction) {
      // More helpful message for production - guide to Vercel setup
      errorMessage = `Firebase configuration is missing. Please configure environment variables in Vercel Dashboard. Visit /setup-help for step-by-step instructions.`;
    } else {
      // Detailed message for development
      errorMessage = `Missing Firebase config. Set the following env vars: ${missing.join(", ")}\n\n` +
        `To fix this:\n` +
        `1. Create a Firebase project at https://console.firebase.google.com\n` +
        `2. Enable Google Authentication in Firebase Console\n` +
        `3. Copy your Firebase config from Project Settings → General → Your apps\n` +
        `4. Add the values to your .env.local file\n` +
        `5. See docs/FIREBASE_AUTH.md for detailed instructions\n\n` +
        `Required variables:\n${missing.map(v => `  - ${v}`).join("\n")}`;
    }
    
    // Log detailed error for developers/debugging
    if (isProduction) {
      console.error('Firebase configuration error:', {
        missing,
        message: `Missing Firebase config. Set the following env vars in Vercel: ${missing.join(", ")}`,
        help: 'See VERCEL_ENV_SETUP.md for instructions',
      });
    }
    
    throw new Error(errorMessage);
  }

  // Check for placeholder values
  const placeholderPatterns = [
    /^your[_-]/i,
    /^your/i,
    /^change[_-]me/i,
    /^placeholder/i,
    /^example/i,
    /^test[_-]value/i,
    /your[-_]firebase/i,
    /your[-_]project/i,
  ];

  const placeholders = (Object.keys(requiredEnv) as Array<keyof typeof requiredEnv>)
    .filter((key) => {
      const value = config[key];
      return value && placeholderPatterns.some((pattern) => pattern.test(value));
    })
    .map((key) => requiredEnv[key]);

  if (placeholders.length) {
    const errorMessage = `Firebase config contains placeholder values. Please replace them with your actual Firebase credentials.\n\n` +
      `Placeholder values found in: ${placeholders.join(", ")}\n\n` +
      `To fix this:\n` +
      `1. Go to https://console.firebase.google.com\n` +
      `2. Select your project (or create one)\n` +
      `3. Go to Project Settings → General → Your apps\n` +
      `4. Copy the Firebase config values\n` +
      `5. Update your .env.local file with the real values\n` +
      `6. Restart your dev server (npm run dev)\n\n` +
      `See docs/FIREBASE_AUTH.md for detailed instructions.`;
    throw new Error(errorMessage);
  }

  // Validate config format
  if (!config.apiKey || config.apiKey.length < 20) {
    throw new Error("Invalid Firebase API key. Please check NEXT_PUBLIC_FIREBASE_API_KEY in .env.local");
  }
  
  if (!config.authDomain || !config.authDomain.includes("firebaseapp.com")) {
    throw new Error("Invalid Firebase auth domain. Please check NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN in .env.local");
  }

  return config;
}

// Initialize Firebase
// Console equivalent: const app = initializeApp(firebaseConfig);
export function getFirebaseApp(): FirebaseApp {
  ensureClientSide();

  if (!firebaseGlobal.__FIREBASE_APP__) {
    const config = getFirebaseConfig();
    
    // Check if an app with this name already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      // Use existing app if available
      firebaseGlobal.__FIREBASE_APP__ = existingApps[0]!;
    } else {
      // Initialize new app with the config
      // This is equivalent to: const app = initializeApp(firebaseConfig);
      try {
        firebaseGlobal.__FIREBASE_APP__ = initializeApp(config);
      } catch (error) {
        console.error("Failed to initialize Firebase app:", error);
        const isProduction = process.env.NODE_ENV === 'production';
        const errorMessage = isProduction
          ? "Authentication service is temporarily unavailable. Please contact support."
          : `Firebase initialization failed: ${error instanceof Error ? error.message : "Unknown error"}. Please check your Firebase configuration in .env.local or VERCEL_ENV_SETUP.md for Vercel deployment.`;
        throw new Error(errorMessage);
      }
    }
  }

  return firebaseGlobal.__FIREBASE_APP__!;
}

export function getFirebaseAuth(): Auth {
  ensureClientSide();

  if (!firebaseGlobal.__FIREBASE_AUTH__) {
    const app = getFirebaseApp();
    
    // Verify app is initialized
    if (!app) {
      throw new Error("Firebase app is not initialized. Cannot get Auth instance.");
    }
    
    try {
      firebaseGlobal.__FIREBASE_AUTH__ = getAuth(app);
    } catch (error) {
      console.error("Failed to get Firebase Auth:", error);
      const isProduction = process.env.NODE_ENV === 'production';
      const errorMessage = isProduction
        ? "Authentication service is temporarily unavailable. Please contact support."
        : `Firebase Auth initialization failed: ${error instanceof Error ? error.message : "Unknown error"}. This usually means the Firebase app configuration is invalid. See VERCEL_ENV_SETUP.md for deployment setup.`;
      throw new Error(errorMessage);
    }
  }

  return firebaseGlobal.__FIREBASE_AUTH__!;
}

// Initialize Analytics
// Console equivalent: const analytics = getAnalytics(app);
export function getFirebaseAnalytics(): Analytics | null {
  ensureClientSide();

  // Analytics only works in browser and requires measurementId
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    return null;
  }

  if (!firebaseGlobal.__FIREBASE_ANALYTICS__) {
    try {
      const app = getFirebaseApp();
      // This is equivalent to: const analytics = getAnalytics(app);
      firebaseGlobal.__FIREBASE_ANALYTICS__ = getAnalytics(app);
    } catch (error) {
      console.warn("Firebase Analytics initialization failed:", error);
      return null;
    }
  }

  return firebaseGlobal.__FIREBASE_ANALYTICS__!;
}

/**
 * Dev note: ensure your Google OAuth client allows http://localhost:3000 and
 * http://localhost:3000/api/auth/callback (if applicable) as authorized origins
 * and redirect URIs when testing locally.
 */
