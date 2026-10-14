# Elevation as a setting (2026-10-14)

Owner: "for customization, i want to add elevation as an option, users can choose between flat (none),
minimal, normal, and higher contrast. or whatever options you recommend. research other design system
and products elevation values and create a granular level of customization that can be applied
consistently across all components." Built as the `elevation` axis (`packages/tokens/src/axes/elevation.ts`);
the rule is DESIGN_SYSTEM.md, "Elevation". Product captures for the Minimal default are in
`elevation-2026-10-13.md`.

## Sources

Read from source on 2026-10-14 (pinned commits / versions), hex alphas as decimals:

| System | Source | Scale |
|---|---|---|
| Material 3 | material-web @5a95667, `elevation/internal/_elevation.scss`, `tokens/_md-sys-elevation.scss` | levels 0–5; key 30% + ambient 15% |
| Fluent 2 | fluentui @93e324f72, `packages/tokens/src/utils/shadows.ts`, `alias/{light,dark}Color.ts` L184–191 | shadow2/4/8/16/28/64; ambient 0 0 2 (8 at 28+), key y = blur / 2; light 12/14%, dark 24/28%; Lighter 6/7%, Darker 20/24% (dark 40/48%) |
| Radix Themes | themes @1faff10, `src/styles/tokens/shadow.css` | shadow-1…6 with a ring |
| Primer | @primer/primitives 11.10.0, `shadow.json5` | resting-xsmall/small/medium, floating-small/medium/large/xlarge; HC themes darken the ring |
| Atlassian | @atlaskit/tokens 20.6.0 | raised / overlay / overflow; increased contrast swaps shadows for an inset 1px at 50% |
| Polaris | polaris @3f7954a, `shadow.ts` | shadow-0…600 in rgba(26,26,26) |
| Tailwind v4 | `theme.css` @2ce6652f1 | shadow-2xs…2xl, no roles |
| Carbon | carbon @625020c | one shadow, 0 2 6 at 30%; modals flat over a 60% scrim |
| Geist | vercel.com/geist live CSS | xs…modal-elevated with an 8% ring |
| Ant Design | @05140c7 `alias.ts` | boxShadow / Secondary / Tertiary / Card |

Apple publishes no shadow numbers; Linear's product tokens are not public.

## Roles across systems

| Role | Material 3 | Fluent 2 | Radix | Polaris | Atlassian | Carbon |
|---|---|---|---|---|---|---|
| Control contact (thumb) | L1 | none | thumb recipe | bevel | — | none |
| Resting (card) | L0 / L1 elevated | shadow4 (filled) | ring / -2 | 100 | raised | none |
| Tooltip | none (plain) | shadow8 | none | 400 | overlay | 0 2 2 20% |
| Floating (menu, popover, select) | L2 | shadow16 | -5 | 300 | overlay | 0 2 6 30% |
| Modal (dialog, drawer) | L3 | shadow64 | -6 | 600 | overlay | none + scrim |

Every system puts the modal a level above its menus. Two layers (ambient + key) is the common recipe.
Strength comes from opacity and tightness more than blur. Dark raises opacity 2× (Fluent) and leans on an
edge, because shadows barely read on near-black.

## Design

- **Roles, not levels.** Components name the role they play: `shadow-control`, `shadow-resting`,
  `shadow-tooltip`, `shadow-float`, `shadow-modal`. The preset decides the depth of each. Dialog, Drawer and
  Command palette move from the floating lift to `modal`.
- **One shape everywhere.** Every role is two layers, ambient then key, in every preset. Unused layers are
  transparent zeros, so presets swap and animate layer by layer, and a role stays valid inside a component's
  own shadow list (the Board card's tone ring, the floating Toolbar's edge).
- **Each preset is one source.**
  - Flat: none. This is Carbon's model and Atlassian's increased-contrast model; edges and the scrim separate.
  - Minimal (default): the 2026-10-13 product captures. Notion's small chip floats, ChatGPT shows nothing at
    rest, and the modal takes Notion's popover.
  - Soft: Notion's depth, the default until 2026-10-13. It covers Card's halo, the tooltip lift, the popover
    and the search dialog.
  - Standard: Fluent 2's shadow2 / 4 / 8 / 16 / 64 at its default colours.
  - Strong: Fluent 2's Darker colours on the same geometry. This is "higher contrast" depth. It pairs with
    `data-area-contrast="more"`, which already firms edges.
- **Stroke separate from lift.** The Surface axis keeps only `border-width`: Outlined (default) or
  Borderless (was Elevated), so any stroke combines with any elevation.
- **Forced colours.** `box-shadow` computes to `none` there. Every floating surface keeps its 1px
  `border-float`, which the browser repaints, so nothing relies on a shadow to be seen.

## Not done

- A drag role (Material L4, Fluent shadow28) waits for a dragged component; Board cards don't drag yet.
- Dark Minimal's modal uses Notion's dark popover strengths on the light geometry, since `light-dark()`
  switches colours, not offsets.
- An automatic Strong under `prefers-contrast: more` was not wired: contrast stays a colour setting, and
  the choice is left to the product.
