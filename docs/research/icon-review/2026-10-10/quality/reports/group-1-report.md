# Group 1 report (2026-10-10)

Scope: 59 icons in Arrows, Chevrons, Undo & transfer, and Marks & symbols. Two of them are new in batch 70: arrow-up-right-circle and divide.

I rendered every icon in outline and filled at 16 / 24 / 32 / 48 and at 96 over the grid, with look.mjs `--slivers`, in family chunks. The overview sheets are in the scratchpad (`q1/o1.png` to `o8.png`). I checked each icon against:
- its newest spec row;
- the arrow-class rules;
- the shared parts: ring r 6, stop's square, the 6px marks, the check, reset's head, the tray and the door;
- the filled rules.

I also compared the two batch-70 icons with their library references: Fluent arrow_circle_up_right, Phosphor arrow-circle-up-right, Lucide circle-arrow-up, and Lucide and Phosphor divide (regular and fill).

The whole group lints clean (`gen-pilot-icons --only`, 59 sources, 102 icons with rotations; `--report` has no near misses). `geometry-audit.mjs` gives one finding, triaged below. There are no slivers or islands at 16 or 48 in any of the group's filled variants.

## Changed (applied to sources)

None. I found no rule violation, family drift, unapplied owner note, sliver or mark-size error that needed a source change. The three geometry improvements I found change recorded constructions, so they are proposals (below), not fixes.

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| arrow-right-to-line (and its turns: arrow-down-, arrow-left-, arrow-up-to-line) | Move the arrow 1 right and the bar 0.5 right. Arrow `M2.5 8H11M8 5L11 8L8 11`; bar `M13.5 3V13`. | The bar sits on a whole pixel (x 13), so at 1× it smears across two grey columns, and the ink centre is 7.75. The spec says this was forced by the lattice, but it is not. With y 8 the tip must be on a whole x. A tip at 11 with the bar at 13.5 is 2.5 between centre-lines, which is the tray rule's tight gap (1.375 of ink; 1.0 filled, at the floor). The bar becomes crisp and the ink is centred at 8, 8 (12.12 × 11.12, was 11.62 wide). The shaft grows to 8.5 (main-arrow class, ≥ 7.5). The cost: the gap changes from standard to tight. Lucide's gap is 2.67 between centre-lines and Fluent's arrow_next is about 3.3. | `scratchpad/q1/cand-arrow-right-to-line.svg` |
| chevron-last (chevron-first) | Bar `M11.5 3V13` (was x 12); the chevron is unchanged. | The same case. The bar on a whole pixel and the recorded 8.25 centre are not forced: the 2.5 tight gap puts the bar on x.5 and the ink at 8, 8 (8.12 × 11.12). The cost is the same: the gap goes from standard to tight, and the ink is 0.5 narrower. The candidate reads close to Fluent's arrow_next, whose bar is at 11.5. | `scratchpad/q1/cand-chevron-last.svg` |
| log-in | Door `M10 2.5H12A1.5 1.5 0 0 1 13.5 4V12A1.5 1.5 0 0 1 12 13.5H10`; arrow `M2.5 8H11M8 5L11 8L8 11`. | The skill says log-in stops standard (3) from the door's back, "the nearest the lattice allows". But a tip at 11 with the door at 13.5 is on the lattice and is the tray rule's tight 2.5. The door becomes crisp (x 13.5, was 13) and the ink is centred at 8, 8 (12.12 × 12.12; was 11.62 wide, centred at 7.75). Fluent's arrow_enter also sits tight. log-out cannot follow: its door on x.5 and its tip on a whole x always leave the centre 0.25 off, so it keeps the whole-pixel door and its centre of 8. That is why this is a proposal: the log-in and log-out pair would then differ in their gap. | `scratchpad/q1/cand-log-in.svg` |

All three candidates lint clean in a private copy of the generator (`scratchpad/q1/lint/`): centred 8, 8, gaps 1.38 tight. Sheet: `sheets/group-1-proposals.png` shows the current icons, then the candidates, Fluent arrow_next and arrow_enter.

## Cross-group (needs the coordinator)

None. No shape in this group carries an owner note that applies to icons outside the group. If the to-line proposal is taken, the skill's line "log-in and log-out stop standard (3) from the door's back, the nearest the lattice allows" must change. So must the 2026-10-07 report's note that the whole-pixel bars of arrow-right-to-line, chevron-last and log-in are "forced by the lattice". Only log-out's bar is truly forced.

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| arrow-up-right | approve; "arrow tail seems too long compared to the regular arrow" | **Holds.** The shaft is `M3.5 12.5L12.5 3.5` (12.7 long, the lattice length nearest the straight arrow's 12), with 7 barbs (5√2). It sits in proportion with arrow-up at 16 and 96. **Sharing the shape:** the contained diagonal (square-arrow-up-right, and arrow-up-right-circle from batch 70) has a 7.07 shaft against the straight contained arrow's 6. I checked the shorter lattice choice (`M6 10L10 6M7.5 6H10V8.5`, `q1/cand-arrow-up-right-circle.svg`). It is not usable: its head legs fall on whole pixels, and its tip and tail sit 2.05 from the ring, a near miss. So 7.07 stays. Fluent's arrow_circle_up_right has the same proportion (`q1/aurc-refs.png`). |
| rotate | replace → Fluent | **Holds.** It is arrow_rotate_clockwise in reset's construction: the r 5.59 arc, reset's 3 corner head at 10.5, 13, and a ⌀2 centre dot on the size curve. The ink centre of 7.71 is recorded. |
| exit-door | replace → Lucide | **Holds.** It is Lucide's door-open: jamb at 3.5, leaf hinged at 6.5, floor at 13.5, and a ⌀1.5 knob at 10, 8.5 that becomes a hole when filled (tight 1.19). Filled, only the leaf fills. |
| hash | replace → Fluent | **Holds.** It is Fluent's number_symbol: slanted uprights (2 over 11) with the bars offset along the slant. |

## Machine findings triage

| finding | verdict |
|---|---|
| geometry-audit: share-nodes `subgap 0.66 between subpaths 1 and 2` | **False positive.** Both links start on the left ring's centre-line, r 2 from 4.5, 8, so they join the ring. The 0.66 is between their two ends on the ring. Beyond the ring's ink they diverge at 53°, so the space between them is an open wedge (about 1.24 of ink at the ring's outer edge, widening outward), not a gap or a counter. |
| parts drift: square-arrow-up-right from square-arrow-up, 10% (moved 0, −0.25) | **Expected, under the 20% flag.** The member is the base's arrow turned 45° (the family's modifier). The frame is identical. |
| optical audit | **No outliers in class.** The containers are +4 to +5% (rings and squares are drawn larger by design). The line glyphs read small by hull, as their class does: minus −69%, chevron-down −49%, check −43%, equal −39%, trending-up −34%, divide −30% (between equal and add). The same applies to the density spread: minus +145% is one bar. |
| slivers 16 / 48, escapes | None for this group (the shared files and my own `--slivers` runs). |
| lint `--report` | Clean. The keyline "under" warnings are all recorded: arrow-up-right 2.88 (a diagonal reads small by hull), chevron-down 3.88, chevrons-right 2.88 (Fluent's 4px spacing, owner-confirmed), chevron-last 1.88, chevrons-down-up 1.88, check 2.38, dismiss 2.88 (sparse ×), sigma 1.88, and reset, history, sync and rotate 1.7 (reset's arc). |

## Batch 70: harder look

- **divide:** Holds, along with its delegated call (the bar at 7.5, 0.5 above minus's 8).
  - The ⌀2 dots need whole-pixel centres. A symmetric standard gap then puts the bar on x.5. With the bar at 8, the bar blurs and the 2.44 gap is a near miss.
  - I tested a more open candidate: dots at 3 and 12, an open 2.94 gap, Phosphor's proportion (`q1/cand-divide.svg`, `q1/divide-refs.png`). The current 1.94 gap matches Lucide's (about 2.0 at 16) and equal's 1.88 bar gap, and the candidate read loose beside equal and plus-minus. Not proposed.
- **arrow-up-right-circle:** Holds. It is square-arrow-up-right's arrow, identical and crisp, in arrow-up-circle's ring. The tip and tail are a tight 1.34 from the ring, against the straight arrow's standard 1.88; this comes from the diagonal and matches Fluent. The filled knockout stays more than 2 inside the disc.
  - The spec row's reason ("the longer of the two lattice choices, as arrow-up-right's 12.7 against 12") is slightly off. arrow-up-right took the nearer length. The real reasons are crispness and the shorter choice's 2.05 near miss to the ring.

## Checked, no change

- **Arrows** (arrow-up, arrow-up-right, arrow-left-right, arrow-right-left, arrow-up-from-line, arrow-right-to-line, corner-down-right, trending-up, move): ok. The head classes hold:
  - standalone 5 on 12;
  - arrow-left-right's 3 heads (recorded);
  - main 3 on ≥ 7.5;
  - paired 2.5;
  - move's 2.
  - Every head is on the lattice.
  - arrow-right-to-line: see the proposal.
- **Contained** (arrow-up-circle, arrow-up-right-circle, square-arrow-up, square-arrow-up-right, chevron-down-circle): ok.
  - The rings and the square are identical.
  - The arrow is shared between circle and square.
  - Filled, each has a plain knockout.
  - chevron-down-circle's box centre is 8.5 and its hull centroid is 8 (recorded).
- **Chevrons** (chevron-down, chevron-last, chevrons-right, chevrons-up-down, chevrons-down-up): ok. They use the recorded pointed-shape offsets, and chevrons-right keeps Fluent's 4 spacing (owner). chevron-last: see the proposal.
- **Undo & transfer** (undo, reply, reply-all, reset, rotate, history, sync, repeat, shuffle): ok.
  - undo, reply and reply-all share one head.
  - reset, sync and rotate share reset's r 5.59 arc and its 3 corner head; sync's two halves are exact half-turns.
  - history keeps its 2.5 head (recorded).
  - repeat uses r 3.5 rails. shuffle cuts 2.25 in outline and 2.5 filled, with 2 heads.
  - The filled gaps hold at 1.5 (reply-all's heads 1.33, sync's 1.07).
- **download, upload, import, share, share-nodes, open, log-out, exit-door:** ok.
  - The tray family follows the tray rule, with tight 1.38 tips and tails since the 10-07 integration.
  - log-out's whole-pixel door is forced (see the proposal).
  - share-nodes fills its rings and keeps its links as lines.
  - exit-door fills only the leaf.
  - log-in: see the proposal.
- **Marks** (add, minus, plus-minus, equal, divide, dismiss, check, check-check): ok.
  - add and minus are 11; dismiss is 10.
  - equal is two of minus's bars, 3 apart and crisp.
  - plus-minus's minus at y 14 is recorded.
  - check is 3.5 / 7; check-check's stub is a recorded tight 1.35.
  - All fill by weight.
- **add-circle, remove-circle, prohibited, square-plus, square-minus, square-x, square-slash, square-dot:** ok.
  - The ring and container marks are 6px, with a 5px × and slash.
  - square-dot's ⌀2 dot is on the size curve and becomes a hole when filled.
  - prohibited fills by weight (Fluent).
- **asterisk, hash, at, percent, sigma, infinity:** ok.
  - The asterisk has six 5.5 arms at 30°.
  - at uses Lucide's construction with exact r 6 and r 3.
  - percent's upright O's leave 1.93 counters with a 1.97 standard gap to the slash.
  - sigma's 8.23 centre is recorded.
  - infinity's joins are tangent.
  - All fill by weight.
