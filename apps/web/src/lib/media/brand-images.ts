import fs from "node:fs/promises";
import path from "node:path";
import type { MediaAsset, MediaImageFolder } from "./types";
import {
  COMING_SOON_IMAGES,
  pickOneOrPlaceholder,
  pickOrPlaceholder,
} from "./placeholders";

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

/** Build site-wide image map — hero backgrounds use venues only; empty folders get AI placeholders */
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

  const heroPoster = pickOneOrPlaceholder(venueSrcs, COMING_SOON_IMAGES.generic);

  return {
    hero: {
      video: "",
      poster: heroPoster,
      wedding: pickOneOrPlaceholder(venueSrcs, COMING_SOON_IMAGES.generic, 1),
      corporate: pickOneOrPlaceholder(venueSrcs, COMING_SOON_IMAGES.corporate, 2),
      palace: pickOneOrPlaceholder(venueSrcs, COMING_SOON_IMAGES.generic, 3),
    },
    weddings: pickOrPlaceholder(
      weddingSrcs,
      COMING_SOON_IMAGES.wedding,
      6
    ),
    corporate: pickOrPlaceholder(corporateSrcs, COMING_SOON_IMAGES.corporate, 4),
    destinations: pickOrPlaceholder(destinationSrcs, COMING_SOON_IMAGES.destination, 4),
    venues: pickOrPlaceholder(venueSrcs, COMING_SOON_IMAGES.generic, 8),
    vendors: pickOrPlaceholder(pickMany(gallery, 5), COMING_SOON_IMAGES.generic, 4),
    gallery: gallerySrcs.length
      ? gallerySrcs
      : pickOrPlaceholder([], COMING_SOON_IMAGES.portfolio, 4),
    blog: pickOrPlaceholder(pickMany(gallery, 3), COMING_SOON_IMAGES.generic, 3),
    contact: pickOneOrPlaceholder(venueSrcs, COMING_SOON_IMAGES.generic, 1),
    about: pickOneOrPlaceholder(weddingSrcs, COMING_SOON_IMAGES.wedding, 1),
    catering: pickOneOrPlaceholder(gallerySrcs, COMING_SOON_IMAGES.generic, 2),
    decor: pickOneOrPlaceholder(weddingSrcs, COMING_SOON_IMAGES.wedding, 2),
    awards: pickOneOrPlaceholder(gallerySrcs, COMING_SOON_IMAGES.corporate, 3),
    testimonials: pickOrPlaceholder(
      weddingSrcs.slice(0, 3),
      COMING_SOON_IMAGES.generic,
      3
    ),
  };
}

/** Homepage hero carousel — venue photos only */
export function buildHeroSlidesFromMedia(
  assets: MediaAsset[],
  limit = 6
): Array<{ category: string; video: string; poster: string; alt: string }> {
  const venues = byFolder(assets).venues ?? [];
  const slides = venues.slice(0, limit).map((asset, i) => ({
    category: VENUE_HERO_CATEGORIES[i % VENUE_HERO_CATEGORIES.length],
    video: "",
    poster: asset.src,
    alt: asset.alt,
  }));

  if (slides.length > 0) return slides;

  return [
    {
      category: "Luxury Venue",
      video: "",
      poster: COMING_SOON_IMAGES.generic,
      alt: "Nexyyra Events venue showcase — coming soon",
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
  return pickOrPlaceholder(map.venues, COMING_SOON_IMAGES.generic, count);
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
