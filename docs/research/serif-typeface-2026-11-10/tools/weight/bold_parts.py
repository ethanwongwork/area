"""The parts the first bold measures left out, Bold against Regular in Georgia Pro, Serrif and Libre Baskerville:
ball terminals, diagonals, the s spine, g, marks, the ampersand, dots, and each letter's mean stroke and counters.
Numbers only (the faces are licensed); every value at an x-height of 520.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/bold_parts.py
"""
import json
import math
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", ".."))
SERIF = os.path.join(ROOT, "typefaces", "area-serif")
sys.path[:0] = [SERIF, os.path.join(ROOT, "docs", "research", "serif-evaluation-2026-11-13", "tools")]
import evlib as E  # noqa: E402

U = E.USER_FONTS
LB = os.path.join(SERIF, "build", "eval-fonts", "LibreBaskerville.ttf")


def inst(path, var):
    f = TTFont(path)
    return instantiateVariableFont(f, var, inplace=True) if var else f


FACES = {
    "Georgia Pro": (inst(U + "GeorgiaPro-Regular.ttf", None), inst(U + "GeorgiaPro-Bold.ttf", None)),
    "Serrif": tuple(inst(U + "SerrifCollectionVF-TRIAL.ttf", {"wght": w, "wdth": 100, "slnt": 0}) for w in (400, 700)),
    "Libre Baskerville": (inst(LB, {"wght": 400}), inst(LB, {"wght": 700})),
}
AREA = TTFont(os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"))


def perim(poly):
    return sum(math.dist(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly)))


def mean_stroke(s):
    """2 x ink area / outline length: a glyph's mean stroke thickness."""
    a = sum(E.area(p) for p in s.polys)
    return 2 * abs(a) / sum(perim(p) for p in s.polys)


def counters(s):
    """Areas of the closed counters (contours wound against the outer one), largest first."""
    ar = [E.area(p) for p in s.polys]
    outer = max(ar, key=abs)
    return sorted((abs(a) for a in ar if a * outer < 0), reverse=True)


def diagonal(s, y0, y1, k):
    """Strokes crossing the band y0..y1, each as its thickness across itself, left to right."""
    a, b = s.h(y0), s.h(y1)
    if len(a) != len(b):
        return None
    out = []
    for (a0, a1), (b0, b1) in zip(a, b):
        slope = ((b0 + b1) - (a0 + a1)) / 2 / (y1 - y0)
        out.append(((a1 - a0) + (b1 - b0)) / 2 * math.cos(math.atan(slope)) * k)
    return out


def terminal(s, lo, hi, side, k):
    """The widest the first (side 0) or last (side -1) ink span gets between heights lo and hi, and how tall that
    part is: a ball or a beak."""
    best, ys = 0, []
    y = lo
    while y <= hi:
        sp = s.h(y)
        if len(sp) >= 2:
            w = sp[side][1] - sp[side][0]
            best = max(best, w)
            ys.append(y)
        y += 2
    return best * k


def spine(s, k):
    cx = (s.x0 + s.x1) / 2
    v = s.v(cx)
    if len(v) != 3:
        return None
    lo, hi = v[1]
    a, b = s.v(cx - 12), s.v(cx + 12)
    if len(a) != 3 or len(b) != 3:
        return (hi - lo) * k
    slope = ((b[1][0] + b[1][1]) - (a[1][0] + a[1][1])) / 2 / 24
    return (hi - lo) * math.cos(math.atan(slope)) * k


def dot(f, ch, k):
    s = E.Shape(f, ch)
    top = max(s.polys, key=lambda p: min(q[1] for q in p))
    xs = [q[0] for q in top]
    return (max(xs) - min(xs)) * k


def one(f):
    m = E.metrics(f)
    k = 520 / m["xh"]
    xh, cap = m["xh"], m["cap"]
    d = {}
    S = lambda ch: E.Shape(f, ch)                          # noqa: E731
    n = S("n")
    d["n stem"] = (n.h(xh * 0.3)[0][1] - n.h(xh * 0.3)[0][0]) * k
    for ch in "aegsk&@$Sxvwyz":
        if ord(ch) in f.getBestCmap():
            d[f"mean stroke {ch}"] = mean_stroke(S(ch)) * k
    for ch in "aegbdpqoAPRBDO468":
        c = counters(S(ch))
        for i, a in enumerate(c[:2]):
            d[f"counter {ch} {i + 1}"] = a * k * k
    for ch, lo, hi, cz in (("v", 0.3, 0.6, xh), ("w", 0.3, 0.6, xh), ("x", 0.62, 0.8, xh), ("y", 0.35, 0.6, xh),
                           ("A", 0.45, 0.7, cap), ("V", 0.3, 0.6, cap), ("W", 0.3, 0.6, cap), ("k", 0.1, 0.25, xh),
                           ("z", 0.35, 0.6, xh), ("N", 0.3, 0.6, cap), ("M", 0.45, 0.6, cap)):
        r = diagonal(S(ch), cz * lo, cz * hi, k)
        if r:
            for i, t in enumerate(r):
                d[f"{ch} stroke {i + 1}"] = t
    d["ball a"] = terminal(S("a"), xh * 0.55, xh * 0.9, 0, k)
    d["ball c"] = terminal(S("c"), xh * 0.55, xh * 0.9, -1, k)
    d["ball r"] = terminal(S("r"), xh * 0.55, xh * 0.95, -1, k)
    d["ball f"] = terminal(S("f"), xh * 1.05, m["asc"] * 0.97, -1, k)
    d["ball y"] = terminal(S("y"), m["desc"] * 0.95, m["desc"] * 0.4, 0, k)
    d["ball j"] = terminal(S("j"), m["desc"] * 0.95, m["desc"] * 0.4, 0, k)
    d["s spine"], d["S spine"] = spine(S("s"), k), spine(S("S"), k)
    g = S("g")
    gv = g.v((g.x0 + g.x1) / 2 - 10)
    for i, (a, b) in enumerate(gv):
        d[f"g level stroke {i + 1} (from below)"] = (b - a) * k
    gh = g.h(xh * 0.62)
    d["g bowl stroke"] = (gh[0][1] - gh[0][0]) * k
    d["g depth"] = g.y0 * k
    e = S("e")
    d["e eye height"] = None
    ev = e.v((e.x0 + e.x1) / 2)
    if len(ev) == 3:
        d["e eye height"] = (ev[2][0] - ev[1][1]) * k
        d["e lower counter height"] = (ev[1][0] - ev[0][1]) * k
        d["e bar"] = (ev[1][1] - ev[1][0]) * k
    a = S("a")
    av = a.v((a.x0 + a.x1) / 2 - 20)
    d["a level strokes (from below)"] = [round((q - p) * k, 1) for p, q in av]
    d["dot i"] = dot(f, "i", k)
    d["dot period"] = (S(".").x1 - S(".").x0) * k
    d["dot dieresis"] = dot(f, "¨", k) if 0xA8 in f.getBestCmap() else None
    d["comma height"] = (S(",").y1 - S(",").y0) * k
    for name, ch in (("acute", "´"), ("grave", "`"), ("circumflex", "ˆ"), ("tilde", "˜"),
                     ("macron", "¯"), ("caron", "ˇ"), ("cedilla", "¸"), ("ring", "˚")):
        if ord(ch) in f.getBestCmap():
            s = S(ch)
            if not s.empty:
                d[f"mark {name}: mean stroke"] = mean_stroke(s) * k
                d[f"mark {name}: width"] = (s.x1 - s.x0) * k
                d[f"mark {name}: height"] = (s.y1 - s.y0) * k
                d[f"mark {name}: bottom"] = s.y0 * k
    amp = S("&")
    spans = [w for y in range(int(amp.y0) + 20, int(amp.y1) - 20, 6) for w in [b - a for a, b in amp.h(y)]]
    d["& thickest level cut"] = max(spans) * k
    d["& thinnest level cut"] = min(spans) * k
    d["& width"] = (amp.x1 - amp.x0) * k
    for ch in "aegs&vwkxASGRM":
        d[f"advance {ch}"] = S(ch).adv * k
        d[f"ink {ch}"] = (S(ch).x1 - S(ch).x0) * k
    return d


if __name__ == "__main__":
    area = one(AREA)
    out = {n: (one(r), one(b)) for n, (r, b) in FACES.items()}
    os.makedirs(os.path.join(SERIF, "build", "weight"), exist_ok=True)
    json.dump({"area": area, "refs": out}, open(os.path.join(SERIF, "build", "weight", "bold-parts.json"), "w"), indent=1)
    print(f"{'Bold / Regular (and Bold at x 520)':38}" + "".join(f"{n:>22}" for n in out) + f"{'mean G,S':>10}{'Area':>9}{'x mean':>9}")
    for key in area:
        if isinstance(area[key], list):
            print(f"{key:38}", {n: (r[key], b[key]) for n, (r, b) in out.items()}, "Area", area[key])
            continue
        line, rs = f"{key:38}", {}
        for n, (r, b) in out.items():
            if r.get(key) and b.get(key):
                rs[n] = b[key] / r[key]
                line += f"{rs[n]:10.2f}{r[key]:6.0f}>{b[key]:<5.0f}"
            else:
                line += f"{'':22}"
        if "Georgia Pro" in rs and "Serrif" in rs and area.get(key):
            t = (rs["Georgia Pro"] + rs["Serrif"]) / 2
            line += f"{t:10.2f}{area[key]:9.1f}{area[key] * t:9.1f}"
        elif area.get(key):
            line += f"{'':10}{area[key]:9.1f}"
        print(line)
