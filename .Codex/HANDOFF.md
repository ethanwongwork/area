# Handoff — 2026-09-25

Branches: `icons-system` (icon work, this folder) and `components` (all component work,
in its own worktree session). Both start from `main`; merge through pull requests.
System-wide files (icon generator, base styles, handoff) change in one session at a time. The dev server is `npm run dev`.
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
  - second pass (2026-09-25): every icon redrawn to one system. The rules are the
    `area-icon-construction` skill: Cursor keylines, 0.5px grid, 45° diagonals on the
    pixel lattice, 3px gap unit, shared parts. The lint enforces them (`--report`).
    The page has new Side by side and Optical balance sheets. Record: `docs/specs/icons.md`;
  - third pass: negative-space lint (gap scale, counter minimum), filled variants from
    `data-filled` roles, five more icons (copy, document, folder, trash, warning); 17 in all;
  - fourth/fifth pass: tiered counter scale; owner picks applied (U cup 4 × 2.5, ⌀1.5 dots,
    fold 4, tab flap); Exploration section appears only while `explore/` has candidates;
    Sizes sheets (scaled vs constant line at 12/20px);
  - seventh pass: `gallery-icons.html` review page (one tile per icon, sizes, 4×, contexts),
    folder 11 × 9, rotations (`data-rotations`), batch 3 (open, link, person, reset); 28 icons;
  - eighth pass: filled layering (`cut`, `gap` roles), line glyphs fill by weight (1.5px),
    arrowhead system (5px standalone, 3px embedded); alignment family;
  - ninth pass: size curve (line ∝ size^0.45), filled free-end retraction, Fluent-style
    reset, transpose for alignment order, batch review page (`batches.json`), batch 3
    docs chrome; 45 icons;
  - components: Badge dismiss, NumberField steppers, TreeView chevron and check, Composer
    send arrow now draw Area glyphs (`packages/react/src/components/glyphs.ts` + `Glyph.tsx`);
    status marks pass done (strict lint, shared inset check);
  - Fluent remains in all other components.
- **Indicator (pilot component):**
  - 6px dot; 16px count with 10/14 text, weight 500;
  - 1px surface cutout;
  - counts centre on the corner (`compact` is opt-in); dots centre on the icon corner;
  - tabs reserve space after the label; circular owners sit 2px outward.

## Next

1. Owner: confirm the size model (scale 12–20px, recommended) and the 12px glyphs in
   Badge and NumberField (`docs/specs/icons.md`, fifth pass).
2. Next icon work: owner review of batch 4 (inspector); auto-position needs a new concept;
   then batch 5 (lock, star, calendar, pencil, download, sparkle…) and the demo-level
   Fluent swap in `docs/specs/icons.md`; review
   each icon on `gallery-icons.html`. Swapping demo-level Fluent imports needs the owner.
3. Icons: replace the remaining Fluent families. Move Area's 29 marks to 1.125px at the
   same time.
4. A stroke and type baseline across Cursor, ChatGPT, Notion and Figma. Product dark themes
   need the owner's go-ahead, and the Figma editor needs Edge in the foreground.
5. The next component through the process.

## Verification (2026-09-25)

These pass:
- 19,491 token tests and 370 contrast assertions (66 themes);
- 87 React tests, typecheck, docs build and audit;
- 14 contracts, manifest parity, 4 preview tests, consumer check;
- icon lint, 24 capture checksums, `git diff --check`.

Unverified: cross-engine, screen reader, forced colors (execution) and product dark themes.

About 284MB of ignored leftovers under `archive/` (old source caches and logs) remain on
disk; delete them manually if wanted.
