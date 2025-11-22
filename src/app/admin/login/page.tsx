"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual admin login logic (Clerk/NextAuth)
      // For now, set mock admin flag and organization name in localStorage
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminOrganization", data.organizationName);
      localStorage.setItem("adminEmail", data.email);
      
      toast({
        title: "Admin login successful",
        description: `Welcome to ${data.organizationName} admin dashboard!`,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
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
              <span className="text-3xl font-bold text-gray-900">Mewayz</span>
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">FoundrVerse</span>
            </div>
          </Link>
          <h1 className="mt-6 text-4xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-3 text-gray-600">Sign in to admin dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization / College / University Name
              </label>
              <input
                {...register("organizationName")}
                type="text"
                id="organizationName"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="e.g., MIT, Stanford University, ABC College"
              />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-600">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="admin@foundrverse.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

