# Serif construction: what the sources say, and what Area does with it

Gathered 2026-11-13 for build 0.65. Each section gives the finding, where it comes from, and the Area rule it became
(or why it did not). Numbers from other typefaces are proportions to learn from, never outlines to copy. When a
source and a measured reference disagree, the two measured references (Georgia Pro, Serrif) decide, scaled by Area's
stem.

## 1. A typeface is a set of parts with shared numbers

- Knuth's Computer Modern (`cmr10.mf`, `romanl.mf` on CTAN) draws every roman letter from about sixty named numbers:
  stem, hair, curve, `thin_join`, serif `jut`, `bracket`, overshoot `o`, apex correction. No letter has a private
  thickness. The join of an arch or bowl to a stem is its own number, `thin_join` (7 at 10 pt) under the hairline
  (9): 0.78 of it.
- Glyphs' smart components and corner components, and FontForge's design guide, teach the same idea for drawn
  fonts: build n, then derive h m u r from it; build the bowl once for b d p q; build o, then c e.
- Mark Jamra's letterform notes (typeculture.com, form and proportion articles) group lowercase by construction:
  branch at the top (n m h r b p), branch at the baseline (a d q u), round (o c e), diagonal (v w x y k z).

Area: the parts table in `SKILL.md`. A thickness that appears once is a fault until a rule names it.

## 2. Where a curve meets a stem (the join)

- The stroke is thinnest at the join, thinner than the hairline elsewhere: ink gathers where two strokes meet, and
  the notch must stay open at text sizes. Computer Modern 0.78 of the hairline. Measured: Georgia Pro's branch necks
  0.28 to 0.33 of its stem (0.73 of its hairline), Serrif's 0.24 to 0.27 (0.68).
- One value for every branch in the face. Georgia Pro holds 0.28 to 0.33 on n h m r b p u d q.
- The crotch is a point. Both references bring the curve to the stem's edge with no flat cut wider than 0.04 stems.
  A flat cut is a leftover from scaling a heavier master.
- The run-in (a bowl's thin stroke entering a stem's end: d top, p bottom) is thicker than a branch: Georgia Pro
  0.49 to 0.54 of its stem.
- Computer Modern branches n h m and the b d bowls at one height (about 0.62 of the x-height on the stem); r branches
  lower (about 0.56). It also shaves the stem a little above the join (8%), a correction for heavy text faces that
  Area does not take: Area's stems run straight through joins, as both references do.
- Branches at the baseline (u, d, q, a) mirror the ones at the top: Georgia Pro's n crotch sits at 0.86 of the
  x-height and u's at 0.14; Serrif 0.79 and 0.22.

Area: `NECK_BRANCH = 32` (0.74 of the 43 hairline), `NECK_RUN = 54` (1.25 hairlines), crotch heights solved from the
neck, one leaving vector (53, 64). After 0.65 every branch measures 0.41 to 0.42 stems; before, 19 to 44 units.

## 3. Arches and bowls

- h and m carry n's arch; m's counters are a little narrower than n's (Area 0.97). u is n turned half round and
  slightly narrower, then corrected: the sources warn that a plain rotation looks too wide and too heavy at the
  bottom, so the counter is narrowed, not the stems. (OH no Type's lessons on n, u and o; Jamra.)
- b d p q are not an o pasted on a stem: the bowl is wider at the stem side, its counter runs straight along the
  stem, and the far side carries the o's curve. q is not simply b turned if their serifs differ, but the bowl and
  its joins are the same construction mirrored and turned.
- The bowl's thick part is heavier than a stem (round strokes look thinner than straight ones of the same width):
  sources give 9 to 20% more.
- Round letters are a little bottom-heavy and their widest point sits at or just above mid-height.

Area: one bowl in `parts.py` (extremes 161 / 414 from the stem, counter 153 / 332), `same_arches`, `u_from_n`.
The check compares point sets, so a drift of one unit fails the build.

## 4. Serifs

- One tip thickness everywhere; brackets one construction; head serifs one angle and height.
- The inner serif of a foot is often shorter than the outer, and serifs facing a counter shorter than those facing
  out, to keep counters open (Jamra; Microsoft's character design standards).
- A transitional face has flatter head serifs, sharper bracket turns and a more upright stress than an old style.

Area: tip 30, brackets 0.70 / 0.90, flags 8 degrees (`joins.py`). Not yet verified in Area: inner against outer
serif lengths as a rule (measure before claiming it).

## 5. Curves

- Nodes at extremes with level or upright handles; as few nodes as the shape allows (Glyphs "Drawing good paths";
  OH no Type "Drawing vectors"; FontForge design guide).
- Handles between 0.55 and 0.70 of their reach on a quarter arc (0.5523 is a circle; more is squarer). Both handles
  of one segment take the same share. The inside contour of a stroke takes a higher share than the outside.
- Handles never cross the point where their lines meet (FontLab's Tunni lines; FontAudit flags it).
- Curvature should be continuous at a smooth node where the shape is one arc (G2); a jump reads as a dent even when
  the tangent is continuous (Speed Punk shows it; Pomax's Bezier primer gives the curvature of a cubic at its ends:
  two thirds of the handle's offset from the tangent over the handle length squared).
- Production checks: fontbakery's outline checks (short segments, collinear vectors, jaggy segments, semi-vertical
  lines) and FontAudit's list are what `pathlint.py` mirrors.

Area: tension 0.57 outside and 0.61 inside (`clean.py`), `evaluate.py` (jumps over 1.8 times), `pathlint.py`.

## 6. Optical corrections

- Overshoot: round and pointed shapes pass the flat line by about 1.5 to 3% of the height (Karow: 3% for circles;
  Computer Modern arches +2.6%, o +3.9% at the top). A smaller round overshoots less.
- Horizontals are thinner than verticals of the same nominal weight; diagonals sit between; a diagonal's thin stroke
  is heavier than a hairline arc.
- Capitals are heavier than lowercase (Area 86 against 78); figures sit between or with the capitals.
- Joins and vertices take ink traps or thinning in proportion to how acute they are (v w A M N).

Area: overshoot 10 (1.9% of the x-height), capitals 9; the ladder in `SKILL.md`; diagonals by `balance.diagonals`.

## 7. Contrast as one ratio

- A face has one contrast: the ratio of its main stem to its hairline, and every other thickness is a fixed share
  of one of those two. Area: 78 to 43 (1.8) in the lowercase, the owner's "moderate contrast": a slightly lighter
  Georgia Pro with thicker thins.
- The change from thick to thin along a stroke is gradual and one-directional; where it reverses, the eye sees a
  lump. `tools/joins/swell.py` measures the rate and reports reversals.

## Sources

Computer Modern sources (CTAN: `cmr10.mf`, `romanl.mf`, `cmbase.mf`); Mark Jamra, form and proportion articles
(typeculture.com); Glyphs tutorials (drawing good paths, smart components, corner components); OH no Type Co. blog
(drawing vectors; type school lessons on n, o, u, m); Design With FontForge; Libertinus design guidelines; Microsoft
character design standards; Typeface Mechanics (as mirrored by Stockholms Typografiska Gille);
fontbakery's outline checks; FontLab 7 FontAudit and Tunni lines; Pomax, A Primer on Bezier Curves; Simon Cozens,
Fonts and Layout for Global Scripts; Speed Punk; TypeType's lesson on basic lowercase characters (the owner's link).
The measured values for Georgia Pro and Serrif are from `docs/research/serif-typeface-2026-11-10/tools/joins/`.
