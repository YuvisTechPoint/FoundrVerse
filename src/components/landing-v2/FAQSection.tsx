"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Who is this course for?",
    answer: "This course is designed for college students, recent graduates, and aspiring entrepreneurs who want to learn how to build and launch a startup from scratch."
  },
  {
    question: "Do I need any prior experience?",
    answer: "No prior experience is needed. The course is beginner-friendly and takes you step-by-step from idea validation to pitching to investors."
  },
  {
    question: "How long is the course?",
    answer: "The core course is 30 days, but you get lifetime access to all materials. You can learn at your own pace and revisit content anytime."
  },
  {
    question: "Will I get a certificate?",
    answer: "Yes! You'll receive an industry-recognized Startup Certificate upon completion of the course and all assignments."
  },
  {
    question: "How do internships work?",
    answer: "Top-performing students get priority access to certified internships with our partner startups (Mewayz, MyAiNation, PhantomX, Careflow HMS). These are real, hands-on opportunities."
  },
  {
    question: "What is the pitch competition?",
    answer: "At the end of the program, you'll have the chance to pitch your startup idea to a panel of real investors. Top performers can secure funding, pre-incubation support, and mentorship."
  },
  {
    question: "Is the payment one-time or recurring?",
    answer: "It's a one-time payment of ₹1,499. No hidden fees, no subscriptions. You get lifetime access to all course materials."
  },
  {
    question: "What if I don't like the course?",
    answer: "We offer a 7-day money-back guarantee. If you're not satisfied within the first week, we'll refund your payment—no questions asked."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-8">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-gray-900 dark:text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-900 dark:text-white" />
                    )}
                  </div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:debanjansandhaki@mewayz.com"
            className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:underline"
          >
            Email us at debanjansandhaki@mewayz.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}

