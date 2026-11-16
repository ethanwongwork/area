"""Curve tests.

Part 1, nodes (Area Serif's cubic UFO, every glyph): what a type designer checks node by node.
  kink        a join that is neither smooth nor a corner: the two tangents differ by 0.6 to 14 degrees
  g2          a smooth curve-to-curve join where the radius changes abruptly (a dent or a bulge in the arc)
  elbow       a curve that meets a straight with a tight radius at the join (the straight starts abruptly)
  inflection  one curve that bends both ways
  wobble      one curve whose curvature rises and falls more than once
  handles     a handle over 0.9 or under 0.15 of its reach, or two handles over 3x apart, or a zero handle
  extreme     a curve that passes a horizontal or vertical extreme without a node
  offaxis     a handle or a line that is 1 to 3 units from upright or level over a long run (should be exact)
  short       a segment under 4 units
Part 2, profiles (every face, the same code): each glyph's outline is cut at its corners into smooth runs, the
curvature is sampled every 2 units and lightly smoothed, and the number of curvature turning points is counted.
A run that turns more often than the same letter in the reference faces has a bump or a flat in it.

Usage: python test_curves.py   -> curves.json"""
import json
import math
import os
import sys

import ufoLib2

import evlib as E

CORNER = 14.0          # degrees: at or above this a join is a drawn corner
KINK = 0.6             # degrees: below this a join is smooth
TIGHT = 14             # units: a turn tighter than this radius is a rounded corner, not part of an arc
MIN_SPAN = 30          # curves shorter than this are fillets and serif corners: only kinks are judged


def ang(a, b):
    d = max(-1.0, min(1.0, a[0] * b[0] + a[1] * b[1]))
    return math.degrees(math.acos(d))


def chord(s):
    return math.hypot(s[-1][0] - s[1][0], s[-1][1] - s[1][1])


def node_tests(contours):
    found = []

    def add(test, p, detail, value, sev):
        found.append({"test": test, "x": round(p[0], 1), "y": round(p[1], 1), "detail": detail, "value": round(value, 3),
                      "sev": sev})

    for ci, c in enumerate(contours):
        n = len(c)
        for i, s in enumerate(c):
            nx = c[(i + 1) % n]
            node = s[-1]
            t_in, t_out = E.end_tangent(s, True), E.end_tangent(nx, False)
            a = ang(t_in, t_out)
            both_long = chord(s) >= 8 and chord(nx) >= 8
            if KINK <= a < CORNER and (s[0] != "L" or nx[0] != "L") and both_long:
                # how far the join sits off a straight line through its neighbours, in units
                reach = min(chord(s), chord(nx), 60)
                off = math.sin(math.radians(a)) * reach / 2
                add("kink", node, f"tangents differ by {a:.1f} deg ({off:.1f} units over {reach:.0f})", a,
                    "high" if a >= 4 and off >= 2 else "medium" if a >= 2 or off >= 1 else "low")
            if a < KINK * 3 and s[0] == "C" and nx[0] == "C" and chord(s) >= MIN_SPAN and chord(nx) >= MIN_SPAN:
                k0, k1 = E.curvature(s, 1.0), E.curvature(nx, 0.0)
                big, small = max(abs(k0), abs(k1)), min(abs(k0), abs(k1))
                if k0 * k1 < 0 and small > 1 / 1500:
                    add("g2", node, f"curvature flips sign at a smooth node (radius {1 / k0:.0f} to {1 / k1:.0f})", 99, "high")
                elif big > 1 / 1200:
                    r = big / max(small, 1e-9)
                    if r >= 1.6:
                        add("g2", node, f"radius {1 / max(abs(k0), 1e-9):.0f} to {1 / max(abs(k1), 1e-9):.0f} (x{r:.1f})", r,
                            "high" if r >= 3 else "medium" if r >= 2.2 else "low")
            if a < KINK * 3 and {s[0], nx[0]} == {"C", "L"}:
                cv, ln = (s, nx) if s[0] == "C" else (nx, s)
                if chord(cv) >= MIN_SPAN and chord(ln) >= 40:
                    k = abs(E.curvature(cv, 1.0 if cv is s else 0.0))
                    if k > 1 / 45:
                        add("elbow", node, f"curve meets a straight at radius {1 / k:.0f}", 1 / k, "low")
            if s[0] != "C":
                if s[0] == "L":
                    dx, dy = abs(s[2][0] - s[1][0]), abs(s[2][1] - s[1][1])
                    L = math.hypot(dx, dy)
                    if L >= 60 and (0.5 <= dx <= 3 or 0.5 <= dy <= 3) and min(dx, dy) / L < 0.03:
                        add("offaxis", s[1], f"line {L:.0f} long is {min(dx, dy):.0f} off {'upright' if dx < dy else 'level'}",
                            min(dx, dy), "medium" if L >= 150 else "low")
                    if 0 < L < 4:
                        add("short", s[1], f"line {L:.1f} units long", L, "low")
                continue
            _, p0, p1, p2, p3 = s
            span = chord(s)
            if span < 4:
                add("short", p0, f"curve {span:.1f} units long", span, "low")
            h0 = math.hypot(p1[0] - p0[0], p1[1] - p0[1])
            h3 = math.hypot(p2[0] - p3[0], p2[1] - p3[1])
            if span >= MIN_SPAN:
                if h0 < 0.5 or h3 < 0.5:
                    add("handles", p0 if h0 < 0.5 else p3, "zero-length handle on a long curve", 0, "medium")
                # off-axis handles: nearly upright or level, but not exactly
                for hp, on, hl in ((p1, p0, h0), (p2, p3, h3)):
                    dx, dy = abs(hp[0] - on[0]), abs(hp[1] - on[1])
                    if hl >= 25 and 0.5 <= min(dx, dy) <= 3 and min(dx, dy) / hl < 0.06:
                        add("offaxis", on, f"handle {hl:.0f} long is {min(dx, dy):.0f} off {'upright' if dx < dy else 'level'}",
                            min(dx, dy), "low")
                ks = [E.curvature(s, t / 48) for t in range(1, 48)]
                kmax = max(abs(k) for k in ks)
                flips = [j for j in range(1, len(ks)) if ks[j] * ks[j - 1] < 0]
                if flips and min(max(abs(k) for k in ks[:flips[0]] or [0]), max(abs(k) for k in ks[flips[0]:] or [0])) > 1 / 900:
                    q = E.pt(s, (flips[0] + 1) / 48)
                    add("inflection", q, "one curve bends both ways", 1, "medium")
                elif not flips and kmax > 1 / 500:
                    turns, last = 0, ks[0]
                    for j in range(1, len(ks) - 1):
                        if (ks[j] - ks[j - 1]) * (ks[j + 1] - ks[j]) < 0 and abs(ks[j] - last) > 0.25 * kmax:
                            turns += 1
                            last = ks[j]
                    if turns > 1:
                        add("wobble", E.pt(s, 0.5), f"{turns} curvature turns inside one curve", turns, "medium")
                # handle reach against the handles' meeting point
                den = (p1[0] - p0[0]) * (p2[1] - p3[1]) - (p1[1] - p0[1]) * (p2[0] - p3[0])
                if abs(den) > 1e-6 and h0 > 0.5 and h3 > 0.5:
                    ta = ((p3[0] - p0[0]) * (p2[1] - p3[1]) - (p3[1] - p0[1]) * (p2[0] - p3[0])) / den
                    tb = ((p3[0] - p0[0]) * (p1[1] - p0[1]) - (p3[1] - p0[1]) * (p1[0] - p0[0])) / den
                    if ta > 0 and tb > 0:
                        r0, r3 = 1 / ta, 1 / tb          # share of the way to the meeting point
                        if max(r0, r3) > 1.02:
                            add("handles", p0 if r0 > r3 else p3, f"handle runs past the meeting point ({max(r0, r3):.2f})",
                                max(r0, r3), "medium" if max(r0, r3) > 1.15 else "low")
                        elif min(r0, r3) < 0.15:
                            add("handles", p0 if r0 < r3 else p3, f"handle only {min(r0, r3):.2f} of its reach", min(r0, r3), "low")
                        elif max(r0, r3) / min(r0, r3) > 3:
                            add("handles", p0, f"handles {r0:.2f} / {r3:.2f} of reach, over 3x apart", max(r0, r3) / min(r0, r3), "low")
                for axis in (0, 1):
                    prev = E.d1(s, 0.06)[axis]
                    for t in range(4, 48):
                        tt = t / 50
                        v = E.d1(s, tt)[axis]
                        if prev * v < 0:
                            q = E.pt(s, tt)
                            # how far the curve travels past the nearer node
                            past = min(abs(q[1 - axis if False else axis] - p0[axis]), abs(q[axis] - p3[axis]))
                            if past >= 0.75:
                                add("extreme", q, f"{'xy'[axis]}-extreme without a node, {past:.1f} units past the nearest node",
                                    past, "medium" if past >= 2 else "low")
                            break
                        prev = v
    return found


def runs(contours, step=2.0):
    """Smooth runs of one glyph: lists of (x, y, curvature) cut at corners."""
    out = []
    for c in contours:
        n = len(c)
        cuts = [i for i in range(n) if ang(E.end_tangent(c[i], True), E.end_tangent(c[(i + 1) % n], False)) >= CORNER]
        order = list(range(n))
        if cuts:
            k = cuts[0] + 1
            order = [(k + j) % n for j in range(n)]
        cur = []
        for idx in order:
            s = c[idx]
            L = E.seg_len(s)
            m = max(1, int(L / step))
            for j in range(m):
                t = j / m
                k = E.curvature(s, t)
                if abs(k) > 1 / TIGHT:               # a rounded corner: the run ends here, as it would at a sharp one
                    if cur:
                        out.append(cur)
                    cur = []
                    continue
                cur.append((*E.pt(s, t), k))
            if idx in cuts:
                cur.append((*E.pt(s, 1.0), E.curvature(s, 1.0)))
                out.append(cur)
                cur = []
        if cur:
            out.append(cur)
    return out


def turning_points(run, win=5, floor=1 / 700):
    """Significant curvature extrema inside one smooth run (after a moving average over about 20 units)."""
    if len(run) < 4 * win:
        return 0, []
    ks = [p[2] for p in run]
    sm = []
    for i in range(len(ks)):
        a, b = max(0, i - win), min(len(ks), i + win + 1)
        sm.append(sum(ks[a:b]) / (b - a))
    kmax = max(abs(k) for k in sm)
    if kmax < floor:
        return 0, []
    need = max(0.22 * kmax, floor / 2)
    pts, last, direction = [], sm[0], 0
    ext_i = 0
    for i in range(1, len(sm)):
        d = sm[i] - sm[ext_i]
        if direction >= 0 and sm[i] > sm[ext_i]:
            ext_i = i if direction == 1 else ext_i
        if direction == 0:
            if abs(sm[i] - last) > need:
                direction = 1 if sm[i] > last else -1
                ext_i = i
            continue
        if direction == 1:
            if sm[i] > sm[ext_i]:
                ext_i = i
            elif sm[ext_i] - sm[i] > need:
                pts.append(ext_i)
                direction, ext_i = -1, i
        else:
            if sm[i] < sm[ext_i]:
                ext_i = i
            elif sm[i] - sm[ext_i] > need:
                pts.append(ext_i)
                direction, ext_i = 1, i
    return len(pts), [(round(run[i][0]), round(run[i][1])) for i in pts]


def profile(font, chars):
    out = {}
    for ch in chars:
        cs, _ = E.segs(font, ch)
        if not cs:
            continue
        total, where, kinks = 0, [], 0
        for r in runs(cs):
            nmb, pts = turning_points(r)
            total += nmb
            where += pts
        for c in cs:
            n = len(c)
            for i, s in enumerate(c):
                nx = c[(i + 1) % n]
                a = ang(E.end_tangent(s, True), E.end_tangent(nx, False))
                if 2.0 <= a < CORNER and chord(s) >= 12 and chord(nx) >= 12 and (s[0] != "L" or nx[0] != "L"):
                    kinks += 1
        out[ch] = {"turns": total, "where": where, "kinks": kinks}
    return out


def main():
    os.makedirs(E.OUT, exist_ok=True)
    ufo = ufoLib2.Font.open(E.AREA_UFO)
    cmap = {g.name: g.unicodes[0] for g in ufo if g.unicodes}
    nodes = {}
    for g in ufo:
        pen = E.SegPen(ufo)
        try:
            g.draw(pen)
        except Exception as e:                       # noqa: BLE001
            print("skip", g.name, e)
            continue
        f = node_tests([c for c in pen.contours if c])
        if f:
            nodes[g.name] = f
    prof = {k: profile(E.face(k), E.CORE) for k in E.available()}
    json.dump({"nodes": nodes, "cmap": cmap, "profile": prof, "glyphs": len(ufo)},
              open(os.path.join(E.OUT, "curves.json"), "w"))
    core = {E.face("area").getBestCmap()[ord(c)]: c for c in E.CORE}
    tally, tally_core = {}, {}
    for name, fs in nodes.items():
        for f in fs:
            key = (f["test"], f["sev"])
            tally[key] = tally.get(key, 0) + 1
            if name in core:
                tally_core[key] = tally_core.get(key, 0) + 1
    print(f"{len(ufo)} glyphs, {len(nodes)} with findings")
    for key in sorted(tally):
        print(f"  {key[0]:11} {key[1]:7} all {tally[key]:4}   core {tally_core.get(key, 0):3}")
    print("\nturning points and soft kinks per face (core 62):")
    for k, p in prof.items():
        print(f"  {E.FACES[k][0]:20} turns {sum(v['turns'] for v in p.values()):4}  kinks(2-14deg) {sum(v['kinks'] for v in p.values()):3}")
    if "--list" in sys.argv:
        for name in sorted(nodes, key=lambda n: (n not in core, n)):
            if name not in core and "--all" not in sys.argv:
                continue
            for f in nodes[name]:
                if f["sev"] != "low" or "--low" in sys.argv:
                    print(f"{name:8} {f['test']:10} {f['sev']:6} ({f['x']:.0f},{f['y']:.0f}) {f['detail']}")


if __name__ == "__main__":
    main()
