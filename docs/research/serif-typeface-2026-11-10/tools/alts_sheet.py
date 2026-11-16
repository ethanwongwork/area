"""A sheet for alternates: the default beside a copy of the font whose cmap points at the alternates, so any
renderer shows them without OpenType features. Rows: large letters, then words at text sizes.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/alts_sheet.py \
        ss03 "S s $" "Systems pass $1,250 · Sessions, Subscriptions, USES" build/weight/s-alt.png
"""
import os
import sys

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

BUILD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "typefaces", "area-serif", "build")


def remapped(src, suffix, out):
    f = TTFont(src)
    order = set(f.getGlyphOrder())
    for t in f["cmap"].tables:
        for u, n in list(t.cmap.items()):
            if f"{n}.{suffix}" in order:
                t.cmap[u] = f"{n}.{suffix}"
    f.save(out)
    return out


def sheet(fonts, big, words, out, sizes=(13, 16, 24, 40), scale=2):
    """fonts: [(label, path)]. Drawn at `scale` device pixels per px, as a 2x screen does."""
    W = 1500
    lab = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 11 * scale)
    rows = []
    for label, path in fonts:
        rows.append((label, path, big, 150))
    for s in sizes:
        for label, path in fonts:
            rows.append((f"{label} · {s} px", path, words, s))
    H = sum(int(s * scale * 1.55) + 16 * scale for *_r, s in rows) + 20
    im = Image.new("L", (W * scale // 1, H), 255)
    d = ImageDraw.Draw(im)
    y = 10
    for label, path, text, s in rows:
        d.text((16 * scale, y), label, font=lab, fill=120)
        y += 14 * scale
        d.text((16 * scale, y), text, font=ImageFont.truetype(path, s * scale), fill=0)
        y += int(s * scale * 1.55) + 2 * scale
    im.save(out)
    return out


if __name__ == "__main__":
    suffix, big, words, out = sys.argv[1:5]
    reg = os.path.join(BUILD, "AreaSerif-Regular.ttf")
    alt = remapped(reg, suffix, os.path.join(BUILD, "weight", f"AreaSerif-{suffix}.ttf"))
    fonts = [("Area Serif, default", reg), (f"Area Serif, {suffix}", alt)] + [
        (lab, p) for lab, p in (a.split("=", 1) for a in sys.argv[5:])]
    print(sheet(fonts, big, words, out))
