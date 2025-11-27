import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { getAllSubmissions, getSubmissionsByAssignment } from "@/lib/db/services/assignments";
import { getAssignmentById } from "@/lib/db/services/assignments";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const assignmentId = searchParams.get("assignmentId");

      let submissions;
      if (assignmentId) {
        submissions = await getSubmissionsByAssignment(assignmentId);
      } else {
        submissions = await getAllSubmissions();
      }

      // Enrich submissions with assignment details
      const enrichedSubmissions = await Promise.all(
        submissions.map(async (submission) => {
          const assignment = await getAssignmentById(submission.assignmentId);
          return {
            ...submission,
            assignment: assignment
              ? {
                  title: assignment.title,
                  week: assignment.week,
                }
              : null,
          };
        })
      );

      logger.info("Admin fetched submissions", {
        count: enrichedSubmissions.length,
        assignmentId: assignmentId || "all",
      });

      return successResponse({ submissions: enrichedSubmissions });
    } catch (error: any) {
      logger.error("Failed to fetch submissions", error);
      return errorResponse(error.message || "Failed to fetch submissions", 500);
    }
  })
);

