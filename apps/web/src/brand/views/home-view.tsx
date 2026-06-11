import { HomeHero } from "@/brand/sections/home/hero";
import { HomeIntro } from "@/brand/sections/home/intro";
import { HomeTrust } from "@/brand/sections/home/trust";
import { HomeStats } from "@/brand/sections/home/stats";
import { HomeServices } from "@/brand/sections/home/services";
import { HomeCaseStudies } from "@/brand/sections/home/case-studies";
import { HomeWhyChoose } from "@/brand/sections/home/why-choose";
import { HomeTestimonials } from "@/brand/sections/home/testimonials";
import { HomeVenues } from "@/brand/sections/home/venues";
import { HomePlanner } from "@/brand/sections/home/planner";
import { HomeAiPlanner } from "@/brand/sections/home/ai-planner";
import { HomeCta } from "@/brand/sections/home/cta";

export function HomeView() {
  return (
    <div className="brand-root">
      <HomeHero />
      <HomeIntro />
      <HomeTrust />
      <HomeStats />
      <HomeServices />
      <HomeCaseStudies />
      <HomeWhyChoose />
      <HomeTestimonials />
      <HomeVenues />
      <HomePlanner />
      <HomeAiPlanner />
      <HomeCta />
    </div>
  );
}
