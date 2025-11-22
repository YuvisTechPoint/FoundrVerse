import { NextRequest } from "next/server";
import { mockOverview } from "@/data/admin-mock";
import { withAdminAuth } from "@/lib/auth-middleware";
import { successResponse, withErrorHandling } from "@/lib/api-utils";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    // TODO: Replace with real database query
    return successResponse(mockOverview);
  })
);

