"""1x crispness of long axis-aligned strokes, and the half-pixel shift that fixes them (owner, 2026-10-14: "fix the frames").

A stroked line of the icon weight (1.125) is one pixel wide at 1x: on a half-pixel coordinate it fills one row; on a
whole pixel it smears across two grey rows. A solid's edge is the opposite: crisp on a whole pixel. This scores each
icon's axis-aligned runs (rect edges between their corners, H / V / axis L segments, at least MIN long) and tries the
nine shifts of 0 / +-0.5 per axis. A shift with dx != dy (mod 1) would take 45-degree lines off the lattice, so an icon
with a 45-degree segment only takes (0, 0) or (+-0.5, +-0.5). Filled-only elements (gap, fill, stroke, halo, inset)
move with the icon but are not scored. Bounds: centre-lines stay inside 1.5-14.5.

Run from the repo root:
  python3 docs/research/icon-review/2026-10-14/tools/frames.py report [name ...]   # table, worst first
  python3 docs/research/icon-review/2026-10-14/tools/frames.py apply name dx dy     # rewrite the source shifted
"""
import math, os, re, sys

SRC = "packages/icons/sources"
MIN = 2.0
FILLED_ONLY = re.compile(r'data-filled="(gap|fill|stroke|halo|inset)"')
NUM = r"-?(?:\d+\.?\d*|\.\d+)"
TOK = re.compile(r"[A-Za-z]|" + NUM)
ARITY = {"M": 2, "L": 2, "T": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "A": 7, "Z": 0}


def fmt(v):
    v = round(v, 6)
    s = ("%.6f" % v).rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def parse_d(d):
    toks = TOK.findall(d)
    out, i, cmd = [], 0, None
    while i < len(toks):
        if re.match("[A-Za-z]", toks[i]):
            cmd = toks[i]; i += 1
            if cmd.upper() != cmd:
                raise ValueError("relative command " + cmd)
            if cmd == "Z":
                out.append(("Z", [])); continue
        n = ARITY[cmd]
        out.append((cmd, [float(t) for t in toks[i:i + n]])); i += n
        if cmd == "M": cmd = "L"
    return out


def shift_d(d, dx, dy):
    parts = []
    for cmd, a in parse_d(d):
        if cmd == "H": a = [a[0] + dx]
        elif cmd == "V": a = [a[0] + dy]
        elif cmd == "A": a = a[:5] + [a[5] + dx, a[6] + dy]
        elif cmd != "Z": a = [v + (dx if k % 2 == 0 else dy) for k, v in enumerate(a)]
        parts.append(cmd + " ".join(fmt(v) for v in a) if cmd in "HV" else cmd + (" ".join(fmt(v) for v in a)))
    s = ""
    for p in parts:
        s += p
    return s


def elements(text):
    for m in re.finditer(r"<(rect|path|circle)\b([^>]*?)/?>", text):
        yield m.group(1), m.group(2), m


def attr(attrs, name):
    m = re.search(r'\s' + name + r'="([^"]*)"', attrs)
    return m.group(1) if m else None


def runs(text):
    """(axis, coordinate, length, kind) per axis-aligned run; kind 'stroke' or 'solid'; plus a 45-degree flag and points."""
    out, diag, pts = [], False, []
    for tag, attrs, _ in elements(text):
        filled_only = bool(FILLED_ONLY.search(attrs))
        stroked = attr(attrs, "stroke") == "currentColor"
        kind = None if filled_only else ("stroke" if stroked else ("solid" if attr(attrs, "fill") == "currentColor" else None))
        if tag == "rect":
            x, y, w, h = (float(attr(attrs, k) or 0) for k in ("x", "y", "width", "height"))
            rx = float(attr(attrs, "rx") or 0)
            if not filled_only: pts += [(x, y), (x + w, y + h)]
            if kind:
                out += [("v", x, h - 2 * rx, kind), ("v", x + w, h - 2 * rx, kind), ("h", y, w - 2 * rx, kind), ("h", y + h, w - 2 * rx, kind)]
        elif tag == "circle":
            cx, cy, r = (float(attr(attrs, k)) for k in ("cx", "cy", "r"))
            if not filled_only: pts += [(cx - r, cy - r), (cx + r, cy + r)]
        else:
            cx = cy = sx = sy = 0.0
            for cmd, a in parse_d(attr(attrs, "d")):
                if cmd == "M":
                    cx, cy = a; sx, sy = a
                    if not filled_only: pts.append((cx, cy))
                    continue
                if cmd == "Z": nx, ny = sx, sy
                elif cmd == "H": nx, ny = a[0], cy
                elif cmd == "V": nx, ny = cx, a[0]
                else: nx, ny = a[-2], a[-1]
                if not filled_only: pts.append((nx, ny))
                if cmd in ("L", "H", "V", "Z"):
                    if nx == cx and ny != cy and kind: out.append(("v", cx, abs(ny - cy), kind))
                    elif ny == cy and nx != cx and kind: out.append(("h", cy, abs(nx - cx), kind))
                    elif abs(abs(nx - cx) - abs(ny - cy)) < 1e-3 and nx != cx:
                        k = (nx - ny) if (nx - cx) * (ny - cy) > 0 else (nx + ny)
                        if abs(k - round(k)) < 1e-3: diag = True  # only a 45-degree line already on the lattice constrains
                cx, cy = nx, ny
    return out, diag, pts


def crisp(kind, c):
    half = abs((c % 1) - 0.5) < 1e-6
    whole = abs(c - round(c)) < 1e-6
    return half if kind == "stroke" else whole


def score(rs, dx, dy):
    good = bad = 0.0
    for axis, c, L, kind in rs:
        if L < MIN: continue
        c2 = c + (dx if axis == "v" else dy)
        if crisp(kind, c2): good += L
        elif kind == "stroke" and abs(c2 - round(c2)) < 1e-6: bad += L
    return good, bad


def best(name):
    text = open(os.path.join(SRC, name + ".svg")).read()
    rs, diag, pts = runs(text)
    g0, b0 = score(rs, 0, 0)
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    cands = []
    for dx in (0, 0.5, -0.5):
        for dy in (0, 0.5, -0.5):
            if diag and ((dx - dy) % 1) != 0: continue
            if (dx or dy) and min(xs) + dx < 1.5 - 1e-6 or max(xs) + dx > 14.5 + 1e-6 or min(ys) + dy < 1.5 - 1e-6 or max(ys) + dy > 14.5 + 1e-6: continue
            g, b = score(rs, dx, dy)
            off = abs((min(xs) + max(xs)) / 2 + dx - 8) + abs((min(ys) + max(ys)) / 2 + dy - 8)
            cands.append((-g, b, off, abs(dx) + abs(dy), dx, dy))
    cands.sort()
    _, b, off, _, dx, dy = cands[0]
    g, b = score(rs, dx, dy)
    return dict(name=name, before_bad=b0, before_good=g0, dx=dx, dy=dy, after_bad=b, after_good=g, diag=diag, alias="data-alias-of" in text)


def apply(name, dx, dy):
    p = os.path.join(SRC, name + ".svg")
    text = open(p).read()

    def fix(m):
        tag, attrs = m.group(1), m.group(2)
        if tag == "rect":
            for k, d in (("x", dx), ("y", dy)):
                v = attr(attrs, k)
                if v is not None: attrs = attrs.replace(f' {k}="{v}"', f' {k}="{fmt(float(v) + d)}"', 1)
                else: attrs = f' {k}="{fmt(d)}"' + attrs
        elif tag == "circle":
            for k, d in (("cx", dx), ("cy", dy)):
                v = attr(attrs, k); attrs = attrs.replace(f' {k}="{v}"', f' {k}="{fmt(float(v) + d)}"', 1)
        else:
            d0 = attr(attrs, "d"); attrs = attrs.replace(f' d="{d0}"', f' d="{shift_d(d0, dx, dy)}"', 1)
        clip = attr(attrs, "data-clip")
        if clip:
            c = [float(v) for v in clip.split()]
            attrs = attrs.replace(f'data-clip="{clip}"', 'data-clip="' + " ".join(fmt(v + (dx if i % 2 == 0 else dy)) for i, v in enumerate(c)) + '"')
        return f"<{tag}{attrs}" + (">" if m.group(0).endswith(">") and not m.group(0).endswith("/>") else "/>")

    out = re.sub(r"<(rect|path|circle)\b([^>]*?)/>", fix, text)
    open(p, "w").write(out)


if __name__ == "__main__":
    mode, *rest = sys.argv[1:]
    if mode == "apply":
        apply(rest[0], float(rest[1]), float(rest[2])); print("shifted", rest[0], rest[1], rest[2])
    else:
        names = rest or sorted(f[:-4] for f in os.listdir(SRC) if f.endswith(".svg"))
        rows = [best(n) for n in names]
        rows = [r for r in rows if r["before_bad"] > 0]
        rows.sort(key=lambda r: -r["before_bad"])
        print(f"{len(rows)} icons with stroked runs >= {MIN} on whole pixels")
        print("blur-now  best-shift   blur-after  crisp-gain  name")
        for r in rows:
            print(f"{r['before_bad']:7.1f}   {fmt(r['dx']):>4},{fmt(r['dy']):>4}   {r['after_bad']:9.1f}  {r['after_good'] - r['before_good']:+9.1f}   {r['name']}{' (45)' if r['diag'] else ''}{' alias' if r['alias'] else ''}")


# ---- Per-part fix (2026-10-14, after F1): the frame shifts as a whole, then each other part may move half a pixel
# on its own. A part is one element; data-part groups (the page fold) move together; a filled-only element moves
# with the scored part whose box it matches best. A part with a 45-degree segment keeps dx == dy (mod 1). Moves are
# kept only if the generator's lint passes (see fix_all).

def el_info(text):
    items = []
    for tag, attrs, m in elements(text):
        rs, diag, pts = runs(f"<svg>{m.group(0)}</svg>")
        if not pts:  # filled-only elements give no points in runs(); take their raw coordinates
            sub = m.group(0).replace("data-filled=", "data-x=")
            _, diag, pts = runs(f"<svg>{sub}</svg>")
        xs = [p[0] for p in pts] or [8]; ys = [p[1] for p in pts] or [8]
        items.append(dict(tag=tag, attrs=attrs, src=m.group(0), runs=rs, diag=diag, box=(min(xs), min(ys), max(xs), max(ys)),
                          filled_only=bool(FILLED_ONLY.search(attrs)), group=attr(attrs, "data-part"),
                          size=sum(L for _, _, L, _ in rs)))
    return items


def iou(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    inter = ix * iy; ua = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter
    if ua <= 0:  # degenerate (a line): compare by distance of centres
        ca = ((a[0] + a[2]) / 2, (a[1] + a[3]) / 2); cb = ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)
        return 1 / (1 + math.hypot(ca[0] - cb[0], ca[1] - cb[1]))
    return inter / ua


SHIFTS = [(dx, dy) for dx in (0, -0.5, 0.5) for dy in (0, -0.5, 0.5)]


def plan(name):
    text = open(os.path.join(SRC, name + ".svg")).read()
    items = el_info(text)
    scored = [i for i in items if not i["filled_only"]]
    # groups: data-part members act as one
    groups = {}
    for k, it in enumerate(scored):
        groups.setdefault(it["group"] or f"#{k}", []).append(it)
    glist = list(groups.values())
    gruns = [sum((i["runs"] for i in g), []) for g in glist]
    gdiag = [any(i["diag"] for i in g) for g in glist]
    gsize = [sum(i["size"] for i in g) for g in glist]
    ok = lambda d, s: not d or ((s[0] - s[1]) % 1) == 0
    # the frame: the largest group; the global shift is its best (ties: no move, then centred)
    f = max(range(len(glist)), key=lambda k: gsize[k]) if glist else None
    def best_for(k, prefer):
        c = [(-score(gruns[k], *s)[0], score(gruns[k], *s)[1], s != prefer, abs(s[0]) + abs(s[1]), s) for s in SHIFTS if ok(gdiag[k], s)]
        return min(c)[-1]
    glob = best_for(f, (0, 0)) if f is not None else (0, 0)
    net = {}
    for k, g in enumerate(glist):
        s = glob if k == f else best_for(k, glob)
        for i in g: net[id(i)] = s
    for i in items:
        if i["filled_only"]:
            mate = max(scored, key=lambda s: iou(i["box"], s["box"])) if scored else None
            net[id(i)] = net[id(mate)] if mate else glob
    return text, items, net, glob


def write(name, text, items, net):
    out = text
    for i in items:
        dx, dy = net[id(i)]
        if not dx and not dy: continue
        tmp = f"<svg>{i['src']}</svg>"
        open("/tmp/_frames_el.svg", "w").write(tmp)
        global SRC
        old = SRC; SRC = "/tmp"; apply("_frames_el", dx, dy); SRC = old
        new = open("/tmp/_frames_el.svg").read()[5:-6]
        out = out.replace(i["src"], new, 1)
    open(os.path.join(SRC, name + ".svg"), "w").write(out)


def lint(names):
    import subprocess
    r = subprocess.run(["node", "packages/icons/scripts/generate.mjs", "--only", ",".join(names)], capture_output=True, text=True)
    return [l for l in (r.stdout + r.stderr).splitlines() if l.startswith("✗")]


def fix(name):
    """Apply the plan; if the lint fails, fall back part by part to the frame's shift, then to no change."""
    text, items, net, glob = plan(name)
    write(name, text, items, net)
    errs = lint([name])
    if not errs: return "parts", net, glob, items
    movers = [i for i in items if net[id(i)] != glob]
    for i in movers:
        net[id(i)] = glob
        write(name, text, items, net)
        if not lint([name]): return "frame+some", net, glob, items
    for i in items: net[id(i)] = glob
    write(name, text, items, net)
    if not lint([name]): return "frame", net, glob, items
    open(os.path.join(SRC, name + ".svg"), "w").write(text)
    return "reverted: " + "; ".join(errs[:2]), net, glob, items


# ---- Rigid groups: parts whose centre-lines come within ATTACH of each other are joined (their inks overlap), so they
# move as one. Separate parts sit at least a detail gap apart (2.0 between centre-lines).
ATTACH = 1.5


def arc_pts(x1, y1, rx, ry, phi, fa, fs, x2, y2, n=12):
    if rx == 0 or ry == 0: return [(x2, y2)]
    p = math.radians(phi); c, s = math.cos(p), math.sin(p)
    dx, dy = (x1 - x2) / 2, (y1 - y2) / 2
    x1p, y1p = c * dx + s * dy, -s * dx + c * dy
    lam = x1p ** 2 / rx ** 2 + y1p ** 2 / ry ** 2
    if lam > 1: rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
    num = rx ** 2 * ry ** 2 - rx ** 2 * y1p ** 2 - ry ** 2 * x1p ** 2
    den = rx ** 2 * y1p ** 2 + ry ** 2 * x1p ** 2
    co = math.sqrt(max(0, num / den)) * (-1 if fa == fs else 1)
    cxp, cyp = co * rx * y1p / ry, -co * ry * x1p / rx
    cx, cy = c * cxp - s * cyp + (x1 + x2) / 2, s * cxp + c * cyp + (y1 + y2) / 2
    a1 = math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx); a2 = math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx)
    da = a2 - a1
    if fs and da < 0: da += 2 * math.pi
    if not fs and da > 0: da -= 2 * math.pi
    return [(cx + rx * math.cos(a1 + da * t / n) * c - ry * math.sin(a1 + da * t / n) * s,
             cy + rx * math.cos(a1 + da * t / n) * s + ry * math.sin(a1 + da * t / n) * c) for t in range(1, n + 1)]


def samples(tag, attrs):
    out = []
    def seg(a, b):
        L = math.hypot(b[0] - a[0], b[1] - a[1]); n = max(1, int(L / 0.25))
        out.extend((a[0] + (b[0] - a[0]) * t / n, a[1] + (b[1] - a[1]) * t / n) for t in range(n + 1))
    if tag == "rect":
        x, y, w, h = (float(attr(attrs, k) or 0) for k in ("x", "y", "width", "height"))
        for a, b in (((x, y), (x + w, y)), ((x + w, y), (x + w, y + h)), ((x + w, y + h), (x, y + h)), ((x, y + h), (x, y))): seg(a, b)
    elif tag == "circle":
        cx, cy, r = (float(attr(attrs, k)) for k in ("cx", "cy", "r"))
        out += [(cx + r * math.cos(t / 24 * 2 * math.pi), cy + r * math.sin(t / 24 * 2 * math.pi)) for t in range(24)]
        if r < 1.25: out.append((cx, cy))
    else:
        cx = cy = sx = sy = 0.0
        for cmd, a in parse_d(attr(attrs, "d")):
            if cmd == "M": cx, cy = a; sx, sy = a; out.append((cx, cy)); continue
            if cmd == "Z": nx, ny = sx, sy
            elif cmd == "H": nx, ny = a[0], cy
            elif cmd == "V": nx, ny = cx, a[0]
            else: nx, ny = a[-2], a[-1]
            if cmd == "A": out += arc_pts(cx, cy, *a)
            elif cmd in ("C", "S", "Q"):
                ctrl = [(a[k], a[k + 1]) for k in range(0, len(a), 2)]
                pts = [(cx, cy)] + ctrl
                for t in range(1, 13):
                    u = t / 12; q = pts[:]
                    while len(q) > 1: q = [(q[k][0] * (1 - u) + q[k + 1][0] * u, q[k][1] * (1 - u) + q[k + 1][1] * u) for k in range(len(q) - 1)]
                    out.append(q[0])
            else: seg((cx, cy), (nx, ny))
            cx, cy = nx, ny
    return out


def touching(a, b):
    return any(math.hypot(p[0] - q[0], p[1] - q[1]) < ATTACH for p in a for q in b)


def plan(name):  # replaces the first plan(): groups are data-part groups joined by attachment
    text = open(os.path.join(SRC, name + ".svg")).read()
    items = el_info(text)
    for i in items: i["pts"] = samples(i["tag"], i["attrs"])
    scored = [i for i in items if not i["filled_only"]]
    parent = list(range(len(scored)))
    def find(k):
        while parent[k] != k: k = parent[k]
        return k
    for a in range(len(scored)):
        for b in range(a + 1, len(scored)):
            same = scored[a]["group"] and scored[a]["group"] == scored[b]["group"]
            if same or touching(scored[a]["pts"], scored[b]["pts"]): parent[find(a)] = find(b)
    groups = {}
    for k, it in enumerate(scored): groups.setdefault(find(k), []).append(it)
    glist = list(groups.values())
    gruns = [sum((i["runs"] for i in g), []) for g in glist]
    gdiag = [any(i["diag"] for i in g) for g in glist]
    gsize = [sum(i["size"] for i in g) for g in glist]
    ok = lambda d, s: not d or ((s[0] - s[1]) % 1) == 0
    f = max(range(len(glist)), key=lambda k: gsize[k]) if glist else None
    def best_for(k, prefer):
        c = [(-score(gruns[k], *s)[0], score(gruns[k], *s)[1], s != prefer, abs(s[0]) + abs(s[1]), s) for s in SHIFTS if ok(gdiag[k], s)]
        return min(c)[-1]
    glob = best_for(f, (0, 0)) if f is not None else (0, 0)
    net = {}
    for k, g in enumerate(glist):
        s = glob if k == f else best_for(k, glob)
        for i in g: net[id(i)] = s
    for i in items:
        if i["filled_only"]:
            mate = max(scored, key=lambda s: iou(i["box"], s["box"])) if scored else None
            net[id(i)] = net[id(mate)] if mate else glob
    return text, items, net, glob


def fix(name):  # replaces the first fix(): a filled-only element always follows the part it belongs to
    text, items, net, glob = plan(name)
    scored = [i for i in items if not i["filled_only"]]
    mates = {id(i): max(scored, key=lambda s: iou(i["box"], s["box"])) for i in items if i["filled_only"] and scored}
    def sync():
        for i in items:
            if i["filled_only"]: net[id(i)] = net[id(mates[id(i)])] if id(i) in mates else glob
    def attempt():
        sync(); write(name, text, items, net); return not lint([name])
    if attempt(): return "parts", net, glob, items
    for i in [i for i in scored if net[id(i)] != glob]:
        net[id(i)] = glob
        if attempt(): return "frame+some", net, glob, items
    for i in scored: net[id(i)] = glob
    if attempt(): return "frame", net, glob, items
    errs = lint([name])
    open(os.path.join(SRC, name + ".svg"), "w").write(text)
    return "reverted: " + "; ".join(errs[:2]), net, glob, items


# ---- Final plan / fix (2026-10-14, third version; earlier definitions above are superseded).
# Twins: a filled-only element follows the scored element its samples lie closest to (mean nearest distance), so a
# gap follows its ring and a fill its outline. Rollback works on whole attached groups. An icon that ends no crisper
# than it began is restored.

def _mean_dist(a, b):
    return sum(min(math.hypot(p[0] - q[0], p[1] - q[1]) for q in b) for p in a) / max(1, len(a))


def plan3(name, text=None):
    text = text if text is not None else open(os.path.join(SRC, name + ".svg")).read()
    items = el_info(text)
    for i in items: i["pts"] = samples(i["tag"], i["attrs"])
    scored = [i for i in items if not i["filled_only"]]
    parent = list(range(len(scored)))
    def find(k):
        while parent[k] != k: k = parent[k]
        return k
    for a in range(len(scored)):
        for b in range(a + 1, len(scored)):
            same = scored[a]["group"] and scored[a]["group"] == scored[b]["group"]
            if same or touching(scored[a]["pts"], scored[b]["pts"]): parent[find(a)] = find(b)
    groups = {}
    for k, it in enumerate(scored): groups.setdefault(find(k), []).append(it)
    glist = list(groups.values())
    gruns = [sum((i["runs"] for i in g), []) for g in glist]
    gdiag = [any(i["diag"] for i in g) for g in glist]
    gsize = [sum(i["size"] for i in g) for g in glist]
    ok = lambda d, s: not d or ((s[0] - s[1]) % 1) == 0
    f = max(range(len(glist)), key=lambda k: gsize[k]) if glist else None
    def best_for(k, prefer):
        c = [(-score(gruns[k], *s)[0], score(gruns[k], *s)[1], s != prefer, abs(s[0]) + abs(s[1]), s) for s in SHIFTS if ok(gdiag[k], s)]
        return min(c)[-1]
    glob = best_for(f, (0, 0)) if f is not None else (0, 0)
    gshift = [glob if k == f else best_for(k, glob) for k in range(len(glist))]
    mates = {}
    for i in items:
        if i["filled_only"] and scored:
            mates[id(i)] = min(range(len(glist)), key=lambda k: min(_mean_dist(i["pts"], s["pts"]) for s in glist[k]))
    return text, items, glist, gshift, glob, mates, f


def _net(items, glist, gshift, glob, mates):
    net = {}
    for k, g in enumerate(glist):
        for i in g: net[id(i)] = gshift[k]
    for i in items:
        if i["filled_only"]: net[id(i)] = gshift[mates[id(i)]] if id(i) in mates else glob
    return net


def blur(text):
    return score(runs(text)[0], 0, 0)[1]


def fix3(name, original):
    text, items, glist, gshift, glob, mates, f = plan3(name, original)
    gdiag = [any(it["diag"] for it in g) for g in glist]
    home = lambda k: glob if (not gdiag[k] or ((glob[0] - glob[1]) % 1) == 0) else (0, 0)  # a constrained group can't take a one-axis shift
    def attempt():
        write(name, text, items, _net(items, glist, gshift, glob, mates)); return not lint([name])
    outcome = None
    if attempt(): outcome = "parts"
    else:
        for k in [k for k in range(len(glist)) if gshift[k] != glob]:
            gshift[k] = home(k)
            if attempt(): outcome = "frame+some"; break
        else:
            gshift = [home(k) for k in range(len(glist))]
            if attempt(): outcome = "frame"
    now = open(os.path.join(SRC, name + ".svg")).read()
    if outcome is None or blur(now) >= blur(original) - 1e-6:
        open(os.path.join(SRC, name + ".svg"), "w").write(original)
        return outcome and "no gain" or "reverted: " + "; ".join(lint([name])[:1]), blur(original), blur(original)
    return outcome, blur(original), blur(now)


def rigidity(before, after):
    """Problems where parts that belonged together moved apart: [(kind, i, j)]. Elements must match one to one."""
    a, b = el_info(before), el_info(after)
    if len(a) != len(b): return [("count", len(a), len(b))]
    for i in a + b: i["pts"] = samples(i["tag"], i["attrs"])
    disp = [(round(y["pts"][0][0] - x["pts"][0][0], 3), round(y["pts"][0][1] - x["pts"][0][1], 3)) for x, y in zip(a, b)]
    probs = []
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if disp[i] == disp[j]: continue
            if a[i]["filled_only"] or a[j]["filled_only"]:
                # a twin and the element it lies on (coincident or nearly)
                if _mean_dist(a[i]["pts"], a[j]["pts"]) < 0.3 or _mean_dist(a[j]["pts"], a[i]["pts"]) < 0.3: probs.append(("twin", i, j))
            elif touching(a[i]["pts"], a[j]["pts"]) or (a[i]["group"] and a[i]["group"] == a[j]["group"]): probs.append(("attached", i, j))
    return probs


# ---- Slash icons: the shared slash M2 2L14 14 and its parallel cuts stay; everything else slides along the slash
# (dx == dy), which leaves every one-sided cut on the same line, so the filled variant stays exact.
def _on_slash(i):
    pts = samples(i["tag"], i["attrs"])
    return len(pts) > 4 and all(abs(p[0] - p[1]) < 2.0 for p in pts) and max(p[0] for p in pts) - min(p[0] for p in pts) > 8


def slash_fix(name):
    p = os.path.join(SRC, name + ".svg"); text = open(p).read()
    items = el_info(text)
    fixed = [i for i in items if _on_slash(i)]
    movers = [i for i in items if i not in fixed]
    rs = sum((i["runs"] for i in movers if not i["filled_only"]), [])
    cands = sorted(((-score(rs, d, d)[0], abs(d), d) for d in (0, -0.5, 0.5)))
    _, _, d = cands[0]
    if not d or score(rs, d, d)[1] >= score(rs, 0, 0)[1]: return "no gain", 0
    net = {id(i): ((0, 0) if i in fixed else (d, d)) for i in items}
    write(name, text, items, net)
    if lint([name]):
        open(p, "w").write(text); return "reverted: " + "; ".join(lint([name])[:1]), 0
    return "slid", d


def slash_fix(name):  # replaces the first: both directions, best first; a square-keyline icon may take the circle keyline
    p = os.path.join(SRC, name + ".svg"); text = open(p).read()
    items = el_info(text)
    fixed = [i for i in items if _on_slash(i)]
    rs = sum((i["runs"] for i in items if i not in fixed and not i["filled_only"]), [])
    base = score(rs, 0, 0)[1]
    for d in sorted((-0.5, 0.5), key=lambda d: score(rs, d, d)[1]):
        if score(rs, d, d)[1] >= base: continue
        for keyline in (None, "circle"):
            src = text if not keyline else re.sub(r'data-keyline="square"', 'data-keyline="circle"', text, 1)
            if keyline and src == text: continue
            its = el_info(src); fx = [i for i in its if _on_slash(i)]
            write(name, src, its, {id(i): ((0, 0) if i in fx else (d, d)) for i in its})
            if not lint([name]): return "slid" + (" + circle keyline" if keyline else ""), d
    open(p, "w").write(text)
    return "no fit", 0


# ---- Slide: one element with a whole-pixel run moves half a pixel across that run (a divider, a rule, a column line),
# keeping every contact it had (it slides along the edges it touches), its coincident filled-only twins with it.
def _contacts(items, k):
    return {j for j, o in enumerate(items) if j != k and not o["filled_only"] and touching(items[k]["pts"], o["pts"])}


def slide_parts(name):
    p = os.path.join(SRC, name + ".svg")
    done = []
    for _ in range(6):  # a few rounds: one slide may open the way for another
        text = open(p).read(); before = blur(text)
        if not before: break
        items = el_info(text)
        for i in items: i["pts"] = samples(i["tag"], i["attrs"])
        progress = False
        for k, it in enumerate(items):
            if it["filled_only"]: continue
            bad = [(a, c) for a, c, L, kind in it["runs"] if kind == "stroke" and L >= 2 and abs(c - round(c)) < 1e-6]
            if not bad: continue
            twins = [j for j, o in enumerate(items) if o["filled_only"] and _mean_dist(o["pts"], it["pts"]) < 0.3]
            had = _contacts(items, k)
            for axis in {a for a, _ in bad}:
                for d in (-0.5, 0.5):
                    s = (d, 0) if axis == "v" else (0, d)
                    if it["diag"] and ((s[0] - s[1]) % 1): continue
                    net = {id(o): (s if j == k or j in twins else (0, 0)) for j, o in enumerate(items)}
                    write(name, text, items, net)
                    new = open(p).read()
                    ni = el_info(new)
                    for o in ni: o["pts"] = samples(o["tag"], o["attrs"])
                    if _contacts(ni, k) != had or blur(new) >= before - 1e-6 or lint([name]):
                        open(p, "w").write(text); continue
                    done.append((k, s)); progress = True; break
                if progress: break
            if progress: break
        if not progress: break
    return done


def _coincident(items):
    """Pairs of (element, element, axis, coordinate) whose axis runs lie on one line and overlap: shared edges."""
    out = set()
    segs = []
    for k, it in enumerate(items):
        if it["filled_only"]: continue
        for a, c, L, kind in it["runs"]:
            segs.append((k, a, round(c, 3)))
    for x in range(len(segs)):
        for y in range(x + 1, len(segs)):
            if segs[x][0] != segs[y][0] and segs[x][1:] == segs[y][1:]: out.add((min(segs[x][0], segs[y][0]), max(segs[x][0], segs[y][0]), segs[x][1]))
    return out


_slide_parts_v1 = slide_parts


def slide_parts(name):  # replaces the first: a slide must also keep every shared edge shared
    p = os.path.join(SRC, name + ".svg")
    global lint
    real_lint = lint
    def guarded(names):
        errs = real_lint(names)
        if errs: return errs
        after = el_info(open(p).read())
        if _coincident(after) != _coincident(guarded.before): return ["shared edge broken"]
        return []
    done = []
    for _ in range(6):
        guarded.before = el_info(open(p).read())
        lint = guarded
        try: step = _slide_parts_v1.__wrapped__(name) if hasattr(_slide_parts_v1, "__wrapped__") else _one_slide(name)
        finally: lint = real_lint
        if not step: break
        done += step
    return done


def _one_slide(name):
    """One accepted slide (or none), same rules as the first slide_parts, single round."""
    p = os.path.join(SRC, name + ".svg")
    text = open(p).read(); before = blur(text)
    if not before: return []
    items = el_info(text)
    for i in items: i["pts"] = samples(i["tag"], i["attrs"])
    for k, it in enumerate(items):
        if it["filled_only"]: continue
        bad = [(a, c) for a, c, L, kind in it["runs"] if kind == "stroke" and L >= 2 and abs(c - round(c)) < 1e-6]
        if not bad: continue
        twins = [j for j, o in enumerate(items) if o["filled_only"] and _mean_dist(o["pts"], it["pts"]) < 0.3]
        had = _contacts(items, k)
        for axis in {a for a, _ in bad}:
            for d in (-0.5, 0.5):
                s = (d, 0) if axis == "v" else (0, d)
                if it["diag"] and ((s[0] - s[1]) % 1): continue
                write(name, text, items, {id(o): (s if j == k or j in twins else (0, 0)) for j, o in enumerate(items)})
                new = open(p).read(); ni = el_info(new)
                for o in ni: o["pts"] = samples(o["tag"], o["attrs"])
                if _contacts(ni, k) != had or blur(new) >= before - 1e-6 or lint([name]):
                    open(p, "w").write(text); continue
                return [(k, s)]
    return []


def _ends(it):
    """Free ends of an element's subpaths (path M points and the points before the next M or the end)."""
    if it["tag"] != "path": return []
    out, cur, start = [], None, None
    for cmd, a in parse_d(attr(it["attrs"], "d")):
        if cmd == "M":
            if cur: out.append(cur)
            start = (a[0], a[1]); out.append(start); cur = start; continue
        if cmd == "Z": cur = None; out.pop() if out and out[-1] == start else None; continue
        if cmd == "H": cur = (a[0], cur[1])
        elif cmd == "V": cur = (cur[0], a[0])
        else: cur = (a[-2], a[-1])
    if cur: out.append(cur)
    return out


def _incidence(items):
    """(end owner, end index, element it lies on): every free end that sits on another element's centre-line."""
    dense = []
    for it in items:
        pts = []
        src = samples(it["tag"], it["attrs"])
        for a, b in zip(src, src[1:]):
            n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 0.05))
            pts += [(a[0] + (b[0] - a[0]) * t / n, a[1] + (b[1] - a[1]) * t / n) for t in range(n)]
        dense.append(pts + src[-1:])
    out = set()
    for k, it in enumerate(items):
        if it["filled_only"]: continue
        for e, p in enumerate(_ends(it)):
            for j, o in enumerate(items):
                if j != k and not o["filled_only"] and any(math.hypot(p[0] - q[0], p[1] - q[1]) < 0.06 for q in dense[j]): out.add((k, e, j))
    return out


def slide_parts(name):  # replaces the second: shared edges and incidences must both survive
    p = os.path.join(SRC, name + ".svg")
    global lint
    real_lint = lint
    def guarded(names):
        errs = real_lint(names)
        if errs: return errs
        after = el_info(open(p).read())
        if _coincident(after) != _coincident(guarded.before) or _incidence(after) != _incidence(guarded.before): return ["structure broken"]
        return []
    done = []
    for _ in range(6):
        guarded.before = el_info(open(p).read())
        lint = guarded
        try: step = _one_slide(name)
        finally: lint = real_lint
        if not step: break
        done += step
    return done


# ---- Symmetry beats 1x for inner parts: a part centred on another part (its container) or on the drawing, along the
# slide's axis, stays put (a store's door, a clock's hands, a scale's post, equal columns).
def _centred(items, k, axis):
    lo, hi = (0, 2) if axis == "v" else (1, 3)
    box = items[k]["box"]; c = (box[lo] + box[hi]) / 2
    others = [o["box"] for j, o in enumerate(items) if j != k and not o["filled_only"]]
    allb = [o["box"] for o in items if not o["filled_only"]]
    whole = (min(b[lo] for b in allb) + max(b[hi] for b in allb)) / 2
    return abs(c - whole) < 0.01 or any(abs(c - (b[lo] + b[hi]) / 2) < 0.01 and b[hi] - b[lo] > box[hi] - box[lo] for b in others)


_one_slide_v1 = _one_slide


def _one_slide(name):  # replaces the first: skips centred parts
    p = os.path.join(SRC, name + ".svg")
    text = open(p).read(); before = blur(text)
    if not before: return []
    items = el_info(text)
    for i in items: i["pts"] = samples(i["tag"], i["attrs"])
    for k, it in enumerate(items):
        if it["filled_only"]: continue
        bad = [(a, c) for a, c, L, kind in it["runs"] if kind == "stroke" and L >= 2 and abs(c - round(c)) < 1e-6]
        if not bad: continue
        twins = [j for j, o in enumerate(items) if o["filled_only"] and _mean_dist(o["pts"], it["pts"]) < 0.3]
        had = _contacts(items, k)
        for axis in {a for a, _ in bad}:
            if _centred(items, k, axis): continue
            for d in (-0.5, 0.5):
                s = (d, 0) if axis == "v" else (0, d)
                if it["diag"] and ((s[0] - s[1]) % 1): continue
                write(name, text, items, {id(o): (s if j == k or j in twins else (0, 0)) for j, o in enumerate(items)})
                new = open(p).read(); ni = el_info(new)
                for o in ni: o["pts"] = samples(o["tag"], o["attrs"])
                if _contacts(ni, k) != had or blur(new) >= before - 1e-6 or lint([name]):
                    open(p, "w").write(text); continue
                return [(k, s)]
    return []


def move_elements(name, shifts, text=None):
    """shifts: {element index: (dx, dy)}; returns lint errors (the file is left written)."""
    p = os.path.join(SRC, name + ".svg"); text = text if text is not None else open(p).read()
    items = el_info(text)
    write(name, text, items, {id(it): shifts.get(k, (0, 0)) for k, it in enumerate(items)})
    return lint([name])
