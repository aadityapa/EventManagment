"use client";

/**
 * Meet Our Leadership — premium team section for the About page.
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

function TeamCard({ member }: { member: TeamMember }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.li
      variants={staggerItem}
      whileHover={reducedMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="team-card list-none"
    >
      <GlassPanel as="article" className="relative h-full overflow-hidden p-7 sm:p-8">
        <span className="team-card__wash" aria-hidden="true" />

        <div className="relative flex h-full flex-col items-center text-center">
          {/* Avatar */}
          <div className="team-card__avatar" aria-hidden={member.image ? undefined : "true"}>
            {member.image ? (
              <Image
                src={member.image}
                alt={`Portrait of ${member.name}, ${member.role} at Nexyyra Events`}
                width={96}
                height={96}
                loading="lazy"
                sizes="96px"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--lux-gold)]">
                {member.initials}
              </span>
            )}
          </div>

          {/* Identity */}
          <h3 className="v4-title mt-5 text-xl text-[var(--text-primary)]">{member.name}</h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--lux-gold)]">
            {member.role}
          </p>

          {/* Bio */}
          <p className="v4-body mt-4 text-sm leading-relaxed">{member.bio}</p>

          {/* Responsibilities */}
          <ul
            className="mt-5 flex flex-wrap justify-center gap-2"
            aria-label={`${member.name}'s key responsibilities`}
          >
            {member.responsibilities.map((item) => {
              const Icon = RESPONSIBILITY_ICONS[item] ?? Sparkles;
              return (
                <li
                  key={item}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--lux-gold)]" aria-hidden="true" />
                  {item}
                </li>
              );
            })}
          </ul>

          {/* Social */}
          <div className="mt-auto flex items-center gap-3 pt-6">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition-colors duration-300 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)] focus-visible:border-[var(--lux-gold)] focus-visible:text-[var(--lux-gold)]"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition-colors duration-300 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)] focus-visible:border-[var(--lux-gold)] focus-visible:text-[var(--lux-gold)]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.li>
  );
}

export function TeamSection() {
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

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.slug} member={member} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
