"""Outlines with their nodes, handles and curvature combs (0.81), Area Serif only, for the owner's point-editor
reading: a comb tooth stands on the outline along its normal, as long as the curvature there, so a dent or a bump
shows as a step in the comb's edge and a flat as a comb that falls to nothing.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/combs.py \
        OUT.png g [g.ss02 ...] [--ufo build/AreaSerif-Regular.ufo] [--before OTHER.ufo] [--y -300,140]

With --before, each glyph is drawn twice, the other UFO's above (grey label "before") and this one below.
Nothing licensed is drawn."""
import math
import os
import sys

import ufoLib2
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
sys.path.insert(0, SERIF)
import curvecheck as K  # noqa: E402

COMB = 3000            # tooth length per unit of curvature, in font units (radius 100 -> 30 units)


def font_label(px):
    for f in ("/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/Supplemental/Arial.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, px)
    return ImageFont.load_default()


def draw_glyph(points_lists, width, s, title, yr=None, box=(-320, -300, 1000, 820), comb=COMB, nodes=True,
               numbers=False):
    """One panel: fill, combs (only on curves inside yr, all when None), outline, handles, nodes."""
    x0, y0, x1, y1 = box
    W, H = int((x1 - x0) * s), int((y1 - y0) * s) + 40
    im = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(im)
    T = lambda p: ((p[0] - x0) * s, 40 + (y1 - p[1]) * s)
    for y in (0, 520, -224):
        d.line([T((x0, y)), T((x1, y))], fill=(225, 225, 235), width=1)
    d.line([T((0, y0)), T((0, y1))], fill=(235, 235, 235))
    d.line([T((width, y0)), T((width, y1))], fill=(235, 235, 235))
    # fill, even-odd over flattened contours
    from PIL import ImageChops
    acc = Image.new("1", (W, H), 0)
    for P in points_lists:
        poly = []
        for sgm in K.segments(P):
            n = 1 if sgm[0] == "L" else 40
            poly += [T(K.pt(sgm, i / n)) for i in range(n)]
        layer = Image.new("1", (W, H), 0)
        ImageDraw.Draw(layer).polygon(poly, fill=1)
        acc = ImageChops.logical_xor(acc, layer)
    ink = Image.new("RGB", (W, H), (226, 228, 236))
    im.paste(ink, mask=acc)
    for P in points_lists:
        for sgm in K.segments(P):
            if sgm[0] != "C":
                continue
            ys = [p[1] for p in sgm[1]]
            if yr and not (yr[0] <= min(ys) and max(ys) <= yr[1]):
                continue
            prev = None
            for i in range(0, 41):
                t = i / 40
                p = K.pt(sgm, t)
                dx, dy = K.d1(sgm, t)
                h = math.hypot(dx, dy) or 1
                k = K.curvature(sgm, t)
                L = max(-90, min(90, k * comb))
                nx, ny = dy / h, -dx / h                   # right of travel: outward on a clockwise contour
                q = (p[0] - nx * L, p[1] - ny * L)
                d.line([T(p), T(q)], fill=(120, 170, 235), width=1)
                if prev:
                    d.line([T(prev), T(q)], fill=(40, 100, 210), width=2)
                prev = q
    for P in points_lists:
        line = []
        for sgm in K.segments(P):
            n = 1 if sgm[0] == "L" else 40
            line += [T(K.pt(sgm, i / n)) for i in range(n)]
        d.line(line + line[:1], fill=(20, 20, 20), width=2)
    if nodes:
        lf = font_label(max(10, int(11 * s * 2)))
        for P in points_lists:
            n = len(P)
            for i, p in enumerate(P):
                if p[2] is None:
                    for j in ((i - 1) % n, (i + 1) % n):
                        if P[j][2]:
                            d.line([T(p), T(P[j])], fill=(200, 80, 80), width=1)
                    x, y = T(p)
                    d.ellipse([x - 3, y - 3, x + 3, y + 3], outline=(200, 80, 80), width=1)
            for i, p in enumerate(P):
                if p[2]:
                    x, y = T(p)
                    r = 5
                    if p[3]:
                        d.ellipse([x - r, y - r, x + r, y + r], fill=(30, 150, 80))
                    else:
                        d.rectangle([x - r, y - r, x + r, y + r], fill=(220, 120, 0))
                    if numbers:
                        d.text((x + 6, y - 14), f"{i}", fill=(90, 90, 90), font=lf)
    d.text((10, 8), title, fill=(30, 30, 30), font=font_label(22))
    return im


def stack(images, gap=10, horizontal=False):
    if horizontal:
        W, H = sum(i.width for i in images) + gap * (len(images) - 1), max(i.height for i in images)
    else:
        W, H = max(i.width for i in images), sum(i.height for i in images) + gap * (len(images) - 1)
    out = Image.new("RGB", (W, H), "white")
    o = 0
    for im in images:
        out.paste(im, (o, 0) if horizontal else (0, o))
        o += (im.width if horizontal else im.height) + gap
    return out


def main(argv):
    out, names = argv[0], [a for a in argv[1:] if not a.startswith("--")]
    num = "--numbers" in argv
    argv = [a for a in argv if a != "--numbers"]
    opt = {argv[i]: argv[i + 1] for i in range(len(argv) - 1) if argv[i].startswith("--")}
    names = [n for n in names if n not in opt.values()]
    ufo = ufoLib2.Font.open(opt.get("--ufo", os.path.join(SERIF, "build", "AreaSerif-Regular.ufo")))
    before = ufoLib2.Font.open(opt["--before"]) if "--before" in opt else None
    yr = tuple(int(v) for v in opt["--y"].split(",")) if "--y" in opt else None
    s = float(opt.get("--s", "1.0"))
    cols = []
    for n in names:
        pan = []
        if before is not None and n in before:
            pan.append(draw_glyph(K.glyph_points(before, n), before[n].width, s, f"{n} before", yr, numbers=num))
        pan.append(draw_glyph(K.glyph_points(ufo, n), ufo[n].width, s, f"{n}" + (" after" if before else ""), yr, numbers=num))
        cols.append(stack(pan))
    stack(cols, horizontal=True).save(out)
    print(out)


if __name__ == "__main__":
    main(sys.argv[1:])
