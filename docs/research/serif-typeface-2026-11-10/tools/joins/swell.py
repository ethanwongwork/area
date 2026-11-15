"""Thick/thin transitions, every stroke of every glyph. Walks each contour in steps of 5 units, and at each step
measures the stroke across (a ray along the inward normal to the facing edge, counted when that edge is within 35
degrees of parallel). Along each run of such crossings it reports:
  rate   the fastest change of thickness, in units of thickness per unit travelled (over a 40-unit window);
  bumps  places where thickness turns back by 2 to 12 units and recovers within 160 units: a swell that is not even.
A smooth swell (o, c) changes by under 0.20 and has no bumps. Usage: swell.py [font.ttf] [chars]"""
import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from fontTools.ttLib import TTFont
STEP = 5
JUMP = 5                                         # units between neighbouring crossings
def walk(c):
    out = []; n = len(c)
    for i in range(n):
        a, b = c[i], c[(i + 1) % n]; d = math.hypot(b[0] - a[0], b[1] - a[1])
        if d < 1e-6: continue
        k = max(1, int(round(d / STEP)))
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
def runs(f, ch):
    g = lib.g(f, ch); k = 1000 / f["head"].unitsPerEm
    cs = [[(x * k, y * k) for x, y in c] for c in g.cs]
    segs = [(c[i], c[(i + 1) % len(c)]) for c in cs for i in range(len(c))]
    out = []
    for c in cs:
        seq = []
        for (x, y, tx, ty) in walk(c):
            nx, ny = (-ty, tx) if inside(cs, x - ty * 1.5, y + tx * 1.5) else (ty, -tx)
            best = None
            for a, b in segs:
                ex, ey = b[0] - a[0], b[1] - a[1]; den = nx * ey - ny * ex
                if abs(den) < 1e-9: continue
                t = ((a[0] - x) * ey - (a[1] - y) * ex) / den; u = ((a[0] - x) * ny - (a[1] - y) * nx) / den
                if t > 1.0 and 0 <= u <= 1 and (best is None or t < best[0]):
                    L = math.hypot(ex, ey); best = (t, ex / L, ey / L)
            ok = best is not None and best[0] < 150 and abs(tx * best[1] + ty * best[2]) > math.cos(math.radians(35))
            seq.append((x, y, best[0] if ok else None))
        # split into runs of valid crossings (the contour is closed: rotate to start at a gap)
        n = len(seq)
        gaps = [i for i, s in enumerate(seq) if s[2] is None]
        if not gaps:                               # no gap: start at the largest jump, so runs still split there
            gaps = [max(range(n), key=lambda i: abs(seq[i][2] - seq[i - 1][2]))]
        seq = seq[gaps[0]:] + seq[:gaps[0]]; cur = []
        for s in seq:
            # a run ends where no facing edge is found, or where the crossing jumps (the ray has moved onto another
            # edge: a junction, not a swell)
            if s[2] is None or (cur and abs(s[2] - cur[-1][2]) > JUMP):
                if len(cur) >= 24: out.append(cur)
                cur = [] if s[2] is None else [s]
            else: cur.append(s)
        if len(cur) >= 24: out.append(cur)
    return out
def analyse(run):
    t = [s[2] for s in run]; n = len(t)
    sm = [sum(t[max(0, i - 2):i + 3]) / len(t[max(0, i - 2):i + 3]) for i in range(n)]
    W = 8                                        # 40 units
    rate = (0, None)
    for i in range(4, n - W - 4):
        r = abs(sm[i + W] - sm[i]) / (W * STEP)
        if r > rate[0]: rate = (r, run[i + W // 2])
    # bumps: local extremum followed by a turn back of 2-12 units and another turn within 160 units
    ext = []
    for i in range(3, n - 3):
        if (sm[i] >= max(sm[i - 3:i + 4]) or sm[i] <= min(sm[i - 3:i + 4])) and (not ext or i - ext[-1] > 3): ext.append(i)
    bumps = []
    for a, b, c_ in zip(ext, ext[1:], ext[2:]):
        d1, d2 = sm[b] - sm[a], sm[c_] - sm[b]
        if d1 * d2 < 0 and 2 <= min(abs(d1), abs(d2)) <= 12 and (c_ - a) * STEP <= 160 and 6 < b < n - 6:
            bumps.append((round(run[b][0]), round(run[b][1]), round(min(abs(d1), abs(d2)), 1)))
    return rate, bumps
if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "build/AreaSerif-Regular.ttf"
    chars = sys.argv[2] if len(sys.argv) > 2 else "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    f = TTFont(path) if os.path.exists(path) else None
    for ch in chars:
        R = [analyse(r) for r in runs(f, ch)]
        if not R: print(ch, "-"); continue
        R = [r for r in R if r[0][1] is not None]
        if not R: print(ch, "-"); continue
        tops = sorted(R, key=lambda r: -r[0][0])[:3]
        bumps = [b for r in R for b in r[1]]
        print(f"{ch}  " + "  ".join(f"{r[0][0]:.2f}@({r[0][1][0]:.0f},{r[0][1][1]:.0f})" for r in tops) + ("   bumps " + " ".join(f"({x},{y}):{a}" for x, y, a in bumps) if bumps else ""))
