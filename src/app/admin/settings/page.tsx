"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Database, Mail, Key } from "lucide-react";

export default function SettingsPage() {
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
              <h1 className="text-3xl font-bold text-charcoal">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your admin account and preferences</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal">General Settings</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="FoundrVerse"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Default Currency</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Email notifications for new enrollments</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">SMS notifications for payments</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Weekly summary reports</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal">Security</h2>
                </div>
                <div className="space-y-4">
                  <button className="w-full sm:w-auto px-6 py-2 bg-charcoal text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Change Password
                  </button>
                  <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-charcoal rounded-lg font-semibold hover:bg-gray-50 transition-colors ml-0 sm:ml-3">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-500 p-3 rounded-lg">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal">Data Management</h2>
                </div>
                <div className="space-y-4">
                  <button className="w-full sm:w-auto px-6 py-2 bg-gold text-charcoal rounded-lg font-semibold hover:bg-[#f9c866] transition-colors">
                    Export All Data
                  </button>
                  <button className="w-full sm:w-auto px-6 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors ml-0 sm:ml-3">
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

