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
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.6),0_0_80px_rgba(245,158,11,0.4),0_0_120px_rgba(217,119,6,0.2)]",
    border: "border-amber-300/70",
    pulse: "rgba(251,191,36,0.5)",
  },
  diamond: {
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    glow: "shadow-[0_0_40px_rgba(99,102,241,0.6),0_0_80px_rgba(139,92,246,0.4),0_0_120px_rgba(168,85,247,0.2)]",
    border: "border-indigo-300/70",
    pulse: "rgba(99,102,241,0.5)",
  },
  platinum: {
    gradient: "from-slate-400 via-gray-500 to-slate-600",
    glow: "shadow-[0_0_40px_rgba(148,163,184,0.6),0_0_80px_rgba(100,116,139,0.4),0_0_120px_rgba(71,85,105,0.2)]",
    border: "border-slate-300/70",
    pulse: "rgba(148,163,184,0.5)",
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
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: [0, -5, 0],
    },
    transition: { 
      scale: {
        type: "spring" as const,
        stiffness: 500,
        damping: 20,
        delay: 0.1,
      },
      opacity: {
        duration: 0.4,
      },
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    },
    whileHover: { 
      scale: 1.15, 
      rotate: [0, -5, 5, -5, 0],
      y: -8,
    },
    whileTap: { 
      scale: 0.95,
    },
  } : {};

  const pulseVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.6, 0.3],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  const shimmerVariants = {
    animate: {
      x: ["-100%", "200%"],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    }
  };

  if (!animated) {
    return (
      <div className={`relative inline-block ${className}`}>
        {/* Outer glow ring */}
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-30 blur-xl -z-10`} />
        
        {/* Icon container */}
        <div className={`relative rounded-2xl bg-gradient-to-br ${styles.gradient} p-4 ${styles.glow} border-2 ${styles.border} backdrop-blur-sm overflow-hidden`}>
          {/* Inner shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />
          
          {/* Icon */}
          <Icon 
            size={size} 
            className="relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            strokeWidth={2.5}
          />
          
          {/* Bottom highlight */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-2xl bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  return (
    <IconWrapper {...wrapperProps} className={`relative inline-block ${className}`}>
      {/* Pulsating outer glow ring */}
      {animated && (
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.gradient} blur-2xl -z-10`}
          style={{ opacity: 0.3 }}
        />
      )}
      
      {/* Outer glow ring */}
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-30 blur-xl -z-10`} />
      
      {/* Icon container */}
      <div className={`relative rounded-2xl bg-gradient-to-br ${styles.gradient} p-4 ${styles.glow} border-2 ${styles.border} backdrop-blur-sm overflow-hidden group`}>
        
        {/* Animated shimmer effect */}
        {animated && (
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            style={{ 
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
            }}
          />
        )}
        
        {/* Sparkle effect - top right */}
        {animated && (
          <>
            <motion.div
              className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </>
        )}
        
        {/* Inner shine effect - enhanced */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />
        
        {/* Icon with enhanced styling */}
        <motion.div
          className="relative z-10"
          animate={animated ? {
            filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
          } : {}}
          transition={animated ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          } : {}}
        >
          <Icon 
            size={size} 
            className="relative text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            strokeWidth={2.5}
          />
        </motion.div>
        
        {/* Enhanced bottom highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-2xl bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
        
        {/* Animated border glow on hover */}
        <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500 -z-10`} />
      </div>
      
      {/* Corner accents */}
      {animated && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/60 rounded-full blur-sm" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white/60 rounded-full blur-sm" />
        </>
      )}
    </IconWrapper>
  );
}
