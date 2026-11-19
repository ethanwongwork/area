"""Side bearings in the references, Bold less Regular, per letter and side, the way spacing.py reads them: in the
letter's own zone (baseline to x-height, or to cap height), to the outermost ink there, at Area's heights. Writes
typefaces/area-serif/bold_bearings.json: {letter: [left change, right change]} as the mean of Georgia Pro's and
Serrif's, and the same for the figures and the punctuation spacing.py names.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/bold_bearings.py
    ... bold_bearings.py light      (0.81) the same, Light less Regular (Georgia Pro Light, Serrif 300), to
                                    light_bearings.json, with the scale from Area's stem loss over theirs
    ... bold_bearings.py thin       (0.82) the Thin's: the references' lightest less their 300 (Serrif 100,
                                    four 200s), to thin_bearings.json

0.80 set the Light's bearings from this file too, the Bold's change run backwards (bold.vector(55): f = -0.371).
Measured, the references open a Light's sides more than that, most on the right of the open and diagonal letters
(v w y K N U W: +5 to +10 where the extrapolation gives +1), so the Light has a table of its own.
"""
import json
import os
import string
import sys

import bold_parts as B
import evlib as E

FIGS = "0123456789"
PUNCT = ".,-':;!?–—\"‘’“”()/"


def bearings(f, ch):
    m = E.metrics(f)
    s = E.Shape(f, ch)
    if ch in string.ascii_lowercase:
        z, k = m["xh"], 520 / m["xh"]
    elif ch in string.ascii_uppercase or ch in FIGS:
        z, k = m["cap"], 712 / m["cap"]
    else:
        return s.x0 * 520 / m["xh"], (s.adv - s.x1) * 520 / m["xh"]
    lo = hi = None
    y = 10 / k
    while y <= z - 10 / k:
        sp = s.h(y)
        if sp:
            lo = sp[0][0] if lo is None else min(lo, sp[0][0])
            hi = sp[-1][1] if hi is None else max(hi, sp[-1][1])
        y += 10 / k
    return lo * k, (s.adv - hi) * k


def stem(f):
    m = E.metrics(f)
    s = E.Shape(f, "n")
    sp = s.h(m["xh"] * 0.45)
    return (sp[0][1] - sp[0][0]) * 520 / m["xh"]


def light():
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
    faces = {"Georgia Pro": (TTFont(E.USER_FONTS + "GeorgiaPro-Regular.ttf"), TTFont(E.USER_FONTS + "GeorgiaPro-Light.ttf")),
             "Serrif": tuple(instantiateVariableFont(TTFont(E.USER_FONTS + "SerrifCollectionVF-TRIAL.ttf"),
                                                     {"wght": w, "wdth": 100, "slnt": 0}) for w in (400, 300))}
    import bold as AREA
    loss = [stem(r) - stem(l) for r, l in faces.values()]
    scale = (AREA.REG_STEM - AREA.LIGHT_STEM) / (sum(loss) / len(loss))
    out = {}
    for ch in string.ascii_lowercase + string.ascii_uppercase + FIGS + PUNCT:
        d = []
        for r, l in faces.values():
            if ord(ch) not in r.getBestCmap() or ord(ch) not in l.getBestCmap():
                continue
            (l0, r0), (l1, r1) = bearings(r, ch), bearings(l, ch)
            d.append((l1 - l0, r1 - r0))
        if len(d) == 2:
            out[ch] = [round((d[0][0] + d[1][0]) / 2 * scale, 1), round((d[0][1] + d[1][1]) / 2 * scale, 1)]
    note = (f"Light less Regular, per side, mean of Georgia Pro Light and Serrif 300, times {scale:.3f} (Area's stem loss "
            f"{AREA.REG_STEM - AREA.LIGHT_STEM} over theirs, {', '.join(f'{x:.1f}' for x in loss)}); in Area's units, applied as is")
    json.dump({"note": note, "scale": round(scale, 3), "sides": out}, open(os.path.join(B.SERIF, "light_bearings.json"), "w"),
              indent=0, ensure_ascii=False)
    import statistics as st
    for name, group in (("lowercase", string.ascii_lowercase), ("capitals", string.ascii_uppercase), ("figures", FIGS), ("punctuation", PUNCT)):
        vals = [x for ch in group if ch in out for x in out[ch]]
        print(f"{name}: mean change a side {st.mean(vals):+.1f}, from {min(vals)} to {max(vals)}")
    print(note)


def thin():
    """0.82 (owner round 8, axis B): the Thin's sides. The references' own lightest less their 300, per letter and side,
    each times Area's stem loss from the Light to the Thin (55 > 32) over its own stem loss 300 > lightest: Serrif 100
    (the one real 100) and the 200s of Source Serif 4, Literata, Newsreader and Crimson Pro (Georgia Pro has no
    lighter weight than 300). The median of the five per side (a mean is pulled by one face's redrawn letter), in
    Area's units, to thin_bearings.json; the Thin's change is the Light's (light_bearings.json) plus this."""
    import statistics as st
    sys.path.insert(0, os.path.join(B.SERIF, "build", "weightscale"))
    import wslib as W
    import bold as AREA
    import weightaxis as WAX
    faces = {"Serrif": 100, "Source Serif 4": 200, "Literata": 200, "Newsreader": 200, "Crimson Pro": 200}
    pairs = {n: (W.font(n, 300), W.font(n, w)) for n, w in faces.items()}
    loss = {n: stem(r) - stem(l) for n, (r, l) in pairs.items()}
    scale = {n: (AREA.LIGHT_STEM - WAX.THIN_STEM) / loss[n] for n in faces}
    out, per = {}, {}
    for ch in string.ascii_lowercase + string.ascii_uppercase + FIGS + PUNCT:
        d = []
        for n, (r, l) in pairs.items():
            if ord(ch) not in r.getBestCmap() or ord(ch) not in l.getBestCmap():
                continue
            (l0, r0), (l1, r1) = bearings(r, ch), bearings(l, ch)
            d.append(((l1 - l0) * scale[n], (r1 - r0) * scale[n]))
        if len(d) >= 3:
            out[ch] = [round(st.median(x[0] for x in d), 1), round(st.median(x[1] for x in d), 1)]
            per[ch] = [[round(a, 1), round(b, 1)] for a, b in d]
    note = (f"Thin less Light, per side: the median over {', '.join(f'{n} {w}' for n, w in faces.items())} of (lightest less "
            f"300) times Area's stem loss 55 > 32 over each face's 300 > lightest ({', '.join(f'{n} {loss[n]:.1f}' for n in faces)}); "
            f"in Area's units, added to light_bearings.json's change at the Thin")
    json.dump({"note": note, "scale": {n: round(x, 3) for n, x in scale.items()}, "sides": out, "per_face": per},
              open(os.path.join(B.SERIF, "thin_bearings.json"), "w"), indent=0, ensure_ascii=False)
    for name, group in (("lowercase", string.ascii_lowercase), ("capitals", string.ascii_uppercase), ("figures", FIGS), ("punctuation", PUNCT)):
        vals = [x for ch in group if ch in out for x in out[ch]]
        print(f"{name}: median change a side {st.median(vals):+.1f}, mean {st.mean(vals):+.1f}, from {min(vals)} to {max(vals)}")
    print(note)


if __name__ == "__main__" and sys.argv[1:] == ["thin"]:
    import sys as _s
    _s.path.insert(0, B.SERIF)
    thin()
elif __name__ == "__main__" and sys.argv[1:] == ["light"]:
    import sys as _s
    _s.path.insert(0, B.SERIF)
    light()
elif __name__ == "__main__":
    out, rows = {}, []
    for ch in string.ascii_lowercase + string.ascii_uppercase + FIGS + PUNCT:
        d = []
        for n in ("Georgia Pro", "Serrif"):
            r, b = B.FACES[n]
            if ord(ch) not in r.getBestCmap():
                continue
            (l0, r0), (l1, r1) = bearings(r, ch), bearings(b, ch)
            d.append((l1 - l0, r1 - r0, l0, r0))
        if len(d) == 2:
            out[ch] = [round((d[0][0] + d[1][0]) / 2, 1), round((d[0][1] + d[1][1]) / 2, 1)]
            rows.append((ch, d))
    json.dump(out, open(os.path.join(B.SERIF, "bold_bearings.json"), "w"), indent=0, ensure_ascii=False)
    for ch, d in rows:
        if ch in "nHoOvArt.-0":
            print(ch, "Georgia Pro", [round(x) for x in d[0]], "Serrif", [round(x) for x in d[1]], "mean change", out[ch])
    import statistics as st
    for name, group in (("lowercase", string.ascii_lowercase), ("capitals", string.ascii_uppercase), ("figures", FIGS), ("punctuation", PUNCT)):
        vals = [x for ch in group if ch in out for x in out[ch]]
        print(f"{name}: mean change a side {st.mean(vals):.1f}, from {min(vals)} to {max(vals)}")
