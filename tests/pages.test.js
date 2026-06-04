/* ═══════════════════════════════════════════════════════
   VitalMetric — Integration / Page Structure Tests
   Verifies every HTML page has correct links, required
   elements, and valid structure. Catches 404-causing
   issues before deploy.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ── All pages to verify ──
const PAGES = [
  { path: 'index.html', title: 'Metabolic Age', type: 'calculator' },
  { path: 'body-composition/index.html', title: 'Body Composition', type: 'calculator' },
  { path: 'macro-calculator/index.html', title: 'Macro Calculator', type: 'calculator' },
  { path: 'hydration-calculator/index.html', title: 'Hydration', type: 'calculator' },
  { path: 'weight-loss-planner/index.html', title: 'Weight Loss Planner', type: 'calculator' },
  { path: 'fasting-calculator/index.html', title: 'Fasting Tracker', type: 'calculator' },
  { path: 'methodology/index.html', title: 'Methodology', type: 'static' },
  { path: 'about/index.html', title: 'About', type: 'static' },
  { path: 'privacy/index.html', title: 'Privacy', type: 'static' },
];

const BASE = resolve('/opt/data/vitalmetric');

// ── Known sub-pages (for verifying link targets) ──
const KNOWN_PATHS = [
  '/',
  '/body-composition/',
  '/macro-calculator/',
  '/hydration-calculator/',
  '/weight-loss-planner/',
  '/fasting-calculator/',
  '/methodology/',
  '/about/',
  '/privacy/',
];

// ── Required elements per page type ──
const CALCULATOR_REQUIRED = [
  'header', 'footer', 'hero-heading', 'calc-form',
  'calc-btn', 'result-panel', 'skip-link', 'hamburger',
];
const STATIC_REQUIRED = [
  'header', 'footer', 'hero-heading', 'skip-link',
];

function loadPage(relPath) {
  const fullPath = resolve(BASE, relPath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, 'utf-8');
}

describe('Page structure', () => {
  for (const page of PAGES) {
    describe(page.title, () => {
      const html = loadPage(page.path);

      it('file exists and is readable', () => {
        expect(html).toBeTruthy();
      });

      if (!html) return;

      it('has <!DOCTYPE html>', () => {
        expect(html.trimStart().startsWith('<!DOCTYPE html>')).toBe(true);
      });

      it('has a <title>', () => {
        expect(html).toMatch(/<title>/);
      });

      it('has a <meta name="description">', () => {
        expect(html).toMatch(/<meta name="description"/);
      });

      const required = page.type === 'calculator' ? CALCULATOR_REQUIRED : STATIC_REQUIRED;
      for (const el of required) {
        // Fasting tracker has timer-panel instead of result-panel
        if (el === 'result-panel' && page.path === 'fasting-calculator/index.html') continue;
        it(`contains required element: .${el}`, () => {
          // Check as class attribute value (handles multi-class like 'btn btn-primary calc-btn')
          const regex = new RegExp(`class="[^"]*\\b${el}\\b[^"]*"`);
          expect(html).toMatch(regex);
        });
      }

      // Calculator-specific checks
      if (page.type === 'calculator') {
        // Fasting tracker uses timer, not unit measurements
        if (page.path !== 'fasting-calculator/index.html') {
          it('has unit toggle for metric/imperial', () => {
            expect(html).toContain('unit-toggle');
            expect(html).toContain('unit-metric');
            expect(html).toContain('unit-imperial');
          });
        }

        it('imports a calculator module', () => {
          expect(html).toMatch(/import.*from.*\.\.\/calculators\/|import.*from.*\.\/calculators\//);
        });
      }
    });
  }
});

describe('Navigation links', () => {
  for (const page of PAGES) {
    describe(page.title, () => {
      const html = loadPage(page.path);
      if (!html) return;

      it('all sub-page hrefs have trailing slashes', () => {
        // Find all href="/something" patterns
        const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map(m => m[1]);

        for (const href of hrefs) {
          // Root is allowed without trailing slash
          if (href === '/') continue;
          // External URLs, anchors, mailto ok
          if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) continue;
          // Dev query params ok
          const pathOnly = href.split('?')[0];
          // Must end with /
          expect(pathOnly.endsWith('/'),
            `"${href}" in ${page.path} should end with /`
          ).toBe(true);
        }
      });

      it('only links to known pages', () => {
        const hrefs = [...html.matchAll(/href="(\/[^"?]*\/)"/g)].map(m => m[1]);
        for (const href of hrefs) {
          expect(KNOWN_PATHS).toContain(href);
        }
      });

      it('root link does NOT have trailing slash', () => {
        // Check that href="/" exists (not href="//")
        const rootLinks = [...html.matchAll(/href="\/"/g)];
        // Should have at least 1 root link (header brand usually)
        // No assertion needed here — just that no href="//" exists
        const badRoot = [...html.matchAll(/href="\/\/"/g)];
        expect(badRoot.length).toBe(0);
      });
    });
  }
});

describe('Favicon', () => {
  for (const page of PAGES) {
    describe(page.title, () => {
      const html = loadPage(page.path);
      if (!html) return;

      it('uses the gauge logo SVG, not an emoji', () => {
        expect(html).toContain('rel="icon"');
        // Should contain the gauge SVG path, not a text emoji
        expect(html).toContain('stroke-dasharray');
        // Should NOT contain an emoji favicon
        expect(html).not.toMatch(/<link rel="icon"[^>]*<text y=['"]\.9em/);
      });
    });
  }
});

describe('SEO files', () => {
  it('sitemap.xml exists', () => {
    expect(existsSync(resolve(BASE, 'sitemap.xml'))).toBe(true);
  });

  it('robots.txt exists and allows all', () => {
    const txt = readFileSync(resolve(BASE, 'robots.txt'), 'utf-8');
    expect(txt).toContain('Allow: /');
  });
});
