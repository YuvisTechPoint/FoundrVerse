"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Briefcase, 
  Megaphone, 
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/internships", label: "Internships", icon: Briefcase },
  { href: "/admin/pitches", label: "Pitches", icon: Megaphone },
  { href: "/admin/cohorts", label: "Cohorts", icon: Calendar },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminOrganization");
    localStorage.removeItem("adminEmail");
    router.push("/admin/login");
  };

  const SidebarContent = () => {
    const organizationName = typeof window !== "undefined" ? localStorage.getItem("adminOrganization") : null;
    
    return (
      <>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <Link href="/" className="flex items-center gap-3 transition-colors duration-300 hover:opacity-80">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/mewayz.jpeg"
                alt="Mewayz FoundrVerse Logo"
                fill
                className="object-contain rounded"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-charcoal dark:text-white">Mewayz</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">FoundrVerse</span>
            </div>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Admin Panel</p>
          {organizationName && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Organization
              </p>
              <p className="text-sm font-semibold text-charcoal dark:text-white mt-1 truncate" title={organizationName}>
                {organizationName}
              </p>
            </div>
          )}
        </div>
      
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-gold to-[#f9c866] text-charcoal font-semibold shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-colors duration-300"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 flex-col transition-colors duration-300">
        <SidebarContent />
      </aside>
    </>
  );
}

