"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Filter, GitCompare, IndianRupee } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { venues } from "@/data/cms";
import { cn, formatCurrency, getApiUrl } from "@/lib/utils";

const CITIES = ["All", "Pune", "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Udaipur"];
const CAPACITY_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under 500", min: 0, max: 499 },
  { label: "500 – 1000", min: 500, max: 1000 },
  { label: "1000+", min: 1001, max: Infinity },
];
const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹5L", min: 0, max: 500000 },
  { label: "₹5L – 10L", min: 500000, max: 1000000 },
  { label: "₹10L+", min: 1000000, max: Infinity },
];

type VenueItem = (typeof venues)[number] & { images: string[] };

const EXT: VenueItem[] = [
  ...venues,
  {
    id: "e5",
    name: "Royal Palace Gardens",
    slug: "palace-jaipur",
    city: "Jaipur",
    capacity: 1200,
    pricePerDay: 1200000,
    rating: 4.9,
    images: [BRAND_IMAGES.hero.palace],
    amenities: ["Heritage", "Garden"],
    description: "Majestic palace for royal weddings.",
  },
  {
    id: "e6",
    name: "Lake Palace Terrace",
    slug: "lake-udaipur",
    city: "Udaipur",
    capacity: 600,
    pricePerDay: 1500000,
    rating: 5.0,
    images: [BRAND_IMAGES.destinations[1]],
    amenities: ["Lake View"],
    description: "Iconic lakefront venue.",
  },
  {
    id: "e7",
    name: "Pune Convention",
    slug: "pune-conv",
    city: "Pune",
    capacity: 2500,
    pricePerDay: 450000,
    rating: 4.7,
    images: [BRAND_IMAGES.venues[2]],
    amenities: ["AV", "Parking"],
    description: "Premier Pune venue.",
  },
];

export function VenuesView() {
  const [city, setCity] = useState("All");
  const [capacityIdx, setCapacityIdx] = useState(0);
  const [priceIdx, setPriceIdx] = useState(0);
  const [compare, setCompare] = useState<string[]>([]);
  const [items, setItems] = useState<VenueItem[]>(EXT);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(getApiUrl("/venues"), { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as unknown;
        if (!ignore && Array.isArray(data)) setItems(data as VenueItem[]);
      } catch {
        /* fallback */
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const cap = CAPACITY_RANGES[capacityIdx];
    const price = PRICE_RANGES[priceIdx];
    return items.filter((v) => {
      const cityOk = city === "All" || v.city === city;
      const capOk = v.capacity >= cap.min && v.capacity <= cap.max;
      const priceOk = v.pricePerDay >= price.min && v.pricePerDay <= price.max;
      return cityOk && capOk && priceOk;
    });
  }, [items, city, capacityIdx, priceIdx]);

  const toggleCompare = (id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparedVenues = items.filter((v) => compare.includes(v.id));

  return (
    <div className="brand-root">
      <BrandPageHero label="Venues" title="Luxury Venue Explorer" subtitle="Handpicked destinations across India — filter, compare, and inquire." image={BRAND_IMAGES.venues[0]} />

      <BrandSection>
        <div className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Filter className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
          Filter venues
        </div>

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">City</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={city === c}
                onClick={() => setCity(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold",
                  city === c ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
              <Users className="h-3.5 w-3.5" aria-hidden="true" /> Capacity
            </p>
            <div className="flex flex-wrap gap-2">
              {CAPACITY_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  type="button"
                  aria-pressed={capacityIdx === i}
                  onClick={() => setCapacityIdx(i)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    capacityIdx === i ? "border-[var(--glitz-gold)] text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
              <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" /> Price / day
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  type="button"
                  aria-pressed={priceIdx === i}
                  onClick={() => setPriceIdx(i)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    priceIdx === i ? "border-[var(--glitz-gold)] text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {comparedVenues.length > 0 && (
          <div className="mb-8 rounded-xl border border-[var(--glitz-gold)]/30 bg-[var(--glitz-gold)]/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <GitCompare className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
              Compare ({comparedVenues.length}/3)
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {comparedVenues.map((v) => (
                <div key={v.id} className="rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-card)] p-3 text-sm">
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-xs text-muted">{v.city} · {v.capacity} guests</p>
                  <p className="text-xs text-[var(--glitz-gold)]">{formatCurrency(v.pricePerDay)}/day</p>
                </div>
              ))}
            </div>
            <Link href="/book-event" className="mt-3 inline-block text-sm font-semibold text-[var(--glitz-gold)] hover:underline">
              Request availability for compared venues →
            </Link>
          </div>
        )}

        <p className="mb-6 text-xs text-muted">Availability subject to confirmation — inquire for your preferred dates.</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <motion.article
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="brand-surface group overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <BrandImage src={v.images[0]} alt={v.name} fill sizes="33vw" className="transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute left-3 top-3 rounded-full border border-[var(--glitz-gold)]/30 bg-black/60 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">
                  {v.city}
                </span>
              </div>
              <div className="p-5">
                <h3 className="brand-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">{v.name}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{v.description}</p>
                <div className="mt-3 flex gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-[var(--glitz-gold)]" aria-hidden="true" />
                    {v.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" aria-hidden="true" />
                    {v.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[var(--glitz-gold)]" aria-hidden="true" />
                    {v.city}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-[var(--glitz-gold)]">From {formatCurrency(v.pricePerDay)}/day</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href="/book-event"
                    className="flex-1 rounded-lg border border-[var(--glitz-gold)]/40 py-2.5 text-center text-sm font-semibold text-[var(--glitz-gold)] hover:bg-[var(--glitz-gold)]/10"
                  >
                    Request Availability
                  </Link>
                  <button
                    type="button"
                    aria-pressed={compare.includes(v.id)}
                    aria-label={`Compare ${v.name}`}
                    onClick={() => toggleCompare(v.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm",
                      compare.includes(v.id) ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
                    )}
                  >
                    <GitCompare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </BrandSection>

      <BrandSection alt>
        <BrandHeader title="Find Us in Pune" center />
        <div className="overflow-hidden rounded-2xl border border-[var(--glitz-border)]">
          <iframe
            title="Glitz Events Pune location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015!2d73.698!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
            className="h-[400px] w-full"
            loading="lazy"
          />
        </div>
      </BrandSection>
    </div>
  );
}
