"use client";

import { useState } from "react";
import { Phone, Loader2, CheckCircle2 } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CallbackRequestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-[var(--glitz-gold)]" aria-hidden="true" />
        <p className="font-semibold">Request received!</p>
        <p className="text-sm text-muted">Our team will call you within 2 business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="callback-name" className="mb-1 block text-sm font-medium text-primary">
          Your name
        </label>
        <input
          id="callback-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-card)] px-4 py-3 text-sm"
          placeholder="Priya Sharma"
        />
      </div>
      <div>
        <label htmlFor="callback-phone" className="mb-1 block text-sm font-medium text-primary">
          Phone number
        </label>
        <input
          id="callback-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-card)] px-4 py-3 text-sm"
          placeholder="+91 98765 43210"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--glitz-gold)] py-3.5 text-sm font-semibold text-[#0A0A0A]",
          status === "loading" && "opacity-70"
        )}
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
        Request Callback
      </button>
      <p className="text-center text-xs text-muted">Or call us directly at {SITE_CONFIG.phone}</p>
    </form>
  );
}

export function LeadMagnetsSection() {
  const magnets = [
    { title: "Luxury Wedding Checklist", desc: "50-point PDF for destination and palace weddings.", tag: "Free PDF" },
    { title: "Corporate Gala ROI Guide", desc: "Measure impact and justify event investment to leadership.", tag: "Free Guide" },
    { title: "Venue Comparison Worksheet", desc: "Compare up to 5 venues across capacity, cost, and amenities.", tag: "Free Tool" },
  ];

  return (
    <BrandSection alt>
      <BrandHeader label="Resources" title="Free Lead Magnets" subtitle="Download expert guides — no obligation, instant value." center />
      <div className="grid gap-6 md:grid-cols-3">
        {magnets.map((m) => (
          <div key={m.title} className="brand-surface flex flex-col p-6">
            <span className="w-fit rounded-full border border-[var(--glitz-gold)]/40 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">{m.tag}</span>
            <h3 className="mt-4 font-semibold">{m.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{m.desc}</p>
            <a href="/book-event#callback" className="mt-4 text-sm font-semibold text-[var(--glitz-gold)] hover:underline">
              Get free access →
            </a>
          </div>
        ))}
      </div>
    </BrandSection>
  );
}
