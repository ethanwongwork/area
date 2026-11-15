"""Curvature continuity along a stroke (0.81; owner, 2026-11-14: "the descender on the double story g also does not
look super smooth", the single-storey g's arc "not smooth and not round enough").

Reads point lists [(x, y, type, smooth)] (a UFO contour's points) and reports, for every smooth node in a region:

  g1      the angle between the two handles (degrees; 0 is collinear)
  ratio   the curvature on the two sides of the node, larger over smaller (1.0 is curvature-continuous). A node where
          the curve changes from tight to loose by more than RATIO reads as a dent or a bump at text sizes
  flip    the curvature changes sign at the node (an inflection that sits on a node)
and for every curve in the region:
  wave    curvature inside one curve rising and falling (a bump inside a curve), counted as turns of |k| over 25%
  infl    a sign change of curvature inside one curve that is not a straight run's end
  flat    a stretch over FLAT_LEN units whose radius is over FLAT_R (reads level or straight in a round part)

`python curvecheck.py [ufo]` checks the descender loops and tails (REGIONS) and exits 1 on a failure; in qa.py.
The thresholds are this file's numbers, set so that 0.80's g (default and ss02) fails and 0.81's passes, and j and y, which
did not change, pass.
  ease    a curve leaving a straight: the curvature at the join over the curve's tightest. A curve that starts at
          its full curvature off a straight shows a step in its comb (0.80's g: 0.57 at both ends of the link)
  valley  along a tail, stem to ball, curvature may not fall and rise again by more than VALLEY (0.80's g.ss02 was
          flattest just past its lowest point, radius 218 to 402 to 65)"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
UFO = os.path.join(HERE, "build", "AreaSerif-Regular.ufo")

RATIO = 2.0            # curvature ratio across a smooth node, on curves over MIN_SPAN long
G1 = 2.0               # degrees between the handles of a smooth node
MIN_SPAN = 30          # shorter curves (corners rounded at 7, serif fillets) are left to pathlint
FLAT_R = 2000          # a stretch whose radius exceeds this ...
FLAT_LEN = 60          # ... for this many units, inside a round part, is a flat
WAVE = 0.10            # a rise and fall of |k| inside one curve by more than this share of its largest is a bump
EASE = 0.45            # a curve leaving a straight: its curvature at the join / its tightest (0.80's g: 0.57)
VALLEY = 0.30          # along a tail (stem to ball), the curvature may not fall by more than this and rise again
TAILS = {"g.ss02", "j", "y"}

# glyph: (contours, y range) of the part checked: every contour; a node, curve or join counts when its curves lie in
# the range: the descender's loop or tail, and the link into it on the default g. A ball's neck (the curve turning
# the other way at a node) is where a tail meets its terminal and is not judged as a jump.
REGIONS = {
    "g": ("all", (-300, 112)),
    "g.ss02": ("all", (-300, 40)),
    "j": ("all", (-300, 10)),
    "y": ("all", (-300, -40)),
    "a.ss03": ("all", (-20, 140)),
    "l.ss04": ("all", (-20, 200)),
}


def segments(P):
    """[(kind, (p0, c1, c2, p3) or (p0, p1), i0, i3)] for a closed point list."""
    n = len(P)
    first = next(i for i, p in enumerate(P) if p[2])
    out, buf, prev = [], [], first
    for k in range(1, n + 1):
        i = (first + k) % n
        if P[i][2] is None:
            buf.append(i)
            continue
        if len(buf) == 2:
            out.append(("C", (P[prev][:2], P[buf[0]][:2], P[buf[1]][:2], P[i][:2]), prev, i))
        else:
            out.append(("L", (P[prev][:2], P[i][:2]), prev, i))
        prev, buf = i, []
    return out


def pt(s, t):
    if s[0] == "L":
        (a, b) = s[1]
        return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    a, b, c, d = s[1]
    u = 1 - t
    return tuple(u ** 3 * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t ** 3 * d[i] for i in (0, 1))


def d1(s, t):
    if s[0] == "L":
        (a, b) = s[1]
        return (b[0] - a[0], b[1] - a[1])
    a, b, c, d = s[1]
    u = 1 - t
    return tuple(3 * u * u * (b[i] - a[i]) + 6 * u * t * (c[i] - b[i]) + 3 * t * t * (d[i] - c[i]) for i in (0, 1))


def d2(s, t):
    if s[0] == "L":
        return (0.0, 0.0)
    a, b, c, d = s[1]
    u = 1 - t
    return tuple(6 * u * (c[i] - 2 * b[i] + a[i]) + 6 * t * (d[i] - 2 * c[i] + b[i]) for i in (0, 1))


def curvature(s, t):
    x1, y1 = d1(s, t)
    x2, y2 = d2(s, t)
    v = (x1 * x1 + y1 * y1) ** 1.5
    return (x1 * y2 - y1 * x2) / v if v > 1e-9 else 0.0


def length(s, n=24):
    q = [pt(s, i / n) for i in range(n + 1)]
    return sum(math.dist(q[i], q[i + 1]) for i in range(n))


def end_k(s, at_end):
    """Curvature at a curve's end, read just inside it when a handle is retracted (the formula is 0/0 there)."""
    for t in ((1.0, 0.995, 0.98) if at_end else (0.0, 0.005, 0.02)):
        x, y = d1(s, t)
        if math.hypot(x, y) > 1e-3:
            return curvature(s, t)
    return 0.0


def tangent(s, at_end):
    for t in ((1.0, 0.995, 0.98, 0.9) if at_end else (0.0, 0.005, 0.02, 0.1)):
        x, y = d1(s, t)
        h = math.hypot(x, y)
        if h > 1e-3:
            return (x / h, y / h)
    return (1.0, 0.0)


def contour(points_lists, chooser):
    if chooser == "longest":
        return max(points_lists, key=len)
    return points_lists[chooser]


def inside(s, yr):
    ys = [p[1] for p in s[1]]
    return yr[0] <= min(ys) and max(ys) <= yr[1]


def nodes(P, yr):
    """Every smooth on-curve node between two segments inside yr: (index, (x, y), g1, k_in, k_out, ratio, flip)."""
    S = segments(P)
    out = []
    for a, b in zip(S, S[1:] + S[:1]):
        i = a[3]
        if not (P[i][3] and inside(a, yr) and inside(b, yr)):
            continue
        ta, tb = tangent(a, True), tangent(b, False)
        g1 = math.degrees(math.acos(max(-1, min(1, ta[0] * tb[0] + ta[1] * tb[1]))))
        if a[0] == "L" and b[0] == "L":
            continue
        ka = end_k(a, True) if a[0] == "C" else 0.0
        kb = end_k(b, False) if b[0] == "C" else 0.0
        short = (a[0] == "C" and length(a) < MIN_SPAN) or (b[0] == "C" and length(b) < MIN_SPAN)
        if a[0] == "L" or b[0] == "L":                 # a curve into a straight: its end curvature is the jump
            k = abs(kb if a[0] == "L" else ka)
            ratio = None if short else k * 1000      # reported as curvature per 1000 units, judged by straight_k
        else:
            lo, hi = sorted((abs(ka), abs(kb)))
            ratio = None if short else (hi / lo if lo > 1e-7 else float("inf"))
        flip = ka * kb < 0 and min(abs(ka), abs(kb)) > 1e-4
        out.append((i, P[i][:2], g1, ka, kb, ratio, flip, a[0] + b[0]))
    return out


def curves(P, yr):
    """Per curve inside yr: (i0, i3, length, waves, inflections, flats)."""
    out = []
    for s in segments(P):
        if s[0] != "C" or not inside(s, yr):
            continue
        L = length(s)
        if L < MIN_SPAN:
            continue
        ks = [curvature(s, i / 64) for i in range(65)]
        absk = [abs(k) for k in ks]
        top = max(absk) or 1e-9
        # a flat inside the curve: |k| falls by more than WAVE of its largest and rises again (a peak inside a curve
        # is the round of a turn; a valley is a flat place, which the eye reads as a dent)
        waves, ref, d = 0, absk[0], 0
        for v in absk[1:]:
            if abs(v - ref) < WAVE * top:
                continue
            sgn = 1 if v > ref else -1
            if d == -1 and sgn == 1:
                waves += 1
            d, ref = sgn, v
        infl = sum(1 for i in range(1, 65) if ks[i] * ks[i - 1] < 0 and max(abs(ks[i]), abs(ks[i - 1])) > 2e-4)
        run, flat = 0.0, 0.0
        for i in range(1, 65):
            seg = math.dist(pt(s, (i - 1) / 64), pt(s, i / 64))
            if absk[i] < 1 / FLAT_R:
                run += seg
                flat = max(flat, run)
            else:
                run = 0.0
        out.append((s[2], s[3], L, waves, infl, flat))
    return out


def eases(P, yr):
    """Every join of a straight and a curve inside yr: (index, curvature at the join / the curve's tightest)."""
    S = segments(P)
    out = []
    for a, b in zip(S, S[1:] + S[:1]):
        if a[0] == b[0] or not (inside(a, yr) and inside(b, yr)) or not P[a[3]][3]:
            continue
        c, at_end = (a, True) if a[0] == "C" else (b, False)
        if length(c) < MIN_SPAN:
            continue
        top = max(abs(curvature(c, i / 40)) for i in range(41)) or 1e-9
        out.append((a[3], P[a[3]][:2], abs(end_k(c, at_end)) / top))
    return out


def chains(P, yr):
    """Runs of curves joined at smooth nodes with no turn the other way (a ball's neck ends a run), inside yr: lists
    of |k| sampled along each run, in contour order."""
    S = [s for s in segments(P)]
    runs, cur = [], []
    for k, s in enumerate(S):
        if s[0] != "C" or not inside(s, yr):
            if cur:
                runs.append(cur)
            cur = []
            continue
        if cur:
            prev = S[k - 1]
            ka, kb = end_k(prev, True), end_k(s, False)
            if not P[s[2]][3] or ka * kb < 0:
                runs.append(cur)
                cur = []
        cur.append(s)
    if cur:
        runs.append(cur)
    out = []
    for run in runs:
        ks = []
        for s in run:
            ks += [abs(curvature(s, i / 24)) for i in range(25)]
        out.append((run[0][2], run[-1][3], ks))
    return out


def valley(ks):
    """The deepest fall of |k| that rises again by as much, as a share of the smaller of the two peaks."""
    best, i, n = 0.0, 0, len(ks)
    peak_l = ks[0]
    for i in range(1, n):
        peak_l = max(peak_l, ks[i])
        right = max(ks[i:])
        floor = ks[i]
        depth = (min(peak_l, right) - floor) / max(min(peak_l, right), 1e-9)
        best = max(best, depth)
    return best


def report(name, contours, yr):
    N, Cv, E, V = [], [], [], []
    for P in contours:
        N += nodes(P, yr)
        Cv += curves(P, yr)
        E += eases(P, yr)
        if name in TAILS:
            V += [(i0, i3, valley(ks)) for i0, i3, ks in chains(P, yr)]
    bad = []
    for i, xy, g1, ka, kb, ratio, flip, kinds in N:
        if g1 > G1:
            bad.append(f"{name} node {i} {xy}: handles {g1:.1f} degrees off one line")
        if kinds == "CC" and ratio is not None and ratio > RATIO and not flip:
            bad.append(f"{name} node {i} {xy}: curvature {ratio:.2f}x across it (radius {1/abs(ka) if ka else 0:.0f} "
                       f"to {1/abs(kb) if kb else 0:.0f})")
    for i, xy, e in E:
        if e > EASE:
            bad.append(f"{name} node {i} {xy}: a curve leaves the straight at {e:.2f} of its tightest (limit {EASE})")
    for i0, i3, L, waves, infl, flat in Cv:
        if waves:
            bad.append(f"{name} curve {i0}-{i3}: a flat place inside it (the curvature falls and rises again)")
        if infl:
            bad.append(f"{name} curve {i0}-{i3}: {infl} inflection(s) inside it")
    for i0, i3, v in V:
        if v > VALLEY:
            bad.append(f"{name} tail {i0}-{i3}: the curvature falls {v:.0%} and rises again (limit {VALLEY:.0%}): a flat place")
    worst = max([r for *_x, r, f_, k in N if k == "CC" and r is not None and not f_] or [1.0])
    return bad, worst, N, Cv, E, V


def glyph_points(font, name):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in font[name].contours]


def main(path=UFO):
    import ufoLib2
    font = ufoLib2.Font.open(path)
    fails = []
    for name, (chooser, yr) in REGIONS.items():
        if name not in font:
            if "." not in name:
                fails.append(f"{name}: missing")
            continue
        bad, worst, N, Cv, E, V = report(name, glyph_points(font, name), yr)
        print(f"{name:8s} worst curvature ratio at a smooth node {worst:5.2f}; straight-to-curve "
              f"{max([e for *_x, e in E] or [0]):.2f}; tail valley {max([v for *_x, v in V] or [0]):.0%}; "
              f"{len(N)} nodes, {len(Cv)} curves; {'ok' if not bad else str(len(bad)) + ' faults'}")
        for b in bad:
            print("   ", b)
        fails += bad
    print(f"curve continuity: {'pass' if not fails else 'FAIL'} ({len(fails)} faults)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:2]))
