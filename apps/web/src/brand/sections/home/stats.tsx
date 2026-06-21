/** @deprecated legacy — not mounted on V4 home (consolidated into glitz-difference.tsx) */
"use client";

import { useRef } from "react";
import { Calendar, Users, Award, MapPin } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BRAND_STATS } from "@/brand/data/content";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const STAT_ICONS = [Calendar, Users, Award, MapPin];

export function HomeStats() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal<HTMLDivElement>();

  useGsapContext(ref, () => {
    ref.current?.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number((el as HTMLElement).dataset.end);
      const suffix = (el as HTMLElement).dataset.suffix ?? "";
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          (el as HTMLElement).textContent = `${Math.round(obj.v).toLocaleString("en-IN")}${suffix}`;
        },
      });
    });
  }, []);

  return (
    <BrandSection alt>
      <div ref={sectionRef}>
        <BrandHeader
          label="Our Legacy"
          title="Numbers That Define Excellence"
          subtitle="A decade of crafting extraordinary celebrations for India's most discerning hosts."
          center
        />
        <div ref={ref} className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {BRAND_STATS.map((s, i) => {
            const Icon = STAT_ICONS[i] ?? Award;
            return (
              <div key={s.label} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p
                  data-count
                  data-end={s.value}
                  data-suffix={s.suffix}
                  className="brand-display text-4xl font-bold text-[var(--glitz-gold)] sm:text-5xl lg:text-6xl"
                  aria-label={`${s.value}${s.suffix} ${s.label}`}
                >
                  0{s.suffix}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </BrandSection>
  );
}
