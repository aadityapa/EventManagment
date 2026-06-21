# Glitz Events V5 — Wireframes

> Low-fidelity structure + interaction notes. ASCII = hierarchy, not pixels.  
> Legend: `▓` full-bleed media · `░` glass/liquid glass · `●` primary CTA · `○` secondary · `──` hairline · `»` motion/interaction · `⟨⟩` portal

---

## A. Cinematic loader — 6-scene movie intro

Total duration: **~8–10s** (skippable after scene 2; reduced-motion = skip all)

### Scene 1 · Obsidian void (0.0–1.2s)
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ #050505 warm obsidian ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                                              │
│              ·  ·    ·   (sparse gold dust particles)        │
│                                                              │
│                                              [ Skip ⟩ ]      │
└──────────────────────────────────────────────────────────────┘
» Fade from site preload black; particles drift slow (GSAP); optional low rumble (sound-ready hook)
```

### Scene 2 · Gold thread (1.2–2.4s)
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                         ╱                                    │
│                       ╱  ← single hairline gold thread draws │
│                     ╱     from center-bottom to top-right    │
│                   ╱                                          │
└──────────────────────────────────────────────────────────────┘
» SVG path stroke-dashoffset animate; `--v5-gold-metallic` glow on leading edge
```

### Scene 3 · Logo reveal (2.4–4.0s)
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                    ┌───────────────┐                           │
│                    │   [G] GLITZ   │  ← mask reveal + glow   │
│                    └───────────────┘                           │
│                   radial dune glow behind logo                 │
└──────────────────────────────────────────────────────────────┘
» Scale 0.92→1; ring pulse (reuse V4 loader rings, extended); `useLoaderSound()` fire point
```

### Scene 4 · World glimpse montage (4.0–6.0s)
```
┌──────────────────────────────────────────────────────────────┐
│ ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐          │
│ │▓Wedding│ → │▓Corp.  │ → │▓Dest.  │ → │▓Culture│  (fast   │
│ └────────┘   └────────┘   └────────┘   └────────┘   cuts)  │
│         » 0.4s each frame; cross-dissolve; no text yet       │
└──────────────────────────────────────────────────────────────┘
» Preloaded WebP loops; adaptive scrim per frame; establishes "universe" metaphor
```

### Scene 5 · Tagline (6.0–7.5s)
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│              Architects of                                     │
│              Extraordinary Experiences   ← word mask reveal  │
│              (Playfair display, champagne on obsidian)       │
└──────────────────────────────────────────────────────────────┘
» GSAP stagger words; Cinzel kicker "GLITZ EVENTS" fades above
```

### Scene 6 · Curtain rise (7.5–9.0s)
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ════════════════════════════════════  ← obsidian curtain      │
│ ░░░░░░░ HOME WELCOME FRAME begins visible below ░░░░░░░░░░░░ │
└──────────────────────────────────────────────────────────────┘
» Curtain translates Y -100%; Lenis unblocked; sessionStorage `glitz-v5-premiere-seen`
» `aria-live="polite"` announces "Welcome to Glitz Events"
```

---

## B. Home — 9 chapters

### Chapter 1 · Welcome
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ full-bleed art-directed frame ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓  KICKER — ARCHITECTS OF EXTRAORDINARY EXPERIENCES          ▓ │
│ ▓  Creating / Extraordinary / Experiences  » word masks      ▓ │
│ ▓  standfirst (1 line, Cormorant)                            ▓ │
│ ▓  ● Begin Your Commission    ○ Enter the Archive            ▓ │
│ ▓  ── 1,000+ · 4.9★ · 35+ cities ──         [scroll cue ↓]   ▓ │
└──────────────────────────────────────────────────────────────┘
» Evolve HeroV4; single primary CTA; mouse parallax; adaptive AAA; `#welcome`
```

### Chapter 2 · Who We Are
```
┌─────────────────────────────┬────────────────────────────────┐
│ KICKER — THE ATELIER          │  [ tall editorial portrait ]   │
│ Who We Are                    │  ▓▓▓ parallax on scroll ▓▓▓    │
│ display headline              │                                │
│ standfirst + body             │  ░ glass stat card ░           │
│ ○ Our Story → /about          │  "12+ years · 1,000+ events"   │
└─────────────────────────────┴────────────────────────────────┘
» 7/5 asymmetric; line-by-line reveal; `#atelier`
```

### Chapter 3 · Experience Worlds (portals)
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — CHOOSE YOUR WORLD                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │▓ Wedding │ │▓Corporate│ │▓Destin.  │ │▓ Culture │         │
│  │  World   │ │  World   │ │  World   │ │  World   │         │
│  │ ⟨ Enter ⟩│ │ ⟨ Enter ⟩│ │ ⟨ Enter ⟩│ │ ⟨ Enter ⟩│         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└──────────────────────────────────────────────────────────────┘
» Hover: card lifts + atmosphere swatch glow; click: portal transition → filtered destination
» `#worlds`
```

### Chapter 4 · Signature Experiences
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — WHAT WE CRAFT                                        │
│  ┌────────────── FEATURED: LUXURY WEDDINGS ────────────────┐ │
│  │ ▓▓▓ cinematic wide ▓▓▓  │ title + standfirst + →        │ │
│  └──────────────────────────────────────────────────────────┘ │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐  (overlap/stack)   │
│     │Corporate│  │Destinat.│  │Concerts │                     │
└──────────────────────────────────────────────────────────────┘
» Featured scrub zoom (existing GSAP); `#craft`
```

### Chapter 5 · Portfolio Universe
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — THE ARCHIVE                                          │
│  ┌── pinned horizontal scroll ──────────────────────────────┐ │
│  │ ▓case▓   ▓case▓   ▓case▓   ▓case▓   ▓case▓                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ○ Explore the Archive → /portfolio                             │
└──────────────────────────────────────────────────────────────┘
» ScrollTrigger pin + xPercent; caption overlays; `#archive`
```

### Chapter 6 · Venue Universe
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — DESTINATIONS                                         │
│  ┌──────── Jaipur ────────┐  ┌──────── Udaipur ───────────┐  │
│  │ ▓▓▓ desire frame ▓▓▓   │  │ ▓▓▓ desire frame ▓▓▓       │  │
│  │ ○ Explore venues        │  │ ○ Explore venues           │  │
│  └─────────────────────────┘  └────────────────────────────┘  │
│  ○ Enter the Destinations → /venues                             │
└──────────────────────────────────────────────────────────────┘
» Destination-as-desire; `#destinations`
```

### Chapter 7 · Testimonials
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — VOICES                                               │
│       "They didn't just plan our wedding —                   │
│        they authored a memory we'll inherit."                │
│        — Name · Event · ★★★★★                                 │
│                    ‹   ●   ›   (one quote at a time)           │
└──────────────────────────────────────────────────────────────┘
» Crossfade quotes; Cormorant italic display; `#voices`
```

### Chapter 8 · Media & Awards
```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — RECOGNITION                                          │
│  [ press logo ] [ press logo ] [ award ] [ award ]           │
│  slow marquee · low contrast · hairline rules                  │
│  optional: embedded 15s showreel thumbnail → modal             │
└──────────────────────────────────────────────────────────────┘
» Quiet credibility; `#recognition`
```

### Chapter 9 · Book Journey
```
┌──────────────────────────────────────────────────────────────┐
│ ░░░ liquid-glass over dune-glow gradient ░░░                   │
│  KICKER — THE COMMISSION                                       │
│  display: "Your extraordinary evening awaits a architect."   │
│  ● Book Consultation    ○ Speak to Concierge (+91…)          │
│  ○ Meet the Oracle (AI) → /ai                                │
└──────────────────────────────────────────────────────────────┘
» `#commission`; warm sand base (no pure white)
```

---

## C. Services — cinematic chapter template

Applies to every `/services/[slug]`:

### Prologue
```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ service-specific hero ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  [World tag: WEDDING WORLD]                                    │
│  KICKER — THE CRAFT                                            │
│  display: Luxury Wedding Planning                              │
│  ● Begin Commission   ○ View Archive Proof                     │
└──────────────────────────────────────────────────────────────┘
```

### Vision (pinned text + scrolling imagery)
```
┌────────────────────────── pinned copy ──────────────────────┐
│  standfirst + body scrolls through 3 beats                   │
│  alongside vertical film strip of 4–6 frames »               │
└──────────────────────────────────────────────────────────────┘
```

### Process film
```
  01 ── Discovery ──▓
  02 ── Design ────▓     » horizontal step reveal on scroll
  03 ── Rehearsal ─▓
  04 ── Execution ─▓
```

### Proof + Commission
```
┌───────────────────────┬──────────────────────────────────────┐
│ [ case study card ]   │  pull-quote + stats                  │
│ → full case           │  ● Book this craft                   │
└───────────────────────┴──────────────────────────────────────┘
```

---

## D. Portfolio — Netflix experience

```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓ HERO FEATURE (autoplay loop on hover, 5s) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  Title overlay + ● Play Case Film                              │
└──────────────────────────────────────────────────────────────┘

 ROW: Wedding Worlds ──────────────────────────────────────────→
 [thumb] [thumb] [thumb] [thumb] [thumb]   » hover scale 1.05 + preview

 ROW: Corporate Moments ───────────────────────────────────────→

 ROW: Destination Dreams ──────────────────────────────────────→

 ┌─ modal / full-screen case film ─────────────────────────────┐
 │ Brief → Concept → Execution → Result → Testimonial          │
 │ « close                                            ● Book » │
 └─────────────────────────────────────────────────────────────┘
```

**Interaction notes:**
- Row scroll: native horizontal + drag; arrow keys navigate thumbs
- `prefers-reduced-motion`: static poster frames, no autopreview
- Filter chips reorder rows without route change

---

## E. Venue marketplace — Venue Universe

```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — THE DESTINATIONS                                     │
│  display: "Access to places others only photograph."         │
├──────────────────────────────────────────────────────────────┤
│  SPOTLIGHT: Jaipur | Udaipur | Goa | Mumbai  (tab portals)   │
│  ▓▓▓ editorial destination hero per tab ▓▓▓                    │
├──────────────────────────────────────────────────────────────┤
│  [filters: city · capacity · investment band]                  │
│  ┌────────┐ ┌────────┐ ┌────────┐                            │
│  │ venue  │ │ venue  │ │ venue  │  » stagger reveal           │
│  │ card   │ │ card   │ │ card   │                            │
│  └────────┘ └────────┘ └────────┘                            │
├──────────────────────────────────────────────────────────────┤
│  optional Phase 7: map panel (2D) + WebGL pin glow for 3–5 HQ │
└──────────────────────────────────────────────────────────────┘
```

---

## F. Event Architect — 5-step booking journey

**Not forms — conversational commission panels.**

### Step 1 · Vision
```
┌──────────────────────────────────────────────────────────────┐
│  Progress: ●──○──○──○──○   Step 1 of 5 · Vision              │
│  "What are we architecting together?"                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
│  │ Wedding │ │Corporate│ │ Concert │  » large tactile tiles   │
│  └─────────┘ └─────────┘ └─────────┘                         │
│  [ calendar atmosphere picker — date ]                         │
│  ─────────────────────────────────────                       │
│  ● Continue                                    ○ WhatsApp help │
└──────────────────────────────────────────────────────────────┘
» Maps to wizard: eventType + date
```

### Step 2 · Scale
```
  "How grand shall this evening be?"
  [ guest slider — visual arc, not number input first ]
  [ investment band cards — philosophy labels, not ₹ tables ]
» Maps to: guestCount + budgetId
```

### Step 3 · Atmosphere
```
  "Where shall the story unfold?"
  [ venue cards — visual pick ] + [ service chips — curated ]
» Maps to: venueId + services[]
```

### Step 4 · Partners
```
  ░ summary glass panel ░
  "Your commission brief" — editable story recap
  [ name · email · phone ] — minimal fields, concierge tone
» Maps to: review/contact (pre-payment)
```

### Step 5 · Handshake
```
  ✓ Commission received
  ▓▓ celebratory still frame ▓▓
  "Your architect will call within 24 hours."
  [ optional Razorpay deposit ] → existing payment flow
» Maps to: payment + confirmation
```

---

## G. AI Experience hub (`/ai`)

```
┌──────────────────────────────────────────────────────────────┐
│  KICKER — THE ORACLE                                           │
│  display: "Describe the evening you imagine."                  │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Chat / guided chips (event · budget · city · guests)    │  │
│  │ [ conversational thread area ]                          │  │
│  └────────────────────────────────────────────────────────┘  │
│  ░ Plan output panel ░                                         │
│  Timeline · Venues · Vendors · Estimate                       │
│  ● Download brief   ● Book consultation   ○ Share WhatsApp     │
├──────────────────────────────────────────────────────────────┤
│  GEO block: structured plan JSON-LD (Phase 9)                │
└──────────────────────────────────────────────────────────────┘
» Extends `ai-planner.tsx` logic; world-aware chip sets
```

---

## H. Universe shell — spatial navigation

```
Desktop scrolled state:
┌──────────────────────────────────────────────────────────────┐
│ ░░░ glass nav ░░░  Worlds▾  Archive  Destinations  Journal  │
│                    +91 9730594753  ◐  ● Book                 │
└──────────────────────────────────────────────────────────────┘

Portal transition (world enter):
  Obsidian curtain slides L→R (0.6s drama ease)
  → destination page fades in with world atmosphere preset
  → adaptive engine applies world palette to hero
```

---

## I. Page transition / curtain (global)

```
Route change:
  1. Outgoing page: opacity 1→0, y 0→-12px (0.3s luxe)
  2. Curtain: gold hairline sweeps top→bottom (0.4s)
  3. Incoming page: opacity 0→1, y 24→0 (0.5s luxe, stagger children)
  
Reduced motion: instant swap, no curtain
```

---

## J. Responsive breakpoints (interaction)

| Breakpoint | Behavior |
|------------|----------|
| `< md` | Worlds 2-col grid; portfolio rows swipe; Event Architect full-bleed steps |
| `md–lg` | Worlds 2×2; mega-menu → drawer |
| `≥ lg` | Full universe nav + horizontal portfolio rows + pinned home chapters |

All wireframes above assume mobile-first stacking: portals become vertical scroll chapters with same narrative order.
