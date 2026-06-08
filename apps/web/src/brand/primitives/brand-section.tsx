import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BrandSection({ children, className, alt, id }: { children: ReactNode; className?: string; alt?: boolean; id?: string }) {
  return (
    <section id={id} className={cn("brand-section", alt ? "bg-[var(--glitz-surface)]" : "bg-[var(--glitz-bg)]", className)}>
      <div className="brand-container">{children}</div>
    </section>
  );
}

export function BrandHeader({ label, title, subtitle, center }: { label?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <header className={cn("mb-12 sm:mb-16", center && "mx-auto max-w-3xl text-center")}>
      {label && <span className="brand-label mb-3 block">{label}</span>}
      <h2 className="brand-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-[var(--glitz-muted)] sm:text-lg">{subtitle}</p>}
    </header>
  );
}
