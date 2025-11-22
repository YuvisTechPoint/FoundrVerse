import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { verifySessionCookie } from "@/lib/verifySession";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);
  if (decoded?.uid) {
    try {
      await getFirebaseAdminAuth().revokeRefreshTokens(decoded.uid);
    } catch (error) {
      console.warn("Failed to revoke Firebase refresh tokens", error);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(SESSION_SIGNATURE_COOKIE_NAME);

  // Redirect to home page after logout
  const url = new URL("/", request.url);
  return NextResponse.redirect(url);
}

