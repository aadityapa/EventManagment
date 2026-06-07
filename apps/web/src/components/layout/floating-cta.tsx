"use client";

import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function FloatingCTA() {
  return (
    <>
      {/* Mobile + tablet sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 backdrop-blur-xl safe-bottom md:hidden">
        <div className="container-page flex gap-2 py-2">
          <Button variant="outline" className="flex-1" size="lg" asChild>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
              <Phone className="h-4 w-4" />
              Call
            </a>
          </Button>
          <Button className="flex-[2]" size="lg" asChild>
            <Link href="/book-event">
              <Calendar className="h-4 w-4" />
              Book Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop floating button */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <Button size="lg" className="shadow-glow" asChild>
          <Link href="/book-event">
            <Calendar className="h-5 w-5" />
            Book Your Event
          </Link>
        </Button>
      </div>
    </>
  );
}
