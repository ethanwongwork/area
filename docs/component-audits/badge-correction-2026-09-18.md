# Badge audit correction — 2026-09-18

## Assessment

The visual-review feedback was justified. The first Badge implementation satisfied the capability checklist but made two category errors: it treated a metadata label like a control for sizing and let the global radius axis make the label look button-like. It also presented comparison grids as single gallery specimens, which made individual cases harder to inspect and contradicted the gallery convention used by Button and Checkbox.

## What the first audit got wrong

### It reused the control-height ramp

The first implementation made `md` 32px and exposed xs through xl. That was not supported by the Badge evidence. The audit pack already recorded OpenAI reference heights around 20–24px, Primer at 20/24px, and a suggested Area range of 16–24px for the common tiers. The current official Geist Badge page confirms only small, medium, and large sizes; its example source uses `sm`, `md`, and `lg`. The page does not publish pixel values, so the earlier report should not have treated Geist as proof of the shared Area control ramp.

Area now uses a dedicated token-backed Badge scale:

| Size | Height | Role |
| --- | ---: | --- |
| `sm` | 20px | Compact metadata and anchored counters |
| `md` | 24px | Default Badge |
| `lg` | 32px | Deliberately prominent metadata |

This retains established spacing and icon tokens while making the default clearly smaller than a medium Button.

### It allowed button-like shapes

The first implementation let Badge follow the global corner-radius theme and added rounded, pill, and square examples. At sharp through standard presets, the 32px medium Badge could become visually indistinguishable from a noninteractive Button.

Badge is now always pill-shaped with `--area-radius-full`. The corner-radius inspector still changes surrounding controls and surfaces, which makes it possible to verify that Badge keeps its identity. The existing `pill` prop is retained as a compatibility alias; it no longer changes the shape. Square is not part of the final Badge contract.

### It overcorrected anchor placement

Moving a 32px counter fully outside its owner avoided text overlap but stopped reading as an attached badge. The avatar dot also received a ring on the outer dot-only box, producing a large clipped-looking halo.

Anchored counters now use the 20px tier with their centre directly on the owner's rectangular corner, creating an even 10px overlap. Circular attachment moves that centre exactly 14% inward, which places the visible dot and its ring on the avatar edge. Dot-only attachment applies the surface ring to the visible dot itself.

### It grouped too many independent specimens

The first gallery placed the entire size row, variant × tone matrix, dot matrix, state list, anchor placements, themes, tables, and stress cases into multi-item tiles. That made comparison possible but prevented one-case inspection and produced oversized containers.

The gallery now gives each size, each of the 50 variant × tone cells, each of the 20 dot cells, each state, each anchor placement, each theme, each table row, and each stress case its own standard tile. BadgeGroup remains one composite specimen per tile because multiple child badges are the component's content rather than independent gallery cases.

## Evidence and confidence

- **Level A, current:** [Geist Badge](https://vercel.com/geist/badge), reviewed 2026-09-18. Confirms the `sm`/`md`/`lg` API, pill-shaped current examples, and static-label boundary. It does not publish exact pixel dimensions.
- **Level A, pinned sources:** the repository [labels and identity evidence pack](../audit-pack/03-labels-identity.md#badge) records OpenAI, Primer, Fluent, Geist, and other source findings, including smaller Badge geometry than the shared medium control tier.
- **Level A, rendered Area evidence:** the rebuilt local gallery was checked with its radius, density, and theme controls. Badge remains pill-shaped; the 24px default and 20px anchored counter render without owner-label collisions.

## Corrected contract

- Variant: soft, solid, outline, ghost, plain.
- Tone: neutral, accent, info, success, warning, caution, danger, discovery, inverted, custom.
- Size: sm 20px, md 24px by default, lg 32px.
- Shape: always pill, independent of the radius theme.
- Anchored count: sm by default in the demos, partially overlapping its owner.
- Gallery: one independent Badge case per tile; composite BadgeGroup cases remain intact.

The correction uses existing spacing, icon, type, and full-radius tokens. It introduces no unmapped pixel literal.
