"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { testimonials } from "@/data/cms";
import { cn } from "@/lib/utils";

export function TestimonialsView() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [sel, setSel] = useState(0);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const fn = () => setSel(emblaApi.selectedScrollSnap());
    emblaApi.on("select", fn); fn();
    const t = setInterval(() => emblaApi.scrollNext(), 7000);
    return () => { clearInterval(t); emblaApi.off("select", fn); };
  }, [emblaApi]);

  return (
    <div className="brand-root">
      <BrandPageHero label="Client Stories" title="Voices of Excellence" subtitle="Trusted by India's most discerning clients." image={BRAND_IMAGES.testimonials[0]} />
      <BrandSection>
        <div className="mb-6 flex justify-end gap-2">
          <button type="button" onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)]" aria-label="Previous"><ChevronLeft /></button>
          <button type="button" onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)]" aria-label="Next"><ChevronRight /></button>
        </div>
        <div ref={emblaRef} className="overflow-hidden"><div className="flex gap-6">{testimonials.map((t, i) => (
          <div key={t.id} className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_70%]">
            <div className={cn("brand-surface flex flex-col gap-6 p-8 sm:flex-row sm:items-center", sel !== i && "opacity-70")}>
              <BrandImage src={t.image} alt={t.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full border-2 border-[var(--glitz-gold)]/40" />
              <div><Quote className="mb-2 h-5 w-5 text-[var(--glitz-gold)]/50" /><div className="mb-2 flex gap-1">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" />)}</div><blockquote className="brand-display text-lg">&ldquo;{t.content}&rdquo;</blockquote><p className="mt-3 font-semibold">{t.name}</p><p className="text-sm text-[var(--glitz-muted)]">{t.role}</p></div>
            </div>
          </div>
        ))}</div></div>
      </BrandSection>
      <BrandSection alt>
        <BrandHeader label="Google Reviews" title="4.9 Star Excellence" center />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{testimonials.map((t) => (
          <article key={t.id} className="brand-surface p-6"><div className="flex gap-1">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" />)}</div><p className="mt-3 text-sm text-[var(--glitz-muted)] line-clamp-4">&ldquo;{t.content}&rdquo;</p><div className="mt-4 flex items-center gap-3"><BrandImage src={t.image} alt={t.name} width={40} height={40} className="h-10 w-10 rounded-full" /><div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-[var(--glitz-muted)]">{t.role}</p></div></div></article>
        ))}</div>
      </BrandSection>
    </div>
  );
}
