"""Area filled, Georgia Pro (blue) and Serrif (red) outlined, at one cap or x-height. Scratch only."""
import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools"))
import lib
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageChops
def sheet(area, chars, path, px=620, align="left", prev=None, refs=True):
    fs = [("A", TTFont(area), (190, 194, 202))]
    if prev: fs.append(("P", TTFont(prev), (20, 150, 90)))
    if refs: fs += [("G", lib.georgia("Regular"), (36, 86, 201)), ("S", lib.serrif(), (214, 60, 40))]
    W = int(px * 1.25); H = int(px * 1.5)
    im = Image.new("RGB", (W * len(chars), H), "white")
    for i, ch in enumerate(chars):
        up = ch.isupper() or ch.isdigit()
        for key, f, col in fs:
            g = lib.g(f, ch)
            ref = f["OS/2"].sCapHeight if up else f["OS/2"].sxHeight
            if ch.isdigit(): ref = lib.g(f, "1").y1
            k = px / ref * (1 if up else 0.72)
            base = int(px * 1.2)
            ox = i * W + (40 - g.x0 * k if align == "left" else W / 2 - (g.x0 + g.x1) / 2 * k)
            if key == "A":
                acc = None
                for c in g.cs:
                    layer = Image.new("1", im.size, 0)
                    ImageDraw.Draw(layer).polygon([(ox + x * k, base - y * k) for x, y in c], fill=1)
                    acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
                im.paste(col, mask=acc.convert("L"))
            else:
                d = ImageDraw.Draw(im)
                for c in g.cs:
                    pts = [(ox + x * k, base - y * k) for x, y in c]
                    d.line(pts + [pts[0]], fill=col, width=2)
    im.save(path)
if __name__ == "__main__":
    sheet(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 620, prev=sys.argv[5] if len(sys.argv) > 5 else None)
