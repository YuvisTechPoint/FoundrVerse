"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OverviewCards from "@/components/admin/OverviewCards";
import RevenueChart from "@/components/admin/RevenueChart";
import RegistrationsChart from "@/components/admin/RegistrationsChart";
import StudentsTable from "@/components/admin/StudentsTable";
import { useAdminAuth } from "@/lib/useAdminAuth";

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminAuth();

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

  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // useAdminAuth handles redirect
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

