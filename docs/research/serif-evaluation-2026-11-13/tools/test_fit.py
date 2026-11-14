"""Alignment, spacing and texture tests, on every face with the same code.

  align     each glyph's lowest and highest point and whether that edge is flat or round, against the face's own
            lines (baseline, x-height, cap height, ascender, descender): flats that miss a line, uneven overshoots.
  bearings  side bearings at the stem (straight sides) or at the widest point (round sides), by edge type.
  pairs     every pair of the 62 core characters, shaped with kerning: the narrowest gap between the two letters and
            the optical gap (the mean gap over the shared height, each side clipped to a depth of 0.3 x-height).
            Collisions, near-touches and pairs far looser or tighter than the face's own rhythm.
  grey      ink area over advance x x-height for each letter: letters darker or lighter than the face's average.

Usage: python test_fit.py  -> fit.json"""
import json
import os
import statistics as st

import uharfbuzz as hb

import evlib as E

STEP = 10


def profiles(sh, lo, hi):
    """Per row: (left edge, right edge distance from the advance) or None."""
    rows = {}
    y = lo
    while y <= hi:
        sp = sh.h(y)
        rows[y] = (sp[0][0], sh.adv - sp[-1][1]) if sp else None
        y += STEP
    return rows


def flat_edges(contours):
    ys = []
    for c in contours:
        for s in c:
            if s[0] == "L" and abs(s[1][1] - s[2][1]) < 0.01 and abs(s[1][0] - s[2][0]) >= 15:
                ys.append((round(s[1][1], 2), round(abs(s[1][0] - s[2][0]), 1)))
    return ys


def main():
    os.makedirs(E.OUT, exist_ok=True)
    res = {}
    for key in E.available():
        label, path, var, _ = E.FACES[key]
        f = E.face(key)
        m = E.metrics(f)
        k = 1000 / f["head"].unitsPerEm
        blob = hb.Blob.from_file_path(path)
        hfont = hb.Font(hb.Face(blob))
        if var:
            hfont.set_variations(var)
        cmap = f.getBestCmap()
        order = f.getGlyphOrder()
        shapes = {ch: E.Shape(f, ch) for ch in E.CORE if cmap.get(ord(ch))}
        align, bear, grey = {}, {}, {}
        for ch, sh in shapes.items():
            fl = flat_edges(sh.contours)
            flat_bot = any(abs(y - sh.y0) < 0.6 for y, _ in fl)
            flat_top = any(abs(y - sh.y1) < 0.6 for y, _ in fl)
            align[ch] = {"y0": round(sh.y0, 2), "y1": round(sh.y1, 2), "flat_bot": flat_bot, "flat_top": flat_top,
                         "flats": sorted(set(y for y, _ in fl))}
            zone = m["cap"] if ch in E.UPPER + E.DIGITS else m["xh"]
            mid = sh.h(zone * 0.5)
            bear[ch] = {"lsb": round(sh.x0, 1), "rsb": round(sh.adv - sh.x1, 1), "adv": round(sh.adv, 1),
                        "lsb_mid": round(mid[0][0], 1) if mid else None,
                        "rsb_mid": round(sh.adv - mid[-1][1], 1) if mid else None}
            a = abs(sum(E.area(p) for p in sh.polys))
            grey[ch] = round(a / (sh.adv * m["xh"]), 4)
        prof = {ch: profiles(sh, 0, int(m["asc"]) + 10) for ch, sh in shapes.items()}
        depth = 0.3 * m["xh"]

        def kern(a, b):
            buf = hb.Buffer()
            buf.add_str(a + b)
            buf.guess_segment_properties()
            hb.shape(hfont, buf, {"kern": True, "liga": False})
            if len(buf.glyph_infos) != 2:
                return 0.0
            return buf.glyph_positions[0].x_advance * k - shapes[a].adv

        pairs = {}
        for a in shapes:
            for b in shapes:
                zone = m["xh"] if (a in E.LOWER and b in E.LOWER and a not in "bdfhklt" and b not in "bdfhklt") else \
                    (m["cap"] if (a in E.UPPER + E.DIGITS or b in E.UPPER + E.DIGITS) else m["asc"])
                kn = kern(a, b)
                gaps, opt = [], []
                ra = [prof[a][y][1] for y in prof[a] if y <= zone and prof[a][y]]
                lb = [prof[b][y][0] for y in prof[b] if y <= zone and prof[b][y]]
                if not ra or not lb:
                    continue
                ra_min, lb_min = min(ra), min(lb)
                y = 0
                while y <= zone:
                    pa, pb = prof[a].get(y), prof[b].get(y)
                    if pa and pb:
                        gaps.append(pa[1] + pb[0] + kn)
                    if y <= min(zone, m["xh"] if (a in E.LOWER or b in E.LOWER) else zone):
                        r = min(pa[1], ra_min + depth) if pa else ra_min + depth
                        l = min(pb[0], lb_min + depth) if pb else lb_min + depth
                        opt.append(r + l + kn)
                    y += STEP
                pairs[a + b] = [round(min(gaps), 1) if gaps else None, round(sum(opt) / len(opt), 1), round(kn, 1)]
        res[key] = {"metrics": m, "align": align, "bear": bear, "grey": grey, "pairs": pairs}
        ll = [v[1] for p, v in pairs.items() if p[0] in E.LOWER and p[1] in E.LOWER]
        tight = sorted(((v[0], p) for p, v in pairs.items() if v[0] is not None))[:6]
        print(f"{label:20} lc-lc optical gap mean {st.mean(ll):.0f} sd {st.pstdev(ll):.1f} ({st.pstdev(ll) / st.mean(ll) * 100:.0f}%)"
              f"  kerned pairs {sum(1 for v in pairs.values() if abs(v[2]) > 0.5)}  tightest {tight}")
    # every glyph of Area Serif against its lines
    f = E.face("area")
    allg = {}
    gs = f.getGlyphSet()
    for name in f.getGlyphOrder():
        sh = E.Shape(f, name=name)
        if sh.empty:
            continue
        fl = flat_edges(sh.contours)
        allg[name] = {"y0": round(sh.y0, 2), "y1": round(sh.y1, 2), "flats": sorted(set(y for y, _ in fl)),
                      "lsb": round(sh.x0, 1), "rsb": round(sh.adv - sh.x1, 1), "adv": round(sh.adv, 1)}
    res["area_all"] = allg
    json.dump(res, open(os.path.join(E.OUT, "fit.json"), "w"))


if __name__ == "__main__":
    main()
