"use client";

import { BookOpen, Users, Award, Code, Briefcase, Users2, Megaphone, LucideIcon } from "lucide-react";
import { PremiumIcon } from "@/components/ui/premium-icon";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Users,
  Award,
  Code,
  Briefcase,
  Users2,
  Megaphone,
};

interface QuickActionCardProps {
  iconName: string;
  title: string;
  description: string;
  variant?: "luxury" | "diamond" | "platinum";
}

export default function QuickActionCard({ 
  iconName, 
  title, 
  description, 
  variant = "luxury" 
}: QuickActionCardProps) {
  const Icon = iconMap[iconName] || BookOpen;
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gold/30 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative mb-4">
        <PremiumIcon 
          icon={Icon} 
          size={28} 
          variant={variant}
          className="!p-3"
          animated={true}
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gold transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </div>
  );
}

