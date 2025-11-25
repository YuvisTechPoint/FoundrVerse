import Hero from "@/components/landing/Hero";
import BlindSpot from "@/components/landing/BlindSpot";
import WhatStudentsGet from "@/components/landing/WhatStudentsGet";
import CourseBreakdown from "@/components/landing/CourseBreakdown";
import InternshipPitch from "@/components/landing/InternshipPitch";
import Pricing from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-all duration-500">
      <Hero />
      <BlindSpot />
      <WhatStudentsGet />
      <CourseBreakdown />
      <InternshipPitch />
      <Pricing />
    </div>
  );
}
