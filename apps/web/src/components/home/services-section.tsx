"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/cms";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StitchGlowCard, StitchSection, StitchSectionItem } from "@/components/stitch";

const featuredServices = services.slice(0, 6);

export function ServicesSection() {
  return (
    <StitchSection>
      <div className="container-page">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            className="mb-0"
            eyebrow="What We Do"
            title="Premium Event Services"
            description="End-to-end event management tailored to your vision, budget, and expectations."
          />
          <StitchSectionItem>
            <Button asChild variant="outline" className="magnetic-hover shrink-0">
              <Link href="/services">
                View All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </StitchSectionItem>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <StitchSectionItem key={service.slug}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <StitchGlowCard className="h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-semibold text-white">{service.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="line-clamp-2 text-sm text-muted">{service.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </StitchGlowCard>
              </Link>
            </StitchSectionItem>
          ))}
        </div>
      </div>
    </StitchSection>
  );
}
