"""Review plates for eyes: a glyph from Area Serif's cubic UFO drawn large with its nodes, handles, curvature comb
and the curve tests' findings marked. Optional outline of a reference face over it (drawn, never stored).

Usage: python look.py out.png a b c ... [--ref serrif] [--zoom x0,y0,x1,y1] [--scale 1.0] [--cols 4] [--nocomb]"""
import json
import math
import os
import sys

import ufoLib2
from PIL import Image, ImageDraw, ImageFont

import evlib as E

COMB = 2600           # comb length = curvature x COMB units


def ufo_contours(ufo, name):
    pen = E.SegPen(ufo)
    ufo[name].draw(pen)
    return [c for c in pen.contours if c], ufo[name].width


def plate(ufo, name, findings, scale, box=None, comb=True, ref=None, ch=None):
    cs, adv = ufo_contours(ufo, name)
    pts = [p for c in cs for s in c for p in s[1:]]
    x0, y0, x1, y1 = box or (min(p[0] for p in pts) - 60, min(-40, min(p[1] for p in pts) - 60),
                             max(p[0] for p in pts) + 60, max(p[1] for p in pts) + 60)
    W, H = int((x1 - x0) * scale), int((y1 - y0) * scale)
    im = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(im, "RGBA")

    def T(p):
        return ((p[0] - x0) * scale, (y1 - p[1]) * scale)

    for y, col in ((0, (0, 0, 0, 70)), (520, (0, 0, 0, 40)), (712, (0, 0, 0, 40)), (780, (0, 0, 0, 25)), (-224, (0, 0, 0, 25))):
        d.line([T((x0, y)), T((x1, y))], fill=col)
    # fill
    mask = Image.new("L", (W, H), 0)
    from PIL import ImageChops
    acc = None
    for poly in E.flatten(cs, 1.5):
        layer = Image.new("1", (W, H), 0)
        ImageDraw.Draw(layer).polygon([T(p) for p in poly], fill=1)
        acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
    if acc is not None:
        im.paste((226, 229, 235), mask=acc.convert("L"))
    if ref and ch:
        f = E.face(ref)
        rc, radv = E.segs(f, ch)
        if rc:
            # align on the left edge of the ink and scale by x-height
            mref = E.metrics(f)
            k = 520 / mref["xh"] if ch in E.LOWER else 712 / mref["cap"]
            rx0 = min(p[0] for c in rc for s in c for p in s[1:]) * k
            ax0 = min(p[0] for p in pts)
            for poly in E.flatten(rc, 2):
                q = [T((p[0] * k - rx0 + ax0, p[1] * k)) for p in poly]
                d.line(q + [q[0]], fill=(214, 60, 40, 200), width=1)
    # comb
    if comb:
        for c in cs:
            for s in c:
                if s[0] == "L":
                    continue
                L = E.seg_len(s)
                n = max(6, int(L / 3))
                prev = None
                for i in range(n + 1):
                    t = i / n
                    p = E.pt(s, t)
                    dx, dy = E.d1(s, t)
                    l = math.hypot(dx, dy)
                    if l < 1e-6:
                        continue
                    k = E.curvature(s, t)
                    if abs(k) > 1 / 14:                  # a rounded corner: not part of the arc
                        prev = None
                        continue
                    kk = k
                    q = (p[0] + dy / l * kk * COMB, p[1] - dx / l * kk * COMB)
                    d.line([T(p), T(q)], fill=(36, 86, 201, 70))
                    if prev:
                        d.line([T(prev), T(q)], fill=(36, 86, 201, 255))
                    prev = q
    # outline, handles, nodes
    for poly in E.flatten(cs, 1.5):
        q = [T(p) for p in poly]
        d.line(q + [q[0]], fill=(20, 23, 28, 255), width=1)
    for c in cs:
        for s in c:
            if s[0] == "C":
                d.line([T(s[1]), T(s[2])], fill=(0, 140, 90, 160))
                d.line([T(s[4]), T(s[3])], fill=(0, 140, 90, 160))
                for h in (s[2], s[3]):
                    x, y = T(h)
                    d.ellipse([x - 2, y - 2, x + 2, y + 2], outline=(0, 140, 90, 255))
            x, y = T(s[1])
            d.rectangle([x - 2.5, y - 2.5, x + 2.5, y + 2.5], fill=(20, 23, 28, 255))
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 11)
    except OSError:
        font = None
    for f in findings or []:
        if f["sev"] == "low":
            continue
        x, y = T((f["x"], f["y"]))
        col = (220, 40, 40, 255) if f["sev"] == "high" else (230, 140, 0, 255)
        d.ellipse([x - 9, y - 9, x + 9, y + 9], outline=col, width=2)
        d.text((x + 11, y - 6), f"{f['test']} {f['detail'][:38]}", fill=col, font=font)
    d.text((6, 4), name, fill=(0, 0, 0, 255), font=font)
    return im


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opt = {sys.argv[i][2:]: (sys.argv[i + 1] if i + 1 < len(sys.argv) and not sys.argv[i + 1].startswith("--") else "1")
           for i in range(len(sys.argv)) if sys.argv[i].startswith("--")}
    # option values were swallowed into args; drop them
    vals = set(v for v in opt.values() if v != "1")
    args = [a for a in args if a not in vals]
    out, names = args[0], args[1:]
    scale = float(opt.get("scale", 1.0))
    cols = int(opt.get("cols", 4))
    box = tuple(float(v) for v in opt["zoom"].split(",")) if "zoom" in opt else None
    ufo = ufoLib2.Font.open(E.AREA_UFO)
    cmap = E.face("area").getBestCmap()
    data = json.load(open(os.path.join(E.OUT, "curves.json")))["nodes"]
    ims = []
    for n in names:
        gname = cmap.get(ord(n), n) if len(n) == 1 else n
        ims.append(plate(ufo, gname, data.get(gname), scale, box, "nocomb" not in opt, opt.get("ref"), n if len(n) == 1 else None))
    cw, chh = max(i.width for i in ims), max(i.height for i in ims)
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cw * min(cols, len(ims)), chh * rows), "white")
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % cols) * cw, (i // cols) * chh))
    sheet.save(out)
    print(out, sheet.size)


if __name__ == "__main__":
    main()
