"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumIconProps {
  icon: LucideIcon;
  size?: number;
  variant?: "luxury" | "diamond" | "platinum";
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  luxury: {
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.4),0_0_60px_rgba(245,158,11,0.2)]",
    border: "border-amber-300/50",
  },
  diamond: {
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.4),0_0_60px_rgba(139,92,246,0.2)]",
    border: "border-indigo-300/50",
  },
  platinum: {
    gradient: "from-slate-400 via-gray-500 to-slate-600",
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.4),0_0_60px_rgba(100,116,139,0.2)]",
    border: "border-slate-300/50",
  },
};

export function PremiumIcon({ 
  icon: Icon, 
  size = 24, 
  variant = "luxury",
  className = "",
  animated = false 
}: PremiumIconProps) {
  const styles = variantStyles[variant];
  
  const IconWrapper = animated ? motion.div : "div";
  const wrapperProps = animated ? {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  return (
    <IconWrapper {...wrapperProps} className="relative inline-block">
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-20 blur-xl`} />
      
      {/* Icon container */}
      <div className={`relative rounded-2xl bg-gradient-to-br ${styles.gradient} p-4 ${styles.glow} border ${styles.border} backdrop-blur-sm`}>
        {/* Inner shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
        
        {/* Icon */}
        <Icon 
          size={size} 
          className="relative z-10 text-white drop-shadow-lg" 
          strokeWidth={2.5}
        />
        
        {/* Bottom highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </IconWrapper>
  );
}

