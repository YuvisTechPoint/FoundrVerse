import { NextResponse } from "next/server";

/**
 * API endpoint to check Razorpay configuration status
 * This helps users diagnose which environment variables are missing
 */
export async function GET() {
  const requiredClientVars = [
    "NEXT_PUBLIC_RZP_KEY_ID",
    "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  ];

  const serverVars = [
    "RZP_KEY_ID",
    "RAZORPAY_KEY_ID",
    "RZP_KEY_SECRET",
    "RAZORPAY_KEY_SECRET",
  ];

  const checkVar = (name: string): { name: string; configured: boolean; hint: string } => {
    const value = process.env[name];
    let isConfigured = Boolean(value && value.length > 0);
    let hint = "";

    if (!isConfigured) {
      // Provide specific hints for missing variables
      if (name.includes("NEXT_PUBLIC") && name.includes("KEY_ID")) {
        hint = "Public key for Razorpay checkout. Get from Razorpay Dashboard → Settings → API Keys";
      } else if (name.includes("KEY_ID") && !name.includes("NEXT_PUBLIC")) {
        hint = "Server-side key ID. Get from Razorpay Dashboard → Settings → API Keys";
      } else if (name.includes("KEY_SECRET")) {
        hint = "Server-side key secret. Get from Razorpay Dashboard → Settings → API Keys";
      }
    } else {
      // Additional validation for configured variables
      const v = String(value);
      if (v.startsWith("your-") || v.startsWith("placeholder") || v.includes("example.com")) {
        isConfigured = false;
        hint = "Contains placeholder value. Replace with actual Razorpay key.";
      } else if (name.includes("KEY_ID") && !v.startsWith("rzp_")) {
        isConfigured = false;
        hint = "Invalid Razorpay Key ID format. Should start with 'rzp_'.";
      }
    }
    
    return { name, configured: isConfigured, hint };
  };

  // Check for at least one client-side key configured
  const clientKeyId = process.env.NEXT_PUBLIC_RZP_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const clientReady = Boolean(clientKeyId && clientKeyId.length > 0 && clientKeyId.startsWith("rzp_"));

  // Check for server-side keys configured
  const serverKeyId = process.env.RZP_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
  const serverKeySecret = process.env.RZP_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || "";
  const serverReady = Boolean(serverKeyId && serverKeySecret && serverKeyId.startsWith("rzp_"));

  const clientConfig = requiredClientVars.map(checkVar);
  const serverConfig = serverVars.map(checkVar);

  const allRequiredConfigured = clientReady && serverReady;

  return NextResponse.json({
    status: allRequiredConfigured ? "configured" : "missing",
    clientReady,
    serverReady,
    required: {
      client: clientConfig,
      server: serverConfig,
    },
    summary: {
      clientConfigured: clientReady ? 1 : 0,
      serverConfigured: serverReady ? 1 : 0,
      totalRequired: 1, // At least one client key
      missing: allRequiredConfigured ? 0 : 1,
    },
    instructions: {
      razorpayDashboard: "https://dashboard.razorpay.com",
      apiKeys: "https://dashboard.razorpay.com/app/keys",
      documentation: "/docs/RAZORPAY.md",
    },
  });
}

