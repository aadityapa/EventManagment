"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "Glitz-exit-intent-dismissed";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const dismiss = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(STORAGE_KEY)) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[60] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl glass-card shadow-glow"
            role="dialog"
            aria-labelledby="exit-intent-title"
          >
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted transition-colors hover:bg-primary/10 hover:text-foreground"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="gradient-gold px-6 py-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-black/10">
                <Gift className="h-7 w-7 text-black/70" />
              </div>
              <h2
                id="exit-intent-title"
                className="font-display text-2xl font-bold text-black"
              >
                Wait! Before You Go...
              </h2>
              <p className="mt-2 text-sm text-black/70">
                Claim your exclusive offer today
              </p>
            </div>

            <div className="p-6">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <p className="font-display text-lg font-semibold">
                    You&apos;re All Set!
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Check your inbox for your free consultation link and 10%
                    discount code.
                  </p>
                </motion.div>
              ) : (
                <>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                        1
                      </span>
                      Free 30-minute event consultation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
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
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Claim My Free Consultation"
                      )}
                    </Button>
                  </form>

                  <button
                    onClick={dismiss}
                    className="mt-3 w-full text-center text-xs text-muted transition-colors hover:text-foreground"
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
