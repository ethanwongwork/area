"""Area Serif 0.81, owner round 3: figures. The reference faces (Georgia Pro, licensed; Source Serif 4) are drawn as
pictures only, into build/ (never into the repository's img/ folder) and never stored as outlines.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_stage3.py \
        BEFORE_DIR AFTER_DIR OUT_DIR MEASURE.txt

Writes:
  17-lines.png       "fghrstvxyz FGYZBCD 0123456789" and "AVWXYZKMN kvwxyz 47" at 300 400 550 700: Area before,
                     Area after, Source Serif 4, Georgia Pro (Georgia's Light, Regular, Bold at 300, 400, 700; none at 550)
  17-advance.png     advance growth 400 to 700 over the class's upright (n, H), per diagonal letter: Area before,
                     after, and the references' band (from MEASURE.txt, written by build/scratch4/diagm.py's numbers)
"""
import io
import os
import sys

import skia
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
GEORGIA = {w: os.path.expanduser(f"~/Library/Fonts/GeorgiaPro-{n}.ttf") for w, n in ((300, "Light"), (400, "Regular"), (700, "Bold"))}
SOURCE = os.path.join(SERIF, "build", "eval-fonts", "SourceSerif4.ttf")
LINES = ("fghrstvxyz FGYZBCD 0123456789", "AVWXYZKMN kvwxyz 47")
LABEL = skia.Font(skia.Typeface("Helvetica"), 15)


def inst(path, w):
    tt = TTFont(path)
    if "fvar" not in tt:
        return tt
    b = io.BytesIO()
    instantiateVariableFont(tt, {"wght": w}).save(b)
    b.seek(0)
    return TTFont(b)


def draw_line(c, tt, text, x, y, size):
    s = size / tt["head"].unitsPerEm
    cm = tt.getBestCmap()
    gs = tt.getGlyphSet()
    for ch in text:
        if ch == " ":
            x += tt["hmtx"][cm[32]][0] * s
            continue
        name = cm[ord(ch)]
        rec = DecomposingRecordingPen(gs)
        gs[name].draw(rec)
        p = skia.Path()
        for op, a in rec.value:
            a = [(x + px * s, y - py * s) for px, py in a]
            if op == "moveTo":
                p.moveTo(*a[0])
            elif op == "lineTo":
                p.lineTo(*a[0])
            elif op == "qCurveTo":
                offs = a[:-1]
                for i, q in enumerate(offs):
                    e = a[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                    p.quadTo(q[0], q[1], e[0], e[1])
            elif op == "curveTo":
                p.cubicTo(*a[0], *a[1], *a[2])
            elif op in ("closePath", "endPath"):
                p.close()
        p.setFillType(skia.PathFillType.kWinding)
        c.drawPath(p, skia.Paint(Color=skia.ColorSetARGB(255, 25, 25, 25), AntiAlias=True))
        x += tt["hmtx"][name][0] * s
    return x


def lines(before, after, out):
    rows = []
    for w in (300, 400, 550, 700):
        rows.append((f"Area before {w}", inst(os.path.join(before, "AreaSerif[wght].ttf"), w)))
        rows.append((f"Area after {w}", inst(os.path.join(after, "AreaSerif[wght].ttf"), w)))
        rows.append((f"Source Serif 4 {w}", inst(SOURCE, w)))
        if w in GEORGIA and os.path.exists(GEORGIA[w]):
            rows.append((f"Georgia Pro {w}", TTFont(GEORGIA[w])))
    size, lh = 44, 62
    W = 1900
    surf = skia.Surface(W, 20 + lh * len(rows) * len(LINES))
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    y = 20
    for text in LINES:
        for label, tt in rows:
            c.drawString(label, 8, y + lh * 0.6, LABEL, skia.Paint(Color=skia.ColorSetARGB(255, 110, 110, 110)))
            draw_line(c, tt, text, 190, y + lh * 0.72, size)
            y += lh
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)


def advance_chart(measure, out):
    """MEASURE.txt lines: glyph area_before area_after georgia source (advance growth over the class's upright)."""
    rows = [l.split() for l in open(measure) if l.strip() and not l.startswith("#")]
    f = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    W, rowh = 900, 30
    im = Image.new("RGB", (W, 70 + rowh * len(rows)), "white")
    d = ImageDraw.Draw(im)
    d.text((10, 10), "Advance growth 400 to 700 over the class's upright (n for lowercase, H for capitals)", fill="black", font=f)
    d.text((10, 32), "grey band: Georgia Pro to Source Serif 4; grey dot: before; red dot: after", fill=(90, 90, 90), font=f)
    x0, x1, lo, hi = 120, W - 20, 0.90, 1.20
    X = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)   # noqa: E731
    for i, r in enumerate(rows):
        g, b, a, ge, so = r[0], *map(float, r[1:5])
        y = 70 + i * rowh + rowh / 2
        d.text((10, y - 9), g, fill="black", font=f)
        d.line([(X(1.0), y - 12), (X(1.0), y + 12)], fill=(200, 200, 200))
        d.rectangle([X(min(ge, so)), y - 6, X(max(ge, so)), y + 6], fill=(215, 215, 215))
        d.ellipse([X(b) - 6, y - 6, X(b) + 6, y + 6], fill=(130, 130, 130))
        d.ellipse([X(a) - 5, y - 5, X(a) + 5, y + 5], fill=(215, 30, 30))
    im.save(out)
    print(out)


if __name__ == "__main__":
    before, after, out_dir, measure = sys.argv[1:5]
    os.makedirs(out_dir, exist_ok=True)
    lines(before, after, os.path.join(out_dir, "17-lines.png"))
    advance_chart(measure, os.path.join(out_dir, "17-advance.png"))
