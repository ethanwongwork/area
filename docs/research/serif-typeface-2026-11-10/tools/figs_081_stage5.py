"""Area Serif 0.81, owner round 5: before over after, Area only.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_stage5.py \
        BEFORE_DIR AFTER_DIR OUT_DIR
Writes 19-lines.png ("xyz vxy oxo nxn exit taxi Xx", "sass Sess access cosy", "cease ecce gag egg" at 300 400 550 700,
before then after) and 19-g-light.png (g in the Light master, curvature combs, before over after)."""
import os
import subprocess
import sys

import skia

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081_stage3 as S3  # noqa: E402

LINES = ("xyz vxy oxo nxn exit taxi Xx", "sass Sess access cosy", "cease ecce gag egg")


def main(before, after, out_dir):
    rows = []
    for w in (300, 400, 550, 700):
        rows.append((f"before {w}", S3.inst(os.path.join(before, "AreaSerif[wght].ttf"), w)))
        rows.append((f"after {w}", S3.inst(os.path.join(after, "AreaSerif[wght].ttf"), w)))
    size, lh = 52, 70
    surf = skia.Surface(1500, 20 + lh * len(rows) * len(LINES))
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    y = 20
    for text in LINES:
        for label, tt in rows:
            c.drawString(label, 8, y + lh * 0.6, S3.LABEL, skia.Paint(Color=skia.ColorSetARGB(255, 110, 110, 110)))
            S3.draw_line(c, tt, text, 120, y + lh * 0.72, size)
            y += lh
    out = os.path.join(out_dir, "19-lines.png")
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)
    combs = os.path.join(HERE, "combs.py")
    py = os.path.join(S3.SERIF, ".venv", "bin", "python")
    o = os.path.join(out_dir, "19-g-light.png")
    subprocess.run([py, combs, o, "g", "--ufo", os.path.join(after, "AreaSerif-Light.ufo"), "--before",
                    os.path.join(before, "AreaSerif-Light.ufo"), "--y", "-300,140", "--s", "0.8"], check=True, cwd=S3.SERIF)


if __name__ == "__main__":
    main(*sys.argv[1:4])
