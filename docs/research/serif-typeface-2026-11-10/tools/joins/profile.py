"""A glyph's strokes level by level and column by column, three faces, in n stems: at each height the leftmost and
rightmost horizontal crossings; at each column the topmost and bottommost vertical crossings. Shows where one face's
letter carries more ink than another's. Usage: profile.py <char> [area.ttf]"""
import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
ch = sys.argv[1]
F = faces(*sys.argv[2:3])
def st(f):
    xh = f["OS/2"].sxHeight; n = lib.g(f, "n").h(xh * .5)[0]; return n[1] - n[0], xh
print(f"{ch}: by height (share of the glyph's own height from its bottom): left crossing / right crossing, in stems   Area | R1 | R2")
for k in (.05, .12, .2, .3, .4, .5, .6, .7, .8, .88, .95):
    row = []
    for label, f in F:
        s_, xh = st(f); g = lib.g(f, ch); sp = g.h(g.y0 + k * (g.y1 - g.y0))
        row.append(f"{(sp[0][1]-sp[0][0])/s_:.2f} / {(sp[-1][1]-sp[-1][0])/s_:.2f} ({len(sp)})" if sp else "-")
    print(f"  {k:.2f}   " + "  |  ".join(row))
print("by column (share of the width from the left): top crossing / bottom crossing, in stems")
for k in (.1, .2, .3, .4, .5, .6, .7, .8, .9):
    row = []
    for label, f in F:
        s_, xh = st(f); g = lib.g(f, ch); sp = g.v(g.x0 + k * (g.x1 - g.x0))
        row.append(f"{(sp[-1][1]-sp[-1][0])/s_:.2f} / {(sp[0][1]-sp[0][0])/s_:.2f} ({len(sp)})" if sp else "-")
    print(f"  {k:.2f}   " + "  |  ".join(row))
row = []
for label, f in F:
    s_, xh = st(f); g = lib.g(f, ch); row.append(f"{label} w {(g.x1-g.x0)/xh:.3f} h {(g.y1-g.y0)/xh:.3f}")
print("  ".join(row))
