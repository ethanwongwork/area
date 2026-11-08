# Resizable panel spec

**Captures:** `docs/research/captures/resizable/`
**Peers:** Panel (the container; `flush` docking), Slider (value semantics), focus ring

## Owner decisions

- 2026-09-23 (COMPONENTS.md, inspector foundation item 6): "a resizable panel".
- 2026-09-26: "move on to the next component".
- 2026-11-07: components audit, "Take all recs" (N6 Splitter): the edge takes Splitter's handle paint and a double-click
  puts `defaultWidth` back.

## Job and boundaries

A panel docked beside a canvas or page can be made wider or narrower from one edge, by
pointer or keyboard, within limits. It is a Panel option (`resizable`), not a new container.
Not a general split layout (two resizable regions sharing a separator): that is
[Splitter](splitter.md) (2026-11-07); the separator here only sizes its own panel. The two share one handle paint
(splitter.css), so an edge looks and behaves the same wherever it is.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| edge | start | a panel docked at the end of the page (inspector) | Figma design panel: handle on its left edge |
| edge | end | a panel docked at the start (sidebar) | Figma layers panel, Notion sidebar: handle on the right edge |
| limits | min / max width | Figma 241–500 (design), 240–443 (layers) | both |
| state | rest, hover, dragging, focus-visible, at min, at max | captured / source | Figma, Notion; the editor's sashes (hover and dragging paint) |

Excluded: collapse-to-zero on Enter (neither product showed it without changing the owner's layout); vertical (height)
resizing. A double-click puts `defaultWidth` back (the editor's `onEqualize`, Splitter's reset, 2026-11-07).

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| figma | target product (primary for inspectors) | Design panel's resize handle, rest / hover / focus-visible | figma.com, community-file copy in Drafts, 2026-09-26; nothing dragged | `figma--properties-panel-resize--{rest,hover,focus-visible}--light` |
| notion | target product | Sidebar resize handle and sidebar edge, rest / hover | app.notion.com, 2026-09-26; nothing dragged | `notion--sidebar-resize--{rest,hover}--light`, `notion--sidebar-edge--{rest,hover}--light` |
| wai | pattern | Window Splitter: `role="separator"`, focusable, `aria-valuenow/min/max`, `aria-controls`, arrow keys, Home/End | w3.org/WAI/ARIA/apg/patterns/windowsplitter/ | — |

ChatGPT's sidebar is not resizable. Dragging was not tested in either product: a drag saves a
new panel width to the owner's layout.

## Measurements

```
                         Figma (design panel)              Notion (sidebar)
element                  div role=slider, tabindex 0        div role=separator, tabindex 0
name / value             "Resize handle"; valuenow 241,      aria-label (redacted); valuenow 0,
                         min 241, max 500, text "241         min 0, max 100, orientation vertical
                         pixels (min)", orientation horiz.
hit area                 8 wide, full height; 6 outside      12 wide, full height; 1 inside the
                         the panel's edge, 2 inside           edge, 11 outside
cursor                   w-resize at its minimum (only      col-resize
                         way to go); e-resize on the
                         layers panel at its minimum
hover                    cursor only (no paint)             sidebar edge: inset 1px rgb(240,239,237)
                                                            → inset 2px rgba(28,19,1,0.11)
focus-visible            ::before 4 × 50% of the edge,      outline 0 (no indicator found)
                         radius 9999, rgb(13,153,255),
                         centred in the handle
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| role | `separator` (window splitter), `aria-orientation="vertical"`, `aria-controls` the panel | WAI; Notion | Figma uses `slider`; the WAI pattern is the one written for this job |
| name / value | "Resize {panel}"; valuenow = width in px; valuetext "N pixels", "(minimum)" / "(maximum)" at a limit | Figma's px value and "(min)" | Notion's 0–100 says nothing about the width |
| hit area | 8 wide, 6 outside the edge, 2 inside, full height | Figma | primary product for inspectors |
| hover | after the pointer rests 300 ms, a 2 line over the seam and the pixel outside it, in `border-hover` (the shared handle paint) | the editor's sash (`workbench.sash.hoverDelay` 300, `:hover::before{width:2px}`); Notion's darker 2px edge | Was cursor only (Figma) until 2026-11-07: the audit found an edge you can't see until you press it; the wait keeps passing over it from flashing |
| dragging | a 2 line in `accent-indicator`, at once | the editor's sash (`[data-resizing]::before` in its accent) | — |
| double-click | `defaultWidth` back, when given | the editor's `onEqualize`; Splitter | — |
| cursor | `ew-resize`; at a limit the one direction left (`w-resize`/`e-resize`, mirrored in RTL) | Figma | Notion `col-resize` |
| focus-visible | 4px pill, 50% of the edge, `--area-focus-color`, centred (the shared handle paint's `::after`; was this edge's own `::before`) | Figma (4, 50%, pill) | Area's focus colour instead of Figma blue |
| limits | min 240, max 500 by default; props | Figma 240/241 and 500 | — |
| keyboard | ←/→ move the edge 8px (Shift 32px), Home/End to min/max, Escape cancels a drag | WAI; Area spacing grid | steps not measured (pressing arrows would resize the owner's panel) |
| docked seam | a `flush` resizable panel keeps a rule on its resize edge | Figma, Notion: a rule on that edge | `flush` otherwise has no border |
| seam counted once | content on the seam's side, the bar's title included, sits the inset (14) from the seam's outside: the side inset less the rule | inset.css (borders counted once) | 2026-10-14: the bar's title sat 15, its rows 14 (desktop Inspector); the bar now takes `--_side-start` / `--_side-end` |
| width | written as `--area-panel-inline-size` (the existing public sizing hook) | Panel | — |

## States

| State | Change | Evidence |
|---|---|---|
| hover | cursor; after 300 ms the 2 line in `border-hover` | the editor's sash |
| dragging | `data-resizing` on the panel (no text selection) and on the edge: the 2 line in the accent | the editor's sash |
| focus-visible | pill | Figma |
| at min / max | directional cursor, "(minimum)" / "(maximum)" | Figma |

## Behavior and accessibility

Pointer: press on the separator, drag; the width follows the pointer and clamps at the
limits; Escape during the drag restores the starting width. Keyboard: the separator is a tab
stop; ←/→ move the edge (the direction follows the edge and writing direction), Shift for 32,
Home/End for the limits. Controlled (`width` + `onWidthChange`) or uncontrolled
(`defaultWidth`, else the rendered width).

## Verification

- Captures: 7 files, fingerprint 091bb143, checksums verified, redacted, no personal content.
- Headless Edge with real events (`scratchpad/resize.mjs`): starts "240 pixels (minimum)" with
  `w-resize`; drag left 60 → 300 (`ew-resize`); far left clamps to 360 "(maximum)",
  `e-resize`; → 352, Shift+→ 320, Home 240, End 360; Escape mid-drag restores 240; the
  sidebar (end edge) drags right to 290; focus-visible draws the pill.
- React test: separator markup, ids, value text; a plain panel is unchanged.
- Unverified: dark theme, RTL drag, touch, screen reader output.

## Open questions

- Hover affordance: settled 2026-11-07, the shared handle paint (above).
- Collapse (Enter) was not observed; left out. A double-click resets to `defaultWidth`.
- `onWidthChange(width)` passes no event, unlike Splitter's `onSizeChange(size, event)` (Governance § 4, known
  deviations).

## Review note, 2026-11-01 (a width the app sets eases)

- **What changed:** a resizable Panel whose width the app changes (not a drag) eases it on `moderate` ease-drawer
  (`inline-size`); while it is dragged (`data-resizing`) it follows the pointer at once, and under reduced motion it
  never animates (MOTION.md, "Panel width").
- **Why:** the desktop app's Sidebar widens to 288 while it holds a section's list (owner, 2026-11-01).
- **Verdict:** awaiting the owner.

## Review note, 2026-11-07 (components audit N6: the shared handle paint)

- **What changed:** the edge shows itself after the pointer rests on it for 300 ms: a 2 line over the seam, then the
  accent while it is dragged. A double-click puts the starting width back. Keyboard focus keeps the 4 pill.
- **Why:** the audit found the edge painted nothing until pressed; Splitter now draws the same handle, from one rule, so
  every resize edge in Area looks and behaves alike.
- **Verdict:** awaiting the owner.

## Feedback log

- 2026-11-07 · components audit N6 → the shared handle paint (splitter.css: 300 ms wait, 2 line in `border-hover`,
  accent while dragging, focus pill moved to `::after`); `onDoubleClick` resets to `defaultWidth` (primitives.tsx).
  Cohesion test "every resize edge shares one handle paint".
