import Link from "next/link";
import { UiIcon } from "@/components/icons";
import { SITE_CONFIG } from "@/lib/constants";
import { PRIMARY_LABEL, PROPOSAL_HREF, TEL_HREF, WHATSAPP_HREF } from "./nav-data";

/**
 * Fixed contact chrome (DESIGN.md §10.0) — a server component rendered once by
 * the layout; it never reads the pathname. Phones (< 768): the 64px bar with
 * WhatsApp, Call and the purple "Get a Free Proposal". It hides in CSS alone
 * while an InquiryPanel is on screen (body[data-inquiry-visible]) or any
 * <dialog> is open (primitives.css). Desktop: a quiet WhatsApp + Call corner
 * stack. Analytics come from the delegated [data-cta] handler.
 */
export function ActionBar() {
  return (
    <>
      <aside className="lux-actionbar pg-shell-actionbar" aria-label="Quick contact">
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="pg-shell-actionbar__contact"
          data-cta="action_whatsapp"
          data-cta-location="action-bar"
        >
          <UiIcon name="whatsapp" size={20} className="pg-shell-whatsapp" />
          WhatsApp
        </a>
        <a href={TEL_HREF} className="pg-shell-actionbar__contact" data-cta="action_call" data-cta-location="action-bar">
          <UiIcon name="phone" size={20} />
          Call
        </a>
        <Link href={PROPOSAL_HREF} className="pg-shell-actionbar__proposal" data-cta="action_proposal" data-cta-location="action-bar">
          {PRIMARY_LABEL}
        </Link>
      </aside>

      <aside className="pg-shell-corner" aria-label="Contact shortcuts">
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp a planner"
          data-cta="action_whatsapp"
          data-cta-location="corner"
        >
          <UiIcon name="whatsapp" size={24} className="pg-shell-whatsapp" />
        </a>
        <a href={TEL_HREF} aria-label={`Call ${SITE_CONFIG.phone}`} data-cta="action_call" data-cta-location="corner">
          <UiIcon name="phone" size={24} />
        </a>
      </aside>
    </>
  );
}
