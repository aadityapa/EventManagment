"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Share2, Globe, ExternalLink, Shield, Award } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS, FOOTER_LEGAL, MEGA_EXPLORE_LINKS } from "@/lib/constants";
import { BRAND_SERVICES, BRAND_AWARDS } from "@/brand/data/content";
import { BLOG_CATEGORIES } from "@/data/cms";
import { Logo } from "@/components/branding/logo";

const LOCAL_SEO_LINKS = [
  { href: "/event-management-company-pune", label: "Event Management Pune" },
  { href: "/wedding-planner-pune", label: "Wedding Planner Pune" },
  { href: "/corporate-event-management-pune", label: "Corporate Events Pune" },
  { href: "/luxury-wedding-planner-maharashtra", label: "Luxury Weddings Maharashtra" },
  { href: "/destination-wedding-planner-pune", label: "Destination Weddings" },
  { href: "/exhibition-management-pune", label: "Exhibition Management" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book-event", label: "Book Consultation" },
];

const SOCIAL = [
  { href: SITE_CONFIG.social.instagram, icon: Share2, label: "Instagram" },
  { href: SITE_CONFIG.social.facebook, icon: Globe, label: "Facebook" },
  { href: SITE_CONFIG.social.linkedin, icon: ExternalLink, label: "LinkedIn" },
  { href: SITE_CONFIG.social.youtube, icon: ExternalLink, label: "YouTube" },
];

export function BrandFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[var(--glitz-border)] bg-[var(--glitz-surface)]" role="contentinfo">
      <div className="brand-divider" aria-hidden="true" />
      <div className="brand-container py-14 sm:py-16">
        <div className="mb-10 rounded-2xl border border-[var(--glitz-gold)]/20 bg-[var(--glitz-gold)]/5 p-8 text-center">
          <h3 className="brand-display text-xl font-semibold sm:text-2xl">
            Ready to Plan Your Extraordinary Event?
          </h3>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white btn-premium-hover"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
            </a>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="tap-target inline-flex items-center gap-2 rounded-full border border-[var(--glitz-gold)]/40 px-6 py-3 text-sm font-semibold text-[var(--glitz-gold)] btn-premium-hover"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> {SITE_CONFIG.phone}
            </a>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-6 border-b border-[var(--glitz-border)] pb-8">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Shield className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
            <span>Licensed &amp; Insured</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Award className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
            <span>
              {BRAND_AWARDS[0]?.title ?? "Award-Winning"} · {BRAND_AWARDS[0]?.year ?? "2025"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="font-semibold text-[var(--glitz-gold)]">4.9★</span>
            <span>500+ Verified Reviews</span>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="text-sm leading-relaxed text-muted">
              India&apos;s premier luxury event management house — weddings, corporate galas, and
              destination celebrations.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Glitz Events on ${label}`}
                  className="tap-target flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glitz-border)] text-muted transition-colors hover:border-[var(--glitz-gold)] hover:text-[var(--glitz-gold)]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="brand-label mb-4">Company</h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-[var(--glitz-gold)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="brand-label mb-4">Services</h4>
            <ul className="space-y-2">
              {BRAND_SERVICES.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-[var(--glitz-gold)]"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="brand-label mb-4">Stories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-[var(--glitz-gold)] transition-colors hover:underline"
                >
                  All Stories →
                </Link>
              </li>
              {BLOG_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/blog?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-muted transition-colors hover:text-[var(--glitz-gold)]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="brand-label mb-4">Local SEO</h4>
            <ul className="space-y-2">
              {LOCAL_SEO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-[var(--glitz-gold)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--glitz-border)] pt-8">
          <h4 className="brand-label mb-3">Explore</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {MEGA_EXPLORE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-muted transition-colors hover:text-[var(--glitz-gold)]"
              >
                {l.label}
              </Link>
            ))}
            {NAV_LINKS.filter((l) => !["/", "/contact"].includes(l.href)).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-muted transition-colors hover:text-[var(--glitz-gold)]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="brand-container px-0">
          <div className="brand-divider my-8" aria-hidden="true" />
          <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
            <div>
              <h4 className="brand-label mb-3">Contact</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                  {SITE_CONFIG.address}
                </li>
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                    className="flex gap-2 transition-colors hover:text-[var(--glitz-gold)]"
                  >
                    <Phone className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                    {SITE_CONFIG.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex gap-2 transition-colors hover:text-[var(--glitz-gold)]"
                  >
                    <Mail className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                    {SITE_CONFIG.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="brand-divider my-8" aria-hidden="true" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {FOOTER_LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[var(--glitz-gold)]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
