# Theme review, 2026-10-23

Owner: "theres been a ton of updates to color, themes, can you just do a pass on all the theme work to make sure
everything is working as intended, there are no visual errors due to all the combinations and various axis".

## Method

- **Rendered sweep** (`sweep.mjs`, `combos.mjs`, `diff.mjs`). Every family's gallery (119) at 12 setting combinations,
  light and dark, in headless Edge against a static desktop build. For each text-bearing element it records the WCAG
  ratio of its ink over the composited plate under it. For each combination it probes every `--area-*` colour token on
  the Canvas scope (an invalid one paints transparent) and logs console errors and clipped text. `diff.mjs` reports what
  a combination breaks that the defaults don't.
- **Combinations.** `loud` (yellow, Solid 400 / 850, Label tint 4), `dusty` (hue 355 at strength 30, Status Match,
  Solid 850 / 400), `tinted` (warm, Tint hue Accent at 16, Ground 90 / 24, Layers 8, Card tone −4 / +4), `flat` (Layers
  0, Stroke 0, Width 0), `contrast` (Contrast 8 with a 16 tint), `fills` (every Fill and Stroke state setting at its
  extreme), `lime` (hue 95 at 60, cool, Tint hue 200), `grey` (91 / 24, Layers 8, Card tone −4 / +4, Selection and Action
  Accent), `grey0` (90 / 20, Layers 0 / 8, Fill 4 / 4), `big` (16, 36, pill), `small` (12, 28, 0).
- **Code reviews.** Every setting traced from the registry through emission, the Inspector, Theme (Browse and Setup),
  saved-state restore and React `Theme`, and the colour maths (hue wraparound, strength mixing, Solid, Label tint, tint
  room, card tone, Status Match), with each suspicion measured.
- **Result at the defaults.** Before and after the fixes, the default token probe is identical in both modes, and the
  defaults' own failures are the known ones: Folder's count (2.52:1), Edit summary's diff markers (4.27:1, glyphs), and
  the keycaps in an accent Button (below).

## Fixed

| Defect | Where it showed | Fix |
|---|---|---|
| A setting scope inside a ground (a sidebar, card, menu, `data-area-ground`) reset its control fills to the page's | Theme tab Browse tiles, Setup previews, any `Theme` inside a region: a Motion-only scope in a recessed region painted 0.97 on 0.922 | `layers.css`: each ground re-points the fills on the setting scopes inside it with `@scope`, the nearest ground winning; cohesion test |
| Selected tint resolved where it was set, so an inner scope that changed the accent or the fills kept the parent's tint | Any nested accent or Fill scope | `axes/states.ts` writes two switches; `selected-tint` derived in `emit/base.ts` |
| The pressed fill wasn't re-derived on scopes that set Tint, Text tint, Card tone or Accent | Nested scopes with those settings kept the parent's press | Added to the `layers.css` list and its cohesion test |
| Dark fills ran past the lightness where white text clears at strong Fill steps | `grey0` dark: Segmented, Nav current, Calendar, Board at 2.85:1 | `DARK_FILL_CEILING`: the fills' step shrinks so the selected fill stops where white text keeps 4.6:1 pressed (158 combinations); defaults unchanged |
| Tonal inks were solved on the page only | `grey` light: an accent Badge on a Card at Card tone −4, 4.07:1 | Tonal inks on the deepest ground text sits on, vivid inks on the page or a darker Card tone; unchanged at the defaults |
| Label tint was checked on the fill and hover, not the press | Lime at Label tint 4 in dark, 4.21:1 pressed | `tintedLabel` includes the press; the accent gate measures it (WCAG) |
| Code block's highlighted line and Box model's neutral padding darkened their inks for the default selected wash only | `fills` and `grey0` light: keywords 3.83:1, Box model 4.48:1 | The darkening scales with the Hover and Selected fill steps |
| The page colour field stopped at Tint 8 | Setup's page colour picker | Reads the registry's strongest step (16) |
| Copy picks put "no attribute (the OS decides)" into the attribute string | Setup's summary | Skips System contrast |
| The Theme tab's own body inherited the Contrast pick | Theme tab at any Contrast pick | The body states the OS level |
| Stale counts | registry.ts, THEMING.md, tint.ts | 44 axes, the Fill heading, "of 16" |

## Open for the owner

Each of these changes how something looks at or near the defaults, so it is a choice, not a fix:

1. **Keycaps in an accent Button.** The keycap is a 14% plate of the label (owner, 2026-09-30). On an accent solid the
   label clears by a small margin (blue 4.66:1), so the keycap's glyph doesn't: 3.7 to 4.2:1 at most accents, the
   default blue included (3.76), whenever Action is Accent. Options: the plate moves away from the label (darker under
   white), or no plate on an accent solid.
2. **Hued text on state fills.** Accent, status and link text is solved for the ground, not for a hover or selected
   plate on it: an accent link on File upload's drag plate measures 4.20:1 at `grey0` light and 3.97:1 at `grey` dark;
   danger text on a selected recessed row 3.27:1 at 91 + 8. Solving on the deepest selected fill darkens the defaults
   slightly (tonal 0.019 at 100 + 4).
3. **Vivid inks on the recessed layer at the defaults** (validation, danger and syntax text in a sidebar): about 4.3:1.
   Solving them there darkens them about 3% at the defaults.
4. **Tonal borders and control strokes on grey grounds.** `<tone>-border` is solved on white, so on a 90 to 95 page an
   outline Badge's edge falls to 1.0 to 1.3:1; `stroke-control` (Switch, chevrons) drops under 3:1 on selected fills on
   46 of 55 light ground × Layers pairs.
5. **Selection Accent at low strength.** At strength 30 the accent's selected plate is within ΔE 0.004 of hover (green),
   and pink's is lighter than hover at full strength: the neutral fills keep a step between them, the accent plate doesn't.
6. **A pressed black-label accent in dark** reads APCA Lc 58 (orange, every Label tint; WCAG 9:1): the press darkens
   toward the label. The gate measures the press on WCAG only until this is decided.
7. **Minor.** `fg-disabled` misses its 1.9 floor at 90 + 0 (1.85); Solid Auto at strength under 100 is held to 4.5, not
   the 4.6 / APCA 61 the steps are, so the accent colour field can never return Auto for 21 accents.

## Round 2, 2026-10-24: every setting together

Owner: "test all the axis altogether, including the new updates made to color. make sure everything works well, see if
there are axises that can be cleaned up or simplified, or even axises that can be improved".

- **Method.** `random.mjs 30 7` draws 30 combinations in which every registry setting, Contrast and Pills take a random
  value (seeded, so `r00` … `r29` regenerate exactly); `sweep.mjs` runs each in light and dark over all 119 families (62
  runs with the defaults), now also recording content wider than its tile (re-measured once the gallery has refitted) and
  selected states painted exactly as an unselected sibling. Two measurement and research passes ran beside it: whether each
  option paints anything its neighbours don't (from the token model), and how peers structure theme settings (Radix,
  Material 3, Fluent, Spectrum 2, Carbon, Atlassian, Primer, Linear, shadcn).
- **Result.** No text failure, broken token, console error or invisible selected state in any random combination, apart
  from the keycaps in accent Buttons (round 1, item 1).
- **Fixed.**
  - The dark translucent washes kept their order only at low Fill steps: at Hover 3 and 4 every Selected and Pressed step
    painted as hover (each capped on its own at 21 / 21 / 22%). Hover now stops at 18.3% and selected at 20.3%
    (`DARK_WASH`, emit/base.ts; a test over every Hover × Selected × Pressed); unchanged at the defaults.
  - The gallery's fit measured only Area elements, so a demo's own labels (Skeleton's rows) and a specimen sitting off
    centre in a wider stage were clipped by 11 to 46px whenever Type or Density narrowed the Canvas. It now counts the
    demo's text for the scale and fits the farther half about the stage's centre (`gallery/fit.ts`). At the defaults 3 of
    1,173 tiles change, the ones that clipped.
- **Proposals.** 19 cleanups and improvements and the 5 open items from round 1, each with its measurement, on the Axis
  review page (https://claude.ai/artifact/MsmaG7SrCpasUrd33H3PQb, collection `verdicts`, one document per item id). The
  measurements behind them: Solid steps paint 452 of 913 distinct accent fills (orange 1 of 11); Label tint moves nothing
  for 61 of 83 accents at Auto, blue included; 65 of 192 Tint hue × step options on white sit past the hue's room; Card
  tone +1 to +4 equal 0 on White; light Accent strength moves the accent surface ≤ ΔE 0.007 a step; ten settings have no
  effect under another's default (Tint hue at Auto Neutral, Solid and Label tint at Action and Selection Neutral, Status
  colours at strength 100, Shadow colour in dark …); ids that don't match labels (`surface`, `stroke`, `elevation`,
  `ink-tint`, Rest shadow beside Resting).
