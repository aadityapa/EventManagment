/**
 * Client-safe image constants. Client components (BrandImage) import from
 * here, never from imagery.ts: that module pulls in the generated Drive map
 * and the full curation table, which would ship ~40 KB gzipped to every page.
 */
export const BRAND_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBQEAAAAAAAAAAAAAAQIDAAQRBQYhEjFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AzmitzJqcpJTyFslZ0k+or6VYYqSlJTyFslZ0k+or6VYY//Z";

/** Local poster used when a remote (Drive) image fails — a local file still loads if Drive is down. */
export const LOCAL_IMAGE_FALLBACK = "/images/hero/hero-poster.webp";
