"""Area Serif 0.85 (Regular pass 8): the ampersand of 0.81 again, its loop stood upright.

The owner, on the 0.81 Regular ampersand (`build/snap081`): "this old ampersand looks better, but the top part looks
like it leans a little bit to the right side." So the 0.81 Regular outline is the shape (`BASE`, our own earlier
drawing, taken point for point: the upper loop, the long diagonal, the big lower-left bowl, the arm rising to its flat
serif, the tail ending in a cut), with one change of form and the rules that came after it:

1. The loop stands upright (`upright`): the outer loop (between its two corners on the diagonal, 0.81 points 42 and 54)
   and its counter are turned about the counter's foot (the tip where the loop's two inner edges meet) by `LEAN`
   degrees each, then every extreme's handles are put back on their axis (level at the tops, upright at the sides), so
   the extremes stay on their nodes. Read by `build/owner15/amp/tools/lean.py`: a line through the midpoints of level
   chords across the outer loop and across its counter.
2. The strokes on the ladder (`ladder.py`): the diagonal the capital stem (0.81 read 92 across its two straight edges;
   the & is a capital-height sign and its diagonal a capital's thick diagonal, `CAP_STEM` 86); the loop's top the
   capital hairline (`CAP_HAIR` 47; 0.81 had 62): the counter's top raised, the counter stretched upright about its
   foot so its sides keep their width.
3. Heights on the capitals' lines: top 721, bowl and tail -9 (O's; 0.81 had them already).
4. Corners by the 0.84 corner rule: the tail's free end cut the serif tip across (`TIP` 30; 0.81 cut 21) with both
   corners on the letters' radius (`SOFT` 7), its nodes corners; inner corners (crotches, the counters' tips) sharp.
5. Clean points: an extreme on a node everywhere; each smooth node's handle lengths solved so the curvature on its two
   sides agrees (curvecheck's 1.25); the arm's bracket (the curve from its straight lower edge into the serif) leaves
   the straight at no more than 0.40 of its tightest (curvecheck's ease).

The crossings are 0.81's: each hidden edge runs on as one arc (the visible ends' tangents either side of their chord),
none of 0.84's `amp.py` shape decisions (the even bowl taper, `THROUGH`, the arm curving into the crossing) applies.

In a master (`master`, called from `bold.bold_font` where `amp.master` was): the Regular's outline with every node moved
along its normal by half its stroke's growth, the growth the Regular's thickness there times the master's own law for
that thickness (o's hairline at the hairline, v's thin at the thin diagonal, n's stem at the stem, interpolated between;
read by `amp.readings`), a corner where its two edges' offsets meet; then the loop's counter widened level (its right
side and top) until it changes as o's counter does. The mid master takes the readings that far along. One point
structure in every master.
"""
import math

import ladder as LD

LIB = "area.amp81"

# The 0.81 Regular ampersand (build/snap081/AreaSerif-Regular.ufo), point for point: outer, lower counter, loop counter.
WIDTH81 = 810
BASE = [
    [(229, -9, 'curve', True), (312, -9, None, False), (397, 29, None, False), (457, 93, 'curve', False), (533, 17, None, False), (579, -9, None, False), (640, -9, 'curve', True), (714, -9, None, False), (762, 36, None, False), (774, 104, 'curve', False), (754, 110, 'line', False), (734, 68, None, False), (718, 57, None, False), (686, 57, 'curve', True), (630, 57, None, False), (573, 89, None, False), (521, 160, 'curve', False), (655, 355, 'line', True), (670, 377, None, False), (704, 404, None, False), (743, 404, 'curve', True), (746, 404, None, False), (750, 407, None, False), (750, 411, 'curve', True), (750, 427, 'line', True), (750, 431, None, False), (746, 434, None, False), (743, 434, 'curve', True), (550, 434, 'line', True), (546, 434, None, False), (543, 431, None, False), (543, 427, 'curve', True), (543, 411, 'line', True), (543, 407, None, False), (546, 404, None, False), (550, 404, 'curve', True), (584, 404, None, False), (598, 391, None, False), (598, 370, 'curve', True), (598, 332, None, False), (553, 267, None, False), (494, 195, 'curve', False), (345, 386, 'line', False), (447, 456, None, False), (487, 513, None, False), (487, 581, 'curve', True), (487, 660, None, False), (430, 721, None, False), (348, 721, 'curve', True), (254, 721, None, False), (192, 643, None, False), (192, 536, 'curve', True), (192, 481, None, False), (205, 436, None, False), (245, 379, 'curve', False), (99, 309, None, False), (38, 239, None, False), (38, 157, 'curve', True), (38, 64, None, False), (118, -9, None, False)],
    [(262, 55, 'curve', True), (192, 55, None, False), (131, 100, None, False), (131, 168, 'curve', True), (131, 231, None, False), (191, 291, None, False), (271, 335, 'curve', False), (430, 127, 'line', False), (377, 80, None, False), (313, 55, None, False)],
    [(319, 423, 'curve', False), (289, 467, None, False), (271, 515, None, False), (271, 569, 'curve', True), (271, 630, None, False), (295, 659, None, False), (335, 659, 'curve', True), (378, 659, None, False), (408, 626, None, False), (408, 568, 'curve', True), (408, 512, None, False), (378, 469, None, False)],
]
# 0.81 point numbers (contour, index)
LOOP_OUT = range(43, 54)            # the outer loop between its corners on the diagonal (42 and 54), handles included
TIP = (2, 0)                        # the loop counter's foot: where its two inner edges meet on the diagonal
EXTREMES = {(0, 45): "v", (0, 48): "h", (0, 51): "v", (2, 3): "v", (2, 6): "h", (2, 9): "v"}
DIAG = (((1, 6), (1, 7), (1, 5), (1, 8)), ((0, 41), (0, 42), (0, 40), (0, 43)))   # its two straight edges (+ handles)
TOP, BOTTOM = 721, -9               # O's lines

# The lean: degrees each part turns about the counter's foot (+ = anticlockwise, the top to the left). Read on 0.81
# (lean.py): outer +4.03, counter -0.89 degrees off upright; the outer top 8.5 right of the loop's middle, the
# counter's 4.5 left of it. Candidates (build/owner15/amp/candidates.png): A (2, 0), B (3.5, 0.5), C (4, -1); the pick:
LEAN_CANDIDATES = {"A": (-8.5, 0.0), "B": (-11.0, 2.0), "C": (-14.0, -1.0)}
LEAN = LEAN_CANDIDATES["B"]

SOFT = 7.0                          # a free end's corners (derive.SOFT; amp.SOFT)
EASE_MAX = 0.40                     # the arm's bracket (curvecheck.EASE 0.45, with margin)
RATIO_MAX = 1.20                    # a smooth node's curvature, larger over smaller (curvecheck.RATIO 1.25)


# ------------------------------------------------------------------ geometry
def _rot(p, c, deg):
    a = math.radians(deg)
    x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * math.cos(a) - y * math.sin(a), c[1] + x * math.sin(a) + y * math.cos(a))


def _unit(d):
    n = math.hypot(*d)
    return (d[0] / n, d[1] / n) if n else (0.0, 0.0)


def _bez(s, t):
    u = 1 - t
    return tuple(u ** 3 * s[0][k] + 3 * u * u * t * s[1][k] + 3 * u * t * t * s[2][k] + t ** 3 * s[3][k] for k in (0, 1))


def _d1(s, t):
    u = 1 - t
    return tuple(3 * u * u * (s[1][k] - s[0][k]) + 6 * u * t * (s[2][k] - s[1][k]) + 3 * t * t * (s[3][k] - s[2][k])
                 for k in (0, 1))


def _d2(s, t):
    u = 1 - t
    return tuple(6 * u * (s[2][k] - 2 * s[1][k] + s[0][k]) + 6 * t * (s[3][k] - 2 * s[2][k] + s[1][k]) for k in (0, 1))


def _k(s, t):
    a, b = _d1(s, t), _d2(s, t)
    n = math.hypot(*a)
    return (a[0] * b[1] - a[1] * b[0]) / n ** 3 if n > 1e-9 else 0.0


def _split(s, t):
    p0, p1, p2, p3 = s
    l = lambda a, b: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    a, b, c = l(p0, p1), l(p1, p2), l(p2, p3)
    d, e = l(a, b), l(b, c)
    f = l(d, e)
    return (p0, a, d, f), (f, e, c, p3)


def _segs(P):
    """A contour's segments: (i0, [indices of the segment's points], kind)."""
    n = len(P)
    ons = [i for i, q in enumerate(P) if q[2]]
    out = []
    for j, i0 in enumerate(ons):
        i1 = ons[(j + 1) % len(ons)]
        idx = [(i0 + k) % n for k in range(((i1 - i0) % n) + 1)]
        out.append((idx, "C" if len(idx) == 4 else "L"))
    return out


# ------------------------------------------------------------------ the Regular
def _move(cs, ci, i, d):
    x, y, t, sm = cs[ci][i]
    cs[ci][i] = (x + d[0], y + d[1], t, sm)


def _set(cs, ci, i, p):
    x, y, t, sm = cs[ci][i]
    cs[ci][i] = (p[0], p[1], t, sm)


def upright(cs, lean=None):
    """The loop stood upright: the upper half of the outer loop and of its counter turned level (a shear about the
    height of each one's side extremes, nothing below it moves, so the loop's foot and its corners on the diagonal
    stay), the outer's top moved lean[0] units and the counter's lean[1] (- = left); every extreme's handles back on
    their axis (lengths kept), so each extreme stays on its node."""
    do, di = lean or LEAN
    for ci, idx, top in ((0, LOOP_OUT, 48), (2, range(1, len(cs[2])), 6)):
        sides = [i for (c_, i), ax in EXTREMES.items() if c_ == ci and ax == "v"]
        ym = sum(cs[ci][i][1] for i in sides) / len(sides)
        k = (do if ci == 0 else di) / (cs[ci][top][1] - ym)
        for i in idx:
            x, y = cs[ci][i][:2]
            if y > ym:
                _set(cs, ci, i, (x + k * (y - ym), y))
    for (ci, i), ax in EXTREMES.items():
        P = cs[ci]
        n = len(P)
        p = P[i]
        for j in ((i - 1) % n, (i + 1) % n):
            h = P[j]
            L = math.hypot(h[0] - p[0], h[1] - p[1])
            if ax == "h":
                _set(cs, ci, j, (p[0] + math.copysign(L, h[0] - p[0]), p[1]))
            else:
                _set(cs, ci, j, (p[0], p[1] + math.copysign(L, h[1] - p[1])))
    return cs


def loop_top(cs, hair=None):
    """The loop's top the capital hairline: the counter stretched upright about its foot until its top stands
    `hair` under the outer top (level and upright tangents stay so: the extremes stay on their nodes)."""
    hair = hair or LD.CAP_HAIR
    y0 = cs[TIP[0]][TIP[1]][1]
    top = cs[2][6][1]
    s = (cs[0][48][1] - hair - y0) / (top - y0)
    for i in range(1, len(cs[2])):
        x, y, t, sm = cs[2][i]
        cs[2][i] = (x, y0 + (y - y0) * s, t, sm)
    return s


def _line_dist(a, b, c, d):
    """Distance from the middle of cd to the line ab."""
    u = _unit((b[0] - a[0], b[1] - a[1]))
    m = ((c[0] + d[0]) / 2 - a[0], (c[1] + d[1]) / 2 - a[1])
    return abs(m[0] * u[1] - m[1] * u[0])


def diagonal(cs, w=None):
    """The diagonal's two straight edges moved along their normals, half each, until it is `w` across."""
    w = w or LD.CAP_STEM
    (a, b, ha, hb), (c, d, hc, hd) = DIAG
    P = lambda k: cs[k[0]][k[1]][:2]
    now = (_line_dist(P(a), P(b), P(c), P(d)) + _line_dist(P(c), P(d), P(a), P(b))) / 2
    e = (now - w) / 2
    for (p, q, hp, hq) in DIAG:
        u = _unit((P(q)[0] - P(p)[0], P(q)[1] - P(p)[1]))
        n = (u[1], -u[0])                      # right of travel: away from the ink
        mv = (-n[0] * e, -n[1] * e)            # into the ink
        for k in (p, q, hp, hq):
            _move(cs, k[0], k[1], mv)
    return now


def _arc_handles(r, a):
    return 4 / 3 * math.tan(a / 4) * r


def tail_cut(P, w=None, r=SOFT):
    """The tail's free end (0.81 points 9 and 10, a straight cut between a curve in and a curve out): the cut made
    `w` across, half at each end along itself, each corner rounded on radius r (a quarter-ish arc, its nodes
    corners). Returns the new outer contour."""
    w = w or LD.TIP
    p9, p10 = P[9][:2], P[10][:2]
    u = _unit((p10[0] - p9[0], p10[1] - p9[1]))
    e = (w - math.dist(p9, p10)) / 2
    Q = list(P)
    for i, s in ((8, -1), (9, -1), (10, 1), (11, 1)):
        x, y, t, sm = Q[i]
        Q[i] = (x + s * u[0] * e, y + s * u[1] * e, t, sm)
    cin = (Q[6][:2], Q[7][:2], Q[8][:2], Q[9][:2])
    cout = (Q[10][:2], Q[11][:2], Q[12][:2], Q[13][:2])
    tin = _unit(_d1(cin, 1.0))
    a1 = math.acos(max(-1, min(1, tin[0] * u[0] + tin[1] * u[1])))
    tout = _unit(_d1(cout, 0.0))
    a2 = math.acos(max(-1, min(1, u[0] * tout[0] + u[1] * tout[1])))
    d1, d2 = r * math.tan(a1 / 2), r * math.tan(a2 / 2)

    def cut_at(s, dist, from_end):
        lo, hi = 0.0, 1.0
        end = s[3] if from_end else s[0]
        for _ in range(60):
            m = (lo + hi) / 2
            dd = math.dist(_bez(s, m), end)
            if from_end:
                lo, hi = (m, hi) if dd > dist else (lo, m)
            else:
                lo, hi = (lo, m) if dd > dist else (m, hi)
        return (lo + hi) / 2

    t1 = cut_at(cin, d1, True)
    A, _ = _split(cin, t1)
    t2 = cut_at(cout, d2, False)
    _, B = _split(cout, t2)
    P1, P2 = A[3], (Q[9][0] + u[0] * d1, Q[9][1] + u[1] * d1)
    P3, P4 = (Q[10][0] - u[0] * d2, Q[10][1] - u[1] * d2), B[0]
    k1, k2 = _arc_handles(r, a1), _arc_handles(r, a2)
    ta, tb = _unit(_d1(A, 1.0)), _unit(_d1(B, 0.0))
    new = [Q[6], (A[1][0], A[1][1], None, False), (A[2][0], A[2][1], None, False), (P1[0], P1[1], "curve", False),
           (P1[0] + ta[0] * k1, P1[1] + ta[1] * k1, None, False), (P2[0] - u[0] * k1, P2[1] - u[1] * k1, None, False),
           (P2[0], P2[1], "curve", False), (P3[0], P3[1], "line", False),
           (P3[0] + u[0] * k2, P3[1] + u[1] * k2, None, False), (P4[0] - tb[0] * k2, P4[1] - tb[1] * k2, None, False),
           (P4[0], P4[1], "curve", False), (B[1][0], B[1][1], None, False), (B[2][0], B[2][1], None, False)]
    return Q[:6] + new + Q[13:]


# --- smoothing: handle lengths only, a smooth node's two sides at one curvature; the bracket's ease
def _seg_pts(P, idx):
    return tuple(P[i][:2] for i in idx)


def _node_ratio(P, i):
    """Curvature across smooth node i (larger over smaller), or None when a side is a line."""
    S = _segs(P)
    before = next(idx for idx, k in S if idx[-1] == i)
    after = next(idx for idx, k in S if idx[0] == i)
    if len(before) != 4 or len(after) != 4:
        return None
    ka, kb = _k(_seg_pts(P, before), 1.0), _k(_seg_pts(P, after), 0.0)
    if ka * kb <= 0:
        return None
    return max(abs(ka), abs(kb)) / min(abs(ka), abs(kb))


def _scale_handle(P, node, h, f):
    x, y = P[node][:2]
    hx, hy, t, sm = P[h]
    P[h] = (x + (hx - x) * f, y + (hy - y) * f, t, sm)


def even_node(P, i, lim=RATIO_MAX, span=(0.80, 0.02, 21)):
    """Smooth node i: its two handles' lengths (and the far handles of its two curves) scaled, least change, until
    the curvature on both sides agrees within lim."""
    n = len(P)
    if _node_ratio(P, i) is None or _node_ratio(P, i) <= lim:
        return 0
    best = None
    base = list(P)
    f0, df, nf = span
    for fa in [f0 + df * k for k in range(nf)]:
        for fb in [f0 + df * k for k in range(nf)]:
            Q = list(base)
            _scale_handle(Q, i, (i - 1) % n, fa)
            _scale_handle(Q, i, (i + 1) % n, fb)
            r = _node_ratio(Q, i)
            if r is None or r > lim:
                continue
            cost = abs(fa - 1) + abs(fb - 1)
            if best is None or cost < best[0]:
                best = (cost, Q)
    if best:
        P[:] = best[1]
        return 1
    return 0


def bracket(P, i_line_end, i_end):
    """The arm's bracket: the curve from the straight's end (i_line_end) to the serif's level node (i_end). Its two
    handle lengths solved (directions kept), least change, so the curve leaves the straight at no more than EASE_MAX
    of its tightest and its curvature only rises along it."""
    a, h1, h2, b = i_line_end, i_line_end + 1, i_line_end + 2, i_end
    base = list(P)
    best = None
    for fa in [0.8 + 0.05 * k for k in range(41)]:
        for fb in [0.3 + 0.05 * k for k in range(21)]:
            Q = list(base)
            _scale_handle(Q, a, h1, fa)
            _scale_handle(Q, b, h2, fb)
            s = _seg_pts(Q, (a, h1, h2, b))
            ks = [abs(_k(s, t / 40)) for t in range(41)]
            if ks[0] > EASE_MAX * max(ks):
                continue
            if any(ks[j + 1] < ks[j] * 0.999 for j in range(len(ks) - 1)) and ks.index(max(ks)) != 40:
                # one rise then at most one fall into the serif's level line
                m = ks.index(max(ks))
                if any(ks[j + 1] < ks[j] * 0.999 for j in range(m)) or any(ks[j + 1] > ks[j] * 1.001 for j in range(m, 40)):
                    continue
            cost = abs(fa - 1) + abs(fb - 1)
            if best is None or cost < best[0]:
                best = (cost, Q, fa, fb)
    if best:
        P[:] = best[1]
        return best[2], best[3]
    return None


def _round(cs):
    """Whole units; an extreme's handles stay on its axis (the handle takes the node's rounded x or y)."""
    out = []
    for P in cs:
        Q = [(round(x), round(y), t, sm) for x, y, t, sm in P]
        n = len(Q)
        for i, (x, y, t, sm) in enumerate(P):
            if not t:
                continue
            for j in ((i - 1) % n, (i + 1) % n):
                if Q[j][2]:
                    continue
                hx, hy = P[j][0] - x, P[j][1] - y
                if abs(hx) < 1e-6 and abs(hy) > 1e-6:
                    Q[j] = (Q[i][0], Q[j][1], None, False)
                elif abs(hy) < 1e-6 and abs(hx) > 1e-6:
                    Q[j] = (Q[j][0], Q[i][1], None, False)
        out.append(Q)
    return out


def construct(lean=None, steps=None):
    """The Regular's contours (unrounded) and notes. steps: which rules to apply (default all)."""
    steps = steps or ("upright", "top", "diagonal", "tail", "smooth")
    cs = [list(P) for P in BASE]
    notes = {}
    if "upright" in steps:
        upright(cs, lean)
    if "top" in steps:
        notes["top stretch"] = loop_top(cs)
    if "diagonal" in steps:
        notes["diagonal was"] = diagonal(cs)
    if "smooth" in steps:
        notes["bracket"] = bracket(cs[0], 17, 20)
        for ci, P in enumerate(cs):
            for i, q in enumerate(P):
                if q[2] and q[3]:
                    even_node(P, i)
    if "tail" in steps:
        cs[0] = tail_cut(cs[0])
    return cs, notes


def regular_contours(lean=None):
    cs, notes = construct(lean)
    return _round(cs), notes


# ------------------------------------------------------------------ hook-up
def _put(g, cs):
    from ufoLib2.objects import Contour, Point
    g.clearContours()
    for P in cs:
        c = Contour()
        c.points = [Point(x, y, t, smooth=sm) for x, y, t, sm in P]
        g.contours.append(c)


def regular(font, name="ampersand"):
    """The Regular's ampersand: 0.81's, upright loop, on the ladder; side bearings as the spacing rule left them."""
    g = font[name]
    xs = [p.x for c in g.contours for p in c.points]
    if xs:
        lsb, rsb = min(xs), g.width - max(xs)
    else:
        lsb, rsb = 38, WIDTH81 - 774
    cs, notes = regular_contours()
    nx = [q[0] for P in cs for q in P]
    dx = round(lsb - min(nx))
    cs = [[(x + dx, y, t, sm) for x, y, t, sm in P] for P in cs]
    _put(g, cs)
    g.width = round(max(nx) + dx + rsb)
    g.lib[LIB] = {"version": 1}
    return f"{name}: 0.81's, loop upright (tops {LEAN[0]:+.1f} / {LEAN[1]:+.1f}), advance {g.width}"


# ------------------------------------------------------------------ the masters
def _flat(cs, n=24):
    polys = []
    for P in cs:
        pts = []
        for idx, kind in _segs(P):
            s = _seg_pts(P, idx)
            if kind == "C":
                pts += [_bez(s, t / n) for t in range(n)]
            else:
                pts.append(s[0])
        polys.append(pts)
    return polys


def _ray(polys, p, d, skip=1.5):
    """Distance from p along d to the outline's first edge past `skip`."""
    best = None
    for P in polys:
        m = len(P)
        for k in range(m):
            a, b = P[k], P[(k + 1) % m]
            ex, ey = b[0] - a[0], b[1] - a[1]
            den = d[0] * ey - d[1] * ex
            if abs(den) < 1e-12:
                continue
            wx, wy = a[0] - p[0], a[1] - p[1]
            t = (wx * ey - wy * ex) / den
            s = (wx * d[1] - wy * d[0]) / den
            if t > skip and -1e-9 <= s <= 1 + 1e-9 and (best is None or t < best):
                best = t
    return best


def _law(R0, R):
    """The growth ratio at a Regular thickness t: v's thin at the thin diagonal, o's hairline at the hairline, n's
    stem at the stem and above, linear between."""
    pts = [(LD.TIP, R["thin"] / R0["thin"]), (LD.THIN_DIAG, R["thin"] / R0["thin"]), (LD.HAIR, R["h"] / R0["h"]),
           (LD.CAP_HAIR, R["h"] / R0["h"]), (LD.STEM, R["stem"] / R0["stem"])]

    def f(t):
        if t <= pts[0][0]:
            return pts[0][1]
        for (a, ra), (b, rb) in zip(pts, pts[1:]):
            if t <= b:
                return ra + (rb - ra) * (t - a) / (b - a)
        return pts[-1][1]
    return f


def _normal_out(d):
    return (d[1], -d[0])                      # every contour runs with its ink on the left


# In the Regular's numbering (66 points outside; checked): the tail's free end, whose four nodes move with the tail's
# side beside them (the cut is not a stroke to be read across; its length is the tip's), and the arm's serif (0.81's
# 20..35), which moves whole: its slab the tip's law down from its top, each half out by the arm's growth
N_OUT = 66
END = {9: ("before", 9), 12: ("before", 9), 13: ("after", 16), 16: ("after", 16)}
SERIF = range(25, 42)                   # 0.81's 19..36: the serif's nodes and the handles of its two bracket curves


def _fit(seg, d0, d3, targets):
    """A cubic from seg's ends moved by d0, d3, its end tangents kept, handle lengths by least squares on targets
    [(t, point)]."""
    p0 = (seg[0][0] + d0[0], seg[0][1] + d0[1])
    p3 = (seg[3][0] + d3[0], seg[3][1] + d3[1])
    u0 = _unit((seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]))
    u3 = _unit((seg[2][0] - seg[3][0], seg[2][1] - seg[3][1]))
    a0, b0 = math.dist(seg[0], seg[1]), math.dist(seg[3], seg[2])
    A11 = A12 = A22 = r1 = r2 = 0.0
    for t, q in targets:
        u = 1 - t
        c1, c2 = 3 * u * u * t, 3 * u * t * t
        base = [u ** 3 * p0[k] + c1 * p0[k] + c2 * p3[k] + t ** 3 * p3[k] for k in (0, 1)]
        e = [q[k] - base[k] for k in (0, 1)]
        v1 = (c1 * u0[0], c1 * u0[1])
        v2 = (c2 * u3[0], c2 * u3[1])
        A11 += v1[0] ** 2 + v1[1] ** 2
        A12 += v1[0] * v2[0] + v1[1] * v2[1]
        A22 += v2[0] ** 2 + v2[1] ** 2
        r1 += v1[0] * e[0] + v1[1] * e[1]
        r2 += v2[0] * e[0] + v2[1] * e[1]
    det = A11 * A22 - A12 * A12
    if abs(det) < 1e-9:
        a, b = a0, b0
    else:
        a, b = (r1 * A22 - r2 * A12) / det, (A11 * r2 - A12 * r1) / det
    a = min(max(a, 0.25 * a0), 3 * a0 + 1)
    b = min(max(b, 0.25 * b0), 3 * b0 + 1)
    # no handle past the point where the two end tangents meet (pathlint), with a margin that keeps a curvature at
    # the far end
    den = u0[0] * u3[1] - u0[1] * u3[0]
    if abs(den) > 1e-6:
        wx, wy = p3[0] - p0[0], p3[1] - p0[1]
        ta = (wx * u3[1] - wy * u3[0]) / den
        tb = (wx * u0[1] - wy * u0[0]) / den
        if ta > 0 and tb > 0:
            a = min(a, 0.85 * ta)
            b = min(b, 0.85 * tb)
    return p0, (p0[0] + u0[0] * a, p0[1] + u0[1] * a), (p3[0] + u3[0] * b, p3[1] + u3[1] * b), p3


def grow(cs, R0, R):
    """Every edge offset along its normal by half its stroke's growth (read across the stroke by a ray, the growth
    the master's law for that thickness): a node moves along its normal, a corner where its two edges' offsets meet,
    a curve between is refitted through its offset points with its end tangents kept (so smooth nodes stay smooth and
    extremes stay extremes); a level extreme on O's lines stays on it and the stroke's other edge takes the growth."""
    polys = _flat(cs)
    law = _law(R0, R)
    ga = LD.THIN_DIAG * (law(LD.THIN_DIAG) - 1) / 2            # the arm's half growth
    rs = law(LD.TIP)

    def growth_at(p, tg):
        nn = _normal_out(tg)
        ws = []                                  # the stroke across: the shortest of a fan of rays about the normal
        for deg in range(-40, 41, 10):
            r_ = math.radians(deg)
            dv = (-nn[0] * math.cos(r_) + nn[1] * math.sin(r_), -nn[1] * math.cos(r_) - nn[0] * math.sin(r_))
            w_ = _ray(polys, p, dv)
            if w_:
                ws.append(w_)
        w = min(ws) if ws else None
        w = min(max(w or LD.CAP_STEM, LD.TIP), 100.0)
        g = w * (law(w) - 1) / 2
        if abs(nn[0]) < 0.05 and min(abs(p[1] - TOP), abs(p[1] - BOTTOM)) < 1.5:
            g = 0.0
        elif abs(nn[0]) < 0.05 and min(abs(p[1] - nn[1] * w - TOP), abs(p[1] - nn[1] * w - BOTTOM)) < 2:
            g *= 2
        return g, nn

    out = [list(P) for P in cs]
    serif = len(cs[0]) == N_OUT
    sx = sum(cs[0][i][0] for i in (33, 34)) / 2 if serif else 0     # the serif's middle (its flat top's ends)
    stop = cs[0][33][1] if serif else 0
    D, G = {}, {}                                               # node moves; each node's growth on each side
    for ci, P in enumerate(cs):
        S = _segs(P)
        for i, q in enumerate(P):
            if not q[2]:
                continue
            if ci == 0 and serif and i in SERIF:
                D[(ci, i)] = (math.copysign(ga, q[0] - sx), (stop - q[1]) * (1 - rs))
                G[(ci, i)] = (ga, ga)
                continue
            before = next(idx for idx, k in S if idx[-1] == i)
            after = next(idx for idx, k in S if idx[0] == i)
            sb, sa = _seg_pts(P, before), _seg_pts(P, after)
            tb = _unit(_d1(sb, 1.0) if len(sb) == 4 else (sb[1][0] - sb[0][0], sb[1][1] - sb[0][1]))
            ta = _unit(_d1(sa, 0.0) if len(sa) == 4 else (sa[1][0] - sa[0][0], sa[1][1] - sa[0][1]))

            def side(seg, at_end, tan):
                tt = 0.85 if at_end else 0.15             # a little way along: a corner's own place reads the other stroke
                if len(seg) == 4:
                    return growth_at(_bez(seg, tt), _unit(_d1(seg, tt)))[0]
                p = (seg[0][0] + (seg[1][0] - seg[0][0]) * tt, seg[0][1] + (seg[1][1] - seg[0][1]) * tt)
                return growth_at(p, tan)[0]

            if ci == 0 and serif and i in END:
                where, k = END[i]
                if k != i:
                    continue                            # set with its partner
                tg = tb if where == "before" else ta
                g = side(sb if where == "before" else sa, where == "before", tg)
                nn = _normal_out(tg)
                for j in [j for j, v in END.items() if v[1] == i]:
                    D[(ci, j)] = (nn[0] * g, nn[1] * g)
                    G[(ci, j)] = (g, g)
                continue
            corner = abs(tb[0] * ta[1] - tb[1] * ta[0]) > math.sin(math.radians(4))
            if not corner:
                tg = _unit((tb[0] + ta[0], tb[1] + ta[1]))
                g, nn = growth_at(q[:2], tg)
                D[(ci, i)] = (nn[0] * g, nn[1] * g)
                G[(ci, i)] = (g, g)
            else:
                g1, g2 = side(sb, True, tb), side(sa, False, ta)
                n1, n2 = _normal_out(tb), _normal_out(ta)
                det = n1[0] * n2[1] - n1[1] * n2[0]
                d = ((g1 * n2[1] - g2 * n1[1]) / det, (n1[0] * g2 - n2[0] * g1) / det)
                cap = 3 * max(abs(g1), abs(g2))
                L = math.hypot(*d)
                if L > cap:
                    d = (d[0] * cap / L, d[1] * cap / L)
                D[(ci, i)] = d
                G[(ci, i)] = (g1, g2)
    for ci, P in enumerate(cs):
        for i, q in enumerate(P):
            if q[2]:
                out[ci][i] = (q[0] + D[(ci, i)][0], q[1] + D[(ci, i)][1], q[2], q[3])
        for idx, kind in _segs(P):
            if kind != "C":
                continue
            i0, i3 = idx[0], idx[3]
            seg = _seg_pts(P, idx)
            if ci == 0 and serif and i0 in SERIF and i3 in SERIF:
                for j, i_ in ((idx[1], i0), (idx[2], i3)):
                    dd = D[(ci, i_)]
                    out[ci][j] = (P[j][0] + dd[0], P[j][1] + dd[1], None, False)
                continue
            g0, g3 = G[(ci, i0)][1], G[(ci, i3)][0]
            targets = []
            for k in range(1, 10):
                t = k / 10
                p = _bez(seg, t)
                nn = _normal_out(_unit(_d1(seg, t)))
                g = g0 + (g3 - g0) * t
                targets.append((t, (p[0] + nn[0] * g, p[1] + nn[1] * g)))
            f = _fit(seg, D[(ci, i0)], D[(ci, i3)], targets)
            out[ci][idx[1]] = (f[1][0], f[1][1], None, False)
            out[ci][idx[2]] = (f[2][0], f[2][1], None, False)
    return out


def open_loop(cs, cs0, R0, R):
    """The loop's counter widened level until it changes across as o's counter does: its right side by the whole
    amount, its top by half, nothing at its foot (a weight rising from the foot to the loop's middle height); a
    handle moves with its node."""
    def counter_w(C):
        xs = [q[0] for q in C[2] if q[2]]
        return max(xs) - min(xs)
    want = counter_w(cs0) * R["o_counter"] / R0["o_counter"]
    e = want - counter_w(cs)
    if e <= 0:
        return 0.0
    tip = cs[2][0][:2]
    xl = min(q[0] for q in cs[2] if q[2])
    xr = max(q[0] for q in cs[2] if q[2])
    ymid = [q[1] for q in cs[2] if q[2] and q[0] == xr][0]
    top = max((i for i in range(len(cs[0])) if cs[0][i][2]), key=lambda i: cs[0][i][1])
    lo0 = top - 6                                       # 0.81's 48 - 42: the loop's corner on the diagonal
    nodes = [(2, i) for i in range(len(cs[2])) if cs[2][i][2] and i != 0] + \
            [(0, i) for i in range(lo0 + 1, lo0 + 12) if cs[0][i][2]]
    for ci, i in nodes:
        P = cs[ci]
        n = len(P)
        x, y = P[i][:2]
        wy = min(1.0, max(0.0, (y - tip[1]) / max(1.0, ymid - tip[1])))
        wx = min(1.0, max(0.0, (x - xl) / max(1.0, xr - xl)))
        dx = e * wy * wx
        for j in (i, (i - 1) % n, (i + 1) % n):
            if j == i or not P[j][2]:
                P[j] = (P[j][0] + dx, P[j][1], P[j][2], P[j][3])
    return e


def _inflections(s):
    v = [_d1(s, t / 40) for t in range(1, 40)]
    a = [_d2(s, t / 40) for t in range(1, 40)]
    c = [p[0] * q[1] - p[1] * q[0] for p, q in zip(v, a)]
    c = [x for x in c if abs(x) > 1e-6]
    return sum(1 for x, y in zip(c, c[1:]) if x * y < 0)


def no_new_turns(cs, cs0):
    """A curve the growth and the loop's opening bent into an inflection its Regular curve does not have: its two
    handle lengths scaled (directions kept), least change, until it has none (audit_axis turns)."""
    fixed = 0
    for P, P0 in zip(cs, cs0):
        for idx, kind in _segs(P):
            if kind != "C":
                continue
            s, s0 = _seg_pts(P, idx), _seg_pts(P0, idx)
            if _inflections(s) <= _inflections(s0):
                continue
            best = None
            for fa in [0.5 + 0.05 * k for k in range(51)]:
                for fb in [0.5 + 0.05 * k for k in range(51)]:
                    t = (s[0], (s[0][0] + (s[1][0] - s[0][0]) * fa, s[0][1] + (s[1][1] - s[0][1]) * fa),
                         (s[3][0] + (s[2][0] - s[3][0]) * fb, s[3][1] + (s[2][1] - s[3][1]) * fb), s[3])
                    if _inflections(t) > _inflections(s0):
                        continue
                    cost = abs(fa - 1) + abs(fb - 1)
                    if best is None or cost < best[0]:
                        best = (cost, t)
            if best:
                t = best[1]
                P[idx[1]] = (t[1][0], t[1][1], None, False)
                P[idx[2]] = (t[2][0], t[2][1], None, False)
                fixed += 1
    return fixed


def master_contours(R0, R, cs0=None):
    cs0 = cs0 or regular_contours()[0]
    cs = grow([list(P) for P in cs0], R0, R)
    e = open_loop(cs, cs0, R0, R)
    no_new_turns(cs, cs0)
    for P in cs:                                        # a smooth node after a line: the curve's handle on the line
        n = len(P)
        for i, q in enumerate(P):
            if not (q[2] and q[3]):
                continue
            a, b = P[(i - 1) % n], P[(i + 1) % n]
            if a[2] and not b[2]:
                u, L = _unit((q[0] - a[0], q[1] - a[1])), math.dist(b[:2], q[:2])
                P[(i + 1) % n] = (q[0] + u[0] * L, q[1] + u[1] * L, None, False)
            elif b[2] and not a[2]:
                u, L = _unit((b[0] - q[0], b[1] - q[1])), math.dist(a[:2], q[:2])
                P[(i - 1) % n] = (q[0] - u[0] * L, q[1] - u[1] * L, None, False)
    if len(cs[0]) == N_OUT:
        bracket(cs[0], 23, 26)                          # the arm's bracket, as in the Regular
    for P in cs:
        for i, q in enumerate(P):
            if q[2] and q[3]:
                even_node(P, i, 1.22, (0.5, 0.025, 45))   # a master's growth bends more: a wider search
    no_new_turns(cs, cs0)
    return _round(cs), e


def master(reg, font, sides, tm=None, layer=None, name="ampersand"):
    """A master's ampersand from the Regular's (see the module's note); sides(reg_contours, new) -> (shift, width)
    as the engine sets a sign's sides. With a mid layer and tm, the mid master's at the readings that far along."""
    import amp as A
    if name not in reg or LIB not in reg[name].lib or name not in font:
        return None
    R0, R = A.readings(reg), A.readings(font)
    R_c = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in reg[name].contours]
    cs, e = master_contours(R0, R, R_c)
    shift, width = sides(R_c, cs)
    cs = [[(x + shift, y, t, sm) for x, y, t, sm in P] for P in cs]
    _put(font[name], cs)
    font[name].width = width
    note = f"{name}: 0.81's grown by the master's laws (stem x{R['stem'] / R0['stem']:.3f}, hairline x{R['h'] / R0['h']:.3f}), loop opened {e:.0f}"
    if layer is not None and tm is not None:
        Rm = A._mix(R0, R, tm)
        cm, _ = master_contours(R0, Rm, R_c)
        x0 = min(q[0] for P in R_c for q in P)
        x1 = min(q[0] for P in cs for q in P)
        dx = round(x0 + (x1 - x0) * tm - min(q[0] for P in cm for q in P))
        cm = [[(x + dx, y, t, sm) for x, y, t, sm in P] for P in cm]
        if name not in layer:
            layer.newGlyph(name)
        _put(layer[name], cm)
        layer[name].width = round(reg[name].width + (width - reg[name].width) * tm)
        note += f"; mid master at {tm:.3f}"
    return note
