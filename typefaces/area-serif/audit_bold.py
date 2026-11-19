"""Area Serif Bold: every letter's parts measured on the Bold's own outlines, against their targets. Fails on a miss.

    .venv/bin/python audit_bold.py [stem] [glyph ...]        (default: 140, the 52 letters and the figures)

bold.py says where each of the Regular's parts went; this goes there and measures what the Bold's outline has, the
way audit_parts.py reads the Regular: a scan line across each upright or level stroke and counter (the widest cut,
which on a round stroke is its extreme), a serif's reach from a scan through its slab, the distance between a
slanted stroke's two edges through the Bold's nodes, parts.joins_of for necks, bounds for heights and dots. The
target is the rule for the part's class applied to the Regular's measured value.
"""
import math
import string
import sys

import ufoLib2

import bold as B

TOL = dict(stroke=1.0, counter=1.5, diagonal=1.5, neck=1.5, dot=2.0, reach=1.5)
FIGURES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]


def _cut(pl, ax, positions, lo_at, hi_at, reach=6):
    """The ink span, over scan lines at `positions`, whose two ends come nearest the two places the stroke's edges
    should be (a stroke is measured where it is itself: a round stroke at its extreme). Its width."""
    best = None
    for p in positions:
        for lo, hi in B.scan(pl, p, ax):
            off = abs(lo - lo_at) + abs(hi - hi_at)
            if abs(lo - lo_at) <= reach and abs(hi - hi_at) <= reach and (best is None or off < best[0]):
                best = (off, hi - lo)
    return best[1] if best else None


def _gap(pl, positions, a, b, reach=6):
    """The gap between two ink spans whose facing ends come nearest a and b (a counter is measured at its widest,
    where its two sides' extremes are)."""
    best = None
    for p in positions:
        sp = B.scan(pl, p, 1)
        for (l0, h0), (l1, h1) in zip(sp, sp[1:]):
            off = abs(h0 - a) + abs(l1 - b)
            if abs(h0 - a) <= reach and abs(l1 - b) <= reach and (best is None or off < best[0]):
                best = (off, l1 - h0)
    return best[1] if best else None


def _along(lo, hi, m, n=7):
    lo, hi = sorted((B._interp(m, lo), B._interp(m, hi)))
    return [lo + (hi - lo) * (i + 0.5) / n for i in range(n)]


def instance(rc, bc, v, t):
    """The glyph that far from the Regular towards the Bold: straight between the two, or through its master at
    bold.MID_WEIGHT where it has one."""
    lerp = lambda A, C, u: [[(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2], p[3]) for p, q in zip(P, Q)] for P, Q in zip(A, C)]   # noqa: E731
    mc = B.mid_master(rc, bc, v) if v["f"] > 0 else None    # the Light has no sparse master
    if mc is None:
        return lerp(rc, bc, t)
    tm = (dict(B.axis_map(v["stem"]))[B.MID_WEIGHT] - B.REG_STEM) / (v["stem"] - B.REG_STEM)
    return lerp(rc, mc, t / tm) if t <= tm else lerp(mc, bc, (t - tm) / (1 - tm))


def audit(reg, name, v, t=1.0):
    """t < 1: the instance that far from the Regular towards the Bold at v (every point and every place the engine
    reports, taken that share of the way), against the targets for the stem that far along."""
    rc = B.glyph_contours(reg[name])
    bc, width, rep = B.bold(rc, reg[name].width, v, name)
    if t < 1.0:
        bc = instance(rc, bc, v, t)
        rep = dict(rep, X={k: k + (x - k) * t for k, x in rep["X"].items()}, Y={k: k + (y - k) * t for k, y in rep["Y"].items()},
                   where={q: (q[0] + (w[0] - q[0]) * t, q[1] + (w[1] - q[1]) * t) for q, w in rep["where"].items()},
                   x=[r[:3] + (r[2] + (r[3] - r[2]) * t, r[2] + (r[4] - r[2]) * t, r[5]) if r[5] in ("counter", "opening", "serif reach") else r for r in rep["x"]])
        v = B.vector(B.REG_STEM + (v["stem"] - B.REG_STEM) * t)
    rows, bad = [], []

    def row(part, was, want, got, tol):
        ok = got is not None and abs(got - want) <= tol
        rows.append((name, part, was, round(want, 1), None if got is None else round(got, 1), "ok" if ok else "MISS"))
        if not ok:
            bad.append(f"{name}: {part} {was} > {None if got is None else round(got, 1)}, target {want:.1f}")
    if [[q[2] for q in P] for P in rc] != [[q[2] for q in P] for P in bc]:
        bad.append(f"{name}: not the Regular's points")
    body = [P for P in rc if not B.is_dot(P)]
    bbody = [P for P, R in zip(bc, rc) if not B.is_dot(R)]
    for P, Q in zip(rc, bc):
        if B.is_dot(P):
            w0 = max(q[0] for q in P) - min(q[0] for q in P)
            w1 = max(q[0] for q in Q) - min(q[0] for q in Q)
            h1 = max(q[1] for q in Q) - min(q[1] for q in Q)
            row("dot", w0, w0 * (v["dot"] if body else 1 + (B.DOT_ALONE["point"] - 1) * v["f"]), w1, TOL["dot"])
            if abs(w1 - h1) > 0.01:
                bad.append(f"{name}: a dot {w1} wide, {h1} tall")
    if not body:
        return rows, bad
    nodes = [q for P in body for q in P if q[2] is not None]
    xk, yk = sorted({q[0] for q in nodes}), sorted({q[1] for q in nodes})
    pl, bpl = B.polys(body), B.polys(bbody)
    by = [q[1] for P in bbody for q in P if q[2] is not None]
    if (min(by), max(by)) != (yk[0], yk[-1]):
        bad.append(f"{name}: height {yk[0]}..{yk[-1]} > {min(by)}..{max(by)}")
    X, Y = dict(rep["X"]), dict(rep["Y"])
    for ax, m in ((0, X), (1, Y)):                             # where each node position went, from the nodes (a stem
        seen = {}                                              # under a fork moves as one)
        for q, w in rep["where"].items():
            seen.setdefault(q[ax], []).append(w[ax])
        for k, vals in seen.items():
            m[k] = max(set(vals), key=vals.count)
    ball_knots = {k for ax, lo, hi, o, lo2, hi2 in B.balls(body) for k in ((lo, hi) if ax == 1 else (lo2, hi2))}
    hints = B.HINTS.get(name, {})
    vv = dict(v, sub=hints.get("sub", "loop"), fig=name.split(".")[0] in B.FIGURES)   # as bold.bold
    named = {"x": {}, "y": {(a, b): want(vv) if callable(want) else want for a, b, want, kind in hints.get("y", [])}}
    bl = B.balls(body)
    ball = {"x": set(), "y": set()}
    for ax, lo, hi, o, lo2, hi2 in bl:
        ball["xy"[ax]].add((lo, hi))
        ball["xy"[o]].add((lo2, hi2))
    xs, xg = B.read_axis(pl, xk, 1, yk[0], yk[-1])
    ys, yg = B.read_axis(pl, yk, 0, xk[0], xk[-1])
    pairs = {"x": B.extreme_pairs(body, pl, 0), "y": B.extreme_pairs(body, pl, 1)}
    for key, found, target, m_here, m_along, ax, bknots in (("x", xs, B.x_target, X, Y, 1, None), ("y", ys, B.y_target, Y, X, 0, None)):
        for a, b in pairs[key]:
            near = [k for k in found if abs(k[0] - a) <= 8 and abs(k[1] - b) <= 8]
            for k in near:
                if k != (a, b) and k[1] - k[0] > 40:
                    found[(a, b)] = dict(found.pop(k), pair=True)
            if not near:
                found[(a, b)] = {"run": 0, "at": None, "straight": (False, False), "pair": True}
        found, _ = B.one_stroke(found)
        for (a, b), s in sorted(found.items()):
            t = b - a
            if t > 200:
                continue
            if (a, b) in ball[key]:
                want, kind = t * (1 + (B.BALL - 1) * v["f"]), "ball"
            elif (a, b) in named[key]:
                want, kind = named[key][(a, b)], "bar"
            elif key == "y" and t >= 64 and (not s.get("pair") or {a, b} & ball_knots):
                continue
            else:
                want = target(t, all(s["straight"]), vv)
                kind = ("serif tip" if t <= 36 else "level stroke") if key == "y" else "upright stroke"
            if want is None:
                continue
            if s.get("at") and all(s["straight"]) and kind != "ball":   # a straight stroke: a cut across it
                got = _cut(bpl, ax, _along(s["at"][0], s["at"][1], m_along, 15), m_here[a], m_here[b])
            else:                                              # a curved one: between its two extremes, as the Regular's
                got = m_here[b] - m_here[a]                    # value is (they need not sit over each other)
                have = [q[1 if key == "y" else 0] for P in bbody for q in P if q[2] is not None]
                if not all(any(abs(h - m_here[e]) < 0.75 for h in have) for e in (a, b)):
                    got = None
            row(f"{kind} at {a}..{b}", t, want, got, TOL["stroke"])
        if key == "x":
            for a, b, was, want, got, kind in rep["x"]:
                if kind == "bracket run":                      # a slanted stroke's serif: between the Bold's own nodes
                    row(f"bracket run at {a}..{b}", was, want, X[b] - X[a], TOL["reach"])
                if kind == "serif reach":
                    slab = next((k for k, s in found.items() if k[1] - k[0] > 130 and s.get("at") and (k[0] == a or k[1] == b)), None)
                    g = None
                    if slab:
                        for p in _along(found[slab]["at"][0], found[slab]["at"][1], Y, 3):
                            for lo, hi in B.scan(bpl, p, 1):
                                if lo - 3 <= X[a] and X[b] <= hi + 3:
                                    g = (X[b] - lo) if a == slab[0] else (hi - X[a])
                    row(f"serif reach at {a}..{b}", was, want, g, TOL["reach"])
    xg, _ = B.one_stroke(xg)
    for a, b, was, want, got, kind in rep["x"]:
        if kind in ("counter", "opening") and (a, b) in xg and xg[(a, b)].get("at"):
            at = xg[(a, b)]["at"]
            row(f"{kind} at {a}..{b}", was, want, _gap(bpl, _along(at[0], at[1], Y), X[a], X[b]), TOL["counter"])
    where = rep["where"]
    for st in B.slant_strokes(B.diagonals(body, pl)):          # across itself at its middle; its taper as the Regular's
        on = [q[:2] for P in bbody for q in P if q[2] is not None]
        nodes = [where[q] for e in st["L"] + st["R"] for q in e]
        was, taper = B.slant_measure(st, lambda q: q)
        want = was + (B.diag_target(st["t"], v) - st["t"])
        if not all(any(abs(q[0] - o[0]) < 0.75 and abs(q[1] - o[1]) < 0.75 for o in on) for q in nodes):
            row("slanted stroke", round(was, 1), want, None, TOL["diagonal"])
            continue
        got, grow = B.slant_measure(st, lambda q: where[q])
        row("slanted stroke", round(was, 1), want, got, TOL["diagonal"])
        if abs(grow - taper) > 1.5:
            bad.append(f"{name}: a slanted stroke widens {grow:.1f} per 100 of height, the Regular's {taper:.1f}")
    pins = {y for y in yk if y in B.ZONES or min(abs(y - yk[0]), abs(y - yk[-1])) <= 1}
    import parts as PARTS
    bj = PARTS.joins_of(B._Glyph(bc))
    for x, y, d, leave, flat in B.necks_of(rc, pins):          # the Bold's crotch on the same stem edge, nearest in height
        wx, wy = where[(x, y)]
        near = min((r for r in bj if abs(r[0] - wx) < 0.75), key=lambda r: abs(r[1] - wy), default=None)
        row("neck", d, d * v["neck"], near[2] if near else None, TOL["neck"])
    return rows, bad


def sweep(stem=B.STEM, names=None):
    """Every 25 units of weight: the same audit on the instance there, against the targets for its own stem. 0.81:
    the Light side too, 375 down to 300 (towards the Light master at bold.LIGHT_STEM)."""
    names = names or list(string.ascii_lowercase + string.ascii_uppercase) + FIGURES
    reg = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    fail = 0
    # 0.82 (owner round 8, axis): weights on the 0.82 axis; the stops are 0.81's (375 to 325, then 400 to 700 every 25),
    # at the same stems (weightaxis.from_old): 400 to 800 every 33.3
    import weightaxis as W
    print(f"{W.AXIS_NOTE}; the stops are the 0.81 axis's every 25 units at their stems")
    stops = [(w, st, B.vector(B.LIGHT_STEM)) for w, st in B.axis_map(stem, (375, 350, 325))]
    stops += [(W.short(round(W.from_old(o), 1)), st, B.vector(stem))
              for (w, st), o in zip(B.axis_map(stem, [W.from_old(o) for o in range(400, 701, 25)]), range(400, 701, 25))]
    for w, st, v in stops:
        t = (st - B.REG_STEM) / (v["stem"] - B.REG_STEM)
        rows, bad, unsound = [], [], 0
        for n in names:
            r, b = audit(reg, n, v, t)
            rows += r
            bad += b
            rc = B.glyph_contours(reg[n])
            bc = B.bold(rc, reg[n].width, v, n)[0]
            mid = instance(rc, bc, v, t)
            unsound += bool(B.sound(rc, mid))
        miss = [r for r in rows if r[5] != "ok"]
        fail += len(bad) + unsound
        print(f"weight {w}, stem {st:6.1f}: {len(rows)} parts, {len(rows) - len(miss)} on target, {len(miss)} missed, {len(bad) - len(miss)} other, {unsound} glyphs with a kink or a turned curve"
              + ("" if not bad else "   " + "; ".join(bad[:4])))
    return fail


if __name__ == "__main__":
    if "--sweep" in sys.argv:
        a = [x for x in sys.argv[1:] if x.isdigit()]
        sys.exit(1 if sweep(int(a[0]) if a else B.STEM) else 0)
    args = sys.argv[1:]
    stem = int(args.pop(0)) if args and args[0].isdigit() else B.STEM
    names = args or list(string.ascii_lowercase + string.ascii_uppercase) + FIGURES
    reg = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    v = B.vector(stem)
    allrows, allbad = [], []
    for n in names:
        rows, bad = audit(reg, n, v)
        allrows += rows
        allbad += bad
    with open("build/weight/audit-bold.txt", "w") as f:
        for r in allrows:
            f.write(f"{r[0]:8}{r[1]:34}{r[2]!s:>8}{r[3]!s:>8}{r[4]!s:>8}  {r[5]}\n")
    miss = [r for r in allrows if r[5] != "ok"]
    kinds = {}
    for r in allrows:
        k = r[1].split(" at ")[0]
        kinds.setdefault(k, [0, 0])
        kinds[k][0] += 1
        kinds[k][1] += r[5] == "ok"
    print(f"Bold audit, stem {stem}: {len(names)} glyphs, {len(allrows)} parts measured, {len(allrows) - len(miss)} on target, {len(miss)} missed, "
          f"{len([b for b in allbad if 'target' not in b])} other failures")
    print("   " + "; ".join(f"{k} {ok}/{n}" for k, (n, ok) in sorted(kinds.items())))
    letters = sorted({b.split(':')[0] for b in allbad})
    print("clean:", "".join(n if len(n) == 1 else f" {n}" for n in names if n not in letters))
    for b in allbad:
        print("  " + b)
    sys.exit(1 if allbad else 0)
