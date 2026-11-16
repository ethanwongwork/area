"""Before over after: the new build filled, the old build's outline in red, the new outline in black, with the new
build's curvature comb. Usage: python ba.py out.png OLD.ufo glyph[:x0,y0,x1,y1] ... [--scale 0.6] [--cols 4]"""
import sys, ufoLib2, math
import evlib as E
from PIL import Image, ImageDraw, ImageChops


def cs(f, n):
    pen = E.SegPen(f); f[n].draw(pen); return [c for c in pen.contours if c]


def plate(new, old, n, box, sc, comb=True, ref=None, ch=None):
    C = cs(new, n)
    pts = [p for c in C for s in c for p in s[1:]]
    x0, y0, x1, y1 = box or (min(p[0] for p in pts) - 50, min(-40, min(p[1] for p in pts) - 50), max(p[0] for p in pts) + 50, max(p[1] for p in pts) + 50)
    W, H = int((x1 - x0) * sc), int((y1 - y0) * sc)
    im = Image.new("RGB", (W, H), "white"); d = ImageDraw.Draw(im, "RGBA")
    T = lambda p: ((p[0] - x0) * sc, (y1 - p[1]) * sc)
    acc = None
    for poly in E.flatten(C, 1.5):
        L = Image.new("1", (W, H), 0); ImageDraw.Draw(L).polygon([T(p) for p in poly], fill=1)
        acc = L if acc is None else ImageChops.logical_xor(acc, L)
    im.paste((222, 226, 232), mask=acc.convert("L"))
    if comb:
        for c in C:
            for s in c:
                if s[0] == "L": continue
                m = max(6, int(E.seg_len(s) / 3)); prev = None
                for i in range(m + 1):
                    t = i / m; p = E.pt(s, t); dx, dy = E.d1(s, t); l = math.hypot(dx, dy)
                    if l < 1e-6: continue
                    k = E.curvature(s, t)
                    if abs(k) > 1 / 14: prev = None; continue
                    q = (p[0] + dy / l * k * 2600, p[1] - dx / l * k * 2600)
                    d.line([T(p), T(q)], fill=(36, 86, 201, 60))
                    if prev: d.line([T(prev), T(q)], fill=(36, 86, 201, 255))
                    prev = q
    if ref and ch:
        f = E.face(ref); rc, _ = E.segs(f, ch); m = E.metrics(f)
        k = 520 / m["xh"] if ch.islower() else 712 / m["cap"]
        rx0 = min(p[0] for c in rc for s in c for p in s[1:]) * k; ax0 = min(p[0] for p in pts)
        for poly in E.flatten(rc, 2):
            q = [T((p[0] * k - rx0 + ax0, p[1] * k)) for p in poly]; d.line(q + [q[0]], fill=(0, 150, 90, 255), width=1)
    if old is not None and n in old:
        for poly in E.flatten(cs(old, n), 1.5):
            q = [T(p) for p in poly]; d.line(q + [q[0]], fill=(214, 60, 40, 255), width=1)
    for poly in E.flatten(C, 1.5):
        q = [T(p) for p in poly]; d.line(q + [q[0]], fill=(20, 23, 28, 255), width=1)
    d.text((6, 4), n, fill=(0, 0, 0, 255))
    return im


if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    o = {sys.argv[i][2:]: sys.argv[i + 1] for i in range(len(sys.argv) - 1) if sys.argv[i].startswith("--")}
    a = [x for x in a if x not in o.values()]
    out, oldp, items = a[0], a[1], a[2:]
    new = ufoLib2.Font.open(E.AREA_UFO); old = ufoLib2.Font.open(oldp)
    cmap = E.face("area").getBestCmap()
    ims = []
    for it in items:
        n, _, b = it.partition(":")
        g = cmap.get(ord(n), n) if len(n) == 1 else n
        ims.append(plate(new, old, g, tuple(float(v) for v in b.split(",")) if b else None, float(o.get("scale", 0.6)), "nocomb" not in o, o.get("ref"), n if len(n) == 1 else None))
    cols = int(o.get("cols", 4)); cw, ch = max(i.width for i in ims), max(i.height for i in ims)
    sh = Image.new("RGB", (cw * min(cols, len(ims)), ch * ((len(ims) + cols - 1) // cols)), "white")
    for i, im in enumerate(ims): sh.paste(im, ((i % cols) * cw, (i // cols) * ch))
    sh.save(out); print(out, sh.size)
