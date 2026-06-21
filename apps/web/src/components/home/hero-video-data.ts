import { BRAND_IMAGES } from "@/brand/data/imagery";

const U = (id: string, w = 1920) =>
  `https://images.unsplash.com/${id}?w=${w}&q=88&auto=format&fit=crop`;

/** Mixkit preview URLs — royalty-free, no API key; poster fallback for reduced motion / errors. */
export type HeroVideoSlide = {
  category: string;
  video: string;
  poster: string;
  alt: string;
};

export const HERO_VIDEO_SLIDES: HeroVideoSlide[] = [
  {
    category: "Luxury Weddings",
    video: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-4167-large.mp4",
    poster: U("photo-1519741497674-611481863552"),
    alt: "Luxury wedding reception with elegant decor",
  },
  {
    category: "Corporate Events",
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-in-a-business-meeting-4380-large.mp4",
    poster: U("photo-1540575467063-178a50c2df87"),
    alt: "Corporate gala in grand ballroom",
  },
  {
    category: "Concerts",
    video: "https://assets.mixkit.co/videos/preview/mixkit-crowd-at-a-concert-4385-large.mp4",
    poster: U("photo-1459749411175-04bf5292ceea"),
    alt: "Concert stage with dramatic lighting",
  },
  {
    category: "Fashion Shows",
    video: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-the-catwalk-32867-large.mp4",
    poster: U("photo-1552664730-d307ca884978"),
    alt: "Fashion show runway event",
  },
  {
    category: "Award Ceremonies",
    video: "https://assets.mixkit.co/videos/preview/mixkit-applause-at-a-theater-4332-large.mp4",
    poster: U("photo-1492684223066-81342ee5ff30"),
    alt: "Award ceremony stage production",
  },
];

export const HERO_VIDEO_FALLBACK = BRAND_IMAGES.hero.poster;
export const HERO_SHOWREEL_VIDEO = BRAND_IMAGES.hero.video;

/** Interval for crossfade rotation (ms). */
export const HERO_VIDEO_INTERVAL_MS = 4500;
