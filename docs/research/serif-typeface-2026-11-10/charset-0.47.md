# Area Serif: the character set, build 0.47

Owner's brief (2026-11-13, via the session that started this one): complete the full character set, every glyph a
UI and web text face needs, drawn in Area Serif's current style; fix the open items (8 at the waist, 6 and 9 joins,
fi and fl, figure and punctuation spacing, tabular figures, X about 5% heavy).

Code: `typefaces/area-serif/charset.py` (runs last in `normalize.normalize`, on the finished letters), the figure rules
in `clean.py` (`figure_join_corners`, `eight_spine`, `X_DIAG`), coverage targets in `check.py` (`charset.COVERAGE`).

## Inventory at 0.46

Libre Baskerville's source gave 862 glyphs, 789 encoded: Basic Latin and Latin-1 complete, Latin Extended-A all but
ŉ and ſ, much of Extended-B, IPA and Latin Extended Additional (but not Vietnamese: no horn, no hook above), the
spacing and combining accents with `.case` forms, superiors, inferiors, nine fractions, ª º №, fi fl ff ffi ffl and
a set of discretionary ligatures (`dlig`), features aalt case ccmp dlig frac liga locl ordn sinf ss01 subs sups, kern
mark mkmk.

458 of the glyphs are components (every accented letter), so they already followed Area's letters. The other 400 had
their own outlines. Of those, only a-z, A-Z and 0-9 went through Area's rules; the rest were Libre Baskerville's
drawings under derive's transforms. What that meant:

| Group | State at 0.46 |
|---|---|
| Punctuation, symbols, accents (163 glyphs) | Never lightened: their upright strokes 4 units heavier than the letters' since 0.40. |
| Hyphen, en and em dash | 86 units thick, 1.10 n stems (Georgia Pro 0.74, Serrif 0.49). |
| Bullet | 0.58 of the x-height across (Georgia Pro 0.52, Serrif 0.49). |
| ı ȷ | Libre Baskerville's old i and j (wider, longer serifs); every accented i and j is built on them. |
| Đ đ Ħ ħ Ŧ ŧ Ł ł Ø ø Þ þ | Libre Baskerville's letters, not Area's D d H h T t L l O o P p. |
| fi fl ff ffi ffl, the f dlig set | Libre Baskerville's old f (no round end, its own bar). |
| æ œ Æ Œ | Libre Baskerville's a e o A E O. |
| Superiors, inferiors, ª º, fractions | Libre Baskerville's figures at 0.42 of the figure height, 0.96 of the weight that size implies: faint. |
| Maths signs | Four different advances (fontbakery `math_signs_width`). |
| Tabular figures | None. |

## Gap list (what a UI and web text face needs that was missing)

- Latin Extended-A: ŉ (U+0149), ſ (U+017F).
- Dashes: ‐ ‑ (hyphen forms), ‒ (figure dash), ― (horizontal bar).
- Spaces: en, em, three-, four- and six-per-em, figure, punctuation, thin, hair, narrow no-break, medium maths.
- Primes ′ ″.
- Currency: ₹ ₽ ₺ ₩ ₪ ₫ (€ £ ¥ ¢ $ ¤ were there).
- Maths: ≤ ≥ ≈ ∞ √ ∂ ∆ ∏ ∑ ∫ ◊ π Ω (Mac Roman and WGL4's set); + − × ÷ = ≠ < > ± ¬ were there.
- Arrows: ← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙.
- Interface: ⌘ ⌥ ⇧ ⌫ ✓ ✕ ● ○.
- Letterlike: ℗ (© ® ™ ℠ № were there).
- Figures: tabular set and `tnum` / `pnum`.
- Ligature caret positions (fontbakery `ligature_carets`).
- English auxiliary: ʻ (U+02BB).

## What 0.47 does

Every number below is in Area's stems (n stem 78, H stem 86) and was measured on Georgia Pro and Serrif with a
scanline or distance transform; no reference outline was read for anything but numbers.

### The open figure items

| Glyph | Measure (largest circle inside, in H stems) | 0.46 | 0.47 | Georgia Pro | Serrif | Rule |
|---|---|---|---|---|---|---|
| 6, 9 | the join where the long stroke leaves the bowl | 1.27 | 1.12 | 1.03 | 1.09 | the counter's corner reaches to 44 units from the crotch (`FIG_JOIN_GAP`); its handle follows 0.3 of the move (`FIG_JOIN_HANDLE`: 0.5 bent the counter's top unevenly, evaluate.py jumps 27 to 29) |
| 8 | the spine, 99th percentile | 1.21 | 1.09 | 1.00 | 1.07 | each counter's edge along the spine moves 11 units toward it (`EIGHT_SPINE`) |
| X | the thick diagonal, 99th percentile | 1.12 | 1.06 | 1.02 | 1.05 | 0.95 of K's leg (`X_DIAG`): the crossing adds ink |

### Bars and slashes (measured on Serrif, Georgia Pro in agreement)

| Glyph | Bar centre | Left of the stem | Right of the stem |
|---|---|---|---|
| Đ | 0.50 cap | 0.94 stems | 1.37 stems into the counter |
| đ | 1.156 x-heights | 1.87 | 0.93 |
| Ħ | 0.725 cap | 0.99 past the first stem | 1.11 past the second |
| ħ | 1.156 x | 0.92 | 1.88 |
| Ŧ | 0.50 cap | 1.15 | 1.15 |
| ŧ | 0.60 x | 0.91 | 1.62 |

The bar's thickness is the letter's own: H's crossbar for capitals, t's bar for lowercase. Ł's slash crosses the stem
at 0.43 cap, 1.45 stems each side, rising 0.42; ł's at the x-height, 1.40 each side, rising 0.45. Ø ø: corner to
corner, 6-7% past the bowl.

### Small figures, dashes, bullet

| | Libre Baskerville (0.46) | Georgia Pro | Serrif | 0.47 |
|---|---|---|---|---|
| Superior height / figure height | 0.42 | 0.66 | 0.60 | 0.54 |
| Superior weight / (figure weight at that size) | 0.96 | 1.33 | 1.15 | 1.16 (scaled, then 4 units a side) |
| Hyphen and dash thickness, n stems | 1.10 | 0.74 | 0.49 | 0.66 |
| Bullet, x-heights across | 0.58 | 0.52 | 0.49 | 0.48 |
| Maths stroke, H stems | 0.60 | 0.59 | 0.48 | 0.60 (lightening thins upright strokes only, so the minus keeps 52 units; the dashes match it) |

### Spacing and kerning

Figures and punctuation were compared in shaped text (HarfBuzz, with kerning) against Georgia Pro at 44 px: figure
rhythm, punctuation fit and the dash's white read alike, so their bearings stay. New glyphs take explicit bearings
(arrows 44, maths centred in the tabular width, symbols 30-50). Rebuilt letters and the ligatures kern as their
parts (`charset.kern_like`: the left part's kern2 group, the right part's kern1 group).

### Checks at 0.47

`check.py` 21 of 21 (new: character set missing 0, one tabular width, maths on it, dashes 0.66, superiors 0.54);
`pathlint` 0 errors, 249 warnings (220 at 0.46: the rebuilt glyphs come out of pathops, which leaves curves without
nodes at their extremes after rotation or a cut); parts audit 0 outliers; fontbakery 0 FAIL, 1 WARN (contour count,
inherited accents; `ligature_carets` and `math_signs_width` are gone, `soft_hyphen` kept away by leaving U+00AD out);
`evaluate.py` jumps 27, flat 3, wobble 1 (as 0.46). Shaperglot: every European Latin language passes but the small
caps check, which needs `smcp`.

## 0.48: Vietnamese, and three fixes

- **Vietnamese** (`charset.hook_above`, `horns`, `vietnamese`). Hook above: an open curve over a short tail with a
  round end, 172 units tall (124 in the capital form), the acute's size. Horn: a short thick spur from the letter's
  upper right, tapering into a round end, ending 1.20 x-heights (1.14 cap heights) up and 0.3 to 0.8 stems right of
  the ink, as Georgia Pro's (Serrif has no Vietnamese). The 64 missing toned letters are composites by anchor: a tone
  meeting a circumflex sits beside it (left edge 0.30 of the circumflex's width right of its centre, foot 0.12 of its
  height below its top); a tilde, and any tone over a breve, stacks 22 units above. Shaperglot `vi_Latn` passes.
- **Composites follow rebuilt bases** (`follow_rebuilt`). 0.47 rebuilt dotless i 46 units narrower, but í ì î ï ...
  kept the old advance and accent offsets (accents about 35 units right of the stem). Every composite whose base this
  module redraws takes the new advance and moves its marks with the base's ink centre: 22 glyphs.
- **Anchors match the precomposed letters** (`align_anchors`). Typed combining accents sat 29 units lower on
  lowercase than in ready-made letters, and up to 40 units off on capitals whose widths `set_widths` changed. Each
  base's top and bottom anchor is now the median of where its precomposed letters put their marks: 70 anchors.
- **ą ę į ų Ę ŀ** were Libre Baskerville's own drawings: now Area's letter plus the ogonek or middle dot (e, i, u got
  an ogonek anchor: e's a little right of the bowl's bottom, i's under the stem, u's under the right stem's foot).

## Not done
- **Older Extended-B and IPA letters** (Ɓ ƀ Ŋ ŋ ĸ ʒ and the like) keep Libre Baskerville's drawings, lightened.
  Ŋ ŋ and ĸ are in Latin Extended-A (Sami, Greenlandic), so they are the next to rebuild from N n and K.
- **Historic discretionary ligatures** c_t s_t s_p stay Libre Baskerville's, lightened.
- **Oldstyle figures and small caps** (planned for version 2 of the plan): not drawn.
- **ẞ ß** keep Libre Baskerville's shapes, lightened.
- The new geometric glyphs (arrows, maths, interface) are drawn to the maths' weight with square cuts, as the
  plus and minus they sit with; they have not had an owner's look yet.
