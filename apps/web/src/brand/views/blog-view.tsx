"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { blogPosts } from "@/data/cms";
import { BLOG_CATEGORIES, BLOG_TOPIC_TEMPLATES } from "@/data/blog-topics";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS = ["All", ...BLOG_CATEGORIES] as const;

export function BlogView() {
  const [category, setCategory] = useState<(typeof CATEGORY_FILTERS)[number]>("All");
  const featured = blogPosts[0];

  const filteredPosts =
    category === "All" ? blogPosts : blogPosts.filter((p) => p.category === category);

  const topicPreview =
    category === "All"
      ? BLOG_TOPIC_TEMPLATES.slice(0, 6)
      : BLOG_TOPIC_TEMPLATES.filter((t) => t.category === category).slice(0, 6);

  return (
    <div className="brand-root">
      <BrandPageHero label="The Glitz Journal" title="Event Insights" subtitle="Editorial perspectives on luxury celebrations." image={BRAND_IMAGES.blog[0]} />

      <BrandSection>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold",
                category === c ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
              )}
            >
              {c}
              {c !== "All" && (
                <span className="ml-1 opacity-60">
                  ({BLOG_TOPIC_TEMPLATES.filter((t) => t.category === c).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {category === "All" && (
          <Link href={`/blog/${featured.slug}`} className="group brand-surface mb-10 grid overflow-hidden lg:grid-cols-2">
            <div className="relative min-h-[360px]">
              <BrandImage src={featured.image} alt={featured.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute left-6 top-6 rounded-full bg-[var(--glitz-gold)] px-4 py-1 text-xs font-bold text-[#0A0A0A]">Featured</span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="flex gap-2">
                {featured.tags.map((t) => (
                  <span key={t} className="text-xs font-semibold text-[var(--glitz-gold)]">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 brand-display text-2xl font-bold group-hover:text-[var(--glitz-gold)] sm:text-4xl">{featured.title}</h2>
              <p className="mt-4 text-muted leading-relaxed">{featured.excerpt}</p>
              <div className="mt-6 flex gap-4 text-sm text-muted">
                <span>{featured.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(featured.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {featured.readTime ?? "6 min"}
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {(category === "All" ? blogPosts.slice(1) : filteredPosts).map((post) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link href={`/blog/${post.slug}`} className="group brand-surface block overflow-hidden">
                <div className="relative h-56">
                  <BrandImage src={post.image} alt={post.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-[var(--glitz-gold)]">{post.category}</span>
                  <h3 className="brand-display text-xl font-semibold group-hover:text-[var(--glitz-gold)]">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-muted">
                    {post.author} · {formatDate(post.publishedAt)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </BrandSection>

      <BrandSection alt>
        <h2 className="mb-2 text-center brand-display text-2xl font-semibold">Editorial Pipeline</h2>
        <p className="mb-8 text-center text-sm text-muted">
          {blogPosts.length} published articles across {BLOG_CATEGORIES.length} categories — curated for luxury event hosts.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicPreview.map((topic) => (
            <div key={topic.slug} className="brand-surface p-5 opacity-90">
              <span className="text-xs font-semibold text-[var(--glitz-gold)]">{topic.category}</span>
              <h3 className="mt-2 text-sm font-semibold leading-snug">{topic.title}</h3>
              <p className="mt-2 text-xs text-muted line-clamp-2">{topic.excerpt}</p>
              <p className="mt-3 text-xs text-muted">Coming soon · {topic.readTime}</p>
            </div>
          ))}
        </div>
      </BrandSection>
    </div>
  );
}
