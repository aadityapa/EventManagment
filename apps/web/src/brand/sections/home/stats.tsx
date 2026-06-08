"use client";

import { useRef } from "react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BRAND_STATS } from "@/brand/data/content";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

export function HomeStats() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapContext(ref, () => {
    ref.current?.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number((el as HTMLElement).dataset.end);
      const suffix = (el as HTMLElement).dataset.suffix ?? "";
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 2.2, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => { (el as HTMLElement).textContent = `${Math.round(obj.v).toLocaleString("en-IN")}${suffix}`; },
      });
    });
  }, []);

  return (
    <BrandSection alt>
      <BrandHeader label="Our Legacy" title="Numbers That Define Excellence" center />
      <div ref={ref} className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
        {BRAND_STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p data-count data-end={s.value} data-suffix={s.suffix} className="brand-display text-4xl font-bold text-[var(--glitz-gold)] sm:text-5xl lg:text-6xl">0{s.suffix}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-muted)]">{s.label}</p>
          </div>
        ))}
      </div>
    </BrandSection>
  );
}
