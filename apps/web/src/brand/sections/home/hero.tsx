import { HeroStatic, HERO_LCP_SRC } from "@/brand/sections/home/hero-static";

/** LCP preload target — local AVIF from optimize-images script. */
export function heroLcpPosterUrl(): string {
  return HERO_LCP_SRC;
}

export function HomeHero() {
  return (
    <>
      <link rel="preload" as="image" href={HERO_LCP_SRC} fetchPriority="high" type="image/avif" />
      <HeroStatic />
    </>
  );
}
