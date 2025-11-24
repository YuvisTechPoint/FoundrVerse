"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LayoutDashboard, BookOpen } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status and purchase status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated || false);
          setHasPurchased(data.hasPurchased || false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setHasPurchased(false);
      }
    };
    checkAuth();
  }, [pathname]);

  const handlePricingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If we're already on the home page, scroll to pricing section
    if (pathname === "/") {
      e.preventDefault();
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        const offset = 112; // Account for fixed navbar (top-4 + h-20 + padding)
        const elementPosition = pricingSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
    // Otherwise, let Next.js handle navigation to /#pricing
  };

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[85%] md:w-[80%] max-w-4xl transition-all duration-500 rounded-full mx-auto border-2 ${
      scrolled 
        ? 'glass-strong shadow-premium-lg border-gray-300 dark:border-gray-700/50 shadow-xl' 
        : 'glass border-gray-200 dark:border-gray-700/30 shadow-lg'
    }`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-20 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="flex items-center gap-3 transition-colors text-gray-900 dark:text-white group"
            >
              {/* Logo Image */}
              <motion.div 
                className="relative w-12 h-12 flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/mewayz.jpeg"
                  alt="Mewayz FoundrVerse Logo"
                  fill
                  className="object-contain rounded-lg group-hover:opacity-90 transition-opacity"
                  sizes="48px"
                  priority
                />
              </motion.div>
              {/* Text */}
              <div className="flex flex-col">
                <motion.span 
                  className="text-xl font-bold tracking-tight leading-tight"
                  whileHover={{ scale: 1.05 }}
                >
                  Mewayz
                </motion.span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider leading-tight">FoundrVerse</span>
              </div>
            </Link>
          </motion.div>
          <nav className="flex items-center gap-3">
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-charcoal dark:hover:text-white transition-colors relative group flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            )}
            {!hasPurchased && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link 
                  href="/#pricing" 
                  onClick={handlePricingClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-charcoal dark:hover:text-white transition-colors relative group"
                >
                  Pricing
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            )}
            {hasPurchased && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-charcoal dark:hover:text-white transition-colors relative group flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Course
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            )}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-charcoal dark:hover:text-white transition-colors relative group"
                >
                  Login / Signup
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={isAuthenticated ? "/dashboard" : "/signup"} 
                className="rounded-xl bg-gradient-to-r from-gold via-[#f9c866] to-[#fcd34d] text-charcoal px-6 py-2.5 text-sm font-bold shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-white/30 backdrop-blur-sm"
              >
                {isAuthenticated ? "Go To Course" : "Get Started"}
              </Link>
            </motion.div>
          </nav>
        </div>
      </div>
    </header>
  );
}
