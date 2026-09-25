# Components

Area should cover a wide range of product interfaces without requiring each product to
invent its own controls. Expand the component and variant catalogue while keeping shared
tokens, predictable APIs, accessibility and visual quality consistent.

## What is complete

Completion is owner-confirmed. Refining a family reopens it as **in review**; historical
audits and passing builds do not confer approval.

The single executable status source is
[`component-status.mjs`](../apps/docs/src/component-status.mjs). Both the gallery and
sidebar read it. Complete labels use green-500; unrefined labels use red-500/red-25 and
specimen tiles use a red-500 edge while retaining the active themed surface. Explicit
words accompany the colors in the gallery.
Compound parts follow their parent family. Token is a compatibility composition of Code,
not a second completed family. A green build is not a completion signal.

## Existing library

The manifest and React exports are authoritative for supported API; the gallery shows
actual specimens. Current families include:

- Actions and choices: Button, Checkbox/CheckboxGroup, Radio/RadioGroup, Switch,
  Slider, Chip/ChipGroup and Segmented.
- Forms: Field, Input/InputAction, InputGroup/InputGroupText, NumberField, Textarea,
  Composer and native Select.
- Navigation: Nav, Tabs, Menu and TreeView.
- Breadcrumb shows linked ancestors, a current page and an optional collapsed marker; it is in review.
- Labels and identity: Badge/BadgeGroup, Indicator/IndicatorAnchor, Presence, Avatar, Kbd/KbdGroup and Code/Token.
- Feedback: Alert, Toast, Tooltip, Progress, Spinner and Skeleton.
- Structure and content: Card, Panel, Dialog, Popover, Separator, Table and CodeBlock.

Presentation-only or partially implemented behaviors must be stated in the component's
page. A menu-shaped surface does not by itself implement keyboard navigation; a visual
table is not a data-grid engine.

Current refinements: Nav has a 200px default vertical measure, content-width horizontal
layout, decorative trailing annotations and independent action slots. Panel is 280px
with medium control-height rows; its inset size does not resize child controls.
Table retains three cell inset sizes (row spacing, not table width or text size). The
gallery separates selection, sorting, compact rows, stripes and optional columnDividers; its tiles are 2×2.
Stripes use bg-stripe (neutral 25 in light mode, 800 in dark). Headers align vertically
to the middle. Sorting and selection are composed with native
headers, buttons and Checkbox in the live gallery, rather than a data-grid API. Tabs
supports three sizes, both orientations and automatic/manual keyboard activation.
Its default rounded underline spans the selected tab, including an icon or count; track optionally
adds a divider. Tab gallery tiles show icons, counts and disabled state independently.
Vertical orientation remains useful for settings views and uses the corresponding
vertical keyboard navigation. Nav uses filled rows for destinations, with a compact
horizontal run for top level routes and a separate vertical selection marker option.
Textarea keeps native resizing and validation with horizontally larger insets at every
size. Toast supports titles, actions and dismissal; it is a surface, not a global queue
or automatic timer. Plain Toasts use 8px vertical/10px horizontal insets; action and
dismissal Toasts use 4px vertical insets around their 28px controls. All three are 38px
high at normal density, with centered icons and text. Multiline icons align to the first text line, and
multiline is demonstrated separately from tone. Consumers own
placement, lifetime and dismissal focus restoration. Tooltip omits its indicator by
default; arrow opts into an 8px diamond with a subtle 2px radius on only its exposed tip. The gallery
shows the default, indicator, shortcut and side compositions separately. Skeleton cards have two text lines; type samples
share the trailing half of the tile.

These refinements draw on [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/),
[Carbon Table](https://carbondesignsystem.com/components/data-table/usage/),
[Spectrum Toast](https://react-spectrum.adobe.com/v3/Toast.html) and
[Atlassian Textarea](https://atlassian.design/components/textarea/usage).
Area keeps its own type, spacing and control tokens rather than copying their dimensions.

Code block follows the [Geist Code Block](https://vercel.com/geist/code-block) anatomy --
a file header with the copy action on its trailing edge, a 32px line-number gutter, and a
single monospace size (14/20px, the system's small text role) across every variant. It
keeps Area's own tokens rather than Geist's 13/20px type and 16px block inset. Its four
syntax hues are the measured vivid rung of danger, discovery, info and the accent, in that
order: red keywords, purple tags, blue attributes and accent strings. Punctuation and
comments stay neutral, because a hue on the glyphs that carry the nesting reads as
confetti. Strings follow the accent axis, so a pink accent produces pink strings.

Popover uses Tooltip's medium UI type and shadow-2, with a 12px border-inclusive
outer inset. It uses the theme surface (white in light, dark in dark mode).
Its preferred width is 240px, capped at its container for every composition. Group gaps
are 12px with 8px inside the body. A small-control-height header contains the title and
close button, without negative margins or trimmed title line boxes. Description leading
is UI leading minus 2px (14/18px at default density). Examples omit pointers and share
optional media, header, body and optional footer slots.
Media corners subtract the inset and border from the outer radius. The optional
decorative SVG pointer has a curved outline and supports all four sides. Tooltip is a
non-focusable hover/focus description; rich interactive content belongs in Popover.
See [WAI Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) and
[Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover).
The existing Popover API supplies the surface; consumers still own trigger, positioning,
focus and dismissal behavior.

Dialog follows the [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/base/dialog)
composition: a title and description above an optional scrolling body, trailing
actions, and an optional corner close control. It uses one 16px outer inset (including
the border), 16px between sections and 8px between title and description. The footer
has no divider. The title uses the 18/26px text role, with medium UI body type. All
sections share a leading edge and the container radius follows the system radius axis.
Select's enhanced native picker opens below with a 4px gap and no above-input fallback;
unsupported browsers retain their platform-native picker placement. Segmented iconOnly
keeps option labels accessible while using square inner buttons.

## Expansion inventory

Research refreshed 2026-09-23 against official component catalogues. NumberField is now
built and in review; the remaining items are proposed additions. Build the inspector foundation first, then
extend coverage across general product interfaces.

### Inspector foundation: first priority

1. **NumberField — built, in review.** Decimal and negative values, min/max/step,
   keyboard increments, optional steppers, units, locale-aware formatting, scrubbing,
   fine/coarse increments, mixed values, and commit/cancel behavior are implemented.
   Expression entry uses a bounded arithmetic parser. Native Input type=number remains
   available for ordinary numeric forms.
   [React Aria NumberField](https://react-aria.adobe.com/NumberField) supplies a strong
   behavioral baseline. [Figma's field documentation](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions)
   confirms arithmetic entry and dragging a field icon to change its value.
2. **InputGroup — built, in review.** One shell now composes independently named
   controls, affixes, actions and a native mode picker. Reuse NumberField for X/Y, W/H,
   angle, opacity, gap and padding. A dimension field combines a number with a sizing
   mode such as fixed, hug or fill; these modes belong to an inspector recipe, not
   to every text input. Keep labels and keyboard stops on each independently edited value.
3. **ButtonGroup and Toolbar — built, in review.** ButtonGroup collects independent
   actions and toggles in one visual track. Toolbar adds command grouping, roving
   keyboard focus and native overflow disclosure. Alignment/distribution/flip buttons execute commands; flow direction
   and mutually exclusive modes reuse Segmented. Add SplitButton only where a default
   action and its menu have separate jobs. Button already supports iconOnly: no second
   icon-button implementation is needed. [Fluent's catalogue](https://fluent2.microsoft.design/components/web/react)
   distinguishes Toolbar, SpinButton and TagPicker from ordinary inputs.
4. **AlignmentPicker — built, in review.** A reusable nine-position choice with spatial arrow-key navigation,
   native radio state, form submission, an accessible selected position and a visible focus indicator. Constraints and
   pinning are a separate composition because opposing anchors may be selected together.
   The single-choice contract follows the [WAI radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
   and [Base UI radio group](https://base-ui.com/react/components/radio-group); spatial arrows follow the visible grid.
5. **Color controls — ColorField, ColorSwatch and ColorSwatchPicker built, in review.** ColorField edits
   canonical 6/8-digit hex with draft/commit behavior. ColorSwatch previews solid and
   transparent values. [React Spectrum's ColorField](https://react-spectrum.adobe.com/v3/ColorField.html)
   and [ColorSwatch](https://react-spectrum.adobe.com/v3/ColorSwatch.html) establish
   editable color values and a transparency preview. ColorSwatchPicker offers labeled,
   native radio choices in a token-sized row or spatial grid, including transparency,
   form submission and reset. Its keyboard contract follows the
   [WAI radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), while its
   color-list structure follows [React Aria ColorSwatchPicker](https://react-aria.adobe.com/ColorSwatchPicker).
   Next, ColorArea and
   ColorSlider compose into ColorPicker. Include independently editable alpha,
   hex/RGB/HSL formats, an optional eyedropper and keyboard equivalents for pointer
   operations. [React Aria ColorPicker](https://react-aria.adobe.com/ColorPicker)
   demonstrates this shared color-state composition. Build gradient stops and image
   fills as later editors rather than overloading the initial solid-color field.
6. **Inspector compositions.** PropertyRow, paired fields, linked four-value controls
   for padding/corners, collapsible sections, reorderable property lists, and a resizable
   panel. Fill/stroke/effect rows combine a value editor with visibility, add/remove and
   reorder actions. Typography, shadow, layout and export editors should be recipes
   assembled from the same primitives, with their own domain validation.
7. **Overlay behavior.** Finish trigger/anchor positioning, dismissal, focus management
   and collision handling for Popover/Menu/Tooltip. Their existing visual surfaces
   must not be mistaken for complete interaction systems. Color and unit pickers depend
   on these behaviors. [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
   is a useful reference for composable overlays and keyboard behavior.

### What the supplied references establish

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

### Breadcrumb sizing decision

Keep Breadcrumb on the medium UI type and gap tier for now. It is a navigation trail,
not an input control, and the current specimens do not show a distinct small or large
use case. Product-wide compact UI already changes its tier values. Add a public size
axis only when a real composition needs one; Breadcrumb remains in review until owner
acceptance.

### Broader coverage after the inspector foundation

- **Entry and forms:** SearchField, PasswordField, Combobox/Autocomplete, MultiSelect,
  TagPicker, editable text, OTP input, FileUpload/DropZone, Form validation and error
  summary. Reuse Input/Field for search and password anatomy; promote a wrapper when
  behavior such as reveal, clear, filtering or async suggestions is included.
- **Date and time:** DateField, TimeField, Calendar, DatePicker, DateRangePicker and
  duration input. Keep segmented date editing distinct from a text field with a mask.
- **Navigation and commands:** Link, Breadcrumbs, Pagination, Stepper, Tree,
  ContextMenu, MenuBar and CommandPalette. Add keyboard behaviors to existing Menu
  before multiplying menu-shaped components.
- **Selection and collections:** ListBox, selectable List, TreeSelect/Cascader,
  TransferList, Rating, ToggleButtonGroup and drag/reorder handles. Choice cards can
  reuse Checkbox/Radio compositions; AvatarGroup and range Slider already exist.
- **Surfaces and layout:** Accordion/Disclosure, Drawer/Sheet, AlertDialog, HoverCard,
  Resizable/Splitter, ScrollArea and responsive layout primitives. PageHeader, Sidebar,
  application shell and dockable inspector are compositions.
- **Data and feedback:** DescriptionList, Stat, Timeline, EmptyState, Result/ErrorState,
  Banner, Meter, circular Progress, live notification queue, DataGrid and TreeGrid.
  DataGrid needs editing, resizing, selection and virtualization contracts beyond Table.
- **Content and advanced tools:** image/media preview, Carousel, rich text and code-editor
  integrations, charts, gradient editor, easing/curve editor and shortcut recorder.
  Prefer adapters to mature editing/chart engines over a superficial native reimplementation.

Breadth references: [Carbon](https://carbondesignsystem.com/components/overview/components/)
for enterprise forms and structured navigation; [Primer](https://primer.style/product/components/)
for application patterns; [shadcn/ui](https://ui.shadcn.com/docs/components) for composable
input groups, commands and resizable layouts; [Material UI](https://mui.com/material-ui/all-components/)
for date, tree and grid coverage; [Ant Design](https://ant.design/components/overview/)
for cascaded selection, transfer lists, splitters and upload flows. Their catalogue names
are research inputs, not a reason to add duplicate Area aliases.

Keep behavioral boundaries clear: Select differs from Combobox; Badge from selectable
Chip; Tooltip from interactive Popover; Table from DataGrid. Count independent jobs and
working behaviors rather than styling aliases when evaluating library coverage.

## Useful variants

Each family exposes the dimensions it actually needs:

- **Treatment:** persistent visual emphasis such as solid, soft, outline, ghost or plain.
- **Tone:** neutral, accent and semantic meanings; supported values come from its manifest.
- **Size:** named tiers appropriate to the component, not a forced five-size template.
- **State:** selected, disabled, loading, invalid, expanded and other runtime facts.
- **Layout:** orientation, wrapping, alignment and explicit full width.
- **Composition:** icons, descriptions, affixes, counts, actions, media and grouped items.

Offer broad useful coverage without multiplying aliases or making every component expose
unrelated controls. Shared light/dark and compact/default settings are not variants.
Gallery names use lowerCamelCase segments: `soft-accent`, `dotOutline-accent`,
`state-queued`, `size-md`, `group-inline`, `composition-tableStatus`.
One tile shows one specimen; genuine groups and size comparisons may contain multiple items.
Long text, RTL and enlargement are verification cases, not public variants.

## Build workflow

Use [Component adaptation](COMPONENT_ADAPTATION.md) as the canonical process for new
components and substantial refinements: real source, explicit slot ownership, Area visual
language, then measured browser verification. [Design references](DESIGN_REFERENCES.md)
routes source choices; the repository visual-language skill guides the visual pass.
Small fixes reuse established structure and research only unresolved questions.

## Next work and known gaps

Slider has been refined across its native value lifecycle: controlled and uncontrolled
values, normalization, live fill/readout updates and form reset now stay synchronized.
It now has a neutral default, an accent opt-in, labeled and range-with-input compositions,
vertical layout, and discrete step markers, plus a surface thumb with a centered fill-color
dot. Its public sizes are the justified
small/medium/large family; UI scale owns product-wide density. It is owner-confirmed
complete.

Input and Field have also received a confirmation pass. Input's error entry points now
agree on native `aria-invalid`, InputAction preserves external descriptions alongside its
tooltip, and focused tests cover the Field label, description, validation, required and
disabled relationships. Their existing variants remain intact and are expanded in the
gallery. Both are owner-confirmed complete.

All existing families are owner-confirmed complete at this point. Further work on any of
them reopens that family as in review. Prioritize form correctness, composite-widget
keyboard/focus behavior, motion-none behavior and theme resilience as those families are
touched. Before a release, verify cross-browser, forced-colors, assistive-technology and
consumer integration behavior; automated token checks alone do not establish those
results. See [Development](DEVELOPMENT.md).

## TreeView and Composer, 2026-09-23

TreeView follows [Primer's hierarchy guidance](https://primer.style/product/components/tree-view/guidelines/)
and [keyboard model](https://primer.style/product/components/tree-view/accessibility/):
only one visible row is in the Tab order; Up/Down, Left/Right, Home/End and typeahead
move through or expand the hierarchy. It accepts controlled or initial expansion and
selection. The gallery shows a file tree and a checkbox filter tree. Checkbox mode is
an Area addition based on the supplied filter screenshot; Primer's current TreeView
reserves Space for future checkbox support. Counts are visible and announced. Add an
accessible tree name with `aria-label` or `aria-labelledby`. Nodes use a flat DOM with
explicit level, position and set size metadata; further screen-reader testing of deeply
nested structures is appropriate before owner acceptance.

Composer uses a native textarea, so text selection, IME entry and Shift+Enter newlines
remain native. Inline and stacked layouts share the same action slots and submission
contract. Enter sends by default, Shift+Enter adds a line, and Ctrl/Command+Enter sends
when Enter submission is disabled. The send action stays unavailable for empty text.
The textarea grows up to five normal control rows; the gallery uses working send and
mode examples without assuming attachment or voice service APIs. Form submission,
attachments and model selection belong to the consuming application.

InputGroup now paints one focus shell. Its visual compartment is one square control
height with centered 16px Fluent art or a control-text-sized letter, so both have equal
horizontal inset. The focused child's rectangular inner shadow was removed.

## Control refinement, 2026-09-24

The screenshot regressions were traced to implementation, not screen scaling: the
medium badge was 24px and a fixed horizontal padding rule bypassed its optical inset.
The default is now 20px with 12px icons and equal 4px outer icon insets; small/large
are 16/24px. Closed native popovers must remain hidden, overlay content must not shrink
inside a badge row, and tabs reserve space for anchored badges. The card-heading demo
now uses CardContent and an explicit composition width. Dialog content inset is 16px.
Badge and Dialog are reopened for owner review.

Public code used for the refinements:

- [shadcn ButtonGroup](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button-group.tsx)
  and [Untitled UI ButtonGroup](https://github.com/untitleduico/react/blob/main/components/base/button-group/button-group.tsx):
  connected full-size buttons, collapsed shared borders and only outside corners rounded.
  Area reuses Button typography, icons, state painting and focus behavior.
- [Primer ActionBar CSS](https://github.com/primer/react/blob/main/packages/react/src/ActionBar/ActionBar.module.css):
  command sizing follows the control tier. Area's surface toolbar adds 4px around full-size
  commands; the plain variant adds no surface inset. This does not imply parity with
  Primer's responsive overflow implementation.
- [OpenAI Textarea CSS](https://github.com/openai/apps-sdk-ui/blob/main/src/components/Textarea/Textarea.module.css):
  line-height-driven text gutters and bounded rows inform Composer. Area keeps its native
  textarea, 32px default actions and 8px outer inset, with a concentric 16px corner radius.
- [React Aria ColorSwatchPicker](https://react-aria.adobe.com/ColorSwatchPicker):
  labeled radio choices and separate selected/focus states. Area uses compact square
  cells, a legible selection ring and checkerboard transparency. ColorField inherits
  Input's typography and inset instead of introducing an unrelated monospace field.
- [Figma alignment guidance](https://help.figma.com/hc/en-us/articles/31289464393751-Use-the-horizontal-and-vertical-flows-in-auto-layout):
  the nine-position control and spatial arrow navigation inform AlignmentPicker; a flat
  selected cell replaces the raised tile. Dimensions come from Area's tokens.

[Geist Avatar](https://vercel.com/geist/avatar) and
[Notion editing guidance](https://www.notion.com/help/writing-and-editing-basics) were
reviewed for adjacent-control sizing and contextual actions. Neither establishes
private editor CSS measurements. The Framer findings above remain the reference for
inspector composition and conditional property controls. Exact Figma/Notion/Framer
internal tokens remain unverified; no private source implementation is claimed.

### Color and alignment follow-up, September 24

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
submits one canonical hex value. `opacityLabel` names the separate control. AlignmentPicker
uses three rounded bars with column-dependent alignment, 2px unselected dots, no selected
backplate, and `stretch` to fill both dimensions of a sized parent. Landscape and portrait
examples demonstrate this independently of size/treatment variants.

### Badge structure — Untitled UI follow-up

The owner requested Untitled UI's badge structure, superseding the prior 16/20/24px
scale. Its [public badge source](https://github.com/untitleduico/react/blob/main/components/base/badges/badges.tsx)
uses 20/24/28px text badges (sm/md/lg), 12px icons, 16px images, and content-dependent
horizontal gutters. Area now follows that scale: pill text gutters 8/10/12px; icon-side
6/8/10px; icon gaps 2/4/4px; dot/media gaps 4/6/6px. Rounded text gutters are 6/8/10px.
Border width is subtracted once in inset.css. This is an explicit badge exception to the
usual equal optical inset formula, with no per-glyph adjustment. Medium is now 24px;
choose small for the 20px badge requested earlier.

Existing soft/solid/outline/ghost/plain, tones, anchors, groups and content flags remain.
Added `shape="rounded"`, `variant="color"` (tinted fill and border), `variant="modern"`
(neutral surface, subtle shadow and colored addon), avatar/flag slots, and a native dismiss
button with a required `dismissLabel`. Modern defaults to rounded; explicit shape/pill
can override it. Links cannot contain dismiss buttons. Media must be decorative; its
meaning belongs in the visible label.

Untitled's color recipe uses utility-50 fills, utility-200 rings, utility-700 text and
utility-500 addons. Its pale backgrounds make the stronger accents perceptually distinct;
it does not paint the entire badge at one saturation or opacity. Area uses its existing
semantic counterparts so contrast/theme behavior is retained. No palette colors or
contrast thresholds were changed. Exact hues differ between the two systems; matching
spacing does not imply their palettes are identical.

### Badge / Indicator / BadgeGroup separation

Latest owner direction supersedes the badge shape/treatment additions above: badges
are pill-only; ghost/plain/custom are removed. Custom was a caller-owned color-pair escape
hatch, not distinct badge behavior. Reference comparison, duplicate number/icon-circle,
custom-brand, card-heading and nav-new examples were removed.

Indicator and IndicatorAnchor now own compact counts (with a display cap), presence
(online/offline/busy/away), and attachments to buttons, avatars and tabs. The attached
visual is inert and decorative; name its count/status on the owning control. BadgeGroup
is a separate layout component and documentation family: omit visibleCount to wrap all,
set a number to cap the visible badges, or use auto to fit available width. Inline allows
wrapping and overlay keeps one line; both use the same native overflow popover.

Badge icons use native Fluent 16px artwork in 16px boxes; the earlier 16-to-12 downscale
made them appear too small. The dismiss glyph is the vendored Fluent dismiss_16_regular
geometry. Dot badges follow Untitled's small Dot: an 8px slot containing a 6px painted
circle (its source has radius 2.5 plus a 1px stroke), with 4/6/6px slot-to-text gaps.

Badge icon inset follow-up: leading/trailing 16px Fluent slots now use equal outer
insets of 2/4/6px at sm/md/lg, while text and dot gutters stay unchanged. Dismiss uses
the native Fluent 12px cut inside its 16px action box. Leading/icon-only gallery examples
use default neutral-soft paint. LinkSoft was redundant and removed; the single Link
example is a neutral-soft native anchor with Fluent's link icon. Navigation does not
assign a tone; semantic tone remains a separate choice.

## Source-based adaptation

For owner-requested source adaptations, use [Component adaptation](COMPONENT_ADAPTATION.md).
Indicator now follows Mantine and Presence follows Fluent UI; both remain In review.
Presence is separate from count/activity Indicator, with shared IndicatorAnchor composition.

Latest owner direction: Untitled UI first; Indicator includes presence status. Presence
remains a compatibility export. Four corner anchors, one variant per gallery tile.
See the latest adaptation record for source and geometry changes.
