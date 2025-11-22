"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function TestRazorpayPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCreateOrder = async () => {
    setLoading(true);
    setOrderId(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "test-user",
          enrollmentId: "test-enrollment",
          amount: 1499,
          currency: "INR",
          metadata: { source: "test-razorpay" },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create test order");
      }

      setOrderId(data.orderId || null);
      toast({
        title: "Order created",
        description: `Test order created with id ${data.orderId}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "Payments temporarily unavailable — admin has not configured Razorpay.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Razorpay Test Page</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This page creates a test Razorpay order using your configured keys.
        </p>
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating order..." : "Create Test Order"}
        </button>
        {orderId && (
          <p className="text-sm text-green-600 break-all">
            Created order_id: <span className="font-mono">{orderId}</span>
          </p>
        )}
      </div>
    </div>
  );
}
