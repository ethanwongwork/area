# Plan: the brighter series colours into Area's tokens

Owner, 2026-11-02, after data views round 15: "Yes, plan it". Round 15's page palette (blue, pink, yellow-green, indigo,
orange, mint, purple, peach) becomes Area's series tokens. Foundation change: follows `area-foundation-change`.
Nothing here is built yet.

## What changes and why

Today every series sits at one lightness (Series lightness, default 79) under one chroma cap (0.13). That cap at L 0.79
is what made blue, pink and purple pastel. Round 15 placed each hue with the same recipe (`colourAt(h, L, 1, cap)`) but
at its own lightness and cap, as the chart status colours are. The owner liked the result ("brighter and better").

| # | Today | Proposed | Hue | L at default | Cap |
|---|---|---|---|---|---|
| 1 | sky 239 `#6bc5ff` | blue | 248 | 0.70 | 0.16 |
| 2 | pink 346 `#f697cc` | pink | 352 | 0.70 | 0.18 |
| 3 | yellow-green 104 | yellow-green (same) | 104 | 0.79 | 0.13 |
| 4 | lilac 309 | **indigo** (new) | 274 | 0.58 | 0.20 |
| 5 | peach orange 47 | orange | 50 | 0.74 | 0.16 |
| 6 | mint 171 | mint (same) | 171 | 0.78 | 0.13 |
| 7 | periwinkle 276 | purple | 305 | 0.64 | 0.20 |
| 8 | peach 16 | peach | 18 | 0.74 | 0.15 |

Default fills: `#3ba4fc #ee67aa #c8be52 #5a68ee #f98942 #49d2ac #a964eb #fb8087`.

## The setting

**Series lightness keeps one number and one effect.** It becomes blue's lightness × 100. Every other series keeps its
offset from blue, so the set moves together, as Radius names the medium Button's corner.

- **Range:** 66 to 78. The gate holds at every value (prototype, this folder's numbers):

  | Setting | Fills, neighbours CVD / normal ΔE | Darkest mark on a dark ground |
  |---|---|---|
  | 64 | 12.3 / 23.4 | 2.79:1, fails (indigo) |
  | 66 | 12.3 / 23.4 | 3.06:1 |
  | 70 (default) | 12.2 / 23.4 | 3.63:1 |
  | 76 | 9.6 / 22.1 | 4.65:1 |
  | 78 | 8.7 / 20.7 | 5.05:1 |
  | 80 | 7.5 / 19.0, fails, chroma 0.088 | 5.48:1 |

  Light marks (the hue at 3:1 on every light ground) don't move with the setting: neighbours 12.0 / 26.1.
- **Default 70**, which reproduces the round 15 page.
- **Inspector labels:** "66 (Deep)", "70 (Default)", "78 (Pale)".
- **Saved values change meaning.** Migrate in `restoreCanvas` (`apps/desktop/src/studio.tsx`):
  new = clamp(old − 9, 66, 78), so today's 79 lands on 70. Check whether any system in `systems.ts` stores the setting.

## Roles

| Token | Light | Dark |
|---|---|---|
| `--area-series-n` (mark) | Unchanged: the hue at 3:1 on every light ground (lines, keys on white) | The colour |
| `--area-series-n-fill` | The colour | **Open, see decision 1** |
| `--area-series-n-ink` | Re-solved on the new fills, ≥ 4.5:1 | Re-solved on the dark fill |
| `--area-series-n-ramp-1…7` | Unchanged recipe, walking the new hues | Unchanged recipe, ending on the colour |

## Decisions for the owner

1. **The dark fill.** Today it is a deep area (L ≤ 0.40) made to sit under a bright line. In round 13 it made bars, the
   ring and the dot grid look dull, so the page painted them with the bright colour.
   **Recommendation:** dark `-fill` becomes the colour itself, and a new `--area-series-n-area` holds the deep area for
   area charts under a line. The gate's "line over its own area" check moves to `-area`.
2. **Status colours for charts** (round 14, not yet answered). Green `#5dce8e`, yellow `#ffcd53`, red `#ff4a4b`.
   **Recommendation:** add them in the same change as `--area-data-ok`, `--area-data-warn` and `--area-data-bad`, gated
   for colour-blind separation as a set. Area's success, warning and danger roles stay as they are.

## Steps

1. **Tokens.**
   - `color/series.ts`: `SERIES` gains per-series `L` (offset from blue) and `cap`, with the new hues and order.
   - `SERIES_LIGHTNESSES` becomes 66–78 and `DEFAULT_SERIES_LIGHTNESS` becomes 70. `seriesColours` reads each series'
     own L and cap.
   - Dark fill per decision 1.
   - P3: `colourAtP3` with each series' cap.
   - `axes/series.ts`: preset labels and description, the `-area` token if added.
2. **Gate.** `contrast/series.test.ts` keeps every threshold. Add the `-area` checks and the status set (decision 2).
   Run P3 too: the prototype only covered sRGB.
3. **Consumers.**
   - Meter's stacked parts (`meter.css`): the colours change; update `docs/specs/meter.md` history.
   - Setup choice visuals: `styles/setup.css`, `option-marks.tsx`.
   - Foundations › Colors' Series section (`pages/color.tsx`): names.
   - The Foundations drawing (`abstract.tsx`) and Inspector entry (`gallery/controls.ts`).
   - Setting preview and choice visuals: `setting-preview.tsx`, `choice-visuals.tsx`, `canvas-settings.tsx`.
4. **Docs.**
   - `docs/THEMING.md` row (range, default, meaning).
   - `docs/DESIGN_SYSTEM.md` data colours rule.
   - `docs/research/color-system-2026-11-01/README.md` history line.
5. **Verify.**
   - `npm run build`, `npm test`, `node packages/tokens/src/contrast/report.ts`, `node --test packages/react/tests/*.test.mjs`.
   - Sweep at 66, 70 and 78 × light and dark × contrast More: Meter, Foundations › Colors, Setup choice cards.
   - Review page: before and after for every place series colours show.
   - Relaunch Electron from the worktree, setting at its default.
6. **Then** the data-views page drops its literal palette and reads the tokens again.

## Cost

One axis's meaning changes (migration). The only shipped component is Meter. Every gate threshold stays the same. No
`palette.json` change.

## Built (2026-11-02, owner: "Yes, build it", both recommendations)

- `color/series.ts`: `SERIES` with per-series `offset` and `cap`; Series lightness 66–78, default 70; `-fill` the colour in
  both modes; new `-area` (dark deep area under a line); ink picks dark or light, whichever clears 4.5:1 (light on
  indigo); a light mark is the colour where it already clears 3:1 (indigo, purple), so a mark is never paler than its
  series; P3 lifted until it is at least as light as sRGB (indigo was 2.98:1 on a dark ground otherwise); a dark ramp
  ends past the colour where a deep series needs room for six 0.06 steps (indigo).
- `DATA_STATUS` → `--area-data-success/-warning/-danger` (emit/base.ts), gated as a set in `contrast/series.test.ts`.
- Migration: `restoreCanvas` moves a canvas saved without the `series: 2` mark 9 down (79 → 70), clamped to 66–78.
- Docs: THEMING row, DESIGN_SYSTEM data colours + charts' status, Meter spec review note.
- Checks: build, tokens 29,274, contrast report 536/0, React tests, typecheck, desktop build, check:docs,
  check:playgrounds, test:desktop, `git diff --check`. Seen in Electron: Foundations › Colors › Series and Meter's
  stacked parts, light and dark.
- Not swept: every gallery family at 66 and 78 × contrast More (only Meter consumes the tokens today).

## Folded into the palette (2026-11-02, round 18, owner: "Yes, build them")

- Four palette families from the palette's own recipe (`generate.ts` `DATA_HUES`, presets.ts `DATA_SCALES`, between
  the named hues in `ALL_SCALES`): chartreuse 105, mint 170, sky 250, violet 305. Emitted as `--area-<family>-<step>`
  like every family; shown in Foundations › Colors among the hues. Not accent candidates.
- Each series is a step: sky 350, pink 300, chartreuse 400, indigo 450, orange 350, mint 400, violet 350, red 250.
  Mark, area, ink and ramps are steps of the same family.
- Series lightness = sky's step: 350 (Light, default) or 400 (Deep); 450 fails (indigo 2.85:1 on #1f1f1f, short dark
  ramp), 300 greys peach (red 200, C 0.09). Inspector: a Segmented. Canvas mark `series: 3`; older saves land on 350,
  or 400 for a blue lightness of 67 or under.
- Checks: build, tokens 29,174, contrast report 536/0, React tests, typecheck, desktop build, check:docs,
  check:playgrounds, test:desktop, check:app-css, `git diff --check`.
