# Area: product brief

Nov 23, 2026 · @Ethan

This brief is the product scope for Area. It replaces the Sep 27 brief
([archived](archive/BRIEF-2026-09-27.md)). That one made Area a design system tool that writes to GitHub, with its own
workspace where screens were drawn, coded and shipped. This one makes Area a **layer beside the tools people already
use**. Area holds a product's design system and everything visual that belongs to it, gives that to any tool that makes
things, and shows in pictures what those tools did with it.

It is written from the owner's picks on the companion-layer study
([docs/research/companion-layer-2026-11-22](research/companion-layer-2026-11-22/README.md), decisions d1–d16 and §12),
and from the owner's later notes the same day, which simplified the structure into one Library of folders and elements
([elements.md](research/companion-layer-2026-11-22/elements.md)).
What carried over from the Sep 27 brief and what changed is listed [at the end](#changes-from-the-sep-27-brief).

> **Status on 2026-11-23.** The direction is decided, but the app has not been reshaped yet.
> - `AGENTS.md` and `docs/PRODUCT_UI.md` still describe today's regions and places. They change as each step of the
>   [build sequence](#build-sequence) lands, not before.
> - [What exists today](#what-exists-today) is accurate as of this date.
> - The [Library](#one-library) is prototyped in the app as two labs: Labs › Library (`#labs/library`) and Labs ›
>   Elements (`#labs/elements`), the kit of every element's container.

## Summary

Area keeps what your product looks like, and why, in one place you own. It hands that to every tool that makes things
for you, and shows you in pictures what those tools did with it.

- **One system holds everything visual.** That means foundations, components and patterns, and also logos, brand
  guidelines, illustrations, photography styles, visual assets, references, explorations, and documents that guide
  decisions. Each element can carry its own documentation, rules and agent instructions.
- **It is organized like files.** One Library holds folders (a system, a project, a campaign, a reference board).
  Folders hold elements, each element holds its variants, alternates and versions, and anything can carry files. Every
  element is shown live, as itself, and can be changed in place.
- **Any tool can read it.** That includes coding agents, editors, terminal agents, design apps, chat apps, web builders
  and local models. Each one is connected with a button, from one source, in open formats.
- **What the tools did comes back as pictures.** Area turns code changes and terminal output into before-and-after
  pictures in plain words. Anything off-system is flagged, and Fix or Keep goes back to the tool.
- **Chat prepares the work.** Area's chat is a visual design conversation: it asks with pictures, collects input, picks
  and references, and packages them into a brief that the connected agent executes.
- **Every pick and note is kept** as context and data. Agents read it today. A model of the system's own can be built
  from it later, on open weights, from the data the owner chooses.

The thesis is unchanged from the Sep 27 brief: AI can generate almost any interface. The unsolved problem is keeping what
gets generated consistent and of high quality while a product keeps changing. A design system is the layer that holds
that consistency. What has changed is where the work happens. People now make things in many tools at once, and each
of those tools keeps its own copy of the brand.

## Need

**Every tool keeps its own copy of your system.**

- Prompt-first generators and design tools all take a design system now. Each one ingests the brand and stores it in its
  own format: Claude Design, v0, Lovable, Bolt, Stitch, Magic Patterns, and Figma's Specs and guidelines (Oct 2026).
  The brand gets rebuilt in every tool and drifts between them.
- Design-system platforms serve agents over MCP, but they are priced for enterprises, rate-limited (Figma: 200 tool calls
  a day on a Full seat; zeroheight Free: 500 a month) and assume the system is already documented.
- Brand platforms serve logos and guideline text but no code values. One forbids using its brand kits outside its own
  app.
- Middlemen vanish (Backlight in 2025, Smithery's hosted proxy in Oct 2026), and configs pointing at them break.

**Agents drift even with a connection.**

- Agents still write raw hex and px values with a design MCP connected. Generators struggle with customized components.
- What works is files the agent reads (AGENTS.md, skills) plus a check it can run on its own work.

**Non-technical people can't see what happened.**

- Agents report in diffs and terminal text. Design tools show only their own canvas.
- Setting up a connection means editing JSON in hidden folders, restarting, and guessing why it didn't appear.

**Decisions are lost.**

- Why a corner is 12 and not 8, which of two directions won and what was rejected: this lives in chats and comments and
  disappears. It is exactly the context an agent, a new teammate or a future model needs.

Sources for all of the above: [the study's sources](research/companion-layer-2026-11-22/sources.md).

## Users

| Who | Uses today | Wants from Area |
| --- | --- | --- |
| Founders and solo builders | Coding agents, editors, web builders | Everything their tools make looks like their product, with setup that is only buttons |
| Brand and marketing leads | Chat apps, design apps, slide and social tools | One place for logos, colors, type, imagery and guidelines that every AI tool reads, and a way to see what was made |
| Designers | Design apps, review threads | A visual home for the system and its explorations, and handoff that agents actually follow |
| Engineers and design engineers | Repos, editors, CI | Generated files, an MCP server and checks in CI; everything stays in their repo and tools |
| Agencies and campaign teams | Many brands at once | Switch the system per client or campaign, and every tool follows |

The interface assumes no knowledge of Git, terminals or code. Everything underneath is still real files in open
formats, so engineers lose nothing.

## Product

### The system and its elements

A **system** is the one container for a product's look (owner, 2026-10-29: "System", not "Brand"; 2026-11-23: no
separate brand or taste layers). It holds **elements**, 55 kinds in 11 groups (the full list, with each kind's container,
is in [elements.md](research/companion-layer-2026-11-22/elements.md) and `apps/desktop/src/element-kinds.ts`):

| Group | Kinds |
| --- | --- |
| Color | Color, Color ramp, Palette, Gradient |
| Type | Typeface, Type style, Type ramp, Glyph |
| Foundations | Spacing, Corner, Elevation, Stroke, Motion, Grid, Material |
| Icons and logos | Icon, Icon set, Emoji, Logo, App icon, Texture |
| Imagery | Illustration, Illustration style, Photo, Photography style, 3D render, Video |
| Components | Component, Pattern, Chart |
| Screens | Screen, Phone screen, Web page, Template, Flow, Slide, Email |
| Marketing | Poster, Social post, Banner, Mockup, Print |
| Words | Voice, Copy |
| Files | Guideline, Research, Data, Code, Agent instructions, Brief, Link |
| Folders | System, Project, Campaign, Board |

Every element has:

- **Its source:** what it is kept as, which is what an agent edits: tokens, a font, SVG, React and CSS, an image, a
  video, Markdown, CSV or JSON. The Library draws the element live from it, and its Code view shows it.
- **Sub-elements:** **Variants**, the forms it ships in (a logo's mark, wordmark and lockup), all current;
  **Alternates**, designs being tried, one of which can be made current; and **Versions**, its past, newest first, one of
  which can be brought back. Every element has the same three.
- **Files:** guidelines, research, data, code, agent instructions, briefs and links, sorted by kind, any number of each.
  The person adds anything. Agents read them as the element's context. Agent instructions are generated as a skill when
  the element needs one.
- **One or more categories:** **Product** and **Brand** are built in, and the person can add others, such as Marketing,
  a campaign or Editorial. A connection can be limited to categories, so a slides tool gets Brand and Marketing only.
  Categories limit connections and search. They are not filters in the Canvas's header (owner, 2026-11-23).
- **Its history:** every pick, note and edit made about it.
- **Its state and origin:** in use, being explored or set aside; drawn in Area, imported or captured.

Everything in a system is context and data for the tools that read it. Product copy never calls it "taste".

### One Library

Everything is in one **Library**, organized like a file manager (owner, 2026-11-23: "a file organizer that contains
different elements … a comprehensive file manager with lots of layers and a grid library to organize visuals"). It
replaces the four places of the first draft of this brief (Systems, References, Connections and Activity):

- **Folders:** a system, a project, a campaign and a reference board are each a top folder. Any folder can hold folders,
  elements and files.
- **A project** is a folder **connected** to a real folder, repo or design file, made with real tools, that Area follows.
  Area does not draw or code screens itself.
- **Connections** live in Settings, and a connected folder shows its connection and status in its Design view.
- **Activity** is the first row of the tree, above the folders: one feed across connections, with what needs the person
  first. A connected folder also shows its own activity.

The window keeps the app's three regions:

| Region | Holds |
| --- | --- |
| **Sidebar** | The Library's tree: every folder and the elements inside it, as layers. Settings and the profile sit at its foot, as today |
| **Canvas** | A **header** (where this is, as a path; the view's controls: Grid or List for a folder, Visual or Code for an element; Add), then a **tab row** of what is open (folders and elements, each closable), then the open item. A folder shows its folders, then its elements grouped by kind, then its files. An element shows itself at true size (or its code), then its sub-elements, then its files |
| **Inspector** | **Design** (what it is and its properties, changed live; keep a change as an alternate), **Files**, and **Chat** |

**One card for every element** (owner, 2026-11-23: "i dont want there to be too many custom sizes/container
variations"). It has three parts: a frame, the name under it, and one fact. A kind sets only two things:

- **The size:** a **cell** (64 square, in a sheet, named on hover) for icons, glyphs and emoji; a **card** (square)
  for most kinds; or **wide** (16:9, on the same columns) for screens, pages, flows, slides, banners and video.
- **The contents:** one of nine placement rules the Design card and Asset card already have: Paint, Part, Mark,
  Steps, Sample, Media, Group, Screen and Page.

Labs › Elements shows every kind in its card.

### Chat: the visual conversation that prepares work

Area's chat is where a person works out what they want before a tool builds it (owner, 2026-11-23).

- **It asks with pictures.** Questions come as cards with options rendered in the system: two corners, three headers,
  a color on a real screen. They are built from the question cards that already exist (`question-kit.tsx`, Approval).
- **It shows things as they are.** An element named in chat appears as itself, rendered, not as a name.
- **It does the understanding.** It reads the system, the references and recent activity, asks what is unclear, and
  proposes options instead of asking open questions.
- **It packages the work.** The result is a **brief**: what to make or change; the elements, values and components to
  use; the decisions made, with the picked options; references; and what not to do. The brief is short enough for an
  agent to act on directly.
- **It hands off.** "Send to Claude Code" (or Cursor, or Codex) delivers the brief through the connection's MCP server,
  or copies it for a tool without one. The agent does the work in the person's own tool, and Activity shows the result.
  A brief is kept as a file on the element or folder it is about.
- **It sits beside what is open.** Chat is the Inspector's third view, so it always knows which folder or element the
  person is looking at.
- **It changes the system itself directly.** Requests like "make the corners softer" or "add a danger tone" apply to the
  system as a new working version, which is shown before it is published.
- **It does not edit the person's code.** That is the connected agent's job.

### Three window sizes

1. **Full window:** the Library: browse and edit folders and elements, review alternates, set up connections.
2. **Companion panel:** a narrow window that stays on top beside the editor or design app. It shows live activity, the
   current question from an agent or from chat, and the system's colors, type and assets to drag into any app.
3. **Quick find:** a global shortcut opens one search over the system's elements. It copies a value, copies it as code,
   or lets the person drag it out.

### Start: from what you already have

1. **Start from what you have:**
   - a website URL, which Area opens and measures with its capture script for colors, type, logo, corners, spacing and
     screenshots (the first source, owner 2026-11-23);
   - then a repo's tokens and CSS;
   - then images and a brand PDF;
   - then a design file;
   - or nothing, in which case the person answers a few questions.
2. **Confirm the draft.** What Area found is shown as choices, such as "Is this your primary color?" or "Which of these
   is your logo?". Every answer is kept with the element.
3. **Connect your tools.** Area lists the tools it finds on this Mac, each with a toggle (see [Connect](#connect)).
4. **Try it.** One button sends a test brief through a connected tool, and the result appears in Activity.

The target is under five minutes from a website URL to a connected tool.

### Customization: choices, not values

A system's look is a set of choices, which is what makes it portable and checkable.

- **Settings** (64 today, in `packages/tokens`): every option is kept (owner, 2026-10-18). They are shown as **Basics**
  (Accent, Neutral, Type, Corners, Density, Depth, Stroke and Motion) and **More** (the rest, one click away).
- **Inventory:** which components, variants, sizes and tones the system includes.
- **Structure:** each family's anatomy, where it has alternatives.
- **Patterns:** screens and flows built from the components.

There are no named looks (owner, 2026-10-18). Contrast rules are not choices.

### Connect

**One source, every format.** The system's choices are canonical, and everything a tool reads is generated from them:

```text
.area/
  system.json              the choices and the elements' metadata
  area.lock, base/         generated-file hashes and merge bases
  rules/                   kept literal values; rules with pictures
design-system/             generated
  tokens/                  DTCG 2025.10 tokens and a resolver (light/dark, density, contrast)
  css/                     custom properties; a Tailwind @theme sheet
  react/  icons/           components and icons
  components.json          options, parts, states, usage
  registry/                a shadcn registry, for web builders
  assets/                  logos, imagery, OFL fonts; FONTS.md lists every other face with its licence
  docs/                    each element's documentation and the system's documents
  skills/                  agent instructions, as Agent Skills
DESIGN.md                  generated
AGENTS.md                  a short generated block: rules, pointers, how to reach the server
CLAUDE.md                  "@AGENTS.md" where the project has none
```

- **Keep AGENTS.md short** (under ~150 lines): rules, commands and pointers. Detail goes in skills and documents.
  Exact values are served through the server or files read on demand.
- **Files are the floor, the server is extra.** Agents follow files better than tool calls, and some tools have no MCP.
- **Mark every generated file** "generated by Area", and let `area check` find drift.

**One button per tool.** Area finds the tools on this Mac (app bundles, config folders, commands on PATH) and uses each
tool's own install path first:

- a plugin or `claude mcp add` for Claude Code;
- an install link for Cursor;
- `code --add-mcp` for VS Code;
- `codex mcp add` for Codex;
- the others follow.

Area writes a config file only where there is no other way. Then it merges only its own key, backs the file up first,
and shows the exact change before writing. Each connection has:

- a status (on, last read, by which tool);
- the version it follows;
- the categories it reads;
- a **Test** button, which asks the tool to describe the system back;
- an **Undo**, which removes exactly what Area added.

Tools without MCP get **Copy for any AI**: a short brief with images, sized for a prompt.

**One server.**

- **Local first.** Area running is the server, over streamable HTTP on localhost. `area mcp` serves stdio when the app
  is closed. Both read the same files.
- **Remote, opt-in.** For chat apps and teammates: an HTTPS endpoint with per-person sign-in, serving a published
  version, at a stable URL.
- **Both protocol versions.** The server speaks the 2025-11-25 and 2026-07-28 MCP versions. Nothing depends on
  sampling or roots, which 2026-07-28 deprecates.

**What the server offers:**

- **Reading (built):** search and get components, resolve tokens, the rules, screenshots of components.
- **Reading (to add):** elements of every kind, assets and documents; patterns; references with images.
- **Checking:** validate a diff or files against the system.
- **Working with Area:**
  - `brief.get`, the work prepared in chat;
  - `activity.report`, what the tool did;
  - `activity.get_feedback`, the person's Fix, Keep and notes;
  - `ask`, a question card shown inside hosts that draw MCP Apps, with the answer kept with the element.
- **Limits:** every reply respects the connection's categories.

**Design tools.** Out, DTCG tokens and their resolver import into Penpot natively and into Figma through its import or a
plugin. Logos and imagery go as files, and fonts follow their licences. In, a system can be imported from a design file
through that tool's MCP, within its limits. A small plugin comes later.

### Activity: tool work in plain words and pictures

Every connection produces events: a tool's own report, a file change in a connected folder, or a version taken. Area
turns each one into a card.

- **Classified by design meaning:**
  - values changed;
  - components used, added or copied;
  - literal values introduced;
  - screens added or changed;
  - a version taken.
- **Pictures:** before and after, from the project's running app (Preview's capture) or from component screenshots. When
  neither works, a value change is drawn as swatches and type samples.
- **Words:** the system's own vocabulary, never Git's (`docs/PRODUCT_UI.md` rule 24). The card says "changed", "kept" and
  "sent back", never "commit", "diff" or "merge". The code is behind Show code.
- **Actions return to the tool.** Fix, Keep and notes reach the agent through `activity.get_feedback`, or as a one-line
  prompt to copy.
- **What needs the person comes first:** questions waiting, off-system changes, a new version to take.

### Picks, notes and history: the system's context and data

Every decision is kept, on every surface: chat, the full window, the panel, question cards in other tools, and the
review pages. Each one is appended, never overwritten, with:

- the question;
- the options as true-size renders with their source;
- the order they were shown in;
- the choice and its strength ("tie" and "both bad" included);
- a note;
- the system version;
- the person;
- a training flag, off by default (owner, 2026-11-23).

Edits keep before, after and the change. Captures of other products never train anything.

What it is used for, in stages (owner, 2026-11-23: stages 0–1 now):

| Stage | Uses | Delivers |
| --- | --- | --- |
| 0. Keep | The log on every surface | Context agents read today; agreement over time |
| 1. Rules and a judge | Retrieval over the system and past picks; a vision model shown the person's own similar picks | Written rules the person approves; "which would you pick?" with a confidence, used to rank and flag, never to decide |
| 2. A scorer, then adapters | ~300–600 pairs per person; ~1k verified code examples; a LoRA on an open model, trained locally (MLX) or hosted | Ranking, and local generation in the system's idiom, served to any tool |
| 3. A model of the system's own | Thousands of pairs and a GPU budget | Drafts in the system without a long prompt; research-grade today |

No model is promised as a feature until stage 1 shows its agreement honestly. The person's data is kept, owned and ready
for one. Hosted fine-tuning is closing, so open weights are the route.

## Output model

This carries over from the Sep 27 brief.

- **Managed source.** Area writes ordinary files the project owns. When a new version ships, Area regenerates and
  three-way merges with the last generated base and the project's own edits. Clean changes apply, and conflicts are
  listed for the person to choose. This is built (`packages/output`).
- **Send to project** is the one action in the app (owner, 2026-11-23). It writes the generated files, and opens a pull
  request when the person asks. Saving, reviewing and merging belong to the connected tool and the repository host.
- **Deterministic.** The same choices and library version always produce the same files.

## Frameworks and targets

This carries over from the Sep 27 brief, reordered by reach.

- **Generated now:** CSS custom properties, React, icons, `components.json`, DESIGN.md and an AGENTS.md block.
- **Next:**
  - DTCG tokens and a resolver;
  - a Tailwind @theme sheet;
  - Agent Skills;
  - assets and documents;
  - a shadcn registry.
- **Later, by demand:** Vue, Svelte, Web Components, then native targets. Agents port components from the reference
  implementation, and a port is accepted when it passes the component's conformance suite.

## The library

Area's component library stays. It is the **starting point** for a new system and the **reference** every check measures
against, not the headline.

- Every component is built from measured evidence and is Area's own (`docs/PRINCIPLES.md`, `docs/GOVERNANCE.md`).
- **A core 24 come first** (owner, 2026-11-23), because agents reach for them most:
  - Button, Icon button, Input, Textarea, Select, Checkbox, Radio, Switch;
  - Card, Dialog, Menu, Tabs, Table, Badge, Avatar, Tooltip, Toast;
  - Sidebar nav, Top bar, List row, Empty state, Breadcrumb, Progress, Skeleton.

  These are finished to owner-confirmed Complete before the rest of the review continues.
- Public sharing (Discover, Following, publishing items) comes after the layer works.

## Checks

These carry over from the Sep 27 brief, and they now run on every connected tool's work as well as the person's.

- **Literals:** raw values resolved to the nearest token, bound when exact, proposed when close, flagged otherwise. Built
  in `area check`.
- **Inventory:** components and options the system leaves out. Built.
- **Duplicates:** new components compared with existing ones.
- **Contrast** for every text and control role in every mode, and **geometry**.
- **Visual diff** of screens before and after a change.
- **Accessibility** on rendered screens.

The same checks run as CLI commands and in CI, and agents can call them through the server.

## Security and privacy

- **Local first.** Everything stays on the person's Mac unless they turn on the remote connector or publish.
- **No secrets in project files.** Connections use each tool's own sign-in or environment references.
- **Every config change is shown before it is made, and can be undone.** Install links can be spoofed, so the exact
  change is always shown.
- **Fonts and references follow their licences.** Only OFL font files are packaged. Every asset records its licence.
- **Training use is opt-in** per element and per collection. An export lists exactly what went in.
- **Telemetry is opt-in** and never includes content.

## What exists today

As of 2026-11-23, read from source (study §3).

| Part | State |
| --- | --- |
| System pages: Themes, Tokens, Colors, Typography, Typefaces, Icons, Illustrations, Spacing, Shape, Elevation, Motion, Components, Patterns, Versions | Built; the core of the product |
| Settings | 64 settings over 62 axes, continuous where it matters, sweeps across combinations |
| Library | 126 families (6 Complete, 119 In review), 772 icons, Area Serif in progress |
| Versions and publishing | Releases with Fixes / Adds / Needs work; projects follow a version |
| Setup | A scripted questionnaire with question cards |
| Chat | A real agent engine that edits code in a project's folder, with Keep/Undo per file; to be reshaped |
| Projects | Area-drawn pages, layers, Flows, a 9-tab page editor; to become Connections, with the editor parked |
| Preview, Files, terminal, GitHub actions | Built; Preview is reused by Activity; the rest parked |
| References | Reads an existing image library; no adding yet; Discover and Following are placeholders |
| Import | A stub |
| Coding apps | Copyable MCP snippets; nothing is written into tools |
| Labs › Library, Labs › Elements | A prototype of the Library (tree, header and tab row, folder grid, element view with sub-elements, Design / Files / Chat) and the kit of every element kind's card; data lives in the page |
| `packages/output` | `area init / build / check / mcp / definition`: CSS, React, icons, `components.json`, DESIGN.md, AGENTS.md; three-way merge; a read-only MCP server; unpublished |

## Build sequence

Each step is usable on its own, with a proof point and a stop condition.

| Step | Build | Proof point | Stop or rethink if |
| --- | --- | --- | --- |
| 0 | **The Library:** systems, projects and references become folders in one tree, with the Canvas's header and tab row and the Inspector's Design, Files and Chat (from Labs › Library); every element in its card (from Labs › Elements); park the page editor, Flows, Files, editor, terminal and the GitHub actions (owner, 2026-11-23: Area works beside other tools and does not write code itself); move Labs behind a developer setting | The app shows the Library and Activity, and nothing is lost | People look for the old places |
| 1 | **Connect:** DTCG tokens and resolver, Tailwind, skills, assets, CLAUDE.md; Add a tool for Claude Code, Cursor, VS Code and Codex (detect, one button, test, undo); the local server | A non-technical person connects two tools in under 2 minutes, and both describe the system back correctly | People still edit config by hand, or tools ignore the files |
| 2 | **Start from a website:** capture a URL into a draft system, confirmed through question cards; then a repo, images and a PDF | A real site becomes a system that looks like it in under 5 minutes | Drafts need heavy hand fixing |
| 3 | **Elements:** every kind's source and live drawing; variants, alternates and versions; files by kind; categories; connections limited by category | A brand lead keeps logos, imagery and guidelines in Area, and a connected tool reads only what its categories allow | Elements need more structure than folders and categories give |
| 4 | **Activity:** cards from connected folders, with checks and before/after; `activity.report`, `activity.get_feedback` | An agent's off-system change is caught, shown and fixed from the card, with no terminal | People still read the terminal to know what happened |
| 5 | **Chat that prepares work:** visual questions, the brief, Send to a tool, `brief.get`; system changes from chat | A brief made in Area is built by a connected agent without a follow-up question | Agents ask for what the brief should have said |
| 6 | **Panel and quick find; questions inside other tools** (`ask` as an MCP App); the pick log on every surface | A pick made inside another tool lands in Area with both options rendered | Hosts don't draw the card; fall back to a link into Area |
| 7 | **Remote connector and Copy for any AI** | A person with only a chat app gets output that matches the system | Chat apps ignore the pack |
| 8 | **Stage 1:** rules from picks, the judge, agreement shown | The judge predicts the next 100 picks better than chance, and shows by how much | Agreement stays near chance |
| Later | Stage 2 adapters; a design-tool plugin; public sharing; more targets | – | – |

The core 24 components are finished in parallel with steps 1–4, because every connection hands those out first.

## Differentiation

| Area | Compared with |
| --- | --- |
| The person's own system, in open formats, read by every tool | Each generator and design tool keeps its own copy |
| Everything visual in one system: foundations, components, brand assets, guidelines, documents, references | Design-system platforms hold code values; brand platforms hold assets and text |
| Each element carries its own guidance and agent instructions | Rules written once per tool, by hand |
| What tools did, shown in pictures with checks | Diffs, terminal output, or one tool's own canvas |
| Chat that prepares a brief for any agent | Chats that act directly, inside one product |
| Setup by buttons, tested and undoable | JSON in hidden folders |
| Every pick kept, ready for a model of the system's own | Decisions lost in chats and comments |
| Customization in layers with guardrails, from a measured library | Templates with a few global settings |

## Risks and open questions

- **Platforms add this themselves.** Claude Design, Figma and Supernova are each moving toward "your system, for agents".
  Area's defence:
  - it belongs to the person and works across all of them;
  - it holds everything visual, not only tokens;
  - it shows the results;
  - it is local first and open.

  If its output only works inside one host, the defence is gone.
- **A config writer is not a product.** The value is in Start, Activity and Chat around it.
- **Hosts change.** MCP changed shape in 2026-07-28, and packaging formats are shifting. The generated files are the
  floor that works everywhere.
- **Non-technical people's tools are mostly in the cloud.** Without the remote connector they get only Copy for any AI.
  Remote means hosting, accounts and a security surface.
- **Judges and models disappoint.** About 60% agreement on close calls is the current state of the art. Show the number
  honestly.
- **Licences.** Fonts and captured references travel with the system and need care.

**Open questions for the owner**

- Which categories ship built in besides Product and Brand.
- Pricing: free locally with a paid remote connector and teams, or per system.
- Whether the remote connector is hosted by Area or self-hosted.
- When public sharing returns.

## Changes from the Sep 27 brief

| Kept | Changed | Parked or dropped |
| --- | --- | --- |
| The app's three regions: Sidebar, Canvas, Inspector | One Library of folders replaces the separate places; the Canvas is a header, then a tab row of what is open | Places and tabs as fixed kinds (Home, References, a system, a project) |
| The thesis: consistency, not generation, is the unsolved problem | Area is a layer beside other tools, not the workspace where work is done | Product and Lab zones; the "one place for System, Product and Lab" workspace |
| Systems defined as choices; customization in layers; no named looks | One system holds every kind of visual element, each with its own guidance and categories | The Builder as a long guided sequence (becomes Start plus question cards) |
| Managed source with three-way merge; `area` CLI; checks; MCP | Projects become Connections to real folders, repos, design files and apps | The page editor, Flows, Files, editor and terminal (parked) |
| Measured, first-party component library | The library is the starting point, not the headline; a core 24 first | GitHub save / review / publish inside Area (one Send to project action instead) |
| Local first; the person's own model provider | Chat prepares a brief for the connected agent instead of editing code | Public library and publishing (after the layer works) |
| No Git words in the interface | Tool work comes back as pictures (Activity) | Fine-tune calibration as a builder step (picks are kept on every surface instead) |
| Many frameworks through one neutral definition and conformance suites | Every pick is kept as data for a future model on open weights | The browser-first Studio (the desktop app is the product) |
