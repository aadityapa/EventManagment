import { IMAGES } from "@/lib/images";

const U = (id: string, w = 1920) =>
  `https://images.unsplash.com/${id}?w=${w}&q=88&auto=format&fit=crop`;

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
    src: U("photo-1519741497674-611481863552"),
  },
  {
    category: "Corporate Event",
    query: "corporate gala ballroom stage",
    alt: "Corporate gala in grand ballroom",
    src: U("photo-1540575467063-178a50c2df87"),
  },
  {
    category: "Award Show",
    query: "award ceremony stage lights",
    alt: "Award ceremony stage production",
    src: U("photo-1492684223066-81342ee5ff30"),
  },
  {
    category: "Concert",
    query: "concert stage production lighting",
    alt: "Concert stage with dramatic lighting",
    src: U("photo-1459749411175-04bf5292ceea"),
  },
  {
    category: "Celebrity Event",
    query: "vip red carpet event venue lights",
    alt: "VIP celebrity event venue",
    src: U("photo-1519167758481-83f550bb49b3"),
  },
  {
    category: "Stage Production",
    query: "event stage production design",
    alt: "Professional event stage production",
    src: U("photo-1475721027785-f74eccf877e2"),
  },
  {
    category: "Destination Wedding",
    query: "destination wedding palace venue india",
    alt: "Destination wedding at heritage venue",
    src: U("photo-1566073771259-6a8506099945"),
  },
  {
    category: "Fashion Show",
    query: "fashion runway event production",
    alt: "Fashion show runway event",
    src: U("photo-1552664730-d307ca884978"),
  },
  {
    category: "Brand Activation",
    query: "luxury brand activation experiential marketing",
    alt: "Luxury brand activation event",
    src: U("photo-1530103862676-de8c9debad1d"),
  },
];

export const HERO_FALLBACK = IMAGES.hero.wedding;
