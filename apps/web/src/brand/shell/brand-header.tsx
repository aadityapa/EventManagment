"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Phone,
} from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { EVENT_IMAGES } from "@/lib/images";
import { Logo } from "@/components/branding/logo";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { MobileNavbar } from "./mobile-navbar";
import { isNavActive, MEGA_COLUMNS, MEGA_EXPLORE_LINKS } from "./nav-data";

const MEGA_MOTION = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.99 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

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
  const [servicesPath, setServicesPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const servicesOpen = servicesPath === pathname;
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
      if (mqDesktop.matches) setMobileMenuOpen(false);
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
    <>
      <header
        className={cn(
          "brand-site-header fixed top-0 z-[var(--z-nav,9999)] hidden w-full transform-gpu transition-[background-color,border-color,box-shadow,opacity] duration-300 safe-top lg:block",
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
          </div>
        </div>
      </header>

      <MobileNavbar
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen((v) => !v)}
      />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
