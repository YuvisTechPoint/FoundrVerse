"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumIcon } from "@/components/ui/premium-icon";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300" id="hero">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/30 pointer-events-none transition-colors duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,33,88,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,33,88,0.15),transparent_50%)] pointer-events-none transition-colors duration-300" />
      
      <Navbar />
      
      {/* Hero Content - Two Column Layout */}
      <div className="relative container mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Gold Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f6b336] to-[#f9c866] rounded-full shadow-lg">
              <span className="text-sm font-semibold text-charcoal dark:text-charcoal">Founder-taught</span>
              <span className="w-1 h-1 rounded-full bg-charcoal/40 dark:bg-charcoal/40" />
              <span className="text-sm font-semibold text-charcoal dark:text-charcoal">30-Day Program</span>
              <span className="w-1 h-1 rounded-full bg-charcoal/40 dark:bg-charcoal/40" />
              <span className="text-sm font-semibold text-charcoal dark:text-charcoal">₹1499</span>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <Image
                  src="/images/mewayz.jpeg"
                  alt="Mewayz FoundrVerse Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 64px, 80px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white">Mewayz</span>
                <span className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">FoundrVerse</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal dark:text-white leading-[1.1] tracking-tight transition-colors duration-300">
              India's First Practical Startup School for Students.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl transition-colors duration-300">
              Learn how real founders build. Do it yourself. Get certified. Get internships. Pitch to investors.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/signup"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#f6b336] to-[#f9c866] text-charcoal font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  Enroll Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link 
                href="/login"
                className="inline-flex items-center justify-center border-2 border-charcoal dark:border-gray-300 text-charcoal dark:text-gray-300 hover:bg-charcoal dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200"
              >
                Login / Signup
              </Link>
            </div>

            {/* Micro Trustline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2"
            >
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide transition-colors duration-300">
                <span className="inline-block mr-2">Build</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mx-2 align-middle" />
                <span className="inline-block mr-2">Launch</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mx-2 align-middle" />
                <span className="inline-block">Pitch</span>
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-6 pt-6"
            >
              {/* Overlapping Avatar Circles */}
              <div className="flex -space-x-2 relative group">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ 
                      delay: 0.5 + (i * 0.1), 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      zIndex: 10,
                      transition: { duration: 0.2 }
                    }}
                    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-[3px] border-white dark:border-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${220 + i * 10}, 70%, ${60 - i * 2}%), 
                        hsl(${270 + i * 10}, 70%, ${55 - i * 2}%))`
                    }}
                  >
                    <span className="relative z-10 drop-shadow-sm">
                      {String.fromCharCode(64 + i)}
                    </span>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  </motion.div>
                ))}
                {/* Pulse ring animation */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-indigo-400/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.7 + (i * 0.08), 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 15,
                        transition: { duration: 0.2 }
                      }}
                      className="relative"
                    >
                      <Star className="w-5 h-5 fill-[#f6b336] text-[#f6b336] drop-shadow-sm" />
                      {/* Twinkle effect */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      >
                        <Star className="w-5 h-5 fill-white text-white" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Rating Text */}
                <div className="ml-2 border-l border-gray-300 dark:border-gray-600 pl-3">
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                      className="text-charcoal dark:text-white font-bold text-xl transition-colors duration-300"
                    >
                      4.9
                    </motion.span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-xs text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300 leading-tight"
                  >
                    from 500+ reviews
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Founder Image with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              animate={{
                rotateY: [0, 2, -2, 0],
                rotateX: [0, 1, -1, 0],
              }}
              transition={{
                rotateY: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotateX: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              {/* Enhanced 3D Shadow Layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-3xl opacity-60" />
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-2xl opacity-40" />
              
              {/* Main Image Container with 3D Effect */}
              <motion.div 
                className="relative aspect-[4/5] rounded-2xl overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                }}
              >
                <Image
                  src="/images/businessman-7504296_640.jpg"
                  alt="Success and Ambition - Building Your Startup Journey"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  style={{
                    transform: "translateZ(20px)",
                  }}
                />
                {/* 3D Depth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />
              </motion.div>
              
              {/* 3D Border Glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none" 
                style={{
                  boxShadow: "inset 0 0 30px rgba(99, 102, 241, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)",
                }}
              />
            </motion.div>
            
            {/* Floating badge with 3D effect */}
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300 z-10"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.2 }
              }}
            >
              <p className="text-sm font-semibold text-charcoal dark:text-white transition-colors duration-300">Real Founders</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">4 Active Startups</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Transition */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none transition-colors duration-300" />
    </div>
  );
}
