# Area Serif evaluation, 2026-11-13 (builds 0.66 to 0.71)

A test suite that measures Area Serif and eight reference faces with the same code, and the page that shows the
results: https://claude.ai/artifact/5FkKUT31WDmmTAMMQtKwk2 (specimen, comparisons, 17 findings with drawn evidence,
test tables, glyph inspector). Builds 0.67 to 0.70 fix all thirteen findings that held up; `tools/findings.py` holds each finding and its status.

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
| `test_extended.py`, `sheets.py`, `changed.py` | 0.71: the character set beyond the core; contact sheets; what changed between builds. |
| `look.py`, `ba.py`, `build_page.py`, `template.html` | Review plates (nodes and combs; before over after) and the page. |

## Build 0.71: beyond the core

`test_extended.py` (accents, Vietnamese stacks, 95 signs, on every face), `sheets.py` (contact sheets and rows per
face), `changed.py` (what changed between two builds). Eleven findings fixed by rule, one of my measurements
withdrawn, two left for the owner; all in `findings.py` with `"prev": "0.70"`, drawn with 0.70 in red.
`build_page.py` takes two before-builds: `EVAL_PREV66` (0.66, for the findings of 0.67 to 0.70) and `EVAL_PREV`
(the previous build, 0.70). `BUILD`, `DATE`, `VERDICT` and `QA` at the end of `findings.py` are the page's own text.
The audit that holds the rules is `typefaces/area-serif/audit_charset.py`.

## Builds 0.72 and 0.73

0.72: 37 glyphs from finished letters and parts, and the fractions (figures 66 from the bar). 0.73: `test_fit_ext.py`
(75,161 extended pairs with kerning on, three faces): accented letters kern as their letters, the collision pass
covers the whole set. Before-builds for the page: `EVAL_PREVS="0.70=<build>,0.71=<build>,0.72=<build>"` (copies in
`typefaces/area-serif/build/prev070`, `snap071`, `snap072`); a finding names its own with `"prev"`.

## Status after 0.70

`tools/findings.py` is the record: each finding with its status, the numbers before and after, and the rule that holds
it. All 13 findings that held up are fixed (the last block of the file carries 0.69's entries to 0.70). Three are by
design and two withdrawn, with the reason on the page. Nothing is open. The zero's lighter sides (`balance.ZERO_SIDE`)
were the owner's call and are applied as recommended.

The built font's soft kinks (profile test) sit at 7 against 2 in the source: they come from the quadratic conversion
of short curves. Halving ufo2ft's conversion error made it 15, so the tolerance is not the lever.

Fonts, test output and the 0.66 reference build live in `typefaces/area-serif/build/` (ignored): `eval-fonts/`,
`evaluation/`, `old66/`. `build/ev.sh` sets the environment. A system scratch folder does not survive a restart.

To draw before over after, `git archive 109dfc49 typefaces/area-serif` into `build/old66`, build it there, and set
`EVAL_PREV=<that copy>/build` before `build_page.py`; `ba.py` draws the same for eyes.
