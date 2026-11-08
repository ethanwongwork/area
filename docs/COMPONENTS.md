# Components

What the library holds, what could come next, and the boundaries between look-alike jobs.
Status is not recorded here: the owner-confirmed registry,
[`component-status.mjs`](../apps/desktop/src/content/component-status.mjs), is the only
record. The manifest and React exports are authoritative for API, and the app shows every
specimen. How to decide whether something new belongs is in [Governance](GOVERNANCE.md).

## Library

126 families (2026-11-07). Compound parts follow their family (AccordionItem with
Accordion). Each family has a spec in [`specs/`](specs/README.md) and a Documentation entry
in the app. The groups below match the files in `apps/desktop/src/content/documentation/`.

| Group | Families |
|---|---|
| Actions and choices | Button, Button group, Split button, Toggle group, Toolbar (with the `floating` hover action bar), Selection bar, Filter bar, Copy button, Segmented, Checkbox, Radio, Switch, Slider (and range), Chip, Alignment picker, Zoom control, Kbd, Link |
| Fields and text entry | Field, Setting row (with Settings group), Input, Input group, Number field, Box field, Textarea, Select (native), Custom select, Combobox, Tag picker, Date picker, Date range picker, Time field, Password field, OTP field, Search field, Editable text, Color field |
| Pickers, colour and inspector parts | Color swatch, Color swatch picker, Color picker, Calendar, List box, Property list, Panel (with `resizable`), Splitter, Box model, Token row, Asset row, Preview frame, File upload, Scroll area |
| Navigation, menus and overlays | Nav, Tabs, Breadcrumb, Pagination, Stepper, Tree view, Menu, Context menu, Command palette, Popover, Hover card, Tooltip, Toggletip, Dialog, Confirm dialog, Drawer |
| Status, feedback and labels | Badge, Badge group, Count, Indicator (with Presence), Avatar, Tag, Alert (with the banner layout), Toast, Progress, Spinner, Skeleton, Meter, Empty state, Separator, Code, Code block, Shortcut list |
| Surfaces, content, files, articles and media | Surface, Stack, Card, Table, Description list, Timeline, Board, Accordion, Design card, Asset card, Folder, File page, File tile, Video player, Figure, Inline list, Abbreviation, Hatnote, Link groups, Reference list, Table of contents, Titlebar, Page header, Section heading, Mention, Chart (with ChartNumber) |
| Conversation and agent chat | Message, Composer, Composer menu, Attachment, Queue, Prompt suggestions, Model picker, Scroll to latest, Citation, Timestamp, Step, Edit summary, Approval, Plan, Turn notice |

Token is deprecated in favour of `<Code swatch>` and Preview frame in favour of Asset card's frame alone; each is still
exported so existing markup renders. Infobox was removed (2026-10-26): a subject's summary is a Card with a
Description list ([Governance › Lifecycle](GOVERNANCE.md#6-lifecycle)).

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
| Meter · Chart · Table | One value against its range, or parts of one measure; values compared across rows, drawn (bars, lines, areas, a donut, a number); the values to read, sort and compare exactly (a Chart's table view is a Table) |
| Code · Code block · Kbd | Inline identifier; a block of source; a key chord |
| Table · Description list · (DataGrid) | Rows of data; labelled values; editing, resizing and virtualization (not built) |
| Button · Link | An action; a place |
| Segmented · Tabs · Toggle group | One value of a set; panels; any number pressed |
| Titlebar · Page header · Section heading | The window's bar; a page's own title block, once, with its way back, actions and tabs; a titled block inside a page |
| Toolbar · Selection bar | A view's commands, always there; the actions on what is selected, only while something is |
| Panel rows · Setting row · Field | Edit what is selected; a page of preferences that apply on their own, with a modified mark and Reset; a form's control, submitted |
| Chip · Filter bar | A chip that toggles or is removed; a view's filters, each chip opening its editor, with Add filter and Reset |
| Link · Mention · Chip (input) · Attachment | A place, in words; a person, file, page or date referred to inside text, with its mark; what the next message is about, beside the field; something sent with it |
| Panel `resizable` · Splitter | A side panel's own edge, sized against the page; one area divided between two regions by a handle |
| Toolbar · Toolbar `floating` · Selection bar | A view's commands, always there; one row's or block's few actions, shown while it is hovered or holds focus; the actions on what is selected |

## Candidates

Proposed, not built. The owner chooses what is built next; this is an inventory, not an
order of work. Each candidate needs an intake answer ([Governance](GOVERNANCE.md#1-decide-what-kind-of-change-it-is))
before it is built.

| Candidate | Job | Likely answer | Missing |
|---|---|---|---|
| Tab groups | Named or split groups of open tabs (Chrome's groups, Figma's split and pinned tabs) | Desktop app shell, not a component yet | Many open tabs in real use: wait for Projects (Phase 4) or a split view (owner's question, 2026-10-29) |
| Action tile | An action with its icon over its label, in an equal-width grid | Component, or a Card / Toggle group composition | Captures in two more products (seen in Cursor's icon card and Figma's new-file tiles) |
| DataGrid, TreeGrid | Editable, resizable, virtualized rows | New family on Table | Editing, selection and virtualization contracts |
| Date field, duration input | Segmented date entry; a duration | Fields on Time field's segments | Product captures |
| Form validation summary | Errors gathered for a form | Composition of Alert + Link | Behaviour contract |
| Menu bar | Application menus in a bar | New component on Menu | Keyboard contract; a target product that uses one |
| Tree select, Cascader, Transfer list | Hierarchical and two-list choice | Compositions on Tree view, List box | Real uses in the target products |
| Media scrubber | Seeking through audio or video time: the time under the pointer, chapter marks, live streams with no end, elapsed and remaining time | New component on Slider (Slider's `buffered` covers the loaded stretch, 2026-10-21); Video player's seek range would move onto it | A real use in ChatGPT, Notion, Figma or Cursor (an audio or video block); Media Chrome's and Vidstack's time ranges read at a pinned commit |
| Text and highlight swatches | Pick a text or highlight colour, each swatch an "A" in its ink or on its fill | A sample option on Color swatch picker (`sample: "fill" \| "text" \| "highlight"`) | Notion's colour menu captured; the owner's Format panel (2026-10-21) |
| Selected-label Segmented | A switcher whose options show icons, the selected one its label too ("⊕ Insert") | A Segmented option | Two more products or systems using it (one sighting: the owner's Insert / Format / Actions panel, 2026-10-21) |
| Editable box model | Edit padding and margin on the drawing itself, values in badges around a box | An `editable` option on Box model (read-only today) | Webflow and Chrome DevTools captures; the keyboard contract for the inline fields |
| Formatted entry (input mask) | Type into a fixed pattern: a card number in groups of four with its brand, a phone number, an IBAN | An Input option or a new field on Input's shell | Masking libraries' behaviour (caret, paste, deletion); Stripe and Shopify checkout captures (owner 2026-10-21: general purpose, wanted) |
| Gradient fill | A Slider or Progress fill that deepens along its length (the Intensity reference's light-to-strong accent) | A fill option or a setting | Owner's call on where gradients belong in Area, which paints flat fills today (owner 2026-10-21: may want it) |
| Compositions from the 2026-10-21 references | Password with a strength Meter; Phone number (Input group + a country Custom select); Figma's W / H row with the proportion lock; floating Toolbar pills (Add · Type · 50 ▾ · more) | Demo tiles, no new parts | Owner's go-ahead |
| Rating, drag handle, reorder | Small interactive parts | Parts of existing families | Real uses |
| Stat, Result / error state | A key figure; an outcome page | Compositions (Card, Empty state) | Product captures |
| File explorer, next | Multi-select, rename, File row, file-type icons | Extensions of File tile and Table | Owner's go-ahead ([research](research/file-explorer-2026-10-18/)) |
| Color picker, next | Gradient stops, image paints, blend mode, library colours, popover trigger | Extensions of Color picker | Figma captures |
| Notion parts | Emoji / icon picker, Callout, Toggle block, People picker, Reactions, Comment thread, Floating format bar, Property value | Mixed: several are compositions | Captures per part |
| Figma parts | Gradient editor, Angle dial, Easing curve editor, Shortcut recorder, Layer row badges, Constraints picker, Unit field, Font picker, Variable chip | Mixed: Unit field is a Number field option; Font picker a Combobox | Captures per part |
| Chat, next | Voice input; a labelled date divider (would change Separator); Markdown as an Area component | Mixed | Owner's call on each |
| Stack divider | A rule between a Stack's children (MUI `divider`, Chakra `separator`, Atlassian Inline `separator`) | A Stack option, or Separator in a Stack | A screen that needs it; lists and settings groups draw their own seams ([research](research/layout-primitives-2026-10-20.md)) |
| Content tools | Carousel, rich text, code editor, gradient and easing editors | Adapters to mature engines, not reimplementations | Owner's go-ahead |
| App-shell layout | A window's regions (top bar, nav panel, content, side panel, dock) with their default, minimum and maximum sizes, the collapse order, and a `layered` option: the content as one raised layer on the chrome ground (ChatGPT desktop's `PageSurfaceLayout`, shadcn `inset`) | Layout component on Titlebar, Panel and Surface (Mantine AppShell, Atlassian page layout, shadcn Sidebar) | Owner's go-ahead; the layer's inset and corner as owner picks; ChatGPT desktop measured live ([research](research/ui-patterns-2026-10-22/)) |
| Grid | A page-level grid of cards whose columns come from a minimum card width and the container's width, gap by role | Layout component beside Stack (Mantine SimpleGrid, Polaris Grid); Stack's spec leaves 2-D layout to CSS today | A second screen that needs it outside Asset grid and File grid ([research](research/ui-patterns-2026-10-22/); `area-ui-compose` › content) |
| Shelf | A page-level row of cards that scrolls sideways under a section heading, with a peek, scroll snap and previous / next controls | A component on Card Carousel's behaviour, or the Carousel content tool | Owner's go-ahead; Spotify, Nike, Airbnb, Apple and Figma Community shelves measured ([research](research/ui-patterns-2026-10-22/)) |
| Tree view, lazy branches | Skeleton rows while a branch loads, an error with Retry, a folder icon that changes when open | Options on Tree view | A screen that loads a tree (audit V8, 2026-11-07; [research](research/components-audit-2026-11-07/)) |
| Document tabs | A dirty dot that becomes the close on hover, pinned tabs, a preview tab in italic, overflow into a More menu | Options on Tabs, with Tab groups above | Many open tabs in real use (audit V12; [research](research/components-audit-2026-11-07/)) |
| Diff, next | Side by side as well as unified, changes within a line, Keep / Undo per change, an "N of M" navigator | Options on Edit summary's diff | A review screen that needs it (audit V14; [research](research/components-audit-2026-11-07/)) |
| Floating outline | Table of contents as a strip of dashes at the page edge that opens to the outline on hover | A `floating` option on Table of contents | A long page in the app (audit V16; [research](research/components-audit-2026-11-07/)) |
| Find bar | Find in a view: match-case and whole-word toggles, "N of M", previous / next, a replace row | New component on Input and Toolbar | A second product beyond the editor and a chat app (audit N8; [research](research/components-audit-2026-11-07/)) |
| Image viewer | An image or a set full screen with zoom, pan and a strip of the others | New component, sharing the design viewer's zoom | A screen with image sets (audit N9; [research](research/components-audit-2026-11-07/)) |
| Calendar and timeline views | Records on a month of days; records as bars over time with a Today line | New families (Area's Calendar is a date picker, Timeline an event list) | A second source (one product so far; audit N11; [research](research/components-audit-2026-11-07/)) |
| Status bar, notification history | A thin bar of live items at a window's foot; a history of past toasts with Clear all | New components on Toolbar and Toast | A second source (the editor only; audit N12; [research](research/components-audit-2026-11-07/)) |
| Peek | Open a record beside or over the page with a mode switch and previous / next | A Drawer composition with a header | A second source (one product; audit N13; [research](research/components-audit-2026-11-07/)) |

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
