"use client";

import { useEffect, useId, useRef, useState } from "react";
import { UiIcon } from "@/components/icons";
import { BRAND_REPLY_HOURS } from "@/brand/data/reply-hours";
import { EVENT_TYPES, SITE_CONFIG } from "@/lib/constants";
import { analytics, trackEvent } from "@/lib/analytics";
import {
  BUDGET_RANGES,
  GUEST_RANGES,
  INQUIRY_LIMITS,
  inquiryWhatsAppUrl,
  isValidPhone,
  PHONE_ERROR,
  type InquiryFieldErrors,
  type InquiryInput,
  type InquiryResponse,
} from "@/lib/inquiry";
import { cn } from "@/lib/utils";

type Variant = "full" | "compact" | "callback";

type InquiryFormProps = {
  source: NonNullable<InquiryInput["source"]>;
  variant?: Variant;
  defaultEventType?: string;
  /** Prefills City in the full variant; other variants send it as a hidden field. */
  defaultCity?: string;
  /** Prefills Guests in the full variant; ignored unless it is one of GUEST_RANGES. */
  defaultGuests?: string;
  /** The collection chosen on /pricing — sent with the inquiry so the planner sees it. */
  collection?: string;
  submitLabel?: string;
  className?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; reference: string }
  | { kind: "failed"; message: string; whatsapp: string };

type FieldKey = keyof InquiryFieldErrors;

/** Fields each variant renders: a server error for any other key has nowhere to sit, so it gets the banner. */
const VARIANT_FIELDS: Record<Variant, readonly FieldKey[]> = {
  full: ["name", "phone", "eventType", "eventDate", "email", "city", "guests", "budget", "message"],
  compact: ["name", "phone", "eventType", "eventDate", "message"],
  callback: ["name", "phone"],
};

const GENERIC_ERROR = "We couldn't send part of your inquiry. Please try again, or send it on WhatsApp — your details are filled in.";

/**
 * The site's one lead form. Variants:
 *  - full     — contact / book-event: every planning field
 *  - compact  — homepage / service pages: the essentials, one screen
 *  - callback — name + phone only
 *
 * Success is shown only after /api/inquiry confirms delivery. On failure the
 * visitor gets a WhatsApp hand-off with their details prefilled — no lead is
 * silently dropped: every server error is shown beside its field, and an
 * error with no visible field falls through to that hand-off.
 */
export function InquiryForm({
  source,
  variant = "full",
  defaultEventType,
  defaultCity,
  defaultGuests,
  collection,
  submitLabel,
  className,
}: InquiryFormProps) {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const id = (name: string) => `${uid}-${name}`;
  const rendered = VARIANT_FIELDS[variant];

  // The focused submit button unmounts on success; move focus to the
  // confirmation so keyboard and screen-reader users are not left on <body>.
  useEffect(() => {
    if (status.kind === "sent") doneRef.current?.focus();
  }, [status.kind]);

  /** Shows errors beside their fields and moves focus to the first one. */
  const showErrors = (next: InquiryFieldErrors) => {
    setErrors(next);
    const first = rendered.find((k) => next[k]);
    if (first) {
      requestAnimationFrame(() => {
        const el = document.getElementById(id(first));
        if (el && formRef.current?.contains(el)) el.focus();
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => {
      const v = String(data.get(k) ?? "").trim();
      return v || undefined;
    };
    const payload: InquiryInput = {
      name: get("name") ?? "",
      phone: get("phone") ?? "",
      email: get("email"),
      eventType: get("eventType"),
      eventDate: get("eventDate"),
      city: get("city"),
      guests: get("guests"),
      budget: get("budget"),
      message: get("message"),
      collection,
      company_website: get("company_website"),
      source,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
    };

    const next: InquiryFieldErrors = {};
    if (payload.name.length < 2) next.name = "Please enter your name.";
    if (!isValidPhone(payload.phone)) next.phone = PHONE_ERROR;
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) next.email = "Please enter a valid email address.";
    showErrors(next);
    if (Object.keys(next).length) return;

    setStatus({ kind: "sending" });
    const whatsapp = inquiryWhatsAppUrl(payload);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as InquiryResponse | null;
      if (body?.ok) {
        trackEvent("generate_lead", { source, event_type: payload.eventType });
        setStatus({ kind: "sent", reference: body.reference });
        return;
      }

      const fieldErrors: InquiryFieldErrors = (body && !body.ok && body.fieldErrors) || {};
      const placed: InquiryFieldErrors = {};
      for (const k of rendered) if (fieldErrors[k]) placed[k] = fieldErrors[k];
      const unplaced = (Object.keys(fieldErrors) as FieldKey[]).some((k) => !rendered.includes(k));
      showErrors(placed);
      if (Object.keys(placed).length && !unplaced && !(body && !body.ok && body.fallback)) {
        // Every problem sits beside its field; the visitor fixes it and resubmits.
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({
        kind: "failed",
        message: unplaced ? GENERIC_ERROR : (body && !body.ok && body.error) || "We couldn't send your inquiry online.",
        whatsapp,
      });
    } catch {
      setStatus({
        kind: "failed",
        message: "You appear to be offline. Send your inquiry on WhatsApp instead — your details are filled in.",
        whatsapp,
      });
    }
  };

  // Mounted from the first render and kept across the form → confirmation
  // swap, so screen readers announce its changes (a region inserted already
  // filled is often missed).
  const live = (
    <p className="sr-only" role="status" aria-live="polite">
      {status.kind === "sending"
        ? "Sending your inquiry…"
        : status.kind === "sent"
          ? `Inquiry sent. Your reference is ${status.reference}.`
          : ""}
    </p>
  );

  if (status.kind === "sent") {
    return (
      <>
        {live}
        <div className={cn("lux-form lux-form--done", className)}>
          <UiIcon name="check" size={48} className="text-[var(--lux-gold)]" />
          <h3 ref={doneRef} tabIndex={-1} className="lux-form__done-title">
            Thank you — your inquiry is with our planners.
          </h3>
          <p className="lux-form__done-copy">
            {BRAND_REPLY_HOURS} Your reference is <strong>{status.reference}</strong>.
            For anything urgent, call{" "}
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="lux-form__link">
              {SITE_CONFIG.phone}
            </a>
            .
          </p>
        </div>
      </>
    );
  }

  const showFull = variant === "full";
  const showEvent = variant !== "callback";
  const guestsDefault = defaultGuests && (GUEST_RANGES as readonly string[]).includes(defaultGuests) ? defaultGuests : "";

  return (
    <>
      {live}
      <form ref={formRef} onSubmit={onSubmit} noValidate className={cn("lux-form", `lux-form--${variant}`, className)} aria-label="Event inquiry form">
        <div className="lux-form__grid">
          <Field id={id("name")} label="Your name" error={errors.name} required>
            <input
              id={id("name")}
              name="name"
              autoComplete="name"
              required
              maxLength={INQUIRY_LIMITS.name}
              className="lux-input"
              placeholder="Full name"
              {...aria(errors.name, id("name"))}
            />
          </Field>
          <Field id={id("phone")} label="Phone / WhatsApp" error={errors.phone} required>
            <input
              id={id("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={24}
              className="lux-input"
              placeholder="+91 98xxx xxxxx"
              {...aria(errors.phone, id("phone"))}
            />
          </Field>

          {showEvent && (
            <Field id={id("eventType")} label="Event type" error={errors.eventType}>
              <select
                id={id("eventType")}
                name="eventType"
                defaultValue={defaultEventType ?? ""}
                className="lux-input"
                {...aria(errors.eventType, id("eventType"))}
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {showEvent && (
            <Field id={id("eventDate")} label="Event date (approx.)" error={errors.eventDate}>
              <input
                id={id("eventDate")}
                name="eventDate"
                maxLength={INQUIRY_LIMITS.eventDate}
                className="lux-input"
                placeholder="e.g. Feb 2027 or 14 Dec"
                autoComplete="off"
                {...aria(errors.eventDate, id("eventDate"))}
              />
            </Field>
          )}

          {showFull && (
            <>
              <Field id={id("email")} label="Email" error={errors.email}>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={INQUIRY_LIMITS.email}
                  className="lux-input"
                  placeholder="you@example.com"
                  {...aria(errors.email, id("email"))}
                />
              </Field>
              <Field id={id("city")} label="City / venue" error={errors.city}>
                <input
                  id={id("city")}
                  name="city"
                  defaultValue={defaultCity}
                  maxLength={INQUIRY_LIMITS.city}
                  className="lux-input"
                  placeholder="Pune, Udaipur, Goa…"
                  autoComplete="address-level2"
                  {...aria(errors.city, id("city"))}
                />
              </Field>
              <Field id={id("guests")} label="Guests" error={errors.guests}>
                <select id={id("guests")} name="guests" defaultValue={guestsDefault} className="lux-input" {...aria(errors.guests, id("guests"))}>
                  <option value="">Select guest count</option>
                  {GUEST_RANGES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </Field>
              <Field id={id("budget")} label="Budget" error={errors.budget}>
                <select id={id("budget")} name="budget" defaultValue="" className="lux-input" {...aria(errors.budget, id("budget"))}>
                  <option value="">Select budget range</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {variant !== "callback" && (
            <Field id={id("message")} label="Tell us about your event" error={errors.message} className="lux-form__wide">
              <textarea
                id={id("message")}
                name="message"
                rows={showFull ? 4 : 3}
                maxLength={INQUIRY_LIMITS.message}
                className="lux-input lux-input--area"
                placeholder="Vision, guest experience, must-haves…"
                {...aria(errors.message, id("message"))}
              />
            </Field>
          )}

          {/* City pages pass their city even when the City field is not shown. */}
          {!showFull && defaultCity ? <input type="hidden" name="city" value={defaultCity} /> : null}

          {/* Honeypot — hidden from people and assistive tech. */}
          <div aria-hidden className="lux-form__hp">
            <label htmlFor={id("hp")}>Company website</label>
            <input id={id("hp")} name="company_website" tabIndex={-1} autoComplete="off" />
          </div>
        </div>

        {status.kind === "failed" && (
          <div className="lux-form__alert" role="alert">
            <p>{status.message}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={status.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.ctaClick("whatsapp_fallback", source)}
                className="luxury-button luxury-button--purple luxury-button--compact tap-target"
              >
                <UiIcon name="whatsapp" size={20} />
                Send on WhatsApp
              </a>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="luxury-button luxury-button--ghost luxury-button--compact tap-target">
                <UiIcon name="phone" size={20} />
                Call {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        )}

        <div className="lux-form__actions">
          <button type="submit" disabled={status.kind === "sending"} className="luxury-button luxury-button--purple tap-target">
            {status.kind === "sending" ? (
              <>
                <span className="lux-spinner" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                {submitLabel ?? (variant === "callback" ? "Request a Callback" : "Get My Free Proposal")}
                <UiIcon name="arrow-right" size={20} />
              </>
            )}
          </button>
          <p className="lux-form__fine">
            Free consultation · No obligation · We never share your details.
          </p>
        </div>
      </form>
    </>
  );
}

function aria(error: string | undefined, fieldId: string) {
  return error ? { "aria-invalid": true as const, "aria-describedby": `${fieldId}-error` } : {};
}

function Field({
  id,
  label,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("lux-field", className)}>
      <label htmlFor={id} className="lux-field__label">
        {label}
        {required && (
          <span className="text-[var(--lux-gold)]" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="lux-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
