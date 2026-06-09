"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { EVENT_IMAGES } from "@/lib/images";
import { formatCurrency } from "@/lib/utils";

const VENUE_CITIES = [
  { city: "Pune", image: EVENT_IMAGES.venue3, capacity: 2000, price: 600000, rating: 4.8, name: "Skyline Convention Center" },
  { city: "Mumbai", image: EVENT_IMAGES.venue1, capacity: 800, price: 500000, rating: 4.9, name: "The Grand Ballroom" },
  { city: "Goa", image: EVENT_IMAGES.venue4, capacity: 500, price: 900000, rating: 4.9, name: "Beachfront Paradise" },
  { city: "Jaipur", image: EVENT_IMAGES.wedding, capacity: 1200, price: 1200000, rating: 4.9, name: "Royal Palace Estate" },
  { city: "Udaipur", image: EVENT_IMAGES.destinationWedding, capacity: 800, price: 1500000, rating: 5.0, name: "Lake Palace Gardens" },
];

export function VenueShowcaseSection() {
  return (
    <LuxurySection
      id="venues"
      label="Exclusive Venues"
      title="Premium Venue Explorer"
      subtitle="Handpicked destinations across India's most coveted cities."
      className="bg-secondary/30"
    >
      <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {VENUE_CITIES.map((venue, i) => (
          <motion.div
            key={venue.city}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href="/venues" className="group luxury-card block overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-black/50 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                  {venue.city}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold group-hover:text-primary">
                  {venue.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {venue.capacity.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {venue.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-primary">
                  From {formatCurrency(venue.price)}/day
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </LuxurySection>
  );
}
