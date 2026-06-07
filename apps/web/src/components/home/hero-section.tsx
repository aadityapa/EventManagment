"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { EVENT_IMAGES } from "@/lib/images";
import { companyProfile } from "@/data/cms";
import { Button } from "@/components/ui/button";

const ROTATING_WORDS = [
  "Weddings",
  "Corporate Galas",
  "Concerts",
  "Celebrations",
];

const heroStats = [
  { label: "Events Managed", value: `${companyProfile.stats.eventsManaged}+` },
  { label: "Happy Clients", value: `${companyProfile.stats.happyClients}+` },
  { label: "Years Experience", value: `${companyProfile.stats.yearsExperience}+` },
  { label: "Cities Covered", value: `${companyProfile.stats.citiesCovered}+` },
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src={EVENT_IMAGES.hero}
        alt="Luxury event celebration"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Premier International Event Management</span>
          </motion.div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-balance">Crafting Extraordinary</span>
            <span className="relative mt-2 inline-flex h-[1.2em] min-w-[280px] items-center justify-center sm:min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className="gradient-text absolute"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl"
          >
            From intimate destination weddings to grand corporate galas — we
            transform visions into unforgettable experiences with meticulous
            planning and flawless execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="xl">
              <Link href="/book">
                <Calendar className="h-5 w-5" />
                Book Event
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/contact">
                Get Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl glass p-6 sm:grid-cols-4 sm:gap-4 sm:p-8"
        >
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/60 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-10 w-6 rounded-full border-2 border-white/30 p-1"
        >
          <div className="mx-auto h-2 w-1 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
