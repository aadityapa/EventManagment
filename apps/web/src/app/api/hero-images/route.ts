import { NextResponse } from "next/server";
import { HERO_CATEGORIES } from "@/components/home/hero-carousel-data";
import { IMAGES } from "@/lib/images";

type HeroImage = { src: string; alt: string };
type HeroSlide = { src: string; alt: string; category: string; query: string };

const FALLBACK: HeroImage[] = IMAGES.gallery.slice(0, 12).map((src, i) => ({
  src,
  alt: `Event inspiration ${i + 1}`,
}));

function isAllowedImageUrl(src: string): boolean {
  try {
    const u = new URL(src);
    return (
      u.protocol === "https:" &&
      [
        "images.unsplash.com",
        "plus.unsplash.com",
        "images.pexels.com",
        "cdn.pixabay.com",
        "pixabay.com",
      ].includes(u.hostname)
    );
  } catch {
    return false;
  }
}

async function tryUnsplashQuery(query: string): Promise<HeroImage | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!key) return null;

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const results = Array.isArray(root?.results) ? root.results : [];
  const first = results[0] && typeof results[0] === "object" ? (results[0] as Record<string, unknown>) : null;
  if (!first) return null;

  const urls = first.urls && typeof first.urls === "object" ? (first.urls as Record<string, unknown>) : {};
  const src = typeof urls.regular === "string" ? urls.regular : "";
  const alt =
    (typeof first.alt_description === "string" && first.alt_description) ||
    (typeof first.description === "string" && first.description) ||
    query;

  if (!isAllowedImageUrl(src)) return null;
  return { src, alt };
}

async function tryPexelsQuery(query: string): Promise<HeroImage | null> {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (!key) return null;

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: key },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const photos = Array.isArray(root?.photos) ? root.photos : [];
  const first = photos[0] && typeof photos[0] === "object" ? (photos[0] as Record<string, unknown>) : null;
  if (!first) return null;

  const srcObj = first.src && typeof first.src === "object" ? (first.src as Record<string, unknown>) : {};
  const src =
    (typeof srcObj.large === "string" && srcObj.large) ||
    (typeof srcObj.medium === "string" && srcObj.medium) ||
    "";
  const alt = (typeof first.alt === "string" && first.alt) || query;

  if (!isAllowedImageUrl(src)) return null;
  return { src, alt };
}

async function buildSlides(): Promise<HeroSlide[]> {
  const slides = await Promise.all(
    HERO_CATEGORIES.map(async (cat) => {
      const remote =
        (await tryUnsplashQuery(cat.query)) ||
        (await tryPexelsQuery(cat.query));

      return {
        category: cat.category,
        query: cat.query,
        src: remote?.src ?? cat.src,
        alt: remote?.alt ?? cat.alt,
      };
    })
  );
  return slides;
}

async function tryGoogleCse(): Promise<HeroImage[] | null> {
  const key = process.env.GOOGLE_CSE_API_KEY?.trim();
  const cx = process.env.GOOGLE_CSE_CX?.trim();
  if (!key || !cx) return null;

  const q = encodeURIComponent("luxury wedding corporate event concert fashion award");
  const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${q}&searchType=image&safe=active&num=10&imgType=photo`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } });
  if (!res.ok) return null;

  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const items = Array.isArray(root?.items) ? root.items : [];

  const images: HeroImage[] = items
    .map((it) => {
      const rec = it && typeof it === "object" ? (it as Record<string, unknown>) : {};
      const link = typeof rec.link === "string" ? rec.link : "";
      const title = typeof rec.title === "string" ? rec.title : "Event photo";
      return { src: link, alt: title };
    })
    .filter((x) => {
      try {
        return new URL(x.src).protocol === "https:";
      } catch {
        return false;
      }
    });

  return images.length ? images : null;
}

async function tryUnsplash(): Promise<HeroImage[] | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury wedding corporate event concert fashion award");
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=12&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const results = Array.isArray(root?.results) ? root.results : [];

  const images: HeroImage[] = results
    .map((r) => {
      const rec = r && typeof r === "object" ? (r as Record<string, unknown>) : {};
      const urls = rec.urls && typeof rec.urls === "object" ? (rec.urls as Record<string, unknown>) : {};
      const src = typeof urls.regular === "string" ? urls.regular : "";
      const alt =
        (typeof rec.alt_description === "string" && rec.alt_description) ||
        (typeof rec.description === "string" && rec.description) ||
        "Event photo";
      return { src, alt };
    })
    .filter((x: HeroImage) => isAllowedImageUrl(x.src));

  return images.length ? images : null;
}

async function tryPexels(): Promise<HeroImage[] | null> {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury wedding corporate event concert fashion award");
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=12&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: key },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const photos = Array.isArray(root?.photos) ? root.photos : [];

  const images: HeroImage[] = photos
    .map((p) => {
      const rec = p && typeof p === "object" ? (p as Record<string, unknown>) : {};
      const srcObj = rec.src && typeof rec.src === "object" ? (rec.src as Record<string, unknown>) : {};
      const src =
        (typeof srcObj.large === "string" && srcObj.large) ||
        (typeof srcObj.medium === "string" && srcObj.medium) ||
        "";
      const alt = (typeof rec.alt === "string" && rec.alt) || "Event photo";
      return { src, alt };
    })
    .filter((x: HeroImage) => isAllowedImageUrl(x.src));

  return images.length ? images : null;
}

export async function GET() {
  try {
    const slides = await buildSlides();
    const images =
      (await tryGoogleCse()) ||
      (await tryUnsplash()) ||
      (await tryPexels()) ||
      FALLBACK;

    return NextResponse.json({ slides, images }, { status: 200 });
  } catch {
    return NextResponse.json(
      { slides: HERO_CATEGORIES, images: FALLBACK },
      { status: 200 }
    );
  }
}
