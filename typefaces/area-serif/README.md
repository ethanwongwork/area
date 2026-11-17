# Area Serif

A serif for interface text, derived from Libre Baskerville. Plan, targets and research:
`docs/research/serif-typeface-2026-11-10/`. Procedure and rules: the `area-type-design` skill
(`.claude/skills/area-type-design/`).

Status: build 0.81 (0.81: see "Build 0.81" below; 0.80: the owner's notes on 0.79: the single-storey g's tail redrawn as its own round part; one dollar, the ball-end one, and no ss03; every serif measured at five weights and the bracket under n's and k's flag made the others'; a Light master, so the variable font runs 300 to 700; alternate candidates drawn and written up, none in the font. 0.79: the owner's notes on 0.78: soft corners on every plain stroke's end, the alternate S and s removed and the ball-end dollar kept as ss03, the single-storey g rebuilt from q's whole bowl and j's tail, the 5's bowl, f's hook over the i in fi ffi fj ffj and a level join into l b h k, the Bold's curve and side-by-side guards; 0.78: the base's S s $ as alternates, ss03; three options drawn for the plain signs, default unchanged; 0.77: the owner's notes of 14 November: arrow points, k's foot, 5's flag, f before a dot, evenness round every closed counter (`even.py`), single-storey g as ss02; 0.76: Bold master and variable font; 0.75: Eng from Area's N, tilde and sharp s at the letters' weight, the degree's ring at the hairline, stacked marks 13 apart; 0.74: a verification pass on 0.71 to 0.73 by second methods, `docs/research/serif-evaluation-2026-11-13/tools/verify.py`: capital accents on one line letter by letter, whole bars on the euro and sterling, round dots from one drawing, one macron, nothing scaled, `version.py`; 0.73: accented letters kern as their letters, no two glyphs of the set closer than 13 units, IJ and numero rebuilt, nine signs' sides fitted, `spacing.finish`; 0.72: 37 glyphs from finished letters and parts, 1,038 in all, and the fractions re-fitted; 0.71 takes the evaluation to all 1,001 glyphs: the ampersand's arm, accents centred on their letters and one height per case, plain strokes at the minus's weight, dollar cent yen and kra from the finished letters, mirrored brackets, a node at every extreme on every glyph, `audit_charset.py`; 0.67 to 0.70, from the evaluation in `docs/research/serif-evaluation-2026-11-13/`: one hairline on the capitals' level strokes, B's lower bowl at the O's weight, i's flag on u, C G S s arcs even into their spurs, 2 5 7 flat strokes at 73, brackets true to their diagonals, r's advance 0.682 of n, a node at every extreme and inflection, ligature and Œ seams trued, 5's heel, capital serifs 77, the zero's sides 87, struck letters merged in the source; before that one construction per join, bowl and vertex, `parts.py`; optical spacing and measured kerning, `spacing.py` + `fit_kerning.json`; steeper joins and flatter head serifs, `joins.py`), with 0.48's full character set: Basic Latin, Latin-1, Latin Extended-A, Vietnamese, punctuation, currency, maths, arrows,
interface symbols, superiors and fractions, f ligatures, tabular figures (`charset.py`;
`docs/research/serif-typeface-2026-11-10/charset-0.47.md` has the inventory, the gap list and what is not done). Derived from Libre Baskerville (SIL OFL 1.1, `sources/OFL.txt`). Shapes lean on Serrif, widths on
Georgia Pro, serifs are short and blunt, and the weight is lighter than both (stem 0.158 of the x-height, contrast 1.64).
The design's values and rules, part by part: `.claude/skills/area-type-design/references/area-serif-guidelines.md`.
The owner's review page: https://claude.ai/artifact/1QUvcPjfjjkxBLVTRcNrVC. The evaluation page, with every fix before over after: https://claude.ai/artifact/5FkKUT31WDmmTAMMQtKwk2.

**Licence.** Area Serif is a Modified Version under the OFL: it must never be called "Libre Baskerville", must keep
the original copyright and licence, and may only be distributed under the OFL. Georgia Pro and Serrif are
measurement-only references; nothing from them is in the sources.

| File | Holds |
|---|---|
| `sources/` | Libre Baskerville's Glyphs source (Regular and Bold masters) and its licence. |
| `derive.py` | Targets, the solved weight and width, and the transforms that make Area Serif. |
| `build.py` | Derives, then writes `build/AreaSerif-Regular.ufo`, `.ttf` and `.woff2`; then the Light and Bold masters and `build/AreaSerif[wght].ttf` and `.woff2` (`AREA_BOLD=0` skips them). 0.82 (owner round 8): weight 300 to 800, named Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800; the masters are stems 55 / 78 / 104.5 (sparse) / 140 at 300 / 400 / 600 / 800, the named weights between on the designspace map (stems 90.3 at 500, 121.0 at 700: 1.157 a step above 400), so the font has avar. The 0.81 Bold (700) is the 0.82 ExtraBold (800), point for point. |
| `normalize.py` | One value per shared part (stems, flags, feet, u's arch, counters, arches) and g's ear root. |
| `audit_parts.py` | The parts audit: every shared part across its letters, against Serrif and Georgia Pro with `--refs`. |
| `check.py` | Re-measures the build against `derive.py`'s targets. |
| `pathlint.py` | Outline quality, joint angles at smooth nodes, winding. |
| `evaluate.py` | Curve report per glyph: curvature jumps, bumps, pinched arcs, kinks, missing extremes. |
| `diagram.py` | Node diagrams with coordinates (`build/diagrams/`). |
| `joins.py` | Steeper joins (0.49), after lightening: the brackets brackets_one misses, arm flares and lower-arm corners (E F L T Z), C G S end barbs, cut ends no thinner than the serif tip. Reads the outline by geometry, never by point number. |
| `balance.py` | The 0.58 audit's fixes, with `joins.py`: heights on their lines, f's and t's one bar, diagonal weights per stroke, one hairline on capitals and figures, t's stem, descender feet. |
| `parts.py` | One construction per repeated part (0.65): the b d p q bowl, every join of a curve to a stem, spurs, u from n, a's lower stroke. `python parts.py` prints the join table and fails on drift (in `qa.py`). Skill: `area-serif-construction`. |
| `charset.py` | The character set, last in `normalize`: lightens what lighten skipped, rebuilds letter-plus-part glyphs (ı ȷ Đ Ħ Ł Ø Þ ſ æ Æ, f ligatures, superiors) from the finished letters, draws the new glyphs, tabular figures and `tnum`. Outlines are joined with skia-pathops. |
| `even.py` | Evenness (0.77): a stroke's thickness round each closed counter, by rays; `shelf` is how far it strays from one smooth change. Retunes handle lengths only. In `normalize` and `qa.py`. |
| `audit_axis.py` | Every glyph between each pair of masters (0.81: Light to Regular, Regular to the sparse mid master, mid to Bold; 0.82: the mid master is 600, the Bold 800, the stops 0.81's every 25 units, 400 to 800 every 33.3): new extremes and inflections, self-crossings, counters and welded corners tested over the whole pair (`axis_exact.py`), parts that collide (the union's outer contours and holes), points moved too far, thin strokes and weight stepping back at the 25-unit stops. 0.81: Bold side 16 glyphs, Light side 9 (0.80: 45 and 26 by the same test); `docs/research/serif-typeface-2026-11-10/axis-0.81.md`. |
| `audit_rays.py` | The axis checked a second way (0.81): the variable font instanced at 300 to 800 (0.81's six stops at their design places), a ray across the stroke at fixed places round every outline. |
| `weightaxis.py` | The weight axis in one place (0.82): the stem at each weight, the 0.81 axis (300 to 700) to the 0.82 axis and back, by the formula (the engine's) and by the variable font's map (the instancing tools'). Every tool that names weights takes them on the 0.82 axis (`old:...` for the 0.81 one) and says so. |
| `overlap.py` | Struck glyphs (a letter and strokes across it) as overlapping contours in the variable font's masters (0.81); the static Regular keeps the merged outline. |
| `audit_charset.py` | The character set's audit (0.71): accents, plain strokes, signs from letters, mirrors. Fails on 0.70. |
| `bold.py` | The Bold master (0.76): the Regular's own points moved by rule from one number, the lowercase stem (140; `vector(128)` for the lighter one). Reads strokes, counters, serifs, balls, slanted strokes and necks on each glyph; `bold_font` makes the whole master (marks, anchors, composites, bearings, kerning opened for collisions); `variable` the two-master font. |
| `bold_bearings.json` | What the references' side bearings change from Regular to Bold, per letter and side (`tools/weight/bold_bearings.py`). |
| `audit_bold.py` | Every letter's and figure's parts measured on the Bold against their targets; `--sweep` the same at every 25 units of weight. Fails on a miss (in `qa.py`). |
| `white.py` | The white between parts (0.81): the white law (a narrow white is a counter), parts kept touching, necks at every crotch, arm crotches, and along a tapering stroke the ladder's law (`keep_taper`). |
| `arms.py` | Signs of arms (0.81): each arm a centreline and width profile; a star's arms reach as the references' do where no curve turns (`REACH`). |
| `axis_exact.py` | The exact axis tests (0.81): Bernstein turns, self-contact, counter areas, drift, over whole master pairs. |
| `loops.py`, `alternates.py`, `curvecheck.py` | g's loop and the tail family (0.81); the alternates and their sets; curvature continuity. |
| `audit_kern.py` | Every pair's least white along the axis (0.81); `AREA_KERN_WEIGHTS` for more stops (0.82 axis; `old:` for the 0.81 one). |
| `light_bearings.json` | The Light's side-bearing change, per character (references' Light, scaled); read by `bold.bearing_change`. |
| `qa.py` | Build, then every check. |
| `overlay.py`, `proof.py`, `sheet.py` | Comparison plates, proofs and contact sheets. |
| `archive/drawn-2026-11-10/` | The retired hand-coded drafts. |
| `requirements.txt` | Pinned build and check tools. |

Setup and the full check:

    python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
    .venv/bin/python qa.py --diff

`build/` and `.venv/` are ignored. Proofs made with `--refs` and overlays show licensed fonts and are never committed.

## Build 0.81

The three branches of 0.81 (glyphs, axis, kerning) merged and closed by rule. Write-ups:
`docs/research/serif-typeface-2026-11-10/axis-0.81.md` (rounds 1 to 3 and the integration round),
`kerning-0.81.md`, `alternates-0.81.md`; figures in `docs/research/serif-typeface-2026-11-10/img/081/`.

Rules added in 0.81:
- **g's loop** (`loops.g_loop`): quarters at the bowl's tensions, lowest points where curvature is equal on both
  quarters, the loop's left side a branch into the link (neck 32); its counter its own contour.
- **The tail family** (`loops.round_tail`, `charset.single_g_points`): g.ss02's half-ellipse tail, j's and y's tails
  and the a's exit on one rule: curvature only rising toward the ball, equal across the lowest point.
- **Alternates and sets** (`alternates.py`): a.ss03 and 31 accented forms, l.ss04, zero (slashed), ss05 (dotted
  zero), ss06 (barred 7 and z), U+0251, U+0261; ss01 to ss06 and zero.
- **Overlap construction** (`overlap.py`): a struck glyph is its letter plus each stroke as an overlapping contour in
  the variable font; a stroke whose side would lie on its letter's edge ends where that edge begins.
- **Exact axis audit** (`axis_exact.py`, `audit_axis.py`): turns, crossings, counters, drift over whole master
  pairs; symmetry, mirrored pairs and seams checked per master; `audit_rays.py` the second method.
- **Sign arms** (`arms.py`): a sign of arms is centreline times width profile, one f, capped by the white law;
  the asterisk's arms reach by the references' span change where no curve turns (the Light; the Bold stays).
- **White law** (`white.py`): a narrow white between parts (and g.ss02's ball under its bowl, inside one contour)
  keeps max(white x counter ratio, min(white, floor)); necks at every crotch towards the Light, a straight-sided
  crotch solved along its straight side; along a tapering stroke each place keeps its ladder law's share.
- **Per-master kerning** (`spacing.kern_master`, `build.kern_masters`): each master's pairs by the control-white
  rule, same-weight fit, collisions at the master's floor; the Light's side bearings from `light_bearings.json`
  through `bold.bearing_change` (one path).

Known debts: see the construction skill's debts list and `axis-0.81.md`, "Integration round".

