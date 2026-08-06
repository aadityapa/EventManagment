"use client";

/**
 * Meet Our Leadership — premium team section for the About page.
 * Two tiers: featured founder cards on top, core team in one line below.
 * Follows the house V4/V5 design grammar: GlassPanel surfaces, ScrollReveal,
 * staggered Framer Motion reveals, and existing gold/purple theme tokens.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenCheck,
  Brush,
  Calculator,
  CalendarCheck,
  ClipboardList,
  Code2,
  CreditCard,
  Cpu,
  Crown,
  Database,
  FileText,
  Flower2,
  Gem,
  Globe,
  Handshake,
  Mail,
  Megaphone,
  Palette,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Wallet,
  Wand2,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { TEAM_MEMBERS, type TeamMember } from "@/data/team";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";

/** LinkedIn brand glyph — lucide dropped brand icons; matches the footer's. */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 8.5h3v11h-3v-11zM8 6.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM11 8.5h2.9v1.5h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6V19.5h-3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74v5.3H11V8.5z" />
    </svg>
  );
}

/** Maps each responsibility label to a lucide icon. */
const RESPONSIBILITY_ICONS: Record<string, LucideIcon> = {
  "Business Strategy": Target,
  "Event Operations": Settings2,
  "Client Relations": Handshake,
  "Overall Management": Crown,
  "Technology Strategy": Cpu,
  "Website Development": Code2,
  Automation: Workflow,
  "Digital Innovation": Sparkles,
  "Technical Operations": Settings2,
  "Marketing Strategy": Megaphone,
  "Brand Development": Gem,
  "Business Growth": TrendingUp,
  "Client Acquisition": UserPlus,
  "Digital Marketing": Globe,
  "Event Decoration": Flower2,
  "Theme Planning": Palette,
  "Floral Design": Flower2,
  "Venue Styling": Wand2,
  "Creative Execution": Brush,
  "Data Management": Database,
  Documentation: FileText,
  "Event Coordination": CalendarCheck,
  "Administrative Operations": ClipboardList,
  "Financial Planning": Wallet,
  "Budget Management": Calculator,
  "Vendor Payments": CreditCard,
  Accounts: BookOpenCheck,
  Compliance: ShieldCheck,
};

function SocialLinks({ member }: { member: TeamMember }) {
  const linkClass =
    "grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition-colors duration-300 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)] focus-visible:border-[var(--lux-gold)] focus-visible:text-[var(--lux-gold)]";
  return (
    <div className="mt-auto flex items-center justify-center gap-2 pt-4">
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className={linkClass}
        >
          <LinkedinIcon className="h-3.5 w-3.5" />
        </a>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className={linkClass}>
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function TeamCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.li
      variants={staggerItem}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="team-card list-none"
    >
      <GlassPanel as="article" className="relative h-full overflow-hidden p-4 sm:p-5">
        <span className="team-card__wash" aria-hidden="true" />

        <div className="relative flex h-full flex-col items-center text-center">
          {/* Avatar */}
          <div className="team-card__avatar" aria-hidden={member.image ? undefined : "true"}>
            {member.image ? (
              <Image
                src={member.image}
                alt={`Portrait of ${member.name}, ${member.role} at Nexyyra Events`}
                width={64}
                height={64}
                loading="lazy"
                sizes="64px"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--lux-gold)]">
                {member.initials}
              </span>
            )}
          </div>

          {/* Founder badge */}
          {featured && (
            <span className="mt-3 flex items-center gap-1 rounded-full border border-[var(--lux-gold)]/35 bg-[var(--lux-gold)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--lux-gold)]">
              <Crown className="h-3 w-3" aria-hidden="true" /> Founder
            </span>
          )}

          {/* Identity */}
          <h3
            className={`v4-title ${featured ? "mt-2" : "mt-3"} whitespace-nowrap text-base text-[var(--text-primary)]`}
          >
            {member.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--lux-gold)]">
            {member.role}
          </p>

          {/* Leadership statement — founders only */}
          {featured && member.leadership && (
            <p className="mt-2 text-xs italic leading-relaxed text-[var(--lux-gold-metal,var(--lux-gold))]/90">
              {member.leadership}
            </p>
          )}

          {/* Bio */}
          <p className={`v4-body mt-2.5 text-xs leading-relaxed ${featured ? "" : "line-clamp-3"}`}>
            {member.bio}
          </p>

          {/* Responsibilities */}
          <ul
            className="mt-3 flex flex-wrap justify-center gap-1.5"
            aria-label={`${member.name}'s key responsibilities`}
          >
            {member.responsibilities.map((item) => {
              const Icon = RESPONSIBILITY_ICONS[item] ?? Sparkles;
              return (
                <li
                  key={item}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-muted"
                >
                  <Icon className="h-3 w-3 shrink-0 text-[var(--lux-gold)]" aria-hidden="true" />
                  {item}
                </li>
              );
            })}
          </ul>

          <SocialLinks member={member} />
        </div>
      </GlassPanel>
    </motion.li>
  );
}

function TierLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
      <span className="text-[var(--lux-gold)]">—</span> {children}{" "}
      <span className="text-[var(--lux-gold)]">—</span>
    </p>
  );
}

export function TeamSection() {
  const founders = TEAM_MEMBERS.filter((m) => m.founder);
  const coreTeam = TEAM_MEMBERS.filter((m) => !m.founder);

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="v4-section v4-dune-glow bg-[var(--glitz-surface)]"
    >
      <div className="brand-container">
        <ScrollReveal preset="reveal" className="mx-auto max-w-3xl text-center">
          <span className="v4-kicker mb-4 justify-center">Our Team</span>
          <h2 id="team-heading" className="v4-display">
            Meet Our <span className="v4-gold-text">Leadership</span>
          </h2>
          <p className="v4-standfirst mt-6">
            Behind every unforgettable celebration is a passionate team dedicated to innovation,
            creativity, and flawless execution.
          </p>
        </ScrollReveal>

        {/* Founders — one line */}
        <div className="mx-auto mt-12 max-w-5xl">
          <TierLabel>Founders</TierLabel>
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3"
          >
            {founders.map((member) => (
              <TeamCard key={member.slug} member={member} featured />
            ))}
          </motion.ul>
        </div>

        {/* Core team — one line */}
        <div className="mx-auto mt-10 max-w-5xl">
          <TierLabel>Core Team</TierLabel>
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3"
          >
            {coreTeam.map((member) => (
              <TeamCard key={member.slug} member={member} />
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
