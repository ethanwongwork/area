# Components

Area should cover a wide range of product interfaces without requiring each product to
invent its own controls. Expand the component and variant catalogue while keeping shared
tokens, predictable APIs, accessibility and visual quality consistent.

## What is complete

**Every family that ships today is owner-confirmed complete** as of 2026-09-22: Alert,
Avatar, Badge, Button, Card, Checkbox, Chip, Code, Code block, Dialog, Field, Input, Kbd,
Menu, Nav, Panel, Popover, Progress, Radio, Segmented, Select, Separator, Skeleton,
Slider, Spinner, Switch, Table, Tabs, Textarea, Toast and Tooltip. Refining a family
reopens it as **in review**; only owner confirmation moves it back to complete.
Historical audits and passing builds do not confer approval.

Tooltip was refined on 2026-09-23 and is complete; the registry below records the
current owner-confirmed status.

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
- Forms: Field, Input/InputAction, Textarea and native Select.
- Navigation: Nav, Tabs and Menu.
- Labels and identity: Badge/BadgeAnchor/BadgeGroup, Avatar, Kbd/KbdGroup and Code/Token.
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
or automatic timer. Toasts use 8px vertical/10px horizontal insets so 16px icons have
equal optical insets on a 20px text line; icons align to the first text line, and
multiline is demonstrated separately from tone. Consumers own
placement, lifetime and dismissal focus restoration. Tooltip omits its indicator by
default; arrow opts into an 8px diamond with a subtle 2px tip radius. The gallery
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
actions, and an optional corner close control. It uses one 24px outer inset (including
the border), 24px between sections and 8px between title and description. The footer
has no divider. The title uses the 18/26px text role, with medium UI body type. All
sections share a leading edge and the container radius follows the system radius axis.
Select's enhanced native picker opens below with a 4px gap and no above-input fallback;
unsupported browsers retain their platform-native picker placement. Segmented iconOnly
keeps option labels accessible while using square inner buttons.

## Expansion inventory

Research refreshed 2026-09-23 against official component catalogues. The items below
are proposed additions, not shipped APIs. Build the inspector foundation first, then
extend coverage across general product interfaces.

### Inspector foundation: first priority

1. **NumberField.** Decimal and negative values, min/max/step, keyboard increments,
   optional steppers, units and locale-aware formatting. Add optional scrubbing on a
   labeled handle, fine/coarse increments, mixed values, and commit/cancel behavior.
   Expression entry needs a bounded arithmetic parser, never evaluation of arbitrary
   code. Native Input type=number already exists; these are the missing behaviors.
   [React Aria NumberField](https://react-aria.adobe.com/NumberField) supplies a strong
   behavioral baseline. [Figma's field documentation](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions)
   confirms arithmetic entry and dragging a field icon to change its value.
2. **InputGroup and compound fields.** One shell around labeled segments, affixes,
   units, independent actions and a mode picker. Reuse NumberField for X/Y, W/H,
   angle, opacity, gap and padding. A dimension field combines a number with a sizing
   mode such as fixed, hug or fill; these modes belong to an inspector recipe, not
   to every text input. Keep labels and keyboard stops on each independently edited value.
3. **Toolbar and ButtonGroup.** Support independent actions, toggle actions and
   overflow. Alignment/distribution/flip buttons execute commands; flow direction
   and mutually exclusive modes reuse Segmented. Add SplitButton only where a default
   action and its menu have separate jobs. Button already supports iconOnly: no second
   icon-button implementation is needed. [Fluent's catalogue](https://fluent2.microsoft.design/components/web/react)
   distinguishes Toolbar, SpinButton and TagPicker from ordinary inputs.
4. **AlignmentPicker.** A reusable nine-position choice with arrow-key navigation,
   an accessible selected position and a visible focus indicator. Constraints and
   pinning are a separate composition because opposing anchors may be selected together.
5. **Color controls.** ColorField, ColorSwatch, ColorSwatchPicker, ColorArea and
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

1. Start with the user job and a visually coherent default. Inspect the current CSS,
   manifest, React wrapper and demos; retain working behavior rather than rebuilding it.
2. Use public design-system documentation to establish functional baselines—native
   behavior, accessibility, size classes, states and composition boundaries. Treat those
   findings as a starting point, not a mandate to import every documented variant.
3. Preserve concise observations from products without public component systems (for
   example Notion, ChatGPT/OpenAI and Cursor): density, type hierarchy, color use,
   interaction patterns and useful compositions. They are design signals and suggestions,
   never implied public API contracts or invented measurements.
4. Present the default plus a short, labeled set of suggested functional variants. The
   owner chooses which reference-driven variants enter the library; do not let an audit
   or a coverage checklist decide the component surface.
5. Implement accepted work across CSS, manifest, React and demos. First match the visual
   system—density, radius, gaps, padding, type, icons and structure—then consolidate
   stable decisions into semantic/component tokens.
6. Verify semantics, keyboard/state behavior, sizes, customization and relevant edge
   cases. Run affected checks and inspect the preview. Say what is still unverified.
7. Present the working result. Mark it complete only after owner acceptance and checks;
   do not turn that final acceptance into a mandatory pre-implementation approval gate.

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
