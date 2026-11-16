import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
# ink per figure (area / (height^2)) and width/height, three faces: which figures are heavy or wide against the references
def area(g):
    a = 0
    for c in g.cs:
        s = 0
        for i in range(len(c)):
            x0, y0 = c[i]; x1, y1 = c[(i + 1) % len(c)]; s += x0 * y1 - x1 * y0
        a += s / 2
    return abs(a)
rows = {}
for label, f in faces():
    h = lib.g(f, "1").y1; H = lib.g(f, "H"); hs = H.h(f["OS/2"].sCapHeight * .25)[0]; st = hs[1] - hs[0]
    rows[label] = {d: (area(lib.g(f, d)) / (h * st), (lib.g(f, d).x1 - lib.g(f, d).x0) / h) for d in "0123456789"}
print("ink = area / (height x H stem); width / height")
for d in "0123456789":
    a, g, s = rows["Area"][d], rows["Georgia"][d], rows["Serrif"][d]
    print(f"{d}  ink Area {a[0]:.2f}  R1 {g[0]:.2f}  R2 {s[0]:.2f}   (Area/mean {a[0]/((g[0]+s[0])/2):.2f})   width {a[1]:.3f} / {g[1]:.3f} / {s[1]:.3f}")
