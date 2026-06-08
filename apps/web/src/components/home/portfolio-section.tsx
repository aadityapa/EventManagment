"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Users, MapPin } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { portfolioItems } from "@/data/cms";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Wedding", "Corporate", "Concert", "Luxury", "Destination"] as const;

const BUDGET_MAP: Record<string, string> = {
  CORPORATE: "₹50L – ₹2Cr",
  WEDDING: "₹80L – ₹3Cr",
  DESTINATION_WEDDING: "₹1.5Cr – ₹5Cr",
  CONCERT: "₹2Cr+",
  FASHION_SHOW: "₹40L – ₹1.5Cr",
  PRODUCT_LAUNCH: "₹30L – ₹1Cr",
};

function mapFilter(type: string): string {
  if (type === "WEDDING") return "Wedding";
  if (type === "CORPORATE") return "Corporate";
  if (type === "CONCERT") return "Concert";
  if (type === "DESTINATION_WEDDING") return "Destination";
  if (type === "FASHION_SHOW" || type === "PRODUCT_LAUNCH") return "Luxury";
  return "Luxury";
}

export function PortfolioSection() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const filtered =
    active === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => mapFilter(item.eventType) === active);

  return (
    <LuxurySection
      id="portfolio"
      label="Our Work"
      title="Portfolio of Excellence"
      subtitle="Every event tells a story. Explore our curated collection of extraordinary celebrations."
    >
      <div className="container-page">
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={cn(
                "touch-target rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                active === filter
                  ? "border-primary bg-primary/10 text-primary shadow-glow"
                  : "border-border/60 text-muted hover:border-primary/40 hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative mb-5 break-inside-avoid overflow-hidden rounded-xl luxury-card"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={i % 2 === 0 ? 480 : 360}
                    className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {mapFilter(item.eventType)}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {item.guestCount.toLocaleString()} guests
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-primary/90">
                      Budget: {BUDGET_MAP[item.eventType] ?? "On request"}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-accent"
          >
            View Full Portfolio <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </LuxurySection>
  );
}
