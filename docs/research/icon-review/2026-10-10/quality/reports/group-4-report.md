# Group 4 report: Type, Lists & paragraphs

I reviewed 44 icons one by one, in outline and filled, at 16, 24, 32, 48 and 96. They were checked against the skill, the spec's construction lines, each icon's family and every owner note in `owner-feedback.json`, the `reviews7` collection and `notes.json`. The groups were:

- text, sizes and colour: text, text-size, text-color, remove-formatting
- headings and styles: heading ×4, bold, italic, underline, strikethrough
- scripts and case: super/subscript, case ×3
- cursors, squares and spacing: the cursors, square-text ×2, line-height, letter-spacing, text-wrap
- quotes and marks: quote, text-quote, pilcrow, spell-check, translate, markdown
- alignment and indent: text-align ×3, indent, outdent
- lists: the list family, table-of-contents, insert-row

Two of these are new or recent: text-quote (batch 70) and table-of-contents (batch 69).

Machine inputs: the lint `--report` for all 44 icons, `geometry-audit.txt`, `slivers-16/48.txt`, `optical-audit.txt`, `parts.txt` and `escapes.txt`. `report.txt` was still empty when I finished, so I used my own `--report` run instead. Working sheets are in the scratchpad at `q4/s1.png` to `s6.png`.

Two sources changed: **superscript** and **subscript**.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| superscript | **The defect, in both styles at every size:** the 2's bowl met its diagonal at an 8.3° kink (geometry-audit). The 2026-10-08 redraw (X² on the named library) placed the 2's arc ends by hand: `M11 3.5A1.125 1 0 1 1 12.75 4.69`. SVG refits that arc to a centre at 12.01, 3.93, so it is not tangent to the diagonal: the arc ends at 142.4° and the line runs at 134.0°. The 10-07 pass had fixed this same kink on the old T version. **Side effects:** the bowl's top sat at 2.93 and its left extreme at 10.89, both off the 0.5 grid. | **Change:** the 2 is now list-numbered's numeral-2 construction, exactly, at x0 = 11 and y0 = 3 (the foot the redraw already used): rx 1.125 / ry 1, centre 12.125, 4. The S-terminal sits 30° up at 11.151, 3.5, and the tangent point at 12.94, 4.69 is solved from the foot corner 11, 6.5. The new path is `M11.151 3.5A1.125 1 0 1 1 12.94 4.69L11 6.5H13.25`. Arc and line now meet within 0.07°. **Unchanged:** the bowl's top is now on 3 and its left on 11; the foot, the X and the 1.92 standard gap are unchanged. **Ink and centre:** ink 12.37 × 11.12, centre 7.63, 8 (was 7.97 high by 0.03). | lint ok (no near misses); geometry-audit clean; slivers none at 16 and 48; looked (`sheets/group-4-after.png`) |
| subscript | The same 8.3° kink (the redraw's `M11.5 10A1.125 1 0 1 1 13.25 11.19`). The bowl's top was at 9.43 and its left at 11.39. | The same 2 at x0 = 11.5, y0 = 9.5: `M11.651 10A1.125 1 0 1 1 13.44 11.19L11.5 13H13.75`. It is the identical drawing to superscript's, moved (0.5, 6.5). The bowl's top is now on 9.5 and its left on 11.5. The gap to the X is 2.66 (open). Ink 12.87 × 11.12, centre 7.88, 8. | lint ok; geometry-audit clean; slivers none at 16 and 48; looked |

The visible change is small: the 2's terminal curls in 0.15, and the bowl runs smoothly into the diagonal instead of breaking at the join (visible from 32px).

## The B, settled (open item from the 2026-10-07 README, round 8 review)

There are three B's in the set, all owner-approved:

| icon | cap height | bowls (height, width from the stem) | how the lower bowl is larger |
|---|---|---|---|
| case-upper (owner had it reverted to this on 2026-10-08) | 4.5–11.5 (7) | upper 3.5 tall, 3.5 wide; lower 3.5 tall, 4 wide (bar at 8) | 0.5 wider; same height |
| spell-check (owner, 2026-10-05: "the bottom loop should be bigger") | 2.5–7 (4.5) | upper 2 tall, 2 wide; lower 2.5 tall, 2.5 wide (bar at 4.5) | 0.5 wider and 0.5 taller |
| bold, outline | 2.5–13.5 (11) | upper 5 tall, 6.5 wide; lower 6 tall, 7 wide (bar at 7.5) | 0.5 wider and 1 taller |
| bold, filled (solid B) | 2–14 | holes 3 and 3 tall, the lower 0.5 wider | 0.5 wider; same height |

**Settlement: no change to case-upper or spell-check.** One rule describes both owner decisions:

- Every bowl ends in a semicircle.
- The lower bowl is 0.5 wider than the upper.
- The bar sits at the cap's middle when the middle is on the 0.5 grid. That is case-upper: the middle of 4.5–11.5 is 8.
- When the middle is off the grid, the bar goes to the grid step above it, so the lower bowl is also 0.5 taller. That is spell-check: the middle of 2.5–7 is 4.75, which is off the grid, so the bar sits at 4.5.

So spell-check's taller lower bowl is forced by its 4.5 cap height, not a different design. The 10-07 pass broke this rule when it moved case-upper's bar to 7.5 (3 / 4), and the owner reverted that change. Lucide's case-upper and bold both use equal heights with the lower bowl wider; Fluent's B is taller below.

The one B outside the rule is **bold's outline**: its bar is at 7.5, but the middle (8) is on the grid. This also disagrees with bold's own filled B, which has equal holes. That is a proposal below and was not applied, because bold is approved.

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| bold (outline) | Move the bar from 7.5 to 8, with equal r 2.75 bowls: upper to x 11 (was r 2.5), lower to x 11.5 (was r 3). Path: `M4.5 8H8.25A2.75 2.75 0 0 0 8.25 2.5H4.5V13.5H8.75A2.75 2.75 0 0 0 8.75 8`. Lint ok; counters 4.43 / 4.44. The filled solid B is unchanged. | This puts all four B's (case-upper, spell-check, bold's outline and its filled B) on the rule above and matches Lucide's bold, which the owner named for this icon. The cost: the bar moves from x.5 to a whole pixel, so it is softer at 1×. case-upper's bar already sits on 8 by the owner's choice. A small, optional change to an approved icon. | `q4/cand-bold.svg` (the full source); `q4/cand-bold-outline.svg` (outline only, for the sheet); `sheets/group-4-proposals.png` (bold, case-upper and spell-check beside the candidate, Lucide bold, Lucide case-upper and Fluent text_bold) |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| numeral 2 (list-numbered's: elliptical bowl, 30° S-terminal, tangent diagonal, sharp foot) | superscript and subscript are fixed here. list-numbered is already exact (tangent within 0.1°). No other source uses this 2. | A hand-moved arc end makes SVG refit the arc's centre. The kink this causes came back in a redraw after the 10-07 pass had fixed it. | For any 2 with bowl rx 1.125 / ry 1, foot corner at (x0, y0 + 3.5): start `M(x0+0.151) (y0+0.5)`, arc `A1.125 1 0 1 1 (x0+1.94) (y0+1.69)`, then `L x0 (y0+3.5) H (x0+2.25)`. Run `geometry-audit.mjs` after any redraw of a letter or numeral. |
| spelled letters (spell-check's rule: geometric widths, a standard gap between letters) | gif (batch 70, another group) | gif's G, I and F sit 2 apart between centre-lines (detail 0.88). The rule the owner gave on spell-check says standard (2.5). This is already listed as gif's delegated call ("condensed letters with detail gaps"). | No change from me. If the owner confirms gif's call, record it as a frame-bound exception to the spelled-letters rule. gif has no B, so the B rule does not touch it. |
| the B rule | the skill's type-family line ("a B's lower bowl is larger than its upper") | The line doesn't say how. The 10-07 pass read it as "taller" and the owner reverted. | Suggested wording: "a B's bowls end in semicircles; the lower is 0.5 wider; the bar sits at the cap's middle, or on the grid step above it when the middle is off the grid (case-upper, spell-check)". |

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| bold | r1 approve: "B doesn't have to be bolded for monoline" (Lucide, Phosphor) | holds: the outline is a stroked B and the filled B is solid. The bar position is under Proposals. |
| subscript | r1 approve: "T can be bigger" | not applicable: the 2026-10-08 redraw replaced the T with an X (6 × 6), and the owner approved the X on 2026-10-09 (`reviews7`). superscript is the same. |
| text-wrap | r1 replace → Fluent: "smaller arrow, goes deeper into the last line" | holds: 2px head, tip at 7.5, the last line ending at 5 (tight 1.38) |
| quote | r1 fix: "stroke doesn't lead directly; gap between quotes too big" | holds: one r 5.5 tail runs from each drop, and the drops sit 6 apart (standard 2.0) |
| quote | r2 fix: "stroke sticks out of the base on the left" | holds: the 10-07 ring-plus-core drop, tangent at every weight. No sibling shares the 99 shape. |
| spell-check | r1/r2 replace → Fluent: "letters are not even widths" | holds: geometric widths, a 2.5 gap between letters, and the lower bowl larger (the B settlement above). The check stays off the lattice by the owner's 2026-10-05 coordinates. |
| translate | r1 replace → Phosphor; r2 replace → Fluent | holds: Fluent's "a" and a traced あ, approved 2026-10-10 |
| case-upper | (round 8, 2026-10-08) back to its pre-10-07 B; approved 2026-10-09 | holds: settled with spell-check above, no change |
| superscript, subscript | (round 8) redrawn on the named library; approved 2026-10-09 | design kept; the 2's kink is fixed (Changed) |

## Machine findings triage

| finding | icon | triage |
|---|---|---|
| kink 8.3° at 12.75, 4.69 | superscript | fixed (exact tangent 2) |
| kink 8.3° at 13.25, 11.19 | subscript | fixed |
| lattice 5.5,11 → 7,12.5 and 7,12.5 → 10,9.5 | spell-check | recorded exception: the owner's 2026-10-05 check coordinates. Both lattice moves fail (spec "Still open", 10-07). |
| subgap 2.38 between subpaths 2 and 3 (knockout) | square-text-cursor | false positive. Subpaths 2 and 3 are the right-hand serif hooks. Both end on subpath 1's stem (8, 6.25 and 8, 9.75), so they are joined; the measured "gap" is the stem between them. This is text-cursor's construction at half size. |
| parts drift 56% "from table" | table-of-contents | false positive: a name-prefix match. table-of-contents is not a member of table. |
| optical: case-lower −25%, case-sensitive −23%, quote −23%, italic −18%, bold −16%, and others from −15% to −6% | type glyphs | not defects. The letters sit on the type family's cap heights (4.5–11.5 for case, 2.5–13.5 for single glyphs). Their "under keyline" warnings (1.88; quote 2.8) are the recorded letter sizes. The owner approved each, and quote's size was set in owner rounds 1–2. |
| slivers at 16 and 48; escapes | all 44 | none |
| lint near misses | all 44 | none (`--report`: every gap tight, standard, open or detail) |

## Checked, no change

- **text, text-size, text-color, remove-formatting, heading, italic, underline, strikethrough, text-cursor, case-lower, case-sensitive, pilcrow, markdown, translate, text-align-left, text-align-center, text-align-justify, list, list-checklist, square-list, list-minus, insert-row:** ok.
- **case-upper, spell-check:** ok (B settled above).
- **text-quote (batch 70, given a harder look):**
  - The first row is exactly text-align-left's first line (2.5–10.5).
  - The bar at x 2.5 spans rows 2–3, as Lucide's does. Lines run 5.5–13.5, standard 1.88 from the bar.
  - Everything sits on x.5. The centre is 8, 7.5 (the stack rule).
  - It fills by weight, and it reads at 16.
  - Nothing to improve without leaving the stack rows.
- **table-of-contents (batch 69):** ok. It is on list-bullet's rows with ⌀2 dots at 13, and a standard 1.94 from the lines to the dots.
- **heading-1:** ok. Its 1 has a 26.6° flag, while list-numbered's 1 has a sharp 45° flag. Both are recorded, and they are different sizes (a 6-tall heading numeral against a 3.5-tall list numeral), so they were not unified.
- **heading-2, heading-3:**
  - The ink centre is 8.5. Moving the whole icon 0.5 to centre it puts the H stems on whole pixels.
  - Keeping it is the same trade as the three-line stack rule (crisp before centred), but the spec does not record it. Suggest adding a line.
  - heading-2's 2 is a different construction from list-numbered's: an r 1.5 circular bowl with an r 0.75 rounded foot corner, because a sharp corner there is 53°, under the acute rule. These are two numeral sizes, each recorded.
- **superscript, subscript (centring):**
  - superscript's ink centre is 7.63 across and subscript's is 7.88.
  - The 2's x position is set by the gap to the X. Moving superscript's 2 to 11.5 makes a 2.41 near miss, and moving subscript's to 11 makes a 2.23 near miss.
  - The only position that centres it (x0 = 12) puts the ink past the keyline. Not recorded in the spec; suggest adding it.
- **list-bullet, table-of-contents (dots):** the ⌀2 dots sit on the lines' x.5 rows (centre 3, 4.5), not on whole-pixel centres as the skill's dot line says. Dots and lines share a row, and the lines need x.5, so this is kept. Suggest recording it as a named exception.
- **line-height, letter-spacing, square-text:** the medium T (5–11, stem on 8) sits on whole pixels. This is the skill's "unless the shape must centre on 8"; ok.
- **text-wrap (centre y 8.5), list-plus (8.25), list-numbered (8.25), text-size (8.25), remove-formatting (7.88, 8.13):** each recorded in its construction line; ok.
- **indent, outdent:** the line starts differ (7 / 8), recorded in the spec (round 23): outdent at 7 is a 2.08 near miss; ok.
- **list-tree:** the trunk on a whole pixel, recorded; ok.
- **bold (filled):** the solid B is about 0.45 wider each side than the outline B's ink. This was flagged in the last pass. It is owner-approved, and a bold B reads wider, so it is not re-proposed.
- **quote:** ring-plus-core drop; ok at every size.

## Rules or docs that should change

- **The lint still misses near-tangent kinks and arc extremes off the grid.** The superscript kink, fixed on 10-07, came back in the 10-08 redraw because only `geometry-audit.mjs` catches it. Suggest one of two changes:
  - the lint runs the audit's kink check on changed sources, or
  - the redraw workflow runs `geometry-audit.mjs` before the owner sees the drawing.
- **Skill, type family:** use the B wording in Cross-group. Also note that superscript and subscript are now X², not a T, which supersedes the "7 × 8 T in superscript and subscript" line.
- **Spec:** record the centring exceptions listed above:
  - heading-2 and heading-3 at 8.5;
  - superscript at 7.63 and subscript at 7.88;
  - list-bullet's and table-of-contents' dots on x.5 rows.

## Files

- Sources changed: `apps/docs/assets/area-icons-pilot/superscript.svg`, `apps/docs/assets/area-icons-pilot/subscript.svg`
- Before / after: `docs/research/icon-review/2026-10-10/quality/sheets/group-4-after.png`
- Proposals: `docs/research/icon-review/2026-10-10/quality/sheets/group-4-proposals.png`; candidate `<scratchpad>/q4/cand-bold.svg`
