"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const points = [
  "You're taught to score marks, not build skills.",
  "Theory overload, zero real-world execution.",
  "Creativity gets punished, not rewarded.",
  "No one teaches how startups actually work.",
  "Students graduate with degrees, not direction.",
  "Outdated content, irrelevant to today's economy.",
  "Practical exposure doesn't exist in most campuses.",
  "Innovation isn't part of the curriculum.",
];

export default function BlindSpot() {
  return (
    <section className="bg-white dark:bg-gray-900 py-24 transition-colors duration-300" id="blindspot">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal dark:text-white mb-4 transition-colors duration-300">
            The Blind Spot in the Indian Education System
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="space-y-4">
            {points.map((p, index) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-red-500" />
                <p className="text-gray-800 dark:text-gray-200 font-medium text-[15px] leading-relaxed pl-4 transition-colors duration-300">{p}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3]"
            style={{ 
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            animate={{
              rotateY: [0, -1.5, 1.5, 0],
              rotateX: [0, 0.5, -0.5, 0],
            }}
            transition={{
              rotateY: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotateX: {
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            {/* 3D Shadow Layers */}
            <div className="absolute -inset-4 bg-gradient-to-br from-charcoal/30 to-indigo/30 blur-2xl opacity-50" />
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-xl opacity-40" />
            
            {/* Main Image Container */}
            <motion.div
              className="relative w-full h-full rounded-3xl overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <Image
                src="/images/istockphoto-1077565558-612x612.jpg"
                alt="Collaborative Team Building - We Fixed It"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  transform: "translateZ(30px) scale(1.05)",
                }}
              />
              
              {/* 3D Depth Overlays - Subtle for visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
              
              {/* Overlay with 3D Text - Minimal overlay for text readability */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: "translateZ(10px)",
                }}
              >
                {/* Subtle background for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <motion.p 
                  className="relative text-4xl md:text-5xl font-bold text-white text-center px-4 z-10"
                  style={{
                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.9)",
                    transform: "translateZ(20px)",
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  We fixed it.
                </motion.p>
              </motion.div>
              
              {/* 3D Border Glow */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 pointer-events-none" 
                style={{
                  boxShadow: "inset 0 0 40px rgba(99, 102, 241, 0.4), 0 0 50px rgba(139, 92, 246, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
