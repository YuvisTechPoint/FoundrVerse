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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Work Inside Real Startups
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
              Hosted inside:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {companies.map((company, index) => (
                <motion.span
                  key={company}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                  className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 rounded-xl font-semibold shadow-sm hover:shadow-xl transition-shadow border border-gray-700 dark:border-gray-600 relative overflow-hidden group cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10">{company}</span>
                </motion.span>
              ))}
            </div>
            <div className="inline-block bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <p className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Pitch your startup idea. Raise your first cheque.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pitchFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:border-gold dark:hover:border-gold/50 relative overflow-hidden group"
              >
                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                {/* Animated accent line */}
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-gold to-purple-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                />
                
                <h3 className="text-xl font-bold text-charcoal dark:text-white mb-2 transition-colors duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-gray-600 dark:text-gray-300 transition-colors duration-300 relative z-10">
                  {feature.desc}
                </p>
                
                {/* Decorative corner */}
                <motion.div
                  className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gold/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
