# Group 3 report (Layout & panels, Edit & clipboard, Draw & color: 56 icons)

I checked every icon in outline and filled at 16 / 24 / 32 / 48 and 96, using seven overview sheets of eight icons each, and ran the sliver check at 16 and 48 on all of them. Each icon was compared with its family base and siblings: table for the table pair, layout-template, align-center and list-filter for form, git-commit for timeline, square-dashed for text-select, and the pen family for compose and signature. The Lucide reference was used for form. Owner feedback was read from `owner-feedback.json` and the `reviews7` rows. Machine findings came from `quality/machine/`. The lint and `--report` ran on all 56 (lint ok).

Batch 70 in this group is form, table-cells-merge and table-cells-split. Batch 69 is layout-template, timeline, text-select, blend and swatch-book.

Sheets: `quality/sheets/group-3-after.png` (before / after of the two changed icons) and `quality/sheets/group-3-proposals.png` (timeline: current vs the candidate, with git-commit unchanged for comparison; the row labelled "after" is the candidate, which is not applied).

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| form (batch 70) | **Both styles, every size.** It read as the largest square icon in the group. The optical audit measured +13% apparent size against the set median; its square-keyline siblings (table, layout, kanban, layout-template, grid) measure +5–6%. The cause was 12-wide fields (x 2–14), which gave an ink box of 13.12 × 13.12, while every framed square sibling is 12.12 wide (centre-lines 2.5–13.5). The fields' vertical edges also sat on whole pixels (x 2 / 14), so they blurred at 1×. | Fields `x 2.5, width 11` (2.5–13.5, align-center's 11 × 3 r 1 bar, edges on x.5); labels `M2.5 1.5H9.5M2.5 8.5H6.5` (7 and 4 long, Lucide's 10 : 6 at 0.64 / 0.36 of the field). Rows unchanged (1.5 / 3.5–6.5 / 8.5 / 10.5–13.5, 0.5 high by the stack rule). Ink is 12.12 × 13.12, centre 8, 7.5, with gaps 0.88 detail and counters 1.94. Filled: fields solid, labels lines, as before. | lint ok; geometry-audit clean; slivers none at 16 and 48; looked (`group-3-after.png`, and beside table / layout-template / align-center / Lucide form) |
| attach | **Outline and filled (filled by weight), at 1×.** All four 45° wires were off the diagonal lattice: x + y = 12.25 / 15.25 / 18.25 / 21.25 (geometry-audit, 4 hits). `data-angles="free"` hid this from the lint. The wires are 3 apart in x + y (2.12 perpendicular), so all four can sit on whole values at once. The old record's reason for `free` ("spacings of 3 cannot sit on the lattice") belonged to the pre-Phosphor drawing. | The whole drawing moved (−0.125, −0.125), which shifts x + y by −0.25 onto 12 / 15 / 18 / 21: `M13.125 7.875L7.875 13.125A3.182 3.182 0 0 1 3.375 8.625L9.625 2.375A2.121 2.121 0 0 1 12.625 5.375L6.375 11.625A1.061 1.061 0 0 1 4.875 10.125L10.125 4.875`. The shape, radii and spacing are unchanged. `data-angles="free"` was removed, so the lint now guards the lattice (it passes). The ink centre moved from 7.97, 8.03 to 7.85, 7.9, within the skill's 0.25 allowance for staying on the lattice. This was the smallest offset among the shifts that land on the lattice. | lint ok without `free`; geometry-audit clean; slivers none; looked (`group-3-after.png`) |

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| timeline | Move the track and node to x 12.5 (node r 1.5 at 12.5, 8; track `M12.5 2.5V6.5M12.5 9.5V13.5`) and widen the cards to 6 (2.5–8.5). Every clearance stays the same: node to card corners 1.97, channel 1.88. Ink becomes 12.62 × 12.12 with the centre at 8.25, 8. | The track is 8 units of vertical line on a whole pixel (x 12) and the cards' right edges are whole (x 8), so both blur at 1×. git-commit, whose node timeline copies, makes the opposite choice: its line sits on x.5 (7.5) and the ring extremes are whole. The candidate follows git-commit and the owner's "crisp at 1× outweighs centring" (stack rule), and its 6-wide cards sit closer to Fluent's wide timeline cards. It is a proposal because it trades 0.25 of centring on an approved icon; the 10-07 pass treated link's similar trade the same way. | `<scratchpad>/q3/cand-timeline.svg`; `quality/sheets/group-3-proposals.png` |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| spec record (batch 69) | timeline | The record says "Filled: cards and node solid", but the source keeps the node an open ring in filled. That is the round-8 filled fix the owner approved in `reviews7` (2026-10-09). The round-8 README already lists it as open against the git family's solid nodes (git-commit fills its node). | Record: "Filled: cards solid, node stays a ring, track a line". The ring-vs-solid question stays the owner's. |
| spec record (batch 70) | form | Construction line out of date after the fix. | "two 11 × 3 fields (2.5–13.5, r 1, align-center's bar) … labels 2.5–9.5 and 2.5–6.5"; ink 12.12 × 13.12, centre 8, 7.5. |
| spec record (attach, line ~3131 and the older line ~966) | attach | The drawing moved onto the lattice and is no longer `free`. | Add "moved (−0.125, −0.125) so the wires lie on x + y = 12 / 15 / 18 / 21; not free-angle". The older row's "cannot sit on the lattice" is stale. |
| stale `data-angles="free"` (no visual change) | clipboard, clipboard-check | Neither icon has an off-lattice 45° segment: clipboard has none, and clipboard-check's check `M5 9L7 11L11 7` is on the lattice. The attribute only switches off a lint check. Not removed here, to avoid sending two approved icons back into review for a metadata change. | Remove `data-angles="free"` from both when they are next touched. |

There are no shape notes to carry to other groups. The pen family's notes (sharper tip, slim pen, clip) already hold in file-pen and person-pen, the clipboard clip note holds in all four clipboards, and the pushpin note holds in unpin.

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| blocks | replace → Lucide | holds (Lucide's L of three cells and an offset fourth) |
| picture-in-picture | replace → Lucide | holds |
| stack-frame | arrow short; shorter arrow ends | holds (2 head on a 5 shaft; centre 7.75 recorded) |
| clipboard | clip consistently sized; no negative space round the clip, apply to others | holds in clipboard, -check, -list and -paste (one 5 × 3 r 1 clip, meeting the board with no gap) |
| clipboard-check | connecting stroke at the bottom of the check | holds (plain check, centred under the clip since 10-07) |
| clipboard-paste | clipboard filled, the layer on top unfilled? | superseded by the owner's later pick (rounds 15–16: front page fills, board a line; approved in `reviews7`); holds |
| clipboard-list | replace → Lucide; fix the clip filled; keep the dots and lines | holds |
| trash | wider base and handle (Phosphor) | holds (body 3.5–12.5, handle 5.5–10.5) |
| attach | replace → Phosphor | holds. The geometry was moved 0.125 onto the lattice today; the shape is unchanged |
| pushpin | upright; more detail (Lucide) | holds; unpin shares the drawing |
| unpin | filled visual / negative-space error | holds as the owner's round-13 drawing (approved in round 17). The 16px "fill beside a line" at the right flare is the recorded "left as asked" |
| pencil | tip sharper | holds (60° tip, shared by the pen family) |
| pencil-off | add the eraser back | holds (the band is drawn; a cut when filled) |
| compose | Phosphor pencil; pencil too fat | holds (slim 2.12 pen; box ends symmetric, 1.70 both) |
| signature | use the pen; add the clip | holds |
| eraser | stroke into the eraser; Lucide, then Fluent's proportions | holds (the base line starts at the eraser's bottom vertex, 6.5, 13.5) |
| paint-bucket | Lucide's rounded, more rectangular bucket | holds |
| palette | smooth bottom-right indent (Lucide) | holds (⌀2 wells still delegated) |
| layout-template, split, timeline, copy-check, scissors, replace, text-select, eyedropper, blend, swatch-book | approve (`reviews7`) | hold. copy-check's off-lattice check is the owner's restored pre-10-07 check, centred in the front square |
| link, link-off | (10-07 proposal, still open) 0.5 up so the three strokes sit on x.5 | still open; not redrawn |

## Machine findings triage

| finding | icon | triage |
|---|---|---|
| geometry-audit lattice ×4 (x + y = 12.25 … 21.25) | attach | **fixed** (above) |
| geometry-audit lattice ×2 (solid, x + y = 14.5 / 17.5) | compose, signature | recorded exception: the pen axis (file-pen's slim pen) |
| geometry-audit lattice (clip, x − y = 7.5) | pen | recorded exception: the pen axis |
| geometry-audit lattice ×2 (knockout check) | copy-check | recorded owner decision: the check was restored to its pre-10-07 drawing in the 10-08 full review (centred at 6.5, 9.5 in the front square), approved in `reviews7` |
| geometry-audit lattice ×6 (x − y = 1.935 …) | eyedropper | recorded exception (the skill's list) |
| geometry-audit lattice (x + y = 19.5) | swatch-book | recorded construction (batch 69: the middle card's lower edge runs near-tangent into the front card's foot). Whole values fail: x + y = 20 misses the r 2.5 foot (the tangent is at 19.54) and 19 meets it with a 32° kink. Approved |
| geometry-audit subgap 2.23 (filled stroke pieces 2 and 3) | link-off | false positive: the slash and its gap lie between the bar's end (8, 8) and the right bracket's start (9.5, 5), so no air gap between the two pieces is visible |
| slivers-16: fill beside a line, 180 px at 11.7, 8.8 | unpin | recorded owner decision (round 13 drawing, "left as asked", approved round 17) |
| slivers-48 | — | none in this group |
| optical: form +13% | form | **fixed** (now 12.12 wide, as its siblings) |
| optical: pencil −31%, wand −30%, pen −23%, eyedropper −19%, signature −13% | — | diagonal class (they fill their keyline on the diagonal; the hull reads small). Recorded offsets for pencil and pen |
| optical: link −19%, split −12%, merge −10% | — | line glyphs with thin hulls; merge's width is recorded (no lattice place to widen it) |
| optical: contrast density +58%, attach +48% | — | contrast's solid half is a recorded solid exception; attach's three nested wires are the owner's Phosphor pick |
| parts: layout-template / layout-dashboard "from layout" 23–24% | — | false positive (name match; not variants of layout) |
| parts: clipboard-paste from clipboard 15%, grid-plus from grid 15% | — | by design (a pasted page in front; a + in place of the fourth square). The clip and squares are identical |
| parts: table-cells-merge / -split from table 7% | — | by design: the column moved to x 8 (delegated in batch 70) |
| escapes | — | none |

## Checked, no change

- **Layout & panels:** app-window, layout, layout-dashboard, layout-template, panel-left, panel-bottom, panel-left-close, panel-left-open, columns, split, grid, grid-plus, blocks, kanban, cards, table, picture-in-picture and stack-frame are ok. table-cells-merge and table-cells-split are ok: they keep table's 3 / 4 / 4 rows exactly, which follows the family rule. Lucide uses equal rows, but those can't sit on the 0.5 grid, and the symmetric 4 / 3 / 4 alternative makes the merged row the thinnest. Their filled column gaps run out through the edges or meet the row cuts, as table's do.
- **Edit & clipboard:** copy, copy-check, duplicate, clipboard, clipboard-check, clipboard-paste, clipboard-list, scissors, save, trash, link, link-off, pushpin, unpin, merge, replace and text-select are ok. text-select's frame is square-dashed exactly.
- **Draw & color:** pencil, pencil-off, pen, compose, signature, highlighter, eraser, paintbrush, paint-bucket, eyedropper, palette, color, contrast, wand, blend and swatch-book are ok.
- Whole-pixel edges forced by centring or a recorded construction are unchanged: panel and picture-in-picture frames (the 13.1 horizontal keyline), the clipboard board, trash's handle and foot, save's shutter and label, paintbrush's top, highlighter's cup, the table pair's x 8 column (columns' divider), and link's strokes (open proposal). timeline's track is the proposal above.
