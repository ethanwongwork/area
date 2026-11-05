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
    ghost menus, its end the zoom, whose menu toggles the held states and the window frame. Every setting row carries a Reset to Area's default while it differs from it, before its
    control, which gives up the button's width (owner, 2026-10-31: "move the reset button and displace part of the input or
    slider"; after the name it clipped nine long names), and every bar's value field is one width (5 characters), so a column of rows lines up. Settings keeps its screen
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
24. **Code's words, except where design has a friendlier one** (owner, 2026-10-31: "keep code terms consistent except for
    when a more design friendly term can be implemented or used … the whole merge, repo, commit, push terminology should be
    updated to design friendly terms that people are used to, like project, save, etc. but changing tokens to variables is
    unecessary"). Keep the terms designers and engineers share: **tokens** (never Figma's "variables"), component, variant,
    props, slot, instance, theme. Git's words never reach the app's copy; say the design word instead:

    | Git | The app says |
    |---|---|
    | repository | system or project |
    | branch, fork | exploration |
    | commit | save (a version) |
    | push, merge, release | publish |
    | pull request, review | review |
    | working copy, uncommitted | draft, unpublished |
    | diff | changes, before and after |
    | revert, checkout | restore |
    | conflict | two changes to one thing, side by side |

    Code identifiers keep their names (`workingSystem`, `releases`); only what a person reads changes. Also avoid Figma's
    "Style" for a bundle of values (say composite token), "Mode" for anything but light and dark, and "Collection" for
    tokens (a collection is References' group of saved items; tokens come in groups).
25. **Anything designed opens the same way, alone on a bounded canvas** (owner, 2026-10-31: "anything thats designed
    exists in its own standalone visual playground like figma, but its only ever limited to 1 design, not an infinite
    canvas"; the IA and playground review's step 2). A gallery's card opens its design in the design viewer
    (src/design-viewer.tsx) in the tab that holds it: a theme's screen (Themes › Screen), a pattern or test, an icon, an
    References image, a project page's layer. The card grows into the canvas and Back, Escape or ⌘↑ shrinks the design into
    it, still chosen (src/morph.ts); ⌘[ is the tab's Back. The design sits at its true size on a ground of its own (Grey,
    White, Black, Checkerboard), fitted or zoomed from 10% to 400% (6400% for an icon, with a pixel grid from 800%) by the
    stepper, a pinch, + and −, ⇧0 (100%) and ⇧1 (fit); Space or the middle button drags it, and the canvas ends at the
    design plus 48. A themed design shows Light, Dark or both. The header's start holds Back and what is shown; its end
    the place among the gallery's designs ("3 of 12"), the steps (← and →) and the zoom. Read only until the playground's
    tools (the review's steps 4 to 7). Components keeps its Stage, which opens and returns the same way.

## The app's layout

How rules 11–17 lay out the app's regions (`apps/desktop/src`). Values are at type 13, Compact,
the scale the layout was measured at; the app now takes its chosen system's type and density (rule 18).

**The window** (`electron/main.cjs`, owner 2026-10-31: "doesnt open to the full width of the screen"; was a fixed 1440 ×
900): it first opens on the whole work area of the display under the pointer (the screen less the menu bar and Dock: 1512 ×
884 on a 14-inch MacBook Pro), then where it was last left (`window.json` in the app's data folder, zoomed or not), unless
that place is off every display. At least 960 × 600. A `--capture` keeps 1440 × 900 (or `--width`) so its frames compare.

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
  (`…/pages/<page>/<layer>`), explorations (`…/explorations/<id>`) and Versions (`…/versions/<id>`); References
  (`#references`: Saved, its collections and their images at `#references/<collection>/<image>`, and Discover and
  Following at `#references/discover|following`; Imagery, the Library page and Inspiration until 2026-10-31) and Labs (`#labs/materials`, `#labs/tests`, out of the nav, reached by search; each its own tab). Old links redirect: `#theme` → Themes, `#theme/<setting>` → its group's page, `#components` →
  Components, `#typography`, `#color`, `#icons` → their sections, `…/foundations` and its group pages → Themes (2026-10-30), `…/foundations/color|typography|icons` → their sections (2026-10-31), `#testing` → Patterns (a moved screen → Tests), `#imagery`, `#library` and `#inspiration` →
  References, `#materials` → Labs; old links are the Area system's, and `#brand/…` links from before the rename open their `#system/…` place
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
  Draft switch (Working until 2026-10-31, rule 24) and Publish (`src/publish.tsx`); Publish's dialog shows Live beside Publishing for the theme in use, every
  changed value in a table, the kind (proposed from the changes) and a note drafted from them, and Discard changes. Live
  shows the system as published; editing anything switches back to Draft. History lists every publish, newest first,
  beside the version before it, with Restore (the working copy becomes that version, published again as a new one). The settings saved before systems (localStorage `canvas`, `material`, `colours`, `brand`)
  became the Area system's Default theme once, at the first launch with no Area system on disk; the old keys are no longer
  read. The Area system can't be deleted.
- **Projects** (`src/projects.ts`, `src/pages/project.tsx`; the IA of 2026-10-29): where new things and big changes are
  made. Each is `~/Library/Application Support/Area/Projects/<id>/project.json` (as systems), and uses one theme of one
  system as published (a project never sees a system's unpublished working copy). It holds pages (boards of layers: the
  system's Patterns screens and saved references' images, in order), explorations (a theme tried from one of the system's,
  edited in the Inspector's Theme view, published into the system as an update to the theme it came from or as a new
  theme, solo users straight away) and versions (named copies of the pages and explorations, restored from the
  Inspector). Nothing else on a project's pages edits the system: they have no Theme view.
- **Home** (`src/pages/home.tsx`): one centred column at the reading measure (768 since 2026-11-01, 720 before; owner, 2026-10-31: "a single column
  feed", the name Home kept). The Sidebar lists the projects and systems, so Home is what happened: Continue (the last 4
  places opened), then Latest, a Timeline newest first: the open system's changes waiting to publish (current, with
  Review), each system's publishes (its first is when it began; a publish's note, then its theme drawn as Setup's
  screen), projects started (drawn in the theme they use), versions saved and references saved (the first collections).
  Every event comes from the workspace's own records; notifications and launches by others join it when sharing exists.
  A picture selects its system or project for the Inspector and opens it on a double-click; its title opens it. New
  project (a name, a system and a theme) and New system (from the Area Starter, Describe it, or Import, a stub marked
  Later) are the Canvas bar's. The Inspector's Design view shows the chosen system with Open, Rename and Delete; Home has no Theme view. Themes
  lists the open system's themes: double-click or Use chooses one, New theme adds one at Area's values and opens Setup on it.
- **Headers** (owner, 2026-10-30, after Cursor: "the full sectioning of the ui into 3 distinct parts each with their own
  header"; a Titlebar spanned the window from 2026-10-10): each region has its own header on the window's top line, 40 at
  type 13 (Cursor's; the small control 7 from its top and bottom: Panel `windowBar`, Titlebar `size="sm"`), with no rule; the panels' seams are the dividers. **Sidebar**: its Panel's bar, the macOS traffic
  lights' room (the toggle 83 from the window's edge, Cursor's), the Sidebar's toggle and Search (⌘K), then Back and
  Forward (⌘[ ⌘], the tab's own history) at its end. **Canvas**: a plain Titlebar, the open tabs, then References and
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
  (owner, 2026-10-29): each holds one thing (References, a project, a system, a lab) with its type icon and name (a system's
  is `shapes`, a triangle, square and circle, until its own drawing lands; never the palette or the four-diamond
  `component`: owner, 2026-10-31), and
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
- **The Sidebar's nav** (`src/app-nav.tsx` `AppNav`; research and every round in `docs/research/consistent-nav-2026-11-01/`)
  is the same frame in every tab (owner, 2026-11-01: "make sure the nav stays consistent and there are persistent places
  to go back to"; then "what if the top header portion has home references projects and systems. then there is a divider
  section and everything below that shows contextually what is supposed to be there"), as Claude's sidebar keeps its
  slots across Chat and Code:
  - **Four places, held at the top**: Home, References, Projects and Systems. The one holding the current tab is marked
    (a project's tab marks Projects, a system's Systems; a lab's, Home). Projects (`#projects`) and Systems (`#systems`)
    are tabs of their own, as References is: every project or system as cards (drawn as Home's feed draws them), New in
    the bar, the chosen one in the Inspector (`src/pages/workspace-lists.tsx`).
  - **A rule across the Sidebar's full width**, 8 of air on each side (owner, 2026-11-02: "should the dividers go full
    width to separate them truly into sections?"): it divides the panel into regions, the held places from the scroll, as
    Figma's left panel does; a rule that stops short reads as belonging to the block above. A section's list is set off
    the same way, so the Sidebar reads as three regions: places, the tab's context, the open section's list.
  - **The tab's context**, in one scroll (owner: "is it better if its not separated … everything is just in an endless
    scroll?"): on Home, Recent (the places opened lately, one row a name); in References, Discover, Following and Saved,
    then the collections; in Projects, every project and New project; in Systems, every system and New system; in a
    project's tab, its name, then Overview, Pages (its pages, each with its layer count, and New page), Explorations (each
    with the version it published, and New exploration) and Versions; in a system's tab, its name, then Themes,
    Foundations (Tokens, Colors, Typography, Spacing, Shape, Elevation, Motion, Icons), Components, Patterns and Versions
    (how many changes are unpublished). No row carries a bare count of a section. A project's or system's **name stays
    pinned** at the top of the scroll (Nav's sticky heading; owner pick r4-name). Pages and Explorations show **5, then
    Show more**, the current one always shown (pick r4-cap; Cursor's agents).
  - **A section's own list follows its context** (`PageList`; owner's pick: the tree stays three levels), inside the
    project's or system's group so its name stays over it: a page's layers, Components' families by kind (with Pinned),
    Colors' scales, Typography's faces and roles, Icons' categories, Tokens' groups, Patterns' screens, References'
    collections, after one rule. The list's **head** is one row: its name and a **search icon** (⌥⌘F), which opens the
    filter in its place, focused; Escape or leaving it empty puts the name back, and a query keeps it open (owner,
    2026-11-01: "make the search an icon button and not full width"; Figma's Layers and Cursor's Explorer heads). The
    **pinned stack** as it scrolls: the name, then the list's head, then the list's
    open branches (Tree view's sticky branches, pick r4-path: Area › Components › Actions and choices › Button ›
    Variant × tone stays readable four levels down). Each tab's scroll starts at the top; on a new section the current row
    is kept in view, and when the list would start below the Sidebar's middle the current row comes to the top. The
    list's chosen row (a layer, a tile) is **always brought into view** when it changes or its tab opens (pick
    r4-fixes). Choosing in the list leaves the scroll where it is.
  - Foundations, Pages and Explorations open and close on a click. **Opening a section folds the project's or system's
    others** and opens the one holding the page (pick r4-fold: "only the section holding the page stays open"); a row
    opened by hand stays open until the section changes (`nav-open`). Any other row opens its place **in the tab holding
    what it names** (a tab never changes what it holds), ⌘-click in a new one.
  - **A project's pages**: a page opens on the Canvas, its layers as cards (Add screen, Add image), and its layers are
    the list, each marked with its **kind's icon**, a screen or an image, as Figma's layers are, the chosen one marked;
    a layer opens in the design viewer from its card. (A 20 × 14 picture of each, pick r4-thumbs, was dropped the same
    day, owner: "is the small image thumbnail very practical?": a screen at that size is a white plate with a few bars,
    so variations of one screen looked alike, and every row drew a whole screen.) A
    screen or image added again is numbered on its page ("Analytics dashboard 2").
  - **The Sidebar widens for a list** (owner, 2026-11-01: "in pages where more room is needed, the left nav can
    automatically expand slightly to a minimum width"): while it holds a section's list it is at least 288 at type 13
    (Claude's sidebar width, scaled by type as the rest; `studio.tsx` `LIST_FLOOR`). A width dragged wider is kept; on a
    page without a list it goes back to its own. Panel eases a width the app sets (MOTION.md, "Panel width"); a page that
    opens with its list takes the width as it opens.
  - **Component tiles are named in words** ("Outline, success", "Small", "Full width"; pick r4-names,
    `specimenWords`): in the list, on the tiles and in the Canvas path; their ids and links are unchanged.
  - Labs stay out of the nav (search). A page of many heavy parts draws them as they near the view (`tile.tsx`
    `WhenVisible`). Earlier the same day the nav was one tree of every project and system with folding groups; before
    that (2026-10-29 to 11-01) each tab drew its own nav under a back row to Home.

**Shared line and insets.**

- There is no title over the Canvas or the Inspector; the Sidebar's selected row names what
  the Canvas shows.
  The Components bar carries its path at its start instead (Breadcrumb `nowrap`, owner 2026-10-24: "breadcrumbs can be used to help with layer management"; 2026-10-25, the Overview too: "put some text in the top left, a breadcrumb"): Components / Overview (or List), and on a tile Components / its family / its name. Inspiration's
  trail is the same Breadcrumb (`studio-canvas__crumbs`, one line, the app's scale). A path that opens the bar starts on
  the feed's margin (16), over the first section's title, its links' plates inside the bar's 7; after the Overview button
  the two plates stand 4 apart (owner, 2026-10-31: "the breadcrumb spacing on the horizontal side doesnt look right"; it
  had started on the bar's 7, 9 left of the titles, its first plate cut by the clip).
- The Canvas's second row (its view options, under the tabs) is a small control with 5 above and below and the tab
  row's 7 at the sides: 36 at type 13, its controls 12 under the tabs, its last control ending under the tab row's last
  (owner, 2026-10-31, Claude's browser pane: "the second row of controls below feel like part of the tabs bar", then "it
  still looks too tall"; measured there a 24 field in a 34 row, 11 under the tabs; was 47, then 40). What the Canvas
  shows sits at its start as ghost menus (view-controls.tsx ViewLead and ViewFilter: "i dont like that theyre all right
  aligned. maybe use more dropdowns"), how it is shown (zoom, layout, New theme) at its end. Its controls, the
  Sidebar's first row and the Inspector's first heading share one line (58 at type 13 / 32; the heading sat 5 under it
  until 2026-10-31, owner pick q-line: an Inspector view that opens on a heading moves up by the difference,
  `.studio-inspector__view[data-lead="heading"]`). The Sidebar and Inspector are Panel's md inset in on all sides: 14,
  and 18 at Comfortable (`docs/THEMING.md` › What density does to a screen; it was 14 at every density until
  2026-10-31); a list's plates sit 8 from the edge, the text 6 inside them (Cursor's; owner pick q-plates, 2026-10-31).
  A section's list under the nav sits under one full-width rule with 8 of air on each side, its head one row over its rows (owner,
  2026-10-31: "why is the search control so close to the divider above it?"). **Narrow**, the start gives way first (a path shortens to its
  first step, 120), then the end's groups wrap onto rows of their own under it, at the end, 4 apart, each control whole;
  nothing runs under the Inspector (owner, 2026-10-31: "fix the responsiveness"; at a 1000 window with both panels the
  path was cut to nothing and Live, Working and Publish ran off the Canvas). One row is unchanged.
- **Floating panels** (owner, 2026-10-31, pick p5 of `docs/research/claude-code-ui-audit-2026-10-31.md`, after Claude
  Code's two shells): Settings › Appearance › Panels is Sectioned (the default: the regions side by side, their seams the
  dividers) or Floating (the window is the Sidebar's ground; the Canvas and the Inspector float on it 8 from the window's
  edges and 8 apart, the Inspector a floating Panel and the Canvas drawn with the same tokens; the Sidebar loses its seam;
  every region starts 8 down so the headers keep one line, and the traffic lights centre on them). Saved with the app's
  look (`src/app-look.ts` `panels`), whatever system draws the app.
- **The Inspector's Theme groups fold** (owner, 2026-10-31, pick p2, after Claude Code's side panel): each group's heading
  is a disclosure (PanelSection `collapsible`); a closed group says on its heading row what it holds, "Default" or "N
  changed" from Area's defaults (Material its bundle), and which groups are closed is remembered for every tab.
- **Lines and grounds** (owner, 2026-10-22; `docs/research/cursor-audit-2026-10-22.md` item 4; the Titlebar's rule went
  with it, 2026-10-30): no header and no bar carries a rule (Notion's and ChatGPT's top bars), and the Sidebar sits on
  the chrome's recessed ground (`data-area-chrome`, the subtle step, as Notion's sidebar), its seam the Panel's edge.
- **Rows are 28** at type 13 Compact (owner, 2026-10-22, item 2: rows keep at least 5 above and below their
  text; Cursor's and Figma's 28).
- **The Canvas is a feed** (owner, 2026-10-22: "margins larger than the gaps … a consistent feed style … documentation
  style that is simple, repeatable, consistent"). One column of sections the Canvas's width at every window size (owner, 2026-10-31: "i want the content in the middle
  screen to scale up and down"; it was at most 1236 and centred from 2026-10-22, so a hidden panel's room became empty
  margins); each section
  is a heading (and a muted lede) over one block: a grid of cards, the Stage, plain text, a Table or a Code block.
  One small system (owner, 2026-10-31: "open to increasing the margins to 32px … simplify everything that goes into the
  feed … more consistent, more cohesive, more visually balanced and intentionally spacious";
  `docs/research/feed-system-2026-10-31`), spacings growing outward: cards 12 apart (colour's swatch sheet 4; were 8 from
  2026-10-24), one inset (16) and one corner (16) inside every frame (tiles, the Stage, Asset cards, colour cards, tables
  through Table's `--area-table-edge` and `--area-table-corner`, Settings' rows), every gallery on one card grid, at least 260 wide (277 to 300 in a 1440 window), at most four across (owner, 2026-10-22: "more like a gallery", "280 to 300 px
  width … 4 columns across not more"); past four the cards grow with the Canvas and, at Auto, their specimens with them,
  0.7 at a 277 card and up to 1:1 (`gallery/fit.ts`, AUTO_VIEW); a product screen's tile is the screen's 16:9, filled
  (`Tile stage="screen"`), not a square with the screen in its middle; a heading 16 over its block, sections 48 apart, the Canvas margin 32 (at the default density; Compact 12 / 40 / 24 and
  cards 8 apart, Comfortable 20 / 56 / 40 and 16; was 12 / 40 / 16), each
  measured to what is drawn: a frame's edge, a text's cap or baseline (titles, ledes and prose are trimmed; a Table
  measures to its frame, as a card does).
- **One voice for the feed's text** (owner, 2026-10-22: "make the copy, titles, and subtitles to be more consistent and
  intentional"), all at the app's 13/18: a section's **title** (medium) carries a muted **count** when its block is a
  collection (cards, rows, swatches, icons), never on facts, code or prose; where the page explains (a family's tabs,
  Theme, Typography) a **subtitle** (muted, one sentence ending in a full stop) says what the block holds; **copy**
  (prose, table text) is regular. A family's purpose opens its page as a subtitle. `CanvasSection` (`src/tile.tsx`) and
  the family tabs' `Section` take `count` and `lede`. Nothing in a section speaks louder than its title: an empty state inside a section is Empty state `sm` (its title the
  feed's 13/18 at 500, its description joined), and only one that takes the whole Canvas (no results, a missing library)
  keeps md's 15/22 (2026-10-31, type pass; Home's and a project's six were md). A prop's name in the API's Props table
  sits on the cell's line as inline Code; only several names stack (as a grid they became blocks and every row grew to
  36.4 against the other tables' 33).
- **Tables in a feed share one label column** (owner, 2026-10-31, docs/research/feed-rhythm-2026-10-31): a page's tables
  take `Table layout="fixed"`, so each first column is 27% (Primer's Name column) and values start on one line down the
  page (the API tab's were 84, 200 and 145 wide). A first column of marks (Do / Don't) stays `auto`; a page that sets its
  own `colgroup` for every table (Typography's list) keeps it.
- **Loose text sits 4 in from the frames** (owner, 2026-10-31: "should the text above the containers be inset 2 or 4px?
  maybe not quite as far as cursor but just slightly"): section titles and ledes, a page's lede, a family's or typeface's
  tabs, Show all, the Canvas path and Settings' titles start 4 in from the cards, tables, Stage and groups they sit over
  (`--_text-inset`, app.css; Cursor's titles 8, Primer's and Notion's flush). Home's ways to start a system are Settings'
  framed rows (a name, its line, Start), not Cards, whose 15/22 titles outranked their section (owner pick q-cards).
- **Every card's name sits at its top-left** (owner, 2026-10-31: "top-left everywhere"): in the frame's first row, its
  cap and start 16 from the frame (the feed's frame inset), 13/18 regular, on component examples, typeface cards, boards,
  images, screens, history and the Stage (Asset card `caption="above"`; tile.tsx GALLERY_LOOK). They were at the foot
  (typefaces, boards) or on hover (components, images).
- **One family of frames** (owner, 2026-11-01: "i like the idea that all containers feel consistent, and part of the same
  family, visually"; Labs › Feed showed three): every frame in a feed (a tile, an Asset card, a collection, a table, a code
  block, a group of Settings rows) holds its content at the frame inset (16) under the tile corner (16), on the tile fill
  inside the cards' edge. Tables and code blocks were the page's white in the darker block edge, Settings' rows white in a
  lighter one; now `FEED_TABLE` and `FEED_CODE` (tile.tsx) give them the tile fill and the cards' Stroke 2 through Table's
  and Code block's public hooks, and Settings' rows take the plain tile's fill and edge (styles/settings.css).
  A table's rows are the exception (owner, 2026-11-01): white rows under a grey header in light, tile-grey rows under the
  page's near-black header in dark, so its header always sits a step under its rows (`--area-table-head-fill`). Every
  feed card hovers one way: its edge one step darker and no lift (CARD_SCOPE's Hover edge 1 and Hover lift 0; plain
  tiles the same step), since the lift and the controls' two-step edge read too strong on a wall of cards.
- **The card, as picked** (owner, 2026-11-01, the card explorer, artifact KCvLgSPg…: "apply 8 and update the corner
  radius to 16, also dont add a stroke to the inset images"; "even closer to 4"): every card is its picture alone in a
  frame (the tile fill, the card edge, a 16 corner), the picture 8 in on every side (half the frame inset), and the name,
  its badges and controls sit 4 under the card on the page at the feed's 13/18, the name 4 in on the text edge, controls
  ending on the card's edge (Asset card `caption="outside"`, `--area-asset-card-inset`; plain tiles' head after the box).
  A colour keeps its name inside, in its ink. Cards are 16 apart (12 / 16 / 20 by density). Two shapes: square, and 16:9
  for anything designed, where a window fits whole; UI never runs to the card's edge. Images inside cards draw no edge.
  Components' No container is the same card clear at rest, appearing on hover. A project's status is one badge in two
  states, colour-coded and drawn as the status circles (owner: "color code the project status badge indicators"; "i dont
  like the tag icon for published, what happened to the circles"): published or live, the check circle, success; a draft
  or not yet published, the empty ring, caution (the dashed circle was too faint); plain, the icon coloured and no plate (tile.tsx `status`, StatusBadge).
  A Sidebar row shows the mark alone at its end, its words its name and tooltip (a project's Explorations). **Every status
  is that badge** (owner, 2026-11-02: "all badges are correct and consistent"; "apply new and more colors to the status
  badges"; "i prefer just the icon in the nav by itself with no backplate, but prefer backplates on badges everywhere
  else"), each state its own hue and circle mark (tile.tsx `STATUS`): done (Published, Live, Complete, Approved) the filled
  check, green; active the quarter ring, blue; in review the dashed check, purple; changes the alert, orange; a draft or
  unpublished changes the ring, orange; to do the dashed ring, grey; blocked or failed the cross, red; archived or
  deprecated the archive box, grey. **Badges sit on their plate everywhere**; only the Sidebar draws a status bare, its mark
  alone. **Words are the shortest name** ("Draft", "3 changes", "Live"; never the version or the system the card already
  shows). **Icons only on statuses**: the mark is the Sidebar's whole badge, so the plated badge carries it; every other
  badge is words. **One meaning per colour**: green done or passing, blue active or new, purple not final, orange needs you,
  red stopped or failing, grey a fact, a default or put away; gold (caution) is not used on badges ("i prefer the orange
  colored badges over the yellow/gold"). The whole list, with what each labels: `src/badge-catalogue.tsx`, Labs › Feed's
  badge tables. **The kit shows things in use, not notes about them** (owner, 2026-11-02: "remove any of the small type
  thats just there to describe the area feed kit. i want to see chat examples, responses, item trackers"): Labs › Feed's
  sections carry titles alone; it opens on a conversation, a response and an agent's turn (Reasoning, Steps, Plan, Edit
  summary, Approval, Turn notice), all Area's own (`src/chat-kit.tsx`). **A reply keeps to three type styles**: headings
  at title-xs (16/22 strong), reading text (15/22), and the UI text of the kit's own Table and Code block (13), the same
  frames as every table and code block in the feed (owner: "too many type styles ... shouldnt the table style and code
  style be like the other code block and tables"); then the data views the owner picked (heat matrix,
  calendar, tracker, ring, dot grid, then all 21 of the data views page's modules: owner, 2026-11-02, "Add all 21";
  `src/data-views.tsx`). Heat and calendars walk Area's blue ladder (the accent's blue; sky's deep steps read teal beside
  it), series colors paint bars, lines and parts, the status trio paints status, and a Meter among them takes
  `tone="data"` (series 1), its stacked parts each series' color. Section titles are title-xs (16/22), the ramp's settings and
  surface title, so a section heads the Cards in it. Other values
  stay neutral badges. The
  paragraph below is the day's history.
- **One card, three shapes** (owner, 2026-11-01: "they should all be the same just variants of each other … a square AR
  one for components specifically"; "more like 4:3"; "some projects might want a full thumbnail 16:9 cover"): every card
  is one card with one header, in **square** (components, colours; Asset card `aspect="square"`, Tile's default),
  **landscape 4:3** (screens, designs, Patterns, a project's pages, anything else; Tile `shape="landscape"`, a screen's
  default) or **cover**, a 16:9 picture running to the card's sides and foot under the same header (Home's timeline, a
  project's full thumbnail; Tile `shape="cover"`). A screen covers its picture from the top-left (setup-screen.tsx
  ScreenCover), as a design tool's frame thumbnail. A card's top-right holds badges and controls only: a value is a Badge.
  It was three builds (a square specimen tile, a 5:4 Asset card, a 16:9 screen tile) with their own headers. Cards show
  one picture (owner: "for normal project cards it should only be 1 visual"); a collection shows several as one card in two
  widths: the square card with its first four square, 2 × 2 (References; tile.tsx COLLECTION_CARD), and across a column a
  row of its images at their own ratios that scrolls sideways (Home; COLLECTION_STRIP, 192 tall). Its name and count
  top-left. Image galleries' Fixed ratio offers the same three: 4:3 (default), 1:1, 16:9.
- **Every card is drawn one way** (owner, 2026-11-01: "update the gaps, padding, text placement, etc to be more in line
  with the rest of the cards. can the card captions be smaller?"; then "a consistent header styling across all
  cards/containers"): the name at the ramp's xs, regular (11/14 at type 13; it was 13/18), its cap 16 from the top and
  side, in a header row the inset plus the cap tall, half the inset from the top; text in the row (a name, a value at the
  end) sits on the 16 text edge, and a control or badge centres on the name's line, its box as far from the end as from
  the top (a 26 button 7 and 7; a status badge no longer pushes the name down, as it did); the picture 15 under the cap
  (plain tiles had 12, Asset cards 15) and 16 from the sides and foot. A feed code block's header is the same row
  (Code block's inset hook): its language where a card has its name, Copy where a card has its controls; a picture held that far in keeps the small corner (8 at the default; images had 2, a
  collection's cells 0, screens 8), through Asset card's frame corner, which no longer runs out under a deep inset.
- **One count** (owner, 2026-11-01: "i like the updated counts in badges"; "id prefer if counts were not pills, but its
  okay if other badges are pills"): every number that follows a label (a section title, a card name, a Sidebar row) is
  Count soft sm, 14 tall at type 13, 11/14 regular on the mark plate, the corner setting's corner for its height (4), never
  a pill by default. It overhangs a title's line equally (tile.tsx FeedCount, `.studio-count`), so the title keeps its
  place. Section and card counts were muted numbers, the Sidebar's plain md; Count soft was 500 and a pill. A system whose
  themes still list `count` among their pills keeps pill counts until that theme changes (Themes › Shape › Pills).
- **Galleries of images have three views** (owner, 2026-11-01, after Are.na): **Grid** (the default), every card one
  square footprint and each image whole inside it at its own ratio (Asset card `fit="contain"`), so nothing is cropped and
  every card weighs the same; **Waterfall**, columns of cards at their images' own heights; **Fixed ratio**, every image
  cropped to one ratio (`fit="cover"`), 16:9 by default or 5:4 or 1:1 from the Ratio menu beside the switch; and List
  (view-controls.tsx GalleryMode, tile.tsx `imageCard`). The Grid was each image's own height with row tops aligned until
  then. Image cards hold their picture at the frame inset, as screens and collections do (`--area-asset-card-inset`,
  `.studio-images`).
- **Three feed layouts** (owner, 2026-11-01: "a tight margin variation (for galleries) and single column feed"): Canvas,
  the feed above (margin 32); **Gallery**, the margin down to the frame inset (12 / 16 / 20), still past the gap, for walls
  of images; **Column**, one item a row in the reading column (768), as Home. Labs › Feed (`#labs/feed`, ⌘K "Feed") shows
  every element a feed holds, one labelled section each, in all three, with the gallery views and the live spacings in
  the Inspector (`src/pages/feed-lab.tsx`, styles/feed.css). References takes Gallery (owner, 2026-11-01: "Yes, use
  Gallery"; its design viewer keeps its own ground); the margin is set on the whole Canvas, so the bar's path starts on
  the titles' line. Every other page keeps Canvas; Home and Settings read in the column.
- **Every page draws from one kit** (owner, 2026-11-01: "bring the rest of the system axes/categories up to speed … a
  big, expansive library of cohesive containers, visuals, text, titles, etc for all the pages in area"). A page's Canvas
  is made only of these blocks, each shown in Labs › Feed with the rule it follows; a page that needs something else adds
  it to the kit (and the lab) first, never a one-page drawing. Text: the section title, its count and subtitle
  (`CanvasSection`), a page's lede (`.studio-lede`), prose and a note (`.studio-feed__prose`, `__note`). Frames: the
  **card**, square or 16:9, its name, badges and controls under it (`Tile`, Asset card); the **specimen card**, the same
  card on the unit grid for one token (a corner, an edge, a shadow, a control's height, an easing's curve), its drawing
  in the middle, its value the badge (`SpecimenCard`, pages/foundation.tsx); the **colour card**, its name inside in its
  ink; the **type card**, Aa on the frame inset; **collection cards** (2 × 2, strip); the **image gallery** (Grid,
  Waterfall, Fixed ratio, List); the **table** (`FEED_TABLE`); the **scale table**, a ramp down the same table with its
  drawing at true size in the last column (`ScaleTable`: the space ramp and gaps as bars, durations as a crossing dot);
  the **code block** (`FEED_CODE`); **Settings rows**; the **Stage** and the **props table** (a family's Preview and
  API); the **colour scale** (Colors' step cards, the galleries' gap apart); and, for data, **stat cards**, a **chart** and
  **Meters**, each in Area's **Card** drawn as the feed's frame through its public hooks (`FEED_FRAME`: `--area-card-corner`,
  `-inset`, `-gap`, `-fill`, `-edge`, the table's corner, inset, fill and edge, in the cards' own scope; owner, 2026-11-02:
  "the feed kit should leverage and use real components and styles/colors anyway, not custom designs"). A stat card is
  Card's own parts: `CardDescription` for its name, `CardValue` for the figure, a tone `Badge` over its note in a
  `CardDescription` under it. Area has no chart component yet, so the chart is the Analytics pattern's drawing. Every mark that draws a value (a chart's line, a bar, a curve, a dot) is in the ink Area's
  Meter and Progress fill with, the Selection role, so a page's charts and Meters are one colour and change together. **A table's columns are sized by what they hold** (owner, 2026-11-02: "be more intentional about column widths and alignment in tables"): a table of names and descriptions keeps the label column (`layout="fixed"`, 27%, so those tables line up down a page); a table of values sizes each column to its content with Table's own cell options: a name or token `fit`, every number `numeric` and `fit` (set to the end in tabular figures, its heading with it, so digits line up), and the column that carries the row (a sample, a drawing, a description) takes the rest; rows that mix sizes sit on one baseline (`baseline`). The **type ramp** and a face's **type styles** are the feed's Table (`TypeTable`, src/type-kit.tsx): the style in the label column, then one column per metric (size, line height, tracking, weight; owner, 2026-11-02: "all have their own columns"), the sample last on one line at its size, clipped at the cell; the **type testers** keep display apart from body (owner, 2026-11-01, after Pangram Pangram's Altera Sans sampler): one full-width card with a single editable line at display size, then a heavy and a regular paragraph in two half-width cards, each card's controls one row along its top, Area's `Toolbar`: the typeface and style Selects a group of its items 8 apart, each as wide as its text, then each bar (Slider, label inline: label, rail, value) after the toolbar's divider, the bars sharing the rest of the row up to 192 each, scrolling sideways only where the Canvas is narrower than every control at its least (`TypeTesters`, first on every typeface's Specimen tab); a **typeface card** is 16:9 with the type alone in it ("Aa" or a paragraph from its top-left, the card inset in), and under it its name and two badges at most: Variable or Static (neutral, a fact), then Licensed (info: publishing needs the foundry's licence) or Not installed (caution); no badge for an open face or a file format (`TypefaceCard`; owner, 2026-11-02); a role's card (Typography) keeps a one-line header, size / leading and tracking, and Copy CSS under it. Sample copy is one pangram for every line of type, "The five boxing wizards jumped quickly." (owner, 2026-11-02), and abstract prose for every paragraph, a quiet scene with no subject of its own, with commas, a colon, a question, quotes and a figure and never an em dash (`TYPE_SAMPLE`, `TYPE_PARAGRAPH`; owner: "use some other placeholder copy for paragraphs", "more generic and/or abstract or niche literature, no m dashes"). **Every tile is Area's Asset card** (`Tile`, src/tile.tsx; owner, 2026-11-02: "Yes, rebuild tiles"; it reverses the 2026-10-21 rule that kept Asset card to the Components tab and drew a plain box of the app's own everywhere else): the gallery look (`GALLERY_LOOK`: the frame alone, the name, badges and controls outside under it), square or 16:9 (Asset card's `screen` aspect), a value as a badge and a project's status as its status badge. A colour paints the frame and holds its level inside in its ink, or under the card as every other card's (Colors' Label option, `paintLabel`). **Every card is one frame**: a design's, a reference's, a colour's and a type card share the Asset card's edge, fill (the cards' own scope, `CARD_SCOPE`), corner and the galleries' gap; a picture sits half the frame inset in (8), and text inside a card sits the frame inset in from its outer edge (16), its cap trimmed, as a colour card's level (owner, 2026-11-01). Research: `docs/research/type-presentation-2026-11-01`. **The glyph galleries are cards** (owner, 2026-11-02: "the glyphs
  can be in containers like the rest of the cards"): Icons' wall, a typeface's Glyphs and Labs › Feed's icon and type glyph
  galleries put each glyph on its own square Asset card (basic, in `CARD_SCOPE`: the cards' fill, edge, corner, hover and
  selected edge), the columns sharing the Canvas's width from its content edge, 8 apart (`src/glyph-sheet.tsx`); they sat
  bare on the Canvas with a row plate on hover until then. **One colour card** (owner, 2026-11-02, over several rounds: "not as wide",
  "include the hex and oklch information", "the name/text inside the card", "maybe square AR is better, but maybe the width
  can be much smaller ... the oklch values each have their own line"): every colour, a scale's step, a role's or a
  series', is Colors' card: the colour is the card, square, at least 112 wide on the glyph galleries' 8 gap, its name at the
  head and its values at the foot in the colour's own ink at the small text, a value a line (a step's hex, then L, C and H;
  a role's token) (`ColorCard`, `SwatchCard`, `.studio-color-grid`). UI copy says color, not colour. A picture's name sits under
  its card because the picture is the content; a colour's sits on it because the colour is. A scale's compact row and a separate Series section were tried and removed the same day (owner: "i dont really
  like this layout, remove it"; series are palette steps, so the Colors Inspector names a family's and a step's series).
  Cards are 8 apart both ways (a headless outside card
  took 7 at the top alone until 2026-11-02). The Colors Inspector names each family's series and each step's (series are
  palette steps since PR #198). The **icon and type glyph galleries** in
  the kit share one 64 card (`GlyphSheet cell`). A **type tester's
  bars** are the Inspector's: the name, the bar and its value field (`BarRow`, inspector-rows.tsx). Unframed: a **list**, the **timeline** and the **empty state**
  (`sm` in a section). The Feed Kit artifact is Labs › Feed captured
  from the app (`docs/research/feed-kit-2026-11-01/`). Spacing, Shape, Elevation and Motion drew bare rows and
  boxes on the page with their own type until 2026-11-01; they now use the scale table and the specimen card, and Motion's
  Play sits in the Canvas bar with every page's view controls.
- **Tables balance their insets** (owner, 2026-10-31: "why do the tables have so much more horizontal spacing inset added
  than vertical"): a md table's text sits as far from the rules as from the frame's side (14 on the ink), on the prose
  line (13/20), rows 39 at type 13 / 32 (Cursor's settings rows 42, Primer's 44).
- **The reading column** (owner, 2026-10-31): Settings, document feeds and a chat that takes the Canvas read at one
  measure, 768 (`--_reading-column`, app.css; Claude Code's default transcript width, Narrow, is 768). The Canvas's
  galleries and tables fill the Canvas instead.
- **One feed, altered for chat** (owner, 2026-10-31): the same steps name every feed. Section 48 on the Canvas, 32 in
  Settings, an exchange 24 in chat (Claude Code 20 / 24); heading → block 16 on the Canvas and in Settings, 12 in chat,
  a message → its reply (Claude 6 / 8); blocks: cards 12 apart, a group of rows, prose 16
  apart in chat; rows 42 one line and 60 with a description (Settings; Cursor 42 / 61). A chat has no page title (its bar
  names the thread) and a composer at its foot, the column's width. Settings groups rule their rows only between the
  text edges (16 in, as Cursor's 12 and Description list justified).
- A bar's controls sit as far from the side as from the top and the rule: 7, 24 tall
  (owner, 2026-10-18; Figma's panel tabs: 8 and 8).

**Canvas header**, at its end, in this order, every control ghost but the grid / list switch's track (owner,
2026-10-25: "make them more consistent, clean them up"):

1. filters: each a ghost menu button that reads its choice ("All statuses ⌄") and opens its options (was a soft Select,
   the bar's one filled box, a long choice running under its chevron);
2. Sort and group (rule 7), an icon menu;
3. how things are drawn (zoom, style, size). On Components the style is the Cards menu, an icon menu of two
   independent choices (owner, 2026-10-25: "there should just be 1 style of container"): **Container** (Basic, the
   name and Copy in its first row, the default; on hover until 2026-10-31) or **No container**; and **Fixed height** (5:4, the default) or **Waterfall**,
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
  (Components › family › tile), its plate 4 from the button's (its first letter 14 from the glyph); then Replay, zoom and previous / next,
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

## Type and rhythm in the kits

Owner, 2026-11-04: "be extra careful about defining when each size of the type ramp is used, as well as when to change
the foreground or weight, and the spacing rhythm between text. make sure to define chat kit and feed kit independently."
Evidence: Area's own census of both kits and the products' bundles (`docs/research/kit-type-2026-11-04/`). Values are at
type 13; every size moves with the Type setting, every gap with Density.

### Rules both kits keep

1. **One property changes at a time.** Hierarchy is drawn by size (structure: a title over its block), or by ink (a
   description, metadata, a header), or by weight (a name, a title); a step down never changes all three. Inside a row or
   a card, a label and its description share one size and the description drops one ink step (13 default over 13
   muted); only a caption or metadata drops a size, to 12, and then it is muted too.
2. **Weight rises only with the default ink.** 500 (`weight-strong`) is for titles, a name that starts a line (a person,
   a question, a frame's title) and controls; it is never set on muted text in the kits (a group label is muted and
   regular). Area has two weights in UI text: 400 and 500.
3. **Two inks for words, one for controls.** `fg-default` for what is read, `fg-muted` for what explains it (a
   description, metadata, a table's header, a group label, a placeholder of a row); `fg-quiet` belongs to ghost controls
   and icons; tone inks belong to badges, marks and diff counts.
4. **The smaller, the quieter.** 12 is always muted; 11 is a badge, a count, a key or a data label, never a sentence.
5. **Gaps are read on the glyphs**: a text's cap and baseline, a frame's edge. A line that belongs to a title or label
   joins it (no gap between their line boxes); joined lines sit 4 apart at most; groups 8 to 16; blocks 16; sections 48
   (feed) or turns 24 (chat).

### Feed kit (Labs › Feed; the Canvas)

| Role | Ramp | Ink | Weight | Where |
|---|---|---|---|---|
| Section title | `title-xs` 16/22 | default | 500 | `CanvasSection`, 4 in on the text edge |
| Section count | `text-xs` 11/14 on Count's soft plate | muted | 400 | after a collection's title only |
| Section lede | `text-sm` 12, prose line 18 | muted | 400 | one sentence, explaining pages only; the kit has none |
| Card name | `text-base` 13/18 | default | 400 | 4 under the card (or in its head), on the text edge |
| Card value | Badge, `text-xs` 11/14 | tone | 500 | the end of the name's row |
| A frame's title | `text-base` 13/18 | default | 500 | Card in the feed's frames (data views, stat cards, the tester), Card's title hook (Q-T1, applied) |
| Text in a frame (a cell, a label, a row, a choice) | `text-base` 13/18 (a md Table's cells 13/20) | default | 400 | every frame |
| What explains it (a description, a header, a muted cell) | `text-base` 13 | muted | 400 | joined to what it explains |
| Metadata on a row's line (time, step count, size) | `text-sm` 12 on the row's 18 | muted | 400 | the row's end |
| A caption or note standing alone, a timestamp | `text-sm` 12/16 | muted | 400 | under a block, 8 under it |
| A figure | `title-lg` 26/30 | default | 400 | a stat card's value |
| Data labels (axes, keys, ticks) | `text-xs` 11/14, mono | muted | 400 | charts and data views |
| Prose | `text-lg` 15/22, at most 80ch | default | 400 | paragraphs 16 apart between line boxes (`text-lg-prose-gap`; 27 on the glyphs, as a reply's), the block trimmed to its first cap and last baseline |
| Code | mono 13/20 in Code block; inline code 0.875em of its text | default | 400 | |

Widths: the feed is the Canvas's, from 424 (a 960 window with both panels) through 904 (a 1440 window with both panels)
to 1440 (panels closed) in the Feed Kit artifact's Width switch; under 560 the margin is 16. Grids count their columns
from the width (cards at least 260, four across at most), and nothing in the feed has a width of its own but the
reading column (768) for prose and timelines.

Rhythm: margin 32, sections 48, a title 16 over its block (to the frame's edge or the first cap), cards 16 apart, the
frame inset 16 and corner 16, a picture 8 in, text 4 in from the frames, a card's caption 4 under it, a visual
question's frame 8 over its question.

### Chat kit (Labs › Chat; a chat column 268, 456 or 768)

| Role | Ramp | Ink | Weight | Where |
|---|---|---|---|---|
| A reply's text, the person's bubble, the composer's field | `text-lg` 15/22 | default | 400 | paragraphs 16 apart |
| A reply's heading | `title-xs` 16/22 | default | 500 | one step over the text, one heading style a reply |
| Inline code | mono 0.875em | default | 400 | on its line's plate |
| An agent's work (Step, Reasoning, Plan, Edit summary, Turn notice) | `text-base` 13/18 | verb muted, detail default | 400 | 16 apart, on the text edge |
| A card's title (Approval's question, a frame's name) | `text-base` 13/18 | default | 500 (the question) / 400 (a frame's name) | 13 in from the edge |
| A card's choices and rows | `text-base` 13/18 | default; a choice's description muted, joined | 400 | plain rows, the number a muted digit on the question's edge |
| An answer's note (Recommended, Default) | `text-base` 13/18, after the label | muted | 400 | never a Badge; the recommended answer first |
| Metadata (a step's time, a plan's count, +/− counts) | `text-sm` 12 on the row's 18 | muted (+/− their tones) | 400 | the row's end |
| A timestamp | `text-sm` 12/16 | muted | 400 | 8 over its message |
| Keys, badges | `text-xs` 11 | muted / tone | 500 | Kbd, Badge |
| Tables and code in a reply | the feed's frames, `text-base` 13 | header muted | 400 | the column's edge, 12 in (`--_frame-inset`) |

Widths: a chat is one column at one of three widths, Panel 268 (the Inspector's least, less its insets), Split 456 (a
chat beside what it made) and Column 768 (the reading column), never wider; type and spacing never change with it, the
bubble, overflow, cards across and a question's columns do (two pictures across under 600, or under 440 for a question
that asks for three; one word answer a row under 400, a row of three or four under 560). A reply's cards never keep
empty tracks: two designs share the column.

Rhythm: turns 24 apart, a message 12 over its reply, a time 8 over its message, a reply's blocks 16 apart (text,
tables, code, cards, a visual question), trackers 16 apart, a visual question's frame 8 over its question, frames 12 in.
Every frame in a chat or a question takes the kit's corner (16) and the cards' stroke, a question in the feed as in a
chat (2026-11-04 kit pass: the activity log's cards were 20, the feed's question cards drew the app's heavier edge).
A chat has no section titles and no ledes: the kit's section titles are the kit's, not the chat's.

### Decided (owner, 2026-11-04: "Apply both")

- **Q-T1. A data card's title is the name role.** Card's title keeps `title-xs` and gains public hooks
  (`--area-card-title-size`, `-leading`, `-tracking`); the feed's frames set 13/18, weight 500, so the section's 16/22
  title heads its cards.
- **Q-T2. Text that opens or closes a block is read on its glyphs.** Message's reply trims its first and last lines;
  Step, Timeline, plain Plan and Edit summary, Turn notice and Timestamp give back their line's half-leading at their
  outer edge. Measured after: every text-first section 15.7–16 under its title (were 19–21), a person's turn 24 over the
  reply (29), a time 8 over its message (12), trackers 15–17 apart (20–25). A block that opens on a control (the
  Composer's picker) or a head with buttons (Edit summary pending) keeps its box (21, 19.6).
- **Q-T3. Collection cards** (checked 2026-11-04, withdrawn): the audit read 33 to the first picture; the card draws its
  frame and edge 16 under the title and holds its pictures 8 in, as every card. No change.

Decision page: https://claude.ai/artifact/KeEDPx5sUTQXE6iKtu6sw1 (Kit Type Decisions).

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

