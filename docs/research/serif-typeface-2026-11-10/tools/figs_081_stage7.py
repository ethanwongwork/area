"""Area Serif 0.81, owner round 7: the axis list's glyphs at 300 400 550 700 on the final build (none changed this
round; each row is a glyph the audits still flag, large). Area only.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_stage7.py VF OUT_DIR"""
import os
import sys

import skia

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081_stage3 as S3  # noqa: E402

LINES = ("Ƙ ƴ ⱳ Ƴ Ⱳ ɲ ƒ ƭ", "₵ ˛ ® @ Ə ɂ & $", "ð œ ɽ ⌦ ⌫ ✓")


def main(vf, out_dir):
    rows = [(f"{w}", S3.inst(vf, w)) for w in (300, 400, 550, 700)]
    size, lh = 90, 120
    surf = skia.Surface(1500, 20 + lh * len(rows) * len(LINES))
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    y = 20
    for text in LINES:
        for label, tt in rows:
            c.drawString(label, 8, y + lh * 0.6, S3.LABEL, skia.Paint(Color=skia.ColorSetARGB(255, 110, 110, 110)))
            S3.draw_line(c, tt, text, 70, y + lh * 0.75, size)
            y += lh
    out = os.path.join(out_dir, "21-axis.png")
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)


if __name__ == "__main__":
    main(*sys.argv[1:3])
