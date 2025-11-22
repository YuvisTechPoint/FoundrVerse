"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, Clock, XCircle, Building2 } from "lucide-react";

interface Internship {
  id: string;
  studentName: string;
  studentEmail: string;
  company: string;
  status: "eligible" | "assigned" | "in_progress" | "completed";
  assignedDate?: string;
  startDate?: string;
  endDate?: string;
}

export default function InternshipsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);

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

    // Fetch internships
    fetch("/api/admin/internships")
      .then((res) => res.json())
      .then((data) => setInternships(data))
      .catch(() => {
        // Mock data
        setInternships([
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
        ]);
      });

    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetch("/api/admin/internships")
        .then((res) => res.json())
        .then((data) => setInternships(data))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      eligible: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      assigned: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      in_progress: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
      completed: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const companies = ["Mewayz", "MyAiNation", "PhantomX", "careflow HMS"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-screen">
          <AdminHeader />
          <div className="pt-6 pb-8 px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Internship Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage student internships and placements across all partner companies
                </p>
              </div>

              {/* Company Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {companies.map((company) => {
                  const activeCount = internships.filter(
                    (i) => i.company === company && (i.status === "in_progress" || i.status === "assigned")
                  ).length;
                  return (
                    <motion.div
                      key={company}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {company}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {activeCount}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Active {activeCount === 1 ? "internship" : "internships"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Internships Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Internships</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {internships.length} total
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {internships.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No internships found</p>
                          </td>
                        </tr>
                      ) : (
                        internships.map((internship) => (
                          <tr
                            key={internship.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {internship.studentName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {internship.studentEmail}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {internship.company}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(internship.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {internship.startDate && internship.endDate ? (
                                <div className="text-sm">
                                  <p className="text-gray-900 dark:text-white">
                                    {new Date(internship.startDate).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    to{" "}
                                    {new Date(internship.endDate).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {internship.status === "eligible" && (
                                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow">
                                  Assign
                                </button>
                              )}
                              {internship.status !== "eligible" && (
                                <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

