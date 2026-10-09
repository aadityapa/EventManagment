import type { CurationAsset } from "@/brand/data/image-curation";
import { Lightbox, PhotoName } from "@/components/ui/lightbox";
import { MediaFrame } from "@/components/ui/media-frame";
import { cn } from "@/lib/utils";

type GalleryProps = {
  assets: CurationAsset[];
  /** Keep only assets whose category, service list or roles include this value (server-side). */
  filter?: string;
  className?: string;
};

const TILE_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
const WIDE_SIZES = "(min-width: 1024px) 66vw, 100vw";

/** `data-cat` for the in-page `:has()` filters (TabsRadio): "venues" | "weddings" | "celebrity" | "other". */
export function galleryCategory(asset: Pick<CurationAsset, "roles">): string {
  const roles = asset.roles as readonly string[];
  if (roles.includes("venue")) return "venues";
  if (roles.some((r) => r === "wedding" || r === "couple-moment" || r === "decor")) return "weddings";
  if (roles.includes("celebrity")) return "celebrity";
  return "other";
}

/**
 * 12-column photo grid with spans from curation (wide 8 / standard 4 / tall 4
 * at 3:4), assigned in DOM order — no `grid-auto-flow: dense`, so focus order
 * equals visual order. Tiles are `<a href="#photo-{id}">` pointing at their
 * own `id="photo-{id}"` tile, so the fragment exists without JS; the Lightbox
 * island upgrades them, and `PhotoName` lends the tile's name to the viewer.
 */
export function Gallery({ assets, filter, className }: GalleryProps) {
  const shown = filter
    ? assets.filter((a) => galleryCategory(a) === filter || a.service.includes(filter) || (a.roles as readonly string[]).includes(filter))
    : assets;
  if (!shown.length) return null;

  return (
    <Lightbox assets={shown.map(({ id, src, alt, caption, width, height }) => ({ id, src, alt, caption, width, height }))}>
      <ul className={cn("lux-gallery", className)}>
        {shown.map((a) => (
          <li key={a.id} id={`photo-${a.id}`} className={cn("lux-gallery__tile", `lux-gallery__tile--${a.span}`)} data-cat={galleryCategory(a)}>
            <a href={`#photo-${a.id}`} className="lux-gallery__link">
              <PhotoName id={a.id}>
                <MediaFrame
                  asset={a.id}
                  ratio={a.span === "tall" ? "3:4" : "3:2"}
                  sizes={a.span === "wide" ? WIDE_SIZES : TILE_SIZES}
                  className="lux-gallery__frame"
                />
              </PhotoName>
            </a>
          </li>
        ))}
      </ul>
    </Lightbox>
  );
}
