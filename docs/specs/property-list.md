# PropertyList spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-26 (pass 1: built))
**Captures:** `docs/research/captures/inspector/figma--design-panel-frame--rest--light.json`
(the fill row inside the Design panel capture)
**Peers:** Panel (PanelSection actions, PanelRow's action column), ColorField, Button

## Owner decisions

- 2026-09-23 (COMPONENTS.md, inspector item 6): reorderable property lists; fill, stroke and
  effect rows combine a value editor with visibility, add/remove and reorder actions.
- 2026-09-26: "continue building the next component" after the Figma panel recipe.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

An ordered list of like properties (fills, strokes, effects, shadows) that the user reorders.
It owns order, the drag handle, keyboard moves, the move announcement and the row layout.
The value editor and the row's buttons (visibility, remove) are the consumer's, like icons
everywhere in Area. Not TreeView (hierarchy), not Menu (commands), not PanelRow (one property).

## Sources

| Id | Type | What | Evidence |
|---|---|---|---|
| figma | target product | Fill row in the Design panel (one fill) | Panel capture: row 240 × 32, 24px controls; field 16–172 (swatch 14px, 5 in; hex; opacity %); visibility toggle at 180, Remove at 208, both 24px |
| figma | target product | Reorder | Figma shows a drag handle only when a list holds more than one item. This file's layers have one fill each, and adding fills would change the file, so the handle was not captured |

## Decisions

| Slot | Area value | Basis |
|---|---|---|
| row | value, then the row's buttons: value ends 8 before the first button, buttons 4 apart, the last on the content edge | Figma: field to 172, eye 180, remove 208 (8, then 4) |
| rows | 8 apart | Panel section gap; Figma rows pitch 32 around 24px controls |
| handle | fills the panel's side inset, glyph (16 slot, new `grip`: two 5px bars) centred; shown on hover, focus or drag; always shown on touch; only when `onReorder` is set and there are two or more items | Figma: reorder handle in the margin, only with more than one item |
| drag | pointer capture on the handle; the moving row stays in place at 40%; a 2px focus-colored line marks the landing gap; no line beside the row's own position; Escape cancels | Common sortable-list pattern (Figma, Framer layer rows) |
| keyboard | the handle is a button: ArrowUp/Down move one place, Home/End to the ends; focus stays on the moved row's handle; the move is announced ("00A797 fill moved to position 1 of 3") | WAI live-region announcement; keyboard parity with the pointer |
| inactive | `inactive` dims the value to 50%; the buttons stay full strength so the row can be turned back on | Figma dims hidden fills |
| names | each item's `label` names its handle ("Reorder 00A797 fill, position 2 of 3") | Labels should name content, not index, since index changes on move |

## Verification

Headless Edge with real mouse and key events (`scratchpad/plist.mjs`): dragging the third fill
to the top showed the drop line and reordered [0055FF, FFB800, 00A797] → [00A797, 0055FF,
FFB800] with the announcement; ArrowDown and End moved it and kept focus on its handle. React
tests cover the markup. Screenshots at 3× (hover and mid-drag) sent in chat.

Unverified: touch drag on a device; screen reader output of the live region; dark theme.

## Open questions

- A small panel's side inset is 8px (gutter-sm), so the handle's ink sits 1.5px from the
  value. The demos use a medium panel (12px inset). Options: a 12px minimum inset for panels
  with reorderable lists, or the compact-density inspector adopting Figma's 16.
- Nesting (effects with sub-settings popovers) and multi-select are out of scope.
