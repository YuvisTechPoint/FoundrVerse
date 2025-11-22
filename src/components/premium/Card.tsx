"use client";

import React from "react";
import { cn } from "@/lib/utils";
import IconBadge from "./IconBadge";

export interface CardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function Card({
  title,
  subtitle,
  description,
  icon,
  featured = false,
  className,
  onClick,
  ariaLabel,
}: CardProps) {
  return (
    <article
      className={cn(
        "premium-card group",
        featured && "premium-card-featured",
        "p-8 md:p-9",
        "border border-transparent",
        "cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-[var(--premium-gold)] focus:ring-offset-2 focus:ring-offset-[var(--premium-bg)]",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel || title}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="mb-6">
        <IconBadge
          icon={icon}
          size="md"
          accent={featured ? "gold" : "gold"}
          decorative
        />
      </div>

      {subtitle && (
        <p className="text-sm font-medium text-[var(--premium-muted)] uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}

      <h3 className="text-2xl md:text-3xl font-serif font-bold text-[var(--premium-bg)] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
        {title}
      </h3>

      <p className="text-[15px] md:text-base text-[var(--premium-muted)] leading-relaxed">
        {description}
      </p>

      {featured && (
        <div className="mt-6 pt-6 border-t border-[var(--premium-gold)]/20">
          <span className="text-xs font-semibold text-[var(--premium-gold)] uppercase tracking-wider">
            Featured
          </span>
        </div>
      )}
    </article>
  );
}

