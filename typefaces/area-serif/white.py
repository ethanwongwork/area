"""Area Serif 0.81, round 3: white between two parts of one glyph is a counter.

A white gap between two parts of a glyph (a pocket between a stroke and its letter, a ring's gap to the letter in
it, a bar's gap to a stem, the white between two arms of a sign) changes along the weight axis as the letters'
counters do, with a floor:

    least(w) = max(white(400) * counter(w), min(white(400), floor(w)))

counter(w): the letters' own counters at the master over the Regular's (the median over every closed counter of
a b d e g o p q A B D O P R 4 6 8 9 0, each read as the largest circle it holds): about 0.84 at the Bold, 1.05 at
the Light. floor(w): the smallest white the letters themselves keep at that master, read across the narrowest
passage between two parts of one letter (a-z, A-Z: the white between two edges far apart along the outline, the
segment between them in white); B's notch where its bowls meet the stem, 32 at every master. A white under the
floor in the Regular keeps its own width; above it, it shrinks with the counters but never under the floor.

Measured on a 1-unit raster (skia); the passage is the shortest white segment between two outline places at least
three times its length apart along the outline (a crotch's two edges, which meet, are not a passage).
"""
import math
import statistics

import numpy as np

HOLE_LETTERS = "a b d e g o p q A B D O P R four six eight nine zero".split()
FLOOR_LETTERS = list("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")


def path_of(contours):
    import skia
    path = skia.Path()
    path.setFillType(skia.PathFillType.kWinding)
    for P in contours:
        on = [i for i, q in enumerate(P) if q[2] is not None]
        if not on:
            continue
        k0 = on[0]
        Q = P[k0:] + P[:k0]
        path.moveTo(*Q[0][:2])
        buf = []
        for q in Q[1:] + [Q[0]]:
            if q[2] is None:
                buf.append(q[:2])
                continue
            if len(buf) == 2:
                path.cubicTo(*buf[0], *buf[1], *q[:2])
            else:
                path.lineTo(*q[:2])
            buf = []
        path.close()
    return path


def raster(contours, pad=4):
    """Ink as a boolean array (row = y - y0, column = x - x0), 1 unit a pixel, and (x0, y0)."""
    import skia
    path = path_of(contours)
    b = path.getBounds()
    x0, y0 = int(math.floor(b.left())) - pad, int(math.floor(b.top())) - pad
    W, H = int(b.width()) + 2 * pad + 2, int(b.height()) + 2 * pad + 2
    surf = skia.Surface(W, H)
    c = surf.getCanvas()
    c.clear(skia.ColorBLACK)
    c.translate(-x0 + 0.5, -y0 + 0.5)                            # pixel centres on whole units
    c.drawPath(path, skia.Paint(Color=skia.ColorWHITE, AntiAlias=False))
    return surf.makeImageSnapshot().toarray()[:, :, 0] > 127, (x0, y0)


def holes(contours, least_area=150):
    """Each closed white (a counter, a pocket): [(diameter of the largest circle it holds, area, (x, y) of its
    centre)]."""
    from scipy import ndimage
    ink, (x0, y0) = raster(contours)
    lab, n = ndimage.label(~ink)
    border = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    out = []
    for k in range(1, n + 1):
        if k in border:
            continue
        m = lab == k
        if m.sum() < least_area:
            continue
        d = ndimage.distance_transform_edt(np.pad(m, 1))[1:-1, 1:-1]
        y, x = np.unravel_index(d.argmax(), d.shape)
        out.append((2 * float(d.max()), int(m.sum()), (x + x0, y + y0)))
    return out


def passage(contours, step=3.0, ratio=3.0, least_arc=120.0):
    """The narrowest white between two places of one outline far apart along it (or of two outlines): (width,
    p, q), or None."""
    import bold as B
    polys = B.polys(contours, step)
    pts, arc, cid, length = [], [], [], []
    for k, p in enumerate(polys):
        L = sum(math.dist(p[i], p[i - 1]) for i in range(len(p)))
        a, prev = 0.0, p[-1]
        for q in p:
            a += math.dist(prev, q)
            prev = q
            pts.append(q)
            arc.append(a)
            cid.append(k)
            length.append(L)
    P = np.array(pts)
    A_ = np.array(arc)
    K = np.array(cid)
    Ls = np.array(length)
    D = np.hypot(P[:, None, 0] - P[None, :, 0], P[:, None, 1] - P[None, :, 1])
    da = np.abs(A_[:, None] - A_[None, :])
    da = np.minimum(da, Ls[:, None] - da)
    da = np.where(K[:, None] == K[None, :], da, 1e9)
    cand = (da > np.maximum(ratio * D, least_arc)) & (D > 0.5)
    iu = np.triu(cand, 1)
    idx = np.argwhere(iu)
    if not len(idx):
        return None
    dv = D[iu]
    ink, (x0, y0) = raster(contours)

    def is_ink(m):
        x, y = int(round(m[0] - x0)), int(round(m[1] - y0))
        return 0 <= y < ink.shape[0] and 0 <= x < ink.shape[1] and bool(ink[y, x])
    for o in np.argsort(dv, kind="stable"):
        i, j = idx[o]
        if not any(is_ink(P[i] + (P[j] - P[i]) * t) for t in (0.25, 0.5, 0.75)):
            return float(D[i, j]), tuple(P[i]), tuple(P[j])
    return None


class Law:
    """The white law at one master: counter ratio and floor, read on the master's letters against the Regular's."""

    def __init__(self, reg, master, letters_reg=None):
        import bold as B
        ratios = []
        for n in HOLE_LETTERS:
            if n not in reg or n not in master or not reg[n].contours:
                continue
            a = sorted(h[0] for h in holes(B.glyph_contours(reg[n])))
            b = sorted(h[0] for h in holes(B.glyph_contours(master[n])))
            if len(a) == len(b):
                ratios += [y / x for x, y in zip(a, b) if x > 0]
        self.counter = statistics.median(ratios) if ratios else 1.0
        fl = []
        for n in FLOOR_LETTERS:
            if n in master and master[n].contours:
                got = passage(B.glyph_contours(master[n]))
                if got:
                    fl.append((got[0], n))
        self.floor, self.floor_letter = min(fl) if fl else (0.0, None)
        fr = []
        for n in FLOOR_LETTERS:
            if n in reg and reg[n].contours:
                got = passage(B.glyph_contours(reg[n]))
                if got:
                    fr.append(got[0])
        self.floor_reg = min(fr) if fr else self.floor

    def narrow(self, w0):
        """A white the law holds: under twice the letters' least white in the Regular (two parts close enough to
        meet). Wider whites (a colon's two dots, a ring round a letter 70 away) are a sign's layout, not a counter."""
        return w0 < 2 * self.floor_reg

    def least(self, w0):
        return max(w0 * self.counter, min(w0, self.floor))

    def __repr__(self):
        return f"white law: counters x {self.counter:.3f}, floor {self.floor:.1f} ({self.floor_letter})"


# ---------------------------------------------------------------- parts that touch, and parts kept apart

def _lines(contours):
    """Straight segments: (contour, i, j) with i -> j a line."""
    out = []
    for ci, P in enumerate(contours):
        on = [i for i, q in enumerate(P) if q[2] is not None]
        for k, i in enumerate(on):
            j = on[(k + 1) % len(on)]
            if P[j][2] == "line" and math.dist(P[i][:2], P[j][:2]) > 4:
                out.append((ci, i, j))
    return out


def contacts(R, tol=0.6):
    """A node of one part lying on a straight edge of another (or of its own contour, away from its neighbours):
    [(node contour, node index, edge contour, i, j)]. These parts are drawn to touch."""
    out = []
    lines = _lines(R)
    for ca, P in enumerate(R):
        for a, q in enumerate(P):
            if q[2] is None:
                continue
            for cb, i, j in lines:
                if cb == ca and a in (i, j, (i - 1) % len(P), (j + 1) % len(P)):
                    continue
                b0, b1 = R[cb][i][:2], R[cb][j][:2]
                L = math.dist(b0, b1)
                u = ((b1[0] - b0[0]) / L, (b1[1] - b0[1]) / L)
                s = (q[0] - b0[0]) * u[0] + (q[1] - b0[1]) * u[1]
                h = (q[0] - b0[0]) * -u[1] + (q[1] - b0[1]) * u[0]
                if abs(h) <= tol and -tol <= s <= L + tol:
                    out.append((ca, a, cb, i, j))
    return out


def coincident(R, tol=0.6):
    """Groups of on-curve nodes at one place in the Regular (an arrow's point drawn twice, once for each edge)."""
    nodes = [(c, i) for c, P in enumerate(R) for i, q in enumerate(P) if q[2] is not None]
    groups, seen = [], set()
    for a in nodes:
        if a in seen:
            continue
        G = [b for b in nodes if math.dist(R[a[0]][a[1]][:2], R[b[0]][b[1]][:2]) <= tol]
        if len(G) > 1:
            groups.append(G)
            seen.update(G)
    return groups


def keep_touching(R, N, corner=8.0):
    """Round 3: a part drawn to touch another stays touching in every master. (1) Nodes drawn at one place stay at
    one place (their mean). (2) The straight edge a node touches takes, across itself, the node's move: the edge's
    two ends and the soft corners beside them (within `corner` of its line, the face's 7-unit corner radius) move
    along the edge's normal until the node lies on it as in the Regular (an arrow's bar follows the arrow's point);
    an edge drawn in two pieces that meet at the node is one edge from its far end to its far end. N: the master's
    contours (whole units); returns them and the edges moved."""
    N = [list(P) for P in N]
    done = []
    groups = coincident(R)
    member = {m: tuple(G) for G in groups for m in G}
    for G in groups:
        mx = round(sum(N[c][i][0] for c, i in G) / len(G))
        my = round(sum(N[c][i][1] for c, i in G) / len(G))
        for c, i in G:
            q = N[c][i]
            dx, dy = mx - q[0], my - q[1]
            n = len(N[c])
            for k in (i, (i - 1) % n, (i + 1) % n):         # the node and its own handles
                if k == i or N[c][k][2] is None:
                    p = N[c][k]
                    N[c][k] = (p[0] + dx, p[1] + dy) + tuple(p[2:])
    edges = []
    for ca, a, cb, i, j in contacts(R):
        if (cb, i) in member.get((ca, a), ()) or (cb, j) in member.get((ca, a), ()):
            continue
        edges.append(((ca, a), cb, i, j))
    for G in groups:                                       # an edge drawn in two pieces meeting at the node
        ends = []
        for c, i in G:
            P = R[c]
            n = len(P)
            on = [k for k, q in enumerate(P) if q[2] is not None]
            k0 = on.index(i)
            for nb in (on[(k0 + 1) % len(on)], on[(k0 - 1) % len(on)]):
                line = P[nb][2] == "line" if nb == on[(k0 + 1) % len(on)] else P[i][2] == "line"
                if line:
                    ends.append((c, nb))
        for x in range(len(ends)):
            for y in range(x + 1, len(ends)):
                (c1, e1), (c2, e2) = ends[x], ends[y]
                if c1 != c2:
                    continue
                p0, p1, m = R[c1][e1][:2], R[c2][e2][:2], R[G[0][0]][G[0][1]][:2]
                L = math.dist(p0, p1)
                if L < 8:
                    continue
                h = ((m[0] - p0[0]) * -(p1[1] - p0[1]) + (m[1] - p0[1]) * (p1[0] - p0[0])) / L
                s = ((m[0] - p0[0]) * (p1[0] - p0[0]) + (m[1] - p0[1]) * (p1[1] - p0[1])) / L
                if abs(h) <= 0.6 and 0 < s < L:
                    edges.append((G[0], c1, e1, e2))
    for (ca, a), cb, i, j in edges:
        b0, b1 = R[cb][i][:2], R[cb][j][:2]
        L = math.dist(b0, b1)
        u = ((b1[0] - b0[0]) / L, (b1[1] - b0[1]) / L)
        n_ = (-u[1], u[0])
        m0, m1 = N[cb][i][:2], N[cb][j][:2]
        Lm = math.dist(m0, m1)
        if Lm < 1e-9:
            continue
        um = ((m1[0] - m0[0]) / Lm, (m1[1] - m0[1]) / Lm)
        nm = (-um[1], um[0])
        qa = N[ca][a]
        off = (qa[0] - m0[0]) * nm[0] + (qa[1] - m0[1]) * nm[1]
        d = (round(off * nm[0]), round(off * nm[1]))
        if d == (0, 0):
            continue
        skip = set(member.get((ca, a), ((ca, a),)))
        moved = 0
        for k, q in enumerate(R[cb]):
            if (cb, k) in skip or any((cb, kk) in skip and abs(kk - k) <= 1 and R[cb][k][2] is None for kk in range(len(R[cb]))):
                continue
            hh = (q[0] - b0[0]) * n_[0] + (q[1] - b0[1]) * n_[1]
            ss = (q[0] - b0[0]) * u[0] + (q[1] - b0[1]) * u[1]
            if abs(hh) <= corner and -corner <= ss <= L + corner:
                p = N[cb][k]
                N[cb][k] = (p[0] + d[0], p[1] + d[1]) + tuple(p[2:])
                moved += 1
        done.append(((ca, a), (cb, i, j), d, moved))
    return N, done + [("one place", G) for G in groups]


def _dense(P, step=2.0):
    """A contour's outline sampled every `step` units, lines included: [(x, y, segment start index)]."""
    import bold as B
    out = []
    n = len(P)
    on = [i for i, q in enumerate(P) if q[2] is not None]
    for k, i in enumerate(on):
        j = on[(k + 1) % len(on)]
        mid = [(i + d) % n for d in range(1, (j - i) % n)]
        pts = [P[i][:2]] + [P[m][:2] for m in mid] + [P[j][:2]]
        L = sum(math.dist(pts[a], pts[a + 1]) for a in range(len(pts) - 1))
        m_ = max(2, int(L / step))
        for s in range(m_):
            t = s / m_
            p = B._bez(pts, t) if len(pts) == 4 else (pts[0][0] + (pts[-1][0] - pts[0][0]) * t, pts[0][1] + (pts[-1][1] - pts[0][1]) * t)
            out.append((p[0], p[1], i, t))
    return out


def at(P, seg, t):
    """The point at parameter t of the segment that starts at node seg."""
    import bold as B
    n = len(P)
    on = [i for i, q in enumerate(P) if q[2] is not None]
    j = on[(on.index(seg) + 1) % len(on)]
    mid = [(seg + d) % n for d in range(1, (j - seg) % n)]
    pts = [P[seg][:2]] + [P[m][:2] for m in mid] + [P[j][:2]]
    if len(pts) == 4:
        return B._bez(pts, t)
    return (pts[0][0] + (pts[-1][0] - pts[0][0]) * t, pts[0][1] + (pts[-1][1] - pts[0][1]) * t)


def gaps(contours):
    """White between two contours of one glyph: [(a, b, width, (pa, seg a), (pb, seg b))] for every pair whose nearest
    places have white between them (a ring's two edges, ink between, are not a gap)."""
    ink, (x0, y0) = raster(contours)
    D = [np.array(_dense(P)) for P in contours]
    out = []
    for a in range(len(contours)):
        for b in range(a + 1, len(contours)):
            A_, C_ = D[a], D[b]
            d = np.hypot(A_[:, None, 0] - C_[None, :, 0], A_[:, None, 1] - C_[None, :, 1])
            i, j = np.unravel_index(d.argmin(), d.shape)
            pa, pb = A_[i][:2], C_[j][:2]
            white = True
            for t in (0.3, 0.5, 0.7):
                m = pa + (pb - pa) * t
                x, y = int(round(m[0] - x0)), int(round(m[1] - y0))
                if 0 <= y < ink.shape[0] and 0 <= x < ink.shape[1] and ink[y, x]:
                    white = False
            if white and d[i, j] > 0.5:
                out.append((a, b, float(d[i, j]), (tuple(pa), int(A_[i][2]), float(A_[i][3])),
                            (tuple(pb), int(C_[j][2]), float(C_[j][3]))))
    return out


def _thick(contours, p, v, reach=300):
    """Ink across from p along v (into the ink): units until white again."""
    ink, (x0, y0) = raster(contours)
    k = 1
    inside = False
    while k < reach:
        x, y = int(round(p[0] + v[0] * k - x0)), int(round(p[1] + v[1] * k - y0))
        on = 0 <= y < ink.shape[0] and 0 <= x < ink.shape[1] and ink[y, x]
        if on:
            inside = True
        elif inside:
            return k
        k += 1
    return k


def _edge_points(P, seg, corner=8.0, near=None):
    """The points that make the edge a segment starts: a line's two ends and the soft corners beside them; a curve's
    node nearer the gap and its handles."""
    n = len(P)
    on = [i for i, q in enumerate(P) if q[2] is not None]
    k = on.index(seg)
    j = on[(k + 1) % len(on)]
    if P[j][2] == "line":
        b0, b1 = P[seg][:2], P[j][:2]
        L = math.dist(b0, b1)
        u = ((b1[0] - b0[0]) / L, (b1[1] - b0[1]) / L)
        out = []
        for m, q in enumerate(P):
            hh = (q[0] - b0[0]) * -u[1] + (q[1] - b0[1]) * u[0]
            ss = (q[0] - b0[0]) * u[0] + (q[1] - b0[1]) * u[1]
            if abs(hh) <= corner and -corner <= ss <= L + corner:
                out.append(m)
        return out
    end = seg if near is None or math.dist(near, P[seg][:2]) <= math.dist(near, P[j][:2]) else j
    return [m for m in ((end - 1) % n, end, (end + 1) % n) if m == end or P[m][2] is None]


def _side_by_side(A, C):
    """Two inks whose boxes share a band of height and neither holds the other: bold.keep_apart's (it moves them
    apart, not thinner)."""
    def box(P):
        xs, ys = [q[0] for q in P], [q[1] for q in P]
        return min(xs), min(ys), max(xs), max(ys)
    a, c = box(A), box(C)
    inside = (a[0] <= c[0] and a[1] <= c[1] and a[2] >= c[2] and a[3] >= c[3]) or \
        (c[0] <= a[0] and c[1] <= a[1] and c[2] >= a[2] and c[3] >= a[3])
    return min(a[3], c[3]) - max(a[1], c[1]) > 0 and not inside


def keep_white(R, N, law, rounds=4):
    """Round 3: white between two parts of one glyph never under law.least(the Regular's white). The white is read
    in the master across the Regular's narrowest place (the same two outline places, so parts that already meet
    read as a white under zero). Where it is short, the parts give way into themselves, the thinner first: each
    part's facing edge (the line at the narrowest place with its soft corners, or the curve's nearer node with its
    handles) moves back along the gap by at most what that part gained there over the Regular (no stroke thinner
    than in the Regular). Returns the contours and [(parts, before, target, after)]."""
    import axis_exact as X
    import audit_axis as AA
    N0 = [list(P) for P in N]
    N = [list(P) for P in N]
    regs = [g for g in gaps(R) if law.narrow(g[2]) and not _side_by_side(R[g[0]], R[g[1]])]
    log = []
    if not regs:
        return N, log
    turns0 = len(X.turns(R, R, N, AA.FILLET_SMALL, AA.FILLET_MAX))
    for a, b, w0, (pa0, sa, ta), (pb0, sb, tb) in regs:
        want = law.least(w0)
        v = np.array(pb0) - np.array(pa0)
        v = v / np.linalg.norm(v)
        first = None
        for _ in range(rounds):
            pa, pb = np.array(at(N[a], sa, ta)), np.array(at(N[b], sb, tb))
            w = float((pb - pa) @ v)
            if w > 0.5:                                        # once open, the true narrowest white
                got = [g for g in gaps(N) if (g[0], g[1]) == (a, b)]
                if got:
                    w = min(w, got[0][2])
            first = w if first is None else first
            if w >= want - 0.5:
                break
            need = want - w
            parts = []
            for c, p, s, vv, rp in ((a, pa, sa, -v, pa0), (b, pb, sb, v, pb0)):
                tm = _thick(N, tuple(p - vv * 1.0), vv)
                tr = _thick(R, tuple(np.array(rp) - vv * 1.0), vv)
                parts.append((tm, c, s, vv, max(0.0, tm - tr), p))
            parts.sort(key=lambda r: r[0])
            moved = False
            for tm, c, s, vv, gain, p in parts:
                give = min(need, gain)
                if give < 0.5:
                    continue
                dx, dy = round(vv[0] * give), round(vv[1] * give)
                keep = [list(P) for P in N]
                for m in _edge_points(N[c], s, near=tuple(p)):
                    q = N[c][m]
                    N[c][m] = (q[0] + dx, q[1] + dy) + tuple(q[2:])
                if len(X.turns(R, R, N, AA.FILLET_SMALL, AA.FILLET_MAX)) > turns0:
                    N = keep                                   # this part cannot give way without a new turn
                    continue
                need -= give
                moved = True
            if not moved:
                break
        pa, pb = np.array(at(N[a], sa, ta)), np.array(at(N[b], sb, tb))
        log.append(((a, b), round(first, 1), round(want, 1), round(float((pb - pa) @ v), 1)))
    if len(X.turns(R, R, N, AA.FILLET_SMALL, AA.FILLET_MAX)) > turns0:
        return N0, [("left: giving way bends a curve",) + tuple(log)]
    return N, log


# ---------------------------------------------------------------- necks between two curves

def _crotch_curves(P):
    """Reflex corner nodes: where one stroke branches from another. Round 3 read only those whose two segments are
    both curves; 0.81 (integration) reads every branch, a straight side or not (glottal stop's, s_p's and ƴ's
    crotches have one straight side and pinched at 300, 19 > 14 to 30 > 11): the neck is the nearest approach across
    the ink whatever the sides are."""
    import arms as ARMS
    return list(ARMS.crotches(P))


def neck_at(contours, ci, i, skip=2):
    """A crotch's neck: the shortest cut across the ink from the crotch to the outline beyond its own two segments
    (the far edge of the stroke it branches into); (length, far point)."""
    pts = []
    for cj, P in enumerate(contours):
        D = _dense(P, 1.5)
        n = len(P)
        on = [k for k, q in enumerate(P) if q[2] is not None]
        k0 = on.index(i) if cj == ci else None
        near = set()
        if k0 is not None:
            for d in range(-skip, skip):
                near.add(on[(k0 + d) % len(on)])
        pts += [(x, y) for x, y, s, t in D if s not in near]
    c = contours[ci][i][:2]
    A_ = np.array(pts)
    d = np.hypot(A_[:, 0] - c[0], A_[:, 1] - c[1])
    ink, (x0, y0) = raster(contours)

    def is_ink(m):
        x, y = int(round(m[0] - x0)), int(round(m[1] - y0))
        return 0 <= y < ink.shape[0] and 0 <= x < ink.shape[1] and bool(ink[y, x])
    for k in np.argsort(d):                                    # across the ink, not across a counter
        p = A_[k]
        if all(is_ink((c[0] + (p[0] - c[0]) * t, c[1] + (p[1] - c[1]) * t)) for t in (0.25, 0.5, 0.75)):
            return float(d[k]), tuple(p)
    return float(d.min()), tuple(A_[int(d.argmin())])


def keep_necks(R, N, share, thin):
    """Round 3: where one stroke branches from another (g's loop out of its link, s_p's long s into its p),
    the neck is the two outlines' nearest approach across the ink at the crotch: from the crotch to the far edge
    of the stroke it branches into. It never falls under share x the Regular's neck (share: the hairline's change
    at this weight). The node on the far edge nearest the neck gives way first (it is the one the stretch of its
    counter carried towards the crotch: g's lower counter's corner came 35 units left at 300 where the crotch came
    5), straight away from the crotch, no further than the box of its two neighbouring nodes; then the crotch, the
    same way. Only a neck run into the thin zone (under `thin`, the serif tip at this weight) is this rule's: Q's
    tail and C's barbs, which have no branch, keep their necks. Returns contours and [(contour, node, before,
    target, after)]."""
    N = [list(P) for P in N]
    log = []

    def nearest_node(cs, p, not_near=None):
        best = None
        for cj, P in enumerate(cs):
            on_ = [m for m, q in enumerate(P) if q[2] is not None]
            for k, q in enumerate(P):
                if not_near and cj == not_near[0]:
                    k0_ = on_.index(not_near[1])
                    if q[2] is not None and k in {on_[(k0_ + d) % len(on_)] for d in (-1, 0, 1)}:
                        continue
                if q[2] is not None:
                    d = math.dist(q[:2], p)
                    if best is None or d < best[0]:
                        best = (d, cj, k)
        return best[1], best[2]

    def shift(cs, cj, k, d, box):
        P = cs[cj]
        n = len(P)
        c0 = np.array(P[k][:2], float)
        newc = c0 + d
        for ax in (0, 1):
            lo, hi = min(box[0][ax], box[1][ax]), max(box[0][ax], box[1][ax])
            newc[ax] = min(max(newc[ax], lo), hi)
        dx, dy = round(newc[0] - c0[0]), round(newc[1] - c0[1])
        M = [list(Q) for Q in cs]
        for m in (k, (k - 1) % n, (k + 1) % n):
            if m == k or M[cj][m][2] is None:
                q = M[cj][m]
                M[cj][m] = (q[0] + dx, q[1] + dy) + tuple(q[2:])
        return M

    def neighbours(cs, cj, k):
        P = cs[cj]
        on = [m for m, q in enumerate(P) if q[2] is not None]
        k0 = on.index(k)
        return [P[on[(k0 - 1) % len(on)]][:2], P[on[(k0 + 1) % len(on)]][:2]]

    for ci, P in enumerate(R):
        for i in _crotch_curves(P):
            n0, far0 = neck_at(R, ci, i)
            if n0 < 30:                                        # 0.81: thinner than a serif tip in the Regular, it is
                continue                                       # no branch (a flare's corner, a bracket, parts touching)
            want = n0 * share
            n1, far = neck_at(N, ci, i)
            if n1 >= want - 1.0 or n1 >= thin:
                continue
            N_before = [list(Q) for Q in N]
            before = n1
            fj, fk = nearest_node(R, far0, (ci, i))            # the far edge's node, read in the Regular

            def edge_neck(cs):
                """The neck against the far edge only (the two segments either side of its node), so a move that
                opens it is not read against some other edge farther off."""
                Pf = cs[fj]
                on_ = [m for m, q in enumerate(Pf) if q[2] is not None]
                k_ = on_.index(fk)
                segs = {on_[(k_ - 1) % len(on_)], fk}
                pts = np.array([(x, y) for x, y, s, tt in _dense(Pf, 1.0) if s in segs])
                c_ = cs[ci][i][:2]
                d_ = np.hypot(pts[:, 0] - c_[0], pts[:, 1] - c_[1])
                k2 = int(d_.argmin())
                return float(d_[k2]), tuple(pts[k2])
            # 0.81: a crotch with a straight side is solved on that side (parts.solve's rule for a branch on a stem):
            # it slides along the straight edge, away from the corner, until the neck is the target; its handles go
            # with it and nothing else moves. The far edge is another stroke's (ƴ's thin diagonal) and stays.
            Pc = N[ci]
            nP = len(Pc)
            on_c = [m for m, q in enumerate(Pc) if q[2] is not None]
            kc = on_c.index(i)
            prv_, nxt_ = on_c[(kc - 1) % len(on_c)], on_c[(kc + 1) % len(on_c)]
            side = prv_ if Pc[i][2] == "line" else (nxt_ if Pc[nxt_][2] == "line" else None)
            if side is not None:
                c0 = np.array(Pc[i][:2], float)
                u = np.array(Pc[side][:2], float) - c0
                L = float(np.linalg.norm(u))
                solved = None
                if L > 4:
                    u = u / L

                    def slid(t):
                        M = [list(Q) for Q in N]
                        dx, dy = round(u[0] * t), round(u[1] * t)
                        for m in (i, (i - 1) % nP, (i + 1) % nP):
                            if m == i or M[ci][m][2] is None:
                                q = M[ci][m]
                                M[ci][m] = (q[0] + dx, q[1] + dy) + tuple(q[2:])
                        return M
                    for t in np.arange(1.0, 0.8 * L, 1.0):
                        if neck_at(slid(t), ci, i)[0] >= want - 0.5:
                            solved = slid(t)
                            break
                if solved is not None:
                    N = solved
                    log.append((ci, i, round(before, 1), round(want, 1), round(neck_at(N, ci, i)[0], 1), "along its straight side"))
                    continue
            for who in ((fj, fk, -1), (ci, i, 1)):
                n1, far = edge_neck(N)
                if n1 >= want - 0.5:
                    break
                cj, k, sgn = who
                u = np.array(N[ci][i][:2], float) - np.array(far)
                if np.linalg.norm(u) < 1e-6 or (cj, k) == (ci, i) and who[2] < 0:
                    continue
                u = u / np.linalg.norm(u)
                box = neighbours(N, cj, k)
                lo_, hi_ = 0.0, 2 * (want - n1) + 4
                base = N
                if edge_neck(shift(base, cj, k, sgn * u * hi_, box))[0] < want - 0.5:
                    N = shift(base, cj, k, sgn * u * hi_, box)
                    continue
                for _ in range(10):
                    mid = (lo_ + hi_) / 2
                    if edge_neck(shift(base, cj, k, sgn * u * mid, box))[0] >= want - 0.5:
                        hi_ = mid
                    else:
                        lo_ = mid
                N = shift(base, cj, k, sgn * u * hi_, box)
            after = neck_at(N, ci, i)[0]                       # read again across all the ink, as before
            if not (want - 1.0 <= after <= want + 6.0):            # a move that reads open only against the far
                N = N_before                                       # edge (another edge came nearer) is not kept
                log.append((ci, i, round(before, 1), round(want, 1), "left", round(after, 1)))
                continue
            log.append((ci, i, round(before, 1), round(want, 1), round(after, 1)))
    return N, log


# ---------------------------------------------------------------- a thin arm leaving a thick stroke

def arm_crotches(R, N, ratio, reach=60.0):
    """Round 3: a crotch where a thin arm with one straight edge leaves a thicker straight stroke (the ampersand's
    tail arm out of its diagonal). The crotch is where the thick stroke's edge (the line on one side of it) meets the
    arm's other edge; the arm's width there is the crotch's distance from the arm's straight edge across the ink. In
    a master it lies on the thick stroke's moved edge at that distance times `ratio` (the hairline's change) from
    the arm's moved straight edge: the engine slid it along the thick edge by the thick stroke's gain and ran it
    through the arm (the ampersand's arm 25 > 13 at 700). Its handle on the arm's side keeps its direction and
    length. Only a crotch whose distance has fallen moves. Returns contours and [(contour, node, before, after)]."""
    import arms as ARMS
    N = [list(P) for P in N]
    log = []
    for ci, P in enumerate(R):
        n = len(P)
        on = [k for k, q in enumerate(P) if q[2] is not None]
        lines = [(on[k], on[(k + 1) % len(on)]) for k in range(len(on)) if P[on[(k + 1) % len(on)]][2] == "line"]
        for c in ARMS.crotches(P):
            k0 = on.index(c)
            nxt, prv = on[(k0 + 1) % len(on)], on[(k0 - 1) % len(on)]
            if P[nxt][2] == "line" and P[c][2] == "curve":
                thick, arm_side = (c, nxt), "before"
            elif P[c][2] == "line" and P[(c + 1) % n][2] is None:
                thick, arm_side = (prv, c), "after"
            else:
                continue
            best = None
            for a, b in lines:
                if c in (a, b) or (a, b) == thick:
                    continue
                pa, pb = P[a][:2], P[b][:2]
                L = math.dist(pa, pb)
                if L < 100:
                    continue
                u = ((pb[0] - pa[0]) / L, (pb[1] - pa[1]) / L)
                s = (P[c][0] - pa[0]) * u[0] + (P[c][1] - pa[1]) * u[1]
                h = (P[c][0] - pa[0]) * -u[1] + (P[c][1] - pa[1]) * u[0]
                if -reach <= s <= L and abs(h) <= reach and (best is None or abs(h) < abs(best[2])):
                    best = (a, b, h)
            if best is None:
                continue
            a, b, h0 = best
            qa, qb = N[ci][a][:2], N[ci][b][:2]
            Lm = math.dist(qa, qb)
            um = ((qb[0] - qa[0]) / Lm, (qb[1] - qa[1]) / Lm)
            hm = (N[ci][c][0] - qa[0]) * -um[1] + (N[ci][c][1] - qa[1]) * um[0]
            want = h0 * ratio
            if abs(h0) < 20 or abs(hm) >= 0.5 * abs(h0):          # an arm's width, collapsed to under half
                continue
            t0, t1 = N[ci][thick[0]][:2], N[ci][thick[1]][:2]       # the thick edge, moved
            d = (t1[0] - t0[0], t1[1] - t0[1])
            # point on thick line: t0 + k d; its h against the arm edge = want
            hd = d[0] * -um[1] + d[1] * um[0]
            if abs(hd) < 1e-9:
                continue
            h_t0 = (t0[0] - qa[0]) * -um[1] + (t0[1] - qa[1]) * um[0]
            kk = (want - h_t0) / hd
            newc = (t0[0] + kk * d[0], t0[1] + kk * d[1])
            dx, dy = round(newc[0] - N[ci][c][0]), round(newc[1] - N[ci][c][1])
            hk = (c - 1) % n if arm_side == "before" else (c + 1) % n
            far_node = prv if arm_side == "before" else nxt        # the arm curve's other end
            q = N[ci][c]
            N[ci][c] = (q[0] + dx, q[1] + dy) + tuple(q[2:])
            # its handle on the arm's side keeps its angle to the curve's chord and its share of the chord's length
            co, ho, fo = np.array(P[c][:2], float), np.array(P[hk][:2], float), np.array(P[far_node][:2], float)
            cn, fn = np.array(N[ci][c][:2], float), np.array(N[ci][far_node][:2], float)
            ch0, ch1 = fo - co, fn - cn
            ang = math.atan2(ch1[1], ch1[0]) - math.atan2(ch0[1], ch0[0])
            sc = np.linalg.norm(ch1) / np.linalg.norm(ch0)
            hv = (ho - co) * sc
            hv = np.array([hv[0] * math.cos(ang) - hv[1] * math.sin(ang), hv[0] * math.sin(ang) + hv[1] * math.cos(ang)])
            N[ci][hk] = (round(cn[0] + hv[0]), round(cn[1] + hv[1])) + tuple(N[ci][hk][2:])
            log.append((ci, c, round(abs(hm), 1), round(abs(want), 1)))
    return N, log


# ---------------------------------------------------------------- along a tapering stroke (0.81, integration)

def _stations(contours, n_seg=6):
    """Every contour cut at fixed parameters, as audit_rays cuts the variable font's: polylines [array (V, 2)] and,
    per vertex, (contour, segment start node, t)."""
    import bold as B
    polys, where = [], []
    for ci, P in enumerate(contours):
        n = len(P)
        on = [i for i, q in enumerate(P) if q[2] is not None]
        pts, wh = [], []
        for k, i in enumerate(on):
            j = on[(k + 1) % len(on)]
            mid = [(i + d) % n for d in range(1, (j - i) % n)]
            ctl = [P[i][:2]] + [P[m][:2] for m in mid] + [P[j][:2]]
            for s in range(n_seg):
                t = s / n_seg
                if len(ctl) == 4:
                    p = B._bez(ctl, t)
                elif s:
                    continue                                   # a line: its start only
                else:
                    p = ctl[0]
                pts.append(p)
                wh.append((ci, i, t))
        polys.append(np.array(pts, float))
        where += wh
    return polys, where


def taper_law(th_r, laws):
    """The ratio a station keeps at this master, read off the ladder by the Regular's thickness there. laws: the
    ladder's steps [(Regular thickness, ratio)] from the thickest down: the stem (its ratio), the hairline (the
    hairline's), the serif tip (the tip's). Thicker than the stem a station takes the stem's ratio, thinner than the
    tip the tip's, in between it is interpolated between the two steps it lies between: one continuous law, so a
    stroke tapering from a stem through a hairline to an end keeps its shape."""
    xs = np.array([t for t, _ in laws][::-1], float)
    ys = np.array([r for _, r in laws][::-1], float)
    return np.interp(th_r, xs, ys)


def taper_readings(contours, n_seg=6, close=False):
    """Across-the-stroke length at every station (audit_rays' ray, its junction and facing filters, and its rule that
    a ray longer than twice the glyph's mean stroke runs along a stroke): (lengths, far edge ids, where). 0.81 (close):
    read as the integration round read (audit_rays.rays(close=False)): the audit's new end zones and return ray
    changed which places this rule held, and the Bold's handles moved on 43 glyphs (the comma's 67 units; the quotes
    then dipped between their mid master and the Bold, 37 > 35 at 675)."""
    import audit_rays as AR
    polys, where = _stations(contours, n_seg)
    th, eid = AR.rays(polys, close=close)              # 0.81 (close): the integration round's reading
    ms = AR.mean_stroke(polys)
    th = np.where(th <= 2 * ms, th, np.nan)
    return th, eid, where


def keep_taper(R, N, laws, tol=0.5, n_seg=6, only_thinner=False, nodes=True, cuts=False):
    """Along a tapering stroke (a tail, a hook, a flag) every station keeps at least its own law's share of the
    Regular's thickness there (taper_law): stem-like places the stem's ratio, hairline-like the hairline's, a serif
    tip's or an end's the tip's, in between in proportion, so the taper keeps its shape and no place thins faster than its own kind. A station is
    read as audit_rays reads one (the same place on the same segment in both masters, the ray leaving through the
    same edge). Where one falls short, the curve it lies on and the curve its ray ends on retune their two handle
    lengths, nothing else (nodes, tangents and lines stay), to the least change that holds the law, and no curve
    gains a turn. only_thinner (towards the Bold): only the places the master reads thinner than the Regular (a
    stroke the engine did not read, as the a's bowl running into @'s ring, 29 > 17 at 550) are held, and to the
    same law. Returns contours and [(contour, segment, deficit before, deficit after)]."""
    import axis_exact as X
    import audit_axis as AA
    N = [list(P) for P in N]
    thR, eR, where = taper_readings(R, n_seg)
    thN0 = taper_readings(N, n_seg)[0]

    def short(cs):
        thN, eN, _ = taper_readings(cs, n_seg)
        ok = ~np.isnan(thR) & ~np.isnan(thN) & (eN == eR)
        want = thR * taper_law(thR, laws)
        over = np.where(ok, thN - np.maximum(np.nan_to_num(thN0, nan=0.0), want) - tol, 0.0)
        if only_thinner:                                       # towards the Bold: the places that thin at all,
            # in the engine's reading or in the retuned outline's (0.81, last round: the mask was the engine's
            # alone, so a retune that thinned a place the engine had right went unseen: C's barb's handle grew
            # 1.32 times and the stroke into its foot fell 75 > 61 against the Regular's 68)
            ok &= (np.nan_to_num(thN0, nan=1e9) < thR - 1.0) | (np.nan_to_num(thN, nan=1e9) < thR - 1.0)
        d = np.where(ok, want - tol - thN, 0.0)
        return np.maximum(d, 0.0), np.maximum(over, 0.0)
    d0, _ = short(N)
    if not (d0 > 0).any():
        return N, []
    turns0 = len(X.turns(R, R, N, AA.FILLET_SMALL, AA.FILLET_MAX))
    # the far edge of each station: which segment the ray's exit edge lies on (vertex ids run contour by contour)
    seg_of = [(ci, i) for ci, i, t in where]
    cands = []
    for k in np.where(d0 > 0)[0]:
        for s_ in (seg_of[k], seg_of[eR[k]] if 0 <= eR[k] < len(seg_of) else None):
            if s_ is not None and s_ not in cands:
                cands.append(s_)
    log = []

    def handles(P, i):
        n = len(P)
        if P[(i + 1) % n][2] is None and P[(i + 2) % n][2] is None and P[(i + 3) % n][2] == "curve":
            return (i + 1) % n, (i + 2) % n, (i + 3) % n
        return None
    for ci, i in cands:
        h = handles(N[ci], i)
        if h is None:
            continue
        h1, h2, j = h
        P0 = [list(Q) for Q in N]
        a0, b0 = np.array(P0[ci][i][:2], float), np.array(P0[ci][j][:2], float)
        u1, u2 = np.array(P0[ci][h1][:2], float) - a0, np.array(P0[ci][h2][:2], float) - b0
        if np.linalg.norm(u1) < 1 or np.linalg.norm(u2) < 1:
            continue

        def with_(sa, sb):
            M = [list(Q) for Q in P0]
            p1, p2 = a0 + u1 * sa, b0 + u2 * sb
            M[ci][h1] = (round(p1[0]), round(p1[1])) + tuple(M[ci][h1][2:])
            M[ci][h2] = (round(p2[0]), round(p2[1])) + tuple(M[ci][h2][2:])
            return M
        before = float(short(P0)[0].sum())
        if before <= 0:
            continue

        def cost(sa, sb):                                     # short of the law, or thicker than both the place
            d_, o_ = short(with_(sa, sb))                      # was and its law (no place thickens past its law)
            return float((d_ ** 2).sum() + (o_ ** 2).sum()) + 40 * ((sa - 1) ** 2 + (sb - 1) ** 2)
        sa = sb = 1.0
        c_ = cost(sa, sb)
        for step in (0.16, 0.08, 0.04, 0.02):               # coordinate descent on the two handle lengths
            for _ in range(6):
                moved_ = False
                for da, db in ((step, 0), (-step, 0), (0, step), (0, -step)):
                    na, nb = min(max(sa + da, 0.6), 1.6), min(max(sb + db, 0.6), 1.6)
                    cn = cost(na, nb)
                    if cn < c_ - 1e-9:
                        sa, sb, c_, moved_ = na, nb, cn, True
                        break
                if not moved_:
                    break
        while (sa, sb) != (1.0, 1.0):                         # no curve gains a turn: back towards the Regular's
            M = with_(sa, sb)
            if len(X.turns(R, R, M, AA.FILLET_SMALL, AA.FILLET_MAX)) <= turns0:
                N = M
                log.append((ci, i, round(before, 1), round(float(short(N)[0].sum()), 1)))
                break
            sa, sb = 1 + (sa - 1) / 2, 1 + (sb - 1) / 2
            if abs(sa - 1) < 0.01 and abs(sb - 1) < 0.01:
                break
    if nodes:
        N, log2 = _taper_places(R, N, short, seg_of, eR, turns0, thR)
        log += log2
        N, log3 = _straight_nodes(R, N, seg_of, eR, turns0, thR, laws[0][1])
        log += log3
    elif cuts:
        # axis round 3: towards the Bold a stroke's straight cut end takes the tip's law too (the ogonek's top, 12
        # units, stayed 12 while its stroke lengthened: 19.7 > 18.7 across it at the Bold); no other node moves
        N, log2 = _taper_places(R, N, short, seg_of, eR, turns0, thR, cut_only=True)
        log += log2
    return N, log


def _straight_nodes(R, N, seg_of, eR, turns0, thR, stem_ratio):
    """Axis round 2: a smooth node joining a straight to a curve (a tail's inside leaving its straight, a stem's edge
    running into a tail: ƴ's, ɲ's) is moved by no other rule: _taper_places moves only nodes with a handle each side,
    while the stroke's opposite edge moves with the engine's map (ƴ's tail at 300: its inside's node stayed while the
    outside straight moved 29 left, 45 > 15 across). Where a station on its curve (or one whose ray ends on that curve)
    is short of its law by more than NODE_JND of the law, the node travels along its own straight (the straight keeps
    its line, the curve its tangent there), its handle on the curve rescaled by the curve's chord, by the least slide
    that brings those places within NODE_JND of their law, or failing that the slide that leaves them least short;
    kept only when it takes the worst of them at least NODE_JND of its law nearer, with no new turn and no new
    crossing. Never within 4 units of the straight's other end, nor past half the curve's chord.
    Returns contours and [(contour, node, slide, worst before, worst after)]."""
    import axis_exact as X
    # axis round 3: read as audit_rays reads (its end zones, soft crotches and return ray): round 2 read as the taper
    # law does and slid ʋ's counter node 124 up its straight for places the audit does not take for a stroke
    thR = taper_readings(R, close=True)[0]
    thN = taper_readings(N, close=True)[0]
    want = thR * stem_ratio                                    # no part thins faster than the stem (audit_rays' law)
    bad = np.where(~np.isnan(thR) & (np.nan_to_num(thN, nan=1e9) < want * (1 - NODE_JND) - 1.0))[0]
    if not len(bad):
        return N, []
    crossings0 = len(X.crossings(R, R, N))
    cands = {}
    for k in bad:
        for s_ in (seg_of[k], seg_of[eR[k]] if 0 <= eR[k] < len(seg_of) else None):
            if s_ is None:
                continue
            ci, i = s_
            P = N[ci]
            n = len(P)
            on = [m for m, q in enumerate(P) if q[2] is not None]
            if i not in on:
                continue
            j = on[(on.index(i) + 1) % len(on)]
            if P[(i + 1) % n][2] is not None:
                continue                                       # the station's segment is a line
            # the curve i..j: a node at either end that is smooth, with a straight on its other side
            for m, h, far in ((i, (i + 1) % n, j), (j, (j - 1) % n, i)):
                q = P[m]
                o = on[(on.index(m) + (-1 if m == i else 1)) % len(on)]
                line_ = (q[2] == "line") if m == i else (P[o][2] == "line")
                if not q[3] or not line_ or not P[far][3]:
                    continue                                   # a curve ending on a corner is a bracket into a serif
                cands.setdefault((ci, m, h, far, o), []).append(k)
    log = []
    for (ci, m, h, far, o), ks in cands.items():
        P = N[ci]
        q, qo = P[m], P[o]
        L_ = math.dist(q[:2], qo[:2])
        chord = math.dist(q[:2], P[far][:2])
        if L_ < 8 or chord < 8:
            continue
        u = ((qo[0] - q[0]) / L_, (qo[1] - q[1]) / L_)          # along the straight, towards its other end
        hv = (P[h][0] - q[0], P[h][1] - q[1])
        ks = np.array(sorted(set(ks)))

        n = len(P)
        fh = (far - 1) % n if h == (m + 1) % n else (far + 1) % n   # the curve's other handle, at its far node
        fv = (P[fh][0] - P[far][0], P[fh][1] - P[far][1])

        def moved(s):
            # the node's handle rescaled by the curve's chord; where the curve would gain a turn, its far handle
            # shortens, step by step, until it does not (ƴ's tail from 50 units of slide)
            nx, ny = q[0] + u[0] * s, q[1] + u[1] * s
            r = math.dist((nx, ny), P[far][:2]) / chord
            for k2 in (1.0, 0.85, 0.7, 0.55, 0.4):
                M = [list(Q) for Q in N]
                M[ci][m] = (round(nx), round(ny)) + tuple(q[2:])
                M[ci][h] = (round(nx + hv[0] * r), round(ny + hv[1] * r)) + tuple(P[h][2:])
                M[ci][fh] = (round(P[far][0] + fv[0] * r * k2), round(P[far][1] + fv[1] * r * k2)) + tuple(P[fh][2:])
                if len(X.turns(R, R, M, 12, 20)) <= turns0:
                    return M
            return None

        def worst(M):
            # a place whose ray no longer leaves (nan) counts as not held; one leaving through the next piece of the
            # same edge (the node moved along it) is read as it is
            th_ = taper_readings(M, close=True)[0][ks]
            w_ = np.nan_to_num(want[ks], nan=1e9)
            return float(np.max(np.where(np.isnan(th_), 1.0, (w_ - th_) / w_)))
        w0 = worst(N)
        if w0 <= NODE_JND:
            continue                                           # held already (by an earlier slide)
        best = None
        # axis round 3: a slide no longer than 1.5 times the Regular's stroke at the places it holds (SLIDE_REACH): ʋ's
        # counter node went 124 up its 277-unit straight for a place 5.5% under the stem's law, a long move for a
        # small gain, and its counter's straight side read much shorter than the Regular's
        reach = SLIDE_REACH * float(np.nanmax(thR[ks]))
        for s in sorted(range(-int(min(chord * 0.5, reach)), int(min(L_ - 4, chord, reach)) + 1, 2), key=abs):
            if s == 0:
                continue
            M = moved(s)
            if M is None:
                continue
            w = worst(M)
            if (best is None or w < best[1] - 1e-9) and w0 - w >= NODE_JND and len(X.crossings(R, R, M)) <= crossings0:
                best = (s, w, M)
                if w <= NODE_JND:
                    break
        if best is None:
            continue
        s, w, M = best
        N = M
        log.append((ci, m, s, round(w0, 3), round(w, 3)))
    return N, log


SLIDE_REACH = 1.5          # axis round 3: a straight-node slide reaches at most this many times the Regular's stroke
NODE_JND = 0.03            # a place left short of its law by more than this share of it (the just-noticeable
                           # difference in weight, audit_rays' JND) after the handles moves its nodes


def _taper_places(R, N, short, seg_of, eR, turns0, thR, cut_only=False):
    """0.81 (close): when handles cannot hold a place, move the places, not the tension (the construction skill,
    g.ss02's tail). A station still short of its law by more than NODE_JND of its law is a place the handle lengths
    cannot reach: the smooth nodes at the two ends of the curve it lies on and of the curve its ray ends on move,
    each rigidly with its two handles (so its tangent and the curves' tensions stay, an extreme stays an extreme), by
    the least whole-unit shift that holds the law: a node whose handles are level (a height: an extreme on a zone
    line, an overshoot) moves level only. Corners (crotches, cut ends, a line's ends) never move. No curve gains a
    turn and no contour a crossing the move did not have; nothing is moved past its neighbouring nodes' box. One
    rule for every glyph and both sides: the a's bowl running into @'s ring (its counter's corner rode the upright
    strokes' map 44 right while the crotch went 24 left), the ogonek's tail at its node, the IPA hooks' nodes
    towards the Light. Returns contours and [(contour, node, shift, deficit before, deficit after)]."""
    import axis_exact as X
    import audit_axis as AA
    want_of = None
    d1, _ = short(N)
    thN = taper_readings(N)[0]
    # how far short of its law each place is, as a share of the law (want = thickness the law asks for)
    want_of = np.where(d1 > 0, np.nan_to_num(thN, nan=0.0) + d1, np.nan)
    bad = np.where((d1 > 0) & (d1 > NODE_JND * np.nan_to_num(want_of, nan=1e9)))[0]
    if not len(bad):
        return N, []
    nodes_ = []
    for k in bad:
        for s_ in (seg_of[k], seg_of[eR[k]] if 0 <= eR[k] < len(seg_of) else None):
            if s_ is None:
                continue
            ci, i = s_
            P = N[ci]
            on = [m for m, q in enumerate(P) if q[2] is not None]
            j = on[(on.index(i) + 1) % len(on)]
            for m in (i, j):
                if (ci, m) not in nodes_:
                    nodes_.append((ci, m))
    log = []
    crossings0 = len(X.crossings(R, R, N))

    def handles_of(P, m):
        n = len(P)
        return [h for h in ((m - 1) % n, (m + 1) % n) if P[h][2] is None]

    for ci, m in nodes_:
        P = N[ci]
        q = P[m]
        if q[2] is None:
            continue
        on = [k for k, p in enumerate(P) if p[2] is not None]
        k0 = on.index(m)
        prv, nxt = on[(k0 - 1) % len(on)], on[(k0 + 1) % len(on)]
        cut = None
        if not q[3]:
            # a corner moves only as a stroke's cut end: a straight cut under the serif tip's length between two
            # corners at a stroke's end (the ogonek's top, 11 units) grows along itself, as an end takes the tip's
            # law; a crotch, a line's end or any other corner never moves
            for o, line_ in ((nxt, P[nxt][2] == "line"), (prv, q[2] == "line")):
                if line_ and not P[o][3] and 4 <= math.dist(P[o][:2], q[:2]) < 30:
                    L_ = math.dist(P[o][:2], q[:2])
                    cut = ((q[0] - P[o][0]) / L_, (q[1] - P[o][1]) / L_)
            if cut is None:
                continue
            hs = handles_of(P, m)
            level = False
        elif cut_only:
            continue
        else:
            hs = handles_of(P, m)
            if len(hs) != 2:
                continue
            level = all(abs(P[h][1] - q[1]) < 0.5 for h in hs)  # a height: moves level only
        nb = [P[prv][:2], P[nxt][:2]]
        box = [(min(a[ax] for a in nb + [q[:2]]), max(a[ax] for a in nb + [q[:2]])) for ax in (0, 1)]
        base = [list(Q) for Q in N]

        def moved(dx, dy):
            M = [list(Q) for Q in base]
            if cut is None and not (box[0][0] <= q[0] + dx <= box[0][1] and box[1][0] <= q[1] + dy <= box[1][1]):
                return None
            for h in [m] + hs:
                p = M[ci][h]
                M[ci][h] = (p[0] + dx, p[1] + dy) + tuple(p[2:])
            return M

        def cost(M):
            d_, o_ = short(M)
            return float((d_ ** 2).sum() + (o_ ** 2).sum())
        before = float(short(base)[0].sum())
        c0 = cost(base)
        dx = dy = 0
        c_ = c0
        tt = 0
        for step in (8, 4, 2, 1):
            for _ in range(12):
                moved_ = False
                if cut is not None:                            # along the cut, longer only
                    steps = [(round(cut[0] * (tt + step)) - dx, round(cut[1] * (tt + step)) - dy)]
                else:
                    steps = [(step, 0), (-step, 0), (0, step), (0, -step)]
                for ddx, ddy in steps:
                    if level and ddy:
                        continue
                    M = moved(dx + ddx, dy + ddy)
                    if M is None:
                        continue
                    cn = cost(M) + 0.25 * ((dx + ddx) ** 2 + (dy + ddy) ** 2)
                    if cn < c_ - 1e-9:
                        dx, dy, c_, moved_ = dx + ddx, dy + ddy, cn, True
                        tt += step if cut is not None else 0
                        break
                if not moved_:
                    break
        while (dx, dy) != (0, 0):                              # no new turn, no new crossing: back towards none
            M = moved(dx, dy)
            if M is not None and len(X.turns(R, R, M, AA.FILLET_SMALL, AA.FILLET_MAX)) <= turns0 \
                    and len(X.crossings(R, R, M)) <= crossings0:
                N = M
                log.append((ci, m, (dx, dy), round(before, 1), round(float(short(N)[0].sum()), 1)))
                break
            if cut is not None:
                tt = tt // 2
                dx, dy = round(cut[0] * tt), round(cut[1] * tt)
            else:
                dx, dy = int(dx / 2), int(dy / 2)
    return N, log


# ---------------------------------------------------------------- a slanted stem with one straight side (0.81, close)

SLANT_STEM = (5.0, 35.0)       # degrees off upright: a stem drawn slanted, not a diagonal (v w x: 18 to 28 is
                               # theirs, but their other side is a line too, read by bold.diagonals)


def slanted_stems(R, least_len=100.0):
    """Strokes whose one side is a straight slanted line and whose other side is a curve's upright extreme facing it
    across the ink (the a of @: its stem's right side a line 15 degrees off upright, its left side the counter's
    right extreme). The engine reads a stroke between two knots on one scan line; a line has no knot at the
    extreme's height, so no stroke was read there and the counter rode the knots round it. [(contour of the
    extreme, its node, contour of the line, its start node, its end node, width in R)]."""
    import bold as B
    polys = B.polys(R)
    out = []
    for lc, P in enumerate(R):
        on = [k for k, q in enumerate(P) if q[2] is not None]
        for k, i in enumerate(on):
            j = on[(k + 1) % len(on)]
            if P[j][2] != "line":
                continue
            a, b = P[i][:2], P[j][:2]
            L = math.dist(a, b)
            if L < least_len or abs(a[1] - b[1]) < 1e-6:
                continue
            ang = math.degrees(math.atan2(abs(b[0] - a[0]), abs(b[1] - a[1])))
            if not SLANT_STEM[0] <= ang <= SLANT_STEM[1]:
                continue
            ylo, yhi = sorted((a[1], b[1]))
            for ec, Q in enumerate(R):
                n = len(Q)
                for m, q in enumerate(Q):
                    if q[2] is None or not q[3]:
                        continue
                    h0, h1 = Q[(m - 1) % n], Q[(m + 1) % n]
                    if h0[2] is not None or h1[2] is not None or abs(h0[0] - q[0]) > 0.5 or abs(h1[0] - q[0]) > 0.5:
                        continue                                # an upright extreme: both handles upright
                    if not ylo + 10 < q[1] < yhi - 10:
                        continue
                    xl = a[0] + (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1])
                    lo, hi = sorted((q[0], xl))
                    for s0, s1 in B.scan(polys, q[1], 1):
                        if abs(s0 - lo) <= 1.5 and abs(s1 - hi) <= 1.5 and hi - lo >= 20:
                            out.append((ec, m, lc, i, j, hi - lo))
    return out


def _slant_width(N, ec, m, lc, i, j):
    a, b = N[lc][i][:2], N[lc][j][:2]
    q = N[ec][m]
    xl = a[0] + (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1])
    return xl - q[0]


def keep_slanted_stems(R, N, target):
    """0.81 (close): a slanted stem with one straight side (slanted_stems) is a stroke like any other: its width at
    the facing extreme's height, read level as the engine reads every stroke, takes the engine's own target for it
    (target(width in R), bold.x_target for a straight stroke). The extreme moves level, and the points of its
    contour between it and the contour's far extreme by their share of the move (the engine's knot map, corrected
    at the knot it lacked); the line stays where the engine put it. Returns contours and [(contour, node, before,
    target, after)]."""
    N = [list(P) for P in N]
    log = []
    for ec, m, lc, i, j, w0 in slanted_stems(R):
        want = target(w0)
        if want is None:
            continue
        sgn = 1 if _slant_width(R, ec, m, lc, i, j) > 0 else -1
        got = sgn * _slant_width(N, ec, m, lc, i, j)
        d = got - want                                         # > 0: too wide, the extreme moves towards the line
        if abs(d) < 1.0:
            continue
        dx = sgn * d                                           # the extreme's move (towards the line when too wide)
        # the knot map, corrected at this knot: every point of the extreme's own contour (nodes and handles) whose x
        # the engine took between the contour's far upright extreme and this one moves by its share of the move,
        # read by its x in the Regular, as the engine's map interpolates between knots (so a curve between two
        # moved nodes is stretched, not bent: its handles keep their share of it); the far extreme stays
        P0 = R[ec]
        ext = [k for k, q in enumerate(P0) if q[2] is not None and q[3] and P0[(k - 1) % len(P0)][2] is None
               and P0[(k + 1) % len(P0)][2] is None and abs(P0[(k - 1) % len(P0)][0] - q[0]) < 0.5
               and abs(P0[(k + 1) % len(P0)][0] - q[0]) < 0.5 and k != m]
        xe = P0[m][0]
        far = [k for k in ext if (P0[k][0] - xe) * sgn < 0]   # on the side away from the line
        x_far = max((P0[k][0] for k in far), key=lambda x: abs(x - xe)) if far else None
        moves = {}
        for k, q in enumerate(P0):
            if abs(q[0] - xe) < 0.5:
                w_ = 1.0                                       # the extreme and its upright handles
            elif x_far is None or not min(x_far, xe) < q[0] < max(x_far, xe):
                continue
            else:
                w_ = (q[0] - x_far) / (xe - x_far)
            moves[k] = round(dx * w_)
        for h, ddx in moves.items():
            q = N[ec][h]
            N[ec][h] = (q[0] + ddx, q[1]) + tuple(q[2:])
        log.append((ec, m, round(got, 1), round(want, 1), round(sgn * _slant_width(N, ec, m, lc, i, j), 1)))
    return N, log
