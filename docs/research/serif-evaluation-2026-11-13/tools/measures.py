"""Named measures: one number per part per face, so a part can be compared across letters (is it one value?) and
across faces (is Area Serif's relation between two parts the usual one?). All in units of 1000 per em.

Usage: python measures.py  -> measures.json and a printed table"""
import json
import os

import evlib as E


def col_top(sh, x):
    """Thickness of the topmost ink at x."""
    sp = sh.v(x)
    return (sp[-1][1] - sp[-1][0]) if sp else None


def col_bot(sh, x):
    sp = sh.v(x)
    return (sp[0][1] - sp[0][0]) if sp else None


def top_x(sh):
    """x of the highest point (centre of the top plateau)."""
    best, xs = -1e9, []
    x = sh.x0 + 3
    while x < sh.x1 - 3:
        sp = sh.v(x)
        if sp:
            y = sp[-1][1]
            if y > best + 0.25:
                best, xs = y, [x]
            elif abs(y - best) <= 0.25:
                xs.append(x)
        x += 3
    return sum(xs) / len(xs) if xs else None


def bot_x(sh):
    best, xs = 1e9, []
    x = sh.x0 + 3
    while x < sh.x1 - 3:
        sp = sh.v(x)
        if sp:
            y = sp[0][0]
            if y < best - 0.25:
                best, xs = y, [x]
            elif abs(y - best) <= 0.25:
                xs.append(x)
        x += 3
    return sum(xs) / len(xs) if xs else None


def row(sh, y, i):
    sp = sh.h(y)
    if not sp or abs(i) > len(sp):
        return None
    a, b = sp[i]
    return b - a


def min_col(sh, x0, x1, pick, step=2):
    """Thinnest top (pick=-1) or bottom (pick=0) ink between x0 and x1."""
    best = None
    x = x0
    while x <= x1:
        sp = sh.v(x)
        if sp:
            t = sp[pick][1] - sp[pick][0]
            best = t if best is None else min(best, t)
        x += step
    return best


def bar_at(sh, y_lo, y_hi, min_len=30):
    """Thickness of the level bar whose lower edge lies in [y_lo, y_hi] (the longest one)."""
    from test_strokes import bars
    c = [b for b in bars(sh) if y_lo <= b["y0"] <= y_hi and b["x1"] - b["x0"] >= min_len]
    if not c:
        return None
    return max(c, key=lambda b: b["x1"] - b["x0"])["t"]


def measure(f):
    m = E.metrics(f)
    xh, cap = m["xh"], m["cap"]
    S = {ch: E.Shape(f, ch) for ch in E.CORE}
    out = {"xh": xh, "cap": cap, "asc": m["asc"], "desc": m["desc"]}

    def put(k, v):
        out[k] = round(v, 1) if v is not None else None

    # stems
    for ch in "bdfhijklmnpqrtu":
        put(f"stem.{ch}", row(S[ch], xh * (0.45 if ch not in "ft" else 0.3), 0 if ch not in "dqu" else -1))
    put("stem.u.left", row(S["u"], xh * 0.5, 0))
    put("stem.m.mid", row(S["m"], xh * 0.3, 1))
    put("stem.m.right", row(S["m"], xh * 0.3, 2))
    put("stem.n.right", row(S["n"], xh * 0.3, 1))
    put("stem.h.right", row(S["h"], xh * 0.3, 1))
    for ch in "BDEFHIJKLPRTU":
        put(f"STEM.{ch}", row(S[ch], cap * 0.45, 0 if ch != "J" else -1))
    put("STEM.H.right", row(S["H"], cap * 0.45, 1))
    put("STEM.M.right", row(S["M"], cap * 0.2, -1))
    put("STEM.M.left(thin)", row(S["M"], cap * 0.2, 0))
    put("STEM.N.left(thin)", row(S["N"], cap * 0.2, 0))
    put("STEM.N.right(thin)", row(S["N"], cap * 0.8, -1))
    put("STEM.U.right(thin)", row(S["U"], cap * 0.6, -1))
    for ch in "14":
        put(f"FIG.{ch}", row(S[ch], cap * (0.45 if ch == "1" else 0.12), -1 if ch == "4" else 0))
    # round thicks (at the widest: scan the middle third for the max)
    def thick(sh, zone, i):
        vals = [row(sh, zone * fr, i) for fr in (0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65)]
        vals = [v for v in vals if v]
        return max(vals) if vals else None
    for ch, i in (("o", 0), ("o", -1), ("c", 0), ("e", 0), ("b", -1), ("d", 0), ("p", -1), ("q", 0), ("g", 0)):
        put(f"round.{ch}.{'L' if i == 0 else 'R'}", thick(S[ch], xh, i))
    for ch, i in (("O", 0), ("O", -1), ("C", 0), ("G", 0), ("Q", 0), ("Q", -1), ("D", -1), ("0", 0), ("0", -1)):
        put(f"ROUND.{ch}.{'L' if i == 0 else 'R'}", thick(S[ch], cap, i))
    put("ROUND.B.lower", thick(S["B"], cap * 0.5, -1))
    put("ROUND.P", row(S["P"], cap * 0.74, -1))
    put("ROUND.R", row(S["R"], cap * 0.74, -1))
    # round thins: top and bottom of each round
    for ch in "oceasbdpqg":
        sh = S[ch]
        tx, bx = top_x(sh), bot_x(sh)
        if ch in "bdpq":                   # the bowl, not the stem: search the bowl side only
            lo, hi = (sh.x0 + 0.45 * (sh.x1 - sh.x0), sh.x1 - 40) if ch in "bp" else (sh.x0 + 40, sh.x0 + 0.55 * (sh.x1 - sh.x0))
            spans_top = [(x, [s for s in sh.v(x) if s[1] <= xh + 30 and s[0] >= -30]) for x in range(int(lo), int(hi), 3)]
            tops = [s[-1][1] - s[-1][0] for x, s in spans_top if s]
            bots = [s[0][1] - s[0][0] for x, s in spans_top if s]
            put(f"thin.{ch}.top", min(tops) if tops else None)
            put(f"thin.{ch}.bot", min(bots) if bots else None)
        elif ch == "g":
            put("thin.g.top", min_col(sh, sh.x0 + 60, sh.x0 + 0.6 * (sh.x1 - sh.x0), -1))
        else:
            put(f"thin.{ch}.top", min_col(sh, tx - 25, tx + 25, -1) if tx else None)
            put(f"thin.{ch}.bot", min_col(sh, bx - 25, bx + 25, 0) if bx else None)
    for ch in "nhmu":
        sh = S[ch]
        if ch == "u":
            put("thin.u.bot", min_col(sh, sh.x0 + 0.3 * (sh.x1 - sh.x0), sh.x0 + 0.7 * (sh.x1 - sh.x0), 0))
        else:
            st = sh.h(xh * 0.3)
            if len(st) >= 2:
                put(f"thin.{ch}.arch", min_col(sh, st[0][1] + 10, st[1][0] - 5, -1))
    for ch in "OCGQS083":
        sh = S[ch]
        tx, bx = top_x(sh), bot_x(sh)
        put(f"THIN.{ch}.top", min_col(sh, tx - 30, tx + 30, -1) if tx else None)
        if ch != "Q":
            put(f"THIN.{ch}.bot", min_col(sh, bx - 30, bx + 30, 0) if bx else None)
    put("THIN.U.bot", min_col(S["U"], S["U"].x0 + 0.35 * (S["U"].x1 - S["U"].x0), S["U"].x0 + 0.75 * (S["U"].x1 - S["U"].x0), 0))
    put("THIN.J.bot", min_col(S["J"], S["J"].x0 + 20, S["J"].x0 + 0.6 * (S["J"].x1 - S["J"].x0), 0))
    put("THIN.D.top", bar_at(S["D"], cap * 0.85, cap))
    put("THIN.B.top", bar_at(S["B"], cap * 0.85, cap, 60))
    put("THIN.P.top", bar_at(S["P"], cap * 0.85, cap, 60))
    put("THIN.R.top", bar_at(S["R"], cap * 0.85, cap, 60))
    # bars
    put("bar.e", bar_at(S["e"], xh * 0.35, xh * 0.75, 80))
    put("bar.f", bar_at(S["f"], xh * 0.8, xh * 1.05, 60))
    put("bar.t", bar_at(S["t"], xh * 0.8, xh * 1.05, 60))
    put("bar.z.top", bar_at(S["z"], xh * 0.8, xh, 80))
    put("bar.z.bot", bar_at(S["z"], -5, 5, 80))
    put("BAR.A", bar_at(S["A"], cap * 0.2, cap * 0.5, 80))
    put("BAR.H", bar_at(S["H"], cap * 0.35, cap * 0.6, 150))
    put("BAR.E.top", bar_at(S["E"], cap * 0.85, cap, 100))
    put("BAR.E.mid", bar_at(S["E"], cap * 0.35, cap * 0.6, 60))
    put("BAR.E.bot", bar_at(S["E"], -5, 5, 100))
    put("BAR.F.top", bar_at(S["F"], cap * 0.85, cap, 100))
    put("BAR.F.mid", bar_at(S["F"], cap * 0.35, cap * 0.6, 60))
    put("BAR.L", bar_at(S["L"], -5, 5, 100))
    put("BAR.T", bar_at(S["T"], cap * 0.85, cap, 60))
    put("BAR.Z.top", bar_at(S["Z"], cap * 0.85, cap, 100))
    put("BAR.Z.bot", bar_at(S["Z"], -5, 5, 100))
    put("BAR.B.mid", bar_at(S["B"], cap * 0.4, cap * 0.6, 60))
    put("BAR.P.close", bar_at(S["P"], cap * 0.35, cap * 0.6, 60))
    put("BAR.R.close", bar_at(S["R"], cap * 0.35, cap * 0.6, 60))
    put("BAR.G", bar_at(S["G"], cap * 0.3, cap * 0.6, 40))
    put("BAR.2", bar_at(S["2"], -5, 5, 100))
    put("BAR.4", bar_at(S["4"], cap * 0.15, cap * 0.45, 100))
    put("BAR.5", bar_at(S["5"], cap * 0.8, cap, 100))
    put("BAR.7", bar_at(S["7"], cap * 0.8, cap, 100))
    # heights
    for ch in E.CORE:
        put(f"y0.{ch}", S[ch].y0)
        put(f"y1.{ch}", S[ch].y1)
        put(f"adv.{ch}", S[ch].adv)
        put(f"w.{ch}", S[ch].x1 - S[ch].x0)
    return out


def main():
    res = {k: measure(E.face(k)) for k in E.available()}
    os.makedirs(E.OUT, exist_ok=True)
    json.dump(res, open(os.path.join(E.OUT, "measures.json"), "w"))
    keys = [k for k in res["area"] if not k.startswith(("y0.", "y1.", "adv.", "w."))]
    print(f"{'':20}" + "".join(f"{k[:8]:>9}" for k in res))
    for k in keys:
        print(f"{k:20}" + "".join(f"{(res[f][k] if res[f][k] is not None else float('nan')):9.1f}" for f in res))


if __name__ == "__main__":
    main()
