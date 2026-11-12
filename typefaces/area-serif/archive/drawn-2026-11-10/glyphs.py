"""Area Serif glyphs. Each function takes a master's values and returns (advance, contours).
Literal numbers are optical decisions for the Text Regular master; anything shared comes from params."""
from kit import Contour, ellipse, stem, rect

GLYPHS = {}


def glyph(name, uni=None):
    def reg(fn):
        GLYPHS[name] = (uni, fn)
        return fn
    return reg


def lc_stem(P, x0, top, foot=None, flag=True):
    foot = (P["serif_proj"], P["serif_proj"]) if foot is None else foot
    return stem(x0, x0 + P["stem"], 0, top, P["serif_tip"], foot=foot, bracket=P["bracket"],
                flag=(P["flag_proj"], P["flag_tip"], P["flag_slope"]) if flag else None, soft=P["soft"])


def cap_stem(P, x0, foot=None, head=None, top=None):
    p = P["cap_serif_proj"]
    return stem(x0, x0 + P["cap_stem"], 0, P["cap"] if top is None else top, P["serif_tip"],
                foot=(p, p) if foot is None else foot, head=(p, p) if head is None else head,
                bracket=P["cap_bracket"], soft=P["soft"])


@glyph("space", 0x20)
def space(P):
    return 236, []


# ---- control glyphs -------------------------------------------------------

@glyph("n", ord("n"))
def n(P):
    s, xh, ov, hair = P["stem"], P["xh"], P["over"], P["hair"]
    x0 = 102                      # left stem
    x2 = x0 + s + (398 - 2 * s)   # right stem; lighter stems widen the counter, not the letter
    top = xh + ov
    left = lc_stem(P, x0, xh)
    pr = P["serif_proj"]
    t, b = P["serif_tip"], P["bracket"]
    a = Contour(x2 - pr, 0)
    a.l(x2 + s + pr, 0).l(x2 + s + pr, t)
    a.c(x2 + s + pr * 0.26, t, x2 + s, t + b * 0.30, x2 + s, t + b)
    a.l(x2 + s, 322)                                           # shoulder starts
    a.c(x2 + s, 442, x2 + s - 62, top, x2 - 60, top)            # outer arch to its top
    a.c(x0 + s + 96, top, x0 + s + 34, top - 34, x0 + s - 8, top - 84)   # down to the branch
    a.l(x0 + s - 8, top - 144)                                 # hidden inside the left stem
    a.c(x0 + s + 26, top - 92, x0 + s + 70, top - 54, x2 - 96, top - 54)  # inner arch
    a.c(x2 - 34, top - 54, x2, top - 96, x2, 318)
    a.l(x2, t + b)
    a.c(x2, t + b * 0.30, x2 - pr * 0.26, t, x2 - pr, t)
    a.l(x2 - pr, 0)
    a = a.rounded([(x2 - pr, 0), (x2 - pr, t), (x2 + s + pr, 0), (x2 + s + pr, t)], P["soft"])
    return x2 + s + 92, [left, a.oriented()]


@glyph("o", ord("o"))
def o(P):
    ov, r, hair = P["over"], P["round"], P["hair"]
    x0, x1 = 38, 38 + r + (472 - 2 * r) + r
    return x1 + 38, [ellipse(x0, -ov, x1, P["xh"] + ov, k=0.56),
                     ellipse(x0 + r, -ov + hair, x1 - r, P["xh"] + ov - hair, k=0.57, counter=True)]


@glyph("H", ord("H"))
def H(P):
    s = P["cap_stem"]
    x0 = 46 + P["cap_serif_proj"]
    x1 = x0 + s + 334
    mid = round(P["cap"] * 0.52)
    return x1 + s + P["cap_serif_proj"] + 46, [
        cap_stem(P, x0), cap_stem(P, x1),
        rect(x0 + s - 10, mid - P["bar"] / 2, x1 + 10, mid + P["bar"] / 2)]


@glyph("O", ord("O"))
def O(P):
    ov, r, hair = P["cap_over"], P["cap_round"], P["hair"]
    x0, x1 = 40, 740
    return x1 + 40, [ellipse(x0, -ov, x1, P["cap"] + ov, k=0.555),
                     ellipse(x0 + r, -ov + hair, x1 - r, P["cap"] + ov - hair, k=0.575, counter=True)]


# ---- kit checks: I l i ----------------------------------------------------

@glyph("I", ord("I"))
def I(P):
    x0 = 46 + P["cap_serif_proj"]
    return x0 + P["cap_stem"] + P["cap_serif_proj"] + 46, [cap_stem(P, x0)]


@glyph("l", ord("l"))
def l(P):
    return 102 + P["stem"] + P["serif_proj"] + 28, [lc_stem(P, 102, P["asc"])]


@glyph("i", ord("i"))
def i(P):
    d = P["dot"]
    cx = 102 + P["stem"] / 2 - 4
    return 102 + P["stem"] + P["serif_proj"] + 28, [
        lc_stem(P, 102, P["xh"]), ellipse(cx - d / 2, 612, cx + d / 2, 612 + d)]


# ---- singular lowercase ---------------------------------------------------

@glyph("e", ord("e"))
def e(P):
    xh, ov, r, hair = P["xh"], P["over"], P["round"], P["hair"]
    top, bot = xh + ov, -ov
    x0, x1 = 38, 472
    bar_c = round(xh * 0.60)
    b0, b1 = bar_c - P["e_bar"] / 2, bar_c + P["e_bar"] / 2
    cx = 258
    c = Contour(cx + 6, bot)
    c.c(366, bot, 428, 44, 466, 116)                 # out to the lower terminal
    c.l(444, 128)                                    # terminal cut
    c.c(410, 72, 352, bot + hair + 4, cx + 14, bot + hair + 4)
    c.c(186, bot + hair + 4, x0 + r, 112, x0 + r, 236)
    c.l(x0 + r, b0).l(x1, b0)                        # under the bar, out to the right
    c.l(x1, b0 + 18)
    c.c(x1, 428, 388, top, cx, top)
    c.c(126, top, x0, 396, x0, 248)
    c.c(x0, 104, 132, bot, cx + 6, bot)
    eye = Contour(x0 + r, b1)
    eye.c(x0 + r, 408, 186, top - hair, cx - 2, top - hair)
    eye.c(330, top - hair, x1 - r, 410, x1 - r, b1)
    eye.l(x0 + r, b1)
    return x1 + 34, [c.oriented(), eye.oriented(counter=True)]


@glyph("a", ord("a"))
def a(P):
    s, xh, ov, hair, ball = P["stem"], P["xh"], P["over"], P["hair"], P["ball"]
    top = xh + ov
    sx = 326                                         # stem left edge
    bx, by = 62, 326                                 # ball terminal: left edge, bottom
    m = Contour(sx, 44)
    m.c(sx, 8, sx + 44, -8, sx + 92, -8)             # under the tail
    m.c(sx + 132, -8, sx + 160, 6, sx + 176, 30)
    m.l(sx + 160, 50)                                # tail tip
    m.c(sx + 146, 34, sx + s, 26, sx + s, 104)
    m.l(sx + s, 336)
    m.c(sx + s, 446, sx + 16, top, 244, top)         # shoulder to the top
    m.c(150, top, bx, 468, bx, by + ball / 2 + 6)    # over to the ball
    m.c(bx, by + 22, bx + 24, by, bx + ball / 2, by)
    m.c(bx + ball - 22, by, bx + ball, by + 24, bx + ball, by + ball / 2 + 2)
    m.c(bx + ball, 430, 196, top - hair - 2, 242, top - hair - 2)   # neck, inner arch
    m.c(292, top - hair - 2, sx, 430, sx, 344)
    m.l(sx, 44)
    bowl = Contour(sx + 14, 312)
    bowl.c(196, 298, 40, 252, 40, 132)
    bowl.c(40, 44, 96, -ov, 176, -ov)
    bowl.c(250, -ov, 304, 22, sx + 14, 64)
    bowl.l(sx + 14, 312)
    cnt = Contour(sx + 6, 266)
    cnt.l(sx + 6, 96)
    cnt.c(sx - 10, 60, 256, 36, 200, 36)
    cnt.c(158, 36, 138, 76, 138, 130)
    cnt.c(138, 214, 232, 254, sx + 6, 266)
    return sx + 176 + 12, [m.oriented(), bowl.oriented(), cnt.oriented(counter=True)]


@glyph("s", ord("s"))
def s(P):
    xh, ov, hair = P["xh"], P["over"], P["hair"]
    top, bot = xh + ov, -ov
    c = Contour(48, 0)
    c.l(66, 0).l(72, 26)
    c.c(108, 2, 158, bot, 216, bot)                  # bottom
    c.c(322, bot, 394, 52, 394, 136)                 # lower right
    c.c(394, 232, 310, 268, 236, 300)                # spine, upper edge
    c.c(180, 326, 146, 348, 146, 384)
    c.c(146, 432, 180, top - hair, 226, top - hair)  # inside the top
    c.c(292, top - hair, 334, 420, 354, 354)
    c.l(376, 354).l(378, top - 10).l(362, top - 10).l(356, top - 26)   # vertical serif
    c.c(328, top - 8, 284, top, 226, top)            # top
    c.c(120, top, 52, 460, 52, 376)                  # upper left
    c.c(52, 296, 130, 244, 200, 214)                 # spine, lower edge
    c.c(262, 188, 300, 164, 300, 124)
    c.c(300, 70, 262, bot + hair, 214, bot + hair)   # inside the bottom
    c.c(150, bot + hair, 92, 84, 70, 152)
    c.l(48, 152).l(48, 0)
    return 394 + 42, [c.oriented()]


@glyph("g.flat")
def g(P):
    xh, ov, hair, desc, r = P["xh"], P["over"], P["hair"], P["desc"], P["round"]
    top = xh + ov
    bx0, bx1, by0 = 46, 412, 182
    bowl = ellipse(bx0, by0, bx1, top, k=0.56)
    bowl_c = ellipse(bx0 + r - 2, by0 + 40, bx1 - r + 2, top - 42, k=0.57, counter=True)
    ear = Contour(360, 440)                          # flat ear with a softened end
    ear.l(476, 440)
    ear.c(484, 440, 490, 446, 490, 454)
    ear.l(490, 474)
    ear.c(490, 482, 484, 488, 476, 488)
    ear.l(350, 488)
    link = Contour(118, 250)
    link.c(92, 228, 72, 182, 72, 132)
    link.c(72, 100, 84, 66, 118, 40)
    link.l(220, 40).l(220, 96).l(160, 96)
    link.c(148, 104, 146, 122, 146, 140)
    link.c(146, 178, 160, 204, 190, 222)
    loop = Contour(22, -98)
    loop.c(22, -166, 122, desc, 250, desc)
    loop.c(390, desc, 488, -146, 488, -58)
    loop.c(488, 30, 420, 96, 300, 96)
    loop.l(150, 96).l(118, 40)
    loop.c(60, 10, 22, -42, 22, -98)
    loop_c = Contour(106, -94)
    loop_c.c(106, -40, 138, 6, 190, 6)
    loop_c.l(322, 6)
    loop_c.c(374, 6, 406, -28, 406, -72)
    loop_c.c(406, -130, 342, desc + hair - 2, 252, desc + hair - 2)
    loop_c.c(166, desc + hair - 2, 106, -142, 106, -94)
    return 512, [bowl, bowl_c, ear.oriented(), link.oriented(), loop.oriented(), loop_c.oriented(counter=True)]


# ---- capitals and figures -------------------------------------------------

def _R_bowl(P):
    """Stem, bowl and counter shared by every R. Proportions measured from Serrif's R (scaled to cap 700):
    a fuller bowl, its widest point just above the middle of the bowl, the lower stroke at 330."""
    s, cap, hair, r = P["cap_stem"], P["cap"], P["hair"], P["cap_round"]
    p = P["cap_serif_proj"]
    x0 = 46 + p
    mid, bx, by = 330, 645, 515                      # bowl underside; widest point
    st = cap_stem(P, x0, head=(p, 0))
    bowl = Contour(x0 + s - 10, mid)
    bowl.l(440, mid)
    bowl.c(560, mid, bx, 420, bx, by)
    bowl.c(bx, 620, 560, cap, 450, cap)
    bowl.l(x0 + s - 10, cap)
    cnt = Contour(x0 + s, cap - hair)
    cnt.l(440, cap - hair)
    cnt.c(520, cap - hair, bx - r, 610, bx - r, by)
    cnt.c(bx - r, 420, 520, mid + hair, 440, mid + hair)
    cnt.l(x0 + s, mid + hair)
    return [st, bowl.oriented(), cnt.oriented(counter=True)], mid


@glyph("R.straight")
def R(P):
    """Straight leg with a foot serif (Georgia Pro's form)."""
    cs, mid = _R_bowl(P)
    t = P["serif_tip"]
    leg = Contour(530, 0)
    leg.l(740, 0).l(740, t)
    leg.c(704, t, 680, 52, 664, 80)
    leg.l(492, mid + 20).l(368, mid + 20).l(560, 64)
    leg.c(552, 48, 544, t, 530, t)
    leg = leg.rounded([(740, 0), (740, t)], P["soft"])
    return 762, cs + [leg.oriented()]


@glyph("zero", ord("0"))
def zero(P):
    ov, hair = P["cap_over"] - 1, P["hair"]
    x0, x1, r = 44, 536, P["fig_stem"] + 8
    return x1 + 44, [ellipse(x0, -ov, x1, P["cap"] + ov, k=0.57),
                     ellipse(x0 + r, -ov + hair, x1 - r, P["cap"] + ov - hair, k=0.585, counter=True)]


@glyph("one", ord("1"))
def one(P):
    s, cap, t, b = P["fig_stem"], P["cap"], P["serif_tip"], P["cap_bracket"]
    x0, pr = 214, 112
    fx = 96                                          # flag tip
    c = Contour(x0 - pr, 0)
    c.l(x0 + s + pr, 0).l(x0 + s + pr, t)
    c.c(x0 + s + pr * 0.26, t, x0 + s, t + b * 0.3, x0 + s, t + b)
    c.l(x0 + s, cap + 6).l(x0 + 44, cap + 6)
    c.l(fx, 652).l(fx, 620)                          # flag
    c.c(x0 - 60, 620, x0, 618, x0, 588)
    c.l(x0, t + b)
    c.c(x0, t + b * 0.3, x0 - pr * 0.26, t, x0 - pr, t)
    c.l(x0 - pr, 0)
    c = c.rounded([(x0 - pr, 0), (x0 - pr, t), (x0 + s + pr, 0), (x0 + s + pr, t), (fx, 652), (fx, 620)], P["soft"])
    return x0 + s + pr + 60, [c.oriented()]


# ---- glyphs with more than one form ----------------------------------------
# Defaults are encoded; alternates are reached by the features in build.py.
# Which form becomes the default is the owner's choice (options page, 2026-11-10).

def _q_bowl(P):
    ov, r, hair = P["cap_over"], P["cap_round"], P["hair"]
    return [ellipse(40, -ov, 740, P["cap"] + ov, k=0.555),
            ellipse(40 + r, -ov + hair, 740 - r, P["cap"] + ov - hair, k=0.575, counter=True)]


@glyph("Q.scotch")
def Q(P):
    """Scotch tail from the bottom of the bowl, sweeping down and right (Georgia's form)."""
    t = Contour(334, 20)
    t.c(352, -64, 400, -150, 520, -176)
    t.c(590, -190, 660, -184, 712, -170)
    t.l(712, -142)
    t.c(650, -150, 590, -150, 548, -136)
    t.c(500, -118, 476, -66, 472, 20)
    return 780, _q_bowl(P) + [t.oriented()]


@glyph("Q", ord("Q"))
def Q_cross(P):
    """Tail that starts inside the bowl and crosses its foot (Serrif's form; default since 2026-11-10)."""
    t = Contour(286, 62)
    t.c(380, 26, 470, -4, 560, -44)
    t.c(650, -84, 740, -104, 820, -100)
    t.l(820, -120)
    t.c(730, -132, 640, -118, 556, -88)
    t.c(460, -54, 370, -8, 268, 32)
    return 830, _q_bowl(P) + [t.oriented()]


@glyph("Q.short")
def Q_short(P):
    """Short tail that stays clear of the line below."""
    t = Contour(372, 6)
    t.c(440, -40, 520, -64, 616, -64)
    t.l(616, -36)
    t.c(560, -32, 510, -10, 470, 30)
    return 780, _q_bowl(P) + [t.oriented()]


def _G(P, spur):
    K = 0.5523
    cx, rx, ry, top, bot = 375, 337, 364, P["cap"] + P["cap_over"], -P["cap_over"]
    hair, r, s = P["hair"], P["cap_round"], P["cap_stem"]
    sx = 524                                          # stem left edge
    c = Contour(650, 468)
    c.l(650, top - 4).l(624, top - 4)                 # beak
    c.c(560, top, 470, top, cx, top)
    c.c(cx - rx * K, top, 38, 350 + ry * K, 38, 350)
    c.c(38, 350 - ry * K, cx - rx * K, bot, cx, bot)
    if spur:
        c.c(450, bot, 500, -6, sx + s, 0)
        c.l(sx + s, 300).l(sx, 300).l(sx, 60)
        c.c(sx - 24, 40, 450, bot + hair, cx, bot + hair)
    else:
        c.c(470, bot, 560, 4, sx + s, 48)
        c.l(sx + s, 300).l(sx, 300).l(sx, 84)
        c.c(sx - 16, 46, 460, bot + hair, cx, bot + hair)
    ix, iy = 38 + r, 350
    c.c(cx - (cx - ix) * K, bot + hair, ix, iy - (iy - bot - hair) * K, ix, iy)
    c.c(ix, iy + (top - hair - iy) * K, cx - (cx - ix) * K, top - hair, cx, top - hair)
    c.c(470, top - hair, 566, 650, 604, 596)
    c.l(604, 468)
    bar = stem(sx, sx + s, 160, 286 + P["bar"], P["bar"], head=(116, 92), bracket=40, soft=P["soft"])
    return 758, [c.oriented(), bar]


@glyph("G", ord("G"))
def G(P):
    """Beak at the top, serifed bar, no spur (Georgia's form)."""
    return _G(P, False)


@glyph("G.spur")
def G_spur(P):
    """Stem runs to the baseline and ends in a spur (Serrif's alternate)."""
    return _G(P, True)


@glyph("R", ord("R"))
def R_curved(P):
    """Curved leg that turns down to the baseline and ends in a foot serif to the right (Serrif's form; default
    since 2026-11-10). Edges follow Serrif's measured leg, scaled to cap 700."""
    cs, mid = _R_bowl(P)
    t, end = P["serif_tip"], 754
    leg = Contour(566, 0)
    leg.l(end, 0).l(end, t)
    leg.c(700, t, 652, 44, 642, 78)                  # bracket up into the leg
    leg.c(620, 140, 582, 236, 486, mid + 26)         # right edge, concave; ends inside the bowl's lower stroke
    leg.l(378, mid + 26)
    leg.c(470, 300, 518, 200, 532, 78)               # left edge
    leg.l(566, 0)
    leg = leg.rounded([(end, 0), (end, t)], P["soft"])
    return 760, cs + [leg.oriented()]


def _J(P, drop):
    """Proportions measured from Serrif's J (scaled to cap 700): a wide hook, the ball well to the left."""
    s, cap, hair = P["cap_stem"], P["cap"], P["hair"]
    x0, x1 = 328, 328 + s
    b = drop                                          # how far the hook sits below the baseline
    st = stem(x0, x1, 180 - b, cap, P["serif_tip"], head=(116, 104), bracket=P["cap_bracket"], soft=P["soft"])
    h = Contour(x1, 182 - b)
    h.c(x1, 58 - b, 330, -8 - b, 212, -8 - b)         # outer bowl of the hook
    h.c(124, -8 - b, 56, 34 - b, 30, 100 - b)
    h.l(104, 148 - b)                                 # under the ball
    h.c(118, 96 - b, 152, -8 + hair - b, 214, -8 + hair - b)
    h.c(282, -8 + hair - b, x0, 84 - b, x0, 182 - b)
    ball = ellipse(12, 94 - b, 118, 204 - b)
    return 548, [st, h.oriented(), ball]


@glyph("J", ord("J"))
def J(P):
    """Sits on the baseline with a ball (both references)."""
    return _J(P, 0)


@glyph("J.long")
def J_long(P):
    """Descends below the baseline."""
    return _J(P, 170)


def _y(P, tail):
    xh, t, soft = P["xh"], P["serif_tip"], P["soft"]
    top = xh
    cs = [rect(28, top - t, 262, top).rounded([(28, top - t), (28, top), (262, top), (262, top - t)], soft),
          rect(338, top - t, 506, top).rounded([(338, top - t), (338, top), (506, top), (506, top - t)], soft)]
    thick = Contour(84, top - t + 2).l(196, top - t + 2).l(272, 40).l(252, -4).l(204, -4)
    cs.append(thick.oriented())
    if tail == "ball":
        th = Contour(398, top - t + 2)
        th.l(448, top - t + 2).l(236, -96)
        th.c(206, -170, 158, -208, 92, -208)
        th.l(80, -166)
        th.c(130, -166, 160, -140, 186, -96)
        cs += [th.oriented(), ellipse(20, -212, 124, -108)]
    else:
        th = Contour(398, top - t + 2).l(448, top - t + 2).l(208, -172).l(158, -172)
        f = rect(84, -210, 282, -170).rounded([(84, -210), (84, -170), (282, -170), (282, -210)], soft)
        cs += [th.oriented(), f]
    return 522, cs


@glyph("y", ord("y"))
def y(P):
    """Thin stroke ending in a ball (both references)."""
    return _y(P, "ball")


@glyph("y.foot")
def y_foot(P):
    """Straight tail with a flat foot serif."""
    return _y(P, "foot")


def _ball_ear(P):
    neck = Contour(330, 452)
    neck.c(368, 472, 400, 480, 430, 480)
    neck.l(436, 520)
    neck.c(398, 520, 360, 508, 318, 486)
    return [neck.oriented(), ellipse(404, 450, 496, 542)]


@glyph("g", ord("g"))
def g_ball(P):
    """Two-story g with a ball ear (Serrif's form; default since 2026-11-10)."""
    adv, cs = g(P)
    return adv, cs[:2] + _ball_ear(P) + cs[3:]


def _one_story_bowl(P, sx):
    ov, hair, r = P["over"], P["hair"], P["round"]
    top = P["xh"] + ov
    return [ellipse(36, -ov, sx + 70, top, k=0.56),
            ellipse(36 + r, -ov + hair, sx, top - hair, k=0.57, counter=True)]


@glyph("g.single")
def g_single(P):
    """One-story g (Serrif's alternate)."""
    s, desc, hair = P["stem"], P["desc"], P["hair"]
    sx = 372
    st = stem(sx, sx + s, -60, P["xh"] + P["over"], P["serif_tip"])
    ear = rect(sx + 40, P["xh"] - 38, sx + s + 62, P["xh"] + 2).rounded(
        [(sx + s + 62, P["xh"] - 38), (sx + s + 62, P["xh"] + 2)], P["soft"])
    h = Contour(sx + s, -58)
    h.c(sx + s, -170, sx + 2, desc, 250, desc)
    h.c(160, desc, 94, -184, 74, -146)
    h.l(124, -116)
    h.c(146, -154, 196, desc + hair, 250, desc + hair)
    h.c(330, desc + hair, sx, -132, sx, -58)
    ball = ellipse(30, -208, 132, -106)
    return sx + s + 74, _one_story_bowl(P, sx) + [st, ear.oriented(), h.oriented(), ball]


@glyph("a.single")
def a_single(P):
    """One-story a (Serrif's alternate)."""
    s, pr = P["stem"], P["serif_proj"]
    sx = 372
    st = stem(sx, sx + s, 0, P["xh"] + P["over"], P["serif_tip"], foot=(0, pr), bracket=P["bracket"], soft=P["soft"])
    return sx + s + pr + 18, _one_story_bowl(P, sx) + [st]


@glyph("one.plain")
def one_plain(P):
    """Flag without a foot serif (Serrif's form)."""
    s, cap = P["fig_stem"], P["cap"]
    x0, fx = 178, 60
    c = Contour(x0, 0).l(x0 + s, 0).l(x0 + s, cap + 6).l(x0 + 44, cap + 6)
    c.l(fx, 652).l(fx, 620)
    c.c(x0 - 60, 620, x0, 618, x0, 588)
    c.l(x0, 0)
    c = c.rounded([(fx, 652), (fx, 620)], P["soft"])
    return x0 + s + 92, [c.oriented()]


def _zero(P, mark):
    adv, cs = zero(P)
    if mark == "slash":
        sl = Contour(176, 120).l(232, 96).l(404, 604).l(348, 628)
        return adv, cs + [sl.oriented()]
    return adv, cs + [ellipse(240, 300, 340, 414)]


@glyph("zero.slash")
def zero_slash(P):
    return _zero(P, "slash")


@glyph("zero.dot")
def zero_dot(P):
    return _zero(P, "dot")


@glyph("Q.swash")
def Q_swash(P):
    """A thin stroke drops left from the bowl, then a thick wave swings right under it (a Baskerville form,
    proportions measured from Libre Baskerville and scaled to cap 700)."""
    t = Contour(424, 26)
    t.c(380, -26, 300, -88, 236, -126)                # left edge of the thin drop
    t.c(206, -142, 200, -172, 230, -182)              # round the turn
    t.c(360, -150, 470, -214, 640, -226)              # under the wave
    t.c(780, -236, 884, -204, 934, -132)
    t.l(938, -66)                                     # the end lifts
    t.c(910, -142, 840, -170, 720, -172)
    t.c(570, -172, 440, -118, 312, -126)              # over the wave
    t.l(476, 26)
    return 950, _q_bowl(P) + [t.oriented()]


@glyph("Q.detached")
def Q_detached(P):
    """A tapered tail that sits under the bowl without touching it."""
    t = Contour(338, -36)
    t.c(452, -32, 572, -56, 694, -104)
    t.l(684, -124)
    t.c(566, -92, 448, -86, 330, -90)
    return 780, _q_bowl(P) + [t.oriented()]


@glyph("Q.diagonal")
def Q_diagonal(P):
    """A straight stroke through the lower right of the bowl."""
    t = Contour(500, 132).l(560, 132).l(786, -150).l(726, -150)
    return 800, _q_bowl(P) + [t.oriented()]


def _W(P, middle):
    """Four strokes: thick, thin, thick, thin. middle: 'serif' (a serif across the middle peak, Serrif),
    'point' (the middle strokes meet in a point above the cap height, Georgia Pro), 'cross' (the middle strokes
    cross below the cap height, Baskerville). Top serifs are bracketed into the strokes."""
    cap, t, soft = P["cap"], P["serif_tip"], P["soft"]
    thick, thin = P["cap_stem"] + 30, 52              # horizontal widths (Georgia ~107 at mid-height)
    top = cap - t + 2
    cs = []

    def edges(xt, xb, w, wb):
        left = lambda y: (xb - wb / 2) + ((xt - w / 2) - (xb - wb / 2)) * y / top
        right = lambda y: (xb + wb / 2) + ((xt + w / 2) - (xb + wb / 2)) * y / top
        return left, right

    def stroke(xt, xb, w, wb):
        cs.append(Contour(xb - wb / 2, 0).l(xb + wb / 2, 0).l(xt + w / 2, top).l(xt - w / 2, top).oriented())
        return edges(xt, xb, w, wb)

    def bracket(edge, side, reach=34, h=48):
        y0 = cap - t
        x0 = edge(y0)
        c = Contour(x0 - side * 2, y0).l(x0 + side * reach, y0)
        c.c(x0 + side * reach * 0.3, y0, edge(y0 - h * 0.55), y0 - h * 0.45, edge(y0 - h), y0 - h)
        cs.append(c.oriented())

    v1, v2 = 300, 742                                 # bottom points
    l1, r1 = stroke(128, v1, thick, thick * 0.78)
    l4, r4 = stroke(912, v2, thin, thin * 0.7)
    for e, sd in ((l1, -1), (r1, 1), (l4, -1), (r4, 1)):
        bracket(e, sd)
    serifs = [(24, 236), (840, 1002)]
    if middle == "point":
        ax, ay = 522, cap + 12                        # the point, with overshoot
        tb, kb = thin, thick * 0.9
        a = (v1 - tb / 2, 0)
        b = (v2 + kb / 2, 0)

        def meet(p1, p2, p3, p4):
            d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0])
            u = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d
            return (round(p1[0] + u * (p2[0] - p1[0])), round(p1[1] + u * (p2[1] - p1[1])))
        crotch = meet((a[0] + tb, 0), (ax - 8 + tb, ay), (b[0] - kb, 0), (ax + 8 - kb, ay))
        cs.append(Contour(*a).l(ax - 8, ay).l(ax + 8, ay).l(*b).l(b[0] - kb, 0).l(*crotch)
                  .l(a[0] + tb, 0).oriented())
    else:
        xt2, xt3 = (588, 452) if middle == "cross" else (516, 516)
        l2, r2 = stroke(xt2, v1, thin, thin * 0.7)
        l3, r3 = stroke(xt3, v2, thick, thick * 0.78)
        if middle == "cross":
            serifs.append((344, 684))                 # wide enough to cover both crossing tops and their brackets
            bracket(l3, -1, reach=24, h=40)
            bracket(r2, 1, reach=24, h=40)
        else:
            serifs.append((420, 616))
            bracket(l2, -1)
            bracket(r3, 1)
    for a_, b_ in serifs:
        cs.append(rect(a_, cap - t, b_, cap).rounded([(a_, cap - t), (a_, cap), (b_, cap), (b_, cap - t)], soft))
    return 1026, cs


@glyph("W", ord("W"))
def W(P):
    """A serif across the middle peak (Serrif's form)."""
    return _W(P, "serif")


@glyph("W.point")
def W_point(P):
    """The middle strokes meet in a point (Georgia Pro's form)."""
    return _W(P, "point")


@glyph("W.cross")
def W_cross(P):
    """The middle strokes cross (a Baskerville form)."""
    return _W(P, "cross")
