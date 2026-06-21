import dynamic from "next/dynamic";
import { HomeHero } from "@/brand/sections/home/hero";
import { HomeIntro } from "@/brand/sections/home/intro";
import { HomeSignatureExperiences } from "@/brand/sections/home/signature-experiences";
import { HomeLuxuryCta } from "@/brand/sections/home/luxury-cta";

const HomePortfolioShowcase = dynamic(() =>
  import("@/brand/sections/home/portfolio-showcase").then((m) => m.HomePortfolioShowcase)
);
const HomeGlitzDifference = dynamic(() =>
  import("@/brand/sections/home/glitz-difference").then((m) => m.HomeGlitzDifference)
);
const HomeVenueCollection = dynamic(() =>
  import("@/brand/sections/home/venue-collection").then((m) => m.HomeVenueCollection)
);
const HomeTrustWall = dynamic(() =>
  import("@/brand/sections/home/trust-wall").then((m) => m.HomeTrustWall)
);

/**
 * V4 Home — 8 cinematic acts (down from 14).
 * Hero → Who We Are → Signature Experiences → Portfolio → Difference →
 * Venues → Trust Wall → Luxury CTA.
 * AI Planner lives on /book-event; quick link via BrandFab.
 */
export function HomeView() {
  return (
    <div className="brand-root">
      <HomeHero />
      <HomeIntro />
      <HomeSignatureExperiences />
      <HomePortfolioShowcase />
      <HomeGlitzDifference />
      <HomeVenueCollection />
      <HomeTrustWall />
      <HomeLuxuryCta />
    </div>
  );
}
