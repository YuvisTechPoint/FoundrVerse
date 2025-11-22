import React from "react";

interface IconProps {
  className?: string;
}

export default function BriefcaseIcon({ className = "w-full h-full" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="briefcaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect
        x="10"
        y="14"
        width="28"
        height="24"
        rx="2"
        stroke="url(#briefcaseGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 20H38"
        stroke="url(#briefcaseGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 14V10C20 8.89543 20.8954 8 22 8H26C27.1046 8 28 8.89543 28 10V14"
        stroke="url(#briefcaseGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 28L24 32L30 28"
        stroke="url(#briefcaseGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="16"
        cy="24"
        r="1.5"
        fill="url(#briefcaseGradient)"
        opacity="0.7"
      />
      <circle
        cx="32"
        cy="24"
        r="1.5"
        fill="url(#briefcaseGradient)"
        opacity="0.7"
      />
    </svg>
  );
}

