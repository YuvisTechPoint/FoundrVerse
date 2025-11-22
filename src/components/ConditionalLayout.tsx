"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  // Admin login/signup pages should show Navbar, but dashboard pages shouldn't
  const isAdminAuthPage = pathname === "/admin/login" || pathname === "/admin/signup";
  const isAdminDashboard = isAdminRoute && !isAdminAuthPage;

  if (isAdminDashboard) {
    // Admin dashboard pages don't need Navbar/Footer (they have their own header)
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  // Regular pages and admin auth pages get Navbar and Footer
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer className="mt-auto" />
    </>
  );
}

