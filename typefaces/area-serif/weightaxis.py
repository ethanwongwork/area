"""Area Serif: the weight axis in one place (0.82, owner round 8, axis).

The design space is the lowercase stem (n, units per 1000); the user axis is the CSS weight. Owner round 8 renamed the
weights so the family reads less bold and steps more finely: today's Bold (stem 140) is now 800 (ExtraBold), the
Regular stays at 400 (stem 78), today's Light stays at 300 (stem 55). Three scales live here:

  the 0.81 axis   300 to 700 (what every build up to snap082f has, and every audit number written before 0.82)
  the 0.82 axis   300 to 800 (stage A) / 100 to 800 (stage B, a Thin master at stem 32)
  the stem        the design coordinate, the same on both: a place on the axis IS its stem

A glyph at a stem is the same outline whatever the stem is called, so the old and new axes are two names for one set
of places. Every tool that names weights takes them on the 0.82 axis and says so; its default stops are the 0.81 ones
converted here, so its results stay comparable with the audits written before (`from_old`, `place`).

Two readings of "the stem at a weight", and which tool uses which:
  * the formula (`stem`, `stem_old`): geometric between the named masters. The engine (bold.axis_map) and the tools
    that interpolate the masters' own points (audit_axis, audit_bold --sweep, spacing's between-masters pass) use it.
  * the variable font's map (`vf_stem`, `vf_stem_old`): the designspace map is the formula sampled every 50 user units,
    and the font interpolates linearly between those samples (avar). The tools that instance the variable font
    (audit_rays, audit_kern, audit_lean) use `place` / `user`, which go through the two maps, so a 0.81 stop lands on
    the same design place in a 0.82 font (and a 0.82 weight on the same place in a 0.81 font, for comparisons).
"""
import math

REG_STEM = 78
LIGHT_STEM = 55            # the Light master, at 300 on both axes (kept exactly: nothing at 300 changes)
BOLD_STEM = 140            # the Bold master: 700 on the 0.81 axis, 800 (ExtraBold) on the 0.82 axis
THIN_STEM = 32             # stage B: the Thin master at 100 (report A5: the references' median 100/400 and stem/x-height)
THIN = False               # stage B switches the Thin on (axis 100 to 800); stage A's axis is 300 to 800

TOP, OLD_TOP = 800, 700
OLD_BOTTOM = 300


def bottom():
    return 100 if THIN else 300


# The 0.82 names (CSS / OpenType), each with its stem.
NAMES = ((100, "Thin"), (200, "ExtraLight"), (300, "Light"), (400, "Regular"), (500, "Medium"), (600, "SemiBold"),
         (700, "Bold"), (800, "ExtraBold"))


def named():
    return [(w, n) for w, n in NAMES if w >= bottom()]


# ---------------------------------------------------------------- the formula

def stem(w, bold=BOLD_STEM):
    """0.82 axis weight -> stem. Above 400 geometric to the Bold master at 800 (1.157 a step of 100); 300 to 400
    geometric to the Light (55, as before); under 300 geometric to the Thin (32 at 100): 200 is sqrt(32 x 55) = 41.95,
    so the steps 100 > 200 > 300 are one ratio (1.311) and 300 > 400 is 1.418 (as even as 32 / 55 / 78 allow)."""
    if w >= 400:
        return REG_STEM * (bold / REG_STEM) ** ((w - 400) / (TOP - 400))
    if w >= 300:
        return REG_STEM * (LIGHT_STEM / REG_STEM) ** ((400 - w) / 100)
    return LIGHT_STEM * (THIN_STEM / LIGHT_STEM) ** ((300 - w) / 200)


def weight(s, bold=BOLD_STEM):
    """stem -> 0.82 axis weight (the formula's inverse)."""
    if s >= REG_STEM:
        return 400 + (TOP - 400) * math.log(s / REG_STEM) / math.log(bold / REG_STEM)
    if s >= LIGHT_STEM:
        return 400 - 100 * math.log(REG_STEM / s) / math.log(REG_STEM / LIGHT_STEM)
    return 300 - 200 * math.log(LIGHT_STEM / s) / math.log(LIGHT_STEM / THIN_STEM)


def stem_old(w, bold=BOLD_STEM):
    """0.81 axis weight -> stem (bold.axis_map as it was: 700 the Bold, 300 the Light)."""
    if w >= 400:
        return REG_STEM * (bold / REG_STEM) ** ((w - 400) / (OLD_TOP - 400))
    return REG_STEM * (LIGHT_STEM / REG_STEM) ** ((400 - w) / 100)


def weight_old(s, bold=BOLD_STEM):
    if s >= REG_STEM:
        return 400 + (OLD_TOP - 400) * math.log(s / REG_STEM) / math.log(bold / REG_STEM)
    return 400 - 100 * math.log(REG_STEM / s) / math.log(REG_STEM / LIGHT_STEM)


def from_old(w):
    """A 0.81 weight on the 0.82 axis, by the formula (the same stem): 400 + (w - 400) x 4/3 above 400, w under it."""
    return weight(stem_old(w))


def to_old(w):
    """A 0.82 weight on the 0.81 axis, by the formula (None under 300: the 0.81 axis had no such place)."""
    s = stem(w)
    return weight_old(s) if s >= LIGHT_STEM - 1e-9 else None


# ---------------------------------------------------------------- the variable font's map (avar)

def map_weights():
    """The designspace map's user points: every 50 from the bottom to 800."""
    return list(range(bottom(), TOP + 1, 50))


OLD_MAP = list(range(300, OLD_TOP + 1, 50))


def _pl(xs, ys, x):
    if x <= xs[0]:
        return ys[0] + (x - xs[0]) * (ys[1] - ys[0]) / (xs[1] - xs[0])
    for a, b, c, d in zip(xs, xs[1:], ys, ys[1:]):
        if x <= b:
            return c + (x - a) * (d - c) / (b - a)
    return ys[-1] + (x - xs[-1]) * (ys[-1] - ys[-2]) / (xs[-1] - xs[-2])


def vf_stem(w):
    xs = map_weights()
    return _pl(xs, [stem(x) for x in xs], w)


def vf_weight(s):
    xs = map_weights()
    return _pl([stem(x) for x in xs], xs, s)


def vf_stem_old(w):
    return _pl(OLD_MAP, [stem_old(x) for x in OLD_MAP], w)


def vf_weight_old(s):
    return _pl([stem_old(x) for x in OLD_MAP], OLD_MAP, s)


def place(w_old):
    """The 0.82 weight at which a 0.82 variable font has the design place a 0.81 font had at w_old (its stop)."""
    return vf_weight(vf_stem_old(w_old))


def font_axis(tt):
    """'0.81' for an Area Serif variable font whose weight axis ends at 700, else '0.82' (any other font: its own)."""
    if "fvar" not in tt:
        return "static"
    fam = tt["name"].getDebugName(1) or ""
    ax = next(a for a in tt["fvar"].axes if a.axisTag == "wght")
    return "0.81" if ax.maxValue <= OLD_TOP and fam.startswith("Area Serif") else "0.82"


def user(tt, w):
    """A 0.82 weight -> the user coordinate that reaches the same design place on this font's own axis (an Area
    Serif font on the 0.81 axis is converted; every other font is read at w)."""
    if font_axis(tt) != "0.81":
        return w
    return vf_weight_old(vf_stem(w))


# ---------------------------------------------------------------- lists and labels

def parse(text, default_old=None, vf=True):
    """A list of weights on the 0.82 axis from an environment value ("300,350,..."); "old:300,325,..." gives them on
    the 0.81 axis (converted: `place` for the variable-font tools, `from_old` for the engine's). None -> the default
    0.81 stops converted the same way."""
    conv = place if vf else from_old
    if text is None or text == "":
        return tuple(_r(conv(w)) for w in default_old)
    if text.startswith("old:"):
        return tuple(_r(conv(float(w))) for w in text[4:].split(","))
    return tuple(_r(float(w)) for w in text.split(","))


def _r(w):
    r = round(w)
    return r if abs(w - r) < 1e-6 else round(w, 3)


def label(w, vf=True):
    """'433.3 (0.81 axis 425, stem 81.9)': a weight on the 0.82 axis with its 0.81 name and its stem."""
    s = vf_stem(w) if vf else stem(w)
    o = (vf_weight_old(s) if vf else weight_old(s)) if s >= LIGHT_STEM - 1e-6 else None
    ws = f"{w:g}" if float(w).is_integer() else f"{w:.1f}"
    return f"{ws} ({'0.81 axis ' + format(o, '.0f') + ', ' if o is not None else 'not on the 0.81 axis, '}stem {s:.1f})"


def short(w):
    """A weight as printed in a tool's lines: whole, or to a tenth."""
    return f"{w:g}" if float(w).is_integer() else f"{w:.1f}"


AXIS_NOTE = "weights on the 0.82 axis (100/300 to 800; ExtraBold 800 = the 0.81 Bold 700, stem 140)"


if __name__ == "__main__":
    for w, n in NAMES:
        s = stem(w)
        print(f"{w} {n:11s} stem {s:6.2f}  /400 {s / REG_STEM:.3f}  0.81 axis {to_old(w) if to_old(w) is None else round(to_old(w), 1)}")
    print("0.81 stops -> 0.82 (formula / variable font):",
          ", ".join(f"{w}>{from_old(w):.1f}/{place(w):.1f}" for w in range(300, 701, 25)))
