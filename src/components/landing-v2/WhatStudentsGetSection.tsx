"use client";

import { motion } from "framer-motion";
import { BookOpen, Zap, Briefcase, Users, Megaphone, Award } from "lucide-react";

const offerings = [
  {
    icon: BookOpen,
    title: "30-Day Startup Blueprint",
    description: "Build idea, product, brand, marketing, growth, funding — all in 30 days",
    gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
  },
  {
    icon: Zap,
    title: "Practical Execution",
    description: "Hands-on tasks taught by real founders of 4 active startups",
    gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
  },
  {
    icon: Briefcase,
    title: "Certified Internships",
    description: "Work inside real startups. Top students get exclusive opportunities",
    gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
  },
  {
    icon: Users,
    title: "Live Founder Sessions",
    description: "Direct mentorship slots with active startup founders",
    gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
  },
  {
    icon: Megaphone,
    title: "Pitching Competition",
    description: "Pitch to investors at the end. Real funding, real feedback",
    gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
  },
  {
    icon: Award,
    title: "Industry-Grade Certificate",
    description: "Startup certificate recognized across the industry",
    gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
  }
];

export default function WhatStudentsGetSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
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
            What Students Get
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to go from idea to funded startup
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className={`h-full p-8 bg-gradient-to-br ${offering.gradient} border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}>
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <offering.icon className="w-7 h-7 text-gray-900 dark:text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {offering.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {offering.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            From idea to investors in 30 days
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn from founders, not professors
          </p>
        </motion.div>
      </div>
    </section>
  );
}

