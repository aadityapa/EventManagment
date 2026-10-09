import { notFound } from "next/navigation";
import { BlogArticleView, blogLeadAsset, type BlogPost } from "@/brand/views/blog-view";
import { JsonLd } from "@/components/ui";
import { blogPosts } from "@/data/cms";
import { BLOG_AUTHOR, blogWordCount, getBlogArticleContent } from "@/data/blog-content";
import { getBlogFaqs } from "@/lib/geo-content";
import { articleSchema, generateSEO } from "@/lib/seo";
import { getBlogContextualLinks } from "@/lib/wedding-internal-links";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

// Only published posts exist; any other slug is a real 404, not an on-demand render.
export const dynamicParams = false;

/**
 * Search titles for posts whose headline would run past 65 characters with the
 * " | Nexyyra Events" suffix. The H1 keeps the full headline.
 */
const SEO_TITLES: Record<string, string> = {
  "hidden-event-expenses-corporate": "Hidden Corporate Event Expenses to Budget For",
  "concert-production-pune": "Stadium Concert Production in Pune",
  "vendor-coordination-wedding-tips": "Wedding Vendor Coordination Tips",
  "sangeet-night-planning-guide": "Sangeet Night Planning Guide",
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  // OG image stays the site default (no per-post card).
  return generateSEO({
    title: SEO_TITLES[slug] ?? post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    authors: [BLOG_AUTHOR],
    tags: post.tags,
  });
}

/** Three rows: same category first (newest first), then the article's own picks, then the newest of the rest. */
function relatedPosts(post: BlogPost, picks: string[] = []): BlogPost[] {
  const others = blogPosts.filter((p) => p.slug !== post.slug);
  const ordered = [
    ...others.filter((p) => p.category === post.category),
    ...picks.map((s) => others.find((p) => p.slug === s)).filter((p): p is BlogPost => Boolean(p)),
    ...others,
  ];
  return [...new Map(ordered.map((p) => [p.slug, p])).values()].slice(0, 3);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = getBlogArticleContent(slug);
  const article = articleSchema({
    title: post.title,
    description: post.excerpt,
    slug,
    image: blogLeadAsset(post.category).src,
    author: BLOG_AUTHOR,
    publishedAt: post.publishedAt,
    tags: post.tags,
    section: post.category,
    wordCount: content ? blogWordCount(content) : undefined,
  });

  return (
    <>
      {/* Published as the house: articleSchema's author is the Organization. */}
      <JsonLd data={article} />
      <BlogArticleView
        post={post}
        content={content}
        related={relatedPosts(post, content?.relatedSlugs)}
        links={getBlogContextualLinks(slug)}
        faqs={getBlogFaqs(slug)}
      />
    </>
  );
}
