"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { IMAGES } from "@/lib/images";

const HERO_VIDEO = "";

const HEADLINE = "Creating Extraordinary Experiences That Last Forever";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsap();
    const video = videoRef.current;
    if (video) {
      gsap.to(video, {
        scale: 1.08,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }

    const words = headlineRef.current?.querySelectorAll("[data-word]");
    if (words?.length) {
      gsap.from(words, {
        y: 80,
        opacity: 0,
        rotateX: -40,
        duration: 1.2,
        stagger: 0.06,
        ease: "power4.out",
        delay: 0.3,
      });
    }
  }, []);

  const words = HEADLINE.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={IMAGES.hero.main}
          className="h-full w-full object-cover"
          aria-hidden
        >
          {HERO_VIDEO ? <source src={HERO_VIDEO} type="video/mp4" /> : null}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="container-page relative z-10 py-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          Nexyyra Events
        </motion.span>

        <h1
          ref={headlineRef}
          className="font-display mx-auto max-w-5xl text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.1] text-white"
          style={{ perspective: "800px" }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden px-[0.15em]">
              <span data-word className="inline-block">
                {word}
              </span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#B8B8B8] sm:text-lg md:text-xl"
        >
          Luxury Weddings, Corporate Events, Destination Celebrations &amp; Premium
          Experiences Across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="group min-w-[200px] bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
            asChild
          >
            <Link href="/book-event">
              Book Consultation
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-w-[200px] border-primary/40 bg-transparent text-white hover:bg-primary/10 hover:text-primary"
            asChild
          >
            <Link href="/portfolio">
              <Play className="mr-2 h-4 w-4" />
              View Portfolio
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-primary/40 p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
