"""Serif tests, on every face with the same code.

  feet, heads   bracketed serifs on upright stems, found by scanlines: the flat edge at the baseline (or the
                descender line, or mirrored at the cap height), the stem above it, then per side the projection,
                the thickness 8 units in from the tip, the thickness a quarter, half and three quarters of the way
                to the stem (the bracket's curve), the height where the bracket ends, and the cup of the flat edge.
  flags         the one-sided head serif of b d h k l (ascender) and i j m n p r u (x-height): how far it projects,
                how tall it is at the stem, its thickness near the tip and the slope of its top edge.
  arms          the upright serifs that end the arms of E F L T Z and the cuts of C G S: their height 8 units in.
  balls         from audit_parts.py (diameter in stems), parsed from its output.

Usage: python test_serifs.py  -> serifs.json"""
import json
import math
import os
import re
import subprocess
import sys

import evlib as E


class Mirror:
    """A shape flipped top to bottom about y = top, so a head serif can be measured as a foot."""

    def __init__(self, sh, top):
        self.sh, self.top = sh, top
        self.x0, self.x1 = sh.x0, sh.x1

    def h(self, y):
        return self.sh.h(self.top - y - 0.03)

    def v(self, x):
        return sorted((self.top - b, self.top - a) for a, b in self.sh.v(x))


class Shift:
    def __init__(self, sh, base):
        self.sh, self.base = sh, base
        self.x0, self.x1 = sh.x0, sh.x1

    def h(self, y):
        return self.sh.h(self.base + y)

    def v(self, x):
        return [(a - self.base, b - self.base) for a, b in self.sh.v(x)]


def bottom_span_height(sh, x):
    spans = sh.v(x)
    for a, b in spans:
        if a < 12:
            return a, b - a
    return None, None


def feet(sh, stem_ref):
    """Serifs standing on y=0 of `sh` (already shifted or mirrored)."""
    out = []
    for sx0, sx1 in sh.h(1.5):
        inner = [s for s in sh.h(190) if s[0] >= sx0 - 1 and s[1] <= sx1 + 1]
        lower = sh.h(140)
        if len(inner) != 1:
            continue
        a, b = inner[0]
        upright = any(abs(l[0] - a) <= 1.0 and abs(l[1] - b) <= 1.0 for l in lower)
        w = b - a
        if not (0.5 * stem_ref <= w <= 1.6 * stem_ref):
            continue
        rec = {"x0": round(sx0, 1), "x1": round(sx1, 1), "stem": [round(a, 1), round(b, 1)], "upright": upright,
               "width": round(sx1 - sx0, 1)}
        cup = bottom_span_height(sh, (a + b) / 2)[0]
        rec["cup"] = round(cup, 1) if cup is not None else None
        for side, tip, edge, sgn in (("L", sx0, a, 1), ("R", sx1, b, -1)):
            proj = (edge - tip) * sgn
            d = {"proj": round(proj, 1)}
            if upright and 12 <= proj <= 2.2 * stem_ref:
                d["kind"] = "serif"
                _, t = bottom_span_height(sh, tip + sgn * 8)
                d["tip"] = round(t, 1) if t else None
                prof = []
                for fr in (0.25, 0.5, 0.75):
                    _, t = bottom_span_height(sh, tip + sgn * proj * fr)
                    prof.append(round(t, 1) if t else None)
                d["prof"] = prof
                # where the bracket ends: first height at which the stem edge is within 0.75 of its upright position
                y, top = 6, None
                while y < 200:
                    sp = [s for s in sh.h(y) if s[0] <= (a + b) / 2 <= s[1]]
                    if sp:
                        e = sp[0][0] if side == "L" else sp[0][1]
                        if abs(e - edge) <= 0.75:
                            top = y
                            break
                    y += 2
                d["bracket"] = top
            elif proj > 2.2 * stem_ref:
                d["kind"] = "arm"
            else:
                d["kind"] = "none"
            rec[side] = d
        if rec["L"]["kind"] == "serif" or rec["R"]["kind"] == "serif":
            out.append(rec)
    return out


def flag(sh, top, stem_ref):
    """The one-sided head serif at `top` (x-height or ascender): measured on the leftmost upright stem."""
    st = [s for s in sh.h(top - 190)]
    if not st:
        return None
    a, b = st[0]
    if not (0.6 * stem_ref <= b - a <= 1.5 * stem_ref):
        return None
    # leftmost ink in the top zone
    tipx, tipy = None, None
    y = top - 1
    rows = []
    while y > top - 160:
        sp = sh.h(y)
        if sp:
            rows.append((y, sp[0][0], sp[0][1]))
        y -= 2
    if not rows:
        return None
    tip = min(rows, key=lambda r: r[1])
    tipx, tipy = tip[1], tip[0]
    proj = a - tipx
    if proj < 10:
        return None
    # underside: lowest row where ink still reaches left of the stem by over 1.5 units
    under = min((r[0] for r in rows if r[1] < a - 1.5), default=None)
    # highest point of the glyph over the stem, and the top edge's height over the tip
    top_y = max(r[0] for r in rows)
    sp = sh.v(tipx + 8)
    tip_t = None
    for lo, hi in sp:
        if hi > top - 170:
            tip_t = hi - lo
            tip_top = hi
            break
    sp2 = sh.v(a + 2)
    stem_top = max((hi for lo, hi in sp2), default=None)
    slope = math.degrees(math.atan2(stem_top - tip_top, (a + 2) - (tipx + 8))) if tip_t and stem_top else None
    return {"proj": round(proj, 1), "height": round(top_y - under, 1) if under is not None else None,
            "tip": round(tip_t, 1) if tip_t else None, "slope": round(slope, 1) if slope is not None else None,
            "top": round(top_y, 1), "tip_y": round(tipy, 1), "stem": [round(a, 1), round(b, 1)]}


def ends(sh, ch):
    """Heights of the ink 8 units in from the right and left extremes (arm serifs and cut terminals)."""
    return {"right": [[round(a, 1), round(b - a, 1)] for a, b in sh.v(sh.x1 - 8)],
            "left": [[round(a, 1), round(b - a, 1)] for a, b in sh.v(sh.x0 + 8)]}


def balls(key):
    if key not in ("area", "georgia", "serrif"):
        return None
    try:
        out = subprocess.run([sys.executable, os.path.join(E.AREA_DIR, "audit_parts.py"), "--refs"], cwd=E.AREA_DIR,
                             capture_output=True, text=True).stdout
    except OSError:
        return None
    block = {"area": "### Area Serif", "georgia": "### Georgia Pro", "serrif": "### Serrif"}[key]
    seg = out.split(block, 1)[-1].split("###", 1)[0]
    res = {}
    for line in seg.splitlines():
        m = re.match(r"(\w[\w ()]*?)\s+median\s+([\d.]+)\s+spread x([\d.]+)\s+(.*)", line)
        if m:
            vals = dict((k.strip(), float(v)) for k, v in re.findall(r"([\w ()]+?):([\d.]+)", m.group(4).split("OUTLIERS")[0]))
            res[m.group(1).strip()] = {"median": float(m.group(2)), "spread": float(m.group(3)), "values": vals}
    return res


def main():
    os.makedirs(E.OUT, exist_ok=True)
    res = {}
    for key in E.available():
        f = E.face(key)
        m = E.metrics(f)
        nst = E.Shape(f, "n").h(m["xh"] * 0.4)
        Hst = E.Shape(f, "H").h(m["cap"] * 0.25)
        lstem, ustem = nst[0][1] - nst[0][0], Hst[0][1] - Hst[0][0]
        per = {}
        for ch in E.CORE:
            sh = E.Shape(f, ch)
            if sh.empty:
                continue
            ref = ustem if ch in E.UPPER or ch in E.DIGITS else lstem
            rec = {}
            base = sh.y0 if sh.y0 < -100 and ch in "pq" else 0.0
            ft = feet(Shift(sh, base), ref) if abs(sh.y0 - base) < 6 else []
            if ft:
                rec["feet"] = ft
            if ch in E.UPPER or ch in "vwxyz":
                top = m["cap"] if ch in E.UPPER else m["xh"]
                if abs(sh.y1 - top) < 8:
                    hd = feet(Mirror(sh, sh.y1), ref)
                    if hd:
                        rec["heads"] = hd
            if ch in "bdhkl":
                fl = flag(sh, sh.y1, ref)
                if fl:
                    rec["flag"] = fl
            if ch in "ijmnpru":
                # the dot of i and j sits above: measure below the x-height zone
                top = max(y for y in (r for r in [m["xh"] + 20, m["xh"] + 10, m["xh"]]) if sh.h(y - 1)) if ch in "ij" else sh.y1
                if ch in "ij":
                    y = m["xh"] + 40
                    while y > m["xh"] - 20 and not (sh.h(y) and sh.h(y - 30)):
                        y -= 1
                    # walk down from above the x-height until the stem body begins (skipping the dot)
                    ys = [yy for yy in range(int(m["xh"]) + 60, int(m["xh"]) - 40, -1) if sh.h(yy)]
                    body = [yy for yy in ys if all(sh.h(yy - d) for d in (10, 40, 80))]
                    top = max(body) + 1 if body else m["xh"]
                fl = flag(sh, top, ref)
                if fl:
                    rec["flag"] = fl
            if ch in "EFLTZCGSsczaretf2357":
                rec["ends"] = ends(sh, ch)
            if rec:
                per[ch] = rec
        res[key] = {"glyphs": per, "lstem": round(lstem, 2), "ustem": round(ustem, 2), "balls": balls(key)}
        i = per.get("i", {}).get("feet", [{}])[0]
        H = per.get("H", {}).get("feet", [{}])[0]
        print(f"{E.FACES[key][0]:20} i foot L {i.get('L')} R {i.get('R')}  | n flag {per.get('n', {}).get('flag')}")
    json.dump(res, open(os.path.join(E.OUT, "serifs.json"), "w"))


if __name__ == "__main__":
    main()
