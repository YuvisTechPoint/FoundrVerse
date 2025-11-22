import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real database query
  const pitches = [
    {
      id: "1",
      studentName: "Rajesh Kumar",
      studentEmail: "rajesh@example.com",
      startupName: "EduTech Solutions",
      status: "funded",
      submittedDate: "2024-10-15",
      reviewDate: "2024-11-01",
      fundingAmount: 50000,
      investorFeedback: "Strong team and clear market opportunity",
    },
    {
      id: "2",
      studentName: "Priya Sharma",
      studentEmail: "priya@example.com",
      startupName: "HealthApp",
      status: "scheduled",
      submittedDate: "2024-11-10",
      reviewDate: "2024-11-25",
    },
    {
      id: "3",
      studentName: "Amit Patel",
      studentEmail: "amit@example.com",
      startupName: "FinTech Platform",
      status: "submitted",
      submittedDate: "2024-11-18",
    },
  ];

  const stats = {
    total: pitches.length,
    scheduled: pitches.filter((p) => p.status === "scheduled").length,
    funded: pitches.filter((p) => p.status === "funded").length,
    totalFunding: pitches.reduce((sum, p) => sum + (p.fundingAmount || 0), 0),
  };

  return NextResponse.json({ pitches, stats });
}

