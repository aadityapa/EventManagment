"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { portfolioItems } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Wedding", "Corporate", "Luxury", "Destination", "Concert"] as const;

const CASE_STUDIES: Record<string, { challenge: string; solution: string; result: string; budget: string }> = {
  "1": { challenge: "25th anniversary gala requiring black-tie precision for 1,500 C-suite executives.", solution: "Custom stage design, holographic brand timeline, and 200-person service team.", result: "Zero delays, 98% guest satisfaction, featured in 12 media outlets.", budget: "₹1.2 – 2 Cr" },
  "2": { challenge: "5-day heritage palace wedding across 800 guests from 4 countries.", solution: "Dedicated cultural liaison, multi-venue coordination, and royal procession choreography.", result: "Featured in Vogue India, 3 destination bookings generated.", budget: "₹2.5 – 4 Cr" },
  "3": { challenge: "Intimate 200-guest beach wedding at golden hour with weather contingency.", solution: "Dual indoor backup, custom mandap on sand, live streaming for 2,000 virtual guests.", result: "Perfect sunset ceremony, viral social media reach of 8M impressions.", budget: "₹40 – 80 L" },
  "4": { challenge: "3-day music festival with 50 artists and 10,000 attendees.", solution: "Multi-stage production, artist hospitality village, and real-time crowd management.", result: "Sold-out event, zero safety incidents, renewed for 2026.", budget: "₹3 Cr+" },
  "5": { challenge: "Fashion Week finale requiring runway precision and 500 VIP guests.", solution: "Backstage command center, model choreography, and press-ready staging.", result: "Front-page coverage, 4 designer collaborations secured.", budget: "₹60 L – 1.2 Cr" },
  "6": { challenge: "Immersive product launch with holographic displays for tech brand.", solution: "360° experiential zone, influencer seeding, and live global broadcast.", result: "50M+ social impressions, 300% pre-order increase.", budget: "₹50 L – 1 Cr" },
};

function mapFilter(type: string): string {
  if (type === "WEDDING") return "Wedding";
  if (type === "CORPORATE") return "Corporate";
  if (type === "CONCERT") return "Concert";
  if (type === "DESTINATION_WEDDING") return "Destination";
  return "Luxury";
}

export function PortfolioPageContent() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = active === "All" ? portfolioItems : portfolioItems.filter((i) => mapFilter(i.eventType) === active);

  return (
    <>
      <CinematicHero
        label="Our Work"
        title="Portfolio of Excellence"
        subtitle="Every event tells a story worth remembering."
        image={IMAGES.hero.corporate}
        size="full"
      />

      <PageSection>
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={cn(
                "touch-target rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                active === f ? "border-primary bg-primary/10 text-primary shadow-glow" : "border-border/60 text-muted hover:border-primary/40"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const cs = CASE_STUDIES[item.id];
              const isOpen = expanded === item.id;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="luxury-card overflow-hidden"
                >
                  <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                    <div className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                      <LuxuryImage src={item.image} alt={item.title} fill sizes="50vw" />
                    </div>
                    <div className={`flex flex-col justify-center p-8 lg:p-12 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{mapFilter(item.eventType)}</span>
                      <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{item.title}</h2>
                      <p className="mt-3 text-muted">{item.description}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {item.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> {item.guestCount.toLocaleString()} guests</span>
                        {cs && <span className="text-primary font-medium">Investment: {cs.budget}</span>}
                      </div>
                      {cs && (
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : item.id)}
                          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          {isOpen ? "Hide Case Study" : "View Case Study"} <ArrowUpRight className="h-4 w-4" />
                        </button>
                      )}
                      {isOpen && cs && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3 border-t border-border/40 pt-4 text-sm">
                          <p><strong className="text-foreground">Challenge:</strong> <span className="text-muted">{cs.challenge}</span></p>
                          <p><strong className="text-foreground">Solution:</strong> <span className="text-muted">{cs.solution}</span></p>
                          <p><strong className="text-foreground">Result:</strong> <span className="text-muted">{cs.result}</span></p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </PageSection>
    </>
  );
}
