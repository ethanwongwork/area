"""Area Serif 0.81, axis round 2: the two options for the cedi, for the owner. Left, as built: Libre Baskerville's own
drawn C (91 to 602 units, 416 wide) and its stroke, at 400 and 700 (the C thins where the stroke crosses it at the
Bold). Right, a sketch of option B: Area's own capital C at 400 and 700 with a stroke of the cedi's own width and
reach past the letter through its middle, as the colon sign (U+20A1) and the guarani (U+20B2) are built. A picture only: nothing in
the build changes.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_cedi.py VF OUT.png"""
import os
import sys

import skia
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081_stage3 as S3  # noqa: E402


def stroke_of(tt):
    """The cedi's stroke (its second contour) as (x0, x1, y0, y1)."""
    gs = tt.getGlyphSet()
    name = tt.getBestCmap()[0x20B5]
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    conts, cur = [], []
    for op, a in rec.value:
        if op == "moveTo":
            cur = [a[0]]
        elif op in ("closePath", "endPath"):
            conts.append(cur)
        else:
            cur += list(a)
    s = min(conts, key=len)
    xs, ys = [p[0] for p in s], [p[1] for p in s]
    return min(xs), max(xs), min(ys), max(ys)


def main(vf, out):
    size, gap = 300, 40
    surf = skia.Surface(4 * (size + gap) + 60, size + 200)
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    grey = skia.Paint(Color=skia.ColorSetARGB(255, 110, 110, 110))
    x = 30
    for label, opt in (("A, as built", "A"), ("B, Area's C + stroke", "B")):
        for w in (400, 700):
            tt = S3.inst(vf, w)
            s = size / 1000
            base = size + 70
            c.drawString(f"{label}, {w}", x, 22, S3.LABEL, grey)
            if opt == "A":
                S3.draw_line(c, tt, "₵", x, base, size)
            else:
                S3.draw_line(c, tt, "C", x, base, size)
                x0, x1, y0, y1 = stroke_of(tt)
                gs = tt.getGlyphSet()
                bp = BoundsPen(gs)
                gs[tt.getBestCmap()[ord("C")]].draw(bp)
                cx = (bp.bounds[0] + bp.bounds[2]) / 2
                half = (x1 - x0) / 2
                # the stroke reaches past the C as far as the built cedi's reaches past its own C (100 under, 119 over)
                y0, y1 = bp.bounds[1] - 100, bp.bounds[3] + 119
                r = skia.Rect.MakeLTRB(x + (cx - half) * s, base - y1 * s, x + (cx + half) * s, base - y0 * s)
                c.drawRect(r, skia.Paint(Color=skia.ColorSetARGB(255, 25, 25, 25), AntiAlias=True))
            x += size + gap
    surf.makeImageSnapshot().save(out, skia.kPNG)
    print(out)


if __name__ == "__main__":
    main(*sys.argv[1:3])
