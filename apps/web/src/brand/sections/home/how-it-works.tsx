"use client";

import { ArrowRight, CalendarHeart, Layers, Sparkles } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandButton } from "@/brand/primitives/brand-button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { analytics } from "@/lib/analytics";

const STEPS = [
  {
    step: "01",
    icon: CalendarHeart,
    title: "Book a Consultation",
    text: "Share your vision, date, and guest count. Our specialists craft a bespoke proposal tailored to your celebration.",
  },
  {
    step: "02",
    icon: Layers,
    title: "We Design & Coordinate",
    text: "Venues, vendors, décor, entertainment — every detail managed by your dedicated Glitz team from concept to rehearsal.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Celebrate Flawlessly",
    text: "On the day, Glitz executes while you enjoy every moment. Post-event wrap-up and cherished memories delivered.",
  },
] as const;

export function HomeHowItWorks() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <BrandSection id="how-it-works">
      <div ref={ref}>
        <BrandHeader
          label="Your Journey"
          title="How It Works"
          subtitle="From first conversation to standing ovation — a seamless luxury experience designed around you."
          center
        />

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.step}
                className="brand-surface group flex flex-col p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--glitz-glow)]"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] transition-colors group-hover:bg-[var(--glitz-gold)]/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="brand-display text-sm font-bold tracking-widest text-[var(--glitz-gold)]">
                    {item.step}
                  </span>
                </div>
                <h3 className="brand-display text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 text-center">
          <p className="mx-auto mb-6 max-w-lg text-sm text-muted">
            Begin with a private consultation — no obligation, just clarity on how Glitz brings your celebration to life.
          </p>
          <BrandButton
            href="/book-event"
            onClick={() => analytics.ctaClick("book_consultation", "home_how_it_works")}
          >
            Book Your Consultation <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </BrandButton>
        </div>
      </div>
    </BrandSection>
  );
}
