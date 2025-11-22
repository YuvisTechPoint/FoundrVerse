import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { verifySessionCookie } from "@/lib/verifySession";
import { logger } from "@/lib/logger";
import { withErrorHandling } from "@/lib/api-utils";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);
  if (decoded?.uid) {
    try {
      await getFirebaseAdminAuth().revokeRefreshTokens(decoded.uid);
      logger.info("Refresh tokens revoked", { uid: decoded.uid });
    } catch (error) {
      logger.warn("Failed to revoke Firebase refresh tokens", { error });
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(SESSION_SIGNATURE_COOKIE_NAME);

  logger.info("User logged out successfully", { uid: decoded?.uid });

  // Redirect to home page after logout
  const url = new URL("/", request.url);
  return NextResponse.redirect(url);
});

