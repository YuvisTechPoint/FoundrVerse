import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { gradeSubmission } from "@/lib/db/services/assignments";
import { withErrorHandling, errorResponse, successResponse, validateRequired, validateNumber } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const POST = withErrorHandling(
  withAdminAuth(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const submissionId = (await params).id;
      const body = await request.json();
      const { score, maxScore, feedback, status } = body;

      // Validate required fields
      validateRequired({ score, maxScore, status }, ["score", "maxScore", "status"]);

      // Validate numbers
      validateNumber(score, "score", 0, maxScore);
      validateNumber(maxScore, "maxScore", 1, 1000);

      if (!["graded", "revision_required"].includes(status)) {
        return errorResponse("Invalid status. Must be 'graded' or 'revision_required'", 400);
      }

      // Get admin user ID from session
      const cookieStore = await request.cookies;
      const sessionCookie = cookieStore.get("session")?.value ?? null;
      const sessionSignature = cookieStore.get("session_sig")?.value ?? null;
      
      // Verify session to get user ID (simplified - in production, extract from auth middleware)
      let gradedBy = "admin"; // TODO: Extract from auth token

      const submission = await gradeSubmission(submissionId, {
        score: parseInt(score, 10),
        maxScore: parseInt(maxScore, 10),
        feedback: feedback || "",
        gradedBy,
        status: status as "graded" | "revision_required",
      });

      if (!submission) {
        return errorResponse("Submission not found", 404);
      }

      logger.info("Assignment graded", {
        submissionId,
        score,
        maxScore,
        status,
        gradedBy,
      });

      return successResponse({
        submission,
        message: "Assignment graded successfully",
      });
    } catch (error: any) {
      logger.error("Failed to grade submission", error);
      return errorResponse(error.message || "Failed to grade submission", 500);
    }
  })
);

