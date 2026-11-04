# Type roles: when each size, ink and weight is used (read 2026-11-04)

Evidence for exact rules on which type size, ink tier and weight each role takes, and the vertical rhythm between
text, in an agent chat transcript and in a feed or settings page of cards and rows. Read from the installed app bundles,
read-only. Nothing here was driven live.

This extends the earlier work and doesn't repeat it: reply sizes, markdown rhythm, tool rows and question cards are in
`../chat-kit-2026-11-02/{cursor,claude-desktop,questions}.md`. The type ramp is in `../type-presentation-2026-11-01/`,
and the feed's own spacing is in `../feed-system-2026-10-31/`. Values marked **(derived)** are computed from tokens
that were read. Everything else is read directly.

**Sources**

- **Cursor 3.27.22** (build 2026-10-27), `/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/`:
  - **D-CSS**: `workbench.desktop.main.css` (plain CSS, IDE window).
  - **G-JS**: `workbench.glass.main.js`. Its StyleX atoms (`ui-*`, `glass-*`) are resolved from CSS strings inlined in
    the JS. Modules are cited as `"Name.js"` with their byte offset.
  - **Themes**: `extensions/theme-cursor/themes/*.json`.
- **Claude desktop 4.16336.0**: `Contents/Resources/ion-dist.asar`, `assets/v1/`, extracted to the scratchpad. The file
  hashes differ from the 2026-11-02 build.
  - **MAIN**: `c6a992d55-_JRfOmTh.css`, the CDS tokens and utilities.
  - **SET**: `shared-1-D1bGaTaN.js`, the settings page.
  - **FRAME**: `shared-frame-CJdE5Ria.js` (Field, Card, Counter).
  - **SB**: `shared-18-Cfqwgjc5.js` (sidebar).
  - **DF**: `shared-styles-C9nbzN1z.css` (frame tokens).
- **Usage counts** come from scripts over the bundles:
  - Cursor: every call to the StyleX `Text` component in G-JS (855 calls), read for its `size`, `weight` and `color`
    props.
  - Claude: every class-string literal in the 4,235 JS chunks (17,858 strings carry a type or ink utility).
  - Counts show which choice is the workhorse. They are not screen frequencies.

---

## 1. Cursor

### A. Ink tiers

| Token | Definition | Light (Cursor Light, `#141414` on `#FCFCFC`) | Dark (Cursor Dark, `#F0F0F0` on `#181818`) | Source |
|---|---|---|---|---|
| `--cursor-text-primary` | `var(--cursor-base)` (Agents) / `--vscode-editor-foreground` (IDE) | `#141414`, 18.0:1 | `#F0F0F0`, 15.6:1 | G-JS root `:root,.ui-1lzgia1` @15797079; D-CSS @1256003 |
| `--cursor-text-secondary` | base **74%** | `#505050` (derived), 7.9:1 | `#B8B8B8` (derived), 9.0:1 | same |
| `--cursor-text-tertiary` | base **60%** | `#717171` (derived), 4.8:1 | `#9A9A9A` (derived), 6.3:1 | same |
| `--cursor-text-quaternary` | base **36%** | `#A8A8A8` (derived), 2.3:1 | `#666666` (derived), 3.1:1 | same |
| High contrast | 100 / 84 / 72 / 60% | | | D-CSS `.hc-black,.hc-light` @1268568 |

One formula, alpha of the foreground, serves both modes; only the base colour changes. The theme files agree:

- Light `descriptionForeground` is `#141414BD` (74%) and `input.placeholderForeground` is `#1414145C` (36%).
- The dark placeholder is `#F0F0F099` (60%). That is lighter than the token's 36%, so dark placeholders sit a tier up.

**Usage counts**

| Tier | `Text color=` (G-JS) | `color:var(--…)` in D-CSS rules | `color:var(--…)` in G-JS atoms (refs) |
|---|---|---|---|
| primary | 131 | 83 | 49 |
| secondary | **239** | **85** | 51 |
| tertiary | **228** | 52 | **61** |
| quaternary | 13 | 4 | 13 |
| inherit (no colour) | 151 | — | — |

Secondary and tertiary together are the workhorses (467 of 855 `Text` calls). Quaternary is rare and reserved for
specific roles.

**Roles by tier** (read):

| Tier | Roles |
|---|---|
| primary | Settings row label, page title, card name (Kanban, Discover), active/hovered sidebar row and tab, chosen segment, the card header title with `tone="primary"` (`"TranscriptCardHeaderTitle.js"` @12643063), human/assistant prose |
| secondary | Settings row description, page description, section header title, sidebar row at rest (`--ui-sidebar-row-fg`), segmented control at rest, tool verb, card subtitle (Kanban), empty-state line (`"TrayEmpty.js"` @13512628), neutral badge (`"Badge.js"` @13241516), tray body |
| tertiary | Section header description, rules description and pattern, tab label at rest (`"TabSystem.stylex.js"` @14898213), tab's secondary label, muted sidebar row (`data-tone=muted`), tool detail, human sender label (`"AgentTranscriptHumanSenderLabel.js"` @13088449), end-of-turn summary (`"EndOfTurnSummary.js"` @12701660), line numbers, disabled pill (`"Pill.js"`) |
| quaternary | Input placeholder, disabled control (`--cursor-input-placeholder-foreground`, `--cursor-control-disabled-foreground`, root @15797079), pending todo, dimmed tool detail |

### B. Weights

**Tokens**

- `--cursor-font-weight-normal` 400, `-medium` 500, `-semibold` 600 and `-bold` 700 (G-JS @15842623).
- The CSS fallback `590` appears in 6 + 4 D-CSS rules. One is the IDE questionnaire's question label (`questions.md`).
- `Text` exposes `weight: regular | medium | semibold | bold` and defaults to regular (`"text.stylex.js"` @9922708).

| Weight | `Text` calls | Roles (read) |
|---|---|---|
| regular 400 (default) | 727 incl. unset | Everything that isn't a name: labels, descriptions, rows, tabs, settings section titles, card names in the agent board (`"KanbanCard.js"` @12418073), plugin rows (`"MarketplacePluginRow.js"` @14343113) |
| medium 500 | 128 | Page title (Settings 17/21), primary card header title, Discover card name (`"DiscoverCard.js"` @19386052), the transcript question text (`"AgentTranscriptAskQuestionCard.js"` @13001613: medium **but secondary ink**), counts on badges (10/500 notification badge, D-CSS @1080460) |
| semibold 600 / 590 | 21 | Markdown headings, the IDE question label (590), tab decoration badge (10 / 600) |
| bold 700 | 1 | Key letters on the IDE question card (10 / bold) |

**Weight × ink** (`Text` calls; unset weight counted as regular)

| | primary | secondary | tertiary | quaternary | inherit |
|---|---|---|---|---|---|
| regular | 81 | 211 | 221 | 13 | 93 |
| medium | **44** | 23 | 6 | **0** | 47 |
| semibold | 4 | 4 | 1 | 0 | 11 |

- A weight above regular pairs with primary or inherited ink in 107 of 150 calls. Medium with tertiary happens 6
  times, and medium with quaternary never.
- The card header title couples them in code: `tone==="primary" ? "medium" : "regular"`
  (`"TranscriptCardHeaderTitle.js"`). The weight rises only when the ink is primary.

**Small, heavy and muted at once is avoided.** At 11 (`xs`) the combination medium + tertiary appears 3 times, and
quaternary never takes a heavy weight. At 12 (`sm`) medium + tertiary appears 3 times, against 15 primary and 19
secondary.

### C. Sizes by role (outside markdown)

**The scale** (`"typography.stylex.js"` @4538396, reached through `Text size=`):

| Step | Size / line |
|---|---|
| xs | 11/14 |
| sm | 12/16 |
| md | 13/18 |
| lg | 14/22 (15/24 in the Agents window) |
| xl | 17/21 |
| 2xl | 20/22 |
| 3xl | 22/26 |

**Usage**

- `Text size=`: sm **384**, md 217, xs 110, lg 53, xl / 2xl / 3xl 17.
- D-CSS literals: 12px **269**, 13px 92, 11px 75, 14px 65.

**Size × ink** (`Text`):

| Size | Mostly |
|---|---|
| sm (12) | secondary 142, tertiary 108, primary 25 |
| xs (11) | tertiary 51, secondary 23 |
| md (13) | primary, secondary and tertiary evenly (56, 56, 63) |
| lg and up | primary |

**Sizes by role**

| Role | Size / line | Weight | Ink | Source |
|---|---|---|---|---|
| Settings page title | 17/21 | 500 | primary | D-CSS `.cursor-settings-tab-title` @1085430; G-JS `"settingsTabContainer.react.js"` @29007416 (`glass-19d36u7` 17px, `glass-1yl5bsf` 500) |
| Settings page description | 13/18 | 400 | secondary | `.cursor-settings-tab-description` @1085660 |
| Settings section title | **12/16** | 400 | **secondary** | `.cursor-settings-section-header-title` @1086502; glass `"section.js"` @15508206 (`ui-1wm8ruf`, `ui-19aaqeu`, `ui-vxqr21`) |
| Settings section description | 12/16 | 400 | tertiary | `-section-header-description` @1086762; `"section.js"` `ui-4b2ntj` |
| Settings row label | 13/18 | 400 | primary | `.cursor-settings-cell-label` @1088037; `"Fieldset.js"` @15219537 (`ui-11wthnw`, `ui-1wd3ewq`) |
| Settings row description | **13/18** (same as label) | 400 | secondary | `.cursor-settings-cell-description` @1088592 |
| List row (rules) title / description / pattern | 13/18 primary · 12/16 tertiary (2-line clamp) · 11/14 tertiary | 400 | | D-CSS `.cursor-settings-rules-cell-*` @1090076–1090671 |
| Sub-section trailing caption | 12/14 | 400 | tertiary | `-sub-section-trailing-caption` @1087392 |
| Settings sidebar row | 12/16 | 400 | secondary | `.cursor-settings-sidebar-cell` @1079490 |
| App sidebar row | 13/18 (`--ui-sidebar-row-font-size`) | 400 | secondary → primary active/hover; tertiary muted | `"Sidebar.stylex.js"` @12452694 |
| App sidebar group label | 12/16, min-height 30 | 400 | inherited (not resolved) | same (`ui-mx7h43`, `ui-1e2fo0g`) |
| Sidebar subline | 10 / 1.25 | 400 | tertiary at .6 opacity | same |
| Tab label | 13/18 | inherit (400) | tertiary → primary on hover/active | `"TabSystem.stylex.js"` |
| Card name (agent board) | 13/18 | 400 | primary; subtitle 12/16 secondary; meta 11/14 tertiary | `"KanbanCard.js"` |
| Card name (Discover) | 13/18 | **500** | primary; description 12/16 secondary | `"DiscoverCard.js"` |
| Plugin row name / description | 13/18 / 13/18 | 400 / 400 | primary / secondary | `"MarketplacePluginRow.js"` |
| Badge | 12/16, padding 2 × 4 (md) | inherit | secondary on bg-tertiary (neutral) | `"Badge.js"` |
| Pill / chip | 12 (sm, height 20) or 13 (md, 24) | inherit | secondary → primary hover / selected | `"Pill.js"` |
| Notification count | 10, 14 × 14 | 500 | editor background on warning fill | D-CSS @1080460 |
| Keybinding key | 11, padding 3, radius 3 | inherit | keybinding fg | D-CSS `.monaco-keybinding-key` |
| Empty state (in a list or tray) | 12 or 13, one line, **no title** | 400 | secondary (7 + 4 cases) or tertiary (7) | `Text` before `"No …"` strings; `"TrayEmpty.js"` 13 / line 22 / secondary |
| Transcript card header title | 13/18 (`size:"md"`, line 20) | 500 if primary, else 400 | secondary by default | `"TranscriptCardHeaderTitle.js"` |
| Transcript card rows | 13/18 | 400 | secondary | `"TranscriptCardRows.js"` |
| Human sender label | 12/16 | 400 | tertiary | `"AgentTranscriptHumanSenderLabel.js"` |
| Question in a transcript card | conversation size (14 or 15) | 500 | **secondary**; the answer primary | `"AgentTranscriptAskQuestionCard.js"` |

### D. Vertical rhythm (box edge to box edge)

| Pair | Value | Source |
|---|---|---|
| Settings page title → description | **4** | `.cursor-settings-tab-header{gap:4px}`; glass header `gap: spacing-1` |
| Page header → first section | **20** | `.cursor-settings-tab{gap:20px}`; glass `gap: spacing-5` |
| Section → section | **28** | `.cursor-settings-tab-content{gap:28px}`; glass `spacing-7` |
| Section title → section description | **2** | `.cursor-settings-section-header{gap:2px}`; `"section.js"` `ui-137clkk` (spacing-0-5) |
| Section header → its list (frame) | **8** | `.cursor-settings-section{gap:8px}`; `"section.js"` `ui-ehausa` |
| Frame → first label (cell inset) | 12 (cell padding 12 × 14; glass 12 all round) | `.cursor-settings-cell` @1087518; `"Fieldset.js"` `ui-15wvsb0` |
| Row label → row description | **1** | `.cursor-settings-cell-leading-items{gap:1px}`; `"Fieldset.js"` `ui-5cdhqx` |
| Row → row (text to text) | **24** = 12 + 12; the divider is an absolute 1px line inset 12 that adds no height | `.cursor-settings-cell-divider`; `"Fieldset.js"` `ntl.inset` |
| Sub-sections apart | 12 (`section-list`), 8 inside a sub-section | @1087025, @1087200 |
| Label column ↔ control | 20 (12 when stacked) | `.cursor-settings-cell{gap:20px}`; `"Fieldset.js"` `ui-1qqbgdy` / `ui-1c4yd7b` |
| Page padding | 48 top and bottom; the glass column is capped at 680 (42.5rem) | `.cursor-settings-tab{padding:48px 0}`; glass `glass-1443d3o` |
| Sidebar rows apart / groups apart | 1 / 12 | `"Sidebar.stylex.js"` (`row-stack-gap` 0.25, `group-gap` spacing-3) |
| Card (agent board) name → subtitle | 4 (padding 10 × 12) | `"KanbanCard.js"` |
| Plugin row name → description | 4 (padding 12 × 16) | `"MarketplacePluginRow.js"` |
| Chat: transcript rows, paragraph → embedded card, tool steps, card head/body | 14 · 12 · 6 · header pad 8, content gap 6 | `../chat-kit-2026-11-02/cursor.md` § 2, § 4 |
| Chat: question card content | padding 12 / 12 / 10, gap 12 | `"AgentTranscriptAskQuestionCard.js"` |
| Chat: human sender label → bubble | margin-top 2; margin-bottom `(font − line)/2 + 4` = **0** at 14/22 (derived), so the label's line box touches the bubble's | `"AgentTranscriptHumanSenderLabel.js"` |

The rhythm runs 1 → 2 → 4 → 8 → 12 → 20 → 28 → 48. Text inside a unit is 1–4 apart (label → description 1, title →
description 2–4), a header sits 8 from its frame, rows are 24 apart at text, and sections are 28 apart.

---

## 2. Claude desktop (CDS)

### A. Ink tiers

| Token | Light (shipping) | Dark (shipping) | Light, "fizzy-lake color" (flagged) | Dark, flagged | Source |
|---|---|---|---|---|---|
| `--cds-text-primary` | neutral-900 `#0b0b0b`, 19.2:1 on `#fcfcfb` | gray-50 `#f0efec`, 15.9:1 on `#151515` | `#000000e6` (90%) | `#ffffffed` (93%) | MAIN `.cds-root` @1579474, dark @1600468; flagged @1710117 / @1714660 |
| `--cds-text-secondary` | neutral-600 `#52514e`, 7.7:1 | gray-200 `#c3c2b7`, 10.2:1 | `#0009` (60%), 5.7:1 (derived) | `#ffffff91` (57%), 6.5:1 (derived) | same |
| `--cds-text-muted` | neutral-400 `#898781`, **3.5:1** | gray-400 `#898781`, 5.1:1 | `#0007` (47%), 3.6:1 (derived) | `#fff6` (40%), 3.9:1 (derived) | same |
| `--cds-text-disabled` | alpha-4 (35%) | alpha-4 | — | — | MAIN @1579474 |
| `--cds-text-stays-secondary` | `initial`, so its users fall back to **muted** | `initial` | `#0009` (= secondary) | `#ffffff91` | same |
| prefers-contrast: more (flagged) | | | 100 / 75 / 60% | 100 / 75 / 57% | MAIN @1727384 |

**`text-muted-as-secondary` is a migration token.**

- It is `color: var(--muted-as-secondary, var(--cds-text-muted))` (MAIN @449035), so it draws muted today.
- Under the flagged colour refresh it becomes secondary: `--muted-as-secondary: var(--cds-fizzy-lake-color-secondary,
  var(--cds-text-secondary))` (MAIN @1759744).
- 4,839 class strings use it, against 377 that use plain `text-muted`. The planned design keeps muted only for a few
  roles and moves most quiet text up to secondary.

**Usage counts** (class strings)

| Tier | Count |
|---|---|
| `text-secondary` | **5,299** |
| `text-muted-as-secondary` | **4,839** |
| `text-primary` | 3,864 |
| `text-muted` | 377 |
| `text-disabled` | 22 |

**Most common pairs**

| Pair | Count |
|---|---|
| `text-body text-secondary` | **1,207** |
| `text-footnote text-muted-as-secondary` | 1,074 |
| `text-footnote text-secondary` | 970 |
| `text-body text-primary` | 662 |
| `text-caption text-muted-as-secondary` | 637 |
| `text-body text-muted-as-secondary` | 476 |

**Roles by tier** (read):

| Tier | Roles |
|---|---|
| primary | Settings page and group titles, settings row label, Field label, prose, card and preview-card text (`PreviewCard`: `text-body font-normal text-primary`) |
| secondary | Settings group description and page intro, tool-row detail, the label of a busy tool row, Counter text, footnotes, most empty states (`text-body text-secondary`, 25 + 6 cases) |
| muted (or muted-as-secondary) | Settings row description, Field hint (`text-stays-secondary` → muted, FRAME `Om`), sidebar group label (`text-muted`, SB @171871), sidebar row description, the label of a finished tool row, elapsed time, the save bar's leading note, empty states in lists (22 + 17 + 12 cases) |
| disabled | Dimmed table rows, disabled buttons (`DataTable tr[data-dimmed]` maps secondary and muted to disabled) |

### B. Weights

**Tokens** (MAIN @1579474):

| Token | Value |
|---|---|
| `--cds-font-weight-regular` | 400 |
| `--cds-font-weight-medium` | 500 |
| `--cds-font-weight-semibold` | **580** |
| `--cds-font-weight-bold` | 600 |

**Weights are roles, not free values:**

- `font-normal` → `--cds-font-weight-body`
- `font-medium` / `text-*-medium` → `--cds-font-weight-control` (controls, buttons, labels)
- `font-semibold` / `text-*-semibold` → `--cds-font-weight-header`
- `font-badge`

The role tokens are `initial` today, so they fall back to 400 / 500 / 580. Under the flagged "fizzy-lake type" they
become body **400**, control **435**, header **520** and badge **540** (MAIN @1815328). That puts headings and controls
nearer to body weight.

| Weight (role) | Roles (read) | Count |
|---|---|---|
| regular (body) | Prose, rows, descriptions, settings row label and description, sidebar group label (`font-normal font-header`, 520 when flagged) | `font-normal` 391 + `text-*-regular` 557 |
| medium (control) | Field label (`text-body font-medium leading-none text-primary`, FRAME @401639), buttons, Counter (`text-caption font-medium`, FRAME @298271), names in lists | `font-medium` **1,572** + `text-*-medium` 397 |
| semibold (header) | Settings page title (`text-title-semibold`, SET @219060), settings group title (`text-heading-semibold`, SET @215120), markdown headings | `font-semibold` 406 + `text-*-semibold` 343 |
| bold | Rare | 84 + 6 |

**Weight × ink** (class strings with both)

| | primary | secondary | muted (both) | inherit |
|---|---|---|---|---|
| regular | 121 | 257 | 261 | 151 |
| medium | **1,016** | 187 | 77 | 190 |
| semibold | **423** | 23 | **7** | 117 |
| bold | 23 | 5 | 2 | 3 |

- Semibold is primary in 423 of 453 strings that set an ink, and muted in 7. Medium is primary in 1,016 of 1,280.
- Regular carries most secondary and muted text (518 of 777).
- The exception is caption + medium + muted (33 strings: counters, small labels).
- Caption + semibold + muted never occurs (0).

### C. Sizes by role (outside markdown)

**The scale**: compact is the Code tab's density (`claude-desktop.md`). Comfortable is `[data-density=comfortable]`,
MAIN @1617727.

| Token | Compact | Comfortable | Count (`text-x` + `text-x-*`) |
|---|---|---|---|
| `text-caption` | 11/17 | 12/17 | 1,663 + 218 |
| `text-footnote` | 12/15 (16 with the system font) | 13/17 | **3,484** + 31 |
| `text-body` | 13/19 | 14/20 | **4,024** + 647 |
| `text-heading` | 14/18 | 15/20 | 194 + 295 |
| `text-title` | 20/25 | 22/28 | 228 + 86 |
| `text-code` | 12/17 | 13/19 | 169 |

The message text-size setting swaps only `body` and `heading`: sm 13/19, md 14/20, lg 15/22 (MAIN @1646659).

**Size × ink**

| Size | Ink |
|---|---|
| caption | secondary 442 / muted 947 / primary 65 |
| footnote | secondary 1,167 / muted 1,389 / primary 160 |
| body | primary 1,620 / secondary 1,421 / muted 589 |
| heading | primary 276 / everything else 47 |
| title | primary 210 / everything else 6 |

The smaller the size, the quieter the ink. Heading and title are effectively always primary.

**Sizes by role**

| Role | Size | Weight | Ink | Source |
|---|---|---|---|---|
| Settings page title | title 20/25 | semibold 580 | primary | SET @219060 (`HI`) |
| Page intro | footnote 12/15 | 400 | secondary | SET `mb-8 mt-1 text-footnote text-secondary` |
| Settings group title | heading 14/18 | semibold 580 | primary | SET @215120 (`h3[data-settings-group-title]`) |
| Settings group description | footnote 12/15 | 400 | secondary | SET (`data-settings-group-desc`) |
| Settings row label | **body 13/19** | 400 | primary | SET `jI` @~212000 (`text-body text-primary`) |
| Settings row description | **body 13/19** (same as label) | 400 | muted-as-secondary | SET @212620 |
| Form field label / hint | body 13 at `leading-none` / footnote 12 at `leading-snug` | 500 / 400 | primary / muted | FRAME `Field` @401639 |
| Sidebar row / description | 13 (`--df-row-font`; 14 comfortable), row 26 tall (32) | 400 | not resolved / muted-as-secondary | DF `.dframe-root` @28093, @72915; SB |
| Sidebar group label | 12 (`--df-group-font`; 13 comfortable) / 16 | 400 (header 520 flagged) | muted | SB @171871 |
| Counter | caption 11 in an 18 pill (`h-control-nested`) | 500 | secondary on bg-neutral | FRAME @298271 |
| Kbd | caption 11 | inherit | inherit | `cbd6db52c-CNwL7yiy.js` |
| Page header bar | body, min-height 48 | 400 | — | `cf35aed38-tqXPCmE_.js` (PageHeader) |
| Card body | padding `pad-lg` 12 (16 comfortable), gap inherited | — | — | FRAME @135186 |
| Empty state | one line of body or footnote, often centred with `py-6` / `mt-10`; **no title** | 400 | secondary or muted | class strings before "No …" copy |
| Tool / status row (chat) | body 13/19 (prose 14/20 at Medium) | 400 | muted when done, secondary when busy; detail secondary | `claude-desktop.md` § 1 |

### D. Vertical rhythm (box edge to box edge; compact, with comfortable in brackets)

| Pair | Value | Source |
|---|---|---|
| Page title → intro | **4** (`mt-1`) | SET `WI` |
| Title or intro → first section | **32** (`mb-8`) | SET `UI` / intro `mb-8` |
| Group title → group description | **4** (`gap-1`) | SET `II` |
| Group header → rows | **12** [16] (`mb-md` = `--cds-gap-md`) | SET `II` |
| Rows' own padding | 8 [12] above and below (`py-md`), 1px `alpha-1` rule between (`divide-y divide-alpha-1`) | SET `PI` / `FI` |
| Group header → first row text | **20** [28] (derived) | 12 + 8 |
| Row label → row description | **4** (`gap-1`) | SET `jI` |
| Row → row (text to text) | **17** [25] (derived: 8 + 1 + 8) | SET |
| Label column ↔ control | 20 [28] (`gap-lg`); stacked below 52rem: 8 [12] | SET `AI` |
| Section → section | **32** [40] (`mb-xl`); a titled section after another: 32 + 1px rule + 32 (`pt-8`, `mb-8`) | SET `II`, `VI` |
| Form label → hint | 6 [8] (`gap-xs`) | FRAME `Field` |
| Sidebar group label top padding | 12 [16; desktop comfortable 14], 4 below | DF; SB |
| Chat: blocks in a reply / rows of a turn / after a reply | ½ line (10) / ¾ line (15) / 50 | `claude-desktop.md` § 1 |
| Chat: code or card in a reply | item gap + 4 bump above and below (14) | `claude-desktop.md` § 1 |
| Chat: expanded steps card | 6 above, 4 below; cells 8 × 6; rows 24 tall | `claude-desktop.md` § 1 (TurnStatus) |

The rhythm runs 4 → 8 → 12 → 20 → 32, one density step up at comfortable. Text inside a unit is 4 apart, with label →
description equal to title → description. A header sits 12 from its rows. Sections are 32 apart, or 64 when a rule
separates them.

---

## 3. Side by side

| Question | Cursor | Claude desktop |
|---|---|---|
| Working ink tiers | 4 (primary, 74, 60, 36%); secondary and tertiary carry most text | 3 (primary, secondary, muted); the flagged refresh moves most muted text to secondary, leaving about 2 working tiers |
| Quietest readable tier | tertiary 4.8:1 light | muted 3.5:1 light (the reason, inferred, for moving it to secondary) |
| Placeholder / disabled | quaternary 36% (2.3:1) | disabled = alpha-4 (35%) |
| Settings row label vs description | same size (13/18), primary vs secondary, 1 apart | same size (13/19), primary vs muted, 4 apart |
| Settings section title | **smaller (12) and secondary, regular**: the header is quieter than the rows | **larger (14) and semibold, primary**: the header is louder than the rows |
| Page title | 17/21, 500 | 20/25, 580 |
| Names (cards, rows) | 13, regular or medium | body 13, medium (`font-medium text-body text-primary` 314 + `text-body-medium` 191) |
| Weight scale | 400 / 500 / 600 (590) / 700 | 400 / 500 / 580 / 600; flagged 400 / 435 / 520 / 540 |
| Tool rows vs prose | same size as prose, lighter ink | one step smaller than prose (13 vs 14), lighter ink |
| Empty states inside lists | one line, no title, secondary or tertiary | one line, no title, secondary or muted |

---

## Rules the evidence supports

1. **Inside a unit, vary ink, not size.** A label and its description, or a name and its detail, share one size, and
   the description drops one ink tier. *Cursor* settings rows (13/18 primary over 13/18 secondary) and plugin rows.
   *Claude* settings rows (body primary over body muted-as-secondary). The exception is a card, which may also drop one
   size step (Cursor's agent-board and Discover cards: 13 primary over 12 secondary). It never drops two.
2. **Weight rises only with primary ink.** Medium or semibold text is primary (or inherits it). *Cursor*: 107 of 150
   heavier calls are primary or inherit, medium + quaternary 0, and code couples `tone primary → medium`. *Claude*:
   semibold is primary 423 to 30, medium 1,016 to 264.
3. **Never small, heavy and quiet at once.** At caption or footnote size, a medium or semibold weight is rare with the
   quietest tier. *Cursor*: xs/sm + medium + tertiary 6, + quaternary 0. *Claude*: caption + semibold + muted 0;
   caption + medium + muted 33 (counters only).
4. **The smaller the size, the quieter the ink; headings and titles are always primary.** *Cursor*: of sm and xs calls
   that set a grey ink, about 90% are secondary or quieter, and lg and up are primary. *Claude*: caption and footnote
   are about 95% secondary or muted, heading 85% primary and title 97% primary.
5. **Weight is a role, not a value.** Use regular for body, medium for controls, labels and names, and semibold for
   headings, with no other weights. *Claude* role tokens (body / control / header / badge). *Cursor* `Text weight`
   regular / medium / semibold, with bold appearing once.
6. **Two to three working ink tiers; the fourth is for placeholders and disabled.** *Cursor*: quaternary appears in 13
   of 855 calls, all placeholder, disabled, pending or dimmed. *Claude*: disabled is alpha-4 and used 22 times, and the
   refresh folds muted into secondary.
7. **Section headers in a settings or feed page take one of two forms, applied the same way everywhere:**
   - quieter than the rows: smaller, secondary, regular (*Cursor*: 12/16 secondary over 13/18 rows);
   - or louder: one step larger and semibold, primary (*Claude*: heading 14 semibold over body 13 rows).

   Neither product mixes the two, and in both the header changes at most two properties (size + ink, or size + weight).
8. **Empty states inside a section are one line of body or footnote text in secondary or muted ink, with no title.**
   *Cursor* `TrayEmpty` and its "No …" strings. *Claude* "No …" strings (25 body-secondary, 22 body-muted, 17
   footnote-muted).
9. **Joined text sits 1–4 apart; a header sits 8–12 from its rows; sections are 28–32 apart.** *Cursor*: 1 / 2 / 4 · 8 ·
   28. *Claude*: 4 / 4 · 12 · 32. Within each product the jumps are about ×2–3 per level.
10. **Rows in a framed list are padded, not gapped: the divider adds no space.** Row-to-row distance is twice the row
    padding (Cursor 24, Claude 17 compact), and the rule is a 1px line in the lowest stroke or alpha tier. Both products.
11. **Status and tool lines are quieter than prose by ink, and sometimes by one size step, never by weight.** *Cursor*
    tool verb secondary and detail tertiary at prose size. *Claude* done label muted and detail secondary at body 13
    against prose 14. Both are regular.
12. **A page title is the only text above 15 in a settings or feed page, and it takes medium or semibold.** *Cursor*
    17/21 500. *Claude* 20/25 580. The descriptions under it are body or footnote, secondary, 4 apart.

## Not found

- Message timestamps in either transcript: neither bundle has a dedicated timestamp style.
  - Cursor's nearest is the human sender label: 12/16 tertiary.
  - Claude's nearest is elapsed time on status rows: muted, tabular.
- Table header and cell type outside markdown: Claude's `DataTable` sets only dimming. Markdown tables are covered in
  `claude-desktop.md` and `cursor.md`.
- The ink of Cursor's app-sidebar group label and Claude's sidebar row (both inherited, not resolved).
- Card description type on Claude feed cards beyond `PreviewCard` (body primary); there is no separate card-description
  token.
- Whether Claude's flagged "fizzy-lake" colour and type refresh is switched on in this build (only the CSS was read).
