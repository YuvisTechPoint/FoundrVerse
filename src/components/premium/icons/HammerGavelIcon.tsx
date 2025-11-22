import React from "react";

interface IconProps {
  className?: string;
}

export default function HammerGavelIcon({ className = "w-full h-full" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hammerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M16 8L24 16L20 20L12 12L16 8Z"
        stroke="url(#hammerGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 12L20 20"
        stroke="url(#hammerGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20L28 28L24 32L16 24L20 20Z"
        stroke="url(#hammerGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M32 36L40 44"
        stroke="url(#hammerGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="40"
        cy="44"
        r="2"
        fill="url(#hammerGradient)"
        opacity="0.8"
      />
      <path
        d="M8 32L16 40"
        stroke="url(#hammerGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

