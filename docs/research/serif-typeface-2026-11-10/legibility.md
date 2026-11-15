# What makes a legible web serif (2026-11-10)

The owner asked what makes a serif legible on screens, whether Area Serif should borrow from humanist sans
(terminals, x-height), and for a thinner regular with less contrast, not condensed, closer to Serrif.

## Measured

Fourteen serifs and three humanist sans, measured with fontTools at their text settings (optical size 12 where the font
has one), every value relative to the x-height so faces compare at the same visual size. Script:
`tools/survey-legibility.py`. Area Serif 0.2 is the version before this change.

| Font | x / em | x / cap | asc / x | desc / x | stem / x | contrast | n adv / x | c aperture / x | c terminal / stem | serif tip / stem |
|---|---|---|---|---|---|---|---|---|---|---|
| Georgia | 0.48 | 0.69 | 1.57 | 0.45 | 0.19 | 2.73 | 1.23 | – | 0.59 | 0.39 |
| Charter | 0.48 | 0.72 | 1.53 | 0.45 | 0.17 | 2.18 | 1.18 | 0.56 | 1.22 | 0.50 |
| PT Serif | 0.50 | 0.71 | 1.50 | 0.40 | 0.18 | 2.15 | 1.19 | 0.58 | 1.39 | 0.37 |
| Iowan Old Style | 0.48 | 0.69 | 1.58 | 0.53 | 0.17 | 1.87 | 1.22 | 0.64 | 0.70 | 0.41 |
| New York 12 | 0.49 | 0.69 | 1.48 | 0.46 | 0.20 | 2.05 | 1.28 | 0.53 | 1.10 | 0.40 |
| Merriweather | 0.56 | 0.75 | 1.48 | 0.44 | 0.19 | 2.04 | 1.19 | 0.52 | 1.51 | 0.48 |
| Source Serif 4 (12) | 0.50 | 0.74 | 1.48 | 0.46 | 0.19 | 1.84 | 1.32 | 0.46 | 1.02 | 0.61 |
| Literata (12) | 0.51 | 0.72 | 1.51 | 0.43 | 0.18 | 1.62 | 1.31 | 0.46 | 1.31 | 0.53 |
| Newsreader (12) | 0.47 | 0.68 | 1.55 | 0.51 | 0.18 | 1.63 | 1.33 | 0.56 | 1.08 | 0.46 |
| Roboto Serif (12) | 0.55 | 0.77 | 1.40 | 0.41 | 0.16 | 1.52 | 1.25 | 0.39 | 1.89 | 0.64 |
| Noto Serif | 0.54 | 0.75 | 1.42 | 0.45 | 0.18 | 1.87 | 1.20 | 0.52 | 1.11 | 0.45 |
| Lora | 0.50 | 0.71 | 1.51 | 0.51 | 0.17 | 2.54 | 1.21 | 0.46 | 1.10 | 0.39 |
| Serrif | 0.50 | 0.69 | 1.46 | 0.38 | 0.17 | 2.91 | 1.24 | 0.32 | 1.02 | 0.31 |
| Libre Baskerville | 0.53 | 0.69 | 1.57 | 0.47 | 0.18 | 2.21 | 1.30 | 0.58 | 0.90 | 0.41 |
| Area Serif 0.2 | 0.50 | 0.69 | 1.57 | 0.47 | 0.16 | 2.11 | 1.24 | 0.59 | 0.92 | 0.34 |
| Source Sans 3 | 0.49 | 0.74 | 1.47 | 0.42 | 0.17 | 1.24 | 1.13 | 0.70 | 0.37 | – |
| Open Sans | 0.54 | 0.75 | 1.42 | 0.45 | 0.15 | 1.25 | 1.15 | 0.69 | 0.93 | – |
| Fira Sans | 0.53 | 0.76 | 1.42 | 0.40 | 0.17 | 1.34 | 1.11 | 0.71 | 0.53 | – |

Contrast is the o's thick side over its hairline. c aperture is the gap between the c's terminals near its right
side. c terminal is the thickness of the c's upper terminal near its end, over the stem.

## What the numbers and the literature say

- **A bigger x-height relative to the capitals.** Every face designed for screens sits at x/cap 0.71–0.77 (PT Serif,
  Literata, Merriweather, Source Serif, Noto Serif, Roboto Serif); so do humanist sans (0.74–0.76). The book-derived
  faces, Georgia, Serrif and Libre Baskerville, sit at 0.69. Legge and Bigelow (2011) found a mean x-height of 0.52 of
  the body for faces designed for screens, against 0.45 for text serifs, and larger x-heights help most at small
  sizes.
- **Shorter extenders.** Screen faces keep ascenders at 1.40–1.51 times the x-height (Libre Baskerville 1.57), which
  lets the x-height grow without loosening the line.
- **Low contrast at text sizes.** Optical-size families drop contrast at their caption sizes to 1.5–1.9 (Roboto
  Serif 1.52, Literata 1.63, Newsreader 1.63, Source Serif 1.84). Hairlines under half a pixel go grey or vanish
  on 1x screens; at 13 px one pixel is 77 units. Humanist sans sit at 1.24–1.34.
- **Fuller terminals.** Screen serifs carry the c's terminal at 1.0–1.9 stems (Roboto Serif 1.89, Merriweather 1.51,
  PT Serif 1.39, Literata 1.31); Libre Baskerville's was 0.90. A fuller terminal keeps c, e, o and a apart.
- **Open apertures.** Humanist sans keep the c open at 0.69–0.71 of the x-height; screen serifs 0.39–0.64. Libre
  Baskerville is already open (0.58).
- **Weight.** Stems run 0.15–0.20 of the x-height. Humanist sans text weights sit at 0.15–0.17.
- **Width.** Screen serifs run 1.18–1.33 x-heights per n; humanist sans narrower, 1.11–1.15. Wider letters are
  recognised better away from the fixation point (Oderkerk and Beier 2022, search summary).
- **Serifs themselves** neither help nor hurt reading speed (Arditi and Cho 2005); what matters is that they survive
  rendering: a tip of about a third of the stem.
- **Letters that get confused:** two-story a and g, a footed 1, a distinct I/l/1 and 0/O (Beier and Larson 2010;
  Apple's accessibility guidance: type I, l and 1 and check they differ).
- **"Web safe"** originally meant installed on every computer (Georgia, Times New Roman). With web fonts, it now means
  a font that renders well unhinted at 12–16 px on 1x and 2x screens on Windows and macOS: whole stems, sturdy
  hairlines, open counters, honest vertical metrics so text centres in UI.

## What Area Serif 0.3 took

| | 0.2 | 0.3 | Why |
|---|---|---|---|
| x-height / em | 0.50 | 0.52 | mean of screen faces |
| x / cap | 0.69 | 0.73 | screen serifs and humanist sans |
| ascender / x | 1.57 | 1.50 | room for the bigger x-height |
| descender / x | 0.47 | 0.43 | same |
| stem / x | 0.164 | 0.158 | thinner regular (owner) |
| contrast | 2.1 | 1.8 | text-size screen serifs |
| n advance / x | 1.24 | 1.28 | not condensed (owner) |
| ball terminals | as drawn | +15% | toward the screen-serif range |
| J | descends | on the baseline | owner |

Sources: Legge and Bigelow 2011, Journal of Vision 11(5):8; Arditi and Cho 2005, Vision Research 45; Beier and
Larson 2010, Information Design Journal 18(2); Roboto Serif specimen (Commercial Type); Apple Human Interface
Guidelines, typography. Links in `README.md` and the plan page.
