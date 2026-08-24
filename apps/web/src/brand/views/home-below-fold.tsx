import { HomeExpertise } from "@/brand/sections/home/expertise";
import { HomeAboutLuxe } from "@/brand/sections/home/about-luxe";
import { HomeFeaturedWork } from "@/brand/sections/home/featured-work";
import { HomeCounters } from "@/brand/sections/home/counters";
import { HomeCtaBand } from "@/brand/sections/home/cta-band";
import { HomeTestimonialsStrip } from "@/brand/sections/home/testimonials-strip";

/**
 * Below-fold homepage — Expertise → About → Featured Work → Pillars → Why Nexyyra → CTA.
 *
 * Server-rendered (production repair): the previous implementation used
 * `dynamic(..., { ssr: false })` inside IntersectionObserver-gated wrappers, so the initial HTML contained only skeletons ("Loading Our
 * Expertise", …) — hiding all of this content from crawlers and causing large
 * CLS as sections mounted. Sections are client components with their own
 * in-view reveal animations; rendering them on the server puts the real
 * content in the initial HTML with zero layout shift.
 */
export function HomeBelowFold() {
  return (
    <>
      <HomeExpertise />
      <HomeAboutLuxe />
      <HomeFeaturedWork />
      <HomeCounters />
      <HomeTestimonialsStrip />
      <HomeCtaBand />
    </>
  );
}
