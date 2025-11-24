"use client";

import { BookOpen, Code, Briefcase, Users2, Megaphone, Award, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Code,
  Briefcase,
  Users2,
  Megaphone,
  Award,
};

const variantColors = {
  luxury: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/50",
  },
  diamond: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800/50",
  },
  platinum: {
    bg: "bg-slate-50 dark:bg-slate-800/20",
    iconBg: "bg-slate-100 dark:bg-slate-700/30",
    iconColor: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700/50",
  },
};

interface CourseFeatureCardProps {
  iconName: string;
  title: string;
  desc: string;
  variant: "luxury" | "diamond" | "platinum";
}

export default function CourseFeatureCard({ 
  iconName, 
  title, 
  desc, 
  variant 
}: CourseFeatureCardProps) {
  const Icon = iconMap[iconName] || BookOpen;
  const colors = variantColors[variant];
  
  return (
    <div
      className={`group relative p-5 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-300 hover:border-opacity-60`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconColor} transition-transform duration-300 group-hover:scale-105`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5 leading-tight">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

