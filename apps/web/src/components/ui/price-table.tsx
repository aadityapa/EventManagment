import Link from "next/link";
import type { CSSProperties } from "react";
import { BRAND_COLLECTION_ESSENTIALS, BRAND_INVESTMENTS, BRAND_PRICE_TAX_NOTE } from "@/brand/data/content";
import { ServiceIcon, UiIcon } from "@/components/icons";
import { Button } from "@/components/ui/lux-button";
import { services } from "@/data/cms";
import { cn, formatCurrency } from "@/lib/utils";

type Collection = {
  name: string;
  tagline?: string;
  from: string;
  featured?: boolean;
  narrative: string;
  includes: readonly string[];
};

type PriceTableProps = {
  collections?: readonly Collection[];
  /** Append the 12-row single-service ledger (icon · service · From ₹basePrice · link). */
  services?: boolean;
  /** `services` renders only the single-service ledger (its own chapter on /pricing); `collections` is the table. */
  variant?: "collections" | "services";
  /** `data-cta-location` on the service links. */
  location?: string;
  className?: string;
};

const SERVICES_BY_PRICE = [...services].sort((a, b) => a.basePrice - b.basePrice);

/** "The Signature Gala" → "signature-gala"; used for `/book-event?collection=`. */
export function collectionSlug(name: string): string {
  return name.toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Guest band from the collection narrative ("…of 50–150 guests…") so the table never invents a number. */
function guestBand(narrative: string): string {
  const match = narrative.match(/(\d[\d,]*\s*[–-]\s*\d[\d,]*|\d[\d,]*\+)\s*guests/i);
  return match ? match[1].replace(/\s+/g, "") : "On request";
}

/* Each cell carries its column/row so the container query can regroup the
   same table into one stacked card per collection under 640px. */
const cell = (c: number, r: number) => ({ "--c": c, "--r": r }) as CSSProperties;

/**
 * Three collections compared in a real `<table>`: From · Guests · the union
 * of `includes`, ticked only where a collection lists it (the lists in
 * content.ts are cumulative, so a higher tier never shows a lower tier's
 * service as missing). What every client gets is stated once, above the
 * table, instead of as a row of ticks. Featured column = gold top rule, no
 * badge, no toggle.
 */
export function PriceTable({
  collections = BRAND_INVESTMENTS,
  services: withServices = false,
  variant = "collections",
  location = "price-table",
  className,
}: PriceTableProps) {
  if (variant === "services") {
    return (
      <div className={cn("lux-pricetable", className)}>
        <ServicesLedger location={location} />
      </div>
    );
  }

  const includes = [...new Set(collections.flatMap((c) => c.includes))];
  const actionRow = includes.length + 3;
  const rowCount = actionRow + 1;

  return (
    <div className={cn("lux-pricetable", className)}>
      <div role="group" aria-labelledby="pricetable-essentials" className="lux-pricetable__essentials">
        <p id="pricetable-essentials" className="lux-pricetable__caption">Every collection includes</p>
        <dl className="lux-commit lux-commit--cover">
          {BRAND_COLLECTION_ESSENTIALS.map((item) => (
            <div key={item.id} className="lux-commit__cell">
              <dt>{item.term}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
      <table className="lux-pricetable__table" style={{ "--rows": rowCount } as CSSProperties}>
        <caption className="lux-pricetable__caption">Three collections from published starting prices; each includes everything in the one before it. {BRAND_PRICE_TAX_NOTE}.</caption>
        <thead>
          <tr>
            <th scope="col" className="lux-pricetable__label" style={cell(0, 0)}><span className="sr-only">Collection</span></th>
            {collections.map((c, i) => (
              <th key={c.name} scope="col" className="lux-pricetable__head" data-featured={c.featured ? "true" : undefined} style={cell(i + 1, 0)}>
                <span className="lux-pricetable__name">{c.name}</span>
                {c.tagline ? <span className="lux-pricetable__tagline">{c.tagline}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="lux-pricetable__label" style={cell(0, 1)}>From</th>
            {collections.map((c, i) => (
              <td key={c.name} className="lux-pricetable__from lux-price" data-label="From" style={cell(i + 1, 1)}>{c.from}</td>
            ))}
          </tr>
          <tr>
            <th scope="row" className="lux-pricetable__label" style={cell(0, 2)}>Guests</th>
            {collections.map((c, i) => (
              <td key={c.name} data-label="Guests" style={cell(i + 1, 2)}>{guestBand(c.narrative)}</td>
            ))}
          </tr>
          {includes.map((item, r) => (
            <tr key={item}>
              <th scope="row" className="lux-pricetable__label" style={cell(0, r + 3)}>{item}</th>
              {collections.map((c, i) => {
                const has = c.includes.includes(item);
                return (
                  <td key={c.name} data-label={item} data-included={has ? "true" : "false"} style={cell(i + 1, r + 3)}>
                    {has ? <span className="lux-pricetable__dot" aria-hidden="true" /> : <span className="lux-pricetable__dash" aria-hidden="true">—</span>}
                    <span className="sr-only">{has ? "Included" : "Not included"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th scope="row" className="lux-pricetable__label" style={cell(0, actionRow)}><span className="sr-only">Enquire</span></th>
            {collections.map((c, i) => (
              <td key={c.name} className="lux-pricetable__action" style={cell(i + 1, actionRow)}>
                <Button
                  variant={c.featured ? "primary" : "ghost"}
                  size="compact"
                  href={`/book-event?collection=${collectionSlug(c.name)}`}
                  cta={`pricing_${collectionSlug(c.name)}`}
                  location="price-table"
                >
                  Get a Free Proposal
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {withServices ? <ServicesLedger location={location} /> : null}
    </div>
  );
}

/** The 12 single services by starting price: icon · service · From ₹basePrice · link. */
function ServicesLedger({ location }: { location: string }) {
  return (
    <ul className="lux-pricetable__services" aria-label="Single services, starting prices">
      {SERVICES_BY_PRICE.map((s) => (
        <li key={s.slug} className="lux-pricetable__service">
          <span className="lux-pricetable__service-icon"><ServiceIcon name={s.slug} size={24} /></span>
          <span className="lux-pricetable__service-name">{s.title}</span>
          <span className="lux-pricetable__service-price">From {formatCurrency(s.basePrice)}</span>
          <Link href={`/services/${s.slug}`} className="lux-pricetable__service-link" data-cta={`pricing_service_${s.slug}`} data-cta-location={location}>
            View service
            <UiIcon name="arrow-right" size={20} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
