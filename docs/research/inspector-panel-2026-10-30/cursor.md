# Cursor: side panels, file trees, code containers (2026-10-30)

**Method.** Read from the installed bundle of Cursor **3.27.22** (`app/package.json` `"version": "3.27.22"`); nothing was
launched or changed. Extends `docs/research/cursor-audit-2026-10-22.md` (3.24.12); values already there are not repeated
unless they changed. Sources, abbreviated below:
- **D** `out/vs/workbench/workbench.desktop.main.css` (VS Code IDE) and **DJ** its `.js` (setting defaults, row heights).
- **G** `workbench.glass.main.css`; **GJ** `workbench.glass.main.js`. Cursor's own components are StyleX: each module
  (`"Name.js"(){…}`) holds objects like `key:{kXXX:"ui-abc123",…}` whose atomic classes are defined in G and in CSS
  strings embedded in GJ (`ui-*`, `cursor-ui-*`, `glass-*`). Values below are those classes resolved, cited as
  **GJ `Module.js` › key**. The shared primitives (`CodeBlockChrome.js`, `DefaultCode.js`, `ShellToolCallView.js`,
  `DefaultDiff.stylex.js`, `Tray.stylex.js`, `section.js`) exist in both DJ and GJ, so they style the IDE's agent panel
  and the Agents window alike; the file tree (`file-tree-entry-view*.js`) is GJ only.
- **T** `extensions/theme-cursor/themes/cursor-dark-color-theme.json` (and `cursor-light-…`).
- Working copies: `scratchpad/cursor-bundle/` (split CSS, `glass-stylex.tsv` = every StyleX object resolved).

**Changed or new since the 3.24 audit.**
- Agents-window chrome bar traced: `:root{--glass-chrome-bar-height:40px;--glass-chrome-bar-padding-inline-start:var(--cursor-spacing-3);--glass-chrome-bar-padding-inline-end:var(--cursor-spacing-2-5);--glass-chrome-control-gap:var(--cursor-spacing-0-25);--glass-chrome-hairline-width:1px}`; resized chrome `[data-component=root][data-chrome-resize]{--glass-chrome-bar-height:44px;…-inline-end:var(--cursor-spacing-2);--glass-chrome-control-gap:var(--cursor-spacing-1-5)}` (G). The audit had this as unverified.
- Letter-spacing tokens (GJ): xs `0.07px`, sm `0px`, base `-0.08px`, lg `-0.15px`, xl `0.08px`, 2xl `-0.46px`, 3xl `-0.26px`.
- In the Agents window `body[data-cursor-glass-mode=true]{--cursor-font-size-lg:15px;--cursor-line-height-lg:24px;--cursor-letter-spacing-lg:-0.24px}` (G): conversation text is 15/24 there, 14/22 in the IDE.
- A new Sidebar primitive (GJ `Sidebar.stylex.js`): rows radius **8** (`--cursor-radius-lg`), padding 5 4, label 13/18; group label 12/16, min-height 30. The legacy `.agent-sidebar-cell` (D) is now `padding:6px 8px 6px 5px; gap:12px; border-radius:6px`; `.agent-sidebar-section-title` still `height:24px;padding:0 6px`.
- A separate renderer ships at `app/molten/dist/renderer/` (own CSS, `ui-*` classes). Not read.

## 1. Panel structure

### IDE view containers (VS Code pane view, both side bars)

| Item | Value | Source (D unless noted) |
|---|---|---|
| Part title bar | 35 tall, padding 0 8; label 11px w400, line-height 35, padding-left 12 | `.monaco-workbench .part>.title{…height:35px…}`, `.part>.title{padding-left:8px;padding-right:8px}`, `.part>.title>.title-label h2{…font-size:11px;font-weight:400…}` |
| Pane (section) header | **22** tall, 11px **w700 uppercase**, flex, pointer | `.monaco-pane-view .pane>.pane-header{align-items:center;…font-size:11px;font-weight:700;height:22px…}`, `>.title{text-transform:uppercase}` |
| Header chevron | codicon with `margin:0 2px` (16 glyph in a 20 slot); not-collapsible title `margin-left:8px` | `.pane>.pane-header>.codicon:first-of-type{margin:0 2px}`, `.pane-header.not-collapsible .title{margin-left:8px}` |
| Header description | w400, `margin-left:10px`, `opacity:.6`, no uppercase | `.pane-header .description{…margin-left:10px;opacity:.6…}` |
| Header actions | hidden until pane hover/focus (or `actions-always-visible`); `margin-right:8px`; items `margin-right:4px`; label `padding:2px` | `.pane>.pane-header>.actions{display:none;margin-left:auto;margin-right:8px}`, `.pane:hover>.pane-header.expanded>.actions{display:initial}` |
| Stacked panes | first header `border-top:none`; others take the theme border; progress bar at `top:20px` | `.split-view-view:first-of-type>.pane>.pane-header{border-top:none!important}` |
| Expand/collapse motion | `.15s ease-out` on height | `.monaco-pane-view.animated .split-view-view{transition-duration:.15s;transition-timing-function:ease-out}` |
| Pane body | `flex:1; overflow:hidden` (no padding) | `.monaco-pane-view .pane>.pane-body{flex:1;overflow:hidden}` |
| Sash | 4 hit area, 4 hover line, `.1s` fade in | `:root{--vscode-sash-size:4px;--vscode-sash-hover-size:4px}`, `.monaco-sash:before{…transition:background-color .1s ease-out}` |
| Scrolled shadow | 3px inset shadow `0 6px 6px -6px` in `scrollbar.shadow`; **Cursor Dark sets it `#00000000`** (none); Light `#14141414` | `.monaco-scrollable-element>.shadow.top{box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;…height:3px}`; T `"scrollbar.shadow":"#00000000"` |
| Empty view | column, centred, `padding:0 20px 1em`; children `margin-block-start:1em`; buttons max 300 | `.pane-body .welcome-view-content{…padding:0 20px 1em}`, `>*{margin-block-start:1em…}` |
| Tree view message | `padding:4px 12px 4px 18px` | `.tree-explorer-viewlet-tree-view .message{display:flex;padding:4px 12px 4px 18px…}` |
| Header colours | header bg = sidebar `#141414`, fg `#F0F0F05C` (36%); light fg `#141414BD` | T `sideBarSectionHeader.*` |

### IDE right side bar (auxiliary bar, agent mode)

| Item | Value | Source (D) |
|---|---|---|
| Edge inset | 8 each side | `.composite.title.auxiliary-bar-title--agent-mode{--agent-title-edge-inset:8px;…padding-inline:var(--agent-title-edge-inset)}` |
| Tabs | `padding:3px 6px`, radius 6, 13/18 w400; tab strip gap 4, `padding-top:4px`; bar 30 | `…action-item.composite-bar-action-tab{border-radius:6px;…padding:3px 6px!important}`, `…action-label{font-size:13px!important;…line-height:18px!important}`, `.auxiliarybar .composite-bar-scrollable{…gap:4px…padding-top:4px}`, `.auxiliarybar .composite-bar{…height:30px}` |
| Title actions | `padding:4px` radius 6 (16 icon → 24 button), gap 0, `padding-left:8px` | `…title-actions .monaco-action-bar .action-label{border-radius:6px;padding:4px}`, `…title-actions{…gap:0;margin-left:auto;padding-left:8px}` |
| Truncated tab | 12 fade at the end; hover 20 | `.composite-bar-action-tab.is-truncated… mask-image:linear-gradient(90deg,#000 calc(100% - 12px),transparent)` |
| Classic aux title | `padding-left:8px;padding-right:8px`, no bottom border; actions `margin-right:4px` | `.part.auxiliarybar>.title{…border-bottom:none!important;padding-left:8px;padding-right:8px}` |

### Agents window panels (right-hand tabs: Changes, Files, Browser, Terminal…)

| Item | Value | Source (GJ) |
|---|---|---|
| Window bar | 40 (44 resized), inline padding 12 / 10 (8), control gap 1 (6), hairline 1 | G `:root{--glass-chrome-…}` above |
| Panel header row | **40** tall, `padding:0 var(--glass-chrome-bar-padding-inline-end) 0 8`, 1px rule top and bottom `--cursor-stroke-tertiary`, gap 4 (wide 6) | `editor-panel-tab-header-row.react.js` › root/default/wide |
| Tab system | bar 40, tab 26 tall, radius 6, padding 8, container padding 6, tab gap 1, max 130, scroll-fade mask 8 | `TabSystem.stylex.js` › root `--tab-system-height:var(--cursor-spacing-10);--tab-height:var(--cursor-spacing-6-5);--tab-radius:var(--cursor-radius-base)…` |
| Resized chrome tabs | tab 32, radius 8, gap 2, active tab gets a 1px `stroke-tertiary` border, inner padding 10; right panel tab min 88, mask 24 | `glass-chrome-tab-system.stylex.js` › resizedRoot, resizedRightPanel |
| Editor-panel tabs | min 120, max 140, padding 5 / 6 | `TabSystem.stylex.js` › rootEditorPanel, tabEditorPanel |
| Tab paint | text tertiary; hover and active primary; hover bg `--cursor-bg-card` (= bg-quaternary 6%), active bg none | › tabEditorPanel, tabSelectionWithoutBackground |
| Tab icon / label | gap 6; secondary label `margin-left:4px` tertiary; dirty dot 5; git letter badge 10px w600 | › tabContent, tabLabelSecondary, tabDirtyIndicator, tabDecorationBadge |
| Tab close | absolute `right:4px`, opacity 0 → 1 on hover/focus | › tabCloseContainer |
| Bar sections | `padding:4px 8px`, colour text-tertiary | › section |
| Split sash | 1px line `stroke-tertiary`; hover 2px `stroke-secondary` radius 1; dragging `bg-accent` | `TabSystem.stylex.js` (tiling) › base/horizontal |
| Search panel inputs | radius 6, 1px `stroke-secondary`, 13px; panel inline padding 8 | `workspace-search-panel.react.js` › panel, inputRoot |
| Omnibar / suggestions | `padding:4px 8px`, hover bg-tertiary; suggestion `padding:6px 8px`, gap 10 | `browser-omnibar.react.js` › display, suggestion |

## 2. File explorer

### IDE explorer (VS Code tree)

| Item | Value | Source |
|---|---|---|
| Row height | **22** | DJ `plt.ITEM_HEIGHT=22`; D `.explorer-folders-view .explorer-item{height:22px;line-height:22px}` |
| Row inset | `padding-left:4px` | D `.explorer-folders-view .monaco-list-row{padding-left:4px}` |
| Indent | default **8** per level (4–40); twistie padding-left `8 + (depth-1)*8` | DJ `[kUt]:{type:"number",default:8,minimum:4,maximum:40}`, `DefaultIndent=8`, `const i=NQa.DefaultIndent+(t.depth-1)*this.indent;n.twistie.style.paddingLeft=…` |
| Twistie | 16 wide, `padding-right:6px`, `translateX(3px)`, 10px | D `.monaco-tl-twistie{…font-size:10px;…padding-right:6px;…transform:translateX(3px);width:16px}` |
| Indent guides | 1px `border-left`, **on hover** by default; `#F0F0F030` active, `#F0F0F013` inactive (light `#14141433` / `#14141414`) | D `.monaco-tl-indent>.indent-guide{border-left:1px solid transparent…}`; DJ `[E1n]:{…default:"onHover"}`; T `tree.indentGuidesStroke` |
| File icon | 16 glyph + `padding-right:6px` | D `.monaco-icon-label:before{…background-size:16px;…height:22px;…padding-right:6px;width:16px}` |
| Row paint | full-bleed list colours, no plate: selection `#F0F0F01E`, inactive and hover `#F0F0F011`; light all `#14141414` | T `list.*` (no `border-radius` on explorer rows in D) |
| Git decoration letter | 90%, w600, `margin:auto 16px 0 5px`, opacity .75; colours on by default | D `.monaco-icon-label:after{font-size:90%;font-weight:600;margin:auto 16px 0 5px;opacity:.75}`; DJ `"explorer.decorations.badges":{…default:!0}` |
| Count badge | min 18, radius 11, 11px, `padding:3px 6px` | D `.monaco-count-badge{border-radius:11px;…font-size:11px;…min-height:18px;min-width:18px;padding:3px 6px}` |
| Compact folders | on; separator `margin:0 2px; opacity:.5` | DJ `"explorer.compactFolders":{…default:!0}`; D `.label-name>.label-separator{margin:0 2px;opacity:.5}` |
| Find/filter widget | top-right, max 200, `padding:3px`, bottom radius 4, input 23; view filter input 12px, 24 (20 in a pane header) | D `.monaco-tree-type-filter{…margin:0 10px 0 6px;max-width:200px;padding:3px…}`, `.viewpane-filter .monaco-inputbox{…font-size:12px;height:24px}` |
| Sticky scroll | on, max 7 rows, sidebar ground, shadow 3 below | DJ `[x1n]:{type:"boolean",default:!0}`, `[A1n]:{…default:7}`; D `.monaco-tree-sticky-container{background-color:var(--vscode-sideBar-background)…}` |

### Agents window file tree (Files panel, tree popups, search results)

| Item | Value | Source (GJ) |
|---|---|---|
| Row height / gap | **24**, 1 apart | `file-tree-entry-view.types.js` `ITi=24,YKt=1`; `ui-1gq4xhb{height:var(--ui-file-tree-row-height,24px)}` |
| Indent | base **8**, **8** per level: `padding-left = 8 + depth*8` (flat 0) | `m$a=8,ATi=8`; `Sn=xe==="flat"?0:Te+a*ke` |
| Row box | radius 6, `padding-right:6px`, gap 4, 13px / line-height 1.5, text primary (muted tone secondary; ignored tertiary, opacity .8) | `file-tree-entry-view.js` › base, muted, ignored |
| Panel inset | tree inside a 4 padding; sticky rows inset 4 | `file-tree-panel.react.js` › fileTreeSpacer, fileTreeSticky |
| Icon slot | 20 × 20, icon-tertiary; folders show the file-type icon at rest and a chevron (12) on hover, rotating 90° | › base (20 slot), restIcon, hoverChevron, hoverChevronOpen |
| States | hover/focus `bg-tertiary` (8%); selected and open `bg-quaternary` (6%); context-menu target `bg-quinary` (4%); keyboard-active `bg-blue-secondary` + `0 0 0 1px stroke-blue-primary`; drop target blue + 1px outline −1 | › interactiveUnselected, selected, active, contextMenuTarget, active (ring), dropInto |
| Status letter (row end) | `margin-left:auto`, 12px w500 tabular, git colour | › base (13434604), added/modified/deleted… |
| Diff stats (row end) | gap 4, 12px tabular, `+` added / `−` removed colours | › base (13435193), add, del |
| Compact folders | single-child directories collapsed by default | `collapseSingleChildDirectories:_=!0` |
| Empty / loading | 12px secondary, `padding:8px 12px`; panel shows tertiary | `file-tree.js` › empty; `file-tree-panel.react.js` › fileTreeEmpty |
| Indent guides | not found in this tree | — |
| Changes list | trailing status icon slot 20, pinned `right:6px`; icon green/orange/red/cyan | `changes-sidebar.react.js` › trailingIconSlot, trailingStatusPinned |
| Diff meter rows | `padding:6px`, radius 6, gap 8, hover `bg-quaternary`, divider `stroke-quaternary`; metric column 48 right-aligned | `diff-meter-panel.react.js` › row, metric |

## 3. Code containers

| Item | Value | Source (GJ) |
|---|---|---|
| Code block shell | radius **12**, 1px `var(--card-border-color, stroke-secondary)`, bg `--cursor-bg-editor`, overflow hidden; margin-block 4 (8 inside Markdown: `--ui-code-block-margin-block:.5rem`) | `CodeBlockChrome.js` › base; `Markdown.stylex.js` › base |
| Copy button | absolute `top:4px; right:4px`, opacity 0 → 1 on block hover or focus-within; on a bg-editor plate; copied green | `CodeBlockChrome.js` › base (actions), plate, copied |
| Code text | mono **12px** w400, line-height **18**, `padding:6px 0`; line inset 10 each side; tab 4 | `DefaultCode.js` › base |
| Line numbers | min 28, `padding-inline-end:12px`, 11px tertiary tabular; highlighted line `bg-active` (16%) | `DefaultCode.js` › base (gutter), highlighted |
| Code header (path row) | `padding:6px 10px`, gap 6, bg editor, hover bg-tertiary, 1px bottom `stroke-tertiary`; path secondary, meta tertiary | `CodeBlock.js` › base |
| File header (diff/edit cards) | `padding:4px 8px`, gap 6, bottom 1px `stroke-secondary`; icon 18; name 13/18 −0.08 primary, path secondary; stats gap 4 tabular | `FileHeader.js` |
| Max height / collapse | none found for chat code blocks (they scroll horizontally) | — |
| Inline code | `padding:1.5px 2px`, radius 5, `bg-tertiary`, mono .9em, primary | `Markdown.stylex.js` › base (inline code) |
| Shell card | radius 8, 1px `stroke-tertiary` (running: `stroke-primary`), bg editor | `ShellToolCallView.js` › accordionBody, accordionBodyPending |
| `$ command` | mono 13/18 **tertiary**, `padding:6px 10px`, pre-wrap; prompt glyph tertiary; tokens: command `--shiki-token-function`, flags keyword/cyan, strings magenta | › command, prompt, token* |
| Output | mono 13/18 tertiary, `padding:0 10px 6px`; preview = 5 lines (`5*18+6` = 96) bottom-anchored with a 16 top fade; expanded max `min(480px,60vh)` | › output, card, outputPreviewTopFade, expandedScrollArea |
| Card actions | top 6 right 6, gap 4; header actions fade in on hover | › bodyMenu, headerActions |
| Tool-card spacing | padding x 10, y 8, gap 6; conversation 14/22 (glass 15/24); block gap 16, list items 8, heading-after 4, embedded block before 12; card radius 12 | G `.composer-bar,.composer-messages-container{--conversation-…}` |
| Diff lines | font **12**, gutter 11, line-height **20**; 3px indicator strip; number cells padding 4 tertiary (coloured when changed); +/− column 14 w600; text inset 8 | `fontSizePx:i=Wki,gutterFontSizePx:r=Gki,lineHeightPx:s=EAn` with `Wki=12,Gki=11,EAn=20`; `DefaultDiff.stylex.js` |
| Diff paint (dark) | added line `#3FA26633`, removed `#B8004933`; word runs `bg-git-*-tertiary` (12%) | GJ `--cursor-diff-added-line-background:#3FA26633`; › inlineAdded |
| Hidden-lines bar | `padding:8px` (4 without buttons), 12px tertiary on `bg-quinary` radius 6 | › separator, separatorText |
| Diff card | header 30 (`--card-header-h`), unified min 36 on `bg-chrome`; stats 12/16 gap 2 tabular; actions 16 (unified 20, radius 4) | `DiffCard.js` |
| IDE breadcrumbs | 22 below tabs; Cursor forces `height:21px; line-height:18px` | D `.breadcrumbs-control{…height:22px}`, `.monaco-workbench .monaco-breadcrumbs{height:21px!important;line-height:18px!important}` |
| IDE sticky scroll | 1px bottom border + `0 4px 2px -2px` shadow | D `.monaco-editor .sticky-widget{…box-shadow:var(--vscode-editorStickyScroll-shadow) 0 4px 2px -2px…}` |

## 4. Property-style UI

| Item | Value | Source |
|---|---|---|
| Settings cell (unchanged) | `padding:12px 14px`, gap 20 (12 stacked); label 13/18 primary; description 13/18 secondary; leading gap 1; trailing gap 8; divider 1px `stroke-quaternary` inset 12; switch box 18 | D `.cursor-settings-cell{…gap:20px;padding:12px 14px…}`, `-divider{…left:12px;…right:12px}` |
| Section primitive | stack gap 8; header `padding:0 4px 0 8px` gap 2; title **12/16 secondary w400**; description 12/16 tertiary | GJ `section.js` › base ×4 |
| Section grouping | tinted: `bg-quinary` radius 12; elevated: `bg-elevated` + 1px `stroke-tertiary` radius 12 | `section.js` › tinted, elevated |
| Disclosure row | `padding:12px` (10 compact), gap 12 (8) | `settings-disclosure-row.react.js` › row |
| Collapsible section header | `padding:6px 12px`, gap 8 | `collapsible-section-header.react.js` › toggle |
| Key/value rows (Tray) | min-height **28**, gap 8; label 13/18 primary ellipsis; value 13/18 **tertiary tabular nowrap**; status 12 tertiary; rows 1 apart, list `padding:4px 0`; a row's value and its hover actions share one grid cell (value fades out, actions in) | `Tray.stylex.js` › root (`--ui-tray-row-min-height:var(--cursor-height-base)`), label, meta, status; `TrayRow.js` › metaAtRest, actionsWithMeta |
| Item (two-line row) | grid `auto 1fr auto`, min 28, column gap 6, row gap 2, `padding:4px 6px`, radius 6; icon cell min 16 icon-secondary; title primary, description tertiary; trailing tertiary gap 4; hover `bg-quinary` | `Item.js` |
| Hairline row list | top border **0.5px** `stroke-tertiary`, `padding-block:10px`, column gap 12, meta `padding-top:2px` | `rows.js` › hairlineRow, rowMeta |
| Context usage | bar 5 tall, segments min 4, radius 1 (ends 2.5), remainder `bg-secondary`; legend swatch 12 radius 2; label grows, value right; status-bar meter button 20 × 20 | `ContextUsageTray.js`; `glass-chat-status-bar-usage-metric.react.js` › button |
| Progress bar | 4 tall, radius 2, track `stroke-secondary` | `ProgressBar.js` › root |
| Segmented control | track `bg-quaternary`, padding 2, heights 24/28/32/36, thumb 18/22/26/30, inner radius = outer − 2; text secondary → primary | `SegmentedControl.js` |
| Tabs | sm `2px 6px`, md `3px 8px`, lg `5px 10px`; default active `bg-tertiary`; underline variant 1px `stroke-tertiary`, gap 12/16 | `Tabs.js` |
| Divider | 1px `stroke-tertiary`, default margin 2 | `Divider.js` |
| Agents sidebar rows | min 28, `padding:5px 4px`, gap 6, radius 8, 1 apart; group gap 12; inset 8; leading icon 14, trailing 13, action box 24; text secondary → primary active; active `bg-quaternary`, highlighted `bg-tertiary` | `Sidebar.stylex.js` › root vars, row |
| Agents sidebar group label | min 30, `padding:4px 2px 4px 6px`, radius 4, **12/16** | › group label, textSize |
| Model info, hover key/values | not traced | — |

## 5. Overall

| Item | Value | Source (GJ unless noted) |
|---|---|---|
| Spacing | `--cursor-spacing-N` = N × 4 (1–80), quarter steps 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15… | `--cursor-spacing-0-25:1px` … `--cursor-spacing-20:80px` |
| Values used in these panels | 1, 2, 4, 6, 8, 10, 12 dominate; 16 only for fades and block gaps | tables above |
| Type | xs 11/14, sm 12/16, base 13/18, lg 14/22 (glass 15/24), xl 17/21, 2xl 20/22, 3xl 22/26 | `--cursor-font-size-*`, `--cursor-line-height-*`; `typography.stylex.js` |
| Weights | 400, 500, 600, 700 | `--cursor-font-weight-*` |
| Control heights | 20 / 24 / 28 / 32 | `--cursor-height-xs…lg`; `control-size.stylex.js` |
| Icon sizes | 10, 12, 14, 16, 20, 24 (`.625rem`…`1.5rem`); codicons 12/14/16/20 | `icon.js` › sizeXs…size2xl; `codicon.js` |
| Icon buttons | 20 / 24 / 28 / 32 square with margins −4 / −6 / −8 / −10, so the glyph lines up with neighbouring text | `icon-button.stylex.js` › sm…xl (width, margin) |
| Text roles | primary = base; secondary 74%; tertiary 60%; quaternary 36% (high contrast 84/72/60) | `--cursor-text-secondary:color-mix(in srgb, var(--cursor-base) 74%, transparent)`; D line for HC |
| Icon roles | secondary 66%, tertiary 52% | `--cursor-icon-*` |
| Strokes | primary 20%, secondary 12%, tertiary 8%, quaternary 4% | `--cursor-stroke-*` |
| Fills | primary 20, secondary 14, active 16, focused 22, tertiary 8, quaternary 6, quinary 4 (%) | `--cursor-bg-*` |
| Dark grounds | base `#F0F0F0`, pane `#181818`, chrome `#141414`; git added `#70B489`, modified `#F1B467`, removed `#FC6B83` | GJ token block (no light block found in GJ; light theme T uses `#141414` alphas) |
| Separators | hairlines `stroke-tertiary` (8%) almost everywhere; `stroke-secondary` (12%) on code and diff cards; `stroke-quaternary` (4%) inside grouped settings | tables above |
| Scrollbars (Cursor UI) | overlay, **6** wide, inset 1, thumb min 20, radius full, `stroke-tertiary` → `stroke-secondary` on hover; optional reserved gutter (`padding-inline-end: 6 + 1`); trays 4 | `scroll-area.js`, `overlay-scrollbar.js` › vars, `Tray.stylex.js` › scrollArea |
| Scrollbars (IDE) | slider `#F0F0F011`; sizes as in the 3.24 audit (10 lists), not re-verified | T `scrollbarSlider.background` |
| Edge fades | tab strip 8 (right panel 24); shell output 16; text overflow 24 | `TabSystem.stylex.js` › root; `ShellToolCallView.js`; `OverflowFade.js` |

## Not found or not verified

- A maximum height or collapse for chat code blocks; indent guides in the Agents file tree.
- Light values of the glass `--cursor-*` tokens (GJ holds one dark block); the Cursor themes don't set
  `sideBarSectionHeader.border`.
- Which icon-button size each Agents-panel header action passes (set at call sites).
- The IDE's list scrollbar size (taken from the 3.24 audit); model info and hover-widget key/value layouts.
- The `molten` renderer.
