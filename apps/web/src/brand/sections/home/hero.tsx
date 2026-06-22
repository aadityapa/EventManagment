import { HeroStatic } from "@/brand/sections/home/hero-static";
import { heroCarouselFirstSlide } from "@/components/home/hero-carousel-data";

/** LCP preload target — first carousel slide. */
export function heroLcpPosterUrl(): string {
  return heroCarouselFirstSlide();
}

export function HomeHero() {
  const poster = heroLcpPosterUrl();
  return (
    <>
      <link rel="preload" as="image" href={poster} fetchPriority="high" />
      <HeroStatic />
    </>
  );
}
