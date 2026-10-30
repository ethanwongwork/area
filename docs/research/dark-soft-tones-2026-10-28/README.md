# Dark soft tones (2026-10-28)

The owner said yes to this question on the round 81 review page: in dark, a soft tone's
surface (soft Button, soft Badge, a tinted Chip or Stepper mark, Confirm dialog's Delete)
reads nearly as strong as a solid one. These notes measure what ChatGPT, Notion and Figma
paint there and propose quieter dark surfaces. Light is unchanged.

All values come from the products' own stylesheets, read without changing any product
setting:

- **ChatGPT:** OpenAI's Apps SDK UI, `@openai/apps-sdk-ui@0.2.2` (npm, 2026-05-05). That's
  public code for ChatGPT apps, not the live client (`docs/DESIGN_REFERENCES.md`).
  - `dist/es/components/Button/Button.module.css:541-545`: soft danger reads
    `--color-background-danger-soft-alpha`. Every soft colour follows the same pattern.
  - `dist/es/styles/variables-semantic.css:232-234`: `--red-a50` (`#fa423e` at 16%),
    `--red-a75` (30%).
  - `dist/es/styles/variables-primitive.css:70, 244`: `--red-400: #fa423e`; dark
    `--gray-0: #0d0d0d`.
- **Figma:** `https://www.figma.com/webpack-artifacts/assets/auth-1af2e765dfd2be31.min.css.br`
  (the login page's stylesheet), block `[data-preferred-theme="dark"]`, tokens
  `--color-bg-{danger,warning,success,brand,component}-tertiary{,-hover,-pressed}`. Those
  tokens point at a separate `--ramp-pale-*` ramp in dark, against the vivid ramp in light.
  Values were resolved with `getComputedStyle` in that theme.
- **Notion:** `https://notion.notion.site/_assets/77281-f6c7fffcc9c9d5a0.css` (a public
  page's theme sheet), block `@media screen{.notion-dark-theme{…}}`:
  - `--c-{color}BacSec`, the block and callout background;
  - `--ca-{color}BacTerTra`, the select tag. Light `#ce18002a` for red, matching the capture
    `docs/research/captures/badge/notion--select-red--rest--light.json`.
  - Page `--c-bacPri: #191919`.

## Measured (dark, composited over each product's own ground, OKLCH)

| Source | Tone | Fill | L | C | L above ground |
|---|---|---|---|---|---|
| ChatGPT soft button, on #0d0d0d | danger | #331615 | 0.243 | 0.047 | 0.083 |
| | warning | #331c10 | 0.254 | 0.042 | 0.095 |
| | success | #0c2616 | 0.243 | 0.045 | 0.084 |
| | info | #0c1d2c | 0.224 | 0.037 | 0.065 |
| | discovery | #211730 | 0.230 | 0.049 | 0.071 |
| | caution | #31280b | 0.280 | 0.046 | 0.121 |
| ChatGPT soft button, on #212121 | danger | #442626 | 0.307 | 0.046 | 0.060 |
| Figma tertiary, on #2c2c2c | danger | #60332a | 0.376 | 0.067 | 0.083 |
| | warning | #5c4100 | 0.395 | 0.081 | 0.102 |
| | success | #2f483c | 0.377 | 0.037 | 0.084 |
| | brand | #394360 | 0.387 | 0.051 | 0.094 |
| | component | #473956 | 0.372 | 0.052 | 0.079 |
| Notion background, on #191919 | red | #502c29 | 0.338 | 0.054 | 0.125 |
| | orange | #53361f | 0.361 | 0.055 | 0.148 |
| | yellow | #504425 | 0.391 | 0.049 | 0.178 |
| | green | #263d30 | 0.336 | 0.037 | 0.123 |
| | blue | #233850 | 0.335 | 0.050 | 0.121 |
| | purple | #3c2d47 | 0.326 | 0.049 | 0.112 |
| Notion select tag, on #191919 | red | #924943 | 0.495 | 0.100 | 0.281 |

Hovers: ChatGPT danger 30% → C 0.084; Figma danger hover C 0.092, brand hover C 0.055.

**What the three agree on:**

- A soft surface in dark carries about **0.04–0.07 chroma** (median 0.049). That holds
  whatever the ground, so it isn't the light value inverted.
- It sits **0.06–0.15 above its ground** in lightness, about one control step. Notion's
  select tag is the outlier: a louder label at C 0.10.
- Figma states the rule outright: in dark, its tertiary fills switch to a separate pale
  ramp.

## Area today (dark)

`chooseTonalPair` (`packages/tokens/src/color/scale.ts`) picks each tone's dark surfaces from
the family's own rungs (850 to 600). Among sequences that keep the ink readable, it prefers
the one with the **most chroma**. Those rungs are vivid by construction (`DARK_CHROMA_CAP`).
The resulting rest surfaces:

| Tone | Rest | L | C | Ink contrast |
|---|---|---|---|---|
| danger | #820022 | 0.384 | 0.154 | 7.34 |
| warning | #693000 | 0.380 | 0.097 | 6.98 |
| accent / info | #002966 | 0.299 | 0.116 | 7.89 |
| discovery | #371a63 | 0.304 | 0.121 | 8.04 |
| success | #004019 | 0.325 | 0.089 | 7.53 |
| caution | #453000 | 0.325 | 0.067 | 7.70 |

That's two to three times the references' chroma. Danger also sits 0.30 above the page,
higher than the neutral soft control (neutral 800, L 0.277).

## Proposal

In dark, a tone's soft surfaces become the **neutral control steps, tinted**:

- **Lightness:** each surface takes the lightness of the neutral control fills
  `component` / `componentHover` / `componentActive` (800 / 750 / 700, L 0.277 / 0.321 /
  0.368). So a soft danger Button sits exactly where a soft neutral Button does.
- **Hue:** the tone's own.
- **Chroma:** fixed.
  - **A (recommended): 0.05 / 0.06 / 0.07.** The references' median, matching ChatGPT and
    Notion.
  - **B: 0.075 / 0.09 / 0.105.** The top of the band, near Figma's danger and warning.

Every ink still clears the gate (WCAG 4.5 and APCA 60 against all three surfaces), with more
room than today. For example, danger rest goes from 7.34 to 10.38 under A. The calculation is
in the review's scratch `cand.ts`, from `color/oklab.ts`, `gamut.ts` and `contrast.ts`.

## Decision and build (2026-10-28)

The owner picked **A** and approved every family on the review page
(https://claude.ai/artifact/ASWB3h6XR8xR9752gr6fbs; the decision item first recorded "Keep as is", corrected to A in
chat). Built in the tokens:

- `DARK_TONAL_CHROMA` (`color/curves.ts`) holds 0.05 / 0.06 / 0.07.
- `chooseTonalPair` (`color/scale.ts`) derives the dark paint: the neutral family's L at `INVERSION.component`,
  `componentHover` and `componentActive`, in the tone's hue at that rung, gamut-mapped. `TonalChoice.paint` carries
  what each theme paints; light paints its rungs as before. The `tonalSurface` alias reads `paint`, and `aliasLevel`
  reports no rung for a derived surface.
- The ink is still chosen on the rung sequences, and now also on the paint. For every named family the rungs are the
  lighter ground, so no ink moved; a dark grey brand (#45494c, #292326) whose rungs sit below the paint takes a lighter
  ink instead of failing APCA 60 on the pressed surface (`contrast/brand.test.ts` found it). Gating the ink on the
  paint alone would have deepened every dark ink (danger #ffc9cb → #feb0b3) and the accent's ring, unreviewed.
- `indicatorLevel` still measures the tints' rungs, lighter than the paint in dark, so the ring is unchanged.

Checks: only the `*-surface*` and `*-border-subtle` tokens change (36 per stylesheet); light is identical; the built dark
values equal the reviewed draft to within 2/255. Tokens 27,899 tests, typecheck, contrast report (514 passing, 66
themes), React 595 tests. The eight families' 183 dark tiles against draft A differ in 5 pixels (antialiasing).
