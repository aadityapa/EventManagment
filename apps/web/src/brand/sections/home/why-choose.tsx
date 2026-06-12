"use client";

import { useRef } from "react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

const TIMELINE = [
  { step: "01", title: "Discovery", text: "Private consultation to understand your vision, culture, and guest experience goals." },
  { step: "02", title: "Design", text: "Moodboards, venue scouting, and creative direction tailored to your brand or celebration." },
  { step: "03", title: "Production", text: "Vendor curation, logistics, technical production, and timeline orchestration." },
  { step: "04", title: "Execution", text: "On-ground command center with dedicated coordinators for flawless delivery." },
  { step: "05", title: "Legacy", text: "Post-event wrap, media assets, and relationship that extends beyond the final applause." },
];

export function HomeWhyChoose() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapContext(ref, () => {
    gsap.from("[data-timeline-item]", {
      x: -40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
    });
  }, []);

  return (
    <BrandSection alt>
      <BrandHeader
        label="The Glitz Difference"
        title="Why Choose Glitz"
        subtitle="A luxury timeline — from first conversation to unforgettable finale."
        center
      />
      <div ref={ref} className="relative mx-auto mt-12 max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-[var(--glitz-gold)]/50 to-transparent sm:left-6" />
        <div className="space-y-10">
          {TIMELINE.map((item) => (
            <div key={item.step} data-timeline-item className="relative pl-12 sm:pl-16">
              <span className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--glitz-gold)] bg-[var(--glitz-surface)] text-[9px] font-bold text-[var(--glitz-gold)] sm:left-4">
                {item.step}
              </span>
              <h3 className="brand-display text-xl font-semibold text-[var(--glitz-text)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--glitz-muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </BrandSection>
  );
}
