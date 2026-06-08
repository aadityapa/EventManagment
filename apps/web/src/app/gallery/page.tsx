import { generateSEO } from "@/lib/seo";
import { GalleryView } from "@/brand";

export const metadata = generateSEO({ title: "Visual Stories Gallery", description: "Immersive luxury gallery of weddings, galas, and celebrations.", path: "/gallery" });

export default function GalleryPage() {
  return <GalleryView />;
}
