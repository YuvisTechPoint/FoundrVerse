"use client";

import { BookOpen, Code, Briefcase, Users2, Megaphone, Award, LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Code,
  Briefcase,
  Users2,
  Megaphone,
  Award,
};

const variantColors = {
  luxury: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/30 dark:to-amber-900/20",
    iconBg: "bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-700",
    iconColor: "text-white",
    border: "border-2 border-amber-200 dark:border-amber-800/40",
    glow: "shadow-md shadow-amber-500/10 dark:shadow-amber-500/20",
    hoverGlow: "group-hover:shadow-lg group-hover:shadow-amber-500/20 dark:group-hover:shadow-amber-500/40",
    hoverBorder: "group-hover:border-amber-300 dark:group-hover:border-amber-700",
  },
  diamond: {
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/60 dark:from-indigo-950/30 dark:to-indigo-900/20",
    iconBg: "bg-gradient-to-br from-indigo-700 to-indigo-800 dark:from-indigo-500 dark:to-indigo-600",
    iconColor: "text-white",
    border: "border-2 border-indigo-200 dark:border-indigo-800/40",
    glow: "shadow-md shadow-indigo-500/10 dark:shadow-indigo-500/20",
    hoverGlow: "group-hover:shadow-lg group-hover:shadow-indigo-500/20 dark:group-hover:shadow-indigo-500/40",
    hoverBorder: "group-hover:border-indigo-300 dark:group-hover:border-indigo-700",
  },
  platinum: {
    bg: "bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-800/30 dark:to-slate-700/20",
    iconBg: "bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-600 dark:to-slate-700",
    iconColor: "text-white",
    border: "border-2 border-slate-200 dark:border-slate-700/40",
    glow: "shadow-md shadow-slate-500/10 dark:shadow-slate-500/20",
    hoverGlow: "group-hover:shadow-lg group-hover:shadow-slate-500/20 dark:group-hover:shadow-slate-500/40",
    hoverBorder: "group-hover:border-slate-300 dark:group-hover:border-slate-600",
  },
};

// Map feature titles to routes
const getFeatureRoute = (title: string): string | null => {
  switch (title) {
    case "30-Day Course":
      return "/course";
    case "Practical Tasks":
      return "/assignments";
    case "Internship":
      return "/internships";
    case "Live Sessions":
      return "/sessions";
    case "Pitch Competition":
      return "/pitch";
    case "Certificate":
      return "/certificate";
    default:
      return null;
  }
};

interface CourseFeatureCardProps {
  iconName: string;
  title: string;
  desc: string;
  variant: "luxury" | "diamond" | "platinum";
  onClick?: () => void;
}

export default function CourseFeatureCard({ 
  iconName, 
  title, 
  desc, 
  variant,
  onClick
}: CourseFeatureCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const Icon = iconMap[iconName] || BookOpen;
  const colors = variantColors[variant];
  
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    const route = getFeatureRoute(title);
    if (route) {
      router.push(route);
    } else {
      toast({
        title: `${title} Feature`,
        description: `This feature is coming soon!`,
      });
    }
  };
  
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative p-6 rounded-2xl ${colors.border} ${colors.hoverBorder} ${colors.bg} backdrop-blur-sm transition-all duration-500 ${colors.glow} ${colors.hoverGlow} overflow-hidden cursor-pointer w-full text-left active:scale-[0.98]`}
    >
      {/* Animated background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${variant === 'luxury' ? 'from-amber-500/10' : variant === 'diamond' ? 'from-indigo-500/10' : 'from-slate-500/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      {/* Arrow indicator */}
      <motion.div 
        className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ x: 4 }}
      >
        <ArrowRight className={`w-5 h-5 ${variant === 'luxury' ? 'text-amber-600 dark:text-amber-400' : variant === 'diamond' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} strokeWidth={2.5} />
      </motion.div>
      
      {/* Click indicator badge */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${variant === 'luxury' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : variant === 'diamond' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'}`}>
          Click to explore
        </div>
      </div>
      
      <div className="relative flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.15, rotate: 8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex-shrink-0 w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconColor} shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-1 ring-black/10 dark:ring-white/10`}
        >
          <Icon size={22} strokeWidth={2.5} className="drop-shadow-md" />
        </motion.div>
        <div className="flex-1 min-w-0 pt-0.5 pr-6">
          <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1.5 leading-tight group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
            {desc}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

