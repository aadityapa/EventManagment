import { IMAGES } from "@/lib/images";

export type HeroSlide = {
  src: string;
  alt: string;
  category: string;
  query: string;
};

export const HERO_CATEGORIES: HeroSlide[] = [
  {
    category: "Luxury Weddings",
    query: "luxury wedding ceremony",
    alt: "Luxury wedding celebration",
    src: IMAGES.weddings[0],
  },
  {
    category: "Corporate Events",
    query: "corporate gala event",
    alt: "Corporate event production",
    src: IMAGES.corporate[0],
  },
  {
    category: "Concerts",
    query: "concert stage lights",
    alt: "Concert stage production",
    src: IMAGES.concerts[0],
  },
  {
    category: "Award Shows",
    query: "award ceremony stage",
    alt: "Award ceremony event",
    src: IMAGES.gallery[3],
  },
  {
    category: "Fashion Shows",
    query: "fashion show runway",
    alt: "Fashion show runway",
    src: IMAGES.gallery[6],
  },
  {
    category: "Destination Weddings",
    query: "destination wedding palace",
    alt: "Destination wedding venue",
    src: IMAGES.weddings[1],
  },
  {
    category: "Birthday Events",
    query: "luxury birthday celebration",
    alt: "Luxury birthday celebration",
    src: IMAGES.gallery[9],
  },
  {
    category: "Celebrity Events",
    query: "vip red carpet event",
    alt: "Celebrity VIP event",
    src: IMAGES.palace,
  },
];
