# Phase 2 · fields (B3.1–B3.3, B2.2 in fields, 24 targets, selectable rows), running report

## Done (2026-11-14)

- **B3.1: one field shell** (`packages/styles/src/components/input.css`, top, "One field shell").
  - Roots (Input, Number field, Input group, Select, Textarea, Custom select, Date picker, Tag picker, OTP field) set
    inputs: tier, rest paint from their own seam (input-*, select-*, textarea-*), soft paint, status inks, `--_field-pill`.
  - Shells (the element that draws, incl. the two triggers, Tag picker's field, the OTP slot) read them: edge in
    `--_field-edge` (states set the variable, never `border-color`), `--_field-shape`, fill, lift, type, ink.
  - One hover rule (each family's own exclusions kept), one focus rule, one rule per tone, one soft rule, one tier list.
  - Family copies removed from number-field, input-group, select, textarea, custom-select, date-picker, tag-picker,
    otp-field. Disabled / read-only paint untouched (wave 3).
  - Input group seams border-decorative → `input-edge`; soft group hover edge → `input-edge` like every soft field.
  - Slider's top label 2 → `ui-stack` (in a Panel, `--_panel-label-gap`). Panel's label gap was already
    `ui-stack − 2` (its tier); not changed.
  - inset.css `--_field-corner` now reads the shell's `--_field-shape` (same values).
- **B3.2:** Keep 10 (the pick): nothing built.
- **B3.3:** Search field clear → `dismiss`; Textarea `::-webkit-resizer` drawn (two strokes in `input-chevron`, kept
  inside the corner; verified in headless Edge at Corner 0 / 8 / 14 and on soft). The grip box is the platform's 15
  (width/height on the pseudo are ignored); above Corner 14 only one stroke shows.
- **B2.2 in fields:** cap slots `.area-custom-select__value`, `.area-date-picker__value`, `.area-number-field__unit`,
  new `.area-otp-field__char` (React wraps the character; manifest element `char`); line slots
  `.area-time-field__segment`, `__literal`; text boxes `.area-number-field__scrub:not(:has(> *))` (icon square) and
  `.area-input-group__text:not(:has(> *))` (text or a lettered square) ((H − 1cap) / 2 − border). Native input values untouched; no tokens.
- **24 targets:** steppers `gap: max(0, 24 − step)` with a 24-across hit; Split trigger `max(H − 4, 24)`, icon-only
  `max(H / 2, 24)`.
- **Selectable Table rows:** sm control-sm, md control-lg, lg control-xl, the rule inside. Why 39: line 20 + 2 × cell
  inset 9 + rule 1; the inset comes from the frame's side (edge 14 less half-leading), not from a height.
- **Tests:** new `packages/react/tests/fields.test.mjs` (8); cohesion's shadow, soft-boundary and tone tests re-pointed
  at the shell; otp-field and search-field tests updated.

## Shell values (md field; border = stroke-width, 1 by default; side = padding, text from the outer edge = side + 1)

| type | Compact (28) | Default (32) | Comfortable (36) |
|---|---|---|---|
| 12 | H 24, side 7, corner 6 | H 28, side 9, corner 8 | resolves to 32 |
| 13 | H 26, side 7, corner 8 | H 30, side 9, corner 8 | H 34, side 11, corner 10 |
| 16 | resolves to 32 | H 36, side 11, corner 10 | H 40, side 13, corner 12 |

Steppers: pitch 24 everywhere (28 at 16 / 36, gap 0). Split icon-only sm trigger: 24. Selectable md Table row pitch
(rule to rule): 33 / 37 / 37 at type 12, 34 / 38 / 42 at 13, 46 / 46 / 50 at 16 (plain rows 39 at 13 Default, 47 Comfortable).

## Verified

- React tests 864 / 0; fields.test.mjs 8; check:docs 126 / 0; typecheck clean.
- check:rendered (light captures of the field families after the change; a full run timed out under load): cap-centring
  34 → 14 known, 0 new; 20 pruned (16 field entries mine; accordion, code-block, indicator, toggletip fixed by others).
  No snapshot change in a field family.
- Textarea grip seen in headless Edge (Corner 0 / 8 / 14, soft).

## Correction (2026-11-14)

- Split button: the joined trigger's box overlapped the action's last pixel (shared border). Its target is now its
  ::after only, padding edge through end border (inset.css); hit suite 39 / 0 with GAPS {}, new "no target overlaps
  its neighbour" test for Split button and Number field.

## Left

- See the final message for the rendered-check result and known-failure count.
