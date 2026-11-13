# Area Serif: evaluation of the character set, build 0.31 to 0.32

Owner, 2026-11-12: "a thorough, detailed evaluation of everything in this character set ... clean up each character and
make the shapes more consistent, bezier curves smoother, round arcs, and smooth, gradual transitions between thick and
thin." Scope: a–z, A–Z, 0–9 (62 glyphs). Every number is measured on the build (`evaluate.py`, `audit_parts.py`, and
scanline scripts) and, where given, on Serrif, Georgia Pro, Libre Baskerville and Inter at Regular. Lengths are in n
stems (82 units) unless a unit is named. Serrif and Georgia Pro are measured only.

## Against the goal

| Goal | 0.32 | Serrif | Georgia Pro | Inter | Verdict |
|---|---|---|---|---|---|
| Thin ink, close to a sans | stem 0.158 of x-height | 0.173 | 0.189 | 0.161 | At Inter's weight. No change. |
| Low contrast | o 1.64, O 1.79 | 2.91, 2.79 | 2.71, 2.69 | 1.14, 1.05 | Lowest of the serifs. No change. |
| Thin strokes that survive 12–13 px | o thin 0.68, crossbars 0.63, arms 0.57, e bar 0.57 (was 0.38) | 0.38–0.48 | 0.41–0.47 | 0.84–0.93 | Fixed: the e's bar was the one hairline left thin. |
| Shorter serifs | lowercase 0.91 (was 1.00), capitals 0.99 (was 1.04) | 0.94, 1.22 | 0.78, 1.03 | – | Shortened one step. Georgia Pro's lowercase is shorter still. |
| Rounder serifs | tip corners radius 7, brackets one curve (0.45 / 0.75) | square tips | – | – | Brackets made one shape; tips unchanged. |
| Open apertures | c 0.44, e 0.34, a 0.21, s 0.24 of x-height | 0.40, 0.36, 0.20, 0.24 | 0.43, 0.31, 0.23, 0.20 | 0.42, 0.19, 0.26, 0.25 | In the references' range. |
| Smooth thick-to-thin | bowls within 0.02–0.07 stems of an ideal swell | 0.04–0.18 | 0.06–0.16 | – | Already smoother than both references. |

## Curve quality (`evaluate.py`)

| Finding | 0.31 | 0.32 | What it is |
|---|---|---|---|
| Curvature jumps at smooth nodes | 61 | 27 | The arc bends tightly on one side of a node and flatly on the other: a dent. |
| Bumps inside one curve | 4 | 4 | r's arch, u's left stem, w's and y's joins. Small; left. |
| Pinched or boxy quarter arcs | 41 | 7 | Mostly brackets whose long handle had drifted to 0.80–1.11 of its leg. |
| Kinked smooth nodes | 1 | 1 | k's flag join, 3 degrees. |
| Extremes without a node | 34 | 33 | The diagonal joins (v w x y A K V W X Y), one curve each by your choice. |

The 27 jumps that remain are inflections, where a curve changes direction at a node: necks into round ends
(a c f j y J), the spines of s and S, figure ends (3 5 6 9), and the tight turn where a flag meets its stem (k l n).
These are part of the shapes.

26 of the 62 glyphs report nothing: b i o q t z B C D E F H I L M N O P Q Z 0 1 2 4 7 8.

## By part

**Serif.** Outer feet were one length (1.00) on i l m n h k r. Four did not follow: p 1.17 / 1.40 and q 1.23 / 1.24
(descender feet, Serrif 0.94 / 1.19 and mirrored), the inner feet of n h m (0.97–1.05), and the figure 1 (1.46 / 1.52,
normal for a 1; left). Now every foot is 0.91; p's and q's bowl side is a quarter longer, as in Serrif. r's right foot
is your own length, scaled with the rest (1.32). Capitals were already one length; they come from 1.04 to 0.99.

**Bracket and fillet.** Up close the feet sit on Serrif's almost exactly. 40 brackets had a handle longer than the
design's 0.75; R's foot and d's flag ran past the corner, a 2–5 unit bulge. All are one curve again.

**Terminal and ball terminal.** Sizes across the round ends are a 1.02, j 1.02, f 1.04, g's ear 1.07, r 1.09, c 1.12
(was 1.19). y and J stay 1.27–1.28 from your edits. The i's and j's dots were ovals 113 by 121 with uneven handles;
they are circles of the same area.

**Beak and spur.** Capital arm beaks (E F L T Z) are one length, 0.90 H stems. No change. s's and S's barbs,
C's and G's ends: no change.

**Stem.** Lowercase stems 0.99–1.01. Capital stems 1.10. Figure 1's stem 0.93–0.98 and 4's 1.01: lighter than the
capitals beside them (Serrif's 1: 1.10). Not changed; listed below.

**Bowl.** Lowercase round strokes 1.12–1.13 (seven letters, spread 1%). O and Q 1.24, D 1.25, C 1.25. The figures were
the outlier: 0 6 9 measured 1.37–1.40, heavier than the capitals. Cause: the rule that sets the figures' bowl weight
moved the wrong side of the stroke, so it thickened them by 10 units where it was written to thin them. This is the
weight you noted on the 9 ("the right side looks a bit thick") and the 5 ("the bottom is very heavy"). Fixed: figure
bowls are 1.17 (Serrif and Georgia Pro's 0: 1.19).

**Counter.** n 3.39, h 3.40, m and u 3.30; b d p q 3.91–3.93; o 4.34. Unchanged. Area's counters are wider than both
references' (n: Serrif 2.85, Georgia Pro 2.29), by design for small sizes.

**Aperture.** In the table above. The e's closes from 0.37 to 0.34 of the x-height because its bar grew downward.

**Ascender, descender, x-height, cap height, baseline.** x-height 520, capitals 712 (1.37 x), ascenders 1.50 x,
descenders 0.43 x. Overshoot: o 1.9% of the x-height, O 1.3% of the cap height (Serrif 1.6%, 1.1%). No change.

**Shoulder.** Arch thickness at the top: n 0.55, h 0.58, m 0.62, u's base 0.63. A 15% spread (Serrif 8%). Not changed;
listed below.

**Spine.** s 1.19, S 1.31 (Serrif 1.09, 1.24). Smoothed at the nodes; weight unchanged.

**Crossbar and arm.** H and A 0.63, t 0.60, T 0.57, E 0.56, e 0.57 (was 0.38). One family now.

**Leg, tail, ear, loop, link.** K's and R's legs, Q's tail (Libre Baskerville's, your choice), g's ear, loop and link:
smoothed at the nodes only. The g had four curvature jumps; one remains.

**Apex, vertex, crotch.** Thin diagonals 0.52 (v w y), 0.58–0.63 (A V W M N). Thick diagonals 1.11–1.19. No change.

## What changed in 0.32

1. `harmonize`: at every smooth node between two curves, the two handles slide along their shared line until both
   curves bend equally. Nodes, tangents and far handles stay; no handle moves more than 14 units. 41 glyphs.
2. `figure_rounds`: the wrong-side bug fixed; `FIG_ROUND` 1.15.
3. `e_bar_weight`: bar 0.55 stems, lower edge down 15 units.
4. `FLAG`, `FOOT` 0.92; `CAP_SERIF` 0.90; inner feet (n h m), descender feet (p q), r's right foot follow.
5. `bracket_handles`: one bracket curve.
6. `round_dots`: i and j.
7. `END_RADIUS`: c's end 44.
8. The fold-in of your r save reads the letter's shift from its body, so the shorter serifs do not move your points.

Advances: capitals are 4–10 units narrower (their side bearings are kept at the serif tips); figures 2 3 5 6 9 are
9–31 narrower (the outer edge is no longer pushed out); lowercase advances are unchanged.

## Not changed, for your call

- **Figure stems.** 1 and 4 are lighter than the capitals' stems (0.93–1.01 against 1.10).
- **Shoulder thickness.** n 0.55 to m 0.62 at the top of the arch.
- **Lowercase and capital spacing** treat the shorter serifs differently: lowercase keeps its advance (the gap between
  letters opens 6 units a side), capitals keep their side bearings (stems come 5 units closer).
- **u's head serifs** are level slabs where i m n p r have slanted flags.
- **a's bowl** meets the stem with two straight lines (its upper edge is a straight run of 180 units).
- **Serifs shorter still.** Georgia Pro's lowercase feet are 0.78.
- **y and J ends** remain the largest round ends (1.27).
- Kerning, punctuation, accents beyond what the 62 carry by component, and the weight axis are outside this pass.

## Not checked

The page in a browser at 12–16 px on a real display; hinting-free rendering on Windows; any glyph outside the 62.
