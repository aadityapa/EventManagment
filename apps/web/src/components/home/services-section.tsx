"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { EVENT_IMAGES } from "@/lib/images";

const LUXURY_SERVICES = [
  { slug: "wedding-planning", title: "Luxury Weddings", description: "Bespoke ceremonies crafted with timeless elegance and flawless execution.", icon: "Heart", image: EVENT_IMAGES.wedding },
  { slug: "corporate-events", title: "Corporate Events", description: "Elevate your brand with impeccably planned galas, conferences, and celebrations.", icon: "Building2", image: EVENT_IMAGES.corporate },
  { slug: "destination-weddings", title: "Destination Weddings", description: "Say 'I do' in paradise — from Udaipur palaces to Goa beaches.", icon: "Plane", image: EVENT_IMAGES.destinationWedding },
  { slug: "celebrity-management", title: "Celebrity Management", description: "Exclusive celebrity appearances and VIP event experiences.", icon: "Star", image: EVENT_IMAGES.celebrity },
  { slug: "product-launches", title: "Product Launches", description: "Immersive launch experiences that generate buzz and drive engagement.", icon: "Rocket", image: EVENT_IMAGES.productLaunch },
  { slug: "brand-promotions", title: "Brand Activations", description: "Experiential marketing that captivates audiences and builds loyalty.", icon: "Megaphone", image: EVENT_IMAGES.brandPromotion },
  { slug: "concert-management", title: "Concerts & Festivals", description: "End-to-end production from intimate gigs to stadium-scale shows.", icon: "Music", image: EVENT_IMAGES.concert },
  { slug: "birthday-events", title: "Private Celebrations", description: "Milestone moments designed with sophistication and personal touch.", icon: "Cake", image: EVENT_IMAGES.birthday },
];

export function ServicesSection() {
  return (
    <LuxurySection
      id="services"
      label="Our Expertise"
      title="Curated Luxury Services"
      subtitle="Eight pillars of excellence — each delivered with the precision and artistry of a world-class event house."
    >
      <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LUXURY_SERVICES.map((service, i) => (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link
              href={`/services/${service.slug}`}
              className="group luxury-card relative flex h-full flex-col overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-black/40 text-primary backdrop-blur-sm">
                  <DynamicIcon name={service.icon} className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </LuxurySection>
  );
}
