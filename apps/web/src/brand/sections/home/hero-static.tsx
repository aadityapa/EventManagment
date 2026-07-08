import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { HeroCarouselBackground } from "@/brand/sections/home/hero-carousel-bg";
import { Logo } from "@/components/branding/logo";

type HeroStaticProps = {
  slides: string[];
};

/**
 * Server-rendered homepage hero — luxury two-column: editorial copy left,
 * glowing gold brand logo right, over the live event-imagery backdrop.
 */
export function HeroStatic({ slides }: HeroStaticProps) {
  return (
    <section
      id="welcome"
      aria-label="Hero"
      className="luxury-hero relative flex min-h-svh items-center overflow-hidden border-b border-white/10 bg-[#050814]"
    >
      <HeroCarouselBackground slides={slides} />
      <div className="luxury-hero__veil" aria-hidden />
      <div className="luxury-hero__aurora" aria-hidden />
      <div className="luxury-hero__grid" aria-hidden />

      <div className="brand-container relative z-10 grid w-full items-center gap-10 py-24 pb-16 sm:gap-12 sm:py-28 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)] lg:py-32 xl:gap-16">
        <div className="max-w-3xl">
          <div className="luxury-hero__eyebrow">
            <span className="luxury-hero__eyebrow-line" aria-hidden />
            Crafting Moments
          </div>

          <h1 className="luxury-hero__title">
            Creating Experiences That Last{" "}
            <span className="luxury-hero__accent">Forever</span>
          </h1>

          <p className="luxury-hero__copy">
            From intimate gatherings to grand celebrations, we bring your vision to life with
            creativity, precision and perfection.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap">
            <Link href="/services" className="luxury-button luxury-button--purple tap-target">
              Explore Services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/portfolio" className="luxury-button luxury-button--ghost tap-target">
              <Play className="h-4 w-4" aria-hidden="true" />
              View Our Work
            </Link>
          </div>
        </div>

        <div className="luxury-hero__stage" aria-hidden>
          <div className="luxury-hero__logo-orbit">
            <Logo variant="image" href={undefined} priority className="luxury-hero__logo" />
          </div>
        </div>
      </div>
    </section>
  );
}
