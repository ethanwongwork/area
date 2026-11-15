"""Area Serif's weight axis, drawn from the masters (0.81). Instances are the masters' own points blended as the
variable font blends them (bold.axis_map, the mid layer where a glyph has one), so a sheet shows what a reader
gets at any weight without building a font. Ink is filled by non-zero winding: the variable font keeps overlaps.

    import axislib as A
    m = A.Masters("build")                      # build/AreaSerif-{Regular,Light,Bold}.ufo
    A.glyph_image(m.at("x", 550), 0.25)         # a PIL image of x at weight 550, 0.25 px a unit
"""
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "..", "typefaces", "area-serif"))
sys.path.insert(0, SERIF)
import bold as B  # noqa: E402


def contours_of(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def decomposed(font, name, t=(1, 0, 0, 1, 0, 0)):
    """A glyph's contours with its components drawn in, through their transforms."""
    g = font[name]
    a, b, c, d, e, f = t
    out = [[(a * x + c * y + e, b * x + d * y + f, ty, s) for x, y, ty, s in P] for P in contours_of(g)]
    for comp in g.components:
        ca, cb, cc, cd, ce, cf = comp.transformation
        tt = (a * ca + c * cb, b * ca + d * cb, a * cc + c * cd, b * cc + d * cd, a * ce + c * cf + e, b * ce + d * cf + f)
        out += decomposed(font, comp.baseGlyph, tt)
    return out


class Masters:
    def __init__(self, build="build"):
        import ufoLib2
        self.R = ufoLib2.Font.open(os.path.join(build, "AreaSerif-Regular.ufo"))
        self.Bd = ufoLib2.Font.open(os.path.join(build, "AreaSerif-Bold.ufo"))
        lp = os.path.join(build, "AreaSerif-Light.ufo")
        self.L = ufoLib2.Font.open(lp) if os.path.exists(lp) else None
        self.mid = self.Bd.layers["mid"] if "mid" in self.Bd.layers else {}
        self.stem = B.STEM
        m = dict(B.axis_map(self.stem, (300, 325, 350, 375) + tuple(range(400, 701, 25))))
        self.stem_at = m
        self.tm = (dict(B.axis_map(self.stem))[B.MID_WEIGHT] - B.REG_STEM) / (self.stem - B.REG_STEM)

    def t(self, w):
        st = self.stem_at[w] if w in self.stem_at else B.axis_map(self.stem, (w,))[0][1]
        if w >= 400:
            return (st - B.REG_STEM) / (self.stem - B.REG_STEM)
        return -(B.REG_STEM - st) / (B.REG_STEM - B.LIGHT_STEM)

    def at(self, name, w, decompose=True):
        """Contours of glyph `name` at weight w (300 to 700)."""
        def own(font):
            return decomposed(font, name) if decompose else contours_of(font[name])
        if "overlap" in self.R.layers and name in self.R.layers["overlap"]:     # 0.81: as the variable font has it
            rc = contours_of(self.R.layers["overlap"][name])
        else:
            rc = own(self.R)
        t = self.t(w)
        if t == 0:
            return rc
        if t < 0:
            return lerp(rc, own(self.L), -t)
        bc = own(self.Bd)
        if name in self.mid and not self.R[name].components:
            mc = contours_of(self.mid[name])
            return lerp(rc, mc, t / self.tm) if t <= self.tm else lerp(mc, bc, (t - self.tm) / (1 - self.tm))
        return lerp(rc, bc, t)

    def width(self, name, w):
        t = self.t(w)
        r = self.R[name].width
        o = (self.L if t < 0 else self.Bd)[name].width
        return r + (o - r) * abs(t)


def lerp(A, C, u):
    return [[(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2], p[3]) for p, q in zip(P, Q)] for P, Q in zip(A, C)]


def flat(contours, n=24):
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    out = []
    for P in contours:
        pts = []
        for i, mid, j in B.segments([_Q(q) for q in P]):
            if len(mid) == 2:
                c = [P[i][:2], P[mid[0]][:2], P[mid[1]][:2], P[j][:2]]
                pts += [B._bez(c, k / n) for k in range(n)]
            else:
                pts.append(P[i][:2])
        if len(pts) > 2:
            out.append(pts)
    return out


def ink(contours, s, box, ss=3, color=(0, 0, 0), bg=(255, 255, 255)):
    """contours drawn at s px a unit inside box (x0, y0, x1, y1 in units), non-zero winding, supersampled."""
    import numpy as np
    x0, y0, x1, y1 = box
    W, H = max(1, int((x1 - x0) * s * ss)), max(1, int((y1 - y0) * s * ss))
    acc = np.zeros((H, W), dtype=np.int16)
    for poly in flat(contours):
        pts = [((x - x0) * s * ss, (y1 - y) * s * ss) for x, y in poly]
        area = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1]))
        layer = Image.new("1", (W, H), 0)
        ImageDraw.Draw(layer).polygon(pts, fill=1)
        acc += np.asarray(layer, dtype=np.int16) * (1 if area > 0 else -1)
    m = (acc != 0).astype("float32")
    im = Image.fromarray((m * 255).astype("uint8"), "L").resize((max(1, W // ss), max(1, H // ss)), Image.LANCZOS)
    a = np.asarray(im, dtype="float32")[..., None] / 255
    rgb = np.array(bg, dtype="float32") * (1 - a) + np.array(color, dtype="float32") * a
    return Image.fromarray(rgb.astype("uint8"), "RGB")


def outline(im, contours, s, box, color=(220, 40, 40), nodes=False, width=1):
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = box
    tr = lambda p: ((p[0] - x0) * s, (y1 - p[1]) * s)   # noqa: E731
    for poly in flat(contours):
        d.line([tr(p) for p in poly] + [tr(poly[0])], fill=color, width=width)
    if nodes:
        for P in contours:
            for q in P:
                x, y = tr(q)
                r = 2 if q[2] else 1
                d.rectangle([x - r, y - r, x + r, y + r], outline=color if q[2] else (120, 120, 120))
    return im


def box_of(*sets, pad=30):
    xs = [q[0] for cs in sets for P in cs for q in P]
    ys = [q[1] for cs in sets for P in cs for q in P]
    return (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad)


_FONT = None


def label_font(size=13):
    global _FONT
    for p in ("/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def grid(cells, cols, label_h=16, gap=8, bg=(255, 255, 255)):
    """cells: [(label, image)] laid out in rows of `cols`."""
    if not cells:
        return Image.new("RGB", (10, 10), bg)
    f = label_font(12)
    probe = ImageDraw.Draw(Image.new("RGB", (4, 4)))
    cw = max(max(im.width for _, im in cells), max(int(probe.textlength(lab, font=f)) + 6 for lab, _ in cells))
    ch = max(im.height for _, im in cells) + label_h
    rows = math.ceil(len(cells) / cols)
    out = Image.new("RGB", (cols * (cw + gap) + gap, rows * (ch + gap) + gap), bg)
    d = ImageDraw.Draw(out)
    for k, (lab, im) in enumerate(cells):
        r, c = divmod(k, cols)
        x, y = gap + c * (cw + gap), gap + r * (ch + gap)
        d.text((x, y), lab, fill=(60, 60, 60), font=f)
        out.paste(im, (x, y + label_h))
    return out


def stack(images, gap=10, bg=(255, 255, 255), titles=None, title_h=22):
    titles = titles or [None] * len(images)
    W = max(im.width for im in images) + 2 * gap
    H = sum(im.height + gap + (title_h if t else 0) for im, t in zip(images, titles)) + gap
    out = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(out)
    f = label_font(16)
    y = gap
    for im, t in zip(images, titles):
        if t:
            d.text((gap, y), t, fill=(0, 0, 0), font=f)
            y += title_h
        out.paste(im, (gap, y))
        y += im.height + gap
    return out
