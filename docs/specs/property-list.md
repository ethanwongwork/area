# PropertyList spec

**Status:** accepted · 2026-09-26; batch 9 tiles refined 2026-09-28
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
| drag | pointer capture on the handle; the moving row stays in place at 40%; a 2px neutral-ink line (`fg-default`) marks the landing gap (was the focus colour; neutral per the cohesion audit, 2026-09-27); no line beside the row's own position; Escape cancels | Common sortable-list pattern (Figma, Framer layer rows) |
| keyboard | the handle is a button: ArrowUp/Down move one place, Home/End to the ends; focus stays on the moved row's handle; the move is announced ("00A797 fill moved to position 1 of 3") | WAI live-region announcement; keyboard parity with the pointer |
| inactive | `inactive` dims the value to 50%; the buttons stay full strength so the row can be turned back on | Figma dims hidden fills |
| names | the list is named by `aria-label` ("Fills"; `label` on the list is a deprecated alias); each item's `label` names its handle ("Reorder 00A797 fill, position 2 of 3") | Labels should name content, not index, since index changes on move |

## Visual pass

2026-09-28 (batch 9, owner screenshots: clipped hex, wrapped effect names): the gallery's Fills, One
item and Effects tiles take the Figma recipe's 280px panel. At default density (14px text) a 240
panel's value column (146) cannot hold a six-digit hex beside its opacity, nor "Inner shadow" beside
its icon; the default panel stays 240 (owner, 2026-09-27) and compact density returns inspector
panels to Figma's 240. With the Color field and Select fixes, every row shows its whole value.

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

## Feedback log

- 2026-09-28 · owner: truncation in this batch → inspector tiles at 280, Color field and Select fixes
  → no clipped value in the gallery.
- 2026-09-28 · owner: approved (batch 9).
- 2026-09-28 · inside a panel, items are a row gap apart and values a field gap from their actions (`--_panel-*`).
- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → the list is named by `aria-label` (`label` on the list is a deprecated alias); an item's `label` still names its handle.
- 2026-10-01 · compact pass round 6 → standalone gaps 8 → 6 at compact; inside a Panel it reads the Panel's gaps. docs/research/compact-pass-2026-10-01.md.
