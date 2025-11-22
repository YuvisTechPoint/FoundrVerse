import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifySessionCookie } from "@/lib/verifySession";
import { getMockUser } from "@/data/users-mock";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = getMockUser(decoded.uid) ?? {
    uid: decoded.uid,
    email: decoded.email,
    displayName: decoded.name ?? decoded.email,
    photoURL: decoded.picture,
  };

  return NextResponse.json({
    authenticated: true,
    user,
  });
}

