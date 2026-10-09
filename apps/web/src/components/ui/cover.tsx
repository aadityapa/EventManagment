import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Commitments } from "@/components/ui/commitments";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/lux-button";
import { MediaFrame, resolveCoverAsset } from "@/components/ui/media-frame";
import { Scene3D } from "@/components/three/scene-host";
import type { BreadcrumbItem, CurationId } from "@/components/ui/types";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** The one primary label site-wide (DESIGN.md Appendix). */
export const PRIMARY_CTA_LABEL = "Get a Free Proposal";
export const ENTITY_LINE = `${SITE_CONFIG.legalName} · Delivery & Coordination Office — Pune`;
/** The H1's id; every cover labels its section with it. */
export const PAGE_TITLE_ID = "page-title";

export type CoverProps = {
  eyebrow: string;
  title: ReactNode;
  /** The one purple accent word in the H1. */
  titleAccent?: string;
  lead: ReactNode;
  primary: { href: string; label?: string; cta: string };
  secondary?: { href: string; label: string; cta: string; external?: boolean };
  /** Cover photo (`cover-*` / `service-cover-*` role); must be a local export — falls back to `cover-home`. */
  asset?: CurationId;
  commitments?: boolean;
  entityLine?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  /** `xl` home H1, `l` page H1, `text` = no photo. */
  size?: "xl" | "l" | "text";
  /** e.g. the 48px `ServiceIcon` with ring. */
  icon?: ReactNode;
  /** e.g. "03 / 12". */
  folio?: string;
  /** e.g. "From ₹8,00,000" — always from data via formatCurrency. */
  priceLine?: string;
  /** Wraps the H1 in `<ViewTransition name>`. */
  viewTransitionName?: string;
  /** Wraps the cover photo in `<ViewTransition name>` — e.g. `concept-{id}` for the card → case page morph. */
  mediaViewTransitionName?: string;
  className?: string;
};

/**
 * The split cover. DOM order is the phone order: breadcrumbs → eyebrow → H1 →
 * lead → CTAs → commitments → photo → entity line, so the offer sits in the
 * first screen. At ≥ 1024 the text takes cols 1–6 and the photo bleeds from
 * col 7 to the page edge; text never overlays the photo.
 */
export function Cover({
  eyebrow,
  title,
  titleAccent,
  lead,
  primary,
  secondary,
  asset,
  commitments = false,
  entityLine = false,
  breadcrumbs,
  size = "l",
  icon,
  folio,
  priceLine,
  viewTransitionName,
  mediaViewTransitionName,
  className,
}: CoverProps) {
  const photo = size !== "text" && asset ? resolveCoverAsset(asset) : undefined;
  return (
    <section
      className={cn("lux-cover lux-bleed", size === "text" && "lux-cover--text", size === "xl" && "lux-cover--xl", className)}
      aria-labelledby={PAGE_TITLE_ID}
    >
      {/* V7: 3D layer behind the copy (hero particles + coin on the home cover, dust elsewhere); CSS glow fallback. */}
      <Scene3D variant={size === "xl" ? "hero" : "dust"} intensity={size === "xl" ? 1 : 0.6} className="lux-cover__scene" />
      <div className="lux-cover__text">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} schema className="lux-cover__crumbs" /> : null}
        {folio ? (
          <span className="lux-folio" aria-hidden="true">
            {folio}
          </span>
        ) : null}
        {icon ? <span className="lux-cover__icon">{icon}</span> : null}
        <Eyebrow rule="leading">{eyebrow}</Eyebrow>
        <Heading as="h1" size={size === "xl" ? "display-xl" : "display"} id={PAGE_TITLE_ID} accent={titleAccent} viewTransitionName={viewTransitionName}>
          {title}
        </Heading>
        <p className="lux-lead">{lead}</p>
        {priceLine ? <p className="lux-price lux-cover__price">{priceLine}</p> : null}
        <div className="lux-cover__actions">
          <Button variant="primary" href={primary.href} cta={primary.cta} location="cover" arrow>
            {primary.label ?? PRIMARY_CTA_LABEL}
          </Button>
          {secondary ? (
            <Button variant="text" href={secondary.href} cta={secondary.cta} location="cover" external={secondary.external}>
              {secondary.label}
            </Button>
          ) : null}
        </div>
        {commitments ? <Commitments variant="cover" /> : null}
      </div>
      {photo ? (
        <div className="lux-cover__media" data-tilt="soft">
          <span className="lux-cover__depth" aria-hidden="true" />
          <MediaFrame
            asset={photo.id}
            ratio="4:5"
            sizes="(min-width:1024px) 50vw, 100vw"
            priority
            frame
            viewTransitionName={mediaViewTransitionName}
          />
        </div>
      ) : null}
      {entityLine ? <p className="lux-cover__entity lux-small">{ENTITY_LINE}</p> : null}
    </section>
  );
}
