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
| Figures' flat strokes | 73 (0.85 capital stems); in every master the same share of the master's capital stem (0.82, owner round 8: 51.5 / 73 / 95 / 125.6 at 300 / 400 / 550 / 700; they were read as "a thick level thing" and left at 73). A cut end's corner on a zone line holds its height (the Light 7's bar end) | 2 5 7 (seven.ss06, .tf, the superiors, inferiors and fractions follow) | `balance.fig_flats`; `bold.fig_flat`, `cap_stem`; `white.ZONE_Y` | evaluation suite, `measures.py` BAR.2 / 5 / 7; `build/owner8/item12/bars.py` |
| Extreme beside a spur | Short curve at tension 0.57, curvature at the extreme equal to the long arc's | C G S s | `joins.even_extremes` | evaluation suite, `test_curves.py` (g2, handles) |
| Curve into a straight | Handle on the straight's line | every bracket on a diagonal; seams of ligatures, Œ, carons | `clean.true_joins` | `test_curves.py` (kink) |
| Capital serif | 77 from the stem, every upright capital stem | B D E F H I K L M N P R T U Y | `balance.cap_serifs` | `test_serifs.py` |
| Zero | Sides 87 (0.94 of the O's), top and bottom 47 | 0 | `balance.zero_weight` | `measures.py` ROUND.0 |
| Two curves at a node | Handles on one line | every smooth node | `clean.true_curves` | `test_curves.py` (kink) |
| Node at every extreme and inflection | A curve is cut where it passes an extreme or changes direction; the cut does not move the outline | every letter and figure | `clean.add_nodes` | `test_curves.py` (extreme, inflection), `pathlint` |
| Accent placement | Ink centre at `MARK_X` over each base (mean of both references); one height on capitals; lowercase accents 90 over the x-height | every accented letter | `charset.centre_marks`, `case_marks`, `drop_marks` | `audit_charset` marks |
| Plain strokes | The minus's 52, upright and level; in every master a straight one of 50 to 55 takes the minus's own law, 1 + 0.37 ft, level, upright or slanted (0.82: the Light's upright and slanted ones took f, 44 to 45 beside the level 40 at 300) | + ± ¬ | ¦ _ / \ ≠, the arrows, ⌥ ⌘ | `charset.plain_strokes`; `bold.x_target`, `diag_target` | `audit_charset` plain strokes; `build/owner8/signs/measure.py` |
| Arrows (0.83, Regular pass item B) | One arrow: the shaft the minus (52) on the maths axis, stopping at the head's crotch; the head two strokes of the same weight, outer edges meeting in the point, inner edges in the crotch, solid from crotch to point, its run 0.36 of the arrow (0.80 of the maths' advance). Every other arrow is this one turned or turned over, whole: ← ↑ ↓; the slanted four keep 0.92 of its length and take its arm (centreline and weight) opened to 45 degrees, so turned their arms lie level and upright (`east(half=45)`); ↔ one shaft from crotch to crotch with the head at both ends, the left the right turned over about the middle, the same overall length as → (Times New Roman 1.00; Merriweather 1.66); ↕ ↔ turned; ↵ ⇤ ⇥ ⌃ take ← → ↑'s head. Every arrow's ink centred on the maths axis (references' median +0.010 of the length) | ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ ⇤ ⇥ ⌃ | `charset.arrows` (`east(both=)`), `charset.interface` (tab, return, control) | `build/owner8/reg/b/arrownum.py` (end flats 0 at every point, middles on 313) |
| Plain stroke end | Two straight parallel edges and a straight cut: both corners on radius 7, as the letters' cut ends (0.79) | every glyph outside the letters and figures: dashes, maths, bars, slashes, arrows, bracket arms, macrons, struck bars | `charset.soft_ends` | `audit_charset` (`sharp_ends`) |
| f's hook in a ligature | Lengthened by rule to end 0.42 stems past the next stem's centre; into an ascender, cut at its top and run level across the stem | fi ffi fj ffj; fl fb fh fk and their ff forms | `charset.f_hook`, `f_join` | `audit_charset` ligatures |
| The 3's bowls (0.83, Regular pass item D) | The upper ball's neck one curve as the lower's (the lower ball's handle shares); top and bottom extremes, outer and inner together, nearest the bowls' middle (Area's 8 0.493, S 0.498) with no flat place: top 0.51, bottom 0.445 of the bowl's width; every smooth node at one curvature (handles only). The 5 takes the same evening | 3 5 (³ ₃ ⁵ ₅ and the fractions follow: the rule runs before spacing and the charset) | `figs.three`, `even_figs`, `collinear` (normalize, before `SPACING.run`) | `build/owner8/reg/d/figcomb.py` (curvecheck on the whole figure: 0 faults) |
| 5's bowl | Lowest point 0.457 across, outside widest 0.525 up, counter widest 0.500 | 5 | `clean.five_bowl` | `audit_charset` |
| Sign from a letter | The finished letter and a stroke of the case's hairline (47, 43) | $ ¢ ¥ ĸ, ₩ ₽ ₺ ₫ | `charset.letter_signs`, `kra`, `currencies` | `audit_charset` letter signs |
| Mirrored pair | The left form turned over, point for point | ) ] } » › > ≥ ⇥ ⌦ | `charset.mirrors` | `audit_charset` mirrors |
| Bracket test | A curve meeting a diagonal across a corner over 60 degrees is not its bracket | every serif on a diagonal; the ampersand's arm (0.82: the arm is now built with v's serif, `amp.py`) | `derive.BRACKET_MAX_TURN` | `audit_charset` ampersand |
| g's lower loop | Quarters at the bowl's tensions (0.57 out, 0.61 in); each lowest point where b/a^2 is equal on its two quarters; extremes' heights at the references' share of the counter (left 0.495, right 0.57); the left side meets the link as a branch (neck 32) in a notch and a crotch; curves off the link's straights tighten steadily (curvature at the straight at most 0.35 of the curve's tightest); every smooth node's handle solved for equal curvature | g | `loops.g_loop` (in normalize after even) | `curvecheck.py`, `audit_charset` (`audit_081`) |
| Tail off a stem (g.ss02) | 0.80's tail, by the owner's choice (owner round 8, form E): four quarter turns between five places, handles 0.55 of their side; the outside leaves the stem 2 above the baseline, the inside where j's inner stem edge ends; lowest point 0.518 of the bowl's width (0.560 at the Bold stem), stroke 0.963 hairlines there; ball j's (in a master the engine's j before the tail rebuild), its top 0.138 x-height under the baseline (0.120 at the Bold stem). curvecheck reads 1.38 to 1.65 at its lowest points and ball: listed as the owner's choice. The masters' curvature evening leaves it (`bold.G_OWNER_SHAPE`). Forms A to D in `G_TAIL_FORMS` | g.ss02, ɡ | `charset.single_g_points`, `_tail_080` | `curvecheck.py` (EXPECTED), `audit_charset` |
| Tails of j and y, the a's exit (0.81) | g.ss02's tail rule on each: from the straight edge (stem, thin diagonal) round the lowest point to the ball, curvature only rising toward the ball and equal across the lowest point; ball, depth, stroke and reach kept; lowest point at the references' share of the reach (j 0.673, y 0.681). The a's exit: its two handles solved the same way, its ends fixed | j y a (and ȷ ĵ ij fj ffj eng ý..., a.ss03 ª ⱥ) | `loops.round_tail`, `loops.a_exit` | `curvecheck.py` |
| Alternates (0.81) | ɑ: the b d p q bowl narrowed across the counter to the references' advance (0.945 n), q's spur, a's exit; tailed l: t's hook on l's stem; zeros: the zero's hairline slash inside the oval, a dot of the side stroke's width; barred 7 z: a level bar of the class hairline, half the top arm | a.ss03 l.ss04 zero.zero zero.ss05 seven.ss06 z.ss06 and families | `alternates.py` | `audit_charset` (`audit_081`), `curvecheck.py` |
| Along a tapering stroke (0.81) | Each place keeps its ladder law's share of the Regular's thickness there: the stem's ratio at a stem, the hairline's at a hairline, the tip's at an end, interpolated by the Regular thickness between (one continuous law); Light everywhere, Bold where the engine read a place thinner than the Regular. Handle lengths first; towards the Light a place still short by more than 3% of its law (the JND) moves its places: the smooth nodes of its curve and of the curve its ray ends on, each rigidly with its handles (a node with level handles moves level only), and a straight cut end under 30 grows along itself; corners never. No new turn or crossing, no place past its law | tails, hooks, flags, terminals (j y eng f r a c e ƒ, the hooked letters) | `white.keep_taper`, `taper_law`, `_taper_places` | `audit_rays.py`; `tools/taper_plot.py` |
| Slanted stem with one straight side (0.81, close) | A stroke whose one side is a line 5 to 35 degrees off upright and whose other side is a curve's upright extreme facing it across the ink is a stroke: its level width at the extreme takes `x_target`; the extreme moves level and every point of its contour between it and the contour's far extreme by its share of the move (the engine's knot map corrected at the knot a line lacks). Towards the Bold only: towards the Light the map ran the counter into the a's top crotch, which it does not carry | the a of @ (0.82, owner round 8, item 15: the @ is now built by `at.py` in every master, which replaces what this rule does to it) | `white.slanted_stems`, `keep_slanted_stems` | `audit_axis.py` thin |
| A star's reach (0.81, close) | Towards the Bold a star's arms reach the least that brings its ink gain over n's to the references' least (Georgia Pro 0.819), within the references' span changes (at most 1.092); the outer part of each arm, from its innermost smooth node out, is its Regular scaled about the tip and carried out whole (a similarity: no curve turns); the junction scales by f, the part between takes up the length. f stays capped by the white law | asterisk (Bold reach 1.065, f 1.197) | `arms.INK_GAIN`, `REACH_MAX`, `Arm.along`; `bold.bold_font` | `audit_axis.py` turns, symmetry |
| Neck at any crotch (0.81) | The nearest approach across the ink at a branch, whatever its sides; a straight-sided crotch slides along its straight side to the neck (as `parts.solve`); a Regular neck under the tip is no branch | every crotch (Light) | `white.keep_necks` | `audit_axis.py` thin; `audit_bold.py 55` |
| Mirrored pair (masters, 0.81) | The right-hand form is the master's left-hand form turned over, point for point | `charset.MIRRORS` (with ⇤ ⇥, ⌫ ⌦) | `bold.mirror_pairs`, `turn_over` | `audit_axis.py` mirror |
| Inflection at a node (0.81) | A curve's end bends the Regular's way at an S's node or out of a straight: its far handle slides along itself until it does | c_t, section | `bold.inflection_nodes` | `audit_axis.py` turns |
| White inside one contour (0.81) | g.ss02's ball keeps the white law under the bowl; its rise stops where the law holds | g.ss02 | `charset.single_g_points(least_white)`, `ball_white` | build notes |
| Struck stroke's end (0.81) | A stroke whose side would lie on its letter's edge ends where that edge begins (no seam) | Ɍ (Light) | `overlap.inset_ends` | `audit_axis.py` seam |
| A curl on a stem (0.81, last) | In the variable font's masters the hook above is two parts overlapping, as the struck letters are: the curl (from the stem's right edge round the eye to the eye's foot, closed by a line inside the stem) and the stem (a stroke, `move_stroke`, its top the eye's foot). Towards the Bold the eye is the Regular's about its centre times the white law's least over its width, centred where the engine put it; the slot to the stem gives way into the stem by at most its gain. The static Regular keeps the one merged outline. 0.82 (owner round 8, item 18): every smooth node at one curvature, handle lengths only, in the Regular's merged outline and in each master's curl (`symbols.even_curves`, `HOOKS`); the curl's last node (the eye's foot, where the closing line runs into the stem) is a corner | hookabovecomb, hookabovecomb.case (and every composite carrying them) | `overlap.curl_master`, `curl_parts`, `vf_source`; `bold.bold_font`; `symbols.even_curves` | `audit_axis.py` crossings, turns |
| A tail into a ball in the Bold (0.81, owner) | The ball is the round ends' part: the Regular's ball (neck, top, side and the handles between) scaled by the ball law (`bold.BALL`, 1 + 0.40 f: 1.40 at the Bold, as a c f r 2 3 5 6 9 take it; the Light keeps the engine's tail, which passes) about its centre, centred where the engine put it; the tail between the straight edge and the ball solved again by `round_tail` on the master's own points. Then every part curvecheck reads meets at one curvature at each smooth node (`loops.even_nodes`: node handles along their lines, inside the triangle, no new fault) | j y jdotless eng f_j f_f_j (g.ss02 spliced from the master's j); g a.ss03 l.ss04 | `loops.tail_kind`, `master_ball`, `round_tail`, `even_nodes`; `bold.bold_font` | `curvecheck.py` on the Light and Bold UFOs (qa.py) |
| Lean along the axis (0.81, owner; check only) | No rule yet. `audit_lean.py --refs` measures each letter's top-half ink against its bottom half from 300 to 700 against Georgia Pro and Source Serif 4. A thick crossing diagonal keeping the Regular's lean (`bold.LEAN_KEEP_THICK`, None) fixed x's lean but bent its serif brackets between masters: place the serif from the kept edge first | x (worst: -0.123 at 700, refs -0.037 to -0.018), s z G S X e g w a c | `bold.slant_lines` | `audit_lean.py --refs` |
| 9 and 6, the long stroke's quarter (0.81, owner; the lowest point and lean superseded by "9 and 6's tail", 0.84 pass 3) | The 9's lowest point (and the tail's inside) left until the quarter from the right extreme down is 0.90 as wide as tall; the ball left until it stands on the bowl's left extreme; the extreme's downward handle until the edge leans 23.5 degrees; one curvature at each node. The 6 is the 9 turned half round | 9 6 (their superiors, inferiors, ∂) | `clean.nine_six` | `audit_lean.py`, curvecheck on the figure |
| 5's upright stroke (0.81, owner) | Turned about its middle height to the references' mean lean, 5.35 degrees | 5 (and its forms) | `clean.five_stem` | `audit_lean.py`; build/scratch4/five.py measures |
| A part solved with its other edge (0.81, owner) | In a master, where a part's nodes cannot meet at one curvature without thinning, even the nodes, then the curves either side of every thinned place take its thickness back by handle lengths (keep_taper at the part's own thickness) | g a.ss03 l.ss04 and the tails (masters) | `loops.even_part` | curvecheck on the masters |
| A crossing's openings (0.81, owner round 5) | Two straight diagonals that cross (x): the thick one keeps the Regular's angle; each end keeps its serif-end opening on the white law's share; the bracket-level opening is the serif-end target plus the bracket rule's separation (one end cannot carry two openings once the angle is kept); brackets from the kept edge | x | `bold.crossing_openings`, `LEAN_KEEP_THICK`, `BRACKET_FROM_EDGE`, `slant_strokes` (cross) | `audit_bold` (derived target), `audit_lean.py` |
| An S's two bowls (0.81, owner round 5) | The top bowl keeps its width's share of the bottom bowl's: the top terminal moves level | S s | `bold.s_terminal`, `S_SHAPES` | `audit_lean.py`, quarter shares |
| Open tail (0.81, owner round 5) | A lower stroke from a round stroke to a terminal grows by the mean of the round stroke's and the tip's ratios | c e | `bold.open_tail`, `HINTS` | references' 1.58 to 1.75 |
| g's loop in a master (0.81, owner round 5) | Its extremes from the centreline by the taper law, the link's curve by the Regular's shares, solved with its other edge | g (Light) | `loops.g_loop_master` | curvecheck on the Light |
| A ball at any tilt (0.81, axis round) | A ball is read by what makes it one, not by its alignment: three nodes joined by two curves, the chord between the outer two 70 to 130 long and within 25 degrees of an axis, the arc's far point 0.40 to 0.70 of the chord out and within 0.12 of its middle, ink all along the chord; one reading per ball (the rounder of two arcs). Then the ball law (1 + 0.40 f) reaches it in both masters, as the upright balls. Letters only (signs and accents keep their own laws) | Ƙ Ⱳ Ƴ ⱳ ƴ ƒ and 22 more hooks and tails with a ball (Ƈ Ɠ Ƒ Ɲ Ɋ Ɽ Ʈ Ɂ ɂ ʔ ʕ ƈ ɠ ʃ ɽ ʋ Ɛ ɔ Ɔ ß ʼ, s_p) | `bold.tilted_balls`, `balls(tilted=True)` in `bold.bold` | `audit_rays.py` every 25 units; `audit_axis.py`; curvecheck on both masters |
| A node joining a straight to a curve (0.81, axis round 2) | In the Light, where a place on the curve falls under the stem's ratio less the JND, the smooth node between the straight and the curve travels along its own straight, its handle rescaled by the chord, the far handle shortened until no turn; not on a curve that ends on a corner (a bracket) | ƴ ɲ ʈ (Light; read as audit_rays reads, a slide at most 1.5 times the Regular's stroke) | `white._straight_nodes` in `keep_taper` | `audit_axis.py`, `audit_rays.py` |
| A curve on its chord (0.81, axis round 2) | Where a master's thinnest stroke falls under its floor, a curve is put back to its Regular shape on the master's chord (a similarity) when that lifts the thinnest place without a turn; not where a mid master stands between | ʈ (Bold) | `bold_font` (after the white between parts) | `audit_axis.py` thin |
| A sign's slanted strokes in the Light (0.81, axis round 2; 0.82) | Towards the Light every slanted stroke of a sign takes the sign law (1 + 0.37 f), as its plain strokes do; one of the plain stroke's 50 to 55 takes the minus's own, 1 + 0.37 ft, in both directions (0.82) | ⌦ ⌫ ✓ and 22 more signs | `bold.diag_target` | `audit_rays.py` |
| A letter in a ring (0.81, axis round 3; 0.82: superseded for © ® ℗ by the row "Letters in a ring") | A glyph whose ring is ©'s point for point takes ©'s ring in each master; the letter inside keeps the Regular's offset from the counter's centre and is scaled about its centre until its white to the counter is the Regular's times the counter's change | ® | `bold_font` (after the curves on their chord) | `audit_axis.py`, `audit_rays.py` |
| A cut end towards the Bold (0.81, axis round 3) | Towards the Bold a stroke's straight cut end (under 30, between two corners) grows along itself by the tip's law where the place reads thinner than the Regular; no other node moves | ſp ſt ƭ ™ | `white.keep_taper(cuts=True)`, `_taper_places(cut_only)` | `audit_axis.py` |
| An open round letter's two terminals (0.82, owner round 8) | The top and bottom terminals end on one vertical, at the references' median reach of the rightmost terminal over the round letter's width (C 0.891 of O, c 0.882 of o); each terminal moves level and its half of the letter is stretched to meet it (extremes keep their share of the run, handles theirs of their curve). In the masters the two share one x knot; `c_terminals` holds them on one line | C c (Ç ç ... Ꞓ ꞓ Ȼ ȼ ¢ ₡ follow; © ₵ Ɔ ɔ are own drawings) | `joins.terminal_line`, `move_terminal`; `bold.c_terminals` | `build/owner8/ends.py` (top - bottom within 2 at every 50 units) |
| Ends of a crossing (0.82, owner round 8) | Towards the Bold the four ends of x and X grow alike: the letter turns about its crossing, both strokes the same way, the openings and the mean growth staying the engine's. X: every arm the Regular's lean turned by one solved angle, placed through its crossing corners (`arm_turn`). x: after the engine, top arms +s and bottom arms -s whole, edges back to the engine's thickness, corners where the lines meet (`cross_shear`) | x X (ẋ ẍ Ẋ Ẍ) | `bold.cross_ends`, `cross_shear`, `slant_lines(arm_turn)` | `build/owner8/ends.py` (spread within 5 from 400 to 700) |
| A Z's bar ends (0.82, owner round 8) | In each master the bars' free ends (top-left beak, bottom-right beak) move out level until the four ends grow alike about their centre; the diagonal, its outer corners and the width stay the engine's | z Z z.ss06 (ź ż ž ... Ƶ ƶ follow) | `bold.bar_ends` | `build/owner8/ends.py` (spread within 8 at 700) |
| An open round letter's ends (0.82, owner round 8, item 13) | In each master, on each side the top and bottom ends (balance.py's bands, the top and bottom 40%) keep the Regular's difference, each moving half the gap; a band's nodes within 0.3 of its width from an end move with that end whole (a barb, a ball, a bowl's outer stroke keep their shape), those between by their share of the run, handles with their node, the spine between the bands stays. Composites take the letter's new advance; the small 3s take the 3's moves | S s 3 (accented S s, ³ ₃ and the fractions follow; $ § own drawings: the same rule, `ROUND_SIGNS`, item 17) | `bold.round_ends`, `band_ends`, `ROUND_ENDS` | `build/owner8/ends.py` (four ends about their centre within 6 at 300 and 700) |
| g's bowl through the ear (0.83, Regular pass item E) | The bowl's outer upper-right quarter one cubic from its right extreme (upright) to its top (level), handles fitted to the drawn outline either side of the ear; the ear's roots on it, the two pieces its own: the bowl is one oval under the ear. In the Regular only: in the masters after `g_ear` it slid the Bold's lower root into the ear (an inflection between masters) and was withdrawn; the Bold's dent (U +24, D -10) needs `g_ear` to move the ear with the bowl (open) | g (ǥ and the accented g follow; g.ss02 untouched) | `figs.g_oval`, `g_regular` | `build/owner8/reg/e/gdent.py` |
| g's loop, link turn and ear in the masters (0.82, owner round 8, item 14) | After the engine the loop (its counter and the outline under the counter's top) moves level so its centre keeps the Regular's offset from the bowl's (+15.5), the link between by its share of the run, the notch where the turn meets the loop at the Regular's depth from the turn; the ear's ball moves level until the ear reaches past the bowl by the Regular's reach times the ball law (1 + 0.40 f), the neck taking up the change. Composites take the new advance and keep their mark over the moved ink | g (ĝ ğ ġ ģ ǧ ǵ ḡ ǥ follow; g.ss02 untouched) | `bold.g_loop_place`, `g_ear`, `g_centres`, `G_LOOPED` | `build/owner8/item14/gmeasure.py`; `curvecheck.py` on the masters |
| A sign built from strokes (0.82, owner round 8) | Centrelines and stroke weights; every edge a line half the stroke from its centreline, every corner where two edge lines meet (an inner outline a true inset, an inner point sharp), ends cut square or upright as the sign's kind says, nothing a union of overlapping bars. Vertices: a flat 0.42 of the stroke across the bisector (✓), an upright flat 0.79 of the stroke at the point of < (the references' median: Georgia Pro 0.92, Serrif 0.78, Source Serif 4 0.81, Literata 0.72, Merriweather 0.76), mitred points (⌃, the frames). Stroke weights: the minus's (52), the check 1.25 of it, the radical's thick 1.44 of it, fixed at every weight. In each master the same construction with every stroke times 1 + 0.37 ft, carried onto the Regular's points corner by corner; the erase key's cross is shortened only where its white would fall under the white law's least | ⌫ ⌦ ✓ √ < > ≤ ≥ × ⇧ ⇪ ◊ ⌃ | `signs.py` (`erase`, `check`, `radical`, `chevron`, `chevron_bar`, `times`, `frame`, `caret`); `charset.put_built`; `bold.construction_signs` | `build/owner8/signs/measure.py` (every straight stroke across itself at 300, 400, 550, 700: within 1 of the law) |
| The summation and the increment (0.82, owner round 8; ∑ redrawn 0.83, Regular pass item A) | Capitals, not plain signs. ∑ and Ʃ are one construction from the master's capitals (`sigma.py`, Regular and every master): both bars E's top arm, each ending in E's top-arm beak (the bottom turned over: one size), the upper diagonal Z's diagonal across, the lower A's thin; every edge straight, the bars' left ends one vertical (no heel), the diagonals meeting the bars in plain corners (no bracket) and each other in a sharp point (four references of six; the 0.42 flat is for a vertex on a zone line). Ʃ (the letter): ink 0.982 of E's, the top bar's end 0.974 of the bottom's, the point 0.637 across and 0.523 up, on the baseline. ∑ (the operator, `sigma.KIND`, refstudy/spec.md): -0.25 to 1.00 of the cap, width 0.79 cap, bottom bar 0.90 of n's stem with its beak moved down with it, long edges at 55 / 52 degrees from level, the point's flat 0.13 of the capital stem (Georgia Pro's); ∏ takes the same extent. ∆'s inner edges parallel to its outer at A's weights (thin 49, thick 86, base 44) | ∑ Ʃ ∏ ∆ | `sigma.py` (`regular` in normalize after the &, `master` in `bold.bold_font`); `charset.maths` (increment); `bold.HINTS` | `build/owner8/reg/a/refsum2.py`, `tip.py`; pathlint |
| The ampersand (0.82, owner round 8) | One stroke and an arm. The stroke (tail, diagonal, loop up its left side, over the top, down its right side, the spine across the diagonal, the lower bowl, into the diagonal) has two edges, each one chain of curves (lines on the diagonal); the outline is where the ribbon crosses itself and where the arm leaves the diagonal, every corner found, not placed. Weights from the master's own letters: diagonal and loop's left side v's thick, bowl's left o's side, loop's top and the spine o's hairline, loop's right half way, bowl's bottom and tail a's lower stroke, the arm v's thin with v's serif point for point; the tail's drawn cut. Skeleton `amp.REG` (spine 28 degrees below level); 0.83 (Regular pass item C, second pass: Area's own terms, the references only a sanity range): the diagonal and the loop's left side one stroke at v's thick, the loop's right half way between o's side and the hairline; the loop by `loop_rule` (extremes at 0.52 of the counter's height, outer upper-left quarter kappa 1.01 wide over tall, form A; B C D kept in `LOOP`; `STUDY` and `_study_skeleton` kept, unused), the bowl's outer left at radius 0.89 of its quarter (`BOWL_R`), its bottom e's, the arm's crotch filleted 0.30 stem. Handles solved for one curvature across every smooth node, a curve leaving a straight under 0.30 of its mean, no flat place or inflection; an extreme's handles stay on its axis. In a master: stretched level as o's counter changes, then the bowl, tail and arm spread until the ink widens as n's advance does (towards the Bold only); the mid master at the readings half way | & | `amp.py` (`regular` in normalize, `master` in `bold.bold_font`, `widen`, `spread`) | curvecheck on the whole glyph (`build/owner8/amp/ovm.py`), `audit_rays.py ampersand`, `audit_axis.py` turns |
| A sign's dots (0.82, owner round 8) | Towards the Bold the division sign's dots take the sign law (1 + 0.37 ft) about their centres and stand at least the bar's thickness off it (references: gap 0.45 to 1.11 of the bar at 700, median 0.99) | ÷ | `bold.bold_font` (after the signs) | `build/owner8/amp/divide.py` |
| A symbol's stroke read the wrong way (0.82, owner round 8) | In each master, after the engine, one stroke's thickness from a law read on the master's own letters, the stroke's two edges found by what they are (level lines, a level node): Ə's bar the Regular's times E's middle-arm law about the bar's middle; ɂ's lower hook stroke the Regular's times ?'s same stroke (its counter's floor moves, handles with their node); œ towards the Light o and e joined as the Regular joins them (`charset.diphthongs`), only where the union keeps the structure; ɽ towards the Bold every node at one curvature (`loops.even_nodes`, handle lengths only) | Ə ɂ œ ɽ | `symbols.py`; `bold.bold_font` (after the ampersand) | `audit_rays.py`, curvecheck on the masters |
| A master under the Light (0.82, owner round 8, axis B; gated, no such master is built) | Below stem 55 a letter's thin stroke (hairlines, curved thins, bars and arms, e's bar, upright and slanted thins, the floors that read the hairline) is the Light's value times (stem / 55) ** 0.95, continuous with the Light and monotone (stem / hairline 1.46 at 32); ends keep the present law (tip, neck, dot, period, sign strokes: on the references' own exponent below 300); a slanted stroke's end keeps its share of the stroke across; sides the Light's change plus the references' 300-to-lightest (`thin_bearings.json`) | every glyph, in a master under 55 | `bold.thin_law`, `K_THIN`, `bearing_change`, "slanted end"; `weightaxis.THIN` | trials at 32 and 42 failed (`axis-0.81.md`, Owner round 8, axis, stage B: the list of what blocks) |
| The at sign (0.82, owner round 8, item 15) | One ring and Area's a. The ring is one stroke out of the a's foot (up the right side, over the top, down the left, along the bottom, out to the tail's cut), each edge one chain of curves at the bowl's tensions (0.57 / 0.61), curvature within 1.2 across every smooth node; the letters' upright stress: top and bottom the master's hairline, left 0.86 of the Regular's stem, right 0.883 of the left, both by the hairline's law in a master (the references' ring keeps its contrast); right extremes 0.107 of the height over the centre; box 701 / -164 (references 0.985 / -0.231 of the cap), width 0.941 / 0.968 / 1.012 of the height at 55 / 78 / 140. The a is the master's a.ss03 scaled to the references' share of the ring's counter (0.545 / 0.558 / 0.597), its strokes made their weight (stem 0.984 / 0.841 / 0.778 of the stem level, top and bottom 1.18 / 1.21 / 1.26 of the ring's thin upright: `at.embolden`, convex corners on their true mitre, a crotch's cusp at most 1.0), white right of its stem 1.24 of the white left of its bowl, its centre 0.011 of the ring's height over the ring's; its foot keeps a.ss03's two curves and the ring is solved on from them; the a's two crotches rounded by a fillet of 0.30 its stem (owner: "sharper / not as smooth at thicker weights"; `at.fillet`); a run of segments under 20 units made heavier as one corner (`at.SHORT`; a stroke's end as two); every smooth node then evened (`loops.even_nodes`). Shares interpolated on the stem's logarithm; the mid master at the readings that far | @ | `at.py` (`regular` in normalize after the ampersand, `master` at the end of `bold.bold_font`) | curvecheck on the whole glyph (every master), `audit_rays.py at`, `build/owner8/item15/refat.py` |
| Letters in a ring (0.82, owner round 8, item 16) | One ring for © ® ℗: the Regular's © outer outline in every master (box and advance fixed), the counter its extremes moved in by the side and the top, each quarter at the outer's own tension; the letters' upright stress, side the references' share of the stem (0.714 / 0.557 / 0.406 at 55 / 78 / 140, interpolated on the stem's logarithm), top 0.87 of the side. The letter is the master's own C, R or P scaled about its box's centre to the references' share of the counter (C 0.636, R 0.616, P 0.628 at 400), placed off the counter's centre by their offsets (C -0.024, R +0.023, P +0.026 of the width); in the Regular its strokes made the references' weights relative to the ring (thick 1.47 / 1.25 / 1.29 of the side, thin 1.12 of the top: `at.embolden`), in a master the Regular's additions times the stem's law | © ® ℗ | `circled.py` (`regular` in normalize after the @, `master` at the end of `bold.bold_font`) | `build/owner8/item16/refring.py`, `audit_rays.py`, `audit_axis.py` turns |
| A sign's letter through its bar (0.82, owner round 8, item 17) | $'s S is one outline through its bar: each of the six S edges that cross the bar is refitted as one curve (two cubics joined under the bar's middle at one tangent and curvature, the far nodes' tangents kept and their curvature met, the outer top and bottom level at the drawn extreme) and cut at the bar's edges; the bar centred on the S's ink; the stubs one length. Its four ends grow alike (`bold.round_ends`, `ROUND_SIGNS`, with §) | $ | `dollar.py` (`true_crossing` in normalize and at the end of `bold.bold_font`, mid master too) | `dollar.check` (steps under 1 at the bar's middle), `build/owner8/ends8.py` |
| ð's upper stroke (0.82, owner round 8, item 17) | The ascender's curve between the crossing and its cut end: the Regular's thickness times the hairline's law, about the engine's centreline | ð | `symbols.eth_bar` (in `bold.bold_font` with the other symbols) | `audit_rays.py eth` |
| Symbol system (0.83, Regular pass, symbols 1) | One axis (the maths axis, 313) for every sign not a letter, figure or punctuation; the + box (the minus's width, 424) for every operator; the arrow 2 axis long (626), one 45-degree head (arms 240), every arrow it turned; the key box 0.80 cap on the axis; shapes from the circle (■ its area, ▲ ◆ 0.70 of it); curved maths signs the damped stress 47 / 57 along a centreline; † ‡ the asterisk's arm; % ‰ set as fractions; € Area's C and bars | + = ≠ ± ¬ < > ≤ ≥ ~ ≈ ∞ ^ √ ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ ⇤ ⇥ ⌘ ⌥ ⇧ ⇪ ⌫ ⌦ ⌃ ✓ ● ○ ■ □ ▲ ▼ ▶ ◀ ◆ ★ ☆ † ‡ % ‰ € | `charset.arrows` (`ARROW_*`), `plain_strokes`, `tilde_signs`, `caret_sign`, `interface`, `more_symbols`, `dagger_info`, `percent_fit`, `euro_sign`; `signs.tilde`, `infinity`, `dagger`, `offset_sides`, `fit_cubic`, `stress` | `build/owner8/sym/census.py` (the census; the rules table in `axis-0.81.md`, Symbols 1), audit_charset |
| The gentle taper and A (0.83, Regular pass, symbols 2) | B (arrows, ↵ ⇤ ⇥ ✓ ✕): a stroke from its join (the hairline, 43) to a round free end (1.15 plain strokes, 60, radius 30), edges straight and tangent to the end, a head's point cut 0.5 w0 across its bisector; one contour, round ends split at their extremes, every point a construction point. A (⌘ ⌥ ⇧ ⇪ ⌃ ⌫ ⌦ □ ◊ ○ ☆): uprights 57, levels 47, slants 47 + 10 sin^2; outer corners soft on 7; shapes' corners soft on 7. In a master: w0 the master's hairline (o's top), w1 and A the plain stroke's law | ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ ⇤ ⇥ ✓ ✕ ⌘ ⌥ ⇧ ⇪ ⌃ ⌫ ⌦ □ ◊ ○ ☆ ■ ▲ ◆ ★ | `signs._Taper`, `tarrow`, `tcheck`, `tcross`, `stress_w`, `stress_frame`, `soften`, `option`; `charset.TAPER_*`, `SIGN_A`, `soft_flags`; `bold.construction_signs`, `_hair_ratio` | `build/owner8/sym/census.py`, audit_charset, pathlint |
| A shaft between two heads (0.83, consistency 0) | No free end, so straight: one width crotch to crotch, the hairline (43, of the hairline's law in a master); ↕ keeps the up arrow's extent (0 to 626) | ↔ ↕ | `signs.tarrow(shaft=)`, `charset.SHAFT_BOTH` | `build/owner8/cons/0-big.png` |
| A stop bar (0.83, consistency 0) | A straight stroke of A's upright (57, the plain stroke's law), half-round ends of its own width, its face upright through the head's point | ⇤ ⇥ | `signs.tarrow(bar_w=)`, `charset.TAB_BAR` | `cons/0-big.png` |
| Operator sizes (0.83, consistency 0) | ∞ 0.78 of the + box tall, 1.50 of the minus wide (`INF_H`, `INF_W`); pointed shapes 0.60 of the circle's area (`POINTED`); ~ ≈ mean width the plain stroke's (`TILDE_K` 1.04); † ‡ arms leave at the branch neck (`DAGGER_W0` 32) | ∞ ▲ ▼ ▶ ◀ ◆ ~ ≈ † ‡ | `charset.tilde_signs`, `more_symbols`, `dagger_info` | `cons/ink.py`, census |
| Punctuation dot and ball (0.83, consistency 1) | One dot, the period's (124), on . , : ; … ! ? ¡ ¿; ?'s ball the capitals' round end (1.10 x 88), scaled about the stroke's top; ¿ ¡ are ? ! turned | ! ? ¡ ¿ | `charset.one_drawing`, `question_ball` | `audit_charset` dots |
| A foot is one corner (0.83, consistency 1) | No level step under 20 units between a foot's corner and the curve leaving it; no stray contour (pathlint `STRAY_AREA`) | ẞ, Ŋ | `charset.no_steps`, `eng_capital` | `pathlint.py` |
| Figures' sides (0.83, consistency 1 and 3) | A figure shows the same white each side (fit.py) where both references keep its two whites equal: 1 (an upright stroke, as I), 4, 5; the 3's open left is kept | 1 4 5 | `spacing.OPTICAL_MORE` | `tools/fit/fit.py sides` |
| 9 and 6, one solve (0.83, letters 1) | The counter's handle lengths, the outer bowl's handles either side of its lowest node under the counter, and those two lowest nodes (level) solved together for curvecheck (every smooth node, aim 1.15, no other fault) and even.py (shelf under 2.3, rate jump under 1.0, mean thickness within 0.6), least change; the 6 the 9 turned half round, point for point | 9 6 (their small forms, ∂ follow) | `figs.nine_even`, `nine_solve` (normalize, after `even.run`) | `curvecheck` on the figure, `even.py` |
| Q's tail start (0.83, letters 2) | A round end of the stroke's own width: a circle of the stroke across (54) tangent to the straight upper edge, its leftmost where the drawing's was; three arcs at the circle's handle; the underside's inflection at a node, its level top solved for one curvature (1.12), the stroke never under 0.9 of the end (no ball on a neck) | Q | `figs.q_tail` | curvecheck on the glyph |
| Extended capitals' parts (0.83, letters 3, 7) | On the first-drawn capitals (`EXT_CAPS`, Y, Ƴ) a serif slab reaching 80 to 130 from its stem's edge (read by a scan inside the slab) is `CAP_SERIF` 77; an upright stem 6 or more over 86 is 86, both edges in by half | Ɓ Ɗ Ǝ Ƒ Ɦ Ɥ Ɩ Ƙ Ɲ Ƥ Ɽ Ƭ Ʈ Ƴ Y (Ɏ ¥ follow) | `charset.ext_capitals`, `FOOT_ONLY` | `build/owner8/let/t3/capserif.py` |
| Glottal stops' balls (0.83, letters 3) | ?'s rule: the ball scaled about the stroke's top to the round end, the capitals' (96.8) at cap height, the lowercase's (88) at the x-height; then its nodes evened (handles only) | ʔ ʕ Ɂ ɂ | `charset.glottal_balls`, `round_end_ball`, `_inscribed` | `curvecheck --hooks` |
| Hooked lowercase's parts (0.83, letters 4) | A stem (two upright straight edges 100 long facing each other) between n's stem and 92 is n's (Ʋ the capitals' 86), an edge shared by two runs moving once; a foot slab of 74 to 130 is n's (70). Flags not yet | ɦ ɥ ɩ ƥ ɾ ɽ ﬆ ƭ ʈ ʋ c_t s_p ƙ ɲ Ʋ | `charset.ext_lowercase`, `EXT_LOWER` | `build/owner8/let/t4/lcstem.py` |
| Bowl's extreme (0.83, letters 5) | The branch's (or run-in's) handle at the bowl's top and bottom extreme is sqrt((2/3) rise / k), k the far quarter's curvature there: one curvature at the extreme (it was 0.40 of the run, 1.48 times flatter) | b d p q (þ ɑ g.ss02 @ follow) | `parts.bowl`, `BOWL_EXTREME_ONE` | curvecheck, `parts.check` |
| F's arm, P's closure (0.83, letters 5) | F's middle arm centred on E's; P's bowl closes where R's does, its lower quarters scaled upright about the right extremes (looked at in FERN PREP) | F P (Ꝑ Þ follow) | `figs.cap_bowls` | `build/owner8/let/5-FERN-PREP*.png` |
| One curvature by handles, guarded (0.83, letters 5, 6) | Every smooth node at one curvature by handle lengths (`loops.even_nodes`), at aim 1.25, else 1.5, else 1.8, kept only where curvecheck's faults do not grow, even.py stays in its limits (or its old reading) and parts.check's crotches hold | B P e d G J 2 (a r R tried and left) | `figs.even_glyph`, `EVEN_LETTERS` | curvecheck, even, parts |
| f's foot, Ʌ (0.83, letters 7) | f's right foot reaches as n's (70); Ʌ is V turned half round, feet on the baseline | f (every f ligature, ſ), Ʌ | `figs.f_foot`, `charset.turned_v` | build notes |
| The ampersand's crossings (0.84, Regular pass 2, item 1) | The lower bowl's stroke runs on through the diagonal as the arm: each bowl edge (P, Q) turns into the arm's edge line at a node hidden inside the diagonal (on its centreline), tangent to it, so both crossings (the spine, the bowl into the arm) have each edge on one curve through them; their corners found by intersection. The two edges solved together (`even_ribbon`): each chain's own terms (node curvature weight 30, ease 40) plus the width along every P segment from the loop to the crossing moving one way only between the node extremes, second difference small (no trough under the bowl: the counter's bottom 8 right of the outside's, `lb_di`). The crotch under the arm sharp; bowl and tail on o's overshoot (-10); the tail's cut the serif tip (30, `TAIL_CUT`) with corners on 7 (`soft_cut`, its nodes corners) | & | `amp.construct`, `even_ribbon`, `ribbon_width`, `soft_cut` | `build/owner9/amp/cross.py` (each edge 0.1 to 0.6 units off its one curve, under 0.8 degrees), `ampmeas.py` (width extremes only at nodes), curvecheck on the glyph in all three masters |
| The ampersand's ease (0.84, pass 2) | The bowl's stroke runs into the arm on an ease: its counter edge a clothoid from a node on the diagonal's centreline (radius `ARM_R` 450) to the arm's line `ARM_EASE` 100 past the diagonal (radius `ARM_END_R` 2500 there, at least `ARM_STRAIGHT` 50 of straight before v's serif), one cubic G2 at both ends; the outside edge its parallel at the arm's width (the stroke one width through the crossing); the bowl's curves meet it at one curvature. The bowl's width one even taper from its left side (o's side) to the arm's width `TAPER_LEAD` 30 before the diagonal (`bowl_taper` for the bottom's width, `even_ribbon`'s taper term at `TAPER_W` 0.3). The spine's hidden inflection at curvature 0 (`INFL_W` 20, times 1 - the weight share: at the Bold it held the loop 1.32 off one curvature); no flat place in the edges' curves (`DIP_W`); a curve's handles where it meets a straight on whole units by the straight (`_round_eases`) | & | `amp.construct`, `bowl_taper`, `even_ribbon(taper)`, `Chain.fixed`, `_round_eases` | `build/owner9/stroke/special.py` (crossings, width), curvecheck in every master and between |
| ~ and ≈ by slope (0.84, item 2) | One sine period set by its slope at the inflections (`TILDE_SLOPE` 32: height 34.7, crest radius 89 = 1.76 strokes), its stress scaled so the mean width along the centreline is the minus's 52 (`tilde_k`); the + box wide, ≈ two on the equals' lines; ends square, corners 7 | ~ ≈ | `charset.tilde_signs`, `tilde_k`; `signs.tilde(slope=)` | census, audit_charset |
| ~ and ≈, parallels (0.84, pass 2) | The wave 22.5 degrees at its inflections (`TILDE_SLOPE`; 20 read as a dash at 18 px, 25 still steep at 96); one width, the minus's 52 (`TILDE_STRESS` 0: the stress tightened the inside edge to radius 34); each edge the centreline's parallel, every quarter one cubic G2 at both ends (`signs.wave_sides`: the extreme's curvature read on the parallel, `WAVE_INFL_R` 4000 at the inflection); no straight run, the ends the wave's own inflections cut square, corners on 7 in the construction (`_soft_wave`); points on whole units keeping one curvature at each node (`signs.whole_units`); the box solved on the softened ink. ≈'s white is the equals' at the crests (102) and g(1 - cos 22.5) less at the inflections: two identical waves cannot keep one white along their normal | ~ ≈ | `charset.tilde_signs`; `signs.tilde(parallel=, whole=)`, `wave_sides`, `whole_units`, `_g2_cubic` | `build/owner9/pass2/tilde/tm.py`, `build/owner9/stroke/special.py` |
| The @'s white (0.84, item 3) | The white between the a and the ring one width all round: each side's white the white over and under the a, so the ring's width follows from the a (`at.EVEN_WHITE`; it was the references' 0.968 of the height with the white right of the a's stem 1.24 of the left); the right extreme's rise kept (0.107) | @ | `at.construct` | `build/owner9/at/atmeas.py` (rays: white 183 to 223 per mille of the height) |
| The @'s right side (0.84, pass 2) | The right extreme 0.02 of the height over the ring's centre (`at.RISE`; was 0.107). The outer edge from it down into the a's foot one spiral, its curvature rising evenly from the right quarter's (radius 400, 0.462 of the height) to where it is level, 200 (0.245 of the ring's width) left of the extreme: the ring leaves the a there, a little lower and further right than the a's own foot (`at._dive`, `DIVE`), two cubics G2 at their ends; the a's foot curve re-solved into it (curvature only falling); the inner edge's foot half way between the parallel and the a's own place; the extreme and the inner middle node held at one curvature (`Ring.tight`); the tail's cut a free end, corners on 7 | @ | `at.construct`, `_dive`, `_spiral`, `Ring.mono`, `Ring.tight` | `build/owner9/stroke/special.py` (@), curvecheck on every master |
| ∑ ∏ bars (0.84, item 4) | Both bars of ∑ and the bar of ∏ the capitals' arm (`balance.CAP_ARM` 46, E's top and bottom arms alike); ∑'s bottom was 0.90 of n's stem (70), ∏'s bar 1.15 of H's crossbar (56) | ∑ ∏ (Ʃ already) | `sigma.KIND`, `charset.maths` | `build/owner9/sigmeas.py` |
| One corner rule (0.84, item 5) | Free ends: both corners on the letters' serif-tip radius, 7. Vertices (two strokes meeting at a point): the letters' apex, an outside flat across the bisector 0.42 of the class's stem (v w 33, A V W M N 36), the inside a point; a sign's vertex the lowercase's 33 as a share of its own stroke (`signs.LETTER_FLAT`; `LESS_FLAT` 0.630 of the plain stroke, `TAPER_FLAT` 0.762 of the hairline), the capital-built signs the capitals' 36. Inner corners sharp. Solids and outline shapes: outer corners on 7. Exceptions in `build/owner9/corners/corners.md` (the tapered round ends, the @'s a fillets, solids' points, ⇧ ⇪ barbs, guillemets) | → ← ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ < > ≤ ≥ ^ ⌃ ✓ √ ∑ Ʃ ∆, and the rule's sources | `signs.LETTER_FLAT`, `LESS_FLAT`, `soften(keep=)`, `caret`; `charset.TAPER_FLAT`, `vertex_flats`; `sigma.KIND` flat | `build/owner9/corners/census.py` |
| Capital marks, marks on anchors (0.84, placement 1) | A capital carries the .case form of every mark above that has one, its first mark's anchor on CAP_MARK_Y (763) at the x its mark stood, a mark stacked on it centred on its ink STACK_GAP (13) over it; marks below keep one form for both cases (the dot below dotbelowcomb's, -215 on its anchor). After every other mark rule each letter's first mark above and below stands with its anchor exactly on the letter's (BOTTOM_ANCHOR 4 under every letter); a drawn ring-and-acute mark's anchor goes where its letters put it; an ascender's MARK_DROP marks stay 19 over (by MARK_DROP's own rule). MARK_BAND 1; an unencoded accented letter takes its letter's class in derive | every accented letter | `charset.case_forms`, `restack`, `marks_on_anchors`, `MARK_BAND`, `BELOW`; `derive.klass`; `alternates._body_cx` | placement census 3.3 (`build/owner9/place/census.py`), `audit_charset` marks |
| Edges on their line (0.84, placement 2) | A level edge within 2 of a zone's flat value (within 1 of its round value: a vertex's flat) and a round extreme within 1 of a round value stand on it, points with their handles (lowercase flat 0 520 780 -224, round -10 530 780 -233; capitals and figures 0 712 / -9 721); a foot cut within 3 under the baseline on it; ʌ is v turned; % ‰ zeros on the figures' round lines; ¦ the bar's extent. Not a rule (withdrawn): the head serifs on i's 530 (n m p r keep 529: on 530 the masters' height pin thinned n's Bold arch by 5) | every letter and figure; ɋ ﬆ π ʌ % ‰ ¦ | `balance.zone_lines`; `charset.turned_v`, `percent_fit` (`FIG_ROUND`), `plain_strokes` | placement census 2.1 |
| Signs on the axis (0.84, placement 3) | A sign's ink (its box) on the maths axis: the arrows by the recipe's place, the triangles by their box (references: the box's middle, never the centroid), · • ∙ centred on it (· ∙ the period's dot) | ↖ ↗ ↘ ↙ ⇧ ▲ ▼ ▴ ▾ ▶ ◀ ▸ ◂ · • ∙ ŀ | `charset.arrows`, `_built_mid`, `interface`, `more_symbols`, `bullet` | placement census 2.2, `build/owner9/place-fix/fixed.py` |
| Bracket extent (0.84, placement 4) | ( ) [ ] { } one top (767) and one bottom (-164, Georgia Pro's bottom-to-top ratio): [ ]'s arms move whole, ( { scaled upright | ( ) [ ] { } | `charset.bracket_extent` | `fixed.py` |
| Quotes (0.84, placement 5) | ‘ is ’ turned with sides swapped and top on ’'s; a double is two singles at the single's sides, the turned pair one gap; ‚ is the comma; ʼ is ’ (the primes keep 802: on the quotes' 809 they stopped growing in the masters) | ‘ ’ “ ” ‚ „ ʼ ʻ | `charset._turn_pair`, `_double`, `low_quote`, `letters_extra` | `fixed.py` |
| Symmetric sides (0.84, placement 6) | A drawing that is its own mirror image within 1.6 gets equal sides (outline moved by whole units, an odd total gains a unit); accented letters follow; run before the letters built on them and again before `finish` | H I 0 . the bar ¦ ° * ' " ¤ ⁰ ₀ and their families | `spacing.symmetric_sides` | placement census 3.1 |
| A round stroke's thinnest place (0.84, strokes 1) | The pair of level extreme nodes facing each other across the ink (outer on the letter's edge, inner on the counter's); the thinnest place within 20 units of the pair (medial balls, both edges) is the class hairline (43, capitals and figures 47); only the inner node moves, upright, with its handles, the least whole-unit move | J f 5 G C 6 9 8 c e (Ɉ, the f ligatures, ſ, the small figures, the struck letters follow) | `hair.hairlines`, `STROKES` (normalize, before spacing) | the stroke audit (thin under the hairline), `build/owner9/pass3/tools/meas.sh` |
| One ball for the tails (0.84, strokes 2; **withdrawn**, not called: the Bold's y took a 35% flat place) | j's and y's ball the round ends' 88: the ball's seven points scaled about the neck by 88 over its fitted circle; then `round_tail`, then y evened (`figs.even_glyph`). y's depth stays -209 (to -233 withdrawn: stroke 35, three curvecheck faults) | j y (ȷ ĵ ij f_j eng ý ... follow; the masters' ball law reads it) | `loops.tail_law` (before `round_tail`) | curvecheck |
| A spine (0.84, strokes 3; **withdrawn**, not called: handles and node moves alone broke the curvature where the spine meets the bowls, 14.9; a spine construction is needed) | One swell: the width along the spine's middle (balls on the upper edge, 0.55 of each adjacent curve) has one maximum, at the spine's middle (half way between its two nodes), equal to the class's round widest (O 92, o 82, read on the build); the two spine nodes move along their normals and their four handles change length, least change | S s | `hair.spines`, `SPINES` | `hair.spine_profile`; stroke audit special (S / 8) |
| B P R bowl side (0.84, strokes 4) | The widest across the bowl's side within 60 of its right extremes is P's: the counter's right extreme moves level | B (upper bowl) | `hair.bowl_sides` | stroke audit likeparts (bowls B P R) |
| Diagonals per band (0.84, strokes 5) | A stroke set by balance.diag on the edges in its band, then repeated until it reads its target across its two parallel edges: every capital thick diagonal the capital stem 86 (x's and X's halves withdrawn: X turned between the masters, x drifted, audit_bold failed the Bold x); Z's arms the capitals' arm 46 (corner sliding on the diagonal) | A V W M N K Y Z | `hair.diagonals`, `DIAG_HALVES`, `across`, `z_arms` | stroke audit likeparts (diagonals) |
| Dots and the comma head (0.84, item 6) | The text dot i's (116) on j and every lowercase mark (dieresis, dot accent, dot below, dieresis below); the capital marks' dot the dot accent's case form (94); the dot below holds its depth; the punctuation dot the period's (124); ’ is the comma scaled 116 / 124 = 0.935 (top and sides kept; ‘ “ ” ʼ follow) | i j, the dot marks, ’ ‘ “ ” ʼ | `hair.dots`, `quote_head` | stroke audit likeparts (dots, tails); placement census 4 |
| Guarded evening outside the core (0.84, item 7) | `figs.even_glyph` on finished drawings: kept only where curvecheck faults do not grow and even.py holds | Ə ɔ Ɔ s_p (ß ə © ® ℗ left by the guard) | `hair.even_more`, `EVEN_MORE` | curvecheck, curvecheck --hooks |
| One outline across a seam; a shaft in whole units (0.84, item 8) | Two contours ending in upright cuts on one line over one span: corners squared, one outline. A shaft between two heads 43 exactly in whole units, its corners sliding on the heads' inner edges | Ƭ; ↔ ↕ | `hair.seams`, `shafts` | pathlint; stroke audit (arrows' shaft) |
| A spine, constructed (0.84, pass 2, spine construction; replaces the withdrawn row above) | The stroke from the top pair of level extremes to the bottom pair is one ribbon: the centreline the drawn stroke's medial axis (both edges' balls, between the stroke's own edges), a quintic smoothing spline level through each end pair; one width law along it: the end pairs' hairlines kept, one maximum at the centreline's inflection, w = w_end + (W - w_end) sin(pi x / 2) ** 1.5. W the class's round widest times the ladder's thick-diagonal share (O 92 x 0.949 = 87.3, o 82 x 0.949 = 77.8: the class stem's optical weight; references S/O 0.92 to 1.02, s/o 0.89 to 0.98). Each edge the centreline's parallel at w / 2, fitted by the outline's four cubics (nodes at the edge's two bowl extremes and its inflection), handles solved for position and one curvature at every node, the kept terminal's at the ends, a quarter's handles within 1.5, the inflection's handles rounded onto one line. Every master the same on its own S s (after `s_terminal`, `round_ends`) at its own O o sides | S s (their accented forms follow) | `spine.py` (`regular` in normalize; `master` in `bold.bold_font`) | stroke audit (no width bump, dip or thick off its node on S s), `build/owner9/pass4/tools/sview.py` (one maximum per edge, node ratios) |
| A crossing, constructed (0.84, pass 2, crossing construction; replaces x's and X's withdrawn halves) | Each stroke a direction and a width; its two sides two lines, each one line through the crossing; corners where the strokes' sides meet (whole units: of the four nearest, the one nearest both lines). Widths the class's read on the same font (x v's 74.0 / 39.4, X V's 85.9 / 47.8). Of each side's two pieces the one facing the top or bottom white keeps its serif end (the serif-end opening); the direction follows; other serif ends slide along their line at their own height, bracket handles turned onto the line and kept short of the handles' meeting point. Every master the same on its own x X (after the crossing rules); the mid master at the readings half way (`cross.mid`) | x X (ẋ ẍ Ẋ Ẍ follow) | `cross.py` (`regular` in normalize after `hair.diagonals`; `master`, `mid` in `bold.bold_font`) | `cross.check` (each side's pieces within 0.5 units / 0.5 degrees), `audit_axis` drift, `audit_bold` slanted strokes (each diagonal read whole) |
| Tails of j and y, constructed (0.84, pass 2; **withdrawn**, `tail.py` kept as a study) | A spiral centreline from the straight (curvature rising, piecewise linear) to the ball's centre, the outside's lowest point on -233; width the straight's to THIN 39 at the lowest point to the ball; the ball a circle of 88 (x 1 + 0.40 f in a master); the inside the outside's parallel at the law; the neck where it meets the ball's circle. Regular and Bold clean, the Light y a 56% valley; each re-weighting that cleared one master broke another | j y | `tail.py` (not called) | curvecheck in every master |
| Currency bars (0.84, pass 2, leftovers) | Every level or leaning bar a currency sign adds is one value, `charset.CURRENCY_BAR` = the capitals' hairline 47 (was H's crossbar 49) | € ¥ ₽ ₺ ₩ ₦ ₱ ₭ ₮ ₫ ₹ ($ ₡ ₿ ₲ already 47; ₸ keeps T's arm 46, its lower bar T's own; £ ₤ own drawings, not done) | `charset.currencies`, `letter_currencies`, `euro_sign`, `letter_signs` (yen) | `audit_charset` (euro) |
| Per mille's bar (0.84, pass 2, leftovers) | The bar's ends on the figures' flat lines (0, 712) as %'s; its end points move along the bar's own direction | ‰ | `charset.percent_fit` | census vertical |
| The ampersand's lower crossing (0.84, pass 3, owner item 1; replaces the ease inside the diagonal) | The bowl's thin stroke crosses the diagonal as x's strokes cross: both its edges two straight parallels from `THROUGH_LEAD` (10) before the diagonal's lower edge to 10 past its upper edge (and past where the outside meets the tail's top), at the direction half way between the bowl's own arrival (twice the angle of the chord from the counter's floor to the arm's crossing of the lower edge) and the arm's; after the diagonal one cubic per edge into the arm's line, both handles on the lines' corner, ARM_R x half the turn long (at least 45, ending ARM_STRAIGHT before v's serif). Before, the stroke still turned inside the diagonal and its edges came out 17 degrees steeper than they went in (the owner's "step") | & | `amp.construct` (`THROUGH`, `THROUGH_LEAD`, `THROUGH_EASE`) | curvecheck on the glyph, structure equal in every master (`amp.master`) |
| § joins (0.84, pass 3, owner item 2) | The two crotches outside a concave fillet of 0.30 the capital stem, then every smooth node evened; kept only in a form the Bold's and Light's engines carry without a fallback (`bold.glyph_bold`): the counter's rounded ends were refused (the spine's straight edges then bent 1.6 to 2.5 degrees half way) and stay corners | § | `symbols.section_joins`, `_joins`, `_fillet`, `_round_end` (normalize) | curvecheck on the glyph (3 > 0); the build's fallback list |
| $ from S's construction (0.84, pass 3, owner item 3; replaces "One sign, one form" for the stroke) | The $ keeps its own path and ball ends; its S stroke is S's construction (`spine.construct`) on the S the bar hides (the six crossing edges' one curves), the spine the figures' round widest (the zero's side) x 0.949; cut at the bar again, `true_crossing` once more. Regular and every master | $ | `dollar.spine_s`, `_walk_s` (normalize; `bold.bold_font` after the master's true_crossing) | `dollar.check`, the census ink |
| 9 and 6's tail (0.84, pass 3, owner item 4; replaces NINE_QUARTER and NINE_LEAN) | g.ss02's tail: the lowest point (outside and inside on one upright) at g's share (0.460) of the way from the ball's side to the right side; each edge leaves the right side upright and turns round into the lowest point in one cubic: its upright handle reaches to where g's quarter (0.92 / 0.95 as high as wide, outside / inside) would start plus 0.55 of that quarter's height, its level handle 0.55 of the width; then the tail evened. The 6 the 9 turned | 9 6 (their small forms, ∂ follow) | `figs.nine_tail`, `G_TAIL` (normalize, after `clean.nine_six`) | curvecheck on the figures |
| The @'s ring round (0.84, pass 3, owner item 5) | The ring's width its height (`at.ROUND` 1.0); the a centred, the side whites take the extra width | @ | `at.construct` | `build/owner9/at/atmeas.py` |
| Small figures' weight (0.84, pass 3, owner item 6) | Superiors and inferiors 8 units a side heavier than scaled (stem 62 = 0.54 x 86 x 1.33, Georgia Pro's share; was 4, 54); the fraction bar 56 level (was 48); ‰'s lower zeros one advance apart. The ordinals keep 4 | ⁰..⁹ ₀..₉, every fraction, % ‰ | `charset.SUP_BOLD_FIG`, `FRACTION_BAR`, `percent_fit` | audit_charset (bar) |
| A bowl's foot inside (0.84, pass 3, owner item 7) | Where a capital bowl's floor runs into the stem inside, the counter leaves the stem one bowl-bottom stroke (47) over the floor: a quarter's upright handle (0.55), a level handle meeting the floor's other curve at one curvature | B D | `hair.bowl_foot` (normalize) | curvecheck |
| Æ's halves (0.84, pass 3, owner item 8) | The A half reaches 0.9 of the E half: A's leg leans out about the apex (foot whole, crossbar stretched to the stem, the leg's outer edge out so it keeps its thickness across) | Æ (Ǽ Ǣ follow) | `charset.ae_wide` | look |
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
- **A word space is fit too** (0.81, close). fit.py's pair measure reads only rows where both glyphs have ink, so a
  descender running under the space before it is never seen. The least white across "x␣j" (HarfBuzz, every a to z)
  was 63 under the nearer reference's at 400: space before j's class is kerned by that median
  (`spacing.SPACE_BEFORE`). Measure a word space this way after any change to a descender's reach.

## When a corner is rounded

0.84 (Regular pass 2, item 5): one rule for the whole Regular, signs included: a free end's two corners on 7 (the
letters' serif tips, measured 7.0); a vertex an outside flat 0.42 of the class's stem (33 lowercase and signs, 36
capitals and the capital-built signs), its inside a point; inner corners sharp; solids' corners on 7. The table row
"One corner rule" lists where it does not hold.


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

- **The axis (0.82, owner round 8).** The design axis is the stem; the user axis is 300 to 800 (100 to 800 once the
  Thin is in): Light 300 (55), Regular 400 (78), the sparse mid master 600 (104.5, it was 550), the Bold master 800
  (140, ExtraBold; it was 700); the named 500 / 700 land on 90.3 / 121.0 through the designspace map (avar).
  `weightaxis.py` holds the scale and every conversion; a tool that names weights takes them on the 0.82 axis
  (`old:` for the 0.81 one), prints which, and its default stops are 0.81's at the same stems, so old and new
  audit numbers compare. Never write a weight literal into a tool: take it from `weightaxis`.
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
- **Known debts** (0.81, last round; was the close round's list): kerning per master is done (`spacing.kern_master`,
  refit with `AREA_KERN_FIT=1`); fallbacks none. Closed this round: the hook above's crossing (a curl and a stem,
  `overlap.curl_master`), @'s nub at the Bold (`bold._fillet`), C's barb (`keep_taper`'s guard); C, Cbar, Q, s and the
  capital ogonek were the reading's sampling, not thinning (`audit_axis.place_reading`). Left: `audit_axis.py` Bold
  thin where the same-place reading finds it (® ring by R's leg 40 > 32, @ 41 > 34, Khook 49 > 38, cedi 47 > 39,
  tretroflexhook 41 > 39, ogonek and ogonekcomb 1.0 under at 675, one.ss01's flag 43 > 36); Light yhook (a junction
  reading, 44 > 21); the hooks with a ball at 300 (whook yhook Ƙ Ⱳ Ƴ ⱳ ƴ ɲ ƒ, j, eng: no construction; their rays
  flags stand); @ in the Light (slanted stem held to the Bold: its whole left side must move by one map, not written;
  95 > 92); `audit_rays.py` flags at junctions (Ə ɂ & ® $ œ ð) and ɽ's ball, none by the white law's design, and ⌦ ⌫ ✓
  at 300 (0.60 of 400 against the sign law's 0.764), found once lines were read again; hookabovecomb.case keeps no
  ray place; Astroke and Tdiagonalstroke held for the owner (`audit_axis.AWAITING`); "x␣j" with v, w, y before the
  space 64 looser than Georgia Pro (one key per space); no part audit for marks, signs and composites.
  Owner round (15 November): curvecheck now reads the Light and Bold masters and fails on faults the engine left
  where even_nodes would thin a place (Light g's loop 1.37, 1.42, a G1 6.3 degrees and an ease 0.56; Bold g 1.87,
  a.ss03 1.76, l.ss04 1.91 and 6.05); the x leans at the Bold (-0.123 of its height, refs to -0.037) until its serifs
  are placed from a kept edge; s z G S X e g w a c lean past both references (`audit_lean.py`); the 9 and 6 long
  stroke steeper than both references in the Regular: redrawn in owner round 2 (`clean.nine_six`). Owner round 2 left:
  the Light g's loop (every solve thins it); the x's lean (the kept-lean and bracket rules work on the x but miss x's
  opening targets and thin the ampersand's crossing: `LEAN_KEEP_THICK`, `BRACKET_FROM_EDGE` off); s z G S X e g w a c
  lean past both references; s's turns grow 2.3 times (stems 1.8). Owner round 3: y's ball on the round ends' radius
  (44); the Bold's diagonal letters measured against n and H and the references (only x outside: 1.134 against 0.997 to
  1.032): x's opening must be constrained where it is measured (across the ink, not on knots) before its angle can be
  kept; s's barbs are not read as strokes (grow 1.05, references 1.27 to 1.53); T's arm reads as a curved level stroke
  (1.24, capitals' arms 1.33); the Light g's loop needs a centreline construction. Owner round 4: s fixed (turns by
  the round strokes' ratio, barbs read: `HINTS["s"]`); x infeasible as asked: each end's bracket-level and serif-level
  openings move together, Regular difference 88/87, Bold geometry 66/62 with the angle kept; one of the two whites
  must be chosen; S (lean drift -0.050, band -0.027 to +0.002) and c's lower stroke (grows 1.24, references 1.58 to
  1.75) open. Owner round 5: x landed (serif-end opening kept; Bold advance 0.983 of n's growth, the one target short);
  S (s_terminal), c and e (open_tail) landed; the Light g's loop from its centreline: one fault left (an ease of 0.49
  into the link, limit 0.45). Owner round 6: the Light g passes (the link's node slides along its straight); the 9
  and 6 drift cured (a ball's sides are not a stroke read far from the ball's height). Left: G X z a g w lean past the
  references (triaged, no covering rule), the axis list, the terminal table's neck and exit angle.
  Owner round 7: builds are repeatable; signs capped by the white law move when a HOLE_LETTERS letter changes (the law's
  counter median). The IPA hooks' balls are drawn tilted 28 to 30 units across the axis and are not read as balls
  (`bold.balls` accepts 6): a tilted-ball reading is the next step for them.
  Axis round: the tilted-ball reading landed (`bold.tilted_balls`; Ƙ Ⱳ Ƴ ⱳ ƴ ƒ pass audit_rays every 25 units, Khook's
  Bold thin cured; 21 more hooks and tails with a ball follow the ball law, ß among them); `audit_axis` reads a point
  drawn with a flat as a point (ⱳ's apex). Left: ɲ at 300 0.619 of 400 (its tail is not j's point for point; j's
  rule on it and a slide along straights in keep_taper both tried and reverted); yhook Light 44 > 15 at 300 (its
  descender ball now grows by the ball law; the tail's inner node between a straight and a curve is moved by no
  Light rule); ʕ's bowl stroke into the stem thins 94.8 > 78.9 (newly kept by audit_rays; it thinned to 69.1 before);
  tretroflexhook 41 > 39; one.ss01's flag (no flag rule for the figure; its underside handle rides the stem's knots
  28 left); cedi (to be struck it needs a letter: its C matches neither Area's c nor C, the owner's choice); ogonek
  1 unit; ® ring by R's leg; @ at the Bold and Light; the junction places Ə ɂ & ® $ ð œ and ⌦ ⌫ ✓, each measured a
  second way (a disc tangent at the place agrees with the ray: the ink really thins; no part rule yet).
  Axis round 2: yhook (Light), ɲ, ʈ, ⌦ ⌫ ✓ landed (rows above); `curvecheck.py --hooks` reads the hooks' balls and
  necks in every master (the Regular's own drawings carry 41 faults; the masters' own faults left: Light 6, Bold 15,
  where even_part cannot clear them without thinning). Left: one.ss01's flag (a crotch rule in the Bold; its tip
  wants 51.7 at the Bold and stays 40); ogonek 1 unit; ® (its R to be fitted to the ring's inner white); @; ₵ (the
  owner's choice, figure 23-cedi); the round strokes entering a junction (Ə ð ʕ ɂ œ & $ ®): no rule yet. ʋ's counter
  straight is 124 shorter in the Light by the straight-node rule: a visible change to look at.
  Axis round 3 (the last before the owner's review): ® cured (a letter in a ring); ʋ back to round 1 (the slide now
  reads as audit_rays reads and reaches at most 1.5 strokes); cut ends grow towards the Bold. Open, honestly: the round
  stroke into a junction (Ə ð ʕ ɂ œ & $: thins towards the Bold, thickens towards the Light; its places sit where the
  white ends, inside the junction zones the taper stations leave out; no rule); @ (its a is one contour with its
  ring); the ogonek (0.95 units, under the Bold taper rule's one-unit mask; its cut grown by the tip's law cures it in a
  trial); one.ss01 (its thin place is across the flag, not at the crotch; keep_necks towards the Bold reaches only < >);
  ₵ (the owner's choice); the hooks' curvature faults even_part cannot clear (Light 6, Bold 15) and the Regular's own 41
  (first drawings; comb sheets 24-hook-combs-*).

## What is still outside the system

Say this in every report until it is closed:

- Extended letters that still carry their first drawings (old joins cut flat, necks 30 to 37): germandbls, and the
  Latin Extended-B and IPA letters outside `charset.COVERAGE` (b d g h p q with hooks and tails, eng's relatives,
  alpha, turned h, r with tail, the s ligatures).
- u's head serifs are level (520); n's are 8-degree flags. Both references lean u's. Open with the owner since 0.33.
- Capitals and figures: bowls on B D P R and the joins of 4 6 9 have hairline and stem rules but no shared-bowl
  construction yet (0.83 letters 5: P closes where R does and B P are at one curvature; R's evening breaks even.py).
- 0.83 letters pass, left: a's counter (3.74) and r's shoulder (2.18) (every evening moves their crotch off its neck or
  leave); the hooked lowercase's flags and ɗ ᶑ ɠ's stems (their stem edge lies in the counter); Œ's seam and c_t's link;
  a and g 13% and 16% darker than the lowercase mean (their drawings).
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
- **One sign, one form.** The dollar is the ball-end drawing; do not rebuild it from S and a stroke. (0.84 pass 3: its
  stroke now takes S's spine construction, ball ends and path kept: `dollar.spine_s`.)

## Curvature, measured (0.81)

- **A smooth curve is judged by its comb, not its tangents.** `curvecheck.py` reads curvature along a part: the ratio
  across each smooth node (under 1.25), the step where a curve leaves a straight (under 0.45 of the curve's tightest),
  a flat place inside a curve, and along a tail any fall-and-rise over 30%. A ball's neck, where the curve turns the
  other way, is not a jump. `tools/combs.py` draws the combs; look at them before and after any curve rule.
- **A part that overlaps itself to make a join is a fault waiting to show**: 0.80's g loop ran its hook into the link
  and left a white sliver in the variable font at 550 and 700. Draw the join as one outline with its crotch.
- **When handles cannot reach a smooth curve, move the places, not the tension**: g.ss02's tail could not tighten
  evenly into a ball at 0.138; at 0.100 it does with ordinary handles.

## Reading a stroke (0.81, close)

- **Across the stroke, never along a scan line.** `audit_axis.thinnest` reads a span that is a stroke as the
  shortest cut through its middle, turned up to 60 degrees, ending on two edges that face each other within 40
  degrees; a span no such cut crosses is no stroke (a horn's tip). A level or upright cut through a slanted tail reads w / cos(slant), and changes when the slant does (the
  comma accent below a capital: 43.0 > 39.9 upright, its stroke across itself kept). Changing a reading changes many
  numbers (410 of 978 glyph-sides' Regular readings moved by over 0.5): rerun the whole audit and list every glyph
  whose result changed, both ways.
- **An end is not a stroke.** A cut or a ray within half its own length of a stroke's cut end (an outward turn of
  60 degrees within 12 units of outline: a terminal's corners, soft or sharp) reads how the end is cut
  (`audit_rays.end_corners`, `END_ZONE`); the pointed-end rule (under 60 degrees) still holds.
- **A junction drawn soft is a junction** (a concave turn of 90 degrees within 12 units), and **a ray across one
  stroke comes back**: from where it leaves, a ray along that edge's normal lands within half its length of where it
  started; one that crossed a junction with smooth sides does not (`audit_rays.RECIPROCAL`).
- **The same place on both masters** (0.81, last round). `audit_axis` thin compares the instance's thinnest cut with
  the Regular's cut between the same two edges at the same shares (`place_reading`), not with the Regular's thinnest
  anywhere: by a cut end the least reading sits at the end zone's edge and moves with the scan lines' phase (Q's tail
  22.6 > 19.8 > 23.6 at 400, 425, 450; at every fixed distance from its end it thickens). End corners are found on
  the outline cut every unit (`END_STEP`), not on the flattening's vertices. A line is cut at the same parameters as a
  curve in `audit_rays` (a straight stroke's only places were its corners: 58 glyphs went unread).
- **A point drawn with a flat is a point** (0.81, axis round). `audit_axis.points_of` takes a straight under 30 units
  between two corners, its two neighbouring straights meeting under 60 degrees with the ink between them (a vertex's
  outside flat, a spur's or a guillemet's tip), as a pointed end at the flat's middle. ⱳ's middle apex read 19.6
  across its two outsides 16 units under its flat at 300, a cut across a vertex that a scan line found or missed by
  where it met a node (the two sides meet at 40 degrees, FACE_DEG's margin). 26 glyphs gain such a point; on the round
  7 masters no result changed.
- These are reading rules, not tolerances: each was checked on the glyph that raised it by drawing the ray or cut
  (`build/figures/081/`), and the places they leave out are counted in the audit's own summary line.
