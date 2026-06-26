"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, MEGA_EXPLORE_LINKS, SITE_CONFIG } from "@/lib/constants";
import { services } from "@/data/cms";
import { BRAND_SERVICE_CATEGORIES } from "@/brand/data/content";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { Logo } from "@/components/branding/logo";
import { BrandImage } from "@/brand/primitives/brand-image";
import { cn } from "@/lib/utils";

const FEATURED_SERVICE = BRAND_SERVICE_CATEGORIES[0];
const MEGA_SERVICES = services.slice(0, 10);
const EXPERIENCE_WORLDS_NAV = [
  { label: "Wedding World", href: "/services/wedding-planning?world=wedding" },
  { label: "Corporate World", href: "/services/corporate-events?world=corporate" },
  { label: "Celebrity World", href: "/services/celebrity-management?world=culture" },
  { label: "Destination Weddings", href: "/services/destination-weddings?world=destination" },
  { label: "Birthday Events", href: "/services/birthday-events?world=celebration" },
  { label: "Product Launches", href: "/services/product-launches?world=corporate" },
  { label: "Exhibitions", href: "/services/exhibitions?world=corporate" },
  { label: "Conferences", href: "/services/conferences?world=corporate" },
  { label: "Concert Management", href: "/services/concert-management?world=celebration" },
];

const MEGA_MOTION = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.99 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderNavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn("brand-nav-link", isActive && "is-active")}
    >
      {label}
    </Link>
  );
}

export function BrandHeader() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [servicesPath, setServicesPath] = useState<string | null>(null);
  const [mobileServicesPath, setMobileServicesPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const servicesOpen = servicesPath === pathname;
  const mobileServicesOpen = mobileServicesPath === pathname;
  const setOpen = useCallback(
    (value: boolean) => setMenuPath(value ? pathname : null),
    [pathname]
  );
  const setServicesOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setServicesPath((prev) => {
        const current = prev === pathname;
        const next = typeof value === "function" ? value(current) : value;
        return next ? pathname : null;
      });
    },
    [pathname]
  );
  const setMobileServicesOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setMobileServicesPath((prev) => {
        const current = prev === pathname;
        const next = typeof value === "function" ? value(current) : value;
        return next ? pathname : null;
      });
    },
    [pathname]
  );
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const hoverCapableRef = useRef(true);
  const isHome = pathname === "/";
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  useEffect(() => {
    hoverCapableRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

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
  }, [servicesOpen, setServicesOpen]);

  if (hidden) return null;

  const glass = scrolled || !isHome;

  return (
    <header
      className={cn(
        "brand-site-header fixed top-0 z-[var(--z-nav,9999)] w-full transform-gpu transition-[background-color,border-color,box-shadow,opacity] duration-300 safe-top",
        glass || (isHome && !scrolled)
          ? "border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
        scrolled && "is-scrolled shadow-[var(--shadow-glow-gold-sm)]"
      )}
      role="banner"
    >
      <div className="brand-header-shell brand-nav-bar">
        <div className="brand-header-grid">
          <div className="brand-header-logo">
            <Logo priority />
          </div>

          <nav className="brand-header-nav" aria-label="Main navigation">
            {NAV_LINKS.map((l) => {
              if (l.href === "/services") {
                const servicesActive = pathname.startsWith("/services");
                return (
                  <div key={l.href} ref={megaRef} className="relative flex h-full items-center">
                    <button
                      type="button"
                      className={cn("brand-nav-link", servicesActive && "is-active")}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      aria-controls="services-mega-menu"
                      onClick={() => setServicesOpen((v) => !v)}
                      onMouseEnter={() => {
                        if (hoverCapableRef.current) setServicesOpen(true);
                      }}
                      onFocus={() => setServicesOpen(true)}
                    >
                      {l.label}
                      <ChevronDown
                        className={cn("brand-nav-link__chevron", servicesOpen && "is-open")}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          className="brand-mega-menu-wrap absolute left-1/2 top-full z-[9999] -translate-x-1/2 pt-3"
                          onMouseLeave={() => {
                            if (hoverCapableRef.current) setServicesOpen(false);
                          }}
                          {...MEGA_MOTION}
                        >
                          <div
                            id="services-mega-menu"
                            role="menu"
                            aria-label="Experience categories"
                            className="brand-mega-menu"
                          >
                            <div className="brand-mega-menu__grid">
                              <Link
                                href={`/services/${FEATURED_SERVICE.slug}`}
                                role="menuitem"
                                onClick={() => setServicesOpen(false)}
                                className="brand-mega-menu__image group relative block overflow-hidden"
                              >
                                <BrandImage
                                  src={BRAND_IMAGES.weddings[0]}
                                  alt={FEATURED_SERVICE.title}
                                  fill
                                  sizes="320px"
                                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                                    Signature
                                  </p>
                                  <p className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-semibold text-white">
                                    Luxury Weddings
                                  </p>
                                </div>
                              </Link>

                              <div className="brand-mega-menu__col">
                                <p className="brand-mega-menu__heading">All Experiences</p>
                                <ul className="brand-mega-menu__list">
                                  {MEGA_SERVICES.map((s) => (
                                    <li key={s.slug}>
                                      <Link
                                        href={`/services/${s.slug}`}
                                        role="menuitem"
                                        onClick={() => setServicesOpen(false)}
                                        className="brand-mega-menu__link"
                                      >
                                        {s.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                                <Link
                                  href="/services"
                                  onClick={() => setServicesOpen(false)}
                                  className="brand-mega-menu__cta"
                                >
                                  View all experiences
                                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                              </div>

                              <div className="brand-mega-menu__col">
                                <p className="brand-mega-menu__heading">Experience Worlds</p>
                                <ul className="brand-mega-menu__list">
                                  {EXPERIENCE_WORLDS_NAV.map((link) => (
                                    <li key={link.href}>
                                      <Link
                                        href={link.href}
                                        role="menuitem"
                                        onClick={() => setServicesOpen(false)}
                                        className="brand-mega-menu__link brand-mega-menu__link--arrow"
                                      >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden="true" />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="brand-mega-menu__col">
                                <p className="brand-mega-menu__heading">Explore</p>
                                <ul className="brand-mega-menu__list">
                                  {MEGA_EXPLORE_LINKS.map((link) => (
                                    <li key={link.href}>
                                      <Link
                                        href={link.href}
                                        role="menuitem"
                                        onClick={() => setServicesOpen(false)}
                                        className="brand-mega-menu__link brand-mega-menu__link--arrow"
                                      >
                                        {link.label}
                                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden="true" />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="brand-mega-menu__footer">
                              <Link
                                href="/book-event"
                                onClick={() => setServicesOpen(false)}
                                className="brand-mega-menu__cta-btn brand-mega-menu__cta-btn--gold"
                              >
                                Book Consultation
                              </Link>
                              <Link
                                href="/services"
                                onClick={() => setServicesOpen(false)}
                                className="brand-mega-menu__cta-btn"
                              >
                                Explore Experiences
                              </Link>
                              <Link
                                href="/portfolio"
                                onClick={() => setServicesOpen(false)}
                                className="brand-mega-menu__cta-btn"
                              >
                                View Portfolio
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <HeaderNavLink
                  key={l.href}
                  href={l.href}
                  label={l.label}
                  isActive={isNavActive(pathname, l.href)}
                />
              );
            })}
          </nav>

          <div className="brand-header-actions">
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="brand-header-phone tap-target"
              aria-label={`Call ${SITE_CONFIG.phone}`}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              {SITE_CONFIG.phone}
            </a>
            <Link
              href="/book-event"
              className="brand-header-cta btn-gold-metallic btn-premium-hover tap-target"
            >
              Book Consultation
            </Link>
          </div>

          <div className="brand-header-mobile">
            <Link
              href="/book-event"
              className="brand-header-cta brand-header-cta--mobile btn-gold-metallic btn-premium-hover tap-target"
            >
              Book
            </Link>
            <button
              type="button"
              className="brand-header-menu-btn tap-target"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="brand-mobile-nav-backdrop fixed inset-0 z-[9998] bg-black/75 backdrop-blur-2xl md:hidden"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="brand-mobile-nav fixed inset-0 z-[9999] flex flex-col overflow-hidden md:hidden safe-top safe-bottom"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,215,110,0.14),transparent_60%)]" />
              <div className="brand-container relative flex flex-1 flex-col justify-center overflow-y-auto py-12 sm:py-16">
                <div className="mb-10 border-b border-white/10 pb-8">
                  <Logo variant="menu" showTagline href={undefined} priority />
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {NAV_LINKS.map((l) => {
                    if (l.href === "/services") {
                      return (
                        <div key={l.href}>
                          <button
                            type="button"
                            onClick={() => setMobileServicesOpen((v) => !v)}
                            className="tap-target flex w-full items-center justify-between rounded-2xl px-4 py-4 font-[family-name:var(--font-playfair)] text-2xl text-[var(--footer-text,#fff)]"
                            aria-expanded={mobileServicesOpen}
                            aria-controls="mobile-experience-menu"
                          >
                            {l.label}
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 transition-transform duration-300",
                                mobileServicesOpen && "rotate-180"
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileServicesOpen && (
                              <motion.div
                                id="mobile-experience-menu"
                                className="overflow-hidden pl-4"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <Link
                                  href="/services"
                                  onClick={() => setOpen(false)}
                                  className="tap-target block rounded-xl px-4 py-3 text-base text-[var(--glitz-gold)]"
                                >
                                  All Experiences
                                </Link>
                                {EXPERIENCE_WORLDS_NAV.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="tap-target block rounded-xl px-4 py-3 text-base text-[var(--footer-text-secondary,rgba(255,255,255,0.65))]"
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                          "tap-target block rounded-2xl px-4 py-4 font-[family-name:var(--font-playfair)] text-2xl transition-colors",
                          pathname === l.href
                            ? "text-[var(--glitz-gold)]"
                            : "text-[var(--footer-text,#fff)]"
                        )}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8">
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                    className="tap-target inline-flex items-center gap-3 text-lg text-[var(--glitz-gold)]"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    {SITE_CONFIG.phone}
                  </a>
                  <Link
                    href="/book-event"
                    onClick={() => setOpen(false)}
                    className="btn-gold-metallic btn-premium-hover tap-target rounded-xl py-4 text-center text-base font-semibold"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
