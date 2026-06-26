"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/shared/lazy-section";

const HomeExpertise = dynamic(
  () => import("@/brand/sections/home/expertise").then((m) => m.HomeExpertise),
  { ssr: false }
);
const HomeAboutLuxe = dynamic(
  () => import("@/brand/sections/home/about-luxe").then((m) => m.HomeAboutLuxe),
  { ssr: false }
);
const HomeFeaturedWork = dynamic(
  () => import("@/brand/sections/home/featured-work").then((m) => m.HomeFeaturedWork),
  { ssr: false }
);
const HomeCounters = dynamic(
  () => import("@/brand/sections/home/counters").then((m) => m.HomeCounters),
  { ssr: false }
);
const HomeCtaBand = dynamic(
  () => import("@/brand/sections/home/cta-band").then((m) => m.HomeCtaBand),
  { ssr: false }
);

/** Below-fold homepage — luxury reference layout: Expertise → About → Featured Work → Counters → CTA. */
export function HomeBelowFold() {
  return (
    <>
      <LazySection minHeight="48vh" label="Our Expertise">
        <HomeExpertise />
      </LazySection>
      <LazySection minHeight="60vh" label="About">
        <HomeAboutLuxe />
      </LazySection>
      <LazySection minHeight="52vh" label="Featured Work">
        <HomeFeaturedWork />
      </LazySection>
      <LazySection minHeight="28vh" label="By the Numbers">
        <HomeCounters />
      </LazySection>
      <LazySection minHeight="24vh" label="Plan Together">
        <HomeCtaBand />
      </LazySection>
    </>
  );
}
