import Link from "next/link";
import { altForSrc, assetForRole } from "@/brand/data/image-curation";
import { ConceptTag } from "@/components/ui/badge";
import { MediaFrame } from "@/components/ui/media-frame";
import type { CaseStudy } from "@/components/ui/types";
import { cn } from "@/lib/utils";

/** The standing honesty line (DESIGN.md Appendix). */
export const CONCEPT_LINE = "Illustrative concepts showing the scale we plan. Ask for references at your consultation.";

const CARD_SIZES = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw";

/** Venue *type* only — the data's venue strings are invented names (DESIGN.md §1.2). */
export function venueTypeOf(study: Pick<CaseStudy, "venue">): string {
  const venue = study.venue.toLowerCase();
  if (venue.includes("palace")) return "Heritage palace";
  if (venue.includes("ballroom")) return "Hotel ballroom";
  if (venue.includes("beach")) return "Beachfront";
  if (venue.includes("resort")) return "Resort";
  return "Venue on request";
}

/** "Heritage palace · 800 guests · 5 Days · ₹2.5 – 4 Cr" */
export function conceptSpecs(study: CaseStudy): string {
  return [venueTypeOf(study), `${study.guests.toLocaleString("en-IN")} guests`, study.timeline, study.budget].join(" · ");
}

export type ConceptCardProps = {
  study: CaseStudy;
  /** Wraps the photo in `<ViewTransition name="concept-{id}">` for the morph to the case cover. */
  viewTransition?: boolean;
  location?: string;
  className?: string;
};

/**
 * 3:2 photo, mandatory ConceptTag, category, Cormorant title, one-line story,
 * specs line. Concept cards never share a strip or grid with real photographs.
 */
export function ConceptCard({ study, viewTransition = true, location = "concepts", className }: ConceptCardProps) {
  const href = `/portfolio/${study.id}`;
  const asset = assetForRole(`concept-${study.id}`);
  const caption = `Illustrative concept · ${study.category}`;
  const name = viewTransition ? `concept-${study.id}` : undefined;
  return (
    <article className={cn("lux-concept", className)} data-tilt>
      {/* Duplicate target of the title link, kept out of the tab order. */}
      <Link href={href} prefetch={false} className="lux-concept__media" tabIndex={-1} aria-hidden="true">
        {asset ? (
          <MediaFrame asset={asset.id} ratio="3:2" sizes={CARD_SIZES} caption={caption} viewTransitionName={name} />
        ) : (
          <MediaFrame src={study.image} alt={altForSrc(study.image)} ratio="3:2" sizes={CARD_SIZES} caption={caption} viewTransitionName={name} />
        )}
      </Link>
      <div className="lux-concept__body">
        <div className="lux-concept__meta">
          <ConceptTag />
          <span className="lux-small">{study.category}</span>
        </div>
        <h3 className="lux-heading lux-heading--h3 lux-concept__title">
          <Link href={href} prefetch={false} data-cta={`concept_${study.id}`} data-cta-location={location}>
            {study.title}
          </Link>
        </h3>
        <p className="lux-concept__story">{study.story}</p>
        <p className="lux-concept__specs lux-small">{conceptSpecs(study)}</p>
      </div>
    </article>
  );
}

/** The standing line above any concept strip or page. */
export function ConceptBanner({ className }: { className?: string }) {
  return (
    <p className={cn("lux-concept-banner", className)}>
      <ConceptTag />
      <span>{CONCEPT_LINE}</span>
    </p>
  );
}
