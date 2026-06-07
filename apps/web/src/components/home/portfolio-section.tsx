"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { portfolioItems } from "@/data/cms";
import { Button } from "@/components/ui/button";

export function PortfolioSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Our Work
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Featured Portfolio
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              A glimpse into the extraordinary events we&apos;ve brought to life
              across the globe.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/portfolio">
              View Full Portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {portfolioItems.map((item, i) => {
            const heights = ["h-64", "h-80", "h-72", "h-96", "h-64", "h-80"];
            const height = heights[i % heights.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="mb-4 break-inside-avoid"
              >
                <Link
                  href={`/portfolio/${item.slug}`}
                  className={`group relative block overflow-hidden rounded-xl ${height}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="font-display text-lg font-semibold text-white sm:text-xl">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {item.location}
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 transition-opacity duration-500 group-hover:opacity-0">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
