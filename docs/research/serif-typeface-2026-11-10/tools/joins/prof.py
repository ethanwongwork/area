"""Serif and arm profiles in stems, three faces. Measurement only."""
import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools"))
import lib
from fontTools.ttLib import TTFont
def faces(area="build/AreaSerif-Regular.ttf"):
    return [("Area", TTFont(area)), ("Georgia", lib.georgia("Regular")), ("Serrif", lib.serrif())]
def xh(f): return f["OS/2"].sxHeight
def cap(f): return f["OS/2"].sCapHeight
def foot(f, ch, height):
    g = lib.g(f, ch); sp = g.h(height * 0.5); L, R = sp[0]; stem = R - L
    out = []
    for d in (1.0, .9, .8, .7, .6, .5, .4, .3, .2, .1, .05):   # distance left of the stem's left edge, in stems
        x = L - d * stem
        v = [s for s in g.v(x) if s[0] < height * 0.2]
        out.append((d, round((v[0][1] - max(v[0][0], 0)) / stem, 2) if v else None))
    # climb up the stem: excess width at heights above the baseline
    up = []
    for hgt in (.4, .5, .6, .7, .8, .9, 1.0, 1.2):
        s = g.h(hgt * stem)[0]; up.append((hgt, round((L - s[0]) / stem, 2)))
    return stem, out, up
if __name__ == "__main__":
    for ch, hk in (("n", xh), ("l", xh), ("H", cap), ("I", cap)):
        print("==", ch, "left foot, outer side: serif thickness at d stems from the stem; then excess at height (stems)")
        for label, f in faces(*sys.argv[1:2]):
            stem, out, up = foot(f, ch, hk(f))
            print(f"{label:8} stem {stem/ f['head'].unitsPerEm*1000:5.1f}/1000 ", " ".join(f"{d}:{t}" for d, t in out))
            print(" " * 26, " ".join(f"{h}:{e}" for h, e in up))
