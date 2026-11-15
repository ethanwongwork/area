"""Area Serif 0.81 round 3: overlap glyphs on CoreText (Apple's rasteriser), overlaps kept against removed.

    python ct_overlaps.py CT_RENDER_BINARY OUT_DIR

For every struck glyph (overlap.struck_names) at 300, 400 and 700 and 13, 16 and 64 px: CoreText renders the
variable font at that weight (overlaps kept, the glyf overlap flag set), and the same instance made static by
fontTools with its overlaps removed (pathops). The two images are compared pixel by pixel: lighter (a white
sliver where contours overlap) and darker (coverage added where two edges cross in one pixel). Writes a table and
a sheet of the worst."""
import io
import os
import subprocess
import sys

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif")
sys.path.insert(0, S)


def main():
    from fontTools.ttLib import TTFont
    from fontTools.ttLib.removeOverlaps import removeOverlaps
    from fontTools.varLib.instancer import instantiateVariableFont
    import ufoLib2
    import overlap as OV
    binary, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    vf = os.path.join(S, "build", "AreaSerif[wght].ttf")
    names = sorted(OV.struck_names(ufoLib2.Font.open(os.path.join(S, "build", "AreaSerif-Regular.ufo"))))
    rows = []
    for w in (300, 400, 700):
        f = instantiateVariableFont(TTFont(vf), {"wght": w})
        removeOverlaps(f)
        flat = os.path.join(out, f"flat-{w}.ttf")
        f.save(flat)
        for px in (13, 16, 64):
            a, b = os.path.join(out, f"vf-{w}-{px}.png"), os.path.join(out, f"flat-{w}-{px}.png")
            subprocess.run([binary, vf, a, str(px), str(w)] + names, check=True)
            subprocess.run([binary, flat, b, str(px), "0"] + names, check=True)
            A = np.asarray(Image.open(a).convert("L"), dtype=int)
            Bm = np.asarray(Image.open(b).convert("L"), dtype=int)
            cell = A.shape[1] // len(names)
            for i, n in enumerate(names):
                d = A[:, i * cell:(i + 1) * cell] - Bm[:, i * cell:(i + 1) * cell]
                rows.append((n, w, px, int(d.max()), int(-d.min())))      # lighter, darker (0..255)
    with open(os.path.join(out, "coretext-overlaps.txt"), "w") as fh:
        fh.write("glyph\tweight\tpx\tlighter\tdarker\n")
        fh.writelines(f"{n}\t{w}\t{px}\t{l}\t{d}\n" for n, w, px, l, d in rows)
    worst_l = max(rows, key=lambda r: r[3])
    worst_d = max(rows, key=lambda r: r[4])
    print(f"CoreText, {len(names)} struck glyphs x 3 weights x 3 sizes: lighter at most {worst_l[3]}/255 ({worst_l[:3]}), "
          f"darker at most {worst_d[4]}/255 ({worst_d[:3]})")
    print("over 16 lighter:", sorted({(r[0], r[1], r[2]) for r in rows if r[3] > 16})[:40])


if __name__ == "__main__":
    main()
