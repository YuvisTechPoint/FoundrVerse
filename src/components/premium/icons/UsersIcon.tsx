import React from "react";

interface IconProps {
  className?: string;
}

export default function UsersIcon({ className = "w-full h-full" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="usersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="6"
        stroke="url(#usersGradient)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M6 36C6 30 10 26 16 26C22 26 26 30 26 36"
        stroke="url(#usersGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="32"
        cy="18"
        r="5"
        stroke="url(#usersGradient)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M38 36C38 31 35 28 32 28C29 28 26 31 26 36"
        stroke="url(#usersGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24 14C25.1046 14 26 13.1046 26 12C26 10.8954 25.1046 10 24 10"
        stroke="url(#usersGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

