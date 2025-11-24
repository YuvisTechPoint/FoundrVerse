import { NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { successResponse, withErrorHandling } from "@/lib/api-utils";
import { getAllPayments } from "@/data/payments-mock";
import type { RevenueData } from "@/data/admin-mock";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    const allPayments = getAllPayments();
    const paidPayments = allPayments.filter(
      (p) => p.status === "paid" || p.status === "captured" || p.status === "authorized"
    );
    
    // Group payments by month
    const monthlyData = new Map<string, { revenue: number; students: number }>();
    
    paidPayments.forEach((payment) => {
      if (!payment.paidAt) return;
      
      const date = new Date(payment.paidAt);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      
      const existing = monthlyData.get(monthKey) || { revenue: 0, students: 0 };
      existing.revenue += payment.amount;
      existing.students += 1;
      monthlyData.set(monthKey, existing);
    });
    
    // Convert to array and sort by date
    const revenueData: RevenueData[] = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        students: data.students,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
    
    return successResponse(revenueData);
  })
);

