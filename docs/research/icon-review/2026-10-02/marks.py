# Inventory of small marks across the Area set: +, −, ×, ✓, !, badge dots and arrowheads,
# measured from the sources, grouped by kind and size so outliers stand out.
# From the repository root: python3 docs/research/icon-review/2026-10-02/marks.py
import re, glob, os, math, collections
P = "apps/docs/assets/area-icons-pilot/"
num = r"-?\d*\.?\d+"
def subpaths(d):
    out = []
    for sp in re.findall(r"M[^M]*", d):
        pts, cur = [], None
        toks = re.findall(r"[A-Za-z]|" + num, sp)
        if re.search(r"[CQSTcqstlhvma]", sp): out.append(["A"]); continue
        i, cmd = 0, None
        while i < len(toks):
            t = toks[i]
            if t.isalpha(): cmd = t; i += 1; continue
            if cmd in "ML": cur = (float(toks[i]), float(toks[i+1])); i += 2
            elif cmd == "H": cur = (float(t), cur[1]); i += 1
            elif cmd == "V": cur = (cur[0], float(t)); i += 1
            elif cmd == "A": cur = (float(toks[i+5]), float(toks[i+6])); i += 7; pts.append("A")
            else: i += 1
            pts.append(cur)
        out.append(pts)
    return out
L = lambda a, b: math.hypot(b[0]-a[0], b[1]-a[1])
rows = collections.defaultdict(list)
for f in sorted(glob.glob(P + "*.svg")):
    n = os.path.basename(f)[:-4]; s = open(f).read()
    if "data-alias-of" in s: continue
    for el in re.finditer(r"<(path|circle)\b([^>]*)/>", s):
        tag, a = el.group(1), el.group(2)
        role = (re.search(r'data-filled="(\w+)"', a) or [None, "-"])[1]
        if role in ("gap", "fill", "stroke", "halo", "line"): continue
        if tag == "circle":
            r = float(re.search(r'\br="([\d.]+)"', a).group(1))
            if 'fill="currentColor"' in a: rows["dot r" + str(r)].append(n)
            continue
        d = re.search(r'\bd="([^"]+)"', a).group(1)
        sps = [p for p in subpaths(d) if "A" not in p]
        segs = [(p[0], p[1]) for p in sps if len(p) == 2]
        # + : a vertical and a horizontal segment of equal length crossing at their midpoints
        for i, (a1, b1) in enumerate(segs):
            for (a2, b2) in segs[i+1:]:
                m1 = ((a1[0]+b1[0])/2, (a1[1]+b1[1])/2); m2 = ((a2[0]+b2[0])/2, (a2[1]+b2[1])/2)
                if L(m1, m2) < 0.01 and abs(L(a1, b1) - L(a2, b2)) < 0.01:
                    v1 = (b1[0]-a1[0], b1[1]-a1[1]); kind = "+" if (v1[0] == 0 or v1[1] == 0) else "×"
                    rows[f"{kind} {L(a1, b1):g}"].append(f"{n}({role})")
        # ✓ : three points, first leg down-right, second up-right, ratio 1:2
        for p in sps:
            if len(p) == 3:
                (x0, y0), (x1, y1), (x2, y2) = p
                if x1 > x0 and y1 > y0 and x2 > x1 and y2 < y1 and abs((x1-x0) - (y1-y0)) < .01:
                    rows[f"✓ {x1-x0:g}/{x2-x1:g}"].append(f"{n}({role})")
                # arrowhead: symmetric 90° V
                l1, l2 = L(p[0], p[1]), L(p[1], p[2])
                if abs(l1 - l2) < .01 and abs((p[0][0]-p[1][0])*(p[2][0]-p[1][0]) + (p[0][1]-p[1][1])*(p[2][1]-p[1][1])) < .01 and not (x1 > x0 and y1 > y0 and x2 > x1 and y2 < y1):
                    rows[f"head {l1/math.sqrt(2):g}"].append(f"{n}({role})")
            if len(p) == 2 and p[0][0] == p[1][0]:
                pass
        # ! : a vertical stem ending above a ⌀1.5 dot is matched loosely by the dot list
for k in sorted(rows, key=lambda k: (k.split()[0], float(re.findall(num, k)[0]) if re.findall(num, k) else 0)):
    v = rows[k]; print(f"{k:12} {len(v):3}  " + ", ".join(sorted(set(v)))[:600])
