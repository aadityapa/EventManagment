"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Star, GitCompare } from "lucide-react";
import { venues } from "@/data/cms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function VenueMarketplace() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("ALL");
  const [compare, setCompare] = useState<string[]>([]);

  const cities = ["ALL", ...Array.from(new Set(venues.map((v) => v.city)))];

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase());
      const matchesCity = city === "ALL" || v.city === city;
      return matchesSearch && matchesCity;
    });
  }, [search, city]);

  const toggleCompare = (id: string) => {
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                city === c ? "gradient-gold text-black" : "glass-card hover:bg-primary/10"
              }`}
            >
              {c === "ALL" ? "All Cities" : c}
            </button>
          ))}
        </div>
      </div>

      {compare.length > 0 && (
        <div className="mb-6 glass-card flex items-center justify-between p-4">
          <span className="text-sm">
            <GitCompare className="mr-2 inline h-4 w-4" />
            {compare.length} venue{compare.length > 1 ? "s" : ""} selected for comparison
          </span>
          <Button size="sm" variant="outline">
            Compare Venues
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((venue) => (
          <article key={venue.id} className="glass-card overflow-hidden">
            <div className="relative h-48">
              <Image
                src={venue.images[0]}
                alt={venue.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{venue.name}</h3>
                  <p className="text-sm text-muted">{venue.city}</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {venue.rating}
                </div>
              </div>
              <p className="mt-3 text-sm text-muted line-clamp-2">{venue.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {venue.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {a}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">
                    {formatCurrency(venue.pricePerDay)}
                    <span className="text-sm font-normal text-muted">/day</span>
                  </p>
                  <p className="text-xs text-muted">Up to {venue.capacity} guests</p>
                </div>
                <Button
                  size="sm"
                  variant={compare.includes(venue.id) ? "default" : "outline"}
                  onClick={() => toggleCompare(venue.id)}
                >
                  <GitCompare className="h-4 w-4" />
                  Compare
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
