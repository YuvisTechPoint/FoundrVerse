import Hero from "@/components/landing/Hero";
import BlindSpot from "@/components/landing/BlindSpot";
import WhatStudentsGet from "@/components/landing/WhatStudentsGet";
import CourseBreakdown from "@/components/landing/CourseBreakdown";
import InternshipPitch from "@/components/landing/InternshipPitch";
import Pricing from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Hero />
      <BlindSpot />
      <WhatStudentsGet />
      <CourseBreakdown />
      <InternshipPitch />
      <Pricing />
    </div>
  );
}
