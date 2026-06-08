"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { portfolioItems } from "@/data/cms";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { StitchSection, StitchSectionItem } from "@/components/stitch";

export function PortfolioSection() {
  return (
    <StitchSection>
      <div className="container-page">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            className="mb-0"
            eyebrow="Our Work"
            title="Featured Portfolio"
            description="A glimpse into the extraordinary events we've brought to life across India."
          />
          <StitchSectionItem>
            <Button asChild variant="outline">
              <Link href="/portfolio">
                View Full Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </StitchSectionItem>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {portfolioItems.map((item, i) => {
            const heights = ["h-64", "h-80", "h-72", "h-96", "h-64", "h-80"];
            const height = heights[i % heights.length];

            return (
              <StitchSectionItem key={item.id} className="mb-4 break-inside-avoid">
                <Link
                  href={`/portfolio/${item.slug}`}
                  className={`group relative block overflow-hidden rounded-xl border border-primary/10 ${height} transition-all duration-500 hover:border-primary/30 hover:shadow-glow`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="font-display text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {item.location}
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 transition-opacity duration-500 group-hover:opacity-0">
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                </Link>
              </StitchSectionItem>
            );
          })}
        </div>
      </div>
    </StitchSection>
  );
}
