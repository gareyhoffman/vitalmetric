---
title: "VitalMetric — Site Spec & Design Requirements"
type: spec
status: draft
created: 2026-06-04
updated: 2026-06-04
tags: [vitalmetric, spec, design, responsive, architecture]
---

# VitalMetric — Site Specification

> **SDD (Spec Driven Development):** This document defines every requirement before any code is written. Build order is defined in Section 12. Each component is designed mobile-first with defined breakpoints.

---

## 1. Design System

### 1.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0A6E6E` | Headings, buttons, links, gauge teal arc |
| `--color-primary-dark` | `#085A5A` | Hover states, active states |
| `--color-primary-light` | `#D4ECE6` | Badges, alert backgrounds, highlight |
| `--color-accent` | `#FF6B4A` | CTAs, accent text, gauge coral arc, "METRIC" in logo |
| `--color-accent-hover` | `#E55A3A` | Button hover |
| `--color-bg` | `#F4F7F7` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, calculator panels |
| `--color-text` | `#1A1E1E` | Body text, headings |
| `--color-text-muted` | `#4A5A5A` | Secondary text |
| `--color-text-faint` | `#7A8E8E` | Labels, meta, placeholders |
| `--color-border` | `#D4DCDC` | Borders, dividers |
| `--color-border-light` | `#E4EAEA` | Subtle borders |
| `--color-success` | `#2E9E6E` | Positive metrics |
| `--color-gradient-start` | `#0A6E6E` | Hero gradient start |
| `--color-gradient-end` | `#0D8080` | Hero gradient end |

### 1.2 Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | All body text |
| `--font-display` | Same as body (system fonts for speed) | Headings |
| `--font-mono` | `"SF Mono", "Fira Code", Consolas, monospace` | Numbers, stats only |

#### Type Scale

```css
--text-xs:   0.75rem  (12px)  — labels, tags
--text-sm:   0.875rem (14px)  — body small, stat descriptions
--text-base: 1rem     (16px)  — body text
--text-lg:   1.125rem (18px)  — subtitle, hero paragraph
--text-xl:   1.25rem  (20px)  — section subheadings
--text-2xl:  1.5rem   (24px)  — section headings
--text-3xl:  1.875rem (30px)  — page headings (mobile)
--text-4xl:  2.25rem  (36px)  — hero heading (mobile)
--text-5xl:  3rem     (48px)  — hero heading (desktop)
--text-6xl:  4rem     (64px)  — result age number
--text-7xl:  4.5rem   (72px)  — result age number (desktop)
```

Mobile-first: use smaller sizes on mobile, scale up at `md` breakpoint.

### 1.3 Spacing

```css
--space-1:  0.25rem (4px)
--space-2:  0.5rem  (8px)
--space-3:  0.75rem (12px)
--space-4:  1rem    (16px)
--space-5:  1.25rem (20px)
--space-6:  1.5rem  (24px)
--space-8:  2rem    (32px)
--space-10: 2.5rem  (40px)
--space-12: 3rem    (48px)
--space-16: 4rem    (64px)
```

### 1.4 Borders & Radius

```css
--radius-sm:  6px     — tags, small elements
--radius-md:  8px     — inputs, buttons
--radius-lg:  12px    — cards, stat blocks
--radius-xl:  16px    — calculator panel
--radius-full: 9999px — badges, pills

--border-width: 1.5px  — default
--border-width-lg: 2px — focused inputs
```

### 1.5 Shadows

```css
--shadow-sm:   0 1px 3px rgba(0,0,0,0.04)    — subtle elevation
--shadow-md:   0 2px 8px rgba(0,0,0,0.06)    — cards
--shadow-lg:   0 4px 20px rgba(0,0,0,0.08)   — modals, calculator card
--shadow-xl:   0 8px 30px rgba(0,0,0,0.10)   — floating elements
```

### 1.6 Logo

**Primary logo:** Gauge/speedometer dial with heart icon and heartbeat pulse line inside. Text "VITAL" in teal `#0A6E6E`, "METRIC" in coral `#FF6B4A`. Horizontal lockup format. SVG or high-res PNG.

**Icon mark only:** The gauge symbol alone — used for favicon, social avatar, mobile nav.

**Minimum clear space:** 16px around logo on all sides.

---

## 2. Responsive Breakpoints

### 2.1 Breakpoint Definitions

```css
/* Mobile-first — base styles target < 640px */
@custom-media --sm (min-width: 640px);   /* Large phones */
@custom-media --md (min-width: 768px);   /* Tablets */
@custom-media --lg (min-width: 1024px);  /* Desktop */
@custom-media --xl (min-width: 1280px);  /* Wide desktop */
```

### 2.2 Layout Behavior by Breakpoint

| Element | < 640px (Mobile) | 640-767px (Large Phone) | 768-1023px (Tablet) | ≥ 1024px (Desktop) |
|---------|-----------------|------------------------|---------------------|-------------------|
| Hero heading | `--text-4xl` (36px) | `--text-5xl` (48px) | `--text-5xl` | `--text-5xl` |
| Calculator | Single column stacked | Single column stacked | Side by side | Side by side |
| Tool grid | 1 column | 2 columns | 3 columns | 3 columns |
| Stats bar | 2 columns | 2 columns | 4 columns | 4 columns |
| Content max-width | 100% | 100% | 720px | 880px |
| Header nav | Compact with icon | Full logo | Full logo | Full logo |
| Form inputs | Full width | Full width | Half width (paired) | Half width (paired) |
| Result panel | Below form | Below form | Right side | Right side |

### 2.3 Content Max-Widths

```css
--content-sm:  100%     (mobile, no constraint)
--content-md:  720px    (tablet)
--content-lg:  880px    (desktop)
--content-xl:  1100px   (wide desktop, header only)
```

### 2.4 Touch Targets (Mobile)

All interactive elements must have a minimum touch target of **44×44px** (WCAG 2.2 guideline). Applies to buttons, links, form controls, and tappable cards.

---

## 3. Site Architecture

### 3.1 Pages & Routes

| Path | Type | Title | SEO Keyword | Build Phase |
|------|------|-------|-------------|-------------|
| `/` | Tool page | Metabolic Age Calculator | "metabolic age calculator" | Phase A |
| `/body-composition` | Tool page | Body Composition Dashboard | "body fat calculator" | Phase B |
| `/macro-calculator` | Tool page | Diet-Specific Macro Calculator | "keto macro calculator" | Phase B |
| `/hydration-calculator` | Tool page | Hydration & Electrolyte Calculator | "water intake calculator" | Phase B |
| `/weight-loss-planner` | Tool page | Weight Loss Timeline Planner | "weight loss calculator" | Phase C |
| `/fasting-calculator` | Tool page | Intermittent Fasting Tracker | "intermittent fasting calculator" | Phase C |
| `/blog` | Blog index | Health & Wellness Articles | Long-tail | Phase B |
| `/blog/[slug]` | Blog post | Individual article | Per-article | Phase B |
| `/about` | Static | About VitalMetric | Brand | Phase A |
| `/privacy` | Static | Privacy Policy | Legal | Phase A |

### 3.2 Navigation Structure

**Header (desktop):**
```
[Logo]  [Metabolic Age] [Body Comp] [Macro Calc] [More ▼]  [All Free]
```

**Header (mobile):**
```
[Logo Icon]  [≡ Hamburger → slide-out nav]
```

**Footer:**
```
[Logo] — Know your numbers. Own your health.
[Metabolic Age] [Body Comp] [Macro] [Hydration] [Weight Loss] [Fasting]
[About] [Privacy] [Contact]
© 2026 VitalMetric
```

### 3.3 Internal Linking Strategy

Every tool page must link to at least 2 other tools:
- **Recommended sidebar:** "Next: Check your Body Composition →"
- **Related tools section:** 3 cards at the bottom of each tool page
- **Footer:** Full tool list

---

## 4. Component Library

### 4.1 Logo

**States:** Desktop (horizontal, full), Mobile (icon only)
**File format:** SVG for vector, PNG fallback
**Placement:** Header left, Footer center

### 4.2 Calculator Form

**Structure:**
```
┌─────────────────────────────────┐
│  Calculator Name                │
│  Subtitle                       │
├─────────────────────────────────┤
│  Label                          │
│  [Input field]                  │
│                                 │
│  Label       │  Label           │
│  [Input]     │  [Input]         │
│                                 │
│  Label                          │
│  [Dropdown]                     │
│                                 │
│  [Calculate Button]             │
└─────────────────────────────────┘
```

**States:** Default, Focus (teal ring), Error (red border + message), Disabled (gray + spinner), Filled (green check)

### 4.3 Result Panel

**Structure:**
```
┌─────────────────────────────────┐
│  [Badge: "7 years younger!"]    │
│                                 │
│     45    vs    52              │
│  Metabolic     Actual Age       │
│                                 │
│  1,685  │  2,590  │  82         │
│  BMR    │  TDEE   │  Score      │
│                                 │
│  [Share]  [Next Tool →]         │
└─────────────────────────────────┘
```

**States:** Empty (prompt to calculate), Loading (skeleton pulse), Result (shown above), Error ("Something went wrong — try again")

### 4.4 Stat Card

```
┌─────────┐
│  12K+   │
│ Results │
└─────────┘
```

4 across on desktop, 2 across on mobile. Single metric, no interaction.

### 4.5 Tool Card

```
┌─────────────────┐
│  🧬             │
│  Metabolic Age  │
│  Description     │
│  [Active Tag]    │
└─────────────────┘
```

Hover: slight lift (translateY -2px), teal border appears. Touch: tap feedback.

### 4.6 Navigation

**Desktop:** Horizontal links in header, no hamburger.
**Mobile:** Hamburger toggle → full-screen slide-in overlay from left. Close on selection or backdrop tap.

### 4.7 Share Card (Viral Mechanic)

Generated as canvas image. User clicks "Share" → downloads a 1200×630px OG image:
- Teal gradient background
- Large age comparison number
- Brand logo + URL watermark
- Ready to post on Instagram, X, Reddit

---

## 5. Technology Requirements

### 5.1 Frontend Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Markup** | Semantic HTML5 | Accessibility, SEO |
| **Styling** | CSS (custom properties) + minimal utility | No framework bloat, 100% control |
| **Scripting** | Vanilla JavaScript (ES modules) | No framework needed for calculators |
| **Build** | None (serve raw) or esbuild for minification | Keep it simple, Cloudflare handles compression |
| **Hosting** | Cloudflare Pages | Free, global CDN, unlimited bandwidth |

### 5.2 Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.0s |
| Largest Contentful Paint (LCP) | < 1.5s |
| First Input Delay (FID) | < 50ms |
| Time to Interactive (TTI) | < 2.0s |
| Total page weight | < 200KB (cached) |
| JavaScript | < 50KB per page |
| Lighthouse score | ≥ 95 all categories |

### 5.3 Accessibility Requirements

- WCAG 2.1 AA minimum
- All form inputs have `<label>` elements
- Color contrast ratio ≥ 4.5:1 for text (WCAG AA)
- Focus indicators on all interactive elements (2px teal ring)
- Skip-to-content link at top of page
- Alt text on all images
- Semantic heading hierarchy (h1 → h2 → h3, no skipping)
- ARIA labels on interactive elements where needed
- `prefers-reduced-motion` respected
- Touch targets ≥ 44×44px

### 5.4 SEO Requirements

- Unique `<title>` and `<meta description>` per page
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Schema.org markup: `HowTo` for calculators, `MedicalWebPage` where appropriate
- JSON-LD structured data per page
- Semantic HTML (h1, h2, nav, main, article, section)
- Sitemap.xml generation
- robots.txt
- Canonical URLs
- Breadcrumb structured data

### 5.5 Analytics

- **Plausible Analytics** (privacy-friendly, self-host or cloud)
- No Google Analytics (bloat + privacy concerns)
- Track: page views, tool usage, button clicks, share events
- No cookie banner needed (Plausible is GDPR-compliant without cookies)

### 5.6 Monitoring

- Cloudflare analytics (free, built-in)
- Uptime monitoring via Cloudflare
- Error logging via `window.onerror` + simple endpoint (Phase 2+)

---

## 6. Calculator Architecture

### 6.1 Calculation Engine

All calculators implemented as **pure functions** — no DOM dependencies:

```javascript
// calc-metabolic-age.js — pure calculation
export function calcMetabolicAge(inputs) {
  // inputs: { age, gender, heightCm, weightKg, activityLevel }
  // Returns: { metabolicAge, bmr, tdee, healthScore, difference }
}

// Usage in page:
import { calcMetabolicAge } from './calc-metabolic-age.js';
```

**Why pure functions:** Testable, portable, minifiable, no global state.

### 6.2 All 6 Calculator Definitions

Each calculator has:
1. **Pure function** in `/calculators/[name].js`
2. **Unit tests** in `/calculators/[name].test.js`
3. **UI component** inline in the page that imports the calc function

### 6.3 Input Validation

- All numeric inputs: validate range (e.g., age 10-120, height 50-250cm)
- Error messages inline below the field
- Prevent submission if validation fails
- Sanitize all user inputs before display

---

## 7. Responsive Design Patterns

### 7.1 Calculator Page Layout

**Desktop (≥ 768px):**
```
┌──────────────────────────────────────────────┐
│  Hero: "What's your real age?"               │
├─────────────────────┬────────────────────────┤
│                     │                        │
│  Form Inputs        │  Result Panel          │
│  (left column)      │  (right column,        │
│                     │   sticky on scroll)     │
│                     │                        │
├─────────────────────┴────────────────────────┤
│  Stats Bar (4 columns)                       │
├──────────────────────────────────────────────┤
│  Tool Grid (3 columns)                       │
└──────────────────────────────────────────────┘
```

**Mobile (< 768px):**
```
┌─────────────────┐
│  Hero (compact) │
├─────────────────┤
│  Form           │
├─────────────────┤
│  Result         │
├─────────────────┤
│  Stats (2 cols) │
├─────────────────┤
│  Tools (1 col)  │
└─────────────────┘
```

### 7.2 Hero Section

**Desktop:** 60px padding, 48px heading, gradient teal, social proof badge
**Mobile:** 40px padding, 36px heading, same gradient, badge hidden if space constrained

### 7.3 Form Layout

**Desktop (> 700px):** Two-column for paired fields (height/weight)
**Mobile (< 700px):** Single column, full-width inputs

### 7.4 Image Handling

- All images served via Cloudflare (automatic WebP conversion)
- `loading="lazy"` on below-fold images
- `fetchpriority="high"` on hero/logo
- Responsive `srcset` for any content images

---

## 8. Data Storage

### 8.1 Phase 0-2 (No Backend)

| Data | Storage | Notes |
|------|---------|-------|
| Calculator inputs | In-memory (form state) | Not persisted |
| User preferences | localStorage | Theme, recent calcs |
| Fasting streaks | localStorage | Phase C, persists on device |
| Analytics | Plausible | External service |

### 8.2 Phase 3+ (Premium)

| Data | Storage | Notes |
|------|---------|-------|
| User accounts | Supabase free tier | 50K rows, 500MB |
| Saved history | Supabase | Body comp tracking |
| Premium status | Stripe + Supabase | Stripe webhook |
| Email list | Resend or Mailchimp | Free tier |

---

## 9. Deployment

### 9.1 Hosting: Cloudflare Pages

| Feature | Free Tier Limit | Our Usage |
|---------|----------------|-----------|
| Bandwidth | Unlimited | ✅ |
| Builds | 500/month | Way under |
| Files | 20,000/site | ~100 files |
| File size | 25MB | ~50KB |
| Custom domains | Yes | ✅ |
| SSL | Auto | ✅ |
| CDN | Global | ✅ |
| Workers | 100K req/day | ✅ for Phase 3 |

### 9.2 CI/CD

```yaml
# Simple workflow: push to main → Cloudflare auto-deploys
# No GitHub Actions needed — Cloudflare Pages connects to repo directly
```

### 9.3 Domain

`myvitalmetric.com` (or chosen domain) registered on Cloudflare Registrar (~$12/yr)

---

## 10. Performance Optimization

### 10.1 Loading Strategy

1. **Critical CSS** — Inline above-fold styles (hero + calculator form)
2. **Non-critical CSS** — Deferred via `<link rel="preload">`
3. **JavaScript** — `type="module"` with `defer`, no render-blocking
4. **Fonts** — System font stack only. No web fonts. Zero font loading overhead.
5. **Images** — Cloudflare optimization, WebP, lazy loading

### 10.2 Caching Strategy

| Asset | Cache Duration | Notes |
|-------|---------------|-------|
| HTML | 5 min | Short TTL for content updates |
| CSS/JS | 1 year | Content-hashed filenames |
| Logo/Images | 1 year | Content-hashed |
| Calculator results | No cache | Unique per user |

---

## 11. Security Requirements

- All traffic served over HTTPS (Cloudflare auto)
- No user passwords collected (Phase 0-2)
- Content Security Policy header added via Cloudflare
- Form input sanitization (no script injection)
- No third-party scripts except Plausible
- Rate limiting via Cloudflare

---

## 12. Build Plan (Implementation Order)

### Phase A — Foundation (Tasks 1-5)

**Task 1:** Set up project scaffold
- Create `/vitalmetric/` directory structure
- Write `index.html` with HTML5 boilerplate
- Write `css/design-tokens.css` with all CSS custom properties
- Write `css/base.css` with reset + typography + spacing
- Write `css/responsive.css` with breakpoint mixins

**Task 2:** Build header + logo + footer components
- Static header with logo, nav links, responsive behavior
- Responsive hamburger menu for mobile
- Footer with nav links and tagline

**Task 3:** Build hero section
- Gradient background, heading, subtext, social proof badge
- Responsive padding and font sizing

**Task 4:** Build Metabolic Age Calculator (form + calculation engine)
- `calculators/metabolic-age.js` — pure function, validated formulas
- Form HTML with all inputs, client-side validation
- Result panel with empty/loading/result states

**Task 5:** Build stats bar + tool grid
- 4 stat cards with mock data
- 6 tool cards with icons and descriptions

### Phase B — Full Suite (Tasks 6-10)

**Task 6:** Body Composition Dashboard
**Task 7:** Macro Calculator (5 diets)
**Task 8:** Hydration Calculator + affiliate integration
**Task 9:** Blog scaffold + about page + privacy page
**Task 10:** SEO layer (metadata, OG tags, schema, sitemap)

### Phase C — Depth (Tasks 11-14)

**Task 11:** Weight Loss Planner
**Task 12:** Fasting Tracker with timer
**Task 13:** Share card image generation (canvas-based OG image)
**Task 14:** Performance audit + accessibility audit + polish

### Phase D — Launch (Task 15)

**Task 15:** Deploy to Cloudflare Pages + domain setup + analytics

---

## 13. Key Constraints

1. **Zero server cost** — All Phase 0-2 features run client-side on Cloudflare Pages ($0)
2. **No framework** — Vanilla HTML/CSS/JS only. No React, no Next.js, no build step.
3. **Mobile-first CSS** — Base styles are mobile, media queries add desktop layout
4. **Pure function calculators** — All math separated from DOM for testability
5. **System fonts only** — No web font loading for maximum performance
6. **Privacy-first** — No cookies, no trackers except Plausible, no data collection

---

## 14. Verification Criteria

Before any task is marked complete:
- [ ] Valid HTML (no errors)
- [ ] WCAG AA contrast ratios met
- [ ] Works on Chrome, Firefox, Safari (latest 2 versions)
- [ ] Works on 375px mobile and 1280px desktop
- [ ] Touch targets ≥ 44×44px
- [ ] Lighthouse score ≥ 95
- [ ] No console errors
- [ ] All form inputs have labels
- [ ] Skip-to-content link present
- [ ] `prefers-reduced-motion` respected
