import { BRAND_TRUST } from "@/brand/data/content";

export function HomeTrust() {
  const items = [...BRAND_TRUST, ...BRAND_TRUST];
  return (
    <section className="border-y border-[var(--glitz-border)] bg-[var(--glitz-surface)] py-8" aria-label="Trusted by">
      <p className="brand-container mb-4 text-center brand-label">Trusted By Industry Leaders</p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--glitz-surface)] to-transparent" />
        <div className="pointer-events-none absolute right-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--glitz-surface)] to-transparent" />
        <div className="brand-marquee gap-14 px-6">
          {items.map((name, i) => (
            <span key={`${name}-${i}`} className="flex shrink-0 items-center gap-3 whitespace-nowrap brand-display text-sm text-white/60 sm:text-base">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--glitz-gold)]" />{name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
