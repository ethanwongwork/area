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


def thinnest(polys, step=4):
    """The thinnest cut that is a stroke: bold.thinnest, which the Bold's marks are held to as well."""
    return B.thinnest(polys, step)


def sweep(reg, master, mids, ts, tm, tip_at, fails, lighter=False):
    """Every glyph at each (weight, t): t is the share of the way from the Regular to `master`. Towards the Bold a
    stroke may not be thinner than in the Regular (or than the serif tip at that weight) and the ink never steps
    back; towards the Light (lighter) no stroke may be thinner than a serif's tip is at that weight unless it
    was thinner than a tip in the Regular, when it thins as the tip does, and the ink never steps up."""
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
        mc = contours_of(mids[name]) if name in mids else None
        shift = min(q[0] for P in bc for q in P) - min(q[0] for P in rc for q in P)
        far = max(max(abs(b[0] - shift - a[0]) / 320, abs(b[1] - a[1]) / 140) for P, Q in zip(rc, bc) for a, b in zip(P, Q))
        if far > 1:
            fails["moved"].append(f"{name} ({far:.1f} x the bound)")
        base_turns = [turns(c) for c in curves(rc)]
        small = [float(np.abs(c[3] - c[0]).max()) < 12 for c in curves(rc)]
        rp = flat(rc)
        base_cross = crossings(rp)
        base_thin = thinnest(rp)
        a0, l0 = area_len(rp)
        prev = (2 * a0 / l0, a0) if lighter else None
        for w, t in ts:
            if mc is None:
                ic = lerp(rc, bc, t)
            else:
                ic = lerp(rc, mc, t / tm) if t <= tm else lerp(mc, bc, (t - tm) / (1 - tm))
            if t > 0:
                for k, c in enumerate(curves(ic)):
                    if small[k]:                               # a corner's fillet in the Regular is one at every
                        if float(np.abs(c[3] - c[0]).max()) > FILLET_MAX:   # weight, while it stays a fillet
                            fails["turns"].append(f"{name} at {w} (curve {k}: a corner's fillet grew to {float(np.abs(c[3] - c[0]).max()):.0f})")
                            break
                        continue
                    got = turns(c)
                    if any(a > b for a, b in zip(got, base_turns[k])):
                        fails["turns"].append(f"{name} at {w} (curve {k}: extremes and inflections {base_turns[k]} > {got})")
                        break
            ip = flat(ic)
            x = crossings(ip)
            if x > base_cross:
                fails["crossings"].append(f"{name} at {w} ({base_cross} > {x})")
            th = thinnest(ip)
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
    reg = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    bold = ufoLib2.Font.open("build/AreaSerif-Bold.ufo")
    stem = int(sys.argv[1]) if len(sys.argv) > 1 else B.STEM
    v = B.vector(stem)
    mids = bold.layers["mid"] if "mid" in bold.layers else {}
    tm = (dict(B.axis_map(stem))[B.MID_WEIGHT] - B.REG_STEM) / (stem - B.REG_STEM)
    ts = [(w, (st - B.REG_STEM) / (stem - B.REG_STEM)) for w, st in B.axis_map(stem, STOPS)]
    keys = ("moved", "turns", "crossings", "thin", "monotone", "composite")
    fails = {k: [] for k in keys}
    n_out, n_comp = sweep(reg, bold, mids, ts, tm, lambda t: 30 * (1 + (v["tip"] - 1) * t), fails)
    bad = report(f"weight axis, stem {stem}: {n_out} outlined glyphs and {n_comp} composites, {len(STOPS)} stops ({STOPS[0]} to {STOPS[-1]})",
                 fails, "build/weight/audit-axis.txt")
    if os.path.exists("build/AreaSerif-Light.ufo"):            # 0.80: the Light side, 375 down to 300
        light = ufoLib2.Font.open("build/AreaSerif-Light.ufo")
        lv = B.vector(B.LIGHT_STEM)
        lts = [(w, (B.REG_STEM - st) / (B.REG_STEM - B.LIGHT_STEM)) for w, st in B.axis_map(stem, LIGHT_STOPS)]
        lfails = {k: [] for k in keys}
        sweep(reg, light, {}, lts, 1, lambda t: 30 * (1 + (lv["tip"] - 1) * t), lfails, lighter=True)
        bad += report(f"weight axis, Light stem {B.LIGHT_STEM}: {len(LIGHT_STOPS)} stops ({LIGHT_STOPS[0]} down to {LIGHT_STOPS[-1]})",
                      lfails, "build/weight/audit-axis-light.txt")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
