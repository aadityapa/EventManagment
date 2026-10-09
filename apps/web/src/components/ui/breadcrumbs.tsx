import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import type { BreadcrumbItem } from "@/components/ui/types";
import { breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** On every inner route: gold "·" separators, middle items truncated on phones, last item `aria-current`. */
export function Breadcrumbs({ items, schema = false, className }: { items: BreadcrumbItem[]; schema?: boolean; className?: string }) {
  if (items.length === 0) return null;
  return (
    <>
      {schema ? <JsonLd data={breadcrumbSchema(items.map((item) => ({ name: item.name, url: item.href })))} /> : null}
      <nav aria-label="Breadcrumb" className={cn("lux-crumbs", className)}>
        <ol>
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${item.href}-${i}`}>
                <Link href={item.href} prefetch={false} aria-current={last ? "page" : undefined}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
