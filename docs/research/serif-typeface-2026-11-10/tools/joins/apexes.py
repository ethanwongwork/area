"""Where two diagonal strokes meet: every vertex of v w y V W A M N (and x k K X Y Z z 4 7 on request), three faces.
A vertex is a short level edge (or a single point) between two long sloping edges.
  out   an apex of ink (convex); in  the counter's corner between two strokes (concave)
  w     its width in units per 1000 (0 = a point), and in the class's stems
  y     its height
Run from typefaces/area-serif. Usage: apexes.py [chars] [area.ttf]"""
import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
from prof import faces
from fontTools.pens.recordingPen import DecomposingRecordingPen
def contours(f, ch):
    gs = f.getGlyphSet(); rec = DecomposingRecordingPen(gs); gs[f.getBestCmap()[ord(ch)]].draw(rec)
    k = 1000 / f["head"].unitsPerEm; cs = []; cur = None
    for op, a in rec.value:
        if op == "moveTo": cur = [("M", (a[0][0] * k, a[0][1] * k))]; cs.append(cur)
        elif op == "lineTo": cur.append(("L", (a[0][0] * k, a[0][1] * k)))
        elif op in ("qCurveTo", "curveTo"): cur.append(("C", (a[-1][0] * k, a[-1][1] * k)))
    return cs
def stem(f, ch):
    from fontTools.pens.boundsPen import BoundsPen
    ref = "n" if ch.islower() else "H"
    import lib
    return lib.stem(f, ref) if hasattr(lib, "stem") else None
def vertices(cs):
    out = []
    for c in cs:
        pts = [p for _, p in c]; kinds = [k for k, _ in c]; n = len(pts)
        if pts[0] == pts[-1]: pts = pts[:-1]; kinds = kinds[1:] + kinds[:1]; n = len(pts)
        area = sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n)) / 2
        def edge(i):  # from i to i+1; straight if the segment ending at i+1 is a line
            a, b = pts[i % n], pts[(i + 1) % n]
            return a, b, math.hypot(b[0] - a[0], b[1] - a[1]), kinds[(i + 1) % n] in ("L", "M")
        def slope_ok(a, b, L, straight):
            return straight and L > 90 and abs(b[0] - a[0]) > 0.12 * L and abs(b[1] - a[1]) > 0.35 * L
        for i in range(n):
            e0 = edge(i - 1)
            # a point
            e1 = edge(i)
            if slope_ok(*e0) and slope_ok(*e1) and (e0[1][1] - e0[0][1]) * (e1[1][1] - e1[0][1]) < 0:
                turn = (e0[1][0] - e0[0][0]) * (e1[1][1] - e1[0][1]) - (e0[1][1] - e0[0][1]) * (e1[1][0] - e1[0][0])
                out.append(("out" if turn * area > 0 else "in", 0.0, pts[i][0], pts[i][1]))
            # a level edge between two slopes
            e2 = edge(i + 1)
            if slope_ok(*e0) and slope_ok(*e2) and e1[3] and e1[2] < 110 and abs(e1[1][1] - e1[0][1]) < 2.5 and (e0[1][1] - e0[0][1]) * (e2[1][1] - e2[0][1]) < 0:
                turn = (e0[1][0] - e0[0][0]) * (e1[1][1] - e1[0][1]) - (e0[1][1] - e0[0][1]) * (e1[1][0] - e1[0][0])
                out.append(("out" if turn * area > 0 else "in", e1[2], (e1[0][0] + e1[1][0]) / 2, e1[0][1]))
    return sorted(out, key=lambda v: (v[0], v[2]))
if __name__ == "__main__":
    chars = sys.argv[1] if len(sys.argv) > 1 else "vwyVWAMN"
    for ch in chars:
        print("==", ch)
        for label, f in faces(sys.argv[2] if len(sys.argv) > 2 else "build/AreaSerif-Regular.ttf"):
            print(f"  {label:<8}", "  ".join(f"{kind} w{w:.0f} at ({x:.0f},{y:.0f})" for kind, w, x, y in vertices(contours(f, ch))))
