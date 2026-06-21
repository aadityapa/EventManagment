import { generateSEO } from "@/lib/seo";
import { BlogView } from "@/brand";

export const metadata = generateSEO({ title: "The Nexyyra Journal", description: "Luxury event insights, wedding trends, and editorial perspectives.", path: "/blog" });

export default function BlogPage() {
  return <BlogView />;
}
