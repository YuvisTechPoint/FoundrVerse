"use client";

import { useState } from "react";
import Image from "next/image";
import { Video, PlayCircle, X, Eye, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumIcon } from "@/components/ui/premium-icon";

interface Session {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  thumbnail: string;
  views: string;
  date: string;
  youtubeId?: string;
}

const recordedSessions: Session[] = [
  {
    id: "recorded-1",
    title: "Week 1: Research & Validation",
    instructor: "Founder Session",
    duration: "45 min",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop",
    views: "1.2k views",
    date: "2 days ago",
    youtubeId: "BxV14h0kFs0",
  },
  {
    id: "recorded-2",
    title: "Week 2: MVP Development",
    instructor: "No-Code Build Workshop",
    duration: "60 min",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop",
    views: "856 views",
    date: "5 days ago",
    youtubeId: "U6Z8FkjpR8E",
  },
  {
    id: "recorded-3",
    title: "Week 3: Marketing & Branding",
    instructor: "Social Media Masterclass",
    duration: "50 min",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
    views: "2.1k views",
    date: "1 week ago",
    youtubeId: "kXYiU_JCYtU",
  },
];

export default function RecordedCoursesSection() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleSessionClick = (session: Session) => {
    if (session.youtubeId) {
      setSelectedSession(session);
    }
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border-2 border-gray-200 dark:border-gray-800/80 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/50 p-10 mb-8 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <PremiumIcon 
                icon={Video} 
                size={24} 
                variant="diamond"
                className="!p-2.5"
                animated={true}
              />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Recorded Courses
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg ml-14">Watch recorded sessions from industry experts at your own pace</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recordedSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleSessionClick(session)}
              className="group relative bg-white dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <Image
                  src={session.thumbnail}
                  alt={session.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl"
                  >
                    <PlayCircle className="w-12 h-12 text-white drop-shadow-2xl" fill="white" />
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-xs rounded-lg font-semibold border border-white/20 shadow-lg">
                    {session.duration}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1.5 bg-red-600/95 backdrop-blur-md text-white text-xs rounded-lg font-bold flex items-center gap-2 shadow-xl border border-white/20">
                    <span className="w-4 h-4 bg-white rounded flex items-center justify-center">
                      <span className="text-[10px] text-red-600 font-black leading-none">▶</span>
                    </span>
                    YouTube
                  </div>
                </div>
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 text-[10px] font-bold rounded-md shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    PREMIUM
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
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{session.views}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{session.date}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium YouTube Video Modal */}
      <AnimatePresence>
        {selectedSession && selectedSession.youtubeId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/80 hover:bg-red-600/90 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border border-white/10 hover:scale-110 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-video w-full bg-black relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedSession.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedSession.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full relative z-10"
                />
              </div>
              <div className="p-6 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedSession.title}</h3>
                    <p className="text-gray-400 font-medium">{selectedSession.instructor}</p>
                  </div>
                  <div className="ml-6 flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg">
                    <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="text-red-400 text-sm font-semibold">YouTube</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

