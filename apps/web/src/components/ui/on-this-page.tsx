import { DetailsOpenAtDesktop } from "@/components/ui/details-open-at-desktop";
import { cn } from "@/lib/utils";

/**
 * Plain sticky contents list (articles, legal, FAQs). A `<details>` on phones;
 * the island opens it at ≥ 1024. No progress marker, no observer — the target
 * heading is the only "current" signal.
 */
export function OnThisPage({ items, label = "On this page", className }: { items: { href: string; label: string }[]; label?: string; className?: string }) {
  return (
    <nav aria-label={label} className={cn("lux-contents", className)}>
      <DetailsOpenAtDesktop>
        <details data-group="contents">
          <summary>{label}</summary>
          <ol>
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ol>
        </details>
      </DetailsOpenAtDesktop>
    </nav>
  );
}
