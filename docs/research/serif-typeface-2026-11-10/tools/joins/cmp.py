"""Rows of the same text in Area Serif, Georgia Pro and Serrif at one x-height. Scratch comparison only."""
import os, sys
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
F = os.path.expanduser("~/Library/Fonts/")
def faces(area):
    out = []
    for label, path, var in (("Area", area, None), ("Georgia Pro", F + "GeorgiaPro-Regular.ttf", None), ("Serrif", F + "SerrifCollectionVF-TRIAL.ttf", True)):
        t = TTFont(path); xh = t["OS/2"].sxHeight / t["head"].unitsPerEm
        out.append((label, path, var, xh))
    return out
def render(area, text, path, xpx=150, extra=()):
    fs = faces(area) + list(extra)
    rows = []
    for label, p, var, xh in fs:
        f = ImageFont.truetype(p, int(round(xpx / xh)))
        if var:
            try: f.set_variation_by_axes([400, 0, 100])
            except Exception as e: print("var", e)
        rows.append((label, f))
    W = max(int(f.getlength(text)) for _, f in rows) + 80
    H = int(xpx * 3.0)
    im = Image.new("RGB", (W, H * len(rows)), "white"); d = ImageDraw.Draw(im)
    small = ImageFont.load_default()
    for i, (label, f) in enumerate(rows):
        base = i * H + int(xpx * 2.05)
        d.line([(0, base), (W, base)], fill=(225, 225, 230)); d.line([(0, base - xpx), (W, base - xpx)], fill=(225, 225, 230))
        d.text((40, base), text, font=f, fill=(15, 15, 20), anchor="ls")
        d.text((6, i * H + 4), label, font=small, fill=(120, 120, 130))
    im.save(path)
if __name__ == "__main__":
    area = sys.argv[1]; render(area, sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 150)
