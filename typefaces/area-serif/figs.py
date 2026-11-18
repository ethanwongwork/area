"""Area Serif 0.83 (Regular pass, item D): the figure 3's bowls at the Regular.

The owner, on the 3 at 400: "can you verify the top and bottom arcs/curves are smooth": in the large view the top
bowl's upper-left arc flattened toward the ball and the bottom bowl's lower-left arc read longer and flatter than its
right. Measured (build/owner8/reg/d/figcomb.py, curvecheck on the whole figure; ref3x.py and thick.py on Georgia Pro,
Serrif, Source Serif 4, Literata, Merriweather, Crimson Pro, PP Kyoto, numbers only): curvecheck read 8 faults on the
3 (worst ratio 2.00): the top's two arcs met with a 1.25 jump (inner) because the top stood at 0.451 of the upper bowl's
width (from the ball's outer left to the bowl's right extreme; references 0.487 to 0.550, median 0.519), so the left
quarter was 200 wide and the right 243 for one height; the bottom at 0.452 (references' median 0.445); the handles of
each quarter unequal (the top-left 0.64 / 0.48 of their sides, the bottom-left 0.59 / 0.49), so each arc ran flat
then turned tight into the ball; three flat places; the upper ball's neck a second upright node 6 units left of the
ball's right extreme (an S of 21 units), where the lower ball runs straight into its inner curve. The thick sits where
it should: on the right of each bowl at mid-height (thickest at 0 and -5 degrees, as the references' 0 to +5).

The rule (`three`): (1) the upper ball's neck is one curve, as the lower ball's: the node between the ball's right
extreme and the inner top is dropped and the two curves refitted as one quarter (end tangents kept); (2) the top and bottom extremes, outer and inner together (the hairline
stays upright), as near the middle of each bowl's width as Area's 8 and S stand theirs while leaving no flat place
(top 0.51, bottom 0.445; see SHARES), moving level with their handles; (3) every smooth node between two curves
at one curvature (`loops.even_nodes`, handle lengths only, target 1.05). Nodes and the waist corner stay where they are.
"""
import math

NAMES = ("three",)
TARGET = 1.05


def _pts(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def _put(g, cs):
    for c, P in zip(g.contours, cs):
        for p, q in zip(c.points, P):
            p.x, p.y = q[0], q[1]


def bowls(P):
    """The 3's places on its one contour: for each bowl (top, bottom) the outer and inner extreme nodes (indices) and
    the bowl's outer left (the ball's outer extreme) and right extreme x."""
    on = [i for i, q in enumerate(P) if q[2]]
    ys = [P[i][1] for i in on]
    mid = (max(ys) + min(ys)) / 2
    out = {}
    for half, sel in (("top", lambda y: y > mid), ("bottom", lambda y: y < mid)):
        idx = [i for i in on if sel(P[i][1]) and P[i][3]]
        if half == "top":
            o = max(idx, key=lambda i: P[i][1])
            inner = [i for i in idx if i != o and abs(P[i][0] - P[o][0]) < 80 and P[i][1] > mid + 150]
            n_ = max(inner, key=lambda i: P[i][1])
        else:
            o = min(idx, key=lambda i: P[i][1])
            inner = [i for i in idx if i != o and abs(P[i][0] - P[o][0]) < 80 and P[i][1] < mid - 150]
            n_ = min(inner, key=lambda i: P[i][1])
        xs = [P[i][0] for i in on if sel(P[i][1])]
        out[half] = (o, n_, min(xs), max(xs))
    return out


def even(P):
    import loops as L
    return [(round(q[0]), round(q[1]), q[2], q[3]) for q in L.even_nodes(P, (-1000, 2000), rounds=12, target=TARGET)[0]]


def shares(P):
    b = bowls(P)
    return {h: ((P[o][0] - lo) / (hi - lo), (P[n_][0] - lo) / (hi - lo)) for h, (o, n_, lo, hi) in b.items()}


def place(P, want):
    """Move each bowl's top / bottom extremes level to the wanted shares, with their handles."""
    P = [list(q) for q in P]
    n = len(P)
    b = bowls(P)
    for h, (o, n_, lo, hi) in b.items():
        for i, s in zip((o, n_), want[h]):
            dx = lo + s * (hi - lo) - P[i][0]
            for j in (i - 1, i, (i + 1) % n):
                P[j][0] += dx
    return [(round(q[0]), round(q[1]), q[2], q[3]) for q in P]


def waist(P):
    """The outer waist: the corner on the right between the two bowls (index), and its notch: how far it stands in from
    the nearer of the two bowls' right extremes, over the ink width."""
    on = [i for i, q in enumerate(P) if q[2]]
    ys = [P[i][1] for i in on]
    lo_, hi_ = min(ys), max(ys)
    xs = [P[i][0] for i in on]
    cand = [i for i in on if not P[i][3] and lo_ + 0.35 * (hi_ - lo_) < P[i][1] < lo_ + 0.65 * (hi_ - lo_)]
    w = max(cand, key=lambda i: P[i][0])
    mid = (hi_ + lo_) / 2
    rt = max(P[i][0] for i in on if P[i][1] > mid)
    rb = max(P[i][0] for i in on if P[i][1] < mid)
    return w, (min(rt, rb) - P[w][0]) / (max(xs) - min(xs)), min(rt, rb), max(xs) - min(xs)


def keep_waist(P, notch):
    """The outer waist corner moved level (with its handles) so its notch is the Regular's share of the width (the
    references keep theirs within 0.02 from 400 to 700; Area's fell 0.268 > 0.250 at 800: the lobes ran together)."""
    P = [list(q) for q in P]
    n = len(P)
    w, cur, rmin, wd = waist(P)
    dx = (rmin - notch * wd) - P[w][0]
    for j in (w - 1, w, (w + 1) % n):
        P[j][0] += dx
    return [(round(q[0]), round(q[1]), q[2], q[3]) for q in P]



# Area's own two-bowl rounds stand their top and bottom at the middle of each bowl (8 0.493 / 0.496, S 0.498 /
# 0.489); the 3 stood at 0.451 / 0.452. Scanned (d/figcomb.py): with the top at 0.49 / 0.50 / 0.505 a flat place stays in
# the inner curve into the waist, and with the bottom at 0.452 / 0.449 one in the lower bowl's inner curve into the
# waist; the nearest places to the bowls' middle at which every node meets at one curvature with no flat place are
# top 0.51 and bottom 0.445, both inside the references' ranges (0.487 to 0.550, 0.38 to 0.49)
SHARES = {"top": 0.51, "bottom": 0.445}
NAMES = ("three",)


def neck(P):
    """Drop the upper ball's second upright node (between the ball's right extreme and the inner top) and refit the two
    curves as one quarter: start tangent upright, end tangent level, handles the lower ball's shares (evened after)."""
    on = [i for i, q in enumerate(P) if q[2]]
    b = bowls(P)
    n_ = b["top"][1]
    k = on.index(n_)
    i24, i21 = on[k - 1], on[k - 2]
    upright = lambda i: abs(P[i - 1][0] - P[i][0]) < 0.5 and abs(P[(i + 1) % len(P)][0] - P[i][0]) < 0.5   # noqa: E731
    if not (upright(i24) and upright(i21) and P[i24][2] == "curve" and P[n_][2] == "curve"):
        return P, False
    a, e = P[i21], P[n_]
    # the handles' shares of their sides are the lower ball's own (its inner bottom into the ball's right extreme: the
    # same quarter turned over), so the two balls run into their bowls alike
    nb = b["bottom"][1]
    kb = on.index(nb)
    lo_b = on[(kb + 1) % len(on)]
    hb1, hb2 = P[(nb + 1) % len(P)], P[(nb + 2) % len(P)]
    s_level = abs(hb1[0] - P[nb][0]) / max(1.0, abs(P[lo_b][0] - P[nb][0]))
    s_up = abs(P[lo_b][1] - hb2[1]) / max(1.0, abs(P[lo_b][1] - P[nb][1]))
    h1 = (a[0], a[1] + s_up * (e[1] - a[1]))
    h2 = (e[0] - s_level * (e[0] - a[0]), e[1])
    Q = list(P[:i21 + 1]) + [(h1[0], h1[1], None, False), (h2[0], h2[1], None, False)] + list(P[n_:])
    return [(round(q[0]), round(q[1]), q[2], q[3]) for q in Q], True


def three(P):
    P, merged = neck(P)
    b = bowls(P)
    sh = shares(P)
    want = {h: ((SHARES[h], sh[h][1] + SHARES[h] - sh[h][0]) if SHARES[h] is not None else sh[h]) for h in b}
    return even(place(P, want)), merged


# 0.83 item D, the other round figures (figcomb.py): 5 six faults (worst 2.95 where the bowl's top runs into its
# right side, a flat place), 6 two (4.56 where the long stroke enters the bowl), 9 one (2.51, the same place turned);
# 2 one (1.43 at the ball's neck, which even_nodes leaves); 8 and 0 pass. The same rule, the smooth nodes at one
# curvature by handle lengths, cures 5; it cures 6 and 9 too but undoes even.py's thickness round their counters
# (strays 2.4 / 2.6 > 4.7 / 3.7, limit 2.75), so they are left until one solve holds both. A handle the whole-unit
# rounding leaves off its node's line is turned back onto it (`collinear`)
EVEN_FIGS = ("five",)


def collinear(P):
    """Each smooth node between two handles: the shorter handle turned onto the longer's line through the node."""
    P = [list(q) for q in P]
    n = len(P)
    for i, q in enumerate(P):
        if not q[2] or not q[3]:
            continue
        a, b = P[i - 1], P[(i + 1) % n]
        if (a[2] is None) != (b[2] is None) and q[2] == "line" and a[2] is not None:
            # a line into a curve: the handle on the line's direction, its length kept
            ln = math.dist(a[:2], q[:2])
            lh = math.dist(b[:2], q[:2])
            if ln > 1 and lh > 1:
                d = ((q[0] - a[0]) / ln, (q[1] - a[1]) / ln)
                b[0], b[1] = round(q[0] + d[0] * lh), round(q[1] + d[1] * lh)
            continue
        if a[2] is not None or b[2] is not None:
            continue
        la, lb = math.dist(a[:2], q[:2]), math.dist(b[:2], q[:2])
        if min(la, lb) < 1:
            continue
        lng, sht, ls = (a, b, lb) if la >= lb else (b, a, la)
        d = ((q[0] - lng[0]) / max(la, lb), (q[1] - lng[1]) / max(la, lb))
        sht[0], sht[1] = round(q[0] + d[0] * ls), round(q[1] + d[1] * ls)
    return [tuple(q) for q in P]


def even_figs(font):
    import curvecheck as K
    notes = []
    for name in EVEN_FIGS:
        if name not in font:
            continue
        cs = _pts(font[name])
        b0, w0 = K.report(name, cs, (-1000, 2000))[:2]
        new = [collinear(even(P)) for P in cs]
        b1, w1 = K.report(name, new, (-1000, 2000))[:2]
        if (len(b1), w1) < (len(b0), w0):
            _put(font[name], new)
            notes.append(f"{name}: worst ratio {w0:.2f} > {w1:.2f}, faults {len(b0)} > {len(b1)}")
        else:
            notes.append(f"{name}: left ({w0:.2f}, {len(b0)})")
    return "; ".join(notes)


def regular(font):
    import curvecheck as K
    notes = []
    for name in NAMES:
        if name not in font:
            continue
        cs = _pts(font[name])
        b0, w0 = K.report(name, cs, (-1000, 2000))[:2]
        new, merged = three(cs[0])
        b1, w1 = K.report(name, [new] + cs[1:], (-1000, 2000))[:2]
        g = font[name]
        from ufoLib2.objects import Contour, Point
        c = Contour(); c.points = [Point(x, y, t, smooth=sm) for x, y, t, sm in new]
        g.contours[0] = c
        notes.append(f"{name}: neck merged {merged}, extremes at {SHARES}; worst ratio {w0:.2f} > {w1:.2f}, faults "
                     f"{len(b0)} > {len(b1)}")
    notes.append(even_figs(font))
    return "; ".join(notes)


# ------------------------------------------------------------------ 0.83 item E: g's bowl one oval through the ear's root
# The owner: "is the ear of the g supposed to have the round part of the top story of the g be misaligned?" It is not.
# Measured (build/owner8/reg/e/gdent.py: the drawn outline either side of the ear against one cubic from the bowl's
# right extreme to its top at the bowl's own upper-left quarter's tensions, + outside): the Regular's upper piece stands
# out 4.9 at the ear's upper root U and the lower piece 2.8 at its lower root D, a 2-unit step across the ear; the Bold
# (snap082i) U +25.3 and D -10.5 (the outline above the ear stands out, the bowl below it resumes inside: the notch the
# owner saw at the heavy weights), the Light D +8.0, U -7.4. The rule
# (`g_oval`): the bowl's outer upper-right quarter is one cubic from the right extreme E (upright) to the top T (level),
# at the bowl's own upper-left quarter's tensions (the oval the ear is laid over); U and D slide onto it (each to the
# nearest place on it) and the two outer pieces E-D and U-T are that cubic's pieces, so the outline either side of the
# ear lies on one curve, tangent-continuous. The ear's own curves keep their shape, their ends moving with U and D.
G_OVAL = ("g",)


def _bez(s, t):
    u = 1 - t
    return (u ** 3 * s[0][0] + 3 * u * u * t * s[1][0] + 3 * u * t * t * s[2][0] + t ** 3 * s[3][0],
            u ** 3 * s[0][1] + 3 * u * u * t * s[1][1] + 3 * u * t * t * s[2][1] + t ** 3 * s[3][1])


def _sub(s, t0, t1):
    def split(s, t):
        lerp = lambda a, b: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)   # noqa: E731
        a, b, c = lerp(s[0], s[1]), lerp(s[1], s[2]), lerp(s[2], s[3])
        d, e = lerp(a, b), lerp(b, c)
        f = lerp(d, e)
        return (s[0], a, d, f), (f, e, c, s[3])
    if t1 < 1:
        s = split(s, t1)[0]
        t0 = t0 / t1 if t1 > 0 else 0
    if t0 > 0:
        s = split(s, t0)[1]
    return s


def ear_places(P):
    """(E, D, U, T) indices on g's outer contour: the bowl's right extreme, the ear's lower and upper roots (corners),
    the bowl's top; and the next on-curve node after T (the bowl's left extreme)."""
    n = len(P)
    on = [i for i, q in enumerate(P) if q[2]]
    top = max(q[1] for q in P)
    corners = [i for i in on if not P[i][3] and P[i][1] > top - 150 and P[i][0] > 300]
    corners = sorted(corners, key=lambda i: P[i][1])[:2]
    D, U = corners[0], corners[1]
    E = max([i for i in on if i < D], default=None) if D > 0 else None
    k = on.index(D)
    E = on[k - 1]
    T = on[(on.index(U) + 1) % len(on)]
    Lx = on[(on.index(T) + 1) % len(on)]
    return E, D, U, T, Lx


def g_oval(P):
    P = [list(q) for q in P]
    n = len(P)
    E, D, U, T, Lx = ear_places(P)
    pt = lambda i: (P[i % n][0], P[i % n][1])                                  # noqa: E731
    # the upper-left quarter's tensions: T's handle over the width, Lx's handle over the height
    th = abs(pt(T + 1)[0] - pt(T)[0]) / abs(pt(T)[0] - pt(Lx)[0])
    tv = abs(pt(Lx - 1)[1] - pt(Lx)[1]) / abs(pt(T)[1] - pt(Lx)[1])
    e, t = pt(E), pt(T)
    s = (e, (e[0], e[1] + tv * (t[1] - e[1])), (t[0] + th * (e[0] - t[0]), t[1]), t)
    # 0.83 item E: the cubic's two handles are fitted (least squares, end tangents fixed) to the drawn outline either
    # side of the ear, so the complete quarter is the one the two pieces were drawn on (the upper-left quarter's
    # tensions alone made it a different oval: a 1.73 jump at E; matching E's curvature alone bulged it 8 units out)
    import numpy as np
    drawn = []
    for i0, i3 in ((E, D), (U, T)):
        c_ = (pt(i0), pt(i0 + 1), pt(i0 + 2), pt(i3))
        drawn += [_bez(c_, k / 12) for k in range(13)]
    drawn = np.array(drawn)

    def cost(tv_, th_):
        c_ = (e, (e[0], e[1] + tv_ * (t[1] - e[1])), (t[0] + th_ * (e[0] - t[0]), t[1]), t)
        poly = np.array([_bez(c_, k / 160) for k in range(161)])
        d = np.sqrt(((drawn[:, None, :] - poly[None, :, :]) ** 2).sum(-1)).min(1)
        return float((d ** 2).sum())
    best = min(((cost(a_, b_), a_, b_) for a_ in np.arange(0.40, 0.80, 0.02) for b_ in np.arange(0.40, 0.80, 0.02)))
    _, tv, th = best
    for step in (0.005, 0.001):
        best = min(((cost(a_, b_), a_, b_) for a_ in np.arange(tv - 4 * step, tv + 4.5 * step, step)
                    for b_ in np.arange(th - 4 * step, th + 4.5 * step, step)))
        _, tv, th = best
    s = (e, (e[0], e[1] + tv * (t[1] - e[1])), (t[0] + th * (e[0] - t[0]), t[1]), t)

    def nearest(p):
        best = min(range(401), key=lambda k: math.dist(_bez(s, k / 400), p))
        return best / 400
    tD, tU = nearest(pt(D)), nearest(pt(U))
    a, b = _sub(s, 0.0, tD), _sub(s, tU, 1.0)
    moved = {}
    for i, new in ((D, a[3]), (U, b[0])):
        moved[i] = (new[0] - P[i][0], new[1] - P[i][1])
    # E-D: points E+1, E+2 (handles), D; U-T: U, U+1, U+2
    P[(E + 1) % n][:2] = a[1]; P[(E + 2) % n][:2] = a[2]
    P[D][:2] = a[3]
    P[(D + 1) % n][0] += moved[D][0]; P[(D + 1) % n][1] += moved[D][1]      # the ear's curve leaving D
    P[(U - 1) % n][0] += moved[U][0]; P[(U - 1) % n][1] += moved[U][1]      # the ear's curve into U
    P[U][:2] = b[0]
    P[(U + 1) % n][:2] = b[1]; P[(U + 2) % n][:2] = b[2]
    out = [(round(q[0]), round(q[1]), q[2], q[3]) for q in P]
    return out, (round(float(moved[D][0]), 1), round(float(moved[D][1]), 1)), (round(float(moved[U][0]), 1), round(float(moved[U][1]), 1))


def oval_reading(P):
    """The ear's two roots against the bowl's extremes' ellipse (1 = on it)."""
    E, D, U, T, Lx = ear_places(P)
    cx = (P[E][0] + P[Lx][0]) / 2
    a = (P[E][0] - P[Lx][0]) / 2
    b = P[T][1] - P[Lx][1]
    cy = P[Lx][1]
    r = lambda i: math.sqrt(((P[i][0] - cx) / a) ** 2 + ((P[i][1] - cy) / b) ** 2)     # noqa: E731
    return round(r(U), 3), round(r(D), 3)


def g_regular(font):
    notes = []
    for name in G_OVAL:
        if name not in font:
            continue
        cs = _pts(font[name])
        before = oval_reading(cs[0])
        new, dD, dU = g_oval(cs[0])
        _put(font[name], [new] + cs[1:])
        notes.append(f"{name}: ear roots on the bowl's oval (U / D {before} > {oval_reading(new)}; moved D {dD}, U {dU})")
    return "; ".join(notes)
