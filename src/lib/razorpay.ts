import Razorpay from 'razorpay';
import {
  verifyPaymentSignature as verifyPaymentSignatureUtil,
  verifyWebhookSignature as verifyWebhookSignatureUtil,
} from './razorpay-utils';

function resolveKeyId() {
  return 'rzp_test_RmRChsbSEi83nw'; // Updated test key ID
}

function resolveKeySecret() {
  return 'rzr3qy0llYErtJWDT79Fj7hX'; // Updated test key secret
}

export function ensureRazorpayKeys() {
  const keyId = resolveKeyId();
  const keySecret = resolveKeySecret();

  // Return keys (empty if not configured - will be validated in createOrder)
  return { keyId: keyId || '', keySecret: keySecret || '' };
}

export function getRazorpayClient() {
  const { keyId, keySecret } = ensureRazorpayKeys();
  
  // Only create client if keys are available
  if (!keyId || !keySecret) {
    // Return a mock client for test mode instead of throwing
    return {
      orders: {
        create: async () => {
          throw new Error('Razorpay keys not configured - use createOrder() which handles test mode');
        }
      }
    } as any;
  }

  try {
    const client = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    
    console.log('Razorpay client created successfully', {
      keyIdPrefix: keyId.substring(0, 8) + '...',
      hasKeySecret: !!keySecret,
    });
    
    return client;
  } catch (error) {
    console.error('Failed to create Razorpay client:', error);
    throw new Error(`Failed to initialize Razorpay client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

interface CreateOrderParams {
  amount: number; // in rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export async function createOrder(params: CreateOrderParams) {
  console.log('Starting order creation with params:', params);
  
  try {
    const { keyId, keySecret } = ensureRazorpayKeys();
    console.log('Razorpay keys retrieved:', { 
      keyId: keyId ? `${keyId.substring(0, 8)}...` : 'missing',
      hasKeySecret: !!keySecret 
    });
    
    const { amount, currency = 'INR', receipt, notes } = params;
    console.log('Processing order with:', { amount, currency, receipt });

    if (isNaN(amount) || amount <= 0) {
      const errorMsg = `Invalid amount: ${amount}. Amount must be a positive number.`;
      console.error('Order creation failed -', errorMsg);
      throw new Error(errorMsg);
    }

    // Require Razorpay keys to create actual orders
    if (!keyId || !keySecret) {
      throw new Error('Razorpay keys not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. Get keys from https://dashboard.razorpay.com/app/keys');
    }

    const client = getRazorpayClient();
    
    // Log order creation attempt for debugging
    console.log('Creating Razorpay order:', {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt,
      hasKeyId: !!keyId,
      keyIdPrefix: keyId ? keyId.substring(0, 8) + '...' : 'missing',
    });

    let order;
    try {
      // Convert amount to paise (smallest currency unit for INR)
      const amountInPaise = Math.round(amount * 100);
      
      console.log('Creating Razorpay order with:', {
        amount,
        amountInPaise,
        currency: currency.toUpperCase(),
        receipt,
        notes,
        keyId: keyId ? `${keyId.substring(0, 8)}...` : 'missing',
        hasKeySecret: !!keySecret
      });
      
      order = await client.orders.create({
        amount: amountInPaise,
        currency: currency.toUpperCase(),
        receipt,
        notes,
        payment_capture: 1,
      } as any);
    } catch (razorpayError: any) {
      // Razorpay SDK throws errors in a specific format
      console.error('Razorpay API error:', {
        error: razorpayError,
        errorType: typeof razorpayError,
        isError: razorpayError instanceof Error,
        errorKeys: typeof razorpayError === 'object' ? Object.keys(razorpayError) : [],
        errorString: String(razorpayError),
      });

      // Razorpay errors are usually objects with error property
      if (razorpayError?.error) {
        const apiError = razorpayError.error;
        const description = apiError.description || apiError.message || 'Razorpay API error';
        const code = apiError.code || '';
        throw new Error(`Razorpay API error${code ? ` (${code})` : ''}: ${description}`);
      }

      // Re-throw to be caught by outer catch
      throw razorpayError;
    }

    // Validate order response
    if (!order || !order.id) {
      console.error('Invalid order response from Razorpay:', order);
      throw new Error('Invalid order response from Razorpay. Order ID is missing.');
    }

    console.log('Razorpay order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      status: order.status,
      currency: order.currency,
      receipt: order.receipt,
    });

    return order;
  } catch (error: unknown) {
    // Comprehensive error extraction
    let errorMessage = 'Unknown error occurred';
    let errorDetails: any = {};
    let errorCode = '';

    // Try multiple ways to extract error information
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
    } else if (typeof error === 'object' && error !== null) {
      // Handle Razorpay API errors (usually objects with error property)
      const razorpayError = error as any;
      
      // Try different error property paths
      if (razorpayError.error) {
        const apiError = razorpayError.error;
        errorMessage = apiError.description || apiError.message || apiError.reason || 'Razorpay API error';
        errorCode = apiError.code || apiError.statusCode || '';
        errorDetails = apiError;
      } else if (razorpayError.description) {
        errorMessage = razorpayError.description;
        errorCode = razorpayError.code || '';
        errorDetails = razorpayError;
      } else if (razorpayError.message) {
        errorMessage = razorpayError.message;
        errorDetails = razorpayError;
      } else {
        // Last resort: stringify the error
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          errorMessage = String(error);
        }
        errorDetails = razorpayError;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = String(error);
    }

    // Log full error details for debugging
    console.error('Error creating Razorpay order - Full details:', {
      error,
      errorMessage,
      errorCode,
      errorDetails,
      errorType: typeof error,
      isError: error instanceof Error,
      errorString: String(error),
      errorJSON: typeof error === 'object' ? JSON.stringify(error, null, 2) : 'N/A',
    });

    // Try to log error (logger might not be available)
    try {
      const { logger } = await import('./logger');
      logger.error('Error creating Razorpay order', error);
    } catch (loggerError) {
      // Logger not available, use console
      console.error('Logger not available, using console:', loggerError);
    }
    
    // Check if this is a Razorpay configuration error
    const isConfigError = 
      errorMessage.includes('Razorpay keys not configured') ||
      errorMessage.includes('keys are not configured') ||
      (errorMessage.includes('key') && errorMessage.includes('required')) ||
      errorMessage.includes('authentication') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('Invalid key') ||
      errorMessage.includes('API key') ||
      errorCode === 'BAD_REQUEST_ERROR' && errorMessage.includes('key');

    // Check for Razorpay API specific errors
    const isRazorpayApiError = 
      errorMessage.toLowerCase().includes('razorpay') ||
      errorDetails?.error?.code ||
      errorDetails?.error?.description ||
      errorCode;

    // Provide more helpful error message for configuration issues
    if (isConfigError) {
      const isLocalhost = process.env.NODE_ENV === 'development';
      const errorMsg = isLocalhost
        ? 'Razorpay keys are not configured. Please set RZP_KEY_ID and RZP_KEY_SECRET in your .env.local file. See docs/RAZORPAY.md for setup instructions.'
        : 'Payment gateway is not configured. Please contact support or see docs/RAZORPAY.md for setup instructions.';
      throw new Error(errorMsg);
    }

    // For Razorpay API errors, include the description if available
    if (isRazorpayApiError) {
      const apiDescription = errorDetails?.error?.description || errorDetails?.description || errorMessage;
      const codeInfo = errorCode ? ` (Code: ${errorCode})` : '';
      throw new Error(`Razorpay API error${codeInfo}: ${apiDescription}`);
    }
    
    // For other errors, provide the actual error message (never show "Unknown error occurred")
    const finalMessage = errorMessage === 'Unknown error occurred' 
      ? `Failed to create order. Please check your Razorpay configuration and try again. Error details: ${JSON.stringify(errorDetails)}`
      : `Failed to create order: ${errorMessage}`;
    
    throw new Error(finalMessage);
  }
}

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = ensureRazorpayKeys();
  return verifyPaymentSignatureUtil(orderId, paymentId, signature, keySecret);
}

export function verifyWebhook(body: string, signature: string) {
  if (!process.env.RZP_WEBHOOK_SECRET) {
    throw new Error('Razorpay webhook secret not configured. Set RZP_WEBHOOK_SECRET in env.');
  }
  return verifyWebhookSignatureUtil(body, signature, process.env.RZP_WEBHOOK_SECRET);
}