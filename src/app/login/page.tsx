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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

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

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();
      
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
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
        throw new Error("Failed to create session");
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
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
                className="object-contain"
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

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-10 transition-colors duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="your@email.com"
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
              disabled={isLoading}
              className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
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
        </div>
      </div>
    </div>
    </div>
  );
}

