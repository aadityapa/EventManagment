"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EVENT_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6 md:p-8" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput id="name" name="name" label="Full Name" required placeholder="Your name" autoComplete="name" />
        <FormInput id="email" name="email" label="Email" type="email" required placeholder="you@example.com" autoComplete="email" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput id="phone" name="phone" label="Phone" type="tel" required placeholder="+91 9730594753" autoComplete="tel" />
        <div className="space-y-1.5">
          <label htmlFor="eventType" className="block text-sm font-medium text-primary">
            Event Type <span className="text-[var(--color-error,#ef4444)]" aria-hidden="true">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            className="flex h-11 w-full rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-surface-elevated,var(--glitz-card))] px-4 py-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]"
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
      <FormTextarea id="message" name="message" label="Message" required placeholder="Tell us about your event..." rows={5} />
      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto btn-premium-hover">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
