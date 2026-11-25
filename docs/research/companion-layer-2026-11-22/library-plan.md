# The Library: second pass (2026-11-25)

This is the plan every worker on this pass follows. Read all of it before your own task. It is the one place decisions are
recorded; if your task needs a decision that is not here, report back instead of deciding alone.

## The owner's notes (2026-11-25, verbatim)

- "the ui, and interaction is overall too complicated still."
- "i thought area has much more to it than just the 54 items inside the area folder? can you show the entire area design system?"
- "i want to focus on building the file explorer and layers panel, showing each item (maybe use custom color icons like cursor?)"
- "counts maybe dont need a badge backplate. can you update the count component?"
- "update the design of the gallery to be a bit more of an interesting grid. maybe the containers need to be rounder? maybe
  different viewing modes with different density or alignment, offset containers or centered/no containers, i want to make
  sure the way different visuals are shown: images, videos, logos, typography, individual glyphs, colors, icons, icon
  groups, color ramps, components, motion concepts, guidelines, documentation, folders, ui frames, product ui for
  desktop/mobile, etc. there are so many ways to show individual things and even groups of those individual things."
- "i like the tabs but want to really be intentional about the header and tab header below: what controls go in which,
  should it be breadcrumbs? what types of viewing modes should be available? tabs sit below but does the design of the
  tabs need to be changed so the unselected tabs arent just floating there?"
- "shouldnt the left panel have a nav above the file with home, and some of the other nav items from before? i think there
  should be some 'permanent' nav items besides just projects. i still want this app to showcase different work and designs
  from others and be an inspiration collection hub, and make it easy to add those into your inspiration folders or
  context/data folders. i really do like the idea of combining this as a file explorer that visually shows everything you
  have as something to work on or have worked on or used to inspire or inform your work."
- "allow each item or thing to be iterated on, isolated in view so you can see something in context, up close, in full
  view, and if its a button, you can interact with it, edit it, make changes, save those changes to the file, move things
  from in progress to your design system, build a new ui flow, you can do all this through the chat interface, which is
  connected to your IDE or CLI or whatever, and acts as a harness that can translate your input and make the changes"
- "only show the right panel when necessary."
- "make sure that the localhost build is properly built, its very buggy and doesnt really work, the interactions for tab
  hovers, nav item hovers, and everything just feels very clunky and not very smooth, except the segmented control
  interaction animation."
- "make no mistakes."

## The owner's references

Twelve images, in
`/private/tmp/claude-501/-Users-ethanwong-Desktop-area--claude-worktrees-area-serif-c-9ea0ff/c139bdd5-5329-4366-8b9e-084220da4ac6/images/`.
Open the ones your task names with the Read tool. Never copy them into the repository (the file-browser ones show personal
file names). Never name the products they come from in app copy, docs rules or review pages.

| File | What it shows | What we take from it |
|---|---|---|
| `1.png` | A menu whose rows each have a small line icon in its own color (orange, red, purple, green), grey for plain rows | Kind icons: one glyph and one color a kind group |
| `2.png` | Objects on a white page with no containers, centred in an even grid, wide gaps | The Plain view: no frames, each thing in its own shape |
| `3.webp` | Cards of different heights in offset columns, 16 corners, name then a muted line under each | The Flow view: natural shapes in offset columns |
| `4.png` | Very round containers (about 80 on a 380 card), name and a muted line centred below | Rounder frames; a corner that grows with the frame |
| `5.png` | A plain left nav of icon rows; group cards showing 2 large and 3 small members; a grid of circles | The permanent nav; how a group shows its members |
| `6.png` | White cards 8 apart on a grey page, the object centred, name and facts at the card's foot | A tight grid; the page a step darker than the card |
| `7.webp` | Rows of many small thumbnails, each group headed by a date, a title and a plain count at the far end | Dense size; group headings with plain counts |
| `8.webp` | Eight columns of small pictures in natural shapes with tiny captions | Flow at the small size |
| `9.webp`, `10.webp` | A file browser: back and forward, the folder's name, four view modes as one segmented control, a group menu, actions, search; icons with names under them, no containers | The header's order; Plain view; files as their own shapes |
| `11.webp` | The same with two tabs: a full-width bar where unselected tabs sit in a grey trough and the selected one is a white plate, a plus at the end | The tab bar: a trough, never floating tabs |
| `12.webp` | Groups headed by a plain title with "Show All (251)" at the far end | Group headings; plain counts; Show all |

## What we are building

One screen, in Labs › Library (`#labs/library`), that is a file explorer for everything visual. It stays a lab: the old
places in the app are untouched.

### Decisions (the conductor's, for the owner to review)

1. **Navigation is a browser's.** A click opens the thing in the current tab. ⌘-click, middle click or "Open in new tab"
   opens a new tab. Each tab has its own Back and Forward. The location is in the hash (`#labs/library/<id>`,
   `#labs/library/home`, `#labs/library/discover`) so the app's Back and Forward work. (This replaces "a click opens a
   new tab", which would fill the tab bar once all of Area is there.)
2. **One click opens.** No select-then-open. A card's other actions (Open in new tab, Add to, Move to, Duplicate, Remove)
   are in a More menu that shows on hover or focus, and in a context menu.
3. **The Sidebar** has, top to bottom: the permanent nav (**Home**, **Discover**), a rule, then the file tree. The tree's
   top folders are **Area** (the system), **Project one**, **Campaign one**, **References** (saved inspiration) and
   **Context** (research, data, guidelines, instructions for agents). A row is: chevron (folders), the kind's icon in its
   color, the name, and for a folder a plain muted count at the end.
4. **The header** (one row) has, from the start: the path as breadcrumbs, the last crumb being the title; at the end: the
   view switch for what is open, the View menu, Add, and the right panel's toggle. Nothing else.
   - A folder's view switch: **Grid**, **Flow**, **Plain**, **List** (icons, each with a tooltip).
   - An element's view switch: **Isolated**, **In context**, **Code**.
   - The View menu holds size (Small, Medium, Large) and Group by kind for a folder; zoom and Full view for an element.
5. **The tab bar** (the row under the header) is a trough the width of the Canvas. Open tabs sit in it side by side with
   hairlines between unselected ones; the selected tab is a plate in the Canvas's color. Each tab shows its kind icon and
   name, and its close on hover, focus or when current. A plus at the end opens a new tab at Home. It is always shown.
6. **The gallery** has one card and four views:
   - **Grid:** frames in even columns; square, or 16:9 for the wide kinds. Corners rounder than today and growing with the
     frame.
   - **Flow:** each thing at its natural shape, in offset columns (a photo at its own ratio, a phone tall, a color square).
   - **Plain:** no frames. Each thing sits centred in an even grid in its own shape, with its name under it.
   - **List:** rows with a small picture, the kind, one fact.
   - Three sizes (Small, Medium, Large) change the columns. Glyphs, icons and emoji keep their sheet of cells in every view.
7. **The right panel shows only when needed.** It is closed on Home, Discover and folders. It opens by itself for an
   element that has properties to edit, and stays closed for the rest of the session once the owner closes it. The header's
   toggle and a Chat action open it anywhere. Its views are Design, Files and Chat.
8. **An element's page** shows it alone on a stage, live and usable (a button can be pressed), with zoom; **In context**
   shows it inside a screen that uses it; **Code** shows what it is kept as. Under it: its sub-elements (Variants,
   Alternates, Versions) and its files. Changing a property shows a bar: **Keep**, **Keep as alternate**, **Reset**.
9. **Status.** An element is **In progress** or **In system**. Anything outside Area's folder, and any alternate, is in
   progress. **Add to system** moves it into a folder of Area. Home lists what is in progress.
10. **Discover** shows work by others as the same cards. **Add to** on a card puts it in References, Context or any folder.
11. **Counts are plain numbers** (muted, tabular), never on a plate, in the tree, tabs and headings.
12. **All of Area is in the Area folder**: every color ramp and role, every typeface and type style, every foundation
    scale, every icon, every component family with its variants, every pattern and example, its illustrations and imagery,
    its guidelines and research. It is read from the app's real sources, never retyped.

### Words

- App copy follows `docs/WRITING.md`. Sentence case. No git words (draft, save, publish, restore, commit): use Keep,
  Keep as alternate, Bring back, Add to system.
- "Color" (US) in UI copy.
- Example people are David Tee. Never invent a product or project noun: "Project one", "Campaign one".
- No product names as design references in copy, comments that render, or docs rules.

## Code map

All paths are under `apps/desktop/src/`. One owner a file in each phase; a file you do not own is read-only. If you need a
change in someone else's file, say so in your report (or, for `library/store.ts` only, make a small additive edit,
re-reading the file first).

| File | Holds | Phase 1 owner | Phase 2 owner |
|---|---|---|---|
| `library/model.ts` | Types: folders, elements, files, locations, the catalog | Structure | frozen |
| `library/store.ts` | The Library's state and actions, one external store with selectors | Structure | frozen (additive only) |
| `library/catalog.ts` | Joins the catalogs into one tree; lookups (`folderOf`, `pathOf`, `allIn`, `nameOf`) | Structure | frozen |
| `library/catalog-sample.ts` | Project one, Campaign one, References, Context (today's sample data) | Structure | Home and Discover |
| `library/catalog-area.ts` (+ helpers it needs) | The Area folder, read from the app's real sources | Catalog | frozen |
| `element-kinds.ts`, `element-kit.tsx` (the `DRAWINGS`) | Kinds and what each draws | Catalog | Gallery (the card only) |
| `library/sidebar.tsx`, `library/kind-icons.tsx`, `styles/library-sidebar.css` | The nav and the tree | Structure (moved as is) | Sidebar |
| `library/header.tsx`, `library/tabs.tsx`, `library/panel.tsx`, `styles/library-header.css`, `studio.tsx` | The header, the tab bar, when the right panel shows | Structure (moved as is) | Header |
| `library/gallery.tsx`, `styles/library-gallery.css`, `styles/elements.css`, `pages/elements-lab.tsx` | A folder's views and the card | Structure (moved as is) | Gallery |
| `library/element-view.tsx`, `library/inspector-design.tsx`, `library-parts.tsx`, `styles/library-element.css` | An element's page and its Design view | Structure (moved as is) | Element |
| `library/home.tsx`, `library/discover.tsx`, `styles/library-home.css` | Home and Discover | Structure (stubs) | Home and Discover |
| `pages/library-lab.tsx` | Composition only: reads the store, hands regions to `Workspace` | Structure | frozen |
| `packages/**` Count, `tile.tsx` (`CanvasSection`'s count) | The Count component and its uses | Count | frozen |

## Rules for every worker

- Read `AGENTS.md` first, then the docs it names for your task. `docs/PRODUCT_UI.md` governs the app's own UI.
- Build from Area's components (`@area/react`, `@area/icons`) and tokens. A length that is not a token is a pick, marked
  `/* pick */` with its reason. App UI notes change the real component, never app-only CSS that restyles one.
- Reuse what the app has before writing new: `view-controls.tsx` (view switch, view options), `stage.tsx` (stage, zoom,
  properties), `glyph-sheet.tsx`, `tile.tsx` (`Tile`, `TileGrid`, `CanvasSection`), `app-nav.tsx` (`AppTabs`, `AppNav`),
  `inspector-rows.tsx`, `content/pages.mjs` and `content/registry.tsx` (every family and its demos), `token-catalog.ts`,
  `pages/icons.tsx`, `pages/typefaces.tsx`, `pages/illustrations.tsx`, `pages/imagery.tsx`, `content/playgrounds.tsx`.
- Performance is a requirement: all of Area is hundreds of live components and 700 icons. Nothing off screen may mount its
  live drawing; a state change must re-render only what reads it; a hover must never cause a React render.
- Light and dark both. Dark stays near black.
- Keyboard: everything reachable, focus visible, focus returns to its opener.
- Do not commit, push, stash or switch branches. Do not touch files outside your ownership. Preserve unrelated edits.
- Other workers are editing this checkout at the same time. Run `npx tsc -p apps/desktop --noEmit` and fix only the
  errors in your files. If the app shows an error from a file you do not own, wait a minute and try again.
- The dev server is running on port 4400 with the owner's Area window open on it. Never stop it, restart it or start a
  second one. Never `pkill` Electron. To look at your work, save a frame from a separate window:
  `apps/desktop/electron/main.cjs --capture=<png> --hash=<hash> --theme=<light|dark> --width=<n>` with `--run=<script>`
  for interactions (read `main.cjs` and `docs/DEVELOPMENT.md` for the exact form), writing only into the scratchpad:
  `/private/tmp/claude-501/-Users-ethanwong-Desktop-area--claude-worktrees-area-serif-c-9ea0ff/c139bdd5-5329-4366-8b9e-084220da4ac6/scratchpad/<your-task>/`.
  Look at every frame you save, in light and in dark, before you report.
- Say what you verified and what you could not. An unverified claim reported as done is the worst outcome.
- Your report, as your final message: what you built (files), what you verified and how, what is not done, and any
  decision you need. Under 400 words.

## Store API

Written by the Structure worker (2026-11-25). Everything is in `apps/desktop/src/library/`. Actions are plain module
functions, stable for ever: pass them to memoised rows as they are. Never subscribe to the whole state.

### Reading the store (`store.ts`)

- `useLibrary<T>(selector: (s: LibraryState) => T, equal = Object.is): T` — the slice `selector` picks; the component
  re-renders only when it changes by `equal`. Pass `shallow` when the selector builds a fresh array or object of stable
  parts (`useLibrary(s => s.tabs.map(t => t.id), shallow)`).
- `shallow(a, b): boolean` — same keys, values equal by `Object.is`.
- `getLibrary(): LibraryState` and `subscribeLibrary(listener): () => void` — outside React (handlers, effects, tests).
- `useLocation(): Location` — the current tab's location. `useCatalogVersion(): number` — subscribe to it in anything
  that draws the tree's shape (folders' contents, counts, paths): it bumps when an element is moved or added.
- Selectors: `selectCurrentTab(s): LibraryTab`, `selectLocation(s): Location`, `selectCanBack(s)`, `selectCanForward(s)`,
  `sameLocation(a, b): boolean`.
- Per-id derived values (cached: the same object until what it is made from changes, so they are safe in selectors):
  `stateOf(id, s?) : ElementState` (kind's initial + catalog + kept + unkept changes), `itemOf(id, s?): ElementItem |
  undefined` (what `ElementCard` takes), `alternatesOf(id, s?)` (catalog's, then the owner's), `versionsOf(id, s?)`
  (owner's newest first, then the catalog's `past`), `filesOf(id, s?)` (an element's or a folder's: catalog's, then
  added), `isChanged(id, s?)` (unkept changes: show the Keep bar), `statusOf(id): "system" | "progress"` (inside Area's
  folder is In system; anything else and any `:alt:` id is In progress).
- `LibraryState`: `tabs: LibraryTab[]` (`{ id, at: Location, back: Location[], forward: Location[] }`), `current` (tab
  id), `expanded: string[]` (open folders), `folderView: { mode: "grid"|"flow"|"plain"|"list"; size: "s"|"m"|"l";
  grouped: boolean }`, `elementView: { face: "isolated"|"context"|"code"; zoom: number (0.25–4); full: boolean; sub:
  SubId; shown: string | null }` (`shown` is the sub-element on the stage; it clears on every move), `panel: { open:
  boolean; view: "design"|"files"|"chat"; closedByOwner: boolean }`, `changes`, `kept`, `alternates`, `versions`,
  `files`, `moved` (element id → folder id), `added` (element id → `{ element, folder }`), `recent: string[]` (newest
  first, at most 24), `catalogVersion`.

### Actions (`store.ts`)

- `go(at: Location, { newTab?, replace? } = {})` — opens `at` in the current tab as a new history step; `replace` swaps
  the current step; `newTab` opens a tab after the current one and selects it. Arriving opens the ancestors in the
  tree, adds the id to `recent`, clears `elementView.shown` and resets `panel.open`.
- `back()`, `forward()` — the current tab's history.
- `selectTab(id)`, `closeTab(id)` (the next tab, or the previous at the end, becomes current; closing the last leaves
  one tab at Home), `newTab()` (Home, appended, current).
- `setExpanded(ids)`, `toggleExpanded(id, open?)`.
- `setFolderView(partial)`, `setElementView(partial)` (changing `sub` clears `shown` unless `shown` is given).
- Element worker additions (2026-11-25): `elementView.fit: boolean` (stored; default true): the stage fits what it shows
  to its width, never past 100%; `zoom` applies while `fit` is false. `setElementView({ zoom })` turns `fit` off unless the
  change names `fit`; Fit in the View menu is `setElementView({ fit: true })`. Arriving at a location sets `fit` back to
  true. `addFile(id, file?)` now answers the new file's id. `renameFile(ownerId, fileId, name)` renames a file the owner
  added. `library-parts.tsx`: `addNamedFile(owner)` adds a file with its name's field focused; `openFile(file)` opens the
  reader (a link opens outside). `element-view.tsx`: `elementSelection(id)` is the open element as Chat's context words.
- `openPanel(view?)` (opens it anywhere, clears `closedByOwner`), `closePanel()` (the owner's close: stays closed this
  session), `setPanelView(view)`.
- `change(id, key, value)` — an unkept property change. `keep(id)` — the current state becomes the element's own; the
  state before it is pushed onto its versions as "Before". `keepAsAlternate(id)` — adds "Alternate n" with the current
  state and drops the unkept changes. `makeCurrent(id, entry: SubEntry)` — the entry's state becomes the element's;
  the state before is pushed onto its versions. `reset(id)` — drops unkept changes. `addFile(id, file?)` — adds a file
  (an untitled guideline when none is given).
- `moveTo(elementId, folderId)` — moves an element (Add to system = `moveTo(id, <an Area folder>)`).
  `addToFolder(element: LibraryElement, folderId): string | undefined` — adds a Discover item; answers its Library id
  (`<id>.2`, `.3`… when the id is taken).
- `newFolder(parentId, name = "New folder"): string | undefined` (Header, 2026-11-25) — makes a folder inside `parentId`
  ("New folder 2", 3… when the name is taken there), opens `parentId` in the tree, leaves the location; answers the new
  id (`<parentId>.folder-<stamp>`). Kept in `LibraryState.made` (folder id → `{ name, parent }`, in the order made) and
  stored in `libraryChanges.made`; `catalog.ts` `setOverlay(moved, added, made?)` lays made folders first, so an element
  can be added or moved into one. `catalogVersion` bumps when `made` changes.

### The tree (`catalog.ts`)

`ROOT` ("library"), `AREA_ROOT` ("area"), `folder(id)`, `element(id)`, `isFolder(id)`, `isElement(id)`, `nameOf(id)`,
`nameOfLocation(at)`, `parentOf(id)`, `pathOf(id)` (root first, `id` last; `[]` for unknown ids), `childrenOf(id)`
(folders then elements), `allIn(id)` (every element below, memoised per folder), `topFolders()`, `isWithin(id,
ancestor)`, `locationOf(id)` (folder or element location; Home for unknown ids), `exists(at)`. All read the tree with the
owner's moves and additions laid over it (`setOverlay`, called by the store only). Duplicate ids across catalogs are
dropped with a console warning.

### Discover's catalog (`catalog-discover.ts`, added by Home and Discover, 2026-11-25)

`DISCOVER` is a catalog registered **outside the tree**: catalog.ts reads it with the others (`OUTSIDE`), so its items
are elements (`element`, `itemOf`, `locationOf` and the element page work) and `pathOf(id)` is `["discover", id]`, but
no folder holds its root, so the Sidebar's tree, `topFolders()` and `allIn` never list it. `locationOf("discover")` is
the Discover place (a crumb to it opens Discover). `DISCOVER_ROOT` ("discover") and `DISCOVER_IDS` (the feed's order)
are exported. Its items are In progress by `statusOf` (outside Area); Home leaves them out of In progress, and the
element page should offer Add to rather than Add to system for them (`isWithin(id, DISCOVER_ROOT)`). Add to copies one
with `addToFolder` (its copy is `<id>.2`, `.3`…). A photo kind's `state.image` names a picture of the saved references
by index (`DrawContext.image`); Discover's cards pass it through their draw context until the element kit's image
drawings read it.

### Other shared modules

- `route.ts`: `itemOfLocation(at)`, `locationOfItem(item)`, `hashOfLocation(at)`, `wantsNewTab(event)` (⌘, Ctrl or
  middle button), `linkProps(at)` (`href`, `onClick`, `onAuxClick` for an anchor: click here, ⌘-click or middle click
  in a new tab), `useLibraryRoute()` (the page's: keeps the hash and the current tab in step).
- `panel.tsx`: `selectPanelShown(s)` (open, or an element with properties not closed by the owner), `togglePanel()`,
  `useLibraryPanel()` (the page's: the `inspector` for `Workspace`, undefined when hidden; keeps the app's Inspector
  switch and view in step).
- `draw.tsx`: `DrawProvider`, `useDraw(): DrawContext` (one stable value; never build a DrawContext in a card).
- `in-view.tsx`: `useInView(ref, margin = "200% 0px")` (true once near its scroller's view, stays true), `InView`
  (`className`, `placeholder`, children). Give a card's wrapper the class `lib-card` for `content-visibility: auto`.
- `kind-icons.tsx`: `iconOfId(id)`, `iconOfLocation(at)`, `kindIcon(kind)`.

### Hash and history

`#labs/library/home`, `#labs/library/discover`, `#labs/library/<folder or element id>` (`places.ts` keeps the sub-path
as the place's `item`). The Library's moves replace the app tab's place (no extra app history); the app's Back and
Forward (and ⌘[ ⌘]) step through the current Library tab's history first (`studio.tsx` `setPageHistory`), then the
app's. A reload or a typed hash opens that location in the current Library tab; a hash naming nothing is replaced by
the current tab's location. A first load (nothing stored) is one tab at Home.

### Storage keys (`storage.ts`, inside the app's `area-desktop` entry; written 250 ms after the last change)

- `libraryTabs`: `{ tabs: LibraryTab[], current }` — locations that no longer exist load as Home.
- `libraryView`: `{ folder: folderView, element: elementView without shown, panel: view }`.
- `libraryExpanded`: `string[]` — ids that are no longer folders are dropped.
- `libraryChanges`: `{ changes, kept, alternates, versions, files, moved, added, recent }` — entries for ids that no
  longer exist are dropped. `panel.open` and `closedByOwner` are never stored.
