"""The weight exponent k of signs and small figures (0.81): part(w) / part(400) = (stem(w) / stem(400)) ** k, measured
on Georgia Pro (Light, Regular, Bold statics) and the open variable serifs at 300, 400 and 700. Numbers only; renders
nothing. Single level scan lines at a share of each glyph's height (as the weight research's addendum measured):

  n stem        n at 0.45 of the x-height, first span
  asterisk arm  the narrowest span across the asterisk at 0.22 of its height (its lower arms)
  dagger stem   the dagger at 0.25 of its height
  T of (TM)     the trademark at 0.30 of its height, first span (the T's stem)
  superior one  onesuperior at half its height, the widest span

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \\
        ../../docs/research/serif-typeface-2026-11-10/tools/weight/sign_k.py
"""
import io
import math
import os
import sys

from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

USER = os.path.expanduser("~/Library/Fonts/")
EVAL = os.environ.get("EVAL_FONTS", "build/eval-fonts")


def polys(font, ch):
    gs = font.getGlyphSet()
    name = font.getBestCmap().get(ord(ch))
    if name is None:
        return None
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    out, cur, k = [], [], 1000 / font["head"].unitsPerEm
    for op, args in rec.value:
        if op == "moveTo":
            cur = [args[0]]
        elif op == "lineTo":
            cur.append(args[0])
        elif op in ("curveTo", "qCurveTo"):
            a = cur[-1]
            pts = list(args)
            if op == "qCurveTo":
                segs, offs = [], pts[:-1]
                for i, q in enumerate(offs):
                    e = pts[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                    segs.append((a, q, e))
                    a = e
                for s0, q, e in segs:
                    for t in [j / 12 for j in range(1, 13)]:
                        u = 1 - t
                        cur.append((u * u * s0[0] + 2 * u * t * q[0] + t * t * e[0], u * u * s0[1] + 2 * u * t * q[1] + t * t * e[1]))
            else:
                b, c, d = pts
                for t in [j / 12 for j in range(1, 13)]:
                    u = 1 - t
                    cur.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                                u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
        elif op in ("closePath", "endPath"):
            if len(cur) > 2:
                out.append([(x * k, y * k) for x, y in cur])
            cur = []
    return out


def spans(ps, y):
    hits = []
    for c in ps:
        for i in range(len(c)):
            a, b = c[i], c[(i + 1) % len(c)]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                hits.append((a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]), 1 if b[1] > a[1] else -1))
    hits.sort()
    out, w, st = [], 0, None
    for x, d in hits:
        if w == 0:
            st = x
        w += d
        if w == 0:
            out.append((st, x))
    return out


def at(ps, share):
    ys = [p[1] for c in ps for p in c]
    return spans(ps, min(ys) + share * (max(ys) - min(ys)))


def measure(font):
    m = {}
    n = polys(font, "n")
    xh = max(p[1] for c in n for p in c) - 10
    m["stem"] = (lambda s: s[0][1] - s[0][0])(spans(n, 0.45 * xh))
    for key, ch, share, pick in (("asterisk arm", "*", 0.22, min), ("dagger stem", "†", 0.25, min),
                                 ("trademark T", "™", 0.30, None), ("superior one", "¹", 0.5, max)):
        ps = polys(font, ch)
        if not ps:
            continue
        sp = at(ps, share)
        if not sp:
            continue
        ws = [b - a for a, b in sp]
        m[key] = ws[0] if pick is None else pick(ws)
    return m


def faces():
    out = {}
    if os.path.exists(USER + "GeorgiaPro-Regular.ttf"):
        out["Georgia Pro"] = {w: TTFont(USER + f"GeorgiaPro-{s}.ttf") for w, s in ((300, "Light"), (400, "Regular"), (700, "Bold"))}
    vfs = [(USER + "SerrifCollectionVF-TRIAL.ttf", {"wdth": 100, "slnt": 0}), (USER + "CrimsonPro-VariableFont_wght.ttf", {})]
    vfs += [(os.path.join(EVAL, f), {}) for f in ("Literata.ttf", "SourceSerif4.ttf", "Newsreader.ttf", "Merriweather.ttf", "Lora.ttf")]
    for path, extra in vfs:
        if not os.path.exists(path):
            continue
        f = TTFont(path)
        axes = {a.axisTag: a for a in f["fvar"].axes}
        pins = dict(extra)
        for tag, a in axes.items():
            if tag not in ("wght",) and tag not in pins:
                pins[tag] = a.defaultValue
        lo = axes["wght"].minValue
        ws = [w for w in (300, 400, 700) if lo <= w <= axes["wght"].maxValue]
        inst = {}
        for w in ws:
            buf = io.BytesIO()
            instantiateVariableFont(TTFont(path), dict(pins, wght=w)).save(buf)
            buf.seek(0)
            inst[w] = TTFont(buf)
        out[os.path.basename(path).split("-")[0].split(".")[0]] = inst
    return out


def main():
    rows = {}
    for name, ws in faces().items():
        ms = {w: measure(f) for w, f in ws.items()}
        r = {}
        for part in ("asterisk arm", "dagger stem", "trademark T", "superior one"):
            for side, w in (("light", 300), ("bold", 700)):
                if w in ms and part in ms[w] and part in ms[400] and ms[400][part] > 0:
                    q = ms[w]["stem"] / ms[400]["stem"]
                    if abs(math.log(q)) > 1e-3:
                        r[(part, side)] = math.log(ms[w][part] / ms[400][part]) / math.log(q)
        rows[name] = r
        print(name, {k: round(v, 2) for k, v in r.items()})
    print("\nmedian k")
    for part in ("asterisk arm", "dagger stem", "trademark T", "superior one"):
        for side in ("light", "bold"):
            vals = sorted(r[(part, side)] for r in rows.values() if (part, side) in r)
            if vals:
                med = vals[len(vals) // 2] if len(vals) % 2 else (vals[len(vals) // 2 - 1] + vals[len(vals) // 2]) / 2
                print(f"  {part:13} {side:5} median {med:.2f}  ({', '.join(f'{v:.2f}' for v in vals)})")


if __name__ == "__main__":
    sys.exit(main())
