# Components

Area should cover a wide range of product interfaces without requiring each product to
invent its own controls. Expand the component and variant catalogue while keeping shared
tokens, predictable APIs, accessibility and visual quality consistent.

## What is complete

Completion is owner-confirmed. Refining a family reopens it as **in review**; historical
audits and passing builds do not confer approval.

The single executable status source is
[`component-status.mjs`](../apps/desktop/src/content/component-status.mjs). Both the gallery and
sidebar read it. Complete labels use green-500; unrefined labels use red-500/red-25 and
specimen tiles use a red-500 edge while retaining the active themed surface. Explicit
words accompany the colors in the gallery.
Compound parts follow their parent family. Token is deprecated in favour of `<Code swatch>`
(audit H-25 A, owner 2026-09-30; still exported so existing markup renders), not a second
completed family. A green build is not a completion signal.

The [cohesion audit](research/cohesion-audit.md) (2026-09-26) re-checked every family that
had been accepted before the evidence process. Each now has a spec. The families it changed
(Alert, Avatar, Button, Card, Checkbox, Chip, Code block, Input, Menu, Nav, Popover,
Progress, Radio, Segmented, Select, Skeleton, Spinner, Switch, Table and Indicator) went back
to review; the owner has since approved every family in batches (2026-09-27 and 2026-09-28),
so all 58 are Complete and `REVIEW_COMPONENTS` is empty. The gallery shows each family's variants in
named groups (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior).

## Existing library

The manifest and React exports are authoritative for supported API; the gallery shows
actual specimens. Current families include:

- Actions and choices: Button, ButtonGroup, SplitButton, Toolbar, Checkbox/CheckboxGroup,
  Titlebar and SectionHeading (in review, 2026-10-15: the desktop app's bar and section titles, as components),
  ListBox (in review, 2026-10-15: options to choose one from, a list or a grid, one Tab stop; the Icons tab uses it),
  CopyButton (in review, 2026-10-15: copies and shows a check for two seconds; Code block, Token row and the app use it),
  Radio/RadioGroup, Switch, Slider/SliderRange, Chip/ChipGroup, Segmented, ToggleGroup (in review, 2026-10-10: a set of toggle Buttons, any number or at most one pressed) and AlignmentPicker.
- Forms: Field, Input/InputAction, InputGroup/InputGroupText, NumberField, BoxField, Textarea,
  Composer, native Select, Combobox, CustomSelect, TagPicker, DatePicker, ConfirmDialog, Drawer (in review, 2026-10-05), ColorField, ColorSwatch, ColorSwatchPicker, ColorPicker,
  Calendar, PropertyList, FileUpload (in review, 2026-10-09: drop zone and upload rows), PasswordField, OTPField
  and TimeField (Complete, 2026-10-13: a reveal action; code slots over one input; time segments with a list).
- Navigation and commands: Nav, Tabs, Menu, ContextMenu, CommandPalette, TreeView,
  Breadcrumb (linked ancestors, a current page and an optional collapsed marker) and
  Pagination (in review, 2026-10-08: numbered pages or a compact "Page 2 of 10", buttons or links)
  and Link (in review, 2026-10-08: inline or standalone, inherited, muted or Action ink, external),
  and Stepper (Complete, 2026-10-13: Timeline's numbered steps, done steps checked).
- Labels and identity: Badge/BadgeGroup, Count, Indicator/IndicatorAnchor, Presence (the
  status mark, audit H-25), Avatar, Kbd/KbdGroup and Code (Token is deprecated: use `<Code swatch>`).
- Feedback: Alert (with the banner layout), Toast, Tooltip, Toggletip (in review, 2026-10-09: an info or help
  button beside a label whose note previews on hover and focus and pins on a press), EmptyState (in review, 2026-10-10: icon tile, title, muted line and
  actions for a region with nothing in it; md after ChatGPT, sm after Notion), Progress, Spinner (its `value`,
  2026-10-13, stops the ring at a value: the circular progress) and Skeleton.
- Structure and content: Card, Panel (with `resizable`), Dialog, Popover, HoverCard, ScrollArea (in review, 2026-10-09),
  Separator, Table and CodeBlock.
- File explorer: Folder (Complete, 2026-10-19: Finder's folder figure in a square box, sheets or thumbnails peeking
  out, palette tones, a badge, open under a drag) File page (Complete: Finder's document page, folded corner, glyph and extension) and File tile with FileGrid (Complete, 2026-10-19: Finder's icon-view
  item on ListBox's grid, Enter or a double click opens). Next: multi-select, rename, FileRow on Table, a file-type icon
  map. Research: `docs/research/file-explorer-2026-10-18/`.
- Conversation: Message/MessageActions, PromptSuggestions, ModelPicker and ScrollToLatest, and the agent chat set (in review, 2026-10-19:
  Step / StepGroup / Reasoning, EditSummary with Diff, Approval, Plan and TurnNotice; the Inspector's Chat view; research
  `docs/research/inspector-chat-2026-10-18/`).

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
marked built are Complete; the rest are proposed additions. The owner chooses what is
built next; this list is an inventory, not an order of work.

### Inspector foundation: first priority

1. **NumberField — built, Complete.** Decimal and negative values, min/max/step,
   keyboard increments, optional steppers, units, locale-aware formatting, scrubbing,
   fine/coarse increments, mixed values, and commit/cancel behavior are implemented.
   Expression entry uses a bounded arithmetic parser. Native Input type=number remains
   available for ordinary numeric forms.
   [React Aria NumberField](https://react-aria.adobe.com/NumberField) supplies a strong
   behavioral baseline. [Figma's field documentation](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions)
   confirms arithmetic entry and dragging a field icon to change its value.
2. **InputGroup — built, Complete.** One shell now composes independently named
   controls, affixes, actions and a native mode picker. Reuse NumberField for X/Y, W/H,
   angle, opacity, gap and padding. A dimension field combines a number with a sizing
   mode such as fixed, hug or fill; these modes belong to an inspector recipe, not
   to every text input. Keep labels and keyboard stops on each independently edited value.
3. **ButtonGroup and Toolbar — built, Complete.** ButtonGroup collects independent
   actions and toggles in one visual track. Toolbar adds command grouping, roving
   keyboard focus and native overflow disclosure. Alignment/distribution/flip buttons execute commands; flow direction
   and mutually exclusive modes reuse Segmented. SplitButton (built, Complete) joins a
   default action to a menu of related actions; it is standalone, as in Fluent, Material,
   Carbon and Atlassian ([spec](specs/split-button.md)). Button already supports iconOnly: no second
   icon-button implementation is needed. [Fluent's catalogue](https://fluent2.microsoft.design/components/web/react)
   distinguishes Toolbar, SpinButton and TagPicker from ordinary inputs.
4. **AlignmentPicker — built, Complete.** A reusable nine-position choice with spatial arrow-key navigation,
   native radio state, form submission, an accessible selected position and a visible focus indicator. Constraints and
   pinning are a separate composition because opposing anchors may be selected together.
   The single-choice contract follows the [WAI radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
   and [Base UI radio group](https://base-ui.com/react/components/radio-group); spatial arrows follow the visible grid.
   In progress (2026-10-04): the grid is responsive and fills its parent like Figma's 88 × 56 layout grid, with a hover preview (one field
   column by two field rows, non-square cells); the square-cell ladder stays as is (audit F-31 A, owner 2026-09-30).
5. **Color controls — ColorField, ColorSwatch, ColorSwatchPicker and ColorPicker built,
   Complete.** ColorField edits canonical 6/8-digit hex with draft/commit behavior. ColorSwatch
   previews solid and transparent values. ColorSwatchPicker offers labeled native radio
   choices in a row or grid. ColorPicker had a Figma pass on 2026-09-26
   ([spec](specs/color-picker.md)): a ten-row-wide surface with a square area, an eyedropper
   beside 16px hue and opacity tracks, a Hex/RGB/CSS/HSL/HSB value row, a header slot and
   saved swatches; a second pass added spectrum/grid/slider views, the Area palette grid
   (ColorSwatchPicker `palette`), OKLCH, a contrast check with its threshold band, a
   before/after preview and a save button. Still missing against Figma: gradient stops, pattern/image/video paints,
   blend mode, library colors and a popover trigger (overlay behavior now exists; ColorPicker
   is not yet wired to it). [React Aria ColorPicker](https://react-aria.adobe.com/ColorPicker) remains the
   behavioral reference; a ColorWheel and per-channel sliders are optional later parts.
6. **Inspector compositions.** PanelRow (paired fields), BoxField (linked four-value
   padding/corners, [spec](specs/box-field.md)), collapsible sections and PropertyList
   (reorderable property lists) are built and accepted; Panel `resizable`
   ([spec](specs/resizable-panel.md)) is accepted with Panel. Fill/stroke/effect rows combine a value editor with visibility, add/remove and
   reorder actions. Typography, shadow, layout and export editors should be recipes
   assembled from the same primitives, with their own domain validation.
7. **Overlay behavior.** Built 2026-09-27, Complete ([spec](specs/overlay.md)): a `trigger`
   on Popover, Menu or Tooltip adds anchoring with flip and shift, dismissal, focus
   management and the menu button keyboard. Submenus, ContextMenu, HoverCard and Combobox's
   listbox are built on it since; Select's custom listbox is not (Select stays native). Color and unit pickers depend
   on these behaviors. [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
   is a useful reference for composable overlays and keyboard behavior.

### Broader coverage after the inspector foundation

- **Entry and forms:** SearchField [built 2026-10-10], PasswordField [built 2026-10-13], MultiSelect (Combobox is built),
  TagPicker, editable text [built 2026-10-11], OTP input [built 2026-10-13 as OTPField], Form validation and error
  summary. Reuse Input/Field for search and password anatomy; promote a wrapper when
  behavior such as reveal, clear, filtering or async suggestions is included.
- **Date and time:** Calendar is built (Complete, [spec](specs/calendar.md)): single,
  range and multiple selection, one or two months, bounds and unavailable dates, square /
  circle / tile days, event markers and a week strip. Next:
  DateField (segmented entry), DatePicker [built 2026-10-05] and DateRangePicker [built 2026-10-10] (field + popover), TimeField [built 2026-10-13] and duration input. Keep segmented date editing distinct from a text
  field with a mask.
- **Navigation and commands:** Stepper [built 2026-10-13] and MenuBar (Breadcrumb, TreeView,
  ContextMenu, CommandPalette, Pagination and Link are built). Add keyboard behaviors to existing Menu
  before multiplying menu-shaped components.
- **Selection and collections:** ListBox, selectable List, TreeSelect/Cascader,
  TransferList, Rating, ToggleButtonGroup and drag/reorder handles. Choice cards can
  reuse Checkbox/Radio compositions; AvatarGroup and range Slider already exist.
- **Action tile (candidate, owner 2026-10-12):** an action with its icon stacked over its
  label, laid out in an equal-width grid. Seen in Cursor's icon gallery hover card (Copy SVG,
  Download SVG, Copy Symbol); also resembles Figma's "New design file" tiles and share sheets.
  Not a Button layout: its height follows its content, not the 28 / 32 / 40 size axis, and
  Button's sources (ChatGPT, Notion, Figma, Untitled UI) only put the icon inline. Before
  building it, capture it in at least two more products, then decide whether it is its own
  component or a Card/ToggleGroup composition. The app's icon card uses standard `sm` outline
  Buttons until then.
- **Surfaces and layout:** Accordion/Disclosure, Drawer/Sheet, AlertDialog, a two-region
  Splitter and responsive layout primitives (HoverCard, Panel `resizable` and ScrollArea are
  built). PageHeader, Sidebar,
  application shell and dockable inspector are compositions.
- **Data and feedback:** DescriptionList [built 2026-10-10], Stat, Timeline [built 2026-10-11], EmptyState [built 2026-10-10], Result/ErrorState,
  Meter [built 2026-10-10] (Banner is built as an Alert layout), circular Progress [built 2026-10-13 as Spinner `value`], live notification queue, DataGrid and TreeGrid.
  DataGrid needs editing, resizing, selection and virtualization contracts beyond Table.
- **Content and advanced tools:** image/media preview, Carousel, rich text and code-editor
  integrations, charts, gradient editor, easing/curve editor and shortcut recorder.
  Prefer adapters to mature editing/chart engines over a superficial native reimplementation.

### Gap audit, 2026-09-26

[The audit](research/component-gap-audit.md) compared Area with 13 catalogues (Untitled UI,
shadcn, React Aria, Radix, Base UI, Fluent 2, Primer, Carbon, Mantine, MUI, Ant Design,
Chakra/Ark, Spectrum 2) across about 95 component jobs. Status as of 2026-09-26; items
built since are noted in brackets.

- **Missing, shipped by 8 or more systems:** Combobox/Autocomplete (11) [built], Accordion (10) [built 2026-10-02 as Disclosure, renamed Accordion / AccordionItem 2026-10-07, in review],
  the date family (10; Calendar now built), Link (8) [built 2026-10-08, in review], Pagination (8) [built 2026-10-08, in review], Drawer/Sheet (8).
- **Partial:** custom Select (all 13 ship a listbox popup; Area's is native), overlay
  behavior for Popover, Tooltip, Menu and Dialog [built 2026-09-27], DataGrid, multi-select/tags, Toast queue, range Slider in Slider's API [SliderRange built].
- **Recommended order** (owner chooses): overlay behavior → custom Select → Combobox with a
  tag mode → Menu keyboard, submenus, ContextMenu and CommandPalette → ColorPicker paints →
  Disclosure/Accordion → DatePicker family → Resizable and ScrollArea → Drawer and
  AlertDialog → chat message primitives → FileUpload [built 2026-10-09] → HoverCard and Toggletip [built 2026-10-09].
  Next tier: Link and Pagination [built 2026-10-08], EmptyState, Toggle group, DescriptionList and Meter [built 2026-10-10];
  editable inline text waits for product captures of its edit mode.
### Count and Banner, from the 2026-09-27 survey (built 2026-09-28, Complete)

[Survey](research/split-count-banner-survey.md):
- **Count — built** ([spec](specs/count.md)): counts next to a label (Nav, Tabs, Segmented, filter chips) become their own small
  element, not a Badge: 16 / 20 tall, 12px tabular numerals, pill, `soft` or `plain`, following
  the owner row's selected and hover paint, sharing Indicator's number formatting (99+). Six
  systems separate it (Primer CounterLabel, Atlassian, Carbon, Ant, Spectrum, shadcn). The Nav
  and Tabs demos now use Count. Plain is the default (Notion); the ink stays fixed on the owner's
  current row.
- **Banner — built** ([Alert spec](specs/alert.md#banner-2026-09-28)): a page or section announcement (OpenAI business and Daybreak banners) is an Alert
  layout (`layout="banner"`: section width, one line, action or status at the end), not a new
  component and not a Toast (Primer Banner, Fluent MessageBar, Polaris, Ant Alert `banner`).
  Built with OpenAI's 12 / 16 inset and 6 corners, plus `flush`. A bold, promotional fill waits
  for an owner request.

### Product-specific components (ChatGPT, Notion, Figma), 2026-09-26

Components the three target products use that neither the inventory above nor a generic
catalogue names. Each would be measured in its product like every other component.

- **Foundations that unlock several of these:** Combobox (Figma's font picker, ChatGPT's
  model picker, Notion's select property; filtering, async results, free text),
  CommandPalette (Notion's slash menu and ⌘K search, Figma's quick actions; built on
  Combobox + Menu), ContextMenu (right-click in all three; Menu at the pointer), HoverCard
  (Notion's page peek, link previews).
- **Conversation (ChatGPT):** Message (user bubble and assistant prose, streaming state),
  MessageActions (copy, thumbs, regenerate, shown on hover), ThinkingDisclosure (collapsible
  reasoning with a live timer), SourceChip / citation pill [built 2026-10-10 as Citation], AttachmentCard (file in the
  composer, with upload progress and remove), PromptSuggestions (starter chips), ModelPicker
  (a Menu recipe with descriptions and a check), ScrollToLatest (floating round button),
  VoiceInput (record button and waveform).
- **Documents (Notion):** EmojiPicker / IconPicker (page icons; search, categories, skin
  tone, recent), Callout (icon + tinted block), ToggleBlock (disclosure in running text),
  TagPicker / multi-select property (coloured option tags, create-on-type), PeoplePicker
  (avatars, search, invite), Reactions (emoji counts, add), CommentThread, InlineEditableTitle,
  FloatingFormatBar (selection toolbar), DatabaseCard (board card with properties; built 2026-10-10 as Board),
  PropertyValue (the typed value cell: date, select, person, checkbox, URL).
- **Design tools (Figma):** ColorArea and ColorSlider (the picker's parts), GradientEditor
  (stops on a track), EyedropperButton, ScrubbableAngle (dial), EasingCurveEditor,
  ShortcutRecorder, ZoomControl (percentage menu with fit and 100%; built 2026-10-10), LayerRow badges
  (component, instance, mask markers), ConstraintsPicker (pin to edges; multi-select, unlike
  AlignmentPicker), UnitField (px / % / auto switch inside a NumberField), FontPicker
  (Combobox with previews and weight axis), VariableChip (a bound token in a field, detach
  on hover).
- **Shared and small:** SearchField (clear, shortcut hint; built 2026-10-10), EmptyState (built 2026-10-10), KeyboardShortcut
  overlay (a sheet of Kbd groups; built 2026-10-10 as Shortcut list), Pagination, Stepper [built 2026-10-13], Meter, circular Progress [built 2026-10-13 as Spinner `value`], ScrollArea (built 2026-10-09),
  Splitter (two resizable regions), Sheet / Drawer, Banner, Stat, DescriptionList,
  DateField / Calendar / DatePicker.

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

- **From Wikipedia (en.wikipedia.org/wiki/Lisa_Su, 2026-10-17), built the same day, in review:** Reference list,
  Table of contents (Nav marker rows that follow the scroll), Figure, Infobox, Inline list, Abbreviation, Hatnote,
  Link groups (specs in `specs/`). Not built: a Section heading "edit" action (its actions may cover it), and a manual
  toggle for the Table of contents' sections (it collapses automatically). Already covered: Link (now with hued
  inks), Citation `footnote`, Tabs, Menu, Combobox and Search field, Table, Hover card.

## Useful variants

Each family exposes the dimensions it actually needs:

- **Treatment:** persistent visual emphasis such as solid, soft, outline, ghost or plain.
- **Tone:** neutral and semantic meanings; supported values come from its manifest. Accent
  is not a tone: it reaches components through the action and selection emphasis roles
  (owner, 2026-09-29; [design system](DESIGN_SYSTEM.md#color-and-focus)).
- **Size:** named tiers appropriate to the component, not a forced five-size template.
- **State:** selected, disabled, loading, invalid, expanded and other runtime facts.
- **Layout:** orientation, wrapping, alignment and explicit full width.
- **Composition:** icons, descriptions, affixes, counts, actions, media and grouped items.

Offer broad useful coverage without multiplying aliases or making every component expose
unrelated controls. Shared light/dark and compact/default settings are not variants.
Gallery names use lowerCamelCase segments: `soft-accent`, `dotOutline-accent`,
`state-queued`, `size-md`, `group-inline`, `composition-tableStatus`.
One tile shows one specimen; genuine groups may contain multiple items, but every size gets its own tile (owner, 2026-09-27).
Long text, RTL and enlargement are verification cases, not public variants.

## Build workflow

[Building a component](COMPONENT_ADAPTATION.md) is the canonical process for new
components and refinements: measured evidence from reference products and design systems,
a spec sheet, explicit slot ownership, a visual pass against ChatGPT, Notion and Figma,
then owner review. Small fixes reuse an existing spec and re-measure only what changes.

## Known gaps

- **Chart** (2026-10-17): Area has no chart component. The Examples tab's analytics dashboard draws its line chart as
  an SVG in Area's tokens (accent line and wash, edge gridlines, muted labels); a Chart family would replace it.

Prioritize form correctness, composite-widget keyboard/focus behavior, motion-0
behavior and theme resilience as families are touched. Before a release, verify
cross-browser, forced-colors, assistive-technology and consumer integration behavior;
automated token checks alone do not establish those results. See
[Development](DEVELOPMENT.md).
