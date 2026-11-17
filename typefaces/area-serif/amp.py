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
    "top": 721.0, "bottom": -9.0,
}
TENSION = 0.56          # handles' share of their reach where nothing else decides (the bowl's 0.57 outside, 0.61 in)
RATIO = 1.25            # curvecheck.RATIO
EASE = 0.45             # curvecheck.EASE


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

    def __init__(self, nodes, kinds, smooth, inflect=()):
        self.nodes, self.kinds, self.smooth, self.inflect = nodes, kinds, smooth, set(inflect)
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
        """Handle lengths (least squares, each handle's share of its reach): one curvature on both sides of every
        smooth node between two curves; a curve leaving a straight eases (its curvature there at most 0.35 of its
        tightest); no flat place and no inflection inside a curve; otherwise near TENSION; inside the triangle."""
        idx = [i for i, k in enumerate(self.kinds) if k == "C"]
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
                out.append(20 * max(0.0, dip - 0.04))                           # a flat place
            for n in range(1, len(self.nodes) - 1):
                if not self.smooth[n]:
                    continue
                ka, kb = self.kinds[n - 1], self.kinds[n]
                if ka == "C" and kb == "C":
                    k1, k2 = curvature(S[n - 1], 1.0), curvature(S[n], 0.0)
                    out.append(0.0 if n in self.inflect else 6 * math.log((abs(k1) + 1e-6) / (abs(k2) + 1e-6)))
                elif ka != kb:
                    s, at = (S[n], 0.0) if kb == "C" else (S[n - 1], 1.0)
                    u0 = unit((s[1][0] - s[0][0], s[1][1] - s[0][1]))
                    u1 = unit((s[3][0] - s[2][0], s[3][1] - s[2][1]))
                    turn = math.acos(max(-1, min(1, u0[0] * u1[0] + u0[1] * u1[1])))
                    L = sum(math.dist(bez(s, t / 24), bez(s, (t + 1) / 24)) for t in range(24))
                    out.append(10 * max(0.0, abs(curvature(s, at)) / (turn / L + 1e-9) - 0.30))   # over the mean
            return np.array(out)

        from scipy.optimize import least_squares
        x0 = np.array([math.log(TENSION)] * (2 * len(idx)))
        r = least_squares(res, x0, bounds=(lo, hi), method="trf", diff_step=1e-4, xtol=1e-10, ftol=1e-10, max_nfev=4000)
        self.last = r
        put(r.x)
        return float(np.sum(r.fun ** 2))


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
    return {"r": r, "h": h, "arch": arch, "thin": thin, "thick": thick, "o_counter": ocw, "n": float(font["n"].width),
            "v": serif}


def widths(R):
    return {"diag": R["thick"], "ul": R["thick"], "ut": R["h"], "ur": (R["r"] + R["h"]) / 2, "sp": R["h"],
            "ll": R["r"], "lb": R["arch"], "tail": R["arch"], "arm": R["thin"]}


# ------------------------------------------------------------------ the construction
def construct(R, G=None, sx=1.0):
    """R: readings; G: skeleton (REG); sx: level stretch of the skeleton about x 0. Returns (contours, info)."""
    G = dict(G or REG)
    W = widths(R)
    X = lambda x: x * sx
    top, bot = G["top"], G["bottom"]
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
    ULo, ULi = (X(ul[0]) - W["ul"] / 2, ul[1]), (X(ul[0]) + W["ul"] / 2, ul[1])
    URo, URi = (X(ur[0]) + W["ur"] / 2, ur[1]), (X(ur[0]) - W["ur"] / 2, ur[1])
    UTo, UTi = (X(G["ut_x"]), top), (X(G["ut_x"]), top - W["ut"])
    LLo, LLi = (X(ll[0]) - W["ll"] / 2, ll[1]), (X(ll[0]) + W["ll"] / 2, ll[1])
    LBo, LBi = (X(G["lb_x"]), bot), (X(G["lb_x"]), bot + W["lb"])
    # the spine's inflection: where it crosses the diagonal's centreline
    sc = on_line(c0, dd, G["sp_y"])
    sd = unit((-math.cos(math.radians(G["sp_deg"])) * sx, -math.sin(math.radians(G["sp_deg"]))))   # down-left
    sn = (-sd[1], sd[0])                                   # its left: towards lower-right ... (B side)
    if sn[0] < 0:
        sn = (-sn[0], -sn[1])
    SA = (sc[0] - sn[0] * W["sp"] / 2, sc[1] - sn[1] * W["sp"] / 2)     # upper-left edge (Q)
    SB = (sc[0] + sn[0] * W["sp"] / 2, sc[1] + sn[1] * W["sp"] / 2)     # lower-right edge (P)
    # bowl into the diagonal
    C2 = l1(G["c2_y"])
    X1 = l1(G["x1_y"])
    c2d = unit((math.cos(math.radians(G["c2_deg"])), math.sin(math.radians(G["c2_deg"]))))
    x1d = unit((math.cos(math.radians(G["x1_deg"])), math.sin(math.radians(G["x1_deg"]))))
    # tail
    TB = (X(G["tb_x"]), bot)
    TT = (X(G["tt_x"]), bot + W["tail"])
    T1, T2 = (X(G["t1"][0]), G["t1"][1]), (X(G["t2"][0]), G["t2"][1])
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
    P = Chain([(T1, (-t1d[0], -t1d[1])), (TB, L), (l1(G["p3_y"]), up), (l1(G["p1_y"]), up), (ULo, U), (UTo, Rt),
               (URo, D), (SB, sd), (LLi, D), (LBi, Rt), (C2, c2d)],
              ["C", "C", "L", "C", "C", "C", "C", "C", "C", "C"],
              [False, True, True, True, True, True, True, True, True, True, False], inflect=[7])
    Q = Chain([(T2, (-t2d[0], -t2d[1])), (TT, L), (l2(p4_y), up), (l2(G["p2_y"]), up), (ULi, U), (UTi, Rt),
               (URi, D), (SA, sd), (LLo, D), (LBo, Rt), (X1, x1d)],
              ["C", "C", "L", "C", "C", "C", "C", "C", "C", "C"],
              [False, True, True, True, True, True, True, True, True, True, False], inflect=[7])
    P.solve()
    Q.solve()
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
    X3 = meet(AL, ad, L2p, dd)
    X3 = (AL[0] + ad[0] * X3, AL[1] + ad[1] * X3)
    tq = ((X3[1] - sQ[iL2][0][1]) / (sQ[iL2][3][1] - sQ[iL2][0][1]))
    X3q = (iL2, tq)
    # X2: the arm's right edge meets the tail's top (Q, before the line)
    h = cross_line(sQ[:3], AR, ad, lambda hs: max(hs, key=lambda z: z[0]))
    X2q, X2 = h[0], h[2]
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
    if need1 or need2:
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
    endP, endQ = (nP - 1, 1.0), (nQ - 1, 1.0)
    # outer contour: Q from the bowl's bottom to X1; P back from X1 to the tip; the cut; Q from the tip to X2; the
    # arm (right edge, serif, left edge) to X3; Q up the diagonal to J2; P back over the loop to J; Q down the bowl
    lb_q = (8, 1.0)                                        # LBo is node 9: end of segment 8
    outer = []
    outer += [("C", s) for s, _ in piece(sQ, lb_q, endQ)]
    outer += [("C" if sP[i] is not None and i != 2 else "L", s) for s, i in piece(sP, tl1(X1), (0, 0.0))]
    outer += [("L", (T1, T1, T2, T2))]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sQ, (0, 0.0), X2q)]
    outer += [("L", (X2, X2, serif[0][0], serif[0][0]))]
    outer += serif[1]
    outer += [("L", (serif[2], serif[2], X3, X3))]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sQ, X3q, J2[1])]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sP, J2[0], J[0])]
    outer += [("C" if i != 2 else "L", s) for s, i in piece(sQ, J[1], lb_q)]
    # lower counter: P from C1 (on the spine) down the counter to C2; the diagonal's lower edge back up to C1
    lower = [("C", s) for s, _ in piece(sP, C1_hi, endP)]
    lower += [("C" if i != 2 else "L", s) for s, i in piece(sP, tl1(C2), C1_lo)]
    # upper counter: Q from K on the diagonal's upper edge round the loop's inside to K on the spine
    upper = [("C" if i != 2 else "L", s) for s, i in piece(sQ, Kq_lo, Kq_hi)]
    info.update({"J": J[2], "J2": J2[2], "K": Kp, "C1": C1p, "C2": C2, "X1": X1, "X2": X2, "X3": X3,
                 "widths": W, "sx": sx})
    return [outer, lower, upper], info


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
        if kind == "L":
            pts.append([s[3][0], s[3][1], "line", smooth])
        else:
            pts.append([s[1][0], s[1][1], None, False])
            pts.append([s[2][0], s[2][1], None, False])
            pts.append([s[3][0], s[3][1], "curve", smooth])
    # rounding: nodes first, then each smooth node's handles back onto one line through the rounded node
    N = len(pts)
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
    return out, info


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
                key = (_waves(sa) + _waves(sb), r > 1.15, r + 0.02 * d + 0.1 * g1)
                if best is None or key < best[0]:
                    best = (key, ca, cb)
        if best:
            a[0], a[1] = best[1]
            b[0], b[1] = best[2]


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
    return f"{name}: built (advance {g.width}; corners " + ", ".join(f"{k} {round(v[0])},{round(v[1])}" for k, v in info.items() if isinstance(v, tuple)) + ")"


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
