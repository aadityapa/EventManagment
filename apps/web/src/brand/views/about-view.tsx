"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, ArrowRight, Eye, Target, Gem, Play } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_TIMELINE, BRAND_AWARDS, BRAND_MEDIA } from "@/brand/data/content";
import { companyProfile, teamMembers } from "@/data/cms";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

export function AboutView() {
  const timelineRef = useRef<HTMLOListElement>(null);

  useGsapContext(timelineRef, () => {
    const items = timelineRef.current?.querySelectorAll("[data-milestone]");
    if (!items?.length) return;

    gsap.from(items, {
      x: -40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 78%",
        once: true,
      },
    });

    items.forEach((item) => {
      gsap.to(item.querySelector("[data-year-marker]"), {
        scale: 1.08,
        duration: 0.4,
        scrollTrigger: {
          trigger: item,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <div className="brand-root">
      <BrandPageHero
        label="Our Story"
        title="Crafting Legends Since 2012"
        subtitle="India's premier luxury event house — architecting experiences, not events."
        image={BRAND_IMAGES.about}
      />

      <BrandSection>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <BrandHeader
              label="Founder Philosophy"
              title="We Architect Experiences, Not Events"
              subtitle={companyProfile.introduction}
            />
            <p className="mt-4 text-muted leading-relaxed">
              Founded by Priya Sharma in Pune in 2012, Glitz began as an intimate wedding studio with a singular belief: every celebration carries the weight of memory. What started with one family&apos;s dream wedding in Koregaon Park has grown into a luxury event house trusted by 1,400+ clients across 35 cities — yet the founding principle remains unchanged.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Priya&apos;s background in hospitality and visual arts shaped Glitz&apos;s signature approach — meticulous vendor curation, ivory-and-gold design language, and the conviction that flawless logistics should feel invisible to guests. Today, our 50-person team carries that philosophy into palace weddings in Udaipur, black-tie galas for Fortune 500 brands, and stadium concerts across Maharashtra.
            </p>
            <p className="mt-4 text-muted leading-relaxed">{companyProfile.story}</p>
            <BrandButton href="/book-event" className="mt-6">
              Book Consultation <ArrowRight className="h-4 w-4" />
            </BrandButton>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <BrandImage src={BRAND_IMAGES.hero.palace} alt="Luxury venue" fill sizes="50vw" />
          </div>
        </div>
      </BrandSection>

      <BrandSection alt>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Eye, t: "Vision", c: companyProfile.vision },
            { icon: Target, t: "Mission", c: companyProfile.mission },
            { icon: Gem, t: "Philosophy", c: "Luxury is intention — every detail deliberately crafted." },
          ].map(({ icon: Icon, t, c }) => (
            <motion.div key={t} whileHover={{ y: -4 }} className="brand-surface p-8">
              <Icon className="mb-4 h-8 w-8 text-[var(--glitz-gold)]" aria-hidden="true" />
              <h3 className="brand-display text-xl font-semibold">{t}</h3>
              <p className="mt-3 text-sm text-muted">{c}</p>
            </motion.div>
          ))}
        </div>
      </BrandSection>

      <BrandSection>
        <BrandHeader label="Journey" title="Company Timeline" subtitle="Milestones that shaped India's premier luxury event house." center />
        <ol ref={timelineRef} className="relative mx-auto max-w-3xl space-y-10 border-l-2 border-[var(--glitz-gold)]/30 pl-8">
          {BRAND_TIMELINE.map((item) => (
            <li key={item.year} data-milestone className="relative">
              <span
                data-year-marker
                className="absolute -left-[2.05rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--glitz-gold)] bg-[var(--glitz-bg)] text-xs font-bold text-[var(--glitz-gold)]"
                aria-hidden="true"
              >
                {item.year.slice(2)}
              </span>
              <time dateTime={item.year} className="brand-display text-xl font-bold text-[var(--glitz-gold)]">
                {item.year}
              </time>
              <p className="mt-2 text-muted leading-relaxed">{item.event}</p>
            </li>
          ))}
        </ol>
      </BrandSection>

      <BrandSection alt>
        <BrandHeader label="Behind the Scenes" title="Our Story in Motion" subtitle="A glimpse into the artistry behind every Glitz celebration." center />
        <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl border border-[var(--glitz-border)] bg-[var(--glitz-surface)]">
          <BrandImage src={BRAND_IMAGES.hero.corporate} alt="Glitz Events showcase" fill sizes="80vw" className="opacity-80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/20">
              <Play className="h-7 w-7 text-[var(--glitz-gold)]" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--adaptive-text,#fff)]">Brand Film — Coming Soon</p>
            <p className="mt-1 text-xs text-[var(--adaptive-muted,#ccc)]">Embed-ready video section for YouTube/Vimeo</p>
          </div>
        </div>
      </BrandSection>

      <BrandSection>
        <BrandHeader label="Leadership" title="Meet Our Team" center />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.slice(0, 3).map((member) => (
            <div key={member.id} className="brand-surface p-6 text-center">
              <BrandImage
                src={member.image}
                alt={member.name}
                width={96}
                height={96}
                className="mx-auto h-24 w-24 rounded-full border-2 border-[var(--glitz-gold)]/40"
              />
              <h3 className="mt-4 font-semibold">{member.name}</h3>
              <p className="text-sm text-[var(--glitz-gold)]">{member.role}</p>
              <p className="mt-2 text-xs text-muted">{member.bio}</p>
            </div>
          ))}
        </div>
      </BrandSection>

      <BrandSection alt>
        <BrandHeader label="Recognition" title="Awards & Achievements" center />
        <div className="grid gap-4 sm:grid-cols-2">
          {BRAND_AWARDS.map((a) => (
            <div key={a.title} className="brand-surface flex gap-4 p-6">
              <Award className="h-8 w-8 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-muted">
                  {a.org} · {a.year}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {BRAND_MEDIA.map((m) => (
            <span key={m} className="rounded-full border border-[var(--glitz-border)] px-5 py-2 text-sm text-muted">
              {m}
            </span>
          ))}
        </div>
      </BrandSection>
    </div>
  );
}
