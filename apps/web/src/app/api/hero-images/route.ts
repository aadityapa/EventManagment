import { NextResponse } from "next/server";
import { HERO_CATEGORIES } from "@/components/home/hero-carousel-data";
import { IMAGES } from "@/lib/images";

type HeroImage = { src: string; alt: string };

const FALLBACK: HeroImage[] = IMAGES.gallery.slice(0, 12).map((src, i) => ({
  src,
  alt: `Nexyyra event moment ${i + 1}`,
}));

export async function GET() {
  const slides = HERO_CATEGORIES.map((cat) => ({
    category: cat.category,
    query: cat.query,
    src: cat.src,
    alt: cat.alt,
  }));

  return NextResponse.json({ slides, images: FALLBACK }, { status: 200 });
}
