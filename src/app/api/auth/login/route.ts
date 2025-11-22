import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { errorResponse, successResponse, ApiException, withErrorHandling, validateRequired } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch(() => {
    throw new ApiException("Invalid JSON in request body", 400, "INVALID_JSON");
  });
  
  const validation = validateRequired(body, ['idToken']);
  if (!validation.isValid) {
    throw new ApiException("idToken is required", 400, "MISSING_ID_TOKEN");
  }

  const { idToken } = body;

  // Verify the ID token
  const adminAuth = getFirebaseAdminAuth();
  const decodedToken = await adminAuth.verifyIdToken(idToken, true).catch((error) => {
    logger.error("Token verification failed", error);
    
    if (error.code === "auth/user-not-found") {
      throw new ApiException("User not found", 401, "USER_NOT_FOUND");
    } else if (error.code === "auth/wrong-password") {
      throw new ApiException("Invalid password", 401, "INVALID_PASSWORD");
    } else if (error.code === "auth/invalid-credential") {
      throw new ApiException("Invalid email or password", 401, "INVALID_CREDENTIAL");
    }
    
    throw new ApiException("Failed to verify token", 401, "TOKEN_VERIFICATION_FAILED");
  });

  // Create session cookie
  const expiresInSeconds = Math.floor(SESSION_DURATION_MS / 1000);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: expiresInSeconds,
  }).catch((error) => {
    logger.error("Failed to create session cookie", error);
    throw new ApiException("Failed to create session", 500, "SESSION_CREATION_FAILED");
  });

  logger.info("Login successful", { uid: decodedToken.uid });

  return successResponse({
    sessionCookie,
    user: {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
    },
  });
});

