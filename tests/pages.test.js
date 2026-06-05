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
          // Accept both ../calculators/ (root-relative) and calculators/ (base-relative)
          expect(html).toMatch(/import.*from.*(?:\.\.\/)?calculators\//);
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
        const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map(m => m[1]);
        for (const href of hrefs) {
          if (href === '/') continue;
          if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) continue;
          const pathOnly = href.split('?')[0];
          expect(pathOnly.endsWith('/'),
            `"${href}" in ${page.path} should end with /`
          ).toBe(true);
        }
      });

      it('only links to known pages', () => {
        // Only check <a> links, not <base> or other elements
        const hrefs = [...html.matchAll(/<a[^>]*href="(\/[^"?]*\/)"/g)].map(m => m[1]);
        for (const href of hrefs) {
          expect(KNOWN_PATHS).toContain(href);
        }
      });

      it('root link does NOT have trailing slash', () => {
        const badRoot = [...html.matchAll(/href="\/\/"/g)];
        expect(badRoot.length).toBe(0);
      });
    });
  }
});

// ── Tool card navigation (JS-driven, no href) ──
const TOOL_CARD_LABEL_MAP = {
  'Metabolic Age Calculator': '/',
  'Body Composition Dashboard': '/body-composition/',
  'Macro Calculator': '/macro-calculator/',
  'Hydration Calculator': '/hydration-calculator/',
  'Weight Loss Planner': '/weight-loss-planner/',
  'Fasting Tracker': '/fasting-calculator/',
};

const NEXT_BTN_LABEL_MAP = {
  'Check Body Composition →': '/body-composition/',
  'Check Metabolic Age →': '/',
  'Check Macros →': '/macro-calculator/',
  'Check Body Comp →': '/body-composition/',
  'Check Macro Targets →': '/macro-calculator/',
};

describe('JS-driven navigation', () => {
  describe('index.html — tool cards', () => {
    const html = loadPage('index.html');
    if (!html) return;

    const toolCardRegex = /<article[^>]*class="tool-card"[^>]*role="button"[^>]*aria-label="([^"]+)"/g;
    const cards = [...html.matchAll(toolCardRegex)].map(m => m[1]);

    it('has all 6 tool cards', () => {
      expect(cards.length).toBe(6);
    });

    for (const label of Object.keys(TOOL_CARD_LABEL_MAP)) {
      it(`tool card "${label}" maps to ${TOOL_CARD_LABEL_MAP[label]}`, () => {
        expect(cards).toContain(label);
        // Verify the mapped path exists as a file
        const target = TOOL_CARD_LABEL_MAP[label];
        const fsTarget = target === '/' ? 'index.html' : `${target.replace(/^\/|\/$/g, '')}/index.html`;
        expect(existsSync(resolve(BASE, fsTarget))).toBe(true);
      });
    }

    it('every tool card aria-label has a valid mapping', () => {
      for (const label of cards) {
        expect(TOOL_CARD_LABEL_MAP[label],
          `No JS mapping for tool card "${label}"`
        ).toBeDefined();
      }
    });

    it('JS mapping object in index.html matches all tool cards', () => {
      // Verify the inline JS map contains all expected entries
      for (const [label, path] of Object.entries(TOOL_CARD_LABEL_MAP)) {
        expect(html).toContain(`'${label}': '${path}'`);
      }
    });
  });

  describe('next buttons across pages', () => {
    for (const page of PAGES) {
      describe(page.title, () => {
        const html = loadPage(page.path);
        if (!html) return;

        // Static pages don't need next buttons
        if (page.type === 'static') {
          it('has no next button (static page)', () => {
            expect(html).not.toMatch(/id="next-btn"/);
          });
          return;
        }

        it('has a #next-btn or forward-nav link', () => {
          // Fasting tracker is app-like, has no next button
          if (page.path === 'fasting-calculator/index.html') return;
          const hasBtn = /id="next-btn"/.test(html);
          const hasLink = /Check.*→/.test(html) && /href=/.test(html);
          expect(hasBtn || hasLink,
            `Page ${page.path} should have either #next-btn or a "Check →" link`
          ).toBe(true);
        });

        // Verify forward link resolves (either button or anchor)
        const btnMatch = html.match(/id="next-btn"[^>]*>([^<]+)</);
        const anchorMatch = html.match(/class="btn[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+→)</);
        const label = btnMatch?.[1] || anchorMatch?.[2];
        const anchorHref = anchorMatch?.[1];

        if (btnMatch && label && NEXT_BTN_LABEL_MAP[label]) {
          it(`next button "${label}" maps to ${NEXT_BTN_LABEL_MAP[label]}`, () => {
            const target = NEXT_BTN_LABEL_MAP[label];
            const fsTarget = target === '/' ? 'index.html' : `${target.replace(/^\/|\/$/g, '')}/index.html`;
            expect(existsSync(resolve(BASE, fsTarget))).toBe(true);
          });
        }

        if (anchorHref) {
          it(`forward link "${anchorHref}" resolves to existing page`, () => {
            const target = anchorHref;
            const fsTarget = target === '/' ? 'index.html' : `${target.replace(/^\/|\/$/g, '')}/index.html`;
            expect(existsSync(resolve(BASE, fsTarget)),
              `Link "${anchorHref}" in ${page.path} should resolve to ${fsTarget}`
            ).toBe(true);
          });
        }
      });
    }
  });
});

describe('Favicon', () => {
  for (const page of PAGES) {
    describe(page.title, () => {
      const html = loadPage(page.path);
      if (!html) return;

      it('uses the gauge logo SVG, not an emoji', () => {
        expect(html).toContain('rel="icon"');
        expect(html).toContain('stroke-dasharray');
        expect(html).not.toMatch(/<link rel="icon"[^>]*<text y=['"]\.9em/);
      });
    });
  }
});

describe('GitHub Pages subpath', () => {
  for (const page of PAGES) {
    describe(page.title, () => {
      const html = loadPage(page.path);
      if (!html) return;

      it('has <base href="/vitalmetric/"> for subpath hosting', () => {
        expect(html).toContain('<base href="/vitalmetric/">');
      });

      it('no href="../" paths remain (all asset paths relative to base)', () => {
        const matches = html.match(/href="\.\.\//g);
        expect(matches).toBeNull();
      });

      it('no from "../" paths remain in JS imports', () => {
        const matches = html.match(/from '\.\.\//g);
        expect(matches).toBeNull();
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
