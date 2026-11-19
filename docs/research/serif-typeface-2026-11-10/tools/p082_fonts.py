"""Font reading for page_082.py: outlines of the project's own variable fonts at a weight (TrueType points, read with
fontTools from snapshot folders only), outline differences, the character set in groups, alternates from GSUB, and the
fonts as base64 woff2. Reads only; writes nothing."""
import base64
import io
import math
import unicodedata

import numpy as np
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont


class Snap:
    """One snapshot folder's variable font."""

    def __init__(self, folder, key, label):
        self.folder, self.key, self.label = folder, key, label
        self.path = f"{folder}/AreaSerif[wght].ttf"
        self.font = TTFont(self.path)
        self.order = set(self.font.getGlyphOrder())
        self.cmap = self.font.getBestCmap()
        ax = next(a for a in self.font["fvar"].axes if a.axisTag == "wght")
        self.axis = (ax.minValue, ax.defaultValue, ax.maxValue)
        nm = self.font["name"]
        self.instances = sorted((round(i.coordinates["wght"]), nm.getDebugName(i.subfamilyNameID) or "")
                                for i in self.font["fvar"].instances if "wght" in i.coordinates)
        self.has_avar = "avar" in self.font
        self.own = lambda w: w          # page weight -> this font's own axis value (set by page_082.axis_setup)
        self._gs = {}

    def gs(self, w):
        if w not in self._gs:
            self._gs[w] = self.font.getGlyphSet(location={"wght": w})
        return self._gs[w]

    def points(self, g, w):
        """[advance, [[x, y, ...] per contour], ["1" on / "0" off per point]] at weight w, components decomposed."""
        gs = self.gs(w)
        pen = DecomposingRecordingPen(gs)
        gs[g].draw(pen)
        cs, fl = [], []
        cur, cf = None, None
        for op, args in pen.value:
            if op == "moveTo":
                cur, cf = [*map(round, args[0])], "1"
            elif op == "lineTo":
                cur += [*map(round, args[0])]
                cf += "1"
            elif op == "qCurveTo":
                pts = list(args)
                if pts[-1] is None:                      # a contour of off-curve points only: start on an implied point
                    pts = pts[:-1]
                    m = ((pts[-1][0] + pts[0][0]) / 2, (pts[-1][1] + pts[0][1]) / 2)
                    cur, cf = [round(m[0]), round(m[1])], "1"
                    pts = pts + [m]
                for p in pts[:-1]:
                    cur += [round(p[0]), round(p[1])]
                    cf += "0"
                cur += [round(pts[-1][0]), round(pts[-1][1])]
                cf += "1"
            elif op == "curveTo":                        # not in a TrueType font; kept for safety
                for p in args:
                    cur += [round(p[0]), round(p[1])]
                cf += "001"
            elif op in ("closePath", "endPath"):
                if cur:
                    cs.append(cur)
                    fl.append(cf)
                cur, cf = None, None
        return [round(gs[g].width), cs, fl]

    def woff2_b64(self):
        f = TTFont(self.path)
        f.flavor = "woff2"
        out = io.BytesIO()
        f.save(out)
        return base64.b64encode(out.getvalue()).decode()


def flatten(pt, step=3.0):
    """Sample an encoded outline into points about `step` units apart (for differences)."""
    _, cs, fl = pt
    out = []
    for c, f in zip(cs, fl):
        P = [(c[i], c[i + 1]) for i in range(0, len(c), 2)]
        n = len(P)
        if n == 0:
            continue
        # walk TrueType points: on, (off)*, on ...; implied on-points between consecutive offs
        seq = []
        for i in range(n):
            seq.append((P[i], f[i] == "1"))
        start = seq[0][0]
        cur = start
        offs = []

        def emit_line(a, b):
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            k = max(1, int(L / step))
            for j in range(1, k + 1):
                t = j / k
                out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))

        def emit_q(a, c1, b):
            L = math.hypot(c1[0] - a[0], c1[1] - a[1]) + math.hypot(b[0] - c1[0], b[1] - c1[1])
            k = max(2, int(L / step))
            for j in range(1, k + 1):
                t = j / k
                u = 1 - t
                out.append((u * u * a[0] + 2 * u * t * c1[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c1[1] + t * t * b[1]))

        out.append(start)
        for p, on in seq[1:] + [(start, True)]:
            if on:
                if not offs:
                    emit_line(cur, p)
                else:
                    for i, o in enumerate(offs):
                        nxt = p if i == len(offs) - 1 else ((o[0] + offs[i + 1][0]) / 2, (o[1] + offs[i + 1][1]) / 2)
                        emit_q(cur, o, nxt)
                        cur = nxt
                    offs = []
                cur = p
            else:
                offs.append(p)
    return np.array(out) if out else np.zeros((0, 2))


def n_stem(snap, w):
    """The n's left stem across at 0.45 x-height, at weight w of the snapshot's own axis (the weight study's measure)."""
    _, cs, fl = snap.points("n", w)
    y = 0.45 * snap.font["OS/2"].sxHeight + 0.013          # off the sampled points, so no crossing is lost
    xs = []
    for c, f in zip(cs, fl):
        P = flatten([0, [c], [f]], step=2.0)
        for (x0, y0), (x1, y1) in zip(P, np.roll(P, -1, axis=0)):
            if (y0 - y) * (y1 - y) < 0:
                xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
    xs.sort()
    return round(xs[1] - xs[0], 1) if len(xs) >= 2 else None


def deviation(a, b):
    """Greatest distance from either outline to the other (units), and the advance change."""
    if a[1] == b[1] and a[0] == b[0]:
        return 0.0
    A, B = flatten(a), flatten(b)
    if len(A) == 0 or len(B) == 0:
        return float("inf")

    def one(X, Y):
        best = 0.0
        for i in range(0, len(X), 512):
            d = ((X[i:i + 512, None, :] - Y[None, :, :]) ** 2).sum(-1).min(1)
            best = max(best, float(d.max()))
        return math.sqrt(best)
    return round(max(one(A, B), one(B, A)), 1)


# ---------- the character set in groups ----------
GROUPS = [("lower", "Lowercase"), ("upper", "Capitals"), ("fig", "Figures"), ("punct", "Punctuation"),
          ("math", "Currency and maths"), ("arrow", "Arrows and interface signs"), ("accent", "Accented"),
          ("mark", "Marks and modifiers"), ("other", "Other letters and symbols"), ("alt", "Alternates (by feature)")]


def group_of(cp):
    ch = chr(cp)
    cat = unicodedata.category(ch)
    dec = unicodedata.decomposition(ch)
    if 0x2190 <= cp <= 0x21FF or 0x2300 <= cp <= 0x23FF or 0x25A0 <= cp <= 0x27BF or 0x2B00 <= cp <= 0x2BFF:
        return "arrow"
    if cat in ("Sc", "Sm"):
        return "math"
    if cat in ("Nd", "No", "Nl"):
        return "fig"
    if cat.startswith("P"):
        return "punct"
    if cat in ("Mn", "Me", "Sk", "Lm"):
        return "mark"
    if cat in ("Ll", "Lu", "Lt", "Lo"):
        if dec and not dec.startswith("<"):
            return "accent"
        if cat == "Ll":
            return "lower"
        if cat in ("Lu", "Lt"):
            return "upper"
        return "other"
    if cat.startswith("Z") or cat.startswith("C"):
        return None
    return "other"


def alternates(snap):
    """[(glyph, base text, feature tag)] for glyphs reached by a single or ligature substitution in a few features."""
    f = snap.font
    if "GSUB" not in f:
        return []
    t = f["GSUB"].table
    rev = {}
    for cp, g in snap.cmap.items():
        rev.setdefault(g, chr(cp))
    tags = ("ss01", "ss02", "ss03", "ss04", "ss05", "ss06", "ss07", "ss08", "zero", "case", "sups", "subs", "dlig", "liga", "ordn")
    out, seen = [], set(snap.cmap.values())
    for fr in t.FeatureList.FeatureRecord:
        tag = fr.FeatureTag
        if tag not in tags:
            continue
        for li in fr.Feature.LookupListIndex:
            lk = t.LookupList.Lookup[li]
            for st in lk.SubTable:
                if lk.LookupType == 7:
                    st = st.ExtSubTable
                if hasattr(st, "mapping"):
                    for a, b in st.mapping.items():
                        if b not in seen and a in rev:
                            out.append((b, rev[a], tag))
                            seen.add(b)
                elif hasattr(st, "ligatures"):
                    for first, ligs in st.ligatures.items():
                        for lg in ligs:
                            comps = [first] + list(lg.Component)
                            if lg.LigGlyph not in seen and all(c in rev for c in comps):
                                out.append((lg.LigGlyph, "".join(rev[c] for c in comps), tag))
                                seen.add(lg.LigGlyph)
    return out
