"use client";

import { motion } from "framer-motion";

export default function InternshipPitch() {
  const companies = ["Mewayz", "MyAiNation", "PhantomX", "careflow HMS"];
  const pitchFeatures = [
    { title: "Investor panel", desc: "Real investors, real opportunities" },
    { title: "Real funding", desc: "Actual investment opportunities" },
    { title: "Real feedback", desc: "Direct insights from investors" },
    { title: "Spot-pre-incubation", desc: "For top performers" },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 transition-colors duration-300">
      {/* Internship Section */}
      <section className="py-24" id="internship">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Work Inside Real Startups
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Hosted inside:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {companies.map((company) => (
                <span 
                  key={company}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  {company}
                </span>
              ))}
            </div>
            <div className="inline-block bg-gray-100 rounded-2xl px-6 py-4">
              <p className="text-lg font-semibold text-gray-900">
                Top performers get exclusive startup opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pitching Competition Section */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300" id="pitching">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Pitch your startup idea. Raise your first cheque.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pitchFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gold"
              >
                <h3 className="text-xl font-bold text-charcoal mb-2">{feature.title}</h3>
                <p className="text-[15px] text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
