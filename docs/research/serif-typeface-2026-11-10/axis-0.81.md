# Build 0.81: the weight axis, by class

Every glyph that failed `audit_axis.py` in build 0.80, grouped by why it failed, and the one rule that each group
now follows. The numbers are the audit's own; the pictures are in `typefaces/area-serif/build/figures/axis-081/`
(build is git-ignored; `tools/weight/axis_proofs.py` redraws them from the 0.80 snapshot and the current build).

Read with: `bold-master-plan.md` (the engine), the weight research (`variable-serif-research-2026-11-14/reports/`,
"Variable serif weight consistency" and its "Weight scaling addendum"), and the construction skill.

## Where 0.80 stood

`audit_axis.py` as it was (13 stops on the Bold side, 4 on the Light), reproduced on the 0.80 masters:

| Side | Turns (new extreme or inflection) | Crossings | Thin | Fallbacks |
|---|---|---|---|---|
| Bold | 18 glyphs | 18 | 30 | Astroke, dagger, uni20A1, uni2318 |
| Light | 5 | 5 | 18 | uni20A1, uni2196 to uni2199, commaturnedabovecomb |

## The causes, and the rule for each

| # | Class | Glyphs (0.80 failures) | Root cause | Rule (0.81) | Where |
|---|---|---|---|---|---|
| 1 | A stroke across a letter, merged into one outline | Astroke, Estroke, Tdiagonalstroke, astroke, cstroke, uni20A9 (won), uni20A1 (colon sign, fallback both sides), uni20BF, Lmiddletilde, lmiddletilde, rstroke | Where the stroke's edge meets the letter's, the merged outline has a corner that is the crossing of two edge lines. Both lines move between masters, and the crossing does not move in a straight line (it misses by about t(1-t) times the move over the sine of the angle between them), so instances between the masters gain slivers, crossings and turns that neither master has. The engine also read the stroke and the letter as one shape. | In the variable font's masters such a glyph is its letter's own contours, point for point, plus each stroke as one closed contour of its own, overlapping it. Every master takes the letter as that master's letter; each stroke moves by one rule: its two ends ride the letter's node map, its long sides stay straight and parallel and part by the stroke's own weight rule (bars as bars, upright strokes as upright thin strokes, slanted ones as thin diagonals). The static Regular keeps the merged outline; the variable font keeps the overlap (overlap flag set). 59 glyphs: the 42 source glyphs normalize merged (`stroke`, `bar`, `middletilde`) and the 17 charset builds from a letter and strokes (barred and slashed letters, won, naira, peso, kip, tugrik, guarani, colon sign, bitcoin, ruble, lira sign, dong, cent, yen). A struck glyph whose letter has a sparse master at 550 takes it. | `overlap.py`; `charset.STRUCK` (one line per construction); `normalize` (layer `overlap`); `bold.overlap_masters`; `build.variable` via `overlap.vf_source` |
| 2 | A crotch moved past the curve leaving it | glottalstop, glottalstopreversed, quoteleft, quoteright, quotedblleft, quotedblright, ring_acutecomb(.case) | `set_necks` moves a crotch up or down until its neck is on target. It did so with no limit: glottal stop's crotch dropped 19 under the near-level curve leaving it (which then turned back up), the quotes' crotch climbed 57 up a curved tail past the ball's top. | A crotch never passes the level of either neighbouring node, in the master it is placed in: the curves on both sides keep running the way they run in the Regular (`bold.neck_range`). Towards the Light, which has no sparse master, the crotch goes where the worse of two misses, at the master and half way, is least (g's neck sagged 1.6 at 375). | `bold.set_necks`, `neck_range` |
| 3 | The comma, read afresh in every drawing of it | quoteleft, quoteright, quotesinglbase, quotedbl*, apostrophemod (Light thin 42 > 20), commaaccentcomb(.case) (Light thin), commaturnedabovecomb (Bold crossings, Light fallback) | Seven glyphs are the comma's 19 points at their own size (0.69 to 0.92) and turn (upright or half round), within 6 to 21 units of a sized and turned comma. The engine read each from its knots, and the readings differed: the apostrophe's tail was not read at all, the turned comma above's ball swelled over its own tail. | A part that recurs moves in every master as its own glyph does: each such contour takes the comma's move at every point, sized and turned as the contour is; a handle level or upright in the Regular stays so (`KIN`). The same rule, with any turn, makes the arrows one arrow: the diagonal arrows (Light fallback) take `arrowright`'s move turned by 45 and 135 degrees. | `bold.KIN`, `kin_parts`, `_similar` |
| 4 | Small figures and ordinals on full-size gains | sixsuperior, ninesuperior, sixinferior, nineinferior, ordfeminine (both sides) | `charset.small_figures` makes them as their figure at 0.54 with 4 units added round. The engine read them as if full size: a superior's thick round stroke took the full-size stem's absolute gain (the six's upper stroke 24 > 16 at 300). | In every master each point of a small figure or ordinal moves by its figure's (or a's, o's) point's move at 0.54; the 4 units added stay. Points are paired by the cheapest alignment round the contour (the figures have gained a node or two since the superiors were cut). This gives their stem the share of the stem's step the references give small figures: exponent 0.82 to the Bold, 0.74 to the Light (Ahrens' compensated scaling, measured 0.78 and 0.85 in 8 faces, `sign_k.py`); their hairline 0.3 and 0.4. | `bold.SMALL`, `_match`, `kin_parts` |
| 5 | Small signs on the letters' gains | asterisk (Bold turns, Light thin), dagger (Bold fallback, Light thin and turns), daggerdbl, trademark, servicemark (Light thin) | Their parts took the letters' rules: a petal 60 across gained the round stroke's absolute 64 (a balloon at 700) and lost the hairline's share to the Light (asterisk arms 23 > 15); parts under 35 across were not read on the x axis at all and took whatever slack the solve left. | One law for a small sign's every part: part(w) / part(400) = (stem(w) / stem(400)) ^ `SIGN_K`, 0.77, measured on 8 faces (`tools/weight/sign_k.py`: asterisk arm 0.81 / 0.77, dagger stem 0.75 / 0.90, trademark T 0.71 / 0.68, Light side / Bold side medians). And on every glyph, an upright stroke 18 to 35 across follows the serif tip, as a level one always did (`THIN_READ`). | `bold.SIGN_K`, `SMALL_SIGNS`, `sign_ratio`, `x_target`, `y_target`, `diag_target`, `spine` |
| 6 | A counter read as a ball | uni2318 (Bold fallback) | `balls` found the command sign's four round holes and grew them 1.4 times as if they were ink. | A ball is ink: a contour wound as a counter is never read for one. | `bold.balls` |
| 7 | A wedge accent's thin end | acute, grave, caron, circumflex, breve and their comb and case forms, hungarumlaut, dblgrave, ogonekcomb.case (24 glyphs, Bold thin 1 to 5 under) | Two things. The mark was swelled and then fitted into its measured box, which pressed every stroke back across itself and tilted its level cuts (an acute's end ran to a sliver). And the audit's thinnest cut at a wedge's point measures how sharp the point is, which falls as the measured box (1.35 wide by 1.07 tall) flattens the wedge, while every stroke of it gains weight (`thin-at-points.png`: acute across its arm 49, 58, 69 at 400, 550, 700 while its point's cut goes 27, 25, 23). | The mark's outline is carried into a box that, once swollen by d, is the measured box; d brings the mean stroke to its measured value; nothing is pressed back after the swell. Its foot and its far-side cuts stay level (`_swell_into_box`). The audit no longer reads a cut within one mean stroke of a pointed end (an ink corner under 60 degrees) as a stroke; the picture is the evidence the conductor asked for. | `bold.stretch`, `_swell_into_box`; `audit_axis.thinnest`, `points_of` |
| 8 | Tilde marks between the stops | tilde, tildecomb, tildebelowcomb(.case) | Found only by the exact test (they passed at every 25-unit stop in 0.80). | Fixed by class 7's construction. | |
| 9 | A serif or a fillet on a slanted stroke placed by knots | x (Bold turns), Whook (both sides), Nhookleft (Bold crossings) | The engine puts a slanted edge's nodes on the edge's new line, and every other node by its knots. The serif's end beyond the bracket and the far end of a short fillet or flat (a softened corner into a stem, a 3-unit notch) moved by knots alone, so the edge ran past them: x's top left serif kept none of its 47 units of reach at the Bold (the bracket had no room and turned), Whook's diagonal passed its upright, Nhookleft's notch turned over. | A serif on a slanted stroke keeps its reach from the corner its bracket rounds (where the edge's line meets the underside's level), times the serif reach rule (`serif_on_slant`); a short curve or flat between a slanted edge and another edge keeps both its nodes where they are from the corner the two edge lines make, the other edge read through its handle when it is a curve (`_fillet`). | `bold.serif_on_slant`, `_fillet`, `handles_of`, `slant_place` |
| 10 | Thick parts towards the Light lost the Bold's amounts | (found by the second method) s's turns, j's tail, g's bowl | The Bold's gains are amounts (the stem's 62, s's turns 1.26 of the round stroke's 64); run backwards they took from a 60-unit turn what they take from a 78 stem. | Towards the Light a thick part loses in proportion to itself, as the stem does. | `bold.x_target`, `y_target` |

## The checks (0.81)

- `audit_axis.py`: turns, crossings within a contour, counters and drift are tested over the whole of each master
  pair (Light to Regular, Regular to the sparse 550 master, 550 to Bold), not at stops (`axis_exact.py`): a cubic
  whose Bernstein coefficients over (u, t) keep one sign is proved free of new extremes and inflections, the rest
  are counted on a 129 by 65 grid; self-contact of a contour is solved exactly (each flattened vertex moves on a
  line, so a vertex touching an edge is a quadratic in t); a contour's signed area is a quadratic in t; nodes on
  one straight line in both masters must stay on it half way within 0.5. Overlapping contours are allowed where the
  union keeps the Regular's outer contours and holes (holes under 150 square units, `charset.SCRAP`, are not
  counted); a collision changes it and fails. Thin and monotone stay at the stops.
- `audit_bold.py --sweep`: the letters' and figures' parts at 325, 350, 375 as well as 400 to 700.
- `audit_rays.py` (second method, in `qa.py`): the variable font instanced by fontTools at 300, 350, 400, 500,
  600, 700; at fixed places round every outline a ray from the edge into the ink to where the ink ends, kept only
  across a stroke (the far edge faces back within 40 degrees, not near a crotch, no jump from its neighbours at
  400, the same far edge at every weight). Fails when a place thins towards the Bold or thickens towards the
  Light, or thins faster than the stem (less 3%).
- The 0.80 masters fail the new `audit_axis.py` by class (`build/axis081/old080/`): Bold turns 23 (the tilde marks
  newly found between stops), crossings 16, thin 8 (the wedge accents no longer read at their points); Light
  turns 8, crossings 6, thin 18, a counter and a drift (Astroke's welded corner).

## The Regular

The static Regular (`AreaSerif-Regular.ttf`) is point-identical to 0.80: 0 glyphs differ in outline or advance.
The variable font's default master is not, on purpose: the struck glyphs are their letter and strokes overlapping
(class 1). Its 400 instance differs in points from 0.80's in 144 glyphs; most only by the TrueType conversion,
which is solved over all masters together (ink within 0.71 units, one pixel at 4 a unit). The struck glyphs' ink
differs from the merged outline where the merge or the rules that ran on the merged outline changed it: Rstroke
7.2 (the merged R's bowl was trued at the seam), uni20BF 3.4, Dcroat, Eth, uni0189, uni20B1 2.1 (the merge rounded
the corner where the bar meets the stem, a meeting, which the letters keep sharp), Lslash 1.8 and 1.1, kip 1.5 (a
3-unit sliver of white between the bar and K's crotch that the merge filled), Estroke and Oslash 1.1, the rest 1.0
or under. `build/axis081/_regdiff.py build/snap080` repeats this.

## After: the numbers

`audit_axis.py` on build 0.81 (the exact tests, both sides): **Bold side 16 glyphs, Light side 9**. The same test on
the 0.80 masters: Bold 45 glyphs (turns 23, crossings 16, thin 8, after the pointed-end exclusion), Light 26. The
0.80 audit's own lists named 59 glyphs on the Bold side (18 turns, 18 crossings, 30 thin, some in two) and 23 on
the Light side. Fallbacks: Bold 1 (servicemark, upright parts only; 0.80 had
4: Astroke, dagger, uni20A1, uni2318, all four now built by rule), Light 0 (0.80 had 6).

`audit_bold.py` (434 parts) passes on both masters; `--sweep` passes at 325, 350, 375 and every 25 from 400 to 700
(0.80: g's neck sagged 1.6 at 375, fixed by class 2). `tools/serif_axis.py`: 0 serifs off their kind's median.
Everything else in `qa.py` passes (targets, outlines, parts, joins, evenness, interpolatable at kinkiness 1.0,
charset, fontbakery on both fonts: the variable font's one WARN is `overlapping_path_segments`, the struck glyphs'
overlaps, on purpose).

## Still failing, and why

| Glyphs | Side | What | Why, and the rule it needs |
|---|---|---|---|
| Astroke, Tdiagonalstroke | Bold 625 and 650 (Tdiagonalstroke also at 300) | a pocket of white (2,150 and 1,960 square units) between the stroke and the letter closes | The struck glyph's counters fill as both thicken. A clearance between a stroke and its letter is the next rule; the industry answer at Bold is a stump form by rvrn (not built: the conductor asked to see it first). |
| product, uni20B9 (rupee), registered | Bold 675 | two parts meet: ∏'s stems and its bar (4 units apart in the Regular), the rupee's two top bars (24 apart), the R inside the ring | `keep_apart` holds parts side by side; nothing holds parts stacked or nested. The rule to write: white between two parts never under min(the Regular's, spacing.MIN_GAP). ∏'s 4-unit gap is itself a Regular construction fault (the bar does not meet the stems). |
| ampersand | Bold from 575 | the tail's thin arm thins to nothing (the second method agrees: 38 > 0.9 at 700) | Its arm is read as part of a curve the solve shortens; not diagnosed. |
| one.ss01 | Bold from 675 | the flag thins (47 > 39; rays 47 > 35) | The flag's underside follows a knot the stem moves; the flag needs the head-flag rule. |
| at, thook | Bold | a thin part 2 to 3 under (29 > 26 at 500, 41 > 39 at 700) | Not diagnosed. |
| commaaccentcomb.case, ogonekcomb.case | Bold | 1 unit under at one stop (41 > 40, 17 > 16) | At the audit's whole-unit tolerance. |
| c_t, lira, section, dagger, hookabovecomb.case | Bold | a curve gains an inflection between 431 and 552, or a contour touches itself | A curve meeting a junction in a ligature or sign whose ends move by different rules (the class 9 kind, on curves); not yet a rule. |
| servicemark | Bold | fallback (upright parts only) | Under the small-sign law the small S's top stroke rises into its barb and the curve between turns back; trademark, its kin, is clean. |
| uni21E4 | Light 375 | the bar beside the arrow's point comes apart | The arrow now moves as arrowright does; the bar is read alone. Abutting parts need the same clearance rule as above, the other way. |
| whook | Light | its top middle flat (11 units) turns over (a visible notch at 300, as in 0.80) | `vertex flat` reads flats from 12 units; at 4 it misreads w's inner notches (tried, reverted). |
| ae | Light 391 | a curve gains an inflection | Not diagnosed. |
| dagger, daggerdbl | Light | the crossing at the centre pinches (31 > 23) | The crossing's near-coincident knots move by different rules; an overlap rebuild (stem and bars) is the cure the addendum names. |
| glottalstopsmall, s_p, yhook | Light | a crotch pinches (19 > 14, 30 > 23) | Crotches towards the Light have no neck rule of their own. |

`audit_rays.py` (second method) flags 72 glyphs: 55 on the Light side only, places on curving strokes that at 300
are 0.60 to 0.67 of 400 where the stem is 0.705 (j's hook, J's bowl, g's bowl, the six's upper stroke, r's arm,
the section's tail): read at the same place on the curve, the thick part moves along the stroke as the contrast
falls; 6 on the Bold side only and 11 both, most of them rays through a junction its filters do not catch (Q's
tail at the bowl, ə's bar, ʕ, ɂ), and two real ones that `audit_axis.py` also has (ampersand, one.ss01). It is in
`qa.py` and fails; its findings are listed in `build/weight/audit-rays.txt` and are not yet triaged one by one.

## The conductor's addendum, checked against this table

- Right: strokes through letters (class 1) and the bar-through-bowl signs are best as overlaps; the counters
  that fill at the Bold (Astroke, Tdiagonalstroke) are where a stump form would come in.
- Not this face's cause: x failed at its serif on a slanted stroke, not at the crossing (class 9 fixed it with
  x's Regular unchanged); the asterisk, daggers, ⌘ and trademark failed on how their parts were read and weighed
  (classes 5 and 6), not on welded corners; the trademark's T and M and the registered sign's R and ring are
  already separate contours. They were not rebuilt as overlaps.
- The sign exponent measured here is 0.77 (mean of the three sign parts' medians on 8 faces), not 0.65; Georgia
  Pro holds its signs (0.26 to 0.47). Small figures follow their figure (class 4), which gives 0.82 and 0.74.
- The floor of 0.85 times the o's hairline is not used as an absolute floor: the Regular itself has strokes under
  it (the superiors' hairline 33, every serif tip 30). Towards the Light the second method instead fails any place
  that thins noticeably faster than the stem.
- No intermediate master was added. No rvrn swap was built.

## Round 2 (after the glyph branch's merge)

| # | What | Rule | Where |
|---|---|---|---|
| 11 | Default g in the Bold fell back (node 7, the link's upper edge into its curl, bent 2.8 degrees against 0.2): straightening the handle back onto the line put it past the curve's other handle (the curl's two handles are 2 units apart in the Regular) | After a smooth node's handles go back on one line, the curve's other handle slides along its own direction towards its own node until the two are in order; no tangent changes. It also brought servicemark off its fallback | `bold.order_handles` |
| 12 | Symmetric signs read arm by arm: the dagger's left arm a larger lobe than its right at 700 | A sign drawn symmetric keeps the symmetry in every master: each point's move, less the glyph's shift (read on the points every symmetry pairs), is the mean of its images' moves turned back, over the group the drawing's mirrors and turns make. A symmetry counts when 0.8 of the points have an image within 6 units (15 for a turn) whose images close on it; applied after the engine and again after the last guards | `bold.symmetries`, `symmetric` |
| 13 | A stroke across a letter took the thin diagonal's law (1.32 at the Bold) | It is a hairline, slanted or not: 1.24 | `overlap.stroke_weight` |

New check: `audit_axis.py` symmetry. A sign with a symmetry fails when a point's move (less the glyph's shift)
differs from its image's by more than 1.5 units at a master (a unit, and half a unit for the mean of whole-unit
moves rounded); moves are linear, so the masters bound every weight between. The 0.80 masters fail it on 20 glyphs
(Bold) and 23 (Light).

Round strokes against the stem (`tools/weight/round_stem.py`, o's thickest cut over n's stem at 300 / 400 / 700):
Georgia Pro 1.102 / 1.107 / 1.109; Source Serif 4 1.143 / 1.117 / 1.056; Literata 1.070 / 1.087 / 1.057; Area
Serif 0.81 1.054 / 1.051 / 1.043. Area's rounds already follow the stem within 1% at their thickest; the second
method's Light flags on curves (j's hook, J's bowl, the six, g's bowl, r's arm, the section's tail) are places part
way round a curve, not its thickest cut: there the thick part moves along the stroke as the contrast falls. No
round-stroke rule was changed for them.

The asterisk is not rotation-symmetric in the Regular (its six arms are drawn up to 15 units apart, turned), so only
its mirror across the level holds. Building it from one arm turned (`build/axis081/star_try.py`) made a symmetric
Regular, 7 units of ink from 0.80's, but the engine's reading of the lone upright arm swelled it into a lobe at the
Bold; not adopted.

Overlaps on screen (`tools/weight/overlap_render.py`): see the final report.

### Round 2 results (build after the merge)

- Fallbacks: none on either side (g and servicemark came off theirs by rule 11).
- `audit_bold.py` 434/434 on both masters; `--sweep` clean at 325 to 700 (g included); `curvecheck.py` clean.
- `audit_axis.py`: Bold 23 glyphs (Astroke, Tdiagonalstroke, ampersand, asterisk, at, c_t, commaaccentcomb.case,
  dagger, daggerdbl, exclam, exclamdown, hookabovecomb.case, lira, multiply, ogonekcomb.case, one.ss01, product,
  registered, section, thook, uni20B9, uni2318, uni2715); Light 14 (ae, currency, dagger, daggerdbl, g,
  glottalstopsmall, gstroke, multiply, s_p, uni21E4, uni21E5, uni2318, whook, yhook). The new symmetry check
  accounts for multiply, uni2318, uni2715 (a turn's moves rounded, 2 to 5 units apart); exclam, exclamdown,
  asterisk, dagger and daggerdbl gained a turn where the symmetric moves undo `fix_turns`' handle changes. Light g:
  its loop thins into the link (39 > 13 at 300); a neck rule for crotches between two curves (`curve_crotches`) was
  tried and reverted (it moved C, Q and others and 12 necks missed their targets).
- The hairline law for struck strokes did not keep Astroke's and Tdiagonalstroke's pockets open; product, rupee
  and registered still meet at 675: no white-between-parts floor was built. No stump form was built.
- Static Regular: the 11 g glyphs the glyph branch redrew differ from 0.80 (theirs); nothing else.
- Overlaps on screen (`tools/weight/overlap_render.py`, FreeType, 13 / 16 / 64 px, overlaps kept against removed
  by the instancer): the glyf overlap flag is now set per glyph (it was not: the font-level lib key alone does not
  reach the variable font's glyf). No white sliver at 400 or 700; at 300, 20 renders have pixels up to 16 of 255
  lighter (sub-pixel). Where two edges meet, anti-aliasing adds their coverage: 42 glyphs have pixels up to 37 of
  255 darker. The static Regular has no overlaps left in these glyphs.
- Kerning per master: not started.
