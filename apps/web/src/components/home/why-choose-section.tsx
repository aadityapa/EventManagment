"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { EVENT_IMAGES } from "@/lib/images";

const REASONS = [
  {
    title: "End-to-End Planning",
    description: "From first consultation to final applause — every detail managed by dedicated experts.",
    image: EVENT_IMAGES.corporate,
    points: ["Dedicated event director", "Timeline management", "Vendor coordination"],
  },
  {
    title: "Exclusive Venues",
    description: "Access to India's most prestigious venues — palaces, resorts, and private estates.",
    image: EVENT_IMAGES.venue1,
    points: ["Heritage palaces", "Beachfront resorts", "Luxury ballrooms"],
  },
  {
    title: "Celebrity Network",
    description: "Curated celebrity appearances and VIP experiences for unforgettable moments.",
    image: EVENT_IMAGES.celebrity,
    points: ["Celebrity booking", "Red carpet events", "Media coordination"],
  },
  {
    title: "Premium Vendors",
    description: "Handpicked artisans, caterers, and creatives who share our standard of excellence.",
    image: EVENT_IMAGES.wedding,
    points: ["Verified partners", "Quality assurance", "Competitive pricing"],
  },
  {
    title: "Dedicated Coordinators",
    description: "Your personal event team available 24/7 throughout the planning journey.",
    image: EVENT_IMAGES.conference,
    points: ["Single point of contact", "Real-time updates", "Client dashboard"],
  },
  {
    title: "Luxury Execution",
    description: "Flawless on-ground delivery with military precision and artistic finesse.",
    image: EVENT_IMAGES.fashionShow,
    points: ["Day-of coordination", "Technical production", "Guest experience"],
  },
];

export function WhyChooseSection() {
  return (
    <LuxurySection
      label="The Glitz Difference"
      title="Why Choose Glitz"
      subtitle="We don't just plan events — we architect experiences that become legends."
      className="bg-secondary/30"
    >
      <div className="container-page space-y-20">
        {REASONS.map((reason, i) => {
          const reversed = i % 2 === 1;
          return (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${reversed ? "lg:[direction:rtl]" : ""}`}
            >
              <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${reversed ? "lg:[direction:ltr]" : ""}`}>
                <Image
                  src={reason.image}
                  alt={reason.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 border border-primary/20 rounded-2xl" />
              </div>
              <div className={reversed ? "lg:[direction:ltr]" : ""}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                  {reason.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {reason.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {reason.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </LuxurySection>
  );
}
