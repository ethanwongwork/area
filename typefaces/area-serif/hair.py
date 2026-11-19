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
