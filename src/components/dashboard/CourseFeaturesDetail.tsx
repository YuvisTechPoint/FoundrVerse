"use client";

import { BookOpen, Video, FileText, Code, Users, Award, Clock, CheckCircle2, Sparkles, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  icon: typeof BookOpen;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const courseFeatures: Feature[] = [
  {
    icon: BookOpen,
    title: "Comprehensive Course Content",
    description: "30-day structured program covering all aspects of startup development",
    benefits: [
      "4 weeks of intensive learning",
      "16+ video lessons",
      "12+ reading materials",
      "4 practical assignments",
      "Weekly progress tracking"
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Video,
    title: "Live & Recorded Sessions",
    description: "Access to both live interactive sessions and recorded content",
    benefits: [
      "Live founder sessions",
      "Recorded video library",
      "Q&A opportunities",
      "Session replays available",
      "Expert insights"
    ],
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Code,
    title: "Practical Assignments",
    description: "Hands-on tasks to build your startup in real-time",
    benefits: [
      "Week 1: Idea validation",
      "Week 2: MVP development",
      "Week 3: Marketing plan",
      "Week 4: Pitch deck creation",
      "Real-world application"
    ],
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Connect with fellow students and founders",
    benefits: [
      "Student community",
      "Founder mentorship",
      "Peer collaboration",
      "Networking opportunities",
      "Support groups"
    ],
    color: "from-orange-500 to-amber-600"
  },
  {
    icon: Award,
    title: "Certification & Verification",
    description: "Industry-recognized certificate with verification",
    benefits: [
      "Official certificate",
      "Verification link",
      "Shareable credentials",
      "LinkedIn integration",
      "Portfolio ready"
    ],
    color: "from-amber-500 to-yellow-600"
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "Learn at your own pace with lifetime access",
    benefits: [
      "Self-paced learning",
      "Lifetime access",
      "Mobile friendly",
      "Downloadable resources",
      "Progress tracking"
    ],
    color: "from-slate-500 to-gray-600"
  }
];

export default function CourseFeaturesDetail() {
  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl dark:shadow-2xl p-8 md:p-10 mb-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Course Features & Benefits
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Everything you need to build and launch your startup successfully
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {/* Icon */}
              <div className={`mb-4 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Benefits List */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Hover effect gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

