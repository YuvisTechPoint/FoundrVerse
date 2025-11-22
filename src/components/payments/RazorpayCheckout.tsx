"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayCheckoutOptions {
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  notes?: Record<string, any>;
  userId?: string;
  courseId?: string;
  cohort?: string;
  metadata?: Record<string, any>;
  onSuccess?: (paymentId: string, orderId: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

interface RazorpayCheckoutProps {
  options: RazorpayCheckoutOptions;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function RazorpayCheckout({
  options,
  children,
  className = "",
  disabled = false,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const razorpayKeyId =
    process.env.NEXT_PUBLIC_RZP_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (typeof window !== "undefined" && window.Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

const handlePayment = async () => {
  setIsLoading(true);
  
  try {
    // 1. First check if Razorpay is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      // If not loaded, load it dynamically
      const script = document.createElement('script') as HTMLScriptElement & {
        onload: (() => void) | null;
        onerror: ((event: Event | string) => void) | null;
      };
      
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      return new Promise<void>((resolve) => {
        script.onload = () => {
          setScriptLoaded(true);
          setScriptError(false);
          // Retry payment after script loads
          handlePayment().finally(() => resolve());
        };
        
        script.onerror = () => {
          setScriptError(true);
          setIsLoading(false);
          options.onError?.('Failed to load Razorpay. Please refresh the page.');
          resolve();
        };
      });
    }

    // 2. Create order on server
    const orderResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || 'INR',
        userId: options.userId,
        enrollmentId: options.courseId,
        metadata: options.metadata,
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create order');
    }

    const orderData = await orderResponse.json();

    // 3. Open Razorpay checkout
    const razorpayOptions = {
      key: razorpayKeyId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: options.name || 'Startup School',
      description: options.description || 'Payment for course enrollment',
      order_id: orderData.orderId,
      prefill: options.prefill || {},
      notes: options.notes || {},
      theme: {
        color: '#4F46E5',
      },
      handler: async function (response: any) {
        try {
          // 4. Verify payment on server
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            let errorData: any = {};
            try {
              errorData = await verifyResponse.json();
            } catch (e) {
              // If response is not JSON, use status text
              errorData = {
                error: `Payment verification failed (${verifyResponse.status})`,
                message: verifyResponse.statusText || 'Unknown error',
              };
            }
            
            // Log detailed error for debugging
            console.error('Payment verification failed:', {
              status: verifyResponse.status,
              statusText: verifyResponse.statusText,
              error: errorData,
            });
            
            throw new Error(errorData.error || errorData.message || `Payment verification failed (${verifyResponse.status})`);
          }

          const verifyData = await verifyResponse.json();
          
          if (!verifyData.verified) {
            throw new Error(verifyData.error || verifyData.message || 'Payment verification failed');
          }
          
          options.onSuccess?.(verifyData.paymentId, verifyData.orderId);
        } catch (error: any) {
          console.error('Payment verification error:', {
            message: error.message,
            stack: error.stack,
          });
          
          // Provide user-friendly error message
          const userMessage = error.message || 'Payment verification failed. Please contact support if the payment was successful.';
          options.onError?.(userMessage);
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          options.onClose?.();
        },
      },
    };

    const rzp = new window.Razorpay(razorpayOptions);
    
    rzp.on('payment.failed', function (response: any) {
      setIsLoading(false);
      options.onError?.(response.error?.description || 'Payment failed');
    });

    rzp.open();
  } catch (error: any) {
    console.error('Payment error:', error);
    setIsLoading(false);
    options.onError?.(error.message || 'Payment failed');
  }
};

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
          setScriptError(false);
        }}
        onError={() => {
          setScriptError(true);
          setScriptLoaded(false);
        }}
      />
      <button
        onClick={handlePayment}
        disabled={disabled || isLoading || !scriptLoaded || scriptError}
        className={className}
      >
        {isLoading
          ? "Processing..."
          : scriptError
          ? "Payment unavailable"
          : children}
      </button>
      {scriptError && (
        <p className="text-sm text-red-600 mt-2">
          Failed to load payment gateway. Please refresh the page.
        </p>
      )}
    </>
  );
}

