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
    <section className="bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 py-24 transition-colors duration-300" id="what">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            What Students Get
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Where students become CEOs. Intern, build, pitch, scale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {items.map(({ icon: Icon, title, desc }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-gold"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#f9c866] text-charcoal group-hover:scale-110 transition-transform duration-300 shadow-md">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-3">{title}</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Learning
            </Link>
            <Link
              href="/signup"
              className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Get Certified
            </Link>
          </div>
          <p className="text-sm text-gray-500">Learn from founders, not professors.</p>
        </div>
      </div>
    </section>
  );
}
