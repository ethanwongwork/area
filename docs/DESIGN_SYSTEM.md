# Design system

Shared tokens make a broad component library coherent. Components should gain useful
capabilities without developing their own independent colors, dimensions or theme logic.
The current CSS, token definitions and manifest are the source of exact values.

## Token layers and customization

1. **Primitives:** palette, spacing, type, icon and geometric scales.
2. **Semantic roles:** foreground, background, control edge, focus, motion and elevation.
3. **Component roles:** stable, independently useful theming hooks such as
   `--area-input-inline-size` and the Badge scale.
4. **Private slots:** `--_*` properties set by a component's variants and consumed by its
   base rule. These are implementation details, not a public theme API.

Reuse a semantic role when the job is the same. Add a component token when the role has a
stable meaning and needs independent customization. Give it a sensible existing-token
fallback, a consumer and checks. Do not add aliases merely to hide unexplained literals.

The registered axes are `theme`, `neutral`, `accent`, `action`, `selection`, `ui`,
`radius`, `surface` and `motion`. UI scale combines type and density. `data-area-contrast` is a separate
accessibility preference. See [Theming](THEMING.md) for inheritance and custom values.

Axis namespaces are disjoint. Interactions belong in `packages/tokens/src/emit/base.ts`;
re-emit derived values on every relevant scope boundary. Never register a derived token
or paired semantic color with `@property`: early resolution would freeze inherited values.
Validate both polarity maps and emitted maps; an exact namespace claim ends in `:`.

## Color and focus

Keep `packages/tokens/src/color/palette.json` verbatim. Hue/chroma tuning belongs in the
explicit adjustment tables in `color/curves.ts`; semantic selection belongs in `INVERSION`
and the resolver. Preserve the palette's light-end and neutral lightness anchors and all
gamut constraints. Chromatic dark-end lightness adjustments must remain explicit, bounded
tables so they cannot silently move surface grounds or the white-label contrast wall.

Component CSS consumes semantic colors, not numbered palette rungs. During the visual-first
phase, a measured color with no matching role may be a `light-dark()` spec literal. Tone means meaning;
treatment means emphasis. Reuse `neutral`, `info`, `success`, `warning`, `caution`,
`danger` and `discovery` where applicable; `accent` is an emphasis role, not a tone (below). Additional roles require a clear job.
`pink`, `gray` and `brown` (2026-10-06) are label colours without a meaning, for Tag (Notion's tag palette): `pink`
and `brown` are full tonal blocks (brown is the palette's 15th family, a muted orange outside the accent set); `gray` is the warm cast of the neutral grey with tints and inks only (no outline or
solid: a near-neutral scale has no tinted stroke that clears the outline floor). Both have light and dark pairs
checked by the contrast tests, including each tone's strong ink on its active tint (a tag label).
Foreground does not change on hover. Weight (owner, audit S2, 2026-09-30): 400 for running
text, descriptions, field labels, rows and titles set larger than the body; 500 for surface
titles set at body size (14/20, 16/24), where size cannot set them apart: Popover, Dialog,
Toast, Alert, Card, Panel bar and headings, Calendar month, Nav group titles. Labels are 500
on solid fills, tracks and static marks: solid Buttons, Segmented options, every Badge, soft
Count, Kbd, Indicator counts and Avatar initials; every other label is 400. Text uses two foreground levels, default and muted;
disabled is for disabled text only. Placeholder text shares the muted rung (`fg-placeholder`,
`color/curves.ts:118-120`).

**Emphasis roles** (owner, 2026-09-29; replaces "neutral by default, accent by override").
Area has one chosen colour, the `accent` axis, and neutral. Components never offer an
accent tone. They paint one of two roles, and the `action` and `selection` axes decide
whether each is neutral or the accent. Both default to neutral, so an unthemed product is
all neutral; a theme can make everything the accent, or lead with either.

- *Action* (`action-solid`, `-solid-hover`, `fg-on-action`, `fg-action`): what you press to
  commit. The solid fill of a neutral-tone Button, and everything built on it (Split
  button, Composer send, footer actions). Soft, outline and ghost Buttons stay neutral: the
  quiet neighbours of an action are not the action.
- *Selection* (`selection-solid`, `-solid-hover`, `fg-on-selection`, `fg-selection`,
  `selection-surface`, `-band`, `-edge`): what shows state. Checkbox and Radio checked,
  Switch on, Slider, Progress and Spinner fills, Calendar selected days and range band,
  Chip selected, Tabs indicator, the Nav marker, Menu, Select, Combobox and Model picker
  checks, Tree view checks, AlignmentPicker bars, the swatch picker ring, the Avatar
  active ring and a linked code line.
- *Neither*: row plates (hover, current and selected rows in Nav, Tree view, Table,
  Menu, Select), the Segmented thumb, surfaces, text, dividers and field chrome stay
  neutral in every theme; only the mark on a row takes the role. Badge, Count, Alert,
  Toast and Indicator carry semantic tones or stay neutral.

Each role token is its neutral endpoint mixed toward the accent by the axis's 0/1 switch
(`emit/base.ts`), so the default renders exactly the neutral paint. Semantic tones
(danger, success…) still carry meaning such as an invalid state, and `tone` on Button,
Badge, Alert, Toast and Indicator means meaning only. Focus uses the focus role, a system
setting, and is never a selection marker.

**Shared state paint** ([cohesion audit](research/cohesion-audit.md), 2026-09-26). The same
role paints the same way in every family:

- *Row and item plates.* Hover is `bg-component-hover`; pressed, selected and current are
  `bg-component-active`, one step above, in both themes and under the pointer. Menu, Nav,
  Tree view, Table, Select options and neutral ghost Buttons share this pair; ChatGPT, Figma
  and Notion all hover at about #f2–#f5 on white (and use that one fill for the current row;
  Area keeps selection a step firmer so it survives hover). The translucent `bg-hover` is for
  grounds a component cannot know (a segmented track, a swatch cell); its dark value is
  solved against the dark page rung, so it composites to the same step as the opaque fill.
- *Selected rows* (audit S13, owner 2026-09-30) split by job. Menus of commands and choices
  show a trailing check only (MenuItem `checked`, or `radio` for one of several), and the
  plate is the highlight. Value pickers (Select, Combobox) show their value with the active
  plate and the check. The raw `data-selected` row plate is the value pickers' hook.
- *Icon-to-label gap* (audit S14): 6 at sm, md and lg (`gap-sm/md/lg`; Notion 6, Untitled 6),
  4 at xs and at compact xs, sm and md. Hosts (Button group, Toolbar) never re-tier a child's gap, and
  layout spacing never reads the gap tokens. List rows are the exception, `gap-row` 12.
- *Joined soft controls* (audit S15b): a soft Button group and a soft Split button paint the
  same way, the component fill with the quiet ink, no hairline and the row plates on hover
  and press.
- *Off states* (audit S5, owner 2026-09-30): one off-track grey, `edge-control` (#e2), for the
  Switch track, the Slider rail and the Progress rail; one glyph-edge grey,
  `edge-control-hover` (#d4), for Checkbox and Radio edges and the Slider thumb. The Spinner
  track is its own ink at 25%.
- *Neutral soft marks* (audit S6a): Badge soft, Chip input and soft Count sit on one
  translucent plate, 6% black (10% white in dark), so they stay visible on a hovered or
  selected row plate; hover lays the `bg-hover` wash over it. Avatar and a selected Chip keep
  `bg-component-active`.
- *Quiet ink* (audit S6b): icon actions (ghost icon Buttons, Message actions included) use the
  Button's quiet 75% ink; text-like rows (prompt suggestions, Code block tabs) use `fg-muted`.
- *Unselected options* in a set (Segmented, Tabs) take the muted ink and the selected one the
  default ink, as ChatGPT and Figma do. The Segmented thumb is raised: the white surface
  in light (ChatGPT, Figma) and `bg-component-active` in dark, where the surface rung sits
  below the groove (audit S15a).
- *Disabled.* Controls, rows and pickers dim to 50% as a whole (`--area-opacity-disabled`, audit S21b), so their state stays
  legible. Text fields keep full opacity and use their disabled field paint. Never both.
- *Hover.* Only the plate, edge or underline changes; ink and opacity stay fixed.
- *Loading* (audit S18, owner 2026-09-30) is not disabled: a loading Button stays focusable at
  full ink (`aria-disabled`, `aria-busy`, `cursor: progress`) and ignores clicks; a loading
  Composer keeps its field editable and turns send into Stop.
- *Floating placement* (audit S16, owner 2026-09-30): every anchored surface is placed by the
  one JS engine (`useAnchoredPosition`): popovers and hover cards 8 from the trigger; menus,
  tooltips and the Combobox list 4. Select's native picker, anchored by the browser, follows
  the same rules.
- *Labels.* A label's weight does not change with state: a selected segment is 500 because
  every segment is.
- *Close and dismiss* (audit S9, owner 2026-09-30): one recipe per shape, always the Area
  `dismiss` glyph and fixed ink. Rectangular surfaces (Popover, Toast, Alert) use a ghost
  small Button (28, radius 6) with its row hover plate; on a tinted ground it keeps the tone
  ink and hovers to 12% of it. Dialog's close is the exception, a 32px md ghost Button.
  Pills (Chip, Badge) use a concentric circle with a 12%-ink plate. The API is `onDismiss`
  and `dismissLabel` everywhere (Chip's `onRemove` and Dialog's `onClose` are deprecated
  aliases).
- *Soft fields are flat*: a soft Input, Textarea, NumberField, Select or InputGroup has its
  fill and no shadow, as Figma's inspector fields do. Outline fields have no shadow either
  (outline pass; Select followed on 2026-09-29, audit B-2), as no product field has one. One
  surface uses one field style: a Panel's rows are all soft.
- *Keycaps* are filled, not drawn: `bg-component-active`, no visible edge, radius 6 in every
  host (owner 2026-09-28), muted ink at 500 in the keyboard face (Notion's shortcut hints).
  Inside any Button the keycap is `currentColor` at 14% with the Button's ink, so it survives
  hover, press and selection (audit S12c). In lists a shortcut is quiet: string or Kbd, it is
  the UI font at 12/16 and 400 in muted ink on the text slot's inset, and takes a danger
  row's ink (S12a). Escape is written "Esc" (S12b).
- *List rows* (audit S11, owner 2026-09-30): every icon row puts its label on one 36px column
  (8 inset + 16 icon + `gap-row` 12): Menu, Command palette, Combobox, Select options and
  Nav; Tree keeps its own grid. Keyboard focus is the plate alone in menus (active
  descendant, as the products do); Nav and Tree rows draw an inset ring, as Tabs; a
  Breadcrumb's ring follows its plate. Controls nested on a row hover with the translucent
  `bg-hover` and press with `bg-active`, so they show on a hovered or current row.
- *Tone defaults* are neutral in every family, Toast included. One written exception
  (audit S19, owner 2026-09-30): Indicator defaults to danger, because an unread count or dot
  is an alert by nature (docs/specs/indicator.md). Alert and Toast share
  one feedback set in Badge's order (neutral, info, success, warning, danger) and paint the
  neutral icon muted.

**Elevation.** In-flow fields and controls have no shadow; `shadow-1` is only for raised
thumbs (Switch, Slider, the Segmented thumb). A docked region (Panel) uses `shadow-2`. Card has its own faint halo (owner, 2026-09-27): a 1px contact shadow and
a 2px-low 8px blur, both 3% black, over a lighter edge (neutral 100). A linked Card keeps its lift on hover and steps its edge to
`edge-control-hover`, as Fluent's outline and Radix's surface cards do. Everything that floats over the page (Menu, Popover, the Select picker,
Dialog, Toast, the Calendar and ColorPicker surfaces, Toolbar overflow) shares one lift,
Notion's popover geometry: `0 20px 24px` and `0 5px 8px` in `shadow-color` at full and half
strength, over the 1px decorative border. Both are Surface axis roles (audit S10, owner
2026-09-30): `shadow-card` and `shadow-float`, `none` under Flat. Tooltip keeps its own smaller
lift, and the Toolbar's floating bar its own four-layer recipe. The Table frame is a required
edge (`stroke-width`), so it stays under Elevated.

A rule inside a container is never darker than the container's edge (owner, 2026-09-27;
one exception, audit S8: seams inside joined controls, soft Button group and Split button,
are control edges and keep `edge-control` #e2):
Panel bar, section and footer rules, Code block header and toggle rules and Menu separators
take the container's `border-decorative`. Toolbar separators take `border-decorative` too (owner, 2026-09-27: the bar's
seam role). Use `border-divider` for rules that stand on their
own (Separator, Nav separators, tab tracks, table rows): a divider has no fill or shadow to help it, so it sits a step darker, near where
ChatGPT, Figma and Untitled draw theirs (#e5–#e6; Notion's menu rules are lighter, 7%). A
Table's frame takes the divider role too: it stands alone on the page,
with the page's fill and no lift, and every product draws it firmer than a seam.
Surfaces that stand alone (audit S7, owner 2026-09-30) are never on `border-decorative`:
Card, Composer and Code block take the Card edge (neutral 100 #ee; dark 750), lighter than
the divider because Card's halo carries it; the Table frame keeps the divider (#e2), since it
has no shadow. Composer also steps to the Input hover edge. Choice glyphs (Checkbox,
Radio) take the control hover edge at rest, firmer than a field's, as Notion's and
Untitled's do. Required control/state edges use `stroke-width` independently of Surface. Most controls use the shared focus
color/width/offset; editable fields use their field-focus roles. Preserve standard and
increased-contrast behavior. Never weaken thresholds or add a waiver just to pass a test.
See [Contrast](CONTRAST.md) before changing color, focus or state painting.

## CSS, manifest and React

CSS lives in `packages/styles/src/`, under `@layer area.components`. Follow `button.css`:
variants set local slots and the base rule consumes them. Size rules select tier tokens.
Every dimension traces to a token, a documented hairline or mask geometry, or, during
the current visual-first phase, a measured spec value in a private property marked
`/* spec */` (see [Building a component](COMPONENT_ADAPTATION.md#5-build)).

Update `manifest.ts` with CSS selectors, elements, modifiers and states. The parity check
runs in both directions. React helpers derive variant values from the manifest; wrappers
still need to forward native props and refs and render the right slots.

- Blocks: `.area-badge`; parts: `.area-badge__dot`; modifiers: `.area-badge--outline`.
- CSS modifiers stay kebab-case; React boolean props use camelCase (`fullWidth`).
- Keep tone, treatment, size, state, layout and composition orthogonal.
- Name public axes for what they change: `variant` for visual treatment, `tone` for
  semantic color, `size` for scale, `orientation` for direction, `layout` for
  arrangement, and `kind` for a component's interaction role. Use a boolean for an
  independent option that can combine with other choices. Values should be short and
  should not repeat the axis name in React props. A CSS modifier may keep a prefix
  when it prevents a collision with another modifier on the same block.
- Pointer hover paint sits under `@media (hover: hover)` (audit S21b), so a tap on a touch
  screen leaves no stuck plate; keyboard highlight, focus and `data-hover` demo hooks stay
  outside it. Hover-to-reveal rules (row actions, the Card overlay, Message actions) stay
  unwrapped, with a `hover: none` rule that shows their content. Components stack only
  locally (z-index 0–2 inside their own box); floating surfaces use the top layer, so the
  `z-*` scale is for product chrome. The modal backdrop is `--area-scrim`.
- Use native state/ARIA for behavior and accessible meaning; documented `data-*`
  attributes are painting hooks. A data-disabled flag cannot disable a native button.
- Use logical properties so direction follows the enclosing scope.
- Prefer native behavior. A custom composite needs a complete keyboard, focus, value,
  dismissal and form contract before claiming that behavior.
- A controlled value is owned by the parent; uncontrolled state must synchronize with
  native input and form reset. Visible, submitted and announced values must agree.
- One API vocabulary (audit S17, owner 2026-09-30; renamed props keep a deprecated alias for
  a release): a value is `value` / `defaultValue` / `onValueChange(value, event)`, a boolean
  is `checked` (`onCheckedChange`) or `selected` (`onSelectedChange`), an overlay is `open` /
  `defaultOpen` / `onOpenChange`, a close is `onDismiss` / `dismissLabel`, pending is `loading`,
  and hover timing is `delay` / `closeDelay`. The event comes second, when one caused the change:
  every value callback passes it, optional where a change can arrive without one (a held
  stepper's repeats, an eyedropper pick, a created option resolving later; audit C-7, H-12).
- Names and collections (audit D-18, A-17, H-14, owner 2026-10-01): `aria-label` names the
  component's own element (Tabs' tab list, Segmented's radio group, ChipGroup, Command palette),
  `<part>Label` names a sub-part (SplitButton and ToolbarOverflow `menuLabel`, ContextMenu
  `menuLabel`, `dismissLabel`, `toggleLabel`), and `label` is visible text (Field, NavGroup) or
  spoken content (Spinner). A collection is `items` (Tabs, Segmented, Combobox,
  ColorSwatchPicker, ModelPicker, PromptSuggestions; the old `tabs`, `options`, `models` and
  `suggestions` are aliases). Glyph slots are `icon` / `trailingIcon` and media `leadingVisual`;
  Input keeps `leadingIcon` / `trailingIcon` as its written exception, a field having two glyph
  sides, and `trailing` holds text or a count rather than a glyph (Nav, Tree view, Tabs).
- Pickers that render a group and a visible legend keep `label` as a fallback name, and an
  `aria-label` wins (AlignmentPicker, ColorSwatchPicker, ColorPicker; audit S17).
- Manifest axes use the shared words (audit S17, H-13): `size` is `sm | md | lg` (Kbd was
  `small | normal`), treatments are `variant` (Kbd was `appearance`), the inverse tone is
  `inverse` (Badge was `inverted`), and independent options are booleans (Code's `subtle` and
  `on-color`). Two written exceptions: an axis whose default is the base rule's own paint may
  list only its other values (Tabs, Nav and Slider `orientation`, Checkbox and Radio `variant`
  and `layout`), with React naming the default; and props that only forward another block's
  axes (SplitButton `tone` and `size`, ModelPicker `size`, BoxField `kind`, Skeleton `lines`)
  stay out of the manifest because their block draws no modifier for them.
- The base rule renders the manifest's default tier and tone, so framework-free markup
  (`<button class="area-chip">`) matches the React default.
- Every `var(--area-*)` names a defined token, or carries a fallback when it is a public
  hook (`var(--area-nav-inline-size, 200px)`). `check-token-refs.mjs` enforces this in the
  styles build: an undefined custom property fails silently in the browser.

CSS and wrappers are not both generated from the manifest. The shared contract and
checks prevent drift; they do not replace implementation or behavior tests.

## Size and shape

A control tier describes its outer row/control height where that family uses the control
ramp. Shared controls use the same tier's icon, text and gap tokens. Default medium is
32px with 14/20px type; compact medium is 28px with 12/16px type, list rows 24px, and corners one
step smaller ([compact pass](research/compact-pass-2026-10-01.md)). The UI type ramp is six
sizes with one leading each on the 4px grid: 12/16, 14/20, 16/24, and titles 20/28, 24/32,
32/40 (see [the type spec](specs/typography.md)). Read the current ramps
in `axes/density.ts` rather than copying tables into each component.

Static marks — Badge, Count, the Switch track, ColorSwatch, Presence and the Indicator count —
use the separate `mark-sm/md/lg` ladder (16/20/24), which holds under compact: dense products
shrink their controls but not their marks (VS Code's badge 17, keycap 18 and checkbox 18 beside
22–26px controls; Notion's and Figma's checkboxes 16; audit S21a). Surface insets stay fixed
spacing until compact surface captures exist (audit F-26).

Dark mode is near-black (owner, 2026-10-01): the page is neutral 975 (#020202), raised surfaces
850 and controls 800, as ChatGPT builds its dark theme on #000. Floating frames (Popover, Menu,
Dialog, Toast, Command palette, surface Calendar and ColorPicker, the floating Toolbar) use
`border-float`, the decorative rung in light and neutral 650 in dark, so a floating surface stays
distinct over another surface where its shadow no longer reads. Dividers keep `border-decorative`.
In dark the Tooltip stays a dark annotation (#282828 with a 5% white inset edge), Cards drop
their halo, and the floating shadow ink is 20% (dark captures 2026-09-30, `docs/research/dark-pass-2026-09-30.md`).

Public component size families default to `md`. Expose `sm` when a component has a real
compact-composition use case and `lg` when it needs a more prominent or touch-oriented
target; do not expose `xs`/`xl` merely because the internal token ramp contains them.
Product-wide compactness belongs to the UI-scale axis, so consumers do not have to set a
smaller size on every instance. Specialized layout/content roles such as Panel insets and
Kbd labels may use their own vocabulary because they are not interchangeable control
heights.

Do not force control heights onto labels, glyphs or containers. Badge has a dedicated
16/20/24px label ramp (sm/md/lg) and pill shapes; Checkbox and Radio share one glyph ladder
(16px at md, 20px at lg; sm was removed 2026-09-28), and Slider's thumb follows it (16 at sm
and md, 20 at lg). Switch's thumb travels 12px at every
size (track = height + 12: 28, 32, 36), as ChatGPT's 32 × 20 and Notion's 30 × 18 do. Switch has
its own track geometry. Kbd and Token have separate content roles. These current
constructions do not confer completion on unrefined families.

Radius is one setting (owner, 2026-10-03): `0` (Sharp), `2`, `4`, `6`, `8` (default), `10`, `12`,
`14`, `pill`, one number, the medium Button's corner (`axes/radius.ts`). Every corner follows from
it, so each preset is one coherent theme. A shape on the height ladder takes
`max(radius-min, round(down, height × radius-factor, 2px))`: setting × height ÷ 32 in even pixels,
never under 2, so 8 gives 20 → 4, 24 → 6, 28 → 6, 32 → 8, 40 → 10, 48 → 12 at both densities,
every height is square at Sharp and a pill at Pill. Controls read `radius-control-*`; a component
with its own height writes the same expression on it. Surfaces use the container role on their
own ladder, 0, 2, 4, 8, 12, 16, 20, 24, and 24 at Pill (finite, as Radix Themes' `full`), 12 at
both densities (radius audit D1). Card is the surface plus its inset less 4 (16; sm 14, lg 20,
compact 12), Dialog the surface plus 4 (16), each never more than the surface corner, so a square
surface makes them square. A shell holding a control is concentric with it: the control's corner
plus its distance from the edge, scaled by `radius-concentric` (0 at Sharp): Composer, Message,
Prompt suggestions, Toolbar, the Segmented track. A one-line bar (Alert, banner, Toast) and
Tooltip take the large control corner, 10 (compact 8; D2, D3); multiline ones are surfaces. Kbd is
a 24px box's corner, 6 at the default at every size (D4).
Nested radius is concentric with a floor: `max(min(radius-floor, own corner), outer − inset)`;
`radius-floor` is min(4, setting), so only Sharp is square anywhere. Insets are the padding; a
surface's 1px border is left out so corners stay even. Rows in a floating list (Menu, Combobox,
Command palette, Select's picker) use `radius-list-row`: the surface less its inset (8 at both
densities), no rounder than a medium Button, and a pill only at Pill (owner, 2026-10-04); the list
uses `radius-list`, its rows plus the inset, so the two stay concentric (12, then 14 / 16 / 18 at
10 / 12 / 14, 20 at Pill; compact rows hold 10 from 10 to 14 to stay short of a pill). Standalone
rows (Nav, Tree view) use `radius-row`.
Pills are a set (`data-area-pills`, `axes/pills.ts`): by default Badge, Chip, Count, Switch and
Avatar are pills; Button, Fields and Segmented follow the radius. Any of the eight can be switched
either way for a scope, and per instance with `pill` (Avatar: `shape`; people circle, teams and
workspaces square). A component adds `--area-pill-<id> × radius-full` to its corner, so concentric
parts follow (field actions, Segmented items, Switch thumb, Chip remove). Identity shapes always
use `radius-full`: radios, slider thumbs, Progress, presence and indicator dots. A checkbox and a
square avatar take their own corner capped at 7/16 of the side, rounded squares at Pill. Textarea
keeps the one-line field corner.
Measure painted bounds when browser clamping matters.
List rows place a description in one of three ways, kept on purpose (owner, audit D-24 A,
2026-09-30): under the label as a 12/16 muted note (Menu, `area-menu__description`), muted
after the label (Command palette) or muted at the row's end (Combobox). A list with no
matches shows one empty-state row everywhere: a muted line the height of a md row (32) at the
text-only inset (`combobox.css:32-41`, `command-palette.css:97-105`); MenuSearch is deprecated
(audit D-22).

Keep pointer targets separate from visible glyphs. A visually compact choice control
can use its label/hit area without enlarging the glyph. Check spacing between targets.
Contained controls share their width token in standalone and Field compositions;
full-width is explicit rather than an accidental consequence of the docs grid.

## Optical insets

`packages/styles/src/inset.css` is the shared implementation.

- Icons use full square slots, not path bounds. Use one font cap-to-baseline reference
  for all text, with safety space for accents and descenders. Never nudge a glyph or word.
- For backplate height H and edge-item reference height B, outer inset is `(H - B) / 2`.
  CSS padding subtracts the border once. Calculate leading and trailing ends independently.
- Swatches, dots, avatars and nested controls use their own boxes. A parent reserves an
  action button's box; that button owns its icon inset. Do not size the action to its icon.
- Multiline icons align to the first text line, with equal top and leading insets and
  room below. Preserve line spacing; do not center an icon against the whole paragraph.
- Use matching tier icon/text/gap tokens. Menu/Nav and message content use medium UI type.
  Supporting descriptions use at least small UI type; tiny chrome text is for compact
  elements such as badges, keycaps and tooltips.
- Framework-free markup uses the same label/text slots as React. Native editable controls
  retain browser editing metrics; do not assume trimmed DOM text metrics apply to them.

## Icons and technical labels

Use Fluent's size-specific cuts and the vendored Area marks. Area-drawn icons (the pilot
set and presence status glyphs) are stroked at `--area-weight-icon`, 1.125px for Geist; see
[the icon spec](specs/icons.md). Generate with
`node apps/docs/scripts/gen-icons.mjs`; never hand-edit generated assets or redraw a
replacement. Preserve original SVG markup, stroke attributes and both regular/filled sets.
Icon tiers are the 12/16/24px ramp; a status dot and a keyboard glyph have different roles.
A few content boxes hold a 20px glyph off the tier ramp (Avatar md, the choice card visual;
`display.css:76`, `choice.css:146`).

Code represents identifiers and inline source; Token is its token-name/swatch compatibility
composition. Kbd represents one simultaneous chord; KbdGroup a sequence. Badge represents
status/metadata; Chip represents an interactive compact choice. Do not merge these jobs
because they have similar silhouettes.

## Documentation and verification

Demos and snippets come from the same source. Pages begin with a standalone default,
then supported sizes/treatments, states and compositions. Gallery names and completion
rules are in [Components](COMPONENTS.md).

### Example copy

Every demo and gallery specimen uses one placeholder vocabulary, so what a reader
compares is type, rhythm and alignment rather than a borrowed product story. Reach for
the slot's own name:

- `Button`, `Badge`, `Chip`, `Code` — a specimen that stands for itself.
- `Title`, `Label`, `Description`, `Body text` — headings, labels, supporting text and a
  message body.
- `Action`, `Secondary`, `Cancel`, `Delete`, `Undo` — buttons inside a composition.
- `Item one`, `Option one`, `Value`, `1` — repeated content, choices, values and figures.
  A control that shows every option inline (Segmented, Tabs, a chip row) uses the short
  ordinal instead (`One`, `Two`, `Item one`), so the track does not truncate.
- `Placeholder`, `Error message`, `Success message`, `Warning message` — attributes and
  validation text.

Size tiers name their tier (`Small`, `Medium`, `Large`); a treatment or tone matrix names
the value it shows. An icon-paired label (`Align top`, `Add item`) keeps the meaning the
glyph carries, and a verification fixture (long text, RTL, doubled zoom) keeps the text
that makes the failure visible. Do not invent a product, a person or a domain: an email
label, a colleague's name or a project noun dates badly and pulls attention away from
the geometry the example exists to show.

Docs CSS must not target `.area-*` or silently override shared components. It lives in
`area.base`, before components; the utilities exception is for rail visibility only.
Use `table()` and `tokenSection()` in `layout.mjs`. A backtick inside its `DOCS_CSS` or
`DOCS_SCRIPT` template literal breaks parsing, even in a comment.

Inspect default/compact, light/dark, relevant radius extremes, narrow widths and states
for visible changes. `data-area-motion="none"` must stop every loop that
`prefers-reduced-motion` stops; literal animation durations do not follow the motion
tokens on their own. Long labels, RTL, enlargement, reduced motion and forced colors
remain verification concerns even when they are not gallery tiles. Use the checks in
[Development](DEVELOPMENT.md); record material limitations rather than claiming that
one passing screenshot or token suite proves the whole library accessible.
