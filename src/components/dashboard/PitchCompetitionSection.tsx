"use client";

import { useState } from "react";
import { 
  Megaphone, Calendar, Users, Award, TrendingUp, FileText, Upload, CheckCircle2, Clock,
  Target, Lightbulb, Rocket, Trophy, Star, Users2, MessageSquare, Video, 
  ChevronRight, Sparkles, DollarSign, Building2, TrendingUpIcon, BarChart3,
  CheckCircle, ArrowRight, Shield, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const benefits = [
  {
    icon: DollarSign,
    title: "Real Funding",
    description: "Get connected with angel investors and VCs ready to fund promising startups",
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    borderColor: "border-green-200 dark:border-green-800/50"
  },
  {
    icon: Building2,
    title: "Incubation Spots",
    description: "Top 3 teams get access to premium incubation programs worth ₹5 lakhs",
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    borderColor: "border-blue-200 dark:border-blue-800/50"
  },
  {
    icon: Users2,
    title: "Expert Mentorship",
    description: "Get personalized feedback from successful founders and industry experts",
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    borderColor: "border-purple-200 dark:border-purple-800/50"
  },
  {
    icon: TrendingUpIcon,
    title: "Media Exposure",
    description: "Winners get featured on major startup platforms and media outlets",
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
    borderColor: "border-orange-200 dark:border-orange-800/50"
  }
];

const judgingCriteria = [
  { name: "Innovation", weight: 25, icon: Lightbulb },
  { name: "Market Potential", weight: 25, icon: TrendingUp },
  { name: "Execution", weight: 20, icon: Rocket },
  { name: "Business Model", weight: 20, icon: BarChart3 },
  { name: "Team", weight: 10, icon: Users }
];

const timeline = [
  {
    phase: "Registration",
    date: "Week 1-2",
    description: "Submit your startup idea and preliminary details",
    status: "upcoming"
  },
  {
    phase: "Screening",
    date: "Week 3",
    description: "Top 20 startups selected for the competition",
    status: "upcoming"
  },
  {
    phase: "Preparation",
    date: "Week 4-5",
    description: "Refine your pitch with mentor guidance",
    status: "upcoming"
  },
  {
    phase: "Final Pitch",
    date: "Week 6",
    description: "Present to investors and compete for prizes",
    status: "upcoming"
  }
];

export default function PitchCompetitionSection() {
  const { toast } = useToast();
  const [selectedPitch, setSelectedPitch] = useState<PitchInfo | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "criteria" | "timeline">("overview");

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
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-1"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-10 md:p-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
            <PremiumIcon 
                icon={Trophy} 
                size={32} 
              variant="diamond"
                className="!p-4"
              animated={true}
            />
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Premium Competition
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-1.5 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 text-sm font-bold rounded-full border-2 border-green-300 dark:border-green-700"
                >
                  Registrations Opening Soon
                </motion.span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pitch to Real Investors
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl leading-relaxed">
              Present your startup to a panel of angel investors, VCs, and industry experts. 
              Win funding opportunities, incubation spots, and gain invaluable feedback to accelerate your startup journey.
            </p>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800/50 rounded-2xl"
              >
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
        </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹50L+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Funding Pool</p>
      </div>
              </motion.div>

        <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl"
        >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Users2 className="w-6 h-6 text-white" />
            </div>
            <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">15+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expert Judges</p>
          </div>
        </motion.div>

        <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800/50 rounded-2xl"
              >
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Top 3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Win Prizes</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        </motion.div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-2 flex gap-2">
        {[
          { id: "overview", label: "Overview", icon: Target },
          { id: "criteria", label: "Judging Criteria", icon: Star },
          { id: "timeline", label: "Timeline", icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
        <motion.div
                  key={benefit.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className={`p-8 bg-gradient-to-br ${benefit.bgColor} border-2 ${benefit.borderColor} rounded-2xl hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className={`inline-flex p-4 bg-gradient-to-br ${benefit.color} rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Competition Details */}
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                  <Megaphone className="w-8 h-8 text-white" />
            </div>
            <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Competition Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Everything you need to know</p>
            </div>
      </div>

          {pitchCompetitions.map((pitch, index) => (
            <motion.div
              key={pitch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
                  className="space-y-6"
                >
                  {/* Status Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg font-bold shadow-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {pitch.status === "upcoming" ? "Upcoming" : pitch.status === "open" ? "Open Now" : "Closed"}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{pitch.date}</span>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {pitch.title}
                    </h4>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {pitch.description}
                  </p>
                  </div>

                  {/* Prize Highlight */}
                  {pitch.prize && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-2xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
                          <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                            Competition Prize
                          </p>
                          <p className="text-xl font-extrabold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                            {pitch.prize}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl text-center">
                      <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{pitch.participants}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Registered</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl text-center">
                      <Video className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">5 min</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pitch Time</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-center">
                      <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">10 min</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Q&A</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl text-center">
                      <Users2 className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">15+</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Judges</p>
                  </div>
                </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {pitch.status === "open" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitPitch}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                    >
                        <Upload className="w-6 h-6" />
                        Submit Your Pitch
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                      disabled
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                    >
                        <Clock className="w-6 h-6" />
                        Registrations Opening Soon
                    </motion.button>
                  )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* What to Prepare */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Preparation Checklist
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Get pitch-ready with these essentials</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { text: "Complete your startup idea validation", icon: CheckCircle },
                  { text: "Build your MVP or prototype", icon: Rocket },
                  { text: "Create a compelling pitch deck (10-15 slides)", icon: FileText },
                  { text: "Prepare a 5-minute presentation", icon: Clock },
                  { text: "Practice with mentors and get feedback", icon: Users2 },
                  { text: "Be ready to answer investor questions", icon: MessageSquare },
                  { text: "Prepare financial projections", icon: TrendingUp },
                  { text: "Define your go-to-market strategy", icon: Target }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium flex-1">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "criteria" && (
          <motion.div
            key="criteria"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Judging Criteria
                </h3>
                <p className="text-gray-600 dark:text-gray-400">How your pitch will be evaluated</p>
              </div>
            </div>

            <div className="space-y-6">
              {judgingCriteria.map((criteria, index) => (
                <motion.div
                  key={criteria.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <criteria.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {criteria.name}
                        </h4>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {criteria.weight}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${criteria.weight}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Fair & Transparent Evaluation
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    All pitches are evaluated by multiple judges independently. Scores are aggregated
                    to ensure fairness and eliminate bias.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Competition Timeline
                </h3>
                <p className="text-gray-600 dark:text-gray-400">6-week journey to your pitch</p>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.phase}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Circle indicator */}
                    <div className="relative z-10">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <motion.div
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {item.phase}
                        </h4>
                        <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold text-sm">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg">
                        {item.description}
                      </p>
                    </motion.div>
            </motion.div>
          ))}
        </div>
        </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-10 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Mark Your Calendar
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Detailed dates will be announced once registration opens. 
                    Make sure to enable notifications to stay updated!
                  </p>
                </div>
      </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
