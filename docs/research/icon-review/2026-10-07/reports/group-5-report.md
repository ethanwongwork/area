# Group 5 report (design, data: 57 icons)

I looked at every icon in the group, outline and filled, at 16, 24, 32, 48 and 96 (sheets o1–o8, r1 and o8 in `groups/group-5/`). The references I compared against were Phosphor pen-nib, Lucide pen-tool, waypoints, activity and chart-scatter, and Fluent lasso and hand_right. I recomputed geometry where a join looked doubtful (`gauge2.mjs`). The original sources are backed up in `groups/group-5/orig/`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| stroke-weight | **Both styles, every size.** The ink box was 11 × 11, so the lint flagged it 2 under its square keyline, and it read small beside align-left and padding. The bars are solids with no stroke, so their edges are true ink edges. Edges at y 2.5 / 3.5 / 10.5 / 13.5 split pixels at 1×, so the 1px bar rendered as two grey rows. | The bars now run 2–14, at y 2–3, 6–8 and 11–14 (still 1, 2 and 3 tall, fully round ends). Every edge lands on a whole pixel, the two gaps are an equal 3 (open), and the ink box is 12 × 12, centred at 8,8. Filled still equals the outline. | Lint is clean (12 × 12, gaps 3 / 8 / 3 open). Slivers at 16 and 48: none. Checked before and after (`group-5-after-1.png`). |
| pen-tool | **Outline, mostly visible at 48–96.** The nib's two top corners and two shoulders were hard polygon corners, unlike the pen family's r 0.5 shoulders (writing tool, 2026-10-05) and the rule that only sharp-by-nature points stay sharp. | Fillets: r 0.5 on the top corners (6.5,2 and 9.5,2) and on the shoulders (3,8 and 13,8). The tip at 8,14 stays sharp, since a nib point is sharp by nature (80°, above the acute floor). New path: `M6.787 2L9.213 2A0.5 0.5 0 0 1 9.645 2.248L12.823 7.697A0.5 0.5 0 0 1 12.776 8.269L8 14L3.224 8.269A0.5 0.5 0 0 1 3.177 7.697L6.355 2.248A0.5 0.5 0 0 1 6.787 2Z` (from `icon-geometry fillet`). The eye, the slit and the filled roles are unchanged. Ink is now 10.9 × 13.12, centred 8,8. | Lint is clean (gaps 1.44 tight; counters 2.97 and 1.88, as before). Slivers at 16 and 48: none. Checked before and after (`group-5-after-1.png`). |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| waypoints | Spread the diamond to ±5 (rings at 8,3 / 3,8 / 13,8 / 8,13) with r 1.25 rings, on the circle keyline. The links stay on the lattice (x + y = 11 and 21). | The audit has it at −14% size and +31% density. The ±4 diamond with r 1.5 rings crowds at 16, and Lucide (the owner's pick) is spread wider. ±4.5 would put the links off the lattice (x + y = 11.5). ±5 with r 1.5 rings goes past every keyline. The catch: r 1.25 is smaller than the r 1.5 nodes in spline and git, so the owner should choose. | `groups/group-5/cand-waypoints-wide.svg` (rendered in `group-5-proposals.png` beside the current drawing and info's ring) |
| gap | Move the bracket verticals from x 5 / 11 to x 4.5 / 11.5 with r 1 corners (`M2.5 2.5H3.5A1 1 0 0 1 4.5 3.5V12.5A1 1 0 0 1 3.5 13.5H2.5`, mirrored). | The verticals sit on whole pixels, so they smear across two columns at 1×, and the pair is symmetric, so x.5 is available. The cost: the dot's gap grows from tight 1.44 to standard 1.94, and the bracket arms get shorter. Low priority; the owner hasn't flagged it. | `groups/group-5/cand-gap-x5.svg` (in `group-5-proposals.png`) |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| none | — | Every shared part in the group matches its base: corners' frame in group and corners-sparkle, the 0.56 sparkle, the minus in subtract, grid in flow-wrap, padding-sides in padding-axis, chart's axis in all five charts, the r 6 ring, the 1.5 / 3 check, and the ⌀2 / ⌀1.5 dots. | — |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| activity | Lucide, with sharper peaks at the top and bottom, less rounded | Holds. Sharp 43° peak and trough (`data-acute="sharp"`), r 1 shoulders tangent to the slopes (checked), point-symmetric about 8,8. |
| chart-scatter | Lucide, a better scatter of dots | Holds. Lucide's five ⌀2 dots on whole centres, none in a row. Chart's sharp axes. |
| hand | fix: negative space, stroke and visual errors (filled) | Holds. Filled is Fluent hand_right's cut: four finger columns with their tips at the outline's tip heights, and U notches. The silhouette's extremes match the outline. No sliver. |
| lasso | Fluent, but no dotted line; then: the loop should be more circular and round | Holds. Solid r 5 circular loop. The arc-to-curve and knot joins are tangent (checked); the eye's left tip is the knot's intended crossing point. |
| waypoints | Lucide | Holds as drawn. There is an optional size proposal above. |

## Checked, no change
pointer, mouse-pointer-click, hand, lasso, frame, crop, spline, line, ruler, align-left, align-center, distribute-horizontal, auto-layout, flow, flow-wrap, flow-free, gap, padding, padding-sides, padding-side, padding-axis, sides, corner, corners, corners-sparkle, angle, aspect-ratio, flip, opacity, blur, shadow, mask, boolean-union, boolean-subtract, boolean-intersect, boolean-exclude, subtract, group, ungroup, bring-to-front, send-to-back, layers, square-dashed, token, chart, bar-chart, chart-bar-horizontal, pie-chart, chart-scatter, chart-gantt, activity, gauge, radar, network, waypoints

Notes on icons I checked closely:
- **corner** is 2.88 under its keyline. That is the owner's batch 4, round 1 decision ("corner arms too long" → span 9), so I kept it.
- **gauge:** I recomputed the needle. The sides are tangent to the hub (r 1.25 at 8, 11) and the tip (r 0.5625) within 0.12°. The arc's break leaves 1.34 / 1.37 on either side of the tip.
- **flow** centres at 8.25 because its arrowhead sits on the lattice (pointed shape, within the 0.25 allowance).
- **flow-free** has boxes on whole-pixel edges (y 4, x 4). Moving them to x.5 turns the diagonal box gap into a near miss (1.118), so I kept them as drawn.
- **group** filling as one solid is the newest record (spec line 2873, which supersedes line 2525's layer cut).
- **hand** centres at 7.86, 7.75. A 0.5 shift would miss by the same amount the other way, so I left it.
- **pointer / mouse-pointer-click** carry the recorded diagonal centre offsets.

## Rules or docs that should change
- **Parts-drift pairs by name prefix, and four of the group's ⚠ hits are false.** mouse-pointer-click is not built on mouse (a computer mouse), pen-tool is not built on pen (a writing pen), send-to-back is not built on send (a paper plane), and flow-free is a scatter of flow's boxes, not flow. padding-side's 20% comes only from its single bar. The drift audit should use declared bases (or `embedded.mjs`), not name prefixes.
- **Solid exceptions (stroke-weight, shadow's band, the booleans' solids):** the skill's pixel-grid rule talks about strokes at x.5. A solid has no stroke, so its edges are ink edges and are crisp at 1× on whole pixels, not on x.5. The skill should say this. stroke-weight now follows it; shadow's band (12.5–14) still has a half-pixel edge and could be looked at in the solid-exception audit.
- **Spec record for stroke-weight** (line 1938, "bars 2.5–13.5 … open 2.5 apart") is stale after this change. It should read: bars 2–14 at y 2–3, 6–8, 11–14, open 3 apart, every edge on a whole pixel, 12 × 12. **pen-tool** (line 1728) should add: "r 0.5 top corners and shoulders, sharp tip".
- **auto-layout's spec line** (725, "r 1.5") and **square-dashed's** (617, "1.5 arms … 3px dashes") describe older drawings. The sources use r 1 boxes, and 0.5 + r 1.5 corners with 2px dashes. The records should be updated to match the sources (no visual change).
