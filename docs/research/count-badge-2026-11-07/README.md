# Count beside Badge, 2026-11-06 / 07

Owner, 2026-11-06, on Components › Overview's "Button 44 ✓ Complete": "why are count and badge so stylistically and
scale wise different. the text size is different the height is different. i get that i changed the count to rounded
corners which is better, but everything else is so off." Then, 2026-11-07: "maybe they should all be pills then?, also
is there too much horizontal padding on the textside? can you research other design systems counts and badge visual
layouts". Picks: "Yes, build it" on the recommendations of the review page
(https://claude.ai/artifact/2g6mM75soKAoZSTmL1pG74): pills, both; text side (h − 6) / 2, both; weights kept; the
measured fixes.

## What was different (type 13, density 32, radius 10)

Measured in the app and in the owner's screenshot (both plates 28 device px, 14 CSS).

| | Count soft sm | Badge soft success sm | Count md | Badge md | |
|---|---|---|---|---|---|
| Height | 14 | 14 | 18 | 18 | same |
| Text / line | 11 / 14 | 11 / 14 | 11 / 14 | 11 / 14 | same |
| Weight | 400 | 500 | 400 | 500 | on purpose (owner 2026-11-01) |
| Text to edge | 3 | 5 (4 + 1 edge) | 5 | 7 | drift |
| Corner | 4 | pill | 4 | pill | drift (Count left Pills 2026-11-01) |
| Plate / ink | 6% black, muted | tone tint, tone ink | | | on purpose |
| In the heading | centred on the title's cap | 1.3 lower (x-height middle) | | | drift (app) |
| Space before | 5.6 | 7.6 | | | drift (app) |

## Survey

Read from source at a pinned commit or version (three research passes, 2026-11-07); products from Area's captures
(`docs/research/captures/badge`, `count`, `indicator`). Default size; "side" is text to the outer edge, edge included.

| System | Status mark | H | Text | Side | Corner | Fill · stroke | Count |
|---|---|---|---|---|---|---|---|
| Primer | Label | 20 | 12 · 500 | 7 | pill | none · 1px grey | CounterLabel 18, 12 · 600, side 7, pill, 12% grey |
| GitLab | GlBadge | 20 | 12 · 400 | 6 | pill | tint · none | the same badge; one digit a 20 circle |
| Fluent 2 | Badge medium | 20 | 12 · 600 | 6 | pill (rounded 4) | tint/solid · 1px | CounterBadge = Badge; one digit a circle |
| Carbon | Tag sm | 18 | 12 · 400 | 8 | pill (4 behind a v12 flag) | grey · none | BadgeIndicator ≤16, side 4, pill |
| shadcn | Badge | 22 | 12 · 500 | 8 | pill | solid/grey · 1px clear | SidebarMenuBadge 20, side 4, corner 8, no fill |
| Untitled | Badge pill sm | 22 | 12 · 500 | 8 | pill (rounded type 6, side 6) | tint · 1px ring | the same badge sm |
| Geist | Badge small | 20 | 11 · 500 | 8 | pill | grey/solid · ring | – |
| Mantine | Badge md | 20 | 11 · 700 caps | 10 | pill | solid · 1px clear | Indicator, pill |
| Polaris | Badge | 20 | 12 · 450 | 8 | 8 | 6% grey/tint · none | the same badge |
| Atlassian | Lozenge | 20 | 12 · 400 | 5 | 4 | tint · 1px tint | Badge 16, side 4, corner 2 |
| Radix | Badge 1 | 20 | 12 · 500 | 6 | 3 (full optional) | tint · none | – |
| Chakra | Badge sm | 20 | 12 · 500 | 6 | 4 | grey · none | – |
| Ant | Tag | 22 | 12 | 8 | 4 | 2% grey · 1px | Badge count 20, side 8, pill; one char padding 0 (circle) |
| Spectrum 2 | Badge S | 24 | 12 · 400 | 9 | 7 | solid/tint · 2px clear | NotificationBadge 14, 11, side ~5, pill |
| Material 3 | – | | | | | | Badge large 16, 11 · 500, side 4, pill |
| ChatGPT | "Paid" | 22 | 14 · 400 | 8 | 4 | grey · none | – |
| Figma | plan badge | 16 | 11 · 500 | 6 | 4 | tint · none | – |
| Notion | select tag / board count | 20 | 14 · 500 / 400 | 6 | 4 (status with dot: pill) | tint / none | board count 20, side 6, corner 4 |
| VS Code | "new" | 17 | 11 · 400 | 4 | 4 | solid · none | – |

Findings:

- **Shape.** Status marks are pills in 8 of 14 systems; rounded (3–8) in the rest and in every product. Counts are
  pills nearly everywhere (Atlassian 2 and shadcn's sidebar 8 the exceptions). A count and a status on one line share
  one shape (GitLab, Polaris, Fluent and Untitled reuse the badge as the count; Primer two pills); only shadcn and Ant
  mix.
- **Text side.** Pills 0.30–0.44 of the height (GitLab, Fluent 6 on 20; Primer 7; shadcn, Untitled 8 on 22; Carbon 8
  on 18); rounded about 0.3 (Atlassian 5, Radix and Chakra 6 on 20). Area's Badge was 0.36 / 0.39, its Count 0.21.
- **Text.** One size for both in every system, 12 in a 20 (Area 11 in 14 or 18). Weights split 400 / 500 / 600.
- **Fill and stroke.** A neutral count is a light grey plate (Primer 12%, Polaris 6%) or none; a stroke is optional
  and a quiet 1px.
- **One digit.** Pill counts draw one digit as a circle: min-width = height with sides that fit (GitLab, Fluent,
  Material, Spectrum) or no sides for one character (Ant). At Area's 14 a 4 side and an 11px digit give 14.6, so Count
  drops its sides for one character (`data-single`).
- **Height (open, not built).** Area's sm marks (14 at type 13) are shorter than any status mark surveyed (16–24); they
  match the compact counts (Spectrum 14, Material 16). The heading's pair looks small beside its 15px title for that
  reason; a size question of its own.

## Built

- `packages/tokens/src/axes/pills.ts`: Count on the default Pills list again.
- `packages/styles/src/inset.css` (Badge `--_box-text` 6) and `components/count.css` (gutter `(h − 6) / 2`,
  `[data-single]` no sides); `Count.tsx` sets `data-single`; manifest `states: ["single"]`.
- App: `.studio-overview__status` placed as `.studio-count` (canvas.css); the Badges table's count md.
- Rule: DESIGN_SYSTEM.md, Optical insets, "Marks on one line"; `cohesion.test.mjs` guards it.

## Weights and vertical centring (follow-up, 2026-11-07)

Owner: "are the text weights in all the badges used correctly? the vertical alignment the same/consistent?" Measured on
195 marks rendered by the React package (every Badge variant × tone × size with text, icon or dot; Count; Tag; Kbd;
Indicator) at type 12–16 × density 28 / 32 / 36. Offset is the cap centre less the plate's centre (+ low).

| Mark | Weight | Before (13 · all) | After (13 · all) |
|---|---|---|---|
| Badge, plated | 500 | +0.10 · −0.26..+0.45 | unchanged |
| Badge, plain | 400 | +0.10 · −0.26..+0.45 | unchanged |
| Count | 400 | 0.00 · 0.00, not pixel-snapped | +0.10 · −0.26..+0.45, Badge's row to 0.01 (57 pairs) |
| Tag | 400 | −0.58 · −0.73..−0.45 | +0.38 · −0.33..+0.45 |
| Kbd | 500 | +0.13 · −0.02..+0.42 | unchanged |
| Indicator count | 500 | 0.00 | unchanged |

Weights follow one rule (type-usage rule 4: controls draw their own weight); neutral plated badges and Kbd are 500 in
the muted ink, which the rule allows a component. Picked "Yes, fix both": Count and Tag take Badge's whole-pixel
baseline (`edge + round((h − 2 · edge + 1cap) / 2)` from the plate's top), and Tag drops the optical lift.

## Sources

- Primer: github.com/primer/react/blob/35ff4972b1d62810df69f606c6785bc7f123d5d5/packages/react/src/{Label/Label,CounterLabel/CounterLabel,Token/TokenBase}.module.css; unpkg.com/@primer/primitives@11.10.0; live storybook (components-label--default, components-counterlabel--default), 2026-11-06.
- GitLab: gitlab.com/gitlab-org/gitlab-ui/-/blob/8660f9fec8cb516908ea705c6a91d21c74895564/src/components/base/badge/badge.scss, tabs/tabs.scss, tokens.
- Atlassian: unpkg.com/@atlaskit/lozenge@17.0.6/dist/es2019/new/lozenge-base.js; @atlaskit/badge@22.0.0/dist/es2019/badge-new.js.
- Polaris: github.com/Shopify/polaris/blob/3f7954ae42fabf26d63cee68c23ceebfd7ef0972/polaris-react/src/components/Badge/Badge.module.css, Tabs/components/Tab/Tab.tsx.
- Fluent: github.com/microsoft/fluentui/blob/19e2d5cd2bf81a2406327709b8856242ec38a966/packages/react-components/react-badge/library/src/components/Badge/useBadgeStyles.styles.ts, CounterBadge.
- Material: github.com/material-components/material-web/blob/d872455c4be56022da2095349b30ef46e0b55bc3/labs/badge/internal/_badge.scss.
- Spectrum 2: github.com/adobe/react-spectrum/blob/82959b6a9ac4ea717228636b99fc8fd24736a7f4/packages/@react-spectrum/s2/src/{Badge,NotificationBadge}.tsx.
- Carbon: github.com/carbon-design-system/carbon/blob/f5bdc21a0933baca91875e618f07141ff708cbe7/packages/styles/scss/components/{tag/_tag,badge-indicator/_badge-indicator}.scss.
- Ant: github.com/ant-design/ant-design/blob/5.29.3/components/{tag,badge}/style/index.ts.
- shadcn: github.com/shadcn-ui/ui/blob/42f3bb63b46a69e52a24bd005cdc9ec15ba7a7b9/apps/v4/registry/new-york-v4/ui/{badge,sidebar}.tsx.
- Radix: github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/badge.css.
- Mantine: github.com/mantinedev/mantine/blob/7.17.8/packages/@mantine/core/src/components/{Badge/Badge,Indicator/Indicator}.module.css.
- Chakra: github.com/chakra-ui/chakra-ui/blob/a619271ace57bb6f29e95968a1aa0e971ff3430d/packages/react/src/theme/recipes/badge.ts.
- Untitled: github.com/untitleduico/react/blob/1d410cb8facde8d50869e7bbb5f3d048e2267466/components/base/badges/badges.tsx.
- Geist: vercel.com/geist/badge (rendered, 2026-11-07).
