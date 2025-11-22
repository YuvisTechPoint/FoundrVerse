"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function WelcomePage() {
  const whatsappGroupLink = "https://whatsapp.com/channel/0029VbB9L7CHQbS20TBFgC1R";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-indigo-50/40">
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <div className="mb-10">
            <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-6" />
            <div className="mb-4 flex items-center gap-4 justify-center">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <Image
                  src="/images/mewayz.jpeg"
                  alt="Mewayz FoundrVerse Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 64px, 80px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">Mewayz</span>
                <span className="text-sm md:text-base font-medium text-gray-600 uppercase tracking-wider">FoundrVerse</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Welcome!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your enrollment is complete. You're now part of India's first practical startup school for students.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
            <ul className="text-left space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Access your course materials and start learning</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Join live founder sessions and get mentorship</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Connect with other students in the community</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Build your startup and pitch to investors</span>
              </li>
            </ul>
          </div>

          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-6"
          >
            <MessageCircle className="h-6 w-6" />
            Join the Official Batch Group
          </a>

          <p className="text-sm text-gray-600 mb-8">
            Join our WhatsApp group to stay updated, ask questions, and connect with your batchmates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-900 text-white hover:bg-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

