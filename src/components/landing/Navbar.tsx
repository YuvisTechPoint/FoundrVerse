"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-4xl transition-all duration-300 rounded-full mx-auto border-2 border-gray-300 dark:border-gray-700 ${
      scrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
        : 'bg-white/95 dark:bg-gray-900/95'
    }`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-3 transition-colors text-gray-900 dark:text-white group"
          >
            {/* Logo Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/mewayz.jpeg"
                alt="Mewayz FoundrVerse Logo"
                fill
                className="object-contain rounded-lg group-hover:opacity-90 transition-opacity"
                sizes="48px"
                priority
              />
            </div>
            {/* Text */}
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-tight">Mewayz</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider leading-tight">FoundrVerse</span>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link 
              href="/#pricing" 
              onClick={handlePricingClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              Login / Signup
            </Link>
            <ThemeToggle />
            <Link 
              href="/signup" 
              className="rounded-xl bg-gradient-to-r from-gold to-[#f9c866] text-charcoal px-6 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
