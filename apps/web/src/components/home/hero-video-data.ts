import { BRAND_IMAGES } from "@/brand/data/imagery";

const U = (id: string, w = 1920) =>
  `https://images.unsplash.com/${id}?w=${w}&q=88&auto=format&fit=crop`;

/** Mixkit preview URLs — royalty-free cinematic loops. */
export type HeroVideoSlide = {
  category: string;
  video: string;
  poster: string;
  alt: string;
};

export const HERO_VIDEO_SLIDES: HeroVideoSlide[] = [
  {
    category: "Luxury Wedding",
    video: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-4167-large.mp4",
    poster: U("photo-1519741497674-611481863552"),
    alt: "Luxury wedding ceremony and reception",
  },
  {
    category: "Corporate Gala",
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-in-a-business-meeting-4380-large.mp4",
    poster: U("photo-1540575467063-178a50c2df87"),
    alt: "Corporate gala in a grand ballroom",
  },
  {
    category: "Award Ceremony",
    video: "https://assets.mixkit.co/videos/preview/mixkit-applause-at-a-theater-4332-large.mp4",
    poster: U("photo-1492684223066-81342ee5ff30"),
    alt: "Award ceremony stage with dramatic lighting",
  },
  {
    category: "Celebrity Event",
    video: "https://assets.mixkit.co/videos/preview/mixkit-paparazzi-taking-photos-of-a-celebrity-4340-large.mp4",
    poster: U("photo-1516450360452-931a137fa786"),
    alt: "Celebrity red carpet event with VIP guests",
  },
  {
    category: "Fashion Show",
    video: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-the-catwalk-32867-large.mp4",
    poster: U("photo-1552664730-d307ca884978"),
    alt: "Fashion show runway production",
  },
  {
    category: "Destination Wedding",
    video: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-on-the-beach-4165-large.mp4",
    poster: U("photo-1465497420151-7a0a5dda2a65"),
    alt: "Destination wedding on an exotic shoreline",
  },
];

export const HERO_VIDEO_FALLBACK = BRAND_IMAGES.hero.poster;
export const HERO_SHOWREEL_VIDEO = BRAND_IMAGES.hero.video;

/** Interval for cinematic crossfade rotation (ms). */
export const HERO_VIDEO_INTERVAL_MS = 5500;
