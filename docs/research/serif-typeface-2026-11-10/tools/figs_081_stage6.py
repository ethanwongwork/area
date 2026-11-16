"""Area Serif 0.81, owner round 6: every change of the owner rounds in one place. Area only.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_stage6.py \
        TIP_DIR FINAL_DIR OUT_DIR
Writes 20-waterfall.png: the lowercase, the capitals and the figures at 300 400 550 700, the 0.81 tip (d0133284) above
the final build, line for line."""
import os
import sys

import skia

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081_stage3 as S3  # noqa: E402

LINES = ("abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789 gɡ")


def main(tip, final, out_dir):
    rows = []
    for w in (300, 400, 550, 700):
        rows.append((f"tip {w}", S3.inst(os.path.join(tip, "AreaSerif[wght].ttf"), w)))
        rows.append((f"final {w}", S3.inst(os.path.join(final, "AreaSerif[wght].ttf"), w)))
    size, lh = 46, 62
    surf = skia.Surface(1500, 20 + lh * len(rows) * len(LINES))
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    y = 20
    for text in LINES:
        for label, tt in rows:
            c.drawString(label, 8, y + lh * 0.6, S3.LABEL, skia.Paint(Color=skia.ColorSetARGB(255, 110, 110, 110)))
            S3.draw_line(c, tt, text, 110, y + lh * 0.72, size)
            y += lh
    out = os.path.join(out_dir, "20-waterfall.png")
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)


if __name__ == "__main__":
    main(*sys.argv[1:4])
