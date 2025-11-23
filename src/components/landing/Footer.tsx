"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const quickLinks = [
    { href: "#what", label: "What You Get" },
    { href: "#course", label: "Course" },
    { href: "#pricing", label: "Pricing" },
  ];

  const accountLinks = [
    { href: "/login", label: "Student Login" },
    { href: "/admin/login", label: "Admin Login" },
    { href: "/signup", label: "Sign Up" },
  ];

  const bottomLinks = [
    { href: "#pricing", label: "Pricing" },
    { href: "#what", label: "What you get" },
    { href: "#blindspot", label: "About" },
  ];

  return (
    <footer className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12 transition-colors duration-300 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="relative w-12 h-12 flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/images/mewayz.jpeg"
                  alt="Mewayz FoundrVerse Logo"
                  fill
                  className="object-contain rounded-lg"
                  sizes="48px"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-charcoal dark:text-white transition-colors duration-300">Mewayz</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">FoundrVerse</span>
              </div>
            </motion.div>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              India's First Practical Startup School for Students.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-charcoal dark:text-white mb-4 transition-colors duration-300">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors relative group"
                  >
                    <motion.span
                      className="absolute left-0 bottom-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                    <span className="relative">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-charcoal dark:text-white mb-4 transition-colors duration-300">Account</h4>
            <div className="space-y-2">
              {accountLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors relative group"
                  >
                    <motion.span
                      className="absolute left-0 bottom-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                    <span className="relative">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
        >
          <motion.p
            className="text-gray-600 dark:text-gray-400 transition-colors duration-300"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            © {new Date().getFullYear()} Mewayz - FoundrVerse. All rights reserved.
          </motion.p>
          <div className="flex items-center gap-6">
            {bottomLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="hover:text-charcoal dark:hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
