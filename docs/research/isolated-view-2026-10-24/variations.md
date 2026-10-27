# Variations, layers, systems and status (2026-10-24)

Brainstorm and research only, the second part of the isolated-view research ([README](README.md)). Nothing here is
built. The owner's asks, in order:

1. Any designed thing (a screen, a component, a UI element, a feature) can have variants, alternate designs, earlier
   versions and explorations. An isolated container holds variations, and variations inside each, **each one
   labelled and each holding exactly one variation**. Any of them can be elevated to a final design section. Labels
   and badges show what is in progress, live or waiting for approval. The Sidebar's tree view, split like Figma's
   Pages and Layers, and Figma's far-left icon rail are candidates for organizing it.
2. **One-word statuses.**
3. **Layering**: components, typography and colour belong under a design system. A homepage is its own design, and a
   dialog designed for it can be a layer under it, so the homepage is standalone but has independently designed
   things underneath.
4. **Design systems** are independent, and a new design can be told which system, and which version of it, to use.
   How to iterate on systems, components and variants needs more thinking.

Picks from the first decisions page (2026-10-24), all as recommended: the playground replaces a family's Overview;
the Sidebar stays and remembers a collapse; Try drafts are kept until discarded; the tactile feel becomes a setting
value with Flat the default; masonry becomes a card option, landscape staying the default.

## 1. How Area holds variants today

- **A family** is an entry in `apps/desktop/src/content/pages.mjs`: a slug, its API rows and a list of examples. Each
  example names a demo in `content/demos/*.tsx`, the real source the tile renders and the Code tab copies.
- **Tiles** are those examples, labelled group / value and sorted into fixed groups (`SPECIMEN_GROUPS` in
  `specimen-names.mjs`): Default, Variants, Tones, Sizes, Layout, Content, States, Behavior, Templates,
  Variant × tone. One tile per variant and one size per tile (AGENTS.md).
- **The axes** a component accepts are declared in `packages/styles/src/manifest.ts`. Button's are `variant` (solid,
  soft, outline, ghost), `tone` (seven), `size` (sm, md, lg) and `align`, with booleans, states and parts. The
  playgrounds (`content/playgrounds.tsx`, 11 families so far) turn them into Properties.
- **Status** is per family only: `component-status.mjs` holds the owner-confirmed Complete set and the In review set.
  Every other family is Unrefined. GOVERNANCE.md §6 adds Candidate, Reopened, Deprecated and Removed. Icons keep a
  separate verdict set (undecided, held, reopened, approved) on their review page.
- **Adding a variant** passes the gates in GOVERNANCE.md §3 (a real use, exactly one axis, not a setting, one tile,
  removable), then touches the CSS modifier, the manifest, the React prop, a demo, the pages example, the
  Documentation entry and the spec, all at once.
- **One system.** Area is one design system with settings (the Inspector's axes). Any element can carry its own
  setting scope (`data-area-*` attributes; the gallery cards do it with `CARD_SCOPE` in `tile.tsx`), so a subtree can
  already render under different settings. The packages are unversioned (`0.0.0`, no tags).

Missing for the owner's model: no place for anything not built yet, no history below the family, no status per
variant, no designs other than the library itself (screens, features), no nesting between designs, no second
system and no versions.

## 2. Research

**Figma Dev Mode** ([guide](https://help.figma.com/hc/en-us/articles/15023124644247),
[statuses](https://help.figma.com/hc/en-us/articles/26781702258583-Dev-Mode-statuses-and-notifications)):

- **Ready for dev** and **Completed** are set on a section, frame or component. **Changed** is a state, not a status:
  it's applied automatically when a marked design is edited and can't be set by hand. A designer clears it by
  re-marking, optionally with a reason that appears in version history and notifications.
- The **ready for dev view** lists every marked design, filtered All / Ready / Completed. **Focus view** shows one
  design at a time with an annotated version history. **Compare changes** shows the current version against an
  earlier one. The **component playground** tries properties and variable modes without changing the design.

**Figma branching** ([request a review](https://help.figma.com/hc/en-us/articles/5691414603543/),
[review changes](https://help.figma.com/hc/en-us/articles/5693123873687)): a branch goes to reviewers with a
description; they approve or request changes for the whole branch; only editors of the main file merge; unmerged
branches are archived, not deleted.

**Figma libraries** ([publish](https://help.figma.com/hc/en-us/articles/360025508373),
[review and accept updates](https://help.figma.com/hc/en-us/articles/360039234193),
[swap library](https://help.figma.com/hc/en-us/articles/4404856784663)):

- Changes to a library stay local until published, and each publish carries a description, shown to the files that
  use it and in version history.
- A file that uses the library gets a badge when updates are available, and reviews them all at once or one
  component, style or variable at a time, side by side or overlaid with an opacity slider. It can accept per instance
  or all at once. So **every file is pinned to the version it last accepted** until someone accepts more.
- **Swap library** replaces a file's instances with same-named ones from another library. Assets with no match stay
  on the old library.

**Figma variable modes** ([modes](https://help.figma.com/hc/en-us/articles/15343816063383)): an object's mode is Auto
by default and takes its parent container's; a mode set on a frame applies to it and everything inside it. This is
the "assign a system to a thing, and its layers follow" behaviour the owner described.

**Tokens Studio** ([theme groups](https://documentation.tokens.studio/platform/themes/theme-groups-and-theme-options)):
themes are options in groups (Color Mode: Light / Dark; Brand: four brands), each built from token sets, and groups
combine into a matrix. Multi-brand systems share one primitive set and switch a brand set.

**Storybook** ([tags](https://storybook.js.org/blog/storybook-tags/),
[status addon](https://storybook.js.org/addons/storybook-addon-status)): statuses are tags on stories, drawn in the
sidebar as a coloured dot by default or as the full badge.

**Figma's file panel** (the owner's screenshot): an icon rail on the far left switches the panel; the File panel
splits into Pages above and Layers below, the layer tree being the selected page's.

What carries over: a status lives on the node it describes; states that can be derived are derived; a review bundles
proposals and records a reason; one list shows everything waiting; a design is pinned to a library version and
accepts updates deliberately; a system assigned to a container is inherited by everything inside it unless a layer
sets its own.

## 3. Two trees: what a design contains, and which version of it

The two relationships stand; section 8 moves the iteration tree out of the Sidebar so only one of them is a tree there.

The owner's asks describe two different relationships, and they need two trees:

- **Composition**: what's inside what. A design system contains components; a homepage contains a dialog. This is
  Figma's layers.
- **Iteration**: the versions of one design. A news card has a portrait direction and a horizontal direction, each
  with variations. This is the variation tree.

Mixing them in one tree would put "the dialog on the homepage" and "the homepage with a tighter header" side by side
as if they were the same kind of thing. Kept apart, the Sidebar reads like Figma's: the top half is **where** (the
workspace and what each design contains), the bottom half is **which** (the selected design's variations).

### 3.1 Composition: the workspace tree

```
Workspace
├─ Systems
│  ├─ Area                         v3 Live · v4 Draft
│  │  ├─ Color, Typography, Icons, Imagery, Materials     (today's tabs: the system's foundations)
│  │  └─ Components (119)
│  └─ Area Dense                   forked from Area v3
└─ Projects
   └─ News app                     uses Area v3
      ├─ Homepage
      │  ├─ ↳ Sign-up dialog       placed (its home is below)
      │  └─ ↳ News card            placed
      ├─ Sign-up dialog            home
      ├─ News card                 home
      └─ Article page
         └─ ↳ News card            placed again
```

- **Every design has one home** (where it was made) and can be **placed** under any number of others, like a Figma
  instance. A placed row has a link glyph, and editing it edits the one design. That's how the homepage is
  standalone and also has the dialog underneath: the dialog is its own design, with its own variations and status,
  placed on the homepage.
- **Nesting has no fixed depth.** A feature can hold screens, a screen can hold dialogs, a dialog can hold a
  component. A cycle (a design placed inside itself) is refused.
- **A placement pins a variation.** By default the homepage shows the dialog's Final. A placement can pin a specific
  variation instead, to see an exploration in context before it's elevated (Figma's instance swap).
- **Two ways to see a placed design.** Alone: the dialog by itself in the viewport. In context: the dialog over the
  homepage, the homepage dimmed. Selecting the dialog under the homepage opens it in context; selecting its home
  row opens it alone.
- **Statuses roll up as counts, never as a status.** The homepage row shows "1 in Review" if its dialog is in review.
  The homepage's own status stays its own.
- **Elevating has two targets.** Within a design, a variation goes to Final. From a project, a design can go to a
  system, as when a project's News card becomes a system component. That second move passes
  `area-component-intake`, because it's how the library grows.

### 3.2 Iteration: the variation tree

Every design owns one variation tree. Each node is labelled and renders **exactly one** design. A node with
children also shows them, one card each in the filmstrip.

```
News card
├─ Final                          what ships: Live and Approved nodes only
│  ├─ Portrait, inset image       Live
│  └─ Horizontal, image start     Approved
├─ Portrait, inset image          a direction (an alternative design)
│  ├─ Padding 20                  Review
│  ├─ Title 15                    Draft
│  ├─ Image below                 Draft
│  │  └─ Image below, padding 12  Draft
│  └─ Full-bleed image            Archived
└─ Horizontal                     another direction
   ├─ Image start, title 15       Approved   (elevated to Final)
   ├─ Image end                   Draft
   └─ Compact, no description     Draft
```

- **Directions** are alternative designs at the top: a portrait card and a horizontal card are two directions of one
  News card.
- **Variations** change their parent, nested as deep as the work goes. Each stores only what differs from its parent
  (property values, token overrides, a CSS patch), so its label can be written from the difference ("Padding 20") and
  renamed by hand.
- **Final** holds what ships. Elevating moves a node there without its siblings; its direction keeps its history.
- **Archive** keeps what wasn't chosen, restorable. Nothing is deleted except by Discard.
- **Chat makes nodes**: "try three tighter versions" adds three Drafts under the current node, each labelled by its
  difference.

For a component, **Final is today's tiles**, one node per axis value (solid, soft, outline, ghost; sm, md, lg).
Combinations such as Variant × tone are a matrix view computed from the axes, never nodes. A new variant starts as a
Draft under Explorations, branched from the value it changes; elevating it runs `area-component-intake` first, and its
answer (a value on an axis, a new axis, a setting, a composition, or nothing new) decides where it lands.

## 4. Status, one word each

| Status | Means | Who moves it | Badge |
|---|---|---|---|
| Draft | Work in progress, in this app only | You or Chat, on creation | Neutral, dashed dot |
| Review | Sent to you, in a review round, with a note | You or a session | Amber |
| Approved | You said yes; waiting to be built (Figma's Ready for dev) | You only | Blue |
| Building | Being built on a branch, or its PR is open | Derived from git | Violet |
| Live | Merged on `main`, shipped | Derived from git | Green |
| Archived | Not chosen; kept | You | Hidden by default |

| Flag | Means | Derived from |
|---|---|---|
| Changed | Live or Approved, edited since it was approved (Figma's Changed; Area's Reopened) | Its source differs from the approved snapshot |
| Unreviewed | Live but never approved (today's Unrefined) | Absent from the registry |
| Outdated | Pinned to an older system version than the newest Live one | Its system pin (section 5) |
| Deprecated | Replaced, still exported | `@deprecated` in the source |

- **Derive whatever can be derived.** Building and Live come from branches, PRs and `main`, so they can't go stale.
  Approved and Review are your word, kept in the registry, which grows from slugs to node ids
  (`button/variant/glass`).
- **Today's statuses map onto it**: Complete = Live and approved; In review = Review; Unrefined = Live with
  Unreviewed; Reopened = Changed; Candidate = a Draft at the design level.
- **Badges are Area's Badge** with the Status colours setting. In the tree, a row shows a dot at rest and the word on
  hover or selection; flags always show.
- **Every status change carries a note**, shown in History.

## 5. Design systems you can assign, version and test

### 5.1 What a system is

A **system** is a design library of its own: its settings (every Inspector axis: type, density, corner, palette,
motion, edges and depth), its tokens, and its components with their variants. Area is the first system. A new one
starts empty, from a copy of another (a **fork**: Area Dense, forked from Area v3), or later from imported tokens.

This differs from the named looks the owner turned down on 2026-10-18 ("i dont want any prepackaged, named
themes"). Those were presets shipped by Area that hid what each control did. A system is the owner's own saved set of
choices, built from the same independent controls and open to edit, with nothing bundled behind a name.

### 5.2 Versions

- A system is published as **versions** (v1, v2…), each with a description (Figma's publish), and has one Draft version
  at a time where its changes collect.
- **A design uses a system at a version**: "Area v3", "Area latest" or "Area v4 Draft". It's set on the design in the
  Inspector, beside the settings, and **its layers inherit it** (Figma's Auto mode). A placed design shows in its
  host's system unless it sets its own.
- When a newer version is Live, a design pinned to an older one shows the **Outdated** flag and a review of what
  changed: side by side or overlaid, per component, accepted all at once or one at a time (Figma's library updates).
- **Swap system** moves a design from one system to another; components with no match in the new system stay on the
  old one and are listed.

### 5.3 Testing a system on a design

- **Compare systems**: the same homepage under Area v3 and Area Dense, side by side in the viewport (the playground's
  compare, with the system as the varied value).
- **A system is just another value a variation can change.** "Homepage, Area Dense" is a variation whose only
  difference is its system pin, so it can be reviewed, approved and elevated like any other.
- **Used by**: a system lists the designs that use it and at which version, so a change shows its reach before it's
  published.

### 5.4 How it renders (what's cheap and what isn't)

- **Settings and tokens are cheap.** Area already scopes settings per element (`data-area-*`), so a design can render
  under another system's settings today, nested scopes included.
- **Different component code is not.** Two versions of Button can't share one stylesheet: their classes are the same.
  An older or forked version renders from its own built bundle in an isolated frame (an iframe, or a shadow root
  with that version's CSS). So versions would be snapshots of the built packages, one per publish.

## 6. Iterating on systems, components and variants (open thinking)

The owner marked this as needing more thought. What follows lays out the questions with options and leanings, not
decisions.

- **Where does a change to a system live?** In the system's Draft version. Every component, variant and setting
  change made in Area today becomes a change to Area's Draft; publishing turns the Draft into the next version. The
  repository already works this way (`main` is Live, a branch is the Draft), so a version could simply be a tag.
- **One Draft, or many?** One Draft per system keeps "what's in the next version" simple. Several drafts are branches
  (Figma's branching): useful for two big efforts at once, but each needs a merge and a review. Leaning: one Draft,
  with branches only when two efforts overlap.
- **How does a variant made in a project reach a system?** By elevating it to the system: it becomes a Draft change
  there, through intake, and ships in the next version. Projects that pin the old version see Outdated, not a
  surprise.
- **How do forks stay related?** A fork can follow its parent's changes (pull Area's v4 into Area Dense, its own
  overrides kept) or break away. Leaning: a fork records its parent and version, and shows what the parent changed
  since, accepted like a library update.
- **What may a system change?** Settings only is the safest first step: it renders with today's scopes and can't
  break a component. Then token values. Then component overrides (a system's own CSS for a variant). Last, components
  only one system has. Each step needs more isolation in rendering.
- **What gets a version: the system, or each component?** Figma versions the library and not each component; npm
  versions the package. Leaning: version the system as a whole, and show per-component change lists inside each
  version.

## 7. Where it lives in the app

Second-round proposal, superseded by section 8: the rail goes, and variations move out of the Sidebar onto the canvas.

| Region | Holds |
|---|---|
| Rail (far left) | **Library** (the workspace tree) · **Systems** · **Review** · **History** |
| Sidebar top (Figma's Pages) | The workspace tree: systems and projects, each design with its placed layers |
| Sidebar bottom (Figma's Layers) | The selected design's variation tree, each row with its status |
| Viewport | The selected node, alone or in context |
| Filmstrip | The selected node's children, or its siblings for a leaf |
| Inspector | Design (the node's changes and its system pin), Code (the diff to its parent), Chat (scoped to the node), History |

- With systems and projects, today's Titlebar tabs (Components, Typography, Icons, Color, Imagery, Materials) become
  the contents of one system. They could stay as tabs scoped to the current system, or move into the workspace tree.
  That's the biggest structural change here, and a decision for the owner.
- The rail earns its place once there are three or more panel modes. With Systems, Review and History, there are.
- The Sidebar tree is Area's Tree view, which already has groups, pins, counts and actions. A status dot is a new
  trailing slot, the placed-design glyph a new leading one, and the split is two Panel sections with a resizable seam.

## 8. A simpler Sidebar (third round)

Owner, after the second round: the setup shouldn't be too complicated; not sure the far-left rail is necessary; the
workspace and the homepage's variations are confusing because both are trees ("but maybe thats the best thing?").
Ideas offered: one section panel where the selected layer is always moved to the left so it's visible; breadcrumbs at
the top for layer management; one section as a traditional pages panel like Figma's.

The owner's picks on the second page all followed the recommendations (one-word statuses as proposed, Final as its own
section, proposals into the repo from Review, directions as nodes, tabs scoped to a system, designs pinned to a system
version, settings first), including "rail now". The message above supersedes the rail pick.

### 8.1 More research

- **Figma** keeps a flat **Pages** list above one **Layers** tree, with a drag divider between them and no collapse
  button ([forum, 2026](https://forum.figma.com/suggest-a-feature-11/how-can-we-collapse-expand-the-pages-sidebar-45412),
  [help](https://help.figma.com/hc/en-us/articles/360039831974)). One list and one tree, so they never read as the same
  kind of thing.
- **Workflowy** zooms into a bullet: it becomes the top of the view, the path shows as breadcrumbs in the menu bar, the
  middle collapses to an ellipsis on long paths, and a house icon returns to the root
  ([help](https://workflowy.com/learn/sidebar-navigation)). This is the owner's "selected layer moved to the left": the
  tree re-roots at the selection, so indentation never grows.
- **Notion** has one sidebar tree with no depth limit and a breadcrumb at the top of every nested page
  ([help](https://www.notion.com/help/navigate-with-the-sidebar)). Hovering a breadcrumb segment lists that level's
  other pages ([report](https://matthiasfrank.de/en/notion-updates/sibling-page-navigation-in-breadcrumbs/)), so the
  breadcrumb doubles as navigation.
- **VS Code** pins the ancestors of what's in view at the top of a scrolled tree (sticky scroll in trees, 1.85, at
  most 40% of the view), so a deep row never loses its context
  ([summary](https://amitmerchant.com/vscode-sticky-scroll-in-file-trees/)).
- **Apple** groups a large sidebar with disclosure controls and says a sidebar flattens a hierarchy into peer
  categories ([HIG, sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)).
- **Miller columns** (Finder's column view) show the location at a glance but need horizontal room
  ([overview](https://www.saasui.design/blog/saas-tree-view-file-explorer-ux-patterns)). Too wide for a 248px Sidebar.

### 8.2 Options

| | Sidebar | Variations | Deep layers | Rail |
|---|---|---|---|---|
| **A. Pages and layers** (recommended) | A flat Pages list (projects, plus Review with a count) above one Layers tree: the page's designs and the designs placed under them | On the canvas: a board of Final and each direction, and the breadcrumb's last segment as a menu. Not in the Sidebar | The tree reveals the selected row, and past four levels it hoists: the ancestors move into a breadcrumb at the top of the panel | None |
| **B. One tree, drill in** | One panel showing one level at a time. Opening a design with layers moves into it; a breadcrumb at the top of the panel goes back | One more level inside each design | Never deep: every level starts at the left | None |
| **C. Pages and breadcrumbs** | Only the flat Pages list | On the canvas, as in A | The canvas breadcrumb does all layer navigation: each segment is a menu of that level | None |

**Why A.** It is Figma's arrangement, which the owner pointed to, and it removes the confusion at its source: only one
of the two sections is a tree. Variations stop competing with layers because they aren't in the Sidebar at all.
Hoisting keeps B's best idea (the selected layer always near the left) for the deep cases only, so a short page still
shows its whole tree. C is the simplest Sidebar, but every move through layers needs a menu.

### 8.3 Variations on the canvas

- **Board and Single.** Zoomed out, a design's canvas is a board, like Figma's sections: a Final row first, then one
  row per direction, each variation a labelled card with its status. Choosing a card isolates it: the playground's
  single view, exactly one design. A toggle in the canvas toolbar switches between the two.
- **The breadcrumb in the canvas toolbar** is the path: page › design › placed design › variation. Each segment is a
  menu of its level: the page's designs, a design's placed layers, a design's variations grouped by Final and
  direction, each with its status. That's where layer and variation management meet without a second tree. A long
  path keeps its first and last two segments and folds the middle into a "…" menu (Workflowy's ellipsis); the mock
  showed that without it, five levels squeeze every segment to a few letters.
- **The filmstrip** stays for moving between siblings in the single view.

### 8.4 Without the rail

- **Review** becomes a row in the Pages list with a count (Figma Dev Mode's ready-for-dev list is a list in its left
  panel too). Opening it shows everything waiting as a board.
- **History** is the Inspector's History tab, already planned.
- **Systems** live behind the Titlebar's system switcher, with the library tabs scoped to the current system (the
  owner's pick).
- So nothing needs a rail. It can come back if a fourth Sidebar mode ever appears.

## 9. Decided, and still open

Decided by the owner's picks (2026-10-24): one-word statuses Draft, Review, Approved, Building, Live, Archived; Final as
its own section; proposals move to the repository from Review; a direction is a node with its own base design; the
library tabs stay, scoped to the current system; a design stays pinned to its system version and shows Outdated; a
system changes settings first. The rail pick is superseded by section 8.

Still open:

1. **Sidebar:** A (Pages and layers), B (one tree, drill in) or C (Pages and breadcrumbs)?
2. **Variations:** on the canvas (a board and the breadcrumb's menu), or back in the Sidebar?
3. **Rail:** none, with Review as a page and History in the Inspector?
4. **Deep layers:** reveal the selection and hoist past four levels, show the whole tree always, or always drill in?

## 10. The Overview (fourth round)

Owner's picks on the third page (2026-10-25): Sidebar A, with a note ("maybe dont call it pages and layers, i dont
think those names make sense"); variations on the canvas, with a note ("variants for components should live under the
tree view, they should be treated as legitimate standalone design items that happen to live under a larger
umbrella"); drop the rail; reveal and hoist deep layers. Then, in chat: no constant panel of variations along the bottom.
Instead, the whole canvas should shift to a gallery of every design in the project, showing what each contains, which
variants go under which design and where the explorations are, sorted and organized, "almost like a menu": you go back
to what you were looking at, or open something new.

### 10.1 Research

- **Lightroom Classic** has two views of one library: Grid (G) and Loupe (E). Esc goes from Loupe back to Grid,
  and double-clicking a thumbnail switches between them
  ([Adobe shortcuts](https://helpx.adobe.com/lightroom-classic/desktop/introduction-to-lightroom-classic/keyboard-shortcuts.html)).
- **Figma Slides** switches between Slide view and Grid view, "a bird's eye view" of the whole deck
  ([plugin API](https://developers.figma.com/docs/plugins/api/properties/figma-viewport-slidesview)).
- **Keynote's light table** shows every slide as a thumbnail to rearrange a long deck; grouping happens in the
  navigator ([Apple](https://support.apple.com/guide/keynote/tanae4979928/mac)).
- **Safari's tab overview** opens from a button or by pinching on the trackpad, shows every tab as a thumbnail, and
  opens one at full size when it's clicked ([Apple](https://support.apple.com/guide/safari/ibrwbb6e21e4/mac)).

All four are one place with two zoom levels: everything at once, or one thing. You get from one to the other in a
single step, and come back the same way.

### 10.2 The design

- **Two views, no filmstrip.** The canvas is either **Single** (one design alone, in context when it's placed inside
  another) or **Overview** (the whole project). The toolbar's Overview button and Esc leave Single; Back (or Esc
  again) returns to the design you left; a card opens any other. The Stage's existing exits (Esc, ⌘↑, ⌘[) become the
  ways into the Overview.
- **The Overview** lists every design in the project, in tree order, as a section:
  - the design's name, status and counts ("2 designs · 6 explorations"), and the designs placed inside it as links
    that jump to their own sections;
  - its Final designs (for a component, its variants grouped by axis);
  - **Explorations of** each final design, nested explorations marked "from …";
  - archived items behind a count;
  - designs nested inside it (Article page › Comments › Reply dialog › Mention menu) as indented sections.
- **"You were here"** marks the card you left. The Overview opens scrolled to it, so it reads as zooming out from
  where you were.
- **Filters** (All, Draft, Review, Approved, Live) narrow the cards. The Inspector shows the project's counts.
- **The tree works as a table of contents in the Overview**: selecting a design scrolls to its section, and a card
  opens it.
- **Single view** keeps the breadcrumb (each segment opens the Overview) and previous/next arrows for the design's
  siblings.
- **Motion**: leaving Single, the design shrinks into its card while the other cards fade in (`moderate`, 280);
  opening a card grows the design from it (`slow`, 350), both ease-in-out because they move across the screen while
  visible. That's the same morph as the gallery cards opening into the playground, so one gesture means one thing
  everywhere.

### 10.3 Variants as tree items

Component variants are rows in the tree under their component, grouped by axis (Button › Variants › solid, soft,
outline, ghost; Sizes › sm, md, lg). Each is a design of its own, with its status, flags, Inspector and explorations.
Proposed rule for every design: when it has two or more Final designs, each is a row under it (News card › Portrait,
inset image; Horizontal); a design with one Final shows none, because the row would repeat its name. Explorations stay
out of the tree; they're in the Overview.

### 10.4 Names

"Pages" and "Layers" are Figma's words for a file's pages and a page's layers, which isn't what these lists hold.
Proposed: **Projects** above (with Review), **Designs** below. Alternatives on the page: a project switcher in place of
the list, or broader words.

### 10.5 Still open

1. Section names: Projects and Designs, a project switcher with Designs, or other words?
2. Do a design's final designs show in the tree when there are two or more, always, or only for components?
3. The gallery's name: Overview, Gallery or All designs?
4. Does the Overview show the whole project at your design, or only the current design?
5. Keys: Esc out and back, Lightroom's G and E, and pinch as well?
