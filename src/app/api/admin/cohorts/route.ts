import { NextResponse } from "next/server";
import { mockCohortData } from "@/data/admin-mock";

export async function GET() {
  // TODO: Replace with real database query
  // TODO: Add proper authentication check
  return NextResponse.json(mockCohortData);
}

