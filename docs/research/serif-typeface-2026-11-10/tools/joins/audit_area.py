"""Ink per glyph without spacing in it: ink area / (class stem x zone height), i.e. how many stem-wide strokes of
full height the glyph's ink equals. Area's value over each reference's, then against the class median of that ratio:
a glyph over or under its class against BOTH references is out of balance for this face. Also ink width / height
against R1 (the widths rule) and advance. Run from typefaces/area-serif."""
import sys, os, statistics as st
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
CH = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
def area(g):
    a = 0
    for c in g.cs:
        s = 0
        for i in range(len(c)):
            x0, y0 = c[i]; x1, y1 = c[(i + 1) % len(c)]; s += x0 * y1 - x1 * y0
        a += s / 2          # signed: counters subtract
    return abs(a)
D = {}
for label, f in faces(*sys.argv[1:2]):
    xh, cap = f["OS/2"].sxHeight, f["OS/2"].sCapHeight; figh = lib.g(f, "1").y1 if label != "x" else 0
    n = lib.g(f, "n").h(xh * .5)[0]; ns = n[1] - n[0]; H = lib.g(f, "H").h(cap * .25)[0]; hs = H[1] - H[0]
    for ch in CH:
        g = lib.g(f, ch); s_, z = (hs, cap) if ch.isupper() else (hs, lib.g(f, "0").y1) if ch.isdigit() else (ns, xh)
        D[(label, ch)] = (area(g) / (s_ * z), (g.x1 - g.x0) / z, g.adv / z, (g.x0) / z, (g.adv - g.x1) / z)
rows = [(ch, D[("Area", ch)][0] / D[("Georgia", ch)][0], D[("Area", ch)][0] / D[("Serrif", ch)][0]) for ch in CH]
for name, sel in (("lowercase", str.islower), ("capitals", str.isupper), ("figures", str.isdigit)):
    m1 = st.median(r[1] for r in rows if sel(r[0])); m2 = st.median(r[2] for r in rows if sel(r[0]))
    print(f"== {name}: Area's ink over R1's {m1:.3f} and R2's {m2:.3f} at the median (more ink per stem: the lower contrast).  glyph: ink A / R1 / R2 ; off class vs R1, vs R2 ; width/height A / R1 (diff)")
    for ch, a, b in rows:
        if not sel(ch): continue
        A, G, S_ = D[("Area", ch)], D[("Georgia", ch)], D[("Serrif", ch)]
        da, db = a / m1 - 1, b / m2 - 1
        flag = " <<" if (abs(da) > .04 and abs(db) > .04 and da * db > 0) else ""
        print(f"  {ch}  {A[0]:.2f} {G[0]:.2f} {S_[0]:.2f}   {da:+.1%} {db:+.1%}{flag}    w/h {A[1]:.3f} {G[1]:.3f} ({A[1]/G[1]-1:+.1%})")
