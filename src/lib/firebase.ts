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
function getFirebaseConfig(): FirebaseConfig | null {
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
    
    // Log warning (not error) since UI handles this gracefully
    // In development, use warn to avoid alarming console errors
    // In production, still log as error for debugging
    if (isProduction) {
      console.error('Firebase configuration error:', {
        missing,
        message: `Missing Firebase config. Set the following env vars in Vercel: ${missing.join(", ")}`,
        help: 'See VERCEL_ENV_SETUP.md for instructions',
      });
    } else {
      // Use console.warn in development since UI now shows proper warnings
      console.warn('Firebase configuration not found. Set the following env vars:', missing.join(", "));
      console.warn('This is expected if Firebase is not configured. See the warning banner on the page for setup instructions.');
    }
    
    // Return null instead of throwing - let components handle the error gracefully
    return null;
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
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.error('Firebase config contains placeholder values:', placeholders.join(", "));
    } else {
      console.warn('Firebase config contains placeholder values:', placeholders.join(", "));
    }
    // Return null instead of throwing
    return null;
  }

  // Validate config format
  if (!config.apiKey || config.apiKey.length < 20) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.error("Invalid Firebase API key. Please check NEXT_PUBLIC_FIREBASE_API_KEY");
    } else {
      console.warn("Invalid Firebase API key. Please check NEXT_PUBLIC_FIREBASE_API_KEY");
    }
    return null;
  }
  
  // Validate auth domain - accept both firebaseapp.com and firebase.app (custom domains)
  const isValidAuthDomain = config.authDomain && (
    config.authDomain.includes("firebaseapp.com") || 
    config.authDomain.includes("firebase.app") ||
    config.authDomain.includes(".") // Allow custom domains
  );
  
  if (!isValidAuthDomain) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.error("Invalid Firebase auth domain. Please check NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    } else {
      console.warn("Invalid Firebase auth domain. Please check NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    }
    return null;
  }

  return config;
}

// Initialize Firebase
// Console equivalent: const app = initializeApp(firebaseConfig);
// Returns null if Firebase is not configured (graceful degradation)
export function getFirebaseApp(): FirebaseApp | null {
  ensureClientSide();

  if (!firebaseGlobal.__FIREBASE_APP__) {
    const config = getFirebaseConfig();
    
    // If config is missing, return null instead of throwing
    if (!config) {
      return null;
    }
    
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
        // Return null instead of throwing - let components handle gracefully
        return null;
      }
    }
  }

  return firebaseGlobal.__FIREBASE_APP__!;
}

// Returns null if Firebase is not configured (graceful degradation)
export function getFirebaseAuth(): Auth | null {
  ensureClientSide();

  if (!firebaseGlobal.__FIREBASE_AUTH__) {
    const app = getFirebaseApp();
    
    // Verify app is initialized
    if (!app) {
      // Return null instead of throwing - let components handle gracefully
      return null;
    }
    
    try {
      firebaseGlobal.__FIREBASE_AUTH__ = getAuth(app);
    } catch (error) {
      console.error("Failed to get Firebase Auth:", error);
      // Return null instead of throwing - let components handle gracefully
      return null;
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
      if (!app) {
        return null;
      }
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
