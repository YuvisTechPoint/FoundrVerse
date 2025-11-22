"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RealtimeIndicator from "./RealtimeIndicator";

export default function AdminHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrganizationName(localStorage.getItem("adminOrganization"));
      setAdminEmail(localStorage.getItem("adminEmail"));
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4 max-w-full">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="relative flex-1 max-w-md min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students, courses, revenue..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <RealtimeIndicator />
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New enrollment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Payment received</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-[#f9c866] rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-charcoal" />
              </div>
            </button>
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{adminEmail || "admin@foundrverse.com"}</p>
                    {organizationName && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                        {organizationName}
                      </p>
                    )}
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("isAdmin");
                      localStorage.removeItem("adminOrganization");
                      localStorage.removeItem("adminEmail");
                      setShowProfile(false);
                      router.push("/admin/login");
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

