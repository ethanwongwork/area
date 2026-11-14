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
