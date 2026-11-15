"""Area Serif master values, per 1000 units. One dict per master; glyphs read only from here."""
TEXT_REGULAR = dict(
    name="Regular", wght=400, opsz=12,
    xh=500, cap=700, asc=742, desc=-210,
    over=12, cap_over=14,          # round overshoot, lowercase / caps
    stem=80, cap_stem=90, fig_stem=84,       # lighter, toward Serrif (86 / 95)
    round=88, cap_round=100,       # thickest part of a round stroke
    hair=38,                       # thinnest part of a round stroke
    bar=40, e_bar=38,
    serif_tip=30, serif_proj=72, cap_serif_proj=98,   # thinner, longer: toward Serrif (26, 82, 105)
    bracket=58, cap_bracket=64,    # taller brackets: the serif thickens toward the stem    # height the bracket climbs up the stem
    flag_proj=62, flag_tip=30, flag_slope=10,
    soft=13,                        # radius on serif tip corners
    ball=104,                      # ball terminal diameter
    dot=118,
    line_asc=950, line_desc=-250,
)
