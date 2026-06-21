"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { ScrollReveal, Parallax, staggerParent, staggerItem, viewportOnce } from "@/lib/motion";
import { analytics } from "@/lib/analytics";

const VENUES = [
  { city: "Pune", name: "Skyline Convention", capacity: 2500, price: "₹4.5L", rating: 4.8, image: BRAND_IMAGES.venues[0] },
  { city: "Mumbai", name: "The Grand Ballroom", capacity: 800, price: "₹5L", rating: 4.9, image: BRAND_IMAGES.venues[1] },
  { city: "Goa", name: "Beachfront Paradise", capacity: 500, price: "₹9L", rating: 4.9, image: BRAND_IMAGES.venues[2] },
  { city: "Jaipur", name: "Royal Palace Estate", capacity: 1200, price: "₹12L", rating: 4.9, image: BRAND_IMAGES.venues[3] },
  { city: "Udaipur", name: "Lake Palace Gardens", capacity: 600, price: "₹15L", rating: 5.0, image: BRAND_IMAGES.venues[4] },
];

export function HomeVenueCollection() {
  return (
    <section id="destinations" className="v4-section relative overflow-hidden bg-[var(--glitz-surface)]" aria-labelledby="destinations-heading">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Venues</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="destinations-heading" className="v4-display max-w-2xl">
            Venue <span className="v4-gold-text">Explorer</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade" delay={0.14}>
          <p className="v4-standfirst mt-5 max-w-xl">
            Curated palaces, ballrooms, and beachfront estates — exclusive access across India&apos;s
            most sought-after destinations.
          </p>
        </ScrollReveal>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VENUES.map((v) => (
            <motion.div key={v.city} variants={staggerItem} className="w-[72vw] shrink-0 sm:w-[280px]">
              <Link
                href="/venues"
                onClick={() => analytics.featureClick(v.city, "home_venue_strip")}
                className="group block"
              >
                <Parallax distance={30} className="relative aspect-[3/4] overflow-hidden rounded-[var(--v4-radius-lg)]">
                  <BrandImage
                    src={v.image}
                    alt={v.name}
                    fill
                    sizes="280px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-[var(--glitz-gold)]/40 bg-black/50 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)] backdrop-blur-sm">
                    {v.city}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-white group-hover:text-[var(--glitz-gold-light)]">
                      {v.name}
                    </h3>
                    <div className="mt-2 flex gap-4 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" aria-hidden="true" />
                        {v.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" aria-hidden="true" />
                        {v.rating}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[var(--glitz-gold-light)]">From {v.price}/day</p>
                  </div>
                </Parallax>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal preset="reveal" delay={0.1} className="mt-8">
          <Link
            href="/venues"
            onClick={() => analytics.ctaClick("explore_venues", "home_venue_collection")}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)] transition-colors hover:text-[var(--glitz-gold-light)]"
          >
            Enter the Destinations →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
