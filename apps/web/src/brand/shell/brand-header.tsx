"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, MEGA_EXPLORE_LINKS, SITE_CONFIG } from "@/lib/constants";
import { services } from "@/data/cms";
import { BRAND_SERVICE_CATEGORIES } from "@/brand/data/content";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { Logo } from "@/components/branding/logo";
import { BrandImage } from "@/brand/primitives/brand-image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const FEATURED_SERVICE = BRAND_SERVICE_CATEGORIES[0];
const MEGA_SERVICES = services.slice(0, 8);
const EXPERIENCE_WORLDS_NAV = [
  { label: "Wedding World", href: "/services/wedding-planning?world=wedding" },
  { label: "Corporate World", href: "/services/corporate-events?world=corporate" },
  { label: "Concert World", href: "/services/concert-management?world=celebration" },
  { label: "Celebrity World", href: "/services/celebrity-management?world=culture" },
  { label: "Exhibition World", href: "/services/exhibitions?world=corporate" },
  { label: "Fashion World", href: "/services/fashion-shows?world=culture" },
];

export function BrandHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    const close = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", close);
    };
  }, [servicesOpen]);

  if (hidden) return null;

  const glass = scrolled || !isHome;
  const adaptiveChrome = isHome && !scrolled;
  const chromeLinkActive = adaptiveChrome
    ? "text-[var(--adaptive-accent)]"
    : "text-[var(--glitz-gold)]";
  const chromeLinkIdle = adaptiveChrome
    ? "text-[var(--adaptive-text)]/85 hover:text-[var(--adaptive-accent)]"
    : "text-primary/80 hover:text-[var(--glitz-gold)]";
  const chromeAccent = adaptiveChrome
    ? "text-[var(--adaptive-accent)]"
    : "text-[var(--glitz-gold)]";

  const navLinkClass = (href: string, isActive: boolean) =>
    cn(
      "nav-link-luxury tap-target rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
      isActive ? chromeLinkActive : chromeLinkIdle
    );

  return (
    <header
      className={cn(
        "fixed top-0 z-[var(--z-nav,9999)] w-full transition-all duration-500 safe-top",
        glass
          ? "border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
        scrolled && "shadow-[var(--shadow-glow-gold-sm)]"
      )}
      role="banner"
    >
      <div
        className={cn(
          "brand-container flex items-center justify-between transition-all duration-500",
          scrolled ? "h-12 sm:h-[3.25rem]" : "h-14 sm:h-[3.75rem]"
        )}
      >
        <Logo priority className={cn("transition-transform duration-500", scrolled && "scale-95")} />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((l) => {
            if (l.href === "/services") {
              return (
                <div key={l.href} ref={megaRef} className="relative">
                  <button
                    type="button"
                    className={cn(
                      navLinkClass(l.href, pathname.startsWith("/services")),
                      "inline-flex items-center gap-1"
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    aria-controls="services-mega-menu"
                    onClick={() => setServicesOpen((v) => !v)}
                    onMouseEnter={() => setServicesOpen(true)}
                  >
                    {l.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        servicesOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {servicesOpen && (
                    <div
                      id="services-mega-menu"
                      role="menu"
                      className="absolute left-1/2 top-full z-50 mt-2 w-[min(94vw,52rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[var(--shadow-xl)] backdrop-blur-xl"
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <div className="grid lg:grid-cols-3">
                        {/* Signature featured */}
                        <Link
                          href={`/services/${FEATURED_SERVICE.slug}`}
                          role="menuitem"
                          onClick={() => setServicesOpen(false)}
                          className="group relative hidden min-h-[220px] overflow-hidden border-b border-[var(--glitz-border)] lg:block lg:border-b-0 lg:border-r"
                        >
                          <BrandImage
                            src={BRAND_IMAGES.weddings[0]}
                            alt={FEATURED_SERVICE.title}
                            fill
                            sizes="240px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glitz-gold)]">
                              Signature
                            </p>
                            <p className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-semibold text-white">
                              Luxury Weddings
                            </p>
                            <p className="mt-2 line-clamp-2 text-xs text-white/75">
                              Bespoke ceremonies with obsessive precision.
                            </p>
                          </div>
                        </Link>

                        {/* All services */}
                        <div className="border-b border-[var(--glitz-border)] p-4 lg:border-b-0 lg:border-r">
                          <p className="brand-label mb-3 px-1">All Services</p>
                          <div className="grid grid-cols-2 gap-0.5">
                            {MEGA_SERVICES.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                role="menuitem"
                                onClick={() => setServicesOpen(false)}
                                className="rounded-lg px-3 py-2 text-sm text-secondary transition-all hover:bg-[var(--glitz-gold)]/10 hover:text-[var(--glitz-gold)]"
                              >
                                {s.title}
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/services"
                            onClick={() => setServicesOpen(false)}
                            className="mt-3 flex items-center justify-center gap-1 border-t border-[var(--glitz-border)] pt-3 text-sm font-semibold text-[var(--glitz-gold)] hover:underline"
                          >
                            View all services
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </div>

                        {/* Explore + Worlds */}
                        <div className="p-4">
                          <p className="brand-label mb-3 px-1">Experience Worlds</p>
                          <ul className="mb-4 grid grid-cols-2 gap-0.5">
                            {EXPERIENCE_WORLDS_NAV.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  role="menuitem"
                                  onClick={() => setServicesOpen(false)}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-secondary transition-all hover:bg-[var(--glitz-gold)]/10 hover:text-[var(--glitz-gold)]"
                                >
                                  {link.label}
                                  <ArrowUpRight className="h-3 w-3 opacity-40" aria-hidden="true" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <p className="brand-label mb-3 px-1">Explore</p>
                          <ul className="space-y-1">
                            {MEGA_EXPLORE_LINKS.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  role="menuitem"
                                  onClick={() => setServicesOpen(false)}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-secondary transition-all hover:bg-[var(--glitz-gold)]/10 hover:text-[var(--glitz-gold)]"
                                >
                                  {link.label}
                                  <ArrowUpRight className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={navLinkClass(l.href, pathname === l.href || pathname.startsWith(`${l.href}/`))}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className={cn(
              "hidden items-center gap-1.5 text-sm transition-colors hover:brightness-110 lg:flex",
              chromeAccent
            )}
            aria-label={`Call ${SITE_CONFIG.phone}`}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {SITE_CONFIG.phone}
          </a>
          <ThemeToggle
            className={
              adaptiveChrome
                ? "border-[var(--adaptive-accent)]/35 text-[var(--adaptive-accent)] hover:border-[var(--adaptive-accent)]/60"
                : undefined
            }
          />
          <Link
            href="/book-event"
            className="btn-gold-metallic btn-premium-hover rounded-lg px-4 py-2.5 text-sm font-semibold tap-target"
          >
            Book Consultation
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle
            className={
              adaptiveChrome
                ? "border-[var(--adaptive-accent)]/35 text-[var(--adaptive-accent)] hover:border-[var(--adaptive-accent)]/60"
                : undefined
            }
          />
          <button
            type="button"
            className={cn("tap-target rounded-lg p-2", chromeAccent)}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="relative z-50 max-h-[calc(100svh-3.5rem)] overflow-y-auto border-t border-[var(--glitz-border)] bg-[var(--glitz-glass)] backdrop-blur-xl lg:hidden"
          >
            <nav className="brand-container flex flex-col gap-1 py-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((l, i) => {
                if (l.href === "/services") {
                  return (
                    <div key={l.href} style={{ animationDelay: `${i * 40}ms` }}>
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className="tap-target flex w-full items-center justify-between rounded-lg px-4 py-3 text-base text-primary"
                        aria-expanded={mobileServicesOpen}
                      >
                        {l.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            mobileServicesOpen && "rotate-180"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {mobileServicesOpen && (
                        <div className="ml-4 space-y-1 border-l border-[var(--glitz-border)] pl-3">
                          <Link
                            href="/services"
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-[var(--glitz-gold)]"
                          >
                            All Services
                          </Link>
                          {MEGA_SERVICES.slice(0, 6).map((s) => (
                            <Link
                              key={s.slug}
                              href={`/services/${s.slug}`}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-muted"
                            >
                              {s.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className={cn(
                      "tap-target rounded-lg px-4 py-3 text-base",
                      pathname === l.href
                        ? "bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold-metallic)]"
                        : "text-primary"
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="tap-target flex items-center gap-2 rounded-lg px-4 py-3 text-[var(--glitz-gold)]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SITE_CONFIG.phone}
              </a>
              <Link
                href="/book-event"
                onClick={() => setOpen(false)}
                className="btn-gold-metallic btn-premium-hover mt-2 rounded-lg py-3 text-center font-semibold tap-target"
              >
                Book Consultation
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
