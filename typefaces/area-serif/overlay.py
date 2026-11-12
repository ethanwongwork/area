"""Overlays each built glyph on Georgia Pro and Serrif (if installed) for comparison only.
Output goes to build/ and is never committed. Outlines are drawn, not stored."""
import os
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "build")
FONTS = os.path.expanduser("~/Library/Fonts/")
COL = {"G": (36, 86, 201), "S": (214, 60, 40), "A": (20, 23, 28), "L": (15, 140, 90)}


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


def load():
    fonts = {"A": TTFont(os.path.join(OUT, "AreaSerif-Regular.ttf"))}
    try:
        fonts["G"] = TTFont(FONTS + "GeorgiaPro-Regular.ttf")
        from fontTools.varLib.instancer import instantiateVariableFont
        fonts["S"] = instantiateVariableFont(TTFont(FONTS + "SerrifCollectionVF-TRIAL.ttf"), {"wght": 400, "wdth": 100, "slnt": 0})
    except OSError:
        pass
    return fonts


def contours(font, ch):
    gs = font.getGlyphSet()
    name = font.getBestCmap()[ord(ch)]
    pen = Flat(gs)
    gs[name].draw(pen)
    k = 1000 / font["head"].unitsPerEm
    cs = [[(x * k, y * k) for x, y in c] for c in pen.cs if len(c) > 2]
    xs = [p[0] for c in cs for p in c]
    return cs, min(xs), max(xs), gs[name].width * k


def sheet(fonts, chars, path, sc=0.62, cols=5, align="center"):
    cw, chh = int(900 * sc), int(1120 * sc)
    rows = (len(chars) + cols - 1) // cols
    im = Image.new("RGB", (cw * cols, chh * rows), "white")
    d = ImageDraw.Draw(im, "RGBA")
    for i, ch in enumerate(chars):
        ox, oy = (i % cols) * cw, (i // cols) * chh
        base = oy + int(800 * sc)
        for y in (0, 500, 700):
            d.line([(ox + 8, base - y * sc), (ox + cw - 8, base - y * sc)], fill=(0, 0, 0, 40))
        for key in ("A", "G", "S"):
            if key not in fonts:
                continue
            cs, x0, x1, adv = contours(fonts[key], ch)
            shift = ox + cw / 2 - (x0 + x1) / 2 * sc if align == "center" else ox + 60 * sc
            if key == "A":
                mask = Image.new("L", im.size, 0)
                md = ImageDraw.Draw(mask)
                acc = None
                for c in cs:   # even-odd via xor works because overlaps were removed at build
                    layer = Image.new("1", im.size, 0)
                    ImageDraw.Draw(layer).polygon([(shift + x * sc, base - y * sc) for x, y in c], fill=1)
                    from PIL import ImageChops
                    acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
                im.paste((205, 208, 214), mask=acc.convert("L"))
                d = ImageDraw.Draw(im, "RGBA")
            for c in cs:
                pts = [(shift + x * sc, base - y * sc) for x, y in c]
                d.line(pts + [pts[0]], fill=COL[key] + (255,), width=2)
    im.save(path)


if __name__ == "__main__":
    chars = sys.argv[1] if len(sys.argv) > 1 else "noHOaesgR01Ili"
    sheet(load(), chars, os.path.join(OUT, "overlay.png"))
    print("wrote overlay.png")


def contours_named(font, name):
    gs = font.getGlyphSet()
    pen = Flat(gs)
    gs[name].draw(pen)
    k = 1000 / font["head"].unitsPerEm
    cs = [[(x * k, y * k) for x, y in c] for c in pen.cs if len(c) > 2]
    xs = [p[0] for c in cs for p in c]
    return cs, min(xs), max(xs)


def tile(fonts, ours, refs, path, sc=0.3):
    """One option: our glyph filled, the reference forms it echoes outlined. refs: [(key, glyph name)]."""
    from PIL import ImageChops
    w, h = int(980 * sc), int(1060 * sc)
    im = Image.new("RGB", (w, h), "white")
    d = ImageDraw.Draw(im, "RGBA")
    base = int(800 * sc)
    for yv in (0, 500, 700):
        d.line([(0, base - yv * sc), (w, base - yv * sc)], fill=(0, 0, 0, 30))
    cs, x0, x1 = contours_named(fonts["A"], ours)
    shift = w / 2 - (x0 + x1) / 2 * sc
    acc = None
    for c in cs:
        layer = Image.new("1", im.size, 0)
        ImageDraw.Draw(layer).polygon([(shift + x * sc, base - y * sc) for x, y in c], fill=1)
        acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
    im.paste((20, 23, 28), mask=acc.convert("L"))
    d = ImageDraw.Draw(im, "RGBA")
    for key, name in refs:
        if key not in fonts:
            continue
        rcs, rx0, rx1 = contours_named(fonts[key], name)
        rs = w / 2 - (rx0 + rx1) / 2 * sc
        for c in rcs:
            pts = [(rs + x * sc, base - y * sc) for x, y in c]
            d.line(pts + [pts[0]], fill=COL[key] + (230,), width=2)
    im.save(path)


def svg_tile(fonts, ours, refs, box=1120, px=1200, ref_scale=None):
    """One option as an SVG: our glyph as a real vector path, the reference forms as smooth outlines in an
    embedded image (licensed outlines are drawn to pixels, never written out as vector data)."""
    import base64
    import io
    from fontTools.pens.svgPathPen import SVGPathPen
    gs = fonts["A"].getGlyphSet()
    pen = SVGPathPen(gs)
    gs[ours].draw(pen)
    cs, x0, x1 = contours_named(fonts["A"], ours)
    cx = (x0 + x1) / 2
    base = 840                                        # font y=0 sits here; y runs from -280 to 840
    ss = 2
    k = px * ss / box
    im = Image.new("RGBA", (px * ss, px * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for key, name in refs:
        if key not in fonts:
            continue
        rcs, rx0, rx1 = contours_named(fonts[key], name)
        sc = (ref_scale or {}).get(key, 1)
        rcs = [[(x * sc, y * sc) for x, y in c] for c in rcs]
        rx0, rx1 = rx0 * sc, rx1 * sc
        rcx = (rx0 + rx1) / 2
        for c in rcs:
            pts = [((x - rcx + box / 2) * k, (base - y) * k) for x, y in c]
            d.line(pts + [pts[0]], fill=COL[key] + (255,), width=int(3.2 * ss), joint="curve")
    im = im.resize((px, px), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    ref = base64.b64encode(buf.getvalue()).decode()
    lines = "".join(
        f'<line x1="0" x2="{box}" y1="{base - y}" y2="{base - y}" stroke="#000" stroke-opacity=".09" stroke-width="2"/>'
        for y in (0, 500, 700))
    return (f'<svg viewBox="0 0 {box} {box}" xmlns="http://www.w3.org/2000/svg" role="img">'
            f'<rect width="{box}" height="{box}" fill="#fff"/>{lines}'
            f'<path d="{pen.getCommands()}" fill="#16191e" transform="translate({box / 2 - cx:.1f} {base}) scale(1 -1)"/>'
            + (f'<image href="data:image/png;base64,{ref}" x="0" y="0" width="{box}" height="{box}"/>' if refs else "")
            + "</svg>")
