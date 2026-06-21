"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "nexyyra-exit-offer-shown";
const PAGES_KEY = "nexyyra-pages-visited";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const IDLE_MS = 45_000;
const SCROLL_THRESHOLD = 0.75;

function canShowPopup(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  const shownAt = Number.parseInt(raw, 10);
  if (Number.isNaN(shownAt)) return true;
  return Date.now() - shownAt > COOLDOWN_MS;
}

function markShown(): void {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

function trackPageVisit(): number {
  const path = window.location.pathname;
  const raw = sessionStorage.getItem(PAGES_KEY);
  const pages: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!pages.includes(path)) pages.push(path);
  sessionStorage.setItem(PAGES_KEY, JSON.stringify(pages));
  return pages.length;
}

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const triggered = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    markShown();
  }, []);

  const openOnce = useCallback(() => {
    if (triggered.current || !canShowPopup()) return;
    triggered.current = true;
    setIsOpen(true);
    markShown();
  }, []);

  useEffect(() => {
    if (!canShowPopup()) return;

    const pageCount = trackPageVisit();

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(openOnce, IDLE_MS);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) openOnce();
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_THRESHOLD) openOnce();
    };

    resetIdle();
    window.addEventListener("mousemove", resetIdle, { passive: true });
    window.addEventListener("keydown", resetIdle, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    if (pageCount >= 2) {
      const t = setTimeout(openOnce, 12_000);
      return () => {
        clearTimeout(t);
        if (idleTimer.current) clearTimeout(idleTimer.current);
        window.removeEventListener("mousemove", resetIdle);
        window.removeEventListener("keydown", resetIdle);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [openOnce]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    setTimeout(dismiss, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md"
            onClick={dismiss}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="exit-intent-popup fixed left-1/2 top-1/2 z-[61] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--glitz-gold)]/25 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="gradient-gold px-6 py-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-black/10">
                <Gift className="h-7 w-7 text-black/80" aria-hidden="true" />
              </div>
              <h2
                id="exit-intent-title"
                className="font-display text-2xl font-bold text-black"
              >
                Wait! Before You Go...
              </h2>
              <p className="mt-2 text-sm font-medium text-black/75">
                Claim your exclusive offer today
              </p>
            </div>

            <div className="bg-[var(--glitz-surface,#0a0a0a)] p-6 text-[var(--foreground,#f5f0e8)]">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--glitz-gold)]" />
                  <p className="font-display text-lg font-semibold text-white">
                    You&apos;re All Set!
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Check your inbox for your free consultation link and 10% discount code.
                  </p>
                </motion.div>
              ) : (
                <>
                  <ul className="mb-6 space-y-3 text-sm text-white/90">
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--glitz-gold)]/20 text-xs font-bold text-[var(--glitz-gold)]">
                        1
                      </span>
                      Free 30-minute event consultation
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--glitz-gold)]/20 text-xs font-bold text-[var(--glitz-gold)]">
                        2
                      </span>
                      Exclusive 10% discount on your first booking
                    </li>
                  </ul>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/45"
                      aria-label="Email address"
                    />
                    <Button type="submit" className="w-full" disabled={status === "loading"}>
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        "Claim My Free Consultation"
                      )}
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={dismiss}
                    className="mt-4 w-full text-center text-xs text-white/55 transition-colors hover:text-white/85"
                  >
                    No thanks, I&apos;ll pass on the offer
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
