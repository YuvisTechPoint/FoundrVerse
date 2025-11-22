import React from "react";

interface IconProps {
  className?: string;
}

export default function MegaphoneIcon({ className = "w-full h-full" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="megaphoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M12 20L28 16V32L12 28V20Z"
        stroke="url(#megaphoneGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M28 16L36 12V36L28 32V16Z"
        stroke="url(#megaphoneGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 20V28"
        stroke="url(#megaphoneGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 24C8 28.4183 10.5817 32 15 32"
        stroke="url(#megaphoneGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="38"
        cy="24"
        r="2"
        fill="url(#megaphoneGradient)"
        opacity="0.7"
      />
    </svg>
  );
}

