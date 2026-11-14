"""Do 5, Z and z lean? (owner, 2026-11-14.) Numbers only, every face at its own heights.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/lean.py

For each: where the ink's centre of area sits against the middle of the advance and of the ink's own box; the top
half's centre against the bottom half's (a letter that leans has its top to the right of its bottom); Z z: the
diagonal's angle from upright and how far the top bar's middle is right of the bottom bar's; 5: the lean of its
upright stroke, and where the flag's and the bowl's right ends sit.
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "weight"), os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")]
import bold_parts as B  # noqa: E402
import evlib as E  # noqa: E402


def centre(s, y0, y1):
    """Centre of area (x) of the ink between two heights, by scan lines."""
    num = den = 0.0
    y = y0
    while y < y1:
        for a, b in s.h(y):
            num += (b - a) * (a + b) / 2
            den += b - a
        y += 2
    return num / den if den else None


def one(f, ch):
    s = E.Shape(f, ch)
    h = s.y1 - s.y0
    k = 100 / h                                           # everything as a share of the glyph's height, x 100
    mid = (s.y0 + s.y1) / 2
    top, bot, all_ = centre(s, mid, s.y1), centre(s, s.y0, mid), centre(s, s.y0, s.y1)
    d = {"ink centre - box centre": (all_ - (s.x0 + s.x1) / 2) * k, "ink centre - advance centre": (all_ - s.adv / 2) * k,
         "top half - bottom half": (top - bot) * k, "width / height": (s.x1 - s.x0) / h}
    if ch in "Zz":
        a, b = s.h(s.y0 + h * 0.35), s.h(s.y0 + h * 0.65)
        if len(a) == 1 and len(b) == 1:
            dx = ((b[0][0] + b[0][1]) - (a[0][0] + a[0][1])) / 2
            d["diagonal, degrees from upright"] = math.degrees(math.atan(dx / (h * 0.3)))
        t, bo = s.h(s.y1 - h * 0.03), s.h(s.y0 + h * 0.03)
        d["top bar middle - bottom bar middle"] = ((t[0][0] + t[-1][1]) / 2 - (bo[0][0] + bo[-1][1]) / 2) * k
        d["top bar left - bottom bar left"] = (t[0][0] - bo[0][0]) * k
        d["top bar right - bottom bar right"] = (t[-1][1] - bo[-1][1]) * k
    if ch == "5":
        a, b = s.h(s.y0 + h * 0.62), s.h(s.y0 + h * 0.86)          # the upright between bowl and flag
        if a and b:
            d["upright, degrees from upright"] = math.degrees(math.atan((b[0][0] - a[0][0]) / (h * 0.24)))
        flag = s.h(s.y1 - h * 0.04)
        bowl = max(sp[-1][1] for y in range(int(s.y0), int(mid)) for sp in [s.h(y)] if sp)
        d["flag's right end - bowl's right end"] = (flag[-1][1] - bowl) * k
        d["flag's left end - bowl's left end"] = (flag[0][0] - min(sp[0][0] for y in range(int(s.y0), int(s.y0 + h * 0.3)) for sp in [s.h(y)] if sp)) * k
    return d


if __name__ == "__main__":
    faces = {"Area": B.AREA}
    faces.update({n: r for n, (r, b) in B.FACES.items()})
    for ch in "5Zz" + "27EST":
        rows = {n: one(f, ch) for n, f in faces.items()}
        print(ch)
        for key in rows["Area"]:
            vals = [rows[n].get(key) for n in faces]
            refs = [v for v in vals[1:] if v is not None]
            out = "" if not refs or vals[0] is None else ("  OUTSIDE" if not (min(refs) - 0.5 <= vals[0] <= max(refs) + 0.5) else "")
            print(f"   {key:38}" + "".join(f"{n[:12]:>13} {v:6.2f}" if v is not None else f"{n[:12]:>13}      -" for n, v in zip(faces, vals)) + out)
