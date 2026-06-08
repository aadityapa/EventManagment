"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/cms";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StitchGlowCard, StitchSection } from "@/components/stitch";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-none text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const autoplay = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <StitchSection className="relative bg-white">
      <div className="container-page relative">
        <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" />

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <StitchGlowCard hover3d={false} className="h-full">
                    <CardContent className="flex h-full flex-col p-6 sm:p-8">
                      <Quote className="mb-4 h-8 w-8 text-primary/40" />
                      <p className="flex-1 text-base leading-relaxed text-foreground/90">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/30">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted">{testimonial.role}</p>
                          <StarRating rating={testimonial.rating} />
                        </div>
                      </div>
                    </CardContent>
                  </StitchGlowCard>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </StitchSection>
  );
}
