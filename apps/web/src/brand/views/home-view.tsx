import dynamic from "next/dynamic";
import { HomeHero } from "@/brand/sections/home/hero";
import { HomeIntro } from "@/brand/sections/home/intro";
import { HomeTrust } from "@/brand/sections/home/trust";
import { HomeHowItWorks } from "@/brand/sections/home/how-it-works";
import { HomeStats } from "@/brand/sections/home/stats";
import { HomeServices } from "@/brand/sections/home/services";
import { HomeWhyChoose } from "@/brand/sections/home/why-choose";
import { HomeFaq } from "@/brand/sections/home/faq";
import { HomeCta } from "@/brand/sections/home/cta";

const HomeCaseStudies = dynamic(() => import("@/brand/sections/home/case-studies").then((m) => m.HomeCaseStudies));
const HomeTestimonials = dynamic(() => import("@/brand/sections/home/testimonials").then((m) => m.HomeTestimonials));
const HomeVenues = dynamic(() => import("@/brand/sections/home/venues").then((m) => m.HomeVenues));
const HomePlanner = dynamic(() => import("@/brand/sections/home/planner").then((m) => m.HomePlanner));
const HomeAiPlanner = dynamic(() => import("@/brand/sections/home/ai-planner").then((m) => m.HomeAiPlanner));

export function HomeView() {
  return (
    <div className="brand-root">
      <HomeHero />
      <HomeTrust />
      <HomeHowItWorks />
      <HomeIntro />
      <HomeServices />
      <HomeStats />
      <HomeWhyChoose />
      <HomeTestimonials />
      <HomeCaseStudies />
      <HomeVenues />
      <HomePlanner />
      <HomeAiPlanner />
      <HomeFaq />
      <HomeCta />
    </div>
  );
}
