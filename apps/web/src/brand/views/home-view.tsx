import dynamic from "next/dynamic";
import { HomeHero } from "@/brand/sections/home/hero";
import { HomeIntro } from "@/brand/sections/home/intro";
import { HomeExperienceWorlds } from "@/brand/sections/home/experience-worlds";
import { HomeSignatureExperiences } from "@/brand/sections/home/signature-experiences";

const HomePortfolioShowcase = dynamic(() =>
  import("@/brand/sections/home/portfolio-showcase").then((m) => m.HomePortfolioShowcase)
);
const HomeVenueCollection = dynamic(() =>
  import("@/brand/sections/home/venue-collection").then((m) => m.HomeVenueCollection)
);
const HomeTestimonialsV5 = dynamic(() =>
  import("@/brand/sections/home/testimonials-v5").then((m) => m.HomeTestimonialsV5)
);
const HomeMediaAwards = dynamic(() =>
  import("@/brand/sections/home/media-awards").then((m) => m.HomeMediaAwards)
);
const HomeLuxuryCta = dynamic(() =>
  import("@/brand/sections/home/luxury-cta").then((m) => m.HomeLuxuryCta)
);

/**
 * V5 Home — 9 cinematic chapters per wireframes.
 * Ch.1 Welcome → Ch.9 Commission + universe nav shell.
 */
export function HomeView() {
  return (
    <div className="brand-root">
      <HomeHero />
      <HomeIntro />
      <HomeExperienceWorlds />
      <HomeSignatureExperiences />
      <HomePortfolioShowcase />
      <HomeVenueCollection />
      <HomeTestimonialsV5 />
      <HomeMediaAwards />
      <HomeLuxuryCta />
    </div>
  );
}
