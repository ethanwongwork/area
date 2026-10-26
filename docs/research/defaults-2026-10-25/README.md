# Area's defaults, 2026-10-25

Owner: choose Area's default design-system settings, the value every Inspector setting starts at, which become the
library's shipped defaults. Then (same day): "i want to be able to choose it once and then set it and any further
customization through the theme page doesnt impact the ui of the electron app".

## Process

1. **Review page** (https://claude.ai/artifact/Nhy8FtHpYR4nMkRLUUqpWP, built by `page/`): every setting in twelve
   groups (`page/groups.ts`): Page and greys, Accent, Buttons and Selection, Contrast, Type and Density, Radius, Surface,
   Depth and shadows, State fills, Motion and Easing, Pills, Material. One group at a time: the Workspace screen
   (`apps/desktop/src/setup-screen.tsx`, Area's real components, the group's states held) in light and dark under the
   picks so far, the Inspector's real row per setting, its current default, a recommendation with the measured reason
   (docs/research/BASELINE.md, MOTION.md, the settings' own research), Use recommended / Back to current, and a group
   note and Decided. Picks are saved in the artifact's database (`picks`: one doc per setting, `{ value }`; `groups`:
   `{ decided, note }`).
2. **Apply**: each pick becomes its axis's `defaultPreset` (and the constant it reads: `DEFAULT_GROUND_DARK`,
   `DEFAULT_LAYERS` … in `color/layers.ts`, `DEFAULT_SELECTION`, `DEFAULT_PILLS`, `DEFAULT_MATERIAL`), THEMING.md's
   defaults updated, then build, tests, the contrast report and the React suites, and the gallery checked light and
   dark.
3. **The app's own UI takes the shipped defaults**, not the Inspector's values: the Inspector changes the Canvas only.

## Recommendations

Every recommendation keeps the current default. Each was set from measured references and the owner's picks between
2026-10-16 and 2026-10-24, and none is contradicted by the baseline. The one value that differs from what the owner
sees in the app is the light Button shade: the saved Canvas has 750 (navy, picked 2026-10-23), the default is Auto (the
solver's step, which matches the swatch). The page gives each setting's reason.

## The owner's picks (2026-10-25, read back from the page's `picks` and `groups`)

All twelve groups marked Decided, no notes. Four settings moved; every other setting kept its default.

| Setting | Was | Now |
|---|---|---|
| Layer contrast, light and dark (`layers-light`, `layers-dark`) | 4 | 0 (Flat) |
| Selection (`selection`) | Accent | Neutral |
| Type size (`type`) | 14 | 13 |
| Corner (`radius`) | 8 | 10 |

Applied as `DEFAULT_LAYERS` (color/layers.ts), the Selection axis's default (emphasis.ts), and `defaultPreset` in
type-size.ts and radius.ts. With Action already Neutral, the default look is now entirely neutral; layers are set
apart by their frames alone.

## Checks at the new defaults

- `npm run build`, `npm test` (27,859), the React suites (561), `contrast/report.ts` (514 assertions, 0 failing across
  66 themes), the desktop typecheck, `check:docs` and `check:app-css`: green. Two tests that pinned the old defaults
  (`emit/config.test.ts`'s Type 14, `tone.test.mjs`'s Selection Accent) now pin the new ones.
- Gallery sweep (`theme-review-2026-10-23/sweep.mjs`, combos `base` and `old`, the defaults before this review), every
  family, light and dark: 0 text failures, no overflow, no selected state painted as unselected, no console errors, and
  no token transparent that the old defaults painted.
- Electron captures, light and dark: the app's own UI at type 13, Flat, neutral; the Sidebar now sits on the page tone,
  set apart by its line (Flat has no recessed step).

## Build

See `page/build.py`.
