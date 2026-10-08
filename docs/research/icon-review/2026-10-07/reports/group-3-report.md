# Group 3 report

Group: layout, edit, draw, shapes (58 icons). I checked every icon in outline and filled at 16 / 24 / 32 / 48 and at 96, and looked at unpin and link-off again at 256. Sheets are in `groups/group-3/` (`l1`, `l2`, `e1`, `e2`, `d1`, `d2`, `s1`, `s2` are the overview; `z1` is the 256 zoom). Originals of the changed sources are in `groups/group-3/orig/`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| compose | Both styles, at every size. The box's two open ends were uneven: the top ended at x 8 (half of the side) and the right at y 9 (0.41). This was left over from the older Phosphor pencil on x + y = 16.5. The slim pen now lies on x + y = 16, which is the box's own mirror line, so the gaps to the pen were 1.70 at the top and 2.41 at the right (2.41 is a near miss) | Right end `V9` → `V8`. The icon is now mirror-symmetric about the pen's axis, Lucide's square-pen construction. Both gaps are 1.70 tight | lint ok, ink 12.12² centred; slivers none at 16 and 48; before/after `group-3-after-1.png` |
| split | Both styles. Ink was 11.12², 1.88 under the square keyline (lint ⚠, optical −18%). The corner heads' legs were on whole pixels (x 3, 13; y 3), so they blurred at 1× | Tips moved to the keyline corners, matching expand's corner heads: `M8 13.5V8L2.5 2.5M8 8L13.5 2.5`, heads `M2.5 5.5V2.5H5.5M10.5 2.5H13.5V5.5`. Legs are now on x.5 and the diagonal shaft is 7.78 (≥ 7.5 for the 3 head). Construction kept (a stem forking at 45° into two 3px corner heads) | lint ok, ink 12.12² centred, no keyline warning; slivers none; `group-3-after-1.png` |
| scissors | Both styles. The ink centre was 7.75, 8 (12.62 wide; no recorded optical offset). The blade tips stopped 0.5 short of the rings' extent | Blades run to 14: `M5.414 5.414L14 14M5.414 10.586L14 2` (lattice unchanged, x − y = 0 and x + y = 16). Ink is 13.12² centred on 8, 8, and the tips are level with the rings' extremes | lint ok; slivers none; `group-3-after-1.png` |
| replace | Both styles. The handle started at 10.5, 10.5, only 0.03 outside the r 4.92 lens's centre line, so its cap reached the lens's inner edge. The spec says replace uses search's handle, but search's handle starts at 10.75 (owner 2026-10-03: "starts clear of the lens") | Handle `M10.75 10.75L14 14`, search's handle exactly. The cap now ends inside the ring's ink | lint ok; slivers none; `group-3-after-2.png` |
| clipboard-check | Both styles. The 2 / 4 check sat 0.75 low in the free interior under the clip (centre 10 against 9.25), with gaps of 2.38 above and 0.88 below. The rule is centred in the free interior, and desktop-check's same check was centred on 2026-10-06 | Check `M5 9L7 11L11 7` (1 up, on the lattice). Gaps are now 1.68 tight to the clip and 1.88 to the foot. Filled: a plain knockout | lint ok; slivers none; `group-3-after-2.png` |
| clipboard-list | Both styles, the same fault as clipboard-check: the list sat low (2.69 above, 1.19 below) | Dots and lines 1 up, to y 7.5 and 10.5 (still x.5): dots `cy` 7.5 / 10.5, lines `M8 7.5H10.5M8 10.5H10.5`. The gaps are now 1.69 / 2.19, the clipboard family centres its content one way, and the owner's dot-and-line design is kept | lint ok; slivers none; `group-3-after-2.png` |
| paint-bucket | Both styles. The ink centre was 7.65, 7.59, 0.35 / 0.41 off with no recorded reason, and the level line was on a whole pixel (y 8) | The whole drawing moved (+0.5, +0.5), which keeps the lattice (x + y shifts by 1, x − y is unchanged). The level line is at y 8.5 (crisp) and the ink centre is 8.15, 8.09. The bucket body is now centred at 7.5, 8. Every part and every gap (1.24 / 1.88 / 1.7) is unchanged | lint ok; slivers none; `group-3-after-2.png` |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| link (and link-off with it) | Move the link 0.5 up so the brackets run 4.5–10.5 and the bar sits at 7.5 (`M6.5 4.5H5A3 3 0 0 0 5 10.5H6.5`, its mirror, `M6 7.5H10`) | All three horizontal strokes are on whole pixels (5, 8, 11) and blur at 1×. This is the owner's three-line-stack rule ("crisp at 1× outweighs centring", text-align and menu), applied by analogy. link-off would follow, with its filled stroke pieces re-cut. That is an owner call because the rule as written names stacks only | `groups/group-3/cand-link-high.svg`, sheet `groups/group-3/proposals.png` |
| diamond | Vertices at ±7 (8, 1 · 15, 8 · 8, 15 · 1, 8) with r 1.5 fillets, the shapes radius. Ink 13.88, on the lattice, inside the live area | It is 1.7 under the circle keyline (lint ⚠, optical −15%) and reads smaller than octagon and hexagon beside it. The spec records the current size as Figma's instance, so the change is the owner's to make | `groups/group-3/cand-diamond-large.svg`, `proposals.png` |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| search's handle (search is outside group 3) | replace (fixed in group 3) | replace had drifted from search's handle start. Check other users of search's lens: file-search's handle is recorded as 12, 12 from its r 2 lens, so it is fine | none |

## Owner notes in this group: status
| icon | note | status |
|---|---|---|
| attach | replace → Phosphor | holds (Phosphor's nested paperclip, wires 2.12 apart) |
| blocks | replace → Lucide | holds (Lucide's L of three cells plus an offset fourth; whole pixels so it centres on 8) |
| clipboard-check | connecting stroke at the bottom of the arrow | holds (a plain check, no stroke joins it). The check is now also centred (fixed now) |
| clipboard-list | replace → Lucide; fix the clip filled; keep the dot and lines | holds: the clip is a ring meeting the filled board, and dots and lines are kept. The list is now centred (fixed now) |
| clipboard-paste | the clipboard filled and the layer on top unfilled | holds |
| clipboard | clip consistently sized; no negative space round the clip (apply to others) | holds in all four clipboards (one 5 × 3 r 1 clip, which meets the filled board) |
| compose | Phosphor pencil design; pencil too fat | holds (the slim 2.12 pen). The box's ends are now symmetric (fixed now) |
| eraser | stroke into the eraser; Lucide, then Fluent's proportions | holds (Fluent's proportions, 2026-10-05) |
| octagon | make all the sides more equal | holds (sides 5 / 4.95) |
| paint-bucket | Lucide's rounded-bottom, more rectangular bucket | holds. Now centred (fixed now) |
| palette | smooth bottom-right indent (Lucide) | holds (checked analytically: all five segments are tangent-continuous) |
| pencil-off | add the eraser back | holds (the band is present; a cut when filled) |
| pencil | tip sharper | holds (60° tip) |
| picture-in-picture | replace → Lucide | holds |
| pushpin | upright; more detail (Lucide) | holds |
| shapes | replace → Lucide | holds |
| signature | use the pen, then add the clip | holds |
| stack-frame | arrow short; shorter arrow ends | holds (2 head on a 5 shaft; 7.75 centre recorded) |
| trash | wider base and wider handle (Phosphor) | holds (body 4–12, handle 6–10, as recorded) |
| unpin | filled: visual / negative-space error | holds as recorded: the far-side cut follows the slash gap at every size, and no slivers are found at 16 or 48 |

## Checked, no change
app-window, layout, layout-dashboard, panel-left, panel-bottom, panel-left-close, panel-left-open, columns, grid, grid-plus, blocks, kanban, cards, table, picture-in-picture, stack-frame, copy, copy-check, duplicate, clipboard, clipboard-paste, save, trash, attach, link, link-off, pushpin, unpin, merge, pencil, pencil-off, pen, signature, highlighter, eraser, paintbrush, eyedropper, palette, color, contrast, wand, shapes, rectangle, ellipse, polygon, pentagon, hexagon, octagon, diamond, cube, cube-wireframe

Notes on these (kept by record or by the lattice):
- merge: its shaft is 7 for a 3 head (the class says ≥ 7.5). No lattice position lengthens it while keeping the icon on the keyline.
- split and merge now differ in width by 1 (11 against 10). Merge cannot widen on the lattice inside the keyline.
- Whole-pixel edges forced by centring or a recorded construction: save's shutter and label, trash's body and handle, highlighter's cup, paintbrush's top and its right bristle notch, pushpin's head top (a 0.5 shift breaks the keyline or the needle), rectangle / panel / picture-in-picture's frames (13.1 horizontal keyline), clipboard's board.
- Recorded optical offsets: eraser 8.25, pen 8.17, pencil 8.15 / 7.85, stack-frame 7.75, pushpin 8.25.
- kanban's columns are 4 / 3 / 4, as recorded.

## Rules or docs that should change
- The spec's replace record says "search's handle `M10.5 10.5L14 14`", but search's handle is `M10.75 10.75`. The record should read 10.75 (as now drawn).
- The spec's compose record (2026-10-05 pens) doesn't say where the box ends. They should be stated as symmetric about the pen's axis (top at 8, right at 8), because the 3111 record ("top at 8, right at 9") belongs to the old pencil.
- The clipboard family should record that its content (check, list) is centred in the free interior under the clip (centre y 9), as desktop-check's check is.
- The skill could say that a whole (0.5, 0.5) shift keeps the 45° lattice, so diagonal icons that are off centre (paint-bucket) can be recentred without breaking it.
