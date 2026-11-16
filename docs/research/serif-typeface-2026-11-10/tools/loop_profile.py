"""Stroke thickness round a closed counter below the baseline (the double-storey g's loop) and along a descender's
tail, measured the same way on Area Serif and the references (numbers only; nothing is drawn or stored).

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/loop_profile.py [g] [area.ttf ...]

The glyph is unioned in memory (a variable font keeps its overlaps), flattened to 1 unit, and for every point on the
loop's counter the thickness is the shortest distance to the outside edge: the stroke across itself. Reported by
angle round the counter's centre, 0 at the right, 90 at the top (where the link runs in), 270 at the bottom, all in
units of the face's own o hairline, so faces of different weight compare. `steps` counts the times the thickness
turns back between its thinnest (the link) and its thickest (sides or bottom) on each half of the loop."""
import math
import os
import sys

import pathops
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402


def union_polys(tt, name, step=1.0):
    gs = tt.getGlyphSet()
    p = pathops.Path()
    gs[name].draw(p.getPen(glyphSet=gs))
    p.simplify(fix_winding=True)
    k = 1000 / tt["head"].unitsPerEm
    pen = E.SegPen(gs, k)
    p.draw(pen)
    return E.flatten([c for c in pen.contours if c], step)


def area(poly):
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(poly, poly[1:] + poly[:1])) / 2


def loop_profile(tt, name, below=0.0):
    P = union_polys(tt, name)
    outer = max(P, key=lambda q: abs(area(q)))
    counters = [q for q in P if q is not outer and max(p[1] for p in q) < 60 + below]
    if not counters:
        return None
    cnt = max(counters, key=lambda q: abs(area(q)))
    cx = (min(p[0] for p in cnt) + max(p[0] for p in cnt)) / 2
    cy = (min(p[1] for p in cnt) + max(p[1] for p in cnt)) / 2
    import numpy as np
    O = np.array(outer)
    prof = []
    for x, y in cnt:
        d = np.sqrt(((O - (x, y)) ** 2).sum(1)).min()
        a = math.degrees(math.atan2(y - cy, x - cx)) % 360
        prof.append((a, d, x, y))
    prof.sort()
    return prof, cnt, outer


def hair(tt):
    P = union_polys(tt, tt.getBestCmap()[ord("o")])
    xs = [p[0] for q in P for p in q]
    mid = (min(xs) + max(xs)) / 2
    ys = []
    for q in P:
        for a, b in zip(q, q[1:] + q[:1]):
            if (a[0] <= mid) != (b[0] <= mid):
                ys.append(a[1] + (mid - a[0]) / (b[0] - a[0]) * (b[1] - a[1]))
    ys.sort()
    return ys[1] - ys[0]


def binned(prof, step=15):
    out = {}
    for a, d, *_ in prof:
        out.setdefault(int(a // step) * step, []).append(d)
    return {k: min(v) for k, v in sorted(out.items())}


def turns(seq, tol=0.6):
    """Times a sequence of thicknesses changes direction by more than tol units."""
    n, d, ref = 0, 0, seq[0]
    for v in seq[1:]:
        if abs(v - ref) < tol:
            continue
        s = 1 if v > ref else -1
        if d and s != d:
            n += 1
        d, ref = s, v
    return n


def summary(label, tt, name):
    r = loop_profile(tt, name)
    if r is None:
        print(f"{label}: no closed loop")
        return None
    prof, cnt, outer = r
    h = hair(tt)
    b = binned(prof, 10)
    thin_a = min(b, key=b.get)
    thick_a = max(b, key=b.get)
    ds = [d for _a, d, *_r in prof]
    # walk from the thinnest point both ways round to the thickest, smoothed over 5 degrees
    sm = binned(prof, 5)
    keys = sorted(sm)
    i0 = keys.index(min(keys, key=lambda k: sm[k]))
    ring = keys[i0:] + keys[:i0]
    vals = [sm[k] for k in ring]
    imax = vals.index(max(vals))
    t1 = turns(vals[:imax + 1])
    t2 = turns(list(reversed(vals[imax:])) + [vals[0]])
    w = max(p[0] for p in cnt) - min(p[0] for p in cnt)
    hgt = max(p[1] for p in cnt) - min(p[1] for p in cnt)
    print(f"{label:16s} hairline {h:5.1f}  counter {w:4.0f} x {hgt:4.0f} (w/h {w / hgt:4.2f})  thinnest {min(ds) / h:4.2f} at "
          f"{thin_a:3d} deg, thickest {max(ds) / h:4.2f} at {thick_a:3d} deg; turns back {t1} and {t2} times")
    print("   by angle (of the hairline): " + " ".join(f"{k}:{v / h:.2f}" for k, v in binned(prof, 30).items()))
    return prof


if __name__ == "__main__":
    name = sys.argv[1] if len(sys.argv) > 1 else "g"
    for path in sys.argv[2:]:
        summary(os.path.basename(path), TTFont(path), name)
    for key in ("area", "georgia", "serrif", "source", "literata", "baskerville"):
        if os.path.exists(E.FACES[key][1]):
            tt = E.face(key)
            summary(E.FACES[key][0], tt, tt.getBestCmap()[ord(name)])
