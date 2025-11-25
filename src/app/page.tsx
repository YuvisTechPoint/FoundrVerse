import HeroSection from "@/components/landing-v2/HeroSection";
import BlindSpotSection from "@/components/landing-v2/BlindSpotSection";
import WhatStudentsGetSection from "@/components/landing-v2/WhatStudentsGetSection";
import CourseBreakdownSection from "@/components/landing-v2/CourseBreakdownSection";
import InternshipSection from "@/components/landing-v2/InternshipSection";
import PitchingSection from "@/components/landing-v2/PitchingSection";
import PricingSection from "@/components/landing-v2/PricingSection";
import FAQSection from "@/components/landing-v2/FAQSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <HeroSection />
      
      {/* The Blind Spot in Indian Education */}
      <BlindSpotSection />
      
      {/* What Students Get (6 Cards) */}
      <WhatStudentsGetSection />
      
      {/* Course Breakdown (30-Day Roadmap) */}
      <CourseBreakdownSection />
      
      {/* Internship Section */}
      <InternshipSection />
      
      {/* Pitching Competition */}
      <PitchingSection />
      
      {/* Pricing & Enroll */}
      <PricingSection />
      
      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
