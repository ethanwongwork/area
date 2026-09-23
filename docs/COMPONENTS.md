# Components

Area should cover a wide range of product interfaces without requiring each product to
invent its own controls. Expand the component and variant catalogue while keeping shared
tokens, predictable APIs, accessibility and visual quality consistent.

## What is complete

**Badge, Button, Checkbox, Field, Input, Slider, Card, Avatar, Alert and Chip** are owner-confirmed complete as of
2026-09-21.
The remaining existing families are **in review** after component refinement; only
owner confirmation moves them to complete. Historical audits and passing builds do not
confer approval.

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
gallery separates compact rows, stripes and optional columnDividers; its tiles are 2×2.
Stripes use bg-stripe (neutral 25 in light mode, 800 in dark). Headers align vertically
to the middle. Sorting and selection are composed with native
headers, buttons and Checkbox in the live gallery, rather than a data-grid API. Tabs
supports three sizes, both orientations and automatic/manual keyboard activation.
Its default rounded underline excludes the tab's horizontal padding; track optionally
adds a divider. Tab gallery tiles are 2×1. Vertical orientation remains useful for
settings views and uses the corresponding vertical keyboard navigation.
Textarea keeps native resizing and validation with horizontally larger insets at every
size. Toast supports titles, actions and dismissal; it is a surface, not a global queue
or automatic timer. Toasts use 8px vertical/12px horizontal insets; icons align to the
first text line, and multiline is demonstrated separately from tone. Consumers own
placement, lifetime and dismissal focus restoration. Tooltip arrows use 8px geometry,
with all four sides demonstrated. Skeleton cards have two text lines; type samples
share the trailing half of the tile.

These refinements draw on [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/),
[Carbon Table](https://carbondesignsystem.com/components/data-table/usage/),
[Spectrum Toast](https://react-spectrum.adobe.com/v3/Toast.html) and
[Atlassian Textarea](https://atlassian.design/components/textarea/usage).
Area keeps its own type, spacing and control tokens rather than copying their dimensions.

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

Dialog uses a single 16px outer inset (including border), 16px between header/body/footer,
8px between title and description, 16/24px title and medium UI body type. All sections
share a leading edge and the container radius follows the system radius axis.
Select's enhanced native picker opens below with a 4px gap and no above-input fallback;
unsupported browsers retain their platform-native picker placement. Segmented iconOnly
keeps option labels accessible while using square inner buttons.

## Expansion inventory

This is a menu of useful future work, not a promise that every item already exists or a
mandatory sequence. Pick a coherent family and its useful variants for each task.

- Actions: link, icon button, button group, split button, toggle button/group.
- Text entry: documented number input with Area steppers, search, password, input group,
  combobox/autocomplete, multi-select, editable text and file upload.
- Choice/value: range slider, marks, paired numeric input, rating, choice cards,
  nine-point alignment picker for two-dimensional layout alignment.
- Date/time: date picker, date range, calendar, time picker.
- Navigation: breadcrumbs, pagination, stepper, tree, command menu, context menu, menubar.
- Identity/labels: avatar group, persona, tag, counter badge and standalone status dot.
- Feedback: banner, inline message, loading dots, circular progress, gauge/meter,
  empty state and error state.
- Surfaces: accordion, drawer/sheet, alert dialog, hover card and teaching popover.
- Data: list, description list, stat, timeline, tree table and data grid.
- Content/tools: code snippet, color picker with a separately editable opacity value and
  rich-text editor.
- Composition: toolbar, page header, form layouts, search/filter bars and application shells.

Keep behavioral boundaries clear: Select differs from Combobox; Badge from selectable
Chip; Tooltip from interactive Popover; Table from DataGrid. Add a public primitive when
it has an independent reusable job. Otherwise document a composition.

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

Other existing families need refinement and owner review. Prioritize form correctness,
composite-widget keyboard/focus behavior, motion-none behavior and theme resilience as
those families are touched. Before a release, verify cross-browser, forced-colors,
assistive-technology and consumer integration behavior; automated token checks alone do
not establish those results. See [Development](DEVELOPMENT.md).
