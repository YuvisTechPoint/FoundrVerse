"use client";

import React from "react";

// Premium Course Icon - Open book with sparkles
export const PremiumCourseIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="courseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <path d="M32 8L12 18V48L32 58L52 48V18L32 8Z" fill="url(#courseGrad)" stroke="#1f2937" strokeWidth="2"/>
    <path d="M32 18V58" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="28" r="2" fill="white" opacity="0.9"/>
    <circle cx="40" cy="28" r="2" fill="white" opacity="0.9"/>
    <circle cx="32" cy="38" r="2" fill="white" opacity="0.9"/>
    <path d="M20 24L28 24M36 24L44 24M20 34L28 34M36 34L44 34" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Premium Execution Icon - Code brackets with gear
export const PremiumExecutionIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="execGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect x="8" y="16" width="12" height="32" rx="2" fill="url(#execGrad)" stroke="#1f2937" strokeWidth="2"/>
    <rect x="44" y="16" width="12" height="32" rx="2" fill="url(#execGrad)" stroke="#1f2937" strokeWidth="2"/>
    <path d="M24 24L32 32L24 40M40 24L32 32L40 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="32" r="6" fill="white" opacity="0.2"/>
  </svg>
);

// Premium Internship Icon - Briefcase with star
export const PremiumInternshipIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="internGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
    <rect x="12" y="20" width="40" height="28" rx="2" fill="url(#internGrad)" stroke="#1f2937" strokeWidth="2"/>
    <rect x="20" y="12" width="24" height="12" rx="2" fill="url(#internGrad)" stroke="#1f2937" strokeWidth="2"/>
    <path d="M24 12V20M40 12V20" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 32H44" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 20L34 26L40 26L35 30L37 36L32 32L27 36L29 30L24 26L30 26L32 20Z" fill="white" opacity="0.9"/>
  </svg>
);

// Premium Sessions Icon - Users with connection lines
export const PremiumSessionsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="24" r="8" fill="url(#sessGrad)" stroke="#1f2937" strokeWidth="2"/>
    <circle cx="44" cy="24" r="8" fill="url(#sessGrad)" stroke="#1f2937" strokeWidth="2"/>
    <circle cx="32" cy="40" r="8" fill="url(#sessGrad)" stroke="#1f2937" strokeWidth="2"/>
    <path d="M24 28L28 32M36 32L40 28M28 36L32 40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="24" r="3" fill="white" opacity="0.8"/>
    <circle cx="44" cy="24" r="3" fill="white" opacity="0.8"/>
    <circle cx="32" cy="40" r="3" fill="white" opacity="0.8"/>
  </svg>
);

// Premium Pitching Icon - Megaphone with sound waves
export const PremiumPitchingIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <path d="M16 20L16 44L28 44L40 52L40 12L28 20L16 20Z" fill="url(#pitchGrad)" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M40 20L52 20L52 44L40 44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48 24L56 24M48 28L58 28M48 32L56 32M48 36L58 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="32" r="2" fill="white" opacity="0.9"/>
  </svg>
);

// Premium Certification Icon - Award badge with ribbon
export const PremiumCertificationIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <path d="M32 8L20 14L20 26L12 30L20 34L20 46L32 52L44 46L44 34L52 30L44 26L44 14L32 8Z" fill="url(#certGrad)" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="32" cy="30" r="6" fill="white" opacity="0.3"/>
    <path d="M28 30L31 33L36 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 48L32 52L40 48" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 50L32 54L36 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

