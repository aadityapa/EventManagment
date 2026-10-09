import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { assetById, assetForRole, localSources, type CurationAsset } from "@/brand/data/image-curation";
import { BrandImage } from "@/brand/primitives/brand-image";
import type { CurationId, Focal, Ratio } from "@/components/ui/types";
import { ViewTransition } from "@/components/ui/view-transition";
import { cn } from "@/lib/utils";

export type MediaFrameProps = {
  /** Curated photo id — src, alt, size, focal and caption come from image-curation.ts. */
  asset?: CurationId;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  ratio: Ratio;
  sizes: string;
  /** LCP only. Honoured with local WebP sources; a Drive URL is never preloaded. */
  priority?: boolean;
  focal?: Focal;
  /** Caption beneath the image; `false` suppresses the curated caption. */
  caption?: string | false;
  /** Right-hand folio in the caption bar, e.g. "No. 034". */
  index?: string;
  /** 1px inset gold hairline ("gilt frame"): covers, the sticky index frame, diptychs. */
  frame?: boolean;
  viewTransitionName?: string;
  /**
   * V7 scroll parallax inside the box (image drifts ±6% at 1.14 scale). Default
   * on for every non-priority frame; the LCP cover and spreads keep their settle.
   */
  depth?: boolean;
  /** V7 pointer tilt on the whole figure (`soft` = 4°). */
  tilt?: boolean | "soft";
  className?: string;
};

const RATIO_CLASS: Record<Ratio, string> = {
  "3:2": "lux-frame--3-2",
  "4:5": "lux-frame--4-5",
  "3:4": "lux-frame--3-4",
  "1:1": "lux-frame--1-1",
  "21:9": "lux-frame--21-9",
  "16:10": "lux-frame--16-10",
  "4:3": "lux-frame--4-3",
};

/** The curated asset for an id; throws so a bad id fails at render, not silently. */
export function resolveAsset(id: CurationId): CurationAsset {
  const asset = assetById(id);
  if (!asset) throw new Error(`MediaFrame: unknown curation id "${id}"`);
  return asset;
}

/** Cover photos must be local WebP: when an export slipped, fall back to the home cover. */
export function resolveCoverAsset(id: CurationId): CurationAsset {
  const asset = resolveAsset(id);
  if (asset.local) return asset;
  const home = assetForRole("cover-home");
  return home?.local ? home : asset;
}

export function focalToObjectPosition(focal?: Focal): string | undefined {
  return focal ? `${Math.round(focal.x * 100)}% ${Math.round(focal.y * 100)}%` : undefined;
}

/**
 * Local WebP set for a frame, or undefined to serve the Drive photo.
 * The 768w export is a 4:5 focal crop (scripts/export-covers.mjs) while the
 * 1280w/1920w exports are the uncropped frame — so:
 *  - 4:5 frames use all three widths;
 *  - any other ratio must never be fed the portrait crop: an LCP frame keeps
 *    the local full frames (a Drive URL is never preloaded), everything else
 *    goes through next/image on the Drive original, which sizes it properly.
 */
function localFrameSources(asset: CurationAsset, ratio: Ratio, priority: boolean) {
  const set = localSources(asset);
  if (!set || ratio === "4:5") return set;
  if (!priority || !asset.local) return undefined;
  return { src: `${asset.local}-1920.webp`, srcSet: `${asset.local}-1280.webp 1280w, ${asset.local}-1920.webp 1920w` };
}

export function MediaFrame({
  asset,
  src,
  alt,
  width,
  height,
  ratio,
  sizes,
  priority = false,
  focal,
  caption,
  index,
  frame = false,
  viewTransitionName,
  depth,
  tilt,
  className,
}: MediaFrameProps) {
  const curated = asset ? resolveAsset(asset) : undefined;
  const imgSrc = src ?? curated?.src;
  if (!imgSrc) throw new Error("MediaFrame: pass `asset` or `src`");
  const imgAlt = alt ?? curated?.alt ?? "";
  const text = caption === false ? undefined : (caption ?? curated?.caption);
  const style: CSSProperties | undefined = (() => {
    const objectPosition = focalToObjectPosition(focal ?? curated?.focal);
    return objectPosition ? { objectPosition } : undefined;
  })();
  const local = curated ? localFrameSources(curated, ratio, priority) : undefined;

  let img;
  if (local) {
    // Pre-exported WebP set: a plain <img> keeps the LCP request off the optimizer round-trip.
    if (priority) preload(local.src, { as: "image", imageSrcSet: local.srcSet, imageSizes: sizes, fetchPriority: "high" });
    img = (
      // eslint-disable-next-line @next/next/no-img-element -- sized local WebP set with its own srcset; nothing to optimise
      <img
        src={local.src}
        srcSet={local.srcSet}
        sizes={sizes}
        alt={imgAlt}
        width={width ?? curated?.width}
        height={height ?? curated?.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        style={style}
      />
    );
  } else {
    // Drive photos go through next/image; `priority` is deliberately not forwarded (never a preloaded lh3 URL).
    img = (
      <BrandImage
        src={imgSrc}
        alt={imgAlt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "auto" : "low"}
        blurDataURL={curated?.blur}
        style={style}
      />
    );
  }

  const box = <div className="lux-frame__box">{img}</div>;

  return (
    <figure
      className={cn("lux-frame", RATIO_CLASS[ratio], frame && "lux-frame--gilt", (depth ?? !priority) && "lux-frame--depth", className)}
      data-tilt={tilt === "soft" ? "soft" : tilt ? "" : undefined}
    >
      {viewTransitionName ? <ViewTransition name={viewTransitionName}>{box}</ViewTransition> : box}
      {text || index ? (
        <figcaption className="lux-caption">
          <span>{text}</span>
          {index ? <span className="lux-caption__index">{index}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
