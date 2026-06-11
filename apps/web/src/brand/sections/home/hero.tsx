"use client";

import { BrandHero } from "@/brand/primitives/brand-hero";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { Play } from "lucide-react";

export function HomeHero() {
  return (
    <BrandHero
      label="Glitz Events & Promotions"
      title="Creating Extraordinary Experiences That Last Forever"
      subtitle="Luxury Weddings, Corporate Events, Destination Celebrations & Premium Experiences Across India."
      video={BRAND_IMAGES.hero.video}
      image={BRAND_IMAGES.hero.poster}
      full
      threeD
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <BrandButton href="/book-event">Book Consultation</BrandButton>
        <BrandButton href="/portfolio" variant="outline"><Play className="h-4 w-4" /> View Portfolio</BrandButton>
      </div>
    </BrandHero>
  );
}
