"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarCheck, Smile, Award, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Counter = { icon: LucideIcon; end: number; suffix: string; label: string };

const COUNTERS: Counter[] = [
  { icon: CalendarCheck, end: 100, suffix: "+", label: "Events Delivered" },
  { icon: Smile, end: 150, suffix: "+", label: "Happy Clients" },
  { icon: Award, end: 5, suffix: "+", label: "Years of Experience" },
  { icon: Users, end: 20, suffix: "+", label: "Expert Planners" },
];

function CountUp({ end, suffix, active }: { end: number; suffix: string; active: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export function HomeCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="lux-section lux-section--tight" aria-label="Nexyyra by the numbers">
      <div className="brand-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lux-card lux-counters"
        >
          {COUNTERS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="lux-counter">
                <span className="lux-counter__icon" aria-hidden>
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="lux-counter__value">
                    <CountUp end={c.end} suffix={c.suffix} active={inView} />
                  </p>
                  <p className="lux-counter__label">{c.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
