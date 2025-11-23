"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const weeks = [
  { w: "Week 1", d: "Idea, Research, Validation" },
  { w: "Week 2", d: "Product, MVP, No-Code Build" },
  { w: "Week 3", d: "Marketing, Social Media, Branding" },
  { w: "Week 4", d: "Sales, Funding, Pitching, Investor Psychology" },
];

export default function CourseBreakdown() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 py-24 transition-colors duration-300" id="course">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Course Breakdown
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">From idea to investors in 30 days.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Course Weeks */}
          <div className="space-y-4">
            {weeks.map((x, index) => (
              <motion.div
                key={x.w}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gold relative overflow-hidden group"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div
                    className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-gold to-[#f9c866] text-charcoal flex items-center justify-center font-bold text-xl shadow-md"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, -5, 0],
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
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    {index + 1}
                  </motion.div>
                  <div className="flex-1 pt-1">
                    <motion.span
                      className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block"
                      whileHover={{ x: 5 }}
                    >
                      {x.w}
                    </motion.span>
                    <motion.p
                      className="text-lg text-charcoal dark:text-white mt-1 font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      {x.d}
                    </motion.p>
                  </div>
                </div>
                
                {/* Progress indicator line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold to-purple-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Right Column - Brainstorming Image with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
            style={{ 
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            animate={{
              rotateY: [0, 1.5, -1.5, 0],
              rotateX: [0, -0.5, 0.5, 0],
            }}
            transition={{
              rotateY: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotateX: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            {/* 3D Shadow Layers */}
            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-2xl opacity-50" />
            <div className="absolute -inset-2 bg-gradient-to-br from-gold/20 to-[#f9c866]/20 blur-xl opacity-40" />
            
            {/* Main Image Container */}
            <motion.div
              className="relative w-full h-full rounded-3xl overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                minHeight: "500px",
              }}
            >
              <Image
                src="/images/Brainstorming-Image_Adobe-Stock-scaled-880x587 (1).jpeg"
                alt="Active Learning and Brainstorming - Course Experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  transform: "translateZ(30px) scale(1.05)",
                }}
              />
              
              {/* 3D Depth Overlays - Subtle for visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
              
              {/* 3D Border Glow */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 pointer-events-none" 
                style={{
                  boxShadow: "inset 0 0 40px rgba(99, 102, 241, 0.4), 0 0 50px rgba(139, 92, 246, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/signup"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
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
              <span className="relative z-10">Let's Build Your Startup</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
