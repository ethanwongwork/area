# Control edges: proposal (2026-10-27)

Owner: "is there a theme axis control that adds light strokes to all controls, like buttons, inputs, segmented controls,
etc so its consistent for all of those?" then "propose it, see how it would make the most sense to group which components
should and should receive it, like containers/cards/ can have strokes but other components cant/shouldnt, should it be
like how you can select groups of components to recieve it similar to the always pill setting."

Status: proposal only. Nothing is built. Reconsidered the same day; research by reading Area's CSS and specs, the repo's product captures, and Radix Themes, shadcn and Apple docs (Material 3, Fluent, Primer from memory, unverified).

## What exists today

| Setting | Reaches | Controls? |
|---|---|---|
| Stroke › Width (`surface`, `frame-width`) | Cards, panels, menus, popovers, dialogs: the frame of a container | No |
| Stroke › Edge contrast (`stroke`) | How dark every existing stroke is | Only strokes already drawn |
| Contrast (More) | Adds the strong edge to soft fields and Segmented, and strengthens ink, focus and states | Yes, but as accessibility, not a style |

So no setting gives the soft controls an edge. And they disagree at rest:

| Family · variant | Edge at rest today |
|---|---|
| Outline fields (Input, Select, Custom select, Number field, Textarea, Date picker, Tag picker, OTP, Input group) | the control edge |
| Soft fields (the same families, `variant="soft"`; the Inspector uses these) | none (`input-edge-soft` is transparent until Contrast More) |
| Soft Button, Split button, Button group, Toggle group | a faint edge, one step darker than the fill (`button.css`, `--_border` = `surface-hover`) |
| Segmented track | none (removed 2026-10-27; was a `border-decorative` ring) |
| Slider bar and track troughs, Switch off track | none |
| Soft option rows (Radio, Checkbox `variant="soft"`) | none |
| Soft Badge, Chip, Count | none |

Soft buttons have an edge and soft fields don't, though they sit side by side in the same rows.

## Proposal

**A set of groups like Pills: Stroke › Controls** (and, reconsidered below, Stroke › Frames for containers). A space-separated list on any element, inherited like
Pills: `data-area-control-edges="fields buttons segmented"`. Each listed group's soft controls draw one light edge;
the rest stay fill only. The edge's darkness follows Edge contrast and its width the required stroke (`stroke-width`),
so it is one more stroke and needs no strength of its own. In the Inspector, a multi-select under Stroke, like Pills.

### Reconsidered: containers, accents and what never changes

Owner, same day: "some containers, cards, menus, etc might want a stroke as a stylistic divider, or a slight/subtle
accent ... maybe there are some components that absolutely shouldnt have stroke on or off customization".

Containers do want a choice, but not in Controls: they already have a frame, set by one all-or-nothing knob, Stroke ›
Width (`frame-width`, read as `border-width`, `emit/base.ts:182-186`). Width 0 drops every frame at once; there is no
way to keep cards framed and menus not. And a few framed blocks bypass it on the required stroke, always on: Code block
(`code.css:218`) and Table's wrapper (`navigation.css:161`). So the answer is two sets, one per kind of edge.

**1. Stroke › Frames (new): which containers draw their frame.** It splits today's single frame into groups; Width
stays the one width for all of them. Every group on by default, so today's look is kept.

| Group | Members | Default | References |
|---|---|---|---|
| `cards` | Card, Asset card, Surface | on | Notion's card ring and lift; shadcn `border shadow-sm`; Radix Card `surface` / `classic` 1px, `ghost` none |
| `panels` | Panel, the Titlebar's rule | on | Figma's docked panels: none; Area keeps region edges (dividers review §D) |
| `floating` | Menu, Context menu, Popover, Hover card, pickers (Select, Calendar), floating Toolbar | on | Notion 7% ring; ChatGPT a shadow edge only; every product keeps some edge on floating surfaces |
| `overlays` | Dialog, Drawer, Command palette | on | shadcn border; Material 3 none |
| `feedback` | Toast, Alert | on | Notion's callout has no edge (off = that look) |
| `blocks` | Code block, Table's wrapper (moved from the always-on stroke onto the frame) | on | Figma's code well 1px ring; Notion's table no frame |

Guard: with `floating` or `overlays` off, the shadow edge (Shadow › Edge) comes back on its own, so a menu never loses
its edge against what is under it; Contrast More still restores every frame.

**2. Stroke › Controls: which soft controls draw a light edge.**

| Group | Members (soft or edgeless paint only) | Default |
|---|---|---|
| `fields` | Input, Select, Custom select, Combobox, Number field, Textarea, Date picker, Tag picker, OTP, Input group, Color field | off |
| `buttons` | Soft Button, Split button, Button group, Toggle group | on (today's faint soft-button edge) |
| `segmented` | The Segmented track | off |
| `tracks` | Slider bar and track, SliderRange, Switch's off track, **Progress and Meter** (reconsidered: the same trough as the slider bar; Radix Progress `surface` rings its track) | off |
| `options` | Soft option rows (Radio, Checkbox `variant="soft"`) | off |
| `tags` | Soft Badge, Chip, Count, **Kbd** (Figma's and GitHub's keys are outlined) | off |
| `avatars` | Avatar, a hairline ring (helps a white photo on a white page; Untitled 0.5px, Primer 1px) | off |

**3. A subtle accent: Stroke › Frame colour, Neutral (default) or Accent tint.** Frames (and control edges) take the
accent's border step (`edge-accent`, `emit/base.ts:177`) instead of the neutral rung: a stylistic divider in the brand's
colour without a new width. Open: every group, or only `cards` and `feedback`; and its dark value.

### Never customizable

| Kind | Why |
|---|---|
| Outline Button, outline Badge | The edge is the variant's identity; without it it is Ghost or Soft |
| Ghost buttons, toolbar icon buttons | Intentionally edgeless chrome (macOS's "Show toolbar button shapes" is an accessibility toggle, so at most Contrast More) |
| Solid Button, solid Badge | The fill is the edge; a stroke on a filled accent reads as a second outline |
| Rows and tabs: Menu items, Nav rows, Tree rows, List box options, Tab items | States of a list, not objects at rest; their paint is the States settings |
| Focus rings, selected edges, Calendar's today ring, field state edges (invalid, focus) | Required signals (CONTRAST.md), never style |
| Tooltip's dark hairline, Composer's field edge, Avatar group's cutout ring | Required geometry or a field boundary (3:1 under More) |
| Variants that are already a choice per instance: Tabs `track`, Accordion `divided`, Surface `soft` / `plain`, Asset card `borderless` | A per-instance variant stays one; the sets only switch defaults |

### How it is built (one rule, no per-component edits)

- Frames: `--area-frame-<group>` flags (0 or 1); each container's frame width becomes `border-width` times its group's
  flag (still `max(…, contrast-more × 1px)`), so Width, Contrast and the groups compose. Code block and Table move from
  `stroke-width` to their group's frame.

- Tokens: `--area-edge-<group>` flags (0 or 1), as `--area-pill-<id>`, emitted from a `CONTROL_EDGES` list beside
  `PILL_SHAPES` (`axes/pills.ts` → a sibling `axes/control-edges.ts`).
- Each soft variant's edge becomes `color-mix(in srgb, transparent, var(--area-edge-control) calc(max(var(--area-contrast-more), var(--area-edge-<group>)) * 100%))`, the same pattern `input-edge-soft` uses today, so Contrast More still adds every edge.
- The rest edge is the light control edge (`edge-control`, #e2 light); hover keeps each family's hover edge.
- No `@property` (a derived colour, DESIGN_SYSTEM.md); no contrast floors change (a decorative edge, CONTRAST.md).

## Open decisions for the owner

1. The names: **Frames** and **Controls** under Stroke (my pick, one word each), or one list with both kinds.
2. `buttons` on by default (today's faint soft-button edge) or off (every soft control fill only, the most consistent).
3. Whether `tracks` should include the Switch's off track (Notion and ChatGPT draw none).
4. `blocks`: moving Code block and Table onto the frame means Width 0 removes their edge too (unless Contrast More).
5. Frame colour Accent: which groups, and its dark value.
6. Every family in either set goes back to In review once built.
