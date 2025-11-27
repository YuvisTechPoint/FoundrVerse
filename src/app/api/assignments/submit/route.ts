import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { createSubmission, getUserSubmissionForAssignment } from "@/lib/db/services/assignments";
import { withErrorHandling, errorResponse, successResponse, validateRequired } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import type { FileSubmission } from "@/lib/db/types";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const cookieStore = await request.cookies;
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { assignmentId, files, description, status = "submitted" } = body;

    // Validate required fields
    validateRequired({ assignmentId, files }, ["assignmentId", "files"]);

    if (!Array.isArray(files) || files.length === 0) {
      return errorResponse("At least one file is required", 400);
    }

    // Check if user already has a submission for this assignment
    const existingSubmission = await getUserSubmissionForAssignment(decoded.uid, assignmentId);
    
    if (existingSubmission && existingSubmission.status === "submitted") {
      return errorResponse("You have already submitted this assignment", 400);
    }

    // Validate files structure
    const validatedFiles: FileSubmission[] = files.map((file: any, index: number) => {
      if (!file.fileUrl || !file.fileName) {
        throw new Error(`File at index ${index} is missing required fields (fileUrl, fileName)`);
      }
      return {
        id: file.id || `file_${Date.now()}_${index}`,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileSize: file.fileSize || 0,
        mimeType: file.mimeType || "application/octet-stream",
        uploadedAt: file.uploadedAt || new Date().toISOString(),
      };
    });

    // Create or update submission
    const submissionData = {
      assignmentId,
      userId: decoded.uid,
      userEmail: decoded.email || "",
      userName: decoded.name || decoded.email || "Student",
      files: validatedFiles,
      description: description || "",
      status: status as "draft" | "submitted" | "graded" | "revision_required",
    };

    let submission;
    if (existingSubmission) {
      // Update existing draft submission
      const { updateSubmission } = await import("@/lib/db/services/assignments");
      submission = await updateSubmission(existingSubmission.id, {
        ...submissionData,
        submittedAt: status === "submitted" ? new Date().toISOString() : undefined,
      });
    } else {
      // Create new submission
      submission = await createSubmission(submissionData);
    }

    if (!submission) {
      return errorResponse("Failed to create submission", 500);
    }

    logger.info("Assignment submission created/updated", {
      submissionId: submission.id,
      assignmentId,
      userId: decoded.uid,
      status,
    });

    return successResponse({
      submission,
      message: status === "submitted" 
        ? "Assignment submitted successfully" 
        : "Assignment saved as draft",
    });
  } catch (error: any) {
    logger.error("Assignment submission failed", error);
    return errorResponse(error.message || "Failed to submit assignment", 500);
  }
});

