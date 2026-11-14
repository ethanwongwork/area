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

A thin stroke under 0.5 stems is a defect: it breaks up at text sizes. A flat-cut end (tail, beak, foot) is never
thinner than the serif tip, 30 units (0.49: c e t tails were 23, beaks 26-29; `normalize.TAIL_END`, `joins.END_MIN`).

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
| Head serif slope | 8 degrees on b d h i j k l m n p r, turned about the stem's top corner (0.50; 13.5-15 before); its corner at one height on n m p r (0.51: p and r rose to n's); u's two heads are i's flag point for point (0.67: they were level slabs, n's feet turned over) | `joins.FLAG_DEG`, `flatter_flags`, `level_flags`, `u_flags` |
| Diagonal joins (A K V W X Y k v w x y) | open side (stroke leans away from the serif): the bracket's handle shares, 0.90 / 0.70 (0.53). Closed side: a round fillet, one curve on k v w x y (handles 0.62 / 0.60, 0.54); never the steep shares there, they pinch it into a hook | `joins.steep_diagonals`, `even_fillets`, `derive.BRACKET_K_ACUTE` |
| G's bar and stem | bar top 0.48 of the cap height, stem's right edge 0.024 right of the top barb's: half the way from 0.53 to Georgia Pro, moved as one piece (0.54) | `joins.G_SHIFT`, `G_lower` |
| Figures' round ends (2 3 5 6 9) | 88 across, a half circle; the 7's beak 30 wide (0.57) | `joins.figure_ends`, `_balls` |
| Tip thickness | 30 units, 0.37 of the stem (Georgia Pro's ratio; Serrif 0.30) | `derive.TARGET_TIP` |
| Tip corners | radius 7 | `derive.SOFT` |
| Bracket | foot 0.80 stems high, head 0.85; one curve, handles 0.70 up the stem and 0.90 along the serif, on every foot and head serif (0.49, owner: steeper; 0.45 / 0.75 before, twice as full near the stem as either reference; `clean.brackets_one`, `joins.brackets_rest`) | `BRACKET_FOOT`, `BRACKET_HEAD`, `BRACKET_K_*`, `bracket_handles` |
| Capital beaks, past the arm's edge, in H stems | top E F 1.00; top T Z 1.15; bottom E L Z 1.30; middle E F 1.00 each way (most of the way to Georgia Pro's, never as long) | `CAP_BARB`, `CAP_BARB_WIDE`, `CAP_BARB_LOW`, `CAP_BARB_MID` |
| Arm flares (E F L T Z) | the arm runs straight and turns into the beak over its last 1.5 H stems, handles 0.60 along the arm and 0.25 along the beak (0.49); a lower arm leaves its stem in a fillet 0.5 stems each way (E L) | `joins.FLARE_LEN`, `FLARE_K`, `CORNER`, `arm_flares` |
| End barbs on C G S | cut end at 0.68 of the cap height (0.32 up from the baseline on S's lower one), 36 wide at the cut on all three; a slight wedge: the inside edge leans 0.10 into the cut, handles 0.62 / 0.55 (0.58: sized to the stem; 0.54 had 0.66, 42 and 0.32, sized to the cap height, too heavy). A notch and spur at the top (0.55, owner: it takes ink out of the wedge): spur top level at the cap height, 38 wide, notch 56 in from the outer edge and 36 deep, corners sharp (`barb_spurs`). Lowercase s the same at 0.9, its spur tops at the x-height and on the baseline (0.56, `s_spurs`) | `joins.END_BARB_FOOT`, `END_LEAN`, `END_BARB_W`, `END_K`, `barb_tops` |
| C's lower end | an upright face and a level cut 30 wide, corners rounded (0.52; a point before). Not c's leaning tail: that thins the stroke | `joins.C_end` |
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

Since 0.62 (`joins.round_ends2`; owner: y, g and a "more round/smooth like the c end, j tail"): y's end is a circle
r 48 drawn as j's, g's ear a circle r 46 on a one-curve underside, a's drop a half circle r 44. Sizes in stems: a 1.16,
y 1.16, c 1.18, g 1.18, f 1.09, j 1.06; r and J 1.28. A round end is never a quarter with a hump or a flat top.
e's lower counter meets the bar in a plain corner.
The arc into a round end swells as c's does, 44 to 88 with no step over 6 (`tools/joins/arc_profile.py`): check it
whenever an end is redrawn (0.63: a's first drop stayed thin for half the arc, then thickened 8 a step).

a is option C since 0.63 (owner's pick): stem 78, a later-turning shoulder, a squarer and lower counter corner
(`balance.A_OPTION`, `a_option`).

## Thick to thin (0.64, `tools/joins/swell.py`)

No stroke's thickness turns back on itself: the scan reports 0 bumps on all 62, and must after any curve change.
The fastest changes sit at ends and joins and stay at or under 0.50 units per unit (a's tail 0.53); o is 0.18.
n, h and m carry one arch: h takes n's point for point, m takes it scaled to its counters (`balance.same_arches`);
change n's arch and the other two follow. Every lowercase stem is 78 from end to end, measured as pairs of straight
upright edges (`balance.even_stems`; t 79): a stem never changes width across a bowl, a bar or the baseline.

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

## One thin system (0.58 audit, `balance.py`)

Measured across all 62 against both references; evidence and the full tables in
`docs/research/serif-typeface-2026-11-10/audit-0.58.md`, tools in `tools/joins/`. Hold these when anything changes:

| Part | Value | Rule |
|---|---|---|
| Hairline arcs | 0.55 of the class stem in both cases: 43 lowercase, 47 capitals and figures (capitals were 51) | `clean.THIN_ARCH`, `THIN_CAP` 0.525, `balance.arcs`, `CAP_THIN`, `FIG_THIN` |
| Thin diagonals | lowercase 0.50 (39; the floor, not the arcs' 43: v x y carry extra ink already); capitals 0.56 (48), M's and K's value; the 4's 43 | `balance.THIN_LOW`, `THIN_CAP_DIAG`, `DIAGS`, `diag` (per stroke; a thick stroke's edge never moves when a thin one does) |
| Thick diagonals | z 0.97, K's leg 0.97, Y's thick arm 1.02; the rest 0.93-1.04 | `balance.DIAGS` |
| Bars | f's and t's are one bar, 468 to 520; F's top arm is E's (46); z's and Z's two arms equal; z's beaks level, 30 | `balance.bars` |
| Capital thin strokes (0.67) | Level thins from the references' ratios to their O hairline (Georgia Pro / Serrif: arms 0.92 / 1.02, crossbars 1.00 / 1.08, closing strokes 1.0): arms 46 (E F L T, E and F middle arms about the flare's centre; Z 45), where P's and R's bowls close 47, A and H crossbars 49. They were 40 to 55 | `balance.cap_thins`; `audit_parts` cap thins |
| B's lower bowl (0.67) | The O's stroke (92) at the counter's extreme, at most 1.5 over along either quarter. Measure a round across the stroke, never on a level scanline: a short bowl reads 5 to 7 units heavy on a scanline | `balance.B_lower`; `audit_parts` cap rounds (5%) |
| Figures' flat strokes (0.68) | 2's base, 5's flag, 7's top: 73, 0.85 of the capital stem (Serrif and Source Serif 4 0.86, Georgia Pro 0.82). They were 80, 77, 72 | `balance.fig_flats` |
| An extreme beside a spur or junction (0.68) | The short curve from the extreme to the notch: both handles at 0.57 of their reach, the handle at the extreme solved so the curvature equals the long arc's (curvature = 2/3 x far handle's offset / handle squared). C G S s | `joins.even_extremes` |
| A curve into a straight (0.68) | The curve's handle lies on the straight's own line (under 1 degree); fillets with handles under 12 units are exempt (whole units cannot hold them) | `clean.true_joins` |
| Nodes (0.69) | Every curve passes its leftmost, rightmost, highest and lowest point at a node and bends one way only: a curve that does not is cut there by de Casteljau (the outline does not move; new points on whole units; an extreme's handles level or upright; an inflection's handles on one line; the old nodes keep their directions). Not cut: a piece under 8 units, or an inflection whose handles whole units would bend by over a degree | `clean.add_nodes` |
| Seams (0.69) | After charset joins two outlines, a curve that runs into a straight leaves on the straight's line (up to 15 degrees turned): f ligatures, Œ, carons | `clean.true_joins(rest, max_deg=15)`, last in `normalize` |
| 5's heel (0.69) | The short curve from the heel's lowest point bends one way: handles a third of the run each, level at the heel and on the bowl curve's direction at the other end | `clean.five_heel` |
| Capital serifs (0.70) | 77 from the stem on every upright capital stem, head and foot, both sides (they were 76 or 77) | `balance.cap_serifs` |
| Zero (0.70) | Sides 87, 0.94 of the O's 92 (Georgia Pro 0.92, Serrif 0.96): a narrow closed counter carries less. Only the counter moves; top and bottom stay on the figures' 47 | `balance.zero_weight`, `ZERO_SIDE` |
| Two curves at a node (0.70) | Handles on one line (under 1 degree) where they were 0.6 to 4.5 degrees apart in the core, up to 9 outside it (ct, st, cent); handles under 8 units are fillets | `clean.true_curves` |
| An S between parallel tangents (0.70) | Each handle 0.40 of the run (3's hook had 0.50 and 0.50, which meet and turn twice) | `clean.even_s` |
| Letters with a stroke or bar (0.70) | Merged with their stroke in the source, scraps under 60 square units dropped; never left to the TrueType build's overlap removal | `normalize` (end) |
| r's width (0.68) | The letter is the owner's (long right foot, 1.67 stems). Its advance is 0.682 of n, the mean of Georgia Pro and Serrif, from 15 units of white on its right; it was 0.659, the narrowest of nine faces, though its ink is the widest | `spacing.R_AIR` |
| Stems | t 79; the 5's bowl 92 like every figure | `balance.stems` |
| Heights | flat tops on their line (A 712, 4 712), round ones on the overshoot (530, 721, -10, -9), the 1 as tall as the 0, f as tall as the ascenders | `balance.heights` |
| Head serif tip | 30, as the feet | `joins.flatter_flags` |
| C G S barbs | sized to the stem, never to the cap height: 36 at the cut (0.42 H stems), lean 0.10, cut at 0.68, spur 38, notch 56 in | `joins.END_BARB_W`, `END_LEAN`, `END_BARB_FOOT`, `SPUR_W`, `NOTCH_IN` |
| Serifs on leaning strokes, lowercase (v w x y) | past the stroke's own edge at the serif's inner edge: 0.90 stems (70) on the closed side, 0.58 (45) on the open side (0.60; they ran 1.11-1.42 and 0.48-0.92). Capitals follow the references and the owner's V and Y | `balance.LEAN_CLOSED`, `LEAN_OPEN`, `lean_serifs`; measure with `tools/joins/diag_serifs.py` |
| s's bowl strokes | 66 and 68 units node to node (0.60; 68 and 74) | `clean.S_LOW` |
| w | ink width within 2.5% of Georgia Pro's (0.61: the body stretched 7%, strokes and serifs reset after); thick strokes 0.94-0.97 like v x y | `balance.W_WIDER`, `widen_w`, `DIAGS` |
| e's right stroke at the bar | 1.09 stems; outside corner 20 x 34 | `joins.e_junction` |
| e | left stroke above the bar 0.94-1.04 stems (the eye wider on the left); bar 41, from its underside; lower arc 51, c's (0.59) | `balance.E_EYE_LEFT`, `E_BAR`, `clean.THIN_FLOOR` e bottom 0.62 |
| g | ear 0.23 x past the bowl (0.27), neck 63 like r's, loop top stroke about 1.03 stems, loop lower arc 43 (0.59). Bowl and loop keep the references' widths | `balance.G_EAR_IN`, `G_EAR_NECK`, `G_LOOP_TOP`, `G_LOOP_THIN`, `e_g` |

Ink is judged as area / (class stem x zone height) against both references and the class median (`audit_area.py`): a
glyph more than 4% off against both is out of balance. A proportion copied from a heavier reference is scaled by the
stem, not by the height (0.54's barbs were not, and C and S gained 10 to 14% ink).

**Fit (0.66).** Sides, tracking and kerning are measured against both references with `tools/fit/fit.py`; kerning lives in `fit_kerning.json` and must be regenerated after any bearing change (see `area-serif-construction`, Fit). Vertices (v w y A M N V W): a flat outside, a point inside, `parts.vertices`.

**Parts (0.65).** Joins, bowls and arches are built in `parts.py`, one construction each: read the
`area-serif-construction` skill before touching one. A curve meets a stem at a point on the stem's edge (never a flat),
with a 32 neck on every branch and 54 on the two run-ins; b d p q are one bowl; u is n's arch turned half round; a's
lower stroke is a branch. `parts.py` in `qa.py` fails on any drift. `pathlint` fails on a contour that crosses itself.

Still off and open with the owner (audit note): g (+15%, its hairline length), a (+10%), e (+8%), y (+6%, its end), s, Q's tail, I, 7.

Proofs about alignment between glyphs are drawn with `tools/joins/plain.py` (outlines, HarfBuzz kerning, no grid fitting): PIL's text drawing fits each glyph on its own and can show level serifs a pixel apart.

## Open with the owner (0.49)

Proposals on the review page and in `evaluation-0.49.md` (flatter head serifs built in 0.50): contrast kept at
1.9, the three join scans every build.
`evaluate.py` reads the 0.49 bracket as a flat arc (114): teach it the bracket or ignore that count.

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

Figure 1 and 4 stems lighter than capitals; shoulder thickness n 0.55 to m 0.62; a's straight
bowl top; widths of r g k x y K W X; spacing (lowercase keeps its advance when serifs shorten, capitals keep their
side bearings); kerning; punctuation; the weight axis.
