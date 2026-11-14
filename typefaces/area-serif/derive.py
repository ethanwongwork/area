"""Derives Area Serif from Libre Baskerville (SIL OFL 1.1, sources/OFL.txt) by one set of calculated transforms
applied to every glyph, so serifs, curves and weights stay consistent across the set.

Order, all on the designer's own cubic points (sources/LibreBaskerville.glyphs, Regular and Bold masters):
  0. Glyph edits (EDITS): named point edits applied identically to both masters (J on the baseline).
  1. Weight: every point moves along Regular -> Bold by TX (TX_UP for capitals, so their stems match after they are
     scaled down). Uniform interpolation: shapes never change class.
  1b. Contrast (y_expand): every edge moves outward by DELTA times the vertical part of its normal, so horizontal
     strokes thicken by 2*DELTA, vertical stems not at all, diagonals in proportion and still straight. Corners are
     recomputed as the meeting of their moved edges; handles move with their nodes. A linear remap then puts the
     baseline and the x-height (cap height for capitals) back exactly.
  2. Extenders (lowercase only): every point above the x-height zone moves down by ASC_SHIFT, every point below
     the descender zone moves up by DESC_SHIFT; ascenders and descenders get shorter, nothing else moves.
  3. Ball terminals (BALLS): a smooth radial expansion around each ball's centre.
  4. Serif tips: every serif tip (a short vertical edge between a level base and a bracket curve) is set to one
     height, TARGET_TIP, so every serif in the font is the same; the bracket's end node and its handle move with it.
  5. Scale: SCALE sets the x-height; capitals, figures and brackets scale again by UP_SCALE to the cap height.
  6. Smooth joins and 7. soft corners, as before; integer rounding, then near-axis handles snapped.
TX, TX_UP, DELTA, the shifts and the scales are solved from the targets below (solve()).

Usage: python derive.py   -> build/AreaSerif-Regular.ufo (then build.py compiles it)."""
import math
import os
import ufoLib2
import glyphsLib

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "sources", "LibreBaskerville.glyphs")
CACHE = os.path.join(HERE, "build", "libre-baskerville")
OUT = os.path.join(HERE, "build", "AreaSerif-Regular.ufo")

# --- design decisions (per 1000 units of the finished font) -------------------------------------------
# Set from the survey of screen serifs and humanist sans (docs/research/serif-typeface-2026-11-10/legibility.md).
X_HEIGHT = 520           # x-height / em 0.52: the mean of faces designed for screens (Legge and Bigelow 2011)
CAP_HEIGHT = 712         # x / cap 0.73: screen serifs 0.71-0.77, humanist sans 0.72-0.77 (Serrif 0.69)
ASC_RATIO = 1.50         # ascender / x-height: screen serifs 1.40-1.58, humanist sans 1.42-1.52 (was 1.57)
DESC_RATIO = 0.43        # descender / x-height (was 0.47)
TARGET_STEM = 82         # n stem: stem / x-height 0.158, thinner than Serrif 0.173 (owner: thinner regular)
TARGET_CAP_STEM = 90     # H stem
TARGET_CONTRAST = 1.8    # o thick / hairline: text-size screen serifs 1.5-1.9 (Serrif 2.9, Georgia 2.7)
SX = 1.0                 # no narrowing (owner: not too condensed); n advance / x-height comes out at 1.28
BALL_GROWTH = 1.15       # ball terminals: screen serifs carry c terminals of 1.0-1.9 stems (was 0.92)
TARGET_TIP = 30          # serif tip, every serif the same (Serrif 26, Georgia Pro 36, Libre Baskerville 38); 27 to 0.32,
                         # then blunter (owner, 2026-11-12: Georgia Pro's serifs are "not as sharp"): 0.37 of the stem, its ratio
BRACKET_FOOT = 0.80      # foot bracket height, in stems: Serrif 0.86, Georgia Pro 0.78 (was 1.34: stems curved too far)
# Bracket curve shape, as shares of its legs (cubic handles): Serrif's n foot bracket measures about 0.45 up the stem
# and 0.77 along the serif; Libre Baskerville's ran 0.79 and 0.89, nearly a square corner (owner, 2026-11-11: "more
# smooth, less cornered like a slab serif").
BRACKET_K_STEM = 0.45
BRACKET_K_SERIF = 0.75
BRACKET_CAP = 0.80         # capitals: brackets and leaning-back joins 0.8 of the lowercase reach (owner, 2026-11-12:
                           # capital serifs 'too long and heavy ... more subtle'; Georgia Pro's brackets 0.77 stems)
BRACKET_DIAG_OUTER = 0.8   # owner's v, 2026-11-12: the curves should start higher on the stems (raised its joins 6-23)
BRACKET_ACUTE_BLEND = 0.10  # (owner's v: higher still) # how far from the short reach toward Libre Baskerville's the inside join lands
BRACKET_K_ACUTE = 0.55     # a fillet in a leaning-back join: a round arc's handle share
BRACKET_ACUTE_R = 0.75     # its reach from the corner along the serif and along the stroke, in stems
BRACKET_MAX_TURN = 60    # degrees: a curve that meets a diagonal across a sharper corner is not its bracket (0.71)
BRACKET_HEAD = 0.85      # bracket under a head serif or flag: Serrif 0.99, Georgia Pro 0.99 (was 1.85)
ROUND_TO_STEM = 1.05     # 1.12 until 0.39 (owner: thin the thick strokes): 86 units; Serrif 1.12, Georgia Pro 1.11
_ROUND_TO_STEM_WAS = 1.12     # thick part of a lowercase round stroke, in stems: Serrif 1.12, Georgia Pro 1.11 (was 1.22)
ROUND_TO_STEM_UP = 1.07  # 1.13 until 0.39
_ROUND_TO_STEM_UP_WAS = 1.13  # capitals and figures, against H's stem: Serrif 1.12, Georgia Pro 1.14 (was 1.26)
SOFT = 7                 # radius on serif tip corners: slightly rounded, per the owner
LINE_TOTAL = 1200        # line box total; split so capitals sit centred

# Libre Baskerville, measured: Regular and the Bold-minus-Regular difference, in its own units.
LB = dict(xh=530, cap=770, asc=830, desc=-250, stem=95, stem_d=44, cap_stem=105, cap_stem_d=42,
          o_thick=113, o_thick_d=44, hair=51, hair_d=10, nadv=689, nadv_d=38)
SCALE = X_HEIGHT / LB["xh"]
UP_SCALE = CAP_HEIGHT / (LB["cap"] * SCALE)


def solve():
    tx = (TARGET_STEM / SCALE - LB["stem"]) / LB["stem_d"]
    tx_up = (TARGET_CAP_STEM / (SCALE * UP_SCALE) - LB["cap_stem"]) / LB["cap_stem_d"]
    thick = LB["o_thick"] + tx * LB["o_thick_d"]           # vertical-ish edges: y_expand leaves them alone
    hair = LB["hair"] + tx * LB["hair_d"]
    a, x = thick / TARGET_CONTRAST, LB["xh"]
    delta = x * (a - hair) / (2 * (x - a))                  # (hair + 2d) * x / (x + 2d) = a
    return tx, tx_up, delta


TX, TX_UP, DELTA = solve()
T = TX
K_LOW = LB["xh"] / (LB["xh"] + 2 * DELTA)                  # the remap after y_expand
K_UP = LB["cap"] / (LB["cap"] + 2 * DELTA)
_asc_e = ASC_RATIO * X_HEIGHT / SCALE / K_LOW - 2 * DELTA   # ascender after the shift, before y_expand
_desc_e = -DESC_RATIO * X_HEIGHT / SCALE / K_LOW
ASC_SHIFT = LB["asc"] - _asc_e
DESC_SHIFT = _desc_e - LB["desc"]

# Ball terminals: (glyph, centre x, centre y, radius) in Libre Baskerville Regular units, read from its points.
# Ball terminals: (glyph, centre x, centre y, radius, growth) in Libre Baskerville Regular units. Growth per letter
# sets every lowercase ball to about BALL_SIZE stems (parts audit, 2026-11-11: they ran 1.15-1.37; Serrif keeps its
# balls within 1.0-1.07, Georgia Pro 1.06-1.23). r and g's ear are sized by their own edits.
BALL_SIZE = 1.10         # stems; Serrif's balls 0.99-1.07, Georgia Pro's 1.06-1.23 (owner: lean into Serrif)
BALLS = [("a", 112, 430, 48, 0.955), ("c", 458, 456, 50, 1.07), ("f", 468, 765, 50, 1.04),
         ("y", 116, -214, 46, 0.78), ("j", -98, -172, 46, 0.96), ("r", 372, 482, 50, 0.82)]


def j_baseline(pts_r, pts_b):
    """J on the baseline: the hook (every point below the baseline in Regular) rises 248 so its foot sits at the
    baseline overshoot, and the glyph moves 150 right so the ball sits inside its own advance."""
    idx = {k for k, p in enumerate(pts_r) if p.y < 0}
    for pts in (pts_r, pts_b):
        for k, p in enumerate(pts):
            if k in idx:
                p.y += 248
            p.x += 150


def split_at_y_extreme(contour, k0):
    """Split the cubic that starts at on-curve point k0 at its y-extreme, adding one smooth node with level handles
    (de Casteljau, so the shape is unchanged)."""
    from ufoLib2.objects import Point
    pts = contour.points
    p0, c1, c2, p3 = (pts[k0 + j] for j in range(4))
    a = -p0.y + 3 * c1.y - 3 * c2.y + p3.y
    b = 2 * (p0.y - 2 * c1.y + c2.y)
    c = c1.y - p0.y
    roots = [-c / b] if abs(a) < 1e-9 else [(-b + sg * math.sqrt(max(b * b - 4 * a * c, 0))) / (2 * a) for sg in (1, -1)]
    ts = [t for t in roots if 0.02 < t < 0.98]
    if not ts:
        return
    t = ts[0]
    L = lambda u, v: (u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t)
    q0, q1, q2 = L((p0.x, p0.y), (c1.x, c1.y)), L((c1.x, c1.y), (c2.x, c2.y)), L((c2.x, c2.y), (p3.x, p3.y))
    r0, r1 = L(q0, q1), L(q1, q2)
    m = L(r0, r1)
    new = [Point(*q0), Point(r0[0], m[1]), Point(m[0], m[1], "curve", smooth=True), Point(r1[0], m[1]), Point(*q2)]
    contour.points[k0 + 1:k0 + 3] = new


def l_short_flag(pts_r, pts_b):
    """l and 1 were nearly the same at small sizes: l's head flag (1.20 stems) was longer than 1's (1.18). Screen
    serifs keep l's flag at 0.78-1.02 stems. Points 1-4 (the flag tip and its bracket handles) move toward the
    stem's left edge (point 8) by 0.79, so the flag lands near 0.95 stems."""
    for pts in (pts_r, pts_b):
        edge = pts[8].x
        for k in (1, 2, 3, 4):
            pts[k].x = edge - (edge - pts[k].x) * 0.79


def one_long_flag(pts_r, pts_b):
    """1's flag lengthened and sloped, as screen serifs draw it (flag 1.28-1.96 stems, tip 0.12-0.25 of the height
    below the top). Points 2-6 (the flag's upper handle, its tip and the bracket handles) stretch away from the
    stem's left edge (point 10) by 1.44, then turn as one piece about the stem's top-left corner until the tip
    sits 0.20 of the height below the top. Point 1, on the stem side, stays."""
    for pts in (pts_r, pts_b):
        edge, top = pts[10].x, pts[0].y
        for k in (2, 3, 4, 5, 6):
            pts[k].x = edge - (edge - pts[k].x) * 1.44
        px, py = edge, pts[4].y                       # pivot: where the flag's underside meets the stem
        low = pts[4]                                  # the tip's underside: the flag's lowest point
        want = top * (1 - 0.20)
        d = math.dist((low.x, low.y), (px, py))
        a0 = math.atan2(low.y - py, low.x - px)
        a1 = math.atan2(want - py, -math.sqrt(max(d * d - (want - py) ** 2, 0)))
        ang = a1 - a0
        ang = (ang + math.pi) % (2 * math.pi) - math.pi
        ca, sa = math.cos(ang), math.sin(ang)
        for k in (2, 3, 4, 5, 6):
            dx, dy = pts[k].x - px, pts[k].y - py
            pts[k].x, pts[k].y = px + dx * ca - dy * sa, py + dx * sa + dy * ca


def one_long_flag_glyphs(g_r, g_b):
    """one_long_flag, then a node at the top of the flag's underside: sloped down, the underside now rises from the
    tip and turns down into the stem, so that curve has a highest point that needs its own node."""
    one_long_flag([p for c in g_r.contours for p in c.points], [p for c in g_b.contours for p in c.points])
    for g in (g_r, g_b):
        split_at_y_extreme(g.contours[0], 4)


def one_footless(g_r, g_b):
    """1 without a foot serif (Serrif's form): in a serif face l has a foot, so a footless 1 differs from l in its
    whole lower half. The foot's points (11-20) give way to two straight stem ends on the baseline; no other point
    is added. Then the same long, sloped flag as the default 1."""
    from ufoLib2.objects import Point
    for g in (g_r, g_b):
        c = g.contours[0]
        pts = list(c.points)
        left, right = pts[10].x, pts[0].x
        c.points[:] = pts[:11] + [Point(left, 0, "line"), Point(right, 0, "line")]
    one_long_flag_glyphs(g_r, g_b)


def r_balanced(g_r, g_b):
    """r was the most right-heavy r of every serif measured: its ink sat 0.63 stems right of its foot's centre
    (Serrif 0.23, others 0.25-0.44), from a long arm (2.95 stems; Serrif 2.29) and a short right foot (0.86;
    Serrif 1.15). Owner, 2026-11-11: a wider base, more balanced, like Serrif's r.
    - Foot: the right tip (points 31-32) moves out to 1.2 stems; its bracket handle (33) scales with it.
    - Arm: the ball (from point 8's x outward) moves in by R_ARM_IN as one rigid piece; the shoulder between the stem
      and the ball eases over with a smooth ramp, so no curve bends.
    - Width: r must not run into the next letter's foot ("rn" reading as "m"). Screen serifs keep the r-n foot gap
      1.3-2.7 times m's inner foot gap (most 1.7-2.5; Serrif 1.85); R_WIDTH sets it at 1.7. The space this opens
      under the arm is closed by kerning against round letters only (R_KERN_ROUND)."""
    for g in (g_r, g_b):
        pts = g.contours[0].points
        sr, sl = pts[0].x, pts[26].x
        sw = sr - sl
        old = pts[31].x - sr
        new = R_FOOT_RIGHT * sw
        for k in (31, 32):
            pts[k].x = sr + new
        pts[33].x = sr + (pts[33].x - sr) * new / old
        ball = pts[8].x
        for k in range(1, 19):
            t = (pts[k].x - sr) / (ball - sr)
            pts[k].x -= R_ARM_IN * ramp(t, 0, 1)
        g.width += R_WIDTH


R_FOOT_RIGHT = 1.15      # right foot serif, in stems: Serrif 1.15, others 0.84-1.19
R_ARM_IN = 52            # arm reach 2.95 -> 2.29 stems (Serrif 2.29, others 2.1-2.6), in source units
R_WIDTH = 13             # advance change, source units: r-n foot gap 1.7 x m's inner foot gap
R_KERN_ROUND = -(R_ARM_IN + R_WIDTH)   # r + round lowercase: the arm keeps its old distance to o, e, a...
R_GROUP = "public.kern1.KERN_r_1ST"
R_ROUND_GROUPS = ["public.kern2.KERN_a_2ND", "public.kern2.KERN_d_2ND", "public.kern2.KERN_e_2ND",
                  "public.kern2.KERN_g", "public.kern2.KERN_o_2ND", "public.kern2.KERN_s_2ND"]

def j_serrif_hook(g_r, g_b):
    """J's hook from Serrif and Georgia Pro (owner, 2026-11-11). Libre Baskerville's J descends, so its hook ends in
    a small flick meant to hang below the baseline; lifted onto the baseline it kept that flick (ball 1.21 stems,
    reach 2.58, ball top 0.19 cap). Serrif and Georgia end a baseline J in a full ball (1.68 / 1.72 stems) that reaches
    further left (3.41 / 2.72 stems) and rises higher (Georgia 0.34 cap).
    The ball and the free end of the hook move by J_HOOK_MOVE as one piece, easing to nothing at the hook's lowest point
    so the J still stands on the baseline; then the ball grows by J_BALL_GROWTH about its new centre. Runs after
    j_baseline (coordinates already lifted and moved right)."""
    for g in (g_r, g_b):
        pts = g.contours[0].points
        foot = pts[0].x                         # the hook's lowest point: it stays put
        ball_x = pts[26].x                      # the ball's left extreme
        cx, cy = (pts[26].x + pts[20].x) / 2, (pts[23].y + pts[0].y) / 2 + 20
        mx, my = J_HOOK_MOVE
        for p in pts:
            if p.x < foot and p.y < 400:
                w = ramp((foot - p.x) / (foot - ball_x), 0, 0.75)
                p.x, p.y = p.x + mx * w, p.y + my * w
        inflate(g, cx + mx, cy + my, J_BALL_R, J_BALL_GROWTH)
        for p in pts:
            p.x += J_ROOM                       # the advance grows through EDITS' shift (150 + J_ROOM)


def g_short_ear(g_r, g_b):
    """g's ear reached 1.71 stems past the bowl (Serrif 0.95, Georgia Pro 0.90): Libre Baskerville's long ear, then
    the ball growth. Its neck is too short to slide the ball in, so the whole ear (points 20-33) scales by G_EAR_SCALE
    about the point where it leaves the bowl (between points 19 and 34). Then it rises so its top sits at G_EAR_TOP
    times the x-height, Serrif's height (owner, 2026-11-11), solved through the contrast remap. Its points are marked
    "keepzone" so the extender rule, which shortens ascenders, leaves the ear where it is put."""
    for g in (g_r, g_b):
        pts = g.contours[0].points
        ax, ay = (pts[19].x + pts[34].x) / 2, (pts[19].y + pts[34].y) / 2
        top = max(p.y for p in pts[20:34])
        for k in range(20, 34):
            pts[k].x = ax + (pts[k].x - ax) * G_EAR_SCALE
            pts[k].y = ay + (pts[k].y - ay) * G_EAR_SCALE
        want = (G_EAR_TOP * X_HEIGHT / SCALE) / K_LOW - 2 * DELTA
        lift = (want - max(p.y for p in pts[20:34])) if not G_EAR_LB else 0
        for k in range(20, 34):
            pts[k].y += lift
            pts[k].identifier = f"keepzone{k}"


J_HOOK_MOVE = (-52, 100)  # hook reach 2.58 -> about 3.1 stems; ball top 0.19 -> about 0.32 cap
J_BALL_R, J_BALL_GROWTH = 58, 1.11   # ball 1.21 -> about 1.6 stems (Serrif 1.68, Georgia Pro 1.72)
J_ROOM = 70                         # keeps the larger, further ball inside the advance
G_EAR_LB = True                     # owner, 2026-11-12: "redraw the ear based on baskerville": Libre Baskerville's ear, unscaled, at its own height
G_EAR_SCALE = 1.0 if G_EAR_LB else 0.82   # ear ball about 0.85x the lowercase balls (Serrif 0.87x); reach about 1.2 stems
G_EAR_TOP = 1.12                    # ear top / x-height, set on the Serrif overlay at matched x-heights (Serrif measures 1.14 against its own x; Georgia Pro 1.03)

# Extra glyphs made from a base glyph by an edit, and the stylistic set that reaches them.
def _as_base(g, gb):
    """An alternate whose outline is built later from finished letters (charset.single_g): starts as its base."""


ALTS = {"one.ss01": ("one", one_footless, "ss01", "Footless 1"),
        "g.ss02": ("g", _as_base, "ss02", "Single-storey g"),
        # 0.78 (owner, 2026-11-14: "i like the S, s and $ of libre baskerville"): the base's own S and s, through
        # the general rules only (weight, width, lightening); none of the rules written for Area's S and s runs on
        # them (the redrawn width, the notch and spur, the trimmed barbs). The dollar follows in charset.base_s.
        "S.ss03": ("S", _as_base, "ss03", "Baskerville S"),
        "s.ss03": ("s", _as_base, "ss03", "Baskerville S"),
        "dollar.ss03": ("dollar", _as_base, "ss03", "Baskerville S")}

G_LOOP_LIFT = (66, 72)              # Regular, Bold: the loop's hook rises into the link (owner, 2026-11-11)
G_LOOP_RAMP = {61: 0.5, 62: 1, 63: 1, 64: 1, 65: 1, 66: 1, 67: 1, 68: 0.5}


def g_closed_loop(g_r, g_b):
    """Libre Baskerville ends g's loop in a hook that stops about 50 units short of the link (points 61-68), so the
    lower bowl reads open. Serrif and Georgia Pro run the loop back into the link. The hook rises by G_LOOP_LIFT, its
    neighbouring handles by half, so the hook's tip overlaps the link's lower edge by about 15 units; overlap removal
    at build makes the join."""
    for g, lift in zip((g_r, g_b), G_LOOP_LIFT):
        pts = g.contours[0].points
        for k, f in G_LOOP_RAMP.items():
            pts[k].y += lift * f


def g_edits(g_r, g_b):
    g_closed_loop(g_r, g_b)
    g_short_ear(g_r, g_b)


def j_edits(g_r, g_b):
    j_baseline([p for c in g_r.contours for p in c.points], [p for c in g_b.contours for p in c.points])
    j_serrif_hook(g_r, g_b)


EDITS = {"J": (j_edits, 150 + J_ROOM, "glyphs"),   # glyph -> (edit, horizontal shift for components and anchors)
         "g": (g_edits, 0, "glyphs"),
         "l": (l_short_flag, 0), "one": (one_long_flag_glyphs, 0, "glyphs"), "r": (r_balanced, 0, "glyphs")}

def masters():
    if not os.path.exists(os.path.join(CACHE, "LibreBaskerville-Regular.ufo")):
        os.makedirs(CACHE, exist_ok=True)
        glyphsLib.build_masters(SRC, CACHE, minimal=True)
    return (ufoLib2.Font.open(os.path.join(CACHE, "LibreBaskerville-Regular.ufo")),
            ufoLib2.Font.open(os.path.join(CACHE, "LibreBaskerville-Bold.ufo")))


def klass(font, name):
    """'up' (capitals, figures, brackets, currency, math: scaled to the cap height), 'low' (lowercase letters and
    their ligatures: shorter extenders) or 'base' (marks, punctuation, the rest)."""
    import unicodedata
    if name.endswith(".case"):
        return "up"
    g = font[name]
    u = g.unicodes[0] if g.unicodes else None
    if u is None:
        base = name.split(".")[0]
        if "_" in base and all(part.islower() or part in ("i", "j") for part in base.split("_")):
            return "low"
        if base != name and base in font:
            return klass(font, base)
        return "base"
    ch = chr(u)
    cat = unicodedata.category(ch)
    if cat in ("Lu", "Lt", "Nd", "Ps", "Pe", "Sc", "Sm") or ch in "!?#%&@/\\|\u00a1\u00bf*\u2020\u2021\u00a7\u00b6":
        return "up"
    if cat == "Ll":
        return "low"
    return "base"


def tx_for(cls):
    return TX_UP if cls == "up" else TX


def scale_for(cls):
    k = UP_SCALE if cls == "up" else 1.0
    return SCALE * SX * k, SCALE * k


def ramp(v, a, b):
    """0 below a, 1 above b, smooth between."""
    t = min(1.0, max(0.0, (v - a) / (b - a)))
    return t * t * (3 - 2 * t)


def extender_shift(y):
    """Lowercase only: shorten ascenders and descenders; the x-height zone itself never moves."""
    xh = LB["xh"]
    return -ASC_SHIFT * ramp(y, xh + 15, xh + 65) + DESC_SHIFT * ramp(-y, 15, 65)


def inflate(glyph, cx, cy, r, k):
    """Grow a ball terminal: points within r of the centre scale by k about it; the effect fades to nothing by 1.6r,
    so the neck and the stroke beyond are untouched and nothing folds."""
    for c in glyph.contours:
        for p in c.points:
            d = math.dist((p.x, p.y), (cx, cy))
            if d >= 1.6 * r:
                continue
            f = k if d <= r else k - (k - 1) * ramp(d, r, 1.6 * r)
            p.x, p.y = cx + (p.x - cx) * f, cy + (p.y - cy) * f


def serif_tips(contour):
    """Indices (i, j) of serif tips: a vertical line i->j (or j->i) 25-50 units long, whose one end continues as a
    straight line and whose other end continues as a curve (the bracket). Returns (line_end, curve_end) indices."""
    pts = contour.points
    n = len(pts)
    on = [k for k in range(n) if pts[k].type]
    tips = []
    for idx, k in enumerate(on):
        k2 = on[(idx + 1) % len(on)]
        p, q = pts[k], pts[k2]
        if pts[k2].type != "line" or abs(p.x - q.x) > 0.5 or not 25 <= abs(p.y - q.y) <= 50:
            continue
        # neighbours: what comes before p and after q
        before = pts[(k - 1) % n]
        after = pts[(k2 + 1) % n]
        p_curve = before.type is None          # p is reached by a curve
        q_curve = after.type is None           # q leads into a curve
        if p_curve == q_curve:                 # exactly one side must be a bracket
            continue
        line_end, curve_end = (k2, k) if p_curve else (k, k2)
        handle = pts[(curve_end - 1) % n] if p_curve else pts[(curve_end + 1) % n]
        other = pts[(line_end + 1) % n] if p_curve else pts[(line_end - 1) % n]
        lx = other.x - pts[line_end].x
        ly = other.y - pts[line_end].y
        hx = handle.x - pts[curve_end].x
        # a serif tip is the outermost edge of its serif: the straight edge runs off nearly level (a base or a
        # flag, under 25 degrees) and the bracket's handle runs off to the same side. This rejects joins such as
        # a's bowl meeting its stem, where the handle runs straight up.
        if abs(lx) < 1 or abs(ly) / abs(lx) > 0.47 or abs(hx) < 20 or (hx > 0) != (lx > 0):
            continue
        tips.append((line_end, curve_end))
    return tips


def y_expand(glyph, d, z):
    """Thicken horizontal strokes by 2d (see the module notes), then remap so y=0 and y=z stay put."""
    def unit(v):
        l = math.hypot(*v)
        return (v[0] / l, v[1] / l) if l > 1e-9 else None
    for c in glyph.contours:
        pts, n = c.points, len(c.points)
        moves = {}
        for k in range(n):
            p = pts[k]
            if not p.type:
                continue
            uin = uout = None
            for j in range(1, n):                     # skip coincident neighbours
                q = pts[(k - j) % n]
                uin = unit((p.x - q.x, p.y - q.y))
                if uin:
                    break
            for j in range(1, n):
                q = pts[(k + j) % n]
                uout = unit((q.x - p.x, q.y - p.y))
                if uout:
                    break
            if not uin or not uout:
                continue
            nyin, nyout = -uin[0], -uout[0]            # y of the right-hand (away from the ink) normal
            cross = uin[0] * uout[1] - uin[1] * uout[0]
            if abs(cross) < 0.08:                      # smooth or nearly straight: one normal
                mx, my = 0.0, d * (nyin + nyout) / 2
            else:                                      # corner: where the two moved edges meet
                ddy = d * (nyout - nyin)
                s_ = -ddy * uout[0] / cross
                mx, my = s_ * uin[0], d * nyin + s_ * uin[1]
                l = math.hypot(mx, my)
                if l > 3 * d:                          # very sharp corners: cap the move
                    mx, my = mx / l * 3 * d, my / l * 3 * d
            moves[k] = (mx, my)
            for j in ((k - 1) % n, (k + 1) % n):       # handles travel with their node
                if pts[j].type is None:
                    moves[j] = (mx, my)
        for k, (mx, my) in moves.items():
            pts[k].x += mx
            pts[k].y += my
    kz = z / (z + 2 * d)
    for c in glyph.contours:
        for p in c.points:
            p.y = (p.y + d) * kz
    for a in glyph.anchors:
        a.y = (a.y + d) * kz


def thin_serifs(glyph, tip_h):
    for c in glyph.contours:
        pts = c.points
        n = len(pts)
        for line_end, curve_end in serif_tips(c):
            a, b = pts[line_end], pts[curve_end]
            new_h = math.copysign(tip_h, b.y - a.y)
            dy = (a.y + new_h) - b.y
            b.y += dy
            # move the bracket's first handle with its node, so the curve keeps its shape
            nxt = (curve_end + 1) % n if pts[(curve_end + 1) % n].type is None else (curve_end - 1) % n
            if pts[nxt].type is None:
                pts[nxt].y += dy


def keep_monotone(glyph, src):
    """A curve segment that runs one way along x (or y) in the source must not turn back after the transforms
    (extrapolation can push a handle past its node, making a bump and a new extreme). Clamp such a handle
    coordinate into its segment's range. Returns the handles that were clamped, so make_smooth keeps them fixed."""
    fixed = set()
    for ci, (c, cs) in enumerate(zip(glyph.contours, src)):
        pts, n = c.points, len(c.points)
        on = [k for k in range(n) if pts[k].type]
        for idx, k in enumerate(on):
            k2 = on[(idx + 1) % len(on)]
            mids = [(k + j) % n for j in range(1, (k2 - k) % n)]
            if len(mids) != 2 or pts[k2].type != "curve":
                continue
            if any((pts[m].identifier or "").startswith("acute") for m in mids):
                continue                              # a leaning-back join's arc swings past its ends by design
            for ax in ("x", "y"):
                lo_s, hi_s = sorted((getattr(cs[k], ax), getattr(cs[k2], ax)))
                if not all(lo_s - 0.5 <= getattr(cs[m], ax) <= hi_s + 0.5 for m in mids):
                    continue                          # the source itself turns: leave it
                lo, hi = sorted((getattr(pts[k], ax), getattr(pts[k2], ax)))
                for m in mids:
                    v = getattr(pts[m], ax)
                    if v < lo or v > hi:
                        setattr(pts[m], ax, min(hi, max(lo, v)))
                        fixed.add((ci, m))
    return fixed


def _meet(p0, c1, c2, p3):
    """Parameters (s, t) where the handle lines p0->c1 and p3->c2 meet, or None."""
    d1 = (c1.x - p0.x, c1.y - p0.y)
    d2 = (c2.x - p3.x, c2.y - p3.y)
    den = d1[0] * d2[1] - d1[1] * d2[0]
    if abs(den) < 1e-9 or d1 == (0, 0) or d2 == (0, 0):
        return None
    w = (p3.x - p0.x, p3.y - p0.y)
    return (w[0] * d2[1] - w[1] * d2[0]) / den, (w[0] * d1[1] - w[1] * d1[0]) / den


def keep_triangles(glyph, src, limit=0.96):
    """Where the source curve keeps both handles short of the point where the handle lines meet, the result must
    too: a handle that runs past it is shortened along its own direction (the join's tangent never changes)."""
    for c, cs in zip(glyph.contours, src):
        pts, n = c.points, len(c.points)
        on = [k for k in range(n) if pts[k].type]
        for idx, k in enumerate(on):
            k2 = on[(idx + 1) % len(on)]
            mids = [(k + j) % n for j in range(1, (k2 - k) % n)]
            if len(mids) != 2:
                continue
            m_src = _meet(cs[k], cs[mids[0]], cs[mids[1]], cs[k2])
            bracket = any((pts[q].identifier or "").startswith("bracket") for q in (k, k2))
            if not bracket and m_src and m_src[0] > 0 and m_src[1] > 0 and (m_src[0] < 1 or m_src[1] < 1):
                continue                                  # the source does this on purpose (a shortened bracket no longer can)
            m = _meet(pts[k], pts[mids[0]], pts[mids[1]], pts[k2])
            if not m or m[0] <= 0 or m[1] <= 0:
                continue
            s_, t_ = m
            for node, h, par in ((pts[k], pts[mids[0]], s_), (pts[k2], pts[mids[1]], t_)):
                if par < 1:
                    f = par * limit
                    h.x, h.y = node.x + (h.x - node.x) * f, node.y + (h.y - node.y) * f


def make_smooth(glyph, fixed=frozenset()):
    """Collinear handles at every smooth node; a handle next to a line takes the line's direction. Where one
    handle is fixed (clamped by keep_monotone), the other turns to match it."""
    for ci, c in enumerate(glyph.contours):
        pts = c.points
        n = len(pts)
        for k, p in enumerate(pts):
            if not (p.type and p.smooth):
                continue
            a, b = pts[(k - 1) % n], pts[(k + 1) % n]
            fa, fb = (ci, (k - 1) % n) in fixed, (ci, (k + 1) % n) in fixed
            if a.type is None and b.type is None and fa != fb:
                keep, turn = (a, b) if fa else (b, a)
                lk = math.dist((keep.x, keep.y), (p.x, p.y))
                lt = math.dist((turn.x, turn.y), (p.x, p.y))
                if lk > 1e-6 and lt > 1e-6:
                    turn.x = p.x - (keep.x - p.x) / lk * lt
                    turn.y = p.y - (keep.y - p.y) / lk * lt
                continue
            if a.type is None and b.type is None:
                la, lb = math.dist((a.x, a.y), (p.x, p.y)), math.dist((b.x, b.y), (p.x, p.y))
                if la < 1e-6 or lb < 1e-6:
                    continue
                ux = (b.x - p.x) / lb - (a.x - p.x) / la
                uy = (b.y - p.y) / lb - (a.y - p.y) / la
                u = math.hypot(ux, uy)
                if u < 1e-6:                          # handles fold back on each other: leave for pathlint
                    print("cusp at smooth node", glyph.name, k, (round(p.x), round(p.y)))
                    continue
                ux, uy = ux / u, uy / u
                a.x, a.y = p.x - ux * la, p.y - uy * la
                b.x, b.y = p.x + ux * lb, p.y + uy * lb
            elif (a.type is None) != (b.type is None):
                h, line_pt = (a, b) if a.type is None else (b, a)
                lh = math.dist((h.x, h.y), (p.x, p.y))
                ll = math.dist((line_pt.x, line_pt.y), (p.x, p.y))
                if lh < 1e-6 or ll < 1e-6:
                    continue
                ux, uy = (p.x - line_pt.x) / ll, (p.y - line_pt.y) / ll
                h.x, h.y = p.x + ux * lh, p.y + uy * lh


def snap_smooth(glyph, max_deg=6.0):
    """After rounding to integers: at every smooth node whose tangent is within max_deg of horizontal or vertical,
    put both neighbours (handle or line end) exactly on that axis, so no integer rounding leaves a kink."""
    for c in glyph.contours:
        pts = c.points
        n = len(pts)
        for k, p in enumerate(pts):
            if not (p.type and p.smooth):
                continue
            a, b = pts[(k - 1) % n], pts[(k + 1) % n]
            dx = (b.x - p.x) - (a.x - p.x)
            dy = (b.y - p.y) - (a.y - p.y)
            if dx == 0 and dy == 0:
                continue
            ang = math.degrees(math.atan2(abs(dy), abs(dx)))
            if ang <= max_deg:                     # horizontal tangent
                for q in (a, b):
                    if q.type is None:
                        q.y = p.y
            elif ang >= 90 - max_deg:              # vertical tangent
                for q in (a, b):
                    if q.type is None:
                        q.x = p.x


def shorten_brackets(glyph, tips_by_contour, stem):
    """Every serif's bracket climbs at most BRACKET_FOOT (feet) or BRACKET_HEAD (head serifs, flags) stems along its
    stem, so stems run straight like Serrif's and Georgia Pro's. The bracket curve scales vertically toward its serif:
    its two handles and the node where it lands on the stem move, the serif itself does not."""
    for ci, c in enumerate(glyph.contours):
        pts, n = c.points, len(c.points)
        for line_end, curve_end in tips_by_contour.get(ci, []):
            step = 1 if (curve_end - line_end) % n == 1 else -1
            base = pts[curve_end]
            # a bracket may be drawn as up to three curves in a row: follow it to where the straight stem begins
            chain, i = [], curve_end
            for _ in range(3):
                h1, h2, node = (pts[(i + step * j) % n] for j in (1, 2, 3))
                if h1.type is not None or h2.type is not None or node.type is None:
                    break
                chain += [h1, h2, node]
                i = (i + 3 * step) % n
                # a point's type names the segment arriving at it, so walking backwards read the type at i itself
                if (pts[(i + 1) % n].type if step == 1 else pts[i].type) == "line":
                    break
            if not chain:
                continue
            node = chain[-1]
            after = pts[(i + step) % n]
            seg_is_line = (pts[(i + 1) % n].type if step == 1 else pts[i].type) == "line"
            if not (seg_is_line and abs(after.y - node.y) > 20):
                continue                              # lands on a curve, not a straight stroke
            foot = abs(pts[line_end].y) < 5 or pts[line_end].y < -150   # baseline or descender
            limit = (BRACKET_FOOT if foot else BRACKET_HEAD) * stem
            if abs(after.x - node.x) >= 1.5:          # a diagonal stroke (A K V W X Y k v w x y ...)
                if len(chain) not in (3, 6) or abs(chain[0].y - base.y) >= 10:   # A's outer foot handle sits 6 up
                    continue
                # 0.71: a bracket runs into its stroke. Where the last curve meets the straight across a corner
                # it is another stroke ending there, not a bracket: the ampersand's arm met its diagonal at 103
                # degrees and was "shortened" into a solid wedge, the white under the arm filled. Every true
                # bracket arrives within 7 degrees (W's middle one 46), so the line is drawn at 60.
                v1 = (node.x - chain[-2].x, node.y - chain[-2].y)
                v2 = (after.x - node.x, after.y - node.y)
                turn = abs(math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1])))
                if turn > BRACKET_MAX_TURN:
                    continue
                diagonal_bracket(base, chain, after, limit)
                if not node.identifier:
                    node.identifier = f"bracket{ci}_{i}"
                continue
            height = abs(node.y - base.y)
            if height > limit:
                k = limit / height
                for q in chain:
                    q.y = base.y + (q.y - base.y) * k
            if len(chain) == 3:                       # one curve: give it Serrif's round, not a slab's corner
                h1, h2 = chain[0], chain[1]
                if abs(h1.y - base.y) < 6:            # leaves the serif level, as nearly every bracket does
                    h1.x = base.x + (node.x - base.x) * BRACKET_K_SERIF
                    h1.y = base.y
                    h2.x = node.x
                    h2.y = node.y + (base.y - node.y) * BRACKET_K_STEM
            if not node.identifier:
                node.identifier = f"bracket{ci}_{i}"         # keep_triangles holds its handles inside the triangle


def diagonal_bracket(base, chain, after, limit):
    """A bracket from a serif's level top onto a diagonal stroke (owner, 2026-11-11: X, x and the other diagonals
    followed Libre Baskerville's long, curling flares; Georgia Pro and Serrif keep these joins short). The node where
    the bracket meets the stroke slides down the stroke's own straight edge until the bracket is at most `limit` tall,
    then the curve gets the same round as a stem's bracket: its handles run toward the corner where the stroke's edge
    would meet the serif's top, BRACKET_K_STEM along the stroke and BRACKET_K_SERIF along the serif."""
    node = chain[-1]
    dy_line = after.y - node.y
    if abs(dy_line) < 1e-6:
        return
    def on_line(y):                                    # the stroke's straight edge, through node and after
        return node.x + (after.x - node.x) * (y - node.y) / dy_line
    up = 1 if node.y > base.y else -1
    cx, cy = on_line(base.y), base.y                   # the corner the bracket rounds off
    ny = base.y + up * limit if abs(node.y - base.y) > limit else node.y
    nx = on_line(ny)
    if not min(base.x, nx) - 1 <= cx <= max(base.x, nx) + 1:
        # the stroke leans back over its serif (the insides of V, W, X, Y arms and A's feet). Shortening the join
        # there turns it into a stub, so it keeps its reach; but Libre Baskerville's two-curve curl bent inward
        # (owner, 2026-11-12: "the curve is not smooth and instead unnaturally curves inward"). It becomes one
        # round fillet from where it leaves the serif to where it lands on the stroke, tangent to both, its handles
        # toward the corner where the stroke's edge meets the serif's level (BRACKET_K_ACUTE of each side)
        # a join never takes more of a stroke than the straight part it leaves: on a short stroke (A's legs below
        # the crossbar) it lands one stem from the corner, so the leg runs straight down to a short round join
        stem = limit / (BRACKET_FOOT if abs(base.y) < 40 or base.y < -150 else BRACKET_HEAD)
        r0 = BRACKET_ACUTE_R * stem                    # owner, 2026-11-12: "start the curves a bit closer to the
        dn = math.hypot(node.x - cx, node.y - cy)      # serif leg"; then "too far, more of an in between of what
        r = r0 + BRACKET_ACUTE_BLEND * (dn - r0) if dn > r0 else dn   # it previously was"; then V: "the curve at the
                                                       # top is too long" (moved the landing points up): a quarter way
        if dn > r:
            node.x, node.y = cx + (node.x - cx) * r / dn, cy + (node.y - cy) * r / dn
        for q in chain:                                # marks for keep_monotone: this arc turns on purpose
            if q.type is None:
                q.identifier = f"acute{id(q)}"
        # one curve from the serif's end (owner, 2026-11-12: the transition "should be a consistent, gradual, curve";
        # a straight run then a round arc bent suddenly): its handle runs far along the serif, so the bend begins
        # gently and gathers toward the stroke
        c1 = (base.x + (cx - base.x) * BRACKET_K_SERIF, base.y)
        c2 = (node.x + (cx - node.x) * BRACKET_K_ACUTE, node.y + (cy - node.y) * BRACKET_K_ACUTE)
    else:
        if abs(node.y - base.y) > limit * BRACKET_DIAG_OUTER:     # the outside of a diagonal sweeps further
            ny = base.y + up * limit * BRACKET_DIAG_OUTER       # (Serrif), so its curve is gradual
            nx = on_line(ny)
        else:
            nx, ny = node.x, node.y
        node.x, node.y = nx, ny
        c1 = (base.x + (cx - base.x) * BRACKET_K_SERIF, base.y)
        c2 = (node.x + (cx - node.x) * BRACKET_K_STEM, node.y + (cy - node.y) * BRACKET_K_STEM)
    if len(chain) == 3:
        chain[0].x, chain[0].y = c1
        chain[1].x, chain[1].y = c2
        return
    # two curves (Libre Baskerville's curl: up, over, onto the stroke): one round fillet, split at its middle so the
    # middle node and the four handles lie on it
    mid = lambda a, b: ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    c0, c3 = (base.x, base.y), (node.x, node.y)
    m01, m12, m23 = mid(c0, c1), mid(c1, c2), mid(c2, c3)
    a_, b_ = mid(m01, m12), mid(m12, m23)
    for q, xy in zip(chain[:5], (m01, a_, mid(a_, b_), b_, m23)):
        q.x, q.y = xy
    chain[2].smooth = True


def _flat(glyph):
    from fontTools.pens.recordingPen import RecordingPen
    rec = RecordingPen()
    glyph.draw(rec)
    cs, cur = [], None
    for op, args in rec.value:
        if op == "moveTo":
            cur = [args[0]]
            cs.append(cur)
        elif op == "lineTo":
            cur.append(args[0])
        elif op == "curveTo":
            p0 = cur[-1]
            a, b, c = args
            for i in range(1, 17):
                t = i / 16
                u = 1 - t
                cur.append(tuple(u ** 3 * p0[k] + 3 * u * u * t * a[k] + 3 * u * t * t * b[k] + t ** 3 * c[k] for k in (0, 1)))
    return cs


def _spans(cs, y):
    hits = []
    for c in cs:
        for i in range(len(c)):
            a, b = c[i], c[(i + 1) % len(c)]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                t = (y - a[1]) / (b[1] - a[1])
                hits.append((a[0] + t * (b[0] - a[0]), 1 if b[1] > a[1] else -1))
    hits.sort()
    spans, w, st = [], 0, None
    for x, d in hits:
        if w == 0:
            st = x
        w += d
        if w == 0 and x - st > 0.5:
            spans.append((st, x))
    return spans


def thin_rounds(glyph, target):
    """The thick part of every round stroke is at most `target` wide. At each curve extreme with a vertical tangent
    that faces a counter (there is more ink further out along its normal), the node and its handles move into the
    stroke by the excess: the outer shape stays, the counter opens, the thick side gets lighter."""
    cs = _flat(glyph)
    xs = [q[0] for c in cs for q in c]
    if not xs:
        return
    centre = (min(xs) + max(xs)) / 2
    moves = []
    for c in glyph.contours:
        pts, n = c.points, len(c.points)
        for k, p in enumerate(pts):
            a, b = pts[(k - 1) % n], pts[(k + 1) % n]
            if not (p.type == "curve" and a.type is None and b.type is None):
                continue
            if abs(a.x - p.x) > 1.5 or abs(b.x - p.x) > 1.5 or abs(a.y - b.y) < 5:
                continue                              # not an extreme with a vertical tangent
            down = (b.y - a.y) < 0                     # travelling downward
            away = -1 if down else 1                   # right of travel: away from the ink (outer contours ccw)
            if (centre - p.x) * away <= 0:
                continue                              # faces outward: the letter's outline, not a counter
            sp = _spans(cs, p.y + 0.37)
            mine = [s for s in sp if s[0] - 2 <= p.x <= s[1] + 2]
            if not mine:
                continue
            a_, b_ = mine[0]
            width = b_ - a_
            if not (target * 1.02 < width < target * 1.7):
                continue                              # not a thick round stroke
            moves.append(((p, a, b), -away * (width - target)))
    for group, dx in moves:
        for q in group:
            q.x += dx


def soften(glyph, tips_by_contour):
    """Round the two corners of each serif tip with radius SOFT (two on-curve points and a cubic per corner)."""
    from ufoLib2.objects import Point
    for ci, c in enumerate(glyph.contours):
        corners = set()
        for line_end, curve_end in tips_by_contour.get(ci, []):
            corners.add(line_end)
            corners.add(curve_end)
        if not corners or SOFT <= 0:
            continue
        pts = c.points
        n = len(pts)
        out = []
        for k, p in enumerate(pts):
            if k not in corners:
                out.append(p)
                continue
            prev, nxt = pts[(k - 1) % n], pts[(k + 1) % n]

            def toward(q):
                d = math.dist((q.x, q.y), (p.x, p.y))
                r = min(SOFT, d * 0.45)
                return p.x + (q.x - p.x) / d * r, p.y + (q.y - p.y) / d * r
            ax, ay = toward(prev)
            bx, by = toward(nxt)
            k_ = 0.55
            out.append(Point(ax, ay, p.type, smooth=True))         # keeps the incoming segment's type
            out.append(Point(ax + (p.x - ax) * k_, ay + (p.y - ay) * k_, None))
            out.append(Point(bx + (p.x - bx) * k_, by + (p.y - by) * k_, None))
            out.append(Point(bx, by, "curve", smooth=True))
            # if the outgoing segment was a curve, its handles follow from the new point unchanged
        c.points[:] = out


def metrics(font):
    cap = CAP_HEIGHT
    desc = -((LINE_TOTAL - cap) // 2)
    asc = LINE_TOTAL + desc
    i = font.info
    i.familyName, i.styleName = "Area Serif", "Regular"
    i.styleMapFamilyName, i.styleMapStyleName = "Area Serif", "regular"
    i.unitsPerEm = 1000
    i.xHeight, i.capHeight = X_HEIGHT, cap
    i.ascender = round((LB["asc"] - ASC_SHIFT) * SCALE)
    i.descender = round((LB["desc"] + DESC_SHIFT) * SCALE)
    i.openTypeOS2TypoAscender = i.openTypeHheaAscender = asc
    i.openTypeOS2TypoDescender = i.openTypeHheaDescender = desc
    i.openTypeOS2TypoLineGap = i.openTypeHheaLineGap = 0
    i.openTypeOS2Selection = [7]
    i.openTypeOS2WeightClass = 400
    from version import BUILD                          # 0.74: the font's version is the build's (it said 0.003)
    i.versionMajor, i.versionMinor = int(BUILD.split('.')[0]), int(BUILD.split('.')[1].ljust(3, '0'))
    i.copyright = ("Copyright 2012 The Libre Baskerville Project Authors (https://github.com/impallari/Libre-Baskerville). "
                   "Area Serif modifications copyright 2026 Ethan Wong.")
    i.openTypeNameLicense = ("This Font Software is licensed under the SIL Open Font License, Version 1.1. "
                             "This license is available with a FAQ at: https://openfontlicense.org")
    i.openTypeNameLicenseURL = "https://openfontlicense.org"
    i.openTypeNameDesigner = "Impallari Type (Libre Baskerville); Area"
    for attr in ("openTypeNamePreferredFamilyName", "openTypeNamePreferredSubfamilyName", "postscriptFullName",
                 "openTypeNameUniqueID", "openTypeNameVersion", "openTypeNameDescription", "openTypeNameManufacturer",
                 "openTypeNameManufacturerURL", "openTypeNameDesignerURL", "trademark", "openTypeOS2VendorID"):
        setattr(i, attr, None)
    i.postscriptFontName = "AreaSerif-Regular"
    i.openTypeOS2WinAscent, i.openTypeOS2WinDescent = asc + 60, -desc + 60
    return cap, asc, desc


def attach_point(font, name):
    """Where a component attaches: its first anchor starting with '_', else its bounding-box centre."""
    g = font[name]
    for a in g.anchors:
        if a.name.startswith("_"):
            return a.x, a.y
    pts = [(p.x, p.y) for c in g.contours for p in c.points]
    if not pts:
        return 0, 0
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2


def _normalize():
    import normalize
    return normalize


def derive():
    reg, bold = masters()
    out = ufoLib2.Font()
    classes = {name: klass(reg, name) for name in reg.keys()}
    balls = {}
    for gname, cx, cy, r, k in BALLS:
        balls.setdefault(gname, []).append((cx, cy, r, k))
    names = [(n, n) for n in reg.keys()] + [(alt, base) for alt, (base, *_rest) in ALTS.items()]
    for alt, (base, fn, *_r) in ALTS.items():
        classes[alt] = classes[base]
    for name, base in names:
        g, gb = reg[base].copy(), bold[base].copy()
        if name in ALTS:
            ALTS[name][1](g, gb)
        cls = classes[name]
        tx, (sx_c, sy_c) = tx_for(cls), scale_for(cls)
        dx_edit = 0
        if name in EDITS:                                   # 0. glyph edits, same on both masters
            fn, dx_edit, *mode = EDITS[name]
            if mode == ["glyphs"]:
                fn(g, gb)
            else:
                fn([p for c in g.contours for p in c.points], [p for c in gb.contours for p in c.points])
        src = [[type("P", (), {"x": p.x, "y": p.y})() for p in c.points] for c in g.contours]
        ng = out.newGlyph(name)
        ng.unicodes = [] if name in ALTS else list(g.unicodes)
        ng.width = round((g.width + tx * (gb.width - g.width) + dx_edit) * sx_c)
        for c, cb in zip(g.contours, gb.contours):         # 1. weight
            for p, pb in zip(c.points, cb.points):
                p.x, p.y = p.x + tx * (pb.x - p.x), p.y + tx * (pb.y - p.y)
        anchors_b = {a.name: a for a in gb.anchors}
        for a in g.anchors:
            ab = anchors_b.get(a.name, a)
            a.x, a.y = a.x + tx * (ab.x - a.x) + dx_edit, a.y + tx * (ab.y - a.y)
        for cx, cy, r, k in balls.get(name, []):            # 3. ball terminals (before extenders move)
            inflate(g, cx, cy, r, k)
        if cls == "low":                                    # 2. extenders
            for c in g.contours:
                for p in c.points:
                    if not (p.identifier or "").startswith("keepzone"):
                        p.y += extender_shift(p.y)
            for a in g.anchors:
                a.y += extender_shift(a.y)
        y_expand(g, DELTA, LB["cap"] if cls == "up" else LB["xh"])    # 1b. contrast
        tips = {ci: serif_tips(c) for ci, c in enumerate(g.contours)}
        thin_serifs(g, TARGET_TIP / sy_c)                   # 4. serif tips, all one height
        for c in g.contours:                                # 5. scale
            for p in c.points:
                p.x, p.y = p.x * sx_c, p.y * sy_c
        stem_c = TARGET_CAP_STEM if cls == "up" else TARGET_STEM
        N = _normalize()
        if name in N.THIN_X:                               # 5a. x and X: thinner strokes, before their brackets
            N.thin_diagonals(g, *N.THIN_X[name])
        shorten_brackets(g, tips, stem_c * (BRACKET_CAP if cls == "up" else 1))   # 5b. straight stems; capitals' lighter
        if cls in ("low", "up"):                            # 5c. lighter thick parts
            thin_rounds(g, (ROUND_TO_STEM_UP if cls == "up" else ROUND_TO_STEM) * stem_c)
        fixed = keep_monotone(g, src)                       # 6. no new bumps, smooth joins, 7. soft corners
        make_smooth(g, fixed)
        keep_monotone(g, src)
        keep_triangles(g, src)
        soften(g, tips)
        for c in g.contours:
            for p in c.points:
                p.x, p.y = round(p.x), round(p.y)
        make_smooth(g)
        for c in g.contours:
            for p in c.points:
                p.x, p.y = round(p.x), round(p.y)
        snap_smooth(g)
        for c in g.contours:
            for p in c.points:                             # the marks were for this build only
                if (p.identifier or "").startswith("keepzone"):
                    p.identifier = None
            ng.contours.append(c)
        for comp, compb in zip(g.components, gb.components):
            t, tb = list(comp.transformation), list(compb.transformation)
            ox, oy = t[4] + tx * (tb[4] - t[4]) + dx_edit, t[5] + tx * (tb[5] - t[5])
            oy *= K_UP if cls == "up" else K_LOW            # offsets follow the remap
            # keep each component where it was relative to the composite, whatever class it scales with
            ccls = classes.get(comp.baseGlyph, cls)
            csx, csy = scale_for(ccls)
            mx, my = attach_point(reg, comp.baseGlyph)
            t[4] = round(sx_c * ox + (sx_c - csx) * mx)
            t[5] = round(sy_c * oy + (sy_c - csy) * my)
            comp.transformation = tuple(t)
            ng.components.append(comp)
        for a in g.anchors:                                 # moved with the outline above
            a.x, a.y = round(a.x * sx_c), round(a.y * sy_c)
            ng.anchors.append(a)
    out.groups.update({k: list(v) for k, v in reg.groups.items()})
    for pair, v in reg.kerning.items():
        vb = bold.kerning.get(pair, v)
        out.kerning[pair] = round((v + TX * (vb - v)) * SCALE * SX)
    k_scale = SCALE * SX                                # r: close the space under the shorter arm
    for grp in R_ROUND_GROUPS:
        out.kerning[(R_GROUP, grp)] = out.kerning.get((R_GROUP, grp), 0) + round(R_KERN_ROUND * k_scale)
    out.kerning[(R_GROUP, "space")] = out.kerning.get((R_GROUP, "space"), 0) + round(R_KERN_ROUND / 2 * k_scale)
    fea = reg.features.text
    sets = {}
    for alt, (base, _fn, tag, label) in ALTS.items():
        sets.setdefault((tag, label), []).append(f"  sub {base} by {alt};")
    for (tag, label), subs in sets.items():
        fea += f'\nfeature {tag} {{\n  featureNames {{ name "{label}"; }};\n' + "\n".join(subs) + f'\n}} {tag};\n'
    out.features.text = fea
    out.lib["public.glyphOrder"] = list(reg.glyphOrder) + list(ALTS)
    for key in ("public.postscriptNames", "public.openTypeCategories"):
        if key in reg.lib:
            out.lib[key] = reg.lib[key]
    cap, asc, desc = metrics(out)
    out.save(OUT, overwrite=True)
    print(f"derived {len(out)} glyphs  TX={TX:.3f} TX_UP={TX_UP:.3f} DELTA={DELTA:.2f} SCALE={SCALE:.4f} UP={UP_SCALE:.4f} "
          f"shifts {ASC_SHIFT:.1f}/{DESC_SHIFT:.1f}  x {X_HEIGHT} cap {cap} line {asc}/{desc}")
    return out


if __name__ == "__main__":
    derive()
