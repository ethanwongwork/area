# Components

What the library holds, what could come next, and the boundaries between look-alike jobs.
Status is not recorded here: the owner-confirmed registry,
[`component-status.mjs`](../apps/desktop/src/content/component-status.mjs), is the only
record. The manifest and React exports are authoritative for API, and the app shows every
specimen. How to decide whether something new belongs is in [Governance](GOVERNANCE.md).

## Library

116 families (2026-10-19). Compound parts follow their family (AccordionItem with
Accordion). Each family has a spec in [`specs/`](specs/README.md) and a Documentation entry
in the app. The groups below match the files in `apps/desktop/src/content/documentation/`.

| Group | Families |
|---|---|
| Actions and choices | Button, Button group, Split button, Toggle group, Toolbar, Copy button, Segmented, Checkbox, Radio, Switch, Slider (and range), Chip, Alignment picker, Zoom control, Kbd, Link |
| Fields and text entry | Field, Input, Input group, Number field, Box field, Textarea, Select (native), Custom select, Combobox, Tag picker, Date picker, Date range picker, Time field, Password field, OTP field, Search field, Editable text, Color field |
| Pickers, colour and inspector parts | Color swatch, Color swatch picker, Color picker, Calendar, List box, Property list, Panel (with `resizable`), Box model, Token row, Asset row, Preview frame, File upload, Scroll area |
| Navigation, menus and overlays | Nav, Tabs, Breadcrumb, Pagination, Stepper, Tree view, Menu, Context menu, Command palette, Popover, Hover card, Tooltip, Toggletip, Dialog, Confirm dialog, Drawer |
| Status, feedback and labels | Badge, Badge group, Count, Indicator (with Presence), Avatar, Tag, Alert (with the banner layout), Toast, Progress, Spinner, Skeleton, Meter, Empty state, Separator, Code, Code block, Shortcut list |
| Surfaces, content, files, articles and media | Surface, Stack, Card, Table, Description list, Timeline, Board, Accordion, Asset card, Folder, File page, File tile, Video player, Figure, Infobox, Inline list, Abbreviation, Hatnote, Link groups, Reference list, Table of contents, Titlebar, Section heading |
| Conversation and agent chat | Message, Composer, Composer menu, Attachment, Queue, Prompt suggestions, Model picker, Scroll to latest, Citation, Timestamp, Step, Edit summary, Approval, Plan, Turn notice |

Token is deprecated in favour of `<Code swatch>` and still exported so existing markup
renders ([Governance › Lifecycle](GOVERNANCE.md#6-lifecycle)).

**Partial behaviour is stated, never implied.** A menu-shaped surface does not implement
keyboard navigation by looking like a menu, and a visual table is not a data-grid engine.
Each family's spec and Documentation entry say what it does not do.

## Boundaries

Look-alikes with different jobs. Keep them apart, and count jobs and behaviours, not
silhouettes, when judging coverage.

| These | Differ by |
|---|---|
| Badge · Tag · Chip · Count · Indicator | Badge labels status or metadata; Tag is a label colour on content; Chip is chosen or removed; Count quantifies its owner; Indicator signals on a corner |
| Select · Custom select · Combobox · Tag picker | Native picker; styled listbox; a field that filters; a field that collects several values |
| Tooltip · Toggletip · Popover · Hover card | A name on hover or focus; a note pinned by a press; an interactive surface; a preview on rest |
| Dialog · Confirm dialog · Drawer · Command palette | A modal task; one decision; a side sheet; a search-first modal list |
| Menu · Context menu · Command palette | A list of commands from a trigger; at the pointer; filtered by typing |
| Alert · Toast · Empty state | In-flow message; transient notification; a region with nothing in it |
| Progress · Meter · Spinner · Skeleton | Task progress; a value in a range; indeterminate wait; loading placeholder |
| Code · Code block · Kbd | Inline identifier; a block of source; a key chord |
| Table · Description list · (DataGrid) | Rows of data; labelled values; editing, resizing and virtualization (not built) |
| Button · Link | An action; a place |
| Segmented · Tabs · Toggle group | One value of a set; panels; any number pressed |

## Candidates

Proposed, not built. The owner chooses what is built next; this is an inventory, not an
order of work. Each candidate needs an intake answer ([Governance](GOVERNANCE.md#1-decide-what-kind-of-change-it-is))
before it is built.

| Candidate | Job | Likely answer | Missing |
|---|---|---|---|
| Chart | Lines, bars, areas in Area's tokens | New family | Product captures. The Testing tab's dashboard draws its chart as an SVG meanwhile |
| Action tile | An action with its icon over its label, in an equal-width grid | Component, or a Card / Toggle group composition | Captures in two more products (seen in Cursor's icon card and Figma's new-file tiles) |
| DataGrid, TreeGrid | Editable, resizable, virtualized rows | New family on Table | Editing, selection and virtualization contracts |
| Splitter | Two resizable regions | Layout component | Captures; Panel `resizable` covers one edge today |
| Date field, duration input | Segmented date entry; a duration | Fields on Time field's segments | Product captures |
| Form validation summary | Errors gathered for a form | Composition of Alert + Link | Behaviour contract |
| Menu bar | Application menus in a bar | New component on Menu | Keyboard contract; a target product that uses one |
| Tree select, Cascader, Transfer list | Hierarchical and two-list choice | Compositions on Tree view, List box | Real uses in the target products |
| Rating, drag handle, reorder | Small interactive parts | Parts of existing families | Real uses |
| Stat, Result / error state | A key figure; an outcome page | Compositions (Card, Empty state) | Product captures |
| File explorer, next | Multi-select, rename, File row, file-type icons | Extensions of File tile and Table | Owner's go-ahead ([research](research/file-explorer-2026-10-18/)) |
| Color picker, next | Gradient stops, image paints, blend mode, library colours, popover trigger | Extensions of Color picker | Figma captures |
| Notion parts | Emoji / icon picker, Callout, Toggle block, People picker, Reactions, Comment thread, Floating format bar, Property value | Mixed: several are compositions | Captures per part |
| Figma parts | Gradient editor, Angle dial, Easing curve editor, Shortcut recorder, Layer row badges, Constraints picker, Unit field, Font picker, Variable chip | Mixed: Unit field is a Number field option; Font picker a Combobox | Captures per part |
| Chat, next | Voice input; a labelled date divider (would change Separator); Markdown as an Area component | Mixed | Owner's call on each |
| Content tools | Carousel, rich text, code editor, gradient and easing editors | Adapters to mature engines, not reimplementations | Owner's go-ahead |

Built since the 2026-09-26 [gap audit](research/component-gap-audit.md) of 13 catalogues:

- Combobox and Custom select;
- Accordion, Drawer, Link and Pagination;
- the date family (Calendar, Date and Date range pickers, Time field);
- Toast queue, Hover card, Toggletip and Scroll area;
- Empty state, Toggle group, Description list, Meter and Timeline.

Breadth references for future candidates: [Carbon](https://carbondesignsystem.com/components/overview/components/),
[Primer](https://primer.style/product/components/), [shadcn/ui](https://ui.shadcn.com/docs/components),
[Material UI](https://mui.com/material-ui/all-components/), [Ant Design](https://ant.design/components/overview/).
Their names are research inputs, not a reason to add aliases.

## Priorities when touching a family

Prioritize:

- form correctness;
- composite-widget keyboard and focus;
- Motion 0 behaviour;
- resilience at every setting's extremes.

Before a release, verify cross-browser, forced colours, assistive technology and consumer
integration; automated token checks alone do not establish them ([Development](DEVELOPMENT.md#release-boundary)).
