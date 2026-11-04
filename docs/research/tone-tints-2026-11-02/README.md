# Tone tints, 2026-11-02

The owner wanted Area's soft tone grounds toward Notion's banner cream (`#f9f3dc` under `#cb9434`). This note keeps the
evidence for the light tints built that day (`LIGHT_TONAL_CHROMA`, `color/curves.ts`; `chooseTonalPair`,
`color/scale.ts`).

## Sources

All read from the products' own code, without changing any product setting.

- **Notion:** `notion-tones.json`, the web app's stylesheet custom properties under `:root, .notion-light-theme` and
  `.notion-dark-theme` (app.notion.com, read in the owner's signed-in Chrome; the theme was not switched). The banner is
  `--c-yelBacSec` with `--c-yelTexSec`.
- **ChatGPT:** OpenAI's Apps SDK UI, `@openai/apps-sdk-ui@0.2.2` (unpkg), `dist/es/styles/variables-semantic.css`:
  `--color-background-<tone>-soft` is the palette's `-50`, hover and active `-75` (`variables-primitive.css`).

## Measured, light (OKLCH L / C)

| Hue | Notion banner (`BacSec`) | Notion strong (`BacTer`) | ChatGPT soft (`-50`) | ChatGPT hover (`-75`) | Area before (rest) | Area now (rest / hover / pressed) |
|---|---|---|---|---|---|---|
| yellow | 0.963 / 0.031 | 0.917 / 0.060 | 0.973 / 0.039 | 0.950 / 0.072 | 0.973 / 0.008 | 0.975 / 0.024 · 0.965 / 0.036 · 0.950 / 0.045 |
| orange | 0.949 / 0.025 | 0.911 / 0.034 | 0.944 / 0.032 | 0.889 / 0.065 | 0.976 / 0.014 | 0.959 / 0.025 · 0.943 / 0.035 · 0.927 / 0.045 |
| red | 0.949 / 0.021 | 0.909 / 0.034 | 0.917 / 0.042 | 0.877 / 0.065 | 0.975 / 0.006 | 0.950 / 0.025 · 0.930 / 0.035 · 0.913 / 0.045 |
| green | 0.950 / 0.012 | 0.911 / 0.020 | 0.943 / 0.035 | 0.896 / 0.067 | 0.962 / 0.014 | 0.975 / 0.025 · 0.964 / 0.035 · 0.949 / 0.044 |
| blue | 0.954 / 0.019 | 0.906 / 0.035 | 0.957 / 0.022 | 0.914 / 0.044 | 0.971 / 0.014 | 0.949 / 0.025 · 0.927 / 0.035 · 0.908 / 0.045 |
| purple | 0.950 / 0.020 | 0.909 / 0.034 | 0.937 / 0.035 | 0.881 / 0.067 | 0.934 / 0.035 | 0.952 / 0.026 · 0.934 / 0.035 · 0.916 / 0.045 |
| pink | 0.950 / 0.021 | 0.909 / 0.035 | 0.953 / 0.029 | 0.912 / 0.054 | 0.970 / 0.008 | 0.954 / 0.026 · 0.937 / 0.035 · 0.920 / 0.044 |
| brown | 0.951 / 0.010 | 0.911 / 0.017 | — | — | 0.953 / 0.010 | 0.977 / 0.011 · 0.965 / 0.016 · 0.949 / 0.019 |

Rest chroma across both products: 0.012–0.042, median 0.027; hover and strong: 0.020–0.072, median about 0.05.

## What was built

- Light tints take the neutral control fills' lightness (rungs 50 / 75 / 100: L 0.976 / 0.964 / 0.949) in the family's
  light-end hue at 0.025 / 0.035 / 0.045, or as far under that lightness as sRGB needs to hold the chroma (at the rest
  fill red, blue, purple and pink hold only 0.011–0.013). Dark keeps 0.05 / 0.06 / 0.07 and takes the same hue rule.
- Brown carries 0.44 of the ladder (its peak chroma, 0.064, over cyan's 0.146); at the full ladder its tints matched
  warning's in both modes.
- Light inks are solved on these tints; every Tone contrast floor and the contrast report pass.

## Effect on the default inks (4.5)

Red, blue and pink tints sit deeper, so their inks darken a little to keep 4.5:1 on the pressed tint: danger #cf033c →
#c8023a, info and the accent #0160d9 → #015cd2, pink #c7026e → #c5026d. Discovery's ink, freed from its old pressed rung
(L 0.83), rises to #742ad5.

## Tone tint (built the same day)

Owner: "Yes, build it." A setting, `tone-tint` (`axes/tone-tint.ts`), scales the ladder for the status and label tones:
0 (the neutral fill), 50 (about the rungs before), 100 (default), 130, 160 (ChatGPT's soft fills in light, rest about
0.04; Figma's tertiary fills in dark). Each tint's words are solved on it at every Tone contrast floor (`inkAt`), and
the gate checks every pair. Five values rather than every whole number: each needs its own solved inks, and a mixed
tint between two solved ones would not carry a proven ink.

In dark, holding chroma by raising lightness failed at 160: yellow's tint rose to #524400 and no yellow step kept APCA
60 on it, so its ink fell to #fcfaf4. Dark tints keep the fill's lightness and take what sRGB shows there instead.

| Light rest tint | 0 | 50 | 100 | 130 | 160 |
|---|---|---|---|---|---|
| caution | #f7f7f7 | #faf7ee | #fcf7e5 | #fef8df | #fff7d9 |
| danger | #f7f7f7 | #fff3f4 | #ffe8e9 | #ffe2e3 | #ffdbdc |
| info | #f7f7f7 | #f1f7ff | #e4efff | #dceaff | #d4e5ff |

Size: the per-tint and per-floor inputs are mixed to the Status strength once, after the pick, and each tint's and
floor's weight is derived once; tokens.css is 400 KB (346 before Tone contrast and Tone tint), the brand runtime 251 KB
(33.6 KB gzipped, 30.8 before).
