"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const problems = [
  "Too much theory, zero execution",
  "No real founders teaching",
  "Zero practical experience",
  "No internship opportunities",
  "No pitching stage for ideas",
  "Overpriced courses with outdated content",
  "Students graduate with degrees, not direction",
  "Innovation isn't part of the curriculum"
];

export default function BlindSpotSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            The Blind Spot in Indian Education
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            You're taught to score marks, not build skills
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{problem}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-gray-900 dark:bg-white rounded-2xl p-12 text-center shadow-2xl">
            <Check className="w-16 h-16 text-white dark:text-gray-900 mx-auto mb-6" />
            <h3 className="text-4xl md:text-5xl font-extrabold text-white dark:text-gray-900 mb-4">
              We Fixed It.
            </h3>
            <p className="text-xl text-gray-300 dark:text-gray-700 max-w-2xl mx-auto">
              Learn from founders, not professors. Build real startups, not theoretical projects.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

