"""Proofs for weight.py's trial: H O n o at each bold stem beside Georgia Pro Bold and Serrif Bold, every face at one
x-height. Text at 64 px and 13 to 18 px, light and dark, and each letter large over the references' outlines.
Renders stay in typefaces/area-serif/build/weight (ignored): the references are licensed.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/proof_weight.py
"""
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont, ImageOps

import weight as W
import evlib as E

OUT = W.OUT
STEMS = [int(a) for a in sys.argv[1:] if a.isdigit()] or [128, 136, 140]
TEXT = "noon Hoon HnHoHOH nonono OnOoO Ho no on"


def refs():
    g = E.USER_FONTS + "GeorgiaPro-Bold.ttf"
    s = os.path.join(OUT, "ref-serrif-700.ttf")
    if not os.path.exists(s):
        instantiateVariableFont(TTFont(E.USER_FONTS + "SerrifCollectionVF-TRIAL.ttf"), {"wght": 700, "wdth": 100, "slnt": 0}).save(s)
    return [("Georgia Pro Bold", g), ("Serrif 700", s)]


def faces():
    out = [("Area Serif Regular", os.path.join(OUT, "trial-regular.ttf"))]
    out += [(f"Area Serif Bold, stem {s}", os.path.join(OUT, f"trial-bold-{s}.ttf")) for s in STEMS]
    return out + refs()


def flat_x(path):
    """x-height as a share of the em: n's flat stem top is a flag in these faces, so read H O n o only: the o's top
    less its overshoot, taken as the o's own bottom overshoot."""
    f = TTFont(path)
    o = E.Shape(f, "o")
    return (o.y1 + o.y0) / 1000


def text_sheet(px_list, name):
    rows = []
    label = ImageFont.load_default()
    for px in px_list:
        for lab, path in faces():
            size = px * 0.520 / flat_x(path)
            font = ImageFont.truetype(path, round(size * 4) / 4)
            w = int(font.getlength(TEXT)) + 40
            im = Image.new("L", (max(w, 200) + 190, int(px * 1.5) + 8), 255)
            d = ImageDraw.Draw(im)
            d.text((6, im.height // 2 - 5), f"{lab}  {px}px", font=label, fill=110)
            d.text((190, im.height - int(px * 0.42) - 4), TEXT, font=font, fill=0, anchor="ls")
            rows.append(im)
    Wd = max(r.width for r in rows)
    H = sum(r.height for r in rows)
    sheet = Image.new("L", (Wd, H), 255)
    y = 0
    for r in rows:
        sheet.paste(r, (0, y))
        y += r.height
    both = Image.new("L", (Wd, 2 * H), 255)
    both.paste(sheet, (0, 0))
    both.paste(ImageOps.invert(sheet), (0, H))
    p = os.path.join(OUT, name)
    both.save(p)
    print(p, both.size)


def overlay(name, size=330):
    """Each letter: the Bold's ink (grey) with Georgia Pro Bold (blue) and Serrif 700 (red) outlines over it, centred
    on the letter's ink, one x-height; the Regular's outline in black dashes."""
    R = refs()
    cols = []
    for stem in STEMS:
        f = TTFont(os.path.join(OUT, f"trial-bold-{stem}.ttf"))
        reg = TTFont(os.path.join(OUT, "trial-regular.ttf"))
        for ch in "HOno":
            ss = 3
            im = Image.new("RGB", (size * ss, size * ss), "white")
            d = ImageDraw.Draw(im)
            k = size * ss / 1150

            def pts(shape, kk, cx):
                return [[((x - cx) * kk * k + size * ss / 2, size * ss * 0.80 - y * kk * k) for x, y in poly] for poly in shape.polys]
            a = E.Shape(f, ch)
            mask = Image.new("L", im.size, 0)
            md = ImageDraw.Draw(mask)
            for poly in pts(a, 1, (a.x0 + a.x1) / 2):
                md.polygon(poly, fill=255)
            # counters: even-odd by drawing inner contours back to 0 (outer contour first in these four letters)
            polys = pts(a, 1, (a.x0 + a.x1) / 2)
            if len(polys) > 1:
                for poly in polys[1:]:
                    md.polygon(poly, fill=0)
            im.paste((205, 205, 205), mask=mask)
            for (lab, path), col in zip(R, ((30, 90, 220), (220, 50, 40))):
                rf = TTFont(path)
                kk = 0.520 / flat_x(path)
                s = E.Shape(rf, ch)
                for poly in pts(s, kk, (s.x0 + s.x1) / 2):
                    d.line(poly + [poly[0]], fill=col, width=ss)
            r = E.Shape(reg, ch)
            for poly in pts(r, 1, (r.x0 + r.x1) / 2):
                d.line(poly + [poly[0]], fill=(0, 0, 0), width=1)
            d.text((8 * ss, 6 * ss), f"{ch}  stem {stem}", fill=(90, 90, 90), font=ImageFont.load_default(size=11 * ss))
            cols.append(im.resize((size, size), Image.LANCZOS))
    sheet = Image.new("RGB", (size * 4, size * len(STEMS)), "white")
    for i, im in enumerate(cols):
        sheet.paste(im, ((i % 4) * size, (i // 4) * size))
    p = os.path.join(OUT, name)
    sheet.save(p)
    print(p, sheet.size)


def axis_sheet(stem, px=64):
    rows = []
    label = ImageFont.load_default()
    vf = os.path.join(OUT, f"trial-{stem}[wght].ttf")
    for w in (400, 450, 500, 550, 600, 650, 700):
        p = os.path.join(OUT, f"_inst-{stem}-{w}.ttf")
        instantiateVariableFont(TTFont(vf), {"wght": w}).save(p)
        font = ImageFont.truetype(p, px)
        im = Image.new("L", (int(font.getlength(TEXT)) + 240, int(px * 1.4)), 255)
        d = ImageDraw.Draw(im)
        d.text((6, im.height // 2 - 5), f"stem {stem}, weight {w}", font=label, fill=110)
        d.text((190, im.height - int(px * 0.38)), TEXT, font=font, fill=0, anchor="ls")
        rows.append(im)
    Wd = max(r.width for r in rows)
    sheet = Image.new("L", (Wd, sum(r.height for r in rows)), 255)
    y = 0
    for r in rows:
        sheet.paste(r, (0, y))
        y += r.height
    p = os.path.join(OUT, f"proof-axis-{stem}.png")
    sheet.save(p)
    print(p, sheet.size)


if __name__ == "__main__":
    text_sheet([64], "proof-64.png")
    text_sheet([18, 16, 14, 13], "proof-small.png")
    overlay("proof-overlay.png")
    for s in STEMS:
        axis_sheet(s)
