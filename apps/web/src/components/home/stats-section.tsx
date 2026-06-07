"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { companyProfile } from "@/data/cms";

const stats = [
  {
    key: "eventsManaged" as const,
    label: "Events Managed",
    suffix: "+",
  },
  {
    key: "happyClients" as const,
    label: "Happy Clients",
    suffix: "+",
  },
  {
    key: "yearsExperience" as const,
    label: "Years of Excellence",
    suffix: "+",
  },
  {
    key: "citiesCovered" as const,
    label: "Cities Worldwide",
    suffix: "+",
  },
];

function AnimatedCounter({
  value,
  suffix = "",
  inView,
}: {
  value: number;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 gradient-dark opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Our Legacy
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Numbers That Speak
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group p-6 text-center transition-all hover:shadow-glow sm:p-8"
            >
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                <AnimatedCounter
                  value={companyProfile.stats[stat.key]}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </p>
              <p className="mt-2 text-sm text-muted sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
