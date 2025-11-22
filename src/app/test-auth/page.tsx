"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { getFirebaseApp, getFirebaseAuth } from "@/lib/firebaseClient";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";

export default function TestAuthPage() {
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");
  const [message, setMessage] = useState("Checking Firebase config…");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      getFirebaseApp();
      const auth = getFirebaseAuth();
      setStatus("ready");
      setMessage("Firebase initialized. You can trigger Google sign-in below.");

      unsubscribe = onAuthStateChanged(auth, (current) => {
        setUser(current);
      });
    } catch (err) {
      console.error("Auth test failed", err);
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Unable to initialize Firebase. Check environment variables."
      );
    }

    return () => unsubscribe();
  }, []);

  const userSummary = useMemo(() => {
    if (!user) return "No authenticated user";
    return `${user.displayName ?? user.email ?? "Unnamed"} (${user.uid})`;
  }, [user]);

  return (
    <main className="max-w-2xl mx-auto py-12 space-y-6">
      <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm dark:bg-gray-900/70">
        <h1 className="text-2xl font-semibold">Firebase Auth Debugger</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Status: <span className="font-medium capitalize">{status}</span>
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm dark:bg-gray-900/70">
        <h2 className="text-lg font-medium">Current user</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{userSummary}</p>
        {user && (
          <dl className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <dt className="font-medium">Email</dt>
              <dd>{user.email ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium">Provider</dt>
              <dd>{user.providerData[0]?.providerId ?? "—"}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm dark:bg-gray-900/70">
        <h2 className="text-lg font-medium">Trigger Google Sign-In</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Use this button to verify OAuth flow in development.
        </p>
        <GoogleSignIn redirectTo="/test-auth" className="mt-4" />
      </div>
    </main>
  );
}
