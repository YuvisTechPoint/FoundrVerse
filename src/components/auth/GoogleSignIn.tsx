"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebaseClient";

type Props = {
  redirectTo?: string;
  className?: string;
};

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export function GoogleSignIn({ redirectTo = "/dashboard", className }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<ReturnType<typeof getFirebaseAuth> | null>(null);

  useEffect(() => {
    try {
      const instance = getFirebaseAuth();
      
      if (!instance) {
        // Firebase is not configured - don't show error in localhost (might be configured locally)
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
        if (!isLocalhost) {
          const errorMessage = "Firebase configuration is missing. Please configure environment variables. Click below for setup instructions.";
          setError(errorMessage);
        } else {
          // On localhost, silently handle - user might have .env.local configured
          setError(null);
        }
        setAuth(null);
      } else {
        setAuth(instance);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to load Firebase auth", err);
      
      // In production, show user-friendly message; in development, show detailed error
      const isProduction = process.env.NODE_ENV === 'production';
      let errorMessage = "Google sign-in is currently unavailable. Please try again later or contact support.";
      
      if (err instanceof Error) {
        // Check for configuration issues first
        if (err.message.includes("Firebase configuration is missing") || 
            err.message.includes("Missing Firebase config") || 
            err.message.includes("Missing Firebase") ||
            err.message.includes("placeholder") ||
            err.message.includes("temporarily unavailable")) {
          errorMessage = isProduction
            ? "Firebase configuration is missing. Please configure environment variables in Vercel Dashboard. See /setup-help for detailed instructions."
            : "Firebase configuration is missing. Click below for setup instructions.";
        } else if (err.message.includes("configuration-not-found") || err.message.includes("configuration not found")) {
          errorMessage = "Firebase Auth configuration not found. Please enable Google Authentication in Firebase Console: Authentication → Sign-in method → Google → Enable";
        } else if (!isProduction) {
          // Show full error in development
          errorMessage = err.message;
        }
        // In production, if it's not a config issue, keep the generic message
      }
      
      setError(errorMessage);
      setAuth(null);
    }
    setIsInitializing(false);
  }, []);

  const finalizeLogin = useCallback(
    async (user: User | null) => {
      if (!user) return;
      
      try {
        const idToken = await user.getIdToken(true);
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          let errorMessage = `Failed to create session (${response.status})`;
          
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
            console.error("Session creation failed:", {
              status: response.status,
              statusText: response.statusText,
              error: data,
            });
          } catch (parseError) {
            // If JSON parsing fails, try to get text
            const text = await response.text().catch(() => "");
            console.error("Session creation failed - non-JSON response:", {
              status: response.status,
              statusText: response.statusText,
              body: text,
            });
            errorMessage = text || errorMessage;
          }
          
          throw new Error(errorMessage);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Session creation failed");
        }

        setError(null);
        router.replace(redirectTo);
        router.refresh();
      } catch (error) {
        console.error("Finalize login error:", error);
        throw error;
      }
    },
    [redirectTo, router]
  );

  useEffect(() => {
    let active = true;
    if (!auth) return () => {};

    getRedirectResult(auth)
      .then(async (result) => {
        if (!active || !result?.user) return;
        setIsLoading(true);
        try {
          await finalizeLogin(result.user);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Unable to complete login");
        } finally {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Redirect login failed", err);
      });

    return () => {
      active = false;
    };
  }, [auth, finalizeLogin]);

  const handleSignIn = useCallback(async () => {
    setError(null);
    if (!auth) {
      setError(
        isInitializing
          ? "Preparing secure sign-in. Please try again in a moment."
          : "Sign in disabled — contact admin."
      );
      return;
    }

    setIsLoading(true);
    try {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }

      const result = await signInWithPopup(auth, provider);
      await finalizeLogin(result.user);
    } catch (err) {
      console.error(err);
      
      // In production, show user-friendly message; in development, show detailed error
      const isProduction = process.env.NODE_ENV === 'production';
      let errorMessage = "Google sign-in failed. Please try again later or contact support.";
      
      if (err instanceof Error) {
        // Check for configuration issues first (both production and development)
        if (err.message.includes("api-key-not-valid") || err.message.includes("API key not valid") || err.message.includes("Firebase configuration is missing")) {
          errorMessage = isProduction
            ? "Firebase configuration is missing. Please configure environment variables in Vercel Dashboard. Visit /setup-help for step-by-step instructions."
            : "Firebase API key is invalid or missing. Please check your environment variables. See VERCEL_ENV_SETUP.md for Vercel deployment or docs/FIREBASE_AUTH.md for local setup.";
        } else if (err.message.includes("configuration-not-found") || err.message.includes("configuration not found")) {
          errorMessage = isProduction
            ? "Google Authentication is not enabled in Firebase. Please enable it in Firebase Console and configure environment variables in Vercel. Visit /setup-help for instructions."
            : "Firebase Auth not configured. Enable Google Authentication in Firebase Console: Authentication → Sign-in method → Google → Enable";
        } else if (err.message.includes("auth/")) {
          // Clean up Firebase error messages
          const cleanMessage = err.message
            .replace("Firebase: Error (", "")
            .replace(").", "")
            .replace("auth/", "");
          errorMessage = isProduction 
            ? "Authentication error occurred. Please check your Firebase configuration in Vercel. Visit /setup-help for help."
            : (cleanMessage || "Authentication error occurred");
        } else if (!isProduction) {
          // Show full error in development
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [auth, finalizeLogin]);

  // Google Icon SVG Component
  const GoogleIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  // Hide button completely if Firebase is not configured (production-friendly)
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldHideButton = !auth && !isInitializing && (isProduction || error?.includes("not configured") || error?.includes("temporarily unavailable"));

  return (
    <div className={className}>
      {!shouldHideButton && (
        <button
          type="button"
          onClick={handleSignIn}
          disabled={isLoading || !auth}
          className="flex items-center justify-center gap-3 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
              <span>Connecting...</span>
            </>
          ) : !auth ? (
            "Preparing secure sign-in..."
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      )}
      {!error && !auth && isInitializing && !shouldHideButton && (
        <p className="mt-2 text-sm text-gray-500" aria-live="polite">
          Initializing Firebase securely…
        </p>
      )}
      {error && (
        <div className="mt-2 space-y-3">
          <div className={`p-3 rounded-lg ${shouldHideButton ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            <p className={`text-sm font-medium ${shouldHideButton ? 'text-gray-700 dark:text-gray-300' : 'text-red-700 dark:text-red-300'}`} aria-live="assertive">
              {error}
            </p>
          </div>
          {(error.includes("Firebase configuration is missing") || 
            error.includes("Firebase") || 
            error.includes("Vercel Dashboard") || 
            error.includes("setup-help") ||
            error.includes("not configured")) && (
            <Link
              href="/setup-help"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors shadow-sm"
            >
              View Setup Instructions →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default GoogleSignIn;

