"use client";

import { motion } from "framer-motion";
import { Building2, Star } from "lucide-react";
import Image from "next/image";

const companies = [
  { name: "Mewayz", description: "Education & Training Platform" },
  { name: "MyAiNation", description: "AI Solutions" },
  { name: "PhantomX", description: "Technology Services" },
  { name: "Careflow HMS", description: "Healthcare Management" }
];

export default function InternshipSection() {
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
            Work Inside Real Startups
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get hands-on experience with actual startup operations
          </p>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full p-6 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-400 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-xl">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {company.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center">
                  <Star className="w-10 h-10 text-white dark:text-gray-900" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Top Performers Get Exclusive Opportunities
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Stand out in the program, and secure full-time roles or extended internships with our partner startups. The best get priority access to funding and pre-incubation support.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "100+", label: "Internships Offered" },
            { value: "4", label: "Active Startups" },
            { value: "3-6", label: "Months Duration" },
            { value: "Top 10%", label: "Get Full-Time Roles" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

