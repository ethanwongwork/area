# Surface spec

**Captures:** none. Every value is derived from Area's own tokens and Card's decisions (peer consistency); the
evidence is the abstract board rebuild (`apps/desktop/src/content/examples/abstract/`), where hand-set corners,
layers and edges drifted.
**Peers:** Card, Panel, Preview frame, Stack

## Owner decisions

- 2026-10-19: after the abstract board rebuild, "the biggest gaps im seeing are ... corner radius nesting errors,
  problems with layering, and general gap, padding, margin, and alignment issues. also identifying strokes vs just
  fills." Then: "Start with the Surface, Stack and Inset layout primitives so nested corners, layers and gaps come out
  right without hand-set values", and "just want to be careful about overbloating the system if its not necessary."
  Inset is not a third component: a Surface's inset is its size.

## Job and boundaries

Surface is a plain layer that a screen is composed from: a raised card-like plane, a recessed well inside one, or a
structural box with no paint. It derives what a hand-built container gets wrong: its corner is concentric with the
Surface it sits in, its layer steps one ground from its parent, and it draws one edge per boundary.

- Not Card: Card is a Surface with parts (media, title, description, footer, link, overlay). Use Card for content
  items; use Surface for the regions that hold them.
- Not Panel: Panel is the inspector region with a bar, sections and rows.
- Not Preview frame: that frames a rendered sample.

Intake (docs/GOVERNANCE.md): rung 7, a new component. Rung 1 fails because Card's parts and its fixed media / text
insets are wrong for a plain region, and Panel has a bar. Rung 3 fails because a composition cannot know its parent's
corner and inset; that is the bug the board showed. Polaris (Box, Card), Atlassian (Box), Radix Themes (Box, Card,
Inset) and Spectrum (View) ship the same primitive. It reuses Card's corner and inset decisions and the Layers model's
raised and recessed grounds; it adds no token.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| `variant` | `surface` (default) | The raised plane: Card's fill, edge and resting shadow | board 03, 06, 11, 15, 24 |
| `variant` | `soft` | A recessed well inside a surface: one fill step down, no line, no shadow | board 03 (alignment and padding wells), 11 (preview), 21 (background tiles) |
| `variant` | `plain` | Structure only: corner and inset for its children, no paint | board 04 (the bezel's inner card), grouping regions |
| `size` | `sm`, `md` (default), `lg` | Card's sizes: the same corner and text inset, so a Surface and a Card side by side match | Card |

Excluded: an `inset` prop or padding values (Governance § 5: no single-layer style props; the inset is the size), a
`layer` axis (variant already names the treatment), elevation choices (floating surfaces are Menu, Popover, Dialog).

## Anatomy

```
root   <div>  owns: corner, inset (padding less the border), fill, edge, shadow, the ground its children step from
```

One element; children are the content. Inset equations (border counted once):

- text inset = Card's media inset + Card's step: sm 6 + 8 = 14, md 8 + 8 = 16, lg 12 + 8 = 20 (Compact 10 / 12 / 14).
- padding = text inset − border.
- A Surface whose direct children (or a Stack's) include a Surface uses its size's media inset instead (6 / 8 / 12),
  as Card holds its media: the nested Surface carries its own inset for its text.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| corner, outermost | Card's corner per size: 14 / 16 / 20 (Compact 10 / 12 / 14), capped at 1.5 × the text inset | peer: Card (`surface.css` `--_card-radius`, `--_card-corner`) | |
| corner, nested | max(radius-floor, parent corner − parent inset): 16 → 8 → 4 at the default | DESIGN_SYSTEM.md Size and shape: "Nested radius is concentric with a floor"; peer: Card media (16 − 8 = 8) | measured 2026-10-19: subtracting the padding instead gave an odd 9 |
| inset | text inset per size; media inset when holding Surfaces | peer: Card | |
| `surface` fill · edge | `bg-surface`; `border-card` at `border-width` (Stroke width) | peer: Card | |
| `surface` shadow | `shadow-edge` + `shadow-resting` when outermost; `shadow-edge` only when nested | peer: Card at the top; one edge per boundary when nested | a nested raised plane sits on the same fill, so its line is its edge |
| `soft` fill | `bg-subtle`, no edge, no shadow | Layers model: a recessed region is `bg-subtle` | |
| ground | `surface` points control fills at the raised ground, `soft` at the recessed one | `layers.css` | |
| depth | concentric to four levels | the three-layer rule plus one | CSS cannot read a parent's value of a property an element also sets, so depth alternates two private properties per level |

## States

None. A Surface is static; interactive containers are Card (link, selected) and Option-style controls.

## Behavior and accessibility

A `div` with no role. Pass `role`, `aria-label` or `aria-labelledby` when the region needs a name (a `region`, a
`group`). Forced colours: the edge follows Card's repair (`border-width` at least 1px under raised contrast).

A Card inside a Surface reads the corner the Surface publishes, so it nests concentrically; its size, insets and
parts are unchanged, and a Surface holding a Card sets it at the media inset. Not implemented: a Card or Panel does not
publish its own corner, so a Surface nested inside a Card starts again from the outermost corner.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| card | Area peer | corner, inset, fill, edge, shadow | `packages/styles/src/components/surface.css` (`.area-card`) | MIT (Area) | n/a |
| layers | Area model | raised and recessed grounds | `packages/styles/src/layers.css` | MIT (Area) | n/a |
| board | evidence | the composition misses | `apps/desktop/src/content/examples/abstract/` | n/a | scratchpad overlays |

Target products searched without an equivalent: ChatGPT, Notion, Figma and Cursor ship no layout primitive publicly;
their screens are the evidence for the rules, not for an API.

## Review note, 2026-10-19

- **What it is:** a plain layer for composing screens, whose corner, layer and edge follow from the surface it sits in.
- **Why:** rebuilding the Pinterest board by hand produced nested corners, layers and edges that drifted; Surface makes
  them follow Card's rules automatically.
