"use client";

import { useRef } from "react";
import { CalendarHeart, Layers, Sparkles } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_PROCESS_STEPS } from "@/brand/data/content";
import { ScrollReveal } from "@/lib/motion";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { cn } from "@/lib/utils";

const PROOF_COUNTERS = [
  { end: 1000, suffix: "+", label: "Events Delivered" },
  { end: 4.9, suffix: "★", label: "Client Rating", decimals: 1 },
  { end: 35, suffix: "+", label: "Cities Served" },
] as const;

const HIGHLIGHTS = [
  {
    icon: CalendarHeart,
    step: BRAND_PROCESS_STEPS[0],
    align: "left" as const,
  },
  {
    icon: Layers,
    step: BRAND_PROCESS_STEPS[2],
    align: "right" as const,
  },
  {
    icon: Sparkles,
    step: BRAND_PROCESS_STEPS[3],
    align: "left" as const,
  },
];

export function HomeGlitzDifference() {
  const countersRef = useRef<HTMLDivElement>(null);

  useGsapContext(countersRef, () => {
    countersRef.current?.querySelectorAll("[data-count]").forEach((el) => {
      const node = el as HTMLElement;
      const end = Number(node.dataset.end);
      const suffix = node.dataset.suffix ?? "";
      const decimals = Number(node.dataset.decimals ?? 0);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
        onUpdate: () => {
          const val = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v).toLocaleString("en-IN");
          node.textContent = `${val}${suffix}`;
        },
      });
    });
  }, []);

  return (
    <section id="why-glitz" className="v4-section v4-dune-glow relative bg-[var(--glitz-bg)]">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Why Nexyyra</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 className="v4-display max-w-3xl">
            The Nexyyra <span className="v4-gold-text">Difference</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade" delay={0.14}>
          <p className="v4-standfirst mt-5 max-w-2xl">
            From first conversation to standing ovation — a luxury timeline backed by a decade of
            flawless delivery.
          </p>
        </ScrollReveal>

        <div className="mt-16 space-y-0">
          {HIGHLIGHTS.map(({ icon: Icon, step, align }, i) => (
            <ScrollReveal key={step.step} preset={align === "right" ? "right" : "left"} delay={i * 0.06}>
              <div
                className={cn(
                  "grid items-center gap-8 border-b border-[var(--v4-glass-border)] py-12 lg:grid-cols-12 lg:gap-16",
                  align === "right" && "lg:[direction:rtl]"
                )}
              >
                <div className={cn("lg:col-span-2", align === "right" && "lg:[direction:ltr]")}>
                  <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-[var(--glitz-gold)]/30 sm:text-6xl">
                    {step.step}
                  </span>
                </div>
                <div className={cn("lg:col-span-10", align === "right" && "lg:[direction:ltr]")}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="v4-title">{step.title}</h3>
                  </div>
                  <p className="v4-body">{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div ref={countersRef} className="mt-16">
          <div className="v4-hairline mb-12" aria-hidden="true" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PROOF_COUNTERS.map((c) => (
              <GlassPanel key={c.label} className="px-8 py-10 text-center">
                <p
                  data-count
                  data-end={c.end}
                  data-suffix={c.suffix}
                  data-decimals={"decimals" in c ? c.decimals : 0}
                  className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--glitz-gold)] sm:text-5xl"
                  aria-label={`${c.end}${c.suffix} ${c.label}`}
                >
                  0{c.suffix}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  {c.label}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
