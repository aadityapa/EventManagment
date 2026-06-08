import { BlogPageContent } from "@/components/pages/blog-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Event Insights & Inspiration",
  description: "Luxury event trends, wedding inspiration, corporate strategy, and expert perspectives from Glitz Events.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogPageContent />;
}
