"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Pricing() {
  const features = [
    "Full course",
    "Community access",
    "Internship eligibility",
    "Founder sessions",
    "Pitch competition access",
    "Certification",
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-24 transition-colors duration-300" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-transparent to-indigo-50/30 dark:from-purple-950/30 dark:to-indigo-950/30 pointer-events-none transition-colors duration-300" />
      
      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Learn like a founder, pay like a student
          </h2>
          <p className="text-xl text-gray-600">
            Build a startup before you graduate.
          </p>
        </div>
        
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-gray-200 bg-white p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="text-6xl font-extrabold tracking-tight text-gray-900">{formatPrice(1499)}</span>
            </div>
            <p className="text-sm text-gray-500">One-time payment</p>
          </div>
          
          <ul className="space-y-4 mb-10">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-5 w-5 text-gray-900" />
                </div>
                <span className="text-[15px] text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link 
            href="/signup" 
            className="block w-full bg-gradient-to-r from-gold to-[#f9c866] text-charcoal px-6 py-4 text-center font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-lg mb-4"
          >
            Enroll Now
          </Link>
          
          <p className="text-center text-sm text-gray-500 font-medium">Enroll in 60 seconds</p>
        </div>
      </div>
    </section>
  );
}
