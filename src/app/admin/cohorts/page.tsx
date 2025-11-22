"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RegistrationsChart from "@/components/admin/RegistrationsChart";
import { motion } from "framer-motion";
import { Calendar, Users, UserCheck, GraduationCap } from "lucide-react";

interface Cohort {
  cohort: string;
  registrations: number;
  active: number;
  completed: number;
  revenue: number;
}

export default function CohortsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

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

    const fetchData = () => {
      fetch("/api/admin/cohorts")
        .then((res) => res.json())
        .then((data) => setCohorts(data))
        .catch(() => {
          setCohorts([
            { cohort: "Batch 2024-01", registrations: 120, active: 95, completed: 25, revenue: 179880 },
            { cohort: "Batch 2024-02", registrations: 150, active: 130, completed: 20, revenue: 224850 },
            { cohort: "Batch 2024-03", registrations: 180, active: 175, completed: 5, revenue: 269820 },
          ]);
        });
    };

    fetchData();

    // Real-time updates
    const interval = setInterval(fetchData, 30000);
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
              <h1 className="text-3xl font-bold text-charcoal">Cohort Management</h1>
              <p className="text-gray-600 mt-1">Track performance across different batches</p>
            </div>

            <RegistrationsChart />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {cohorts.map((cohort) => (
                <motion.div
                  key={cohort.cohort}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gold p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-charcoal" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">{cohort.cohort}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Registrations</span>
                      </div>
                      <span className="font-bold text-charcoal">{cohort.registrations}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <span className="font-bold text-blue-600">{cohort.active}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <span className="font-bold text-green-600">{cohort.completed}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="font-bold text-charcoal">₹{(cohort.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-gold to-[#f9c866] h-2 rounded-full"
                          style={{ width: `${(cohort.completed / cohort.registrations) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((cohort.completed / cohort.registrations) * 100).toFixed(1)}% completion rate
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

