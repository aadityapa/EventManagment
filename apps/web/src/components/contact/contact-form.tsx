"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EVENT_TYPES } from "@/lib/constants";
import { FormInput, FormTextarea } from "@/components/ui/form-input";

type ContactErrors = Partial<Record<"name" | "email" | "phone" | "eventType" | "message", string>>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const next: ContactErrors = {};
    if (!get("name")) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = "Please enter a valid email address.";
    if (!/^[+\d][\d\s()-]{7,16}$/.test(get("phone"))) next.phone = "Please enter a valid phone number.";
    if (!get("eventType")) next.eventType = "Please select an event type.";
    if (get("message").length < 10) next.message = "Please tell us a little more about your event.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setLoading(false);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6 md:p-8" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput id="name" name="name" label="Full Name" required placeholder="Your name" autoComplete="name" error={errors.name} />
        <FormInput id="email" name="email" label="Email" type="email" required placeholder="you@example.com" autoComplete="email" error={errors.email} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput id="phone" name="phone" label="Phone" type="tel" required placeholder="+91 9730594753" autoComplete="tel" error={errors.phone} />
        <div className="space-y-1.5">
          <label htmlFor="eventType" className="block text-sm font-medium text-primary">
            Event Type <span className="text-[var(--color-error,#ef4444)]" aria-hidden="true">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            aria-invalid={errors.eventType ? true : undefined}
            aria-describedby={errors.eventType ? "eventType-error" : undefined}
            className="flex h-11 w-full rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-surface-elevated,var(--glitz-card))] px-4 py-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)] aria-[invalid]:border-red-400"
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          {errors.eventType && (
            <p id="eventType-error" role="alert" className="text-xs text-red-400">
              {errors.eventType}
            </p>
          )}
        </div>
      </div>
      <FormTextarea id="message" name="message" label="Message" required placeholder="Tell us about your event..." rows={5} error={errors.message} />
      <button type="submit" disabled={loading} className="luxury-button luxury-button--gold luxury-button--compact w-full sm:w-auto tap-target">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
