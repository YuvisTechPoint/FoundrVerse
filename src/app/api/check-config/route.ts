import { NextResponse } from "next/server";

/**
 * API endpoint to check Firebase configuration status
 * This helps users diagnose which environment variables are missing
 */
export async function GET() {
  const requiredClientVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const optionalClientVars = [
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  ];

  const serverVars = [
    "FIREBASE_SERVICE_ACCOUNT_KEY",
  ];

  const checkVar = (name: string): { name: string; configured: boolean; hint: string } => {
    const value = process.env[name];
    
    // More robust validation
    const placeholderPatterns = [
      /^your[_-]/i,
      /^change[_-]me/i,
      /^placeholder/i,
      /^example/i,
      /^test[_-]value/i,
      /your[-_]firebase/i,
      /your[-_]project/i,
      /xxxxx/i,
      /\.\.\./i,
    ];
    
    const isPlaceholder = value && placeholderPatterns.some(pattern => pattern.test(value));
    const isEmpty = !value || value.trim().length === 0;
    const isConfigured = !isEmpty && !isPlaceholder;
    
    // Additional validation for specific variables
    let isValid = isConfigured;
    if (isConfigured && value) {
      if (name.includes("API_KEY") && value.length < 20) {
        isValid = false;
      } else if (name.includes("AUTH_DOMAIN") && !value.includes("firebaseapp.com") && !value.includes("firebase.app") && !value.includes(".")) {
        isValid = false;
      } else if (name.includes("STORAGE_BUCKET") && !value.includes("firebasestorage.app")) {
        isValid = false;
      } else if (name.includes("SERVICE_ACCOUNT") && !value.startsWith("{")) {
        // Service account should be JSON
        try {
          JSON.parse(value);
        } catch {
          isValid = false;
        }
      }
    }
    
    let hint = "";
    if (!isValid) {
      if (name.includes("API_KEY")) {
        hint = "Get from Firebase Console → Project Settings → General → Your apps";
      } else if (name.includes("AUTH_DOMAIN")) {
        hint = "Format: your-project-id.firebaseapp.com or your-custom.firebase.app (custom domain)";
      } else if (name.includes("PROJECT_ID")) {
        hint = "Your Firebase project ID (e.g., foundrverse-71575)";
      } else if (name.includes("STORAGE_BUCKET")) {
        hint = "Format: your-project-id.firebasestorage.app";
      } else if (name.includes("MESSAGING_SENDER_ID")) {
        hint = "Get from Firebase Console → Project Settings → General";
      } else if (name.includes("APP_ID")) {
        hint = "Get from Firebase Console → Project Settings → General → Your apps";
      } else if (name.includes("SERVICE_ACCOUNT")) {
        hint = "Get from Firebase Console → Project Settings → Service Accounts → Generate new private key. Paste entire JSON as single-line string.";
      } else if (name.includes("MEASUREMENT_ID")) {
        hint = "Optional: For Google Analytics integration";
      }
    }
    
    return { name, configured: isValid, hint };
  };

  const clientConfig = requiredClientVars.map(checkVar);
  const optionalConfig = optionalClientVars.map(checkVar);
  const serverConfig = serverVars.map(checkVar);

  const allRequiredConfigured = [...clientConfig, ...serverConfig].every(v => v.configured);
  const clientConfigured = clientConfig.every(v => v.configured);

  return NextResponse.json({
    status: allRequiredConfigured ? "configured" : "missing",
    clientReady: clientConfigured,
    serverReady: serverConfig.every(v => v.configured),
    required: {
      client: clientConfig,
      server: serverConfig,
    },
    optional: optionalConfig,
    summary: {
      total: requiredClientVars.length + serverVars.length,
      configured: [...clientConfig, ...serverConfig].filter(v => v.configured).length,
      missing: [...clientConfig, ...serverConfig].filter(v => !v.configured).length,
    },
    instructions: {
      vercelDashboard: "https://vercel.com/dashboard",
      firebaseConsole: "https://console.firebase.google.com",
      projectSettings: "https://console.firebase.google.com/project/foundrverse-71575/settings/general",
      serviceAccounts: "https://console.firebase.google.com/project/foundrverse-71575/settings/serviceaccounts/adminsdk",
    },
  });
}

