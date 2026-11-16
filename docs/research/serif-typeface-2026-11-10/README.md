# Area Serif: research and plan (2026-11-10)

Plan for an original variable serif for interface text, informed by Georgia Pro and
Serrif (Displaay). Nothing is built yet; the owner has not picked the open decisions.

- **The plan (review page):** https://claude.ai/artifact/3dhtNkfhP53wqEi9CJfmcv
- **Its text:** `plan.src.html` (figures and charts are filled in by `tools/build.py`).
- **Measured data:** `metrics.json`, per 1000 em, Georgia Pro Light to Black and Serrif
  wght 100 to 900.

## Rules for this work

- Both references are licensed fonts (Serrif is a trial copy). Measure and look only.
  Never import, trace, convert or instance-and-save their outlines; never commit renders
  of them. New outlines are drawn from the numeric targets in the plan.
- The targets table in the plan is the spec. A built font is re-measured against it.

## Tools

Run from a scratch folder with `fonttools`, `pillow` and `numpy` in a virtual
environment. They read the fonts from `~/Library/Fonts`.

| Script | Gives |
|---|---|
| `lib.py` | Loading, Serrif instancing in memory, flattening, scanline measuring |
| `info.py` | Names, licence strings, metrics, axes, instances, feature tags |
| `measure.py` | Proportions, stems, contrast, serifs, apertures, spacing → `metrics.json` |
| `feats.py` | Substitutions per feature, kerning and mark lookups, coverage, node counts |
| `extra.py` | Figures, small caps, accents, italic angle, widths, sample kerning |
| `render.py`, `nodes.py`, `figs.py` | Specimens and node drawings (scratch only) |
| `build.py` | Assembles the review page from `plan.src.html` |

## Targets in brief (Text Regular, 1000 em)

x-height 500, cap 700, ascender 742, descender −210, stems 88 / 98, hairline 44,
serif tip 40, n advance 592, o advance 548, tabular figures 580, line box 950 / −250.
Axes: wght 300–800 (masters 300, 400, 800), opsz 12–48 (masters 12, 48), italic as a
second file.

## Change of method (2026-11-10, later)

The owner found the hand-coded drafts inconsistent and asked for one reference's real outlines to be used as the
base. Libre Baskerville (OFL) is the base, because its licence allows it; Georgia Pro and Serrif remain
measurement-only. The plan's targets were re-set from the derivation: x-height 500, cap height 726, n stem 82,
H stem 91, n advance 620, serif tip 28. See `typefaces/area-serif/derive.py` and the review page
https://claude.ai/artifact/25AzNJVt4uiQsmH7zqmdie. `alternates.md` holds the survey of alternate forms.
