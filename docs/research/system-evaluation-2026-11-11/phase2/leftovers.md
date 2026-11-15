# Phase 2 · leftovers (wave 3), running report

What waves 1 and 2 left outside their file lists, so each shared recipe has no family standing outside it without a
written reason. Geometry and shadow only; no colour or state rule was touched.

## 1. Floating shadow (done)
- `popup.css`: the floating bars (`.area-toolbar--surface`, `.area-selection-bar--floating`, `.area-titlebar--floating`,
  the last found by the same rule) join the one stack (`--_elevation`, `--_float-shadow`) and get `--_float-frame`, the
  Floating edge drawn inside as an inset ring (so a bar's inset counts no border). Each bar's shadow is
  `var(--_float-frame), var(--_float-shadow)`. Same values as before at every setting; Elevation, the shadow controls and
  a material's layers now reach the bars through the one stack.
- Tests: cohesion "every floating surface draws the floating frame" reads the shared rule for all three bars; popups
  test's family-sheet lint now covers toolbar, selection-bar and titlebar (no `shadow-float` / `shadow-modal` of their own).
- Dark floating edge: the one known failure was the sampler crossing an **inline** Selection bar (no surface: its
  first control is the white Button). `scripts/rendered/rules/dark-edge.mjs` samples only the floating forms
  (`--floating`, Toolbar `--surface`, Titlebar `--floating`). Pruned.

## 2. Overlay footers (done)
- Approval's footer joins the pair's minimum width, `round(up, 2.25 × H, 1px)` (59 on its sm 26 at the default).
- Soft neutral Cancel: examples stroke-groups and analytics, and the display demo's Dialog (missed by B6.5).
- New test (popups.test.mjs): every Dialog, Drawer, Popover footer in apps/desktop/src with a Cancel that is not
  soft neutral fails. WAITING (app screens, outside this pass): pages/home.tsx (3), pages/project.tsx, publish.tsx.

## 3. Pill corners (done)
- `max(corner, flag × full)` in Button, the corner control (inset.css), Chip (+ its inner/swatch corner), Switch (+
  thumb), Avatar, Pagination, the field shell (`--_field-shape`, so Input, Number field, Input group, Select, Textarea,
  Custom select, Date picker, Tag picker, OTP slot), a field's list rows (popup.css, inside their cap), Composer's
  actions, Video player's bar surfaces, Segmented's thumb (it computed 9997).
- twins.test.mjs "a pill is one value": waiting list removed; it also catches `full × flag` order. bars, fields tests
  re-pointed at the new expression.

## 4. Density ratchet (done as far as the default allows)
- Lint hits 88 (WAITING sum) → 10. 31 families now CLEAN. Each hit took the peers' role, or says "at every density"
  with its reason (a media size, a measured placement, Popover's B6.2 inset, row geometry, an overlap, a hook default,
  reading text). Values, type 13 Compact / Default / Comfortable (type 12: Compact; type 16 in brackets):
  - `ui-cluster` 6 / 8 / 10 [10 / 10 / 12]: icon or text-to-control gaps, action and card gaps, name under a frame
    (`--_fr-name-gap`), plan paddings, video player gaps.
  - `gap-row` 8 / 12 / 16 [16 / 16 / 20]: chart body, file upload stacks, link groups title, meter, choice meta,
    description list justified padding.
  - `gap-section` 16 / 24 / 32 [32 / 32 / 40]: link groups apart, description list justified gap.
  - `2 × ui-cluster` 12 / 16 / 20 [20 / 20 / 24]: accordion trigger gap, chart legend, inline list, link groups rule.
  - `ui-row-inset` 8 and `2 × ui-row-inset` 16 at every density (Nav rows, Table of contents): same values, the row role.
  - Video player clock side `(control-md − 6) / 2`: 10 / 12 / 14 [15 / 15 / 17]; type 12 9 / 11 / 11.
  All whole (density.test.mjs MOVED). Nothing moved at the default.
- Left (role would move the default): icon gaps of 6 in attachment, description-list ×2, message, tag-picker,
  turn-notice (row role `ui-cluster` = 8); Description list justified inset 16 and its More twin (`inset-surface-md` =
  14); Color picker "%" side 8 (field side 9); Pagination page side 6 (control side 9).

## 5. Text centring
- Count's "unread": a visually hidden label (1 × 1 clipped) measured as text: the rule now skips text in a box ≤ 1 px.
  Pruned.
- 13 left, recorded: Kbd 0.11 (11 tiles' families) and Badge / Tag / Tag picker lg 0.38 are the mark recipe's
  whole-pixel baseline (plan, Optical spacing: "Marks share one whole-pixel cap baseline"), which rounds
  (H + 1cap) / 2 to a pixel: the offset is that rounding, under half a pixel. The two plan rules conflict for marks; the
  owner picks one. Notes added to known-failures.json.

## 6. Table caption (done)
- `padding: gap-row var(--_cell-edge)`; flush 0. md 14 (was 12), sm 10 (was 12): on the first column's text.

## 7. Board (decided, not built)
- The add row's and card heading's icon gaps read `gap-md` (4 / 6 / 8), a density role, so the lint is right to pass
  them. By the row table they are row icon gaps, `ui-cluster` (6 / 8 / 10): the default would move 6 → 8. Listed.

## Verified (2026-11-14, after the restart; edits re-checked in the tree)
- Full check:rendered (125 families, light + dark): cap-centring 14 → 13 known (Count pruned), dark-floating-edge 1 → 0
  (pruned), 0 new; header-bars and marks unchanged. corners.json updated deliberately: avatar 10007/10009 → 9999,
  button 10007 → 9999, chip 10007/10009 → 9999, chip swatch 10003 → 9999, switch track 10003/10005 → 9999, thumb
  10001/10003 → 9999 (nothing else moved).
- Settings captures (light; table, button, chip, switch, link-groups, file-upload, approval): type 12 Compact, type 16
  Comfortable, Corner 0, Pill: every pill 9999px, corners whole (Corner 0: 0); link groups 16·6 / 40·12 / 24·8;
  Approval footer Buttons 54 (24), 81 (36), 59 (26). Table caption has no demo tile: pinned by cohesion only.
- React tests 876 / 877 (the miss is "input action has pressed and disabled paint", state paint, another worker);
  typecheck clean; check:docs 0 errors (Strokes Floating row regenerated: the bars no longer read the edge directly);
  tokens `npm test`: 2 failures in rederive / usage (fg-quiet, bg-change-*, wash-pressed-*), other workers' tokens.
- Styles build: manifest parity fails on timeField disabled / read-only (another worker); CSS builds.

## Left for the conductor / owner
- App screens with a ghost Cancel in a Dialog footer: pages/home.tsx ×3, pages/project.tsx, publish.tsx (WAITING in
  popups.test.mjs).
- Mark baseline vs cap rule (13 known failures); the 10 density hits and Board's gaps above, each moving the default.
