import { GalleryPageContent } from "@/components/gallery/gallery-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Visual Stories Gallery",
  description: "Immersive gallery of luxury weddings, corporate galas, concerts, and destination celebrations by Glitz Events.",
  path: "/gallery",
});

export default function GalleryPage() {
  return <GalleryPageContent />;
}
