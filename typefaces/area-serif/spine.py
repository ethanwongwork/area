"""Area Serif 0.84 (Regular pass 2, spine construction): S and s are one stroke from the top extreme to the bottom
extreme, built from a centreline and one width law, in every master.

The stroke audit read S's spine 99.4 > 95.0 > 101.5 (two thicks either side of a thin middle) and s's 81 > 84 > 89 >
84 > 81; S was 16% darker than the median capital. 0.84's first try (hair.spines) moved the spine's two nodes and
their handles on the finished outline: it got one swell but broke the curvature where the spine meets the bowls
(14.9 and 4.1), and the masters' engine could not follow it. This is the construction instead.

The stroke between the top terminal and the bottom terminal (from the top's pair of level extremes, outer on the
letter's edge, inner on the counter, down through the upper bowl, the spine and the lower bowl to the bottom's pair)
is one ribbon:

  centreline   the medial axis of the drawn stroke (the centres of the largest balls touching either edge), fitted
               by one smoothing spline (quintic, C4) from the top pair's middle to the bottom pair's: the letter's
               path is the drawing's, only its width changes;
  width law    w(u) along the centreline's length: the top and bottom pairs' own widths at the ends (the hairline the
               terminals carry, kept), one maximum WIDE at the spine's middle (the centreline's inflection), between
               them rising and falling steadily, w = w_end + (WIDE - w_end) h(x), x the share of the way from the end
               to the middle, h(x) = sin(pi x / 2) ** P_SHAPE (flat at the end and at the middle: no corner in the
               width);
  edges        the centreline's two parallels at w / 2, each fitted by the outline's own four cubics (the nodes at
               the edge's own upright extremes and its inflection, the ends on the kept terminal nodes, level), the
               handle lengths solved together for position and for one curvature at every node, the ends at the
               kept terminal curve's curvature.

WIDE, the class's spine weight: a diagonal-running thick weighs as the class stem when it is the class's round
widest (O's side 92, o's 82: the curved stroke's own correction) times the ladder's thick diagonal share (v's 74
over n's 78, 0.949): S 87.3, s 77.8, read on the build (`wide`). The references read S's spine 0.92 to 1.02 of O's
side (Georgia Pro 0.965, Source Serif 4 0.921) and s's 0.89 to 0.98 of o's (0.948, 0.909); Area's were 1.047 and
1.086 (build/owner9/pass4/tools/refspine.py, numbers only).

In a master the same construction runs on the master's own S (the engine's, after its terminal rules): the ends are
the master's pairs, WIDE the master's own O (o) side times the same share."""
import math

import numpy as np

DIAG_SHARE = 74.0 / 78.0          # balance.DIAGS: v's thick 74 over n's stem 78 (the ladder, 0.94 to 0.97)
P_SHAPE = 1.5                     # h(x) = sin(pi x / 2) ** P_SHAPE (see the docstring)
NAMES = {"S": "O", "s": "o"}       # glyph -> the class's round letter (its left side is the round widest)
SMOOTH = 1.0                      # the centreline spline's smoothing: mean square distance from the medial points
NODE_W = 4000.0                   # node curvature match weight (in log ratio) against position in square units
LIB = "area.spine"
INFL_K = 1 / 2000.0
LOPSIDED = 1.5                    # a quarter's two handle shares within this of each other (evaluate: 1.6)             # the curvature either side of the inflection node


# ------------------------------------------------------------------------------------------------ geometry

def _pts(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def _on(P):
    return [i for i, q in enumerate(P) if q[2]]


def _segs_between(P, i0, i1):
    """Segments (control arrays) along the contour from node i0 forward to node i1."""
    n = len(P)
    out = []
    i = i0
    while i != i1:
        j = (i + 1) % n
        offs = []
        while P[j][2] is None:
            offs.append(j)
            j = (j + 1) % n
        if len(offs) == 2:
            out.append((i, offs[0], offs[1], j))
        else:
            out.append((i, j))
        i = j
    return out


def _ctrl(P, seg):
    return np.array([P[k][:2] for k in seg], float)


def bez(c, t):
    t = np.asarray(t, float)[:, None]
    if len(c) == 2:
        return (1 - t) * c[0] + t * c[1]
    return (1 - t) ** 3 * c[0] + 3 * (1 - t) ** 2 * t * c[1] + 3 * (1 - t) * t ** 2 * c[2] + t ** 3 * c[3]


def dbez(c, t):
    t = np.asarray(t, float)[:, None]
    if len(c) == 2:
        return np.repeat((c[1] - c[0])[None], len(t), 0)
    return 3 * (1 - t) ** 2 * (c[1] - c[0]) + 6 * (1 - t) * t * (c[2] - c[1]) + 3 * t ** 2 * (c[3] - c[2])


def ddbez(c, t):
    t = np.asarray(t, float)[:, None]
    if len(c) == 2:
        return np.zeros((len(t), 2))
    return 6 * (1 - t) * (c[2] - 2 * c[1] + c[0]) + 6 * t * (c[3] - 2 * c[2] + c[1])


def curv(c, t):
    d, dd = dbez(c, t), ddbez(c, t)
    return (d[:, 0] * dd[:, 1] - d[:, 1] * dd[:, 0]) / (np.hypot(d[:, 0], d[:, 1]) ** 3 + 1e-12)


def end_curv(c, end):
    """Signed curvature at a cubic's start (end 0) or end (end 1), by the handle formula."""
    if len(c) == 2:
        return 0.0
    if end == 0:
        a, b = c[1] - c[0], c[2] - c[1]
        return (2.0 / 3.0) * (a[0] * b[1] - a[1] * b[0]) / (np.hypot(*a) ** 3 + 1e-12)
    a, b = c[2] - c[1], c[3] - c[2]
    return (2.0 / 3.0) * (a[0] * b[1] - a[1] * b[0]) / (np.hypot(*b) ** 3 + 1e-12)


def flatten(P, n_per=60):
    """The whole contour as a dense polyline."""
    on = _on(P)
    out = []
    for k, i0 in enumerate(on):
        i1 = on[(k + 1) % len(on)]
        for seg in _segs_between(P, i0, i1):
            c = _ctrl(P, seg)
            L = np.hypot(*(c[-1] - c[0])) + (sum(np.hypot(*(c[m + 1] - c[m])) for m in range(len(c) - 1)) if len(c) == 4 else 0)
            out.append(bez(c, np.linspace(0, 1, max(4, int(L / 0.6)), endpoint=False)))
    return np.concatenate(out)


def _inside(polys, x, y):
    c = False
    for Pl in polys:
        xs, ys = Pl[:, 0], Pl[:, 1]
        xs2, ys2 = np.roll(xs, -1), np.roll(ys, -1)
        m = (ys > y) != (ys2 > y)
        xi = xs[m] + (y - ys[m]) * (xs2[m] - xs[m]) / (ys2[m] - ys[m])
        c ^= bool(np.sum(xi > x) % 2)
    return c


def edge(P, nodes, step=1.0):
    """Dense samples along the contour through `nodes` (consecutive on-curve nodes): xy, unit tangent, which piece."""
    xy, tg, piece = [], [], []
    for k in range(len(nodes) - 1):
        for seg in _segs_between(P, nodes[k], nodes[k + 1]):
            c = _ctrl(P, seg)
            L = sum(np.hypot(*(c[m + 1] - c[m])) for m in range(len(c) - 1))
            t = np.linspace(0, 1, max(8, int(L / step)), endpoint=False)
            xy.append(bez(c, t))
            d = dbez(c, t)
            tg.append(d / (np.hypot(d[:, 0], d[:, 1])[:, None] + 1e-12))
            piece.append(np.full(len(t), k))
    last = np.array(P[nodes[-1]][:2], float)[None]
    return np.concatenate(xy + [last]), np.concatenate(tg + [tg[-1][-1:]]), np.concatenate(piece + [[len(nodes) - 2]])


def balls(polys, xy, tg, against=None):
    """Largest inscribed ball touching each edge place: diameter, centre (against: only these outline places can
    stop the ball, e.g. the stroke's own two edges)."""
    allp = np.concatenate(polys) if against is None else against
    w, cen = np.zeros(len(xy)), np.zeros((len(xy), 2))
    for i, (p, t) in enumerate(zip(xy, tg)):
        nv = np.array([-t[1], t[0]])
        if not _inside(polys, *(p + nv * 0.8)):
            nv = -nv
        q = allp - p
        dn = q @ nv
        dd = (q ** 2).sum(1)
        ok = (dn > 1e-3) & (dd > 12.0)
        r = np.min(dd[ok] / (2 * dn[ok]))
        w[i], cen[i] = 2 * r, p + nv * r
    return w, cen


# ------------------------------------------------------------------------------------------------ the stroke

def _level_nodes(P):
    n = len(P)
    out = []
    for i, q in enumerate(P):
        if not q[2] or P[(i - 1) % n][2] or P[(i + 1) % n][2]:
            continue
        if abs(P[(i - 1) % n][1] - q[1]) < 0.6 and abs(P[(i + 1) % n][1] - q[1]) < 0.6:
            out.append(i)
    return out


def stroke_of(P):
    """The S's stroke by geometry: the top pair (outer the highest level extreme node, inner the level extreme node
    under it across the ink), the bottom pair the same; the edge A from the bottom's outer forward to the top's inner,
    the edge B from the top's outer forward to the bottom's inner. Every on-curve node between is A's or B's."""
    lv = _level_nodes(P)
    to = max(lv, key=lambda i: P[i][1])
    bo = min(lv, key=lambda i: P[i][1])
    ti = min((i for i in lv if i != to and 15 < P[to][1] - P[i][1] < 120 and abs(P[i][0] - P[to][0]) < 60),
             key=lambda i: P[to][1] - P[i][1])
    bi = min((i for i in lv if i != bo and 15 < P[i][1] - P[bo][1] < 120 and abs(P[i][0] - P[bo][0]) < 60),
             key=lambda i: P[i][1] - P[bo][1])
    n = len(P)

    def walk(a, b):
        out, i = [a], a
        while i != b:
            i = (i + 1) % n
            if P[i][2]:
                out.append(i)
            if len(out) > n:
                return None
        return out
    A, B = walk(bo, ti), walk(to, bi)
    if to in A or bi in A or bo in B or ti in B:
        raise ValueError("spine: the contour does not run bottom-outer > top-inner, top-outer > bottom-inner")
    return dict(to=to, ti=ti, bo=bo, bi=bi, A=A, B=B)


def medial(cs, ci, st):
    """The drawn stroke's medial axis from both edges, ordered bottom to top: centres (N, 2), widths (N,)."""
    P = cs[ci]
    polys = [flatten(Q) for Q in cs]
    xa, ta, _ = edge(P, st["A"])
    xb, tb, _ = edge(P, st["B"])
    # the balls between the stroke's own two edges: in a heavy master the terminals and barbs stand nearer than the
    # far edge and would stop a ball short of the stroke's middle
    both = np.concatenate([xa, xb])
    wa, ca = balls(polys, xa, ta, both)
    wb, cb = balls(polys, xb[::-1], tb[::-1], both)
    return ca, wa, cb, wb


def _order(pts, guide):
    """Progress of each point along a guide polyline (the share of its length at the nearest guide sample)."""
    d = np.hypot(*(np.diff(guide, axis=0).T))
    s = np.concatenate([[0], np.cumsum(d)])
    j = np.argmin(((pts[:, None, :] - guide[None]) ** 2).sum(2), 1)
    return s[j]


# ------------------------------------------------------------------------------------------------ construction

def wide(font, name):
    """The class's spine weight on this font: its round letter's left side (the widest ball within 30 of the
    leftmost node) times DIAG_SHARE."""
    cs = _pts(font[NAMES[name]])
    polys = [flatten(P) for P in cs]
    q = min((q for P in cs for q in P if q[2]), key=lambda q: q[0])
    ci = next(k for k, P in enumerate(cs) if any(r[:2] == q[:2] for r in P))
    P = cs[ci]
    on = _on(P)
    xy, tg, _ = edge(P, on + [on[0]], step=1.0)
    sel = np.hypot(xy[:, 0] - q[0], xy[:, 1] - q[1]) < 30
    w, _c = balls(polys, xy[sel], tg[sel])
    return float(w.max()) * DIAG_SHARE, float(w.max())


def _h(x, p=None):
    p = P_SHAPE if p is None else p
    return np.sin(np.pi / 2 * np.clip(x, 0, 1)) ** p


def centreline(cs, ci, st):
    """The drawn stroke's centreline: a quintic smoothing spline through the medial points of both edges, from the
    bottom pair's middle to the top pair's. Returns a dense polyline (M, 2) bottom to top."""
    from scipy.interpolate import splprep, splev
    P = cs[ci]
    ca, wa, cb, wb = medial(cs, ci, st)
    bmid = (np.array(P[st["bo"]][:2], float) + np.array(P[st["bi"]][:2], float)) / 2
    tmid = (np.array(P[st["to"]][:2], float) + np.array(P[st["ti"]][:2], float)) / 2
    pts = np.concatenate([ca, cb])
    s = _order(pts, ca)
    o = np.argsort(s)
    pts = pts[o]
    # drop the ends' own balls (they touch the terminals), keep the pairs' middles as the ends
    # the ends: the stroke runs level through each pair (its extremes), so the medial points within the end's own
    # width of the pair's middle give way to the level line there (in a heavy master they hook into the terminal)
    wb_, wt_ = abs(P[st["bi"]][1] - P[st["bo"]][1]), abs(P[st["to"]][1] - P[st["ti"]][1])
    keep = (np.hypot(*(pts - bmid).T) > wb_) & (np.hypot(*(pts - tmid).T) > wt_)
    sb = np.sign(P[st["A"][1]][0] - bmid[0])                  # the way the stroke leaves the bottom (to its bowl)
    st_ = np.sign(tmid[0] - P[st["A"][3]][0])                 # and arrives at the top
    lead = [bmid + [sb * t, 0.0] for t in np.linspace(3, 0.8 * wb_, 5)]
    tail_ = [tmid - [st_ * t, 0.0] for t in np.linspace(0.8 * wt_, 3, 5)]
    pts = np.concatenate([[bmid], lead, pts[keep], tail_, [tmid]])
    d = np.hypot(*np.diff(pts, axis=0).T)
    good = np.concatenate([[True], d > 0.3])
    pts = pts[good]
    u = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(pts, axis=0).T))])
    u /= u[-1]
    wts = np.ones(len(pts)); wts[0] = wts[-1] = 30.0
    tck, _ = splprep([pts[:, 0], pts[:, 1]], u=u, w=wts, k=5, s=SMOOTH * len(pts))
    t = np.linspace(0, 1, 3001)
    x, y = splev(t, tck)
    dx, dy = splev(t, tck, der=1)
    ddx, ddy = splev(t, tck, der=2)
    C = np.stack([x, y], 1)
    T = np.stack([dx, dy], 1)
    T /= np.hypot(T[:, 0], T[:, 1])[:, None]
    k = (np.array(dx) * ddy - np.array(dy) * ddx) / (np.hypot(dx, dy) ** 3)
    C[0], C[-1] = bmid, tmid
    return C, T, k


def width_law(C, k, w0, w1, W):
    """w along the centreline: w0 at the bottom, w1 at the top, W at the inflection nearest the middle."""
    u = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(C, axis=0).T))])
    L = u[-1]
    sg = np.sign(k)
    flips = np.nonzero(sg[1:] != sg[:-1])[0]
    flips = [f for f in flips if 0.2 * L < u[f] < 0.8 * L]
    um = u[min(flips, key=lambda f: abs(u[f] - L / 2))] if flips else L / 2
    w = np.where(u <= um, w0 + (W - w0) * _h(u / um), w1 + (W - w1) * _h((L - u) / (L - um)))
    return w, u, um


def _cubic_samples(p0, t0, a, p3, t3, b, n=64):
    c = np.array([p0, p0 + a * t0, p3 - b * t3, p3])
    return c, bez(c, np.linspace(0, 1, n))


def fit_edge(E, kept0, kept1, tan0, tan1, names=None):
    """Four cubics through E (dense, bottom to top or as given) with nodes at E's upright extremes and its inflection:
    the ends fixed (tangent tan0 / tan1, curvature kept0 / kept1, signed along E's direction), handle lengths solved
    for position and one curvature at each node. Returns the five nodes and the eight handles."""
    from scipy.optimize import least_squares
    from scipy.spatial import cKDTree
    d = np.gradient(E, axis=0)
    dd = np.gradient(d, axis=0)
    k = (d[:, 0] * dd[:, 1] - d[:, 1] * dd[:, 0]) / (np.hypot(d[:, 0], d[:, 1]) ** 3 + 1e-12)
    n = len(E)
    lo, hi = int(0.04 * n), int(0.96 * n)
    # the two upright extremes: the edge's place farthest out to either side in each half (its two bowls), by what
    # they are; a level stretch's ripple by a terminal is not one
    half = n // 2
    xm = E[:, 0].mean()
    up = [lo + int(np.argmax(np.abs(E[lo:half, 0] - xm))), half + int(np.argmax(np.abs(E[half:hi, 0] - xm)))]
    ks = np.convolve(k, np.ones(9) / 9, mode="same")
    fl = [i for i in range(up[0] + 5, up[1] - 5) if np.sign(ks[i]) != np.sign(ks[i + 1])]
    if len(fl) < 1:
        raise ValueError("spine: no inflection between the bowls")
    fl = [min(fl, key=lambda i: abs(i - (up[0] + up[1]) / 2))]
    idx = [0, up[0], fl[0], up[1], n - 1]
    nodes = [E[i].copy() for i in idx]
    tans = []
    for j, i in enumerate(idx):
        if j == 0:
            t = np.array(tan0, float)
        elif j == 4:
            t = np.array(tan1, float)
        elif j in (1, 3):
            t = np.array([0.0, np.sign(E[min(i + 3, n - 1), 1] - E[max(i - 3, 0), 1])])
        else:
            t = d[i] / np.hypot(*d[i])
        tans.append(t / np.hypot(*t))
    # an upright extreme's node on the exact upright: x is the extreme's, y where the tangent turns upright
    pieces = [E[idx[j]:idx[j + 1] + 1] for j in range(4)]
    trees = [cKDTree(pc) for pc in pieces]
    chord = [np.hypot(*(nodes[j + 1] - nodes[j])) for j in range(4)]
    R0 = 300.0

    def cubics(v):
        return [np.array([nodes[j], nodes[j] + v[2 * j] * chord[j] * tans[j],
                          nodes[j + 1] - v[2 * j + 1] * chord[j] * tans[j + 1], nodes[j + 1]]) for j in range(4)]

    def res(v):
        cc = cubics(v)
        r = []
        for j, c in enumerate(cc):
            s = bez(c, np.linspace(0, 1, 40))
            dist, _ = trees[j].query(s)
            r.append(dist / np.sqrt(40))
            dist2, _ = cKDTree(s).query(pieces[j][:: max(1, len(pieces[j]) // 40)])
            r.append(dist2 / np.sqrt(40))
        kk = [(end_curv(cc[j], 0), end_curv(cc[j], 1)) for j in range(4)]
        W = math.sqrt(NODE_W)
        r.append([W * math.log(max(abs(kk[0][0]), 1e-7) / max(abs(kept0), 1e-7))])
        r.append([W * math.log(max(abs(kk[3][1]), 1e-7) / max(abs(kept1), 1e-7))])
        for j in (1, 3):                         # the upright extremes: one curvature
            r.append([W * math.log(max(abs(kk[j - 1][1]), 1e-7) / max(abs(kk[j][0]), 1e-7))])
        # the inflection on its node: each side's curvature its own curve's sign, INFL_K (radius 2000) at the node, so
        # whole units cannot turn either the same way (the stroke audit then reads a ratio between near-zero radii)
        s1, s2 = np.sign(np.mean(k[idx[1]:idx[2]])), np.sign(np.mean(k[idx[2]:idx[3]]))
        r.append([W * R0 * (kk[1][1] - s1 * INFL_K), W * R0 * (kk[2][0] - s2 * INFL_K)])
        # a quarter (level end to upright extreme) keeps its two handles within LOPSIDED of each other's share of
        # their reach (evaluate.py's lopsided quarter: over 1.6)
        for j in (0, 3):
            c = cc[j]
            dx, dy = abs(c[3][0] - c[0][0]), abs(c[3][1] - c[0][1])
            r0 = np.hypot(*(c[1] - c[0])) / max(dx if abs(c[1][1] - c[0][1]) < 1 else dy, 1e-6)
            r3 = np.hypot(*(c[2] - c[3])) / max(dx if abs(c[2][1] - c[3][1]) < 1 else dy, 1e-6)
            q = max(r0, r3) / max(min(r0, r3), 1e-6)
            r.append([W * 3 * max(0.0, math.log(q / LOPSIDED))])
        return np.concatenate([np.atleast_1d(x) for x in r])
    v0 = np.full(8, 0.36)
    sol = least_squares(res, v0, bounds=(0.05, 0.95))
    cc = cubics(sol.x)
    return cc, sol


def construct(cs, ci, W, info=None):
    """The stroke rebuilt: returns new contour list (same points, new positions between the end pairs)."""
    P = cs[ci]
    st = stroke_of(P)
    C, T, k = centreline(cs, ci, st)
    w0 = abs(P[st["bi"]][1] - P[st["bo"]][1])
    w1 = abs(P[st["to"]][1] - P[st["ti"]][1])
    w, u, um = width_law(C, k, w0, w1, W)
    N = np.stack([-T[:, 1], T[:, 0]], 1)
    EA0 = C - N * (w / 2)[:, None]
    sA = -1 if np.hypot(*(EA0[0] - P[st["bo"]][:2])) < np.hypot(*(C[0] + N[0] * w[0] / 2 - P[st["bo"]][:2])) else 1
    EA = C + sA * N * (w / 2)[:, None]
    EB = (C - sA * N * (w / 2)[:, None])[::-1]
    EA[0], EA[-1] = P[st["bo"]][:2], P[st["ti"]][:2]
    EB[0], EB[-1] = P[st["to"]][:2], P[st["bi"]][:2]
    n = len(P)
    segs = {}
    on = _on(P)
    for a, b in zip(on, on[1:] + on[:1]):
        segs[a] = _segs_between(P, a, b)[0]
        segs[("to", b)] = segs[a]

    def kept_curv(node, side):
        """Curvature of the kept terminal curve at node: side 'in' = the curve arriving at node, 'out' leaving."""
        if side == "in":
            seg = segs[("to", node)]
            return end_curv(_ctrl(P, seg), 1)
        seg = segs[node]
        return end_curv(_ctrl(P, seg), 0)

    def tan_at(node, side):
        seg = segs[("to", node)] if side == "in" else segs[node]
        c = _ctrl(P, seg)
        t = (c[-1] - c[-2]) if side == "in" else (c[1] - c[0])
        return t / np.hypot(*t)
    out = [list(Q) for Q in cs]
    rep = {}
    for lab, E, i0, i1, nodes_ in (("A", EA, st["bo"], st["ti"], st["A"]), ("B", EB, st["to"], st["bi"], st["B"])):
        cc, sol = fit_edge(E, kept_curv(i0, "in"), kept_curv(i1, "out"), tan_at(i0, "in"), tan_at(i1, "out"))
        if len(nodes_) != 5:
            raise ValueError(f"spine: edge {lab} has {len(nodes_)} nodes, not 5")
        for j in range(4):
            seg = _segs_between(P, nodes_[j], nodes_[j + 1])
            if len(seg) != 1 or len(seg[0]) != 4:
                raise ValueError("spine: an edge piece is not one cubic")
            for kk, pi in enumerate(seg[0]):
                if (j > 0 or kk > 0) and (j < 3 or kk < 3) or kk in (1, 2):
                    x, y = cc[j][kk]
                    q = out[ci][pi]
                    out[ci][pi] = (round(float(x)), round(float(y)), q[2], q[3])
        rep[lab] = round(float(sol.cost), 2)
        # whole units at the inflection node: its two handles rounded (floor or ceiling each way) to the pair
        # nearest one line through the node (a smooth node's handles collinear within the audit's 0.25 degrees)
        import itertools
        seg_in = _segs_between(P, nodes_[1], nodes_[2])[0]
        seg_out = _segs_between(P, nodes_[2], nodes_[3])[0]
        node, a_i, b_i = nodes_[2], seg_in[2], seg_out[1]
        a_ex, b_ex = cc[1][2], cc[2][1]
        Nn = np.array(out[ci][node][:2], float)
        best = None
        for fa in itertools.product((math.floor, math.ceil), repeat=4):
            a = np.array([fa[0](a_ex[0]), fa[1](a_ex[1])], float)
            b = np.array([fa[2](b_ex[0]), fa[3](b_ex[1])], float)
            v1, v2 = Nn - a, b - Nn
            ang = abs(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1 @ v2))
            cost = ang + 1e-4 * (np.hypot(*(a - a_ex)) + np.hypot(*(b - b_ex)))
            if best is None or cost < best[0]:
                best = (cost, a, b)
        for pi, q in ((a_i, best[1]), (b_i, best[2])):
            t_, s_ = out[ci][pi][2], out[ci][pi][3]
            out[ci][pi] = (int(q[0]), int(q[1]), t_, s_)
    if info is not None:
        info.update(dict(w0=w0, w1=w1, W=W, um=um, L=u[-1], cost=rep))
    return out


def _put(g, cs):
    from ufoLib2.objects import Point
    for c, P in zip(g.contours, cs):
        c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]


def run(font, names=None):
    """S and s on this font (the Regular, or a master after its engine and terminal rules): the spine construction at
    the class's spine weight read on the same font."""
    log = []
    for name in NAMES:
        if names is not None and name not in names or name not in font or NAMES[name] not in font:
            continue
        g = font[name]
        if len(g.contours) != 1:
            log.append(f"{name}: not one contour; left")
            continue
        W, side = wide(font, name)
        info = {}
        cs = _pts(g)
        new = construct(cs, 0, W, info)
        _put(g, new)
        log.append(f"{name}: spine {W:.1f} ({NAMES[name]}'s side {side:.1f} x {DIAG_SHARE:.3f}), ends {info['w0']:.0f} / "
                   f"{info['w1']:.0f}, middle at {info['um']:.0f} of {info['L']:.0f}, fit {info['cost']}")
    return log


def regular(font):
    return run(font)


def master(reg, font, struck=()):
    """In a master: the same construction on the master's own S and s (after s_terminal and round_ends), the spine at
    the master's own O and o sides times the same share. Returns (note, names changed)."""
    names = [n for n in NAMES if n in reg and n in font and n not in struck
             and [len(c.points) for c in font[n].contours] == [len(c.points) for c in reg[n].contours]]
    return "spine construction: " + "; ".join(run(font, names)), names
