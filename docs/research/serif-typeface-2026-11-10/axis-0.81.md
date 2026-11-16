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
