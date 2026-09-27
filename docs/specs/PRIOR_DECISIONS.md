# Prior component decisions

Decisions and notes recorded before the evidence-based spec workflow, moved verbatim from
the component guide on 2026-09-24. Owner decisions here still stand. Dimensions here were
not produced by the capture protocol and must be re-verified when the component gets a
spec. When a component receives `docs/specs/<slug>.md`, move its section there and delete
it from this file. Indicator and Presence moved to [indicator.md](indicator.md), Badge to
[badge.md](badge.md), Tooltip to [tooltip.md](tooltip.md),
Breadcrumb to [breadcrumb.md](breadcrumb.md), Tree view to [tree-view.md](tree-view.md),
Composer to [composer.md](composer.md), Button group to [button-group.md](button-group.md), Popover to [popover.md](popover.md).

## Alignment picker

From the 2026-09-24 control refinement:

- [Figma alignment guidance](https://help.figma.com/hc/en-us/articles/31289464393751-Use-the-horizontal-and-vertical-flows-in-auto-layout):
  the nine-position control and spatial arrow navigation inform AlignmentPicker; a flat
  selected cell replaces the raised tile. Dimensions come from Area's tokens.

From the color and alignment follow-up, 2026-09-24:

AlignmentPicker uses three rounded bars with column-dependent alignment, 2px unselected
dots, no selected backplate, and `stretch` to fill both dimensions of a sized parent.
Landscape and portrait examples demonstrate this independently of size/treatment variants.

## Code block

Code block follows the [Geist Code Block](https://vercel.com/geist/code-block) anatomy --
a file header with the copy action on its trailing edge, a 32px line-number gutter, and a
single monospace size (14/20px, the system's small text role) across every variant. It
keeps Area's own tokens rather than Geist's 13/20px type and 16px block inset. Its four
syntax hues are the measured vivid rung of danger, discovery, info and the accent, in that
order: red keywords, purple tags, blue attributes and accent strings. Punctuation and
comments stay neutral, because a hue on the glyphs that carry the nesting reads as
confetti. Strings follow the accent axis, so a pink accent produces pink strings.

## Color picker, color field and swatches

- [React Aria ColorSwatchPicker](https://react-aria.adobe.com/ColorSwatchPicker):
  labeled radio choices and separate selected/focus states. Area uses compact square
  cells, a legible selection ring and checkerboard transparency. ColorField inherits
  Input's typography and inset instead of introducing an unrelated monospace field.

### Color and alignment follow-up, 2026-09-24

The earlier muted swatches were arbitrary demo hex values, not palette tokens. Color
examples now use exact family-500 hex values from `packages/tokens/src/color/palette.json`
(e.g. blue #006DF5, purple #8D4DF3, green #01AA4E). Alpha examples deliberately remain
translucent. Swatches represent document color data and must not change with UI theme.
The supplied Figma neutral values are retained only in the explicitly labeled split-field
reference example. The palette source itself is unchanged.

[Untitled UI's solid picker](https://www.untitledui.com/react/components/color-pickers)
was inspected directly: square saturation/value area, hue and alpha tracks, joined
color/opacity editing, saved colors. Area's new ColorPicker implements that solid-color
composition using its own InputGroup, ColorField, NumberField and ColorSwatchPicker.
It exposes separate native keyboard sliders for saturation and brightness, pointer
capture for the area, and canonical hex callbacks/form values. Gradient/image editing,
format conversion UI and eyedropper are not part of this solid-color component.

ColorField `alpha` joins hex and a 0–100% opacity editor in one InputGroup shell; `name`
submits one canonical hex value. `opacityLabel` names the separate control.

## Input group

InputGroup now paints one focus shell. Its visual compartment is one square control
height with centered 16px Fluent art or a control-text-sized letter, so both have equal
horizontal inset. The focused child's rectangular inner shadow was removed.

## Input and field

Input and Field have also received a confirmation pass. Input's error entry points now
agree on native `aria-invalid`, InputAction preserves external descriptions alongside its
tooltip, and focused tests cover the Field label, description, validation, required and
disabled relationships. Their existing variants remain intact and are expanded in the
gallery. Both are owner-confirmed complete.

## Inspector references and density

Images 1–6 were supplied by the owner in an earlier session; they are not stored in the
repository.

- **Images 1 and 2:** floating rounded containers, grouped command buttons, soft paired
  fields, small section gaps and selective emphasis. Reuse Panel, Button, Avatar and
  Segmented, then add toolbar/group behavior and numeric field composition.
- **Image 3:** shadow parameters, a color-plus-alpha row, layout direction, nine-point
  alignment and editable fill/stroke lists. These are combinations of a few reusable
  controls, not a separate Input variant for each design property. Its decorative
  outer frames are reference styling, not necessary component anatomy.
- **Images 4 and 5:** repeated field widths, aligned label rows, shared control heights,
  section separators and trailing actions. The nine-point picker spans more than one
  row because it edits two axes. Expanded corner fields are a linked value group.
- **Image 6:** a composed color editor with a two-dimensional area, hue and alpha sliders,
  format selection, channel inputs and an eyedropper. Build those parts independently
  so simpler color popovers can omit channels they do not need.

### Density and size

Treat the reference inspector as a **compact UI scope** in Area. Keep most fields at
size md and let data-area-ui=compact select 28px controls with 13/18px type; default
md is 32px with 14/20px type. Use sm selectively for secondary header actions or tight
metadata. Do not shrink every control independently or scale the interface with a CSS
transform. Panel inset size is a separate layout choice and does not resize its children.

This is an Area implementation recommendation, not a claim about Figma's private
component API. Screenshot pixels cannot establish CSS dimensions without knowing zoom
and device scale. The repeated rows suggest a coordinated density system, while the
larger pickers and mixed fields reflect function. [Spectrum's platform scale](https://spectrum.adobe.com/page/platform-scale/)
also treats coordinated sizing as a system concern. Small visible icons still need
usable focus and pointer targets.

### Framer inspector reference

Framer's public [Property Controls guide](https://www.framer.com/developers/property-controls)
describes a right-side properties panel with typed editors. Its Number control can show
a range slider or steppers and accepts bounds, units and step; Padding and BorderRadius
switch between one value and four separate values. Color is its own control. This
supports Area's current split between NumberField, color controls, and inspector recipes
for linked values. A sizing-mode picker belongs beside a numeric field in a recipe, not
inside every Input.

Framer's [plugin interface guide](https://www.framer.com/developers/interface) says
plugins receive basic styles for semantic inputs and buttons, but Framer does not publish
an official reusable component set there. The [June 2026 developer changelog](https://www.framer.com/developers/changelog)
also records refreshed input styles for Framer 3.0. These sources establish control
types and composition, not stable editor dimensions, tokens or interaction details.
Keep Area's own density, contrast and keyboard contracts; avoid inferring pixel values
from Framer screenshots.

### Other references reviewed, 2026-09-24

[Geist Avatar](https://vercel.com/geist/avatar) and
[Notion editing guidance](https://www.notion.com/help/writing-and-editing-basics) were
reviewed for adjacent-control sizing and contextual actions. Neither establishes
private editor CSS measurements. The Framer findings above remain the reference for
inspector composition and conditional property controls. Exact Figma/Notion/Framer
internal tokens remain unverified; no private source implementation is claimed.

## Nav

Current refinements: Nav has a 200px default vertical measure, content-width horizontal
layout, decorative trailing annotations and independent action slots. Nav uses filled rows
for destinations, with a compact horizontal run for top level routes and a separate
vertical selection marker option.

## Panel

Panel is 280px with medium control-height rows; its inset size does not resize child
controls.

## Segmented

Segmented iconOnly keeps option labels accessible while using square inner buttons.

## Select

Select's enhanced native picker opens below with a 4px gap and no above-input fallback;
unsupported browsers retain their platform-native picker placement.

## Skeleton

Skeleton cards have two text lines; type samples share the trailing half of the tile.

## Slider

Slider has been refined across its native value lifecycle: controlled and uncontrolled
values, normalization, live fill/readout updates and form reset now stay synchronized.
It now has a neutral default, an accent opt-in, labeled and range-with-input compositions,
vertical layout, and discrete step markers, plus a surface thumb with a centered fill-color
dot. Its public sizes are the justified
small/medium/large family; UI scale owns product-wide density. It is owner-confirmed
complete.

## Table

Table retains three cell inset sizes (row spacing, not table width or text size). The
gallery separates selection, sorting, compact rows, stripes and optional columnDividers;
its tiles are 2×2. Stripes use bg-stripe (neutral 25 in light mode, 800 in dark). Headers
align vertically to the middle. Sorting and selection are composed with native headers,
buttons and Checkbox in the live gallery, rather than a data-grid API.

Reference: [Carbon Table](https://carbondesignsystem.com/components/data-table/usage/).

## Tabs

Tabs supports three sizes, both orientations and automatic/manual keyboard activation. Its
default rounded underline spans the selected tab, including an icon or count; track
optionally adds a divider. Tab gallery tiles show icons, counts and disabled state
independently. Vertical orientation remains useful for settings views and uses the
corresponding vertical keyboard navigation.

Reference: [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Textarea

Textarea keeps native resizing and validation with horizontally larger insets at every
size.

Reference: [Atlassian Textarea](https://atlassian.design/components/textarea/usage).

## Toolbar

- [Primer ActionBar CSS](https://github.com/primer/react/blob/main/packages/react/src/ActionBar/ActionBar.module.css):
  command sizing follows the control tier. Area's surface toolbar adds 4px around full-size
  commands; the plain variant adds no surface inset. This does not imply parity with
  Primer's responsive overflow implementation.
