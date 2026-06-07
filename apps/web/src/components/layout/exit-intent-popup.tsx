"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("exit-intent-shown");
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
        sessionStorage.setItem("exit-intent-shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-card relative max-w-md p-8 text-center shadow-glow">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-primary/10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="font-display text-2xl font-bold">Wait! Before You Go...</h3>
        <p className="mt-3 text-muted">
          Get a free consultation for your dream event. Our experts are ready to help.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/book-event">Book Free Consultation</Link>
          </Button>
          <Button variant="outline" onClick={() => setVisible(false)}>
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}
