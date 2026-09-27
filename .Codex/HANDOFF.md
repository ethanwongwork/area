# Handoff — 2026-09-25

Branches: `icons-system` (icon work, this folder) and `components` (all component work,
in its own worktree session). Both start from `main`; merge through pull requests.
System-wide files (icon generator, base styles, handoff) change in one session at a time. The dev server is `npm run dev` (4321 by default; port 3000 in the latest
session). Open `/gallery-icons.html` for icons. No owner completion changed; Indicator stays In review.

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
- **Icons (branch `icons-system`, PR 3):** 202 icons in seventeen batches; rules in the
  `area-icon-construction` skill, record in `docs/specs/icons.md`.
  - Sources: `apps/docs/assets/area-icons-pilot/` (`npm run icons:pilot`, `npm run lint:icons`,
    `--report`, `--audit`). The lint checks the grid, the diagonal lattice, keylines, the
    gap and counter scale, acute corners, filled gaps, and live area.
  - Review: `gallery-icons.html`, grouped by `batches.json` with owner status and a
    whole-set grid per batch; open questions go in `explore/`.
  - Batch 1 (core) is approved except items back in review; batches 2–13 are in review.
  - Components drawing Area glyphs: Badge dismiss, NumberField steppers, TreeView chevron
    and check, Composer send (`glyphs.ts`, `Glyph.tsx`, with sizes on the size curve).
    Fluent remains elsewhere and in demos.
  - Remote review: render a sheet with headless Edge (see the batch 5 note in the spec).
- **Indicator (pilot component):**
  - 6px dot; 16px count with 10/14 text, weight 500;
  - 1px surface cutout;
  - counts centre on the corner (`compact` is opt-in); dots centre on the icon corner;
  - tabs reserve space after the label; circular owners sit 2px outward.

## Next

1. Owner review on `gallery-icons.html` (In review lists what's open): batch 17, and round 3
   redraws (rocket, paintbrush, bug, puzzle, mic-off, car, calculator, person-add, marks and
   arrowhead sizes). Exploration is empty. Next batch ideas: cloud-download, calendar-add,
   folder-add, shuffle, fingerprint, gauge.
   The lint doesn't measure gaps within one path (paperclip's were solved by hand).
   `npm run typecheck` fails while the dev server rebuilds `packages/react/dist` (TS7016 on
   `@area/react`); rerun once the rebuild settles. Review filled variants with
   `node apps/docs/scripts/icon-sheet.mjs filled out.png`.
2. Icons: auto-position needs a new concept. Then swap the demo-level Fluent imports for
   Area icons, one family at a time with the owner's approval, and retire the Fluent map.
3. Components happen on branch `components`, in its own worktree session.
4. A stroke and type baseline across Cursor, ChatGPT, Notion and Figma (needs the owner's
   go-ahead for product dark themes).

## Verification (2026-09-25)

These pass:
- 19,491 token tests and 370 contrast assertions (66 themes);
- 87 React tests, typecheck, docs build and audit;
- 14 contracts, manifest parity, 4 preview tests, consumer check;
- icon lint, 24 capture checksums, `git diff --check`.

Unverified: cross-engine, screen reader, forced colors (execution) and product dark themes.

About 284MB of ignored leftovers under `archive/` (old source caches and logs) remain on
disk; delete them manually if wanted.
