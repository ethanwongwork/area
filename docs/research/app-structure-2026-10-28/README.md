# App structure, 2026-10-28

The Electron app's information architecture, as the owner confirmed it on 2026-10-28, and the phased plan to build it.
Review page: https://claude.ai/artifact/4nvLA9RLBaY2RZ1PedrcFn (model, Cursor measurements, composer, plan).
Phase 1 is built (2026-10-28, branch `claude/phase-1-new-navigation-1c3738`, PR #173; "As built" under Phase 1). Phase 2 is
built (2026-10-29, branch `claude/serene-maxwell-905675`; "As built" under Phase 2). Projects and publishing, the IA of
2026-10-29, are built next (the section after this one). The Theme header
fix that came out of the same review is built too (PRODUCT_UI.md, Setup).

## Systems, not brands (owner, 2026-10-29)

The owner renamed Brand to **System** after Phase 2 was built ("i dont like the term brand"): a system is the look and the
rules a product is built with (its themes, foundations, Area's parts drawn in them, patterns, visuals, voice, agent kit),
and a project is something made with one system. Below, every current and future section says System; Phase 1's "As
built" keeps the words it was built with. In the app: `#system/<id>/…` (old `#brand/…` links and saved tabs redirect),
`src/systems.ts`, `~/Library/Application Support/Area/Systems/<id>/system.json` (the Phase 2 build's `Brands` folder moves
over once). Updated IA with rough wireframes of every page, the nav and its takeovers:
https://claude.ai/artifact/Py4TnuPQvUckDVKQG3MsRf (also draws a system's Overview page and a project's Theme view that
only picks a system and theme, both for the owner to confirm).

## Projects and publishing: the IA of 2026-10-29 (built)

The owner's brainstorm of 2026-10-29 replaced the Library-as-boards and the separate Projects and Explore phases' shape
with one model (write-up: https://claude.ai/artifact/TRWJYDWrxVaxCTvtJNxwD5, revision 3, "one place"): **make in
Projects, edit and publish in the Library, share in Explore.** The Library is what's live (systems, products,
inspiration); its owners edit each item in place and publish when ready; projects are for new things and big changes.
Then (owner): "tabs can be libraries or projects, within each project there are a bunch of things in it (layers, pages,
explorations, versions), so those will be accessed through the left nav, but the tab itself in the canvas will always
just be the project itself".

As built (2026-10-29/30, branch `claude/ia-brainstorm-47487c`):

- **Tabs** hold one thing each, a project, a system, Inspiration or a lab, and never change what they hold: a place in
  another opens in the tab holding it, or a new tab (`src/studio.tsx` `navigate`, `src/places.ts` `tabHolds`).
- **The Sidebar is the tab's own** (`src/app-nav.tsx`): Home's tab shows the workspace (Home, Projects, the Library); a
  system's tab its sections and History; a project's tab its Overview, Pages and their layers, Explorations and Versions;
  each under a back row to Home.
- **Systems publish** (`src/systems.ts`, `src/publish.tsx`, `src/pages/history.tsx`): the themes are the working copy and
  `releases` hold what was published; Live / Working and Publish (before and after, the changed values, the kind as
  Fixes / Adds / Needs work in products, a note) while there are changes; History with Restore. A system file from before
  publishing starts with its current themes as v1.0.
- **Projects** (`src/projects.ts`, `src/pages/project.tsx`, `Projects/<id>/project.json`): a project uses one theme of one
  system as published; pages hold layers (the system's Patterns screens, Inspiration's images); explorations are themes
  tried from the system's and published into it (as an update to their theme or a new one); versions are named copies.
- **Inspiration** is the old Library page (Imagery's groups; `#inspiration`, `#library` redirects); the Titlebar's
  Library button opens it.

Not built yet: products (a project's screens published as a product's live screens), approval when a second person
joins, the "changed since you started" view when a project's exploration and the system's working copy both change one
theme (publishing an exploration replaces that theme in the working copy), Start a project from a system item, Share
and Explore, components or visuals as layers, and drawing or editing inside a layer.

## The confirmed model

Owner answers, 2026-10-28:

```
Area
├─ Workspace (private, or shared with a team)
│  ├─ Systems (several)       a system: Overview, Themes, Foundations, Components, Patterns, Visuals, Voice and
│  │                          guidelines, Agent kit
│  ├─ Projects               live, coded UI on one system; exploring → in review → shipped → archived
│  └─ Library                every file uploaded or saved; items stored once, on any number of boards (folders optional)
└─ Explore (public)         published projects (a live, clickable prototype), boards, systems; the Area Starter
```

- **Workspace + Explore.** Everything is private until published. Saving from Explore puts a reference in the Library.
- **Several systems per workspace.** Each project picks one; the Library is shared across them.
- **Library**, Are.na's model: an item is stored once and sits on any number of boards. It accepts any file:
  images, video, audio, documents, fonts, SVG, Lottie, 3D, links (captured), code, Figma frames, palettes, notes, agent
  skills, Area's measured captures. Each item records its source (uploaded, captured, generated through MCP, saved from
  Explore), licence and credit, tags and colours.
- **System visuals are promoted from the Library**: an approved visual with versions and usage rules, still linked to
  the item. Each visual records how it is made: in code (re-renders with the theme), uploaded, or generated (keeps its
  prompt).
- **Area's own system** is the Area Starter in Explore, forked to start from scratch, and a parts catalog that renders in
  the user's system. It never has a permanent place in a company's workspace.
- **A published project** gives viewers a live, clickable prototype. Not chosen (so not planned): view in my system,
  remix, case-study pages.
- **Profiles** later, not in the first version.

The brief's zones map onto it: System → Systems, Product and Lab → Projects (shipped and exploring states),
Library → Explore and the Area Starter.

## Where today's tabs go

| Today | Becomes |
|---|---|
| Theme · Setup | New system (Home) and New theme (System → Themes); the chat panel carries over |
| Theme · Browse | System → Foundations, a page per setting group |
| Components | System → Components |
| Typography, Color, Icons | System → Foundations |
| Testing | System → Patterns |
| Imagery | Library (references) and System → Visuals (promoted) |
| Materials | Labs, hidden (⌘K, Settings) |
| Inspector: Theme · Design · Code · Chat | Theme edits the open system's theme; Chat on every page |
| Inspector → Brand (exact colours, `src/brand.ts`) | Brand colours, part of a theme |

## Build plan

Each phase is its own session and pull request, judged by the owner in the app before the next starts. Every phase
keeps the app working and old links opening.

### Phase 0. The shell's questions (settled)

Settled by the owner, 2026-10-28, picking variation A on the shell canvas
(https://claude.ai/artifact/Fb9YBdJ3B1oVqhvEZQgPKL):

- **Layout:** Cursor-style universal left nav, Figma-style tabs on top, and takeover panels. Tabs work as a browser's:
  ⌂ Home first, then one tab per open system, project, board or design (type icon, name, ×; 120 to 170 wide); a click in
  the nav opens in the current tab, ⌘-click in a new one; each tab keeps its own left panel, scroll and selection. The
  top bar's end holds search (⌘K), the Library panel, the Inspector toggle and light and dark.
- **The sidebar:** the nav (New, Home, Library, Explore; then Systems, Projects and Boards sections, each with a +; the
  person's row at the foot). The open system expands to its sections (Overview, Themes, Foundations, Components,
  Patterns, Visuals, Voice and guidelines, Agent kit). Long lists (Components' families, Icons' categories, a Library's
  boards) and a design's Pages and Layers take the panel over, under a back row ("‹ Northwind").
- **The open system** is named by its expanded row in the nav and by its tab; no separate switcher.

- **Opening** (owner, 2026-10-28): Area reopens the last place with its tabs restored; Home is one click away (the
  Home tab).
- **The Inspector's Brand section** (`src/brand-settings.tsx`, exact colours) is renamed Brand colours, so "Brand"
  means only the new place (owner, 2026-10-28).

Nothing is left open before Phase 1.

### Phase 1. The navigation, on today's content (one brand, "Area")

- **Routes.** A `PLACES` registry replaces `TABS` (`src/studio.tsx`): `#home`, `#brand/<id>/<section>/<item>`,
  `#library/<board>/<item>`, `#projects/…`, `#labs/<id>`. Old links redirect: `#theme` → Themes, `#components` →
  Components, `#typography`, `#color`, `#icons` → Foundations, `#testing` → Patterns, `#imagery` → Library,
  `#materials` → Labs. The saved tab migrates once.
- **Titlebar**: the sidebar toggle, back and forward, then the tabs (Phase 0), then search (⌘K across every place), the
  Library panel, the Inspector toggle, light and dark. Tabs hold what is open (the Area brand, a Library board, Labs);
  the Home tab arrives with Home in Phase 2.
- **Sidebar**: the nav (Phase 0), with the Area brand expanded to its sections. Components and Icons take the panel
  over with today's lists, under "‹ Area"; so does the Library with its boards.
- **Opening**: the open tabs and each tab's place are saved and restored at launch, replacing today's saved tab.
- **Brand colours**: the Inspector's Brand section is renamed Brand colours. Its switch, already labelled Brand
  colours, gets new words in the same change so the two don't repeat.
- **Pages, all existing**: Themes (one theme, "Default", New theme opens the Setup chat); Foundations (an overview of
  the Browse cards, then Color, Typography, Icons, and a page per remaining setting group: Shape, Space, Depth,
  Motion, Material); Components; Patterns (Testing's screens); Library (Imagery, renamed); Labs (Materials).
- **Not yet**: Home, a second brand, Visuals, Projects, Explore. Home and Projects appear in the sidebar only when
  they exist.
- **Docs and checks**: PRODUCT_UI.md's layout sections rewritten; a routing test in `test:desktop` (every old hash
  lands where the table says); `check:app-css`, playgrounds, typecheck; the app in light and dark.

**As built (2026-10-28).** Every item above, with these differences, each for the owner to confirm in the app:

- **Foundations' pages are the registry's groups.** Color, Typography and Icons, then one page per `SETTING_GROUPS` heading
  (Page, Accent, Emphasis, Size, Shape, Stroke, Shadow, States, Effects), since the registry names settings and headings
  (owner, 2026-10-19), rather than the plan's Shape, Space, Depth, Motion and Material, which would have regrouped them.
  There is no Material page: Material is not in Browse's settings; it stays in the Inspector, and its bundles in Labs.
- **Every page with a list takes the Sidebar over**, not only Components and Icons: Color, Typography, Patterns, the
  Library and Labs too, one rule. Foundations, its group pages and Themes keep the nav.
- **The nav's third level** (Area › Foundations › its pages) needed Nav to indent a nested group inside another: built in
  Nav (nav.css, spec history 2026-10-28).
- **Brand colours**: the Brand section and its switch were already gone (folded into Accent's Exact colour, 2026-10-27),
  so nothing was renamed Brand colours. The last "Brand" words in the Inspector now say what they are: Status hues
  Matched / Area's (was Brand's / Area's), the shade bar's mark Exact (was Brand).
- **Tabs** follow Claude Code's browser tabs (owner, 2026-10-29): they hug their names, the close shows on hover, focus and the current tab, and
  New tab (+, ⌘T) opens search into a new tab; inactive tabs are grey (Nav's horizontal rest ink). They are named by what
  they hold (Area, Library, Materials), so two tabs on Area read alike. The Library button
  opens the Library tab, or switches to it. Back and forward walk the tab's own history (not the window's). The scroll
  of a tab's Canvas is not kept yet when switching tabs.
- **Tabs at their edges** (sheet https://claude.ai/artifact/1RWLR2gyESHHwxNKJ4XpsZ, 2026-10-29): 120 to 170 wide; the close
  keeps no space and lands over the name's end, which fades (owner: Figma's way); too many tabs scroll, the current kept
  in view. Tab keys in the app menu (⌘T, ⌘⇧T, ⌘W, ⌃Tab, ⌘1–9; ⌘W had closed the window) and a Tooltip with the full name on
  cut tabs, 2026-10-29. Open: a soft edge where the strip is cut (Cursor shades it); later, drag to reorder, a tab's
  context menu, a tab's own scroll kept; tab groups not before Projects. Home as a fixed first tab: built in Phase 2.
- **Search** is Command palette over every place; each list's filter moved into its takeover.
- **New theme** has no way back in its own panel: Back, the tabs or ⌘K leave it.

### Phase 2. Home and several systems

- **A system on disk**, as Imagery's library is: `~/Library/Application Support/Area/Systems/<id>/system.json` (name,
  origin, themes; a theme is today's Canvas settings, Material and system colours). Never in the repository.
- **Settings become the open system's theme.** Today's global Canvas settings (`useStudio().canvas`, localStorage) move
  into the active theme; the current saved values become the Area system's Default theme. The largest change in the
  plan: every page reads the active theme.
- **Home**: systems, recent projects, boards; New system from the Area Starter (a fork of its values), from an import
  (a stub until import exists), or by describing it (the Setup chat).
- **More systems in the nav**: each a row under Systems, opened in a tab (Phase 0). Each system's Components, Patterns
  and Foundations render Area's parts in that system's theme: the parts catalog. A system with its own imported
  components comes with import, later.

**As built (2026-10-29).** Every item above, with these decisions and differences, each for the owner to confirm in the app:

- **The Home tab** is Nav's new icon-only item (a square plate, the icon centred; Figma's `tab--fileBrowserTab`, 40 by
  38), always first, never closed and always on Home. Every other tab closes, the last one too, leaving Home. From Home a
  place opens in the tab already holding its system (or the Library, a lab), else a new tab at the end (Figma's file
  browser); Home from any tab switches to the Home tab. **⌘1** stays the first tab after Home, ⌘1–8 count the tabs after
  it, ⌘9 the last; **⌘⇧H** is Home (Finder's Go › Home), in the app menu. **New tab** (+, ⌘T) still opens search into a
  new tab: Home is always one click away, and a new tab on Home would be a second Home. With nothing saved the app opens on
  Home alone.
- **The system file** (`src/systems.ts`): `{ version, id, name, origin, created, theme, themes: [{ id, name, canvas,
  material, colours, accent }] }`; `accent` is the exact accent (Brand colours until 2026-10-27), `colours` the exact page colours, `theme`
  the chosen one. Every value is checked on the way in by the app's own restore functions, so a hand-edited or older file
  opens. Writes go through a temporary file and a rename; a deleted system's folder goes to the Trash (`shell.trashItem`),
  and the Area system can't be deleted. A capture neither reads nor writes the folder; the browser preview keeps its systems
  in its own storage.
- **The settings move**: `useStudio()` keeps its names (`canvas`, `material`, `colours`, `brand`), now the open system's
  chosen theme, so no page changed to read it. The open system is the current tab's, or on Home, the Library and Labs the
  last one a tab showed. The one-time migration runs when no Area system is on disk: the saved `canvas`, `material`,
  `colours` and `brand` become its Default theme (a Canvas from before positions or picks converts on the way, as before);
  the old localStorage keys are left and no longer read.
- **Several themes** per system on Themes: double-click or Use chooses one; New theme adds one at Area's values and opens
  the Setup chat on it. Rename and delete a theme are not built.
- **Home**: Systems (Setup's screen in each system's theme, as Themes' cards), New system (three cards: Area Starter, Describe
  it, Import marked Later; one dialog with the name and the three as card radios), Boards (the Library's groups as Imagery's
  group cards), Recent (the last 8 places opened, a Table). The Inspector shows the chosen system with Open, Rename and
  Delete. A card shows a system's exact colours only for the open system: those are one rule in the document's head.
- **Links**: `#home` is a place, so an example screen's own `#home` link would have opened it. The Workspace now keeps
  every specimen's in-page link in the specimen (a hash link's click in the Canvas or the Inspector that nothing handled is
  prevented), which also stops a demo's `#library` link opening the Library, as it did in Phase 1.
- **Not yet**: Projects (Home's Recent shows places, not projects), Explore, a system's Overview, Visuals, Voice and Agent
  kit sections, renaming or deleting a theme, import.

### Phase 3. The Library and system Visuals

- **Items and boards.** Imagery's store (`library.json`, `originals/`, `thumbs/`, `electron/main.cjs`) grows to items
  of any type with metadata (type, source, licence, credit, tags, colours, dates) and boards that hold references.
  Folders optional.
- **Adding**: drag and drop, paste, a link (captured: title, image, URL), a file picker; Electron reads and copies the
  file into the library folder.
- **Viewing**: a board as a grid, waterfall or list; one item in a viewer per type (image, video, PDF, font specimen,
  SVG, text and markdown, skill files); search, tags, similar colours.
- **Promote to system** → System → Visuals: approved visuals with versions, usage notes and how each is made (code,
  uploaded, generated).

### Phase 4. Projects

- **A project**: a system and theme, screens, states (exploring, in review, shipped, archived), references to Library
  items. The Northwind screens (`src/setup-screen.tsx`, Testing) become a sample project.
- **Viewing**: screens as a grid, one screen large, a click-through prototype from the screens' own links.
- **Making screens**: through Chat and code first (the agent writes screens from Area's components); visual editing
  is its own later project.

### Phase 5. Explore and publishing (needs a service)

- Accounts, hosting and moderation sit outside the local app; this phase starts with a design and service plan.
- First step inside the app: Publish exports a project as a live prototype (a static build in its theme) and a board
  as a page; the Area Starter appears in Explore. Profiles later.

### Across every phase

- ⌘K reaches every place and item; Chat knows the open place.
- Empty states name what will appear and how to add the first one (PRODUCT_UI.md rule 10).
- `area-foundation-change` (it names the Theme and Components tabs), AGENTS.md's Start section (the titlebar's tabs)
  and PRODUCT_UI.md are updated in the phase that changes them.
