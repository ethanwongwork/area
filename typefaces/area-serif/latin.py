"""Area Serif 0.84 (Regular pass 7): local repairs of the Latin letters at 400.

The owner: "please also audit the latin characters as well and fix any errors there too. Focus on the 400 weight
only", and, of earlier passes, that repeated rounds changed shapes they liked. So every rule here is local: it finds
its place on the finished drawing by geometry (a node at a stated place, within SNAP units; a level or upright pair),
rebuilds only the curves there, and leaves the rest of the outline where it was. The masters read the Regular's points
as before (no point is added or removed).

The one construction most items use, `refit`: the curves between two nodes become one cubic (each end's tangent kept,
the handle lengths fitted to the drawn outline by least squares, and where an end is a smooth node of a curve kept
outside the span, its curvature met there: G2), then cut again at each inner node's place (de Casteljau), so the node
stays where it was within a unit or two and the curvature runs through it continuously.
"""
import math

NODE_SLIDE = 15.0    # how far an inner node may slide along the rebuilt span
SNAP = 4.0          # a rule's stated place finds the node within this many units


# ------------------------------------------------------------------------------------------------ geometry helpers
def _bez(c, t):
    a, b, cc, d = c
    u = 1 - t
    return (u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * cc[0] + t ** 3 * d[0],
            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * cc[1] + t ** 3 * d[1])


def _split(c, t):
    a, b, cc, d = c
    lerp = lambda p, q: (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)   # noqa: E731
    ab, bc, cd = lerp(a, b), lerp(b, cc), lerp(cc, d)
    abc, bcd = lerp(ab, bc), lerp(bc, cd)
    m = lerp(abc, bcd)
    return (a, ab, abc, m), (m, bcd, cd, d)


def _on(P):
    return [i for i, q in enumerate(P) if q[2]]


def find_node(P, xy, snap=SNAP):
    best = min(_on(P), key=lambda i: math.dist(P[i][:2], xy))
    return best if math.dist(P[best][:2], xy) <= snap else None


def _span(P, i0, i1):
    """The cubics from on-curve i0 to on-curve i1 going forward: [(p0, c1, c2, p3)], and the inner on-curve indices."""
    n = len(P)
    segs, inner, i = [], [], i0
    while i != i1:
        j = (i + 1) % n
        if P[j][2] is not None:          # a line inside the span: not a span refit can take
            return None, None
        k = (i + 3) % n
        segs.append((P[i][:2], P[j][:2], P[(i + 2) % n][:2], P[k][:2]))
        i = k
        if i != i1:
            inner.append(i)
    return segs, inner


def _samples(segs, per=40):
    S = []
    for s in segs:
        S += [_bez(s, t / per) for t in range(per)]
    S.append(segs[-1][3])
    return S


def _unit(v):
    L = math.hypot(*v)
    return (v[0] / L, v[1] / L)


def _curv_start(p0, d0, a, p2):
    """Curvature at the start of a cubic p0, p0 + a d0, p2, ... (signed)."""
    p1 = (p0[0] + a * d0[0], p0[1] + a * d0[1])
    v1 = (p1[0] - p0[0], p1[1] - p0[1])
    v2 = (p2[0] - p1[0], p2[1] - p1[1])
    return (2.0 / 3.0) * (v1[0] * v2[1] - v1[1] * v2[0]) / max(a, 1e-9) ** 3


def inflections(c):
    """Parameters in (0, 1) where a cubic's curvature changes sign."""
    a, b, cc, d = c
    # B'(t) = 3[(1-t)^2 A + 2(1-t)t B + t^2 C], A = b - a, B = cc - b, C = d - cc; cross(B', B'') = 0 is quadratic
    A = (b[0] - a[0], b[1] - a[1])
    Bv = (cc[0] - b[0], cc[1] - b[1])
    C = (d[0] - cc[0], d[1] - cc[1])
    cr = lambda u, v: u[0] * v[1] - u[1] * v[0]          # noqa: E731
    # cross(B', B'') / 18 = (1 - t)^2 cr(A, B) + (1 - t) t cr(A, C) + t^2 cr(B, C)
    p, q, r = cr(A, Bv), cr(A, C), cr(Bv, C)
    qa, qb, qc = p - q + r, -2 * p + q, p
    out = []
    if abs(qa) < 1e-12:
        if abs(qb) > 1e-12:
            out = [-qc / qb]
    else:
        disc = qb * qb - 4 * qa * qc
        if disc >= 0:
            out = [(-qb + s * math.sqrt(disc)) / (2 * qa) for s in (-1, 1)]
    return sorted(t for t in out if 0.02 < t < 0.98)


def _kt(c, t):
    import curvecheck as K
    return K.curvature(("C", c), t)


def refit(P, i0, i1, k0=None, k1=None, kr=1.2, at_inflection=False, free_end=False, rising=False, min_h=0.0,
          ts=None):
    """The curves from on-curve node i0 to i1 (forward) as one cubic, cut again at the inner nodes' places. The start
    tangent kept, the end's kept too unless `free_end` (a corner); the handle lengths (and the free end's direction)
    those of the cubic nearest the drawn outline (largest distance) among those that: meet k0 / k1 (signed curvature
    per unit at the ends, the neighbouring curves' own) within kr times; with `rising`, curve one way only and tighten
    all along (a fillet into a corner); keep each handle at least min_h of the chord. Returns (new point list in
    floats, the largest distance from the drawn outline), or (None, None) when no cubic qualifies."""
    import numpy as np
    from scipy.spatial import cKDTree
    from scipy.optimize import minimize
    segs, inner = _span(P, i0, i1)
    if not segs:
        return None, None
    p0, p3 = segs[0][0], segs[-1][3]
    h0 = segs[0][1] if math.dist(segs[0][1], p0) > 0.5 else segs[0][2]     # a retracted handle: the next one's line
    h1 = segs[-1][2] if math.dist(segs[-1][2], p3) > 0.5 else segs[-1][1]
    d0 = _unit((h0[0] - p0[0], h0[1] - p0[1]))
    d1 = _unit((p3[0] - h1[0], p3[1] - h1[1]))       # direction of travel at the end
    S = np.array(_samples(segs))
    tree = cKDTree(S)
    span = math.dist(p0, p3)
    th1 = math.atan2(d1[1], d1[0])
    tt = np.linspace(0, 1, 121)

    def cub(x):
        a, b = x[0], x[1]
        e1 = (math.cos(th1 + x[2]), math.sin(th1 + x[2])) if free_end else d1
        return (p0, (p0[0] + a * d0[0], p0[1] + a * d0[1]), (p3[0] - b * e1[0], p3[1] - b * e1[1]), p3), e1

    def sample(c):
        u = 1 - tt
        A = np.array(c)
        return (np.outer(u ** 3, A[0]) + np.outer(3 * u * u * tt, A[1]) + np.outer(3 * u * tt * tt, A[2])
                + np.outer(tt ** 3, A[3]))

    def kof(c):
        u = 1 - tt
        A = np.array(c)
        D1 = (np.outer(3 * u * u, A[1] - A[0]) + np.outer(6 * u * tt, A[2] - A[1]) + np.outer(3 * tt * tt, A[3] - A[2]))
        D2 = np.outer(6 * u, A[2] - 2 * A[1] + A[0]) + np.outer(6 * tt, A[3] - 2 * A[2] + A[1])
        return (D1[:, 0] * D2[:, 1] - D1[:, 1] * D2[:, 0]) / np.maximum(np.hypot(D1[:, 0], D1[:, 1]) ** 3, 1e-12)

    def kbad(kk, kw):
        if kw is None:
            return 0.0
        if kk * kw <= 0:
            return 10.0
        return max(0.0, abs(math.log(abs(kk) / abs(kw))) - math.log(kr))

    def score(x):
        if min(x[:2]) < max(0.5, min_h * span):
            return 1e9
        c, e1 = cub(x)
        Q = sample(c)
        dev = max(cKDTree(Q).query(S)[0].max(), tree.query(Q)[0].max())
        ks = kof(c)
        bad = kbad(ks[0], k0) + kbad(ks[-1], k1)
        if rising:
            sg = 1 if ks[-1] >= 0 else -1
            k_ = sg * ks
            bad += float(np.clip(-k_, 0, None).sum() + np.clip(k_[:-1] - k_[1:], 0, None).sum()) * span
        return dev + 1000 * bad
    fr = (0.04, 0.07, 0.1, 0.14, 0.18, 0.22, 0.27, 0.33, 0.4, 0.48, 0.57, 0.67, 0.8)
    angs = [k * 0.1 for k in range(-12, 13)] if free_end else [0.0]
    grid = sorted(((score([fa * span, fb * span, g]), [fa * span, fb * span, g]) for fa in fr for fb in fr
                   for g in angs), key=lambda q: q[0])
    best = None
    for _c, start in grid[:5]:
        r = minimize(score, start, method="Nelder-Mead", options={"xatol": 0.01, "fatol": 1e-4, "maxiter": 2000})
        if best is None or r.fun < best.fun:
            best = r
    if best.fun > 1e3 * 0.02 + 50:                 # no cubic meets the conditions
        return None, None
    c = cub(best.x)[0]
    # the inner nodes: each at the parameter nearest its old place
    Q = [(t / 2000, _bez(c, t / 2000)) for t in range(2001)]
    ts = ts or [min(Q, key=lambda q: math.dist(q[1], P[i][:2]))[0] for i in inner]
    if at_inflection and len(inner) == 1 and inflections(c):   # a node at the inflection (Bezier rules)
        ts = [min(inflections(c), key=lambda t: abs(t - ts[0]))]
    pieces, rest, t_prev = [], c, 0.0
    for t in ts:
        tl = (t - t_prev) / (1 - t_prev)
        a, rest = _split(rest, tl)
        pieces.append(a)
        t_prev = t
    pieces.append(rest)
    n = len(P)
    Pn = [list(q) for q in P]
    i = i0
    for pc in pieces:
        Pn[(i + 1) % n][:2] = pc[1]
        Pn[(i + 2) % n][:2] = pc[2]
        Pn[(i + 3) % n][:2] = pc[3]
        i = (i + 3) % n
    # how far the new outline lies from the drawn one
    dev = float(cKDTree(sample(c)).query(S)[0].max())
    return [tuple(q) for q in Pn], dev


def refit_whole(P, i0, i1, **kw):
    """refit, on whole units: with one inner node its place along the new cubic is free (the drawn node's place, or
    any of 0.25 to 0.75 of the cubic's parameter), the one whose rounded nodes read nearest one curvature (then
    nearest the drawn place) kept. Returns (point list, largest distance) or (None, None)."""
    Pn, dev = refit(P, i0, i1, **kw)
    if Pn is None:
        return None, None
    n = len(P)
    inner = [j for j in range(1, (i1 - i0) % n) if P[(i0 + j) % n][2]]
    nodes = [i0] + [(i0 + j) % n for j in inner] + [i1]
    cands = [(Pn, dev)]
    if len(inner) == 1 and not kw.get("at_inflection"):
        cands += [refit(P, i0, i1, ts=[t], **kw) for t in (0.25, 0.35, 0.45, 0.55, 0.65, 0.75)]
    best, bc = None, None
    for Q, d in cands:
        W = whole_best(Q, i0, i1)
        c = sum(_node_cost(W, k) for k in nodes) * 100 + d
        if bc is None or c < bc:
            best, bc, bd = W, c, d
    return best, bd


def end_k(P, i, side):
    """Signed curvature, per unit, of the curve on `side` (-1 before, +1 after) of on-curve node i, at the node."""
    import curvecheck as K
    n = len(P)
    if side < 0:
        s = ("C", (P[(i - 3) % n][:2], P[(i - 2) % n][:2], P[(i - 1) % n][:2], P[i][:2]))
        return K.end_k(s, True)
    s = ("C", (P[i][:2], P[(i + 1) % n][:2], P[(i + 2) % n][:2], P[(i + 3) % n][:2]))
    return K.end_k(s, False)


def whole(P):
    return [(round(q[0]), round(q[1]), q[2], q[3]) for q in P]


def _pts(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def _put(g, cs):
    for c, P in zip(g.contours, cs):
        for p, q in zip(c.points, P):
            p.x, p.y = q[0], q[1]


def _bend(P, i):
    """A smooth node's handles off one line, degrees."""
    import curvecheck as K
    n = len(P)
    if not P[i][3] or P[(i - 1) % n][2] is not None or P[(i + 1) % n][2] is not None:
        return 0.0
    a = ("C", tuple(P[(i + d) % n][:2] for d in (-3, -2, -1, 0)))
    b = ("C", tuple(P[(i + d) % n][:2] for d in (0, 1, 2, 3)))
    ta, tb = K.tangent(a, True), K.tangent(b, False)
    return math.degrees(math.acos(max(-1, min(1, ta[0] * tb[0] + ta[1] * tb[1]))))


def _node_cost(P, i):
    """How far a smooth node is from one curvature: 0 when the curvature flips (an inflection on the node) or the
    two sides are within 1.15 of each other; the excess ratio otherwise, and the handles' angle off one line."""
    import curvecheck as K
    n = len(P)
    if P[(i - 1) % n][2] is not None or P[(i + 1) % n][2] is not None:
        return 0.0
    a = ("C", tuple(P[(i + d) % n][:2] for d in (-3, -2, -1, 0)))
    b = ("C", tuple(P[(i + d) % n][:2] for d in (0, 1, 2, 3)))
    ta, tb = K.tangent(a, True), K.tangent(b, False)
    g1 = math.degrees(math.acos(max(-1, min(1, ta[0] * tb[0] + ta[1] * tb[1]))))
    ka, kb = K.end_k(a, True), K.end_k(b, False)
    c = 4 * g1
    if ka * kb < 0 or max(abs(ka), abs(kb)) < 2e-5:
        return c
    lo, hi = sorted((abs(ka), abs(kb)))
    return c + max(0.0, hi / max(lo, 1e-9) - 1.15)


def whole_best(P, i0, i1):
    """Whole units for the points of the span i0..i1 (refit's floats): of the floor / ceiling choices for every point
    strictly inside it, the one whose nodes (i0, the inner nodes, i1) read nearest one curvature, then nearest the
    floats."""
    import itertools
    n = len(P)
    idx, i = [], (i0 + 1) % n
    while i != i1:
        idx.append(i)
        i = (i + 1) % n
    nodes = [i0] + [j for j in idx if P[j][2]] + [i1]
    base = whole(P)
    opts = []
    near_inner = {(k + d) % n for k in nodes[1:-1] for d in (-1, 0, 1)}
    for j in idx:
        x, y = P[j][0], P[j][1]
        if j in near_inner:            # an inner node and its handles: a unit either way, so an inflection can flip
            xs, ys = {round(x) - 1, round(x), round(x) + 1}, {round(y) - 1, round(y), round(y) + 1}
        else:
            xs, ys = {math.floor(x), math.ceil(x)}, {math.floor(y), math.ceil(y)}
        for e in nodes:                 # a node's handle on its level or upright stays there, and so does the node
            for h in ((e - 1) % n, (e + 1) % n):
                if j == h and abs(P[h][1] - P[e][1]) < 0.5:
                    ys = {round(P[e][1])}
                if j == h and abs(P[h][0] - P[e][0]) < 0.5:
                    xs = {round(P[e][0])}
            if j == e and any(abs(P[(e + d) % n][1] - P[e][1]) < 0.5 for d in (-1, 1)):
                ys = {round(P[e][1])}
            if j == e and any(abs(P[(e + d) % n][0] - P[e][0]) < 0.5 for d in (-1, 1)):
                xs = {round(P[e][0])}
        opts.append([(fx, fy) for fx in xs for fy in ys])
    best, bc = None, None
    scored = []
    for combo in itertools.product(*opts):
        Q = list(base)
        d = 0.0
        for j, (x, y) in zip(idx, combo):
            Q[j] = (x, y, P[j][2], P[j][3])
            d += math.dist((x, y), P[j][:2])
        scored.append((sum(_node_cost(Q, k) for k in nodes) * 100 + d, Q))
    scored.sort(key=lambda q: q[0])
    for c, Q in scored[:40]:            # the inflection test (slower) on the best forty only
        c += 100 * _span_infl(Q, i0, i1)
        if bc is None or c < bc:
            best, bc = Q, c
    return best


def _span_infl(P, i0, i1):
    """Curves of the span (30 units or longer) whose curvature changes sign where it is over 0.12 of its largest
    (the stroke audit's inflection inside a curve)."""
    import curvecheck as K
    segs, _ = _span(P, i0, i1)
    k_ = 0
    for s in segs or []:
        if math.dist(s[0], s[3]) < 30:
            continue
        ks = [K.curvature(("C", s), t / 96) for t in range(97)]
        top = max(abs(k) for k in ks) or 1e-12
        sg = [1 if k > 0 else -1 for k in ks if abs(k) > 0.12 * top]
        k_ += any(a != b for a, b in zip(sg, sg[1:]))
    return k_


def _past(c):
    """How far a cubic's handles run past the point where their two lines meet (0 when inside the triangle; an S
    curve, which turns both ways, has no such triangle)."""
    if inflections(c):
        return 0.0
    a, b, cc, d = c
    u = (b[0] - a[0], b[1] - a[1])
    v = (cc[0] - d[0], cc[1] - d[1])
    den = u[0] * v[1] - u[1] * v[0]
    if abs(den) < 1e-9:
        return 0.0
    w = (d[0] - a[0], d[1] - a[1])
    t = (w[0] * v[1] - w[1] * v[0]) / den          # a + t u = d + s v
    s_ = (w[0] * u[1] - w[1] * u[0]) / den
    if t <= 0 or s_ <= 0:
        return 0.0
    return max(0.0, 1 - t) * math.hypot(*u) + max(0.0, 1 - s_) * math.hypot(*v)


def chain_fit(P, i0, i1, k0=None, k1=None, kr=1.15, free_end=False, rising=False, min_a=12.0, seed=None,
              one_sign=False):
    """The curves from i0 to i1 rebuilt as the same number of cubics, each inner node free to slide and turn: every
    node smooth at one curvature (within kr), the first meeting k0 (and the last k1 unless `free_end`), with `rising`
    the curvature only tightening along the span, every handle at a judged node at least min_a long (so whole units
    keep its curvature); the outline nearest the drawn one (largest distance). Returns (floats, distance) or
    (None, None)."""
    import numpy as np
    from scipy.spatial import cKDTree
    from scipy.optimize import minimize
    segs, inner = _span(P, i0, i1)
    if not segs:
        return None, None
    n = len(P)
    m = len(segs)
    S = np.array(_samples(segs))
    tree = cKDTree(S)
    p0, p3 = segs[0][0], segs[-1][3]
    h0 = segs[0][1] if math.dist(segs[0][1], p0) > 0.5 else segs[0][2]
    d0 = _unit((h0[0] - p0[0], h0[1] - p0[1]))
    h1 = segs[-1][2] if math.dist(segs[-1][2], p3) > 0.5 else segs[-1][1]
    th_end = math.atan2(p3[1] - h1[1], p3[0] - h1[0])
    tt = np.linspace(0, 1, 61)
    base = seed or P
    # variables: per inner node x, y, angle; per segment two handle lengths; end angle offset when free
    x0 = []
    for i in inner:
        hp = base[(i + 1) % n] if math.dist(base[(i + 1) % n][:2], base[i][:2]) > 0.5 else base[(i - 1) % n]
        sg_ = 1 if hp is base[(i + 1) % n] else -1
        h = _unit((sg_ * (hp[0] - base[i][0]), sg_ * (hp[1] - base[i][1])))
        x0 += [base[i][0], base[i][1], math.atan2(h[1], h[0])]
    j = i0
    for _s in segs:
        x0 += [math.dist(base[j][:2], base[(j + 1) % n][:2]), math.dist(base[(j + 2) % n][:2], base[(j + 3) % n][:2])]
        j = (j + 3) % n
    if free_end:
        x0 += [0.0]

    # an inner node at an extreme (its handles level or upright) keeps its place and tangent: it stays the extreme
    fixed_ang = {}
    for k, i in enumerate(inner):                       # read on the drawing, not the seed
        hp = P[(i + 1) % n] if math.dist(P[(i + 1) % n][:2], P[i][:2]) > 0.5 else None
        if hp is None:
            continue
        a_ = math.atan2(hp[1] - P[i][1], hp[0] - P[i][0])
        for q in (0.0, math.pi / 2, math.pi, -math.pi / 2, -math.pi):
            if abs(a_ - q) < math.radians(0.5):
                fixed_ang[k] = q
                x0[3 * k], x0[3 * k + 1] = P[i][0], P[i][1]

    def build(x):
        pts = [p0] + [(x0[3 * k], x0[3 * k + 1]) if k in fixed_ang else (x[3 * k], x[3 * k + 1])
                      for k in range(len(inner))] + [p3]
        dirs = [d0] + [(math.cos(fixed_ang.get(k, x[3 * k + 2])), math.sin(fixed_ang.get(k, x[3 * k + 2])))
                       for k in range(len(inner))]
        te = th_end + (x[-1] if free_end else 0.0)
        dirs.append((math.cos(te), math.sin(te)))
        hl = x[3 * len(inner):3 * len(inner) + 2 * m]
        cs = []
        for k in range(m):
            a, b = hl[2 * k], hl[2 * k + 1]
            cs.append((pts[k], (pts[k][0] + a * dirs[k][0], pts[k][1] + a * dirs[k][1]),
                       (pts[k + 1][0] - b * dirs[k + 1][0], pts[k + 1][1] - b * dirs[k + 1][1]), pts[k + 1]))
        return cs, hl

    def kof(c):
        u = 1 - tt
        A = np.array(c)
        D1 = (np.outer(3 * u * u, A[1] - A[0]) + np.outer(6 * u * tt, A[2] - A[1]) + np.outer(3 * tt * tt, A[3] - A[2]))
        D2 = np.outer(6 * u, A[2] - 2 * A[1] + A[0]) + np.outer(6 * tt, A[3] - 2 * A[2] + A[1])
        return (D1[:, 0] * D2[:, 1] - D1[:, 1] * D2[:, 0]) / np.maximum(np.hypot(D1[:, 0], D1[:, 1]) ** 3, 1e-12)

    def sample(c):
        u = 1 - tt
        A = np.array(c)
        return (np.outer(u ** 3, A[0]) + np.outer(3 * u * u * tt, A[1]) + np.outer(3 * u * tt * tt, A[2])
                + np.outer(tt ** 3, A[3]))

    def kbad(a_, b_):
        if a_ * b_ <= 0:
            return 10.0
        return max(0.0, abs(math.log(abs(a_) / abs(b_))) - math.log(kr))

    def score(x):
        cs, hl = build(x)
        if min(hl) < 0.5:
            return 1e9
        Q = np.vstack([sample(c) for c in cs])
        dev = max(cKDTree(Q).query(S)[0].max(), tree.query(Q)[0].max())
        ks = [kof(c) for c in cs]
        bad = 0.0
        if k0 is not None:
            bad += kbad(ks[0][0], k0)
        if k1 is not None and not free_end:
            bad += kbad(ks[-1][-1], k1)
        for k in range(m - 1):
            bad += kbad(ks[k][-1], ks[k + 1][0])
        short = [max(0.0, min_a - h) for h in hl[1:-1]] + ([max(0.0, min_a - hl[0])] if k0 is not None else [])
        bad += sum(short) * 0.05
        for c in cs:                    # handles inside the triangle of the two nodes and their meeting point
            bad += _past(c) * 0.2
        if rising:
            allk = np.concatenate(ks)
            sg = 1 if allk[-1] >= 0 else -1
            k_ = sg * allk
            bad += float(np.clip(-k_, 0, None).sum() + np.clip(k_[:-1] - k_[1:], 0, None).sum()) * 50
        if one_sign:                    # no inflection along the span; a peak is a turn, a valley is a flat place
            allk = np.concatenate(ks)
            sg = 1 if allk.sum() >= 0 else -1
            k_ = sg * allk
            bad += float(np.clip(-k_, 0, None).sum()) * 50
            top = int(np.argmax(k_))
            bad += float(np.clip(k_[:top][:-1] - k_[:top][1:], 0, None).sum() + np.clip(k_[top:][1:] - k_[top:][:-1], 0, None).sum()) * 50
        return dev + 1000 * bad
    best = None
    for start in (x0,):
        for meth in ("Powell", "Nelder-Mead"):
            r = minimize(score, start, method=meth, options={"maxiter": 20000, "xtol": 1e-3, "ftol": 1e-6}
                         if meth == "Powell" else {"maxiter": 20000, "xatol": 1e-3, "fatol": 1e-6})
            if best is None or r.fun < best.fun:
                best = r
            start = best.x
    cs, hl = build(best.x)
    Pn = [list(q) for q in P]
    i = i0
    for c in cs:
        Pn[(i + 1) % n][:2] = c[1]
        Pn[(i + 2) % n][:2] = c[2]
        Pn[(i + 3) % n][:2] = c[3]
        i = (i + 3) % n
    Q = np.vstack([sample(c) for c in cs])
    return [tuple(q) for q in Pn], float(best.fun)


def _curve_faults(P, i0, i1):
    """curvecheck's faults inside the curves of the span: a flat place, an inflection inside a curve."""
    import curvecheck as K
    n = len(P)
    inside = {(i0 + j) % n for j in range((i1 - i0) % n)}
    return sum(c[3] + c[4] for c in K.curves(P, (-3000, 3000)) if c[0] in inside)


def mend(P, i0, i1, max_dev=4.0, strict=True, **kw):
    """The span i0..i1 rebuilt by `chain_fit` (seeded by `refit`), trying the handle floor 12, 10, 8 and the node
    tolerance 1.15, 1.3, on whole units: the result whose nodes read nearest one curvature, then nearest the drawn
    outline, within max_dev of it. Returns (points, largest distance, cost) or (None, ...) when none is that near."""
    import numpy as np
    from scipy.spatial import cKDTree
    n = len(P)
    segs, _ = _span(P, i0, i1)
    S = np.array(_samples(segs))
    inner = [(i0 + j) % n for j in range(1, (i1 - i0) % n) if P[(i0 + j) % n][2]]
    nodes = [i0] + inner + [i1]
    rk = {k: v for k, v in kw.items() if k in ("k0", "k1", "free_end", "at_inflection")}
    seed, _ = refit(P, i0, i1, kr=1.4, rising=kw.get("free_end", False), **rk)
    cands = []
    def extreme(k):
        return any(abs(P[(k + d) % n][1] - P[k][1]) < 0.5 or abs(P[(k + d) % n][0] - P[k][0]) < 0.5 for d in (-1, 1))
    if seed is not None and not any(extreme(k) for k in inner):   # one cubic through an extreme loses the extreme
        for infl in ({False, rk.get("at_inflection", False)}):
            rk_ = dict(rk, at_inflection=infl)
            for kr_ in (1.2, 1.4):
                cands.append(refit_whole(P, i0, i1, kr=kr_, rising=kw.get("free_end", False), **rk_)[0])
    for ma in (12.0, 10.0, 8.0):
        for kr in (1.15, 1.3):
            Pn, sc = chain_fit(P, i0, i1, seed=seed, min_a=ma, kr=kr,
                               **{k: v for k, v in kw.items() if k != "at_inflection"})
            if Pn is not None:
                cands.append(whole_best(Pn, i0, i1))
    best = None
    for W in cands:
            if W is None:
                continue
            s2, _ = _span(W, i0, i1)
            Q = np.array(_samples(s2))
            dev = max(cKDTree(Q).query(S)[0].max(), cKDTree(S).query(Q)[0].max())
            cost = sum(_node_cost(W, k) for k in nodes) + _curve_faults(W, i0, i1) + _span_infl(W, i0, i1)
            if any(math.dist(W[k][:2], P[k][:2]) > NODE_SLIDE for k in nodes[1:-1]):
                continue
            if kw.get("one_sign") and any(inflections(s_) and math.dist(s_[0], s_[3]) >= 30 for s_ in s2):
                continue                # a fillet turns one way only
            if any(_bend(W, k) > 1.0 for k in nodes) or (strict and any(_past(s_) > 0.5 for s_ in s2)):
                continue                # a handle past its triangle, or a smooth node bent off one line                # an inner node keeps its place on the outline (a ray read at it stays put)
            if dev <= max_dev and (best is None or (round(cost, 2), dev) < (round(best[2], 2), best[1])):
                best = (W, float(dev), cost)
    return best or (None, None, None)


# ------------------------------------------------------------------------------------------------ the items
# Each entry: glyph, contour's node at the span's start and end (by place, the drawing's own coordinates), and how the
# span is rebuilt. "ease": one curvature at the start node (the curve before it kept), the end a corner (free
# tangent), one turn (no inflection), the drawn reverse into the corner kept. "merge": one curvature at both ends.
SPANS = {
    # ß (withdrawn in this pass): its spine's inner edge ran nearly straight into a 45-unit curve of radius 78 (jump
    # 17.6, an inflection inside it); one curve from (314, 364) to (449, 225) cleared the jump (the inflection stayed,
    # -2.5 > -2.7), but the stroke read across at the node came to 85.5 / 85.7 where audit_charset caps ß's at 83 + 2.5
    # (it read 84.0): left as drawn; ("germandbls", (314, 364), (449, 225), "merge") is the entry it took
    # ə Ə: the counter's right extreme ran into a fillet of radius 30 / 49 down to the bar (11.0 / 6.7 times)
    # (ə's fillet keeps the drawn reverse into the bar's corner, a curve under 30 units: the triangle and one-turn
    # guards are not applied to it.) Ə's fillet: every curve that clears its jump runs a handle past its triangle or
    # widens the bowl's swell (4.6 > 5.3): left
    "schwa": [((424, 247), (407, 200), "ease", False)],
}


def spans(font, names=None):
    out = []
    for name, items in SPANS.items():
        if names and name not in names:
            continue
        if name not in font:
            continue
        g = font[name]
        cs = _pts(g)
        for item in items:
            A, B, how = item[:3]
            strict = item[3] if len(item) > 3 else True
            for ci, P in enumerate(cs):
                i0, i1 = find_node(P, A), find_node(P, B)
                if i0 is None or i1 is None:
                    continue
                k0 = end_k(P, i0, -1)
                if how == "ease":
                    W, dev, cost = mend(P, i0, i1, k0=k0, free_end=True, one_sign=True, strict=strict)
                else:
                    W, dev, cost = mend(P, i0, i1, k0=k0, k1=end_k(P, i1, 1), at_inflection=True, strict=strict)
                if W is None:
                    out.append(f"{name} {A}: left (no curve within reach)")
                    break
                cs[ci] = W
                out.append(f"{name} {A}-{B}: {how}, {dev:.1f} units, node cost {cost:.2f}")
                break
            else:
                out.append(f"{name} {A}: not found")
        _put(g, cs)
    return out


def auto_span(P, xy):
    """The span about a jump node at xy: from the on-curve node before it to the one after; each end meets the
    curve outside the span at one curvature where it is a smooth node between curves (no flip), else is free."""
    import curvecheck as K
    n = len(P)
    i = find_node(P, xy)
    if i is None:
        return None
    on = _on(P)
    k = on.index(i)
    i0, i1 = on[k - 1], on[(k + 1) % len(on)]
    info = {q[0]: q for q in K.nodes(P, (-3000, 3000))}

    def g2(j, side):
        q = info.get(j)
        if not q or q[7] != "CC" or q[6]:
            return None
        return end_k(P, j, side)
    return i0, i1, g2(i0, -1), g2(i1, 1)


def jump(P, xy, max_dev=4.0):
    sp = auto_span(P, xy)
    if sp is None or _span(P, sp[0], sp[1])[0] is None:
        return None, None, None
    i0, i1, k0, k1 = sp
    return mend(P, i0, i1, max_dev=max_dev, k0=k0, k1=k1)


def _glyph_faults(cs):
    """curvecheck's reading of a whole glyph: (curvature jumps over 1.8 at smooth nodes between curves, curves with a
    flat place or an inflection inside)."""
    import curvecheck as K
    j = c = 0
    for P in cs:
        j += sum(1 for _i, _xy, _g, _a, _b, r, fl, k in K.nodes(P, (-3000, 3000)) if k == "CC" and r and r > 1.8 and not fl)
        c += sum(c_[3] + c_[4] for c_ in K.curves(P, (-3000, 3000)))
    return j, c


# A smooth node where the curvature jumps (the stroke audit's list, snap084k), each by its place: the span from the
# node before to the node after rebuilt by `jump` (one curvature at both ends where the curve outside is kept), kept
# only where the node then reads under 1.8, no other jump or flat place appears in the glyph, and the outline stays
# within 4 units.
JUMPS = {
    "a": [(222, 46)], "ae": [(222, 46)], "astroke": [(222, 46)],                                   # item 5
    "ordfeminine": [(111, 406)], "Saltillo": [(125, 643)],                                         # item 13
    "acute.case": [(249, 850)], "acutecomb.case": [(249, 850)],                                    # item 14
    "hungarumlaut.case": [(241, 850), (408, 850)], "hungarumlautcomb.case": [(241, 850), (408, 850)],
    "dblgravecomb.case": [(187, 850), (20, 850)],
    # ﬆ (383, 491), s_p (70, 395), ɗ (549, 45), ɲ (111, 446): rebuilt clean but left a handle past its triangle, a
    # node off its extreme or (s_p) a turned handle at a retracted node: left
    "s_p": [(391, 687)],                                                                           # item 16
    "dhook": [(698, 688)], "nhookleft": [(212, 384)],                                              # item 12
    # Ɫ's (89, 467) and Ɽ's (371, -139) built clean but put a flat place (Ɫ) and a 5.6 width dip (Ɽ) beside them: left
    "Lmiddletilde": [(305, 351), (64, 395), (323, 425)],
    "Tretroflexhook": [(557, -139), (223, 666)], "ghook": [(197, -144), (317, -186)],
    "hturned": [(462, 144)], "Thook": [(555, 666)], "hhook": [(386, 688)], "phook": [(393, 687)], "Ghook": [(614, 167)],
    "eopen": [(366, 288), (150, 167)],                                                             # item 10
    "Eopen": [(368, 349), (379, 46), (221, 539), (382, 668)],
}


def jumps(font, names=None):
    out = []
    for name, places in JUMPS.items():
        if (names and name not in names) or name not in font or not font[name].contours:
            continue
        g = font[name]
        cs = _pts(g)
        for xy in places:
            ci = next((k for k, P in enumerate(cs) if find_node(P, xy) is not None), None)
            if ci is None:
                out.append(f"{name} {xy}: not found")
                continue
            j0, c0 = _glyph_faults(cs)
            W, dev, cost = jump(cs[ci], xy)
            if W is None:
                out.append(f"{name} {xy}: left (no curve within 4 units)")
                continue
            trial = list(cs)
            trial[ci] = W
            j1, c1 = _glyph_faults(trial)
            i = find_node(W, xy, snap=40)
            import curvecheck as K
            r = next((q[5] for q in K.nodes(W, (-3000, 3000)) if q[0] == i), None)
            if j1 < j0 and c1 <= c0:
                cs = trial
                out.append(f"{name} {xy}: jumps {j0} > {j1}, {dev:.1f} units")
            else:
                out.append(f"{name} {xy}: left (jumps {j0} > {j1}, flat places {c0} > {c1}, node {r})")
        _put(g, cs)
    return out


# ------------------------------------------------------------------------------------------------ width along a curve
def _poly(cs, per=60):
    """Every contour as a closed polyline of samples: [(contour, numpy array)]."""
    import numpy as np
    out = []
    for P in cs:
        n = len(P)
        on = _on(P)
        pts = []
        for k, i in enumerate(on):
            j = on[(k + 1) % len(on)]
            if (j - i) % n == 3 and P[(i + 1) % n][2] is None:
                c = (P[i][:2], P[(i + 1) % n][:2], P[(i + 2) % n][:2], P[j][:2])
                pts += [_bez(c, t / per) for t in range(per)]
            else:
                a, b = P[i][:2], P[j][:2]
                m = max(1, int(math.dist(a, b) / 2))
                pts += [(a[0] + (b[0] - a[0]) * t / m, a[1] + (b[1] - a[1]) * t / m) for t in range(m)]
        out.append(np.array(pts, float))
    return out


def _inside(polys, pt):
    """Even-odd: is pt inside the ink."""
    x, y = pt
    k = 0
    for A in polys:
        B = A[list(range(1, len(A))) + [0]]
        c = ((A[:, 1] > y) != (B[:, 1] > y))
        xs = A[c, 0] + (y - A[c, 1]) * (B[c, 0] - A[c, 0]) / (B[c, 1] - A[c, 1])
        k += int((xs > x).sum())
    return k % 2 == 1


def width_along(cs, ci, i0, i1, step=4.0):
    """The stroke's width read along the curves of contour ci from node i0 to i1: at each place on that edge the
    diameter of the largest circle inside the ink touching the edge there (the nearest other edge point on the
    inward normal side, found by bisection on the circle's radius). [(x, y, width)]."""
    import numpy as np
    from scipy.spatial import cKDTree
    polys = _poly(cs)
    allp = np.vstack(polys)
    tree = cKDTree(allp)
    segs, _ = _span(cs[ci], i0, i1)
    out = []
    for s in segs:
        L = sum(math.dist(_bez(s, k / 20), _bez(s, (k + 1) / 20)) for k in range(20))
        m = max(2, int(L / step))
        for k in range(m):
            t = k / m
            p = _bez(s, t)
            q = _bez(s, min(1, t + 1e-3)) if t < 1 - 1e-3 else _bez(s, t - 1e-3)
            d = (q[0] - p[0], q[1] - p[1]) if t < 1 - 1e-3 else (p[0] - q[0], p[1] - q[1])
            L_ = math.hypot(*d)
            nrm = (-d[1] / L_, d[0] / L_)
            if not _inside(polys, (p[0] + nrm[0] * 2, p[1] + nrm[1] * 2)):   # the ink's side of the edge
                nrm = (-nrm[0], -nrm[1])
            lo, hi = 0.5, 200.0
            for _ in range(25):
                r = (lo + hi) / 2
                c = (p[0] + nrm[0] * r, p[1] + nrm[1] * r)
                dd, _i = tree.query(c)
                if dd < r - 0.5:
                    hi = r
                else:
                    lo = r
            out.append((p[0], p[1], 2 * lo))
    return out


def bumps(ws, tol=1.0):
    """The largest rise-and-fall (or fall-and-rise) of a width sequence: how far it steps back."""
    w = [q[2] for q in ws]
    worst = 0.0
    for k in range(1, len(w) - 1):
        worst = max(worst, min(max(w[:k + 1]) - w[k], max(w[k:]) - w[k]),     # a dip
                    min(w[k] - min(w[:k + 1]), w[k] - min(w[k:])))           # a bump
    return worst


def _curve_spans(P):
    n = len(P)
    on = _on(P)
    return [(i, on[(k + 1) % len(on)]) for k, i in enumerate(on)
            if (on[(k + 1) % len(on)] - i) % n == 3 and P[(i + 1) % n][2] is None]


def _nearest_curve(cs, xy, skip=None):
    best = None
    for ci, P in enumerate(cs):
        for i0, i1 in _curve_spans(P):
            if skip and (ci, i0) == skip:
                continue
            c = tuple(P[(i0 + d) % len(P)][:2] for d in range(4))
            dmin = min(math.dist(_bez(c, t / 40), xy) for t in range(41))
            if best is None or dmin < best[0]:
                best = (dmin, ci, i0, i1)
    return best


def _grow(P, i0, i1):
    """The span one node further each way where the neighbours are curves."""
    sp = _curve_spans(P)
    starts = {a: b for a, b in sp}
    ends = {b: a for a, b in sp}
    return ends.get(i0, i0), starts.get(i1, i1)


def swell(cs, xy, tol=1.0, max_move=6.0):
    """A width bump or dip at xy (a stroke that swells and thins again away from a node): the curves of the two
    edges there (and their neighbours) read along each edge; one handle, the least change along its own line, until
    neither edge steps back by more than tol and no curvature jump or flat place appears. Returns (new contours, the
    handle moved and its share, before and after) or None."""
    import curvecheck as K  # noqa
    a = _nearest_curve(cs, xy)
    if a is None:
        return None
    _d, ci, i0, i1 = a
    # the facing edge: the nearest curve on the other side of the stroke from xy
    P = cs[ci]
    c = tuple(P[(i0 + d) % len(P)][:2] for d in range(4))
    t = min(range(41), key=lambda k: math.dist(_bez(c, k / 40), xy)) / 40
    p = _bez(c, t)
    q = _bez(c, min(1, t + 0.01)) if t < 0.99 else _bez(c, t - 0.01)
    spans_ = [(ci, i0, i1)]
    for sgn in (1, -1):
        dv = (q[0] - p[0], q[1] - p[1])
        L = math.hypot(*dv)
        nrm = (-dv[1] / L * sgn, dv[0] / L * sgn)
        probe = (p[0] + nrm[0] * 60, p[1] + nrm[1] * 60)
        b = _nearest_curve(cs, probe, skip=(ci, i0))
        if b and b[0] < 50:
            spans_.append((b[1], b[2], b[3]))
    spans_ = list(dict.fromkeys(spans_))

    def reading(cs_):
        """How far the width steps back along each curve away from its nodes: a rise and fall (or fall and rise)
        inside the curve, 12 units from each end left out."""
        out = 0.0
        for cj, j0, j1 in spans_:
            ws = width_along(cs_, cj, j0, j1)
            if len(ws) < 8:
                continue
            out = max(out, bumps(ws[3:-3]))
        return out
    r0 = reading(cs)
    g0 = _glyph_faults(cs)
    if r0 <= tol:
        return None
    handles = []
    for cj, j0, j1 in spans_:
        Pj = cs[cj]
        n = len(Pj)
        k = j0
        while k != j1:
            handles += [(cj, (k + 1) % n, k), (cj, (k + 2) % n, (k + 3) % n)]
            k = (k + 3) % n
    for step in [s / 100 for s in range(2, 36, 2)]:
        best = None
        for cj, h, nd in handles:
            for s in (1 + step, 1 - step):
                Pj = list(cs[cj])
                hx = Pj[nd][0] + (Pj[h][0] - Pj[nd][0]) * s
                hy = Pj[nd][1] + (Pj[h][1] - Pj[nd][1]) * s
                if math.dist((hx, hy), Pj[h][:2]) > 3 * max_move:
                    continue
                Pj[h] = (round(hx), round(hy), None, False)
                trial = list(cs)
                trial[cj] = Pj
                r1 = reading(trial)
                if r1 <= tol:
                    g1 = _glyph_faults(trial)
                    if g1[0] <= g0[0] and g1[1] <= g0[1] and (best is None or r1 < best[0]):
                        best = (r1, trial, (cj, h, s))
        if best:
            return best[1], best[2], r0, best[0]
    return None


# A width bump or dip away from a node (the stroke audit's list, snap084k), by its place
SWELLS = {
    "n": [(455, 413)], "h": [(451, 413)], "hbar": [(451, 413)], "hcedilla": [(451, 413)],      # item 7
    "f_h": [(841, 413)], "f_f_h": [(1215, 413)], "m": [(801, 412)], "u": [(118, 69)],
}


def swells(font, names=None):
    out = []
    for name, places in SWELLS.items():
        if (names and name not in names) or name not in font or not font[name].contours:
            continue
        g = font[name]
        cs = _pts(g)
        for xy in places:
            r = swell(cs, xy)
            if r is None:
                out.append(f"{name} {xy}: left")
                continue
            cs, (cj, h, s), r0, r1 = r
            out.append(f"{name} {xy}: steps back {r0:.1f} > {r1:.1f} (handle {h} x{s:.2f})")
        _put(g, cs)
    return out


# ------------------------------------------------------------------------------------------------ hooked stems (item 9)
# ɦ ƥ ɽ ɗ ɠ: a stem whose one edge leans 2 units (ɦ 111 to 113 over its length) or runs 2 units into the counter
# (ɗ ɠ: the counter's straight at 461, the stem's other edge at 542) reads 80 / 81 where n's is 78. The edge (its two
# nodes and the handles that run on along it) is made upright at the class stem from the edge kept: the counter
# side of ɦ ƥ ɽ (straight, upright) and, on ɗ ɠ, the stem's right edge (542; moving it put a width bump into ɠ's hook).
#   glyph: [(a point on the edge to move, the x it takes as an offset from the kept edge's x, kept edge x)]
STEM_EDGES = {
    "hhook": [((111, 540), +1, 191)], "phook": [((118, 540), +1, 198)], "rtail": [((125, 380), +1, 205)],
    "dhook": [((461, 303), +1, 542)], "ghook": [((461, 303), +1, 542)],
}


def stem_edges(font):
    import ladder as LD
    out = []
    for name, items in STEM_EDGES.items():
        if name not in font:
            continue
        g = font[name]
        for (x, y), side, kept in items:
            new = kept if side is None else (kept - LD.STEM if side > 0 else kept + LD.STEM)
            moved = 0
            for c in g.contours:
                P = c.points
                n = len(P)
                hit = [i for i, p in enumerate(P) if p.type and p.x == x and (abs(p.y - y) < 1 or (
                    P[(i + 1) % n].type == "line" and P[(i + 1) % n].x == x
                    and min(p.y, P[(i + 1) % n].y) <= y <= max(p.y, P[(i + 1) % n].y)))]
                if not hit:
                    continue
                i = hit[0]
                # the edge: the run of points on its line (within 2 units of x), its handles included
                idx = {i}
                for d in (-1, 1):
                    j = (i + d) % n
                    while abs(P[j].x - x) <= 2 and len(idx) < 6:
                        idx.add(j)
                        j = (j + d) % n
                for j in idx:
                    P[j].x = new
                moved = len(idx)
                break
            out.append(f"{name} edge {x} > {new} ({moved} points)")
    return out


# ------------------------------------------------------------------------------------------------ Ɲ's diagonal (item 11)
# Ɲ's thick diagonal reads 99.8 where N's is the capital stem, 86. hair.diagonals moved both edges about the middle
# (pass 6, withdrawn: the Bold's hook took a curvature fault). Here only the diagonal's upper edge moves, parallel to
# itself, its ends sliding on the lines they end on (the notch onto the right stem up the stem, the cap line), so the left stem, its
# vertex and the hook below keep every point.
def n_hook_diagonal(font, name="Nhookleft"):
    import ladder as LD
    if name not in font:
        return "none"
    P = font[name].contours[0].points
    n = len(P)
    lines = [(i, (i + 1) % n) for i in range(n) if P[i].type and P[(i + 1) % n].type == "line"
             and abs(P[i].x - P[(i + 1) % n].x) > 150 and abs(P[i].y - P[(i + 1) % n].y) > 150]
    if len(lines) != 2:
        return f"{name}: diagonal not found ({len(lines)})"
    (a0, a1), (b0, b1) = sorted(lines, key=lambda L: -max(P[L[0]].y, P[L[1]].y) - min(P[L[0]].x, P[L[1]].x))[::-1]
    # the edge whose top lies on the cap line moves (the upper / inner edge); the other stays

    def xy(i):
        return (P[i].x, P[i].y)
    up = (a0, a1) if max(P[a0].y, P[a1].y) >= max(P[b0].y, P[b1].y) and min(P[a0].x, P[a1].x) > 220 else (b0, b1)
    lo = (b0, b1) if up == (a0, a1) else (a0, a1)
    p, q = xy(lo[0]), xy(lo[1])
    d = (q[0] - p[0], q[1] - p[1])
    L = math.hypot(*d)
    nrm = (-d[1] / L, d[0] / L)

    def across(pt):
        return (pt[0] - p[0]) * nrm[0] + (pt[1] - p[1]) * nrm[1]
    w0 = abs(across(xy(up[0])))
    shift = (w0 - LD.CAP_STEM) * (1 if across(xy(up[0])) > 0 else -1)
    for i in up:
        prev_, next_ = (i - 1) % n, (i + 1) % n
        other = next_ if next_ not in up else prev_          # the line this end ends on
        u = (P[other].x - P[i].x, P[other].y - P[i].y)
        step = abs(u[1]) < 1 and abs(u[0]) < 20               # a short level step onto the stem (the notch): the
        if step:                                              # end and the step slide up the stem together
            u = (0.0, 1.0)
        # move along u until the point's distance to the kept edge falls by shift
        k = -shift / ((u[0] * nrm[0] + u[1] * nrm[1]) or 1e-9)
        P[i].x, P[i].y = round(P[i].x + k * u[0]), round(P[i].y + k * u[1])
        if step:
            P[other].y = P[i].y
    w1 = abs(across(xy(up[0])))
    return f"{name}: diagonal {w0:.1f} > {w1:.1f} (upper edge {xy(up[0])}-{xy(up[1])})"


def smooth_curve(P, i0, max_change=0.35):
    """One cubic (from on-curve i0) with a flat place or an inflection inside it (curvecheck): its two handle lengths,
    least change, until it has neither and its end nodes read no worse than before (or under 1.25)."""
    import curvecheck as K
    n = len(P)
    i1 = (i0 + 3) % n

    def faults(Q):
        c = [x for x in K.curves(Q, (-3000, 3000)) if x[0] == i0]
        return (c[0][3] + c[0][4]) if c else 0

    def ratio(Q, i):
        r = [x[5] for x in K.nodes(Q, (-3000, 3000)) if x[0] == i and x[7] == "CC" and not x[6]]
        return r[0] if r and r[0] else 1.0
    if not faults(P):
        return None
    r0 = {i: max(1.25, ratio(P, i)) for i in (i0, i1)}
    best = None
    steps = [k / 100 for k in range(-int(max_change * 100), int(max_change * 100) + 1, 2)]
    for s1 in steps:
        for s2 in steps:
            Q = list(P)
            for h, nd, s in (((i0 + 1) % n, i0, s1), ((i0 + 2) % n, i1, s2)):
                Q[h] = (round(P[nd][0] + (P[h][0] - P[nd][0]) * (1 + s)), round(P[nd][1] + (P[h][1] - P[nd][1]) * (1 + s)),
                        None, False)
            if faults(Q) or any(ratio(Q, i) > r0[i] + 1e-6 for i in (i0, i1)):
                continue
            c = abs(s1) + abs(s2)
            if best is None or c < best[0]:
                best = (c, Q, s1, s2)
    return best


# ------------------------------------------------------------------------------------------------ r's branch (item 4)
# r's arm leaves the stem with a neck of 28.1 where n m h have 30.5 (the stroke audit's reading), its crotch curve
# (crotch to the underside's level top) tight at both ends and flat between (a wave, 0.69), and the curve from that top
# down to the ball's neck turns the other way 3 units before its node (an inflection inside a curve). The rule: the
# outer curve's node on the stem rises (its handle with it, so the branch leaves the stem as before) and the crotch curve's two handles take new lengths along
# their own lines, the least change that brings the neck (nearest approach of the two curves) to n's, read the same
# way on n, with no flat place in the crotch curve (its curvature never falls and rises again by 15% of its largest);
# then the curve
# into the ball by `smooth_curve`.
def _neck(P, a, b):
    import numpy as np
    from scipy.spatial import cKDTree
    A = np.array([_bez(tuple(P[(a + d) % len(P)][:2] for d in range(4)), t / 300) for t in range(301)])
    B = np.array([_bez(tuple(P[(b + d) % len(P)][:2] for d in range(4)), t / 300) for t in range(301)])
    return float(cKDTree(B).query(A)[0].min())


def _branch(P, stem_x):
    """(crotch node, outer node on the stem, outer curve's start) of an arch leaving the stem's right edge at stem_x:
    the crotch the corner on the stem with a curve rising from it, the outer node the curve's end on the stem above."""
    n = len(P)
    crotch = next(i for i, q in enumerate(P) if q[2] == "line" and q[0] == stem_x and P[(i + 1) % n][2] is None
                  and P[(i + 3) % n][1] > q[1])
    outer = next(i for i, q in enumerate(P) if q[2] == "curve" and q[0] == stem_x and q[1] > P[crotch][1]
                 and P[(i - 1) % n][2] is None)
    return crotch, outer, (outer - 3) % n


def _wave(ak):
    """How far |k| along a curve falls and rises again, as a share of its largest (the stroke audit's wave)."""
    run, best = ak[0], 0.0
    for j in range(1, len(ak)):
        run = max(run, ak[j - 1])
        best = max(best, min(run - ak[j], max(ak[j:]) - ak[j]))
    return best / max(max(ak), 1e-12)


def r_branch(font, names=("r", "rstroke")):
    import curvecheck as K
    out = []
    nP = _pts(font["n"])[0]
    nc, no, ns = _branch(nP, 189)
    want = _neck(nP, nc, ns)
    for name in names:
        if name not in font:
            continue
        g = font[name]
        cs = _pts(g)
        P = cs[0]
        try:
            c, o, s = _branch(P, 189)
        except StopIteration:
            out.append(f"{name}: no branch")
            continue
        n = len(P)
        h1, h2, top = (c + 1) % n, (c + 2) % n, (c + 3) % n
        L1, L2 = math.dist(P[c][:2], P[h1][:2]), math.dist(P[top][:2], P[h2][:2])
        u1 = _unit((P[h1][0] - P[c][0], P[h1][1] - P[c][1]))
        u2 = _unit((P[h2][0] - P[top][0], P[h2][1] - P[top][1]))
        neck0 = _neck(P, c, s)

        def top_ratio(Q):                  # the arm's top (where the outer curve starts): no worse than drawn
            return next((x[5] for x in K.nodes(Q, (-3000, 3000)) if x[0] == s and x[5]), 1.0)
        r_top = top_ratio(P)
        best = None
        ht = (s + 1) % n                         # the outer curve's handle at the arm's top
        Lt = math.dist(P[s][:2], P[ht][:2])
        ut = _unit((P[ht][0] - P[s][0], P[ht][1] - P[s][1]))
        for dy in range(0, 9):
          for e in range(int(Lt) - 16, int(Lt) + 1, 4):
            for a in range(int(L1), int(L1) + 40, 3):
                for b in range(int(L2) - 20, int(L2) + 6, 2):
                    Q = list(P)
                    Q[ht] = (round(P[s][0] + ut[0] * e), round(P[s][1] + ut[1] * e), None, False)
                    Q[o] = (P[o][0], P[o][1] + dy, P[o][2], P[o][3])
                    ho = (o - 1) % n                 # its handle with it: the branch leaves by (53, 64) (parts.check)
                    Q[ho] = (P[ho][0], P[ho][1] + dy, None, False)
                    Q[h1] = (round(P[c][0] + u1[0] * a), round(P[c][1] + u1[1] * a), None, False)
                    Q[h2] = (round(P[top][0] + u2[0] * b), round(P[top][1] + u2[1] * b), None, False)
                    if _neck(Q, c, s) < want - 0.5 or top_ratio(Q) > r_top + 1e-6:
                        continue
                    seg = ("C", tuple(Q[(c + d) % n][:2] for d in range(4)))
                    if _wave([abs(K.curvature(seg, 0.02 + 0.96 * t / 60)) for t in range(61)]) > 0.15:
                        continue
                    cost = dy + abs(a - L1) / 10 + abs(b - L2) / 10 + abs(e - Lt) / 5
                    if best is None or cost < best[0]:
                        best = (cost, Q, dy, a, b)
        if best is None:
            out.append(f"{name}: left (neck {neck0:.1f}, n's {want:.1f})")
            continue
        Q = best[1]
        sm = smooth_curve(Q, top)
        if sm:
            Q = sm[1]
        cs[0] = Q
        _put(g, cs)
        out.append(f"{name}: neck {neck0:.1f} > {_neck(Q, c, s):.1f} (n's {want:.1f}); branch node +{best[2]}, "
                   f"crotch handles {L1:.0f}/{L2:.0f} > {best[3]}/{best[4]}{'; curve into the ball evened' if sm else ''}")
    return out

