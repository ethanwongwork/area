# Claude desktop chat: vertical typographic rhythm (read from the installed bundle)

- App: `/Applications/Claude.app`, `CFBundleShortVersionString` **3.6556.2** (CFBundleVersion 3.6556.2). Read 2026-10-30, read-only; the app was not launched.
- **Where the chat UI is.** `app.asar` holds only the Electron shell. Its `.vite/renderer/main_window/index.html` opens with the comment `<!-- this is the html for app title bar and error UI. everything else gets loaded from claude.ai -->`. But this build also **ships the claude.ai web client** in `Contents/Resources/ion-dist/` (192 MB: `index.html` plus `assets/v1/*.css|*.js`). The main process mounts it as `app://`: `.vite/build/index.chunk-jPKPzV-P.js`: `MYr(n.default.join(DW(),"ion-dist"),…)` … `"Failed to install app:// protocol handler"`. Every value below comes from that bundled client, which covers both the regular chat and the Code tab (its classes are prefixed `epitaxy-`).
- **Root size 16px.** No desktop rule changes `html` font-size; the only `--cds-rem-scale` override is iOS-only (`@supports (font:-apple-system-body) and (-webkit-touch-callout:default){:root{…--cds-rem-scale:calc(16 / 17)`). Tailwind v4 `--spacing:.25rem` = 4px.
- **Density.** `ion-dist/index.html` stamps `<html … data-density="comfortable" class="cds-root …">`, so comfortable is the default and every table gives comfortable first. Compact is the alternative (`compact:` variants and the `.cds-root` base tokens).
- **Abbreviations.** CSS = `audit/claude-extract/ion-css/c6a992d55-Che1orl5.css` (the main 1.49 MB stylesheet; a `.lines` copy is split at `}` for grepping). JS files are in `audit/claude-extract/ion-js/`. All paths are under this `audit/` folder.

## 0. Tokens everything resolves through (CDS, `.cds-root`)

| token | comfortable (default) | compact | source |
|---|---|---|---|
| body size / leading | 14 / 20 | 13 / 19 | CSS `.cds-root[data-density=comfortable]{… --cds-font-size-body:calc(.875rem * …);… --cds-leading-body:calc(1.25rem * …)` · `.cds-root{… --cds-font-size-body:calc(.8125rem …);… --cds-leading-body:calc(1.1875rem …)` |
| prose size / leading | 16 / 24 | 14 / 20 | same blocks: `--cds-font-size-prose:1rem` … `--cds-leading-prose:1.5rem` · `--cds-font-size-prose:.875rem` … `--cds-leading-prose:1.25rem` |
| heading size / leading | 15 / 20 | 14 / 18 | `--cds-font-size-heading:calc(.9375rem …)`, `--cds-leading-heading:calc(1.25rem …)` · `calc(.875rem …)`, `calc(1.125rem …)` |
| title size / leading | 22 / 28 | 20 / 25 | `--cds-font-size-title:calc(1.375rem …)`, `--cds-leading-title:calc(1.75rem …)` · `calc(1.25rem …)`, `calc(1.5625rem …)` |
| caption / footnote / code | 12/17 · 13/17 · 13/19 | 11/17 · 12/15 · 12/17 | `--cds-font-size-caption`, `-footnote`, `-code` and the matching `--cds-leading-*` in the same two blocks |
| gap xs / sm / md / lg / xl | 8 / 12 / 16 / 28 / 40 | 6 / 8 / 12 / 20 / 32 | `--cds-gap-xs:calc(.5rem …)` … `--cds-gap-xl:calc(2.5rem …)` · `--cds-gap-xs:calc(.375rem …)` … `calc(2rem …)` |
| pad xs / sm / md / lg / xl | 6 / 8 / 12 / 16 / 24 | 4 / 6 / 8 / 12 / 20 | `--cds-pad-xs:calc(.375rem …)` … · `--cds-pad-xs:calc(.25rem …)` … |
| control height | 32 | 24 | `--cds-h-control:calc(2rem …)` · `calc(1.5rem …)` |
| radius / composer radius | 8 / 14 | 6 / 12 | `--cds-radius:calc(.5rem …);--cds-radius-composer:calc(.875rem …)` · `.375rem`, `.75rem` |
| weights | regular 400, medium 500, semibold 580, bold 600 | same | `.cds-root{… --cds-font-weight-regular:400;--cds-font-weight-medium:500;--cds-font-weight-semibold:580;--cds-font-weight-bold:600` |
| font: sans | `--cds-font-sans:var(--font-anthropic-sans,…)` → `"anthropic-sans", …` | | CSS |
| font: response (chat) | `:root{… --font-claude-response:var(--font-anthropic-serif)` → `"anthropic-serif", …Georgia…` | | CSS line `:root{--font-mono:var(--font-anthropic-mono);--font-ui:var(--font-anthropic-sans);…--font-claude-response:var(--font-anthropic-serif)` |
| mono | `--cds-font-mono:… var(--font-anthropic-mono,"SF Mono") …` | | CSS |

Per-message text size (Code tab setting S/M/L; `.cds-root :where([data-cds=AssistantMessage],[data-cds=UserMessage],[data-cds=ChatComposerQueuedMessages])[data-text-size=sm|md|lg]`), comfortable: body 13/19 · 14/20 · 15/22; prose 15/22 · 16/24 · 18/27; heading 14/20 · 15/20 · 16/24 (`.cds-root[data-density=comfortable]{--cds-font-size-body--textsm:calc(.8125rem …);… --cds-font-size-prose--textsm:.9375rem;… --cds-font-size-prose--textlg:1.125rem;… --cds-leading-prose--textsm:1.375rem;… --cds-leading-prose--textlg:1.6875rem`).

## 1. Transcript body text

| part | value (px) | source |
|---|---|---|
| **Chat** assistant prose: renderer | `.prose` system (typography `"prose"`) | `ion-js/cc1aae219-CeSwM-tp.js`: `h(OR,{text:e,… className:m,…headingLevelOffset:1,typography:dC,…})`; `dC` = `ion-js/c89efce1a-C_nlrFif.js` `us="prose"` |
| Chat prose wrapper | `<div data-cds="Prose" class="prose …">`, font = response serif | `ion-js/shared-10-D6FXWZph.js`: `lx=…o=i.font??ox…s(rx,{ref:t,font:o,size:c,…})`, `ox=\`var(${ax}, var(--cds-${ix}))\``, `ax="--font-claude-response"`, `ix="font-voice"` |
| Chat prose size / line height | **16 / 24** (compact 14 / 20) | CSS `.prose{--_prose-size:var(--cds-font-size-prose,1rem);--_prose-leading:var(--cds-leading-prose,1.5);…font-size:var(--_prose-size);line-height:var(--_prose-leading)` + tokens §0 |
| Chat outer leading | 26.4 (`1.65rem`; only affects non-prose children, since `.prose` sets its own line height) | `cc1aae219`: `p("font-claude-response relative leading-[1.65rem] [&_pre>div]:bg-bg-000/50 …")` |
| Chat prose weight | 400 (`--cds-font-weight-body` is `initial` → regular) | CSS `.prose{…font-weight:var(--cds-font-weight-body,var(--cds-font-weight-regular,400))` |
| Chat prose colour | inherits `--cds-text-primary`; the prose rules set no colour | CSS `.prose{…}` (no `color`); secondary only on h6, blockquote, markers, lead |
| **Code tab** assistant text: renderer | CDS Prose, font **sans** (the user's font only when flag `type` is on), size from the chat-text-size setting | `ion-js/c96d752d0-CWv_7-n9.js`: `f(_h,{… typography:"prose",size:L,font:b,…children:t.text})`; `var fP={s:"sm",m:"base",l:"lg"}`; `$r("type")?t:"sans"` |
| Code text size / line height (M = base) | **16 / 24**; S 15 / 22, L 18 / 27 (compact: 14/20, 13/19, 15/22) | Prose `data-size` → `.cds-root [data-size=sm]{… --cds-font-size-prose:var(--cds-font-size-prose--sm)…}`; `.cds-root[data-density=comfortable]{… --cds-font-size-prose--sm:.9375rem;--cds-font-size-prose--lg:1.125rem;… --cds-leading-prose--sm:1.375rem;--cds-leading-prose--lg:1.6875rem` |
| Code fallback renderer (`epitaxy` typography) | 14 / 20 sans, regular, `--cds-text-primary` | CSS `.epitaxy-markdown{gap:var(--chat-item-gap,10px);…font-family:var(--cds-font-sans);font-size:var(--chat-body,var(--cds-font-size-body));line-height:var(--chat-leading,var(--cds-leading-body));…color:var(--cds-text-primary)` |
| Assistant text inset (start) | 4 (Code / CDS) · chat 8 | CSS `.cds-root [data-cds=AssistantMessage]{--cds-assistant-message-text-inset:4px;…}` · `cc1aae219` `ps-[var(--msg-text-inset,0.5rem)]` |
| Assistant right stop | clamp(0, (100% − 384) × .175, 56) · chat 32 | CSS `--cds-assistant-message-text-stop:clamp(0px, (100% - 384px) * .175, 56px)` · `cc1aae219` `…:pe-8` |
| Compact embedded chat variant | 13 body, 12 timeline/code, msg gap 4, assistant pb 6 | `ion-js/c041f89c8-helS-r0w.js`: `` [--msg-gap:0.25rem] [--msg-assistant-pb:0.375rem] … [--msg-font-size:0.8125rem] [--msg-timeline-font-size:0.75rem] … [&_.font-claude-response]:leading-[1.5] … [--msg-code-font-size:0.75rem] … [&_h2]:text-[1.0625rem] [&_h3]:text-[0.9375rem] `` |

## 2. Markdown block rhythm

Base: prose 16px, flow unit `--_prose-flow` = .75em = **12px**. `@property --_prose-flow{syntax:"<length>";inherits:true…}` makes it compute once at `.prose`, so it stays 12px inside headings. In compact (14px) it is 10.5px.

| part | value (px), comfortable 16 | source (CSS unless noted) |
|---|---|---|
| Paragraph gap (p, ul, ol, pre, table, blockquote, figure, details) | margin-top **12**, bottom 0 | `--_prose-flow-base:.75em` · `p,ul,ol,dl,blockquote,pre,table,figure,details,…{margin-block-start:var(--_prose-flow);margin-block-end:0}` |
| First child | 0 | `:first-child:not(summary,…){margin-block-start:0}` |
| Lists: indent | 32 (2em) + li padding 8 (.5em) | `:is(ul,ol){padding-inline-start:2em}` · `li{…padding-inline-start:.5em}` |
| Lists: between items | **4** (12 × .333 = 3.996) | `--_prose-x-li-child:.333` · `li{margin-block-start:calc(var(--_prose-flow) * var(--_prose-x-li-child))` |
| Lists: nested list / p inside li | 4 | `li>:is(p,ul,ol,…){margin-block-start:calc(var(--_prose-flow) * var(--_prose-x-li-child))}` |
| Before a list | 12 | the paragraph-gap rule |
| After a list (next block) | **24** (×2) | `--_prose-x-break:2` · `:is(ul,ol,dl)+:where(p,…){margin-block-start:calc(var(--_prose-flow) * var(--_prose-x-break))}` |
| Chat user-bubble lists | indent 32, no item spacing | `cc1aae219` `"… [&_ul]:!space-y-0 [&_ol]:!space-y-0 [&_ul]:ps-8 [&_ol]:ps-8"` |
| h1 | 28 / 35 (1.75em / 1.25), mt **36** (×3) | `--_prose-h1-size:1.75em` · `--_prose-h1-leading:1.25` · `--_prose-h1-space:3` · `h1,…{margin-block-start:calc(var(--_prose-flow) * var(--_prose-h-space));margin-block-end:0}` |
| h2 | 22 / 27.5 (1.375em / 1.25), mt **30** (×2.5) | `--_prose-h2-size:1.375em` · `--_prose-h2-space:2.5` |
| h3 | 18 / 23.4 (1.125em / 1.3), mt **24** (×2) | `--_prose-h3-size:1.125em` · `--_prose-h3-leading:1.3` · `--_prose-h3-space:2` |
| h4 | 16 / 20.8 (1em / 1.3), mt **20** (×1.667) | `--_prose-h4-size:1em` · `--_prose-h4-space:1.667` |
| h5 / h6 | 14 / 18.2 (.875em / 1.3), mt 20; h6 secondary | `--_prose-h5-size:.875em;--_prose-h6-size:.875em` · `h6{…color:var(--cds-text-secondary…)}` |
| Below any heading (next block) | **8** (×.667 = 8.004) | `--_prose-x-after-heading:.667` · `:is(h1,…,h6)+:where(p,…){margin-block-start:calc(var(--_prose-flow) * var(--_prose-x-after-heading))}` |
| Heading after list / table / hr | max(24, heading space) | `:is(ul,ol,dl)+:is(h1,…){margin-block-start:calc(var(--_prose-flow) * max(var(--_prose-x-break), var(--_prose-h-space)))}` |
| Heading weight / face | 580 semibold, same face as the body (chat: serif) | `:is(h1,…){font-weight:var(--cds-font-weight-header,var(--_prose-heading-weight,var(--cds-font-weight-semibold,580)))` · `--_prose-font-heading:var(--_prose-font-body)` |
| **Chat heading shift** | markdown `#` renders as h2 (22px), `##` as h3 (18), `###` as h4 (16), `####` as h5 (14) | `cc1aae219` `headingLevelOffset:1`; `c89efce1a` `r=_s[Math.min(e+c,6)-1]` |
| **Code tab headings** (flag `type`, `[data-cds-reply-type]`) | h1/h2 18 / 27 (1em + 2px; leading + 3px); h3–h6 16 / 24 | `.cds-root [data-cds-reply-type] [data-cds=Prose]…{--_prose-h1-size:calc(1em + .125rem);--_prose-h1-leading:calc(var(--_prose-leading) + .1875rem);--_prose-h2-size:var(--_prose-h1-size);…--_prose-h3-size:1em;--_prose-h3-leading:var(--_prose-leading)…}` |
| Bold | 600 (Code reply-type: 501) | `:is(strong,b,dt,summary){font-weight:var(--cds-font-weight-bold,600)` · reply-type `font-weight:calc(var(--cds-font-weight-medium,500) + 1)` |
| Inline code | 14.4 (.9em), pad ≈0.9 × 3.6 (.0625em .25em), radius 5.76 (.4em), line height 1 | `code:not(pre code){…border-radius:.4em;padding:.0625em .25em;font-size:.9em;line-height:1}` |
| Inline code, Code reply-type | pad 1 × 4, radius 4 | `@media screen and (forced-colors:none){… code:not(pre code,…){…border-radius:4px;padding:1px 4px}` |
| Code block (prose CSS) | 14 (.875em) / 22.75 (1.625), pad 14, radius 12 (1.5 × radius) | `pre{…border-radius:calc(var(--cds-radius,.375rem) * 1.5);…padding:.875rem;font-size:.875em;line-height:1.625` |
| Code block (chat component) | 14 / 22.75 (`text-sm`, `leading-relaxed`), pad 14, radius 8; language label 12/17 with pad 14 above | `shared-10` `"code-block__code !my-0 !rounded-[var(--msg-block-radius,0.5rem)] !text-sm !leading-relaxed p-3.5"` · `"text-secondary font-small p-3.5 pb-0"`; CSS `--leading-relaxed:1.625` |
| Code block spacing | 12 above (flow), 12 before next | paragraph-gap rule (`pre` in the list) |
| Table cell padding | **7 × 12** (.4375em .75em) → row 24 + 14 = **38** (+1 border) | `th,td{vertical-align:top;padding:.4375em .75em}` · `:is(td,th):where(tbody>tr+tr>…){border-block-start:1px solid …}` |
| Table, Code reply-type | cell pad-block 8 (.4375em + 1px), inline 0, 24 between columns; no outer border | `… .prose-scroll :is(th,td)…{…padding-block:calc(.4375em + 1px);padding-inline:0}` · `:is(th,td)+:where(th,td)…{padding-inline-start:1.5em}` |
| After a table | 24 (×2) | `--_prose-x-after-table:2` · `:is(table,.prose-scroll)+:where(p,…){margin-block-start:calc(var(--_prose-flow) * var(--_prose-x-after-table))}` |
| Blockquote | bar 4, inset 8 (.5em), text start 16 (1em); secondary; inner headings use h4 space; break ×1.5 | `blockquote{border-inline-start:4px solid …;color:var(--cds-text-secondary…);margin-inline:.5em 0;padding-inline-start:1em}` · `.prose :is([data-prose-box],blockquote,details,th,td)>*,…{--_prose-x-break:1.5;…--_prose-h1-space:var(--_prose-h4-space)…}` |
| hr | .5 line; 24 above, 24 below; inset 6 (.375em) | `hr{border:0;border-block-start:.5px solid …;margin-block:calc(var(--_prose-flow) * var(--_prose-x-break)) 0;margin-inline:.375em}` · `hr+:where(p,…){margin-block-start:calc(var(--_prose-flow) * var(--_prose-x-break))}` |
| details | pad 8 × 14 (.5em .875em) | `details{…padding:.5em .875em}` |
| **Code fallback (`.epitaxy-markdown`), 14/20** | paragraph gap **10**; h1 16 (1.14286em) / 20, margin 12 above / −4 below; h2 15 (1.07143em) / 20, 10 / −4; h3 14, 7 / −4; lists gap 8 (pad-sm), indent 20; li child mt 8; inline code 13 (body − 1), pad 1 × 2, line height 1.4; code block extra 4 above and below; th/td pad 8; hr margin 10; blockquote bar 2, pad 12 | `.epitaxy-markdown{gap:var(--chat-item-gap,10px);--codeblock-bump:4px;…}` · `.epitaxy-markdown h1{font-size:1.14286em;line-height:1.25;…margin-block:12px -4px}` · `h2{font-size:1.07143em;line-height:1.33333;…margin-block:10px -4px}` · `h3{font-size:1em;…margin-block:7px -4px}` · `ul,…ol{gap:var(--cds-pad-sm);…padding-left:20px` · `:not(pre)>code{…font-size:calc(var(--chat-body,…) - 1px);…padding-block:1px;padding-inline:2px;line-height:1.4}` · `th,…td{padding:var(--cds-pad-sm)…}` · `hr{…margin-block:var(--chat-item-gap,10px)}` · `blockquote{…border-left:2px solid …;padding-left:var(--cds-pad-md)` |
| Code file / document prose (not the transcript) | `--chat-item-gap:16px`; h1 22/28 mb 16 (mt 28); h2 17/22 (24 / 8); h3 15 (20 / 6); h4–6 (16 / 4) | `.epitaxy-markdown.epitaxy-file-prose{--chat-item-gap:16px…}` and the following `h1`–`h6` rules |

## 3. Turn and block gaps

| part | value (px) | source |
|---|---|---|
| **Chat** before a user message | **24** (`--msg-gap`, default 1.5rem); 8 when stacked under another user message | `cc1aae219` `$n=n==="stacked"?"mt-xs":"mt-[var(--msg-gap,1.5rem)]"` |
| Chat below a user message | 4 | same: `p("mb-1",$n,"group group/message-row")`; CSS `.mb-1{margin-bottom:var(--spacing)}` |
| Chat below an assistant message | **12** (`--msg-assistant-pb`) | `cc1aae219` `!H&&"pb-[var(--msg-assistant-pb,0.75rem)]"` |
| Chat: assistant → next user | 12 + 24 = **36** | sum of the two rows above |
| Chat: user → assistant | 4 (plus anything in the user row's actions slot; not resolved) | `mb-1`; the user row is `flex … flex-col gap-xs` (`shared-2` `B("group/message-row flex w-full min-w-0 flex-col gap-xs font-sans",…)`) |
| Chat: between stacked assistant blocks (text / tool / text) | **20** (compact 16) | `shared-9-CM21XrJw.js` `mO=\`grid grid-cols-1 content-start ${dO} …\``, `dO="gap-5 compact:gap-4"` |
| Chat tool status row ("Ran …") | 14/20 text + 4 + 4 = **28** row, gap 8 to the caret/icon | `cc1aae219` `"group/status flex flex-1 min-w-0 items-center gap-2 py-1 text-sm text-start"`; CSS `--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875)` |
| **Code tab** px table (density) | comfortable: turn **24**, item **20**, reply **8**; compact: turn 20, item 16, reply 6 | `c96d752d0` `var r6={compact:{itemGapPx:16,replyGapPx:6,turnGapPx:20},comfortable:{itemGapPx:20,replyGapPx:8,turnGapPx:24}}` |
| Code: before a user turn | 24 / 20 | `ion-js/c97f58e7c-DyJy2DJt.js` `var e="mt-6 compact:mt-5"` (turn) |
| Code: user → assistant reply | **8** / 6 | same file `t="mt-xs"` (reply) |
| Code: between assistant items (text → tool row → text) | **20** / 16 | same file `n="mt-5 compact:mt-4"`, `i="gap-5 compact:gap-4"`; CDS AssistantMessage `ion-js/c80ec48f8-D2IVcRNS.js` `var Ye="gap-5 compact:gap-4"` |
| Code: actions row reserve | 12 below when message actions are shown | `c97f58e7c` `f="[&:has(>[data-reserves-actions-gap]:not(:empty))]:pb-md …"` |
| Code overview feed / coordinator only (not the session transcript) | turn 34, item 13, reply 50, reply run 15, line gap 50 − 28 = 22 | `ion-js/c5dad9749-9tNdKjFP.js` `var e="13px",t="34px",n={"--chat-turn-gap":t,"--chat-item-gap":e}` · `ion-js/c2fd10b8d-DB1Sgoyz.js` `_p="50px",vp="28px",yp="15px"` · `c96d752d0` `function T8(e){let t=Number.parseInt(e,10)-28;return{…"--chat-reply-gap":e,"--chat-line-gap":\`${t}px\`}}`, used only when `overviewFeedLayout`/`isCoordinatorChat` |
| Code tool step row (CDS TurnStatus / Step) | row = control height: **32** (comfortable; text 14/20 + 6 + 6, or prose 16/24 + 4 + 4 in reply-type); compact 24 (13/19 + 2.5 + 2.5) | `ion-js/c734f318c-SHcb2X2p.js` `nn=!Be&&"py-[calc((var(--cds-h-control)_-_1lh)_/_2)]"` · CSS `.cds-root [data-cds=AssistantMessage][data-cds-reply-type] [data-cds=TurnStatus]…>div:first-child,…{font-size:var(--cds-font-size-prose);line-height:var(--cds-leading-prose)}` |
| Step row interior | gap 8 (gap-xs); body text, secondary colour | `c734f318c` `"flex min-w-0 items-start gap-xs font-sans text-body font-normal text-secondary not-italic"` |
| Step detail panel spacing | row variant pt 8; card pt 12, pb 4 (pad-md − pad-sm), px 12; cell py 4 (compact 2) | `c734f318c` `l==="row"?"pt-xs":l==="card"?["pt-sm",Ge.card]:l==="cell"?Ge.cell` · `Ge={card:"pb-[calc(var(--cds-pad-md)_-_var(--cds-pad-sm))]",cell:"py-[calc(var(--cds-pad-md)_-_var(--cds-pad-sm))]"}` · `` j=`min-w-0 px-[var(--cds-turn-status-card-pad-x,var(--cds-pad-md))] py-sm ${k}` `` |
| Transcript column (Code) | max 768 (S) · 960 (M) · 1280 (L); side gutters 32 (16 below 560px tile) | `ion-js/shared-6-sd9jbJqs.js` `` Cg=`${yg} [--max-content-width:var(--chat-column-measure,768px)] [[data-transcript-width=m]_&]:[--max-content-width:var(--chat-column-measure,960px)] [[data-transcript-width=l]_&]:…1280px` `` · `[--chat-column-gutter-start:var(--chat-gutter-start,var(--chat-gutter,32px))]` · `gg="…(max-width:560px)]:[--chat-gutter:16px]"` |
| Transcript column (regular chat) | **not found** (the only measure seen is `max-w-[75ch]` on attachment rows) | `cc1aae219` `"w-full max-w-[75ch] mx-auto mt-[var(--msg-gap,1.5rem)] mb-sm flex flex-col gap-2"` |

## 4. User message bubble (CDS `UserMessage`, shared by the chat and the Code tab)

| part | value (px), comfortable · compact | source |
|---|---|---|
| Padding x / y | **16 / 12** · 12 / 8 | CSS `.cds-root [data-cds=UserMessage],…{--cds-message-bubble-radius:calc(var(--cds-radius) + calc(.25rem * …));--cds-message-bubble-pad-x:var(--cds-pad-lg);--cds-message-bubble-pad-y:var(--cds-pad-md);--cds-message-bubble-measure:85%}` · `ion-js/shared-2-TF8v67kg.js` `var C3="rounded-[var(--cds-message-bubble-radius)] px-[var(--cds-message-bubble-pad-x)] py-[var(--cds-message-bubble-pad-y)]"` |
| Radius | **12** (8 + 4) · 10 | same |
| Text | `text-heading`, regular: **15 / 20** · 14 / 18; sans; Code S/L: 14/20, 16/24 | `shared-2` `c("relative flex min-w-0 flex-col gap-xs",C3,"text-heading font-normal break-words select-text",…)`; CSS `.text-heading{font-size:var(--cds-font-size-heading);line-height:var(--tw-leading,var(--cds-leading-heading))}`; the row is `font-sans` |
| One-line bubble height | 20 + 2 × 12 = **44** · 18 + 16 = 34 | derived from the rows above |
| Inside the bubble | gap between parts 8 (gap-xs); chat text blocks 8 apart (`gap-2`) | `shared-2` `flex-col gap-xs`; `cc1aae219` `"grid grid-cols-1 gap-2 relative …"` |
| Max width | **85%** (min(85%, 100% − beside room) when actions sit beside) | `shared-2` `w3="max-w-[var(--cds-message-bubble-measure)]"`, `Q6="max-w-[min(var(--cds-message-bubble-measure),calc(100%_-_var(--cds-beside-room)))]"` |
| Fill | `--cds-bg-user-message` = `var(--cds-bg-neutral)` (tinted variants exist) | CSS `--cds-bg-user-message:var(--cds-bg-neutral)` |
| Alignment | `ms-auto items-end` (right) | `shared-2` `zt=dt?"me-auto items-start":"ms-auto items-end"` |

## 5. Composer (CDS `ChatComposer`)

| part | value (px) | source |
|---|---|---|
| Text size | chat: heading **15** (compact 14); Code tab: **14** (S 13, L 15) | `shared-2` `Y5="[--cmp-font-size:var(--cds-font-size-heading)]"` · CSS `.epitaxy-root{--prompt-text-size:calc(.875rem * …)}`, `[data-chat-text-size=s] .epitaxy-root{….8125rem…}`, `=l …(.9375rem…)` · `shared-6` `` y_=`${h_} [--cmp-font-size:var(--prompt-text-size)] [--cmp-line-height:var(--prompt-line-height)]` `` |
| Line height | round(size × 1.4): chat **21**, Code **20** (`--prompt-line-height` is never defined, so the fallback applies) | `ion-js/shared-26-CGuBxVt9.js` `"[--cmp-type-size:max(var(--cds-font-size-text-entry-floor,0px),var(--cmp-font-size,var(--cds-font-size-prose)))] [--cmp-leading:round(var(--cmp-line-height,var(--cmp-type-size)*1.4),1px)] …"` |
| Editor row: padding / min height | py = (control − leading) / 2 → chat 5.5, Code 6; row = **32** (compact 24) | same string: `[--cmp-row-py:max(0px,(var(--cds-h-control)-var(--cmp-leading))/2)] [--cmp-row-h:calc(var(--cmp-leading)+2*var(--cmp-row-py))]`; editor `` `w-full max-h-96 min-h-[var(--cmp-row-h)] overflow-y-auto …` `` and `` `${Ka} py-[var(--cmp-row-py)] text-[length:var(--cmp-type-size)] leading-[var(--cmp-leading)] font-normal` `` |
| Multi-line minimum | n × line + 2 × row-py (+8 at size lg); max height 384 | `shared-26` `` function Qa(e,t,n="md"){let r=$a(e)?n==="lg"?`calc(${e}lh + 2 * var(--cmp-row-py) + 0.5rem * …)`:`calc(${e}lh + 2 * var(--cmp-row-py))` `` · `max-h-96` |
| Shell padding (md / lg size) | md: x 8, y 8 · lg: x 12, y 12 | `ion-js/shared-5-Bg6ZMqvt.js` `Vp="[--cmp-pad-x:0.5rem] …"`, `Hp="[--cmp-pad-x:0.75rem] …"`, `Gp="px-[var(--cmp-pad-x)]"`, `Kp="py-2 …"`, `qp="py-3 …"`, applied as `j?Hp:Vp` … `!Yt&&(j?qp:Kp)` (`j=k==="lg"`) |
| Gap between composer rows (header / editor / chin) | **8** (compact 6) | `shared-5` `"[--cmp-gap-y:0.375rem] compact:[--cmp-gap-y:0.375rem] comfortable:[--cmp-gap-y:0.5rem]",!Xt&&"gap-y-[var(--cmp-gap-y)]"` |
| Radius | md: 14 (compact 12) · lg: **20** (compact 18) | CSS `--cds-radius-composer:calc(.875rem …)`; `shared-5` `Jp="[--cds-radius-composer:calc(1.125rem*…)] compact:[…1.125rem…] comfortable:[--cds-radius-composer:calc(1.25rem*…)]"`, `Un=j&&Jp`; CSS `.rounded-composer{border-radius:var(--cds-radius-composer)}` |
| Header row | min 22 (nested control), footnote text, gap 8 | `shared-5` `re("flex min-h-[var(--cds-h-control-nested)] min-w-0 items-center gap-xs text-footnote font-normal",…)` |
| Gap between dock items above the composer | 8 (gap-xs) | CSS `.cds-root [data-cds=ChatComposerDock]>:not([data-cds-dock-item],…,:last-child){margin-bottom:var(--cds-gap-xs)}` |
| Which size (md / lg) each surface uses | **not found** | — |
| Gap between the last message and the composer | **not found** as a single rule (Code adds room for a working row: `pb-[var(--chat-host-working-row-room,var(--chat-host-message-gap,var(--chat-turn-gap)))]`) | `c96d752d0` `Rnt=…` |

## 6. Title + subtitle patterns

| part | value (px) | source |
|---|---|---|
| PageHeader title | Anthropic Serif (`font-voice`), 500, **24 / 32** | `ion-js/cf35aed38-BG5R4ZJ8.js` `"cds-reset min-w-0 font-voice font-medium text-[length:var(--cds-page-header-title-size)] leading-[var(--cds-page-header-title-leading)] text-primary"`; CSS `--cds-page-header-title-size:calc(1.5rem * …)`, `--cds-page-header-title-leading:calc(2rem * …)` |
| PageHeader title row | min height 48 | same file `p("flex min-h-12 min-w-0 items-center",…)` |
| PageHeader description | `text-body`, regular: **14 / 20** (compact 13/19) | same file ``n("p",{className:`-me-[100cqi] w-[100cqi] text-body font-normal ${ee}`…})`` |
| Title → description gap | **8** (`md:gap-2`; 0 in the compact variant) | same file `V=x!=="compact"&&"md:gap-2"`, `p("flex min-w-0 flex-col",V,H,U)` |
| Display / title type styles (serif) | display 38 / 1.2 (45.6), weight 330; title 28 / 1.3, 500; heading 24 / 1.3, 500; response title 28 / 1.3, 600 | CSS `.font-display{font-family:var(--font-ui-serif);font-variation-settings:"opsz" 48;font-size:2.375rem;font-weight:330;line-height:1.2}` · `.font-title{…font-size:1.75rem;font-weight:500;line-height:1.3}` · `.font-heading{…font-size:1.5rem;font-weight:500;line-height:1.3}` · `.font-claude-response-title{…font-size:1.75rem;font-weight:600;line-height:1.3}` |
| Display headline spacing as used | `font-display … mb-2` / `mb-4` / `mb-8` (8 / 16 / 32 below) | `c0d9175fe-DbHZ_8NM.js` `"font-display text-primary mb-2"`, `"font-display text-primary mb-4"`, `"mb-8 text-center font-display text-primary"` (onboarding-type screens) |
| Settings type scale | xl 22/28, large 15/20, base 14/20, small 12/17 | CSS `.font-xl{…font-size:var(--cds-font-size-title)…line-height:var(--cds-leading-title)` · `.font-large{…heading…}` · `.font-base{…body…}` · `.font-small{…caption…}` |
| Chat home greeting | **not found** (the string and its component weren't traced) | — |

## 7. Ratios (em rules and their px)

| rule | ratio | px at 16 (comfortable prose) | px at 14 (compact prose / Code fallback) |
|---|---|---|---|
| body line height | 1.5 | 24 | 20 (token `1.25rem`, not 21) |
| flow unit (paragraph gap) | .75em | 12 | 10.5 |
| heading spaces h1 / h2 / h3 / h4–6 | 3 / 2.5 / 2 / 1.667 × flow | 36 / 30 / 24 / 20 | 31.5 / 26.25 / 21 / 17.5 |
| after heading | .667 × flow | 8 | 7 |
| after list / table / hr; hr margin | 2 × flow | 24 | 21 |
| list item spacing | .333 × flow | 4 | 3.5 |
| list indent; li padding | 2em; .5em | 32; 8 | 28; 7 |
| h1 / h2 / h3 / h4 / h5–6 size | 1.75 / 1.375 / 1.125 / 1 / .875em | 28 / 22 / 18 / 16 / 14 | 24.5 / 19.25 / 15.75 / 14 / 12.25 |
| heading leading h1–2 / h3–6 | 1.25 / 1.3 | 35, 27.5 / 23.4, 20.8, 18.2 | — |
| inline code / code block | .9em / .875em (block leading 1.625) | 14.4 / 14 (22.75) | 12.6 / 12.25 |
| table cell | .4375em × .75em | 7 × 12 | 6.1 × 10.5 |
| blockquote inset / text start | .5em / 1em | 8 / 16 | 7 / 14 |
| Code reply-type h1/h2 | 1em + 2px, leading + 3px | 18 / 27 | 16 / 23 |
| Code fallback h1 / h2 / h3 | 1.14286em / 1.07143em / 1em at 14 | — | 16 / 15 / 14 |
| composer leading | size × 1.4, rounded | chat 15 → 21 | Code 14 → 20 |

## Notes and unverified

- Dark mode: `[data-theme=claude][data-mode=dark] .font-claude-response{…--cds-font-axis-wght:var(--cds-font-axis-wght-regular,"wght" 360,)…}` sets the serif weight axis to 360 on the chat wrapper. `.prose` resets `--cds-font-axis-wght` to `var(--cds-font-axis-wght-body,var(--cds-font-axis-wght-regular,))`, so whether chat prose renders at 360 in dark mode was not resolved.
- The Code tab's prose headings and bold above depend on the `type` flag (`$r("type")`, `S("type")` → `data-cds-reply-type`). Without the flag, headings follow the base `.prose` table.
- The chat's own text-size setting (`--msg-font-size` on `.font-claude-response-body`) is set only by the compact embedded variant in `c041f89c8`. Any other chat text-size control wasn't traced.
- Extracted files: `audit/claude-extract/asar/.vite/…` (shell renderer and main-process chunks), `audit/claude-extract/ion-css/*.css` (all 25 bundled stylesheets, plus `.lines` copies), `audit/claude-extract/ion-js/*.js` (31 cited chunks), `audit/claude-extract/asar-list.txt` (asar directory listing).
