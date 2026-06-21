import type { ReactNode } from "react";

type GeoFactsBlockProps = {
  title?: string;
  facts: Array<{ label: string; value: string }>;
  children?: ReactNode;
};

/** V5 SEO — at-a-glance entity facts for chapters and local pages. */
export function GeoFactsBlock({ title = "At a glance", facts, children }: GeoFactsBlockProps) {
  return (
    <aside
      className="v5-glass-commission rounded-[var(--v4-radius-lg)] border border-[var(--v4-glass-border)] p-6"
      aria-label={title}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--glitz-gold)]">{title}</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-[var(--text-muted)]">{f.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{f.value}</dd>
          </div>
        ))}
      </dl>
      {children}
    </aside>
  );
}
