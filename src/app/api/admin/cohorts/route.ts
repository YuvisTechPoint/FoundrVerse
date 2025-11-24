import { NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { successResponse, withErrorHandling } from "@/lib/api-utils";
import { getAllPayments } from "@/data/payments-mock";
import { getMockUsers } from "@/data/users-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import type { CohortData } from "@/data/admin-mock";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    const allPayments = getAllPayments();
    const allUsers = getMockUsers();
    const paidPayments = allPayments.filter(
      (p) => p.status === "paid" || p.status === "captured" || p.status === "authorized"
    );
    
    // Group by cohort
    const cohortMap = new Map<string, { registrations: Set<string>; active: Set<string>; completed: Set<string> }>();
    
    paidPayments.forEach((payment) => {
      if (!payment.userId || !payment.cohort) return;
      
      const cohort = payment.cohort;
      if (!cohortMap.has(cohort)) {
        cohortMap.set(cohort, {
          registrations: new Set(),
          active: new Set(),
          completed: new Set(),
        });
      }
      
      const cohortData = cohortMap.get(cohort)!;
      cohortData.registrations.add(payment.userId);
      
      const progress = getCourseProgress(payment.userId);
      if (progress.progress > 0) {
        cohortData.active.add(payment.userId);
      }
      if (progress.progress >= 100) {
        cohortData.completed.add(payment.userId);
      }
    });
    
    // Convert to array format
    const cohortData: CohortData[] = Array.from(cohortMap.entries())
      .map(([cohort, data]) => ({
        cohort,
        registrations: data.registrations.size,
        active: data.active.size,
        completed: data.completed.size,
      }))
      .sort((a, b) => a.cohort.localeCompare(b.cohort));
    
    return successResponse(cohortData);
  })
);

