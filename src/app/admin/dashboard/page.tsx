"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OverviewCards from "@/components/admin/OverviewCards";
import RevenueChart from "@/components/admin/RevenueChart";
import RegistrationsChart from "@/components/admin/RegistrationsChart";
import StudentsTable from "@/components/admin/StudentsTable";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Auth check effect
  useEffect(() => {
    // TODO: Replace with real auth check (Clerk/NextAuth)
    // Mock admin check - check localStorage or session cookie
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

  // Real-time data updates - runs after auth check
  useEffect(() => {
    if (isAdmin !== true) return;

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      // Trigger re-render by updating a state if needed
      window.dispatchEvent(new Event("refresh-data"));
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-charcoal">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage students, revenue, and course analytics</p>
            </div>

            <OverviewCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <RevenueChart />
              <RegistrationsChart />
            </div>

            <div className="mt-6">
              <StudentsTable />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

