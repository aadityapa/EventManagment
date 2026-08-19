import { HeroStatic } from "@/brand/sections/home/hero-static";
import { getHeroCarouselSlides } from "@/lib/media/server";

/** LCP preload target — first live carousel slide. */
export async function heroLcpPosterUrl(): Promise<string> {
  const slides = await getHeroCarouselSlides(1);
  return slides[0] ?? "/images/placeholders/generic-coming-soon.webp";
}

/**
 * Local static poster for slide 0 — the LCP image. Never served through the
 * Google Drive proxy: Drive-backed slides take 2s+ on a cold /_next/image
 * cache (every deploy/sync), which is what tanked mobile LCP. Drive slides
 * still rotate in from slide 2 onward.
 */
const HERO_LCP_POSTER = "/images/hero/hero-poster.webp";

export async function HomeHero() {
  const driveSlides = await getHeroCarouselSlides(8);
  const slides = [HERO_LCP_POSTER, ...driveSlides.filter((s) => s !== HERO_LCP_POSTER)];

  return <HeroStatic slides={slides} />;
}
