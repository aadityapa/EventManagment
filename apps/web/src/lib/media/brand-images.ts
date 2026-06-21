import fs from "node:fs/promises";
import path from "node:path";
import type { MediaAsset, MediaImageFolder } from "./types";
import { COMING_SOON_IMAGES, isComingSoonImage } from "./placeholders";

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

/** Venue-only labels for homepage hero carousel */
const VENUE_HERO_CATEGORIES = [
  "Grand Ballroom",
  "Palace Estate",
  "Luxury Venue",
  "Heritage Hall",
  "Garden Pavilion",
  "Convention Suite",
] as const;

function byFolder(assets: MediaAsset[]): Record<string, MediaAsset[]> {
  const map: Record<string, MediaAsset[]> = {};
  for (const asset of assets) {
    if (!map[asset.folder]) map[asset.folder] = [];
    map[asset.folder].push(asset);
  }
  return map;
}

function pick(assets: MediaAsset[] | undefined, index = 0): string {
  if (!assets?.length) return "";
  return assets[index]?.src ?? assets[0].src;
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

/** Build site-wide image map — empty folders borrow real uploaded imagery before placeholders. */
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

  const heroPoster = pickRealImage(venueSrcs, realFallbackPool);

  return {
    hero: {
      video: "",
      poster: heroPoster,
      wedding: pickRealImage(weddingSrcs, realFallbackPool, 1),
      corporate: pickRealImage(corporateSrcs, realFallbackPool, 2),
      palace: pickRealImage(venueSrcs, realFallbackPool, 3),
    },
    weddings: fillWithRealImages(weddingSrcs, realFallbackPool, 6, COMING_SOON_IMAGES.wedding),
    corporate: fillWithRealImages(corporateSrcs, realFallbackPool, 4, COMING_SOON_IMAGES.corporate),
    destinations: fillWithRealImages(destinationSrcs, realFallbackPool, 4, COMING_SOON_IMAGES.destination),
    venues: fillWithRealImages(venueSrcs, realFallbackPool, 8),
    vendors: fillWithRealImages(pickMany(gallery, 5), realFallbackPool, 4),
    gallery: fillWithRealImages(gallerySrcs, realFallbackPool, 12, COMING_SOON_IMAGES.portfolio),
    blog: fillWithRealImages(pickMany(gallery, 3), realFallbackPool, 3),
    contact: pickRealImage(venueSrcs, realFallbackPool, 1),
    about: pickRealImage(weddingSrcs, realFallbackPool, 1),
    catering: pickRealImage(gallerySrcs, realFallbackPool, 2),
    decor: pickRealImage(weddingSrcs, realFallbackPool, 2),
    awards: pickRealImage(gallerySrcs, realFallbackPool, 3),
    testimonials: fillWithRealImages(weddingSrcs.slice(0, 3), realFallbackPool, 3),
  };
}

/** Homepage hero carousel — venue photos only */
export function buildHeroSlidesFromMedia(
  assets: MediaAsset[],
  limit = 6
): Array<{ category: string; video: string; poster: string; alt: string }> {
  const folders = byFolder(assets);
  const venues = folders.venues ?? [];
  const gallery = folders.gallery ?? [];
  const weddings = folders.weddings ?? [];
  const fallbackPool = [...venues, ...gallery, ...weddings].filter(
    (asset) => !isComingSoonImage(asset.src)
  );
  const slides = venues.slice(0, limit).map((asset, i) => ({
    category: VENUE_HERO_CATEGORIES[i % VENUE_HERO_CATEGORIES.length],
    video: "",
    poster: asset.src,
    alt: asset.alt,
  }));

  if (slides.length > 0) return slides;

  const fallbackSlides = fallbackPool.slice(0, limit).map((asset, i) => ({
    category: VENUE_HERO_CATEGORIES[i % VENUE_HERO_CATEGORIES.length],
    video: "",
    poster: asset.src,
    alt: asset.alt,
  }));

  if (fallbackSlides.length > 0) return fallbackSlides;

  return [
    {
      category: "Luxury Venue",
      video: "",
      poster: COMING_SOON_IMAGES.generic,
      alt: "Nexyyra Events venue showcase",
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

/** Write TypeScript module consumed by imagery.ts (run via media:sync) */
export async function writeBrandImagesModule(assets: MediaAsset[]): Promise<BrandImageMap> {
  const map = buildBrandImageMap(assets);
  const heroSlides = buildHeroSlidesFromMedia(assets);

  const content = `/* eslint-disable */
/** Auto-generated by npm run media:sync — do not edit manually */
export const GENERATED_BRAND_IMAGES = ${JSON.stringify(map, null, 2)} as const;

export const GENERATED_HERO_SLIDES = ${JSON.stringify(heroSlides, null, 2)} as const;
`;

  await fs.writeFile(GENERATED_PATH, content, "utf8");
  return map;
}
