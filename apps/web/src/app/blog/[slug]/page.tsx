import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/data/cms";
import { getBlogArticleContent } from "@/data/blog-content";
import { generateSEO, breadcrumbSchema, articleSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = getBlogArticleContent(slug);
  const paragraphs = content?.paragraphs ?? [post.excerpt];
  const wordCount = paragraphs.join(" ").split(/\s+/).length;
  const relatedSlugs = content?.relatedSlugs ?? blogPosts.filter((p) => p.slug !== slug).slice(0, 3).map((p) => p.slug);
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <article itemScope itemType="https://schema.org/Article">
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden md:h-[50vh]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl lg:text-5xl" itemProp="headline">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span itemProp="author">{post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.publishedAt} itemProp="datePublished">
                {formatDate(post.publishedAt)}
              </time>
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {post.readTime}
              </span>
            )}
          </div>

          <div className="prose prose-lg mt-10 max-w-none" itemProp="articleBody">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-6 text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {relatedPosts.length > 0 && (
            <aside className="mt-16 border-t border-border pt-10">
              <h2 className="font-display text-xl font-semibold">Related Reading</h2>
              <ul className="mt-6 space-y-4">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="group flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                      <div>
                        <span className="text-xs font-medium text-primary">{related.category}</span>
                        <p className="font-medium group-hover:text-primary">{related.title}</p>
                        <p className="mt-1 text-sm text-muted line-clamp-2">{related.excerpt}</p>
                      </div>
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
