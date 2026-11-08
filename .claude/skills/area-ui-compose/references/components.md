# Area components by region

Which Area component builds each part of a screen. Use the component; never rebuild its job from divs and app CSS
(PRODUCT_UI.md rule 13). A part with no component is listed under **Gaps**: compose it from the parts named there, and
record it in `docs/PRODUCT_UI.md` › Open component gaps when a product needs it twice.

Every family's usage (when to use something else, do and don't) is its Documentation entry,
`apps/desktop/src/content/documentation/<family>.mjs`; its values are `docs/specs/<slug>.md`.

## Shell and chrome

| Part | Area component | Notes |
|---|---|---|
| Window top bar | `Titlebar` (`ruled`, `plain`, `floating`; `windowControls="macos"`) | Panel's bar height; the drag region of a frameless window; controls are `control-sm` one cluster space apart |
| Tabs in a bar | `Nav orientation="horizontal"` (places), `Tabs` (views of one thing), `Segmented` (2–5 modes) | Tabs switch content in place; Nav goes somewhere |
| Search in a bar | `SearchField`, or a `CommandPalette` trigger with its `Kbd` | |
| Icon actions in a bar | `Button iconOnly variant="ghost" size="sm"` in a `Tooltip` with its `Kbd` | Rule 4; toggles swap outline → filled and set `aria-pressed` (rule 6) |
| Nav panel (sidebar) | `Nav` (vertical; groups, `Count`, `revealActions`), `TreeView` for a hierarchy, inside `Panel` | Rows are `ui-row`; pin and count share one place (rule 8) |
| Panel resize | `Panel resizable` (one edge, min / max) | A two-region splitter is a gap (below) |
| Side panel, inspector | `Panel` + `PanelSection` + `PanelRow` + `PanelStack`; `PreviewFrame` at its head | Rows are `Field orientation="horizontal"` with controls |
| Account or footer row of a sidebar | `Avatar` + text in a `Nav` item or a `Menu` trigger | |
| Status bar, footer bar | `Toolbar` (roving focus) or a plain row of ghost `Button`s and `Badge`s | |
| Scrolling region | `ScrollArea` | One scroller per region; bars stay fixed outside it |

## Headers and titles

| Part | Area component | Notes |
|---|---|---|
| Section of a page or feed | `SectionHeading` (title + lede) over one block | The app's `CanvasSection` adds the feed spacing |
| Page title | Typography's title roles (`text-xl` … `text-3xl`) on a heading element | One per page |
| Where you are | `Breadcrumb` | |
| A count beside a title | muted tabular text; at a row's end, `Count` | Rule 9 |
| Help next to a label | `Toggletip` | |
| Notes at the top of an article | `Hatnote` | |

## Content

| Part | Area component | Notes |
|---|---|---|
| Regions a screen is built from | `Surface` (`surface`, `soft`, `plain`; sm / md / lg) | Corner, layer and edge follow the parent |
| Spacing between children | `Stack` (`related`, `group`, `section`; `spread`, `wrap`) | Never wider than the Surface's inset |
| A content item with media, text and actions | `Card` (+ `CardMedia`, `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter`, `CardList`, `CardLink`, `CardOverlay`, `CardAction`) | |
| A row of items to scroll sideways inside a card | `CardCarousel` | 3.25 visible, 8 apart, 1:1 media |
| A grid to browse, choose from and open | `AssetGrid` (grid · waterfall), `FileGrid`, `ListBox` grid layout | One Tab stop, arrows in two dimensions (rule 5) |
| Columns of items by status | `Board`, `BoardColumn`, `BoardCard` | |
| Rows of data | `Table` (`flush`, `baseline`), `TableCell`, `TableLink`, `Pagination` | Facts go in tables (rule 17) |
| Data over time, parts of a whole, a headline figure | `Chart` (`kind` bar, line, area, donut; `stacked`; `size`), `ChartNumber` (figure, change, what it is against) | Title it in its `Card`; series take the series colors by place; the hidden table and `tableToggle` carry the values |
| Labelled values | `DescriptionList`, `PropertyList`, `Infobox` | |
| An image or media with a caption | `Figure`, `FileImage`, `VideoPlayer` | |
| A summary of a subject | `Infobox` | |
| On this page | `TableOfContents` | |
| Events in order, progress through steps | `Timeline`, `Stepper` | |
| Code | `CodeBlock`, `Code`, `Diff` | |
| Nothing to show | `EmptyState` | One per region, naming the query (rule 10) |
| Loading | `Skeleton`, `Spinner`, `Progress` | |
| Links at a page's foot | `LinkGroups`, `InlineList` | |
| Status in place | `Alert` (banner layout for a whole region), `Badge`, `Tag` | |

## Conversation

| Part | Area component |
|---|---|
| A turn | `Message`, `MessageActions`, `Citation`, `ReferenceList` |
| Composer (the thread's footer) | `Composer`, `ComposerMenu`, `ModelPicker`, `Attachment`, `FileUpload` |
| Empty thread | `PromptSuggestions` over the composer |
| Agent work | `Plan`, `Queue`, `Approval`, `Reasoning`, `EditSummary`, `TurnNotice` |
| Back to the newest | `ScrollToLatest` |

## Floating layers

| Part | Area component | Notes |
|---|---|---|
| A list of commands | `Menu`, `ContextMenu`, `SplitButton` | |
| Rich content beside its trigger | `Popover` (+ header, body, footer, media, step) | |
| A preview on hover | `HoverCard` | |
| A name on hover | `Tooltip` | |
| A task that needs an answer | `Dialog`, `ConfirmDialog` | |
| A task beside the page | `Drawer` | Slides from an edge |
| Search everything | `CommandPalette` | |
| An outcome | `Toaster` + `Toast` | |

## Gaps

No component yet. Compose from the parts named, with app classes for layout only.

| Need | Compose from | Candidate |
|---|---|---|
| The app frame: top bar, nav panel, content, side panel | CSS grid with `Titlebar`, two `Panel`s and a `ScrollArea` main | An app-shell layout (`docs/COMPONENTS.md` candidates) |
| A layer container: the content region raised on the chrome ground | `Surface` on the window's recessed ground, one inset from the panels | A `Surface` use or an app-shell option; see `shell.md` |
| A page-level grid of cards | CSS grid `repeat(auto-fill, minmax(<min>, 1fr))` with the gap from `spacing.md`, holding `Card`s | Grid (Stack's spec leaves 2-D layout to CSS) |
| A page-level shelf (carousel) of cards | a horizontal scroller of `Card`s with previous / next ghost Buttons | Carousel ("Content tools" candidate) |
| A two-region splitter | two `Panel`s, one `resizable` | Splitter (candidate) |
| A page footer | `LinkGroups` + `InlineList` + `Separator` | |
