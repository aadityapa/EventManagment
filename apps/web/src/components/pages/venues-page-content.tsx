"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Filter } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { venues } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Goa", "Pune", "Jaipur", "Udaipur"];
const CAPACITY_FILTERS = ["All", "Under 500", "500–1000", "1000+"];

const EXTENDED_VENUES = [
  ...venues,
  { id: "5", name: "Royal Palace Gardens", slug: "royal-palace-jaipur", city: "Jaipur", capacity: 1200, pricePerDay: 1200000, rating: 4.9, images: [IMAGES.palace], amenities: ["Heritage", "Garden", "Bridal Suite"], description: "Majestic palace venue for royal weddings." },
  { id: "6", name: "Lake Palace Terrace", slug: "lake-palace-udaipur", city: "Udaipur", capacity: 600, pricePerDay: 1500000, rating: 5.0, images: [IMAGES.weddings[1]], amenities: ["Lake View", "Boat Access", "Sunset Deck"], description: "Iconic lakefront destination wedding venue." },
  { id: "7", name: "Pune Luxury Convention", slug: "pune-convention", city: "Pune", capacity: 2500, pricePerDay: 450000, rating: 4.7, images: [IMAGES.venues[2]], amenities: ["Multiple Halls", "Parking", "AV"], description: "Premier Pune venue for corporate and social events." },
];

export function VenuesPageContent() {
  const [city, setCity] = useState("All");
  const [capacity, setCapacity] = useState("All");

  const filtered = EXTENDED_VENUES.filter((v) => {
    if (city !== "All" && v.city !== city) return false;
    if (capacity === "Under 500" && v.capacity >= 500) return false;
    if (capacity === "500–1000" && (v.capacity < 500 || v.capacity > 1000)) return false;
    if (capacity === "1000+" && v.capacity <= 1000) return false;
    return true;
  });

  return (
    <>
      <CinematicHero
        label="Exclusive Venues"
        title="Luxury Venue Explorer"
        subtitle="Handpicked destinations across India's most coveted cities."
        image={IMAGES.venues[0]}
        size="full"
      />

      <PageSection>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Filter className="h-4 w-4 text-primary" /> Filter venues
          </div>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button key={c} type="button" onClick={() => setCity(c)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold transition-all", city === c ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted hover:border-primary/40")}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {CAPACITY_FILTERS.map((c) => (
            <button key={c} type="button" onClick={() => setCapacity(c)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold transition-all", capacity === c ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted")}>{c} guests</button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue, i) => (
            <motion.article
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="luxury-card group overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <LuxuryImage src={venue.images[0]} alt={venue.name} fill sizes="33vw" className="transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-black/60 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">{venue.city}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold group-hover:text-primary">{venue.name}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{venue.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> {venue.capacity.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {venue.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {venue.city}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-primary">From {formatCurrency(venue.pricePerDay)}/day</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {venue.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted">{a}</span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                  <Link href="/book-event">Request Availability</Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </PageSection>

      <PageSection dark={false} className="bg-card">
        <SectionHeader title="Find Us in Pune" subtitle="Our headquarters — serving events across India." align="center" />
        <div className="overflow-hidden rounded-2xl border border-border/40">
          <iframe
            title="Nexyyra Events location on Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015.69828320738!2d73.69814815!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="h-[400px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </PageSection>
    </>
  );
}
