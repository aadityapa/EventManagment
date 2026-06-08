"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BrandImage } from "./brand-image";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";

interface BrandHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
  full?: boolean;
  children?: ReactNode;
}

export function BrandHero({ label, title, subtitle, image, video, full = false, children }: BrandHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsap();
    if (bgRef.current) {
      gsap.to(bgRef.current, { scale: 1.07, duration: 22, ease: "none", repeat: -1, yoyo: true });
    }
    const words = titleRef.current?.querySelectorAll("[data-word]");
    if (words?.length) {
      gsap.from(words, { y: 60, opacity: 0, duration: 1, stagger: 0.05, ease: "power3.out", delay: 0.2 });
    }
  }, [title]);

  const words = title.split(" ");

  return (
    <section className={`relative overflow-hidden border-b border-[var(--glitz-border)] ${full ? "min-h-[100dvh]" : "min-h-[55vh] pt-16"}`}>
      <div ref={bgRef} className="absolute inset-0 origin-center">
        {video ? (
          <video autoPlay muted loop playsInline poster={image} className="h-full w-full object-cover" aria-hidden>
            <source src={video} type="video/mp4" />
          </video>
        ) : image ? (
          <BrandImage src={image} alt="" fill priority sizes="100vw" aria-hidden />
        ) : null}
        <div className="absolute inset-0 bg-[var(--glitz-gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_65%)]" />
      </div>
      <div className={`brand-container relative z-10 flex flex-col justify-end ${full ? "min-h-[100dvh] pb-20 pt-28" : "pb-16 pt-32"}`}>
        {label && <span className="brand-label mb-4">{label}</span>}
        <h1 ref={titleRef} className="brand-display max-w-5xl text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.08]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.2em] inline-block overflow-hidden">
              <span data-word className="inline-block">{w}</span>
            </span>
          ))}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--glitz-muted)] sm:text-lg">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function BrandPageHero(props: Omit<BrandHeroProps, "full">) {
  return <BrandHero {...props} full={false} />;
}
