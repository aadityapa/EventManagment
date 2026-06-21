import { generateSEO } from "@/lib/seo";
import { GalleryView } from "@/brand";
import { getGalleryMedia, getMediaVideos } from "@/lib/media/server";
import { mergeWithStaticFallback } from "@/lib/media/fallback";
import { BRAND_IMAGES } from "@/brand/data/imagery";

export const metadata = generateSEO({
  title: "Visual Stories Gallery",
  description:
    "Browse Nexyyra's luxury event gallery — weddings, corporate galas, concerts, and destination celebrations captured across India.",
  path: "/gallery",
});

export const revalidate = 60;

export default async function GalleryPage() {
  const [galleryAssets, videos] = await Promise.all([
    getGalleryMedia(),
    getMediaVideos(),
  ]);

  const assets = mergeWithStaticFallback(galleryAssets, BRAND_IMAGES.gallery, "gallery");
  const heroAsset = assets[0];
  const videoSrc = videos[0]?.src ?? BRAND_IMAGES.hero.video;
  const videoPoster = videos[0]?.poster ?? heroAsset?.src ?? BRAND_IMAGES.hero.poster;

  return (
    <GalleryView
      assets={assets}
      heroSrc={heroAsset?.src ?? BRAND_IMAGES.gallery[0]}
      videoSrc={videoSrc}
      videoPoster={videoPoster}
    />
  );
}
