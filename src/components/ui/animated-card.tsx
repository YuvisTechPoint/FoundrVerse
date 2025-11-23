"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  whileInView?: boolean;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  hover = true,
  whileInView = true
}: AnimatedCardProps) {
  const motionProps = whileInView
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay }
      }
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay }
      };

  return (
    <motion.div
      {...motionProps}
      whileHover={hover ? {
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3 }
      } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

