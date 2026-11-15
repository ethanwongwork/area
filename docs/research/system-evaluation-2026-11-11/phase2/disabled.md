# Phase 2 · disabled (B7.8, B7.9, B7.10, B7.12), running report

## Done (2026-11-14)

- **Field recipe** (`packages/styles/src/components/input.css`, after the tones, "Disabled and read-only"). The roots set
  `--_bg-disabled` (from the seam: input-, select-, textarea-bg-disabled, all the soft fill), `--_border-disabled`
  (border-faint; soft transparent; ghost pickers transparent) and `--_bg-read-only` (outline `--_bg-soft`, soft
  `bg-component-hover`, ghost `bg-component`).
  - Disabled holders: `:is(input, number-field, otp-field, tag-picker__field)[data-disabled]` and
    `:is(select, textarea, custom-select__trigger, date-picker__trigger):disabled`. They set `--_bg`, `--_border`,
    `--_border-hover`, `--_ink: fg-disabled` and `cursor: not-allowed`. Every part (icon, affix, action, unit, scrub,
    stepper, chevron, icon, `[data-placeholder]`, `::placeholder`) takes fg-disabled. A tag in Tag picker dims by
    opacity. Disabled wins over a tone.
  - Read-only, one cue that survives Edge contrast 0 and Fields stroke 0: the fill is one step deeper than the
    editable rest. The value keeps the field's ink, the edge stays, focus is the same, and there is no hover edge.
  - Family copies are removed from input, number-field, select, textarea, custom-select, date-picker, tag-picker,
    otp-field and time-field. Textarea now paints `data-read-only` from React. Time field's manifest takes disabled
    and read-only from Input (`statesFrom`).
- **By shape (B7.8):** Calendar's unavailable days dim their parts by opacity-disabled (the day keeps its ring and its
  tile fill). Select's disabled options use opacity and take no hover plate. Property list reads the token. Setting
  row's label goes muted, as Field's does; its description keeps its ink.
- **Toned solids (B7.9, the repaint pick):** Button's `--_tone-hue` is 1 on the six hued tones. `--_toned` reads it,
  and a solid also takes `action-accent`. When disabled or inactive, a toned button repaints: the fill becomes the
  variant's neutral (`--_bg-off`: soft fill on solid and soft, surface on outline, none on ghost), the edge becomes
  neutral (`--_border-off`), and the ink becomes fg-disabled, at opacity `--_dim` = 1. A neutral button dims as
  before. on-color stays neutral. Split button's group dims only a neutral pair (`--_split-dim` also follows Action
  accent), and a disabled toned trigger's divider becomes the neutral line. Badge has no disabled state, so nothing
  was built for it.
- **Read-only choices (B7.10):** choice.css no longer drops the checked card's selected edge or tint. The
  `data-readonly` alias is gone. The control's hover rules exclude `[data-read-only] > *`, and so do thumbnail hovers.
  Radio group's read-only has its own cursor rule.
- **Inactive row (B7.12):** a Menu or Context menu row's words (label, danger label, trailing) take fg-muted at full
  strength; its glyphs stay at opacity-disabled; its note is muted, so it is never stronger than the label.
- **Forced colours:** GrayText for disabled fields, Button, Menu rows (disabled and inactive), Checkbox and Radio,
  Switch, and calendar days. Read-only is untouched.
- **Tests updated:** audit-rules (field paint) and cohesion (field disabled, the inactive parts' `--_dim`) now assert
  the recipe.

- **Tests:** `packages/react/tests/states.test.mjs` (7 tests) pins each recipe. The behaviour suite
  `tests/behaviour/suites/states.test.mjs` (49 tests, fixture `fixtures/states.jsx`) checks four things. Read-only
  controls in 12 families are reached by Tab, announced and left unchanged by keys and the pointer. Disabled controls
  are skipped. The paint grid runs on 9 grounds at 12 setting combinations: both themes; Layer contrast 0 and 100;
  Edge contrast and Fields stroke 0 and 8; Corner 0 and pill; Tone contrast 2.5 and 4.5 with Tone tint 0 and 160;
  yellow, red and green accents; Action Accent; Contrast More.
- **Docs:** DESIGN_SYSTEM "Disabled and read-only", the shell paragraph, the read-only API and Inactive; CONTRAST; 21
  specs (current state plus the feedback log); documentation entries in fields, actions and navigation; JSDoc for
  SettingRow, Radio and Checkbox.

## Lowest measured (behaviour suite `states`, 2026-11-14)

| What | Lowest | Where |
|---|---|---|
| disabled field value | 2.08:1 | well, light, Layer contrast 100 |
| toned disabled Button label (repainted) | 1.93:1 | ghost discovery on the danger tint, light |
| neutral disabled Button label (dimmed) | 2.14:1 | solid on recessed, light |
| read-only value | 8.66:1 | soft on float, dark, Layer contrast 100 |
| read-only fill vs editable fill | 1.02:1 | outline on recessed, dark, Layer contrast 100 (thin) |
| inactive Menu row's reason | 5.74:1 | page, light, Layer contrast 0 |
| disabled Setting row description | 4.63:1 | danger tint, light, Tone tint 160 |

## Left / for the conductor

- The plate, toned and solid grounds declare no control fills in layers.css. A disabled field's fill there is the
  page's (1.0:1 on a danger tint), and so is a ghost's read-only fill. This is a layers.css change, not in my files.
- Nav item's inactive row (nav.css) still fades its words; B7.12's rule should reach it. Not in my files.
- Input group (input-group.css) keeps its own disabled paint; it could join the shell recipe.
- Chromium's accessibility tree reports `readonly` only for text boxes. For spin buttons, comboboxes, switches,
  checkboxes and radios the suite checks `aria-readonly` / native `readonly` instead.
