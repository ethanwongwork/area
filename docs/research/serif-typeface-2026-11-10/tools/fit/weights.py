"""Fit across weight (0.81): how side bearings and the white between pairs change from Regular to Light and Bold in
the references, read with fit.py's own measures (numbers only; no reference outline or kerning value is kept).

Faces: Georgia Pro (Light, Regular, Bold statics), Serrif (variable, wght 300/400/700), Source Serif 4 (opsz 20) and
Literata (opsz 12), the two from $EVAL_FONTS, and Area Serif's variable font instanced at the same weights.
Everything is brought to Area's heights as fit.py does (lowercase by x-height, capitals by cap height).

Per face and weight:
  stem, counter   n's stem and counter at 0.45 of the x-height; H's at 0.25 of the cap height
  hair            o's hairline at its top
  zone bearings   n o H O, to the outermost ink in the letter's zone (spacing.py's REFERENCE reading)
  white           fit.py's pair white (kerning included) of every pair fit.py measures
  rel             a pair's white less its control's (nn, HH, Hn, nH), the quantity fit.py kerns by
  slope           rel at the weight against rel at 400 over every pair with |rel 400| >= 12 (least squares through 0)
  closest         fit.py's least white of a pair (ink to ink, any row): the 2nd percentile over the near pairs

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/fit/weights.py [build/AreaSerif[wght].ttf] > out.txt
Writes build/kern-081/weights.json (the numbers above, per face and weight)."""
import io
import json
import os
import statistics as st
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, ".."))
import fit as FIT  # noqa: E402
import lib  # noqa: E402
import uharfbuzz as hb  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from fontTools.varLib.instancer import instantiateVariableFont  # noqa: E402

W = (300, 400, 700)
STANDARD = ["nn", "oo", "no", "on", "nu", "HH", "HO", "OH", "OO", "AV", "VA", "To", "Ty", "Ta", "Te", "Wa", "Yo",
            "LT", "LV", "P.", "r.", "r,", "y.", "v,", "f)", "f?", "f'", "rn", "ry", "av", "vo", "AT", "TA", "FA", "L'"]


def _vf(path, **fixed):
    return lambda w: instantiateVariableFont(TTFont(path), dict(fixed, wght=w), inplace=True)


def faces(area):
    ev = os.environ.get("EVAL_FONTS", "build/eval-fonts")
    out = {"Georgia Pro": lambda w: lib.georgia({300: "Light", 400: "Regular", 700: "Bold"}[w]),
           "Serrif": _vf(lib.F + "SerrifCollectionVF-TRIAL.ttf", wdth=100, slnt=0),
           "Source Serif 4": _vf(os.path.join(ev, "SourceSerif4.ttf"), opsz=20),
           "Literata": _vf(os.path.join(ev, "Literata.ttf"), opsz=12)}
    if area:
        out["Area"] = _vf(area)
    return out


def spans_h(f, ch, y, s):
    g = lib.G(f, f.getBestCmap()[ord(ch)])
    return [(a * s, b * s) for a, b in g.h(y / s)], g


def parts(f):
    sl, su = FIT.scale_of(f, "n"), FIT.scale_of(f, "H")
    n, _ = spans_h(f, "n", 0.45 * 520, sl)
    H, _ = spans_h(f, "H", 0.25 * 712, su)
    o = lib.G(f, f.getBestCmap()[ord("o")])
    sp = o.h(0.5 * 520 / sl)
    mid = (sp[0][0] + sp[-1][1]) / 2
    v = o.v(mid)
    return dict(stem=n[0][1] - n[0][0], counter=n[1][0] - n[0][1], Hstem=(H[0][1] - H[0][0]),
                Hcounter=H[1][0] - H[0][1], hair=(v[-1][1] - v[-1][0]) * sl, o_counter=(sp[-1][0] - sp[0][1]) * sl)


def zone_bearings(f, ch):
    s = FIT.scale_of(f, ch)
    p = FIT.profile(f, ch, s)
    z = FIT.zone(ch)
    rows = [v for y, v in p.items() if z[0] <= y <= z[1]]
    return [min(r[0] for r in rows), min(r[1] for r in rows)]


def measure(f):
    b = io.BytesIO()
    f.save(b)
    hbf = hb.Font(hb.Face(b.getvalue()))
    chars = FIT.LC + FIT.UC + FIT.PUNCT
    prof = {c: FIT.profile(f, c, FIT.scale_of(f, c)) for c in chars}
    pairs = {}
    for A, B in [(FIT.LC, FIT.LC), (FIT.UC, FIT.LC), (FIT.UC, FIT.UC), (FIT.LC, FIT.UC), (FIT.LC + FIT.UC, FIT.PUNCT),
                 (FIT.PUNCT, FIT.LC + FIT.UC)]:
        for a in A:
            for c in B:
                if not prof.get(a) or not prof.get(c):
                    continue
                s = FIT.scale_of(f, a) if a in FIT.LC else FIT.scale_of(f, c) if c in FIT.LC else FIT.scale_of(f, a)
                k = FIT.kern(hbf, f, a, c) * s
                r = FIT.pair(prof[a], prof[c], k, a, c)
                r0 = FIT.pair(prof[a], prof[c], 0, a, c)
                if r:
                    pairs[a + c] = [round(r[0], 1), round(r[1], 1), round(k, 1), round(r0[0], 1)]
    out = dict(parts(f), pairs=pairs)
    out["zone"] = {c: zone_bearings(f, c) for c in "noHO"}
    out["side"] = {c: FIT.side(prof[c], c) for c in "noHO"}
    return out


def ctl(d, p):
    a, b = FIT.control(p[0]), FIT.control(p[1])
    return d["pairs"][a + b][0]


def rel(d, p):
    return d["pairs"][p][0] - ctl(d, p)


def slope(lo, hi):
    """rel at a weight against rel at 400, least squares through 0, over pairs that are kerned or open at 400."""
    xs = [(rel(lo, p), rel(hi, p)) for p in lo["pairs"] if p in hi["pairs"] and abs(rel(lo, p)) >= 12]
    return sum(a * b for a, b in xs) / sum(a * a for a, _ in xs), len(xs)


def main():
    area = sys.argv[1] if len(sys.argv) > 1 else None
    res = {}
    for name, get in faces(area).items():
        res[name] = {w: measure(get(w)) for w in W}
        print("measured", name, file=sys.stderr)
    os.makedirs("build/kern-081", exist_ok=True)
    json.dump(res, open("build/kern-081/weights.json", "w"))
    report(res)


def report(res):
    print("Parts and bearings at Area's heights (Light / Regular / Bold)")
    for name, d in res.items():
        for w in W:
            x = d[w]
            print(f"{name:15s} {w}  stem {x['stem']:6.1f} counter {x['counter']:6.1f} hair {x['hair']:5.1f} "
                  f"Hstem {x['Hstem']:6.1f} Hcounter {x['Hcounter']:6.1f}  zone n {x['zone']['n'][0]:5.1f} {x['zone']['n'][1]:5.1f} "
                  f"o {x['zone']['o'][0]:5.1f} {x['zone']['o'][1]:5.1f} H {x['zone']['H'][0]:5.1f} {x['zone']['H'][1]:5.1f} "
                  f"O {x['zone']['O'][0]:5.1f} {x['zone']['O'][1]:5.1f}   nn {x['pairs']['nn'][0]:5.1f} HH {x['pairs']['HH'][0]:5.1f}")
    print("\nChange of zone bearing a side (mean of n o H O's two sides), against the change of stem and counter")
    for name, d in res.items():
        for w in (300, 700):
            a, b = d[w], d[400]
            db = st.mean([(a["zone"][c][i] - b["zone"][c][i]) for c in "noHO" for i in (0, 1)])
            dbl = st.mean([(a["zone"][c][i] - b["zone"][c][i]) for c in "no" for i in (0, 1)])
            dbu = st.mean([(a["zone"][c][i] - b["zone"][c][i]) for c in "HO" for i in (0, 1)])
            ds, dc = a["stem"] - b["stem"], a["counter"] - b["counter"]
            print(f"{name:15s} {w}: bearing {db:+6.1f} (lc {dbl:+5.1f}, caps {dbu:+5.1f})  stem {ds:+6.1f}  counter {dc:+6.1f}"
                  f"  bearing/stem gain {db / ds:+.3f}  nn white {a['pairs']['nn'][0] - b['pairs']['nn'][0]:+5.1f} "
                  f"({a['pairs']['nn'][0] / b['pairs']['nn'][0]:.3f})  HH {a['pairs']['HH'][0] / b['pairs']['HH'][0]:.3f}"
                  f"  counter ratio {a['counter'] / b['counter']:.3f}  nn/counter {a['pairs']['nn'][0] / a['counter']:.3f}"
                  f" (400: {b['pairs']['nn'][0] / b['counter']:.3f})")
    print("\nrel (pair white less control) at 300 and 700 against 400: slope, and the white ratio of the control")
    for name, d in res.items():
        for w in (300, 700):
            s, n = slope(d[400], d[w])
            print(f"{name:15s} {w}: slope {s:.3f} over {n} pairs; nn ratio {d[w]['pairs']['nn'][0] / d[400]['pairs']['nn'][0]:.3f}")
    print("\nStandard pairs: white (rel to control) at 300 / 400 / 700, and kerning at each")
    for p in STANDARD:
        line = f"{p:4s}"
        for name, d in res.items():
            if all(p in d[w]["pairs"] for w in W):
                line += f" | {name[:7]:7s} " + " ".join(f"{rel(d[w], p):6.1f}" for w in W)
        print(line)
    print("\nClosest ink (fit.py's least white of a pair) over pairs whose least white is under 60: 2nd and 10th percentile")
    for name, d in res.items():
        line = f"{name:15s}"
        for w in W:
            mins = sorted(v[1] for v in d[w]["pairs"].values() if v[1] < 60)
            if mins:
                line += f"  {w}: {mins[len(mins) // 50]:6.1f} {mins[len(mins) // 10]:6.1f} (hair {d[w]['hair']:.0f})"
        print(line)


# ------------------------------------------------------------------------- the same-weight fit of a master (0.81)
_REF = {}


def ref_rel(weight):
    """{pair: [Georgia Pro rel, Serrif rel]} at a weight: the two references the Regular's fit was measured against."""
    if weight not in _REF:
        fs = faces(None)
        d = {n: measure(fs[n](weight)) for n in ("Georgia Pro", "Serrif")}
        _REF[weight] = {p: [rel(d[n], p) for n in d] for p in d["Georgia Pro"]["pairs"] if all(p in d[n]["pairs"] for n in d)}
    return _REF[weight]


def master_fit(master, weight, kern_min=8):
    """fit.py's kern_table on a master UFO (as its kerning stands): every measured pair (letters and punctuation;
    figures left out, as for the Regular) that stands outside both references at the same weight by kern_min or more
    moves to the nearer one; pairs that share a key share the mean of their targets. Returns [[left, right, change]]."""
    import spacing as SP
    from fontTools.ufoLib.kerning import lookupKerningValue
    refs = ref_rel(weight)
    o = SP.Optical(master)
    name = {}
    for g in master:
        for cp in g.unicodes:
            name.setdefault(chr(cp), g.name)
    g1, g2 = SP._group_maps(master)
    ctl = {}

    def white(a, b):
        return o.white(a, b) + (lookupKerningValue((a, b), master.kerning, master.groups) or 0)
    want = {}
    for p, (rg, rs) in sorted(refs.items()):
        if p[0] in FIT.FIG or p[1] in FIT.FIG or p[0] not in name or p[1] not in name:
            continue
        a, b = name[p[0]], name[p[1]]
        c = FIT.control(p[0]) + FIT.control(p[1])
        if c not in ctl:
            ctl[c] = white(name[c[0]], name[c[1]])
        if o.white(a, b) is None:
            continue
        ra = white(a, b) - ctl[c]
        dg, ds = ra - rg, ra - rs
        mv = 0 if dg * ds <= 0 else -min(dg, ds, key=abs)
        now = lookupKerningValue((a, b), master.kerning, master.groups) or 0
        key = SP.effective_key(master.kerning, g1, g2, a, b) or (g1.get(a, a), g2.get(b, b))
        want.setdefault(key, []).append((now + (mv if abs(mv) >= kern_min else 0), mv))
    out = []
    for key, vs in sorted(want.items()):
        if not any(abs(v[1]) >= kern_min for v in vs):
            continue
        t = round(sum(v[0] for v in vs) / len(vs))
        now = master.kerning.get(key, 0)
        if abs(t) < 4:
            t = 0
        if abs(t - now) >= 4:
            out.append([key[0], key[1], t - now])
    return out


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "report":
        r = json.load(open("build/kern-081/weights.json"))
        report({k: {int(w): v for w, v in d.items()} for k, d in r.items()})
    else:
        main()
