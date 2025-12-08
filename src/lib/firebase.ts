import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";

type FirebaseGlobals = typeof globalThis & {
  __FIREBASE_APP__?: FirebaseApp;
  __FIREBASE_AUTH__?: Auth;
  __FIREBASE_ANALYTICS__?: Analytics;
};

const firebaseGlobal = globalThis as FirebaseGlobals;

// Firebase configuration
type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function ensureClientSide() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client APIs can only run in the browser context.");
  }
  return true;
}

// Initialize Firebase
// This config is loaded from environment variables (better for Next.js)
// Console equivalent: const firebaseConfig = { apiKey: "...", ... }
/**
 * Get Firebase configuration
 * @returns Firebase configuration object
 */
function getFirebaseConfig(): FirebaseConfig {
  // Use the hardcoded config since we're not using environment variables
  return firebaseConfig;
}

// Initialize Firebase
// Console equivalent: const app = initializeApp(firebaseConfig);
// Returns null if Firebase is not configured (graceful degradation)
export function getFirebaseApp(): FirebaseApp {
  // Return existing app if it exists
  if (firebaseGlobal.__FIREBASE_APP__) {
    return firebaseGlobal.__FIREBASE_APP__;
  }

  try {
    ensureClientSide();
    const config = getFirebaseConfig();
    
    // Initialize Firebase
    const app = !getApps().length ? initializeApp(config) : getApp();
    firebaseGlobal.__FIREBASE_APP__ = app;
    return app;
  } catch (error) {
    console.error('Error initializing Firebase App:', error);
    throw new Error('Failed to initialize Firebase App');
  }
}

// Returns null if Firebase is not configured (graceful degradation)
export function getFirebaseAuth(): Auth {
  // Return existing auth if it exists
  if (firebaseGlobal.__FIREBASE_AUTH__) {
    return firebaseGlobal.__FIREBASE_AUTH__;
  }

  try {
    ensureClientSide();
    const app = getFirebaseApp();
    const auth = getAuth(app);
    firebaseGlobal.__FIREBASE_AUTH__ = auth;
    return auth;
  } catch (error) {
    console.error('Error initializing Firebase Auth:', error);
    throw new Error('Failed to initialize Firebase Auth');
  }
}

// Initialize Analytics
// Console equivalent: const analytics = getAnalytics(app);
export function getFirebaseAnalytics(): Analytics {
  // Return existing analytics if it exists
  if (firebaseGlobal.__FIREBASE_ANALYTICS__) {
    return firebaseGlobal.__FIREBASE_ANALYTICS__;
  }

  try {
    ensureClientSide();
    const app = getFirebaseApp();
    const analytics = getAnalytics(app);
    firebaseGlobal.__FIREBASE_ANALYTICS__ = analytics;
    return analytics;
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error);
    throw new Error('Failed to initialize Firebase Analytics');
  }
}

/**
 * Dev note: ensure your Google OAuth client allows http://localhost:3000 and
 * http://localhost:3000/api/auth/callback (if applicable) as authorized origins
 * and redirect URIs when testing locally.
 */
