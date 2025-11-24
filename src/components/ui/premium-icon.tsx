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
  
  // Responsive values - optimized for all screen sizes
  const iconSize = size || 24;
  
  // Responsive padding based on icon size
  const paddingClasses = size && size <= 16 
    ? "p-2 sm:p-2.5 md:p-3" 
    : size && size <= 20
    ? "p-2.5 sm:p-3 md:p-3.5"
    : "p-2.5 sm:p-3 md:p-4 lg:p-4";
  
  // Responsive border radius - smaller on mobile
  const radiusClasses = "rounded-xl sm:rounded-xl md:rounded-2xl";
  
  // Responsive glow classes for each variant - lighter on mobile for performance
  const responsiveGlow = {
    luxury: "shadow-[0_0_15px_rgba(251,191,36,0.4)] sm:shadow-[0_0_25px_rgba(251,191,36,0.5),0_0_50px_rgba(245,158,11,0.3)] md:shadow-[0_0_40px_rgba(251,191,36,0.6),0_0_80px_rgba(245,158,11,0.4),0_0_120px_rgba(217,119,6,0.2)]",
    diamond: "shadow-[0_0_15px_rgba(99,102,241,0.4)] sm:shadow-[0_0_25px_rgba(99,102,241,0.5),0_0_50px_rgba(139,92,246,0.3)] md:shadow-[0_0_40px_rgba(99,102,241,0.6),0_0_80px_rgba(139,92,246,0.4),0_0_120px_rgba(168,85,247,0.2)]",
    platinum: "shadow-[0_0_15px_rgba(148,163,184,0.4)] sm:shadow-[0_0_25px_rgba(148,163,184,0.5),0_0_50px_rgba(100,116,139,0.3)] md:shadow-[0_0_40px_rgba(148,163,184,0.6),0_0_80px_rgba(100,116,139,0.4),0_0_120px_rgba(71,85,105,0.2)]",
  };
  
  // Responsive animation values - gentler on mobile
  const wrapperProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: [0, -3, 0], // Reduced movement on mobile
    },
    transition: { 
      scale: {
        type: "spring" as const,
        stiffness: 400,
        damping: 18,
        delay: 0.1,
      },
      opacity: {
        duration: 0.4,
      },
      y: {
        duration: 3.5, // Slightly slower for smoother feel
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    },
    whileHover: { 
      scale: 1.1, // Reduced hover scale for better mobile experience
      rotate: [0, -4, 4, -4, 0], // Gentler rotation
      y: -6, // Less lift on hover
    },
    whileTap: { 
      scale: 0.92, // Better tap feedback
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
        {/* Outer glow ring - responsive blur */}
        <div className={`absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-20 sm:opacity-30 blur-md sm:blur-xl -z-10`} />
        
        {/* Icon container - responsive padding and sizing */}
        <div className={`relative ${radiusClasses} bg-gradient-to-br ${styles.gradient} ${paddingClasses} ${responsiveGlow[variant]} border sm:border-2 ${styles.border} backdrop-blur-sm overflow-hidden`}>
          {/* Inner shine effect */}
          <div className={`absolute inset-0 ${radiusClasses} bg-gradient-to-br from-white/30 sm:from-white/35 md:from-white/40 via-white/10 to-transparent pointer-events-none`} />
          <div className={`absolute inset-0 ${radiusClasses} bg-gradient-to-br from-transparent via-transparent to-black/15 sm:to-black/18 md:to-black/20 pointer-events-none`} />
          
          {/* Icon - responsive size */}
          <Icon 
            size={iconSize} 
            className="relative z-10 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] sm:drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            strokeWidth={size && size <= 16 ? 2 : 2.5}
          />
          
          {/* Bottom highlight */}
          <div className={`absolute bottom-0 left-0 right-0 h-1/2 ${radiusClasses} bg-gradient-to-t from-black/20 sm:from-black/25 md:from-black/30 via-black/10 to-transparent pointer-events-none`} />
        </div>
      </div>
    );
  }

  return (
    <IconWrapper {...wrapperProps} className={`relative inline-block w-auto ${className}`}>
      {/* Pulsating outer glow ring - responsive blur */}
      {animated && (
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.gradient} blur-lg sm:blur-2xl -z-10`}
          style={{ opacity: 0.2 }}
        />
      )}
      
      {/* Outer glow ring - responsive blur */}
      <div className={`absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-20 sm:opacity-30 blur-md sm:blur-xl -z-10`} />
      
      {/* Icon container - responsive padding and sizing */}
      <div className={`relative ${radiusClasses} bg-gradient-to-br ${styles.gradient} ${paddingClasses} ${responsiveGlow[variant]} border sm:border-2 ${styles.border} backdrop-blur-sm overflow-hidden group touch-manipulation`}>
        
        {/* Animated shimmer effect */}
        {animated && (
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className={`absolute inset-0 ${radiusClasses} bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12`}
            style={{ 
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
            }}
          />
        )}
        
        {/* Sparkle effect - responsive positioning and sizing */}
        {animated && (
          <>
            <motion.div
              className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"
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
              className="absolute top-1 right-1.5 sm:top-2 sm:right-3 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"
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
              className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"
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
        
        {/* Inner shine effect - responsive */}
        <div className={`absolute inset-0 ${radiusClasses} bg-gradient-to-br from-white/30 sm:from-white/35 md:from-white/40 via-white/10 to-transparent pointer-events-none`} />
        
        {/* Radial gradient overlay for depth */}
        <div className={`absolute inset-0 ${radiusClasses} bg-gradient-to-br from-transparent via-transparent to-black/15 sm:to-black/18 md:to-black/20 pointer-events-none`} />
        
        {/* Icon with enhanced styling - responsive size */}
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
            size={iconSize} 
            className="relative text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] sm:drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            strokeWidth={size && size <= 16 ? 2 : 2.5}
          />
        </motion.div>
        
        {/* Enhanced bottom highlight - responsive */}
        <div className={`absolute bottom-0 left-0 right-0 h-1/2 ${radiusClasses} bg-gradient-to-t from-black/20 sm:from-black/25 md:from-black/30 via-black/10 to-transparent pointer-events-none`} />
        
        {/* Animated border glow on hover - responsive */}
        <div className={`absolute -inset-0.5 ${radiusClasses} bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-30 sm:group-hover:opacity-40 md:group-hover:opacity-50 blur-sm transition-opacity duration-500 -z-10`} />
      </div>
      
      {/* Corner accents - responsive sizing */}
      {animated && (
        <>
          <div className="absolute -top-0.5 -left-0.5 sm:-top-1 sm:-left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full blur-xs sm:blur-sm" />
          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full blur-xs sm:blur-sm" />
        </>
      )}
    </IconWrapper>
  );
}
