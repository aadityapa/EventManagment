"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/shared/lazy-section";

const HomeExperienceWorlds = dynamic(
  () => import("@/brand/sections/home/experience-worlds").then((m) => m.HomeExperienceWorlds),
  { ssr: false }
);
const HomeSignatureExperiences = dynamic(
  () => import("@/brand/sections/home/signature-experiences").then((m) => m.HomeSignatureExperiences),
  { ssr: false }
);
const HomePortfolioShowcase = dynamic(
  () => import("@/brand/sections/home/portfolio-showcase").then((m) => m.HomePortfolioShowcase),
  { ssr: false }
);
const HomeVenueCollection = dynamic(
  () => import("@/brand/sections/home/venue-collection").then((m) => m.HomeVenueCollection),
  { ssr: false }
);
const HomeAwards = dynamic(
  () => import("@/brand/sections/home/home-awards").then((m) => m.HomeAwards),
  { ssr: false }
);
const HomeTestimonialsV5 = dynamic(
  () => import("@/brand/sections/home/testimonials-v5").then((m) => m.HomeTestimonialsV5),
  { ssr: false }
);
const HomeMediaCoverage = dynamic(
  () => import("@/brand/sections/home/home-media-coverage").then((m) => m.HomeMediaCoverage),
  { ssr: false }
);
const HomeLuxuryCta = dynamic(
  () => import("@/brand/sections/home/luxury-cta").then((m) => m.HomeLuxuryCta),
  { ssr: false }
);

/** Below-fold homepage sections — client-only bundles loaded on scroll. */
export function HomeBelowFold() {
  return (
    <>
      <LazySection minHeight="40vh">
        <HomeExperienceWorlds />
      </LazySection>
      <LazySection minHeight="48vh">
        <HomeSignatureExperiences />
      </LazySection>
      <LazySection minHeight="50vh">
        <HomePortfolioShowcase />
      </LazySection>
      <LazySection minHeight="40vh">
        <HomeVenueCollection />
      </LazySection>
      <LazySection minHeight="32vh">
        <HomeAwards />
      </LazySection>
      <LazySection minHeight="40vh">
        <HomeTestimonialsV5 />
      </LazySection>
      <LazySection minHeight="28vh">
        <HomeMediaCoverage />
      </LazySection>
      <LazySection minHeight="24vh">
        <HomeLuxuryCta />
      </LazySection>
    </>
  );
}
