"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, Clock, Users as UsersIcon } from "lucide-react";

const includes = [
  "Full 30-Day Course",
  "Community Access",
  "Internship Eligibility",
  "Founder Sessions",
  "Pitch Competition Access",
  "Industry-Grade Certification",
  "Lifetime Course Access",
  "Exclusive Startup Resources"
];

export default function PricingSection() {
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
            Learn Like a Founder,
            <br />
            Pay Like a Student
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to build and launch your startup
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white rounded-3xl blur-2xl opacity-20"></div>
            
            {/* Card */}
            <div className="relative bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-2xl">
              {/* Badge */}
              <div className="flex items-center justify-between mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-bold">
                  <Clock className="w-4 h-4" />
                  Limited Seats
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-semibold text-gray-900 dark:text-white">
                  <UsersIcon className="w-4 h-4" />
                  500+ Enrolled
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-extrabold text-gray-900 dark:text-white">₹1,499</span>
                  <span className="text-2xl text-gray-500 dark:text-gray-500 line-through">₹4,999</span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  One-time payment • Lifetime access
                </p>
              </div>

              {/* Includes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  What's Included
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {includes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-white dark:text-gray-900" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/signup"
                className="group w-full px-8 py-5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                Enroll Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Trust Badge */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✓ Secure Payment • ✓ Instant Access • ✓ 7-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-3 gap-6 text-center"
        >
          {[
            { title: "Enroll in 60 Seconds", subtitle: "Quick & Easy Signup" },
            { title: "Start Immediately", subtitle: "Instant Course Access" },
            { title: "Learn at Your Pace", subtitle: "Flexible Schedule" }
          ].map((item, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.subtitle}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

