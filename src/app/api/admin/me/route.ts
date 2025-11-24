import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { getOrganizationByAdminUid } from "@/lib/organizations";
import { logger } from "@/lib/logger";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

    const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

    if (!decoded) {
      return NextResponse.json(
        { authenticated: false, isAdmin: false },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminAuth = getFirebaseAdminAuth();
    const user = await adminAuth.getUser(decoded.uid);
    const isAdmin = user.customClaims?.admin === true || user.customClaims?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({
        authenticated: true,
        isAdmin: false,
        user: {
          uid: decoded.uid,
          email: decoded.email,
          name: decoded.name,
        },
      });
    }

    // Get organization info
    let organization = null;
    try {
      organization = await getOrganizationByAdminUid(decoded.uid);
    } catch (error) {
      logger.error("Failed to get organization", error);
    }

    return NextResponse.json({
      authenticated: true,
      isAdmin: true,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      },
      organization: organization
        ? {
            id: organization.id,
            name: organization.name,
            email: organization.email,
          }
        : null,
      customClaims: user.customClaims,
    });
  } catch (error) {
    logger.error("Admin me check failed", error);
    return NextResponse.json(
      { authenticated: false, isAdmin: false, error: "Authentication check failed" },
      { status: 500 }
    );
  }
}

