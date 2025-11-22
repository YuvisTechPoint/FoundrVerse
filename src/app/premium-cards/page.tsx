"use client";

import CardsGrid from "@/components/premium/CardsGrid";
import { CardProps } from "@/components/premium/Card";
import BookStackIcon from "@/components/premium/icons/BookStackIcon";
import HammerGavelIcon from "@/components/premium/icons/HammerGavelIcon";
import BriefcaseIcon from "@/components/premium/icons/BriefcaseIcon";
import UsersIcon from "@/components/premium/icons/UsersIcon";
import MegaphoneIcon from "@/components/premium/icons/MegaphoneIcon";
import AwardIcon from "@/components/premium/icons/AwardIcon";

const premiumCards: CardProps[] = [
  {
    title: "The Course",
    subtitle: "Foundation",
    description: "30-Day Startup Blueprint. Build idea, product, brand, marketing, growth, funding.",
    icon: <BookStackIcon />,
    featured: true,
  },
  {
    title: "Practical Execution",
    subtitle: "Hands-On",
    description: "Hands-on tasks taught by real founders of 4 active startups.",
    icon: <HammerGavelIcon />,
  },
  {
    title: "Internship",
    subtitle: "Experience",
    description: "Certified internships across your 4 companies for top students.",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Live Founder Sessions",
    subtitle: "Mentorship",
    description: "Direct mentorship slots with you and your team.",
    icon: <UsersIcon />,
  },
  {
    title: "Pitching Competition",
    subtitle: "Opportunity",
    description: "Pitch to investors at the end of the program.",
    icon: <MegaphoneIcon />,
  },
  {
    title: "Certification",
    subtitle: "Achievement",
    description: "Industry-Grade Startup Certificate.",
    icon: <AwardIcon />,
  },
];

export default function PremiumCardsPage() {
  return (
    <div className="min-h-screen">
      <header className="premium-bg-gradient py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Premium Experience
          </h1>
          <p className="text-xl md:text-2xl text-[var(--premium-ivory)]/90 max-w-2xl mx-auto leading-relaxed">
            Where students become CEOs. Intern, build, pitch, scale.
          </p>
        </div>
      </header>
      <CardsGrid cards={premiumCards} />
    </div>
  );
}

