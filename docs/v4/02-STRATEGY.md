# Glitz Events V4 — Redesign Strategy

> From "an excellent luxury website" → "a cinematic experience that feels like a ₹1Cr engagement."

## 1. Vision
**Glitz is not a vendor; Glitz is the author of unforgettable nights.** The website should feel like the opening reel of a film about your event — restrained, confident, expensive, and warm. Every scroll is a cut; every section is a scene. The viewer should feel *taken care of* before they ever fill a form.

One line: **"Cinematic luxury, quietly engineered."**

## 2. Design principles (the V4 constitution)
1. **Restraint is the luxury.** One idea per scene. Generous negative space. Remove before you add. (Aman, Apple)
2. **Type is the art.** Editorial scale with oversized display moments and a true kicker→display→standfirst→body rhythm. (Louis Vuitton, editorial press)
3. **Light & material, not decoration.** Depth via liquid-glass layering, dune-glow gradients, film grain — never gradients-for-gradients'-sake.
4. **Motion is authored, not sprinkled.** A single shared motion grammar (easing, durations, choreography) so the whole site feels directed by one hand. (Awwwards SOTD)
5. **Adaptive & accessible by default.** Dual theme, context-aware contrast, WCAG AAA targets, full reduced-motion path. Luxury includes everyone.
6. **Warm, human concierge.** Indian luxury hospitality — never cold minimalism. Gold warmth, personal voice, reassurance at every conversion step.
7. **Performance is etiquette.** Fast is respectful. Tier hydration; lazy the spectacle; protect LCP/INP.

## 3. References → concrete decisions

| Reference | What we borrow | Concrete V4 decision |
|-----------|----------------|----------------------|
| **Apple** | Product reverence, scroll-pinned reveals, ruthless hierarchy | Pinned hero headline, single primary CTA, scroll-driven "scenes," obsessive spacing scale |
| **Aman** | Stillness, full-bleed art direction, muted opulence | Full-bleed editorial frames, huge white space, calm easing (`expo.out`), no clutter |
| **Louis Vuitton** | Editorial typography, monogram rhythm, fashion-film motion | Oversized serif display, mixed serif/sans, gold hairline rules, marquee word reveals |
| **Awwwards SOTD** | Orchestrated motion, depth/parallax, micro-interactions, page transitions | Lenis + GSAP ScrollTrigger choreography, parallax layers, magnetic hovers, view-transition curtains |

## 4. Emotional journey (per page)

| Page | Feeling on arrival | Feeling on leaving |
|------|--------------------|--------------------|
| Home | "This is a different league." | "I want them to handle ours." |
| About | "These people are artists." | "I trust their taste." |
| Services | "They can do *exactly* my event." | "Weddings are clearly their masterpiece." |
| Portfolio | "I'm watching a highlight film." | "I can picture *our* film." |
| Venues | "Desire — I want to be *there*." | "They have access I don't." |
| Vendors | "Curated, vetted, elite." | "Nothing will be left to chance." |
| Contact/Book | "A concierge is expecting me." | "That was effortless; they've got me." |

## 5. Content strategy
- **Voice:** confident, warm, sparing. Short declaratives. Numbers as proof, never as boast.
- **Editorial blocks:** kicker (Cinzel caps) → display (Playfair) → standfirst (Cormorant) → body (Manrope).
- **GEO/AEO layer:** every key page gets an extractable facts block (who/where/since/scope) + 3–5 Q&A pairs for answer engines, on top of marketing copy. Preserve all existing schema.
- **Proof everywhere:** signature events, real numbers (1,000+ events, 4.9★, 35+ cities), press, testimonials with names — but quietly placed.
- **Preserve:** all 20 blog posts, local SEO pages, service slugs.

## 6. Success metrics
- **Qualitative:** Awwwards-honourable-mention-level art direction & motion; "wow" within the first viewport.
- **Conversion:** consultation/book starts ↑; reduced hero CTA confusion (single primary CTA).
- **Performance:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on Home (mobile, mid-tier device); JS shipped on first paint reduced via tiered hydration.
- **A11y:** WCAG AA minimum everywhere, AAA on primary text; zero invisible-text regressions; full keyboard + reduced-motion parity.
- **SEO/GEO:** retain all current rankings/routes; add extractable answer blocks without regressions.

## 7. Scope discipline
This rebuild changes **design, motion, architecture, and content presentation**. It does **not** rewrite backend, auth, payments, booking APIs, dashboards, analytics, or existing SEO/blog/local routes. The proof for this session is the **Home hero + "Who We Are"** rebuilt on the new system.
