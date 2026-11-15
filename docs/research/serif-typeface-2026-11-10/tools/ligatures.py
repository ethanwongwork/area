"""f before i, and the f ligatures, on every face (owner, 2026-11-14: "should f's top reach further toward the i, so
the end of the hook sits almost over the dot?"). Numbers only.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/ligatures.py [measure | sheet OUT.png]

Per face, in its own n stems, with HarfBuzz and kerning on:
  ligature     what "fi" shapes to with ligatures on (one glyph or two), and whether a dot survives in it
  hook past    how far f's hook reaches past f's own stem centre, in stems (f alone)
  to i stem    from the hook's right end to the i's stem centre: negative = the hook stops short of the stem's middle
  to dot       from the hook's right end to the dot's centre (ligatures off; and in the ligature if it keeps a dot)
  gap          white between the hook and the dot, ligatures off (the nearest the two inks come above the x-height)
  stems        f's stem centre to i's stem centre, ligature against the two letters set apart
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import shapelib as S  # noqa: E402
import evlib as E  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402


def spans(P, v, ax):
    hits = []
    for poly in P:
        n = len(poly)
        for i in range(n):
            a, b = poly[i], poly[(i + 1) % n]
            if (a[ax] <= v) != (b[ax] <= v):
                hits.append(a[1 - ax] + (v - a[ax]) / (b[ax] - a[ax]) * (b[1 - ax] - a[1 - ax]))
    hits.sort()
    return list(zip(hits[::2], hits[1::2]))


def parts(tt, text, feats):
    lay, adv = S.layout(tt, text, feats)
    m = E.metrics(tt)
    xh = m["xh"]
    P = S.polys(tt, lay)
    row = spans(P, xh * 0.35, 1)                                 # the stems, under the bar
    high = [p for poly in P for p in poly if p[1] > xh * 1.12]
    # the dot: a closed contour wholly above the x-height and under 0.5 x-height wide
    dots = [poly for poly in P if min(p[1] for p in poly) > xh * 1.04 and max(p[0] for p in poly) - min(p[0] for p in poly) < 0.5 * xh
            and max(p[1] for p in poly) - min(p[1] for p in poly) < 0.5 * xh]
    return dict(names=[g[0] for g in lay], adv=adv * 1000 / tt["head"].unitsPerEm, stems=row, P=P, dots=dots, xh=xh, high=high)


def measure(tt):
    n = parts(tt, "n", {})
    stem = n["stems"][0][1] - n["stems"][0][0]
    out = {}
    for tag, feats in (("on", {"liga": True}), ("off", {"liga": False, "clig": False, "dlig": False})):
        d = parts(tt, "fi", feats)
        fst, ist = d["stems"][0], d["stems"][-1]
        fc, ic = (fst[0] + fst[1]) / 2, (ist[0] + ist[1]) / 2
        body = [poly for poly in d["P"] if poly not in d["dots"]]
        hook = max(p[0] for poly in body for p in poly if p[1] > d["xh"] * 1.12 and p[0] < ic + 3 * stem) if any(
            p[1] > d["xh"] * 1.12 for poly in body for p in poly) else None
        # f's own hook: on the part of the body that belongs to f (left of the i's stem's left edge + a stem)
        r = {"glyphs": "+".join(d["names"]), "dot": len(d["dots"]), "stems apart": (ic - fc) / stem}
        fhook = max((p[0] for poly in body for p in poly if p[1] > d["xh"] * 1.12 and p[0] <= ist[1] + 0.2 * stem), default=None)
        if fhook is not None:
            r["hook past f stem"] = (fhook - fc) / stem
            r["hook to i stem centre"] = (fhook - ic) / stem
        if d["dots"]:
            dot = d["dots"][-1]
            dl, dr = min(p[0] for p in dot), max(p[0] for p in dot)
            r["hook to dot centre"] = (fhook - (dl + dr) / 2) / stem
            r["dot centre to i stem centre"] = ((dl + dr) / 2 - ic) / stem
            gap = min(((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5 for a in dot[::3]
                      for poly in body for b in poly[::3] if b[1] > d["xh"] * 1.02)
            r["gap hook to dot"] = gap / stem
        out[tag] = r
    return out, stem


def main():
    faces = {k: E.face(k) for k in E.available()}
    if len(sys.argv) > 2 and sys.argv[1] == "measure":
        faces["area"] = TTFont(sys.argv[2])
    rows = {k: measure(f) for k, f in faces.items()}
    for tag in ("on", "off"):
        print(f"\\nfi, ligatures {tag}")
        keys = []
        for k in rows:
            for key in rows[k][0][tag]:
                if key not in keys:
                    keys.append(key)
        print(f"   {'':28s}" + "".join(f"{k[:10]:>12s}" for k in rows))
        for key in keys:
            line = f"   {key:28s}"
            nums = []
            for k in rows:
                v = rows[k][0][tag].get(key)
                if isinstance(v, float):
                    line += f"{v:12.2f}"
                    if k != "area":
                        nums.append(v)
                else:
                    line += f"{str(v) if v is not None else '-':>12s}"[:12].rjust(12)
            if nums:
                line += f"   others' mean {sum(nums) / len(nums):6.2f}"
                two = [rows[k][0][tag].get(key) for k in ("georgia", "serrif") if isinstance(rows[k][0][tag].get(key), float)]
                if two:
                    line += f"   Georgia Pro, Serrif {sum(two) / len(two):6.2f}"
            print(line)


if __name__ == "__main__":
    main()
