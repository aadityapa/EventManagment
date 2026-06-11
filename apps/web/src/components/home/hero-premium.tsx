"use client";

import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ScrollIndicator } from "@/components/effects/scroll-indicator";
import { GoldParticles } from "@/components/effects/gold-particles";
import { CircularMotionBackground } from "@/components/effects/circular-motion-background";
import { Hero3DCarousel } from "@/components/home/hero-3d-carousel";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { SITE_CONFIG } from "@/lib/constants";

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Glitz Events, I'd like to discuss an event.")}`;

const SUB_POINTS = [
  "Premium Event Planning",
  "Wedding Management",
  "Corporate Events",
  "Brand Promotions",
];

const contentVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.8, ease: "easeOut" as const },
  }),
};

export function HeroPremium() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsap();
    const words = headlineRef.current?.querySelectorAll("[data-word]");
    if (!words?.length) return;
    gsap.from(words, {
      y: 70,
      opacity: 0,
      duration: 1,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.35,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] h-[100vh] flex-col overflow-hidden border-b border-[#D4AF37]/10 bg-[#000000]"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(212,175,55,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        <CircularMotionBackground className="opacity-70" />
        <GoldParticles className="opacity-35" />
      </div>

      <div className="brand-container relative z-10 flex flex-1 flex-col justify-center pt-24 pb-16 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12 xl:gap-16">
          {/* Left — content */}
          <div className="max-w-xl">
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="inline-block text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D4AF37] md:text-xs"
            >
              Glitz Events & Promotions
            </motion.span>

            <h1
              ref={headlineRef}
              className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.06] text-white"
            >
              {"Creating Extraordinary Experiences".split(" ").map((word, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden">
                  <span data-word className="inline-block">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <motion.ul
              custom={1}
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/75 md:text-base"
            >
              {SUB_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                  {point}
                </li>
              ))}
            </motion.ul>

            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <MagneticButton>
                <BrandButton href="/book-event" className="min-w-[180px] bg-[#D4AF37] hover:bg-[#F4E08D]">
                  Book Event
                </BrandButton>
              </MagneticButton>
              <MagneticButton>
                <BrandButton href="/book-event" variant="outline" className="min-w-[180px] border-[#D4AF37]/40">
                  Get Free Consultation
                </BrandButton>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] min-w-[180px] items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#25D366]/20"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right — 3D carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
          >
            <Hero3DCarousel />
          </motion.div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
