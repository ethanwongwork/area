"""Every audit_rays flag, drawn: the glyph at 400 (grey), at the weight the flag names (red outline), the place
circled (0.81, integration).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/rays_flags.py \
        build/weight/audit-rays.txt OUT.png
"""
import io
import re
import sys

from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

VF = "build/AreaSerif[wght].ttf"
LAB = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 13)
_I = {}


def inst(w):
    if w not in _I:
        b = io.BytesIO()
        instantiateVariableFont(TTFont(VF), {"wght": w}).save(b)
        b.seek(0)
        _I[w] = TTFont(b)
    return _I[w]


def polys(tt, name, n=12):
    gs = tt.getGlyphSet()
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    out, cur = [], []
    for op, a in rec.value:
        if op == "moveTo":
            cur = [a[0]]
        elif op == "lineTo":
            cur.append(a[0])
        elif op == "qCurveTo":
            pts = list(a)
            offs, p0 = pts[:-1], cur[-1]
            for i, q in enumerate(offs):
                e = pts[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                for k in range(1, n + 1):
                    t = k / n
                    cur.append(((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * q[0] + t * t * e[0],
                                (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * q[1] + t * t * e[1]))
                p0 = e
        elif op in ("closePath", "endPath"):
            out.append(cur)
            cur = []
    return out


def cell(name, w, place, note, S=0.22, W=260, H=300):
    im = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(im)
    T = lambda p: (40 + p[0] * S, H - 70 - p[1] * S)          # noqa: E731
    acc = Image.new("L", (W, H), 0)
    da = ImageDraw.Draw(acc)
    for P in polys(inst(400), name):
        if len(P) > 2:
            da.polygon([T(p) for p in P], fill=255)          # union-ish fill (overlaps stay ink)
    im.paste((205, 205, 205), mask=acc)
    for P in polys(inst(w), name):
        if len(P) > 2:
            d.line([T(p) for p in P] + [T(P[0])], fill=(210, 30, 30), width=1)
    x, y = T(place)
    d.ellipse((x - 9, y - 9, x + 9, y + 9), outline=(20, 60, 220), width=2)
    d.text((4, 4), name, font=LAB, fill=(0, 0, 0))
    for k, line in enumerate([note[i:i + 40] for i in range(0, min(len(note), 120), 40)]):
        d.text((4, H - 60 + 15 * k), line, font=LAB, fill=(60, 60, 60))
    return im


def main():
    src, out = sys.argv[1:3]
    cells = []
    for line in open(src):
        if ":" not in line or "\trays" in line:
            continue
        name, rest = line.split(":", 1)
        first = rest.split(";")[0].strip()
        m = re.search(r"at \((-?\d+), (-?\d+)\)", first)
        if not m:
            continue
        ws = [int(x) for x in re.findall(r"at (\d{3})", first)] or [300]
        w = ws[0] if "thinner at" in first or "thicker at" in first else 300
        cells.append(cell(name, w, (int(m.group(1)), int(m.group(2))), first))
    cols = 6
    W, H = cells[0].width, cells[0].height
    rows = (len(cells) + cols - 1) // cols
    pg = Image.new("RGB", (W * cols, H * rows + 30), "white")
    ImageDraw.Draw(pg).text((8, 8), "audit_rays flags: grey 400, red the flagged weight, blue circle the place", font=LAB, fill=(0, 0, 0))
    for k, c in enumerate(cells):
        pg.paste(c, ((k % cols) * W, 30 + (k // cols) * H))
    pg.save(out)
    print(out, len(cells))


if __name__ == "__main__":
    main()
