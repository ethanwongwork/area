import sys, os, math
sys.path.insert(0, os.path.join(os.getcwd(), "../../docs/research/serif-typeface-2026-11-10/tools")); sys.path.insert(0, os.path.dirname(__file__))
import lib
from prof import faces, cap, xh
def hstem(f):
    s = lib.g(f, "H").h(cap(f) * 0.25)[0]; return s[1] - s[0]
def arm(f, ch, top=True):
    g = lib.g(f, ch); st = hstem(f); C = cap(f)
    L, R = g.h(C * (0.25 if ch != "L" else 0.5))[0]
    if ch == "T": R = g.h(C * 0.4)[0][1]
    x1 = g.x1; out = []
    for k in (.1, .2, .3, .4, .5, .6, .7, .8, .85, .9, .95):
        x = R + k * (x1 - R)
        v = g.v(x)
        s = v[-1] if top else v[0]
        out.append(f"{k}:{(s[1]-s[0])/st:.2f}")
    return (x1 - R) / st, out
def polar(f, ch):
    g = lib.g(f, ch); st = hstem(f); C = cap(f)
    cx = (g.x0 + g.x1) / 2; cy = C / 2
    # centre of the bowl: use left extreme and O-like width
    out = []
    for a in (150, 120, 100, 90, 80, 70, 60, 50, 45, 40, 35, 30):
        r = math.radians(a); dx, dy = math.cos(r), math.sin(r)
        # march along the ray, collect ink span
        inside = []; t = 0; step = C / 2000; pts = []
        prev = False; start = None; spans = []
        while t < C:
            x, y = cx + dx * t, cy + dy * t
            ins = any(s[0] <= x <= s[1] for s in g.h(y)) if 0 <= y + 0 else False
            if ins and not prev: start = t
            if prev and not ins: spans.append((start, t))
            prev = ins; t += step * 4
        out.append(f"{a}:" + "/".join(f"{(b-a_)/st:.2f}" for a_, b in spans[-1:]))
    return out
for ch, top in (("E", True), ("E", False), ("F", True), ("L", False), ("T", True), ("Z", True)):
    print("==", ch, "top arm" if top else "bottom arm", "(length in H stems; thickness at share of length)")
    for label, f in faces():
        ln, out = arm(f, ch, top); print(f"{label:8} {ln:.2f} ", " ".join(out))
for ch in "CG":
    print("==", ch, "stroke across rays from the centre, by angle (H stems)")
    for label, f in faces():
        g = lib.g(f, ch); C = cap(f)
        print(f"{label:8}", " ".join(polar(f, ch)), " width/cap %.3f" % ((g.x1 - g.x0) / C))
