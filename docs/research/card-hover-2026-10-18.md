# Card hover: a lift, not an edge (2026-10-18)

Owner: "i dont like the card hover state with the stroke outline color change, can you do something more subtle with
the shadow and apply some smooth, subtle, professional motion?"

Measured in the built-in browser (computed styles and the page's own CSS rules), light, 1024 wide:

| Source | Rest | Hover | Motion |
|---|---|---|---|
| Notion, tatami linked card (notion.com/templates) | 1px `rgba(0,0,0,.05)` edge, no shadow | edge unchanged; `::after` with `--tatami-shadow-card-shadow` (four layers, the largest `0 4px 18px` at 4%) fades from opacity 0 to 1 | in `.15s cubic-bezier(0,0,.58,1)`, out `.2s cubic-bezier(.42,0,1,1)` |
| Notion, marketplace connection card | 1px edge | `0 2px 12px rgba(0,0,0,.08)` | `box-shadow .15s` |
| Fluent 2 Card, interactive (`useCardStyles.styles.ts`, microsoft/fluentui master) | `shadow4` | `shadow8`, fill one hover step | none in the card's styles |
| Vercel templates | 1px edge | the image tilts −2deg; no shadow | — (not taken) |

Area: the edge stays; hover steps a card's resting shadow (Fluent's shadow4) to the Menu's float shadow (Fluent's
shadow16 geometry at the Elevation step: 3% key, 1.5% ambient at the default 3, Notion's 4% peak's neighbour), so the lift
follows Elevation. It fades in on `duration-fast` (140 at Motion 210; Notion 150) with `ease-out`, and out on
`duration-base` (210; Notion 200) with `ease-in` (0.4, 0, 1, 1; Notion's .42, 0, 1, 1). A press drops the lift at
once. At Elevation 0 there is no shadow, so the edge steps as before. Motion 0 and reduced motion make it instant.
Applied to the linked Card (`packages/styles/src/components/surface.css`) and the app's gallery tiles
(`apps/desktop/src/studio.css`).
