import { NextResponse } from "next/server";
import { IMAGES } from "@/lib/images";

type HeroImage = { src: string; alt: string };

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

async function tryUnsplash(): Promise<HeroImage[] | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury wedding decor event stage conference");
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=12&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const resultsRaw = root?.results;
  const results = Array.isArray(resultsRaw) ? resultsRaw : [];
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

  const query = encodeURIComponent("luxury wedding decor event stage conference");
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=12&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: key },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const photosRaw = root?.photos;
  const photos = Array.isArray(photosRaw) ? photosRaw : [];
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

async function tryPixabay(): Promise<HeroImage[] | null> {
  const key = process.env.PIXABAY_API_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury wedding decor event stage conference");
  const url = `https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&per_page=12&safesearch=true`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const hitsRaw = root?.hits;
  const hits = Array.isArray(hitsRaw) ? hitsRaw : [];
  const images: HeroImage[] = hits
    .map((h) => {
      const rec = h && typeof h === "object" ? (h as Record<string, unknown>) : {};
      const src =
        (typeof rec.largeImageURL === "string" && rec.largeImageURL) ||
        (typeof rec.webformatURL === "string" && rec.webformatURL) ||
        "";
      const alt = (typeof rec.tags === "string" && rec.tags) || "Event photo";
      return { src, alt };
    })
    .filter((x: HeroImage) => isAllowedImageUrl(x.src));
  return images.length ? images : null;
}

export async function GET() {
  try {
    const images =
      (await tryUnsplash()) ||
      (await tryPexels()) ||
      (await tryPixabay()) ||
      FALLBACK;

    return NextResponse.json({ images }, { status: 200 });
  } catch {
    return NextResponse.json({ images: FALLBACK }, { status: 200 });
  }
}

