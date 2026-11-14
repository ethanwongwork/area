import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
from fontTools.ttLib import TTFont
def ray(g, cx, cy, a, R):
    dx, dy = math.cos(math.radians(a)), math.sin(math.radians(a)); prev = False; st = None; sp = []
    t = 0
    while t < R:
        x, y = cx + dx * t, cy + dy * t
        ins = any(s[0] <= x <= s[1] for s in g.h(y))
        if ins and not prev: st = t
        if prev and not ins: sp.append(t - st)
        prev = ins; t += R / 1500
    return sp[-1] if sp else None
fs = faces() + [("LibreBask", TTFont("build/libre-baskerville/LibreBaskerville-Regular.ttf"))] if os.path.exists("build/libre-baskerville/LibreBaskerville-Regular.ttf") else faces()
for label, f in fs:
    xh = f["OS/2"].sxHeight; cap = f["OS/2"].sCapHeight; k = 1000 / f["head"].unitsPerEm
    n = lib.g(f, "n"); L, R = n.h(xh * .5)[0]; stem = R - L
    out = [f"{label:10} x/cap {xh/cap:.3f} stem/x {stem/xh:.3f}"]
    for ch in "oe":
        g = lib.g(f, ch); cx, cy = (g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2
        th = {a: ray(g, cx, cy, a, xh) for a in range(0, 360, 3)}
        th = {a: v for a, v in th.items() if v}
        top = min((a for a in th if 45 <= a <= 135), key=lambda a: th[a]); bot = min((a for a in th if 225 <= a <= 315), key=lambda a: th[a])
        thick = max(th.values()); thin = min(th[top], th[bot])
        out.append(f"{ch}: thin at {top} and {bot} deg (axis tilt {((top - 90) + (bot - 270)) / 2:+.0f}), contrast {thick/thin:.2f}")
    # head serif slope on n and l: top edge of the flag left of the stem
    for ch in "nl":
        g = lib.g(f, ch); sp = g.h((xh if ch == "n" else g.y1) * .5)[0]; s = sp[1] - sp[0]
        x1, x2 = sp[0] - .6 * s, sp[0] - .1 * s
        y1, y2 = g.v(x1)[-1][1], g.v(x2)[-1][1]
        out.append(f"{ch} flag {math.degrees(math.atan2(y2 - y1, x2 - x1)):.0f} deg")
    c = lib.g(f, "c"); ys = [y for y in range(int(xh * .2), int(xh * .8), max(1, int(xh / 100)))]
    # aperture: vertical gap at the right end between the top terminal's lowest ink and the tail's highest ink
    x = c.x1 - (c.x1 - c.x0) * 0.08; v = c.v(x)
    if len(v) >= 2: out.append(f"c aperture {(v[-1][0] - v[0][1]) / xh:.2f} x")
    e = lib.g(f, "e"); v = e.v((e.x0 + e.x1) / 2)
    if len(v) >= 3: out.append(f"e bar at {(v[1][0] + v[1][1]) / 2 / xh:.2f} x, eye {(v[2][0] - v[1][1]) / xh:.2f} x")
    for ch, h in (("a", xh), ("R", cap), ("H", cap), ("O", cap), ("o", xh)):
        g = lib.g(f, ch); out.append(f"{ch} w/h {(g.x1 - g.x0) / h:.2f}")
    print("  ".join(out))
