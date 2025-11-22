"use client";

import { CheckCircle, Circle, BookOpen, Video, FileText, Award } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumIcon } from "@/components/ui/premium-icon";

interface CourseModule {
  id: string;
  title: string;
  type: "video" | "reading" | "assignment";
  completed: boolean;
  duration?: string;
}

interface CourseProgressProps {
  progress: number;
  modules: CourseModule[];
  totalModules: number;
  completedModules: number;
}

export default function CourseProgress({ progress, modules, totalModules, completedModules }: CourseProgressProps) {
  const isCompleted = progress >= 100;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <PremiumIcon 
            icon={BookOpen} 
            size={32} 
            variant="luxury"
            className="!p-4"
            animated={true}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Course Progress</h2>
            <p className="text-gray-600 dark:text-gray-400">Track your learning journey</p>
          </div>
        </div>
        {isCompleted && (
          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl">
            <span className="text-green-700 dark:text-green-300 font-bold text-sm flex items-center gap-2">
              <Award className="w-4 h-4" />
              Course Completed!
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Progress
          </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </motion.div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {completedModules} of {totalModules} modules completed
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Modules</h3>
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              module.completed
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex-shrink-0">
              {module.completed ? (
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <Circle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {module.type === "video" && <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                {module.type === "reading" && <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                {module.type === "assignment" && <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />}
                <h4 className={`font-semibold ${module.completed ? "text-green-900 dark:text-green-100" : "text-gray-900 dark:text-white"}`}>
                  {module.title}
                </h4>
              </div>
              {module.duration && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{module.duration}</p>
              )}
            </div>
            {module.completed && (
              <span className="text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                Completed
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-700 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-900 dark:text-green-100">Congratulations! 🎉</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                You've completed all course modules. You can now download your certificate!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

