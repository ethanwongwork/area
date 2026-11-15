"""Samples of the weight axis for the owner (0.79): the variable font instanced at 400, 500, 600 and 700, drawn from
its outlines with HarfBuzz layout, as figures. Area Serif only: nothing licensed is drawn, so the figures may be kept.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight_samples.py OUTDIR

  weights-display.png   a headline and the alphabets at 64 px, each weight
  weights-text.png      a paragraph at 16, 14 and 13 px, each weight (2x)
  weights-alternates.png  ss01, ss02, ss03 and the f ligatures on and off, each weight
  weights-signs.png     the plain signs with the letters, each weight
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import shapelib as S  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from fontTools.varLib.instancer import instantiateVariableFont  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
WEIGHTS = (400, 500, 600, 700)
NAMES = {400: "Regular 400", 500: "Medium 500", 600: "SemiBold 600", 700: "Bold 700"}
PARA = ("The quick brown fox jumps over the lazy dog. Office affluent fjord shelfful: five figures, 1234567890, "
        "re-read pages 12–18 — a/b, x | y, file_name (2 − 1) + 3 = 4. Ångström, façade, Việt Nam.")


def wrap(tt, text, px, width):
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        _lay, adv = S.layout(tt, trial)
        if adv * px / tt["head"].unitsPerEm > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    return lines + [cur]


def page(blocks, out, scale=2, width=1500):
    """blocks: [(label, [strip images])]."""
    lab = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 11 * scale)
    H = sum((18 * scale) + sum(im.height for im in ims) + 10 * scale for _l, ims in blocks) + 16 * scale
    W = max([width * scale // 2] + [im.width + 16 * scale for _l, ims in blocks for im in ims])
    im = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(im)
    y = 8 * scale
    for label, ims in blocks:
        d.text((12 * scale, y), label, font=lab, fill=110)
        y += 16 * scale
        for s in ims:
            im.paste(s, (4 * scale, y))
            y += s.height
        y += 10 * scale
    im.save(out)
    return out


def main(outdir):
    os.makedirs(outdir, exist_ok=True)
    vf = os.path.join(SERIF, "build", "AreaSerif[wght].ttf")
    fonts = {w: instantiateVariableFont(TTFont(vf), {"wght": w}) for w in WEIGHTS}
    sc = 2
    blocks = []
    for w in WEIGHTS:
        t = fonts[w]
        blocks.append((NAMES[w] + " · 64 px", [S.strip(t, s, {}, 64 * sc) for s in
                                               ("Weights of one design", "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789")]))
    out = [page(blocks, os.path.join(outdir, "weights-display.png"))]
    blocks = []
    for px in (16, 14, 13):
        for w in WEIGHTS:
            t = fonts[w]
            blocks.append((f"{NAMES[w]} · {px} px", [S.strip(t, line, {}, px * sc, pad=0.6) for line in wrap(t, PARA, px, 620)]))
    out.append(page(blocks, os.path.join(outdir, "weights-text.png")))
    blocks = []
    rows = (("Default", "Signing 1 pig for $51 · office fjord affluent shelfful", {}),
            ("ss01 footless 1 · ss02 single-storey g · ss03 ball-end dollar", "Signing 1 pig for $51 · office fjord affluent shelfful",
             {"ss01": True, "ss02": True, "ss03": True}),
            ("Ligatures off", "Signing 1 pig for $51 · office fjord affluent shelfful", {"liga": False}))
    for w in WEIGHTS:
        for label, text, feats in rows:
            blocks.append((f"{NAMES[w]} · {label} · 40 and 16 px", [S.strip(fonts[w], text, feats, 40 * sc), S.strip(fonts[w], text, feats, 16 * sc, pad=0.6)]))
    out.append(page(blocks, os.path.join(outdir, "weights-alternates.png")))
    blocks = []
    for w in WEIGHTS:
        blocks.append((f"{NAMES[w]} · 40 and 16 px", [S.strip(fonts[w], s, {}, px * sc, pad=0.4 if px > 20 else 0.6) for px in (40, 16) for s in
                                                      ("re-read 3 + 4 = 7, pages 12–18 — a/b, x | y, file_name (2 − 1) ± [n] → ←",)]))
    out.append(page(blocks, os.path.join(outdir, "weights-signs.png")))
    print("\n".join(out))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(SERIF, "build", "figures"))
