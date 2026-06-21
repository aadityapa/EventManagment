import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import type { ContextualLink } from "@/lib/wedding-internal-links";

interface ContextualLinksBlockProps {
  title?: string;
  links: ContextualLink[];
  className?: string;
}

/** Contextual related links — not generic blog/service carousels */
export function ContextualLinksBlock({
  title = "Related Pages",
  links,
  className,
}: ContextualLinksBlockProps) {
  if (links.length === 0) return null;

  return (
    <aside className={className} aria-label={title}>
      <span className="v4-kicker mb-4">{title}</span>
      <h2 className="v4-title text-xl">{title}</h2>
      <ul className="mt-6 space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group block rounded-[var(--v4-radius-lg)] transition-transform hover:-translate-y-0.5"
            >
              <GlassPanel liquid={false} className="flex items-start gap-3 p-4">
                <ArrowRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glitz-gold)] opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-display font-medium group-hover:text-[var(--glitz-gold)]">
                    {link.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{link.description}</p>
                </div>
              </GlassPanel>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
