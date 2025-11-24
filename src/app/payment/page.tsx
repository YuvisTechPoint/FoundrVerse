"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";

const COURSE_PRICE = 1499;

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    // Get current user from session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUserId(data.user.uid || "");
          setUserEmail(data.user.email || "");
          setUserName(data.user.displayName || data.user.name || "");
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, [router]);

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    toast({
      title: "Payment successful!",
      description: "Your enrollment is now active. Redirecting to dashboard...",
      duration: 3000,
    });
    
    // Wait to ensure payment is saved, then redirect with full page reload and cache bust
    setTimeout(() => {
      // Add timestamp to force fresh data load
      window.location.href = `/dashboard?purchased=true&t=${Date.now()}`;
    }, 2500);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error || "Please try again.",
      variant: "destructive",
    });
  };

  const features = [
    "Full course",
    "Community access",
    "Internship eligibility",
    "Founder sessions",
    "Pitch competition access",
    "Certification",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-28 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
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
              <span className="text-3xl font-bold text-gray-900 dark:text-white">Mewayz</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">FoundrVerse</span>
            </div>
          </Link>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">Complete Your Enrollment</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Secure payment - Get started in minutes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">30-Day Startup Blueprint</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete startup course</p>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(COURSE_PRICE)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">{formatPrice(COURSE_PRICE)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(COURSE_PRICE)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3">What's included:</h3>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-indigo-700 dark:text-indigo-300">
                    <Check className="h-4 w-4 mr-2 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Details</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Secure payment powered by Razorpay
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You'll be redirected to a secure payment page to complete your transaction.
                </p>
              </div>

              {isLoadingUser ? (
                <button
                  disabled
                  className="w-full bg-gray-400 dark:bg-gray-600 text-white py-4 rounded-xl font-semibold text-lg cursor-not-allowed"
                >
                  Loading...
                </button>
              ) : !userId ? (
                <Link
                  href="/login"
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-900 dark:border-white text-center block"
                >
                  Please Login to Continue
                </Link>
              ) : (
                <RazorpayCheckout
                  options={{
                    amount: COURSE_PRICE,
                    currency: "INR",
                    name: "Mewayz - FoundrVerse",
                    description: "30-Day Startup Blueprint - Course Enrollment",
                    userId: userId,
                    courseId: "30-day-startup-blueprint",
                    prefill: {
                      email: userEmail,
                      contact: "",
                      name: userName,
                    },
                    metadata: {
                      userEmail: userEmail, // CRITICAL: Pass email in metadata
                      userName: userName,
                    },
                    notes: {
                      course: "30-Day Startup Blueprint",
                      userEmail: userEmail, // Also in notes for Razorpay
                    },
                    onSuccess: handlePaymentSuccess,
                    onError: handlePaymentError,
                    onClose: () => {
                      // User closed the payment modal
                    },
                  }}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-900 dark:border-white"
                >
                  Pay {formatPrice(COURSE_PRICE)}
                </RazorpayCheckout>
              )}

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Your payment is secure and encrypted. We use Razorpay for secure transactions.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="block text-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

