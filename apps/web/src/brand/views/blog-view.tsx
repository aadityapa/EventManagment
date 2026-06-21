"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { blogPosts } from "@/data/cms";
import { BLOG_CATEGORIES, BLOG_TOPIC_TEMPLATES } from "@/data/blog-topics";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
import { formatDate, cn } from "@/lib/utils";

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
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.blog[0]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">The Glitz Journal</span>
            <h1 className="v4-display text-white">
              Event <span className="v4-gold-text">Insights</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Editorial perspectives on luxury celebrations, corporate strategy, and destination
              design.
            </p>
          </GlassPanel>
        </div>
      </section>

      <section className="v4-section">
        <div className="brand-container">
          {/* Category chips */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                  category === c
                    ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
                    : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
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

          {/* Featured story */}
          {category === "All" && (
            <ScrollReveal preset="reveal" className="mb-12">
              <Link href={`/blog/${featured.slug}`} className="group block">
                <GlassPanel className="grid overflow-hidden p-0 lg:grid-cols-2">
                  <div className="relative min-h-[360px] overflow-hidden">
                    <BrandImage
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-6 top-6 rounded-full bg-[var(--glitz-gold)] px-4 py-1 text-xs font-bold text-[#0A0A0A]">
                      Featured Story
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="flex flex-wrap gap-2">
                      {featured.tags.map((t) => (
                        <span key={t} className="text-xs font-semibold text-[var(--glitz-gold)]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="v4-title mt-4 group-hover:text-[var(--glitz-gold)]">
                      {featured.title}
                    </h2>
                    <p className="v4-body mt-4 text-muted">{featured.excerpt}</p>
                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
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
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--glitz-gold)]">
                      Read story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </GlassPanel>
              </Link>
            </ScrollReveal>
          )}

          {/* Article grid */}
          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {(category === "All" ? blogPosts.slice(1) : filteredPosts).map((post) => (
              <motion.div key={post.slug} variants={staggerItem}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <GlassPanel className="h-full overflow-hidden p-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--v4-glow-gold)]">
                    <div className="relative h-56 overflow-hidden">
                      <BrandImage
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <span className="v4-kicker text-[0.65rem]">{post.category}</span>
                      <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-[var(--glitz-gold)]">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                      <p className="mt-4 text-xs text-muted">
                        {post.author} · {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </GlassPanel>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Editorial pipeline */}
      <section className="v4-section-lg v4-dune-glow border-t border-[var(--glitz-border)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal" className="text-center">
            <span className="v4-kicker mb-4">Coming Soon</span>
            <h2 className="v4-title">Editorial Pipeline</h2>
            <p className="v4-body mx-auto mt-3 max-w-xl text-muted">
              {blogPosts.length} published articles across {BLOG_CATEGORIES.length} categories —
              curated for luxury event hosts.
            </p>
          </ScrollReveal>
          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {topicPreview.map((topic) => (
              <motion.div key={topic.slug} variants={staggerItem}>
                <GlassPanel className="h-full p-5 opacity-90">
                  <span className="text-xs font-semibold text-[var(--glitz-gold)]">{topic.category}</span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug">{topic.title}</h3>
                  <p className="mt-2 text-xs text-muted line-clamp-2">{topic.excerpt}</p>
                  <p className="mt-3 text-xs text-muted">Coming soon · {topic.readTime}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
