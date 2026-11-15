---
name: area-serif-construction
description: Builds and checks Area Serif's letters from shared parts (stems, bowls, arches, joins, spurs, serifs, ends), each constructed once from stated numbers and reused, never drawn per letter. Use whenever the owner says parts look inconsistent, uneven, custom, random or unpolished; when a join, crotch, neck, bowl, arch, bracket, terminal or thick-to-thin transition is added, changed or reviewed; when a vector fault (a crossing, sliver, stray point, flat cut) is reported; when deciding what value a new point should take; and before calling any round of letter drawing consistent.
---

# Area Serif construction

Area Serif is assembled, not drawn. A letter is a list of parts; a part is one construction with stated numbers;
the same construction is placed, mirrored, turned half round or scaled wherever the part recurs. This skill holds the
part system, the research behind it, and the checks that prove a build follows it. `area-type-design` is the wider
procedure (owner loop, build, page, records); read it first, then this before touching any outline.

Owner, 2026-11-13: "the bezier curve patterns should be replicated and slightly modified, not custom drawn for each
letter. all points should be mathematically, optically, and technically calculated to be correct and consistent with
the entire typeset. nothing should be random, everything should be intentional. the width ratio of thick to thin
should be consistent, smooth."

## Hard rules

1. **Find the part before moving a point.** Name the part the point belongs to (table below). If the part has a
   rule, change the rule's number; every letter that carries the part moves with it. If it has none, measure the
   part on every letter that has it and on both references, write the rule, then build.
2. **No number without a derivation.** A value is (a) measured on both references and scaled by the stem, (b) solved
   from another Area value (a neck from the hairline, a crotch height from the neck), or (c) the owner's pick. Write
   which, beside the constant. A value chosen because it looked right on one letter is not allowed.
3. **Solve, don't nudge.** Where a point depends on a thickness (a crotch on a neck, a counter on an arch), a solver
   places it: `parts.solve` walks the stem's edge to the height where the neck is the target.
4. **One letter is the control.** n for arches, the b d p q bowl for bowls, o for round strokes, H for capitals.
   Other letters take the control's points, moved, mirrored, turned half round, or scaled across the counter only
   (stems never scale).
5. **Geometry, not point numbers.** Final-stage rules (`joins.py`, `balance.py`, `parts.py`) find nodes by what they
   are (a level extreme, a corner on the stem's edge), so an earlier change in numbering cannot break them.
6. **Every rule gets a check that fails the build** (`parts.check`, `audit_parts.py`, `pathlint.py`). A rule without
   a check drifts within three builds; this face has done it twice (arches at 0.64, joins at 0.65).
7. **Proportions from a heavier reference scale by the stem, not the height** (0.54's barbs, sized by cap height,
   made C and S 10 to 14% heavy).
8. **Never copy a reference's outline.** Georgia Pro and Serrif give numbers only (`area-type-design`, Hard rules).
9. **A smooth curve can still be wrong.** After every rule change, draw the part on every letter that has it, at one
   scale, before over after (`tools/joins/joinsheet.py`), and words with `tools/joins/plain.py`. Look before
   publishing.

## The thick-to-thin ladder

One ladder for the lowercase (units per 1000; a stem is 78). Capitals and figures use the same ratios on their own
stem (86), except where the table says otherwise.

| Step | Units | Of the stem | Where |
|---|---|---|---|
| Stem | 78 | 1.00 | every upright (round strokes at their widest are set by `derive.thin_rounds`) |
| Thick diagonal | 73 to 76 | 0.94 to 0.97 | v w x y z k |
| Run-in neck | 54 | 0.69 (1.25 hairlines) | a bowl's thin stroke running into a stem's end: d top, p bottom |
| Arch at its top | 50 | 0.64 | n h m; u's bowl at its bottom; a's lower stroke at the counter's lowest point |
| Hairline | 43 | 0.55 | round letters at top and bottom (capitals and figures 47) |
| Thin diagonal | 39 | 0.50 | v w x y (capitals 48) |
| Branch neck | 32 | 0.41 (0.74 hairlines) | every stroke that leaves a stem as an arch does |
| Serif tip | 30 | 0.38 | every serif's end |

Along any one stroke the thickness moves through this ladder in one direction, with no step back: `swell.py` reports
the fastest change (under 0.5 units of thickness per unit travelled on a branch, under 0.2 on o and c) and any bump.

## The parts

| Part | Construction | Letters | Rule | Check |
|---|---|---|---|---|
| Stem | 78 wide (capitals 86), edges upright, **straight through every join**: up to the head serif's corner, down to the baseline | all | `balance.even_stems`, `stems`; `parts` for edges at joins | `audit_parts`, `check.py` |
| Bowl | One bowl, measured from the stem's bowl-side edge: outer extremes 161 out at top and bottom, 414 out at mid-height 260; counter 153 and 332; counter top 487, bottom 33; counter straight on the stem from 220 to 300; tension 0.57 outside, 0.61 inside | b d p q (d q mirrored; q is b and p is d turned half round) | `parts.bowl`, `_counter` | `parts.check`: counters identical, turned pairs identical |
| Branch | The stroke leaves the stem at a **point on the stem's edge** (never a flat cut); the crotch's height is solved for a 32 neck; the outer curve leaves by the vector (53, 64), 40 degrees off the stem, and its handle at the extreme is 0.40 of the run | b p top; d q bottom; n h m r; u; a's lower stroke | `parts.bowl`, `parts._join` | `parts.check`: neck 32 +/- 1.2, leave (53, 64), no flat |
| Run-in | A point on the stem's edge, solved for a 54 neck; handles 0.37 / 0.28 / 0.62 | d top, p bottom | `parts.bowl` | `parts.check` |
| Spur | Tip 23 into the stem and 66 up, base 65 in on the baseline | b foot; q head, turned half round | `parts.bowl` | `parts.check` (turned pair) |
| Arch | n's, point for point on h; scaled across the counter on m (0.97); turned half round on u (0.968) | n h m u | `balance.same_arches`, `parts.u_from_n` | `audit_parts`, `parts.check` |
| a's lower stroke | A branch at the stem; 50 thick over the outer edge at the counter's lowest point | a | `parts.a_join` (after `balance.a_option`) | `parts.check` |
| Head serif (flag) | 8 degrees, tip 30, one height; u's two heads are i's flag point for point | b d h i j k l m n p r u | `joins.flatter_flags`, `level_flags`, `u_flags` | `audit_serifs`, `audit_parts` (flags, head rise) |
| Foot serif and bracket | Tip 30; bracket handles 0.70 / 0.90 of their reach | every stem foot | `clean`, `joins.brackets` | `audit_serifs` |
| Round end | Half circle 88 across | a c f, 2 3 5 6 9 (r's ball 100, top at 528: a smaller round overshoots less) | `joins.round_ends2` | `audit_serifs` 3b |
| Barb end | Width 36, lean 0.10, foot 0.68 of the stem | C G S, s | `joins.barb_*`, `s_spurs` | `audit_serifs` |
| Diagonal | Thick and thin per the ladder; serifs lean 70 closed, 45 open | v w x y z k, A K M N V W X Y Z, 4 7 | `balance.diagonals`, `lean_serifs` | `audit_thin` |
| Vertex | Outside: a flat 0.42 of the class stem (33 lowercase, 36 capitals), centred where the vertex was; inside: a point where the two inner edges meet; strokes solved to keep their thickness; M's and N's stem notches are points | v w y A M N V W | `parts.vertices` (after `balance.diagonals`) | `parts.check`; `tools/joins/apexes.py` on all three faces |
| Diagonal join | One fillet, handles 0.62 / 0.60; vertices never cross | v w x y, A M N V W | `joins.diagonal_joins`, `even_fillets`, `clean.uncross` | `pathlint` crossings |
| Bars | f and t one bar; e's bar 41 | e f t | `balance.bars`, `e_g` | `audit_parts` |
| Capital thin strokes | Arms 46, closing strokes of P R 47, crossbars of A H 49 (each a measured share of the 47 hairline) | A B E F H L P R T Z | `balance.cap_thins` | `audit_parts` cap thins |
| Capital rounds | 92 at the extreme, at most 95 across the stroke | O C G Q D P R, both bowls of B | `derive.thin_rounds`, `balance.B_lower` | `audit_parts` cap rounds (5%) |
| Figures' flat strokes | 73 (0.85 capital stems) | 2 5 7 | `balance.fig_flats` | evaluation suite, `measures.py` BAR.2 / 5 / 7 |
| Extreme beside a spur | Short curve at tension 0.57, curvature at the extreme equal to the long arc's | C G S s | `joins.even_extremes` | evaluation suite, `test_curves.py` (g2, handles) |
| Curve into a straight | Handle on the straight's line | every bracket on a diagonal; seams of ligatures, Œ, carons | `clean.true_joins` | `test_curves.py` (kink) |
| Capital serif | 77 from the stem, every upright capital stem | B D E F H I K L M N P R T U Y | `balance.cap_serifs` | `test_serifs.py` |
| Zero | Sides 87 (0.94 of the O's), top and bottom 47 | 0 | `balance.zero_weight` | `measures.py` ROUND.0 |
| Two curves at a node | Handles on one line | every smooth node | `clean.true_curves` | `test_curves.py` (kink) |
| Node at every extreme and inflection | A curve is cut where it passes an extreme or changes direction; the cut does not move the outline | every letter and figure | `clean.add_nodes` | `test_curves.py` (extreme, inflection), `pathlint` |
| Accent placement | Ink centre at `MARK_X` over each base (mean of both references); one height on capitals; lowercase accents 90 over the x-height | every accented letter | `charset.centre_marks`, `case_marks`, `drop_marks` | `audit_charset` marks |
| Plain strokes | The minus's 52, upright and level | + ± ¬ | ¦ _ / \ | `charset.plain_strokes` | `audit_charset` plain strokes |
| Plain stroke end | Two straight parallel edges and a straight cut: both corners on radius 7, as the letters' cut ends (0.79) | every glyph outside the letters and figures: dashes, maths, bars, slashes, arrows, bracket arms, macrons, struck bars | `charset.soft_ends` | `audit_charset` (`sharp_ends`) |
| f's hook in a ligature | Lengthened by rule to end 0.42 stems past the next stem's centre; into an ascender, cut at its top and run level across the stem | fi ffi fj ffj; fl fb fh fk and their ff forms | `charset.f_hook`, `f_join` | `audit_charset` ligatures |
| 5's bowl | Lowest point 0.457 across, outside widest 0.525 up, counter widest 0.500 | 5 | `clean.five_bowl` | `audit_charset` |
| Sign from a letter | The finished letter and a stroke of the case's hairline (47, 43) | $ ¢ ¥ ĸ, ₩ ₽ ₺ ₫ | `charset.letter_signs`, `kra`, `currencies` | `audit_charset` letter signs |
| Mirrored pair | The left form turned over, point for point | ) ] } » › > | `charset.mirrors` | `audit_charset` mirrors |
| Bracket test | A curve meeting a diagonal across a corner over 60 degrees is not its bracket | every serif on a diagonal; the ampersand's arm | `derive.BRACKET_MAX_TURN` | `audit_charset` ampersand |
| g's lower loop | Quarters at the bowl's tensions (0.57 out, 0.61 in); each lowest point where b/a^2 is equal on its two quarters; extremes' heights at the references' share of the counter (left 0.495, right 0.57); the left side meets the link as a branch (neck 32) in a notch and a crotch; curves off the link's straights tighten steadily (curvature at the straight at most 0.35 of the curve's tightest); every smooth node's handle solved for equal curvature | g | `loops.g_loop` (in normalize after even) | `curvecheck.py`, `audit_charset` (`audit_081`) |
| Tail off a stem (g.ss02) | A half-ellipse: both edges leave the stem at the ball's height, the lowest point half way to the tail's end, the stroke 1.15 hairlines there; the curve from the lowest point to the ball solved so curvature only rises toward the ball and meets the ball's; ball 0.030 x-height under the baseline (forms in `G_TAIL_FORMS`) | g.ss02 | `charset.single_g_points`, `_round_tail` | `curvecheck.py` (tail valley), `audit_charset` |
| Tails of j and y, the a's exit (0.81) | g.ss02's tail rule on each: from the straight edge (stem, thin diagonal) round the lowest point to the ball, curvature only rising toward the ball and equal across the lowest point; ball, depth, stroke and reach kept; lowest point at the references' share of the reach (j 0.673, y 0.681). The a's exit: its two handles solved the same way, its ends fixed | j y a (and ȷ ĵ ij fj ffj eng ý..., a.ss03 ª ⱥ) | `loops.round_tail`, `loops.a_exit` | `curvecheck.py` |
| Alternates (0.81) | ɑ: the b d p q bowl narrowed across the counter to the references' advance (0.945 n), q's spur, a's exit; tailed l: t's hook on l's stem; zeros: the zero's hairline slash inside the oval, a dot of the side stroke's width; barred 7 z: a level bar of the class hairline, half the top arm | a.ss03 l.ss04 zero.zero zero.ss05 seven.ss06 z.ss06 and families | `alternates.py` | `audit_charset` (`audit_081`), `curvecheck.py` |
| Along a tapering stroke (0.81) | Each place keeps its ladder law's share of the Regular's thickness there: the stem's ratio at a stem, the hairline's at a hairline, the tip's at an end, interpolated by the Regular thickness between (one continuous law); Light everywhere, Bold where the engine read a place thinner than the Regular. Handle lengths only, no new turn, no place past its law | tails, hooks, flags, terminals (j y eng f r a c e ƒ, the hooked letters) | `white.keep_taper`, `taper_law` | `audit_rays.py`; `tools/taper_plot.py` |
| Neck at any crotch (0.81) | The nearest approach across the ink at a branch, whatever its sides; a straight-sided crotch slides along its straight side to the neck (as `parts.solve`); a Regular neck under the tip is no branch | every crotch (Light) | `white.keep_necks` | `audit_axis.py` thin; `audit_bold.py 55` |
| Mirrored pair (masters, 0.81) | The right-hand form is the master's left-hand form turned over, point for point | `charset.MIRRORS` (with ⇤ ⇥, ⌫ ⌦) | `bold.mirror_pairs`, `turn_over` | `audit_axis.py` mirror |
| Inflection at a node (0.81) | A curve's end bends the Regular's way at an S's node or out of a straight: its far handle slides along itself until it does | c_t, section | `bold.inflection_nodes` | `audit_axis.py` turns |
| White inside one contour (0.81) | g.ss02's ball keeps the white law under the bowl; its rise stops where the law holds | g.ss02 | `charset.single_g_points(least_white)`, `ball_white` | build notes |
| Struck stroke's end (0.81) | A stroke whose side would lie on its letter's edge ends where that edge begins (no seam) | Ɍ (Light) | `overlap.inset_ends` | `audit_axis.py` seam |
| Heights | x 520, cap 712, ascender 780; overshoot 530 / -10 lowercase, 721 / -9 capitals and figures | all | `balance.heights` | `audit_serifs` 4, `check.py` |

A part not in this table has no rule yet. Add the row when you write the rule.

## Bezier rules (every outline, every build)

- A node at every extreme; handles level or upright there. No node elsewhere on a curve unless the part needs it
  (a join, a straight run, an inflection).
- Both handles of a quarter arc carry the same share of their reach (the tension); the inside of a stroke has the
  higher tension (0.61) and the outside the lower (0.57), so the stroke thins toward the extreme by itself.
- Handles stay inside the triangle made by the two nodes and the handles' meeting point. Never past it.
- A smooth node's handles are collinear; the curvature on its two sides differs by under 1.8 times
  (`evaluate.py` jumps). A corner is marked as a corner.
- Whole units. No segment under 2 units, no doubled node, no curve whose ends are within 2 units
  (`charset._drop_tiny` runs on every glyph; `pathlint` lists what is left).
- No contour crosses itself; no two edges of one stroke cross (`pathlint` crossings: ERROR for a sliver; a stroke
  drawn across itself, as g's link, is INFO). `clean.uncross` merges the two nodes of a crossing tiny segment.
  A crossing is a fault the owner sees at once ("this cannot be happening", w's middle peak, 0.64).
- A crotch is one corner node on the stem's edge. Its two neighbours: the curve's handle on one side, the stem's
  edge (same x) on the other.

## Procedure

1. **Read the complaint as a part.** "a's bottom bar is too thin" is the branch neck on a. "b and d are different"
   is the bowl and its two joins. Say which part and which letters carry it.
2. **Inventory before designing.** Measure the part on every Area letter that has it (`parts.py` prints the join
   table; `tools/joins/crotches.py` does the same on the references; `audit_*.py`, `swell.py`, `profile.py` for the
   rest). Write the spread: that spread is the inconsistency, in units.
3. **Set the value** by rule 2. For a thickness, place it on the ladder; do not add a step to the ladder for one
   letter.
4. **Write or change the rule** in `parts.py` (joins, bowls, arches), `joins.py` (serifs, ends), `balance.py`
   (weights, heights) or `clean.py` (curve hygiene). Mind the order in `balance.run`: a rule that reads a part must
   run after the rule that sets it (a's join runs after `a_option`, which sets a's stem).
5. **Extend the check** so the old state would fail it.
6. **Build and run** `.venv/bin/python qa.py`; then `parts.py`, `evaluate.py --list <letters>`, `swell.py
   <font> <letters>` against the last build. A rate or jump that rose is a regression until explained.
7. **Look**: `joinsheet.py` (before over after, one scale), words with `plain.py`, the letters over both references.
   Check each changed letter for: crotch pointed, stem straight, neck even with its neighbours, curve leaving at the
   same angle, counters matching, no bump along the stroke, nothing crossing.
8. **Follow the derived glyphs.** List every glyph that carries the part (`parts.joins_of` over the whole font).
   Composites follow by themselves; a letter-plus-a-part glyph is rebuilt in `charset.py` from the finished letter
   (thorn, eng, mu, the barred letters, the f ligatures), never left on its old drawing.
9. **Record** (`area-type-design`, Owner review loop): `changes.json`, `BUILD`, the audit note, this table.

## Fit: side bearings, tracking, kerning

Fit is measured, like shapes (`tools/fit/fit.py`, numbers only from the references; `spacing.py` holds the rules).

- **Sides** follow Georgia Pro's bearings at the outermost ink (`REFERENCE`), then `OPTICAL`: where the white a
  side really shows stood off both references in the same direction, the smaller difference.
- **Tracking** is judged stem to stem (nn, HH), never tip to tip: Area's serifs are shorter than the references'.
- **Kerning** is `fit_kerning.json`: every measured pair that stands outside both references' fit by 8 or more is
  kerned to the nearer one. Inside their range it stays. Never carry a kern across a bearing change by keeping
  the old gap (0.38 did; it left fo 86 tight and Gw 96 loose for 28 builds).
- **After any change to a bearing, a serif length or a letter's width**, regenerate: `AREA_NO_FIT=1 python
  build.py`, `fit.py measure f.json`, `fit.py kern f.json fit_kerning.json`, build, `fit.py pairs f2.json 8`.
- **Accented letters kern as their letter** (0.73, `spacing.kern_families`): a value written for a core glyph alone
  leaves its accented forms on the old one (K À overlapped by 38 for seven builds). `spacing.finish` runs last in
  `normalize`: families, then the collision pass over every glyph of `charset.COVERAGE`. `audit_charset.py` fails
  on a family member outside its letter's class and on any pair closer than 10.
- Ink never closer than `MIN_GAP` 13. Proof words with `tools/joins/plain.py` (HarfBuzz kerning).

## When a corner is rounded

A stroke that **ends** in a flat cut (20 to 60 units, both corners 70 to 125 degrees) has both corners rounded at
7, like a serif tip: serif tips, bar ends, beaks, barbs, tail cuts (`normalize.soften_ends`). A **meeting** stays
sharp: vertices, joins, crotches, a stem's top corner under its flag, a stem's foot without a serif, and any cut
under 20 units (the spurs of b and q).

## Signs and accents (0.71)

A sign's weight is read across its stroke (`charset._ray`: a ray along the inward normal to the facing edge, only
where that edge runs alongside). The largest circle inside a glyph sits at a join and overstates a stroke by 15 to
30%. An accent's placement is read as its ink centre against its base's, on every letter that carries a symmetric
mark, and compared with both references (`build/anchors_ref.py`, numbers only). After any change to a letter's width
or shape, run `audit_charset.py`: it catches accents left where the old ink was.

## The Bold master (0.76, `bold.py`)

The Bold is never drawn and never offset. It is the Regular's points, each moved by its part's rule, so the two
masters match point for point and every weight between them is sound. Read `bold-master-plan.md` (in
`docs/research/serif-typeface-2026-11-10/`) before changing it.

- **One number.** `bold.STEM` (140). Every other Bold value follows from it in `vector` and the constants above it,
  and each constant has its measurement beside it. No value that only looked right: measure Georgia Pro and Serrif,
  Bold against Regular (`tools/weight/bold_*.py`), and take the mean on Area's Regular value.
- **A change to the Regular changes the Bold.** After any change to a letter, run `audit_bold.py` and
  `audit_bold.py --sweep`; a part the reader no longer finds is a failure, not a pass.
- **Strokes are exact, heights are pinned, everything else moves as little as it can** in proportion to its length.
  Handles are carried with their curve; a smooth node keeps the Regular's tangent. Never place a handle.
- **Slanted strokes follow `parts.vertices`**: exact thickness, the Regular's taper, a flat outside a vertex
  (`parts.VERTEX` of the class's stem), a point inside, corners where two lines meet.
- **What cannot be read is named** in `bold.HINTS` with its reason (e's bar; s's turns). Keep it short.
- **A glyph that is not a sound second master falls back** (upright parts only, then the Regular's outline) and
  says so in `build/bold-notes.txt`. A fallback is a debt: list it in the build's changes.
- **Known debts** (0.81, integration; was 0.80's list): kerning per master is done (`spacing.kern_master`, refit with
  `AREA_KERN_FIT=1`); fallbacks none; wedge accents' thin ends no longer read as strokes. Left: `audit_axis.py` Bold
  side `at` (the a's bowl running into @'s ring is read by neither the upright nor the level strokes and thins
  29 > 17 at 550), `hookabovecomb.case` (its curl is a loop of the outline round its ball, which the engine does not
  read as a ball: it closes and crosses at 552); Astroke and Tdiagonalstroke held for the owner (stump form,
  `audit_axis.AWAITING`); `audit_rays.py` flags (C/c terminals 2 to 4 units, junction rays in ə ʕ ɂ & ®, hooks of
  the IPA set at 300 at nodes the taper's handles cannot reach); the Bold asterisk is light (ink gain 0.74 of n's against the references' 0.82 to 0.94: longer arms, `arms.REACH`, bent its curves, so the Bold keeps reach 1); no part audit for marks, signs and composites.

## What is still outside the system

Say this in every report until it is closed:

- Extended letters that still carry their first drawings (old joins cut flat, necks 30 to 37): germandbls, and the
  Latin Extended-B and IPA letters outside `charset.COVERAGE` (b d g h p q with hooks and tails, eng's relatives,
  alpha, turned h, r with tail, the s ligatures).
- u's head serifs are level (520); n's are 8-degree flags. Both references lean u's. Open with the owner since 0.33.
- Capitals and figures: bowls on B D P R and the joins of 4 6 9 have hairline and stem rules but no shared-bowl
  construction yet.
- r's arm takes n's branch at the stem and keeps its own arm and ball above it.

## References

- `references/research.md`: what type-design sources say about joins, arches, bowls, serifs, curves and optical
  corrections, with the numbers, and how each became an Area rule.
- `typefaces/area-serif/parts.py` (the constants and their derivations are at its top), `balance.py`, `joins.py`.
- `docs/research/serif-typeface-2026-11-10/audit-0.58.md` (every build's audit section) and `tools/joins/`.

## Evenness and alternates (0.77, 0.78)

- **Evenness** (`even.py`, in `normalize` and `qa.py`): round each closed counter the stroke's thickness changes
  once, smoothly. `shelf` over 2.75 fails. The rule moves handle lengths only; the outer arc and every node stay.
- **A shape made of strokes meeting in a point** is one outline with a mitre, never a union of strokes and a
  filler (`charset.arrows`; `audit_charset.scraps` finds ragged vertices in any glyph).
- **Alternates** never change a default. Build them from finished parts (`charset.single_g`) or from the base
  through the general rules. One stylistic set per idea; `derive.ALTS` groups glyphs by tag.
- **An alternate differs in form** (owner, 0.79). Measure it against the default with an overlay first (ends,
  spine, width); if only proportion or weight differs, do not add it (S.ss03 and s.ss03 were removed for this).

## Splices, lengthened parts, and the Bold's guards (0.79)

- **Take a part by splicing points, never by a level cut.** A cut at the baseline slices a bowl's overshoot off
  (0.78's single-storey g stood on a 138-unit flat). `charset.single_g_points` joins q's and j's point lists at
  the stem's two edges.
- **A part made longer keeps its pieces**: the rigid piece (a ball) moves as one, the extreme between keeps its
  share of the span, each handle keeps its share of its own curve (`charset.restretch_x`, `clean._slide`). A
  smooth node stretched on one side only gets its handle turned back onto the other side's line.
- **A glyph spliced from letters is spliced again in the Bold** from the Bold's letters (`bold.bold_font`), and in
  the sparse master where either letter has one. The engine's reading of the spliced outline is not used.
- **The Bold's last guards** run on every outline: `fix_turns` (no new extreme or inflection in any curve, with
  the audit's own count) and `keep_apart` (side-by-side inks never under 13). A curve the guard cannot bring back
  is a fault in where the engine put a node; list it, do not bend the tangent of a curve that runs into a line.
- **A check that reads a four-point bar must still read it after its corners are rounded** (`charset._level_cut`
  rebuilds the corners from the four straight edges). When a rule changes point structure, re-run the checks that
  read that structure and make sure none passes by skipping.

## The Light, serifs along the axis, and a part of its own (0.80)

- **A Light is the Bold's engine run backwards, with one difference.** `bold.vector(55)` gives f under 0. Thick parts
  use f; thin parts use `v["ft"]` (f times `LIGHT_THIN`), because contrast holds towards the Light and rises towards
  the Bold. A new rule in `bold.py` that scales a thin part must use `ft`, a thick part `f`.
- **Check serifs as a census, not letter by letter.** `tools/serif_axis.py` measures every foot and flag at five
  weights and fails on any serif off its kind's median. It found n's and k's two-curve flag bracket, which no
  per-letter audit had. Run it after any change to serifs, flags or the engine.
- **When a spliced part looks wrong, stop moving its points and give it its own construction.** g.ss02's tail was
  j's hook with points slid (0.79) and read flat; as four quarter turns between measured places (0.80) it is round.
  Quarter turns take their handles at 0.55 of their side.
- **One sign, one form.** The dollar is the ball-end drawing; do not rebuild it from S and a stroke.

## Curvature, measured (0.81)

- **A smooth curve is judged by its comb, not its tangents.** `curvecheck.py` reads curvature along a part: the ratio
  across each smooth node (under 1.25), the step where a curve leaves a straight (under 0.45 of the curve's tightest),
  a flat place inside a curve, and along a tail any fall-and-rise over 30%. A ball's neck, where the curve turns the
  other way, is not a jump. `tools/combs.py` draws the combs; look at them before and after any curve rule.
- **A part that overlaps itself to make a join is a fault waiting to show**: 0.80's g loop ran its hook into the link
  and left a white sliver in the variable font at 550 and 700. Draw the join as one outline with its crotch.
- **When handles cannot reach a smooth curve, move the places, not the tension**: g.ss02's tail could not tighten
  evenly into a ball at 0.138; at 0.100 it does with ordinary handles.
