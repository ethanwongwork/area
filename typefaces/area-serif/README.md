# Area Serif

A serif for interface text, derived from Libre Baskerville. Plan, targets and research:
`docs/research/serif-typeface-2026-11-10/`. Procedure and rules: the `area-type-design` skill
(`.claude/skills/area-type-design/`).

Status: build 0.70 (0.67 to 0.70, from the evaluation in `docs/research/serif-evaluation-2026-11-13/`: one hairline on the capitals' level strokes, B's lower bowl at the O's weight, i's flag on u, C G S s arcs even into their spurs, 2 5 7 flat strokes at 73, brackets true to their diagonals, r's advance 0.682 of n, a node at every extreme and inflection, ligature and Œ seams trued, 5's heel, capital serifs 77, the zero's sides 87, struck letters merged in the source; before that one construction per join, bowl and vertex, `parts.py`; optical spacing and measured kerning, `spacing.py` + `fit_kerning.json`; steeper joins and flatter head serifs, `joins.py`), with 0.48's full character set: Basic Latin, Latin-1, Latin Extended-A, Vietnamese, punctuation, currency, maths, arrows,
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
| `build.py` | Derives, then writes `build/AreaSerif-Regular.ufo`, `.ttf` and `.woff2`. |
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
| `qa.py` | Build, then every check. |
| `overlay.py`, `proof.py`, `sheet.py` | Comparison plates, proofs and contact sheets. |
| `archive/drawn-2026-11-10/` | The retired hand-coded drafts. |
| `requirements.txt` | Pinned build and check tools. |

Setup and the full check:

    python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
    .venv/bin/python qa.py --diff

`build/` and `.venv/` are ignored. Proofs made with `--refs` and overlays show licensed fonts and are never committed.
