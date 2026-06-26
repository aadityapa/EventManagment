import { generateSEO } from "@/lib/seo";
import { GalleryView } from "@/brand";
import { getGalleryMedia } from "@/lib/media/server";

export const metadata = generateSEO({
  title: "Visual Stories Gallery",
  description:
    "Browse Nexyyra's luxury event gallery — weddings, corporate galas, concerts, and destination celebrations captured across India.",
  path: "/gallery",
});

export const revalidate = 3600;

export default async function GalleryPage() {
  const galleryAssets = await getGalleryMedia();
  const heroAsset = galleryAssets[0];

  return (
    <GalleryView
      assets={galleryAssets}
      heroSrc={heroAsset?.src ?? ""}
    />
  );
}
