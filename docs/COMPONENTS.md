# Components

Area should cover a wide range of product interfaces without requiring each product to
invent its own controls. Expand the component and variant catalogue while keeping shared
tokens, predictable APIs, accessibility and visual quality consistent.

## What is complete

**Badge, Button, Checkbox, Field, Input, Slider, Card, Avatar, Alert and Chip** are owner-confirmed complete as of
2026-09-21.
All other existing families are **unrefined**, including ones with historical audits.
Their code remains available; unrefined means they still need component-level review,
not that every feature is broken or should be rebuilt.

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

## Expansion inventory

This is a menu of useful future work, not a promise that every item already exists or a
mandatory sequence. Pick a coherent family and its useful variants for each task.

- Actions: link, icon button, button group, split button, toggle button/group.
- Text entry: number input, search, password, input group, combobox/autocomplete,
  multi-select, editable text and file upload.
- Choice/value: range slider, marks, paired numeric input, rating, choice cards.
- Date/time: date picker, date range, calendar, time picker.
- Navigation: breadcrumbs, pagination, stepper, tree, command menu, context menu, menubar.
- Identity/labels: avatar group, persona, tag, counter badge and standalone status dot.
- Feedback: banner, inline message, loading dots, circular progress, gauge/meter,
  empty state and error state.
- Surfaces: accordion, drawer/sheet, alert dialog, hover card and teaching popover.
- Data: list, description list, stat, timeline, tree table and data grid.
- Content/tools: code snippet, color picker and rich-text editor.
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
