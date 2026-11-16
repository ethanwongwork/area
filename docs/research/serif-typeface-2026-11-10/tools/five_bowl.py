"""The lower bowl of 5 (and of 3, the same bowl), on every face: does its bottom lean? (owner, 2026-11-14, on 0.78:
"the bottom of the 5 still leans to the right".) Numbers only.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/five_bowl.py [AreaSerif.ttf]

The bowl is the ink below 0.64 of the figure height. Read on it:
  low at      where the outer edge's lowest point lies, as a share of the bowl's width from its left (0.5 = centred)
  in low at   the same for the counter's lowest point, as a share of the counter's width below the widest point
  wide at     the height of the outer edge's rightmost point, as a share of the bowl's height
  in wide at  the height of the counter's rightmost point, on the same scale
  heaviest    the direction, seen from the bowl's centre, in which the stroke is thickest (0 = to the right,
              -90 = straight down), and the thickness there and at -45 as a share of the thickness at 0
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402


def ray(P, cx, cy, deg, far=900):
    """Ink crossings along a ray from (cx, cy): sorted distances."""
    dx, dy = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    out = []
    for poly in P:
        n = len(poly)
        for i in range(n):
            a, b = poly[i], poly[(i + 1) % n]
            ex, ey = b[0] - a[0], b[1] - a[1]
            den = dx * ey - dy * ex
            if abs(den) < 1e-12:
                continue
            t = ((a[0] - cx) * ey - (a[1] - cy) * ex) / den
            u = ((a[0] - cx) * dy - (a[1] - cy) * dx) / den
            if t > 0 and 0 <= u < 1:
                out.append(t)
    return sorted(out)


def bowl(font, ch):
    cs, adv = E.segs(font, ch, None)
    return bowl_of(E.flatten(cs, 1.0))


def bowl_ufo(ufo, name):
    """The same reading on a UFO glyph (the build's source, before it is compiled)."""
    pen = E.SegPen(ufo)
    ufo[name].draw(pen)
    return bowl_of(E.flatten([c for c in pen.contours if c], 1.0))


def bowl_of(P):
    pts = [p for poly in P for p in poly]
    top = max(p[1] for p in pts)
    base = min(p[1] for p in pts)
    h = top - base
    low = [p for p in pts if p[1] < base + 0.64 * h]
    right = max(low, key=lambda p: p[0])
    bottom = min(low, key=lambda p: p[1])
    left = min(p[0] for p in low)
    # the bowl's own top: the outer edge's highest point right of the bowl's middle, below 0.7 h
    cx0 = (left + right[0]) / 2
    upper = max((p for p in low if p[0] > cx0), key=lambda p: p[1])
    bh = upper[1] - bottom[1]
    cx, cy = right[0] - (right[0] - left) * 0.45, bottom[1] + bh * 0.5
    th = {}
    for deg in range(-100, 31, 5):
        r = ray(P, cx, cy, deg)
        if len(r) >= 2:
            th[deg] = r[1] - r[0]
    # the counter's lowest point: lowest inner hit over the downward fan
    inner = []
    for deg in range(-150, 1, 2):
        r = ray(P, cx, cy, deg)
        if r:
            inner.append((cy + r[0] * math.sin(math.radians(deg)), cx + r[0] * math.cos(math.radians(deg))))
    upper_in = []
    for deg in range(-60, 81, 2):
        r = ray(P, cx, cy, deg)
        if r:
            upper_in.append((cx + r[0] * math.cos(math.radians(deg)), cy + r[0] * math.sin(math.radians(deg))))
    in_wide = max(upper_in)
    in_low = min(inner)
    in_right = max(x for _y, x in inner)
    in_left = min(x for _y, x in inner)
    heavy = max(th, key=th.get)
    return {"low at": (bottom[0] - left) / (right[0] - left), "in low at": (in_low[1] - in_left) / (in_right - in_left),
            "wide at": (right[1] - bottom[1]) / bh,
            "in wide at": (in_wide[1] - bottom[1]) / bh, "heaviest": heavy, "t(heaviest)/t(0)": th[heavy] / th[0],
            "t(-45)/t(0)": th[-45] / th[0], "t(-90)/t(0)": th[-90] / th[0], "bowl w/h": (right[0] - left) / bh}


if __name__ == "__main__":
    faces = {k: E.face(k) for k in E.available()}
    if len(sys.argv) > 1:
        faces["area"] = TTFont(sys.argv[1])
    for ch in "53":
        rows = {k: bowl(f, ch) for k, f in faces.items()}
        print(ch)
        print(f"   {'':18s}" + "".join(f"{k[:9]:>10s}" for k in rows) + "   mean of the others   Georgia Pro + Serrif")
        for key in rows["area"]:
            refs = [rows[k][key] for k in rows if k != "area"]
            two = [rows[k][key] for k in ("georgia", "serrif") if k in rows]
            print(f"   {key:18s}" + "".join(f"{rows[k][key]:10.3f}" for k in rows) + f"{sum(refs) / len(refs):12.3f}"
                  + (f"{sum(two) / len(two):20.3f}" if two else ""))
