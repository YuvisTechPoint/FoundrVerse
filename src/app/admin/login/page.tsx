"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const adminLoginSchema = z.object({
  organizationName: z.string().min(2, "Organization/College name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState<boolean | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onChange", // Real-time validation
  });

  const organizationName = watch("organizationName");
  const email = watch("email");
  const password = watch("password");

  // Check Firebase configuration on mount
  useEffect(() => {
    const checkFirebaseConfig = () => {
      const auth = getFirebaseAuth();
      setIsFirebaseConfigured(auth !== null);
    };
    checkFirebaseConfig();
  }, []);

  // Check if already authenticated (real-time check)
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          if (data.authenticated && data.user?.customClaims?.admin) {
            // Already authenticated - redirect immediately
            router.replace("/admin/dashboard");
          }
        }
      } catch (error) {
        // Not authenticated, continue to login page
        if (isMounted) {
          setIsFirebaseConfigured((prev) => prev === null ? false : prev);
        }
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();

      if (!auth) {
        const isProduction = process.env.NODE_ENV === 'production';
        throw new Error(
          isProduction
            ? "Firebase configuration is missing. Please configure environment variables in Vercel Dashboard. See /setup-help for detailed instructions."
            : "Firebase configuration appears to be missing. Please check your .env.local file or visit /setup-help for setup instructions."
        );
      }

      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );

      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Create admin session with organization verification
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          organizationName: data.organizationName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || errorData.message || "Failed to create admin session";
        
        // Check if it's a Firebase configuration issue
        if (errorMsg.includes("Firebase") || errorMsg.includes("configuration") || errorMsg.includes("not configured")) {
          const error = new Error(errorMsg) as any;
          error.code = "auth/operation-not-allowed";
          throw error;
        }
        
        throw new Error(errorMsg);
      }

      const result = await response.json();

      // Verify session was created successfully
      if (!result.success) {
        throw new Error(result.error || result.message || "Failed to create admin session");
      }

      // Show success state immediately (real-time feedback)
      setLoginSuccess(true);
      setRedirecting(true);

      toast({
        title: "Admin login successful",
        description: `Welcome to ${result.data?.organization?.name || data.organizationName} admin dashboard!`,
        duration: 2000,
      });

      // Real-time redirect - verify session first, then redirect immediately
      // Small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Verify session before redirect
      const verifyResponse = await fetch("/api/auth/me");
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        if (verifyData.authenticated && verifyData.user?.customClaims?.admin) {
          // Session verified - redirect immediately
          router.replace("/admin/dashboard");
          router.refresh();
        } else {
          // Session not verified yet, wait a bit more
          await new Promise(resolve => setTimeout(resolve, 500));
          router.replace("/admin/dashboard");
          router.refresh();
        }
      } else {
        // Fallback redirect
        router.replace("/admin/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      // Reset success state on error
      setLoginSuccess(false);
      setRedirecting(false);

      // Safely extract error information
      const rawErrorMessage = error?.message || error?.toString() || String(error) || 'Unknown error';
      const errorCode = error?.code || error?.errorCode || 
                       (rawErrorMessage?.match(/auth\/[a-z-]+/)?.[0]) ||
                       (rawErrorMessage?.includes('operation-not-allowed') ? 'auth/operation-not-allowed' : null);

      // Only log detailed error in development, and only if there's actual error info
      if (process.env.NODE_ENV === 'development' && (errorCode || rawErrorMessage !== 'Unknown error')) {
        const logData: any = {};
        if (errorCode) logData.code = errorCode;
        if (rawErrorMessage && rawErrorMessage !== 'Unknown error') logData.message = rawErrorMessage;
        if (error && typeof error === 'object' && Object.keys(error).length > 0) {
          logData.error = error;
        }
        if (Object.keys(logData).length > 0) {
          console.error("Admin login error:", logData);
        }
      }

      const isProduction = process.env.NODE_ENV === 'production';
      let errorMessage = "Login failed. Please try again.";
      let isFirebaseConfigError = false;
      
      // Handle Firebase authentication errors
      if (errorCode === "auth/user-not-found") {
        errorMessage = "No admin account found with this email address. Please check your email or sign up.";
      } else if (errorCode === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorCode === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (errorCode === "auth/operation-not-allowed" || error?.message?.includes('operation-not-allowed')) {
        isFirebaseConfigError = true;
        errorMessage = isProduction
          ? "Email/password login is not available. Please contact support or check Firebase configuration."
          : "Email/password authentication is not enabled in Firebase. Go to Firebase Console → Authentication → Sign-in method → Email/Password → Enable, then try again.";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email address format. Please check your email and try again.";
      } else if (errorCode === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
      } else if (errorCode === "auth/user-disabled") {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (errorCode === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (errorCode === "auth/requires-recent-login") {
        errorMessage = "Please log out and log back in to complete this action.";
      } else if (rawErrorMessage && rawErrorMessage !== 'Unknown error') {
        // Check if it's a Firebase configuration error
        if (rawErrorMessage.includes("Firebase") || rawErrorMessage.includes("configuration") || rawErrorMessage.includes("not configured") || rawErrorMessage.includes("operation-not-allowed")) {
          isFirebaseConfigError = true;
          if (rawErrorMessage.includes("operation-not-allowed")) {
            errorMessage = isProduction
              ? "Email/password login is not available. Please contact support or check Firebase configuration."
              : "Email/password authentication is not enabled in Firebase. Go to Firebase Console → Authentication → Sign-in method → Email/Password → Enable, then try again.";
          } else {
            errorMessage = rawErrorMessage;
          }
        } else {
          errorMessage = rawErrorMessage;
        }
      }

      toast({
        title: "Login failed",
        description: isFirebaseConfigError ? (
          <div className="space-y-2">
            <p>{errorMessage}</p>
            <Link 
              href="/setup-help"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white underline hover:no-underline"
            >
              View Setup Instructions
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : errorMessage,
        variant: "destructive",
        duration: isFirebaseConfigError ? 8000 : 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-4 mb-6 transition">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/images/mewayz.jpeg"
                alt="Mewayz FoundrVerse Logo"
                fill
                className="object-contain rounded-lg"
                sizes="64px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Mewayz</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">FoundrVerse</span>
            </div>
          </Link>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Admin Login</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">Sign in to admin dashboard</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-10 transition-colors duration-300 relative">
          {/* Firebase Configuration Warning Banner */}
          <AnimatePresence>
            {isFirebaseConfigured === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                      Firebase Configuration Required
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                      {process.env.NODE_ENV === 'production'
                        ? "Firebase configuration is missing. Please configure environment variables in Vercel Dashboard. See /setup-help for detailed instructions."
                        : "Firebase is not configured. Please set up your Firebase credentials. See VERCEL_ENV_SETUP.md for Vercel deployment instructions or docs/FIREBASE_AUTH.md for local setup."}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/setup-help"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline transition-colors"
                      >
                        View Setup Instructions
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      {process.env.NODE_ENV !== 'production' && (
                        <div className="text-xs text-amber-700 dark:text-amber-400">
                          Documentation: <span className="font-mono">VERCEL_ENV_SETUP.md</span> or <span className="font-mono">docs/FIREBASE_AUTH.md</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message - Real-time */}
          <AnimatePresence>
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-50 p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center"
                >
                  Login Successful!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6 text-center"
                >
                  {redirecting ? "Redirecting to admin dashboard..." : "You're being redirected"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                {redirecting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Organization / College / University Name
              </label>
              <div className="relative">
                <input
                  {...register("organizationName")}
                  type="text"
                  id="organizationName"
                  onBlur={() => trigger("organizationName")}
                  className={`w-full px-4 py-3 pr-10 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.organizationName
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                      : organizationName && organizationName.length >= 2 && !errors.organizationName
                      ? "border-green-500 dark:border-green-500 focus:ring-green-500 dark:focus:ring-green-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-400"
                  }`}
                  placeholder="e.g., MIT, Stanford University, ABC College"
                  disabled={isFirebaseConfigured === false || isLoading}
                />
                {organizationName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.organizationName ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : organizationName.length >= 2 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.organizationName && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.organizationName.message}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Email
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  onBlur={() => trigger("email")}
                  className={`w-full px-4 py-3 pr-10 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.email
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                      : email && !errors.email
                      ? "border-green-500 dark:border-green-500 focus:ring-green-500 dark:focus:ring-green-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-400"
                  }`}
                  placeholder="admin@foundrverse.com"
                  suppressHydrationWarning
                  disabled={isFirebaseConfigured === false || isLoading}
                />
                {email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.email ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  onBlur={() => trigger("password")}
                  className={`w-full px-4 py-3 pr-10 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.password
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                      : password && password.length >= 6 && !errors.password
                      ? "border-green-500 dark:border-green-500 focus:ring-green-500 dark:focus:ring-green-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-400"
                  }`}
                  placeholder="••••••••"
                  disabled={isFirebaseConfigured === false || isLoading}
                />
                {password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.password ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : password.length >= 6 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.password.message}
                </motion.p>
              )}
              {password && password.length >= 6 && !errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Password looks good
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || loginSuccess || isFirebaseConfigured === false || !isValid}
              whileHover={!isLoading && !loginSuccess && isFirebaseConfigured !== false && isValid ? { scale: 1.02 } : {}}
              whileTap={!isLoading && !loginSuccess && isFirebaseConfigured !== false && isValid ? { scale: 0.98 } : {}}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Login Successful!</span>
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Don't have an admin account?{" "}
              <Link href="/admin/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline transition-colors duration-300">
                Create one
              </Link>
            </p>
            <Link
              href="/login"
              className="block text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
            >
              Student Login
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

