import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
print("horizontal stroke widths in H stems at given heights (share of figure height): left/right spans")
for label, f in faces(*sys.argv[1:2]):
    h = lib.g(f, "1").y1; hs = lib.g(f, "H").h(f["OS/2"].sCapHeight * .25)[0]; st = hs[1] - hs[0]
    O = lib.g(f, "O").h(f["OS/2"].sCapHeight * .5); o = (O[0][1] - O[0][0]) / st
    out = [f"{label:8} O {o:.2f}"]
    for d, k in (("0", .5), ("2", .75), ("3", .75), ("3", .27), ("5", .3), ("6", .3), ("8", .27), ("8", .75), ("9", .7), ("1", .5), ("4", .15), ("7", .3)):
        sp = lib.g(f, d).h(k * h)
        out.append(f"{d}@{k}:" + "/".join(f"{(b-a)/st:.2f}" for a, b in sp))
    print("  ".join(out))
