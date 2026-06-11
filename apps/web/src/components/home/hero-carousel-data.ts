import { IMAGES } from "@/lib/images";

const U = (id: string, w = 1920) =>
  `https://images.unsplash.com/${id}?w=${w}&q=88&auto=format&fit=crop`;

export type HeroSlide = {
  src: string;
  alt: string;
  category: string;
  query: string;
};

/** Landscape luxury event photography — no portraits or influencer-style shots */
export const HERO_CATEGORIES: HeroSlide[] = [
  {
    category: "Luxury Wedding",
    query: "luxury wedding reception venue decor",
    alt: "Luxury wedding reception with elegant decor",
    src: U("photo-1519741497674-611481863552"),
  },
  {
    category: "Destination Wedding",
    query: "destination wedding palace venue",
    alt: "Destination wedding at heritage palace",
    src: U("photo-1566073771259-6a8506099945"),
  },
  {
    category: "Corporate Event",
    query: "corporate gala ballroom event",
    alt: "Corporate gala in grand ballroom",
    src: U("photo-1540575467063-178a50c2df87"),
  },
  {
    category: "Concert",
    query: "concert stage production lights",
    alt: "Concert stage with dramatic lighting",
    src: U("photo-1459749411175-04bf5292ceea"),
  },
  {
    category: "Award Function",
    query: "award ceremony stage event",
    alt: "Award ceremony stage production",
    src: U("photo-1492684223066-81342ee5ff30"),
  },
  {
    category: "Fashion Show",
    query: "fashion runway event production",
    alt: "Fashion show runway event",
    src: U("photo-1552664730-d307ca884978"),
  },
  {
    category: "Celebrity Event",
    query: "vip red carpet event venue",
    alt: "VIP celebrity event venue",
    src: U("photo-1519167758481-83f550bb49b3"),
  },
  {
    category: "Brand Promotion",
    query: "luxury brand launch event",
    alt: "Luxury brand promotion event",
    src: U("photo-1475721027785-f74eccf877e2"),
  },
];

export const HERO_FALLBACK = IMAGES.hero.main;
