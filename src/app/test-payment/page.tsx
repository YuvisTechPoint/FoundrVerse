"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";

export default function TestPaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState(1499);
  const [email, setEmail] = useState("test@example.com");
  const [name, setName] = useState("Test User");

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    toast({
      title: "Payment successful!",
      description: `Payment ID: ${paymentId}, Order ID: ${orderId}`,
    });
    console.log("Payment successful:", { paymentId, orderId });
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
    console.error("Payment error:", error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
              <span className="text-3xl font-bold text-gray-900">Mewayz</span>
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">FoundrVerse</span>
            </div>
          </Link>
          <h1 className="mt-6 text-4xl font-bold text-gray-900">Test Payment Page</h1>
          <p className="mt-3 text-gray-600">Test Razorpay integration with different amounts</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Test Mode</h3>
              <p className="text-sm text-yellow-800">
                This page is for testing Razorpay integration. Use test cards:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                <li>Success: <code className="bg-yellow-100 px-1 rounded">4111 1111 1111 1111</code></li>
                <li>Failure: <code className="bg-yellow-100 px-1 rounded">4000 0000 0000 0002</code></li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatPrice(amount)}
                </span>
              </div>

              <RazorpayCheckout
                options={{
                  amount,
                  currency: "INR",
                  name: "Mewayz - FoundrVerse",
                  description: `Test payment of ${formatPrice(amount)}`,
                  prefill: {
                    email,
                    name,
                  },
                  notes: {
                    test: true,
                    page: "test-payment",
                  },
                  onSuccess: handlePaymentSuccess,
                  onError: handlePaymentError,
                }}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay {formatPrice(amount)}
              </RazorpayCheckout>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/"
                className="block text-center text-sm text-gray-600 hover:text-indigo-600"
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

