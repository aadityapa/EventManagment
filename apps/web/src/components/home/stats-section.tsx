"use client";

import { useRef } from "react";
import { companyProfile } from "@/data/cms";
import { LuxurySection } from "@/components/shared/luxury-section";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

const STATS = [
  { key: "eventsManaged" as const, label: "Events Managed", suffix: "+" },
  { key: "happyClients" as const, label: "Happy Clients", suffix: "+" },
  { key: "yearsExperience" as const, label: "Years Experience", suffix: "+" },
  { key: "citiesCovered" as const, label: "Cities Covered", suffix: "+" },
];

export function StatsSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    gridRef,
    () => {
      const counters = gridRef.current?.querySelectorAll("[data-counter]");
      counters?.forEach((el) => {
        const value = Number((el as HTMLElement).dataset.value);
        const suffix = (el as HTMLElement).dataset.suffix ?? "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = `${Math.round(obj.val).toLocaleString("en-IN")}${suffix}`;
          },
        });
      });
    },
    []
  );

  return (
    <LuxurySection
      label="Our Legacy"
      title="Numbers That Speak Excellence"
      subtitle="Over a decade of crafting unforgettable moments for India's most discerning clients."
      className="border-y border-border/40 bg-secondary/50"
    >
      <div
        ref={gridRef}
        className="container-page grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
      >
        {STATS.map((stat) => (
          <div key={stat.key} className="text-center">
            <p
              data-counter
              data-value={companyProfile.stats[stat.key]}
              data-suffix={stat.suffix}
              className="font-display text-4xl font-bold text-primary sm:text-5xl lg:text-6xl"
              aria-label={`${companyProfile.stats[stat.key]}${stat.suffix} ${stat.label}`}
            >
              0{stat.suffix}
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </LuxurySection>
  );
}
