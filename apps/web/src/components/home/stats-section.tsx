"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { companyProfile } from "@/data/cms";
import { SectionHeading } from "@/components/shared/section-heading";
import { StitchGlowCard, StitchSection, StitchSectionItem } from "@/components/stitch";

const stats = [
  { key: "eventsManaged" as const, label: "Events Managed", suffix: "+" },
  { key: "happyClients" as const, label: "Happy Clients", suffix: "+" },
  { key: "yearsExperience" as const, label: "Years of Excellence", suffix: "+" },
  { key: "citiesCovered" as const, label: "Cities Worldwide", suffix: "+" },
];

function AnimatedCounter({ value, suffix = "", inView }: { value: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(Math.round(increment * step), value));
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
    <StitchSection className="relative bg-[#f5f0e8]">
      <div className="container-page relative">
        <SectionHeading eyebrow="Our Legacy" title="Numbers That Speak" />
        <div ref={ref} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <StitchSectionItem key={stat.key}>
              <StitchGlowCard hover3d={false} className="p-6 text-center sm:p-8">
                <p className="font-display text-3xl font-bold gradient-text sm:text-4xl lg:text-5xl">
                  <AnimatedCounter
                    value={companyProfile.stats[stat.key]}
                    suffix={stat.suffix}
                    inView={inView}
                  />
                </p>
                <p className="mt-2 text-sm text-muted sm:text-base">{stat.label}</p>
              </StitchGlowCard>
            </StitchSectionItem>
          ))}
        </div>
      </div>
    </StitchSection>
  );
}
