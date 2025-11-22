"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  accent?: "gold" | "blue" | "default";
  className?: string;
  ariaLabel?: string;
  decorative?: boolean;
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const iconSizeClasses = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-8 h-8",
};

const accentClasses = {
  gold: "border-[var(--premium-gold)]",
  blue: "border-blue-400",
  default: "border-gray-300",
};

export default function IconBadge({
  icon,
  size = "md",
  accent = "gold",
  className,
  ariaLabel,
  decorative = false,
}: IconBadgeProps) {
  return (
    <div
      className={cn(
        "premium-icon-badge",
        sizeClasses[size],
        accentClasses[accent],
        className
      )}
      role={decorative ? "presentation" : undefined}
      aria-label={ariaLabel}
      aria-hidden={decorative}
    >
      <div className={cn("text-[var(--premium-gold)]", iconSizeClasses[size])}>
        {icon}
      </div>
    </div>
  );
}

