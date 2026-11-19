"""Area Serif 0.84 (Regular pass 2, crossing construction): x and X are two straight strokes, each one stroke through
the other, in every master.

The stroke audit read x's thin 36.1 / 38.0 and thick 72.6 / 72.3 (its two halves) against v's 39.2 / 74.3, and X's thin
42.2 / 43.1 against the capital thin diagonals' 48 (A V W M Y): balance.diag had set each at one height, and each half
of a crossing stroke is its own pair of lines. 0.84's first try set the halves apart (hair.DIAG_HALVES) and the masters
then turned X between them and failed the Bold x in audit_bold. This is the construction instead.

A crossing letter is two strokes. Each stroke is a centreline direction and a width: its two sides are two parallel
lines, each ONE line through the crossing (both arms of a side lie on it), the crossing's four corners where the sides
of the two strokes meet. The widths are the class's (x: v's thick and thin, read on the same font across v's parallel
edges; X: V's, the capital thick and thin diagonals). The serif-end openings are kept (the owner's choice for x): of each
side's two arm pieces, the one facing the top or bottom white keeps its serif end (the bracket's start) where it was;
the side's direction follows from that point, the other side's and the width. The other serif ends slide along their
new line at their own height; each bracket's first handle turns onto its line, its length kept. Nothing else moves.

In a master the same construction runs on the master's own x and X (after the engine and its crossing rules), with the
master's own v and V widths."""
import math

import numpy as np

NAMES = {"x": "v", "X": "V"}
MIN_PIECE = 60


def _pts(g):
    return [[[p.x, p.y, p.type, p.smooth] for p in c.points] for c in g.contours]


def across(g, sign, min_len=100):
    """A slanted stroke's width: its two longest straight edges leaning that way (sign +1: rising to the right), the
    mean of each edge's middle's distance to the other's line (hair.across, without requiring them parallel: a
    master's v tapers a little)."""
    L = []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i in range(n):
            a, b = P[i], P[(i + 1) % n]
            if b.type != "line" or a.type is None:
                continue
            dx, dy = b.x - a.x, b.y - a.y
            ln = math.hypot(dx, dy)
            if ln < min_len or abs(dy) < 1 or not 0.15 < abs(dx / dy) < 5 or (dx * dy > 0) != (sign > 0):
                continue
            L.append((ln, np.array([a.x, a.y], float), np.array([b.x, b.y], float)))
    L.sort(key=lambda t: -t[0])
    for i in range(len(L)):
        for j in range(i + 1, len(L)):
            (l1, a1, b1), (l2, a2, b2) = L[i], L[j]
            u1, u2 = (b1 - a1) / l1, (b2 - a2) / l2
            m1, m2 = (a1 + b1) / 2, (a2 + b2) / 2
            w1 = abs((m2 - a1)[0] * u1[1] - (m2 - a1)[1] * u1[0])
            w2 = abs((m1 - a2)[0] * u2[1] - (m1 - a2)[1] * u2[0])
            if 20 < (w1 + w2) / 2 < 200:
                return round((w1 + w2) / 2, 1)
    return None


def pieces(P):
    """The crossing's corners and its eight straight pieces: [(corner index, far index, other neighbour of far)]."""
    n = len(P)
    out = []
    for k in range(n):
        if P[k][2] != "line":
            continue
        a, b = (k - 1) % n, (k + 1) % n
        if P[a][2] is None or P[b][2] != "line":
            continue
        la = math.hypot(P[a][0] - P[k][0], P[a][1] - P[k][1])
        lb = math.hypot(P[b][0] - P[k][0], P[b][1] - P[k][1])
        if la < MIN_PIECE or lb < MIN_PIECE:
            continue
        sa = (P[a][1] - P[k][1]) * (P[a][0] - P[k][0])
        sb = (P[b][1] - P[k][1]) * (P[b][0] - P[k][0])
        if sa * sb >= 0:
            continue
        out.append(k)
    return out


def construct(P, w_thick, w_thin, info=None):
    """P: the letter's one contour [[x, y, type, smooth]]; returns new P."""
    n = len(P)
    cs = pieces(P)
    if len(cs) != 4:
        raise ValueError(f"cross: {len(cs)} crossing corners, not 4")
    centre = np.mean([P[k][:2] for k in cs], axis=0)
    pcs = []                                    # (corner, far, handle beyond far)
    for k in cs:
        for far, step in (((k - 1) % n, -1), ((k + 1) % n, 1)):
            h = (far + step) % n
            pcs.append(dict(corner=k, far=far, handle=h if P[h][2] is None else None))
    for p in pcs:
        a, b = np.array(P[p["corner"]][:2], float), np.array(P[p["far"]][:2], float)
        p["slope"] = (b[1] - a[1]) * (b[0] - a[0])
        p["mid"] = (a + b) / 2
    out = [list(q) for q in P]
    rep = {}
    lines = {}
    for name, sel, W in (("thick", lambda p: p["slope"] < 0, w_thick), ("thin", lambda p: p["slope"] > 0, w_thin)):
        ps = [p for p in pcs if sel(p)]
        if len(ps) != 4:
            raise ValueError(f"cross: {name} has {len(ps)} pieces")
        dirs = []
        for p in ps:
            d = np.array(P[p["far"]][:2], float) - np.array(P[p["corner"]][:2], float)
            d /= np.hypot(*d)
            dirs.append(d if d[1] > 0 else -d)
        u0 = np.mean(dirs, axis=0)
        u0 /= np.hypot(*u0)
        nrm = np.array([-u0[1], u0[0]])
        for p in ps:
            p["side"] = 1 if (p["mid"] - centre) @ nrm > 0 else -1
        sides = {}
        for s in (1, -1):
            two = [p for p in ps if p["side"] == s]
            if len(two) != 2:
                raise ValueError(f"cross: {name} side {s} has {len(two)} pieces")
            # the piece facing the top or bottom white: its outward normal points towards the crossing's x
            fixed = None
            for p in two:
                outn = nrm * s
                if (centre[0] - P[p["far"]][0]) * outn[0] > 0:
                    fixed = p
            if fixed is None:
                raise ValueError(f"cross: {name} side {s}: no opening piece ({[p['mid'].round().tolist() for p in two]}, centre {centre.round().tolist()}, normal {nrm.round(2).tolist()})")
            sides[s] = (two, np.array(P[fixed["far"]][:2], float), fixed)
        a_, b_ = sides[1][1], sides[-1][1]
        d = b_ - a_
        D, phi = np.hypot(*d), math.atan2(d[1], d[0])
        th0 = math.atan2(u0[1], u0[0])
        cands = []
        for sg in (1, -1):
            th = phi + sg * math.asin(min(1.0, W / D))
            for kpi in (0, math.pi, -math.pi):
                cands.append(th + kpi)
        th = min(cands, key=lambda t: abs((t - th0 + math.pi) % (2 * math.pi) - math.pi))
        u = np.array([math.cos(th), math.sin(th)])
        if u[1] < 0:
            u = -u
        was = across_pts(P, ps)
        for s in (1, -1):
            lines[(name, s)] = (sides[s][1], u)
            for p in sides[s][0]:
                p["line"] = (sides[s][1], u)
        rep[name] = (round(was, 1) if was else None, round(W, 1), round(math.degrees(th - th0), 2))
    # the corners: where the two sides through them meet
    for k in cs:
        two = [p for p in pcs if p["corner"] == k]
        (p1, u1), (p2, u2) = two[0]["line"], two[1]["line"]
        den = u1[0] * u2[1] - u1[1] * u2[0]
        t = ((p2 - p1)[0] * u2[1] - (p2 - p1)[1] * u2[0]) / den
        c = p1 + t * u1
        best = None                              # whole units: of the four nearest, the one nearest both lines
        for fx in (math.floor, math.ceil):
            for fy in (math.floor, math.ceil):
                q = np.array([fx(c[0]), fy(c[1])], float)
                e = max(abs((q - p1)[0] * u1[1] - (q - p1)[1] * u1[0]), abs((q - p2)[0] * u2[1] - (q - p2)[1] * u2[0]))
                if best is None or e < best[0]:
                    best = (e, q)
        out[k][0], out[k][1] = int(best[1][0]), int(best[1][1])
    # the serif ends: on their line at their own height; the bracket's first handle onto the line
    for p in pcs:
        p0, u = p["line"]
        f = np.array(P[p["far"]][:2], float)
        t = (f[1] - p0[1]) / u[1]
        nf = p0 + t * u
        out[p["far"]][0], out[p["far"]][1] = round(float(nf[0])), round(float(nf[1]))
        if p["handle"] is not None:
            h = np.array(P[p["handle"]][:2], float)
            L = np.hypot(*(h - f))
            dd = u if (h - f) @ u > 0 else -u
            f2 = np.array(out[p["far"]][:2], float)
            # the bracket's other end: the handle stays short of where the two handles' lines meet (pathlint)
            step = 1 if (p["handle"] - p["far"]) % n == 1 else -1
            h2i, endi = (p["handle"] + step) % n, (p["handle"] + 2 * step) % n
            e2, h2 = np.array(out[endi][:2], float), np.array(out[h2i][:2], float)
            v2 = h2 - e2
            den = dd[0] * v2[1] - dd[1] * v2[0]
            if abs(den) > 1e-9:
                tm = ((e2 - f2)[0] * v2[1] - (e2 - f2)[1] * v2[0]) / den
                if 0 < tm < L / 0.95:
                    L = 0.95 * tm
            nh = f2 + L * dd
            out[p["handle"]][0], out[p["handle"]][1] = round(float(nh[0])), round(float(nh[1]))
            if abs(den) > 1e-9:                  # and the other handle short of it too (the far end moved along)
                meet = f2 + tm * dd
                if (meet - e2) @ v2 > 0 and np.hypot(*v2) > 0.95 * np.hypot(*(meet - e2)):
                    nh2 = e2 + 0.95 * (meet - e2)
                    out[h2i][0], out[h2i][1] = round(float(nh2[0])), round(float(nh2[1]))
    if info is not None:
        info.update(rep)
    return [tuple(q) for q in out]


def across_pts(P, ps):
    try:
        L = []
        for p in ps:
            a, b = np.array(P[p["corner"]][:2], float), np.array(P[p["far"]][:2], float)
            L.append((a, b))
        (a1, b1), = [L[0]]
        u = (b1 - a1) / np.hypot(*(b1 - a1))
        ws = [abs((a2 - a1)[0] * u[1] - (a2 - a1)[1] * u[0]) for a2, b2 in L[1:]]
        return max(ws)
    except Exception:  # noqa: BLE001
        return None


def widths(font, name):
    g = font[NAMES[name]]
    return across(g, -1), across(g, 1)


def run(font, names=None, ref=None):
    """x and X on this font: thick and thin the class's (read on v and V of the same font)."""
    from ufoLib2.objects import Point
    log = []
    for name in NAMES:
        if names is not None and name not in names or name not in font:
            continue
        g = font[name]
        if len(g.contours) != 1:
            log.append(f"{name}: not one contour"); continue
        wt, wn = widths(font, name)
        if not wt or not wn:
            log.append(f"{name}: no class widths"); continue
        info = {}
        Q = construct(_pts(g)[0], wt, wn, info)
        g.contours[0].points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in Q]
        log.append(f"{name}: thick {wt:.1f}, thin {wn:.1f} ({info})")
    return log


def regular(font):
    return run(font)


def master(reg, font, struck=()):
    names = [n for n in NAMES if n in reg and n in font and n not in struck
             and [len(c.points) for c in font[n].contours] == [len(c.points) for c in reg[n].contours]]
    return "crossing construction: " + "; ".join(run(font, names)), names


def check(P):
    """Per stroke: (width between its side lines at each arm, each side's two pieces' angle apart and offset)."""
    n = len(P)
    cs = pieces(P)
    out = {}
    pcs = []
    centre = np.mean([P[k][:2] for k in cs], axis=0)
    for k in cs:
        for far in ((k - 1) % n, (k + 1) % n):
            a, b = np.array(P[k][:2], float), np.array(P[far][:2], float)
            pcs.append((a, b, (b[1] - a[1]) * (b[0] - a[0])))
    for name, sel in (("thick", lambda s: s < 0), ("thin", lambda s: s > 0)):
        ps = [(a, b) for a, b, s in pcs if sel(s)]
        u0 = np.mean([((b - a) / np.hypot(*(b - a))) * (1 if (b - a)[1] > 0 else -1) for a, b in ps], axis=0)
        nrm = np.array([-u0[1], u0[0]]) / np.hypot(*u0)
        sides = {1: [], -1: []}
        for a, b in ps:
            sides[1 if ((a + b) / 2 - centre) @ nrm > 0 else -1].append((a, b))
        res = []
        for s in (1, -1):
            (a1, b1), (a2, b2) = sides[s]
            u1, u2 = (b1 - a1) / np.hypot(*(b1 - a1)), (b2 - a2) / np.hypot(*(b2 - a2))
            ang = math.degrees(math.asin(abs(u1[0] * u2[1] - u1[1] * u2[0])))
            Q4 = np.array([a1, b1, a2, b2])            # one line through the side's four ends: the largest miss
            mu = Q4.mean(0)
            _u, _s, vt = np.linalg.svd(Q4 - mu)
            nn = vt[1]
            off = float(np.abs((Q4 - mu) @ nn).max())
            res.append((round(ang, 2), round(off, 2)))
        ws = []
        for (a, b) in sides[1]:
            m = (a + b) / 2
            a2, b2 = max(sides[-1], key=lambda ab: -np.hypot(*((ab[0] + ab[1]) / 2 - m)))
            u = (b2 - a2) / np.hypot(*(b2 - a2))
            ws.append(round(abs((m - a2)[0] * u[1] - (m - a2)[1] * u[0]), 1))
        out[name] = dict(widths=ws, sides=res)
    return out


def mid(reg, font, layer, tm):
    """The sparse mid master (towards the Bold): x and X built again at the readings that far along (points and
    widths interpolated between the Regular and this master, then the construction), so the crossing's corners stay
    on their sides between the masters (audit_axis drift: half way from 400 to 800 a corner left its line by 1.4)."""
    from ufoLib2.objects import Contour, Point
    log = []
    if layer is None or tm is None:
        return log
    for name in NAMES:
        if name not in reg or name not in font or len(font[name].contours) != 1:
            continue
        R, M = _pts(reg[name])[0], _pts(font[name])[0]
        if [q[2] for q in R] != [q[2] for q in M]:
            continue
        P = [[a[0] + (b[0] - a[0]) * tm, a[1] + (b[1] - a[1]) * tm, a[2], a[3]] for a, b in zip(R, M)]
        (wt0, wn0), (wt1, wn1) = widths(reg, name), widths(font, name)
        wt, wn = wt0 + (wt1 - wt0) * tm, wn0 + (wn1 - wn0) * tm
        Q = construct(P, wt, wn)
        g = layer[name] if name in layer else layer.newGlyph(name)
        g.clearContours()
        c = Contour()
        c.points = [Point(round(x), round(y), t, smooth=s_) for x, y, t, s_ in Q]
        g.contours.append(c)
        g.width = round(reg[name].width + (font[name].width - reg[name].width) * tm)
        log.append(f"{name} mid master at {tm:.3f} (thick {wt:.1f}, thin {wn:.1f})")
    return log
