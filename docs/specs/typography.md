# Type ramp spec (proposal)

**Status:** applied · 2026-09-25 (owner-approved). Tokens in `typography.ts` and `density.ts`.
**Owner direction:** lighter weights, with no semibold or heavier titles in UI. Use as few
sizes, weights and foreground colors as possible, and let a single variable carry each
distinction.

## Current Area ramp (`packages/tokens/src/axes/typography.ts`, `density.ts`)

- Weights: regular 400 and strong 500 (never higher). Strong is used on control labels,
  field labels, nav and tab labels, badges, and every surface title (card, dialog,
  popover, panel, alert, toast).
- Text roles: xs 12/16, sm 14/20, md 16/24, lg 18/26, xl 20/30.
- Title roles: xs 16/22, sm 20/26, md 24/30, lg 32/40, xl 40/48. Display: 56/56, 72/72.
- Control tiers (default): 12/16, 13/18, 14/20, 14/20, 16/24; compact shifts down.
- That makes 11 distinct sizes and two leadings for some sizes (16/22 and 16/24;
  20/26 and 20/30). Titles land on 26 and 30, off the 4px grid.
- Components use: control-md 14/20 (about 30 rules), control-sm 13/18 (about 20),
  control-lg (14), text-sm/xs (about 10). Component CSS does not use the title tokens.
- Foreground: `fg-default` and `fg-muted` (46 uses each), `fg-disabled` (14), plus
  tone colors.

## Product census (visible text, weighted by characters, light theme, 2026-09-25)

| Product | Main pairs | Headings | Weights (share of text) | Text colors |
|---|---|---|---|---|
| ChatGPT home | 14/20, 16/24, 16/26 | 24/28 at 400 | 400 97%, 500 2%, 600 1% (logo) | 2 main: `rgb(13,13,13)`, `rgb(143,143,143)` |
| Notion board | 15/22.5, 14/21, 12/16 | page title 32/38.4 at 700 | 500 83%, 400 17%, 700 <1% | 4 warm grays |
| Figma file browser | 11/16, 13/22 | 18/25 at 550 | 550 65%, 450 19%, 400 16% (Inter variable) | 2: 90% and 50% black |
| Cursor docs | 15/21, 15/24.4, 14/20, 12/18 | 33.75/40.5 and 20.6/26.8, both at 400 | 400 92%, 700 8% (inline strong) | 2 plus accent |

Tracking seen: Cursor +0.005em at 15px, +0.05em at 12px (labels), −0.005em at 20.6px and
−0.02em at 33.75px. Figma +0.005em at 11px.

Findings:
- The products the owner prefers (ChatGPT, Cursor) set headings at regular weight and
  build hierarchy from size, tracking and color. Notion's heavy page title is the
  outlier the owner wants to avoid.
- Two text colors carry nearly everything (ChatGPT, Figma, Cursor). A third is for
  disabled or placeholder text only.
- UI line heights sit on a 4px grid for UI text (14/20, 16/24, 12/16); prose adds a
  looser 16/26 (ChatGPT) or 15/24 (Cursor).

## Proposal

**Weights (one variable at a time).**
- 400 for all running text and **all titles and headings**.
- 500 only where a label must hold its own against a fill or a selected state: button,
  segmented, badge and count labels.
- Nav items, tabs, field labels and surface titles move to 400. Selection is carried by
  color and the selected fill; a title is carried by size or color.

**Sizes and line heights (six UI sizes, one leading each, all on a 4px grid).**

| Role | Size / line height | Tracking | Replaces |
|---|---|---|---|
| caption | 12 / 16 | +0.005em | text-xs, control-xs |
| ui | 14 / 20 | 0 | text-sm, control-md/lg |
| body | 16 / 24 | 0 | text-md, title-xs (16/22) |
| title-sm | 20 / 28 | −0.01em | text-xl (20/30), title-sm (20/26) |
| title-md | 24 / 32 | −0.015em | title-md (24/30) |
| title-lg | 32 / 40 | −0.02em | title-lg |

- Prose gets one looser pairing, 16/26, applied by the long-form container rather than
  by a separate role.
- Compact UI keeps the axis shift for text: caption 11/14 (the compact xs control tier),
  ui 13/18, body 14/20. Titles stay at their default sizes.
- Remove from the UI ramp: 18/26 (text-lg), 40/48 (title-xl), and the separate title and
  text duplicates. Display 56 and 72 stay as a marketing-only group.
- control-sm (13/18 at default) is the one extra size. Either keep it for small controls
  only, or move small controls to 12/16 captions. Recommendation: move them, so default
  UI uses 12, 14 and 16 only.

**Foreground (two levels plus state).**
- `fg-default` for content and titles; `fg-muted` for secondary text and metadata.
- `fg-disabled` only for disabled and placeholder text.
- Tone foregrounds only where meaning requires them.

**Icons against type.** Pair 16px icons with ui (14/20) and body text; see
[icons.md](icons.md) for stroke pairing (1.25px against the 14px/400 stem of 1.2px).

## To verify before adopting

- Render gallery tiles (dialog, card, popover, panel, nav, tabs, fields) at the proposed
  weights and leadings, side by side with current, in light and dark, default and compact.
- Contrast: moving selection cues from weight to color must keep the selected state
  distinct in the increased-contrast mode (CONTRAST.md).
- Owner review; then update `typography.ts` and `density.ts`, and the components that set
  weight on titles and labels.
