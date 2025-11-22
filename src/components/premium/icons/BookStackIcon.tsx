import React from "react";

interface IconProps {
  className?: string;
}

export default function BookStackIcon({ className = "w-full h-full" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M8 12C8 10.8954 8.89543 10 10 10H38C39.1046 10 40 10.8954 40 12V36C40 37.1046 39.1046 38 38 38H10C8.89543 38 8 37.1046 8 36V12Z"
        stroke="url(#bookGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 16H40"
        stroke="url(#bookGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M14 22H34"
        stroke="url(#bookGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M14 28H30"
        stroke="url(#bookGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M6 14V38C6 39.1046 6.89543 40 8 40H42C43.1046 40 44 39.1046 44 38V14"
        stroke="url(#bookGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

