import { BRAND_TRUST, BRAND_AWARDS } from "@/brand/data/content";
import { Award, Shield, Star } from "lucide-react";
import Link from "next/link";

export function HomeTrust() {
  const items = [...BRAND_TRUST, ...BRAND_TRUST];
  return (
    <section className="border-y border-[var(--glitz-border)] bg-[var(--glitz-surface)] py-8" aria-label="Trusted by leading brands and venues">
      <div className="brand-container mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
        <p className="brand-label">Trusted By Industry Leaders</p>
        <div className="flex items-center gap-1 text-xs text-muted" aria-label="4.9 out of 5 stars from 500+ clients">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" aria-hidden="true" />
          ))}
          <span className="ml-1 font-semibold text-primary">4.9</span>
          <span>from 500+ clients</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Shield className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
          <span>ISO-aligned processes</span>
        </div>
      </div>

      <div className="brand-container mb-6 flex flex-wrap justify-center gap-3">
        {BRAND_AWARDS.slice(0, 3).map((a) => (
          <div
            key={a.title}
            className="flex items-center gap-2 rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-card)] px-4 py-1.5 text-xs text-secondary"
          >
            <Award className="h-3.5 w-3.5 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
            <span>{a.title} · {a.year}</span>
          </div>
        ))}
        <Link
          href="/testimonials"
          className="rounded-full border border-[var(--glitz-gold)]/30 px-4 py-1.5 text-xs font-semibold text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
        >
          Read Client Reviews →
        </Link>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--glitz-surface)] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--glitz-surface)] to-transparent" aria-hidden="true" />
        <div className="brand-marquee gap-14 px-6">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-3 whitespace-nowrap brand-display text-sm text-muted sm:text-base"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--glitz-gold)]" aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
