"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { TiltCard } from "@/components/effects/tilt-card";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { analytics } from "@/lib/analytics";

type FeaturedItem = { title: string; category: string; image: string; href: string };

const FEATURED: FeaturedItem[] = [
  ...BRAND_CASE_STUDIES.map((cs) => ({
    title: cs.title,
    category: cs.category,
    image: cs.image,
    href: `/portfolio/${cs.id}`,
  })),
  { title: "Palace Mandap", category: "Wedding", image: BRAND_IMAGES.weddings[1] ?? BRAND_IMAGES.hero.palace, href: "/portfolio" },
  { title: "Grand Ballroom Gala", category: "Corporate", image: BRAND_IMAGES.corporate[1] ?? BRAND_IMAGES.corporate[0], href: "/portfolio" },
  { title: "Sunset Sangeet", category: "Destination", image: BRAND_IMAGES.destinations[1] ?? BRAND_IMAGES.destinations[0], href: "/portfolio" },
];

export function HomeFeaturedWork() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.8, 520) * dir;
    track.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  return (
    <section id="featured-work" className="lux-section" aria-labelledby="featured-heading">
      <div className="brand-container">
        <div className="lux-section__head lux-section__head--with-nav">
          <span className="lux-label" id="featured-heading">Our Featured Work</span>
          <div className="lux-gallery-nav">
            <button type="button" className="lux-arrow" aria-label="Previous projects" onClick={() => scrollByCards(-1)}>
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" className="lux-arrow" aria-label="Next projects" onClick={() => scrollByCards(1)}>
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div ref={trackRef} className="lux-gallery-track">
          {FEATURED.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.06 }}
              className="lux-gallery-card"
            >
              <TiltCard max={5}>
              <Link
                href={item.href}
                onClick={() => analytics.featureClick(item.title, "home_featured_work")}
                className="lux-gallery-card__link"
              >
                <BrandImage
                  src={item.image}
                  alt={`${item.title} — ${item.category}`}
                  fill
                  sizes="(max-width: 768px) 80vw, 360px"
                  className="lux-gallery-card__img object-cover"
                />
                <span className="lux-gallery-card__overlay" aria-hidden />
                <span className="lux-gallery-card__meta">
                  <span className="lux-gallery-card__cat">{item.category}</span>
                  <span className="lux-gallery-card__title">{item.title}</span>
                </span>
              </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
