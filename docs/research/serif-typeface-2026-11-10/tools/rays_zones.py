"""Area Serif 0.81 round 3: audit_rays' junction zones, drawn. python rays_zones.py OUT.png [glyph ...]

Each glyph at 400 (the variable font's instance): the outline, the branch nodes (concave corners) and the places
where two contours' edges cross (orange), a circle of one local stroke width round each (the junction zone), and
every ray the audit keeps (green) or skips because it starts in a zone (red)."""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif")
sys.path.insert(0, S)
os.chdir(S)
import audit_rays as AR  # noqa: E402


def main():
    out = sys.argv[1]
    names = sys.argv[2:] or ["g", "Q", "Astroke", "a", "asterisk", "uni0259"]
    f400 = AR.instance("build/AreaSerif[wght].ttf", 400)
    gs = f400.getGlyphSet()
    import ufoLib2
    reg = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    cmap = f400.getBestCmap()
    names = [n if n in gs else cmap.get(reg[n].unicodes[0], n) for n in names]
    sc, cell = 0.42, 440
    img = Image.new("RGB", (cell * 3, cell * 2), "white")
    dr = ImageDraw.Draw(img)
    for k, n in enumerate(names[:6]):
        ox, oy = (k % 3) * cell + 20, (k // 3) * cell + 20
        polys = AR.polylines(gs, n)
        tr = lambda p: (ox + p[0] * sc, oy + (900 - p[1]) * sc)          # noqa: E731
        for P in polys:
            dr.polygon([tr(p) for p in P], outline=(40, 40, 40))
        save = AR.JUNCTION
        AR.JUNCTION = 0.0
        free, _ = AR.rays(polys)
        AR.JUNCTION = save
        kept, _ = AR.rays(polys)
        allp = np.vstack(polys)
        # zones: branch nodes and crossings, radius = the nearest kept-or-free ray's length there
        cav = []
        for P in polys:
            a_, b_ = np.roll(P, 1, axis=0), np.roll(P, -1, axis=0)
            u, w = P - a_, b_ - P
            turn = np.degrees(np.arctan2(u[:, 0] * w[:, 1] - u[:, 1] * w[:, 0], (u * w).sum(axis=1)))
            area = float(np.sum(P[:, 0] * b_[:, 1] - b_[:, 0] * P[:, 1]))
            cav.append(P[(np.sign(turn) == -np.sign(area)) & (np.abs(turn) > 25)])
        zones = np.vstack(cav + [AR.crossings_of(polys)])
        for z in zones:
            x, y = tr(z)
            dr.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(240, 140, 0))
        for p, f_, k_ in zip(allp, free, kept):
            if np.isnan(f_):
                continue
            x, y = tr(p)
            col = (40, 170, 60) if not np.isnan(k_) else (220, 40, 40)
            dr.ellipse([x - 1.5, y - 1.5, x + 1.5, y + 1.5], fill=col)
            if np.isnan(k_):
                d = np.hypot(*(zones - p).T)
                z = zones[int(d.argmin())]
                zx, zy = tr(z)
                dr.ellipse([zx - f_ * sc, zy - f_ * sc, zx + f_ * sc, zy + f_ * sc], outline=(240, 140, 0))
        dr.text((ox, oy - 14), f"{n}: green kept, red in a junction zone (orange: branch or crossing, circle: one stroke width)", fill="black")
    img.save(out)


if __name__ == "__main__":
    main()
