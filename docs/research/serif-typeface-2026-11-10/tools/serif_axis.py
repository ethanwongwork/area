"""Serifs along the weight axis: every foot serif and flag of the letters, measured the same way at each weight,
on Area Serif and on the references that have a weight axis or a Light and a Bold. Numbers only.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/serif_axis.py [--refs] [out.json]

Two questions, per weight:
  consistent   do all serifs of one kind have one tip, one reach and one bracket? (kinds: lowercase foot, capital
               foot, capital head, x-height flag, ascender flag). Prints each kind's median and spread and names
               the letters more than TOL from the median. Exit 1 if Area has any.
  to scale     each kind's median over its value at 400, beside the references' at their Light and Bold.
Measures are test_serifs.py's: reach from the stem, thickness 8 in from the tip, thickness a quarter, half and three
quarters of the way to the stem, the height where the bracket ends."""
import json
import os
import statistics
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402
import test_serifs as TS  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from fontTools.varLib.instancer import instantiateVariableFont as inst  # noqa: E402

AREA = os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif", "build", "AreaSerif[wght].ttf")
USER = os.path.expanduser("~/Library/Fonts/")
REFS = {"Source Serif 4": ("SourceSerif4.ttf", {"opsz": 20}), "Literata": ("Literata.ttf", {"opsz": 12}),
        "Newsreader": ("Newsreader.ttf", {"opsz": 18}), "Merriweather": ("Merriweather.ttf", {"opsz": 18, "wdth": 100})}
LC_FEET, CAP_FEET = "ilnmhkrfpqdu", "HIEFLTNMKPRBDU"
X_FLAGS, ASC_FLAGS = "inmpru", "bdhkl"
LONG = {("f", "R"), ("p", "R"), ("q", "L")}      # the bowl side of a descender's foot and f's right foot: a quarter longer by rule
TOL = dict(tip=1.5, proj=2.5, bracket=6, height=4, mid=2.0)


def measure(font):
    m = E.metrics(font)
    nst = E.Shape(font, "n").h(m["xh"] * 0.4)
    Hst = E.Shape(font, "H").h(m["cap"] * 0.25)
    lstem, ustem = nst[0][1] - nst[0][0], Hst[0][1] - Hst[0][0]
    kinds = {"lowercase foot": [], "lowercase foot, long side": [], "capital foot": [], "capital head": [],
             "x-height flag": [], "ascender flag": []}

    def sides(recs, ch, kind):
        for k, rec in enumerate(recs):
            for side in "LR":
                d = rec[side]
                # a serif, not an arm or a bowl's end: no thicker than 50 at its tip, no longer than 110 (per 1000 of the em)
                # (r's right foot, 1.6 stems by the owner's choice, is left out with them)
                if d.get("kind") == "serif" and d.get("tip") and d.get("prof") and all(d["prof"]) \
                        and d["tip"] <= 50 and d["proj"] <= 110:
                    k2 = "lowercase foot, long side" if (ch, side) in LONG else kind
                    kinds[k2].append(dict(at=f"{ch}{k + 1}{side}", tip=d["tip"], proj=d["proj"], mid=d["prof"][1],
                                            bracket=d.get("bracket") or 0))
    for ch in LC_FEET + CAP_FEET:
        sh = E.Shape(font, ch)
        ref = ustem if ch in CAP_FEET else lstem
        base = sh.y0 if sh.y0 < -100 and ch in "pq" else 0.0
        if abs(sh.y0 - base) < 6:
            sides(TS.feet(TS.Shift(sh, base), ref), ch, "capital foot" if ch in CAP_FEET else "lowercase foot")
        if ch in CAP_FEET and abs(sh.y1 - m["cap"]) < 8:
            sides(TS.feet(TS.Mirror(sh, sh.y1), ref), ch, "capital head")
    for ch in X_FLAGS + ASC_FLAGS:
        sh = E.Shape(font, ch)
        top = sh.y1
        if ch == "i":
            ys = [yy for yy in range(int(m["xh"]) + 60, int(m["xh"]) - 40, -1) if sh.h(yy)]
            body = [yy for yy in ys if all(sh.h(yy - d) for d in (10, 40, 80))]
            top = max(body) + 1 if body else m["xh"]
        fl = TS.flag(sh, top, lstem)
        if fl and fl.get("tip") and fl.get("height"):
            kinds["ascender flag" if ch in ASC_FLAGS else "x-height flag"].append(
                dict(at=ch, tip=fl["tip"], proj=fl["proj"], height=fl["height"]))
    return dict(lstem=lstem, ustem=ustem, kinds=kinds)


def summary(kinds):
    out = {}
    for kind, rows in kinds.items():
        if not rows:
            continue
        keys = [k for k in rows[0] if k != "at"]
        med = {k: statistics.median(r[k] for r in rows) for k in keys}
        off = [f"{r['at']} {k} {r[k]:.0f}" for r in rows for k in keys if abs(r[k] - med[k]) > TOL[k]]
        out[kind] = dict(n=len(rows), med=med, spread={k: max(r[k] for r in rows) - min(r[k] for r in rows) for k in keys}, off=off)
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    vf = TTFont(AREA)
    lo = int(vf["fvar"].axes[0].minValue)
    weights = [w for w in (300, 400, 500, 600, 700) if w >= lo]
    res, bad = {"Area Serif": {}}, 0
    print("Area Serif: each kind's median (spread across its serifs), then the serifs off the median")
    for w in weights:
        r = measure(inst(TTFont(AREA), {"wght": w}))
        s = summary(r["kinds"])
        res["Area Serif"][w] = dict(lstem=r["lstem"], ustem=r["ustem"], kinds=s)
        print(f"  {w}  stems {r['lstem']:.0f} / {r['ustem']:.0f}")
        for kind, d in s.items():
            cells = "  ".join(f"{k} {d['med'][k]:.1f} ({d['spread'][k]:.1f})" for k in d["med"])
            print(f"    {kind:15s} n={d['n']:2d}  {cells}" + (f"   OFF: {', '.join(d['off'])}" if d["off"] else ""))
            bad += len(d["off"])
    if "--refs" in sys.argv:
        for name, (file, fixed) in REFS.items():
            res[name] = {}
            for w in (300, 400, 700):
                r = measure(inst(TTFont(os.path.join(os.environ["EVAL_FONTS"], file)), dict(fixed, wght=w)))
                res[name][w] = dict(lstem=r["lstem"], ustem=r["ustem"], kinds=summary(r["kinds"]))
        print("\nto scale: each kind's median over its value at 400 (stem, tip, reach, mid thickness, bracket height)")
        for kind in ("lowercase foot", "capital foot", "x-height flag"):
            if kind not in res["Area Serif"][400]["kinds"]:
                continue
            print(f"  {kind}")
            for name, by in res.items():
                for w in sorted(by):
                    if w == 400 or kind not in by[w]["kinds"] or kind not in by[400]["kinds"]:
                        continue
                    a, b = by[w]["kinds"][kind]["med"], by[400]["kinds"][kind]["med"]
                    st = by[w]["ustem" if kind.startswith("capital") else "lstem"] / by[400]["ustem" if kind.startswith("capital") else "lstem"]
                    cells = "  ".join(f"{k} {a[k] / b[k]:.2f}" for k in a if b[k])
                    print(f"    {name:15s} {w}  stem {st:.2f}  {cells}")
    if args:
        json.dump(res, open(args[0], "w"), indent=1)
    print(f"\nserifs along the axis: {bad} of Area's serifs off their kind's median")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
