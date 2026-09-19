# Components

Area should cover a wide range of product interfaces without requiring each product to
invent its own controls. Expand the component and variant catalogue while keeping shared
tokens, predictable APIs, accessibility and visual quality consistent.

## What is complete

Only **Badge, Button and Checkbox** are owner-confirmed complete as of 2026-09-18.
All other existing families are **unrefined**, including ones with historical audits.
Their code remains available; unrefined means they still need component-level review,
not that every feature is broken or should be rebuilt.

The single executable status source is
[`component-status.mjs`](../apps/docs/src/component-status.mjs). Both the gallery and
sidebar read it. Complete labels use green-500; unrefined labels/backgrounds use
red-500/red-25. Explicit words accompany the colors in the gallery.
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

1. Inspect the current CSS, manifest, React wrapper and demos. Identify the user job and
   missing useful variants; avoid rebuilding already working behavior.
2. Resolve uncertain geometry or behavior with existing tokens, rendered measurement,
   platform guidance or a few relevant primary references. Use archived evidence only
   when it answers the question. There is no required number of benchmark systems.
3. Implement the family across CSS, manifest, React and demos. Keep rationale close to
   the code or in a short note here only when future work needs it. A separate report
   is optional, not a completion prerequisite.
4. Verify semantics, keyboard/state behavior, sizes, customization and relevant edge
   cases. Run affected checks and inspect the preview. Say what is still unverified.
5. Present the working result. Mark it complete only after owner acceptance and checks;
   do not turn that final acceptance into a mandatory pre-implementation approval gate.

## Next work and known gaps

Slider was the next requested family before repository cleanup. Its existing native input
needs value/fill synchronization for uncontrolled changes, normalization and form reset.
The earlier sizing proposal is archived and is not approved or binding. Resume from the
current code and this short workflow when component work resumes.

Other existing families need refinement and owner review. Prioritize form correctness,
composite-widget keyboard/focus behavior, motion-none behavior and theme resilience as
those families are touched. Before a release, verify cross-browser, forced-colors,
assistive-technology and consumer integration behavior; automated token checks alone do
not establish those results. See [Development](DEVELOPMENT.md).
