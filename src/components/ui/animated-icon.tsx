"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  delay?: number;
  color?: string;
}

export function AnimatedIcon({ 
  icon: Icon, 
  size = 24, 
  className = "",
  delay = 0,
  color
}: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.2, 
        rotate: 15,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Icon size={size} className={color} />
    </motion.div>
  );
}

