"use client";

import { useState } from "react";
import { Radio, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumIcon } from "@/components/ui/premium-icon";

interface Session {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  views: string;
  date: string;
  zoomLink?: string;
  isLive?: boolean;
  startsIn?: string;
}

const liveSessions: Session[] = [
  {
    id: "live-1",
    title: "Week 1: Idea Validation",
    instructor: "Founder Session with Real Examples",
    duration: "45 min",
    views: "Live",
    date: "Now",
    zoomLink: "https://zoom.us/j/123456789?pwd=yourpassword",
    isLive: true,
    startsIn: "15 min",
  },
];

export default function LiveCoursesSection() {
  const handleSessionClick = (session: Session) => {
    if (session.isLive && session.zoomLink) {
      window.open(session.zoomLink, "_blank");
    }
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border-2 border-gray-200 dark:border-gray-800/80 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/50 p-10 mb-8 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <PremiumIcon 
              icon={Radio} 
              size={24} 
              variant="diamond"
              className="!p-2.5"
              animated={true}
            />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Live Courses
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg ml-14">Join live interactive sessions with founders and industry experts</p>
        </div>
      </div>

      {liveSessions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleSessionClick(session)}
              className="group relative bg-white dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="relative aspect-video bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>
                <div className="relative z-10 text-center space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Radio className="w-16 h-16 text-white mx-auto mb-3 drop-shadow-2xl" />
                  </motion.div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/95 backdrop-blur-sm text-white text-sm font-bold shadow-xl shadow-red-500/50 border-2 border-white/30">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-white rounded-full"
                    />
                    LIVE NOW
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/20">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>247 watching</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{session.instructor}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Starts in {session.startsIn}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all duration-300"
                  >
                    Join Live
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No live sessions scheduled at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

