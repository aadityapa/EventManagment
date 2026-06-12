"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Logo } from "@/components/branding/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function BrandHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  return (
    <header
      className={cn(
        "fixed top-0 z-[var(--z-nav,9999)] w-full transition-all duration-500 safe-top",
        glass
          ? "border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent"
      )}
      role="banner"
    >
      <div className="brand-container flex h-14 items-center justify-between sm:h-[3.75rem]">
        <Logo priority />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={cn(
                "tap-target rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href ? chromeLinkActive : chromeLinkIdle
              )}
            >
              {l.label}
            </Link>
          ))}
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
            className="relative z-50 border-t border-[var(--glitz-border)] bg-[var(--glitz-glass)] backdrop-blur-xl lg:hidden"
          >
            <nav className="brand-container flex flex-col gap-1 py-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((l) => (
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
              ))}
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
