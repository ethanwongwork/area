"""Area Serif 0.81 (owner, 15 November: "some letters start to lean or lose optical balance as weight rises"; the 9
"like the 5, the bottom-right part is too steep and makes it look slightly italicized"). Does every stroke thicken
evenly along the weight axis? Read on the variable font's instances (what a reader gets), numbers only.

    .venv/bin/python audit_lean.py [font.ttf] [--weights 300,350,...] [--glyphs a,b,...] [--ref font.ttf]

0.82 (owner round 8, axis): weights on the 0.82 axis ("old:300,..." on the 0.81 one; weightaxis.py). The default stops
are 0.81's 300 to 700 every 50 at their design places (300 ... 800); with --refs Area's 300 and 800 (the Light and
the Bold master, 0.81's 300 and 700) are compared with the references' 300 and 700, as before.

Each glyph is drawn into a one-unit raster at each weight. Per glyph and weight:

  lean     the ink's horizontal centre of area in its top half minus its bottom half, over the ink's height (a letter
           whose top stands right of its bottom leans right). Read as the drift from 400.
  centre   the ink's centre of area against the middle of the advance, as a share of the advance; drift from 400
           (a symmetric letter's ink should stay centred as it thickens).
  stress   for each closed counter: rays from the counter's centre of area every degree, the stroke read from where a
           ray leaves the counter to where it leaves the ink. The thin-to-thin axis is the line through the thinnest
           place above the centre and the thinnest below; its angle from upright (positive: top to the right), and
           its drift from 400.
  sides    for each closed counter: the thickest place left of the centre and right of it; each side's growth over
           400's. A round that thickens evenly grows both sides by one factor; the ratio of the two growths is read.

Flags (the audit's limits, each a just-noticeable step): lean drift over 0.010 of the height (a 7-unit shift of
the top against the bottom on a 700-unit capital), centre drift over 0.010 of the advance, stress drift over 3
degrees, side growth ratio off 1 by over 6% (twice the weight JND). Writes build/weight/audit-lean.txt.
"""
import io
import math
import os
import sys

import numpy as np
import skia
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
VF = os.path.join(HERE, "build", "AreaSerif[wght].ttf")
import weightaxis as W  # noqa: E402
WEIGHTS = W.parse(None, (300, 350, 400, 450, 500, 550, 600, 650, 700))
LO, HI = W._r(W.place(300)), W._r(W.place(700))     # Area's places compared with the references' 300 and 700
REF_AT = {LO: 300, HI: 700}
LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
ALTS = ("a.ss03", "g.ss02")
SYMMETRIC = set("ovwxHIOAVWXYTUMNo08iltlz") | {"zero"}
LIM_LEAN, LIM_CENTRE, LIM_STRESS, LIM_SIDES = 0.010, 0.010, 3.0, 0.06
PAD = 300


def instance(path, w):
    tt = TTFont(path)
    if "fvar" not in tt:
        return tt
    buf = io.BytesIO()
    instantiateVariableFont(tt, {"wght": W.user(tt, w)}).save(buf)
    buf.seek(0)
    return TTFont(buf)


def gname(tt, ch):
    cm = tt.getBestCmap()
    if len(ch) == 1:
        return cm.get(ord(ch))
    return ch if ch in tt.getGlyphOrder() else None


def raster(tt, name):
    """(mask[y, x] bool with y up from -PAD, advance)."""
    gs = tt.getGlyphSet()
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    k = 1000 / tt["head"].unitsPerEm                       # every face read at 1000 units (Georgia Pro has 2048)
    rec.value = [(op, tuple((x * k, y * k) for x, y in a)) for op, a in rec.value]
    p = skia.Path()
    for op, a in rec.value:
        if op == "moveTo":
            p.moveTo(*a[0])
        elif op == "lineTo":
            p.lineTo(*a[0])
        elif op == "qCurveTo":
            pts = list(a)
            offs = pts[:-1]
            for i, q in enumerate(offs):
                e = pts[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                p.quadTo(q[0], q[1], e[0], e[1])
        elif op == "curveTo":
            p.cubicTo(*a[0], *a[1], *a[2])
        elif op in ("closePath", "endPath"):
            p.close()
    p.setFillType(skia.PathFillType.kWinding)
    W, H = 1600, 1400
    surf = skia.Surface(W, H)
    c = surf.getCanvas()
    c.clear(skia.ColorBLACK)
    c.translate(PAD, H - PAD)
    c.scale(1, -1)
    c.drawPath(p, skia.Paint(Color=skia.ColorWHITE, AntiAlias=False))
    img = surf.makeImageSnapshot().toarray()[:, :, 0] > 127
    return img[::-1, :], gs[name].width * k      # row 0 is y = -PAD


def counters(mask):
    """Closed whites (not reaching the border), as boolean masks, the larger ones first."""
    from scipy import ndimage
    lab, n = ndimage.label(~mask)
    out = []
    for k in range(1, n + 1):
        m = lab == k
        ys, xs = np.nonzero(m)
        if ys.min() == 0 or xs.min() == 0 or ys.max() == mask.shape[0] - 1 or xs.max() == mask.shape[1] - 1:
            continue
        if m.sum() < 400:
            continue
        out.append(m)
    return sorted(out, key=lambda m: -m.sum())


def ray_profile(mask, hole):
    """Thickness along rays from the hole's centre every degree: [(angle deg, thickness, (x, y) mid)]."""
    ys, xs = np.nonzero(hole)
    cy, cx = ys.mean(), xs.mean()
    out = []
    for a in range(360):
        r = math.radians(a)
        dx, dy = math.cos(r), math.sin(r)
        t, state, t0 = 0.0, 0, None
        while t < 900:
            x, y = int(round(cx + dx * t)), int(round(cy + dy * t))
            if not (0 <= x < mask.shape[1] and 0 <= y < mask.shape[0]):
                break
            ink = mask[y, x]
            if state == 0 and ink:
                state, t0 = 1, t
            elif state == 1 and not ink:
                out.append((a, t - t0, (cx + dx * (t0 + t) / 2, cy + dy * (t0 + t) / 2)))
                break
            t += 0.5
    return (cx, cy), out


def read(mask, adv):
    ys, xs = np.nonzero(mask)
    y0, y1 = ys.min(), ys.max()
    mid = (y0 + y1) / 2
    top, bot = xs[ys >= mid], xs[ys < mid]
    lean = (top.mean() - bot.mean()) / (y1 - y0)
    centre = (xs.mean() - PAD - adv / 2) / adv
    rounds = []
    for hole in counters(mask)[:2]:
        (cx, cy), prof = ray_profile(mask, hole)
        if len(prof) < 300:
            continue
        up = [p for p in prof if 20 <= p[0] <= 160]
        dn = [p for p in prof if 200 <= p[0] <= 340]
        lf = [p for p in prof if 100 <= p[0] <= 260]
        rt = [p for p in prof if p[0] <= 80 or p[0] >= 280]
        if not (up and dn and lf and rt):
            continue
        tu, td = min(up, key=lambda p: p[1]), min(dn, key=lambda p: p[1])
        ang = math.degrees(math.atan2(tu[2][0] - td[2][0], tu[2][1] - td[2][1]))
        rounds.append(dict(stress=ang, left=max(p[1] for p in lf), right=max(p[1] for p in rt),
                           thin_top=tu[1], thin_bottom=td[1]))
    return dict(lean=lean, centre=centre, rounds=rounds)


GEORGIA = {w: os.path.expanduser(f"~/Library/Fonts/GeorgiaPro-{n}.ttf") for w, n in ((300, "Light"), (400, "Regular"), (700, "Bold"))}
SOURCE = os.path.join(HERE, "build", "eval-fonts", "SourceSerif4.ttf")


def readings(insts, glyphs):
    """{glyph: {weight: read}} for {weight: TTFont}."""
    out = {}
    w0 = next(iter(insts))
    for ch in glyphs:
        name = gname(insts[w0], ch)
        if not name or any(gname(t, ch) is None for t in insts.values()):
            continue
        out[ch] = {w: read(*raster(t, name)) for w, t in insts.items()}
    return out


def drift(rd, ch, w, key, k=None):
    """A measure's change from 400 at weight w (stress and sides per counter k)."""
    r, b = rd[ch][w], rd[ch][400]
    if k is None:
        return r[key] - b[key]
    if len(r["rounds"]) <= k or len(b["rounds"]) <= k:
        return None
    if key == "stress":
        return r["rounds"][k]["stress"] - b["rounds"][k]["stress"]
    gl = r["rounds"][k]["left"] / b["rounds"][k]["left"]
    gr = r["rounds"][k]["right"] / b["rounds"][k]["right"]
    return gl / gr - 1


def references(glyphs):
    """The references' drifts at 300 and 700 (Georgia Pro's Light, Regular, Bold; Source Serif 4 at 300, 400, 700):
    {(glyph, key, k, weight): (least, most)}."""
    faces = []
    if all(os.path.exists(p) for p in GEORGIA.values()):
        faces.append({w: TTFont(p) for w, p in GEORGIA.items()})
    if os.path.exists(SOURCE):
        faces.append({w: instance(SOURCE, w) for w in (300, 400, 700)})
    span = {}
    for F in faces:
        rd = readings(F, glyphs)
        for ch in rd:
            for w in (300, 700):
                for key, k in (("lean", None), ("centre", None), ("stress", 0), ("sides", 0), ("stress", 1), ("sides", 1)):
                    d = drift(rd, ch, w, key, k)
                    if d is None:
                        continue
                    lo, hi = span.get((ch, key, k, w), (d, d))
                    span[(ch, key, k, w)] = (min(lo, d), max(hi, d))
    return span


def main(argv):
    path = VF
    weights, glyphs, ref = WEIGHTS, list(LETTERS) + list(ALTS), None
    args = list(argv)
    while args:
        a = args.pop(0)
        if a == "--weights":
            weights = W.parse(args.pop(0))
        elif a == "--glyphs":
            glyphs = args.pop(0).split(",")
        elif a == "--refs":
            ref = True
        elif a.endswith(".ttf"):
            path = a
    insts = {w: instance(path, w) for w in weights}
    if ref:
        weights = tuple(sorted(set(weights) | {LO, 400, HI}))
        insts = {w: instance(path, w) for w in weights}
        ref = references(glyphs)
    rows, flags = [], []
    for ch in glyphs:
        name = gname(insts[weights[0]], ch)
        if not name:
            continue
        rd = {w: read(*raster(insts[w], name)) for w in weights}
        base = rd.get(400) or rd[weights[0]]
        if ref is not None and len(rd[400]["rounds"]) != len(rd[HI]["rounds"]):
            pass
        line = [f"{ch:7s}"]
        for w in weights:
            r = rd[w]
            st = " ".join(f"{q['stress']:+5.1f}" for q in r["rounds"])
            line.append(f"{W.short(w)}: lean {r['lean']:+.3f} ctr {r['centre']:+.3f}" + (f" stress {st}" if st else ""))
        rows.append("  ".join(line))
        for w in weights:
            r = rd[w]
            if ref is not None and w in REF_AT:
                RD = {ch: rd}
                for key, k, lim in (("lean", None, LIM_LEAN), ("centre", None, LIM_CENTRE), ("stress", 0, LIM_STRESS),
                                    ("sides", 0, LIM_SIDES), ("stress", 1, LIM_STRESS), ("sides", 1, LIM_SIDES)):
                    d = drift(RD, ch, w, key, k)
                    span = ref.get((ch, key, k, REF_AT[w]))
                    if d is None or span is None:
                        continue
                    off = d - span[1] if d > span[1] else (d - span[0] if d < span[0] else 0.0)
                    if abs(off) > lim:
                        flags.append((ch, w, f"{key}{'' if k is None else k} vs refs", f"{d:+.3f} (refs {span[0]:+.3f} to {span[1]:+.3f})"))
                continue
            if ref is not None:
                continue
            if abs(r["lean"] - base["lean"]) > LIM_LEAN:
                flags.append((ch, w, "lean", round(r["lean"] - base["lean"], 4)))
            if ch in SYMMETRIC and abs(r["centre"] - base["centre"]) > LIM_CENTRE:
                flags.append((ch, w, "centre", round(r["centre"] - base["centre"], 4)))
            for k, (q, q0) in enumerate(zip(r["rounds"], base["rounds"])):
                if abs(q["stress"] - q0["stress"]) > LIM_STRESS:
                    flags.append((ch, w, f"stress{k}", round(q["stress"] - q0["stress"], 1)))
                gl, gr = q["left"] / q0["left"], q["right"] / q0["right"]
                if abs(gl / gr - 1) > LIM_SIDES:
                    flags.append((ch, w, f"sides{k}", f"left x{gl:.3f} right x{gr:.3f}"))
    os.makedirs(os.path.join(HERE, "build", "weight"), exist_ok=True)
    out = os.path.join(HERE, "build", "weight", "audit-lean.txt")
    with open(out, "w") as f:
        f.write("\n".join(rows) + "\n\nflags\n" + "\n".join(map(str, flags)) + "\n")
    by = {}
    for ch, w, kind, val in flags:
        by.setdefault((ch, kind), []).append((w, val))
    print(f"lean audit, {os.path.basename(path)} at {', '.join(map(W.short, weights))} ({W.AXIS_NOTE}"
          + (f"; Area {W.short(LO)} and {W.short(HI)} against the references' 300 and 700" if ref is not None else "")
          + f"): {len(glyphs)} glyphs, {len(by)} flags")
    for (ch, kind), v in sorted(by.items()):
        print(f"  {ch} {kind}: " + "; ".join(f"{W.short(w)} {val}" for w, val in v))
    print("written", os.path.relpath(out, HERE))
    return 1 if by else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
