import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Lightbulb } from "lucide-react";
import { blogPosts } from "@/data/cms";
import { getBlogArticleContent, getBlogKeyTakeaways } from "@/data/blog-content";
import { generateSEO, breadcrumbSchema, articleSchema, faqSchema, howToSchema } from "@/lib/seo";
import { getBlogFaqs, getBlogHowTo } from "@/lib/geo-content";
import { getBlogContextualLinks } from "@/lib/wedding-internal-links";
import { ContextualLinksBlock } from "@/components/seo/contextual-links-block";
import { formatDate } from "@/lib/utils";
import { GlassPanel } from "@/brand/primitives/glass-panel";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return generateSEO({ title: "Post Not Found", noIndex: true });

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.image,
    type: "article",
    blogPost: true,
    publishedTime: post.publishedAt,
    authors: [post.author],
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = getBlogArticleContent(slug);
  const paragraphs = content?.paragraphs ?? [post.excerpt];
  const keyTakeaways = getBlogKeyTakeaways(slug, post.excerpt);
  const wordCount = paragraphs.join(" ").split(/\s+/).length;
  const relatedSlugs =
    content?.relatedSlugs ?? blogPosts.filter((p) => p.slug !== slug).slice(0, 3).map((p) => p.slug);
  const relatedPosts = relatedSlugs
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is (typeof blogPosts)[number] => Boolean(p))
    .slice(0, 3);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);
  const article = articleSchema({
    title: post.title,
    description: post.excerpt,
    slug,
    image: post.image,
    author: post.author,
    publishedAt: post.publishedAt,
    tags: post.tags,
    section: post.category,
    wordCount,
  });
  const blogFaqs = getBlogFaqs(slug);
  const contextualLinks = getBlogContextualLinks(slug);
  const faqLd = blogFaqs.length > 0 ? faqSchema(blogFaqs) : null;
  const howToData = getBlogHowTo(slug);
  const howToLd = howToData
    ? howToSchema({
        name: post.title,
        description: post.excerpt,
        slug,
        steps: howToData.steps,
        totalTime: howToData.totalTime,
      })
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      {howToLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />}

      <article itemScope itemType="https://schema.org/Article" className="brand-root">
        {/* Hero image */}
        <div className="relative h-[45vh] min-h-[320px] overflow-hidden md:h-[55vh]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBQEAAAAAAAAAAAAAAQIDAAQRBQYhEjFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AzmitzJqcpJTyFslZ0k+or6VYYqSlJTyFslZ0k+or6VYY//Z"
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/40 to-black/20" />
        </div>

        <div className="brand-container max-w-3xl py-12 sm:py-16">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-[var(--glitz-gold)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Journal
          </Link>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--glitz-gold)]/30 bg-[var(--glitz-gold)]/5 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--glitz-surface)] px-3 py-1 text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="v4-display mt-6 text-[clamp(2rem,1.2rem+4vw,3.5rem)] leading-tight"
            itemProp="headline"
          >
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span itemProp="author">{post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
              <time dateTime={post.publishedAt} itemProp="datePublished">
                {formatDate(post.publishedAt)}
              </time>
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                {post.readTime}
              </span>
            )}
          </div>

          {/* TL;DR / Key takeaways — GEO extractable */}
          <aside
            className="mt-10"
            aria-label="Key takeaways"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <GlassPanel className="p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--glitz-gold)]" aria-hidden="true" />
                <h2 className="v4-title text-lg">TL;DR — Key Takeaways</h2>
              </div>
              <p className="v4-standfirst mt-3 text-muted">{post.excerpt}</p>
              <ul className="mt-4 space-y-2" itemProp="itemListElement">
                {keyTakeaways.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-primary"
                    itemProp="name"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--glitz-gold)]" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </aside>

          {/* Article body — editorial typography */}
          <div
            className="v4-body mt-12 max-w-none space-y-6 text-primary leading-relaxed"
            itemProp="articleBody"
          >
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[length:var(--v4-text-body)] text-muted leading-[var(--v4-leading-body,1.75)]">
                {p}
              </p>
            ))}
          </div>

          {contextualLinks.length > 0 && (
            <ContextualLinksBlock
              title="Related Pages"
              links={contextualLinks}
              className="mt-16 border-t border-[var(--glitz-border)] pt-10"
            />
          )}

          {relatedPosts.length > 0 && (
            <aside className="mt-16 border-t border-[var(--glitz-border)] pt-10">
              <span className="v4-kicker mb-4">Continue Reading</span>
              <h2 className="v4-title text-xl">Related Stories</h2>
              <ul className="mt-6 space-y-4">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="group block rounded-[var(--v4-radius-lg)] transition-transform hover:-translate-y-0.5"
                    >
                      <GlassPanel liquid={false} className="flex items-start gap-3 p-4">
                        <ArrowRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glitz-gold)] opacity-60 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                        <div>
                          <span className="text-xs font-semibold text-[var(--glitz-gold)]">
                            {related.category}
                          </span>
                          <p className="font-display font-medium group-hover:text-[var(--glitz-gold)]">
                            {related.title}
                          </p>
                          <p className="mt-1 text-sm text-muted line-clamp-2">{related.excerpt}</p>
                        </div>
                      </GlassPanel>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>
    </>
  );
}
