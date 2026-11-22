"""Area Serif 0.84 (Regular pass 6, item 2): the Regular's stroke ladder, one place for every named stroke weight.

The owner (21 November 2026): "The thickness of strokes should be defined to be a range of values and set as a specific
number of values to prevent too much of a wide range of thicknesses across all glyphs... I would like all the
non-Latin-character glyphs to be more cohesive with the letters."

Units per 1000 at the Regular (400). A rule that sets a straight stroke, a hairline or a stem takes its number from
here, never from a loose literal; a value between two steps is a taper or a junction (read by audit_rays), not a step.
The masters carry each step by its own law (bold.py: stems by f, thins by ft, sign strokes 1 + 0.37 ft); this module
names the Regular's values only. The table is copied in the construction skill (`area-serif-construction`, "The
stroke ladder").

Where each value comes from (SKILL rule 2: measured, solved or the owner's):
- TIP 30: every serif's end (derive.TARGET_TIP, 0.38 of the stem).
- SMALL_HAIR 39: the small figures' hairline, the figures' 47 / 86 of the small figures' stem (72 x 47 / 86 = 39.3;
  pass 5 built 38 to 42 as the scaled drawings' level strokes came out). The same units as the thin diagonal.
- THIN_DIAG 39: v w x y's thin diagonal, 0.50 of the stem (balance.THIN_LOW).
- HAIR 43: the lowercase hairline, o's top (0.55 of the stem).
- CAP_HAIR 47: the capitals' and the figures' hairline (0.55 of H's stem; balance.CAP_THIN).
- BAR 52: the lowercase's level bars (t f; the minus was drawn at it, 0.60 H stems).
- SIGN: the sign stroke (pass 6, item 3): every plain stroke outside the letters, maths operators, dashes, slashes and
  bars, arrows, interface symbols, #. Its own step, between the bar and the small figures' stem.
- SMALL_STEM 72: the small figures' stem (pass 5, 0.84 of the figures' 86).
- THICK_DIAG 74: v w x y's thick diagonal; the figures' flat strokes stand at 73, the @'s a's stem at 74.
- STEM 78: n's stem.
- ROUND 82: o's side at its widest.
- CAP_STEM 86: H's stem.
- CAP_ROUND 92: O's side at its widest.
"""

TIP = 30
SMALL_HAIR = 39
THIN_DIAG = 39
HAIR = 43
CAP_HAIR = 47
BAR = 52
SIGN = 58
SMALL_STEM = 72
THICK_DIAG = 74
STEM = 78
ROUND = 82
CAP_STEM = 86
CAP_ROUND = 92

STEPS = [("tip", TIP), ("small-figure hairline", SMALL_HAIR), ("thin diagonal", THIN_DIAG), ("lowercase hairline", HAIR),
         ("capital / figure hairline", CAP_HAIR), ("lowercase bar", BAR), ("sign stroke", SIGN),
         ("small-figure stem", SMALL_STEM), ("thick diagonal / figure flat", THICK_DIAG), ("lowercase stem", STEM),
         ("lowercase round", ROUND), ("capital stem", CAP_STEM), ("capital round", CAP_ROUND)]


def nearest(w):
    """The step nearest a reading: (name, units)."""
    return min(STEPS, key=lambda s: abs(s[1] - w))
