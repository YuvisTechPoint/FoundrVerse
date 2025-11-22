import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { errorResponse, successResponse, validateRequired, ApiException, withErrorHandling } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch(() => {
    throw new ApiException("Invalid JSON in request body", 400, "INVALID_JSON");
  });

  const { idToken, name, phone } = body;

  const validation = validateRequired(body, ['idToken']);
  if (!validation.isValid) {
    throw new ApiException(
      "idToken is required. User must be created on client side first.",
      400,
      "MISSING_ID_TOKEN"
    );
  }

  // Verify the ID token from client-side signup
  const adminAuth = getFirebaseAdminAuth();
  const decodedToken = await adminAuth.verifyIdToken(idToken, true).catch((error) => {
    logger.error("Token verification failed during signup", error);
    if (error.code === "auth/invalid-id-token") {
      throw new ApiException("Invalid authentication token", 400, "INVALID_TOKEN");
    }
    throw new ApiException("Failed to verify token", 400, "TOKEN_VERIFICATION_FAILED");
  });

  // Update user profile with additional info
  await adminAuth.updateUser(decodedToken.uid, {
    displayName: name || decodedToken.name,
    phoneNumber: phone || undefined,
  }).catch((error) => {
    logger.error("Failed to update user profile", error);
    throw new ApiException("Failed to update user profile", 500, "UPDATE_FAILED");
  });

  // Set custom claims for additional user data
  await adminAuth.setCustomUserClaims(decodedToken.uid, {
    name: name || decodedToken.name,
    phone: phone || null,
  }).catch((error) => {
    logger.error("Failed to set custom claims", error);
    // Don't fail the request if custom claims fail
    logger.warn("Continuing without custom claims", { uid: decodedToken.uid });
  });

  logger.info("User signup completed successfully", { uid: decodedToken.uid });

  return successResponse({
    uid: decodedToken.uid,
    email: decodedToken.email,
  });
});

