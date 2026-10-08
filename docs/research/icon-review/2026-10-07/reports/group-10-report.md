# Group 10 report

All 47 icons were rendered outline and filled at 16 / 24 / 32 / 48 and at 96 (look.mjs), in family chunks. The suspect ones were also rendered at 288 (a zoom copy of look.mjs, deleted afterwards). References used: Fluent calculator, briefcase and temperature; Lucide and Phosphor atom; Phosphor confetti; Lucide utensils. All 47 lint clean (`--only`, the whole group). Originals are in `groups/group-10/orig/`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| party-popper | Both styles, at every size: the owner's r2 note ("the strokes are too close to each other") still failed. Measured ink gaps: the 45° dash and the slanted dash touched (−0.01), the tick and the streamer were 0.66 apart, and the streamer and the slanted dash 0.81. The ink also sat 0.3 high (centre 8.04, 7.71). | The cone and its stripe cuts moved (−0.5, +0.5), a lattice-safe whole shift: the mouth is now on x − y = 1. The confetti are separate paths, so the lint measures their gaps. Tick `M7.5 2V3.5`; streamer unchanged (`M10 5C10 3.75 10.75 3.5 11.5 3.5C12.25 3.5 13 3.25 13 2`); slanted dash `M12.5 6L13.75 5.583`; 45° dash `M12.25 8.25L13.5 9.5` (on the lattice). Layout from a brute-force search over the gap scale (`pp-search3.mjs`). Confetti-to-confetti gaps are now 1.14–1.60 (tight) and confetti-to-mouth 1.0 / 1.0 / 1.7. Ink 12.79 × 13.04, centre 7.92, 7.96. | lint ok (gaps 1.0 detail to 1.7 tight, no near misses); slivers 16 / 48 none; before/after `group-10-after-1.png` and `-after-2.png`. Reads closer to Phosphor's confetti. |
| atom | Outline and filled, at 16 and 32: 3.62 under its keyline (ink 10.38), read small (−8%) and dense (+40%) beside basketball, life-buoy and the rings. Lucide and Phosphor fill the box. | Orbits are ellipses a 7.937 × b 3 at ±45°, so their extremes land exactly at 2 and 14, the ring's box (was 6 × 2.625). Tips at 2.388 / 13.612. Nucleus ⌀2 unchanged; its gap went from 1.06 (detail) to 1.47 (tight). Generator: `orig/../atom.mjs`. | lint ok (ink 13.16, counters 2.05–3.34, no keyline warning); slivers none; before/after `-after-1.png`. |
| thermometer | Optical audit −27%, ink 12.62 tall, centre 8.25 (it sat low, the opposite of the heavy-base allowance). | The tube's top is 0.5 higher (`V3.5A1.5 1.5 0 0 1 9.5 3.5`, top extreme at 2). Ink 7.12 × 13.12, centre 8, 8. Bulb, reading dot and filled treatment unchanged. | lint ok; slivers none; `-after-1.png` |
| briefcase | Outline, at 1×: the body top (y 5) and the handle top (y 2) were on whole pixels. The ink sat 0.25 high, and the belt and clasp sat 0.5 below the body's middle (gaps 3.38 above, 2.97 below). | The body is 5.5–13.5 (8 tall) and the handle is `M5.5 5.5V4A1.5 1.5 0 0 1 7 2.5H9A1.5 1.5 0 0 1 10.5 4V5.5` (same 3-tall handle). Every horizontal edge is now on x.5, and the belt (9.5) and clasp are centred in the body (2.93 / 2.93 counters). Ink 13.12 × 12.12, centre 8, 8. | lint ok; slivers none; `-after-1.png` |
| calculator | Outline: the display frame's top edge was on a whole pixel (y 4). Its margins were uneven (0.88 at the sides, 1.38 above), and its counter was 1.43, which the lint scale treats as a satellite-only size. Owner r2 asked for a larger top part, as Fluent and Phosphor draw it. | Display `y 3.5, height 3` (3.5–6.5, both edges x.5). Margins are now even (0.875 above and at the sides), the display-to-keys gap equals the bottom margin (1.19), and the counter is 1.93 (standard). The filled-only interior gap was re-cut to the new interior (`M6 4.0625H10…5.9375…`). Keys, body and the owner's alignment of the display's edges with the outer keys are unchanged. | lint ok; slivers none; `-after-1.png` |
| chess-rook | Filled, at every size and clearest at 48 / 96: the crown is an open path (Lucide's open-topped crown), so the fill closed it with a chord at y 1.5. The round caps of the two side walls poked up as two knobs above the flat top: a stray bump of a round cap on a corner. | The crown's outline path is now `data-filled="line"` (outline unchanged), and a filled-only `fill` path closes it (`…12 4.5V1.5Z`). Filled, the top is flat with the corner radius of every other corner, and the crenel knockouts are still sawn flush through the top (the generator detects the edge on the new path). | lint ok; slivers 16 / 48 none; before/after `-after-2.png` |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| calculator (filled) | Cut the display hole at the frame's centre-line (6 × 3, r 1) instead of its interior (4.9 × 1.9). | Filled, the window reads smaller than the outlined display. Fluent's filled calculator keeps the window at the outline's size. "A hole inside a line is cut to the line's centre-line" (skill) supports it. This changes the recorded "display interior a white gap", so it needs the owner. Lint ok. | `group-10/calculator-candidate-centreline-hole.svg`; render `group-10/prop-calculator.png` (the "after" row is the candidate) |
| utensils | Fork tines 3 apart on x.5 (2.5 / 5.5 / 8.5, bowl r 3) and the knife at 11–13.5. | The middle tine and the 12-long handle sit on whole pixel x 5, and the ink sits 0.25 left. The option centres it (8, 8) and makes the fork crisp, but the fork–knife gap drops from standard 1.88 to tight 1.38 and the knife's blade edge moves onto whole pixel x 11. The trade isn't clearly better, so not applied. | not drawn (values here) |
| coffee | The cup's rim (y 8), base (y 14) and left side (x 2) are on whole pixels and blur at 1×. The fix needs steam 2.5 tall (2–4.5) and the cup at 7.5–13.5 (centre 7.75, the heavy-base allowance). | Crispness of the strongest horizontal at 1×. It shortens the owner-approved steam, so it is a proposal only. | not drawn |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| none | – | No group-10 change touches a shared base. cloud-* use the cloud unchanged; cloud-sun's sun and brightness are recorded variants of sun, which is unchanged; graduation-cap, chef-hat and crown (bases of bot-scholar, bot-automator and bot-lead) are unchanged. | – |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| bandage | replace → Phosphor | holds (Phosphor bandaids; filled front band solid, back band a line) |
| binoculars | replace → Phosphor | holds (Phosphor's shallow cap arcs; their corners are Phosphor's, softened by the round join) |
| broom | replace → Fluent; r2 bottom part; r3 "filled … the top part getting darker" | holds (dome / binding fills, skirt a line) |
| calculator | r1 display edges align with the keys; r2 larger top part (Fluent, Phosphor) | holds and improved now (display 3 tall, even margins, edges still aligned); filled window size is a proposal |
| chef-hat | one piece with a separating stroke | holds |
| chess-rook | r2 thicker and wider, like Lucide | holds; filled top fixed now |
| coffee | smoother, more natural curves | holds (S wisps with vertical ends) |
| crystal-ball | r2 "shouldn't the stroke connect on the bottom?" | holds (closed stand bottom) |
| dice | Phosphor's dot spacing | holds |
| dumbbell | replace → Phosphor | holds |
| hammer | r2 longer handle, Phosphor ratios, no tail | holds |
| leaf | filled: rounded stroke end | holds (vein sawn at the edge, stem continues square) |
| lightbulb | r2 Fluent, wider | holds |
| moon | replace → Phosphor | holds |
| party-popper | r2 "the strokes are too close to each other" | **was not holding** (dashes touching, 0.66 and 0.81 gaps); fixed now |
| paw | replace → Phosphor | holds |
| piano | replace → Phosphor (r1, r2) | holds |
| scale | bottom bar can be a stroke | holds |
| toy-brick | studs a bit taller (later reversed to 2.5 by the owner) | holds at the owner's latest (2.5) |
| tree | replace → Fluent | holds |
| umbrella | r2 filled stroke / negative-space error | holds (ribs knocked out, round inside, sawn at the bottom) |

## Checked, no change
sun, moon, brightness, cloud-sun, cloud-rain, cloud-lightning, cloud-snow, wind, snowflake, umbrella, flame, leaf, tree, mountain, paw, flask, flask-off, magnet, binoculars, lightbulb, graduation-cap, presentation, scale, hammer, wrench, broom, life-buoy, bandage, coffee, utensils, chef-hat, cookie, trophy, award, crown, dice, toy-brick, crystal-ball, basketball, dumbbell, piano

Notes on the checked icons:
- **award:** the ribbon legs start 0.22 outside the ring's centre-line, unlike Lucide, whose legs start on the ring. The leg's own body covers the cap, so no bump shows at 288; left as is.
- **flask, lightbulb (1.88 under keyline):** both are centred on x.5 edges. The next x.5 size is either off centre by 0.5 or over the keyline by 0.06. Owner precedent ("crisp at 1× outweighs centring") points to leaving them; they are listed here for the coordinator.
- **flask-off filled:** the right shoulder is trimmed. That wedge is at most 0.93 wide between the slash gap and the wall, so it is a sliver everywhere; the trim is recorded and correct.
- **wind:** the middle line at y 8 is on a whole pixel. This is forced by the 2.5 spacing the owner chose.
- **scale, trophy, crown, toy-brick, piano, dumbbell's bar:** their whole-pixel edges centre a recorded construction.
- **chef-hat:** its 0.25-low centre suits a top-heavy shape.
- **umbrella:** the thin wedges between the ribs and the canopy at the apex are Phosphor's; they read as one knot at 16.

## Rules or docs that should change
- **The lint does not measure gaps between subpaths of one `<path>`.** party-popper's confetti were one path, so two dashes touching (−0.01) and a 0.66 gap passed silently. Suggest: the skill says separate parts (confetti, rain, rays) are separate path elements, or the lint measures disjoint subpaths as shapes.
- **An open `solid` path ends in round caps that the fill's closing chord doesn't cover,** so a filled open-topped silhouette grows knobs at its corners (chess-rook). Suggest a lint or skill rule: an open `solid` whose chord lies on the silhouette (not hidden inside another solid) needs a `line` + `fill` pair. Phosphor-style open tops are where this appears.
- **The skill's centring rule for heavy-base shapes ("sit about 0.25 high") is not applied consistently:** crown sits 0.22 high per it, while the spec row 1897 calls a 0.21-low crown "a heavy base's optical allowance"; thermometer sat 0.25 low before this pass. One sentence in the spec settling the direction would help.
