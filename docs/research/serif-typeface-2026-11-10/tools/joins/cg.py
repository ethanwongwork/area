"""C and G ends in three faces, in cap heights from the glyph's left edge and the baseline."""
import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
for ch in "CG":
    print("==", ch)
    for label, f in faces(*sys.argv[1:2]):
        cap = f["OS/2"].sCapHeight; g = lib.g(f, ch); r = lambda v: f"{v / cap:.3f}"
        # top barb: the rightmost span in the upper part
        rows = []
        for k in (.98, .95, .92, .88, .84, .80, .76, .72, .70, .68, .66):
            sp = [s for s in g.h(k * cap) if s[0] > g.x0 + 0.45 * (g.x1 - g.x0)]
            rows.append(f"{k}:" + (f"{(sp[-1][0]-g.x0)/cap:.3f}-{(sp[-1][1]-g.x0)/cap:.3f}" if sp else "-"))
        top = max(y for c in g.cs for x, y in c if x > g.x0 + 0.6 * (g.x1 - g.x0))
        foot = min(y for c in g.cs for x, y in c if x > g.x0 + 0.6 * (g.x1 - g.x0) and y > 0.5 * cap)
        print(f"{label:8} width {r(g.x1-g.x0)} barb top {r(top)} foot {r(foot)}  span at height: " + " ".join(rows))
        if ch == "G":
            # the bar: widest span in the lower right; the stem under it
            best = max(((s[1] - s[0], y, s) for y in range(int(.2 * cap), int(.6 * cap), max(1, int(cap / 300))) for s in g.h(y) if s[0] > g.x0 + .4 * (g.x1 - g.x0)), key=lambda t: t[0])
            ys = [y for y in range(int(.2 * cap), int(.6 * cap), max(1, int(cap / 600))) if any(abs((s[1] - s[0]) - best[0]) < cap * .01 for s in g.h(y))]
            st = [s for s in g.h(.2 * cap) if s[0] > g.x0 + .4 * (g.x1 - g.x0)][-1]
            low = min(y for c in g.cs for x, y in c if abs(x - st[1]) < cap * .004)
            print(f"         bar top {r(max(ys))} bottom {r(min(ys))} x {r(best[2][0]-g.x0)}-{r(best[2][1]-g.x0)}  stem at 0.2: {r(st[0]-g.x0)}-{r(st[1]-g.x0)} (wide {r(st[1]-st[0])})  stem's right edge ends at {r(low)}")
