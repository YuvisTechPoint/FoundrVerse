import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import type { AuthenticatedRequest } from "@/lib/auth-middleware";
import { gradeSubmission } from "@/lib/db/services/assignments";
import { withErrorHandling, errorResponse, successResponse, validateRequired, validateNumber } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const POST = withErrorHandling(
  withAdminAuth(async (
    request: AuthenticatedRequest,
    ...args: unknown[]
  ) => {
    try {
      // Extract dynamic route params (Next.js 16: params may be a Promise)
      const firstArg = args[0] as { params?: unknown } | undefined;
      let submissionId: string | undefined;

      if (firstArg && typeof firstArg === "object" && firstArg.params) {
        const paramsAny = (firstArg as { params: unknown }).params as unknown;
        if (paramsAny && typeof (paramsAny as Promise<unknown>).then === "function") {
          const resolved = await (paramsAny as Promise<{ id: string }>);
          submissionId = resolved.id;
        } else {
          submissionId = (paramsAny as { id: string }).id;
        }
      }

      if (!submissionId) {
        return errorResponse("Missing route parameter 'id'", 400);
      }

      const body = await request.json();
      const { score, maxScore, feedback, status } = body;

      // Validate required fields
      const required = validateRequired({ score, maxScore, status }, ["score", "maxScore", "status"]);
      if (!required.isValid) {
        return errorResponse(`Missing required fields: ${required.missing.join(", ")}`, 400);
      }

      // Validate numbers with bounds
      const scoreValidation = validateNumber(score, 0, maxScore);
      if (!scoreValidation.isValid) {
        return errorResponse(scoreValidation.error || "Invalid score", 400);
      }

      const maxScoreValidation = validateNumber(maxScore, 1, 1000);
      if (!maxScoreValidation.isValid) {
        return errorResponse(maxScoreValidation.error || "Invalid max score", 400);
      }

      if (!["graded", "revision_required"].includes(status)) {
        return errorResponse("Invalid status. Must be 'graded' or 'revision_required'", 400);
      }

      // Use authenticated user id when available
      const gradedBy = request.user?.uid ?? "admin";

      const submission = await gradeSubmission(submissionId, {
        score: typeof score === "string" ? parseInt(score, 10) : Number(score),
        maxScore: typeof maxScore === "string" ? parseInt(maxScore, 10) : Number(maxScore),
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
    } catch (error: unknown) {
      logger.error("Failed to grade submission", error);
      const message = error instanceof Error ? error.message : "Failed to grade submission";
      return errorResponse(message, 500);
    }
  })
);

