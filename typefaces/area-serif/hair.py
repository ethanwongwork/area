"""Area Serif 0.84 (Regular pass 2, strokes, sizes and ink): a round stroke's thin place on its ladder step.

The stroke audit (`build/owner9/stroke-084c/`) and the placement census (`place-084b`, list B) read the thin level
strokes of the round letters off the ladder: J's hook bottom 37.5 / 41.4 against the capitals' hairline 47, 5's bowl
top 41.4, f's hook top 38.8 (43), G's bottom 45.3 (and 40.8 to its right), C 48.6, the 6's top and the 9's bottom
46.1 (44.3 off the node), the 8 48.1; c's and e's lower strokes never thin to the hairline (50.8 / 49.4 against 43).

The rule (`hairlines`): a round stroke's thin place is the thinnest place across it near its level extremes (the
largest ink circle touching the edge, read every unit along both edges within `REACH` of the two extreme nodes), and
that place carries the class's hairline exactly (lowercase 43, capitals and figures 47: the ladder). The stroke is
found by what it is: a pair of level extreme nodes facing each other across the ink, the outer on the letter's edge
(its zone line or the bowl's outside), the inner on the counter's. Only the inner node moves, upright, with its two
handles (rigidly: the curve either side keeps its tangent and its handle lengths), by the least whole-unit amount that
brings the thin place to the hairline; the outside, every zone line and every other node stay. Composites, the
ligatures, the figures' small forms and the struck letters follow (the rule runs before spacing and the charset).
"""
import math

import numpy as np

REACH = 40          # edge places read within this of either extreme node
STEP = 1.0
HAIR_LC, HAIR_CAP = 43, 47

# glyph -> strokes ("top": the highest pair of level extremes, "bottom": the lowest, "bowl": the highest pair under
# the x-height in a figure, the 5's bowl under its flat stroke)
STROKES = {
    "J": ("bottom",), "f": ("top",), "five": ("bowl",), "G": ("bottom",), "C": ("bottom",),
    "six": ("top",), "nine": ("bottom",), "eight": ("top", "bottom"), "c": ("bottom",), "e": ("bottom",),
}
CAPS = set("JGC") | {"five", "six", "nine", "eight"}


def _flat(P):
    """Closed point list -> dense polyline (N, 2) and, per sample, the node index it belongs near."""
    n = len(P)
    on = [i for i, q in enumerate(P) if q[2]]
    out = []
    for k, i0 in enumerate(on):
        i1 = on[(k + 1) % len(on)]
        offs = []
        j = (i0 + 1) % n
        while j != i1:
            offs.append(P[j][:2]); j = (j + 1) % n
        a, b = np.array(P[i0][:2], float), np.array(P[i1][:2], float)
        if len(offs) == 2:
            c1, c2 = np.array(offs[0], float), np.array(offs[1], float)
            L = np.hypot(*(b - a)) + np.hypot(*(c1 - a)) + np.hypot(*(c2 - b))
            t = np.linspace(0, 1, max(8, int(L / 0.5)), endpoint=False)[:, None]
            out.append((1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * c1 + 3 * (1 - t) * t ** 2 * c2 + t ** 3 * b)
        else:
            L = np.hypot(*(b - a))
            t = np.linspace(0, 1, max(2, int(L / 0.5)), endpoint=False)[:, None]
            out.append(a + t * (b - a))
    return np.concatenate(out)


def _inside(pt, polys):
    x, y = pt
    c = False
    for Pl in polys:
        xs, ys = Pl[:, 0], Pl[:, 1]
        xs2, ys2 = np.roll(xs, -1), np.roll(ys, -1)
        m = (ys > y) != (ys2 > y)
        xi = xs[m] + (y - ys[m]) * (xs2[m] - xs[m]) / (ys2[m] - ys[m])
        c ^= bool(np.sum(xi > x) % 2)
    return c


def balls(cs, centres, reach=REACH):
    """Width (the medial ball's diameter) at every edge place within `reach` of any centre, every unit."""
    polys = [_flat(P) for P in cs]
    allp = np.concatenate(polys)
    res = []
    for Pl in polys:
        d = np.roll(Pl, -1, 0) - np.roll(Pl, 1, 0)
        L = np.hypot(d[:, 0], d[:, 1]) + 1e-9
        nrm = np.stack([-d[:, 1], d[:, 0]], 1) / L[:, None]
        near = np.zeros(len(Pl), bool)
        for c in centres:
            near |= np.hypot(Pl[:, 0] - c[0], Pl[:, 1] - c[1]) < reach
        idx = np.nonzero(near)[0][::2]
        for i in idx:
            p, nv = Pl[i], nrm[i]
            if not _inside(p + nv * 0.8, polys):
                nv = -nv
            q = allp - p
            dn = q @ nv
            dd = (q ** 2).sum(1)
            ok = (dn > 1e-3) & (dd > 4.0)
            if not ok.any():
                continue
            r = np.min(dd[ok] / (2 * dn[ok]))
            res.append((2 * r, p))
    return res


def pairs(P_all):
    """Level extreme nodes (smooth, level handles, between curves) facing each other across the ink: [(outer, inner)]
    as (contour, index), outer the one on the letter's outside edge (further from the counter)."""
    nodes = []
    for ci, P in enumerate(P_all):
        n = len(P)
        for i, q in enumerate(P):
            if not q[2] or not q[3] or P[(i - 1) % n][2] or P[(i + 1) % n][2]:
                continue
            if abs(P[(i - 1) % n][1] - q[1]) > 0.6 or abs(P[(i + 1) % n][1] - q[1]) > 0.6:
                continue
            nodes.append((ci, i, q[0], q[1]))
    polys = [_flat(P) for P in P_all]
    out = []
    for a in nodes:
        up = _inside((a[2], a[3] + 2), polys)            # ink above a: a is a bottom edge
        best = None
        for b in nodes:
            if b is a:
                continue
            dy = b[3] - a[3]
            if (up and not 15 < dy < 90) or (not up and not -90 < dy < -15) or abs(b[2] - a[2]) > 80:
                continue
            if _inside((b[2], b[3] + (2 if up else -2)), polys):   # b must face a across the ink
                continue
            if best is None or abs(dy) < abs(best[3] - a[3]):
                best = b
        if best is not None:
            out.append((a, best, "bottom" if up else "top"))
    return out


def _move(P, i, dy):
    n = len(P)
    P = list(P)
    for j in ((i - 1) % n, i, (i + 1) % n):
        x, y, t, s = P[j]
        P[j] = (x, y + dy, t, s)
    return P


def thinnest(cs, a, b):
    w = balls(cs, [(a[2], a[3]), (b[2], b[3])])
    return min(w, key=lambda t: t[0]) if w else (None, None)


def solve(cs, outer, inner, side, target):
    """The least whole-unit upright move of the inner node bringing the thinnest place to target."""
    ci, i = inner[0], inner[1]
    sgn = 1 if side == "bottom" else -1     # bottom stroke: the inner node is above; moving it up thickens
    def at(dy):
        c2 = [list(P) for P in cs]
        c2[ci] = _move(cs[ci], i, sgn * dy)
        inn = (ci, i, inner[2], inner[3] + sgn * dy)
        return thinnest(c2, outer, inn)[0], c2
    w0, _ = at(0)
    best = (abs(w0 - target), 0)
    for dy in range(-14, 15):
        w, _ = at(dy)
        if w is not None and abs(w - target) < best[0] - 1e-6:
            best = (abs(w - target), dy)
    return best[1] * sgn, w0, at(best[1])[0]


def hairlines(font, names=None):
    log = []
    for name, sides in STROKES.items():
        if names and name not in names or name not in font:
            continue
        g = font[name]
        cs = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]
        target = HAIR_CAP if (name in CAPS or name[0].isupper()) else HAIR_LC
        prs = pairs(cs)
        for side in sides:
            if side == "bowl":
                cand = [p for p in prs if p[2] == "top" and p[0][3] < 500]
                cand = [max(cand, key=lambda p: p[0][3])] if cand else []
            elif side == "top":
                cand = [p for p in prs if p[2] == "top"]
                cand = [max(cand, key=lambda p: p[0][3])] if cand else []
            else:
                cand = [p for p in prs if p[2] == "bottom"]
                cand = [min(cand, key=lambda p: p[0][3])] if cand else []
            if not cand:
                log.append(f"{name} {side}: no pair")
                continue
            outer, inner, kind = cand[0]
            dy, w0, w1 = solve(cs, outer, inner, kind, target)
            if dy:
                cs[inner[0]] = _move(cs[inner[0]], inner[1], dy)
            log.append(f"{name} {side} {w0:.1f}>{w1:.1f} ({dy:+d} at {inner[2]:g},{inner[3]:g})")
        for c, P in zip(g.contours, cs):
            for p, q in zip(c.points, P):
                p.x, p.y = q[0], q[1]
    return log


# ------------------------------------------------------------------------------------------------- spines (item 3)
# The stroke audit read S's spine 99.4 > 95.0 > 101.5 along its length (thick at both ends, thin at the middle) and
# s's 81 > 84 > 89 > 84 > 81; the census S 16% dark with its density +28%. A spine is a round stroke: one swell, its
# widest at the middle (the spine's two nodes, one on each edge), there the class's round widest (O's side for S, o's
# for s, read on the build), falling steadily towards both bowls. The rule (`spines`): the two spine nodes move along
# their own normals and their four handles change length (tangents kept), least change, until the width along the
# spine's middle (medial balls on the upper edge, within SPINE_SPAN of each adjacent curve's length from the node)
# has one maximum, at the node, equal to the class's round widest.
SPINE_SPAN = 0.55
HANDLE_W = 30        # least change: a handle length factor weighs as this many square units of width
SPINES = {"S": ("O", 712), "s": ("o", 520)}


def _bez(c, t):
    t = np.asarray(t)[:, None]
    return (1 - t) ** 3 * c[0] + 3 * (1 - t) ** 2 * t * c[1] + 3 * (1 - t) * t ** 2 * c[2] + t ** 3 * c[3]


def _dbez(c, t):
    t = np.asarray(t)[:, None]
    return 3 * (1 - t) ** 2 * (c[1] - c[0]) + 6 * (1 - t) * t * (c[2] - c[1]) + 3 * t ** 2 * (c[3] - c[2])


def _seg_at(P, i):
    """The curve ending at node i and the curve starting at it (control arrays), for a smooth node between curves."""
    n = len(P)
    a = np.array([P[(i - 3) % n][:2], P[(i - 2) % n][:2], P[(i - 1) % n][:2], P[i][:2]], float)
    b = np.array([P[i][:2], P[(i + 1) % n][:2], P[(i + 2) % n][:2], P[(i + 3) % n][:2]], float)
    return a, b


def widest_side(font, name):
    """The class's round widest: the largest ball on the letter's left side (o, O)."""
    cs = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in font[name].contours]
    xs = [q[0] for P in cs for q in P]
    ys = [q[1] for P in cs for q in P]
    q = min((q for P in cs for q in P if q[2]), key=lambda q: q[0])
    w = balls(cs, [(q[0], q[1])], reach=30)
    return max(t[0] for t in w)


def spine_profile(cs, ci, iu):
    """Width along the spine (balls on the upper edge, the node's two curves within SPINE_SPAN), as (s, w)."""
    P = cs[ci]
    polys = [_flat(Q) for Q in cs]
    allp = np.concatenate(polys)
    a, b = _seg_at(P, iu)
    out = []
    for c, sign, ts in ((a, -1, np.linspace(1 - SPINE_SPAN, 1, 24)), (b, 1, np.linspace(0, SPINE_SPAN, 24))):
        pts, der = _bez(c, ts), _dbez(c, ts)
        L = np.hypot(*(c[3] - c[0]))
        for p, d, t in zip(pts, der, ts):
            nv = np.array([-d[1], d[0]]) / (np.hypot(*d) + 1e-9)
            if not _inside(p + nv * 0.8, polys):
                nv = -nv
            q = allp - p
            dn = q @ nv
            dd = (q ** 2).sum(1)
            ok = (dn > 1e-3) & (dd > 4.0)
            s = sign * (abs(t - (1 if sign < 0 else 0))) * L
            r = np.min(dd[ok] / (2 * dn[ok]))
            out.append((s, 2 * r, p + nv * r))
    out.sort(key=lambda t: t[0])
    return out


def _spine_nodes(P, height):
    on = [i for i, q in enumerate(P) if q[2] == "curve" and q[3]]
    xs = [q[0] for q in P]
    mid = (min(xs) + max(xs)) / 2
    sp = [i for i in on if abs(P[i][0] - mid) < 60 and 0.3 * height < P[i][1] < 0.75 * height]
    sp.sort(key=lambda i: -P[i][1])
    return sp[:2] if len(sp) >= 2 else None


def _apply(P0, iu, il, v):
    """v: (du, dl, hu_in, hu_out, hl_in, hl_out): node moves along their normals, handle length factors."""
    P = [list(q) for q in P0]
    n = len(P)
    for i, d, hin, hout in ((iu, v[0], v[2], v[3]), (il, v[1], v[4], v[5])):
        x, y = P0[i][0], P0[i][1]
        hx, hy = P0[(i + 1) % n][0] - x, P0[(i + 1) % n][1] - y
        L = np.hypot(hx, hy)
        nx, ny = -hy / L, hx / L
        nx_, ny_ = x + d * nx, y + d * ny
        for j, f in (((i - 1) % n, hin), ((i + 1) % n, hout)):
            P[j][0] = nx_ + f * (P0[j][0] - x)
            P[j][1] = ny_ + f * (P0[j][1] - y)
        P[i][0], P[i][1] = nx_, ny_
    return [tuple(q) for q in P]


def spine_score(prof, T, mid):
    """mid: the middle of the spine (half way between its two nodes); the profile's place whose ball is centred
    nearest it is the middle."""
    s = np.array([p[0] for p in prof]); w = np.array([p[1] for p in prof])
    k0 = int(np.argmin([np.hypot(*(p[2] - mid)) for p in prof]))
    w0 = w[k0]
    bad = 0.0
    for k in range(k0, len(w) - 1):
        bad += max(0.0, w[k + 1] - w[k]) ** 2
    for k in range(k0, 0, -1):
        bad += max(0.0, w[k - 1] - w[k]) ** 2
    return (w0 - T) ** 2 + 40 * bad, w0, float(w.max()), float(s[int(np.argmax(w))])


def spines(font, names=None, verbose=False):
    from scipy.optimize import minimize
    log = []
    for name, (ref, height) in SPINES.items():
        if names and name not in names or name not in font:
            continue
        T = widest_side(font, ref)
        g = font[name]
        cs = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]
        sp = _spine_nodes(cs[0], height)
        if not sp:
            log.append(f"{name}: spine not found"); continue
        iu, il = sp
        mid = lambda P: np.array([(P[iu][0] + P[il][0]) / 2, (P[iu][1] + P[il][1]) / 2])   # noqa: E731
        before = spine_score(spine_profile(cs, 0, iu), T, mid(cs[0]))

        def f(v):
            c2 = list(cs); c2[0] = _apply(cs[0], iu, il, v)
            sc = spine_score(spine_profile(c2, 0, iu), T, mid(c2[0]))[0]
            return sc + 0.02 * (v[0] ** 2 + v[1] ** 2) + HANDLE_W * sum((x - 1) ** 2 for x in v[2:])
        v0 = np.array([0, 0, 1, 1, 1, 1.0])
        simplex = [v0] + [v0 + np.eye(6)[k] * (4.0 if k < 2 else 0.1) for k in range(6)]
        r = minimize(f, v0, method="Nelder-Mead", options=dict(maxiter=1500, xatol=0.02, fatol=0.005,
                                                                 initial_simplex=np.array(simplex)))
        v = r.x
        new = _apply(cs[0], iu, il, v)
        new = [(round(q[0]), round(q[1]), q[2], q[3]) for q in new]
        c2 = list(cs); c2[0] = new
        after = spine_score(spine_profile(c2, 0, iu), T, mid(new))
        for p, q in zip(g.contours[0].points, new):
            p.x, p.y = q[0], q[1]
        log.append(f"{name}: spine middle {before[1]:.1f} > {after[1]:.1f} (target {T:.1f}), widest {before[2]:.1f} at "
                   f"{before[3]:+.0f} > {after[2]:.1f} at {after[3]:+.0f}")
        if verbose:
            log.append(str([round(x, 2) for x in v]))
    return log


# ------------------------------------------------------------------------------------------- bowls' sides (item 4)
# The stroke audit read B's upper bowl 94.1 at its side against P's 92.5 and R's 92.2, the census 97.8 across it at
# 500 (over the capital rounds' 95 at most; B 30% darker than the median capital). The B P R bowl is one part (P the
# control: it closes as R does, `figs.cap_bowls`): the widest across a bowl's side, within SIDE_REACH of its right
# extremes, is P's. The rule (`bowl_sides`): the counter's right extreme node moves level with its handles, the least
# whole-unit move bringing the widest there to P's; the outside stays.
SIDE_REACH = 60
SIDES = {"B": "upper"}


def _upright_pairs(cs):
    nodes = []
    for ci, P in enumerate(cs):
        n = len(P)
        for i, q in enumerate(P):
            if not q[2] or not q[3] or P[(i - 1) % n][2] or P[(i + 1) % n][2]:
                continue
            if abs(P[(i - 1) % n][0] - q[0]) > 0.6 or abs(P[(i + 1) % n][0] - q[0]) > 0.6:
                continue
            nodes.append((ci, i, q[0], q[1]))
    out = []
    for a in nodes:
        for b in nodes:
            if a[0] != b[0] and 40 < a[2] - b[2] < 130 and abs(a[3] - b[3]) < 40:
                out.append((a, b))          # a the outside's right extreme, b the counter's
    return out


def widest_near(cs, a, b, reach=SIDE_REACH):
    w = balls(cs, [(a[2], a[3]), (b[2], b[3])], reach=reach)
    return max(t[0] for t in w)


def bowl_sides(font, control="P"):
    log = []
    cp = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in font[control].contours]
    pp = _upright_pairs(cp)
    if not pp:
        return [f"{control}: no bowl side"]
    T = widest_near(cp, *max(pp, key=lambda t: t[0][3]))
    for name, which in SIDES.items():
        g = font[name]
        cs = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]
        prs = _upright_pairs(cs)
        if not prs:
            log.append(f"{name}: no bowl side"); continue
        a, b = (max if which == "upper" else min)(prs, key=lambda t: t[0][3])
        w0 = widest_near(cs, a, b)
        best = (abs(w0 - T), 0, w0)
        for dx in range(-12, 13):
            c2 = [list(P) for P in cs]
            P = list(c2[b[0]]); n = len(P)
            for j in ((b[1] - 1) % n, b[1], (b[1] + 1) % n):
                x, y, t, s = P[j]; P[j] = (x + dx, y, t, s)
            c2[b[0]] = P
            w = widest_near(c2, a, (b[0], b[1], b[2] + dx, b[3]))
            if abs(w - T) < best[0] - 1e-6:
                best = (abs(w - T), dx, w)
        dx = best[1]
        for c_i, c in enumerate(g.contours):
            if c_i == b[0]:
                n = len(c.points)
                for j in ((b[1] - 1) % n, b[1], (b[1] + 1) % n):
                    c.points[j].x += dx
        log.append(f"{name} {which} bowl's side {w0:.1f} > {best[2]:.1f} ({control}'s {T:.1f}; counter's extreme {dx:+d})")
    return log


# --------------------------------------------------------------------------------------------- diagonals (item 5)
# The stroke audit reads a diagonal as each pair of parallel straight edges: X's thin diagonal 42.2 / 43.1 (its two
# halves, offset across the crossing) against A V W M Y's 48, x's 36.1 / 38.0 thin and 72.6 / 72.3 thick against v's
# 39.2 / 74.3, the capitals' thick diagonals 84.7 (K) to 88.8 (N). balance.diag set X and x at one height, where the
# two halves' edges were read as one stroke. The rule (`diagonals`): each half of a crossing stroke is its own stroke
# (only the straight edges whose middle lies in the half's band are read), set by balance.diag to the ladder: the thin
# diagonals 39 lowercase and 48 capitals (balance.THIN_LOW, THIN_CAP_DIAG), the lowercase thick v's 74 (DIAGS: w's 73,
# 0.94 stems), every capital thick diagonal the capital stem, 86 (the median of A V W M N K Y Z was 86.5; Y's
# comment: both references 1.01 of H). Z's arms the capitals' arm, 46 (balance.CAP_ARM): the arm's inner edge moves,
# its corner on the diagonal sliding along the diagonal.
CAP_THICK_DIAG = 86
DIAG_HALVES = [   # glyph, direction, target, (band low, band high): only edges with their middle inside
    ("x", 1, 39, (0, 260)), ("x", 1, 39, (260, 520)), ("x", -1, 74, (0, 260)), ("x", -1, 74, (260, 520)),
    ("X", 1, 48, (0, 356)), ("X", 1, 48, (356, 712)),
    ("A", -1, CAP_THICK_DIAG, (0, 712)), ("V", -1, CAP_THICK_DIAG, (0, 712)), ("W", -1, CAP_THICK_DIAG, (0, 712)),
    ("M", -1, CAP_THICK_DIAG, (0, 712)), ("N", -1, CAP_THICK_DIAG, (0, 712)), ("K", -1, CAP_THICK_DIAG, (0, 712)),
    ("Y", -1, CAP_THICK_DIAG, (356, 712)), ("Z", 1, CAP_THICK_DIAG, (0, 712)),
]


def diagonals(font):
    import balance as BAL
    import normalize as NORM
    log = []
    orig = BAL._diag_edges
    for name, sign, target, (lo, hi) in DIAG_HALVES:
        if name not in font:
            continue
        def edges(g, min_len=60, lo=lo, hi=hi):
            L = NORM._diag_edges(g, min_len)
            out = []
            for l_ in L:
                P = g.contours[l_[0]].points
                ym = (P[l_[1]].y + P[l_[2]].y) / 2
                if lo <= ym < hi:
                    out.append(l_)
            return out
        BAL._diag_edges = edges
        try:
            was = across(font[name], sign, lo, hi)
            r = BAL.diag(font[name], sign, target, (lo + hi) / 2)
            for _ in range(2):           # diag reads at one height; the stroke is read across its parallel edges
                now = across(font[name], sign, lo, hi)
                if now is None or abs(now - target) < 0.6:
                    break
                BAL.diag(font[name], sign, target + (target - now), (lo + hi) / 2)
            r = ([was], [across(font[name], sign, lo, hi)]) if was is not None else r
        finally:
            BAL._diag_edges = orig
        log.append(f"{name}{'+' if sign > 0 else '-'}[{lo},{hi}] {r[0]}>{r[1]}" if r else f"{name}{sign:+d}[{lo},{hi}]: none")
    log.append(z_arms(font))
    return log


def z_arms(font, name="Z", target=46, cap=712):
    g = font[name]
    P = g.contours[0].points
    n = len(P)
    done = []
    for i, p in enumerate(P):
        q = P[(i + 1) % n]
        if not (p.type and q.type == "line"):
            continue
        # a long diagonal leaving a corner p on a level edge near a zone line
        if abs(q.y - p.y) < 300:
            continue
        for edge_y, zone, sgn in ((p.y, 0, 1), (p.y, cap, -1)):
            if abs(abs(edge_y - zone) - target) > 6 or abs(edge_y - zone) == target:
                continue
            d = (zone + sgn * target) - edge_y
            row = [k for k, r in enumerate(P) if r.y == edge_y and k != i]
            for k in row:
                P[k].y += d
            P[i].x = round(p.x + d * (q.x - p.x) / (q.y - p.y))
            P[i].y += d
            done.append(f"{name} arm at {edge_y} {abs(edge_y - zone)}>{target}")
    for i, p in enumerate(P):     # the other direction: a diagonal arriving at the corner
        q = P[(i - 1) % n]
        if not (p.type == "line" and q.type and abs(q.y - p.y) >= 300):
            continue
        for zone, sgn in ((0, 1), (cap, -1)):
            if abs(abs(p.y - zone) - target) > 6 or abs(p.y - zone) == target:
                continue
            edge_y = p.y
            d = (zone + sgn * target) - edge_y
            for k, r in enumerate(P):
                if r.y == edge_y and k != i:
                    r.y += d
            P[i].x = round(p.x + d * (q.x - p.x) / (q.y - p.y))
            P[i].y += d
            done.append(f"{name} arm at {edge_y} {abs(edge_y - zone)}>{target}")
    return done


def across(g, sign, lo, hi, min_len=60):
    """A diagonal stroke's width as the stroke audit reads it: the two longest parallel straight edges leaning one way
    with their middles in the band, the distance between their lines (the mean, if they are not quite parallel)."""
    import math
    L = []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i in range(n):
            a_, b_ = P[i], P[(i + 1) % n]
            if b_.type != "line" or a_.type is None:
                continue
            dx, dy = b_.x - a_.x, b_.y - a_.y
            ln = math.hypot(dx, dy)
            if ln < min_len or abs(dy) < 1 or not 0.2 < abs(dx / dy) < 5 or (dx / dy > 0) != (sign > 0):
                continue
            if not lo <= (a_.y + b_.y) / 2 < hi:
                continue
            L.append((ln, (a_.x, a_.y), (b_.x, b_.y)))
    best = None
    for i in range(len(L)):
        for j in range(i + 1, len(L)):
            (l1, a1, b1), (l2, a2, b2) = L[i], L[j]
            d1 = ((b1[0] - a1[0]) / l1, (b1[1] - a1[1]) / l1)
            d2 = ((b2[0] - a2[0]) / l2, (b2[1] - a2[1]) / l2)
            if abs(abs(d1[0] * d2[0] + d1[1] * d2[1]) - 1) > 1e-3:
                continue
            w1 = abs((a2[0] - a1[0]) * d1[1] - (a2[1] - a1[1]) * d1[0])
            w2 = abs((a1[0] - a2[0]) * d2[1] - (a1[1] - a2[1]) * d2[0])
            w = (w1 + w2) / 2
            if 25 < w < 120 and (best is None or l1 + l2 > best[0]):
                best = (l1 + l2, w)
    return round(best[1], 1) if best else None


# ------------------------------------------------------------------------------------------ dots and commas (item 6)
# The census and the stroke audit read seven dot sizes where the construction has three: i 116 and j 118; the
# lowercase marks' dots 110 (dieresis), 112 (dot accent), 114 (dot below), the dieresis below 110 by 118; ḃ ḋ an oval
# 113 by 121; the capital forms 90 (dieresis), 94 (dot accent), 110 (dot below); and the high quotes' heads 116.4
# against the comma's 123.7. The family (`dots`):
#   the text dot, i's (the control, 116): j's dot, and every lowercase mark's dot (a dot accent on dotless i is i; the
#     dot below and the dieresis below are the same dot turned under), ḃ ḋ's dot, exactly round;
#   the capital marks' dot, the dot accent's case form (94): the dieresis's case form takes it; the dot below keeps
#     one form under both cases (0.84 placement), so its case form is the text dot;
#   the punctuation dot, the period's 124 (already: . : ; ! ? and the comma's head);
#   the comma head: , ‚ „ the comma; ’ (and ‘ “ ” ʼ, which are ’ turned or doubled) the comma scaled so its head is the
#     text dot: QUOTE_SCALE = 116 / 124 = 0.935 (the high quotes sit with the letters' dots, the low ones with the
#     period), its top and its sides kept.
# Each dot keeps its centre; a dot below keeps its bottom (charset.BELOW, -215).
TEXT_DOT_SRC = "i"
LC_MARK_DOTS = ("j", "dieresiscomb", "dieresis", "dotaccentcomb", "dotaccent", "dotbelowcomb", "dotbelow",
                "dieresisbelowcomb", "uni1E03", "uni1E0B", "dotbelowcomb.case")
CASE_DOT_SRC = "dotaccentcomb.case"
CASE_MARK_DOTS = ("dieresiscomb.case", "dieresis.case", "dotaccent.case")
PUNCT_DOT = 124


def _dots_of(g):
    import charset as CH
    return [c for c in g.contours if CH._is_dot(c)]


def _dot_d(g):
    c = max(_dots_of(g), key=lambda c: min(p.y for p in c.points))
    xs = [p.x for p in c.points]
    return max(xs) - min(xs)


def dots(font, which="all"):
    import charset as CH
    log = []
    d_text = _dot_d(font[TEXT_DOT_SRC])
    d_case = _dot_d(font[CASE_DOT_SRC]) if CASE_DOT_SRC in font else None
    groups = []
    if which in ("all", "letters"):
        groups.append((("j",), d_text))
    if which in ("all", "marks"):
        groups += [(tuple(n for n in LC_MARK_DOTS if n != "j"), d_text), (CASE_MARK_DOTS, d_case)]
    for names, d in groups:
        if d is None:
            continue
        r = d // 2
        for name in names:
            if name not in font:
                continue
            g = font[name]
            ds = _dots_of(g)
            if not ds:
                # an oval too tall for _is_dot (ḃ ḋ): the small closed contour above the letter
                ds = [c for c in g.contours if len(c.points) == 12 and all(p.type != "line" for p in c.points)
                      and max(p.y for p in c.points) - min(p.y for p in c.points) < 140
                      and min(p.y for p in c.points) > 520]
            was = []
            for c in ds:
                xs, ys = [p.x for p in c.points], [p.y for p in c.points]
                was.append(f"{max(xs) - min(xs)}x{max(ys) - min(ys)}")
                cy = min(ys) + r if "below" in name else round((min(ys) + max(ys)) / 2)   # the dot below holds its
                CH._circle_into(c, round((min(xs) + max(xs)) / 2), cy, r)                  # depth (charset.BELOW)
            if ds:
                log.append(f"{name} {'/'.join(sorted(set(was)))}>{2 * r}")
    return log


def quote_head(font):
    """’ is the comma scaled about nothing in particular by text dot / punctuation dot, its top and sides kept."""
    import charset as CH
    from fontTools.pens.transformPen import TransformPen
    from fontTools.misc.transform import Transform
    if "comma" not in font or "quoteright" not in font:
        return "no comma or quote"
    k = _dot_d(font[TEXT_DOT_SRC]) / PUNCT_DOT
    g = font["quoteright"]
    b = CH.bounds(CH.gp(font, "quoteright"))
    lsb, rsb, top = b[0], g.width - b[2], b[3]
    g.clearContours()
    font["comma"].draw(TransformPen(g.getPen(), Transform(k, 0, 0, k, 0, 0)))
    nb = CH.bounds(CH.gp(font, "quoteright"))
    dx, dy = lsb - nb[0], top - nb[3]
    for c in g.contours:
        for p in c.points:
            p.x, p.y = round(p.x + dx), round(p.y + dy)
    nb = CH.bounds(CH.gp(font, "quoteright"))
    g.width = round(nb[2] + rsb)
    return f"quoteright the comma x {k:.3f} ({b[3] - b[1]:.0f} > {nb[3] - nb[1]:.0f} tall), top {top:.0f}"



# ------------------------------------------------------------------------------------------ curve breaks (item 7)
# The stroke audit's curvature jumps on drawings outside the core: ß 17.6 times at (411, 250), ə 11.0 and Ə 9.4 where
# the bar meets the bowl, ɔ 8.1 at (113, 102); © ® ℗ their letters' tangent breaks. The one rule for a smooth node
# whose curves were drawn apart (0.83, letters 6): every smooth node at one curvature by handle lengths only
# (`figs.even_glyph`: aims 1.25, 1.5, 1.8, kept only where curvecheck's faults do not grow, even.py stays in its
# limits and a branch keeps its neck). Run on the finished glyphs, after the charset and the rings.
EVEN_MORE = ("germandbls", "schwa", "Schwa", "oopen", "Oopen", "s_p", "copyright", "registered",
             "uni2117")


def even_more(font):
    import figs as FIGS
    return [FIGS.even_glyph(font, n) for n in EVEN_MORE if n in font and font[n].contours]


# ------------------------------------------------------------------------------------------------ a seam (item 8)
# Ƭ (Thook, U+01AC) is T's arm and a hook drawn as two contours meeting along one upright cut, each cut end with its
# two corners on 7: the outline runs the same 40-unit segment twice (pathlint, the stroke audit), and the two rounded
# corners leave a notch above and below the seam. The rule (`seams`): where two contours of a glyph each end in an
# upright cut on the same line over the same span, the cuts' corners are made square there and the two are one
# outline (the union); the outer corners elsewhere keep their 7.
SEAM_GLYPHS = ("Thook",)


def seams(font):
    import charset as CH
    log = []
    for name in SEAM_GLYPHS:
        if name not in font or len(font[name].contours) < 2:
            continue
        g = font[name]
        cuts = []
        for ci, c in enumerate(g.contours):
            P, n = c.points, len(c.points)
            for i in range(n):
                a_, b_ = P[i], P[(i + 1) % n]
                if b_.type == "line" and a_.type and a_.x == b_.x and abs(a_.y - b_.y) >= 20:
                    cuts.append((ci, a_.x, min(a_.y, b_.y), max(a_.y, b_.y)))
        pair = next(((a, b) for a in cuts for b in cuts if a[0] < b[0] and a[1] == b[1]
                     and abs(a[2] - b[2]) <= 1 and abs(a[3] - b[3]) <= 1), None)
        if not pair:
            log.append(f"{name}: no seam"); continue
        x0 = pair[0][1]
        c_lo, c_hi = min(pair[0][2], pair[1][2]), max(pair[0][3], pair[1][3])
        near = [p for ci in (pair[0][0], pair[1][0]) for p in g.contours[ci].points if abs(p.x - x0) <= 8]
        lo = min(p.y for p in near if p.y <= c_lo)        # the corners' far ends (on 7 if soft, the cut's own if not)
        hi = max(p.y for p in near if p.y >= c_hi)
        for ci in (pair[0][0], pair[1][0]):
            for p in g.contours[ci].points:
                for yc in (lo, hi):
                    if abs(p.x - x0) <= 8 and abs(p.y - yc) <= 8:
                        p.x, p.y = x0, yc
        w = g.width
        path = CH.gp(font, name)
        CH.put(font, name, path, w)
        log.append(f"{name}: one outline across the seam at x {x0} ({lo} to {hi}), {len(font[name].contours)} contour(s)")
    return log


# ------------------------------------------------------------------------------------------ ↔ ↕ shafts (item 8)
# A shaft between two heads is one width, the hairline (43; charset.SHAFT_BOTH): built about the maths axis, the two
# edges at 291.5 and 334.5 rounded apart to 42 (↔) and 44 (↕). The rule (`shafts`): the whole-unit width is the
# hairline exactly; the edge moved is the one that keeps the shaft's middle nearer the axis; its two corners slide
# along the head's inner edges they end on.
SHAFTS = {"arrowboth": 43, "arrowupdn": 43}


def shafts(font):
    log = []
    for name, want in SHAFTS.items():
        if name not in font:
            continue
        P = font[name].contours[0].points
        n = len(P)
        long_ = [(i, (i + 1) % n) for i in range(n) if P[i].type and P[(i + 1) % n].type == "line"
                 and math.hypot(P[i].x - P[(i + 1) % n].x, P[i].y - P[(i + 1) % n].y) > 200
                 and (P[i].x == P[(i + 1) % n].x or P[i].y == P[(i + 1) % n].y)]
        if len(long_) != 2:
            log.append(f"{name}: shaft not found"); continue
        lev = P[long_[0][0]].y == P[long_[0][1]].y
        k = (lambda p: p.y) if lev else (lambda p: p.x)
        e = sorted(long_, key=lambda ij: k(P[ij[0]]))
        w = k(P[e[1][0]]) - k(P[e[0][0]])
        d = want - w
        if not d:
            continue
        mid = (k(P[e[0][0]]) + k(P[e[1][0]])) / 2
        axis = 313 if lev else mid
        # move the lower (left) edge out by d, or the upper (right) one: whichever leaves the middle nearer the axis
        lowmove = abs((mid - d / 2) - axis) <= abs((mid + d / 2) - axis)
        edge, sgn = (e[0], -1) if lowmove else (e[1], 1)
        for i in edge:
            p = P[i]
            nb = P[(i - 1) % n] if (i - 1) % n not in edge else P[(i + 1) % n]   # the head's inner edge it ends on
            if lev:
                dy = sgn * d
                p.x = round(p.x + dy * (nb.x - p.x) / (nb.y - p.y)); p.y += dy
            else:
                dx = sgn * d
                p.y = round(p.y + dx * (nb.y - p.y) / (nb.x - p.x)); p.x += dx
        log.append(f"{name} shaft {w} > {want}")
    return log
