import dynamic from "next/dynamic";
import { HomeHero } from "@/brand/sections/home/hero";

const HomeExperienceWorlds = dynamic(
  () => import("@/brand/sections/home/experience-worlds").then((m) => m.HomeExperienceWorlds),
  { loading: () => <section className="v4-section min-h-[40vh]" aria-hidden /> }
);
const HomeSignatureExperiences = dynamic(
  () => import("@/brand/sections/home/signature-experiences").then((m) => m.HomeSignatureExperiences),
  { loading: () => <section className="v4-section min-h-[48vh]" aria-hidden /> }
);
const HomePortfolioShowcase = dynamic(
  () => import("@/brand/sections/home/portfolio-showcase").then((m) => m.HomePortfolioShowcase),
  { loading: () => <section className="v4-section min-h-[50vh]" aria-hidden /> }
);
const HomeVenueCollection = dynamic(
  () => import("@/brand/sections/home/venue-collection").then((m) => m.HomeVenueCollection),
  { loading: () => <section className="v4-section min-h-[40vh]" aria-hidden /> }
);
const HomeAwards = dynamic(
  () => import("@/brand/sections/home/home-awards").then((m) => m.HomeAwards),
  { loading: () => <section className="v4-section min-h-[32vh]" aria-hidden /> }
);
const HomeTestimonialsV5 = dynamic(
  () => import("@/brand/sections/home/testimonials-v5").then((m) => m.HomeTestimonialsV5),
  { loading: () => <section className="v4-section min-h-[40vh]" aria-hidden /> }
);
const HomeMediaCoverage = dynamic(
  () => import("@/brand/sections/home/home-media-coverage").then((m) => m.HomeMediaCoverage),
  { loading: () => <section className="v4-section min-h-[28vh]" aria-hidden /> }
);
const HomeLuxuryCta = dynamic(
  () => import("@/brand/sections/home/luxury-cta").then((m) => m.HomeLuxuryCta),
  { loading: () => <section className="v4-section min-h-[24vh]" aria-hidden /> }
);

/**
 * Nexyyra homepage — hero is static for LCP; below-fold sections lazy-loaded.
 */
export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeExperienceWorlds />
      <HomeSignatureExperiences />
      <HomePortfolioShowcase />
      <HomeVenueCollection />
      <HomeAwards />
      <HomeTestimonialsV5 />
      <HomeMediaCoverage />
      <HomeLuxuryCta />
    </>
  );
}
