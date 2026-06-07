"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      <Button size="lg" className="shadow-glow" asChild>
        <Link href="/book-event">
          <Calendar className="h-5 w-5" />
          Book Your Event
        </Link>
      </Button>
    </div>
  );
}
