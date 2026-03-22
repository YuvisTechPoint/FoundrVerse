import { NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { successResponse, parsePagination, withErrorHandling } from "@/lib/api-utils";
import { getAllPayments, getPaymentsByUserId } from "@/data/payments-mock";
import { getMockUsers, getMockUser } from "@/data/users-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import type { Student } from "@/data/admin-mock";

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "";

    // Get real data
    const allUsers = getMockUsers();
    const allPayments = getAllPayments();
    
    // Build students array from real data
    const students: Student[] = allUsers.map((user) => {
      const userPayments = getPaymentsByUserId(user.uid);
      const paidPayment = userPayments.find(
        (p) => p.status === "paid" || p.status === "captured" || p.status === "authorized"
      );
      const progress = getCourseProgress(user.uid);
      
      // Determine enrollment status
      let enrollmentStatus: Student["enrollmentStatus"] = "pending_payment";
      if (paidPayment) {
        if (progress.progress >= 100) {
          enrollmentStatus = "completed";
        } else if (progress.progress > 0) {
          enrollmentStatus = "active";
        } else {
          enrollmentStatus = "active";
        }
      }
      
      // Check for refunds
      const hasRefund = userPayments.some((p) => p.status === "refunded" || p.status === "partially_refunded");
      if (hasRefund) {
        enrollmentStatus = "refunded";
      }
      
      return {
        id: user.uid,
        name: user.displayName || user.email || "Unknown",
        email: user.email || "",
        college: "Not specified", // TODO: Add college field to user data
        year: 0, // TODO: Add year field to user data
        enrollmentStatus,
        paymentStatus: paidPayment ? "paid" : (hasRefund ? "refunded" : "pending"),
        amount: paidPayment?.amount || 0,
        cohort: paidPayment?.cohort || "Not assigned",
        certificateIssued: progress.progress >= 100,
        internshipStatus: progress.progress >= 50 ? "eligible" : "none",
        topPerformer: progress.progress >= 80,
        createdAt: new Date(user.lastLoginAt).toISOString().split("T")[0],
        lastActivity: new Date(user.lastLoginAt).toISOString().split("T")[0],
        progress: progress.progress,
      };
    });

    let filtered = students;

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

    // Sort by last activity (most recent first)
    filtered.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

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

