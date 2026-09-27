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

The [cohesion audit](research/cohesion-audit.md) (2026-09-26) re-checked every family that
had been accepted before the evidence process. Each now has a spec. The families it changed
(Alert, Avatar, Button, Card, Checkbox, Chip, Code block, Input, Menu, Nav, Popover,
Progress, Radio, Segmented, Select, Skeleton, Spinner, Switch, Table and Indicator) are back in review
awaiting the owner; the rest kept their status. The gallery shows each family's variants in
named groups (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior).

## Existing library

The manifest and React exports are authoritative for supported API; the gallery shows
actual specimens. Current families include:

- Actions and choices: Button, Checkbox/CheckboxGroup, Radio/RadioGroup, Switch,
  Slider, Chip/ChipGroup and Segmented.
- Forms: Field, Input/InputAction, InputGroup/InputGroupText, NumberField, Textarea,
  Composer, native Select, ColorField, ColorSwatchPicker, ColorPicker and Calendar.
- Navigation: Nav, Tabs, Menu and TreeView.
- Breadcrumb shows linked ancestors, a current page and an optional collapsed marker; it is in review.
- Labels and identity: Badge/BadgeGroup, Indicator/IndicatorAnchor (Presence is its
  compatibility export), Avatar, Kbd/KbdGroup and Code/Token.
- Feedback: Alert, Toast, Tooltip, Progress, Spinner and Skeleton.
- Structure and content: Card, Panel, Dialog, Popover, Separator, Table and CodeBlock.

Presentation-only or partially implemented behaviors must be stated in the component's
page. A menu-shaped surface does not by itself implement keyboard navigation; a visual
table is not a data-grid engine.

## Specs and prior decisions

Every component has a spec sheet in [`docs/specs/`](specs/README.md): its evidence,
measurements, decisions and feedback. Decisions recorded before the evidence process were
moved into those specs; [prior decisions](specs/PRIOR_DECISIONS.md) now only maps where each
went.

## Expansion inventory

Catalogue research refreshed 2026-09-23 against official component catalogues. Items
marked built are in review; the rest are proposed additions. The owner chooses what is
built next; this list is an inventory, not an order of work.

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
5. **Color controls — ColorField, ColorSwatch, ColorSwatchPicker and ColorPicker built, in
   review.** ColorField edits canonical 6/8-digit hex with draft/commit behavior. ColorSwatch
   previews solid and transparent values. ColorSwatchPicker offers labeled native radio
   choices in a row or grid. ColorPicker had a Figma pass on 2026-09-26
   ([spec](specs/color-picker.md)): a ten-row-wide surface with a square area, an eyedropper
   beside 16px hue and opacity tracks, a Hex/RGB/CSS/HSL/HSB value row, a header slot and
   saved swatches; a second pass added spectrum/grid/slider views, the Area palette grid
   (ColorSwatchPicker `palette`), OKLCH, a contrast check with its threshold band, a
   before/after preview and a save button. Still missing against Figma: gradient stops, pattern/image/video paints,
   blend mode, a contrast check, library colors and a popover trigger (needs overlay
   behavior). [React Aria ColorPicker](https://react-aria.adobe.com/ColorPicker) remains the
   behavioral reference; a ColorWheel and per-channel sliders are optional later parts.
6. **Inspector compositions.** PropertyRow, paired fields, linked four-value controls
   for padding/corners, collapsible sections, reorderable property lists, and a resizable
   panel. Fill/stroke/effect rows combine a value editor with visibility, add/remove and
   reorder actions. Typography, shadow, layout and export editors should be recipes
   assembled from the same primitives, with their own domain validation.
7. **Overlay behavior.** Built 2026-09-27, in review ([spec](specs/overlay.md)): a `trigger`
   on Popover, Menu or Tooltip adds anchoring with flip and shift, dismissal, focus
   management and the menu button keyboard. Next: submenus, context menus, Select's listbox. Color and unit pickers depend
   on these behaviors. [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
   is a useful reference for composable overlays and keyboard behavior.

### Broader coverage after the inspector foundation

- **Entry and forms:** SearchField, PasswordField, Combobox/Autocomplete, MultiSelect,
  TagPicker, editable text, OTP input, FileUpload/DropZone, Form validation and error
  summary. Reuse Input/Field for search and password anatomy; promote a wrapper when
  behavior such as reveal, clear, filtering or async suggestions is included.
- **Date and time:** Calendar is built (in review, [spec](specs/calendar.md)): single,
  range and multiple selection, one or two months, bounds and unavailable dates, square /
  circle / tile days, event markers and a week strip. Next:
  DateField (segmented entry), DatePicker and DateRangePicker (field + popover, after overlay
  behavior), TimeField and duration input. Keep segmented date editing distinct from a text
  field with a mask.
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

### Gap audit, 2026-09-26

[The audit](research/component-gap-audit.md) compared Area with 13 catalogues (Untitled UI,
shadcn, React Aria, Radix, Base UI, Fluent 2, Primer, Carbon, Mantine, MUI, Ant Design,
Chakra/Ark, Spectrum 2) across about 95 component jobs.

- **Missing, shipped by 8 or more systems:** Combobox/Autocomplete (11), Accordion (10),
  the date family (10; Calendar now built), Link (8), Pagination (8), Drawer/Sheet (8).
- **Partial:** custom Select (all 13 ship a listbox popup; Area's is native), overlay
  behavior for Popover, Tooltip, Menu and Dialog (surfaces without anchoring, dismissal or
  menu keyboard), DataGrid, multi-select/tags, Toast queue, range Slider in Slider's API.
- **Recommended order** (owner chooses): overlay behavior → custom Select → Combobox with a
  tag mode → Menu keyboard, submenus, ContextMenu and CommandPalette → ColorPicker paints →
  Disclosure/Accordion → DatePicker family → Resizable and ScrollArea → Drawer and
  AlertDialog → chat message primitives → FileUpload → HoverCard and Toggletip.

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

[Building a component](COMPONENT_ADAPTATION.md) is the canonical process for new
components and refinements: measured evidence from reference products and design systems,
a spec sheet, explicit slot ownership, a visual pass against ChatGPT, Notion and Figma,
then owner review. Small fixes reuse an existing spec and re-measure only what changes.

## Known gaps

Prioritize form correctness, composite-widget keyboard/focus behavior, motion-none
behavior and theme resilience as families are touched. Before a release, verify
cross-browser, forced-colors, assistive-technology and consumer integration behavior;
automated token checks alone do not establish those results. See
[Development](DEVELOPMENT.md).
