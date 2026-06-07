/** Curated high-quality Unsplash images for event categories */
export const EVENT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80",
  heroVideo: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80",
  corporate: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  destinationWedding: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
  birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  productLaunch: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  conference: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  exhibition: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
  concert: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  celebrity: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  brandPromotion: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  fashionShow: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  musicFestival: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  awardFunction: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
  about: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  venue1: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  venue2: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  venue3: "https://images.unsplash.com/photo-1478146896988-eee32b6380b2?w=800&q=80",
  venue4: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    "https://images.unsplash.com/photo-1478146896988-eee32b6380b2?w=600&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80",
  ],
};

export function getOptimizedImageUrl(url: string, width: number, quality = 80): string {
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
