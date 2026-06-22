import { HeroStatic } from "@/brand/sections/home/hero-static";
import { getHeroCarouselSlides } from "@/lib/media/server";

/** LCP preload target — first live carousel slide. */
export async function heroLcpPosterUrl(): Promise<string> {
  const slides = await getHeroCarouselSlides(1);
  return slides[0] ?? "/images/placeholders/generic-coming-soon.webp";
}

export async function HomeHero() {
  const slides = await getHeroCarouselSlides(9);
  const poster = slides[0] ?? "/images/placeholders/generic-coming-soon.webp";

  return (
    <>
      <link rel="preload" as="image" href={poster} fetchPriority="high" />
      <HeroStatic slides={slides} />
    </>
  );
}
