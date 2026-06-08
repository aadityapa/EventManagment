"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABLET_LINKS = NAV_LINKS.slice(0, 6);

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isDashboard) return null;

  return (
    <header
      className={cn(
        "site-chrome sticky top-0 z-50 border-b transition-all duration-300 safe-top",
        scrolled
          ? "border-primary/20 bg-white/90 shadow-[0_4px_24px_rgba(184,134,11,0.08)] backdrop-blur-xl"
          : "border-transparent bg-[#faf8f5]/80 backdrop-blur-md"
      )}
    >
      <div className="container-page flex h-14 items-center justify-between sm:h-16 md:h-[4.25rem]">
        <Logo priority />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "touch-target rounded-md px-3 py-2 text-sm font-semibold tracking-wide transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/85 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <nav className="hidden items-center gap-0.5 md:flex xl:hidden" aria-label="Main navigation">
          {TABLET_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "touch-target rounded-md px-2 py-2 text-xs font-semibold lg:px-3 lg:text-sm",
                  active ? "text-primary" : "text-foreground/85 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex lg:gap-3">
          <Button variant="ghost" size="sm" className="hidden text-primary lg:inline-flex" asChild>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{SITE_CONFIG.phone}</span>
            </a>
          </Button>
          <Button size="sm" className="magnetic-hover shadow-glow lg:size-default" asChild>
            <Link href="/book-event">Book Event</Link>
          </Button>
        </div>

        <button
          type="button"
          className="touch-target rounded-lg p-2 text-primary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-primary/15 bg-white/98 backdrop-blur-xl md:hidden safe-bottom">
            <div className="container-page border-b border-primary/10 py-5" onClick={() => setMobileOpen(false)}>
              <Logo />
            </div>
            <nav className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "touch-target flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-primary/8",
                    pathname === link.href && "bg-primary/10 text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="touch-target flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/8"
              >
                <Phone className="h-5 w-5 text-primary" />
                {SITE_CONFIG.phone}
              </a>
              <Button className="mt-2 w-full" size="lg" asChild>
                <Link href="/book-event" onClick={() => setMobileOpen(false)}>
                  Book Event
                </Link>
              </Button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
