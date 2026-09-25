# Handoff — 2026-09-25

Work from 2026-09-24/25 is on branch `area-evidence-process` (see its PR); `main` holds the
earlier checkpoint `2f90f2d` until that PR is merged. The dev server is `npm run dev`.
It started on port 3000 in the latest session (4321 by default); open
`/gallery-components.html`. No owner completion changed; Indicator stays In review.

## Owner direction

- Visual-first: get every component and variant exactly right from measured evidence
  (ChatGPT, Notion, Figma, Cursor, Untitled UI, Fluent), then systematize tokens.
- Lighter UI: regular-weight titles, few sizes/weights/colors, one variable per distinction.
- Area draws its own stroked icons at 1.125px (`--area-weight-icon`).
- The documentation site is hidden. Work happens in the gallery pages until the owner
  asks to populate the docs.

## Process (read before component work)

- `docs/COMPONENT_ADAPTATION.md` (process), skills `area-component-build` and
  `area-visual-language` (`.agents/skills`, linked from `.claude/skills`).
- Capture: `apps/docs/public/area-capture.js` (checksummed, with a fingerprint check);
  `npm run capture:compare`. The Edge extension truncates results at about 900 characters
  (read in chunks), background tabs stall async scripts, and products are read-only (ask
  before switching a product's theme).
- Specs: `docs/specs/` (indicator, icons, typography, PRIOR_DECISIONS); baseline
  `docs/research/BASELINE.md`; captures in `docs/research/captures/`.

## Current state

- **Gallery:** eight pages with a nav: components, typeRamp, iconography, color, scale,
  radius, surface, motion. `index.html` and `gallery.html` redirect to the components page.
- **Type ramp (applied):**
  - text 12/16, 14/20, 16/24; titles 20/28, 24/32, 32/40; titles fixed in compact;
  - small controls 12/16;
  - weight 400 everywhere except labels on fills (500).
- **Icons:**
  - 12-icon pilot in `apps/docs/assets/area-icons-pilot/` (`npm run icons:pilot`,
    `npm run lint:icons`);
  - presence status glyphs are Area-drawn: the ring is the shell's border and the mark a
    non-scaling stroke, both at `--area-weight-icon`;
  - the 1× / 2× pixel check is on the iconography page;
  - Fluent remains in all other components.
- **Indicator (pilot component):**
  - 6px dot; 16px count with 10/14 text, weight 500;
  - 1px surface cutout;
  - counts centre on the corner (`compact` is opt-in); dots centre on the icon corner;
  - tabs reserve space after the label; circular owners sit 2px outward.

## Next

1. Owner review: gallery pages, type ramp, and the pilot icons at 1× (see
   `docs/specs/icons.md`, "1× pixel check").
2. Icons: draw the 12px and 20px cuts, then replace Fluent family by family (chevron,
   close, check, add, search first). Move Area's 29 marks to 1.125px at the same time.
3. A stroke and type baseline across Cursor, ChatGPT, Notion and Figma. Product dark themes
   need the owner's go-ahead, and the Figma editor needs Edge in the foreground.
4. The next component through the process.

## Verification (2026-09-25)

These pass:
- 19,491 token tests and 370 contrast assertions (66 themes);
- 87 React tests, typecheck, docs build and audit;
- 14 contracts, manifest parity, 4 preview tests, consumer check;
- icon lint, 24 capture checksums, `git diff --check`.

Unverified: cross-engine, screen reader, forced colors (execution) and product dark themes.

About 284MB of ignored leftovers under `archive/` (old source caches and logs) remain on
disk; delete them manually if wanted.
