"""Stroke thickness along the arc that runs into a round end: from the inner curve's points, the nearest distance to
the outer curve, start (thin, at the arc's top) to end (the ball's side). An even swell rises steadily; a dip or a
bump shows as a value out of order. Usage: arc_profile.py (from typefaces/area-serif; reads the built UFO)."""
import math, sys, os
sys.path.insert(0, os.getcwd())
import ufoLib2
def bez(p, n=60):
    return [tuple(sum(c * q[k] for c, q in zip(((1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3), p)) for k in (0, 1)) for t in [i / n for i in range(n + 1)]]
def prof(inner, outer):
    I, O = bez(inner, 12), bez(outer, 400)
    return [round(min(math.hypot(x - a, y - b) for a, b in O)) for x, y in I]
def pts(P, idx): return [(P[i % len(P)].x, P[i % len(P)].y) for i in idx]
def run(f):
    out = {}
    P = f["c"].contours[0].points
    out["c"] = prof(pts(P, (12, 13, 14, 15)), pts(P, (24, 23, 22, 21)))
    c = max(f["a"].contours, key=lambda c_: len(c_.points)); P = c.points
    i = min((k for k, p in enumerate(P) if p.type and 380 < p.y < 440), key=lambda k: P[k].x)
    out["a"] = prof(pts(P, (i + 9, i + 8, i + 7, i + 6)), pts(P, (i - 3, i - 2, i - 1, i)))
    return out
if __name__ == "__main__":
    for k, v in run(ufoLib2.Font.open(sys.argv[1] if len(sys.argv) > 1 else "build/AreaSerif-Regular.ufo")).items():
        print(k, v, " steps", [b - a for a, b in zip(v, v[1:])])
