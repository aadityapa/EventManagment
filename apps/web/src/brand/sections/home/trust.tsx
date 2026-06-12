import { BRAND_TRUST } from "@/brand/data/content";
import { Star } from "lucide-react";

export function HomeTrust() {
  const items = [...BRAND_TRUST, ...BRAND_TRUST];
  return (
    <section className="border-y border-[var(--glitz-border)] bg-[var(--glitz-surface)] py-8" aria-label="Trusted by leading brands and venues">
      <div className="brand-container mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
        <p className="brand-label">Trusted By Industry Leaders</p>
        <div className="flex items-center gap-1 text-xs text-muted" aria-label="4.9 out of 5 stars from 500+ clients">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" aria-hidden="true" />
          ))}
          <span className="ml-1 font-semibold text-primary">4.9</span>
          <span>from 500+ clients</span>
        </div>
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
