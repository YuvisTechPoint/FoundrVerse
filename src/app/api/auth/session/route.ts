import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { upsertMockUser } from "@/data/users-mock";
import { errorResponse, successResponse, ApiException, withErrorHandling } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

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

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch((err) => {
    logger.error("Failed to parse request body", err);
    throw new ApiException("Invalid request body", 400, "INVALID_BODY");
  });
  
  const idToken = body?.idToken;

  if (!idToken) {
    throw new ApiException("idToken is required", 400, "MISSING_ID_TOKEN");
  }
  
  logger.debug("Creating session for user");

  const auth = getFirebaseAdminAuth();
  
  logger.debug("Verifying ID token");
  const decoded = await auth.verifyIdToken(idToken, true).catch((error) => {
    logger.error("Token verification failed", error);
    if (error.code === "auth/argument-error") {
      throw new ApiException("Invalid authentication token", 401, "INVALID_TOKEN");
    } else if (error.code === "auth/id-token-expired") {
      throw new ApiException("Authentication token expired. Please sign in again.", 401, "TOKEN_EXPIRED");
    } else if (error.code === "auth/id-token-revoked") {
      throw new ApiException("Authentication token revoked. Please sign in again.", 401, "TOKEN_REVOKED");
    }
    throw new ApiException("Token verification failed", 401, "TOKEN_VERIFICATION_FAILED");
  });
  
  logger.debug("Token verified", { uid: decoded.uid });
  
  // Convert milliseconds to seconds for expiresIn
  const expiresInSeconds = Math.floor(SESSION_DURATION_MS / 1000);
  logger.debug("Creating session cookie");
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: expiresInSeconds,
  }).catch((error) => {
    logger.error("Failed to create session cookie", error);
    throw new ApiException("Failed to create session", 500, "SESSION_CREATION_FAILED");
  });
  
  logger.debug("Session cookie created successfully");

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
  const customClaims = decoded as Record<string, unknown>;
  
  // Determine display name with proper fallback
  const displayName = (customClaims.name || decoded.name || decoded.email || "Unknown") as string;
  
  const user = upsertMockUser({
    uid: decoded.uid,
    email: decoded.email ?? undefined,
    displayName,
    photoURL: decoded.picture ?? undefined,
    provider: (decoded.firebase as { sign_in_provider?: string })?.sign_in_provider || "email",
    lastLoginAt: Date.now(),
  });

  logger.info("Session created successfully", { uid: user.uid });
  return successResponse({ user });
});

