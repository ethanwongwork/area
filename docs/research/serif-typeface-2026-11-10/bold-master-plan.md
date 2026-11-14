# Area Serif: a bold master (plan, 2026-11-14, on build 0.73)

Area Serif is called a variable typeface and has one master, the Regular. This is the plan for the second. The
owner took the four recommendations (last section) on 2026-11-14. Step 1, the four control letters, is done as a
trial outside the build: see "Step 1, done" below, which also corrects two of this plan's tables.

Tools: `tools/weight/bold_refs.py` (the references' Bold against their own Regular, with the
evaluation suite's `measures.py`; numbers only) and `tools/weight/bold_ready.py` (structure counts, and the build pipeline
tried at a bold weight). Both write nothing into the font. Run `bold_refs.py` from the suite's tools folder (it imports `evlib`), `bold_ready.py` from `typefaces/area-serif`.

## What the references do from Regular to Bold

Each face against its own Regular (ratio; 1.000 is unchanged). Georgia Pro Bold, Serrif at weight 700, and four
open-licence faces for context.

| Part | Georgia Pro | Serrif | Source Serif 4 | Literata | Libre Baskerville | Merriweather |
|---|---|---|---|---|---|---|
| n stem | 1.76 | 1.84 | 1.87 | 1.71 | 1.46 | 1.36 |
| H stem | 1.68 | 1.77 | 1.77 | (not read) | 1.40 | 1.37 |
| o round stroke | 1.77 | 1.80 | 1.78 | 1.61 | 1.39 | 1.33 |
| o hairline | 1.08 | 1.37 | 1.14 | 1.49 | 1.21 | 1.14 |
| O hairline | 1.11 | 1.38 | 1.14 | 1.54 | 1.18 | 1.16 |
| e bar / H bar | 1.02 / 1.19 | 1.36 / 1.47 | 1.25 / 1.24 | 1.42 / 1.56 | 1.22 / 1.24 | 1.17 / 1.23 |
| n arch at its top | 1.29 | 1.33 | 1.19 | 1.42 | 1.26 | 1.16 |
| serif tip | 1.11 | 1.65 | 1.29 | 1.50 | 1.17 | 1.21 |
| foot serif length | 1.05 | 0.85 | 0.73 | 0.89 | 1.06 | 0.92 |
| x-height, cap height, extenders | 1.00 | 1.00 | 1.02, 0.98 | 1.00 | 1.00 | 1.00 |
| n ink width | 1.21 | 1.09 | 1.06 | 1.09 | 1.09 | 1.03 |
| o / H / O ink width | 1.21 / 1.18 / 1.13 | 1.11 / 1.09 / 1.07 | 1.11 / 1.00 / 1.04 | 1.12 / 1.04 / 1.05 | 1.05 / 1.05 / 1.03 | 1.04 / 1.03 / 1.02 |
| n counter | 0.85 | 0.72 | 0.65 | 0.74 | 0.85 | 0.84 |
| n advance | 1.17 | 1.08 | 1.02 | 1.05 | 1.06 | 1.02 |
| lowercase / capital / figure advance, mean | 1.17 / 1.13 / 1.16 | 1.09 / 1.06 / 1.09 | 1.05 / 1.01 / 1.08 | 1.07 / 1.03 / 1.07 | 1.04 / 1.03 / 1.05 | 1.03 / 1.02 / 1.02 |
| n side bearings (both) | 0.71 | 0.90 | 0.63 | 0.79 | 0.64 | 0.93 |
| contrast of o, Regular to Bold | 2.7 to 4.5 | 2.9 to 3.8 | 2.1 to 3.2 | 1.8 to 2.0 | 2.4 to 2.7 | 1.9 to 2.3 |
| stem / x-height, Regular to Bold | 0.189 to 0.331 | 0.173 to 0.317 | 0.179 to 0.329 | 0.183 to 0.311 | 0.179 to 0.262 | 0.180 to 0.245 |

Their SemiBold (600) stems are 1.38 (Georgia Pro), 1.51 (Serrif) and 1.41 (Source Serif 4) of Regular.

What they agree on: heights do not move; stems and round strokes grow by about 1.8; thin strokes grow far less
(1.1 to 1.4), so contrast rises; serifs stay about as long and their tips thicken; the letter gets wider (5 to 20%)
but the counter still closes by 15 to 30%; side bearings tighten. Georgia Pro puts more of the weight outside the
letter (wider, counters 0.85), Serrif more inside (narrower, counters 0.72).

## Targets for Area Serif Bold

The mean of Georgia Pro's and Serrif's ratio, applied to Area's Regular (the method every Area value uses).
Area's Regular is lighter than both by the owner's direction, so its Bold is too: the stem is 0.270 of the x-height
where theirs are 0.32 to 0.33.

| Part | Regular | Ratio | Bold |
|---|---|---|---|
| Lowercase stem | 78 | 1.80 | 140 |
| Capital stem | 86 | 1.72 | 148 |
| Lowercase round stroke, thickest | 82 | 1.78 | 146 |
| Capital round stroke | 92 | 1.69 | 156 |
| Hairline, lowercase / capitals and figures | 43 / 47 | 1.22 / 1.25 | 53 / 59 |
| e bar / capital crossbar / arms | 41 / 49 / 46 | 1.19 / 1.33 / 1.33 | 49 / 65 / 61 |
| Arch at its top (n h m, u's bowl) | 50 | 1.31 | 66 |
| Branch neck / run-in neck | 32 / 54 | 1.22 (the hairline's) | 39 / 66 |
| Serif tip | 30 | 1.38 | 41 |
| Foot serif length from the stem | 68 | 0.95 | 65 |
| Thick / thin diagonals (lowercase) | 75 / 39 | 1.80 / 1.22 | 135 / 48 |
| x-height, cap height, ascender, descender, overshoots | 520, 712, 780, -224 | 1.00 | unchanged |
| n ink width / n counter | 579 / 283 | by the share rule below | 653 / 241 |
| o / H / O ink width | 504 / 734 / 680 | by the share rule below | 564 / 808 / 740 |
| n advance (side bearings x 0.80) | 654 | | 713 |
| Contrast of o | 1.91 | | 2.75 |

Corrected 2026-11-14. This table first gave widths and counters by their own ratios (n 667 wide with a counter of
223). Those cannot both hold: two 140 stems, a 223 counter and two 66 serifs are 635, not 667. Area adds less ink
than the references do (62 a stem against 75), so their width ratio and their counter ratio do not fit one letter.
The rule that does: of the ink a letter gains, a fixed share comes out of its counter and the rest widens it. The
share is the mean of Georgia Pro's and Serrif's, measured as counter lost / (2 x stroke gained): 0.34 for straight
letters (n 0.22 and 0.47, H 0.21 and 0.47), 0.53 for round ones (o 0.38 and 0.65, O 0.45 and 0.64). Mean advances
for the cases and the tabular advance follow from the letters when they are built, not from a ratio.

The thick-to-thin ladder keeps its order: stem 140, thick diagonal 135, run-in 66, arch 66, hairline 53, thin
diagonal 48, tip 41, branch neck 39. A SemiBold instance at 600 then has a stem of about 119 (1.53 of Regular),
within the references' 1.38 to 1.51 at the heavy end.

## How the source can and cannot help

`derive.py` already blends Libre Baskerville's two masters: each point is Regular + TX x (Bold - Regular), TX
solved from the target stem. For the Regular TX is -0.18 (lighter than Libre Baskerville's Regular). Measured:

- Libre Baskerville's own Bold is only 1.46 of its Regular. Area's bold targets need TX = 1.18 for the lowercase
  and 1.41 for capitals: 18% and 41% past Libre Baskerville's Bold, not between its masters.
- Run at that weight, `derive()` alone gives a different point structure from the Regular's on 43 of the 62 core
  characters (serif tips are found by their size, 25 to 50 units, and a bold tip is not), and `normalize` stops at
  its first letter rule (`f_bar`). The rules are written against the Regular's positions: 29 places in `normalize`,
  `clean`, `balance` and `parts` hold 78, 82, 86 or 90 as a number.
- The finished Regular no longer has Libre Baskerville's structure: 3 of 62 core characters still match it, and
  the core has 3,490 points where Libre Baskerville has 2,477 (soft corners, the nodes of 0.69 to 0.71, rebuilt
  bowls and joins). So Libre Baskerville's Bold cannot be laid over Area's Regular point for point either.

So a second run of the pipeline is not a route. What is ready: the Regular itself. Every curve of every glyph passes
its extremes at a node and bends one way (0.69 to 0.71), 465 of the core's 467 smooth curve nodes have their handles
on one line within a degree, no contour crosses itself, and every part has one construction with stated numbers.
That is what a master needs in order to be the base of another.

## The route: the Bold is the Regular's own points, moved by rule

A bold master with the Regular's exact point structure is compatible by construction. It is built the way 0.40
lightened the face (`clean.lighten`), in the other direction and by part:

1. each point belongs to a part the rules already know (stem edge, round stroke, hairline, serif tip, bracket,
   counter, bar, diagonal);
2. each part has a Bold value (table above);
3. the point moves along its outward normal by half its part's growth; counters then give back width until the
   letter's ink width is its target; heights never move;
4. the parts audit, `parts.py` and the evaluation suite run on the Bold with the Bold's targets, and one new check
   compares the two masters point for point (same contours, same point types, no handle that flips side).

Libre Baskerville's Bold stays what it is for the Regular: a measured reference for shape (how its designer let a
bowl or a join change with weight), not a source of points.

## First three steps

1. **The four control letters at Bold (no build change).** `weight.py`: the rule above for n, o, H, O only, with
   `check_bold` targets. A page with each over Georgia Pro Bold and Serrif Bold at one x-height, the Regular in
   red, words set in the two masters and at 500 and 600, and the table above filled with what was reached. The
   owner confirms or changes the four decisions below on it. Done when: the four letters meet the targets within 1
   unit, interpolate without a kink at 500 and 600 (the suite's node tests on the instances), and the owner has
   answered.
2. **The families, in the build's order.** Round and spine (c e s a g C G S Q), arch and stem (h m u r b d p q),
   diagonals, figures, then the character set through `charset.py` (it composes from letters, so it follows).
   One family per build; each build runs the parts audit on the Bold, the compatibility check in `qa.py`, and
   draws every changed letter over both references' Bold. Spacing by the same rule as the Regular's
   (`spacing.REFERENCE` measured on Georgia Pro Bold), then `fit_kerning` regenerated for the Bold.
3. **The variable font.** A designspace with the two masters and one axis, `wght` 400 to 700; `build.py` compiles
   it with ufo2ft; `STAT` and `fvar` named instances Regular, Medium, SemiBold, Bold; fontbakery on the variable
   file; the suite run on the 500 and 600 instances; the app and both pages get the weight control.

Not in these steps: an italic (a separate font, by the type-design skill's rule), an optical-size axis, weights
lighter than Regular.

## Decisions for the owner

| | Question | Recommendation | The other choice |
|---|---|---|---|
| 1 | How heavy is Bold? | Stem 140 (1.80 of Regular: the mean of Georgia Pro and Serrif) | 114 (1.46, Libre Baskerville's step): a SemiBold by the others' measure |
| 2 | How much does contrast rise? | Hairline 43 to 53 (1.22): contrast 1.9 to 2.75, still well under the references' 3.8 and 4.5 | Hold contrast at 1.9: hairline 77, a much darker, slab-like bold |
| 3 | Where does the weight go? | The mean: letters 15% wider, counters 0.79 | Georgia Pro's way (21% wider, counters 0.85: more open, takes more room) or Serrif's (9% wider, counters 0.72: keeps line lengths) |
| 4 | The route | The Bold from the Regular's own points, by rule | Draw a Bold by hand in an editor: a different way of working from everything so far, and a compatibility burden on every later rule |

## What the research adds (2026-11-14)

The starting session's report, "Variable serif weight consistency" (in the `variable-serif-typeface-eval` worktree,
`docs/research/variable-serif-research-2026-11-14/reports/`), read against this plan:

| | This plan said | The report says | Now |
|---|---|---|---|
| Technique | Each point moved along its normal by half its part's growth | Re-run the part constructions with a Bold vector; move points by role only where a glyph is not built from parts; never offset | Parts built from numbers are re-run with the Bold's numbers (`parts.py`: bowls, arches, joins, vertices; `joins.py`; `balance.py`; `charset.py`'s strokes, dots and composed glyphs). Everything else is moved by role. `weight.py` is the role route; H O n o take it, since none of their points comes from a construction that takes numbers |
| Handles | Not stated | Same tangent direction at every smooth node in both masters; control polygons that run one way | A curve is carried into the box its two nodes now span: its tension and both end directions are the Regular's. Checked on the points and half way along the axis |
| Masters | Two, 400 and 700, instances at 500 and 600 | Two, at the extremes; axis values are the stems; a geometric `<map>`; a third only where a sweep fails | As the report. The sweep found no need for a third on these four letters |
| Stem | 140 | 128, inside a band of 114 to 136 | One parameter, `weight.vector(stem)`. 128, 136 and 140 built and proofed: 140 (below) |
| Hairline | 53 at 140 | 54 at 128 (Libre Baskerville's policy: thin parts gain 0.22 of what thick parts gain) | 43 + 10 per 62 of stem: 51, 52, 53. The mean of Georgia Pro's and Serrif's ratio, the method every Area value uses. The report's value is 3 heavier at 128 |
| Serif tip | 41 | 34 | 41 at 140 (Georgia Pro 1.11, Serrif 1.65: they disagree most here; see what is open) |
| Build | ufo2ft | Fail on "incompatible masters; skipping"; `varLib.interpolatable --kinkiness 1.0`; an overweight test half way; a sweep every 25 units | All four are in `weight.py` |

## Step 1, done: H O n o at stems 128, 136 and 140 (a trial; the build is unchanged at 0.75)

`tools/weight/weight.py` builds the four letters at any stem from the Regular's own points, a two-master variable
font with the geometric map, and instances every 25 units; `proof_weight.py` draws them beside Georgia Pro Bold and
Serrif 700 at one x-height; `bold_parts.py` measures the references' other parts. All output is in
`typefaces/area-serif/build/weight/` (ignored; the proofs hold licensed renders).

Reached, at the masters (targets from `vector`; every value within 1 unit):

| | Regular | 128 | 136 | 140 |
|---|---|---|---|---|
| n stem / H stem | 78 / 86 | 128 / 136 | 136 / 144 | 140 / 148 |
| o / O round stroke | 82 / 92 | 134 / 144 | 142 / 152 | 146 / 156 |
| o / O hairline | 43 / 47 | 51 / 57 | 52 / 58 | 53 / 59 |
| H bar / n arch / serif tip | 49 / 50 / 30 | 62 / 63 / 39 | 64 / 65 / 40 | 65 / 66 / 41 |
| n branch neck | 32 | 38 | 39 | 39 |
| n counter / ink / advance | 283 / 579 / 654 | 249 / 639 / 702 | 244 / 650 / 711 | 241 / 653 / 713 |
| o counter / ink / advance | 340 / 504 / 595 | 285 / 553 / 630 | 276 / 560 / 634 | 272 / 564 / 637 |
| H counter / ink / advance | 408 / 734 / 844 | 374 / 794 / 886 | 369 / 803 / 893 | 366 / 808 / 896 |
| O counter / ink / advance | 496 / 680 / 770 | 441 / 729 / 805 | 432 / 736 / 810 | 428 / 740 / 812 |
| Contrast of o | 1.91 | 2.63 | 2.73 | 2.75 |
| n stem : counter (0.70 at most) | 0.28 | 0.51 | 0.56 | 0.58 |
| Stem / x-height | 0.150 | 0.246 | 0.262 | 0.269 |
| Stem at 500 / 600 on the geometric map | | 92.0 / 108.5 | 93.9 / 113.0 | 94.8 / 115.2 |

Checks, all three stems: same contours and point types as the Regular; no smooth node bends more than the
Regular's; no curve turns back; ufo2ft reports no incompatible master; `varLib.interpolatable --kinkiness 1.0`
reports nothing; at every 25 units the n stem is on the geometric table within 1 unit, every stroke, the contrast
and the advance rise without a step back, every counter falls, nothing is heavier half way than the masters' mean
plus 3%, and no height moves.

Whether carrying each curve with its tension is enough for a bowl and a shoulder was the report's doubt (large
changes can make them boxy). Measured as the stroke along rays from the counter's middle, as a share of the stem,
at 0, 20, 35, 45, 55, 70 and 90 degrees, on n: Area Bold 140 gives 1.00 1.01 0.96 0.88 0.75 0.55 0.39; Georgia Pro
Bold 1.01 1.04 0.99 0.88 0.74 0.56 0.40; Serrif 700 1.00 1.02 0.98 0.91 0.83 0.68 0.51. The o the same way (0, 30,
45, 60, 90, share of the round stroke): Area 1.00 0.91 0.77 0.59 0.36; Georgia Pro 1.00 0.93 0.78 0.55 0.23; Serrif
1.00 0.93 0.80 0.59 0.26. So the shapes carry their weight where the references' do; no separate bowl rule is needed
for these four.

**The stem: 140.** What each has for it:

- 140 keeps Area where it stands beside its references. Area's Regular stem is 0.83 of their mean (0.150 of the
  x-height against 0.173 and 0.189); 0.83 of their Bold mean (0.317, 0.331) is 0.269, a stem of 140. Bold is then
  1.79 of Regular (Georgia Pro 1.76, Serrif 1.84) and the 600 instance 1.48 (theirs 1.38 and 1.51).
- 128 is 1.64 of Regular: a smaller step than either reference makes, inside the report's band for interface faces
  (1.5 to 1.7). 136 matches Libre Baskerville Bold's darkness (0.262).
- In the proofs the three differ by 0.16 px of stem at 13 px and 0.77 px at 64 px. At 13 to 18 px all three read
  as bold beside the Regular and none closes a counter (the n's is 3.1 px wide at 13 px for 140, 3.2 for 128). At
  64 px 140 is visibly the darkest of the three and still lighter and more open than both references. Nothing in
  the proofs argues against 140, so the owner's instruction stands. The stem stays one parameter: `weight.py 128`
  rebuilds everything at 128.

Found on the way, not changed: the Regular's head flag on n (and every letter with that flag) marks its tip's
upper corner smooth while its 3-unit handle sits 10 degrees off the flag's line (whole-unit rounding of a 3-unit
handle). The Bold repeats it exactly, so it does not kink along the axis, but it is a smooth flag on a corner. One
rule for the families step: such corners are corners.

## The references' other parts, Bold over Regular (`bold_parts.py`)

Georgia Pro, Serrif, their mean, and what the mean makes of Area's Regular value. Libre Baskerville's own step is
smaller throughout (stems 1.46) and is in the tool's output.

| Part | Georgia Pro | Serrif | Mean | Area Regular to Bold |
|---|---|---|---|---|
| Thick diagonal (A V W M, capitals) | 1.60 to 1.67 | 1.75 to 1.77 | 1.70 | 86 to 146 |
| Thin diagonal (capitals) | 1.10 to 1.25 | 1.42 to 1.48 | 1.32 | 48 to 63 |
| k's two diagonals | 1.67, 1.70 | 1.98, 1.79 | 1.83, 1.74 | 86 to 157, 83 to 145 |
| s spine / S spine | 1.63 / 1.56 | 1.76 / 1.67 | 1.70 / 1.61 | 84 to 142 / 95 to 154 |
| Ball: a / c / f / r (widest cut) | 1.50 / 1.52 / 1.39 / 1.34 | 1.36 / 1.46 / 1.28 / 1.25 | 1.43 / 1.49 / 1.34 / 1.29 | a ball grows about 1.4, well under the stem's 1.8 |
| g: bowl stroke / level strokes / depth | 1.68 / 1.05 to 1.09 / same | 1.72 / 1.43 to 1.49 / same | 1.70 / 1.26 / same | 81 to 137 / 43 to 54 / -233 |
| e: eye height / lower counter / bar | 0.98 / 0.89 / 1.02 | 0.90 / 0.77 / 1.36 | 0.94 / 0.83 / 1.19 | 166 to 155 / 231 to 192 / 41 to 49 |
| Counter area: o / g bowl / O / D / B | 0.79 / 0.76 / 0.83 / 0.83 / 0.82 | 0.65 / 0.64 / 0.78 / 0.77 / 0.72 | 0.72 / 0.70 / 0.81 / 0.80 / 0.77 | |
| Counter area: figures 4 / 6 / 8 | 0.85 / 0.72 / 0.73 | 0.65 / 0.70 / 0.71 | 0.75 / 0.71 / 0.72 | |
| Dots: i / period / dieresis | 1.53 / 1.43 / 1.34 | 1.49 / 1.52 / 1.42 | 1.51 / 1.47 / 1.38 | 116 to 175 / 124 to 183 / 110 to 152 |
| Marks, mean stroke: acute, grave / circumflex, caron / tilde / macron / ring / cedilla | 1.28 / 1.32 / 1.32 / 1.18 / 1.13 / 1.18 | 1.41 / 1.41 / 1.53 / 1.50 / 1.43 / 1.33 | 1.35 / 1.37 / 1.42 / 1.34 / 1.28 / 1.26 | marks gain about 1.35: between the hairline's 1.22 and the stem's 1.8 |
| Marks: width / height / bottom | 1.07 to 1.27 / 1.04 / 0.99 | 1.12 to 1.43 / 1.10 / 0.99 | | a mark widens, keeps its height, and comes down about 1% of its height above the line |
| Ampersand: mean stroke / width | 1.40 / 1.14 | 1.56 / 1.14 | 1.48 / 1.14 | 70 to 103 / 736 to 837 |
| Mean stroke of a whole letter: a e g s k / v w x y z | 1.49 to 1.53 / 1.42 to 1.51 | 1.57 to 1.64 / 1.57 to 1.60 | 1.53 to 1.59 / 1.51 to 1.55 | |

Not read: the lowercase v w x z diagonals in Georgia Pro and Serrif (their cuts did not pair; the capitals' did),
closed counters of a b d p q e in Serrif (its contours are not wound the way the count expects), the ball's height
as well as its width, the ampersand part by part (only its mean stroke, width and extreme cuts).

## Next

Step 2, the families, with `weight.py`'s roles extended a family at a time and `parts.py`'s constructions given the
Bold's numbers, in the order above. Each family ends with the same checks as step 1 and its letters over both
references. Open for the owner on the first page that shows them: the serif tip (41 by the mean; Georgia Pro's
ratio gives 33, Serrif's 50) and the hairline (53 by the mean; the report's policy gives 57 at 140).

## Step 2, begun: the engine and a first pass over the letters (2026-11-14; a trial, the build is still 0.75)

Settled by measurement before the families:

- **Serif tip 41, not 34.** At one x-height the references' Bold tips are 39.5 (Georgia Pro) and 44.4 (Serrif); the
  Regular's 30 sits between their 35.5 and 27. 41 sits between them again; 34 would be thinner than both, against
  "short and blunt". On H n i in CoreText the two differ by 0.09 px at 13 px and 0.45 px at 64 px, where 34 reads a
  little sharp under a 140 stem. One value: `bold.vector(140, tip=34)` rebuilds.
- **Hairline 53**: contrast of o is 2.31 half way along the axis (1.91 at Regular, 2.75 at Bold).
- **A head flag's tip keeps its top and thickens downward** (Georgia Pro 516 to 514 and 481 to 474; Serrif 491 to
  490 and 464 to 446). Step 1 had kept the flag's slope, which dropped the top by 8: wrong, corrected.
- **A dot keeps its centre** and grows 1.51 (Georgia Pro's centre -12, Serrif's +7).
- **An arch's inner springing drops with the arch** (n's counter leaves the upright 13 and 16 lower in the
  references' Bold). Step 1 held it: corrected, the solver now lowers it by 8.
- **Lowercase diagonals** (not read before): v w x z thick 1.72 to 1.77 (Georgia Pro) and 1.82 to 1.86 (Serrif),
  thin 1.18 to 1.26 and 1.35 to 1.37. Area: 74 to 133, 39 to 50.

`typefaces/area-serif/bold.py` is the general rule, replacing step 1's hand-written places (kept in
`weight.hand_glyph` as the second method: the engine lands within 2 units of them on H O o i and within 8 on n,
where it follows the corrected springing). For each glyph it reads, on the Regular: strokes and counters (scan
lines whose ink edges sit on the glyph's own node positions), arches and bowls whose two extremes do not sit over
each other, serif reach, squared stroke ends, softened corners, ball terminals, slanted strokes (two near-parallel
straight edges with ink between), crotches (`parts.joins_of`), dots. It then solves every node position at once:
strokes exactly their Bold size, counters by the inward share, corners unchanged, heights pinned, slanted strokes
their size across themselves with their lean preferred, everything else changed as little as possible in
proportion to its length. Curves are carried with their tension; smooth slanted nodes keep the Regular's tangent.
`HINTS` names what cannot be read (e's bar, the spines of s and S).

First pass, stem 140 (`tools/weight/family.py`; sheets `build/weight/family-lower.png`, `family-upper.png`; words
in CoreText `build/weight/letters-coretext.png`):

- A two-master variable font of the 52 letters builds with no incompatible master and
  `varLib.interpolatable --kinkiness 1.0` reports nothing.
- Read and credible against both references on the sheets: a b c d e f h i j l m n o p q r s t u v y z and
  B C D E F G H I J L O P S T U V Y Z.
- Not right yet, by letter: g (ear read as a ball, link and loop not set), k (arm 89, not 54) and K, x and X
  (crossing strokes turn over), w and W (middle vertex), A (144, not 147; one corner turns back), M, N (diagonal
  109, not 149), Q (tail not thickened), R (leg not thickened).
- Of all 480 outlined glyphs: 311 come through with the Regular's structure and no kink, 56 fail a check, 27
  stop with an error, 86 have nothing read (marks, signs). None of the 311 outside the letters has been looked at.

Not started: figures, punctuation and marks as families; composites (their components must follow the bases'
anchors); the Bold's spacing (side bearings are the Regular's x 0.80 for now) and kerning; `parts.py`,
`audit_parts.py` and the suite run with the Bold's numbers; the designspace in `build.py`; both pages.

## Step 2, continued (2026-11-14, later): no tuning values, slanted strokes by construction, a measured audit

**The four tuning values are gone or measured** (`tools/weight/bold_diag.py` reads v y V A and s g in each face):

| Was | Now | Derivation |
|---|---|---|
| How firmly a slanted stroke keeps its lean | removed | Slanted strokes are no longer solved by weights. They follow `parts.vertices`, the Regular's construction: exact thickness; each edge one line through the ends that stay (a serif end, a flat's end); every corner where its two lines meet. Lean and vertex height follow from the geometry |
| How firmly heights hold in diagonal letters | removed | Heights are solved as in an upright letter and held; a corner between two slanted edges goes to the lines' intersection |
| The opening's share, 0.25 | 0.25, measured | Gap lost / what the two strokes gain across: Georgia Pro 0.09, 0.16, 0.01, 0.03; Serrif 0.38, 0.39, 0.53, 0.43 (v y V A). Mean of the eight is 0.252 |
| Thin round strokes x 1.78 | a share of the o's round stroke's gain: 1.26 for the turns of s, 1.05 for the sides of g's loop | s: Georgia Pro 1.22, 1.36, Serrif 1.22, 1.23 (in both Bolds the turns reach the o's weight). g: 0.91, 1.00 and 0.55, 1.74. The old 1.78 was wrong for s: its turns now go 62 to 143, not 110 |

New values, each with its source beside the constant in `bold.py`: the flat outside a vertex stays `parts.VERTEX`
(0.42) of its class's stem, 33 to 59 and 36 to 62 (the references' Bold flats are 0.57 and 0.39 of their stems on
v, 0.54 on V); a thick curved level stroke (g's loop at its top, Q's tail) x 1.57 (g: Georgia Pro 1.38, Serrif
1.75; Q's tail was not measured and takes g's value); lone dots x 1.47 (period) and 1.38 (dieresis).

**Rules added to the engine** (none is per letter; `HINTS` now holds only e's bar and "s's thin strokes are
turns"):

- slanted strokes as above: `slant_strokes`, `slant_lines`, `slant_place`; a cut corner travels with its edge (z);
  a flat inside a fork keeps its width (`inside_flats`); a stem under a fork stands where its two junctions keep
  their difference in height (`fork_stem`, Y);
- a curved slanted stroke is found by its facing nodes (`facing`): the spines of s and S are now read, not named;
  a stroke with one straight and one curved edge (R's leg) grows from its straight edge;
- a slanted stroke nearer level than upright (`shallow`: the top of g's loop);
- glyphs that are only dots; a curve that runs one way in the Regular runs one way in the Bold (`no_turn_back`).

**Where it stands at stem 140**

- All 480 outlined glyphs run. 423 keep the Regular's structure with no kink or turned curve; 14 fail that check
  (Astroke, Khook, dagger, dhook, dtail, nhookleft, the figure one and seven others); 43 have nothing read (wedge
  marks, guillemets, geometric shapes), so they come out unchanged.
- A two-master variable font of the 52 letters, nine figures, period, colon and ampersand builds with no
  incompatible master; `varLib.interpolatable --kinkiness 1.0` reports nothing.
- `typefaces/area-serif/audit_bold.py` measures each letter's parts again on the Bold's outlines (scan lines,
  slanted edges, necks, bounds) against their targets and exits 1 on a miss: 424 parts, 403 on target, 21
  missed, 5 other failures; 43 of 62 glyphs clean. The misses, by kind:
  - real: d's top hairline 55 (target 53); f's bar 48 (49); C's beak 48 (50); a's upper join 55 (71, the engine
    cannot reach it); R's leg 153 (150); g's loop top 128 (126); the figure one (its flag bends, its height
    drops to 689);
  - the audit could not find the part on the Bold, so unverified rather than wrong: the arches of h m n u (their
    two extremes are too far apart for its reader once the arch is 66), a's stem and foot, g's loop side, f's
    top, y's tail, J's stem beside its ball, the counters of u, six and nine, the necks of Q and one;
  - x and X read as five slanted strokes on the Bold where the Regular has four (a pairing across the crossing in
    the reader; the engine's own measure has them on target).
- Words in CoreText at 13 to 64 px, stems 128 and 140 beside both references: `build/weight/letters-coretext.png`.

Not done: the 14 and the 43 above; marks and composites (no component has been moved); figures as a family;
the references' ampersand, Serrif's closed counters and ball heights; the Bold's spacing and kerning (side
bearings are still the Regular's x 0.80, a placeholder); `parts.py` and `audit_parts.py` with the Bold's numbers;
the designspace in `build.py`; the sweep over the whole font; QA; both pages.

## Step 3, closed for the letters and figures (2026-11-14)

`audit_bold.py`: 62 glyphs, 405 parts, 405 on target, at stem 140 and at stem 128. By kind: upright strokes 92,
level strokes 81, serif tips 52, serif reach 68, slanted strokes 37, counters 28, openings 18, necks 14, balls
12, dots 2, e's bar. `family.py` (structure, kinks, turned curves) passes for all 62.

What the 21 misses were, and what changed:

| Miss | Cause | Change |
|---|---|---|
| d's hairline 55, C's beak 51, f's bar, the figure one's stem | One stroke read twice, from two nodes a unit or two apart on one edge; the two readings fought | Engine: `one_stroke`. The longer reading is the stroke; the second node keeps its distance |
| u's counter 249, six and nine | A gap from a stem to a serif's tip was treated as a counter | Engine: a counter lies between two strokes that gain |
| The figure one's height 689 and bent flag; a's upper join 55 against 71; Q's lost neck | `parts.joins_of` also returns corners that are not necks | **Target corrected**: a neck is 25 to `parts.NECK_RUN` + 2 and not on a pinned height (`necks_of`). a's 58 is its bowl's stroke at the stem, as `parts.EXPECT` already has it; it is no longer driven to 71 |
| R's leg 153, g's loop top 128 | Three whole-unit roundings in one stroke | Engine: both set exactly after rounding |
| k and K (a regression on the way) | A corner on the baseline was held where a level edge lets it slide | Engine: `_held` holds only a corner with no level edge (the figure one's flag at its stem) |
| Arches of h m n u, a's stem, g's loop, f's top, y's tail, J's stem, x and X, counters | The audit, not the letters: it matched parts by size and re-found them with the Regular's reader | Audit rewritten: it goes where the engine says the part went and measures the Bold's outline there (a cut across a straight stroke; a curved stroke between its two extremes, as the Regular's value is; a slanted stroke between its two edges through the Bold's nodes) |
| y's "stroke" of 116 | The audit's target was wrong: that is the tail's ball, which the engine already excludes | **Target corrected** in the audit |

Also in the engine: a handle that would turn its curve back is drawn towards its own node along its own direction
(the first version moved it sideways and bent the tildes by 20 degrees).

Limits of this audit, said plainly: it measures the parts the reader finds. The engine's own report covers three
kinds it does not re-measure: the spines of s and S, R's leg, g's loop top. It does not judge shape: that is the
sheets and the words proof. Counters are on target by the inward-share rule; nothing compares the Bold's counters
or widths with the references letter by letter yet.

Of all 480 outlined glyphs, 9 still fail the structure check: Astroke, Khook, Whook and the won sign (letters with
a stroke or hook, which `charset.py` builds from letters and should rebuild from the Bold's), dhook and dtail (one
node 2 degrees off), section, tildebelowcomb and the capital ring below (marks). 43 have nothing read. All are
step 4's.

## Step 4, first pass: the whole font as a Bold master (2026-11-14; a trial, the build is still 0.75)

`bold.bold_font(reg, stem)` now makes every glyph: 1,038 in, 1,038 out.

**The nine glyphs that failed.** All 480 outlined glyphs are now a sound second master by `bold.sound` (same
points; no smooth node bends more than the Regular's beyond what whole units force; no handle on its node; no curve
turned back; no kink half way; no piece of outline turned over). Five were fixed by rule: dhook, dtail, section and
the two tildes below (a handle that leaves its line after rounding goes back onto it, `straighten`). Four are not
fixed, only made safe, and say so in their report: Astroke, Khook and the won sign fall back to their upright and
level parts (their slanted strokes keep the Regular's thickness); the dagger is left as the Regular's outline (its
solve folds a piece over). `glyph_bold` applies that fallback to any glyph that fails, so nothing unsound reaches
the master.

**Marks.** `mark` mode reads a mark without the ball and facing readers (too small for them). Marks whose strokes
read as strokes go through the engine (macron, ring, cedilla, ogonek, dots). Wedges and waves (acute, grave,
circumflex, caron, tilde, and by kin the hungarumlaut, double grave, breve, hook above, horn, guillemets and the
ASCII circumflex) are widened and heightened by the references' measured ratios for the kind (`MARK`, each with its
two readings), from the foot, which holds in both references. This is a stretch: it gives the measured width and
height, and a stroke that grows less than the references' (about 1.15 to 1.25 where they have 1.35). Said plainly:
those marks are lighter than measured, and a rule for a tapering stroke is still owed. A combining mark keeps no
advance and its middle stays.

**Signs** (`bold_signs.py`, new): a sign's own stroke of 52 grows 1.37 (hyphen, dashes, plus, equals, slash, bar:
1.28 to 1.44 across both references), so 52 to 71; an upright stroke lighter than a stem in a sign 1.77 (bracket
1.76 and 1.75, brace 1.80 and 1.79), so 73 to 129; the bullet 1.22. A sign that floats has no pinned edge and
grows about its middle. Before this the dashes did not grow at all (their own top and bottom had been pinned as if
they were zones): corrected.

**Composites.** Every anchor is carried by its own glyph's node map. A component moves by what its two anchors
moved (the mark's `_top` on the base's `top`, or on the mark before it); a digraph's second letter follows the
first's advance. 178 of about 600 mark placements have no anchor pair in the Regular (`charset.py` placed them by
number): those follow the base's outline under the mark's middle. A placement check (mark's middle over its base,
gap to the base) flags 40; 28 of those are the check reading the gap over an open letter (U, n, h, k), 12 are a
mark's middle moving by 6 to 9% of the letter's width (Ecedilla, Lacute, the Vietnamese stacks on Ô): not looked
at one by one.

**Checks on the whole font, stem 140.** The two-master variable font (1,038 glyphs) builds with no incompatible
master; `varLib.interpolatable --kinkiness 1.0` reports nothing; instances every 25 units have the n stem on the
geometric table within 1 unit and the o's contrast rising from 1.91 to 2.75. `audit_bold.py` still 405 of 405 on
the letters and figures. Stem 128 builds the same way (three fallbacks instead of four).

**Known wrong or unmeasured.** The number sign's slanted strokes come out uneven (6 to 19 units along their
length). The exclamation mark's top reaches 157 where the references' mean gives 178. Guillemets take the
circumflex's ratios; their arms are measured at 1.56 and get about 1.15. The less-than sign 65 where the measured
ratio gives 75. Q's tail takes g's ratio. Not read in the references still: the ampersand part by part, Serrif's
closed counters, ball heights. Not done: an audit table for marks, signs and composites like the letters';
punctuation and figures looked at only as sheets and in the words proof.

Spacing and kerning are placeholders: side bearings are the Regular's x 0.80 and the kerning table is the
Regular's, untouched. Step 5 replaces both.

## Step 5 and build 0.76 (2026-11-14): the Bold in the build, spacing, the axis, QA, the pages

**Build 0.76.** `build.py` now also writes `build/AreaSerif-Bold.ufo` and `build/AreaSerif[wght].ttf` and `.woff2`
(weight 400 to 700, named instances Regular, Medium, SemiBold, Bold, the geometric map as `avar`). The Regular's
files are identical to 0.75: 0 of 1,038 glyphs, advances or kerning differ. `AREA_BOLD=0` skips the Bold;
`AREA_BOLD_STEM=128` builds the lighter one.

**Wedge marks.** A stretch to the measured width and height left their stroke at 1.1 to 1.2 of the Regular's where
the references have 1.35 to 1.42. They are now also swollen evenly outward, inside the same measured box, until
the mean stroke is the measured one: 42 of 46 reach all three within 1.5 units. The four that do not: the three
capital breves (stroke 56 for 64: the measured box is too small for it) and the apostrophe caron, which is a comma
and goes through the engine.

**The glyphs only made safe.** Khook has a real Bold now. Astroke and the won sign still thicken only their
upright parts: at 700 they look Regular among bold letters. The dagger and the place-of-interest sign are the
Regular's outline at every weight. Why not yet: in the first two a bar crosses slanted strokes and its edges are
read as vertex flats; the dagger's solve folds a 12-unit piece over; the last has no pinned edge and its loops
move further than the guard allows. `build/weight/debts-coretext.png` shows all of them at 700.

**An error caught late.** Twelve glyphs with a slash through them (ȼ ɇ ⱥ Ⱦ ₡ @ ≠ the superior 7 and others) had
points thrown thousands of units away, where two near-parallel edges were made to meet. `bold.sound` did not look
at how far a point had moved, so step 4 reported every outline sound when these were not. Instancing the font at
700 failed on a coordinate of 151,111 and showed it. Fixed in the rule (a corner whose lines meet more than 120
units away goes onto its own edge instead; a fitted lean more than 12 degrees off the Regular's is refused; the
same guards on inside flats and a fork's stem) and in the check (a point that moves more than 320 across or 140
up is a failure). Their slanted strokes are still thin in places (₡, Ɇ, the radical).

**Slanted strokes keep their taper.** The sweep showed the Regular's k leg widens from 61 to 87 along its length
and y's strokes taper too; the Bold had made them parallel. Each stroke now keeps the Regular's taper about the
middle of where its two edges face.

**Spacing** (`tools/weight/bold_bearings.py` writes `typefaces/area-serif/bold_bearings.json`). The placeholder
(the Regular's bearings x 0.80) is gone. Each letter's, figure's and listed punctuation mark's two bearings are
the Regular's plus what the references change from Regular to Bold, read as `spacing.py` reads them (in the
letter's zone, to the outermost ink), the mean of Georgia Pro and Serrif, scaled by 62 / 75 (Area's stem gain over
theirs). The mean change is -6.0 a side in their lowercase, -5.7 in capitals, -0.9 in figures; so about -5 in
Area. Every other glyph takes the letters' mean. The word space is x 0.98 (1.05 and 0.91). n: 41 and 34 to 35
and 31, advance 654 to 718.

**Kerning.** The Regular's pairs and groups, unchanged, so both masters share one set of groups; then the
Regular's own collision pass on the Bold's ink (`spacing.open_all`, nothing closer than 13): 8,662 pairs opened.
This is not a fit made on the Bold. `fit_kerning.json` was not regenerated for it, and no pair was compared with
the references' Bold.

**The axis** (`audit_bold.py --sweep`, in `qa.py`). The letters' and figures' audit runs on the instance at every
25 units against the targets for its own stem. It fails, on two parts: g's neck is 1.6 to 2.6 units under its
target from 475 to 650, and x's thick stroke 1.6 to 1.8 over from 525 to 625 (both come from where two lines meet,
which is not a straight line between the masters). Everything else is on target at all 13 stops, and no glyph of
the 62 has a kink or a turned curve at any stop. Not swept: the other 976 glyphs' parts, and none of the
Regular's own audits (`check.py`, `audit_parts.py`, `parts.py`, `audit_charset.py`), which hold the Regular's
numbers and would have to take a weight to mean anything between the masters.

**QA on 0.76**: targets, outlines, parts audit, joins and bowls, character set, fontbakery on the Regular: pass.
Bold audit: pass (405 of 405). Variable font: no incompatible master, `interpolatable --kinkiness 1.0` reports
nothing. Weight axis: FAIL, as above. Not run: fontbakery on the variable font; any renderer but CoreText and
FreeType; a check of Bold kerning beyond collisions.

**Pages.** Editor (version 69) has a Weight section: text at 40, 18, 16, 14 and 13 px with a weight slider, the
140 Bold beside the 128, and Georgia Pro and Serrif where installed. Evaluation (version 12) carries the 0.76
verdict, three findings (the master, the axis, what is open) and the QA lines. Both were opened in the browser
before publishing; the Weight rows were checked to load both fonts and change width with the slider.


## After 0.76: builds 0.77 and 0.78 (14 November 2026, uncommitted)

The Bold's method is unchanged. `audit_bold.py` (416 parts) and its sweep pass on the 0.77 Regular; x by a bias
on its Bold thickness, g and about twenty glyphs with a neck by a sparse master at 550. `audit_axis.py` (every
glyph, 13 stops) still FAILS: a new inflection in 43 glyphs (letters W, g, x), a crossing in 26, a stroke thinner
than the Regular's in 35, weight stepping back in 3 (capital breves). Four glyphs are on a fallback (Astroke,
uni20A9, dagger, uni2318). Bold kerning is the Regular's opened for collisions. The new alternates (g.ss02,
S.ss03, s.ss03, dollar.ss03) go through the same engine. Looked at once at 700 (build/weight/alts-bold.png): all
four are sound; g.ss02's bowl reads lighter than the stem beside it and is not measured yet.
