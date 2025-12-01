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
  apiKey: "AIzaSyCYm9zNzLIAfNlgNdjQ_em89UUy_dMaXU4",
  authDomain: "foundrverse-71575.firebaseapp.com",
  projectId: "foundrverse-71575",
  storageBucket: "foundrverse-71575.firebasestorage.app",
  messagingSenderId: "413817556532",
  appId: "1:413817556532:web:bcb4edbfe1fde947f30461",
  measurementId: "G-YRLHCZT889"
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
