import { NextResponse } from "next/server";
import { mockStudents } from "@/data/admin-mock";

export async function GET(request: Request) {
  // TODO: Replace with real database query
  // TODO: Add proper authentication check
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",") || [];

  const studentsToExport = ids.length > 0
    ? mockStudents.filter((s) => ids.includes(s.id))
    : mockStudents;

  // Generate CSV
  const headers = ["Name", "Email", "College", "Year", "Status", "Payment", "Cohort", "Progress"];
  const rows = studentsToExport.map((s) => [
    s.name,
    s.email,
    s.college,
    s.year.toString(),
    s.enrollmentStatus,
    s.paymentStatus,
    s.cohort,
    `${s.progress}%`,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="students-export-${new Date().toISOString()}.csv"`,
    },
  });
}

