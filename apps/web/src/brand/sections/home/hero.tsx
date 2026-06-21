import { GENERATED_HERO_SLIDES } from "@/brand/data/brand-images.generated";
import { HeroV4 } from "@/components/home/hero-v4";

/** Smaller width for LCP preload — full res still loaded via next/image srcset. */
export function heroLcpPosterUrl(url: string): string {
  return url.replace(/=w\d+/, "=w1200");
}

export function HomeHero() {
  const poster = GENERATED_HERO_SLIDES[0]?.poster;
  const lcpHref = poster ? heroLcpPosterUrl(poster) : null;

  return (
    <>
      {lcpHref ? (
        <link rel="preload" as="image" href={lcpHref} fetchPriority="high" />
      ) : null}
      <HeroV4 />
    </>
  );
}
