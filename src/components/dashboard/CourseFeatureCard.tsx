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
    // Dark brown/amber theme with glowing orange border
    bg: "bg-gradient-to-br from-amber-950/90 via-amber-900/80 to-amber-950/90 dark:from-amber-950/95 dark:via-amber-900/90 dark:to-amber-950/95",
    iconBg: "bg-white/10 dark:bg-white/10",
    iconColor: "text-white",
    border: "border-2 border-orange-500/60 dark:border-orange-500/70",
    glow: "shadow-lg shadow-orange-500/30 dark:shadow-orange-500/40",
    hoverGlow: "group-hover:shadow-xl group-hover:shadow-orange-500/50 dark:group-hover:shadow-orange-500/60",
    hoverBorder: "group-hover:border-orange-400 dark:group-hover:border-orange-400",
    textColor: "text-white dark:text-white",
    descColor: "text-white/90 dark:text-white/90",
    linkColor: "text-orange-400 dark:text-orange-400",
  },
  diamond: {
    // Dark blue-grey theme
    bg: "bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/95",
    iconBg: "bg-white/10 dark:bg-white/10",
    iconColor: "text-white",
    border: "border border-slate-600/50 dark:border-slate-600/60",
    glow: "shadow-md shadow-slate-500/20 dark:shadow-slate-500/30",
    hoverGlow: "group-hover:shadow-lg group-hover:shadow-slate-500/30 dark:group-hover:shadow-slate-500/40",
    hoverBorder: "group-hover:border-slate-500 dark:group-hover:border-slate-500",
    textColor: "text-white dark:text-white",
    descColor: "text-white/90 dark:text-white/90",
    linkColor: "text-orange-400 dark:text-orange-400",
  },
  platinum: {
    // Dark blue-grey theme (same as diamond for consistency)
    bg: "bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/95",
    iconBg: "bg-white/10 dark:bg-white/10",
    iconColor: "text-white",
    border: "border border-slate-600/50 dark:border-slate-600/60",
    glow: "shadow-md shadow-slate-500/20 dark:shadow-slate-500/30",
    hoverGlow: "group-hover:shadow-lg group-hover:shadow-slate-500/30 dark:group-hover:shadow-slate-500/40",
    hoverBorder: "group-hover:border-slate-500 dark:group-hover:border-slate-500",
    textColor: "text-white dark:text-white",
    descColor: "text-white/90 dark:text-white/90",
    linkColor: "text-orange-400 dark:text-orange-400",
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative p-6 rounded-2xl ${colors.border} ${colors.hoverBorder} ${colors.bg} backdrop-blur-sm transition-all duration-500 ${colors.glow} ${colors.hoverGlow} overflow-hidden cursor-pointer w-full text-left active:scale-[0.98]`}
    >
      {/* Animated background gradient on hover */}
      <div className={`absolute inset-0 ${variant === 'luxury' ? 'bg-gradient-to-br from-orange-500/10 to-transparent' : 'bg-gradient-to-br from-slate-500/10 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      {/* Click to explore link */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className={`text-sm font-medium ${colors.linkColor}`}>Click to explore</span>
        <ArrowRight className={`w-4 h-4 ${colors.linkColor}`} strokeWidth={2.5} />
      </div>
      
      <div className="relative flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex-shrink-0 w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconColor} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
        >
          <Icon size={20} strokeWidth={2.5} className="drop-shadow-sm" />
        </motion.div>
        <div className="flex-1 min-w-0 pt-0.5 pr-16">
          <h4 className={`font-bold ${colors.textColor} text-base mb-2 leading-tight transition-colors`}>
            {title}
          </h4>
          <p className={`text-sm ${colors.descColor} leading-relaxed transition-colors`}>
            {desc}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

