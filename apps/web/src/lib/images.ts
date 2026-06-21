import { GENERATED_BRAND_IMAGES } from "@/brand/data/brand-images.generated";

/** Centralized luxury image system — local uploaded Nexyyra media only. */
const local = GENERATED_BRAND_IMAGES;
const first = (...sources: Array<string | undefined>) =>
  sources.find((src) => src && !src.includes("/placeholders/")) ?? local.hero.poster;

const galleryPool = [
  ...local.gallery,
  ...local.venues,
  ...local.weddings,
  ...local.corporate,
  ...local.destinations,
] as const;

export const FALLBACK_IMAGE = local.hero.poster;

export const IMAGES = {
  hero: {
    main: local.hero.poster,
    wedding: local.hero.wedding,
    corporate: local.hero.corporate,
    drone: first(local.gallery[0], local.hero.poster),
  },
  weddings: local.weddings,
  corporate: local.corporate,
  venues: local.venues,
  vendors: local.vendors,
  gallery: galleryPool,
  testimonials: local.testimonials,
  team: first(local.gallery[0], local.about),
  blog: local.blog,
  contact: local.contact,
  about: local.about,
  concerts: [first(local.gallery[3], local.gallery[0]), first(local.gallery[4], local.hero.poster)],
  decor: local.decor,
  catering: local.catering,
  palace: local.hero.palace,
} as const;

/** @deprecated Use IMAGES — kept for backward compatibility */
export const EVENT_IMAGES = {
  hero: IMAGES.hero.main,
  heroVideo: IMAGES.hero.drone,
  corporate: IMAGES.corporate[0],
  wedding: IMAGES.weddings[0],
  destinationWedding: IMAGES.weddings[1],
  birthday: IMAGES.gallery[13],
  productLaunch: IMAGES.corporate[0],
  conference: IMAGES.corporate[1],
  exhibition: IMAGES.corporate[3],
  concert: IMAGES.concerts[0],
  celebrity: IMAGES.hero.drone,
  brandPromotion: IMAGES.gallery[12],
  fashionShow: IMAGES.gallery[6],
  brandActivation: IMAGES.gallery[13],
  musicFestival: IMAGES.concerts[0],
  awardFunction: IMAGES.corporate[2],
  about: IMAGES.about,
  team: IMAGES.team,
  decor: IMAGES.decor,
  catering: IMAGES.catering,
  venue1: IMAGES.venues[0],
  venue2: IMAGES.venues[1],
  venue3: IMAGES.venues[2],
  venue4: IMAGES.venues[3],
  gallery: IMAGES.gallery,
};

export function getOptimizedImageUrl(url: string, width: number, quality = 85): string {
  void width;
  void quality;
  return url;
}

export function getImageSrcSet(url: string): string {
  const widths = [640, 828, 1200, 1920];
  return widths.map((w) => `${getOptimizedImageUrl(url, w)} ${w}w`).join(", ");
}

export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBQEAAAAAAAAAAAAAAQIDAAQRBQYhEjFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AzmitzJqcpJTyFslZ0k+or6VYYqSlJTyFslZ0k+or6VYY//Z";
