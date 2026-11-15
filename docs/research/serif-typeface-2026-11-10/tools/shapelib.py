"""Shaped text drawn from outlines (HarfBuzz for layout, the glyphs' own contours for ink), for proofs that need
OpenType features on or off, a weight of the variable font, or a face read in memory. Reference faces are drawn,
never stored: keep the output in typefaces/area-serif/build/.

    rows = [("label", ttfont, "text", {"liga": False}, px), ...]
    shapelib.sheet(rows, "out.png")
"""
import io
import os
import sys

import uharfbuzz as hb
from PIL import Image, ImageChops, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402

_hb = {}


def hbfont(tt):
    if id(tt) not in _hb:
        buf = io.BytesIO()
        tt.save(buf)
        _hb[id(tt)] = hb.Font(hb.Face(buf.getvalue()))
    return _hb[id(tt)]


def layout(tt, text, feats=None):
    """[(glyph name, x, y, advance)] in font units, kerning on."""
    f = hbfont(tt)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    features = {"kern": True, "liga": True}
    features.update(feats or {})
    hb.shape(f, buf, features)
    order = tt.getGlyphOrder()
    out, x = [], 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        out.append((order[info.codepoint], x + pos.x_offset, pos.y_offset, pos.x_advance))
        x += pos.x_advance
    return out, x


def polys(tt, lay, step=1.0):
    """Flattened contours of a layout, at 1000 units per em."""
    k = 1000 / tt["head"].unitsPerEm
    out = []
    for name, x, y, _adv in lay:
        cs, _a = E.segs(tt, None, name)
        for poly in E.flatten(cs, step):
            out.append([(p[0] + x * k, p[1] + y * k) for p in poly])
    return out


def strip(tt, text, feats, px, ss=4, pad=0.35, norm_xh=None):
    """One line as a greyscale image, px = font size in pixels (the em), supersampled ss times."""
    lay, adv = layout(tt, text, feats)
    k = 1000 / tt["head"].unitsPerEm
    P = polys(tt, lay)
    s = px * ss / 1000
    if norm_xh:
        s *= norm_xh / E.metrics(tt)["xh"]
    W, H = int(adv * k * s + 2 * pad * px * ss), int(px * ss * 1.5)
    base = int(px * ss * 1.08)
    import numpy as np
    acc = np.zeros((H, W), dtype=np.int16)                     # non-zero winding: a variable font keeps its overlaps
    for poly in P:
        if len(poly) < 3:
            continue
        pts = [(pad * px * ss + x * s, base - y * s) for x, y in poly]
        area = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1]))
        layer = Image.new("1", (W, H), 0)
        ImageDraw.Draw(layer).polygon(pts, fill=1)
        acc += np.asarray(layer, dtype=np.int16) * (1 if area > 0 else -1)
    ink = Image.fromarray(((acc != 0) * 255).astype("uint8"), "L")
    return ImageChops.invert(ink.resize((max(1, W // ss), max(1, H // ss)), Image.LANCZOS))


def sheet(rows, out, width=None, scale=2, label_px=11):
    """rows: (label, ttfont, text, feats, px[, norm_xh]). Drawn at `scale` device pixels per px."""
    lab = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", label_px * scale)
    ims = []
    for row in rows:
        label, tt, text, feats, px = row[:5]
        ims.append((label, strip(tt, text, feats, px * scale, norm_xh=row[5] if len(row) > 5 else None)))
    W = width or max(im.width for _l, im in ims) + 24 * scale
    H = sum(im.height + (label_px + 8) * scale for _l, im in ims) + 12 * scale
    page = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(page)
    y = 6 * scale
    for label, im in ims:
        d.text((12 * scale, y), label, font=lab, fill=110)
        y += (label_px + 4) * scale
        page.paste(im, (4 * scale, y))
        y += im.height + 4 * scale
    page.save(out)
    return out
