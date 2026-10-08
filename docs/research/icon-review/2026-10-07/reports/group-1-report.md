# Group 1 report

Scope: 65 icons (arrows, chevrons, actions, keys, marks). I rendered every icon in outline and filled at 16 / 24 / 32 / 48 and at 96 over the grid (sheets `group-1/o1.png` to `o8.png`). I checked each one against its spec record, the arrow-class rules, the shared parts (ring r 6, stop's square, check, marks, reset's head, the tray and the door) and the lint report. I also checked gaps that the lint cannot see because both shapes sit in one path: option's bar, reply-all's heads, move's barbs, import's and share's tip and tail to the floor, and backspace's × to its frame.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| square-dot | Both styles, seen at 48 and 96. `data-dot="free"` was left over from the first drawing, which had an r 1.5 solid dot recorded as a free exception. The dot is now the ⌀2 mark dot (r 1, the "centre point in a frame" role, as in crosshair). The free flag kept this one dot off the size curve, so it grew against the line above 16: at 96 it read larger than crosshair's and rotate's ⌀2 dots. 16px was unchanged. | Removed `data-dot="free"` from the root. Geometry unchanged (r 1 at 8, 8; a `hole` when filled). | Lint ok (ink 12.12 × 12.12, centre 8, 8; open 3.94; counter 5.07). Slivers: none at 16, none at 48. Looked before and after beside crosshair and rotate (`group-1-after-1.png`): the dot now matches them at every size. |
| option | Outline and filled, every size. The separate bar (9.5–13.5 at y 4.5) sat 2.13 of ink from the diagonal. That is a near miss between standard (≤ 2) and open (≥ 2.5). The lint missed it because both parts were one path. | The bar now starts at 9.25 (`M9.25 4.5H13.5`), giving 1.93, standard (3.05 between centre-lines; Lucide's option is about 1.8). The bar is now its own `<path>`, so the lint measures this gap from now on. | Lint ok ("gaps 1.93 standard"; ink 12.12 × 8.12, centre 8, 8, unchanged). Slivers: none at 16, none at 48. Looked before and after (`group-1-after-1.png`). |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| backspace | Move the body's right side from x 14 to 13.5 and the × 1 left (centre 10 → 9: `M7.25 6.25L10.75 9.75M10.75 6.25L7.25 9.75`). Everything else stays: the 45° shoulders, r 1 and r 2 corners, and the 3.5 × on the lattice. | Today the × crowds the right side: 1.125 of ink there (detail) against 2.06 to the left shoulder and 1.625 top and bottom. The right side sits on a whole pixel (blurs at 1×), and the ink centre is 8.21, which is not recorded. The candidate gives 1.625 right, top and bottom and 1.35 to the shoulder, crisp sides, centre 7.96, and Fluent backspace's exact composition (× at 9, right side at 13.5). Cost: the width drops 12.71 → 12.21, so `--report` would flag 1.79 under the horizontal keyline (or change the keyline to square, 0.79 under). It is a size-against-balance trade, so I left it for the coordinator or owner. | `groups/group-1/cand-backspace.svg`; sheet `group-1/c1.png` (beside Fluent's backspace_16_regular) |
| import | Run the arrow's tip from 10 to 11 (`M8 2V11M5 8L8 11L11 8`). | The tray rule is "an arrow meeting a frame stops tight, 2.5 between centre-lines, where it points into a tray or out of a box". download keeps 2.5 to its floor; import's tip is 3.5 from the floor, 2.38 of ink, a near miss the lint cannot see (same shape pair as the 1.38 to the opening). Lucide's import sits at about 2.67. The ink box is unchanged. | `groups/group-1/cand-import.svg`; `c1.png` |
| share | Run the tail from 10 to 11 (`M8 11V2…`), shaft 9. | Same rule. upload's tail is 2.5 from its floor; share's is 3.5 (2.38 of ink, a near miss). Lower priority: share's arrow leaving the box also reads fine as drawn (Lucide's tail floats higher). | `groups/group-1/cand-share.svg`; `c1.png` |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| ⌀2 centre dot in a frame | circle-dot-dashed (not in group 1) | It has the same leftover `data-dot="free"` on an r 1 centre dot, so the dot stays off the size curve and reads large at 32 to 96. It no longer matches crosshair, rotate and (now) square-dot. | Remove `data-dot="free"` from circle-dot-dashed's root; the geometry stays. Every other free-dot icon carries a real exception (⌀3 notification dots, quote, record, radio, toggle, rocket's ⌀2.5 window). |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| arrow-up-right | approve; "arrow tail seems too long compared to the regular arrow" | Holds: shaft 3.5, 12.5 → 12.5, 3.5 (12.7, the straight arrow's 12 turned 45°), barbs 7 (5√2). It reads in proportion with arrow-up at 16 and 96. |
| exit-door | replace → Lucide | Holds: Lucide door-open. The leaf hinges at 6.5 and rises above the frame top and dips under the floor as Lucide's does, with the ⌀1.5 knob a hole when filled. The frame and floor stay lines, and the floor's stub on the right joins the leaf's foot. |
| hash | replace → Fluent | Holds: Fluent number_symbol with slanted uprights, bars at 5.5 and 10.5 offset with the slant. |
| rotate | replace → Fluent | Holds: arrow_rotate_clockwise in reset's construction (r 5.59 arc, 3px corner head, ⌀2 dot that follows the curve); centre 8, 7.71 recorded. |

## Checked, no change
arrow-up, arrow-up-right, arrow-left-right, arrow-right-left, arrow-up-circle, arrow-up-from-line, arrow-right-to-line, square-arrow-up, square-arrow-up-right, corner-down-right, trending-up, move, chevron-down, chevron-last, chevron-down-circle, chevrons-right, chevrons-up-down, chevrons-down-up, undo, reply, reply-all, reset, rotate, history, sync, repeat, shuffle, download, upload, import (proposal above), share (proposal above), share-nodes, open, log-in, log-out, exit-door, keyboard, command, shift, caps-lock, return, backspace (proposal above), escape, add, minus, plus-minus, equal, dismiss, check, check-check, add-circle, remove-circle, prohibited, square-plus, square-minus, square-x, square-slash, asterisk, hash, at, percent, sigma, infinity

Notes on checks that passed (why these were left as they are):
- **Arrowhead classes all hold:**
  - standalone: arrow-up has a 5 head on 12, and arrow-up-right is the same arrow turned 45°;
  - recorded exception: arrow-left-right uses 3 heads;
  - paired or contained 2.5: arrow-right-left, arrow-up-circle and square-arrow-up (shaft 6), and square-arrow-up-right (3.5 barbs);
  - main 3 on ≥ 7.5: download, upload, import, share, log-in, arrow-right-to-line, arrow-up-from-line, undo, reply, return and corner-down-right;
  - log-out's 7 is recorded;
  - corner heads: open, trending-up and escape take 3; reset, sync and rotate take reset's 3; history takes 2.5;
  - move and shuffle take 2.
  - undo, reply, reply-all, return and corner-down-right share one head, `M5.5 2.5L2.5 5.5L5.5 8.5` or its turns.
- **Shared parts are identical where they recur:** the ring r 6 at 8, 8 (5 icons); stop's square 2.5–13.5 r 2 (6 icons); the 6px + and − in ring and square; the 5px × and slash in square; the standalone check 3.5 / 7; add and minus at 11; dismiss's × at 10; equal is two of minus's bars 3 apart.
- **Whole-pixel bars, forced by the lattice:** arrow-right-to-line (x 13), chevron-last (x 12), log-in and log-out (doors at 13 and 3), plus-minus's minus (y 14), keyboard's top and bottom (y 3 and 13). Each comes from a head tip or a centred shape that must sit on whole coordinates, combined with the recorded standard 3 gap. Moving to x.5 breaks the lattice or makes the gap a near miss. All are recorded constructions, so I left them.
- **chevron-down-circle:** the chevron's box centre is 8.5, but its hull centroid is exactly 8, so it is optically centred. A 3-leg chevron centred on x 8 has no other lattice position.
- **check-check:** the stub's 1.35 to the first check is recorded (Lucide's). The 2.25 overlap cut would leave 0.94 at the filled 1.5 line.
- **No slivers or islands in the group's filled variants** (brief and re-run). Filled stories are right: rings and squares fill with marks knocked out; arrows through frames (import, share, open, log-in/out), the line glyphs and prohibited fill by weight, which matches Fluent's prohibited filled; shift and caps-lock fill the arrow while caps-lock's bar stays a line; backspace and keyboard fill the body with keys and × as holes or knockouts; share-nodes fills its rings and keeps the links as lines; exit-door fills the leaf.

## Rules or docs that should change
- `docs/specs/icons.md` square-dot row (line 1987) still says "an r 1.5 solid dot (a solid exception…, `data-dot="free"`)". It should read: "the ⌀2 centre dot (r 1, crosshair's role); filled, the dot is a hole; follows the size curve".
- `docs/specs/icons.md` square-slash row (line 1988) says "a 5px rising slash". The drawing is the falling slash (5.5, 5.5 → 10.5, 10.5), which follows the slash rule. The word should be "falling".
- `docs/specs/icons.md` prohibited row (line 1535) says the diagonal is "knocked out". The source has no filled roles: it fills by weight, as Fluent's prohibited_16_filled does. The row should say "fills by weight".
- The lint measures gaps only between separate elements, so a gap inside one multi-subpath `<path>` goes unchecked. option was the case found here: a 2.13 near miss. Suggestion: the skill should say "draw separate parts as separate paths", or the lint should measure gaps between subpaths.
- The tray rule ("tight 2.5 … into a tray or out of a box") is not applied to import's tip or share's tail (both 3.5). Either apply it (proposals above) or record in the skill that a free tail or tip inside a box may float higher (Lucide).
