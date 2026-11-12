"""Smooth contact sheet of built glyphs by name (anti-aliased: drawn at 4x, reduced). Usage: python sheet.py out.png name ..."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from PIL import Image, ImageDraw, ImageChops


class Flat(BasePen):
    def __init__(self, gs):
        super().__init__(gs)
        self.cs = []

    def _moveTo(self, p):
        self.cs.append([p])

    def _lineTo(self, p):
        self.cs[-1].append(p)

    def _qCurveToOne(self, a, c):
        p = self.cs[-1][-1]
        for i in range(1, 17):
            t = i / 16
            u = 1 - t
            self.cs[-1].append((u * u * p[0] + 2 * u * t * a[0] + t * t * c[0], u * u * p[1] + 2 * u * t * a[1] + t * t * c[1]))


def glyph_image(font, name, scale, ss=4):
    gs = font.getGlyphSet()
    pen = Flat(gs)
    gs[name].draw(pen)
    w = int(gs[name].width * scale) + 20
    h = int(1150 * scale)
    big = Image.new("1", (w * ss, h * ss), 0)
    for c in pen.cs:
        layer = Image.new("1", big.size, 0)
        ImageDraw.Draw(layer).polygon([((10 + x * scale) * ss, (900 - y) * scale * ss) for x, y in c], fill=1)
        big = ImageChops.logical_xor(big, layer)
    return big.convert("L").resize((w, h), Image.LANCZOS)


if __name__ == "__main__":
    out, names = sys.argv[1], sys.argv[2:]
    f = TTFont("build/AreaSerif-Regular.ttf")
    ims = [glyph_image(f, n, 0.3) for n in names]
    sheet = Image.new("L", (sum(i.width for i in ims), max(i.height for i in ims)), 0)
    x = 0
    for i in ims:
        sheet.paste(i, (x, 0))
        x += i.width
    Image.eval(sheet, lambda v: 255 - v).save(out)
