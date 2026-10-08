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
| row | value, then the row's buttons: value ends one field gap before the first button (`--_panel-gap`: 8 in a small panel, 12 at md; 8 outside a panel), buttons 4 apart, the last on the content edge (property-list.css:22, 27) | Figma: field to 172, eye 180, remove 208 (8, then 4) |
| rows | the panel's row gap (sm 8, md 12; 8 outside a panel; property-list.css:12) | Panel row gap; Figma rows pitch 32 around 24px controls |
| handle | fills the panel's side inset, glyph (16 slot, new `grip`: two 5px bars) centred; shown on hover, focus or drag; always shown on touch; only when `onReorder` is set and there are two or more items | Figma: reorder handle in the margin, only with more than one item |
| drag | pointer capture on the handle; the moving row stays in place at 40%; a 2px neutral-ink line (`fg-default`) marks the landing gap (was the focus colour; neutral per the cohesion audit, 2026-09-27); no line beside the row's own position; Escape cancels | Common sortable-list pattern (Figma, Framer layer rows) |
| keyboard | the handle is a button: ArrowUp/Down move one place, Home/End to the ends; focus stays on the moved row's handle; the move is announced ("00A797 fill moved to position 1 of 3") | WAI live-region announcement; keyboard parity with the pointer |
| inactive | `inactive` dims the value to 50%; the buttons stay full strength so the row can be turned back on | Figma dims hidden fills |
| names | each item's `label` names its handle ("Reorder 00A797 fill, position 2 of 3") | Labels should name content, not index, since index changes on move |
| list name | a consumer's `aria-label` names the list, else `PropertyList` `label` (PropertyList.tsx:131) | Audit S17: the consumer's attribute wins, as in every Area group |

## Visual pass

2026-09-28 (batch 9, owner screenshots: clipped hex, wrapped effect names): the gallery's Fills, One
item and Effects tiles take the Figma recipe's 280px panel. At default density (14px text) a 240
panel's value column (146) cannot hold a six-digit hex beside its opacity, nor "Inner shadow" beside
its icon; the default panel stays 240 (owner, 2026-09-27) and compact density returns inspector
panels to Figma's 240. With the Color field and Select fixes, every row shows its whole value.
Since audit F-28 B (owner 2026-09-30) the gallery's panels are `size="sm"`, matching the sm
controls inside them (the panel audit rule: controls at the panel's tier). A Panel that hands its
tier to its controls through context is deferred to compact density.

## Verification

Headless Edge with real mouse and key events (`scratchpad/plist.mjs`): dragging the third fill
to the top showed the drop line and reordered [0055FF, FFB800, 00A797] → [00A797, 0055FF,
FFB800] with the announcement; ArrowDown and End moved it and kept focus on its handle. React
tests cover the markup. Screenshots at 3× (hover and mid-drag) sent in chat.

Unverified: touch drag on a device; screen reader output of the live region; dark theme.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified on `/property-list.html` (computed transitions; toggling
`data-dragging` and reading `getAnimations()`).

| Interaction | Before | After |
|---|---|---|
| Reorder handle reveal | opacity fast both ways | instant in on hover, focus or drag; fast ease-out out |
| Lifted row dim (0.4) | snapped both ways | instant on pick-up, fast ease-out back on drop |
| Inactive value dim (0.5) | snapped both ways | instant in, fast out |
| Drop line | moves with the pointer, instant | unchanged |
| Handle focus ring | outline, instant | unchanged |

Crispness: the drop line's offset was `gap / 2` from the measured rects, a half pixel when the
gap is odd. `PropertyList.tsx` now rounds it (`Math.round`).

Open question: rows jump to their new order on drop. A FLIP slide (translate from the old place on
`base` ease-in-out) would read as Figma's. Recommendation: leave for now; Figma's inspector also
reorders without a slide.

## Open questions

- ~~A small panel's side inset is 8px (gutter-sm), so the handle's ink sits 1.5px from the
  value.~~ Settled 2026-09-28: Panel's inset is 12 at sm and 16 at md ([panel.md](panel.md)),
  so the handle has the 12px inset this question asked for.
- Nesting (effects with sub-settings popovers) and multi-select are out of scope.

## Feedback log

- 2026-09-28 · owner: truncation in this batch → inspector tiles at 280, Color field and Select fixes
  → no clipped value in the gallery.
- 2026-09-28 · owner: approved (batch 9).
- 2026-09-28 · inside a panel, items are a row gap apart and values a field gap from their actions (`--_panel-*`).
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → a consumer's `aria-label` wins over `label` on the list (PropertyList.tsx:131; `label` used to override it).
- 2026-10-01 · audit F-28 (owner pick B) → gallery panels are sm, matching their sm controls (were md panels around sm controls); Panel tier context deferred to compact density → apps/docs/src/demos/gallery.tsx:801-808.
- 2026-10-01 · compact pass round 6 → standalone gaps 8 → 6 at compact; inside a Panel it reads the Panel's gaps. docs/research/compact-pass-2026-10-01.md.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → handle appears at once and fades out on fast; lifted and inactive dims land at once and return on fast; drop line rounded to whole pixels.
