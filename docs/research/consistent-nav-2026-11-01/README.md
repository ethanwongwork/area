# One consistent Sidebar nav (2026-11-01)

The owner's request (2026-11-01, review page NGi9NfB64p7Z5NSJGuFvzj, `verdicts/home-nav`): pick "Systems and projects
open in place" (each system and project row in Home's nav gets a disclosure listing its sections; a click opens that
section in the item's own tab), with the note: "make sure the nav stays consistent and there are persistent places to go
back to. every page seems to create a new distinct nav. look at cursor and claude (switching from chat to code as an
example) to see how the nav can be consistent and show different layers, projects, systems at once".

Review page with the directions and the owner's picks: see "Review" at the end.

## The problem, in the app today (main a21182df)

`apps/desktop/src/app-nav.tsx` `AppNav` swaps the whole Sidebar by the current tab's kind:

| Tab | Sidebar | What disappears |
|---|---|---|
| Home (and a lab) | Home, References · Projects (rows, New project) · Systems (rows, New system) | — |
| References | ← Home · Discover, Following, Saved | Home's rows, every project and system |
| A system | ← Home · Foundations (9) · Components (Overview, kinds ▸ families) · Patterns, Versions | References, the other systems, every project |
| A project | ← Home · Overview · Pages (▸ layers, New page) · Explorations · Versions | References, the other projects, every system |

So four navs share one place, each with a different first row, and the way back is a back row whose meaning changes
(it switches tabs to Home). That is the owner's "every page seems to create a new distinct nav".

History: the shell the owner picked on 2026-10-28 (variation A, `docs/research/app-structure-2026-10-28/README.md`,
Phase 0) was one universal nav, "the open system expands to its sections", with long lists taking the panel over. The
per-tab nav came on 2026-10-29 (owner: "tabs can be libraries or projects … accessed through the left nav, but the tab
itself … will always just be the project itself") and the takeovers became a list under the nav on 2026-10-30. The
request now returns to one nav, keeping one-thing-per-tab.

## Claude desktop (4.4212.0, read from its bundle)

Source: `/Applications/Claude.app/Contents/Resources/ion-dist.asar`, extracted with `npx @electron/asar extract`; the
shell's strings and slots are in `assets/v1/shared-1-*.js`. Visual values from the same bundle are in
`docs/research/claude-code-ui-audit-2026-10-31.md` (sidebar 288 wide, rows 26 to 32 at 13 to 14, hover 5% and
selected 10% neutral).

- **One sidebar, three surfaces.** Chat, Cowork and Code are surfaces of one window; ⌘-keys "Previous surface" and
  "Next surface" step between them. The sidebar's slots are the same in every surface; a slot's words change by surface,
  declared as pairs in one message table: `description` / `description_session`:
  - "New chat" / "New Code session" (and "New task" in Cowork) in the first slot,
  - "Search conversations and projects" / "Search sessions and projects",
  - "All chats" / "Recents" for the list,
  - "Delete chat" / "Delete session", and so on.
- **Persistent slots**: the top (New, Search), the lists (Pinned, the groups, Recents), the foot (the person,
  Settings). Switching surface never moves or removes a slot; only what a slot lists changes.
- **Projects and sessions at once**: a session can sit in a group ("Move session to group", "Move to top level"), sessions
  nest under sessions ("Show nested sessions", "Fold sessions", "Unfold sessions"), and Projects is a list of its own
  ("Search projects", "No projects yet"). Search covers both ("sessions and projects").
- **Lesson for Area**: the frame, the slot order and the persistent rows never change with the layer; only the
  contents of one known slot do, and its words say which layer you are in.

## Cursor (3.27.22, read from its bundle)

Source: `/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/workbench.glass.main.js` (the Agents window)
and `workbench.desktop.main.css` (the IDE). Sizes measured earlier: rows 28 at 12/16 with 6/8 padding in the Agents
window, 22 in the IDE (`docs/research/cursor-audit-2026-10-22.md`, memory "Cursor bundle reference").

- **Agents window: one list across every workspace.** The sidebar lists every agent from every workspace at once,
  grouped; the grouping is a menu ("Group by options", `use-sidebar-customize-commands.react.js`): Workspace (folder
  icon), Repository, Updated, Status, Environment, Source. Each group folds; a group shows **5** rows, then "Show more"
  (`SidebarPaginatedMenu.js`, `maxVisible: 5`, `moreLabel: "Show more"`). New Agent (plus) and Search sit above the
  list, Settings at the foot; "Pinned" rows lead.
- **IDE: a fixed activity bar.** The workbench's activity bar never moves; it switches which view fills the side bar
  (Explorer, Search, Source Control …). The view's own tree (the file explorer) shows every open folder of a
  multi-root workspace as a top-level disclosure, the current file revealed and marked.
- **Lesson for Area**: many projects at once is one list grouped by its parent, each group folding and capped; the
  current thing is revealed in place (expanded and scrolled to), not swapped in.

## Peers, from use (not measured here)

- **Linear**: fixed rows (Inbox, My issues), then Workspace, then "Your teams": each team a disclosure holding the same
  sections (Issues, Projects, Views). The section rows are the same words under every team. This is Direction A.
- **Notion**: fixed rows (Search, Home, Inbox), then Teamspaces / Private / Shared, every page a disclosure of its
  sub-pages. The current page is revealed in the tree.
- **Slack, Discord, Arc spaces, Figma's file browser**: a rail of workspaces or spaces beside a panel that shows the
  chosen one's channels or files. This is Direction B.

## What the references agree on

1. **Persistent rows never move**: top (Home or New, Search), foot (person, Settings). Area already has the Sidebar's
   header (search ⌘K, back, forward) and foot (profile, Settings ⌘,); Home and References must join them as rows that
   are there in every tab.
2. **Everything at once, grouped by parent**: projects and systems listed together, each folding.
3. **The current thing is revealed, not swapped in**: opening an item expands it where it lives and marks the row;
   nothing else leaves the nav.
4. **Depth stays shallow**: two or three levels in a sidebar; long contents (files, families, layers) go to a view of
   their own. Area's version is the page list under the nav (`PageList`, since 2026-10-30).
5. **Labels are the same words in every item**: Linear's Issues / Projects / Views under every team, Claude's paired
   messages. Area's sections are already the same for every system (and every project).

## Directions (shown on the review page)

- **A. One tree** (the owner's pick, refined; recommended). Home and References lead, then Projects and Systems, every
  item a disclosure of its sections. The current tab's item opens and its section row is current; other items stay as
  left. A system's sections: Themes, Foundations (folding: Tokens to Icons), Components, Patterns, Versions; a project's:
  Overview, Pages (folding: its pages), Explorations, Versions. A section's own list (Components' families, Colors'
  scales, a page's layers) is the list under the nav. No back row.
- **B. Rail and panel** (Slack, Discord, Arc, Cursor's activity bar). A 44-wide rail at the Sidebar's start holds Home,
  References and every project and system as a tile; beside it the panel shows the chosen item's sections, the same
  shape for every item. Everything is visible at once as tiles; names show in tooltips.
- **C. Fixed slots** (Claude's surfaces). Home and References lead; under them one slot, always in the same place, holds
  the current tab's sections under its name; then Projects and Systems as flat lists. Switching tabs changes only that
  slot's contents (as Claude's list changes from All chats to Recents).

## Consequences for the build (any direction)

- `AppNav` stops branching on `tabKind`: one `WorkspaceNav` for every tab; `BackHome` goes.
- `places.ts` keeps every hash; `navigate` keeps opening a place in the tab holding its item (`tabHolds`), ⌘-click in a
  new one. Labs stay out of the nav (search).
- Components' families: in A, four levels (system › Components › kind › family) is too deep for a 260 Sidebar at 22 a
  level, so they move to Components' page list under the nav, with their kinds as its groups (asked on the review page).
- A project's Explorations rows keep their status mark (`StatusBadge iconOnly`, another session's uncommitted change in
  `worktree-cleanup-status-badges`).

## Review

Review page: https://claude.ai/artifact/K5TADzUii6U6kY6kpiCx5i (source `review.html` here; today's Sidebar captured
from the real app at main a21182df in `today/`, light and dark). Picks in its `verdicts` collection, one document per
question: `direction` (a, b, c), `families` (list, tree), `open` (left, current), `references` (fold, plain), and
`overall` (a note), each `{ pick, note, at }`.

## Picks (owner, 2026-11-01)

`direction` a (one tree), `families` list, `open` left (what you left open stays open), `references` fold. Overall note:
"maybe the projects and systems can collapse when its necessary to provide more room context for other things? can you
show what happens when i open up each of the top 4 nav items, home, references, projects, and systems. how are layers
shown in projects for designs, and how are all the parts of a system shown".

## As built (2026-11-01, branch `claude/beautiful-goldberg-36a1e2`, uncommitted)

- `apps/desktop/src/app-nav.tsx` `AppNav`: one tree in every tab; `SystemNav`, `ProjectNav`, `ReferencesNav` and the
  back row are gone. Home and References sit above the tree's own scroll; Projects and Systems fold (Nav's new folding
  `NavGroup`, with New at each heading's end). Open rows are kept in `nav-open` (app storage); a tab's item and the section
  holding its page open when the tab does (`useFolds`, before paint). The current row is scrolled into view.
- The note's questions, as built: **Home** opens Home (its tab); **References** opens Saved and its row, with Discover,
  Following and Saved under it (collections are its list); **Projects** and **Systems** headings fold their groups and
  keep New; a project opens to Overview, Pages (pages, New page), Explorations (New exploration) and Versions; **a
  page's layers** are its list under the tree (Filter layers), each a screen or an image, the chosen one marked; **a
  system's parts** are Themes, Foundations (eight), Components (families by kind in the list), Patterns and Versions.
- `studio.tsx`: the Sidebar is places, then the tree with the page's list (first round: the tree up to half with a
  list, each scrolling; replaced in the second round, below). Components' families are its list again.
- `pages/project.tsx`: a page's layers are its list.
- Nav (`packages/react` Nav.tsx, nav.css, inset.css, manifest, demo `NavFolding`, Documentation entry, spec, test).
- Checked: `npm run build`, `npm run typecheck`, `node --test packages/react/tests/nav.test.mjs cohesion.test.mjs` (new
  folding test), desktop build, `check:playgrounds`, `check:docs`, `check:app-css`, `tests/places.test.ts`,
  `git diff --check`. Looked at in the browser preview (a test project with two layers, its own storage) and in Electron
  capture mode, light and dark (`built/`). Not driven in the owner's live Electron: another session's window was open.

## Second round (owner, 2026-11-01): room for the list, one scroll

Owner: "make sure when i click on a system for example, theres enough room with all the collapsing that the components
section has enough room, or even with layers from a design project … is it better if its not separated into a different
section, and everything is just in an endless scroll? maybe home and the top nav items stay sticky in their own section.
how are "pages" in a design project handled?"

- The split (tree up to half, list the rest, two scrolls) gave the list about 350 at 900 high and nested two scroll bars.
  Replaced by one scroll under the held places, as Notion, Linear and Cursor's explorer scroll one tree.
- The list moved from after the whole tree to right under its project or system (between rules), so other open items
  never push it away; References' collections lead the scroll. Its filter is held at the top as the list scrolls.
- Opening a tab or section scrolls the tab's item to the top; if its open sections push the list below the middle, the
  current section goes to the top instead. Measured at 800 × 900 in the browser preview (Sidebar scroll 629): the list
  starts with 520 free on Components, 396 on a project page, about 300 on Colors (Foundations' eight above it); scrolling
  gives it the whole height.
- Pages: a project's Pages row lists its pages (layer counts, New page); a page's layers are its list.

## Third round (owner, 2026-11-01): four places, then the tab's context

Owner, on References' views: "fix the alignment here, are these all necessary to show? what if the top header portion has
home references projects and systems. then there is a divider section and everything below that shows contextually what
is supposed to be there."

- Alignment: Nav's nested runs stepped in Tree view's 22 (16 + 6), so children sat 4 short of a parent's name. Now one
  icon column (16 + `gap-row`): children start on the parent's name (nav.css, spec, Documentation entry).
- The Sidebar: Home, References, Projects, Systems held at the top (the current tab's marked), a rule, then the tab's
  context in one scroll (Recent on Home; References' views and collections; every project or system; a project's or a
  system's sections and its section's list). This is direction C on the review page with Claude's fixed slots, the
  owner's choice after building A: one item's sections at a time, the tabs and the Projects and Systems places for the
  rest.
- New places `#projects` and `#systems` (their own tabs, cards, New, Inspector facts), `src/pages/workspace-lists.tsx`;
  search finds them; `tests/places.test.ts` covers them.

## Round 4 (owner, 2026-11-01): deep inside, and what could be better

Owner: "any improvements that can be made? can you also show what it looks like when ur working deep inside a system with
lots of component variants or within a design with lots of variations?"

Captured in the browser preview with a test project (6 pages, 3 explorations, a page of 14 layers) and Button's
Variant × tone tiles (`built/deep-*.png`). Found: the selected row goes out of view (a layer; a tile after coming back to
the tab, where "start at the top" overrides the list's reveal); a screen added twice repeats its name; deep tiles sit 64
in, everything above them scrolled away; a project's or system's name scrolls away; open sibling sections (Explorations,
Foundations) push the list down. On the review page: two fixes to approve, and picks `r4-path` (sticky parents / focus a
family / both / neither), `r4-name`, `r4-fold`, `r4-cap`, `r4-thumbs`, `r4-names` in `verdicts`.

Picks (2026-11-01): r4-fixes approve, r4-path sticky, r4-name pin, r4-fold fold, r4-cap cap, r4-thumbs thumbs, r4-names
words. Built: Tree view `stickyBranches`; Nav `picture` and `NavGroup sticky`; `AppNav` pins the name, folds the other
sections on a section change, caps pages and explorations at 5, reveals the list's chosen row; `addLayer` numbers a
repeat; `specimenWords` names tiles in words. Checked in the browser preview with the deep test project, light and dark.
