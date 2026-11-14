"""Every join where a curved stroke meets a stem (the crotch), three faces. For each concave corner of the outline
that has a long upright edge on one side:
  at      where it sits: x from the glyph's left edge and y, both over the x-height
  flat    the length of the short edge at the corner, if the corner is cut flat (0 = a point), in stems
  neck    the stroke's thickness at the join: from the corner to the nearest outline that is not its own two edges
          (the counter, or the stem's far side), in stems
  angle   the opening between the stem and the curve leaving it, in degrees
Run from typefaces/area-serif. Usage: crotches.py [chars] [area.ttf]"""
import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
from fontTools.pens.recordingPen import DecomposingRecordingPen
def outline(f, ch):
    """Contours as lists of segments: (p0, p1, kind, points along it)."""
    gs = f.getGlyphSet(); rec = DecomposingRecordingPen(gs); gs[f.getBestCmap()[ord(ch)]].draw(rec)
    k = 1000 / f["head"].unitsPerEm; cs = []; cur = None; last = None
    S = lambda p: (p[0] * k, p[1] * k)
    for op, a in rec.value:
        if op == "moveTo": cur = []; last = start = S(a[0])
        elif op == "lineTo":
            p = S(a[0]); cur.append((last, p, "L", [last, p])); last = p
        elif op == "qCurveTo":
            pts = [S(p) for p in a]; on = [((pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2) for i in range(len(pts) - 2)] + [pts[-1]]
            for c, p1 in zip(pts[:-1], on):
                cur.append((last, p1, "C", [tuple((1 - t) ** 2 * last[j] + 2 * (1 - t) * t * c[j] + t * t * p1[j] for j in (0, 1)) for t in [i / 8 for i in range(9)]])); last = p1
        elif op == "curveTo":
            c1, c2, p1 = (S(p) for p in a)
            cur.append((last, p1, "C", [tuple((1 - t) ** 3 * last[j] + 3 * (1 - t) ** 2 * t * c1[j] + 3 * (1 - t) * t * t * c2[j] + t ** 3 * p1[j] for j in (0, 1)) for t in [i / 12 for i in range(13)]])); last = p1
        elif op in ("closePath", "endPath"):
            if math.hypot(last[0] - start[0], last[1] - start[1]) > 0.01: cur.append((last, start, "L", [last, start]))
            cs.append([s for s in cur if math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]) > 0.01])
    return cs
def area(c):
    pts = [s[0] for s in c]; return sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts))) / 2
def crotches(f, ch, s_, xh):
    cs = outline(f, ch); out = []
    allpts = [(ci, si, p) for ci, c in enumerate(cs) for si, s in enumerate(c) for p in s[3]]
    x0 = min(p[0] for _, _, p in allpts)
    for ci, c in enumerate(cs):
        ccw = area(c) > 0; n = len(c)
        for i in range(n):
            a, b = c[i - 1], c[i]                    # a ends at the corner, b starts there
            def d_in(s):  p, q = s[3][-2], s[3][-1]; L = math.hypot(q[0] - p[0], q[1] - p[1]); return ((q[0] - p[0]) / L, (q[1] - p[1]) / L)
            def d_out(s): p, q = s[3][0], s[3][1]; L = math.hypot(q[0] - p[0], q[1] - p[1]); return ((q[0] - p[0]) / L, (q[1] - p[1]) / L)
            u, v = d_in(a), d_out(b)
            turn = math.degrees(math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]))
            concave = (turn < -25) if ccw else (turn > 25)
            if not concave: continue
            # a flat cut: this corner and the next (or previous) one joined by a short straight edge
            flat = 0; other = None
            for e, far in ((b, c[(i + 1) % n]), (a, c[i - 2])):
                L = math.hypot(e[1][0] - e[0][0], e[1][1] - e[0][1])
                if e[2] == "L" and L <= 0.2 * s_: flat = L; other = far
            ea, eb = (a, other) if (flat and other is not None and other is c[(i + 1) % n]) else ((other, b) if flat and other is not None else (a, b))
            def upright(s): return s[2] == "L" and abs(s[1][0] - s[0][0]) < 0.06 * abs(s[1][1] - s[0][1]) and abs(s[1][1] - s[0][1]) > 0.5 * s_
            if not (upright(ea) or upright(eb)): continue
            V = b[0]
            skip = {(ci, (i + k) % n) for k in (-3, -2, -1, 0, 1, 2)}
            neck = min(math.hypot(p[0] - V[0], p[1] - V[1]) for cj, sj, p in allpts if (cj, sj) not in skip)
            ang = 180 - abs(turn)
            out.append(((V[0] - x0) / xh, V[1] / xh, flat / s_, neck / s_, ang))
    # merge the two corners of one flat cut
    out.sort(); merged = []
    for o in out:
        if merged and abs(o[0] - merged[-1][0]) < 0.05 and abs(o[1] - merged[-1][1]) < 0.03: 
            if o[3] < merged[-1][3]: merged[-1] = o
        else: merged.append(o)
    return merged
if __name__ == "__main__":
    chars = sys.argv[1] if len(sys.argv) > 1 else "nhmrubdpqa"
    F = faces(*sys.argv[2:3])
    for ch in chars:
        print("==", ch, "  at (x, y in x-heights)  flat / neck in stems  opening")
        for label, f in F:
            xh = f["OS/2"].sxHeight * 1000 / f["head"].unitsPerEm
            n = lib.g(f, "n").h(f["OS/2"].sxHeight * .5)[0]; s_ = (n[1] - n[0]) * 1000 / f["head"].unitsPerEm
            print(f"  {label:8}", "  ".join(f"({x:.2f},{y:.2f}) flat {fl:.2f} neck {nk:.2f} {a:.0f}°" for x, y, fl, nk, a in crotches(f, ch, s_, xh)))
