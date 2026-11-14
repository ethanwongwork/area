"""Stroke and ink audit, three faces. Per glyph: the upright strokes (median crossing between upright edges), the
level strokes that are not serifs, the thin and thick of leaning and curved strokes, and the ink: grey (ink over
advance x zone height), and how the ink splits top/bottom and left/right. Every Area value is shown as a ratio to the
same value in each reference after dividing by the class stem (n or H), so a glyph that is heavy or light FOR THIS
FACE stands out whatever the faces' weights. Run from typefaces/area-serif; writes a table to stdout."""
import sys, os, math, statistics as st
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces
from thin import scan
from PIL import Image, ImageDraw, ImageChops
CH = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
def raster(f, ch, zone):
    g = lib.g(f, ch); k = 1000 / f["head"].unitsPerEm; lo, hi = zone
    W, Hh = int(g.adv * k) + 400, 1400; ox, oy = 200, 1000
    acc = None
    for c in g.cs:
        layer = Image.new("1", (W, Hh), 0); ImageDraw.Draw(layer).polygon([(ox + x * k, oy - y * k) for x, y in c], fill=1)
        acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
    im = acc.convert("L")
    ink = lambda box: im.crop(box).histogram()[255]
    total = ink((0, 0, W, Hh)); x0, x1 = ox + g.x0 * k, ox + g.x1 * k; y0, y1 = oy - g.y1 * k, oy - g.y0 * k
    midy = oy - (lo + hi) / 2; midx = (x0 + x1) / 2
    return dict(grey=total / (g.adv * k * (hi - lo)), top=ink((0, 0, W, int(midy))) / total, left=ink((0, 0, int(midx), Hh)) / total,
                dens=total / ((x1 - x0) * (y1 - y0)))
data = {}
for label, f in faces(*sys.argv[1:2]):
    k = 1000 / f["head"].unitsPerEm
    xh, cap = f["OS/2"].sxHeight * k, f["OS/2"].sCapHeight * k
    asc = lib.g(f, "l").y1 * k; desc = lib.g(f, "p").y0 * k; figh = lib.g(f, "0").y1 * k
    n = lib.g(f, "n").h(f["OS/2"].sxHeight * .5)[0]; ns = (n[1] - n[0]) * k
    Hs = lib.g(f, "H").h(f["OS/2"].sCapHeight * .25)[0]; hs = (Hs[1] - Hs[0]) * k
    for ch in CH:
        s_ = hs if (ch.isupper() or ch.isdigit()) else ns
        r = scan(f, ch, (0, xh, cap, asc, desc))
        up = sorted(t for t, x, y, kd in r if kd == "upright" and 0.6 * s_ <= t <= 1.45 * s_)
        lv = sorted(t for t, x, y, kd in r if kd == "level" and 0.25 * s_ <= t <= 0.85 * s_)
        sl = sorted(t for t, x, y, kd in r if kd == "slant" and t >= 0.42 * s_ and t <= 1.5 * s_)
        body = sorted(t for t, x, y, kd in r if kd != "serif")
        zone = (0, cap) if ch.isupper() else (0, figh) if ch.isdigit() else (0, xh)
        d = dict(up=st.median(up) / s_ if len(up) >= 6 else None, upmax=up[int(len(up) * .9)] / s_ if len(up) >= 6 else None,
                 lv=st.median(lv) / s_ if len(lv) >= 6 else None,
                 thin=sl[int(len(sl) * .08)] / s_ if len(sl) >= 12 else None, thick=sl[int(len(sl) * .92)] / s_ if len(sl) >= 12 else None)
        d.update(raster(f, ch, zone)); d["greyn"] = d["grey"] / (s_ / (zone[1] - zone[0]))
        data[(label, ch)] = d
def col(ch, key, w=5):
    a, g, s = (data[(L, ch)].get(key) for L in ("Area", "Georgia", "Serrif"))
    f = lambda v: f"{v:{w}.2f}" if v is not None else " " * (w - 1) + "-"
    return f(a) + f(g) + f(s)
print("in class stems (n or H): upright stroke median | upright p90 | level stroke (not serif) | lean/curve thin p8 | lean/curve thick p92    each: Area R1 R2")
for ch in CH:
    print(ch, " up", col(ch, "up"), " upmax", col(ch, "upmax"), " level", col(ch, "lv"), " thin", col(ch, "thin"), " thick", col(ch, "thick"))
print("\nink: grey over stem share (grey / (stem / zone height)): Area R1 R2 | Area/R1 Area/R2 | top share A R1 R2 | left share A R1 R2")
rows = []
for ch in CH:
    a, g, s = (data[(L, ch)] for L in ("Area", "Georgia", "Serrif"))
    rows.append((ch, a["greyn"] / g["greyn"], a["greyn"] / s["greyn"]))
    print(ch, f"{a['greyn']:.2f} {g['greyn']:.2f} {s['greyn']:.2f} | {a['greyn']/g['greyn']:.3f} {a['greyn']/s['greyn']:.3f} | {a['top']:.3f} {g['top']:.3f} {s['top']:.3f} | {a['left']:.3f} {g['left']:.3f} {s['left']:.3f}")
for name, sel in (("lowercase", str.islower), ("capitals", str.isupper), ("figures", str.isdigit)):
    r1 = [r[1] for r in rows if sel(r[0])]; r2 = [r[2] for r in rows if sel(r[0])]
    m1, m2 = st.median(r1), st.median(r2)
    print(f"\n{name}: median Area/R1 {m1:.3f}, Area/R2 {m2:.3f}. Glyphs whose ink is off the class by more than 5% against BOTH references (heavy +, light -):")
    for ch, a, b in rows:
        if sel(ch):
            da, db = a / m1 - 1, b / m2 - 1
            if abs(da) > .05 and abs(db) > .05 and da * db > 0: print(f"   {ch} {da:+.1%} vs R1, {db:+.1%} vs R2")
    print("  off against one reference by more than 8%:", " ".join(f"{ch}({a/m1-1:+.0%},{b/m2-1:+.0%})" for ch, a, b in rows if sel(ch) and (abs(a / m1 - 1) > .08 or abs(b / m2 - 1) > .08)))
