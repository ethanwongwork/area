# Splitter spec

**Captures:** none taken; the evidence is bundle and source reads in `docs/research/components-audit-2026-11-07/`
(cursor.md, chat-apps.md) and Panel `resizable`'s captures (`docs/research/captures/resizable/`)
**Peers:** Panel `resizable` (the one-edge resize, its keyboard steps and value text; the handle paint is shared), Scroll
area (each region scrolls on its own), the focus ring

## Owner decisions

- 2026-11-07: components audit, "Take all recs": N6 Splitter is built (review page St7jcEipvPoa3GvSwnAvBT). It was a
  Candidate in COMPONENTS.md waiting on captures; the editor's tiling values and a chat app's ResizeHandle completed
  the evidence.

## Job and boundaries

Splitter divides one area between two regions, side by side or stacked, with a handle between them that resizes them
by pointer or keyboard. One region holds the size (`side`), the other takes the rest. It is not Panel `resizable`,
whose edge sizes one panel against the page it is docked to (the panel owns its surface, bar and body); not a Drawer,
which slides a region over the page; and not Tabs, which show one view at a time. It holds exactly two regions: more
regions nest Splitters of the other orientation. It does not collapse a region, dock panels by dropping them on an
edge, or remember a size between sessions (the app keeps `size`).

Intake gates:

- **Useful.** The editor tiles its whole workbench with resizable sashes (`ui-tiling`, `ui-tiling-sash-gap`,
  `.monaco-split-view2`, cursor.md "Splitter / tiling layout"); a chat app ships `ResizeHandle{orientation, side,
  onBorder, onResize, onResizeStart, onResizeEnd, onKeyDown}` (chat-apps.md "Splitter"); the WAI window splitter
  pattern is written for this job. Area's own app has three resizable regions.
- **Unique.** Panel `resizable` sizes one panel from its own edge and draws the panel; it can't divide an area that has
  no panel between two regions, stack them, or size the region after the handle.
- **Composable.** Panel's keyboard steps and value text, the shared handle paint (one rule with Panel's edge), the
  region edge role, the focus colour.
- **Consistent.** The handle is the region edge's 1 line (`edge-regions`, as the app's seams); hover and dragging
  paint as Panel's edge does since 2026-11-07; the focus pill is Panel's.
- **Worth maintaining.** One state (`resizing`), the WAI keyboard contract, one test file and a cohesion test. Not
  built: collapse, docking, a corner handle where two sashes cross (the editor's `.orthogonal-drag-handle`), more than
  two regions.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| orientation | horizontal (default) | Regions side by side, the handle a vertical line: a list beside a detail, a canvas beside an inspector | The editor's sashes; the chat app's `ResizeHandle orientation` |
| orientation | vertical | Regions stacked, the handle across them: an editor over a terminal | The editor's panel stack (`.monaco-pane-view`) |
| side | start (default), end | Which region holds the size when the area grows; the other takes the rest | The chat app's `ResizeHandle side`, `Panel side` |
| size / defaultSize / onSizeChange | controlled or not | The app keeps the size someone chose | The chat app's `Panel width / defaultWidth`; Area's Panel |
| minSize / maxSize | px | The editor's `minPanelSize` 50; Panel's limits | cursor.md |

## Anatomy

```
root     div.area-splitter               owns: flex row (horizontal) or column (vertical); nothing else
  pane   div.area-splitter__pane         owns: overflow auto; the sized one flex 0 0 --area-splitter-size (50% until
                                         measured), the other flex 1
  handle div.area-splitter__handle       owns: role separator; 4 hit area (12 after 300 ms, 20 on touch) laid over the
         [role=separator]                1 line it occupies in the layout (negative margins 1 before, 2 after at 4)
    ::before                             the line: 1 at rest in edge-regions; 2 on hover in border-hover; 2 dragging in
                                         focus-color
    ::after                              the focus pill, 4 × half the edge, focus colour
  pane   div.area-splitter__pane
```

Layout: the two regions and one 1 line share the root's length; the handle's hit area overhangs both regions without
moving them (its negative margins equal its extra width), so growing it from 4 to 12 reflows nothing.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| line in the layout | 1 (`border-width`) | the editor's `sashLayoutSize:1` | — |
| hit area | 4, 1 before the line and 2 after | `sashSize:4`; `"workbench.sash.size":{default:4}` | — |
| hit area after rest | 12, after the pointer rests 300 ms | `sashHoverSize:12`; `"workbench.sash.hoverDelay":{default:300}` | — |
| hit area on touch | 20 (`pointer: coarse`) | `workbench.sash.size` 20 on touch | — |
| rest ink | `edge-regions`, the app's seams | the editor's 1 line in its region border | — |
| hover line | 2, `border-hover`, after the wait | `[:is(:hover,[data-resizing='true'])::before] width:2px; background-color:var(--cursor-stroke-secondary)` | Area's hover edge role for the secondary stroke |
| dragging line | 2, `focus-color`, at once | `[data-resizing='true']::before background-color:var(--cursor-bg-accent)` | The Selection ink (plan B7.5): the indicator rung at Selection Accent, the neutral solid at Neutral; it read the raw accent |
| focus | 4 pill, half the edge, `focus-color` | Panel's (Figma's 4, 50%) | The editor draws none |
| motion | none: the growth and the paint are steps after the wait, never animated (`transition` 0s, delay 300 ms) | the editor's sashes step | Reduced motion has nothing to stop (MOTION.md, Resize edge) |
| cursor | `ew-resize` / `ns-resize`; at a limit the one way left to go (mirrored in RTL); held on the root while dragging | Panel (Figma) | — |
| double-click | `defaultSize` back, else the regions even | the editor's `onEqualize` | — |
| keyboard steps | 8, Shift 32; Home / End to the limits; Enter as a double-click; Escape mid-drag puts the size back | Panel's (Area's spacing grid); WAI | WAI's Enter collapses; Area has no collapse, so Enter resets |
| minimum | 50, and the other region keeps at least the same | the editor's `minPanelSize:50` | — |
| name | `handleLabel`, "Resize" by default; name it for the region | Panel's "Resize {panel}" | — |
| value | `aria-valuenow` the sized region in px, value text "N pixels", "(minimum)" / "(maximum)" | Panel (Figma's px value) | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| resizing (`data-resizing`, on the root and the handle) | the line 2 in the accent; the root holds the resize cursor and stops text selection | the editor's `[data-resizing='true']` |
| at a limit (`data-limit="min"` / `"max"` on the handle) | the directional cursor; "(minimum)" / "(maximum)" in the value text | Panel |

## Behavior and accessibility

The handle is the WAI window splitter: `role="separator"`, focusable, `aria-orientation` across the regions
(vertical between side-by-side regions), `aria-controls` the sized region, `aria-valuenow` / `-min` / `-max` in px and
`aria-valuetext`. Pointer: press and drag; the size follows the pointer exactly and clamps at the limits; the pointer is
captured, so a drag past the window keeps working; Escape during a drag (or a cancelled pointer) puts the starting size
back. Keyboard: Left / Right (Up / Down when stacked) move the handle 8, Shift 32; in RTL the handle follows the arrow
on screen; Home and End go to the limits; Enter evens or resets. `onSizeChange(size, event)` gets the drag, key or
double-click that made the change. The room is measured with a ResizeObserver, from layout lengths (`offsetWidth`, less
the root's border and padding), so the maximum follows the root and a scaled preview doesn't change it. Forced
colours: the line is `CanvasText`, dragging `Highlight`, the pill `Highlight`. No live region: the value is the
separator's own.

Driven in a browser (Visual pass, below); not in Electron, and not on touch.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| editor | product bundle | Tiling sashes: `sashLayoutSize:1, sashSize:4, sashHoverSize:12`, `minPanelSize:50`, `onEqualize`; hover and resizing paint; `workbench.sash.hoverDelay` 300, `workbench.sash.size` 4 (20 on touch); `.monaco-split-view2`, `.monaco-pane-view` | Cursor 3.27.22 app bundle (cursor.md, "Panel", "Splitter / tiling layout", "Resize affordance timing") | evidence only | none |
| chat-app | product bundle | `ResizeHandle{orientation, side, onBorder, onResize, onResizeStart, onResizeEnd, onKeyDown}`, `Panel{side, resizable, width, defaultWidth, minWidth, maxWidth, resizeLabel}` | Claude 4.16336.0 `shared-38-DyF0_Fim.js` (chat-apps.md, "Splitter") | evidence only | none |
| wai | pattern | Window splitter | w3.org/WAI/ARIA/apg/patterns/windowsplitter/ | — | — |
| area | this system | Panel `resizable` | docs/specs/resizable-panel.md | — | `docs/research/captures/resizable/` |

## Measurements

None rendered: the values are the bundles' declared ones (above).

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Panel `resizable` | handle paint | 300 ms wait, 2 line `border-hover`, accent dragging, focus pill | same rule (splitter.css) | Match (cohesion: "every resize edge shares one handle paint") |
| Panel `resizable` | keyboard steps, value text | 8 / 32, "N pixels (minimum)" | same | Match |
| Panel `resizable` | hit area | 8 (Figma), 6 outside and 2 inside | 4, 12 after rest (the editor) | Differs: Panel's is captured from its own reference and kept; a Splitter's handle sits between two regions, so it overhangs both evenly |
| the app's region seams | rest line | `edge-regions` | `edge-regions` | Match |

## Visual pass

Checked in the built renderer in a browser (`desktop-dist`, the app's gallery without Electron; another session owns the
running app), light, type 13: the default tile lays out 144 + 1 + 237 in a 384 frame; the handle is 4 wide over the line
at rest and, after the pointer rested 600 ms, 12 wide with a 2 line in `border-hover` covering the line and the pixel
before it, the regions unmoved; a drag of 50 gave 194 and a double-click put 144 back; Right 152, Shift+Left 120, Home
"50 pixels (minimum)" with `e-resize`, End the maximum, Enter 144; `data-resizing` paints the 2 line in the accent. The
app's own Sidebar and Inspector edges take the same paint, the 2 line on the seam and the pixel outside it. Found and
fixed: the maximum counted the root's border as room (333 for 331). Not done: dark, stacked and RTL drags, touch,
Electron.

## Verification

- `node --test packages/react/tests/splitter.test.mjs`; cohesion's "every resize edge shares one handle paint".
- The pointer, keyboard and hover checks in the Visual pass, by real pointer events and dispatched keys.

## App use

The app's three regions are Panels with `resizable` edges; they keep Panel (each owns its bar and body). Nothing is
swapped.

## Review note, 2026-11-07

- **What changed:** a new family: two regions with a handle between them, side by side or stacked. Its handle and
  Panel's resizable edge are one rule: a 1 line that, after the pointer rests on it for 300 ms, grows its hit area from
  4 to 12 and its line to 2; the accent while it is dragged; a double-click puts the first size back.
- **Why:** you took the audit's recommendation; it was a Candidate waiting on evidence, which the editor's tiling values
  and a chat app's ResizeHandle supplied.

## Feedback log

- 2026-11-07 · built from the components audit (N6); Panel's edge takes the shared paint; Splitter's row removed from
  COMPONENTS.md Candidates.

## Selection paint (plan B7.5), 2026-11-14

- The dragged sash reads `focus-color`, the Selection ink (was `accent-indicator`, blue at Selection Neutral).
