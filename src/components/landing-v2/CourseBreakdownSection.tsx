"use client";

import { motion } from "framer-motion";
import { Lightbulb, Rocket, Megaphone, DollarSign } from "lucide-react";

const weeks = [
  {
    week: 1,
    title: "Idea, Research, Validation",
    description: "Find problems, validate ideas, understand your market",
    icon: Lightbulb
  },
  {
    week: 2,
    title: "Product, MVP, No-Code Build",
    description: "Build your product fast without writing code",
    icon: Rocket
  },
  {
    week: 3,
    title: "Marketing, Social Media, Branding",
    description: "Create your brand, grow your audience, get noticed",
    icon: Megaphone
  },
  {
    week: 4,
    title: "Sales, Funding, Pitching, Investor Psychology",
    description: "Close deals, pitch investors, raise your first cheque",
    icon: DollarSign
  }
];

export default function CourseBreakdownSection() {
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
            30-Day Startup Roadmap
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A week-by-week breakdown of what you'll learn and build
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 md:-translate-x-1/2"></div>

          {/* Week Cards */}
          <div className="space-y-12">
            {weeks.map((week, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Week Number Circle */}
                <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-gray-900 dark:bg-white border-4 border-white dark:border-gray-950 rounded-full flex items-center justify-center md:-translate-x-1/2 z-10 shadow-xl">
                  <span className="text-2xl font-bold text-white dark:text-gray-900">
                    {week.week}
                  </span>
                </div>

                {/* Card */}
                <div className={`flex-1 ml-28 md:ml-0 ${index % 2 === 0 ? "md:mr-12 md:text-right" : "md:ml-12"}`}>
                  <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl transition-shadow">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl mb-4 ${index % 2 === 0 ? "md:ml-auto" : ""}`}>
                      <week.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Week {week.week}: {week.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {week.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-6 bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl">
            <p className="text-xl font-bold text-white dark:text-gray-900">
              Where students become CEOs in 30 days
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

