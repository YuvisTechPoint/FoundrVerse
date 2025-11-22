import { NextResponse } from "next/server";
import { mockStudents } from "@/data/admin-mock";

export async function GET(request: Request) {
  // TODO: Replace with real database query
  // TODO: Add proper authentication check
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "";

  let filtered = [...mockStudents];

  if (search) {
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.college.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter) {
    filtered = filtered.filter((s) => s.enrollmentStatus === filter);
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return NextResponse.json({
    students: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  });
}

