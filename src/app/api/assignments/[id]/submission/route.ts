import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { getUserSubmissionForAssignment } from "@/lib/db/services/assignments";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export const GET = withErrorHandling(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  const cookieStore = await request.cookies;
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const assignmentId = id;
    const submission = await getUserSubmissionForAssignment(decoded.uid, assignmentId);

    logger.info("Assignment submission fetched", {
      userId: decoded.uid,
      assignmentId,
      hasSubmission: !!submission,
    });

    return successResponse({ submission: submission || null });
  } catch (error: any) {
    logger.error("Failed to fetch submission", error);
    return errorResponse(error.message || "Failed to fetch submission", 500);
  }
});

