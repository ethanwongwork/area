# Visible steps: which values of a setting can be told apart, 2026-10-21

Refine is only worth a screen when its options look different. This note measures how far apart each step of Area's
colour, stroke, fill and shadow settings renders, so the plan can decide which values Refine shows.

## Method

The measurement is `measure-steps.mjs` in this folder, and it can be re-run.

- **Rendering.** It renders the built `area.css` (`npm run build -w @area/tokens && node
  packages/styles/scripts/build.mjs`, from main at a6523607) in headless Edge with an sRGB profile, at 1×, one
  screenshot.
- **Specimens.** Each specimen is a 220 × 150 page, scoped with `data-area-theme` plus the setting's attribute. Every
  other setting stays at its default, as in Theme's tiles.

| Kind | What is painted | Where it is sampled |
|---|---|---|
| Layers | A raised panel (`--area-bg-surface`) and a recessed one (`--area-bg-subtle`) on the page | Both panels' centres |
| Stroke, Hover stroke | A 4px band of `--area-border-card` / `--area-edge-control-hover` on the surface | The band |
| Fills | A plate of `--area-bg-hover` / `--area-bg-active` / `--area-bg-pressed` on the surface | The plate |
| Shadows | A 120 × 60 card, corner 8, with the setting's shadow token | 18 points: 1, 2, 3, 4, 6, 8, 12, 16 and 24px below and beside the card |

The setting's own scope is held as Theme's tiles hold it (`theme-settings.ts`, `ALSO`):

- Resting, Hover and Rest shadow are measured at Stroke width 0.
- Shadow size, Softness and Light are measured on the Floating shadow at 8.
- Hover stroke is measured at Stroke 4.

**Distance** between two steps is the largest CIEDE2000 across the sampled points.

**Thresholds:**

- **About 1:** visible when the two are side by side.
- **About 2:** clear at a glance.

These are rough display thresholds for small UI fields, not lab values. Single-pixel samples miss nothing larger than
a pixel, because shadows and fills are smooth.

## Results

The "Distinct" columns walk up the scale and keep a step once it differs from the last kept step by the threshold.
"Same" lists steps that render identically to the step before. "Span" is the distance from the first step to the
last.

| Setting | Theme | Distinct, ≥ 1 | Distinct, ≥ 2 | Span | Same |
|---|---|---|---|---|---|
| Layers (ground 100) | light | 0 3 6 | 0 5 | 3.3 | |
| Layers (ground 96) | light | 0 2 4 7 | 0 4 | 3.4 | |
| Layers | dark | 0 2 4 6 7 | 0 4 7 | 6.8 | |
| Stroke strength | light | 0 2 4 6 7 | 0 3 6 8 | 7.2 | |
| Stroke strength | dark | every step | every step | 22.7 | |
| Hover stroke | light | every step | 0 2 4 | 6.6 | |
| Hover stroke | dark | every step | every step | 16.7 | |
| Hover fill | light | 1 3 | 1 | 1.7 | |
| Hover fill | dark | 1 2 3 | 1 2 3 | 10.6 | **4** |
| Selected fill | light | every step | 0 2 4 | 4.5 | |
| Selected fill | dark | 0 1 2 | 0 1 | 5.6 | **3, 4** |
| Pressed fill | light | 1 3 | 1 4 | 2.4 | |
| Pressed fill | dark | 1 | 1 | **1.0** | |
| Floating shadow | light | 0 3 5 7 | 0 5 | 4.1 | |
| Floating shadow | dark | 0 2 3 4 5 6 7 8 | 0 3 5 7 | 10.2 | |
| Resting shadow | light | 0 3 6 | 0 5 | 3.3 | |
| Resting shadow | dark | 0 3 6 8 | 0 5 | 4.0 | |
| Hover shadow | light | 0 2 4 6 7 | 0 3 6 | 7.0 | |
| Field shadow | light | 0 3 5 7 | 0 5 | 3.5 | |
| Rest shadow | light | 0 2 4 6 8 | 0 4 8 | 5.0 | |
| Rest shadow | dark | 0 | 0 | **0** | **1–8** |
| Shadow size | light | 0 1 2 4 7 | 0 1 3 | 4.1 | |
| Shadow size | dark | 0 | 0 | **0** | **1–8** |
| Shadow softness | light | 0 4 6 8 | 0 4 6 | 5.8 | |
| Shadow softness | dark | 0 | 0 | **0** | **1–8** |
| Shadow light | light | every step | 0 2 4 | 7.5 | |
| Shadow light | dark | 0 3 4 | 0 4 | 2.8 | |

**Refine members per direction.** These use the plan's directions: within each direction, a member is kept only when
it is at least 1 from every member already kept, and the representative is always kept.

| Setting | Theme | Refine members per direction | Reps apart |
|---|---|---|---|
| Layers (ground 100) | light | [0] [4] [7] | 1.6, 1.2 |
| Layers | dark | [0 2] [4] [6 7] | 2.9, 3.0 |
| Stroke strength | light | [1 2] [4] [6 7] | 2.7, 2.8 |
| Stroke strength | dark | [0 1 2] [3 4 5] [6 7 8] | 8.2, 9.3 |
| Hover stroke | light | [0] [1 2] [3 4] | 3.2, 3.4 |
| Selected fill | light | [0] [1 2] [3 4] | 1.1, 3.5 |
| Floating shadow | light | [0] [1 3] [6 8] | 1.4, 1.7 |
| Resting shadow | light | [0] [3] [6] | 1.2, 1.2 |
| Hover shadow | light | [0] [1 3] [6 7] | 2.4, 2.5 |
| Field shadow | light | [0] [3] [6] | 1.2, 1.4 |
| Rest shadow | light | [0] [2 4] [6 8] | 1.2, 2.5 |
| Shadow size | light | [0 1 2] [4] [7] | 2.4, 1.0 |
| Shadow softness | light | [2] [3 4] [6 8] | 3.3, 1.9 |
| Shadow light | light | [0] [1 2] [3 4] | 2.6, 4.9 |

## What it means

1. **Most nine-step settings show three to five levels.** At ground 100 in light, Layers, Resting shadow and Field
   shadow each have three visibly different levels (0, 3, 6). Their Refine collapses to the representative alone, so
   their loop is Direction then Check. The exact row still lists every step. This is fewer screens, and it is not a cut:
   every value stays reachable.
2. **Subtle directions.** In light, the directions of Layers, Resting, Field and Floating shadow are only 1.2–1.7 apart.
   They are visible side by side but not at a glance. Their pictures must sit next to each other, and the stage
   preview and hold-to-compare carry the decision. Pictures stay at true scale; magnifying the shadow would misstate
   the value.
3. **Dark makes some steps identical.** These come from the caps in `--area-bg-hover`, `--area-bg-active` and
   `--area-bg-pressed` (the `min(0.21…)` / `min(0.22…)` terms):
   - **Hover fill:** 4 equals 3.
   - **Selected fill:** 3 and 4 equal 2 (at Hover fill 2).
   - **Pressed fill:** all four steps fall within 1.0.

   The flow must not offer these as different choices in dark. **Owner question:** are the caps intended, or should
   the dark ladder be re-spaced? That would be a foundation change (`area-foundation-change`), not part of this flow.
4. **Dark shadows don't show on the near-black page.** At Dark ground 8, Rest shadow, Shadow size and Shadow softness
   change nothing measurable: a black shadow on #020202 has nothing to darken. The Floating shadow still reads in dark
   only through its light rim. So the flow asks Rest shadow, Size, Softness and Light on the **light** stage, with a
   note that dark shadows stay hidden on a near-black page. Only Dark ground 8 was measured; re-run
   with `data-area-ground-dark` set to find the ground where they start to show.
5. **Strokes are three times stronger in dark.** Stroke strength spans 22.7 in dark against 7.2 in light, and every
   dark step is clearly distinct. One Stroke pick therefore looks much heavier in dark. The flow's "Now in dark" pass
   should show Stroke on the dark stage too, as a check rather than a new question, since Stroke is one setting for
   both themes.

## Not measured

- **Radius, Type, Density, Stroke width.** These are geometry, not colour. Radius needs a judgement sheet (plan §8).
  Type and Density are sizes people already judge reliably.
- **Motion.** People notice duration changes of roughly 10–20% [unverified for UI transitions]. Adjacent motion steps
  of 30ms are 10–25% apart above 120ms, so Standard's Refine (120–210) may need checking in the same way.
- **Accent.** The hues are far apart; the family split is about choosing, not seeing.
- **Contrast More, other neutrals, other grounds.** Defaults only.
