import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { HeroCarouselBackground } from "@/brand/sections/home/hero-carousel-bg";
import { Hero3D } from "@/components/three/hero-3d";
import { Logo } from "@/components/branding/logo";

type HeroStaticProps = {
  slides: string[];
};

const MARQUEE_ITEMS = [
  "Luxury Weddings",
  "Corporate Galas",
  "Destination Celebrations",
  "Concerts & Live Shows",
  "Exhibitions",
  "Private Soirées",
];

/**
 * Server-rendered homepage hero — luxury two-column: editorial copy left,
 * glowing gold brand logo over a live WebGL centrepiece right, on the
 * event-imagery backdrop. Cinematic staggered entrance + marquee band.
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
      <div className="luxury-hero__three hidden md:block" aria-hidden>
        <Hero3D />
      </div>

      <div className="brand-container relative z-10 grid w-full items-center gap-10 py-24 pb-20 sm:gap-12 sm:py-28 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)] lg:py-32 xl:gap-16">
        <div className="max-w-3xl">
          <div className="luxury-hero__eyebrow lux-enter lux-enter-1">
            <span className="luxury-hero__eyebrow-line" aria-hidden />
            Crafting Moments
          </div>

          <h1 className="luxury-hero__title lux-enter lux-enter-2">
            Creating Experiences That Last{" "}
            <span className="luxury-hero__accent">Forever</span>
          </h1>

          <p className="luxury-hero__copy lux-enter lux-enter-3">
            From intimate gatherings to grand celebrations, we bring your vision to life with
            creativity, precision and perfection.
          </p>

          <div className="lux-enter lux-enter-4 mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap">
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

        <div className="luxury-hero__stage lux-enter lux-enter-5" aria-hidden>
          <div className="luxury-hero__logo-orbit">
            <Logo variant="image" href={undefined} priority className="luxury-hero__logo" />
          </div>
        </div>
      </div>

      <div className="lux-hero-marquee" aria-hidden>
        <div className="lux-hero-marquee__track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex">
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${dup}-${item}`} className="lux-hero-marquee__item">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
