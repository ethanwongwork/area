"""Builds the evaluation page from the tests' JSON, the findings and template.html.

Fonts: Area Serif and the OFL faces are embedded (the OFL ones instanced at Regular and subset to Latin). Georgia Pro
and Serrif are licensed: the page names them in CSS and the viewer's own installed copy draws them. No outline or
font data of either is written into the page; only measurements (numbers).

Usage: python build_page.py  -> $EVAL_OUT/area-serif-evaluation.html"""
import base64
import io
import json
import os
import statistics as st

import ufoLib2
from fontTools import subset
from fontTools.ttLib import TTFont

import evlib as E
from findings import CHANGES, FINDINGS, NOT_CHECKED, SOLID
from test_strokes import ray_thickness

HERE = os.path.dirname(os.path.abspath(__file__))
CSS_FAMILY = {"area": "Area Serif Eval", "georgia": "Georgia Pro", "serrif": "Serrif Collection VF-TRIAL",
              "baskerville": "EV Libre Baskerville", "source": "EV Source Serif 4", "literata": "EV Literata",
              "newsreader": "EV Newsreader", "lora": "EV Lora", "merriweather": "EV Merriweather"}
EXTRA_GLYPHS = ["OE", "fl", "c_t"]
PREV = os.environ.get("EVAL_PREV", "")       # folder of the build to draw as "before" (its build/ with .ufo and .ttf)
UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2022]


def woff2_b64(font, do_subset=True):
    buf = io.BytesIO()
    font.save(buf)
    f = TTFont(io.BytesIO(buf.getvalue()))
    if do_subset:
        opt = subset.Options()
        opt.layout_features = ["kern", "liga", "mark", "mkmk", "ccmp", "locl"]
        opt.name_IDs = [1, 2, 3, 4, 6, 13, 14]
        opt.notdef_outline = True
        opt.hinting = False
        s = subset.Subsetter(opt)
        s.populate(unicodes=UNICODES)
        s.subset(f)
    f.flavor = "woff2"
    out = io.BytesIO()
    f.save(out)
    return base64.b64encode(out.getvalue()).decode()


def outline(ufo, name):
    pen = E.SegPen(ufo)
    ufo[name].draw(pen)
    cs = []
    for c in pen.contours:
        if not c:
            continue
        segs = []
        for s in c:
            pts = [round(v, 1) for p in s[1:] for v in p]
            segs.append([s[0]] + pts)
        cs.append(segs)
    return {"adv": ufo[name].width, "c": cs}


def main():
    load = lambda n: json.load(open(os.path.join(E.OUT, n)))
    curves, strokes, serifs, fit, meas = load("curves.json"), load("strokes.json"), load("serifs.json"), load("fit.json"), load("measures.json")
    faces = E.available()
    area = E.face("area")
    cmap = area.getBestCmap()
    gname = {ch: cmap[ord(ch)] for ch in E.CORE}
    ufo = ufoLib2.Font.open(E.AREA_UFO)

    # fonts
    css = []
    for k in faces:
        label, path, var, lic = E.FACES[k]
        if lic == "licensed":
            continue
        b64 = woff2_b64(E.face(k), do_subset=(k != "area"))
        css.append(f'@font-face{{font-family:"{CSS_FAMILY[k]}";src:url(data:font/woff2;base64,{b64}) format("woff2");font-display:block}}')
        print(f"{label:20} {len(b64) // 1024} KB")

    prev_ufo = ufoLib2.Font.open(os.path.join(PREV, "AreaSerif-Regular.ufo")) if PREV else None
    if PREV:                                             # build 0.66's font, for live before / after text
        b64 = woff2_b64(TTFont(os.path.join(PREV, "AreaSerif-Regular.ttf")))
        css.append(f'@font-face{{font-family:"Area Serif Before";src:url(data:font/woff2;base64,{b64}) format("woff2");font-display:block}}')
    names = list(gname.values()) + [n for n in EXTRA_GLYPHS if n in ufo]
    outlines = {n: outline(ufo, n) for n in names}
    nodes = {n: [[f["test"], f["sev"], f["x"], f["y"], f["detail"]] for f in curves["nodes"].get(n, [])] for n in names}

    # thickness samples (parallel-sided strokes only), step 6
    thick = {}
    for n in names:
        pen = E.SegPen(ufo)
        ufo[n].draw(pen)
        sm = ray_thickness([c for c in pen.contours if c], step=6.0)
        flat = []
        for s in sm:
            if s[6] >= 0.94 and abs(s[7]) < 1 / 16 and s[2] < 140:
                flat += [round(s[0]), round(s[1]), round(s[2])]
        thick[n] = flat

    prev = {n: outline(prev_ufo, n) for n in gname.values() if prev_ufo is not None and n in prev_ufo}
    # resolve the findings' views into things to draw
    ch_of = {v: k for k, v in gname.items()}
    A = strokes["area"]["glyphs"]
    for f in FINDINGS:
        for v in f["views"]:
            g = v["g"]
            ch = ch_of.get(g) or (g if len(g) == 1 else None)
            if len(g) == 1:
                v["g"] = gname[g]
                ch = g
            dims = []
            for lo, hi in v.pop("bars", []):
                c = [b for b in A[ch]["bars"] if lo <= b["y0"] <= hi and b["x1"] - b["x0"] >= 30]
                if c:
                    b = max(c, key=lambda b: b["x1"] - b["x0"])
                    x = (b["x0"] + b["x1"]) / 2
                    dims.append([x, b["y0"], x, b["y0"] + b["t"], f"{b['t']:.0f}"])
            for y, idx in v.pop("hmarks", []):
                sp = E.Shape(area, ch).h(y)
                a, b = sp[idx]
                # the thickest point of that stroke in the band around y
                best = (b - a, y, a, b)
                for yy in range(int(y) - 60, int(y) + 61, 4):
                    s2 = E.Shape(area, ch).h(yy)
                    if len(s2) == len(sp):
                        aa, bb = s2[idx]
                        if bb - aa > best[0]:
                            best = (bb - aa, yy, aa, bb)
                dims.append([best[2], best[1], best[3], best[1], f"{best[0]:.0f}"])
            if dims:
                v["dims"] = dims
            if v.get("ba") and prev_ufo is not None and v["g"] in prev_ufo:
                prev[v["g"]] = outline(prev_ufo, v["g"])

    # per-face numbers
    def serif_summary(k):
        g = serifs[k]["glyphs"]
        L, R, tips, br = [], [], [], []
        for ch in "hilmn":
            for ft in g.get(ch, {}).get("feet", []):
                for side, acc in (("L", L), ("R", R)):
                    d = ft[side]
                    if d["kind"] == "serif":
                        acc.append(d["proj"])
                        if d.get("tip"):
                            tips.append(d["tip"])
                        if d.get("bracket"):
                            br.append(d["bracket"])
        fl = [g[ch]["flag"] for ch in "bdhklmnpr" if g.get(ch, {}).get("flag")]
        capL, capR = [], []
        for ch in "HIKFP":
            for ft in g.get(ch, {}).get("feet", []):
                for side, acc in (("L", capL), ("R", capR)):
                    if ft[side]["kind"] == "serif":
                        acc.append(ft[side]["proj"])
        rng = lambda a: [round(min(a), 1), round(max(a), 1)] if a else None
        u = g.get("u", {}).get("flag")
        n = g.get("n", {}).get("flag")
        return {"footL": rng(L), "footR": rng(R), "tip": rng(tips), "bracket": rng(br),
                "flagProj": rng([f["proj"] for f in fl]), "flagSlope": rng([f["slope"] for f in fl if f["slope"] is not None]),
                "capFootL": rng(capL), "capFootR": rng(capR), "uSlope": u and u["slope"], "nSlope": n and n["slope"],
                "lstem": serifs[k]["lstem"], "ustem": serifs[k]["ustem"]}

    def pair_summary(k):
        P = fit[k]["pairs"]
        ll = [v[1] for p, v in P.items() if p[0] in E.LOWER and p[1] in E.LOWER]
        uu = [v[1] for p, v in P.items() if p[0] in E.UPPER and p[1] in E.UPPER]
        mins = sorted((v[0], p) for p, v in P.items() if v[0] is not None and not (p[0] == "f"))
        return {"llMean": round(st.mean(ll)), "llSd": round(st.pstdev(ll), 1), "llCv": round(st.pstdev(ll) / st.mean(ll) * 100, 1),
                "uuCv": round(st.pstdev(uu) / st.mean(uu) * 100, 1), "kerned": sum(1 for v in P.values() if abs(v[2]) > 0.5),
                "minGap": mins[0][0], "minPair": mins[0][1], "under10": sum(1 for v, p in mins if v < 10)}

    face_rows = []
    for k in faces:
        m = meas[k]
        f = E.face(k)
        b = fit[k]["bear"]
        lc_adv = st.mean(b[c]["adv"] for c in E.LOWER)
        face_rows.append({
            "key": k, "label": E.FACES[k][0], "licence": E.FACES[k][3], "family": CSS_FAMILY[k],
            "xh": m["xh"], "cap": m["cap"], "asc": m["asc"], "desc": m["desc"],
            "upm": f["head"].unitsPerEm,
            "turns": sum(v["turns"] for v in curves["profile"][k].values()),
            "kinks": sum(v["kinks"] for v in curves["profile"][k].values()),
            "serif": serif_summary(k), "pairs": pair_summary(k),
            "lsb": {c: b[c]["lsb"] for c in b}, "adv": {c: b[c]["adv"] for c in b},
            "m": {key: val for key, val in m.items() if not key.startswith(("y0.", "y1.", "adv.", "w."))},
            "overLc": round((fit[k]["metrics"]["o_top"] - m["xh"]) / m["xh"] * 100, 1),
            "overCap": round((fit[k]["metrics"]["O_top"] - m["cap"]) / m["cap"] * 100, 1),
            "lcAdv": round(lc_adv, 1), "oW": m["w.o"], "nAdv": m["adv.n"],
            "grey": fit[k]["grey"],
        })

    rtable = []
    for k in faces:
        f = E.face(k)
        sh, n = E.Shape(f, "r"), E.Shape(f, "n")
        st_ = sh.h(meas[k]["xh"] * 0.3)[0]
        sw = st_[1] - st_[0]
        ft = sh.h(2)[0]
        Pk = fit[k]["pairs"]
        ll = [v[1] for p, v in Pk.items() if p[0] in E.LOWER and p[1] in E.LOWER]
        z = (st.mean(Pk["r" + c][1] for c in "nimhl") - st.mean(ll)) / st.pstdev(ll)
        rtable.append({"label": E.FACES[k][0], "own": k == "area", "adv": round(sh.adv / n.adv, 3), "ink": round((sh.x1 - sh.x0) / sw, 2),
                       "arm": round((sh.x1 - st_[1]) / sw, 2), "footL": round((st_[0] - ft[0]) / sw, 2),
                       "footR": round((ft[1] - st_[1]) / sw, 2), "z": round(z, 1)})
    P = fit["area"]["pairs"]
    tight = sorted(((v[0], p, v[2]) for p, v in P.items() if v[0] is not None))[:24]
    ll = sorted(((v[1], p) for p, v in P.items() if p[0] in E.LOWER and p[1] in E.LOWER))
    tally = {}
    core_names = set(gname.values())
    for n, fs in curves["nodes"].items():
        for f in fs:
            key = f["test"]
            t = tally.setdefault(key, {"core": [0, 0, 0], "all": [0, 0, 0]})
            i = {"high": 0, "medium": 1, "low": 2}[f["sev"]]
            t["all"][i] += 1
            if n in core_names:
                t["core"][i] += 1
    align = fit["area"]["align"]
    data = {
        "build": "0.70", "date": "13 November 2026", "glyphCount": curves["glyphs"], "prev": prev, "changes": CHANGES,
        "rtable": rtable, "hasBefore": bool(PREV),
        "faces": face_rows, "gname": gname, "outlines": outlines, "nodes": nodes, "thick": thick,
        "findings": FINDINGS, "solid": SOLID, "notChecked": NOT_CHECKED,
        "profile": {k: {c: v["turns"] for c, v in curves["profile"][k].items()} for k in faces},
        "tally": tally, "tight": tight, "llTight": ll[:10], "llLoose": ll[-10:],
        "align": {c: [a["y0"], a["y1"], a["flat_bot"], a["flat_top"]] for c, a in align.items()},
        "stems": {c: [s["w"] for s in g["stems"]] for c, g in A.items()},
        "balls": {k: serifs[k]["balls"] and serifs[k]["balls"].get("balls") for k in ("area", "georgia", "serrif")},
    }
    tpl = open(os.path.join(HERE, "template.html")).read()
    html = tpl.replace("/*__FONTS__*/", "\n".join(css)).replace("__DATA__", json.dumps(data, separators=(",", ":")))
    out = os.path.join(E.OUT, "area-serif-evaluation.html")
    open(out, "w").write(html)
    print(out, f"{len(html) // 1024} KB")


if __name__ == "__main__":
    main()
