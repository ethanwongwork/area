# Screen recipes

Starting layouts for common screens: the regions, the components in each, and the values that matter. Adapt, don't
copy: the job decides. Region rules are `shell.md`, content rules `content.md`, spacing `spacing.md`. "Ref" names the
product that owns the context and the research file with its numbers (`docs/research/ui-patterns-2026-10-22/`).
`docs/research/app-screens-2026-10-21.md` has 20 screens already recreated with Area for the Theme setup.

## Chat

Ref: ChatGPT (`chatgpt-desktop.md`).

| Region | Components | Values |
|---|---|---|
| Shell | layered: the content layer on the chrome ground | layer 4 off the end and bottom, under the top strip |
| Nav panel | `Nav` (new chat, search, sections of conversations), account row at the foot | 240–340; rows 30; groups 16 apart |
| Header | model picker (`ModelPicker`), share, more | 46, no rule at rest |
| Thread | `Message` per turn, `MessageActions` under assistant turns | 768 + 16 a side; turns 16 apart; user bubble ≤ 70% |
| Empty | greeting (page title), `PromptSuggestions` | greeting about 32 above the composer, centred |
| Footer | `Composer` floating over the thread, `ScrollToLatest` | 16 above the bottom, the thread's width |
| Side panel | document or code beside the thread | 320 minimum, ~600 default, thread keeps 352 |

## Document

Ref: Notion (`notion.md`).

| Region | Components | Values |
|---|---|---|
| Top bar | `Breadcrumb`, share and more as ghost `Button`s | 44, no rule |
| Header | cover (`Figure`), icon, page title, properties (`DescriptionList`/`PropertyList`) | cover ⅓ of the height; title 12 under the icon; properties 8 under the title |
| Body | blocks in a reading column: text, headings, `Figure`, `CodeBlock`, `Alert` (callout), `Table`, `Accordion` (toggle) | 708 column; paragraphs 16 apart; headings carry their space above |
| Aside | `TableOfContents` (long pages), comments | sticky |

## Database or list of records

Ref: Notion, Linear-style lists (`notion.md`, `app-screens-2026-10-21.md`).

| Region | Components | Values |
|---|---|---|
| Header | page title, one view row: `Tabs` (or pill views) at the start, filter / sort / search icon `Button`s and the primary action at the end | 40 row; icon buttons abut |
| Body | `Table` (records), `Board` (by status), `AssetGrid` (gallery), `Calendar` | spans the region; content starts on the page's text edge |
| Detail | side peek (`Panel` docked, or `Drawer`) or center peek (`Dialog`) | side: half the window, page reflows, no scrim; center: ≤ 960, 72 from the edges |
| Empty | `EmptyState` naming the filter | one per view |

## Board

Ref: Notion (`notion.md`), `docs/specs/board.md`. `Board` + `BoardColumn` + `BoardCard`; columns fixed width (276 at
Notion's scale), 12 apart, scrolling sideways; group headers with a count; an add row at each column's foot.

## Editor with inspector (canvas tool)

Ref: Figma (`cursor-figma.md`).

| Region | Components | Values |
|---|---|---|
| Top bar | `Titlebar`, file tabs or file name, share | one bar height for the window |
| Left panel | `Panel` with pages and layers (`TreeView`) | 240 (240–443); rows 32 pitch, plate 24 inset 8; indent 16 |
| Canvas | full bleed; floating `Toolbar` centred 12 from the bottom; `ZoomControl` in a corner | islands 12 off the edges, radius = control + padding |
| Inspector | `Panel`, `PanelSection`, `PanelRow`, `PreviewFrame` at its head, `NumberField`, `ColorField`, `AlignmentPicker`, `BoxField` | 240 (241–500); 48 header with panel tabs; section titles 40; rows 32 with 24 fields |
| Minimized | the panels collapse into islands over the canvas | |

Area's own app is this recipe with a documentation feed as its canvas (`PRODUCT_UI.md`, "The app's layout").

## IDE or agents window

Ref: Cursor (`cursor-figma.md`, `cursor-audit-2026-10-22.md`). Docked: activity rail 48, sidebar `min(300, w/4)` (min
214), editor with 35 tabs, bottom panel ⅓ high, agent panel `min(400, w/2.5)` (min 300), status bar 22. The Agents
window folds the title bar into each part's header row. Area: `Titlebar`, `Panel`, `TreeView`, `Tabs`, `CodeBlock`,
`Diff`, `Composer`, `Toolbar` (status).

## Settings

Ref: ChatGPT desktop, Linear, macOS (`chatgpt-desktop.md`, `layout-primitives-2026-10-20.md`).

| Region | Components | Values |
|---|---|---|
| Nav | the nav panel becomes the settings sections (`Nav`) | |
| Body | a reading column of sections: `SectionHeading`, then a `Surface` group of rows (`Field orientation="horizontal"`, `Switch`, `Select`) | 768 column (672 plain); sections 40 apart; rows ≥ 64 with a description, rules between rows inset |
| Footer | actions only where changes need saving; otherwise a pick applies at once | right-aligned, ruled above |

## Dashboard

Ref: design systems (`design-systems.md`: shadcn dashboard, Polaris Layout).

| Region | Components | Values |
|---|---|---|
| Header | page title, a date range (`DateRangePicker`), filters, one primary action | |
| Stats | a row of `Card`s, each a `ChartNumber` (label, value, change) | 1 → 2 → 4 columns by container width; gap 16–24 |
| Body | a primary column and a secondary column of `Card`s (`Chart`s, `Table`s, `Timeline`) | primary : secondary 2 : 1, secondary 240–320 |
| Empty | `EmptyState` per card | |

## Gallery or library

Ref: Figma Community, Notion gallery, ChatGPT library (`cursor-figma.md`, `notion.md`, `chatgpt-desktop.md`).
A feed of sections, each a heading with "Show all" at its end over a card grid (or a shelf on the home view).
`AssetGrid` / `FileGrid` for collections to open; `Card` with `CardMedia` 16:9 for published items; filters as a `Chip`
row or `Segmented` in the header; search in the top bar. Minimum card width 280–380, gap 12–16 (app) or 24–32 (site).

## Storefront: listing and detail

Ref: Nike, Airbnb (`consumer-feeds.md`, `app-screens-2026-10-21.md`).

| Screen | Regions | Values |
|---|---|---|
| Listing | header; filters column (`Accordion` of `CheckboxGroup`s, `ColorSwatchPicker`); grid of product `Card`s; or a list beside a sticky map (Airbnb) | filters 240; grid 3 columns, 16 gutters (Nike); Airbnb 2 columns, 24 / 40 gaps, map about half the width; text stack in one size, hierarchy by weight and ink |
| Detail | media gallery (thumbnail rail + hero `Figure`, or Airbnb's hero + four tiles); a buy column (title, price, `Radio` card grid for sizes, primary and secondary pill `Button`s, `Accordion` details) | hero 4:5 (Nike); content 1120, columns 7/12 and 4/12, the buy card sticky at 80, sections split by rules (Airbnb) |
| Bag | items column and a summary `Surface` | summary sticky |

## Media home and player

Ref: Spotify, YouTube, Apple (`consumer-feeds.md`).

| Region | Components | Values |
|---|---|---|
| Shell | panels as layers on the window ground (Spotify) or docked (YouTube) | Spotify 8 gutters, radius 8 |
| Nav panel | library `Nav` / list of `AssetRow`s | Spotify 280; YouTube guide 240, a 72 rail from 791 to 1312, hidden below |
| Home | shelves: a section heading with "Show all" and arrows over a row of `Card`s | Spotify cards 1:1, 12 padding, title 16 / subtitle 14, both 2 lines |
| Video grid | `Card` with 16:9 `CardMedia` and a duration `Badge` 8 in | about 330 minimum; 16 / 32 gaps |
| Detail | cover, type label, title, meta, a play `Button`, then a `Table` of tracks | cover 232; rows 56, no dividers; sticky column header |
| Watch | `VideoPlayer` in a primary column (640–1045) with a 396 side column of rows | |
| Footer | a player bar: three zones, 30% / 40% / 30% (sides min 180) | 72 tall |

## Docs or help article

Ref: Notion help centre (`notion.md`). Nav 280 | article 804 | contents 200, gaps 62 and 32, both side columns sticky;
under about 1200 the side columns go and the article stays centred. `Nav`, `Breadcrumb`, `TableOfContents`, `Hatnote`,
`CodeBlock`, `Figure`, `LinkGroups` at the foot.

## Onboarding and setup

Ref: `onboarding-setup-2026-10-21.md` and the app's Theme → Setup (`PRODUCT_UI.md`). A visual of the result on one side,
the choices on the other, one question per step, `Stepper` for the steps, Back / Continue at the panel's foot, a pick
applying at once.

## Mobile

One pane. Top bar 44–56 with the title and at most two actions; a tab bar or a `Drawer` for the nav; content 16–24 from
the edges; shelves instead of grids where a row would be too narrow; dialogs full screen; the primary action a full-
width button at the foot (Notion, Figma, ChatGPT at 390).
