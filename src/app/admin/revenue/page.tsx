"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RevenueChart from "@/components/admin/RevenueChart";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";

export default function RevenuePage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgPerStudent: 0,
    refunds: 0,
  });

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

    // Fetch revenue stats
    fetch("/api/admin/revenue/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        setStats({
          totalRevenue: 674550,
          monthlyRevenue: 209860,
          avgPerStudent: 1499,
          refunds: 0,
        });
      });
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

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-3xl font-bold text-charcoal">Revenue Analytics</h1>
              <p className="text-gray-600 mt-1">Track revenue, payments, and financial metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gold p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-charcoal" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">+24%</span>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-charcoal">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">+12%</span>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">This Month</h3>
                <p className="text-2xl font-bold text-charcoal">₹{(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Avg per Student</h3>
                <p className="text-2xl font-bold text-charcoal">₹{stats.avgPerStudent}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-500 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Refunds</h3>
                <p className="text-2xl font-bold text-charcoal">₹{stats.refunds}</p>
              </div>
            </div>

            <RevenueChart />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

