import { generateSEO, itemListSchema, collectionPageSchema, breadcrumbSchema, pageGraphSchema } from "@/lib/seo";
import { BlogView } from "@/brand";
import { blogPosts } from "@/data/cms";

export const metadata = generateSEO({
  title: "The Nexyyra Journal",
  description: "Luxury event insights, wedding trends, corporate planning guides, and editorial perspectives from Nexyyra Events.",
  path: "/blog",
});

export default function BlogPage() {
  const blogLd = pageGraphSchema(
    breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }]),
    collectionPageSchema(
      "The Nexyyra Journal",
      "/blog",
      "Editorial insights on luxury weddings, corporate events, and celebration design in India.",
    ),
    itemListSchema(
      blogPosts.map((p) => ({
        name: p.title,
        url: `/blog/${p.slug}`,
        image: p.image,
      })),
    ),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <BlogView />
    </>
  );
}
