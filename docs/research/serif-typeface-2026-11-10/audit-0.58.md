# Area Serif 0.58: serif, height, width, stroke and ink audit

Owner, 2026-11-13: ease e where its bar meets the bowl ("less suddenly wide and slightly less round"), then "a deep
serif thickness, roundness and height/width audit ... everything intentional, consistent, cohesive ... thicks and thins
promote good optical ink balance across all characters". All 62 letters and figures, on build 0.57, against R1
(Georgia Pro) and R2 (Serrif). Tools in `tools/joins/` (run from `typefaces/area-serif`): `audit_serifs.py` (brackets,
joins, corners, round ends, heights, on the UFO), `audit_thin.py` (arcs and straight diagonals), `audit_area.py` (ink
without spacing, widths), `audit_ink.py` (strokes by direction; grey; top/bottom and left/right split), `thin.py`
(thinnest crossing per glyph), `cg.py`, `flags.py`, `figw.py`. Fixes: `typefaces/area-serif/balance.py`, `joins.py`,
`clean.THIN_CAP`. Units per 1000; stems are n's (78) for lowercase and H's (86) for capitals and figures.

## Method for ink

Ink = area / (class stem x zone height), so spacing is not in it. Area's value over each reference's, then against the
class median of that ratio. A glyph more than 4% off its class against BOTH references is out of balance for this
face, whatever the faces' weights. Area carries 2 to 5% more ink per stem at the median (lowercase 1.027 / 1.042,
capitals 1.052 / 1.004): the lower contrast.

## Found, and fixed in 0.58

| Part | Was | Now | Evidence |
|---|---|---|---|
| e, right stroke above the bar | 95 units, 1.22 stems (R1 1.05, R2 1.08) | 85, 1.09; outside corner 28x48 to 20x34; eye corner handles 0.82/0.64 to 0.88/0.72 | overlay, `joins.e_junction` |
| C G S end barbs (my 0.54 error) | sized to the cap height: 1.03 H stems wide a little up the barb (R1 0.71 of its stem). C's ink +3.6% (0.46) to +13.8%, S's +0.8% to +15.3% | foot 36 wide (0.42 stems, R1's share), lean 0.10, cut end at 0.68 of the cap height, spur 38 and notch 56 in. C +6.0%, S +5.6% | `audit_area.py`, `cg.py` |
| Capital hairline arcs | 51 units, 0.59 H stems; lowercase 0.55 of n's. Round capitals 5 to 15% over the straight ones against both references (whose arcs, bars and serif tips are one weight) | 47 units, 0.55, on O Q C G S D B P R; D B P R counter tops were 49 to 51, B's lower bowl 45: all 47 | `audit_thin.py`, `clean.THIN_CAP` 0.525, `balance.arcs` |
| Figure hairline arcs | 44 to 50 | 47 (0 2 3 5 6 9; 8 at 48) | `balance.arcs` |
| Lowercase thin diagonals v w x y | 0.44 to 0.46 stems, 34 to 36 units: under the face's own 0.50 floor and its arcs' 0.55 | 0.50, 39 | `audit_thin.py`, `balance.diagonals` |
| Capital thin diagonals A V W X Y | 0.42 to 0.49 H stems (W's two 0.49 and 0.56); M and K's arm 0.56 to 0.59; X V K light by 4 to 8% | 0.56, 48, with M's; W's two equal | same |
| The 4's diagonal | 0.43 | 0.50 | same |
| z's diagonal | 1.07 stems (R1 and R2 0.94); z +10.8% ink | 0.97; z +3% | same |
| K's leg | 0.90 H stems (X 0.94-0.98, both references 0.98) | 0.97 | same |
| Y's thick arm | 1.06 (V and both references 1.01) | 1.02 | same |
| t's stem | 81 (n 78; references 1.01-1.02 of n) | 79 | `balance.stems` |
| The 5's bowl | 94 at its widest (every figure 92) | 92 | same |
| f's and t's bars | f 468-520 (52 thick), t 465-514 (49): two bars. Both references draw one bar, 0.90 to 1.00 of the x-height | t's is f's: 468-520 | `balance.bars` |
| F's top arm | 51 (E's 46) | 46 | same |
| z, Z lower arms | 51 and 49 (upper 46 and 45) | 46 and 45 | same |
| z's upper beak | cut leaning 6 in 12, 26 wide (lower: level, 32) | level, 30 | same |
| Head serif tips | 32 (feet 30) | 30 | `joins.flatter_flags` |
| p, q bowl-side descender feet | 80 and 78 | 79 | `balance.desc_feet` |
| Heights | A's flat apex 710 (cap 712); the 4's flat top 721 (5 7: 712); the 1 at 730 (0: 721; both references level); f's top 777 (ascender 780; both references level), its hook 36 thick; 2 at 722; b bottom -11; s top 529; v bottom -11; J bottom -8 | 712; 712; 721; 780 and 39; 721; -10; 530; -10; -9 | `audit_serifs.py` section 4, `balance.heights` |

## Checked and consistent (no change)

- Foot brackets: 21 lowercase feet 63 long x 66 high, 29 capital feet 69-70 x 58, 27 capital head serifs 69-70 x 61;
  handle shares 0.70 / 0.90 and tip 30 on all. Capital lengths differ by 1 unit (whole-unit rounding).
- Head serifs: slope 7.8 to 8.1 degrees on all eleven; one corner height on n m p (r 529: its fitted top).
- Softened corners: 313 of about 395 are 7 x 7; the rest are 1 to 2 units off on leaning faces (beaks, tails), U's and u's
  head serifs (6 x 7).
- Round ends: 88 across on c, f and the figures. a 1.04, j 1.06, g's ear 1.13, r 1.28, y 1.33, J 1.28 stems: r, y and
  J are the owner's.
- Stems: 1.00 on every upright stem (f 0.99). Round thick 1.05 lowercase, 1.07 capitals and figures.
- Lowercase arcs 0.55 on o c e a s g b d q and the arches (the rule's own window; n h m 0.52 before lightening).
  Lower arcs of c e a are heavier than their tops (0.65, 0.72, 0.64), as in both references (c 1.29 and 1.86 times).
- Thick diagonals: v w x y k 0.93-1.00; A V W X M 0.94-1.01; N 1.04, Z 1.03 (R2 1.03, 1.02).
- Widths against R1: within 2.5% except the listed exceptions (i j l f t I 1; r g k x y K W X) and Q +5.3 (its
  tail), 4 +4.9, 6 9 +3.8, 5 +3.3, 7 -4.7.

## Still off, not changed (the owner's to decide)

| Glyph | Ink off class (R1, R2) | Why | Suggested |
|---|---|---|---|
| g | +19.5%, +18.2% | 9.8% wider than R1 (the ear and the loop follow R2's shapes); loop's bottom 0.62 | narrow the loop, bottom to 0.57 |
| e | +12.1%, +12.0% | lower arc 0.72 (rule 0.70; R1 0.54, R2 0.67); bar 0.58 | lower arc to 0.65 |
| a | +10.3%, +7.1% | bowl's bottom 0.64, bowl top a level bar 0.68 | bowl bottom to 0.58 |
| x, y, v | +10/+5, +10/+9, +6/+7 | closed-side fillets at eight, three and two joins; y's end 1.33 stems; x 5% and y 8% wider than R1 | smaller fillets; y's end to 1.2 |
| s | +5.3%, +11.0% | spine 1.12 stems (o 1.05) | spine to 1.07 |
| Q | +13.6%, +16.1% | the tail (the owner's choice) | none |
| G, S, C, B | +5 to +7% vs R1 | barbs, and the bar on G | none; down from +11 to +15 |
| I | -10.8%, -5.7% | stem and serifs only, serifs 0.85 of R1's length by rule | none |
| 7 | -7.5%, -12.3% | 4.7% narrower than R1 | widen 15 units |

Also not changed: capital apex overshoots (V W N -9, as deep as O's; R1 half, R2 none); A's leg, 1.06 below the bar
against 0.98 above (`A_inner_leg`); K's arm 0.57; cap crossbars 0.60 against arms 0.53; e's bar; 6's and 9's end strokes
0.51-0.52.

## Checks

qa.py passes: targets, 0 outline errors (250 warnings), parts audit 0 outliers, fontbakery 0 FAIL. `evaluate.py`:
extremes 30, flat 114 (the bracket, by design), jumps 28 (31), wobble 1. Proofed at 13, 16, 22 px beside 0.57 and R1,
and the full set large. Not looked at in the app.

## 0.59: e and g (owner: yes)

Profiled with `tools/joins/profile.py` (strokes level by level and column by column, three faces).

- e (`balance.e_g`, `clean.THIN_FLOOR`): left stroke above the bar 1.02-1.09 stems (R1 0.86-0.94, R2 0.84-0.90): the eye's
  left side out 9, now 0.94-1.04; bar 45 to 41 from its underside; lower arc rule 0.70 to 0.62 (56 to 51 units, c's).
  Ink +12.1% to +7.3% against both.
- g: bowl 0.717 x and loop 0.941 x are the references' (0.728/0.772, 0.969/0.959); the ear reached 0.269 x past the
  bowl (0.178, 0.169): in 20 units to 0.23. Ear neck 74 to 63 (r's). Loop top stroke 1.16 stems (R1 0.95-1.10, R2
  0.88-0.89): inside edge up 10. Loop lower arc 48 to 43. Width +9.8% to +5.8% over R1. Ink +19.5% / +18.2% to
  +15.2% / +13.9%. The rest is hairline length at 0.55 stems (references 0.40): left.

qa.py passes; `evaluate.py` jumps 30 (28), both new ones on g.

## 0.60: serifs on leaning strokes, s, a (owner: yes, continue)

- The owner's picture of uneven W/V and X serifs: not in the outlines (V W X Y K head serifs all 682-712). PIL's text
  drawing grid-fits each glyph separately. `tools/joins/plain.py` draws from the outlines with HarfBuzz kerning and
  no fitting: use it for any proof about alignment between glyphs.
- `tools/joins/diag_serifs.py`: overhang past the stroke at the serif's inner edge, in stems. Lowercase v x y:
  closed side 1.11-1.42 (R1 0.74-0.96, R2 0.75-0.98), open side 0.48-0.92 (R1 0.51-0.60 and 0.88 once, R2
  0.47-0.59). `balance.lean_serifs`: closed 0.90 (70), open 0.58 (45) on v w x y. Capitals sit with the references
  (V and Y shorter on the closed side by the owner's notes): left.
  Ink: v +6.0/+7.4 to +2.4/+4.1; x +10.0/+4.6 to +3.5/-1.3; y +9.7/+8.7 to +6.6/+6.0. Width against R1: x +5.2% to
  -1.9%, y +8.2% to +3.9%, v +0.5% to -1.6%, w -2.8% to -6.1% (open: its counters).
- s: `clean.S_LOW` (68, 74) to (66, 68): lower-right bowl stroke 0.83 to 0.76 at 0.20 of the height (R1 0.75, R2 0.79).
  Ink +5.3/+11.0 to +4.7/+10.6. Left: the top arc into the barb (0.66 and 1.26 against 0.46-0.56 and 0.81-0.90).
- a: bowl's lower arc 50 to 45. Ink +10.3/+7.1 to +9.9/+6.9. Left: the bowl's joins with the stem (1.28-1.50 stems
  deep against 0.43-0.91), the owner's earlier "horrible" when changed.

qa.py passes; `evaluate.py` jumps 30.

## 0.61: w's width (owner: yes)

`balance.widen_w` (W_WIDER 1.07, before `diagonals` and `lean_serifs`, which reset stroke weights and serif lengths):
ink width 1.471 to 1.546 x-heights (R1 1.568, -1.4%). Thick strokes 1.00 to 0.94-0.97 (v x y 0.94), thin 0.47-0.49.
Ink -0.5% / -6.4% to -2.6% / -8.4%. qa.py passes; jumps 30.

## a: options (0.61, for the owner's pick)

Measured with the bowl aligned on the stem (an earlier column reading had compared different places in the three
faces): stem 1.08 stems (R1 1.01, R2 0.99); top arc into the stem 0.88 (0.62, 0.59); bowl's lower stroke at the stem
0.69 (0.42, 0.54); across that join 1.33 (1.00, 1.12). `balance.a_option`, AREA_A: A current (+9.9% / +6.9%), B stem
78 and a later-turning inside arc (+8.2% / +5.3%), C B plus a squarer, lower counter corner (+7.0% / +4.2%). Sheet:
`img/a-options-0.62.png` (Area only; redrawn with 0.62's round drop: A +11.0% / +8.0%, B +9.3% / +6.4%, C +8.1% / +5.3%). The build carries A.

## 0.62: round ends on y, g, a; e's counter corner (owner, with pictures)

`joins.round_ends2`: y's end a circle r 48 drawn as j's (was a 75 x 68 quarter with a hump), g's ear a circle r 46 on a
one-curve underside (0.59's neck move is off), a's drop a half circle r 44 (its right side had bulged to 142 and come
back to 135). audit_parts balls: a 1.16, c 1.18, y 1.16, g 1.18, f 1.09, j 1.06, r 1.28, J 1.28 (spread 1.21, was
1.32). y's ink +6.6% / +6.0% to +4.1% / +3.5%. `balance.e_g`: the 10 x 9 bevel in e's lower counter is a corner.
qa.py passes; `evaluate.py` jumps 29, extremes 28. Sheet: `img/round-ends-0.62.png`.

## 0.63: a is option C; the arc into its drop (owner: "C"; "the thick/thin looks uneven")

`balance.A_OPTION` defaults to C: stem 1.03 at 0.75 x, across the lower join 1.18 (1.33), bowl's lower stroke at the
stem 0.43 (0.69). `tools/joins/arc_profile.py`: thickness along the arc into a round end, inner curve to outer. a
read 43 42 42 43 44 46 49 53 57 63 69 76 84 (late, fast swell); c 44 44 45 47 50 54 58 63 68 74 80 86 88. Handles
fitted to c's profile by least squares over a grid: inside 0.50 / 0.55, outside 0.62 / 0.65 (`joins.round_ends2`).
After: 43 43 45 47 49 53 57 62 68 74 80 86 88. Ink +9.7% / +6.8%. qa.py passes; jumps 30.

## 0.64: every thick/thin transition (owner: "review all other thick/thin transitions")

`tools/joins/swell.py`: each contour walked in 5-unit steps, the stroke measured across at each (ray to the facing
edge within 35 degrees of parallel), runs split where the crossing jumps more than 5 units (a junction). Per run: the
fastest change over 40 units, and bumps (a turn back of 2 to 12 units that recovers within 160).

- Bumps: 0 on all 62 (R1: 1, on U).
- Fastest changes, units per unit: S 0.50, G 0.49, C 0.48, y 0.48 (its end), h 0.49 and b d p q 0.42-0.44 (the
  bowl or arch leaving an ascender or descender stem), u 0.47, 5 0.47, D 0.46, B 0.45, t 0.45, a 0.53 (tail). R1 at
  the same places: 0.49-0.53 on C G S, 0.41-0.46 on b d h p q, 0.65 on a's tail. o 0.18, w 0.17, v 0.19.
- y's end: 90 across, then 87 85 83 81 78 76 73 71 68 66 64 62 60 57 55 54 52 51 50 49. g's ear: 78 down to 38 at
  its root, 1 to 2 per step. No change.
- n h m: branch thickness at the same point 111 / 130 / 107; arch points differed by 3 to 9 units.
  `balance.same_arches`: h = n's arch, m = n's scaled 0.972; h's stem above the arch 80 to 78.
- `balance.even_stems` (and q in `desc_feet`): i 77, l 79, b d 79 above the bowl, f 77 under the bar, q 81 in the
  descender: all 78. Every lowercase pair of straight upright edges is 78 (t 79).
- Left: u's joins (0.47 / 0.42; the owner's u_bowl), t's top (thins to 34), a's tail.

qa.py passes; `evaluate.py` jumps 30.
