# Group 2 report

Group 2 covers status, controls, view and time: 61 icons. I checked every icon one by one, in both outline and filled, at 16 / 24 / 32 / 48 and at 96. I also looked at 200 px for the funnel, mark, bell, clock, eye, gear, hourglass, zoom-fit, timer and calendar families. Every icon's spec record is checked against its source. The whole group lints clean (`--only`, 66 icons including the aliases). Sheets are in `groups/group-2/`: overview `o1`–`o8`, large views `b1`–`b5`, after sheets `group-2-after-1.png` and `group-2-after-2.png`, and the proposal sheet `group-2-proposal-sort-ascending.png`. The original sources of all 61 icons are in `groups/group-2/orig/`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| calendar-check | **Outline and filled, at every size.** The 1.5 / 3 check was off the 45° pixel lattice. Its falling arm (5.5,10 → 7,11.5) has x − y = −4.5, and its rising arm has x + y = 18.5. At 1× it blurs across rows. A stale `data-angles="free"` hid this from the lint; the icon has no free angle. The check also sat 0.25 left of the interior's centre, unlike its siblings: document-check `M6 10L7.5 11.5L10.5 8.5` and folder-check `M6 9L7.5 10.5L10.5 7.5`. | Check `M5.5 10L7 11.5L10 8.5` → `M6 10L7.5 11.5L10.5 8.5`, which is document-check's check exactly. The arms are on the lattice (−4 / 19), and the box is centred at 8.25, 10, the same placement as its siblings. Removed `data-angles="free"`, so the lattice lint guards the icon again. The gaps are unchanged: 0.88 detail to the header and to the bottom, 1.88 to the right side. | Lint ok without `free`. Slivers none at 16 and 48. Checked before/after (`group-2-after-1.png`) and beside document-check and folder-check (`group-2-after-2.png`). |
| circle-dot-dashed | **Outline and filled, at 24 px and above.** A stale `data-dot="free"` was left from when the centre dot was ⌀3. On 2026-10-02 the dot became the ⌀2 centre-point dot, but `free` stops a dot's radius from following the size curve (`freeDot` in gen-pilot-icons). Its dot therefore read about 25% heavier relative to the line at 24–96 px than crosshair's, target's and square-dot's ⌀2 centres. Those icons don't carry `free`. | Removed `data-dot="free"`. The ⌀2 dot (r 1) is now linted as a mark dot and follows the size curve. The geometry is unchanged. | Lint ok (the r 1 dot passes the dot rule). Slivers none at 16 and 48. Checked before/after and beside crosshair and target: the centre dots now match (`group-2-after-2.png`). |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| sort-ascending (and sort-descending, its `flipy`) | Shaft `M11.5 13V3.5` → `M11.5 12.5V3.5`. That is a 9 shaft with the 2.5 head, still in the "paired 2.5 on ≥ 6" class. | The shaft runs 0.5 below the bottom bar (13 vs 12.5), so the base of the stack and the arrow don't line up. The ink box also sits 0.25 low (centre 8.22). With the change, the bottoms align as in Lucide's arrow-up-narrow-wide and the ink centres on 7.97. Not applied, because the spec records "the arrow is sort's up arrow (13 → 3.5)". The owner picks either matching sort's arrow or aligning with the bars. | `groups/group-2/candidate-sort-ascending.svg`, sheet `group-2-proposal-sort-ascending.png` |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| the 1.5 / 3 container check (document-check's) | copy-check | Off the 45° lattice, hidden by `data-angles="free"`. `M5 9.5L6 10.5L8 8.5` has x − y = −4.5 and x + y = 16.5. | Move it 0.5 right or 0.5 down, whichever keeps its gaps on the scale: `M5.5 9.5L6.5 10.5L8.5 8.5` or `M5 10L6 11L8 9`. Drop `data-angles="free"` if nothing else needs it, then lint. |
| the 1.5 / 3 check | spell-check | Off the lattice, hidden by `data-angles="free"`. `M5.5 11L7 12.5L10 9.5` has −5.5 and 19.5. | `M6 11L7.5 12.5L10.5 9.5` (document-check's x placement), or `M5.5 10.5L7 12…` with the vertex on whole/half pairs. Recheck the gap to the letters, then lint. |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| calendar | "the top bars can extend further into the top of the calendar" | holds (pegs run 2 → 4.5, a detail 0.88 to the header) |
| calendar | "top part of the calendar should be just unfilled at the top" | holds (filled: the header stays open, the body below 6.5 fills) |
| calendar-add | r2 fix f: (no text; the header round) | holds (header open, 3px + knocked out at 8, 10) |
| calendar-check | r2 fix f: (no text; the header round) | holds (header open); the check is now also on the lattice (fixed now) |
| calendar-remove | "top part of calendar should be unfilled" | holds |
| calendar-clock | r2 fix f:; r3 "outline negative space of the circle is weird on the edge" (filled) | holds: the filled body ends on the outline's own overlap-cut arc (`M2.5 6.5H5.438A5.75 5.75 0 0 0 5.438 13.5…`), a one-weight clearance round the clock at every size, with no hand-drawn gap ring |
| circle-check-dashed | replace → Fluent | holds (Fluent checkmark_circle_hint: the whole ring dashed, the ring's 2 / 4 check) |
| eye | replace → Lucide | holds (Lucide eye, r 0.75 tip fillets, r 2 pupil) |
| filter | replace → Phosphor | holds (Phosphor funnel, slanted foot) |
| info | "gap between dot and i is too big, i like the i from fluent" | holds (stem 7.25–11, ⌀1.5 dot at 5, 2.25 between centres, ink gap 0.94) |
| loader | replace → Phosphor | holds (spinner-gap: seven ticks r 4 → 6, the upper-right one missing) |
| search | "bottom handle stroke roundness pokes through the circle" | holds: the handle starts at 10.75, 10.75, and its cap's nearest point (4.74 from the lens centre) stays inside the ring's ink (inner edge 4.44). Filled by weight at 1.5 it is still clear (4.55 vs 4.25). The same holds in zoom-in, zoom-out and search-off. square-search's small lens clears too (1.56 vs 1.44). |
| toggle | "size of the dot in the fluent compared to the track around it is better in fluent" | holds (Fluent's 12 × 7 track, r 3.5, ⌀4 knob concentric with the end; toggle-off mirrors it) |

## Checked, no change
info, help, warning, error, octagon-alert, status-available, badge, badge-check, square-badge, circle-dashed, circle-check-dashed, loader, loader-circle, record, bell, bell-dot, bell-ring, bell-off, menu, more-horizontal, more-circle, grip, grip-vertical, dots-four, settings, options, filter, filter-add, filter-dismiss, sort, sort-ascending (see Proposals), checkbox, radio-button, toggle, toggle-off, search, search-off, square-search, zoom-in, zoom-out, zoom-fit, expand, collapse, maximize, minimize, eye, eye-off, scan-check, clock, clock-alert, alarm, timer, timer-off, hourglass, calendar, calendar-add, calendar-remove, calendar-x, calendar-clock

Notes from the one-by-one pass. These were measured and left alone because they are recorded or correct:
- **Marks.** info, help, warning, octagon-alert and clock-alert all have their dot 2.25 from the stem or hook end, with stems as recorded (3.75 / 2.25 / 3.75 / 3.25). The ? hook is tangent-continuous: the arc's end tangent (−0.866, 0.5) equals the Q's first leg, and the Q ends vertical into `V9`. error's × is 5. The 2 / 4 check in status-available, checkbox, scan-check and circle-check-dashed, and badge-check's 1.5 / 3, are recorded and on the lattice.
- **Bell family.** The flare is tangent-continuous: V into a cubic with a vertical first control, then a vertical last control into the r 0.5 corner. The clapper is the 4 × 2.5 U cup, joined in both styles. bell-dot's cut ends are exactly 3.19 from the dot centre (1.125 ink gap). bell-ring's arcs are r 7 about the dome centre (8, 6.5), giving a 1.38 tight gap. bell-off's upper-right fill ends in a narrow tip at the flare against the slash gap. That tip comes from the shared slash construction, and the sliver check is clean.
- **filter-add and filter-dismiss.** The filled stalk is narrower than the outline's stem. This is the recorded choice ("the cone ends square at the stem top and a stalk runs to the foot (no concave bite or tail round the mark)"); the alternative was the earlier concave bite. The cut ends are exactly 2.25 from the mark.
- **expand, collapse, maximize and minimize.** The 3 head on a 5.66 shaft is recorded as the corner class ("their 3 barbs are a 2.12 diagonal head").
- **sort.** The staggered arrows (3.5–13 / 3–12.5) are Fluent's arrow_sort, with ink centred on 8.
- **Off-centre and under-keyline cases, all recorded.** menu sits 0.5 high (three-line stacks on x.5). grip is the package glyph (width kept), and more-horizontal is a line glyph by nature. The settings gear is dense, so it sits inside its keyline. alarm is 0.25 low (the lattice holds every diagonal). warning's centre of 7.84 is the triangle lift with its base on 13.5. hourglass uses whole-pixel bars and sides centred on 8, which the rule allows when the shape must centre on 8.
- **timer-off.** Filled drops the hand (recorded: the slash gap would swallow it).
- **clock-alert.** Filled ends the disc on the overlap-cut contour round the ! (2.25 round the stem top, 2.4375 round the dot). The outline's cut ends meet the same curves.
- **eye-off.** The side lashes start exactly on the lid curve (4.5, 7.912 lies on the cubic) and fan 20° outward from the normal.
- **calendar-clock.** The hands follow clock (vertical, then 45° down-right). The ring's right and bottom sit on the body's outer edges, and every cut is 2.25.
- **radio-button.** The "parts drift from radio 26%" flag is a false positive: radio is the broadcast radio, an unrelated icon.

## Rules or docs that should change
- **`data-angles="free"` hides lattice misses.** The lint drops the diagonal-lattice check for the whole icon when `data-angles="free"` or `"radial"` is set. That is how calendar-check, copy-check and spell-check shipped with off-lattice checks. Several group-2 icons carry `free` without needing it: timer, timer-off, bell-off, calendar-add, calendar-remove, calendar-x and calendar-clock all lint clean without it. I left those alone (brief: preserve data-* attributes). Suggestions:
  - The lint could still require the lattice on true 45° segments in a `free` icon. `free` would then only exempt the off-axis angles.
  - Alternatively, `--report` could flag a `free` or `radial` that the icon doesn't need.
- **Stale `data-dot="free"`.** `data-dot="free"` also takes a dot off the size curve. That isn't stated in the skill's dots rule: the rule only mentions the lint exemption. The skill should say so, so that `free` is kept only for true solid exceptions (record's disc, radio's disc, toggle's knob, the ⌀3 notification dot). Any r ≤ 1.25 dot that is a standard ⌀2 or ⌀1.5 dot should drop it, as circle-dot-dashed now has.
