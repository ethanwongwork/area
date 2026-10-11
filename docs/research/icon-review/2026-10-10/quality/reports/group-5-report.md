# Group 5 report (Design tools, Shapes: 61 icons)

I checked all 61 icons one by one, outline and filled, at 16 / 24 / 32 / 48 and at 96 over the grid (look.mjs, eight
overview sheets `o1`–`o8` in the scratchpad's `q5/`). The family checks put each icon beside its base: the pointer
in mouse-pointer-click and square-mouse-pointer, hand in hand-wave, bell-ring's arcs, the corners frame in corners,
corners-sparkle and group, the 4 × 4 r 1 boxes in flow, flow-wrap, flow-free and auto-layout, padding's r 2 frame, the
booleans' 8 × 8 squares, octagon in octagon-alert, and minus in subtract. The references were Lucide slice, Fluent
blur, hand_wave and hand_right, and Phosphor hand-waving.

The pass found one blind spot in the earlier passes: **1× rendering**. All the earlier sheets render at 2×, where
whole-pixel strokes look sharp. To check 1×, I wrote `q5/onex.mjs`, which rasterises each source into a 16 × 16 canvas
at DPR 1 and shows it at 6–8×, pixelated. The sheet is `sheets/group-5-1x-hand-blur-slice.png`.

All 61 icons lint clean, and the 73-icon run includes the rotations and aliases (`gen-pilot-icons --only`, the whole
group). The geometry audit lists only octagon's recorded lattice exception. There are no slivers or islands at 16 or
48 anywhere in the group. The originals are in `<scratchpad>/before-src/`.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| slice | **Both styles, every size: the icon sat 1 px low.** The ink box was 12.04 × 10.04 with its centre at 7.96, **9.04**, leaving the top 4 px of the square keyline empty. The batch-69 drawing kept Lucide's foot position (y 13.5, Lucide's 20/24) but shortened the handle, so the whole knife slid to the bottom. No offset is recorded for it, and Lucide's own slice is centred. | The whole drawing moves (0, −1). This keeps the lattice (the handle edges are now x + y = 15 / 19) and the foot stays on x.5. The paths are `M2.5 12.5L11 4A1.41421 1.41421 0 0 1 13 6L8 11V12A0.5 0.5 0 0 1 7.5 12.5Z`, the heel `M6 9L8 11`, and the filled-only fill `M6 9L11 4A1.41421 1.41421 0 0 1 13 6L8 11Z`. Ink 12.04 × 10.04, centre 7.96, 8.04. The design, the size and the filled treatment are unchanged. | Lint clean (counters 1.88, 1.88). Geometry audit clean. Slivers none at 16 and 48. Looked at it before/after beside Lucide slice (`group-5-after.png`) and at 1×. |
| blur | **Outline and filled, 1×.** The three lines lay on whole pixels at y 5 / 8 / 11, so at 1× each one rendered as two grey rows (the 1× sheet). This is a three-line stack centred on 8, which the owner's 2026-10-02 rule ("three-line stacks centred on 8 move to x.5 and sit 0.5 high: crisp at 1× outweighs centring") covers, but blur (batch 42) was never moved. | The whole icon moves (0, −0.5). The half ring is now centred on 8, 7.5 (`M8 1.5A6 6 0 0 0 8 13.5`, the filled half-disc the same with Z), so its top and bottom extremes sit on x.5. The lines are `M8 4.5H13.196M8 7.5H14M8 10.5H13.196`, still ending on the ring and still a standard 1.88 apart. Ink 13.12 × 13.12, centre 8, 7.5, which is 0.5 high under the stack rule, as text-align is. | Lint clean (gaps 1.88 standard). Geometry audit clean. Slivers none at 16 and 48. Looked at before/after beside Fluent blur and at 1×: the lines are now three solid black rows. |

Before/after sheet: `sheets/group-5-after.png`. 1× evidence: `sheets/group-5-1x-hand-blur-slice.png`.

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| hand | Move the whole hand (−0.5, −0.5), so all five vertical strokes (palm side 5, dividers 7 / 9 / 11, palm side 13) and the four fill columns land on x.5. hand-wave's hand already does this (it moved −0.5, +0.5). | **At 1× the outline hand is a grey blob:** every vertical sits on a whole pixel, so it splits across two 56% columns (see the 1× sheet; the candidate and hand-wave are crisp). The move keeps the thumb's 45° on the lattice. The catch is the ink box: its centre goes from 7.86, 7.75 to 7.36, 7.25. The mass is better centred, though. The silhouette's area centroid is now 8.46, 8.21 (0.46 right, because the palm is on the right and the thumb is thin) and becomes 7.96, 7.71. That is centred across and slightly high, which suits a heavy base. The 2026-10-07 reviewer left hand at 7.86 on ink-box grounds, and the owner reviewed hand three times, so this is the owner's call. Option B is (−0.5, +0.5), hand-wave's hand exactly. It would make hand-wave "hand plus arcs" with no move, but it sits low (centroid 8.71). | `<scratchpad>/q5/cand-hand.svg` (source form). Views: `cand-hand-outline-view.svg`, `cand-hand-filled-view.svg`. Sheet: `sheets/group-5-proposals.png`; 1×: `sheets/group-5-1x-hand-blur-slice.png` |

Not proposed, but noted. Pentagon's base sits on a whole pixel (y 14, grey at 1×). Lifting it 0.5 would make the base
crisp and centre its mass better, since a pentagon's centroid sits 0.63 below its box centre. But the top vertex's arc
would then sit exactly on the 1.5 live-area edge, and the lint rejects that (`centreline at 8,1.5 leaves the 1.5–14.5
drawing area`). I tried it and reverted it.

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| none | — | Every shared part in the group matches its base exactly: mouse-pointer-click's pointer in square-mouse-pointer, hand's three paths in hand-wave (moved −0.5, +0.5 as recorded), bell-ring's arcs in hand-wave (identical path), the corners frame in corners-sparkle and group, the r 1 boxes, padding's frame, the booleans, octagon in octagon-alert (identical), minus in subtract (alias). Nothing outside the group carries slice, blur or pentagon. | — |

**Spec records the coordinator should update** (the spec is shared; I did not edit it):
- **slice** (Batch 69 row): the coordinates move by (0, −1): blade tip 2.5, 12.5, handle x + y = 15 / 19, cap about 12, 5, knuckle 8, 11, foot at 12.5, heel 6, 9 → 8, 11, centred 7.96, 8.04. The row's filled text is also stale. It says "solid with the heel a cut". The source, approved by the owner in `reviews7` on 2026-10-09 after the round-8 filled redraw, fills only the handle (a filled-only `fill` closed along the heel). The blade triangle stays an open outline.
- **blur** (batch 42 row, line 1960): "three lines at 4.5, 7.5 and 10.5; the half ring centred 8, 7.5 (0.5 high, the three-line stack rule)".

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| hand | reviews (2026-10-03) fix, filled: negative space, stroke and visual errors | Holds. Filled is Fluent hand_right's cut: four finger columns at the outline's tip heights and U notches at the divider ends, with no sliver at 16 or 48. Propagated: hand-wave copies all three paths, the filled `fill` included. |
| lasso | reviews: Fluent, no dotted line | Holds. Solid line, no dots. |
| lasso | reviews2: loop more circular and round | Holds. An r 5.5 circle at 8, 7.5 running into the r 1.25 eye and a 45° tail; ink 12.12 × 13.12, centred. |
| shapes | reviews2: replace with Lucide | Holds. Lucide's triangle over a square and a circle, as recorded. The owner approved it in reviews7 on 2026-10-08. |
| octagon | reviews (approve): make all the sides more equal | Holds. The straight runs are 4.17 on the flats and 4.12 on the diagonals (the vertices are a regular octagon's, r 1 fillets). Propagated: octagon-alert uses the identical path. |

The other 56 icons have only approvals and no notes.

## Machine findings triage

- **geometry-audit.txt:** octagon's four diagonals are off the lattice (x − y = ±8.5, x + y = 7.5 / 24.5). This is a recorded exception: the skill names octagon among the lattice exceptions, because a regular octagon with flats on 2 / 14 cannot put its 45° sides on the lattice. No other icon in the group appears.
- **slivers-16.txt, slivers-48.txt, escapes.txt:** nothing for group 5. look.mjs `--slivers` on the changed icons also finds none at 16 or 48.
- **optical-audit.txt:**
  - **slice, −34% size, +55% density.** It is a diagonal shape, which reads small by hull, and its drawing is 12 × 10. The record keeps Lucide's look with a shorter handle so the round cap stays inside the keyline. I fixed its position, not its size. A longer handle would be a redesign of an approved icon.
  - **subtract −69%, line −60%:** line glyphs (subtract is minus's alias).
  - **corner −36%:** the owner's batch 4 decision ("corner arms too long").
  - **pointer −20%, mouse-pointer-click −12%:** diagonal shapes with recorded offsets.
  - **spline, angle, pen-tool:** open line glyphs and a vertical shape, within their class.
  - **diamond −15%:** the 2026-10-07 "diamond larger (±7, r 1.5)" proposal is still open with the owner.
  - **component −14% / +26%:** four separate diamonds, as Figma's.
  - **boolean-exclude, -subtract, -intersect, density +44% to +107%:** solid results, the owner's 2026-10-02 decision.
  - **cube-wireframe +41%:** wireframe edges by nature.
  - **sides, corners, square-dashed, gap, line-style, distribute-horizontal, low density:** open line glyphs.
  - Everything else is within ±11%.
- **parts.txt:**
  - **mouse-pointer-click from mouse, pen-tool from pen, send-to-back from send, flow-free from flow, padding-side from padding:** false positives. The audit pairs icons by name prefix, as the 2026-10-07 report found. These icons are not built on those bases.
  - **flow-wrap 16%:** false. flow-wrap is grid's alias, linted identical.
  - **padding-axis, padding-sides 12%:** false. They hold lines where padding holds a box, by design.
  - **cube-wireframe 0%:** fine.
  - **hand-wave 0%, "moved −0.5, 0.25":** the recorded −0.5, +0.5 move. The y reads 0.25 because the arcs change the ink box.
  - octagon-alert is not in this group (0%, identical octagon).
- **report.txt:** empty when I read it (still running). `gen-pilot-icons --only` on the whole group reports no near misses. The one keyline warning is **corner, 2.88 under** (an owner decision).

## Checked, no change

- **Pointers:** pointer, mouse-pointer-click and square-mouse-pointer are ok. The pointer is copied exactly. The frame end is 1.12 detail from the pointer (behind 2.25). Filled: the pointer fills and the frame stays a line.
- **hand-wave (batch 70)** is ok as delegated. It copies hand exactly, moved (−0.5, +0.5), so it is crisp. bell-ring's arcs are identical, 1.57 / 1.71 tight to the fingers. Fluent and Phosphor tilt the hand and put the arcs on one side. With Area's upright hand there is no room to the right (the pinky's ink ends at 13.06), so arcs at both top corners are the only fit. If the hand proposal is taken as option A, hand-wave keeps its own move.
- **lasso, frame, crop, line, spline, pen-tool** (the nib's r 0.5 corners, sharp tip, slit sawn at the tip) are ok.
- **ruler** is ok. Its rect edges at y 2 / 14 and its ticks at 5 / 8 / 11 are whole pixels, but that is the vertical page convention (document is also 2–14; x.5 edges would leave it 1.88 under the vertical keyline). Filled, the ticks are sawn knockouts.
- **stroke-weight** is ok: solid bars on whole-pixel edges, crisp at 1×.
- **line-style (batch 69)** is ok. Its rows sit at 3.5 / 7.5 / 11.5 (the stack rule). The dashes are square-dashed's 2 / 3. There are five ⌀1.5 dots, tight 1.38 apart, with ink across 1.5–14.5 like the lines. Filled by weight.
- **Align, distribute, auto-layout:** align-left, align-center, distribute-horizontal and auto-layout are ok. The bars are 3 tall, r 1, 3 apart, crisp at 1×. auto-layout's check is the 1.5 / 3 check.
- **Flow:** flow (it centres at 8.25 because of its head, as recorded), flow-wrap (an alias) and flow-free are ok. flow-free's whole-pixel boxes are recorded: x.5 makes a 1.118 near miss.
- **Padding and sides:** gap, padding, padding-sides, padding-side, padding-axis and sides are ok. gap's x.5 bracket proposal from 2026-10-07 is still open. These are frames with line content, so they fill by weight. padding's inner box fills, as a framed figure does.
- **Corners:** corner, corners and corners-sparkle are ok. corners-sparkle uses the frame exactly, and its sparkle is tight 1.7 to the frame.
- **Inspector marks:** angle, aspect-ratio, flip, opacity and mask are ok.
  - aspect-ratio filled: the frame fills and the marks are knockouts (square containers take the ring's marks).
  - flip: the axis sits on x 8 (a mirror, centred by nature).
  - opacity's ⌀1.5 grid dots are on whole centres, as recorded.
- **shadow** is ok. The band is a solid exception. Its inner edge at 12.5 is still a half-pixel ink edge, which the 2026-10-07 report noted. It is soft at 1× but reads as a band; a whole-pixel edge would change the gap to the square (0.94 or 1.94), so it is left for the owner's solid-exception audit.
- **The booleans** (union, subtract, intersect, exclude) and **subtract** (minus's alias) are ok.
- **Arrange:** group, ungroup, bring-to-front, send-to-back, layers and square-dashed are ok. group's inner pair sits on whole pixels because it is point-symmetric about 8, 8; its shared edge must be y 8.
- **Mark shapes:** token is ok. component (batch 69) is ok: four diamonds 8 ± 4 on the lattice, faces 1.70 tight; filled, four solids.
- **Shapes:** shapes, rectangle, ellipse, polygon, pentagon, hexagon, octagon, diamond, cube and cube-wireframe are ok.
  - The regular shapes are exactly regular. pentagon's sides are all 6.498, and hexagon's straight runs are 5.196.
  - rectangle and cube put their sides on 2 / 14, the keyline box (as tablet's body does). octagon's flats on 2 / 14 are the circle keyline's, as the ring's extremes are.
  - shapes' square edge on 2 / 14 belongs to the delegated 2.5 / 3 gap layout.
  - diamond's "larger" proposal is still open.
