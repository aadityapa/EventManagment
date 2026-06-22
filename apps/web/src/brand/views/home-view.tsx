import { HomeHero } from "@/brand/sections/home/hero";
import { HomeBelowFold } from "@/brand/views/home-below-fold";

/**
 * Nexyyra homepage — static server hero; below-fold sections lazy-loaded on scroll.
 */
export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeBelowFold />
    </>
  );
}
