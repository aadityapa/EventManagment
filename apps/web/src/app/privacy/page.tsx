import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";
import { PageHero } from "@/components/shared/page-hero";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = stitchMetadata("privacy");

export default function PrivacyPage() {
  return (
    <StitchRoute screen="privacy">
    <>
      <PageHero title="Privacy Policy" subtitle={`Last updated: June 1, 2026`} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">1. Introduction</h2>
              <p className="mt-3 text-muted leading-relaxed">
                {SITE_CONFIG.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website or use our event management services.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">2. Information We Collect</h2>
              <p className="mt-3 text-muted leading-relaxed">
                We may collect personal information including your name, email address, phone number,
                event details, payment information, and communication preferences when you book events,
                contact us, or use our client dashboard.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">3. How We Use Your Information</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
                <li>To provide and manage event planning services</li>
                <li>To process bookings and payments</li>
                <li>To communicate about your events via email, SMS, and WhatsApp</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">4. Data Security</h2>
              <p className="mt-3 text-muted leading-relaxed">
                We implement industry-standard security measures including encryption, secure payment
                processing through Razorpay, Stripe, and PayPal, and access controls to protect your
                personal information.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">5. Your Rights</h2>
              <p className="mt-3 text-muted leading-relaxed">
                You have the right to access, correct, or delete your personal data. Contact us at{" "}
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary hover:underline">
                  {SITE_CONFIG.email}
                </a>{" "}
                to exercise these rights.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">6. Contact Us</h2>
              <p className="mt-3 text-muted leading-relaxed">
                For privacy-related inquiries, please contact us at {SITE_CONFIG.email} or{" "}
                {SITE_CONFIG.phone}. Our registered address is {SITE_CONFIG.address}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
