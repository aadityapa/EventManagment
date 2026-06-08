"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { blogPosts } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["All", "Weddings", "Corporate", "Trends", "Sustainability"];

export function BlogPageContent() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <>
      <CinematicHero
        label="The Glitz Journal"
        title="Event Insights & Inspiration"
        subtitle="Editorial perspectives on luxury celebrations, corporate excellence, and industry trends."
        image={IMAGES.blog[0]}
        size="full"
      />

      <PageSection>
        <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-2xl luxury-card lg:grid-cols-2">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px]">
            <LuxuryImage src={featured.image} alt={featured.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute left-6 top-6 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">Featured</span>
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
              ))}
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold group-hover:text-primary sm:text-3xl lg:text-4xl">{featured.title}</h2>
            <p className="mt-4 text-muted leading-relaxed">{featured.excerpt}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted">
              <span>{featured.author}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(featured.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 6 min read</span>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </PageSection>

      <PageSection dark={false} className="bg-card">
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span key={cat} className="rounded-full border border-border/60 px-4 py-2 text-xs font-semibold text-muted">{cat}</span>
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group luxury-card block overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <LuxuryImage src={post.image} alt={post.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs font-semibold text-primary">{tag}</span>
                    ))}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-primary">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>{post.author}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
