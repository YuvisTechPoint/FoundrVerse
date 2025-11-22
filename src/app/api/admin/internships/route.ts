import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real database query
  const internships = [
    {
      id: "1",
      studentName: "Priya Sharma",
      studentEmail: "priya@example.com",
      company: "Mewayz",
      status: "in_progress",
      assignedDate: "2024-10-01",
      startDate: "2024-10-15",
      endDate: "2024-12-15",
    },
    {
      id: "2",
      studentName: "Rajesh Kumar",
      studentEmail: "rajesh@example.com",
      company: "MyAiNation",
      status: "assigned",
      assignedDate: "2024-11-01",
    },
    {
      id: "3",
      studentName: "Amit Patel",
      studentEmail: "amit@example.com",
      company: "PhantomX",
      status: "eligible",
    },
  ];

  return NextResponse.json(internships);
}

