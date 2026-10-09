import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { UiIcon } from "@/components/icons";
import { InquirySentinel } from "@/components/ui/inquiry-sentinel";
import type { InquirySource } from "@/components/ui/types";
import { BRAND_REPLY_HOURS } from "@/brand/data/reply-hours";
import { SITE_CONFIG } from "@/lib/constants";
import { cn, getWhatsAppUrl } from "@/lib/utils";

type InquiryPanelProps = {
  /** Anchor the action bar scrolls to (`#plan`, `#inquire`). */
  id?: string;
  source: InquirySource;
  variant?: "full" | "compact" | "callback";
  defaultEventType?: string;
  /** Prefills the form's city (city pages); sent with every variant. */
  defaultCity?: string;
  /** Prefills Guests (full variant), e.g. a collection's "150–500". */
  defaultGuests?: string;
  /** The collection the visitor chose on /pricing; sent with the inquiry. */
  collection?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Phone / WhatsApp / email lines beside the form (a 3-button row on phones). */
  contacts?: boolean;
  /** e.g. "From ₹8,00,000" on service pages. */
  priceLine?: string;
  className?: string;
};

const WHATSAPP_MESSAGE = "Hello Nexyyra Events, I would like a free proposal for my event.";

/**
 * The inquiry plate: copy + contact lines in cols 1–5, the site's ONE
 * `InquiryForm` in cols 6–12 — once the plate itself is wide enough (a
 * container query), so it stacks in narrow columns with no page overrides.
 * The sentinel lets the mobile action bar hide while the form is on screen
 * without touching the form itself.
 */
export function InquiryPanel({
  id = "inquire",
  source,
  variant = "compact",
  defaultEventType,
  defaultCity,
  defaultGuests,
  collection,
  eyebrow = "Free consultation",
  title = "Tell us about your event",
  lead = `${BRAND_REPLY_HOURS} After a free consultation, your itemised proposal follows within 48 hours.`,
  contacts = true,
  priceLine,
  className,
}: InquiryPanelProps) {
  const tel = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;
  const lines = [
    { cta: "inquiry_call", href: tel, icon: "phone", label: "Call", value: SITE_CONFIG.phone, external: false },
    { cta: "inquiry_whatsapp", href: getWhatsAppUrl(WHATSAPP_MESSAGE), icon: "whatsapp", label: "WhatsApp", value: "WhatsApp a planner", external: true },
    { cta: "inquiry_email", href: `mailto:${SITE_CONFIG.email}`, icon: "mail", label: "Email", value: SITE_CONFIG.email, external: false },
  ] as const;

  return (
    <section id={id} className={cn("lux-inquiry", className)} aria-labelledby={`${id}-title`}>
      <InquirySentinel />
      <div className="lux-inquiry__body">
        <div className="lux-inquiry__copy">
          <p className="lux-label lux-label--rule-leading">{eyebrow}</p>
          <h2 id={`${id}-title`} className="lux-inquiry__title">{title}</h2>
          <p className="lux-inquiry__lead">{lead}</p>
          {priceLine ? <p className="lux-inquiry__price">{priceLine}</p> : null}
          {contacts ? (
            <ul className="lux-inquiry__contacts" aria-label="Contact a planner directly">
              {lines.map((line) => (
                <li key={line.cta}>
                  <a
                    href={line.href}
                    className="lux-inquiry__contact"
                    data-cta={line.cta}
                    data-cta-location={source}
                    {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <UiIcon name={line.icon} size={20} />
                    <span className="lux-inquiry__contact-label">{line.label}</span>
                    <span className="lux-inquiry__contact-value">{line.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="lux-inquiry__form">
          <InquiryForm
            source={source}
            variant={variant}
            defaultEventType={defaultEventType}
            defaultCity={defaultCity}
            defaultGuests={defaultGuests}
            collection={collection}
            submitLabel={variant === "callback" ? undefined : "Get a Free Proposal"}
          />
        </div>
      </div>
    </section>
  );
}
