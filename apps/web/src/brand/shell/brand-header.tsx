"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Cake,
  ChevronDown,
  Heart,
  LayoutGrid,
  Megaphone,
  Menu,
  Music,
  Phone,
  Plane,
  Rocket,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NAV_LINKS, MEGA_EXPLORE_LINKS, SITE_CONFIG } from "@/lib/constants";
import { EVENT_IMAGES } from "@/lib/images";
import { Logo } from "@/components/branding/logo";
import { cn } from "@/lib/utils";

type ExperienceCategory = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  { label: "Wedding", href: "/services/wedding-planning", icon: Heart },
  { label: "Corporate", href: "/services/corporate-events", icon: Building2 },
  { label: "Destination", href: "/services/destination-weddings", icon: Plane },
  { label: "Celebrity", href: "/services/celebrity-management", icon: Star },
  { label: "Concert", href: "/services/concert-management", icon: Music },
  { label: "Birthday", href: "/services/birthday-events", icon: Cake },
  { label: "Product Launch", href: "/services/product-launches", icon: Rocket },
  { label: "Brand Promotion", href: "/services/brand-promotions", icon: Megaphone },
  { label: "Conference", href: "/services/conferences", icon: Users },
  { label: "Exhibition", href: "/services/exhibitions", icon: LayoutGrid },
];

const MEGA_COLUMNS: { heading: string; items: ExperienceCategory[] }[] = [
  {
    heading: "Celebrations",
    items: EXPERIENCE_CATEGORIES.filter((c) =>
      ["Wedding", "Destination", "Birthday", "Concert"].includes(c.label)
    ),
  },
  {
    heading: "Corporate",
    items: EXPERIENCE_CATEGORIES.filter((c) =>
      ["Corporate", "Product Launch", "Brand Promotion"].includes(c.label)
    ),
  },
  {
    heading: "Production",
    items: EXPERIENCE_CATEGORIES.filter((c) =>
      ["Conference", "Exhibition", "Celebrity"].includes(c.label)
    ),
  },
  {
    heading: "Explore",
    items: [],
  },
];

const MEGA_MOTION = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.99 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

const MOBILE_DRAWER_MOTION = {
  initial: { opacity: 0, x: "100%" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "100%" },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
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
  const [isDesktop, setIsDesktop] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const megaMenuWrapRef = useRef<HTMLDivElement>(null);
  const hoverCapableRef = useRef(true);
  const isHome = pathname === "/";
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setIsDesktop(mqDesktop.matches);
      hoverCapableRef.current = mqHover.matches;
      if (!mqDesktop.matches) setServicesOpen(false);
    };
    sync();
    mqDesktop.addEventListener("change", sync);
    mqHover.addEventListener("change", sync);
    return () => {
      mqDesktop.removeEventListener("change", sync);
      mqHover.removeEventListener("change", sync);
    };
  }, [setServicesOpen]);

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
    if (!servicesOpen || !isDesktop) return;
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
  }, [servicesOpen, isDesktop, setServicesOpen]);

  const positionMegaMenu = useCallback(() => {
    const trigger = megaTriggerRef.current;
    const wrap = megaMenuWrapRef.current;
    const menu = wrap?.querySelector(".brand-mega-menu") as HTMLElement | null;
    if (!trigger || !wrap || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const viewportPad = 16;
    const centerX = triggerRect.left + triggerRect.width / 2;
    let left = centerX - menuWidth / 2;
    left = Math.max(viewportPad, Math.min(left, window.innerWidth - menuWidth - viewportPad));

    wrap.style.left = `${left}px`;
    wrap.style.top = `${triggerRect.bottom + 12}px`;
  }, []);

  useLayoutEffect(() => {
    if (!servicesOpen || !isDesktop) return;
    const run = () => {
      positionMegaMenu();
      requestAnimationFrame(() => positionMegaMenu());
    };
    run();
    window.addEventListener("resize", positionMegaMenu);
    window.addEventListener("scroll", positionMegaMenu, { passive: true });
    return () => {
      window.removeEventListener("resize", positionMegaMenu);
      window.removeEventListener("scroll", positionMegaMenu);
    };
  }, [servicesOpen, isDesktop, positionMegaMenu, pathname]);

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
                      ref={megaTriggerRef}
                      type="button"
                      className={cn("brand-nav-link", servicesActive && "is-active")}
                      aria-expanded={servicesOpen && isDesktop}
                      aria-haspopup="true"
                      aria-controls="services-mega-menu"
                      onClick={() => {
                        if (isDesktop) setServicesOpen((v) => !v);
                      }}
                      onMouseEnter={() => {
                        if (hoverCapableRef.current && isDesktop) setServicesOpen(true);
                      }}
                      onFocus={() => {
                        if (isDesktop) setServicesOpen(true);
                      }}
                    >
                      {l.label}
                      <ChevronDown
                        className={cn("brand-nav-link__chevron", servicesOpen && isDesktop && "is-open")}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && isDesktop && (
                        <motion.div
                          ref={megaMenuWrapRef}
                          className="brand-mega-menu-wrap"
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
                              <div className="brand-mega-menu__media">
                                <Image
                                  src={EVENT_IMAGES.wedding}
                                  alt="Luxury wedding experience by Nexyyra Events"
                                  fill
                                  sizes="320px"
                                  className="object-cover object-[center_30%]"
                                />
                                <div className="brand-mega-menu__media-veil" aria-hidden />
                                <div className="brand-mega-menu__media-caption">
                                  <p className="brand-mega-menu__media-eyebrow">Featured</p>
                                  <p className="brand-mega-menu__media-title">Wedding World</p>
                                  <Link
                                    href="/services/wedding-planning"
                                    onClick={() => setServicesOpen(false)}
                                    className="brand-mega-menu__media-link tap-target"
                                  >
                                    Explore weddings
                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                  </Link>
                                </div>
                              </div>

                              {MEGA_COLUMNS.map((col) => (
                                <div key={col.heading} className="brand-mega-menu__col">
                                  <p className="brand-mega-menu__heading">{col.heading}</p>
                                  <ul className="brand-mega-menu__list">
                                    {col.heading === "Explore"
                                      ? MEGA_EXPLORE_LINKS.map((link) => (
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
                                        ))
                                      : col.items.map((item) => {
                                          const Icon = item.icon;
                                          return (
                                            <li key={item.href}>
                                              <Link
                                                href={item.href}
                                                role="menuitem"
                                                onClick={() => setServicesOpen(false)}
                                                className="brand-mega-menu__link brand-mega-menu__link--icon"
                                              >
                                                <Icon className="brand-mega-menu__icon" aria-hidden="true" />
                                                {item.label}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                  </ul>
                                  {col.heading === "Celebrations" && (
                                    <Link
                                      href="/services"
                                      onClick={() => setServicesOpen(false)}
                                      className="brand-mega-menu__cta"
                                    >
                                      View all experiences
                                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="brand-mega-menu__footer">
                              <Link
                                href="/book-event"
                                onClick={() => setServicesOpen(false)}
                                className="luxury-button luxury-button--gold luxury-button--compact tap-target"
                              >
                                Book Consultation
                              </Link>
                              <Link
                                href="/services"
                                onClick={() => setServicesOpen(false)}
                                className="luxury-button luxury-button--ghost luxury-button--compact tap-target"
                              >
                                Explore Experiences
                              </Link>
                              <Link
                                href="/portfolio"
                                onClick={() => setServicesOpen(false)}
                                className="luxury-button luxury-button--ghost luxury-button--compact tap-target"
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
              className="brand-mobile-nav-backdrop fixed inset-0 z-[9998] bg-black/70 backdrop-blur-2xl lg:hidden"
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
              className="brand-mobile-nav fixed inset-y-0 right-0 z-[9999] flex w-full max-w-md flex-col overflow-hidden border-l border-white/10 bg-[rgba(8,10,18,0.92)] shadow-2xl backdrop-blur-3xl backdrop-saturate-150 lg:hidden safe-top safe-bottom"
              {...MOBILE_DRAWER_MOTION}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,215,110,0.12),transparent_60%)]" />
              <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5">
                <Logo variant="menu" href={undefined} priority />
                <button
                  type="button"
                  className="brand-header-menu-btn tap-target"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="brand-container relative flex flex-1 flex-col overflow-y-auto px-6 py-8">
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {NAV_LINKS.map((l) => {
                    if (l.href === "/services") {
                      return (
                        <div key={l.href} className="border-b border-white/8 pb-2">
                          <button
                            type="button"
                            onClick={() => setMobileServicesOpen((v) => !v)}
                            className="tap-target flex w-full items-center justify-between rounded-2xl px-3 py-4 font-[family-name:var(--font-playfair)] text-xl text-[var(--footer-text,#fff)]"
                            aria-expanded={mobileServicesOpen}
                            aria-controls="mobile-experience-menu"
                          >
                            {l.label}
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 text-[var(--glitz-gold)] transition-transform duration-300",
                                mobileServicesOpen && "rotate-180"
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileServicesOpen && (
                              <motion.div
                                id="mobile-experience-menu"
                                className="overflow-hidden"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <Link
                                  href="/services"
                                  onClick={() => setOpen(false)}
                                  className="tap-target flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)]"
                                >
                                  All Experiences
                                </Link>
                                {EXPERIENCE_CATEGORIES.map((item) => {
                                  const Icon = item.icon;
                                  return (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      onClick={() => setOpen(false)}
                                      className="tap-target flex items-center gap-3 rounded-xl px-3 py-3 text-base text-[var(--footer-text-secondary,rgba(255,255,255,0.72))] transition-colors hover:bg-white/5 hover:text-[var(--glitz-gold)]"
                                    >
                                      <Icon className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]/80" aria-hidden="true" />
                                      {item.label}
                                    </Link>
                                  );
                                })}
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
                          "tap-target block rounded-2xl px-3 py-4 font-[family-name:var(--font-playfair)] text-xl transition-colors",
                          pathname === l.href
                            ? "text-[var(--glitz-gold)]"
                            : "text-[var(--footer-text,#fff)] hover:text-[var(--glitz-gold)]"
                        )}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-8">
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
