"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone, Play, X } from "lucide-react";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { HERO_SHOWREEL_VIDEO, HERO_VIDEO_SLIDES } from "@/components/home/hero-video-data";
import { ScrollReveal, Parallax } from "@/lib/motion";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { SITE_CONFIG } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GoldParticles = dynamic(
  () => import("@/components/effects/gold-particles").then((m) => m.GoldParticles),
  { ssr: false }
);

const FOOTER_BG_SLIDES = HERO_VIDEO_SLIDES.slice(0, 3);

const EXPERIENCE_LINKS = [
  { href: "/services/wedding-planning", label: "Luxury Weddings" },
  { href: "/services/corporate-events", label: "Corporate Experiences" },
  { href: "/services/destination-weddings", label: "Destination Weddings" },
  { href: "/services/celebrity-management", label: "Celebrity Events" },
  { href: "/services/brand-promotions", label: "Brand Activations" },
  { href: "/services/event-production", label: "Award Ceremonies" },
  { href: "/services/fashion-shows", label: "Fashion Shows" },
] as const;

const TRUST_METRICS = [
  { end: 12, suffix: "+", label: "Years", decimals: 0 },
  { end: 1000, suffix: "+", label: "Events", decimals: 0 },
  { end: 500, suffix: "+", label: "Clients", decimals: 0 },
  { end: 4.9, suffix: "", label: "Rating", decimals: 1 },
] as const;

const FEATURED_CLIENTS = [
  "Netflix",
  "Amazon",
  "Google",
  "Taj Hotels",
  "JW Marriott",
  "ITC",
  "Hyatt",
  "Mahindra",
  "Aditya Birla Group",
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/privacy#cookies", label: "Cookies" },
  { href: "/sitemap.xml", label: "Sitemap", external: true },
] as const;

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 8.5h3v11h-3v-11zM8 6.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM11 8.5h2.9v1.5h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6V19.5h-3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74v5.3H11V8.5z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.58 7.88 6.26 9.41-.09-.79-.17-2.01.04-2.87l1.15-4.88s-.29-.58-.29-1.44c0-1.35.78-2.36 1.76-2.36.83 0 1.23.62 1.23 1.37 0 .83-.53 2.08-.81 3.23-.23.97.49 1.76 1.45 1.76 1.74 0 3.08-1.83 3.08-4.48 0-2.34-1.68-3.98-4.08-3.98-2.78 0-4.41 2.09-4.41 4.25 0 .84.32 1.74.72 2.23.08.1.09.18.07.28l-.27 1.08c-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.86 0-3.15 2.29-6.04 6.61-6.04 3.47 0 6.17 2.47 6.17 5.77 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.62 2.37c-.23.88-.85 1.98-1.27 2.65 0 .96.01 1.92.03 2.88C18.42 20.88 22 16.84 22 12c0-5.52-4.48-10-10-10z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.8 8.4a2.5 2.5 0 0 0-1.76-1.77C18.36 6.2 12 6.2 12 6.2s-6.36 0-8.04.43A2.5 2.5 0 0 0 2.2 8.4 26 26 0 0 0 2 12a26 26 0 0 0 .2 3.6 2.5 2.5 0 0 0 1.76 1.77C5.64 17.8 12 17.8 12 17.8s6.36 0 8.04-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.2-3.6zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: SITE_CONFIG.social.instagram, label: "Instagram", icon: InstagramIcon },
  { href: "https://pinterest.com/nexyyraevents", label: "Pinterest", icon: PinterestIcon },
  { href: SITE_CONFIG.social.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: SITE_CONFIG.social.youtube, label: "YouTube", icon: YoutubeIcon },
  {
    href: `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`,
    label: "WhatsApp",
    icon: MessageCircle,
  },
] as const;

function ShowreelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Nexyyra Events showreel"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--glitz-gold)]/30 bg-black shadow-[0_0_80px_-20px_rgba(201,162,39,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="tap-target absolute right-3 top-3 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90"
          aria-label="Close showreel"
        >
          <X className="h-5 w-5" />
        </button>
        <video
          autoPlay
          controls
          playsInline
          className="aspect-video w-full object-cover"
          poster={HERO_VIDEO_SLIDES[0]?.poster}
        >
          <source src={HERO_SHOWREEL_VIDEO} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

function FooterCinematicBg({ reducedMotion }: { reducedMotion: boolean | null }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FOOTER_BG_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <Parallax layer="bg" className="absolute inset-0 -z-10">
      <div className="absolute inset-0 overflow-hidden">
        {FOOTER_BG_SLIDES.map((slide, i) => (
          <div
            key={slide.category}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2000ms] ease-[var(--v4-ease-silk)]",
              i === active ? "opacity-100" : "opacity-0"
            )}
            aria-hidden
          >
            {!reducedMotion ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full scale-110 object-cover blur-md"
                poster={slide.poster}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.poster} alt="" className="h-full w-full scale-110 object-cover blur-md" />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/88 via-[#050505]/92 to-[#050505]/98" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,215,110,0.12),transparent_70%)]" />
      </div>
    </Parallax>
  );
}

function AnimatedCounters() {
  const ref = useRef<HTMLDivElement>(null);

  useGsapContext(ref, () => {
    ref.current?.querySelectorAll("[data-count]").forEach((el) => {
      const node = el as HTMLElement;
      const end = Number(node.dataset.end);
      const suffix = node.dataset.suffix ?? "";
      const decimals = Number(node.dataset.decimals ?? 0);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2.4,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 92%", once: true },
        onUpdate: () => {
          const val = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v).toLocaleString("en-IN");
          node.textContent = `${val}${suffix}`;
        },
      });
    });
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {TRUST_METRICS.map((m) => (
        <GlassPanel key={m.label} className="border-[var(--glitz-gold)]/15 bg-white/5 px-4 py-8 text-center backdrop-blur-md">
          <p
            data-count
            data-end={m.end}
            data-suffix={m.suffix}
            data-decimals={m.decimals}
            className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--v4-dune-glow)] sm:text-4xl"
          >
            0{m.suffix}
          </p>
          <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/55">
            {m.label}
          </p>
        </GlassPanel>
      ))}
    </div>
  );
}

function ClientMarquee() {
  const items = [...FEATURED_CLIENTS, ...FEATURED_CLIENTS];
  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050505] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050505] to-transparent"
        aria-hidden
      />
      <div className="brand-marquee gap-16 px-8">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex shrink-0 items-center gap-4 whitespace-nowrap font-[family-name:var(--font-playfair)] text-sm tracking-wide text-white/45 sm:text-base"
          >
            <span className="h-px w-6 bg-[var(--glitz-gold)]/50" aria-hidden />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SocialIconLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const external = href.startsWith("http");
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={`Follow Nexyyra on ${label}`}
      className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--glitz-gold)]/25 bg-white/5 text-white/70 backdrop-blur-md transition-colors hover:border-[var(--glitz-gold)]/60 hover:text-[var(--v4-dune-glow)] sm:h-16 sm:w-16"
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(245,215,110,0.25),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
      <Icon className="relative z-10 h-6 w-6 sm:h-7 sm:w-7" />
    </motion.a>
  );
}

export function BrandFooter() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [showreelOpen, setShowreelOpen] = useState(false);

  const openShowreel = useCallback(() => {
    analytics.ctaClick("watch_showreel", "footer");
    setShowreelOpen(true);
  }, []);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  const telHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${SITE_CONFIG.email}`;

  return (
    <>
      <footer
        className="relative mt-auto overflow-x-clip bg-[#050505] text-white"
        role="contentinfo"
      >
        <FooterCinematicBg reducedMotion={reducedMotion} />
        <div className="pointer-events-none absolute inset-0 -z-[5] opacity-40">
          <GoldParticles className="h-full w-full" />
        </div>

        {/* Section 1 — Luxury CTA */}
        <section
          className="relative border-b border-white/10 py-[var(--v4-section-lg)]"
          aria-labelledby="footer-cta-heading"
        >
          <div className="brand-container mx-auto max-w-5xl text-center">
            <ScrollReveal preset="reveal">
              <span className="v4-kicker mb-8 justify-center text-[var(--v4-champagne)]/80">
                The Final Scene
              </span>
            </ScrollReveal>
            <ScrollReveal preset="reveal" delay={0.06}>
              <h2
                id="footer-cta-heading"
                className="nex-section-text mx-auto max-w-4xl font-[family-name:var(--font-playfair)] font-semibold text-white"
              >
                Ready To Create
                <br />
                <span className="v4-gold-text">The Next Era Of Celebrations?</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal preset="fade" delay={0.12}>
              <p className="mx-auto mt-6 max-w-md text-lg text-white/65">
                Luxury experiences designed for visionaries.
              </p>
            </ScrollReveal>
            <ScrollReveal preset="scale" delay={0.18}>
              <div className="mt-12 flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center">
                <MagneticButton>
                  <BrandButton
                    href="/book-event"
                    variant="gold"
                    className="w-full sm:min-w-[220px]"
                    onClick={() => analytics.ctaClick("book_consultation", "footer")}
                  >
                    Book Consultation
                  </BrandButton>
                </MagneticButton>
                <MagneticButton>
                  <button
                    type="button"
                    onClick={openShowreel}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--glitz-gold)]/45 bg-white/5 px-8 py-3 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-all hover:border-[var(--glitz-gold)]/70 hover:bg-white/10 hover:shadow-[0_0_40px_-12px_rgba(201,162,39,0.45)] sm:w-auto sm:min-w-[220px]"
                  >
                    <Play className="h-4 w-4 fill-current text-[var(--v4-dune-glow)]" aria-hidden />
                    Watch Showreel
                  </button>
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Sections 3–9 — Content grid */}
        <div className="brand-container relative py-[var(--v4-section)]">
          <div className="v4-hairline mb-16 opacity-30" aria-hidden />

          {/* Section 3 — Brand */}
          <ScrollReveal preset="fade">
            <div className="mb-20 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--v4-champagne)]">
                NEXYYRA EVENTS
              </p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-2xl text-white/90 sm:text-3xl">
                {SITE_CONFIG.tagline}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
                Crafting unforgettable experiences through luxury, innovation and timeless storytelling.
              </p>
            </div>
          </ScrollReveal>

          {/* Mobile — accordion */}
          <div className="mb-12 md:hidden">
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="experiences" className="rounded-xl border border-white/10 bg-white/5 px-0">
                <AccordionTrigger className="tap-target px-4 py-4 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--v4-dune-glow)] hover:no-underline">
                  Experiences
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-3">
                    {EXPERIENCE_LINKS.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="tap-target block py-1 text-sm text-white/60 hover:text-[var(--v4-dune-glow)]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contact" className="rounded-xl border border-white/10 bg-white/5 px-0">
                <AccordionTrigger className="tap-target px-4 py-4 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--v4-dune-glow)] hover:no-underline">
                  Contact
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-4 text-sm text-white/60">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                      {SITE_CONFIG.address}
                    </li>
                    <li>
                      <a href={telHref} className="tap-target flex gap-3 py-1 hover:text-[var(--v4-dune-glow)]">
                        <Phone className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                        {SITE_CONFIG.phone}
                      </a>
                    </li>
                    <li>
                      <a href={mailHref} className="tap-target flex gap-3 py-1 hover:text-[var(--v4-dune-glow)]">
                        <Mail className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                        {SITE_CONFIG.email}
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="connect" className="rounded-xl border border-white/10 bg-white/5 px-0">
                <AccordionTrigger className="tap-target px-4 py-4 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--v4-dune-glow)] hover:no-underline">
                  Connect
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-4">
                    {SOCIAL_LINKS.map((s) => (
                      <SocialIconLink key={s.label} {...s} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="hidden gap-12 md:grid md:grid-cols-2 lg:grid-cols-12">
            {/* Section 4 — Experience links */}
            <ScrollReveal preset="left" className="lg:col-span-3">
              <h3 className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--v4-dune-glow)]">
                Experiences
              </h3>
              <ul className="space-y-3">
                {EXPERIENCE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-white/60 transition-colors hover:text-[var(--v4-dune-glow)]"
                    >
                      <span className="mr-0 h-px w-0 bg-[var(--glitz-gold)] transition-all duration-300 group-hover:mr-3 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Section 8 — Contact */}
            <ScrollReveal preset="fade" delay={0.06} className="lg:col-span-3">
              <h3 className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--v4-dune-glow)]">
                Contact
              </h3>
              <ul className="space-y-4 text-sm text-white/60">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                  {SITE_CONFIG.address}
                </li>
                <li>
                  <a href={telHref} className="flex gap-3 transition-colors hover:text-[var(--v4-dune-glow)]">
                    <Phone className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                    {SITE_CONFIG.phone}
                  </a>
                </li>
                <li>
                  <a href={mailHref} className="flex gap-3 transition-colors hover:text-[var(--v4-dune-glow)]">
                    <Mail className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                    {SITE_CONFIG.email}
                  </a>
                </li>
              </ul>
            </ScrollReveal>

            {/* Section 7 — Social */}
            <ScrollReveal preset="right" delay={0.08} className="lg:col-span-6">
              <h3 className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--v4-dune-glow)]">
                Connect
              </h3>
              <div className="flex flex-wrap gap-4">
                {SOCIAL_LINKS.map((s) => (
                  <SocialIconLink key={s.label} {...s} />
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Section 5 — Trust metrics */}
          <ScrollReveal preset="scale" className="mt-20">
            <AnimatedCounters />
          </ScrollReveal>

          {/* Section 6 — Client marquee */}
          <ScrollReveal preset="fade" delay={0.1} className="mt-20">
            <p className="mb-8 text-center text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/40">
              Trusted By Visionaries
            </p>
            <ClientMarquee />
          </ScrollReveal>

          <div className="v4-hairline my-16 opacity-20" aria-hidden />

          {/* Section 9 — Legal + copyright */}
          <div className="flex flex-col items-center justify-between gap-6 pb-10 text-sm text-white/40 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
            </p>
            <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((l) =>
                "external" in l && l.external ? (
                  <a
                    key={l.href}
                    href={l.href}
                    className="transition-colors hover:text-[var(--v4-dune-glow)]"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} className="transition-colors hover:text-[var(--v4-dune-glow)]">
                    {l.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </footer>

      <ShowreelModal open={showreelOpen} onClose={() => setShowreelOpen(false)} />
    </>
  );
}
