# Area as a companion layer (2026-11-22)

Owner: "i want to think of this area project more as a layer/independent app/companion app for existing IDE's,
terminal code editors, design apps, etc. … it should contain and manage design systems, visual components, brand
elements, guidelines, anything visual that supports or belongs to your product, brand, company, campaign … giving
context to agents, code editors, IDEs … its own 'model' for designing … very easy for non technical people … translate
very technical code updates and long lines of cli speak to a much more visual, interactive, and intuitive organizer …
seamlessly translate and take your design data anywhere … store all your visual design data and preferences for a
future model specific to your brand, built on open source weights … figure out how to simplify the current area
product to focus more on something more lightweight that can be leveraged by any tool."

A study only: nothing under `packages/` or `apps/desktop` changed. **The owner picked on 2026-11-23: every
recommendation, plus three notes that change the model** (see [§12](#12-the-owners-picks-2026-11-23)). The notes win
over the sections below where they differ. The new `docs/BRIEF.md` is written from the picks.

How it was researched: four parallel reads on 2026-11-22. One read Area from source (`3b3ceb4d`). Three read the outside
from vendor docs, specs and papers: the products that give design context to agents, the standards and install paths,
and what a brand-specific model can do today. Sources are in [sources.md](sources.md). Claims the readers could not
confirm in a primary source are marked *(unverified)*.

---

## 1. The idea in one sentence

**Area keeps what your product looks like, and why, in one place you own. It hands that to every tool that makes
things for you, and shows you in pictures what those tools did with it.**

It is not the place where screens are coded or drawn. That stays in the tools people already use, such as a coding
agent, an editor, a design app or a chat. Area sits beside them as its own window and does five jobs.

| Job | What the person does | What Area does |
|---|---|---|
| **Capture** | Points Area at what they have: a website, a repo, a design file, a brand PDF, screenshots | Drafts a system from it (colors, type, logo, corners, spacing, voice), shown as choices to confirm |
| **Keep** | Organizes the system, brand assets, references and explorations, and makes picks | Versions everything; every pick, reject and note is kept |
| **Connect** | Turns on the tools they use, one button each | Writes each tool's config, serves the system to it, and shows which tools are reading it |
| **See** | Watches the activity feed | Turns each tool's changes into plain words and before/after pictures, flags anything off-system, and sends Fix / Keep back to the tool |
| **Teach** | Keeps picking | Turns picks into written taste rules first, then a judge, then, later and only if the person chooses, a model of their own |

The library of components that Area has spent two months building stays. It is the **starting point** for a new system
and the reference that every check measures against. The headline moves from "a large library" to "your system,
everywhere".

## 2. Why now, and where the gap is

### What changed outside since the brief (Sep 27)

- **Every generator now takes a design system, but only for itself.** Each one ingests the brand and stores it in its
  own format, so a brand gets rebuilt in every tool and drifts between them:
  - Claude Design: import from GitHub or files, several systems, checks against the system, round trips with Claude Code.
  - Figma: Specs, guidelines files, system checks (Oct 15, 2026), all on paid plans.
  - Lovable: design-system projects with versions pinned per project.
  - Bolt: Design System Agents.
  - Stitch: extracts a system from a URL and writes DESIGN.md.
  - Magic Patterns: a Design System Agent.
- **Design-system platforms serve agents, priced for enterprises.**
  - Supernova's AI context management publishes scoped contexts per team or agent, each as its own MCP endpoint. It is
    the closest existing match to this idea, and is aimed at teams that already have a documented system.
  - zeroheight, Knapsack, Chromatic and UXPin each have an MCP server.
- **Brand data is walled in on purpose.** Canva's connector reached 3.7M users, but its policy forbids using a brand kit
  for generation outside Canva. Frontify and Bynder serve assets and guideline text, but no code tokens.
- **The open standards settled.** DTCG tokens 2025.10 is stable, with a Resolver module for light/dark and other modes.
  AGENTS.md and Agent Skills are both under the Linux Foundation's Agentic AI Foundation. Skills are read by 70+ tools,
  and AGENTS.md by roughly 20 coding agents. MCP Apps (interactive UI inside a host) is stable in Claude, ChatGPT,
  Cursor, Goose and, experimentally, VS Code.
- **MCP alone does not make agents comply.** Agents still hardcode hex values with Figma's MCP connected. v0 says it
  struggles with customized shadcn components, and Figma Make users report it ignoring their library. The fixes that
  work combine files the agent reads (AGENTS.md, skills) with a check tool the agent can call on its own work.
- **Middlemen disappear.** Backlight shut down in June 2025. Smithery's hosted proxy shut down on Oct 31, 2026, and the
  configs pointing at it broke. Portability is a selling point.

### The gap

1. **Nobody joins the three layers.**
   - The **system**: tokens, components, rules.
   - The **brand**: logos, imagery, type files, voice.
   - The **taste**: references, explorations, picks with pictures and the reasons.

   Design-system tools hold the first, brand tools the second, and nobody holds the third. Figma Specs and DESIGN.md
   start on the "why", but in text only and tied to one vendor.
2. **Nobody is the owner's own.** Every holder is a vendor's store, reached through that vendor's seats and quotas
   (Figma: 200 tool calls a day on a Full seat; zeroheight Free: 500 a month). None is a folder you keep, with open
   formats, that works when the vendor changes plans.
3. **Nobody shows non-technical people what the tools did.** Agents report in diffs and terminal text. Design tools
   show their own canvas. There is no place that says "your agent added a pricing page using Card and Button, and two
   of its colors aren't yours. Fix or keep?"
4. **Nobody collects taste in a form a model can learn from.** Picks happen in chat, in review comments and in Slack,
   and are lost.

Area already has unusual pieces for exactly this gap:

- a system defined as **choices** (64 settings and an inventory), which is what makes it portable;
- a generator with a three-way merge (`packages/output`);
- `area check`, which finds literal colors and lengths, unknown tokens and off-system components;
- a read-only MCP server;
- a capture script that measures real pages (`apps/docs/public/area-capture.js`);
- hundreds of owner picks already recorded in review pages' `verdicts`.

## 3. What Area is today, and how far it has drifted

Read from source on 2026-11-22. Line counts are lines of code.

| Part | Size | State |
|---|---|---|
| `apps/desktop` | 63k | Shell with three regions and tabs (Home, References, Projects, Systems, Labs); 31 pages |
| System pages (Themes, Tokens, Colors, Typography, Typefaces, Icons, Illustrations, Spacing to Motion, Components, Patterns, Versions) | ~6k | Real; the core of the product |
| Setup (New theme) | ~2.1k | A scripted questionnaire; each answer writes a setting |
| Project page editor (`design-*.ts(x)`, a 9-tab panel) | ~3.6k | Real direct editing of a serializable tree; edits are sent to Chat |
| Flows | ~0.6k | A node map of pages |
| Chat (`src/chat`, `electron/agent.cjs`) | ~3.1k | A real Claude Agent SDK engine that edits code in the project's folder, with Keep/Undo per file and a line-diff Changes view |
| Preview, Files, terminal | ~0.9k | A webview of the user's localhost app; a text editor and terminal, off by default |
| GitHub (`electron/github.cjs`) | 148 | Save = commit, review = PR, publish = merge, through `gh` |
| References | 279 | Reads an existing image library; no way to add from the app; Discover and Following are placeholders |
| Home › Import | – | A stub ("Not built yet") |
| Settings › Coding apps | 45 | Copyable MCP snippets for Claude Code, Cursor, VS Code and Codex; nothing written, never tried in those apps |
| Labs (Materials, Tests, Feed, Chat) | ~1.5k | Internal tuning pages |
| `packages/output` | 2.5k | `area init / build / check / mcp / definition`; writes CSS, React, icons, `components.json`, DESIGN.md and an AGENTS.md block; **no DTCG JSON, Tailwind, skills or brand data**; unpublished |
| `packages/tokens`, `styles`, `react`, `icons` | 73k | 62 axes and 64 settings; 126 families (6 Complete, 119 In review); 772 icons |

**The drift.** Since Nov 10 the app has been growing into a coding environment: a chat engine that edits the user's
code, a line-diff Changes view, Preview, a file editor, a terminal and git through `gh`. Those were reasonable steps
toward "Area is where you build". The new direction says the opposite: **people build in their own tools, and Area is
what those tools read from and report to.** Most of that work stays useful in a different form (§6). The parts that
copy an IDE should be parked, because every coding tool will always do them better than Area.

**The review bottleneck.** There are 6 Complete families out of 126. A companion layer needs a smaller set finished
well (§6.4) more than a large set in review.

## 4. Who it is for, and what they need

| Person | Today | What they want from Area |
|---|---|---|
| **Founder or solo builder** using Claude Code, Cursor, Lovable or v0 | Every new screen comes out in a slightly different style; they paste hex values into prompts | "Make everything my tools produce look like us," with no setup beyond buttons |
| **Brand or marketing lead** using Canva, ChatGPT, Claude or Figma | Brand PDF, logo zip and a Notion page; AI tools ignore all three | One place for logos, colors, type, imagery and voice that every AI tool reads, plus a way to see what was made |
| **Designer** | Explorations scattered across files; picks lost in comments | A visual home for the system, explorations and picks; hand-off that agents actually follow |
| **Engineer or design engineer** | Writes AGENTS.md and token files by hand; agents still drift | Generated files, an MCP server and `area check` in CI; everything stays in their repo and tools |
| **Agency or campaign team** | Many brands, each in its own folder | Switch the active system per client or campaign; every tool follows |

The first two are the reason for "very easy for non technical people". They never open a terminal, and many never open
an IDE. Most of their tools are chat apps and web generators, which reach a system in only three ways:

- a **remote** MCP connector (a URL and a sign-in);
- a **pasted context pack** (text and images);
- an **uploaded file**.

So Area cannot be local-only for them (§7.3).

## 5. The product, simplified

### 5.1 Four things, not seven

| Thing | Holds | Replaces today's |
|---|---|---|
| **Systems** | Each system: **Brand** (logo, colors, type and font files, imagery, voice, rules), **Foundations**, **Components**, **Patterns**, **Explorations**, **Versions** | Systems (gains Brand and Explorations) |
| **References** | Saved images, captures, links and collections, each optionally attached to a system | References (gains adding: drop, paste, URL, capture) |
| **Connections** | Each tool and each place the system is used (a repo folder, a design file, a chat app), the version it follows and its activity | Projects, Settings › Coding apps |
| **Activity** | One feed across connections: what each tool did, in pictures, with what needs you first | Home, Changes, notices |

Projects as Area-drawn documents with pages and layers fold away. A "project" becomes a **connection**: a real folder,
repo or design file, made with real tools, that Area follows. That matches what the owner described, and it removes the
largest duplicate of IDE and design-tool work in the app.

Recorded decisions this keeps:

- **System** stays the name (owner, 2026-10-29). A system is the look plus its rules, and brand assets are part of the look.
- The three-region shell stays: Sidebar, Canvas and Inspector, each with its own header.
- No named looks (owner, 2026-10-18).
- Settings keep every option (owner, 2026-10-18). §6.3 lays them out in levels; none is cut.

### 5.2 Three window sizes

A companion has to live beside other apps, not only full-screen.

1. **Full window.** Today's app: browse and edit systems, review explorations, set up connections.
2. **Companion panel.** A narrow (~360) window that stays on top, docked beside the editor or design app. It shows the
   live activity feed, the current pick ("Your agent asks: which of these two cards?"), and the active system's colors,
   type and assets to **drag** into any app.
3. **Quick find.** A global shortcut (⌘⇧Space, configurable) opens one search over tokens, colors, icons, logos and
   components. Return copies the value, ⌥Return copies it as code, or the result can be dragged out. Like a launcher,
   but for your brand.

The panel and the quick find are what make it feel like a layer instead of another app to switch to.

### 5.3 Onboarding in five steps, under five minutes

1. **Start from what you have.** A website URL (Area opens it, measures it with the capture script, and takes colors,
   type, logo, corners, spacing and screenshots), a repo folder, a design file, a brand PDF or images, or nothing (the
   Setup questionnaire). Today's Import is a stub; this is the most important thing to build (§9).
2. **Confirm the draft.** Area shows what it found as choices, such as "Is this your primary color?" or "Which of these
   is your logo?", using the question cards that already exist (`question-kit.tsx`). Every answer is logged as a pick.
3. **Connect your tools.** Area lists the tools it found on this Mac (§7.2), each with a toggle. Turning one on shows the
   exact change it will make, then makes it.
4. **Try it.** One button sends a test prompt through a connected tool ("Make a pricing card in my system"). The result
   appears in Activity, so the person sees the whole loop working once.
5. **Keep going.** From here on, picks happen wherever the person works (§8.1).

## 6. What to keep, reshape, park and retire

### 6.1 Keep (the core)

| Part | Why |
|---|---|
| System pages (Themes, Tokens, Colors, Typography, Typefaces, Icons, Illustrations, Spacing, Shape, Elevation, Motion, Components, Patterns, Versions) | This is the system people manage |
| Settings as choices (`packages/tokens` axes, registry, palette) | A system defined by choices is what makes it portable and checkable |
| Publish and versions (`systems.ts` releases, Fixes / Adds / Needs work, followed versions) | Connections follow versions; this already exists |
| `packages/output` (generator, three-way merge, `area check`, `area mcp`) | It becomes the delivery engine for every connection |
| Setup questionnaire and question cards | They become the "Confirm the draft" step and the picker inside other tools |
| ⌘K, Settings › Appearance, the shell | Unchanged |
| Component library and icons | The starting point for new systems and the reference for checks |

### 6.2 Reshape

| Today | Becomes | Notes |
|---|---|---|
| Projects (Area-drawn pages, layers, flows) | **Connections** (a folder, repo, design file or chat app that uses a system) | The project's folder, pinned version and release notice already exist and carry over |
| Home feed | **Activity** across connections, with "needs you" first | Reuses the feed kit |
| Chat's Changes view (line diffs, Keep/Undo) | **Activity cards**: plain words, before/after pictures, off-system flags, Fix / Keep; the diff is behind "Show code" | The engine's file records and `area check` already exist |
| Chat (an agent that edits the user's code) | **Ask about your system**: changes to the system itself ("make the corners softer", "add a danger tone"), explanations, Setup by chat | Coding in the user's project moves to their own tool, which Area connects to. Area stops being a second coding agent |
| Preview (webview of localhost) | A step in Activity: when a tool changes a screen, Area captures before and after from the running app | Kept, used differently |
| Settings › Coding apps (copyable snippets) | **Connections › Add a tool**: detect, one button, test, status | §7.2 |
| References (read-only library) | References with adding (drop, paste, URL, capture a live page), tagged to a system | The image library under `Area/Brand` already exists |
| Review pages' `verdicts` (in artifacts) | The **taste log** inside Area (§8) | The same shape, kept with the system |

### 6.3 Settings: keep every option, show fewer at first

There are 64 settings. The owner's rule is that no option is cut. So lay them out in levels:

- **Basics** (about 8): Accent, Neutral, Type face and size, Corners, Density, Depth, Stroke, Motion. Every person sees
  these, and Setup asks about them.
- **More** (the rest, grouped as today): open with one click, and agents can change them through "Ask about your system".

This is presentation only; the registry and its output don't change. It overlaps open plan step D ("simplifying the
settings, which needs owner picks") and should be decided with it.

### 6.4 Finish a core set first

Agents reach for a small set of components most of the time. Finishing about 24 families to Complete is worth more to a
companion layer than reviewing all 126:

Button, Icon button, Input, Textarea, Select, Checkbox, Radio, Switch, Card, Dialog, Menu, Tabs, Table, Badge, Avatar,
Tooltip, Toast, Sidebar nav, Top bar, List row, Empty state, Breadcrumb, Progress, Skeleton.

The rest stay in review, as they are now.

### 6.5 Park (hidden, code kept, not maintained)

| Part | Why |
|---|---|
| Project page editor (`design-*.ts(x)`, the 9-tab panel) and Flows | Drawing and editing screens is what design tools and coding agents do. Area shows what they made |
| Files, code editor, terminal (`tech-tools.ts`) | Every editor does this better; the brief already ruled out an editor |
| GitHub save / review / publish inside Area | The connected tool and the person's repo host do this. Area keeps one action, **Send to project**, which writes the generated files (and opens a pull request when the person wants one) |
| References › Discover and Following | Public sharing is a separate product; it comes after the layer works |
| Labs in the app's nav (Materials, Tests, Feed, Chat) | Internal tools; move behind a developer setting |

### 6.6 Separate tracks (not part of the layer)

- **Area Serif** keeps its own track. It is also a good first example of a brand asset in a system: a typeface with a
  licence, files, roles and rules.
- **Visual experiments** already live outside Area (`~/Desktop/experiments`).

## 7. Connect: one source, every tool

### 7.1 The package: one folder, generated from the choices

One canonical source (the system's choices) and everything else generated from it, so nothing drifts. The layout
extends today's `.area/` and `design-system/`:

```text
.area/
  system.json              the choices (today's definition), plus brand and rules
  area.lock                generated-file hashes (today)
  base/                    merge bases (today)
  rules/                   kept literals (today), do / don't with pictures
design-system/             generated
  tokens/
    system.tokens.json     DTCG 2025.10; Area's own data under $extensions["app.area"]
    system.resolver.json   modifiers: theme (light/dark), density, contrast
  css/                     today's sheets, plus tailwind.css (@theme inline)
  react/                   today
  icons/                   today
  components.json          today: options, parts, states, usage
  registry/registry.json   shadcn registry (theme + items), for v0 and shadcn projects
  brand/
    brand.json             logos (with clear space and minimum size), color roles, type roles, voice, naming
    logos/*.svg  imagery/  voice.md
    fonts/                 OFL files only; FONTS.md lists every other family with its licence and fallback
  skills/
    area-use-the-system/SKILL.md
    area-build-a-screen/SKILL.md
    area-check-my-ui/SKILL.md
DESIGN.md                  generated (today)
AGENTS.md                  a short generated block (today): rules, pointers, how to call the MCP
CLAUDE.md                  "@AGENTS.md" when the project has no CLAUDE.md
```

Rules from the research:

- **Keep AGENTS.md short** (under ~150 lines): rules, commands and pointers, never a dump of token values.
- **Put detail in skills**, and serve exact values through MCP or files read on demand.
- **Mark every generated file** "generated by Area, do not edit", and let `area check` find drift.
- **Treat the generated files as the floor and MCP as the extra.** Agents follow files better than tool calls, and some
  hosts don't support MCP.
- **Use DTCG for export only.** The definition stays as choices; storing resolved values would turn every library
  update into a token rewrite. This was already decided in the output study (2026-11-08); §7.1 only adds the export.

### 7.2 Add a tool: detect, one button, test, status

For each tool Area finds on this Mac (by its app bundle, config folder or command on PATH), it offers the host's own
install path first, and writes a config file only when there is no other way:

| Tool | Best path |
|---|---|
| Claude Code | A plugin (MCP + skills in one install), or `claude mcp add` |
| Claude Desktop / web | A remote connector URL with sign-in; `.mcpb` as a fallback (its directory now prefers remote servers and plugins) |
| Cursor | Install deeplink (`cursor://…/mcp/install`), plus `.cursor/rules/area.mdc` |
| VS Code (Copilot) | `code --add-mcp`, plus `.github/copilot-instructions.md` |
| Codex | `codex mcp add`, or a merged `[mcp_servers.area]` in `config.toml`; AGENTS.md |
| Gemini CLI | An extension (`gemini-extension.json`) |
| Windsurf, Zed, Cline, Goose, LM Studio | Their config files or deeplinks |
| ChatGPT | Developer-mode app with a **remote** URL only (Business, Enterprise and Edu today) |
| Figma, Penpot | Out: a token import file (DTCG) or a small plugin. In: read their MCP to import a system |
| Web generators (Lovable, v0, Bolt) and chat apps without MCP | **Copy for any AI**: a context pack (a short brief plus images, sized for a prompt), or the shadcn registry URL |

Each connection shows:

- a status (on, last read, by which tool);
- the version it follows;
- a **Test** button that asks the tool to describe the brand back;
- an **Undo** that removes exactly what Area added.

Safety rules:

- Show the exact change before making it. Install deeplinks can be spoofed, so the app always shows the real command.
- Merge only Area's own key, back up first, write atomically, and keep comments (JSONC- and TOML-preserving parsers).
- Never put secrets in project files.

### 7.3 One server, local first, reachable when needed

- **Local** (default): Area running is the server. The desktop app serves streamable HTTP on localhost, and `area mcp`
  serves stdio for when the app is closed. Both read the same files.
- **Remote** (opt-in, for chat apps and teams): an HTTPS endpoint with OAuth (Client ID Metadata Documents, per person,
  so removing someone revokes their access) that serves a published version. Claude web, ChatGPT and team members need
  this. It is the only part that needs a hosted service, and it must have stable URLs (Smithery is the warning).
- **Speak both MCP versions.** `area mcp` already answers both the 2025-11-25 and 2026-07-28 handshakes. Don't build on
  sampling or roots, which are deprecated in 2026-07-28.

### 7.4 The MCP surface, extended

| Already built (read) | To add |
|---|---|
| `system.search_components`, `system.get_component`, `system.resolve_token`, `system.validate_diff`, `system.get_rules`, `preview.screenshot` | `brand.get` (logos, color and type roles, voice), `brand.get_asset` (an SVG or image), `system.list_patterns` and `system.get_pattern`, `references.search` (with images) |
| | `activity.report` (a tool says what it did, which feeds Activity), `activity.get_feedback` (the person's Fix / Keep / notes, which the tool reads next) |
| | `taste.ask` (an MCP App: a picker card inside the host, so a pick made in Claude or Cursor goes to the taste log), `taste.rules` (the current written taste) |
| | Resources: `area://tokens`, `area://brand`, `area://component/<slug>`; skills over MCP where the host supports it |
| | **Scopes**: a connection can be limited to "marketing", "product UI" or "slides", so agents get only what they need (Supernova and Chromatic do this; Claude Design was criticised for burning tokens) |

### 7.5 Design tools

- **Out:** DTCG tokens and the resolver import into Penpot natively and into Figma through its rolling-out DTCG import or
  a plugin. Figma variables hold only colors, numbers, strings and booleans, so type and shadows need a plugin. Logos and
  imagery go as files; fonts follow their licences.
- **In:** import a system from a Figma file through Figma's MCP (its seat and quota limits apply) or from a DTCG file.
- **A small plugin** for Figma and Penpot that pulls the active system's variables, styles and assets is worth more than
  a deeper sync. It is not urgent; files cover the first cases.

## 8. See and Teach: translation and taste

### 8.1 Activity: tool work in plain words and pictures

Every connected place produces events: a tool's own `activity.report`, a file change in a connected folder, or a new
version. Area turns each one into a card:

> **Your agent added a Pricing page** · 3 files · Card, Button, Badge
> [before | after]
> Two colors aren't from your system (#1A73E8 on the plan names). **Use Accent** · **Keep them** · Show code

How:

- **Classify by design meaning, not by file.**
  - Tokens changed.
  - Components used, added or copied (near-duplicates).
  - Literal values introduced (`area check` already finds these).
  - A screen added or changed.
  - A system version taken.
- **Pictures:** before and after from the project's running app (Preview's capture) or from `preview.screenshot`; when
  neither works, a token diff drawn as swatches and type samples.
- **Words:** follow `docs/WRITING.md` and the rule against git words (PRODUCT_UI rule 24). Write "changed", "kept",
  "sent back"; never "commit", "diff" or "merge" in the card. The code stays behind "Show code" for engineers.
- **Actions go back to the tool.** Fix / Keep / a note become `activity.get_feedback` for MCP tools. For others, Area
  writes a one-line prompt to copy ("Replace #1A73E8 with var(--area-accent) in pricing.tsx").
- **What needs you comes first:** picks waiting, off-system changes, a new version to take.

### 8.2 The taste log: collect picks correctly from day one

The research is clear that the value is in the log, and only if it is recorded right. Each decision is one appended
event, never overwritten:

```jsonc
{ "id": "…", "at": "2026-11-22T10:04:00Z", "person": "…",
  "system": "area", "version": "2.3.0", "snapshot": "sha256:…",          // what the system was at the time
  "question": "Card corner for the pricing page",                        // what was decided, with context
  "options": [ { "id": "a", "image": "sha256:…png", "source": "…", "settings": { … } },
               { "id": "b", … } ],
  "shownOrder": ["b", "a"],                                              // randomised, logged
  "choice": "a", "strength": 3,                                          // 1–4; or "tie", or "both-bad"
  "note": "softer reads friendlier here",
  "surface": "companion-panel" ,                                         // review page, Inspector, an MCP App in Cursor …
  "train": false }                                                       // opt-in per item and per collection
```

- Options are kept as true-size renders plus their source, so a pick is usable data later. A pick without both options
  rendered is not training data.
- Every surface writes the same event: today's review pages (their `verdicts`), the Inspector, question cards in Setup,
  and `taste.ask` inside other tools.
- **Owner edits are the strongest signal.** Keep before, after and the change.
- **Consent:** `train` is off by default, per item and per collection, and always off for captures of other products.
  Every asset has a licence field, and an export lists exactly what went in.
- It is stored locally beside the system (`taste/events.jsonl` plus content-addressed images) and exports to a Hugging
  Face dataset folder.

### 8.3 From picks to a model of your own: four stages

| Stage | Needs | Delivers | Honest limit |
|---|---|---|---|
| **0. Log** (now) | The event above on every surface | A growing record; agreement over time | Nothing a model can use until options are rendered and kept |
| **1. Written taste + judge** (weeks, no training) | Retrieval over the system, rules and past picks; a vision model prompted with ~8 of the person's own similar past picks | `taste.rules` that the person edits and approves; "which would you pick?" with confidence; flags in Activity | ~60% agreement on close calls (DesignPref, 2025). Good at ranking, poor at naming specific faults. Model each person, not the team: designers agree with each other poorly |
| **2. A small scorer, then adapters** (at ~300–600 pairs per person; ~1k verified code examples) | A per-person scorer (DesignPref beat a pooled model with 360 pairs); then a LoRA on an open model (Qwen3, gpt-oss) via MLX on a Mac (16–32 GB) or a hosted trainer (Together, Fireworks); KTO from accept/reject, DPO from edits and pairs | Best-of-n ranking by the scorer; local, private generation in the house idiom; served through Ollama or LM Studio as a model any tool can choose | Gains over a good stage 1 are unproven for design systems; adapters go stale with each version and must be tied to one; DPO under ~400 pairs is marginal |
| **3. A brand model** (thousands of pairs, GPU budget) | The scorer as a reward with structural and rule checks first; a vision-in, code-out base; an image style (Recraft styles, Firefly custom models or a Flux LoRA) for imagery | A model that drafts screens and imagery in the brand without a long prompt | Research-grade; reward hacking; even then it sits on top of stage 1's retrieval, not in place of it |

What this means for Area now:

- **Build stage 0 into everything, and stage 1 next.** Neither needs training, and both are useful on the first day.
- **Don't promise a fine-tuned model as a feature yet.** Promise that the person's data is kept, owned and ready for one.
- **The hosted routes are closing.** OpenAI is winding down fine-tuning (closed to new organisations since May 7, 2026),
  and there is no current public Claude fine-tuning. The open-weights route is where adapters live. That fits the
  owner's "built on open source weights".
- **Image style is the cheapest early win** for brand teams. Recraft builds a style from 1–10 references with no
  training. It goes in Brand › Imagery as an optional connection.

## 9. Build sequence

Each step is usable on its own and has a proof point, as in the brief.

| Step | Build | Proof point | Stop or rethink if |
|---|---|---|---|
| **0** | Decide (this page). Park §6.5 behind a developer setting; Projects shows Connections; Labs leave the nav | The app shows four things and nothing is lost | – |
| **1** | **Connect:** the package additions (DTCG + resolver, Tailwind, skills, CLAUDE.md, brand.json); Connections › Add a tool with detect, one button, test, undo, for Claude Code, Cursor, VS Code and Codex first; the localhost server | A non-technical person connects Claude Code and Cursor in under 2 minutes, and both describe the brand back correctly | People still edit config by hand, or tools ignore the files |
| **2** | **Capture:** import from a website URL (capture script), then a repo's tokens and CSS, then images and a PDF; the draft confirmed through question cards | A real site becomes a system that looks like it, in under 5 minutes | Drafts need heavy hand fixing |
| **3** | **See:** Activity cards from connected folders (file changes + `area check` + before/after); `activity.report` and `activity.get_feedback` | An agent's off-system change is caught, shown in pictures and fixed from the card, with no terminal | People still read the terminal to know what happened |
| **4** | **Companion panel and quick find**; `taste.ask` as an MCP App; the taste log on every surface | Picks made inside Claude or Cursor appear in Area's log with both options rendered | Hosts don't render the app; fall back to links back to Area |
| **5** | **Brand:** logos, imagery, voice, fonts with licences; Copy for any AI; the remote connector (opt-in) for chat apps and teams | A brand lead with no coding tools gets on-brand output from a chat app | Chat apps ignore the pack |
| **6** | **Taste stage 1:** written taste rules from picks, the judge, held-out agreement shown | The judge predicts the owner's next 100 picks better than chance, and shows by how much | Agreement stays near chance |
| **7** | **Taste stage 2:** export a dataset; a guided local adapter (MLX) or hosted trainer; serve it to tools | A local model ranks or drafts better than stage 1 on the owner's held-out picks | It doesn't; then stay at stage 1 |
| Later | Figma/Penpot plugin, public References, more targets | – | – |

The core set of components (§6.4) is finished in parallel with steps 1–3, because every connection hands those out first.

## 10. Risks

- **Platforms add this themselves.** Claude Design, Figma and Supernova are each moving toward "your system, for agents".
  Area's defence:
  - it belongs to the person and works across all of them;
  - it carries brand and taste, not only tokens;
  - it shows the results visually;
  - it is local-first and in open formats.

  If Area's output only ever works inside one host, the defence is gone.
- **Becoming a config writer.** Detect-and-write alone is a small utility. Its worth comes from Capture, See and Teach
  around it.
- **Host churn.** MCP changed shape in 2026-07-28; `.mcpb` is giving way to remote servers and plugins; ChatGPT limits
  developer mode by plan. Keep the generated files as the floor that works everywhere.
- **Non-technical people's tools are mostly in the cloud.** Without the remote connector, the founder and brand lead get
  only Copy for any AI. Remote means a hosted service, accounts and a security surface.
- **Taste models disappoint.** About 60% agreement on close calls is the current state of the art. Show the agreement
  number honestly, and use the judge to rank and flag, never to decide.
- **Licences.** Fonts and captured references travel with the package. Ship only OFL font files, keep a licence field
  on every asset, and keep captures of other products out of training.
- **The docs move with it.** `docs/BRIEF.md`, `AGENTS.md` (the app regions) and `docs/PRODUCT_UI.md` describe the
  current product. A new brief should follow the owner's picks, not come before them.

## 11. Decisions for the owner

These are on the review page. Each recommendation comes first and is drawn as the default.

| Id | Decision | Options (recommendation first) |
|---|---|---|
| d1 | The one-sentence position | **A.** "Keeps what your product looks like and why, gives it to every tool, shows what they did." · B. "A design system tool that writes to your repo" (today's brief) · C. "Your brand's model" (lead with the model) |
| d2 | Projects | **A.** Become Connections (a real folder, repo, design file or chat app) · B. Keep Area-drawn projects beside connections · C. Keep as they are |
| d3 | Area's own chat | **A.** "Ask about your system" only: system changes, explanations, Setup · B. Keep coding in the project's folder too · C. Remove chat |
| d4 | Page editor and Flows | **A.** Park (hidden, code kept) · B. Keep as a light "sketch" tool · C. Remove |
| d5 | Files, editor, terminal | **A.** Park · B. Keep behind the setting as now |
| d6 | GitHub inside Area | **A.** One action, Send to project (files, plus a pull request on request) · B. Keep save / review / publish |
| d7 | First import source | **A.** A website URL · B. A repo · C. A Figma file · D. A brand PDF / images |
| d8 | First tools supported | **A.** Claude Code, Cursor, VS Code, Codex · B. Add Claude Desktop and ChatGPT first (needs remote) · C. Figma first |
| d9 | Window sizes | **A.** Full window + companion panel + quick find · B. Full window + quick find · C. Full window only |
| d10 | Local or remote | **A.** Local first; remote connector opt-in for chat apps and teams · B. Local only · C. Remote first |
| d11 | Brand in a system | **A.** A Brand section in every system (logo, colors, type, imagery, voice, rules) · B. A separate Brand place beside Systems |
| d12 | Taste logging | **A.** Always log picks; training use off by default, per item · B. Log only when the person turns it on |
| d13 | The model | **A.** Stages 0–1 now, adapters after ~500 picks, no model promised yet · B. Build a local adapter flow early · C. Skip the model |
| d14 | Settings layout | **A.** Basics (~8) + More (the rest), no option cut · B. As now |
| d15 | Component priority | **A.** Finish the core 24 to Complete first · B. Keep reviewing all families in order |
| d16 | Next brief | **A.** Rewrite `docs/BRIEF.md` from the picks, then `AGENTS.md`'s regions · B. Append to the current brief |

## Review page

**https://claude.ai/artifact/Mg1SuWG1grk11GcZaeUbgU** (source [review.html](review.html)). Picks are in the page's
`verdicts` collection (`verdicts/<id>` = `{ pick, note, at }`). The collection is empty at publish, and each recommendation is
drawn as chosen.

## 12. The owner's picks (2026-11-23)

Read from the review page's `verdicts` on 2026-11-23. The owner took every recommendation (d1–d16 all **A**) and wrote
three notes. They are quoted here, with what each changes.

**d1, the position.** "not sure about separating things by system brand and taste. i feel like it should just be system,
and within that you can have all sorts of things like components, type styles, color ramp, brand guidelines, logos,
illustrations, visual assets, photography styles, etc, and each element can have its own documentation/agent/guidelines
or there can even be standalone documents/md files that guide decisions. dont mention taste specifically but all this is
context and data."

What changes:

- **One container: the system.** It holds **elements** of any kind: foundations (color ramp, type styles, spacing,
  shape, depth, motion, icons), components, patterns, logos, brand guidelines, illustrations, visual assets, photography
  styles, references, explorations.
- **Each element can carry its own guidance**: documentation, rules and agent instructions.
- **Documents are elements too.** A standalone Markdown document can guide decisions across elements.
- **"Taste" is dropped as a word and as a layer** in product copy and the brief. Picks, notes, edits and references are
  the history and context of the elements they're about. The pick log (§8.2) and the model stages (§8.3) stay, described
  as the system's context and data.

**d11, brand.** "users can specificy whether something belongs to product or brand specifically. perhaps there are more
categories?"

What changes:

- **Brand is not a separate section.** It is a **category** on elements.
- **Product** and **Brand** are built in, and the person can add others, such as Marketing, a campaign or Editorial.
- **A connection can be limited to categories.** For example, a slides tool can get Brand and Marketing only. This takes
  the place of §7.4's "scopes".

**d3, chat.** "there should be a chat layer in this tool that is more visual, does more work to understand and allows
you to pick more options visually, shows and represents things, and is more of a design/organizer/information
aggregator that takes all your input, changes, etc and packages them in an efficient way for the actual agent to
execute on."

What changes:

- **Chat is the visual design conversation that prepares work.** It asks with pictures (the question cards, options
  rendered in the system) and shows elements as they are. It collects the person's input, picks, references and changes.
- **It packages them into a brief for the connected agent to execute**: what to make or change, the elements and values
  to use, the decisions made, and what not to do.
- **The brief goes to the agent** through MCP, or is copied. The agent does the coding in the person's own tool, and
  Activity shows the result back.
- **Area's chat no longer edits code itself**; that part of d3 stands. It no longer only answers questions about the
  system either: it prepares and hands off work.

Everything else stands as recommended: Connections replace Projects; the page editor, Flows, Files, editor and terminal
are parked; GitHub is one Send to project action; import starts from a website URL; Claude Code, Cursor, VS Code and Codex
come first; all three window sizes; local first with remote opt-in; always log picks with training off by default; model
stages 0–1 now; settings as Basics and More; a core 24 components first; and the brief is rewritten.

## 13. The Library (2026-11-23, later)

After the picks the owner simplified the structure. Area is a file manager for visuals: folders hold elements,
elements hold variants, alternates and versions, and anything carries files. The Canvas is a header, then a tab row of
what is open, with no category filters. Every element kind has one card in three sizes.

- The sample page, the map from today's build, and decisions l1–l5: `library-sample.html`
  (https://claude.ai/artifact/75YX2etDXU7nLuDj3KQ8ES).
- Every element kind and its container: [elements.md](elements.md), with frames from the app in `library-app/`.
- In the app (uncommitted): Labs › Library and Labs › Elements.

[`docs/BRIEF.md`](../../BRIEF.md) now carries this. One Library replaces §5's four places, and step 0 builds it. l4: the
owner chose to park Area's own coding tools (agent writing code, terminal, GitHub actions). The build sequence in §9 above is the study as written, and the brief's
sequence supersedes it.
