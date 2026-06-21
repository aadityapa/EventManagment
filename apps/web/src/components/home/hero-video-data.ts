export type HeroVideoSlide = {
  category: string;
  video: string;
  poster: string;
  alt: string;
};

import {
  GENERATED_BRAND_IMAGES,
  GENERATED_HERO_SLIDES,
} from "@/brand/data/brand-images.generated";

export const HERO_VIDEO_SLIDES: HeroVideoSlide[] = [...GENERATED_HERO_SLIDES];

export const HERO_VIDEO_FALLBACK =
  GENERATED_BRAND_IMAGES.hero.poster || "/images/placeholders/generic-coming-soon.webp";

/** Optional showreel — set when a video is uploaded to public/videos */
export const HERO_SHOWREEL_VIDEO = GENERATED_BRAND_IMAGES.hero.video;

export const HERO_VIDEO_INTERVAL_MS = 5500;
