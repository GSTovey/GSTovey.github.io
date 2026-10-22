# Guidance for maintaining this portfolio

Read README.md, docs/MAINTENANCE.md, and docs/content-sources.md before editing. Inspect Git status and preserve existing changes. This repository is a static academic website; no database or application credentials are needed.

## Architecture and content

- Node.js 24+, ES modules, no frontend framework or production dependencies.
- `src/data/*.mjs` holds public content. English is the base; Chinese fields are in each entry's `translations.zh`. `src/i18n.mjs` holds interface messages and locale helpers.
- `src/render.mjs` generates static HTML for `/` and `/zh/`. Keep both pages readable without JavaScript. Local assets always use `/assets/` because this is the root-domain site `https://gstovey.github.io/`.
- `public/assets/main.js` enhances navigation, language choice, avatar fallback, and citations. Translate accessible names, feedback, and metadata along with visible text.
- Preserve original publication titles, verified author order, DOI, year, venue, and BibTeX across languages. Never expand author initials without a source. ICDF2C 2023's APTBert chapter has publication year 2024. Do not invent methods, results, publication status, or links. Record new sources in `docs/content-sources.md`.
- Empty optional collections remain hidden. Do not duplicate research project cards in Open Source. Keep ORCID and email exactly as the owner supplied them.
- Fonts are local: Manrope (SIL OFL) for Latin characters, system Chinese sans-serif fallbacks. Keep body copy at 16px or larger, including narrow screens; metadata may be smaller. Preserve reduced-motion support and keyboard focus.
- Preserve the flat academic layout, concise bilingual copy, and subtle static background. Publications display bibliographic details and actions; extended summaries/tags remain in data. Render education newest first without changing its source records.

## Validation

Run `npm ci`, then `npm run check` (content tests, static build, Playwright + axe). On this cloud machine use `npm ci --cache /workspace/.cache/npm` if the default cache is not writable. Playwright uses `/usr/bin/chromium` when present; elsewhere run `npx playwright install --with-deps chromium`.

Check English and Chinese at 1440, 1024, 768, 390, and 320px. Verify language switching preserves the section, remembers explicit choice, works without storage and without JavaScript, and updates page language/SEO. Verify all citations, avatar, anchors, and no overflow or console errors. Do not count a zero-test run as verification. Keep TLS and artifact integrity checks enabled; do not alter persistent trust stores.

## Git and publishing

Use the existing cloud checkout. Cloud tasks are isolated; do not create Git worktrees unless explicitly requested. For maintenance without publishing authorization, use a feature branch and a pull request. Existing publishing authorization in the current user session remains valid; do not ask again merely because this file exists. Never force-push or replace user work.

The Actions workflow `.github/workflows/pages.yml` builds and deploys `dist/` after checks. Keep `node_modules/`, `dist/`, screenshots/test results, and credentials out of Git. A successful push is not a successful deployment: inspect Actions and check the live English/Chinese pages and assets. GitHub Pages Source should be GitHub Actions. Report permission failures precisely; never request tokens in chat or claim a deployment happened without evidence.
