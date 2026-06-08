"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { services } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { Button } from "@/components/ui/button";

const FEATURED = [
  { slug: "wedding-planning", image: IMAGES.weddings[0], tagline: "Where forever begins" },
  { slug: "corporate-events", image: IMAGES.corporate[0], tagline: "Elevate your brand" },
  { slug: "destination-weddings", image: IMAGES.weddings[1], tagline: "Say I do in paradise" },
  { slug: "concert-management", image: IMAGES.concerts[0], tagline: "Stadium to intimate" },
  { slug: "product-launches", image: IMAGES.corporate[0], tagline: "Launch with impact" },
  { slug: "brand-promotions", image: IMAGES.gallery[12], tagline: "Experiences that convert" },
  { slug: "celebrity-management", image: IMAGES.hero.drone, tagline: "VIP excellence" },
  { slug: "birthday-events", image: IMAGES.gallery[13], tagline: "Milestone magic" },
];

export function ServicesPageContent() {
  return (
    <>
      <CinematicHero
        label="Our Expertise"
        title="Luxury Event Services"
        subtitle="Immersive storytelling, flawless execution — eight pillars of extraordinary celebration."
        image={IMAGES.hero.wedding}
        size="full"
      />

      {FEATURED.map((item, i) => {
        const service = services.find((s) => s.slug === item.slug);
        if (!service) return null;
        const reversed = i % 2 === 1;
        return (
          <PageSection key={item.slug} dark={i % 2 === 1} className={i % 2 === 1 ? "bg-card" : ""}>
            <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${reversed ? "lg:[direction:rtl]" : ""}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative aspect-[16/10] overflow-hidden rounded-2xl ${reversed ? "lg:[direction:ltr]" : ""}`}
              >
                <LuxuryImage src={item.image} alt={service.title} fill sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-6 left-6 font-display text-sm italic text-primary">{item.tagline}</span>
              </motion.div>
              <div className={reversed ? "lg:[direction:ltr]" : ""}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <DynamicIcon name={service.icon} className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-semibold sm:text-4xl">{service.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">{service.description}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <ArrowRight className="h-3.5 w-3.5 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" variant="outline" asChild>
                  <Link href={`/services/${service.slug}`}>Explore {service.title} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </PageSection>
        );
      })}

      <PageSection className="border-t border-border/40">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader title="Begin Your Extraordinary Journey" subtitle="Every great event starts with a conversation." align="center" />
          <Button size="lg" className="shadow-glow" asChild>
            <Link href="/book-event">Book Consultation</Link>
          </Button>
        </div>
      </PageSection>
    </>
  );
}
