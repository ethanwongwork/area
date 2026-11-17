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
| Plain stroke end | Two straight parallel edges and a straight cut: both corners on radius 7, as the letters' cut ends (0.79) | every glyph outside the letters and figures: dashes, maths, bars, slashes, arrows, bracket arms, macrons, struck bars | `charset.soft_ends` | `audit_charset` (`sharp_ends`) |
| f's hook in a ligature | Lengthened by rule to end 0.42 stems past the next stem's centre; into an ascender, cut at its top and run level across the stem | fi ffi fj ffj; fl fb fh fk and their ff forms | `charset.f_hook`, `f_join` | `audit_charset` ligatures |
| 5's bowl | Lowest point 0.457 across, outside widest 0.525 up, counter widest 0.500 | 5 | `clean.five_bowl` | `audit_charset` |
| Sign from a letter | The finished letter and a stroke of the case's hairline (47, 43) | $ ¢ ¥ ĸ, ₩ ₽ ₺ ₫ | `charset.letter_signs`, `kra`, `currencies` | `audit_charset` letter signs |
| Mirrored pair | The left form turned over, point for point | ) ] } » › > ≥ ⇥ ⌦ | `charset.mirrors` | `audit_charset` mirrors |
| Bracket test | A curve meeting a diagonal across a corner over 60 degrees is not its bracket | every serif on a diagonal; the ampersand's arm (0.82: the arm is now built with v's serif, `amp.py`) | `derive.BRACKET_MAX_TURN` | `audit_charset` ampersand |
| g's lower loop | Quarters at the bowl's tensions (0.57 out, 0.61 in); each lowest point where b/a^2 is equal on its two quarters; extremes' heights at the references' share of the counter (left 0.495, right 0.57); the left side meets the link as a branch (neck 32) in a notch and a crotch; curves off the link's straights tighten steadily (curvature at the straight at most 0.35 of the curve's tightest); every smooth node's handle solved for equal curvature | g | `loops.g_loop` (in normalize after even) | `curvecheck.py`, `audit_charset` (`audit_081`) |
| Tail off a stem (g.ss02) | 0.80's tail, by the owner's choice (owner round 8, form E): four quarter turns between five places, handles 0.55 of their side; the outside leaves the stem 2 above the baseline, the inside where j's inner stem edge ends; lowest point 0.518 of the bowl's width (0.560 at the Bold stem), stroke 0.963 hairlines there; ball j's (in a master the engine's j before the tail rebuild), its top 0.138 x-height under the baseline (0.120 at the Bold stem). curvecheck reads 1.38 to 1.65 at its lowest points and ball: listed as the owner's choice. The masters' curvature evening leaves it (`bold.G_OWNER_SHAPE`). Forms A to D in `G_TAIL_FORMS` | g.ss02, ɡ | `charset.single_g_points`, `_tail_080` | `curvecheck.py` (EXPECTED), `audit_charset` |
| Tails of j and y, the a's exit (0.81) | g.ss02's tail rule on each: from the straight edge (stem, thin diagonal) round the lowest point to the ball, curvature only rising toward the ball and equal across the lowest point; ball, depth, stroke and reach kept; lowest point at the references' share of the reach (j 0.673, y 0.681). The a's exit: its two handles solved the same way, its ends fixed | j y a (and ȷ ĵ ij fj ffj eng ý..., a.ss03 ª ⱥ) | `loops.round_tail`, `loops.a_exit` | `curvecheck.py` |
| Alternates (0.81) | ɑ: the b d p q bowl narrowed across the counter to the references' advance (0.945 n), q's spur, a's exit; tailed l: t's hook on l's stem; zeros: the zero's hairline slash inside the oval, a dot of the side stroke's width; barred 7 z: a level bar of the class hairline, half the top arm | a.ss03 l.ss04 zero.zero zero.ss05 seven.ss06 z.ss06 and families | `alternates.py` | `audit_charset` (`audit_081`), `curvecheck.py` |
| Along a tapering stroke (0.81) | Each place keeps its ladder law's share of the Regular's thickness there: the stem's ratio at a stem, the hairline's at a hairline, the tip's at an end, interpolated by the Regular thickness between (one continuous law); Light everywhere, Bold where the engine read a place thinner than the Regular. Handle lengths first; towards the Light a place still short by more than 3% of its law (the JND) moves its places: the smooth nodes of its curve and of the curve its ray ends on, each rigidly with its handles (a node with level handles moves level only), and a straight cut end under 30 grows along itself; corners never. No new turn or crossing, no place past its law | tails, hooks, flags, terminals (j y eng f r a c e ƒ, the hooked letters) | `white.keep_taper`, `taper_law`, `_taper_places` | `audit_rays.py`; `tools/taper_plot.py` |
| Slanted stem with one straight side (0.81, close) | A stroke whose one side is a line 5 to 35 degrees off upright and whose other side is a curve's upright extreme facing it across the ink is a stroke: its level width at the extreme takes `x_target`; the extreme moves level and every point of its contour between it and the contour's far extreme by its share of the move (the engine's knot map corrected at the knot a line lacks). Towards the Bold only: towards the Light the map ran the counter into the a's top crotch, which it does not carry | the a of @ | `white.slanted_stems`, `keep_slanted_stems` | `audit_axis.py` thin |
| A star's reach (0.81, close) | Towards the Bold a star's arms reach the least that brings its ink gain over n's to the references' least (Georgia Pro 0.819), within the references' span changes (at most 1.092); the outer part of each arm, from its innermost smooth node out, is its Regular scaled about the tip and carried out whole (a similarity: no curve turns); the junction scales by f, the part between takes up the length. f stays capped by the white law | asterisk (Bold reach 1.065, f 1.197) | `arms.INK_GAIN`, `REACH_MAX`, `Arm.along`; `bold.bold_font` | `audit_axis.py` turns, symmetry |
| Neck at any crotch (0.81) | The nearest approach across the ink at a branch, whatever its sides; a straight-sided crotch slides along its straight side to the neck (as `parts.solve`); a Regular neck under the tip is no branch | every crotch (Light) | `white.keep_necks` | `audit_axis.py` thin; `audit_bold.py 55` |
| Mirrored pair (masters, 0.81) | The right-hand form is the master's left-hand form turned over, point for point | `charset.MIRRORS` (with ⇤ ⇥, ⌫ ⌦) | `bold.mirror_pairs`, `turn_over` | `audit_axis.py` mirror |
| Inflection at a node (0.81) | A curve's end bends the Regular's way at an S's node or out of a straight: its far handle slides along itself until it does | c_t, section | `bold.inflection_nodes` | `audit_axis.py` turns |
| White inside one contour (0.81) | g.ss02's ball keeps the white law under the bowl; its rise stops where the law holds | g.ss02 | `charset.single_g_points(least_white)`, `ball_white` | build notes |
| Struck stroke's end (0.81) | A stroke whose side would lie on its letter's edge ends where that edge begins (no seam) | Ɍ (Light) | `overlap.inset_ends` | `audit_axis.py` seam |
| A curl on a stem (0.81, last) | In the variable font's masters the hook above is two parts overlapping, as the struck letters are: the curl (from the stem's right edge round the eye to the eye's foot, closed by a line inside the stem) and the stem (a stroke, `move_stroke`, its top the eye's foot). Towards the Bold the eye is the Regular's about its centre times the white law's least over its width, centred where the engine put it; the slot to the stem gives way into the stem by at most its gain. The static Regular keeps the one merged outline | hookabovecomb, hookabovecomb.case (and every composite carrying them) | `overlap.curl_master`, `curl_parts`, `vf_source`; `bold.bold_font` | `audit_axis.py` crossings, turns |
| A tail into a ball in the Bold (0.81, owner) | The ball is the round ends' part: the Regular's ball (neck, top, side and the handles between) scaled by the ball law (`bold.BALL`, 1 + 0.40 f: 1.40 at the Bold, as a c f r 2 3 5 6 9 take it; the Light keeps the engine's tail, which passes) about its centre, centred where the engine put it; the tail between the straight edge and the ball solved again by `round_tail` on the master's own points. Then every part curvecheck reads meets at one curvature at each smooth node (`loops.even_nodes`: node handles along their lines, inside the triangle, no new fault) | j y jdotless eng f_j f_f_j (g.ss02 spliced from the master's j); g a.ss03 l.ss04 | `loops.tail_kind`, `master_ball`, `round_tail`, `even_nodes`; `bold.bold_font` | `curvecheck.py` on the Light and Bold UFOs (qa.py) |
| Lean along the axis (0.81, owner; check only) | No rule yet. `audit_lean.py --refs` measures each letter's top-half ink against its bottom half from 300 to 700 against Georgia Pro and Source Serif 4. A thick crossing diagonal keeping the Regular's lean (`bold.LEAN_KEEP_THICK`, None) fixed x's lean but bent its serif brackets between masters: place the serif from the kept edge first | x (worst: -0.123 at 700, refs -0.037 to -0.018), s z G S X e g w a c | `bold.slant_lines` | `audit_lean.py --refs` |
| 9 and 6, the long stroke's quarter (0.81, owner) | The 9's lowest point (and the tail's inside) left until the quarter from the right extreme down is 0.90 as wide as tall; the ball left until it stands on the bowl's left extreme; the extreme's downward handle until the edge leans 23.5 degrees; one curvature at each node. The 6 is the 9 turned half round | 9 6 (their superiors, inferiors, ∂) | `clean.nine_six` | `audit_lean.py`, curvecheck on the figure |
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
| A letter in a ring (0.81, axis round 3) | A glyph whose ring is ©'s point for point takes ©'s ring in each master; the letter inside keeps the Regular's offset from the counter's centre and is scaled about its centre until its white to the counter is the Regular's times the counter's change | ® | `bold_font` (after the curves on their chord) | `audit_axis.py`, `audit_rays.py` |
| A cut end towards the Bold (0.81, axis round 3) | Towards the Bold a stroke's straight cut end (under 30, between two corners) grows along itself by the tip's law where the place reads thinner than the Regular; no other node moves | ſp ſt ƭ ™ | `white.keep_taper(cuts=True)`, `_taper_places(cut_only)` | `audit_axis.py` |
| An open round letter's two terminals (0.82, owner round 8) | The top and bottom terminals end on one vertical, at the references' median reach of the rightmost terminal over the round letter's width (C 0.891 of O, c 0.882 of o); each terminal moves level and its half of the letter is stretched to meet it (extremes keep their share of the run, handles theirs of their curve). In the masters the two share one x knot; `c_terminals` holds them on one line | C c (Ç ç ... Ꞓ ꞓ Ȼ ȼ ¢ ₡ follow; © ₵ Ɔ ɔ are own drawings) | `joins.terminal_line`, `move_terminal`; `bold.c_terminals` | `build/owner8/ends.py` (top - bottom within 2 at every 50 units) |
| Ends of a crossing (0.82, owner round 8) | Towards the Bold the four ends of x and X grow alike: the letter turns about its crossing, both strokes the same way, the openings and the mean growth staying the engine's. X: every arm the Regular's lean turned by one solved angle, placed through its crossing corners (`arm_turn`). x: after the engine, top arms +s and bottom arms -s whole, edges back to the engine's thickness, corners where the lines meet (`cross_shear`) | x X (ẋ ẍ Ẋ Ẍ) | `bold.cross_ends`, `cross_shear`, `slant_lines(arm_turn)` | `build/owner8/ends.py` (spread within 5 from 400 to 700) |
| A Z's bar ends (0.82, owner round 8) | In each master the bars' free ends (top-left beak, bottom-right beak) move out level until the four ends grow alike about their centre; the diagonal, its outer corners and the width stay the engine's | z Z z.ss06 (ź ż ž ... Ƶ ƶ follow) | `bold.bar_ends` | `build/owner8/ends.py` (spread within 8 at 700) |
| An open round letter's ends (0.82, owner round 8, item 13) | In each master, on each side the top and bottom ends (balance.py's bands, the top and bottom 40%) keep the Regular's difference, each moving half the gap; a band's nodes within 0.3 of its width from an end move with that end whole (a barb, a ball, a bowl's outer stroke keep their shape), those between by their share of the run, handles with their node, the spine between the bands stays. Composites take the letter's new advance; the small 3s take the 3's moves | S s 3 (accented S s, ³ ₃ and the fractions follow; $ § are own drawings and were not changed) | `bold.round_ends`, `band_ends`, `ROUND_ENDS` | `build/owner8/ends.py` (four ends about their centre within 6 at 300 and 700) |
| g's loop, link turn and ear in the masters (0.82, owner round 8, item 14) | After the engine the loop (its counter and the outline under the counter's top) moves level so its centre keeps the Regular's offset from the bowl's (+15.5), the link between by its share of the run, the notch where the turn meets the loop at the Regular's depth from the turn; the ear's ball moves level until the ear reaches past the bowl by the Regular's reach times the ball law (1 + 0.40 f), the neck taking up the change. Composites take the new advance and keep their mark over the moved ink | g (ĝ ğ ġ ģ ǧ ǵ ḡ ǥ follow; g.ss02 untouched) | `bold.g_loop_place`, `g_ear`, `g_centres`, `G_LOOPED` | `build/owner8/item14/gmeasure.py`; `curvecheck.py` on the masters |
| A sign built from strokes (0.82, owner round 8) | Centrelines and stroke weights; every edge a line half the stroke from its centreline, every corner where two edge lines meet (an inner outline a true inset, an inner point sharp), ends cut square or upright as the sign's kind says, nothing a union of overlapping bars. Vertices: a flat 0.42 of the stroke across the bisector (✓), an upright flat 0.79 of the stroke at the point of < (the references' median: Georgia Pro 0.92, Serrif 0.78, Source Serif 4 0.81, Literata 0.72, Merriweather 0.76), mitred points (⌃, the frames). Stroke weights: the minus's (52), the check 1.25 of it, the radical's thick 1.44 of it, fixed at every weight. In each master the same construction with every stroke times 1 + 0.37 ft, carried onto the Regular's points corner by corner; the erase key's cross is shortened only where its white would fall under the white law's least | ⌫ ⌦ ✓ √ < > ≤ ≥ × ⇧ ⇪ ◊ ⌃ | `signs.py` (`erase`, `check`, `radical`, `chevron`, `chevron_bar`, `times`, `frame`, `caret`); `charset.put_built`; `bold.construction_signs` | `build/owner8/signs/measure.py` (every straight stroke across itself at 300, 400, 550, 700: within 1 of the law) |
| The summation and the increment (0.82, owner round 8) | Capitals, not plain signs: in the masters they take the letters' laws (`bold.HINTS`), ∑'s bars E's arms' (1.33, read as straight) and its diagonals Z's and A's; ∑'s point a capital vertex, a flat 0.42 of the master's capital stem (36, Bold 62, Light 25); ∆'s inner edges parallel to its outer at A's weights (thin 49, thick 86, base 44) | ∑ ∆ | `charset.sum_vertex`, `maths` (increment); `bold.HINTS`, `bold_font` | `build/owner8/signs/measure.py` |
| The ampersand (0.82, owner round 8) | One stroke and an arm. The stroke (tail, diagonal, loop up its left side, over the top, down its right side, the spine across the diagonal, the lower bowl, into the diagonal) has two edges, each one chain of curves (lines on the diagonal); the outline is where the ribbon crosses itself and where the arm leaves the diagonal, every corner found, not placed. Weights from the master's own letters: diagonal and loop's left side v's thick, bowl's left o's side, loop's top and the spine o's hairline, loop's right half way, bowl's bottom and tail a's lower stroke, the arm v's thin with v's serif point for point; the tail's drawn cut. Skeleton `amp.REG` (loop's counter +21 over the lower's, references' median +12; spine 28 degrees below level). Handles solved for one curvature across every smooth node, a curve leaving a straight under 0.30 of its mean, no flat place or inflection; an extreme's handles stay on its axis. In a master: stretched level as o's counter changes, then the bowl, tail and arm spread until the ink widens as n's advance does (towards the Bold only); the mid master at the readings half way | & | `amp.py` (`regular` in normalize, `master` in `bold.bold_font`, `widen`, `spread`) | curvecheck on the whole glyph (`build/owner8/amp/ovm.py`), `audit_rays.py ampersand`, `audit_axis.py` turns |
| A sign's dots (0.82, owner round 8) | Towards the Bold the division sign's dots take the sign law (1 + 0.37 ft) about their centres and stand at least the bar's thickness off it (references: gap 0.45 to 1.11 of the bar at 700, median 0.99) | ÷ | `bold.bold_font` (after the signs) | `build/owner8/amp/divide.py` |
| A symbol's stroke read the wrong way (0.82, owner round 8) | In each master, after the engine, one stroke's thickness from a law read on the master's own letters, the stroke's two edges found by what they are (level lines, a level node): Ə's bar the Regular's times E's middle-arm law about the bar's middle; ɂ's lower hook stroke the Regular's times ?'s same stroke (its counter's floor moves, handles with their node); œ towards the Light o and e joined as the Regular joins them (`charset.diphthongs`), only where the union keeps the structure; ɽ towards the Bold every node at one curvature (`loops.even_nodes`, handle lengths only) | Ə ɂ œ ɽ | `symbols.py`; `bold.bold_font` (after the ampersand) | `audit_rays.py`, curvecheck on the masters |
| A master under the Light (0.82, owner round 8, axis B; gated, no such master is built) | Below stem 55 a letter's thin stroke (hairlines, curved thins, bars and arms, e's bar, upright and slanted thins, the floors that read the hairline) is the Light's value times (stem / 55) ** 0.95, continuous with the Light and monotone (stem / hairline 1.46 at 32); ends keep the present law (tip, neck, dot, period, sign strokes: on the references' own exponent below 300); a slanted stroke's end keeps its share of the stroke across; sides the Light's change plus the references' 300-to-lightest (`thin_bearings.json`) | every glyph, in a master under 55 | `bold.thin_law`, `K_THIN`, `bearing_change`, "slanted end"; `weightaxis.THIN` | trials at 32 and 42 failed (`axis-0.81.md`, Owner round 8, axis, stage B: the list of what blocks) |
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
