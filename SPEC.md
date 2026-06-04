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

## 2. Responsive Design — Mobile-First Specification

### Core Principle

**Mobile-first.** Base CSS targets < 640px (phones). Media queries add complexity for larger screens. Every component must work and look complete at 375px wide (iPhone SE) before any desktop layout is added.

### 2.1 Viewport & Base

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

- `viewport-fit=cover` — respects iOS notch and home indicator areas
- No `user-scalable=no` — users must be able to pinch-zoom
- Font size for body text: **minimum 16px** on mobile (prevents iOS auto-zoom on input focus)

### 2.2 Breakpoints

Use these container-based breakpoints. Every component responds to the container width, not just the viewport:

```css
/* ── Named breakpoints ── */

/* Mobile (base): < 640px — no media query needed, this is the default */

/* Large phone / small tablet: ≥ 640px */
@media (min-width: 640px) {
  /* 2-column grids appear, hero text grows */
}

/* Tablet: ≥ 768px */
@media (min-width: 768px) {
  /* Calculator goes side-by-side, header switches to horizontal */
}

/* Desktop: ≥ 1024px */
@media (min-width: 1024px) {
  /* Full layout: 3-column grids, max-width constraint on content */
}

/* Wide desktop: ≥ 1280px */
@media (min-width: 1280px) {
  /* Extra breathing room, larger max-widths */
}
```

### 2.3 Mobile Layout — Every Component

This table shows exactly what happens to every component at mobile sizes. There are NO "hidden" or "different" behaviors — every component shown at every size:

| Component | < 640px (Phone) | 640-767px (Large Phone) | 768-1023px (Tablet) | ≥ 1024px (Desktop) |
|-----------|-----------------|------------------------|---------------------|-------------------|
| **Header** | Icon logo (28px height) + hamburger right | Full logo (32px height) + hamburger | Full logo + inline nav links | Full logo + inline nav links |
| **Logo** | 28px height, icon-only mark | 32px height, horizontal lockup | 42px height, horizontal lockup | 42px height, horizontal lockup |
| **Hamburger** | Visible, 44×44px tap target | Visible, 44×44px tap target | Hidden | Hidden |
| **Nav links** | Hidden behind hamburger overlay | Hidden behind hamburger overlay | Visible, horizontal | Visible, horizontal |
| **Hero** | 32px padding top/bottom | 40px padding | 48px padding | 60px padding |
| **Hero heading** | 28px/1.75rem font size | 32px/2rem | 36px/2.25rem | 48px/3rem |
| **Hero paragraph** | 15px, full-width | 16px, max-width 100% | 17px, max-width 540px | 18px, max-width 540px |
| **Social proof badge** | Hidden (save space) | Hidden | Visible | Visible |
| **Calculator card** | Stacked: form above, result below | Stacked | Side-by-side grid | Side-by-side grid |
| **Form fields** | Single column, full width | Single column, full width | Paired in 2-col grid where logical | Paired in 2-col grid |
| **Form labels** | 13px, above input | 13px, above input | 13px, above input | 13px, above input |
| **Result panel** | Below form, full width | Below form, full width | Right column, sticky | Right column, sticky |
| **Result "age" number** | 48px font (3rem) | 56px | 64px | 72px |
| **Result stat row** | Stacked vertically (3 rows) | Horizontal (3 across) | Horizontal | Horizontal |
| **Stats bar** | 2 columns × 2 rows | 2 × 2 | 4 columns | 4 columns |
| **Stat cards** | Compact padding (12px) | 16px | 20px | 20px |
| **Tool grid** | 1 column, full width | 2 columns | 3 columns | 3 columns |
| **Tool card** | Compact: 16px padding | 20px | 20px | 20px |
| **Footer** | Single column, stacked | Stacked | 2-column layout | 3-column layout |
| **Content wrapper** | Margin 0, padding 0-16px | margin 0, pad 0-20px | max-width 720px, centered | max-width 880px, centered |

### 2.4 Touch & Interaction Behavior (Mobile)

| Behavior | Specification |
|----------|--------------|
| **Tap targets** | Every interactive element ≥ 44×44px. No exceptions. Buttons, links, selects, hamburger, tool cards. |
| **Hover states** | On mobile, hover has no meaning. All hover effects must also have a `:active` or `:focus` equivalent. Tool card "lift" effect uses `:active` on mobile, `:hover` on desktop. |
| **Forms + keyboard** | When an input is focused, the virtual keyboard pushes the viewport up. The Calculate button must remain visible. **No `position: fixed` elements that overlap the keyboard.** |
| **iOS input zoom** | Font size < 16px triggers iOS auto-zoom. All inputs use `font-size: 16px` minimum. |
| **Safe areas** | Padding of `env(safe-area-inset-*)` on elements that touch screen edges (header top, footer bottom). |
| **Swiping** | No horizontal swipe gestures that could conflict with browser back-swipe. |
| **Double-tap** | No `touchstart` listeners without `passive: true`. |
| **Scroll** | No `overflow: hidden` on `<body>` — breaks scroll position and accessibility. |
| **Sticky elements** | Header is `position: sticky; top: 0` on all screen sizes. On mobile, it's shorter (44px vs 60px desktop). |
| **Loading state** | Calculator button shows inline spinner on click, button text changes to "Calculating…". Button stays visible, doesn't move. |

### 2.5 Mobile Navigation — Hamburger Spec

**Trigger:** Button in top-right of header, 44×44px minimum tap target, shows three-line hamburger icon (☰).

**Overlay behavior:**
- Opens full-screen, slides in from the right
- Background: solid `#0A6E6E` at 100% opacity (not translucent — keeps focus on nav)
- Close: tap the X button (top-right), tap the backdrop, or press Escape key
- Navigation links: large, 48px font size, full-width touch targets
- Link tap: navigates immediately AND closes the overlay
- Transition: 250ms ease-in-out, `transform: translateX(0)` for open, `translateX(100%)` for closed
- `prefers-reduced-motion`: no animation, instant show/hide

**HTML structure:**
```html
<button class="hamburger" aria-label="Open navigation menu">
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>

<nav class="mobile-nav" aria-label="Main navigation">
  <button class="mobile-nav-close" aria-label="Close navigation menu">✕</button>
  <a href="/">Metabolic Age</a>
  <a href="/body-composition">Body Composition</a>
  <a href="/macro-calculator">Macro Calculator</a>
  <a href="/hydration-calculator">Hydration</a>
  <a href="/weight-loss-planner">Weight Loss</a>
  <a href="/fasting-calculator">Fasting</a>
</nav>
```

### 2.6 Desktop Navigation

No hamburger. Inline horizontal nav links in the header, 16px font, 44px tap targets (for tablet touch users).

```html
<nav class="desktop-nav">
  <a href="/">Metabolic Age</a>
  <a href="/body-composition">Body Comp</a>
  <a href="/macro-calculator">Macro Calc</a>
  <div class="dropdown">
    <button>More ▾</button>
    <div class="dropdown-menu">
      <a href="/hydration-calculator">Hydration</a>
      <a href="/weight-loss-planner">Weight Loss</a>
      <a href="/fasting-calculator">Fasting</a>
    </div>
  </div>
</nav>
```

### 2.7 Content Width Constraints

```css
/* Mobile — full width, padding from edges */
.content {
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
}

/* Tablet — constrained width, centered */
@media (min-width: 768px) {
  .content {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* Desktop — wider */
@media (min-width: 1024px) {
  .content {
    max-width: 880px;
  }
}

/* Wide desktop — header only */
@media (min-width: 1280px) {
  .header-inner {
    max-width: 1100px;
  }
}
```

### 2.8 Vertical Spacing (All Breakpoints)

| Spacing Token | Mobile | Tablet | Desktop |
|---------------|--------|--------|---------|
| Section gap (space between major sections) | 32px | 40px | 48px |
| Card padding | 20px | 24px | 28px |
| Hero padding Y | 40px | 48px | 60px |
| Form field margin-bottom | 12px | 14px | 14px |
| Tool card gap | 12px | 14px | 16px |
| Footer padding Y | 20px | 24px | 24px |

### 2.9 Empty / Error / Loading States on Mobile

| State | Mobile Behavior |
|-------|----------------|
| **Calculator empty** | Show sample values prefilled (age 52, 175cm, 82kg) so user sees what the result looks like before calculating. On mobile this matters more — they might not bother typing. |
| **Loading** | Button shows inline spinner (CSS animation, no image). Button text changes to "Calculating…". Form inputs remain visible and editable. |
| **Error** | Red border on the invalid field. Inline error message below the field in 13px red text. No alert() dialogs. No page reload. |
| **Slow connection** | No skeleton screens needed — the calculator is instant (runs in JS, no network). Only loading state is the deliberate "Calculating…" delay to show the result appeared.

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

#### Production (Cloudflare Pages / GitHub Pages)

| Asset | Cache Duration | Mechanism |
|-------|---------------|-----------|
| HTML | 5 min | Short TTL — pages update frequently |
| CSS/JS | 1 year | Content-hashed filenames (e.g. `styles.a1b2c3.css`) |
| Logo/Images | 1 year | Content-hashed |
| Calculator results | No cache | Unique per user |

Content hashing: include a hash of the file contents in the filename (`styles.a1b2c3.css`). Every code change produces a new filename, so the browser treats it as a new file and ignores the 1-year cache. Cloudflare Pages can auto-hash or use a build script.

#### Development (Local / Preview URL)

Development needs the opposite behavior — no caching at all, or the browser serves stale files on every refresh.

**Solution — Dev Mode:** While editing, use cache-busting query parameters. The simplest approach works without any tooling:

```html
<!-- Production: versioned filename -->
<link rel="stylesheet" href="css/styles.a1b2c3.css">

<!-- Development: cache-busting via query param -->
<!-- Auto-busts whenever the file timestamp changes -->
<link rel="stylesheet" href="css/styles.css?t=DEV">
```

The `DEV` placeholder is replaced at build time with a timestamp for preview deploys, or left literal during local editing. A small helper makes this zero-thought:

```javascript
// dev-cache-bust.js
// Include in <head> during development only
if (window.location.hostname === 'localhost' || 
    window.location.hostname.includes('github.io')) {
  // Append cache-busting query param to all CSS/JS links
  document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(el => {
    const attr = el.tagName === 'LINK' ? 'href' : 'src';
    const url = el.getAttribute(attr);
    if (url && !url.includes('?')) {
      el.setAttribute(attr, url + '?t=' + Date.now());
    }
  });
  // Force a hard refresh on next load
  console.log('⚡ Dev mode — cache disabled');
}
```

Alternatively, open DevTools → Network tab → check **Disable cache** while the panel is open. This is the simplest approach for local editing but is manual and easy to forget.

**Recommended approach:** The `DEV` placeholder pattern above. It costs nothing, requires no extra tooling, and means you never fight a stale cache during development. When deploying to production, the build step strips `?t=DEV` and replaces it with content-hashed filenames.

---

## 11. Testing Strategy

### 11.1 Testing Philosophy

| Principle | Why |
|-----------|-----|
| **Test calculator math, not the DOM** | The business logic is in pure functions — test those. The DOM is simple enough that visual review catches layout bugs |
| **Vitest > Playwright for this project** | Calculator functions run in Node.js — no browser needed. Zero config. Fast (< 1s to run all tests) |
| **TDD for calculators** | Write test → see it fail → implement calc → see it pass. Every calculator follows this cycle |
| **Manual visual QA for UI** | Static site with no state = visual review is sufficient. No need for screenshot diffing suites |
| **Accessibility as code** | Automated a11y checks catch 60%+ of issues. The rest is manual tab-through |

### 11.2 Test Framework: Vitest

```bash
# Install (one-time)
npm init -y
npm install -D vitest

# Run
npx vitest run          # CI mode
npx vitest              # Watch mode for development
```

**Why Vitest and not Jest/Mocha:**
- Native ESM support (our calculators use `export`/`import`)
- Zero config — works out of the box with vanilla JS
- Fast — uses esbuild under the hood
- Compatible with Node.js — no browser needed for pure functions

### 11.3 Test Structure

```
calculators/
├── metabolic-age.js
├── metabolic-age.test.js    # ✓ Unit tests
├── body-composition.js
├── body-composition.test.js
├── macro-calculator.js
├── macro-calculator.test.js
├── hydration-calculator.js
├── hydration-calculator.test.js
├── weight-loss-planner.js
├── weight-loss-planner.test.js
└── fasting-calculator.js
└── fasting-calculator.test.js
```

### 11.4 What Every Calculator Test Must Cover

| Test | Example |
|------|---------|
| **Correct output for known inputs** | `calcMetabolicAge({age:35, gender:'male', heightCm:175, weightKg:78, activity:'light'})` returns exact known BMR, TDEE, metabolic age |
| **Edge case: extreme age** | Age 10 (minimum), age 120 (maximum) |
| **Edge case: extreme weight/height** | 30kg minimum, 250kg maximum |
| **Edge case: boundary values** | Just above and below each activity level threshold |
| **Invalid values** | `calcMetabolicAge({age: -5})` returns error object, not NaN |
| **Type safety** | String instead of number is handled gracefully |
| **Formula accuracy** | Output manually verified against reference calculators (e.g., calculator.net) |
| **Round-trip consistency** | Same inputs always produce same outputs (deterministic) |

### 11.5 Sample Test (Vitest)

```javascript
// calculators/metabolic-age.test.js
import { describe, it, expect } from 'vitest';
import { calcMetabolicAge } from './metabolic-age.js';

describe('calcMetabolicAge', () => {
  it('returns correct BMR for a 35-year-old male (Mifflin-St Jeor)', () => {
    const result = calcMetabolicAge({
      age: 35,
      gender: 'male',
      heightCm: 175,
      weightKg: 78,
      activityLevel: 'light'
    });
    // BMR = 10 × 78 + 6.25 × 175 - 5 × 35 + 5 = 780 + 1093.75 - 175 + 5 = 1703.75
    expect(result.bmr).toBeCloseTo(1704, -1);
    expect(result.metabolicAge).toBeGreaterThan(0);
    expect(result.difference).toBeDefined();
  });

  it('returns error for invalid age', () => {
    const result = calcMetabolicAge({
      age: -5, gender: 'male', heightCm: 175, weightKg: 78, activityLevel: 'light'
    });
    expect(result.error).toBeDefined();
    expect(result.bmr).toBeUndefined();
  });

  it('is deterministic — same inputs always same outputs', () => {
    const input = { age: 45, gender: 'female', heightCm: 165, weightKg: 70, activityLevel: 'moderate' };
    const a = calcMetabolicAge(input);
    const b = calcMetabolicAge(input);
    expect(a).toEqual(b);
  });
});
```

### 11.6 Calculator Formula Verification Protocol

Every formula must be verified against a known reference source before its test is considered passing:

| Calculator | Reference Source | Verification Method |
|-----------|-----------------|-------------------|
| Metabolic Age | Mifflin-St Jeor equation (1990) | Cross-check with calculator.net BMR calculator |
| Body Composition | US Navy Method, BRI formula | Cross-check with BMI.gov, online WHtR calculators |
| Macro Calculator | USDA Dietary Guidelines | Manual arithmetic verification per diet split |
| Hydration | European Food Safety Authority guidelines | Cross-check with medical references |
| Weight Loss | NIH Body Weight Planner research | Manual projection verification |
| Fasting | Standard IF protocol definitions | Self-evident (time-based) |

### 11.7 HTML Validation

Every page must pass W3C validation before deployment:

```bash
# Using the W3C validator API
curl -s -H "Content-Type: text/html" \
  --data-binary @index.html \
  https://validator.w3.org/nu/?out=json \
  | python3 -c "
import json,sys
data = json.load(sys.stdin)
errors = [m for m in data.get('messages',[]) if m.get('type')=='error']
print(f'Errors: {len(errors)}')
for e in errors[:5]:
    print(f'  Line {e.get(\"lastLine\",\"?\")}: {e.get(\"message\",\"\")[:80]}')
"
```

### 11.8 Accessibility Testing

Automated via axe-core in CI (Phase 2+) or manual checklist:

```markdown
- [ ] Page has one `<h1>` matching document title
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] All form inputs have `<label>` elements
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Focus indicator visible on all interactive elements
- [ ] Tab order follows visual order
- [ ] Skip-to-content link present and functional
- [ ] No keyboard traps
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets ≥ 44×44px
```

### 11.9 CI Testing (Phase 2+)

```bash
# .github/workflows/test.yml (future)
name: Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest run
```

For Phase 0-1: Run `npx vitest run` locally before each commit.

### 11.10 What We DON'T Test (And Why)

| Not Tested | Reason |
|------------|--------|
| Visual appearance / pixel-perfect | Static HTML/CSS — visual review catches all issues. No dynamic rendering |
| Cross-browser differences | Standard CSS, no experimental features. Check manually in Chrome + Firefox before deploy |
| Network failures | No API calls in Phase 0-2. Everything runs client-side |
| Load testing | Static site on Cloudflare CDN — handles traffic without tuning |
| E2E user flows | No authentication, no state, no multi-step forms. Each page is self-contained |

---

## 12. Security Requirements

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
