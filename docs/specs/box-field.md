# Box field spec

**Status:** accepted · 2026-09-26; batch 8 side by side 2026-09-28, no change
**Captures:** `docs/research/captures/inspector/` (Figma Design panel, padding row, opacity / radius row)
**Peers:** NumberField (each field), PanelRow (the grid), Button (the toggle), Popover (Figma's
corner panel in the recipe)

## Owner decisions

- 2026-09-23 (COMPONENTS.md, inspector foundation item 6): "linked four-value controls for
  padding/corners".
- 2026-09-26: "build the next component". The question of opening Figma's Independent corners
  panel in the owner's file went unanswered, so this pass uses the existing capture and
  Figma's public help pages, and nothing in the file was clicked.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

One property with four parts: padding (top, right, bottom, left) or corner radius (each
corner). Linked, it edits the parts together; a toggle splits it into one field per part.
Not NumberField (one value), not InputGroup (unrelated values in one shell), not a
spacing-box diagram (Webflow): the parts are fields on the inspector grid.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| kind | sides | padding | Figma auto layout: horizontal + vertical padding, "Individual padding" for top/right/bottom/left |
| kind | corners | corner radius | Figma: one Corner radius field + "Independent corners" |
| mode | linked (default) / independent | the toggle | both |
| size | sm, md, lg | NumberField and Button sizes | Figma's panel is sm (24 → compact) |
| variant | outline, soft | NumberField's variants, passed to each field (a composition prop typed from NumberField, not a BoxField CSS axis) | Figma's fields are soft (#F5F5F5) |
| state | disabled, read-only, mixed | NumberField states; read-only makes every field read-only and the linked toggle unavailable | Figma shows "Mixed" |
| toggle | on (default) / off | a fixed mode (Figma's corner panel is always split) | Figma's corner details panel |

Excluded: corner smoothing (Figma puts it in the same panel; it is a separate property);
typing CSS shorthand into a linked field (Figma: "type CSS shorthand") — a later pass.

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| figma | target product | Appearance row: Opacity, Corner radius, Independent corners (`dialog-trigger-button`) | Design panel, 2026-09-26 | `inspector/figma--design-panel-frame--rest--light` nodes 264–300 |
| figma-help-radius | public docs | "Click Independent corners … In the Corner radius details panel … enter a pixel value for each corner" | help.figma.com/hc/en-us/articles/360050986854, read 2026-09-26 | — |
| figma-help-padding | public docs | "Padding controls are separated into vertical and horizontal padding by default. Individual padding: click to use top, right, bottom, and left padding fields." | help.figma.com/hc/en-us/articles/31289469907863, read 2026-09-26 | — |

Target products searched without an equivalent: ChatGPT and Notion have no box-model editor.

## Measurements (from the capture)

- Appearance row, 240 panel, 16 inset: caption 9/14 at 500, 50% black, 4 above the fields;
  fields 88 × 24 at 16 and 112 (8 apart); Independent corners 24 × 24 at 208 (8 after the
  second field), ghost, radius 5; it opens a dialog (class `dialog-trigger-button`), not an
  inline expansion.
- Field: 24 tall, soft #F5F5F5, radius 5, 24 icon square then the input.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| grid | `minmax(0,1fr) minmax(0,1fr) var(--_control)`, gap 8 | Figma 88 + 8 + 88 + 8 + 24 (= PanelRow) | columns flex |
| row gap between field rows | 8 | Panel section rhythm (8) | not captured (Figma's split view not measured) |
| caption | 12/16 muted, 6 above | PanelRow caption | Figma 9/14 is compact density |
| toggle | ghost neutral icon-only Button, `selected` (aria-pressed) when split, in the trailing square of the first row | Figma ghost 24 square in the action column | — |
| linked sides | Horizontal (left + right) · Vertical (top + bottom) | Figma help: vertical and horizontal by default | order horizontal first, as Figma's W/H and X/Y |
| split sides | Left · Top over Right · Bottom | each axis keeps its column when it splits | **unverified against Figma's split view** |
| linked corners | one field across both columns | Figma: one Corner radius value | Figma's field is one column beside Opacity; standalone it has no neighbour |
| split corners | TL · TR over BL · BR (where they sit on the box) | spatial | Figma's panel layout not measured |
| mixed | a linked field whose parts differ shows "Mixed" (NumberField `mixed`) | Figma Mixed | — |
| glyphs | `padding-axis` (rotated for vertical), `padding-side` (rotated per side), `corner` (rotated per corner), `sides` and `corners` toggles | Area vocabulary (`padding-horizontal`, `corner-*`, `corners`), drawn in the pilot construction | Package glyphs are stroked paths; rotation replaces four drawings |
| form value | hidden input with the CSS shorthand, `t r b l` | — | — |

Inset equations: each field is a NumberField (its own equations, number-field.md); the toggle
is Button icon-only at the same size, centred in a square the control's height.

## States

| State | Change | Evidence |
|---|---|---|
| split | toggle pressed (Button selected fill); four fields | Figma Individual padding |
| mixed | linked field empty with "Mixed" placeholder | Figma |
| disabled | every field and the toggle disabled | NumberField, Button |

## Behavior and accessibility

`role="group"` named by the caption (or a visually hidden caption with `hideLabel`). Each
field is named by part and property ("Left padding", "Top left corner radius"); the toggle
is "Individual padding per side" / "Individual corner radius per corner" with `aria-pressed`.
Focus stays on the toggle when it splits or joins. Tab order follows the grid: row 1, the
toggle, row 2. Editing a linked field writes every part it covers and calls
`onValueChange(value, event)`. NumberField Escape now
claims the key only while an edit is in progress, so a second Escape closes a surrounding
popover or dialog (it used to swallow every Escape).

Recipe: padding appears in Layout once the frame has a flow, and splits in place (Figma).
Corner radius keeps Figma's one field beside Opacity; its Independent corners button opens a
Popover holding a split, toggle-less BoxField, sharing the value, so the row shows Mixed when
the corners differ.

## Visual pass

2026-09-28, Claude in Chrome (batch 8): Figma's Padding row and Opacity / Corner radius row
(`../research/captures/inspector/figma--padding-row`, `figma--opacity-radius-row`) beside the gallery's
Box field tiles and the Panel recipe at 2x.

- Same structure: a label line, two equal fields with the padding-axis (or corner) glyph in the
  leading slot, and the per-side toggle as a square on the row's action column (Figma 24 at 208 in a
  240 panel; Area 28 on the action column).
- Figma's padding glyphs are its horizontal / vertical padding marks; Area's package glyphs draw the
  same two marks at the same weight as the field text.
- The rows sit in the section rhythm that Panel's batch 8 change fixed (rule midway between the last
  field and the next title).
- No change. Dark theme not compared.

## Verification

- Headless Edge with real mouse and keys (`scratchpad/boxfield.mjs`): typing 40 in
  Horizontal then splitting gives Left 40, Right 40; the toggle turns `aria-pressed` true and
  keeps focus; Tab order Left, Top, toggle, Right, Bottom; the recipe popover opens with focus
  on Top left, 20 + Enter updates it and the row reads Mixed; Escape closes and returns focus
  to Independent corners.
- React tests: linked/split/mixed sides, corners, hidden form value.
- Icon lint ok (five new glyphs).
- Unverified: dark theme; screen reader output; RTL (left/right are physical here, as padding
  values are); Figma's split layouts (needs opening the panels in the owner's file).

## Open questions

- May I open Figma's Independent corners panel and a frame's Individual padding (view-only
  panels, no value changed) to measure the split layouts?
- CSS shorthand entry in a linked field.

## Feedback log

- 2026-09-28 · batch 8 Claude in Chrome side by side (Figma padding and radius rows) → no change →
  `inspector/figma--padding-row`, `inspector/figma--opacity-radius-row`.
- 2026-09-28 · inside a panel the label, its gap and the field gap follow the panel tier (`--_panel-*`).
- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → `readOnly` added (fields read-only, linked toggle unavailable); `variant` is typed from NumberField's and passed to each field (a composition prop, not a CSS axis); `onValueChange(value, event)`.
