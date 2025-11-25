"use client";

import { useState, useEffect } from "react";
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
    description: "Connect directly with investors actively backing early-stage founders.",
  },
  {
    icon: Building2,
    title: "Incubation Spots",
    description: "Reserved desks, resources, and warm introductions to ecosystem partners.",
  },
  {
    icon: Users2,
    title: "Expert Mentorship",
    description: "Small-group reviews with accomplished founders and operators.",
  },
  {
    icon: TrendingUpIcon,
    title: "Visibility & Media",
    description: "Spotlight across FoundrVerse channels and startup publications.",
  },
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
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 rounded-3xl p-1"
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-10 md:p-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100/40 dark:bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-100/30 dark:bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <PremiumIcon 
                icon={Trophy} 
                size={32} 
                variant="diamond"
                className="!p-4"
                animated={mounted}
              />
              <div className="flex items-center gap-3">
                {mounted ? (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Premium Competition
                  </motion.span>
                ) : (
                  <span className="px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Premium Competition
                  </span>
                )}
                {mounted ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-full border border-gray-200 dark:border-gray-700"
                  >
                    Registrations Opening Soon
                  </motion.span>
                ) : (
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-full border border-gray-200 dark:border-gray-700">
                    Registrations Opening Soon
                  </span>
                )}
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Pitch to Real Investors
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl leading-relaxed">
              Present your startup to a panel of angel investors, VCs, and industry experts. 
              Win funding opportunities, incubation spots, and gain invaluable feedback to accelerate your startup journey.
            </p>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-3 gap-6">
              {[{ label: "₹50L+", sub: "Funding Pool", icon: DollarSign },
                { label: "15+", sub: "Expert Judges", icon: Users2 },
                { label: "Top 3", sub: "Win Prizes", icon: Trophy }].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm"
                >
                  <div className="p-3 bg-gray-900 text-white rounded-xl shadow-lg">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
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
                ? "bg-gray-900 text-white shadow-lg"
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
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
            suppressHydrationWarning
          >
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={mounted ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mounted ? index * 0.1 : 0 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="inline-flex p-4 bg-gray-900 text-white rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-8 h-8" />
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
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-4 bg-gray-900 text-white rounded-2xl">
                  <Megaphone className="w-8 h-8" />
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
                  initial={mounted ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ delay: mounted ? index * 0.1 : 0 }}
                  className="space-y-6"
                >
                  {/* Status Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-6 py-3 bg-gray-900 text-white rounded-xl text-lg font-bold shadow-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {pitch.status === "upcoming" ? "Upcoming" : pitch.status === "open" ? "Open Now" : "Closed"}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Calendar className="w-5 h-5 text-gray-900 dark:text-gray-200" />
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
                      className="p-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-900 text-white rounded-xl shadow-lg">
                          <Trophy className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                            Competition Prize
                          </p>
                          <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                            {pitch.prize}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                    <Users className="w-6 h-6 text-gray-900 dark:text-gray-100 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{pitch.participants}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Registered</p>
                    </div>
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                    <Video className="w-6 h-6 text-gray-900 dark:text-gray-100 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">5 min</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pitch Time</p>
                    </div>
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                    <MessageSquare className="w-6 h-6 text-gray-900 dark:text-gray-100 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">10 min</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Q&A</p>
                    </div>
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                    <Users2 className="w-6 h-6 text-gray-900 dark:text-gray-100 mx-auto.mb-2" />
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
                      className="flex-1 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                    >
                      <Upload className="w-6 h-6" />
                      Submit Your Pitch
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      disabled
                      className="flex-1 px-8 py-4 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-3 text-lg"
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
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
                  <FileText className="w-7 h-7" />
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
                    initial={mounted ? { opacity: 0, x: -20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mounted ? index * 0.05 : 0 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all"
                  >
                    <div className="p-2 bg-gray-900 text-white rounded-lg">
                      <item.icon className="w-5 h-5" />
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
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
                  <Star className="w-8 h-8" />
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
                  initial={mounted ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mounted ? index * 0.1 : 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gray-900 text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <criteria.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {criteria.name}
                        </h4>
                        <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                          {criteria.weight}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        {mounted ? (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${criteria.weight}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className="h-full bg-gray-900 rounded-full"
                          />
                        ) : (
                          <div 
                            className="h-full bg-gray-900 rounded-full"
                            style={{ width: `${criteria.weight}%` }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-gray-900 dark:text-gray-100 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Fair & Transparent Evaluation
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
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
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8" />
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
              <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-200 dark:bg-gray-700"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.phase}
                    initial={mounted ? { opacity: 0, x: -50 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mounted ? index * 0.2 : 0 }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Circle indicator */}
                    <div className="relative z-10">
                      {mounted ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </motion.div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <motion.div
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex-1 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-400 dark:hover:border-gray-600 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {item.phase}
                        </h4>
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm">
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
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mounted ? 0.8 : 0 }}
              className="mt-10 p-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-gray-900 dark:text-gray-100 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Mark Your Calendar
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
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
