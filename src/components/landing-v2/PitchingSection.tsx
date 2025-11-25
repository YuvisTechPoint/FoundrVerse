"use client";

import { motion } from "framer-motion";
import { Trophy, Users, DollarSign, MessageSquare, Target } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Investor Panel",
    description: "Pitch to real angel investors and VCs"
  },
  {
    icon: DollarSign,
    title: "Real Funding",
    description: "Chance to raise your first cheque"
  },
  {
    icon: MessageSquare,
    title: "Real Feedback",
    description: "Get actionable insights from experts"
  },
  {
    icon: Target,
    title: "Pre-Incubation",
    description: "Top performers get incubation support"
  }
];

export default function PitchingSection() {
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 dark:bg-white rounded-2xl mb-6">
            <Trophy className="w-10 h-10 text-white dark:text-gray-900" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Pitch Your Startup Idea
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-semibold">
            Raise Your First Cheque
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="h-full p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gray-900 dark:bg-white rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white rounded-2xl p-12 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white dark:text-gray-900 mb-4">
              Your 5-Minute Pitch Could Change Everything
            </h3>
            <p className="text-xl text-gray-300 dark:text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Present your idea to a panel of seasoned investors. Get feedback. Get funding. Get your startup off the ground.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {[
            { value: "₹50L+", label: "Funding Pool" },
            { value: "15+", label: "Investor Judges" },
            { value: "Top 3", label: "Win Prizes & Incubation" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

