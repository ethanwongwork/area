"""Area Serif 0.81: what holds between two masters at EVERY weight between them, not at 25-unit stops.

Each point of an instance moves on a straight line between two adjacent masters, so every quantity below is a
polynomial in the share t of the way between them, and each test is the polynomial's sign over the whole of
[0, 1] (the weight research's addendum, section 1; derivations there):

  turns     a cubic's x and y derivatives (quadratics in u, linear in t) and its curvature sign Q(u, t) = d0 x d1 (1-u)^2
            + d0 x d2 u(1-u) + d1 x d2 u^2 (biquadratic). If all of a curve's Bernstein coefficients over (u, t) share
            a sign, no instance has an extreme or inflection there (a proof, no sampling); otherwise the sign changes
            in u are counted on a 129 x 65 grid and compared with the Regular's own count.
  crossings within one contour: the instant a vertex of the flattened outline touches an edge is a root of a
            quadratic in t (each flattened vertex is a fixed blend of control points, so it moves linearly); at each
            such instant the contour's edge-pair crossings are counted again. More than the Regular's is a fault.
            Between contours: overlapping ink is allowed (struck letters overlap on purpose), so what is checked is
            the union's topology (outer contours and holes after pathops) at the stops, which a collision changes.
  counters  a contour's signed area is (1-t)^2 A0 + 2t(1-t) M + t^2 A1: if it reaches zero a counter has closed or
            a contour has turned inside out.
  drift     nodes on one straight line in both masters (a stroke's edge cut by a letter, a welded corner) stay on
            it half way within 0.5 units more than the masters' own rounding.
"""
import math

import numpy as np
import pathops

import bold as B

GRID_T = 65
GRID_U = 129


class _Q:
    def __init__(s, q):
        s.type = q[2]


def cubic_index(contours):
    out = []
    for ci, P in enumerate(contours):
        for i, mid, j in B.segments([_Q(q) for q in P]):
            if len(mid) == 2:
                out.append((ci, i, mid[0], mid[1], j))
    return out


def _arr(contours, idx):
    return np.array([[contours[c][k][:2] for k in (i, a, b, j)] for c, i, a, b, j in idx], dtype=float)


def _sig_changes(vals, eps):
    """vals (..., U): sign changes along the last axis, a value under eps counting as no sign."""
    s = np.sign(np.where(np.abs(vals) < eps[..., None], 0, vals))
    out = np.zeros(vals.shape[:-1], dtype=int)
    for idx in np.ndindex(vals.shape[:-1]):
        r = s[idx]
        r = r[r != 0]
        out[idx] = int(np.sum(r[1:] != r[:-1])) if len(r) > 1 else 0
    return out


def _counts(C):
    """C (S, N, 4, 2) cubics: (x extremes, y extremes, inflections) per cubic, (S, N, 3)."""
    d = np.diff(C, axis=2)                                     # (S, N, 3, 2)
    u = np.linspace(0, 1, GRID_U)[1:-1]
    b0, b1, b2 = (1 - u) ** 2, 2 * u * (1 - u), u ** 2
    scale = np.abs(d).max(axis=(2, 3)) + 1e-9                  # (S, N)
    res = []
    for ax in (0, 1):
        q = d[..., 0, ax, None] * b0 + d[..., 1, ax, None] * b1 + d[..., 2, ax, None] * b2
        res.append(_sig_changes(q, 0.01 * scale))
    cr = lambda a, b: a[..., 0] * b[..., 1] - a[..., 1] * b[..., 0]   # noqa: E731
    c1, c3, c2 = cr(d[..., 0, :], d[..., 1, :]), cr(d[..., 0, :], d[..., 2, :]), cr(d[..., 1, :], d[..., 2, :])
    Qv = c1[..., None] * b0 + (c3 / 2)[..., None] * b1 + c2[..., None] * b2
    res.append(_sig_changes(Qv, 0.004 * scale ** 2))
    return np.stack(res, axis=-1)


def _bern_same_sign(CA, CB):
    """Per cubic: True when every Bernstein coefficient over (u, t) of x', y' and Q keeps one sign (a proof that
    no instance has an extreme or inflection inside the curve)."""
    dA, dB = np.diff(CA, axis=1), np.diff(CB, axis=1)          # (N, 3, 2)
    ok = np.ones(len(CA), dtype=bool)
    for ax in (0, 1):
        co = np.concatenate([dA[..., ax], dB[..., ax]], axis=1)
        ok &= (co > 0).all(axis=1) | (co < 0).all(axis=1)
    cr = lambda a, b: a[..., 0] * b[..., 1] - a[..., 1] * b[..., 0]   # noqa: E731
    coefs = []
    for (p, q) in ((0, 1), (0, 2), (1, 2)):
        AA, BB = cr(dA[:, p], dA[:, q]), cr(dB[:, p], dB[:, q])
        AB = (cr(dA[:, p], dB[:, q]) + cr(dB[:, p], dA[:, q])) / 2
        coefs += [AA, AB, BB]
    co = np.stack(coefs, axis=1)
    ok_q = (co > 0).all(axis=1) | (co < 0).all(axis=1)
    return ok, ok_q


def turns(R, A, Bm, small_max=12, fillet_max=20):
    """R: the Regular's contours; A, Bm: the pair's two masters (same structure). Returns [(cubic k, share t,
    'extremes and inflections (base) > (got)' or a fillet note)] for the first t each failing cubic fails at."""
    idx = cubic_index(R)
    if not idx:
        return []
    CR, CA, CB = _arr(R, idx), _arr(A, idx), _arr(Bm, idx)
    base = _counts(CR[None])[0]
    small = np.abs(CR[:, 3] - CR[:, 0]).max(axis=1) < small_max
    ok_x, ok_q = _bern_same_sign(CA, CB)
    proved = ok_x & ok_q & (base.sum(axis=1) == 0)
    todo = [k for k in range(len(idx)) if not proved[k] or small[k]]
    if not todo:
        return []
    ts = np.linspace(0, 1, GRID_T)
    C = CA[None, todo] + ts[:, None, None, None] * (CB - CA)[None, todo]
    got = _counts(C)                                           # (T, n, 3)
    out = []
    for n, k in enumerate(todo):
        if small[k]:
            span = np.abs(C[:, n, 3] - C[:, n, 0]).max(axis=1)
            bad = np.where(span > fillet_max)[0]
            if len(bad):
                out.append((k, float(ts[bad[0]]), f"a corner's fillet grew to {span[bad[0]]:.0f}"))
            continue
        over = (got[:, n] > base[k]).any(axis=1)
        if over.any():
            f = int(np.where(over)[0][0])
            out.append((k, float(ts[f]), f"extremes and inflections {tuple(int(x) for x in base[k])} > {tuple(int(x) for x in got[f, n])}"))
    return out


def flat(contours, n=8):
    """Flattened contours at fixed curve parameters: (points (V, 2) per contour). A flattened vertex is a fixed blend
    of control points, so between two masters it moves on a straight line."""
    out = []
    for P in contours:
        pts = []
        for i, mid, j in B.segments([_Q(q) for q in P]):
            if len(mid) == 2:
                c = [P[i][:2], P[mid[0]][:2], P[mid[1]][:2], P[j][:2]]
                pts += [B._bez(c, k / n) for k in range(n)]
            else:
                pts.append(P[i][:2])
        out.append(np.array(pts, dtype=float))
    return out


def _proper(P):
    """Edge pairs of one closed polyline that cross properly (not at shared ends): their count."""
    a, b = P, np.roll(P, -1, axis=0)
    ax, ay, bx, by = a[:, 0][:, None], a[:, 1][:, None], b[:, 0][:, None], b[:, 1][:, None]
    cx, cy, dx, dy = a[:, 0][None], a[:, 1][None], b[:, 0][None], b[:, 1][None]
    o = lambda px, py, qx, qy, rx, ry: (qx - px) * (ry - py) - (qy - py) * (rx - px)   # noqa: E731
    hit = (o(ax, ay, bx, by, cx, cy) * o(ax, ay, bx, by, dx, dy) < -1e-6) & (o(cx, cy, dx, dy, ax, ay) * o(cx, cy, dx, dy, bx, by) < -1e-6)
    return int(np.triu(hit, 1).sum())


def contact_times(PA, PB):
    """Every t in (0, 1] at which a vertex of the moving closed polyline touches one of its own edges (not its own)."""
    n = len(PA)
    if n < 4:
        return []
    D = PB - PA
    i = np.arange(n)
    a0, a1 = PA[i], D[i]
    b0, b1 = PA[(i + 1) % n], D[(i + 1) % n]
    # vertex k against edge e: f(t) = (b - a) x (c - a), each linear in t
    k = np.arange(n)
    c0, c1 = PA[k][:, None, :], D[k][:, None, :]
    e0, e1 = (b0 - a0)[None], (b1 - a1)[None]
    g0, g1 = c0 - a0[None], c1 - a1[None]
    cr = lambda u, v: u[..., 0] * v[..., 1] - u[..., 1] * v[..., 0]   # noqa: E731
    A2 = cr(e1, g1)
    A1 = cr(e0, g1) + cr(e1, g0)
    A0 = cr(e0, g0)
    times = set()
    disc = A1 * A1 - 4 * A2 * A0
    with np.errstate(divide="ignore", invalid="ignore"):
        lin = np.abs(A2) < 1e-9
        r_lin = np.where(lin & (np.abs(A1) > 1e-9), -A0 / A1, np.nan)
        sq = np.sqrt(np.where(disc >= 0, disc, np.nan))
        r1 = np.where(~lin, (-A1 - sq) / (2 * A2), np.nan)
        r2 = np.where(~lin, (-A1 + sq) / (2 * A2), np.nan)
    own = (k[:, None] == i[None]) | (k[:, None] == ((i + 1) % n)[None])
    for r in (r_lin, r1, r2):
        m = (r > 1e-6) & (r <= 1) & ~own
        for kk, ee in zip(*np.where(m)):
            t = float(r[kk, ee])
            a = a0[ee] + t * a1[ee]
            b = b0[ee] + t * b1[ee]
            c = PA[kk] + t * D[kk]
            L2 = float(np.dot(b - a, b - a))
            if L2 < 1e-9:
                continue
            s = float(np.dot(c - a, b - a)) / L2
            if -1e-6 <= s <= 1 + 1e-6:
                times.add(round(t, 6))
    return sorted(times)


def crossings(R, A, Bm):
    """Within each contour: [(contour, share t, base, got)] where the moving outline crosses itself more than the
    Regular does, found at the exact instants it first touches itself."""
    out = []
    FR, FA, FB = flat(R), flat(A), flat(Bm)
    for ci, (PR, PA, PB) in enumerate(zip(FR, FA, FB)):
        if len(PA) != len(PB) or len(PA) < 4:
            continue
        base = _proper(PR)
        ts = contact_times(PA, PB)
        for t in [x + 1e-4 for x in ts if x + 1e-4 <= 1] + [1.0]:
            got = _proper(PA + t * (PB - PA))
            if got > base:
                out.append((ci, t, base, got))
                break
    return out


SCRAP = 150     # charset.SCRAP: white under this many square units, closed between two outlines, is not a counter


def topology(polys):
    """(outer contours, holes) of the union of closed polylines, non-zero winding. A hole under SCRAP square units
    (a pocket where a stroke crosses close by a letter's corner: the static merge fills it) is not counted."""
    p = pathops.Path()
    pen = p.getPen()
    for P in polys:
        if len(P) < 3:
            continue
        pen.moveTo(tuple(P[0]))
        for q in P[1:]:
            pen.lineTo(tuple(q))
        pen.closePath()
    p = pathops.op(p, pathops.Path(), pathops.PathOp.UNION, fix_winding=True, keep_starting_points=False, clockwise=False)
    outer = holes = 0
    for c in p.contours:
        pts = [q for verb, pts_ in c.segments for q in pts_ if verb != "closePath"]
        if len(pts) < 3:
            continue
        a = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
        if a > 0:
            outer += 1
        elif a < -2 * SCRAP:
            holes += 1
    return outer, holes


def counters(R, A, Bm):
    """[(contour, share t)] where a contour's signed area reaches zero between the two masters."""
    out = []
    for ci, (PA, PB) in enumerate(zip(flat(A), flat(Bm))):
        if len(PA) != len(PB) or len(PA) < 3:
            continue
        cr = lambda P, Q_: float(np.sum(P[:, 0] * np.roll(Q_, -1, axis=0)[:, 1] - np.roll(Q_, -1, axis=0)[:, 0] * P[:, 1]))   # noqa: E731
        A0, A1 = cr(PA, PA) / 2, cr(PB, PB) / 2
        M = (cr(PA, PB) + cr(PB, PA)) / 4
        if (A0 > 0 and M > 0 and A1 > 0) or (A0 < 0 and M < 0 and A1 < 0):
            continue
        ts = np.linspace(0, 1, 201)
        At = (1 - ts) ** 2 * A0 + 2 * ts * (1 - ts) * M + ts ** 2 * A1
        if A0 != 0 and (np.sign(At) != np.sign(A0)).any():
            out.append((ci, float(ts[np.argmax(np.sign(At) != np.sign(A0))])))
    return out


def drift(R, A, Bm, tol=0.5, min_len=20):
    """[(contour, node, deviation half way, masters' own)] for nodes that sit on one straight line (through a
    straight segment at least min_len long) in the Regular and in both masters and leave it half way."""
    out = []
    for ci, (PR, PA, PB) in enumerate(zip(R, A, Bm)):
        n = len(PR)
        on = [k for k in range(n) if PR[k][2] is not None]
        lines = []
        for a, b in zip(on, on[1:] + on[:1]):
            if PR[b][2] == "line" and math.dist(PR[a][:2], PR[b][:2]) >= min_len:
                lines.append((a, b))
        seen = set()
        for a, b in lines:
            def off(P, k):
                (x0, y0), (x1, y1), (x, y) = P[a][:2], P[b][:2], P[k][:2]
                L = math.hypot(x1 - x0, y1 - y0)
                return abs((x1 - x0) * (y - y0) - (y1 - y0) * (x - x0)) / L if L else 0.0
            for k in on:
                if k in (a, b) or (a, b, k) in seen:
                    continue
                if off(PR, k) <= 0.5 and off(PA, k) <= 1.0 and off(PB, k) <= 1.0:
                    seen.add((a, b, k))
                    M = [((p[0] + q[0]) / 2, (p[1] + q[1]) / 2) + p[2:] for p, q in zip(PA, PB)]
                    d = off(M, k)
                    own = max(off(PA, k), off(PB, k))
                    if d > own + tol:
                        out.append((ci, k, round(d, 2), round(own, 2)))
    return out
