import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { getAllAssignments, getAssignmentsByWeek } from "@/lib/db/services/assignments";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const cookieStore = await request.cookies;
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const week = searchParams.get("week");

    let assignments;
    if (week) {
      const weekNumber = parseInt(week, 10);
      if (isNaN(weekNumber)) {
        return errorResponse("Invalid week parameter", 400);
      }
      assignments = await getAssignmentsByWeek(weekNumber);
    } else {
      assignments = await getAllAssignments();
    }

    logger.info("Assignments fetched", {
      userId: decoded.uid,
      count: assignments.length,
      week: week || "all",
    });

    return successResponse({ assignments });
  } catch (error: any) {
    logger.error("Failed to fetch assignments", error);
    return errorResponse(error.message || "Failed to fetch assignments", 500);
  }
});

