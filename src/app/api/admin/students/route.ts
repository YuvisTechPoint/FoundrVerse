import { NextRequest } from "next/server";
import { mockStudents } from "@/data/admin-mock";
import { withAdminAuth } from "@/lib/auth-middleware";
import { successResponse, parsePagination, withErrorHandling } from "@/lib/api-utils";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    // TODO: Replace with real database query
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "";

    let filtered = [...mockStudents];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.college.toLowerCase().includes(searchLower)
      );
    }

    if (filter) {
      filtered = filtered.filter((s) => s.enrollmentStatus === filter);
    }

    const paginated = filtered.slice(offset, offset + limit);

    return successResponse({
      students: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  })
);

