"use client";

import { BookOpen, Users, Award, Code, Briefcase, Users2, Megaphone, LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumIcon } from "@/components/ui/premium-icon";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Users,
  Award,
  Code,
  Briefcase,
  Users2,
  Megaphone,
};

const variantStyles = {
  luxury: {
    gradient: "from-amber-500/10 via-amber-400/5 to-transparent",
    border: "border-2 border-amber-200 dark:border-amber-800/50",
    hoverBorder: "group-hover:border-amber-300 dark:group-hover:border-amber-700/70",
    glow: "shadow-md shadow-amber-500/10 dark:shadow-amber-500/10 group-hover:shadow-lg group-hover:shadow-amber-500/20 dark:group-hover:shadow-amber-500/30",
    bg: "bg-white dark:bg-gray-900/80",
  },
  diamond: {
    gradient: "from-indigo-500/10 via-indigo-400/5 to-transparent",
    border: "border-2 border-indigo-200 dark:border-indigo-800/50",
    hoverBorder: "group-hover:border-indigo-300 dark:group-hover:border-indigo-700/70",
    glow: "shadow-md shadow-indigo-500/10 dark:shadow-indigo-500/10 group-hover:shadow-lg group-hover:shadow-indigo-500/20 dark:group-hover:shadow-indigo-500/30",
    bg: "bg-white dark:bg-gray-900/80",
  },
  platinum: {
    gradient: "from-slate-500/10 via-slate-400/5 to-transparent",
    border: "border-2 border-slate-200 dark:border-slate-800/50",
    hoverBorder: "group-hover:border-slate-300 dark:group-hover:border-slate-700/70",
    glow: "shadow-md shadow-slate-500/10 dark:shadow-slate-500/10 group-hover:shadow-lg group-hover:shadow-slate-500/20 dark:group-hover:shadow-slate-500/30",
    bg: "bg-white dark:bg-gray-900/80",
  },
};

interface QuickActionCardProps {
  iconName: string;
  title: string;
  description: string;
  variant?: "luxury" | "diamond" | "platinum";
}

export default function QuickActionCard({ 
  iconName, 
  title, 
  description, 
  variant = "luxury" 
}: QuickActionCardProps) {
  const Icon = iconMap[iconName] || BookOpen;
  const styles = variantStyles[variant];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative ${styles.bg} backdrop-blur-xl ${styles.border} ${styles.hoverBorder} rounded-3xl p-8 transition-all duration-500 ${styles.glow} overflow-hidden cursor-pointer`}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-6"
        >
          <PremiumIcon 
            icon={Icon} 
            size={32} 
            variant={variant}
            className="!p-4"
            animated={true}
          />
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
          {description}
        </p>
        
        {/* Arrow indicator */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

