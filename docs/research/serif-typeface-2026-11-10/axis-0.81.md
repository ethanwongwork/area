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

## Round 3

Build after round 3: `audit_axis.py` **Bold side 11 glyphs** (round 2: 23), **Light side 5** (round 2: 14); no
fallbacks; `audit_bold.py` 434/434 on both masters; `--sweep` clean 325 to 700; `curvecheck.py`, `audit_charset.py`,
interpolatable, fontbakery on both fonts pass. `audit_rays.py` 74 glyphs (triaged below). Logs: `build/axis081/`
(`r3k.txt`, `qa-r3k.log`, `ax-r3*.log`, `rays-r3j.log`).

| # | What | Rule | Where | Before > after |
|---|---|---|---|---|
| 14 | Signs of balls, waists and tapers (dagger, daggerdbl, asterisk, exclam, exclamdown, quotedbl, quotesingle; found by `arms.is_sign`: a P/S glyph, not a mark, whose contours are dots or arms with a round end and nothing straight but end cuts) | Each arm is a centreline (its axis) with a half-width profile read from the Regular. A master's arm is the same centreline, h(s) times one f; the arm keeps its length: within the junction the arm is the junction scaled by f about its centre (so a crotch is one point of both arms), the round end from the ball's widest place to its tip is the ball scaled by f about the tip, the body between runs evenly. Handles take the profile's own affine stretch where they lie (a curve keeps its inflections) and a level or upright handle stays so. Arms alike within 6 units (length, both zones) are one part (their mean); a star's arms lie at exact turns. f = (stem ratio)^0.77, capped (one f for all arms) where two arms of one contour would close their white under the white law (row 15): Bold f 1.199 asterisk, 1.264 dagger, 1.288 daggerdbl, 1.569 the rest; Light 0.764 all | `arms.py`; `bold.bold_font` (signs after the letters, then `symmetric`) | dagger, daggerdbl, asterisk, exclam, exclamdown: turns gone both sides; dagger/daggerdbl Light thin (31 > 20) gone |
| 14a | The Regular's signs, each arm drawn once (Regular change, listed below) | A contour symmetric about its upright is its right half and that half turned over, point for point (`arms.mirrored_half`); the asterisk is its upright arm (made symmetric) and the arm turned to 30 degrees (a node added at each of its own extremes, exact splits), the other four arms their exact mirror images; the crotch between two arms is where the arm's edge, run on along its tangent, meets the half-way line. Libre Baskerville's asterisk had six arms drawn apart (side arms 3 to 6 nodes, reach 193 against 200; left and right side arms of different node structure): accidental, so one part | `arms.regular`, in `normalize` before `turned_pairs` | asterisk ink moves 7.8; the rest 1.5 to 2 |
| 14b | Symmetry made exact | Moves are averaged over the group the drawing's symmetries generate; a symmetry counts only when the points pair as a group (`bold._consistent`: the multiply sign's quarter turn pairs a soft corner's handles the other way from its mirrors, so its mirrors are kept); each orbit's first point is rounded half away from zero and its images take its move turned exactly wherever the turn keeps whole units (mirrors, quarter and half turns); whole-unit rounding that bends a shallow curve is settled by moving its two handles at most a unit, the same on every image (`settle_turns`) | `bold.symmetric`, `sym_group`, `_round_orbits`, `settle_turns` | symmetry check tightened: 0 for mirrors and quarter turns, 0.5(\|cos\|+\|sin\|)+0.5 for other turns; multiply, uni2318, uni2715 pass |
| 15 | White between two parts of a glyph | It is a counter: least(w) = max(white(400) x counter(w), min(white(400), floor(w))). counter: the letters' closed counters master over Regular (median of a b d e g o p q A B D O P R 4 6 8 9 0, each the largest circle it holds): 0.837 Bold, 1.055 Light. floor: the narrowest white passage in a-z A-Z at that master: 30.3 Bold (Q), 32.1 Regular and 32.4 Light (B's notch). Held where the Regular's white is narrow (under twice the Regular floor, 64): side by side, `keep_apart` moves the parts apart to it (towards the Bold; quotes now 33 to 36 wider at 700 instead of 13 apart); stacked or nested, the parts give way into themselves, thinner first, each by at most what it gained there over the Regular (`keep_white`), read across the Regular's narrowest place so parts that already meet read negative | `white.py`; `bold.keep_apart`, `bold_font` | product, rupee, registered no longer meet (rupee 24 > 11.7 at 700, registered 38 > 8.4: both short of the law's 24 and 32, the gains are spent; see below) |
| 15a | product's 4-unit gap in the Regular | The stems run 2 units into the bar: one outline (Georgia Pro: one contour; Source Serif 4: stems overlapping the bar) | `charset` maths (Regular change) | crossing gone |
| 15b | Parts drawn to touch | Nodes drawn at one place stay at one place; the straight edge a node touches (or the edge drawn in two pieces meeting at it) takes the node's move across itself, with its soft corners (`keep_touching`) | `white.keep_touching` | uni21E4 Light crossing gone; uni21E5 Light still crosses at 300 (below) |
| 15c | Stacked marks (coordinator's addition) | A mark placed beside another mark with no anchor between them keeps their ink centres' relation; then any two marks of a composite keep the white law between them (the later mark moves away along the line between their centres) | `bold_font` composites | 120 composites with two or more marks: 37 closer than min(Regular, 13) at the Bold before, 0 after, at 300 and 700 (`build/axis081/_marks.py`); ầ's grave back beside its circumflex |
| 16 | A thin arm leaving a thick stroke (ampersand's tail arm, 25 > 13 at 700) | The crotch lies on the thick stroke's moved edge at the arm's Regular width there times the hairline ratio from the arm's moved straight edge; its arm-side handle keeps its angle to the curve's chord. Only a crotch whose arm width collapsed under half moves (Bold: ampersand, ae) | `white.arm_crotches` (before the mid master and `fix_turns`) | ampersand thin and crossing gone |
| 17 | Necks between two curves (Light) | The neck is the two outlines' nearest approach across the ink at a crotch whose two segments are curves; it keeps the hairline's share of the Regular's (0.847 at 300). The far edge's node nearest the neck gives way first (g's lower counter's corner came 35 left at 300 where the crotch came 5), then the crotch, each within its neighbours' box. Only a neck run under the serif tip at that weight (23) is this rule's: Q and C keep theirs | `white.keep_necks` | g, gstroke thin gone (13 > 31.8) |
| 18 | whook's 11-unit apex flat | A flat on a zone line is a vertex's from 8 units (off zone lines still 12: w's 4-unit notches are not flats). No Regular change needed | `bold.bold` vertex flat | whook Light crossing gone |
| 19 | Mid master turns | `fix_turns` tests the sparse master at the quarters and an eighth as well as half way | `bold_font` | (c_t, lira, section remain) |
| 20 | audit_rays junction zones | A junction zone is everything within one local stroke width (the ray's own length) of a branch node (concave corner) or of a place where two contours' edges cross; rays starting there are skipped. Picture: `rays-junction-zones.png` | `audit_rays.py` | 72 > 74 flags (the zone rule replaced the 0.6 rule; fewer places kept, 35,742 > 33,305) |

Bearings hook (coordinator): `bold.bearing_change` reads `light_bearings.json` through `bold.light_bearings()` when
the file exists and v["f"] < 0; otherwise unchanged.

### Regular changes (static Regular TTF against round 2: 8 glyphs differ, nothing else)

| Glyph | Change | Ink moved at most (units, raster) | Points |
|---|---|---|---|
| asterisk | one arm: upright arm symmetric, 30-degree arm turned from it, four mirrors | 7.8 | 111 > 168 |
| dagger | right half turned over (left top arm's 6 stray nodes gone) | 2.0 | 73 > 67 |
| daggerdbl | right half turned over | 2.0 | 108 > 120 |
| exclam, exclamdown | stroke from its right half (exclamdown is exclam turned) | 1.5 | 31 |
| quotedbl, quotesingle | from the right half | 2.0 | 26, 13 |
| product | stems meet the bar (the 4-unit gap closed) | 4.0 | 76 |

Before over after: `12-arms.png`, `13-white.png` (sheets draw 0.80 over now).

### The stress angle (item F's claim, checked)

`tools/stress_angle.py` (`stress-angle.png`, `build/axis081/stress-angle.txt`): thickness against angle round o, c,
e, s at 300, 400, 700, rays from the box centre. o's thickest place: Area 176 / 4 degrees at all three weights;
Georgia Pro 192 > 186 > 180; Source Serif 4 186 > 186 > 176. c: Area 218 > 204 > 194, Georgia Pro 224 > 214 > 198,
Source Serif 4 218 > 214 > 214. Area's stress does not drift where the references' holds: the claim "the thick part
moves along the stroke" is not what happens on o and c, and no stress rule was added. The 300/400 ratio round o:
Area 0.706 to 0.726 everywhere (the stem's 0.705); Georgia Pro 0.62 to 0.66; Source Serif 4 0.58 to 0.59. The
references' rounds thin faster than their stems towards the Light; Area's o does not. (e and s are not round: the
centre ray reads the bar and the spine, so their numbers are not stress angles.)

### audit_rays triage (74 glyphs)

- **Light, thinner at 300 than the stem's ratio (55 glyphs)**, ratios 0.47 to 0.67 at one place each: j and every
  j-tail glyph (j, uni0237, uni0249, f_j, f_f_j, eng-to-come), J and its family (uni0248), the hooked IPA letters
  (uni0253, uni0256, uni0257, uni0260, uni0266, uni0272, uni027D, uni027E, uni0283, uni0288, uni01A5, uni01B3,
  uni01B4, uni0191, uni0198, uni0199, uni024A, uni024B, uni024D, uni2C72, uni2C73), r's arm, six, eight, eth,
  dollar, sterling, lira, florin, integral, section, partialdiff, at, ogonek, the eighths and superior/inferior
  eight, zero.zero's slash, s_t, s_p, uni2120, uni018F, uni0242, uni0295. Every one is a place part way round a
  curved hook or tail, not at a round's thickest (the stress check above shows no drift). These places are on
  curves whose thin end is a hairline (0.847 at 300 by the hairline law) and whose thick end is a round stroke
  (0.705); a ratio under both is real and not explained by stress drift. Not fixed: it needs a rule for the
  transition along a tapering curve (the thickness at a place between a thick and a thin end follows the two ends'
  laws in proportion), which round 3 did not write. The references' rounds run to 0.58 to 0.66 at 300, so 0.60 to
  0.67 is within their practice; uni0242 (0.47), uni0295 (0.51), section (0.52), florin (0.53) are not.
- **Bold, thinner at a heavier stop (18 glyphs)**: c, cent, uniA793, uni023C (c's upper terminal 30.9 > 28.6 at 700:
  the barb end's cut, a pointed end the ray reads from its side); Q (the tail where it meets the bowl, 53 > 44: a
  junction the zone rule does not reach because the tail's crotch is a smooth meeting); ampersand (the arm, 48.9 >
  28.9: the arm's middle still thins though its crotch is now placed, audit_axis passes it); one.ss01 (the flag,
  47 > 35: real, item C not done); registered (R against ring, the law's give, 39 > 32); ring_acutecomb, a.ss03,
  fl.ss04 and f_f_l.ss04, ae, uni027D, uni0288, uni018F, uni0242, uni0295: one place each, 2 to 3 units at 700, not
  diagnosed.
- **Light, thicker at a lighter stop (14 glyphs)**: S, z, z.ss06, uni01B6, uni2081 (a spine or diagonal read where
  the neck rule or the diagonal's Light rule widened a place; 3 to 4 units), dollar, ampersand, oe, eth, Q, one.ss01,
  uni018F, uni0242, uni0295: not diagnosed one by one.

### Still failing after round 3, and why

| Glyphs | Side | Why |
|---|---|---|
| Astroke, Tdiagonalstroke | Bold 625 to 700 | The pocket (Astroke 40 across, Tdiagonalstroke 31) closes: the letter's own legs and bar fill it and the stroke's gain on the pocket side is 4 units. The white law cannot keep it without thinning the letter. `stump-struck.png`: the honest attempt beside the stroke cut where it crosses the letter. **The owner's decision**; no swap built |
| hookabovecomb.case | Bold | crossing; not diagnosed |
| at, thook, commaaccentcomb.case, ogonekcomb.case, one.ss01 | Bold | thin (at: the a's foot at the junction, 29 > 18; thook 41 > 39; the comma accent and ogonek 1 unit, at the audit's whole-unit tolerance; one.ss01's flag 47 > 37). Item C's reading rules not written for these |
| c_t, lira, section | Bold | an inflection between the Regular and the sparse master, at 431 to 550 |
| uni21E5 | Light 300 | the merged arrow-and-bar crosses itself (0 > 1) where the point's coincident nodes meet the bar's edge |
| glottalstopsmall, s_p, yhook | Light | a crotch with a straight side pinches (19 > 14 to 30 > 23); the neck rule reads curve-curve crotches only |
| ae | Light 391 | an inflection, not diagnosed |
| g.ss02 | (law, not an audit) | the ball-to-bowl white inside one contour: 62 at 400, 55.5 at 500, 47.7 at 600, 38.2 at 700 against the law's 52 at 700; the law is held between contours only |

### Overlaps on CoreText (item H)

`tools/ct_render.swift` (CoreText, compiled with swiftc) and `tools/ct_overlaps.py`: the 59 struck glyphs at 300,
400, 700 and 13, 16, 64 px, the variable font (overlaps kept) against the same instance with overlaps removed by
fontTools: differences up to 42/255 lighter and 44/255 darker, all along curved outer edges (`coretext-overlaps.png`:
cent and Oslash, difference in colour), none at the overlaps: they come from pathops re-approximating the curves
when it removes the overlaps, not from the overlaps. Coinciding edges: no struck stroke's straight edge lies on a
letter's edge (within 2 units over more than 2) in the Regular or the Bold; in the Light, Rstroke's stroke lies on
R's edge for 74 units. No inset rule was written (one case).

## Integration round (the three branches merged, 15 November 2026)

Final (`typefaces/area-serif/build/qa-081.log`): `audit_axis.py` Bold side 4 glyphs (at, commaaccentcomb.case, ogonekcomb.case thin; hookabovecomb.case crossing) plus Astroke and Tdiagonalstroke HELD; Light side 0; `audit_rays.py` 33 glyphs (22 when run at 300 325 350 375 400 450 500 550 600 650 700); `audit_kern.py` pass at all eleven of those weights; `audit_bold.py` 434/434 both masters, `--sweep` clean.

Merged tree before this round (`build/m1/`): `audit_axis.py` Bold side 11 glyphs (Astroke, Tdiagonalstroke,
hookabovecomb.case crossings; at, commaaccentcomb.case, ogonekcomb.case, one.ss01, thook thin; c_t, lira, section
turns), Light side 5 (ae turn; uni21E5 crossing; glottalstopsmall, s_p, yhook thin); `audit_rays.py` 72 glyphs;
`audit_kern.py` pass at 300 350 400 550 700; `audit_bold.py` 434/434 both masters.

| # | Item | Cause | Rule | Where | Before > after |
|---|---|---|---|---|---|
| 21 | The Light's side bearings, two paths | build.py swapped `bold.bearing_change` for `spacing.light_bearing_change`; `bold.light_bearings()` read light_bearings.json in a format it does not have (it fell through to the rest value, which by chance equals the Bold's run back) | One path: `bold.bearing_change` reads the file's `sides` per character for the Light; the swap is gone. Equal to the kerning branch's function for all 1,102 glyphs. A glyph whose outline a later rule changes (crotches, necks, tapers) takes its sides again | `bold.bearing_change`, `light_bearings`, `check_light_bearings` (in qa.py) | S's left side 1.1 off in the Light > 0 |
| 22 | Along a tapering stroke (eng 61.8 > 41.2 at 300; 55 Light ray flags) | The engine reads a stroke at its extremes; part way along a tail or hook the thickness followed knots | Each place keeps its ladder law's share of the Regular's thickness there: stem 0.705, hairline 0.847, tip 0.767 at 300, interpolated by the Regular thickness between (one continuous law, `taper_law`). Read as audit_rays reads a place; the curve the place lies on and the curve its ray ends on retune their two handle lengths only, no new turn, no place past its law. Towards the Bold the same law holds only places the engine read thinner than the Regular | `white.keep_taper`; `tools/taper_plot.py` (`img/081/10-taper.png`) | glyphs flagged for thinning faster than the stem at 300: 53 > 15 (Light "thicker" 14 > 7, Bold "thinner" 18 > 17); eng 0.667 > 0.694 at its worst place (a node; the rays floor is 0.684) |
| 23 | glottalstopsmall, s_p, yhook pinch (Light) | The neck rule read curve-curve crotches only | Every crotch; a straight-sided crotch slides along its straight side until the neck is the hairline's share (parts.solve's rule); a Regular neck under the tip is no branch (E F L Z AE OE corners, 20 to 28, untouched) | `white.keep_necks` | thin 3 > 0; yhook 8.5 > 29.3 at 300; k, kgreenlandic, f_k, eth necks held as well; 434/434 kept |
| 24 | uni21E5 crossing (Light 300) | ⇤ was two contours (arrow and bar touching), ⇥ one merged outline; the engine read each on its own | ⇥ is ⇤ turned over in the Regular (charset.MIRRORS, with ⌫/⌦) and in every master (`mirror_pairs`, `turn_over`); `audit_axis.py` mirror check (0.80's Light fails it: braceright) | `charset.MIRRORS`, `bold.mirror_pairs` | crossing gone |
| 25 | at, thook, one.ss01, comma accent, ogonek (Bold thin) | Strokes no reading rule reached: the one.ss01 flag's underside followed knots (its points kept their y), the ogonek's tail and thook's hook likewise; the comma accent's upright cut is a slanted tail's (rays across it stay 0.99) | Row 22's law towards the Bold for places read thinner than the Regular | `white.keep_taper(only_thinner)` | thook, one.ss01 pass; at, commaaccentcomb.case, ogonekcomb.case remain (below) |
| 26 | Turns in c_t, lira, section (Bold), ae (Light) | One cause: `fix_turns` tested blends (halves and quarters) and the instances turned between them (t 0.08 to 0.45). c_t and section were also S-turns drawn at a node (c_t's start sin -0.03 in the Regular, +0.48 in the Bold) | `fix_turns` tests the whole pair exactly (axis_exact's Bernstein test), and mid to Bold; an S's inflection at a node (or a curve out of a straight) keeps its start bending the Regular's way: its far handle slides along itself until it does (`inflection_nodes`) | `bold.fix_turns(exact)`, `inflection_nodes` | lira, ae fixed by the exact guard; c_t and section by the node rule |
| 27 | g.ss02's ball under its bowl (62 > 38 at 700; law 52) | The white law was held between contours only | The ball's rise towards the Bold stops where the white inside the one contour (ball to bowl, nearest approach) keeps the law; the mid master takes the law's counter at 550 | `charset.single_g_points(least_white)`, `ball_white` | 38.2 > 52.0 at 700 |
| 28 | Ɍ's stroke on R's edge (Light, 74 units) | The stroke's top (hairline law) landed on the counter's floor | A stroke whose side would lie on its letter's edge ends where that edge begins (plus its corner radius); the letter's own bar carries on. Ink change in the Light -125 square units (the stroke stood 2 units below R's bar); `audit_axis.py` seam check | `overlap.inset_ends` | seam gone |
| 29 | Astroke, Tdiagonalstroke (Bold 625 to 700) | Pocket closes (round 3) | Held as the one expected failure: `audit_axis.AWAITING`, printed every run and in qa.py's summary as HELD; `stump-struck.png` now shows both glyphs (it dropped the second row) | `audit_axis.py`, `qa.py`, `tools/weight/stump.py` | the owner's decision |
| 30 | The asterisk at 700 nearly Regular | Capped at f 1.199 by the white between its arms. Ink gain over n's gain: Area 0.737; Georgia Pro 0.819, Source Serif 4 0.898, Literata 0.935 | Its arms may reach by the references' asterisk span change (Bold 1.047, Light 0.983) only as far as no curve gains a turn. At the Bold any reach above 1 added four inflections (body and ball zones drawn out alike or the body alone), so the Bold keeps reach 1 and f 1.199; the Light takes 0.983. With reach 1.047 the gain was 0.826 (inside the references'): the arm's handles need their own reading of a longer arm first | `arms.REACH`, `reach_of`; `bold.bold_font` (the guard) | not fixed at the Bold |

Still failing after this round, and why:

| Glyphs | Side | Why |
|---|---|---|
| at | Bold 575 to 700 | The a's bowl runs diagonally into the ring: an oblique round stroke that neither the upright nor the level strokes read. The counter's nodes take the upright strokes' map, the junction notch other knots, and the stroke between collapses (29 > 17 at 550); handle lengths (row 22) cannot open it. Needs a reading for an oblique stroke between a counter and a notch |
| hookabovecomb.case | Bold 552 | Its curl is a loop of the outline round its ball (34 points, the lowercase hook's at 0.712 within 4.6 units). The engine does not read the loop as a ball; it keeps the lowercase's size and collapses in the capital form. Taking the lowercase's move (KIN) did not open it (tried, reverted) |
| commaaccentcomb.case | Bold 700 | The audit's thinnest cut is an upright cut through the comma's slanted tail near its point: 43.0 at 400, 41.1 at 550, 39.9 at 700 (1.4 under the 41.3 floor, past the one-unit tolerance), while every ray across the stroke keeps 0.99 or more of the Regular. Not a rounding matter (masters are whole units; the miss is 1.4); the cut is not across the stroke. Left failing: changing the tolerance is not justified by these numbers, and a cut-direction rule for slanted tails is not written |
| ogonekcomb.case | Bold 450 to 675 | Its thin tail thins by 2 units (17.4 > 15.5 at 475): real. The taper law moves its two curves' handles (deficit 26.6 > 10.9) but the thinnest place sits at a node it cannot move |
| Astroke, Tdiagonalstroke | Bold | HELD: the owner's decision |
| asterisk (colour, not an audit) | Bold | Lighter than the references' Bold asterisks (row 30) |

`audit_rays.py` after this round: the remaining flags are of five kinds (`img/081/rays-flags.png`, each drawn):
C and c terminals (C ꞓ Ȼ ₡; c ꞓ ȼ ¢), 2 to 4 units at 600 and 700, the ray read from the side of a barb's cut;
junction rays in ə ʕ ɂ & ® (rays through a bar, a counter or a ring that the junction zones do not catch); Light
places at nodes on the IPA hooks (ɖ ɲ ɋ Ɩ Ƙ Ⱳ Ƴ ⱳ ƴ), ſp, ƒ, @ and §, where the taper's handles cannot reach (nodes stay);
Light "thicker" places at crossings (ð, œ, $); and Σ's top arm at 500, Ƒ's hook at 700, ʈ's top at 500.

## Close round (15 November 2026)

Rules and readings added after the integration round, each tried on the built masters first (scratch builds of the
Bold and Light from the normalized Regular) and then in one full `qa.py` build. Numbers below are from that build
unless marked as the scratch run.

| # | Item | Cause | Rule | Where | Before > after |
|---|---|---|---|---|---|
| 31 | Figure 5 drew other glyphs in the 0.81 rows (∏ ₹ as "l Ế", ⌘ as "ớ", ₩ ₦ ₱ ... as accented a and e) | `shapelib.hbfont` cached HarfBuzz fonts by `id(tt)`; `figs_081_close` makes a temporary instance per row, and a freed instance's id was reused by the next, which was then shaped with the freed font's glyph order (0.80's). The font was right | The cache keeps a weak reference to the TTFont it was made from and checks it | `tools/shapelib.py` | every figure from the same code path redrawn and looked at: only `5-signs-struck.png` mixed two fonts in one run (the others draw one font per run or keep their fonts alive) |
| 32 | @ (Bold thin, 29 > 17 at 550) | The a of @ has a slanted stem: its right side a line 15 degrees off upright, its left side the counter's right extreme. The engine reads a stroke between two knots on a scan line; the line has no knot at the extreme's height, so no stroke was read: the stem stayed 92 > 91 at the Bold while the counter rode the knot map 44 right into the bowl's lower stroke | A slanted stem with one straight side is a stroke: its level width at the facing extreme takes `x_target`; the extreme moves level and every point of its contour between it and the far extreme by its share of the move (the knot map corrected at the knot the line lacks). Towards the Bold only: towards the Light the corrected map ran the counter into the a's top crotch, which it does not carry (10 at 350 in the scratch run) | `white.slanted_stems`, `keep_slanted_stems`; `bold.bold_font` (after the tapers) | @ thinnest across the stroke 27.0 at 400; integration 18.7 / 14.7 at 550 / 700, now 33.5 / 35.6; its stem at the counter's extreme 91 > 154 at the Bold |
| 33 | The comma accent below a capital (Bold 700, 41.3 > 39.9) | The audit's thinnest cut was a level or upright scan through a slanted tail: w / cos(slant), and the tail turns upright as it thickens. Rays across the stroke keep 0.99 | `audit_axis.thinnest` reads every span that is a stroke as the shortest cut through its middle, turned up to 60 degrees, ending on two edges facing within 40 degrees; a span no such cut crosses is no stroke; a cut within half its length of a stroke's cut end reads the end | `audit_axis.thinnest`, `chords` | comma accent 36.7 at 400, 37.9 at 700 (passes). On the 0.81 integration masters 410 of 978 glyph-sides' Regular readings move by over 0.5; results that change: the comma accent passes; C, Cbar, Q, s, one.ss01 (Bold) and ƴ (Light) newly fail (on the integration masters); see the final list |
| 34 | The asterisk light at the Bold (ink gain 0.737 of n's; references 0.819 to 0.935) | Its arms keep the Regular's length, so the white between the balls caps f at 1.199; drawing a longer arm out evenly (body and ball, or body alone) tilted the turned arms' level handles against their curves: four inflections at reach 1.047 | A longer arm moves its outer part whole: from its innermost smooth node to its tip it is its Regular scaled by f about the tip and carried out along the axis (a similarity: nothing there turns); the junction scales by f, the part between takes up the length. The Bold reach is the least that brings the ink gain to the references' least (Georgia Pro 0.819), within their span changes (at most Literata's 1.092). The Light keeps 0.81's map (0.983) | `arms.Arm.along`, `INK_GAIN`, `REACH_MAX`; `bold.bold_font` (solved by halving) | reach 1.003 > 1.065, f 1.203 > 1.197, ink gain over n 0.737 > 0.820, no turn, both mirrors kept |
| 35 | Places a taper's handles cannot reach (Light: IPA hooks, euro, glottal stop reversed) | `keep_taper` changes handle lengths only | Towards the Light, a place still short of its law by more than 3% after the handles moves its places: the smooth nodes of its curve and of the curve its ray ends on, each rigidly with its handles (a node with level handles moves level only), and a straight cut end under 30 grows along itself; corners never; no new turn or crossing. Towards the Bold it moved the quotes' nodes on the Bold master alone and the tail dipped between it and their mid master (40.8 > 35.3 at 675), so the Bold keeps handles only | `white._taper_places` (`keep_taper(nodes=...)`) | see the rays list |
| 36 | audit_rays reads a cut end and junctions with smooth sides | c's and C's terminals: the ray started at the cut's corner and read the end from its side; ə ʕ ɂ: rays through a bar or a bowl junction whose sides are smooth curves | End zones (a ray starting within half its length of an outward turn of 60 degrees in 12 units of outline), soft crotches (an inward turn of 90 degrees in 12 units) as junction zones, and a ray kept only when its return ray, along the far edge's normal, lands within half its length of its start | `audit_rays.end_corners`, `END_ZONE`, `SOFT_TURN`, `RECIPROCAL` | on the integration build's own font: 33 glyphs > 21, places 33,700 > 23,240 (452 glyphs read > 394) |
| 37 | "s j" across a word space | j's tail reaches 244 left of its stem (Georgia Pro 210, Serrif 109 at Area's x-height): the least white across "x␣j" was 63 under the nearer reference's at 400 (median over a to z; s j 252 against 322 and 345), 42 at 700. fit.py's pair measure reads only rows where both have ink | space before j's class kerned +63 in the Regular; the masters by the transfer rule | `spacing.SPACE_BEFORE`, `space_kerning` | see below |

A first full build of this round read the audit's new filters in the taper rule too (`white.taper_readings` calls
`audit_rays.rays`): the Bold's handles then moved on 43 glyphs (the comma's by 67 units, ink 1 to 3%) and the quotes
dipped between their mid master and the Bold (37 > 35 at 675). The taper rule now reads as the integration round did
(`rays(close=False)`); the audit alone reads the new way. Taper places move towards the Light only, for the same
reason (towards the Bold they moved the quotes' nodes on the Bold master alone).

### Final (`build/qa-081.log`, one clean `qa.py` build)

- `audit_axis.py`: **Bold side 7 glyphs** (integration: 4), **Light side 2** (integration: 0), Astroke and
  Tdiagonalstroke HELD. Bold: hookabovecomb.case crossing at 552; thin C, Cbar 35 > 34 at 675, Q 23 > 20 at 425 to
  700, ogonekcomb.case 17 > 15 at 450 to 675, one.ss01 42 > 38 at 650 to 700, s 32 > 31 at 475 and 600. Light: whook
  28 > 20 at 300, yhook 30 > 21 at 300. Gone: at, commaaccentcomb.case. All the new ones but none of the old are the
  cut across the stroke's own findings (C, Q, s and the flag read a level cut before).
- `audit_rays.py` (300, 350, 400, 500, 600, 700): **19 glyphs**, 394 glyphs read, 23,147 places (integration: 33,
  452, 33,700). Every 25 from 300 to 700: 15 glyphs (`build/weight/close/audit-rays-every25.txt`).
- `audit_kern.py`: pass at 300 325 350 375 400 450 500 550 600 650 700 (`build/weight/close/kern-every25-50.log`).
- `audit_bold.py` 434/434 Bold and Light, `--sweep` clean; interpolatable, charset, fontbakery on both fonts pass.
- The static Regular: 0 glyphs differ in outline or advance from the integration build; one kerning key added
  (space before j's class, +63). The Bold master differs in 2 glyphs (asterisk, at); the Light in 120 (taper places:
  at most 10 units, ink at most 4.6%, zeroinferior; then Saltillo 3.6%, ordmasculine 2.8%, less and greater 2.4%).
- Asterisk at 700 against n (sheets_081, variable font): Area 0.820, Georgia Pro 0.819, Source Serif 4 0.898,
  Literata 0.935.
- Word space before j (least white, Area units, 400 / 700): s j 252 > 302 / 227 > 270 (Georgia Pro 322 / 277);
  n j 185 > 237 / 154 > 201 (254 / 202). v j and y j were already inside both references and now stand 64 above
  Georgia Pro's (320 against 256 at 400): one key cannot tell what came before the space.

### Still failing after the close round, and why

| Glyphs | Side | Why |
|---|---|---|
| hookabovecomb.case | Bold 552 | Its slot between the curl and the stem closes. The lowercase's move scaled by 0.712 (KIN) keeps it open (7 by 14 at the Bold) but its three small curves round the slot gain an inflection and the contour crosses itself at 0.61 of the way: not used. The honest structure is a curl and a stem overlapping (the struck letters' construction), under the white law; not built |
| ogonekcomb.case | Bold 450 to 675 | Up to 1.9 under, 15 units behind its 11-unit top cut. The taper rule's stations do not read the place (none under 30 in the Regular survives its filters) and the Bold master itself is 0.9 under (the rule holds places 1 under): the dip is between the Regular and the Bold. A cut end under the serif tip taking the tip's law would hold it, but 36 glyphs have such cuts (b's and q's spurs among them, which stay sharp by rule); not written |
| C, Cbar | Bold 675 | 35 > 34 (1.1 under) across the barb's turn, and audit_rays' C barb (77.3 > 73.8 at 600). Not diagnosed further |
| Q | Bold 425 to 700 | 23 > 20 at the tail's upturned end, read across. The end zone (half the cut) does not reach it. Whether the end's shape is the stroke is not decided |
| s | Bold 475, 600 | 32 > 31 (1.1 to 1.4 under) under the lower barb's top corner, read across. As Q |
| one.ss01 | Bold 650 to 700 | The flag thins (42 > 38; the rays read it too at other places): real, the flag's underside follows the stem's knots |
| whook, yhook | Light 300 | The hook's ball thins (28 > 20, 30 > 21; rays 0.62 to 0.65 of 400): the taper places' moves on the ball are refused by the turn and crossing guard |
| @ | Light (rays) | Its slanted stem thickens towards the Light (32 > 47 at 300 at the diagonal): the slanted-stem rule is held to the Bold (towards the Light it ran the counter into the a's top crotch) |
| Ƙ Ⱳ Ƴ ⱳ ƴ ɲ ƒ | Light 300 (rays) | Hooks and tails at 0.58 to 0.65 of 400 (stem 0.705): as whook |
| Ə ɂ œ & ® $ ð ɽ | rays | Places at junctions and crossings still kept (Ə's bar into its bowl, ɂ's hook into its stem, œ's crossing, &'s arm, ®'s R against the ring under the white law's give, $'s stroke through the S); ɽ 4 units at 675 |
| Astroke, Tdiagonalstroke | Bold | HELD: the owner's decision |

Figures: `img/081/13-at.png`, `13-asterisk.png`, `13-word-space-j.png`, `13-comma-cut.png`, `13-hook-above.png`,
`11-rays-flags.png` (every flag drawn); `5-signs-struck.png` redrawn.

## Last round (15 November 2026)

The close round's open items, worked in the owner's order. Rules and readings, each tried on scratch masters built
from the normalized Regular (`build/scratch/run.py`) and then in one clean `qa.py` build (`build/qa-081.log`).
Figures: `img/081/14-thin-reading.png`, `14-c-barb.png`, `14-hook-above.png`, `14-at.png`; `11-rays-flags.png` redrawn.

| # | Item | Cause | Rule or reading | Where | Before > after |
|---|---|---|---|---|---|
| 38 | C, Cbar, Q, s, ogonekcomb.case (Bold) newly thin under the cut across the stroke | Not thinning. Read at fixed distances from each end (6 to 50 units), Q's tail and s's barb thicken at every weight and C's and the ogonek's are flat or thicker (`14-thin-reading.png`). Two sampling effects: (a) the thinnest cut by a stroke's cut end lies at the end zone's edge, and which scan line falls there changes with the weight (Q 22.6 > 19.8 > 23.6 at 400, 425, 450); (b) the end zone's corners were the flattening's vertices, so on a curve cut in 8 a vertex up to 12 units off the corner counted as the corner at one weight and not the next | `audit_axis` compares the instance's thinnest cut with the Regular's cut at the same place (the same two edges at the same shares, `place_reading`), not with the Regular's thinnest anywhere; end corners found on the outline cut every unit (`END_STEP`) | `audit_axis.thinnest(at=)`, `place_reading`, `_resample` | C, Cbar, Q, s, ogonekcomb.case pass; whook (Light) passes (its failing cut was the outside flat of its vertex, now an end) |
| 39 | What the reading change does to the other glyph-sides | The same place shows a stroke that thins where the Regular's thinnest stroke is elsewhere | (none: these are the reading's findings) | | newly failing on the tip's own masters: Khook (700, 49 > 38, the arm at the leg's junction), at (675 to 700, 41 > 35), cedi (700, 47 > 39, the C where the stroke crosses it), ogonek and ogonekcomb (675, 1.0 under), registered (600 to 700, 40 > 32, the ring by R's leg), tretroflexhook (700, 41 > 39); one.ss01 (Bold) and yhook (Light) still fail. Khook, cedi and yhook read at a junction, where the same place on two masters is the least certain (`14-thin-reading.png`, yhook) |
| 40 | C's barb and ₡ ꞓ Ȼ: thinner at 600 than at 500 (77.3 > 73.8 at (546, 106)) | The taper rule towards the Bold (`keep_taper(only_thinner)`) held only the places the engine had read thinner than the Regular, and retuned handles freely elsewhere: C's barb handle grew 1.32 times and the stroke into its foot fell 75 > 61 against the Regular's 68 | The places held are those thinner than the Regular in the engine's reading or in the retuned outline's | `white.keep_taper` | the flag gone from C, Cbar (₡), ꞓ, Ȼ; Bold changed in 13 glyphs (below) |
| 41 | audit_rays read 394 glyphs, 23,147 places (integration 452, 33,700) | A line's places were its two ends only, and the ends of a straight stroke are its corners: the close round's end zones read those as the end's cut, so 58 glyphs (dashes, rules, maths signs, arrows, brackets, v, w, ꝁ, ₹, one.ss01, .notdef, hookabovecomb.case) kept no place | A line is cut at the same parameters as a curve | `audit_rays.polylines` | see Final; 57 of the 58 read again; flags that came back: ⌦ ⌫ ✓ at 300 (0.60 of 400; the sign law asks 0.764) |
| 42 | hookabovecomb.case crossing at 552 | Drawn as one outline, the slot between the curl's ball and the stem's top is under a unit; the engine thickened the curl's stroke inward, the eye (17 wide) closed to 3 and the stem's corner crossed the ball | In the masters (and the variable font's Regular) the hook above is a curl and a stem overlapping: the curl is the outline from the stem's right edge round the eye to its foot, closed by a line inside the stem; the stem is a stroke (`move_stroke`) whose top is the eye's foot. Towards the Bold the eye is the Regular's about its centre times the white law's least for its width (17 keeps 17; the lowercase's 35 goes 30.3), centred where the engine put it, so the curl's stroke gains outward; the slot gives way into the stem by at most the stem's gain (not needed in this build). Towards the Light the engine's eye. The static Regular keeps the merged outline | `overlap.curl_master`, `curl_parts`, `vf_source`, `struck_names`; `bold.bold_font` | crossing gone; turns, crossings and parts-meet pass on both sides; both marks and the 27 composites drawn at 300, 400, 552, 700 (`14-hook-above.png`) |
| 43 | ogonekcomb.case 1.9 thin | Not a thinning (row 38): at fixed distances behind its 11-unit cut it thickens 12.6 > 12.9 and 18.7 > 20.0 from 400 to 700 | No cut-end rule written; none touched | | passes |
| 44 | @: the top crotch rises over the stem at the Bold (a nub) | `bold._fillet` moves a short curve's two nodes to where the slanted edge's line meets the curve's tangent; the two lines meet at a shallow angle, so the stem's thickening carried the crotch 100 up its edge, 21 over the stem's top | A fillet's corner never passes the level of its edge's far end (neck_range's rule for a crotch); where it would, the corner keeps its height on the moved edge | `bold._fillet` | crotch 411 > 511 at the Bold, now 409 (`14-at.png`); the neck rule then sets the crotch |

Not done, and why:

- **@ in the Light** (the slanted-stem rule, task 5's second half). Tried: the rule on both sides, then the neck rule
  again on the moved glyph, then the neck held half way too. The counter moved right 30 units at 300 (its stem
  95 > 65) while the crotch and the straight edge above it stay on the outer contour; the counter's top ran through
  the bowl's outer edge at 300 and the stroke between fell to 10 at 350. The honest rule moves the stem's whole left
  side (counter extreme, the line above the crotch, the crotch) by one level map; not written. Reverted; the Light's
  stem still thickens 95 > 92 and its rays flag stays.
- **The hooks with a ball at 300** (whook, yhook, Ƙ Ⱳ Ƴ ⱳ ƴ ɲ ƒ; j, eng). No construction built: a centreline
  and width profile for a hook into a ball, in all three masters with the turn and crossing guards, for nine glyphs,
  is a new part module; it was not started in this round. Their rays flags stand (0.58 to 0.65 of 400 at 300).
- **Junction flags in audit_rays** (Ə ɂ & ® $ ð œ). Drawn (`11-rays-flags.png`): Ə's ray starts on the soft corner
  where the counter meets the bar; ɂ's crosses the hook's junction with the stem; &'s runs from the arm's crotch;
  $'s and ð's end by a junction's corner (the junction rule reads where a ray starts, not where it ends); œ's reads
  the e's top beside the crossing; ®'s ring thins by R's leg (40 > 32 at the same place, audit_axis too), which the
  white law does not ask for (keep_white gives way by at most a part's gain). None is the white law's give by design,
  so no named exception was written; no part rule was written for them.
- **ɽ** (every-25 run only): thinner at 475 than 450 and at 675 than 650 by 4 to 5 units on a 100-unit ray through
  its ball, between its masters; not diagnosed.
- **⌦ ⌫ ✓** at 300 (0.60 of 400 where the sign law asks 0.764): seen only now that lines are read; not diagnosed.
- **hookabovecomb.case** keeps no ray place (its stem's places all lie by its corners and the curl's by the stem's
  edge); the lowercase hook is read (9 places).

### Final (`build/qa-081.log`, one clean `qa.py` build)

- `audit_axis.py`: Bold side 8 glyphs thin (Khook, at, cedi, ogonek, ogonekcomb, one.ss01, registered,
  tretroflexhook: row 39), no crossing; Light side 1 (yhook); Astroke and Tdiagonalstroke HELD. Close round: Bold 7
  (hookabovecomb.case crossing; C, Cbar, Q, ogonekcomb.case, one.ss01, s thin), Light 2 (whook, yhook).
- `audit_rays.py` (300, 350, 400, 500, 600, 700): 18 glyphs, 474 glyphs read, 27,278 places (close round 19, 394,
  23,147). Every 25 from 300 to 700: 18 glyphs, 474 read, 27,153 places (`build/weight/last/audit-rays-every25.txt`).
- `audit_kern.py` every 25 from 300 to 700: pass, 0 fail at all 17 weights (`build/weight/last/kern-every25.log`).
- `audit_bold.py` both masters and `--sweep` pass; interpolatable, charset, fontbakery on both fonts pass.
- Against tip 7108b456: the static Regular (UFO, TTF outlines and advances, kerning) unchanged, 0 glyphs. The
  variable font's Regular master differs only in hookabovecomb and hookabovecomb.case (two overlapping contours,
  the same ink). Bold master: C, Cbar, Cstroke, uni20A1 (up to 28 units, the barb's handles), Esh 15, Fhook 50,
  Germandbls 9, Ghook 37, Tretroflexhook 52, comma 3, semicolon 9, glottalstop 16, s_t 20 (the taper guard's
  retune: handle lengths), at 102 (the crotch; its mid master too), the two hooks above (new structure), and three
  composites whose stacked marks moved with the hook (uni1EA8, uni1EC2, uni1ED4); 8 kerning keys. Light master: the
  two hooks above; 8 kerning keys.

## Owner round (15 November 2026)

The owner's three points after looking at 0.81, worked before the axis list. Figures (`build/figures/081/`):
`15-tails-combs.png` (A), `15-gss02.png` (B), `15-lean-waterfall.png` (C).

| # | Point | Cause | Rule | Where | Before > after |
|---|---|---|---|---|---|
| 45 | A. Tails of j, y (and g.ss02) not smooth in the Bold; y's ball pinched | The masters' tails were the engine's point moves. It read the ball's box from the neck to the left side (83 by 48 on j) as a round end's (88 by 44) and grew it 1.42 across and 1.14 up: the Bold j's ball 61 by 49, the Light's 36 by 40; the tail then met the ball at up to 1.80 times its curvature. `curvecheck.py` ran on the Regular only | Towards the Bold a tail into a ball is built again: the ball is the round ends' part (the Regular's ball scaled by `bold.BALL`'s law about its centre, 1.40 at the Bold, as a c f r 2 3 5 6 9 measure on that master), centred where the engine put it; the tail between the straight edge and the ball solved by `round_tail` on the master's points (before the tapers). Towards the Light the engine's tail stays: it passes curvecheck as drawn, and solved again the Light j fell to 0.665 of 400 beside the stem (audit_rays' floor 0.684); the ball alone left the neck's handles 5.6 degrees off one line. Then, after the splices, every part curvecheck reads meets at one curvature at each smooth node (`loops.even_nodes`: the node's handles along their own lines, inside the triangle, no new fault of the part, and never a place across the stroke thinner by over half the JND). `curvecheck.py` now runs on the Light and Bold UFOs in qa.py | `loops.tail_kind`, `master_ball`, `round_tail(master=)`, `even_nodes`; `bold.bold_font`; `qa.py` | Bold: j 1.80 > 1.03, y 1.54 and a flat place > 1.17, g.ss02 1.34 and a 49% valley > 1.08; Bold ball round (j 61 by 49 > 60 by 60, y 67 by 60 > 67 by 67). Carried to jdotless, eng, f_j, f_f_j (j's tail within a unit) |
| 46 | B. g.ss02's tail too long and too high | 0.81's form A raised the ball to 0.030 x-height under the baseline (top at -16) to make the half-ellipse tighten evenly | Form D: 0.80's proportions on A's construction: ball top 0.138 x-height under the baseline (0.80's; the references' mean), the tail's end where both had it (`G_TAIL_END`); the half-ellipse and its solved handles kept; the lowest point half way to the tail's end (at 0.80's 0.518 share the quarters meet at 1.23 Regular, 1.77 Bold) | `charset.G_TAIL_FORMS["D"]`, `G_TAIL_FORM` | ball top (Light / Regular / Bold): 0.80 -75 / -72 / -62; tip -21 / -16 / -18; now -77 / -72 / -63. Tail end x 66 throughout. Lowest point x 302 (0.80: 283). curvecheck clean in all three masters. The Regular's only outline change this round; six collision kerns (g.ss02 or ɡ before j, ĵ, ȷ) 57 > 71 |
| 47 | C. Letters lean or lose balance as weight rises | Measured by a new audit, `audit_lean.py` (every letter, figure, a.ss03, g.ss02 at 300 to 700 on the variable font; references Georgia Pro Light/Regular/Bold and Source Serif 4 at 300/400/700, all read at 1000 units, numbers only): the ink's centre in the top half against the bottom half (lean), the ink against the advance (centre), each counter's thin-to-thin axis (stress) and its two sides' growth. x leaned most: -0.123 of its height at 700 against the references' -0.037 to -0.018. Its thick diagonal turned 36.4 > 42.7 degrees at the Bold (Georgia Pro +1.0, Source Serif 4 -2.2): the anchors the x knot map placed pulled the thick stroke's foot out (top end -1, foot +131 units), and the x grew 24% wider (references 5 to 16%) | Tried, not kept: a thick diagonal keeps the Regular's lean within the references' change, 0.038 rad (`bold.LEAN_KEEP_THICK`, now None). On every thick diagonal: v w V W leaned less (w -0.038 > -0.011) but W's middle stroke thinned 41 > 27 at 700, v V x gained an inflection in a bracket at 437 and R's leg ran into the ring of ®. On crossing strokes only (x): x lean at 700 -0.123 > -0.043 (refs -0.037 to -0.018), its Bold advance 687 > 596 (+8% on the Regular's; refs +5 to +16%), but both brackets of its thick stroke gained an inflection between the masters (315, 323, 443, 454; audit_bold --sweep at 325): `serif_on_slant` places the bracket's far end from the x knot map, not from the kept edge (the Bold's bracket end 22 units left of the edge's line, the Regular's 10 right of it). Next: place the serif from the kept edge, then keep the lean | `bold.slant_lines`; `audit_lean.py` | not changed: x lean -0.123 at 700 stands |

Not done in point C, and why (the audit's remaining flags against both references, lean at 700): s -0.066 (refs -0.014 to
+0.024), G -0.056, S -0.051, X -0.048 (its strokes are not read as crossing), z +0.048, e +0.039, g -0.039, w -0.037,
a +0.033, c +0.028; the figures within 0.015. Not diagnosed further this round. The 9 (and the 6, the same drawing
turned): in the Regular already its lower right is steeper than both references (the chord from the widest point to
0.15 of the height from the end leans 19.2 degrees; Georgia Pro 24.5, Source Serif 4 25.8; at 700 22.1 against 27.4
and 29.2), because the quarter from its right extreme to its lowest point is tall and narrow (309 by 385, run over rise
0.80; the references 0.92 to 0.94): the 9 is narrow (ink 0.69 of its height; Georgia Pro 0.86, Source Serif 4 0.62)
and its lowest point sits right of where the references put it. Moving it to the references' share would run the
tail into its ball unless the ball moves or the 9 widens: a drawing decision for the owner; no Regular figure changed.
The 5 reads less steep than both references by the same chord (20.7 against 17.4 to 18.6); its look of leaning is not
this measure. The stress and side-growth readings are noisy at junctions (counters cut by bars and tails); they are
written to `build/weight/audit-lean.txt` but not used to judge.

Other changes this round: `.venv/bin` scripts pointed at a removed worktree's Python (qa.py's fontTools and fontbakery
steps failed with "No such file"); their first lines now name this worktree's interpreter (not tracked).

### Final (`build/qa-081.log`, one clean `qa.py` build)

- qa.py: every check of the last round as it was (audit_axis Bold 8 thin: Khook, at, cedi, ogonek, ogonekcomb,
  one.ss01, registered, tretroflexhook; Light 1: yhook; no turn or crossing; Astroke and Tdiagonalstroke HELD;
  audit_rays 18 glyphs, 474 read, 27,267 places), plus the two new checks, which fail on faults the engine left in
  parts the Regular keeps smooth: Light g (1.37, 1.42, a G1 of 6.3 degrees, an ease of 0.56), Bold g 1.87, a.ss03 1.76,
  l.ss04 1.91 and 6.05. `even_nodes` reaches each of them but would thin a place across the stroke by over half the
  JND there, so they stand.
- Every 25 units, 300 to 700: audit_rays 18 glyphs, 474 read, 27,136 places (the same 18 as the last round);
  audit_kern pass at all 17 weights (`build/weight/owner/`).
- Against tip d0133284 the static Regular differs in g.ss02 alone (the owner's point B) and six collision kerns of
  g.ss02 / ɡ before j, ĵ, ȷ (57 > 71). Masters: Bold j, jdotless, jstroke, eng, f_j, f_f_j (up to 33 units), y,
  ystroke (23), g.ss02 (62), g (4, its mid master's node); Light g.ss02 (60), a.ss03 (12), y (6), j (1).
- The 27 hook-above composites at 300, 400, 552, 700 render solid on CoreText (`ct_overlaps.py`, AREA_CT_NAMES) and
  FreeType (64 px against the same instance with overlaps removed: at most 17 and 13 of 255 lighter, anti-aliasing,
  no knocked-out overlap); the composites carry no OVERLAP_COMPOUND flag and neither renderer needs it.

## Owner round 2 (15 November 2026)

Figures (`build/figures/081/`, `img/081/`): `16-figures.png` (8 9 0 6 5 3, before under after, 300 to 700),
`16-lean.png` (lean at 700 against the references' band), `16-thickening.png` (growth per part kind), `16-combs.png`
(g, a.ss03, l.ss04 in the Light and Bold).

| # | Point | Cause | Rule | Where | Before > after |
|---|---|---|---|---|---|
| 48 | The 9 "too steep, slightly italicized" (and the 6, its turned drawing) | Already in the Regular: the quarter from the right extreme to the lowest point 309 by 409 (0.76; Georgia Pro 0.94, Source Serif 4 0.92), the edge from the widest point to 0.15 of the height leaning 17.6 degrees (24.5, 25.8) | The owner's decision on those numbers: the 9's advance stays; its lowest point (and the tail's inside with it) moves left until the quarter is 0.90 as wide as tall; the ball moves with it until its left side stands on the bowl's left extreme; the extreme's downward handle shortens until the edge leans 23.5 degrees; then one curvature at each node (`loops.even_nodes`). The 6 takes the same rule turned half round | `clean.nine_six`, `nine_tail_contour`, `NINE_QUARTER`, `NINE_LEAN` (normalize, after the 5's bowl) | lowest point 249 > 191, ball -32, edge lean 17.6 > 23.6 (the 6 23.4); read on the variable font 25.0 at 400 (refs 24.5 to 25.8), 28.5 at 700 (27.4 to 29.2); curvecheck clean; Bold advances 672 > 684 |
| 49 | The 5 "bottom right too steep, reads italic" | Not its bowl: at 400 its widest point (0.328 of the height; refs 0.342, 0.325), overhang past the flag (0.040 of the width; 0.046, 0.043), lowest point (0.451; 0.444, 0.447) are inside the references'. Its upright stroke leans 9.5 degrees (Georgia Pro 6.7, Source Serif 4 4.0); the ball sits a little low (0.169 of the height; 0.191, 0.212) | The upright stroke turns about the middle of its height to the references' mean lean (5.35 degrees); the foot's knot and the bowl's join move with the end they hang on, the flag's corners with the top; a curve off the turned line takes its direction | `clean.five_stem`, `FIVE_LEAN` | 9.5 > 5.3 degrees (read on the variable font). The ball's height is left |
| 50 | Lean of x (and v w V W) at the Bold | The anchors the x knot map places turn the thick stroke 36.4 > 42.7 degrees (refs within 2.2) | Tried: a crossing thick diagonal keeps the Regular's lean (`LEAN_KEEP_THICK`), and a bracket drawn as two curves takes its middle node from the kept edge (`BRACKET_FROM_EDGE`), which removed the brackets' turns (x lean at 700 -0.123 > -0.045, inside the band; Bold advance +24% > +8%). Not kept: the full build missed parts-audit targets (x's openings 193 and 166 against 219.5 and 196.5, v's and w's serif uprights 52 and 50 against 54 and 53, y's and Y's openings by 5 and 2) and the ampersand's crossing stroke fell 52 > 15 at 700; on every thick diagonal (v w V W too) W's middle stroke thinned 41 > 27 and ® met R's leg. Both are off in the build | `bold.slant_lines`, `serif_on_slant` | not changed |
| 51 | Curvature in the masters (Bold g 1.87, a.ss03 1.76, l.ss04 1.91 and 6.05; Light g) | even_nodes alone thinned the stroke (by 2 to 11%) and was refused | The part is solved with its other edge: each round evens the nodes, then the curves either side of every place now thinner take its thickness back by their handle lengths (`white.keep_taper` with the part's own thickness as the law: nodes and tangents stay, no turn); kept only where faults fall and nothing thins by half the JND | `loops.even_part`; `bold.bold_font` | Bold: all pass (g, its mid master, j, a.ss03, l.ss04, eng, fj, ffj, jdotless). Light g left: 4 faults (1.37, 1.42, a G1 of 6.3 degrees, an ease of 0.56): every solve thinned it |

Lean grows with weight or is drawn (lean at 400 and 700; Area / Georgia Pro / Source Serif 4): s -0.097 > -0.162 /
-0.073 > -0.087 / -0.096 > -0.072 (in the Regular inside, grows: engine); G -0.081 > -0.138 / -0.073 > -0.107 /
-0.106 > -0.114 (grows); S -0.072 > -0.122 / -0.065 > -0.093 / -0.091 > -0.089 (grows); X -0.078 > -0.126 / -0.070 >
-0.097 / -0.060 > -0.084 (drawn a little and grows); z +0.065 > +0.112 / +0.042 > +0.067 / +0.015 > +0.023 (drawn and
grows); e +0.102 > +0.142 / +0.103 > +0.114 / +0.105 > +0.086 (grows); g +0.030 > -0.009 / -0.012 > -0.009 / +0.005 >
-0.003 (drawn); w -0.021 > -0.058 / -0.038 > -0.059 / -0.029 > -0.032 (grows past Source only); a +0.000 > +0.033 /
+0.039 > +0.029 / +0.026 > +0.024 (drawn, and grows the other way); c +0.070 > +0.098 / +0.070 > +0.081 / +0.060 >
+0.048 (grows). None fixed. One cause measured for s: its two turns grow 2.3 times (62 > 143) where the stems grow 1.8
(`bold.SUB_ROUND["turn"]` 1.26 of a round stroke's gain), but setting them to the round strokes' gain moved its lean
only -0.065 > -0.049 against the references' -0.014 to +0.024: not the main cause; not changed.

Even thickening (`16-thickening.png`, `tools/thickening.py` on audit_bold's part readings of each master): balls 1.398
to 1.404 at the Bold and 0.848 to 0.852 at the Light; necks within 1.1% and 2.8%; serif tips and reaches within 1.4%;
stems over 90 within 0.9%. Outside a kind's median by more than the JND: s's turns (2.31 against the stems' 1.78), g's
ear and link (2.20), the x's and w's thick diagonals (1.82; median 1.72), Z's level strokes (1.33; median 1.26) and E's
at the Light (0.78; median 0.83); counters and openings (whites, which close by design: g 0.68, K 0.80). Listed, not
changed.

Not done this round: the j y g.ss02 against f r c a s 3 5 6 9 terminal table beyond the ball (the ball's diameter over
the stem: round ends 1.13 Regular, 0.88 Bold, 1.36 Light; j 1.10, 0.86, 1.35; y 1.23, 0.96, 1.49: y's ball is 96 where
the others are 86 to 88, drawn so in the Regular; the neck and exit angle were not measured); the axis list (hooks with
a ball, Bold same-place flags, @ in the Light, ⌦ ⌫ ✓, ɽ, junction rays) was not worked.

### Final (`build/qa-081.log`)

- qa.py: as the owner round, but `curve continuity in the Bold master` now passes; the Light master still fails on g.
  audit_axis Bold 8 thin (Khook, at, cedi, ogonek, ogonekcomb, one.ss01, registered, tretroflexhook), Light 1 (yhook);
  audit_rays 18 glyphs (the same 18), 474 read, 27,584 places. Every 25 units: rays 18 glyphs, 27,438 places; kern
  pass at all 17 weights (`build/weight/stage2/`).
- The Regular against the owner round's build: five (the stroke, 15 units), nine and six (72, 73), their superiors and
  inferiors (as derived), partialdiff (73, drawn from the 6), the fractions that carry them (advances by 1 to 8); 15
  kerning keys. Advances of 5, 6, 9 unchanged.

## Owner round 3 (15 November 2026)

The conductor read the Bold line "fghrstvxyz FGYZBCD 0123456789" beside Source Serif 4 as diagonal letters too wide and
too flat. Measured first (numbers only; `17-advance.png`, `build/weight/stage2/advrel.txt`): the advance's growth 400 to
700 over its class's upright (n for lowercase, H for capitals), Area / Georgia Pro / Source Serif 4:

| glyph | Area | Georgia Pro | Source Serif 4 |
|---|---|---|---|
| v | 0.998 | 0.977 | 1.027 |
| w | 1.013 | 1.003 | 1.016 |
| x | **1.134** | 0.997 | 1.032 |
| y | 0.991 | 0.978 | 1.026 |
| z | 1.010 | 1.013 | 1.001 |
| k | 0.993 | 1.009 | 1.075 |
| V | 1.005 | 1.020 | 1.010 |
| W | 0.997 | 1.030 | 1.050 |
| X | 1.006 | 1.017 | 1.040 |
| Y | 1.014 | 1.062 | 1.017 |
| Z | 1.041 | 1.021 | 1.052 |
| K | 0.987 | 1.051 | 1.075 |
| A | 1.005 | 1.008 | 1.047 |
| M | 0.985 | 0.985 | 1.023 |
| N | 0.948 | 0.976 | 1.020 |
| 7 | 0.942 | 0.990 | 1.066 |

(The uprights themselves: n 1.098 / 1.168 / 1.017, H 1.070 / 1.120 / 0.971.) Only the x stands outside both references
(its thick stroke turns 36.4 > 42.7 degrees; Georgia Pro +1.0, Source -2.2); v w y z V W X Y Z K A M sit inside or at the
edge of the band, their angles within 2.7 degrees (references to 3.1). The Light: every diagonal letter within 2% of its
class's upright (x 0.949 against n's 0.963). So no width rule for the class was written: the measurement does not ask for
one, and a single class factor would move twelve letters to correct one.

The x (item 1, held): keeping its thick stroke's angle needs its openings constrained where they are measured. The
engine sets an opening's width on the x knots and then puts the stroke's edges on lines, so the white measured across
the ink is not the knots' gap: with the angle kept the openings came out 193 and 166 against the rule's 219.5 and 196.5
(at DIAG_INWARD 0.25), 182 and 154 against 197.9 and 174.9 at 0.5 (the geometric share, Source Serif 4's 0.39 to 0.48,
Georgia Pro's 0.10 to 0.20). The rule is left off (`LEAN_KEEP_THICK` None) with the cause written beside it; crossing
strokes are now recognised (`slant_strokes`: two straight diagonals that cut each other's edges, so the ampersand's
curved crossing is not one).

Level strokes (item 1f): z's and E F L Z's are each on their kind: capitals' arms 1.33 at the Bold and 0.79 at the Light
(E F L Z alike), lowercase hairlines 1.24 and 0.85 (z). The thickening table's band mixed the two kinds. The one outlier
found is T's arm, read as a curved level stroke (1.24, not the arms' 1.33): listed.

Round open letters (item 2), split into quarters (share of the ink, 400 > 700): s's top-right quarter falls 0.19 > 0.15
(Georgia Pro 0.20 > 0.20, Source 0.19 > 0.20), the bottom-right and top-left grow; S the same (0.20 > 0.17); c's bottom
right 0.16 > 0.13 (both references hold); G as Georgia Pro. Part by part: s's barbs grow 1.05 (top) and 1.21 (bottom)
where Georgia Pro's grow 1.29 and 1.27, Source's 1.53 and 1.48 (C's, S's, G's barbs grow 1.27 to 1.31, in band): s's
barb is not read as a stroke (34 units at its cut, its inside edge slanting). Read as one (a hint, 34 > 45 at the Bold)
s's lean moved only -0.065 > -0.060; its turns on the round strokes' gain moved it -0.065 > -0.049; references -0.014 to
+0.024. Neither is enough; neither is in the build.

9 and 6 (item 3): the 9's top-left quarter falls 0.27 > 0.24 and its top right grows 0.25 > 0.28 (references hold); the
long stroke grows faster than the bowl's left side. Not fixed. 4 8 K a: not decomposed.

y's ball (item 5): `joins.END_RADIUS2["y"]` 48 > 44, the round ends' radius (its diameter over the stem 1.23 > 1.13 in the
Regular). The Bold's tail solve then slid the inside up the thin diagonal past the crotch (a turn at 519, a crossing at
624): in a master the inside's straight edge may run no more than 10 units on towards the crotch (`round_tail(master)`).
Regular: y and ystroke change (8 units).

Not done: the Light g (item 4: the centreline construction was not written), the neck and exit-angle columns of the
terminal table, the axis list (item 6).

### Final (`build/qa-081.log`, owner round 3)

- qa.py as owner round 2 (Bold curvature passes; the Light g fails; audit_axis Bold 8 thin, Light 1; audit_rays the same
  18 glyphs, 27,608 places). The per-master kerning refit ran (`AREA_KERN_FIT=1`, fit_kerning.json); audit_kern passes
  at all 17 weights 300 to 700 (`build/weight/stage3/kern-every25.log`).
- Regular against round 2: y and ystroke (the ball, 8 units). Figures: `17-advance.png`, `17-lean.png` (img/081);
  `17-lines.png` (with the reference faces drawn, in build/figures/081 only).

## Owner round 4 (15 November 2026)

| # | Item | Result |
|---|---|---|
| 52 | x: openings set where measured (`bold.crossing_openings`; crossing recognised only where a stroke's both edges are cut by strokes of the other lean that share its corners: x alone in the face; A's legs, X's whole strokes, the ampersand are not) | **Infeasible under the round's constraints, off.** Each end of the x carries two openings: between its bracket and the thick stroke's (137..378, 184..402) and between its serif's end and the thick stroke's (181..334, 228..359). Moving the end (the only unknown that leaves both thicknesses, the thick angle and the serif and bracket rules alone) moves both alike. Their Regular difference is 88 and 87, and the opening rule keeps it (targets 207.4 and 119.4, 184.4 and 97.4 at the crossing share 0.39, Source Serif 4's least); with the thick angle kept and the brackets from its edge the Bold's difference is 66 and 62. Met at the serif's end, the bracket-level openings are 185 and 159 (22 and 25 short); met at the bracket, the serif-level top opening is 122 (25 over). Only the bracket's offset from its edge or the serif's reach could separate them; both are fixed rules. A decision is needed on which white the x keeps |
| 53 | s: turns on the round strokes' ratio (`x_target`, sub "turn": t times 146/82), barbs read as strokes and grown by the thin upright rule (`HINTS["s"]`, as C's S's G's) | s lean 400 > 700: -0.097 > -0.128 (drift -0.031; Georgia Pro -0.014, Source Serif 4 +0.024: within 0.02 of the band); top-right quarter 0.19 > 0.17 (within 0.02). Bold advance 551 > 519; Light 457 > 456. Bold, light, sweep and parts audits pass |
| 54 | S, c | Not landed: S's barbs are already read and its sides grow 1.76 (references 1.71, 1.77); its lean still drifts -0.050 (band -0.027 to +0.002), top-right quarter 0.20 > 0.17. c's lower right 0.16 > 0.13: its lower stroke (56 units, read as a curved level stroke) grows 1.24 where the references' grow 1.58 and 1.75; c's lean is within 0.02 of the band. A rule for level strokes between a hairline and a round stroke was not written |
| 55 | Light g | Not landed. Every round of the part solve leaves the outer loop's node (471, -74) at 1.34 to 1.83 and thins the counter's bottom 63.3 > 60.7 (4%); the centreline construction was not written |

Final (`build/qa-081.log`, per-master kerning refit run): as round 3 (Light curvature fails on g; audit_axis Bold 8
thin, Light 1; audit_rays the same 18 glyphs, 27,632 places); bold, light, sweep, parts and interpolation pass.
Regular unchanged against round 3; masters: s and its accented forms. Figure `18-lines.png`.

## Owner round 5 (15 November 2026)

| # | Item | Rule | Before > after |
|---|---|---|---|
| 56 | x | The conductor's decision (reversible): a crossing's end keeps its serif-end opening, the narrowest white there, on the white law's share (DIAG_INWARD 0.25: 119.4 / 97.4 at the Bold become 131.5 / 109.5); the opening at the bracket follows from the kept angle and the bracket rule, so its target is the serif-end target plus the separation the rule gives (one end cannot carry two independent openings once the angle is kept); the engine reports it so and the parts audit reads it with its usual tolerance. The thick stroke keeps the Regular's angle (`LEAN_KEEP_THICK` 0.038 on crossed strokes; `CROSS_TURN` 0: turning it 0.006 rad widened the x to 0.990 of n's growth but leaned it -0.048), the brackets are drawn from its edge (`BRACKET_FROM_EDGE`, crossed strokes only), the thin stroke's thickness is set exactly from its new lean | lean drift at 700 -0.123 > -0.044 (references -0.037 to -0.018); thick angle 36.4 > 42.7 became 36.4 > 36.6; Bold advance 687 > 596 (1.080 of the Regular's; n's 1.098: 0.983 of n's growth, asked 0.99 to 1.06, the one target not met); the Light x 524 > 542 (0.980; n's 0.963), lean +0.042 > +0.007 (band 0.000 to +0.021); no turn between the masters; v w y Y A W M ® & byte-identical |
| 57 | S | The top bowl keeps its width's share of the bottom bowl's (`bold.s_terminal`, S and s): the top terminal moves level by what restores the Regular's ratio. Measured cause: S's top bowl 0.904 > 0.869 of the bottom's, its terminal 0.934 > 0.863 of the width (Georgia Pro 0.899 > 0.902, 0.939 > 0.933; Source Serif 4 0.900 > 0.914, 0.930 > 0.939) | S lean drift -0.050 > -0.041 (band -0.027 to +0.002), top-right quarter 0.20 > 0.18; s -0.031 > -0.019, 0.19 > 0.18; Bold S terminal +20, s +24 |
| 58 | c, e | The lower stroke from a round stroke out to a terminal ("open tail", `bold.open_tail`, HINTS c and e): the mean of the round stroke's ratio (146/82) and the terminal tip's (TIP), not the hairline's. Measured: c's grew 1.24 where Georgia Pro's grows 1.58 and Source Serif 4's 1.75 at the same place. The rule catches c's and e's lower strokes; C and G read inside the references' band and are untouched | c's lower stroke 1.24 > 1.65; c's bottom-right quarter 0.157 > 0.152 (was 0.128), lean drift +0.028 > +0.009 (band -0.012 to +0.011); e +0.039 > +0.021 (band -0.019 to +0.010) |
| 59 | Light g | The loop from its centreline (`loops.g_loop_master`): each extreme of its outside and its counter moves towards the stroke's centre by (1 - law) of half the Regular's thickness (stem-like sides 0.705, the hairline bottom 0.847), the loop carried by the engine's mean move; the curve into the link keeps the Regular's handle shares; the counter's handle off the link's straight lies on it; the part solved with its other edge; no curve may gain a turn between the masters | 4 faults > 1; places short of their law 7 > 6. Left: the curve from the loop's right side into the link starts at 0.49 of its tightest (limit 0.45). The smallest relaxation that would pass it is EASE 0.45 > 0.49 at that node; a variant with both handles of that curve 1.25 longer passes curvecheck but its handle at the link stands outside the curve's triangle and the curve turns at t 0.98 between the Regular and the Light, so it is refused |

Final (`build/qa-081.log`, per-master kerning refit): as round 4 (the Light curvature check fails on g's one node;
audit_axis Bold 8 thin, Light 1; audit_rays the same 18 glyphs, 27,636 places); bold, light, sweep, parts and
interpolation pass. Regular unchanged against round 4. Figures `19-lines.png`, `19-g-light.png`.

## Owner round 6 (15 November 2026)

| # | Item | Rule | Before > after |
|---|---|---|---|
| 60 | Light g, the link node | `loops.g_loop_master`: when the loop's right side cannot ease into the link inside its triangle, the link's node slides along the link's straight (the least slide, 2 to 40 units, with the curve's two handles, that clears curvecheck, gains no turn between the masters and leaves no place short of its law). The Regular is not touched | the Light g: ease 0.49 > clean (a 4-unit slide, handles 0.85 and 1.1); "curve continuity in the Light master" passes |
| 61 | 9 and 6 drift | Cause found: round 2 put the 9's ball's left side on the bowl's left extreme (the 6's turned), so the reading of the extremes' pair renamed the bowl's stroke (57..149, read at 452 to 492) as the ball's sides (57..145, at 87 to 136): the bowl's side grew by the ball's 1.40 instead of the round strokes' 1.78. A stroke read far from a ball's height (more than 20 units outside it) is no longer taken for that ball's sides (`bold.bold`, `far_from_ball`). Only the 9 and 6 (and their small forms) change | lean drift 400 to 700: 9 +0.026 > +0.011 (references -0.009 to +0.001), 6 +0.026 > +0.011 (-0.006 to +0.007); quarters within 0.02 (9's top left 0.27 > 0.27; 6's 0.24 > 0.22) |

Triage of the lean outliers at 700 (drift 400 to 700, Area against Georgia Pro / Source Serif 4; "drawn" when the
Regular's own lean is outside both):
- 2: -0.006 (-0.006 / +0.006): inside. 7: -0.001 (-0.036 / -0.001): inside. C: +0.007 (-0.018 / +0.005): at the edge.
- G: -0.057 (-0.034 / -0.008): grown; the top terminal's quarter loses as S's did, but G is not an S (s_terminal does not
  cover it). Listed.
- X: -0.048 (-0.027 / -0.024): grown; X is drawn as four whole strokes, not two crossing ones, so the crossing rule does
  not see it. Listed.
- z: +0.047 (+0.025 / +0.008), and drawn (+0.065 at 400; +0.042, +0.015): its diagonal. Listed.
- a: +0.033 (-0.010 / -0.002), drawn (0.000 at 400; +0.039, +0.026). g: -0.040 (-0.003 / +0.008), drawn (+0.030 at
  400; -0.012, +0.005). w: -0.037 (-0.021 / -0.003): its thick diagonals (keeping their lean thinned W's middle
  stroke, round 2). Listed.
- K: -0.013 (-0.030 / -0.026), 4: -0.013 (+0.013 / +0.008), 5: 0.000 (+0.029 / +0.011), 8: +0.011 (-0.008 / -0.006):
  drift a little against the references' direction. Listed.
None is a part an existing rule covers; no new one-off rule was written.

Not done: the axis list (Bold same-place thin, the IPA hooks with a ball, the junction rays, ⌦ ⌫ ✓, ɽ, @ in the Light)
and the terminal table's neck and exit-angle columns.

Final (`build/qa-081.log`, kerning refit): both master curvature checks pass. audit_axis Bold 8 thin (Khook, at, cedi,
ogonek, ogonekcomb, one.ss01, registered, tretroflexhook), Light 1 (yhook); audit_rays 18 glyphs, 27,276 places; bold,
light, sweep, parts, interpolation, kerning, charset and fontbakery pass. Regular unchanged against round 5. Masters: g
(Light), 9 and 6 (and their superiors and inferiors), g.ss02 in the Bold (24 units, the splice's ball white), and 1 to 4
units in the asterisk, daggers, quotes and servicemark (their reach solved by halving against n's ink). Figure
`20-waterfall.png`: the whole lowercase, capitals and figures, the 0.81 tip above the final, at 300, 400, 550, 700.

## Owner round 7 (16 November 2026)

**Repeatable build.** Two builds of the masters from the same Regular (`build/scratch4/run.py` into `build/det1` and
`build/det2`) are identical: 0 glyphs differ in the Light, the Bold or the Bold's mid master, 0 kerning keys. The 1 to
4 units the asterisk, daggers, quotes and servicemark moved between rounds are not chance: they follow the white law
(`white.Law`), whose counter ratio is the median over HOLE_LETTERS (a b d e g o p q A B D O P R 4 6 8 9 0) of the Bold's
counters against the Regular's. When round 6 changed the 9 and the 6, it moved 0.86308 > 0.83736, and the signs the law
caps (the asterisk's arms 499 > 495, the double quote 424 > 422, the daggers by 2 to 3) followed. Rounds 3 to 5 left it
at 0.86308 and those glyphs did not move. A law read on the letters is the design; nothing was changed.

**Kerning refit.** It ran in each round (fit_kerning.json's per-master table changed every time). Against round 3's
table: the Bold's pairs with x changed 25 (26 > 11 fitted pairs), s 23, S 31, c 4, e 3; the Light's x 1, s 1, S 1, c 0,
e 0. 6 and 9 have no fitted pairs (figures are kerned only by the collision pass). audit_kern passes at all 17 weights.

**The axis list.** Nothing landed; each with the number that blocks it:
- Bold thin: Khook 700 (49 > 38, tip 41), the arm at the leg's junction; cedi 700 (47 > 39), where the stroke crosses
  the C; registered 600 to 700 (40 > 32), the ring by R's leg; at 675 to 700 (41 > 35, 34); tretroflexhook 700 (41 >
  39); one.ss01 650 to 700 (43 > 36), its flag's underside following the stem's knots; ogonek and ogonekcomb 675 (22 >
  21, 1.0 past the unit's tolerance). Light: yhook 300 (44 > 21) at the hook's junction. Not diagnosed further.
- IPA hooks with a ball (audit_rays at 300 against 400: Ƙ 0.588, Ⱳ 0.646, Ƴ 0.603, ⱳ 0.642, ƴ 0.638, ɲ 0.619, ƒ 0.577;
  floor 0.684): their balls are drawn turned off upright, the diameter's two ends 28 to 30 units apart across the axis
  (Ƙ 30, Ⱳ 28, Ƴ 30, ⱳ 29, ƴ 29; ƒ 14 and 18), where the engine reads a ball only within 6 (`bold.balls`); so neither the
  ball law nor the j/y ball construction reaches them, and the place that thins is the neck before the ball (Ƙ at 600,
  647), which the taper places' moves cannot reach without a turn. ɲ's ball is read (tilt 1); its tail is not j's
  (`tail_kind` finds none). Blocked by a reading of tilted balls, not written.
- Junction rays: Ə (bar into bowl, 67 > 48 from 400 to 700 at (410, 224)); ɂ (97 > 61 at (224, 254)); & (49 > 31 at
  (594, 349)); ® (39 > 32 at (760, 309)); $ (Light 50.9 < 55.3); ð (Light 50.4 < 53.1); œ (Light 58.2 < 65.7); ɽ
  (4 to 5 units at 475 and 675); ⌦ ⌫ (0.606 at 300) and ✓ (0.666); @ in the Light (0.667 at (641, 143)). None was
  drawn and measured a second way this round; no reading rule was changed.

Figure `21-axis.png`: those glyphs at 300, 400, 550, 700 on the final build. qa.py: as round 6 (`build/qa-081.log`).

## Axis round (16 November 2026)

The axis list of round 7, worked in its order. The Regular is unchanged (0 glyphs differ in the Regular UFO).

| # | Item | Rule | Before > after |
|---|---|---|---|
| 62 | A. Tilted balls (Ƙ Ⱳ Ƴ ⱳ ƴ ƒ) | A ball at any tilt (`bold.tilted_balls`, `balls(tilted=True)` in the engine, letters only): three nodes joined by two curves, the chord between the outer two 70 to 130 long (`TILT_D_MIN`: the smallest ball the upright reading finds on a full-size letter, eopen's 71; x's and Y's bracket rounds, 56 to 61, are not balls) and within 25 degrees of an axis, the arc's far point 0.40 to 0.70 of the chord out and within 0.12 of its middle, ink all along the chord (the outside of a curved stroke is a half round too, but its chord crosses the counter); one reading per ball. The engine's existing ball spans then apply the ball law (1 + 0.40 f) in both masters. Counted before building: 30 balls on 28 glyphs | audit_rays at 300 (ratio to 400, floor 0.684): Ƙ 0.588 > 0.807, Ⱳ 0.646 > 0.814, Ƴ 0.603 > 0.820, ⱳ 0.642 > 0.819, ƴ 0.638 > 0.824, ƒ 0.577 > 0.734; each read a second way (largest disc tangent at the place, rasterised at 4 px a unit): Ƙ 38.5/64.5 > 52.0/64.0. All six pass audit_rays at every 25 units from 300 to 700. curvecheck clean in both masters |
| 62a | ɲ | Not j's part point for point (ball 93 across where j's is 83; `tail_kind`'s signature differs by up to 21 units). Tried: j's tail kind given to every tail with round_tail's structure, upright straights, the lowercase stem and j's depth (ɲ and ɠ): ɲ's Light failure moved to the outside by the stem (0.669 at (190, -64)), round_tail's inside residual 23 (j's 0.000), and ɠ's Light tail fell to 18 across where it was 38. Tried: letting a smooth node between a straight and a curve slide along its straight in `keep_taper`'s place moves: ɲ unchanged, 93 Light glyphs moved (g by 25). Both reverted | blocked: 32.3 at 300 where 400 has 52.2 at (105, -138), 0.619 against 0.684 |
| 63 | B. Khook (Bold), tretroflexhook, yhook (Light) | No new rule: item A's reading | Khook at 700: 49 > 38 fails > passes. tretroflexhook (ʈ, no ball read) 41 > 39 at 700, unchanged. yhook Light at 300: 44 > 21 became 44 > 15: its descender's ball (read now, 107 across) grows by the ball law in the Light where the engine had shrunk it as a stroke, and the tail's inner straight's lower node (260, -50; a smooth node between a straight and a curve) is moved by no Light rule while the outside straight moves 29 left: the tail between them falls to 15. keep_taper moves only two-handled nodes; the slide above took it to 18 only |
| 64 | Reading: a point drawn with a flat (`audit_axis.points_of`) | A straight under 30 units between two corners whose neighbouring straights meet under 60 degrees with the ink between them is a pointed end at its middle (a vertex's outside flat, a spur's or guillemet's tip). Found when item A's build moved ⱳ's middle apex a unit: a level cut 16 units under its 8-unit flat, across the two outsides, read 19.6 at 300; on the round 7 masters the same cut was missed because the scan line met a node exactly. 26 glyphs gain such a point; on the round 7 masters no audit_axis result changed (16 thin rows before and after) | ⱳ Light thin 31 > 20: fails > passes |
| 65 | C. one.ss01, cedi, ogonek, registered, at | None landed | see below |
| 66 | D. junction readings | Each place drawn and measured a second way: the ink really thins (the disc tangent at the place agrees with the ray within 1.5 units at every weight, @ at 700 within 9). No reading rule changed for them; no part rule written | see below |

C, each with its number (audit_axis's thinnest cut at 700 against the Regular at the same place, `thinat.py` reading):
- one.ss01: 43.2 > 36.3, across the flag near its tip ((101, 604) to (85, 636)). The engine maps the flag's underside handle (104, 604) to (76, 593), 28 left, by the stem's knots, where the tip moves 5 and the stem's edge 18: the underside rises into the flag. The figure 1's flag has no part rule in the masters, and keep_taper towards the Bold moves handle lengths only (0.6 to 1.6). Blocked: no flag construction for the figure.
- cedi: 46.5 > 39.4 where the stroke crosses the C ((241, 547) to (243, 596)). Built as overlapping parts it needs a letter (`overlap.build_layer` takes the letter's own contours from a glyph); cedi's C is Libre Baskerville's own drawing, 416 wide from 91 to 602, which is neither Area's c (0 to 530) nor C (cap 721), and no glyph may be scaled to make another. Choosing c or C changes the Regular's design: left for the owner.
- ogonek, ogonekcomb: 19.7 > 18.7 at 700 (22 > 21 rounded, at 675), its top cut at (177, 1) to (177, 21). Not attempted beyond the reading.
- registered: 40.5 > 31.9, the ring by R's leg ((760, 307) to (795, 286)): the ring's inside right extreme is pushed out and down where R's leg foot comes near it at the Bold. A ring is a ring (no rule keeps it so against keep_apart). Not attempted.
- at: 40.6 > 34.2 at 700 ((493, 108) to (442, 124)); in the Light 47.4 where 400 has 71.1 at (641, 143) (0.667). Not attempted.

D, measured a second way (`second.py`: the ray, and the largest disc tangent at the place on the instance rasterised at 4 px a unit; these glyphs, but ɂ and ɽ, are unchanged this round; rays at 300 400 500 600 700):
- Ə (410, 224): 79.0/80.0, 67.0/68.0, 62.0/63.0, 56.0/57.0, 48.0/49.0: the place slides 40 units along the bar towards the bowl as the weight rises and the ink there thins.
- ɂ (224, 254): 116.4, 97.2, 88.8, 76.7, 61.2 before; 107.3, 97.2, 88.1 (550), 74.3 (700) after item A (its ball now read): better, still failing at the default stops; at every 25 units it passes.
- & (594, 349): 57.8, 48.8, 42.9, 37.6, 30.8 (disc 57.5 to 31.0). ® (760, 309): 32.6, 40.3, 38.8, 35.1, 32.3. $ (207, 4): 59.7, 50.9, 50.8, 52.9, 57.3. ð (279, 697): 54.9, 50.4, 51.7, 54.0, 56.5. œ (542, 452): 73.1, 58.2, 70.5, 78.1, 76.4. ⌦ (539, 432): 33.8, 55.8, 71.8, 89.9, 113.4 (⌫ its mirror). ✓ (341, 400): 43.7, 65.6, 82.0, 100.8, 124.2. @ (510, 170): 47.5, 32.3, 34.2, 35.2, 36.1.
- ɽ: passes after item A (its ball now read).
- New on the list: ʕ, thinner at 600 than at 500 (91.7 > 86.5 at (135, 492)), the bowl's lower stroke into the stem. The place was not kept on the round 7 build; there it thinned further (94.8 > 69.1 from 400 to 700, against 94.8 > 78.9 now). A part with no rule (an extended letter's first drawing).

Every glyph that changed (Light and Bold masters; the Regular none): Ƙ Ⱳ Ƴ ⱳ ƴ ƒ, and through the same part Ƈ Ɛ Ƒ Ɠ Ɂ Ɲ Ɔ Ɋ Ɽ Ʈ ƈ ʃ ß ɠ ʔ ʕ ɂ ɔ ɽ s_p ʋ (21; their ball now follows the ball law; ʼ is read but does not move). Advances changed on most of them (Bold up to +62 on ƒ, Light up to -24).

Final (`build/qa-081.log`, one clean `qa.py` build; the per-master kerning refit, `AREA_KERN_FIT=1 build.py`, left
fit_kerning.json unchanged): audit_axis Bold 7 thin (at, cedi, ogonek, ogonekcomb, one.ss01, registered,
tretroflexhook; Khook cured), Light 1 (yhook, 44 > 15); audit_rays 13 glyphs (Ə ð ʕ ɂ ɲ œ @ & ® $ ⌦ ⌫ ✓; Ƙ Ⱳ Ƴ ⱳ ƴ ƒ ɽ
off the list, ʕ on), 474 glyphs and 27,270 places (27,276 before: the moved hooks' places). Every other check passes,
the curvature checks on both masters included. At every 25 units from 300 to 700: audit_rays 10 glyphs (Ə ɲ œ @ & ® $
⌦ ⌫ ✓; 27,118 places), audit_kern passes. Figure `22-axis.png`; pages regenerated with an "Axis round" section on
top (checked at 1024 and 390 px: no broken image, no horizontal scroll on the evaluation page).

## Axis round 2 (16 November 2026)

| # | Item | Rule | Before > after |
|---|---|---|---|
| 67 | 1. A node joining a straight to a curve (Light) | `white._straight_nodes`, in keep_taper's node moves (Light): a smooth node between a straight and a curve, the curve running on to a smooth node (not a bracket into a serif), where a place on that curve (or one whose ray ends on it) falls under the stem's own ratio (0.705) less the JND: the node travels along its own straight, its handle rescaled by the curve's chord, the curve's far handle shortened step by step (1 to 0.4) until the curve gains no turn; the least slide that brings those places within the JND, else the one that leaves them least short; kept only when the worst place comes at least the JND nearer, with no new crossing. The first attempt (round 1: every place short of its taper law, handles carried rigidly) moved 93 Light glyphs; read against the law alone it still moved 53 (n h m u among them, by 28 to 32 at their brackets), so it is triggered by the stem's ratio and stops at brackets | yhook Light 44 > 15 (300) becomes 44 > 23.2 at another place (its tail's node slides 80 up its straight); ɲ at 300 0.619 > passes audit_rays at every 25 units. Moved in the Light, each looked at: R and Rstroke (the leg's node, 11), Ꞌ and ꞌ, the saltillos (21, 24), ʋ (124: its counter's inner straight is shorter, the bottom left rounder in the Light), ɲ (82), ʈ (40), ƴ (80) |
| 68 | 2. The figure 1's flag; ʈ's ear | A curve keeps its shape on its chord (`bold_font`, after the white between parts): where a master's thinnest stroke (audit_axis's same-place reading) falls under its floor, each curve of the glyph is tried as its Regular shape on the master's chord (a similarity), the best kept when it lifts the thinnest place and adds no turn; not where a mid master stands between (on @ it dipped 30 > 18 between the 550 master and the Bold) | ʈ Bold 41 > 39 at 700: cured (the ear's handles had ridden the stem's knot 63 right and the tip's 41 left). one.ss01: not cured. Its flag needs thickness, not shape: the tip cut stays 40 where the taper law asks 51.7 at the Bold, and the place that stays thin (43.2 > 36.3) is by the crotch at (138, 619), which only keep_necks moves, and only in the Light. A prototype that sets the flag's underside off its top edge at the law (tip and underside handles) took it to 38.7 against a floor of 40, and lightened the Light flag (42.3 > 33.4): not used. one, onesuperior, oneinferior pass. Blocked: a crotch rule in the Bold (keep_necks is Light only) |
| 69 | 3. ogonek, ®, @ | Tried for ®: in `keep_white` the part that encloses the other holds and the enclosed one gives way first: no change (the R's leg gains nothing there to give; the engine's R runs 5 units into the ring before the guard). Reverted | ogonek and ogonekcomb 22 > 21 at 675 (19.7 > 18.7 at 700), ® 40.5 > 31.9, @ 40.6 > 34.2 and in the Light 0.667 at (641, 143): open. ® needs its R fitted to the ring's inner white (an enclosed part placed by its white to the ring), not written |
| 70 | 4. Where the ink really thins, by kind | Two kinds. (a) A sign built from strokes whose slanted strokes the engine read on the letters' diagonal ladder: towards the Light every slanted stroke of a sign now takes the sign law (1 + 0.37 f), as its plain strokes do (`bold.diag_target`). (b) A round stroke running into a junction (Ə's bowl into its bar, ɂ's and ʕ's bowl into the stem, &'s bowl and arm, ð's bowl and ascender, œ's two bowls, $'s S at its stroke): no rule written | (a) ⌦ ⌫ 0.606 and ✓ 0.666 of 400 at 300 now pass; 25 signs change in the Light only: < > × √ ∆ ∑ # & @ ® § ¥ ₩ ₹ ⇧ ⇪ ≤ ≥ ≠ ÷ ∕ ⁄ % ‰ ✕ (≤ 30 units, a little heavier at 300). (b) open: Ə ð ʕ ɂ œ @ & ® $ still flagged |
| 71 | 5. ₵ | Left for the owner: figure `23-cedi.png`. A: keep Libre Baskerville's drawn C (91 to 602, 416 wide) and its stroke; the C thins where the stroke crosses it at the Bold (46.5 > 39.4). B: rebuild ₵ from Area's own capital C and a stroke of the cap hairline through its middle, as ₡ and ₲ are built, struck in the masters as overlapping parts (the thin place goes; the Regular changes: a capital C, cap height, 680 wide where the cedi is 491) | (owner's choice) |
| 72 | 6. Hooks' curvature | `curvecheck.py --hooks`: the ball and neck of every hook or tail with a tilted ball (the ball's three nodes' box in the master being checked, grown by the chord), in all three masters; a master fails only on a fault the Regular's own drawing has not got there. The same `loops.even_part` that evens the tails now runs on these regions in each master, kept only where faults fall and nothing thins | The Regular's own drawings: 41 faults (listed; first drawings). Faults the masters made: Light 22 > 6, Bold 36 > 15 |
| 73 | 7. Pages | The evaluation template declares `<meta charset="utf-8">`; both base pages rebuilt (build_page.py, editor_page.py) on this build, then the 0.81 sections (page_081.py) | see below |

Final (`build/qa-081.log`, one clean `qa.py` build; the per-master kerning refit left fit_kerning.json unchanged): the
Regular unchanged; the Light changes 51 glyphs and the Bold 20 against round 1 (this round's: the straight-node rule's
eight, the 25 signs, ʈ, and the hooks the evening rule smoothed). audit_axis: Bold 6 thin (at, cedi, ogonek, ogonekcomb,
one.ss01, registered), Light none. audit_rays at the default stops 9 glyphs (Ə ð ʕ ɂ œ @ & ® $), 474 glyphs, 27,214
places (27,270 in round 1: the changed signs' places); at every 25 units 6 glyphs (Ə œ @ & ® $), 27,073 places.
audit_kern passes at every 25 units. The hooks' curvature check fails in both masters on the faults even_part could not
clear (Light 6, Bold 15). Figures `23-axis.png` and `23-cedi.png`; both base pages rebuilt (the evaluation page with the
before-builds 0.77 to 0.80 found in build/snap077 to snap080; round 7's page also embedded one more) and the 0.81
sections put on them; checked at 1024 and 390 px: no broken image, no horizontal scroll on the evaluation page, text
read as UTF-8 (the editor page lays out 980 wide at 390, as before: it has no viewport meta).

## Axis round 3 (16 November 2026)

| # | Item | Rule | Before > after |
|---|---|---|---|
| 74 | 1. A round stroke running into a junction (Ə ð ʕ ɂ œ & $ ®) | Not written. The eight split two ways: towards the Bold the stroke thins where it enters (Ə 67 > 48 from 400 to 700, ɂ, ʕ, &'s bowl); towards the Light it thickens there (ð 50.4 > 54.9, œ 58.2 > 73.1, $ 50.9 > 59.7, &'s arm 37.7 > 55.0 from 400 to 300). Tried, as a trial on the built Bold: keep_taper's node moves (the rule that holds tapering strokes in the Light) towards the Bold on the eight: only Ə moves, and its places' deficit falls 220 > 217; the others' places lie where the white ends, inside the junction zones the taper stations leave out, so no station-based rule reaches them. The rule asked for must find the entry (where the white ends) and hold both edges up to it, both ways (a minimum towards the Bold, a maximum towards the Light); it is not in this build | open: Ə ð ʕ ɂ œ & $ still flagged by audit_rays (® is cured by item 2) |
| 75 | 2. ®, @ | A letter in a ring (`bold_font`): a glyph whose ring is ©'s point for point in the Regular takes ©'s ring in each master; the letter inside keeps the Regular's offset from the counter's centre (in the counter's change) and is scaled about its centre until its white to the counter is the Regular's times the counter's own change across (as ℗'s P is sized by its ring in the Regular). Reaches ® only (℗'s ring differs from © by a unit). @: its a is one contour with its ring (the ring's tail is the a's stem), so it cannot be placed apart: open | ® Bold 40 > 32 (ring by R's leg): cured; the R is 0.878 of the engine's at the Bold, 1.0 in the Light; its white to the counter 41 (Regular 41.6). @ open: 40.6 > 34.2 at the Bold, 0.667 in the Light |
| 76 | 3. ogonek | The ogonek has no mid master: the dip at 675 is not a mid-master effect. Its 12-unit top cut stays 12 at the Bold while its stroke lengthens (19.7 > 18.7 across it at 700). Rule added: towards the Bold a stroke's straight cut end takes the tip's law (keep_taper, cut ends only, no other node). It reaches s_p, s_t, ƭ and ™ (their cut ends grow 4 to 8), but not the ogonek: the Bold's taper rule holds only places read thinner than the Regular by a unit, and the ogonek's reads 0.95 under. Growing its cut by the tip's law (4 units) cures it in a trial (19.7 > 22.0 at 700) | ogonek, ogonekcomb: open (1 unit) |
| 77 | 4. one.ss01 | keep_necks towards the Bold (a neck never thinner than the Regular's), tried on every glyph of the built Bold: it reaches only < and > (their inner vertex) and not one.ss01, whose thin place (101, 604) to (85, 636) is 40 units from its crotch, across the flag. Growing the flag's tip cut by 6 to 18 units lifts it only to 37.5 to 38.1 against 41. Not applied | one.ss01: open (43 > 36 at 700); one, onesuperior, oneinferior pass |
| 78 | 5. Hooks' curvature | even_part already runs on every hook region in both masters (round 2); the faults left are where it does not converge without thinning. Comb sheets: `24-hook-combs-masters.png` (each remaining master fault's glyph in its master), `24-hook-combs-regular.png` (the Regular's ten worst: Ⱳ node 11 and ʔ node 33, curvature from none to radius 593 and 498 (a straight into a curve at full curvature), ⱳ and ƴ node 12 / 10 likewise, ƒ node 35 21.1x, Ɽ and Ʈ node 9 2.88x, ɔ node 15 2.02x, Ɔ node 25 1.93x, Ƒ node 41 1.76x). The Regular is not changed | see the list below |
| 79 | 6. The 25 signs at 550 and 700; ʋ | The sign rule is the Light's only: at 550 and 700 the 25 signs are byte-identical to round 1 (the Bold diff lists none). ʋ: the slide was overshooting (124 units up a 277-unit straight for a place 5.5% under the stem's law, read where audit_rays does not take a stroke): the straight-node rule now reads as audit_rays reads and reaches at most 1.5 times the Regular's stroke at the places it holds (`white.SLIDE_REACH`); ʋ does not move (back to round 1), nor do R, Rstroke and the saltillos | ƴ, ɲ, ʈ keep their fixes |

Final (`build/qa-081.log`, one clean `qa.py` build; the per-master kerning refit left fit_kerning.json unchanged): the
Regular unchanged. Against round 2: Light ® (ring and R), ʋ back to round 1, R, Rstroke and the saltillos back to round
1, ɲ (its slides now 78 and 52) and ʈ by a unit; Bold ® (ring and R, advance 888 > 867, ©'s), ſp ſt ƭ ™ (their cut ends).
audit_axis: Bold 5 thin (at, cedi, ogonek, ogonekcomb, one.ss01), Light none. audit_rays at the default stops 8 glyphs (Ə
ð ʕ ɂ œ @ & $), 474 glyphs, 27,266 places; at every 25 units 5 glyphs (Ə œ @ & $), 27,125 places. audit_kern passes at
every 25 units. The hooks' curvature check still fails on the faults even_part cannot clear (Light 6, Bold 15; comb
sheets `24-hook-combs-masters.png`, the Regular's ten worst `24-hook-combs-regular.png`). Figure `24-axis.png`; both base
pages rebuilt on this build with the 0.81 sections ("Axis round 3" on top), checked at 1024 and 390 px: no broken image,
no horizontal scroll on the evaluation page, UTF-8.

## Owner round 8 (16 November 2026)

The owner compared g.ss02 in 0.80, the 0.81 tip before the owner round and the round 7 build at 300, 400, 550, 700:
"the g from 0.80 is the best one. the new single story g is not smooth at all on the bottom right curve." Item 1 only:
g.ss02. The build before this change is saved as `build/snap081` (fonts and master UFOs).

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 80 | g.ss02's tail back to 0.80's | Form D (owner round, #46) kept 0.80's ball height on 0.81's half-ellipse: both stem edges ran straight down to the ball's height (-115 in the Regular) and the outside then turned in one quarter 158 wide and 69 tall. Along the outside from the stem the radius went 64, 87, 136, 188, 262, 351, 428, 495 (a tight corner, then a flat run into the lowest point, which sat at x 302). 0.80's outside leaves the stem at the baseline and turns in one quarter 255 wide and 235 tall, radius 207 to 290 all the way (read on the variable font at 400) | 0.80's construction restored as form E (`charset.G_TAIL_FORMS["E"]`, `_tail_080`): four quarter turns between five places, each handle 0.55 of its side; the outside leaves the stem 2 units above the baseline (0.80's j as drawn; j's own tail rule has since moved j's to 11), the inside where j's inner stem edge ends; lowest point 0.518 of the bowl's width (0.560 at the Bold stem), ball top 0.138 x-height under the baseline (0.120 at the Bold stem). The ball is j's: in the Regular and Light j's ball is 0.80's point for point; in a master `bold.bold_font` now passes the master's j as the engine read it, before the 0.81 tail rebuild (the Bold engine's j ball is 0.80's Bold j ball point for point, so 0.80's path is reproduced, not copied). The white law between ball and bowl still holds the Bold ball (1 unit lower than 0.80's). The masters' curvature evening (`loops.even_part`) leaves g.ss02 alone (`bold.G_OWNER_SHAPE`). The bowl and stem stay today's (q's) | tail against 0.80, variable font, greatest distance between the outlines anywhere on the tail: 300 1.0, 400 0.0, 550 0.4, 700 1.0 units (point for point on the masters: Light 1, the whole tail a unit left with today's Light stem; Regular 0; Bold 1, the ball by the white law and the outer foot 2 against 3). Against the round 7 build the tail moves up to 38, 40, 44, 49 units at 300, 400, 550, 700 |
| 81 | ɡ (U+0261, g.ss02 as a component) | Its master advance was the composites pass's reading of g.ss02's ink, taken before the splice: Light 606, Bold 689 against g.ss02's 603 and 688, and it moved with the tail (610 and 678 in the first build of #80) | After the splice a glyph that is g.ss02 alone takes the spliced g.ss02's advance (`bold.bold_font`) | Light 606 > 603, Bold 689 > 688 (now g.ss02's); the Regular 628 unchanged |

Curvature (curvecheck), honestly: 0.80's tail reads as 0.80 did. Regular: the ball's left side 1.42, the outside's lowest
point 1.45, the inside's 1.38 (limit 1.25); Light 1.45, 1.65, 1.30; Bold the ball's left side 1.65 and a 49% valley on the
inside into the ball (the engine's ball, 0.80's). The outside's lower-right quarter itself has no fault: its radius runs
207 to 290 with no jump. The faults are where the quarters meet at the lowest points (the bottom-left quarter is flatter,
radius 401 against 277) and at the ball. They are listed in `curvecheck.EXPECTED` as the owner's choice, so the check
still prints them and fails on anything new. audit_axis: unchanged (the same 27 lines as round 7's build; g.ss02 and ɡ
not flagged). audit_rays on g.ss02 and ɡ every 50 units 300 to 700: ok (254 places). audit_charset: 0 errors (form E,
ball top 0.138, tail end 0.959).

Every glyph that moved, against `build/snap081` (all three masters, the Bold's mid layer, the Regular TTF, the variable
font at 300, 400, 550, 700): g.ss02 and ɡ (uni0261) only; ɡ's advance as #81, no other advance. Kerning: only the
collision keys before j: g.ss02 / ɡ with j, ĵ, ȷ 71 > 37 (Regular), 72 / 69 > 37 (Light), 95 / 74 > 67 / 42 (Bold, ĵ ȷ
85 / 64 > 57 / 32), and the Bold's g.ss02 florin 16 > none: the 0.80 tail reaches less far under the j. No kerning refit
was needed. Figures (`build/owner8/`): `new-over-080.png` (0.82 filled, 0.80 red), `new-over-081.png` (0.82 filled, round
7 red), `before-081-over-080.png`; numbers in `new-over-080.txt`, `diff-vs-081.txt`. Pages not rebuilt.

### Owner round 8, items 2 to 4 (16 November 2026): weight gained evenly on both sides

The owner looked at overlays (the Regular grey under each weight in red) and ruled that some letters "do not gain
weight evenly on both sides, causing visual imbalance". Measured first with `build/weightscale/balance.py` (part B,
against seven reference families, numbers only); ends are the outermost ink of the top and bottom 40% of the glyph.
Each item was built, diffed against the build before it (all three masters, the Bold's mid layer, the Regular TTF and
the variable font at 300, 400, 550, 700), audited and looked at before the next. Figures and numbers: `build/owner8/`.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 82 | 2. C and c: "the c top part is way longer than the bottom part ... the top and bottom parts should be aligned" | Drawn so in the Regular: C's top barb reached 33 units past its lower end (C 661 against 628), c's lower end 10 past its ball; every reference has the bottom as far out as the top or further (C top - bottom -30 to +2). The engine then grew the top more (C +12, c +13 at 700) | The two terminals end on one vertical (`joins.terminal_line`, in normalize after `C_end`, before the extremes are solved): the line is the references' median reach of the rightmost terminal over the round letter's width (C over O 0.891, range 0.887 to 0.901; c over o 0.882, range 0.820 to 0.923; `build/owner8/cshare.py`), so C's top barb comes in 11 and its lower end goes out 22, c's ball goes out 10 and its lower end stays (1 unit). A terminal moves level as one piece and the half of the letter it ends is stretched level to meet it: the outer and counter extremes keep their share of the run from the left extreme, each handle its share of its curve (`joins.move_terminal`, as `charset.restretch_x`); moving the terminal alone left a flat place in C's lower arc. In the masters the two terminals share one x knot, so the engine moves them alike; `bold.c_terminals` holds them on one line after the later rules (half the difference each; no glyph needed it in the final build). The advance follows the rightmost ink: C 680 > 669 (side bearings unchanged), c 505 | top - bottom, variable font, 300 / 350 / 400 / 450 / 500 / 550 / 600 / 650 / 700: C +25 +28 +33 +35 +36 +38 +41 +42 +45 > 0 at every stop; c -15 -13 -10 -8 -7 -4 -2 0 +3 > +1 at every stop. Advances: C Light 660 > 653, Regular 680 > 669, Bold 723 > 707; c 489 > 486, 505, 553 > 554 |

Item 2, what followed and what did not. Moved (every master and the variable font): C c and their composites (Ç ç Ć ć
Č č Ĉ ĉ Ċ ċ Ḉ ḉ), the barred and struck forms (Ꞓ ꞓ Ȼ ȼ), ¢ and ₡; nothing else, and only these glyphs' kerning keys
(Light 70, Regular 6, Bold 72: collision and fit keys of the C and c families). Not derived from C or c, so unchanged:
©'s C (Libre Baskerville's own drawing inside the ring), ₵ (its own drawing; the rebuild from Area's C is still the
owner's decision, `23-cedi.png`), Ɔ ɔ (own drawings, not turned C's), Ƈ ƈ (own drawings). G: its top barb is its own
(not C's points) and already ends 17 units inside its stem in the Regular (`joins.G_lower` put the stem in line with the
top barb as Georgia Pro has it); G's ends grow the other way (top - bottom -9 / -20 / -51), the lean the hand-over lists
(open item 6). G was not changed. Checks against the build before: audit_axis, audit_bold (Bold and Light), parts,
curvecheck (three masters, hooks), even: unchanged; audit_rays the same 8 glyphs (27,271 > 27,235 places, the C family's);
audit_lean one flag fewer (C's lean at 300); evaluate: c's ball node 2.8 > 2.6 times. Read on the whole glyph with
curvecheck's comb (outside its regions): Regular C as before, c 1.31 / 2.78 / 1.39 > 1.33 / 2.71 / 1.37 at its three
worst nodes; Bold c four faults > two; Light c 1.92 > 1.35 at its left extreme, but the Light C's left extreme now
reads 1.27 (limit 1.25). Figures: `item2-C-c.png`, `item2-derived.png` (before | after at 300, 550, 700).

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 83 | 3. x and X: "the top left and bottom right ends get longer and causes visual imbalance" | Towards the Bold only (the Light x is even). The thick stroke gains more across than the thin one (x 73 > 132 against 37 > 47), and each end's serif hangs off its stroke's outer edge, so the thick stroke's ends (top left, bottom right) went out further: about the four ends' centre at 700, x +27 / +6 / +7 / +29 (TL TR BL BR), X +40 / +18 / +20 / +43; the seven references at Area's stem step within -6 to +4 of each other (median growth 24 for x, 17 for X) | The letter turns about its crossing, both strokes the same way, so the openings between the ends stay (`bold.cross_ends`, towards the Bold only). X (four arms, each a stroke of its own): in `slant_lines` every arm takes the Regular's lean turned by one angle (`arm_turn`) and its line is placed through its corners at the crossing, so its end slides along the turned edge and its serif follows by `serif_on_slant`; the angle is solved by halving (0.51 degrees). x (two whole strokes, its thin ends placed by `crossing_openings`): after the engine the two top arms move level +s and the two bottom arms -s, each whole (`cross_shear`, s = 11), each stroke's edges come back to the engine's thickness across, the corners are where the edge lines meet and each bracket's handle lies on its turned edge. Tried and refused first for x: turning the thick stroke in the engine (`cross_turn`) with a smaller openings' share; the serif-end openings are held on the knots, so the thick stroke's inner bracket ran back under its serif (an S in both inner brackets at 700, `item3-x-X.png` of that build). The earlier decisions stand: the thick stroke's angle is still the Regular's within the engine and `crossing_openings` still sets the openings; the shear then turns the x as a whole about its crossing (thick stroke 36.1 Regular, 36.3 > 33.7 Bold; thin 38.5, 40.1 > 42.2; the references' thick turns +1.0 and -2.2, Georgia Pro's thin 5.1). X is still four arms; the crossing rule still does not see it | ends about their centre, spread (largest less smallest) at 450 / 500 / 550 / 600 / 650 / 700: x 3 6 10 14 18 23 > 0 1 1 1 2 2 (700: +16 +17 +18 +18); X 3 7 11 15 19 25 > 0 0 0 0 0 0 (700: +31.5 at all four). Mean growth kept (x 17.2, X 30.2 > 31.5). Advances at the Bold: x 596 > 582 (1.054 of the Regular; n's 1.098: 0.96 of n's growth, references 0.997 and 1.032), X 820 |

Item 3, what moved: the Bold master's x, X and their composites (ẋ ẍ Ẋ Ẍ); the Light and the Regular are byte-identical,
and in the variable font at 300 and 400 x and X differ only in the quadratic conversion (cu2qu converts the masters
together; 1 to 2 units on two off-curve points). Kerning: only keys with x or X (Bold 339, the collision and fit
passes on the new advance). Checks against item 2's build: audit_axis, audit_bold (both), parts, curvecheck (three
masters, hooks), evaluate, even unchanged; audit_rays the same 8 glyphs (27,235 > 27,226 places); audit_lean: X's lean
at 700 (-0.048, references -0.027 to -0.024) cured, but x now leans the other way at 700 (-0.005 against the
references' -0.037 to -0.018; it was -0.044, inside): the references' x leans a little left with its ends balanced, so
the two asks cannot both be met by one shear (a shear of 7 keeps the lean in band and leaves the ends 7 apart); the
ends were kept. A first build turned X in the Light too (6 units' spread at 300, not asked): it put a lean flag on X at
300, so the rule acts towards the Bold only. Left as the engine draws it: the x's thick stroke's inner bracket at the
Bold stands almost upright under its serif (the serif reaches 1 unit past the edge there, 37 in the Regular), as
before this item. Figure: `item3-x-X.png`.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 84 | 4. z and Z: the diagonal's outer ends grow, so the letters lean right as they gain weight | The diagonal already thickens about its centreline (its centreline moves 2 units against the four ends' centre at 700). Its outer corners are the top bar's right end and the bottom bar's left end, so each goes out by half the diagonal's gain across, while the bars' free ends (the beaks) stay: about the four ends' centre at 700, z +5 / +36 / +32 / 0 (TL TR BL BR), Z +5 / +42 / +40 / +2; the references within -10 to +9 of each other, all four growing together (Georgia Pro 38 to 41, Serrif 21 to 29) | The bars' free ends move out level by the difference (`bold.bar_ends`, both masters, after the C rule): the nodes of the top 40% left of its middle (the top-left beak and the bar's end) and of the bottom 40% right of its middle (the bottom-right beak), with their handles; the bars' level edges take up the length. The diagonal, the outer corners and the letter's width stay the engine's; the four ends grow alike, as the references' do. A barred z's middle bar lies in neither band. Composites on Z, z, z.ss06 take the letter's new advance (they were placed before the master rules). Chosen over pulling the diagonal's corners in (turning the diagonal steeper with the bars shifted): that keeps the mean but narrows the Bold z by 31 units (1.044 of the Regular against n's 1.098), where the z's width growth is already inside the references' (1.010 of n's; Georgia Pro 1.013, Source Serif 4 1.001) | ends about their centre at 700: z +37 / +36 / +32 / +32, Z +43 / +42 / +40 / +40 (top-right less top-left -0.6 and -0.6; bottom-left less bottom-right -0.4 and -0.4; limit 8). Spread at 450 to 700 every 50: z 1 2 2 3 3 5, Z 1 1 2 2 3 3 (before: z 11 22 34 47 62 79 read as TR+BL less TL+BR; the band ends' Rd at 700 +40 > +8, Ld +66 > +34). At 300: z 3, Z 1 (before 16 and 15). balance.py dRd/stem at 700: z +0.58 > +0.06, Z +0.65 > +0.03 (references -0.18 to +0.15) |

Item 4, what moved: in both masters z, Z, z.ss06 and their composites (ź ż ž ẑ ẓ ẕ Ź Ż Ž Ẑ Ẓ Ẕ and the .ss06 forms), and the
struck Ƶ ƶ, which the variable font builds from the master's letter. Advances: Light z 470 > 457, z.ss06 464 > 454, Z 605
> 590 (the top-left beak, the Light's leftmost ink, comes in 13 and 15); Bold Z 687 > 690, z 530. Regular unchanged.
Kerning: only keys with the z and Z families (Light 132, Bold 130). Checks against item 3's build: audit_axis, audit_bold
(both), parts, curvecheck (three masters, hooks), evaluate, even unchanged; audit_rays the same 8 glyphs (27,226 >
27,240 places); audit_lean 50 > 48 flags: z's lean at 700 (+0.048, references +0.008 to +0.025) and the z and Z centre
flags at 300 cured; one new: Z at 700 now leans +0.009 against the references' +0.019 to +0.040 (it leaned more before
and passed). Figures: `item4-z-Z.png`, `item4-derived.png`.

Kerning, once at the end of items 2 to 4 (`AREA_KERN_FIT=1 build.py`): the per-master fit table changed only in pairs
with a C, c, x, X, z or Z class or glyph on one side (Light 25 pairs, 206 > 220 fitted; Bold 115, 555 > 521).
`audit_kern.py` passes at 300, 350, 400, 550, 700 and at every 25 units from 300 to 700 (`build/owner8/kern*.txt`).
Pages not rebuilt.

### Owner round 8, items 5 to 8 and the sweep (16 November 2026): the geometric signs

The owner, on the symbols at 300 / 400 / 550 / 700: "a lot of uneven thicks and thins, non smooth curves, and
visual/optical imbalance. Some vector errors with the arrows on the delete keys, checks, division symbol." Measured
first with `build/owner8/signs/measure.py` (every straight edge 22 units or longer against the near-parallel edge
across the ink, perpendicular, on the variable font at 300, 400, 550, 700) and on the references with `refs.py`
(numbers only). The build before is `build/snap082i4k`; one build carries all of it (`build/snap082s5`, kerning
refit), committed per item.

The rule (`signs.py`): a sign of plain strokes is centrelines and stroke weights; each edge a line half the stroke
from its centreline, each corner where two edge lines meet (an inner outline is a true inset, an inner point sharp),
each end cut as the sign's kind says; nothing a union of overlapping bars. The Regular builds it at the Regular's
weights and keeps the recipe in the glyph's lib (`charset.put_built`); each master builds it again with every stroke
times the minus's own law, 1 + 0.37 ft (Light 0.764, Bold 1.370), and carries it onto the Regular's final points
corner by corner (`bold.construction_signs`: a point moves as its nearest construction corner moves, so soft_ends'
rounding goes with its corner). The corners are linear in the stroke, so the 550 instance is the construction at
its own weight. The erase key's cross is shortened only where its white would fall under the white law's least
(it does not at 700).

| # | Item | Cause (measured) | Rule | Before > after (across the stroke; 300 / 400 / 700) |
|---|---|---|---|---|
| 85 | 5. ⌫ ⌦ | The inner outline was set by hand (point 1.9 strokes in, slanted inner edges at 52.7 degrees against the outer's 47.4): slanted sides 43-64 / 52-73 / 110-129 against level 39 / 52 / 71; the inner point 99 behind the outer at 400 and 180 at 700 (a true inset: 71 and 97), a solid wedge at 700; the top pinned on the x-height zone so the Bold grew downward only (middle 285 > 273); the cross at 484 where the box part's middle is 490.5 (Bold 522 against 546.5) | `signs.erase`: the frame's centreline is the Regular outer outline moved in half the stroke, the outlines half the stroke either side; the cross half way between the shoulders' and the right side's centrelines, on the frame's middle. ⌦ is ⌫ turned over (MIRRORS) | frame level / slanted / upright 40 40 40, 52 52.2 52, 72 71.5 72; inner point sharp; the cross centred in the box part at every weight; Bold advance 847 > 813 |
| 86 | 6. ✓ | Two bars unioned: the short bar's foot stood out past the long one (a notch at the vertex at every weight); the engine read the 65-unit strokes as letters' thick diagonals: 57 / 65 / 124 (1.90 at 700) | `signs.check`: the short stroke into the vertex and the long one out, 1.25 of the minus both at every weight, ends cut square, the vertex a flat 0.42 of the stroke across the bisector outside (the face's vertex rule) and a point inside | 49 / 65 / 88-89 (the law's 1.37); one clean vertex, the same at every weight; Bold advance 622 > 582 |
| 87 | 7. √ ÷ | A union of a bar, a vee and a rectangle: a jag where the lead-in met the downstroke ((126,400), (142,374)); the lead-in did not change with weight (52 at 300 and 700), the thin upstroke tapered 3-4, the thick stroke went unread at 550 and 700 (a wedge). ÷: dots equal (118) but centred 3 right of the bar; bar the minus's | `signs.radical`: the outer edges meet in the foot's point (which stays); the thick and the upstroke grow inward from their outer edges, the lead-in about its centreline; the lead-in's top edge meets the downstroke's right edge in the beak, its lower edge the left edge in the crotch; the upstroke's left edge meets the bar's top in a corner, its right edge the bar's underside. Thin, lead-in and bar the minus's; the thick 1.44 of them (Area's 0.96 stem over the minus) at every weight. ÷'s dots moved over the bar's middle | lead-in / upstroke / bar / thick: 40 40 40 57, 52 52 52 75, 71 71 71 102 (references' thick grows 1.24 to 1.71, median 1.34; Area 1.37). ÷ centred in every master |
| 88 | 8. ∑ < > × | ∑ is Esh's drawing but was read as a plain sign: its bars (curved inner edges) grew as hairlines 46 > 57 where E's arms grow 46 > 61, its thin diagonal 53 > 73 by the sign law, and in the Light all its slanted strokes by the sign law (upper 84 at 300 where Z's thick goes 0.75); its point was four nodes in 31 units (a zigzag). < >: Libre Baskerville's drawing, arms 49.2 and 48.3 (65.4 / 64.4 at 700 against the minus's 72), a 66-unit flat at the point (the references' 0.72 to 0.92 of the stroke), its middle 2 under the axis. ×: arms 49.1 and 45.6 (64.4 / 60.9 at 700); ≤ ≥ the < squashed to 0.82: arms 41 beside a 52 bar | ∑ a capital in the masters (`bold.HINTS`: the letters' laws; its bars E's arms', read as straight), its point a capital vertex in every master (`charset.sum_vertex`: a flat 0.42 of the master's capital stem across the bisector: 36, Bold 62, Light 25). < (`signs.chevron`): arms of the minus's weight on the maths axis, both ends cut upright at one x, an upright flat of 0.79 the stroke (the references' median) outside the point and a point inside; ≤ (`chevron_bar`) the same over a bar; > ≥ them turned over. × (`signs.times`): two strokes of the minus's weight crossing square on the axis, the old ink box | ∑ bars 36 / 46 / 61, thin diagonal 43 / 54 / 71, thick 77 / 98 / 158 (Z's 66 / 88 / 149); upper / lower 1.85 / 2.26 at 400 / 700 (Georgia Pro 2.47 / 3.53, Serrif 2.40 / 2.91, Source Serif 4 1.50 / 1.62). < > 40 / 52.3 / 71.6, both arms; × 40.5 / 52.3 / 71.8; ≤ ≥ 40 / 52.4 / 71.4 with their bars 40 / 52 / 72 |
| 89 | Sweep: the same faults elsewhere | (a) Towards the Light a sign's upright and slanted strokes took 1 + 0.37 f where its level ones (the minus's) take 1 + 0.37 ft: + 40 level beside 44 upright at 300, ± ¬ the same, every arrow's head 44-45 beside its shaft 40, ⌃ ⇧ ↵ 45. (b) Inner outlines set by hand: ⇧ ⇪ (head flanges 32 beside sides 52), ◊ (43 to 57), ∆ (sides 52 to 76 and 69 to 97). (c) Weights off the minus: ≠'s stroke 46, ⌥'s diagonal 54.7 (drawn 1.05), ↖ ↗ ↘ ↙ 48 (the arrow scaled whole to 0.92). (d) ⌃ was the up arrow cut across: a 54 by 16 notch in its crotch and two 2-unit steps | (a) `bold.x_target`, `diag_target`: a straight stroke of 50 to 55 in a sign takes 1 + 0.37 ft in both directions (curved ones keep f: & @ $ ® § £ do not move). (b) `signs.frame` for ⇧ ⇪ ◊ (⇪'s bar under the shaft at the Regular's gap, the law's least towards the Bold); ∆'s inner edges parallel at A's weights (`signs.inset_edges`) and the capitals' laws in the masters (`bold.HINTS`). (c) ≠'s stroke rebuilt at the minus's across itself (`charset.plain_strokes`), ⌥'s diagonal at the minus's, the slanting arrows the arrow made 0.92 as long at full weight. (d) `signs.caret`: the arrows' head stroke, two of them mitred | + 40 40 at 300; arrows' heads 39.6-40 at 300; ⇧ ⇪ 40 / 52 / 71-72 all round; ◊ 39.5 / 52 / 71.2; ∆ thin 39 / 49 / 64 and thick 64 / 86 / 146 (A's 39.6 / 48.5 / 64.7 and 64.5 / 86.5 / 147); ≠ 40 / 52.8 / 72.4; ⌥ 39.6 / 51.6 / 70.3; ↖ 40-41 / 52 / 70; ⌃ 40 / 52 / 71, advance 612 > 566 |

Every glyph that moved (`build/owner8/signs/diff-final.txt`, all three masters, the Bold's mid layer, the Regular TTF,
the variable font at 300, 400, 550, 700): Regular and Bold 22 glyphs: ⌫ ⌦ ✓ √ ÷ ∑ < > ≤ ≥ × ≠ ∆ ◊ ⇧ ⇪ ⌃ ⌥ ↖ ↗ ↘ ↙; the
Light those and 20 more by (a): + ± ¬ | ¦ / \ # ← → ↑ ↓ ↔ ↕ ↵ ⇤ ⇥ ⌘ □ ☆. Nothing else: & @ $ ¢ ® and every letter are
byte-identical; the Bold's mid layer unchanged. Advances: Regular ⌃ 612 > 566, ↖ ↗ ↘ ↙ 424 > 428; Bold ⌫ ⌦ 847 > 813,
✓ 622 > 582, × 646 > 616, ⌃ 620 > 570, < > 602 > 608, ≤ ≥ 602 > 609, ◊ 454 > 476 and a few units on the rest; the Light
2 to 14 units narrower on (a)'s glyphs (◊ 468 > 454, ⌃ 610 > 560). Kerning refit (`AREA_KERN_FIT=1`): fit_kerning.json
unchanged; the masters' collision keys with these glyphs moved (Light 6, Regular 1, Bold 14, all with ldot, the
fractions or ĩ). Checks against item 4's build: audit_bold (both), parts, curvecheck (three masters, hooks), even,
audit_axis Light unchanged; audit_rays the same 8 glyphs (27,240 > 27,234 places); audit_charset 0 errors;
interpolation passes; audit_kern passes at every 25 units. Two new notes, honestly: audit_axis Bold lists the radical
(41 > 40 at 700, tip 41): its same-place cut lies across the beak (74 degrees, edges 19 and 20 at shares 0.79 and
0.11), where the downstroke's right edge shortens as its inner point rises; no stroke thins. pathlint: ∑ one handle
warning more (the curve into the lower diagonal, its node's handle turned 1 unit by clean.true_curves onto the new
line; its 1.3-degree bend INFO gone). Figures (`build/owner8/`, before row over after row at 300 / 400 / 550 / 700,
600 px per 1000 units, nodes marked): `item5-erase.png`, `item6-check.png`, `item7-radical-divide.png`,
`item8-sum-less-times.png`, `sweep-1.png` to `sweep-3.png`. Pages not rebuilt.

Left, with numbers: ∑ at 700 still reads heavy in its upper diagonal where it meets the top bar (the drawn bracket
curve fills to a wedge; the diagonal itself is Z's law, 158 against Z's 149, and the ratio is inside the references');
÷'s dots at 700 are 178 across and 33 from the bar (74 at 400: the dot law grows them 1.47 while the bar grows 1.37);
⇤ ⇥'s bar reads 44 at 300 beside 40 (the engine reads it with the arrow's end, not as a 52 stroke); ✕ (U+2715) is
1.1 of the minus by design at every weight; ^ is an accent-like drawing with tapering arms (outer 56.7 degrees, inner
45.5), a different kind; ∞ ∂ ∫ µ π Ω ∏ are curves or letters (∏ is H's stems, 86 / 148) and were not touched.

### Owner round 8, items 9 and 11 (16 November 2026): the ampersand, the division sign's dots

The owner, on the symbols: "a lot of uneven thicks and thins, non smooth curves, and visual/optical imbalance ... the
ampersand needs a lot of work". The build before is `build/snap082s5b`; the build that carries both items is
`build/snap082b`. Figures and numbers: `build/owner8/` (`item9-ampersand.png`, `item9-amp-refs.png`,
`item11-divide.png`; `amp/` holds the scripts, the diffs and the audit outputs).

The ampersand, read first as a skeleton (`build/owner8/sym/ampmeasure.py`, the references measured only). In the
Regular drawing the strokes did not follow one model: the diagonal 90 across where v's thick is 74 (the references 0.90
to 1.07 of their stem), the loop's top 62 where the hairline is 43 (references 0.41 to 0.59 of the stem), the loop's
left 81 and its right side 79 (references' right 0.68 to 0.83 of the stem), the lower bowl's left 93 (o's side 82)
and its bottom 60; the upper counter 0.45 of the lower in area (references 0.55 to 0.79) and its centre 59 right of
the lower counter's (references +1 to +49, median +12), so the loop sat over the crossing, not over the bowl. Its
pieces met in corners hidden in the diagonal, so no edge was one run. In the masters the engine read it as loose
parts: towards the Bold the bowl's stroke into the diagonal thinned (audit_rays 48.8 > 42.9 > 37.6 > 30.8 at
(594, 349) from 400 to 700) and the loop's counter closed to 69 across (references 134 to 166); towards the Light it
thickened at (541, 256) (45.9 > 53.0 at 300).

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 90 | 9. & | As above: weights that belong to no letter, a loop off the bowl's axis, pieces joined in hidden corners; the engine could not read the parts | `amp.py`: the & is one stroke and an arm. The stroke runs from the tail's tip up the diagonal, round the loop (up its left side, over the top, down its right side), down the spine across the diagonal, round the lower bowl and into the diagonal again; each of its two edges is one chain of curves (lines on the diagonal), and the outline is where the ribbon crosses itself and where the arm leaves the diagonal: every corner is two edges meeting, found, not placed. Weights from the same master's letters (`amp.readings`): the diagonal and the loop's left side v's thick (one stroke, one weight), the lower bowl's left side o's side (the round thick), the loop's top and the spine where it crosses o's hairline, the loop's right side half way between (the stroke runs from the top's hairline into the spine's), the bowl's bottom and the tail a's lower stroke (a bottom that runs into a stem), the arm v's thin stroke ending in v's serif on its thin arm, point for point (the arm is a thin up-right diagonal as v's is; every reference but Literata ends it level). The tail ends in the drawn cut. The skeleton (`amp.REG`): the loop's counter over the lower counter (+21, references' median +12), the spine crossing the diagonal at 28 degrees below level so the bowl's upper-left turns as a full quarter (at 38 degrees its outside ran straight and turned in a 31-unit handle: a chin), the bowl's left extreme at 160. Handles solved: one curvature on both sides of every smooth node, a curve leaving a straight at under 0.30 of its mean, no flat place, no inflection inside a curve. Each master runs the construction again at its own letters' weights, the skeleton stretched level as o's counter changes (the loop's white), then the outer parts (the bowl's left side and bottom out to the left, the tail and the arm to the right) spread until the ink widens as n's advance does (`amp.widen`; the references' & widen 0.98 to 1.05 of their own n's growth at 700, median 1.02; towards the Light the stretch alone gives 1.008, no spread). The 550 mid master is the construction at the readings half way (0.427). In `normalize` after every node rule (`amp.regular`) and in `bold.bold_font` after the signs (`amp.master`) | Regular: diagonal 90 > 74, loop top 62 > 43, loop left 81 > 74, bowl left 93 > 82, bowl bottom 60 > 50; upper / lower counter area 0.45 > 0.58, centres +59 > +21; counters 137 / 299 > 208 / 326 across. Light: upper / lower 0.59, +18.5. Bold: upper counter 69 > 167 across, lower 278, upper / lower 0.51, +35.5, loop right 99.6, bowl left 143. curvecheck on the whole glyph: Regular worst node 1.02 (no fault), Light 1.03, Bold 1.03 (the previous worker's construction, unbuilt, worst 1.02 in the Regular but the chin). Advances: Regular 810 = 810 (ink 38 to 774 as before), Light 788 > 796, Bold 885 > 872 (mid 842 > 836). audit_rays: ok at every default stop (was the 48.8 > 30.8 thinning and the 300 thickening) |
| 91 | 11. ÷ | Its dots took the i's dot law (1.51 at the Bold): 178 across and 33 from a 72 bar at 700 (74 at 400) | Towards the Bold the dots take the sign law, the minus's own (1 + 0.37 ft, as the bar), about their centres, and each stands at least the bar's thickness off the bar (the references' gap at 700 is 0.45 to 1.11 of their bar, median 0.99; their dots grow 1.08 to 1.43, median 1.24). The Light keeps the engine's (dots 96, gap 90). `bold.bold_font` after the signs | dots 96 / 118 / 137 / 162 (were 96 / 118 / 144 / 178) at 300 / 400 / 550 / 700; gaps 90-91 / 73-74 / 73-74 / 72-73 (were 90 / 73 / 56 / 33); bar 40 / 52 / 60 / 72; advance unchanged |

Every glyph that moved (`amp/diff-b.txt`; three masters, the Bold's mid layer, the Regular TTF, the variable font at
300, 400, 550, 700): the ampersand everywhere and the division sign in the Bold (and so the variable font at 550 and
700); nothing else. Kerning: only keys with the ampersand (Light 26, Bold 34; the collision passes on the new outline);
the fit refit is left to the end of the round.

What was kept and what was not of the first attempt (an earlier worker's uncommitted `amp.py` and hook-up, which built
the Regular and then failed in the Bold): kept the construction (the ribbon, the corners found, the readings, v's serif
on the arm, the handle solver, the mid master) and the division-sign rule as written. Changed: the spine's angle
(38 > 28 degrees) and the bowl's left extreme (150 > 160), which took the chin out of the bowl at every weight; the
master's width (o's counter alone left the Bold & 0.97 of n's growth and its lower counter cramped; stretching it whole
to n's width ran the loop's inside back past the diagonal's edge, so only the outer parts spread); the error message.
The Bold failure was not the construction: it does not recur.

Looked at, honestly. At 300 and 400 the & now reads as one stroke: thick down the diagonal and the loop's left side,
thin over the top and through the spine, the bowl's left the o's round thick, the bottom easing into the diagonal; the
loop stands over the bowl. At 550 and 700 the upper counter is open (it was a slit) and the bowl round. Still not
right: at 700 the loop's outer top is broad and flat from the heavy left shoulder (the loop's left side is v's thick,
133, against a 53 hairline over a 218-unit quarter); the bowl's bottom (a's lower stroke, 55 at the Bold) reads lighter
than the references' at 700; the bowl's outer left extreme turns tighter at 700 than at 400 (radius about 0.6 of the
Regular's, read on the figure). These are the next things to change if the owner wants the Bold heavier at the base.

Checks on `build/snap082b` against the build before: audit_rays on & and ÷ ok (the & was the worst glyph in it);
audit_axis Bold the same thin list (@, ₵, ogonek, one.ss01, the radical) and one new note: & curve 22 (the upper
counter's top-left quarter) gained an x extreme between 400 and 550, because the mid master's construction rounded a
handle one unit off the upright at the counter's left extreme. The handle rounding (`amp._round_handles`) now keeps an
extreme's handles on its axis; the Regular is unchanged by it and the fix lands in the next build (the item 10 build).
audit_axis Light, curvecheck (three masters; the hooks' lists unchanged), even, evaluate (& and ÷ clean), pathlint
(0 / 0 / 0), audit_charset (0 errors; the & ink rule holds), interpolation: pass. `audit_axis.py` takes
AREA_AXIS_ROWS to print more than six rows a check.

### Owner round 8, item 10 (16 November 2026): the other symbols

Measured first on `build/snap082s5b` (audit_rays on the variable font, the masters read upright where a stroke is
level; `build/owner8/amp/rays-before.txt`, `ring.py`). The rules are `symbols.py`, run in `bold.bold_font` after the
ampersand; the Regular is unchanged. Build: `build/snap082d` (then `snap082e`, which differs only in the & mid master,
below), kerning refit in the same round (`AREA_KERN_FIT=1`: fit_kerning.json unchanged; only collision keys with Ə,
Light 12 and Bold 12, moved).

| # | Glyph | Cause (measured) | Rule | Before > after (300 / 400 / 700) |
|---|---|---|---|---|
| 92 | Ə | Its bar (a capital's level middle stroke, 67 in the Regular) was read as white between two counters: 79 / 67 / 48, thinner at every step to the Bold (audit_rays 67 > 62 > 56 > 48 near (410, 224)) and thicker towards the Light | `symbols.schwa_bar`: the Regular's bar times E's middle-arm law in the master (0.879, 1.192), about the bar's middle as the engine left it; the bar's top line and the counter's top move level, the left end's corner and the curve into the bowl fading over 30 and 40 units | bar 79 / 67 / 48 > 59 / 67 / 80; audit_rays ok |
| 93 | ɂ | The hook's lower stroke into the stem (99 in the Regular, as ?'s) thinned towards the Bold and thickened towards the Light: 110 / 99 / 80 upright right of the stem (audit_rays 97.2 > 74.3 at (224, 254)), while the upper stroke grew 71 / 83 / 126 | `symbols.glottal_small`: the lower stroke the Regular's times ?'s law for the same stroke (? is the same drawing at another size: 0.962, 1.038); the counter's floor moves level, each handle with its node. The ceiling is left: moving it to ?'s law for the upper stroke (89) bent the neck from the ball into an S at the Bold | lower stroke 110 / 99 / 80 > 95 / 99 / 103; audit_rays ok; curvecheck on the whole glyph as many faults as the engine's (4 Light, 7 Bold) |
| 94 | œ | Towards the Light the engine read the joins of o and e as strokes of their own and filled the upper one (audit_rays 58.2 at 350 and 62.8 > 70.2 at 300 against 65.7 at 400, near (542, 452) to (555, 464)) | `symbols.oe_joined`: towards the Light œ is the master's o and e joined as the Regular joins them (`charset.diphthongs`), used only where the union keeps the Regular's structure (it does in the Light; in the Bold the e's 119-unit left stroke meets the o's counter in three more nodes, so the Bold keeps the engine's) | audit_rays ok; Light advance 935 > 940 (o's and e's own) |
| 95 | ɽ | Its tail's drawing jumps in curvature across nodes (Regular 1.81 and 2.14), which the Bold made 2.31 and 2.66 (13 faults on the whole glyph; the qa hook list's node 28 off one line 2.6 degrees) | `symbols.even_curves` (`loops.even_nodes`: handle lengths only) towards the Bold and in the mid master. Not in the Light: evened there the tail read 34.4 at 300 where the Regular has 52.4 (audit_rays) | Bold worst 2.31 > 1.75, faults 13 > 4 (mid 2.08 > 1.59, 10 > 4); hook list Bold 15 > 14. The Regular's own 2.14 at (297, -186) and the flat place in its flag's curve (28-31) stay: the Regular's hook drawings wait on the owner (hand-over, open item 5) |

Not changed, with numbers (each is a different or larger job than one stroke's law):

- @ (first in the brief's order). Its ring is a c-like stroke, thick on the left: across it every 30 degrees from the
  right, 39 40 47 49 57 68 74 69 58 51 42 45 at 400; it grows 1.38 on the right and 1.77 on the left at 700 (54 to
  131), 0.82 and 0.72 at 300, so the left grows and shrinks most, as a thick stroke should; the profile is smooth. The
  faults are in the a: audit_axis Bold 41 > 35 and 34 at 675 and 700 (thin), audit_rays at 300 47.4 where 400 has
  71.1 at (641, 143) (the a's stem turning into its foot: 0.667 of the Regular against the stem's 0.705) and thicker at
  300 at (510, 170) (47.5 against 41.0). The a is one contour with the ring, so the ®-style fit cannot place it; the
  rule it needs is the ampersand's: the ring as one stroke at o's laws and the a as Area's a.ss03 drawn into it,
  joined where the a's stem meets the ring. Not done this round.
- $: thicker at 300 at (207, 4), 59.7 against 55.3 at 400 (the stroke's lower stub where it leaves the S's bottom
  curve; 8%). Its own ball-ended drawing (owner, 0.80); left.
- ð: thicker at 300 at (279, 697), 53.1 against 50.4 at 400 (the bar across the ascender, 5%); left.
- ¢: follows c (item 2) by construction (c plus a stroke in every master). Stroke 34 / 43 / 49 / 57 at 300 / 400 / 550 /
  700 (o's hairline 37 / 43 / 53 at 300 / 400 / 700); it stands 116 above the c and 107 below at every weight. No
  axis fault; the 9-unit difference is the Regular's drawing.
- ®: the ring is ©'s point for point: 40 at the sides and 52 at top and bottom at 400 (53 / 66 at 700), a horizontal
  stress against the letters' upright one (o: sides 82, top 43). Changing it changes ©, which is outside this brief.
- The hook mark (U+0309): curvecheck on the whole glyph, Regular 1.53 at node 9, Light 2.01, Bold 1.95 and two flat
  places. In the variable font's masters it is two overlapping parts (`overlap.curl_master`), and every Vietnamese
  composite carries it; evening its handles is one call (`loops.even_nodes`: Regular 1.53 > 1.18, Bold 1.95 > 1.17 in a
  trial) but was not built, because it moves some 100 composites and the curl parts were not checked against it.

Every glyph that moved (`amp/diff-d.txt`, against `snap082b`): Light Ə ɂ œ; Bold Ə ɂ ɽ; the Bold's mid layer ɽ and
the & (item 9's rounding fix); the Regular and its TTF byte-identical; the variable font at 300 to 700 Ə ɂ œ ɽ (and the
& at 550). Checks: audit_rays on & ÷ Ə ɂ œ ɽ ok (still failing: @ $ ð, as above); interpolation pass; curvecheck pass
(three masters), hook lists Light 6 (unchanged), Bold 15 > 14; audit_charset 0 errors; even 0; pathlint 0 errors (the
4 warnings on ɂ and ɽ are the Regular's, unchanged). audit_axis: the Bold's thin list unchanged; turns flagged the &'s
mid master once more (curve 21, the loop's inside off the diagonal, an inflection at 544 and 550: the rounding put the
short handle's curve through a turn). `amp._round_handles` now refuses a rounding that makes a control polygon turn
both ways; checked on every instance from 300 to 700 every 5% before building `snap082e`.
Figures: `build/owner8/item10-schwa-glottal.png`, `item10-oe.png`, `item10-rtail.png`.

`build/snap082e` against `snap082d`: only the &'s mid master (and so the variable font at 550) moved. audit_axis turns
ok in both masters (the & no longer listed), thin unchanged; audit_rays & ok; interpolation pass; `audit_kern.py`
passes (least 8.3 / 8.4 / 7.9 at 400 / 550 / 700, 0 fail). Pages not rebuilt.

### Owner round 8, items 12 to 14 (16 November 2026): glyphs that did not gain weight evenly on both sides

The owner, on the overlays: some glyphs lean "to the left or right, or [are] not evenly getting wider" (S and 3 among
the examples). Measured first with `build/weightscale/balance.py` (part B; `build/owner8/rebalance.py`,
`compare.py` against the seven references' range, `ends.py`, `refends.py` for the references' four ends about their
centre at Area's stem step). The build before is `build/snap082e`; each item was built, diffed (all three masters, the
Bold's mid layer, the Regular TTF, the variable font at 300 / 400 / 550 / 700), audited and looked at before the next.
Figures: `build/owner8/item12-*.png`, `item13-*.png`, `item14-*.png` (the Regular grey under 300 / 550 / 700 in red,
before | after, 640 px a glyph); numbers in `build/owner8/item12/`, `item13/`, `item14/`.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 96 | 12. The flat bars of 2, 5, 7 did not change weight (73 at 300, 400 and 700; the references' 7: Serrif 68 / 82 / 138, Georgia Pro 63 / 82 / 145) | `bold.bold` read each bar (two level edges, 326 to 354 long) as a stroke and then dropped it with every level reading of 64 or more that is not a pair of facing extremes ("a thick level thing that is not a stroke", meant for balls and blobs); `y_target` would have returned None for it too. Left to the slack, the bar kept 73. Then 2 grew only on top (TB +0.39 / +0.36 at 300 / 700, references -0.11..+0.04), 5 only at the bottom (TB -0.43 / -0.51), 7's bar was frozen (LR +0.26 / +0.30, TB +0.09 / +0.06, references TB +0.16..+0.87) | A figure's flat stroke (straight, both edges level, longer than twice its thickness) is a stroke: it keeps its Regular share of the capital stem (0.85, `balance.fig_flats`) in every master, `bold.fig_flat` = t x `cap_stem` / 86, where `cap_stem` is the straight thick law (86 > 148 towards the Bold, 86 x 55 / 78 towards the Light): bar / stem growth 0.96 at 700 (references Serrif 0.92, Georgia Pro 1.00, Source Serif 4 0.80) and 1.00 at 300 (1.05, 1.22, 0.99). Two consequences found by the audits and ruled: (a) 2's diagonal left the base at a corner the engine lifted with the base's edge but kept at its x, so its foot thinned at the Bold (audit_axis 51 > 34 at 700): `bold.fig_joins` slides that corner (and the bar's corner 2 units under it) along the Regular's tangent by the bar's change, its handle on that tangent at its own height (Bold +73, Light -30); the small figures, which take their figure's moves (`kin_parts`), take the slid figure. (b) The Light 7's bar end (a 9-unit cut once the bar thinned) was lengthened by `keep_taper`'s cut-end rule upward through the cap height (the 7 stood 716): a cut end's corner on a zone line now holds its height (`white.ZONE_Y`); the same guard puts the Light Z's two corners back on 712 and 0 (they stood at 713 and -1 since the cut rule) | bars 73 / 73 / 73 / 73 > 51 / 73 / 96 / 126 at 300 / 400 / 550 / 700 (2, 5, 7, 7.ss06, the .tf forms); superiors and inferiors 39-40 > 27 / 40 / 51 / 68. 2: TB +0.39 / +0.36 > -0.07 / -0.05 (in), DIAG +0.27 / +0.21 > +0.12 / -0.03. 5: TB -0.43 / -0.51 > -0.07 / -0.14 (in). 7: LR +0.26 / +0.30 > +0.09 / +0.06, TB +0.09 / +0.06 > +0.58 / +0.65, DIAG +0.34 / +0.26 > +0.09 / -0.03 (all in). Heights and alignment unchanged (2 0..721, 5 -9..712, 7 0..712 at every weight) |

Item 12, what moved (against `snap082e`): in both masters two, five, seven, seven.ss06 and the small 2, 5, 7 (superior and
inferior); in the Light also Z and Zstroke (the zone guard, above); the Regular and its TTF byte-identical, the Bold's mid
layer unchanged. In the variable font the .tf forms and the fractions with a 2, 5 or 7 follow (onehalf, ⅔, ⅖, ⅗, ⅘, ⅕,
⅚, ⅛, ⅝, ⅞, ⅐); Ƶ follows Z at 300. Advances: Light seven 573 > 571 (seven.tf 625 > 623), nothing else. 4 was
not changed (see below).

Item 12, checks against `snap082e` (`build/owner8/item12/after4/`): audit_axis (Bold and Light), audit_bold (both),
parts, even, evaluate, curvecheck (three masters; hook lists 6 / 14) unchanged; audit_rays the same 4 glyphs (ð ʕ @ $;
27,288 > 27,151 places: the bars' upright rays now meet a level edge that moves); interpolation passes; audit_lean 48 >
45 flags (5's and 7's lean flags and 2's centre flag at 700 cured; one new: 2 leans -0.029 at 700 against the
references' -0.006..+0.006). Two faults the first builds of this item had, both found by the audits and cured: 2's foot
thinning (audit_axis, 51 > 34 at 700, and the small 2s 32 > 24) and the Light 7 standing 716. ⅔ read thicker at 350
than 400 at (136, 491) in one build: the fraction's slash over the small 2's base end (two overlapping components), a
place that is no stroke; it went with the join rule. Looked at (`item12-figures.png`, `item12-derived.png`): the bars
now thicken and thin with the figure; 2's diagonal leaves the thicker base cleanly; 5's upright and 7's beak hang
from the bar's underside, so the 7's beak drops by the bar's gain (it grows with the bar, as the references' do). Left,
with numbers: 2's LR at 700 +0.33 (references +0.13..+0.29) and DIAG -0.03 (+0.01..+0.19); 5's ends (bar against bowl,
dRd -0.50, dLd +0.52 at 700: the bowl and ball grow out under a bar whose ends stay, the Z's case; not this item's
bar weight); 7's dRd -0.27 at 700 (-0.18 before; references -0.14..+0.06: the bar's thickening lowers the diagonal's
outer corner, which runs the diagonal's edge 5 units further right at the band); 4's top-left reach unchanged (dLd
-0.70 at 300 and -0.45 at 700, references -0.30..+0.21 and -0.27..+0.16: the diagonal's outer edge at 60% height moves
out as the diagonal thickens while the bar's left end stays; a bar-end rule as Z's would close it, not written); the
small figures' bars go 0.68 / 1.70 (their stems 0.78 / 1.63 by the small-figure rule).

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 97 | 13. S, s and 3: "S's bottom right end reaches out", "3's bottom-left terminal reaches out" | Measured as the four ends' outward growth about their centre (`ends.py`; the seven references within 1 to 13 of each other at Area's stem step, `refends.py`). S at 700: top-left +42, top-right (the top barb) +20, bottom-left (the bottom barb) +23, bottom-right +45: the bowls' outer sides grew twice what the terminals did (the round strokes' outward share; `s_terminal` had already moved the top barb +20 and only restored the bowls' width ratio). 3 at 700: top ball +12, bottom ball +39: the engine reads the two balls on interleaved knots (top 78..166, bottom 52..140, both centres on 122) and the top ball rode the counter's knot inward; at 300 the top ball moved outward (+8 while the rest shrank). s was already within 4 | `bold.round_ends`, in every master after the S bowls and the figures' joins: on each side the top end and the bottom end keep the Regular's difference, each moving half the gap (as `c_terminals` holds C's two terminals). Each band's nodes move level: within 0.3 of the band's width from an end, with that end whole (the barb, the ball, the bowl's outer stroke keep their shape and thickness); between, by their share of the run (the counter takes it up); handles with their node; the nodes between the bands (the spine, the 3's middle bar) stay. Composites on S, s, 3 take the letter's new advance; the small 3s take the 3's moves | four ends about their centre at 300 / 700, spread: S 8 / 25 > 1 / 1, s 2 / 4 > 0 / 0, 3 11 / 27 > 1 / 1 (700: S +33 +33 +32 +32, 3 +26 +25 +25 +25). balance.py at 700: S dRd -0.40 > +0.02, dLd -0.31 > -0.02, DIAG -0.36 > -0.29 (references -0.30..-0.14); 3 dLd +0.44 > -0.02, dRd -0.19 > 0.00; at 300 S dRd -0.35 > 0.00, 3 dLd +0.48 > +0.04. Advances: Bold S 646 > 638, s 519 > 517, 3 669 > 649; Light S 562 > 563, s 456 > 457, 3 577 > 585 |

Item 13, what moved (against item 12's build, `build/owner8/item13/diff-final.txt`): in both masters S, s, 3, the small
3s (³ ₃, advances Light 312 > 316, Bold 350 > 340) and the fractions holding them (⅓ ⅔ ¾ ⅜ ⅗), and the composites on S
and s (Ś Ṥ Š Ṧ Ş Ŝ Ș Ṡ Ṣ Ṩ and their lowercase), which now take the letter's new advance; the Regular, its TTF and the
Bold's mid layer unchanged. The accents keep their placed offsets: over S they now stand up to 4 units right of the
ink centre at 700 (S's ink centre moved 4; the same as Ž over Z since item 4). $ and § are their own drawings (the
dollar is the owner's ball-ended one) and were not changed: four ends' spread at 700 $ 6, § 10 (the § grows its middle
left at 700). 8 shares no rule with S (it is closed); its ends are even (spread 1 at 300 and 700) and its DIAG at 300
(+0.19, references -0.21..+0.01) and TB (-0.17, -0.09..-0.03) were measured and left: at 300 the 8's lower bowl gives
up more ink on its left than the upper does (the overlays show no lean; the reading is the junction where the two
bowls cross, as part B's own note on 8 says). Checks against item 12 (`item13/after/`): audit_axis (both), audit_bold
(both), parts, even, evaluate, curvecheck (three masters; hooks 6 / 14) unchanged; audit_rays the same 4 glyphs;
audit_lean 45 > 44 flags (S's lean at 700, -0.042 against -0.027..+0.002, cured; nothing new). The spine: at the S's
middle height its centre stands where the Regular's does (17 > 18 units right of the ink centre at 700; it was 6.5,
off by 10.5), but it stands more upright at 700 than in the Regular (centre travel 104 against 138 per tenth of the
height, 112 before this rule: the bowls now move level with the ends and the spine between keeps the engine's
points). balance.py at 700, left outside: S LR +0.02 (references -0.05..+0.01) and TB +0.03 (-0.08..-0.01: the
references grow more at the bottom); s DIAG -0.29 (-0.25..-0.05) and at 300 TB +0.07, DIAG -0.36; 3 TB -0.03
(-0.19..-0.07). Looked at (`item13-S-s-3.png`, `item13-derived.png`): the S's top barb now reaches out with its lower
bowl and the bottom barb with its upper bowl; the 3's top ball no longer runs in at 700 nor out at 300; the letters
stand as the Regular does. Figure for 8, $ and §: `item13-eight-dollar-section.png`.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 98 | 14. g (the default, double-storey): the upper bowl grows to the left against the lower loop (balance.py dLd -62 units at 700, references -8..+1; +22 at 300; LR -0.37 at 700, references -0.06..+0.01) | Read on the masters (`build/owner8/gprobe.py`, `item14/gmeasure.py`): the bowl stays where it should; the loop moves. The loop's centre stands 15.5 right of the bowl's in the Regular, 79 at the Bold, -4.5 at the Light. The engine reads the g on shared knots: the loop counter's right edge (441) sits two units from the bowl's outer right (439), the loop's outer right (511) on the ear ball's centre (511), and the ear's neck node on 441; so the loop's right side, growing as a loop side (+67 a side), carries the ear's ball right with it (ear reach 118 > 201 at 700, 1.70, where the ball law is 1.40) and the loop with it, while the link's turn into the loop (a 56-unit curved stroke read as a loop side, +67: 56 > 123, the hand-over's "2.20") pushes the bowl's left out | After the engine, in each master (`bold.g_loop_place`, `g_ear`; the 550 master follows, being built from the Bold): the loop (its counter and the outer outline under the counter's top) moves level so its centre keeps the Regular's offset from the bowl's; the link between by its share of the run from the bowl counter's left to the loop counter's right; the notch where the link's turn meets the loop keeps the Regular's depth from the turn (without it the moved loop made a spur there); handles by their share of their curve. Then the ear's ball (nodes more than a third of the ear's reach past the bowl) moves level until the ear reaches past the bowl by the Regular's reach times the ball law; the neck takes up the change (moving the neck's node too folded it into the bowl: audit_axis turns and thin). Composites take the new advance and keep their mark over the moved ink; ǥ's stroke follows the loop. Tried and refused: the turn's own law (the ladder interpolated at 56, 56 > 81 at the Bold): it took the push off the bowl but the turn's top then thinned between the masters (audit_axis 38 > 30 at 550 to 650, the hole's left edge and the crotch moving apart at different rates); the turn keeps the engine's growth | loop centre less bowl centre, Light / Regular / Bold: -4.5 / 15.5 / 79.0 > 17.0 / 15.5 / 15.0. balance.py: dLd -0.96 / -1.00 > -0.00 / +0.03 at 300 / 700 (references -0.21..+0.07, -0.12..+0.02), LR at 700 -0.37 > -0.21, at 300 -0.13 > -0.05, DIAG at 700 -0.13 > +0.08 (in). Ear reach 118: Light 90 > 100 (0.85, the ball law 0.85), Bold 201 > 165 (1.40). Link 81: 73 / 128 > 72 / 134 (the curved level law, 1.57; unchanged in kind). Advances: Light 552 > 563, Bold 700 > 664 (n's growth would give 648), mid 637 > 622 |

Item 14, what moved (against item 13's build, `build/owner8/item14/diff.txt`): in both masters and the Bold's mid layer g and
ǥ; the composites on g (ĝ ğ ġ ģ ǧ ǵ ḡ), new advance and marks moved with the ink (Bold only: in the Light the ink centre
moved under a unit); and, by the same mark rule, the marks over S and s at the Bold (Ś Ṥ Š Ṧ Ş Ŝ Ș Ṡ Ṣ Ṩ and lowercase), 2
to 4 units back over the ink item 13 moved. g.ss02 and ɡ are byte-identical. The Regular, its TTF unchanged. Checks against
item 13 (`item14/after3/`): audit_axis (both), audit_bold (both), parts, even, evaluate, curvecheck (three masters: g's
worst node 1.13 / 1.23 / 1.21 Regular / Light / Bold, no fault; hooks 6 / 14) unchanged; audit_rays the same 4 glyphs;
audit_lean 44 > 43 (g's lean at 700, -0.040 against -0.008..+0.002, cured; g's sides and stress readings still outside,
as before, now on the ear side). Left, with numbers: the ear. balance.py's top-right end is the ear's ball, so dRd reads
+0.91 / +0.74 at 300 / 700 (references -0.22..+0.81, -0.20..+0.24) and the four ends' spread is 21 / 46 (TL +41.5, TR
+65.5, BL +43.5, BR +19.5 at 700): the ear reaches out at the ball law while the loop's right side grows 20; the
references' ears are not balls of Area's size. LR at 700 -0.21 is still outside (-0.06..+0.01): the bowl's left side and
the link's turn still grow 2.0 times where the stem grows 1.8. TB at 300 +0.15 and at 700 -0.09 just outside. Looked at
(`item14-g.png`): the loop now stands under the bowl at 300, 550 and 700 as in the Regular; the ear is shorter at 700 and
its neck tighter; the link's turn at the left still grows heavier than the rest.

Kerning, once at the end of items 12 to 14 (`AREA_KERN_FIT=1 build.py`; the advances of 7, S, s, 3, g and their families
changed): the fit pairs are unchanged; the per-master table changed only in pairs with an S, s, g (or their classes) on
one side (Light 220 > 217 fitted, 15 changed; Bold 521 > 512, 57 changed; nothing outside those families). The masters'
fonts are otherwise byte-identical to item 14's build. `audit_kern.py` passes at 300, 350, 400, 550, 700 and at every 25
units from 300 to 700 (`build/owner8/kern-082f*.txt`; least 7.9 at 700, idieresis Itilde, as before). The final build is
saved as `build/snap082f`; `build/owner8/compare-082f.txt` holds part B's readings for 2 5 7 3 S s g on it against the
seven references. Pages not rebuilt.

## Owner round 8, axis (17 November 2026)

The owner: the family should read less bold and step more finely. The weight axis becomes 100 to 800; the new 800
(ExtraBold) is exactly the 0.81 axis's 700 (stem 140, the Bold master unchanged); the Regular at 400 and the Light at
300 (stem 55) do not change; the light end runs to 100 (Thin). Two stages, each built, checked and committed before
the next. Build before: `build/snap082f`.

The scale (`weightaxis.py`, one place for every conversion; the design axis is the lowercase stem, as before):

| weight | name | stem | / 400 | on the 0.81 axis |
|---:|---|---:|---:|---:|
| 100 | Thin | 32.0 | 0.410 | (none) |
| 200 | ExtraLight | 41.95 | 0.538 | (none) |
| 300 | Light | 55.0 | 0.705 | 300 |
| 400 | Regular | 78.0 | 1.000 | 400 |
| 500 | Medium | 90.28 | 1.157 | 475 |
| 600 | SemiBold | 104.50 | 1.340 | 550 |
| 700 | Bold | 120.95 | 1.551 | 625 |
| 800 | ExtraBold | 140.0 | 1.795 | 700 |

Above 400 geometric to 140 at 800 (1.157 a step); 300 to 400 geometric to the Light (as before); under 300 geometric
to the Thin: 200 = sqrt(32 x 55) = 41.95, so 100 > 200 > 300 is one ratio (1.311 a step) and 300 > 400 is 1.418, as
even as 32 / 55 / 78 allow. The brief's "474 / 552 / 625" for the new 500 / 600 / 700 on the old axis are, exactly,
475 / 550 / 625 (0.81's axis was geometric too: 400 + (w - 400) x 3/4); 552 would be stem 104.9, not 104.5.

### Stage A: 300 to 800, no new master

Only the axis changed: `bold.WEIGHTS` 400 to 800 every 50, `bold.axis_map` on `weightaxis.stem` (exponent (w - 400)
/ 400 where it was / 300: the same stems), `bold.MID_WEIGHT` 550 > 600 (the same design place, stem 104.50, so every
glyph's sparse master is where it was), `bold.variable` (axis 300 to 800, the Bold master a source at 140 named
ExtraBold, one instance per named weight at its stem on the designspace map), `build.py`'s STAT (one axis value per
named weight, Regular elidable and linked to Bold 700), `spacing.BETWEEN` (the Bold's between-masters pass at 600,
the mid master, where it was at 550). The kerning fit's reference weights (Georgia Pro Light / Bold, Serrif 300 / 700)
are the references' and did not change.

The designspace map is the formula sampled every 50 (300 ... 800); the font interpolates linearly between samples, so
the avar (normalized user > design) is: -1 > -1, -0.5 > -0.5436, 0 > 0, 0.125 > 0.0955, 0.25 > 0.1981, 0.375 >
0.3085, 0.5 > 0.4274, 0.625 > 0.5552, 0.75 > 0.6928, 0.875 > 0.8408, 1 > 1 (the 0.81 font's: -1, -0.5 > -0.5436, 0,
0.1667 > 0.1288, 0.3333 > 0.2708, 0.5 > 0.4274, 0.6667 > 0.6, 0.8333 > 0.7903, 1). fvar: wght 300 / 400 / 800; named
instances Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800 (in order). STAT format 1 values
at 300, 500, 600, 700, 800 and Regular 400 format 3 (elidable, linked to 700); elided fallback "Regular".
OS/2.usWeightClass 400 on the variable font; the name table unchanged (family "Area Serif", subfamily "Regular").

Proofs (`build/axis082/`):

- Masters (`diff-082f-082g.txt`): Light, Regular (with its overlap layer), Bold (with its mid layer): 0 glyphs differ;
  kerning 0 keys differ; groups, features, fontinfo and lib byte-identical; the Regular TTF 0 glyphs differ. The
  notes files differ only where they name the mid master's weight (550 > 600).
- Instances (`proofA.txt`, TrueType points and advances of all 1,102 glyphs): the new font at 300 / 400 / 800 is
  identical to the old at 300 / 400 / 700; at 600 identical to the old at 550; at 500 and 700 the new font is on the
  formula's stems (90.28, 120.95) where the old font's chords gave 90.39 and 121.10 at 475 and 625: 251 and 433
  glyphs differ by 1 unit at most. At every 0.81 25-unit stop's design place (`weightaxis.place`: 433.7, 466.3, 500.8,
  532.9, 567.1, 600, 633.7, 666.3, 700.8, 732.9, 767.1, 800) the new font equals the old except at 425, 650 and 675:
  2, 8 and 17 glyphs by 1 unit (the avar's 14-bit rounding of a different set of segment ends).
- Audits, the 0.81 tools on `snap082f` against today's tools on `snap082g` (`old-on-082f/`, `new-on-082g/`): audit_rays
  at the default stops the same 4 glyphs, 27,161 places, the same numbers; at the 25-unit stops the same 2 glyphs
  (27,008 > 27,009 places: one place kept at 650 / 732.9 by the 1-unit rounding); audit_kern pass at both, every stop's
  nn white, floor and least pair the same (under-the-floor counts at 650 and 675: 1,671 > 1,654, 2,094 > 2,091, none
  failing); audit_axis the same lists (Bold thin: @, cedi, ogonek, ogonekcomb, one.ss01; Light ok; the two held for
  the owner), only the weights renamed (0.81's 650 is 733.3); audit_bold --sweep identical line for line apart from
  the weight labels; audit_lean --refs, today's tool on both fonts, 43 flags each, identical (the 0.81 tool run from
  another directory could not find Source Serif 4, so that baseline is not used). fontbakery check-universal on the
  variable font: 0 FAIL, 0 ERROR (1 WARN, overlapping path segments, as before). The googlefonts checks asked for:
  varfont/bold_wght_coord, opentype/fvar/regular_coords_correct, mandatory_avar_table, varfont/instances_in_order,
  STAT_strings, opentype/varfont/STAT_axis_record_for_each_axis, the valid name-id checks: PASS; googlefonts/fvar_instances,
  googlefonts/weightclass and the two axis-registry checks ERROR in fontbakery itself (the `axisregistry` package is
  not installed; nothing was installed) on both builds.

The tools (each prints which axis its weights are on; `weightaxis.AXIS_NOTE`):

| Tool | 0.81 stops | now (0.82 axis) |
|---|---|---|
| audit_rays (`AREA_RAY_WEIGHTS`) | 300 350 400 500 600 700 | 300 350 400 532.9 666.3 800 (`place`); lightest-stop floor at the lowest stop's stem ratio |
| audit_kern (`AREA_KERN_WEIGHTS`) | 300 350 400 550 700 | 300 350 400 600 800 |
| audit_lean | 300 to 700 every 50 | 300 350 400 466.3 532.9 600 666.3 732.9 800; with --refs Area 300 / 800 against the references' 300 / 700 |
| audit_axis | 400 to 700 every 25; 375 to 300 | 400 to 800 every 33.3 (`from_old`); 375 to 300 |
| audit_bold --sweep | 375 to 325; 400 to 700 every 25 | the same stems, labelled on the 0.82 axis |
| spacing.BETWEEN | Light 350, Bold 550 | Light 350, Bold 600 |
| qa.py | names 300 to 700 | names 300 to 800 |

A list given as `old:300,325,...` is on the 0.81 axis and converted; a font on the 0.81 axis is read at the same design
places (`weightaxis.user`), so today's tools audit the old snapshots. `curvecheck`, the bearing lookups and the
per-master kerning read masters, not weights: nothing to convert. The 0.81 25-unit stops on the 0.82 axis are
`old:300,325,...,700`. Saved as `build/snap082g`; `build/qa-082g.log`.

### Stage B: a master under the Light. Not landed; the font stays 300 to 800

Two trial builds, both from the Stage A code plus the rules below, built in a copy of the code (the worktree's
`build/` kept Stage A): a Thin at 100 (stem 32), then the brief's fallback, an ExtraLight at 200 (stem 42). Neither is
sound, so neither ships: `weightaxis.THIN` is off, the axis is 300 to 800 and every rule below acts only under the
Light's stem (55), where no master stands. A rebuild with them in is identical to `snap082g` (below). Results and
figures: `build/axis082/trial100/`, `trial200/`.

The rules written (kept, gated):

- **The letters' thin strokes under the Light** (`bold.thin_law`, `K_THIN` 0.95). Run on to stem 32 the present law
  (a thin part's Bold gain run backwards, ft = 1.72 f) gives the hairline 30.2: stem / hairline 1.06. Under 55 a
  hairline, every curved thin, H's and E's bars and arms, e's bar, the upright and slanted thins and the arm-crotch
  and neck floors that read the hairline are the Light's value times (stem / 55) ** 0.95: continuous with the Light at
  55 (which does not move) and monotone to the Thin. 0.95 from the contrast wanted, 1.46 (half way between the
  references' lightest median 1.42 and Serrif 100's 1.50). Ends keep the present law, which already lands on the
  references' own exponent below 300 (`build/weightscale/thinparts.py`, k = ln(part ratio) / ln(stem ratio), their
  300 to lightest): serif tip (Area 0.67; references median 0.57, 0.33 to 0.92), branch neck (0.33; 0.33), dot (0.49;
  0.49), period (0.44; 0.60, 0.47 to 0.72), sign strokes (0.68; 0.77, 0.39 to 1.07). The references' hairline exponent
  is lower (median 0.54) because their 300 has contrast to give (Serrif 2.27, Source Serif 4 1.69, Newsreader 1.95)
  where Area's Light has 1.50; at 0.54 Area's Thin would be 1.17, the collapse the owner asked to avoid.
- **Sides under the Light** (`bold.bearing_change`, `thin_bearings.json` from `tools/weight/bold_bearings.py thin`):
  the Light's change plus the references' own from their 300 to their lightest (Serrif 100; Source Serif 4, Literata,
  Newsreader, Crimson Pro 200), each times Area's stem loss 55 > 32 over its own, median per side: lowercase +2.6 a side
  (median; -1.6 to +7.6), capitals +2.1, figures +4.2, punctuation +2.4; in proportion to the stem's way from 55 to 32.
- **A slanted stroke's end under the Light** keeps its share of the stroke across (`bold`, "slanted end"): its level
  gain, an amount, took more than the end's width at the Thin (ð's bar ends 27 > -16), so the solve turned the end
  over and ↕ ð ⌫ ⌦ × fell back to "upright parts only" (↕'s heads and ð's bar kept the Regular's weight). With it no
  glyph falls back at 32 or 42.
- Kerning for the lighter master by the existing rule (the Regular's carried by the white rule, collisions at its own
  floor; no same-weight fit: Georgia Pro has nothing under 300 and Serrif alone is not "both references"); the
  between-masters pass between the Light and it (`spacing.BETWEEN_BASE`). `audit_axis` reads the Light-to-lightest pair,
  `qa.py` the master's audit, curvecheck and sides, all keyed on `weightaxis.LOW_NAME`.

What the Thin (100, stem 32) measured (variable font at 100, `thinparts.py`; references at their lightest):

| part / stem | Area 100 | references' lightest |
|---|---:|---|
| stem / o's thinnest (contrast) | 1.47 (hairline 21.8) | 1.22 to 1.95, median 1.42; Serrif 100 1.50 |
| serif tip | 16.4 (0.51) | 0.42 to 0.76 |
| e's bar | 21.0 (0.66) | 0.61 to 0.80 |
| H's bar | 23.0 (0.72) | 0.66 to 0.85 |
| v's thin diagonal | 19.3 (0.60) | 0.53 to 0.83 |
| i's dot | 72 (2.25) | 1.73 to 2.31 |
| period | 80 (2.50) | 1.88 to 2.43 |
| hyphen | 26 (0.81) | 0.84 to 1.04 |

The laws hold; the glyphs do not. At 100 (`trial100/`): audit_rays on 100 to 400 every 50 fails 49 glyphs (33,573
places); 75 glyphs have a place under 16 units. The thinnest places at 100 (glyph, position, the same place at 300 /
400): § 1.1 at (92, -68) (22.9 / 44.4); s_p 1.3, 2.6, 3.2, 3.7, 4.9 round (123 to 184, 438 to 467) (19.5 to 27.4 /
22.9 to 30.9); ɠ 6.1 at (502, 30) and 8.8 at (487, 22) (30.5, 32.9 / 42.4, 43.4); then the small figure 1's hairline,
8.9, in ¹ ₁ ⁴ and every fraction that holds them (½ ¼ ⅓ ⅕ ⅙ ⅐ ⅛ ⅑ ⅘, at (175 to 285, 390) and (174, 9); 12.9 / 16.9).
Seen (`trial100/img/set-100.png`, `faults.png`): the small 2 (², and the 2 in every fraction) throws its base out into
a long wedge (`fig_flat` / `fig_joins` on a small figure under the Light); 8, $, Q's tail and y's crotch grow heavier
than at 300 (audit_rays: Q 52.0 > 90.8 from 400 to 100 at (474, -13), y 50.4 > 71.6 at (204, 132), œ's join 45.8 >
80.4 at (555, 464), ⱳ 60.8 > 92.9, $ thicker at every step down); ƴ's tail collapses (1.5 at 200); 7 stands 734 high
(audit_bold 32: height 0..712 > 0..734) and g's neck misses (37.1 > 20.1, target 26.7); curvecheck on the Thin master
4 faults (yhook 1.75 and 1.42), hooks 13. Kerning passes at 100 to 250 (least 10.3, itilde Uacute, floor 14.2).

The ExtraLight (200, stem 42; `trial200/`) is better but not sound either: the small 2 holds; 0 fallbacks; audit_rays
on 200 to 400 every 25 fails 33 glyphs: ƴ's tail 9.4 at (245, -96) where 400 has 62.7, thicker at 225 than 250 (1.2 <
15.0); § 10.6 at (94, -69) (45.4 at 400); r's ball neck 13.4 at (269, 461) (31.8); ⁹ 17.0, ƒ 15.0; 8's right side
24.4 at (449, 683) (55.6: the 8 tips heavy on its other side, seen); Q's tail, $ and @ thicker at every step down;
45 glyphs have a place under 16 (the small figures' hairline 10.9 from 16.9 at 400, ª º 9.4 to 10.6). audit_bold 42:
g's neck 37.1 > 26.1 (target 28.9), w's upright stroke at 704..744 40 > 26 (24.6), 7 0..721. curvecheck 2 faults, hooks
7. Kerning passes (least 10.2, dcaron Ibreve). interpolatable: nothing reported. The masters 300 / 400 / 600 / 800 are
unchanged by it, but a fourth master makes cu2qu pick other quadratic splits on 97 glyphs, so the 300 to 800 instances
move by up to 2.6 units on those (Ohorn, ¡ !, ɠ, ₲, Ǥ), measured by `build/axis082/hausdorff.py`.

What blocks a lighter master, in order: (1) the small figures' flat bars and joins under the Light (² ₂ and the
fractions); (2) the parts that grow towards the light end (Q's tail, $, @, œ's join, y's crotch, ⱳ): read as thick
by the engine and run backwards past the Light, as Q and $ already do mildly from 400 to 300; (3) the hooks and tails
that thin to nothing (ƴ, ɠ, §, s_p, r's ball neck, ƒ): `keep_taper`'s laws stop at the Light's JND moves; (4) the small
figures' and ordinals' hairlines (16.9 in the Regular, 0.52 of it at 100) need their own floor; (5) 8's two sides; 7's
height; g's neck; w's upright. Each is a rule, not a point edit; none was written in this pass.

Checks on the landed state (`build/snap082h`, Stage A plus the gated rules, axis 300 to 800): rebuilt from source, the
three masters (with the Regular's overlap layer and the Bold's mid layer), their kerning and notes, the Regular TTF
and the variable font's glyf, gvar, fvar, avar, STAT, HVAR, GPOS, hmtx, name and OS/2 tables are identical to
`snap082g` (`build/axis082/diff-082g-082h.txt`), so every Stage A audit and qa result above stands for it
(`build/qa-082g.log`). The trial fonts in `trial100/` and `trial200/` are records, not builds to ship. audit_axis on
the trials' new pair wrote nothing (its runs in the copy ended without output); the rays, kerning, audit_bold and
curvecheck readings above are the trials' audits of that range.

## Owner round 8, items 15 to 18 (17 November 2026): the symbols left open

The owner, on the symbols item 10 left open: "uneven thicks and thins, non smooth curves, and visual/optical imbalance".
Taken in the brief's order, each built, diffed (all three masters, the Bold's mid layer, the Regular TTF, the variable
font at 300 / 400 / 600 / 800 on the 0.82 axis: `build/owner8/diffall8.py`), audited (`qa.py --skip-build`, plus
`evaluate.py`) and looked at before the next. The build before is `build/snap082h`. Figures: `build/owner8/item15-*.png`
to `item18-*.png` (before row over after row, 300 / 400 / 600 / 800, 749 px a tile); numbers and scripts in
`build/owner8/item15/` to `item18/`.

### Item 15: @

Measured first (`item15/refat.py`, `refo.py`, `refo2.txt`: Georgia Pro, Source Serif 4, Serrif, Literata, Newsreader,
Merriweather, Crimson Pro at 300 / 400 / 700, numbers only; Area on snap082h, `area-before.txt`). Area's @ was Libre
Baskerville's: its ring thick on the left (74) and thin on the right (39) with top and bottom 49 / 51 at 400, its a an
italic a drawn into the ring as one contour, the ring's top on the cap overshoot (721) and its bottom at -122. Every
reference's ring has the letters' upright stress: top and bottom at their o's top (1.05 / 1.02 at 400, 1.05 / 1.03 at
300, 0.96 / 1.09 at 700), the left side 0.86 of the stem at 400, the right 0.883 of the left (0.866 / 0.874 at 300 /
700); the contrast stays along the axis (left over top 1.74 / 1.85 / 1.74) and the ring grows as their hairline does
(left 0.83 / 1.27 of the 400 at 300 / 700, top 0.88 / 1.25). None is even all round; Area's © ring (52 top, 40 sides)
has the opposite stress (item 16). Their box: top 0.985 of the cap, bottom -0.231, width over height 0.941 / 0.968 /
1.012. The inner letter: height 0.545 / 0.558 / 0.597 of the ring's counter, its centre 0.011 of the ring's height
over the ring's, its stem 0.984 / 0.841 / 0.778 of the stem, its top and bottom 1.18 / 1.21 / 1.26 of the ring's thin,
the white right of its stem 1.24 times the white left of its bowl.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 99 | 15. @ | The a was one contour with the ring, so no rule could place or weight it: towards the Bold its thinnest place thinned (audit_axis 41 > 35 / 34 at 766.7 / 800), towards the Light a place fell to 0.667 of the Regular (47.4 against 71.1 at (641, 143); the stem's law 0.705) and another grew (47.5 > 41.0 > 32.3 from 300 to 400 at (510, 170)); it grew more on the left at 300 (LR -0.38). The ring's weight changed where it turned into the a; the a was italic | `at.py`, one construction in every master. The ring is one stroke out of the a's foot: up the right side, over the top, down the left, along the bottom, out to the tail's cut; each edge one chain of curves (`at.Ring`: the bowl's tensions 0.57 outside / 0.61 inside where nothing else asks, curvature across every smooth node within 1.2, a curve easing off the stem's straight). Thickness (vertical stress, the references' and the letters'): top and bottom the master's hairline (o's top), the left side 0.86 of the Regular's stem and the right 0.883 of the left, carried into each master by the hairline's law (the references' ring keeps its contrast); the tail's cut 0.853 of the hairline (the drawn). The ring's right extremes stand 0.107 of its height over its centre (the drawn @'s), so the stroke out of the foot climbs as one long turn. Box: top 701, bottom -164 (the references' 0.985 / -0.231 of the cap), width 0.941 / 0.968 / 1.012 of the height. The a is Area's a.ss03 (upright, single-storey) in that master, scaled to the references' share of the ring's counter, its strokes then made the references' weight: level by the stem's share, upright by the inner letter's share of the ring's thin (`at.embolden`: each node along its normal, a convex corner on its true mitre so a straight edge moves parallel, a crotch's cusp held to 1.0); white right of its stem 1.24 times the white left of its bowl, its centre 0.011 of the ring's height over the ring's. The a's foot keeps a.ss03's own two curves; the ring is solved on from them, then every smooth node evened to one curvature (`loops.even_nodes`, handles only). In the masters the shares are interpolated on the stem's logarithm between the references' 300 / 400 / 700 (Area's 55 / 78 / 140); the mid master is the construction at the readings that far (0.427). In `normalize` after the ampersand (`at.regular`) and at the end of `bold.bold_font` after the curvature evening (`at.master`), so the a.ss03 it reads is the master's finished one | ring left / right / top / bottom at 300 / 400 / 600 / 800 (rays from its centre): 53.1 / 74.1 / 98.0 / 131.0 > 58 / 67 / 74 / 83 left; 31.8 / 38.7 / 45.2 / 53.6 > 53 / 62 / 66 / 73 right; top 41.9 / 49.2 / 54.7 / 62.8 > 37 / 43 / 47 / 53; bottom 40.5 / 50.8 / 58.2 / 68.2 > 37 / 43 / 47 / 53; top / side 0.99 / 0.87 / 0.76 / 0.68 > 0.66 / 0.67 / 0.67 / 0.68 (references 0.67). The a's stem / bowl on the level over the stem 1.57 / 1.07 / 1.08 / 1.08 > 0.98 / 0.85 / 0.83 / 0.79 (references 0.98 / 0.84 / 0.78). Box 721 / -122 > 701 / -164. audit_axis Bold thin: @ listed (41 > 35, 34) > not listed; audit_rays @: 3 faults > ok at the default stops and at every 25 to 50 units from 300 to 800 (273 places). curvecheck on the whole glyph: Light inf (8 faults) / Regular 1.36 (3) / mid 2.58 (10) / Bold inf (10) > 1.18 / 1.16 / 1.19 / 1.23, no fault. balance.py (`build/owner8/rebalance8.py`, the 0.81 weights at their design places): LR at 300 -0.377 > -0.048, at 800 -0.177 > -0.006; TB -0.049 / -0.129 > +0.010 / +0.018; DIAG +0.107 / +0.121 > +0.028 / +0.009. Advances: Light 943 > 941, Regular 955 > 960, mid 967 > 972, Bold 984 > 988 (+0.5% at most) |

Item 15, what moved (`item15/diff3.txt`, against snap082h; the build saved as `build/snap082j15c`): @ in every master,
the Bold's mid layer, the Regular TTF and the variable font at 300 / 400 / 600 / 800; nothing else. Kerning: only the
collision keys with @ (Light 19, Regular 1 (ldot @ 8 > 7), Bold 17, each a unit). The point structure changed (57 / 12
> 52 / 13 points), the same in every master. Checks (`item15/after3/`, `qa2.log`): audit_axis Bold thin 6 glyphs > 5
(@ gone; cedi, ogonek, ogonekcomb, one.ss01 as before), Light ok, turns and crossings ok; audit_rays 4 glyphs > 3 (@
gone; ð, ʕ, $ as before); audit_charset 0 errors; evaluate: @ no longer listed (the drawn @ had a pinched quarter); even
0; curvecheck (Regular, Light, Bold; hooks 6 / 14 as before) unchanged; pathlint 0 errors, 139 > 138 warnings (@'s);
interpolatable nothing reported; audit_kern pass (no advance moved by more than 5). Before building, two trial faults
were found on the figures and cured in the rule: the made-heavier a's crotch under the bowl ran 40 units down at the
Bold (an uncapped mitre on a cusp; held to 1.0), and its stem leaned 3 units in the Light (a convex corner's mitre
capped too; convex corners now keep their true mitre); the a's foot turned boxy (handles kept their length while the
foot shortened; they now keep their share of the curve).

Looked at (`item15-at.png`, before row over after row; `item15-at-refs.png`, Area before and after beside the seven
references at 400 and at their bold): the a now stands upright, the a.ss03 of the text, joined to the ring at its foot
by one turn that climbs into the ring's right side; the ring is thin at top and bottom and full at both sides, as the
references' and as the letters' o; the sign sits lower (701 / -164 against the cap's 712), as every reference's does,
and keeps Area's tail. Still not right, honestly: at 800 the a is heavy against the ring (a stem 110, ring side 83:
the references' median 1.33 times, Area 1.33, but Area's bold a is a wide bowl, so the a reads darker than Georgia
Pro's); the a's spur on the stem's top (a.ss03's) reads small at 300; evaluate still reads two quarters at its limits
(the a's foot 0.82 / 0.62 of its run after whole-unit rounding, a.ss03's own 0.74 / 0.62, and at the Bold the stroke
out of the foot 0.42 / 0.78, lopsided 1.86) without a curvecheck fault.

Item 15, the owner's note on the published page (17 November): "the a in the @ looks much sharper / not as smooth at
thicker weights": at the heavy end the a's crotches (the spur's into the bowl's top, the bowl's bottom into the foot)
read as a sharp notch and a pinched point. Two changes in `at.py`, built with item 16 (`build/snap082j16b`): each
crotch is rounded by a fillet of 0.30 the a's stem (`at.fillet`: both curves cut back by that length along themselves,
one cubic along their tangents, handles 0.55 of its chord; 0.20 left a notch at 800, 0.45 ran the bottom one into a
wave, curvecheck 2.03); and the made-heavier a moves a run of segments under 20 units (a soft corner, a serif's step,
a crotch's short line) as one corner on that corner's mitre (`at.embolden`, `SHORT`: needed by item 16's letters, it
leaves the @'s a as it was apart from the fillets). Each master gains six points (58 / 13). curvecheck on the @ read
from the masters as the variable font interpolates them (`item15/instcomb.py`, combs in `item15-at-combs.png`): 600 /
700 / 800 worst ratio 1.18 / 1.21 / 1.24, no node fault (one flat place in the ring's lower left at 700, a reading
between masters); Light 1.20, Regular 1.22. Looked at, at 800 large (`item15-at-800-large.png`, before over after):
the top crotch is a rounded dip, the bottom one a rounded cleft; neither is a point. Still not right: the bottom
cleft still reads as a cleft at 800 (the bowl's bottom and the foot are two lobes; a larger fillet waved), and the
counter's right side is the stem's straight edge, as a.ss03's is.

### Item 16: (C) (R) (P)

Measured first (`item16/refring.py`, `refs.txt`; Area `area-before.txt`). Area's ©, and ® and ℗ with it, carried Libre
Baskerville's ring with the horizontal stress: side 32 / 40 / 53 against top 44.5 / 52.5 / 65 at 300 / 400 / 800 (top
over side 1.39 / 1.31 / 1.23); its C was Libre Baskerville's small C, ®'s R a drawn R, ℗'s P Area's P at 0.52 lightened;
in the masters the ring's box grew (the Bold's top 775 against 761). The references (seven faces, medians): top over
side 0.872 / 0.864 / 0.876 (every face 0.79 to 0.95: a mild upright stress, none horizontal); side 0.714 / 0.557 / 0.406
of the stem; the letter's height 0.626 / 0.636 / 0.651 of the counter (R 0.598 / 0.616 / 0.633, P 0.621 / 0.628 /
0.652), its box's centre off the counter's -0.025 / -0.024 / -0.019 of its width for C, +0.027 / +0.023 / +0.023 for R,
+0.024 / +0.026 / +0.029 for P, and up 0.002 to 0.010; its thick 1.43 / 1.47 / 2.23 the ring's side (C), 1.21 / 1.25 /
1.43 (R), 1.22 / 1.29 / 1.60 (P); its thin 1.06 / 1.12 / 1.22 the ring's top.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 100 | 16. © ® ℗ | The ring was drawn with its weight at top and bottom; © held a C that is not this round's C; the masters grew the ring's box and its letter as loose parts | `circled.py`, in `normalize` after the @ and at the end of `bold.bold_font`: one ring for all three, the Regular's © outer outline in every master (its box and the advance do not move), the counter its four extremes moved in by the side and the top, each quarter at the outer quarter's own tension; side the references' share of the stem (interpolated on the stem's logarithm at 55 / 78 / 140), top 0.87 of the side (upright stress, the references' 0.864 to 0.888). The letter is Area's own C, R or P of the master, scaled about its box's centre to the references' share of the counter and placed off the counter's centre by their offsets (© so carries this round's C, both terminals on one vertical); in the Regular its strokes are made the references' weights relative to the ring (`at.embolden`, level for the thick, upright for the thin); in a master the Regular's additions times the stem's law (each master's own additions put the same amount on every stroke, and a thin upright one, C's barb, came out thicker at 300 than at 400: audit_rays 49.2 > 42.0 in the first build). The old "letter in a ring" rule leaves glyphs this rule builds | ring side / top at 300 / 400 / 800: 32 / 44.5, 40 / 52.5, 53 / 65 > 39 / 34, 43 / 38, 58 / 50 (top / side 1.39 / 1.31 / 1.23 > 0.87 / 0.88 / 0.86). ©'s C thick 52.9 / 73.9 / 130.9 > 44.9 / 63.9 / 105.9 (references' share of the ring 56 / 64 / 129; of the stem 0.96 / 0.95 / 0.94 > 0.82 / 0.82 / 0.76, references 1.03 / 1.00 / 0.87); C centre off the counter -0.027 / -0.033 / -0.049 > -0.025 / -0.023 / -0.019 of its width. ®'s R stem 41 / 60 / 89 > 38 / 54 / 91 (0.69 / 0.69 / 0.65 of the stem, references 0.81 / 0.73 / 0.45), centre +0.023 / +0.009. ℗'s P stem 37 / 47 / 62 > 40 / 57 / 94; height 0.533 / 0.557 / 0.594 > 0.622 / 0.627 / 0.653 of the counter. Advances: © ® ℗ 868 in every master (Light ℗ 858, Bold ℗ 876 before) |

Item 16 (and the @'s fillets), what moved (`item16/diff3.txt`, against item 15's build; saved as `build/snap082j16c`): ©
® ℗ and @ in every master, the Regular TTF and the variable font; the Bold's mid layer only @ (© ® ℗ have none);
nothing else. Advances: © ® 867 > 868 in the Light and Bold, ℗ 858 > 868 (Light), 876 > 868 (Bold), 871 > 868 at
600. Kerning: only collision keys with © and ® (Light 26, Bold 29; the Bold's ring is now the Regular's box, so V ©
-11 > -17). Checks (`item16/after3/`): audit_axis Bold and Light unchanged (turns ok: a first build of item 16 listed
©'s barb corners, "a corner's fillet grew to 20", where every node took its own mitre; runs of short segments now
move as one corner, and a stroke's end as two, `at.SHORT`); audit_rays the same 3 glyphs (ð, ʕ, $; a first build had
© thicker at 300 at its barb, 49.2 > 42.0, cured by carrying the Regular's additions by the stem's law); audit_charset
0 errors; evaluate lists none of the four; even 0; curvecheck unchanged (three masters, hooks 6 / 14); pathlint 0
errors (a first build had ®'s R crossing itself at its leg's crotch, cured by the same corner rule), warnings 138 >
148, all on the scaled R and P: seven smooth nodes 1.7 to 2.9 degrees off one line after whole-unit rounding, two
handles past their meeting point in R's leg; interpolatable nothing. Looked at (`item16-copyright.png`,
`item16-registered.png`, `item16-uni2117.png`, `item16-copyright-refs.png`): the rings now read as the letters' o
does, a touch heavier at the sides; © holds this round's C with both barbs on one vertical; the R and P are Area's,
optically centred. Still not right: the Light letters are lighter than the references' (C 0.82 of the stem against
1.03): the Regular's additions carried by the stem's law keep every stroke monotone but do not reach the references'
heavier small letters at 300; the Bold's R and P serifs read slab-like (the upright addition, 27, on a letter at 0.56
size); seven smooth nodes in the scaled R and P bend 2 to 3 degrees after rounding.

### Item 17: $ and ð (and §'s ends)

The brief: $ thicker at 300 than at 400 at (207, 4) (59.7 against 55.3), ð at (279, 697) (53.1 against 50.4); $'s
four ends spread 6 at the Bold and §'s 10. Then the owner, on the published page: "misalignment on the $": where the
S's strokes pass behind the bar, the edge leaving the bar on one side is at a different height and angle from the edge
entering on the other (worse at the heavy end, the upper-left counter pinched), the stubs not centred on the S.

Measured (`item17/dollarx.py`, `dollar.check`: each of the S's six edges that cross the bar carried on along its
osculating circle to the bar's middle from both sides, the difference; the bar's middle against the S's ink centre).
$ is its own drawing (owner, 0.80), one contour with its bar, so each crossing edge is two pieces ending on the bar's
edges. Regular: steps within 0.9, the bar 8.5 right of the S's ink centre (308 against 299.5). Light: steps -16.3,
+7.3, +8.4, +23.3 (the top stroke's inside, the spine's two edges, the bottom stroke's inside), bar 10 right. Bold:
+4.6, -41.4, -19.4, bar 5.5 right; the 600 master 7.9 and 6.8. The cause in the masters: the engine moved the
counters' corners on the bar's edges as the bar's knots, which also thickened the strokes there towards the Light
(the bottom stroke's inside at the bar 63 / 41 left and right of it at 300 where the Regular has 44 / 46 over -8 / -7):
the audit_rays fault. ð's place (279, 697) is the ascender's curve past the crossing, up to its cut end at the top
left (item 10's "bar"): 51.7 at 300 against 48.4 at 400 at its middle, 53.0 at the Bold (1.10): read as part of the
ascender's thick.

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 101 | 17. $ | As above: the crossing pieces moved apart in the masters; the bar off the S's centre in every master | `dollar.py`, `true_crossing`, in `normalize` and at the end of `bold.bold_font` (each master and the mid master): the bar (its edges and stubs) moves level so its middle is the S's ink centre; each crossing edge is refitted as one curve through the bar (two cubics joined under the bar's middle at one tangent and one curvature, from the far node of the left piece to the far node of the right one, both far nodes' tangents kept, their handles within a fifth of their own length and their curvature met; every handle inside its curve's triangle; least squares on the pieces' own points, the half nearer the bar a fifth; an edge that is the S's top or bottom or a stroke's inside, near level at the bar and with its drawn extreme under the bar, gets a level node at that extreme's height, so the S keeps its height and no extreme or inflection appears between masters) and cut at the bar's edges, so the two pieces are one curve; the stubs one length, the mean of the two. The first rule written for the thickness (each crossing corner moved to S's law for its stroke) was dropped: it left the pieces as far apart as before. And `bold.round_ends` on $ and § (`ROUND_SIGNS`; $'s bar kept upright, centred after) | steps across the bar, Light / Regular / mid / Bold, largest: 23.3 / 0.9 / 7.9 / 41.4 > 1.1 / 0.5 / 0.6 / 1.5 (read along each piece's osculating circle to the bar's middle; the pieces are cut from one curve, so the rest is that reading's error where the spine's curvature changes under the bar); bar off the S's centre 10.0 / 8.5 / 7.0 / 5.5 > -0.5 / 0.5 / 0.0 / -0.5; stubs 94 / 94 (Regular), 95 / 95 (Bold). Four ends about their centre, spread at 300 / 600 / 800: $ 2 / 3 / 6 > 1 / 1 / 1, § 4 / 4 / 10 > 2 / 1 / 3. curvecheck on the whole $: Light 2.64 (6 faults) / Regular 1.36 (4) / Bold 3.59 (5) > 1.43 (3) / 1.36 (3) / 2.20 (4); audit_rays $: thicker at 300 (59.7 against 55.3) > ok at every 25 to 50 units from 300 to 800. Advances: Light 582 > 581, mid 624 > 626, Bold 652 > 656; § Bold 610 > 615 |
| 102 | 17. ð | The ascender's curve past the crossing grew towards the Light (read with the ascender's thick) | `symbols.eth_bar`: in each master the stroke between the crossing and its cut end keeps the Regular's thickness times the hairline's law (o's top: 0.860 / 1.233), about its centreline as the engine left it, the junction's corners sliding along their own edges | pairs across it (junction to cut end), Light 71 / 59 / 48 / 43 > 58 / 47 / 39 / 36, Bold 72 / 60 / 50 / 43 > 82 / 69 / 55 / 52 (Regular 70 / 57 / 48 / 42) |

Item 17, what moved (`item17/diff3.txt`, against item 16's build; saved as `build/snap082j17c`): $ in every master, the
mid layer, the Regular TTF and the variable font; ð and § in the Light and Bold (and so the variable font at 300, 600,
800); nothing else; ð and § are byte-identical in the Regular. Kerning: § j / jdotless (Light) and ldot § (Bold), a
unit each. Checks (`item17/after3/`): audit_rays 3 glyphs > 1 (ʕ, as before: $ and ð cured); audit_axis Bold thin
unchanged (5 glyphs, none of these), turns ok; Light turns: one new note, $ curve 10 at 314.6 (the bottom stroke's
outer edge right of the bar gains a y extreme at its very start: in the Light the S's lowest point lies right of the
bar, in the Regular under it); audit_charset 0 errors; evaluate lists none of the three; even 0; curvecheck unchanged;
pathlint 0 errors, warnings 148 > 147 (one handle on $'s refitted counter top past its meeting point by under a unit,
whole-unit rounding); interpolatable nothing. Two first builds, refused: one moved each crossing corner to S's law (the
pieces stayed apart); one refitted the far handles freely (audit_axis then listed $ thin at the Bold, 41 > 37, and two
turns, and audit_rays a new place at (164, 94)); the far handles now stay within a fifth of their own length.

Looked at (`item17-dollar.png`, `item17-eth.png`, `item17-section.png`): the S now runs through the bar at every weight
(the Light's upper counter lost its shelf, the Bold spine's two halves meet), the bar stands on the S's middle and its
stubs are one length. Still not right: at 800 the upper counter left of the bar is pinched (58 units of white at its
middle against 99 right of the bar; the lower counter 150 / 93): the S's own bowls are uneven at the Bold (the upper
bowl's left side grows inward), which no bar position balances (the best shift is 4 units); ð's ascender curve at 300
now reads lighter than its crossbar; § at 800 keeps its lumpy left side (the engine's; only its ends were moved).

### Item 18: the hook above (U+0309)

Measured (curvecheck on the whole mark, snap082h / item 17's build): Regular hookabovecomb worst ratio 1.53 (node 9, the
eye's top-left), Light 2.01 (node 18), Bold 1.95 (node 9) and two flat places; the capital form 1.30 / 1.38 / 1.72. In
the variable font's masters the mark is two overlapping parts (`overlap.curl_master`: the curl, closed by a line inside
the stem, and the stem); the static Regular keeps the merged outline. It is carried by 27 composites (the brief's "about
100" counts the Vietnamese letters with any tone mark; 27 hold this one, ả ẳ ẩ ẻ ể ỉ ỏ ổ ở ủ ử ỷ and their capitals and
ss03 forms).

| # | Item | Cause | Rule | Before > after |
|---|---|---|---|---|
| 103 | 18. ̉ | The mark's first drawing (charset.hook_above, a union of an arc, a ball and a stem, then the node rules) meets at its nodes with jumps; the masters' curl carried them and the engine's knots made them worse | Every smooth node at one curvature, handle lengths only (`symbols.even_curves`, `HOOKS`): on the Regular's merged outline in `normalize` (after the letters in a ring), so the variable font's default curl and stem (`overlap.vf_source`) come from it; and on each master's curl and stem right after `curl_master` builds them, kept only where the faults fall. The curl's last node (the eye's foot, where the closing line runs inside the stem) is a corner (`overlap.curl_parts`): curvecheck read it as a smooth node bent 126 to 138 degrees | worst ratio / faults, Light / Regular / Bold: hookabovecomb 2.01 (4) / 1.53 (2) / 1.95 (5) > 1.21 (1) / 1.18 (1) / 1.23 (3); hookabovecomb.case 1.38 (2) / 1.30 (1) / 1.72 (6) > 1.23 (0) / 1.11 (0) / 1.14 (4). Left: flat places (the Bold's curl 2, the capital's 4 at the Bold, the Light's 1) and the Regular's eye foot leaving the stem's straight at 1.00 of its tightest (the stem's top is a corner by design) |

Item 18, what moved (`item18/diff.txt`, against item 17's build; `build/snap082j18` = `build/snap082i`): the two marks in
every master, the Regular TTF (hookabovecomb) and the variable font; in the Light four capitals with two marks (Ẩ Ẳ Ể
Ổ), whose hook the Light's mark placement set 1 to 2 units lower over the changed ink (419, 100 > 419, 98 on Ẩ); $ in
the Light and the 600 master: a follow-up of item 17 (`dollar.true_crossing`: the S's outer top and bottom leave the bar
level when both pieces are within 4 degrees of level; it did not reach the Light's bottom, whose lowest point lies right
of the bar, so the Light turn note stands). No composite collides: the least white between the hook and the rest of
each of the 27 composites at 300 / 400 / 600 / 800 is 54.0 / 54.0 / 46.6 / 32.5 (Ỏ, Ỏ, Ẳ, ẳ), before 54.0 / 54.0 /
46.6 / 32.5 (`item18/hookgap.py`, `gap-before.txt`, `gap-after.txt`). Checks (`item18/after/`): audit_axis Bold and
Light as item 17 (turns ok in the Bold; the Light's $ note), crossings ok; audit_rays 1 glyph (ʕ); audit_charset 0;
even 0; curvecheck unchanged (hooks with a ball 6 / 14: the IPA hooks, not this mark); pathlint 0 errors, 147 warnings;
interpolatable nothing. Figures: `item18-hookabove.png` (both forms, 300 / 400 / 600 / 800, before over after),
`item18-uni1EA3.png`, `item18-uni1EA8.png`, `item18-uni1EB3.png`, `item18-uni1EDF.png`.

Kerning, once at the end (`AREA_KERN_FIT=1 build.py`; the advances of @, © ® ℗, $ and § moved): fit_kerning.json
unchanged; the masters' keys moved only in collision pairs with those glyphs (and Ể / Ổ in the Light, a unit).
`audit_kern.py` passes at 300 / 350 / 400 / 600 / 800 and at every 25 units from 300 to 800 (least 10.4 / 9.3 / 8.3 /
8.4 / 7.9, as before; `item18/kern.txt`, `kern-every25.txt`). The final build is saved as `build/snap082i`; against
`snap082h` (`item18/diff-082h-082i.txt`) only @, © ® ℗, $, ð, §, the two hook marks and the four Light capitals moved.
Pages not rebuilt.

## Regular pass (0.83, 18 November 2026)

The owner: "Focus on how to bring more consistency, cohesiveness, visual clarity, smoothness, and evenness to the whole
glyph set ... let's get the regular weight in a good place first." Five items, each designed and judged at the Regular
(400), built with `AREA_BOLD=0 build.py`, diffed against the build before (`build/owner8/reg/diffreg.py`: the Regular UFO,
its overlap layer, kerning and the TTF), checked with `evaluate`, `even`, `curvecheck` (and `--hooks`), `pathlint`,
`parts`, `audit_charset` (`build/owner8/reg/checks.sh`; baseline `chk-082i/`), looked at large (before beside after at
1000 px per 1000 units, combs, a line of text: `build/owner8/reg/item*-*.png`) and committed before the next. The masters
follow by the existing rules; they were not tuned. The build before is `build/snap082i`.

The previous worker's uncommitted files (`build/owner8/reg/stopped/`): `sigma.py` kept as the base of item A and
corrected (below); `amp.py`'s loop rule kept for item C; `figs.py` split (item D, item E).

### Item A: the summation (U+2211) and Esh (U+01A9)

Measured (`build/owner8/reg/a/refsum2.py`, `tip.py`; Georgia Pro, Serrif, Source Serif 4, Literata, Merriweather,
Crimson Pro at 400, PP Kyoto Medium beside them; numbers only). Area's ∑ was Libre Baskerville's Esh: each bar's
underside ran into its diagonal through an S-shaped bracket of five curves; the point a 36-unit upright flat (four
nodes); hooked heels at the two left corners (heel 33 against the references' -3); the top serif's beak 3.57 of its bar,
the bottom's 3.98, at different angles; the point 0.746 across where the references put it at 0.637 (it leaned right),
0.542 up (0.523); width 0.964 of E's ink; the upper diagonal 1.14 of the stem (98.5) against the references' 0.98; and
it stood on the baseline where every reference hangs the sign from the cap height to -0.119 to -0.292 of it (median
-0.200, PP Kyoto -0.189).

| # | Item | Cause | Rule | Before > after (Regular) |
|---|---|---|---|---|
| 104 | A. ∑ Ʃ | As above: a drawn letter read as loose parts, no part from Area's capitals | `sigma.py`: one closed outline of straight edges from the master's capitals. Bars E's top arm across (46), each ending in E's top-arm beak (the bottom one E's turned over, so both one size and angle); upper diagonal Z's diagonal across (89), lower A's thin diagonal (49). The bars' left ends a square cut on one vertical; the upper diagonal's outer edge leaves the top bar's left end at its underside, the lower diagonal's inner edge the bottom bar's at its top, meeting in the inner notch (a point); the other edges meet the bars in plain corners (Z's joins, no bracket) and each other in a sharp point (four references of six have no flat; Georgia Pro 0.13 and Literata 0.16 of the stem; the capitals' 0.42 flat stands in for an overshoot on a zone line and read "chipped" mid-height). Places from the references' medians: ink 0.982 of E's ink (589), the top bar's end 0.974 of the bottom bar's, the point 0.637 across and 0.523 up; ∑ from 712 to -142 (-0.200 of the cap), Ʃ (a capital letter) from 0 to 712 on the same construction. In each master the same construction at that master's capitals, width 0.982 of its E (replaces `charset.sum_vertex` in `bold.bold_font`; the Regular's `sum_vertex` is overwritten). In `normalize` after the ampersand | point 0.746 / 0.542 > 0.637 / 0.523 of the ink; bottom 0 > -142 (∑); upper / lower diagonal 98.5 / 54.1 > 89 / 49 (Z's / A's); bars 46.5 / 46.0 > 46 / 46; beaks 3.57 / 3.98 > 2.96 / 2.96 of the bar (E's); heel 33 > 0; joins: 2 S-brackets of 5 curves > plain corners; point flat 36 > 0 (sharp); width 589 (0.982 E); points 53 > 38 (on-curve 27 > 22). Advances ∑ 638 > 650, Ʃ 665 > 677 (sides kept) |

What moved (`a/build-a1.log`, `diffreg.py`): Esh and summation in the Regular UFO and TTF, nothing else; the overlap
layer unchanged. Kerning: 19 collision keys with ∑ (the pass that keeps ink 13 apart: ∑ now hangs below the baseline,
so ∑ j 123, ∑ ƒ 54, ſ ∑ 39 > 72, f ∑ 32; K ∑ 5 dropped). Checks against snap082i: evaluate, even, curvecheck (both),
parts, audit_charset unchanged (0 errors); pathlint 147 > 144 warnings, 31 > 29 infos (the three handles past their
meeting point and the overlap note on Ʃ and ∑ are gone). The master construction was run on snap082i's Light and Bold:
structure matches (38 points), bars 36 / 61, thick 67 / 149, thin 40 / 65, width 571 / 630.

Looked at (`reg/itemA-summation.png`, `itemA-Esh.png`, `-combs`, `itemA-text.png`): the ∑ now reads as Area's E and Z
put together: straight, upright, one weight per stroke, the two beaks one size, the left side one vertical, a clean
point. Still not right, honestly: the bars (E's 46) read light beside the 89 diagonal at text size; every reference
makes the bottom bar heavier (1.6 of the top, median), which the owner's "capitals' arm weight" does not; the long
level runs of the bars' undersides show the beak's bracket (E's own curve from 463) as the only curve in the glyph; and
the hanging ∑ needs ∑ j kerned open by 123 (a collision pass value, not a fit).

### Item B: the arrows

The owner: "arrow both shouldn't have the middle line go through the arrows?" Measured (`b/arrownum.py` on Area;
`b/refarrows.py`, `refcentre.py`, `sysarrows.py` on Serrif, Source Serif 4, Literata, Merriweather, PP Kyoto Medium,
Times New Roman; Georgia Pro, Crimson Pro and Newsreader have no arrows). In ← → ↑ ↓ the shaft stopped at the head's
crotch and the head ran solid to a sharp point (end flat 0): sound. ↔ and ↕ were → and its mirror unioned: each shaft ran
on through the other end's head to the arrow's end, so both points were cut square (a 52-unit flat at each tip, 22
units of shaft past the head's edges): the owner's "middle line through the arrows". The heads were one construction
everywhere except the slanted four, made 0.92 as long with a 0.92 head (the references' slanted arrows are the level one
turned: length and head 1.00 in Serrif, Source Serif 4, Merriweather and PP Kyoto). The vertical and slanted arrows
stood 13 to 15 units over the maths axis (30 under the cap height's middle); the references centre theirs on their
level arrow's axis (the up arrow's middle -0.033 to +0.109 of the arrow's length, median +0.010). Lengths: ↔ the same
as → (Times New Roman 1.00, Merriweather 1.66; the others have none); ↑ the same as → (every reference 1.00).

| # | Item | Cause | Rule | Before > after (Regular) |
|---|---|---|---|---|
| 105 | B. ↔ ↕ | Two arrows unioned: each shaft ran through the far head | `charset.arrows.east(both=True)`: one shaft from crotch to crotch, the right head and the same head turned over about the arrow's middle; the shaft stops at each head's crotch as in → | tip flats 52 / 52 > 0 / 0; on-curve points 28 > 22; length 490 = →'s; advance 578 / 612 kept |
| 106 | B. ↖ ↗ ↘ ↙ | Made 0.92 as long, head 0.92 | The arrow turned whole (`east()`): the same head and length as → | head run 162 > 176 (→'s); advance 428 > 455 (sides 35 kept) |
| 107 | B. ↑ ↓ ↕ ↖ ↗ ↘ ↙ (⌃) | Placed 30 under the cap height's middle | Every arrow's ink centred on the maths axis (313), as the level arrows' shafts; ⌃'s point follows ↑'s | ink middle 326 > 313 (↑ ↓ ↕), 324-328 > 311-315 (slanted: whole-unit rounding of the turn); ⌃ 13 lower |

The family after (`b/arrownum.py`): every arrow's shaft the minus (52) on the axis, every head the same two strokes
(run 176, spread 376, sharp point), the shaft ending in the head's crotch; ↵ ⇤ ⇥ were already built from ← → and are
unchanged (heads identical); lengths: → ← ↑ ↓ ↔ ↕ and the slanted arrows along their axis 490. What moved: ↔ ↕ ↑ ↓ ↖ ↗ ↘
↙ ⌃ in the Regular UFO and TTF, nothing else; kerning: three collision keys with ŀ (ldot ↔ 17 > 15, ldot ↖ 22 > 21, ldot
↙ 19 > 20). Checks against item A: evaluate, even, curvecheck (both), pathlint, parts, audit_charset identical.
Looked at (`reg/itemB-arrowboth.png`, `itemB-arrowupdn.png`, `itemB-uni2197.png`, `itemB-arrowup.png`, the families
`itemB-family-before.png` / `-after.png`, `itemB-text.png`): ↔ and ↕ now end in the same points as ← and →; the slanted
arrows are the same size as the level ones. Not right yet: ↔ at →'s length leaves 310 units of shaft between the
crotches, which reads short at text size beside → (one reference, Merriweather, makes it 1.66 as long; the advance
would grow); the masters were not looked at (the engine reads the new ↔ / ↕ outlines).

#### Item A, second pass: the operator (the reference study's numbers)

The reference study (`build/refstudy/spec.md`, Georgia Pro, Serrif, PP Kyoto) came in after the first pass: Area's ∑
was still the Greek capital's proportions on an operator's extent. Its numbers, taken for the summation only (Ʃ stays
the letter of the first pass): extent -0.25 to 1.00 of the cap (-178 to 712; references' height 1.23 to 1.29 cap, the
centre 0.04 to 0.13 cap under the maths axis: Area's now 267, 0.065 under); width 0.79 cap (562, 0.9375 of E's ink in
any master); the bottom bar 0.90 of n's stem (70; Georgia Pro 0.96, Serrif 0.89: the operator's heavy foot; this
overrides the brief's "both at the arm weight" for the summation, the coordinator's instruction), its beak E's moved
down with the bar's inner edge so both serifs stand as far past their bars; the diagonals' long edges at 55 and 52
degrees from level, the point where their inner and outer edges meet (VX 0.662, VY 0.525 result); the point's flat 0.13
of the capital stem across the bisector (11; Georgia Pro's 0.127 measured, Serrif sharp; the study's 0.42 is the
capitals' zone-line flat, which the owner read as chipped mid-height). ∏ takes the same extent: its stems run down to
-178, feet whole (`charset.maths`).

| | first pass | second pass | references (study) |
|---|---|---|---|
| ∑ extent | -142 to 712 | -178 to 712 | -0.19 to -0.29 cap |
| width / cap | 0.827 | 0.790 | 0.69 to 0.96, rule 0.79 |
| bottom bar | 46 | 70 | 0.89 to 0.96 stem |
| diagonals from level | 53.7 / 52.0 | 55.0 / 52.0 | 53/50, 59/53, 65/67 |
| point flat | 0 | 11 | Georgia 13, Serrif 0 |
| ∏ extent | 0 to 712 | -178 to 712 | G -0.29, K -0.19, S 0 |

What moved against item B's build: summation (advance 650 > 623) and product in the Regular UFO and TTF, nothing else;
kerning: collision keys with ∏ and ∑ and j / ƒ (∏ j 132, ∏ ƒ 64, ∑ j 126). Checks identical to item B's. In the
masters the same rule gives a bottom bar of 49.5 / 126 at 300 / 800 and the point rising to 0.59 of the height at 800
(the angles fixed while the bottom bar grows): reported, not tuned. Figures `reg/itemA2-summation.png`,
`itemA2-product.png`, `-combs`, `itemA2-text.png`. Looked at: the ∑ now reads as an operator beside x and ∏, its heavy
foot balancing the thick diagonal; still, ∏'s and ∑'s descent needs ∏ j / ∑ j opened by 126 to 132 units (the collision
pass), and ∏ x sits close (its sides are 30, a sign's).

#### Item B, second pass (the reference study)

The study (`build/refstudy/spec.md`) confirms the rule for ↔ ↕ (no reference has them; in every single arrow the
shaft's end never shows outside the head) and asks that this item change no length, head angle or stroke style (a
later pass restyles the family from the spec), and that the slanted arrows' arms lie level and upright (the turned copy
put them 4.9 degrees off; PP Kyoto's 1). So the first pass's lengthening of ↖ ↗ ↘ ↙ to 1.00 is undone: they keep 0.92 of
the level arrow's length, take the level arrow's arm (centreline 231, weight 52) and open it to 45 degrees off the shaft
(`east(half=45)`), so turned 45 degrees one arm is level and the other upright. ↔ ↕ and the axis placement stand.

| | 0.82i | first pass | second pass |
|---|---|---|---|
| ↖ ↗ ↘ ↙ length along the arrow | 451 (0.92) | 490 (1.00) | 451 (0.92) |
| their arms off level / upright | 4.9 deg | 4.9 deg | 0.0 deg (edges at 0, 45, 90 deg) |
| their arm (outer edge) | 230 | 250 | 250 (→'s) |
| advance | 428 | 455 | 407 |
| ink middle (axis 313) | 324 to 328 | 311 to 315 | 310.5 to 315.5 |

What moved against item A's second build: ↖ ↗ ↘ ↙ only (kerning: ldot ↖ 21 > 26, ldot ↙ 20 > 26). Checks identical.
Figures `reg/itemB2-uni2197.png`, `itemB2-uni2198.png`, `itemB2-family-after.png`, `itemB2-text.png`. Still not right:
the slanted arrows' heads are now a 90-degree chevron beside the level arrows' 99 degrees (the study's 45-degree
half-angle for every arrow is for the later restyle); the family is short against the references (0.94 x-height
against 1.21 to 1.32), left for that pass.

### Item C: the ampersand

Measured with the reference study's reader (`build/refstudy/ampm.py`, run read-only by `reg/c/ampref.py`; Georgia Pro,
Serrif, PP Kyoto Medium; table `reg/c/ampref-final.txt`). The 0.82 & had a flat lid and an angular upper-left shoulder
(the loop's outer upper-left quarter 1.50 as wide as tall, references 1.14; its left extreme at 0.70 of the counter's
height, references 0.52); the loop's left side and the diagonal light (0.80 / 0.95 of n's stem, references 1.04 /
1.05); the loop counter tall (0.86 of the bowl counter's height, references 0.80); the crossing and the bowl's top low
(0.59 / 0.49 cap, references 0.61 / 0.51); the glyph wide (1.03 cap, references 0.98); the diagonal steep (53 degrees
from level, references 50.5).

The stopped worker's `amp.py` (two candidates in `build/owner8/item19-candidates.png`) was kept: the loop by rule
(`loop_rule`: the outer extremes at the references' share of the counter's height, the outer quarter's width over its
height `kappa`, the counter's upper-left quarter never under `il_min`, the left side leaving the diagonal's straight on
a circular turn of the quarter's own radius, an Euler-like ease twice the circle's height), the bowl's outer left at a
radius 0.89 of its lower quarter, the bowl's bottom e's bottom, the arm's crotch filleted (0.30 stem, the @'s), the
solver's no-peak and rise terms, the whole-unit rounding guard against new inflections. Candidate A (kappa 1.01 /
1.085 at 400 / 800) and B (0.88 / 0.97, a narrower loop) are kept in `LOOP["kappa"]` with C (0.974 / 1.054, a first
interpolation). Read against the study, A was nearer the references (B's loop 0.41 of the width against 0.48, counter
area 0.51 against 0.62), but both kept the old skeleton's faults above. So a fourth, D, from A:

| # | Item | Rule | 0.82i > 0.83 (Regular) | references (median) |
|---|---|---|---|---|
| 108 | C. & | Weights as shares of n's stem (`amp.STUDY`): diagonal 1.05, loop's left 1.04, loop's right 0.77 (they were v's thick, 0.89 of it and 0.895 of the left); skeleton (`amp._study_skeleton`): x narrowed 0.952 about the left (ink 0.98 cap), the diagonal at 50.5 degrees from level, the spine's crossing raised 18; the loop's kappa 1.08 (`LOOP["kappa"]["D"]`, Bold 1.16), between A's 1.01 (counter area 0.50, width 0.57, offset 0.014 on this skeleton) and 1.12 (0.62, 0.69, 0.046): the value that puts the loop's outer width over the bowl's and its counter width on the medians with the offset inside the references' range | width / cap 1.033 > 0.987 | 0.98 |
| | | | loop counter / bowl counter: area 0.575 > 0.573, width 0.637 > 0.651, height 0.858 > 0.774 | 0.62, 0.63, 0.80 |
| | | | loop outer / bowl outer 0.817 > 0.886; loop width / ink 0.447 > 0.492 | 0.89; 0.48 |
| | | | loop offset / width 0.029 > 0.033 | 0.017 to 0.052 |
| | | | loop foot / cap 0.586 > 0.612; bowl counter top 0.485 > 0.506 | 0.61; 0.51 |
| | | | stations / stem: loop left 0.80 > 1.04, loop right 0.78 > 0.77, loop top 0.55 = 0.55, bowl left 1.00 > 1.01, bowl bottom 0.58 > 0.64, diagonal 0.95 > 1.05 | 1.04, 0.77, 0.47, 1.07, 0.72, 1.05 |
| | | | curvecheck on the glyph: worst 1.02 > 1.09, 0 faults; advance 810 > 777 | ratio within 1.2 |

What moved against item B's second build: the ampersand only (advance 810 > 777); kerning unchanged. Checks: evaluate,
even, curvecheck, parts unchanged; audit_charset 0 errors (the & ink rule 2.44 > 2.50, limit 3.0); pathlint one
warning more: the arm's crotch fillet has its leftmost point inside the curve (x 506, t 0.53), no node there (adding it
must happen in every master's construction too; left). The master construction was run on snap082i's Light and Bold
with this Regular: no curvecheck fault (worst 1.17 / 1.05). Figures `reg/itemC-ampersand.png`,
`itemC-ampersand-combs.png`, `itemC-text.png`; the k = 1.08 / 1.12 trials in `reg/c/k1.08`, `k1.12`.

Looked at: the loop is a round teardrop, its curvature changing smoothly all round (no lid, no shoulder), standing over
the bowl; the diagonal carries the weight; the glyph sits narrower in text. Still not right: the thinnest place is
0.80 of the hairline where the references keep 0.97 to 1.00 (it is in the bowl's bottom as it runs into the diagonal
and at the tail's join, not on the stroke rising into the loop as theirs); the bowl's bottom 0.64 of the stem against
0.72; the loop's top 0.55 against 0.47 (o's hairline, heavier than theirs); the bowl's outer left extreme still reads
a little tighter than the arcs either side in the comb.

The owner's clarification on the references (after item C was committed): they show how glyphs appear, they are not
targets; the test is Area's own system, the references only catch a glyph plainly outside normal practice or choose
between equal options. Item C's proportional moves (width, the diagonal's angle, the crossing's height, the loop's kappa
to the medians) are therefore revisited after item E (below, "Item C, second pass"); items D and E take their places from
Area's own glyphs first.

### Item D: the figure 3, and the other round figures

Measured (`reg/d/figcomb.py`: curvecheck on each whole figure; `ref3x.py`; `thick.py`: radial rays from each bowl's
counter centre; Area's 8 and S for the extremes' places). The 3: 8 faults, worst ratio 2.00: the top's two arcs met
with a 1.25 jump (inner) and 1.30 at the ball's left, because the top stood at 0.451 of the upper bowl's width (Area's 8
0.493, S 0.498; references 0.487 to 0.550), so the left quarter was 200 wide and the right 243 for one height; each
quarter's handles unequal (top-left 0.64 / 0.48 of their sides: long at the top, short at the ball, so the arc ran
flat and then turned tight into the ball, the owner's "flattens toward the ball"; bottom-left 0.59 / 0.49, the owner's
"longer and flatter"); three flat places, two of them in the inner curves into the waist; the upper ball's neck a second
upright node 6 units left of the ball's right extreme (an S of 21 units, 1.59 and 1.33 jumps), where the lower ball runs
straight into its inner curve. The thick sits right: on the right of each bowl at mid-height (thickest at 0 degrees in
both bowls, 92.1 / 92.3, as the references' 0 to +5 and Area's 2 and 5).

| # | Item | Rule (`figs.py`, in normalize before spacing, so ³ ₃ and the fractions follow) | Before > after (Regular) |
|---|---|---|---|
| 109 | D. 3 | (1) the upper ball's neck is one curve, as the lower ball's: the node between the ball's right extreme and the inner top dropped, the two curves refitted as one quarter with the lower ball's handle shares (`neck`); (2) the top and bottom extremes, outer and inner together, moved level with their handles to the places nearest the middle of each bowl (Area's 8 and S) at which every node meets at one curvature with no flat place: top 0.51, bottom 0.445 (scanned: top 0.49 to 0.505 left a flat place in the inner curve into the waist, bottom 0.452 / 0.449 one in the lower bowl's; both inside the references' ranges); (3) every smooth node between two curves at one curvature (`loops.even_nodes`, handles only, target 1.05) | curvecheck worst 2.00 > 1.09, faults 8 > 0 (flat places 3 > 0); top at 0.451 > 0.510, bottom 0.452 > 0.445 of their bowls; points 60 > 57; thick at 0 degrees both bowls (unchanged); width unchanged |
| 110 | D. 5 | The same evening (`even_figs`), and a handle the rounding left off its node's line turned back onto it (`collinear`) | curvecheck worst 2.95 > 1.05, faults 6 > 0 |

The comb table over the Regular's round figures after (`d/figcomb-after.txt`; worst ratio at a smooth node, faults,
thickest place): 2 1.43, 1 fault (node 9 at the ball's neck: the ball's own drawing, left; thick at -5 degrees); 3 1.09, 0
(thick 0 / 0); 5 1.05, 0 (thick +5); 6 4.56, 2 and 9 2.51, 1 (where the long stroke enters the bowl: the same evening
cures them, 1.15 / 1.06, but undoes even.py's thickness round their counters, strays 2.4 / 2.6 > 4.7 / 3.7 against 2.75,
so left until one solve holds both; listed); 8 1.21, 0; 0 1.07, 0. Thick placement: 2 3 5 at 0 to +5 degrees (right,
mid-height); 6 9 read at their junction (the ray runs into the long stroke), 0 symmetric (87.9 left, 87.0 right).

What moved against item C's build: 3, 5 and their superiors and inferiors (³ ₃ ⁵ ₅), the fractions built from them
(⅓ ⅔ ¾ ⅜ ⅗ ⅝ ⅚ ⅕ ⅖ ⅘ as composites; advances of ⅓ ⅔ ¾ ⅜ ⅗ ⅝ ⅚ by 2 to 3 units through the fraction spacing),
nothing else; kerning: five collision keys with ď / ľ. Checks: curvecheck, parts, audit_charset, even unchanged;
evaluate jumps 35 > 33 (the 3 lists two "curvature flips sign" at its ball necks and a lopsided quarter at the lower
ball's left, 0.52 / 0.86: the evening's; the 5 lost two); pathlint 145 > 146 warnings (⁵: one handle past its meeting
point after scaling), 29 > 27 infos. Figures `reg/itemD-three.png`, `itemD-three-combs.png` and `itemD-c4k-three-combs.png`
(a finer comb scale), `itemD-five*.png`, `itemD-text.png`. Looked at: the top bowl's upper-left arc now turns evenly
into the ball (no flat run then a tight turn), the top a level meeting of two arcs of one curvature, the bottom-left arc
no longer long and flat; the upper ball meets its bowl as the lower does. Not right yet: 6 and 9 as above; the 2's ball
neck; the lower ball's left quarter reads slightly lopsided in evaluate's handle test.

### Item E: g's ear and bowl

The owner: "is the ear of the g supposed to have the round part of the top story of the g be misaligned?" It is not.
Measured (`reg/e/gdent.py`: the drawn outline either side of the ear, E to D below the ear's lower root and U to T above
its upper root, against one cubic from the bowl's right extreme E (upright) to its top T (level); + outside): the
Regular's pieces stand +2.8 at D and +4.9 at U, a 2-unit step across the ear, too small to see at 400 (the stopped
worker's ellipse reading: U / D 1.034 / 1.020); snap082i's Bold +25.3 at U and -10.5 at D (the outline above the ear
stands out, the bowl below resumes inside: the notch the owner saw at the heavy weights, made by `bold.g_ear` moving the
ear's ball and roots without the bowl), the Light -7.4 / +8.0. The ear itself is sound in the Regular: it leaves as a
branch, thin at the root and swelling to the ball.

| # | Item | Rule | Before > after |
|---|---|---|---|
| 111 | E. g | `figs.g_oval` (the stopped worker's, kept, with one change): the bowl's outer upper-right quarter is one cubic from E to T, its two handles fitted (least squares, end tangents fixed) to the drawn pieces either side of the ear; the ear's roots D and U slide to the nearest places on it and the pieces E-D and U-T become that cubic's own pieces, so the outline either side of the ear lies on one curve; the ear's curves keep their shape, their ends moving with D and U. The stopped worker's cubic took the bowl's upper-left tensions, which made it another oval (a 1.73 curvature jump at E); matching E's curvature alone bulged it 8 units out; the fit keeps E's join (no new fault). In the Regular (`normalize`, with the 3's rule, before spacing: ǥ follows). In the masters it was tried right after `bold.g_ear` and withdrawn (full build, below) | Regular: step across the ear 2.1 > 0 (the two pieces one cubic); roots moved D (+0.6, 0), U (-1.0, -0.5); curvecheck on the whole g 9 faults, worst 2.57 > 9, 2.42 (the ear's ball top; the faults are the g's own drawing: the link, the loop's ends, none at the bowl) |

What moved against item D's build: g and ǥ (gstroke, also its overlap layer) in the Regular UFO and TTF; ğ ĝ ġ ģ ǧ ǵ ḡ
follow as composites; g.ss02 and ɡ byte-identical; nothing else; kerning unchanged. Checks identical to item D's.
Figures `reg/itemE-g.png`, `itemE-g-combs.png`, `itemE-text.png`. Looked at: at 400 the change is a unit (the dent the
owner saw is a heavy-weight one, which the masters' rule now holds: numbers in the full build below). Not done: the
ear's angle and position against the references (only a sanity check: inside their range by eye); the g's other
whole-glyph curvature faults (link, loop ends) are its existing drawing.

### Item C, second pass: the ampersand in Area's own terms

After the owner's clarification (the references show how glyphs appear; they are not targets), item C's moves onto the
references' medians are undone and what was uneven or awkward in Area's own terms is kept fixed. Undone: the skeleton's
narrowing to 0.98 cap, the diagonal's turn to 50.5 degrees and the crossing's 18-unit rise (`amp._study_skeleton` kept,
not applied), the diagonal and the loop's sides as shares of n's stem (`amp.STUDY` kept, unused), kappa 1.08. Kept:
the stopped worker's loop rule (round teardrop, no flat lid, no angular shoulder), the bowl's left radius, e's bottom,
the arm's crotch fillet. In Area's terms: the diagonal and the loop's left side are one stroke at v's thick diagonal (74:
the ladder's thick diagonal; the stopped worker's 0.89 of it left the loop's left side light, 66), the loop's right side
half way between o's side and the hairline (62.5, the 0.82 rule: a round stroke running from the top's hairline into
the spine's), the top o's hairline (43). The loop's form: A (kappa 1.01 / 1.085) against C (0.974 / 1.054) on this
skeleton, looked at large and in text (`reg/c/AvsC-ampersand.png`, `second-text.png`): A's loop is the rounder teardrop
and passes curvecheck (worst 1.05, 0 faults); C's narrower loop has a 1.33 jump. A is taken. B (0.88 / 0.97) stays
in `LOOP` for the record (its loop reads small: 0.41 of the width).

| | 0.82i | first pass (D) | second pass (A) |
|---|---|---|---|
| advance / width over cap | 810 / 1.033 | 777 / 0.987 | 810 / 1.033 |
| loop counter / bowl counter: area, width, height | 0.575, 0.637, 0.858 | 0.573, 0.651, 0.774 | 0.598, 0.628, 0.879 |
| loop outer / bowl outer; offset | 0.817; 0.029 | 0.886; 0.033 | 0.850; 0.073 |
| diagonal; loop left; loop right; loop top (units) | 74; 74; 62.5; 43 (drawn loop) | 82; 81; 60; 43 | 74; 74; 62.5; 43 |
| loop's outer upper-left quarter, width over height | 1.50 (lid) | 1.08 | 1.01 |
| curvecheck on the glyph, worst / faults | 1.02 / 0 | 1.09 / 0 | 1.05 / 0 |

What moved against item E's build: the ampersand only (advance 777 > 810, its 0.82 advance again). Checks identical to
item E's but audit_charset's & ink 2.50 > 2.45 and the fillet's no-node warning moving with the fillet (520, 153).
Figures `reg/itemC2-ampersand.png`, `itemC2-ampersand-combs.png`, `itemC2-text.png`. Looked at: the &'s Baskerville
character and width are back; the loop is round, its curvature smooth all round, the left side the diagonal's weight.
Still: the loop sits 0.073 of the width right of the bowl's counter (the 0.82 drawing 0.029: the loop's left side
leaves the diagonal on a turn of its own radius, which carries it right); the thinnest places are the bowl's bottom into
the diagonal and the tail's join (0.78 of the hairline).

### Full build (all masters), the audits, `build/snap083a`

One full build (`AREA_KERN_FIT=1 build.py`, `reg/build-083a2.log`), the audit set on it and on `snap082i` with the same
script (`reg/fullaudit.sh`; `reg/audit-082i/`, `reg/audit-083a2/`), the masters reported and not tuned. The first full
build stopped in the Bold engine: `bold.HINTS["summation"]` named the old drawing's knots (0 / 46, 666 / 712); the
summation is now a construction run again in each master (`sigma.master`), so the engine reads it without hints. A
second build carried `figs.g_oval` into the masters after `g_ear`; at the Bold it slid the ear's lower root 16 units into
the ear and crossed the ear's first handle (audit_axis turns: an inflection in g's curve 7 at 565 and 369), so it was
withdrawn (`reg/snap083a-try1/`). The third is `build/snap083a`.

What moved against snap082i (`reg/diff-082i-083a.txt`): in every master, the Regular TTF and the variable font at 300 /
400 / 600 / 800, exactly the items' glyphs: Ʃ ∑ ∏; ← ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⌃ (← → ↵ ⇤ ⇥ unchanged); &; 3 5 and ³ ₃ ⁵ ₅, the
fractions built from them; g and ǥ (the accented g as composites); the Bold's mid layer: &, g and ǥ (g and ǥ no longer
need a mid master: their crotch's neck now interpolates within `MID_MISS`). Advances (Light / Regular / Bold): Ʃ 658 /
665 / 684 > 663 / 677 / 708; ∑ 630 / 638 / 659 > 610 / 623 / 653; ↖ ↗ ↘ ↙ 415 / 428 / 445 > 390 / 407 / 430; ↔ 550 / 578 /
618 > 542 / 578 / 630; ↕ 580 / 612 / 658 > 582 / 612 / 656; 3 and 5 by a unit in the Light; fractions 2 to 3. Kerning
refit: fit_kerning.json unchanged; the masters' keys moved only in collision pairs with these glyphs (Light 79, Regular
34, Bold 381, most with ∏ and ∑ now hanging below the baseline).

| Audit | snap082i | snap083a |
|---|---|---|
| audit_axis (Bold and Light: counter, drift, symmetry, mirror, seam, thin, monotone, composite, turns, crossings) | ok | ok (identical) |
| audit_rays (300 to 800) | 1 glyph (ʕ) | 1 glyph (ʕ), 27,229 > 27,063 places (∑ Ʃ ∏ arrows have fewer, straighter parts) |
| audit_bold (Bold) | 432 / 432 | 431 / 432: g's neck "missed": the reader looks for the Bold's crotch within 0.75 of where the Regular's maps, and the Regular's root moved a unit (item E); read directly, the Bold neck is 44.8 > 46.1 against the target 45.9 (on target) |
| audit_bold (Light) | 432 / 432 | 432 / 432 |
| audit_kern (300 / 350 / 400 / 600 / 800) | pass, least 10.4 / 9.3 / 8.3 / 8.4 / 7.9 | pass, the same |
| curvecheck regions (Light, Bold) | pass | pass |
| curvecheck hooks (Light, Bold) | 6 / 14 faults | 6 / 14 (unchanged) |
| interpolation (varLib.interpolatable on the default layers) | 61 struck glyphs listed (the overlap layer is the VF source) | the same 61, nothing new |
| fallbacks in the variable font | ® ℗ (Bold), ℗ (Light) | the same |

The masters, as the existing rules give them (curvecheck on the whole glyph, faults / worst ratio, Light and Bold,
snap082i > snap083a): 3 11 / 2.11 > 2 / 1.38 and 9 / 2.33 > 5 / 1.54; 5 7 / 3.13 > 0 / 1.24 and 7 / 3.01 > 1 / 1.38; &
0 / 1.03 > 0 / 1.03 and 0 / 1.03 > 1 / 2.07 (the Bold's loop form A: one jump to look at); ∑ 6 / 249 > 0 / 1.00 and 6 /
160 > 0 / 1.00; Ʃ 5 / 166 > 0 and 4 / 162 > 0; g 11 / 2.25 > 10 / 2.00 and 12 / 3.01 = 12 / 3.01. The g's bowl through
the ear in the masters (`e/gdent.py`): Bold U +24.3 / D -9.6 (snap082i +25.3 / -10.5), Light D +8.9 / U -10.1: the
dent the owner saw at the heavy weights is still there; its rule (move the ear with the bowl in `g_ear`) is open. The
∑'s bottom bar at the Bold is 126 (0.9 of the Bold n stem) and its point rises to 0.59 of the height (the diagonals'
angles fixed while the bar grows). Pages not rebuilt.

### Symbols 1: accuracy (the symbol system's rules, every non-letter glyph against them)

The owner: "the arrows and symbols definitely need another style and consistency pass, making sure everything is
mathematically, optically, and visually accurate first". The references (Georgia Pro, Serrif, PP Kyoto; the study
`build/refstudy/spec.md`) are a sanity range, never a target: each rule below is stated in Area's own parts. Census of
all 147 non-letter glyphs of the Regular (`build/owner8/sym/census.py`: advance, sides, ink box over the x-height, the
line or axis each is centred on or stands on, the strokes across themselves by rays from the outline, straight
strokes by angle, sharp and softened corners, the worst curvature ratio across a smooth node, mirror partners by the
area of their XOR): `build/owner8/sym/census-before.txt` (snap083a), `census-after-stage1.txt`.

The rules (one table for the symbol system):

| | Rule | Glyphs |
|---|---|---|
| Axes | The maths axis (313, the minus's middle) for every sign that is not a letter, a figure or punctuation: operators, arrows, interface signs, geometric shapes, ~ ≈ ∞. The dash line (278) for hyphen and dashes; the baseline and cap height for the letter-like signs | |
| The + box | The minus's width (424; 94 to 518 in the maths' 612 advance) is every operator's width; the + is that square | + − ± × ÷ = ≠ < > ≤ ≥ ¬ ~ ≈; ∞'s height |
| Arrow | Length twice the axis (626, so ↑ stands on the baseline); one head: arms 240 along their centrelines at 45 degrees off the shaft; every arrow that one turned or turned over, whole; ↔ ↕ the single arrow plus one head's depth (the shaft between the crotches the single arrow's shaft) | ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ ⇤ ⇥ ⌃ |
| Key box | 0.80 cap (570) tall, centred on the axis | ⌘ ⌥ ⇧ ⇪ (the erase keys 0.80 of it), ⌃'s point at its top, ✓ centred |
| Shapes | The circle is the key box; the square's area the circle's; the pointed shapes' 0.70 of it; triangles centred half way between their box's middle and their centroid; the small triangles 0.55 | ● ○ ■ □ ▲ ▼ ▶ ◀ ▴ ▾ ▸ ◂ ◆ ★ ☆ |
| Letter-like signs | Baseline to cap height (and the operators' descent, -0.25 cap, for ∏ ∑), the capitals' weights | ∂ ∆ ∏ ∑ ◊ # € and the currencies |
| Reference marks | One arm: from the asterisk's centre (521), 22 where it leaves, swelling to a round end of 78, the asterisk's length (200); the dagger's lower arm down to the baseline's overshoot; the double dagger's second crossing the first's mirror about half the cap | * † ‡ |
| Weights | The plain stroke (the minus, 52) in every straight sign; the check 1.25 of it; the radical's thick 0.96 of the stem; the curved maths signs the damped upright stress, 47 level and 57 upright (52 on average); the letter-signs' strokes the case's hairline (47, 43), their level bars H's crossbar (49); the fraction bar 48 level | |
| Ends and corners | A plain stroke's free end cut square, both corners on radius 7 (the letters' cut ends; kept, as the owner chose in 0.79); a meeting stays sharp; a vertex's outside a flat 0.42 of the stroke across the bisector (✓, the radical's foot); a chevron's point an upright flat 0.79 of the stroke (< > ≤ ≥ ^); arrow heads and frames mitred | |
| Partners | A mirrored pair is one drawing turned over (the brackets, guillemets, < >, ≤ ≥, ⇤ ⇥, ⌫ ⌦, now ← →, ↗ ↖, ↘ ↙); turned ones the same drawing turned (the arrows, the triangles); ≈ is two ~; ≠ is = and a slash centred on it | |

What broke a rule, and what changed (Regular; census before > after):

| # | Glyphs | Was | Now |
|---|---|---|---|
| 112 | + = ≠ ± ¬ < > ≤ ≥ | + 424 wide, 430 tall; = 412 wide, centred 22 over the axis (≠'s slash 43 over, 20 left of the ='s middle); ± 55 over; ≤ ≥ 26 over; < > ¬ 416 / 414 wide | every one 424 wide, centred on the axis (¬ its bar on it); + 424 square |
| 113 | ~ ≈ | ~ 349 wide (0.82 of the box), on the dash line, 25 to 78 across (thinnest 0.58 hairline), curvature jumps 1.54 (≈ 99: a node's handle collapsed); ≈ two of it 0.75 of their height apart | `signs.tilde`: one period of a sine wave from inflection to inflection, the + box wide (418 after the soft corners), on the axis, wave height 54 (40 degrees at the inflections), each end run on along its edge's tangent and cut square, the damped stress 46 to 52 across; ≈ two on the equals' lines (154 apart); 0 curvature faults |
| 114 | ∞ | two o's (outer sides 72, tops 52), 248 tall (0.58 of the + box), 600 wide | `signs.infinity`: one stroke round a lemniscate of Gerono, the + box tall (424), 1.85 of it wide (784), the damped stress (47 over the tops, 57 at the ends, about 52 through the crossing); nodes at every extreme and the crossing; 0 faults |
| 115 | ^ | 0.35 x-height tall, centred on the axis, arms tapering 35 to 66 | the < chevron turned up (its angle, its upright flat), 0.60 x-height tall, point at the cap height, 52 across |
| 116 | arrows | 490 long (0.94 x-height); level heads 99 degrees, slanted 90; slanted arrows 0.92 of the length; ↔ ↕ the single arrow's length (the shaft between its heads 310); ← not exactly → turned over (arms 51.7 against 52.5: audit_charset error) | 626 long; one 90-degree head; every arrow → turned; ↔ ↕ 728 (shaft between crotches 400, →'s); ← ↖ ↙ the mirror of → ↗ ↘ (MIRRORS); advances → 578 > 714, ↔ 578 > 816, ↖ 407 > 531, ⇤ ⇥ 630 > 766, ↵ 578 > 714 (riser to ↑'s point) |
| 117 | ⌘ ⌥ ⇧ ⇪ ⌫ ⌦ ⌃ ✓ ● ○ ■ □ ▲ ▼ ▶ ◀ ◆ ★ ☆ | key signs on the baseline (⌥ 490 tall where the others are 570), the erase keys centred at 285, the shapes at 343, ✓ at 350, ⌃'s point at ↑'s (558); ▲ 0.56 of the circle's area beside ■ 0.98; ◆ 0.64 | all on the axis; ⌥ 570; ⌃'s point at the key box's top (598); ■ the circle's area (side 505), ▲ ◆ 0.70 of it (▲ 642 wide, 556 tall; ◆ 598); stars on their centre point |
| 118 | † ‡ | a spear to -238 (0.33 cap under the baseline), 1.84 x-heights tall, heaviest (137) under the crossing, ball ends 102 | `signs.dagger`: the asterisk's arm (22 to 78) on a cross at the asterisk's centre; -9 to 721; ‡ crossings at 521 and 191, its upright 50 at the middle; 22 at the crossings, 78 at the ends |
| 119 | √ | the foot a sharp point (0.33 hairline thinnest) | a vertex: a flat 31.5 (0.42 of the 75 thick) across the bisector |
| 120 | % ‰ | figures 25 to 40 from the bar (the fractions keep 66): % 1.06 x-heights wide | set as the fractions (each figure 66 from the bar, level moves only): % 1.22 x-heights (advance 640 > 719), ‰ 885 > 924 |
| 121 | € | its own narrow C (1.04 x-heights) with flat-cut terminals | Area's C and two bars of H's crossbar (centres 0.43 and 0.60 cap, from 0.9 of the capital stem left of the C to 0.66 of its width; struck in the variable font as ₡ is): 1.31 x-heights, advance 655 > 746 |
| 122 | ✓ | its 65 ends sharp (soft_ends stopped at 62: audit_charset error) | radius 7 as every plain end (`charset.SOFT_WIDE`) |

Checked and in rule, unchanged: − × ÷ (dots over the bar's middle), / \ | ¦ _, the dashes, ∆ ∏ ∑ (∏ and ∑ against j are
already opened by the collision pass, ∏ j +132, ∑ j +126: no ink closer than 13), ∂ ∫, the brackets, quotes,
guillemets, ¶ § # © ® ℗ ™ and the letter currencies, ⋯ ⋮ • ∙ °, ◊ (left at 0.55 wide over tall: the frame's rule;
the study's 0.65 is a reference number, not a fault in Area's terms), ✕ (on the axis, 1.1 of the plain stroke by
design). The stage changes no stroke style: maths stay monoline, ends keep radius 7.

What moved (`build/owner8/reg/diffreg.py` snap083a > `build/owner8/sym/b6`): exactly the 55 glyphs above (and € in
the overlap layer); no letter or figure. Kerning: 29 collision keys with € % ‰ and the moved signs (ldot, longs,
jcircumflex). Checks against snap083a: evaluate, even, curvecheck (both), parts unchanged; audit_charset 2 errors >
0 (← and ✓); pathlint 146 > 140 warnings (the old ~ † € handles gone), 27 > 33 info (2.1-degree bends where the ~'s
19-unit end runs meet the wave, whole-unit rounding). Figures: `build/owner8/sym/before-sheet1.png`, `-sheet2.png`,
`s1/stage1-sheet-pair.png` (before over after by family), `s1/stage1-big-1.png`, `-big-2.png` (before beside
after, nodes), `s1/stage1-text.png` (14, 18, 28 and 96 px at 2x).

Looked at, honestly: the arrows now read as arrows beside letters (→ was the length of an x), ↔ is clearly longer
than →; the operators line up on one axis (= and ≤ no longer float); ∞ reads as one stroke; † and ‡ now belong with
*. Not right yet: ▲ ▼ ◆ look large beside ● in a line (the 0.70 area share is a first number); ~ at text size still
reads light and small next to ≈'s pair; ↕ at 728 runs from -51 to 677 (under the baseline); ⌃ high on its own.

### Symbols 2: the gentle taper (the owner's B for the arrows and open keys, A for the closed keys)

The owner chose the study's "gentle taper" and asked for "something very subtle". Built in `signs.py` from the
centreline construction, so every tapered sign is one rule: a stroke from its join A to its free end F is `_Taper`
(w0 at A, a round end of w1 across whose tip is F; each edge one straight line from A ± w0/2 tangent to the end's
circle; every corner two edges meeting, found). Each glyph is one contour whose round ends are drawn on their placed
circles split at every extreme, so every point of the outline is a point of the construction (`corners`), and a master
builds the same points at its own weights: w0 at the master's hairline (o's top over the Regular's, `bold._hair_ratio`),
w1 and the A strokes at the plain stroke's law (`bold.construction_signs`, which now passes both).

| # | Glyphs | Rule (numbers as built) | Before (symbols 1) > after |
|---|---|---|---|
| 123 | → ← ↑ ↓ ↖ ↗ ↘ ↙ (`signs.tarrow`) | B: the shaft from a round tail (w1 60 = 1.15 plain strokes) to the hairline (w0 43) where it runs into the head; each arm from the hairline at the head's meeting to a round end (60); the point cut flat 0.5 w0 (21.5) across its bisector; the skeleton of symbols 1 kept (626, arms 240 at 45 degrees) | 52 monoline, square ends at r 7 > 44.5 to 59 across, median 53; ink area 1.007 of before |
| 124 | ↔ ↕ | the same heads at both ends; the shaft w0 at each head and w1 at the middle, each edge two quadratic quarters meeting level at the middle (a node at the extreme) | 1.032 |
| 125 | ⇤ ⇥ (`kind="bar"`) | the bar at the point a stroke across it: its back straight, its face from round ends (w1) to w0 where the arms' outsides run into it (one contour) | 0.985 |
| 126 | ↵ (`kind="ret"`) | the shaft runs back to a mitred corner and up into a riser to the up arrow's point; the width from w0 at the head to w1 at the riser's round end, linear along the centreline | 1.002 |
| 127 | ✓ (`tcheck`) | both strokes from the hairline at the vertex to round ends; the vertex's outside cut 0.5 w0 across the bisector, its inside a point | 65 (1.25 plain strokes) all along > 44 to 59; area 0.794 (now the family's colour) |
| 128 | ✕ (`tcross`) | four arms from the crossing (w0) to round ends (w1); its ink box kept (394) | 57 > 46 to 60; 0.963 |
| 129 | ⌘ ⌥ ⇧ ⇪ ⌃ ⌫ ⌦ □ ◊ ○ ☆ | A: uprights 57, level strokes 47, slanted ones 47 + 10 sin^2 of their slope (`signs.stress_w`, `stress_frame`, `option`; ⌘'s loops and ○ as rings 57 at the sides and 47 at top and bottom, ○'s outside the circle, its counter an ellipse as o's); outer corners rounded on 7 as the letters' cut ends (`signs.soften`), inner corners (meetings) sharp | 52 monoline > 47 / 57; areas 0.98 to 1.04 |
| 130 | ● ■ ▲ ▼ ▶ ◀ ▴ ▾ ▸ ◂ ◆ ★ | their outer corners soft on 7, so □ and ■ (and ☆, ★) are one family | sharp > r 7 |

Final numbers against the study's starting ones: w0 43 (the hairline, as started), w1 60 (1.15 plain strokes, as
started), the cap's radius 30, the flat 21.5 (0.5 w0), A 57 / 47: the starting numbers held when looked at in lines of
text at 14, 18, 28 and 96 px; nothing was nudged. At 14 to 28 px the change is below a pixel (the signs keep their
colour: ink areas within 4% but ✓), at 96 px the arrows' round ends and their thinning into the head read as drawn
strokes beside the letters, and the key frames' upright/level difference reads as the letters' stress, quietly. The
maths operators stay monoline; † ‡ * were made one family in symbols 1 (the asterisk's arm).

What moved (Regular, snap083a > `build/owner8/sym/c4`): the 57 glyphs of both stages (39 in this stage, all signs;
no letter or figure). Advances (symbols 1 > 2): ↖ ↗ ↘ ↙ 531 > 538, ↵ 714 > 717, ⇤ ⇥ 766 > 757, ✓ 573 > 545, ✕ 500 > 494,
⌃ 612 > 626, the key and shape signs 1 to 7 units narrower (their soft corners shorten the ink; sides kept). Checks
against snap083a: evaluate, even, curvecheck (both), parts unchanged; audit_charset 0 errors (its caps-lock rule now
reads A's level stroke, 47); pathlint 0 errors, 146 > 156 warnings: 16 "no node at extreme, t = 0.03" on the four slanted
arrows, where a round end's tangent point stands 2.3 degrees from its extreme (the taper's angle): the end is drawn
from the extreme and `clean.true_joins` turns the 16-unit handle onto the side's line, so the extreme lies half a unit
inside the curve (whole units; not visible). Figures: `build/owner8/sym/symbols-sheet-pair.png` (snap083a over
after, every family), `after-sheet1.png`, `-sheet2.png`, `s2/stage2-big-arrows.png`, `s2/stage2-big-keys.png`
(symbols 1 beside 2, nodes), `text-before-after.png` (snap083a, symbols 1, symbols 2 at 14, 18, 28, 96 px). Census:
`census-after.txt`.

Looked at, honestly: the arrows feel drawn rather than ruled, and ↔'s shaft swells slightly to its middle (reads as a
lens at 96 px; at text size it is invisible); ⇤ ⇥'s bar, thin where the arms run in, reads at 96 px as two short strokes
meeting in a shallow wedge; the check is lighter than it was (by design: 1.25 plain strokes was its own exception).
A is barely visible, as asked: ⇧'s uprights against its level foot are the only place it shows at text size.

### Symbols, full build (all masters), the audits, `build/snap083b`

`AREA_KERN_FIT=1 build.py` (`build/snap083b/build-083b.log`), the audit set by `build/owner8/reg/fullaudit.sh` on
snap083a (`reg/audit-083a2/`) and snap083b (`build/owner8/sym/audit-083b2/`). The masters build the symbols by the
existing rules and the two stages' constructions; they were looked at (`build/owner8/sym/masters-1.png`, `-2.png`: the
tapered and A signs, ~ ∞ † at 300 / 400 / 600 / 800) and not tuned. Three engine fixes were needed to build:
the tapered signs' round ends now take the Regular's arc decisions in a master (`signs._PLANS`: which ends snap to an
extreme, where the arcs are cut), so a master has the Regular's points (the first build stopped on a point-count
mismatch); `bold.construction_signs` picks, among the best-voted placements, the one that lays every point nearest its
corner (soft corners put many points 7 from a corner, and ≤ was left to the engine) and clears the engine's stale
fallback note once a construction replaces it (↕ was listed on a fallback it no longer had); ~ and ≈ are kept as
constructions in the masters too (the engine gave their near-straight quarters an inflection between masters).

What moved against snap083a: the 57 glyphs of the two stages in every master (Light, Regular, Bold; the mid layer
unchanged), nothing else. Kerning refit: `fit_kerning.json` unchanged; the masters' collision keys with the moved signs
only. Fallbacks in the variable font: ® ℗ (Bold), ℗ (Light), as before (↕'s note gone).

| Audit | snap083a | snap083b |
|---|---|---|
| audit_axis Bold: turns, symmetry, thin | ok, ok, 5 glyphs (cedi, ogonek ×2, one.ss01, radical) | ok; ‡ symmetry 0.8 unit at 800 (whole-unit rounding of the arm-sign rule, `arms.master`); thin 4 glyphs (the radical left the list: its foot is a vertex now) |
| audit_axis Light | ok | ‡ symmetry 0.7 to 0.8 unit at 300 |
| audit_rays (300 to 800) | 1 glyph (ʕ), 27,063 places | 1 glyph (ʕ), 28,210 places (the tapered signs have more straight places) |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | the same |
| audit_kern | pass (least 8.3 / 8.4 / 7.9) | pass, the same |
| curvecheck regions Light, Bold | pass | pass |
| curvecheck hooks Light / Bold | 6 / 14 | 6 / 14 |
| interpolation (default layers) | 61 struck glyphs | 62: € is now struck (Area's C and bars), its overlap layer the VF source |

The masters as the rules give them, honestly: at 800 the taper's contrast grows (the free ends take the plain stroke's
law, 1.37, the joins the hairline's, 1.23: 53 to 82 across), so the Bold arrows read more Kyoto-like than the
Regular's; ↔'s swelling shaft is plain at 800; ⌘ (built by the engine from its rings) and ∞ (the engine) grow heavy
at 800, ∞'s right lobe heavier than its left; ⇧'s A frame keeps 57 / 47 times the law. None tuned.

## Regular pass, consistency (0.83, 18 November 2026)

The owner: bring "more consistency, cohesiveness, visual clarity, smoothness, and evenness to the whole glyph set" to
the Regular before any weight tuning. Worked at 400 with `AREA_BOLD=0 build.py` (78 s), each step diffed against the
one before (`build/owner8/reg/diffreg.py`), checked with `build/owner8/reg/checks.sh` (evaluate, even, curvecheck and
`--hooks`, pathlint, parts, audit_charset; `build/owner8/cons/chk-s0` .. `chk-s3`), looked at large with nodes and in text at
14 / 18 / 28 / 96 px (`build/owner8/cons/*.png`, made by `cons/big.py` and `cons/text.py`), committed before the next.
The work list is the read-only audit `build/regaudit/report.md`. The masters were not tuned.

### 0. Symbol follow-ups (the coordinator's check of snap083b)

| Glyphs | Was | Rule | Now |
|---|---|---|---|
| ↔ ↕ | the shaft between two heads swelled from the hairline at each crotch to 60 at the middle: a lens | A shaft with no free end is straight, one width crotch to crotch (`signs.tarrow(shaft=)`, `charset.SHAFT_BOTH`): the hairline (43, the head's join): it reads in text at 14 to 96 px as the same stroke the heads leave, so no other value was needed (48 and 52 not tried) | shaft 43 all along |
| ↕ | the two-headed level arrow turned (728 long): -51 to 677, hanging 51 under the baseline | ↕ keeps the up arrow's extent (2 axes, 0 to 626, centred on 313), the shared head; its shaft between the crotches shortens | 0 to 626 |
| ⇤ ⇥ | the bar at the point 60 at its ends thinning to 43 where the arms run in: a shallow wedge | the bar a straight stroke (`bar_w`, `charset.TAB_BAR`): A's upright (57, the stop's weight beside the arrow's 60 round tail; 52 not tried), half-round ends of its own width, its face upright through the head's point | 57 constant; advance 757 > 771 |
| ∞ | 784 x 424 (the + box's height, 1.85 of it wide): read oversized beside + = < | `INF_H` 0.78 of the + box tall, `INF_W` 1.50 of the minus wide; the stress unchanged | 636 x 330; advance 852 > 704 |
| ▲ ▼ ▶ ◀ ◆ (and the small triangles) | 0.70 of the circle's area: larger than ■ ● in a line | `POINTED` 0.60 (by eye in a line of ■ ● ▲ ▼ ◆ at 18 to 96 px) | ▲ 642 > 590 wide; ◆ 598 > 548 |
| ~ ≈ | mean width along the centreline 49.9 (thinnest 47 over the crests) against the minus's 52 | the damped stress scaled so the mean is the plain stroke's (`TILDE_K` 1.04: 48.9 level, 59.3 upright) | 52 mean |
| † ‡ | arms leaving the crossing at the asterisk's 22: a long arm at 22 read light beside § ¶ * | `DAGGER_W0`: the arms leave at the ladder's least stroke (the branch neck, 32); the round end the asterisk's 78. They did not vanish at 14 px; their colour per advance is the asterisk's (0.148 against 0.150 before the change). ‡'s crossings on whole units (the asterisk's centre rounded), so they mirror exactly | 22 > 32 |

What moved: ↔ ↕ ⇤ ⇥ ∞ ▲ ▴ ▶ ▸ ▼ ▾ ◀ ◂ ◆ ~ ≈ † ‡ (18 glyphs), nothing else; kerning one collision key (ŀ ~ 14 > 15).
Checks unchanged but pathlint's ~ / ≈ bend notes (2.1 > 1.5 degrees). Images `cons/0-big.png`, `0-big2.png`,
`0-text.png`, `0-text2.png`. Still: ~ reads small at text size (it is the + box wide; its colour now matches −).

### 1. Defects (audit list A)

| Glyph | Was | Rule | Now |
|---|---|---|---|
| Ŋ | a detached 55 x 30 piece of the old left foot's serif on the baseline (`eng_capital`'s cut box caught it) | the cut keeps only what hangs under the baseline; pathlint warns on any contour under 3,000 square units (`STRAY_AREA`) | gone; the new check also lists Ⱥ Ⱦ ₩ (their struck strokes' stubs, 1,966 to 2,408: drawn, left) |
| 1 | right white 164.5 against its left 123.6 (fit.py), every pair with 1 among the lightest | the 1 is an upright stroke and shows the same white each side, as I does (`spacing.OPTICAL_MORE`) | 123.6 / 123.5; advance 444 > 403 (¹ ₁ and the fractions follow) |
| ? ¿ | ball 105.2 across, the heaviest in the face | the capitals' round end (`BALL_CAP` 1.10 x 88 = 96.8), the ball scaled about the stroke's top node, the neck's handle with its node (`charset.question_ball`); ¿ is ? turned | 96.8 |
| ! ? ¡ ¿ | the i's dot (116) where . , : ; … carry the period's (124) | one punctuation dot, the period's | 124 |
| ẞ | a 15-unit level step between the lower stroke's foot and the bowl's outer curve | a stroke's foot is one corner (`charset.no_steps`) | the curve leaves the foot's corner |

Not done, honestly: the 6 and 9 curvature (4.56 / 2.51: one solve holding curvecheck and even.py together was not
written); Q's tail root (6.89x; it needs a tail construction); the extended capitals' serifs (88 to 117) and stems
(101 to 103) and the glottal stops' balls (106 to 112): first drawings, to be rebuilt from their base letters.

### 2. Consistency (audit list B)

Not reached in this pass, except the punctuation dot (B11, above). Looked at and left for the owner's call: F's middle
arm 17 under E's (355 against 372) and P's bowl closing 13 under R's: both inherited and both usual in the
references' practice (F's arm lowered because F has no foot to balance it); stated here as the rule until the owner
chooses otherwise.

### 3. Optical ink (Regular)

fit.py first, against the 0 / n / H controls and both references. Moved: the 4 105.6 / 128.7 > 117.6 / 117.7 and the
5 91.9 / 114.7 > 102.9 / 103.7 (both references keep these figures' whites equal; the same rule as the 1). Left, with
the reason: the 3's open left (Serrif's too); U (10.5 right; its sides inside both references), M (8.5 left; inside
both), B +34%, R and S +18%, 8 +17% (two bowls, the letters' structure), 7 -31%, y -22%, v and L -20% (open shapes), a
+13% and g +16% (their own drawings: B3 and B2, not reached). Kerned pairs keep their distance (`rekern`); the full
build refits with `AREA_KERN_FIT=1`.

### Full build (all masters), the audits, `build/snap083c`

`AREA_KERN_FIT=1 build.py` (17 min 23 s, `build/snap083c/build-083c.log`), the audit set by `build/owner8/reg/fullaudit.sh`
(`build/owner8/cons/audit-083c/`) against snap083b's (`build/owner8/sym/audit-083b2/`), and the Regular's checks
(`cons/chk-083c/` against `cons/chk-s0/`, which is snap083b's Regular). The Regular in snap083c is the last
Regular-only build's, glyph for glyph and key for key. The masters build every change by the existing rules; looked at
(`cons/4-masters.png`: ↔ ↕ ⇥ ∞ ? 1 at 300 / 400 / 550 / 700), not tuned.

What moved against snap083b: Regular 41 glyphs (the 18 signs; Eng, ẞ; ! ? ¡ ¿; 1 4 5 and their small forms, tabular
forms and the fractions built from them), the Light 43 and the Bold 49 (the same, with one.tf in both, and in the Bold
the five / four small forms and fractions and glottalstopsmall through the engine), no mid layer, no overlap layer.
fit_kerning.json refit (101 lines in, 61 out: pairs with 1 4 5); kerning keys moved Light 262, Regular 124, Bold 501.
Fallbacks in the variable font: ® ℗ (Bold), ℗ (Light), as before.

| Audit | snap083b | snap083c |
|---|---|---|
| audit_axis Bold / Light: symmetry | ‡ 0.7 to 0.8 unit at 300 | ok (‡'s crossings whole) |
| audit_axis thin (Bold) | cedi, ogonek x 2, one.ss01 | the same |
| audit_rays (300 to 800) | 1 glyph (ʕ), 28,210 places | 1 glyph (ʕ), 27,600 places (the straight shafts and bar have fewer) |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | the same |
| audit_kern | pass, 800 least 7.9, 1,687 under the floor | pass, least 7.9, 1,683 |
| curvecheck regions Light, Bold | pass | pass |
| curvecheck hooks Light / Bold | 6 / 14 | 6 / 14 |
| interpolation | 62 struck glyphs | the same |
| Regular: evaluate, even, curvecheck, parts, audit_charset | | unchanged |
| Regular: pathlint | 0 / 156 / 38 | 0 / 159 / 39: the new stray-piece check lists Ⱥ Ⱦ ₩ (struck strokes' stubs); ₁'s flag bends 14 degrees (0.7 unit, whole-unit rounding) |

In the masters, honestly: ↔ ↕'s shaft takes the hairline's law, so at 700 to 800 it is thin beside the round ends that
take the plain stroke's (the heads' joins do the same: one family); ∞ at 800 keeps its right lobe heavier (the engine).

## Regular pass, letters (0.83, 18 November 2026)

The letter items of the audit (`build/regaudit/report.md`) the consistency pass left: worked at 400 with `AREA_BOLD=0
build.py`, each item built, diffed (`build/owner8/reg/diffreg.py`), checked (`build/owner8/reg/checks.sh`:
evaluate, even, curvecheck and `--hooks`, pathlint, parts, audit_charset; `build/owner8/let/chk-s*`), looked at large
with nodes and combs and in text at 14 / 18 / 28 / 96 px (`build/owner8/let/big.py`, `cons/text.py`; images
`build/owner8/let/*.png`), committed before the next. The masters were not tuned. Every change is a rule in the engine
(`figs.py`, `charset.py`, `parts.py`); no point was moved by hand.

| # | Item | Rule | Before > after (Regular) |
|---|---|---|---|
| 1 | 6 and 9 | `figs.nine_even`: the 9's counter handles, the outer bowl's handles either side of its lowest node under the counter, and those two lowest nodes (level), solved together for curvecheck (aim 1.15, no other fault) and even.py (shelf under 2.3, rate jump under 1.0, mean thickness within 0.6), least change; the 6 the 9 turned half round, point for point (they had drifted apart by up to 18 units of handle) | 9 2.51 > 1.15, 6 4.56 > 1.15, faults 1 / 2 > 0; even.py 2.6 / 2.4 > 2.4 / 2.4 (jump 0.4 / 0.5 > 0.5); ⁶ ⁹ 5.22 / 2.47 > 1.37 / 1.42; ∂ 4.56 > 1.15. The outer bottom moved 5 units left, the counter's 1 right |
| 2 | Q's tail | `figs.q_tail`: the start is a round end of the stroke's own width (54 across), tangent to the straight upper edge, its leftmost where the drawing's was; three arcs at the circle's handle; the underside's inflection on a node; its level top solved for one curvature, the stroke never under 0.9 of the end | 6.89 > 1.17, faults 5 > 0 (an inflection inside two curves and a flat place gone). A first solve without the neck guard made a ball on a neck: withdrawn |
| 3 | extended capitals, glottal stops | `charset.ext_capitals` (EXT_CAPS): a serif slab reaching 80 to 130 from its stem's edge, read by a scan inside the slab, is 77; an upright stem 6 or more over 86 is 86. `charset.glottal_balls`: ?'s ball rule (scaled about the stroke's top), the capitals' 96.8 at cap height, the lowercase's 88 at the x-height, then the nodes evened | heads 90-94 > 77, feet 100-114 > 77 (Ɓ Ɗ Ǝ Ƒ Ɦ Ɥ Ɩ Ƙ Ƥ Ɽ Ƭ), Ƭ Ʈ stems 101 > 86; ʔ ʕ 111.3 > 96.8, Ɂ 105.9 > 96.8, ɂ 110.9 > 88; hook faults (drawn) 41 > 33 |
| 4 | hooked lowercase | `charset.ext_lowercase` (EXT_LOWER): a stem (two upright straight edges, 100 long, facing) between n's stem and 92 is n's; an edge shared by two runs moves once; a foot slab of 74 to 130 is n's 70 | ɦ ɥ ɩ ƥ ɾ ɽ ﬆ ƭ ʈ ʋ c_t s_p 80-83 > 78, Ʋ 103 > 86; ɦ ƙ ɲ feet 78-96 > 70 |
| 5 | shared bowls, B P R, E F | `parts.bowl`: the branch's and run-in's handle at the bowl's extreme solved for the far quarter's curvature. `figs.cap_bowls`: F's middle arm (edges and beak) on E's centre; P's bowl closing where R's does (lower quarters scaled about the right extremes); B P evened by `even_glyph` | b d p q 1.48 > 1.03; F +17 (355 > 372, its beak 243-466 > 260-483 as E's 260-484); P closes 322 / 369 > 335 / 382 (R's); B 2.11 > 1.10, P 1.22 > 1.12 |
| 6 | curves | `figs.even_glyph` on EVEN_LETTERS: handle lengths only (`loops.even_nodes`) at aim 1.25, else 1.5, else 1.8, kept only where curvecheck's faults do not grow, even.py holds and parts.check's crotches hold | e 2.66 > 1.24, d's foot bracket 4.70 > 1.18, G 1.61 > 1.17, J 2.66 > 1.58, 2's ball neck 1.43 > 1.20 (œ æ ǥ ₂ ² follow) |
| 7 | small alignments | `charset.turned_v`: Ʌ is V turned half round on the baseline; Y and Ƴ read by `ext_capitals` under the arms (`FOOT_ONLY`); `figs.f_foot`: f's right foot n's | Ʌ feet -11 > 0, point 710 > 721; Y Ƴ feet 102 > 77 (Ɏ ¥ follow); f 87 > 70 (every f ligature and ſ follow) |
| 8 | ink | measured (`build/owner8/let/ink8.py`: ink in the x-zone over advance x 520, as the audit's grey) | a +12.9% and g +15.7% over the lowercase mean before and after: the curve work did not touch their weight (a's evening was refused, g was left). Not adjusted |

Tried and withdrawn or left, honestly:
- 1: the earlier one-sided solves (even_nodes alone; even.py alone) were not used; the joint solve holds both.
- 2: the first q_tail chose, among three starts, one whose end swelled into a ball on a neck; the 0.9 stroke guard
  removed it.
- 5: R's evening (2.00 > 1.01) broke even.py's limit (2.7 > 4.3): R is left at 2.00 / 1.86. b and p's thickness stray
  rose 3.0 > 3.4 (audited, no limit for the constructed bowl). The first F move left the arm's beak behind (a lopsided
  bracket, evaluate's lopsided count 3 > 7); the second moves the whole arm.
- 6: a (3.74) and r (2.18): every evening that cures them moves their crotch off parts.check's neck (r 29.4, a 24.5) or
  leave, so both are left; U's evening raises its worst ratio (1.01 > 1.20); g left (its Regular handles feed the
  masters' `g_ear`); R as above. J's evening leaves two lopsided quarters (handles 0.46 / 0.78 and 0.38 / 0.67).
- 7: r's long foot (131) kept by eye (`7-feet-trial.png`: shortened, the r stands on a stub with a hole after it);
  y's tail (-209) and μ (-193) left: their depths are rules (round_tail keeps y's, `MU_DESC` 0.86 of p's from the
  references); Œ's seam (3.01) and c_t's link (infinite): `even_glyph` cannot reach either without a new join
  construction.
- 4: ɗ ᶑ ɠ keep 81 (their stem's inner edge is the counter's, not a straight 100 long); the hooked letters' flags are
  untouched.
- 8: a and g are still the two darkest lowercase letters; a rule (their strokes' weights against n's, or their
  advances) is the next step, not taken here.

### Full build (all masters), the audits, `build/snap083d`

`AREA_KERN_FIT=1 build.py` (19 min 42 s, `build/snap083d/build-083d.log`), the audit set by
`build/owner8/reg/fullaudit.sh` (`build/owner8/let/audit-083d/`) against snap083c's (`build/owner8/cons/audit-083c/`), and
the Regular's checks (`build/owner8/let/chk-083d/` against `build/owner8/cons/chk-083c/`). A first full build was
discarded: it showed F's middle arm moved without its beak (evaluate: a lopsided bracket); `cap_bowls` now moves the
whole arm, and the second build is snap083d. Its Regular is the last Regular-only build's but F.

What moved against snap083c: Regular 97 glyphs (the items' letters and what is built from them: the f ligatures and ſ,
þ Þ ƀ Ƀ Ᵽ, ǥ Ɏ ¥ ₱ ₲ ₽ ₿ ℗ @ ɑ g.ss02, the small 2 6 9, ∂, the fractions as composites), 15 in the overlap layer; Light
106, Bold 124 (with the accented Y's, and through the engine's laws read on the letters ∗ † ‡ " ⌦ ⌫ and five accent
composites), the mid layer 6 (@ ɦ œ ƥ ɽ s_p). fit_kerning.json refit (92 lines in, 87 out); kerning keys moved Regular 1
(ſ ı), Light 755, Bold 222. Fallbacks in the variable font: ® ℗ (Bold), ℗ (Light), as before.

| Audit | snap083c | snap083d |
|---|---|---|
| audit_axis Bold / Light | ok (thin: cedi, ogonek x 2, one.ss01) | the same |
| audit_rays (300 to 800) | 1 glyph (ʕ), 27,600 places | 1 glyph (6: 40.0 > 37.7 at (255, 406), thinner at 800 than at 666), 27,435 places; ʕ cured by its round end |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | the same (g's neck missed, as before) |
| audit_kern | pass, 600 least 8.4, 757 under the floor; 800 least 7.9 | pass, 600 least 8.3, 864 under the floor; 800 least 7.7 (f ł.ss04) |
| curvecheck regions Light, Bold | pass | pass (Bold g.ss02 1.65 > 1.60) |
| curvecheck hooks Light / Bold | 6 / 14 | 5 / 16 (Bold: ɂ an inflection at its neck, s_p a flat place; Ghook, Nhookleft cured) |
| interpolation | 62 struck glyphs | the same |
| Regular: curvecheck, curvecheck hooks (drawn faults) | pass, 41 drawn | pass, 33 drawn |
| Regular: evaluate | jumps 33, lopsided 3 | jumps 27, lopsided 6 (J two quarters, 6 the 9's turned, the 9 as before) |
| Regular: even, parts, audit_charset | 0 errors | 0 errors (b p stray 3.0 > 3.4, 9 2.6 > 2.4, P 1.7 > 2.0, e 1.1 > 1.5) |
| Regular: pathlint | 0 / 159 / 39 | 0 / 157 / 38 |

Not right yet, honestly: the 6 in the masters (one place 2.3 units thinner at 800 than at 666, where the long stroke
meets the counter: the 6 is now exactly the 9 turned, and the engine reads the turned junction differently); the Bold's
hook faults 14 > 16 (ɂ's scaled ball, s_p's evened stem); the items' leftovers listed above.

## Regular pass 2 (0.84), named glyphs and the corner rule (18 November 2026)

The owner reviewed 0.83 and asked for another pass on the Regular (400) only: the ampersand, ~ and ≈, @, ∑, and one
call on sharp against rounded corners. Worked with `AREA_BOLD=0 build.py`, each item built (`build/owner9/s0` .. `s5`),
diffed (`build/owner8/reg/diffreg.py`), checked (`build/owner8/reg/checks.sh`, `build/owner9/chk-s*`), looked at large
with nodes and combs and in text at 14 / 18 / 28 / 96 px (`build/owner9/*/item*-big.png`, `item*-text.png`), committed
before the next. The masters build every change by their constructions and were not tuned. The references (Georgia Pro,
PP Kyoto Medium, Serrif 400) were drawn and measured as examples only (`build/owner9/refdraw.py`, `at/atmeas.py`).

| # | Item | Was | Rule | Now (Regular) |
|---|---|---|---|---|
| 1 | & | the lower bowl met the diagonal at placed points and angles (C2 at 122, 40 degrees; X1 at 92, 32 degrees) while the arm sat on the tail elsewhere, its crotch filleted (0.30 stem): fitted across the crossing, the bowl's edges and the arm's stood 1.3 to 7.1 units apart and 5.4 to 9.5 degrees off; the stroke's width dipped to 33.8 where the bowl ran into the diagonal, troughed 53.3 before the bowl's bottom and rose to 54.5 again, a 0.7 dip where the diagonal turns into the loop; the tail's cut 21 with sharp corners; bottom -9 | `amp.py`: the bowl's two edges turn into the arm's edge lines at nodes hidden inside the diagonal (on its centreline), tangent to them, so the bowl's stroke crosses the diagonal and is the arm; every corner found by intersection. P and Q solved together (`even_ribbon`: each chain's own terms, node curvature weight 30, eases 40, plus the width along each segment from the tail's root over the loop to the crossing moving one way only between its nodes, second difference small); the counter's bottom 8 right of the outside's (`lb_di`: 0 left the trough, 8 the least of 8 and 16 that clears it); the crotch under the arm sharp; bowl and tail on o's -10; the tail's cut the serif tip (30, `TAIL_CUT`, joins.END_MIN) with both corners on 7 (`soft_cut`) | each edge 0.14 to 0.60 units off its one curve through both crossings, 0.12 to 0.77 degrees at the corners (whole-unit rounding; the hidden nodes exact: 0.000 degrees); width extremes only at the nodes (74 diagonal, 43 loop top, 62.5 loop right, 43 spine, 82 bowl's left, falling to 39.4 at the arm), fastest change 0.18 (swell.py; S 0.50, 8 0.35; was 0.28), max second difference 0.72 at the spine's rise; curvecheck 0 faults, worst 1.13; advance 810 > 809 |
| 2 | ~ ≈ | one sine period, height 54 on a 348 wave: 44 degrees at the inflections, crest radius 57 (1.16 strokes), 157 tall | `charset.TILDE_SLOPE` 32 (signs.tilde `slope`): the wave set by its slope, its height following from its length; the stress scaled so the mean width along the centreline is the minus's 52 (`tilde_k`, 1.0705); + box wide, ≈ two on the equals' lines, ends square, corners 7. 28 and 35 measured (crest radius 105 and 79, 2.06 and 1.58 strokes); 32 looked at in text | height 34.7, crest radius 89 (1.76 strokes), 120 tall; colour per unit of run 54.3 against the minus's 51.9 (was 58.5) |
| 3 | @ | the ring the references' 0.968 of its height wide, the a with 1.24 times more white right of its stem: rays from the centre read the white to the a 213 to 245 per mille of the height on the right (most at 20 to 30 degrees), 187 to 196 over the top, 189 at the left; ring exponent upper right 2.38 (references 2.50 to 2.80) | `at.EVEN_WHITE`: each side's white the white over and under the a, so the ring's width follows from the a; ring thickness one law, the letters' upright stress (hairline 43 at top and bottom to 67 / 59 at the sides, as o; monoline would leave the @ alone among Area's rounds); the rise of the right extreme (0.107) kept: 0.05 and 0 broke the curvature at the a's foot (1.28, 2.71) | 816 wide (0.943 of the height), advance 960 > 939; white 183 to 223 per mille all round; curvecheck 0 faults, worst 1.19. A 2 to 3 unit thinner place 25 degrees off the top (47 against 50 per mille) came with the narrower ring |
| 4 | ∑ ∏ | ∑ top bar 46 (E's arm), bottom bar 70 (0.90 of n's stem), upper diagonal Z's (89 across), lower A's thin (49); ∏ bar 56 (1.15 of H's crossbar), feet H's | E's top and bottom arms are both 46 (`balance.CAP_ARM`): both ∑ bars and ∏'s bar take it (`sigma.KIND`, `charset.maths`); Ʃ had it already | ∑ 46 / 46, ∏ 46. The owner's question: the top was not thicker by its bar; the thick diagonal joining it in a wide dark corner made it read so |
| 5 | corners | free ends r 7 on letters and signs (already one number); vertices: arrows 21.5, < > ≤ ≥ 41, ^ 41, ✓ 21.5, √ 31.5, ∑ 11, Ʃ and ∆ sharp, ⌃ mitred then softened | one rule (`signs.LETTER_FLAT`, `LESS_FLAT` 0.630, `charset.TAPER_FLAT` 0.762, `vertex_flats`, `sigma.KIND` flat 0.42, `signs.soften(keep=)`): free ends r 7; a vertex the letters' apex flat, 0.42 of the class's stem (v w 33, A V W M N 36), the inside a point; inner corners sharp; solids r 7 | arrows 32.0 to 32.8, < > ≤ ≥ ^ ⌃ √ ✓ 32 to 33, ∑ Ʃ ∆ 36; census and exceptions `build/owner9/corners/corners.md`, sheets `contact-vertices.png`, `contact-ends.png` |

The owner's three questions. ≈ before (the review page's 0.82 outline): `snap082i`'s ≈ is truly what 0.82 shipped, not a
drawing error: two contours of 26 points, each a Baskerville swung tilde 348 wide (0.82 of the + box), its two ends
turning up to upright and cut level (24 across, a hairline end), so it reads flat-cut, hooked and narrow. ∑'s top: see
item 4. Arrow tips: cut, not sharp and not round: the letters' vertex flat (33), the same corner as v's point; the
tapered arrows keep their round free ends (the owner's taper).

Withdrawn or left, honestly: the @'s rise at 0.05 and 0 (curvature); the &'s loop keeps a 0.7-unit dip where the
diagonal turns into the loop (74.3 > 73.6 > 74.0; two weightings tried); the & crossing's corner X1 reads 0.77 degrees
(the 0.5 target) from whole-unit rounding of the corner; the @ ring's thinnest place sits 25 degrees off the top; ~ and
≈ in the Regular now carry curvecheck reports: a 7.86 ratio across the middle inflection between radii 1442 and 11335
(both edges nearly straight there; the fitted edges' end curvature is not matched) and a 3-degree bend where the
19-unit end run meets the wave (whole-unit rounding; pathlint warns 6 times); the ∆'s flats narrow its ink (advance 608
> 585).

### Full build (all masters), the audits, `build/snap084a`

`AREA_KERN_FIT=1 build.py` (18 min 57 s, `build/snap084a/build-084a.log`), the audit set by
`build/owner8/reg/fullaudit.sh` (`build/owner9/audit-084a/`) against snap083d's (`build/owner8/let/audit-083d/`), the
Regular's checks (`build/owner9/chk-084a/` against `build/owner8/let/chk-083d/`).

What moved against snap083d: in the Regular, the Light and the Bold exactly the same 29 glyphs (& @ ~ ≈ ∑ ∏ Ʃ ∆ √ ^ <
> ≤ ≥ ⌃ ✓ → ← ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ ⇤ ⇥), the mid layer & and @; advances & 810 > 809, @ 960 > 939, ∆ 608 > 585, ↖ ↗ ↘ ↙
538 > 542. Kerning keys moved: Regular 2 (ŀ with ↖ ↙), Light 71, Bold 129. Fallbacks as before (® ℗ Bold, ℗ Light).

| Audit | snap083d | snap084a |
|---|---|---|
| audit_axis Bold: turns | ok | ~ ≈ an inflection at 751 (the wave's near-straight quarters between the Regular and the Bold) |
| audit_axis Light: turns | ~ ≈ at 344.9 and $ at 314.6 | $ at 314.6 only |
| audit_axis thin, the rest | cedi, ogonek x 2, one.ss01; ok | the same |
| audit_rays (300 to 800) | 1 glyph (6), 27,435 places | 2 glyphs: 6 as before; @ thicker at 300 / 350 than at 400 by 2.6 units at (714, 140), where the ring leaves the a's foot (the narrower ring in the Light), 27,425 places |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | the same |
| audit_kern | pass (600 least 8.3; 800 least 7.7) | the same |
| curvecheck regions / hooks, Light and Bold | pass; 5 / 16 | the same |
| curvecheck on the rebuilt glyphs (Light / Regular / Bold) | & 0 / 0 / 1 (2.07) faults; ~ 2 / 0 / 3 | & 0 / 0 / 0 (worst 1.15); ~ 2 / 4 / 2 (Bold worst 1.49 > 1.05) |
| interpolation | 62 struck glyphs | the same |
| Regular: evaluate, even, curvecheck, parts, audit_charset | | unchanged |
| Regular: pathlint | 0 / 157 / 38 | 0 / 162 / 33 (the ~ ≈ end bends, above) |

## Regular pass 2 (0.84), placement (19 November 2026)

The owner's round 9 asked for every glyph's placement to be exact. A census of the Regular (`build/owner9/place/`:
`census.py`, `composites.py`, `report.py`) listed 125 plain placement errors (list A) on snap083d (the same 125 on
snap084a). This pass fixed them in the engine, by rule, in the order asked; each step built with `AREA_BOLD=0`
(`build/owner9/place-fix/r1` .. `r6`), the census rerun on a copy of its scripts (`build/owner9/place-work/`), the
glyphs looked at large, before (red outline) over after (black), and in a line of text (`build/owner9/place-fix/img/`,
`pairs.py`, `text.py`). Items 2 to 6 were checked together in r4 to r6 and committed one by one after. Lists B (sizes)
and C (ink) were not touched (B lost one entry by the way: a's bottom stroke).

| # | Item | Was | Rule | Now |
|---|---|---|---|---|
| 1 | capital marks, marks on anchors | 64 capitals with the lowercase marks (dot 112 at 794 against Ċ's 94 at 787; caron and acute 759 against 780); Ḟ's dot 735; J́'s J at (7, 14) (derive scaled the unencoded composite as a "base" glyph) with its acute at 801; the capitals' dot below 4 under its anchor (BELOW -219), Ợ Ự 14; 83 first marks off their anchor (Ǽ (-7, 2), Ĵ (-5, -21), Ǵ Ḱ Ḿ Ǹ Ṕ 19 up, ǻ 29, 50 by one unit); 34 marks 3 to 6 from MARK_X inside its 6-unit band; ɑ's marks 35 to 37 left of a's rule | `charset.case_forms` (a capital's marks above in their .case form, the first on CAP_MARK_Y at the x it stood, `restack` STACK_GAP 13 over it, centred: the Vietnamese capitals' rule); marks below one form for both cases (the dot below dotbelowcomb's, -215 on its anchor); `marks_on_anchors` (after every mark rule the first mark above and below exactly on the letter's anchor, BOTTOM_ANCHOR 4 for H and s too; a drawn ring-and-acute's anchor where its letters put it); `MARK_BAND` 1; `derive.klass` (an unencoded accented letter is its letter's class); `alternates._body_cx` (the body from the bowl's left extreme, not the scan at 260) | 0 capitals with lowercase marks; J́ at (0, 0), acute.case at 780; marks off their anchor: only ĥ ḱ (by MARK_DROP's rule, below); audit_charset's marks worst 6 > 2 |
| 2 | glyphs off their line | ɋ 518, ﬆ 536, π -3, ʌ 531, a æ ⱥ -9, ɓ -11, ﬁ ﬃ 519, Ə 722, % 735 / -13, ‰ 770 / -5, ¦ 732 | `balance.zone_lines` (a level edge within 2 of a flat line, a round extreme or vertex flat within 1 of a round line, stands on it with its handles; a foot cut within 3 under the baseline on it; ﬆ's s comes down by its overshoot); ʌ is v turned (`turned_v`); % ‰ zeros on the figures' round lines (`percent_fit`, `FIG_ROUND`); ¦ the bar's extent, its gap centred | all on their lines; % 732 wide (719) and ‰ 958 (924): the zeros keep FRAC_GAP from the bar |
| 3 | signs on the axis | ∙ 255 (118 across), · 269, • 280; ▲ ▼ ▴ ▾ 354 / 272 / 336 / 290 (half way between box and centroid); diagonal arrows ±4; ⇧ 311.25 | triangles: the box's middle on the axis. Of 79 faces measured with ▲ and a minus, the serif ones put the box's middle within 0.03 of the height of the axis (Times New Roman +0.020, Literata -0.008), none the centroid (0.14 to 0.28 under); all eight triangles alike. Arrows and ⇧ by their ink, through the recipe's `at` (`_built_mid`), so each master builds them there; · • ∙ on the axis (Georgia Pro, Times New Roman, Source Serif 4, Literata, Newsreader within 5), · ∙ the period's dot; ŀ's dot the middle dot at no offset | all within 0.25 of 313 |
| 4 | brackets | ( ) -176 / 767, [ ] -137 / 758, { } -137 / 767 | `charset.bracket_extent`: one top 767 (four of six), one bottom -164 (Georgia Pro's bottom-to-top ratio, -160 / 748, on 767; its ( [ { stand within 12 of each other); [ ]'s arms move whole, ( { scaled upright; the right forms mirrored | all six -164 / 767 |
| 5 | quotes | ‘ 55 / 57, 249, top 808; ’ 63 / 52, 252; “ 55 / 58, 435; ” 63 / 52, 436; ‚ „ their own drawing (-147 to 105); ʼ a smaller drawing | `_turn_pair` (‘ is ’ turned, sides swapped, top on ’'s), `_double` (a double is two singles at the single's sides and height; “ takes ”'s gap), `low_quote` (‚ is the comma, its sides kept), ʼ is ’ | ‘ 52 / 63, 252; ” “ 436; every quote top 809; ‚ the comma (advance 257 > 274, „ 433 > 450) |
| 6 | sidebearings | H 54 / 56, I 53 / 54, 0 61 / 60, . … · ' " ° the bar ¦ * ¤ ⁰ ₀ 1 apart | `spacing.symmetric_sides`: a drawing that is its own mirror within 1.6 (outline sampled, closing segments included) gets equal sides, the outline moved by whole units, an odd total gaining a unit; its accented letters follow; run after spacing (so Ħ Ɨ and the rest are built on the centred letter) and again before `finish` | all equal; advances +1 on I (and its 17 accented forms, IJ) 0 0.ss05 0.zero . … · ' " ° the bar ¦ * ¤ dieresis dotaccent dotbelow macron.case |

Withdrawn after the full builds (both made the masters worse):

- The head serifs on i's line (n m p r eng ɲ ᵽ ɍ ɦ's flag 529 > 530, ɽ 516 > 530, `balance.flag_line`). With n's corner
  on 530 the masters' height pin read n's and m's arch differently: the Bold's counter top 464 > 469 (the arch 5
  thinner), the Light's 490 > 487; audit_bold lost two level strokes; r's ball (528) left the pin and rose to 534 in the
  Bold; ɽ took a 1.26 curvature fault in the Bold. Kept at 529 (and 516) until the pin tells a flag corner from an
  arch's overshoot, or i's family takes 529 (not tried in a full build).
- The primes on the quotes' top (802 > 809): the masters stopped growing them (Bold ′ 102 across as the Regular's, it
  was 156). They keep 802.
- ◀ ◂ as ▶ ▸ turned over (MIRRORS): the rotated triangles stand on half units and audit_charset failed the mirror by
  rounding.

What the census still lists (40 on snap084b; `build/owner9/place-084b/report.md`). report.py prints 21 of its A
entries as fixed text whatever the font measures; `build/owner9/place-fix/fixed.py` measures them on the TTF:

- Fixed, though the text stays: J́; "0 capitals carry lowercase marks" (an empty finding); ’ ‘ spacing; brackets; ∙;
  ↖ ↗ ↘ ↙; ▲ ▼ ▴ ▾; · •; ʼ; ⇧; ‚ „ as the comma.
- Held for the weights stage (as briefed): the four variable-font entries.
- Left, with reasons: high quotes, the primes at 802 (above); ◀ ▶ / ◂ ▸ one unit apart (half units, above); one.tf
  two.tf three.tf a half unit off centre and Î Ǐ 19 / 20 (an odd ink width in an even advance, or the reverse: whole
  units cannot centre it); ≈ and ~ 96.4 to 515.6 (the wave is solved to the minus's width, 424; soft_ends trims its
  end corners after, 2.4 a side: not changed here); ◆ 49.75 / 50.5 (its points on half units); o 45 / 46 (its outline
  is 2.7 from its mirror by the closing-segment sampling, 1.55 by the census's: not read as symmetric, not moved);
  y and ɏ at -209 (below); @ 701 (at.py's box, 0.985 of the cap from the references); ¡ 523 (¡ is ! turned in the cap
  zone, -9 to 721, as Georgia Pro and Libre Baskerville set it; 523 is the stroke's cut end, not a zone edge); ĥ ḱ 19
  over the anchor (MARK_DROP raises the dropped marks' anchors for the x-height letters and keeps an ascender's mark
  where it was: one anchor cannot serve both); n m p r eng ɲ ᵽ ɍ 529 and ɽ 516 (withdrawn, above).

y's tail. The tail rule (`loops.round_tail`, 0.81) keeps "ball, depth, stroke and reach": it does not choose y's depth,
it inherits the drawing's (-209). Every reference measured puts y's lowest point with j's and g's (Georgia Pro p j g y
all -217; Literata, Lora, Newsreader, Source Serif 4, Libre Baskerville y = j). So -209 is not intended by the rule;
it was not changed here.

### Full build (all masters), the audits, `build/snap084b`

`caffeinate -i build.py` (23 min 28 s, `build/snap084b/build-084b.log`; the third full build of the pass, the first
two in `build/owner9/place-fix/snap084b-first`, `-second`), the census on it (`build/owner9/place-084b/`), the audit
set (`build/owner9/audit-084b/`) and the Regular's checks (`build/owner9/chk-084b/`) against snap084a's.

| Audit | snap084a | snap084b |
|---|---|---|
| placement census A / B / C | 125 / 13 / 8 | 40 / 12 / 8 |
| audit_axis Bold, Light | as 084a | the same |
| audit_rays (300 to 800) | 2 glyphs | the same 2; a, ae, & thinnest at 300 within 0.6 |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | the same |
| audit_kern | pass; under the floor 84 / 121 / 286 / 864 / 1683, least at 400 8.3 | pass; 80 / 109 / 280 / 842 / 1670, least at 400 9.3 (new under 13 at 400: f‘ f“ 11.0, ‚j „j 12.5, f] 12.9, aogonek.ss03 ) 12.1) |
| curvecheck regions / hooks, Light and Bold | pass; 5 / 16 | the same |
| interpolation | 62 struck glyphs | the same |
| Regular: evaluate, curvecheck, parts | | unchanged |
| Regular: even | a 2.0 | a 1.9 |
| Regular: curvecheck hooks | 30 parts on 28 glyphs, 33 faults | 29 on 27, 33 (ʼ is now ’, a composite) |
| Regular: audit_charset | 0 errors, marks worst 6 | 0 errors, marks worst 2 |
| Regular: pathlint | 0 / 162 / 33 | 0 / 162 / 29 (the diagonal arrows' bends gone) |

Glyphs changed: Regular 392, Light 339, Bold 335; in the masters 12 outside the Regular's set, each following a
Regular change (the dot below and ogonek offsets as the dot and a moved, ª from a, the Light's .tf zeros one narrower).
Advances changed in the Regular (46): I and its 17 accented forms, IJ, Istroke +1; 0 0.ss05 0.zero . … · ·.loclCAT
' " ° | ¦ * ¤ dieresis dotaccent dotaccent.case dotbelow macron.case +1; ‘ ʻ 249 > 252, “ 435 > 436, ‚ 257 > 274,
„ 433 > 450, ʼ 174 > 252, % 719 > 732, ‰ 924 > 958. The masters' follow (and ʌ, ﬆ, ∙, the Light's ⁰ ₀ by a unit or
three). Kerning was not refit.

## Regular pass 2 (0.84), &, ~ ≈, @ second pass (19 November 2026)

The owner was not satisfied with the first pass on these three ("still near 45 degree diagonals ... the inside seems a
bit sharp"; the ampersand "not smooth, the stroke doesn't look continuous through the bottom intersection, the thicks
and thins are not even/gradual"; the @'s "right side appears to protrude more"). A read-only audit measured them
(`build/owner9/stroke/`, `special.py`); its scripts were the acceptance test. Each glyph built with `AREA_BOLD=0`
(`build/owner9/pass2/r1` .. `r5`, `fast.sh`: diff against r0 = snap084b's Regular, the Regular's checks), looked at large
with nodes and combs and in text (`build/owner9/pass2/{tilde,at,amp}/`), its masters checked by its own construction on
snap084b's Light and Bold letters (curvecheck, `amp_masters.py`), committed before the next.

| # | Glyph | Target | Before (0.84b) | After |
|---|---|---|---|---|
| 2 | ~ ≈ | slope at the inflection 20 to 25 | 31.7 | 23.0 (22.5 set; 20 read as a dash at 18 px, 25 steeper than needed at 96: `tilde/slopes-text.png`) |
| | | edges true parallels, stress at most as before | stress 47 / 57 scaled; edges offset per span | one width 52 (`TILDE_STRESS` 0), each edge the centreline's parallel, quarters G2 at both ends (`signs.wave_sides`) |
| | | inside radius at crest and trough at least 62 | 34 (centreline 71 / 76) | 131 (centreline 160, outside 189) |
| | | no tangent break over 0.5 degrees | 2.95 (the end run) | 0.21 (no run: the ends are the wave's inflections) |
| | | one sign change per edge, no bump | one; curvecheck 4 faults (7.86 across the middle) | one; curvecheck 0, worst 1.012 |
| | | ≈ white normal to the strokes, spread under 4 | nearest 80 to 104 | nearest 90 to 102 (12): **not met**, see below |
| | | ≈ white equal to ='s if operators share a gap | | the rules table puts ≈ on the equals' lines (Symbol system): at the crests 102 = ='s 102 |
| | | mean width the minus's 52; ink the + box | 52.2; 418 of 424 (soft_ends trimmed after) | 52.1; 423.6 (the box solved on the softened ink; corners on 7 in the construction) |
| 1 | & | each edge at both crossings one curve: offset ≤ 0.5, direction ≤ 0.5 | lower: 0.09 to 3.05 units, 0.41 to 2.3 degrees (7.9 apart at the middle) | lower 0.05 to 0.69, 0.21 to 0.68 (2.2 at the middle); upper 0.01 to 0.77, 0.25 to 0.58: **close, not met** |
| | | width in = out (≤ 0.5) | lower 41.3 > 39.2 | lower 39.9 / 40.0; upper (spine) 43.6 / 43.3 |
| | | width law: monotone, even, ≤ o's rate (0.157 per unit) | bowl 82 > 55 (plateau 55 over 80 units) > 41; bowl left 0.265 | 82 > 77 > 70 > 66 > 63 > 61 > 59 > 55 > 51 > 47 > 43 > 40; bowl left 0.165, spine 0.235 (was 0.325): **near, not under** |
| | | the 0.7 dip where the diagonal turns into the loop | 74.3 > 73.2 > 74.0 | 74.2 > 73.2 > 73.8: **not removed** |
| | | curvature: no jump over 1.5 at a node, no flat place | curvecheck 0, worst 1.14 | 0, worst 1.23 (the hidden nodes G2: the ease's two ends, the spine's inflection) |
| | | masters | curvecheck 0 / 0 / 0 | 0 / 0 / 0, and at 0.3, 0.5, 0.7 between |
| 3 | @ | right extreme within 0.03 of the centre | 0.107 | 0.020 |
| | | curvature round the right monotone | 284 / 426 / 351 / 204 (tighten, loosen, tighten) | 416 to 422 from +55 to +5 degrees (within 1.5%), then falling steadily 376, 341, 304, 269, 241, 208 to the foot |
| | | the dive starts lower, radius ≥ 280 where it was 204 | 204 at -40 | the tightening starts at 0 degrees (was +15); about 195 at -35 to -40: **not met** |
| | | thin spot 25 degrees off the top | 41.5 (Regular) | 43 to 47 (none); every master steady to the top |
| | | masters | curvecheck 0 / 0 / 0 | 0 / 0 / 0 and between |

~ ≈ (`signs.tilde(parallel=True, whole=True)`, `wave_sides`, `whole_units`, `_g2_cubic`; `charset.TILDE_SLOPE` 22.5,
`TILDE_STRESS` 0). Each quarter of each edge is one cubic solved for the parallel's own curvature at the crest or trough
and 1/4000 at the inflection (G2 at both ends; 0 at the inflection cannot be told from a kink in whole units). The
whole-unit rounding is a search (`whole_units`: each handle within 2 of its place, a smooth node's two together, a level
extreme's along its axis) for one curvature across every node, no turn back of |k| inside a curve and no handle past
the triangle. The ≈ white: two identical waves a vertical gap g apart are g cos(slope) apart along the normal at the
inflections, so the spread is g (1 - cos 22.5) = 11.7 whatever their weight; under 4 needs a slope under 13 degrees
or two different waves (the upper the lower's parallel: its trough's radius would be the crest's less the gap, 6).
Kept identical (~ is one wave of ≈) on the equals' lines. The combining tilde is its own drawing and did not change.

& (`amp.py`, `bowl_taper`, `even_ribbon` taper, `Chain.fixed` / `dip_w` / `infl_w`, `_round_eases`). The bowl's two
edges run into the arm on an ease: a clothoid (radius 450 at the node on the diagonal's centreline to 2500 at the
arm's line 100 past the diagonal) and its parallel at the arm's width, each one cubic G2 at both ends. Every corner is
still found by intersection (the union of the two ribbons, computed edge by edge, so every master keeps one point
structure). Tried and left (`build/owner9/pass2/amp/`): a node hidden on the centreline G2 into the straight arm (the
bowl's turn bunched into the last 40 units: 3.2 units off), the ease from outside the diagonal (width 39.2 in and
out, but the bowl's rise turned at the diagonal's edge: 1.1 to 2.3 off), the ease in two cubics, radii 300 to 700,
lengths 80 to 150. The remaining 0.69 / 0.77 units are whole-unit rounding of corners and the quadratic each side
reads over 60 units of a curve that still turns. The arm's lower part now curves very slightly into the crossing.

@ (`at.py`: `RISE` 0.02, `DIVE`, `_dive`, `_spiral`, `Ring.mono`, `Ring.tight`; `soft_cut` on the tail). Lowering the
extreme alone broke the foot (1.28, 2.71 in 0.84a); a spiral from the extreme to a foot moved a little lower and right
keeps one curvature down to the a. The dive's tightest (about 195) is where the ring meets the a's own foot curve
(radius 80 to 140): a larger radius there needs the foot 30 to 60 lower than the a's bowl (tried: 450 / 220 put the
a's foot under its bowl with a tight inner hook) or a different a. The tail's cut corners were sharp and are now on 7.
The first full build showed the Bold's @ ring thinning 25 to 40 degrees off the top (39 against 53 at the top: the
inside of the upper right quarter, solved alone, went boxier than the outside once the extreme was lowered; audit_axis
Bold thin, audit_rays). Fixed by rule (`at.construct`: that quarter's inside takes the outside's shares of its reach;
`DIVE["re"]` a share of the ring's half width): the ring now thins steadily from the side to the top in every master
(Regular 60 > 43, Light 51 > 37, Bold 73 > 53). A second @ commit; the build below is the second full build (the first
is kept in `build/owner9/pass2/snap084c-first`, its audits beside it).

Images: `build/owner9/pass2/tilde/` (`slopes-*.png` 20 / 22.5 / 25 big and in text; `item2-*.png` before over after,
combs, text; `masters-approxequal.png` 300 to 800), `amp/` (`item1-big.png`, `item1-text.png`, `item1-crossings.png`
the two crossings at 5x with combs, `profile-before.png` / `profile-after.png` the width along the ribbon,
`masters-ampersand.png`), `at/` (`item3-big.png`, `item3-text.png`, `masters-at.png`). The stroke audit on snap084c:
`build/owner9/stroke-084c/` (`special.md`, `amp-profile.png`, `tilde.png`, `at.png`).

### Full build (all masters), the audits, `build/snap084c`

`caffeinate -i build.py` (26 min 32 s, `build/snap084c/build-084c.log`), the audit set by `fullaudit.sh`
(`build/owner9/pass2/audit-084c/`) and the Regular's checks (`chk-084c/`) against snap084b's.

What moved against snap084b: in every master exactly & @ ~ ≈ (the mid layer & @). Advances: none in the Regular; ~ ≈
in the Light +2 (508 > 510, 610 > 612) and the Bold -2 (510 > 508, 612 > 610): the box is now solved on the softened
ink. Kerning keys moved: Regular 1 (ŀ ~ 15 > 16), Light 22 and Bold 39 (pairs with @ and &; kerning not refit).

| Audit | snap084b | snap084c |
|---|---|---|
| audit_axis Bold / Light: turns | ≈ an inflection at 751 / at 318 | ok / ok |
| audit_axis thin | cedi, ogonek x 2, one.ss01 | the same |
| audit_rays | 2 glyphs (6; @ thicker at 300 / 350 than at 400 by its foot) | 1 glyph (6) |
| audit_bold Bold / Light, audit_kern | as 084b | the same |
| curvecheck regions / hooks, Light and Bold; interpolation | pass; 62 struck | the same |
| curvecheck on the glyph, Light / Regular / Bold / mid | & 0/0/0/0; @ 0/0/0/0; ~ ≈ 2/4/2 | all 0 (worst & 1.23, @ 1.24, ~ 1.03) |
| Regular: evaluate, even, parts, curvecheck, audit_charset | | unchanged |
| Regular: pathlint | 0 / 162 / 29 | 0 / 156 / 30 (the ~ ≈ bends gone; an INFO on @'s inner middle node, 1.0 degree) |

Left, honestly: ≈'s white along the normal (12, a property of two equal waves); the &'s crossings at 0.69 / 0.77 units
and 0.68 / 0.58 degrees (target 0.5); its bowl's fastest taper 0.165 per unit and the spine's 0.235 against o's 0.157;
the 0.7 dip where the diagonal turns into the loop; the @'s dive, about 195 where the target was 280. Not done: no
reference faces were measured this pass (Georgia and the rest are not needed for these targets); the review page and
its tools were not touched; the masters were not tuned, they build by the same constructions.

## Regular pass 2 (0.84), strokes, sizes and ink (19 November 2026)

The two read-only audits on snap084c, the stroke audit (`build/owner9/stroke-084c/`) and the placement census's B
(sizes) and C (ink) lists (`build/owner9/place-084b/`), asked for the Regular's thin strokes, tails, spines, bowls,
diagonals, dots and curve breaks to be put on their rules. Each item built with `AREA_BOLD=0` (`build/owner9/pass3/`
`fast.sh`, runs `i1a` .. `i29`, diff and the Regular's checks against snap084c's Regular), measured with the audit's own
reader (`pass3/tools/meas.sh`), looked at large before (red) over after and in text at 14 / 18 / 32 / 72 px
(`pass3/itemN/big*.png`, `text*.png`), committed one by one. New rules live in `hair.py` (and `loops.tail_law`), run in
`normalize` before spacing and the charset so every derived glyph follows. No reference face was opened.

| # | Item | Was (snap084c) | Rule | Now (snap084d) |
|---|---|---|---|---|
| 1 | thins under the hairline | J's hook 37.5 / 41.4 at its nodes (35.6 at its thinnest), 5's bowl top 41.4, f's hook top 38.8 (and every f ligature, ſ), G 45.3 (40.8 to its right), 6 top and 9 bottom 46.1 (42.3 thinnest), c's and e's lower strokes 54.5 / 51.9 at the node (never at the hairline), C 48.6, 8 48.1 | `hair.hairlines`: the pair of level extreme nodes facing across the ink, found by geometry; the thinnest place within 20 units of the pair (medial balls on both edges) is the class hairline (43; capitals and figures 47); only the counter's node moves, upright, with its handles, the least whole-unit move | thinnest: J 47.3, f 43.3, 5 46.8, G 47.3, 6 9 46.8, c 43.4, e 42.9; C and 8 already within (47.2, 47.1 / 47.4), left. At the nodes (the audit's reading) J 50.5 / 53.8, f 43.8 / 44.7, 5 47.4 / 49.6, G 52.2, 6 9 51.1, c 47.5, e 46.9: the thin place sits between the two extremes (the stress is tilted), so the nodes read over it. Census (level cuts): G 47.1, c 45.7, e 44.9, 6 9 49.1 |
| 2 | tails | y's tail thinnest 33.9 (j 38.6, g 42.5); y and ɏ at -209 (j g -233); balls j 80.7, y 82.4 (a c f 88) | `loops.tail_law`: the ball the round ends' part, 88 (seven points scaled about the neck by 88 over the fitted circle), then `round_tail`, y evened at its top | **withdrawn** after the full build (below): balls stay 80.7 / 82.4; depth and stroke not met |
| 3 | spines | S 99.4 > 95.0 > 101.5; s 81 > 89 off the middle; S +16% ink, $ ₡ ₿ +40 to 47% over the figures | `hair.spines` (one swell, widest at the middle, the class's round widest: O 92, o 82) | **withdrawn** (below); S's ink +13% (`pass3/place-i27`, with the spine rule on), unchanged without it; $ ₡ ₿ not touched |
| 4 | bowls | B's upper bowl 94.1 at its side (P 92.5, R 92.2); 8's sides 79.2 (0 87, 6 9 92.2); R 95.8 at 200 | `hair.bowl_sides`: the widest across a bowl's side within 60 of its right extremes is P's (93.1 by the rule's reading), the counter's extreme moving level | B 94.0 > 93.0 (rule's reading); 8 and R left (below) |
| 5 | diagonals | X thin 42.2 / 43.1 (two halves); x 36.1 / 38.0 thin, 72.6 / 72.3 thick (v 39.2 / 74.3); capital thick 84.7 (K) to 88.8 (N); Z's arms 45 | `hair.diagonals`: a stroke set by balance.diag on the edges in its band, repeated until it reads its target across its parallel edges: every capital thick diagonal the capital stem 86 (A V W M N K Y Z); `z_arms`: Z's arms the capitals' arm 46, the corner sliding on the diagonal. x's and X's halves (39 / 74, 48) **withdrawn** after the full build (below) | by the audit: A 85.7, V 86.4, W 86.3, M 86.1, N 86.0, K 87.8, Y 84.6, Z 84.3 (spread 3.5, was 4.1; by the rule's reading 85.2 to 86.4); Z's arms 46; X and x as they were |
| 6 | dots and commas | i 116, j 118; marks 110 / 112 / 114, dieresis below 110 x 118; capital marks 90 / 94 / 110; ’ head 116.4 against the comma's 123.7 | `hair.dots`: the text dot i's (116) on j and every lowercase dot mark (the dot below holding its depth, -215); the capital marks' dot the dot accent's case form (94); the punctuation dot the period's (124, as before). `hair.quote_head`: ’ is the comma scaled 116 / 124 = **0.935** (the high quotes' head the text dot, the low ones' the period), top 809 and sides kept; ‘ “ ” ʼ follow | i j 116; every lowercase dot mark 116 x 116; capital dots 94; ’ ‘ “ ” head 115.9, box 274 tall (was 264; the comma 293) |
| 7 | curve breaks | ß 17.6 at (411, 250); ə 11.0, Ə 9.4; ɔ 8.1; s_p 14.6; © ® ℗ | `hair.even_more`: the guarded evening (`figs.even_glyph`, handles only, kept only where curvecheck's faults do not grow and even.py holds) on the finished drawings | Ə 9.42 > 6.66, ɔ 8.12 > 1.23, Ɔ 1.93 > 1.74, s_p 14.64 > 8.28 (curvecheck --hooks 33 > 29 faults); ß, ə, © ® ℗ left by the guard; r ɍ's waves, a, r, R, U, Œ, c_t not touched |
| 8 | signs | ↔ shaft 42, ↕ 44 (43); Ƭ's outline ran one 46-unit segment twice | `hair.shafts` (43 in whole units, the moved edge's corners sliding on the heads' inner edges); `hair.seams` (two contours ending in upright cuts on one line: corners squared, one outline) | ↔ ↕ 43.1; Ƭ one contour (pathlint 4 > 2 warnings); the rest of item 8 not done (below) |
| 9 | set-by-set look | | contact sheets at 110 px and text at 14 / 18 / 32 px, eight sets (`pass3/item9/*.png`, `all.png`) | judgement calls listed below; nothing changed by it |
| 10 | build settings | usWin from the default master's head; fsType 4; name "Version 0.810" | `build.all_masters_box`: usWin from the highest and lowest ink over every glyph of every master and layer, the static Regular given the same; fsType 0 (static and variable); `version.BUILD` 0.84 | usWin 1090 / 263 (Ẳ at 800; at 300 / 400 / 600 the font reaches 1019 / 1023 / 1052, -260); fsType 0; "Version 0.840" |

The c's and e's open-tail hints in the masters named the old counter knots by value (46, 43), and the Bold engine's
solve failed on them in the first full build: `bold.open_tail_knots` now reads the knots on the Regular at the start of
`bold_font` (the pair of level extremes at the bottom), so the hint follows the hairline rule.

Withdrawn or not met, honestly:

- **The spine (item 3).** Handle lengths and node moves alone gave S one swell (93.4 at the middle) but the stroke audit
  read new curvature jumps where the spine's curves meet the bowls' counters, 14.9 at (457, 159) and 4.1 at
  (147, 570); with those nodes held to one curvature the spine could not reach one swell (S 94.4 to 96.3, s's widest
  66 units off the middle). The function stays (`hair.spines`), not called. It needs a spine construction (a
  centreline and a width law). S's and $ ₡ ₿'s ink were therefore not brought in.
- **The tails (item 2).** The ball law (j and y at 88, scaled about the neck, y evened at its top) built clean in the
  Regular, but the Bold's y took a 35% flat place in its tail (curvecheck on the Bold failed, `audit-084d-final`):
  withdrawn, `loops.tail_law` kept, not called. y's depth to -233 had been tried before that and withdrawn too: moving
  the tail down whole (its straight edges run on) or stretched upright, the tail rule kept neither the stroke nor the
  curve (thinnest 35 against j's 38 and three curvecheck faults: a 98% flat place, the neck's handles 3.2 degrees off
  one line; or the bottom heavy, 72, against a 31 departure); the inside's lowest point let move right thinned it to
  32. y keeps -209 and its 33.9 stroke: the tail needs its own construction from a centreline.
- **8's sides, R (item 4).** The 8's lower left side 79 is the other side of a diagonal stress (its thick runs 93.7 /
  94.2 along the spine), and the 8 is already 14% dark: making its sides the 0's 87 or the O's 92 would darken it
  further; a judgement for the owner. R's 95.8 at 200 is where the leg leaves the bowl, not the bowl.
- **x and X (item 5).** Each half set to the ladder (x 39 / 74, X 48) built in the Regular (X thin 46.8 / 44.8 by the
  audit, x 39.5 / 37.8), but between the masters X took an inflection in its curve 21 (audit_axis turns at 551.7 and
  372.3), x's nodes left their lines by 1.34 half way (drift) and the Bold x's slanted stroke widened -0.2 per 100 of
  height against the Regular's -2.2 (audit_bold): withdrawn. The crossing rules of the masters (`bold.cross_ends`,
  `crossing_openings`) are written on the halves as they were; moving them needs those rules re-read first.
- **The diagonals' reading (item 5).** The rule reads a stroke across the mean of its two edges; the audit from one
  edge to the other's line. On tapered strokes (K's leg, Z, Y) they differ by 1 to 1.5.
- **a's hairlines** (41.1 at its bottom) not moved: a's lower stroke is `parts.a_join`'s branch (50 over the outer
  edge at the counter's lowest point) and parts.check guards it.
- **Item 8, not done:** ⇤ ⇥ shafts (a tapered stroke cut by the stop bar, mean 50.4 against → 51.3); currency bars 46
  to 49 (each built by its own path: € £ ₫ ₹ ₦ 49, ₺ ₸ 46); ⇧ ⇪ heavy; one.ss01 and Ꞌ ꞌ sidebearings; ɦ ƥ ɽ (80)
  and ɗ ᶑ ɠ (81) stems; ‰'s bar top 752; the stacked marks' gaps (ǖ 96, ǘ 39).
- **Item 9, judgement calls** (no rule changed): ⇪'s underline bar reads heavier than the arrows' strokes; ⇧ ⇪ darker
  than the arrows as a group; ✓ ✕ light beside ● ■; $ ₡ ₿ ₦ ₩ dark in the currency line; the figures' superiors and
  fractions even; the lowercase line even after item 1 (c e lower strokes lighter, f's hook heavier).

### Full build (all masters), the audits, `build/snap084d`

`caffeinate -i build.py` (27 min 30 s, `build/snap084d/build-084d.log`), the fourth full build of the pass: the first
stopped in the Bold engine (c's and e's hints, above), the second carried the spine rule (killed once the stroke audit
read its jumps), the third's master audits withdrew the tail law and x / X (`build/owner9/pass3/audit-084d-final`).
On this one: the stroke audit `build/owner9/stroke-084d/`, the census `build/owner9/place-084d/`, the audit set
`build/owner9/pass3/audit-084d-v3/` (fullaudit.sh) and the Regular's checks `pass3/chk-084d-v3/`, against snap084c's
(`pass2/audit-084c/`, `pass3/chk-r0/`).

| Audit | snap084c | snap084d |
|---|---|---|
| stroke audit entries (lowercase / capitals / figures / punctuation / currency / operators / arrows / interface / extended / accents) | 168 / 65 / 120 / 110 / 57 / 13 / 83 / 48 / 582 / 97 = 1343 | 163 / 63 / 118 / 110 / 58 / 13 / 83 / 48 / 553 / 93 = 1302 |
| thin under the hairline / curvature jumps / like parts odd | 39 / 113 / 24 | 9 (Ω, Ɛ, the hooked capitals' balls: not in this pass's list) / 104 / 17 |
| like parts | B's bowl 94.1; G bottom 45.3; dots i j 116 / 118, marks 110 to 114 (118), case 90 / 94; ’ head 116.4; Z's arms 45; capital thick 84.7 to 88.8; ↔ ↕ 42 / 44 | B 93.1; G 52.2 at its node (47.3 thinnest); every dot one of three (116, 94, 124); ’ 115.9 (the comma x 0.935); Z 46; capital thick 84.3 to 87.8 by the audit's reading (Y Z K, tapered: below); ↔ ↕ 43.0. New: ↔'s head reads 66.7 thickest (60.2 the rest) where its corner moved a unit |
| census B / C | 12 / 8 | 10 / 8 (report.py prints the B and C texts as fixed text; G, the dots, Z, the 6 and 9 are measured above) |
| audit_axis Bold / Light | as 084c | the same (the withdrawn x / X turned X and drifted x) |
| audit_rays | 1 glyph (6) | the same 1; 464 glyphs read (474), 27,380 places |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | the same (with `open_tail_knots`; it failed on c and e without, and on the Bold x with the halves) |
| audit_kern | pass; at 300 / 350 / 400 under the floor 80 / 109 / 280 | pass; 81 / 102 / 271; 600 and 800 as before |
| curvecheck regions, Light and Bold | pass | pass (the withdrawn tail law failed the Bold's y) |
| curvecheck hooks, Light / Bold | 10 + 5 / 7 + 16 | 9 + 5 / 6 + 16 (ɔ Ɔ s_p evened) |
| interpolation | 62 struck glyphs | the same |
| Regular: evaluate, even, parts, audit_charset | | unchanged (even B 1.3 > 1.2; parts A's vertex 36 > 35 with A's thick diagonal at 86) |
| Regular: curvecheck, hooks | pass; 33 | pass; 29 |
| Regular: pathlint | 0 / 156 / 30 | 0 / 150 / 29 (Ƭ's doubled segment and 5's small forms' handles gone) |

Glyphs changed in the Regular: 98 (UFO), 106 (TTF). Advances: Z and its 7 accented forms, Zstroke 617 > 615 and DZ
DZcaron 1386 > 1384 (Z's diagonal 88.8 > 86); ’ ‘ ʻ ʼ 252 > 254 and “ ” 436 > 438, ŉ 876 > 878 (the quote the comma
scaled, its sides kept); f_j 619 > 618 and f_f_j 993 > 992 (the f's hook). Kerning keys moved in the Regular: 87
(the collision passes on the changed shapes). **Kerning was not refit**: the advances moved by 2 units at most and the
side shapes changed only inside the letters (hairlines) or by a unit at the quotes; `AREA_KERN_FIT=1` measures every
pair against the references again for that, which these changes do not call for.

Not done, beyond the withdrawals above: $ ₡ ₿ and S's ink (they wait on a spine construction); a's hairlines; 8 and R
(judgements); ß, ə, © ® ℗'s breaks (the guard left them), r ɍ's waves, a r R U Œ c_t; most of item 8 (list above).
Images: `build/owner9/pass3/item1` .. `item9` (`big*.png` before in red over after, `text*.png` at 14 / 18 / 32 / 72 px;
`item9/all.png` and one sheet per set).

## Regular pass 2 (0.84), spine, tail and diagonal constructions (19 November 2026)

The three rules the strokes pass withdrew (the spine, the tails, x's and X's halves) failed because they moved finished
points and the masters' engine could not follow. Each is now tried as a construction (a centreline and a width law, or
lines and a width) run in the Regular and again in every master on the master's own values. Built with the full build
each time (`build/owner9/pass4/full-i1`, `full-i13`), measured with the stroke audit's reader and
`build/owner9/pass4/tools/` (`sview.py`: before in red over after with curvature combs, node ratios and the width's
extremes per edge; `ink.py`; `refspine.py`, `refsides.py`, `refink.py`: the references measured, numbers only, nothing
saved). Images: `build/owner9/pass4/item1` (S s), `item2` (the tail study), `item3` (x X): `big-*.png` Light | Regular
| Bold before over after, `text-masters.png` at 14 / 18 / 32 / 72 px at 300 / 400 / 800, before over after.

| # | Item | Was (snap084d) | Construction | Now (snap084e) |
|---|---|---|---|---|
| 1 | S s spine | S 99.4 > 95.0 > 101.5 along the spine (two thicks, a thin middle); s 81 > 84 > 89 > 84 > 81; stroke audit: 4 width bumps / dips and 2 thicks off a node on each | `spine.py`: the stroke from the top pair of level extremes to the bottom pair is one ribbon. Centreline: the drawn stroke's medial axis (balls between the stroke's own two edges), a quintic smoothing spline, level through each end pair. Width: the end pairs' own hairlines (kept), one maximum at the centreline's inflection, w = w_end + (W - w_end) sin(pi x / 2) ** 1.5. W = the class's round widest x the ladder's thick-diagonal share, O 92 x 0.949 = **87.3**, o 82 x 0.949 = **77.8**: a diagonal-running curved thick weighs as the class stem (86 / 78) when it carries the round letter's overweight less the diagonal's; the references read S's spine 0.92 to 1.02 of O's side (Georgia Pro 0.965, Source Serif 4 0.921) and s's 0.89 to 0.98 of o's (0.948, 0.909); Area's were 1.047 and 1.086. The shape exponent 1.5: flat at the ends (the hairline runs on into the terminal as the drawing's did for 90 units) and the bowls' sides at 0.85 of the spine (Georgia Pro's left side 0.848; references 0.78 to 0.94). Edges: the parallels at w / 2, each fitted by the outline's own four cubics (nodes at the edge's two bowl extremes and its inflection), handles solved for position and one curvature at each node, the kept terminal's curvature at the ends, a quarter's two handles within 1.5 of each other (evaluate's lopsided), the inflection's handles rounded onto one line. Every master: the same on its own S and s after `s_terminal` and `round_ends`, W its own O / o side x 0.949 (Light 61.7 / 55.0, Bold 148.0 / 138.5) | one swell, S 86.8 and s 77.8 at the middle (Light 61.6 / 54.9, Bold 147.4 / 138.7), falling steadily to 48 / 47 and 43 / 44; no node ratio over 1.15 in any master; stroke audit: S and s no fault (S was the capitals' worst, 6.52). The spine–bowl joins: no curvature jump (the withdrawn rule's 14.9 and 4.1). Ink: S +15.6% > **+10.4%** of the median capital, s -9.5% > -12.8% of the lowercase |
| 2 | j y tails | y thinnest 33.9 (j 38.6), y to -209 (j -233), balls j 80.7 y 82.4 (a c f 88) | `tail.py` (a study, **withdrawn**, not called): a spiral centreline from the straight (curvature rising, piecewise linear) to the ball's centre, the outside's lowest point on -233; width the straight's, THIN 39 at the lowest point, the ball's 88 at the end; the ball a circle (88 x the ball law in a master); the inside the outside's parallel at the law; the neck where that parallel meets the ball | not shipped: j and y keep snap084d's tails (below) |
| 3 | x X diagonals | x thin 36.1 / 38.0, thick 72.6 / 72.3 (v 39.2 / 74.3); X thin 42.2 / 43.1 (A V W M Y 48) | `cross.py`: each stroke a direction and a width, its two sides two lines each one line through the crossing, the four corners where the strokes' sides meet. Widths the class's read on the same font across v's and V's parallel edges (Regular x 74.0 / 39.4, X 85.9 / 47.8; Light 52.4 / 33.0, 63.9 / 38.2; Bold 133.2 / 50.0, 146.1 / 62.8). Of each side's two arm pieces the one facing the top or bottom white keeps its serif end where it was (the serif-end opening, the owner's choice); the direction follows from it, the other side's and the width; the other ends slide along their line at their own height, each bracket's first handle turned onto the line and both kept short of the handles' meeting point (pathlint). Every master the same after the engine and its crossing rules; the mid master (600) takes it at the readings that far along (`cross.mid`: without it the first full build's audit_axis read X's corners 1.41 and 1.23 and x's 1.32 off their sides half way to the Bold). No optical offset of the thin stroke: the rules table has none | x thick 74.4 / 74.2, thin 39.5 / 39.2 (v 39.2 / 74.3); X thin 47.6 / 47.8, thick 86.2 / 85.9; each side's four ends on one line within 0.46 units, its pieces within 0.39 degrees, in all three masters. audit_bold reads each diagonal whole now (one stroke, not two halves: slanted strokes 37 > 34 measured, all on target). x's opening kept (its serif ends facing the whites do not move) |
| 4 | leftovers | | the currency bars one value, `charset.CURRENCY_BAR` = 47 (€ ¥ ₽ ₺ ₩ ₦ ₱ ₭ ₮ ₫ ₹; ₸ keeps T's arm, its lower bar is T's own); ‰'s bar ends on 0 and 712 as %'s, moved along the bar | stroke audit currency bars € ¥ ₩ ₽ ₫ ₹ ₦ ₱ 47.0 (₺ 46.0 across its leaning bars, ₡ 46.6, ₸ 46.0; £ 49 its own drawing); ‰'s bar 0 to 712. The rest of item 4 not done (below) |

**Why the tails were withdrawn again.** In the Regular the construction met everything asked: j and y both reach
-233, balls 88.3 / 87.8 (circle fit), thinnest 39.0 / 38.5, curvecheck clean; the Bold's j and y were clean too (ball
123, thinnest 49). The Light's y was not: its outside from the ball to the lowest point fell and rose again (curvecheck
valley 56%). Every re-weighting of the fit that cleared one master broke another (the outside's two cubics cannot hold
a rising curvature, G2 into the ball and the width law's parallels at once), the Bold y could only be solved by moving
its ball 40 units left of its reach, and at every weight the ball's neck became a narrow pocket (images
`item2/study-*.png`). That is not yet a construction that holds; `tail.py` stays as the study (its docstring records
the state), and the build keeps `loops.round_tail` and the masters' `master_ball`. What it needs next: a third cubic on
the outside (between the lowest point and the ball's side) so the curvature can rise there, and a rule for the ball's
height in a master (the pocket under the ball is the white law's, not a leftover).

**S's and the currency signs' ink.** S came to +10.4% of the median capital (the census's reading), not within 8%. The
spine law alone cannot bring it: even the raised cosine (exponent 2, the bowls' sides at 0.80 of the spine, under every
reference) leaves +9.5%; the rest sits in the terminals (two barbs 38 x 228), which the brief kept. The references put S
between -1.3% and +13.1% of their capitals (Georgia Pro +13.1, Source Serif 4 +1.7; median +9.3). s fell from -9.5% to
-12.8% of the lowercase (its spine 89 > 77.8 by the same law; references s/n 1.005 to 1.076, Area now 1.00): past the
census's 12% line, a judgement for the owner. $ ₡ ₿ were not brought into the figures' range: $ is its own ball-ended
drawing (not built from S), ₡ is C and two strokes, ₿ B and stubs; their bars are already the hairline (47). The rules
table says the dollar's stroke crosses its counters ("A sign's letter through its bar"), ₿'s stubs already stop at the
letter, and ₡'s strokes cross C: none breaks through a counter by rule. Every reference has ₡ and ₿ past its figures
(₡ +22 to +54%, ₿ +38 to +61% of the figures' median; Area +47 / +45%).

**√.** No rule sets its size: the operator box (+'s, 424) and ∑ ∏'s extent (-0.25 to 1.00 cap) are for those signs;
√ is its own construction (`signs.radical`), 0.97 cap tall standing on the baseline. The references' radical is 1.07 to
1.46 cap tall (median 1.29) and goes 0 to 0.23 cap under the baseline: it does read small beside ∑ ∏ ∆, and a size rule
for it is the owner's call; not changed.

Not done (item 4): ↔'s head reading 66.7; ⇤ ⇥ shafts (50.4, a tapered stroke cut by the stop bar); ɦ ƥ ɽ (80) and
ɗ ᶑ ɠ (81) stems (`ext_lowercase`'s stem pairs do not find them: their stems are not two upright lines facing each
other); the stacked marks' gaps; ✓ ✕ ⇧ ⇪ ink; a's hairline (parts.check's join rule holds it at 41.1); £'s bar (49, its
own drawing).

### Full build, the audits, `build/snap084e`

`AREA_KERN_FIT=1 caffeinate -i build.py` (the masters' kerning measured again against the references at their weight,
`fit_kerning.json`), then a plain full build after the tenge was put back on T's arm (`build/snap084e/full-084e*.log`).
Audits against snap084d's (`build/owner9/pass3/audit-084d-v3`, `chk-084d-v3`, `stroke-084d`): `build/owner9/pass4/audit-084e`,
`chk-084e`, `build/owner9/stroke-084e/`, the census `build/owner9/place-084e/`.

| Audit | snap084d | snap084e |
|---|---|---|
| stroke audit entries / glyphs with a fault / like-part comparisons over tolerance | 1302 / 287 / 27 | 1280 / 286 / 25 (capitals 63 > 50; lowercase 163 > 156; currency 58 > 56) |
| audit_axis Bold / Light | as before | the same (no drift: the mid master carries x X) |
| audit_rays | 1 glyph (6) | the same |
| audit_bold Bold / Light | 431 / 432, 432 / 432 | 428 / 429, 429 / 429 (x's and X's diagonals each read whole: 3 fewer slanted strokes measured, all on target; the one miss is g's neck, as before) |
| audit_kern | pass; under the floor at 300 / 350 / 600 / 800: 81 / 102 / 733 / 1733 | pass; 89 / 110 / 732 / 1709, least at 300 10.1 (R Z; was 10.4): the refit moved 519 Bold and the Light's pairs to the nearer reference |
| curvecheck regions and hooks, Light / Bold | pass; 9 + 5 / 6 + 16 | the same |
| interpolation | 62 struck glyphs | the same |
| Regular: evaluate | jumps 27, lopsided 6 | jumps 25, lopsided 6 (S and s one finding each, the curvature sign change at the spine's inflection node) |
| Regular: even, parts, curvecheck, hooks, audit_charset | | unchanged (audit_charset checks the euro's bar against the currency bar) |
| Regular: pathlint | 0 / 150 / 29 | 0 / 150 / 29 (₩'s stray-piece warning reads 2552 for 2480: its bars 47) |

Advances: S and its 10 accented forms 586 > 580, s and its 10 forms 474 > 472 (the bowls' outer extremes come in as the
stroke thins); x, X, ‰ and the currency signs unchanged.

## Regular pass 3 (0.84), owner's visual notes (20 November 2026)

The owner looked at snap084f at the Regular and named eight things that look wrong. Each was read as a part, fixed by
a construction that runs where the glyph is built (normalize, or the master construction for & $ @), judged by eye on
large renders before (red, snap084f) over after and in a text line at 16 / 20 / 24 / 48 px
(`build/owner10/<item>/`, `build/owner10/text-*.png`), and committed one by one. No measuring campaign; no glyph off
the list touched; reference faces not opened. Tools: `build/owner10/tools/` (`zoom.py`, `text.py`, `big.sh`, the
`try*.py` trials on snap084f's UFOs, `renders.sh`).

| # | Item (owner) | Cause | Construction | Now |
|---|---|---|---|---|
| 1 | & bottom crossing: "should not be like this" | the bowl's thin stroke was still turning inside the diagonal (the 0.84 ease, curvature 1/450 at the diagonal's centreline): its edges came out about 17 degrees steeper than they went in, a step and a notch at each corner | `amp.construct` (`THROUGH`): through the diagonal both edges are two straight parallels (from 10 before the lower edge to 10 past the upper, and past where the outside meets the tail's top), at the direction half way between the bowl's own arrival and the arm's; after the diagonal one cubic per edge into the arm's line, handles on the lines' corner, ARM_R x half the turn long (at least 45), the turn at most 10 degrees and ending 50 before v's serif | each edge one straight line across the diagonal in every master; curvecheck on the Regular glyph 0 faults (was 0); the arm above and v's serif as they were |
| 2 | § "rough parts" | four points where the middle loop runs into the S strokes: two notches outside, the counter's two ends | `symbols.section_joins`: a concave fillet of 0.30 the capital stem at each crotch, then every smooth node evened (curvecheck 3 > 0 faults, worst 1.46 > 1.17). Guarded by the masters: the counter's ends rounded (a fillet, or the corner slid along the straight with no new node) sent the Bold § to its upright parts (a node bending 1.6 to 2.5 degrees half way), so they stay corners; `_round_end` is kept for a later pass | outside smooth; the counter's two pointed ends **not done** |
| 3 | $ "thick/heavy, base it on the current S" | its stroke was Libre Baskerville's ball-ended drawing at its own weight (spine some 110) | `dollar.spine_s`: the S under the bar (six crossing edges' one curves) rebuilt by S's `spine.construct`, spine = the zero's side x 0.949 = 82.6, ends and balls kept; cut at the bar, true_crossing again; Regular and every master | ink 1.43 > 1.27 of the figures' median; reads with "$42" |
| 4 | 9 and 6: "slanted too much, more like the single storey g" | one long quarter from the bowl's right extreme to a lowest point at 0.27 of the width (0.81's NINE_QUARTER 0.90, lean 23.5): a slanted line in the middle | `figs.nine_tail`: g.ss02's tail (lowest point at its 0.460 share, each edge upright off the right side and round into the lowest point at g's quarter, handles 0.55); `nine_solve` now also solves the tail's handles | 9 curvecheck 0 faults, worst 1.18 (the solve had failed on the new tail, 2.51); 6 the 9 turned |
| 5 | @ "looks weird still"; a centred, ring more circular | with one white all round the ring followed the a: 0.943 as wide as tall | `at.ROUND`: the ring a circle (width 865 = height); the a centred, side whites 197 (top and bottom 172) | advance 939 > 988 |
| 6 | ½ ¾ % ‰ light | small figures 4 units a side heavier than scaled (stem 54, 1.16 for their size); bar 48 | `charset.SUP_BOLD_FIG` 8 (stem 62, Georgia Pro's 1.33), `FRACTION_BAR` 56, ‰'s lower zeros one advance apart (they ran together) | superiors' ink 0.320 > 0.349 of a figure, ½ 0.84 > 0.94, % 0.97 > 1.09; even in the 16 to 24 px line |
| 7 | B D bottom inside "too steep, extremely thick" | the counter left the stem 98 (B) / 104 (D) over its floor (its top corner turns in 11); unchanged since 0.83 | `hair.bowl_foot`: the stem node one bowl-bottom stroke (47) over the floor, a quarter's upright handle, a level handle meeting the floor's other curve at one curvature | lighter, flatter corner; curvecheck reads the turn off the stem as an ease at 1.00 (as the drawing's own corners) |
| 8 | Æ "larger A" | the A half 326 wide against the E half's 522 (0.62) | `charset.ae_wide`: the leg leans out about the apex to 0.9 of the E half (foot whole, brackets with the leg, crossbar stretched, leg thickness kept across) | A half 470; advance 856 > 1008; æ has no such fault (left) |

Light and Bold were looked at for all eight items (`build/owner10/masters/Light-before-red-after-grey.png`,
`Bold-...`, `text-300-400-800.png`). They hold the change, with these exceptions. The ampersand's lower counter at the
Bold has a flatter floor and a tighter turn into the crossing. At the Light its outer lower left is a little fuller.
The § crotch fillets read as small round notches at the Bold.

### Full build, the audits, `build/snap084g`

`caffeinate -i build.py`, about 27 minutes (`build/snap084g/full-084g.log`), the fourth full build of this pass. The
first stopped in the mid master: it is a sparse layer with no zero (`dollar.spine_s` now takes the spine part way
between the Regular and the master). The second sent the Bold § to its upright parts (`section_joins` is now
guarded). The third passed, but pathlint read the 9's neck handle under its node (`figs.in_triangle` after
hair.hairlines). The earlier builds and audits are kept in `build/owner10/*-first`, `*-second`. Every audit was run
once on snap084f (`build/owner10/audit-084f`, `chk-084f`) and on snap084g (`audit-084g`, `chk-084g`).

| Audit | snap084f | snap084g |
|---|---|---|
| audit_axis Bold / Light, audit_bold Bold / Light, audit_kern, interpolation, curvecheck regions and hooks (Light, Bold) | | unchanged |
| fallbacks | Bold registered, ℗; Light ℗ | the same |
| audit_rays | 1 (six) | 2: **@** thinner at 532.9 than at 400 (51.5 < 56.1 at (212, -12), the ring's lower left: the ring is a circle at the Regular, not yet read through the mid master); **§** thinner at 800 than at 666.3 (45.5 < 48.4 at (124, 462), the upper crotch's fillet). The six is cured by the new tail |
| Regular: audit_charset | (22 errors only because 0.84f's bar is 48 against the rule's new 56) | 0 errors |
| Regular: curvecheck regions, hooks | pass | pass |
| Regular: pathlint | 0 / 150 / 29 | **4** / 155 / 28: the small 6s and 9s (⁶ ₆ ⁹ ₉) cross themselves at the neck under the ball (the tail's tighter neck after 8 units a side); warnings: Æ's outer bracket handle, ⁵ ₅ ¹ handles, ₈ bends 3.5 (all the heavier small figures and the A leg's new lean) |

Left open, honestly: the § counter's two ends (refused by the Bold engine; `_round_end` kept); the four small-figure
crossings, the @ and § rays readings above (each one more build cycle); B's and D's new corner reads as an ease of
1.00 in curvecheck's whole-glyph reading (a bracket's turn, as the letters' own); the Bold ampersand's flatter lower
counter.

## Regular pass 4 (0.84), cohesion against the set (20 November 2026)

Two parts: the three regressions snap084g's audits left (A), and nine glyphs a comparison study found do not sit with
the set (B; the study's sheets and numbers in `build/owner10/refs/`, read as evidence only; the directions are in
Area's own terms). Each item a construction that runs where the glyph is built, judged by eye on large renders
before (red, snap084g) over after and in a text line at 16 / 20 / 24 / 48 px (`build/owner11/<item>/big.png`,
`text.png`; the trials `try*` beside them), committed one by one. No glyph off the list touched on purpose; what a
shared rule carries along is listed. Reference faces not opened. Tools: `build/owner11/tools/` (`renders.sh`,
`dt.py` the largest inscribed circle in bands, `thick.py` audit_rays' reader on a UFO glyph, `atrays.py` the @
construction read across the masters, `secneck.py` the § rule on a snapshot's Bold, `rayat.py` one place's rays on a
variable font, `diffg.py` the glyphs two builds differ in, `stage.py` and `split.py` for one commit per item).

The record's heading the brief asked to rename already read "Regular pass 3 (0.84), owner's visual notes" at HEAD
(c4171070): nothing to rename.

| # | Item | Cause | Construction | Now |
|---|---|---|---|---|
| A1 | ⁶ ₆ ⁹ ₉ crossed themselves (pathlint 4 errors) | the 9's crotch is a 7-unit straight between two corners (figs.nine_tail); made heavier by SUP_BOLD_FIG the tail's edge passed the curve's end and the step turned back | `charset.fold_steps` (in `small_figures`): where the heavier step runs against the scaled one, its first corner where the curve's end tangent meets the next edge, the second dropped | pathlint 0 errors; six, nine unchanged (`diffg.py`) |
| A2 | @ thinner at 532.9 than 400 (56.1 > 51.5 at (212, -12)) | the inside's left quarters solved alone came out fuller than the outside's in the mid master and the Bold (0.64 against 0.58 of their reach): the ring's lower left was thinner in the mid master (50.6) than the Regular (55.2) | `at.construct` (`INSIDE_LEFT`): both left quarters inside take the outside's shares, as the upper right did | on the construction every place rises 400 > mid > Bold (lower left 55.3 > 62.0 > 67.7); the Regular moves a unit or two inside the upper left |
| A3 | § thinner at 800 than 666 (48.4 > 45.5 at (124, 462)) | with the crotches filleted (pass 3) the neck from the counter's pointed end to the left fillet is read; the engine carried the fillet in with the stroke (neck 64.9 at 400, 45.6 at the Bold; the right one 85.7) | `symbols.section_necks` (`bold.bold_font`): towards the Bold each end of the left fillet slides back along its neighbouring curve's own tangent (its fillet-side handle with it) until the neck is the Regular's (SECTION_NECK 1.0): a wider, shallower fillet. First shipped as the fillet moved out whole; the first full build's audit_axis read an inflection in the stroke above it between the masters (622.7), so it was redone (also tried: with the curves either side following, the left side bulged; the counter's end slid back, an inflection in the counter; the branch law 1.22, a 34-unit move) | the Regular's § and `section_joins` untouched, so no fallback; at the Bold the left crotch is a shallow scoop where the right stays a notch; audit_rays clear |
| 4 | « » ‹ › small and light | Libre Baskerville's chevrons, 50 across both arms, top 407 | `charset.guillemets`, `signs.guillemet`: v's diagonals (down arm 74, up arm 39), the vertex flat, ends level at 0.96 / 0.08 x-height, run 0.38 of the height, « 0.40 apart; a construction in every master at v's laws | ‹ 255 x 457 (advance 308 > 383), « 438 x 457 (463 > 566); › » turned over. The first full build's Bold « had its chevrons touching at the foot: the gap now grows by what the thick arm gains level |
| 5 | figures uneven | the 7's diagonal 46.6 across (a capital thin) | `balance.seven_diagonal`: 0.955 capital stems (82), the inner edge out parallel | 7 82.1; 2's spine and 3's bowls already 92.0 / 92.2 at their thickest (dt.py): left; 0 not plainly light in "0123456789": left. In the first full build the Light's thinner diagonal ran the outer top corner over the bar (718): `symbols.seven_end` slides it down the edge to the Regular's share of the bar in such a master (the Light's 7 ends 689) |
| 6 | small figures' weight-for-size | (check) | none | ¹ ⁴ stems 62 = 0.54 x 86 + 16, ² ³ curves 65 to 66 = 0.54 x 92 + 16, ² base 55 = 0.54 x 73 + 16: one law; no change |
| 7 | † ‡ thin and short | the asterisk's arm (32 swelling to 78) on a cap-height upright | **withdrawn** (reverted, a70956bf). Built: `signs.dagger` with separate upright and arm weights, `charset.dagger_info` (upright 78 from a round head on 780 to the crossing, tapering to a 43 foot; arms 50 to 54; straight sides as lines). Both full builds' audit_axis read a turn in ‡ between the masters: the engine moved each round end's tip node off its handles' line (Bold head 12 under, foot 11 under; Light foot 5 over). The fix (`symbols.level_tips`: a node between two level handles back onto their line) clears it on snap084h's masters, but no build was left to prove it in the pipeline | the daggers are snap084g's in the code; build/snap084h was built with item 7's. Patches for the next pass: `build/owner11/i07/retry` (the construction, its follow-up, level_tips) |
| 8 | ð stopped at 736 | the drawing's | `charset.eth_ascender`: ascender, bar and cut end up whole to 780, the run between bowl and bar drawn longer | top 777 in the Regular (cap_strokes' 83 for ð then trims the run and the bar's end, edges in by up to 6), 778 in the Light and the Bold (762 before) |
| 9 | £ dark | upright 99 across, foot 95 tall | `charset.sterling`: lighter level by the least that brings the upright to 92 (3.7 a side), the foot's top to 73 over its bottom (the handles to the upright by their share) | upright 91.5, foot 73, bar 49 |
| 10 | ¤ low and small | centre 245, ring 413 | `charset.currency_sign`: ring centred on 313, outer diameter the 0's ink width (504), ring weights and arms as drawn | ink 514 tall, top 0.80 cap |
| 11 | maths signs narrow | the + box 424 | `charset.math_widths` (`MATH_INK`, the figures' median ink 494), `maths`, `tilde_signs`: every operator on the minus follows; ÷'s bar the minus; × TIMES_BOX; ~ and ∞ the operators' sides | + 494 square; advance 612 kept; ~ 510 > 612, ∞ 704 > 859 |
| 12 | → short | 2 axes (626) | `charset.arrows`: the arrow's share of the + box (626 / 424): 729; ↑ ↓ ↕ keep the baseline-to-two-axes extent | → ← ↔ ↗ ↖ ↘ ↙ 729 long |

Carried along by the shared rules, not on the list: ¬ (built on the minus: 494 wide now), ≠'s = (its slash as it
was), seven.ss06, seven.tf and the small 7s (built from the 7), and the asciitilde's advance (now the operators'
612). The ~ and ≈ waves keep their 22.5-degree slope, so at the wider box they are 1.165 times taller (the wave's
height follows its length at the owner's slope).

Light and Bold were looked at for every item (`build/owner11/masters/Light-1..3.png`, `Bold-1..3.png`, red snap084g
over grey snap084h; `text-300-400-800.png` the variable font at 300 / 400 / 800, 16 / 24 / 48 px). They hold, with
what the first full build showed and the follow-ups fixed: the Bold « (chevrons touching), the Light 7 (bar end over
the top), the Bold § (an inflection, redone as fillet ends sliding along their curves). At the Bold the § left crotch
is now a shallow scoop beside the right one's notch; the ¤ ring at every weight is the 0's width.

### Full build, the audits, `build/snap084h`

`caffeinate -i build.py` twice (the brief's one full build and one more for the regressions it showed): the first
kept as `build/owner11/snap084h-first` with its audits (`audit-084h-first`, `chk-084h-first`); the second is
`build/snap084h` (`full-084h.log`, the notes), audited in `build/owner11/audit-084h` and `chk-084h`
(`build/owner11/tools/audits.sh`), against snap084g's (`build/owner10/audit-084g`, `chk-084g`). No kerning refit:
the maths' advance is unchanged (612) and the guillemets', ~'s, ∞'s and the arrows' new advances carry no pair the
kerning audit reads differently.

| Audit | snap084g | snap084h |
|---|---|---|
| fallbacks | Bold registered, ℗; Light ℗ | the same |
| audit_rays | 2 (@ at 532.9, § at 800) | **ok** (464 glyphs, 27,036 places) |
| audit_axis Bold / Light | ok (thin: cedi, ogonek, one.ss01 as before) | first build: turns daggerdbl, § (622.7 / 355.9), crossings 7 seven.ss06 ⁷ ₇ (317 to 322); second build: § and the sevens clear, **daggerdbl turns at 396 / 425 remain** (item 7, reverted in the code afterwards) |
| audit_bold Bold / Light | 428 / 429 on target, Light clean | the same on target; Light one "other": seven height 0..718. audit_bold reads the engine's own 7 (glyph_bold), before `symbols.seven_end`; the shipped Light 7 stands 0..712 |
| audit_kern | | unchanged |
| curvecheck regions and hooks, Light and Bold | | unchanged |
| interpolation (fontTools) | 62 not compatible (the struck glyphs) | the same |
| Regular: audit_charset | 0 errors | 0 errors |
| Regular: curvecheck, hooks | pass | pass |
| Regular: pathlint | 4 / 155 / 28 | **0** / 154 / 30 (the currency sign's warning gone; info: ↗ ↘ a smooth node 0.6 units off its line after whole units at the new length) |

Left open: item 7 (above); the 7 in a run ("7777") reads a little heavy at 82 where the figures' mean stroke would
ask about 67 (the brief's number kept); the guillemets' and ¤'s ends are cut sharp (the plain stroke end's radius 7
does not reach them); ~ and ≈ are 1.165 times taller (their slope kept).

## Regular pass 5 (0.84), figures (21 November 2026)

The owner looked at snap084i and asked for four things on the figures. Each is a construction that runs where the glyph
is built, judged by eye on large renders (nodes and handles, before over after) and in lines at 16 to 48 px, and
committed one by one. Images and tools: `build/owner12/<item>/`, `build/owner12/tools/` (`sheet.py` cells and
overlays, `quarters.py` each quarter's handle shares, `thick.py` the stroke at every extreme, `proto_even.py` the
first solves, `smalltry.py` and `ufotext.py` the small-figure trials). Reference faces not opened.

| # | Item (owner) | What was wrong | Construction | Now |
|---|---|---|---|---|
| 1 | 9 and 6: "The 0.80 9 and 6 were much better from a shape and curve perspective... take those exact curves and tails" | four rounds had reshaped them (below) | `figs.nine_080`: 0.80's Regular 9 point for point (`NINE_080`), the tail's bottom on the figures' hairline 47 by hair.py's own reading (42.5 > 47.1, the inner lowest node +5), the crotch one corner (0.80's 7-unit step dropped, the tail's edge leaving from 0.80's curve end), the left extreme and the counter's side smooth, every smooth node at one curvature by handle lengths (2.51 > 1.17); the 6 the 9 turned. Withdrawn: `clean.nine_six`, `figs.nine_even`, `hair.hairlines` on 6 9, `figs.nine_tail`, `charset.fold_steps` | heights 721 / -9, sides 92, top 47, ball 88, advance 619 (as 0.80); curvecheck 1.17, 0 faults; the outline within 6.4 units of 0.80's (the tail's inside, raised to the hairline), elsewhere within a unit or two |
| 2 | $: "the only difference between them should just be the round ends" | its S was the base's ball-ended drawing re-spined at the zero (narrower at the top, 603 wide) | `dollar.from_s`: the finished S point for point, the barbs replaced by the figures' ball (88 across, outer side on the barb's edge, far point at the barb's inner end), the bar 47 centred on the S's ink, union; every master the same on its own S (`dollar.master`) | $ 580 wide as S; looks right in "$42 S$S 5$"; at the S's weight it reads a little darker than the figures beside it (render `item2/text.png`), kept as asked |
| 3 | "The number set overall looks very inconsistent... 5 and 3 look a bit off" | 3's and 5's bowl quarters lopsided (handles 0.44 / 0.58, 0.48 / 0.67, 0.62 / 0.46 on the 3's inside; 0.66 / 0.52, 0.44 / 0.57, 0.51 / 0.64 on the 5), so each arc ran flat then tight; the 5's ball 88 by 44 (the others 88 by 49); the 5's bowl side 91; the 2's inside 0.55 / 0.64 | `figs.figure_family` (below) | 3 inside 0.58 / 0.62 / 0.56 / 0.57 / 0.57 / 0.64 both handles; 5 0.61, 0.64, 0.57, 0.52 / 0.54, 0.58 / 0.59, 0.58 / 0.59; 2 inside 0.60; curvecheck 3 1.09 > 1.05, 5 1.06 > 1.02, 2 1.20 > 1.17, no faults |
| 4 | "The fractions look better... perhaps they can be a bit thicker?" (at most 18% under the figures, 12 to 15% if the counters stay open) | stem 62 (28% under 86); `lighten` moves level only, so the hairlines stayed 25 (0.54 x 47) | `charset.SUP_STEM_FIG` 72 by `small_weights`: uprights by the level move (12.8 a side), level strokes by the same move turned upright (`lighten_upright`, 7.0 a side) so the hairline is 39 (47 / 86 of 72), the figure narrowed upright first so its lines hold; `FRACTION_BAR` 65 (56 x 72 / 62) | stem 72 to 76 at the sides (zero 73, 3 75), hairlines 38 to 42; tried 70, 72, 74: at 74 the counters of ⁸ ₈ fill in at 16 px, 72 is the heaviest that reads clean (16% under the figures) |

**Why the 6 and 9 had moved away from 0.80** (git history and this record):

1. 0.81, owner round 2 (de487eec, 15 November). The owner said the 9 read "too steep, slightly italicized". Measured
   against Georgia Pro and Source Serif 4, the quarter from the right extreme to the lowest point was tall and narrow
   (309 by 409, 0.76 against 0.92 to 0.94) and the lower right edge leaned 17.6 degrees against 24.5 to 25.8. The
   rule `clean.nine_six` (`NINE_QUARTER` 0.90, `NINE_LEAN` 23.5) moved the lowest point left (249 > 191), the ball 32
   left onto the bowl's left extreme and shortened the extreme's handle; the 6 the same turned. This is where the tail
   lost 0.80's curve.
2. 0.81, owner round 6: a reading fix in the Bold engine for the new ball position (no Regular change).
3. 0.83, letters 1 (ddcc3e65, 18 November). The new shape failed curvecheck (9 2.51, 6 4.56); `figs.nine_even`
   solved the counter's handles and the two lowest nodes together for curvature and even.py, and made the 6 exactly the 9
   turned.
4. 0.84, pass 2, strokes 1 (668f753f, 19 November). `hair.hairlines` moved the inner node of the 6's top and the 9's
   bottom pair to the figures' hairline.
5. 0.84, pass 3, owner item 4 (e535eb21, 20 November). The owner said they were "slanted too much, more like the
   single storey g": `figs.nine_tail` reshaped the tail on g.ss02's (lowest point at 0.460, quarters 0.92 / 0.95,
   handles 0.55), `nine_solve` re-solved it; pass 4 then needed `charset.fold_steps` for the small forms' crotch.
So each move answered a measured reference gap or a remark at the time, and each later round corrected the previous
one; 0.80's drawing was never the problem the record measured, only its steepness against the references.

**The figures' bowl family (item 3), the rule.** Read on snap084i: 0 and 8 were already even (each quarter's two
handles within 0.03, outside 0.56 to 0.58, inside 0.58 to 0.62); balls 88 across everywhere, the 5's 44 high where the
others are 49; the strokes at the extremes 92 except the 5's side (91); the 8's extremes 67 to 79 (its stress is the
spine's, not the sides: not a fault, left). `figure_family`: (1) the 5's ball the others' (88 by 49); (2) each bowl
quarter of the 3's and 2's insides and both of the 5's edges one share on both handles near the family's tension
(outside 0.57, inside 0.60), solved with one curvature at every smooth node and least change, shared extremes free to
slide along their tangent (they moved under a unit); (3) every smooth node evened by handle lengths (target 1.1); (4)
the 5's side 92. The 3's and 2's outside quarters that run into a ball were tried in the solve and left: a single
cubic cannot hold one share and meet the ball's curvature (one ball shape forced them to 0.38 / 0.67 and 0.71 / 0.34,
or the extremes moved 15 to 27 units); their lopsided handles there are the ease into the ball. A ball of one shape
(handle shares) for 2 3 9 was refused for the same reason; one size holds.

Light and Bold were looked at for every item (`build/owner12/masters/Light-figs.png`, `Bold-figs.png`: snap084i red
over snap084j blue with nodes; `text-300-400-800.png` the variable font at 300 / 400 / 800). They hold: the 9 and 6
come out of the engine as 0.80's did; the $ is each master's S with that master's ball (Light 75, Bold 123) and bar
(37, 62); the evened 3 5 2 and the heavier small figures carry through. The $ no longer needs a glyph in the mid
master's sparse layer (it interpolates from the Regular and the Bold; audit_axis and audit_rays clear).

### Full build, the audits, `build/snap084j`

`caffeinate -i build.py` twice: the first (kept as `build/owner12/snap084j-first`, audits `build/owner12/audit-084j-first`)
showed one regression of this pass, audit_rays ⅑ thinner at 800 than at 666.3 (32.9 > 30.9 at (574, 176), the small
9's bowl stroke by the crotch, where the first fold had slid the underside's end 7 up its tangent); the follow-up keeps
0.80's curve end and only drops the step. The second is `build/snap084j` (`full-084j.log`), audited in
`build/owner12/audit-084j2` (`build/owner11/tools/audits.sh`, then pathlint, curvecheck, curvecheck --hooks and
audit_charset on the Regular), against snap084h's audits (`build/owner11/audit-084h`; snap084i differs from snap084h
only in the 7's diagonal and the daggers' revert).

| Audit | snap084h | snap084j |
|---|---|---|
| fallbacks | Bold registered, ℗; Light ℗ | the same |
| audit_axis Bold / Light | daggerdbl turns at 396 / 425 (reverted since); thin: cedi, ogonek, one.ss01 | turns ok; thin the same four |
| audit_bold Bold / Light | 428 / 429 on target; g's neck; Light seven 0..718 (the engine's 7) | the same (upright strokes 109 read, was 107) |
| audit_rays | ok | ok (464 glyphs, 27,057 places); the first build: ⅑, cured |
| audit_kern, curvecheck regions Light / Bold, hooks Light / Bold (5 / 16), interpolation | | unchanged |
| Regular: audit_charset | 0 errors | 0 errors (the $ check now: no S barb corner in it) |
| Regular: curvecheck, hooks | pass | pass |
| Regular: pathlint | 0 / 154 / 30 | 0 / 152 / 27 |

Left open: the $ at the S's full weight reads a little darker than the figures beside it in "$42" (the owner's choice
of the S's shape kept); the outside quarters of the 3 and 2 that run into a ball stay lopsided (one cubic cannot be even
and meet the ball); the 8's sides 67 to 79 (its weight is on the spine); the small figures at 72 are 16% under the
figures, a point past the 12 to 15% aim (74 fills ⁸'s counters at 16 px); their sides now 4.8 units tighter each
(their advances kept); `clean.nine_six`, `figs.nine_even`, `nine_solve`, `nine_tail` and `G_TAIL` stay in the code,
uncalled; `bold.far_from_ball` (0.81 round 6, written for the moved ball) is still in the engine, not checked
against the 0.80 ball this pass.

## Regular pass 6 (0.84), the @ and the stroke ladder (21 November 2026)

The owner looked at snap084j: "The @ still needs work"; the punctuation, maths symbols, arrows and fractions "still
look much thinner optically than the rest of the glyph set", their lightness against the full figures to come within
18% (12 to 15%); "the thickness of strokes should be defined to be a range of values and set as a specific number of
values ... all the non-Latin-character glyphs to be more cohesive with the letters". A read-only study prepared the
pass (`build/owner12/study/`: the @ sheets, the ladder census, the families against the figures; the reference faces
for numbers only). Four items, each a construction where the glyph is built, judged by eye on large renders (snap084j
red over the new grey, nodes blue) and in lines at 16 / 24 / 48 px, committed one by one. Renders and tools:
`build/owner13/<item>/` (`at`, `ladder`, `sign`, `stray`), `build/owner13/tools/` (`atdev.py` the @ built on a
snapshot's letters and drawn, `atdive.py` the ring's width by angle, `atq.py` the ring chains' handles and radii,
`atgrid.py` / `atfaults.py` the dive trials, `atrays2.py` the @'s rays from 300 to 800, `circthin.py` the circled
letters' Light against the Regular, `gsheet.py` before-over-after sheets, `reg.sh` the Regular build retried past a
.DS_Store, `ladnum.py` and `fam.py` the census numbers). Reference faces not opened.

| # | Item (owner) | What was wrong | Construction | Now |
|---|---|---|---|---|
| 1 | @ "still needs work" | (a) the ring left the a's foot at the a's exit stroke (65) and swelled past the ring's right extreme (59): a lump at 325 to 345 degrees, 62 to 69; (b) the a at 0.841 stems with thins 1.21 of the ring's hairline: stem 66, thins 52, grey and monoline; (c) the tail's outer end at 318 degrees and 1.11 of the radius, a spiral out of the ring | `at.py`: the ring leaves the foot at the a's thin (`FOOT` 44 / 43) and swells to the right extreme, 60 (`RIGHT`); the inner edge from the foot up only loosens (`INNER_MONO`, `MONO_W` 250); the a at the Regular stem 74, top and bottom 43 (`A_OWN`; the Light's thin the ring's too); the tail's outer end on the ring's oval at 305 degrees, 1.02 of the radius, along the tangent turned 3 degrees out (`TAIL_ANGLE`, `TAIL_R`, `TAIL_TURN`) | right side from the foot (snap084k): 41 to 47 at 312 to 325 degrees (one reading of 52 at 317 runs across the inside corner of the foot), 47 to 52 at 328 to 340, 53 to 60 at 341 to 360, never over 60, 43 at the top; the a 74 / 43, its height kept (435); the tail 43 to 38 at the cut, outer edge within 1.021 of the radius. curvecheck on the construction: Light 0, Regular 0, Bold 0 faults (before 0 / 0 / 1); its rays thicken everywhere from 300 to 800 |
| 2 | "a specific number of values" | the Regular's steps were literals in five modules | `ladder.py`: tip 30, small-figure hairline 39 (72 x 47 / 86, the units of the thin diagonal), thin diagonal 39, hairlines 43 / 47, bar 52, sign stroke 58, small-figure stem 72, thick diagonal 74, stems 78 / 86, rounds 82 / 92; balance, charset, hair, amp, at and every pass-6 rule read it; the table in the construction skill | the Regular built identical (0 glyphs differ) |
| 3 | signs "much thinner optically" | one stroke 52 for the plain signs, 55 to 57 for the key signs, the arrows three shafts (a 43 / 44 to 60 taper, ↔ ↕ 43, the slanted ones 59.4), # 48.5 to 52, the fraction slash 52.9 across | `ladder.SIGN` 58: the minus at it and every operator built on it; dashes, the figure dash, ÷'s bar; # made heavier on its own outline; the taper from the capitals' hairline 47 to 58, ↔ ↕ shafts 58; tab bar 58; key signs 47 level / 58 upright; the curved maths' stress 53 / 63; the fraction slash, every built fraction's bar and % ‰'s bars 58 across (71 level); `bold.SIGN_BAND` 50 to 60 takes the sign law ahead of the upright signs' bracket law; < keeps the letters' 33 flat; the plain end's face to 1.15 sign strokes | 60 tried (`build/owner13/sign/cmp-1.png`, `cmp-2.png`, `s60`): = ≠ ≤ ≈ stay open at 16 px at both, but at 48 px the fraction slash, # and \| at 60 read heavy beside the small figures and the letters; 58 kept |
| 4 | strays (the study's off-ladder list) | 4's bar 57, Ə 67, ə 51; struck bars 53 to 62, slashes 49 to 71; ™ ℠ strokes 22 to 50; © ® ℗ letters 54 to 64; ° 47 light, ¶ 61 dark | `stray.py`, `circled.py`, `charset.STRUCK_W` (rows in the skill) | 4's bar 47 (57 shown red in `stray/sheet.png`, `text-1.png`: the 57 bar read heavier than the 4's own diagonal and the figures' hairlines), Ə 47, ə 41; every struck stroke 58 across; ™ ℠ T M S at the small figures' size and weights (advance 840 > 1015, 780 > 968); © ® ℗ letters 72 / 39, ring top 39; ° 58 / 47 (72 / 39 read as a bold o); ¶ stems 58 |

**Item 1, the @ in detail.** The a's foot curve and the ring's inner edge from the foot are one chain solved for handle
lengths. With the foot's stroke at the a's thin the inner lowest point drops 13 units and the counter between the a's
stem and the ring narrows to a teardrop at its bottom; the inside's foot node stays half way between the parallel and
the a's own place (`DIVE["in"]` 0.5, as before). Trials (`at/grid1.txt` to `grid3.txt`): the dive's foot share
(0.20 to 0.28), its radius share (0.85 to 1.05) and the inner foot (0 to 1.2) each traded a fault in one master for
one in another; the inside's monotone term at 250 (40 left a flat place in the Light, 400 a curvature step in the Bold)
cleared all three. The a keeps its height (the references' share, 435), so the counter opens by what its thins lose.
Light: the a's thin is the ring's (37) instead of the references' 1.18 (44), so it is never heavier than the
Regular's; Bold unchanged in its shares. `audit_rays` on the @ (`atrays2.py`, 300, three stops to 400, 400, three to
the mid master, the mid master, half way, 800): no place thins.

**Item 3, which fraction slash.** The fraction slash is a plain stroke, so it takes the sign stroke across itself, 58,
and with it every ready-made fraction's bar and the % ‰ bars (one level width, 71, at the fraction slash's slope; the
built fractions lean within 0.3 degrees of it): ½ and 1⁄2 carry one bar. The small figures' 39 hairline was the
other candidate; 58 keeps the bar with /, which it is.

**Item 4, left as they were.** % ‰'s zeros are the small zeros (components) and already read 38 / 73 at snap084j: on
the ladder. The small figures' thin diagonals: ⁴ ₄ and the fractions' 4s 40.9 (within 2 of 39), ⁷ ₇ ⅞ ⅐ 57.4 (the 7's
thick diagonal scaled with its figure, the 7's own share of the stem, 0.80 / 0.79): one value per role already; no
change. Đ Ħ Ŧ đ ħ ŧ keep H's and t's crossbar (49): their bars are the letters' own crossbars, not strokes across a
letter. Ɲ's thick diagonal at 86 was built (99.8 > 85.7) and withdrawn: the first full build's Bold hook took a new curvature fault (curvecheck --hooks, node 53, 1.44x; 16 > 17 faults).

### Full build, the audits, `build/snap084k`

`caffeinate -i build.py` twice: the first (`build/owner13/full-084k.log`, audits `build/owner13/audit-084k-first`)
showed three regressions of this pass: audit_axis Bold drift in # at 628.8 (the rebuilt union's crossings off their
lines between the masters: # is now its own drawing made heavier); audit_axis Light thin in ® ℗ at 300 / 325 (29 > 21,
the circled letters' larger Regular additions shrinking by the stem's law: now the hairline's) and the Light ® on an
engine fallback (the engine's reading, which circled.py replaces whole: the report now names the construction, so the
old Bold ® ℗ and Light ℗ fallbacks go too); curvecheck --hooks Bold one more fault, Ɲ (withdrawn). The second is
`build/snap084k` (`full-084k.log`), audited in `build/owner13/audit-084k` (`build/owner11/tools/audits.sh`, then
pathlint, curvecheck, curvecheck --hooks and audit_charset on the Regular), against `build/owner12/audit-084j2`.

| Audit | snap084j | snap084k |
|---|---|---|
| fallbacks | Bold registered, ℗; Light ℗ | none (© ® ℗ reported as circled.py's construction; their outlines were always its) |
| audit_axis Bold / Light | turns ok; thin cedi, ogonek, one.ss01 | the same (drift and Light thin clear in the second build) |
| audit_bold Bold / Light | 432 / 433 on target; g's neck; Light seven 0..718 | the same |
| audit_rays | ok (464 glyphs, 27,057 places) | ok (463 glyphs, 27,034 places: ≠ is no longer read, its junction zones now cover its every place at 58) |
| audit_kern, curvecheck Light / Bold, hooks Light / Bold (5 / 16), interpolation (150 lines) | | unchanged |
| Regular: audit_charset | 0 errors | 0 errors (the degree's ring now read against stray.DEGREE) |
| Regular: curvecheck, hooks | pass | pass |
| Regular: pathlint | 0 / 152 / 27 | 0 / 135 / 33 (↖ ↗ ↘ ↙'s warnings gone; no glyph newly warned) |

**The census again** (the study's readings, `ladder.py` over `stroke/measures.json`, re-read on snap084j and snap084k
with `build/owner13/tools/ladnum.py` against this pass's ladder; the study's own script writes into the study folder
and was left as it was; `build/owner13/census/ladder-j-k.txt`):

| | snap084j | snap084k |
|---|---|---|
| straight strokes (length 60 or more) | 1006 readings, 54 distinct whole-unit values | 1006 readings, 50 distinct |
| within 2 of a ladder step, straight | 95.1% | 97.1% |
| within 2 of a step, every reading (with free round extremes) | 85.0% | 86.7% |
| by class, straight, on the ladder | accents 83%, interface 83%, punctuation 88%, capitals 97%, lowercase 98% | accents 100%, interface 85%, punctuation 100%, capitals 98%, lowercase 100% |

Each family's mean stroke (ink over skeleton length) against the full figures' median, Area only (`fam.py`, the
study's part-3 measure; `build/owner13/census/j-fam`, `k-fam`): maths operators 0.84 > 0.94, dashes 0.82 > 0.93,
slashes and bars 0.79 > 0.88, arrows 0.87 > 0.90, percent 0.85 > 0.87, fractions 0.81 > 0.83, reference marks 0.89 >
0.91, circled 0.74 > 0.76, trademark 0.51 > 0.74, small figures 0.79 (kept); brackets 0.98, guillemets 0.89, quotes
1.03, maths other 0.93 unchanged. Every sign family but the trademark and the circled is now within 18% of the
figures; maths, dashes and slashes within 12%. The main stroke (90th percentile) of the plain families 52 > 58, of the
circled 56 > 70, of the trademark 51 > 69.

Left open: the @'s counter between the a's stem and the ring comes to a narrow teardrop at its foot (the inside's
lowest point is 44 over the outside's, 37 right of the a's stem: a round turn there needs the foot further right);
™ ℠ are wider (840 > 1015, 780 > 968) at the superiors' size; the fraction slash's ends stay sharp (71 level, past the
plain end's 67), as they were at 65; the plain end's wider face newly rounds ₺'s and ₱'s bar ends; Đ Ħ Ŧ đ ħ ŧ keep
their crossbars (49); ≠ unread by audit_rays; the small figures stay 21% under the figures in mean stroke (pass 5's
72 kept, its counters' limit at 16 px).


## Regular pass 7 (0.84), Latin letter repairs (21 November 2026)

The owner: "please also audit the latin characters as well and fix any errors there too. Focus on the 400 weight only",
after saying repeated passes had changed shapes they liked. The list came from the read-only stroke audit of snap084i
(`build/owner12/study/stroke/`); every item was re-read on snap084k first (`build/owner14/remeasure/`, the same
`stroke.py` and `likeparts.py`). Every repair is local and lives in one new module, `latin.py`, called in normalize
after `hair.even_more`: a fault is found by its place (a node within 4 units of the audit's place), only the curves
there are rebuilt, the masters read the Regular's points as before (no point added or removed). Each glyph touched was
drawn snap084k (red) over the new outline (blue) with nodes and set at 16 / 24 / 48 px (`build/owner14/<item>/overlay.png`,
`text.png`); `build/owner14/tools/` holds the helpers (`nd.py` points and node readings, `dev.py` largest outline move,
`wprobe.py` the stroke audit's width and curvature reading for one glyph, `probe.py` before / after, `ov.sh`,
`renders.sh`). No reference face was opened.

**The construction** (`latin.mend`, `chain_fit`, `refit`, `whole_best`): the curves between two nodes are rebuilt as
the same number of cubics; the ends meet the curves kept outside at one curvature (within 1.15, else 1.3); an inner node
may slide at most 15 units along the span (a ray read at it stays where it was), an extreme keeps its place and its
level or upright tangent; no handle past its triangle (an S curve has none), no bent node, a fillet into a corner turns
one way; whole units chosen so the nodes keep their curvature (an end's or extreme's handle keeps its line); kept only
where the glyph's curvecheck jumps fall, no flat place appears and the outline stays within 4 units. The first version
(items 1 and 2 as first committed) had none of the place and triangle guards: it left 16 new pathlint warnings
(extremes off their nodes, handles past their triangles) and a ß reading over audit_charset's cap; the guards took
some repairs back (below).

| # | Item | On snap084k | What was done | Largest move | Now (stroke audit reading) |
|---|---|---|---|---|---|
| 1 | ß | jump 17.6 at (411, 250), inflection | one curve (314, 364) to (449, 225), G2 both ends: cleared the jump, but the stroke read across at the node came to 85.5 / 85.7 where audit_charset caps ß at 83 + 2.5 (it read 84.0) | | **left** (entry kept in `SPANS`' comment) |
| 2 | ə Ə | ə 11.0 at (424, 247), Ə 6.66 at (582, 346) | ə: the fillet from the counter's extreme to the bar's corner at the bowl's curvature, free tangent at the corner (`SPANS`, "ease") | ə 0.8 | ə 11.0 > 4.4, its inflection gone; **Ə left**: every fillet that clears its jump runs a handle past its triangle or widens the bowl's swell 4.6 > 5.3 |
| 3 | y tail | -209, thinnest 33.9, balls j 80.7 y 82.4 | one attempt in the Regular first (`loops.tail_law` at -233 with the ball at 88, then `round_tail`; and the inside's lowest point raised 4 to 10): every variant left the Regular y with 1 to 3 curvecheck faults and a width bump of 4.4 to 5.4 at the ball's neck; at -233 the thinnest reaches 39 only with the inside raised 10 and still one fault | | **left**: the construction the record names (a third cubic on the outside, a ball-height rule) is needed; it was not reached, so neither depth nor thin was shipped (each alone fails curvecheck in the Regular) |
| 4 | r ɍ | wave 0.69, inflection at (323, 450), neck 28.1 | `r_branch`: the outer node on the stem and its handle +3, the crotch curve's handles 34 / 56 > 64 / 38 (least change for n's neck read the same way, no wave, the arm's top no worse), the curve into the ball by `smooth_curve` | 3.0 | wave and inflection gone; neck 27.5 > 29.9 (n 30.4 on the same reading); the top's jump 2.18 > 2.10; parts.check holds; advance unchanged |
| 5 | a æ, a.ss03 | a æ 3.74 at (222, 46); a.ss03 dip 5.5 | a æ: a clean rebuild needs the counter's lowest node to slide off its extreme (pathlint: no node at the extreme): left. a.ss03: see item 8 | | **left** |
| 6 | G Ǥ | bottom 52.2; dip 4.4 at (513, 10) | as item 8 | | **left** |
| 7 | n h m u, ħ fh ffh | bumps 4.04 / 3.18 / 3.63 | `swells`: one handle along its own line, least change, until the width along each edge (largest inscribed circle) no longer rises and falls away from its nodes: the outer handle into the stem x0.86 (n h ħ fh ffh), x0.90 (m), x0.88 (u) | 3.8 | no bump; ḩ follows (component) |
| 8 | b q g.ss02 (and G, a.ss03, Ƈ Ɠ Ƒ Ʉ ƈ ǥ ⱥ) | dips 4.4 to 5.7 | these are a least width 15 to 25 units from the node (0.4 to 0.5 units under the node's on the in-build reading); a 4% handle change clears the audit's reading, but no reading the build can carry agrees with the audit's on where the dip is | | **left** |
| 9 | ɦ ƥ ɽ ɗ ɠ stems | 80 / 81 | `stem_edges`: ɦ ƥ's leaning edge upright (111 / 118 > 113 / 120); ɗ ɠ the counter's straight 461 > 464 (542 - 78; moving 542 put a width bump into ɠ's hook). ɽ's (125 > 127) built, then **withdrawn**: the first full build's Bold hook took a curvature fault at its node 31 (1.41x) | 3.0 | ɦ ƥ ɗ ɠ 78; ɽ 80 (ᶑ is not in the font) |
| 10 | ɛ Ɛ | thin 44.2, jumps | ɛ (366, 288) cleared by `jumps`; ɛ (150, 167), Ɛ's four and Ɛ's thin left (no rebuild within 4 units; Ɛ is merged with its stroke before this rule) | 0.4 | ɛ one jump fewer |
| 11 | Ɲ | thick diagonal 99.8 | `n_hook_diagonal`: only the upper edge moves, parallel, its ends sliding on the cap line and up the right stem (the notch with it), so the left stem, vertex and hook keep every point: 86.3 in the Regular. **Withdrawn**: the first full build's Bold hook took node 53's fault again (1.44x, curvecheck --hooks 16 > 17), as pass 6's attempt did; the function stays, not called | | 99.8 (as snap084k) |
| 12 | hooked jumps, dips, balls | ɗ ɲ Ɫ Ʈ Ɽ ɠ ɥ 2.7 to 4.7 | `jumps`: ɲ (212, 384), Ɫ (305, 351) (64, 395) (323, 425), Ʈ (223, 666), ɥ cleared; Ɽ (a 5.6 dip beside it), Ɫ (89, 467) (a flat place), ɗ, ɠ, Ʈ (557, -139), Ƭ, ɦ, ƥ, Ɠ left by the guards; the dips as item 8; Ƭ Ɓ's 45 is the inscribed circle of the curl's end, not a straight thickness: left | 2.5 | |
| 13 | Œ ª Ꞌ | Œ 3.0 and an inflection at the seam; ª 4.1, Ꞌ 3.2 | ª (111, 406) and Ꞌ cleared (ª's width bump went with it); Œ: the inflection is the step from E's bar (712) to O's overshoot (721) inside one curve, and no rebuild of the seam stays within reach: left | 3.7 | |
| 14 | case accents | 6.2 / 5.2 / 4.9 | acute.case, hungarumlaut.case (both curves), dblgravecomb.case (both) and their comb forms cleared | 2.8 | the accented capitals follow (components) |
| 15 | B upper bowl | 97.8 against 93.1 | settled, nothing changed: 97.4 is a level cut at y 500, 48 under the bowl's extreme where the stroke leans; across the stroke there it reads 92.7, at the extreme 93.1, under the rule's 95 ("Across the stroke, never along a scan line") | | |
| 16 | ﬆ s_p | 5.85 / 6.3 | s_p (391, 687) took a flat place beside it and (70, 395) a turned handle at a retracted node; ﬆ a handle past its triangle: all left | | |

Regular checks after the pass (AREA_BOLD=0): curvecheck and curvecheck --hooks pass, parts.check clean, audit_charset 0
errors, pathlint 0 errors / 132 warnings / 35 info (snap084k 135 / 33: three warnings gone (r, ɍ, ə handles past
their triangle), two infos new (r ɍ node 6 bends 2.7 degrees, 0.6 units, from `smooth_curve`'s rounding)). 28 drawn
glyphs changed, every one within 3.8 units except Ɲ's diagonal (the item itself).

### Full build, the audits, `build/snap084l`

`caffeinate -i build.py` twice. The first (`build/owner14/snap084l-first`, audits `build/owner14/audit-084l-first`)
showed two regressions of this pass, both in curvecheck --hooks on the Bold (16 > 18): Ɲ node 53 (1.44x, the fault
pass 6's attempt took) and ɽ node 31 (1.41x, from its stem edge made upright). Both were withdrawn (commit 304bdfdd).
The second (`build/snap084l`, `full-084l.log`; once retried past a `.DS_Store` inside the Bold UFO) is audited in
`build/owner14/audit-084l` (`build/owner11/tools/audits.sh`, then pathlint, curvecheck, curvecheck --hooks and
audit_charset on the Regular), against `build/owner13/audit-084k`.

| Audit | snap084k | snap084l |
|---|---|---|
| fallbacks | none | none |
| audit_axis Bold / Light | turns ok; thin cedi, ogonek, one.ss01 | the same (files identical) |
| audit_bold Bold / Light | 432 / 433 on target; g's neck; Light seven 0..718 | the same |
| audit_rays | ok (463 glyphs) | ok; Ʈ's thinnest 38.9 > 39.8 at 400 (33.0 > 34.5 at 300) and Ꞌ's read thicker |
| audit_kern, curvecheck Light / Bold, hooks Light / Bold (5 / 16), interpolation | | unchanged |
| Regular: audit_charset, curvecheck, hooks, parts.check | 0 errors, pass, pass, clean | the same |
| Regular: pathlint | 0 / 135 / 33 | 0 / 132 / 35 (r ɍ ə's handles past their triangles gone; r ɍ node 6 bends 2.7 degrees, 0.6 units, from `smooth_curve`'s rounding: info) |

No advance changed (every touched glyph keeps its width), so the kerning was not refit.

Left open: ß (item 1, the audit_charset cap), Ə, the y tail (item 3: needs the outside's third cubic and a ball-height
rule; neither depth nor thin can ship alone without a curvecheck fault in the Regular), a æ's counter (its lowest node
would have to leave its extreme), every width dip read 15 to 25 units off its node (b q g.ss02 G Ǥ a.ss03 Ƈ Ɠ Ƒ Ʉ ƈ ǥ
ⱥ: no in-build reading agrees with the audit's on where they are), Ɲ's diagonal and ɽ's stem (Bold hook faults), the
Ƭ Ɓ curl ends, Œ's seam, ﬆ and s_p, and the hooked jumps the guards refused (ɗ ɠ Ʈ (557, -139) Ƭ ɦ ƥ Ɠ Ɽ Ɫ (89, 467)
Ɛ ɛ (150, 167)). r's top node keeps a 2.10 jump (2.18 before; not on the list).

## Regular pass 8 (0.85), the ampersand and the close of the round (21 November 2026)

The owner, on the 0.81 Regular ampersand (`build/snap081`): "this old ampersand looks better, but the top part looks like
it leans a little bit to the right side." The close of the round: that ampersand back with one correction, the version
0.85, one full build and every standing check, a last look at the whole Regular. Figures `build/owner15/amp/`, the
final look `build/owner15/final/`; tools `build/owner15/amp/tools/` (`lean.py` the loop's lean, `axis.py` the loop with
its axis, `chk.py` curvecheck and pathlint on the whole glyph, `dev81.py` the distance to 0.81, `try.py` a trial on
snap084l's letters, `turns2.py` audit_axis's own turn reading for the &, `text.py` text lines in any master),
`build/owner15/tools/contact.py` (contact sheets). No reference face was opened.

### Item 1: the ampersand of 0.81, its loop upright

`amp81.py`. The shape is 0.81's Regular outline, point for point (`BASE`: the upper loop, the long diagonal, the big
lower-left bowl, the arm rising to its flat serif, the tail's cut); none of 0.84's `amp.py` shape decisions (the even
bowl taper, `THROUGH`, the arm curving into the crossing). 0.81's crossings already read as continuous strokes: each
hidden edge's visible ends have tangents either side of their chord (one arc, no step): the spine's lower edge 214.5
and 208.8 degrees about a chord of 214.6, its upper edge 218 and 205.6 about 210.7, the bowl's inside into the arm 41.6
and 50.7 about 46.7; the bowl's outside into the arm 46.8 and 55.5 about 46.3 (0.5 degrees of S, kept).

**The lean, measured** (`lean.py`): the midpoints of level chords across the outer loop (its upper half) and across
its counter, a line fitted through each. 0.81: the outer loop leans +4.0 degrees (top to the right), the counter -0.9;
the outer top extreme at x 348, the counter's at 335, the middle of the side extremes (outer and counter both) 339.5;
the outer's right extreme 45 units higher than its left (581 / 536). The outer loop is slanted, not turned: its top is
right of its middle and its right side high, as a shear makes them (a turn about the foot moved the top left but
raised the right extreme further: tried first, left). **The correction** (`upright`): the upper half of the outer loop
and of its counter sheared level about the height of each one's side extremes (nothing below moves, so the loop's foot
and its corners on the diagonal stay), every extreme's handles put back on their axis. Candidates (`LEAN_CANDIDATES`,
`build/owner15/amp/candidates.png`, `candidates-loop.png`, `pick-loop.png`, the blue line the side extremes' middle):

| | outer top moved | counter top moved | lean outer / counter (degrees) | tops x (outer / counter) | side extremes' middle |
|---|---|---|---|---|---|
| 0.81 | | | +4.0 / -0.9 | 348 / 335 | 339.5 |
| A | -8.5 | 0 | +2.0 / -0.8 | 340 / 335 | 339 |
| **B (taken)** | **-11** | **+2** | **+1.4 / -0.3** | **337 / 337** | **338.5 / 339.5** |
| C | -14 | -1 | +0.7 / -1.1 | 334 / 334 | 338.5 |

B puts both tops on one vertical within 1.5 units of the sides' middle; looked at large, A still tips right at the
top, C starts to lean back. The remaining +1.4 is the teardrop's own form (its foot points down-left into the diagonal).

**Brought up to date**: the diagonal the capital stem (`ladder.CAP_STEM` 86; 0.81 92: both straight edges in 3); the
loop's top the capital hairline (`CAP_HAIR` 47; 0.81 62: the counter stretched upright about its foot, top 659 > 674);
the loop's sides 79 and the bowl's left 93 left (1 unit off `STEM` and `CAP_ROUND`), the bowl's bottom 64 left (a round
stroke tapering into the diagonal, not a step); O's lines (721 / -9, as 0.81); the tail's cut the tip (`TIP` 30; 0.81
21: 4.5 each way along itself) with both corners on 7, their nodes corners (the corner rule's free end); inner corners
sharp; the arm's bracket off its straight at 0.40 of its tightest (curvecheck read 1.00 on 0.81's); every smooth node's
handle lengths at one curvature (0.81's loop left extreme read 1.26). Regular: curvecheck on the glyph 0 faults, worst
1.19 (0.81: 3 faults, worst 1.26), pathlint 0 / 0 / 0 on the &. Distance to 0.81 (`dev81.py`): outside the loop at most
4.5 units (the tail's cut end), the diagonal 2.8, the bowl 4.3; in the loop 15.1 (the counter's raised top). Advance
814 (0.81 810, 084l 809: the side bearings the spacing rule left, the tail 4.5 longer).

**Masters** (`amp81.master`, in `bold.bold_font` where `amp.master` was): each edge offset by half its stroke's growth:
the stroke read across by the shortest of a fan of rays about the normal, the growth the master's own law for that
thickness (v's thin at the thin diagonal, o's hairline at the hairline, n's stem at the stem, linear between: the
readings `amp.readings` already took); a corner where its two edges' offsets meet; a curve refitted through its offset
points with its end tangents kept (smooth nodes stay smooth, extremes stay extremes), no handle past its triangle; a
level extreme on O's lines stays on it and the stroke's other edge takes the growth; the serif moved whole (slab by the
tip's law, each half out by the arm's growth); the tail's cut with the tail's sides; the loop's counter widened level as
o's counter changes (Bold +30); a curve the growth bent into an inflection its Regular curve lacks has its handle
lengths solved out of it (`no_new_turns`: the first full build's audit_axis read curve 14, the loop's outside from the
crotch up, turning at 752 between the mid master and the Bold). One point structure (66 / 10 / 12) in every master and
the mid master at the readings that far along. Light: advance 801, curvecheck 0 faults; Bold: 846 (084l 871, 0.81 885),
curvecheck four node jumps 1.27 to 1.34 and eleven flat places (not a standing check on the masters; 0.81's Bold read
ten faults, worst 4.43, and its counter closed to a slit); the loop upright in both (tops on one vertical). Renders
`build/owner15/amp/{Light,Regular,Bold}-side-overlay.png` (0.81 | snap084l | 085a and over each other),
`text-{Light,Regular,Bold}.png` ("R&D, Q&A, Fish & Chips, 3 & 4" at 16 / 24 / 48), `masters-axis.png`.

**Withdrawn**: `amp.regular` (normalize) and `amp.master` (`bold.bold_font`) are no longer called; `amp.py` stays
(its `Chain`, `readings`, `_flat`, `_mix` and helpers serve the @, (C) (R) (P), $ and the summation). With them the
0.82 to 0.84 ampersand rules lapse: the construction skeleton (`REG`, `loop_rule`, `LOOP`, `BOWL_R`), the 0.84 crossings
(`even_ribbon`, `ribbon_width`, `bowl_taper`, `ARM_*`, `TAPER_*`, `THROUGH*`, `soft_cut`'s use on the tail), `widen` and
`spread`.

### Item 2: version 0.85

`version.BUILD` "0.85": the one place the build sets the version (`derive.metrics` writes versionMajor 0 and
versionMinor 850 into every master; the name table's "Version 0.850", the unique ID and head.fontRevision follow;
audit_charset checks it).

### Full build, the audits, `build/snap085a`

`caffeinate -i build.py`, two full builds. The first (`build/owner15/snap085a-first`, audits
`build/owner15/audit-085a-first`) read one new fault: audit_axis turns, the &'s curve 14 (the loop's outside from the
crotch up) gaining an inflection at 752.3 between the mid master and the Bold (the same fault the stem-55 run printed as
314.2). Fixed by `amp81.no_new_turns` (commit e7a179cd; the Regular unchanged). The second is `build/snap085a`
(`full-085a.log`). A `.DS_Store` written into a UFO while the build replaced it stopped five runs at the save (Regular,
Bold, Light in turn; deleting it before the run and a cleaner during it did not win the race); the last run moved the
three old UFOs aside first (`build/owner15/stale/`), which the build does not read, and passed. Audits in
`build/owner15/audit-085a` (`build/owner11/tools/audits.sh`, then pathlint, curvecheck and its hooks, audit_charset and
parts.check on the Regular) against `build/owner14/audit-084l`. evaluate.py is not part of the standing run (not in
084l's set) and was not run.

| Audit | snap084l | snap085a |
|---|---|---|
| fallbacks | none | none |
| version | 0.840 | 0.850 (name 5 "Version 0.850", head 0.850, every master's versionMinor 850) |
| audit_axis Bold / Light (turns, crossings, thin ...) | turns ok; thin cedi, ogonek, one.ss01 | the same (files identical) |
| audit_bold Bold / Light | | identical |
| audit_rays | ok | ok; the &'s thinnest 38.9 > 33.2 at 400, 32.3 > 28.6 at 300, 41.9 > 42.2 at 800 (0.81's spine where it crosses and the bowl's bottom into the diagonal, both thinner than amp.py's; read, not flagged) |
| audit_kern, curvecheck Light / Bold, hooks Light / Bold, interpolation | | identical |
| Regular: audit_charset | 0 errors, & ink 2.53 | 0 errors, & ink 2.77 (at most 3.0) |
| Regular: curvecheck, hooks, parts.check | pass, pass, 0 errors | the same |
| Regular: pathlint | 0 / 132 / 35 | 0 / 132 / 35 (the & clean) |

What moved against snap084l: the ampersand only, in every master and the mid layer (`dev.py --all` on the Regular:
1 glyph); the Regular's advance 809 > 814, Light 795 > 801, Bold 871 > 846. Kerning was not refit (the & keys move
with their master's rule as before).

### The final look at 400

Contact sheets of the whole Regular from snap085a (`build/owner15/final/`: `lowercase.png`, `capitals.png`,
`figures.png` (figures, small figures, fractions), `punctuation.png`, `currency.png`, `maths.png`,
`arrows-symbols.png`, `marks.png`, `accented-1..5.png`, `alternates.png`, `other.png`) and text lines at 16 / 24 / 48 px
mixing them (`text-1.png` .. `text-3.png`, `text-check.png`). Each was looked at; nothing was changed from this look.
What still reads off, most visible first:

| # | Glyph | What reads off | Sheet |
|---|---|---|---|
| 1 | ‹ › | lighter and taller than « », as if from another face, beside each other in text | `final/text-check.png`, `punctuation.png` |
| 2 | ¶ | the bowl and the two stems read darker than any letter around it at 16 to 24 px | `final/text-check.png`, `text-2.png` |
| 3 | $ | still a touch dark beside the figures (carried) | `final/currency.png`, `text-2.png` |
| 4 | ‰ | at 16 px the third zero reads as a separate small o ("%o") | `final/text-2.png` |
| 5 | ŀ | the middle dot is large and crowds the next l | `final/lowercase.png`, `text-check.png` |
| 6 | ⌥ | small and light beside the other key signs; its slanted stroke thinner than its bars | `final/arrows-symbols.png`, `text-check.png` |
| 7 | ﬆ (s_t) | the long s and the t joined read awkward, the join high (carried) | `final/lowercase.png` |
| 8 | Œ | the seam between O and E reads at 48 px (carried) | `final/text-1.png`, `capitals.png` |
| 9 | † ‡ | the arms' ball ends read heavy for the stem (carried) | `final/punctuation.png` |
| 10 | Ŋ | the hook hangs further below the baseline than J's | `final/capitals.png` |
| 11 | ß | the upper curve's change of curvature still visible at 48 px (carried) | `final/lowercase.png` |
| 12 | Ɲ | the diagonal heavy beside N's (carried) | `final/capitals.png` |

### The round's open items

| Item | Where it stands |
|---|---|
| y tail depth and thin | open: needs the outside's third cubic and a ball-height rule (pass 7, item 3) |
| ß and Ə curvature | open: ß's fix crosses audit_charset's cap; Ə's fillet runs a handle past its triangle (pass 7) |
| a / æ bowl bottom | open: the counter's lowest node would have to leave its extreme |
| G bottom | open: the dip read 15 to 25 units off its node (pass 7, item 8) |
| b q bowl-join dips | open: as G |
| Ɲ diagonal | open: withdrawn, the Bold hook's fault (pass 7, item 11) |
| ɽ stem | open: withdrawn, the Bold hook's fault (pass 7, item 9) |
| § pointed counter ends | open: refused by the Bold engine (`_round_end` kept) |
| † ‡ | open: the arms' ends heavy |
| Ɛ | open: its jumps and thin left (merged before the rule) |
| Œ | open: the seam |
| ﬆ s_p | open: flat place and handles past their triangles |
| $ slightly dark | open |
| & | done this pass (0.81's, upright loop); its Bold master reads a little compact (846) with four node jumps 1.27 to 1.34 and flat places in curvecheck (not a standing check on masters) |
| ‹ › weight against « » | new (final look) |
| ¶ dark | new |
| ‰ at 16 px | new |
| ŀ dot | new |
| ⌥ light | new |
| Ŋ hook depth | new |

## Regular pass 9 (0.85), the small 3 and the ampersand's crossings (22 November 2026)

Two owner notes at 400, nothing else touched. Figures `build/owner16/three/` and `build/owner16/amp/`; tools
`build/owner16/tools/` (`m3.py` the 3's bowls, waist and aspect against the 3; `mctr.py` every small figure's aspect
and closed counters against its figure; `overall.py`, `look3.py`, `threeba.py` the small figures over and beside
their figures; `xm.py` / `xmasters.py` the ampersand's crossings read, every edge both ways; `xzoom.py` the crossings
drawn with their edges carried through; `ampover.py` before over after; `refamp.py` the reference ampersands'
proportions, numbers only). Reference faces opened (measured, never drawn, kept or traced): the OFL faces installed in
`~/Library/Fonts` only.

### Item 1: the small 3 (⅓ and every small 3)

The owner on ⅓: "the 3 looks wrong here, the top part looks smashed. the regular large 3 looks good." **Cause**: not a
stale outline (the small figures are made from the finished 3, after `figs.figure_family`) and not the upright move:
`charset.small_figures` narrowed each scaled figure upright by what the upright move adds, so its height held, but not
level by what the level move adds, so every small figure came out 9 to 13% wider for its height than its figure (the
3 +9.9%; the 1 +13.4%). And the level move, which reads every upright edge as a stem's side, pushed the level strokes'
cut ends out with the stems: the 3's waist ran 12% long. A squat upper bowl, a long waist and a heavy ball low on the
left is what read as "smashed". The bowls' own ratios were already within 1 to 2%.

**Change** (`charset.small_figures`, `small_box_moves`, `small_cut_ends`): each small figure narrowed level and upright
about its middle by twice each move, the moves solved on the narrowed figure so the stem is `SUP_STEM_FIG` 72 and the
hairline 72 x 47 / 86 = 39.3 exactly (it was 38.4: the narrowing had not been allowed for), so its ink box is the
scaled figure's; the cut ends of level strokes (an upright line under 40 between two corners, each running on level:
the 3's waist, the 1's flag, the serifs of 1 and 4, the bars of 2 4 5) held where the scaled figure has them; the side
bearings as they were (the advance 2 x 13 narrower; the fractions, % and ‰ re-fit by their own rules); each inferior
its superior moved in whole units (narrowed about their own middles their rounding had parted: two new pathlint
warnings, a handle past its meeting point in ₈ and ₅ only, in the first full build). In the masters
the small figures still take their figure's move at the scale (`bold.kin_parts`); its point match now reads the figure
narrowed as the Regular narrows it (`bold._match(narrow=)`, the plain reading kept where it matches better: the 1,
whose held serif ends make its box), and where a point stays unmatched (the small 4's counter, a triangle whose
crotch corner the heavier strokes move furthest) the figure's points taken in order from the nearest start
(`_rot_match`). Without these the first full build left both small 3s to the engine's fallback, and the second read
the small 4s' thin diagonal at 34.5 in the Bold against 37.5 in the Regular (0.85a 45.5: audit_axis thin at 766.7
and 800, the counter's corner carried by its neighbours' average move).

| the 3 against the full-size 3 (`m3.py`) | 0.85a | 0.85b |
|---|---|---|
| width over height | +9.9% | 0.0% |
| upper bowl height / lower (from the waist's middle) | +0.4% | +0.3% |
| upper bowl width / lower | +1.2% | +2.0% |
| waist middle, share of the height | -0.2% | -0.1% |
| upper bowl width over its height | +11.0% | +1.9% |
| waist's left end, share of the width | -8.5% (12% long) | +0.5% |
| top ball's lowest point | -3.6% | -3.6% (the ball the stroke's weight: 72 over 0.54 x 86, as every stroke) |

Every small figure (`mctr.py`; superiors and inferiors alike, the fractions, % and ‰ being these as components):
aspect against its figure 0.85a +9.2 to +13.4%, 0.85b -0.2 to +0.4% (0 +0.4, 1 -0.2, 2 0.0, 3 0.0, 4 +0.3, 5 0.0,
6 0.0, 7 +0.2, 8 +0.1, 9 0.0). Counters' centres within 1% of the figure's (8's two counters' height ratio -1.3%, as
before), except the 4's triangle +3.2% across (0.85a +2.4%): its heavier diagonal and stem close it unequally, a
weight effect, not a proportion, left. Every closed counter is narrower for its height than the figure's (the 0's
width share 0.655 > 0.473): the price of the small figures' weight in the figure's own box. At 16 px the counters of
⁸ ⁶ ⁹ ⁴ and ‰ stay open (`three/text16.png`). Renders: `three/fractions.png` (⅓ ⅔ ¾ ⅜ before over after),
`three/superiors.png` (⁰ to ⁹), `three/threes.png` (the full-size 3 scaled beside the small 3), `three/overlay-before.png` and
`overlay-after.png` (every small figure, blue, over its figure, red).

### Item 2: the ampersand's crossings

The owner: "the & is better but make sure the line intersections are clean, as if a stroke is going through all of
them. the points should line up both ways. make sure the overall shape matches what the other open source serif
glyphs have." Two crossings, each two strokes crossing, each stroke two edges (`amp81.X_EDGES`). Read first which
edge runs into which: at the upper crossing the loop's left stroke runs on as the diagonal, and the loop's right stroke
runs on as the bowl, the counter's right side becoming the bowl's outside (the lower edge: the loop's outside becoming
the bowl's inside); at the lower crossing the diagonal runs on as the tail and the bowl as the arm. (The arm leaving
the diagonal is this last stroke's far side.)

**The reading** (`edge_reading`, both ways for each edge). Along the diagonal (both its edges run straight through
both crossings): the far corner's distance from the straight carried on, and the curve's direction there against the
straight's. Elsewhere (the loop's right stroke into the bowl, the bowl into the arm) one curve through the hidden part
whose curvature runs evenly from the visible end's to the other's (a straight's 0): it turns L (2 k1 + k2) / 6 before
its chord and L (k1 + 2 k2) / 6 after; the reading is each visible direction against the chord less that, and the
offset it leaves at the far corner. In a master, such an edge is read against the Regular's own directions (the
growth leaves short handles whose end curvature says nothing about the stroke).

**The change** (`amp81.crossings`, in `construct` after the tail's cut and last in `master_contours`): the eight corners
slide on the diagonal's two edges (the diagonal itself unmoved) and only they and their own handles move (and the
arm's bracket handle, turned onto the arm's straight, 1 unit); a curve carrying on the diagonal leaves along it.
Solved together, least change; held as curvecheck reads it: each far smooth node in its curvature band (1.18 across),
no flat place, no new inflection, and the arm no thinner across than it was (`_arm`: the first full build's
audit_axis read the arm's root 36 > 32 at 566.7 and 600, the mid master's solve having turned the arm's straight
about its far node until the arm thinned from 40.6 to 31.8); corners slide at most 8 in the Regular; then whole
units by a local search (a corner with its handle). Regular, every edge (worst of the two ways; `xm.py`):

| edge | 0.85a | 0.85b |
|---|---|---|
| upper: loop's left into the diagonal, outer | 3.3 u, 2.3 deg | 0.63 u, 0.22 deg |
| upper: loop's left into the diagonal, inner | 5.1 u, 5.4 deg | 0.80 u, 0.30 deg |
| upper: loop's right into the bowl, upper | 10.1 u, 6.7 deg | 0.39 u, 0.27 deg |
| upper: loop's right into the bowl, lower | 10.7 u, 7.3 deg | 0.38 u, 0.25 deg |
| lower: diagonal into the tail, upper | 3.9 u, 1.7 deg | 0.40 u, 0.19 deg |
| lower: diagonal into the tail, lower | 7.8 u, 7.6 deg | 0.22 u, 0.19 deg |
| lower: bowl into the arm, outer | 10.4 u, 6.4 deg | 0.35 u, 0.22 deg |
| lower: bowl into the arm, inner | 0.6 u, 0.4 deg | 0.52 u, 0.34 deg |

Masters (`xmasters.py`, worst edge): Light 8.0 u 7.8 deg > 0.49 u 0.74 deg; mid 8.5 u 7.7 deg > 0.80 u 0.40 deg;
Bold 12.7 u 8.3 deg > 3.1 u 1.13 deg (the bowl's inside into the arm, its hidden part 158 long: the one edge over the
degree, by 0.13, left). A master is grown from the Regular as it was before its cleaning (`_before_crossings`) and
cleaned in itself against the Regular's directions, corners sliding at most 16: grown from the cleaned Regular, the
growth refit whole curves and evened their nodes, moving points outside the crossings up to 13 (the Bold's loop top
handle); now none outside the crossings moves in any master (the arm's bracket handle 1 unit). Point moves against
0.85a, outside the crossings / corners / their handles: Regular 1 (that handle) / 9.5 (the loop counter's foot, slid down
the diagonal's upper edge) / 17 (the counter's left side leaving its foot along the diagonal); Light 0 /
17 (the corner where the loop's outside meets the bowl's) / 18; mid 0 / 15.6 / 18; Bold 1 / 5.8 / 13. The loop upright
as before (tops 337 / 337), advances 814 / 801 / 846 as 0.85a. curvecheck on the glyph: Regular 0 faults (worst 1.17),
Light 0; mid 4 faults (0.85a 6), Bold 12 (0.85a 15). The arm across its root 37.5 > 37.4 (Light 28.8 > 28.5, mid
44.1 > 46.6, Bold 49.9 > 50.7). Renders: `amp/x-before-*.png`, `amp/x-after-*.png` (each crossing large, Light Regular mid Bold: red the diagonal's
edges straight on, green every edge carried through, grey each visible edge's tangent), `amp/whole-before-after-*.png`,
`amp/text-{Light,Regular,Bold}.png` ("R&D, Q&A, Fish & Chips, 3 & 4" at 16 / 24 / 48).

**Against the open-source serifs** (`refamp.py`; regular weight, the variable ones at 400 or their default: Crimson
Pro, Crimson Text, Libertinus Math, Hedvig Letters Serif, Radley, Noto Serif JP; numbers only, nothing drawn or kept;
`amp/refs.txt`):

| | width / height | height / cap | loop height | loop width | bowl width | main crossing | diagonal (deg) | arm top | arm reach | tail end height |
|---|---|---|---|---|---|---|---|---|---|---|
| references | 0.92 to 1.02 | 1.00 to 1.15 | 0.35 to 0.43 | 0.45 to 0.54 | 0.51 to 0.61 | 0.57 to 0.65 | 59.7 to 68.9 | 0.86 to 0.92 | 0.36 to 0.43 | 0.01 to 0.22 |
| Area 0.85a | 1.013 | 1.025 | 0.408 | 0.391 | 0.526 | 0.592 | 69.0 | 0.884 | 0.430 | 0.147 |
| Area 0.85b | 1.013 | 1.025 | 0.404 | 0.391 | 0.522 | 0.596 | 68.0 | 0.884 | 0.434 | 0.147 |

(loop height and width, bowl width, the crossing, arm top and tail end as shares of the glyph's height or width; the
crossing the loop counter's foot; the diagonal from it to the lower counter's right point; the arm's reach past that
point.) The diagonal reads 68.0 (0.85a 69.0: the loop counter's foot, by which it is read, slid down the diagonal); the
arm's reach 0.434 sits on the references' top. Inside the range everywhere but one: the loop is narrow, 0.391 of the glyph's width where the references hold
0.45 to 0.54 (13% under the least). To reach the least it would be 40 to 45 units wider: over the 6 units this pass
allows, and the loop is the part the owner chose in pass 8. Not changed; offered as a question.

### Full build, the audits, `build/snap085b`

`caffeinate -i build.py`; the snapshot is the sixth full run (`full-085b.log`, 0 glyphs on a fallback in either
master). The runs before it, each read and its fault fixed at its cause: (1) both small 3s on the engine's fallback
(the masters' point match, above); (2) audit_axis thin, the &'s arm at 566.7 / 600 and the small 4s' diagonal at
766.7 / 800, and pathlint two new warnings in ₈ ₅ (above); (3 to 5) a repair of the small 1s' zero-length handle
tried and withdrawn (it moved the handle past its curve's meeting point: a warning for an info); (6) the masters grown
from the uncleaned Regular (above). The `.DS_Store` race did not recur: the old UFOs were moved aside before each run
(`build/owner16/stale/`). Audits in `build/owner16/audit-085b` (`build/owner11/tools/audits.sh`, then pathlint,
curvecheck and its hooks, audit_charset and parts.check on the Regular) against `build/owner15/audit-085a`:

| Audit | snap085a | snap085b |
|---|---|---|
| fallbacks | none | none |
| audit_axis Bold / Light | turns ok; thin cedi, ogonek, one.ss01 | identical files |
| audit_bold Bold / Light, curvecheck and hooks on both masters, audit_kern, interpolation | | identical files |
| audit_rays | ok | ok (places 27047 > 26902: the narrower small figures); the &'s thinnest 33.2 / 28.6 / 42.2 as before |
| Regular: curvecheck, hooks, parts.check | pass, pass, 0 errors | identical files |
| Regular: audit_charset | 0 errors, & ink 2.77 | 0 errors, & ink 2.80 (at most 3.0) |
| Regular: pathlint | 0 / 132 / 35 | 0 / 132 / 39: the same warnings (⁶ ₆ ⁹ ₉'s "no node at the x-extreme" at their new places); four new infos, no warning: ¹ ₁ a zero-length handle (the flag's top, which the narrowing leaves nearly straight; a repair turned it into a warning, withdrawn), ⁷ ₇ a smooth node 1.4 degrees off its line (0.5 unit: whole units) |

What moved against snap085a: the small figures and the composites built of them (the fractions, % ‰), in every
master; the ampersand in every master and the mid layer. Nothing else was touched.
