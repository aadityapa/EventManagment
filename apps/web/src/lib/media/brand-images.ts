import fs from "node:fs/promises";
import path from "node:path";
import type { MediaAsset } from "./types";
import { COMING_SOON_IMAGES, isComingSoonImage } from "./placeholders";
import {
  altForSrc,
  curatedIds,
  curationFor,
  curationGroup,
  driveIdFromSrc,
  focalForSrc,
  type CuratedQuery,
  type ImageRole,
  type ImageScene,
} from "../../brand/data/image-curation";

export type BrandImageMap = {
  hero: {
    video: string;
    poster: string;
    wedding: string;
    corporate: string;
    palace: string;
  };
  weddings: string[];
  corporate: string[];
  destinations: string[];
  venues: string[];
  vendors: string[];
  gallery: string[];
  blog: string[];
  contact: string;
  about: string;
  catering: string;
  decor: string;
  awards: string;
  testimonials: string[];
};

export type GeneratedHeroSlide = {
  category: string;
  video: string;
  poster: string;
  alt: string;
  /** CSS object-position from the curation layer. */
  focal: string;
};

/** Labels for uncurated fallback slides (folder scan only). */
const VENUE_HERO_CATEGORIES = [
  "Grand Ballroom",
  "Palace Estate",
  "Luxury Venue",
  "Heritage Hall",
  "Garden Pavilion",
  "Convention Suite",
] as const;

/** Hero slide label per curated scene. */
const SCENE_LABELS: Record<ImageScene, string> = {
  "entrance-pathway": "Grand Entrance",
  "reception-stage": "Reception Stage",
  "garden-outdoor": "Poolside Celebration",
  "stage-av": "Stage Production",
  "couple-moment": "Couple Moment",
  "venue-interior": "Grand Ballroom",
  "venue-exterior": "Venue Façade",
  "floral-decor": "Floral Design",
  "lounge-seating": "Lounge Styling",
  "mandap-ceremony": "Ceremony Stage",
  "detail-closeup": "Signature Details",
  "guests-crowd": "Celebration",
  other: "Luxury Event",
};

function byFolder(assets: MediaAsset[]): Record<string, MediaAsset[]> {
  const map: Record<string, MediaAsset[]> = {};
  for (const asset of assets) {
    if (!map[asset.folder]) map[asset.folder] = [];
    map[asset.folder].push(asset);
  }
  return map;
}

function pickMany(assets: MediaAsset[] | undefined, limit = 6): string[] {
  if (!assets?.length) return [];
  return assets.slice(0, limit).map((a) => a.src);
}

function uniqueRealSources(...groups: Array<Array<string | undefined>>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const group of groups) {
    for (const src of group) {
      if (!src || isComingSoonImage(src) || seen.has(src)) continue;
      seen.add(src);
      result.push(src);
    }
  }

  return result;
}

function fillWithRealImages(
  preferred: string[],
  fallbackPool: string[],
  count: number,
  absoluteFallback: string = COMING_SOON_IMAGES.generic
): string[] {
  const filled = uniqueRealSources(preferred, fallbackPool);
  if (!filled.length) return Array.from({ length: count }, () => absoluteFallback);

  const result = [...filled];
  let cursor = 0;
  while (result.length < count) {
    result.push(filled[cursor % filled.length]);
    cursor += 1;
  }
  return result.slice(0, count);
}

function pickRealImage(preferred: string[], fallbackPool: string[], index = 0): string {
  const pool = uniqueRealSources(preferred, fallbackPool);
  return pool[index % pool.length] ?? COMING_SOON_IMAGES.generic;
}

type CuratedPick = { id: string; src: string };

/**
 * Hands out curated photos slot by slot. Every pick marks its duplicate
 * group as used so the next slot prefers a photo the visitor has not seen
 * yet; a slot only falls back to reuse when its roles run dry. Only photos
 * that are actually in the synced manifest are eligible, so an entry in the
 * curation file for a photo Drive no longer has can never produce a 404.
 */
class CuratedAllocator {
  private readonly srcById = new Map<string, string>();
  private readonly used = new Set<string>();

  constructor(assets: MediaAsset[]) {
    for (const asset of assets) {
      if (asset.type !== "image" || isComingSoonImage(asset.src)) continue;
      const id = driveIdFromSrc(asset.src);
      if (id && curationFor(id) && !this.srcById.has(id)) this.srcById.set(id, asset.src);
    }
  }

  /** Candidate IDs in priority order: first role's best → last role's worst. */
  private candidates(roles: ImageRole[], query: CuratedQuery): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const role of roles) {
      for (const id of curatedIds(role, query)) {
        if (seen.has(id) || !this.srcById.has(id)) continue;
        seen.add(id);
        out.push(id);
      }
    }
    return out;
  }

  pick(roles: ImageRole[], count: number, query: CuratedQuery = {}, reuse = false): CuratedPick[] {
    const candidates = this.candidates(roles, query);
    const chosen: CuratedPick[] = [];
    const groups = new Set<string>();

    const add = (id: string) => {
      const src = this.srcById.get(id);
      if (!src) return;
      const group = curationGroup(id);
      groups.add(group);
      this.used.add(group);
      chosen.push({ id, src });
    };

    // Pass 1 — unseen photos only (unless the slot explicitly allows reuse).
    for (const id of candidates) {
      if (chosen.length >= count) break;
      const group = curationGroup(id);
      if (groups.has(group) || (!reuse && this.used.has(group))) continue;
      add(id);
    }
    // Pass 2 — the roles ran dry; allow photos other slots already show.
    for (const id of candidates) {
      if (chosen.length >= count) break;
      if (groups.has(curationGroup(id))) continue;
      add(id);
    }
    return chosen;
  }

  take(roles: ImageRole[], count: number, query: CuratedQuery = {}, reuse = false): string[] {
    return this.pick(roles, count, query, reuse).map((p) => p.src);
  }

  takeOne(roles: ImageRole[], query: CuratedQuery = {}): string | undefined {
    return this.take(roles, 1, query)[0];
  }
}

/**
 * Build the site-wide image map. Curated roles win every slot (quality
 * desc, de-duplicated across slots, no prominent faces where the photo sits
 * behind copy); the folder-based picks only fill what curation cannot.
 */
export function buildBrandImageMap(assets: MediaAsset[]): BrandImageMap {
  const folders = byFolder(assets);
  const weddings = folders.weddings ?? [];
  const venues = folders.venues ?? [];
  const gallery = folders.gallery ?? [];
  const celebrity = folders.celebrity ?? [];
  const corporate = folders.corporate ?? [];
  const destination = folders.destination ?? [];

  const venueSrcs = pickMany(venues, 12);
  const weddingSrcs = pickMany(weddings, 8);
  const gallerySrcs = gallery.map((a) => a.src);
  const corporateSrcs = pickMany(corporate, 6);
  const destinationSrcs = pickMany(destination, 6);
  const realFallbackPool = uniqueRealSources(
    venueSrcs,
    gallerySrcs,
    weddingSrcs,
    corporateSrcs,
    destinationSrcs,
    pickMany(celebrity, 6)
  );

  const curated = new CuratedAllocator(assets);

  // Allocation order matters: the slots that sit behind headline copy pick first.
  const heroPoster =
    curated.takeOne(["hero"], {
      orientation: "landscape",
      excludeFaces: true,
      textSafe: true,
      minQuality: 4,
    }) ?? pickRealImage(venueSrcs, realFallbackPool);
  const heroWedding =
    curated.takeOne(["wedding", "reception-stage", "couple-moment"], {
      orientation: "landscape",
      preferNoFaces: true,
      minQuality: 4,
    }) ?? pickRealImage(weddingSrcs, realFallbackPool, 1);
  const heroCorporate =
    curated.takeOne(["corporate-like", "conference-like", "stage-av"], {
      orientation: "landscape",
      preferNoFaces: true,
    }) ?? pickRealImage(corporateSrcs, realFallbackPool, 2);
  const heroPalace =
    curated.takeOne(["venue", "reception-stage"], { preferNoFaces: true }) ??
    pickRealImage(venueSrcs, realFallbackPool, 3);
  const about =
    curated.takeOne(["about", "hero", "venue"], { excludeFaces: true, minQuality: 4 }) ??
    pickRealImage(weddingSrcs, realFallbackPool, 1);
  const contact =
    curated.takeOne(["contact", "venue", "entrance-pathway"], { excludeFaces: true }) ??
    pickRealImage(venueSrcs, realFallbackPool, 1);

  const weddingPicks = curated.take(["wedding", "couple-moment"], 6);
  const corporatePicks = curated.take(
    ["corporate-like", "conference-like", "launch-like", "stage-av", "production"],
    4,
    { preferNoFaces: true }
  );
  const destinationPicks = curated.take(["destination"], 4);
  const venuePicks = curated.take(
    ["venue", "reception-stage", "lounge-seating", "entrance-pathway"],
    8,
    { preferNoFaces: true }
  );
  const vendorPicks = curated.take(["decor", "catering", "production", "lounge-seating"], 4, {
    excludeFaces: true,
  });
  const blogPicks = curated.take(["blog", "detail-closeup", "decor"], 3, { excludeFaces: true });
  const catering =
    curated.takeOne(["catering", "lounge-seating", "decor"], { minQuality: 2 }) ??
    pickRealImage(gallerySrcs, realFallbackPool, 2);
  const decor =
    curated.takeOne(["decor"], { excludeFaces: true, minQuality: 4 }) ??
    pickRealImage(weddingSrcs, realFallbackPool, 2);
  const awards =
    curated.takeOne(["stage-av", "production", "concert-like"], {
      preferNoFaces: true,
      minQuality: 4,
    }) ?? pickRealImage(gallerySrcs, realFallbackPool, 3);
  const testimonialPicks = curated.take(["couple-moment", "wedding"], 3);
  // The gallery is the one place reuse is welcome — it is a best-of, not a new angle.
  const galleryPicks = curated.take(["gallery"], 12, {}, true);

  return {
    hero: {
      video: "",
      poster: heroPoster,
      wedding: heroWedding,
      corporate: heroCorporate,
      palace: heroPalace,
    },
    weddings: fillWithRealImages(
      [...weddingPicks, ...weddingSrcs],
      realFallbackPool,
      6,
      COMING_SOON_IMAGES.wedding
    ),
    corporate: fillWithRealImages(
      [...corporatePicks, ...corporateSrcs],
      realFallbackPool,
      4,
      COMING_SOON_IMAGES.corporate
    ),
    destinations: fillWithRealImages(
      [...destinationPicks, ...destinationSrcs],
      realFallbackPool,
      4,
      COMING_SOON_IMAGES.destination
    ),
    venues: fillWithRealImages([...venuePicks, ...venueSrcs], realFallbackPool, 8),
    vendors: fillWithRealImages([...vendorPicks, ...pickMany(gallery, 5)], realFallbackPool, 4),
    gallery: fillWithRealImages(
      [...galleryPicks, ...gallerySrcs],
      realFallbackPool,
      12,
      COMING_SOON_IMAGES.portfolio
    ),
    blog: fillWithRealImages([...blogPicks, ...pickMany(gallery, 3)], realFallbackPool, 3),
    contact,
    about,
    catering,
    decor,
    awards,
    testimonials: fillWithRealImages(
      [...testimonialPicks, ...weddingSrcs.slice(0, 3)],
      realFallbackPool,
      3
    ),
  };
}

/**
 * Homepage hero carousel — curated landscape "hero" photos with a text-safe
 * area, best first and never two frames of the same set-up. Folder picks top
 * up only when curation yields fewer than six.
 */
export function buildHeroSlidesFromMedia(assets: MediaAsset[], limit = 8): GeneratedHeroSlide[] {
  const curated = new CuratedAllocator(assets);
  const slides: GeneratedHeroSlide[] = curated
    .pick(["hero"], limit, {
      orientation: "landscape",
      minQuality: 4,
      textSafe: true,
      preferNoFaces: true,
    })
    .map(({ id, src }) => {
      const entry = curationFor(id);
      return {
        category: entry ? SCENE_LABELS[entry.scene] : "Luxury Event",
        video: "",
        poster: src,
        alt: entry?.alt ?? altForSrc(src),
        focal: entry?.focal ?? "50% 50%",
      };
    });

  if (slides.length >= Math.min(6, limit)) return slides;

  const folders = byFolder(assets);
  const fallbackPool = [
    ...(folders.hero ?? []),
    ...(folders.venues ?? []),
    ...(folders.gallery ?? []),
    ...(folders.weddings ?? []),
  ];
  const seen = new Set(slides.map((s) => s.poster));
  for (const asset of fallbackPool) {
    if (slides.length >= limit) break;
    if (isComingSoonImage(asset.src) || seen.has(asset.src)) continue;
    // Rotated / low-scored photos are curated with no roles — keep them out.
    const entry = curationFor(driveIdFromSrc(asset.src));
    if (entry && entry.roles.length === 0) continue;
    seen.add(asset.src);
    slides.push({
      category: VENUE_HERO_CATEGORIES[slides.length % VENUE_HERO_CATEGORIES.length],
      video: "",
      poster: asset.src,
      alt: altForSrc(asset.src),
      focal: focalForSrc(asset.src),
    });
  }

  if (slides.length > 0) return slides;

  return [
    {
      category: "Luxury Venue",
      video: "",
      poster: COMING_SOON_IMAGES.generic,
      alt: "Nexyyra Events venue showcase",
      focal: "50% 50%",
    },
  ];
}

export function buildWorldCardImages(map: BrandImageMap) {
  return {
    wedding: map.weddings[0],
    corporate: map.corporate[0],
    destination: map.destinations[0],
    celebrity: map.hero.palace,
    fashion: map.gallery[0],
    brand: map.corporate[1] ?? map.gallery[1],
  };
}

export function buildVenueStripImages(map: BrandImageMap, count = 5): string[] {
  return fillWithRealImages(map.venues, [...map.gallery, ...map.weddings], count);
}

const GENERATED_PATH = path.join(process.cwd(), "src/brand/data/brand-images.generated.ts");

/** Write TypeScript module consumed by imagery.ts (run via media:sync / media:regen) */
export async function writeBrandImagesModule(assets: MediaAsset[]): Promise<BrandImageMap> {
  const map = buildBrandImageMap(assets);
  const heroSlides = buildHeroSlidesFromMedia(assets);

  // Plain `string` slots on purpose: `as const` URL literals leaked into page
  // types, so every re-sync that changed a photo broke unrelated components.
  const content = `/** Auto-generated by npm run media:sync / media:regen — do not edit manually (curate in image-curation.ts) */
export const GENERATED_BRAND_IMAGES = ${JSON.stringify(map, null, 2)};

export const GENERATED_HERO_SLIDES = ${JSON.stringify(heroSlides, null, 2)} as const;
`;

  await fs.writeFile(GENERATED_PATH, content, "utf8");
  return map;
}
