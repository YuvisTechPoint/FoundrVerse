import { createHmac, timingSafeEqual } from "crypto";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";

function validateSignature(sessionCookie: string, signature?: string | null) {
  const secret = process.env.SESSION_COOKIE_SECRET;
  if (!secret) {
    return true;
  }
  if (!signature) {
    return false;
  }
  const expected = createHmac("sha256", secret).update(sessionCookie).digest("base64url");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function verifySessionCookie(sessionCookie?: string | null, sessionSignature?: string | null) {
  if (!sessionCookie) {
    return null;
  }

  if (!validateSignature(sessionCookie, sessionSignature)) {
    return null;
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch (error) {
    console.warn("Failed to verify Firebase session cookie", error);
    return null;
  }
}

