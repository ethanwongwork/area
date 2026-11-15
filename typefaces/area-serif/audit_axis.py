"""Area Serif: the weight axis, every glyph, every 25 units. Checks that need none of the Regular's numbers.

    .venv/bin/python audit_axis.py            (reads build/AreaSerif-Regular.ufo and build/AreaSerif-Bold.ufo)

audit_bold.py measures the letters' and figures' parts against targets. This looks at all 1,038 glyphs, on the
instance between the masters' own points (through the sparse master at bold.MID_WEIGHT where a glyph has one), for
what no rule may do whatever the glyph is:

  moved      no point of the Bold further from the Regular's than a rule can move it (bold.sound's bound)
  turns      no curve gains an extreme or an inflection the Regular's curve does not have
  crossings  no outline crosses itself or another more often than in the Regular (the Regular keeps its overlaps)
  thin       no stroke thinner than it is in the Regular, unless it is still at least the serif tip at that weight
  monotone   the glyph's mean stroke (2 x area / outline length) and its ink never step back as weight rises
  composite  every component still points at a glyph, with the Regular's transform apart from its offset

A slashed letter whose points flew thousands of units off (0.76's first build) fails `moved`, `crossings` and
`monotone` here; the letters-only sweep never saw it.
"""
import math
import sys

import numpy as np
import ufoLib2

import bold as B

STOPS = list(range(400, 701, 25))
LIGHT_STOPS = [375, 350, 325, 300]
FILLET_MAX = 20           # a softened corner (7 a side in the Regular) may grow with the stroke, not past this
FILLET_SMALL = 12         # a curve whose ends are this close in the Regular is a softened corner


def contours_of(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def lerp(A, C, u):
    return [[(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2], p[3]) for p, q in zip(P, Q)] for P, Q in zip(A, C)]


class _Q:
    def __init__(s, q):
        s.type = q[2]


def curves(contours):
    out = []
    for P in contours:
        for i, mid, j in B.segments([_Q(q) for q in P]):
            if len(mid) == 2:
                out.append(np.array([P[i][:2], P[mid[0]][:2], P[mid[1]][:2], P[j][:2]], dtype=float))
    return out


def turns(c):
    """(x extremes, y extremes, inflections) inside one cubic: bold.curve_turns, the count the Bold's guard uses."""
    return B.curve_turns(c)


def flat(contours, n=8):
    polys = []
    for P in contours:
        pts = []
        for i, mid, j in B.segments([_Q(q) for q in P]):
            if len(mid) == 2:
                c = [P[i][:2], P[mid[0]][:2], P[mid[1]][:2], P[j][:2]]
                pts += [B._bez(c, k / n) for k in range(n)]
            else:
                pts.append(P[i][:2])
        if len(pts) > 2:
            polys.append(pts)
    return polys


def crossings(polys):
    """How many pairs of edges cross (proper crossings; shared ends do not count)."""
    seg = []
    for p in polys:
        a = np.array(p, dtype=float)
        seg.append(np.hstack([a, np.roll(a, -1, axis=0)]))
    if not seg:
        return 0
    S = np.vstack(seg)
    ax, ay, bx, by = S[:, 0][:, None], S[:, 1][:, None], S[:, 2][:, None], S[:, 3][:, None]
    cx, cy, dx, dy = S[:, 0][None, :], S[:, 1][None, :], S[:, 2][None, :], S[:, 3][None, :]

    def orient(px, py, qx, qy, rx, ry):
        return (qx - px) * (ry - py) - (qy - py) * (rx - px)
    o1, o2 = orient(ax, ay, bx, by, cx, cy), orient(ax, ay, bx, by, dx, dy)
    o3, o4 = orient(cx, cy, dx, dy, ax, ay), orient(cx, cy, dx, dy, bx, by)
    eps = 1e-6
    hit = (o1 * o2 < -eps) & (o3 * o4 < -eps)
    return int(np.triu(hit, 1).sum())


def area_len(polys):
    a = length = 0.0
    for p in polys:
        q = np.array(p)
        r = np.roll(q, -1, axis=0)
        a += float(np.sum(q[:, 0] * r[:, 1] - r[:, 0] * q[:, 1])) / 2
        length += float(np.sum(np.hypot(*(r - q).T)))
    return abs(a), length


def thinnest(polys, step=4, points=()):
    """The thinnest cut that is a stroke: bold.thinnest's reading (an ink span whose neighbours two scan lines
    before and two after are spans of about the same width over the same place). 0.81: a cut that lies within one
    mean stroke of a pointed end (`points`: ink corners under 60 degrees, a wedge accent's tip, an arrow's point)
    is not a stroke's thickness: there the reading is how sharp the point is, which falls as a wedge flattens
    while every stroke of it gains weight (build/figures/axis-081/thin-at-points.png)."""
    if not points:
        return B.thinnest(polys, step)
    a, length = area_len(polys)
    reach = 2 * a / length if length else 0
    best = None
    pts = [q for p in polys for q in p]
    for ax in (0, 1):
        lo, hi = min(q[ax] for q in pts), max(q[ax] for q in pts)
        rows, vs = [], []
        v = lo + step / 2
        while v < hi:
            rows.append(B.scan(polys, v, ax))
            vs.append(v)
            v += step
        for k in range(2, len(rows) - 2):
            for a_, b_ in rows[k]:
                w = b_ - a_
                if best is not None and w >= best:
                    continue
                mid = ((a_ + b_) / 2, vs[k]) if ax == 1 else (vs[k], (a_ + b_) / 2)
                if any(math.dist(mid, p) < reach for p in points):
                    continue
                if all(any(min(b_, d) - max(a_, c) > 0.5 * w and abs((d - c) - w) <= 0.2 * w + 2 for c, d in rows[j])
                       for j in (k - 2, k - 1, k + 1, k + 2)):
                    best = w
    return best


def points_of(contours, max_deg=60):
    """Pointed ends: corner nodes where the ink's inside angle is under max_deg."""
    out = []
    for P in contours:
        n = len(P)
        area = sum(P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1] for i in range(n))
        for i, q in enumerate(P):
            if q[2] is None or q[3]:
                continue
            a, b = P[i - 1], P[(i + 1) % n]
            u = (a[0] - q[0], a[1] - q[1])
            w = (b[0] - q[0], b[1] - q[1])
            if not any(u) or not any(w):
                continue
            ang = math.degrees(math.acos(max(-1, min(1, (u[0] * w[0] + u[1] * w[1]) / (math.hypot(*u) * math.hypot(*w))))))
            cross = u[0] * w[1] - u[1] * w[0]
            if ang < max_deg and (cross < 0) == (area > 0):       # the ink lies inside the angle
                out.append(q[:2])
    return out


def sweep(reg, master, mids, ts, tm, tip_at, fails, lighter=False, w_of=None):
    """Every glyph between the Regular and `master`. ts: the stops [(weight, t)], t the share of the way from the
    Regular to `master`; w_of(t): the weight at a share. Towards the Bold a stroke may not be thinner than in the
    Regular (or than the serif tip at that weight) and the ink never steps back; towards the Light (lighter) no
    stroke may be thinner than a serif's tip is at that weight unless it was thinner than a tip in the Regular,
    when it thins as the tip does, and the ink never steps up.

    0.81: turns, crossings within a contour, counters and drift are tested over the whole of each master pair
    (Regular to the sparse master, sparse master to the Bold, or Regular to the master), not at the stops
    (axis_exact.py); crossings between contours are allowed where the union keeps the Regular's outer contours and
    holes (a stroke laid over its letter on purpose), and fail where it does not (two parts that collide)."""
    import axis_exact as X
    w_of = w_of or (lambda t: round(t, 3))
    n_out = n_comp = 0
    for g in reg:
        name = g.name
        if g.components:
            n_comp += 1
            bg = master[name]
            if [c.baseGlyph for c in g.components] != [c.baseGlyph for c in bg.components] or \
                    any(tuple(a.transformation)[:4] != tuple(b.transformation)[:4] for a, b in zip(g.components, bg.components)) or \
                    any(c.baseGlyph not in master for c in bg.components):
                fails["composite"].append(name)
        if not g.contours:
            continue
        n_out += 1
        rc, bc = contours_of(g), contours_of(master[name])
        if [[q[2] for q in P] for P in rc] != [[q[2] for q in P] for P in bc]:
            fails["moved"].append(f"{name} (not the Regular's points)")
            continue
        mc = contours_of(mids[name]) if name in mids else None
        shift = min(q[0] for P in bc for q in P) - min(q[0] for P in rc for q in P)
        far = max(max(abs(b[0] - shift - a[0]) / 320, abs(b[1] - a[1]) / 140) for P, Q in zip(rc, bc) for a, b in zip(P, Q))
        if far > 1:
            fails["moved"].append(f"{name} ({far:.1f} x the bound)")
        pairs = [(rc, bc, 0.0, 1.0)] if mc is None else [(rc, mc, 0.0, tm), (mc, bc, tm, 1.0)]
        for A, C, t0, t1 in pairs:
            at = lambda s: w_of(t0 + s * (t1 - t0))            # noqa: E731
            for k, s_, why in X.turns(rc, A, C, FILLET_SMALL, FILLET_MAX):
                fails["turns"].append(f"{name} at {at(s_)} (curve {k}: {why})")
            for ci, s_, b0, b1 in X.crossings(rc, A, C):
                fails["crossings"].append(f"{name} at {at(s_)} (contour {ci} crosses itself: {b0} > {b1})")
            for ci, s_ in X.counters(rc, A, C):
                fails["counter"].append(f"{name} at {at(s_)} (contour {ci}'s area reaches zero)")
            for ci, k, d, own in X.drift(rc, A, C):
                fails["drift"].append(f"{name} at {at(0.5)} (contour {ci} node {k} leaves its line by {d} half way; masters {own})")
        # 0.81: a symmetric sign changes symmetrically: each point's move (less the glyph's whole shift) is its
        # mirror or turned image's, within a unit, at the master (so at every weight between, moves being linear)
        if g.unicodes and __import__("unicodedata").category(chr(g.unicodes[0]))[:1] in ("P", "S"):
            for M, c_, jj, sname in B.symmetries(rc):
                A0 = np.array([q[:2] for P in rc for q in P], float)
                mv = np.array([q[:2] for P in bc for q in P], float) - A0
                ok = jj >= 0
                paired = np.all([j_ >= 0 for _, _, j_, _ in B.symmetries(rc)], axis=0)
                mv -= mv[paired].mean(axis=0) if paired.any() else mv.mean(axis=0)
                diff = np.abs(mv[jj[ok]] @ M - mv[ok]).max() if ok.any() else 0.0
                if diff > 1.5:                                 # a unit, and half a unit: a mean of whole-unit moves, rounded
                    fails["symmetry"].append(f"{name} at {w_of(1.0)} ({sname}: a point's move differs from its image's by {diff:.1f})")
        rp = flat(rc)
        base_topo = X.topology([np.array(p) for p in rp]) if len(rc) > 1 else None
        base_thin = thinnest(rp, points=points_of(rc))
        a0, l0 = area_len(rp)
        prev = (2 * a0 / l0, a0) if lighter else None
        mids_t = [((t0 + t1) / 2) for _, _, t0, t1 in pairs]
        for w, t in sorted(ts + [(w_of(t), t) for t in mids_t], key=lambda x: x[1]):
            if mc is None:
                ic = lerp(rc, bc, t)
            else:
                ic = lerp(rc, mc, t / tm) if t <= tm else lerp(mc, bc, (t - tm) / (1 - tm))
            ip = flat(ic)
            if base_topo is not None:
                topo = X.topology([np.array(p) for p in ip])
                if topo != base_topo:
                    fails["crossings"].append(f"{name} at {w} (parts meet: outer contours and holes {base_topo} > {topo})")
            if (w, t) not in ts:
                continue
            th = thinnest(ip, points=points_of(ic))
            tip = tip_at(t)
            floor = min(base_thin, tip) if not lighter or base_thin is None else min(base_thin, 30) * tip / 30
            if base_thin is not None and th is not None and th < floor - 1.0:
                fails["thin"].append(f"{name} at {w} ({base_thin:.0f} > {th:.0f}, tip {tip:.0f})")
            a, length = area_len(ip)
            ms = 2 * a / length
            if prev and not lighter and (ms < prev[0] - 0.3 or a < prev[1] - 1.0):
                fails["monotone"].append(f"{name} at {w} (mean stroke {prev[0]:.1f} > {ms:.1f})")
            if prev and lighter and (ms > prev[0] + 0.3 or a > prev[1] + 1.0):
                fails["monotone"].append(f"{name} at {w} (mean stroke {prev[0]:.1f} < {ms:.1f} as weight falls)")
            prev = (ms, a)
    return n_out, n_comp


def report(title, fails, path):
    print(title)
    bad = 0
    for k, rows in fails.items():
        names = sorted({r.split(" ")[0] for r in rows})
        bad += len(names)
        print(f"  {k:10} {'ok' if not rows else str(len(names)) + ' glyphs: ' + '; '.join(rows[:6]) + (' ...' if len(rows) > 6 else '')}")
    with open(path, "w") as f:
        for k, rows in fails.items():
            f.writelines(f"{k}\t{r}\n" for r in rows)
    return bad


def main():
    import os
    import overlap as OVERLAP
    d = os.environ.get("AREA_AXIS_DIR", "build")              # another build's masters (a snapshot): its own lists
    out = "build/weight" if d == "build" else d
    reg = OVERLAP.vf_source(ufoLib2.Font.open(f"{d}/AreaSerif-Regular.ufo"))   # 0.81: as the variable font has it
    bold = ufoLib2.Font.open(f"{d}/AreaSerif-Bold.ufo")
    stem = int(sys.argv[1]) if len(sys.argv) > 1 else B.STEM
    v = B.vector(stem)
    mids = bold.layers["mid"] if "mid" in bold.layers else {}
    tm = (dict(B.axis_map(stem))[B.MID_WEIGHT] - B.REG_STEM) / (stem - B.REG_STEM)
    ts = [(w, (st - B.REG_STEM) / (stem - B.REG_STEM)) for w, st in B.axis_map(stem, STOPS)]
    keys = ("moved", "turns", "crossings", "counter", "drift", "symmetry", "thin", "monotone", "composite")
    q = stem / B.REG_STEM
    w_bold = lambda t: round(400 + 300 * math.log((B.REG_STEM + t * (stem - B.REG_STEM)) / B.REG_STEM) / math.log(q))   # noqa: E731
    w_light = lambda t: round(400 - 100 * math.log(B.REG_STEM / (B.REG_STEM - t * (B.REG_STEM - B.LIGHT_STEM))) / math.log(B.REG_STEM / B.LIGHT_STEM))   # noqa: E731
    fails = {k: [] for k in keys}
    n_out, n_comp = sweep(reg, bold, mids, ts, tm, lambda t: 30 * (1 + (v["tip"] - 1) * t), fails, w_of=w_bold)
    bad = report(f"weight axis, stem {stem}: {n_out} outlined glyphs and {n_comp} composites, {len(STOPS)} stops ({STOPS[0]} to {STOPS[-1]})",
                 fails, f"{out}/audit-axis.txt")
    if os.path.exists(f"{d}/AreaSerif-Light.ufo"):              # 0.80: the Light side, 375 down to 300
        light = ufoLib2.Font.open(f"{d}/AreaSerif-Light.ufo")
        lv = B.vector(B.LIGHT_STEM)
        lts = [(w, (B.REG_STEM - st) / (B.REG_STEM - B.LIGHT_STEM)) for w, st in B.axis_map(stem, LIGHT_STOPS)]
        lfails = {k: [] for k in keys}
        sweep(reg, light, {}, lts, 1, lambda t: 30 * (1 + (lv["tip"] - 1) * t), lfails, lighter=True, w_of=w_light)
        bad += report(f"weight axis, Light stem {B.LIGHT_STEM}: {len(LIGHT_STOPS)} stops ({LIGHT_STOPS[0]} down to {LIGHT_STOPS[-1]})",
                      lfails, f"{out}/audit-axis-light.txt")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
