# Group 4 report

Type, paragraphs and code: 66 icons. I looked at every icon, outline and filled, at 16, 24, 32 and 48, and at 96. I also used a zoom sheet (`group-4/zoom.mjs`) that shows the 16px drawing at 240px at the 16px weight and at the 24px weight. A geometry audit script (`group-4/geo.mjs`) checks every path for 45° segments off the lattice and for joins that are nearly tangent but kinked. It is needed because `data-angles="free"` turns off the lattice check for the whole icon.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| quote | **Owner r2 note, both styles:** "stroke sticks out of the base on the left side of each quote mark". The tail started at 3.5,10, so at 16px its outer edge stuck out 0.06 past the ⌀4 drop. Filled at 16px it stuck out the same amount. At 24px and above it left a notch inside the drop: outline 0.11, filled 0.15. A solid r 2 disc cannot stay tangent to a stroke whose weight follows the size curve. | Each drop is now a stroked ring (centre-line r 1.438) with a solid core (r 1.438), and the tail runs on from the ring in one path: `M3.562 10A1.438 1.438 0 1 1 6.438 10A1.438 1.438 0 1 1 3.562 10A5.5 5.5 0 0 1 7.639 4.687`. The second mark is the same moved +6. The tail's centre is now 9.062,10. The ring and the tail's centre-lines are internally tangent at 3.562,10, so their outer edges are tangent at every weight in both styles. At 16px the drop is still exactly ⌀4 (1.438 + 0.5625). Above 24px the drop follows the line like every other dot. Drop to drop is a standard 2.0 (the old 1.94 was the stick-out). Ink 11.2 × 7.88, centre 8.6 (was 8.54). | lint ok; slivers none at 16 and 48; looked before/after (zoom at 16w and 24w, and group-4-after-1) |
| strikethrough | Outline and filled, every size: a 7.3° kink on the upper bowl's left side. The arc ended at 4.5,5.5, but its ellipse's leftmost point is at y 5.25 (the ellipse it fits is centred 7.98,5.23), and then a cubic took over. The top was 2.48, off the grid, and the ink centre was 7.99. | The upper bowl is now the exact point mirror of the lower bowl: one ellipse arc, centre 8,5.25, from the 30° terminal to the spine, `M11.031 3.875A3.5 2.75 0 1 0 8 8A3.5 2.75 0 1 1 4.969 12.125`. It is tangent-continuous throughout, with the top on 2.5, ink 11.12 × 12.12 and centre 8,8. | lint ok; slivers none 16/48; looked |
| superscript, subscript | Outline and filled: an 8.4° kink where the 2's bowl meets its diagonal. When the 2 was narrowed (partition F, rx 1.25 → 1.125), the end points were moved by hand. The arc then fit an ellipse centred 12.51,3.43, so the bowl's top sat at 2.43 and the diagonal was no longer tangent. | list-numbered's 2 construction, rebuilt at rx 1.125: bowl centre 12.625,3.5 (subscript 12.625,11.5), the S's 30° terminal at 11.651, and the diagonal tangent to the foot corner 11.5,6 at 13.44,4.19. Superscript is `M11.651 3A1.125 1 0 1 1 13.44 4.19L11.5 6H13.75`, and subscript the same moved +8. The bowl top is now on 2.5 (10.5). Superscript ink 12.87 × 11.12, centre 7.88,7.5; tight 1.42 to the T as before. Subscript gap 3.55 (open). | lint ok; slivers none 16/48; looked |
| case-upper | Outline and filled: the B's bowls were the same height (3.5 and 3.5), with the lower one only 0.5 wider. This breaks the owner's B rule ("the bottom loop should be bigger than the top loop", spell-check 2026-10-05; skill: "a B's lower bowl is larger than its upper"), which bold and spell-check follow. | Middle bar at 7.5 (the only grid step below 8). Upper bowl r 1.5 to x 13.5, lower bowl r 2 to x 14. Extents are unchanged: `M10 11.5V4.5H12A1.5 1.5 0 0 1 12 7.5H10M10 7.5H12A2 2 0 0 1 12 11.5H10`. Counters 1.93 / 2.93 (were 2.43 / 2.43). Ink and centre are unchanged (13.12 × 8.12, 8,8). | lint ok; slivers none 16/48; looked (candidate beside current first: p-1.png) |
| square-list | Outline and filled: content off centre in the frame. The margins were 1.69 left / top / bottom but 1.38 right. | The three lines end at 10.75 (were 11): `M8 5.5H10.75M8 8H10.75M8 10.5H10.75`. The margins are now 1.69 / 1.69 / 1.69 / 1.63. Dots, rows and the dot-to-line gap (1.19) are unchanged. | lint ok; slivers none 16/48; looked |

Sheets: `group-4/group-4-after-1.png` (quote, strikethrough, superscript) and `group-4/group-4-after-2.png` (subscript, case-upper, square-list). Zoom before/after for quote: `group-4/z-quote2.png`.

Tried and reverted: spell-check's check is off the 45° lattice (`M5.5 11L7 12.5L10 9.5`: x − y = −5.5, x + y = 19.5). The lint hides this because the icon is `data-angles="free"`. Only two lattice moves exist. Moving it 0.5 right leaves a 2.27 near miss to the C. Moving it 0.5 left passes the lint, but at 16px the check then sits visibly left of the word (under A–B). These coordinates are the owner's own decision (spec, 2026-10-05), so I put them back. The source is unchanged. See Rules.

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| bug-off | Outline: drop the two corner legs that run along the slash (top-left upper leg, bottom-right lower leg). That is A; B also drops the middle-right leg, so the outline has the filled variant's three legs. | Owner r2 note "legs on monoline only" (spec: "unclear"). Today the outline has six legs and the filled three. The two corner legs lie along the slash and poke out past it at 16px: a stub above the slash at the top left, and a second round end beside the slash's end at 14,14. Before the flat-slash pass re-drew the base whole, the owner had said "the extra legs are not needed" (spec 2303). A reads cleanly. Not applied because it overrides "keep the base whole under a flat slash", and the note is ambiguous. Recommend A. | `group-4/cand-bug-off-A.svg`, `cand-bug-off-B.svg`, rendered in `group-4/p-1.png` |
| translate | Owner r2 verdict "replace → Fluent" is still open (one of the 26 open replace verdicts from `reviews2`; partition F's Phosphor 文/A predates it). Fluent's translate is a different design: "a" over "あ". | A redesign, so not drawn. If wanted, case-lower's a (r 2 ring and stem) top left, plus a hiragana あ lower right on the type line, would need its own construction. | none (reference: `group-4/ref-translate.png`) |
| heading-1 | Optional family alignment: the 1's flag is 26.6° (a 45° flag failed the acute rule), while list-numbered's 1 uses an owner-approved sharp 45° flag (`data-acute`) and binary's 1 a flag and foot. | Three different 1s in the set; the sizes differ and each is recorded, so not applied. | none |
| bold (filled) | The filled solid B (3.5–12.5 × 2–14, r 1 left corners) is 0.9 wider than the outline B's ink (3.94–12.06) and has round left corners where the outline's are sharp. | The owner's choice (stroked outline + old solid B) is still recorded as open in partition F. If kept, the filled silhouette could be redrawn from the outline's ink. | none |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| numeral 2 (list-numbered's construction) | superscript and subscript in this group fixed. Check any other icon that carries the narrowed 2. | A hand-moved arc end changes the arc's fitted centre (SVG refits it), which breaks tangency silently. | For any 2 on rx 1.125 / ry 1: bowl centre (x0 + 1.125, y0 + 1), start at the 30° terminal (x0 + 0.151, y0 + 0.5), diagonal tangent point (x0 + 1.94, y0 + 1.69), foot at x0. |
| solid drop + stroked tail (quote construction) | quote only, in this group | A solid shape that a stroke must meet tangentially cannot stay tangent as the size curve changes the line weight. | Use quote's ring + core: a stroked ring on the stroke's centre-line plus a solid core of the same radius. It applies anywhere a fixed solid meets a stroke edge to edge. |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| bold | [r approve] outline B needn't be bolded (Lucide, Phosphor) | holds (stroked B outline, solid B filled; the filled silhouette point is under Proposals) |
| bug-off | [r fix f] small ink edge error in negative space | holds (partition F's filled-only gap; no slivers at 16/48) |
| bug-off | [r2 fix m] legs on monoline only | proposal (candidate A/B; the note is ambiguous and overrides the flat-slash base rule) |
| puzzle | [r approve] puzzle heads a bit bigger | holds (r 2 knobs on 4-wide, 0.5 necks) |
| quote | [r fix] stroke doesn't lead directly; gap between quotes too big | holds (single r 5.5 tail from the drop; drops 6 apart) |
| quote | [r2 fix m+f] stroke sticks out of the base on the left side of each mark | **fixed now** (ring + core; tangent at every weight in both styles) |
| spell-check | [r/r2 replace→Fluent] letters not even widths | holds (Fluent's ABC over a check; A 3, B 2.5, C 2.5 wide, 2.5 apart; the B's lower bowl larger per the 2026-10-05 owner round) |
| subscript | [r approve] T can be bigger | holds (7 × 8 T); the 2's kink fixed now |
| text-wrap | [r replace→Fluent] smaller arrow, goes further into the last line | holds (Fluent's text_wrap: 2px head, tip at 7.5, tight to the last line) |
| translate | [r replace→Phosphor] kanji incorrect | holds (Phosphor's 文) |
| translate | [r2 replace→Fluent] | open; proposal (Fluent's a/あ is a redesign) |

## Checked, no change
text, text-size, text-color, heading, heading-2, heading-3, italic, underline, case-lower, case-sensitive, remove-formatting, text-cursor, square-text, square-text-cursor, line-height, letter-spacing, text-wrap, pilcrow, spell-check, markdown, text-align-left, text-align-center, text-align-justify, indent, outdent, list, list-bullet, list-numbered, list-checklist, list-plus, list-minus, list-tree, insert-row, code, code-block, terminal, braces, brackets, function, variable, regex, binary, bug, debug-step-over, breakpoint, git-branch, git-commit, git-merge, git-fork, git-compare, git-pull-request, git-pull-request-closed, git-pull-request-draft, webhook, workflow, puzzle

Notes on some of these, kept on purpose:
- **heading-2, heading-3:** ink centre 8.5. The numerals share heading-1's left edge, and the 2 and 3 are wider than the 1. Moving the icon would put the H stems on whole pixels. Not recorded in the spec as an exception.
- **text-size:** centre 8.25.
- **markdown:** content sits 0.25 low because the arrow's tip is 0.5 below the M. A 0.5 move breaks the lattice and a 1.0 move lifts the tip above the M's feet.
- **debug-step-over:** the arc's leftmost point is at x 2.697, off the 0.5 grid. Lucide's redo-dot construction forces it: the r 5.303 arc tangent to a lattice diagonal.
- **git-pull-request-draft and -closed:** parts drift is expected from replacing the hook.
- **list-numbered:** the 1 and the 2 sit 0.25 above and below their rows. The pair is centred, and the grid and lattice allow no better.
- **function, breakpoint:** read small, but follow the type cap height and the recorded small breakpoint.

## Rules or docs that should change
- `data-angles="free"` turns off the 45° lattice check for the whole icon, so real 45° segments in free-angle icons go unchecked; spell-check's check is off the lattice this way. Suggest the lint still checks segments within 0.01° of 45° when an icon is free-angle.
- The lint does not catch near-tangent kinks, such as an arc refitted to a different centre because its end point was moved. Strikethrough and super/subscript had them. Suggest a check that warns on joins deflected by 0.3–25°, as `group-4/geo.mjs` does.
- Arc extremes in paths are not grid-checked, only `circle` extremes are. Strikethrough's top was at 2.48. Suggest the lint checks axis extremes of arcs too, with an exemption for intentional cases such as debug-step-over's leftmost point.
- Skill, Shared parts / Owner preferences: record quote's drop as a ring plus core (the solid exception now follows the line above 24px). The `data-dot="free"` line for quote stays, but the drop is no longer a fixed r 2 disc.
- Skill, type family: the "medium 6 × 6 T in superscript and subscript" line is stale. Partition F made them 7 × 8. It was flagged then and never updated.
