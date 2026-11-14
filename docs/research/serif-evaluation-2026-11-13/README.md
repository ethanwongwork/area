# Area Serif evaluation, 2026-11-13 (builds 0.66 to 0.69)

A test suite that measures Area Serif and eight reference faces with the same code, and the page that shows the
results: https://claude.ai/artifact/5FkKUT31WDmmTAMMQtKwk2 (specimen, comparisons, 17 findings with drawn evidence,
test tables, glyph inspector). Builds 0.67 to 0.69 fix seven findings by rule and improve five; `tools/findings.py` holds each finding and its status.

## Run

```
cd docs/research/serif-evaluation-2026-11-13/tools
export EVAL_FONTS=<folder with the OFL faces>  EVAL_OUT=<output folder outside the repo>
PY=../../../../typefaces/area-serif/.venv/bin/python     # plus: pip install numpy scipy scikit-image
$PY test_curves.py && $PY test_strokes.py && $PY test_serifs.py && $PY test_fit.py && $PY measures.py
$PY build_page.py          # -> $EVAL_OUT/area-serif-evaluation.html
$PY look.py out.png a c e --scale 1.2 --cols 3      # node plates with curvature combs, for eyes
```

`EVAL_FONTS` holds `LibreBaskerville.ttf`, `SourceSerif4.ttf`, `Literata.ttf`, `Newsreader.ttf`, `Lora.ttf` and
`Merriweather.ttf` (the variable files from github.com/google/fonts, `ofl/`). Georgia Pro and Serrif are read from
`~/Library/Fonts` in memory only; the page draws them from the viewer's installed copies and stores no outline of either.
Keep `EVAL_OUT` outside the repository: its JSON holds measurements of licensed faces and the page embeds fonts.

## Files

| File | Holds |
|---|---|
| `evlib.py` | The faces, segment pen, scanlines, curvature. Everything at 1,000 units per em. |
| `test_curves.py` | Node tests on the cubic UFO (all glyphs) and curvature turning points on every face. |
| `test_strokes.py` | Stems, level bars and ray thickness across strokes. |
| `test_serifs.py` | Feet, heads, flags, arm ends; ball sizes from `audit_parts.py`. |
| `test_fit.py` | Alignment, side bearings, all 3,844 core pairs with kerning, grey value. |
| `measures.py` | 130 named parts per face (the table behind most stroke findings). |
| `findings.py` | The findings, what is solid, what was not checked. Edit here, then rebuild the page. |
| `look.py`, `ba.py`, `build_page.py`, `template.html` | Review plates (nodes and combs; before over after) and the page. |

## Status after 0.69

`tools/findings.py` is the record: each finding with its status (fixed, partly fixed, open, by design, withdrawn), the
numbers before and after, and the rule that holds it. Fixed: capital thin strokes, B's lower bowl, u's head serifs,
the arcs of C G S s into their spurs, the flat strokes of 2 5 7, brackets into diagonals and their extreme nodes,
r's advance. Partly: figures (5's heel done; the hooks of 3 and 5 open), seams (ct, st and cent open), ball joins,
inflections (one in Q, one in r, t's hook), one-unit mismatches (capital serifs 74 / 75). Open: the weight of zero
(the owner's call). Withdrawn or by design, with the reason on the page: arch necks, c against e, ball sizes, r's and
k's feet, corner fillets on sloped edges.

The built font's soft kinks (profile test) sit at 8 against 2 in the source: they come from the quadratic conversion
of short curves. Halving ufo2ft's conversion error made it 15, so the tolerance is not the lever.

To draw before over after, build the older state in a copy (the rule files from the older commit) and set
`EVAL_PREV=<that copy>/build` before `build_page.py`; `ba.py` draws the same for eyes.
