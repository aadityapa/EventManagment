"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "glitz-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9998] border-t border-[var(--glitz-border)] bg-[var(--glitz-glass)] p-4 backdrop-blur-xl safe-bottom md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-xl md:border md:shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--glitz-text)]">We value your privacy</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--glitz-muted)]">
            We use cookies to enhance your experience and analyze site traffic. By continuing, you agree to our{" "}
            <Link href="/privacy" className="text-[var(--glitz-gold)] underline-offset-2 hover:underline">Privacy Policy</Link>.
          </p>
          <button
            type="button"
            onClick={accept}
            className="btn-gold-metallic mt-3 rounded-lg px-4 py-2 text-xs font-semibold tap-target"
          >
            Accept
          </button>
        </div>
        <button
          type="button"
          onClick={accept}
          className="tap-target shrink-0 rounded-lg p-1 text-[var(--glitz-muted)] hover:text-[var(--glitz-text)]"
          aria-label="Dismiss cookie notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
