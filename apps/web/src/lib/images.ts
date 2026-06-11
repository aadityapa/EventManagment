/** Centralized luxury image system — curated Unsplash, warm luxury grading */
const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`;

export const FALLBACK_IMAGE = U("photo-1519167758481-83f550bb49b3", 1200);

export const IMAGES = {
  hero: {
    main: U("photo-1519167758481-83f550bb49b3", 1920),
    wedding: U("photo-1519741497674-611481863552", 1920),
    corporate: U("photo-1540575467063-178a50c2df87", 1920),
    drone: U("photo-1492684223066-81342ee5ff30", 1920),
  },
  weddings: [
    U("photo-1519741497674-611481863552"),
    U("photo-1606216794074-735e91aa2c92"),
    U("photo-1464366400600-7168b8af9bc3"),
    U("photo-1519225421980-715cb0215aed"),
  ],
  corporate: [
    U("photo-1540575467063-178a50c2df87"),
    U("photo-1475721027785-f74eccf877e2"),
    U("photo-1560179707-f14e90ef3623"),
    U("photo-1591115765373-5207764f72e7"),
  ],
  venues: [
    U("photo-1519167758481-83f550bb49b3"),
    U("photo-1464366400600-7168b8af9bc3"),
    U("photo-1464366400600-7168b8af9bc3"),
    U("photo-1519225421980-715cb0215aed"),
    U("photo-1606216794074-735e91aa2c92"),
  ],
  vendors: [
    U("photo-1554048612-b6a482b17f66"),
    U("photo-1519225421980-715cb0215aed"),
    U("photo-1555244162-803834f70033"),
    U("photo-1459749411175-04bf5292ceea"),
  ],
  gallery: [
    U("photo-1519741497674-611481863552", 800),
    U("photo-1519167758481-83f550bb49b3", 800),
    U("photo-1492684223066-81342ee5ff30", 800),
    U("photo-1459749411175-04bf5292ceea", 800),
    U("photo-1540575467063-178a50c2df87", 800),
    U("photo-1475721027785-f74eccf877e2", 800),
    U("photo-1469334031218-e382a71b716b", 800),
    U("photo-1464366400600-7168b8af9bc3", 800),
    U("photo-1464366400600-7168b8af9bc3", 800),
    U("photo-1519225421980-715cb0215aed", 800),
    U("photo-1606216794074-735e91aa2c92", 800),
    U("photo-1560179707-f14e90ef3623", 800),
    U("photo-1552664730-d307ca884978", 800),
    U("photo-1530103862676-de8c9debad1d", 800),
    U("photo-1522071820081-009f0129c71c", 800),
  ],
  testimonials: [
    U("photo-1494790108377-be9c29b29330", 200),
    U("photo-1472099645785-5658abf4ff4e", 200),
    U("photo-1580489944761-15a19d654956", 200),
  ],
  team: U("photo-1522071820081-009f0129c71c"),
  blog: [
    U("photo-1606216794074-735e91aa2c92"),
    U("photo-1540575467063-178a50c2df87"),
    U("photo-1475721027785-f74eccf877e2"),
  ],
  contact: U("photo-1511578314322-379afb476865", 1920),
  about: U("photo-1511578314322-379afb476865", 1400),
  concerts: [
    U("photo-1459749411175-04bf5292ceea"),
    U("photo-1492684223066-81342ee5ff30"),
  ],
  decor: U("photo-1519225421980-715cb0215aed"),
  catering: U("photo-1555244162-803834f70033"),
  palace: U("photo-1566073771259-6a8506099945"),
} as const;

/** @deprecated Use IMAGES — kept for backward compatibility */
export const EVENT_IMAGES = {
  hero: IMAGES.hero.main,
  heroVideo: IMAGES.hero.drone,
  corporate: IMAGES.corporate[0],
  wedding: IMAGES.weddings[0],
  destinationWedding: IMAGES.weddings[1],
  birthday: IMAGES.gallery[13],
  productLaunch: IMAGES.corporate[0],
  conference: IMAGES.corporate[1],
  exhibition: IMAGES.corporate[3],
  concert: IMAGES.concerts[0],
  celebrity: IMAGES.hero.drone,
  brandPromotion: IMAGES.gallery[12],
  fashionShow: IMAGES.gallery[6],
  musicFestival: IMAGES.concerts[0],
  awardFunction: IMAGES.corporate[2],
  about: IMAGES.about,
  team: IMAGES.team,
  venue1: IMAGES.venues[0],
  venue2: IMAGES.venues[1],
  venue3: IMAGES.venues[2],
  venue4: IMAGES.venues[3],
  gallery: IMAGES.gallery,
};

export function getOptimizedImageUrl(url: string, width: number, quality = 85): string {
  if (url.includes("unsplash.com")) {
    const base = url.split("?")[0];
    return `${base}?w=${width}&q=${quality}&auto=format&fit=crop`;
  }
  return url;
}

export function getImageSrcSet(url: string): string {
  const widths = [640, 828, 1200, 1920];
  return widths.map((w) => `${getOptimizedImageUrl(url, w)} ${w}w`).join(", ");
}

export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBQEAAAAAAAAAAAAAAQIDAAQRBQYhEjFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AzmitzJqcpJTyFslZ0k+or6VYYqSlJTyFslZ0k+or6VYY//Z";
