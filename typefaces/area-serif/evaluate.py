"""Evaluation of the built outlines, glyph by glyph (owner, 2026-11-12: "a thorough, detailed evaluation of everything
in this character set ... bezier curves smoother, round arcs, smooth gradual transitions between thick and thin").
Reads build/AreaSerif-Regular.ufo (the cubic source, so every node and handle is the drawn one) and reports:

  kinks      smooth nodes whose handles are not collinear (degrees)
  jumps      smooth nodes where the curvature changes abruptly from one curve to the next (the arc looks dented or
             bulged there even though the tangent is continuous); ratio of the two radii, on curves over MIN_SPAN
  wobble     curves whose curvature rises and falls more than once by over a fifth (a bump inside one curve)
  flat       arcs with a handle under 0.30 or over 0.80 of its reach (pinched or boxy quarter)
  lopsided   quarter arcs whose two handles differ by more than 1.6x (uneven thick-to-thin)
  extremes   curves that pass an x or y extreme without a node (pathlint also reports these)

Usage: .venv/bin/python evaluate.py [--list] [glyphs]     exit 0 always: this is a report, qa.py holds the gates."""
import math
import os
import string
import sys

import ufoLib2

HERE = os.path.dirname(os.path.abspath(__file__))
UFO = os.path.join(HERE, "build", "AreaSerif-Regular.ufo")
FIGS = "zero one two three four five six seven eight nine".split()
SET = list(string.ascii_lowercase) + list(string.ascii_uppercase) + FIGS
MIN_SPAN = 40          # curves shorter than this (serif corners, fillets) are judged only for kinks
JUMP = 1.8             # radius ratio across a smooth node that reads as a dent


def segments(c):
    """[(kind, p0, p1, p2, p3, index of end node)] for a closed contour."""
    P = c.points
    n = len(P)
    i0 = next(i for i, p in enumerate(P) if p.type)
    out, buf, prev = [], [], P[i0]
    for k in range(1, n + 1):
        p = P[(i0 + k) % n]
        if p.type is None:
            buf.append(p)
            continue
        if p.type == "curve" and len(buf) == 2:
            out.append(("curve", prev, buf[0], buf[1], p, (i0 + k) % n))
        else:
            out.append(("line", prev, None, None, p, (i0 + k) % n))
        prev, buf = p, []
    return out


def d1(s, t):
    _, a, b, c, d, _ = s
    u = 1 - t
    return (3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x),
            3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y))


def d2(s, t):
    _, a, b, c, d, _ = s
    u = 1 - t
    return (6 * u * (c.x - 2 * b.x + a.x) + 6 * t * (d.x - 2 * c.x + b.x),
            6 * u * (c.y - 2 * b.y + a.y) + 6 * t * (d.y - 2 * c.y + b.y))


def curvature(s, t):
    x1, y1 = d1(s, t)
    x2, y2 = d2(s, t)
    v = (x1 * x1 + y1 * y1) ** 1.5
    return (x1 * y2 - y1 * x2) / v if v > 1e-9 else 0.0


def span(s):
    return math.hypot(s[4].x - s[1].x, s[4].y - s[1].y)


def evaluate(g):
    found = []
    for ci, c in enumerate(g.contours):
        S = segments(c)
        n = len(S)
        for i, s in enumerate(S):
            nxt = S[(i + 1) % n]
            node = s[4]
            where = f"{ci}:{s[5]} ({round(node.x)},{round(node.y)})"
            # kinks and curvature jumps at the node between s and nxt
            if s[0] == "curve" and nxt[0] == "curve" and node.smooth:
                a = (node.x - s[3].x, node.y - s[3].y)
                b = (nxt[2].x - node.x, nxt[2].y - node.y)
                la, lb = math.hypot(*a), math.hypot(*b)
                if la > 0.5 and lb > 0.5:
                    ang = math.degrees(math.acos(max(-1, min(1, (a[0] * b[0] + a[1] * b[1]) / (la * lb)))))
                    if ang > 3:
                        found.append(("kinks", where, f"{ang:.0f} deg"))
                    if span(s) >= MIN_SPAN and span(nxt) >= MIN_SPAN:
                        k0, k1 = curvature(s, 1.0), curvature(nxt, 0.0)
                        if k0 * k1 < 0 and min(abs(k0), abs(k1)) > 1 / 2000:
                            found.append(("jumps", where, "curvature flips sign"))
                        elif min(abs(k0), abs(k1)) > 1e-9:
                            r = max(abs(k0), abs(k1)) / min(abs(k0), abs(k1))
                            if r > JUMP and max(abs(k0), abs(k1)) > 1 / 1500:
                                found.append(("jumps", where, f"radius {1 / abs(k0):.0f} -> {1 / abs(k1):.0f} (x{r:.1f})"))
            if s[0] != "curve" or span(s) < MIN_SPAN:
                continue
            _, p0, p1, p2, p3, _ = s
            ks = [curvature(s, t / 40) for t in range(1, 40)]
            # wobble: count interior curvature extrema that matter
            kmax = max(abs(k) for k in ks)
            turns, last = [], ks[0]
            for j in range(1, len(ks) - 1):
                if (ks[j] - ks[j - 1]) * (ks[j + 1] - ks[j]) < 0 and abs(ks[j] - last) > 0.2 * kmax:
                    turns.append(j)
                    last = ks[j]
            ext = len(turns)
            signs = sum(1 for j in range(1, len(ks)) if ks[j] * ks[j - 1] < 0)
            _dx, _dy = abs(p3.x - p0.x), abs(p3.y - p0.y)
            _sh = sorted((abs(p1.x - p0.x) + abs(p1.y - p0.y)) / max(_dx if abs(p1.y - p0.y) < 1 else _dy, 1e-6)
                         for _ in (0,)) + sorted((abs(p2.x - p3.x) + abs(p2.y - p3.y)) / max(_dx if abs(p2.y - p3.y) < 1 else _dy, 1e-6)
                                                 for _ in (0,))
            is_bracket = max(_dx, _dy) < 140 and 0.40 <= min(_sh) <= 0.50 and 0.70 <= max(_sh) <= 0.80
            if ext > 1 and not signs and kmax > 1 / 400 and not is_bracket:   # a bracket is 0.45 / 0.75 by design
                found.append(("wobble", where, f"{ext} curvature turns in one curve"))
            # quarter-arc handle checks: one handle upright, the other level
            dx, dy = p3.x - p0.x, p3.y - p0.y
            up0, lv0 = abs(p1.x - p0.x) < 1, abs(p1.y - p0.y) < 1
            up3, lv3 = abs(p2.x - p3.x) < 1, abs(p2.y - p3.y) < 1
            if abs(dx) > 30 and abs(dy) > 30 and ((up0 and lv3) or (lv0 and up3)):
                r0 = abs(p1.y - p0.y) / abs(dy) if up0 else abs(p1.x - p0.x) / abs(dx)
                r3 = abs(p2.x - p3.x) / abs(dx) if lv3 else abs(p2.y - p3.y) / abs(dy)
                if min(r0, r3) < 0.30 or max(r0, r3) > 0.80:
                    found.append(("flat", where, f"handles {r0:.2f} / {r3:.2f} of reach"))
                elif 0.40 <= min(r0, r3) <= 0.50 and 0.70 <= max(r0, r3) <= 0.80 and max(abs(dx), abs(dy)) < 140:
                    pass                                   # a bracket: 0.45 / 0.75 by design (derive.py, Serrif's)
                elif max(r0, r3) / max(min(r0, r3), 1e-6) > 1.6:
                    found.append(("lopsided", where, f"handles {r0:.2f} / {r3:.2f} of reach"))
            # extremes inside the curve
            for axis in (0, 1):
                prev = d1(s, 0.04)[axis]
                for t in range(2, 25):
                    v = d1(s, t / 25 * 0.96 + 0.02)[axis]
                    if prev * v < 0:
                        found.append(("extremes", where, "xy"[axis] + f"-extreme inside the curve at t={t / 25:.2f}"))
                        break
                    prev = v
    return found


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    names = args or SET
    font = ufoLib2.Font.open(UFO)
    totals, per = {}, {}
    for name in names:
        f = evaluate(font[name])
        per[name] = f
        for kind, _, _ in f:
            totals[kind] = totals.get(kind, 0) + 1
    if "--list" in sys.argv or args:
        for name in names:
            for kind, where, what in per[name]:
                print(f"{name:6} {kind:9} {where:22} {what}")
    print("\nby glyph: " + "  ".join(f"{n}:{len(per[n])}" for n in names if per[n]))
    print("clean:    " + " ".join(n for n in names if not per[n]))
    print("totals:   " + "  ".join(f"{k} {v}" for k, v in sorted(totals.items())))


if __name__ == "__main__":
    main()
