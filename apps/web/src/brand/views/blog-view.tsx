import Link from "next/link";
import { Fragment } from "react";
import { assetForRole, blogLeadRole, EDITORIAL_BAND, type CurationAsset } from "@/brand/data/image-curation";
import { UiIcon } from "@/components/icons";
import {
  Accordion,
  Button,
  Cover,
  Deck,
  Eyebrow,
  Heading,
  InquiryPanel,
  MediaFrame,
  OnThisPage,
  Pagination,
  Prose,
  Section,
  Tabs,
} from "@/components/ui";
import { BRAND_REPLY_HOURS } from "@/brand/data/reply-hours";
import { blogPosts } from "@/data/cms";
import { BLOG_AUTHOR, blogCategorySlug, blogEventType, type BlogArticleContent } from "@/data/blog-content";
import type { ContextualLink } from "@/lib/wedding-internal-links";
import { formatDate } from "@/lib/utils";

export type BlogPost = (typeof blogPosts)[number];

export const BLOG_PAGE_SIZE = 12;

/** Categories in first-appearance order, straight from the published posts. */
export const BLOG_CATEGORIES: string[] = [...new Set(blogPosts.map((p) => p.category))];

const pad = (n: number) => String(n).padStart(2, "0");
const readLabel = (post: BlogPost) => `${post.readTime ?? "6 min"} read`;

/** The lead photo for a category; the editorial pool covers any category without one. */
export function blogLeadAsset(category: string): CurationAsset {
  return assetForRole(blogLeadRole(category)) ?? EDITORIAL_BAND[0];
}

/* ── Listing (/blog?c=&page=) ───────────────────────────────────────── */

export type BlogListing = {
  category?: string;
  categorySlug?: string;
  page: number;
  pageCount: number;
  /** Page 1 only: the newest post in the current filter. */
  featured?: BlogPost;
  rows: BlogPost[];
  total: number;
};

export function blogListingHref(page: number, categorySlug?: string): string {
  const query = new URLSearchParams();
  if (categorySlug) query.set("c", categorySlug);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

/**
 * Resolves the crawlable `?c=` / `?page=` params server-side. Returns null for an
 * unknown category or an out-of-range page so the route can 404 instead of
 * serving a duplicate of /blog.
 */
export function resolveBlogListing(c?: string, pageParam?: string): BlogListing | null {
  // Any `?c=` present (even empty) must be a known slug; the tabs only ever link slugs.
  const category = c !== undefined ? BLOG_CATEGORIES.find((name) => blogCategorySlug(name) === c) : undefined;
  if (c !== undefined && !category) return null;
  if (pageParam !== undefined && !/^[1-9]\d*$/.test(pageParam)) return null;

  const posts = category ? blogPosts.filter((p) => p.category === category) : blogPosts;
  // The featured post leads page 1; the index paginates the rest.
  const pool = posts.slice(1);
  const pageCount = Math.max(1, Math.ceil(pool.length / BLOG_PAGE_SIZE));
  const page = pageParam ? Number(pageParam) : 1;
  if (page > pageCount) return null;

  return {
    category,
    categorySlug: category ? blogCategorySlug(category) : undefined,
    page,
    pageCount,
    featured: page === 1 ? posts[0] : undefined,
    rows: pool.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE),
    total: posts.length,
  };
}

/** Post index rows: date + category, Cormorant title, excerpt, read time. Shared by /blog and Related. */
export function BlogPostRows({ posts, location }: { posts: BlogPost[]; location: string }) {
  return (
    <ol className="pg-blog-index" role="list">
      {posts.map((post) => (
        <li key={post.slug} className="pg-blog-row">
          <Link
            href={`/blog/${post.slug}`}
            prefetch={false}
            className="pg-blog-row__link"
            data-cta="blog_post"
            data-cta-location={location}
          >
            <span className="pg-blog-row__meta">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span className="pg-blog-row__category">{post.category}</span>
            </span>
            <Heading as="h3" className="pg-blog-row__title">
              {post.title}
            </Heading>
            <span className="pg-blog-row__excerpt">{post.excerpt}</span>
            <span className="pg-blog-row__time">{readLabel(post)}</span>
            <UiIcon name="arrow-right" size={20} className="pg-blog-row__arrow" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <>
      {BLOG_AUTHOR}
      <span aria-hidden="true"> · </span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden="true"> · </span>
      {readLabel(post)}
    </>
  );
}

export function BlogView({ listing }: { listing: BlogListing }) {
  const { category, categorySlug, page, pageCount, featured, rows } = listing;
  const tabs = [
    { href: "/blog", label: "All", count: blogPosts.length },
    ...BLOG_CATEGORIES.map((name) => ({
      href: blogListingHref(1, blogCategorySlug(name)),
      label: name,
      count: blogPosts.filter((p) => p.category === name).length,
    })),
  ];
  let chapter = 0;

  return (
    <div className="lux-page">
      <Cover
        size="text"
        eyebrow="Journal"
        title="Planning notes"
        lead="Practical guides to weddings, corporate events and celebrations — budgets, venues, timelines and the questions to ask before you book."
        primary={{ href: "#inquire", cta: "blog_cover_proposal" }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />

      <Tabs items={tabs} current={blogListingHref(1, categorySlug)} ariaLabel="Blog categories" className="pg-blog-tabs" />

      {featured ? (
        <section id="featured" className="lux-section" aria-labelledby="featured-title">
          <span className="lux-folio" aria-hidden="true">
            {pad(++chapter)}
          </span>
          <div className="pg-blog-featured">
            <MediaFrame
              asset={blogLeadAsset(featured.category).id}
              ratio="3:2"
              sizes="(min-width:1024px) 58vw, 100vw"
              className="pg-blog-featured__media"
            />
            <div className="pg-blog-featured__text">
              <Eyebrow rule="leading">{featured.category}</Eyebrow>
              <Heading as="h2" id="featured-title">
                {featured.title}
              </Heading>
              <p className="lux-lead">{featured.excerpt}</p>
              <p className="lux-small">
                <PostMeta post={featured} />
              </p>
              <Button
                variant="text"
                href={`/blog/${featured.slug}`}
                arrow
                cta="blog_featured"
                location="blog_index"
                aria-label={`Read the article: ${featured.title}`}
              >
                Read the article
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {rows.length > 0 ? (
        <Section
          id="notes"
          number={pad(++chapter)}
          eyebrow={category ?? "All notes"}
          title={category ? `More on ${category.toLowerCase()}` : "Every planning note"}
          lead={pageCount > 1 ? `Page ${page} of ${pageCount}` : undefined}
          lazy
        >
          <BlogPostRows posts={rows} location="blog_index" />
          <Pagination
            page={page}
            pageCount={pageCount}
            hrefFor={(p) => blogListingHref(p, categorySlug)}
            ariaLabel="Blog pages"
            className="pg-blog-pagination"
          />
        </Section>
      ) : null}

      <InquiryPanel
        source="contact"
        variant="compact"
        lead={`Have a question these notes did not answer? ${BRAND_REPLY_HOURS} Your itemised proposal follows within 48 hours of a free consultation.`}
      />
    </div>
  );
}

/* ── Article (/blog/[slug]) ─────────────────────────────────────────── */

export type BlogArticleViewProps = {
  post: BlogPost;
  content?: BlogArticleContent;
  related: BlogPost[];
  links: ContextualLink[];
  faqs: { question: string; answer: string }[];
};

export function BlogArticleView({ post, content, related, links, faqs }: BlogArticleViewProps) {
  const lead = blogLeadAsset(post.category);
  const sections = content?.sections ?? [];
  const intro = content?.intro ?? [post.excerpt];
  const deck = content?.deck;
  // Chapters after the article continue its numbering.
  let chapter = sections.length;

  return (
    <div className="lux-page">
      <Cover
        size="text"
        eyebrow={post.category}
        title={post.title}
        lead={
          <>
            {post.excerpt}
            <span className="pg-blog-cover-meta">
              <PostMeta post={post} />
            </span>
          </>
        }
        primary={{ href: "#inquire", cta: "blog_post_cover_proposal" }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <MediaFrame asset={lead.id} ratio="3:2" sizes="(min-width:1280px) 72rem, 100vw" className="pg-blog-lead" />

      <div className={sections.length ? "pg-blog-article" : "pg-blog-article pg-blog-article--single"}>
        {sections.length ? (
          <OnThisPage items={sections.map((s) => ({ href: `#${s.id}`, label: s.heading }))} className="pg-blog-contents" />
        ) : null}
        <Prose as="article" dropcap className="pg-blog-body">
          {intro.map((p, i) => (
            <p key={`intro-${i}`}>{p}</p>
          ))}
          {/* Flat children: .lux-prose spacing, the h2 counter and the drop cap all key off direct children. */}
          {sections.map((section, i) => (
            <Fragment key={section.id}>
              <h2 id={section.id}>{section.heading}</h2>
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {deck && deck.after === i + 1 ? <Deck>{deck.text}</Deck> : null}
            </Fragment>
          ))}
        </Prose>
      </div>

      {related.length > 0 || links.length > 0 ? (
        <Section id="related" number={pad(++chapter)} eyebrow="Related" title={`More on ${post.category.toLowerCase()}`} lazy>
          {related.length > 0 ? <BlogPostRows posts={related} location="blog_related" /> : null}
          {links.length > 0 ? (
            <ul className="pg-blog-links" role="list" aria-label="Related pages">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className="lux-link pg-blog-links__link" data-cta="blog_contextual" data-cta-location="blog_related">
                    {link.label}
                  </Link>
                  {link.description ? <span className="lux-small">{link.description}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      <InquiryPanel source="contact" variant="compact" defaultEventType={blogEventType(post.category)} />

      {faqs.length > 0 ? (
        <Section id="questions" number={pad(++chapter)} eyebrow="Questions" title="Questions on this topic" lazy>
          <Accordion
            name="blog-faq"
            schema
            items={faqs.map((faq, i) => ({ id: `faq-${i + 1}`, question: faq.question, answer: faq.answer }))}
          />
        </Section>
      ) : null}
    </div>
  );
}
