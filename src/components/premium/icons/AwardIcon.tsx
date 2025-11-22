import React from "react";

interface IconProps {
  className?: string;
}

export default function AwardIcon({ className = "w-full h-full" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="awardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M24 6L28 16L38 18L30 26L31 36L24 32L17 36L18 26L10 18L20 16L24 6Z"
        stroke="url(#awardGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="4"
        stroke="url(#awardGradient)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M24 20V28"
        stroke="url(#awardGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 24H28"
        stroke="url(#awardGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 32V42"
        stroke="url(#awardGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

