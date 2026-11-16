"""How serif faces draw their plain signs (owner, 2026-11-14: "+ | / _ and the dashes look plain"). Numbers only:
for each level stroke its thickness at 10, 50 and 90 per cent of its length (a swell or taper), and how far its
left and right ends lean (top corner minus bottom corner, in units at an x-height of 520); for the bar and slash
the same along their height. Faces: the two licensed references, the base, and five open serifs.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/sign_ends.py
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "weight"), os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")]
import bold_parts as B  # noqa: E402
import evlib as E  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402

EV = os.path.join(B.SERIF, "build", "eval-fonts")
FACES = {"Area": B.AREA, "Georgia Pro": B.FACES["Georgia Pro"][0], "Serrif": B.FACES["Serrif"][0],
         "Libre Bask.": B.FACES["Libre Baskerville"][0]}
for n in ("Literata", "Lora", "Merriweather", "Newsreader", "SourceSerif4"):
    try:
        FACES[n] = B.inst(os.path.join(EV, n + ".ttf"), {"wght": 400})
    except Exception:
        FACES[n] = TTFont(os.path.join(EV, n + ".ttf"))


def level(s, k):
    out = []
    for f in (0.1, 0.5, 0.9):
        v = s.v(s.x0 + (s.x1 - s.x0) * f)
        out.append((v[0][1] - v[0][0]) * k if v else 0)
    lo, hi = s.h(s.y0 + 1.5), s.h(s.y1 - 1.5)
    lean = ((hi[0][0] - lo[0][0]) * k, (hi[-1][1] - lo[-1][1]) * k) if lo and hi else (0, 0)
    return out, lean


def upright(s, k):
    out = []
    for f in (0.1, 0.5, 0.9):
        h = s.h(s.y0 + (s.y1 - s.y0) * f)
        out.append((h[0][1] - h[0][0]) * k if h else 0)
    return out, (0, 0)


SIGNS = [("hyphen", "-", level), ("en dash", "–", level), ("em dash", "—", level), ("minus", "−", level),
         ("underscore", "_", level), ("bar", "|", upright), ("slash", "/", upright)]

if __name__ == "__main__":
    for name, ch, fn in SIGNS:
        print(f"\n{name}: thickness at 10 / 50 / 90 %, ends' lean (left, right); x-height 520")
        for face, f in FACES.items():
            try:
                k = 520 / E.metrics(f)["xh"]
                s = E.Shape(f, ch)
                t, lean = fn(s, k)
                print(f"  {face:14}{t[0]:6.0f}{t[1]:6.0f}{t[2]:6.0f}   lean {lean[0]:+5.0f} {lean[1]:+5.0f}   length {((s.x1 - s.x0) if fn is level else (s.y1 - s.y0)) * k:5.0f}")
            except Exception as e:
                print(f"  {face:14} -- {type(e).__name__}")
