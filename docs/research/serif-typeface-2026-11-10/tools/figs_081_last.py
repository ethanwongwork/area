"""Build 0.81, last weight-axis round: figures for its rules and readings (Area Serif only; nothing licensed is drawn).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_last.py \
        build/tip081 build/figures/081

BEFORE (build/tip081) holds the close round's build (tip 7108b456): its three UFO masters and its variable TTF; the
last round's is read from build/. Writes:
  14-thin-reading.png   audit_axis's thinnest cut at 400 (blue) and at the failing weight (red): the close round's
                        reading (the Regular's thinnest anywhere) over this round's (the Regular at the same place)
  14-c-barb.png         C's lower barb at 400, 500, 600, 700, before over after (the taper rule's guard): the ray at
                        audit_rays' place (546, 106)
  14-hook-above.png     both hook-above marks at 300, 400, 552, 700, before over after (a curl and a stem), outlines
                        with nodes; then filled, and composites that carry them
  14-at.png             @ at 400, 550, 700: before over after (the fillet's corner stays on its edge), the a's top
"""
import io
import math
import os
import sys

import numpy as np
import ufoLib2
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.getcwd())
import audit_axis as AX                                        # noqa: E402
import audit_rays as AR                                        # noqa: E402
import bold as B                                               # noqa: E402
import overlap as OVERLAP                                      # noqa: E402

LAB = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 15)
SMALL = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)


class Masters:
    def __init__(self, d, curls=True):
        self.reg = OVERLAP.vf_source(ufoLib2.Font.open(f"{d}/AreaSerif-Regular.ufo"))
        if not curls:                                          # a build before the curl and stem: its merged outline
            plain = ufoLib2.Font.open(f"{d}/AreaSerif-Regular.ufo")
            for n in OVERLAP.CURLS:
                if n in plain:
                    self.reg[n].clearContours()
                    for c in plain[n].contours:
                        self.reg[n].contours.append(c)
        self.bold = ufoLib2.Font.open(f"{d}/AreaSerif-Bold.ufo")
        self.light = ufoLib2.Font.open(f"{d}/AreaSerif-Light.ufo")
        self.mids = self.bold.layers["mid"] if "mid" in self.bold.layers else {}
        self.vf = f"{d}/AreaSerif[wght].ttf"
        self._i = {}

    def t_of(self, w):
        st = dict(B.axis_map(B.STEM, [w]))[w]
        return (st - B.REG_STEM) / (B.STEM - B.REG_STEM) if w >= 400 else (B.REG_STEM - st) / (B.REG_STEM - B.LIGHT_STEM)

    def at(self, name, w):
        rc = AX.contours_of(self.reg[name])
        if w == 400:
            return rc
        t = self.t_of(w)
        if w < 400:
            return AX.lerp(rc, AX.contours_of(self.light[name]), t)
        bc = AX.contours_of(self.bold[name])
        if name in self.mids:
            tm = (dict(B.axis_map(B.STEM))[B.MID_WEIGHT] - B.REG_STEM) / (B.STEM - B.REG_STEM)
            mc = AX.contours_of(self.mids[name])
            return AX.lerp(rc, mc, t / tm) if t <= tm else AX.lerp(mc, bc, (t - tm) / (1 - tm))
        return AX.lerp(rc, bc, t)

    def inst(self, w):
        if w not in self._i:
            b = io.BytesIO()
            instantiateVariableFont(TTFont(self.vf), {"wght": w}).save(b)
            b.seek(0)
            self._i[w] = TTFont(b)
        return self._i[w]


def frame(box, W, H, top=26):
    x0, y0, x1, y1 = box
    S = min((W - 20) / (x1 - x0), (H - top - 10) / (y1 - y0))
    return lambda p: (10 + (p[0] - x0) * S, H - 10 - (p[1] - y0) * S), S


def outline(d, cs, T, col, w=1, n=16, nodes=False):
    for P in AX.flat(cs, n):
        d.line([T(q) for q in P] + [T(P[0])], fill=col, width=w)
    if nodes:
        for P in cs:
            for q in P:
                x, y = T(q[:2])
                r = 2.5 if q[2] else 1.5
                (d.rectangle if q[2] else d.ellipse)([x - r, y - r, x + r, y + r], outline=col)


def filled(cs, box, W, H, top=26):
    """The contours filled non-zero (overlaps as one ink), on white."""
    import skia
    import white as WHITE
    T, S = frame(box, W, H, top)
    surf = skia.Surface(W, H)
    c = surf.getCanvas()
    c.clear(skia.ColorWHITE)
    c.translate(10 - box[0] * S, H - 10 + box[1] * S)
    c.scale(S, -S)
    c.drawPath(WHITE.path_of(cs), skia.Paint(Color=skia.ColorBLACK, AntiAlias=True))
    return Image.fromarray(surf.makeImageSnapshot().toarray()[:, :, :3][:, :, ::-1].copy())


def cut_line(polys, place):
    A, Bn = AX._edges(polys)
    _, (k0, u0), (k1, u1) = place
    return A[k0] + u0 * (Bn[k0] - A[k0]), A[k1] + u1 * (Bn[k1] - A[k1])


def thin_reading(before, after, out):
    rows = [("C", 675, (540, 140, 700, 300)), ("Q", 425, (690, -120, 820, 10)), ("s", 600, (10, 70, 150, 210)),
            ("ogonekcomb.case", 600, (100, -40, 230, 60)), ("one.ss01", 700, (20, 540, 220, 700)), ("yhook", 300, (180, -120, 360, 60))]
    W, H = 330, 300
    im = Image.new("RGB", (W * 3, H * len(rows) + 30), "white")
    d0 = ImageDraw.Draw(im)
    d0.text((10, 8), "blue: the cut at 400; red: at the failing weight.  left: the close round (thinnest anywhere, "
            "scan-line corners); middle: this round (the same place on the Regular); right: the instance's outline",
            fill="black", font=SMALL)
    for r, (name, w, box) in enumerate(rows):
        for c, (M, label) in enumerate(((before, "close round"), (after, "this round"))):
            rc, ic = M.at(name, 400), M.at(name, w)
            rp, ip = AX.flat(rc), AX.flat(ic)
            T, _ = frame(box, W, H)
            cellim = Image.new("RGB", (W, H), "white")
            d = ImageDraw.Draw(cellim)
            outline(d, rc, T, (170, 170, 220))
            outline(d, ic, T, (0, 0, 0))
            pa, pb = [], []
            if c == 0:
                bt = AX.thinnest(rp, points=AX.points_of(rc), at=pa)
                th = AX.thinnest(ip, points=AX.points_of(ic), at=pb)
                txt = f"{name} {w}: {th:.1f} against {bt:.1f} (thinnest anywhere at 400)"
                if pa:
                    a, b = cut_line(rp, pa[0])
                    d.line([T(a), T(b)], fill=(0, 0, 255), width=3)
            else:
                th = AX.thinnest(ip, points=AX.points_of(ic), at=pb)
                ref = AX.place_reading(rp, pb[0]) if pb else None
                txt = f"{name} {w}: {th:.1f} against {ref:.1f} (400 at the same place)" if ref else f"{name} {w}: {th:.1f}"
                if pb:
                    a, b = cut_line(rp, pb[0])
                    d.line([T(a), T(b)], fill=(0, 0, 255), width=3)
            if pb:
                a, b = cut_line(ip, pb[0])
                d.line([T(a), T(b)], fill=(230, 0, 0), width=3)
            d.text((8, 6), f"{label}: {txt}", fill="black", font=SMALL)
            im.paste(cellim, (c * W, 30 + r * H))
        im.paste(filled(after.at(name, w), box, W, H), (2 * W, 30 + r * H))
    im.save(out)


def vf_polys(M, w, name):
    return AR.polylines(M.inst(w).getGlyphSet(), name)


def c_barb(before, after, out, place=(546, 106)):
    W, H = 300, 300
    box = (430, -20, 720, 270)
    ws = (400, 500, 600, 700)
    im = Image.new("RGB", (W * len(ws), H * 2), "white")
    for r, (M, label) in enumerate(((before, "before"), (after, "after"))):
        k = None
        for c, w in enumerate(ws):
            ps = vf_polys(M, w, "C")
            allp = np.vstack(ps)
            if k is None:
                k = int(np.argmin(np.hypot(*(allp - np.array(place)).T)))
            r_, _ = AR.rays(ps)
            cut = np.cumsum([0] + [len(P) for P in ps])
            ci = int(np.searchsorted(cut, k, side="right") - 1)
            P = ps[ci]
            i = k - cut[ci]
            tng = P[(i + 1) % len(P)] - P[i - 1]
            tng = tng / np.hypot(*tng)
            n = np.array([-tng[1], tng[0]])
            if AR.winding((allp[k] + 0.6 * n)[None], ps)[0] == 0:
                n = -n
            T, _ = frame(box, W, H)
            cellim = Image.new("RGB", (W, H), "white")
            d = ImageDraw.Draw(cellim)
            for Q in ps:
                d.line([T(q) for q in Q] + [T(Q[0])], fill=(0, 0, 0), width=1)
            L = r_[k]
            if not np.isnan(L):
                d.line([T(allp[k]), T(allp[k] + L * n)], fill=(230, 0, 0), width=3)
            d.text((8, 6), f"C {label} {w}: ray {L:.1f}", fill="black", font=LAB)
            im.paste(cellim, (c * W, r * H))
    im.save(out)


def hook_above(before, after, out):
    ws = (300, 400, 552, 700)
    W, H = 260, 260
    names = ("hookabovecomb.case", "hookabovecomb")
    rows = []
    for name in names:
        rc = AX.contours_of(after.reg[name])
        xs, ys = [q[0] for P in rc for q in P], [q[1] for P in rc for q in P]
        box = (min(xs) - 30, min(ys) - 30, max(xs) + 30, max(ys) + 30)
        for M, label in ((before, "before"), (after, "after")):
            row = []
            for w in ws:
                cs = M.at(name, w)
                T, _ = frame(box, W, H)
                cellim = Image.new("RGB", (W, H), "white")
                d = ImageDraw.Draw(cellim)
                outline(d, cs, T, (0, 0, 0), nodes=True)
                d.text((8, 6), f"{name} {label} {w}", fill="black", font=SMALL)
                row.append(cellim)
            rows.append(row)
        row = []
        for w in ws:
            cellim = filled(after.at(name, w), box, W, H)
            ImageDraw.Draw(cellim).text((8, 6), f"{name} after {w}, filled", fill="black", font=SMALL)
            row.append(cellim)
        rows.append(row)
    # composites that carry them, from the variable font's instances
    comps = ("uni1EA2", "uni1EA9", "uni1EC8", "uni1EDF")
    row = []
    for w in ws:
        gs = after.inst(w).getGlyphSet()
        cellim = Image.new("RGB", (W, H), "white")
        d = ImageDraw.Draw(cellim)
        x = 8
        for nm in comps:
            if nm not in gs:
                continue
            rec = DecomposingRecordingPen(gs)
            gs[nm].draw(rec)
            cs = []
            for P in AR.polylines(gs, nm):
                cs.append([(float(a), float(b), "line", False) for a, b in P])
            if not cs:
                continue
            s_ = 0.055
            for P in cs:
                pts = [(x + q[0] * s_, H - 40 - q[1] * s_) for q in P]
                d.polygon(pts, outline=(0, 0, 0))
            x += gs[nm].width * s_ + 4
        d.text((8, 6), f"composites at {w} (outlines)", fill="black", font=SMALL)
        row.append(cellim)
    rows.append(row)
    im = Image.new("RGB", (W * len(ws), H * len(rows)), "white")
    for r, row in enumerate(rows):
        for c, cellim in enumerate(row):
            im.paste(cellim, (c * W, r * H))
    im.save(out)


def at_crotch(before, after, out):
    ws = (400, 550, 700)
    box = (440, 280, 800, 560)
    W, H = 360, 300
    im = Image.new("RGB", (W * len(ws), H * 2), "white")
    for r, (M, label) in enumerate(((before, "before"), (after, "after"))):
        for c, w in enumerate(ws):
            cs = M.at("at", w)
            T, _ = frame(box, W, H)
            cellim = Image.new("RGB", (W, H), "white")
            d = ImageDraw.Draw(cellim)
            outline(d, cs, T, (0, 0, 0), nodes=True)
            d.text((8, 6), f"@ {label} {w}", fill="black", font=LAB)
            im.paste(cellim, (c * W, r * H))
    im.save(out)


def main():
    before, after = Masters(sys.argv[1], curls=False), Masters("build")
    od = sys.argv[2]
    os.makedirs(od, exist_ok=True)
    thin_reading(before, after, os.path.join(od, "14-thin-reading.png"))
    c_barb(before, after, os.path.join(od, "14-c-barb.png"))
    hook_above(before, after, os.path.join(od, "14-hook-above.png"))
    at_crotch(before, after, os.path.join(od, "14-at.png"))
    print("figures in", od)


if __name__ == "__main__":
    main()
