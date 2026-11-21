"""Area Serif 0.82 (owner round 8, item 9): the ampersand, one construction run in every master.

The owner, on the symbols at 300 / 400 / 550 / 700: "the ampersand needs a lot of work". Measured on the Regular
(build/owner8/sym/ampmeasure.py, numbers only from the references): its diagonal 90 across (v's thick 74, the
references 0.90 to 1.07 of their stem), the loop's top 62 (the hairline 43; references 0.41 to 0.59 of the stem), the
loop's right side 79 (references 0.68 to 0.83), the lower bowl's left 93 (o's side 82), the upper counter 0.45 of the
lower in area (references 0.55 to 0.79) and 59 right of the lower counter's centre (references +1 to +49, median +12).
In the masters the engine read it as loose parts: at the Bold its upper counter was 69 across (references 134 to 166)
and the bowl's stroke into the diagonal thinned 48.8 > 30.8 between 400 and 700.

The construction. The ampersand is one stroke and an arm. The stroke runs from the tail's tip up the diagonal, round
the loop (up its left side, over the top, down its right side), down the spine across the diagonal, round the lower
bowl (its left side, its bottom) and into the diagonal again. Its two edges are each one smooth chain of curves:

  P (the stroke's left-hand edge): tail underside, the diagonal's lower edge (a line), the loop's outside, the spine's
    lower edge, the lower counter (its left side and bottom) to the crotch on the diagonal
  Q (the right-hand edge): tail top, the diagonal's upper edge (a line), the loop's inside, the spine's upper edge, the
    lower bowl's outside (its left side and bottom) to the corner on the diagonal

The outline is where the ribbon crosses itself (the corners J, K, J2, C1 at the crossing; C2 and X1 where the bowl
runs into the diagonal) and where the arm leaves the diagonal (X2, X3). Every corner is the meeting of two edges,
found, not placed.

Weights, from the letters of the same master (`readings`): the diagonal is v's thick stroke; the loop's left side and
the bowl's left side o's side (the round thick); the loop's top and the spine where it crosses o's hairline (top);
the loop's right side the mean of the two (the references' 0.68 to 0.83 of their stem: the stroke runs from the top's
hairline down into the spine's); the bowl's bottom and the tail's lowest place n's arch at its top (the ladder's 50,
as a's lower stroke takes it: a bottom that runs up into a stem); the arm v's thin stroke, ending in v's serif on its
thin arm, point for point (the arm is a thin up-right diagonal, as v's is, and every reference but Literata ends it
level). Positions: stroke centres at the extremes, the diagonal's and the arm's centrelines (REG). Each curve has a
node at its extremes and at the spine's inflection; every handle length is solved so the curvature is one value on
both sides of each smooth node and a curve leaves a straight at under 0.45 of its tightest (curvecheck's limits).

In a master (`master`) the same construction is run with that master's letters' weights; the skeleton is stretched
level so that the loop's counter changes across as o's counter does (the white law's own letter); heights stay.
The 550 instance is the construction at the readings half way (the Bold's mid layer).
"""
import math

import numpy as np
from scipy.optimize import minimize

LIB = "area.amp"

# ------------------------------------------------------------------ the Regular skeleton (units; derivation beside)
# x of a centre is where the stroke's middle sits at that extreme; y likewise. Outer and inner extremes are the
# centre less and more half the stroke.
REG = {
    # the diagonal: centreline through (x, 250), leaning `diag_deg` from upright (the Regular's drawn 37.2: kept)
    "diag_x": 396.0, "diag_deg": 37.0,
    # the loop: its counter centred over the lower counter (the references' median +12, measured +1 to +49 at 400),
    # its extremes' heights the drawn ones'
    "ul": (163.0, 600.0),             # left extreme's centre
    "ut_x": 308.0,                    # top's centre x (outer top on the cap overshoot 721)
    "ur": (439.0, 576.0),             # right extreme's centre
    # the spine where it crosses the diagonal: its centre (its inflection) on the diagonal's centreline at this height,
    # and its direction there (degrees below level, running down-left)
    "sp_y": 380.0, "sp_deg": 28.0,
    # the lower bowl
    "ll": (79.0, 160.0),              # left extreme's centre (outer on 38, the drawn left side)
    "lb_x": 236.0,                    # bottom's centre x (outer bottom on -9, the lowercase overshoot... the drawn)
    "c2_y": 122.0, "c2_deg": 40.0,    # the counter's bottom meets the diagonal: height on its lower edge, arrival angle
    "x1_y": 92.0, "x1_deg": 32.0,     # the bowl's outside meets the diagonal's lower edge
    # where the diagonal's straight edges turn into curves
    "p1_y": 450.0,                    # lower edge into the loop's outside
    "p2_y": 440.0,                    # upper edge into the loop's inside
    "p3_y": 70.0,                     # lower edge into the tail's underside
    "p4_y": 165.0,                    # upper edge into the tail's top
    # the tail
    "tb_x": 655.0,                    # underside's lowest (on -9; 640 drawn, out 15 so the curve eases off the diagonal)
    "tt_x": 678.0,                    # top's lowest (bottom + the tail's weight)
    "t1": (774.0, 104.0), "t1_dir": (12.0, 68.0),    # the cut end: underside's end and its direction (drawn)
    "t2": (754.0, 110.0), "t2_dir": (20.0, 42.0),    # top's end
    # the arm: its centreline through (x, 355), its direction (dx, dy) (drawn: 34.5 degrees from upright)
    "arm_x": 631.0, "arm_dir": (0.5664, 0.8241), "arm_top": 434.0,
    "top": 721.0, "bottom": -10.0,   # 0.84: the bowl's and the tail's bottom on o's overshoot line
    # 0.82 (owner round 8, item 19): the loop is placed by LOOP's rule (`loop_rule`); ul, ur, ut_x, p1_y, p2_y above
    # are only its first guess
    "loop": "A",
    # 0.84 (Regular pass 2, item 1): the counter's bottom stands 8 right of the outside's, so the stroke's width falls
    # all the way from the bowl's left side (82) to the arm (39) with no trough before the bottom (at 0 a 0.3 trough and
    # rise at the bottom; 8 and 16 tried, 8 the least that clears it)
    "lb_di": 8.0,
    # each edge's turn off the diagonal's straight runs twice the circle's height (an Euler spiral turning theta up to
    # the quarter's curvature k runs 2 theta / k, twice the circle's arc): the curvature rises from the straight's ease
    # to the quarter's with no peak between (at 1.0 the Light's counter took a 1.47 jump at its left extreme)
    "ease1": 2.0, "ease2": 2.0,
}

# 0.83 (Regular pass, item C; refstudy/spec.md medians of Georgia Pro, Serrif, PP Kyoto): the ink 0.98 of the cap
# (it was 1.03: the skeleton's x narrowed by 0.952 about its left), the diagonal 50.5 degrees from level (it was 53),
# the spine's crossing raised so the loop's foot stands at 0.61 of the cap and the bowl's counter top at 0.51 (0.59 /
# 0.48: 18 units)
def _study_skeleton(G, k=0.952, deg=39.5, rise=18.0):
    G = dict(G)
    for key in ("diag_x", "ut_x", "lb_x", "tb_x", "tt_x", "arm_x"):
        G[key] = G[key] * k
    for key in ("ul", "ur", "ll", "t1", "t2"):
        G[key] = (G[key][0] * k, G[key][1])
    G["diag_deg"] = deg
    G["sp_y"] = G["sp_y"] + rise
    return G


# REG = _study_skeleton(REG)   (0.83 item C, second pass: not applied; Area keeps its own proportions)

# 0.82 (owner round 8, item 19): the loop, by rule. Measured on the references (build/owner8/r9/refloop.py, refamp.py,
# measure only) at 400 and 700, carried to Area's stems 78 and 140 on the stem's logarithm (the Light takes the 400's):
#   share   the outer left extreme's height in the upper counter's span (medians 0.52 / 0.46; Libre Baskerville 0.48 /
#           0.46); 0.70 in the 0.82 drawing, which put the left side's thick next to the top
#   kappa   the outer upper-left quarter's width over its height (medians 1.14 / 1.20, Libre Baskerville 0.88 / 0.97);
#           1.50 / 1.78 in the 0.82 drawing (the flat lid)
#   il_min  the counter's upper-left quarter, width over height, the references' least (Libre Baskerville 0.65 / 0.70):
#           the outer quarter widens before the counter pinches
#   right   the loop's right side over its left (medians 0.895 / 0.89; the 0.82 drawing 0.84 / 0.74)
#   left    the loop's left side over the diagonal across (refdiag.py: medians 0.88 / 0.91, Libre Baskerville 0.89 /
#           0.91; the 0.82 drawing 1.00: v's thick at the left extreme, 133 beside a 53 top at 800)
# A master's loop: its counter changes across as o's counter does (as the 0.82 stretch had it), the outer top over
# the middle; its extremes stand where the outer quarter is kappa, or higher where the counter's upper-left quarter
# would fall under il_min (the Bold: kappa 1.085 would pinch the counter's top to a point)
# The outer top stands over the middle of the outer extremes (top_x 0.50; references 0.53 to 0.55 where read cleanly);
# the left side leaves the diagonal's straight edge on a circular turn of the top quarter's own radius (no shoulder):
# the outer left extreme stands (1 - cos diag) x a right of the edge's line at its height, the turn starting
# sin diag x a below it. Form A takes kappa as the median and Libre Baskerville's mean (1.01 / 1.085); form B
# Libre Baskerville's own (0.88 / 0.97), a narrower loop.
LOOP = {"share": (0.52, 0.46), "il_min": (0.65, 0.70), "right": 0.895, "left": 0.89,
        "kappa": {"A": (1.01, 1.085), "B": (0.88, 0.97), "C": (0.974, 1.054), "D": (1.08, 1.16)}}
STUDY = {"diag": 1.05, "left": 1.04, "right": 0.77}   # 0.83 item C: shares of n's stem (refstudy/spec.md medians)
BOWL_R = (0.89, 0.84)   # the bowl's outer left extreme: radius over its lower quarter's width (references' median and
                        # Libre Baskerville's mean, 400 / 700: 0.94 / 0.89 and 0.84 / 0.79; o's own is flatter, 1.06 to 1.61;
                        # the 0.82 drawing 0.56 / 0.34, tighter at the Bold)
TENSION = 0.56          # handles' share of their reach where nothing else decides (the bowl's 0.57 outside, 0.61 in)
RATIO = 1.25            # curvecheck.RATIO
EASE = 0.45             # curvecheck.EASE
ARM_FILLET = 0.30       # 0.82 item 19: the crotch under the arm (at.FILLET's share of the stem, the @'s a)
TAIL_CUT = 30.0          # 0.84: the tail's cut end across, the serif tip (joins.END_MIN)
SOFT = 7.0               # 0.84: a free end's corners, the letters' serif-tip radius (derive.SOFT, measured 7.0 on H n I l)
RIBBON_SEGS = (1, 3, 4, 5, 6, 7, 8, 9)   # 0.84: the P segments whose width is evened (`even_ribbon`)
# 0.84 (Regular pass 2, second pass; the owner: "not smooth, the stroke doesn't look continuous through the bottom
# intersection, the thicks and thins are not even/gradual"). Measured on 0.84b (build/owner9/stroke): the counter's
# edge came out of the diagonal 3 units and 7.9 degrees off its own continuation, the width stepped 41.3 > 39.2 there,
# the bowl's width ran 82 > 55 > 55 > 41 (a plateau at the bottom, then a drop). The bowl's stroke now runs into the arm
# on an ease (construct): its two edges a clothoid and its parallel, from a node on the diagonal's centreline turning at
# ARM_R to the arm's line ARM_EASE past the diagonal (at ARM_END_R there, ARM_STRAIGHT of straight left before v's
# serif); the bowl's curves meet it at one curvature; the bowl's width one even taper from the left side to the arm's
# width TAPER_LEAD before the diagonal (bowl_taper, and even_ribbon's taper term at TAPER_W); the spine's hidden
# inflection at curvature 0 (INFL_W, falling to 0 at the Bold, where it held the loop 1.32 off one curvature); no flat
# place in the edges' curves (DIP_W). Tried at the Regular (build/owner9/pass2/amp): ARM_R 300 to 700, ARM_EASE 80 to
# 150 and as a share of the free arm, the ease from outside the diagonal (the width then 39.4 in and out, but the bowl's
# rise turned at the diagonal's edge: 1.1 to 2.3 units off), two cubics for the ease, ARM_END_R 1500 to 1e9; each moved
# the crossing's fit or left a fault in a master. These values: every master clean (curvecheck 0 faults)
TAPER_W = 0.3
TAPER_LEAD = 30.0
ARM_EASE = 100.0
ARM_STRAIGHT = 50.0
DIP_W = 200.0
ROUND_EASES = True      # `_round_eases`: a curve's handles where it meets a straight on whole units by the straight
INFL_W = 20.0
ARM_END_R = 2500.0      # not 0: whole units would turn a curvature of 0 either way at the join
ARM_R = 450.0
# 0.84 (Regular pass 3, the owner's visual notes, item 1: "the bottom cross intersection of the ampersand should not be
# like this"). The bowl's thin stroke was still turning (the ease above, curvature 1 / ARM_R at the diagonal's
# centreline) while it crossed the diagonal: its edges came out of the diagonal about 17 degrees steeper than they went
# in, and the eye, running each edge on across the thick stroke, read a step and a notch at each corner. It now crosses
# as x's strokes cross (`cross.py`): through the diagonal both its edges are two straight parallel lines, from
# THROUGH_LEAD before the diagonal's lower edge to THROUGH_LEAD past its upper edge, so each edge on one side lines up
# with itself on the other. The straight's direction is half way between the bowl's own arrival (the counter's, REG
# c2_deg) and the arm's (arm_dir): the turn the stroke makes between the bowl and the arm is shared, half in the bowl
# before the diagonal, half in a short ease after it (each edge one cubic from the straight to the arm's line, both
# handles on the corner where the two lines meet, THROUGH_EASE from it: curvature 0 at both ends). The crossing's
# middle (the arm's centreline on the diagonal's) does not move, nor does the arm above the ease or its serif.
THROUGH = True
THROUGH_LEAD = 10.0
THROUGH_EASE = 45.0
THROUGH_TURN = 10.0     # degrees: the most the ease after the diagonal turns (the Regular's turn is 2.3)
PEAK = 1.30             # 0.82 item 19: a node's curvature over the curves' a third in (a round turn, not a point)


# ------------------------------------------------------------------ cubic geometry
def bez(s, t):
    u = 1 - t
    return (u ** 3 * s[0][0] + 3 * u * u * t * s[1][0] + 3 * u * t * t * s[2][0] + t ** 3 * s[3][0],
            u ** 3 * s[0][1] + 3 * u * u * t * s[1][1] + 3 * u * t * t * s[2][1] + t ** 3 * s[3][1])


def split(s, t):
    def lerp(a, b):
        return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    a, b, c = lerp(s[0], s[1]), lerp(s[1], s[2]), lerp(s[2], s[3])
    d, e = lerp(a, b), lerp(b, c)
    f = lerp(d, e)
    return (s[0], a, d, f), (f, e, c, s[3])


def sub(s, t0, t1):
    if t1 < 1:
        s = split(s, t1)[0]
        t0 = t0 / t1 if t1 > 0 else 0
    if t0 > 0:
        s = split(s, t0)[1]
    return s


def curvature(s, t):
    u = 1 - t
    dx = 3 * (u * u * (s[1][0] - s[0][0]) + 2 * u * t * (s[2][0] - s[1][0]) + t * t * (s[3][0] - s[2][0]))
    dy = 3 * (u * u * (s[1][1] - s[0][1]) + 2 * u * t * (s[2][1] - s[1][1]) + t * t * (s[3][1] - s[2][1]))
    ddx = 6 * (u * (s[2][0] - 2 * s[1][0] + s[0][0]) + t * (s[3][0] - 2 * s[2][0] + s[1][0]))
    ddy = 6 * (u * (s[2][1] - 2 * s[1][1] + s[0][1]) + t * (s[3][1] - 2 * s[2][1] + s[1][1]))
    v = math.hypot(dx, dy)
    return (dx * ddy - dy * ddx) / v ** 3 if v > 1e-9 else 0.0


def unit(d):
    m = math.hypot(*d)
    return (d[0] / m, d[1] / m)


def meet(p, u, q, v):
    den = u[0] * v[1] - u[1] * v[0]
    if abs(den) < 1e-12:
        return None
    t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den
    return t


def on_line(p, d, y):
    """The point of the line through p along d at height y."""
    return (p[0] + d[0] * (y - p[1]) / d[1], y)


# ------------------------------------------------------------------ chains
class Chain:
    """Nodes (point, unit tangent along the chain) and the kind of each piece between them ("C" or "L").
    Handles are solved (solve) and the chain is a list of cubic segments (lines as cubics at thirds)."""

    def __init__(self, nodes, kinds, smooth, inflect=(), peaks=False, radii=None, rise=(), capped=()):
        self.nodes, self.kinds, self.smooth, self.inflect = nodes, kinds, smooth, set(inflect)
        self.peaks = peaks
        self.radii = radii or {}            # node -> the radius of curvature asked there (0.82 item 19)
        self.rise = set(rise)               # curves off a straight whose curvature only rises (0.82 item 19)
        self.cap = 0.90                     # a capped curve's handles at most this share of their reach
        self.capped = set(capped)
        self.lens = []
        for i, k in enumerate(kinds):
            if k == "L":
                self.lens.append(None)
            else:
                self.lens.append(list(self._default(i)))

    def _reach(self, i):
        (p, u), (q, v) = self.nodes[i], self.nodes[i + 1]
        chord = math.dist(p, q)
        t = meet(p, u, q, (-v[0], -v[1]))
        s = meet(q, (-v[0], -v[1]), p, u)
        a = t if (t is not None and 0 < t < 3 * chord) else chord * 0.6
        b = s if (s is not None and 0 < s < 3 * chord) else chord * 0.6
        return a, b

    def _default(self, i):
        a, b = self._reach(i)
        return a * TENSION, b * TENSION

    def segs(self):
        out = []
        for i, k in enumerate(self.kinds):
            (p, u), (q, v) = self.nodes[i], self.nodes[i + 1]
            if k == "L":
                out.append((p, (p[0] + (q[0] - p[0]) / 3, p[1] + (q[1] - p[1]) / 3),
                            (p[0] + 2 * (q[0] - p[0]) / 3, p[1] + 2 * (q[1] - p[1]) / 3), q))
            else:
                a, b = self.lens[i]
                out.append((p, (p[0] + u[0] * a, p[1] + u[1] * a), (q[0] - v[0] * b, q[1] - v[1] * b), q))
        return out

    def solve(self):
        idx, x0, lo, his, put, res = self.problem()
        from scipy.optimize import least_squares
        r = least_squares(res, x0, bounds=(lo, his), method="trf", diff_step=1e-4, xtol=1e-10, ftol=1e-10, max_nfev=4000)
        self.last = r
        put(r.x)
        self.x = r.x
        return float(np.sum(r.fun ** 2))

    def problem(self):
        """Handle lengths (least squares, each handle's share of its reach): one curvature on both sides of every
        smooth node between two curves; a curve leaving a straight eases (its curvature there at most 0.35 of its
        tightest); no flat place and no inflection inside a curve; otherwise near TENSION; inside the triangle."""
        idx = [i for i, k in enumerate(self.kinds) if k == "C" and i not in getattr(self, "fixed", ())]
        reach = {i: self._reach(i) for i in idx}
        lo, hi = math.log(0.22), math.log(0.95)

        def put(x):
            for j, i in enumerate(idx):
                a, b = reach[i]
                self.lens[i] = [a * math.exp(x[2 * j]), b * math.exp(x[2 * j + 1])]

        def res(x):
            put(x)
            S = self.segs()
            out = []
            for j, i in enumerate(idx):
                out += [0.15 * (x[2 * j] - math.log(TENSION)), 0.15 * (x[2 * j + 1] - math.log(TENSION))]
                s = S[i]
                ks = [curvature(s, t / 16) for t in range(17)]
                pos, neg = max(ks), min(ks)
                top_ = max(abs(pos), abs(neg)) or 1e-9
                out.append(30 * min(max(pos, 0), max(-neg, 0)) / top_)        # an inflection inside a curve
                ak = [abs(k) for k in ks]
                dip = max(min(max(ak[:m + 1]), max(ak[m:])) - ak[m] for m in range(17)) / top_
                out.append(getattr(self, "dip_w", 20) * max(0.0, dip - 0.04))   # a flat place
                if i in self.rise:
                    # 0.82 item 19: a turn off a straight rises to the curvature it hands on and no further (a
                    # peak just short of the next node reads as a shoulder: the loop's upper left at the Bold)
                    out.append(10 * max(0.0, max(ak) / max(ak[-1], 1e-9) - 1.05))
            for n in range(1, len(self.nodes) - 1):
                if not self.smooth[n]:
                    continue
                ka, kb = self.kinds[n - 1], self.kinds[n]
                if ka == "C" and kb == "C":
                    k1, k2 = curvature(S[n - 1], 1.0), curvature(S[n], 0.0)
                    if n in self.inflect:
                        # 0.84 pass 2: an inflection hidden in a crossing (the spine's, on the diagonal's centreline)
                        # is G2: the curvature 0 on both sides, so each edge is one curve through the crossing
                        mk = max(abs(curvature(S[n - 1], 0.5)), abs(curvature(S[n], 0.5)), 1e-9)
                        iw = getattr(self, "infl_w", 0.0)
                        out += [iw * abs(k1) / mk, iw * abs(k2) / mk]
                    else:
                        out.append(getattr(self, "kw", 6) * math.log((abs(k1) + 1e-6) / (abs(k2) + 1e-6)))
                    if self.peaks and n not in self.inflect:
                        # 0.82 item 19: no point at a node: the curvature there at most PEAK times the tightest
                        # place a third of the way into either curve
                        mid = max(abs(curvature(S[n - 1], 2 / 3)), abs(curvature(S[n], 1 / 3)), 1e-9)
                        out.append(8 * max(0.0, math.log(max(abs(k1), abs(k2)) / mid / PEAK)))
                    if n in self.radii:
                        out.append(6 * math.log(max(abs(k2), 1e-9) * self.radii[n]))
                elif ka != kb:
                    s, at = (S[n], 0.0) if kb == "C" else (S[n - 1], 1.0)
                    u0 = unit((s[1][0] - s[0][0], s[1][1] - s[0][1]))
                    u1 = unit((s[3][0] - s[2][0], s[3][1] - s[2][1]))
                    turn = math.acos(max(-1, min(1, u0[0] * u1[0] + u0[1] * u1[1])))
                    L = sum(math.dist(bez(s, t / 24), bez(s, (t + 1) / 24)) for t in range(24))
                    out.append(getattr(self, "ew", 10) * max(0.0, abs(curvature(s, at)) / (turn / L + 1e-9) - 0.30))   # over the mean
            return np.array(out)

        x0 = np.array([math.log(TENSION)] * (2 * len(idx)))
        # 0.82 item 19: the counter's left turn off the diagonal keeps its handles inside `cap` (0.90) of their reach,
        # so no instance between masters turns its control polygon both ways (at 0.95 it gained an inflection at 714)
        his = []
        for i in idx:
            h_ = math.log(self.cap) if i in self.capped else hi
            his += [h_, h_]
        his = np.array(his)
        x0 = np.minimum(x0, his - 1e-9)
        return idx, x0, lo, his, put, res


_TQ = np.linspace(0, 1, 33)
_BQ = np.stack([(1 - _TQ) ** 3, 3 * (1 - _TQ) ** 2 * _TQ, 3 * (1 - _TQ) * _TQ ** 2, _TQ ** 3], 1)


def ribbon_width(P, Q, segs_P, n=12):
    """The stroke's width along P's segments segs_P: for each sample on P the nearest distance to Q's facing segments
    (the same index and its neighbours). Returns [(segment, t, width)]."""
    SP, SQ = P.segs(), Q.segs()
    tp = np.linspace(0, 1, n + 1)
    bp = np.stack([(1 - tp) ** 3, 3 * (1 - tp) ** 2 * tp, 3 * (1 - tp) * tp ** 2, tp ** 3], 1)
    out = []
    for i in segs_P:
        qs = np.concatenate([_BQ @ np.array(SQ[j]) for j in (i - 1, i, i + 1) if 0 <= j < len(SQ)])
        ps = bp @ np.array(SP[i])
        d = np.min(np.hypot(ps[:, None, 0] - qs[None, :, 0], ps[:, None, 1] - qs[None, :, 1]), axis=1)
        out += [(i, float(t), float(v)) for t, v in zip(tp, d)]
    return out


def even_ribbon(P, Q, segs, weight=15.0):
    """0.84 (Regular pass 2, item 1): the ribbon's two edges solved together. Each chain keeps its own terms (one
    curvature at every smooth node, eases, no flat place or inflection); added, along each of the given P segments
    (each between two nodes whose widths are set: every extreme of the stroke's width is a node), the width must move
    one way only from the one node's width to the other's (any turn back is penalised), and its second difference is
    kept small (a gradual swell, no local bump)."""
    from scipy.optimize import least_squares
    P.ew = Q.ew = 40          # and each ease off a straight (the Light's tail underside left at 0.54 at 10)
    P.kw = Q.kw = 30          # one curvature across each node holds first (the bowl's bottom took a 1.38 jump at 6)
    pa = P.problem()
    qa = Q.problem()
    nP = len(pa[1])

    taper = getattr(P, "taper", None)

    def res(x):
        r = list(pa[5](x[:nP])) + list(qa[5](x[nP:]))
        W = ribbon_width(P, Q, segs)
        if taper:
            # 0.84 pass 2: across these P segments the width falls evenly along the edge (one even taper), reaching
            # the arm's `back` units before the segments' end (so the stroke enters the diagonal at the arm's width)
            tsegs, w0, w1, back = taper
            SP_ = P.segs()
            pts = [(j, t_, v) for j, t_, v in W if j in tsegs]
            arc, prev, acc = [], None, 0.0
            for j, t_, v in pts:
                q_ = bez(SP_[j], t_)
                if prev is not None:
                    acc += math.dist(prev, q_)
                arc.append(acc)
                prev = q_
            end_ = max(acc - back, 1e-9)
            for (j, t_, v), a_ in zip(pts, arc):
                r.append(TAPER_W * (v - (w0 + (w1 - w0) * min(1.0, a_ / end_))))
        for i in segs:
            w = [v for j, _t, v in W if j == i]
            sg = 1 if w[-1] >= w[0] else -1
            for a_, b_ in zip(w, w[1:]):
                r.append(weight * max(0.0, -sg * (b_ - a_)))           # a turn back inside the segment
            for k in range(1, len(w) - 1):
                r.append(0.6 * (w[k + 1] - 2 * w[k] + w[k - 1]))
        return np.array(r)
    x0 = np.concatenate([P.x, Q.x])
    lo = np.concatenate([np.full(nP, pa[2]), np.full(len(qa[1]), qa[2])])
    hi = np.concatenate([pa[3], qa[3]])
    r = least_squares(res, np.clip(x0, lo + 1e-9, hi - 1e-9), bounds=(lo, hi), method="trf", diff_step=1e-4,
                      xtol=1e-6, ftol=1e-6, max_nfev=400)
    pa[4](r.x[:nP])
    qa[4](r.x[nP:])
    return r


def flat_chain(segs, n=48):
    """[(seg index, t, point)] along a chain."""
    out = []
    for i, s in enumerate(segs):
        for k in range(n + (1 if i == len(segs) - 1 else 0)):
            t = k / n
            out.append((i, t, bez(s, t)))
    return out


def crossings(sa, sb, skip_same=None):
    """Every crossing of two chains of segments: [((ia, ta), (ib, tb), point)], refined."""
    A, B = flat_chain(sa), flat_chain(sb)
    out = []
    for m in range(len(A) - 1):
        a0, a1 = A[m][2], A[m + 1][2]
        for n in range(len(B) - 1):
            if skip_same is not None and abs(m - n) < skip_same:
                continue
            b0, b1 = B[n][2], B[n + 1][2]
            d1 = (a1[0] - a0[0], a1[1] - a0[1])
            d2 = (b1[0] - b0[0], b1[1] - b0[1])
            den = d1[0] * d2[1] - d1[1] * d2[0]
            if abs(den) < 1e-12:
                continue
            s = ((b0[0] - a0[0]) * d2[1] - (b0[1] - a0[1]) * d2[0]) / den
            t = ((b0[0] - a0[0]) * d1[1] - (b0[1] - a0[1]) * d1[0]) / den
            if 0 <= s < 1 and 0 <= t < 1:
                ia, ta = A[m][0], A[m][1] + s * (A[m + 1][1] - A[m][1] if A[m + 1][0] == A[m][0] else 1 - A[m][1])
                ib, tb = B[n][0], B[n][1] + t * (B[n + 1][1] - B[n][1] if B[n + 1][0] == B[n][0] else 1 - B[n][1])
                if ta >= 1:
                    ia, ta = (ia + 1, 0.0) if ia + 1 < len(sa) else (ia, 1.0)
                if tb >= 1:
                    ib, tb = (ib + 1, 0.0) if ib + 1 < len(sb) else (ib, 1.0)
                ia, ta, ib, tb = _refine(sa, ia, ta, sb, ib, tb)
                out.append(((ia, ta), (ib, tb), bez(sa[ia], ta)))
    return out


def _refine(sa, ia, ta, sb, ib, tb):
    for _ in range(30):
        pa, pb = bez(sa[ia], ta), bez(sb[ib], tb)
        e = 1e-6
        da = [(bez(sa[ia], min(1, ta + e))[k] - pa[k]) / e for k in (0, 1)]
        db = [(bez(sb[ib], min(1, tb + e))[k] - pb[k]) / e for k in (0, 1)]
        # pa(ta + x) = pb(tb + y): da x - db y = pb - pa
        den = da[0] * (-db[1]) - (-db[0]) * da[1]
        if abs(den) < 1e-12:
            break
        rx, ry = pb[0] - pa[0], pb[1] - pa[1]
        x = (rx * (-db[1]) - (-db[0]) * ry) / den
        y = (da[0] * ry - da[1] * rx) / den
        ta, tb = min(1, max(0, ta + x)), min(1, max(0, tb + y))
        if abs(x) + abs(y) < 1e-10:
            break
    return ia, ta, ib, tb


def piece(segs, frm, to):
    """The part of a chain from (i, t) to (i, t), forward or backward; segments."""
    (i0, t0), (i1, t1) = frm, to
    rev = (i1, t1) < (i0, t0)
    if rev:
        (i0, t0), (i1, t1) = (i1, t1), (i0, t0)
    out = []
    for i in range(i0, i1 + 1):
        a = t0 if i == i0 else 0.0
        b = t1 if i == i1 else 1.0
        if b - a < 1e-6:
            continue
        out.append((sub(segs[i], a, b), i))
    if rev:
        out = [((s[3], s[2], s[1], s[0]), i) for s, i in reversed(out)]
    return out


# ------------------------------------------------------------------ readings
def _flat(g):
    polys = []
    for c in g.contours:
        P = [(p.x, p.y, p.type) for p in c.points]
        start = next(i for i, q in enumerate(P) if q[2])
        P = P[start:] + P[:start] + [P[start]]
        poly, prev, offs = [P[0][:2]], P[0][:2], []
        for q in P[1:]:
            if q[2] is None:
                offs.append(q[:2])
                continue
            if len(offs) == 2:
                for k in range(1, 17):
                    poly.append(bez((prev, offs[0], offs[1], q[:2]), k / 16))
            else:
                poly.append(q[:2])
            prev, offs = q[:2], []
        polys.append(poly[:-1])
    return polys


def _spans(polys, v, ax):
    xs = []
    for P in polys:
        for a, b in zip(P, P[1:] + P[:1]):
            if (a[ax] - v) * (b[ax] - v) < 0:
                t = (v - a[ax]) / (b[ax] - a[ax])
                xs.append(a[1 - ax] + t * (b[1 - ax] - a[1 - ax]))
    xs.sort()
    return [(xs[i], xs[i + 1]) for i in range(0, len(xs) - 1, 2)]


def _line_dist(a, b, c, d):
    """Distance between the lines a-b and c-d, read at c-d's middle across a-b."""
    u = unit((b[0] - a[0], b[1] - a[1]))
    m = ((c[0] + d[0]) / 2, (c[1] + d[1]) / 2)
    return abs((m[0] - a[0]) * u[1] - (m[1] - a[1]) * u[0])


def readings(font):
    """The weights the ampersand takes from this master's letters."""
    o = font["o"]
    on = [(p.x, p.y) for c in o.contours for p in c.points if p.type]
    outer = [(p.x, p.y) for p in o.contours[0].points if p.type]
    inner = [(p.x, p.y) for p in o.contours[1].points if p.type]
    if min(q[0] for q in outer) > min(q[0] for q in inner):
        outer, inner = inner, outer
    r = min(q[0] for q in inner) - min(q[0] for q in outer)
    h = max(q[1] for q in outer) - max(q[1] for q in inner)
    ocw = max(q[0] for q in inner) - min(q[0] for q in inner)
    a = _flat(font["a"])                                   # a's lower stroke under its counter's lowest point
    area_ = lambda P: sum(P[i - 1][0] * P[i][1] - P[i][0] * P[i - 1][1] for i in range(len(P))) / 2
    outer_a = max(a, key=lambda P: abs(area_(P)))
    hole = min([P for P in a if P is not outer_a], key=lambda P: min(q[1] for q in P))
    lo = min(hole, key=lambda q: q[1])
    sp = [s_ for s_ in _spans(a, lo[0] + 0.37, 0) if s_[1] <= lo[1] + 1][-1]
    arch = sp[1] - sp[0]
    V = [(p.x, p.y) for p in font["v"].contours[0].points]
    thin = _line_dist(V[1], V[2], V[26], V[27])
    thick = _line_dist(V[27], V[28], V[-1], V[0])
    serif = [(p.x, p.y, p.type, p.smooth) for p in font["v"].contours[0].points]
    # 0.82 (owner round 8, item 19): n's stem (the master's place on the axis) and e's bottom under its lowest point (the
    # lower bowl's bottom: a round stroke running on into a stroke, as e's does into its tail)
    stem = min(b_ - a_ for a_, b_ in _spans(_flat(font["n"]), 200.0, 1))
    e = _flat(font["e"])
    lo_e = min((q for P in e for q in P), key=lambda q: q[1])
    sp_e = _spans(e, lo_e[0] + 0.3, 0)
    return {"r": r, "h": h, "arch": arch, "thin": thin, "thick": thick, "o_counter": ocw, "n": float(font["n"].width),
            "v": serif, "stem": stem, "e_bot": sp_e[0][1] - sp_e[0][0]}


def widths(R):
    # 0.82 (owner round 8, item 19): the loop's right side LOOP["right"] of its left (was the mean of o's side and
    # hairline: 0.84 / 0.74 of the left at 400 / 800, the references 0.895 / 0.90); the bowl's bottom e's bottom (was
    # a's lower stroke: 50 / 55 at 400 / 800 against e's 54.5 / 88.6; the owner: "its bottom is light")
    # 0.83 (Regular pass, item C; the reference study, build/refstudy/spec.md: Georgia Pro, Serrif, PP Kyoto medians
    # over each face's n stem): the diagonal 1.05 of n's stem (v's thick, 0.95, read light), the loop's left side 1.04,
    # its right side 0.77 (the stroke rising into it from the spine)
    ul = R["thick"]
    return {"diag": R["thick"], "ul": ul, "ut": R["h"], "ur": (R["r"] + R["h"]) / 2, "sp": R["h"],
            "ll": R["r"], "lb": R.get("e_bot", R["arch"]), "tail": R["arch"], "arm": R["thin"]}


# ------------------------------------------------------------------ the construction
def bowl_taper(W, G, sx):
    """0.84 (Regular pass 2, second pass; the owner: "the thicks and thins are not even/gradual"): the lower bowl's
    stroke from its left side (o's side, 82) to the arm (v's thin, 39) is one even taper: the bottom's width is where a
    width falling evenly along the centreline from the left extreme to the arm's crossing stands at the bottom (it was
    e's bottom, 54.5, a plateau before the fall into the arm: 82 > 55 > 55 > 41)."""
    lo, hi = W["arm"], W["ll"]
    lb = W["lb"]
    ll, lbx = G["ll"], G["lb_x"]
    for _ in range(4):
        a = abs(lbx - ll[0]) * sx
        b = abs(ll[1] - (G["bottom"] + lb / 2))
        h = ((a - b) / (a + b)) ** 2
        arc1 = math.pi * (a + b) * (1 + 3 * h / (10 + math.sqrt(4 - 3 * h))) / 4       # the quarter (Ramanujan)
        # on to where the bowl's centreline meets the diagonal's centreline (on the arm's line)
        ad = unit((G["arm_dir"][0] * sx, G["arm_dir"][1]))
        ac = (G["arm_x"] * sx, 355.0)
        dang = math.radians(G["diag_deg"])
        dd = unit((math.sin(dang) * sx, -math.cos(dang)))
        c0 = (G["diag_x"] * sx, 250.0)
        n_ll = (-abs(dd[1]), -abs(dd[0]))
        L1p = (c0[0] + n_ll[0] * W["diag"] / 2, c0[1] + n_ll[1] * W["diag"] / 2)
        t = meet(ac, ad, L1p, dd) - TAPER_LEAD
        nx, ny = ac[0] + ad[0] * t, ac[1] + ad[1] * t
        arc2 = 1.05 * math.dist((lbx * sx, G["bottom"] + lb / 2), (nx, ny))
        lb = hi - (hi - lo) * arc1 / (arc1 + arc2)
    return lb


def weight_share(R):
    """0 at the Regular's stem, 1 at the Bold's (140), on the stem's logarithm; the Light takes the Regular's."""
    return min(1.0, max(0.0, math.log(R["stem"] / 78.0) / math.log(140.0 / 78.0)))


def _lerp(pair, t):
    return pair[0] + (pair[1] - pair[0]) * t


def loop_rule(R, G, sx, Ky, R0=None, a0=None, cross_lo=None):
    """The loop's skeleton in this master (LOOP): returns G with ul, ur, ut_x, p1_y, p2_y set (pre-stretch x)."""
    W = widths(R)
    t = weight_share(R)
    top = G["top"]
    top_i = top - W["ut"]
    kap = _lerp(LOOP["kappa"][G.get("loop", "A")], t)
    if R0 is None:
        # the Regular: the extremes at the references' share of the counter's span, the quarter at kappa
        y_e = Ky + _lerp(LOOP["share"], t) * (top_i - Ky)
        a = max(kap * (top - y_e), W["ul"] + _lerp(LOOP["il_min"], t) * (top_i - y_e))
    else:
        # a master: the counter's width changes as o's counter does (the white law's letter, as before), the outer
        # top centred over it
        W0 = widths(R0)
        cw0 = 2 * a0 - W0["ul"] - W0["ur"]
        cw = cw0 * R["o_counter"] / R0["o_counter"]
        a = (cw + W["ul"] + W["ur"]) / 2
        y_e = None
    # the outer left extreme where the outer quarter is kappa, the counter's where its quarter is il_min (never
    # higher than the outer's): where one height cannot give both (the Bold: kappa would pinch the counter's top, il_min
    # would flatten the outer), the outer extreme stands lower than the counter's, the loop's left side thickest a
    # little below the counter's extreme, as a stroke coming up off the diagonal is
    il = _lerp(LOOP["il_min"], t)
    ai = a - W["ul"]
    if y_e is None:
        y_o = top - a / kap
        y_i = max(y_o, top_i - ai / il)
    else:
        y_o = y_i = y_e
    ang = math.radians(G["diag_deg"])
    dd = unit((math.sin(ang) * sx, -math.cos(ang)))
    th = math.atan2(abs(dd[0]), abs(dd[1]))
    half = W["diag"] / 2
    n_ll = (-abs(dd[1]), -abs(dd[0]))
    c0 = (G["diag_x"] * sx, 250.0)
    L1p = (c0[0] + n_ll[0] * half, c0[1] + n_ll[1] * half)
    L2p = (c0[0] - n_ll[0] * half, c0[1] - n_ll[1] * half)
    # both edges turn off their straight on at least a circle of their own quarter's radius: the outer edge by
    # (1 - cos) a; the counter's edge, whose straight stands (e2 - e1) right of the outer's while the loop's left side
    # is only W["ul"] across, by (1 - cos) (a - W["ul"])
    e1, e2 = on_line(L1p, dd, y_o)[0], on_line(L2p, dd, y_i)[0]
    off = max((1 - math.cos(th)) * a, (1 - math.cos(th)) * ai + (e2 - e1) - W["ul"])
    ulo = e1 + off
    ut = ulo + a
    uro = ut + a
    y_e = (y_o + y_i) / 2
    G = dict(G)
    G["ul"] = ((ulo + W["ul"] / 2) / sx, y_e)
    G["ul_y"] = (y_o, y_i)
    G["ur"] = ((uro - W["ur"] / 2) / sx, y_i)
    G["ut_x"] = ut / sx
    # each turn's radius from its offset: (1 - cos) r = the offset; the turn starts sin x r below the extreme
    r_o = off / (1 - math.cos(th))
    r_i = (ulo + W["ul"] - e2) / (1 - math.cos(th))
    G["p1_y"] = y_o - G.get("ease1", 1.0) * math.sin(th) * r_o
    G["p2_y"] = y_i - G.get("ease2", 1.0) * math.sin(th) * r_i
    G["_loop"] = {"y_o": y_o, "y_i": y_i, "a": a, "kappa": kap, "kappa_eff": a / (top - y_o), "ai": ai,
                  "il": ai / (top_i - y_i), "ulo": ulo, "edge": e1, "edge2": e2, "p1": G["p1_y"], "p2": G["p2_y"]}
    return G


_A0 = {}


def _regular_a(R0, G):
    """The Regular's loop quarter (its `a`), from the Regular's own skeleton (the master's spread does not reach it)."""
    key = (id(R0), G.get("loop"))
    if key not in _A0:
        G0 = {k: v for k, v in REG.items()}
        G0["loop"] = G.get("loop", REG["loop"])
        for k in ("ease1", "ease2", "curve_cross"):
            if k in G:
                G0[k] = G[k]
        _A0[key] = construct(R0, G0, 1.0)[1]["loop"]["a"]
    return _A0[key]


def construct(R, G=None, sx=1.0, _pass=0):
    """R: readings; G: skeleton (REG); sx: level stretch of the skeleton about x 0. Returns (contours, info)."""
    G = dict(G or REG)
    if G.get("loop") and "_loop" not in G and _pass == 0:
        # the counter's bottom is the crossing K, which the loop's place moves a little: two passes
        R0, a0 = G.get("_R0"), None
        if R0 is not None and R0 is not R:
            a0 = _regular_a(R0, G)
        else:
            R0 = None
        _cs, inf = construct(R, G, sx, _pass=1)
        lo_ = min(inf["J"][1], inf["C1"][1])
        G2 = loop_rule(R, G, sx, inf["K"][1], R0, a0, lo_)
        _cs, inf = construct(R, G2, sx, _pass=1)
        lo_ = min(lo_, inf["J"][1], inf["C1"][1])
        G2 = loop_rule(R, G, sx, inf["K"][1], R0, a0, lo_)
        return construct(R, G2, sx, _pass=2)
    W = widths(R)
    X = lambda x: x * sx
    top, bot = G["top"], G["bottom"]
    if G.get("taper", True):
        W = dict(W)
        W["lb"] = bowl_taper(W, G, sx)
    # the diagonal
    a = math.radians(G["diag_deg"])
    dd = unit((math.sin(a) * sx, -math.cos(a)))          # down the diagonal
    up = (-dd[0], -dd[1])
    nrm = (dd[1], -dd[0])                                  # to the diagonal's left (down-left side)... see below
    c0 = (X(G["diag_x"]), 250.0)
    half = W["diag"] / 2
    # lower edge L1 (towards the lower-left), upper edge L2
    n_ll = (-abs(dd[1]), -abs(dd[0]))                      # normal towards lower-left
    L1p = (c0[0] + n_ll[0] * half, c0[1] + n_ll[1] * half)
    L2p = (c0[0] - n_ll[0] * half, c0[1] - n_ll[1] * half)

    def l1(y):
        return on_line(L1p, dd, y)

    def l2(y):
        return on_line(L2p, dd, y)

    ul, ur, ll = G["ul"], G["ur"], G["ll"]
    yo, yi = G.get("ul_y", (ul[1], ul[1]))
    ULo, ULi = (X(ul[0]) - W["ul"] / 2, yo), (X(ul[0]) + W["ul"] / 2, yi)
    URo, URi = (X(ur[0]) + W["ur"] / 2, ur[1]), (X(ur[0]) - W["ur"] / 2, ur[1])
    UTo, UTi = (X(G["ut_x"]), top), (X(G["ut_x"]), top - W["ut"])
    LLo, LLi = (X(ll[0]) - W["ll"] / 2, ll[1]), (X(ll[0]) + W["ll"] / 2, ll[1])
    LBo, LBi = (X(G["lb_x"]), bot), (X(G["lb_x"] + G.get("lb_di", 0.0)), bot + W["lb"])
    # the spine's inflection: where it crosses the diagonal's centreline
    sc = on_line(c0, dd, G["sp_y"])
    sd = unit((-math.cos(math.radians(G["sp_deg"])) * sx, -math.sin(math.radians(G["sp_deg"]))))   # down-left
    sn = (-sd[1], sd[0])                                   # its left: towards lower-right ... (B side)
    if sn[0] < 0:
        sn = (-sn[0], -sn[1])
    SA = (sc[0] - sn[0] * W["sp"] / 2, sc[1] - sn[1] * W["sp"] / 2)     # upper-left edge (Q)
    SB = (sc[0] + sn[0] * W["sp"] / 2, sc[1] + sn[1] * W["sp"] / 2)     # lower-right edge (P)
    # bowl into the diagonal
    # tail
    TB = (X(G["tb_x"]), bot)
    TT = (X(G["tt_x"]), bot + W["tail"])
    T1, T2 = (X(G["t1"][0]), G["t1"][1]), (X(G["t2"][0]), G["t2"][1])
    # 0.84 (Regular pass 2, item 1): the tail's cut is the letters' least flat-cut end, the serif tip (joins.END_MIN,
    # 30; it was the drawn 21): its top corner moves out along the drawn cut
    _cu = unit((T2[0] - T1[0], T2[1] - T1[1]))
    T2 = (T1[0] + _cu[0] * TAIL_CUT, T1[1] + _cu[1] * TAIL_CUT)
    t1d = unit((G["t1_dir"][0] * sx, G["t1_dir"][1]))
    t2d = unit((G["t2_dir"][0] * sx, G["t2_dir"][1]))
    D, U, L, Rt = (0.0, -1.0), (0.0, 1.0), (-1.0, 0.0), (1.0, 0.0)
    # the arm (its edges first: the tail's top turns off the diagonal's edge below where the arm meets it)
    ad = unit((G["arm_dir"][0] * sx, G["arm_dir"][1]))
    ac = (X(G["arm_x"]), 355.0)
    an = (ad[1], -ad[0])                                    # to the arm's right (down-right)
    AR = (ac[0] + an[0] * W["arm"] / 2, ac[1] + an[1] * W["arm"] / 2)
    AL = (ac[0] - an[0] * W["arm"] / 2, ac[1] - an[1] * W["arm"] / 2)
    s_ = meet(AR, ad, L2p, dd)
    p4_y = min(G["p4_y"], AR[1] + ad[1] * s_ - 25)
    if G.get("loop"):
        # 0.82 item 19: the tail's top reaches the diagonal's straight edge at least twice the arm's fillet below where
        # the arm's edge meets it, in every master, so the crotch under the arm is filleted on the straight (one
        # structure at every weight; on the curve in some masters it had to be merged into the curve)
        pass   # 0.84: the crotch under the arm is sharp (no fillet), the tail's top still reaches the straight 25 below it
    # 0.84 (Regular pass 2, item 1): the lower bowl's stroke runs on through the diagonal as the arm, as one stroke
    # crossing another: each edge of the bowl turns into the arm's edge line at a node inside the diagonal (where the
    # arm's edge crosses the diagonal's centreline), tangent to it, so the edge entering the diagonal and the edge
    # leaving it are one curve then one line (no step, no kink); every corner of that crossing is found, not placed
    def _on_mid(Lp):
        s_ = meet(Lp, ad, c0, dd)
        return (Lp[0] + ad[0] * s_, Lp[1] + ad[1] * s_)
    NP, NQ = _on_mid(AL), _on_mid(AR)
    # the diagonal's lower edge runs straight down past where the bowl's outside crosses it (the arm's right edge's
    # line there, less 20: the curve leaves that line inside the diagonal), so the crossing's corner is on the straight
    # in every master (the Bold's heavier diagonal crossed it at 64, under the Regular's turn at 70)
    _s1 = meet(AR, ad, L1p, dd)
    G = dict(G)
    G["p3_y"] = min(G["p3_y"], AR[1] + ad[1] * _s1 - 20)
    up_P = (AL[0] + ad[0] * 400, AL[1] + ad[1] * 400)
    up_Q = (AR[0] + ad[0] * 400, AR[1] + ad[1] * 400)
    P = Chain([(T1, (-t1d[0], -t1d[1])), (TB, L), (l1(G["p3_y"]), up), (l1(G["p1_y"]), up), (ULo, U), (UTo, Rt),
               (URo, D), (SB, sd), (LLi, D), (LBi, Rt), (NP, ad), (up_P, ad)],
              ["C", "C", "L", "C", "C", "C", "C", "C", "C", "C", "L"],
              [False, True, True, True, True, True, True, True, True, True, True, False], inflect=[7],
              peaks=bool(G.get("loop")), rise=(3,) if G.get("loop") else ())
    Q = Chain([(T2, (-t2d[0], -t2d[1])), (TT, L), (l2(p4_y), up), (l2(G["p2_y"]), up), (ULi, U), (UTi, Rt),
               (URi, D), (SA, sd), (LLo, D), (LBo, Rt), (NQ, ad), (up_Q, ad)],
              ["C", "C", "L", "C", "C", "C", "C", "C", "C", "C", "L"],
              [False, True, True, True, True, True, True, True, True, True, True, False], inflect=[7],
              peaks=bool(G.get("loop")),
              radii={8: _lerp(BOWL_R, weight_share(R)) * (LBo[0] - LLo[0])} if G.get("loop") else None,
              capped=(3,) if G.get("loop") else ())
    # 0.84 (Regular pass 2, second pass; the owner: "the stroke doesn't look continuous through the bottom
    # intersection"): the bowl's stroke and the arm are one stroke whose edges run on through the diagonal as one
    # curve. Each edge leaves the bowl, is still turning (gently) as it crosses the diagonal, and straightens into the
    # arm's line ARM_EASE beyond the diagonal's upper edge: from there back the edge is a clothoid (curvature rising
    # evenly from 0 to 1 / ARM_R at the node inside the diagonal), one cubic G2 at both ends; the bowl's curve meets it
    # at one curvature. Before, each edge met the arm's line at a node inside the diagonal with the bowl's whole turn
    # still in it: the counter's edge came out 3 units and 7.9 degrees off its own continuation
    def _ease(Lp):
        """The counter edge's ease: a clothoid from its node inside the diagonal (curvature 1 / ARM_R) to the arm's
        line ARM_EASE beyond the diagonal's upper edge (curvature 1 / ARM_END_R): (start, tangent, end)."""
        # the ease ends ARM_EASE beyond the diagonal's upper edge, or ARM_STRAIGHT before the serif's bracket leaves the
        # arm if that comes first
        sv = v_serif(R["v"], AR, AL, ad, G["arm_top"])
        s_br = min(((sv[0][0][0] - AR[0]) * ad[0] + (sv[0][0][1] - AR[1]) * ad[1]),
                   ((sv[2][0] - AL[0]) * ad[0] + (sv[2][1] - AL[1]) * ad[1]))
        s_up = meet(Lp, ad, L2p, dd)
        sA = s_up + min(ARM_EASE, s_br - s_up - ARM_STRAIGHT)
        sN = meet(Lp, ad, c0, dd)
        Ls = sA - sN
        A_ = (Lp[0] + ad[0] * sA, Lp[1] + ad[1] * sA)
        th = math.atan2(ad[1], ad[0])
        x_, y_ = A_
        n_ = 400
        ds = Ls / n_
        kN, kA = 1.0 / ARM_R, 1.0 / ARM_END_R
        for i_ in range(n_):
            k_ = kA + (kN - kA) * (i_ + 0.5) / n_
            x_ -= math.cos(th - k_ * ds / 2) * ds
            y_ -= math.sin(th - k_ * ds / 2) * ds
            th -= k_ * ds
        return (x_, y_), (math.cos(th), math.sin(th)), A_
    import signs as SG_
    N0, tN, A0 = _ease(AL)
    if THROUGH:
        # the straight through the diagonal, half way in direction between the counter's arrival and the arm; it meets
        # the arm's centreline at the ease's corner Ic, beyond the diagonal's upper edge, so the arm above stays
        a_arm = math.atan2(ad[1], ad[0])
        # the bowl's own arrival: a circular turn from the counter's level bottom (LBi) to where the arm's counter-side
        # line crosses the diagonal's lower edge arrives at twice its chord's angle (the Regular 51 degrees; at the
        # Bold the counter's floor stands near the crossing and the turn is flatter)
        _s = meet(AL, ad, L1p, dd)
        _c = (AL[0] + ad[0] * _s, AL[1] + ad[1] * _s)
        a_bowl = min(a_arm, 2 * math.atan2(_c[1] - LBi[1], _c[0] - LBi[0]))
        # the ease's turn at most THROUGH_TURN: at the Bold the chord reads 16 degrees and a straight at half way
        # (36) meets the arm's line only past v's serif
        a_bowl = max(a_bowl, a_arm - 2 * math.radians(THROUGH_TURN))
        dt = (math.cos((a_arm + a_bowl) / 2), math.sin((a_arm + a_bowl) / 2))
        # the ease turns the rest: its cubic's handles on the corner, each ARM_R x the half turn (at least THROUGH_EASE)
        ease_ = max(THROUGH_EASE, ARM_R * (a_arm - a_bowl) / 4)
        nt = (dt[1], -dt[0])                                  # to the straight's right (the outside, Q)
        s_c = meet(ac, ad, L2p, dd) + THROUGH_LEAD + ease_
        _tail_top = Q.segs()[:3]
        for _k in range(20):
            Ic = (ac[0] + ad[0] * s_c, ac[1] + ad[1] * s_c)
            lines = {}
            for nm in ("P", "Q"):
                off = (-0.5 if nm == "P" else 0.5) * W["arm"]
                O_ = (Ic[0] + nt[0] * off, Ic[1] + nt[1] * off)           # this edge's straight through the diagonal
                Lp_ = AL if nm == "P" else AR                              # this edge's arm line
                s_I = meet(O_, dt, Lp_, ad)
                lines[nm] = (O_, (O_[0] + dt[0] * s_I, O_[1] + dt[1] * s_I))
            # parameters along dt from each edge's own corner I (negative: back towards the bowl)
            lo_ = min(meet(lines[k][1], dt, L1p, dd) for k in lines) - THROUGH_LEAD
            hi_ = max(meet(lines[k][1], dt, L2p, dd) for k in lines) + THROUGH_LEAD
            # the outside edge leaves the tail's top (X2) on the straight too, in every master (so the outline has one
            # structure): the straight runs on THROUGH_LEAD past where its line meets the tail's top as first drawn
            IQ = lines["Q"][1]
            far_ = ((IQ[0] - dt[0] * 2000, IQ[1] - dt[1] * 2000), None, None, (IQ[0] + dt[0] * 2000, IQ[1] + dt[1] * 2000))
            far_ = [(far_[0], far_[0], far_[3], far_[3])]
            hx = crossings(_tail_top, far_)
            if hx:
                hi_ = max(hi_, max((p_[0] - IQ[0]) * dt[0] + (p_[1] - IQ[1]) * dt[1] for _a, _b, p_ in hx) + 2 * THROUGH_LEAD)
            # the ease ends ARM_STRAIGHT before v's serif leaves the arm (at the Bold the turn is longest)
            sv_ = v_serif(R["v"], AR, AL, ad, G["arm_top"])
            room = min(((sv_[0][0][0] - lines["Q"][1][0]) * ad[0] + (sv_[0][0][1] - lines["Q"][1][1]) * ad[1]),
                       ((sv_[2][0] - lines["P"][1][0]) * ad[0] + (sv_[2][1] - lines["P"][1][1]) * ad[1])) - ARM_STRAIGHT
            if ease_ > room:
                ease_ = max(THROUGH_LEAD, room)
            if hi_ <= -ease_ + 1e-6:
                break
            s_c += hi_ + ease_                                # the ease would start inside the diagonal: further out
        for nm, C_ in (("P", P), ("Q", Q)):
            I_ = lines[nm][1]
            N_ = (I_[0] + dt[0] * lo_, I_[1] + dt[1] * lo_)
            E_ = (I_[0] - dt[0] * ease_, I_[1] - dt[1] * ease_)
            B_ = (I_[0] + ad[0] * ease_, I_[1] + ad[1] * ease_)
            C_.nodes[10] = (N_, dt)
            C_.nodes.insert(11, (E_, dt))
            C_.nodes.insert(12, (B_, ad))
            C_.kinds[9:10] = ["C", "L", "C"]
            C_.smooth.insert(11, True)
            C_.smooth.insert(12, True)
            C_.lens[9:10] = [C_.lens[9], None, [ease_, ease_]]
            C_.fixed = {11}
            C_.dip_w = DIP_W
            C_.infl_w = INFL_W * (1.0 - weight_share(R))
    for nm, C_ in (("P", P), ("Q", Q)) if not THROUGH else ():
        N_, A_, kN_, kA_ = N0, A0, 1.0 / ARM_R, 1.0 / ARM_END_R
        if nm == "Q":
            # the outside edge is the counter edge's parallel at the arm's width: the stroke one width through the
            # crossing (each node moved the width along the edge's normal, its curvature the parallel's)
            w_ = W["arm"]
            N_ = (N0[0] + tN[1] * w_, N0[1] - tN[0] * w_)
            A_ = (A0[0] + ad[1] * w_, A0[1] - ad[0] * w_)
            kN_, kA_ = kN_ / (1 + kN_ * w_), kA_ / (1 + kA_ * w_)
        cub = SG_._g2_cubic(N_, tN, kN_, A_, ad, kA_, balanced=True)
        if cub is None:
            raise ValueError("ampersand: no G2 cubic for the arm's ease")
        C_.nodes[10] = (N_, tN)
        C_.nodes.insert(11, (A_, ad))
        C_.kinds.insert(10, "C")
        C_.smooth.insert(11, True)
        C_.lens.insert(10, [math.dist(cub[0], cub[1]), math.dist(cub[3], cub[2])])
        C_.fixed = {10}
        C_.dip_w = DIP_W                     # 0.84 pass 2: no flat place in the bowl's quarters under the ease's pull
        # the hidden inflection's weight falls to 0 at the Bold (there it would hold the loop off one curvature, 1.32)
        C_.infl_w = INFL_W * (1.0 - weight_share(R))
    # the taper reaches the arm's width TAPER_LEAD before the diagonal's lower edge
    _sin = abs(ad[0] * dd[1] - ad[1] * dd[0])
    # (THROUGH: the bowl's curve ends THROUGH_LEAD before the lower edge, so the width is reached the rest of the way back)
    P.taper = ((8, 9), W["ll"], W["arm"], TAPER_LEAD - THROUGH_LEAD if THROUGH else W["diag"] / 2 / _sin + TAPER_LEAD)
    P.solve()
    Q.solve()
    if G.get("even_ribbon", True) and _pass != 1:
        # the loop (its turn off the diagonal, its left, top, right), the spine and the bowl to where it crosses
        even_ribbon(P, Q, RIBBON_SEGS)
    sP, sQ = P.segs(), Q.segs()
    # v's serif on the arm
    serif = v_serif(R["v"], AR, AL, ad, G["arm_top"])
    # corners
    def cross_line(segs, p, d, pick):
        far = (p[0] - d[0] * 2000, p[1] - d[1] * 2000), (p[0] + d[0] * 2000, p[1] + d[1] * 2000)
        line = [(far[0], far[0], far[1], far[1])]
        hits = crossings(segs, line)
        return pick(hits)

    info = {}
    # X3: the arm's left edge meets the diagonal's upper edge (a line on Q)
    iL2 = 2
    h3 = cross_line(sP[10:12], L2p, dd, lambda hs: hs[0])
    X3p, X3 = (10 + h3[0][0], h3[0][1]), h3[2]
    tq = ((X3[1] - sQ[iL2][0][1]) / (sQ[iL2][3][1] - sQ[iL2][0][1]))
    X3q = (iL2, tq)
    # X2: the arm's right edge (Q's, from the bowl) meets the tail's top (Q, before the line)
    h2 = crossings(sQ[:3], sQ[10:13])
    if not h2:
        raise ValueError("ampersand: the arm's right edge does not meet the tail's top")
    h2 = max(h2, key=lambda z: z[0])
    X2q, X2a, X2 = h2[0], (10 + h2[1][0], h2[1][1]), h2[2]
    def on_seg_line(segs, i, p):
        s_ = segs[i]
        d_ = (s_[3][0] - s_[0][0], s_[3][1] - s_[0][1])
        return (i, ((p[0] - s_[0][0]) * d_[0] + (p[1] - s_[0][1]) * d_[1]) / (d_[0] ** 2 + d_[1] ** 2))
    # crossings of the ribbon with itself
    PQ = crossings(sP, sQ)
    QQ = crossings(sQ, sQ, skip_same=8)
    PP = crossings(sP, sP, skip_same=8)
    # J: Q's spine/bowl-outside (index >= 6) on P's diagonal or loop-left (index 2..3)
    # (the spine is segments 6 and 7 of each chain; the diagonal's line 2 and the loop's first curve 3)
    J = [z for z in PQ if z[0][0] in (2, 3) and z[1][0] in (6, 7)]
    J2 = [z for z in PQ if z[0][0] in (6, 7) and z[1][0] in (2, 3)]
    K = [((a, b), p) for a, b, p in QQ if min(a[0], b[0]) in (2, 3) and max(a[0], b[0]) in (6, 7)]
    C1 = [((a, b), p) for a, b, p in PP if min(a[0], b[0]) in (2, 3) and max(a[0], b[0]) in (6, 7)]
    if not (J and J2 and K and C1):
        raise ValueError(f"ampersand: crossing not found J {len(J)} J2 {len(J2)} K {len(K)} C1 {len(C1)}")
    J, J2 = J[0], J2[0]
    (ka, kb), Kp = K[0]
    (ca, cb), C1p = C1[0]
    # every crossing on the diagonal's straight edges, so the outline has one structure at every weight: where the
    # loop's curve would carry one, its straight runs on up to 20 units past it
    need1 = max(J[2][1], C1p[1]) + 20 if 3 in (J[0][0], min(ca, cb)[0]) else None
    need2 = max(J2[2][1], Kp[1]) + 20 if 3 in (J2[1][0], min(ka, kb)[0]) else None
    if (need1 or need2) and not G.get("curve_cross"):
        G2 = dict(G)
        if need1:
            G2["p1_y"] = max(G["p1_y"], need1)
        if need2:
            G2["p2_y"] = max(G["p2_y"], need2)
        return construct(R, G2, sx)
    Kq_lo, Kq_hi = sorted([ka, kb])
    C1_lo, C1_hi = sorted([ca, cb])
    # C2 and X1 lie on the diagonal's lower edge (P's line, index 2): their parameters there
    def tl1(p):
        s = sP[2]
        return (2, (p[1] - s[0][1]) / (s[3][1] - s[0][1]))
    nP, nQ = len(sP), len(sQ)
    # C2 and X1: the bowl's two edges (P's and Q's curve into the arm, index 9) cross the diagonal's lower edge
    L1seg = [(l1(-400), l1(-400), l1(1200), l1(1200))]
    hP = [((9 + a[0], a[1]), b, pt) for a, b, pt in crossings(sP[9:11], L1seg)]
    hQ = [((9 + a[0], a[1]), b, pt) for a, b, pt in crossings(sQ[9:11], L1seg)]
    if not (hP and hQ):
        raise ValueError("ampersand: the bowl's stroke does not cross the diagonal's lower edge on its curve")
    endP, C2 = hP[0][0], hP[0][2]
    endQ, X1 = hQ[0][0], hQ[0][2]
    if not (sP[2][0][1] < X1[1] < sP[2][3][1] and sP[2][0][1] < C2[1] < sP[2][3][1]):
        raise ValueError(f"ampersand: the bowl crosses the diagonal off its straight (X1 {X1}, C2 {C2})")
    # outer contour: Q from the bowl's bottom to X1; P back from X1 to the tip; the cut; Q from the tip to X2; the
    # arm (right edge, serif, left edge) to X3; Q up the diagonal to J2; P back over the loop to J; Q down the bowl
    lb_q = (8, 1.0)                                        # LBo is node 9: end of segment 8
    outer = []
    e_i, a_i = (11, 12) if THROUGH else (10, 11)       # the ease into the arm, the arm's line
    outer += [("L" if THROUGH and i == 10 else "C", s) for s, i in piece(sQ, lb_q, endQ)]
    outer += [("C" if sP[i] is not None and i != 2 else "L", s) for s, i in piece(sP, tl1(X1), (0, 0.0))]
    k_cut = len(outer)
    outer += [("L", (T1, T1, T2, T2))]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sQ, (0, 0.0), X2q)]
    outer += [("C" if i == e_i else "L", s_) for s_, i in piece(sQ, X2a, on_seg_line(sQ, a_i, serif[0][0]))]
    outer += serif[1]
    outer += [("C" if i == e_i else "L", s_) for s_, i in piece(sP, on_seg_line(sP, a_i, serif[2]), X3p)]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sQ, X3q, J2[1])]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sP, J2[0], J[0])]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sQ, J[1], lb_q)]
    # 0.84 (Regular pass 2, items 1 and 5): the crotch under the arm is a sharp inner corner where the arm's lower edge
    # (the bowl's outer edge run on as a line) meets the tail's top (the 0.82 fillet of 0.30 stem broke that edge's line)
    # 0.84 (items 1 and 5): the tail's cut is a free end: both corners softened on the letters' serif-tip radius
    outer = soft_cut(outer, k_cut, SOFT)
    # lower counter: P from C1 (on the spine) down the counter to C2; the diagonal's lower edge back up to C1
    lower = [("L" if THROUGH and i == 10 else "C", s) for s, i in piece(sP, C1_hi, endP)]
    lower += [("C" if i != 2 else "L", s) for s, i in piece(sP, tl1(C2), C1_lo)]
    # upper counter: Q from K on the diagonal's upper edge round the loop's inside to K on the spine
    upper = [("C" if i != 2 else "L", s) for s, i in piece(sQ, Kq_lo, Kq_hi)]
    info.update({"J": J[2], "J2": J2[2], "K": Kp, "C1": C1p, "C2": C2, "X1": X1, "X2": X2, "X3": X3,
                 "widths": W, "sx": sx, "chains": (sP, sQ), "loop": G.get("_loop")})
    return [outer, lower, upper], info


def soft_cut(segs, k, r):
    """The straight cut segs[k] between two curves (or lines): each corner rounded as the letters' serif tips are
    (normalize.soften_ends): the edge cut back r from the corner (along the curve, by its arc length), the cut r in,
    and a cubic between with both handles 0.55 of the way to the corner."""
    a_k, b_k = k - 1, k + 1
    pa, cut, pb = segs[a_k][1], segs[k][1], segs[b_k][1]
    c0, c1 = cut[0], cut[3]
    def back(s, r, at_end):
        # the parameter on s at arc length r from its end (at_end) or start
        n = 200
        pts = [bez(s, i / n) for i in range(n + 1)]
        if at_end:
            pts = pts[::-1]
        acc = 0
        for i in range(n):
            acc += math.dist(pts[i], pts[i + 1])
            if acc >= r:
                t = (i + 1) / n
                return 1 - t if at_end else t
        return 0.5
    ta = back(pa, r, True)
    sa = sub(pa, 0, ta)
    tb = back(pb, r, False)
    sb = sub(pb, tb, 1)
    u = unit((c1[0] - c0[0], c1[1] - c0[1]))
    q0, q1 = (c0[0] + u[0] * r, c0[1] + u[1] * r), (c1[0] - u[0] * r, c1[1] - u[1] * r)
    def corner(p, dp, c, q, dq):
        # each handle 0.55 of the way to the corner, along its edge's own tangent there (a curve's, cut back r, is not
        # the chord to the corner: 4.4 degrees off on the tail's underside)
        lp, lq = 0.55 * math.dist(p, c), 0.55 * math.dist(q, c)
        return (p, (p[0] + dp[0] * lp, p[1] + dp[1] * lp), (q[0] + dq[0] * lq, q[1] + dq[1] * lq), q)
    def tan_end(s):
        d = (s[3][0] - s[2][0], s[3][1] - s[2][1]) if math.dist(s[3], s[2]) > 1e-6 else (s[3][0] - s[0][0], s[3][1] - s[0][1])
        return unit(d)
    def tan_start(s):
        d = (s[0][0] - s[1][0], s[0][1] - s[1][1]) if math.dist(s[1], s[0]) > 1e-6 else (s[0][0] - s[3][0], s[0][1] - s[3][1])
        return unit(d)
    # kind "K": a softened corner's curve, its two nodes corners as the letters' (normalize.soften_ends)
    new = [(segs[a_k][0], sa), ("K", corner(sa[3], tan_end(sa), c0, q0, (-u[0], -u[1]))), ("L", (q0, q0, q1, q1)),
           ("K", corner(q1, u, c1, sb[0], tan_start(sb))), (segs[b_k][0], sb)]
    return segs[:a_k] + new + segs[b_k + 1:]


def v_serif(V, AR, AL, ad, top):
    """v's serif on its thin arm, carried onto this arm: returns (start on the right edge, [segments], end on the left
    edge). Points on v's edge lines keep their height under the serif and slide along this arm's edges; the rest keep
    their offsets from where the edges meet the serif's underside (v's points 1..27; 2 to 4 the right bracket, 4 to 20
    the serif, 20 to 26 the left curl)."""
    yb, yt = V[5][1], V[12][1]
    sv_r = unit((V[2][0] - V[1][0], V[2][1] - V[1][1]))
    sv_l = unit((V[26][0] - V[27][0], V[26][1] - V[27][1]))
    R0 = on_line(V[1][:2], sv_r, yb)
    L0 = on_line(V[27][:2], sv_l, yb)
    yb2 = top - (yt - yb)
    R0n = on_line(AR, ad, yb2)
    L0n = on_line(AL, ad, yb2)
    along_r, along_l = {2, 3}, {25, 26}
    out = {}
    for i in range(2, 27):
        x, y = V[i][:2]
        if i in along_r:
            out[i] = on_line(AR, ad, yb2 + (y - yb))
        elif i in along_l:
            out[i] = on_line(AL, ad, yb2 + (y - yb))
        elif i in (23, 24):                                # the curl's upright side: its offset from the edge
            vl = on_line(V[27][:2], sv_l, y)                   # at its own height, as v has it
            out[i] = (on_line(AL, ad, yb2 + (y - yb))[0] + x - vl[0], yb2 + y - yb)
        elif i <= 12:
            out[i] = (R0n[0] + x - R0[0], yb2 + y - yb)
        else:
            out[i] = (L0n[0] + x - L0[0], yb2 + y - yb)
    segs = []
    i = 2
    while i < 26:
        if V[i + 1][2] is None:
            segs.append(("C", (out[i], out[i + 1], out[i + 2], out[i + 3])))
            i += 3
        else:
            segs.append(("L", (out[i], out[i], out[i + 1], out[i + 1])))
            i += 1
    # the bracket and the curl on this arm's slope: v's places, handles solved as every curve here (one curvature
    # at the curl's node, each curve easing off the arm's straight edge)
    dn = (0.0, -1.0)
    back = (-ad[0], -ad[1])
    r_ = Chain([(on_line(AR, ad, yb2 - 200), ad), (out[2], ad), (out[5], (1.0, 0.0))], ["L", "C"], [False, True, False])
    r_.solve()
    l_ = Chain([(out[20], (1.0, 0.0)), (out[23], dn), (out[26], back), (on_line(AL, ad, yb2 - 200), back)],
               ["C", "C", "L"], [False, True, True, False])
    l_.solve()
    rs, ls = r_.segs(), l_.segs()
    segs[0] = ("C", rs[1])
    segs[-2] = ("C", ls[0])
    segs[-1] = ("C", ls[1])
    return (out[2], None), segs, out[26]


def to_points(segs):
    """[(kind, seg)] closed -> UFO points [(x, y, type, smooth)], rounded; smooth where the tangents run on."""
    pts = []
    n = len(segs)
    for k, (kind, s) in enumerate(segs):
        nxt = segs[(k + 1) % n][1]
        d_in = unit((s[3][0] - s[2][0], s[3][1] - s[2][1])) if math.dist(s[3], s[2]) > 1e-6 else unit((s[3][0] - s[0][0], s[3][1] - s[0][1]))
        d_out = unit((nxt[1][0] - nxt[0][0], nxt[1][1] - nxt[0][1])) if math.dist(nxt[1], nxt[0]) > 1e-6 else unit((nxt[3][0] - nxt[0][0], nxt[3][1] - nxt[0][1]))
        smooth = d_in[0] * d_out[0] + d_in[1] * d_out[1] > math.cos(math.radians(2.0))
        if kind == "K" or segs[(k + 1) % n][0] == "K":     # a softened corner's ends are corners (as the letters')
            smooth = False
        if kind == "L":
            pts.append([s[3][0], s[3][1], "line", smooth])
        else:
            pts.append([s[1][0], s[1][1], None, False])
            pts.append([s[2][0], s[2][1], None, False])
            pts.append([s[3][0], s[3][1], "curve", smooth])
    # rounding: nodes first, then each smooth node's handles back onto one line through the rounded node
    N = len(pts)
    ideal_pts = [tuple(q[:2]) for q in pts]
    for q in pts:
        if q[2]:
            q[0], q[1] = round(q[0]), round(q[1])
    for i, q in enumerate(pts):
        if q[2] and q[3]:
            a, b = pts[i - 1], pts[(i + 1) % N]
            if a[2] is None and b[2] is None:
                d = unit((b[0] - a[0], b[1] - a[1]))
                for hq in (a, b):
                    L = math.dist(hq[:2], q[:2])
                    sg = 1 if hq is b else -1
                    hq[0], hq[1] = q[0] + sg * d[0] * L, q[1] + sg * d[1] * L
            elif a[2] is None or b[2] is None:            # a curve into a line: its handle on the line
                h_, o_ = (a, b) if a[2] is None else (b, a)
                d = unit((q[0] - o_[0], q[1] - o_[1]))
                L = math.dist(h_[:2], q[:2])
                h_[0], h_[1] = q[0] + d[0] * L, q[1] + d[1] * L
    _round_handles(pts)
    _no_infl(pts, ideal_pts)
    if ROUND_EASES:
        _round_eases(pts, ideal_pts)
    out = [(int(q[0]), int(q[1]), q[2], q[3]) for q in pts]
    # drop zero-length lines and doubled nodes
    clean = []
    for q in out:
        if clean and q[2] == "line" and clean[-1][2] and clean[-1][:2] == q[:2]:
            continue
        clean.append(q)
    if clean[-1][2] == "line" and clean[-1][:2] == next(q for q in clean if q[2])[:2]:
        clean.pop()
    # the contour starts at its first on-curve point after the last point (UFO: closed contours start anywhere)
    return clean


def signed_area(P):
    on = [q for q in P if q[2]]
    return sum(on[i - 1][0] * on[i][1] - on[i][0] * on[i - 1][1] for i in range(len(on))) / 2


def outline(R, G=None, sx=1.0):
    cs, info = construct(R, G, sx)
    out = []
    for k, segs in enumerate(cs):
        P = to_points(segs)
        a = signed_area(P)
        want_ccw = k == 0                                  # outer counter-clockwise, counters clockwise (UFO)
        if (a > 0) != want_ccw:
            P = _reverse(P)
        out.append(P)
    if (G or REG).get("loop"):
        out = _even(out)
    return out, info


def _even(cs):
    """0.82 (owner round 8, item 19): every smooth node at one curvature (loops.even_nodes, handle lengths only, as
    the @'s `at.even`), kept where it leaves fewer curvecheck faults (and no worse a ratio) on the whole glyph: the
    arm's fillet and the tail's top merged before it meet the curves beside them with jumps the chains' solver did
    not see."""
    import curvecheck as K
    import loops as LP
    yr = (-1000, 2000)
    b0, w0 = K.report("ampersand", cs, yr)[:2]
    if not b0:
        return cs
    new = [[(round(q[0]), round(q[1]), q[2], q[3]) for q in LP.even_nodes(P, yr)[0]] for P in cs]
    b1, w1 = K.report("ampersand", new, yr)[:2]
    if (len(b1), w1) < (len(b0), w0) and [[q[2] for q in P] for P in new] == [[q[2] for q in P] for P in cs]:
        return new
    return cs


def _reverse(P):
    """Reverse a closed UFO point list, keeping each segment's kind."""
    s0 = next(i for i, q in enumerate(P) if q[2])
    P = P[s0:] + P[:s0]
    segs, cur = [], []
    for q in P[1:] + [P[0]]:
        if q[2] is None:
            cur.append(q)
        else:
            segs.append((cur, q))
            cur = []
    node = [P[0]] + [sg[1] for sg in segs[:-1]]
    out = []
    for k in range(len(segs) - 1, -1, -1):
        offs, end = segs[k]
        nk = node[k]
        out += list(reversed(offs)) + [(nk[0], nk[1], end[2], nk[3])]
    return out


def stretch(R0, R, G=None):
    """The level stretch of a master's skeleton: the loop's counter changes across as o's counter does (the white
    law's letter), its two sides at the master's weights."""
    G = G or REG
    W0, W = widths(R0), widths(R)
    cU = (G["ur"][0] - W0["ur"] / 2) - (G["ul"][0] + W0["ul"] / 2)
    cw = R["o_counter"] / R0["o_counter"]
    return (cU * cw + (W["ul"] + W["ur"]) / 2) / (cU + (W0["ul"] + W0["ur"]) / 2)


def ink_width(R, sx, G=None):
    G = dict(G or REG)
    G["even_ribbon"] = False                                 # 0.84: the width evening moves handles only, not the ink box
    cs, _ = construct(R, G, sx)
    xs = [p[0] for C in cs for _k, s_ in C for p in (s_[0], s_[3])]
    return max(xs) - min(xs)


def spread(G, e):
    """The skeleton with its outer parts spread level by e (units of the Regular): the lower bowl's left side and
    bottom out to the left by half, the tail and the arm out to the right by half; the loop and the diagonal stay."""
    G = dict(G or REG)
    h = e / 2
    G["ll"] = (G["ll"][0] - h, G["ll"][1])
    G["lb_x"] -= h
    for k in ("tb_x", "tt_x", "arm_x"):
        G[k] += h
    for k in ("t1", "t2"):
        G[k] = (G[k][0] + h, G[k][1])
    return G


def widen(R0, R, G=None):
    """A master's skeleton: stretched level as o's counter changes (`stretch`, the loop's white), then its outer parts
    spread (`spread`) until the ink widens as n's advance does. The references' & widen 1.04 to 1.14 at 700 (median
    1.10), 0.98 to 1.05 of their own n's growth (median 1.02); at 300 0.965 to 1.012, 0.97 to 1.03 of n's. Stretched
    alone the Bold & came out 1.065 as wide as the Regular's where n grows 1.098 (0.97 of n's) and its lower counter
    read cramped; stretched whole to n's width, the loop's inside ran back past the diagonal's edge (a spur)."""
    G = dict(G or REG)
    G["_R0"] = R0                                           # 0.82 item 19: the loop's rule reads the Regular's
    sx = stretch(R0, R, G)
    want = ink_width(R0, 1.0, G) * R["n"] / R0["n"]
    a, b = 0.0, 10.0
    fa, fb = ink_width(R, sx, spread(G, a)) - want, ink_width(R, sx, spread(G, b)) - want
    for _ in range(12):
        if abs(fb) < 0.2 or fb == fa:
            break
        a, b, fa = b, b - fb * (b - a) / (fb - fa), fb
        fb = ink_width(R, sx, spread(G, b)) - want
    b = max(0.0, b)                                         # towards the Light the stretch alone keeps the ink at
    return sx, spread(G, b), b                              # 1.008 of n's change (references 0.97 to 1.03): no spread


def _seg_at(pts, i, side):
    """The cubic on one side of node i in a closed UFO point list: (p0, p1, p2, p3) running away from the node."""
    n = len(pts)
    if side > 0:
        q = [pts[(i + k) % n] for k in range(4)]
    else:
        q = [pts[(i - k) % n] for k in range(4)]
    return tuple((p[0], p[1]) for p in q)


def _round_handles(pts):
    """Whole units: nodes rounded; at every smooth node between two curves the two handles are put on the whole-unit
    points near their ideal places that keep them on one line (under 0.5 degrees where it can) with the curvature
    most nearly one value across the node; elsewhere a handle is rounded."""
    n = len(pts)
    ideal = [tuple(q[:2]) for q in pts]
    for q in pts:
        q[0], q[1] = round(q[0]), round(q[1])
    for i, q in enumerate(pts):
        a, b = pts[i - 1], pts[(i + 1) % n]
        if not (q[2] and q[3] and a[2] is None and b[2] is None):
            continue
        ia, ib = ideal[i - 1], ideal[(i + 1) % n]
        best = None
        cand = lambda p: [(math.floor(p[0]) + dx, math.floor(p[1]) + dy) for dx in (-2, -1, 0, 1, 2, 3) for dy in (-2, -1, 0, 1, 2, 3)]
        sa0, sb0 = _seg_at(pts, i, -1), _seg_at(pts, i, 1)
        # an extreme (both handles level or upright) keeps its handles on its axis: a handle a unit off it makes an
        # extreme inside the curve between masters (audit_axis turns, the mid master's upper counter at 503)
        upright = abs(ia[0] - q[0]) < 0.5 and abs(ib[0] - q[0]) < 0.5
        level = abs(ia[1] - q[1]) < 0.5 and abs(ib[1] - q[1]) < 0.5
        on_axis = lambda c: (not upright or c[0] == q[0]) and (not level or c[1] == q[1])   # noqa: E731
        for ca in filter(on_axis, cand(ia)):
            for cb in filter(on_axis, cand(ib)):
                ua = (ca[0] - q[0], ca[1] - q[1])
                ub = (cb[0] - q[0], cb[1] - q[1])
                la, lb = math.hypot(*ua), math.hypot(*ub)
                if la < 1 or lb < 1:
                    continue
                g1 = math.degrees(math.acos(max(-1, min(1, -(ua[0] * ub[0] + ua[1] * ub[1]) / (la * lb)))))
                if g1 > 1.8:
                    continue
                sa = (sa0[0], ca, sa0[2], sa0[3])
                sb = (sb0[0], cb, sb0[2], sb0[3])
                ka, kb = abs(curvature(sa, 0.0)), abs(curvature(sb, 0.0))
                r = max(ka, kb) / max(min(ka, kb), 1e-9)
                d = math.dist(ca, ia) + math.dist(cb, ib)
                key = (_infl(sa) + _infl(sb), _waves(sa) + _waves(sb), r > 1.15, r + 0.02 * d + 0.1 * g1)
                if best is None or key < best[0]:
                    best = (key, ca, cb)
        if best:
            a[0], a[1] = best[1]
            b[0], b[1] = best[2]


def _round_eases(pts, ideal):
    """0.84 (Regular pass 2, second pass): where a curve runs into a straight at a smooth node, the curvature at the join
    is set by how far the curve's far handle stands off the straight's line: that handle takes the whole-unit place
    within 1 of its rounded one whose distance from the line is nearest the drawn one's (the arm's ease ends nearly
    flat; rounded on its own, half a unit of that handle read as a curve leaving the straight at 0.62 of its tightest)."""
    n = len(pts)
    for i, q in enumerate(pts):
        if not (q[2] and q[3]):
            continue
        a, b = pts[i - 1], pts[(i + 1) % n]
        if a[2] is None and b[2] is not None and q[2] == "curve":     # a curve arrives, a line leaves
            near, far, other = (i - 1) % n, (i - 2) % n, (i - 3) % n
        elif b[2] is None and q[2] == "line" and pts[(i + 3) % n][2] == "curve":   # a line arrives, a curve leaves
            near, far, other = (i + 1) % n, (i + 2) % n, (i + 3) % n
        else:
            continue
        if pts[other][3]:                                   # the far handle is a smooth node's: its line stays
            continue
        # the line's own direction (from its far end to the node), and the near handle on it: of the whole-unit places
        # within 1 of it, the one nearest that line
        o_ = pts[(i + 1) % n] if q[2] == "curve" else pts[i - 1]
        lin = (q[0] - o_[0], q[1] - o_[1]) if q[2] == "curve" else (o_[0] - q[0], o_[1] - q[1])
        ml = math.hypot(*lin)
        if ml < 1e-9:
            continue
        lu = (-lin[0] / ml, -lin[1] / ml) if q[2] == "curve" else (lin[0] / ml, lin[1] / ml)
        hx, hy = pts[near][0], pts[near][1]
        side = lambda p_: abs((p_[0] - q[0]) * lu[1] - (p_[1] - q[1]) * lu[0])        # noqa: E731
        along = lambda x_, y_: (x_ - q[0]) * lu[0] + (y_ - q[1]) * lu[1]     # noqa: E731
        sg_ = 1 if along(hx, hy) > 0 else -1
        cand = [(side((hx + dx, hy + dy)), abs(dx) + abs(dy), hx + dx, hy + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)
                if sg_ * along(hx + dx, hy + dy) > 1]
        if cand:
            b_ = min(cand)
            pts[near][0], pts[near][1] = b_[2], b_[3]
        d = (pts[near][0] - q[0], pts[near][1] - q[1])
        m = math.hypot(*d)
        if m < 1e-9:
            continue
        u = (d[0] / m, d[1] / m)
        off = lambda p_: (p_[0] - q[0]) * u[1] - (p_[1] - q[1]) * u[0]     # noqa: E731
        want = off(ideal[far])
        x0, y0 = pts[far][0], pts[far][1]
        best = min(((abs(off((x0 + dx, y0 + dy)) - want), abs(dx) + abs(dy), x0 + dx, y0 + dy)
                    for dx in (-1, 0, 1) for dy in (-1, 0, 1)))
        pts[far][0], pts[far][1] = best[2], best[3]

def _no_infl(pts, ideal):
    """0.82 (owner round 8, item 19): a cubic whose drawn form turns one way and whose rounded control polygon turns
    both ways (a nearly straight run into a corner, the bowl's bottom into the diagonal in the mid master) takes the
    whole-unit handles nearest its drawn ones that turn one way."""
    n = len(pts)
    for i, q in enumerate(pts):
        if not q[2]:
            continue
        a, b, e = pts[(i + 1) % n], pts[(i + 2) % n], pts[(i + 3) % n]
        if a[2] is not None or b[2] is not None:
            continue
        seg = lambda h1, h2: ((q[0], q[1]), h1, h2, (e[0], e[1]))           # noqa: E731
        ia, ib = ideal[(i + 1) % n], ideal[(i + 2) % n]
        if _infl(seg(ia, ib)) or not _infl(seg((a[0], a[1]), (b[0], b[1]))):
            continue
        best = None
        for dx1 in (-1, 0, 1):
            for dy1 in (-1, 0, 1):
                for dx2 in (-1, 0, 1):
                    for dy2 in (-1, 0, 1):
                        h1, h2 = (a[0] + dx1, a[1] + dy1), (b[0] + dx2, b[1] + dy2)
                        if _infl(seg(h1, h2)):
                            continue
                        d = math.dist(h1, ia) + math.dist(h2, ib)
                        if best is None or d < best[0]:
                            best = (d, h1, h2)
        if best:
            a[0], a[1] = best[1]
            b[0], b[1] = best[2]


def _infl(s):
    """1 when a cubic's control polygon turns both ways (an inflection the rounding made), else 0."""
    legs = [(s[k + 1][0] - s[k][0], s[k + 1][1] - s[k][1]) for k in range(3)]
    cr = [a[0] * b[1] - a[1] * b[0] for a, b in zip(legs, legs[1:])]
    return 1 if cr[0] * cr[1] < -1e-9 else 0


def _waves(s):
    """curvecheck's wave count on one cubic (a flat place: |k| falls by over a tenth of its largest and rises)."""
    ak = [abs(curvature(s, i / 64)) for i in range(65)]
    top = max(ak) or 1e-9
    waves, ref, d = 0, ak[0], 0
    for v in ak[1:]:
        if abs(v - ref) < 0.10 * top:
            continue
        sg = 1 if v > ref else -1
        if d == -1 and sg == 1:
            waves += 1
        d, ref = sg, v
    return waves


def _put(g, cs):
    from ufoLib2.objects import Contour, Point
    g.clearContours()
    for P in cs:
        c = Contour()
        c.points = [Point(x, y, t, smooth=sm) for x, y, t, sm in P]
        g.contours.append(c)


def regular(font, name="ampersand"):
    """The Regular's ampersand from the construction at the Regular's letters; its side bearings kept."""
    g = font[name]
    xs = [p.x for c in g.contours for p in c.points]
    lsb, rsb = min(xs), g.width - max(xs)
    cs, info = outline(readings(font))
    nx = [q[0] for P in cs for q in P]
    dx = round(lsb - min(nx))
    cs = [[(x + dx, y, t, sm) for x, y, t, sm in P] for P in cs]
    _put(g, cs)
    g.width = round(max(nx) + dx + rsb)
    g.lib[LIB] = {"version": 1}
    return f"{name}: built (advance {g.width}; corners " + ", ".join(f"{k} {round(v[0])},{round(v[1])}" for k, v in info.items() if isinstance(v, tuple) and k not in ("chains", "loop")) + ")"


def _mix(R0, R1, t):
    out = {}
    for k, v in R0.items():
        if k == "v":
            out[k] = [(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t) + tuple(a[2:]) for a, b in zip(v, R1[k])]
        else:
            out[k] = v + (R1[k] - v) * t
    return out


def master(reg, font, sides, tm=None, layer=None, name="ampersand"):
    """A master's ampersand: the construction at this master's letters' weights, the skeleton stretched level so the
    loop's counter changes as o's does; sides(reg_contours, new_contours) -> (shift, width) as the engine sets a
    sign's sides. With a mid layer and tm (the mid master's share of the way to this master), the mid master's
    ampersand is the construction at the readings that far along, its ink placed that far between the two."""
    if name not in reg or LIB not in reg[name].lib or name not in font:
        return None
    R0, R = readings(reg), readings(font)
    sx, Gm, e = widen(R0, R)
    cs, info = outline(R, Gm, sx)
    g0 = reg[name]
    R_c = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g0.contours]
    if [len(P) for P in cs] != [len(P) for P in R_c] or any(
            [q[2] for q in P] != [q[2] for q in Q] for P, Q in zip(cs, R_c)):
        raise ValueError(f"{name}: the master's construction does not match the Regular's points: "
                         f"{[len(P) for P in cs]} against {[len(P) for P in R_c]}; readings {dict((k, v) for k, v in R.items() if k != 'v')}")
    shift, width = sides(R_c, cs)
    cs = [[(x + shift, y, t, sm) for x, y, t, sm in P] for P in cs]
    _put(font[name], cs)
    font[name].width = width
    note = f"{name}: construction x{sx:.3f}, spread {e:+.0f} ink {ink_width(R, sx, Gm):.0f} (diagonal {R['thick']:.0f}, sides {R['r']:.0f}, hairline {R['h']:.0f}, bottom {R['arch']:.0f}, arm {R['thin']:.0f})"
    if layer is not None and tm is not None:
        Rm = _mix(R0, R, tm)
        sxm, Gmm, _e = widen(R0, Rm)
        cm, _ = outline(Rm, Gmm, sxm)
        if [[q[2] for q in P] for P in cm] != [[q[2] for q in P] for P in cs]:
            raise ValueError(f"{name}: the mid master's construction does not match")
        x0 = min(q[0] for P in R_c for q in P)
        x1 = min(q[0] for P in cs for q in P)
        dx = round(x0 + (x1 - x0) * tm - min(q[0] for P in cm for q in P))
        cm = [[(x + dx, y, t, sm) for x, y, t, sm in P] for P in cm]
        if name not in layer:
            layer.newGlyph(name)
        _put(layer[name], cm)
        layer[name].width = round(g0.width + (width - g0.width) * tm)
        note += f"; mid master at {tm:.3f}"
    return note
