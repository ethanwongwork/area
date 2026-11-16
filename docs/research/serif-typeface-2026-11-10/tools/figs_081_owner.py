"""Area Serif 0.81, the owner's round (15 November): figures for the three points. Area only; nothing licensed drawn.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_owner.py \
        BEFORE_DIR AFTER_DIR OUT_DIR [V080_DIR]

BEFORE_DIR / AFTER_DIR hold AreaSerif-{Light,Regular,Bold}.ufo and AreaSerif[wght].ttf (before: the tip's build;
after: this round's). V080_DIR: 0.80's build (for g.ss02). Writes:
  15-tails-combs.png      j y g.ss02 g in the Light and the Bold master, curvature combs, before over after
  15-gss02.png            g.ss02 at 300 400 550 700: 0.80, the tip (0.81), this round
  15-lean-waterfall.png   the named letters at 300 to 700, before (grey) under after (red outline)
"""
import io
import os
import subprocess
import sys

import skia
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
PY = os.path.join(SERIF, ".venv", "bin", "python")
LABEL = skia.Font(skia.Typeface("Helvetica"), 15)


def inst(path, w):
    tt = TTFont(path)
    b = io.BytesIO()
    instantiateVariableFont(tt, {"wght": w}).save(b)
    b.seek(0)
    return TTFont(b)


def gpath(tt, ch):
    cm = tt.getBestCmap()
    name = ch if ch in tt.getGlyphOrder() else cm[ord(ch)] if len(ch) == 1 else ch
    gs = tt.getGlyphSet()
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    p = skia.Path()
    for op, a in rec.value:
        if op == "moveTo":
            p.moveTo(*a[0])
        elif op == "lineTo":
            p.lineTo(*a[0])
        elif op == "qCurveTo":
            pts = list(a)
            offs = pts[:-1]
            for i, q in enumerate(offs):
                e = pts[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                p.quadTo(q[0], q[1], e[0], e[1])
        elif op == "curveTo":
            p.cubicTo(*a[0], *a[1], *a[2])
        elif op in ("closePath", "endPath"):
            p.close()
    p.setFillType(skia.PathFillType.kWinding)
    return p, gs[name].width


def grid(rows, weights, out, box=(-60, -260, 760, 760), s=0.17, title=""):
    """rows: [(label, [(vf path, style)])]; style 'fill' grey ink, 'line' red outline, 'ink' black ink."""
    x0, y0, x1, y1 = box
    cw, ch = (x1 - x0) * s, (y1 - y0) * s
    surf = skia.Surface(int(140 + cw * len(weights)), int(52 + ch * len(rows)))
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    c.drawString(title, 8, 18, LABEL, skia.Paint(Color=skia.ColorBLACK))
    cache = {}
    for k, w in enumerate(weights):
        c.drawString(str(w), 140 + k * cw + cw / 2 - 12, 40, LABEL, skia.Paint(Color=skia.ColorSetARGB(255, 90, 90, 90)))
    for r, (label, layers) in enumerate(rows):
        c.drawString(label, 8, 52 + r * ch + ch / 2, LABEL, skia.Paint(Color=skia.ColorBLACK))
        for k, w in enumerate(weights):
            c.save()
            c.translate(140 + k * cw - x0 * s, 52 + r * ch + y1 * s)
            c.scale(s, -s)
            for yy in (0, 520):
                c.drawLine(x0, yy, x1, yy, skia.Paint(Color=skia.ColorSetARGB(50, 0, 0, 255), StrokeWidth=1 / s))
            for vf, glyph, style in layers:
                key = (vf, w)
                if key not in cache:
                    cache[key] = inst(vf, w)
                p, _ = gpath(cache[key], glyph)
                if style == "fill":
                    c.drawPath(p, skia.Paint(Color=skia.ColorSetARGB(255, 175, 175, 175), AntiAlias=True))
                elif style == "ink":
                    c.drawPath(p, skia.Paint(Color=skia.ColorSetARGB(255, 30, 30, 30), AntiAlias=True))
                else:
                    c.drawPath(p, skia.Paint(Color=skia.ColorSetARGB(255, 215, 30, 30), AntiAlias=True,
                                             Style=skia.Paint.kStroke_Style, StrokeWidth=1.4 / s))
            c.restore()
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)


def main(before, after, out_dir, v080=None):
    os.makedirs(out_dir, exist_ok=True)
    vb, va = os.path.join(before, "AreaSerif[wght].ttf"), os.path.join(after, "AreaSerif[wght].ttf")
    combs = os.path.join(HERE, "combs.py")
    parts = []
    for style in ("Light", "Bold"):
        o = os.path.join(out_dir, f"_combs-{style}.png")
        subprocess.run([PY, combs, o, "j", "y", "g.ss02", "--ufo", os.path.join(after, f"AreaSerif-{style}.ufo"),
                        "--before", os.path.join(before, f"AreaSerif-{style}.ufo"), "--y", "-300,140", "--s", "0.6"], check=True, cwd=SERIF)
        parts.append(o)
    from PIL import Image
    ims = [Image.open(p) for p in parts]
    W = sum(i.width for i in ims) + 10 * (len(ims) - 1)
    im = Image.new("RGB", (W, max(i.height for i in ims)), "white")
    x = 0
    for i in ims:
        im.paste(i, (x, 0))
        x += i.width + 10
    from PIL import ImageDraw, ImageFont
    d = ImageDraw.Draw(im)
    f_ = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    x = 0
    for st, i in zip(("Light master", "Bold master"), ims):
        d.text((x + i.width // 2 - 80, 4), st, fill="black", font=f_)
        x += i.width + 10
    im.save(os.path.join(out_dir, "15-tails-combs.png"))
    for p in parts:
        os.remove(p)
    print(os.path.join(out_dir, "15-tails-combs.png"))
    rows = []
    if v080:
        rows.append(("0.80", [(os.path.join(v080, "AreaSerif[wght].ttf"), "g.ss02", "ink")]))
    rows += [("0.81 tip", [(vb, "g.ss02", "ink")]), ("this round", [(va, "g.ss02", "ink")]),
             ("tip under new", [(vb, "g.ss02", "fill"), (va, "g.ss02", "line")])]
    grid(rows, (300, 400, 550, 700), os.path.join(out_dir, "15-gss02.png"), box=(-20, -260, 660, 560),
         title="g.ss02: 0.80, the 0.81 tip, this round (ball back to 0.80's 0.138 x-height, tail end as before)")
    names = list("fghrstvxyzFGYZBCD") + ["a.ss03", "nine", "six", "five", "three"]
    rows = [(n, [(vb, n, "fill"), (va, n, "line")]) for n in names]
    grid(rows, (300, 400, 500, 600, 700), os.path.join(out_dir, "15-lean-waterfall.png"), box=(-60, -260, 860, 800),
         s=0.12, title="before (grey) under after (red outline), 300 to 700")


if __name__ == "__main__":
    main(*sys.argv[1:])
