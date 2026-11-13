# Area Serif: design guidelines

What Area Serif is, part by part, with the value each part holds and the rule in code that holds it. Read this
before changing any glyph. A change that breaks a line here is a design change: ask the owner, then change the rule
and this file together. Numbers are in n stems (78 units since 0.40; values set by rules that run before `clean.lighten` are written against the 82-unit stem those rules see) unless a unit is named, as of build 0.48.

## Direction (owner, 2026-11-10 to 12)

- **Purpose.** A legible serif for interface text and body copy on the web.
- **Shapes toward Georgia Pro, details from Serrif** (owner, 2026-11-12, 0.34: "match the shapes more closely to georgia
  pro ... use the tails, ears, loop, spurs, ball terminals, etc of serrif ... dont make drastic changes"). Bowls,
  counters, bars and arms follow Georgia Pro, drawn a little rounder; tails, ears, loops, spurs and round ends follow
  Serrif. Adjust in small steps, part of the way, and compare by drawing the letter over Georgia Pro at the same
  height, aligned on the stem.
- **Widths from Georgia Pro.** Each letter's ink width over its own height follows Georgia Pro's.
- **Serifs toward Georgia Pro.** Shorter and blunter than Serrif's; not sharp.
- **Weight lighter than both.** Georgia Pro is "a bit too thick overall for regular weight". The stem sits at a
  sans's weight, and contrast is low so thin strokes hold at 12–13 px.
- **Outlines.** No point without a job; small rounded corners on serif tips stay; thick to thin is gradual.
- Never name the references in the font or its docs for users. Their outlines are measured, never copied.

## Weight and contrast

| Part | Value | Rule |
|---|---|---|
| Lowercase stem | 78 units, 0.150 of the x-height (Inter 0.161, Serrif 0.173, Georgia Pro 0.189). The pipeline draws 82; `clean.lighten` takes 2 units off each upright edge at the end (owner, 0.40: lighter stems) | `derive.TARGET_STEM`, `clean.LIGHTEN` |
| Capital stem | 86 units, 1.10 (90 before `lighten`) | `derive.TARGET_CAP_STEM`, `clean.LIGHTEN` |
| Lowercase round stroke, thickest | 1.05, 86 units (o b d p q c e; 1.12 until 0.39, owner: thin the thick strokes) | `derive.ROUND_TO_STEM`, `thin_rounds` |
| Capital round stroke | 1.07 H stems, 96 units (O Q C D; 1.13 until 0.39) | `derive.ROUND_TO_STEM_UP` |
| Figure round stroke | 1.17 | `normalize.FIG_ROUND` |
| Contrast, o and O | 1.91, 1.8 (2.14 in 0.38, 2.00 in 0.39) (Serrif 2.9, Georgia Pro 2.7). 1.64 until 0.38, when the thins took one value by thinning the bowls (owner: "id actually prefer to make the thicker parts thinner") | `clean.THIN_ARCH`, `check.py` |
| Thin horizontals | H A crossbars 0.63, t 0.60, T E arms 0.57, e bar 0.52 | `normalize.E_BAR`; the rest from derive |
| Thick diagonals / thin diagonals | 1.03 / 0.52 before lightening (v w y): level with n's stroke | `DIAG_THICK`, `DIAG_THIN` |

A thin stroke under 0.5 stems is a defect: it breaks up at text sizes.

## Evenness (0.36, `clean.py`)

One value where a part repeats. Measure the spread before adding or changing a glyph; a new spread is a defect.

| Part | Value | Rule |
|---|---|---|
| Stems, bars, serif faces | exactly upright or level; no line 1-3 units off an axis | `true_lines` |
| Thin point, lowercase: bowls, arches and open tops (o b d p q n h m u c e g a s) | 0.52: the arches' own value; the thicker ones come down to it, never the thin ones up (owner, 0.38) | `THIN_ARCH`, `THIN_FLOOR`, `thin_floor` |
| Thin point, capitals (O Q C G S, D's bottom) | 0.57 | `THIN_CAP` |
| Where the arch meets the right stem (n h m) | 352 outside, 348 inside: straight to 0.73 / 0.71 of the x-height | `SHOULDER_OUT`, `SHOULDER_IN`, `shoulders` |
| Bowl quarter's handles | 0.57 of the reach outside, 0.61 inside (o c e b d p q, O Q C G D, 0 6 8 9, S s) | `TENSION_OUT`, `TENSION_IN`, `even_tension` |
| End barb's cut face (C G S s) | upright | `barb_faces` |
| Arm beak's cut face (E F L Z z) | leans 4.6 degrees (4.0-4.3 after rounding) | `BEAK_LEAN` |

`thin_floor` moves the counter's extreme point, never the outside. `even_tension` runs before and after `harmonize`.
Evidence: `docs/research/serif-typeface-2026-11-10/evaluation-0.36.md`.

## Heights

x-height 520, capitals 712, ascenders 1.50 x, descenders 0.43 x. Overshoot 1.9% (o), 1.3% (O).
`derive.X_HEIGHT`, `CAP_HEIGHT`, `ASC_RATIO`, `DESC_RATIO`.

## Widths

Target: Georgia Pro's ink width / height (x-height for lowercase, cap height for capitals, the 1's height for
figures). A letter more than 2.5% off is brought to it by `normalize.set_widths`, which stretches the counter only:
one zone between the letter's upright parts moves in proportion, so stems, round-stroke weights, serifs, beaks and
terminals keep their size. Side bearings stay; the advance follows.

- Set this way in 0.33: o c z, O Q D P T Z E F N U H, 0. B has its own rule (below).
- Within 2.5%, left alone: a b d e h n p q s u, A C G L M R S V Y, 2–9.
- Not matched, on purpose: i j l f t I 1 (their width is stem plus serifs, and Georgia Pro's stem is a fifth
  heavier); r g k x y K W X (an ear, a tail or diagonals carry the width; open with the owner).
- The arch family (n h m u) is one family: n's and h's counters are equal, m's and u's 0.97 of them
  (`COUNTER_TO_N`). Change them together or not at all.

## Capitals with bowls and arms

| Part | Value | Rule |
|---|---|---|
| B's bowls, from the stem's left edge | lower 0.690 cap, upper 0.622 (upper / lower 0.90; Georgia Pro 0.92) | `B_LOWER`, `B_UPPER`, `B_bowls` |
| B's counters | D shapes: level along the bar, round turn (handles 0.62), widest at 0.28 and 0.77 cap | `B_COUNTER_K`, `B_WIDEST` |
| B's bar at the stem, bowl strokes | 46 units; 1.13 and 1.09 H stems | `B_BAR`, `B_STROKE` |
| E's and F's middle arm | straight for half its length, then the flare every arm barb has | `MID_ARM_STRAIGHT`, `BARB_K` |
| A's crossbar, e's bar | 0.39 cap; 0.60 x-height (part of the way to Georgia Pro's 0.378 and 0.575) | `A_BAR_DROP`, `E_BAR_DROP` |

A counter beside a bar runs level along it before it turns; it never sweeps away from the stem at once.

## S, the arch, the e

| Part | Value | Rule |
|---|---|---|
| s | bowl strokes 68 and 74 units node to node (0.76, 0.82 H stems; the lower never much heavier than the upper); spine the o's round stroke | `S_LOW`, `S_SPINE`, `s_balance` |
| t | top at 1.29 of the x-height (owner, 0.41); bar's right end at 0.94 of the width | `T_RISE`, `T_BAR_OUT` |
| r | arm and end fitted to Serrif's measured profile (owner, 0.45: "copy serrifs r as close as possible, and then just make it a bit wider"): top one curve from the notch (2, 412) to the end's top with handles 0.15 / 0.78 (0.46), underside from 330 on the stem to a peak at (88, 465) with 0.25 / 0.60, end radius 50, eased at its top (`RS_TOP_EASE`); then the end 18 units further out and the arm stretched to it (reach 224). Measured, never its points | `RS_*`, `r_top_measured` |
| S | ink width 0.693 of the cap height; upper-left and lower-right strokes 0.93 and 0.98 H stems; barbs as C and G | `S_WIDTH`, `S_STROKE`, `S_TOP_IN`, `S_redraw` |
| Arch (n h m) | the inner arch leaves the stem at 0.63 of the x-height and peaks near the middle of the counter; one family | `ARCH_BRANCH`, `ARCH_PEAK`, `arch_branch` |
| e | bar's top at 0.615 of the x-height, 0.52 stems thick; eye 0.32 of the x-height; right extreme at 0.62; bottom 0.70; tail Serrif's | `E_BAR`, `E_BAR_DROP`, `E_EYE_IN`, `e_follow` |

When the owner asks to copy a licensed reference's letter, the answer is this same method at higher resolution: sample
its profile densely (every 10-12 units), fit Area's own curves to the samples, report the fit's error, and say so.

A letter is "redrawn to match" a reference by measuring the reference's proportions (width over height, where each
extreme sits, each stroke's weight, where each end stops) and setting Area's own points to them. Never by its points.


| Part | Value | Rule |
|---|---|---|
| Lowercase foot and flag length | 0.85 (Georgia Pro 0.78–0.84, Serrif 0.92–0.95) | `FOOT`, `FLAG`, `normalize_feet`, `normalize_inner_feet`, `normalize_flags` |
| Descender feet (p q), f's right foot | stem side 0.85; bowl side a quarter longer | `DESC_FOOT`, `F_FOOT_RIGHT` |
| r's right foot | 1.6 (owner, 0.43: longer; 1.22 before) | `R_FOOT_RIGHT` |
| Capital serif length | 0.85 of H's stem (0.94 n stems), every capital including U's four | `CAP_SERIF`, `cap_serifs`, `cap_right_feet`, `U_head_serifs` |
| Tip thickness | 30 units, 0.37 of the stem (Georgia Pro's ratio; Serrif 0.30) | `derive.TARGET_TIP` |
| Tip corners | radius 7 | `derive.SOFT` |
| Bracket | foot 0.80 stems high, head 0.85; one curve, handles 0.45 up the stem and 0.75 along the serif, on every foot and head serif (`clean.brackets_one`, 0.46: head serifs had 0.73-0.80) | `BRACKET_FOOT`, `BRACKET_HEAD`, `BRACKET_K_*`, `bracket_handles` |
| Capital beaks, past the arm's edge, in H stems | top E F 1.00; top T Z 1.15; bottom E L Z 1.30; middle E F 1.00 each way (most of the way to Georgia Pro's, never as long) | `CAP_BARB`, `CAP_BARB_WIDE`, `CAP_BARB_LOW`, `CAP_BARB_MID` |
| End barbs on C G S | 1.45 past the stroke's inner edge, 42 wide | `CAP_END_BARB`, `CAP_END_W` |
| Lowercase barbs (s z) | s 1.32 and 1.46 H stems in all, z 1.45 and 1.56: just under Georgia Pro's | `LOW_BARB_TRIM` |

Every serif of a kind is one length. `audit_parts.py` fails QA on a lowercase outlier; for capitals and the feet it
does not cover (inner feet, p q f, P R, U) measure with a scan before and after a change.

## When a corner is rounded

- **Rounded (radius 7): every stroke end that is cut flat.** Serif tips; beak and barb ends (E F L T Z z, C G S s);
  bar ends (f t); tail cuts (c e t); figure ends (the 1's flag, the 2's base, the 3's middle, the 5's flag, the 7's
  beak). Both corners of the cut are rounded, or neither: a pointed end stays pointed (a's tail, the 7's foot, the
  4's left point). On E F L T Z z 2 5 7 the beak's outer corner on the height line is rounded too.
- **Sharp: a point that is not an end.** Apexes and vertices (A M N V W v w); the top corner of a stem under its flag
  (b d h i j k l m n p r u); a stem's bottom without a serif (b d q u); joins and crotches; where a barb leaves its
  curve (C G S s).

`normalize.soften_ends` (and `derive.soften` for serif tips). A new glyph follows the same two lines.

## Round ends (ball terminals)

One family after the g's ear: the end's outer quarter is a circle, radius 40–47, an upright point at its side and a
level point at its top or bottom. Sizes: a 1.02, j 1.02, f 1.04, g's ear 1.07, r 1.09, c 1.12. y and J are larger
(1.27) from the owner's edits. The c's end is centred at 0.75 of the x-height and its inner edge runs into the ball
in one curve. i's and j's dots are circles. `round_ends`, `END_R`, `END_RADIUS`, `END_CENTRE`, `round_dots`.

## Curves

- Quarter arcs carry handles near 0.56–0.62 of their reach (`FIG_KAPPA`, `LETTER_KAPPA`); a bracket is the one
  lopsided curve by design.
- At a smooth point both curves bend equally: `harmonize` slides the two handles along their line (at most 14
  units, never the point). Run `evaluate.py` before and after any curve rule; "jumps" should not rise.
- Bowls swell from thin to thick within 0.07 stems of an ideal curve (measure with a ray profile if a bowl changes).
- A point exists at each extreme of a bowl or arch. The diagonal joins are one curve each (owner's choice), so they
  carry no point at their extreme.

## The owner's points

A point the owner moved lands where they put it (`owner_edits.json`, applied by position). A save made on build 0.34 or later
is folded as `by_position_end` (from, to, on/off for each moved point): it is matched on the finished points, after
every rule. A save made on 0.40 or later is folded as `by_position_final` (x from the ink's left edge, y; from and
to), matched after lightening and spacing (`clean.owner_final`). Rules may ease the
handles beside it. A rule that moves many serif points can shift the fold-in's reference: after any serif change,
compare the owner-moved points of r, y and V with the previous build.

## The character set (0.47, `charset.py`)

Everything beyond a-z, A-Z and 0-9 is made from the finished letters, in this order, so a change to a letter reaches
every glyph built on it. Inventory, gap list and measurements: `docs/research/serif-typeface-2026-11-10/charset-0.47.md`.

| Part | Value | Rule |
|---|---|---|
| Lightening | every own outline, punctuation, symbols and accents too (2 units off each side of an upright stroke) | `lighten_rest` |
| Letter plus a part | the letter's own outline and a bar or slash of its own thin bar (H's crossbar, t's bar); placed from Serrif in stems (`BARS`, `SLASHES`) | `bars` |
| Dotless i, j | i and j without the dot (every accented i and j is built on them) | `dotless` |
| f ligatures | fi = f and dotless i; fl fb fh fk: f's arc level into the ascender, which drops its flag; ff joins the bars; ft runs f's bar into t's; carets at each letter | `ligatures` |
| æ œ Æ Œ | the e's left stroke is the a's stem or the o's right side; E's stem replaces A's right leg or O's right side, without E's serifs there | `diphthongs` |
| Superiors, inferiors, ª º | 0.54 of the figure height, then 4 units a side heavier (1.16 of the weight the size implies; Serrif 1.15); inferiors stand on the baseline, as fractions use them | `SUP_SCALE`, `SUP_BOLD` |
| Hyphen and dashes | 0.66 n stems (the minus's 52 units), centred at 0.53 of the x-height | `DASH`, `DASH_Y` |
| Maths signs, tabular figures | one advance, the tabular width (612: the widest figure plus 36 a side) | `tabular`, `math_widths` |
| Arrows, maths, interface | square cuts, the minus's weight, on the maths' axis; where a letter has the shape, the letter (∑ Esh, ∫ esh, ∂ the 6 turned, ∏ H's stems, Ω O opened) | `arrows`, `maths`, `interface` |
| Figure joins | 6 and 9: counter's corner 44 units from the crotch; 8: spine 11 units thinner from each side; X: 0.95 of K's leg | `figure_join_corners`, `eight_spine`, `X_DIAG` (clean.py) |

| Vietnamese marks | hook above: open curve over a tail, round end, the acute's size; horn: thick spur tapering to a round end, up to 1.20 x (1.14 cap) | `HOOK`, `HORNS` |
| Two marks | a tone meeting a circumflex sits at its upper right (`BESIDE`, `BESIDE_DROP`); a tilde, or a tone over a breve, stacks 22 units above | `vietnamese` |
| Composites and anchors | a composite on a rebuilt base takes its advance and moves its marks with it; every base's top and bottom anchor is where its precomposed letters put their marks, so typed accents match | `follow_rebuilt`, `align_anchors` |

A new glyph is added to `charset.py` (and `COVERAGE` when it is required), never drawn into the UFO by hand. After any
change that moves a base letter, look at its accented forms and at the same base with a typed combining accent.

## Final-pass audit (0.46)

Scratch tools worth keeping if this is repeated: a stroke-weight scan (shortest crossing through sampled ink, per
glyph, against its class), a pair-fit scan (white between every pair, with kerning), a redundant-point scan
(collinear nodes, segments under 3 units, curve nodes one curve could replace), beside `evaluate.py` and the
straightness scan. `clean.tidy` removes collinear and tiny-segment nodes at the end of every build. State at 0.46:
flat 3, jumps 27, wobble 1, redundant points 0, leaning lines 17 (all by design).

## Checks before publishing

1. `build.py` last, then `qa.py` (targets, outlines, parts audit, fontbakery).
2. `evaluate.py`: no new kinks; jumps and flat arcs not higher.
3. Serif lengths and widths by scan for every glyph the change touches.
4. Every changed glyph drawn over the previous build and over Serrif (and Georgia Pro for width).
5. One known point checked in the generated page, the build's entry in `changes.json`, `BUILD` bumped.

## Spacing and kerning (0.38, `spacing.py`)

- **Bearings** of a-z and A-Z follow Georgia Pro's fit: measured in the letter's zone (baseline to x-height or cap
  height) to its outermost ink, scaled to Area's heights, plus one offset per case (`REFERENCE`, `TRACK`: n 6 units a
  side tighter than Libre Baskerville's scaled bearings, H 3). Equal white area (HT Letterspacer) was tried and sets
  a serif face's rounds and diagonals too loose. Word space 250.
- **Kerning** is Libre Baskerville's, each pair moved by its two bearings' change beyond the tracking (`rekern`);
  then no pair's ink is closer than 22 units (`MIN_GAP`, `open_collisions`).
- Accented letters take their base's shift and advance. Figures, punctuation and the fi fl ligatures keep theirs.
- `spacing.run` is the last step of `normalize`: any outline change re-spaces. Check with a shaped text proof
  (HarfBuzz; PIL's basic layout does not apply GPOS kerning).

## Ink balance (0.41)

Every stroke is measured across the stroke (shortest crossing through sampled ink) and compared, as a ratio to n's
or H's, with the same measure on Georgia Pro. A stroke more than 7% over its class is brought down; thin ones are
reported, not thickened (owner). Held: T's stem equals H's (`T_STEM`); the 1's and 4's stems equal H's and the 1 is upright (`FIG_STEM`,
`figure_stems`; owner, 0.42: thicken), the 7's diagonal 0.66 n stems (`SEVEN_DIAG`); 6's and 9's long stroke equals their bowl stroke and 8's waist
band is 1.23 H stems (`figure_joins`, `EIGHT_WAIST`), and since 0.47 6 and 9's join 1.12 and 8's spine 1.06-1.09 (`figure_join_corners`, `eight_spine`); N's and M's thick diagonals within 5% of H's
stroke (`N_DIAG`, `M_DIAG`); v w y level with n (`DIAG_THICK`); S's spine 6% over (`S_SPINE_CAP`). Grey per advance
is reported too but follows spacing, so it is not a target.

## Lightening (0.40, `clean.lighten`)

Weight changes come off the finished outlines, never from `derive.TARGET_STEM`: the rules and the owner's saves are
keyed to positions drawn at an 82-unit stem. Each point moves toward its ink by `LIGHTEN` times the sideways part of
its outward direction; softened corners move as one piece; a circle quarter's nodes do not move, so round ends stay round; `bracket_handles` and `true_lines` run after; dots are
skipped; `spacing.run` follows. Applies to every letter and figure with its own outline.

## Open with the owner (0.47)

Not built (Vietnamese done in 0.48): Ŋ ŋ ĸ ß ẞ and the Extended-B / IPA letters keep Libre
Baskerville's drawings, lightened; c_t s_t s_p; oldstyle figures and small caps; the new geometric glyphs have had no
owner's look. 0.47 closed: 6 and 9's join, 8's waist and spine, X heavy, tabular figures, fi fl re-spaced and rebuilt,
figure and punctuation spacing (checked against Georgia Pro in shaped text; bearings kept).

## Open with the owner (0.43)

The r is option C from `img/r-options-0.43.png`, drawn rounder (0.44). To make an option sheet, build with the `AREA_R_*` environment values (normalize.py, clean.py) and render with a shaped-text
script. (6 and 9's join, 8's upper left and X: closed in 0.47.)

pathlint warnings rose from 181
to 220 (whole-unit rounding at smooth nodes, none an error), 249 at 0.47 (pathops output on the rebuilt glyphs); thin horizontals (H A 0.63, t 0.60, arms 0.57) against the 0.52 thins; D's top, B and P thins 0.50-0.57; foot brackets 0.80 to 0.70 (needs r's and q's feet first);
the research note's list (quieter figures, spacing and word space, kerning, Regular weight or a grade
axis, button metrics): see evaluation-0.36.md. The 1's stem tapers 15 units; figures' thin points 0.49-0.56.

u's bowl (the n's old arch upside down).

G's bar height (0.51 cap, Georgia Pro 0.45); the size of top and bottom beaks on E F L T Z; P's bowl depth; a's bowl;
J on the baseline. Carried from 0.33:

Figure 1 and 4 stems lighter than capitals; shoulder thickness n 0.55 to m 0.62; u's level head serifs; a's straight
bowl top; widths of r g k x y K W X; spacing (lowercase keeps its advance when serifs shorten, capitals keep their
side bearings); kerning; punctuation; the weight axis.
