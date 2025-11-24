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
import { ArrowRight, Loader2 } from "lucide-react";

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
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user?.customClaims?.admin) {
            router.replace("/admin/dashboard");
          }
        }
      } catch (error) {
        // Not authenticated, continue to login page
      }
    };
    checkAuth();
  }, [router]);

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();

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
        throw new Error(errorData.error || errorData.message || "Failed to create admin session");
      }

      const result = await response.json();

      // Create session cookie (admin login returns sessionCookie directly)
      if (result.data?.sessionCookie) {
        // Session cookie is set by the API route via Set-Cookie header
        // No need to manually set it
      } else {
        // Fallback: create session using the idToken
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!sessionResponse.ok) {
          throw new Error("Failed to create session");
        }
      }

      // Show success state immediately
      setLoginSuccess(true);
      setRedirecting(true);

      toast({
        title: "Admin login successful",
        description: `Welcome to ${result.data?.organization?.name || data.organizationName} admin dashboard!`,
        duration: 3000,
      });

      // Real-time redirect with visual feedback
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Admin login error:", error);

      // Reset success state on error
      setLoginSuccess(false);
      setRedirecting(false);

      let errorMessage = "Invalid credentials. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No admin account found with this email address";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
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
              <input
                {...register("organizationName")}
                type="text"
                id="organizationName"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., MIT, Stanford University, ABC College"
              />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="admin@foundrverse.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
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

