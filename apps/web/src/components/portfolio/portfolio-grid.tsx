"use client";

import { useState } from "react";
import Image from "next/image";
import { portfolioItems } from "@/data/cms";
import { cn } from "@/lib/utils";

const eventTypes = ["ALL", ...Array.from(new Set(portfolioItems.map((p) => p.eventType)))];

export function PortfolioGrid() {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? portfolioItems
      : portfolioItems.filter((p) => p.eventType === filter);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              filter === type
                ? "gradient-gold text-black shadow-glow"
                : "glass-card hover:bg-primary/10"
            )}
          >
            {type === "ALL" ? "All Events" : type.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="group glass-card overflow-hidden">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {item.eventType.replace(/_/g, " ")}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {item.location} · {item.guestCount.toLocaleString()} guests
              </p>
              <p className="mt-3 text-sm text-muted">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
