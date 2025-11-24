"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Code, Briefcase, Users2, Megaphone, Award } from "lucide-react";

const items = [
  { 
    icon: BookOpen, 
    title: "The Course", 
    desc: "30-Day Startup Blueprint. Build idea, product, brand, marketing, growth, funding." 
  },
  { 
    icon: Code, 
    title: "Practical Execution", 
    desc: "Hands-on tasks taught by real founders of 4 active startups." 
  },
  { 
    icon: Briefcase, 
    title: "Internship", 
    desc: "Certified internships across your 4 companies for top students." 
  },
  { 
    icon: Users2, 
    title: "Live Founder Sessions", 
    desc: "Direct mentorship slots with you and your team." 
  },
  { 
    icon: Megaphone, 
    title: "Pitching Competition", 
    desc: "Pitch to investors at the end of the program." 
  },
  { 
    icon: Award, 
    title: "Certification", 
    desc: "Industry-Grade Startup Certificate." 
  },
];

export default function WhatStudentsGet() {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-24 transition-all duration-500" id="what">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            What Students Get
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Where students become CEOs. Intern, build, pitch, scale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {items.map(({ icon: Icon, title, desc }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group rounded-2xl border border-gray-200/50 dark:border-gray-700/50 glass-strong p-8 shadow-premium transition-all duration-300 hover:shadow-premium-xl hover:border-gold/50 dark:hover:border-gold/50 relative overflow-hidden"
            >
              {/* Animated background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <motion.div
                className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#f9c866] text-charcoal shadow-md relative z-10"
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
                animate={{
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(246, 179, 54, 0.4)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon size={28} />
              </motion.div>
              
              <h3 className="text-xl font-bold text-charcoal dark:text-white mb-3 transition-colors duration-300 relative z-10">
                {title}
              </h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300 relative z-10">
                {desc}
              </p>
              
              {/* Decorative corner element */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10">Start Learning</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="inline-block border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Get Certified
              </Link>
            </motion.div>
          </div>
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Learn from founders, not professors.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
