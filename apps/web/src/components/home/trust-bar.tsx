"use client";

import { partners } from "@/data/cms";

const LOGOS = [
  ...partners,
  "JW Marriott",
  "Four Seasons",
  "Taj Hotels",
  "Oberoi",
  "Hyatt Regency",
];

export function TrustBar() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <section
      className="border-y border-border/60 bg-card py-8"
      aria-label="Trusted by leading brands"
    >
      <div className="container-page mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Trusted By Industry Leaders
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-card to-transparent sm:w-24" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-card to-transparent sm:w-24" />
        <div className="marquee-track gap-12 px-6">
          {items.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-3 px-4"
            >
              <span className="h-2 w-2 rounded-full bg-primary/60" aria-hidden />
              <span className="whitespace-nowrap font-display text-sm font-medium tracking-wide text-foreground/70 sm:text-base">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
