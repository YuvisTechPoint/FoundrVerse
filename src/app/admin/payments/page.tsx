"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import PaymentsTable from "@/components/admin/PaymentsTable";
import { motion } from "framer-motion";

export default function PaymentsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

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
              <h1 className="text-3xl font-bold text-charcoal">Payments Management</h1>
              <p className="text-gray-600 mt-1">View and manage all payment transactions</p>
            </div>
            <PaymentsTable />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

