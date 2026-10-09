import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { assetForRole, localSources, withoutDuplicates, type CurationAsset } from "@/brand/data/image-curation";
import { BRAND_REPLY_HOURS } from "@/brand/data/reply-hours";
import { AboutIcon, type AboutIconName } from "@/brand/sections/about/about-icons";
import { TeamSection } from "@/brand/sections/about/team-section";
import { Scene3D } from "@/components/three/scene-host";
import { UiIcon } from "@/components/icons";
import { Breadcrumbs, Button, Eyebrow, focalToObjectPosition, Heading, MediaFrame, PAGE_TITLE_ID, Reveal, Section } from "@/components/ui";
import { companyProfile } from "@/data/cms";
import { getWhatsAppUrl } from "@/lib/utils";

/*
 * /about — the pre-V6 page restored at the owner's request (V7 brief,
 * Package A): same sections, same order, same copy, rebuilt on the V6
 * primitives with the V7 motion layer. Server component; the only islands are
 * the Scene3D hosts (lazy three.js, CSS fallback) and the global motion runtime.
 */

const MANIFESTO =
  "We believe luxury is intention — every candle, every cue, every guest experience deliberately crafted so the celebration feels effortless and eternal.";

const FOUNDER_STORY =
  "Founded by Yash Bajaj — joined by co-founders Aaditya Padiya and Amey Korde — Nexyyra began as an intimate wedding studio with a singular belief: every celebration carries the weight of memory. Today the team operates as Nexyyra Events and Promotions Private Limited, planning and producing weddings, corporate events and destination celebrations across India.";

const PURPOSE: { icon: AboutIconName; title: string; copy: string }[] = [
  { icon: "eye", title: "Vision", copy: companyProfile.vision },
  { icon: "target", title: "Mission", copy: companyProfile.mission },
  { icon: "gem", title: "Philosophy", copy: companyProfile.philosophy },
];

const TRUST_PILLARS: { icon: AboutIconName; title: string; copy: string }[] = [
  { icon: "crown", title: "Uncompromising Craft", copy: "Every detail engineered to museum standards — nothing is left to chance." },
  { icon: "shield", title: "Absolute Discretion", copy: "NDA-bound teams and airtight privacy for high-profile clients and brands." },
  { icon: "globe", title: "Pan-India Production", copy: "Palace to penthouse, across India — fully in-house, fully owned execution." },
  { icon: "sparkle", title: "Cinematic Execution", copy: "Broadcast-grade AV, lighting and stagecraft on every single production." },
];

/** The assets for these roles, in order, skipping roles with no photo. */
const curated = (...roles: string[]): CurationAsset[] => roles.flatMap((role) => assetForRole(role) ?? []);

const WHATSAPP_MESSAGE = "Hello Nexyyra Events, I would like to book a consultation.";

/** Manifesto words as server-rendered spans for the `.lux-split` word reveal; the text reads unchanged. */
function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="lux-split__w" style={{ "--w": i } as CSSProperties}>
          {word}
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function AboutView() {
  const cover = assetForRole("cover-about");
  // No photo twice on the page (near-duplicates included): portrait first, then the atelier frame.
  const [portrait] = withoutDuplicates(curated("house-portrait", "spread-about"), cover ? [cover.id] : []);
  const [atelier] = withoutDuplicates(curated("spread-about", "house-portrait"), [cover, portrait].flatMap((a) => (a ? [a.id] : [])));
  const coverSet = cover ? localSources(cover) : undefined;
  // The hero photo is the LCP: preload the local WebP set (never a Drive URL).
  if (coverSet) preload(coverSet.src, { as: "image", imageSrcSet: coverSet.srcSet, imageSizes: "100vw", fetchPriority: "high" });

  return (
    <div className="lux-page pg-about">
      {/* 1 · Hero — full-bleed photograph, text in a glass panel (the pre-V6 format). */}
      <section className="pg-about-hero lux-bleed" aria-labelledby={PAGE_TITLE_ID}>
        {cover ? (
          <div className="pg-about-hero__media">
            {coverSet ? (
              // eslint-disable-next-line @next/next/no-img-element -- local WebP set (768 is the 4:5 phone crop); the LCP stays off the optimizer
              <img
                src={coverSet.src}
                srcSet={coverSet.srcSet}
                sizes="100vw"
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                style={{ objectPosition: focalToObjectPosition(cover.focal) }}
              />
            ) : (
              <MediaFrame asset={cover.id} ratio="4:5" sizes="100vw" priority caption={false} />
            )}
          </div>
        ) : null}
        <div className="pg-about-hero__veil" aria-hidden="true" />
        <Scene3D variant="dust" intensity={0.6} className="pg-about-hero__scene" />
        <div className="pg-about-hero__inner">
          <div className="pg-about-hero__panel">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
              ]}
              schema
              className="pg-about-hero__crumbs"
            />
            <Eyebrow rule="leading">Our Story</Eyebrow>
            <Heading as="h1" size="display" id={PAGE_TITLE_ID} accent="Celebrations">
              The Next Era of Celebrations
            </Heading>
            <p className="lux-lead pg-about-hero__lead">
              Experience architects, celebration designers, and memory creators — crafting extraordinary moments across India.
            </p>
          </div>
        </div>
      </section>

      {/* 2 · Manifesto — one large centred statement, revealed word by word. */}
      <section className="lux-section pg-about-manifesto" aria-label="Our belief">
        <p className="pg-about-manifesto__text lux-split">
          <SplitWords text={MANIFESTO} />
        </p>
      </section>

      {/* 3 · Founder story */}
      <Section id="founder" number="01" eyebrow="Founder Philosophy" title="We Architect Experiences">
        <div className="lux-grid pg-about-founder">
          <div className="lux-col-text pg-about-founder__text">
            <p className="lux-lead">{companyProfile.introduction}</p>
            <div className="lux-prose">
              <p>{FOUNDER_STORY}</p>
              <p>{companyProfile.story}</p>
            </div>
            <div className="pg-about-founder__cta">
              <Button variant="primary" href="/book-event" cta="book_consultation" location="about_founder" arrow>
                Book Consultation
              </Button>
            </div>
          </div>
          {portrait ? (
            <div className="lux-col-media pg-about-founder__media" data-tilt="soft">
              <MediaFrame asset={portrait.id} ratio="4:5" sizes="(min-width:768px) 50vw, 100vw" frame />
            </div>
          ) : null}
        </div>
      </Section>

      {/* 4 · Vision, Mission & Philosophy */}
      <Section id="purpose" number="02" eyebrow="Purpose" title="Vision, Mission & Philosophy" lazy>
        <ul className="pg-about-cards pg-about-cards--3">
          {PURPOSE.map((item, i) => (
            <Reveal as="li" key={item.title} index={i}>
              <article className="pg-about-card" data-tilt="">
                <AboutIcon name={item.icon} size={32} className="pg-about-card__icon" />
                <h3 className="pg-about-card__title">{item.title}</h3>
                <p className="pg-about-card__copy">{item.copy}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 5 · Behind the Scenes */}
      <Section
        id="behind-the-scenes"
        number="03"
        eyebrow="Behind the Scenes"
        title="Our story in motion"
        lead="A glimpse into the artistry behind every Nexyyra celebration — from first sketches to final guest arrival."
        lazy
      >
        {atelier ? (
          <div className="pg-about-atelier" data-tilt="soft">
            <MediaFrame asset={atelier.id} ratio="16:10" sizes="(min-width:1024px) 56rem, 100vw" caption={false} frame />
            <div className="pg-about-atelier__overlay">
              <p className="pg-about-atelier__label">Nexyyra Atelier</p>
              <p className="pg-about-atelier__line">Every celebration is rehearsed, refined, and delivered with quiet precision.</p>
            </div>
          </div>
        ) : null}
      </Section>

      {/* 6 · Meet Our Leadership */}
      <TeamSection number="04" />

      {/* 7 · Why Nexyyra */}
      <Section
        id="why-nexyyra"
        number="05"
        eyebrow="Why Nexyyra"
        title="Why India's Premium Brands Trust Nexyyra"
        lead="Flawless, discreet, cinematic celebrations — engineered in-house and delivered across India for families and brands that expect precision."
        lazy
      >
        <ul className="pg-about-cards pg-about-cards--4">
          {TRUST_PILLARS.map((pillar, i) => (
            <Reveal as="li" key={pillar.title} index={i}>
              <article className="pg-about-card pg-about-card--pillar" data-tilt="">
                <span className="pg-about-card__jewel">
                  <AboutIcon name={pillar.icon} size={24} />
                </span>
                <h3 className="pg-about-card__title">{pillar.title}</h3>
                <p className="pg-about-card__copy">{pillar.copy}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 8 · CTA */}
      <section className="lux-section pg-about-cta" aria-labelledby="about-cta-title">
        <Reveal className="pg-about-cta__panel">
          <Heading as="h2" id="about-cta-title">
            Let&apos;s craft your legend
          </Heading>
          <p className="lux-lead pg-about-cta__lead">
            Schedule a private consultation — complimentary and without obligation. {BRAND_REPLY_HOURS}
          </p>
          <div className="pg-about-cta__actions">
            <Button variant="primary" href="/book-event" cta="book_consultation" location="about_cta" arrow>
              Book Consultation
            </Button>
            <Button
              variant="ghost"
              href={getWhatsAppUrl(WHATSAPP_MESSAGE)}
              external
              cta="whatsapp"
              location="about_cta"
              icon={<UiIcon name="whatsapp" size={20} />}
            >
              WhatsApp a planner
            </Button>
            <Button variant="text" href="/portfolio" cta="view_portfolio" location="about_cta">
              View Our Work
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
