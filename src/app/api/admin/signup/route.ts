import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { createOrganization } from "@/lib/organizations";
import { errorResponse, successResponse, validateRequired, ApiException, withErrorHandling } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch(() => {
    throw new ApiException("Invalid JSON in request body", 400, "INVALID_JSON");
  });

  const { idToken, organizationName, email, name } = body;

  const validation = validateRequired(body, ["idToken", "organizationName", "email"]);
  if (!validation.isValid) {
    throw new ApiException(
      `Missing required fields: ${validation.missing.join(", ")}`,
      400,
      "MISSING_FIELDS",
      { missing: validation.missing }
    );
  }

  // Verify the ID token from client-side signup
  const adminAuth = getFirebaseAdminAuth();
  const decodedToken = await adminAuth.verifyIdToken(idToken, true).catch((error) => {
    logger.error("Token verification failed during admin signup", error);
    if (error.code === "auth/invalid-id-token") {
      throw new ApiException("Invalid authentication token", 400, "INVALID_TOKEN");
    }
    throw new ApiException("Failed to verify token", 400, "TOKEN_VERIFICATION_FAILED");
  });

  // Check if user already has an organization
  const { getOrganizationByAdminUid } = await import("@/lib/organizations");
  const existingOrg = await getOrganizationByAdminUid(decodedToken.uid);
  if (existingOrg) {
    throw new ApiException(
      "This account already has an organization. Please login instead.",
      400,
      "ORGANIZATION_EXISTS"
    );
  }

  // Update user profile with name if provided
  if (name) {
    await adminAuth.updateUser(decodedToken.uid, {
      displayName: name || decodedToken.name,
    }).catch((error) => {
      logger.error("Failed to update user profile", error);
      // Don't fail the request if profile update fails
    });
  }

  // Create organization in Firestore
  let organization;
  try {
    organization = await createOrganization({
      name: organizationName.trim(),
      email: email.toLowerCase().trim(),
      adminUid: decodedToken.uid,
      adminEmail: decodedToken.email || email.toLowerCase().trim(),
    });
  } catch (error: any) {
    logger.error("Failed to create organization", error);
    throw new ApiException(
      error.message || "Failed to create organization",
      400,
      "ORGANIZATION_CREATION_FAILED"
    );
  }

  // Set custom claims for admin role and organization
  await adminAuth.setCustomUserClaims(decodedToken.uid, {
    admin: true,
    role: "admin",
    organizationId: organization.id,
    organizationName: organization.name,
    name: name || decodedToken.name,
  }).catch((error) => {
    logger.error("Failed to set admin custom claims", error);
    // If claims fail, we should still allow the signup but log the error
    logger.warn("Admin signup completed but custom claims failed", {
      uid: decodedToken.uid,
      organizationId: organization.id,
    });
  });

  logger.info("Admin signup completed successfully", {
    uid: decodedToken.uid,
    organizationId: organization.id,
    organizationName: organization.name,
  });

  return successResponse({
    user: {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: name || decodedToken.name,
    },
    organization: {
      id: organization.id,
      name: organization.name,
      email: organization.email,
    },
  });
});

