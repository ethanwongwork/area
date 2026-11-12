"""Proof sheets for the built font, written to build/proof-*.png (never committed).
If the two reference fonts are installed they are set beside it for comparison only."""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "build")
OURS = os.path.join(OUT, "AreaSerif-Regular.ttf")
FONTS = os.path.expanduser("~/Library/Fonts/")
WORDS = "Regions Hanoi 1010 gasoline"
TEXT = "Hanoi 10 lessons in one season Raisins also onions sing a lasagne signal 1l I0O loose soil"


def ref(kind, size):
    try:
        if kind == "G":
            return ImageFont.truetype(FONTS + "GeorgiaPro-Regular.ttf", size)
        f = ImageFont.truetype(FONTS + "SerrifCollectionVF-TRIAL.ttf", size)
        f.set_variation_by_axes([400, 0, 100])
        return f
    except OSError:
        return None


def sheet(name, rows, size, width, lh=1.3, zoom=1):
    pad = 12
    im = Image.new("L", (width, int(pad * 2 + len(rows) * size * lh)), 255)
    d = ImageDraw.Draw(im)
    y = pad
    for font, text in rows:
        if font:
            d.text((pad, y), text, font=font, fill=0)
        y += int(size * lh)
    if zoom > 1:
        im = im.resize((im.width * zoom, im.height * zoom), Image.NEAREST)
    im.save(os.path.join(OUT, name))


def main():
    ours = lambda s: ImageFont.truetype(OURS, s)
    refs = "--refs" in sys.argv
    big = 150
    rows = [(ours(big), WORDS), (ours(big), "nnonoo HHOHOO nHnOoH")]
    if refs:
        rows = [(ours(big), WORDS), (ref("G", big), WORDS), (ref("S", big), WORDS), (ours(big), "nnonoo HHOHOO nHnOoH")]
    sheet("proof-large.png", rows, big, 2000)
    sheet("proof-glyphs.png", [(ours(300), "naesg"), (ours(300), "oliHOR"), (ours(300), "I01 ig")], 300, 1700, lh=1.25)
    small = []
    for s in (12, 13, 14, 16):
        small.append((ours(s), TEXT))
        if refs:
            small += [(ref("G", s), TEXT), (ref("S", s), TEXT)]
    sheet("proof-small.png", small, 16, 700, lh=1.45, zoom=3)
    sheet("proof-text.png", [(ours(s), TEXT) for s in (18, 24, 32, 48)], 48, 2000, lh=1.2)


if __name__ == "__main__":
    main()
