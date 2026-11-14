"""Serif overhang on leaning strokes, three faces, in class stems: how far the serif runs past the stroke on its
open side (the stroke leans away) and its closed side (the stroke leans back over it), measured at the serif's inner
edge from the stroke's own edge lines (taken at two heights clear of the bracket). Run from typefaces/area-serif."""
import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
CASES = [("v", "top"), ("w", "top"), ("x", "top"), ("x", "bottom"), ("y", "top"), ("V", "top"), ("W", "top"), ("X", "top"), ("X", "bottom"), ("Y", "top"), ("A", "bottom"), ("K", "top")]
def measure(f, ch, end):
    up = ch.isupper(); H = f["OS/2"].sCapHeight if up else f["OS/2"].sxHeight
    ref = lib.g(f, "H" if up else "n").h(H * (.25 if up else .5))[0]; s_ = ref[1] - ref[0]
    g = lib.g(f, ch)
    tipy = (H - 0.17 * s_) if end == "top" else 0.17 * s_
    sp = g.h(tipy)
    tip = 0.36 * s_
    inner = (H - tip) if end == "top" else tip
    y1, y2 = (H * .70, H * .58) if end == "top" else (H * .30, H * .42)
    if ch in "xX": y1, y2 = (H * .82, H * .74) if end == "top" else (H * .18, H * .26)
    a, b = g.h(y1), g.h(y2)
    out = []
    if len(a) != len(b) or len(sp) < 2: return s_, None
    pairs = [(0, 0), (len(sp) - 1, len(a) - 1)] if len(sp) != len(a) else [(i, i) for i in range(len(sp))]
    for si, ai in pairs:
        L = a[ai][0] + (b[ai][0] - a[ai][0]) * (inner - y1) / (y2 - y1)
        R = a[ai][1] + (b[ai][1] - a[ai][1]) * (inner - y1) / (y2 - y1)
        out.append(((L - sp[si][0]) / s_, (sp[si][1] - R) / s_, (sp[si][1] - sp[si][0]) / s_))
    return s_, out
print("glyph end: for each serif left to right: overhang left / right of the stroke (total width), in stems   Area | R1 | R2")
for ch, end in CASES:
    row = []
    for label, f in faces(*sys.argv[1:2]):
        s_, o = measure(f, ch, end)
        row.append("  ".join(f"{l:.2f}/{r:.2f} ({w:.2f})" for l, r, w in o) if o else "-")
    print(f"  {ch} {end:6} " + "   |   ".join(row))
