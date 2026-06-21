import { generateSEO } from "@/lib/seo";
import { GalleryView } from "@/brand";
import { getGalleryMedia, getMediaVideos } from "@/lib/media/server";

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

  const heroAsset = galleryAssets[0];
  const videoSrc = videos[0]?.src ?? "";
  const videoPoster = videos[0]?.poster ?? heroAsset?.src ?? "";

  return (
    <GalleryView
      assets={galleryAssets}
      heroSrc={heroAsset?.src ?? ""}
      videoSrc={videoSrc}
      videoPoster={videoPoster}
    />
  );
}
