# App structure, 2026-10-28

The Electron app's information architecture, as the owner confirmed it on 2026-10-28, and the phased plan to build it.
Review page: https://claude.ai/artifact/4nvLA9RLBaY2RZ1PedrcFn (model, Cursor measurements, composer, plan).
Phase 1 is built (2026-10-28, branch `claude/phase-1-new-navigation-1c3738`; "As built" under Phase 1). The Theme header
fix that came out of the same review is built too (PRODUCT_UI.md, Setup).

## The confirmed model

Owner answers, 2026-10-28:

```
Area
├─ Workspace (private, or shared with a team)
│  ├─ Brands (several)       a brand: Overview, Themes, Foundations, Components, Patterns, Visuals, Voice and
│  │                          guidelines, Agent kit
│  ├─ Projects               live, coded UI on one brand; exploring → in review → shipped → archived
│  └─ Library                every file uploaded or saved; items stored once, on any number of boards (folders optional)
└─ Explore (public)         published projects (a live, clickable prototype), boards, systems; the Area Starter
```

- **Workspace + Explore.** Everything is private until published. Saving from Explore puts a reference in the Library.
- **Several brands per workspace.** Each project picks one; the Library is shared across them.
- **Library**, Are.na's model: an item is stored once and sits on any number of boards. It accepts any file:
  images, video, audio, documents, fonts, SVG, Lottie, 3D, links (captured), code, Figma frames, palettes, notes, agent
  skills, Area's measured captures. Each item records its source (uploaded, captured, generated through MCP, saved from
  Explore), licence and credit, tags and colours.
- **Brand visuals are promoted from the Library**: an approved visual with versions and usage rules, still linked to
  the item. Each visual records how it is made: in code (re-renders with the theme), uploaded, or generated (keeps its
  prompt).
- **Area's own system** is the Area Starter in Explore, forked to start from scratch, and a parts catalog that renders in
  the user's brand. It never has a permanent place in a company's workspace.
- **A published project** gives viewers a live, clickable prototype. Not chosen (so not planned): view in my brand,
  remix, case-study pages.
- **Profiles** later, not in the first version.

The brief's zones map onto it: System → Brand, Product and Lab → Projects (shipped and exploring states),
Library → Explore and the Area Starter.

## Where today's tabs go

| Today | Becomes |
|---|---|
| Theme · Setup | New brand (Home) and New theme (Brand → Themes); the chat panel carries over |
| Theme · Browse | Brand → Foundations, a page per setting group |
| Components | Brand → Components |
| Typography, Color, Icons | Brand → Foundations |
| Testing | Brand → Patterns |
| Imagery | Library (references) and Brand → Visuals (promoted) |
| Materials | Labs, hidden (⌘K, Settings) |
| Inspector: Theme · Design · Code · Chat | Theme edits the open brand's theme; Chat on every page |
| Inspector → Brand (exact colours, `src/brand.ts`) | Brand colours, part of a theme |

## Build plan

Each phase is its own session and pull request, judged by the owner in the app before the next starts. Every phase
keeps the app working and old links opening.

### Phase 0. The shell's questions (settled)

Settled by the owner, 2026-10-28, picking variation A on the shell canvas
(https://claude.ai/artifact/Fb9YBdJ3B1oVqhvEZQgPKL):

- **Layout:** Cursor-style universal left nav, Figma-style tabs on top, and takeover panels. Tabs work as a browser's:
  ⌂ Home first, then one tab per open brand, project, board or design (type icon, name, ×; 120 to 170 wide); a click in
  the nav opens in the current tab, ⌘-click in a new one; each tab keeps its own left panel, scroll and selection. The
  top bar's end holds search (⌘K), the Library panel, the Inspector toggle and light and dark.
- **The sidebar:** the nav (New, Home, Library, Explore; then Brands, Projects and Boards sections, each with a +; the
  person's row at the foot). The open brand expands to its sections (Overview, Themes, Foundations, Components,
  Patterns, Visuals, Voice and guidelines, Agent kit). Long lists (Components' families, Icons' categories, a Library's
  boards) and a design's Pages and Layers take the panel over, under a back row ("‹ Northwind").
- **The open brand** is named by its expanded row in the nav and by its tab; no separate switcher.

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
  context menu, a tab's own scroll kept; Home as a fixed first tab in Phase 2; tab groups not before Projects.
- **Search** is Command palette over every place; each list's filter moved into its takeover.
- **New theme** has no way back in its own panel: Back, the tabs or ⌘K leave it.

### Phase 2. Home and several brands

- **A brand on disk**, as Imagery's library is: `~/Library/Application Support/Area/Brands/<id>/brand.json` (name,
  origin, themes; a theme is today's Canvas settings, Material and brand colours). Never in the repository.
- **Settings become the open brand's theme.** Today's global Canvas settings (`useStudio().canvas`, localStorage) move
  into the active theme; the current saved values become the Area brand's Default theme. The largest change in the
  plan: every page reads the active theme.
- **Home**: brands, recent projects, boards; New brand from the Area Starter (a fork of its values), from an import
  (a stub until import exists), or by describing it (the Setup chat).
- **More brands in the nav**: each a row under Brands, opened in a tab (Phase 0). Each brand's Components, Patterns
  and Foundations render Area's parts in that brand's theme: the parts catalog. A brand with its own imported
  components comes with import, later.

### Phase 3. The Library and brand Visuals

- **Items and boards.** Imagery's store (`library.json`, `originals/`, `thumbs/`, `electron/main.cjs`) grows to items
  of any type with metadata (type, source, licence, credit, tags, colours, dates) and boards that hold references.
  Folders optional.
- **Adding**: drag and drop, paste, a link (captured: title, image, URL), a file picker; Electron reads and copies the
  file into the library folder.
- **Viewing**: a board as a grid, waterfall or list; one item in a viewer per type (image, video, PDF, font specimen,
  SVG, text and markdown, skill files); search, tags, similar colours.
- **Promote to brand** → Brand → Visuals: approved visuals with versions, usage notes and how each is made (code,
  uploaded, generated).

### Phase 4. Projects

- **A project**: a brand and theme, screens, states (exploring, in review, shipped, archived), references to Library
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
