"""Contact sheets for eyes, every face drawn by the same code from its outlines (reference faces are drawn, never
stored: keep the output in typefaces/area-serif/build/).

  python sheets.py all OUTDIR [--per 80] [--cols 10] [--font PATH]     every glyph of Area Serif, in glyph order
  python sheets.py cmp OUT.png "chars" [faces ...] [--size 150]        one row per face, glyphs at one x-height
  python sheets.py names OUT.png name name ... [--size 220] [--old UFO-or-TTF]   Area glyphs by name, large; with
                                                                       --old the previous build's outline in red
  python sheets.py text OUT.png "words" [faces ...] [--px 64]          shaped text (HarfBuzz, kerning on)"""
import os
import sys

import uharfbuzz as hb
from fontTools.ttLib import TTFont
from PIL import Image, ImageChops, ImageDraw, ImageFont

import evlib as E


def label_font(size=11):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except OSError:
        return None


def mask_of(polys, W, H, T):
    acc = Image.new("1", (W, H), 0)
    for poly in polys:
        layer = Image.new("1", (W, H), 0)
        ImageDraw.Draw(layer).polygon([T(p) for p in poly], fill=1)
        acc = ImageChops.logical_xor(acc, layer)
    return acc.convert("L")


def cell(font, name=None, ch=None, size=150, k=None, lines=True, old=None, pad=0.22, width=None, label=None, ss=3):
    """One glyph in a size x size (or width x size) cell. k: scale (px per unit); default fits em 1000 + pad."""
    m = E.metrics(font)
    cs, adv = E.segs(font, ch, name)
    k = k or size / (1000 * (1 + 2 * pad)) * (520 / m["xh"]) ** 0   # px per unit at 1000 upm
    W = width or size
    base = size * 0.74
    S = ss
    im = Image.new("RGB", (W * S, size * S), "white")
    d = ImageDraw.Draw(im, "RGBA")
    x_off = (W - adv * k) / 2

    def T(p):
        return ((x_off + p[0] * k) * S, (base - p[1] * k) * S)

    if lines:
        for y, a in ((0, 90), (m["xh"], 45), (m["cap"], 45), (m["asc"], 25), (m["desc"], 25)):
            d.line([(0, (base - y * k) * S), (W * S, (base - y * k) * S)], fill=(0, 90, 200, a), width=1)
        d.line([T((0, -60)), T((0, 60))], fill=(0, 0, 0, 40))
        d.line([T((adv, -60)), T((adv, 60))], fill=(0, 0, 0, 40))
    if cs:
        polys = E.flatten(cs, 1.0)
        im.paste((20, 23, 28), mask=mask_of(polys, W * S, size * S, T))
    if old is not None:
        ocs, _ = old
        for poly in E.flatten(ocs or [], 1.0):
            q = [T(p) for p in poly]
            d.line(q + [q[0]], fill=(225, 50, 40, 255), width=S)
    im = im.resize((W, size), Image.LANCZOS)
    if label:
        ImageDraw.Draw(im).text((3, 2), label, fill=(120, 120, 120), font=label_font(10))
    return im


def grid(cells, cols):
    cw, ch = max(c.width for c in cells), max(c.height for c in cells)
    rows = (len(cells) + cols - 1) // cols
    sheet = Image.new("RGB", (cw * cols, ch * rows), "white")
    for i, c in enumerate(cells):
        sheet.paste(c, ((i % cols) * cw, (i // cols) * ch))
    d = ImageDraw.Draw(sheet)
    for i in range(1, cols):
        d.line([(i * cw, 0), (i * cw, sheet.height)], fill=(235, 235, 235))
    for j in range(1, rows):
        d.line([(0, j * ch), (sheet.width, j * ch)], fill=(235, 235, 235))
    return sheet


def opts():
    a = sys.argv[1:]
    o, args = {}, []
    i = 0
    while i < len(a):
        if a[i].startswith("--"):
            o[a[i][2:]] = a[i + 1]
            i += 2
        else:
            args.append(a[i])
            i += 1
    return args, o


def old_segs(path, name):
    if path.endswith(".ufo"):
        import ufoLib2
        u = old_segs.cache.setdefault(path, ufoLib2.Font.open(path))
        if name not in u:
            return None
        pen = E.SegPen(u)
        u[name].draw(pen)
        return [c for c in pen.contours if c], u[name].width
    f = old_segs.cache.setdefault(path, TTFont(path))
    if name not in f.getGlyphSet():
        return None
    return E.segs(f, name=name)


old_segs.cache = {}


def main():
    args, o = opts()
    mode = args[0]
    if mode == "all":
        out = args[1]
        os.makedirs(out, exist_ok=True)
        f = TTFont(o["font"]) if "font" in o else E.face("area")
        per, cols = int(o.get("per", 80)), int(o.get("cols", 10))
        names = [n for n in f.getGlyphOrder() if n != ".notdef"]
        for s in range(0, len(names), per):
            cells = [cell(f, name=n, size=int(o.get("size", 150)), label=n) for n in names[s:s + per]]
            p = os.path.join(out, f"all-{s // per + 1:02d}.png")
            grid(cells, cols).save(p)
            print(p, names[s], "...", names[min(len(names), s + per) - 1])
    elif mode == "cmp":
        out, chars = args[1], args[2]
        faces = args[3:] or ["area", "georgia", "serrif", "baskerville"]
        size = int(o.get("size", 150))
        cells = []
        for key in faces:
            f = E.face(key)
            m = E.metrics(f)
            k = size / 1440 * 520 / m["xh"]                     # every face at one x-height
            for i, ch in enumerate(chars):
                if ord(ch) not in f.getBestCmap():
                    cells.append(Image.new("RGB", (size, size), (245, 245, 245)))
                    continue
                cells.append(cell(f, ch=ch, size=size, k=k, label=E.FACES[key][0] if i == 0 else None))
        grid(cells, len(chars)).save(out)
        print(out)
    elif mode == "names":
        out, names = args[1], args[2:]
        size = int(o.get("size", 220))
        f = TTFont(o["font"]) if "font" in o else E.face("area")
        cmap = f.getBestCmap()
        cells = []
        for n in names:
            g = cmap.get(ord(n), n) if len(n) == 1 else n
            old = old_segs(o["old"], g) if "old" in o else None
            cells.append(cell(f, name=g, size=size, label=g, old=old))
        grid(cells, int(o.get("cols", 6))).save(out)
        print(out)
    elif mode == "text":
        out, text = args[1], args[2]
        faces = args[3:] or ["area", "georgia", "serrif"]
        px = float(o.get("px", 64))
        rows = []
        for key in faces:
            label, path, var, _ = E.FACES[key]
            path = o.get("font", path) if key == "area" else path
            f = TTFont(path) if (key == "area" and "font" in o) else E.face(key)
            hf = hb.Font(hb.Face(hb.Blob.from_file_path(path)))
            if var:
                hf.set_variations(var)
            upm = f["head"].unitsPerEm
            m = E.metrics(f)
            k = px / 1000 * (520 / m["xh"] if "same" in o else 1)
            buf = hb.Buffer()
            buf.add_str(text)
            buf.guess_segment_properties()
            hb.shape(hf, buf, {"kern": True, "liga": True})
            order = f.getGlyphOrder()
            S = 3
            total = sum(p.x_advance for p in buf.glyph_positions) * 1000 / upm
            W, H = int(total * k + 40), int(px * 1.5)
            im = Image.new("RGB", (W * S, H * S), "white")
            x = 20 / k
            polys = []
            for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
                cs, _ = E.segs(f, name=order[info.codepoint])
                for poly in E.flatten(cs or [], 1.0):
                    polys.append([(p[0] + x + pos.x_offset * 1000 / upm, p[1] + pos.y_offset * 1000 / upm) for p in poly])
                x += pos.x_advance * 1000 / upm
            base = H * 0.72
            im.paste((20, 23, 28), mask=mask_of(polys, W * S, H * S, lambda p: (p[0] * k * S, (base - p[1] * k) * S)))
            im = im.resize((W, H), Image.LANCZOS)
            ImageDraw.Draw(im).text((2, 1), label if "label" not in o else o["label"], fill=(150, 150, 150), font=label_font(10))
            rows.append(im)
        sheet = Image.new("RGB", (max(r.width for r in rows), sum(r.height for r in rows)), "white")
        y = 0
        for r in rows:
            sheet.paste(r, (0, y))
            y += r.height
        sheet.save(out)
        print(out, sheet.size)


if __name__ == "__main__":
    main()
