"""Measure and render licensed faces in memory, for evaluation only; no font file is written or copied."""
import sys, json, io, base64
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, sys.argv[2])
from stemlib import slice_  # same slice as stem.py

EXT = "ąćęłńśźżőűşğıčřžěůñçãõåøæœß€№"
GEIST = dict(x=.530, stem=.084, s5=.106, s6=.128)

def inst(path, wght, mono=None):
    f = TTFont(path)
    if 'fvar' in f:
        loc = {}
        for a in f['fvar'].axes:
            if a.axisTag == 'wght': loc['wght'] = max(a.minValue, min(a.maxValue, wght))
            elif a.axisTag == 'MONO': loc['MONO'] = mono if mono is not None else a.minValue
            elif a.axisTag in ('slnt', 'DRKM'): loc[a.axisTag] = 0
        f = instancer.instantiateVariableFont(f, loc, inplace=False) if loc else f
    return f

def measure(f):
    upm = f['head'].unitsPerEm; cm = f.getBestCmap(); gs = f.getGlyphSet()
    def top(ch):
        p = BoundsPen(gs); gs[cm[ord(ch)]].draw(p); return p.bounds[3] / upm
    x, cap = top('x'), top('H')
    xs = slice_(f, 'l', x * upm * .5); stem = (xs[1] - xs[0]) / upm
    adv = sum(f['hmtx'][cm[ord(c)]][0] for c in 'abcdefghijklmnopqrstuvwxyz') / 26 / upm
    return dict(x=round(x, 3), cap=round(cap, 3), width=round(adv, 3), stem=round(stem / GEIST['stem'], 2),
                glyphs=len(f.getGlyphOrder()), ext=sum(ord(c) in cm for c in EXT))

out = []
for line in open(sys.argv[1], encoding='utf-8'):
    id_, name, foundry, kind, path = line.rstrip('\n').split('\t')
    base = TTFont(path)
    axes = {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in base['fvar'].axes} if 'fvar' in base else {}
    m = measure(inst(path, 400))
    r = dict(id=id_, name=name, foundry=foundry, kind=kind, axes=' '.join(f"{k} {v[0]:g}–{v[2]:g}" for k, v in axes.items()), **m)
    if 'wght' in axes:  # strong and emphasis weights matched to Geist's stem steps, as in the README
        st = {w: measure(inst(path, w))['stem'] for w in (400, 500, 600)}
        def wfor(ratio):
            t = st[400] * ratio
            return 400 + 100 * (t - st[400]) / (st[500] - st[400]) if t <= st[500] else 500 + 100 * (t - st[500]) / (st[600] - st[500])
        r['strong'] = round(wfor(GEIST['s5'] / GEIST['stem']) / 10) * 10
        r['emph'] = round(wfor(GEIST['s6'] / GEIST['stem']) / 10) * 10
    # Specimen image, 2x: display line, title, UI label and body on Area's type-13 ramp.
    K = 2; W = 520 * K
    big = 46 if kind != 'mono' else 30
    lines = [("Make it yours" if kind != 'mono' else "Rag aegt Gy 1470", big, 0),
             ("Title of the page", 22, 0),
             ("Body text sets the reading size, open shapes,", 15, 1),
             ("figures that line up 1,284.50, and Il1 0O.", 15, 1)]
    h = sum(int(s * 1.45) for _, s, _ in lines) + 24
    im = Image.new("RGBA", (W, h * K), (0, 0, 0, 0)); d = ImageDraw.Draw(im); y = 8 * K
    for text, size, muted in lines:
        fnt = ImageFont.truetype(path, size * K)
        try:
            names = [n.decode() if isinstance(n, bytes) else n for n in fnt.get_variation_axes() and []]
            vals = []
            for a in fnt.get_variation_axes():
                nm = (a['name'].decode() if isinstance(a['name'], bytes) else a['name']).lower()
                tag = 'wght' if nm in ('weight', 'wght') else 'slnt' if nm in ('slant', 'slnt') else 'MONO' if nm in ('mono', 'monospace') else None
                vals.append(400 if tag == 'wght' and a['minimum'] <= 400 <= a['maximum'] else (a['minimum'] if tag == 'MONO' else 0 if tag == 'slnt' else a['default']))
            if vals: fnt.set_variation_by_axes(vals)
        except Exception: pass
        d.text((0, y), text, font=fnt, fill=(13, 13, 13, 255) if not muted else (60, 60, 60, 255))
        y += int(size * 1.45) * K
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    r['img'] = base64.b64encode(buf.getvalue()).decode(); r['imgw'] = 520; r['imgh'] = h
    out.append(r)
    print(f"{name:22} {foundry:16} x {m['x']} cap {m['cap']} w {m['width']} stem {m['stem']} glyphs {m['glyphs']} ext {m['ext']}/29 strong {r.get('strong','-')} emph {r.get('emph','-')} img {len(r['img'])//1024}KB | {r['axes']}")
json.dump(out, open(sys.argv[3], 'w'))
