"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ArrowRight, Gem, Target, Eye } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { companyProfile, awards, partners } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { Button } from "@/components/ui/button";

const TIMELINE = [
  { year: "2012", title: "Founded in Pune", description: "Nexyyra Events begins as a boutique wedding studio with a single dream celebration." },
  { year: "2015", title: "Corporate Expansion", description: "First major corporate gala for 800 guests — establishing our reputation for precision." },
  { year: "2018", title: "Destination Weddings", description: "Launched destination wedding division across Udaipur, Goa, and Jaipur." },
  { year: "2021", title: "National Recognition", description: "Awarded Best Event Management Company at Event Industry Awards India." },
  { year: "2024", title: "Luxury Powerhouse", description: "1,800+ events delivered across 35 cities with celebrity and enterprise clients." },
];

const MEDIA = ["Event Industry Awards India", "Wedding Sutra", "MICE India", "Forbes India", "Economic Times"];

export function AboutPageContent() {
  return (
    <>
      <CinematicHero
        label="Our Story"
        title="Crafting Legends Since 2012"
        subtitle="India's premier luxury event house — where vision meets flawless execution."
        image={IMAGES.about}
        size="full"
      />

      <PageSection>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader
              label="Founder Philosophy"
              title="We Don't Plan Events. We Architect Experiences."
              subtitle={companyProfile.introduction}
            />
            <p className="mt-6 text-muted leading-relaxed">
              Every celebration we touch carries the weight of memory — a wedding that becomes family lore,
              a corporate gala that defines a brand year, a destination ceremony that stops time.
              That responsibility drives everything we do.
            </p>
            <Button className="mt-8" asChild>
              <Link href="/book-event">Book a Private Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <LuxuryImage src={IMAGES.palace} alt="Luxury event venue" fill sizes="(max-width:1024px) 100vw, 50vw" />
            <div className="absolute inset-0 border border-primary/20 rounded-2xl" />
          </div>
        </div>
      </PageSection>

      <PageSection dark={false} className="bg-card">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Eye, title: "Vision", content: companyProfile.vision },
            { icon: Target, title: "Mission", content: companyProfile.mission },
            { icon: Gem, title: "Philosophy", content: "Luxury is not excess — it is intention. Every detail, every moment, every guest experience is deliberately crafted." },
          ].map(({ icon: Icon, title, content }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="luxury-card p-8"
            >
              <Icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{content}</p>
            </motion.div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionHeader label="Our Journey" title="A Decade of Excellence" align="center" />
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:left-1/2" />
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-12 flex ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
            >
              <div className="ml-10 w-full max-w-md md:ml-0 md:w-[calc(50%-2rem)]">
                <span className="text-sm font-bold text-primary">{item.year}</span>
                <h3 className="mt-1 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
              <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2" />
            </motion.div>
          ))}
        </div>
      </PageSection>

      <PageSection dark={false} className="bg-card">
        <SectionHeader label="Recognition" title="Awards & Achievements" align="center" />
        <div className="grid gap-4 sm:grid-cols-2">
          {awards.map((award) => (
            <div key={award.title} className="luxury-card flex items-start gap-4 p-6">
              <Award className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{award.title}</h3>
                <p className="text-sm text-muted">{award.organization} · {award.year}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">Media Mentions</p>
          <div className="flex flex-wrap justify-center gap-4">
            {MEDIA.map((m) => (
              <span key={m} className="rounded-full border border-border/60 px-5 py-2 text-sm text-foreground/70">{m}</span>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeader label="Partners" title="Trusted by Industry Leaders" align="center" />
        <div className="flex flex-wrap justify-center gap-3">
          {partners.map((p) => (
            <span key={p} className="luxury-card px-6 py-3 text-sm font-medium text-foreground/80">{p}</span>
          ))}
        </div>
      </PageSection>
    </>
  );
}
