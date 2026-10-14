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

## First design (superseded the same day)

Five named presets, each one system's values: Flat, Minimal (Notion's chip), Soft (Notion's popover),
Standard (Fluent 2) and Strong (Fluent 2 darker). Owner, on the review: Standard and Strong were "a bit too
strong for the segmented control specifically ... perhaps the standard and strong elevations can be toned
down even more. also figure out a naming convention similar to the existing axis ... think about the 2px
scale for corner radius and the 1px scale for typeface".

## Design: one number

The setting is the Menu's shadow strength in percent, `0` (Flat) to `8`, one step at a time, `3` by default.
Radius works the same way (the medium Button's corner) and so does type size (the base text). Every role scales
from that one number:

- **Geometry is fixed per role.** It is Fluent 2's recipe: an ambient layer with no offset, then a key layer
  whose offset is half its blur.

  | Role | Fluent tier | Ambient | Key | Weight |
  |---|---|---|---|---|
  | control | shadow2 | 0 0 2 | 0 1 2 | 1 |
  | resting | shadow4 | 0 0 2 | 0 2 4 | 0.5 |
  | tooltip | shadow8 | 0 0 2 | 0 4 8 | 0.5 |
  | float | shadow16 | 0 0 2 | 0 8 16 | 1 |
  | modal | shadow28 | 0 0 8 | 0 14 28 | 2 |

- **Strength scales the alpha only.**
  - The key is `step × weight` %.
  - The ambient layer is half the key, as in Notion's popover (2.7% under 5%) and Area's previous lift.
  - Dark doubles both, since Fluent's dark shadow colours are its light ones doubled.
  - The weights are picks. Resting surfaces and annotations sit under the floating role and a modal over it,
    as in every system surveyed.
- **Anchors on the scale.**
  - 3 is Notion's lightest lift: its small floating chip at 2.7%, captured 2026-10-13.
  - 5 is Notion's popover key (5%).
  - 8 is ChatGPT's menu (8%).
  - Fluent's 14% is past the top of the scale.
- **Step 8 vs the first design's Strong.** The Segmented thumb at step 8 is `0 1 2` at 8% plus `0 0 2` at 4%;
  Strong was Fluent shadow2 at 24% / 20%.
- **Two layers at every step.** Every role keeps two layers, so changing step interpolates layer by layer.
  Step 0 is a transparent shadow, never `none`.
- **Stroke stays separate.** The Surface axis keeps `border-width`: Outlined or Borderless.

## Component audit

Every component, and the role (if any) its surface takes. A component that opens another (Combobox opens
a Menu) inherits that surface's role; nothing chooses a shadow of its own.

| Role | Components | Why |
|---|---|---|
| control | Switch thumb, Slider thumbs (single and range), Segmented thumb, soft Toggle group selection, Badge modern | A raised part on a track or plate: a contact shadow says "on top of", with `edge-selected` as its edge. The tracks are recessed and take none. |
| resting | Card, Panel, Board card, Composer | Objects that stand alone on the page. Composer joins them (owner, 2026-10-14, "go with your recs"): ChatGPT lifts its composer, 0 2 8 at 4% and 0 4 80 8 at 2.4%; its focus halo is layered over the role. Their edge carries them; the lift is a hint that grows with the step. |
| tooltip | Tooltip, Toggletip | A small annotation. In light its inverted fill separates it; the role adds depth only as the step rises. |
| float | Menu, and every component that opens one: Context menu, Combobox, custom Select, Tag picker, Model picker, Split button, Zoom control. Popover, and every component built on it: Hover card, Date picker. Also the Select picker, Toast, the Calendar and ColorPicker surfaces, the floating Toolbar, Board card actions, and Scroll to latest (new) | Surfaces over the page or over content. Scroll to latest floats over a conversation, so it now takes the role; it was flat because ChatGPT draws none, and at the default step it is close to that. |
| modal | Dialog (and Confirm dialog), Drawer, Command palette | The topmost surface, over the scrim. Inline variants (Command palette `inline`, Calendar `plain`, ColorPicker `plain`) sit in the page and take none. |
| none, in-flow controls | Button (every variant), Button group, Split button's trigger, Input, Textarea, Number field, Search field, Select, Input group, Box field, Color field, Checkbox, Radio, Chip, Tag, Kbd, Link, Pagination, Breadcrumb, Alignment picker, Editable text, Prompt suggestions | Controls rest in the page with their edge and plate (ChatGPT, Notion and Figma shadow no button or field; DESIGN_SYSTEM.md). |
| none, content in a surface | Code block, Table, Alert, Message, Empty state, Preview frame, Token row, Asset row, Property list, Description list, Accordion, Tree view, Nav, Timeline, Box model, Citation, Shortcut list, File upload, Scroll area, Meter, Progress, Skeleton, Spinner, Avatar, Count, Indicator, Presence | Content inside a page or a surface, not an object on it: rules and edges, never a lift. Indicator's ring is a cutout in the surface colour, not a shadow. |
| functional, fixed | ColorPicker thumbs (0 1 3 −2 at 10%, 0 5 12 −2 at 13%) | They sit on a full-colour gradient, where the lift keeps the handle visible. The setting doesn't move them, and they keep it at step 0. |

## Not done

- A drag role (Material L4, Fluent shadow28) waits for a component that drags; Board cards don't yet.
- An automatic higher step under `prefers-contrast: more` was not wired: contrast stays a colour setting.
