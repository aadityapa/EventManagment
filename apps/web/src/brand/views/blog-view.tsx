"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { blogPosts } from "@/data/cms";
import { formatDate } from "@/lib/utils";

export function BlogView() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="brand-root">
      <BrandPageHero label="The Glitz Journal" title="Event Insights" subtitle="Editorial perspectives on luxury celebrations." image={BRAND_IMAGES.blog[0]} />
      <BrandSection>
        <Link href={`/blog/${featured.slug}`} className="group brand-surface grid overflow-hidden lg:grid-cols-2">
          <div className="relative min-h-[360px]"><BrandImage src={featured.image} alt={featured.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" /><span className="absolute left-6 top-6 rounded-full bg-[var(--glitz-gold)] px-4 py-1 text-xs font-bold text-[#0A0A0A]">Featured</span></div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex gap-2">{featured.tags.map((t) => <span key={t} className="text-xs font-semibold text-[var(--glitz-gold)]">{t}</span>)}</div>
            <h2 className="mt-4 brand-display text-2xl font-bold group-hover:text-[var(--glitz-gold)] sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 text-[var(--glitz-muted)] leading-relaxed">{featured.excerpt}</p>
            <div className="mt-6 flex gap-4 text-sm text-[var(--glitz-muted)]"><span>{featured.author}</span><span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(featured.publishedAt)}</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />6 min</span></div>
          </div>
        </Link>
      </BrandSection>
      <BrandSection alt>
        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((post) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link href={`/blog/${post.slug}`} className="group brand-surface block overflow-hidden">
                <div className="relative h-56"><BrandImage src={post.image} alt={post.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" /></div>
                <div className="p-6"><h3 className="brand-display text-xl font-semibold group-hover:text-[var(--glitz-gold)]">{post.title}</h3><p className="mt-2 text-sm text-[var(--glitz-muted)] line-clamp-2">{post.excerpt}</p><p className="mt-4 text-xs text-[var(--glitz-muted)]">{post.author} · {formatDate(post.publishedAt)}</p></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </BrandSection>
    </div>
  );
}
