"use client";

import { motion } from "framer-motion";
import { CalendarDays, Gem, Landmark, Lightbulb, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TiltCard } from "@/components/effects/tilt-card";

type Expertise = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const EXPERTISE: Expertise[] = [
  { icon: Lightbulb, title: "Event Planning", description: "End-to-end planning tailored to your vision and objectives." },
  { icon: Landmark, title: "Venue Styling", description: "Transforming spaces with breathtaking décor and design." },
  { icon: Users, title: "Guest Experience", description: "Creating memorable experiences for you and your guests." },
  { icon: CalendarDays, title: "Corporate Events", description: "Professional events that inspire, engage and deliver results." },
  { icon: Gem, title: "Weddings", description: "Beautifully curated weddings that reflect your love story." },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.07 },
  }),
};

export function HomeExpertise() {
  return (
    <section id="expertise" className="lux-section" aria-labelledby="expertise-heading">
      <div className="brand-container">
        <div className="lux-section__head flex-col gap-4">
          <span className="lux-label">Our Expertise</span>
          <h2 id="expertise-heading" className="lux-heading">What We Create</h2>
        </div>

        <div className="lux-expertise-grid">
          {EXPERTISE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="h-full"
              >
                <TiltCard className="lux-card lux-expertise-card h-full">
                  <span className="lux-expertise-card__icon" aria-hidden>
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="lux-expertise-card__title">
                    {item.title}
                  </h3>
                  <p className="lux-expertise-card__copy">{item.description}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
