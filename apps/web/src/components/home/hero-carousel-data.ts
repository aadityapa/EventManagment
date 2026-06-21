import { IMAGES } from "@/lib/images";

export type HeroSlide = {
  src: string;
  alt: string;
  category: string;
  query: string;
};

/** Landscape premium event photography — weddings, stages, galas (no portraits) */
export const HERO_CATEGORIES: HeroSlide[] = [
  {
    category: "Luxury Wedding",
    query: "luxury wedding reception decor venue",
    alt: "Luxury wedding reception with elegant decor",
    src: IMAGES.weddings[0],
  },
  {
    category: "Corporate Event",
    query: "corporate gala ballroom stage",
    alt: "Corporate gala in grand ballroom",
    src: IMAGES.corporate[0],
  },
  {
    category: "Award Show",
    query: "award ceremony stage lights",
    alt: "Award ceremony stage production",
    src: IMAGES.gallery[2],
  },
  {
    category: "Concert",
    query: "concert stage production lighting",
    alt: "Concert stage with dramatic lighting",
    src: IMAGES.concerts[0],
  },
  {
    category: "Celebrity Event",
    query: "vip red carpet event venue lights",
    alt: "VIP celebrity event venue",
    src: IMAGES.hero.drone,
  },
  {
    category: "Stage Production",
    query: "event stage production design",
    alt: "Professional event stage production",
    src: IMAGES.gallery[3],
  },
  {
    category: "Destination Wedding",
    query: "destination wedding palace venue india",
    alt: "Destination wedding at heritage venue",
    src: IMAGES.venues[1],
  },
  {
    category: "Fashion Show",
    query: "fashion runway event production",
    alt: "Fashion show runway event",
    src: IMAGES.gallery[6],
  },
  {
    category: "Brand Activation",
    query: "luxury brand activation experiential marketing",
    alt: "Luxury brand activation event",
    src: IMAGES.gallery[8],
  },
];

export const HERO_FALLBACK = IMAGES.hero.wedding;
