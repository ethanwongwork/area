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
