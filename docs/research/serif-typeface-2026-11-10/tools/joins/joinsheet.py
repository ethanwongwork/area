"""Close-ups of every join where a curved stroke meets a stem, all at one scale, one row per font (before over after).
Windows come from parts.check on the built UFO, plus the two spurs. Area's own outlines only.
Run from typefaces/area-serif. Usage: joinsheet.py out.png font.ttf [font2.ttf ...]"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__)); sys.path.insert(0, os.getcwd())
from plain import Flat
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageChops
import ufoLib2
import parts
u = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
WIN = [(r[0], r[1], r[2]) for r in parts.check(u)[0] if r[3] < 57] + [("b", 152, 40), ("q", 483, 480)]
def crop(path, name, cx, cy, half=105, k=1.6, ss=3):
    f = TTFont(path); gs = f.getGlyphSet(); pen = Flat(gs); gs[f.getBestCmap()[ord(name)]].draw(pen)
    W = int(2 * half * k * ss); acc = Image.new("1", (W, W), 0)
    for c in pen.cs:
        layer = Image.new("1", (W, W), 0)
        ImageDraw.Draw(layer).polygon([((x - cx + half) * k * ss, (cy + half - y) * k * ss) for x, y in c], fill=1)
        acc = ImageChops.logical_xor(acc, layer)
    return ImageChops.invert(acc.convert("L")).resize((W // ss, W // ss), Image.LANCZOS)
fonts = sys.argv[2:]
tiles = [[crop(p, *w) for w in WIN] for p in fonts]
t = tiles[0][0].width; cols = 8; rows = -(-len(WIN) // cols); gap = 10
im = Image.new("L", (cols * (t + gap) + gap, rows * (len(fonts) * (t + gap) + 26) + gap), 255); d = ImageDraw.Draw(im)
for i, w in enumerate(WIN):
    r, c = divmod(i, cols)
    y0 = gap + r * (len(fonts) * (t + gap) + 26)
    d.text((gap + c * (t + gap), y0), f"{w[0]}", fill=0)
    for j in range(len(fonts)):
        im.paste(tiles[j][i], (gap + c * (t + gap), y0 + 18 + j * (t + gap)))
im.save(sys.argv[1]); print(len(WIN), im.size)
