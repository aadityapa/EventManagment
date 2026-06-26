import Link from "next/link";
import { HeroCarouselBackground } from "@/brand/sections/home/hero-carousel-bg";
import { BrandImage } from "@/brand/primitives/brand-image";
import { Logo } from "@/components/branding/logo";

const HERO_METRICS = [
  { value: "1,800+", label: "productions" },
  { value: "35+", label: "cities" },
  { value: "120+", label: "event crew" },
] as const;

const HERO_SIGNATURES = [
  "Royal Weddings",
  "Corporate Galas",
  "Concerts",
  "Celebrity Events",
] as const;

type HeroStaticProps = {
  slides: string[];
};

/**
 * Server-rendered homepage hero shell — carousel slides from live Google Drive sync.
 */
export function HeroStatic({ slides }: HeroStaticProps) {
  const heroImages = slides.length > 0 ? slides : ["/images/placeholders/generic-coming-soon.webp"];
  const collage = [heroImages[1] ?? heroImages[0], heroImages[2] ?? heroImages[0], heroImages[3] ?? heroImages[0]];

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

      <div className="brand-container relative z-10 grid w-full items-center gap-12 py-28 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:py-32 xl:gap-16">
        <div className="max-w-4xl">
          <div className="luxury-hero__eyebrow">
            <span className="luxury-hero__eyebrow-line" aria-hidden />
            The Next Era of Celebrations
          </div>

          <h1 className="luxury-hero__title">
            We architect
            <span> impossible celebrations</span>
            for people who expect the exceptional.
          </h1>

          <p className="luxury-hero__copy">
            Nexyyra Events is a luxury event architecture house for weddings, destination
            celebrations, corporate galas, concerts, celebrity moments and brand experiences
            across India.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/book-event" className="luxury-button luxury-button--gold tap-target">
              Book Consultation
            </Link>
            <Link href="/portfolio" className="luxury-button luxury-button--ghost tap-target">
              Explore Portfolio
            </Link>
            <Link href="/ai" className="luxury-button luxury-button--text tap-target">
              Plan with AI Concierge
            </Link>
          </div>

          <dl className="luxury-hero__metrics">
            {HERO_METRICS.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="luxury-hero__stage" aria-label="Nexyyra signature event preview">
          <div className="luxury-hero__logo-orbit" aria-hidden>
            <Logo variant="image" href={undefined} priority className="luxury-hero__logo" />
          </div>
          <div className="luxury-hero__collage">
            {collage.map((src, index) => (
              <div key={`${src}-${index}`} className={`luxury-hero__frame luxury-hero__frame--${index + 1}`}>
                <BrandImage
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 42vw, 260px"
                  className="object-cover"
                  priority={index === 0}
                  aria-hidden
                />
              </div>
            ))}
          </div>
          <div className="luxury-hero__signature-card">
            <p>Signature Worlds</p>
            <ul>
              {HERO_SIGNATURES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
