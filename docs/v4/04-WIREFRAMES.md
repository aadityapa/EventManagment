# Glitz Events V4 — Wireframes (low-fi)

> Section-by-section layout intent for key pages. ASCII = structure & hierarchy, not pixels.
> Legend: `▓` full-bleed image · `░` glass panel · `●` primary CTA · `○` secondary · `——` hairline rule · `[ ]` media · `»` motion note.

---

## HOME — target: 8 acts (down from 14)

### ACT 1 · Hero (cinematic)
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ full-bleed art-directed frame ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓                                                            ▓ │
│ ▓   CINZEL KICKER — INDIA'S LUXURY EVENT HOUSE               ▓ │
│ ▓                                                            ▓ │
│ ▓   Creating                       » per-word mask reveal    ▓ │
│ ▓   Extraordinary    ← oversized Playfair clamp(.. ,7rem)    ▓ │
│ ▓   Experiences                                              ▓ │
│ ▓                                                            ▓ │
│ ▓   standfirst (Cormorant, 1 line)                           ▓ │
│ ▓   ● Begin Your Event      ○ View Our Work                  ▓ │
│ ▓                                                            ▓ │
│ ▓   ── 1,000+ events · 4.9★ · 35+ cities (quiet strip) ──    ▓ │
│ ▓                              [scroll cue ↓]  [frame dots →] ▓ │
└──────────────────────────────────────────────────────────────┘
» Single primary CTA. Mouse parallax on bg + FX layers. Gold particles.
» GSAP timeline: kicker → display words (mask, stagger) → standfirst → CTAs → strip.
» Adaptive theme samples frame for AAA contrast. Reduced-motion = instant, static frame.
```

### ACT 2 · Trust ribbon (quiet)
```
── as seen / trusted by · marquee of marks, low contrast, hairline top/bottom ──
» slow marquee, pauses on hover, fades at edges.
```

### ACT 3 · Who We Are (editorial split) — REFERENCE REBUILD
```
┌───────────────────────────┬──────────────────────────────────┐
│  KICKER — WHO WE ARE        │                                  │
│                             │   [ tall art-directed portrait ] │
│  Architects of              │   ▓▓▓▓▓ parallax (y on scroll) ▓ │
│  Extraordinary  ← display    │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  Celebrations               │                                  │
│                             │   ░ floating glass stat card ░   │
│  standfirst (Cormorant)     │   "12+ yrs · 1,000+ events"      │
│  body (Manrope, measured)   │                                  │
│  — differentiator list      │                                  │
│  ○ Our Story →              │                                  │
└───────────────────────────┴──────────────────────────────────┘
» Asymmetric 7/5 grid. Text column reveals word-line by line. Image parallax + glass card counter-floats.
```

### ACT 4 · Signature Services (ranked, not equal grid)
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — WHAT WE CRAFT                                        │
│  ┌───────────────── FEATURED: LUXURY WEDDINGS ──────────────┐ │
│  │ ▓▓▓ wide cinematic frame ▓▓▓  | title + standfirst + →   │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌────────┐ ┌────────┐ ┌────────┐   ← smaller, secondary      │
│  │Corporate│ │Destination│ │Concerts│   asymmetric, overlap    │
│  └────────┘ └────────┘ └────────┘                              │
└──────────────────────────────────────────────────────────────┘
» Featured pinned/zoom on scroll; secondary cards stagger in.
```

### ACT 5 · Proof film (Portfolio teaser)
```
┌──────────────────────────────────────────────────────────────┐
│  → horizontal scroll of 4–5 case frames (sticky pin)          │
│  ▓case▓  ▓case▓  ▓case▓  ▓case▓     caption overlays on each   │
│  ○ Enter the Portfolio →                                       │
└──────────────────────────────────────────────────────────────┘
» Pinned section; vertical scroll drives horizontal translate (GSAP).
```

### ACT 6 · The Glitz Difference (replaces Why+How+Stats)
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — WHY GLITZ                                            │
│  3 large editorial rows (alternating L/R), each: number ·     │
│  statement · supporting line · hairline divider               │
│  ── animated counters: 1,000+ / 4.9★ / 35+ ──                 │
└──────────────────────────────────────────────────────────────┘
```

### ACT 7 · Voices (testimonials, single-focus)
```
┌──────────────────────────────────────────────────────────────┐
│  large pull-quote (Cormorant italic), name, event, ★          │
│  ‹ ›  quiet pagination · one quote at a time, not a wall      │
└──────────────────────────────────────────────────────────────┘
```

### ACT 8 · Invitation (CTA + concierge)
```
┌──────────────────────────────────────────────────────────────┐
│ ░░░ liquid-glass panel over dune-glow gradient ░░░            │
│  Display: "Let's begin your event."                           │
│  ● Book Consultation   ○ WhatsApp   · phone +91 9730594753    │
└──────────────────────────────────────────────────────────────┘
```

---

## ABOUT
```
1 HERO        ▓ full-bleed atelier frame · kicker + display "We are Glitz" · standfirst
2 MANIFESTO   centered oversized statement of values (1 idea, huge type, white space)
3 STORY       sticky-scroll timeline ── 2012 → today milestones, year pins, parallax
4 FOUNDERS    portrait grid (art-directed, hover reveal of name/role)
5 NUMBERS     quiet counters + press/credentials wall (marquee)
6 GEO BLOCK   facts: who/where/since/scope (extractable) + 3 Q&A
7 CTA         invitation panel
```

## SERVICES (index)
```
1 HERO        kicker + display "What we craft" + standfirst
2 SIGNATURE   featured Luxury Weddings (full-bleed, pinned)
3 GRID        remaining services, asymmetric, hover cinematic crop
4 PROCESS     4-step spine (concept→design→produce→deliver), connected line
5 CROSS       venues + vendors teaser strips
6 CTA         invitation
```

## SERVICES (detail `[slug]`)
```
1 HERO        service frame + title + indicative investment band
2 STANDFIRST  what it is, who it's for
3 DELIVERABLES table/spec (also GEO-extractable)
4 PROCESS     spine
5 GALLERY     proof frames
6 RELATED     case studies + venues
7 FAQ         per-service Q&A (schema)
8 CTA
```

## PORTFOLIO (centerpiece)
```
1 HERO        "Our Films" display + filter chips (type/scale/location)
2 FEATURED    one full-bleed case film, sticky caption, scrub video/parallax
3 GRID/SCROLL alternating full-bleed rows + horizontal scroll cluster
4 CASE arc    (on detail) brief → concept → execution → result → testimonial
5 CTA
```

## VENUES
```
1 HERO        "Where it happens" + destination desire framing
2 FILTERS     location/type/capacity (smooth transitions, preserve marketplace)
3 GRID        editorial venue cards (full-bleed image, hairline meta)
4 DESTINATION editorial spotlights (Udaipur/Goa/Tuscany)
5 CTA
```

## CONTACT / BOOK
```
CONTACT
1 HERO        "Speak to a concierge" + response-time promise
2 SPLIT       form (left) · direct lines + map atmosphere + hours (right)
3 REASSURE    "a real planner replies within X hrs" · names/faces
4 GEO BLOCK   address/phone/hours facts

BOOK (guided)
1 PROGRESS    step rail (Event type → Date & scale → Vision → Contact)
2 STEP CARDS  one decision per screen, large touch targets, warmth copy
3 REASSURE    persistent trust strip (1,000+ events, secure, no spam)
4 CONFIRM     cinematic "We're on it" moment + what-happens-next
» Preserve leads API + validation; only the flow/skin changes.
```

> These wireframes define **section order, hierarchy, and key interactions**. Full visual comps emerge per-page in later sessions; this session implements Act 1 (hero) + Act 3 (Who We Are) as the proof.
