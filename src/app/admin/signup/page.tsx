"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";

const adminSignupSchema = z.object({
  organizationName: z.string().min(2, "Organization/College name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminSignupForm = z.infer<typeof adminSignupSchema>;

export default function AdminSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AdminSignupForm>({
    resolver: zodResolver(adminSignupSchema),
  });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = async (data: AdminSignupForm) => {
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: data.name.trim(),
      });

      // Get ID token after profile update
      const idToken = await userCredential.user.getIdToken(true);

      // Create admin account and organization
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          organizationName: data.organizationName.trim(),
          email: data.email.trim(),
          name: data.name.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to create admin account");
      }

      const result = await response.json();

      // Create session
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

      setSignupSuccess(true);

      toast({
        title: "Admin account created successfully!",
        description: `Welcome to ${result.data?.organization?.name || data.organizationName}!`,
      });

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error("Admin signup error:", error);

      let errorMessage = "Failed to create admin account. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists. Please login instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Signup failed",
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
            <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Admin Signup</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">Create your organization admin account</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-10 transition-colors duration-300 relative"
          >
            {/* Success Message */}
            <AnimatePresence>
              {signupSuccess && (
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
                    Account Created!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-6 text-center"
                  >
                    Redirecting to admin dashboard...
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
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
                  disabled={isLoading || signupSuccess}
                />
                {errors.organizationName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Your Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="John Doe"
                  disabled={isLoading || signupSuccess}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
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
                  placeholder="admin@yourorganization.com"
                  disabled={isLoading || signupSuccess}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
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
                  disabled={isLoading || signupSuccess}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
                  disabled={isLoading || signupSuccess}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.confirmPassword.message}
                  </p>
                )}
                {confirmPasswordValue && passwordValue && passwordValue === confirmPasswordValue && !errors.confirmPassword && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || signupSuccess}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Already have an admin account?{" "}
                <Link href="/admin/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline transition-colors duration-300">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <Link
                href="/login"
                className="block text-center text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                Student Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

