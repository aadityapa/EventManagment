import { GENERATED_BRAND_IMAGES } from "./brand-images.generated";
import { altForSrc, focalForSrc } from "./image-curation";

export { BRAND_BLUR } from "./image-placeholders";

/** Live image map — auto-generated from public/images via npm run media:sync */
export const BRAND_IMAGES = GENERATED_BRAND_IMAGES;

export const BRAND_FALLBACK = GENERATED_BRAND_IMAGES.hero.poster;

/** Descriptive alt for any BRAND_IMAGES src — `alt={imageAlt(src)}`. Generic when the photo is unknown. */
export function imageAlt(src: string | null | undefined): string {
  return altForSrc(src);
}

/** `object-position` for any BRAND_IMAGES src — `style={{ objectPosition: imageFocal(src) }}`. */
export function imageFocal(src: string | null | undefined): string {
  return focalForSrc(src);
}
