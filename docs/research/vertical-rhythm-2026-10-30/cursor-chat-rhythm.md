# Cursor agent chat: vertical typographic rhythm (read from the app bundle)

- **Version:** Cursor 3.27.22, commit `b1aa50cb6db84fd3e8c808259cb172ea73425c10`
  (`/Applications/Cursor.app/Contents/Resources/app/product.json` `"version": "3.27.22"`; Info.plist
  `CFBundleShortVersionString` 3.27.22). The earlier notes in `docs/research/inspector-chat-2026-10-18/` were read from 3.24.12.
- **Read:** 2026-10-30, read-only. Nothing in /Applications was changed or launched.
- **Files.** Paths are relative to `…/app/out/vs/workbench/`:
  - **GJS** = `workbench.glass.main.js` (Agents window; StyleX atoms `.ui-xxxx{…}` are inlined as CSS text in this JS).
  - **GCSS** = `workbench.glass.main.css`.
  - **DCSS** = `workbench.desktop.main.css` (IDE).
  - Named modules are cited as `"Name.js"`, and an atom as `.ui-xxxx{…}`. Every px value below comes from a quoted string.
    Where a value is computed (em × size, sums), the arithmetic is shown and marked *derived*.

## 0. The one thing that changes everything: the two windows use different body sizes

| Part | Value (px) | Source |
|---|---|---|
| Token scale (`:root`) | font-size xs/sm/base/lg 11/12/13/14 | GJS `:root, .ui-qruemj{--cursor-font-size-base:13px;--cursor-font-size-lg:14px;--cursor-font-size-sm:12px;--cursor-font-size-xs:11px;}` |
| Line heights (`:root`) | xs/sm/base/lg 14/16/18/22 | GJS `:root, .ui-1no9adk{--cursor-line-height-base:18px;--cursor-line-height-lg:22px;--cursor-line-height-sm:16px;--cursor-line-height-xs:14px;}` |
| Letter-spacing (`:root`) | xs +0.07, sm 0, base −0.08, lg −0.15, xl +0.08, 2xl −0.46, 3xl −0.26 | GJS `:root, .ui-nip2w{--cursor-letter-spacing-2xl:-0.46px;--cursor-letter-spacing-3xl:-0.26px;--cursor-letter-spacing-base:-0.08px;--cursor-letter-spacing-lg:-0.15px;…-sm:0px;…-xl:0.08px;…-xs:0.07px;}` |
| **Agents window (glass) override** | **lg = 15 / 24, letter-spacing lg −0.24** | GCSS `body[data-cursor-glass-mode=true]{--cursor-font-size-lg:15px;--cursor-line-height-lg:24px;--cursor-letter-spacing-lg:-0.24px}` (only in GCSS; DCSS has no `--cursor-font-size-lg:15px`) |
| Weights | normal 400, medium 500, semibold 600 | GJS `--cursor-font-weight-normal:400`, `--cursor-font-weight-medium:500`, `--cursor-font-weight-semibold:600` (3.24 notes said headings 590; the token is now 600) |
| Spacing | 4px steps (`spacing-1` 4, `-0-5` 2, `-2-5` 10, `-3` 12, `-9` 36) | GJS `--cursor-spacing-1:4px`, `--cursor-spacing-0-5:2px`, `--cursor-spacing-2-5:10px`, `--cursor-spacing-3:12px`, `--cursor-spacing-9:36px` |
| Text component sizes | xs 11/14, sm 12/16, md 13/18, lg 14/22 (glass 15/24), xl 17/21, 2xl 20/22, 3xl 22/26 | GJS `"text.stylex.js"` `ngp={xs:n1a.root,sm:MU.root,md:TG.root,lg:m7r.root,xl:f7r.root,"2xl":i1a.root,"3xl":F5h.root…}`; `"typography.stylex.js"` resolves to `font-size:17px;line-height:21px` (xl), `20px/22px` (2xl), `22px/26px` (3xl), lg = `var(--cursor-font-size-lg)`/`var(--cursor-line-height-lg)` |

The conversation's scale variables take `lg`. So the chat reads **14/22 in the IDE agent panel** and **15/24 in the Agents window**. Every value tied to the conversation font (heading margins, em rules) scales with it. The tables below give both, plus 13px for comparison where a rule is a ratio.

## 1. Body text and assistant markdown

| Part | Value (px) | Source |
|---|---|---|
| Conversation scale root | text = lg, tool = lg, tray = base, line = lg | GCSS/DCSS `.composer-bar,.composer-messages-container{--conversation-text-font-size:var(--cursor-font-size-lg,14px);--conversation-tool-font-size:var(--cursor-font-size-lg);--conversation-tray-font-size:var(--cursor-font-size-base);--conversation-font-size:var(--conversation-tool-font-size);--conversation-line-height:var(--cursor-line-height-lg,22px);…}` |
| Assistant message font | 14 (IDE) / 15 (glass) | GJS `"AssistantMessage.js"` wrapper `style:{"--conversation-font-size":"var(--conversation-text-font-size)",color:"inherit",userSelect:"text"}` |
| Markdown root size / line | 14/22 (IDE), 15/24 (glass) | `"Markdown.stylex.js"` `SDa.base` → `.ui-4xmdv1{font-size:var(--conversation-font-size,14px)}`, `.ui-1bcdmom{line-height:var(--conversation-line-height, var(--cursor-line-height-lg))}` |
| Markdown colour role | text-primary (overridable by `--markdown-foreground`) | `.ui-ci6ffn{color:var(--markdown-foreground,var(--cursor-text-primary))}` |
| Markdown weight | not set; inherits (400) | no font-weight in `SDa.base` |
| Markdown letter-spacing | not set at `md` size; `sm` size uses −0.08 | `SDa.sizeSm` → `.ui-1yppyca{letter-spacing:-0.08px}`; nothing in `SDa.base` |
| Markdown `sm` size (trays, cards) | 13/18 | `SDa.sizeSm` → `.ui-11wthnw{font-size:var(--cursor-font-size-base)}`, `.ui-1ja60sm{line-height:var(--cursor-line-height-base)}` |
| Inline icon size | = conversation font | `.ui-vryglj{--icon-size:var(--conversation-font-size,var(--cursor-font-size-lg))}`, `.ui-1hjypbk{--icon-vertical-align:-2px}` |
| Muted / meta spans | meta .85em uppercase +.05em, tertiary | `.ui-7l6huh .md-meta{font-size:.85em}`, `.ui-1dnqcz6 .md-meta{text-transform:uppercase}`, `.ui-105p4p7 .md-meta{letter-spacing:.05em}` |

## 2. Markdown block spacing

The spacing variables are set on the conversation containers: GCSS `--conversation-block-gap:16px;--conversation-list-before-gap:8px;--conversation-list-after-gap:18px;--conversation-heading-after-gap:4px;--conversation-embedded-block-before-gap:12px;--conversation-list-item-gap:8px`. The element mapping is confirmed by `rootClass` in GJS, for example `Rr({rootClass:"ui-markdown__paragraph",stylexStyles:[UES(…)]})`. The markdown root sets no `display` (`SDa.base`), so vertical margins collapse in normal flow. Gaps between blocks are therefore the larger of the two margins (*derived*).

### Paragraphs and lists

| Part | Value (px) | Source |
|---|---|---|
| `<p>` margin top / bottom | 16 / 16, so p→p gap **16** | `x0i.base` → `.ui-z80ra4{margin-top:var(--conversation-block-gap,10px)}`, `.ui-1nhcn8o{margin-bottom:var(--conversation-block-gap,10px)}` |
| First / last block | 0 (flush to the row edge) | `.ui-14l7nz5:first-child{margin-top:0}`, `.ui-zboxd6:last-child{margin-bottom:0}` |
| p before a list | margin-bottom 8 | `.ui-1xxm6qq.ui-1xxm6qq:is([data-md-next="list"]):where(:not([data-md-list-item] *)){margin-bottom:var(--conversation-list-before-gap,var(--conversation-block-gap,10px))}` |
| p before an embedded block (code, table) | margin-bottom 12 | `.ui-fo6hhr.ui-fo6hhr:is([data-md-next="embedded"])…{margin-bottom:var(--conversation-embedded-block-before-gap,var(--conversation-block-gap,10px))}` |
| `<ul>/<ol>` margin top / bottom | 8 / 18. *Derived:* p→list **8**, list→p **18** | `sVe.base` → `.ui-13vk20g{margin-top:var(--conversation-list-before-gap,…)}`, `.ui-1e8yfua{margin-bottom:var(--conversation-list-after-gap,…)}` |
| Between list items | **8** (flex column gap; the code fallback is 6) | `sVe.base` → `.ui-78zum5{display:flex}`, `.ui-dt5ytf{flex-direction:column}`, `.ui-1ae8yn7{gap:var(--conversation-list-item-gap,6px)}` |
| Paragraphs inside an item | margin 0 | `:where(.ui--default-marker[data-md-list-item]) .ui-uu7i3w.ui-uu7i3w{margin-top:0}`, `… .ui-j7cesy.ui-j7cesy{margin-bottom:0}` |
| Block after the item's first paragraph (nested list, second p) | margin-top 4 | `kDa.base` (li) → `.ui-ez2fb > p + *{margin-top:var(--cursor-spacing-1)}` |
| Nested list bottom | 0 inside an item | `sVe.base` includes `ui-j7cesy` (margin-bottom 0 inside `[data-md-list-item]`) |
| List indent | 2em: 26 @13, **28 @14**, 30 @15 | `.ui-1bae07f{padding-left:2em}` |
| Item padding | 0 | `kDa.base` → `.ui-exx8yu{padding-top:0}` … `.ui-1uhho1l{padding-left:0}` |
| Markers | disc → circle → square; decimal | `sVe.bullet` `list-style-type:disc`, `bulletNested` `circle`, `bulletDeep` `square`, `ordered` `decimal` |
| Ordered list, >2 digit markers | indent `calc(Nch + 1em)` | `orderedWideGutter(\`calc(${t.markerDigits}ch + 1em)\`)` |
| Task list item indent | 14 + 8 = 22 | `kDa.task` → `.ui-1aw4gp8{padding-left:calc(var(--cursor-spacing-3-5) + var(--cursor-spacing-2))}` |

### Headings

| Part | Value (px) | Source |
|---|---|---|
| Weight | semibold 600 | `TFe.base` → `.ui-1hohiyz{font-weight:var(--cursor-font-weight-semibold)}` |
| Line height | 1.42 (ratio) | `.ui-x6cpbe{line-height:1.42}` |
| h1 size | 1.466em: 19.06 @13, **20.52 @14**, 21.99 @15. Line 29.1 @14 (*derived*) | `TFe.level1` → `.ui-1l19gge{font-size:1.466em}` |
| h2 size | 1.333em: 17.33 @13, **18.66 @14**, 20.0 @15 | `.ui-1pz8kdr{font-size:1.333em}` |
| h3 size | 1.133em: 14.73 @13, **15.86 @14**, 17.0 @15 | `.ui-6f599f{font-size:1.133em}` |
| h4 size | 1em: 13 / **14** / 15 | `.ui-rv4cvt{font-size:1em}` |
| h5 / h6 | .866em / .8em, text-secondary | `.ui-122v300{font-size:.866em}`, `.ui-sfzzmd{font-size:.8em}`, `.ui-19aaqeu{color:var(--cursor-text-secondary)}` |
| h1–h3 margin-top | font × 22/15: 19.07 @13, **20.53 @14**, 22.0 @15 | `.ui-16med1b{margin-top:calc(var(--conversation-font-size,14px) * 22 / 15)}` |
| h4–h6 margin-top | 12 | `.ui-19snzy6{margin-top:var(--cursor-spacing-3)}` |
| Heading margin-bottom (all levels) | 4 | `.ui-1qaq26d{margin-bottom:var(--cursor-spacing-1)}` |
| Heading → p | **4** (the p's top margin is replaced) | `.ui-2rll1g.ui-2rll1g + p:where(:not([data-md-list-item] *)){margin-top:var(--conversation-heading-after-gap,var(--conversation-block-gap,10px))}` |
| p → h1–h3 | *derived* max(16, 20.53) = **20.5 @14**, 22 @15 | as above |
| Heading → list | *derived* max(4, 8) = 8 | as above |
| `sm` markdown heading top | 8 | `TFe.sizeSm` → `.ui-1e66mq1{margin-top:var(--cursor-spacing-2)}` |
| "Normalized" markdown (thinking body, question cards) | headings 1em, 6 / 6; lists and quotes 4 / 4 | `TFe.normalized` → `.ui-1mdx765{margin-top:var(--cursor-spacing-1-5)}`, `.ui-8kmwxx{margin-bottom:var(--cursor-spacing-1-5)}`; `sVe.normalized` / `IDa.normalized` → `.ui-1om1abp{margin-top:var(--cursor-spacing-1)}`, `.ui-1qaq26d{margin-bottom:…spacing-1}` |
| Section-label mode (not chat default) | label top = font × 22/15, bottom 10 | `.ui-6gbu0v…[data-md-section-label]…{margin-top:calc(var(--conversation-font-size,14px) * 22 / 15)}`, `.ui-f4gw0k…{margin-bottom:var(--cursor-spacing-2-5)}` |

### Code, tables, quotes, rules, images

| Part | Value (px) | Source |
|---|---|---|
| Inline code | .9em mono (11.7 @13, 12.6 @14, 13.5 @15); padding 1.5 / 2; radius 5; bg-tertiary; line-height inherits (no extra row height) | `EDa.base` → `.ui-eb7xqv{font-size:.9em}`, `.ui-rtu7ee{padding-top:var(--markdown-inline-code-padding-block,1.5px)}`, `.ui-1i9v5mb{padding-right:var(--markdown-inline-code-padding-inline,var(--cursor-spacing-0-5))}`, `.ui-115g5cq{border-radius:var(--markdown-inline-code-radius,5px)}`, `.ui-15bjb6t{line-height:inherit}` |
| Code block margin | 8 above and below (.5rem, assuming 16px root; no root override found). *Derived:* p→code **12**, code→p **16** | `SDa.base` → `.ui-1xr1fm3{--ui-code-block-margin-block:.5rem}`; `"CodeBlockChrome.js"` `Rsp.base` → `.ui-1j66ri5{margin-top:var(--ui-code-block-margin-block,var(--cursor-spacing-1))}`, `.ui-t4zf8z{margin-bottom:…}` |
| Code block (legacy class path) | top 12 / bottom 12 | `.ui-1whbzrh > div .composer-message-codeblock{margin-top:var(--conversation-embedded-block-before-gap,var(--cursor-spacing-3))}`, `.ui-1ylhn6a > div .composer-message-codeblock{margin-bottom:var(--cursor-spacing-3)}` |
| Code block radius | 12 | `Rsp.base` → `.ui-1dcy8l4{border-top-left-radius:var(--cursor-radius-xl)}` … |
| Code block header | padding 6 / 8 (tool-card x), gap 6, text inherits | `"CodeBlock.js"` `fDa.base` → `.ui-uve7l6{padding-top:var(--cursor-spacing-1-5)}`, `.ui-1jwyyqy{padding-right:var(--conversation-tool-card-padding-x,8px)}`, `.ui-pkkfsy{gap:var(--cursor-spacing-1-5)}` |
| Code block body | mono **12/18**; padding 6 top / 6 bottom; line inset 10 / 10; each line min-height 18 | `"DefaultCode.js"` `Xmp.base` → `.ui-1wm8ruf{font-size:var(--cursor-font-size-sm)}`, `.ui-1ja60sm{line-height:var(--cursor-line-height-base)}`, `.ui-uve7l6{padding-top:…spacing-1-5}`, `.ui-1rgtt3y{padding-bottom:…spacing-1-5}`; `uDa.base` → `.ui-1iw6539{padding-inline-start:var(--ui-default-code-line-inset,var(--cursor-spacing-2-5))}`, `.ui-1fg0g13{padding-inline-end:var(--cursor-spacing-2-5)}`; `lDa.base` → `.ui-10fesj9{min-height:var(--cursor-line-height-base)}` |
| Table wrapper (card) | margin 12 / 12; 1px stroke-secondary; radius 12. *Derived:* p→table 12, table→p 16 | `Bfp.root` → `.ui-pa554j{margin-top:var(--conversation-embedded-block-before-gap,var(--cursor-spacing-3))}`, `.ui-14q74kp{margin-bottom:var(--cursor-spacing-3)}`, `.ui-1pkpdue{border-radius:var(--cursor-radius-xl)}` |
| Table cell padding | **6 / 10**; top-aligned; 1px bottom rule; column rules drawn as a 1px gradient | `ADa.base` (th/td) → `.ui-uve7l6{padding-top:var(--cursor-spacing-1-5)}`, `.ui-16b7oty{padding-right:var(--cursor-spacing-2-5)}`, `.ui-1rgtt3y{padding-bottom:…1-5}`, `.ui-o7x2bt{padding-left:…2-5}`, `.ui-16dsc37{vertical-align:top}`, `.ui-so031l{border-bottom-width:1px}`, `.ui-mpqvij{background-size:1px 100%}` |
| Table header | semibold, nowrap | `ADa.header` → `.ui-1hohiyz{font-weight:var(--cursor-font-weight-semibold)}`, `.ui-uxw1ft{white-space:nowrap}` |
| Table text | inherits the markdown size (no size set) | no font-size in `ADa`, `Ufp`, `jfp` |
| Table row height (one line) | *derived* 6 + 22 + 6 + 1 = **35 @14/22**, 37 @15/24 | from the rows above |
| Prose cell width cap | 28ch | `.ui-1sxvp6b{--markdown-table-prose-cell-inline-size:28ch}` |
| Blockquote | margin 8 / 8 (.5rem); padding 2 0 2 16; 3px rule, radius full, stroke-secondary; text-secondary | `IDa.base` → `.ui-1mjqqkp{margin-top:.5rem}`, `.ui-hbfen4{margin-bottom:.5rem}`, `.ui-493x5y{padding-top:var(--cursor-spacing-0-5)}`, `.ui-193t4r6{padding-left:var(--cursor-spacing-4)}`, `.ui-1n405n8::before{width:3px}`, `.ui-ytzyjz::before{background-color:var(--cursor-stroke-secondary)}`, `.ui-19aaqeu{color:var(--cursor-text-secondary)}` |
| Horizontal rule | margin **16 / 16**; 1px top, stroke-tertiary | `Ffp.root` → `.ui-1x419k1{margin-top:var(--cursor-spacing-4)}`, `.ui-198axqt{margin-bottom:var(--cursor-spacing-4)}`, `.ui-178xt8z{border-top-width:1px}`, `.ui-1aeic0j{border-top-color:var(--cursor-stroke-tertiary)}` |
| Image | margin .5em (7 @14); radius 6; local max-height 360 | `Rqr.base` → `.ui-tlvy1s{margin-top:.5em}`, `.ui-q2qa84{margin-bottom:.5em}`, `.ui-1043rbw{border-radius:var(--cursor-radius-base)}`, `.ui-2z3yb8{max-height:360px}` |
| Mermaid / visualization block | margin-top 12, bottom 12 | GCSS `.composer-visualization{…margin-bottom:var(--cursor-spacing-3);margin-top:var(--conversation-embedded-block-before-gap,var(--cursor-spacing-3))…}` |

## 3. Gaps between turns and blocks (transcript rows)

The transcript is a virtual list of rows: a user message, an assistant markdown block, a tool line, an activity group, a status line and so on. Rows are separated by one constant. Markdown inside a row is flush at its first and last block.

| Part | Value (px) | Source |
|---|---|---|
| **Gap between any two rows** (user → assistant, assistant → next user, text → tool row → text) | **14** | GJS `"transcript-plane-tuning.js"` `$7a=14`, exported as `AGENT_TRANSCRIPT_ROW_GAP_PX:()=>$7a`; `"composerTranscriptRowHeights.js"` `Grn=$7a`; the plane uses `gapPx:Grn` and `"--react-composer-transcript-row-gap":\`${fi.rowGap}px\`` with `rowGap:Grn` |
| Row-gap fallback when the variable is unset | 8 | `"conversation.stylex.js"` `transcriptRowGap:"var(--react-composer-transcript-row-gap, var(--cursor-spacing-2))"` |
| Two consecutive user messages | 4 (corners join at 6) | `AGENT_TRANSCRIPT_COMPACT_MESSAGE_GAP_PX:()=>H7a`, `H7a=4`; `function xYS({above:t,below:e}){…if(FKt(t)&&FKt(e))return H7a…}`; `g9w(…,t.filledHumanBubbles===!0?Dbv:gji)` with `gji=4`; bubble `rre.bubbleConnectedAbove` → `.ui-y7i79c{border-top-right-radius:var(--cursor-radius-base)}` |
| …with the "filled" bubble variant | 3 | `"composerTranscriptRowHeights.js"` `Dbv=3` |
| Before a steer message (sent while running) | 28 | `AGENT_TRANSCRIPT_STEER_MESSAGE_GAP_PX:()=>W7a`, `W7a=28`; `f9w` → `gapAfterPx:Nbv`, `Nbv=28` |
| Agent-avatar lane ↔ activity rows | 10 | `S=f9w(t.agentAvatarLane===!0?v9w(y,Mbv):y)`, `Mbv=10` |
| Time boundary / "New" unread divider row height | 28 | `"AgentTranscriptLabeledDivider.js"` `sja=28`; `oja=sja`, `lja=sja`; root padding 4 top / 8 bottom, gap 8 (`.ui-f6zju3`, `.ui-1xlntvz`, `.ui-ehausa`) |
| Classic editor-tab chat: user row top inset | 10 | GJS `paddingTop:…t.location==="editor"?"var(--conversation-editor-message-top-inset, 10px)":"0px"`; `"--conversation-editor-message-top-inset":"10px"` |
| Transcript side padding | 16 | GJS `paddingInline:…"var(--composer-messages-padding-inline, 16px)"` |
| Transcript max width | 640 default | `conversationMaxWidth:"var(--composer-max-width, 640px)"` |

### Tool and step rows

| Part | Value (px) | Source |
|---|---|---|
| Tool / step line | font = tool size (14 IDE / 15 glass); line 22 / 24, so one line is **22 tall (IDE) / 24 (glass)** | `"ToolCallLine.js"` `fIt.root` → `.ui-hwpfco{font-size:var(--conversation-font-size,13px)}` (= `--conversation-tool-font-size` = lg), `.ui-1bcdmom{line-height:var(--conversation-line-height,…)}`, `.ui-11twubx{gap:var(--cursor-spacing-1)}`, `.ui-uxw1ft{white-space:nowrap}` |
| Tool line colours | verb text-secondary 400 (hover primary); detail text-tertiary, tabular numbers | `fIt.action` → `.ui-19aaqeu{color:var(--cursor-text-secondary)}`, `.ui-vxqr21{font-weight:var(--cursor-font-weight-normal)}`; `fIt.details` → `.ui-4b2ntj{color:var(--cursor-text-tertiary)}` |
| Default density | tool calls grouped ("compact-all-grouped") | `"conversation-density.js"` `hIt="compact-all-grouped"` |
| Steps inside an activity group | **4** apart | `"AgentTranscriptActivityGroup.js"` `QQr.group` → `.ui-lwqa1o{gap:var(--step-gap,var(--cursor-spacing-1))}` (the main transcript passes no `activityStepGap`, so the fallback applies) |
| Expanded group: header → content, and content gap | 14 (row gap) | `QQr.groupCollapsible` → `.ui-1n2jpqa{--ui-collapsible-content-gap:var(--react-composer-transcript-row-gap, var(--cursor-spacing-2))}`; collapsible content `.ui-1vdilah{padding-top:var(--ui-collapsible-content-gap,4px)}`, `.ui-1y48gol{gap:var(--ui-collapsible-content-gap,4px)}` |
| Generic collapsible (tool row → its body) | 4 | `S5.toolRowContentGap` → `.ui-1y2xu63{--ui-collapsible-content-gap:var(--step-gap,var(--cursor-spacing-1))}` |
| Collapsible trigger row | 14/22 (15/24 glass); gap 4; chevron margin-start 3, hidden until hover, rotates 90° | `"Collapsible.js"` `FMe.base` → `.ui-hwpfco`, `.ui-1bcdmom`, `.ui-11twubx{gap:var(--cursor-spacing-1)}`; chevron `.ui-fdlg0y{margin-inline-start:var(--cursor-spacing-0-75)}`, `.ui-g01cxk{opacity:0}`, `.ui-1tty4wy…{transform:rotate(90deg)}` |
| "Thinking" / "Thought for Ns" | a collapsible trigger row (22 / 24 tall); body is normalized markdown at opacity .5 | `QQr.thinkingBody` / `"ThinkingLine.js"` `IPp.base` → `.ui-byyjgo{opacity:.5}`, `.ui-13epnph *{color:var(--cursor-text-secondary)}`; body rendered `{normalized:!0,…stylexStyles:QQr.thinkingBody}` |
| Tail status ("Planning next moves…") | 14/22 (15/24), text-secondary, gap 8 | `"AgentTranscriptTailStatus.js"` `RKt.tailStatus` → `.ui-ehausa{gap:var(--cursor-spacing-2)}`, `.ui-hwpfco`, `.ui-1bcdmom`, `.ui-19aaqeu` |
| Turn actions bar (Copy / Fork / feedback) | gap 4; trailing gap 2; its own row, so 14 above | `"AgentTranscriptTurnActions.js"` `PIt.bar` → `.ui-11twubx{gap:var(--cursor-spacing-1)}`; `PIt.trailingActions` → `.ui-137clkk{gap:var(--cursor-spacing-0-5)}`. Bar height: **not found** (depends on the icon-button size) |
| Tool card padding | x 10, y 8, gap 6, tight x 8 | GCSS `--conversation-tool-card-padding-x:10px;--conversation-tool-card-padding-y:8px;--conversation-tool-card-gap:6px;--conversation-tool-card-padding-tight-x:calc(var(--conversation-tool-card-padding-x) - 2px)` |

## 4. User message bubble

| Part | Value (px) | Source |
|---|---|---|
| Padding | **8 / 12** | `"AgentTranscriptHumanBubble.js"` `rre.content` → `.ui-13ly8rp{padding-top:var(--cursor-spacing-2)}`, `.ui-1xlntvz{padding-bottom:…spacing-2}`, `.ui-1o7kk3e{padding-left:var(--cursor-spacing-3)}`, `.ui-1jkygx{padding-right:…spacing-3}` |
| Text | 14/22 (IDE), 15/24 (glass) | `rre.content` → `.ui-n99oxs{font-size:var(--conversation-text-font-size, var(--cursor-font-size-lg))}`, `.ui-1bcdmom{line-height:…}` |
| Gap between blocks inside | 6 | `.ui-pkkfsy{gap:var(--cursor-spacing-1-5)}` |
| Radius | 12 (6 on a joined side) | `rre.bubbleRadius` → `.ui-6iuazf{border-radius:var(--conversation-surface-border-radius,var(--cursor-radius-xl))}`; GCSS `--conversation-surface-border-radius:var(--cursor-radius-xl)` |
| Border, fill, shadow | 1px stroke-tertiary (hover / focus stroke-secondary); bg-elevated; `0 1px 2px` at .05; blur 10 | `.ui-uozvy8{border-top-width:var(--conversation-bubble-border-width,1px)}`, `.ui-qz0629{border-color:var(--cursor-stroke-tertiary)}`, `.ui-14n70vg{background-color:var(--glass-chat-bubble-background,var(--cursor-bg-elevated))}`, `.ui-v186zg{box-shadow:0 1px 2px 0 rgb(0 0 0 / .05)}`, `.ui-gv0goc{backdrop-filter:blur(10px)}` |
| Min width | 150 | `.ui-t7fyls{min-width:150px}` |
| One-line bubble height | *derived* 1 + 8 + 22 + 8 + 1 = **40** (IDE), 42 (glass) | from the rows above |
| Gap to what follows | 14 (row gap); 4 if another user message follows | §3 |
| Right-hugging inset | `max(32px, clamp(0px,(100% − 480px)·0.4, 20%))` | `.ui-nzpki4{--conversation-opposed-inset-human:max(32px,var(--conversation-opposed-inset))}`, `.ui-yyvift{--conversation-opposed-inset:clamp(0px, (100% - 480px) * 0.4, 20%)}` |
| Legacy (classic CSS) human message | padding 8 / 10 (12 standalone); 14/22; gap 6 | GCSS `.composer-human-message-container{--composer-human-message-content-padding-block:8px;--composer-human-message-content-padding-inline:10px;…}`; `…{--composer-human-message-content-padding-inline:12px}`; `.composer-human-message-content{…gap:6px;line-height:var(--composer-human-message-line-height,22px)…}` |

## 5. Composer

| Part | Value (px) | Source |
|---|---|---|
| Container | radius **20** (18 in 3.24); 1px stroke-tertiary → stroke-secondary on hover; bg input-surface; no shadow | `"PromptInput.js"` `LAt.base` → `.ui-1caaxqp{--prompt-input-border-radius:20px}`, `.ui-1ep5w7e{--prompt-input-container-border:var(--cursor-stroke-tertiary)}`, `.ui-n5xyfv{…-hover:var(--cursor-stroke-secondary)}`, `.ui-p63tlz{--prompt-input-container-bg:var(--cursor-bg-input-surface)}`, `.ui-1izfvxi{--prompt-input-container-shadow:none}`; `ZV.base` 1px borders |
| Section gap (trays / header / input) | 6 | `.ui-w32inn{--prompt-input-section-gap:var(--cursor-spacing-1-5)}`, `.ui-1lj7dz9{gap:var(--prompt-input-section-gap)}` |
| Editor text | **14/22** (lg, so 15/24 in glass); text-primary | `"PromptInputEditor.js"` input class string `"ui-1n2onr6 ui-13ly8rp ui-1jkygx ui-1xlntvz ui-1o7kk3e ui-8jbk1e … ui-fc7y3v ui-1yxxptd ui-1wd3ewq…"` → `.ui-fc7y3v{font-size:var(--cursor-font-size-lg)}`, `.ui-1yxxptd{line-height:var(--cursor-line-height-lg)}` |
| Editor padding | **8 / 12** | same string → `.ui-13ly8rp{padding-top:var(--cursor-spacing-2)}`, `.ui-1jkygx{padding-right:var(--cursor-spacing-3)}`, `.ui-1xlntvz{padding-bottom:…2}`, `.ui-1o7kk3e{padding-left:…3}` |
| Editor min / max height | 36 / 200 (one line is *derived* 8 + 22 + 8 = 38) | `.ui-ruz6ki{--prompt-input-editor-min-height:var(--cursor-spacing-9)}`, `.ui-j7tqr1{--prompt-input-editor-max-height:200px}`, `.ui-8jbk1e{min-height:var(--prompt-input-editor-min-height)}` |
| Toolbar | padding 8 all round; left / right gap 8; slots gap 4 | `"PromptInputToolbar.js"` `_ee.root` → `.ui-13ly8rp`, `.ui-1yxiud8{padding-right:var(--cursor-spacing-2)}`, `.ui-1xlntvz`, `.ui-yab65l{padding-left:var(--cursor-spacing-2)}`, `.ui-ehausa{gap:var(--cursor-spacing-2)}`; `_ee.left/right` → `.ui-11twubx{gap:var(--cursor-spacing-1)}` |
| Compact (one-line) composer | row 24 tall, line 24, padding 8 | `lDe.compact` → `.ui-1eejpny .ProseMirror{height:var(--cursor-height-sm)}`, `.ui-12nwg6u .ProseMirror{line-height:var(--cursor-height-sm)}`; `ZV.compact` → padding `spacing-2` all sides |
| Gap above the composer (last row → composer) | 14 when standalone (otherwise 0) + overscroll `min(240, max(80, 20% of viewport))` when not standalone | GJS `function d$k(t){…return Math.max(e,t.overlayHeight)+t.inputAreaGap+n}`, with `inputAreaGap:r.isStandalone()?uEm:0`, `uEm=14`, `n=…Math.min(240,Math.max(80,Math.round(t.viewportHeight*.2)))`. Which window counts as "standalone" was **not verified** |
| Composer top-overlay gap (glass) | 6 | GCSS `.glass-1i047f8{--agent-conversation-composer-top-overlay-gap:var(--cursor-spacing-1-5,6px)}` |
| Total composer height | **not found** as one value; parts above (≈ 1 + 38 + toolbar + 1) | — |

## 6. Titles and sections elsewhere in the Agents window

| Part | Value (px) | Source |
|---|---|---|
| Empty state: root | padding 32 block / 20 inline; centred; gap 12 between icon, header and actions | `"empty-state.js"` `Dfm` class string → `.ui-j2grvh{padding-block:var(--cursor-spacing-8)}`, `.ui-mw8u6f{padding-inline:var(--cursor-spacing-5)}`, `.ui-1oot3zn{gap:var(--cursor-spacing-3)}`, `.ui-2b8uid{text-align:center}` |
| Empty state: title | Text md **13/18**, medium 500, primary | `Ofm`: `zt,{as:"p",color:"primary","data-component":"empty-state-title",…size:"md",weight:"medium"}`; md = `TG.root` = base 13/18 |
| Empty state: description | Text md **13/18**, regular, secondary | `Ffm`: `{…color:"secondary","data-component":"empty-state-description",…size:"md",weight:"regular"}` |
| Empty state: title → description | **2** | `Lfm` (`empty-state-header`) → `.ui-137clkk{gap:var(--cursor-spacing-0-5)}` |
| Empty state: icon and actions | icon slot 16 × 16 tertiary; outline md button; actions gap 8 | `Nfm` → `.ui-1pwdyn5{width:var(--cursor-spacing-4)}`, `.ui-1vatr1o{height:…4}`; `Bfm` → `.ui-ehausa{gap:var(--cursor-spacing-2)}` |
| Browser error page: title / subtitle | title Text 2xl **20/22** regular tertiary; subtitle lg (14, or 15 in glass), line-height 1.6, 400, tertiary, max-width 380; gap **6**; block gap 16 | `bSE`: `Avt(zt,{as:"h2",color:"tertiary",size:"2xl",…weight:"regular"})`; subtitle classes → `.glass-fc7y3v{font-size:var(--cursor-font-size-lg)}`, `.glass-1dbl2gt{line-height:1.6}`, `.glass-o1l8bm{font-weight:400}`, `.glass-1dt7z5j{max-width:380px}`; wrapper `.glass-pkkfsy{gap:var(--cursor-spacing-1-5)}`; outer `.glass-1jlwbde{gap:var(--cursor-spacing-4)}` |
| Project list section header | min-height 24; padding 4 / 4; Text sm **12/16** regular (secondary when tone is neutral); count in quaternary | `"ProjectList.js"` `HFS`: `"header",{className:"ui-78zum5 ui-3zvfii ui-6s0dn4 ui-f6zju3 ui-cnij5n"` → `.ui-3zvfii{min-height:var(--cursor-height-sm)}`, `.ui-f6zju3{padding-top:var(--cursor-spacing-1)}`, `.ui-cnij5n{padding-bottom:…1}`; `zt,{…role:"heading","aria-level":2,color:c,size:"sm",weight:"regular"}` with `c=a==="neutral"?"secondary":void 0` |
| Project list: header → rows, rows, sections | 2; 1; **28** | section `.ui-137clkk{gap:var(--cursor-spacing-0-5)}`; rows `.ui-5cdhqx{gap:var(--cursor-spacing-0-25)}`; `QAn.sectionStack` → `.ui-1qhopif{gap:var(--cursor-spacing-7)}`; content inset 16 / 32 (`.ui-t9g0qb{padding-top:var(--cursor-spacing-4)}`, `.ui-1lg90n0{padding-right:var(--cursor-spacing-8)}`) |
| Sidebar rows and section heads | min-height 28; padding-block 5; 13px, label line 18; text-secondary (active primary, muted tertiary); gap 6 | `"Sidebar.stylex.js"` `d3.root` → `.ui-rwwbop{min-height:var(--ui-sidebar-row-min-height,var(--cursor-height-base))}`, `.ui-1lmzoqf{padding-top:var(--ui-sidebar-row-padding-block,var(--cursor-spacing-1-25))}`, `.ui-1q7xuug{font-size:var(--ui-sidebar-row-font-size,var(--cursor-font-size-base))}`, `.ui-1p1tlvq{--ui-sidebar-menu-button-text-color:var(--ui-sidebar-row-fg,var(--cursor-text-secondary))}`; `d3.label` → `.ui-1ja60sm{line-height:var(--cursor-line-height-base)}`; the section head (`"SidebarSection.js"`) reuses this row with label Text `size:"md"` |
| Sidebar: between groups / rows | 12 / 1 | `ZIp.root` → `.ui-1qtt51g{padding-bottom:var(--ui-sidebar-group-gap,var(--cursor-spacing-3))}`; `QIp.root` → `.ui-wrq7xb{gap:var(--ui-sidebar-row-stack-gap,var(--cursor-spacing-0-25))}` |
| Sidebar group label as a separate small uppercase style | **not found**: section heads are ordinary 13px rows | — |

## 7. Ratio rules (rule → px at 13 / 14 / 15)

| Rule | 13 | 14 (IDE chat) | 15 (Agents window) | Source |
|---|---|---|---|---|
| h1–h3 margin-top = font × 22/15 | 19.07 | 20.53 | 22.00 | `.ui-16med1b{margin-top:calc(var(--conversation-font-size,14px) * 22 / 15)}` |
| Heading line-height 1.42 × size: h1 / h2 / h3 / h4 | 27.1 / 24.6 / 20.9 / 18.5 | 29.1 / 26.5 / 22.5 / 19.9 | 31.2 / 28.4 / 24.1 / 21.3 | `.ui-x6cpbe{line-height:1.42}` × the em sizes above |
| h1 / h2 / h3 / h5 / h6 = 1.466 / 1.333 / 1.133 / .866 / .8 em | 19.06 / 17.33 / 14.73 / 11.26 / 10.4 | 20.52 / 18.66 / 15.86 / 12.12 / 11.2 | 21.99 / 20.0 / 17.0 / 12.99 / 12.0 | `TFe.level1–6` |
| List indent 2em | 26 | 28 | 30 | `.ui-1bae07f{padding-left:2em}` |
| Inline code .9em | 11.7 | 12.6 | 13.5 | `.ui-eb7xqv{font-size:.9em}` |
| Image margin .5em | 6.5 | 7 | 7.5 | `.ui-tlvy1s{margin-top:.5em}` |
| md-meta .85em | 11.05 | 11.9 | 12.75 | `.ui-7l6huh .md-meta{font-size:.85em}` |
| Prompt-button group margin −.5em | −6.5 | −7 | −7.5 | `.ui-1jzfwf{margin-top:-0.5em}`, `.ui-162yjo6{margin-bottom:-0.5em}` |

Everything else is a fixed px or a token: p 16, list 8 / 18 / 8, heading-after 4, embedded 12, row gap 14, hr 16. These do **not** scale with the font, so the line-to-gap ratio changes between 14/22 and 15/24. For example, the paragraph gap is 0.73 line in the IDE and 0.67 line in the Agents window (*derived*).

## Not found

- The rendered height of the turn-actions bar.
- One overall composer height.
- Which window `isStandalone()` refers to (it decides the 14px input-area gap).
- A distinct uppercase or small "group label" style in the Agents sidebar: section heads are 13px rows.
- The root font-size behind `.5rem`: 8px assumes the browser default of 16px.
