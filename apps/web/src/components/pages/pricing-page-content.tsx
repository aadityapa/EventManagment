"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Crown, Sparkles } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { IMAGES } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { faqs } from "@/data/cms";

const COLLECTIONS = [
  {
    icon: Gem,
    name: "The Boutique Experience",
    tagline: "Intimate gatherings, impeccable taste",
    investment: "₹10 Lakhs",
    description: "For celebrations of 50–150 guests where every detail whispers luxury — curated vendors, bespoke design, and dedicated day-of coordination.",
    includes: ["Private consultation", "Curated vendor network", "Custom design concept", "Day-of coordination", "Guest experience design"],
  },
  {
    icon: Crown,
    name: "The Signature Gala",
    tagline: "Where brands and celebrations converge",
    investment: "₹35 Lakhs",
    featured: true,
    description: "Our most sought-after investment tier — full planning for 150–500 guests with immersive design, vendor management, and premium production.",
    includes: ["Dedicated event director", "Full vendor management", "Immersive design & decor", "Technical production", "Rehearsal management", "VIP guest handling"],
  },
  {
    icon: Sparkles,
    name: "The Grand Masterpiece",
    tagline: "The pinnacle of event artistry",
    investment: "₹1 Crore+",
    description: "For destination weddings, corporate galas, and landmark celebrations of 500+ guests — unlimited creative scope with our senior leadership team.",
    includes: ["Executive creative director", "International coordination", "Celebrity vendor access", "Multi-day production", "24/7 concierge", "Post-event analytics"],
  },
];

export function PricingPageContent() {
  const pricingFaqs = faqs.filter((f) => ["Payment", "Booking", "General"].includes(f.category));

  return (
    <>
      <CinematicHero
        label="Investment"
        title="The Glitz Collection"
        subtitle="Luxury is not purchased in packages — it is invested in experiences."
        image={IMAGES.hero.wedding}
        size="full"
      />

      <PageSection>
        <SectionHeader
          title="Investment Collections"
          subtitle="Each collection represents a tier of creative commitment — not a fixed package. Your investment is tailored to your vision."
          align="center"
        />
        <div className="grid gap-8 lg:grid-cols-3">
          {COLLECTIONS.map((col, i) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`luxury-card flex flex-col p-8 ${col.featured ? "ring-1 ring-primary shadow-glow lg:-mt-4 lg:mb-4" : ""}`}
              >
                {col.featured && (
                  <span className="mb-4 inline-block self-start rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">Most Requested</span>
                )}
                <Icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="font-display text-2xl font-semibold">{col.name}</h3>
                <p className="mt-1 text-sm italic text-primary/80">{col.tagline}</p>
                <p className="mt-4 font-display text-3xl font-bold gradient-text">From {col.investment}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{col.description}</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {col.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant={col.featured ? "default" : "outline"} asChild>
                  <Link href="/book-event">Request Consultation</Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </PageSection>

      <PageSection dark={false} className="bg-card">
        <SectionHeader title="Frequently Asked Questions" align="center" />
        <div className="mx-auto max-w-2xl">
          <FaqAccordion items={pricingFaqs} />
        </div>
      </PageSection>
    </>
  );
}
