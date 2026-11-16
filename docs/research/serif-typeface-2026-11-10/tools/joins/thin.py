"""Thinnest stroke crossing per glyph, three faces, in units per 1000 and in n/H stems. A crossing counts when the
two edges face each other (normals within 25 degrees of opposite) and both run on for a while, so tips and corners
are left out. Serif-like flats (both edges level, within 0.5 stems of a height line) are listed apart."""
import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
def resample(c, step):
    out = []; n = len(c)
    for i in range(n):
        a, b = c[i], c[(i + 1) % n]; d = math.hypot(b[0] - a[0], b[1] - a[1])
        if d < 1e-6: continue
        k = max(1, int(d / step))
        for j in range(k): out.append((a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k, (b[0] - a[0]) / d, (b[1] - a[1]) / d))
    return out
def inside(cs, x, y):
    w = 0
    for c in cs:
        n = len(c)
        for i in range(n):
            a, b = c[i], c[(i + 1) % n]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                if a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]) > x: w += 1 if b[1] > a[1] else -1
    return w != 0
def scan(f, ch, lines):
    g = lib.g(f, ch); k = 1000 / f["head"].unitsPerEm
    cs = [[(x * k, y * k) for x, y in c] for c in g.cs]
    segs = [(c[i], c[(i + 1) % len(c)]) for c in cs for i in range(len(c))]
    res = []
    for c in cs:
        pts = resample(c, 6)
        for (x, y, tx, ty) in pts:
            for nx, ny in ((-ty, tx), (ty, -tx)):
                if inside(cs, x + nx * 1.5, y + ny * 1.5): break
            else: continue
            best = None
            for a, b in segs:
                ex, ey = b[0] - a[0], b[1] - a[1]; den = nx * ey - ny * ex
                if abs(den) < 1e-9: continue
                t = ((a[0] - x) * ey - (a[1] - y) * ex) / den; u = ((a[0] - x) * ny - (a[1] - y) * nx) / den
                if t > 1.0 and 0 <= u <= 1 and (best is None or t < best[0]):
                    L = math.hypot(ex, ey); best = (t, ex / L, ey / L)
            if not best or best[0] > 160: continue
            t, ex, ey = best
            if abs(tx * ex + ty * ey) < math.cos(math.radians(25)): continue     # edges not near parallel
            level = abs(ty) < 0.12
            serif = level and any(abs(y - l) < 45 or abs(y + ny * t - l) < 45 for l in lines) and t < 45
            res.append((t, round(x), round(y), "serif" if serif else "level" if level else "upright" if abs(tx) < 0.12 else "slant"))
    return res
if __name__ == "__main__":
    chars = sys.argv[1]
    for label, f in faces():
        k = 1000 / f["head"].unitsPerEm
        xh, cap = f["OS/2"].sxHeight * k, f["OS/2"].sCapHeight * k
        asc = lib.g(f, "l").y1 * k; desc = lib.g(f, "p").y0 * k
        n = lib.g(f, "n").h(f["OS/2"].sxHeight * .5)[0]; ns = (n[1] - n[0]) * k
        H = lib.g(f, "H").h(f["OS/2"].sCapHeight * .25)[0]; Hs = (H[1] - H[0]) * k
        print(f"== {label}  n stem {ns:.0f}  H stem {Hs:.0f}  (thinnest non-serif crossing: units, in stems, at x,y, kind | thinnest serif)")
        row = []
        for ch in chars:
            r = scan(f, ch, (0, xh, cap, asc, desc))
            st = Hs if (ch.isupper() or ch.isdigit()) else ns
            body = sorted(x for x in r if x[3] != "serif"); ser = sorted(x for x in r if x[3] == "serif")
            # the thinnest that persists: 5th smallest sample, so one stray ray does not set it
            b = body[min(4, len(body) - 1)] if body else None; s = ser[min(4, len(ser) - 1)] if ser else None
            row.append(f"{ch} {b[0]:.0f} {b[0]/st:.2f} @{b[1]},{b[2]} {b[3]}" + (f" | {s[0]:.0f}" if s else ""))
        print("\n".join(row))
