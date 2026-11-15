"""Draws text from the outlines themselves: no hinting, no grid fitting, kerning from GPOS via HarfBuzz when uharfbuzz
is installed (else advances only). PIL's own text drawing grid-fits each glyph on its own, which can put two level
serifs a pixel apart; use this for any proof where alignment between glyphs is the question.
Usage: plain.py font.ttf "TEXT" out.png [px per em]"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from PIL import Image, ImageDraw, ImageChops
class Flat(BasePen):
    def __init__(s, gs): super().__init__(gs); s.cs = []
    def _moveTo(s, p): s.cs.append([p])
    def _lineTo(s, p): s.cs[-1].append(p)
    def _qCurveToOne(s, a, c):
        p = s.cs[-1][-1]
        for i in range(1, 13):
            t = i / 12; u = 1 - t
            s.cs[-1].append((u * u * p[0] + 2 * u * t * a[0] + t * t * c[0], u * u * p[1] + 2 * u * t * a[1] + t * t * c[1]))
    def _curveToOne(s, a, b, c):
        p = s.cs[-1][-1]
        for i in range(1, 17):
            t = i / 16; u = 1 - t
            s.cs[-1].append(tuple(u**3 * p[k] + 3 * u * u * t * a[k] + 3 * u * t * t * b[k] + t**3 * c[k] for k in (0, 1)))
def draw(path, text, px=400, ss=4, pad=40):
    f = TTFont(path); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    try:
        import uharfbuzz as hb
        face = hb.Face(open(path, "rb").read()); font = hb.Font(face); buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(font, buf)
        run = [(f.getGlyphName(i.codepoint), p.x_advance) for i, p in zip(buf.glyph_infos, buf.glyph_positions)]
    except ImportError:
        run = [(cmap[ord(c)], gs[cmap[ord(c)]].width) for c in text]
    k = px * ss / upm; W = int(sum(a for _, a in run) * k) + 2 * pad * ss; H = int(px * ss * 1.45)
    acc = Image.new("1", (W, H), 0); x = pad * ss; base = int(px * ss * 1.05)
    for name, adv in run:
        pen = Flat(gs); gs[name].draw(pen)
        for c in pen.cs:
            if len(c) > 2:
                layer = Image.new("1", (W, H), 0); ImageDraw.Draw(layer).polygon([(x + px_ * k, base - py * k) for px_, py in c], fill=1)
                acc = ImageChops.logical_xor(acc, layer)
        x += adv * k
    return ImageChops.invert(acc.convert("L")).resize((W // ss, H // ss), Image.LANCZOS)
if __name__ == "__main__":
    draw(sys.argv[1], sys.argv[2], int(sys.argv[4]) if len(sys.argv) > 4 else 400).save(sys.argv[3])
