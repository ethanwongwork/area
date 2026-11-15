# Area Serif 0.81: the two g's, the single-storey a, and the alternates in the font

Owner, on 0.80: "for the alternate glyphs, for now keep and refine all of them as long as you think they are worth
including in the full set. work on the single story g, smoothing out and rounding out the arc on the descender, and
also exploring better ways to design the alternate a. the descender on the double story g also does not look super
smooth, so please confirm."

Figures (Area Serif only) are in `img/081/`; the tools that make them are `tools/figs_081.py`, `tools/a_explore.py`,
`tools/combs.py`, `tools/loop_profile.py`, `tools/tail_profile.py` and `tools/single_a.py`. The check is
`typefaces/area-serif/curvecheck.py` (in `qa.py`).

## The default g: confirmed, and rebuilt

The owner was right. Measured on 0.80 (`curvecheck.py`, combs in `img/081/g-before-after.png`, thickness by
`loop_profile.py`, the same code on Georgia Pro, Serrif, Source Serif 4 and Literata):

| Where | 0.80 | The references | 0.81 |
|---|---|---|---|
| The loop's left side, rising into the link | a leaning, nearly straight stroke ending in a knob (radius 44) that overlaps the link; the stroke thickens on the way up, 1.12 hairlines at the left to 1.34-1.39 where it meets the link. In the variable font the overlap leaves a white sliver at 550 and 700 | thin into the link: 0.62, 0.78, 0.50, 0.69 hairlines (mean 0.65) | a branch: 0.72 at the junction (the ladder's branch neck, 32), 1.16 at the side; the counter is its own contour, no overlap |
| The link's straight edges into the loop's shoulder | the curve starts at its full curvature off the straight (0.47 of its tightest, radius 160 inside, 270 outside): a step in the comb | | 0.43 outside, 0.06 inside, tightening steadily to the extreme |
| The counter's lowest point | 1.56 times the curvature on one side as on the other | | 1.0: every lowest point placed where b/a^2 is the same on both quarters |
| Worst curvature ratio across a smooth node on the loop | 1.56 | | 1.13 (round 2: the counter's top-right turn eased from 1.60 to 1.04 with its two handles; extremes unchanged) |
| curvecheck.py | 5 faults (round 2 limit 1.25 across a node) | | 0 |

The counter's top-right turn (round 2): with the link's lower edge 74 units above the right extreme, its tightest
radius cannot open past about 56 with the extremes where they are (a sweep of its two handles and of where it
leaves the straight). The jump into the extreme is gone (1.60 to 1.04) and its tightest now sits inside the turn
(radius 53), as on any round corner. 0.80's turn was rounder (75) because its extreme sat 12 units lower; lowering
the right extreme to Serrif's share of the counter (0.51 against the references' mean 0.57) would buy that back.

Construction (`loops.py`): quarters at the bowl's tensions (0.57 outside, 0.61 inside); extremes at 0.80's places
across, heights at the references' share of the counter (left 0.495, right 0.57); each smooth node's handle solved
for equal curvature; the left side meets the link through a 32-unit neck. Kept, as the owner decided: the loop wide
and flat-ish, raised into the link; the ear and its ball; the bowl and the link's curl are 0.80's points.

g's advance went from 600 to 590 and its kerning pairs moved by 10: `spacing.py` reads the outermost ink in the
x-height zone, and the loop's left side now rises into the link further left than the knob did.

## The single-storey g (ss02): a half-ellipse (round 2)

First pass (0.81a, kept on the sheet as "081"): the handles were solved so the curvature never fell, and the ball
went up from 0.138 to 0.100 of the x-height. The numbers improved (jumps at the lowest points 1.45 and 1.38 down to
1.00 and 1.01) but as built it was almost indistinguishable from 0.80: a quarter turn off the stem, a long nearly
level run, a small tight curl into the ball. Round 2 draws three tails by the same rules (`charset.G_TAIL_FORMS`,
`img/081/gss02-variants.png`: each outline with combs over 0.80's in red, as built beside j y and the default g, in
words at 64, 16 and 13 px):

| | ball top under the baseline (x-height) | tail end / lowest point (of the bowl's width) | stroke at the bottom | construction |
|---|---|---|---|---|
| 081 | 0.100 | 0.959 / 0.518 | 0.96 hairlines | a quarter circle off the stem, the rest solved |
| **A (in the font)** | **0.030** | **0.959 / half way to the tail's end** | **1.15** | **a half-ellipse: both edges leave the stem at the ball's height, so the turn off the stem is as tall as the rise into the ball; the lowest point half way between the stem and the tail's end** |
| B | 0.080 | 1.000 (under the bowl's left extreme) / half way | 1.15 | the same half-ellipse, wider and shallower |
| C | 0.100 | 0.959 / 0.470 | 0.96 | 081 with the lowest point moved right |

Why A: it is the only one that reads differently from 0.80 at text size. The tail is one bowl-like arc, the ball
rises to near the baseline (Serrif's 0.023, measured by the same code), and the white under the bowl is a round
counter rather than a slot. B opens wider but its bottom is flatter (radius 412 against A's 325) and reads as a
tray again; C keeps 0.80's shallow hook with a flat place left of the lowest point (curvecheck's valley 37%).

Measured, 0.80 then A (outside of the tail, stem to ball; `tools/figs_081.py` tail_numbers, `curvecheck.py`):
- radius off the stem 217, then 401 just past the lowest point, then 65 at the ball; now 130 at the stem, 325 at
  the lowest point (the flattest place is the lowest point, as on any ellipse), tightening steadily to 55 at the ball
  (the ball is 45: ratio 1.21)
- jumps at the lowest points 1.45 and 1.38, now under 1.21 everywhere on the tail
- the stroke at its thinnest 41 (0.96 hairlines), now 49 (1.15), at the lowest point; it thickens from there to the
  stem (77) and into the ball. The thickest point is not at the bottom as asked: the stem side is the stem's own
  weight, and a bottom heavier than the turn would put a diagonal stress into one letter of a face whose round
  strokes are thin at top and bottom
- white between the tail and the bowl's underside 77, now 89
- `tools/tail_profile.py`: ball top 0.032, lowest point 0.503 of the reach, thinnest 1.14 hairlines at the bottom

Towards the Bold the ball rises by the references' 0.026 of the x-height (to 0.004 at 700) and the lowest point
moves left as before; the Bold's g.ss02 is spliced from the Bold's q and j by the same code.

The join to the bowl is q's; the ball is j's, moved whole. j and y now read as a different family below the
baseline: their balls hang lower (j 0.187, y 0.18 of the x-height under the baseline) and both have flat places by
the same check (j's outside jumps 1.30 at its lowest point; y's tail has three). To stay one family they should take
this construction too, with their own narrower reach. Not changed in this round.

The collision pass kerns g.ss02 before j, ĵ and ȷ by +57 (the turn off the stem now reaches lower, under the j's
hook); every other pair with g.ss02, either side and itself, stands at least 13 units clear
(`img/081/gss02-neighbours.png`).

## j and y: one tail family (round 3)

j's and y's tails are rebuilt by g.ss02's rule (`loops.round_tail`, after the node rule in normalize): from where the
straight edge ends (j's stem, y's thin diagonal) round the lowest point to the ball, each edge is two curves whose
curvature only rises toward the ball and is equal across the lowest point, and the outside meets the ball at the
ball's curvature. The ball (neck, top, left side), the depth, the stroke at the lowest point and the reach stay: the
balls hang where the owner's edits put them (j 0.187, y 0.18 of the x-height under the baseline), inside the
references' range (Georgia Pro, Serrif, Source Serif 4, Literata by `tools/tail_profile.py`: j 0.22-0.33, y
0.18-0.31), lower than g.ss02's 0.030, as in those faces. What moved is the lowest point: to the nearest edge of the
references' range of its share of the reach (j 0.589 to 0.673; references 0.673-0.993; y 0.714 to 0.681; references
0.654-0.681), and the handles. The inside's lowest point stays where it was, or moves toward the outside's by steps
of 4 when that gives a smoother inside, as long as the stroke keeps 0.80's thinnest or the references' least
(0.87 hairlines), whichever is less (`loops.TAIL_THIN`): j's moved 15 units left, y's stayed.

| | 0.80 | 0.81 |
|---|---|---|
| j, outside, stem to lowest point to ball (radius) | 363, 165, 203 at the lowest point, then 156 to 46 | 289 to 137 at the lowest point, then 134 to 56 |
| j, ratio at the lowest point | 1.30 | 1.02 |
| j, inside | 444 to 68, then 85, 103, 41 into the neck (a flat place) | 297 tightening to 63 at the lowest point, then 61 to 47 into the neck |
| j, the stroke at its thinnest (across itself) | 44 (1.02 hairlines) | 38 (0.88; the references' least is Source Serif 4's 0.87) |
| y, outside, diagonal to lowest point to ball | 98, 235, 49 at the lowest point; 48, 94, 53 to the ball (two flat places) | 160 to 143 at the lowest point; 141 to 50 at the ball |
| y, inside | 109, 188, then 27 (a flat place) | 177 tightening to 27 |
| y, the stroke at its thinnest (across itself) | 39 | 34 (vertically, `tools/tail_profile.py`: 1.11 then 1.18 hairlines) |
| curvecheck faults | j 1, y 5 | 0, 0 |

Followed: dotless j, ĵ, ǰ, ij, j with stroke, the f-j ligatures (fj, ffj), eng (n's stem on j's tail), ý ÿ ŷ ỳ and
the other accented y's, y with stroke. ƴ (yhook) has its own tail drawing (none of y's points) and is unchanged. The
collision pass runs on the new shapes; g.ss02 and U+0261 before j stay at +57.

## The a's exit (round 3)

The two-storey a's curled exit, and a.ss03's (the same part), ran radius 108, 129, 146, 155, 151, 135, 110, 81, 57
from the lowest point to the cut end: a flat place. Its two handles are re-solved by the tail rule (directions kept:
level at the lowest point, along the cut's own tangent): now 130, 135, 141, 143, 139, 127, 106, 81, 55, rising only
by a few units before it tightens (under curvecheck's 10% tolerance) and 1.23 across the lowest point. The lowest
point, the cut end and a's width do not move (`loops.a_exit`). ª follows; ⱥ follows.

## U+0261 (round 3)

The set carries its neighbours (ɠ U+0260, ɛ U+025B and 21 other IPA letters), so U+0261 is added as a composite of
g.ss02 (`uni0261`), kerning as g.ss02.

## The single-storey a (ss03): four constructions, one chosen

The references that have the letter (`tools/single_a.py`):

| | advance / n | ink / o | bowl / d | stem top / x-height | exit past the stem (stems) | colour / two-storey a |
|---|---|---|---|---|---|---|
| Serrif ss01 | 0.971 | 1.110 | 1.000 | 1.006 | 0.95, a flat foot | 1.091 |
| Source Serif 4 | 0.919 | 1.142 | 1.011 | 1.027 | 1.13, a curled exit | 1.084 |
| Literata | 0.944 | 1.130 | 1.000 | 1.028 | 1.05, a curled exit | 1.117 |

All three use d's bowl whole. Area's two-storey a is narrower than theirs (0.87 of n), so d's bowl makes Area's
single-storey a as wide as n: the 0.80 candidate read as a d with its ascender cut. Four candidates, each built by
`alternates.py` from finished parts (`img/081/a-exploration.png`: each between n o d q and g.ss02 at 300 px, in
words at 64 px, and at 16 and 13 px):

| | Construction | advance / n | colour / two-storey a | from o / from d, rasterised at 11 and 12 px | look |
|---|---|---|---|---|---|
| a | d's bowl, q's spur, the two-storey a's curled exit | 1.023 | 1.02 | 0.15 / 0.16 | wide; at 13 px a d without its ascender |
| b | the bowl narrowed to the two-storey a's ink width, q's spur, d's flat foot | 0.861 | 0.94 | 0.33 / 0.36 | condensed, light, its bowl 0.80 of g.ss02's: a different family from the g beside it |
| c | d's bowl, spurs at both ends (q's head and the same turned over), no exit | 0.960 | 0.96 | 0.11 / 0.17 | o with a stem; the plainest and the closest to o and d at 13 px |
| **d** | the bowl narrowed so the advance stands to n as the references' mean (0.945), q's spur, the two-storey a's curled exit | 0.945 | 0.99 | 0.32 / 0.38 | **chosen** |

Why d: its width is the references' share of n; its colour matches the two-storey a it replaces (0.99), so a
paragraph keeps its grey; its exit is the default a's own, so turning the set on changes only the upper storey and
the a keeps the face's terminal family (a's foot, t's hook); the curled exit and the narrower bowl keep it twice as far from o and d at 11
and 12 px as a or c (tools/confusable.py's measure; the two-storey a stands at 0.51 / 0.46 and 0.39 / 0.38; at
13 px the four come closer together, 0.25 to 0.44, where the measure is least steady). Its bowl is narrowed across the counter only (parts.bowl's construction with
the far extremes brought in by 51 units; the side stroke stays 82, the hairlines 43, the joins solved for their necks).

The exit is the two-storey a's, carried whole, and curvecheck finds a flat place in it (radius 108, 155, then 57):
it is the default a's, so it is listed as known and both should be redrawn together.

a.ss03 has its 31 accented forms (every composite on a), top marks centred on the bowl-and-stem as a's are on its
own, the ogonek and right half ring at the exit (`img/081/a-chosen.png`). It kerns as d on its left and a on its
right. ss03 is its own set; ss02 and ss03 can be on together. U+0251 (alpha-latin) is still the old drawing; it
could take this form.

## The other alternates

| Set | Glyphs | Construction | Judgement |
|---|---|---|---|
| ss01 Footless 1 | one.ss01 | (0.78) | kept |
| ss02 Single-storey g | g.ss02 | above | kept |
| ss03 Single-storey a | a.ss03 and 31 accented | above | kept |
| ss04 Tailed l | l.ss04, its 12 composites (ĺ ľ ļ ŀ ḷ ...), ł, fl, ffl | round 2: its own hook, t's construction at 0.770 of t's reach (`alternates.L_HOOK_REACH`; the one reference with a tailed l, Inter's l.ss02, reaches 0.770 of its t's hook past the stem): the cut end moves as one piece, the lowest points keep their share, every handle its share of its curve. 143 past the stem against t's 186 | kept: 350 wide, l's plus 0.78 stems (round 1: 393). Rasterised at 11-13 px (tools/confusable.py) it stands 0.19-0.21 from I and 0.16-0.18 from 1, where the default l stands 0.11-0.12 from both |
| zero Slashed zero | zero.zero, zero.tf.zero | the zero and a stroke of its own hairline (47) from corner to corner of the counter, cut at the oval's outside | kept; the tabular column holds |
| ss05 Dotted zero | zero.ss05, zero.tf.ss05 | the zero and a round dot at the counter's centre, as wide as the zero's side stroke (87) | kept |
| ss06 Barred seven and z | seven.ss06, seven.tf.ss06, z.ss06, its 6 accented | a level bar at half height through the diagonal, half the top arm long, of the figures' (47) and the lowercase (43) hairline | drawn and kept in the font, but the weakest: a handwriting convention (continental Europe) with little interface use, and at 13 px the barred z reads as a struck letter (ƶ). Worth keeping as an opt-in; not worth more work now |

Every alternate is in the Light, the Regular and the Bold (the engine reads them unchanged; none falls back).

## Checks

- `curvecheck.py` (in `qa.py`): curvature continuity on g's loop and link, the tails of g.ss02, j and y, a.ss03's
  foot and l.ss04's hook. 0.80 fails it (g: two straight-to-curve steps and a flat inside the knob; g.ss02: a 46%
  valley along the tail); 0.81 passes. Faults on parts 0.81 did not touch are listed as known with their
  reasons: j's inside flattens at its lowest point; y's tail has flat places between its diagonal, its lowest point
  and its ball; the a's exit (in a and a.ss03).
- `audit_charset.py` (`audit_081`): g's loop is its own contour; g.ss02's quarter-circle turn and ball height;
  a.ss03's side stroke, stem, exit and advance; every accented a on a.ss03 with its marks centred as a's; l.ss04's
  hook is t's; every set's substitutions and names; every alternate in all three masters.

## Open

- For the engine (`bold.py`, not touched here):
  - The Bold's g falls back to upright parts only. The engine moves the link's right end (360, 80) to (355, 130) and
    its left end (193, 99) to (214, 152): the link's upper edge turns 2.4 degrees and node 7 (where it runs into the
    curl) bends 2.8 degrees against its handle (0.2 in the Regular). `audit_bold.py --sweep` counts g as the one
    glyph with a kink from 525 to 700; that is this. Before, the engine read 0.80's overlapping loop.
  - The Light's g at 325 and 300: the loop's neck into the link thins to 17 and 11 units (`audit_axis.py`, thin);
    the engine does not read the junction as a branch. 0.80's Light had the white sliver there instead.
  - (Round 1's `lslash.ss04` thinning at 600 and 700 went with the shorter hook.)
  - Every other new glyph is sound in the Light and Bold (no fallback).
- U+0251 (alpha-latin) is now a.ss03, as a composite (round 2). U+0261 is not in the character set; adding it as a
  composite of g.ss02 (round 3: added). The tabular zero has its slashed and dotted forms
  (zero.tf.zero, zero.tf.ss05); the superior and inferior zeros do not yet.
- `evenness` (even.py) leaves g's new loop counter to its own construction (`even.OWN_RULE`): its top is the link,
  a straight of the stem's weight, so one smooth change of thickness round it is not the rule there.
