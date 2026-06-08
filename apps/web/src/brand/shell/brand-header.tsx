"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Logo } from "@/components/branding/logo";
import { cn } from "@/lib/utils";

export function BrandHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (hidden) return null;

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500 safe-top",
      scrolled || !isHome ? "border-b border-[var(--glitz-border)] bg-[#0A0A0A]/92 backdrop-blur-xl shadow-lg" : "bg-transparent"
    )}>
      <div className="brand-container flex h-14 items-center justify-between sm:h-16">
        <Logo priority />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === l.href ? "text-[var(--glitz-gold)]" : "text-white/80 hover:text-[var(--glitz-gold)]")}>{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="hidden items-center gap-2 text-sm text-[var(--glitz-gold)] lg:flex"><Phone className="h-4 w-4" />{SITE_CONFIG.phone}</a>
          <Link href="/book-event" className="rounded-lg bg-[var(--glitz-gold)] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] shadow-[var(--glitz-glow)] hover:bg-[var(--glitz-gold-light)]">Book Consultation</Link>
        </div>
        <button type="button" className="rounded-lg p-2 text-[var(--glitz-gold)] lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-[var(--glitz-border)] bg-[#0A0A0A]/98 backdrop-blur-xl lg:hidden">
          <nav className="brand-container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn("rounded-lg px-4 py-3 text-base", pathname === l.href ? "bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "text-white/90")}>{l.label}</Link>
            ))}
            <Link href="/book-event" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-[var(--glitz-gold)] py-3 text-center font-semibold text-[#0A0A0A]">Book Consultation</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
