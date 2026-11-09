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
| Surfaces, content, files, articles and media | Surface, Stack, Card, Table, Description list, Timeline, Board, Accordion, Design card, Asset card, Folder, File page, File tile, Video player, Figure, Inline list, Abbreviation, Hatnote, Link groups, Reference list, Table of contents, Titlebar, Section heading |
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
| Pill plate tabs | Plate tabs with fully round ends (a notes app's view tabs) | Setting: `tabs` in the Pills set, not a variant | Owner chose plate only, 2026-11-06 (review 7vSwH9XbPa4ywGjZBCHbcp); revisit if a system asks for pill tabs |
| Folder tabs | A selected tab joined to the surface below (browser, old settings windows) | A third Tabs `selection` value | Declined 2026-11-06 (owner: plate only): no measured product uses it; open documents are a horizontal Nav |
| Tab groups | Named or split groups of open tabs (Chrome's groups, Figma's split and pinned tabs) | Desktop app shell, not a component yet | Many open tabs in real use: wait for Projects (Phase 4) or a split view (owner's question, 2026-10-29) |
| Chart | Lines, bars, areas in Area's tokens | New family | Product captures. The Testing tab's dashboard draws its chart as an SVG meanwhile |
| Action tile | An action with its icon over its label, in an equal-width grid | Component, or a Card / Toggle group composition | Captures in two more products (seen in Cursor's icon card and Figma's new-file tiles) |
| DataGrid, TreeGrid | Editable, resizable, virtualized rows | New family on Table | Editing, selection and virtualization contracts |
| Splitter | Two resizable regions | Layout component | Captures; Panel `resizable` covers one edge today |
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
| Selection frame | A chosen thing on a canvas: its outline, eight resize handles (8 drawn, 16 to hit), its size under it, a drop line for reorder, snap guides (the design stage, 2026-11-08) | A component for canvases (image crop, Board, a diagram) beside Zoom control; app-only on the stage meanwhile (`studio-design__handle`, painted with the selection blue, `#0d99ff` / `#0c8ce9`, on white handles) | A second canvas in Area that needs it; the measured editors' values are in [research](research/design-editing-2026-11-08/README.md) (intake 2026-11-08: the stage's tool bar is a composition, Toolbar `surface` + Button `iconOnly` + Tooltip with Kbd + Menu, nothing new) |
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
