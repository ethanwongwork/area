# NumberField spec

**Captures:** `docs/research/captures/number-field/` (pass-0 in `before/`)
**Peers:** Input (shared chrome), InputGroup (letter compartments), Panel (inspector), Slider

## Owner decisions

- 2026-09-23 (COMPONENTS.md, inspector foundation, first priority): decimal and negative
  values, min/max/step, keyboard increments, optional steppers, units, locale-aware
  formatting, scrubbing, fine/coarse increments, mixed values, commit/cancel and bounded
  arithmetic entry.
- 2026-09-26: "do the next component". The owner plans a compact density for dense products
  (Figma, IDEs); Figma's 24px fields are that density's target, not the default's.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

- 2026-10-21 (owner: "build proposals 1–4"): `steppers="split"` puts minus before the value and plus after it; `trailing` holds a control (a ghost Custom select) after the value, in the steppers' nested square, 4 in from the end.

## Job and boundaries

Edits one number with keyboard, pointer scrubbing, arithmetic and optional steppers. Not
Slider (a range you see), not Input type=number (plain forms), not InputGroup (several
values in one shell; it reuses NumberField).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline, soft | Forms vs. inspectors | Figma inspector: soft (#F5F5F5, border on hover) |
| size | sm, md, lg | Control tiers | System |
| scrub | letter, icon, or grip (`true`) | The field's name as the drag handle | Figma X/Y/W/H letters, rotation and opacity glyphs; Base UI ScrubArea is the label |
| unit | text after the number | %, °, px | Figma "100%", "0°" |
| steppers | off, on (both after the value), split (minus before, plus after, the value centred) | Forms without a pointer-drag habit; split for a count or quantity (owner 2026-10-21) | Base UI (− and + around the value), Spectrum and Carbon counters, Google Docs' font size, the owner's Insert panel "Columns − 0 +" |
| trailing | a control after the value (a ghost Custom select), in a nested square at the end | A sizing or unit mode beside the value (owner 2026-10-21) | Figma's W and H fields with their resizing mode; the owner's auto-layout panel "360 Fill" |
| mixed, read-only, disabled, validation (`validationStatus`, `invalid`) | states | Multi-selection, locking | Figma ("Mixed") |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| figma | target product | Properties panel with a frame selected in a community-file copy (Hercules UI Kit, Drafts): X position, rotation, width (rest and hover), opacity. Selection only; no value edited | figma.com (Chrome), 2026-09-26 | `figma--*` (5) |
| baseui | design system (rendered) | NumberField demo: the label "Amount" is the `ScrubArea` (`cursor: ew-resize`); 32px group with − and + | base-ui.com/react/components/number-field, 2026-09-26 (read from the rendered DOM, not captured) | — |
| area | this system | Inspector X field and a unit field, before and after | localhost gallery | `before/area--*` (2), `area--*` (2) |

ChatGPT and Notion: no numeric fields found on read-only surfaces.

## Measurements

Generated with `node scripts/capture-compare.mjs` and filtered. Columns: Area inspector X
after, before; Figma X; Figma W on hover; Area unit field after, before; Figma opacity.

| slot · property | area · inspector-x · rest · light | area · inspector-x · rest · light | figma · x-position · rest · light | figma · width · hover · light | area · unit · rest · light | area · unit · rest · light | figma · opacity · rest · light |
|---|---|---|---|---|---|---|---|
| **shell** size | 127 × 32 | 127 × 32 | 88 × 24 | 88 × 24 | 256 × 32 | 256 × 32 | 88 × 24 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 0.886275 0.886275) | 0 | 1 solid rgb(230, 230, 230) | 1 solid color(srgb 0.886275 0.886275 0.886275) | 1 solid color(srgb 0.886275 0.886275 0.886275) | 1 solid rgb(245, 245, 245) |
| **shell** radius | 8px | 8px | 5px | 5px | 8px | 8px | 5px |
| **shell** font | 14px/20px 400 Geist | 14px/20px 400 Geist | 11px/16px 400 Inter | 11px/16px 400 Inter | 14px/20px 400 Geist | 14px/20px 400 Geist |  |
| **shell** background | rgb(247, 247, 247) | rgb(255, 255, 255) | rgb(245, 245, 245) | rgb(245, 245, 245) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(245, 245, 245) |
| **scrub** size | 16 × 16 | 16 × 16 | 24 × 24 | 23 × 24 | not found | not found | 24 × 24 |
| **scrub** edge from shell (t r b l) | 8 103 8 8 | 8 103 8 8 | 0 64 0 0 | 0 64 0 1 | not found | not found | 0 63 0 1 |
| **scrub** font | 14px/14px 400 Geist |  | 11px/16px 400 Inter | 11px/16px 400 Inter | not found | not found |  |
| **scrub** color | rgb(102, 102, 102) |  | rgba(0, 0, 0, 0.5) | rgba(0, 0, 0, 0.898) | not found | not found |  |
| **control** size | 83.98 × 30 | 60.16 × 30 | 64 × 24 | 41 × 24 | 17.74 × 30 | 214.72 × 30 | 62 × 24 |
| **control** edge from shell (t r b l) | 1 11.02 1 32 | 1 34.84 1 32 | 0 0 0 24 | 0 23 0 24 | 1 227.24 1 11.02 | 1 30.26 1 11.02 | 0 1 0 25 |
| **unit** size | not found | 15.82 × 20 | — | — | 11.23 × 20 | 11.23 × 20 | — |
| **unit** edge from shell (t r b l) | not found | 6 11.02 6 100.16 | — | — | 6 216 6 28.77 | 6 11.03 6 233.74 | — |

Figma: 24 tall, 11/16 Inter, 5px radius, #F5F5F5 fill with no visible border at rest and
`rgb(230, 230, 230)` on hover. The leading square (24 × 24) holds the letter at 50% black or
a glyph, and is the drag handle; the text starts at 24 (the square's edge). Units are part of
the value string. No steppers.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| scrub · content | the field's **letter or icon** (`scrub="X"`, `scrub={<RotateIcon />}`); `true` keeps a grip | Figma, Base UI | Was always a three-line grip, with the name in a label row above |
| scrub · target | the whole leading square (control height), via `::after` | Figma (24 square) | Was the 16px glyph only |
| scrub · geometry | glyph in the shared 16 icon slot, 8 in; text starts one control height in (32 at md) | Figma: text at the square's edge (24 at 24) | — (inset contract unchanged) |
| scrub · color | `input-icon` (muted) | Figma 50% black | — |
| unit · position | **directly after the number**, only glyph spacing between; the input sizes to its content (`field-sizing: content`) and a press on the empty space focuses it | Figma "100%", "0°" | Was pushed to the far edge. Browsers without `field-sizing` keep it at the edge |
| unit · mixed/empty | not drawn | Figma shows "Mixed" alone | Was "Mixed px" |
| inspector recipe | soft variant, letter or icon handles, no label row, no px | Figma | Was outline fields under X/Y/W/H labels with px |
| parts gap | 6 at sm, md and lg, the density tokens (`number-field.css:6, :17, :36-38`); the unit cancels it to sit against the number (`:80`); compact sm 4 | Peer: Input, Button (audit S14) | Was 4 / 8 / 8 |
| height, type | control-md (32, 14/20) at default density | System tiers | Figma's 24 and 11/16 are the compact-density target |
| radius, border, soft hover | radius per tier as Input and Button: 6 sm, 8 md, 10 lg (`number-field.css:25`, `:36-38`); soft border on hover | Input; Figma adds the border on hover too | Was 8 at every size before audit S4 |
| read-only | the variant's rest paint (no soft fill), no hover edge, default cursor (`number-field.css:43, :63`) | Audit B-9 B (owner), as Input | Was the soft fill |
| disabled | field paint; a soft field stays edgeless; value, unit, scrub handle and steppers `fg-disabled` (`number-field.css:60-64, :113`) | Audit B-9, B-10, as Input | The unit, scrub and steppers kept their rest ink |
| forced colours | `CanvasText` edge (soft too), `Highlight` focus ring, invalid dashed (`forced-colors.css`) | Audit B-11, as Input | Had no forced-colours rule |

## Pass 2: steppers and the outline shadow

Owner: "refine the steppers arrow counters … make sure it's the correct and intentional
experience"; "for the outline style, do whatever is consistent with the system".

| Source | Stepper | Measured |
|---|---|---|
| React Aria (react-aria.adobe.com/NumberField, rendered) | Decrease then Increase after the input, borderless, lucide minus/plus | two 32 × 32 buttons in a 146 × 32 group, 8px outer radius |
| Base UI (rendered) | − before, + after the input | 32px group |
| Area pass 1 | stacked 12px chevrons in a bordered column | 26 wide, each half about 15 tall |

Decisions:
- **Minus then plus after the value**, as React Aria and Carbon. Each is Input's nested action
  square: field height − 8 (20 / 24 / 32), corner field radius − 4, concentric (md: 24 box, 4
  ring, radius 4; audit B-7 B, was icon + 8 with `radius-small` 6), 4 in from the top and side
  through the inset contract (`--_box-end: var(--_step)`). Targets grow from about 15 to 24 tall, and
  the field keeps one outline (no column border).
- Glyphs: Area's pilot `add` and a new `subtract` (same 11px bar, square keyline), exported
  as package glyphs.
- **Press and hold repeats**: one step, then every 60ms after 400ms; it stops on release and
  at the bound (the window's pointerup ends it when the button disables mid-press). Verified
  in headless Edge with real mouse events: 80 → 81 on press, 86 at 700ms, 100 and disabled at
  the max; minus stopped on release.
- The buttons are out of the tab order (`tabIndex=-1`): the arrow keys, Home and End step the
  value (WAI spinbutton; React Aria excludes them too). Pressing one moves focus to the input.
- Disabled: `fg-disabled` instead of 40% opacity. Hover `bg-component-hover`, press
  `bg-component-active`; on a soft field the translucent `bg-hover` / `bg-active`, which show on
  its #f7 fill (audit B-7 C; `number-field.css:139-143`).
- **No resting shadow** on Input, NumberField, InputGroup, Textarea, Checkbox and Radio: controls
  at rest carry none, as Button (its pass removed `shadow-1`; ChatGPT, Notion and Figma
  fields have none). Floating and lifted layers keep theirs (Segmented's selected thumb, menus).

## Behavior and accessibility

Unchanged: `role="spinbutton"` text input with `aria-valuenow/min/max` and a value text that
includes the unit; ArrowUp/Down step (Shift ×10, Alt ×0.1), Home/End, Enter commits, Escape
cancels; arithmetic entry; scrub by 8px per step with pointer capture, cancel restores. The
scrub handle is `aria-hidden`; the letter is not the accessible name, so each inspector
field needs `aria-label` (the demos give "X position", "Width" and so on). `invalid` paints the
error state and sets `aria-invalid`, as Input, Select and Textarea; `className` and `style`
land on the shell, ref and other props on the input (`NumberField.tsx:169`).

## Visual pass

2026-09-28, Claude in Chrome (batch 8): Figma's Design panel fields (X, W with its menu, Rotation, Gap;
`figma--number-field-letter`, `-menu`, `-icon`, `figma--gap-field`) beside the gallery's Number field
tiles and the Panel recipe at 2x.

- Figma's field is 88 x 24, radius 5, #f5 fill, no edge, 11/16 at 450; the letter or icon takes a
  24px leading slot (the field's height), the value starts right after it, 8 of padding at the end.
  Area's sm field is the same model at default density: 28 tall, the 16px scrub glyph in a slot as
  wide as the field is tall, the value after it, soft fill, no resting edge.
- Figma draws X and Y in full ink and W / H in muted ink (W and H carry a size menu); Area's scrub
  letters are muted throughout, one role for one job.
- Figma's Gap field splits a value from a menu chevron; Area composes that from a field and a
  Select, not a NumberField variant.
- No change. Dark theme not compared.

## Verification

- 5 Figma captures (redacted), 2 Area before, 2 after; checksums verified.
- Measured in the gallery: glyph gap between number and unit 0 (box), text at 32.
- Scrub verified with a real pointer: a drag starting 3px inside the field's edge (outside
  the glyph, inside the square) moved X from 24 to 34 over 80px (8px per step).
- Unverified: dark theme; Safari and Firefox without `field-sizing`.

## Open questions

- Compact density: Figma's 24/11 fields and 5px radius belong to the compact axis.

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md` (hover, focus, selected: in at once, out on `fast`; focus never fades in). The
shell lists its transitioned properties explicitly (`background-color, border-color, color,
box-shadow`) with two private clocks, `--_t-paint` for fill, edge and ink and `--_t-halo` for the
focus halo, so a state can make paint instant while the halo still lets go softly.

| Interaction | Before | After |
|---|---|---|
| Hover edge | `--area-transition`: border-color `fast` ease-out in and out | in at once (`--_t-paint: 0s` on `:hover`), out on `fast` / `ease-out` |
| Focus edge | border-color `fast` ease-out in and out | in at once, out on `fast` / `ease-out` |
| Focus halo (box-shadow) | faded in over `fast` (lagged the keyboard) | in at once (`--_t-halo: 0s`), out on `fast` / `ease-out`, also when the field is left while hovered |
| Increased-contrast outline | never transitioned | unchanged: instant both ways |
| Validation tone (invalid, success, warning) and disabled | edge faded in over `fast` | lands at once; clearing it while focused is instant (focus is 0s), clearing it at rest fades on `fast` |
| Stepper plate (minus, plus) | no transition: instant in and out | hover and press in at once, out on `fast` / `ease-out`; a held press keeps the pressed plate; a stepper that hits its bound mid-press fades its plate out on `fast` |
| Stepper press focusing the value | halo faded in | halo at once (focus rule) |
| Scrub | cursor only, value follows the pointer | unchanged: direct manipulation is never eased |

Crispness: shell, scrub square, steppers and their 16px glyph boxes measured on whole pixels on
`number-field.html`. Open: the `add` / `subtract` glyphs centre ~1px strokes on integer
coordinates and read as 2px grey bars at 1x (research B4, an icon-drawing change for the owner).

## Review note, 2026-10-09

- **What changed:** Only the inspector tile changed: the Panel around the fields is 2px tighter. Number field itself is unchanged.
- **Why:** Panel's spacing was tightened in this round, and this tile sits in a Panel.

## Interaction polish, 2026-10-16

Steppers press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover) (soft: `bg-pressed`). Not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-09-26 · pass 1 ("do the next component, show me the images in chat"): Figma's handle
  and unit model, inspector recipe, before/after images sent in chat.
- 2026-09-26 · owner: outline style consistent with the system; does Button outline have a
  shadow (no); refine the steppers → pass 2 above.
- 2026-09-28 · batch 8 Claude in Chrome side by side (Figma X, W, Rotation, Gap fields) → no change →
  `figma--number-field-*`, `figma--gap-field`.
- 2026-09-30 · audit S4 (owner) → radius follows the tier as Button: sm 6, md 8, lg 10 (`--_radius` per size, `number-field.css:25`, `:36-38`); was 8 at every size. The md captures above are unchanged.
- 2026-09-30 · audit S14 (owner) → the gap between the field's parts is 6 at sm, md and lg (was 4 / 8 / 8), from the density tokens (`number-field.css:6, :36-38`; density.ts:80-82), as Input.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → new `invalid` prop: error paint and `aria-invalid`, as Input takes it (NumberField.tsx:78; was passed through as an unknown DOM attribute); `style` lands on the shell with `className` (NumberField.tsx:169; was the inner input).
- 2026-10-01 · audit B-7 (owner pick B+C) → steppers are field height − 8 (20 / 24 / 32), corner field radius − 4, concentric (md: 24 box, 4 ring, radius 4, measured); on soft fields they hover and press with translucent `bg-hover` / `bg-active` → number-field.css:11, :124-143.
- 2026-10-01 · audit B-9 (owner pick B) → read-only keeps its variant's rest paint (was the soft fill), no hover edge, default cursor; a soft field never gains an edge when disabled → number-field.css:43, :61-64.
- 2026-10-01 · audit B-10 → unit, scrub handle and steppers take `fg-disabled` → number-field.css:112-113.
- 2026-10-01 · audit B-11 → forced colours: `CanvasText` edge, `Highlight` focus ring, dashed invalid → forced-colors.css.
- 2026-10-03 · radius audit → steppers are concentric with the field, floored at the smallest control's corner (compact 20 r2 → r4, default 24 r4 → r5; `number-field.css:123`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · all even (owner) → steppers floor at `radius-floor` 4 (`number-field.css:123`).
- 2026-10-04 · pill shapes and list rows (owner) → `--area-pill-field` makes the field a pill, steppers concentric (`number-field.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: hover and focus edge and the focus halo appear at once and fade out on `fast`; tones land at once; the stepper plates gain the same in-at-once, out-on-fast fade (`number-field.css`). See "Motion and interaction, 2026-10-07".
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft variant's resting edge is `input-edge-soft` (none at standard, the strong control edge at more), as Input's.

## Review note, 2026-10-21

- **What changed:** two additions. Split steppers put minus before the number and plus after it, for counts. A trailing
  slot holds a small picker after the number, such as Figma's "360 Fill".
- **Why:** your Insert and auto-layout panel references; Spectrum, Carbon and Google Docs set counts this way, and
  Figma's width and height fields carry their sizing mode inside the field.
