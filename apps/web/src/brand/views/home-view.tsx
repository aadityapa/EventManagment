import { assetForRole } from "@/brand/data/image-curation";
import { HomeAbout } from "@/brand/sections/home/about";
import { HomeCommitments } from "@/brand/sections/home/commitments";
import { HomeConcepts } from "@/brand/sections/home/concepts";
import { HomeCover } from "@/brand/sections/home/cover";
import { HomeFaq } from "@/brand/sections/home/faq";
import { HomeInquiry } from "@/brand/sections/home/inquiry";
import { HomeMarquee } from "@/brand/sections/home/marquee";
import { HomeMethod } from "@/brand/sections/home/method";
import { HomeServices } from "@/brand/sections/home/services";
import { Diptych, Spread } from "@/components/ui";

/**
 * The home page (DESIGN.md §10.1), entirely server-rendered: cover → (V7 services ticker) → services
 * → spread → about → method → diptych → concepts → commitments → inquiry →
 * questions. Every photo is a distinct curated asset (no photo twice).
 */
export function HomeView() {
  const spread = assetForRole("spread-home");
  const diptychLeft = assetForRole("diptych-home-l");
  const diptychRight = assetForRole("diptych-home-r");

  return (
    <div className="lux-page pg-home">
      <HomeCover />
      <HomeMarquee />
      <HomeServices />
      {spread ? <Spread asset={spread.id} /> : null}
      <HomeAbout />
      <HomeMethod />
      {diptychLeft && diptychRight ? <Diptych left={diptychLeft.id} right={diptychRight.id} /> : null}
      <HomeConcepts />
      <HomeCommitments />
      <HomeInquiry />
      <HomeFaq />
    </div>
  );
}
