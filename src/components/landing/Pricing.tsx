"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const features = [
    "Full course",
    "Community access",
    "Internship eligibility",
    "Founder sessions",
    "Pitch competition access",
    "Certification",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-24 transition-all duration-500 scroll-mt-28" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/40 via-transparent to-indigo-50/40 dark:from-purple-950/30 dark:to-indigo-950/30 pointer-events-none transition-all duration-500" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn like a founder, pay like a student
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Build a startup before you graduate.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="mx-auto max-w-lg rounded-3xl border border-gray-200/50 dark:border-gray-700/50 glass-strong p-10 shadow-premium-xl transition-all duration-500 relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "linear"
            }}
          />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                className="flex items-end justify-center gap-2 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              >
                <motion.span
                  className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-colors duration-300"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {formatPrice(1499)}
                </motion.span>
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-gold mb-2" />
                </motion.div>
              </motion.div>
              <motion.p
                className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                One-time payment
              </motion.p>
            </div>
            
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <motion.div
                    className="flex-shrink-0 mt-0.5"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check className="h-5 w-5 text-gray-900 dark:text-white transition-colors duration-300" />
                  </motion.div>
                  <motion.span
                    className="text-[15px] text-gray-700 dark:text-gray-300 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {feature}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup" 
                className="block w-full bg-gradient-to-r from-gold to-[#f9c866] text-charcoal px-6 py-4 text-center font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg mb-4 relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10">Enroll Now</span>
              </Link>
            </motion.div>
            
            <motion.p
              className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              Enroll in 60 seconds
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
