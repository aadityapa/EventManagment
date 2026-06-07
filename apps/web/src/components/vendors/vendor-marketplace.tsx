"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";
import { vendors } from "@/data/cms";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function VendorMarketplace() {
  const [category, setCategory] = useState("ALL");

  const filtered = useMemo(() => {
    if (category === "ALL") return vendors;
    return vendors.filter((v) => v.category === category);
  }, [category]);

  const categories = ["ALL", ...VENDOR_CATEGORIES.filter((c) =>
    vendors.some((v) => v.category === c)
  )];

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              category === cat
                ? "gradient-gold text-black shadow-glow"
                : "glass-card hover:bg-primary/10"
            )}
          >
            {cat === "ALL" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vendor) => (
          <article key={vendor.id} className="glass-card overflow-hidden">
            <div className="relative h-40">
              <Image
                src={vendor.images[0]}
                alt={vendor.businessName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold">{vendor.businessName}</h3>
                {vendor.verified && (
                  <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted">{vendor.category} · {vendor.city}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {vendor.rating}
                </div>
                <span className="text-sm font-medium text-primary">{vendor.priceRange}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
