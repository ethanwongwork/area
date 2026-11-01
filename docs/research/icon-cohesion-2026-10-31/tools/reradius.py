#!/usr/bin/env python3
"""Change a frame's corner radius without moving its shape (corner radius by size, owner 2026-11-01).

Every quarter-round corner (an arc of radius OLD between an axis-aligned run and the next) keeps its corner point;
its ends slide along their edges to the NEW radius, and the runs either side follow. Rects change rx. Parts whose own
box is under MIN on its long side (a lock, a clip, a badge) keep their radius: the rule is by size.

  python3 docs/research/icon-cohesion-2026-10-31/tools/reradius.py OLD NEW name,name… [--min 6] [--dry]
"""
import re, sys

TOK = re.compile(r"[MLHVCSQAZmlhvcsqaz]|-?\d*\.?\d+(?:e-?\d+)?")
ARITY = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "A": 7, "Z": 0}
fmt = lambda v: ("%.3f" % v).rstrip("0").rstrip(".") if abs(v - round(v)) > 1e-9 else str(int(round(v)))

def parse(d):
    toks, i, out, cur = TOK.findall(d), 0, [], None
    while i < len(toks):
        if toks[i].isalpha():
            cur = toks[i]; i += 1
            if cur in "Zz": out.append(["Z", []]); continue
        n = ARITY[cur.upper()]
        out.append([cur, [float(x) for x in toks[i:i + n]]]); i += n
        if cur == "M": cur = "L"
    if any(c.islower() for c, _ in out): raise ValueError("relative commands")
    return out

def ends(cmds):
    pts, x, y, start = [], 0, 0, (0, 0)
    for c, a in cmds:
        if c == "M": x, y = a; start = (x, y)
        elif c == "L": x, y = a
        elif c == "H": x = a[0]
        elif c == "V": y = a[0]
        elif c in "ACSQ": x, y = a[-2], a[-1]
        elif c == "Z": x, y = start
        pts.append((x, y))
    return pts

def write(cmds):
    return "".join(c + (" ".join(fmt(v) for v in a)) for c, a in cmds)

def reradius(d, old, new, minlong):
    cmds = parse(d)
    pts = ends(cmds)
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    if max(max(xs) - min(xs), max(ys) - min(ys)) < minlong: return d, 0
    changed = 0
    for k, (c, a) in enumerate(cmds):
        if c != "A" or k == 0 or abs(a[0] - old) > 1e-6 or abs(a[1] - old) > 1e-6: continue
        p1, p2 = pts[k - 1], (a[5], a[6])
        if abs(abs(p2[0] - p1[0]) - old) > 0.02 or abs(abs(p2[1] - p1[1]) - old) > 0.02: continue
        # The corner is the candidate whose turn matches the sweep (y down: positive cross = clockwise = sweep 1).
        corner = None
        for cx, cy in ((p2[0], p1[1]), (p1[0], p2[1])):
            cross = (cx - p1[0]) * (p2[1] - cy) - (cy - p1[1]) * (p2[0] - cx)
            if (cross > 0) == (a[4] == 1): corner = (cx, cy)
        if corner is None: continue
        s = new / old
        n1 = (corner[0] + (p1[0] - corner[0]) * s, corner[1] + (p1[1] - corner[1]) * s)
        n2 = (corner[0] + (p2[0] - corner[0]) * s, corner[1] + (p2[1] - corner[1]) * s)
        pc, pa = cmds[k - 1]
        if pc == "H": pa[0] = n1[0]
        elif pc == "V": pa[0] = n1[1]
        elif pc in "LM": pa[0], pa[1] = n1
        else: continue
        a[0] = a[1] = new; a[5], a[6] = n2
        # A path that closes on this arc's end starts there too.
        if k + 1 < len(cmds) and cmds[k + 1][0] == "Z" and abs(cmds[0][1][0] - p2[0]) < 1e-6 and abs(cmds[0][1][1] - p2[1]) < 1e-6:
            cmds[0][1][0], cmds[0][1][1] = n2
        # A path whose first command starts at this arc's end (the arc closes the outline with Z after it).
        if cmds[0][0] == "M" and abs(cmds[0][1][0] - p2[0]) < 1e-6 and abs(cmds[0][1][1] - p2[1]) < 1e-6 and k == len(cmds) - 1:
            cmds[0][1][0], cmds[0][1][1] = n2
        pts = ends(cmds); changed += 1
    return write(cmds), changed

if __name__ == "__main__":
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    old, new, names = float(args[0]), float(args[1]), args[2].split(",")
    minlong = float(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 6
    for n in names:
        p = f"packages/icons/sources/{n}.svg"; t = open(p).read(); total = 0
        def path(m):
            global total
            d, c = reradius(m.group(2), old, new, minlong); total += c; return m.group(1) + d + m.group(3)
        t2 = re.sub(r'(<path\b[^>]*\sd=")([^"]*)(")', path, t)
        def rect(m):
            global total
            a = m.group(0); w, h = float(re.search(r'width="([\d.]+)"', a).group(1)), float(re.search(r'height="([\d.]+)"', a).group(1))
            if max(w, h) < minlong: return a
            r = re.search(r'rx="([\d.]+)"', a)
            if r and abs(float(r.group(1)) - old) < 1e-6: total += 4; return a.replace(r.group(0), f'rx="{fmt(new)}"')
            return a
        t2 = re.sub(r"<rect\b[^>]*/>", rect, t2)
        print(f"{n}: {total} corners")
        if "--dry" not in sys.argv: open(p, "w").write(t2)
