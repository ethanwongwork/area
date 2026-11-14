"""Thickness of a stroke all the way round a counter (owner, 2026-11-14: a's bowl "looks a bit uneven from thick and
thin"). For each point of a closed counter, the distance through the ink along the counter's outward normal to the
far edge; printed against the angle round the counter's middle, with its rate of change. A smooth stroke's
thickness rises and falls once between its thin and thick places; a step back (thinner, thicker, thinner within a
quarter turn) or a jump in the rate is what the eye reads as uneven.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/profile.py a [ufo]
"""
import math
import sys

sys.path[:0] = ["."]
import ufoLib2  # noqa: E402

import bold as B  # noqa: E402


def counters(contours):
    polys = B.polys(contours, 2)
    boxes = [(min(q[0] for q in p), min(q[1] for q in p), max(q[0] for q in p), max(q[1] for q in p)) for p in polys]
    return [i for i, b in enumerate(boxes) if any(j != i and o[0] < b[0] and o[1] < b[1] and o[2] > b[2] and o[3] > b[3] for j, o in enumerate(boxes))], polys


def profile(contours, which=0, n=72):
    """[(angle in degrees, thickness)] round counter `which`, n samples by arc length."""
    idx, polys = counters(contours)
    if not idx:
        return []
    p = polys[idx[which]]
    cx, cy = sum(q[0] for q in p) / len(p), sum(q[1] for q in p) / len(p)
    area = sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p)))
    sgn = 1 if area > 0 else -1

    def ink(x, y):
        return any(a <= x <= b for a, b in B.scan(polys, y, 1))
    out = []
    step = max(1, len(p) // n)
    for i in range(0, len(p), step):
        a, b = p[i - 2], p[(i + 2) % len(p)]
        d = (b[0] - a[0], b[1] - a[1])
        L = math.hypot(*d)
        if L < 1e-6:
            continue
        nx, ny = d[1] / L * sgn, -d[0] / L * sgn          # out of the counter, into the ink
        if not ink(p[i][0] + nx * 2, p[i][1] + ny * 2):
            nx, ny = -nx, -ny
        t = 2.0
        while t < 260 and ink(p[i][0] + nx * t, p[i][1] + ny * t):
            t += 1.0
        ang = math.degrees(math.atan2(p[i][1] - cy, p[i][0] - cx)) % 360
        out.append((ang, t if t < 260 else None))
    return sorted(out)


def unevenness(prof):
    """(largest jump in thickness between neighbouring samples, number of turns in the thickness's direction)."""
    v = [t for a, t in prof if t is not None]
    if len(v) < 8:
        return None
    d = [b - a for a, b in zip(v, v[1:] + v[:1])]
    jump = max(abs(b - a) for a, b in zip(d, d[1:] + d[:1]))
    s = [x for x in d if abs(x) > 1.0]
    turns = sum(1 for a, b in zip(s, s[1:] + s[:1]) if a * b < 0)
    return round(jump, 1), turns


if __name__ == "__main__":
    name = sys.argv[1]
    f = ufoLib2.Font.open(sys.argv[2] if len(sys.argv) > 2 else "build/AreaSerif-Regular.ufo")
    prof = profile(B.glyph_contours(f[name]))
    print(name, "largest jump in the rate, turns:", unevenness(prof))
    print(" ".join(f"{a:.0f}:{'-' if t is None else round(t)}" for a, t in prof))
