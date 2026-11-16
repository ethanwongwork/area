"""Area Serif 0.81, axis round: the glyphs the round changed, large, at 300 400 550 700, before (grey, the round 7
build) over after (black). Area only.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_axisround.py \
        BEFORE_VF AFTER_VF OUT_DIR"""
import os
import sys

import skia

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081_stage3 as S3  # noqa: E402

# the hooks with a tilted ball (fixed), then the glyphs the reading also reached that the audits now flag
LINES = ("Ƙ Ƴ Ⱳ ⱳ ƴ ƒ", "ß ɠ ʃ ɽ ʕ ɂ Ɠ")


def main(before, after, out_dir):
    weights = (300, 400, 550, 700)
    rows = [(w, S3.inst(before, w), S3.inst(after, w)) for w in weights]
    size, lh = 110, 150
    surf = skia.Surface(1500, 30 + 2 * lh * len(rows) * len(LINES))
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    grey = skia.Paint(Color=skia.ColorSetARGB(255, 110, 110, 110))
    y = 30
    for text in LINES:
        for w, tb, ta in rows:
            for label, tt in ((f"{w} before", tb), (f"{w} after", ta)):
                c.drawString(label, 8, y + lh * 0.6, S3.LABEL, grey)
                S3.draw_line(c, tt, text, 110, y + lh * 0.75, size)
                y += lh
    out = os.path.join(out_dir, "22-axis.png")
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)


if __name__ == "__main__":
    main(*sys.argv[1:4])
