"""Area Serif 0.82 (owner round 8, item 17): the dollar's S passes through its bar as one outline.

The owner, on $ (Regular and heavy): "misalignment on the $": where the S's strokes pass behind the bar, the edge
leaving the bar on one side is not where the edge entering on the other would arrive. $ is its own ball-ended drawing
(owner, 0.80: not S plus a stroke), one contour with its bar, so each of the S's six edges that cross the bar (the
outer top, the top stroke's inside, the spine's two edges, the bottom stroke's inside, the outer bottom) is two pieces,
one each side of the bar, each ending on a bar edge. Measured (`build/owner8/item17/dollarx.py`, each piece's cubic
run on across the bar against where the other piece starts): Regular within 3 units; Light up to 24 (the bottom
stroke's inside, 63 against 41: the engine moved the counters' corners on the bar as its knots, which also thickened
the strokes there, audit_rays 59.7 at 300 against 55.3 at 400); Bold up to 35 (the spine's lower edge). The bar stood
8.5 right of the S's ink centre in the Regular (308 against 299.5), 5.5 at the Bold.

The rule (`true_crossing`, in the Regular after the node rules and in every master after the engine):

- The bar is centred on the S: its two edges and both stubs move level so the bar's middle is the S's ink centre
  (the middle of the glyph's ink box, the S being wider than the bar).
- Each crossing edge is one curve through the bar: the two pieces are refitted as one pair of cubics joined under the
  bar (a node on the bar's middle line, one tangent, one curvature), from the far node of the left piece to the far
  node of the right piece, both far nodes and their tangents kept; least squares on the pieces' own points (the half
  of each piece nearer the bar, where the engine's knots moved the corners, counts a fifth). Each piece is then that
  curve cut at the bar's edge, so the two pieces are one curve and line up across the bar exactly.
- The stubs above and below keep one length: each the mean of the two, measured from where the S's outer edge meets
  the bar's middle.
"""
import math

import numpy as np

import amp as A


NEAR = 0.2              # the weight of a piece's half nearer the bar in the refit (where the engine moved the corners; 0.05 bent the Bold's spine, curvecheck 4.06)


def _lines_x(P):
    """x of the long upright lines (the bar's edges)."""
    xs = set()
    for C in P:
        for i, q in enumerate(C):
            a = C[i - 1]
            if q[2] == "line" and a[2] and abs(a[0] - q[0]) < 0.5 and abs(a[1] - q[1]) >= 40:
                xs.add(q[0])
    return sorted(xs)


def _ends(P, bl, br):
    """Every piece of an S edge that ends on a bar edge: (contour, bar node, far node, handles (near, far), side,
    the cubic from the bar node out)."""
    out = []
    for ci, C in enumerate(P):
        n = len(C)
        for i, q in enumerate(C):
            if not q[2] or q[0] not in (bl, br):
                continue
            # the cubic ending at i
            if C[(i - 1) % n][2] is None and C[(i - 2) % n][2] is None and C[(i - 3) % n][0] not in (bl, br):
                far = (i - 3) % n
                s = (C[i][:2], C[(i - 1) % n][:2], C[(i - 2) % n][:2], C[far][:2])
                nb = tuple(C[(far - k) % n][:2] for k in (3, 2, 1, 0)) if C[(far - 1) % n][2] is None else None
                if math.dist(s[0], s[3]) >= 25:
                    out.append((ci, i, far, ((i - 1) % n, (i - 2) % n), q[0], s, nb))
            if C[(i + 1) % n][2] is None and C[(i + 2) % n][2] is None and C[(i + 3) % n][0] not in (bl, br):
                far = (i + 3) % n
                s = (C[i][:2], C[(i + 1) % n][:2], C[(i + 2) % n][:2], C[far][:2])
                nb = tuple(C[(far + k) % n][:2] for k in (3, 2, 1, 0)) if C[(far + 1) % n][2] is None else None
                if math.dist(s[0], s[3]) >= 25:
                    out.append((ci, i, far, ((i + 1) % n, (i + 2) % n), q[0], s, nb))
    return out


def pairs(P):
    """The S's edges crossing the bar: [(left end, right end)], from the top down."""
    xs = _lines_x(P)
    if len(xs) < 2:
        return None, None, []
    bl, br = xs[0], xs[-1]
    E = _ends(P, bl, br)
    L = [e for e in E if e[4] == bl]
    R = [e for e in E if e[4] == br]
    out, used = [], set()
    for l in sorted(L, key=lambda e: -e[5][0][1]):
        s = l[5]
        # the left piece run on across the bar (backwards from its bar node, t < 0): where it reaches br
        best = None
        for r in R:
            if id(r) in used:
                continue
            # the same edge: direction away from the bar opposite, start heights near the run-on
            d = abs(_run_on(s, br) - r[5][0][1])
            if best is None or d < best[0]:
                best = (d, r)
        if best and best[0] < 60:
            used.add(id(best[1]))
            out.append((l, best[1]))
    return bl, br, out


def _run_on(s, x):
    """The height where the edge s (a cubic from its bar node out) reaches x when carried on across the bar along its
    osculating circle at the bar node (its tangent and curvature there: a cubic's own polynomial run backwards curls
    away within a few tens of units)."""
    p = s[0]
    e = 1e-4
    q = A.bez(s, e)
    u = A.unit((p[0] - q[0], p[1] - q[1]))                   # towards the bar
    rev = (s[3], s[2], s[1], s[0])
    k = A.curvature(rev, 1.0)                                 # signed, running towards the bar
    if abs(u[0]) < 1e-6:
        return float("inf")
    if abs(k) < 1e-7:
        return p[1] + u[1] * (x - p[0]) / u[0]
    # walk the circle
    th, pt = math.atan2(u[1], u[0]), list(p)
    for _ in range(4000):
        if (pt[0] - x) * (pt[0] + math.cos(th) * 0.05 - x) <= 0:
            return pt[1]
        pt[0] += math.cos(th) * 0.05
        pt[1] += math.sin(th) * 0.05
        th += k * 0.05
    return float("inf")


def _bridge(fl, tl, fr, tr, xm, samples, weights, y0, th0, kl=None, kr=None, level=False, fixed=None):
    """Two cubics fl -> M -> fr, M on x = xm: fl's and fr's tangents kept (tl leaving fl towards the bar, tr leaving
    fr towards the bar), M's height and tangent and the four handle lengths solved to the samples; one curvature at M.
    Returns (B1, B2)."""
    from scipy.optimize import least_squares
    span = math.dist(fl, fr)

    def build(x):
        my, th, a1, b1, a2, b2 = x
        if level:                                            # an extreme under the bar: its tangent level, its
            th = 0.0 if th0 > -math.pi / 2 and th0 < math.pi / 2 else math.pi    # height the pieces' own extreme
            my = level
        M = (xm, my)
        u = (math.cos(th), math.sin(th))                     # M's tangent, from the left towards the right
        B1 = (fl, (fl[0] + tl[0] * a1, fl[1] + tl[1] * a1), (M[0] - u[0] * b1, M[1] - u[1] * b1), M)
        B2 = (M, (M[0] + u[0] * a2, M[1] + u[1] * a2), (fr[0] + tr[0] * b2, fr[1] + tr[1] * b2), fr)
        return B1, B2

    def res(x):
        B1, B2 = build(x)
        pts = np.array([A.bez(B1, k / 60) for k in range(61)] + [A.bez(B2, k / 60) for k in range(61)])
        out = []
        for (p, w) in zip(samples, weights):
            d = np.min(np.hypot(pts[:, 0] - p[0], pts[:, 1] - p[1]))
            out.append(w * d)
        k1, k2 = A.curvature(B1, 1.0), A.curvature(B2, 0.0)
        out.append(2e4 * (k1 - k2))
        for Bq in (B1, B2):                                   # each handle inside its curve's triangle
            d0 = A.unit((Bq[1][0] - Bq[0][0], Bq[1][1] - Bq[0][1]))
            d3 = A.unit((Bq[2][0] - Bq[3][0], Bq[2][1] - Bq[3][1]))
            ta, tb = A.meet(Bq[0], d0, Bq[3], d3), A.meet(Bq[3], d3, Bq[0], d0)
            if ta is not None and ta > 0:
                out.append(5 * max(0.0, math.dist(Bq[0], Bq[1]) - 0.95 * ta))
            if tb is not None and tb > 0:
                out.append(5 * max(0.0, math.dist(Bq[3], Bq[2]) - 0.95 * tb))
        if kl is not None:                                    # one curvature across the far nodes too
            out.append(2e4 * (A.curvature(B1, 0.0) - kl))
        if kr is not None:
            out.append(2e4 * (A.curvature(B2, 1.0) - kr))
        return np.array(out)
    x0 = np.array([y0, th0, fixed[0], span * 0.15, span * 0.15, fixed[1]])
    r = least_squares(res, x0, bounds=([y0 - 200, th0 - 1.2, 0.8 * fixed[0], 1, 1, 0.8 * fixed[1]],
                                       [y0 + 200, th0 + 1.2, 1.2 * fixed[0] + 1, span, span, 1.2 * fixed[1] + 1]),
                      diff_step=1e-4, max_nfev=3000)
    return build(r.x), float(np.sqrt(np.mean(r.fun[:len(samples)] ** 2)))


def _at_x(B, x):
    """Parameter where cubic B crosses x (bisection on its monotone stretch near the crossing)."""
    ts = [k / 400 for k in range(401)]
    for a, b in zip(ts, ts[1:]):
        pa, pb = A.bez(B, a), A.bez(B, b)
        if (pa[0] - x) * (pb[0] - x) <= 0:
            for _ in range(40):
                m = (a + b) / 2
                if (A.bez(B, a)[0] - x) * (A.bez(B, m)[0] - x) <= 0:
                    b = m
                else:
                    a = m
            return (a + b) / 2
    return None


def true_crossing(cs):
    """cs: [[(x, y, type, smooth)]] of $ (a master's or the Regular's). Returns (new contours, log) or (cs, reason)."""
    P = [[list(q) for q in C] for C in cs]
    xs = _lines_x(P)
    if len(xs) < 2:
        return cs, "bar not found"
    bl, br = xs[0], xs[-1]
    ys = [q[1] for C in P for q in C]
    allx = [q[0] for C in P for q in C if q[2]]
    # the S's ink box: the outline's nodes outside the bar
    sx = [q[0] for C in P for q in C if q[2] and not (bl - 1 <= q[0] <= br + 1)]
    centre = (min(sx) + max(sx)) / 2
    dxb = round(centre - (bl + br) / 2)
    # the bar's nodes: on its edges (x bl or br) and the stubs' rounded caps (above or below every S node)
    s_nodes_y = [q[1] for C in P for q in C if q[2] and not (bl - 1 <= q[0] <= br + 1)]
    stop, sbot = max(s_nodes_y), min(s_nodes_y)
    bar = set()
    for ci, C in enumerate(P):
        for i, q in enumerate(C):
            if q[0] in (bl, br) or (bl - 12 <= q[0] <= br + 12 and (q[1] > stop or q[1] < sbot)):
                bar.add((ci, i))
    _, _, prs = pairs([[tuple(q) for q in C] for C in P])
    if len(prs) != 6:
        return cs, f"{len(prs)} crossing edges found (6 wanted), left"
    for ci, i in bar:
        P[ci][i][0] += dxb
    nbl, nbr = bl + dxb, br + dxb
    xm = (nbl + nbr) / 2
    log = []
    for l, r in prs:
        (lci, li, lfar, lh, _, ls, lnb), (rci, ri, rfar, rh, _, rs, rnb) = l, r
        # the neighbours' curvature at the far nodes, along the bridge's direction (left to right): the left
        # neighbour runs into fl; the right one out of fr (reversed: it was written ending at fr)
        kl = A.curvature(lnb, 1.0) if lnb else None
        kr = A.curvature((rnb[3], rnb[2], rnb[1], rnb[0]), 0.0) if rnb else None
        fl, fr = ls[3], rs[3]
        tl = A.unit((ls[2][0] - fl[0], ls[2][1] - fl[1]))     # leaving fl towards the bar
        tr = A.unit((rs[2][0] - fr[0], rs[2][1] - fr[1]))
        samples, weights = [], []
        for s in (ls, rs):
            for k in range(1, 40):
                t = k / 40                                     # from the bar node (t 0) out
                samples.append(A.bez(s, t))
                weights.append(NEAR if t < 0.5 else 1.0)
        y0 = (ls[0][1] + rs[0][1]) / 2
        d = A.unit((rs[0][0] - ls[0][0], rs[0][1] - ls[0][1]))
        # an edge that meets both bar edges within 20 degrees of level (the outer top and bottom, the strokes'
        # insides) has its extreme under the bar: the node there is level, so the S keeps its height
        ul = A.unit((ls[0][0] - ls[1][0], ls[0][1] - ls[1][1]))
        ur = A.unit((rs[1][0] - rs[0][0], rs[1][1] - rs[0][1]))
        k_ = prs.index((l, r))
        lev = abs(ul[1]) < math.sin(math.radians(20)) and abs(ur[1]) < math.sin(math.radians(20)) \
            and k_ in (0, 1, len(prs) - 2, len(prs) - 1)       # the S's outer top and bottom, the strokes' insides
        if lev:                                                # at the height the drawn edge reaches (its extreme),
            ext = [A.bez(s_, k / 40) for s_ in (ls, rs) for k in range(41)]    # when that extreme lies under the bar
            e_ = max(ext, key=lambda p: p[1]) if k_ in (0, 1) else min(ext, key=lambda p: p[1])
            lev = e_[1] if abs(e_[0] - xm) <= (nbr - nbl) else False
        # the far nodes keep their tangents and meet the curves beyond them at one curvature
        (B1, B2), rms = _bridge(fl, tl, fr, tr, xm, samples, weights, y0, math.atan2(d[1], d[0]), kl, kr, lev,
                                (math.dist(ls[2], ls[3]), math.dist(rs[2], rs[3])))
        t1, t2 = _at_x(B1, nbl), _at_x(B2, nbr)
        if t1 is None or t2 is None:
            return cs, "a crossing edge does not reach the bar, left"
        Lp = A.sub(B1, 0.0, t1)                                 # fl -> the left bar edge
        Rp = A.sub(B2, t2, 1.0)                                 # the right bar edge -> fr
        # the left piece, written back as it runs (bar node, near handle, far handle, far node)
        new_l = (Lp[3], Lp[2], Lp[1], Lp[0])
        new_r = Rp
        # the S's outer top and bottom: a piece that leaves the bar within 4 degrees of level leaves it level, so its
        # extreme stays at the bar in every master (the Light's lowest point right of the bar made the bottom's right
        # piece gain an extreme between 300 and 333: audit_axis turns)
        near_level = all(abs(A.unit((pc[1][0] - pc[0][0], pc[1][1] - pc[0][1]))[1]) < math.sin(math.radians(4))
                         for pc in (new_l, new_r))
        if k_ in (0, len(prs) - 1) and near_level:            # both sides together, or neither
            for pc in (new_l, new_r):
                u_ = A.unit((pc[1][0] - pc[0][0], pc[1][1] - pc[0][1]))
                if abs(u_[1]) < math.sin(math.radians(4)):
                    L_ = math.dist(pc[0], pc[1])
                    pc_ = list(pc)
                    pc_[1] = (pc[0][0] + math.copysign(L_, u_[0]), pc[0][1])
                    if pc is new_l:
                        new_l = tuple(pc_)
                    else:
                        new_r = tuple(pc_)
        for ci, i, far, (hn, hf), piece in ((lci, li, lfar, lh, new_l), (rci, ri, rfar, rh, new_r)):
            P[ci][i][0], P[ci][i][1] = piece[0]
            P[ci][hn][0], P[ci][hn][1] = piece[1]
            P[ci][hf][0], P[ci][hf][1] = piece[2]
        log.append(f"{ls[0][1]:.0f}/{rs[0][1]:.0f} > {Lp[3][1]:.0f}/{Rp[0][1]:.0f} (fit {rms:.1f})")
    # the stubs: one length above and below, from where the S's outer edge meets the bar's middle
    tops = [q[1] for C in P for q in C if q[2] and abs(q[0] - nbl) < 0.6 or (q[2] and abs(q[0] - nbr) < 0.6)]
    # outer top and bottom of the S at the bar: the highest and lowest bar-edge nodes that are crossing nodes
    cross_y = [P[e[0]][e[1]][1] for l, r in prs for e in (l, r)]
    s_top, s_bot = max(cross_y), min(cross_y)
    up = max(q[1] for C in P for q in C) - s_top
    down = s_bot - min(q[1] for C in P for q in C)
    want = (up + down) / 2
    for ci, C in enumerate(P):
        for i, q in enumerate(C):
            if (ci, i) in bar and q[1] > s_top + 0.5:
                q[1] += want - up
            elif (ci, i) in bar and q[1] < s_bot - 0.5:
                q[1] -= want - down
    out = [[(round(q[0]), round(q[1]), q[2], q[3]) for q in C] for C in P]
    return out, f"bar {dxb:+d}; edges " + ", ".join(log) + f"; stubs {up:.0f} / {down:.0f} > {want:.0f}"


def check(cs):
    """Each crossing edge's two pieces against each other: the left piece run on to the right bar edge less where the
    right piece starts, and the other way; the bar's middle less the S's ink centre; the two stubs."""
    P = [list(C) for C in cs]
    bl, br, prs = pairs(P)
    steps = []
    xm = (bl + br) / 2
    for l, r in prs:
        steps.append(round(_run_on(l[5], xm) - _run_on(r[5], xm), 1))     # where each meets the bar's middle
    sx = [q[0] for C in P for q in C if q[2] and not (bl - 1 <= q[0] <= br + 1)]
    return {"steps": steps, "bar_off": (bl + br) / 2 - (min(sx) + max(sx)) / 2, "pairs": len(prs)}
