"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const whatsappGroupLink = "https://whatsapp.com/channel/0029VbB9L7CHQbS20TBFgC1R";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Premium background effects - Enhanced */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.4)_100%)] dark:bg-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] pointer-events-none opacity-30" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center"
        >
          {/* Success Icon with Premium Animation */}
          <motion.div
            variants={itemVariants}
            className="mb-8 relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-green-400/10 rounded-full blur-xl" />
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 ring-4 ring-green-500/20 dark:ring-green-400/10">
                <CheckCircle className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={3} />
              </div>
            </motion.div>
          </motion.div>

          {/* Logo and Branding */}
          <motion.div
            variants={itemVariants}
            className="mb-8 flex items-center gap-4 justify-center"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20 dark:opacity-30" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/60 dark:border-gray-700/50 shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                <Image
                  src="/images/mewayz.jpeg"
                  alt="Mewayz FoundrVerse Logo"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 80px, 96px"
                  priority
                />
              </div>
              </div>
            <div className="flex flex-col items-start">
              <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent drop-shadow-sm">
                Mewayz
              </span>
              <span className="text-sm md:text-base font-bold text-gray-600 dark:text-gray-400 uppercase tracking-[0.25em] mt-1">
                FoundrVerse
              </span>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div variants={itemVariants} className="mb-12">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Welcome!
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Your enrollment is complete. You're now part of{" "}
              <span className="font-bold text-gray-900 dark:text-white">India's first practical startup school</span> for students.
            </motion.p>
          </motion.div>

          {/* What's Next Card - Premium Glassmorphism */}
          <motion.div
            variants={itemVariants}
            className="w-full mb-10"
          >
            <div className="relative group">
              {/* Glow effect - Subtle in light mode */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur-lg opacity-10 dark:opacity-20 group-hover:opacity-15 dark:group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* Card - Enhanced for light mode */}
              <div className="relative bg-white dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700/50 rounded-3xl p-8 md:p-10 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-2xl transition-shadow duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center shadow-lg ring-1 ring-slate-600/20 dark:ring-white/10">
                      <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                      What's Next?
                    </h2>
                  </div>

                  <ul className="space-y-5 text-left">
                    {[
                      "Access your course materials and start learning",
                      "Join live founder sessions and get mentorship",
                      "Connect with other students in the community",
                      "Build your startup and pitch to investors",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-4 group/item"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform ring-1 ring-green-500/20">
                            <CheckCircle className="h-4 w-4 text-white drop-shadow-sm" strokeWidth={3} />
                          </div>
                        </div>
                        <span className="text-lg text-gray-800 dark:text-gray-300 font-semibold leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                          {item}
                        </span>
                      </motion.li>
                    ))}
            </ul>
                </motion.div>
              </div>
          </div>
          </motion.div>

          {/* WhatsApp CTA Button - Premium */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 px-10 rounded-2xl text-lg md:text-xl transition-all duration-300 shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:scale-105 ring-2 ring-green-500/20 dark:ring-green-400/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <MessageCircle className="h-6 w-6 relative z-10 drop-shadow-sm" strokeWidth={2.5} />
              <span className="relative z-10">Join the Official Batch Group</span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </motion.a>
          </motion.div>

          {/* Helper Text */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto"
          >
            Join our WhatsApp group to stay updated, ask questions, and connect with your batchmates.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md"
          >
            <Link
              href="/"
              className="group relative flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-lg ring-1 ring-gray-200/50 dark:ring-gray-700/50"
            >
              <span>Back to Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-300 font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl shadow-gray-900/30 dark:shadow-gray-100/20 hover:shadow-gray-900/40 dark:hover:shadow-gray-100/30 hover:scale-105 ring-2 ring-gray-900/10 dark:ring-gray-100/10"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

