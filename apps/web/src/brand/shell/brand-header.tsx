"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, MEGA_EXPLORE_LINKS, SITE_CONFIG } from "@/lib/constants";
import { services } from "@/data/cms";
import { BRAND_SERVICE_CATEGORIES } from "@/brand/data/content";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { Logo } from "@/components/branding/logo";
import { BrandImage } from "@/brand/primitives/brand-image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePremiere } from "@/components/providers/premiere-context";
import { EASE } from "@/lib/motion";
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const { skipPremiere, handoffActive } = usePremiere();
  const navVisible = skipPremiere || handoffActive;

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

  return (
    <motion.header
      initial={skipPremiere ? false : { opacity: 0 }}
      animate={{ opacity: navVisible ? 1 : 0 }}
      transition={{ duration: 1, ease: EASE.silk }}
      className={cn(
        "fixed top-0 z-[var(--z-nav,9999)] w-full transform-gpu will-change-[opacity,transform] transition-[background-color,border-color,box-shadow] duration-500 safe-top",
        glass || (isHome && !scrolled)
          ? "border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
        scrolled && "shadow-[var(--shadow-glow-gold-sm)]"
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
                      onMouseEnter={() => setServicesOpen(true)}
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
                        id="services-mega-menu"
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)" }}
                        transition={{ duration: 0.35, ease: EASE.silk }}
                        className="absolute left-1/2 top-full z-50 mt-0 w-[min(94vw,52rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[var(--shadow-xl)] backdrop-blur-xl"
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
                          <p className="brand-label mb-3 px-1">All Experiences</p>
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
                            View all experiences
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
            <ThemeToggle className="brand-header-theme border-[var(--glitz-border)] text-[var(--glitz-gold)] hover:border-[var(--glitz-gold)]/50" />
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
              className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-2xl md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-0 z-[9999] flex flex-col overflow-hidden md:hidden safe-top safe-bottom"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,215,110,0.14),transparent_60%)]" />
              <div className="brand-container relative flex flex-1 flex-col justify-center overflow-y-auto py-12 sm:py-16">
                <motion.div
                  className="mb-10 border-b border-white/10 pb-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Logo variant="menu" showTagline href={undefined} priority />
                </motion.div>
                <motion.nav
                  className="flex flex-col gap-1"
                  aria-label="Mobile navigation"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
                    closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                  }}
                >
                  {NAV_LINKS.map((l) => {
                    if (l.href === "/services") {
                      return (
                        <motion.div
                          key={l.href}
                          variants={{
                            closed: { opacity: 0, y: 24, filter: "blur(6px)" },
                            open: { opacity: 1, y: 0, filter: "blur(0px)" },
                          }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <button
                            type="button"
                            onClick={() => setMobileServicesOpen((v) => !v)}
                            className="tap-target flex w-full items-center justify-between rounded-2xl px-4 py-4 font-[family-name:var(--font-playfair)] text-2xl text-[var(--footer-text,#fff)]"
                            aria-expanded={mobileServicesOpen}
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
                          <AnimatePresence>
                            {mobileServicesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4"
                              >
                                <Link
                                  href="/services"
                                  onClick={() => setOpen(false)}
                                  className="tap-target block rounded-xl px-4 py-3 text-base text-[var(--glitz-gold)]"
                                >
                                  All Experiences
                                </Link>
                                {MEGA_SERVICES.slice(0, 6).map((s) => (
                                  <Link
                                    key={s.slug}
                                    href={`/services/${s.slug}`}
                                    onClick={() => setOpen(false)}
                                    className="tap-target block rounded-xl px-4 py-3 text-base text-[var(--footer-text-secondary,rgba(255,255,255,0.65))]"
                                  >
                                    {s.title}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        key={l.href}
                        variants={{
                          closed: { opacity: 0, y: 24, filter: "blur(6px)" },
                          open: { opacity: 1, y: 0, filter: "blur(0px)" },
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
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
                      </motion.div>
                    );
                  })}
                </motion.nav>

                <motion.div
                  className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <ThemeToggle className="brand-header-theme border-white/20 text-[var(--glitz-gold)]" />
                    <span className="text-sm text-white/60">Theme</span>
                  </div>
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
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
