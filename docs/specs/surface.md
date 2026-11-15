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
- 2026-10-20, after the examples page (docs/research/layout-primitives-2026-10-20.md): "go with your recs". Surface
  stays its own component beside Card (as MUI Paper, Polaris Box and Spectrum View sit beside their Cards); the recessed
  variant keeps the name `soft` (Area's word for a quiet fill on Button and Input; other systems say subtle, sunken,
  container or Well); a soft Surface inside a soft one does not step its fill again (three layers is the limit).

## Job and boundaries

Surface is a plain layer that a screen is composed from: a raised card-like plane, a recessed well inside one, or a
structural box with no paint. It derives what a hand-built container gets wrong: its corner is concentric with the
Surface it sits in, its layer steps one ground from its parent, and it draws one edge per boundary.

- Not Card: Card is a Surface with parts (media, title, description, footer, link, overlay). Use Card for content
  items; use Surface for the regions that hold them.
- Not Panel: Panel is the inspector region with a bar, sections and rows.
- Not Preview frame: that frames a rendered sample.

Names elsewhere: MUI Paper, Polaris Box and Section, Radix Box and Card, Spectrum View and Well, Mantine Paper,
Carbon Tile, Figma's frame. `soft` is called subtle (Chakra), sunken (Atlassian), container (Stripe) or Well (Spectrum).

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

- The frame recipe's ladder (`surface.css`, plan B1.1), Card's: text inset sm 14, md 18, lg 22 at the default type 13
  (16 / 20 / 24 at type 14, 12 / 16 / 20 at Compact); gap between blocks 12 / 16 / 20 (8 / 12 / 16 Compact).
- padding = text inset − border.
- A Surface whose direct children (or a Stack's) include a Surface uses its size's media inset instead (5 / 7 / 10 at the
  default), as Card holds its media: the nested Surface carries its own inset for its text.
- Its title pair is Card's: CardTitle and CardDescription in a CardContent (13/18 strong over 13/18 muted, 4 apart).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| corner, outermost | the frame recipe's card corner, Card's: 0.6 × the text inset at Corner 10, moving with the setting, never rounder than `radius-container`: sm 8, md 10, lg 12 at the default; md 0 at Sharp, 14 at Corner 14, 16 at Pill | plan B1.1 (2026-11-13): Surface takes Card's inset, gap, corner and title pair, decided once; plan A2.3 | Was `radius-container` (16) over a 14 inset, beside Card's 10 over 18 (VC5) |
| corner, nested | the recipe's nested corner: max(min(radius-row, own corner), own corner − the inset it holds the Surface at), to even pixels: 10 → 8 → 8 at the default | plan B1.1, VC19: a nested frame never lands at the floor's 4 | Was max(radius-floor, parent − inset): 16 → 8 → 4 |
| corner, in a Card | the same nested corner from the Card: 8 in its 10 | peer: Card | Was the Card's media corner, 4 |
| corner, in a Panel | the same from the Panel: 8 in its 16 (16 − 14 is under a row's corner); a flush Panel 0 → 0 | peer: Panel (`--_panel-corner`, `--_inset`) | Was the floor, 4 |
| inset | text inset per size; media inset when holding Surfaces | peer: Card | |
| `surface` fill · edge | `bg-surface`; `border-card` at `border-width` (Stroke width) | peer: Card | |
| `surface` shadow | `shadow-edge` + `shadow-resting` when outermost; `shadow-edge` only when nested | peer: Card at the top; one edge per boundary when nested | a nested raised plane sits on the same fill, so its line is its edge |
| text | `text-base` size, leading and tracking on the root, `fg-default` | peer: Card's body role | measured 2026-10-20: with none, text set straight in a Surface took the page's 13/18 inside a canvas at Type 14 (14/20) |
| `soft` fill | `bg-subtle`, no edge, no shadow | Layers model: a recessed region is `bg-subtle` | |
| ground | `surface` points control fills at the raised ground, `soft` at the recessed one | `layers.css` | |
| depth | concentric to four levels, counting Surface, Card and Panel | the three-layer rule plus one | CSS cannot read a parent's value of a property an element also sets, so depth alternates two private properties per level |

## States

None. A Surface is static; interactive containers are Card (link, selected) and Option-style controls.

## Behavior and accessibility

A `div` with no role. Pass `role`, `aria-label` or `aria-labelledby` when the region needs a name (a `region`, a
`group`). Forced colours: the edge follows Card's repair (`border-width` at least 1px under raised contrast).

A Card inside a Surface reads the corner its parent publishes, so it nests concentrically; its size, insets and
parts are unchanged, and a Surface holding a Card sets it at the media inset. Card and Panel publish a corner too (the
recipe's nested corner from their own corner and inset), so a Surface inside either nests from it. A Card reads the chain
only with a Surface around it: a Card in a Card or a Panel with no Surface keeps its own corner, and a card in a media
well keeps the well's.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| card | Area peer | corner, inset, fill, edge, shadow | `packages/styles/src/components/surface.css` (`.area-card`) | MIT (Area) | n/a |
| layers | Area model | raised and recessed grounds | `packages/styles/src/layers.css` | MIT (Area) | n/a |
| board | evidence | the composition misses | `apps/desktop/src/content/examples/abstract/` | n/a | scratchpad overlays |

Target products searched without an equivalent: ChatGPT, Notion, Figma and Cursor ship no layout primitive publicly;
their screens are the evidence for the rules, not for an API.

## Feedback log

- 2026-10-20 · owner, layout review round 1 (`layout1`): rethink, "what is this component used for, can you show examples of it from other products" → no change yet; an examples page answers it (docs/research/layout-primitives-2026-10-20.md) (what each variant is for, the equivalents in other design systems, product screens built from it).

- 2026-10-20 · owner, layout review round 2 (`layout2`): approved.

## Review note, 2026-10-19

- **What it is:** a plain layer for composing screens, whose corner, layer and edge follow from the surface it sits in.
- **Why:** rebuilding the Pinterest board by hand produced nested corners, layers and edges that drifted; Surface makes
  them follow Card's rules automatically.

## Review note, 2026-10-20

- **What it is:** a plain layer for composing screens (raised, a recessed well, or structure only, in Card's three
  sizes), whose corner, layer and edge follow from what it sits in: nested Surfaces step 16 → 8 → 4, only the
  outermost raised one lifts, and a Card or Panel around it counts too (in a Card its corner is the Card's media
  corner, 8; in a Panel the floor, 4).
- **Why:** rebuilding the Pinterest board by hand produced nested corners, layers and edges that drifted; Surface
  makes them follow Card's rules without hand-set values. The Card and Panel case was left open in PR #141, where a
  Surface inside a Card drew a rounder corner (16) than the Card around it.

## Review note, 2026-10-20 (round 2)

- **What changed:** text set straight in a Surface now follows the Type setting (it took the page's size, 13 in a
  canvas at 14); the demos' titles are Area's Section heading (strong weight, muted line under it) instead of bold
  text off the weight scale. Your four answers are recorded: Surface stays beside Card, `soft` keeps its name, no
  divider on Stack yet, no extra step for soft inside soft.
- **Why:** you said to go with the recommendations and make sure the design is correct; this was the one place a
  Surface did not follow the system's settings.

## Review note, 2026-10-29 (visual pass, rounds 85–89: a question)

- **Question:** at Layers 0 (Flat, the default) a soft Surface's fill is the recessed layer, equal to the page, so the
  well is invisible and its row looks inset under nothing. Show it at Flat, or keep Flat flat?
- **Answer:** keep Flat flat (owner, 2026-10-29). A soft well shows once Layers is above 0. No change.
- **2026-11-01:** confirmed when fills moved to the `well` ground (color-system study): a soft Surface is a region and stays
  recessed, flat at Layers 0.
- 2026-11-11 · system evaluation A2.3 · the outermost corner caps at radius-container: md 18 → 16, lg 21 → 16 at the default; nested Surfaces follow (16 − inset, floored). surface.css.
- 2026-11-11 · system evaluation A1.1 · the block gap reads `gap-row` (12 at the default, was 10), never more than the inset.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** nothing in the end. Plan A10.1 moved a soft Surface onto the well ground so it painted in dark at Layer contrast 0; that reversed the owner's 2026-10-29 decision (Flat keeps soft Surfaces flat) and was restored the same day. A soft Surface paints the recessed tone, the page at Layer contrast 0 in both themes, and steps off above 0; `layers.test.ts` and `cohesion.test.mjs` ("Layer contrast 0 keeps a soft Surface flat") hold it.
- **Open for the owner:** a soft Surface that paints nothing still pads 14, so its text edges sit 14 in from its neighbours' (finding VC6).
- **Verdict:** awaiting the owner.

### 2026-11-13 · One frame recipe (system plan, Phase 2, B1.1)

- Surface reads the frame recipe in `surface.css` with Card and every card-like frame: Card's inset ladder (md 18, was
  14), section gap (md 16, was 12), corner (md 10, was 16) and title pair (Card's parts; the demos had Section heading's
  16/22 over 12).
- Nested Surfaces, and a Surface in a Card or a Panel, take the recipe's nested corner, a row's 8 at the default, where
  the floor's 4 read as a rectangle in a round well (VC19).
- Unchanged by the owner's pick (2026-11-13): a soft Surface paints nothing at Layer contrast 0 and keeps its padding.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The frame recipe's name gap (`--_fr-name-gap`) is `ui-cluster` (6 / 8 / 10; 10 / 10 / 12 at type 16), so a name under a picture moves with its peers. Values at type 13 Compact / Default / Comfortable; unchanged at the default.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.
