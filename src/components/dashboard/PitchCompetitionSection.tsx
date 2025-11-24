"use client";

import { useState } from "react";
import { Megaphone, Calendar, Users, Award, TrendingUp, FileText, Upload, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumIcon } from "@/components/ui/premium-icon";
import { useToast } from "@/components/ui/use-toast";

interface PitchInfo {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "upcoming" | "open" | "closed";
  participants: number;
  prize?: string;
}

const pitchCompetitions: PitchInfo[] = [
  {
    id: "pitch-1",
    title: "Final Pitch Competition - Cohort 2024",
    description: "Present your startup idea to a panel of real investors and get feedback. Top performers may receive funding opportunities.",
    date: "Coming Soon",
    status: "upcoming",
    participants: 0,
    prize: "Funding opportunities + Pre-incubation spots",
  },
];

export default function PitchCompetitionSection() {
  const { toast } = useToast();
  const [selectedPitch, setSelectedPitch] = useState<PitchInfo | null>(null);

  const handleSubmitPitch = () => {
    toast({
      title: "Pitch Submission",
      description: "Pitch submission form will be available when the competition opens. Stay tuned!",
    });
  };

  const handleViewDetails = (pitch: PitchInfo) => {
    setSelectedPitch(pitch);
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border-2 border-gray-200 dark:border-gray-800/80 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/50 p-10 mb-8 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <PremiumIcon 
              icon={Megaphone} 
              size={24} 
              variant="diamond"
              className="!p-2.5"
              animated={true}
            />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Pitch Competition
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg ml-14">
            Present your startup to investors and get real funding opportunities
          </p>
        </div>
      </div>

      {/* Competition Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Competition opens soon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prize</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Funding + Incubation</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Real investment opportunities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800/50 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Upcoming</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Competition will open soon</p>
        </motion.div>
      </div>

      {/* Competition Details */}
      {pitchCompetitions.length > 0 ? (
        <div className="space-y-6">
          {pitchCompetitions.map((pitch, index) => (
            <motion.div
              key={pitch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold">
                      {pitch.status === "upcoming" ? "Upcoming" : pitch.status === "open" ? "Open" : "Closed"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{pitch.date}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {pitch.title}
                  </h3>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {pitch.description}
                  </p>

                  {pitch.prize && (
                    <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl mb-4">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Prize:</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">{pitch.prize}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{pitch.participants} participants</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {pitch.status === "open" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitPitch}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Submit Pitch
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled
                      className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Clock className="w-5 h-5" />
                      Coming Soon
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(pitch)}
                    className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pitch competitions scheduled at the moment. Check back soon!</p>
        </div>
      )}

      {/* What to Prepare */}
      <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          What to Prepare
        </h3>
        <ul className="space-y-2">
          {[
            "Complete your startup idea validation",
            "Build your MVP or prototype",
            "Create a compelling pitch deck (10-15 slides)",
            "Prepare a 5-minute presentation",
            "Be ready to answer investor questions",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

