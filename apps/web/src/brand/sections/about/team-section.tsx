/**
 * Meet Our Leadership — the pre-V6 team section format, restored (V7 brief,
 * Package A §6): founders in a featured row, the core team in a second row.
 * Server component: the stagger is the scroll-driven `.lux-reveal`, the tilt is
 * the delegated `[data-tilt]` runtime, the ring around each monogram is CSS 3D.
 * Every word is in the HTML; nothing depends on JS or hover to be read.
 */
import type { CSSProperties } from "react";
import { AboutIcon, RESPONSIBILITY_ICONS } from "@/brand/sections/about/about-icons";
import { Scene3D } from "@/components/three/scene-host";
import { UiIcon } from "@/components/icons";
import { Reveal, Section } from "@/components/ui";
import { TEAM_MEMBERS, type TeamMember } from "@/data/team";

function SocialLinks({ member }: { member: TeamMember }) {
  if (!member.linkedin && !member.email) return null;
  return (
    <div className="pg-team-card__links">
      {member.linkedin ? (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} — Nexyyra Events on LinkedIn (opens in a new tab)`}
          className="pg-team-card__link"
          data-cta="team_linkedin"
          data-cta-location="about_team"
        >
          <UiIcon name="linkedin" size={20} />
        </a>
      ) : null}
      {member.email ? (
        <a
          href={`mailto:${member.email}`}
          aria-label={`Email ${member.name} at ${member.email}`}
          className="pg-team-card__link"
          data-cta="team_email"
          data-cta-location="about_team"
        >
          <UiIcon name="mail" size={20} />
        </a>
      ) : null}
    </div>
  );
}

function TeamCard({ member, featured, index }: { member: TeamMember; featured: boolean; index: number }) {
  return (
    <Reveal as="li" index={index} className="pg-team-grid__item">
      <article
        id={member.slug}
        className={featured ? "pg-team-card pg-team-card--founder" : "pg-team-card"}
        aria-labelledby={`${member.slug}-name`}
        data-tilt=""
      >
        {/* Monogram inside a slowly turning gold ring (CSS 3D; static under reduced motion). */}
        <div className="pg-team-card__avatar" aria-hidden="true" style={{ "--ring-delay": `${index * -1.6}s` } as CSSProperties}>
          <span className="pg-team-card__ring" />
          <span className="pg-team-card__ring pg-team-card__ring--cross" />
          <span className="pg-team-card__monogram">{member.initials}</span>
        </div>

        {featured ? (
          <p className="pg-team-card__badge">
            <AboutIcon name="crown" size={20} /> Founder
          </p>
        ) : null}

        <h3 id={`${member.slug}-name`} className="pg-team-card__name">
          {member.name}
        </h3>
        <p className="pg-team-card__role">{member.role}</p>

        {featured && member.leadership ? <p className="pg-team-card__lead">{member.leadership}</p> : null}

        <p className="pg-team-card__bio">{member.bio}</p>

        <ul className="pg-team-card__duties" aria-label={`${member.name}'s key responsibilities`}>
          {member.responsibilities.map((item) => (
            <li key={item}>
              <AboutIcon name={RESPONSIBILITY_ICONS[item] ?? "sparkle"} size={20} />
              {item}
            </li>
          ))}
        </ul>

        <SocialLinks member={member} />
      </article>
    </Reveal>
  );
}

function Tier({ label, members, featured }: { label: string; members: TeamMember[]; featured: boolean }) {
  const id = `team-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="pg-team-tier">
      <p id={id} className="pg-team-tier__label">
        <span aria-hidden="true">—</span> {label} <span aria-hidden="true">—</span>
      </p>
      <ul className="pg-team-grid" aria-labelledby={id}>
        {members.map((member, i) => (
          <TeamCard key={member.slug} member={member} featured={featured} index={i} />
        ))}
      </ul>
    </div>
  );
}

export function TeamSection({ number }: { number?: string }) {
  const founders = TEAM_MEMBERS.filter((m) => m.founder);
  const coreTeam = TEAM_MEMBERS.filter((m) => !m.founder);

  return (
    <Section
      id="team"
      number={number}
      eyebrow="Our Team"
      title="Meet Our Leadership"
      lead="Behind every unforgettable celebration is a passionate team dedicated to innovation, creativity, and flawless execution."
      className="pg-team"
    >
      <div className="pg-team__coin" aria-hidden="true">
        <Scene3D variant="coin" />
      </div>
      <Tier label="Founders" members={founders} featured />
      <Tier label="Core Team" members={coreTeam} featured={false} />
    </Section>
  );
}
