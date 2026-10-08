# Group 8 report

Scope: 69 icons (ai, media, devices). I rendered every icon in outline and filled at 16/24/32/48 and 96 (look.mjs, sheets `group-8/o1–o9.png`), then at 240 (private zoom copy `group-8/zoom.mjs`, sheets `zb1–3`, `zm1–11`, `zcs` for chat-sparkle at 640). I checked each icon against the spec records (`group-8/spec.txt`) and the owner notes. The notes came from `all-notes.json`, with their dates checked against the spec.

Changed icons lint clean (`--only`), and slivers.mjs shows no hits at 16 or 48. Before/after sheets: `group-8/group-8-after-1.png` (brain, brain-off, bot-designer, chat-sparkle) and `group-8/group-8-after-2.png` (printer, gallery, vr-goggles, gamepad). Originals are in `group-8/orig/`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| brain | Filled, every size (clearest at 32–96): the two midline stubs `M8 5.5H9.5` and `M8 12H7` started on the halves' shared centre-line. The generator therefore saw them as edge exits and ran them 1px out through the midline gap, cutting a 0.44-wide tooth into the opposite half. The ┤ and ├ folds read as + crosses. | Stubs now start 0.5 off the midline: `M8.5 5.5H9.5` and `M7.5 12H7`. In the outline their caps still overlap the midline stroke at every size, so the outline looks the same. Filled, the cap ends inside the midline gap and no exit is generated. | lint ok; slivers none/none; looked: filled shows clean ┤ ├ and the outline is unchanged |
| brain-off | Same tooth on the filled `M8 12H7` knockout: a + below the slash. | The outline `line` is the same as brain (`M7.5 12H7`, `M8.5 5.5H9.5`). The filled knockout is `M7.75 12H7`: at 7.5 its end sat 3.18 from the slash, a 2.06 near miss, while 7.75 gives a standard 1.88. Its cap still ends inside the midline gap. | lint ok (gap 1.88 standard); slivers none/none; looked |
| bot-designer | Outline and filled, 24 px and up: the cap's button (`M7.25 1.5H8.75`) sat 1 between centre-lines above the crown top (2.5). It joined only at 16 (−0.125 overlap). Once the curve holds at 24 it split off as a 0.1-unit hairline. This is the kind of near miss the owner has flagged before. | A neck joins the button to the crown: `M7.25 1.5H8.75M8 1.5V2.5`. At 16 nothing changes (the neck lies inside the existing ink). At 24 and up the button stays attached, as an attached part should. The seam knockout is unchanged. | lint ok; slivers none/none; looked at 16/48/96 |
| chat-sparkle | Filled, 32/48/96: the bubble's top-right corner arc (outer edge about 1.46 from the sparkle) sits outside the halo once the curve holds at 24 (halo half-width 1.35 units). That leaves a speck of fill floating between the sparkle's top and right tips. Seen at 640 px (`zcs.png`). | The filled-only `fill` path crosses that corner with a 45° chord, `…L11.5 2.5L13.5 4.5L13.5 9.5…`, which lies wholly inside the halo at every size. The outline and the 16px filled look are unchanged. | lint ok; slivers none/none; looked |
| printer | Outline and filled: the paper tray (`M4.5 5V2H11.5V5`) and the output sheet (`M4.5 9H11.5V14H4.5Z`) had square corners. That breaks "no container corner is square" next to the body's r 1.5 corners, and the chosen reference (Lucide) rounds both. | r 1 corners (small parts): tray `M4.5 5V3A1 1 0 0 1 5.5 2H10.5A1 1 0 0 1 11.5 3V5`. The sheet and its identical filled `gap` are `M5.5 9H10.5A1 1 0 0 1 11.5 10V13A1 1 0 0 1 10.5 14H5.5A1 1 0 0 1 4.5 13V10A1 1 0 0 1 5.5 9Z`. The sheet's sides are still straight where the body's lower edge meets them (y 11). Filled keeps the sheet a line with its inside cut, per the owner's note "match fluent and phosphor". | lint ok (counters 1.93 / 3.26 / 3.93); slivers none/none; looked |
| gallery | Owner reviews2 note, never applied: "make the main shape larger, and make the gaps smaller". | Card widened from 6 to 7 (`x 7 w 7`, still 11 tall, r 1.5). The near line moved to x 4.5 and the far line stays at 2, so the gaps are 2.5 between centre-lines: tight 1.38, down from standard 1.88. That is Lucide gallery-horizontal-end's rhythm. Ink 13.12 × 12.12, centred 8,8. | lint ok; slivers none/none; looked |
| vr-goggles | Owner reviews2 note, never applied: "move the line/stroke closer to the top" (spec 3160 still had the lens line 2.5 under the brow). | Lens line moved up 0.5, same r 7.5 curve: `M5 8.627A7.5 7.5 0 0 1 11 8.627`. Its top is now 2.0 under the brow (r 15 about 8,21, top 6.0). That is the detail gap of 0.875, the same as the strap's, and the closest the scale allows. 8.627 was solved so that the closest point clears 0.875; 8.626 gave 0.87. | lint ok; slivers none/none; looked |
| gamepad | Owner reviews2 note, never applied: replace→Lucide, "handles need to be bigger". | Body rebuilt with `icon-geometry fillet "2,3.5 14,3.5 14,13 11,13 9,11 7,11 5,13 2,13" "3,3,2,1,1,1,1,2"`. The bridge is raised to y 11 (was 11.5) and narrowed to 7–9 (was 5.5–10.5). The 45° steps land on the lattice, at (5,13) and (11,13). Each grip is now 3 wide at the foot with r 2 corners (was 2 wide with r 1.5), the proportion of Lucide gamepad-2. To clear the raised bridge, the buttons moved up 0.5 to (10, 8.5) and (11.5, 6.5). The d-pad is unchanged. All gaps are tight (1.19 / 1.46 / 1.19 / 1.38) or detail 1.0, the same as before between the buttons. | lint ok; slivers none/none; looked (`gp.png` has the A/B comparison; B applied) |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| bot-generator | A wizard hat with a crooked tip (c2): the cone rises from 3.5 and bends over to a point at the right (12.5, 2), with the band at y 5. The alternative (c1) is a narrower, straighter cone, base 4–12 with the tip at 10, 1.5. | The owner's reviews2 note "make the wizards hat look more like a wizards hat and make it bigger" was never applied. The spec's last change is from the 10-03 round, and "bot hats" are listed as still open from reviews2. A wizard hat needs a taste call (the 10-03 curled tip was rejected as "a rounded stroke arrow"), so the candidates are drawn but not applied. c2 reads most like a wizard hat at 16. Both still need grid polish and filled roles (band `line` + `gap` as now, cone `solid`). | `group-8/bot-generator-c1.svg`, `group-8/bot-generator-c2.svg`, sheet `group-8/gen-cands.png` |
| camera (+ camera-off) | Lucide's camera: the same body, but a softer hump (r 1.5 shoulders, r 1 into the body: `M4 4.5L4.086 4.5A1 1 0 0 0 4.793 4.207L6.061 2.939A1.5 1.5 0 0 1 7.121 2.5L8.879 2.5…Z`) and Lucide's smaller lens (c2: r 2 at 8, 9; c1 keeps r 2.5 at 8, 8.5). camera-off would follow (slash flat, lens knockout recut one-sided). | The owner's reviews2 verdict is replace→Lucide. That was after the 10-03 Fluent redraw, and it is among the 26 open replace verdicts. Applying it is a redraw, so it is left for the coordinator. | `group-8/camera-c1.svg`, `group-8/camera-c2.svg`, sheet `group-8/cam-cands.png` (with Lucide and Fluent) |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| generator knockout exits (`gen-pilot-icons.mjs` onEdge) | any icon whose knockout starts on a solid's *internal* seam (brain had it) | A knockout starting on a centre-line that two solids share is treated as an edge exit and run 1px into the neighbouring solid. I fixed this in the sources here, but other icons could hit it. | Only extend when the extended point leaves every solid's ink. Otherwise, document "start a stub 0.5 off a shared seam". Grep elsewhere for knockout subpaths that start on a `gap` centre-line. |
| size curve hold vs near-touching attached parts | bot-designer (fixed), any part 1.0 between centre-lines from its host | At 16 the 1.125 line makes a 1.0 spacing overlap. From 24 the line is 0.9 units, so the part splits off with a hairline. | Lint: flag stroked shapes 1.0–1.15 apart between centre-lines (overlapping only at 16) as "join or part". |
| halo vs fill corners at the 24 master | chat-sparkle (fixed), possibly cloud-lightning, cloud-upload/-download, and other halo users with a container corner near the part | A halo is narrower at 24+ than at 16 (half-width 1.35 vs 1.69 units), so corners just outside it leave specks that slivers.mjs does not report at 48. | Run slivers at 96 or 128 for halo icons, or lower its island threshold. |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| agent | "not sure if this icon is needed" | holds: alias of bot-agent (`data-alias-of`, spec 3905); the open question stays with the owner |
| bot-agent | "stroke in height should go all the way across" | holds (the band line and filled gap run side to side) |
| bot-automator | r1/r2 filled fixes | holds (puff fills, band a plain line, spec 3827) |
| bot-designer | "errors with rounding strokes … negative space when it should be sharp"; r2 | holds (visor solid, crown and visor one mass, spec 3887/3903); the button hairline at 24+ was fixed now |
| bot-generator | "rounded stroke arrow" (r1); "make the wizards hat look more like a wizards hat and make it bigger" (r2) | r1 holds; r2 is a **proposal** (not applied before this pass; candidates drawn) |
| bot-guard | wider bill; brim sticking out; strokes stick out at sides; "maybe just fill the top" | holds (brim and visor end at the crown's corners; filled top and visor, band open) |
| bot-scholar | r1/r2 filled | holds (board and skirt solid, V gap, data-halo) |
| brain-off | r2 filled stroke and negative space | holds (notch gap removed); the + tooth was fixed now |
| camera | replace→Fluent (r1), replace→Lucide (r2) | r1 applied; r2 is a **proposal** (candidates drawn) |
| captions | "text is not centered" | holds (Cs at 6 and 10, ink centre 7.78, optical) |
| chip | "the circle should be a square" | holds (3 × 3 r 0.5 die) |
| clapperboard | replace→Fluent / Lucide | not touched (redrawn today to match Fluent; outside my remit) |
| gallery | replace→Lucide; "make the main shape larger, and make the gaps smaller" | replace holds (Lucide gallery-horizontal-end); size and gaps **fixed now** |
| gamepad | replace→Lucide; "handles need to be bigger" | **fixed now** (Lucide gamepad-2 grips) |
| image-plus | "rounded or sharp stroke edge in the filled mountain?" | holds (one round-ended knockout, sawn at the frame exit; owner approved in r2) |
| mic | replace→Phosphor | holds |
| mouse | replace→Phosphor | holds |
| music | replace→Phosphor | holds |
| printer | "match fluent and phosphor for negative space" | holds (sheet a line with its inside cut); tray and sheet corners softened now |
| screen-share | "arrow seems too short" | holds (1.5 head on a 4 shaft, ratio 2.67; owner approved in r2) |
| tv | replace→Lucide | holds |
| usb | the USB symbol or 2 notches | holds (two solid 1 × 1 notches) |
| vr-goggles | smaller notch, closer, shorter mask (r1); "move the line/stroke closer to the top" (r2) | r1 holds; r2 **fixed now** |
| watch | replace→Phosphor | holds |

## Checked, no change
sparkle, sparkle-off, chat-sparkle's outline (only its filled corner changed), grid-sparkle, agent, bot, bot-agent, bot-builder, bot-researcher, bot-scholar, bot-guard, bot-lead, bot-generator (proposal only), bot-automator, play, pause, stop, play-circle, pause-circle, stop-circle, skip-forward, fast-forward, playlist, music, waveform, mic, mic-off, volume, volume-low, volume-off, video, video-off, camera (proposal only), camera-off (follows the camera proposal), film, clapperboard (excluded), captions, image, image-plus, image-off, images, screen-share, screen-share-off, cast, radio, disc, desktop, desktop-check, desktop-play, laptop, tablet, phone, watch, tv, devices, mouse, headphones, headset, speaker, chip, circuit-board, usb

Observations, all within recorded decisions:
- **Under-keyline icons:** play (−1.66, recorded as −12% like send), volume-low (the base speaker kept in place, recorded), and headphones (−1.88 under the circle keyline, not recorded). headphones would sit within 0.88 of a square keyline, or could take an r 6 band if the owner wants it to read larger.
- **fast-forward:** reads −15% small, and its 45° triangles differ from play's and skip's 28° triangle. This is recorded (spec 1880: Fluent's and Lucide's).
- **Slash pieces dropped by design:** mic-off filled drops the cradle arm on the slash's gap side, and camera-off filled drops half the lens ring. Both are the toolkit's one-sided slash (`icon-geometry slash` drops the gap-side piece), the same as the other off icons.
- **Off-centre by 0.25, recorded or forced by the grid:** video's centre 7.75 (whole-pixel lens edge), cast's ⌀2 dot at 2.5, 13 (not on a whole-pixel centre, but tied to the wave centres), and screen-share's arrow, which sits 0.25 low in the screen (recorded gaps 1.375 / 0.875).
- **Harmless:** a double space in `<path  d=` in camera-off and screen-share.

## Rules or docs that should change
- **Skill, Filled → Ends:** state that a knockout starting on a centre-line two solids share (a midline gap such as brain's) is treated as an edge exit and runs 1px into the next solid. To keep a round end inside, start it 0.5 off the seam.
- **Skill, Sizes ("the curve holds at 24"):** add that parts 1.0 apart between centre-lines overlap only at 16 and split at 24 and up. Join them (a neck) or part them by a full gap step.
- **Skill, Halos:** a halo is narrower at the 24 master than at 16 (in drawing units), so check container corners near a halo at 48–96 for islands. slivers.mjs at 48 missed chat-sparkle's speck.
- **Spec:** several reviews2 notes in this group were still unapplied (gallery, gamepad, vr-goggles, bot-generator, camera), although HANDOFF only lists them generically. The spec should record today's fixes under the 2026-10-07 pass: gallery card 7 × 11 with lines at 2 and 4.5; gamepad grips per the fillet line above; vr-goggles lens line at 2.0 under the brow.
- **Spec (gallery):** spec 2747/2748 still describes gallery as the image-in-front-of-back-copy drawing, and images as gallery's alias. The sources are now gallery = Lucide gallery-horizontal-end and images = the layered image. The records should say which is which.
