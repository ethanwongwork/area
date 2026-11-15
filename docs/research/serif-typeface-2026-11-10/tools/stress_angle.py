"""Area Serif 0.81 round 3: where a round letter is thickest, at three weights, against Georgia Pro and Source Serif 4.

    python stress_angle.py OUT.png [OUT.txt]

For o, c, e, s at 300, 400 and 700 (Area: the variable font's instances; Georgia Pro: its Light, Regular and Bold;
Source Serif 4: the variable font at wght 300, 400, 700), the stroke's thickness is read along rays from the
counter's centre (the centre of the glyph's ink box at x-height / 2) every 2 degrees: from where the ray enters the
ink to where it leaves it. The thickest place on each side (left half: angles 90 to 270, right half: -90 to 90) is
the stress angle. If Area's stress angle moves with weight where the references' does not, the thick part slides
along the stroke as weight changes (the claim behind audit_rays' Light flags part way round curves). Writes the
plot and the angles. Numbers only from the references; their outlines are not kept.
"""
import io
import math
import os
import sys

import numpy as np
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
AREA = os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif", "build", "AreaSerif[wght].ttf")
GEORGIA = {w: os.path.expanduser(f"~/Library/Fonts/GeorgiaPro-{s}.ttf") for w, s in ((300, "Light"), (400, "Regular"), (700, "Bold"))}
SOURCE = os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif", "build", "eval-fonts", "SourceSerif4.ttf")
LETTERS = "oces"
WEIGHTS = (300, 400, 700)


def vf_instance(path, w):
    f = TTFont(path)
    axes = {a.axisTag: a for a in f["fvar"].axes}
    loc = {"wght": w}
    for tag, a in axes.items():
        if tag != "wght":
            loc[tag] = a.defaultValue
    buf = io.BytesIO()
    instantiateVariableFont(f, loc).save(buf)
    buf.seek(0)
    return TTFont(buf)


def polys(font, ch):
    gs = font.getGlyphSet()
    name = font.getBestCmap()[ord(ch)]
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    upm = font["head"].unitsPerEm
    out, cur = [], []
    for op, args in rec.value:
        if op == "moveTo":
            cur = [args[0]]
        elif op == "lineTo":
            cur.append(args[0])
        elif op == "qCurveTo":
            pts = list(args)
            offs = pts[:-1]
            a = cur[-1]
            for i, q in enumerate(offs):
                e = pts[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                for k in range(1, 9):
                    t = k / 8
                    u = 1 - t
                    cur.append((u * u * a[0] + 2 * u * t * q[0] + t * t * e[0], u * u * a[1] + 2 * u * t * q[1] + t * t * e[1]))
                a = e
        elif op == "curveTo":
            a = cur[-1]
            b, c, d = args
            for k in range(1, 9):
                t = k / 8
                u = 1 - t
                cur.append(tuple(u ** 3 * a[j] + 3 * u * u * t * b[j] + 3 * u * t * t * c[j] + t ** 3 * d[j] for j in (0, 1)))
        elif op in ("closePath", "endPath"):
            if len(cur) > 2:
                out.append(np.array(cur, float) * 1000.0 / upm)
            cur = []
    return out


def hits(polys_, c, ang):
    d = np.array([math.cos(ang), math.sin(ang)])
    out = []
    for P in polys_:
        a, b = P, np.roll(P, -1, axis=0)
        e = b - a
        q = a - c
        den = d[0] * e[:, 1] - d[1] * e[:, 0]
        with np.errstate(divide="ignore", invalid="ignore"):
            s = (q[:, 0] * e[:, 1] - q[:, 1] * e[:, 0]) / den
            u = (q[:, 0] * d[1] - q[:, 1] * d[0]) / den
        ok = (np.abs(den) > 1e-9) & (s > 0) & (u >= 0) & (u < 1)
        out += list(s[ok])
    return sorted(out)


def profile(polys_):
    pts = np.vstack(polys_)
    x0, x1 = pts[:, 0].min(), pts[:, 0].max()
    y0, y1 = pts[:, 1].min(), pts[:, 1].max()
    c = np.array([(x0 + x1) / 2, (y0 + y1) / 2])
    angs = np.radians(np.arange(0, 360, 2))
    th = []
    for a in angs:
        h = hits(polys_, c, a)
        th.append(h[1] - h[0] if len(h) >= 2 else np.nan)       # the first stroke out from the centre
    return np.degrees(angs), np.array(th)


def stress(angs, th):
    """The thickest place on the left half and on the right half: (left angle, right angle)."""
    left = (angs >= 90) & (angs <= 270)
    right = ~left
    out = []
    for m in (left, right):
        t = np.where(m, th, -1)
        k = int(np.nanargmax(t))
        out.append(float(angs[k]))
    return out


def main():
    png = sys.argv[1]
    txt = sys.argv[2] if len(sys.argv) > 2 else None
    faces = {"Area Serif 0.81": {w: vf_instance(AREA, w) for w in WEIGHTS},
             "Georgia Pro": {w: TTFont(GEORGIA[w]) for w in WEIGHTS},
             "Source Serif 4": {w: vf_instance(SOURCE, w) for w in WEIGHTS}}
    W, H = 1500, 260 * len(LETTERS) + 60
    img = Image.new("RGB", (W, H), "white")
    dr = ImageDraw.Draw(img)
    cols = {300: (90, 150, 230), 400: (40, 40, 40), 700: (220, 70, 50)}
    lines = []
    for li, ch in enumerate(LETTERS):
        for fi, (face, fs) in enumerate(faces.items()):
            ox, oy = 20 + fi * 490, 40 + li * 260
            dr.text((ox, oy - 18), f"{face}  '{ch}'  thickness against angle (0 = right, 90 = top)", fill="black")
            dr.rectangle([ox, oy, ox + 460, oy + 220], outline=(200, 200, 200))
            res = {}
            for w, f in fs.items():
                a, t = profile(polys(f, ch))
                res[w] = (a, t)
            tmax = max(np.nanmax(t) for _, t in res.values())
            for w, (a, t) in res.items():
                pts = [(ox + x / 360 * 460, oy + 220 - (y / tmax) * 210) for x, y in zip(a, t) if not np.isnan(y)]
                dr.line(pts, fill=cols[w], width=2)
                sl, sr = stress(a, t)
                for s_ in (sl, sr):
                    dr.line([(ox + s_ / 360 * 460, oy), (ox + s_ / 360 * 460, oy + 220)], fill=cols[w], width=1)
                lines.append(f"{face}\t{ch}\t{w}\tstress left {sl:.0f}\tright {sr:.0f}\tmax {np.nanmax(t):.0f}")
            dr.text((ox + 4, oy + 4), "300 blue, 400 black, 700 red; thin lines: the thickest place each side", fill="black")
    img.save(png)
    if txt:
        open(txt, "w").write("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
