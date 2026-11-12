"""Outline quality checks on the cubic sources (build/AreaSerif-Regular.ufo) and the built TTF.

Findings are classed as in the type-design skill's audit contract:
  ERROR    a broken contract (wrong winding after overlap removal, open contour, non-integer point)
  WARNING  probably wrong (handle past its corner, missing extreme on a long curve, tiny segment)
  INFO     worth a look, often intended (inflection inside a curve, zero-length handle)
A number here is evidence, not a verdict: optical intent can justify a WARNING or INFO.
Usage: python pathlint.py [glyph ...]      exit 1 when any ERROR is found."""
import math
import os
import sys
import ufoLib2
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

HERE = os.path.dirname(os.path.abspath(__file__))
UFO = os.path.join(HERE, "build", "AreaSerif-Regular.ufo")
TTF = os.path.join(HERE, "build", "AreaSerif-Regular.ttf")

EXTREME_MIN = 40      # a curve shorter than this (units) may skip its extreme
SHORT = 2             # degenerate segments; Libre Baskerville cuts some terminals flat over 3-4 units on purpose
EDGE_T = 0.03         # extremes this close to a segment end count as "at the node"


def contours(glyph):
    """Each contour as a list of segments: ('L', p0, p1) or ('C', p0, c1, c2, p3)."""
    rec = RecordingPen()
    glyph.draw(rec)
    out, cur, start, last = [], None, None, None
    for op, args in rec.value:
        if op == "moveTo":
            cur, start, last = [], args[0], args[0]
        elif op == "lineTo":
            cur.append(("L", last, args[0]))
            last = args[0]
        elif op == "curveTo":
            cur.append(("C", last, *args))
            last = args[-1]
        elif op in ("closePath", "endPath"):
            if last != start:
                cur.append(("L", last, start))
            out.append((cur, op == "closePath"))
    return out


def bez(p0, c1, c2, p3, t):
    u = 1 - t
    return tuple(u ** 3 * p0[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t ** 3 * p3[k] for k in (0, 1))


def interior_extremes(p0, c1, c2, p3):
    """t values in (EDGE_T, 1-EDGE_T) where the curve has a horizontal or vertical tangent."""
    ts = []
    for k in (0, 1):
        a = -p0[k] + 3 * c1[k] - 3 * c2[k] + p3[k]
        b = 2 * (p0[k] - 2 * c1[k] + c2[k])
        c = c1[k] - p0[k]
        roots = []
        if abs(a) < 1e-9:
            if abs(b) > 1e-9:
                roots = [-c / b]
        else:
            d = b * b - 4 * a * c
            if d >= 0:
                roots = [(-b + math.sqrt(d)) / (2 * a), (-b - math.sqrt(d)) / (2 * a)]
        ts += [(t, "xy"[k]) for t in roots if EDGE_T < t < 1 - EDGE_T]
    return ts


def inflections(p0, c1, c2, p3):
    """Sign changes of curvature inside the segment."""
    def cross(t):
        e = 1e-4
        a, b, c = bez(p0, c1, c2, p3, t - e), bez(p0, c1, c2, p3, t), bez(p0, c1, c2, p3, t + e)
        return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
    vals = [cross(i / 40) for i in range(2, 39)]
    return sum(1 for i in range(1, len(vals)) if vals[i - 1] * vals[i] < 0 and abs(vals[i]) > 1e-6)


def handle_past_corner(p0, c1, c2, p3):
    """True when a handle runs past the intersection of the two handle lines (risk of a loop or bump)."""
    d1 = (c1[0] - p0[0], c1[1] - p0[1])
    d2 = (c2[0] - p3[0], c2[1] - p3[1])
    den = d1[0] * d2[1] - d1[1] * d2[0]
    if abs(den) < 1e-9 or d1 == (0, 0) or d2 == (0, 0):
        return False
    w = (p3[0] - p0[0], p3[1] - p0[1])
    s = (w[0] * d2[1] - w[1] * d2[0]) / den   # p0 + s*d1 hits the other line
    t = (w[0] * d1[1] - w[1] * d1[0]) / den   # p3 + t*d2
    return (0 < s < 1 and t > 0 and False) or (s > 0 and t > 0 and (s < 1 or t < 1))


def seg_len(seg):
    pts = [seg[1], seg[-1]] if seg[0] == "L" else [bez(*seg[1:], i / 16) for i in range(17)]
    return sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))


def lint_source(names):
    font = ufoLib2.Font.open(UFO)
    found = []
    for name in names or font.keys():
        if name not in font:
            continue
        for ci, (segs, closed) in enumerate(contours(font[name])):
            where = f"{name} contour {ci}"
            if not closed:
                found.append(("ERROR", where, "open contour"))
            for si, seg in enumerate(segs):
                pts = seg[1:]
                if any(abs(v - round(v)) > 1e-6 for p in pts for v in p):
                    found.append(("ERROR", f"{where} seg {si}", "point off the integer grid"))
                length = seg_len(seg)
                if length < SHORT:
                    found.append(("WARNING", f"{where} seg {si}", f"segment only {length:.1f} units long"))
                if seg[0] != "C":
                    continue
                p0, c1, c2, p3 = pts
                if c1 == p0 or c2 == p3:
                    found.append(("INFO", f"{where} seg {si}", "zero-length handle"))
                if handle_past_corner(p0, c1, c2, p3):
                    found.append(("WARNING", f"{where} seg {si}", "handle runs past the handles' meeting point"))
                if length >= EXTREME_MIN:
                    for t, axis in interior_extremes(p0, c1, c2, p3):
                        x, y = bez(p0, c1, c2, p3, t)
                        found.append(("WARNING", f"{where} seg {si}",
                                      f"no node at {axis}-extreme near ({x:.0f}, {y:.0f}), t={t:.2f}"))
                n = inflections(p0, c1, c2, p3)
                if n:
                    found.append(("INFO", f"{where} seg {si}", f"{n} inflection(s) inside the curve"))
    return found


def joint_angles(font, names, limit=1.0):
    """Smooth nodes must have collinear handles: report the bend in degrees where it exceeds `limit`."""
    found = []
    for name in names or font.keys():
        if name not in font:
            continue
        for ci, c in enumerate(font[name].contours):
            pts = c.points
            n = len(pts)
            for k, p in enumerate(pts):
                if not (p.type and p.smooth):
                    continue
                a, b = pts[(k - 1) % n], pts[(k + 1) % n]
                v1 = (p.x - a.x, p.y - a.y)
                v2 = (b.x - p.x, b.y - p.y)
                if v1 == (0, 0) or v2 == (0, 0):
                    continue
                ang = abs(math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1])))
                # how far the shorter neighbour sits off the straight line through the node, in units
                off = min(math.hypot(*v1), math.hypot(*v2)) * math.sin(math.radians(ang))
                if ang > limit and off > 0.5:
                    cls = "WARNING" if off > 1.0 else "INFO"
                    found.append((cls, f"{name} contour {ci} node {k} ({p.x:.0f},{p.y:.0f})",
                                  f"smooth node bends {ang:.1f} degrees ({off:.1f} units off the line)"))
    return found


def lint_built(names):
    """Winding after overlap removal: outer contours clockwise in TrueType, counters counter-clockwise."""
    f = TTFont(TTF)
    gs = f.getGlyphSet()
    found = []
    for name in names or f.getGlyphOrder():
        if name not in gs:
            continue
        rec = RecordingPen()
        gs[name].draw(rec)
        polys, cur = [], []
        for op, args in rec.value:
            if op == "moveTo":
                cur = [args[0]]
            elif op in ("lineTo",):
                cur.append(args[0])
            elif op == "qCurveTo":
                cur.extend(args)
            elif op == "closePath":
                polys.append(cur)
        for i, poly in enumerate(polys):
            area = sum(poly[j][0] * poly[(j + 1) % len(poly)][1] - poly[(j + 1) % len(poly)][0] * poly[j][1]
                       for j in range(len(poly))) / 2
            px, py = poly[0]
            depth = 0
            for k, other in enumerate(polys):
                if k == i:
                    continue
                inside = False
                for j in range(len(other)):
                    (x1, y1), (x2, y2) = other[j], other[(j + 1) % len(other)]
                    if (y1 > py) != (y2 > py) and px < (x2 - x1) * (py - y1) / (y2 - y1) + x1:
                        inside = not inside
                depth += inside
            want_cw = depth % 2 == 0
            if (area < 0) != want_cw:
                found.append(("ERROR", f"{name} contour {i} (built)", "winding is reversed for its nesting depth"))
    return found


def main():
    names = sys.argv[1:]
    found = lint_source(names) + joint_angles(ufoLib2.Font.open(UFO), names) + lint_built(names)
    order = {"ERROR": 0, "WARNING": 1, "INFO": 2}
    for cls, where, msg in sorted(found, key=lambda f: (order[f[0]], f[1])):
        print(f"{cls:8s} {where}: {msg}")
    counts = {c: sum(1 for f in found if f[0] == c) for c in order}
    print("pathlint: %(ERROR)d error, %(WARNING)d warning, %(INFO)d info" % counts)
    sys.exit(1 if counts["ERROR"] else 0)


if __name__ == "__main__":
    main()
