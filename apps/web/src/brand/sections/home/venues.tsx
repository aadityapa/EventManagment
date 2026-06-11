"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";

const VENUES = [
  { city: "Pune", name: "Skyline Convention", capacity: 2500, price: "₹4.5L", rating: 4.8, image: BRAND_IMAGES.venues[0] },
  { city: "Mumbai", name: "The Grand Ballroom", capacity: 800, price: "₹5L", rating: 4.9, image: BRAND_IMAGES.venues[1] },
  { city: "Goa", name: "Beachfront Paradise", capacity: 500, price: "₹9L", rating: 4.9, image: BRAND_IMAGES.venues[2] },
  { city: "Jaipur", name: "Royal Palace Estate", capacity: 1200, price: "₹12L", rating: 4.9, image: BRAND_IMAGES.venues[3] },
  { city: "Udaipur", name: "Lake Palace Gardens", capacity: 600, price: "₹15L", rating: 5.0, image: BRAND_IMAGES.venues[4] },
];

export function HomeVenues() {
  return (
    <BrandSection alt>
      <BrandHeader label="Venues" title="Premium Venue Explorer" center />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {VENUES.map((v, i) => (
          <motion.div key={v.city} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <Link href="/venues" className="group brand-surface block overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <BrandImage src={v.image} alt={v.name} fill sizes="20vw" className="transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute left-3 top-3 rounded-full border border-[var(--glitz-gold)]/30 bg-black/60 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">{v.city}</span>
              </div>
              <div className="p-4">
                <h3 className="brand-display text-base font-semibold group-hover:text-[var(--glitz-gold)]">{v.name}</h3>
                <div className="mt-2 flex gap-3 text-xs text-[var(--glitz-muted)]">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{v.capacity}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" />{v.rating}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--glitz-gold)]">From {v.price}/day</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </BrandSection>
  );
}
