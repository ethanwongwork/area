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
| Worst curvature ratio across a smooth node on the loop | 1.56 | | 1.60 at the counter's top-right turn (IR), every other node 1.00-1.12 |
| curvecheck.py | 3 faults | | 0 |

Construction (`loops.py`): quarters at the bowl's tensions (0.57 outside, 0.61 inside); extremes at 0.80's places
across, heights at the references' share of the counter (left 0.495, right 0.57); each smooth node's handle solved
for equal curvature; the left side meets the link through a 32-unit neck. Kept, as the owner decided: the loop wide
and flat-ish, raised into the link; the ear and its ball; the bowl and the link's curl are 0.80's points.

g's advance went from 600 to 590 and its kerning pairs moved by 10: `spacing.py` reads the outermost ink in the
x-height zone, and the loop's left side now rises into the link further left than the knob did.

## The single-storey g (ss02): one round arc

0.80's tail (four quarter turns, every handle 0.55) was flattest just left of its lowest point: outside, radius 218
off the stem, 402 past the lowest point, then 65 at the ball; the curvature jumped 1.45 times outside and 1.38
inside at the lowest points. Now (`charset.single_g_points`, `_round_tail`):

- The turn off the stem is a quarter circle on both edges: each straight edge ends one quarter's width above its
  lowest point (outside at 22 above the baseline, inside at -15).
- The handles of the curve from the lowest point to the ball are solved: the curvature from the stem to the ball
  never falls, is equal on both sides of the lowest point, and reaches the ball at the ball's own curvature.
- The ball sits at 0.100 of the x-height under the baseline (0.80: 0.138; the references by the same measure:
  Serrif 0.023, Source Serif 4 0.164, Literata 0.144, mean 0.110). At 0.138 a tail that runs 217 units left of
  its lowest point and rises only 118 cannot tighten evenly in one curve.

Outside it now runs radius 262, 253-256, 262, 268-273, then tightens to 46 at the ball (the ball is 45); the curvature ratio at the lowest points is 1.00 outside and 1.01 inside, and 1.00 where the outside meets the ball. Inside, the tail tightens to radius 66 at the ball's neck, where the curve turns the other way into the ball (0.80: 53; j's own neck 41). The join to the bowl is q's (one corner on
the stem's edge, solved for the 32 neck). The ball is j's, moved whole, so the tails of g.ss02, j and y share one
terminal. `tools/tail_profile.py` puts the outside's largest over smallest curvature at 2.8 (0.80: 5.0; Serrif
3.9, Source Serif 4 2.6, Literata 8.0 by the same rasterised measure).

g.ss02 touched a following j (and ĵ, ȷ): those pairs are kerned +31 by the collision pass over every alternate
(`alternates.kern_and_open`). Against every other glyph of the set, both sides and itself, it stands at least 13
units clear (`img/081/gss02-neighbours.png`).

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
| ss04 Tailed l | l.ss04, its 12 composites (ĺ ľ ļ ŀ ḷ ...), ł, fl, ffl | l's flag and stem on t's hook, moved whole (t's stem is 79, l's 78: the hook's right-edge node goes in a unit) | kept: tells l from I and 1 in `Illegal 1l lIl1` at 13 px. The hook is t's full reach, so the l is 393 wide (l 289): airy in `hello`; a shorter hook would be a part of its own |
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
  - `lslash.ss04` at 600 and 700 thins one or two units under the tip (`audit_axis.py`).
  - Every other new glyph is sound in the Light and Bold (no fallback).
- j's and y's tails by curvecheck's measure (above); the two-storey a's exit (in a and a.ss03).
- U+0251 could take a.ss03's form; the superior and inferior zeros have no slashed or dotted forms.
- `evenness` (even.py) leaves g's new loop counter to its own construction (`even.OWN_RULE`): its top is the link,
  a straight of the stem's weight, so one smooth change of thickness round it is not the rule there.
