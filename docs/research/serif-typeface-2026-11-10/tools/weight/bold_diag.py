"""What the references do with slanted strokes and thin round strokes from Regular to Bold: the measures behind
bold.py's DIAG_INWARD, VERTEX_FLAT and SUB_ROUND. Numbers only; every value at an x-height of 520.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/bold_diag.py
"""
import statistics as st

import bold_parts as B
import evlib as E

F = dict(B.FACES)


def two(s, y):
    sp = s.h(y)
    return sp if len(sp) == 2 else None


def vee(f, ch, up):
    """A letter of two slanted strokes meeting at a point (v y V: at the foot; A: at the head). The strokes' level
    widths and the gap between them at 3/4 of the way to the open end, the flat at the point, the height where the
    counter ends, and the outer edges' lean."""
    m = E.metrics(f)
    k = 520 / m["xh"]
    s = E.Shape(f, ch)
    z = m["xh"] if ch.islower() else m["cap"]
    yo = z * (0.25 if up else 0.75)                       # towards the open end, clear of serifs and of A's bar
    if ch == "A":
        yo = z * 0.12
    a = two(s, yo)
    if not a:
        return None
    point_y = (s.y1 - 1.5) if up else (0.0 + 1.5 if ch != "y" else None)
    if ch in "vV":
        point_y = s.y0 + 1.5
    flat = None
    if point_y is not None:
        sp = s.h(point_y)
        flat = (sp[0][1] - sp[0][0]) * k if len(sp) == 1 else None
    ys = [y for y in range(int(z * 0.02), int(z * 0.98)) if len(s.h(y)) == 2] if ch != "A" else \
         [y for y in range(int(z * 0.45), int(z * 0.98)) if len(s.h(y)) == 2]
    inner = (max(ys) if up else min(ys)) * k if ys else None
    b = two(s, yo + (z * 0.1 if not up else z * 0.1))
    lean = None
    if b:
        dy = (z * 0.1)
        lean = (((b[0][0] - a[0][0]) / dy), ((b[1][1] - a[1][1]) / dy))
    return {"w1": (a[0][1] - a[0][0]) * k, "w2": (a[1][1] - a[1][0]) * k, "gap": (a[1][0] - a[0][1]) * k,
            "flat": flat, "inner": inner, "lean": lean, "ink": (s.x1 - s.x0) * k}


def turn(f, ch, zone):
    """A thin round stroke at its extreme: s's upper left and lower right turns, g's loop sides. Level cut."""
    m = E.metrics(f)
    k = 520 / m["xh"]
    s = E.Shape(f, ch)
    out = {}
    for name, lo, hi, side in zone:
        best = None
        y = lo * m["xh"]
        while y < hi * m["xh"]:
            sp = s.h(y)
            if len(sp) >= 2:
                e = sp[side]
                x = e[0] if side == 0 else -e[1]
                if best is None or x < best[0]:
                    best = (x, e[1] - e[0])
            y += 2
        out[name] = best[1] * k if best else None
    return out


if __name__ == "__main__":
    shares, flats = [], []
    for ch, up in (("v", False), ("y", False), ("V", False), ("A", True)):
        for n, (r, b) in F.items():
            R, Bd = vee(r, ch, up), vee(b, ch, up)
            if not R or not Bd:
                print(ch, n, "not read")
                continue
            gain = (Bd["w1"] - R["w1"]) + (Bd["w2"] - R["w2"])
            share = (R["gap"] - Bd["gap"]) / gain
            fr = Bd["flat"] / R["flat"] if R["flat"] and Bd["flat"] else None
            print(f"{ch} {n:18} strokes {R['w1']:.0f}+{R['w2']:.0f} > {Bd['w1']:.0f}+{Bd['w2']:.0f}  gap {R['gap']:.0f} > {Bd['gap']:.0f}"
                  f"  opening's share {share:.2f}  flat {R['flat'] or 0:.0f} > {Bd['flat'] or 0:.0f} ({fr or 0:.2f})"
                  f"  counter ends {R['inner']:.0f} > {Bd['inner']:.0f}  lean {R['lean'][0]:.3f},{R['lean'][1]:.3f} > {Bd['lean'][0]:.3f},{Bd['lean'][1]:.3f}  ink {R['ink']:.0f} > {Bd['ink']:.0f}")
            if n != "Libre Baskerville":
                shares.append(share)
                if fr:
                    flats.append((ch, fr, R["flat"], Bd["flat"]))
    print("opening's share, Georgia Pro and Serrif, mean", round(st.mean(shares), 3), [round(x, 2) for x in shares])
    print("flat at the point", flats)
    zones = {"s": [("upper left", 0.55, 0.92, 0), ("lower right", 0.08, 0.45, -1)],
             "g": [("loop left", -0.42, -0.05, 0), ("loop right", -0.42, -0.05, -1)]}
    ratios = []
    for ch, zone in zones.items():
        for n, (r, b) in F.items():
            R, Bd = turn(r, ch, zone), turn(b, ch, zone)
            o = E.Shape(r, "o"); ob = E.Shape(b, "o"); m = E.metrics(r); mb = E.metrics(b)
            ro = (lambda s, mm: (s.h(mm["xh"] / 2)[0][1] - s.h(mm["xh"] / 2)[0][0]) * 520 / mm["xh"])
            print(ch, f"{n:18}", {kk: (round(R[kk]), round(Bd[kk]), round(Bd[kk] / R[kk], 2)) for kk in R if R[kk] and Bd[kk]},
                  "o round", round(ro(o, m)), round(ro(ob, mb)), round(ro(ob, mb) / ro(o, m), 2))
            if n != "Libre Baskerville":
                ratios += [(Bd[kk] - R[kk]) / (ro(ob, mb) - ro(o, m)) for kk in R if R[kk] and Bd[kk]]
    print("thin round stroke's gain as a share of the o's round stroke's gain, Georgia Pro and Serrif:", [round(x, 2) for x in ratios], "mean", round(st.mean(ratios), 3))
