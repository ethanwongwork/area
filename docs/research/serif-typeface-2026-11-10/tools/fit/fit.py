"""Fit: the white beside each glyph and between each pair, Area Serif against Georgia Pro and Serrif (numbers only).

Every face is brought to Area's heights (the lowercase by x-height, capitals and figures by cap height), then:

  side    a glyph's optical side bearing: the mean, over the rows where it has ink in its zone, of the white from
          the advance edge to the ink, each row counted no deeper than DEPTH behind the glyph's outermost ink on
          that side (so a stem behind its serifs counts in full, and an open side, c r T, counts as open but not
          bottomless). Left and right. Reported against the face's own control (n, H, zero), so a
          looser or tighter face compares like with like.
  pair    the white between two glyphs as set, kerning included (HarfBuzz): the mean over the rows where both have
          ink of the white between them, each row no deeper than 2 DEPTH. Reported against the face's control pair
          (nn, HH, Hn, nH).

Run from typefaces/area-serif:  fit.py measure out.json [area.ttf]   then   fit.py sides out.json | pairs out.json"""
import sys, os, io, json, string
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import lib
from fontTools.ttLib import TTFont
import uharfbuzz as hb
STEP = 10
DEPTH = {"l": 80, "u": 105}      # 0.15 of the x-height and of the cap height
LC, UC, FIG = string.ascii_lowercase, string.ascii_uppercase, "0123456789"
PUNCT = ".,:;!?-–—'\"‘’“”()/"
def faces(area):
    return [("Area", TTFont(area)), ("Georgia", lib.georgia("Regular")), ("Serrif", lib.serrif())]
def scale_of(f, ch):
    upm = f["head"].unitsPerEm
    xh, cap = f["OS/2"].sxHeight, f["OS/2"].sCapHeight
    return (520 / xh) if (ch in LC or ch in PUNCT) else (712 / cap)
def profile(f, ch, s):
    """{row: (left white, right white)} in Area's units; rows are Area's y, every STEP from -240 to 800."""
    name = f.getBestCmap().get(ord(ch))
    if name is None: return None
    g = lib.G(f, name); out = {}
    for y in range(-240, 801, STEP):
        sp = g.h((y + 3.7) / s)
        if sp: out[y] = (sp[0][0] * s, (g.adv - sp[-1][1]) * s)
    return out
def kern(font_hb, f, a, b):
    buf = hb.Buffer(); buf.add_str(a + b); buf.guess_segment_properties(); hb.shape(font_hb, buf, {"kern": True, "liga": False})
    if len(buf.glyph_infos) != 2: return 0
    gs = f.getGlyphSet(); name = f.getGlyphName(buf.glyph_infos[0].codepoint)
    return buf.glyph_positions[0].x_advance - gs[name].width + buf.glyph_positions[1].x_offset
def zone(ch):
    return (10, 510) if ch in LC else (10, 700) if ch in UC + FIG else None
def capped(p, ch, rows=None):
    """{row: (left, right)} with each side no deeper than DEPTH behind the outermost ink of the glyph's zone rows."""
    z = zone(ch)
    zr = [y for y in p if z is None or z[0] <= y <= z[1]] or list(p)
    D = DEPTH["l" if (ch in LC or ch in PUNCT) else "u"]
    lo = [min(p[y][i] for y in zr) for i in (0, 1)]
    return {y: tuple(min(lo[i] + D, p[y][i]) for i in (0, 1)) for y in p}
def side(p, ch):
    z = zone(ch)
    c = capped(p, ch)
    rows = [v for y, v in c.items() if z is None or z[0] <= y <= z[1]]
    if not rows: return None
    return [sum(r[i] for r in rows) / len(rows) for i in (0, 1)]
def pair(pa, pb, k, a, b):
    ca, cb = capped(pa, a), capped(pb, b)
    rows = [y for y in pa if y in pb]
    if not rows: return None
    return sum(ca[y][1] + cb[y][0] + k for y in rows) / len(rows), min(pa[y][1] + pb[y][0] + k for y in rows)
def measure(out, area):
    res = {}
    chars = LC + UC + FIG + PUNCT
    for label, f in faces(area):
        b = io.BytesIO(); f.save(b); hbf = hb.Font(hb.Face(b.getvalue()))
        prof = {c: profile(f, c, scale_of(f, c)) for c in chars}
        sides = {c: side(prof[c], c) for c in chars if prof[c]}
        pairs = {}
        sets = [(LC, LC), (UC, LC), (UC, UC), (LC, UC), (LC + UC, PUNCT), (PUNCT, LC + UC), (FIG, FIG), (FIG, ".,:-–/"), (".,:-–/", FIG)]
        for A, B in sets:
            for a in A:
                for c in B:
                    if not prof.get(a) or not prof.get(c): continue
                    s = scale_of(f, a) if a in LC else scale_of(f, c) if c in LC else scale_of(f, a)
                    k = kern(hbf, f, a, c) * s
                    r = pair(prof[a], prof[c], k, a, c)
                    if r: pairs[a + c] = [round(r[0], 1), round(r[1], 1), round(k, 1)]
        res[label] = {"sides": {c: [round(v, 1) for v in s] for c, s in sides.items() if s}, "pairs": pairs,
                      "adv": {c: round(lib.G(f, f.getBestCmap()[ord(c)]).adv * scale_of(f, c), 1) for c in chars if prof[c]},
                      "space": round(f.getGlyphSet()[f.getBestCmap()[32]].width * 520 / f["OS/2"].sxHeight, 1)}
    json.dump(res, open(out, "w"), ensure_ascii=False)
def control(c):
    return "n" if c in LC or c in PUNCT else "H" if c in UC else "0"
def sides(path):
    d = json.load(open(path)); rows = []
    for c in d["Area"]["sides"]:
        if any(c not in d[f]["sides"] for f in d): continue
        rel = {}
        for f in d:
            ctl = sum(d[f]["sides"][control(c)]) / 2
            rel[f] = [d[f]["sides"][c][i] - ctl for i in (0, 1)]
        for i, nm in ((0, "left"), (1, "right")):
            dg, ds = rel["Area"][i] - rel["Georgia"][i], rel["Area"][i] - rel["Serrif"][i]
            fix = 0 if dg * ds <= 0 else -min(dg, ds, key=abs)
            rows.append((c, nm, round(d["Area"]["sides"][c][i], 1), round(rel["Area"][i], 1), round(rel["Georgia"][i], 1), round(rel["Serrif"][i], 1), round(fix)))
    return rows
def pairs(path):
    d = json.load(open(path)); rows = []
    def ctl(f, p):
        a, b = control(p[0]), control(p[1])
        if "0" in (a, b): a = b = "0"
        return d[f]["pairs"][a + b][0]
    for p, (g, mn, k) in d["Area"]["pairs"].items():
        if any(p not in d[f]["pairs"] for f in d): continue
        rel = {f: d[f]["pairs"][p][0] - ctl(f, p) for f in d}
        dg, ds = rel["Area"] - rel["Georgia"], rel["Area"] - rel["Serrif"]
        fix = 0 if dg * ds <= 0 else -min(dg, ds, key=abs)
        rows.append((p, round(rel["Area"], 1), round(rel["Georgia"], 1), round(rel["Serrif"], 1), round(fix), k, mn, d["Georgia"]["pairs"][p][2], d["Serrif"]["pairs"][p][2]))
    return rows
if __name__ == "__main__":
    if sys.argv[1] == "measure":
        measure(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "build/AreaSerif-Regular.ttf")
    elif sys.argv[1] == "sides":
        print("glyph side   Area  rel: Area Georgia Serrif   move")
        for r in sides(sys.argv[2]): print(f"{r[0]}  {r[1]:<5} {r[2]:>6}  {r[3]:>6} {r[4]:>6} {r[5]:>6}   {r[6]:+d}" if r[6] else f"{r[0]}  {r[1]:<5} {r[2]:>6}  {r[3]:>6} {r[4]:>6} {r[5]:>6}")
    elif sys.argv[1] == "pairs":
        th = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        rs = sorted((r for r in pairs(sys.argv[2]) if abs(r[4]) >= th), key=lambda r: r[4])
        print(f"{len(rs)} pairs off both references by {th} or more (rel: Area Georgia Serrif; move; kern now; closest; kern Georgia Serrif)")
        for r in rs: print(f"{r[0]}  {r[1]:>6} {r[2]:>6} {r[3]:>6}  {r[4]:+4d}   k {r[5]:>5}  min {r[6]:>5}   {r[7]:>5} {r[8]:>5}")

# ---------------------------------------------------------------------------------------------- kerning from the fit
KERN_MIN = 8          # a pair moves when it stands this far outside both references' fit
def kern_table(path, ufo_path, out):
    """Writes typefaces/area-serif/fit_kerning.json: for every measured pair that stands outside both references by
    KERN_MIN or more, the kerning that brings it to the nearer one. A value goes on the key that sets the pair today
    (a group pair, or an exception), else on the pair's groups; pairs that share a key share the mean of their
    targets. Figures are left out (Georgia Pro's default figures are old-style: not like for like)."""
    import ufoLib2
    from fontTools.ufoLib.kerning import lookupKerningValue
    u = ufoLib2.Font.open(ufo_path)
    name = {}
    for g in u:
        for cp in g.unicodes: name.setdefault(chr(cp), g.name)
    g1 = {m: k for k, ms in u.groups.items() if k.startswith("public.kern1.") for m in ms}
    g2 = {m: k for k, ms in u.groups.items() if k.startswith("public.kern2.") for m in ms}
    def key(a, b):
        cands = [(a, b), (a, g2.get(b)), (g1.get(a), b), (g1.get(a), g2.get(b))]
        for c in cands:
            if None not in c and c in u.kerning: return c
        return (g1.get(a, a), g2.get(b, b))
    want = {}
    for p, ra, rg, rs, mv, k, mn, kg, ks in pairs(path):
        if p[0] in FIG or p[1] in FIG or p[0] not in name or p[1] not in name: continue
        a, b = name[p[0]], name[p[1]]
        now = lookupKerningValue((a, b), u.kerning, u.groups) or 0
        want.setdefault(key(a, b), []).append((now + (mv if abs(mv) >= KERN_MIN else 0), mv, p))
    table = []
    for kk, vs in sorted(want.items()):
        if not any(abs(v[1]) >= KERN_MIN for v in vs): continue
        t = round(sum(v[0] for v in vs) / len(vs)); now = u.kerning.get(kk, 0)
        if abs(t) < 4: t = 0
        if abs(t - now) >= 4: table.append([kk[0], kk[1], t])
    json.dump({"note": "tools/fit/fit.py kern: kerning that brings each measured pair inside both references' fit", "pairs": table},
              open(out, "w"), ensure_ascii=False, indent=0)
    print(len(table), "kerning values written;", sum(1 for t in table if t[2] == 0), "of them clear a pair")
if __name__ == "__main__" and sys.argv[1] == "kern":
    kern_table(sys.argv[2], "build/AreaSerif-Regular.ufo", sys.argv[3] if len(sys.argv) > 3 else "fit_kerning.json")
