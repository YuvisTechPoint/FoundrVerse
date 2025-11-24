import { NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { successResponse, withErrorHandling } from "@/lib/api-utils";
import { getAllPayments } from "@/data/payments-mock";
import { getMockUsers } from "@/data/users-mock";
import { getCourseProgress } from "@/data/course-progress-mock";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    // Get real data from stores
    const allPayments = getAllPayments();
    const allUsers = getMockUsers();
    
    // Calculate real statistics
    const paidPayments = allPayments.filter(
      (p) => p.status === "paid" || p.status === "captured" || p.status === "authorized"
    );
    
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalStudents = allUsers.length;
    
    // Calculate active students (users with paid payments who have progress > 0)
    const activeStudentIds = new Set(
      paidPayments.map((p) => p.userId).filter((id): id is string => !!id)
    );
    const activeStudents = Array.from(activeStudentIds).filter((uid) => {
      const progress = getCourseProgress(uid);
      return progress.progress > 0;
    }).length;
    
    // Calculate conversion rate (paid / total signups)
    const totalSignups = allUsers.length;
    const paidCount = paidPayments.length;
    const conversionRate = totalSignups > 0 ? (paidCount / totalSignups) * 100 : 0;
    
    // Calculate open internships (students eligible for internship)
    const eligibleForInternship = Array.from(activeStudentIds).filter((uid) => {
      const progress = getCourseProgress(uid);
      return progress.progress >= 50; // 50% progress makes them eligible
    }).length;
    
    return successResponse({
      totalStudents,
      activeStudents,
      totalRevenue,
      conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
      openInternships: eligibleForInternship,
    });
  })
);

