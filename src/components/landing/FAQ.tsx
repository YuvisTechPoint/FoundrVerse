"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Who is this program for?",
    answer: "This program is designed for students who want to learn practical startup skills from real founders. Whether you're in college, just graduated, or looking to build your first startup, this program will give you hands-on experience and real-world knowledge."
  },
  {
    question: "What will I learn in 30 days?",
    answer: "You'll learn the complete startup journey: from idea validation to building an MVP, marketing your product, and pitching to investors. Each week focuses on a different aspect: Week 1 - Idea & Validation, Week 2 - Product & MVP, Week 3 - Marketing & Branding, Week 4 - Sales, Funding & Pitching."
  },
  {
    question: "Are the internships guaranteed?",
    answer: "Top performers in the program will be eligible for certified internships across our 4 partner startups: Mewayz, MyAiNation, PhantomX, and careflow HMS. Internships are awarded based on performance, participation, and project quality."
  },
  {
    question: "What happens in the pitching competition?",
    answer: "At the end of the program, you'll pitch your startup idea to a panel of real investors. This includes real funding opportunities, direct feedback, and spot-pre-incubation for top performers. It's a real chance to raise your first cheque."
  },
  {
    question: "Do I need prior experience?",
    answer: "No prior experience is required! This program is designed for beginners. We'll teach you everything from scratch, including no-code tools to build your MVP. All you need is enthusiasm and commitment."
  },
  {
    question: "What's included in the ₹1499 price?",
    answer: "The price includes the full 30-day course, community access, internship eligibility, live founder sessions, pitch competition access, and an industry-grade startup certificate. It's a complete package to get you started on your entrepreneurial journey."
  },
  {
    question: "How much time do I need to commit?",
    answer: "We recommend dedicating 2-3 hours per day to get the most out of the program. This includes watching sessions, completing hands-on tasks, and working on your startup project. The program is designed to fit around your schedule."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 7-day money-back guarantee. If you're not satisfied with the program within the first week, you can request a full refund. We're confident you'll love the program, but we want you to feel secure in your investment."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white dark:bg-gray-900 py-24 transition-colors duration-300" id="faq">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal dark:text-white mb-4 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Everything you need to know about Mewayz - FoundrVerse
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow transition-colors duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-2xl transition-colors duration-300"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-charcoal dark:text-white pr-4 transition-colors duration-300">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 transition-colors ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

