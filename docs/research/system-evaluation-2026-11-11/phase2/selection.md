# Phase 2 · selection (B7.4–B7.7, B7.13), running report

## Done
- **B7.4 roles** (emit/base.ts unless noted):
  - `bg-pressed-track` (layers.css, restated on every ground with `bg-component-pressed`): the pressed wash capped at the
    alpha where muted keeps 4.6:1 on the ground's control fill, solved in sRGB from the fill's `l` (`oklch(from
    bg-component …)`). Needs `wash-pressed-light` / `wash-pressed-dark` (the pressed wash's alpha as numbers). Defaults:
    8.5% black on the page's #f7 (was 7.5%), dark the pressed wash's 15.7% white (was 16.5%). Read by Segmented's
    unselected press, soft Toggle group (it pressed to `bg-active`), Board's add row.
  - `bg-mark-pressed`: 0.107 + 0.01175 × Pressed step black, 0.226 + 0.0035 × step white (15.4% / 24% at the default,
    the old literals). Chip input.
  - `bg-change-added` / `bg-change-deleted`: Diff's owner-picked tints (14/12% light, 24% dark of the status solid);
    Code block's changed lines move from the status surfaces onto them.
  - Tag's neutral plate reads `hue-neutral-bg` (same values). Skeleton reads `bg-component` / `-active` in both modes
    (light was a fixed 10/16% grey).
  - `::selection` colour reads `var(--area-selection-ink, fg-default)`: a hook for inverse grounds (Tooltip, not owned).
  - Property list's opacities are B7.8's (disabled worker): left.
- **B7.5**: the dragged sash reads `focus-color` (Splitter and Panel resize).
- **B7.6** `selection.css` (new shared file, imported after inset.css): `--_selected-border` in, `--_selected-ring` and
  `--_selected-edge` (ring + `selected-tint`) out. On it: Asset card (card and frame), Design card ground, Color swatch
  picker cell (was a space-2 fg-selection ring on a surface plate), File grid item (was the List box grid's plate; its
  focus moves outside, at `focus-offset`, so focus and the edge differ by placement), Custom select preview (ring only).
  List box grid and Custom select's word grid keep the plate; Alignment picker is a glyph grid (the mark). The swatch
  palette layout keeps its two-tone ring (on arbitrary colours no theme ink holds 3:1; spec literal).
- **B7.7** pick 1, plate + check: native Select's checked option takes `bg-component-active` (outranks hover, gives way
  to press), its ::checkmark `fg-selection`; forced colours Highlight pair.
- **B7.13** scope (proposal below): selection.css re-points `fg-quiet` to the row ink under every selected/current row of
  Menu, List box, Nav, Tree view, Table and `[data-area-selected]`; Nav's own horizontal-tab ghost rule removed.
- Tests: `packages/react/tests/state-paint.test.mjs` (literal-fill lint over state rules, role reads, accent-read lint,
  one selected edge, value pickers, scope); `packages/tokens/src/color/track-press.test.ts` (the track press over every
  ground, Layers step, fill and cast: muted ≥ 4.5, press never lighter than hover at the shipped fills). cohesion's
  splitter assertion moved to focus-color.

## B7.13 proposal (intake ladder)
Need: parts inside a chosen row read the row's inks without a selected rule of their own.
Answer: rung 1, nothing new in the API: a shared CSS scope keyed on each family's existing state attribute, plus a
documented `data-area-selected` hook for compositions. Not a setting (no choice), not a prop.
Shape: under the scope `fg-quiet` → `fg-default`; words keep `fg-default` and marks `fg-selection`, since the owner's
rule is that the plate alone marks the chosen row (2026-09-30), so re-pointing words to `fg-selection` would turn chosen
rows' words blue at Accent. The "hovered group lights its ghost children" half is not built: it breaks two Area rules
(hover never changes ink; one indicator per row). Cost: one rule, one test; ghost actions in chosen vertical Nav, Tree,
Table and Menu rows go to full ink (was only the horizontal Nav's tab).

## Also done (resumed 2026-11-14)
- B7.7 reaches Combobox and Custom select too: their React set `data-selected` on the chosen row (Custom select's list
  only; its grid cells keep their own marks). Combobox and Custom select had shown the check alone since custom-select Q3.
- Code block's changed lines' inks darken 0.09 (measured 4.27:1 keyword, 4.21:1 removed marker at 0.05 on the firmer
  plates; dark 8.4:1, no lift).
- Token plumbing: usage entries (`bg-mark-pressed`, `bg-change-*`, `wash-pressed-*`); `fg-quiet` in rederive's
  OVERRIDABLE (the scope sets it).
- Docs: DESIGN_SYSTEM (every state fill a role; chosen tile; selection scope; value pickers), THEMING (row ink scope,
  selection ink), ARCHITECTURE (selection.css row), 23 specs (current state + a dated section), usage entries for
  Select, Combobox, Custom select, Color swatch picker, Splitter, Panel resize, File tile.

## Measured (headless Edge over CDP, built CSS)
- Track press: 8.5% black, muted 4.53:1 on the page's track (light); 15.7% white, 5.71:1 (dark); Pressed fill 25 → 8.4%;
  light Layer contrast 100 → 12.5% (uncapped), 4.60:1.
- Selected edge vs its ground (swatch cell, File grid tile; page, card, menu, soft plate; Neutral and Accent; width 1
  and 3; yellow, indigo, lime, purple; Layer contrast 0 and 100): weakest 4.97:1, blue on the soft plate at light
  Layer contrast 100; Neutral ≥ 13.8:1. Widths follow the setting (1, 3). With the stroke at its minimum (1) the edge
  still carries selection; the tint (Selected tint) only adds a layer; the setting has no 0.

## Checks
- state-paint, cohesion, dialog and every family suite I touch pass; full React run 1 failure not mine (audit-medium,
  "an input action has pressed and disabled paint"). Tokens: track-press, rederive, usage pass; contrast report 0.
  typecheck clean. check:docs 0 errors. Rendered: capture of my 22 families + `--reuse`: no new violations, snapshots
  unchanged.

## Left
- Not owned, for the conductor: Card and choice cards onto `--_selected-edge`; Tooltip sets `--area-selection-ink`;
  spec marks on Video player, Material, Button's and Calendar's `#fff` dark press (pending in the lint).
