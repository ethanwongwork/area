"""Signs and punctuation in the references, Bold over Regular (numbers only, x-height 520): the strokes of the
hyphen, dashes, plus, equals, less-than, slash, brackets, braces, parentheses, the bullet, the exclamation mark's
top, the guillemets and the asterisk.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/bold_signs.py
"""
import math
import statistics as st

import bold_parts as B
import evlib as E


def level(s):                     # thickness of a level bar at its middle
    v = s.v((s.x0 + s.x1) / 2)
    return v[0][1] - v[0][0] if v else None


def upright(s, y=None):
    h = s.h((s.y0 + s.y1) / 2 if y is None else y)
    return h[0][1] - h[0][0] if h else None


def slanted(s):
    y0, y1 = s.y0 + (s.y1 - s.y0) * 0.35, s.y0 + (s.y1 - s.y0) * 0.65
    a, b = s.h(y0), s.h(y1)
    if not a or not b:
        return None
    m = ((b[0][0] + b[0][1]) - (a[0][0] + a[0][1])) / 2 / (y1 - y0)
    return (a[0][1] - a[0][0]) / math.sqrt(1 + m * m)


READ = [("hyphen", "-", level), ("en dash", "–", level), ("em dash", "—", level), ("plus, level bar", "+", lambda s: (lambda v: v[0][1] - v[0][0])(s.v(s.x0 + (s.x1 - s.x0) * 0.2))),
        ("plus, upright bar", "+", lambda s: upright(s, s.y0 + (s.y1 - s.y0) * 0.2)), ("equals, a bar", "=", level), ("underscore", "_", level),
        ("slash", "/", slanted), ("less-than, an arm", "<", lambda s: (lambda v: (v[0][1] - v[0][0]) if v else None)(s.v(s.x0 + (s.x1 - s.x0) * 0.6))),
        ("bracket, upright", "[", upright), ("parenthesis, middle", "(", upright), ("brace, upright", "{", lambda s: upright(s, s.y0 + (s.y1 - s.y0) * 0.25)),
        ("bar", "|", upright), ("bullet, width", "•", lambda s: s.x1 - s.x0), ("exclamation top, widest", "!", lambda s: max((h[0][1] - h[0][0]) for y in range(int(s.y0 + (s.y1 - s.y0) * 0.4), int(s.y1), 4) for h in [s.h(y)] if h)),
        ("guillemet, an arm (level cut)", "‹", lambda s: (lambda h: h[0][1] - h[0][0])(s.h(s.y0 + (s.y1 - s.y0) * 0.3))),
        ("asterisk, width", "*", lambda s: s.x1 - s.x0), ("degree, stroke", "°", upright), ("number sign, upright stroke", "#", lambda s: slanted(s)),
        ("quote, widest", "’", lambda s: max((h[0][1] - h[0][0]) for y in range(int(s.y0) + 4, int(s.y1), 4) for h in [s.h(y)] if h)),
        ("comma, widest", ",", lambda s: max((h[0][1] - h[0][0]) for y in range(int(s.y0) + 4, int(s.y1), 4) for h in [s.h(y)] if h))]

if __name__ == "__main__":
    F = dict(B.FACES)
    print(f"{'':32}" + "".join(f"{n:>22}" for n in F) + f"{'mean G,S':>10}{'Area':>8}{'x mean':>8}")
    for name, ch, fn in READ:
        line, rs = f"{name:32}", {}
        for n, (r, b) in F.items():
            try:
                kr, kb = 520 / E.metrics(r)["xh"], 520 / E.metrics(b)["xh"]
                a, c = fn(E.Shape(r, ch)) * kr, fn(E.Shape(b, ch)) * kb
                rs[n] = c / a
                line += f"{c / a:10.2f}{a:6.0f}>{c:<5.0f}"
            except Exception:
                line += f"{'':22}"
        try:
            ar = fn(E.Shape(B.AREA, ch))
        except Exception:
            ar = None
        if "Georgia Pro" in rs and "Serrif" in rs:
            t = (rs["Georgia Pro"] + rs["Serrif"]) / 2
            line += f"{t:10.2f}" + (f"{ar:8.0f}{ar * t:8.0f}" if ar else "")
        print(line)
