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

  // Check if Razorpay public key is configured
  const isRazorpayConfigured = Boolean(razorpayKeyId);

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
    // CRITICAL: Extract email from prefill or metadata
    const userEmail = options.prefill?.email || options.metadata?.userEmail || options.metadata?.email || '';
    
    const orderResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || 'INR',
        userId: options.userId,
        enrollmentId: options.courseId,
        userEmail: userEmail, // CRITICAL: Pass email explicitly in body
        metadata: {
          ...options.metadata,
          userEmail: userEmail, // Ensure email in metadata
          email: userEmail, // Also as email field for compatibility
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json().catch(() => ({}));
      const errorMessage = error.message || error.error || 'Failed to create order';
      
      // Check if this is a Razorpay configuration error
      if (error.setupRequired || errorMessage.includes('Razorpay') || errorMessage.includes('configuration')) {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
        if (isLocalhost) {
          throw new Error('Razorpay keys are not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. See docs/RAZORPAY.md for setup instructions.');
        } else {
          throw new Error('Payment gateway is not configured. Please contact support or see docs/RAZORPAY.md for setup instructions.');
        }
      }
      
      throw new Error(errorMessage);
    }

    const orderData = await orderResponse.json();

    // Check if Razorpay public key is available before opening checkout
    const finalKeyId = orderData.keyId || razorpayKeyId;
    
    if (!finalKeyId) {
      const isLocalhost = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
      throw new Error(
        isLocalhost
          ? 'Razorpay public key (NEXT_PUBLIC_RZP_KEY_ID) is not configured. Please set it in your .env.local file. Get keys from https://dashboard.razorpay.com/app/keys'
          : 'Payment gateway is not fully configured. Please contact support.'
      );
    }

    // 3. Open Razorpay checkout (only if keys are configured)
    // Razorpay expects amount in paise (smallest currency unit), so multiply by 100
    const amountInPaise = Math.round((orderData.amount || options.amount) * 100);
    
    const razorpayOptions = {
      key: finalKeyId,
      amount: amountInPaise, // Amount in paise
      currency: orderData.currency || options.currency || 'INR',
      name: options.name || 'foundrverse',
      description: options.description || 'Payment for course enrollment',
      order_id: orderData.orderId,
      prefill: {
        ...options.prefill,
        email: options.prefill?.email || userEmail,
      },
      notes: {
        ...options.notes,
        ...options.metadata,
      },
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
            let errorText = '';
            
            try {
              // Try to get response as text first
              errorText = await verifyResponse.text();
              // Try to parse as JSON
              try {
                errorData = JSON.parse(errorText);
              } catch (parseError) {
                // If not JSON, use the text as error message
                errorData = {
                  error: errorText || `Payment verification failed (${verifyResponse.status})`,
                  message: verifyResponse.statusText || 'Unknown error',
                };
              }
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
              errorData,
              errorText,
            });
            
            const errorMessage = errorData.error || errorData.message || errorData.data?.error || errorData.data?.message || `Payment verification failed (${verifyResponse.status})`;
            throw new Error(errorMessage);
          }

          const verifyData = await verifyResponse.json();
          
          // Check if verification was successful
          // Response structure: { success: true, data: { verified: true, paymentId, orderId, ... } }
          if (!verifyData.success) {
            const errorMessage = verifyData.error || verifyData.message || 'Payment verification failed';
            throw new Error(errorMessage);
          }
          
          // Check if data exists and is verified
          if (!verifyData.data || !verifyData.data.verified) {
            const errorMessage = verifyData.data?.error || verifyData.data?.message || verifyData.error || verifyData.message || 'Payment verification failed';
            throw new Error(errorMessage);
          }
          
          // Success - call onSuccess callback with payment and order IDs
          const paymentId = verifyData.data.paymentId;
          const orderId = verifyData.data.orderId;
          
          if (!paymentId || !orderId) {
            throw new Error('Payment verification succeeded but payment details are missing');
          }
          
          options.onSuccess?.(paymentId, orderId);
        } catch (error: any) {
          // Improved error logging
          const errorDetails = {
            message: error?.message || 'Unknown error',
            name: error?.name || 'Error',
            stack: error?.stack || 'No stack trace',
            response: error?.response || 'No response',
          };
          
          console.error('Payment verification error:', errorDetails);
          
          // Provide user-friendly error message
          const userMessage = error?.message || errorDetails.message || 'Payment verification failed. Please contact support if the payment was successful.';
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

    // Ensure Razorpay is loaded before creating instance
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK failed to load. Please refresh the page and try again.');
    }

    const rzp = new window.Razorpay(razorpayOptions);
    
    rzp.on('payment.failed', function (response: any) {
      setIsLoading(false);
      options.onError?.(response.error?.description || 'Payment failed');
    });

    // Open Razorpay payment gateway
    rzp.open();
    
    // Set loading to false when modal opens (it's now in Razorpay's control)
    setIsLoading(false);
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
        disabled={disabled || isLoading}
        className={className}
        title={
          disabled
            ? "Payment is disabled"
            : isLoading
            ? "Processing payment..."
            : undefined
        }
      >
        {isLoading
          ? "Processing..."
          : scriptError
          ? "Payment unavailable"
          : children}
      </button>
      {scriptError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
          Failed to load payment gateway. Please refresh the page.
        </p>
      )}
    </>
  );
}

