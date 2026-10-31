# Product UI rules

How Area is used to build a product, adopted by the owner on 2026-10-12 from the first product
built only from Area components (the desktop gallery, `apps/desktop`). Evidence and the gap list
are in [research/product-ui-gaps-2026-10-12.md](research/product-ui-gaps-2026-10-12.md). Motion
values are [MOTION.md](MOTION.md)'s; state colours are [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)'s
"Shared state paint".

## Rules

1. **States land at once and leave on `fast`.** Hover, press, selection and focus appear
   instantly; only the leave fades (`--area-transition`: `duration-fast`, 140ms at the default Motion, ease-out). No scale on press, no
   movement on hover, no animated theme or density change.
2. **Hover and press change one thing: the plate, the edge or the lift.** Ink, size and position never
   move. One exception (owner, 2026-10-22): a revealed control may take a trailing annotation's place, such as a
   row's count, while the row is hovered or focused (Nav `revealActions`), as Notion's and ChatGPT's sidebar rows do. Rows change their plate; cards and tiles lift (owner, 2026-10-18: no edge change, a soft shadow that fades in,
   `docs/research/card-hover-2026-10-18.md`), and step their edge only at Elevation 0, where there is no shadow;
   painted things (swatches, ramp steps) change a ring in their own ink.
3. **Each state is one step firmer than the last**: rest → hover → selected → press, and
   selected survives hover. A press is the firmest, momentary step, so every click shows (owner,
   2026-10-16: "make sure the build quality is real"; Notion presses at twice its hover, ChatGPT
   more than twice).
   - Rows (Nav, Menu, Tree view, interactive Table, List box, Pagination): `bg-component-hover` →
     `bg-component-active` selected / current → `bg-component-pressed` held.
   - Tiles and cards (Area's Asset card, `docs/specs/asset-card.md`): no shadow at rest → the lift shadow fading in on
     `fast` (hover) → dropped at once (held) → the edge in `stroke-selected`, one line (selected); the edge
     (`neutral-100`, 750 in dark) stays, and steps to `edge-control-hover` only at Elevation 0 (owner, 2026-10-18). A tile stands alone like a Card, so it is never
     on `border-decorative`, which is for rules inside a surface.
   - Painted (colour cards): their one outline, Color swatch's ring (`token-swatch-ring`, 10%, at stroke-width), steps to the
     card's ink at 24% → 48% held → 2px solid selected. Never a second ring.
4. **Every icon-only control names itself in an Area Tooltip**, never the browser's `title`,
   with its shortcut as `Kbd` when it has one. When the tooltip repeats the accessible name, it
   only shows (`describes={false}`), and the shortcut reaches assistive tech as
   `aria-keyshortcuts`. Menu triggers use `Menu tooltip`; icon-only Segmented options get one
   on their own.
5. **Every collection is keyboard-complete.** Tab reaches it, arrows move inside it (grids move
   in two dimensions), selection follows focus where an Inspector shows the selection, and
   Escape leaves overlays.
6. **Icon-only toggles in chrome swap outline → filled** (a shown panel, a pin) and set
   `aria-pressed`; toggles with a text label use Button's `selected` plate.
7. **Arrangement is a view option, kept per view.** Sort, direction and grouping live in one
   menu in the view's bar, after its filters (rule 14); its rows keep the menu open (`MenuItem keepOpen`), the
   choice persists across launches, and Reset appears only once something changed. The Sidebar
   and the Canvas use the same order. Menus of commands close on a choice.
8. **Pinning is personal and additive.** Pinned items appear in a Pinned group first and stay
   in their own group too; pin from the Inspector heading (a toggle, rule 6), a context menu, or the row's own pin, which takes the count's place while the row is hovered or focused (rule 2's exception; out of the Tab order, so a list keeps one Tab stop a row).
   Only long lists pin (Components 85, Icons 808); a Sidebar of a dozen rows (settings, roles,
   scales) needs no shortcut (owner, 2026-10-12).
9. **Counts:** a count beside a title is muted tabular text; a count at the end of a row is
   `Count`. The Sidebar's All row counts what the tab holds; the Canvas draws no count of its own
   (owner, 2026-10-14: no titles over the Canvas or the Inspector).
10. **Empty results:** the Sidebar keeps All and its groups; the Canvas shows one `EmptyState`
    naming the query. No inline notes in the Sidebar.
11. **Containers and surfaces.** A thing that is a composition (a component specimen, a
    setting's preview, a colour) sits in a container on a grid; a thing that is its own figure
    (an icon, a line of type) sits straight on the surface, where a frame would only add a second
    edge (owner, 2026-10-12, after Cursor's icon gallery). On the surface, sheets of cells use the
    row plates (rule 3) and hang them into the margin so the figure, not its plate, sets the
    column; lists are the default framed Table (owner, 2026-10-22: "i want to use this table", replacing
    `Table flush`), and rows mixing text sizes align on their first baseline (`Table baseline`). Details open in a hover window (Hover card) or the Inspector.
12. **Each panel's toggle sits at its own side**, in its own header: the Sidebar's first in the Sidebar's header, after the
    window controls; the Inspector's at the end of the Inspector's. A hidden panel's toggle moves to the Canvas header's
    same side.
13. **App CSS styles only app classes.** When a product needs a component to do something it
    cannot, fix the component (with a spec note) or record a gap; never override `.area-*`.
14. **The Canvas's header sets how things are shown; the Inspector, what is chosen** (owner,
    2026-10-12 and 2026-10-14). The layout that follows from it is below. The Inspector's views keep one order, Theme,
    Design, Code, Chat: every page has Design (what is chosen, else the page), Theme where the Canvas draws in the open
    theme, Code where what is chosen is code; a page without the view last chosen shows Design (2026-10-31).
15. **Nothing is chosen until the person chooses it.** A tab opens on its overview, and the
    choice clears when the Sidebar's row changes.
16. **A control that does not apply to the current view is left out**; the order of the rest
    never changes. Fields in the app's chrome and Inspector are `soft`, a set is a
    multi-select Custom select, and dropdowns hug their rows (`--area-menu-min-inline-size`).
17. **Information is tables wherever it can be**: facts, props, classes, states, keys, ARIA
    and a spec's tables and dated lists. Prose stays prose only where it has no rows.
18. **The app is drawn in its chosen system** (owner, 2026-10-30: "it should follow the chosen system, which can be updated
    in a settings page like cursors"; `src/app-look.ts`). By default it follows Area's chosen theme as published; Settings ›
    Appearance picks another system and theme, or draws the app in a look of its own (every Theme setting and Material,
    apart from any system); Settings › Theme edits the open system's theme. A system's unpublished working copy never reaches the app, as it never
    reaches a project. `<html>` carries that look, so the Sidebar, the Inspector, the headers, the app's chrome inside the
    Canvas (`appScale()`, `src/app-scale.ts`), the panel widths, the window's ground and its traffic lights (centred on the
    headers' line) change when it is published or chosen (`src/studio.tsx`). So does everything on the Canvas that is the app's:
    its body, the cards, section titles, the header and the Stage's frame (owner, 2026-10-26: "the actual components
    themselves that sit inside the containers would be the only things that update with the controls"). The
    Inspector's settings, and hover previews of them, reach only what holds a specimen: a tile's view, the Stage's view,
    a colour card (the card is the colour), a type sample and an icon glyph, through one scope of the settings moved
    from the app's look (`src/specimen-scope.tsx`); an exact accent (Inspector → Accent → Exact colour, `src/brand.ts`) and exact page colours (Inspector → Page colour, `src/colours.ts`) reach the same holders. The defaults were chosen on the defaults review (docs/research/defaults-2026-10-25/). From
    2026-10-25 to 30 the app was drawn in those shipped defaults; from 2026-10-22 to 25 it took every committed Inspector
    setting. The Theme tab's own body stays at the
    Setup scale (Setup, below).
19. **A version is said as a model is named: the system's name, then its number** (owner, 2026-10-30: "dont use the dots
    · or v1.0 … just put the number after the name? like area 1.0? might want to think of systems almost like ai
    models"): "Area 1.0", "Area 1.1" (Adds), "Area 2.0" (Needs work in products), "Area 1.0.1" (Fixes), through
    `versionName` (`src/systems.ts`), in pickers, titles, facts, dialogs and buttons. Never "v1.0", and never a number
    without its system's name beside it. A state beside a version is its own element (a Live Badge, a Radio's meta),
    not a suffix.
20. **No middle dot (·) in the app's copy.** Two facts in one line are joined by a comma ("2 themes, Default in use"), a
    path by › ("Appearance › Shape"), a value and its unit by a space ("Blue 220°"); facts that stand apart are separate
    elements. (Component demos' example copy, such as Asset row's "SVG · 24 × 24", follows its component's spec.)
21. **The app's copy is spelled "color"** (owner, 2026-10-30: "use color not colour"): every visible string, setting names
    and descriptions, and the Documentation entries. Code names keep theirs (`colours.ts`, `data-area-status-colours`,
    the `area-tokens colours` command), as renaming them is an API change.

22. **A setting is edited where its effect is seen** (owner, 2026-10-30: "the 1x 2x zoom level of detail of real components
    that i would get from the component review artifacts ... each in their own container like a bento style"; "focus on the
    actual theme playground/creation/editing experience"). A system's Themes opens on its Screen view (below); its Close-up
    view is the Playground: the Inspector row last pressed or focused names the setting, and the Canvas shows the
    components it changes, one per bento tile at 1× or 2×, live (src/setting-preview.tsx). The Screen view (owner,
    2026-10-31, a trial of how a project's screens are viewed; src/screen-viewer.tsx) puts the Workspace alone on a grey
    ground, fitted or zoomed (stepper, menu, or a pinch), scrolled past the view; the Canvas header's start holds the view
    and its mode (Light, Dark, Light and dark side by side or stacked) and ground (Grey, White, Black, Checkerboard) as
    ghost menus, its end the zoom, whose menu toggles the held states and the window frame. Every setting row carries a Reset to Area's default while it differs from it, after its
    name, and every bar's value field is one width (5 characters), so a column of rows lines up. Settings keeps its screen
    preview only.

23. **Real UI only, for now** (owner, 2026-10-30: "i want to stop using the abstract illustrations for now and just use real
    ui and components"). Every product screen draws its components with their real text (`setup-screen.tsx` `FIGURES`
    off; the Area figures' bars and shapes return by turning it on), and a choice card shows the Workspace or the real
    component its setting changes (`choice-visuals.tsx` `ChoicePreview`; the glyphs are kept as `ChoiceFigure`). The general
    example is the **Workspace** ("Northwind › Website relaunch"): one issue tracker screen that every setting changes,
    shown as a showcase (`SHOWCASE`: its menu open and its toast showing) on theme, system and project cards, Publish,
    Setup and the Playground. The Workspace is a 1920 × 1080 desktop app (`content/examples/workspace.tsx`; owner,
    2026-10-30: "the northwind ui looks terrible. it looks fake ... make it a 1920x 1080 screen and scale it down"; "dont
    name it anything, just use generic copy"): sidebar, main column and details panel, no product or workspace name.

## The app's layout

How rules 11–17 lay out the app's regions (`apps/desktop/src`). Values are at type 13, Compact,
the scale the layout was measured at; the app now takes its chosen system's type and density (rule 18).

**Places, tabs and the nav** (app structure Phases 1 and 2, 2026-10-28 and 29, and the IA of 2026-10-29: projects and
publishing; the plan and the owner's model in `docs/research/app-structure-2026-10-28/README.md`; the shell is variation A,
Cursor's nav with Figma's tabs).

- **Places** (`src/places.ts`): every view is a place with a hash. Home is `#home` (`#home/<system>` with a system chosen,
  `#home/new` for New system). A system's sections are Themes
  (`#system/<system>/themes`; New theme, `…/themes/new`, is the Setup chat; its Playground edits every setting, and
  `…/themes/settings/<group>/<setting>` opens it on one), Colors (`…/colors/<scale>`), Typography (`…/typography/<role>`; a typeface
  is `…/typography/face/<face>/<tab>`, its tabs Specimen, Glyphs, About and Code, since 2026-10-31), Icons
  (`…/icons/<category>`; Icons' wall and a typeface's Glyphs are one glyph sheet, `src/glyph-sheet.tsx`), Components,
  Patterns (the system's screens; a screen that tries something out is a test, in Labs › Tests, since 2026-10-31) and History (`…/history/<version>`); a project's Overview (`#project/<project>`), pages
  (`…/pages/<page>/<layer>`), explorations (`…/explorations/<id>`) and Versions (`…/versions/<id>`); Inspiration
  (`#inspiration`, Imagery, then the Library page, renamed) and Labs (`#labs/materials`, `#labs/tests`, out of the nav, reached by search; each its own tab). Old links redirect: `#theme` → Themes, `#theme/<setting>` → its group's page, `#components` →
  Components, `#typography`, `#color`, `#icons` → their sections, `…/foundations` and its group pages → Themes (2026-10-30), `…/foundations/color|typography|icons` → their sections (2026-10-31), `#testing` → Patterns (a moved screen → Tests), `#imagery` and `#library` →
  Inspiration, `#materials` → Labs; old links are the Area system's, and `#brand/…` links from before the rename open their `#system/…` place
  (`tests/places.test.ts`). A hash naming a system or project the workspace doesn't have is no
  place. A specimen's own in-page links (an example screen's `#home`, a demo's `#library`) stay in the specimen: the
  Workspace prevents a hash link's click in the Canvas and the Inspector that nothing else handled. Projects and Explore
  come in later phases and are left out until then (rule 16).
- **Systems** (`src/systems.ts`, Phase 2; brands until the owner renamed them, 2026-10-29: a system is the look and the
  rules a product is built with): several, each `~/Library/Application Support/Area/Systems/<id>/system.json` (never in
  the repository; electron/main.cjs reads them all at launch and writes one when it changes, a quarter second after;
  a deleted system's folder goes to the Trash; the `Brands` folder of the build before the rename moves over once; the browser preview and a capture keep them in their own storage). A system
  has themes; a theme is the Inspector's Theme settings, the Material, the exact page colours and the exact accent. **The
  open system** is the current tab's, or on Home, the Library and Labs the last one a tab showed; its chosen theme is what
  `useStudio()`'s `canvas`, `material`, `colours` and `brand` are, what the Inspector's Theme view edits and what every
  page paints its specimens in. **A system is edited in place and published** (owner, 2026-10-29: "one place"): its themes
  are the working copy, and its releases (`releases`, never empty; a file from before them starts with one) hold what was
  published, each a version, a kind (Fixes, Adds, Needs work in products: patch, minor, major), a note, a date and the
  project it came from. While the working copy differs from the last release, a system tab's Canvas bar ends in a Live /
  Working switch and Publish (`src/publish.tsx`); Publish's dialog shows Live beside Publishing for the theme in use, every
  changed value in a table, the kind (proposed from the changes) and a note drafted from them, and Discard changes. Live
  shows the system as published; editing anything switches back to Working. History lists every publish, newest first,
  beside the version before it, with Restore (the working copy becomes that version, published again as a new one). The settings saved before systems (localStorage `canvas`, `material`, `colours`, `brand`)
  became the Area system's Default theme once, at the first launch with no Area system on disk; the old keys are no longer
  read. The Area system can't be deleted.
- **Projects** (`src/projects.ts`, `src/pages/project.tsx`; the IA of 2026-10-29): where new things and big changes are
  made. Each is `~/Library/Application Support/Area/Projects/<id>/project.json` (as systems), and uses one theme of one
  system as published (a project never sees a system's unpublished working copy). It holds pages (boards of layers: the
  system's Patterns screens and Inspiration's images, in order), explorations (a theme tried from one of the system's,
  edited in the Inspector's Theme view, published into the system as an update to the theme it came from or as a new
  theme, solo users straight away) and versions (named copies of the pages and explorations, restored from the
  Inspector). Nothing else on a project's pages edits the system: they have no Theme view.
- **Home** (`src/pages/home.tsx`): the feed of the workspace: Projects (each drawn in the theme it uses; New project:
  a name, a system and a theme), Systems (each drawn as Setup's screen in its chosen theme; a
  double-click opens it), New system (from the Area Starter: Area's values; Describe it: the system is made and its first
  theme's Setup chat opens; Import: a stub, marked Later), Inspiration (its groups, as boards) and Recent (the last 8 places
  opened). The Inspector's Design view shows the chosen system with Open, Rename and Delete; Home has no Theme view. Themes
  lists the open system's themes: double-click or Use chooses one, New theme adds one at Area's values and opens Setup on it.
- **Headers** (owner, 2026-10-30, after Cursor: "the full sectioning of the ui into 3 distinct parts each with their own
  header"; a Titlebar spanned the window from 2026-10-10): each region has its own header on the window's top line, 40 at
  type 13 (Cursor's; the small control 7 from its top and bottom: Panel `windowBar`, Titlebar `size="sm"`), with no rule; the panels' seams are the dividers. **Sidebar**: its Panel's bar, the macOS traffic
  lights' room (the toggle 83 from the window's edge, Cursor's), the Sidebar's toggle and Search (⌘K), then Back and
  Forward (⌘[ ⌘], the tab's own history) at its end. **Canvas**: a plain Titlebar, the open tabs, then Inspiration and
  light / dark at its end; with the Sidebar hidden it starts with the lights' room, the toggle, Search and Back and
  Forward, and with the Inspector hidden it ends with that toggle. **Inspector**: its Panel's bar, its views, then its
  toggle. A lead (Setup's chat) has a header row of its own over it, with Search and Back and Forward. A strip under the
  headers is the window's drag region in Electron, every control in it a hole (`app.css`, `.studio-drag`).
- **Profile and Settings** (owner, 2026-10-30: "a profile and setting control to the bottom left … like claude and
  cursor"): the Sidebar's foot holds the person's avatar and name and Settings (⌘,; the app menu's Settings… in
  Electron). Settings (`src/pages/settings.tsx`) opens over the current tab in Cursor's layout: the Sidebar becomes its
  sections (General, Appearance, Theme) under Back and a search, the Canvas holds the section's groups of rows (a title
  and its description, the control at the end, in a recessed box), and there is no Inspector. Back, Esc or opening any
  place closes it. Only settings that work are shown (rule 16). **Appearance and Theme are apart** (owner, 2026-10-30:
  "theme is theme and appearance is for the actual electron ui? both would show the same level of customization"):
  Appearance is the app's own look (Mode; Drawn in A system, with its System, Theme and an Edit in Theme row, or Its own
  look, which shows every Theme setting and Material apart from any system); Theme is the open system's theme as its
  Inspector edits it (System and Theme pickers, Live or its unpublished changes and Publish in the title, every Theme
  setting with the exact colours, and Material). A project's tab shows its system as published, so Theme there offers
  only Open, the system's own tab. Both draw a setting with the Inspector's own rows in a Settings frame
  (`inspector-rows.tsx` `RowFrame`), so a setting is one control in all three places (owner, 2026-10-30: "the area
  design system theme controls (all of them) mapped to a settings page like that"). Mode, Density and Corner are
  pictures, every choice a card (Radio `soft` `preview`, the choice drawn in its own scope by `src/choice-visuals.tsx`);
  the rest are plain controls ("some simplified visual illustrations … but for the most part just simple controls").
  Search finds rows in every section, headed by their section.
  Theme has a **live preview** beside its rows (owner, 2026-10-30: "add a screen to the right of the theme canvas in
  settings to preview all the changes live"): the Area app itself by default (owner, 2026-10-30: "a variation of the area
  electron app itself"; `content/examples/area-app.tsx`, its Sidebar, tabs, component tiles and Inspector), or a product
  screen (Workspace, Analytics, Settings or Phone; the pick remembered), drawn
  in the theme being edited, in the mode the rows edit, exact colors and hover previews included, held in view while the
  rows scroll; on a Canvas under 960 it sits above them. **Page color** leads the Page section (owner, 2026-10-30: "not
  sure what page color means"), in the Inspector too: Adjust (Lightness, then Temperature and Tint) or Exact (one picked
  color the greys, edges and text are worked out from; the adjusting rows are left out, not dimmed). Each Page and
  Accent row's description says what it paints (`gallery/controls.ts` hints).
- **Tabs**: **Home is the first tab**, always: its icon alone in
  Nav's square icon-only item (Figma's file browser tab), never closed, always on Home, named in a Tooltip with ⌘⇧H. From
  Home a system, board or place opens in the tab already holding that system (or the Library, a lab), else in a new tab at
  the end; Home from any tab (the nav's row, ⌘⇧H, search) switches to the Home tab. Tabs work as a browser's, after Claude Code's browser
  (owner, 2026-10-29): each holds one thing (a project, a system, Inspiration, a lab) with its type icon and name, and
  never changes what it holds ("the tab itself … will always just be the project itself": a place in another project or
  system opens in the tab holding it, else a new one), 120 to 170
  wide, hugging its name in between; its close shows on hover, focus and the current tab (always on touch; Tree view's
  rule) over the name's end, which fades under it (Figma's file tabs, owner 2026-10-29); the last tab closes too, leaving
  Home; past the bar's room the tabs scroll (a wheel turns them), the current one kept in view and the bar's end on screen;
  a cut name shows whole in a Tooltip, and the close names itself in one (with ⌘W on the current tab). The app menu
  (electron/main.cjs) holds the tab keys, as a browser's: ⌘T new tab, ⌘⇧T reopen the last closed (where it stood), ⌘⇧H
  Home (Finder's Go › Home), ⌘W close the tab (Home stays; ⌘⇧W closes the window), ⌃Tab and ⌃⇧Tab next and previous
  (Home among them), ⌘1–8 the tabs after Home (⌘1 the first after it, as Figma numbers its file tabs past the fixed Home
  tab), ⌘9 the last; a middle click closes one. New tab (+, ⌘T) follows them and opens search, whose choice opens in a
  new tab: Home is already the fixed first tab, so a new tab opening it would be a second Home (2026-10-29). Each tab
  keeps its own place, Sidebar and history. The open tabs and their places reopen at launch, after Home (the old saved
  tab migrated once); with none saved the app opens on Home.
- **Search** (`src/search-palette.tsx`): the Sidebar header's Search (an icon, Cursor's; the Titlebar's field until
  2026-10-30) opens Command palette over every place, component, setting,
  scale, type role, icon category and pattern, and icons by name from two letters; a choice opens in the current tab.
- **The Sidebar's nav** (`src/app-nav.tsx`) is the tab's own (owner, 2026-10-29: "within each project there are a bunch
  of things in it … accessed through the left nav"). Home's tab (and Inspiration's and a lab's): Home, then Projects (a
  row each, New project last) and the Library (each system, Inspiration, New system last). A system's tab: a back row to
  Home, then the system's sections, one row each (owner, 2026-10-30: "each system is one thing with components, colors,
  typography, icons, patterns, etc underneath it"): Themes, Colors, Typography, Icons, Components, Patterns, History (which
  says how many changes are unpublished). A section with its own list (Colors' scales, Icons' categories, Components'
  families, Patterns' screens) shows it under the nav, after one rule and its filter (`PageList`), so every section stays
  one click away; it replaced the nav until 2026-10-30. A page of many heavy parts draws them as they near the view
  (`tile.tsx` `WhenVisible`): Colors and Patterns had held a click 2.5 seconds. A project's tab: a back row to Home, then Overview, Pages (each a chevron to its
  layers; New page), Explorations (each with the version it published; New exploration) and Versions. A click opens in
  the tab holding what it names, ⌘-click in a new one.
- **Takeover**: a page with a list of its own (Components, Color, Typography, Icons, Patterns, Library, Materials) shows
  it in the Sidebar's place, under a back row ("← Area", the system's name) and the list's filter (it was the Titlebar's search). The back row
  shows the nav again and leaves the Canvas where it is; opening the page from the nav shows its list again.

**Shared line and insets.**

- There is no title over the Canvas or the Inspector; the Sidebar's selected row names what
  the Canvas shows.
  The Components bar carries its path at its start instead (Breadcrumb `nowrap`, owner 2026-10-24: "breadcrumbs can be used to help with layer management"; 2026-10-25, the Overview too: "put some text in the top left, a breadcrumb"): Components / Overview (or List), and on a tile Components / its family / its name.
- The Canvas's second row (its view options, under the tabs) is a small control with 5 above and below and the tab
  row's 7 at the sides: 36 at type 13, its controls 12 under the tabs, its last control ending under the tab row's last
  (owner, 2026-10-31, Claude's browser pane: "the second row of controls below feel like part of the tabs bar", then "it
  still looks too tall"; measured there a 24 field in a 34 row, 11 under the tabs; was 47, then 40). What the Canvas
  shows sits at its start as ghost menus (view-controls.tsx ViewLead and ViewFilter: "i dont like that theyre all right
  aligned. maybe use more dropdowns"), how it is shown (zoom, layout, New theme) at its end. Its controls and the
  Sidebar's first row share one line (58); the Inspector's first heading, set by Panel's own body inset, sits 5 under it
  (63). The Sidebar and Inspector are 14 in on all sides.
- **Lines and grounds** (owner, 2026-10-22; `docs/research/cursor-audit-2026-10-22.md` item 4; the Titlebar's rule went
  with it, 2026-10-30): no header and no bar carries a rule (Notion's and ChatGPT's top bars), and the Sidebar sits on
  the chrome's recessed ground (`data-area-chrome`, the subtle step, as Notion's sidebar), its seam the Panel's edge.
- **Rows are 28** at type 13 Compact (owner, 2026-10-22, item 2: rows keep at least 5 above and below their
  text; Cursor's and Figma's 28).
- **The Canvas is a feed** (owner, 2026-10-22: "margins larger than the gaps … a consistent feed style … documentation
  style that is simple, repeatable, consistent"). One column of sections, at most 1236 wide (four 300 cards) and centred; each section
  is a heading (and a muted lede) over one block: a grid of cards, the Stage, plain text, a Table or a Code block.
  Spacings grow outward: cards 8 apart (colour's swatch sheet 4; owner, 2026-10-24: "maybe everything can be 8px?"; was 12), at least 260 wide (277 to 300 in a 1440 window), at most four across (owner, 2026-10-22: "more like a gallery", "280 to 300 px
  width … 4 columns across not more"), a heading 12 over its block, sections 40 apart, the Canvas margin 16, each
  measured to what is drawn: a frame's edge, a text's cap or baseline (titles, ledes and prose are trimmed; a Table
  measures to its frame, as a card does).
- **One voice for the feed's text** (owner, 2026-10-22: "make the copy, titles, and subtitles to be more consistent and
  intentional"), all at the app's 13/18: a section's **title** (medium) carries a muted **count** when its block is a
  collection (cards, rows, swatches, icons), never on facts, code or prose; where the page explains (a family's tabs,
  Theme, Typography) a **subtitle** (muted, one sentence ending in a full stop) says what the block holds; **copy**
  (prose, table text) is regular. A family's purpose opens its page as a subtitle. `CanvasSection` (`src/tile.tsx`) and
  the family tabs' `Section` take `count` and `lede`.
- A bar's controls sit as far from the side as from the top and the rule: 7, 24 tall
  (owner, 2026-10-18; Figma's panel tabs: 8 and 8).

**Canvas header**, at its end, in this order, every control ghost but the grid / list switch's track (owner,
2026-10-25: "make them more consistent, clean them up"):

1. filters: each a ghost menu button that reads its choice ("All statuses ⌄") and opens its options (was a soft Select,
   the bar's one filled box, a long choice running under its chevron);
2. Sort and group (rule 7), an icon menu;
3. how things are drawn (zoom, style, size). On Components the style is the Cards menu, an icon menu of two
   independent choices (owner, 2026-10-25: "there should just be 1 style of container"): **Container** (Basic, the
   name and Copy on hover, the default) or **No container**; and **Fixed height** (5:4, the default) or **Waterfall**,
   each card hugging its component at its scale with 28 above and below it, between half and 5:4 of its width, dropped
   into the shortest column (`src/gallery/fit.ts`). A taller component gets a taller card, never a larger scale. It was
   nine looks (Framed, Name below, Basic, white, no stroke, Containerless…; 2026-10-22 to 2026-10-25);
4. the grid / list switch.

Zoom is Zoom control's stepper (− Auto +):

- **Auto** (the default) shows every specimen at one scale, 70%, so components keep their real
  proportions to each other (owner, 2026-10-22; was 90% for a control down to 75% for the largest).
  70% is the largest at which the largest group fits a 277 card. A specimen is shrunk further only to fit.
- **Fit** shows each specimen as large as its card allows, up to 200%.
- **Exact steps** are 50, 75, 80, 90, 100, 110, 125, 150, 175 and 200%. − and + step through
  them, starting from 100% on Auto or Fit. The menu lists Auto, Fit and these, nothing else.

**Components** (Area › Components; the Components tab until 2026-10-28).

- **Overview and Single** (owner, 2026-10-25; `docs/research/isolated-view-2026-10-24/variations.md` §10). All is the
  Overview: every family in the Sidebar's order, a section each (its title, tile count and status badge 12 over its
  cards, sections 40 apart), one row of its tiles until "Show all N" (a text control 12 under the cards, on their edge)
  opens every tile in its groups (a group's name 8 over its row, groups 24 apart). Sections draw their cards as they near
  the view, holding their room with empty cards until then. The arrangement's groups set the order but draw no title
  (the Sidebar names them). A card opens that tile alone (Single: the family page on Preview, the Stage at real size);
  Escape, ⌘↑, ⌘[, the Overview button or the breadcrumb's first step go back to the Overview at the family left, its
  section open and the tile selected, with "Back to <family>" at the bar's start, which Escape also does. Opening grows
  the Stage from the card on `slow`; leaving shrinks it into its card on `moderate` (ease-in-out; Motion 0 and reduced
  motion skip both). In the Overview a family's Sidebar row scrolls to its section; a variant's row opens it.
- **Variants in the Sidebar** (owner, 2026-10-25: "legitimate standalone design items"): a family's row opens to its
  Default tile and a branch per group (Variants, Sizes, States …) of its tiles, named by value. Those branches start
  closed; the tile on the Stage opens its family and group. Pinned rows are shortcuts with no rows under them.
- **The bar on a tile**: the Overview button (Grid, its Tooltip with Esc), then the path, Area's Breadcrumb `nowrap`
  (Components › family › tile), its first letter 12 from the button's glyph; then Replay, zoom and previous / next,
  which walk every tile in the Sidebar's order. The bar's start and its controls stay at least 12 apart; the path's
  page is cut first.
- Specimens sit in square cards at least 360 wide, 8 apart, the specimen 24 in. The title
  and a Copy code button sit at the frame's top.
- Every tab's tiles are Asset cards, always square, with the name, a value and controls in
  the frame's first row (owner, 2026-10-19, a trial).
- A family's page opens with its purpose in plain text (the manifest's description), 24 over its tabs, as a
  documentation page opens; the tab bar stands 24 off its panel. It is Area Tabs (`src/family-tabs.tsx`):
  - **Preview** (was Overview; 2026-10-25): the Stage and its code, one tile alone; the family's other tiles are in
    the Sidebar, the bar's previous / next and the Overview;
  - **Documentation**: usage, from `content/documentation/` and the spec;
  - **API**: props from JSDoc, classes, parts, states and CSS properties;
  - **Code**: React source, stylesheet, manifest and every demo;
  - **Spec**: the family's spec.

  Properties stay in the Inspector, on Overview only.

**Themes** (the Theme tab until 2026-10-28, Language 2026-10-19 to 20; `src/pages/themes.tsx`, Setup in
`src/pages/theme.tsx`). Themes opens on its Screen view (rule 22), with Close-up (the Playground) and the Themes cards a
switch away; its header's New
theme opens Setup, and Setup's Fine-tune opens Themes. Foundations (Browse, below) was retired on 2026-10-30.

- **Setup** (New theme; `src/pages/theme-setup.tsx`, questions in `src/pages/setup-questions.ts`; a questionnaire since
  2026-10-24, a conversation in two panels since the same day: "a 2 panel view with 1 side being a vertically scrolling
  chat like experience ... and then visuals on the right side"; "dont need all these panels open"):
  - **No Sidebar or Inspector** (Workspace `panels={false}`; the saved panels are untouched, so other tabs keep theirs).
    Since 2026-10-28 the chat is a Panel in the Sidebar's place (Workspace `lead`), at the app's scale as the Inspector's
    Chat view, resizable (320 to 560, 400 by default), and the stage is the Canvas (owner, 2026-10-28: "a more compact
    chat panel, just like cursor, claude, chatgpt"; "fix the header on the theme page"). The Canvas header holds the
    stage's controls: Screen or Component and the screen at its start; Real or Wireframe and Light or
    Dark at its end, Browse's order. The chat's bar ("Theme setup", Start over, Fine-tune in the Inspector) sits on the
    header's line.
  - **The chat** (left), built as the Inspector's Chat view: Messages for what Setup says, each chapter's answers in a
    framed, justified Description list (an answer reopens its question, marked as the current one; Done returns to
    where the conversation had reached), and the review with Copy theme. The composer's place at the foot holds the
    progress (Plan, a segmented rail by chapter) over the question, an Approval: numbered choices with a line each, the
    given answer checked, "N of M" in its head, Use the default, Skip chapter and Continue in its foot. 1–9 choose,
    Enter continues; a choice under the pointer or focus is previewed on the stage.
  - **Controls**: choices are the Approval's rows, words only, since the stage draws each choice (owner, 2026-10-28,
    the chat panel); a scale with named marks asks by its marks, and an exact value is set in the
    Inspector (Fine-tune). Swatches, a hue bar, a toggle and checkable pills sit in the card's detail.
  - **The visuals** (right, the Canvas): the view and a bar under it, on a plain ground a step off any page (no
    backdrop, no shadow; the window's own edge is its outline). The Canvas header chooses what is shown, Screen or Component,
    which product screen (Workspace, Analytics, Settings, Phone; `SCREENS` in `src/setup-screen.tsx`), Real or Wireframe
    (words as bars), and Light or Dark; the bar under the view names what is shown and holds the zoom (Zoom control, a stepper;
    Fit returns to the fitted size; a zoom centres on the part the question changes). The Workspace is a real, detailed
    product screen (an issue tracker: projects, issues with statuses, a New issue form, a More menu) drawn as an Area
    figure under the theme so far and the mode the question belongs to; it alone marks the parts a question changes
    (dashed rings settling to a trace) and holds the states it is about, with the pointer where it would be. Component
    shows the question's part alone, whole and large, the screen round it hidden. A choice under the pointer is drawn
    before it is picked ("Previewing …").   - **Motion** (owner, 2026-10-24: "subtle, clean"): a new turn and a reopened question's choices rise 8px and fade in;
    the thread scrolls smoothly to the question; the hint under the cards fades as it changes; the progress fills; the
    visuals crossfade a pick or a hover preview. While a bar is dragged the visuals repaint at most every 180ms; the
    chrome takes the setting 160ms after the drag ends. All of it runs on the app's own Speed and Easing.
  - **Pacing**: chapters in the order a system is built (Page, Accent, Text and room, Shape, Lines, Depth, Interaction,
    Motion, Accessibility, Dark mode); a question is asked only while it can change something under the answers so far,
    and a light/dark pair is asked in light in its chapter and again in Dark mode, the visuals turned to it.
  - **Setup and the Inspector are two ways into the same settings**: every answer is an Inspector setting; what Setup
    does not ask keeps its default. Setup's own UI never changes as picks are made (`Workspace canvasPicks={false}`);
    only the visuals and the choices' pictures take them.
- **Browse** (retired 2026-10-30, with Foundations; kept here as the record) listed the Inspector's own settings (`src/gallery/controls.ts`) in cards at least 200
  wide.
- **Containers.** Asset card is the Components tab's container only; every other tab's tiles are the plain container
  (`src/tile.tsx`, PlainTile): the stripe fill, Card's light edge at stroke-width, no shadow, the name in the first row,
  the edge stepping on hover, the selected edge and the focus ring from the state settings (owner, 2026-10-21).
- Each card shows one real component with real text, showing the one thing the setting
  changes (`src/abstract.tsx`; owner, 2026-10-19: "simple, and easy to recognize").
- Previews are at default size, scaled down (never up, at most 0.8×), with one scale for
  every preset of a setting so they compare. Settings whose change is a line, a corner, a shadow, a state, a row's
  height or a motion are close-ups instead: the real component a little over its size, cropped by the card.
- Type is the ramp of roles with their sizes. Ground and Layers are windows whose card frame
  stays put.
- The page previews one theme, Light by default, with a Light / Dark switch in the Canvas
  bar. Per-theme settings show the previewed theme's own value.

**Inspector.** Views are chosen by pills in its bar (`src/studio.tsx`, InspectorPanel). The
chosen view holds across tabs and launches. A tab with nothing for a view leaves that pill
out.

- **Theme** (Language 2026-10-19 to 20; the tab and the Inspector use one word): the
  Canvas settings under the registry's headings (`SETTING_GROUPS`: Page, Accent, Emphasis, Size, Shape,
  Stroke, Shadow, States, Effects, then Material), only those that change this tab's specimens. A light/dark pair
  (Lightness, Grey tint, Layer contrast, Card shade, Button depth) shows the app's mode's own (owner, 2026-10-22), the
  Titlebar's switch choosing which. An ordered setting is a bar row (owner 2026-10-27, "Keep the Input layout"; was the name and value inside the bar,
  owner 2026-10-24): its name in the label column, the label-inside bar without its text, then its value in a soft
  Input that takes a typed value. Rows are their controls' height, 8 apart; sections are separated by space alone (about
  32 from the last control to the next title's cap); a dimmed row's reason sits behind an info button
  (Toggletip, Field's `labelAction`) after its name, never as a caption (owner 2026-10-27); headings are one word. A row is beside its
  name while its control fits there at its natural width and under it otherwise (Field `auto`); every bar is one row
  with a value field 4 or 5 characters wide; a value in words shows its number there (Temperature -25, Shade +57) and a
  colour range paints its trough (Slider `gradient`); a bar of 3 to 12 steps shows its steps as dots (owner 2026-10-27); named choices are a Segmented beside the label, or under it from three options; a setting with Auto,
  System or Accent shows those with Custom and the bar under them. Values read in their unit ("60%", "8px", "210ms",
  "White"), never a step number; none says "(Default)" (owner, 2026-10-20: "i dont like seeing (default)"). The Theme
  tab is where the default is marked.
- **Design**: what is chosen, at its narrowest: a Canvas item, else the Sidebar's row, else
  the tab's overview. It shows, in order:
  1. the tab's display settings;
  2. a component's Properties;
  3. the preview, unless the Canvas already shows it at size;
  4. actions;
  5. one facts list: a Description list on the panel's label column, so its values start where the controls do,
     its rows packed at 26 (owner, 2026-10-30, docs/research/inspector-panel-2026-10-30); a sentence about the
     thing (its purpose, a note) is a muted note under the list, never a value.
- **Code**: how to use it, as Figma's Dev Mode shows it. It holds:
  - the import and the code in Code block `sm` wells, `soft` (the panel's fields' look) with no language header (the
    section's heading names it), each with its own copy shown on hover or focus, a cut line fading at the edge, a long
    block opening as its first 5 lines; a command with its `$` prompt (owner, 2026-10-30,
    docs/research/inspector-panel-2026-10-30). No copy buttons repeat what a well copies; copy actions stay for what
    no well shows (a token, a hex, an SVG);
  - class names as plain mono text in the facts;
  - facts tables (name, token, class, modifiers, attribute);
  - for a component on the Stage, its measured box (Box model) and computed paint,
    re-measured when a setting changes (`src/specimen-box.tsx`).
- **Chat** belongs to the app rather than a tab, so every tab offers it (`src/chat/`).
  - The transcript is the Panel's body, followed to the newest line while the reader is at
    the end.
  - The composer is the Panel's footer.
  - ⌘L opens Chat and focuses the composer; Esc stops a reply.

## Open component gaps

Recorded, not yet built; each needs its own component pass ([Governance](GOVERNANCE.md#1-decide-what-kind-of-change-it-is)).

From the app CSS audit (2026-10-22, `docs/research/cursor-audit-2026-10-22.md` item 10; `npm run check:app-css -w
@area/desktop` lists every rule that still restyles a component, with its gap):

- **Forced state for specimens**: a documented hook that shows hover, focus, lift or pressed at rest, so the Theme
  previews stop painting Input, Card and Menu item from app CSS.
- **Width hooks**: Slider, Slider range, Progress and Radio need a public inline-size hook or a full-width option, as
  Input's `--area-input-inline-size`.
- **Fieldset**: a visually hidden legend option.
- **List box**: a grid option whose content draws its own frame (no plate), for the app's plain tiles.
- **Button**: a text-size hook and a coloured shadow for the Abstract board's reference pieces, or the pieces move their
  paint to tokens on the scene's scope.

Earlier: the 2026-10-12 audit's gaps were all built on 2026-10-15 (Copy button, List box, Hover card `openOnFocus`, Table cells, Badge `onColor`,
Nav `revealActions`, Context menu `itemSelector`, Card selected, Titlebar and Section heading). Record new ones here.

