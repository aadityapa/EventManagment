import Link from "next/link";
import type { CSSProperties } from "react";
import { BRAND_SERVICE_CATEGORIES } from "@/brand/data/content";
import { assetForRole, driveUrl } from "@/brand/data/image-curation";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { ServiceIcon, UiIcon } from "@/components/icons";
import type { ServiceSlug } from "@/components/ui/types";
import { ViewTransition } from "@/components/ui/view-transition";
import { services } from "@/data/cms";
import { cn, formatCurrency } from "@/lib/utils";

/** The three editorial groups of the index; also the canonical order of the twelve services. */
export const SERVICE_GROUPS = [
  { id: "celebrations", label: "Celebrations", slugs: ["wedding-planning", "destination-weddings", "birthday-events"] },
  { id: "corporate", label: "Corporate & brand", slugs: ["corporate-events", "conferences", "product-launches", "brand-promotions", "exhibitions"] },
  { id: "production", label: "Production & talent", slugs: ["event-production", "concert-management", "fashion-shows", "celebrity-management"] },
] as const satisfies ReadonlyArray<{ id: string; label: string; slugs: readonly ServiceSlug[] }>;

type GroupId = (typeof SERVICE_GROUPS)[number]["id"];

type ServicesIndexProps = {
  items: ServiceSlug[] | "all";
  /** `full` = numeral · icon · title · narrative · price; `compact`/`related` drop the narrative. */
  variant?: "full" | "compact" | "related";
  /** Hairline sub-heads: Celebrations / Corporate & brand / Production & talent. */
  grouped?: boolean;
  /** Sticky 4:5 frame images (≥ 1024 only): one per group (home) or one per row (/services). */
  frame?: "none" | "groups" | "all";
  /** `data-cta-location` for the row links. */
  location?: string;
  className?: string;
};

type Row = { slug: ServiceSlug; title: string; basePrice: number; narrative?: string; group: GroupId };

const groupOf = (slug: string): GroupId =>
  SERVICE_GROUPS.find((g) => (g.slugs as readonly string[]).includes(slug))?.id ?? "production";

/** Curated cover first; the ≤ 828px Drive variant otherwise; the legacy image map when curation has no entry. */
function frameSrc(slug: string): { src: string; focal?: string } {
  const asset = assetForRole(`service-cover-${slug}`) ?? assetForRole(`index-frame-${slug}`);
  if (asset) {
    return {
      src: asset.local ? `${asset.local}-768.webp` : driveUrl(asset.id, 828),
      focal: `${Math.round(asset.focal.x * 100)}% ${Math.round(asset.focal.y * 100)}%`,
    };
  }
  const category = BRAND_SERVICE_CATEGORIES.find((c) => c.slug === slug);
  return { src: category?.image ?? BRAND_IMAGES.hero.poster };
}

function resolveRows(items: ServicesIndexProps["items"], withNarrative: boolean): Row[] {
  const order: readonly string[] = items === "all" ? SERVICE_GROUPS.flatMap((g) => g.slugs) : items;
  return order.flatMap((slug) => {
    const service = services.find((s) => s.slug === slug);
    if (!service) return [];
    const narrative = withNarrative ? BRAND_SERVICE_CATEGORIES.find((c) => c.slug === slug)?.narrative : undefined;
    return [{ slug: service.slug, title: service.title, basePrice: service.basePrice, narrative, group: groupOf(slug) }];
  });
}

/**
 * The services index: hairline rows with a sticky photo frame on desktop
 * (swapped by `:has()` in primitives-complex.css — no JS), 2-up
 * icon-and-price cards on phones. Rows are plain links.
 */
export function ServicesIndex({ items, variant = "full", grouped = false, frame = "none", location = "services-index", className }: ServicesIndexProps) {
  const rows = resolveRows(items, variant === "full");
  if (!rows.length) return null;

  const groups = grouped
    ? SERVICE_GROUPS.map((g) => ({ ...g, rows: rows.filter((r) => r.group === g.id) })).filter((g) => g.rows.length)
    : [{ id: undefined, label: undefined, rows }];

  // Frame images: `data-slug` (one per row) or `data-group` (first row of each group present); only the first is opaque.
  const frames =
    frame === "all"
      ? rows.map((r) => ({ key: r.slug, attrs: { "data-slug": r.slug }, ...frameSrc(r.slug) }))
      : frame === "groups"
        ? SERVICE_GROUPS.flatMap((g) => {
            const first = rows.find((r) => r.group === g.id);
            return first ? [{ key: g.id, attrs: { "data-group": g.id }, ...frameSrc(first.slug) }] : [];
          })
        : [];

  let n = 0;
  return (
    <div className={cn("lux-index", "lux-index--cards", `lux-index--${variant}`, frames.length && "lux-index--framed", className)}>
      <div className="lux-index__rows">
        {groups.map((g) => (
          <div key={g.id ?? "all"} className="lux-index__section">
            {g.label ? <p className="lux-index__group lux-label lux-label--rule-leading">{g.label}</p> : null}
            <ol className="lux-index__list" role="list">
              {g.rows.map((row) => {
                const index = ++n;
                return (
                  <li
                    key={row.slug}
                    className="lux-index__row lux-reveal"
                    data-slug={row.slug}
                    data-group={row.group}
                    style={{ "--i": index - 1 } as CSSProperties}
                  >
                    <Link href={`/services/${row.slug}`} className="lux-index__link" data-tilt="soft" data-cta={`index_${row.slug}`} data-cta-location={location}>
                      <span className="lux-index__num" aria-hidden="true">{String(index).padStart(2, "0")}</span>
                      <span className="lux-index__icon"><ServiceIcon name={row.slug} size={24} /></span>
                      <h3 className="lux-index__title">
                        <ViewTransition name={`service-title-${row.slug}`}>
                          <span>{row.title}</span>
                        </ViewTransition>
                      </h3>
                      {row.narrative ? <p className="lux-index__narrative">{row.narrative}</p> : null}
                      <span className="lux-index__price">From {formatCurrency(row.basePrice)}</span>
                      <span className="lux-index__arrow" aria-hidden="true"><UiIcon name="arrow-right" size={20} /></span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
      {frames.length ? (
        <div className="lux-index__frame" aria-hidden="true" data-tilt="soft" data-tilt-glare="off">
          {frames.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element -- decorative, lazy, ≤ 828px; plain <img> keeps the 12 frames hydration-free
            <img key={f.key} src={f.src} alt="" loading="lazy" decoding="async" style={f.focal ? { objectPosition: f.focal } : undefined} {...f.attrs} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
