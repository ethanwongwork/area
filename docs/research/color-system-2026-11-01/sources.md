# Sources and measurements (2026-11-01)

Gathered by two research passes for the README. Repos cloned `--depth 1` at the commits below; OKLCH measured with
colorjs.io 0.7.1; "room" = the most chroma sRGB holds at that L and h (binary search), "share" = C ÷ room. Values are
L (×100) / C / share unless stated.

## Design systems

### Radix Colors (radix-ui/colors @ `dbdb8547`, radix-ui/website @ `402e7496`)

- 12 steps per hue, separate light and dark tables, each with alpha (A), P3 and P3A twins (`src/light.ts`: blue L961, teal
  L1081, orange L1801; `dark.ts` same lines). Static tables; no generation code in the repo.
- Roles (`data/colors/docs/palette-composition/understanding-the-scale.mdx`): 1–2 app backgrounds (L20–24), 3–5 component
  backgrounds rest/hover/pressed (L46–50), 6–8 borders (L108–112), 9–10 solids, 9 "has the highest chroma of all steps"
  (L200–213), 11–12 text, "guaranteed to Lc 60 and Lc 90 APCA" on step 2 (L100–101, L307–310). Sky, mint, lime, yellow and
  amber 9 take dark text (L216). Measured: light 11 on 2 Lc 71–74, 12 on 2 Lc 95–98; dark 12 on 2 Lc 86.8 (blue), 87.5
  (teal), short of 90 (APCA version unverified).

| Step | blue light | blue dark | orange light | teal light |
|---|---|---|---|---|
| 1 | 99.3 / .003 | 19.4 / .025 / 38% | 99.2 / .003 | 99.4 / .004 |
| 3 | 96.0 / .020 / 92% | 27.4 / .066 / 76% | 95.8 / .037 / 100% | 96.0 / .026 / 46% |
| 5 | 90.5 / .051 / 100% | 36.7 / .106 / 100% | 88.8 / .088 / 100% | 90.0 / .053 / 34% |
| 7 | 81.0 / .089 / 85% | 47.4 / .122 / 83% | 80.6 / .112 / 83% | 79.6 / .076 / 54% |
| 8 | 73.4 / .121 / 81% | 54.1 / .140 / 83% | 74.5 / .132 / 75% | 72.1 / .097 / 76% |
| 9 | 64.9 / .193 / 100% | same as light | 69.1 / .191 / 97% | 64.9 / .114 / 98% |
| 11 | 55.6 / .162 / 97% | 76.4 / .126 / 100% | 58.5 / .174 / 100% | 55.2 / .101 / 100% |
| 12 | 32.4 / .096 / 77% | 90.7 / .051 / 100% | 35.0 / .069 / 63% | 32.7 / .051 / 88% |

- Borders (6–8) are dustier (75–85%) than backgrounds and solids; teal's light steps are 34–54%. Steps 1, 3, 6, 8, 12 agree
  across hues within about ±2 L; step 9 is 65 for most hues, 69 orange, 85 amber. P3 twins exceed sRGB at blue 4, 5, 9,
  11 and orange 4–6, 10, 11 (up to 126% of the sRGB room).
- Custom generator (`components/generate-radix-colors.tsx`): converts every shipped P3 scale to OKLCH (L16–42), finds the
  two nearest by ΔE_OK and mixes them by a triangle ratio (L191–300, `ratio = max(0, tanC1/tanC2)*0.5` L290); chroma scaled
  by input C ÷ nearest-step C, capped 1.5× (L303–308); hue = the input's; lightness re-eased toward the background with
  `BezierEasing` (L311–357, L544–558); step 9 = the input unless within ΔE_OK 25 of step 1 (L151–162); step 10 L shift
  `0.03/(L+0.1)`, C × 0.93 (L164–189); text steps capped at step 8/9's chroma (L78–86); APCA only to pick step 9's text
  (white below Lc 40 → oklch(0.25, max(0.08·C, 0.04), h), L360–369); alpha steps solved as the smallest alpha over the
  background with browser rounding (L371–475).

### Tailwind CSS v4 (tailwindlabs/tailwindcss @ `e4543af9`, `packages/tailwindcss/theme.css`)

- OKLCH literals, 11 steps 50–950 (orange L22–32, teal L94–104, blue L130–140); no formula, no dark set, no alpha set
  (opacity modifiers). New near-grey families mauve, olive, mist, taupe (from L274).

| | 50 | 200 | 400 | 500 | 600 | 700 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|
| blue | 97/.014 | 88.2/.059 | 70.7/.165 | 62.3/.214 | 54.6/.245 | 48.8/.243 | 37.9/.146 | 28.2/.091 |
| blue % of sRGB room | 97 | 100 | 106 | 105 | 97 | 84 | 56 | 48 |
| orange | 98/.016 | 90.1/.076 | 75/.183 | 70.5/.213 | 64.6/.222 | 55.3/.195 | 40.8/.123 | 26.6/.079 |
| orange % | 103 | 100 | 104 | 110 | 112 | 109 | 92 | 87 |
| teal | 98.4/.014 | 91/.096 | 77.7/.152 | 70.4/.140 | 60/.118 | 51.1/.096 | 38.6/.063 | 27.7/.046 |
| teal % | 64 | 70 | 109 | 111 | 111 | 107 | 94 | 97 |

- Chroma peaks at 600 (red, orange, blue, indigo, violet, purple, pink, rose), 500 (green, sky, fuchsia), 400 (amber,
  yellow, lime, emerald, teal, cyan). A P3 palette: 200–800 of most hues exceed sRGB (blue 400–500 at 98% of P3's room).
  L at 500: indigo 58.5, blue 62.3, red 63.7, teal 70.4, orange 70.5, green 72.3, amber 76.9, yellow 79.5.

### Material 3 (material-foundation/material-color-utilities @ `bd811e4c`)

- Tone = CIE L* (`typescript/hct/hct.ts` L30–31; `concepts/contrast_for_accessibility.md` L40–41: tone 40 apart ≥ 3.0,
  50 apart ≥ 4.5). Measured exactly: 40 apart ≥ 3.17:1; 50 apart ≥ 4.48:1 (tones 50 and 100), so strict 4.5 needs ≈ 50.1.
  WCAG contrast depends only on luminance, a fixed function of L*, so equal tone = equal contrast whatever the hue.
- `TonalPalette.tone(t) = Hct.from(hue, chroma, t)`: chroma held, clipped to gamut per tone (`palettes/tonal_palette.ts`
  L61–71); key colour by binary search from tone 50 (L110–135).
- Scheme chroma (`dynamiccolor/dynamic_scheme.ts`, spec '2021' default L120; primary L638–665 … neutral variant L771–799):
  TonalSpot 36 / 16 / 24 (hue +60) / 6 / 8; Vibrant 200 / 24 / 32 / 10 / 12; Expressive 40 (hue +240) / 24 / 32 / 8 / 12;
  Fidelity and Content: source chroma / max(C−32, C·0.5) / complement or analogous / C÷8 / C÷8+4; Neutral 12 / 8 / 16 / 2 / 2.
  Spec 2025 (L817–1110), phone: TonalSpot 32 (26 dark), Expressive 48 (36 dark), Vibrant 74.
- `ContrastCurve(low, normal, medium, high)` for contrast levels −1, 0, 0.5, 1 (`contrast_curve.ts` L27–62); e.g. primary
  (3, 4.5, 7, 7) `color_spec_2021.ts` L353, onPrimary (4.5, 7, 11, 21) L374, primaryContainer (1, 1, 3, 4.5) L393. The
  engine solves real ratios (`contrast/contrast.ts` L68, L100).
- Seed #0090ff, TonalSpot: light primary T40, container T90, onContainer T30; contrast 1: primary T18, container T31; dark
  primary T80, container T30. TonalSpot primary holds C ≈ 0.085 (44–72% of the room at mid tones): deliberately muted.

### IBM Carbon (carbon-design-system/carbon @ `6351ab56`, `packages/colors/tokens/colors.tokens.json`)

- 10 grades 10–100 (+ black, white, NNHover steps): orange L222, blue L950, teal L1314. Every hue at the same CIE L* per
  grade within ±2: 96, 89, 80, 69, 58, 47, 35, 24, 15, 7. All hue pairs measured: 40 grades apart ≥ 3.00:1 (cyan 10 vs gray
  50), 50 apart ≥ 4.50:1 (cyan 10 vs yellow 60). The docs give a lookup table ("Contrast ratios"), not the rule.
- Blue at ≈ 100% of the room at every grade, peak 60 (C .243); orange peaks 50, teal and yellow 30, green 40; teal 10–20
  at 53–67%. Dark themes use other grades (`link-primary` blue.60 white theme, blue.40 g100: `themes/white/theme.tokens.json`
  L887, `g100` L895). No alpha, no P3.
- Data visualisation (carbondesignsystem.com/data-visualization/color-palettes), light categorical, "in sequence strictly":
  #6929c4 purple 70, #1192e8 cyan 50, #005d5d teal 70, #9f1853 magenta 70, #fa4d56 red 50, #570408 red 90, #198038 green
  60, #002d9c blue 80, #ee538b magenta 50, #b28600 yellow 50, #009d9a teal 50, #012749 cyan 90, #8a3800 orange 70, #a56eff
  purple 50. Sequential: one hue 10–100, darkest = largest in light, lightest = largest in dark. Diverging red↔cyan,
  purple↔teal. Alert: #da1e28, #ff832b, #f1c21b, #198038.

### Adobe Leonardo (adobe/leonardo @ `eb6481da`, `packages/contrast-colors/lib`)

- `Color({colorKeys, colorSpace = 'RGB', ratios, smooth = false, saturation = 100})` (`color.js` L16). A 3000-swatch scale
  white → keys (sorted by CIECAM02 J, L174–178) → black (`color.js` L151–162, `utils.js` L157–290, L236–239); spaces CAM02,
  CAM02p, HSL, HSLuv, HSV, LAB, LCH, RGB, OKLAB, OKLCH (`utils.js` L16–28); `smooth` = spline (L59, L255–270).
  `searchColors` binary-searches each target ratio within 0.01 (L468–515); `getContrast` WCAG 2 or APCA, signed (L388–426).
  `Theme({backgroundColor, lightness, contrast, saturation})` (`theme.js` L19): `contrast` multiplies every ratio (L276);
  dark = lower `lightness`; `saturation` scales the keys' OKLCH chroma (`color.js` L135–149).

### GitHub Primer (primer/primitives @ `ec3eee6a`)

- Hues 0–9, neutral 14 steps (`light.json5`: blue L233, green L365, orange L629). Made in Prism with HSLuv
  (`contributor-docs/adrs/adr-008-color-format.md` L83–85); neutral has a lightness break between 7 and 8 (`color-scales.md`
  L200–204); contrast enforced on tokens (`scripts/colorContrast.ts`). Display scales invert in dark (`display-dark.json5`).
- Blue peaks at 4 (64.2 / .195 / 100%), orange at 4 (66.5 / .164 / 92%), green at 3 (72.6 / .164 / 81%); green 0–2 at 49–71%.
- Data-vis (`src/tokens/functional/color/data-vis.json5` L1–164): "Emphasis variants are for lines, bars, and borders.
  Muted variants are for area fills and backgrounds." (L3). Emphasis light / muted light / emphasis dark / muted dark: blue
  55.1/.187, 93.7/.038, 59.5/.222, 23.2/.091; orange 66.7/.183, 94.2/.039, 50.0/.122, 23.8/.049; green 62.6/.163,
  93.3/.076, 48.5/.109, 23.0/.028. More in `docs/research/data-views-2026-11-01/github-primer.md`.

### Apple HIG (developer.apple.com/design/human-interface-guidelines/color, values updated 9 Jun 2025)

Default light / dark / increased-contrast light / dark: red #FF383C #FF4245 #E9152D #FF6165; orange #FF8D28 #FF9230 #C55300
#FFA056; yellow #FFCC00 #FFD600 #A16A00 #FEDF43; green #34C759 #30D158 #008932 #4AD968; mint #00C8B3 #00DAC3 #008575
#54DFCB; teal #00C3D0 #00D2E0 #008198 #3BDDEC; cyan #00C0E8 #3CD3FE #007EAE #6DD9FF; blue #0088FF #0091FF #1E6EF4 #5CB8FF;
indigo #6155F5 #6D7CFF #564ADE #A7AAFF; purple #CB30E0 #DB34F2 #B02FC2 #EA8DFF; pink #FF2D55 #FF375F #E7124D #FF8AC4; brown
#AC7F5E #B78A66 #956D51 #DBA679. Light defaults at L 0.56–0.87; increased contrast drops L 0.06–0.30. Apple advises against
hard-coding them and recommends Display P3 for "visual data and status indicators" (Color management).

### Linear ("How we redesigned the Linear UI (part II)", linear.app/now/how-we-redesigned-the-linear-ui, 28 Mar 2024)

Three inputs (base, accent, contrast) generate a theme in LCH, chosen because equal L reads equally light across hues;
"instead of having to define 98 specific variables for each theme, we defined three". Contrast (30 to 100) yields
high-contrast themes. Formulas unpublished.

### OpenAI

No published hex values or gradient specification found (openai.com/brand returned 403). The Feb 2025 identity (in-house,
with ABC Dinamo and Studio Dumbar; Wallpaper, 4 Feb 2025) names no colours. Justin Jay Wang, "Methods for random gradients"
(justinjay.wang, 19 Nov 2024) documents the earlier technique: a 2 × 3 px image upscaled, then random SVG radial gradients
from a four-colour set, then DALL·E textures. Colours here are sampled from the owner's images (`sample-references.mjs`).

## Colour science

- **OKLab** (Ottosson, bottosson.github.io/posts/oklab, 2020): L and C fitted to CAM16 pairs, hue to IPT; CIELAB L RMS
  error 1.70 vs OKLab 0.20.
- **OKHSL** (bottosson.github.io/posts/colorpicker, 2021, "Okhsl"): saturation rescales chroma so s = 1 is the sRGB maximum
  at that lightness and hue; its lightness is the toe-mapped L_r, not OKLab L. Not perceived chroma: at s = 1 perceived
  chroma varies by hue. Measured: OKHSL at constant s gives green at l 0.9 C 0.151 where a white mix in OKLab at the same L
  gives 0.072.
- **Gamut mapping** (CSS Color 4, CRD 2026, §14.2): three allowed algorithms (binary search with local MINDE, EdgeSeeker,
  ray trace), all constant-L, constant-h chroma reduction in OKLCh; JND 0.02. color.js `toGamutCSS` (`src/toGamut.js`
  L245–246) @ `6a56d890`. Area's `gamut.ts` implements §14.2.1.
- **P3** (`@media (color-gamut: p3)`, Media Queries 4; Baseline since Feb 2023). Max OKLCH chroma sRGB / P3:

| L | h30 | h60 | h150 | h260 | h340 |
|---|---|---|---|---|---|
| 0.6 | .241 / .269 | .141 / .161 | .165 / .231 | .218 / .234 | .261 / .289 |
| 0.8 | .115 / .148 | .140 / .177 | .220 / .307 | .101 / .110 | .156 / .207 |

- **Ramps.** Matplotlib colormaps guide: lightness monotonic, measured in CAM02-UCS. Viridis (bids.github.io/colormap).
  d3-scale-chromatic @ `2c527921` (`README.md` L5: ColorBrewer-derived, B-spline interpolated). Observable Plot @ `535723d5`
  (`docs/features/scales.md`: turbo default L315, because blues hide low values on white L825; RdBu diverging L413;
  observable10 categorical L754). Aisch, "Mastering multi-hued color scales" (vis4.net, 2013): Lab interpolation greys the
  middle, Bezier + `correctLightness()`. Muth, "Which color scale to use" (Datawrapper, 2021): multi-hue sequential, a bright
  diverging middle. Moreland, "Diverging Color Maps for Scientific Visualization" (ISVC 2009): cool–warm with a light grey
  middle (Msh details unverified).
- **Categorical sets on white** (OKLCH L, C, ≥ 3:1): Tableau10 0.56–0.84, 0.014–0.173, 5/10; Observable10 0.55–0.80,
  4/10; Okabe-Ito 0.53–0.90, 0.117–0.172, 4/7; ColorBrewer Set2 0/8; Pastel1 0/9. Lightest colour at 3:1 on white at full
  sRGB chroma: L 0.692 (h30), 0.681 (h60), 0.671 (h90), 0.650 (h150), 0.657 (h200), 0.673 (h260), 0.689 (h300), 0.704 (h340).

## Accessibility

- **SC 1.4.11** (w3.org/WAI/WCAG22/Understanding/non-text-contrast): 3:1 against adjacent colours for UI components and
  "parts of graphics required to understand the content"; exempt when the information is also in text, visible labels or
  values, or a table; line-graph lines need 3:1 against the background, not each other; heat maps are essential
  presentations.
- **WCAG 3** (Working Draft 10 Sep 2026): "The contrast algorithm used in WCAG 3 is yet to be determined"; APCA left the
  draft in July 2023. WCAG 2.2 stays normative.
