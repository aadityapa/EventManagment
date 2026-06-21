import { generateSEO } from "@/lib/seo";
import { GalleryView } from "@/brand";

export const metadata = generateSEO({
  title: "Visual Stories Gallery",
  description:
    "Browse Nexyyra's luxury event gallery — weddings, corporate galas, concerts, and destination celebrations captured across India.",
  path: "/gallery",
});

export default function GalleryPage() {
  return <GalleryView />;
}
