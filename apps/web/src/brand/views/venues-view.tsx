"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Filter } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { venues } from "@/data/cms";
import { cn, formatCurrency, getApiUrl } from "@/lib/utils";

const CITIES = ["All", "Pune", "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Udaipur"];
const EXT = [...venues, { id: "e5", name: "Royal Palace Gardens", slug: "palace-jaipur", city: "Jaipur", capacity: 1200, pricePerDay: 1200000, rating: 4.9, images: [BRAND_IMAGES.hero.palace], amenities: ["Heritage", "Garden"], description: "Majestic palace for royal weddings." }, { id: "e6", name: "Lake Palace Terrace", slug: "lake-udaipur", city: "Udaipur", capacity: 600, pricePerDay: 1500000, rating: 5.0, images: [BRAND_IMAGES.destinations[1]], amenities: ["Lake View"], description: "Iconic lakefront venue." }, { id: "e7", name: "Pune Convention", slug: "pune-conv", city: "Pune", capacity: 2500, pricePerDay: 450000, rating: 4.7, images: [BRAND_IMAGES.venues[2]], amenities: ["AV", "Parking"], description: "Premier Pune venue." }];

export function VenuesView() {
  const [city, setCity] = useState("All");
  const [items, setItems] = useState(EXT);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(getApiUrl("/venues"), { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as unknown;
        if (!ignore && Array.isArray(data)) setItems(data as typeof EXT);
      } catch {
        // Keep fallback data
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = city === "All" ? items : items.filter((v) => v.city === city);

  return (
    <div className="brand-root">
      <BrandPageHero label="Venues" title="Luxury Venue Explorer" subtitle="Handpicked destinations across India." image={BRAND_IMAGES.venues[0]} />
      <BrandSection>
        <div className="mb-8 flex items-center gap-2 text-sm text-muted"><Filter className="h-4 w-4 text-[var(--glitz-gold)]" /> Filter by city</div>
        <div className="mb-8 flex flex-wrap gap-2">{CITIES.map((c) => <button key={c} type="button" onClick={() => setCity(c)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold", city === c ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted")}>{c}</button>)}</div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <motion.article key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="brand-surface group overflow-hidden">
              <div className="relative h-56 overflow-hidden"><BrandImage src={v.images[0]} alt={v.name} fill sizes="33vw" className="transition-transform duration-700 group-hover:scale-110" /><span className="absolute left-3 top-3 rounded-full border border-[var(--glitz-gold)]/30 bg-black/60 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">{v.city}</span></div>
              <div className="p-5">
                <h3 className="brand-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">{v.name}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{v.description}</p>
                <div className="mt-3 flex gap-3 text-xs text-muted"><span className="flex items-center gap-1"><Users className="h-3 w-3 text-[var(--glitz-gold)]" />{v.capacity}</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" />{v.rating}</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-[var(--glitz-gold)]" />{v.city}</span></div>
                <p className="mt-2 text-sm font-semibold text-[var(--glitz-gold)]">From {formatCurrency(v.pricePerDay)}/day</p>
                <Link href="/book-event" className="mt-4 block rounded-lg border border-[var(--glitz-gold)]/40 py-2.5 text-center text-sm font-semibold text-[var(--glitz-gold)] hover:bg-[var(--glitz-gold)]/10">Request Availability</Link>
              </div>
            </motion.article>
          ))}
        </div>
      </BrandSection>
      <BrandSection alt>
        <BrandHeader title="Find Us in Pune" center />
        <div className="overflow-hidden rounded-2xl border border-[var(--glitz-border)]"><iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015!2d73.698!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000" className="h-[400px] w-full" loading="lazy" /></div>
      </BrandSection>
    </div>
  );
}
