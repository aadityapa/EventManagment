"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Filter, GitCompare, IndianRupee, ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { venues } from "@/data/cms";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
import { VenueMapCanvas } from "@/components/three/venue-map-canvas";
import { GeoFactsBlock } from "@/components/seo/geo-facts-block";
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

const SPOTLIGHT_CITIES = ["Jaipur", "Udaipur", "Goa", "Mumbai"] as const;

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

function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-semibold transition-all",
        active
          ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
          : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40",
        className
      )}
    >
      {children}
    </button>
  );
}

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

  const spotlights = useMemo(() => {
    return SPOTLIGHT_CITIES.map((c) => items.find((v) => v.city === c)).filter(Boolean) as VenueItem[];
  }, [items]);

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
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.venues[0]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Destinations</span>
            <h1 className="v4-display text-white">
              Luxury <span className="v4-gold-text">Venues</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Handpicked palaces, estates, and convention halls across India — filter, compare, and
              inquire with our concierge team.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Destination spotlights */}
      <section className="v4-section border-b border-[var(--glitz-border)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Editorial Picks</span>
            <h2 className="v4-title">Destination Spotlights</h2>
            <p className="v4-body mt-3 max-w-2xl text-muted">
              Iconic settings for destination weddings and corporate retreats — curated by our venue
              specialists.
            </p>
          </ScrollReveal>
          <motion.div
            className="mt-10 grid gap-6 lg:grid-cols-4"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {spotlights.map((v) => (
              <motion.div key={v.id} variants={staggerItem}>
                <GlassPanel
                  as="article"
                  className="group overflow-hidden p-0 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <BrandImage
                      src={v.images[0]}
                      alt={v.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">
                      {v.city}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-semibold">{v.name}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {v.capacity} guests · From {formatCurrency(v.pricePerDay)}/day
                    </p>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive destination map */}
      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ScrollReveal preset="reveal">
              <span className="v4-kicker mb-4">Explore</span>
              <h2 className="v4-display">Destination <span className="v4-gold-text">Map</span></h2>
            </ScrollReveal>
            <ScrollReveal preset="fade" delay={0.1} className="mt-8">
              <VenueMapCanvas
                activeCity={city === "All" ? undefined : city}
                onSelect={(c) => setCity(c)}
              />
            </ScrollReveal>
          </div>
          <ScrollReveal preset="fade" delay={0.14} className="lg:col-span-4">
            <GeoFactsBlock
              facts={[
                { label: "Cities", value: "35+ across India" },
                { label: "Capacity range", value: "50 – 2,500 guests" },
                { label: "360° tours", value: "Available on request" },
                { label: "Concierge", value: "+91 9730594753" },
              ]}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Filters — sticky bar */}
      <section className="sticky top-[var(--header-height,3.75rem)] z-30 border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)]/95 backdrop-blur-xl">
        <div className="brand-container py-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted">
            <Filter className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
            Refine your search
          </div>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <FilterChip key={c} active={city === c} onClick={() => setCity(c)}>
                {c}
              </FilterChip>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
                <Users className="h-3.5 w-3.5" aria-hidden="true" /> Capacity
              </span>
              {CAPACITY_RANGES.map((r, i) => (
                <FilterChip key={r.label} active={capacityIdx === i} onClick={() => setCapacityIdx(i)}>
                  {r.label}
                </FilterChip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
                <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" /> Price / day
              </span>
              {PRICE_RANGES.map((r, i) => (
                <FilterChip key={r.label} active={priceIdx === i} onClick={() => setPriceIdx(i)}>
                  {r.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compare tray */}
      {comparedVenues.length > 0 && (
        <section className="border-b border-[var(--glitz-border)] bg-[var(--glitz-gold)]/5">
          <div className="brand-container py-6">
            <GlassPanel className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <GitCompare className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                Compare ({comparedVenues.length}/3)
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {comparedVenues.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-[var(--v4-radius)] border border-[var(--glitz-border)] bg-[var(--glitz-card)]/60 p-3 text-sm"
                  >
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-muted">
                      {v.city} · {v.capacity} guests
                    </p>
                    <p className="text-xs text-[var(--glitz-gold)]">
                      {formatCurrency(v.pricePerDay)}/day
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/book-event"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--glitz-gold)] hover:underline"
              >
                Request availability for compared venues
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </GlassPanel>
          </div>
        </section>
      )}

      {/* Venue grid */}
      <section className="v4-section">
        <div className="brand-container">
          <p className="mb-8 text-xs text-muted">
            {filtered.length} venue{filtered.length !== 1 ? "s" : ""} · Availability subject to
            confirmation
          </p>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {filtered.map((v) => (
              <motion.article
                key={v.id}
                variants={staggerItem}
                className="group"
              >
                <GlassPanel className="overflow-hidden p-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--v4-glow-gold)]">
                  <div className="relative h-56 overflow-hidden">
                    <BrandImage
                      src={v.images[0]}
                      alt={v.name}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-[var(--glitz-gold)]/30 bg-black/60 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)] backdrop-blur-sm">
                      {v.city}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="v4-title text-lg group-hover:text-[var(--glitz-gold)]">
                      {v.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted line-clamp-2">{v.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-[var(--glitz-gold)]" aria-hidden="true" />
                        {v.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star
                          className="h-3 w-3 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]"
                          aria-hidden="true"
                        />
                        {v.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[var(--glitz-gold)]" aria-hidden="true" />
                        {v.city}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--glitz-gold)]">
                      From {formatCurrency(v.pricePerDay)}/day
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href="/book-event"
                        className="flex-1 rounded-[var(--v4-radius-sm)] border border-[var(--glitz-gold)]/40 py-2.5 text-center text-sm font-semibold text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
                      >
                        Request Availability
                      </Link>
                      <button
                        type="button"
                        aria-pressed={compare.includes(v.id)}
                        aria-label={`Compare ${v.name}`}
                        onClick={() => toggleCompare(v.id)}
                        className={cn(
                          "rounded-[var(--v4-radius-sm)] border px-3 py-2.5 text-sm transition-colors",
                          compare.includes(v.id)
                            ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]"
                            : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                        )}
                      >
                        <GitCompare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map — embed-ready */}
      <section className="v4-section-lg v4-dune-glow border-t border-[var(--glitz-border)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Find Us</span>
            <h2 className="v4-title">Pune Headquarters</h2>
            <p className="v4-body mt-3 max-w-xl text-muted">
              Visit our studio for private venue consultations — or inquire remotely for destinations
              nationwide.
            </p>
          </ScrollReveal>
          <ScrollReveal preset="fade" delay={0.15} className="mt-10">
            <GlassPanel className="overflow-hidden p-0">
              <iframe
                title="Nexyyra Events Pune location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015!2d73.698!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
                className="h-[420px] w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </GlassPanel>
          </ScrollReveal>
          <div className="mt-8 text-center">
            <MagneticButton>
              <BrandButton href="/book-event" variant="gold">
                Schedule Venue Consultation
              </BrandButton>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
