"""Thickness along a tapering stroke at 300, 400 and 700, before over after (0.81, integration: the taper law).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/taper_plot.py \
        BEFORE_VF AFTER_VF OUT.png

For each glyph (j's tail, y's tail, f's hook, eng's tail) the outline of the variable font's instance is cut at
audit_rays' fixed places; along the outer edge of the stroke (the places in its zone, in contour order) the ray across
the stroke is drawn as a thickness curve: 400 black, 300 blue, 700 red; dashed blue is what the taper law asks at 300
(white.taper_law on the 400 thickness: the stem's ratio at a stem, the hairline's at a hairline, the tip's at an end).
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.getcwd())
import audit_rays as AR  # noqa: E402
import bold as B  # noqa: E402
import white as W  # noqa: E402

LAB = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 15)
ZONES = {"j": lambda p: p[1] < -20, "y": lambda p: p[1] < -20, "eng": lambda p: p[1] < -20,
         "f": lambda p: p[1] > 540}
WTS = (300, 400, 700)


def profile(vf, name):
    fonts = {w: AR.instance(vf, w) for w in WTS}
    th, pts = {}, None
    for w in WTS:
        ps = AR.polylines(fonts[w].getGlyphSet(), name)
        t, _e = AR.rays(ps)
        th[w] = t
        if w == 400:
            pts = np.vstack(ps)
    keep = np.array([ZONES[name](p) for p in pts]) & ~np.isnan(th[400])
    return {w: th[w][keep] for w in WTS}


def law300(t400):
    v = B.vector(B.LIGHT_STEM)
    laws = [(B.REG_STEM, B.LIGHT_STEM / B.REG_STEM), (B.LC_HAIR, 1 + (B.HAIR_RATIO - 1) * v["ft"]), (30, v["tip"])]
    return t400 * W.taper_law(t400, laws)


def panel(prof, title, w=520, h=260):
    im = Image.new("RGB", (w, h), "white")
    d = ImageDraw.Draw(im)
    d.text((8, 4), title, font=LAB, fill=(0, 0, 0))
    n = len(prof[400])
    if not n:
        return im
    top = max(np.nanmax(prof[700]), np.nanmax(prof[400])) * 1.05
    X = lambda i: 40 + (w - 60) * i / max(n - 1, 1)             # noqa: E731
    Y = lambda v: h - 25 - (h - 55) * v / top                   # noqa: E731
    for v in range(0, int(top) + 1, 20):
        d.line([(40, Y(v)), (w - 20, Y(v))], fill=(235, 235, 235))
        d.text((5, Y(v) - 8), str(v), font=LAB, fill=(150, 150, 150))
    for wt, col in ((700, (210, 40, 40)), (400, (0, 0, 0)), (300, (40, 80, 220))):
        ys = prof[wt]
        seg = [(X(i), Y(v)) for i, v in enumerate(ys) if not np.isnan(v)]
        if len(seg) > 1:
            d.line(seg, fill=col, width=2)
    lw = law300(prof[400])
    for i in range(0, n - 1, 2):
        if not np.isnan(lw[i]) and not np.isnan(lw[i + 1]):
            d.line([(X(i), Y(lw[i])), (X(i + 1), Y(lw[i + 1]))], fill=(40, 80, 220), width=1)
    r = prof[300] / prof[400]
    d.text((w - 250, 4), f"300/400 least {np.nanmin(r):.3f} (stem 0.705)", font=LAB, fill=(40, 80, 220))
    return im


def main():
    before, after, out = sys.argv[1:4]
    rows = []
    for name in ("j", "y", "f", "eng"):
        rows.append((panel(profile(before, name), f"{name} before (0.81 merged)"), panel(profile(after, name), f"{name} after")))
    W_, H_ = rows[0][0].width * 2 + 30, sum(a.height for a, _b in rows) + 60
    pg = Image.new("RGB", (W_, H_), "white")
    d = ImageDraw.Draw(pg)
    d.text((10, 8), "Thickness along the stroke (outer edge, in order): black 400, blue 300, red 700; blue dashes: the "
           "taper law at 300", font=LAB, fill=(0, 0, 0))
    y = 40
    for a, b in rows:
        pg.paste(a, (10, y))
        pg.paste(b, (a.width + 20, y))
        y += a.height
    pg.save(out)
    print(out)


if __name__ == "__main__":
    main()
