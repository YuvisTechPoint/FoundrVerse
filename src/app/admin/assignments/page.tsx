"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AssignmentReviewModal from "@/components/admin/AssignmentReviewModal";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, XCircle, Download, Search } from "lucide-react";

interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  files: any[];
  description?: string;
  status: "draft" | "submitted" | "graded" | "revision_required";
  score?: number;
  maxScore?: number;
  feedback?: string;
  submittedAt?: string;
  createdAt: string;
  assignment?: {
    title: string;
    week: number;
  };
}

export default function AdminAssignmentsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [filter, setFilter] = useState<"all" | "submitted" | "graded" | "draft">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = localStorage.getItem("isAdmin") === "true";
      if (!adminStatus) {
        router.push("/admin/login");
        return;
      }
      setIsAdmin(true);
    };
    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin, filter]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/assignments/submissions");
      if (!response.ok) throw new Error("Failed to fetch submissions");
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradingSuccess = () => {
    setSelectedSubmission(null);
    fetchSubmissions();
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter !== "all" && sub.status !== filter) return false;
    if (searchTerm && !sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold">
            Awaiting Review
          </span>
        );
      case "graded":
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
            Graded
          </span>
        );
      case "revision_required":
        return (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">
            Revision Required
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <AdminHeader />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 lg:p-8"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-charcoal dark:text-white">Assignment Submissions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Review and grade student assignments</p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "submitted", "graded", "draft"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      filter === status
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No submissions found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {submission.assignment?.title || "Assignment"}
                            </h3>
                            {getStatusBadge(submission.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span className="font-medium">{submission.userName}</span> ({submission.userEmail})
                          </p>
                          {submission.submittedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          )}
                          {submission.score !== undefined && (
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                              Score: {submission.score} / {submission.maxScore || 100}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            {submission.status === "graded" ? "View" : "Review"}
                          </button>
                        </div>
                      </div>
                      {submission.files && submission.files.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {submission.files.map((file: any, index: number) => (
                            <a
                              key={index}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              {file.fileName}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {selectedSubmission && (
        <AssignmentReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSuccess={handleGradingSuccess}
        />
      )}
    </div>
  );
}

