"""The thin inventory, three faces, in class stems (n for lowercase, H for capitals and figures):
arc = the thinnest vertical crossing of the topmost / bottommost ink over the middle of the glyph (bowls, arches);
diag = perpendicular width of each pair of long straight leaning edges (thin and thick diagonals);
side = the widest horizontal crossing of the leftmost / rightmost ink (the round thick, or a stem).
Run from typefaces/area-serif."""
import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
from fontTools.pens.recordingPen import RecordingPen
ARC = "oceasgbdpqnhmu" "OCGQSDBPRU" "0235689"
DIAG = "vwxyzk" "AVWXYZKMN" "47"
def stems(f):
    xh, cap = f["OS/2"].sxHeight, f["OS/2"].sCapHeight
    n = lib.g(f, "n").h(xh * .5)[0]; H = lib.g(f, "H").h(cap * .25)[0]
    return n[1] - n[0], H[1] - H[0]
def arc(f, ch, s_):
    g = lib.g(f, ch); w = g.x1 - g.x0; top, bot = [], []
    for k in range(30, 71, 2):
        v = g.v(g.x0 + w * k / 100)
        if v: top.append(v[-1][1] - v[-1][0]); bot.append(v[0][1] - v[0][0])
    return min(top) / s_, min(bot) / s_
def diags(f, ch, s_):
    gs = f.getGlyphSet(); pen = RecordingPen(); gs[f.getBestCmap()[ord(ch)]].draw(pen)
    lines = []; cur = None
    for op, a in pen.value:
        if op == "moveTo": cur = start = a[0]
        elif op == "lineTo":
            p = a[0]; dx, dy = p[0] - cur[0], p[1] - cur[1]; L = math.hypot(dx, dy)
            if L > 0.12 * f["head"].unitsPerEm and abs(dx) > 0.15 * L and abs(dy) > 0.35 * L: lines.append((cur, p, dx / L, dy / L, L))
            cur = p
        elif op in ("qCurveTo", "curveTo"): cur = a[-1]
        elif op == "closePath":
            p = start; dx, dy = p[0] - cur[0], p[1] - cur[1]; L = math.hypot(dx, dy)
            if L > 0.12 * f["head"].unitsPerEm and abs(dx) > 0.15 * L and abs(dy) > 0.35 * L: lines.append((cur, p, dx / L, dy / L, L))
    out = []
    for i in range(len(lines)):
        for j in range(i + 1, len(lines)):
            a, b = lines[i], lines[j]
            if abs(a[2] * b[2] + a[3] * b[3]) < 0.992: continue           # within about 7 degrees of parallel
            mx, my = (b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2
            d = abs((mx - a[0][0]) * a[3] - (my - a[0][1]) * a[2])
            # the two edges must face each other: project b's midpoint onto a's span
            t = ((mx - a[0][0]) * a[2] + (my - a[0][1]) * a[3]) / a[4]
            if 0.03 * s_ * 10 < d < 1.6 * s_ and -0.3 <= t <= 1.3: out.append(round(d / s_, 2))
    return sorted(set(out))
F = faces(*sys.argv[1:2])
S = {label: stems(f) for label, f in F}
print("arc thin, top / bottom, in class stems:   Area | R1 | R2")
for ch in ARC:
    row = []
    for label, f in F:
        s_ = S[label][0] if ch.islower() else S[label][1]
        t, b = arc(f, ch, s_); row.append(f"{t:.2f} / {b:.2f}")
    print(f"  {ch}   " + "  |  ".join(row))
print("\nstraight diagonals, perpendicular widths in class stems:   Area | R1 | R2")
for ch in DIAG:
    row = []
    for label, f in F:
        s_ = S[label][0] if ch.islower() else S[label][1]
        row.append(" ".join(f"{d:.2f}" for d in diags(f, ch, s_)) or "-")
    print(f"  {ch}   " + "  |  ".join(row))
