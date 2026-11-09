# User flows (2026-11-08)

Owner, reviewing Area's scope: a gap is "designs for how to show longer flows and complete user flows with multiple
pages". Each design sits alone in its own container, never on an infinite canvas (PRODUCT_UI rule 25), so a flow has to
work inside that model. This note is research and proposals only. Nothing in `apps/` changed.

Review page: **User Flows**, https://claude.ai/artifact/L5ZPadtTxkThgz5X1m3ENe. Picks are stored in its store, collection
`verdicts`, one document per question (`home`, `overview`, `open`, `play`, `links`, `states`, `notes`, `patterns`),
with fields `pick`, `note` and `at`. `entry.tsx` draws the page with Area's real components and `build.mjs <tree>
<out.html>` bundles it with that tree's CSS (it needs `npm run build` and the desktop build first). Both are adapted
from `design-containers-2026-11-05`.

## What Area has today

- **A project's page is a board of layers, in order** (`apps/desktop/src/projects.ts`: `ProjectPage { layers }`). A
  layer is a system screen (a Patterns entry, by `ref`) or a References image. The same screen can already sit on
  several pages.
- **The page is a stage over the design panel** (`src/pages/project.tsx`, `design-viewer.tsx` with `scroll: "page"`,
  `design-panel.tsx` with 9 tabs). The stage holds **one layer at a time** (the owner's pick, 2026-11-06). ← → and the
  viewer's step control ("3 of 12") move between layers.
- **History is per page.** `recordIteration` copies the pages into an iteration (100 kept), versions copy pages and
  explorations, comments are keyed by page and layer, and `DesignChange` is keyed by page, layer and element path. The
  Design view's log sends changes to Chat as one message.
- **Stepper exists** (`packages/react` `Stepper`, spec `docs/specs/stepper.md`). It is the product-side step indicator
  (numbered markers on Timeline's line, `complete | current | upcoming | invalid`). **Timeline's line** is the system's
  connector: 1px (`--area-stroke-width`), `fg-muted`, stopping 4 short of each mark, current in `selection-solid`.
- **Missing:** nothing links layers into a sequence, and nothing shows a branch, a step's states, a transition or a flow
  overview. Patterns are single screens.

## Findings

Sources were read directly (subagent's report, 2026-11-08, URLs below) and, where pages were public, measured in the
browser pane at 1440 × 900 with `getBoundingClientRect` and computed style.

### Measured

| Source | What | Value |
|---|---|---|
| Page Flows, desktop web flow (`/post/desktop-web/onboarding/stripe/`) | Screens of one flow | **One sideways-scrolling row** (`overflow-x: scroll`), 104 screens, header "Onboarding · 104 Screens" (count 14/400) |
| | Screen card | **472 × 300**, corner **12**, gap **20** (a 1440-wide screen at about **⅓**) |
| | Step name | Under each screen, **14 / 400**, **15** below the picture ("Homepage", "Create account", "Enter email") |
| | Video's step list ("In this video") | Rows **56** apart, time in a 28-tall pill at 14, then the step name |
| | Flows of one product | A left list of flow names (rows 50 tall, 16): Onboarding, Adding a product, Searching, Buying something … |
| Page Flows, iOS flow (`/post/ios/onboarding/revolut/`) | Phone screen card | **208 × 450** (a 390-point phone at about **0.53**), corner 12, gap **22**, name 15 below; 29 screens |
| Whimsical, banking app wireframe template | Board of one app's screens | 15 phone frames, **5 across**, each **numbered and named above** ("01 Log in", "02 Home" … "15 Upgrade"), no arrows |
| Whimsical, user flow template | Flow map | Left to right; screens and steps as boxes; **orthogonal connectors with arrowheads, exits labelled Yes / No**; a recovery loop (forgot password → reset → sign in); **every branch converges on one end** ("Enter App") |
| Material steppers (M1) | Step indicator | 24dp circles, **1dp connector**, 72dp step height, 48dp between vertical steps |
| Area, Timeline (`timeline.css`) | Connector | **1px**, `fg-muted`, stops **4** short of a mark, current `selection-solid` |

Not measured: Figma's prototype canvas (this pane isn't signed in to Figma, and its desktop cache is compressed) and
Mobbin (403 to automated pages). Their facts below come from their documentation.

### Read

- **Figma.** A flow is "a collection of connected frames"; its **starting point** sits on a top-level frame, one per
  frame, **created automatically at the first connection** ("Flow 1", renamed in place). A frame can be in **several
  flows**. A flow has a rich-text **description**, shown in the player's sidebar ("usability test prompts or team
  documentation"). Connections are "noodles" from a hotspot to a frame; Back needs no destination. The **player** lists
  flows with descriptions; the bottom bar has prev / next, **Restart (R)**, and "Show hints on click" (a blue box round
  every hotspot when you click outside one). Scaling: actual size, fit width, fit width and height, fill. Keys: → /
  Space / N next, ← back, Z cycles scale. [help 360039823894, 360040315773, 360040318013]
- **FigJam.** Connectors: bent, curved, straight; ends none, solid, line, triangle, diamond; solid or dashed, thin by
  default, grey by default; labels slide along the path. No auto-layout. [help 1500004414542]
- **Mobbin.** Two views of a flow: an **overview of all screens** (drag-scrolled) and **Interactive mode**, "one screen
  at a time", advanced by its hotspots or **a click anywhere when a screen has none**. Opening a flow from a screen
  scrolls to that screen. Flow types: onboarding, checkout, account setup, subscription. "Our flows aren't annotated."
  [changelog, blog/mobbin-vs-page-flows]
- **Page Flows.** Video, a timestamped named step list, then every screen with its name. Recordings are dated versions.
  Six groups of flows (Account management, Content, Onboarding & tutorials, Social, Transactions and purchases, Misc.).
- **Overflow.** Synced screens with connectors **from any layer**, labelled and coloured; **diamond shapes for
  decisions**; subflows. Three ways to show it: **Story** (an ordered tour of focus areas with narration),
  **Presentation** (walk the map) and **Prototype** (generated from the connectors). [overflow.io/features, how-it-works]
- **NN/g wireflows.** Each node is a real screen; **the arrow starts at the UI element acted on**; a result node can be
  **the same page after a change** (an error, a confirmation); on desktop show only the part that changes.
- **Sketch, Penpot.** Start points listed in the Inspector with nothing selected, each its own prototype and link
  (sign-up, settings); Penpot: "as many flows as you want", a flow picker in View mode.
- **Axure.** "Generate flow diagram" from the page tree, **standard vertical** or **right hanging**; connectors reflow.
- **ProtoPie.** Scenes are never side by side; one scene at a time, joined by Jump.
- **Storybook.** A play function's `step`s can be paused, rewound and stepped through.
- **Product guidance.** GOV.UK: one question per page, a Back link, "Continue", "Question 3 of 9" only if reliable,
  each example a working page. Carbon: a progress indicator for three or more steps, not when the order varies. Shopify:
  no more than five onboarding steps. Apple: postpone nonessential setup.

### What recurs

1. **An ordered overview of every screen**, one row or a numbered grid: Page Flows, Mobbin, Whimsical's board.
2. **A map with arrows from the element acted on to the next screen**, labelled exits, decisions and loops: Figma,
   Overflow, Whimsical, Axure, NN/g.
3. **A player** that shows one screen at a time and follows the links, with Restart and hints: Figma, Mobbin, Penpot,
   Overflow, Storybook.
4. **Named flows over shared screens**, created at the first link: Figma, Sketch, Penpot.
5. **A named, numbered step list** beside a recording: Page Flows.
6. **Annotation is thin everywhere:** a flow's description and the step names. No tool documents a step's empty,
   loading or error states, beyond NN/g's "same page after a change".

## How a flow fits Area

- **The flow is the page.** A page is already "layers, in order"; reading that order as the flow's path, and adding links
  for the branches, needs no new section, and every per-page record (iterations, versions, comments, changes) keeps
  working, because they key by page and layer.
- **The flow is one design, laid out by rule.** Rule 25 keeps one design per bounded canvas. A flow overview fits if the
  *flow* is that design: an automatic layout of its steps (no free placement, no infinite canvas), fitted on the stage,
  zoomable, whose steps are Design cards that open into the one-layer stage exactly as a gallery card does (the card
  grows; Back, Esc or ⌘↑ shrinks it back). That is the same morph and the same keys Area already has.
- **History.** Links and steps live in the page, so an iteration and a version copy them. An iteration of a flow page
  should picture its map, not its first layer (today's iteration card pictures one layer; an open gap).
- **Changes and Chat.** A link made in the Design view is a change like any other (logged, undoable, kept). Send to
  chat includes links, so the agent can wire navigation in code. The Chat itself is being studied by another session
  (`chat-workflow`); nothing here changes it.

## Proposals, ranked

Each is what it is, why, what it affects, and its intake rung (`area-component-intake`). The review page draws every
option; the recommended one is its default.

### 1. A flow is a project page (`home`) — recommended

- **What.** Any page becomes a flow at its **first link** (Figma's way), so no type is chosen up front. Its layers in
  order are the main path; links add branches. The Sidebar's list numbers the steps. The same screen can be on several
  flow pages, as it can be on several pages now.
- **Why.** Smallest change to the IA: the page already holds layers in order and owns every record.
- **Affects.** `projects.ts`: `ProjectPage.links?: FlowLink[]` (`{ id, from: layer, path?: number[], to: layer | "back",
  label }`); `Layer.of?: string` and `Layer.state?: string` for states (proposal 6). Sidebar list rows gain a number.
- **Intake.** App-only data and app UI (rung 8). No package change.
- **Not chosen.** A **Flows section** that names start points over all pages (Figma, Sketch, Penpot) is stronger when one
  screen sits in many flows, but adds a section and a second way to order screens. A **system-only** home (Patterns as
  flows) leaves projects with no way to design a flow.

### 2. The overview is a map: the path in a row, branches above, states under (`overview`) — recommended

- **What.** On a flow page the stage shows the whole flow as one design: steps as Design cards in one row (the main
  path, left to right), a branch in a row above the step it leaves (numbered after it: 1a), a step's states in a
  column under it joined by a dashed line (the same step, changed), Timeline's 1px muted line with a 6px arrowhead
  between cards, and a link's words (the element acted on: "Continue", "Secondary") as a small outline Badge on its
  line. Every branch rejoins the path (Whimsical's converging end). A flow with no branches or states is a filmstrip.
- **Values (drawn on the review page; to check against a flow tool).** Cards scale with the zoom, from 320 wide (the
  gallery card) at 100%; **words and gaps stay at screen size**, so names and link labels read at any fit: columns 64
  apart (a label fits), rows 32 apart, the name 4 under the card at 13 with the step number muted before it. The map
  opens fitted (⇧1). Lines into and out of the chosen step take `selection-solid`.
- **Why.** It is the strip (Page Flows, Mobbin) when there are no branches and the map (Whimsical, Overflow, NN/g) when
  there are, laid out by rule so it never becomes a free canvas.
- **Affects.** A new view in the project page (`src/flow-map.tsx`), the stage's fitting, the iteration card.
- **Intake.** Composition of Design card, Badge and app-drawn lines on Timeline's tokens: app-only (rung 8). The
  connector itself has no Area component; if products built with Area need diagrams, that's a **Candidate** (a
  connector / diagram family) waiting for evidence, not part of this.
- **Not chosen.** **Filmstrip** only (no branches), **numbered grid** (Whimsical's board: compact, but order reads
  only by numbers), **step list** (a vertical Stepper beside one large stage: clear order, no overview).

### 3. The flow first; a step opens from its card (`open`) — recommended

- **What.** A flow page opens on its map. Double-click (or Enter on) a step's card and it grows into the one-layer stage
  (today's view, with the design panel under it); Back, Esc or ⌘↑ shrinks it into its card, still chosen. ← → step
  along the path. The Canvas header's start shows the path ("Sign up / 2 Verify email").
- **Why.** Rule 25's own gesture: the map is the page's gallery.
- **Affects.** `project.tsx` (which view the stage shows), `morph.ts` (already used by galleries).
- **Intake.** App-only (rung 8).
- **Not chosen.** **Step first with a Flow switch** (a Segmented in the header: two places for one thing); **the map in
  the design panel** (a Flow tab under the stage: always in view, but small and below the fold).

### 4. Play in the stage (`play`) — recommended

- **What.** Play (▶ in the Canvas header, P) turns the stage into the flow: one step at a time at the stage's fit,
  links act on a click, a click elsewhere outlines every link for a moment (hints), and a step with no link goes on with
  a click anywhere (Mobbin's rule). A Toolbar at the stage's foot: Back, Restart (R), the step ("2 of 5 · Verify
  email", a menu to jump), Hints, Done (Esc). Moves follow the system's Motion (a slide forward and back; none at
  Motion 0 or with Reduce motion).
- **Why.** Every flow tool has a player; it is how a flow is checked and shown.
- **Affects.** The design viewer (a play state), the stage's keys.
- **Intake.** Composition: Toolbar, Button, Menu and the viewer's step control (rung 3 / 8). No new component.
- **Not chosen.** **A full-window takeover** (the presentation view: good for showing people, later as Present);
  **later** (a flow you can't walk is half checked).

### 5. Order is the path; links are made in the Design view (`links`) — recommended

- **What.** Each step goes to the next by order, so a straight flow needs no links. A branch is made by selecting an
  element on the stage (the editing that exists) and choosing **Goes to** in the Inspector's Design view: a step, Back,
  or a new step from a Patterns screen. The link is logged as a change ("Link · Continue → Verify email"), undoable, and
  goes to Chat with the others.
- **Why.** Area's editing already selects elements with their names, and the arrow then starts at the element acted on
  (NN/g, Overflow).
- **Affects.** `design-inspector.tsx` (an Interaction group: Goes to, and later its transition), `DesignChange`
  (property `link`), the change log's Send to chat.
- **Intake.** Composition: Panel rows, Custom select (rung 3).
- **Not chosen.** **Drawing arrows on the map** from an element to a card (direct, but the map is read-only by rule);
  **order only** (no branches or loops).

### 6. A step's states sit under it (`states`) — recommended

- **What.** A step can hold states (Default, Error, Loading, Empty, Success): layers marked as a state of a step, drawn
  in a column under it on the map, children of its row in the Sidebar, and a Segmented over the stage in the step's
  own view. A link may go to a state ("Invalid code" → Verify email · Error).
- **Why.** No tool models this, yet every form step needs its error and loading; NN/g draws them as "the same page after
  a change", and Area's Checks can then say which steps lack one.
- **Affects.** `Layer.of`, `Layer.state`; the map, the Sidebar list, the stage header.
- **Intake.** Composition (Segmented, Tree view rows); data app-only (rung 3 / 8).
- **Not chosen.** **Separate steps** (states mixed into the path and counted as steps); **not modelled** (comments
  only).

### 7. Numbers, link words, a note per step and flow checks (`notes`) — recommended

- **What.** Steps are numbered by place ("2 Verify email"); a link carries its element's words; a step has one optional
  note line (what happens and why), shown under its card on the map and in the step's facts; the flow has a description
  (the page's, in the Overview), as Figma's flows do. **Checks** gains a flow group: a step no one reaches, a dead end
  that isn't the last step, a form step with no error state, a step with no way back.
- **Why.** Annotation in the references is a description and step names; Whimsical's "close every path" is a check
  Area can run itself.
- **Affects.** `design-scan.ts` (flow checks), the Checks tab, the map's captions.
- **Intake.** Composition (rung 3).
- **Not chosen.** **Free notes placed on the map** (a canvas by another name); **comments only**.

### 8. Flow patterns in the system, after flows on pages (`patterns`) — recommended

- **What.** The system's Patterns gain flows (sign up, checkout, change a setting, create something): a set of
  pattern screens in order with their states and links. Add flow in a project copies one in as a new flow page.
- **Why.** Patterns show how the system builds a screen; a flow shows how it builds a task (GOV.UK writes its patterns
  as tasks: "Create accounts", "Check answers"). The screens this page draws are a first set.
- **Affects.** `content/examples` (a flow entry: screens and links), Patterns' gallery (a flow card), Add flow.
- **Intake.** Composition (rung 3): the screens are Area components; a flow entry is content.
- **Not chosen.** **Now, with this** (doubles the first build); **no** (projects start every flow from nothing).

### Later, not proposed now

- **Transitions per link** (Figma's Smart animate, Dissolve, Push). Until then, moves follow the system's Motion.
- **Present** (the flow alone, full window, with its description, for showing people).
- **Several start points per page** and **subflows** (a step that is a whole flow).

## Order of work if every recommendation is picked

1. Data: `links`, `of`, `state` in `projects.ts`, read and written with tests.
2. The map on a flow page and the card ↔ stage morph (proposals 2, 3).
3. Goes to in the Design view, logged and sent to Chat (5).
4. Play (4).
5. States (6), then notes and flow checks (7).
6. Flow patterns (8).

## Built (2026-11-08)

Owner: "go with your recs, build the flow like these ui examples", with three node editors (an agent builder's graph
with Start, If / else rows and End nodes on a dotted ground and a floating tool bar; a media pipeline of nodes with
ports and curved connectors; a payment automation with labelled conditions). Built proposals 1 to 7; 8 (flow patterns)
stays later, as recommended.

- **Data** (`apps/desktop/src/projects.ts`): `ProjectPage.links` (`FlowLink`: from, path, label, to or `back`) and
  `note`; `Layer.branch`, `of` + `state`, `note`; `setLink`, `setState`, `setBranch`, `setNote`; removal, duplication,
  the file and Undo carry them; iterations name flow changes ("Linked Continue to 3 Profile"). Tests:
  `apps/desktop/tests/flow.test.ts`.
- **Reading** (`src/flow.ts`): numbering (1, 1a), states, edges (a step with no forward link goes on to the next: an
  implicit "Next"; a Back link alone keeps it), what comes next, the link under a click, checks.
- **The map** (`src/flow-map.tsx`, `styles/design.css`): the examples' node style in Area's tokens. Changed from the
  proposal: **link words are rows inside the node** (the agent builder's If / else rows), not badges on the lines; the
  curves are beziers between ports; a **Start** node leads; **Fit** scales the whole map once nodes reach 208 (so the
  whole flow always shows), rather than keeping words at screen size at every zoom.
- **Second and third passes** (owner: "show the ui screens larger and not in giant containers … more proportional …
  more stylized", then, after a pipeline editor's graph, "more technical, more spacing around the labels, more
  consistency … lines coming out of and from the labels and screens consistent … proper turns and curves"): each step
  is now a node card with kind and role, name and mono source, a 320 × 200 screen, and port rows (In on the start,
  outputs on the end with their targets in mono), so no words sit on the lines; lines go port to port with a level
  stub, one 12 turn, a lane of their own in the channel between columns (16 apart) and round any card in their way; one
  dashed ink, the chosen step's solid in the selection colour and running; all on the 8 grid (card 336, columns 160
  apart, rows 80); the map opens fitted to the stage's height. Checked by measurement in the browser preview: every
  line ends on its port dot (0 px), none crosses a card, no label is cut.
- **Step and back**: double-click or Enter opens a step (the card's morph), Back / Esc / ⌘↑ returns with it chosen.
- **Goes to** in the Design view (`design-inspector.tsx`), logged and sent to Chat; **Play** in the stage with its
  bar; the **state switch** in the Canvas bar; **notes** and the page description; **checks** in the Inspector and the
  Checks tab.
- Checked in the browser preview (static build, a seeded test project), light and dark: map, open and back, Play
  through a link and a no-link step, Goes to → Back with its log entry and iteration. Not checked: Electron itself, a
  real pinch, keyboard-only use of the map beyond Enter, and the morph's animation (it plays only where motion is on).
- **Visual check of the technical restyle** (preview, light and dark, fit / 100% / 200%): two fixes. Zoomed in, the
  map grew the stage and the dock scrolled away with it; the map now pans in its own box (`.studio-flow__scroll`), the
  stage keeps its height, the dock stays over it, and a zoom keeps the view's middle. The fit left the dock over the
  lowest card's In row; it now fits above the dock (`DOCK_ROOM` 64). A state's rows now read like every other port
  ("→ Verify email · Error", "← 2 Verify email"). Measured after: every line end on its port (0px), nothing cut.

## Open

- Transitions per link, Present, several start points and subflows (later, as listed above).
- The iteration card still pictures one layer; a flow page's should picture its map.
- Card size, gaps and the arrowhead are proposed, not measured against a flow tool (Figma's canvas wasn't reachable);
  check them against a Figma prototype the owner can open.
- The review page draws the screens with Area's components in the placeholder vocabulary; the step names (Create
  account, Verify email …) are the flow's own words, as a project would name them.
