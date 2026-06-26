"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Palette, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";

type Feature = { icon: LucideIcon; title: string; description: string };

const FEATURES: Feature[] = [
  { icon: UserCheck, title: "Personalized Approach", description: "Every event is unique and designed around you." },
  { icon: Sparkles, title: "Flawless Execution", description: "Precision, coordination and perfection in every detail." },
  { icon: Palette, title: "Creative Excellence", description: "Innovative ideas that bring your vision to life." },
  { icon: ShieldCheck, title: "Trusted by Many", description: "A legacy of happy clients and successful events." },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HomeAboutLuxe() {
  return (
    <section id="about" className="lux-section" aria-labelledby="about-heading">
      <div className="brand-container lux-about">
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="lux-about__media"
        >
          <div className="lux-about__image">
            <BrandImage
              src={BRAND_IMAGES.weddings[0]}
              alt="A Nexyyra luxury celebration in full bloom"
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover"
            />
          </div>
          <div className="lux-about__badge" aria-hidden>
            <span className="lux-about__badge-value">100+</span>
            <span className="lux-about__badge-label">Events Delivered</span>
          </div>
        </motion.div>

        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="lux-about__body"
        >
          <span className="lux-label">About Us</span>
          <h2 id="about-heading" className="lux-heading">
            We Don&apos;t Just Plan Events, We Create{" "}
            <span className="lux-accent-purple">Memories.</span>
          </h2>
          <p className="lux-prose">
            At Nexyyra Events, we blend creativity, innovation and meticulous planning to craft
            exceptional experiences that leave a lasting impression.
          </p>

          <div className="lux-about__features">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="lux-about__feature">
                  <span className="lux-about__feature-icon" aria-hidden>
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="lux-about__feature-title">{f.title}</h3>
                    <p className="lux-about__feature-copy">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/about" className="luxury-button luxury-button--purple tap-target mt-9">
            Discover Our Story
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
