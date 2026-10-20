# Stack spec

**Captures:** none. Every value is one of Area's density-derived layout tokens; the evidence is the abstract board
rebuild (`apps/desktop/src/content/examples/abstract/`), where every gap was a measured number with no rhythm.
**Peers:** Surface, Button group, Toolbar

## Owner decisions

- 2026-10-19: "Start with the Surface, Stack and Inset layout primitives so nested corners, layers and gaps come out
  right without hand-set values"; "be careful about overbloating the system if its not necessary."
- 2026-10-20, after the examples page (docs/research/layout-primitives-2026-10-20.md): "go with your recs". One Stack
  with an orientation (Polaris merged its BlockStack and InlineStack the same way); gaps stay named by role; no
  divider option for now (MUI, Chakra and Atlassian have one; it is a candidate in docs/COMPONENTS.md, and lists and
  settings groups draw their own seams).

## Job and boundaries

Stack lays its children out in one row or column with a gap chosen by role, related, group or section, never by number,
so spacing keeps one rhythm and follows Density. Inside a Surface its gap never exceeds the Surface's inset, so children
are never farther apart than they are from the edge.

- Not Button group or Toolbar: those join controls into one control with shared edges and keyboard.
- Not Grid: two-dimensional layouts stay CSS grid in the product (no Grid component yet).

Intake (docs/GOVERNANCE.md): rung 7, a new component. Rung 3 fails because a gap typed in a composition does not follow
Density and cannot see the Surface it sits in. Polaris (BlockStack, InlineStack), Atlassian (Stack, Inline), Primer
(Stack), Chakra (Stack) and Spectrum (Flex) ship it. It adds no token.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| `orientation` | `vertical` (default), `horizontal` | Column or row | every board scene |
| `gap` | `related` | Items read as one thing: a label and its value, an icon row (`ui-cluster`, 8 / Compact 6) | board 05, 06 |
| `gap` | `group` (default) | Members of a group: rows of fields, cards in a set (`gap-row`, 12 / Compact 8) | board 03, 07, 11 |
| `gap` | `section` | Sections of a page: twice the group gap (24 / Compact 16) | board 21 |
| `align` | `start`, `center`, `end`, `stretch`, `baseline` | Cross-axis alignment; unset, a column stretches and a row centres | |
| `spread` (boolean) | | Ends pushed apart, space between: a title with its action | board 01, 08 |
| `wrap` (boolean) | | A row that wraps: chips, badges | board 05 |

Excluded: numeric gaps and padding (Governance § 5), a `justify` axis (its `start` / `end` would share class names with
`align`; `spread` covers the real use), a `divider` option (rules are content: Separator).

## Anatomy

```
root   <div>  owns: direction, gap, cross-axis alignment, wrapping
```

Gap = min(role gap, the nearest Surface's inset).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| `related` gap | `--area-ui-cluster` (8, Compact 6) | Area layout token | |
| `group` gap | `--area-gap-row` (12, Compact 8) | Area layout token | |
| `section` gap | 2 × `--area-gap-row` (24, Compact 16) | the group gap doubled | no section token exists; doubling keeps the rhythm without adding one |
| gap cap | the nearest Surface's inset | layout rule: padding is at least the largest gap inside | |
| children | `min-inline-size: 0` | text wraps inside its track instead of widening the row | |

## States

None.

## Behavior and accessibility

A `div` with no role; it changes layout only. Reading and focus order follow the DOM; Stack never reorders. RTL follows
the writing direction (flex). Pass a role (`list`, `group`) and name when the children form one.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| tokens | Area tokens | `ui-cluster`, `gap-row` | `packages/tokens/src/emit/base.ts` | MIT (Area) | n/a |
| board | evidence | the spacing misses | `apps/desktop/src/content/examples/abstract/` | n/a | scratchpad overlays |

## Feedback log

- 2026-10-20 · owner, layout review round 1 (`layout1`): rethink, "can you show me other examples from other design systems or products of this component?" → no change yet; an examples page answers it (docs/research/layout-primitives-2026-10-20.md) (the equivalents in other design systems and product screens laid out with it).

- 2026-10-20 · owner, layout review round 2 (`layout2`): approved.

## Review note, 2026-10-19

- **What it is:** a row or column whose gaps are chosen by role and follow Density.
- **Why:** the board's gaps were all typed numbers; Stack gives them one rhythm and keeps them inside a Surface's inset.

## Review note, 2026-10-20 (round 2)

- **What changed:** the spread and baseline tiles are built from Area parts (a Section heading and a Button; a Button
  and a Badge) instead of bold text off Area's weights. Gaps, alignment and the cap inside a Surface are unchanged and
  measured correct at every Density and Radius.
- **Why:** you said to go with the recommendations (one Stack, gaps by role, no divider yet) and make sure it is correct.
