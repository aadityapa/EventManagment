import dynamic from "next/dynamic";
import { HomeHero } from "@/brand/sections/home/hero";
import { HomeExperienceWorlds } from "@/brand/sections/home/experience-worlds";
import { HomeSignatureExperiences } from "@/brand/sections/home/signature-experiences";

const HomePortfolioShowcase = dynamic(() =>
  import("@/brand/sections/home/portfolio-showcase").then((m) => m.HomePortfolioShowcase)
);
const HomeVenueCollection = dynamic(() =>
  import("@/brand/sections/home/venue-collection").then((m) => m.HomeVenueCollection)
);
const HomeAwards = dynamic(() =>
  import("@/brand/sections/home/home-awards").then((m) => m.HomeAwards)
);
const HomeTestimonialsV5 = dynamic(() =>
  import("@/brand/sections/home/testimonials-v5").then((m) => m.HomeTestimonialsV5)
);
const HomeMediaCoverage = dynamic(() =>
  import("@/brand/sections/home/home-media-coverage").then((m) => m.HomeMediaCoverage)
);
const HomeLuxuryCta = dynamic(() =>
  import("@/brand/sections/home/luxury-cta").then((m) => m.HomeLuxuryCta)
);

/**
 * Nexyyra homepage — cinematic hero + eight experience chapters.
 * Emotion-first; logo supports the story, never leads it.
 */
export function HomeView() {
  return (
    <div className="brand-root">
      <HomeHero />
      <HomeExperienceWorlds />
      <HomeSignatureExperiences />
      <HomePortfolioShowcase />
      <HomeVenueCollection />
      <HomeAwards />
      <HomeTestimonialsV5 />
      <HomeMediaCoverage />
      <HomeLuxuryCta />
    </div>
  );
}
