import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { verifyAdminOrganization } from "@/lib/organizations";
import { errorResponse, successResponse, validateRequired, ApiException, withErrorHandling } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch(() => {
    throw new ApiException("Invalid JSON in request body", 400, "INVALID_JSON");
  });

  const { idToken, organizationName } = body;

  const validation = validateRequired(body, ["idToken", "organizationName"]);
  if (!validation.isValid) {
    throw new ApiException(
      `Missing required fields: ${validation.missing.join(", ")}`,
      400,
      "MISSING_FIELDS",
      { missing: validation.missing }
    );
  }

  // Verify the ID token
  const adminAuth = getFirebaseAdminAuth();
  const decodedToken = await adminAuth.verifyIdToken(idToken, true).catch((error) => {
    logger.error("Token verification failed", error);

    if (error.code === "auth/user-not-found") {
      throw new ApiException("User not found", 401, "USER_NOT_FOUND");
    } else if (error.code === "auth/invalid-credential") {
      throw new ApiException("Invalid email or password", 401, "INVALID_CREDENTIAL");
    }

    throw new ApiException("Failed to verify token", 401, "TOKEN_VERIFICATION_FAILED");
  });

  // Verify admin belongs to the specified organization
  let organization;
  try {
    organization = await verifyAdminOrganization(decodedToken.uid, organizationName.trim());
  } catch (error: any) {
    logger.error("Organization verification failed", error);
    throw new ApiException(
      error.message || "Organization verification failed",
      403,
      "ORGANIZATION_VERIFICATION_FAILED"
    );
  }

  if (!organization) {
    throw new ApiException(
      "Invalid organization name or you don't have access to this organization",
      403,
      "INVALID_ORGANIZATION"
    );
  }

  // Ensure custom claims are set (in case they were missing)
  const user = await adminAuth.getUser(decodedToken.uid);
  const needsClaimsUpdate =
    !user.customClaims?.admin ||
    !user.customClaims?.organizationId ||
    user.customClaims.organizationId !== organization.id;

  if (needsClaimsUpdate) {
    await adminAuth.setCustomUserClaims(decodedToken.uid, {
      ...user.customClaims,
      admin: true,
      role: "admin",
      organizationId: organization.id,
      organizationName: organization.name,
    }).catch((error) => {
      logger.error("Failed to update admin custom claims", error);
      // Don't fail the request if claims update fails
    });
  }

  // Create session cookie and set it in response
  const expiresInSeconds = Math.floor(SESSION_DURATION_MS / 1000);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: expiresInSeconds,
  }).catch((error) => {
    logger.error("Failed to create session cookie", error);
    throw new ApiException("Failed to create session", 500, "SESSION_CREATION_FAILED");
  });

  // Set session cookies
  const { cookies } = await import("next/headers");
  const { createHmac } = await import("crypto");
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  function signSessionCookie(value: string) {
    const secret = process.env.SESSION_COOKIE_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error("SESSION_COOKIE_SECRET must be configured with at least 32 characters.");
    }
    return createHmac("sha256", secret).update(value).digest("base64url");
  }

  const signature = signSessionCookie(sessionCookie);

  cookieStore.set({
    name: "session",
    value: sessionCookie,
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: expiresInSeconds,
    path: "/",
  });

  cookieStore.set({
    name: "session_sig",
    value: signature,
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: expiresInSeconds,
    path: "/",
  });

  logger.info("Admin login successful", {
    uid: decodedToken.uid,
    organizationId: organization.id,
    organizationName: organization.name,
  });

  return successResponse({
    user: {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
    },
    organization: {
      id: organization.id,
      name: organization.name,
      email: organization.email,
    },
  });
});

