import { NextResponse } from "next/server";

type HeroImage = { src: string; alt: string };

const FALLBACK: HeroImage[] = [
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80&auto=format&fit=crop", alt: "Luxury ballroom event" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop", alt: "Wedding celebration" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80&auto=format&fit=crop", alt: "Event decor" },
  { src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80&auto=format&fit=crop", alt: "Concert production" },
  { src: "https://images.unsplash.com/photo-1505373877841-8d25f39c466e?w=1200&q=80&auto=format&fit=crop", alt: "Conference stage" },
  { src: "https://images.unsplash.com/photo-1558171813-4c088753a089?w=1200&q=80&auto=format&fit=crop", alt: "Fashion show lighting" },
  { src: "https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=1200&q=80&auto=format&fit=crop", alt: "Corporate gala" },
  { src: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5d1e?w=1200&q=80&auto=format&fit=crop", alt: "Destination wedding venue" },
  { src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80&auto=format&fit=crop", alt: "Luxury dining setup" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80&auto=format&fit=crop", alt: "Event ambience" },
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop", alt: "Corporate networking" },
  { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80&auto=format&fit=crop", alt: "Team event" },
];

async function tryUnsplash(): Promise<HeroImage[] | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury event wedding decor stage");
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
    .filter((x: HeroImage) => x.src.startsWith("http"));
  return images.length ? images : null;
}

async function tryPexels(): Promise<HeroImage[] | null> {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury event wedding decor stage");
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
    .filter((x: HeroImage) => x.src.startsWith("http"));
  return images.length ? images : null;
}

async function tryPixabay(): Promise<HeroImage[] | null> {
  const key = process.env.PIXABAY_API_KEY?.trim();
  if (!key) return null;

  const query = encodeURIComponent("luxury event wedding decor stage");
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
    .filter((x: HeroImage) => x.src.startsWith("http"));
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

