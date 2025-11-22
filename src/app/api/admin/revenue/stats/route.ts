import { NextResponse } from "next/server";
import { mockOverview } from "@/data/admin-mock";

export async function GET() {
  // TODO: Replace with real database query
  return NextResponse.json({
    totalRevenue: mockOverview.totalRevenue,
    monthlyRevenue: 209860,
    avgPerStudent: 1499,
    refunds: 0,
  });
}

