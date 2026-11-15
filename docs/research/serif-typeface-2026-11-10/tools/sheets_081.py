"""Build 0.81 (integration): the eye pass and the weights-between-masters sheets, from the current build.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/sheets_081.py OUTDIR

  waterfall.png      a-z A-Z 0-9 and the alternates at 300 350 ... 700, large
  text-sizes.png     a paragraph at 13 and 16 px at 300 400 500 600 700 (each pixel drawn 2 times)
  quotes.png         "quoted" 'single' at 400 and 700, with the gap-to-mark ratio beside Georgia Pro and Source Serif 4
  necks-light.png    S z z.ss06 one and three superior at 300 against 400 (the neck rule's effect)
  ae-bold.png        ae at 400 550 700 (the arm crotch rule)
  marks.png          every composite with two or more marks at 300 400 700
  asterisk.png       the asterisk in a line of Bold punctuation, and its weight gain beside three references
Numbers go to OUTDIR/eye-081.txt. Georgia Pro, Source Serif 4 and Literata are measured, never drawn into a kept figure
other than as numbers (quotes.png and asterisk.png draw Area Serif only)."""
import io
import os
import sys

import pathops
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import shapelib as S  # noqa: E402

VF = "build/AreaSerif[wght].ttf"
LAB = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
_CACHE = {}


def at(w, path=VF, extra=None):
    key = (path, w, tuple(sorted((extra or {}).items())))
    if key not in _CACHE:
        loc = {"wght": w}
        loc.update(extra or {})
        f = TTFont(path)
        loc = {k: v for k, v in loc.items() if k in [a.axisTag for a in f["fvar"].axes]}
        buf = io.BytesIO()
        instantiateVariableFont(f, loc).save(buf)
        buf.seek(0)
        _CACHE[key] = TTFont(buf)
    return _CACHE[key]


def page(blocks, out, gap=22):
    ims = [(t, [i.convert("RGB") for i in imgs]) for t, imgs in blocks]
    W = max(i.width for _t, imgs in ims for i in imgs) + 40
    H = sum(34 + sum(i.height for i in imgs) + gap for _t, imgs in ims) + 10
    pg = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(pg)
    y = 10
    for t, imgs in ims:
        d.text((20, y), t, font=LAB, fill=(60, 60, 60))
        y += 30
        for i in imgs:
            pg.paste(i, (20, y))
            y += i.height
        y += gap
    pg.save(out)
    print(out)


def px2(im, k=2):
    return im.resize((im.width * k, im.height * k), Image.NEAREST)


ALTS = {"ss01": "1", "ss02": "g", "ss03": "a", "ss04": "l", "zero": "0", "ss05": "0", "ss06": "7z"}
STEPS = (300, 350, 400, 450, 500, 550, 600, 650, 700)


def side(imgs, gap=24):
    imgs = [i.convert("RGB") for i in imgs]
    out = Image.new("RGB", (sum(i.width for i in imgs) + gap * (len(imgs) - 1), max(i.height for i in imgs)), "white")
    x = 0
    for i in imgs:
        out.paste(i, (x, 0))
        x += i.width + gap
    return out


def waterfall(out):
    blocks = []
    for line, label in (("abcdefghijklmnopqrstuvwxyz", "a-z"), ("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "A-Z")):
        blocks.append((f"{label} at {', '.join(map(str, STEPS))}", [S.strip(at(w), line, {}, 48, ss=2, pad=0.2) for w in STEPS]))
    blocks.append((f"0-9, then each alternate on (ss01 1, ss02 g, ss03 a, ss04 l, zero, ss05 0, ss06 7 z) at "
                   f"{', '.join(map(str, STEPS))}",
                   [side([S.strip(at(w), "0123456789", {}, 48, ss=2, pad=0.2)]
                         + [S.strip(at(w), t, {k: True}, 48, ss=2, pad=0.1) for k, t in ALTS.items()]) for w in STEPS]))
    page(blocks, out)


PARA = ("Area Serif is a serif for interface text. Quick brown foxes jump over the lazy dog; 0.81 adds per-master "
        "kerning, a white law between parts, and alternates (g, a, l, 0, 7, z).")


def text_sizes(out):
    blocks = []
    for px in (13, 16):
        for w in (300, 400, 500, 600, 700):
            blocks.append((f"{px} px, weight {w} (each pixel 2 times)", [px2(S.strip(at(w), PARA, {}, px, ss=4, pad=0.3))]))
    page(blocks, out)


def ink_parts(tt, name):
    """The glyph's ink split into its separate pieces: [(xmin, xmax, area)] left to right."""
    gs = tt.getGlyphSet()
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    p = pathops.Path()
    rec.replay(p.getPen())
    p = pathops.op(p, pathops.Path(), pathops.PathOp.UNION)
    out = []
    for c in p.contours:
        q = pathops.Path()
        c.draw(q.getPen())
        b = q.bounds
        out.append((b[0], b[2], abs(q.area)))
    return sorted(out)


def area(tt, name):
    return sum(a for _x0, _x1, a in ink_parts(tt, name))


def name_of(tt, ch):
    return tt.getBestCmap()[ord(ch)]


def quote_ratios(tt):
    """For each double quote: (white between its two marks) / (one mark's width)."""
    out = {}
    for ch in "“”\"":
        parts = ink_parts(tt, name_of(tt, ch))
        if len(parts) >= 2:
            a, b = parts[0], parts[1]
            out[ch] = round((b[0] - a[1]) / (a[1] - a[0]), 3)
    return out


REFS = {"Georgia Pro": (os.path.expanduser("~/Library/Fonts/GeorgiaPro-Regular.ttf"),
                        os.path.expanduser("~/Library/Fonts/GeorgiaPro-Bold.ttf")),
        "Source Serif 4": ("build/eval-fonts/SourceSerif4.ttf", None),
        "Literata": ("build/eval-fonts/Literata.ttf", None)}


def ref_fonts(name):
    reg, bold = REFS[name]
    if bold:
        return TTFont(reg), TTFont(bold)
    extra = {"opsz": 12} if "Literata" in name else {"opsz": 16}
    return at(400, reg, extra), at(700, reg, extra)


def quotes(out, log):
    text = "“quoted” ‘single’ \"plain\" 'one'"
    blocks = []
    for w in (400, 700):
        blocks.append((f"Area Serif {w}: 72 px", [S.strip(at(w), text, {}, 72, ss=2)]))
        blocks.append((f"Area Serif {w}: 16 px (each pixel 2 times)", [px2(S.strip(at(w), "He said “quoted” and ‘single’ here.", {}, 16, ss=4))]))
    log.append("quotes: white between the two marks over one mark's width (“ ” \")")
    for w in (400, 700):
        log.append(f"  Area Serif {w}: {quote_ratios(at(w))}")
    for nm in ("Georgia Pro", "Source Serif 4"):
        r, b = ref_fonts(nm)
        log.append(f"  {nm} Regular: {quote_ratios(r)}   Bold: {quote_ratios(b)}")
    page(blocks, out)


def asterisk(out, log):
    blocks = []
    for w in (400, 700):
        blocks.append((f"{w}: the asterisk among the Bold's punctuation", [S.strip(at(w), "a*b, c.d ‘e’ f*g “h” *", {}, 72, ss=2)]))
    page(blocks, out)
    log.append("asterisk: ink area Bold over Regular, beside the period's and the quote's (weight gain), and n's")
    rows = [("Area Serif", at(400), at(700))] + [(nm,) + ref_fonts(nm) for nm in ("Georgia Pro", "Source Serif 4", "Literata")]
    for nm, r, b in rows:
        g = {ch: area(b, name_of(b, ch)) / area(r, name_of(r, ch)) for ch in "*.,’n"}
        log.append(f"  {nm}: * {g['*']:.3f}  . {g['.']:.3f}  , {g[',']:.3f}  ’ {g[chr(0x2019)]:.3f}  n {g['n']:.3f}  "
                   f"(* over n {g['*'] / g['n']:.3f})")


def necks_light(out):
    blocks = []
    for w in (400, 350, 300):
        tt = at(w)
        blocks.append((f"{w}", [S.strip(tt, "S z ¹ ³", {}, 140, ss=2, pad=0.1),
                                S.strip(tt, "z", {"ss06": True}, 140, ss=2, pad=0.1)]))
    page(blocks, out)


def ae_bold(out):
    page([(f"{w}", [S.strip(at(w), "æ Æ æther", {}, 140, ss=2, pad=0.1)]) for w in (400, 550, 700)], out)


def marks(out):
    """Every composite with two or more marks (by name: alternates and unencoded ones too), at 300, 400 and 700."""
    import ufoLib2
    sys.path.insert(0, os.getcwd())
    import bold as B
    reg = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    names = [g.name for g in reg if g.components and not g.contours
             and sum(1 for c in g.components if c.baseGlyph in reg and B.is_mark(reg[c.baseGlyph])) >= 2]
    import rays_flags as RF
    tt = at(400)
    cm, order = tt.getBestCmap(), set(tt.getGlyphOrder())
    names = [cm[reg[n].unicodes[0]] if reg[n].unicodes and reg[n].unicodes[0] in cm else n for n in names]
    names = [n for n in names if n in order]                   # the font's own names (production names differ)
    cols, S_, W, H = 20, 0.07, 76, 110
    rows = (len(names) + cols - 1) // cols
    blocks = []
    for w in (300, 400, 700):
        RF.VF = VF
        im = Image.new("L", (cols * W, rows * H), 255)
        d = ImageDraw.Draw(im)
        for k, n in enumerate(names):
            ox, oy = (k % cols) * W + 8, (k // cols) * H + 85
            from PIL import ImageChops
            acc = Image.new("1", im.size, 0)
            for P in RF.polys(RF.inst(w), n):                  # even-odd: counters stay white
                if len(P) > 2:
                    lay = Image.new("1", im.size, 0)
                    ImageDraw.Draw(lay).polygon([(ox + x * S_, oy - y * S_) for x, y in P], fill=1)
                    acc = ImageChops.logical_xor(acc, lay)
            im.paste(0, mask=acc.convert("L"))
        blocks.append((f"{w}: the {len(names)} composites with two or more marks", [im]))
        RF._I.clear()
    page(blocks, out)
    return len(names)


if __name__ == "__main__":
    od = sys.argv[1]
    os.makedirs(od, exist_ok=True)
    log = []
    waterfall(os.path.join(od, "waterfall.png"))
    text_sizes(os.path.join(od, "text-sizes.png"))
    quotes(os.path.join(od, "quotes.png"), log)
    asterisk(os.path.join(od, "asterisk.png"), log)
    necks_light(os.path.join(od, "necks-light.png"))
    ae_bold(os.path.join(od, "ae-bold.png"))
    log.append(f"marks: {marks(os.path.join(od, 'marks.png'))} composites with two or more marks")
    open(os.path.join(od, "eye-081.txt"), "w").write("\n".join(log) + "\n")
    print("\n".join(log))
