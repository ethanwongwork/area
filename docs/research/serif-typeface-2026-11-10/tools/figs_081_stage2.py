"""Area Serif 0.81, owner round 2: figures. Area only (references appear as measured numbers, never drawn).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_stage2.py \
        BEFORE_DIR AFTER_DIR OUT_DIR LEAN_BEFORE.txt LEAN_AFTER.txt THICKENING.txt

Writes:
  16-figures.png       8 9 0 6 5 3 at 300 400 550 700, before (grey) under after (red outline)
  16-lean.png          lean drift from 400 at 700 (and 300) per letter: Area before, after, the references' band
  16-thickening.png    the even-thickening table (growth 400 to 700 and to 300 per part kind)
  16-combs.png         g, a.ss03, l.ss04 in the Light and Bold masters, curvature combs, before over after
"""
import os
import re
import subprocess
import sys

import skia
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081_owner as O  # noqa: E402

SERIF = O.SERIF
FONT = "/System/Library/Fonts/Helvetica.ttc"


def lean_rows(path):
    """{glyph: {weight: (drift, lo, hi)}} from audit_lean --refs output (flag lines only list outliers; the full
    numbers come from the audit file the run wrote)."""
    out = {}
    for line in open(path):
        m = re.match(r"\s+(\S+) lean vs refs: (.*)", line)
        if not m:
            continue
        for part in m.group(2).split("; "):
            w, d, lo, hi = re.match(r"(\d+) ([+-][\d.]+) \(refs ([+-][\d.]+) to ([+-][\d.]+)\)", part).groups()
            out.setdefault(m.group(1), {})[int(w)] = (float(d), float(lo), float(hi))
    return out


def lean_chart(before, after, out):
    b, a = lean_rows(before), lean_rows(after)
    names = sorted(set(b) | set(a))
    W, rowh = 900, 34
    im = Image.new("RGB", (W, 70 + rowh * len(names)), "white")
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(FONT, 16)
    d.text((10, 10), "Lean drift at 700 (top half's ink centre against the bottom half's, change from 400, share of height)", fill="black", font=f)
    d.text((10, 32), "grey band: Georgia Pro to Source Serif 4; grey dot: before; red dot: after (a letter not listed after is inside the band)", fill=(90, 90, 90), font=f)
    x0, x1, lo_v, hi_v = 120, W - 20, -0.13, 0.13
    X = lambda v: x0 + (v - lo_v) / (hi_v - lo_v) * (x1 - x0)   # noqa: E731
    for i, n in enumerate(names):
        y = 70 + i * rowh + rowh / 2
        d.text((10, y - 9), n, fill="black", font=f)
        d.line([(X(0), y - 12), (X(0), y + 12)], fill=(200, 200, 200))
        ref = (b.get(n) or a.get(n) or {}).get(700)
        if ref:
            d.rectangle([X(ref[1]), y - 6, X(ref[2]), y + 6], fill=(215, 215, 215))
        for src, col in ((b, (130, 130, 130)), (a, (215, 30, 30))):
            v = src.get(n, {}).get(700)
            if v:
                d.ellipse([X(v[0]) - 6, y - 6, X(v[0]) + 6, y + 6], fill=col)
    im.save(out)
    print(out)


def table_image(txt, out):
    lines = open(txt).read().rstrip().splitlines()
    f = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 15)
    W = 12 + max(len(l) for l in lines) * 9
    im = Image.new("RGB", (W, 20 + 20 * len(lines)), "white")
    d = ImageDraw.Draw(im)
    for i, l in enumerate(lines):
        d.text((8, 8 + 20 * i), l, fill="black", font=f)
    im.save(out)
    print(out)


def main(before, after, out_dir, lean_b, lean_a, thick):
    os.makedirs(out_dir, exist_ok=True)
    vb, va = os.path.join(before, "AreaSerif[wght].ttf"), os.path.join(after, "AreaSerif[wght].ttf")
    rows = [(n, [(vb, n, "fill"), (va, n, "line")]) for n in ("eight", "nine", "zero", "six", "five", "three")]
    O.grid(rows, (300, 400, 550, 700), os.path.join(out_dir, "16-figures.png"), box=(-20, -40, 660, 760), s=0.16,
           title="8 9 0 6 5 3: before (grey) under after (red outline); the 9's lower quarter, the 6 turned, the 5's stroke")
    lean_chart(lean_b, lean_a, os.path.join(out_dir, "16-lean.png"))
    table_image(thick, os.path.join(out_dir, "16-thickening.png"))
    combs = os.path.join(HERE, "combs.py")
    parts = []
    for style in ("Light", "Bold"):
        o = os.path.join(out_dir, f"_c-{style}.png")
        subprocess.run([O.PY, combs, o, "g", "a.ss03", "l.ss04", "--ufo", os.path.join(after, f"AreaSerif-{style}.ufo"),
                        "--before", os.path.join(before, f"AreaSerif-{style}.ufo"), "--y", "-300,200", "--s", "0.6"],
                       check=True, cwd=SERIF)
        parts.append(o)
    ims = [Image.open(p) for p in parts]
    im = Image.new("RGB", (sum(i.width for i in ims) + 10, max(i.height for i in ims)), "white")
    x = 0
    d = ImageDraw.Draw(im)
    for st, i in zip(("Light master", "Bold master"), ims):
        im.paste(i, (x, 0))
        d.text((x + i.width // 2 - 80, 4), st, fill="black", font=ImageFont.truetype(FONT, 28))
        x += i.width + 10
    im.save(os.path.join(out_dir, "16-combs.png"))
    for p in parts:
        os.remove(p)
    print(os.path.join(out_dir, "16-combs.png"))


if __name__ == "__main__":
    main(*sys.argv[1:])
