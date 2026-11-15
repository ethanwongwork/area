"""The reference parts the first Bold measures left unread, Bold over Regular (numbers only, x-height 520):
closed counters in every face (a contour inside another, whatever its winding: Serrif's were skipped before), a
ball's height as well as its width, and the ampersand cut level at five heights.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/bold_unread.py
"""
import statistics as st

import bold_parts as B
import evlib as E


def inner(s):
    """Areas of contours that lie inside another contour, largest first."""
    boxes = [(min(q[0] for q in p), min(q[1] for q in p), max(q[0] for q in p), max(q[1] for q in p)) for p in s.polys]
    out = []
    for i, b in enumerate(boxes):
        if any(j != i and o[0] < b[0] and o[1] < b[1] and o[2] > b[2] and o[3] > b[3] for j, o in enumerate(boxes)):
            out.append(abs(E.area(s.polys[i])))
    return sorted(out, reverse=True)


def ball(s, lo, hi, side):
    """(width, height) of the blob at one side between heights lo and hi: its widest level cut, and how far up and
    down from there the cut stays at least half that wide."""
    rows = []
    y = lo
    while y <= hi:
        sp = s.h(y)
        if len(sp) >= 2:
            rows.append((y, sp[side][1] - sp[side][0]))
        y += 2
    if not rows:
        return None
    w = max(r[1] for r in rows)
    ys = [r[0] for r in rows if r[1] >= w / 2]
    return w, max(ys) - min(ys)


def cuts(s):
    return [[round(b - a) for a, b in s.h(s.y0 + (s.y1 - s.y0) * f)] for f in (0.12, 0.3, 0.5, 0.7, 0.88)]


if __name__ == "__main__":
    F = dict(B.FACES)
    print("closed counters, area Bold / Regular (largest first)")
    means = {}
    for ch in "abdegopqABDOPQR04689":
        row = []
        for n, (r, b) in F.items():
            kr, kb = 520 / E.metrics(r)["xh"], 520 / E.metrics(b)["xh"]
            a, c = [x * kr * kr for x in inner(E.Shape(r, ch))], [x * kb * kb for x in inner(E.Shape(b, ch))]
            row.append([round(y / x, 2) for x, y in zip(a, c)] if len(a) == len(c) and a else None)
        ar = [round(x) for x in inner(E.Shape(B.AREA, ch))]
        if row[0] and row[1]:
            means[ch] = [round((x + y) / 2, 2) for x, y in zip(row[0], row[1])]
        print(f"  {ch}  Georgia Pro {row[0]}  Serrif {row[1]}  Libre Baskerville {row[2]}  mean G,S {means.get(ch)}  Area Regular {ar}")
    lc = [means[c][0] for c in "abdeopq" if c in means]
    print("  lowercase bowls, mean of the two:", round(st.mean(lc), 3), " capitals:", round(st.mean(means[c][0] for c in "ABDOPQR" if c in means), 3))
    print("ball terminals: width and height, Bold / Regular")
    for name, ch, lo, hi, side in (("a", "a", 0.55, 0.9, 0), ("c", "c", 0.55, 0.9, -1), ("r", "r", 0.55, 0.95, -1), ("f", "f", 1.05, 1.5, -1), ("j", "j", -0.45, -0.1, 0), ("y", "y", -0.45, -0.1, 0)):
        row = []
        for n, (r, b) in F.items():
            out = []
            for f in (r, b):
                m = E.metrics(f)
                k = 520 / m["xh"]
                v = ball(E.Shape(f, ch), m["xh"] * lo, m["xh"] * hi, side)
                out.append((v[0] * k, v[1] * k) if v else None)
            row.append(f"{n} w {out[1][0] / out[0][0]:.2f} h {out[1][1] / out[0][1]:.2f} ({out[0][0]:.0f}x{out[0][1]:.0f} > {out[1][0]:.0f}x{out[1][1]:.0f})" if out[0] and out[1] else f"{n} -")
        print(f"  {name}: " + "; ".join(row))
    print("ampersand, level cuts at 0.12, 0.30, 0.50, 0.70, 0.88 of its height (Regular > Bold)")
    for n, (r, b) in F.items():
        kr, kb = 520 / E.metrics(r)["xh"], 520 / E.metrics(b)["xh"]
        a, c = cuts(E.Shape(r, "&")), cuts(E.Shape(b, "&"))
        print(f"  {n}: " + " | ".join(f"{[round(x * kr) for x in p]} > {[round(x * kb) for x in q]}" for p, q in zip(a, c)))
    print("  Area Regular:", cuts(E.Shape(B.AREA, "&")))
