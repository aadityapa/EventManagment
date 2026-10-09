import { LEGAL_DOCS, LegalPage, REGISTERED_ADDRESS, type LegalSection } from "@/brand/templates/legal-page";
import { HOTJAR_ID } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: LEGAL_DOCS.privacy.title,
  description: "How Nexyyra Events collects, uses and protects your personal information, and how to exercise your rights.",
  path: LEGAL_DOCS.privacy.href,
});

const email = (
  <a href={`mailto:${SITE_CONFIG.email}`} data-cta="legal_privacy_email" data-cta-location="legal_body">
    {SITE_CONFIG.email}
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <p>
        {SITE_CONFIG.legalName} (&ldquo;we&rdquo;, &ldquo;our&rdquo; or &ldquo;us&rdquo;), trading as {SITE_CONFIG.shortName}, is
        committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose and safeguard your
        information when you visit our website or use our event management services.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <p>
        We may collect personal information including your name, email address, phone number, event details, payment records
        and communication preferences when you book events, contact us or use our client dashboard.
      </p>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <ul>
        <li>To provide and manage event planning services</li>
        <li>To process bookings and payments</li>
        <li>To communicate about your events via email, SMS and WhatsApp</li>
        <li>To improve our website and services</li>
        <li>To comply with legal obligations</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: (
      <>
        <p>
          With your permission, we use Google Analytics cookies to understand how the website is used
          {HOTJAR_ID === null
            ? "."
            : ", and Hotjar, which records how visitors move through our pages (clicks, taps and scrolling) and sets its own cookies."}{" "}
          No analytics run until you make a choice in the cookie notice, and declining does not affect how the website works.
        </p>
        <p>
          You can change or withdraw your choice at any time from{" "}
          <a href="#cookies" data-consent-open="">
            Cookie settings
          </a>{" "}
          (also linked in the footer of every page). If you withdraw consent, analytics stop loading, and the Google
          Analytics{HOTJAR_ID === null ? "" : " and Hotjar"} cookies on this website are deleted from your browser.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data security",
    body: (
      <p>
        We use reasonable safeguards, including access controls, to protect your personal information. Online payments are
        processed by Razorpay: card details are entered on Razorpay&rsquo;s checkout and are not stored by us.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: <p>You have the right to access, correct or delete your personal data. Write to us at {email} to exercise these rights.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        For privacy-related questions, contact us at {email} or{" "}
        <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} data-cta="legal_privacy_call" data-cta-location="legal_body">
          {SITE_CONFIG.phone}
        </a>
        . Our registered address is {SITE_CONFIG.legalName}, {REGISTERED_ADDRESS}.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      doc="privacy"
      lead="What we collect when you contact or book with us, how we use it, and how to have it corrected or deleted."
      sections={SECTIONS}
    />
  );
}
