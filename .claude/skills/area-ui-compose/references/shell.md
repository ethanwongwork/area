# Shell: regions, panels, layers, bars

How a window or page divides into regions, how big each is, and how they meet. Evidence:
`docs/research/ui-patterns-2026-10-22/` (`chatgpt-desktop.md`, `cursor-figma.md`, `notion.md`, `consumer-feeds.md`,
`design-systems.md`). Values are CSS px at each product's own scale; Area's app runs at type 13 Compact, so read a
product's value as a proportion of its control height before carrying it over (`docs/research/ui-size-scale-2026-10-12.md`).

## Regions

A screen has at most these, in this order. Leave out what the job doesn't need.

| Region | Job | Area | Measured sizes |
|---|---|---|---|
| Top bar | Window controls, places, search, global actions | `Titlebar` | Cursor 35, Figma tabs 38, ChatGPT strip 44 + toolbar 46, systems 48–64 |
| Nav panel | Where you are and where you can go | `Panel` holding `Nav` / `TreeView` | default 240–340; min 214–240; max 443–520 |
| Content | The work | `ScrollArea`, the content patterns in `content.md` | the rest; keeps a minimum (ChatGPT 352 beside a panel, Cursor 220) |
| Side panel | Acts on or details the selection | `Panel` (inspector), or a second content column | 240–600; min 241–320; max 500 or main − 352 |
| Bottom panel or dock | Composer, terminal, player, status | `Composer`, `Toolbar`, a bar | Cursor status 22, panel ⅓ of the height; ChatGPT composer floats 16 above the bottom |

**Area's app:** Titlebar 39 at type 13 Compact (Panel's bar formula), Sidebar 240 (200–360), Inspector 256 (256–500),
rows 28, every region 14 in (PRODUCT_UI.md, "The app's layout"; `apps/desktop/src/styles/app.css` `.studio`).

### Rules

- **One bar height per window.** Every bar's rule (or its edge) lines up: Figma's panel header and islands are both
  48, Area's Titlebar equals Panel's bar. A bar is a control plus equal air: `control + 2 × air (+ rule)`.
- **A bar's controls sit as far from the side as from the top** (PRODUCT_UI.md, 7 at the app's scale; Figma 8 and 8).
- **Panels have a default, a floor and a ceiling**, and the content keeps a minimum beside them. Defaults scale with
  the window where it varies widely (Cursor `min(300, window / 4)`; ChatGPT's right panel clamps to the shell height
  × 1.6). Dragging under half the floor collapses the panel (ChatGPT).
- **Each panel's toggle sits at its own side** of the top bar (rule 12); `⌘B`-style shortcuts for the nav panel are
  common (shadcn).
- **Collapse order as the window narrows:** side panel first, then the nav panel becomes an overlay (`Drawer`) at
  about 768 (ChatGPT, shadcn, Primer) to 1024 (Atlassian); dialogs go full screen under 768 (ChatGPT). Editing tools
  set a window minimum instead (Figma 900 × 600, ChatGPT 480 × 600) and keep their panels.
- **Pane count:** one on a phone, one or two on a tablet, two on a desktop, three at most (Material 3).

## How regions meet: docked or layered

Pick one per window. The full vocabulary (rule, tone, material, layer, panels, float), where the nav sits and how
its current item is marked are in `treatments.md`.

| Shell | When | How it looks | Evidence |
|---|---|---|---|
| **Docked** | Tools used all day: editors, IDEs, inspectors, admin | Full-height regions, square, one 1px rule or one ground step where they meet | Cursor, Figma's expanded UI (Figma reattached its panels after UI3's beta: floating "cramped the canvas"), Primer, Carbon, Atlassian |
| **Layered** | Content-first apps: chat, documents, media | Chrome on a recessed ground; the content (and the nav panel with it) in one raised, rounded layer held off the window edges | ChatGPT desktop `PageSurfaceLayout`, shadcn `inset`, Spotify's panels |
| **Islands** | Canvas-first focus modes | Small floating plates over a full-bleed canvas | Figma's minimized UI and bottom toolbar |

### The layer container (layered shell)

ChatGPT desktop (B, `chatgpt-desktop.md` › The layer container), shadcn `inset` (S) and Figma islands (M). Spotify
takes it further: every region (library, main, now playing) is its own radius-8 panel on a black ground, 8 apart and 8
from the window, the 8 gutter doubling as the resize handle (`consumer-feeds.md`).

| Property | ChatGPT desktop | shadcn inset | Figma island |
|---|---|---|---|
| Inset from the window | top: under the 44 title strip; end and bottom **4**; start 0 (or the rail) | 8 on the free sides, 0 against the sidebar | 12 every side |
| Corner | 12 (not scaled by its corner setting) | 14 against 10 controls | 13 = control 5 + padding 8 |
| Edge | 0.5 ring at 4% (light) / 6% (dark), no border | none | none |
| Shadow | `0 4 16` at 5% | `shadow-sm` | `0 0 1 .3, 0 1 3 .15` |
| Fill vs ground | light: #fff on #f6f6f6; dark: #181818 on #282828 (the layer is deeper than its ground in dark) | the ground is the sidebar's colour | #fff / #2c2c2c over the canvas |
| The nav panel | inside the layer at 65% of its fill, taking its start corners; a 0.5 divider while docked; the main surface takes all four corners when it collapses | outside, on the ground | — |
| Header rules | none at rest; a 16 fade, then a 1px rule once scrolled | — | — |
| Small windows | — | off under 768 | — |

**In Area** (not yet a component; compose it): the window ground is the chrome's recessed ground (`data-area-chrome`,
`bg-subtle`), the layer is a `Surface` (raised: `bg-surface`, its edge and resting shadow from the Elevation settings),
held off the window by one small step on the free sides and the Titlebar above it. Its corner follows Surface's corner
chain, so a control set into its corner stays concentric. In dark the Layers settings decide which ground is deeper;
never hard-code ChatGPT's inversion. When a product adopts it, record the inset and corner as owner decisions and the
need in `docs/PRODUCT_UI.md` › Open component gaps (an app-shell layout).

### Docked shell

- One edge per boundary: a 1px rule (`border-decorative`, Area's Titlebar `ruled`) **or** a ground step (Area's Sidebar on
  the chrome ground, its seam the Panel's edge), never both (owner, 2026-10-22).
- Bars inside the content (a view bar, the Inspector's bar) carry no rule at rest (Notion's 44 top bar, ChatGPT); a
  rule may appear once the region scrolls under it.
- Resize handles: a 4 (Cursor) to 8 (Figma) hit area across the edge, the line only on hover, a one-way cursor at a
  limit (`Panel resizable`).

## Nav panels

| Property | ChatGPT desktop | Notion | Figma | Cursor | Area app |
|---|---|---|---|---|---|
| Width | 340 (240–520) | rows 254 wide (logged-in capture) | 240 (240–443) | `min(300, w/4)`, min 214 | 240 (200–360) |
| Row | 30, radius 10, 8 in, 24 icon box, gap 8 | 30, radius 6, 14/21 | 32 pitch, 24 plate inset 8, radius 5, text 16 in | 22 tree, Agents 28 | `ui-row` 28 |
| Section label | 13 secondary, 8 above and below | 12/16, faint ink | 40 title rows | 11/700 uppercase (IDE), sentence case elsewhere | rows' size at 500 (Menu-family labels, cursor-audit item 3) |
| Between groups | 16 | | | | |
| Indent per level | | | 16 | 8 | Tree view's |
| Footer | 46 account row, a 40 fade above it | | | | |

Rules: group labels are sentence case and quieter than rows; groups are separated by space, not rules; the account or
settings row is pinned at the foot; current and hover share the row plate ladder (PRODUCT_UI.md rule 3).

## Side panels and inspectors

- **Inspector** (Figma, Area's Panel): 240 default (241–500); a 48 header holding panel tabs; section title rows 40;
  rows 32 with 24 fields; insets 16 start, 8 end; one rule between sections with 16 on both sides. Use `Panel`,
  `PanelSection`, `PanelRow`; Area's app is 256.
- **Detail or document panel** (ChatGPT right panel): 320 minimum, about 600 default, the main content keeping at
  least 352 beside it; its own 40 pane header with the title centred between equal side columns (`1fr auto 1fr`,
  collapsing to `auto 1fr auto` under 900).
- **Peeks: open an item without leaving the list** (Notion). A **side peek** is half the window (720 at 1440, 564 at
  1024), full height, square, with a 44 header of 24 ghost buttons; the page beneath reflows to the rest, with no scrim;
  a 12 resize handle on its leading edge; content padded 76 so the item keeps a page's measure. A **center peek** is at
  most 960 wide, 72 from every viewport edge, radius 12, over a 60% scrim (80% dark), with the page's 708 measure
  inside. In Area: a side peek is a docked `Panel` (or `Drawer` when it overlays), a center peek a `Dialog`.
- **Chat beside work** (Cursor's agent panel): `min(400, window / 2.5)`, min 300; header centred to the composer's
  width (840).
- A side panel's body scrolls; its header and any footer (actions, a composer) stay.

## Floating layers

Elevation belongs to the layer, not the component (Figma elevation 100 → 500; Atlassian: overlay for menus, dialogs,
floating toolbars; Apple: glass only for controls and navigation, never the content layer).

| Layer | Area | Measured |
|---|---|---|
| Menu | `Menu` | ChatGPT radius 16, gutter 4, items 12, min 300; Notion 250–265 wide, radius 10; Figma 13, rows 24, 4 below the trigger, end-aligned; Cursor 6–8 |
| Popover | `Popover` | Figma 240 or 304 wide, 40 header with a rule; Notion 248–456, radius 10–12 |
| Tooltip | `Tooltip` | Figma 24 tall, radius 5, dark in both themes; ChatGPT radius 16, 13/430 |
| Dialog | `Dialog` | ChatGPT 250–450 wide, padding 20, radius 16, a little above centre, full screen under 768; backdrop 30% / 50% |
| Command palette | `CommandPalette` | Cursor `min(62% of window, 580)`, under the top bar, centred |
| Toast | `Toaster` | Cursor bottom end, 3–11 from the edge, above the status bar |
| Floating toolbar | `Toolbar` on a raised plate | Figma 48 tall, centred, 12 from the bottom, radius 13 |
| Corner overlay (zoom, help) | `ZoomControl`, a ghost `Button` | 12 from the corner (Cursor, Figma) |

Rules: a floating layer keeps a fixed offset from what it belongs to (4 from a trigger, 12 from a window corner); its
corner is concentric with its rows (ChatGPT 16 − 4 = 12); one shadow role per layer, from Area's Elevation settings.

## Footers and docks

- **Composer dock:** the thread's footer floats over the scroller, 16 above the region's bottom (ChatGPT desktop; 24
  on the web), centred to the thread's measure; a fade masks the text under it.
- **Status bar:** 22 tall, 12px text, items padded 0 5, the ends 7 from the edge (Cursor). Not every tool has one:
  Figma's bottom edge belongs to its toolbar.
- **Player bar:** see `consumer-feeds.md` (Spotify).
- **Panel footer:** actions pinned at the panel's foot on its surface, with a rule above or a fade.
- **Page footer:** link columns (Figma Community 5 at 1440, 3 at 768, 2 at 390; 32 gaps) under a 1px rule with 48
  above and below; `LinkGroups`.

## Scroll ownership

- One scroller per region. The window never scrolls in an app; a page scrolls only in a site.
- Bars, docks, panel headers and footers sit outside the scroller.
- Show that content runs under a bar with a 16 fade, then a rule once scrolled; no blur (ChatGPT).
- `scrollbar-gutter: stable` on a centred column, so its centre does not jump when the bar appears (ChatGPT's thread).
