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
    const fn = () => setScrolled(window.scrollY > 16);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (hidden) return null;

  const glass = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 safe-top",
        glass
          ? "border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent"
      )}
    >
      <div className="brand-container flex h-12 items-center justify-between sm:h-[3.25rem]">
        <Logo priority />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === l.href
                  ? "text-[var(--glitz-gold-metallic)]"
                  : "text-[var(--glitz-text)]/80 hover:text-[var(--glitz-gold-metallic)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-1.5 text-sm text-[var(--glitz-gold-metallic)] lg:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE_CONFIG.phone}
          </a>
          <ThemeToggle />
          <Link href="/book-event" className="btn-gold-metallic rounded-lg px-4 py-2 text-sm font-semibold">
            Book Consultation
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--glitz-gold-metallic)]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--glitz-border)] bg-[var(--glitz-glass)] backdrop-blur-xl lg:hidden">
          <nav className="brand-container flex flex-col gap-1 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-base",
                  pathname === l.href
                    ? "bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold-metallic)]"
                    : "text-[var(--glitz-text)]"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/book-event"
              onClick={() => setOpen(false)}
              className="btn-gold-metallic mt-2 rounded-lg py-2.5 text-center font-semibold"
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
