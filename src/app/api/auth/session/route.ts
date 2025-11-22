import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { upsertMockUser } from "@/data/users-mock";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

function getSessionSecret() {
  const secret = process.env.SESSION_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_COOKIE_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function signSessionCookie(value: string) {
  const secret = getSessionSecret();
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch((err) => {
      console.error("Failed to parse request body:", err);
      return null;
    });
    
    const idToken = body?.idToken;

    if (!idToken) {
      console.error("Missing idToken in request body");
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }
    
    console.log("Creating session for user...");

    const auth = getFirebaseAdminAuth();
    
    console.log("Verifying ID token...");
    const decoded = await auth.verifyIdToken(idToken, true);
    console.log("Token verified for user:", decoded.uid);
    
    // Convert milliseconds to seconds for expiresIn
    const expiresInSeconds = Math.floor(SESSION_DURATION_MS / 1000);
    console.log("Creating session cookie...");
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: expiresInSeconds,
    });
    console.log("Session cookie created successfully");

    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";
    const maxAgeSeconds = Math.floor(SESSION_DURATION_MS / 1000);
    const signature = signSessionCookie(sessionCookie);

    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge: maxAgeSeconds,
      path: "/",
    });

    cookieStore.set({
      name: SESSION_SIGNATURE_COOKIE_NAME,
      value: signature,
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge: maxAgeSeconds,
      path: "/",
    });

    // Get custom claims for additional user data
    const customClaims = decoded as any;
    
    // Determine display name with proper fallback
    const displayName = customClaims.name || decoded.name || decoded.email || "Unknown";
    
    const user = upsertMockUser({
      uid: decoded.uid,
      email: decoded.email ?? undefined,
      displayName,
      photoURL: decoded.picture ?? undefined,
      provider: decoded.firebase?.sign_in_provider || "email",
      lastLoginAt: Date.now(),
    });

    console.log("Session created successfully for user:", user.uid);
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Failed to create Firebase session - Full error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      error: error,
    });
    
    // Provide more specific error messages
    let errorMessage = "Unable to create session";
    let statusCode = 500;
    
    if (error.code === "auth/argument-error") {
      errorMessage = "Invalid authentication token";
      statusCode = 401;
    } else if (error.code === "auth/id-token-expired") {
      errorMessage = "Authentication token expired. Please sign in again.";
      statusCode = 401;
    } else if (error.code === "auth/id-token-revoked") {
      errorMessage = "Authentication token revoked. Please sign in again.";
      statusCode = 401;
    } else if (error.message?.includes("SESSION_COOKIE_SECRET")) {
      errorMessage = "Server configuration error. Please contact support.";
      statusCode = 500;
    } else if (error.message?.includes("Firebase admin credentials")) {
      errorMessage = "Server configuration error. Firebase admin not configured.";
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      code: error.code || undefined,
    }, { status: statusCode });
  }
}

