"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, PenTool, Palette, Rocket, PartyPopper } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

const STEPS = [
  { icon: MessageCircle, title: "Consultation", description: "We listen to your vision, understand your dreams, and craft the perfect blueprint." },
  { icon: PenTool, title: "Planning", description: "Detailed timelines, vendor selection, and budget optimization with transparent communication." },
  { icon: Palette, title: "Design", description: "Bespoke concepts, mood boards, and creative direction that bring your story to life." },
  { icon: Rocket, title: "Execution", description: "Flawless on-ground delivery with our expert team managing every detail." },
  { icon: PartyPopper, title: "Celebration", description: "Your moment arrives — extraordinary, seamless, and absolutely unforgettable." },
];

export function EventJourneySection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    timelineRef,
    () => {
      const items = timelineRef.current?.querySelectorAll("[data-step]");
      items?.forEach((item, i) => {
        gsap.from(item, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    []
  );

  return (
    <LuxurySection
      label="Your Journey"
      title="The Nexyyra Experience"
      subtitle="Five meticulously crafted stages from vision to celebration."
    >
      <div ref={timelineRef} className="container-page relative">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/40 to-transparent lg:block" />

        <div className="space-y-12 lg:space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            return (
              <div
                key={step.title}
                data-step
                className={`relative lg:flex lg:min-h-[140px] lg:items-center ${isLeft ? "lg:justify-start" : "lg:justify-end"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`luxury-card w-full max-w-md p-6 lg:absolute lg:w-[calc(50%-2rem)] ${isLeft ? "lg:left-0 lg:pr-8" : "lg:right-0 lg:pl-8"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Step {i + 1}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background lg:block" />
              </div>
            );
          })}
        </div>
      </div>
    </LuxurySection>
  );
}
