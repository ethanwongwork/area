"""Head serifs (flags) in three faces: slope, tip thickness, where the tip and the stem's corner sit, length."""
import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
for ch in "nibdhklmpru":
    print("==", ch)
    for label, f in faces():
        xh = f["OS/2"].sxHeight; g = lib.g(f, ch)
        asc = ch in "bdhkl"; ref = g.y1 if asc else xh
        hs = g.h(xh * 0.4); sp = hs[-1] if ch == "d" else hs[0]; s = sp[1] - sp[0]
        top_at = lambda x: g.v(x)[-1]
        # flag: left of the stem, at the top
        xs = [sp[0] - k * s for k in (0.15, 0.3, 0.45, 0.6, 0.75)]
        tops = [(x, [v for v in g.v(x) if v[1] > ref * 0.8]) for x in xs]
        tops = [(x, v[-1]) for x, v in tops if v]
        (x1, v1), (x2, v2) = tops[-1], tops[0]
        slope = math.degrees(math.atan2(v2[1] - v1[1], x2 - x1))
        left = min(a for a, b in g.h(v1[0] + (v1[1] - v1[0]) / 2))
        corner = g.v(sp[0] + s * 0.05)[-1][1]
        print(f"{label:8} slope {slope:4.1f}  tip thick {(v1[1]-v1[0])/s:.2f}  tip top {v1[1]/xh:.3f}x  corner {corner/xh:.3f}x  underside {v1[0]/xh:.3f}x  length {(sp[0]-left)/s:.2f}")
