"use client";

import { MessageCircle } from "lucide-react";
import { BrandHero } from "@/brand/primitives/brand-hero";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { HeroImageOrbit } from "@/components/home/hero-image-orbit";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ScrollIndicator } from "@/components/effects/scroll-indicator";
import { GoldParticles } from "@/components/effects/gold-particles";
import { CircularMotionBackground } from "@/components/effects/circular-motion-background";
import { SITE_CONFIG } from "@/lib/constants";

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Glitz Events, I'd like to discuss an event.")}`;

export function HomeHero() {
  return (
    <BrandHero
      label="Glitz Events & Promotions"
      title="Creating Extraordinary Experiences"
      subtitle="Luxury weddings, corporate galas, destination celebrations, and premium experiences across India."
      image={BRAND_IMAGES.hero.poster}
      full
      backgroundLayers={
        <>
          <CircularMotionBackground className="opacity-95" />
          <GoldParticles className="opacity-45" />
        </>
      }
      decoration={<HeroImageOrbit />}
      scrollIndicator={<ScrollIndicator />}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <MagneticButton>
          <BrandButton href="/book-event">Book Your Event</BrandButton>
        </MagneticButton>
        <MagneticButton>
          <BrandButton href="/book-event" variant="outline">
            Get Free Consultation
          </BrandButton>
        </MagneticButton>
        <MagneticButton>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 rounded-lg border border-[var(--glitz-gold)]/40 bg-[#25D366]/10 px-8 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Now
          </a>
        </MagneticButton>
      </div>
    </BrandHero>
  );
}
