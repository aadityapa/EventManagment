import { BRAND_TRUST, BRAND_AWARDS, BRAND_MEDIA, BRAND_STATS } from "@/brand/data/content";
import { Award, Shield, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const GOOGLE_REVIEWS_URL = "https://www.google.com/maps/search/?api=1&query=Glitz+Events+Pune+reviews";

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

      <div className="brand-container mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {BRAND_STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="brand-display text-2xl font-bold text-[var(--glitz-gold)]">
              {s.value.toLocaleString("en-IN")}
              {s.suffix}
            </p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="brand-container mb-6 flex flex-wrap justify-center gap-3">
        {BRAND_AWARDS.slice(0, 3).map((a) => (
          <div
            key={a.title}
            className="flex items-center gap-2 rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-card)] px-4 py-1.5 text-xs text-secondary"
          >
            <Award className="h-3.5 w-3.5 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
            <span>
              {a.title} · {a.year}
            </span>
          </div>
        ))}
        <Link
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-[var(--glitz-gold)]/30 px-4 py-1.5 text-xs font-semibold text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
        >
          Google Reviews <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
        <Link
          href="/testimonials"
          className="rounded-full border border-[var(--glitz-border)] px-4 py-1.5 text-xs font-semibold text-secondary transition-colors hover:border-[var(--glitz-gold)]/40"
        >
          Client Stories →
        </Link>
      </div>

      <div className="brand-container mb-6 flex flex-wrap justify-center gap-2">
        {BRAND_MEDIA.map((m) => (
          <span key={m} className="rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-card)] px-3 py-1 text-xs text-muted">
            As seen in {m}
          </span>
        ))}
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

      <p className="brand-container mt-4 text-center text-xs text-muted">
        {SITE_CONFIG.name} · Est. 2012 · {SITE_CONFIG.city}
      </p>
    </section>
  );
}
