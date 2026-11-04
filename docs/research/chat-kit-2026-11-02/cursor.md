# Cursor's agent chat: narrow IDE pane vs wide Agents window

Cursor 3.27.22, read from the app bundle 2026-11-02, read-only. Extends
`../inspector-chat-2026-10-18/cursor.md` (3.24.12; tokens, bubble, composer, todo basics) and the chart values in
`../data-views-2026-11-01/README.md`; values already there are not repeated unless they changed or matter for width.

Sources, relative to `/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/`:

- **D-CSS** `workbench.desktop.main.css`, **D-JS** `workbench.desktop.main.js` (IDE window; its agent pane is the
  "Editor Agent").
- **G-CSS** `workbench.glass.main.css`, **G-JS** `workbench.glass.main.js` (Agents window; `body[data-cursor-glass-mode=true]`,
  the "Glass Agent"; chat root `[data-component=agent-conversation-composer]`).
- Both windows render the transcript with the same React/StyleX modules (named below as `"Module.js"`); atoms
  (`ui-xxxx`) are resolved from the CSS strings inlined in the JS. Only the Agents window adds glass-mode overrides
  and its own layout constants (`"agent-panel-constants.js"`, G-JS).

## The short answer

| Question | Finding |
|---|---|
| Does one markdown component serve both widths? | Yes. `"Markdown.stylex.js"` (base + `sizeSm`) renders assistant prose in both windows; nothing in it queries container width. |
| What changes between the windows? | Type token and insets, not rules: glass sets `--cursor-font-size-lg:15px; --cursor-line-height-lg:24px; --cursor-letter-spacing-lg:-0.24px` (G-CSS `body[data-cursor-glass-mode=true]`), so chat prose and tool rows go 14/22 → 15/24; text inset 11 → 0 with a 13 row margin; column cap 840 → 796; tool-call density default `detailed` → `compact-all-grouped`. |
| What changes with container width inside one window? | Little: the column centres at its cap; tables and code scroll sideways; the human bubble's max width is `100cqi − 82`; a few chrome container queries (mode label ≤250, card rows wrap ≤280, tray banners stack ≤480, project-lane human inset). No markdown size, gap or heading rule changes with width. |
| em or px? | Mixed: heading sizes, list indent, inline code, image/chip spacing are **em**; block gaps, cell and card padding, radii, code type are **px tokens**; h1–h3 top margin is computed from the font size (`font × 22/15`). |

## 1. Conversation column

| Slot | IDE pane (Editor Agent) | Agents window (Glass) | Source |
|---|---|---|---|
| Max width | `var(--composer-max-width)` = setting `cursor.chatMaxWidth`, default **840** (set on `.monaco-workbench`) | **796** = default 780 (`bUn`) + 2 × 8 scrollbar gutter (`gTc`), unless the user sets `cursor.chatMaxWidth` | D-JS config `[rZe]:{type:"number",default:840}`; G-JS `"agent-panel-constants.js"` `Cqi=16,fTc=12,gTc=8,bUn=780,vTc=82,ho_=960,_Tc=560`; `"glass-chat-max-width.js"` `po_()` |
| Wide variant | — | 976 (`ho_ 960 + 2×16 − 2×8`) for project harness / main-bot views | G-JS `"use-glass-chat-max-width.react.js"` `mIc()` |
| Centred? | Yes: `max-width:an; width:min(100% + reserved, an); margin-inline:max((100% − an)/2, reserved/−2)` | Same code | D-JS / G-JS transcript content shell style (`conversationMaxWidth:"var(--composer-max-width, 640px)"`) |
| Side padding | `padding-inline: var(--composer-messages-padding-inline, 16px)` → **16** (never set in the IDE) | **16** (`contentPaddingPx: Cqi`); preview surfaces 12 (`fTc`) | same; G-JS `kCT()` sets `--composer-messages-padding-inline` |
| Prose inset inside the column | `--conversation-text-inset: 11px` (classic) → prose starts 27 from the pane edge | `--conversation-text-inset: 0` + non-human rows `margin-inline: calc(radius-xl + 1px)` = **13** → prose starts 29 from the column edge | D-CSS `.composer-messages-container{--conversation-classic-text-inset:11px…}`; G-CSS `…[data-component=agent-conversation-composer] .virtualized-composer-messages-row-body:not([data-human-row],…){margin-inline:var(--conversation-glass-corner-rule)}` |
| Text measure at the cap | 840 − 32 − 22 = **786** | 796 − 32 − 26 = **738** | derived |
| Tool cards vs prose | Cards outdent by the text inset (`--ui-tool-call-card-outdent: calc(-1 × inset)`), so the card edge sits at 16 and card text (1 border + 10 padding) lines up with prose at 27 | Outdent 0; card edge sits with the prose at 13. `--conversation-glass-block-inset: -10px` is declared but only consumed as `padding-inline` (`.composer-tool-call-block-wrapper`), where a negative value is invalid | `"AgentTranscriptRow.js"` `toolRowCardOutdent`; D-CSS 4546 |
| Row gap | 14 (`--react-composer-transcript-row-gap`) | 14 | D-JS `Hwu=14`; G-JS `$7a=14` |
| Human bubble width | Full-width card (`.composer-human-message:not(.standalone-glass){width:100%}`) unless the project layout is on | Hugs right; `--conversation-bubble-max-width: calc(100% − 82px)` (sticky) or `calc(100cqi − 82px)`; project-parent transcripts cap messages at `min(560px, …)` | D-CSS 4984; G-JS `"agent-conversation-composer-layout.js"` `IOc`, `nL_`, `CCT()` |
| Project lane human inset | `max(32px, clamp(0px, (100% − 480px) × 0.4, 20%))` when `[data-project-send-message-layout]` | same | D-CSS `.composer-messages-container[data-project-send-message-layout]` |

## 2. Markdown in chat (`"Markdown.stylex.js"`, D-JS; identical in G-JS)

Conversation scale (D-CSS / G-CSS `.composer-bar,.composer-messages-container{…}`): text = `--cursor-font-size-lg`,
line = `--cursor-line-height-lg`, block gap 16, list before 8 / after 18 / item 8, heading after 4, embedded block
before 12, tool card padding 10 × 8, gap 6, surface radius 12.

| Element | Default (assistant prose) | `sizeSm` | Source object |
|---|---|---|---|
| Root | `font-size: var(--conversation-font-size, 14px)`, `line-height: var(--conversation-line-height)` → **14/22 IDE, 15/24 Agents**; colour text-primary; icon size = font size | 13/18 (`font-size-base`/`line-height-base`), tracking −0.08px | `lOs.base`, `lOs.sizeSm` |
| Paragraph | margin-block `--conversation-block-gap` = **16** (fallback 10); 0 at first/last; next is a list → bottom = list-before 8; next is embedded → 12; in list items 0 | same rules | `XRn.base`, `XRn.contentAware` |
| Headings | weight semibold, line-height **1.42**; h1 **1.466em**, h2 **1.333em**, h3 **1.133em**, h4 1em, h5 .866em secondary, h6 .8em secondary; h1–h3 top `calc(font × 22/15)` (20.5 at 14, 22 at 15), h4–h6 top 12; bottom 4; a following paragraph gets the 4 heading-after gap | top margin 8 | `lTe.level1–6`, `lTe.base`, `lTe.sizeSm` |
| Section label (bold line used as a heading) | top `font × 22/15`, bottom 10 | — | `XRn.sectionLabel` |
| Lists | `padding-left: 2em`; flex column, item gap 8; before 8, after 18; disc → circle → square; ordered decimal (wide gutter per number width); nested `p + *` 4 | same | `gLe`, `uOs` |
| Task item | marker absolute, 1lh tall; text inset 14 + 8 = 22 | — | `uOs.task`, `dOs` |
| Table wrapper | 1px `--card-border-color` (stroke-secondary), radius 12, margin 12 above (embedded gap) / 12 below; **horizontal ScrollArea, scrollbar on hover** | — | `Veu.root`; render `function Wdv` (`S0 {direction:"horizontal", scrollbarVisibility:"hover"}`) |
| Table | `border-collapse: separate`, `width: max-content; min-width: 100%`; font inherits prose (14 or 15) | — | `qeu.root` |
| Cells | padding **6 × 10**, top-aligned, left-aligned; 1px bottom rule, last row none; column rules drawn as a 1px right background line, none on the last cell | — | `fOs.base`, `zeu.root` |
| Header | semibold, nowrap, **no fill** (thead transparent) | — | `fOs.header`, `Keu.root` |
| Prose cells | `min-width: max(6ch, 100%)`, `max-width: var(--markdown-table-prose-cell-inline-size)`: 28ch default, then `clamp(15ch, round(80 / columns) ch, 60ch)` | — | `Yeu.root`; constants `buu=15,_uu=60,yuu=80` |
| Numeric columns | detected by regex (currency, %, units, ranges) and marked `data-rte-numeric` | — | `"TableNumericColumns.js"` |
| Code block chrome | radius 12, 1px card border, editor fill, `overflow: hidden`; margin `--ui-code-block-margin-block` (.5rem set by Markdown root; 12 above / 12 below for `.composer-message-codeblock` in prose) | — | `"CodeBlockChrome.js"` `Ojl.base`; `lOs.base` |
| Code header | padding 6 × `--conversation-tool-card-padding-x` (10), gap 6, 1px stroke-tertiary bottom rule; editor fill → bg-tertiary on hover; name text-secondary ellipsis, meta tertiary | — | `"CodeBlock.js"` `oOs`, `geu`, `feu` |
| Code body | mono **12/18** (`font-size-sm`/`line-height-base`), padding 6 top/bottom, line inset 10 each side; wrap or horizontal (`width: max-content; min-width: 100%`); line numbers 11px tertiary, min-width 28, 12 after; indent guides 1px stroke-tertiary | — | `"DefaultCode.js"` `neu`, `iOs`, `nOs`, `ieu`; `JLs` |
| Copy | absolute top 4 / right 4, opacity 0 until hover or focus-within; green when copied | — | `eNs`, `pRn` |
| Inline code | mono **.9em**, padding 1.5 × 2, radius 5, bg-tertiary | — | `mOs.base` |
| Blockquote | margin .5rem 0, padding 2 0 2 **16**, text-secondary; 3px full-radius rule in stroke-secondary | normalized: margin 4 | `gOs` |
| Rule | margin 16, 1px stroke-tertiary | — | `jeu.root` |
| Images | radius 6, margin .5em; local images max-height 360 | — | `QBi` |

Which context uses `sizeSm`: one-line tool-call descriptions (`"ToolCallRenderer.js"`, `size:"sm", singleLine:!0`) and
everything in trays (`"TrayMarkdownDefaults.js"`, `size:"sm"`). Assistant messages (`"AgentTranscriptRow.js"`) use the
default in both windows. The user bubble is 14/22 → 15/24 with the same token.

## 3. Container queries and breakpoints that touch chat

| Selector / module | Threshold | Change | Source |
|---|---|---|---|
| `.composer-messages-container[data-project-send-message-layout]` | none (formula) | human inset `max(32px, clamp(0, (100% − 480px) × 0.4, 20%))`: 32 up to ~560 wide, then grows to 20% | D-CSS |
| `.composer-react-virtual-plane-inner` | `container-type: inline-size` | makes `100cqi` (bubble max `100cqi − 82`) track the transcript | D-CSS |
| Transcript column | width ≥ cap | centres at 840 (IDE) / 796 (Agents) | §1 |
| `"PromptInputToolbar.js"` `ui-ee6ls6`; glass `glass-1ao1apl` | `@container (max-width: 250px)` | composer mode chip label hidden | D-JS, G-CSS |
| `"TranscriptCardRoot.js"` `rootRow` | `@container (max-width: 280px)` | card row wraps | D-JS |
| `"TranscriptCardMedia.js"`, computer-use screenshot | `@container (max-width: 280px)` | media goes full width, 16:10, corners re-cut (bottom-left 0, top-right 12) | D-JS |
| `"TrayBanner.js"` | `@container tray-banner (max-width: 480px)` | banner becomes a grid; action stretches full width, padding-y 8 | D-JS |
| `"AgentTranscriptSentMessageActions.js"` | `width < 20 / 24 / 42 / 46 / 68px` | sent-message action slots swap labels for icons, then hide | D-JS |
| `.composer-questionnaire-toolbar-stepper(-label)` | ≤199 / ≤164 | stepper label, then stepper hidden | D-CSS |
| Tables, code | any width | horizontal scroll (table: hover scrollbar), never reflow; prose cells capped 15–60ch | §2 |
| Tool lines, shell descriptions | any width | single line, ellipsis | `"ToolCallLine.js"`, `"Collapsible.js"` |

None of these changes markdown type, gaps, headings or lists.

## 4. Tool and step rows

| Part | Value | Source |
|---|---|---|
| Line | flex, gap 4, nowrap ellipsis, no select; font `--conversation-font-size` = tool size = **14 IDE / 15 Agents**, line **22 / 24** (row height = one line) | `"ToolCallLine.js"` `ctt.root`; `"Collapsible.js"` `Ebe.base` |
| Verb | text-secondary, weight normal; hover → primary on clickable lines (shell: `--ui-collapsible-action-hover-color: text-primary`) | `ctt.action`, `Q6i` |
| Detail | text-tertiary, tabular nums, ellipsis; hover → secondary; details button underlines on hover | `ctt.details`, `J6i`, `Ebe.detailsButton` |
| Dimmed / muted | verb tertiary, detail quaternary (finished notifications use `tone:"tertiary"`) | `ctt.actionDimmed/detailsDimmed`, `Q6i.muted` |
| Icon | inline-flex, line-height 0, text-secondary, sized by `--icon-size` = conversation font size (1em); legacy `.composer-primary-toolcall-icon` 16 × 18 | `ctt.icon`; D-CSS 5490 |
| Step gap | `--step-gap` 6 in step-group summaries (4 fallback in activity groups); group content gap = row gap 14 (fallback 8); thinking body .5 opacity | `"StepGroupSummaryView.js"` `stepGap:c=6`; `"AgentTranscriptActivityGroup.js"` `D8i` |
| Grouped rows | One collapsible line: "Explored" + "n files, …" (also "Ran n commands", "Edited n files" + `+N −N` in git green/red, "Generated n images", "Thought for Ns"); body masked `linear-gradient(rgba(0,0,0,.15) 0 → black 32px)` when scrollable | `"step-group-display.js"` (`JCv`, `t0v`, `KCv`); `"StepGroupSummaryView.js"` `kUi`, `cbu`, `lbu`, `ubu` |
| Grouping density | setting `cursor.composer.conversationDensity` (Agents) default **compact-all-grouped**; `cursor.composer.editorConversationDensity` (IDE) default **detailed**; options detailed / compact-ungrouped / compact-all-grouped | D-JS `constants.js` `Kds`, `iTi`, `WHt` |
| Card | radius 12, 1px stroke-secondary, `--ui-tool-call-card-bg`, overflow hidden; header padding 8, gap 6, hover bg-tertiary, optional divider; header content min-height 20, gap 2 | `"TranscriptCardRoot.js"` `$Le`; `"TranscriptCardHeader.js"` `gwt` |
| Card body | content gap 6, inset 8, type = conversation size; rows list padding 4 6 6 6 at **13/18**; row padding 4 × 6, radius 6, text-secondary, hover bg-tertiary; footer right-aligned, padding 8, gap 6 | `"TranscriptCardContent.js"`, `"TranscriptCardRows.js"`, `"TranscriptCardRow.js"`, `"TranscriptCardFooter.js"` |
| Streaming card | 16 fade at the bottom; expand button 20 tall with a 20 icon, hidden until hover | `"ToolCallCard.js"` `QHt` |
| Shell output | accordion body radius 8, 1px stroke-tertiary (primary while pending); preview `5 × 18 + 6` = 96; prompt mono 13/18 tertiary | `"ShellToolCallView.js"` `bg` |
| Tail status | 22/24 line, gap 8, text-secondary; Cancel tertiary → primary on hover | `"AgentTranscriptTailStatus.js"` `Pwt` |
| Turn summary | end-of-turn summary text-tertiary → secondary on hover, collapsed cap 180; turn actions row estimated 36 | `"EndOfTurnSummary.js"` `b_u`, `y_u`; `"transcript-geometry.js"` (`hHs=36`, `dHs=180`) |
| Todo list | list gap 10; item gap 4; check slot 14 × line height; text **lg** (14/22 IDE, 15/24 Agents) text-secondary, in-progress primary, pending quaternary, done struck quaternary; container bg-quaternary, 1px stroke-quaternary, radius 8; header 28 tall, padding 0 12; body padding 8 16 | `"todo-list.js"` `Qku`…`owu` |

## 5. Units and sharing

| Kind | Unit | Examples |
|---|---|---|
| Type | px tokens (`--cursor-font-size-*`), swapped per window; user scale `cursor.composer.textSizeScale` 0.85 / 1 / 1.15 / 1.3 | 14/22 vs 15/24 |
| Heading sizes, list indent, inline code, icon slots, image margins | em | 1.466em, 2em, .9em, 1em |
| Heading top margin | computed from the font var | `calc(var(--conversation-font-size) × 22 / 15)` |
| Block and list gaps, card and cell padding, radii, code type | px tokens | 16, 8, 18, 12, 6 × 10, 12, 12/18 |
| Table prose cells | ch, set from column count | 15–60ch |

One markdown component and one transcript serve both widths. Width-specific behaviour lives in the column (cap,
centring, padding), the insets (classic 11 vs glass 0 + 13), the human bubble lane, the type token swap per window,
and the grouping density default — not in markdown rules.
