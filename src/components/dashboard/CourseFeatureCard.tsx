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
    surface: "bg-gradient-to-br from-[#3b1a0c] via-[#1f0f08] to-[#0c0504]",
    border: "border border-amber-400/40",
    focus: "focus-visible:ring-2 focus-visible:ring-amber-300/40",
    shadow: "shadow-[0_25px_70px_rgba(255,149,64,0.35)]",
    hoverShadow: "group-hover:shadow-[0_35px_90px_rgba(255,179,97,0.45)]",
    iconBg: "bg-gradient-to-br from-amber-400/20 to-amber-500/10",
    iconColor: "text-amber-50",
    badgeBg: "bg-white/10",
    badgeText: "text-amber-100",
    textColor: "text-amber-50",
    descColor: "text-amber-50/80",
    muted: "text-amber-100/70",
    shimmer: "from-amber-300/40 via-transparent to-transparent",
    glow: "bg-amber-400/30",
  },
  diamond: {
    surface: "bg-gradient-to-br from-[#101f3d] via-[#0a1224] to-[#04070f]",
    border: "border border-slate-400/40",
    focus: "focus-visible:ring-2 focus-visible:ring-indigo-300/40",
    shadow: "shadow-[0_25px_70px_rgba(32,56,108,0.35)]",
    hoverShadow: "group-hover:shadow-[0_35px_90px_rgba(74,116,194,0.45)]",
    iconBg: "bg-gradient-to-br from-indigo-400/15 to-slate-100/10",
    iconColor: "text-white",
    badgeBg: "bg-white/10",
    badgeText: "text-slate-100",
    textColor: "text-white",
    descColor: "text-slate-100/85",
    muted: "text-slate-200/70",
    shimmer: "from-indigo-300/40 via-transparent to-transparent",
    glow: "bg-indigo-400/30",
  },
  platinum: {
    surface: "bg-gradient-to-br from-[#0c2431] via-[#05131c] to-[#02090d]",
    border: "border border-cyan-300/40",
    focus: "focus-visible:ring-2 focus-visible:ring-cyan-200/40",
    shadow: "shadow-[0_25px_70px_rgba(34,197,247,0.28)]",
    hoverShadow: "group-hover:shadow-[0_35px_90px_rgba(103,232,249,0.4)]",
    iconBg: "bg-gradient-to-br from-cyan-300/20 to-blue-500/10",
    iconColor: "text-cyan-50",
    badgeBg: "bg-white/10",
    badgeText: "text-cyan-100",
    textColor: "text-white",
    descColor: "text-cyan-50/80",
    muted: "text-cyan-100/70",
    shimmer: "from-cyan-300/40 via-transparent to-transparent",
    glow: "bg-cyan-300/25",
  },
} as const;

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
  badge?: string;
  ctaLabel?: string;
  onClick?: () => void;
}

export default function CourseFeatureCard({ 
  iconName, 
  title, 
  desc, 
  variant,
  badge,
  ctaLabel,
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
  
  const callToAction = ctaLabel ?? "Click to explore";

  return (
    <motion.button
      type="button"
      aria-label={`${title} feature card`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative w-full text-left focus:outline-none ${colors.focus}`}
    >
      <div className={`relative overflow-hidden rounded-[32px] p-[1.5px] transition-all duration-500 ${colors.border} ${colors.shadow} ${colors.hoverShadow}`}>
        <div className="absolute inset-x-6 -top-12 h-24 bg-gradient-to-b from-white/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-[32px] bg-black/20 blur-3xl pointer-events-none" />
        <div className={`relative rounded-[calc(2rem-3px)] ${colors.surface} px-7 py-7 min-h-[240px] flex flex-col gap-6 overflow-hidden`}
        >
          <div className={`absolute -inset-y-12 inset-x-6 ${colors.glow} opacity-0 group-hover:opacity-60 blur-3xl transition-opacity duration-700`} />
          {/* Hover shimmer */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.shimmer} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)] opacity-40" />

          <div className="relative flex items-center justify-between">
            <span className={`text-[11px] uppercase tracking-[0.32em] font-semibold px-4 py-1 rounded-full backdrop-blur ${colors.badgeBg} ${colors.badgeText}`}>
              {badge ?? "Core feature"}
            </span>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 4 }}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl ${colors.iconBg} flex items-center justify-center ${colors.iconColor} backdrop-blur-sm border border-white/10 shadow-inner shadow-black/40`}
            >
              <Icon size={22} strokeWidth={2.4} />
            </motion.div>
          </div>

          <div className="relative flex-1">
            <h4 className={`text-2xl font-semibold leading-snug mb-3 ${colors.textColor}`}>
              {title}
            </h4>
            <p className={`text-base leading-relaxed ${colors.descColor}`}>
              {desc}
            </p>
          </div>

          <div className="relative flex items-center justify-between text-sm font-medium pt-1">
            <span className={`${colors.muted} tracking-wide`}>{callToAction}</span>
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-white/30 group-hover:w-10 transition-all duration-300" />
              <ArrowRight className={`w-4 h-4 ${colors.muted} transition-transform duration-300 group-hover:translate-x-1.5`} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

