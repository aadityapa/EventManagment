import { NextResponse } from "next/server";
import { getGalleryMedia, getHeroCarouselSlides } from "@/lib/media/server";
import { HERO_CATEGORIES } from "@/components/home/hero-carousel-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const [slides, gallery] = await Promise.all([
    getHeroCarouselSlides(12),
    getGalleryMedia(),
  ]);

  const heroSlides = HERO_CATEGORIES.map((cat, i) => ({
    category: cat.category,
    query: cat.query,
    src: slides[i] ?? cat.src,
    alt: cat.alt,
  }));

  const images = gallery.slice(0, 12).map((asset, i) => ({
    src: asset.src,
    alt: asset.alt || `Nexyyra event moment ${i + 1}`,
  }));

  return NextResponse.json({ slides: heroSlides, images }, { status: 200 });
}
