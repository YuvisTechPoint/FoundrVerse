"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.authenticated) return;
        router.replace("/dashboard");
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      active = false;
    };
  }, [router]);

  // Real-time email validation
  const validateEmail = async () => {
    if (emailTouched) {
      await trigger("email");
    }
  };

  // Real-time password validation
  const validatePassword = async () => {
    if (passwordTouched) {
      await trigger("password");
    }
  };

  // Check if email is valid format
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (data: LoginForm) => {
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

      // Create session
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create session");
      }

      const result = await response.json();

      // Show success state immediately
      setLoginSuccess(true);
      setRedirecting(true);

      toast({
        title: "Login successful",
        description: `Welcome back, ${result.data?.user?.displayName || result.data?.user?.email || "User"}! Redirecting to dashboard...`,
        duration: 3000,
      });

      // Real-time redirect with visual feedback
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Reset success state on error
      setLoginSuccess(false);
      setRedirecting(false);
      
      let errorMessage = "Invalid credentials. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled. Please contact support.";
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
      <Navbar />
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
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Student Login</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">Sign in to your account</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-10 transition-colors duration-300 relative"
        >
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
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
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
                  {redirecting ? "Redirecting to dashboard..." : "You're being redirected"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/dashboard"
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
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Email
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  onBlur={() => {
                    setEmailTouched(true);
                    validateEmail();
                  }}
                  onChange={() => {
                    if (emailTouched) {
                      validateEmail();
                    }
                  }}
                  className={`w-full px-4 py-3 pr-10 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.email
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                      : emailTouched && emailValue && isValidEmailFormat(emailValue)
                      ? "border-green-500 dark:border-green-500 focus:ring-green-500 dark:focus:ring-green-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-400"
                  }`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                <AnimatePresence>
                  {emailTouched && emailValue && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {errors.email ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : isValidEmailFormat(emailValue) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onBlur={() => {
                    setPasswordTouched(true);
                    validatePassword();
                  }}
                  onChange={() => {
                    if (passwordTouched) {
                      validatePassword();
                    }
                  }}
                  className={`w-full px-4 py-3 pr-10 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.password
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                      : passwordTouched && passwordValue && passwordValue.length >= 6
                      ? "border-green-500 dark:border-green-500 focus:ring-green-500 dark:focus:ring-green-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-400"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <AnimatePresence>
                    {passwordTouched && passwordValue && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        {errors.password ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : passwordValue.length >= 6 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : null}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
              {passwordTouched && passwordValue && !errors.password && (
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-gray-700 transition-colors duration-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Or continue with
                </span>
              </div>
            </div>
            <GoogleSignIn className="mt-6" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Don't have an account?{" "}
              <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline transition-colors duration-300">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <Link
              href="/admin/login"
              className="block text-center text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
            >
              Admin Login
            </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

