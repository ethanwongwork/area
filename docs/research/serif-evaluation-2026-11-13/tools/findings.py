"""The evaluation's findings: each one was measured by a test here and then looked at on a node plate (look.py).
Numbers are units of 1000 per em. `status` says where a finding stands on the current build:
  fixed      a rule in the build now holds the part (`build` says since when); views draw before over after
  part       partly fixed; the rest is listed
  open       still as found
  decided    an earlier, recorded decision of the owner or of a documented rule: not a defect
  withdrawn  my measurement was wrong or measured the wrong thing; said plainly
`views` tell the page what to draw: a glyph, an optional zoom box (x0, y0, x1, y1), marks at coordinates, `bars` =
level strokes to label with their measured thickness, `ba` = draw build 0.66's outline over the current one."""

FINDINGS = [
    {
        "id": "cap-hairlines", "sev": "high", "cls": "Thicks and thins", "status": "fixed", "build": "0.67",
        "title": "Capital thin strokes came in six weights, from 40 to 55",
        "body": "The thin level strokes of the capitals should read as one weight. They measured 40 (L arm), 43 (E and F "
                "middle arms), 45 to 46 (E, F, T, Z arms), 47 (B middle, the tops of B D P R, the O), 52 (A and H bars) and "
                "53 to 55 (where the bowls of P and R close): a 15-unit range where Georgia Pro holds 4.5 and Serrif 4.4.",
        "after": "One rule now sets them from the references' own ratios to their O hairline: arms 46, closing strokes "
                 "47, crossbars 49. The range is 4.0 (45 to 49). L's arm is built as E's bottom arm. Z's arms stay at 45.",
        "evidence": [["L arm", "40.1 → 46.1"], ["E, F middle arm", "43.2 → 46.2"], ["H, A bar", "52.0 → 49.0"],
                     ["P closing stroke", "53.4 → 47.5"], ["R closing stroke", "54.7 → 48.5"],
                     ["Range, Area Serif", "14.6 → 4.0"], ["Range, Georgia Pro / Serrif", "4.5 / 4.4"]],
        "fix": "balance.cap_thins. The parts audit has a new row, cap thins, which fails on build 0.66 (five outliers).",
        "views": [{"g": "H", "bars": [[300, 420]], "ba": True}, {"g": "E", "bars": [[-5, 5], [300, 420], [640, 712]], "ba": True},
                  {"g": "L", "bars": [[-5, 5]], "ba": True}, {"g": "P", "bars": [[280, 400], [640, 712]], "ba": True},
                  {"g": "R", "bars": [[280, 400], [640, 712]], "ba": True}, {"g": "A", "bars": [[200, 300]], "ba": True}],
        "chart": "caphair",
    },
    {
        "id": "b-bowl", "sev": "high", "cls": "Thicks and thins", "status": "fixed", "build": "0.67",
        "title": "The lower bowl of B was heavier than every other capital round",
        "body": "Across the stroke, O is 92 at its thickest and D 95; the lower bowl of B was 98. Its counter's extreme sat "
                "6 units too far in. A correction to my first report: I gave 105 and 14%, which was a level scanline "
                "through a short, tightly curved bowl and overstates it. Measured across the stroke the excess was 7%.",
        "after": "The counter's extreme moved out 6 units, so the stroke is the O's 92 at the extreme and 95 at most, the "
                 "same as D. The rule would also raise the counter's tension if either quarter were still heavy; it is not.",
        "evidence": [["B lower bowl at the extreme", "98 → 92"], ["Thickest, across the stroke", "98.3 → 95.3"],
                     ["D, thickest", "94.7"], ["O, thickest", "92.0"], ["References: B to O", "0.98 to 1.05"]],
        "fix": "balance.B_lower. New audit row, cap rounds, gated at 5% (the references' range); 0.66 fails it.",
        "views": [{"g": "B", "ba": True, "comb": False}, {"g": "B", "box": [380, -20, 700, 400], "ba": True},
                  {"g": "D", "thick": True, "comb": False}, {"g": "B", "thick": True, "comb": False}],
    },
    {
        "id": "u-heads", "sev": "high", "cls": "Serifs", "status": "fixed", "build": "0.67",
        "title": "u had different head serifs from i, n, m, r, p and j",
        "body": "Every x-height stem starts with the same flag: 70 units long, top edge rising 8 degrees to a corner 10 over "
                "the x-height. u is n turned half round, so its two heads were n's feet: level slabs that stopped on the "
                "x-height. This was noted in 0.65 and left for you; both references give u the flag of n and i.",
        "after": "Both of u's stems now carry i's flag point for point (i is the control: a stem and a flag, nothing "
                 "else). u's top went from 520 flat to 510 rising to 530, as on i n m r p.",
        "evidence": [["u head: slope", "0.0 → 8.0 deg"], ["u top", "520 → 530"], ["Tip thickness", "30 → 30"],
                     ["Head rise, i n m p r u (stems)", "all 1.24"]],
        "fix": "joins.u_flags. New audit row, head rise, which fails on 0.66 (u 1.00 against 1.24).",
        "views": [{"g": "u", "box": [0, 360, 330, 570], "ba": True}, {"g": "u", "box": [350, 360, 680, 570], "ba": True},
                  {"g": "u", "ba": True, "comb": False}, {"g": "i", "box": [0, 360, 330, 570]}],
    },
    {
        "id": "cgs-tops", "sev": "medium", "cls": "Curves", "status": "fixed", "build": "0.68",
        "title": "C, G, S and s flattened before their spurs",
        "body": "At the top of C the arc arrived with a radius of 369 units and left toward the spur's notch with 1229, "
                "its handle 1.31 times past the point where the two handles' lines meet: a flat, then a late turn. G was "
                "the same at the top and the bottom; in S and s the handle ran 1.7 to 3.4 times past the meeting point, "
                "so one curve bent both ways.",
        "after": "The short curve from each extreme to its notch is rebuilt at the face's outside tension (0.57) with the "
                 "handle solved so the curvature at the extreme equals the long arc's. The extremes, the notches and the "
                 "long arcs did not move; the outline reaches the notch a little steeper (C 20 to 26 degrees). The comb "
                 "now runs through each extreme without a step.",
        "evidence": [["C top, radius either side", "369 / 1229 → 369 / 376"], ["G top", "384 / 973 → 384 / 387"],
                     ["G bottom", "385 / 1834 → 385 / 389"], ["S top, S bottom", "278 / 540, 339 / 729 → 284, 344"],
                     ["s top, s bottom", "213 / 352, 268 / 380 → 217, 271"],
                     ["Flagged places on C G S s", "24 → 9"]],
        "fix": "joins.even_extremes, gated to arcs that are over 1.5 times off or have a handle past its meeting point.",
        "views": [{"g": "C", "box": [230, 540, 700, 760], "ba": True}, {"g": "G", "box": [230, 540, 700, 760], "ba": True},
                  {"g": "G", "box": [200, -50, 720, 180], "ba": True}, {"g": "S", "box": [150, 560, 560, 760], "ba": True},
                  {"g": "s", "box": [120, 380, 460, 560], "ba": True}, {"g": "s", "box": [30, -40, 370, 150], "ba": True}],
    },
    {
        "id": "fig-flats", "sev": "medium", "cls": "Thicks and thins", "status": "fixed", "build": "0.68",
        "title": "The flat strokes of 2, 5 and 7 were three different weights",
        "body": "The base of 2 was 80 units thick, the flag of 5 was 77 and the top of 7 was 72. Serrif and Source Serif 4 "
                "draw all three at 0.86 of their capital stem and Georgia Pro at 0.82. A correction: I also called the "
                "bar of 4 light. At 0.66 of the stem it is inside the references' 0.62 to 0.80, so it stays.",
        "after": "All three are 73, the references' mean share (0.85) of Area's 86 stem. Each changed from its inside "
                 "edge, so the baseline and figure height hold; ends on a diagonal or upright slid along that stroke's edge.",
        "evidence": [["2 base", "80 → 73"], ["5 flag", "77 → 73"], ["7 top", "72 → 73"],
                     ["Serrif 2 / 5 / 7", "82 / 82 / 82 (stem 95)"], ["Georgia Pro 2 / 5 / 7", "86 / 87 / 82 (stem 104)"]],
        "fix": "balance.fig_flats.",
        "views": [{"g": "two", "bars": [[-5, 5]], "ba": True, "comb": False}, {"g": "five", "bars": [[600, 712]], "ba": True, "comb": False},
                  {"g": "seven", "bars": [[600, 712]], "ba": True, "comb": False}],
    },
    {
        "id": "diagonal-joins", "sev": "medium", "cls": "Curves", "status": "fixed", "build": "0.69",
        "title": "Diagonals met their serif brackets with a small bend, and the brackets had no node at their extreme",
        "body": "Where a bracket ran into a diagonal the two were up to 3.3 degrees apart (V, W, v, and 17 smaller ones "
                "in A X Y w x y q), the outline 1.2 to 1.7 units off the straight's own line.",
        "after": "0.68: each bracket's handle lies on the diagonal's line, its length kept (20 joins, none over 1 "
                 "degree). 0.69: every curve that passed a leftmost, rightmost, highest or lowest point without a node "
                 "is cut in two there. The cut is exact, so the outline stays where it was to within the half unit of "
                 "rounding; the old nodes keep their directions. 23 nodes on the brackets of A K V W X Y k v w x y, "
                 "plus g's ear and y's tail. u's tail keeps a 2-degree bend between two curves, which whole units "
                 "cannot remove.",
        "evidence": [["V at (201, 553)", "2.3 → 0.1 deg"], ["v at (151, 428)", "3.3 → 0.0 deg"],
                     ["Curves passing an extreme without a node, core 62", "26 → 0"], ["Same, all 1,001 glyphs", "425 → 209"],
                     ["Farthest any outline moved", "1.5 units"]],
        "fix": "clean.true_joins, clean.add_nodes.",
        "views": [{"g": "V", "box": [90, 480, 330, 730], "ba": True}, {"g": "v", "box": [60, 340, 280, 540], "ba": True},
                  {"g": "X", "box": [480, 560, 720, 730], "ba": True}, {"g": "y", "box": [10, -235, 300, -50], "ba": True}],
    },
    {
        "id": "r-width", "sev": "medium", "cls": "Spacing", "status": "fixed", "build": "0.68",
        "title": "r read narrow because of the white after it, not its shape",
        "body": "You prefer a wider r, and the long right foot is yours. Measured against the eight other faces, r's ink "
                "was already the widest (4.81 stems; 3.72 to 4.69 elsewhere), with the longest arm (2.91; 2.01 to 2.72) "
                "and the longest foot (1.67; 0.68 to 1.21). Its ink also sits over its foot better than any face but "
                "one (0.09 stems off centre; the others 0.07 to 0.45). What was narrow was its advance: 0.659 of n, the "
                "smallest of the nine (0.671 to 0.715). So the letter was wide and its space was tight: rr, rn and ri "
                "closed up.",
        "after": "r now has 15 more units of white on its right, which puts its advance at 0.682 of n, the mean of "
                 "Georgia Pro and Serrif. No point of the letter moved. Pairs that were kerned (r before a round letter) "
                 "keep their distance. The cost, stated plainly: the white after r is now 2.1 standard deviations over "
                 "the face's mean gap where it was 1.5 (Georgia Pro 1.5, Serrif 2.5), so the overall evenness figure "
                 "goes from 9.4% to 9.8%. Ways I measured and did not take: a longer arm (already the longest of the "
                 "nine), a larger ball (it is a shared part, 1.28 stems already), a longer flag or left foot (shared "
                 "parts; one value on every stem).",
        "evidence": [["r advance / n advance", "0.659 → 0.682"], ["Right side bearing", "15 → 30"],
                     ["Ink width, stems (others)", "4.81 (3.72 to 4.69)"], ["Ink centre off foot centre", "0.09 stems"],
                     ["r + stem gap, sd over mean", "1.5 → 2.1"], ["Georgia Pro / Serrif", "1.5 / 2.5"]],
        "fix": "spacing.R_AIR = 15 (AREA_R_AIR builds other amounts; 0 is build 0.66's spacing).",
        "views": [{"g": "r", "comb": False}],
        "words": "arrive form worry error narrower corner carry",
    },
    {
        "id": "five", "sev": "medium", "cls": "Curves", "status": "part", "build": "0.69",
        "title": "Figure 5 has a notch where the upright meets the bowl; 3 and 2 have uneven terminals",
        "body": "At the heel of 5 the outline turns from a radius of 23 into the opposite bend (radius 61) and back within "
                "45 units, leaving a small pocket in the left edge. The top hook of 3 has two curvature peaks inside one "
                "curve, and the ball of 2 joins its stroke with a curve that bends both ways. Your own notes on these "
                "three (2: top curve not smooth; 3: abrupt on the left; 5: top should come out to the left) point at "
                "the same places, so these want a redraw by rule rather than a touch-up.",
        "after": "The heel of 5 no longer dips: the short curve from its lowest point now bends one way and the "
                 "turn into the bowl happens at the node. The ball of 2 has a node where its curve changes direction. "
                 "Open: the hook of 3 (two curvature peaks in one curve) and the flag of 5, whose handle runs 1.16 times "
                 "past its meeting point. Your earlier notes on 2, 3 and 5 point at these hooks, so they want one "
                 "construction measured on both references, not a touch-up.",
        "evidence": [["5 heel: bends within 45 units", "3 → 1"], ["Flagged places on 5", "5 → 3"], ["Flagged places on 2", "1 → 0"],
                     ["3 hook", "2 turns in one curve, open"], ["5 flag handle past meeting point", "1.16, open"]],
        "fix": "clean.five_heel, clean.add_nodes. Next: one construction for the figures' hooks (joins.figure_ends).",
        "views": [{"g": "five", "box": [20, 220, 330, 470], "ba": True},
                  {"g": "three", "box": [40, 480, 300, 700], "marks": [[163, 573]]},
                  {"g": "two", "box": [20, 480, 300, 700], "marks": [[142, 549]]}],
    },
    {
        "id": "extended", "sev": "medium", "cls": "Curves", "status": "part", "build": "0.69",
        "title": "Outside the core 62: ligatures and a few composed letters have visible kinks",
        "body": "The same node tests on all 1,001 glyphs find 26 joins that bend 5 degrees or more over a long run. All are "
                "in glyphs assembled from parts: the f ligatures (fl, f_b, f_h, f_k and the ff forms: 5.8 and 7.1 degrees "
                "where the hood meets the ascender), OE (13.5 degrees, 7 units off line, top and bottom), c_t and s_t, "
                "the caron of d, l, t and L, cent and w with hook. These are seams left where two outlines were merged.",
        "after": "After the merges, every curve that runs into a straight outside the core set now leaves on the "
                 "straight's line: 43 joins in the f ligatures, Œ (I checked the references: five of six join the round "
                 "to the E without a bend), the caron of d l t L, w with hook, yen and the accents. Open: the two "
                 "discretionary ligatures ct and st, whose swash joins two curves at 8 degrees, and the cent sign.",
        "evidence": [["OE at (462, 712) and (464, 0)", "13.5 → 0.0 deg"], ["fl, f_b, f_h, f_k, ff forms", "5.8 and 7.1 → 0.0 deg"],
                     ["Joins over 5 deg, all glyphs", "26 → 2"], ["Remaining", "c_t 8.2, cent 7.5"]],
        "fix": "clean.true_joins on every glyph outside the core, last in the build. Next: ct, st, cent.",
        "views": [{"g": "OE", "box": [330, 560, 600, 760], "ba": True},
                  {"g": "fl", "box": [180, 640, 400, 800], "ba": True},
                  {"g": "c_t", "box": [360, 380, 600, 580], "marks": [[470, 484]]}],
    },
    {
        "id": "ball-joins", "sev": "low", "cls": "Curves", "status": "part", "build": "0.69",
        "title": "Ball terminals join their strokes abruptly in y, j, J and a few figures",
        "body": "A ball has to turn from a tight outward curve into the stroke's inward curve. In y the turn is a pocket "
                "with a 15-unit radius next to a 712-unit radius, and the lowest point of the tail has no node. j, J, 3, "
                "5, 6 and 9 flip the same way with radii of 19 to 95. The balls of a, c, f and r make the same turn with "
                "radii that are closer together (43 against 65 to 126), which is the usual drawing.",
        "evidence": [["y at (120, -147)", "radius -15 to 712"], ["j at (-67, -145)", "-41 to 543"],
                     ["J at (109, 154)", "-196 to 69"], ["6, 9", "-19 to 61"], ["a, c, f", "43 to -65 ... -126"]],
        "after": "Looking closer, two different things were in this finding. y's tail dipped 9 units under the join "
                 "with no node at its lowest point; it has one now, as j does. The turn from the ball into the stroke "
                 "in j, J, 6 and 9 is the same drawing as in a, c, f and r: the curve changes direction at a node, "
                 "which is where it should. Those are not defects. What stays open is only that their radii either "
                 "side are further apart (19 to 95) than in a and c (43 to 126).",
        "fix": "clean.add_nodes (y). Optional: tie each neck's radius to its ball's, as in a and c.",
        "views": [{"g": "y", "box": [10, -235, 300, -50], "ba": True},
                  {"g": "j", "box": [-170, -240, 120, -60], "marks": [[-67, -145]]},
                  {"g": "a", "box": [30, 330, 260, 540], "marks": [[149, 405]]}],
    },
    {
        "id": "single-curves", "sev": "low", "cls": "Curves", "status": "part", "build": "0.69",
        "title": "Curves that bent both ways without a node: Q tail, R leg, k arm, g link",
        "body": "A single curve should bend one way. The tail of Q has four that bend both ways, the leg of R one, the arm "
                "serif of k one (handle 1.7 times past the meeting point) and the link of g one (1.53 times). The inside "
                "of t's hook has a slight bump. The shapes read correctly; the outlines are fragile to edit and would "
                "interpolate badly if a bold master is added.",
        "after": "0.68's spur rule removed five; 0.69 cuts each remaining one at the point where it changes "
                 "direction (Q's tail three times, R's leg, k's arm, g's link, the ball of 2), keeping both handles on "
                 "one line through the new node. Left: one in Q's tail and one in r's arm, where the cut would leave "
                 "handles that whole units bend by over a degree, and the bump inside t's hook.",
        "evidence": [["Curves that bend both ways, core 62", "17 → 3"], ["Handles past the meeting point, core 62", "10 → 1"],
                     ["pathlint warnings, whole font", "226 → 168"]],
        "fix": "joins.even_extremes, clean.add_nodes.",
        "views": [{"g": "Q", "box": [150, -200, 650, 60]}, {"g": "k", "box": [300, 330, 600, 560]},
                  {"g": "t", "box": [180, -30, 400, 200]}, {"g": "g", "box": [20, 100, 330, 260]}],
    },
    {
        "id": "one-unit", "sev": "low", "cls": "Consistency", "status": "part", "build": "0.68",
        "title": "One-unit differences between parts that should be identical",
        "body": "Places where a rule was applied twice with different rounding. The two thin uprights of N were 48 and 49. "
                "The right edge of figure 1's stem leaned 1 unit over 633. Capital head serifs project 74 where the feet "
                "project 75.",
        "after": "N's uprights are both 48 and the stem of 1 is upright (86.0 top to bottom). The 74 / 75 serifs are "
                 "open. Two I listed were recorded decisions, not rounding: t's stem is 79 on purpose (both references "
                 "draw t 1 to 2% heavier) and r's top is 528 because its smaller ball overshoots less.",
        "evidence": [["N thin uprights", "48 / 49 → 48 / 48"], ["1 stem, bottom to top", "86.0 to 88.8 → 86.0"],
                     ["Cap head / foot serif", "74 / 75, open"], ["t stem 79, r top 528", "by rule"]],
        "fix": "balance.fig_flats (N, 1). Open: round capital serif projections once, at the end.",
        "views": [{"g": "one", "ba": True, "comb": False}, {"g": "N", "ba": True, "comb": False}],
    },
    {
        "id": "zero", "sev": "low", "cls": "Optical", "status": "open",
        "title": "The zero carries the full weight of the capital O in a narrower shape",
        "body": "0 and O have the same thick (92) and thin (47) strokes, but the zero is 145 units narrower, so its counter "
                "is darker. Georgia Pro, Serrif and Source Serif 4 lighten the zero's sides by 4 to 16% and its thins by up "
                "to 23%. In a row of figures the zero is the darkest. This is a choice about how the figures should "
                "weigh against capitals, so it is yours.",
        "evidence": [["0 thick / thin", "92 / 47"], ["O thick / thin", "92 / 47"], ["Georgia Pro 0 / O thick", "108 / 118"],
                     ["Source Serif 4 0 / O thick", "92 / 109"]],
        "fix": "If you want it: a figure weight in balance.py, zero's sides at about 88 and thins at 44.",
        "views": [{"g": "zero", "thick": True, "comb": False}, {"g": "O", "thick": True, "comb": False}],
    },
    {
        "id": "corner-fillets", "sev": "low", "cls": "Curves", "status": "decided",
        "title": "Rounded corners on a sloped edge sit about 10 degrees off it",
        "body": "Where a softened corner meets a sloped edge (the 8-degree flags, the leaning arm ends of E F L T Z) its "
                "handle is 0.8 to 1.0 unit off the edge's direction. I first reported this as a rule to fix. It is a limit "
                "of the grid: the fillet is 7 units and its handle 3, and in whole units a 3-unit handle cannot lie on an "
                "8-degree line (it would need to be 7 units long). On level and upright edges the fillets are exact. "
                "Nothing to change unless the fillets grow, which would soften every serif tip.",
        "evidence": [["Typical", "9.8 to 10.5 deg over 3 units"], ["Offset", "0.8 to 1.0 unit"],
                     ["On level and upright edges", "0"]],
        "fix": "None. Left as is.",
        "views": [{"g": "n", "box": [20, 470, 130, 540], "marks": [[47, 509]]},
                  {"g": "E", "box": [570, 640, 680, 720], "marks": [[610, 705]]}],
    },
    {
        "id": "necks", "sev": "low", "cls": "Thicks and thins", "status": "withdrawn",
        "title": "Withdrawn: arches and bowls thinner than the hairline where they leave the stem",
        "body": "I reported the arches of n h m (38), the base of u (38) and the bowls of b d p q (39 to 40) as thinner "
                "than the 43 hairline. That compared two different parts. Where a stroke leaves a stem it is a branch "
                "neck, a step of its own on the face's thick-to-thin ladder: 32 units, 0.74 of the hairline, set from "
                "Georgia Pro (0.73) and Serrif (0.68) in build 0.65 and checked by parts.py on every join. My scanline "
                "read the stroke part-way between the neck and the arch. The arch at its top is 50 and the hairline is "
                "43, as designed.",
        "evidence": [["Branch neck, by rule", "32 (0.74 hairlines)"], ["Georgia Pro / Serrif", "0.73 / 0.68"],
                     ["Arch at its top", "50"], ["parts.py join table", "0 errors"]],
        "fix": "None.",
        "views": [{"g": "n", "thick": True, "comb": False}, {"g": "b", "thick": True, "comb": False}],
    },
    {
        "id": "c-e", "sev": "low", "cls": "Thicks and thins", "status": "withdrawn",
        "title": "Withdrawn: c and e differ in their lower curve",
        "body": "I reported 54.7 against 51.8. Those were vertical thicknesses at each letter's lowest point, where the "
                "stroke runs at a slant, so the reading depends on the slant. Measured across the stroke, which is how "
                "the build's own rule sets them, c is 51.2 and e is 50.1: one value.",
        "evidence": [["c lower arc, across the stroke", "51.2"], ["e lower arc, across the stroke", "50.1"]],
        "fix": "None.",
        "views": [{"g": "c", "thick": True, "comb": False}, {"g": "e", "thick": True, "comb": False}],
    },
    {
        "id": "balls-size", "sev": "low", "cls": "Serifs", "status": "decided",
        "title": "Ball terminals range from 1.06 to 1.28 stems",
        "body": "a, c, y and the ear of g are 1.16 to 1.18 stems across; f (1.09) and j (1.06) are smaller, r and J (1.28) "
                "larger. Checking the records: r's, y's and the g ear's sizes come from your own point edits of "
                "11 November, r's ball is set by rule since 0.62, and both references draw J's about 20% larger. That "
                "leaves f and j, 8 to 10% under, which both references also draw smaller (Georgia Pro 1.06 and 1.09, "
                "Serrif 0.99 and 0.62).",
        "evidence": [["a, c, g ear", "1.18"], ["y", "1.16"], ["f, j", "1.09, 1.06"], ["r, J", "1.28"]],
        "fix": "None.",
        "views": [{"g": "r", "box": [280, 380, 460, 540]}, {"g": "f", "box": [230, 620, 400, 790]},
                  {"g": "c", "box": [360, 330, 510, 540]}],
    },
    {
        "id": "k-foot", "sev": "low", "cls": "Serifs", "status": "decided",
        "title": "The right feet of r and k are longer than the standard 68",
        "body": "r's right foot is 130, 1.9 times its left: yours, lengthened on purpose in 0.43 for a wider r. k's is 96 "
                "because it runs into the foot of its leg and is left as drawn (normalize.py). f (85), p (84) and q (86) "
                "are lengthened on the open side by the same share as the references.",
        "evidence": [["Standard foot", "68"], ["r right", "130, owner"], ["k right", "96, runs into the leg"],
                     ["f, p, q open side", "85, 84, 86"]],
        "fix": "None.",
        "views": [{"g": "r", "comb": False}, {"g": "k", "comb": False}],
    },
]

SOLID = [
    ["Stems", "78 units on every lowercase stem and 86 on every capital stem, to within 0.1 of a unit across 31 letters. "
              "The references vary by 1 to 3."],
    ["Feet and head serifs on upright stems", "Lowercase feet project 68 either side with a 30-unit tip and an 80-unit bracket "
                                             "on every letter; capitals 75 / 30 / 74. The bracket's curve is the same to 0.2 of a unit "
                                             "everywhere. Georgia Pro's left and right feet differ by 3 to 4."],
    ["Flags", "70 units long, 30 thick at the tip, top edge at 8 degrees, on b d h k l i j m n p r and, since 0.67, u."],
    ["Lowercase rounds", "o, b, d, p and q are all 82 at their thickest and 43 at their thinnest. Joins to stems hold a "
                         "32-unit neck on every letter (parts.py)."],
    ["Capital thins and rounds", "Since 0.67: level thin strokes 45 to 49, round strokes 92 to 95 on O D P R and both "
                                 "bowls of B."],
    ["Alignment", "Every flat edge sits exactly on its line (0, 520, 712, 780, -224). Round letters overshoot by 10 at the "
                  "x-height and 9 at the cap height, every one the same."],
    ["Smoothness overall", "408 curvature turning points across the 62 core characters (419 on 0.66), against 397 for "
                           "Serrif, 454 for Libre Baskerville and 457 for Georgia Pro. Soft kinks over 2 degrees in the "
                           "built font: 8 (11 on 0.66), against 6, 14 and 7. In the drawn source there are two, both under "
                           "2.1 degrees; the others come from converting short curves to TrueType's quadratics."],
    ["Spacing", "No two core characters come closer than 10 units with kerning applied, and none collide. The optical gap "
                "between lowercase letters varies by 9.8% of its mean (Georgia Pro 9.2%, Serrif 10.5%)."],
    ["Font engineering", "fontbakery's universal profile: 85 pass, 0 fail. Targets, the parts audit (now with capital "
                         "thins, capital rounds and head rise) and the join table all pass."],
]

NOT_CHECKED = [
    "There is one master. Area Serif is a single Regular; no weight axis, bold or italic exists yet, so nothing about "
    "interpolation was tested.",
    "Rendering on Windows (the font is unhinted) and at sizes under 12 px on a 1x display.",
    "Accents, Vietnamese stacks and symbols were tested by the node tests only, not looked at one by one. Glyphs "
    "rebuilt from changed letters (Ł, Ħ, Æ, accented capitals and u) follow their base by rule and were not looked at.",
    "Kerning outside the 62 core characters (punctuation, quotes, accented pairs).",
    "Each added node moves its curve by up to half a unit of rounding; I measured the farthest any outline moved "
    "(1.5 units, with the join truing) and looked at every affected letter in text, not at every node.",
]

CHANGES = [
    ["0.67", "Capital thin strokes", "40 to 55", "45 to 49", "balance.cap_thins"],
    ["0.67", "B lower bowl, across the stroke", "98", "92 at the extreme, 95 at most", "balance.B_lower"],
    ["0.67", "u head serifs", "level slabs at 520", "i's flag, 510 to 530", "joins.u_flags"],
    ["0.68", "C G S s, arc into the spur", "radius 1.3 to 4.8 times apart", "within 1.03", "joins.even_extremes"],
    ["0.68", "2, 5, 7 flat strokes", "80, 77, 72", "73", "balance.fig_flats"],
    ["0.68", "Brackets into diagonals", "up to 3.3 deg off", "under 1 deg (20 joins)", "clean.true_joins"],
    ["0.68", "N thin uprights; stem of 1", "48 / 49; leans 1", "48 / 48; upright", "balance.fig_flats"],
    ["0.68", "r advance, as a share of n", "0.659", "0.682", "spacing.R_AIR"],
    ["0.69", "Curves passing an extreme without a node, core 62", "26", "0", "clean.add_nodes"],
    ["0.69", "Curves that bend both ways, core 62", "17", "3", "clean.add_nodes"],
    ["0.69", "Seams in ligatures, Œ, carons: joins over 5 deg", "26", "2", "clean.true_joins"],
    ["0.69", "Heel of 5", "dips, bends three ways", "one bend", "clean.five_heel"],
]


# ---- Build 0.70: the rest of the open items (owner, 2026-11-13: "finish the rest of the open items"). Each entry
# above keeps the text it had at 0.69; these lines carry it to 0.70.
def _set(fid, **kw):
    next(f for f in FINDINGS if f["id"] == fid).update(kw)


_set("five", status="fixed", build="0.70",
     title="Figure 5 had a notch at its heel; 3 and 2 had uneven hooks",
     after="0.69: the heel of 5 bends one way and the ball of 2 has a node where its curve changes direction. "
           "0.70: the hook of 3 stepped 6 units sideways with both handles half the run, so they met in the middle and "
           "the curve turned twice; each is now 0.40 of the run, as in 2's hook, and it is one clean S. The top of 5's "
           "bowl ran its handle 1.16 times past the meeting point on the way into the upright; it is rebuilt by the "
           "rule that fixed C G S. Nothing on 2, 3 or 5 is flagged now except the turn at each ball's node, which is "
           "the standard drawing.",
     evidence=[["Flagged places on 5", "5 → 2"], ["Flagged places on 3", "2 → 1"], ["Flagged places on 2", "1 → 0"],
               ["3 hook, curvature turns in one curve", "2 → 1"], ["5 bowl handle past meeting point", "1.16 → 0.57"]],
     fix="clean.five_heel, clean.even_s, joins.even_extremes (five), clean.add_nodes.",
     views=[{"g": "five", "box": [20, 220, 330, 470], "ba": True}, {"g": "five", "box": [100, 360, 520, 470], "ba": True},
            {"g": "three", "box": [40, 480, 300, 700], "ba": True}, {"g": "two", "box": [20, 480, 300, 700], "ba": True}])
_set("extended", status="fixed", build="0.70",
     title="Outside the core 62: ligatures and composed letters had visible kinks",
     after="0.69: every curve that runs into a straight outside the core set leaves on the straight's line (43 joins: "
           "the f ligatures, Œ, the carons, accents). 0.70: the same for a node between two curves, which covers the "
           "swash of the ct and st ligatures (8.2 degrees) and the cent sign (7.5), 63 joins in all. No join in the "
           "font bends 5 degrees or more over a long run now. Letters with a stroke or bar across them (Ⱥ Ɇ Ƀ ƀ ł and "
           "48 more) are merged in the source, after two of them broke when their base letter changed.",
     evidence=[["OE", "13.5 → 0.0 deg"], ["fl, f_b, f_h, f_k, ff forms", "5.8 and 7.1 → 0.0 deg"],
               ["c_t, cent", "8.2, 7.5 → 0.0 deg"], ["Joins over 5 deg, all glyphs", "26 → 0"]],
     fix="clean.true_joins and clean.true_curves on every glyph outside the core, last in the build.")
_set("ball-joins", status="fixed", build="0.69")
_set("single-curves", status="fixed", build="0.70",
     after="0.68's spur rule removed five; 0.69 and 0.70 cut each remaining one at the point where it changes direction "
           "(Q's tail four times, R's leg, k's arm, r's arm, g's link, the hooks of 1 and 2), choosing the whole-unit "
           "handles that bend least. In Q's tail and r's arm the turn sits within 3 units of the new node, not exactly "
           "on it, which is the limit of whole units. I had listed a bump inside t's hook from looking at its comb; "
           "no test flags it and the step is at a node, so I have withdrawn that part.",
     evidence=[["Curves that bend both ways, core 62", "17 → 2 places, each within 3 units of a node"],
               ["Handles past the meeting point, core 62", "10 → 0"], ["Double turns in one curve, core 62", "1 → 0"],
               ["pathlint warnings, whole font", "226 → 171"]],
     fix="joins.even_extremes, clean.add_nodes.")
_set("one-unit", status="fixed", build="0.70",
     after="0.68: N's uprights are both 48 and the stem of 1 is upright. 0.70: every serif on an upright capital stem "
           "projects 77 from the stem (they were 76 or 77, 25 and 26 of each: H's left stem had 77 and 76 at the foot "
           "and the reverse at the head). Two I listed were recorded decisions, not rounding: t's stem is 79 on purpose "
           "and r's top is 528 because its smaller ball overshoots less.",
     evidence=[["N thin uprights", "48 / 49 → 48 / 48"], ["1 stem, bottom to top", "86.0 to 88.8 → 86.0"],
               ["Capital serif projections", "76 or 77 → 77 (51 serifs)"], ["t stem 79, r top 528", "by rule"]],
     fix="balance.fig_flats (N, 1), balance.cap_serifs.",
     views=[{"g": "H", "box": [30, -20, 330, 120], "ba": True}, {"g": "one", "ba": True, "comb": False},
            {"g": "N", "ba": True, "comb": False}])
_set("zero", status="fixed", build="0.70",
     title="The zero carried the full weight of the capital O in a narrower shape",
     after="You asked for the open items to be finished, so this is my recommendation applied; it is one number "
           "(balance.ZERO_SIDE) if you want it back. The zero's sides are 87, 0.94 of the O's 92, the mean of what "
           "Georgia Pro (0.92) and Serrif (0.96) do. Only the counter moved, so the zero's width and spacing are "
           "unchanged. Its top and bottom stay at 47 with every other figure.",
     evidence=[["0 sides", "92 → 87"], ["0 top and bottom", "47 → 47"], ["O sides", "92"],
               ["Zero to O, Georgia Pro / Serrif", "0.92 / 0.96"], ["Zero to O, Area Serif", "1.00 → 0.95"]],
     fix="balance.zero_weight.",
     views=[{"g": "zero", "ba": True, "comb": False}, {"g": "zero", "thick": True, "comb": False},
            {"g": "O", "thick": True, "comb": False}])

SOLID[1] = ["Feet and head serifs on upright stems",
            "Lowercase feet project 68 either side with a 30-unit tip and an 80-unit bracket on every letter; capitals 77 "
            "on every upright stem since 0.70. The bracket's curve is the same to 0.2 of a unit everywhere. Georgia Pro's "
            "left and right feet differ by 3 to 4."]
SOLID[6] = ["Smoothness overall",
            "405 curvature turning points across the 62 core characters (419 on 0.66), against 397 for Serrif, 454 for "
            "Libre Baskerville and 457 for Georgia Pro. Soft kinks over 2 degrees in the built font: 7 (11 on 0.66), "
            "against 6, 14 and 7. Every curve passes its extremes at a node, and none has a handle past its meeting point."]
CHANGES += [
    ["0.70", "Capital serif projections on upright stems", "76 or 77", "77", "balance.cap_serifs"],
    ["0.70", "Zero's sides", "92 (the O's)", "87", "balance.zero_weight"],
    ["0.70", "Hook of 3; top of 5's bowl", "two turns; handle 1.16 past", "one S; 0.57", "clean.even_s, joins.even_extremes"],
    ["0.70", "ct, st, cent: joins over 5 deg", "2", "0", "clean.true_curves"],
    ["0.70", "Letters with a stroke or bar", "merged at export", "merged in the source (51)", "normalize"],
]


# ---- Build 0.71: the character set beyond a-z, A-Z and 0-9 (owner, 2026-11-13: "continue working, building more
# glyphs, refining"). Measured with test_extended.py on all nine faces and looked at glyph by glyph (sheets.py).
# These findings draw build 0.70 in red ("prev": "0.70").
BUILD, DATE = "0.71", "13 November 2026"
VERDICT = ("Build 0.71 takes the evaluation past the 62 core characters to all 1,001 glyphs. Eleven things held up and "
           "are fixed by rule, each with a check that fails on 0.70; the largest are an ampersand whose arm was a "
           "solid wedge and accents that sat up to 42 units off centre. Two of them (how far lowercase accents stand "
           "off their letter, the Vietnamese hook's weight) are my recommendation applied, one number each to change "
           "back. One of my own measurements was wrong and is withdrawn. Two things are left for you, with the options.")
QA = ["check.py: every measured target matches derive.py (pass).",
      "pathlint.py: 0 errors, 148 warnings, 31 notes (171 on 0.70, 226 on 0.66).",
      "audit_parts.py: 0 unexpected outliers. parts.py: 0 errors in the join and bowl table.",
      "audit_charset.py (new in 0.71): 0 errors. Run on build 0.70 the same audit fails with 53.",
      "fontbakery universal profile: 85 pass, 0 fail, 1 expected warning (contour count on inherited accents).",
      "No core letter or figure changed in 0.71: all 62 are point for point as in 0.70."]

P70 = {"cls": "Character set", "prev": "0.70", "build": "0.71", "status": "fixed"}
FINDINGS += [
    dict(P70, id="ampersand", sev="high",
         title="The ampersand's arm was a solid wedge",
         body="The white between the ampersand's arm and its tail was filled in: the arm was drawn as a block from its "
              "serif straight down to the tail. It has been so since the rule that shortens serif brackets was written. "
              "That rule saw the arm's serif, followed the curve under it to the long diagonal, took the whole "
              "underside of the arm for a bracket and shortened it. No test caught it because none looked past the "
              "core 62.",
         after="A bracket runs into its stroke; a curve that meets a diagonal across a corner is another stroke "
               "ending there. Every true bracket in the face arrives within 7 degrees of its stroke (one in W at 46), "
               "the ampersand's arm at 103, so the rule now leaves anything over 60 alone. Only the ampersand changed.",
         evidence=[["Largest circle that fits inside the ink", "227 → 100"], ["In capital stems (Georgia Pro / Serrif)", "2.64 → 1.17 (1.04 / 1.00)"],
                   ["Angle where the arm meets the diagonal", "103 deg"], ["Every true bracket", "0 to 7 deg (W 46)"],
                   ["Glyphs changed by the rule", "1"]],
         fix="derive.BRACKET_MAX_TURN in shorten_brackets. Check: audit_charset, ampersand ink.",
         views=[{"g": "&", "ba": True, "comb": False}, {"g": "&", "box": [330, 200, 800, 520], "ba": True}],
         words="R&D, Q&A, Marks & Spencer"),
    dict(P70, id="mark-centre", sev="high",
         title="Accents sat off centre on O, T, I, D, Y, Z, o, s, u, w, z, c and e",
         body="An accent was placed for the letter Libre Baskerville drew. Since then Area has changed the width of "
              "o, c, z, O, D, T, Z and U, redrawn s, widened w and re-spaced I, and the accents stayed where the old "
              "ink was. Measured as the accent's ink centre against the letter's, over every letter with a dieresis, "
              "macron, circumflex, caron, breve, ring, dot or tilde: 42 units right on O, 41 on T, 24 on I, 14 on o, "
              "43 on z, and 27 left on s, 37 left on w. The other eight faces centre an accent on O to within 2 units "
              "(one at 9). The marks below (dot below, cedilla, comma) were off the same way: 41 on O, 45 on u, 36 on s.",
         after="Each letter's accents now sit where Georgia Pro and Serrif put theirs on average, measured the same way "
               "and scaled to Area's heights (on a letter that is symmetric there, the centre). 40 anchors moved and "
               "224 ready-made letters follow, as do typed combining accents. A letter moves only if it stood more than "
               "6 units off, so the ones that already agreed keep their place. Not moved: i, j, J, h and t, where the "
               "references' longer serifs shift the ink centre and the comparison does not hold.",
         evidence=[["Ö Ô Õ Ō", "+42 → 0"], ["Ť Ţ", "+41 → 0"], ["Ž / ž", "+47 / +51 → +9 / +8 (references +8 / +7)"],
                   ["Ü / ü", "+26 / −22 → +10 / −2 (references +10 / −3)"], ["š ś ŝ", "−27 → 0"],
                   ["ê é ë / ĉ č", "+32 / +33 → +11 / +13 (references)"], ["ŵ ẁ ẃ", "−17 → +20 (references +20)"],
                   ["Ď", "+25 → −24 (references −24)"], ["Other eight faces, on O", "0 to 2 (one 9)"]],
         fix="charset.centre_marks and its table MARK_X. Check: audit_charset, marks (20 letters fail on 0.70).",
         views=[{"g": "Ö", "ba": True, "comb": False}, {"g": "Ť", "ba": True, "comb": False}, {"g": "ž", "ba": True, "comb": False},
                {"g": "š", "ba": True, "comb": False}, {"g": "ü", "ba": True, "comb": False}, {"g": "ŵ", "ba": True, "comb": False}],
         words="Önsöz Übergröße žluťoučký Čeština šest ŵy Ťažký"),
    dict(P70, id="plain-strokes", sev="medium",
         title="Plus, bar, slash and underscore were four different weights",
         body="Signs that are plain strokes should be one stroke. The minus and the dashes are 52. The plus had a 40 "
              "upright on a 52 bar: the build thickens level strokes to lower the contrast and thins upright ones to "
              "lighten the face, and the plus got both (Libre Baskerville's is 52 on 50). The not sign was 39 on 50, "
              "the bar 65, the broken bar 67, the underscore 72, and the slash ran from 41 at its top to 49 at its "
              "foot. Georgia Pro draws plus, bar, slash and underscore at 61, 62, 61 and 50; Serrif at 46, 45, 45 and 47.",
         after="All of them are the minus's 52 now, upright and level alike. The slash and backslash are one thickness "
               "from end to end; the fraction bar and the bar in the percent sign keep their own lighter weight "
               "without the taper.",
         evidence=[["Plus, upright / level", "40 / 52 → 52 / 52"], ["Not sign", "39 / 50 → 52 / 52"], ["Bar, broken bar", "65, 67 → 52"],
                   ["Underscore", "72 → 52"], ["Slash, top / foot (across)", "41 / 49 → 52"],
                   ["Georgia Pro: plus, bar, slash", "61, 62, 61"], ["Serrif: plus, bar, slash", "46, 45, 45"]],
         fix="charset.plain_strokes. Check: audit_charset, plain strokes.",
         views=[{"g": "plus", "ba": True, "comb": False}, {"g": "bar", "ba": True, "comb": False}, {"g": "slash", "ba": True, "comb": False},
                {"g": "underscore", "ba": True, "comb": False}, {"g": "logicalnot", "ba": True, "comb": False}],
         words="3+4±1 a/b |x| a_b ¬p 2−1"),
    dict(P70, id="letter-signs", sev="medium",
         title="Dollar, cent, yen and kra carried Libre Baskerville's letters, not Area's",
         body="Every other sign made of a letter and a stroke is rebuilt from Area's finished letter (the won, ruble, "
              "lira, Đ, Ł, Ø). These four were missed. The dollar's S was 122 across at its heaviest where Area's S is "
              "102; the yen stood on Libre Baskerville's Y with bars of 63 where a capital's thin strokes are 46 to "
              "49; the cent's c was scaled with the capitals to 0.94; and Greenlandic kra was a small capital K, 105 "
              "at its heaviest where k is 92.",
         after="Dollar is S with the stroke through it, cent is c with the stroke, yen is Y with two bars of H's "
               "crossbar, kra is k under dotless i's head. The strokes are the hairline of their case (47 and 43) and "
               "stand where they stood. All four now follow any later change to their letter.",
         evidence=[["Dollar, heaviest", "122 → 102 (S 102)"], ["Yen bars", "63 → 49"], ["Cent's c, height", "498 → 530 (c)"],
                   ["Kra, heaviest", "105 → 92 (k 92)"], ["Share of the letter's points on the sign", "4%, 8%, 44% → 75%, 77%, 97%"]],
         fix="charset.letter_signs, charset.kra. Check: audit_charset, letter signs.",
         views=[{"g": "dollar", "ba": True, "comb": False}, {"g": "cent", "ba": True, "comb": False}, {"g": "yen", "ba": True, "comb": False},
                {"g": "ĸ", "ba": True, "comb": False}],
         words="$12.50 ¢25 ¥1,000 ĸ"),
    dict(P70, id="cap-marks", sev="medium",
         title="The ring over capitals was three quarters size, and capitals held their accents at four heights",
         body="Capital accents are drawn flatter than lowercase ones to fit the line. A ring cannot be flattened, so "
              "Libre Baskerville scaled it: 120 units across with a 35 stroke and a 50 counter, under 0.7 px at 13 px. "
              "Every other face measured keeps one ring for both cases. Separately, accents sat 11 units lower on O "
              "than on E or A, 4 lower on B H K M P V X and 2 on D G S T, and the capital circumflex stood 11 higher "
              "than the caron, which is the same mark turned over. Georgia Pro and Serrif each hold one height for all "
              "of these.",
         after="The capital ring is the lowercase ring, standing where the small one stood. Every capital carries its "
               "accents at one height, and the capital circumflex stands at the caron's.",
         evidence=[["Capital ring, across / stroke", "120 / 35 → 165 / 48"], ["Ring height, capital / lowercase (Georgia Pro)", "0.45 / 0.45"],
                   ["Serrif, Source Serif 4", "0.36 / 0.37, 0.39 / 0.43"], ["Acute over O / over E", "57 / 68 → 68 / 68"],
                   ["Capital circumflex / caron over the cap height", "80 / 69 → 69 / 69"]],
         fix="charset.case_marks, charset.CAP_MARK_Y. Check: audit_charset, capital marks.",
         views=[{"g": "Å", "ba": True, "comb": False}, {"g": "Ů", "ba": True, "comb": False}, {"g": "Â", "ba": True, "comb": False},
                {"g": "Ó", "ba": True, "comb": False}],
         words="Ångström Århus Ůl ÂÊÔ ÓÉÁ"),
    dict(P70, id="accent-distance", sev="medium",
         title="Lowercase accents stood further off their letters than in seven of eight faces",
         body="The acute, grave, circumflex, caron, breve, ring and double acute stood 108 units over the x-height, "
              "0.208 of it. The other faces hold 0.127 to 0.184 (Georgia Pro 0.127, Serrif 0.145); only Libre "
              "Baskerville, whose marks these are, stands further. At 13 px that is 1.4 px of white under the accent "
              "against 0.9. The Vietnamese hook above was also light for its place: its stroke 0.66 of the acute's, "
              "where the five faces that have one hold 0.77 to 0.97.",
         after="This is my recommendation applied, because both references point the same way; each is one number to "
               "change back (charset.MARK_DROP, charset.HOOK). The seven marks come down 18 units, half the way to "
               "the mean of Georgia Pro and Serrif: 90 over the x-height, 0.173, inside the other faces' range. The "
               "hook's stroke is 58 (0.75 of the acute's). Not moved: the tilde, dieresis, dot and macron, which "
               "Georgia Pro holds where Area does, so the references do not agree; and these marks over capitals and "
               "over letters with an ascender, where they would touch.",
         evidence=[["Acute, circumflex, caron over the x-height", "108 → 90"], ["In x-heights", "0.208 → 0.173"],
                   ["Georgia Pro / Serrif", "0.127 / 0.145"], ["Seven faces", "0.127 to 0.184"],
                   ["Hook above, stroke", "51 → 58"], ["Hook / acute weight, five faces", "0.77 to 0.97 (Area 0.66 → 0.75)"]],
         fix="charset.drop_marks (MARK_DROP = 18), charset.HOOK. Check: audit_charset, lowercase accents.",
         views=[{"g": "é", "ba": True, "comb": False}, {"g": "â", "ba": True, "comb": False}, {"g": "å", "ba": True, "comb": False},
                {"g": "ả", "ba": True, "comb": False}],
         words="café naïve crème Čeština kůň fête ảnh"),
    dict(P70, id="sign-weights", sev="low",
         title="Dagger ends, the eth and two currency bars were heavier than the letters; and a correction",
         body="I reported the euro, sterling, section sign, daggers, eth, Eng and kra as 15 to 30% heavier than the "
              "letters. That number was the largest circle that fits inside each sign, and for the euro, sterling and "
              "the section sign the circle sits where a bar or the spine joins, which is not a stroke. Measured across "
              "the stroke, the way the build's own rules measure, the euro's round stroke is 92 (the O's), sterling's "
              "93 to 98 and the section sign's 92 to 103: within the 5% the capitals are allowed. Those three were not "
              "heavy and I have withdrawn that part. What did hold up: the daggers' round ends were 121 across where "
              "the letters' ball terminals are 88 to 100, the eth's bowl 94 where o is 82, and the bars of the euro "
              "and sterling 60 to 64 where a capital's thin strokes are 46 to 49.",
         after="The daggers' round ends are at most 100 and the eth's bowl at most 86, each edge moved in by half the "
               "excess; the euro's and sterling's bars are H's crossbar, 49. Kra is rebuilt from k (above). Eng is left: "
               "it wants rebuilding from N, which is listed under what was not done.",
         evidence=[["Dagger round ends, across", "121 → 100"], ["Eth bowl, across", "94 → 86"], ["Euro bars, sterling bar", "60, 61, 64 → 49"],
                   ["Euro round stroke, across", "92 (not heavy; withdrawn)"], ["Sterling, section", "93 to 98, 92 to 103 (withdrawn)"]],
         fix="charset.cap_strokes (SIGN_STROKE, SIGN_BAR): one line per sign to change back. Check: audit_charset.",
         views=[{"g": "dagger", "ba": True, "comb": False}, {"g": "ð", "ba": True, "comb": False}, {"g": "€", "ba": True, "comb": False},
                {"g": "sterling", "ba": True, "comb": False}]),
    dict(P70, id="mirrors", sev="low",
         title="Right-hand brackets were not their left-hand ones turned over",
         body="Each pair had drifted by a unit or two through lightening and rounding: bracket stems 73 and 74, braces "
              "233 and 234 wide, 2 to 18 points apart per pair, the guillemets and the less and greater signs too.",
         after="The right-hand form is the left-hand one turned over point for point, with its side bearings swapped.",
         evidence=[["[ ] stems", "73 / 74 → 73 / 73"], ["{ } width", "233 / 234 → 233 / 233"], ["Points that differed", "2 to 18 a pair → 0"]],
         fix="charset.mirrors. Check: audit_charset, mirrors.",
         views=[{"g": "bracketright", "ba": True, "comb": False}, {"g": "braceright", "ba": True, "comb": False}]),
    dict(P70, id="viet-grave", sev="low",
         title="Vietnamese: a grave beside a circumflex stood three times as far off as an acute",
         body="A tone mark that meets a circumflex sits beside it. The acute's foot tucks in at the circumflex's right, "
              "31 units away. The grave was put at the same place, but its foot is at its other end, so it pointed away "
              "and stood 100 units off (65 on capitals). The five faces measured with Vietnamese keep 15 to 67.",
         after="The grave is the acute turned over, so it meets the circumflex on the left with its foot toward the peak, "
               "as Source Serif 4 and Newsreader place it: 31 units, the acute's distance. Six letters. One thing to "
               "watch, which step 2 measures: after a tall letter (Hồ) the grave now leans toward that letter.",
         evidence=[["ầ, white between the marks", "100 → 31"], ["Ầ", "65 → 22"], ["ấ (acute), unchanged", "31"],
                   ["Five faces with Vietnamese", "15 to 67"]],
         fix="charset.vietnamese (the grave's own branch). Check: audit_charset, Vietnamese.",
         views=[{"g": "ầ", "ba": True, "comb": False}, {"g": "Ầ", "ba": True, "comb": False}, {"g": "ồ", "ba": True, "comb": False}],
         words="Hồ Chí Minh, tiếng Việt, đồng, cầu"),
    dict(P70, id="nodes-all", sev="low", cls="Curves",
         title="Outside the core, curves still passed an extreme without a node or bent both ways",
         body="Build 0.69 gave every curve of the 62 core characters a node at its extremes and where it changes "
              "direction. The other glyphs with their own outline (381 of them: accents, punctuation, symbols, the "
              "older extended letters) were left: 60 curves passed an extreme without a node and 106 bent both ways. "
              "An earlier count of 213 and 225 counted each accent once for every letter that carries it.",
         after="The same rule now runs on every glyph: 172 nodes added. No curve in the font passes an extreme without "
               "a node, and 30 that bend both ways are left, each where the cut would leave handles that whole units "
               "bend by over a degree. The farthest any outline moved is 1.6 units (the tilde). The cost, stated "
               "plainly: 18 more joins read as bending 0.6 to 3.6 degrees, all on handles of 9 to 18 units where whole "
               "units cannot do better (0.2 to 0.3 of a unit off line).",
         evidence=[["Extremes without a node, own outlines outside the core", "60 → 0"], ["Curves that bend both ways", "106 → 30"],
                   ["Double turns in one curve", "14 → 8"], ["Farthest any outline moved", "1.6 units"],
                   ["Small bends at joins (0.6 to 14 deg)", "148 → 166"], ["pathlint warnings", "171 → 148"]],
         fix="clean.add_nodes on every glyph, last in normalize (AREA_NODES_REST=0 builds without it).",
         views=[{"g": "tildecomb", "ba": True}, {"g": "question", "box": [40, 380, 420, 740], "ba": True},
                {"g": "germandbls", "box": [250, 150, 600, 520], "ba": True}]),
    {"id": "viet-stacks", "sev": "medium", "cls": "Character set", "status": "open",
     "title": "For you: Vietnamese capitals with two marks rise above the line's top",
     "body": "A capital with a circumflex and a tilde (Ẫ, Ễ, Ỗ) tops out at 1,035 units, one with a breve and a hook "
             "at 1,032. The font's ascender, which sets where a line's top is, is 956. So at a line height of 1.2 "
             "these marks reach 79 units into the line above (about 1 px at 13 px). Nothing is clipped on the web or on "
             "Mac, and the Windows clipping box already covers them. I have not changed it because every way of "
             "fixing it changes line height or the marks' shape, and the references disagree: Source Serif 4 tops out "
             "at 996 and Newsreader at 965 with flatter marks, Literata at 1,136 and Lora at 1,114 with taller ones.",
     "evidence": [["Tallest glyph (Ẫ)", "1,035"], ["Ascender (hhea, typo)", "956"], ["Over the line's top", "79 units"],
                  ["Other faces' tallest stack", "965 to 1,189"],
                  ["Option A", "leave: correct in Vietnamese text at line height 1.3 and over"],
                  ["Option B", "stack gap 22 → 12 and capital tone marks 10% flatter: about 1,000"],
                  ["Option C", "raise the ascender to 1,040: every line of every language grows 7%"]],
     "fix": "My recommendation is B if Vietnamese matters to you, A otherwise. Never C.",
     "views": [{"g": "Ẫ", "comb": False}, {"g": "Ẳ", "comb": False}, {"g": "ẫ", "comb": False}]},
    {"id": "left-071", "sev": "low", "cls": "Character set", "status": "open",
     "title": "For you: smaller things measured and left as they are",
     "body": "Where Georgia Pro and Serrif disagree I have not moved anything. The tilde's thick part is 80, a little "
             "over the 78 stem (Georgia Pro 0.84 of its stem, Serrif 0.68, Area 1.02): I would thin it to 70. The "
             "dieresis, dot and macron stand where Georgia Pro has them and higher than Serrif. The degree sign's ring "
             "is 35 thick, under the half-stem floor the guidelines set for thin strokes. The ordinals ª º are the "
             "superior size, smaller than both references. The asterisk and the section sign are Libre Baskerville's "
             "shapes and inside the range of the nine faces.",
     "evidence": [["Tilde, heaviest", "80 (stem 78)"], ["Degree ring", "35"], ["ª º height / figures", "0.54 (Georgia Pro 0.66, Serrif 0.60)"]],
     "fix": "Say which you want and each becomes a rule.",
     "views": [{"g": "ñ", "comb": False}, {"g": "degree", "comb": False}, {"g": "ordfeminine", "comb": False}]},
]

CHANGES += [
    ["0.71", "Ampersand's arm", "a solid wedge (ink 227 across)", "a stroke (100)", "derive.BRACKET_MAX_TURN"],
    ["0.71", "Accents off centre (O, T, z, s, w ...)", "up to 42 units", "within 6 of the references", "charset.centre_marks"],
    ["0.71", "Plus, not, bar, underscore, slash", "40 / 52, 39 / 50, 65, 72, 41 to 49", "52", "charset.plain_strokes"],
    ["0.71", "Dollar, cent, yen, kra", "Libre Baskerville's letters", "Area's S, c, Y, k", "charset.letter_signs, kra"],
    ["0.71", "Capital ring; accent heights on capitals", "120 across; four heights", "165; one height", "charset.case_marks"],
    ["0.71", "Lowercase accents over the x-height", "108 (0.208)", "90 (0.173)", "charset.MARK_DROP"],
    ["0.71", "Vietnamese hook above, stroke", "51", "58", "charset.HOOK"],
    ["0.71", "Dagger ends; eth bowl; euro and sterling bars", "121; 94; 60 to 64", "100; 86; 49", "charset.cap_strokes"],
    ["0.71", "Right-hand brackets", "2 to 18 points off their left forms", "mirrored exactly", "charset.mirrors"],
    ["0.71", "Vietnamese grave beside a circumflex", "100 apart", "31", "charset.vietnamese"],
    ["0.71", "Extremes without a node, outside the core", "60", "0", "clean.add_nodes"],
]

SOLID += [
    ["Outside the core: what was measured and is right",
     "Every glyph made from a letter still carries that letter's outline after 0.67 to 0.70 (Đ đ Ħ ħ Ŧ ŧ Ł ł Ø ø þ ŋ µ æ œ "
     "Æ Œ, the f ligatures, the horned letters, won, ruble, lira, dong: 78 to 100% of the letter's outline found on "
     "the glyph, the rest under the added part). Accented letters are components, so they follow by construction. "
     "The percent sign is the superior and inferior zero, the fractions' own figures. Period, comma, colon, quotes, "
     "parentheses, brackets, guillemets, the hyphen and dashes sit inside the range of the nine faces for weight."],
]

NOT_CHECKED[:] = [
    "There is one master. Area Serif is a single Regular; no weight axis, bold or italic exists yet, so nothing about "
    "interpolation was tested.",
    "Rendering on Windows (the font is unhinted) and at sizes under 12 px on a 1x display.",
    "Kerning outside the 62 core characters (punctuation, quotes, accented pairs): step 2, build 0.72. In particular "
    "whether the Vietnamese grave, now on the left of its circumflex, comes too close to a tall letter before it.",
    "Letters outside the set the font promises (Latin Extended-B, IPA, Latin Extended Additional other than "
    "Vietnamese): looked at on the contact sheets and given nodes, not measured against the references. Capitals "
    "there that carry lowercase accents (Ǎ Ǐ Ǒ Ǔ) and letters with no counterpart in Georgia Pro or Serrif "
    "(B b d F f K k M m P p V v X x with accents) keep Libre Baskerville's accent placement.",
    "A typed combining accent on a letter with an ascender (h, k) lands 18 units lower than in the ready-made letter "
    "since the lowercase accents came down; the ready-made letters are right.",
    "Eng (Ŋ), sharp s (ß, ẞ) and the older extended letters are still Libre Baskerville's drawings, lightened.",
    "The accent table (charset.MARK_X) is the mean of two faces. I looked at every moved letter on a sheet and in "
    "text at 13, 16, 18 and 64 px; I did not test it with readers of the languages.",
]


# ---- Build 0.72: more glyphs (owner: "continue working, building more glyphs, refining"), and the fractions.
BUILD = "0.72"
VERDICT = ("Build 0.72 adds 37 glyphs a UI needs, each made from finished letters and parts, and re-fits the fractions, "
           "whose figures stood 4 to 22 units from their bar (two thirds touched it). Build 0.71 before it took the "
           "evaluation past the 62 core characters to every glyph: eleven fixes by rule, the largest an ampersand "
           "whose arm was a solid wedge and accents up to 42 units off centre. Two things are left for you, with options.")
QA[1] = "pathlint.py: 0 errors, 148 warnings on 0.71 (171 on 0.70, 226 on 0.66); the same count holds on 0.72 for the glyphs 0.71 had."
QA[3] = "audit_charset.py: 0 errors. Run on build 0.70 the same audit fails with 53 errors, on 0.71 with 29 (the fractions and the new glyphs)."
QA[5] = "No core letter or figure changed in 0.71 or 0.72: all 62 are point for point as in 0.70."
FINDINGS += [
    {"id": "fractions", "sev": "high", "cls": "Character set", "status": "fixed", "build": "0.72", "prev": "0.71",
     "title": "In the fractions the figures stood on the bar",
     "body": "Build 0.47 made the small figures larger (0.42 to 0.54 of the figure height) so that footnote marks and "
             "fractions would not read faint. The fractions kept their figures where the smaller ones had stood. "
             "Measured as the nearest ink to the bar: the numerator 4 to 22 units away, and in two thirds the 2 "
             "touched it. Every other face keeps far more: Georgia Pro 55 to 99, Serrif 78 to 89, Libre Baskerville "
             "itself 74 to 103, the rest 30 to 94. At 16 px, 9 units is a seventh of a pixel: the 1 and the bar fuse. "
             "The bars also differed (40 to 54 wide across the fraction slash, the percent sign and the nine fractions).",
     "after": "Each figure's nearest ink now stands 66 units from the bar, the mean of the two references' nearest "
              "(55 and 78). A fraction keeps its side bearings and grows by what its figures moved (one half 652 to "
              "681 wide, two thirds 653 to 749). The bar is 48 wide in every fraction, the fraction slash and the percent sign.",
     "evidence": [["½ numerator / denominator to the bar", "9 / 42 → 66 / 66"], ["⅔", "0 (touching) / 45 → 66 / 66"],
                  ["¼, ¾", "8 / 128, 21 / 128 → 66 / 66"], ["Georgia Pro / Serrif, nearest", "55 / 78"],
                  ["Libre Baskerville", "74 to 103"], ["Bar width, eleven glyphs", "40 to 54 → 48"]],
     "fix": "charset.fraction_fit (FRAC_GAP = 66, one number), charset.FRACTION_BAR. Check: audit_charset, fractions.",
     "views": [{"g": "½", "ba": True, "comb": False}, {"g": "⅔", "ba": True, "comb": False}, {"g": "¾", "ba": True, "comb": False},
               {"g": "⅜", "ba": True, "comb": False}],
     "words": "1½ cups, ⅔ full, 2¾ in, ⅜ ⅝ ⅞"},
    {"id": "glyphs-072", "sev": "low", "cls": "Character set", "status": "fixed", "build": "0.72",
     "title": "37 new glyphs, each from finished letters and parts",
     "body": "From the gap list and what an interface sets: eight fractions the font lacked (⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅐ ⅑), eight "
             "currency signs that are a capital and strokes (naira ₦, peso ₱, tenge ₸, bitcoin ₿, kip ₭, tugrik ₮, "
             "guarani ₲, colon ₡), key and menu symbols (control ⌃, tab ⇥ ⇤, return ↵, forward delete ⌦, caps lock ⇪, "
             "menu dots ⋯ ⋮) and solid shapes (▲ ▼ ▶ ◀ ▴ ▾ ▸ ◂ ■ □ ◆ ★ ☆).",
     "after": "None is drawn by hand. The fractions are the superior and inferior figures and one eighth's bar. Each "
              "currency sign is Area's capital with bars of H's crossbar (49) or strokes of the capital hairline (47), "
              "as the won, ruble and lira already were, and kerns as its letter. The key symbols are the arrows and "
              "the shift and delete signs cut, turned or joined; the menu dots are the period's dot at the ellipsis's "
              "pitch; the shapes sit on the black circle's size and centre, outlined ones at the minus's weight. "
              "Left out, and why: Eng (Ŋ) and sharp s (ß, ẞ) need a design decision, not a rule (which form of Eng; "
              "Area has no part for the sharp s's bowls); escape ⎋, the hooked arrows ↩ ↪ and double arrows ⇐ ⇒ need "
              "curves or strokes Area has no part for yet; one tenth ⅒ needs two figures under the bar; small "
              "capitals and old-style figures are whole sets.",
     "evidence": [["Glyphs", "1,001 → 1,038"], ["Characters the font promises", "all present (check.py)"],
                  ["Share of the capital's points on its currency sign", "60% or more, each (audit)"]],
     "fix": "charset.fractions, letter_currencies, more_symbols; charset.COVERAGE. Check: audit_charset and check.py fail if one is missing.",
     "views": [{"g": "₦", "comb": False}, {"g": "₿", "comb": False}, {"g": "₱", "comb": False}, {"g": "⅗", "comb": False},
               {"g": "↵", "comb": False}, {"g": "★", "comb": False}]},
]
CHANGES += [
    ["0.72", "Fractions: nearest figure to the bar", "0 to 22 (numerator)", "66", "charset.fraction_fit"],
    ["0.72", "Fraction and percent bars", "40 to 54 wide", "48", "charset.FRACTION_BAR"],
    ["0.72", "New glyphs", "1,001", "1,038", "charset.fractions, letter_currencies, more_symbols"],
]


# ---- Build 0.73: spacing and kerning beyond the core. test_fit_ext.py: 75,161 pairs of punctuation, signs and
# accented letters with the 62 core characters and with each other, shaped with kerning, on Area Serif, Georgia Pro
# and Serrif.
BUILD = "0.73"
VERDICT = ("Build 0.73 takes spacing past the 62 core characters: 75,161 pairs of punctuation, signs and accented "
           "letters measured with kerning on. 691 of them overlapped; none does now. The cause was one thing: the "
           "kerning fixed in 0.66 had been written for the plain letters only, so their accented forms never got it. "
           "Build 0.72 before it added 37 glyphs and re-fitted the fractions; 0.71 took the outline evaluation to "
           "every glyph. Two things are still left for you, with options (Vietnamese capital stacks; a few small signs).")
QA[3] = ("audit_charset.py: 0 errors. Run on build 0.70 the same audit fails with 53 errors, on 0.71 with 29, on 0.72 "
         "with 4 (4,959 pairs closer than 10 units, 456 accented letters outside their letter's kerning class, IJ, numero).")
QA.append("No core pair changed in 0.73: all 3,844 keep their gaps (tightest still 10, optical evenness still 9.8%).")
FINDINGS += [
    {"id": "family-kerning", "sev": "high", "cls": "Spacing", "status": "fixed", "build": "0.73", "prev": "0.72",
     "title": "Accented letters did not get their letters' kerning: 691 pairs overlapped",
     "body": "Build 0.66 measured every pair of the core letters against both references and wrote a kerning value "
             "where one was needed, and opened every pair that came closer than 13 units. Those values were written "
             "for the glyphs measured. So K before A was opened by 51 units, and K before À, Á, Â, Ã, Ä, Å still "
             "had the old class value and overlapped by 38. The Vietnamese letters added in 0.48 were in no kerning "
             "class at all. Beyond that the collision pass only looked at letters, figures and 18 punctuation marks, "
             "so an accent under f's hood (fï 45 over), j's tail under a bracket ([j, 47), or a caron beside a tall "
             "letter (ľV, 62) was never seen. Georgia Pro has 770 such overlaps in the same pairs and Serrif 127, "
             "so this is common; it is still wrong.",
     "after": "An accented letter kerns as its letter: 456 of them joined their letter's kerning class on each "
              "side where they show the same edge, 91 of 0.66's values moved from the letter to its class and 1,215 "
              "were copied where a class mixes letters. Then the collision pass ran over every glyph the font "
              "promises and opened 1,732 pairs. No pair of the 75,161 overlaps; 218 stand at 9 to 13 units, the same "
              "floor the core has. The font file grew from 48 to 54 KB. The cost, plainly: T before a Vietnamese ạ "
              "now tucks as T before a does, which is right for the letter and untested with readers.",
     "evidence": [["Pairs that overlap, of 75,161", "691 → 0"], ["Pairs under 13 units", "486 → 218 (all 9 or more)"],
                  ["K À / Y Ý / A À", "−38 / −40 / −35 → 13"], ["f ï / f î / [ j", "−45 / −68 / −47 → 13"],
                  ["Georgia Pro / Serrif, overlaps in the same pairs", "770 / 127"],
                  ["Accented letters now in their letter's class", "456"], ["Font file (woff2)", "48 → 54 KB"]],
     "fix": "spacing.kern_families, spacing.open_all (spacing.finish, last in normalize). Check: audit_charset, spacing.",
     "views": [],
     "words": "KÀ YÝ AÀ Tạ Vệ fï fî (j) [j] ľV ďK Señor Čapek’s"},
    {"id": "digraphs", "sev": "medium", "cls": "Spacing", "status": "fixed", "build": "0.73", "prev": "0.72",
     "title": "IJ and the numero sign ran out of their own width",
     "body": "IJ is I and J in one glyph, placed where Libre Baskerville's letters stood. Area's J has since moved "
             "220 units within its advance, so the J hung 137 units past the end of the glyph and the next letter "
             "ran into it (IJ before Y overlapped by 168). The numero sign's small o ran 337 units past its advance "
             "for the same reason: N was widened in 0.33.",
     "after": "A glyph of two letters is those letters set side by side, their own kerning between them, its advance "
              "their sum: IJ, ij and the DZ, LJ, NJ sets. The numero sign is N and the masculine ordinal on N's "
              "advance.",
     "evidence": [["IJ advance", "743 → 880"], ["IJ before Y", "−168 → clear"], ["Numero advance", "813 → 1,113"],
                  ["Numero, ink past its advance", "337 → 0"]],
     "fix": "charset.digraphs, charset.numero. Check: audit_charset.",
     "views": [{"g": "IJ", "ba": True, "comb": False}, {"g": "numero", "ba": True, "comb": False}],
     "words": "IJssel IJY №5 Nº"},
    {"id": "sign-sides", "sev": "low", "cls": "Spacing", "status": "fixed", "build": "0.73", "prev": "0.72",
     "title": "Nine signs stood closer to or further from their neighbours than both references set them",
     "body": "0.66 fitted the side bearings of the dashes, parentheses, exclamation mark and quotes against both "
             "references. The other signs kept Libre Baskerville's. Measured the same way (the white a side really "
             "shows, against the face's own n), 36 signs: nine stood off both references in the same direction by 8 "
             "units or more.",
     "after": "Each moved by the smaller of the two differences: the percent sign 26 looser on its right, the "
              "dollar 17 and 15 looser, the inverted exclamation mark 18 on its right, the brackets 11 on their inner "
              "side, the at sign 9 and the number sign 12 on their right, sterling 10 on its left; the trademark 24 "
              "and the underscore 19 a side tighter. Left alone on purpose: a symmetric sign keeps equal sides and a "
              "mirrored pair equal ones (so the bar, braces and guillemets stay), and plus and equals keep the maths' "
              "one width. After this 5,266 of the 75,161 pairs (7.0%) still sit more than 25 units outside both "
              "references' own setting, down from 5,891; Georgia Pro and Serrif differ from each other by that much "
              "on 39.7% of them. The largest group left is anything before j, whose tail is yours.",
     "evidence": [["Pairs more than 25 outside both references", "5,891 → 5,266 of 75,161"],
                  ["Georgia Pro and Serrif more than 25 apart", "39.7% of pairs"],
                  ["Percent, right side", "+26"], ["Dollar", "+17 / +15"], ["Underscore", "−19 / −19"]],
     "fix": "spacing.OPTICAL_MORE (one line per sign).",
     "views": [],
     "words": "50% of $100, [a] ¡Hola! a_b #1 @home £5™"},
]
CHANGES += [
    ["0.73", "Pairs that overlap, punctuation and accented letters (75,161)", "691", "0", "spacing.kern_families, open_all"],
    ["0.73", "IJ, numero: advance", "743, 813", "880, 1,113", "charset.digraphs, numero"],
    ["0.73", "Side bearings of nine signs", "Libre Baskerville's", "fitted to both references", "spacing.OPTICAL_MORE"],
]
NOT_CHECKED[2] = ("Kerning between two accented letters, between figures and the signs, and inside the sets the font "
                  "does not promise (Latin Extended-B, IPA). The collision pass covers every pair of promised glyphs, "
                  "so none of those overlaps; their rhythm against the references was not measured.")
NOT_CHECKED.append("Vietnamese and other accented text was looked at in proofs at 60 px after the kerning change, not "
                   "read by speakers of those languages.")


# ---- The bold master: a plan, not a build (docs/research/serif-typeface-2026-11-10/bold-master-plan.md).
FINDINGS += [
    {"id": "bold-plan", "sev": "medium", "cls": "Weight", "status": "open",
     "title": "For you: the bold master, as a plan with four decisions",
     "body": "Area Serif has one master. I measured what Georgia Pro, Serrif and four other faces do from Regular to "
             "Bold: heights do not move, stems and round strokes grow by about 1.8, thin strokes by 1.1 to 1.4, "
             "letters get 5 to 20% wider while their counters still close by 15 to 30%, and side bearings tighten. "
             "Applied to Area's Regular by the mean of the two references, a Bold has a 140 stem (78 now), a 53 "
             "hairline (43), a 41 serif tip (30), n 667 wide (579) on a 734 advance (654), and the same heights. "
             "I also tried the build at that weight. It is not a route: Libre Baskerville's own Bold is only 1.46 of "
             "its Regular, so Area's target lies 18 to 41% past it; the rules that make Area Serif are written for "
             "the Regular's positions and stop at the first letter; and only 3 of the 62 core characters still have "
             "Libre Baskerville's point structure. What is ready is the Regular itself: after 0.69 to 0.71 every "
             "curve has its nodes where a second master needs them.",
     "evidence": [["Stem, Bold / Regular: Georgia Pro, Serrif", "1.76, 1.84"], ["Libre Baskerville, Merriweather", "1.46, 1.36"],
                  ["Hairline, Bold / Regular", "1.08, 1.37"], ["n ink width / counter", "1.21 / 0.85, 1.09 / 0.72"],
                  ["Area target: stem, hairline, tip", "140, 53, 41"], ["Area target: n width, advance", "667, 734"],
                  ["Build run at the bold weight: core characters with the Regular's structure", "19 of 62"],
                  ["Decision 1: how heavy", "140 (recommended) or 114"],
                  ["Decision 2: contrast", "1.9 to 2.75 (recommended) or held at 1.9"],
                  ["Decision 3: where the weight goes", "the mean (recommended), wider, or narrower"],
                  ["Decision 4: the route", "the Regular's own points moved by rule (recommended) or drawn by hand"]],
     "fix": "The plan, with every number and the first three steps: docs/research/serif-typeface-2026-11-10/bold-master-plan.md. "
            "Step 1 is the four control letters n o H O at Bold on a page, with no change to the build.",
     "views": [{"g": "n", "comb": False}, {"g": "o", "comb": False}, {"g": "H", "comb": False}, {"g": "O", "comb": False}]},
]
NOT_CHECKED[0] = ("There is one master. The bold master is a plan with measured targets (the last finding); no bold "
                  "outline exists, so nothing about interpolation was tested.")
VERDICT = VERDICT.replace("Two things are still left for you, with options (Vietnamese capital stacks; a few small signs).",
                          "Three things are left for you, each with options: the bold master (a plan with four "
                          "decisions), Vietnamese capital stacks, and a few small signs.")


# ---- Build 0.74: the verification pass on 0.73 (owner, 2026-11-14: "first do a consistency and coherence, detail,
# technical accuracy, optical check on the current set. make sure everything is mathematically correct before
# proceeding"). tools/verify.py: second methods for what the audits read, and sweeps over all 1,038 glyphs.
import os as _os
import sys as _sys
_sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "..", "..", "..", "typefaces", "area-serif"))
from version import BUILD          # noqa: E402  (one number for the font, the editor page and this page)
DATE = "14 November 2026"
VERDICT = ("Build 0.74 is a verification pass on everything built since 0.70, by second methods and over all 1,038 "
           "glyphs. It found six things wrong in my own work of 0.71 to 0.73 and nine older inconsistencies; all "
           "fifteen are fixed by rule, each with a check the build before fails (26 checks fail on 0.73). The largest "
           "of mine: capital accents on D, G, S, T and H had been pushed 2 to 4 units too high, and the bars of the "
           "euro and sterling were thinned along only part of their length. No core letter, figure or core pair "
           "changed. Three things are still left for you: the bold master's four decisions, Vietnamese capital "
           "stacks, and a few small signs.")
QA[1] = "pathlint.py: 0 errors (171 warnings on 0.70, 148 since 0.71)."
QA[3] = ("audit_charset.py: 0 errors on 0.74. The same audit fails with 53 errors on 0.70, 29 on 0.71, 4 on 0.72 and 26 "
         "on 0.73 (the verification pass's checks).")
QA.append("verify.py, second methods: an accent's centre from its anchor and from its ink agree within 1.5 units on "
          "every letter; a stroke read across itself matches the audits (o 82, O 92, hairlines 43 and 47); 3,000 shaped "
          "pairs rasterised: the smallest true distance is 8.2 units (long s before 1), all others 10 or more.")
QA.append("Tables: every promised character is in the cmap; names unique; frac, tnum, sups, sinf, ordn, liga, dlig, ss01 "
          "and ccmp fire (the eight new fractions included); a typed base and combining marks lands where the "
          "ready-made letter is, on all of them; winding and overlaps clean; the font's own version now reads the build.")
V74 = {"cls": "Verification", "prev": "0.73", "build": "0.74", "status": "fixed"}
FINDINGS += [
    dict(V74, id="v-cap-heights", sev="high",
         title="My error in 0.71: capital accents on D, G, S, T and H went 2 to 4 units too high",
         body="0.71 put every capital's accents on one height by moving each letter's accents as far as its anchor "
              "moved. An anchor is the median of where a letter's accents sit, and on D, G, S, T and H some letters "
              "(Ď, Ĝ, Ğ, Ġ, Ś, Š, Ŝ, Ť, Ĥ) were already on the line. Those went 2 to 4 units above it. O was fixed and "
              "these were broken. The audit I wrote read the anchors, which were right, so it passed. The second "
              "method, reading each accent's own ink against the cap height, shows it: 71 and 73 where the rest are 69.",
         after="A capital's first accent now stands with its own anchor on the line, wherever it stood before, and the "
               "check reads every letter. The caron and circumflex also stood 1 unit over the acute and grave; the "
               "five pointed accents are one distance, 68.",
         evidence=[["Ĥ circumflex over the cap height", "73 → 68"], ["Ď Ť caron, Ĝ Ŝ circumflex", "71 → 68"],
                   ["Acute, grave, caron, circumflex, double acute", "68, 68, 69, 69, 68 → 68"],
                   ["Capitals off the line (all glyphs)", "42 → 0"]],
         fix="charset.centre_marks (absolute height), charset.case_marks. Check: audit_charset reads every capital.",
         views=[{"g": "Ĥ", "ba": True, "comb": False}, {"g": "Ď", "ba": True, "comb": False}, {"g": "Ĝ", "ba": True, "comb": False}]),
    dict(V74, id="v-bars", sev="high",
         title="My error in 0.71: the euro's and sterling's bars were thinned along only part of their length",
         body="0.71 brought those bars from 60 to 64 down to the capitals' 49. The rule moved only the stretch where it "
              "found both edges of a bar one above the other. The stub of each bar left of the round stroke kept its "
              "old thickness, so each bar had a step in it: 49 inside the letter, 60 or 64 outside. My check measured "
              "one place.",
         after="Every point on a bar's two edges moves, the whole length. The check scans each bar every 6 units.",
         evidence=[["Euro bars, thickness along the bar", "49 and 60, 49 and 61 → 49"], ["Sterling bar", "49 and 64 → 49"]],
         fix="charset.cap_strokes. Check: audit_charset, bars along their length.",
         views=[{"g": "€", "ba": True, "comb": False}, {"g": "€", "box": [-10, 240, 330, 480], "ba": True}, {"g": "sterling", "ba": True, "comb": False}]),
    dict(V74, id="v-constants", sev="medium",
         title="My errors in 0.71 and 0.72: constants that did not match their own derivation",
         body="Re-deriving every number I added from its stated source: the lowercase accents were to come half the "
              "way to the references' mean, which is 89.4 over the x-height, and I set 90 (a drop of 18, not 19). Four "
              "entries of the accent table did not follow the table's own rule (n, r, u; T's marks below). The eth's "
              "bowl was capped at 86, a figure from before the face was lightened: o is 82 and no lowercase round "
              "stroke is over 83. The capital hook above, made heavier with the lowercase one, is too small to carry "
              "it: its counter closed to a 76-square-unit scrap. The tenge was T scaled to 0.80 and caps lock the "
              "shift arrow scaled, which thinned T's arm from 46 to 37 and the arrow's level strokes from 52 to 42; "
              "strokes centred on a half unit rounded to one more or less (guarani 46 for 47, ŧ 48 for 49). The "
              "currency bars of 0.72 were placed by eye, against the rule that every number has a source.",
         after="Each is the derived value now: drop 19 (accents at 89); the table re-derived to the unit; eth 83; the "
               "capital hook back to 46 with an open counter; tenge and caps lock shortened by cutting a straight "
               "stretch, nothing scaled; strokes placed on whole units; the currency bars at the mean of Georgia Pro's "
               "and Serrif's positions (naira 0.42 and 0.59 of the cap height, peso 0.62 and 0.78, kip 0.51, the "
               "bitcoin's and guarani's strokes 0.155 and 0.14 past the letter).",
         evidence=[["Lowercase accents over the x-height", "90 → 89 (half way is 89.4)"], ["Eth bowl, thickest", "87 → 83"],
                   ["Tenge, lower bar", "37 → 46 (T's arm)"], ["Caps lock, level strokes", "42 → 52"],
                   ["Capital hook: stroke, counter", "52, closed → 46, open"], ["Guarani stroke, ŧ bar", "46, 48 → 47, 49"]],
         fix="charset.MARK_DROP, MARK_X, SIGN_STROKE, HOOK, cut_out, band, letter_currencies. Checks in audit_charset.",
         views=[{"g": "₸", "ba": True, "comb": False}, {"g": "uni21EA", "ba": True, "comb": False}, {"g": "ð", "ba": True, "comb": False},
                {"g": "Ả", "box": [230, 740, 470, 920], "ba": True}, {"g": "₦", "ba": True, "comb": False}]),
    dict(V74, id="v-dots", sev="medium",
         title="Older: every dot but i's and j's was an oval, and dots that are one dot differed by a unit",
         body="Libre Baskerville's dots are circles. The build thickens level strokes and thins upright ones, and that "
              "had turned every dot outside i and j into an oval 7 units taller than wide (the period 123 by 130). "
              "Dots that are the same dot had also drifted: the colon's 124 wide beside the period's 123, the "
              "dieresis's two dots 110 and 111, the division sign's two 125 and 124 tall, the inverted marks' 118 "
              "beside the upright ones' 117. The opening quote was not the closing one turned (138 and 137 wide), "
              "and a bracket's two arms were 51 and 50.",
         after="A dot is a circle of its family's width. Colon, semicolon and ellipsis carry the period's dot; ¡ and ¿ "
               "are ! and ? turned half round; the opening quote is the closing one turned; the double quotes are two "
               "singles; a bracket's arms are both 50. Dots that stand on the baseline keep their foot; the others "
               "keep their centre, so the dieresis and dot accent sit 4 to 5 units higher at their lowest point.",
         evidence=[["Period", "123 × 130 → 124 × 124"], ["Colon / period, width", "124 / 123 → 124 / 124"],
                   ["Dieresis dots", "110 × 117, 111 × 117 → 110 × 110"], ["¡ ¿ against ! ?", "118 / 117 → the same drawing"],
                   ["Opening / closing quote", "138 / 137 wide → the same drawing"], ["Bracket arms", "51 / 50 → 50 / 50"]],
         fix="charset.round_dots, one_drawing, turned_pairs. Check: audit_charset (30 ovals and 12 mismatches on 0.73).",
         views=[{"g": "period", "box": [40, -40, 230, 150], "ba": True}, {"g": "colon", "ba": True, "comb": False},
                {"g": "ä", "ba": True, "comb": False}, {"g": "¿", "ba": True, "comb": False}, {"g": "quoteleft", "box": [30, 520, 220, 830], "ba": True}],
         words="“Wait… is it 3÷4; or not?” ¡Sí! ¿Qué? naïve Zoë"),
    dict(V74, id="v-marks", sev="low",
         title="Older: the macron was two weights, and marks below hung at three depths",
         body="The lowercase macron was 59 thick, heavier than the hyphen (52) and every level stroke of the lowercase; "
              "its capital form was 47. Both references draw one macron for both cases (Georgia Pro 62 and 63, Serrif "
              "49 and 49). The ogonek reached 225 under A, 216 under I and U and 215 under the rest; the dot below "
              "reached 208 under the horned Vietnamese capitals and 219 under the others.",
         after="The lowercase macron takes the capital form's 47, about its own centre. Every ogonek reaches 215 and "
               "every capital's dot below 219.",
         evidence=[["Macron, lowercase / capital", "59 / 47 → 47 / 47"], ["Ogonek depth", "225, 216, 215 → 215"],
                   ["Dot below, capitals", "219, 208 → 219"]],
         fix="charset.macron_weight, below_depths. Check: audit_charset.",
         views=[{"g": "ō", "ba": True, "comb": False}, {"g": "Ą", "ba": True, "comb": False}, {"g": "Ợ", "ba": True, "comb": False}]),
    dict(V74, id="v-technical", sev="low",
         title="Older: scaled stems in the product sign, and a font that called itself version 0.003",
         body="The product sign (0.47) was H's stems under a bar, scaled to 0.86: its stems were 74, not 86. The font "
              "file has said \"Version 0.003\" since the first build, whatever the build was.",
         after="The product sign is narrowed between its stems, which are 86. The font's version is the build's, from "
               "one file that the two pages read as well.",
         evidence=[["Product sign, stems", "74 → 86"], ["Font version", "0.003 → 0.740"]],
         fix="charset.narrow, typefaces/area-serif/version.py. Check: audit_charset.",
         views=[{"g": "product", "ba": True, "comb": False}]),
]
CHANGES += [
    ["0.74", "Capitals with an accent off the line", "42", "0", "charset.centre_marks"],
    ["0.74", "Euro and sterling bars", "49 with 60 to 64 in places", "49", "charset.cap_strokes"],
    ["0.74", "Lowercase accents over the x-height", "90", "89", "charset.MARK_DROP"],
    ["0.74", "Dots that are not circles", "30", "0", "charset.round_dots"],
    ["0.74", "Glyphs that are another's parts but differ", "12", "0", "charset.one_drawing"],
    ["0.74", "Macron, lowercase; ogonek depths", "59; three", "47; one", "charset.macron_weight, below_depths"],
    ["0.74", "Scaled strokes (tenge, caps lock, product)", "37, 42, 74", "46, 52, 86", "charset.cut_out, narrow"],
]
SOLID += [
    ["Checked twice in 0.74 and right",
     "Plain strokes are 52 to the unit by their coordinates (plus, minus, bar, underscore, dashes); the slash is 51.9 "
     "across. Round strokes across themselves: o 82, b d p q 82, O 92, D 93, S 95, zero 87; hairlines 43 and 47. "
     "Tabular figures and maths signs are 612 wide, all of them. Mirrored pairs are point for point with swapped "
     "bearings. No pair in the promised set overlaps; the smallest true distance in 3,000 rasterised pairs is 8.2."],
]
NOT_CHECKED.append(
    "Measured and left, each for a stated reason: parentheses reach 39 units deeper than brackets (the references' "
    "differ by 10 to 12; Libre Baskerville's by 43); the percent sign's zeros sit 35 and 8 units lower than a "
    "fraction's; infinity is wider than the tabular width (its two loops do not fit 612); several factors in 0.47's "
    "pi, Omega, increment and sheqel have no measured source; the superior 4's stem is 52 where the superior 1's is "
    "54; the long s before 1 is 8.2 apart on the diagonal where the row scan reads 9.3.")


# ---- Build 0.75: the recommendations left open in 0.71 (owner, 2026-11-14: "build your recommendations").
VERDICT = ("Build 0.75 applies the recommendations left open since 0.71, each one line to change back: Eng rebuilt "
           "from Area's N, the sharp s at the letters' weight, a thinner tilde, the degree's ring at the hairline, "
           "Vietnamese stacks at the face's minimum gap. Two of them I changed or withdrew after measuring (the "
           "ordinals, and how far the stacks can come down). Build 0.74 before it was a verification pass on "
           "everything since 0.70: six errors of mine and nine older inconsistencies fixed, each with a check. No "
           "core letter, figure or core pair has changed since 0.70. The bold master waits for the research on "
           "technique, and its four decisions are taken as recommended.")
QA[3] = ("audit_charset.py: 0 errors on 0.75. The same audit fails with 53 errors on 0.70, 29 on 0.71, 4 on 0.72, 26 on "
         "0.73 and 11 on 0.74.")
R75 = {"cls": "Character set", "prev": "0.74", "build": "0.75", "status": "fixed"}
FINDINGS += [
    dict(R75, id="r-eng", sev="medium",
         title="Recommendation applied: Eng is Area's N with a tail",
         body="All six faces I looked at draw the capital Eng as N with its right upright carried below the baseline "
              "into a hooked tail, so the form was never in question. Area's was Libre Baskerville's own N of that "
              "form, lightened: 125 across at its heaviest where N is 105, with its own width, diagonal and serifs.",
         after="It is Area's N now, point for point, with the tail (what Libre Baskerville's Eng has under the "
               "baseline) on N's right upright. It kerns as N and follows N from here on. To change back: one line "
               "(charset.eng_capital). The lowercase eng was rebuilt from n in 0.65.",
         evidence=[["Heaviest, Eng / N", "125 / 105 → 106 / 105"], ["Width", "Libre Baskerville's → N's"],
                   ["Form in Georgia Pro, Serrif, Libre Baskerville, Source Serif 4, Literata", "N with a tail, all"]],
         fix="charset.eng_capital. Check: audit_charset (N's points on it).",
         views=[{"g": "Ŋ", "ba": True, "comb": False}, {"g": "N", "comb": False}],
         words="Ŋaŋ ŊŊ Saŋ"),
    dict(R75, id="r-signs", sev="low",
         title="Recommendations applied: tilde, degree ring, sharp s",
         body="The tilde's thick part was 80, over the 78 stem (1.02; Georgia Pro 0.84, Serrif 0.68), and its capital "
              "form 76 (0.89; 0.73 and 0.61). The degree sign's ring measured 35 at its top and only 21 at its sides, "
              "under the half stem the guidelines set as the floor for a thin stroke. The sharp s was 105 across at "
              "its heaviest where no lowercase round stroke is over 83.",
         after="The tilde is 66 and 63, the nearer reference's share in each case. The degree's ring is 47 all round, "
               "the capital hairline, inside the same outer circle. The sharp s keeps its form, which is the "
               "references' form, with no stroke over 83; its capital was already inside the capitals' 95. Each is "
               "one line (charset.SIGN_STROKE_NAMES, degree_ring).",
         evidence=[["Tilde, thickest: lowercase / capital", "80 / 76 → 66 / 63"], ["Degree ring, top / side", "35 / 21 → 47 / 47"],
                   ["Sharp s, thickest across a stroke", "105 → 83"]],
         fix="charset.cap_strokes (run again after the node rules), charset.degree_ring. Check: audit_charset.",
         views=[{"g": "ñ", "ba": True, "comb": False}, {"g": "degree", "ba": True, "comb": False}, {"g": "ß", "ba": True, "comb": False}],
         words="São João, mañana, 21°C, Straße"),
    dict(R75, id="r-stacks", sev="low",
         title="Vietnamese capital stacks: what could be done without changing the line, and what could not",
         body="I recommended tightening the stack and flattening the capital tone marks by a tenth, to bring the "
              "tallest capitals from 1,035 to about 1,000. Flattening is scaling, and 0.74 made it a rule that nothing "
              "is scaled (it is how the tenge's arm went from 46 to 37). So half of that recommendation is withdrawn.",
         after="The white between two stacked marks is 13, the face's own minimum between any two shapes (it was 22). "
               "The tallest letter is 1,023 (Ẳ), 67 units over the line's top of 956, where it was 79. Going further "
               "needs one of two things, and both are yours: a second, flatter set of capital tone marks drawn for "
               "stacks (new drawings, not a rule), or accepting 67 units, which is about 1 px at 16 px and invisible "
               "at a line height of 1.3 or more. The ascender stays where it is.",
         evidence=[["White between stacked marks", "22 → 13"], ["Tallest letter", "1,035 → 1,023"], ["Over the line's top (956)", "79 → 67"],
                   ["Other faces' tallest stack", "965 to 1,189"]],
         fix="charset.STACK_GAP. Check: audit_charset.",
         views=[{"g": "Ẫ", "ba": True, "comb": False}, {"g": "Ẵ", "ba": True, "comb": False}, {"g": "ẵ", "ba": True, "comb": False}]),
]
for _f in FINDINGS:
    if _f["id"] == "viet-stacks":
        _f.update(status="part", build="0.75", title="Vietnamese capitals with two marks rise above the line's top",
                  after="0.75 took the stack to the face's minimum gap: the tallest is 1,023, 67 over the line's top. See the "
                        "finding on the stacks for what the rest would take.")
    if _f["id"] == "left-071":
        _f.update(status="fixed", build="0.75", title="Smaller things measured in 0.71",
                  after="0.75: the tilde is thinned and the degree's ring thickened (their own finding). The ordinals stay: "
                        "they are the superior figures' size by a recorded decision of 0.47, and Serrif's are 0.60 of the "
                        "x-height to Area's 0.56, so enlarging them alone would break that tie for 4%. If you want them "
                        "larger, the number is charset.SUP_SCALE and it moves every superior and fraction with them.")
    if _f["id"] == "bold-plan":
        _f.update(title="The bold master: decisions taken as recommended, waiting on the technique research",
                  after="You took the four recommendations (stem 140, contrast rising to 2.75, the references' mean width, "
                        "the Regular's own points moved by rule). The session that started this one is researching the "
                        "soundest technique for holding each glyph consistent across weights; the bold starts when that "
                        "arrives and has been compared with this plan.")
CHANGES += [
    ["0.75", "Eng", "Libre Baskerville's N with a tail", "Area's N with the tail", "charset.eng_capital"],
    ["0.75", "Tilde, thickest: lowercase / capital", "80 / 76", "66 / 63", "charset.SIGN_STROKE_NAMES"],
    ["0.75", "Degree ring; sharp s thickest", "35 and 21; 105", "47; 83", "charset.degree_ring, cap_strokes"],
    ["0.75", "White between stacked Vietnamese marks", "22", "13", "charset.STACK_GAP"],
]


# ---- Build 0.76: the Bold master and the weight axis (owner, 2026-11-14: "build your recommendations"; the
# research report "Variable serif weight consistency" on technique). The Regular is unchanged.
VERDICT = ("Build 0.76 gives Area Serif its second master. The Bold is made from the Regular's own points by rule "
           "(bold.py), so the two match point for point, and one variable font holds every weight from 400 to 700. "
           "The Regular is unchanged: all 1,038 glyphs are as in 0.75. For the 52 letters and ten figures every part "
           "is measured on the Bold against its target and all 405 are on target. Along the axis the same audit "
           "runs every 25 units and fails on two parts between the masters (the neck of g's ear up to 2.6 units "
           "thin, x's thick stroke up to 1.8 heavy). Beyond the letters it is a first pass: four glyphs are only made safe, "
           "some signs and marks are lighter than the references', and Bold kerning is the Regular's opened for "
           "collisions, not a fresh fit. A Bold with a 128 stem is one number away and is on the editor page "
           "beside the 140.")
QA.append("0.76, audit_bold.py: 405 of 405 parts on target on the Bold's own outlines (62 glyphs: upright strokes 92, "
          "level strokes 81, serif reach 68, serif tips 52, slanted strokes 37, counters 28, openings 18, necks 14, "
          "balls 12, dots 2, e's bar), at stem 140 and at stem 128.")
QA.append("0.76, audit_bold.py --sweep (every 25 units of weight): FAILS. 403 to 405 of 405 parts on target at each "
          "stop; g's neck misses at 475 to 650 and x's thick stroke at 525 to 625; no kink or turned curve at any stop.")
QA.append("0.76, the weight axis: the variable font builds with no incompatible master; fontTools "
          "varLib.interpolatable at kinkiness 1.0 reports nothing; the Regular's files are identical to 0.75 "
          "(0 of 1,038 glyphs, advances or kerning differ).")
for _f in FINDINGS:
    if _f["id"] == "bold-plan":
        _f.update(status="fixed", build="0.76", title="The bold master: built, by rule, from the Regular's own points",
                  after="0.76 builds it. The research's technique and this plan were reconciled: parts are moved by "
                        "role, never offset; every curve keeps its tension and the direction it leaves each node; "
                        "slanted strokes follow the Regular's own vertex construction. Two of the plan's numbers were "
                        "wrong and are corrected: its width table (an n 667 wide with a 223 counter cannot both "
                        "hold; the rule is a share of the gain taken from the counter) and the head flag (it keeps "
                        "its top and thickens downward, as both references do).")
W76 = {"cls": "Weight", "prev": "0.75", "build": "0.76"}
FINDINGS += [
    dict(W76, id="bold-master", sev="high", status="fixed",
         title="A second master: Bold, and every weight between",
         body="Every on-curve point of the Regular has a role (a stem's edge, a bowl's extreme, a serif's tip, a "
              "slanted stroke's end). bold.py reads those roles on each glyph, gives each part its Bold size from "
              "one number, the lowercase stem, and solves where every node goes so that strokes are exactly their "
              "size, heights do not move and everything else changes as little as it can. Handles are never "
              "placed. Targets are the mean of what Georgia Pro and Serrif do from Regular to Bold, applied to "
              "Area's Regular, so the Bold stands as far under theirs as the Regular does.",
         evidence=[["Stem, lowercase / capital", "78 / 86 → 140 / 148"], ["Round stroke", "82 / 92 → 146 / 156"],
                   ["Hairline", "43 / 47 → 53 / 59"], ["Serif tip", "30 → 41"], ["Contrast of o", "1.91 → 2.75 (2.31 half way)"],
                   ["n counter / advance", "283 / 654 → 240 / 718"], ["Stem / x-height (Georgia Pro Bold, Serrif Bold)", "0.269 (0.331, 0.317)"],
                   ["Parts on target, letters and figures", "405 of 405"], ["Glyphs in the variable font", "1,038"]],
         fix="bold.py (vector, bold, bold_font, variable); build.py writes AreaSerif[wght]. Checks: audit_bold.py, "
             "audit_bold.py --sweep, bold.sound, fontTools interpolatable.",
         views=[{"g": "n", "ba": False, "comb": False}, {"g": "a", "ba": False, "comb": False}, {"g": "k", "ba": False, "comb": False}]),
    dict(W76, id="bold-axis", sev="medium", status="part",
         title="Along the axis: two places sit a little off their line between the masters",
         body="The same audit runs on the instance at every 25 units of weight. Stems, hairlines, tips, counters and "
              "serifs are on target at every stop. Two things are not straight lines between the masters, because "
              "they come from where two lines meet: the neck of g's ear is up to 2.6 units thinner than its target "
              "between 475 and 650, and the thick stroke of x is up to 1.8 units heavier between 525 and 625. Both "
              "are under the 3% the research gives as visible, so no third master is added.",
         evidence=[["Stops audited", "13 (400 to 700)"], ["Parts on target at each stop", "403 to 405 of 405"],
                   ["g's neck, worst", "2.6 under at 550"], ["x's thick stroke, worst", "1.8 over at 550 to 600"],
                   ["Glyphs with a kink or a turned curve at any stop", "0 of 62"]],
         fix="None needed yet; a third master at 550 would be the cure if these grow.",
         views=[{"g": "g", "ba": False, "comb": False}, {"g": "x", "ba": False, "comb": False}]),
    dict(W76, id="bold-open", sev="medium", status="open",
         title="The Bold beyond the letters is a first pass",
         body="Said plainly, what is not right yet. Ⱥ and ₩ thicken only their upright parts (a bar that crosses "
              "slanted strokes is read as a vertex; not solved). The dagger and ⌘ are the Regular's outline. "
              "An error of mine caught late: twelve glyphs with a slash through them (ȼ ɇ ⱥ Ⱦ ₡ @ ≠ and others) "
              "had points thrown thousands of units away where two near-parallel lines were made to meet, and my "
              "soundness check did not look at how far a point had moved. Instancing the font at 700 showed it. "
              "The rule is fixed and the check now fails on any point that moves further than a rule can move it. "
              "Their slanted strokes are thin in places still (₡, Ɇ, the radical). The number "
              "sign's slanted strokes come out uneven. The exclamation mark's top is 157 where the references' "
              "ratio gives 178, the less-than sign 65 for 75, and guillemets take the circumflex's ratios. The "
              "capital breves are 56 where their kind's stroke would be 64. Q's tail, breve, hook above and horn "
              "borrow a neighbour's measured ratio. 178 accents that charset.py placed by number follow their "
              "letter's outline; a check flags 12 whose middle moves 6 to 9% of the letter's width. Kerning in "
              "the Bold is the Regular's pairs with every collision opened to 13 units, not a fit made on the "
              "Bold. There is no part-by-part audit for marks, signs and composites as there is for the letters.",
         evidence=[["Glyphs on a fallback", "4 of 1,038 (Ⱥ ₩ † ⌘)"], ["Wedge marks on their measured width, height and stroke", "42 of 46"],
                   ["Accents with no anchor pair", "178 of about 600"], ["Pairs opened on the Bold's ink", "8,662"],
                   ["Bearings: mean change a side, lowercase / capitals", "-5.0 / -4.7"]],
         fix="Each is a rule still owed in bold.py; the list is in bold-master-plan.md.",
         views=[{"g": "#", "ba": False, "comb": False}, {"g": "!", "ba": False, "comb": False}]),
]
CHANGES += [
    ["0.76", "Masters", "one (Regular)", "two (Regular, Bold): AreaSerif[wght], 400 to 700", "bold.py, build.py"],
    ["0.76", "Lowercase / capital stem at Bold", "", "140 / 148", "bold.STEM, bold.THICK"],
    ["0.76", "Hairline / serif tip at Bold", "", "53 / 41", "bold.HAIR, bold.TIP"],
    ["0.76", "Regular", "0.75", "unchanged (0 glyphs differ)", ""],
]


# ---- Build 0.77: the owner's notes of 14 November 2026, written on the evaluation page on a phone.
BUILD = "0.77"
VERDICT = ("Build 0.77 answers your notes of 14 November. Fixed by rule, each with a check that fails on 0.76: the "
           "arrows' ragged tips, k's long stem foot, the 5's flag reaching past where the references end theirs, f "
           "standing too close to the dot of i and j when ligatures are off, and the thick-to-thin of a's bowl (with "
           "a new test of every closed counter). Ligatures were always in the font; this page's headline turned them "
           "off with letter-spacing, which is removed. Z and z measure inside the references on every lean test, so "
           "they are unchanged and the numbers are on their card. A single-storey g is in as an alternate. Three of "
           "your notes are answered here but not built yet and are listed as open: more serif-like plus, bar and "
           "dashes, Libre Baskerville's S s and $ as alternates, and the list of other alternates. The Bold from "
           "0.76 is unchanged in method and its open items stand.")
_WHY = {
    "corner-fillets": "By design: the softened corner is 7 units with a 3-unit handle, and in whole units a handle "
                      "that short cannot lie on an 8-degree edge; it is under one unit off and nothing renders it.",
    "balls-size": "By design: the sizes that differ are your own point edits of 11 November (r, y, g's ear) or follow "
                  "both references (J larger, f and j smaller).",
    "necks": "Withdrawn: my measurement compared an arch with a hairline. A neck is its own step on the ladder (32) and "
             "is checked on every join.",
    "c-e": "Withdrawn: my measurement read both letters at a slant. Across the stroke c and e are one value (51 and 50).",
}
for _f in FINDINGS:
    if _f["id"] in _WHY:
        _f["why"] = _WHY[_f["id"]]
    if _f["id"] == "k-foot":
        _f.update(status="fixed", build="0.77", title="k's stem foot was 96 where every other foot is 68",
                  after="0.77, on your note (\"if the k is not necessary/too long then feel free to shorten it\"): it "
                        "is the standard foot now, 70 from the stem. It had been left as drawn because it once ran "
                        "into the leg's foot; the two are 155 apart since the leg lost its left half. Georgia Pro "
                        "and Serrif give their k the standard foot on that side (74 beside 76, 81 beside 85). r's "
                        "foot is yours and is untouched.",
                  evidence=[["k's stem foot, right", "96 → 70"], ["Georgia Pro k / n", "74 / 76"], ["Serrif k / n", "81 / 85"],
                            ["r's right foot (yours, unchanged)", "130"]],
                  fix="normalize.normalize_feet (k's own line). Check: audit_charset.",
                  views=[{"g": "k", "ba": True, "comb": False}], prev="0.76")
    if _f["id"] == "bold-axis":
        _f.update(status="fixed", build="0.77", title="Along the axis: g's neck and x's thick stroke sat off their line between the masters",
                  after="Closed two ways. x's stroke leans differently in the two masters, so half way it was not the "
                        "mean of its two thicknesses; its Bold thickness gives up half of that, which leaves it "
                        "under a unit off at both ends. g's neck could not be held that way (the best place left it "
                        "1.7 over at the Bold and 1.8 under half way), so g and about twenty other glyphs with a "
                        "neck have a third, sparse master at weight 550. The letters' audit passes at all 13 stops.",
                  evidence=[["Stops audited", "13 (400 to 700)"], ["Parts on target at each stop", "416 of 416"],
                            ["Glyphs with a master at 550", "21"]])
N77 = {"prev": "0.76", "build": "0.77"}
FINDINGS += [
    dict(N77, id="arrow-tips", sev="medium", cls="Character set", status="fixed",
         title="Every arrow's point was a small zigzag",
         body="Your note: \"does uni21b5 arrow tip need to be fixed?\" Yes, and not only that one. An arrow's head was "
              "two strokes and a small triangle joined together, and the triangle's sides did not lie on the strokes' "
              "outer edges, so the point came out as three 12-unit steps. Twelve glyphs had it: the four arrows, the "
              "four diagonal ones, return, tab and its mirror, and the control key. The summation sign had a 3-unit "
              "dent of the same kind at its inner corner.",
         evidence=[["Glyphs with a ragged vertex", "13 → 0"], ["Steps at an arrow's point", "3 of 12 units → none"]],
         fix="charset.arrows (the head is one outline: outer edges meet in the point, inner edges in the crotch); "
             "charset._drop_dents. Check: audit_charset.scraps looks at every glyph for the same thing.",
         views=[{"g": "uni21B5", "ba": True, "comb": False}, {"g": "arrowright", "ba": True, "comb": False}]),
    dict(N77, id="fi-liga", sev="high", cls="Spacing", status="fixed",
         title="fi was not a ligature in this page's headline; and f stood 13 units from the dot when it is not one",
         body="Your note: \"shouldnt the fi be a ligature? are ligatures built and automatically applied?\" They are "
              "built (fi, ffi, fl, ffl, fj, ffj) and applied by default: set through HarfBuzz, \"fi ffi fl\" comes out "
              "as three ligatures. This page's headline had a small letter-spacing in its CSS, and browsers turn "
              "ligatures off for any text with letter-spacing. That is removed here. It also showed a real gap in "
              "the font: whenever ligatures are off (tracked text, some apps), f's ball stood 13 units from the dot "
              "of i and j, the least the collision pass allows. The references keep 17 and 71 there (Georgia Pro, "
              "Serrif; Libre Baskerville 30). The pair opens to their mean, 44; accented i keeps at least 16.",
         evidence=[["f to the dot of i, ligatures off", "13 → 44"], ["Georgia Pro, Serrif, Libre Baskerville", "17, 71, 30"],
                   ["f before ï, ì", "14 → 16 at least"], ["Ligatures in the font", "fi ffi fl ffl fj ffj, on by default"]],
         fix="spacing.f_before_dots; the page's CSS (no letter-spacing on text set in Area Serif). Check: audit_charset.",
         views=[{"g": "fi", "ba": False, "comb": False}], words="fine office fjord"),
    dict(N77, id="five-flag", sev="low", cls="Proportion", status="fixed",
         title="5: the flag reached further right than any reference's",
         body="Your note: \"5 and Z/z are leaning slightly to the right\". On the 5 I measured the stem's lean, where "
              "the ink's centre sits, and where the flag and the bowl end. One measure stood outside all three "
              "references: the flag ended 0.8% of the figure's height inside the bowl's right side, where theirs end "
              "2.2 to 3.7% inside. A flag that reaches as far as the bowl puts weight at the top right, which reads "
              "as a lean. It ends 19 units inside now (their mean). The stem's lean itself is 9.5 degrees, between "
              "Georgia Pro's 6.5 and Serrif's 9.9, and is your own choice from 12 November (\"copy serrif\"), so it "
              "stays; it is one number if you want it more upright.",
         evidence=[["Flag's end inside the bowl's right side", "6 → 19"], ["Georgia Pro, Serrif, Libre Baskerville", "21, 16, 27"],
                   ["Stem's lean, degrees (unchanged)", "9.5"], ["Georgia Pro, Serrif, Libre Baskerville", "6.5, 9.9, 14.5"]],
         fix="normalize.FIVE_FLAG_IN. Measure: tools/lean.py.",
         views=[{"g": "5", "ba": True, "comb": False}]),
    dict(N77, id="z-lean", sev="low", cls="Proportion", status="decided",
         title="Z and z: measured for a lean, and inside the references",
         body="The same note. For Z and z I measured the diagonal's angle, how far the top bar sits right of the "
              "bottom bar, the top half's centre against the bottom half's, and the ink's centre against the "
              "advance. Every one is inside the range of Georgia Pro, Serrif and Libre Baskerville. z's diagonal is "
              "the opposite of leaning: 32 degrees from upright where Serrif's and Libre Baskerville's are 35.5. "
              "The one thing I can point to: the ink of Z and z sits about 1% of their height (8 and 5 units) further "
              "right in their own box than in Georgia Pro and Serrif, though inside Libre Baskerville's. If they "
              "still read as leaning to you, the lever I would try first is the top bar's left end (it starts 8% of "
              "the height right of the bottom bar's; theirs 6.4 to 7.7%).",
         why="By design for now: no lean measure is outside the references, so nothing is changed without your eye on an option.",
         evidence=[["Z diagonal, degrees from upright", "34.6 (34.4, 35.6, 35.9)"], ["z diagonal", "32.1 (-, 35.6, 35.5)"],
                   ["Z top half's centre right of bottom half's, % of height", "10.3 (4.8, 12.3, 8.3)"],
                   ["z the same", "6.5 (4.2, 8.5, 9.3)"], ["Z ink centre right of its box's middle", "1.3 (0.5, -0.2, 1.1)"]],
         fix="None made. Measure: tools/lean.py.",
         views=[{"g": "Z", "ba": False, "comb": False}, {"g": "z", "ba": False, "comb": False}]),
    dict(N77, id="a-even", sev="medium", cls="Strokes", status="part",
         title="a's bowl: the stroke thinned, held, then thinned again",
         body="Your note: a's bowl \"looks a bit uneven from thick and thin at the very top left of the counter/bowl "
              "and the bottom left\". Measured round the counter (the stroke's thickness along the counter's normal, "
              "every 10 units): it swelled to 84 at the lower left, 6 heavier than a stem, fell quickly to 75, held "
              "between 75 and 69 for 70 units of arc up the left side, then fell again. That hold is what reads as "
              "uneven, and it sits where you saw it. Only the lengths of the counter's handles change (no node, no "
              "handle's direction, and nothing on the outer arc): the swell is 80 now and the stroke strays 2.2 "
              "units from one smooth change where it strayed 2.8. That is a real but modest gain, which is why this "
              "is marked partly fixed: to remove the hold altogether the counter needs a node where the outer arc "
              "has one, which is a redraw I have not done. For scale, the same measure on the references' a is 4.1 "
              "(Georgia Pro) and 4.6 (Libre Baskerville). The new test runs on every closed counter; R, 6, 9, D, B "
              "and g were evened by the same rule.",
         evidence=[["a: strays from one smooth change of thickness", "2.8 → 2.2"], ["a: thickest point of the bowl", "84 → 80"],
                   ["R / 6 / 9", "4.5 → 2.7 / 3.6 → 2.6 / 3.8 → 2.6"], ["D / B / g", "2.7 → 2.3 / 2.4 → 1.2 / 2.1 → 1.5"],
                   ["Not touched: b and p (one bowl, built by parts.py)", "3.0"]],
         fix="even.py (new): measure, rule and audit; in qa.py. It fails on 0.76 for a, R, 6 and 9.",
         views=[{"g": "a", "ba": True, "comb": True}, {"g": "R", "ba": True, "comb": False}, {"g": "6", "ba": True, "comb": False}]),
    dict(N77, id="g-alt", sev="low", cls="Character set", status="fixed",
         title="New: a single-storey g as an alternate",
         body="Your note: \"it would be nice to have an alternate, non decorative g\". It is made from finished parts, "
              "nothing drawn: the bowl and stem of q, cut at the baseline, running into j's tail under the stem. It "
              "keeps q's advance and kerns as q does. Turn it on with the stylistic set ss02 "
              "(font-feature-settings: \"ss02\"). It is a first build: its top is q's pointed corner, where a g "
              "often has a small ear or a flat, and it has not been looked at in text at small sizes.",
         evidence=[["Glyph / feature", "g.ss02 / ss02"], ["Parts", "q above the baseline, j below"]],
         fix="charset.single_g; derive.ALTS.",
         views=[{"g": "g.ss02", "ba": False, "comb": False}, {"g": "g", "ba": False, "comb": False}]),
    dict(N77, id="axis-all", sev="medium", cls="Weight", status="open",
         title="The weight axis, every glyph: failures outside the letters",
         body="The first sweep along the axis covered only the letters and figures, and missed twelve slashed glyphs "
              "with points thousands of units out. The new sweep (audit_axis.py) takes all 1,038 glyphs at every 25 "
              "units with checks that need none of the Regular's numbers. It found two real defects in letters, both "
              "fixed: the Bold a's bowl stroke pinched to 11 units where it meets the stem, and the foot of g's bowl "
              "to 5. It still fails outside the letters.",
         evidence=[["A curve gains an inflection", "43 glyphs (letters: W, g, x, one curve each)"], ["An outline gains a crossing", "26 glyphs"],
                   ["A stroke thinner than in the Regular", "36 glyphs (wedge accents' thin ends, signs)"],
                   ["Mean stroke steps back as weight rises", "3 (capital breves)"], ["A point moved further than a rule can move it", "0"]],
         fix="Each kind is a rule owed in bold.py; the glyph lists are in build/weight/audit-axis.txt.",
         views=[{"g": "x", "ba": False, "comb": False}]),
    dict(N77, id="signs-serif", sev="low", cls="Character set", status="open",
         title="For you, not built yet: plus, bar, slashes, dashes that feel more like the serif",
         body="Your note asks whether + | / _ and the dashes could be less plain. They are one stroke of 52 with "
              "square ends, on purpose: that is how Georgia Pro and Serrif draw theirs. Options I would draw for the "
              "whole group, by rule, and show in text beside the current ones: a slight flare at each end (the "
              "stroke 52 in the middle and 58 at its ends, the way the capitals' arms flare); the letters' own thick "
              "and thin (upright strokes at 52, level ones at the hairline's 43, as Baskerville-style maths signs "
              "do); and small bracketed ends on the bar and slashes only. None is drawn yet and the default will "
              "not change without your choice.",
         evidence=[["Stroke now", "52, square ends"], ["Georgia Pro / Serrif", "plain, square ends"]],
         fix="To do: draw the three options as alternates and show them in text.",
         views=[{"g": "+", "ba": False, "comb": False}, {"g": "/", "ba": False, "comb": False}]),
    dict(N77, id="s-alt", sev="low", cls="Terminals", status="open",
         title="For you, not built yet: Libre Baskerville's S, s and $ as alternates",
         body="Your note: you like Libre Baskerville's S, s and $ and ask what else would have to change. From the "
              "records: Area's S ends in an upright barb with a level cut and a small spur (0.54 to 0.58; the spur "
              "was your choice, \"it removes some visual weight\"), after your earlier note that S's serifs were "
              "\"too thick, long, and heavy\". The same end is on C and G, on s, and on the dollar and cent, and the "
              "ampersand, the figures 2 3 5 6 9 and c e use the ball or the plain cut. So a Libre Baskerville S "
              "would sit beside a C and G of a different family: for one design C and G would need the same end, "
              "and $ and ¢ follow S and c by rule. I have not yet measured its ends against Area's or built the "
              "alternates; they will be S, s, $ (and C, G) on Area's own stems and hairlines, in a stylistic set, "
              "beside the current ones in words. The defaults stay.",
         evidence=[["Letters with the barb-and-spur end", "C G S s $ ¢"], ["Recorded choice", "spur added in 0.55 (yours)"]],
         fix="To do: measure, build as alternates, show.",
         views=[{"g": "S", "ba": False, "comb": False}, {"g": "s", "ba": False, "comb": False}]),
    dict(N77, id="alts-survey", sev="low", cls="Character set", status="open",
         title="For you, not done yet: which other glyphs should carry alternates",
         body="Besides the single-storey g, the candidates a UI serif usually carries, with the reason for each: a "
              "single-storey a (pairs with the g for a plainer text; also what italics use); a 1 without a foot "
              "(already in, ss01) for tables; a slashed or dotted zero (O and 0 apart in codes and IDs); a y with a "
              "straight tail and a Q with a shorter one (tight line spacing); an R with a straight leg (less width "
              "before a following letter); a simpler ampersand. My recommendation is the short list a, 0, y, Q, in "
              "that order. Only the g is built.",
         evidence=[["Built", "g.ss02; one.ss01 (0.4x)"], ["Recommended next", "a, slashed 0, y, Q"]],
         fix="To do: show the candidates; build what you choose.",
         views=[{"g": "g.ss02", "ba": False, "comb": False}]),
]
for _f in FINDINGS:
    if _f["id"] == "bold-open":
        _f.update(title="The Bold beyond the letters is a first pass",
                  after="0.77: wedge accents now reach their kind's measured width, height and stroke (42 of 46). Ƙ has "
                        "a real Bold. Bold side bearings come from the references' own change (about -5 a side), not "
                        "a flat 0.80. fontbakery on the variable font: no FAIL. Still as described: Ⱥ and ₩ thicken "
                        "only their upright parts, the dagger and ⌘ do not thicken, the number sign and a few slashed "
                        "letters are uneven, the exclamation mark's top, guillemets and capital breves are light, "
                        "Bold kerning is the Regular's opened for collisions, and marks, signs and composites have "
                        "no part-by-part audit.")
    _f.setdefault("round", _f.get("build") or "0.70")
QA.append("0.77: audit_charset.py checks added (ragged vertices, f before a dot, k's foot): 15 errors on 0.76, 0 on 0.77. "
          "even.py (new): 4 errors on 0.76, 0 on 0.77.")
QA.append("0.77, the weight axis: audit_bold.py --sweep passes at all 13 stops (it failed on g and x in 0.76); "
          "audit_axis.py (all 1,038 glyphs) FAILS, see the open finding; fontbakery on the variable font: 0 FAIL, 1 WARN.")
CHANGES += [
    ["0.77", "Arrow points", "a zigzag of three 12-unit steps", "one point", "charset.arrows"],
    ["0.77", "k's stem foot, right", "96", "70", "normalize.normalize_feet"],
    ["0.77", "5's flag, inside the bowl's right", "6", "19", "normalize.FIVE_FLAG_IN"],
    ["0.77", "f to the dot of i and j, ligatures off", "13", "44", "spacing.F_DOT"],
    ["0.77", "a's bowl, strays from one smooth change", "2.8", "2.2", "even.py"],
    ["0.77", "Single-storey g", "", "g.ss02 (ss02)", "charset.single_g"],
]


# ------------------------------------------------------------------ build 0.78: the notes left open in 0.77
BUILD = "0.78"
VERDICT = ("Build 0.78 takes two of the three notes left open in 0.77. Libre Baskerville's S, s and $ are in as "
           "alternates (stylistic set 3); the defaults are untouched. The plain signs have three drawn options, "
           "shown in the figure sent with this build; the default is unchanged and the choice is yours. Still open: "
           "the list of other alternates shown with examples, the failures of the weight axis outside the letters, "
           "and the Bold beyond the letters. Nothing else in the Regular changed from 0.77.")
for _f in FINDINGS:
    if _f["id"] == "s-alt":
        _f.update(status="fixed", build="0.78", prev="0.77",
                  title="Libre Baskerville's S, s and $ are in as alternates (stylistic set 3)",
                  after="0.78: built. S and s are the base's own drawings taken through the general rules only "
                        "(weight, width, lightening), with none of the rules written for Area's S: no redrawn "
                        "width, no notch and spur, no trimmed barbs. One thing is brought to Area's ladder: the "
                        "spine, which in the base is a quarter heavier across itself. The $ is the base's own too, "
                        "because its ends are balls and not its S's barbs; its stroke is the capital hairline. All "
                        "three keep the defaults' side bearings and kerning. What I have not done: the $'s spine is "
                        "still the base's weight (the stroke through it hides the place the rule reads), s is the "
                        "base's width, 55 narrower than Area's, and C and G are not built to match, so in this set "
                        "S ends differently from C and G.",
                  evidence=[["S spine across itself, default / set 3", "96 / 95 (base as derived: 119)"],
                            ["s spine, default / set 3", "85 / 85 (base as derived: 106)"],
                            ["$ stroke", "47, the capital hairline"], ["s ink width, default / set 3", "379 / 324"],
                            ["Outline check", "0 errors, 2 warnings on s (a handle past its meeting point)"]],
                  fix="derive.ALTS, charset.base_s. Turn on with font-feature-settings: \"ss03\".",
                  views=[{"g": "S.ss03", "ba": False, "comb": False}, {"g": "s.ss03", "ba": False, "comb": False},
                         {"g": "dollar.ss03", "ba": False, "comb": False}])
    if _f["id"] == "signs-serif":
        _f.update(title="For you to choose: three options drawn for plus, bar, slash, underscore and the dashes",
                  body="Your note asks whether + | / _ and the dashes could be less plain. I measured how eight serif "
                       "faces draw them (tools/sign_ends.py): seven, both references among them, draw plain bars "
                       "with square ends and no swell; one (Lora) slants and tapers them. What does differ between "
                       "faces is weight: most make the hyphen heavier than the dashes. So the three options, each "
                       "from a part Area already has, drawn into small copies of the font and not into the build: "
                       "1, soft: every corner on the radius of the letters' cut ends (7). 2, weighted: soft, and "
                       "the hyphen 1.13 dashes (Georgia Pro 1.26, Serrif 1.00). 3, flared: soft, and each stroke "
                       "swells into its ends, from 52 to 66 over one bracket's reach. My recommendation is 1: it "
                       "is the letters' own corner, and at 13 to 16 px the three read the same, so the plainest is "
                       "the safest. Option 3 shows only at headline sizes, where it does feel nearer the serifs. "
                       "The figure is build/weight/sign-options.png, sent with this build.",
                  evidence=[["Faces with plain square bars", "7 of 8"], ["Stroke now", "52, sharp corners"],
                            ["Hyphen over dash: Georgia Pro / Serrif / Area", "1.26 / 1.00 / 1.00"]],
                  fix="tools/sign_options.py draws the three. The default changes only on your choice.")
    _f.setdefault("round", _f.get("build") or "0.70")
QA.append("0.78: S.ss03, s.ss03 and dollar.ss03 added; pathlint on them: 0 errors, 4 warnings.")
CHANGES += [
    ["0.78", "Libre Baskerville's S, s, $", "", "S.ss03, s.ss03, dollar.ss03 (ss03)", "charset.base_s"],
]
QA.append("0.78: every check passes except audit_axis.py (all glyphs along the weight axis), which FAILS as in 0.77: "
          "an inflection in 43 glyphs, a crossing in 26, a thin stroke in 36 (one more than 0.77: the new S.ss03), "
          "weight stepping back in 3.")


# ------------------------------------------------------------------ build 0.79: the owner's notes on 0.78
BUILD = "0.79"
VERDICT = ("Build 0.79 answers your six notes on 0.78. Built by rule, each with a check that 0.78 fails: soft corners "
           "on every plain stroke (the option you picked); the single-storey g rebuilt, whose bowl had been cut flat "
           "at the baseline; the 5's bowl, whose lowest point lay left of where both references and Area's own 3 "
           "have it; and the f ligatures, where the hook now runs over the i as it does in seven of eight faces. "
           "The alternate S and s are removed: measured, they had the default's form and differed only in width. "
           "The dollar with ball ends stays. Along the weight axis the letters and figures pass at every weight; "
           "outside them three kinds of failure are smaller and one is closed, and what still fails is listed on "
           "the axis card. Nothing is committed.")
N79 = {"prev": "0.78", "build": "0.79", "round": "0.79"}
for _f in FINDINGS:
    if _f["id"] == "signs-serif":
        _f.update(N79, status="fixed", sev="low",
                  title="Plain signs: soft corners, the option you picked, on every plain stroke",
                  body="You picked option 1 of the three drawn in 0.78. It is in the build as a rule, not as a list of "
                       "glyphs: a plain stroke is two straight, parallel edges ended by a straight cut, and every "
                       "such end outside the letters takes the radius the letters' own cut ends have (7). That "
                       "covers the hyphen and dashes, minus, plus, equals, underscore, bar, both slashes and the "
                       "fraction bar, the arrows, the square brackets' arms, the macron, and the bars struck through "
                       "letters and currency signs. A corner where two strokes meet (the inside of the plus) stays "
                       "sharp, as it does in the letters.",
                  after="155 glyphs, 370 ends, in the Regular; the Bold carries them. The radius is 7 along each "
                        "edge, the same number as a serif tip's. The slash's and fraction bar's corners are not "
                        "right angles (65.6 and 54.5 degrees), so the rule's corner range runs wider than the "
                        "letters' (54 to 126 against 70 to 125). At 13 to 16 px nothing is visible; it shows from "
                        "about 32 px.",
                  evidence=[["Plain stroke ends with sharp corners", "370 on 157 glyphs → 0"], ["Radius", "7, the letters' (derive.SOFT)"],
                            ["Stroke weights", "unchanged: 52, fraction bar 48"]],
                  fix="charset.soft_ends, last in normalize. Check: audit_charset (sharp_ends; and that the slash's "
                      "and fraction bars' stroke is still read after rounding). 0.78 fails it.",
                  views=[{"g": "hyphen", "ba": True, "comb": False}, {"g": "plus", "ba": True, "comb": False},
                         {"g": "slash", "ba": True, "comb": False}, {"g": "arrowright", "ba": True, "comb": False}])
    if _f["id"] == "s-alt":
        _f.update(N79, status="fixed",
                  title="The alternate S and s are removed: they were the default's form; the ball-end dollar stays",
                  body="Your note: you expected Libre Baskerville's S to differ in form the way its dollar does, and "
                       "said not to add S as an alternate if it does not. I measured S.ss03 and s.ss03 against the "
                       "default S and s, with an overlay (the figure 2 sent with this build).",
                  after="They had the default's form. Both S end in the same cut barbs top and bottom; the spine "
                        "across itself is 95 against 96 and 85 against 85 (0.78 thinned it to match); S is 5 units "
                        "narrower of 489 and s 55 of 379; the barbs are a little sharper. That is proportion and "
                        "weight, not form, so both are gone from the font. The dollar is a different form: the "
                        "base's ends in balls where the default's ends in barbs. It stays alone, and the set's "
                        "name in the font is now Ball-end dollar.",
                  evidence=[["S ink width, default / alternate", "489 / 484"], ["s ink width", "379 / 324"],
                            ["Spine across itself, S and s", "96 / 95, 85 / 85"], ["Ends of S and s", "barbs in both"],
                            ["Ends of the dollar", "barbs / balls"]],
                  fix="derive.ALTS (dollar.ss03 only), charset.base_s. Check: audit_charset fails if S.ss03 or "
                      "s.ss03 is in the font.",
                  views=[{"g": "dollar.ss03", "ba": False, "comb": False}, {"g": "dollar", "ba": False, "comb": False}])
    if _f["id"] == "g-alt":
        _f.update(N79, status="fixed", sev="medium",
                  title="Single-storey g: the bowl was cut flat at the baseline, and the tail was j's narrow hook",
                  body="Your note: \"the bottom of the g is flat for some reason\". The reason: 0.77 took q's top by "
                       "cutting q level at y = 2. q's bowl dips 10 units under the baseline, so the cut sliced its "
                       "bottom off and left a level edge 138 units long. Second, the tail was j's hook unchanged, "
                       "ending 0.66 of the bowl's width left of the stem's right edge. Measured on the three "
                       "faces that have the letter (Serrif's alternate, Source Serif's and Literata's U+0261), "
                       "each against its own q: the bowl is q's, whole (0.996, 1.000, 1.000 of its width); the "
                       "tail ends 0.973, 0.972 and 0.933 of the bowl's width to the left; its lowest point lies "
                       "0.510, 0.529, 0.515 across.",
                  after="Rebuilt as a splice of points, with no cut: q's outline from the top of its stem round the "
                        "whole bowl to the crotch, then j's tail. The tail keeps j's stem, its thickness at the "
                        "lowest point and its ball; only its reach changes (the ball moves left as one piece, "
                        "each curve keeps its handles' share), to 0.959 and 0.518, the three faces' means. The "
                        "Bold's g is spliced the same way from the Bold's q and j, so its bowl is the Bold q's: "
                        "0.78's Bold bowl, read by the general engine, was lighter than the q beside it.",
                  evidence=[["Level edge at the baseline", "138 → none"], ["Tail's end, share of the bowl's width", "0.657 → 0.959 (0.973, 0.972, 0.933)"],
                            ["Tail's lowest point", "0.388 → 0.518 (0.510, 0.529, 0.515)"], ["Depth against q's descender", "1.04 (1.04 to 1.06)"],
                            ["Bold bowl", "the engine's own → the Bold q's, point for point"]],
                  fix="charset.single_g, single_g_points; bold.bold_font splices the Bold's. Tool: tools/single_g.py. "
                      "Check: audit_charset (no level edge at the baseline, the bowl is q's, the tail's reach).",
                  views=[{"g": "g.ss02", "ba": True, "comb": False}, {"g": "q", "ba": False, "comb": False}])
    if _f["id"] == "axis-all":
        _f.update(N79, status="part",
                  title="The weight axis, every glyph: smaller in three kinds, closed in one, still failing",
                  after="0.79. New inflections: 43 glyphs to 18. A last guard on every curve of the Bold and of the "
                        "sparse master (bold.fix_turns) uses the audit's own count and brings a curve back by the "
                        "smallest change that passes: a shorter handle, then, only at a corner or between two "
                        "curves, a turned one. W and g are fixed. x is not: on its top-left serif the diagonal's "
                        "edge and the serif's underside leave no room for a curve that bends one way; that is a "
                        "fault in where the Bold puts the edge, not in the curve. Crossings: 26 to 18. Two inks "
                        "that stand side by side never come closer than 13 (the double quotes, the dots below, "
                        "the tab arrow's bar), and fi's bar joins the i. Still crossing: struck letters, the "
                        "ampersand and at sign at 625 and over, the double accents over capitals, TM and SM. Thin: "
                        "36 to 30; 24 of the 30 are the thin ends of wedge accents, 1 to 5 units under the "
                        "Regular's, which I tried to hold and could not without losing their measured weight. "
                        "Stepping back: closed (the capital breves, by swelling in small steps).",
                  evidence=[["A curve gains an inflection", "43 → 18 glyphs (letters: x)"], ["An outline gains a crossing", "26 → 18"],
                            ["A stroke thinner than in the Regular", "36 → 30 (24 are accents' thin ends)"],
                            ["Mean stroke steps back as weight rises", "3 → 0"], ["Letters and figures, 13 weights", "415 of 415 parts on target at each"],
                            ["Glyphs with no real Bold", "4: Ⱥ † ₡ ⌘ (₩ has one now; ₡ lost its own)"]],
                  fix="bold.fix_turns, keep_apart, stretch (steps of 1.5). audit_axis.py still exits 1; the lists are "
                      "in build/weight/audit-axis.txt.",
                  views=[{"g": "W", "ba": False, "comb": False}, {"g": "x", "ba": False, "comb": False}])
FINDINGS += [
    dict(N79, id="five-bowl", sev="medium", cls="Proportion", status="fixed",
         title="The 5's bowl leaned: its lowest point lay left, and its inside was widest above its outside",
         body="Your note: the bottom of the 5 still leans to the right after 0.77 moved its flag. Measured on the "
              "bowl of every face (tools/five_bowl.py). The outer edge's lowest point lay 0.365 of the bowl's width "
              "from its left, where Georgia Pro has 0.446, Serrif 0.468 and Area's own 3 0.452: from there the edge "
              "ran up to the right in one long slope. And the counter's rightmost point stood at 0.602 of the "
              "bowl's height where the outside's stood at 0.553 (Georgia Pro 0.531 and 0.535, Serrif 0.469 and "
              "0.514), which puts the heaviest part of the stroke low on the right: seen from the bowl's middle, "
              "5 degrees under level, where all eight other faces have it 10 to 30 above. The base's own 5 has "
              "the counter the same way; the lean given to the upright stroke in 0.33 made it show.",
         after="The three points are at the two references' means, each moved along the edge it is an extreme of, "
               "handles keeping their share of their curves. The ball, the upright stroke, the flag and the bowl's "
               "width and height are unchanged. The heaviest part is now 10 degrees above level. 3 measured inside "
               "the references on all of these and is unchanged; 6 and 9 are closed bowls and were looked at, not "
               "changed.",
         evidence=[["Lowest point, share of the bowl's width", "0.365 → 0.457 (0.446, 0.468; 3: 0.452)"],
                   ["Outside widest, share of the bowl's height", "0.553 → 0.525 (0.535, 0.514)"],
                   ["Counter widest", "0.602 → 0.500 (0.531, 0.469)"], ["Heaviest direction, degrees", "-5 → +10 (others +10 to +30)"],
                   ["Stroke under the bowl over stroke at the side", "0.62 → 0.55 (0.42, 0.39)"]],
         fix="clean.five_bowl, after five_heel. Check: audit_charset (lowest point; counter not widest above the outside).",
         views=[{"g": "five", "ba": True, "comb": False}, {"g": "three", "ba": False, "comb": False}]),
    dict(N79, id="fi-hook", sev="high", cls="Character set", status="fixed",
         title="fi: f's hook stopped a stem short of the i, with nothing where the dot was",
         body="Your note: should f's top reach further toward the i, so the end of the hook sits almost over the "
              "dot? Yes. Measured on eight faces with HarfBuzz (tools/ligatures.py), each in its own stems. With "
              "ligatures on, seven draw fi as one glyph with no dot, and the hook's end stands past the middle of "
              "the i's stem by 0.31 to 0.63 (Georgia Pro 0.41, Serrif 0.43); they also bring the two stems closer "
              "than the letters set apart (Georgia Pro 3.18 against 3.58 stems, Serrif 3.66 against 4.15). "
              "Area's fi was the plain f and a dotless i at their ordinary fit: the hook ended 0.99 of a stem "
              "before the i's stem, so it read as f and a dotless i. With ligatures off, f and i measure inside "
              "the references (hook 1.29 stems before the dot's centre against 0.84 to 1.46; 0.56 clear of it "
              "against 0.17 to 0.79) and are unchanged.",
         after="In fi, ffi, fj and ffj the last f's hook is lengthened by rule (the ball moves as one piece, the "
               "arc's two highest points keep their share of it, the stem and bar stay) until its end is 0.42 of a "
               "stem past the second letter's stem centre. The second letter stands at 0.885 of its unligated "
               "distance, and f's bar runs into its flag, as it already ran into t and a second f.",
         evidence=[["Hook's end from the i's stem centre, stems", "-0.99 → +0.42 (0.41, 0.43)"],
                   ["Stem to stem, ligature over letters apart", "0.915 → 0.885 (0.888, 0.882)"],
                   ["Faces whose fi keeps a dot", "1 of 8"], ["Ligatures off", "unchanged, inside the references"]],
         fix="charset.f_hook, lig_offset, ligatures. Check: audit_charset (hook's end on fi, ffi, fj, ffj).",
         views=[{"g": "fi", "ba": True, "comb": False}, {"g": "f_f_i", "ba": True, "comb": False}, {"g": "f_j", "ba": True, "comb": False}]),
    dict(N79, id="lig-pass", sev="medium", cls="Character set", status="fixed",
         title="Every f ligature: a step where the arc met a tall letter; Bold sides off by 4 and 22",
         body="A pass over all fifteen (fi fl ff ffi ffl, and fb fh fk fj ft with their ff forms). Construction: "
              "where f's arc runs into l, b, h or k, the bridge left the arc 15 units before its top, ran 6 under "
              "the ascender line and stopped at the stem's near edge, so the stem's slanted top stood over it as "
              "a 10-unit step. Sides: in the Regular every ligature's left side is f's and its right side its "
              "last letter's; in the Bold every one was 4 wider than f on the left and ff 22 wider on the right, "
              "because the Bold treated them as glyphs of their own. Kerning classes: all fifteen kern as f on "
              "the left and as their last letter on the right; nothing to fix.",
         after="The arc is cut at its highest point and runs level at the ascender's top across the whole stem: "
               "one edge. The Bold's ligatures take their letters' sides, at 700 and at the sparse master. Looked "
               "at, Regular and Bold, on and off, at 13, 16, 32 and 100 px (figure 5). Not redrawn: ff and ft, "
               "which measured and looked right. Not checked: the ligatures' own inside spacing in the Bold "
               "against the references' Bold.",
         evidence=[["Step at the top of fl fb fh fk and their ff forms", "10 → 0"], ["Bold sides off their letters'", "15 of 15 → 0"],
                   ["Kerning classes as the letters'", "15 of 15"], ["Crossings along the axis in fi ffi fj ffj", "none"]],
         fix="charset.f_join; bold.bold_font (ligature sides). Check: audit_charset (top level; sides in both "
             "masters; classes).",
         views=[{"g": "fl", "ba": True, "comb": False}, {"g": "f_h", "ba": True, "comb": False}, {"g": "f_f_l", "ba": True, "comb": False}]),
]
for _f in FINDINGS:
    if _f["id"] == "bold-open":
        _f.update(build="0.79", round="0.79",
                  after="0.79: still open. Four glyphs have no real Bold: Ⱥ and ₡ thicken only their upright "
                        "parts, † and ⌘ are the Regular's outline at every weight (₩ has a real Bold now; ₡ fell "
                        "back when its bars got round ends). Bold kerning is the Regular's pairs opened for "
                        "collisions, not fitted against the references' Bold. There is no measured audit for marks, "
                        "signs and composites in the Bold. The Bold's plain signs are barely heavier than the "
                        "Regular's level strokes (figure 1).")
    _f.setdefault("round", _f.get("build") or "0.70")
CHANGES += [
    ["0.79", "Plain stroke ends, sharp", "370 on 157 glyphs", "0 (radius 7)", "charset.soft_ends"],
    ["0.79", "Alternates in ss03", "S, s, dollar", "dollar", "derive.ALTS"],
    ["0.79", "g.ss02: tail's end, of the bowl's width", "0.657, bowl cut flat", "0.959, q's whole bowl", "charset.single_g"],
    ["0.79", "5: bowl's lowest point; counter's widest", "0.365; 0.602", "0.457; 0.500", "clean.five_bowl"],
    ["0.79", "fi ffi fj ffj: hook past the stem centre", "-0.99 stems", "+0.42", "charset.f_hook"],
    ["0.79", "f into l b h k: step at the top", "10", "0", "charset.f_join"],
    ["0.79", "Axis, all glyphs: turns / crossings / thin / stepping back", "43 / 26 / 36 / 3", "18 / 18 / 30 / 0", "bold.fix_turns, keep_apart"],
]
QA.append("0.79: targets, outlines, parts audit, joins and bowls, evenness, Bold audit (415 of 415), the letters' "
          "axis sweep (13 stops), interpolatable, character set (with the new checks), fontbakery on both fonts: "
          "pass. audit_axis.py (all glyphs along the axis) FAILS: an inflection in 18 glyphs, a crossing in 18, a "
          "thin stroke in 30; stepping back and moved points pass.")
NOT_CHECKED.append("0.79: the soft corners were looked at on the signs in the figure and at 13 to 32 px, not on each of "
                   "the 155 glyphs. The single-storey g and the new fi were not set beside the references' in running "
                   "text. Nothing was rendered on Windows.")


# ------------------------------------------------------------------ build 0.80: the owner's notes on 0.79
BUILD = "0.80"
VERDICT = ("Build 0.80 answers your notes on 0.79. The single-storey g's tail is redrawn as its own round part; the "
           "ball-end dollar is the one dollar; every serif was measured at five weights, which found one real fault "
           "(the bracket under n's and k's flag) and fixed it; and there is a Light master, so the weight axis runs "
           "from 300 to 700. Alternate candidates are drawn as a figure and written up, none in the font. Along the "
           "axis every letter and figure is on target at the Light, the Bold and between; outside them the Bold "
           "side fails as in 0.79 and the Light side adds a shorter list of its own, both on the axis card.")
N80 = {"prev": "0.79", "build": "0.80", "round": "0.80"}
for _f in FINDINGS:
    if _f["id"] == "g-alt":
        _f.update(N80, status="fixed",
                  title="Single-storey g: the tail was a flat tray with a knob; redrawn as four quarter turns",
                  body="Your note on 0.79: the tail is not smooth or round and looks off. What was wrong: 0.79's tail "
                       "was still j's hook with its points slid sideways. Its inside ran level for 70 units and then "
                       "turned into the ball within 41 units of height, and the ball sat as low as j's: its top 0.187 "
                       "of the x-height under the baseline, where the three faces with this letter have 0.121, 0.158 "
                       "and 0.134. The tail was also thicker at its lowest point than theirs (1.10 of the round "
                       "letters' hairline against 0.97, 1.00, 0.92).",
                  after="The tail is its own part: four quarter turns between five fixed places (the stem's two edges, "
                        "the lowest point outside and inside, the ball), each with its handles at 0.55 of its side, "
                        "a quarter of an ellipse, so no stretch is level or straight. The ball is j's, moved whole: "
                        "its top to 0.138 of the x-height under the baseline. The tail is 0.963 of the hairline at "
                        "its lowest point. Along the weight axis the ball's top and the lowest point follow the "
                        "stem, to the values Source Serif 4 and Literata have at 700 (0.120; 0.560 of the bowl's "
                        "width). Not done: g.ss02 before j still touches (the pair is not kerned).",
                  evidence=[["Ball's top under the baseline, of the x-height", "0.187 → 0.138 (0.121, 0.158, 0.134)"],
                            ["Level run inside the tail", "70 → none"],
                            ["Thickness at the lowest point, of the hairline", "1.10 → 0.96 (0.97, 1.00, 0.92)"],
                            ["Bold: ball's top; lowest point", "0.135; 0.518 → 0.120; 0.560"]],
                  fix="charset.single_g_points (G_BALL_TOP, G_TAIL_THICK, G_ROUND and the Bold's pair). Measured by "
                      "tools/single_g.py.",
                  views=[{"g": "g.ss02", "ba": True, "comb": False}])
    if _f["id"] == "s-alt":
        _f.update(N80, status="fixed",
                  title="One dollar: the ball-end one; stylistic set 3 is gone",
                  body="Your note on 0.79: choose one dollar, the rounded one. 0.79 had two: the default, built in "
                       "0.71 from the finished S (barb ends) and a stroke, and Libre Baskerville's own drawing with "
                       "ball ends as stylistic set 3.",
                  after="The ball-end drawing is the default dollar and there is no ss03. Its stroke is the capital "
                        "hairline, as before. The Light and the Bold carry it by rule (no fallback).",
                  evidence=[["Dollars in the font", "2 → 1"], ["Stylistic sets", "ss01, ss02, ss03 → ss01, ss02"]],
                  fix="charset.letter_signs (the dollar is no longer the S and a stroke); derive.ALTS. Check: "
                      "audit_charset (no dollar.ss03; the dollar is not the S's points).",
                  views=[{"g": "dollar", "ba": True, "comb": False}])
    if _f["id"] == "axis-all":
        _f.update(N80, status="open",
                  after="0.80. Bold side, unchanged: an inflection in 18 glyphs (x among them), a crossing in 18, a "
                        "part thinner than the Regular's in 30 (24 are accents' thin ends). Light side, new: an "
                        "inflection or a crossing in 8 (Ⱥ, †, ₩, the hooked G and W, the L with a tilde, ⌃) and a "
                        "part that thins faster than a serif tip in 18 (asterisk, small 6 and 9, ™, ℠, both "
                        "daggers, the comma accent and others). The first Light build had 31 of those: its accents "
                        "were thinned evenly, which takes more from a tapered end; a mark now stops thinning at the "
                        "tip's ratio. Moved points, weight stepping the wrong way and composites pass on both sides.")
    if _f["id"] == "bold-open":
        _f.update(N80,
                  after="0.80: still open. No real Bold for Ⱥ, †, ₡, ⌘; no real Light for ₡, the four diagonal "
                        "arrows and one combining comma. Kerning at the Light and the Bold is the Regular's pairs "
                        "opened for collisions, not fitted. No measured audit for marks, signs and composites away "
                        "from the Regular. The Bold's plain signs are barely heavier than the Regular's.")
FINDINGS += [
    dict(N80, id="flag-under", sev="medium", cls="Serifs", status="fixed",
         title="Serifs at five weights: one fault, the bracket under n's and k's flag",
         body="Your note: the serifs may need extra examination, each form, to see that they scale accurately and "
              "consistently. Every foot serif and flag of the letters was measured the same way at 300, 400, 500, "
              "600 and 700: its tip, its reach, its thickness half way in and the height where the bracket ends. "
              "Tips and brackets came out one value per kind at every weight, within half a unit. One real fault: "
              "under the flag of n and k the bracket was two curves (a short level run, then a quarter turn 26 "
              "units smaller) where i, j, m, p, r, u, b, d, h and l have one. Those two flags stood 74 tall at the "
              "stem against 92, at every weight.",
         after="n's and k's flags (and eng's) take i's one curve. All serifs of a kind now agree at every weight: "
               "lowercase feet tip 23.0, 30.0, 33.0, 36.6, 41.0 from 300 to 700 and reach 69, 68, 67, 66, 64; "
               "capital feet the same tips and reach 76 to 71; flags 86, 93, 96, 99, 103 tall. Against the Regular "
               "the tip is 0.77 at the Light and 1.36 at the Bold; four open references with a weight axis run 0.71 "
               "to 0.87 and 1.12 to 1.51. The reach is 1.01 and 0.94; theirs 0.97 to 1.13 and 0.72 to 0.94. Left as "
               "they are, by earlier decisions: the longer bowl-side foot of f, p and q, and r's long right foot.",
         evidence=[["Flags off their kind's height, five weights", "10 (n and k) → 0"],
                   ["n's and k's flag at the stem", "74 → 92 (the others' 92)"],
                   ["Tip, Light and Bold over Regular", "0.77, 1.36 (references 0.71 to 0.87, 1.12 to 1.51)"],
                   ["Spread of the tip within a kind", "0.3 or less at every weight"]],
         fix="clean.flag_unders. Checks: audit_charset (no two-curve underside); tools/serif_axis.py (exit 1 on "
             "any serif off its kind's median).",
         views=[{"g": "n", "ba": True, "comb": False}, {"g": "k", "ba": True, "comb": False}]),
    dict(N80, id="light", sev="medium", cls="Weight", status="open",
         title="A Light master: the axis runs 300 to 700; letters on target, the rest not finished",
         body="Your note: develop lighter weights as well. The Light is made as the Bold is, from the Regular's own "
              "points by the same rules, run below the Regular. Its targets are measured on six faces that have a "
              "Light (Georgia Pro, Serrif, Source Serif 4, Literata, Newsreader, Merriweather), Light over Regular: "
              "stems 0.63, 0.79, 0.58, 0.76, 0.67, 0.77 (mean 0.70); o's hairline mean 0.82; H's bar 0.80; a "
              "serif's tip 0.82; i's dot 0.78; n's advance 0.98. Thin parts do not follow the Bold's rule in "
              "reverse: a Bold's hairline gains little, a Light's gives up most of what the stem does, so thin "
              "parts take 1.72 times the thick parts' share of the step.",
         after="Stem 78 to 55. Every letter and figure is on its target at the Light: 415 parts of 415. Open: 8 "
               "glyphs with an inflection or crossing and 18 with a part that thins too fast (the axis card); six "
               "glyphs on a fallback; kerning not fitted; the weights between 300 and 400 were checked on every "
               "glyph for kinks, crossings and thin strokes but not part by part against targets.",
         evidence=[["Light stem", "55 (0.70 of 78, six faces' mean)"], ["Parts on target at the Light", "415 of 415"],
                   ["Axis", "400 to 700 → 300 to 700"], ["Glyphs on a fallback at the Light", "6"]],
         fix="bold.vector (LIGHT_STEM, LIGHT_THIN), bold.axis_map, bold.variable, build.variable. Checks: "
             "audit_bold.py 55; audit_axis.py (Light side). Measured by tools/light_refs.py.",
         views=[{"g": "n", "comb": False}, {"g": "a", "comb": False}, {"g": "H", "comb": False}]),
]
for _f in FINDINGS:
    _f.setdefault("round", _f.get("build") or "0.70")
CHANGES += [
    ["0.80", "g.ss02: ball's top under the baseline; level run inside", "0.187; 70", "0.138; none", "charset.single_g_points"],
    ["0.80", "Dollars", "barb-end default + ball-end ss03", "ball-end, one", "charset.letter_signs"],
    ["0.80", "Flag at the stem, n and k", "74", "92", "clean.flag_unders"],
    ["0.80", "Serifs off their kind's median at 300 to 700", "10 (n's and k's flags)", "0", "tools/serif_axis.py"],
    ["0.80", "Weight axis", "400 to 700", "300 to 700 (Light stem 55)", "bold.vector, bold.variable"],
    ["0.80", "Light: parts on target, letters and figures", "no Light", "415 of 415", "audit_bold.py 55"],
]
QA.append("0.80: targets, outlines, parts audit, joins and bowls, evenness, Bold audit (415 of 415), Light audit (415 "
          "of 415), the letters' axis sweep 400 to 700, interpolatable, character set, fontbakery on both fonts, "
          "serifs along the axis (0 off): pass. audit_axis.py (all glyphs) FAILS: Bold side as 0.79 (18, 18, 30); "
          "Light side an inflection in 5 glyphs, a crossing in 5, a thin part in 18.")
NOT_CHECKED.append("0.80: the Light between 300 and 400 was not audited part by part. The Light's kerning and its "
                   "marks' sizes were not measured against the references' Light. The alternate candidates are "
                   "Regular only and unkerned. g.ss02 before j touches. Nothing was rendered on Windows.")


# ------------------------------------------------------------------ build 0.81: three branches merged and closed
BUILD = "0.81"
DATE = "15 November 2026"
VERDICT = ("Build 0.81 merges three pieces of work and closes them by rule. The g's loop is rebuilt and g.ss02, j, y "
           "and the a's exit share one tail rule; the alternates are in the font as stylistic sets; along the weight "
           "axis struck letters are overlapping strokes, signs are arms with one weight law, white between parts is "
           "held like a counter, and tapering strokes keep each place's own share of the weight; kerning is fitted per "
           "weight. What is still open is on the axis card: @ and the capital hook above in the Bold, and Ⱥ and the T "
           "with a diagonal stroke, which wait for your decision.")
N81 = {"prev": "0.80", "build": "0.81", "round": "0.81"}
for _f in FINDINGS:
    if _f["id"] == "axis-all":
        _f.update(N81, status="open",
                  after="0.81. The axis is now tested exactly over every pair of masters, not at stops. Bold side: "
                        "@ (the a's bowl running into the ring thins, 29 > 17 at 550) and the capital hook above "
                        "(its curl closes at 552) fail; Ⱥ and the T with a diagonal stroke are held for your "
                        "decision (honest overlap or stump form). Light side: nothing fails. Every part of the "
                        "letters and figures is on target at the Light and the Bold (434 of 434).")
    if _f["id"] == "bold-open":
        _f.update(N81,
                  after="0.81: no glyph is on a fallback at either end. Kerning is fitted per weight. Open: no "
                        "measured audit for marks, signs and composites away from the Regular.")
CHANGES += [
    ["0.81", "g's loop: worst curvature ratio across a node", "1.56", "1.13", "loops.g_loop"],
    ["0.81", "Tails j y g.ss02 and a's exit: curvecheck faults", "j 1, y 5, g.ss02 1", "0", "loops.round_tail"],
    ["0.81", "Alternates in the font", "none (candidates)", "ss01 to ss06, zero; 63 glyphs", "alternates.py"],
    ["0.81", "audit_axis.py, Bold / Light glyphs (exact test)", "45 / 26 (0.80 masters)", "2 + 2 held / 0", "axis 0.81"],
    ["0.81", "eng's tail at 300, of the Regular", "0.667", "0.694 (stem 0.705)", "white.keep_taper"],
    ["0.81", "g.ss02: ball to bowl at 700", "38", "52 (white law)", "charset.single_g_points"],
    ["0.81", "Asterisk at 700: cap on its weight", "f 1.199", "f 1.286 (arms reach 1.047)", "arms.REACH"],
    ["0.81", "Kerning", "the Regular's at every weight", "fitted per master", "spacing.kern_master"],
]
QA.append("0.81: see typefaces/area-serif/build/qa-081.log (full qa.py from a clean build).")
NOT_CHECKED.append("0.81: overlaps were rendered on FreeType and CoreText, not on Windows. The weights between the "
                   "masters were checked by every audit at 25-unit stops (rays and kerning at 325 to 650 too) and by "
                   "eye on a waterfall; the alternates were not set beside the references' in running text.")
