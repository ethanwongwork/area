"""Builds the review page (0.83, the Regular pass, on top of 0.82): "What changed" as finding cards (the 0.83 cards
first, then 0.82's) with small vector panels (each glyph's outline at
300 / 400 / 550 / 700 from the snapshot fonts, this build grey, the build before as a red line), a full-window viewer
(weights, modes, nodes, pan and zoom), the whole character set as live text in the project's own embedded variable
fonts, the weight-scale research and decision, and the growth-balance ranking. It goes on top of the existing
evaluation page; the 0.81 section keeps its text and loses its embedded JPEG strips. Reference faces are numbers only:
their embedded fonts are taken out of the base page.

Reads fonts only from snapshot folders; builds nothing, writes only OUT. Run with the project's venv:

    typefaces/area-serif/.venv/bin/python docs/research/serif-typeface-2026-11-10/tools/page_082.py \\
        --before typefaces/area-serif/build/snap081 --after typefaces/area-serif/build/snap083c \\
        --v080 typefaces/area-serif/build/snap080 [--r82 typefaces/area-serif/build/snap082i] \\
        [--ref083c typefaces/area-serif/build/snap083c] [--prev typefaces/area-serif/build/snap082e] \\
        [--after-label 0.83] [--base PAGE.html] [--out OUT.html]

The 0.83 cards draw --after over --r82 (0.82, the build the 0.83 work started from); the 0.82 cards draw --r82 over
--before (0.81), as they were written. The cards' numbers were measured on snap083c (--ref083c); a later --after (such
as snap083d) is compared with it, and a card whose glyphs moved again says so and drops its "still not right" note,
and the open card leaves out any item that names a glyph that moved. The whole set marks what changed since 0.82 and
since 0.81, and embeds --after, 0.82, 0.81 and 0.80.

Weights: every weight on the page is a value of the "after" font's own axis (read from its fvar; its named instances give
the stops). The older builds are read at the same stem, not the same number: when the "after" font is on the 0.82 axis
(300 to 800) and an older one on the 0.81 axis (300 to 700), `new_to_old` maps between them by the WEIGHTS table at the
top (new 800 = old 700, new 600 = old 550). The cards' weights are written on the 0.82 axis; on an old-axis "after"
font they are drawn at the same stems.
"""
import argparse
import html
import json
import os
import re
import sys
import time
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from p082_cards import CARDS  # noqa: E402
from p082_fonts import GROUPS, Snap, alternates, deviation, group_of, n_stem  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
BUILD = os.path.join(ROOT, "typefaces", "area-serif", "build")

# ---------- weights: the one table every weight number and label on the page comes from ----------
OLD_AXIS = (300, 700)        # the 0.81 axis (0.80, 0.81 and the 0.82 builds up to snap082f)
NEW_AXIS = (300, 800)        # the 0.82 axis (axis-0.81.md, "Owner round 8, axis": Stage A landed, Stage B did not)
# (new-axis weight, name, n stem (weightaxis.py), the 0.81-axis weight with the same stem)
WEIGHTS = [(300, "Light", 55.0, 300), (400, "Regular", 78.0, 400), (500, "Medium", 90.28, 475),
           (600, "SemiBold", 104.50, 550), (700, "Bold", 120.95, 625), (800, "ExtraBold", 140.0, 700)]
MASTERS = [(300, 55), (400, 78), (600, 104.5), (800, 140)]     # the masters on the 0.82 axis and their n stems
OLD_STOPS = [300, 400, 500, 550, 600, 700]                     # the old axis's stops (its named weights and the 550 master)
OLD_NAMES = {300: "Light", 400: "Regular", 500: "Medium", 550: "550", 600: "SemiBold", 700: "Bold"}
STEP = 50                                                      # the viewer stores every STEP units across the font's axis
SAME_STEM = [(w, o) for w, _, _, o in WEIGHTS]                 # new -> old, linear between the rows (the old axis
                                                               # was geometric too, so this is exact at the rows)
# Stage B, the trials under the Light that did not ship (axis-0.81.md, "Stage B"; build/axis082/trial100, trial200)
TRIALS = [(100, "Thin", 32), (200, "ExtraLight", 42)]

LICENSED_EMBEDS = ["EV Source Serif 4", "EV Literata", "EV Newsreader", "EV Merriweather", "EV Crimson Pro"]
CORE7 = ["Serrif", "Georgia Pro", "Source Serif 4", "Literata", "Newsreader", "Merriweather", "Crimson Pro"]
# report.md A1b, median of the seven core: the reference weight with Area's stem / x-height
PLACED = [(300, 245), (400, 337), (500, 410), (550, 457), (600, 507), (700, 616)]
METRIC = {"LR": "gain, left against right", "TB": "gain, top against bottom", "DIAG": "gain on the diagonals (lean)",
          "dRd_per_stem": "right ends, top against bottom", "dLd_per_stem": "left ends, top against bottom",
          "thick_share": "thicks' growth against the stem's", "thin_share": "thins' growth against the stem's"}


def args():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--before", default=os.path.join(BUILD, "snap081"), help="snapshot folder: the build before this round")
    a.add_argument("--after", default=os.path.join(BUILD, "snap083c"), help="snapshot folder: this build")
    a.add_argument("--r82", default=os.path.join(BUILD, "snap082i"), help="snapshot folder: 0.82, the 0.83 cards' before")
    a.add_argument("--r82-label", default="0.82")
    a.add_argument("--ref083c", default=os.path.join(BUILD, "snap083c"),
                   help="snapshot folder the 0.83 cards' numbers were measured on")
    a.add_argument("--v080", default=os.path.join(BUILD, "snap080"), help="snapshot folder: 0.80")
    a.add_argument("--prev", default=os.path.join(BUILD, "snap082e"),
                   help="snapshot folder: the build before items 12 to 14 (drawn only where a card asks for it)")
    a.add_argument("--prev-label", default="082e")
    a.add_argument("--after-label", default="0.83")
    a.add_argument("--before-label", default="0.81")
    a.add_argument("--base", default=os.path.join(BUILD, "pages081", "area-serif-evaluation.html"))
    a.add_argument("--out", default=os.path.join(BUILD, "pages082", "area-serif-evaluation.html"))
    a.add_argument("--weightscale", default=os.path.join(BUILD, "weightscale"))
    a.add_argument("--owner8", default=os.path.join(BUILD, "owner8"))
    return a.parse_args()


class Outlines:
    """Each outline stored once: pool of encodings, O[snap][glyph][weight] = index."""

    def __init__(self, snaps):
        self.snaps, self.pool, self.index, self.O, self.dev = snaps, [], {}, {k: {} for k in snaps}, {}

    def get(self, s, g, w):
        sn = self.snaps[s]
        ow = sn.own(w)                                      # the same stem on that font's own axis
        if g not in sn.order or ow is None:
            return None
        o = self.O[s].setdefault(g, {})
        if w not in o:
            enc = sn.points(g, ow)
            for c, f in zip(enc[1], enc[2]):               # drop a closing point that repeats the start
                if len(c) >= 4 and c[-2:] == c[:2] and f[-1] == "1" and f[0] == "1":
                    del c[-2:]
            for i, (c, f) in enumerate(zip(enc[1], enc[2])):
                if len(f) != len(c) // 2:
                    enc[2][i] = f[:len(c) // 2]
            key = json.dumps(enc, separators=(",", ":"))
            if key not in self.index:
                self.index[key] = len(self.pool)
                self.pool.append(enc)
            o[w] = self.index[key]
        return self.pool[o[w]]

    def diff(self, g, w, f, l):
        k = f"{g}|{w}|{f}|{l}"
        if k not in self.dev:
            a, b = self.get(f, g, w), self.get(l, g, w)
            if a is not None and b is not None:
                self.dev[k] = 0.0 if a == b else deviation(a, b)
        return self.dev.get(k)


def esc(s):
    return html.escape(str(s), quote=True)


def fmt(v, n=3):
    return "" if v is None else (f"{v:+.{n}f}" if isinstance(v, float) else str(v))


# ---------- the axis: page weights are the "after" font's own axis values ----------
def _lerp(pairs, x):
    """Linear between the pairs' rows; None outside them."""
    if x < pairs[0][0] - 1e-9 or x > pairs[-1][0] + 1e-9:
        return None
    for (a, fa), (b, fb) in zip(pairs, pairs[1:]):
        if a - 1e-9 <= x <= b + 1e-9:
            return fa + (fb - fa) * (x - a) / (b - a)
    return pairs[-1][1]


def new_to_old(w):
    """A new-axis weight -> the old-axis weight with the same stem (None below the old axis's lightest)."""
    return _lerp(SAME_STEM, w)


def old_to_new(w):
    return _lerp([(o, n) for n, o in SAME_STEM], w)


def axis_kind(snap):
    """'new' or 'old': by the fvar range, and for a range inside 300 to 700 by the n's stem at 700 (old 140, new 121)."""
    lo, _, hi = snap.axis
    if lo < OLD_AXIS[0] or hi > OLD_AXIS[1]:
        return "new", None
    if hi < 700:
        return "old", None
    s = n_stem(snap, 700)
    old7 = MASTERS[-1][1]
    new7 = next(st for w, _, st, _ in WEIGHTS if w == 700)
    return ("new" if s is not None and abs(s - new7) < abs(s - old7) else "old"), s


def axis_setup(now, others):
    """Sets snap.own (page weight -> that font's own axis value, None where it has no such design) for every snapshot
    and returns the page's weights: all on the "after" font's axis, the others compared at the same stem."""
    kind, stem7 = axis_kind(now)
    now.kind = kind
    for s in [now] + others:
        if s is not now:
            s.kind, _ = axis_kind(s)
        lo, _, hi = s.axis
        conv = (lambda w: w) if s.kind == kind else (new_to_old if kind == "new" else old_to_new)

        def own(w, conv=conv, lo=lo, hi=hi):
            v = conv(w)
            if v is None or v < lo - 1e-6 or v > hi + 1e-6:
                return None
            return int(round(v)) if abs(v - round(v)) < 1e-6 else round(v, 2)
        s.own = own
    lo, dflt, hi = now.axis
    view = list(range(int(-(-lo // STEP) * STEP), int(hi) + 1, STEP))
    if lo not in view:
        view.insert(0, int(lo))
    if hi not in view:
        view.append(int(hi))
    snapv = lambda w: min(view, key=lambda v: abs(v - w))

    def card_w(w_new):                     # a weight written on the 0.82 axis -> the page weight with the same stem
        return snapv(w_new if kind == "new" else new_to_old(w_new))
    inst = [(w, n) for w, n in now.instances if lo <= w <= hi]
    if kind == "old":
        stops = sorted({w for w, _ in inst} | {w for w in OLD_STOPS if lo <= w <= hi}) or OLD_STOPS
        names = OLD_NAMES | dict(inst)
    else:
        stops = sorted({w for w, _ in inst} or {w for w, *_ in WEIGHTS if lo <= w <= hi})
        names = {w: n for w, n, *_ in WEIGHTS} | dict(inst)
    set_w = sorted({int(lo), int(dflt), int(hi)} | {card_w(m) for m, _ in MASTERS})
    samples = sorted(set(range(int(lo), int(hi) + 1, 25)) | {int(lo), int(hi)})
    return {"kind": kind, "stem7": stem7, "axis": [lo, dflt, hi], "view": view, "stops": stops, "names": names,
            "card_w": card_w, "set_w": set_w, "samples": samples}


# ---------- weight scale ----------
def weight_scale(folder, AX, now, after_label):
    """The weight-scale section: what happened to the axis (axis-0.81.md, "Owner round 8, axis"), the references chart,
    the scale table, and the font's own named weights live."""
    S = json.load(open(os.path.join(folder, "scale.json")))
    M = S["measures"]
    ratio = lambda fam, w: M[fam][w]["stem_n"] / M[fam][w]["xh"]
    refs = [[fam, [[int(w), round(ratio(fam, w), 4)] for w in sorted(M[fam], key=int) if int(w) % 100 == 0]] for fam in CORE7 if fam in M]
    xh = M["Area Serif"]["400"]["xh"]
    old = [[int(w), round(ratio("Area Serif", w), 4)] for w in sorted(M["Area Serif"], key=int) if int(w) % 100 == 0]
    lo, _, hi = AX["axis"]
    inst = [(w, n) for w, n in now.instances if lo <= w <= hi]
    own = (lambda w: w) if AX["kind"] == "new" else new_to_old
    measured = {}
    for w, _ in inst:
        ow = own(w)
        measured[w] = None if ow is None else n_stem(now, ow)
    cur = [[w, round(measured[w] / xh, 4)] for w, _ in inst if measured.get(w)]
    reg = next(s for w, _, s, _ in WEIGHTS if w == 400)
    sg = lambda v: f"{v:.1f}".rstrip("0").rstrip(".")
    cols = list(range(100, 1000, 100))
    head = "<thead><tr><th>Stem over x-height</th>" + "".join(f"<th>{c}</th>" for c in cols) + "</tr></thead><tbody>"

    def row(label, pts, own_cls=False):
        d = dict((p[0], p[1]) for p in pts)
        cl = ' class="own"' if own_cls else ""
        return f"<tr><td{cl}>{esc(label)}</td>" + "".join(f"<td{cl}>{d[c]:.3f}</td>" if c in d else f"<td{cl}></td>" for c in cols) + "</tr>"
    table = (head + row(f"Area {after_label} (300 to 800)", cur, True) + row("Area 0.81 (old axis, 300 to 700)", old, True)
             + "".join(row(f, p) for f, p in refs) + "</tbody>")
    r74 = S["proposals"]["ref_700_400"]
    placed = {o: p for o, p in PLACED}
    pl = []
    for w, _, _, o in WEIGHTS:
        if o in placed:
            pl.append(f"Area {w} at {placed[o]}" + ("" if o == w else f" (old {o})"))
    s8 = next(s for w, _, s, _ in WEIGHTS if w == 800)
    s7 = next(s for w, _, s, _ in WEIGHTS if w == 700)
    table_note = ("<tr><td colspan='10' style='text-align:left;white-space:normal;color:var(--ink3)'>Where Area's weights fall on "
                  "the references' scale (median of the seven, by stem over x-height): " + ", ".join(pl) +
                  ". The references' stem at 700 over 400: " + ", ".join(f"{k} {v:.2f}" for k, v in r74.items() if k in CORE7) +
                  f" (median {S['proposals']['ref_700_400_median']:.2f}); Area's 800 over 400 {s8 / reg:.2f}, its 700 over "
                  f"400 {s7 / reg:.2f}.</td></tr>")
    table = table.replace("</tbody>", table_note + "</tbody>")
    stems = ("<thead><tr><th>Weight</th><th style='text-align:left'>Name</th><th>Stem (n)</th><th>Stem / x-height</th>"
             "<th>Over 400</th><th>The 0.81 axis's weight with this stem</th><th>n stem measured in this build</th></tr></thead><tbody>")
    for w, name, s, o in WEIGHTS:
        m = measured.get(w)
        stems += (f"<tr><td class='own'>{w}</td><td style='text-align:left'>{name}</td><td>{sg(s)}</td><td>{s / xh:.3f}</td>"
                  f"<td>{s / reg:.3f}</td><td>{o}</td><td>{'' if m is None else sg(float(m))}</td></tr>")
    stems += "</tbody>"
    pairs = ", ".join(f"{o} → {w}" for w, _, _, o in WEIGHTS)
    lede = (f"<b>The axis is now {NEW_AXIS[0]} to {NEW_AXIS[1]}, and it stays there.</b> The family reads less bold and steps "
            "more finely by renumbering the same designs: the new 800 (ExtraBold) is the 0.81 axis's 700 (stem 140, the Bold "
            "master unchanged), 400 and 300 do not change, and 500 / 600 / 700 sit on one geometric step from 400 to 800 "
            f"(1.157 a step). On the old axis the same stems were: {pairs}. <b>Nothing in any drawing moved.</b> The three "
            "masters, their kerning and the Regular TTF are identical to the build before; the variable font at 300 / 400 / "
            "800 is identical to the old one at 300 / 400 / 700, and at 600 to the old 550; at 500 and 700 it sits on the "
            "formula's stems (90.28, 120.95) where the old font's chords gave 90.39 and 121.10 at 475 and 625, so 251 and 433 "
            "glyphs differ there by 1 unit at most. Measured against seven reference families (numbers only), Area is at "
            "the light end of every weight name: by stem over x-height its 400 (0.150) is the lightest Regular measured "
            "(the references' are 0.171 to 0.191) and sits where the references put weight 337, and its 800 sits at their 616.")
    t1, t2 = TRIALS
    decision = ("<div class='eyebrow'>Your decision</div><ul class='plain' style='color:var(--ink)'>"
                f"<li>The axis runs {NEW_AXIS[0]} to {NEW_AXIS[1]} and stays there; no master under the Light.</li>"
                "<li>800 ExtraBold is the 0.81 axis's 700 (stem 140); 600 SemiBold is its 550 (the mid master, stem 104.5).</li>"
                "<li>300 Light (stem 55) and 400 Regular (stem 78) do not change.</li>"
                "<li>Named weights: " + ", ".join(f"{n} {w}" for w, n, *_ in WEIGHTS) + ".</li></ul>"
                "<div class='eyebrow' style='margin-top:4px'>Tried under the Light, and not shipped</div>"
                "<ul class='plain' style='color:var(--ink2)'>"
                f"<li><b>{t1[1]} at {t1[0]}</b> (stem {t1[2]}). The thin-stroke law held the contrast (stem over o's thinnest "
                "1.47; the references' lightest weights 1.22 to 1.95, Serrif 100 1.50), but the glyphs did not hold: the ray "
                "check failed 49 glyphs and 75 had a place under 16 units (§ down to 1.1); the small 2 threw its base out "
                "into a long wedge; Q's tail, $, 8 and y's crotch grew heavier than at 300; ƴ's tail collapsed; 7 stood "
                "734 high.</li>"
                f"<li><b>{t2[1]} at {t2[0]}</b> (stem {t2[2]}). Better: the small 2 holds and nothing fell back. But the ray "
                "check failed 33 glyphs and 45 had a place under 16 (the small figures' hairline 10.9, ª º 9.4 to "
                "10.6, ƴ's tail 9.4, § 10.6); g's neck came to 26.1 against a target of 28.9; and a fourth master "
                "made the 300 to 800 instances move by up to 2.6 units on 97 glyphs.</li>"
                "<li>What blocks a lighter master, each a rule that was not written: the small figures' flat bars and joins; "
                "the parts that grow towards the light end (Q's tail, $, @, œ's join, y's crotch); the hooks and tails "
                "that thin to nothing (ƴ, ɠ, §, r's ball neck, ƒ); a floor for the small figures' "
                "hairlines; 8's two sides, 7's height, g's neck, w's upright.</li></ul>"
                "<p class='note'>The rules written for the trials are kept but gated: they act only under the Light's stem, "
                "where no master stands, and a build with them in is identical to the 300 to 800 one.</p>")
    legend = [f"Area {after_label}, this build ({NEW_AXIS[0]} to {NEW_AXIS[1]})",
              f"Area 0.81 at its own numbers ({OLD_AXIS[0]} to {OLD_AXIS[1]}): the same stems, numbered lower",
              "the seven reference families (hover a line)"]
    spec = [[w, n, w if AX["kind"] == "new" else own(w),
             f"wght {w}" + ("" if measured.get(w) is None else f", n stem {sg(float(measured[w]))}")] for w, n in inst]
    return {"lede": lede, "refs": refs, "areaNow": cur, "areaNew": old, "table": table, "stems": stems,
            "decision": decision, "spec": spec, "off": None, "legend": legend,
            "chartLab": [f"Area {after_label}", "0.81"], "chartX": [100, 900]}


# ---------- growth balance ----------
BAL_NOTES = {  # from axis-0.81.md, owner round 8, items 12 to 17; weights on the 0.82 axis (measured at 0.81's 700 = 800)
    "2": "Item 12: its flat bar was 73 units at every weight and now grows 51 / 73 / 96 / 126 at 300 / 400 / 600 / 800. "
         "Left: it leans \u22120.029 at 800 (references \u22120.006 to +0.006), and its left against right at 800 is +0.33 "
         "(+0.13 to +0.29).",
    "5": "Item 12: its bar now grows with the figure. Left: its ends at 800 (right \u22120.50, left +0.52): the bowl and ball "
         "grow out under a bar whose ends stay.",
    "7": "Item 12: its bar now grows with the figure (73 at every weight before). Left: its right ends at 800, \u22120.27 "
         "(references \u22120.14 to +0.06): the thicker bar lowers the diagonal's outer corner.",
    "4": "Not changed: the diagonal's outer edge moves out as it thickens while the bar's left end stays. A bar-end rule as "
         "Z's would close it; it was not written.",
    "3": "Item 13: its top and bottom ends now grow alike. Left: top against bottom at 800, \u22120.03 (references \u22120.19 "
         "to \u22120.07).",
    "S": "Item 13: its top and bottom ends now grow alike. Left: left against right +0.02 and top against bottom +0.03 at "
         "800, just outside (the references grow more at the bottom).",
    "s": "Item 13 (its ends were already within 4). Left: its diagonals at 800 (\u22120.29) and at 300 (\u22120.36), and top "
         "against bottom at 300 (+0.07).",
    "g": "Item 14: the loop keeps the Regular's place under the bowl. The top-right end is the ear's ball, which reaches out "
         "at the ball rule. Left against right at 800 (\u22120.21) is still outside: the bowl's left side and the link's turn "
         "grow 2.0 times where the stem grows 1.8.",
    "8": "Not changed. Item 13 measured it: its ends are even (spread 1 at 300 and 800); at 300 the reading is the junction "
         "where the two bowls cross, and the overlays show no lean.",
    "$": "Item 17: its S now runs through the bar as one curve and its four ends grow alike (spread at 300 / 600 / 800: "
         "2 / 3 / 6 \u2192 1 / 1 / 1). Not re-measured on this scale.",
    "Z": "Item 12 also put the Light Z's two corners back on 712 and 0 (they stood at 713 and \u22121). Its After column is "
         "item 4's re-measure, before that.",
}


def _moved(a, b, tol=1):
    """True when two points() readings differ by more than `tol` units anywhere (the remapped axis rounds some
    instances by 1 unit against the old font at the same stem; that is not a change of drawing)."""
    if a[2] != b[2] or len(a[1]) != len(b[1]) or abs(a[0] - b[0]) > tol:
        return True
    for ca, cb in zip(a[1], b[1]):
        if len(ca) != len(cb) or any(abs(x - y) > tol for x, y in zip(ca, cb)):
            return True
    return False


def balance(ws_folder, owner8, changed, cmap, bal_w, to_page=lambda w: w):
    """`to_page`: a weight of the study (measured on the 0.81 axis) -> the page's weight with the same stem."""
    AXW = " and ".join(str(w) for w in bal_w)
    B = json.load(open(os.path.join(ws_folder, "balance.json")))
    after = {}
    # later items re-measured their own glyphs; balance-082f.json is part B on the final build for 2 5 7 4 3 8 S s g
    for f in ("balance-item2.json", "balance-item3.json", "balance-item4.json", "balance-082f.json"):
        p = os.path.join(owner8, f)
        if os.path.exists(p):
            for ch, v in json.load(open(p)).items():
                after[ch] = (f, v)
    order, by = [], {}
    for r in B["outliers"]:
        if r["ch"] not in by:
            order.append(r["ch"])
            by[r["ch"]] = []
        by[r["ch"]].append(r)
    glyphs = []
    for rank, ch in enumerate(order, 1):
        gname = cmap.get(ord(ch)) if len(ch) == 1 else ch
        reads, ins = [], []
        for r in by[ch]:
            av = None
            if ch in after and gname in changed:
                d = after[ch][1].get(str(r["w"]), {})
                av = d.get("gains", {}).get(r["m"], d.get(r["m"]))
            inside = av is not None and r["lo"] <= av <= r["hi"]
            if av is not None:
                ins.append(inside)
            reads.append({"w": to_page(r["w"]), "m": METRIC.get(r["m"], r["m"]), "area": f"{r['area']:+.3f}",
                          "ref": f"{r['lo']:+.3f} .. {r['hi']:+.3f} ({r['med']:+.3f})", "score": f"{r['score']:.1f}",
                          "units": None if r.get("raw") is None else f"{r['raw']:+.0f}", "side": r["side"],
                          "after": None if av is None else f"{av:+.3f}", "inside": inside})
        if gname in changed:
            status = ("fixed" if all(ins) else "part") if ins else "changed"
        else:
            status = "open"
        note = BAL_NOTES.get(ch, "")
        glyphs.append({"rank": rank, "ch": ch, "gname": gname, "score": f"{max(r['score'] for r in by[ch]):.1f}",
                       "reads": reads, "status": status, "note": note})
    n = len(B["outliers"])
    lede = (f"How evenly each glyph gains weight, from the weight-scale study: every glyph at 400 against 300 and "
            f"{to_page(700)} on a "
            f"one-unit raster, its gains split left and right, top and bottom and on the diagonals, its ends read in the top "
            f"and bottom 40%, and its thick and thin strokes on the skeleton. A reading is listed when Area lies outside the "
            f"seven reference families' range; its score is the distance outside over the references' typical spread "
            f"(0.5 or more listed). {n} readings on {len(order)} glyphs, worst first. Measured on 0.81, before this round"
            + (f", at its 300 and 700; on this axis its 700 is {to_page(700)}, the same stem (140), and the weights below "
               "are on this axis." if to_page(700) != 700 else "."))
    note = ("<b>After</b>: the reading again after this round's item, for the glyphs that were re-measured (C, c and G after "
            "item 2; x and X after item 3; z and Z after item 4; 2, 5, 7, 3, S, s and g on the final build, after items 12 to "
            "14; <span class='okv'>green</span> inside the references' range, "
            "<span class='badv'>amber</span> still outside). Glyphs changed this round but not re-measured on this scale (Ə, œ, "
            "&amp;, @, ©, $ and others) are marked so. The drawings are this build over the build before, at " + AXW + ". The thick and "
            "thin readings are coarse (the report's own caution).")
    return {"glyphs": glyphs, "lede": lede, "note": note}


# ---------- the base page ----------
def strip_base(s):
    for fam in LICENSED_EMBEDS:
        s = re.sub(r'@font-face\{font-family:"' + re.escape(fam) + r'";[^}]*\}', "", s)
    s = re.sub(r'("key":"(?:source|literata|newsreader|merriweather|crimson)"[^{}]*?"licence":")[^"]*"', r'\1licensed"', s)
    s = s.replace("The open-source faces are embedded. Georgia Pro and Serrif are licensed, so the page draws them from the "
                  "copies installed on this computer;",
                  "Libre Baskerville and Lora are embedded. The other references are used for measurement only, so the page "
                  "draws them from copies installed on this computer;")
    s = re.sub(r"<!--p082-->.*?<!--/p082-->", "", s, flags=re.S)
    m = re.search(r"<section id='changed-081'.*?</section>", s, flags=re.S)
    if m:
        sec = m.group(0)
        sec = re.sub(r"<img\b[^>]*>", "", sec)
        sec = re.sub(r"<details><summary[^>]*>The figures \(\d+\)</summary>.*?</details>", "", sec, flags=re.S)
        sec = sec.replace("<figure style='margin:18px 0'>", "<figure style='margin:12px 0'>")
        sec = sec.replace("max-width:1400px;margin:0 auto;padding:16px", "max-width:1180px;margin:0 auto;padding:44px 16px 16px", 1)
        intro = ("<h2 style='font:400 30px/1.2 var(--serif);margin:0 0 6px'>0.81, in words</h2><p style='color:var(--ink2);"
                 "max-width:70ch'>The rounds of 0.81, newest first, as they were written. The figure strips that stood under each "
                 "caption are taken out; the drawings of this round are in the cards above.</p>")
        sec = re.sub(r"^(<section id='changed-081'[^>]*>)", lambda k: k.group(1) + intro, sec)
        s = s[:m.start()] + sec + s[m.end():]
        at = m.start()
    else:
        mb = re.search(r"<body[^>]*>", s)
        at = mb.end() if mb else re.search(r"<(main|header|div|section|h1|nav)\b", s).start()
    return s, at


def to_ascii(block):
    """Non-ASCII as escapes: in scripts as \\u, elsewhere as character references."""
    def js(m):
        body = m.group(2)
        out = []
        for ch in body:
            o = ord(ch)
            if o < 128:
                out.append(ch)
            elif o > 0xFFFF:
                o -= 0x10000
                out.append("\\u%04x\\u%04x" % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
            else:
                out.append("\\u%04x" % o)
        return m.group(1) + "".join(out) + m.group(3)
    block = re.sub(r"(<script[^>]*>)(.*?)(</script>)", js, block, flags=re.S)
    return block.encode("ascii", "xmlcharrefreplace").decode()


def main():
    a = args()
    t0 = time.time()
    after_snap = os.path.basename(os.path.normpath(a.after))
    snaps = {"now": Snap(a.after, "now", f"this build ({a.after_label}, {after_snap})"),
             "before": Snap(a.before, "before", a.before_label),
             "v080": Snap(a.v080, "v080", "0.80")}
    if a.r82 and os.path.exists(os.path.join(a.r82, "AreaSerif[wght].ttf")):
        snaps["r82"] = Snap(a.r82, "r82", f"{a.r82_label} ({os.path.basename(os.path.normpath(a.r82))})")
    if a.prev and os.path.exists(os.path.join(a.prev, "AreaSerif[wght].ttf")):
        snaps["prev"] = Snap(a.prev, "prev", f"the build before items 12 to 14 ({a.prev_label})")
    now = snaps["now"]
    AX = axis_setup(now, [s for k, s in snaps.items() if k != "now"])
    VIEW_W, SET_W, card_w = AX["view"], AX["set_w"], AX["card_w"]
    print(f"axis: {AX['axis']} ({AX['kind']}" + (f", n stem at 700 {AX['stem7']}" if AX["stem7"] else "") + "); "
          + ", ".join(f"{k} {s.axis[0]:g}-{s.axis[2]:g} {s.kind}" for k, s in snaps.items()))
    print("same stem, page weight -> own: " + "; ".join(
        k + " " + " ".join(f"{w}>{s.own(w)}" for w in AX["stops"]) for k, s in snaps.items() if k != "now"))
    OL = Outlines(snaps)

    # cards: outlines for every panel, and the viewer's weights for every glyph shown
    # snap083c, where the 0.83 cards' numbers were measured: what moved between it and this build
    same_ref = not a.ref083c or os.path.realpath(a.ref083c) == os.path.realpath(a.after) or \
        not os.path.exists(os.path.join(a.ref083c, "AreaSerif[wght].ttf"))
    ref = None if same_ref else Snap(a.ref083c, "ref083c", os.path.basename(os.path.normpath(a.ref083c)))
    ref_label = os.path.basename(os.path.normpath(a.ref083c or a.after))
    moved_memo = {}

    def moved_since_ref(g):
        """True when glyph g moved (more than a unit, at the page's master weights) between snap083c and this build."""
        if ref is None:
            return False
        if g not in moved_memo:
            if g not in ref.order or g not in now.order:
                moved_memo[g] = g in ref.order or g in now.order
            else:
                lo, _, hi = ref.axis
                moved_memo[g] = any(_moved(now.points(g, w), ref.points(g, w)) for w in SET_W if lo <= w <= hi)
        return moved_memo[g]

    k82 = "r82" if "r82" in snaps else "now"
    cards = []
    for c in CARDS:
        rows = []
        c = dict(c)
        for label, gl, ws, f, l in c["rows"]:
            if c["sec"].startswith("82") and k82 != "now":       # 0.82's cards show 0.82 over 0.81, as written
                f, l = ("r82" if f == "now" else f), ("r82" if l == "now" else l)
                label = label.replace("the build before", a.before_label)
                label = (a.r82_label + label[3:]) if label.startswith("Now") else label
            if (f in snaps) + (l is None or l in snaps) < 2:
                continue
            gl = [g for g in gl if g in now.order]
            ws = sorted({card_w(w) for w in ws})          # written on the 0.82 axis; drawn at the same stems
            for g in gl:
                for w in sorted(set(VIEW_W) | set(ws)):
                    for s in {f, l, "now", "before", k82} - {None}:
                        OL.get(s, g, w)
                    if l:
                        OL.diff(g, w, f, l)
                    OL.diff(g, w, "now", "before")
                    if k82 != "now":
                        OL.diff(g, w, k82, "before")
                    if "v080" in (f, l):
                        OL.diff(g, w, "now", "v080")
                        OL.diff(g, w, "before", "v080")
            rows.append({"label": label, "g": gl, "w": ws, "f": f, "l": l})
        if c["sec"] == "83":
            later = sorted({g for r in rows for g in r["g"] if r["f"] == "now" and moved_since_ref(g)})
            if later:
                c["later"] = later
                c["still"] = ""
        if c.get("items") is not None:
            keep = [t for t, gl in c["items"] if not any(moved_since_ref(g) for g in gl)]
            c["list"] = keep
            c["dropped"] = len(c["items"]) - len(keep)
        if c.get("rules"):
            c["list"] = c["rules"]
        cards.append({k: v for k, v in c.items() if k not in ("rows", "items", "rules")} | {"rows": rows})
    print(f"card outlines: {len(OL.pool)} unique, {time.time() - t0:.1f}s")
    if ref is not None:
        print(f"moved since {ref_label} (card glyphs): " + (" ".join(sorted(g for g, v in moved_memo.items() if v)) or "none"))

    # whole set: what changed this round, what is missing in the older builds
    changed = set()
    for g in now.font.getGlyphOrder():
        if g not in snaps["before"].order:
            continue
        for w in SET_W:
            bw = snaps["before"].own(w)
            if bw is not None and _moved(now.points(g, w), snaps["before"].points(g, bw)):
                changed.add(g)
                break
    print(f"glyphs changed against the build before: {len(changed)}")
    changed82 = set()                                   # since 0.82: this round's moves
    if "r82" in snaps:
        r = snaps["r82"]
        for g in now.font.getGlyphOrder():
            if g not in r.order:
                continue
            for w in SET_W:
                rw = r.own(w)
                if rw is not None and _moved(now.points(g, w), r.points(g, rw)):
                    changed82.add(g)
                    break
        print(f"glyphs changed against {a.r82_label}: {len(changed82)}")
    # 0.82 against 0.81, for the growth-balance section (a study of 0.82)
    if "r82" in snaps:
        r, b = snaps["r82"], snaps["before"]
        bal_changed = set()
        for g in r.font.getGlyphOrder():
            if g in b.order and any(b.own(w) is not None and _moved(r.points(g, w), b.points(g, b.own(w)))
                                    for w in (300, 800)):
                bal_changed.add(g)
    else:
        bal_changed = changed
    top = max(w for w in VIEW_W if snaps["before"].own(w) is not None)
    gs7n, gs7b = now.gs(AX["axis"][2]), snaps["before"].gs(snaps["before"].own(top))
    def adv(g):
        return max(gs7n[g].width, gs7b[g].width if g in snaps["before"].order else 0)
    entries = []
    for cp in sorted(now.cmap):
        g = now.cmap[cp]
        grp = group_of(cp)
        if grp is None or g == ".notdef":
            continue
        fl = (1 if g in changed else 0) | (0 if cp in snaps["before"].cmap else 2) | (0 if cp in snaps["v080"].cmap else 4)
        if "r82" in snaps:
            fl |= (0 if cp in snaps["r82"].cmap else 8) | (16 if g in changed82 else 0)
        entries.append([chr(cp), "", grp, g, round(adv(g)), fl, f"{cp:04X}"])
    v080_feats = {fr.FeatureTag for fr in snaps["v080"].font["GSUB"].table.FeatureList.FeatureRecord}
    b_feats = {fr.FeatureTag for fr in snaps["before"].font["GSUB"].table.FeatureList.FeatureRecord}
    for g, text, tag in alternates(now):
        fl = (1 if g in changed else 0) | (0 if (g in snaps["before"].order and tag in b_feats) else 2) | \
             (0 if (g in snaps["v080"].order and tag in v080_feats) else 4)
        if "r82" in snaps:
            r_feats = {fr.FeatureTag for fr in snaps["r82"].font["GSUB"].table.FeatureList.FeatureRecord}
            fl |= (0 if (g in snaps["r82"].order and tag in r_feats) else 8) | (16 if g in changed82 else 0)
        entries.append([text, tag, "alt", g, round(adv(g)), fl, ""])
    order = {k: i for i, (k, _) in enumerate(GROUPS)}
    entries.sort(key=lambda e: order[e[2]])
    print(f"whole set: {len(entries)} cells")

    chars = {g: chr(cp) for cp, g in sorted(now.cmap.items(), reverse=True)}
    unis = {g: f"{cp:04X}" for cp, g in sorted(now.cmap.items(), reverse=True)}
    for g in {g for c in cards for r in c["rows"] for g in r["g"]}:
        if g not in chars:
            base = g.split(".")[0]
            chars[g] = (chars.get(base, base) + " ." + g.split(".", 1)[1]) if "." in g else g
    ch_used = {g: chars[g] for o in OL.O.values() for g in o if g in chars}
    uni_used = {g: unis[g] for o in OL.O.values() for g in o if g in unis}

    samples = [
        ["Pangram", esc("Sphinx of black quartz, judge my vow. Jackdaws love my big sphinx of quartz."), ""],
        ["Capitals", esc("THE FIVE BOXING WIZARDS JUMP QUICKLY · HAMBURGEFONSTIV"), ""],
        ["Figures and signs", esc("0123456789 · 1,234 · 2026 · ½ ¾ · 3.5% 2‰ · $42 €17 £9 ¢5 · 4 × 7 ÷ 2 ≤ 15 ≥ 9 ± 1 ≠ 0 "
                                  "· a ≈ b ~ c · x^2 · ∞ · ∑ ∏ √ ∆ ◊ · † ‡ *"), ""],
        ["Arrows, keys and shapes", esc("← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↵ ⇤ ⇥ · ⌘ ⌥ ⇧ ⇪ ⌃ ⌫ ⌦ ✓ ✕ · ● ○ ■ □ ▲ ▼ ▶ ◀ ◆ ★ ☆"), ""],
        ["Paragraph", esc("A text face should disappear into the reading. Its weight sits evenly on the line, its curves turn "
                          "without corners, and its signs look drawn by the same hand as its letters: the ampersand & the at "
                          "sign @, the check mark ✓ and the delete key ⌫, the cedi ₵ and the colón ₡. Exact zinc boxes, quick "
                          "oxygen jazz, cozy taxi."), ""],
        ["Regular 400 with Bold 700 (fixed weights)",
         "Set the change log in Regular and the <b>names of the glyphs</b> in Bold: in 0.83 the <b>∑</b>, the "
         "<b>arrows</b> → ↔ ↕, the <b>&amp;</b>, the figures <b>1</b>, <b>3</b>, <b>4</b> and <b>5</b>, the <b>?</b> "
         "and <b>!</b>, <b>Ŋ</b> and <b>ẞ</b> moved, and every <b>sign</b> now sits on one axis.", "emph"],
    ]

    wnote = ""
    olds = [(re.search(r"\(([^()]*)\)$", s.label) or [None, s.label])[1] for k, s in snaps.items()
            if k != "now" and s.kind != AX["kind"]]
    if AX["kind"] == "new":
        pairs = ", ".join(f"{o} \u2192 {w}" for w, _, _, o in WEIGHTS)
        wnote = (f"Every weight on this page is on this build's axis, {AX['axis'][0]:g} to {AX['axis'][2]:g}. The 0.81 axis "
                 f"ran {OLD_AXIS[0]} to {OLD_AXIS[1]}; the same stems on it were: {pairs} (old to new). Nothing in any "
                 "drawing moved with the axis, only the numbers.")
        if olds:
            sw = [(w, snaps["before"].own(w)) for w in AX["stops"] if snaps["before"].own(w) not in (None, w)]
            wnote += (f" The older builds ({', '.join(olds)}) are drawn at the same stem as this build, not the same "
                      f"number: this build's {sw[0][0]} is their {sw[0][1]}, "
                      + ", ".join(f"{w} their {b}" for w, b in sw[1:]) + ".") if sw else ""
        wnote += (" Where a card quotes a number measured on the old axis at a weight that is not one of these, it says "
                  "so, once in that card.")
    elif olds:
        wnote = (f"This build's axis runs {AX['axis'][0]:g} to {AX['axis'][2]:g}; the cards' weights are written on the "
                 f"{NEW_AXIS[0]} to {NEW_AXIS[1]} axis and drawn here at the same stems ("
                 + ", ".join(f"{w} \u2192 {card_w(w)}" for w, _ in MASTERS) + ").")
    data = {
        "after": a.after_label, "before": a.before_label,
        "snaps": {k: s.label for k, s in snaps.items()},
        "xh": now.font["OS/2"].sxHeight, "cap": now.font["OS/2"].sCapHeight,
        # the viewer's fixed frame: the line's top and bottom (hhea), the same for every glyph and weight
        "asc": now.font["hhea"].ascent, "desc": now.font["hhea"].descent,
        "axis": AX["axis"], "kind": AX["kind"], "stops": AX["stops"],
        "names": {str(k): v for k, v in AX["names"].items()},
        "wmap": {k: [[w, s.own(w)] for w in AX["samples"]] for k, s in snaps.items()},
        "own": {k: [s.axis[0], s.axis[2]] for k, s in snaps.items()},
        "balW": [card_w(300), card_w(800)], "emphW": [400, 700], "nchanged": len(changed), "wnote": wnote,
        "k82": k82, "r82": a.r82_label, "nchanged82": len(changed82) if "r82" in snaps else None,
        "afterSnap": after_snap, "refSnap": ref_label,
        "pool": OL.pool, "O": OL.O, "dev": OL.dev, "ch": ch_used, "uni": uni_used,
        "cards": cards, "groups": GROUPS, "set": entries, "samples": samples,
        "ws": weight_scale(a.weightscale, AX, now, a.after_label),
        "bal": balance(a.weightscale, a.owner8, bal_changed, now.cmap, [card_w(300), card_w(800)],
                       (lambda w: w) if AX["kind"] == "old" else (lambda w: card_w(old_to_new(w)))),
    }
    blob = json.dumps(data, separators=(",", ":"), ensure_ascii=True).replace("</", "<\\/")
    print(f"data: {len(blob) // 1024} KB")

    fonts = []
    for k, fam in (("now", "Area Serif now"), ("r82", "Area Serif 082"), ("before", "Area Serif 081"),
                   ("v080", "Area Serif 080")):
        if k not in snaps:
            continue
        b64 = snaps[k].woff2_b64()
        lo, _, hi = snaps[k].axis
        fonts.append(f'@font-face{{font-family:"{fam}";src:url(data:font/woff2;base64,{b64}) format("woff2");'
                     f'font-weight:{lo:g} {hi:g};font-display:block}}')
        print(f"font {fam}: {len(b64) // 1024} KB")

    ui = open(os.path.join(HERE, "p082_ui.html"), encoding="utf-8").read()
    ui = ui.replace("/*__FONTS82__*/", "\n".join(fonts)).replace("__AFTER__", esc(a.after_label)).replace("__BEFORE__", esc(a.before_label))
    ui = ui.replace("__AFTERSNAP__", esc(after_snap)).replace("__R82__", esc(a.r82_label))
    ui = ui.replace("__DATA82__", blob)
    ui = to_ascii(ui)

    base = open(a.base, encoding="utf-8").read()
    base, at = strip_base(base)
    base = re.sub(r"<title>[^<]*</title>", f"<title>Area Serif {esc(a.after_label)} review</title>", base, count=1)
    base = base.replace('<span class="eyebrow">Area Serif · build <span id="b-build"></span>',
                        '<span class="eyebrow">Area Serif · the earlier evaluation page, kept as it was · build '
                        '<span id="b-build"></span>', 1)
    page = base[:at] + ui + base[at:]
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(page)
    print(a.out, f"{os.path.getsize(a.out) / 1e6:.2f} MB", f"{time.time() - t0:.1f}s")


if __name__ == "__main__":
    main()
