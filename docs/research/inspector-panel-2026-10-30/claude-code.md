# Claude desktop, Code tab: right-hand panels (pinned values)

## Method

Read-only static read of Claude.app **3.6556.2** (`CFBundleShortVersionString`), bundle
`/Applications/Claude.app/Contents/Resources/ion-dist/`. Labels were found in `i18n/en-US.json`,
their ids grepped in `assets/v1/*.js`, and each class string resolved against
`assets/v1/c6a992d55-Che1orl5.css` (Tailwind v4 output + `--cds-*` design tokens). Nothing was run;
the app was not launched. JS files read: `c73f45bc3-B7hbL7H9.js` (rail cards, titlebar pane
toggles), `c227f4d5e-B-FYKrwT.js` (rail rows, Environment), `cf74bc599-CRYqipWN.js` (Outputs,
Changes, Connectors), `c2d611398-Y2NVtf8_.js` (Context), `c91b6e9db-0Cdn02JS.js` (StackedMeter),
`cccc2cf0a-DhZC33Gc.js` (Background tasks, Files), `c621b1e2d-CU5cG_mP.js` (tree geometry),
`cb6930dae-Dw_4c1QI.js` (command block), `cc0a875c8-Ba9KI-Fw.js` (empty state),
`c4db265df-fNhlkQCj.js` (pane header), `c26fb8b6b-B7Friu61.js` (pane icons), `shared-frame-6jtSkIit.js`
(Button, Icon, Switch, row), `shared-6/9/18/20-*.js` (pane and rail constants). Values below are px at the
default **compact** density with `--cds-rem-scale:1` (the 16/17 scale applies only under
`@supports (-webkit-touch-callout)`, i.e. iOS). Light / dark colour pairs come from the `.cds-root` and
`[data-mode=dark]` blocks.

**Caveat, the `panels` flag.** Many of these components switch classes when `lp("panels")` is on
(GrowthBook gate `__gb__3335190042`, a localStorage key, or `data-cds-fizzy-lake~="panels"`;
`shared-4-DUB1Oi0O.js`). Its state at runtime could not be read. Default (flag off) values are
given first, with the flag's changes noted where they matter.

## Root scale (compact default; comfortable in brackets)

| Token | Value | Source (`.cds-root{…}` / `[data-density=comfortable]`) |
|---|---|---|
| `--cds-h-control` | 24 (32) | `--cds-h-control:calc(1.5rem * …)` |
| `--cds-h-control-nested` | 18 (22) | `calc(1.125rem * …)` |
| `--cds-icon` | 16 (20) | `calc(1rem * …)` |
| pad xs / sm / md / lg / xl | 4 / 6 / 8 / 12 / 20 (6/8/12/16/24) | `--cds-pad-xs:calc(.25rem…)` … `--cds-pad-xl:calc(1.25rem…)` |
| gap xs / sm / md / lg / xl | 6 / 8 / 12 / 20 / 32 (8/12/16/28/40) | `--cds-gap-xs:calc(.375rem…)` … `--cds-gap-xl:calc(2rem…)` |
| Tailwind `--spacing` | 4 | `--spacing:.25rem` (so `min-h-6.5`=26, `gap-2.5`=10, `py-1.25`=5) |
| caption | 11/17 (12/17) | `--cds-font-size-caption:calc(.6875rem…)`, `--cds-leading-caption:calc(1.0625rem…)` |
| footnote | 12/15 (13/17); 12/16 with `data-font=system` | `--cds-font-size-footnote:calc(.75rem…)`, `--cds-leading-footnote:calc(.9375rem…)` |
| code | 12/17 (13/19), mono | `--cds-font-size-code:calc(.75rem…)`, `--cds-leading-code:calc(1.0625rem…)` |
| body | 13/19 (14/20) | `--cds-font-size-body:calc(.8125rem…)`, `--cds-leading-body:calc(1.1875rem…)` |
| heading / title | 14/18, 20/25 (15/20, 22/28) | `--cds-font-size-heading`, `--cds-font-size-title` |
| weights | 400 / 500 / 580 / 600 | `--cds-font-weight-regular/medium/semibold/bold` |
| mono family | `"SF Mono", ui-monospace, Menlo, Consolas, monospace` (after `--font-anthropic-mono`) | `--cds-font-mono` |

**Radius ladder:** `rounded` = `--cds-radius` 6 (8); `rounded-card` = radius + 4 = **10**
(`calc(var(--cds-radius) + calc(.25rem…))`); `--cds-panel-radius` 10 (12); `rounded-lg` 8; `rounded-sm` 4;
`rounded-chip` = h-control-nested/4 = 4.5; `rounded-[3px]` on tree/caret hit targets; `rounded-full` meters.
Density "steps" 1–5 also exist (`.cds-root [data-step="1".."5"]`, radius 5/6/7/8/10, h-control 20/24/28/32/40).

**Colour tokens** (light / dark): text-primary `#0b0b0b` (gray-900) / `#f0efec` (gray-50);
text-secondary `#52514e` (gray-600) / `#c3c2b7` (gray-200); text-muted `#898781` / `#898781` (gray-400);
`text-muted-as-secondary` = `var(--muted-as-secondary, var(--cds-text-muted))` (no CSS sets the variable;
falls back to muted). Alpha ramp `--cds-alpha-1/2/3` = 5 / 10 / 20 % of `#0b0b0b` (light) or `#fff` (dark);
`--cds-border` = alpha-2. Fills: ghost-hover alpha-1 (dark 7.5 %), ghost-selected alpha-2 (dark 15 %),
fill-control alpha-2. Surfaces: surface-0 (page) `#f9f9f7` / `#0b0b0b`; surface-1 `#fcfcfb` / `#151515`;
surface-2 `#fff` / `#1a1a19`; surface-3 `#fff` / `#20201f`. Git: added `#1e9e3c` / `#32d74b`, removed
`#cd2054` / `#ff2c56`. Icon sizes (`Ro`, shared-frame): xs 12, sm 16, md 20, lg 24, xl 28, xxl 32; `size:"auto"` →
sm in compact, md in comfortable.

## Column, panes and splits

| Item | Value | Source |
|---|---|---|
| Tile layout (flag off) | gap 12, padding 8, minTileBasePx 100, minTileWidthPx 280, dragLift 24 | `Tb={gap:12,padding:8,minTileBasePx:100,minTileWidthPx:280,dragLift:24}` (shared-18) |
| Tile layout (panels, lined) | gap 1, padding 0, border 0, `divider:"line"` | `Nb(e)…{...Tb,gap:1,padding:0,borderPx:0,divider:"line"}` |
| Pane surface (flag off) | radius 10, bg surface-2, 1px ring `--cds-border` + shadow-sm; dark adds `outline-1 outline-alpha-2` | `th="rounded-[calc(0.625rem*…)] bg-surface-2 shadow-panel-sm …"`, `eh="dark:shadow-sm dark:not-forced-colors:outline … outline-alpha-2"` |
| Session rail (in chat) | width 280; gutter 24; edge 13 | `Sx=280`, `--session-rail-w:17.5rem`, `--session-rail-gutter,24px`, `--session-rail-edge,13px` |
| Rail card stack | gap **10**, 1px padding (so rings aren't clipped) | `kx="flex flex-col gap-2.5 p-px …"` |
| Split handle | 12px hit band centred on the seam (−6px); pill 3px thick, max 48px long, `rounded-full`; resting opacity 0 → 1 on hover after 200 ms (muted), secondary while dragging; focus = accent | `"h-3 cursor-row-resize"`, `_m…top-[calc(-6px…)]`, `vm={…horizontal:"h-[3px] w-full max-w-12…",resting:"text-muted opacity-[var(--cds-resize-pill-force,0)] delay-200…"}` (shared-9) |
| Split keyboard / drag | arrow step 8, shift-arrow 32, drag threshold 3px | `mm=3,hm=8,gm=32` |
| Scrollbars | `scrollbar-width:thin` everywhere; colour `hsla(var(--border-300)/35%)`; some lists `[scrollbar-gutter:stable_both-edges]` | `*{…scrollbar-width:thin}`, `html,[data-theme]{scrollbar-color:…}` |
| Scroll-edge fade | 28px | `--cds-scroll-fade-size:28px` (which panes use it: not found) |

## Pane header and the icon bar

| Item | Value | Source |
|---|---|---|
| Header (flag off) | height **32**, padding-inline 4, `gap-sm` (8) between title and actions | `fh="relative flex items-center justify-between gap-sm h-[calc(2rem*…)] ps-[4px] pe-[4px] shrink-0"` |
| Bordered header variant (`hh`, next to `data-diff-view-header`) | height 40, padding 8, `border-b border-alpha-2` | `hh="… h-[calc(2.5rem*…)] ps-[8px] pe-[8px] … border-b border-alpha-2"` |
| Title | body 13/19, regular, **text-secondary**, truncate, ps 4 | `vh="text-body font-normal font-control text-secondary select-none truncate ps-[4px]"` |
| Title (panels) | ps 12 (`ps-md` in comfortable scope) or 9px on pointer devices | `uh="ps-md not-touch:ps-[calc(0.5625rem*…)]"` |
| Actions cluster | gap **2** between icon buttons | `xh="relative z-[1] flex items-center gap-0.5 shrink-0 draggable-none"` |
| Panels header | wrapped in `density:"comfortable"`; toolbar pad-block 4 | `m(Ce,{density:"comfortable",…})` (shared-18 `Bb`); `--cds-toolbar-pad-block:calc(.25rem…)` |
| Panel header (generic Panel) | pad 4/4, hairline divider `--cds-ring-hairline` (1px, 0.5px at 2x) in `--cds-border` | `Rm="relative px-[var(--cds-panel-header-pad-inline)] py-[var(--cds-panel-header-pad-block)] after:…border-b…"` |
| Icon button | ghost, **24×24** (`aspect-square w-control`), radius 6, icon 16 (auto) | `Tu=U("… rounded h-control … text-body…",{…iconOnly:{true:"aspect-square w-control px-0"}})` |
| Button states | hover `bg-fill-ghost-hover`; pressed/selected plate `bg-fill-ghost-selected` + text-primary; press squish scale .975 | `ju…ghost:"bg-transparent group-hover/btn:bg-fill-ghost-hover"`, `Zc="group-aria-pressed/btn:bg-fill-ghost-selected…"`, `--cds-btn-press-sx:.975` |
| Accent-pressed variant | `bg-accent` plate (`--cds-bg-accent` = accent-100), ghost text `aria-pressed:text-accent` | `Xc="group-aria-pressed/btn:bg-accent…"`; ghost `"text-primary … aria-pressed:text-accent"` |
| Pane icons | preview Play (Globe for browser), artifact Artifacts, diff ChangesPlusMinus, terminal CommandLinePrompt, file Folder, tasks AgentsSimple, plan Checklist, runs Clock, pr GitPullRequest | `wn={preview:"Play",…}` (c26fb8b6b); `icon:e==="preview"&&T?"Globe":Is[e]` |
| Overflow (kebab) | `DotsVertical`, ghost icon-only, text-secondary | `L_=Or("DotsVertical")`, `p=Un("text-secondary")` (c73f45bc3) |
| Divider after the first icon in the bar | not found | — |

## Session-info cards (rail card, `xx` in c73f45bc3)

| Part | Value | Source |
|---|---|---|
| Card | radius **10**, 1px ring `--cds-border` (no fill change), padding-block **8** | `"group/railcard flex shrink-0 flex-col py-md"` + `Ox="rounded-card shadow-card-ring"` |
| Card inline padding | 8 on header and body | `ys` = `sB="px-md"` applied to header row and panel |
| Title row | min-height **26**, `gap-xs` 6 | `"group/railtop relative flex min-h-6.5 min-w-0 items-center gap-xs"` |
| Title trigger | footnote **12/15 medium**, text-primary, px 4, gap 4 → title text sits 12 from card edge | `"flex min-h-6.5 w-full min-w-0 items-center gap-1 px-xs text-footnote-medium text-primary"` |
| Disclosure chevron | `CaretRight` xs **12**, muted, after the title; rotate 90 when open | `i(V,{name:"CaretRight",size:"xs",rotate:g,className:"text-muted-as-secondary"})` |
| Collapsed summary ("1 connected") | footnote regular, muted, `ms-auto`, ps 6, truncates; `invisible` while open | `gx="ms-auto min-w-0 truncate ps-sm text-footnote font-normal text-muted-as-secondary"`, `W=P&&"invisible"` |
| Menu-open title plate | `bg-alpha-1`, radius 6 | `"flex min-w-0 flex-1 rounded group-data-[rail-menu-open]/railtop:bg-alpha-1"` |
| Reorder grip | 80-wide hover zone at end, 20px box | `vx="absolute inset-y-0 end-0 w-20 cursor-grab…"`, `bx="flex size-5 …"` |
| Body clip | overflow clip with 6px clip margin | `.epitaxy-rail-panel{overflow-clip-margin:6px;overflow:clip}` |
| Panels flag rows | every `min-h-6.5` row forced to `--list-row-h` (fallback h-control 24), row gap 2 | `_h=[…"[&_.min-h-6\.5]:min-h-[var(--list-row-h,var(--cds-h-control))]"…]`, `"[&_.flex-col.outline-none]:gap-0.5"` |

**Rows inside cards** (c227f4d5e exports):

| Row | Value | Source |
|---|---|---|
| Plain row | min-h **26**, px 4, gap 8, body 13 | `pB="flex min-h-6.5 w-full min-w-0 items-center gap-sm px-xs text-body"` |
| Key–value row | same with gap 12; label `text-secondary`, value `ms-auto … justify-end gap-1` | `lB="… gap-md px-xs text-body"`, `mV` |
| Pressable row | + radius 6, hover `fill-ghost-hover`, active `alpha-2`, focus ring | `hB="rounded … focus-visible:shadow-focus"`, `gB="hover:bg-fill-ghost-hover active:bg-alpha-2 …"` |
| Row icon box | **20×20** box, icon sm **16**, text-secondary | `HB="flex size-5 shrink-0 items-center justify-center text-secondary"`, `UB… n="sm"` |
| Environment rows | button h 26, text starts at **32** (icon box absolute at ps 4) | `"[&>button]:h-6.5 … [&>button]:ps-8 [&>button]:pe-xs"`, `"pointer-events-none absolute inset-y-0 start-0 flex items-center ps-xs"` |
| Trailing "Worktree" | footnote, text-secondary, ps 6, gap 8; changed state `text-accent` | `JB … "flex shrink-0 items-center gap-sm ps-sm text-footnote text-secondary"` |
| Folder "area · ~/Desktop" | name primary; " · " and path muted; path `min-w-[8ch] shrink-[9999]` so the path truncates first (head-first path truncation keeps the tail) | `BB`, `RB="flex min-w-[8ch] shrink-[9999] text-muted-as-secondary"`, path component `c784da984` |
| Text overflow | end ellipsis + tooltip only when overflowing | `OverflowTooltip`: `"block min-w-0 overflow-x-clip text-ellipsis whitespace-nowrap"` |
| Branch middle ellipsis ("ia-br…orm") | not found | — |
| Outputs row | pressable row; title primary truncate; trailing type label footnote muted, `max-w-[45%]` | `bB`, `"min-w-0 flex-1 truncate text-start text-primary"`, `"max-w-[45%] shrink-0 truncate text-footnote text-muted-as-secondary"` |
| Connectors row | favicon 16 in the 20 box; status trailing footnote muted, warning `text-warning` | `s(Co,{size:16,…})` in `vm`; `"shrink-0 text-footnote text-muted-as-secondary"` |
| Changes stats | `+n` `text-git-added`, `−n` `text-git-removed`, `tabular-nums` | `Qe … d="text-git-added", f="text-git-removed", e("tabular-nums",c)` (c60636ac6) |
| PR row kebab, checks dot "0/1" | not found (only the `{done}/{total}` string, shared-8) | — |
| Switch (Remote Control) | 16 × 28.8, padding 2, knob 12, track alpha-3 (dark alpha-2) | `NA="h-[var(--cds-switch-h)] w-[calc(var(--cds-switch-h,1.25rem)*1.8)] p-[2px]"`, `--cds-switch-h:calc(1rem…)` |

## Context card (c2d611398, rail layout)

| Part | Value | Source |
|---|---|---|
| Head block | column, gap 4, px 4, pt 4, pb 6 | `"flex flex-col gap-1 px-xs pt-1 pb-1.5"` |
| "11% used" + "109.6k / 1M" | baseline row, gap 8, justify-between; % in body 13 primary tabular; count footnote muted tabular, truncates | `Be: "flex min-w-0 items-baseline justify-between gap-sm text-body"`, `"shrink-0 text-primary tabular-nums"`, `"min-w-0 truncate text-footnote text-muted-as-secondary tabular-nums"` |
| Stacked bar | `size:"sm"` → **4px** tall, track `rounded-full`, track tint `hsl(gray-400 / 15%)` | `f="sm"`; `thickness:t==="lg"?28:t==="sm"\|\|t==="xs"?4:8`; `De=E?"flex":"rounded-full"`; `--cds-chart-reference-tint` |
| Segments | 1px seam between segments; inner corners min(4, h/4)=1, outer corners h/2=2; min 1px | `let a=Math.min(4,n/4)…seam:i,radiusStart:i===0?n/2:a`; `e*t-i>=1` |
| Segment colours | categorical palette (light: blue-450, orange-350, aqua-350, yellow-250, magenta-300, green-500, violet-500, red-400); which category gets which: not found | `--cds-chart-categorical-1..8` |
| Legend block | gap 6, pb 6 | `o="flex flex-col gap-1.5 pb-1.5"` |
| Legend row | min-h **24** (pressable) or 20, px 4, gap 8, footnote 12 | `X="flex min-h-6 … gap-sm px-xs text-footnote"`, `le="flex min-h-5 …"` |
| Swatch | 10×10, radius 2, in a 12-wide slot | `{width:10,height:10,borderRadius:2}`, `de="flex w-3 shrink-0 items-center justify-center"` |
| Label | text-secondary (Free space: muted), truncate; pressable labels **dotted underline**, offset 2, solid on hover | `"min-w-0 flex-1 truncate "+m`, `ue="underline decoration-dotted underline-offset-2 group-hover/press:decoration-solid"` |
| Token column | muted, tabular, shrink-0 (right-aligned by flex) | `"shrink-0 tabular-nums text-muted-as-secondary"` |
| % column | fixed **44px**, `text-end`, tabular, primary (free space muted) | `fe="w-11 shrink-0 text-end tabular-nums"` |
| Disclosure rows ("MCP tools 207") | min-h 24, radius 6, px 4, gap 8, hover `alpha-2`; caret xs 12 muted in 12 slot; label secondary; count in the 44 column, `text-muted` | `Q.rail.toggle="flex min-h-6 w-full … gap-sm rounded px-xs … hover:bg-alpha-2"`, `count:fe+" text-muted"` |
| Long lists | scroll at >12 rows, max-h 240 (pressable: 292) | `scroll:"max-h-60 overflow-y-auto"`, `pressScroll:"… max-h-73 …"` |

## Background tasks pane (cccc2cf0a)

| Part | Value | Source |
|---|---|---|
| Scroller | `overflow-y-auto`, `scroll-py-2.5`, stable gutter both edges | `Se="h-full overflow-y-auto scroll-py-2.5 [scrollbar-gutter:stable_both-edges] outline-none"` |
| Content | padding **10**, gap **16** between groups, min-width 220 (panels: pe 6) | `Ce="flex flex-col gap-[16px] px-2.5 py-2.5 min-w-[220px]"` |
| Group label ("Running") | footnote 12, muted, `h3` | `u("h3",{className:"text-footnote text-muted-as-secondary",…})` |
| Collapsible group ("Finished 11") | button gap 4, radius 3, hover text-secondary; count after label (panels: count `text-muted`); caret xs 12 rotated 90 when open | `"flex items-center gap-1 … rounded-[3px] hover:text-secondary"`, `rotate:z?0:90` |
| Rows list | gap 4 (none under panels) | `R("flex flex-col",!P&&"gap-1")` |
| Task row head | min-h 26, gap 12; lead slot 24 wide; meta line footnote muted, `gap-x-sm`, wraps baseline | `YM="flex min-h-6.5 min-w-0 items-center gap-md"`, `GM="flex w-6 shrink-0 …"`, `XM="… gap-x-sm … text-footnote text-muted-as-secondary"` |
| Stop button | sits at row end, reserved end padding 24+4 | `KM="pe-[calc(--spacing(6)+var(--cds-pad-xs))]"`, `"absolute end-0 … h-6.5"` |
| Row chevron | `CaretRight` xs 12, muted, shown on hover/focus only | `"text-muted-as-secondary opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 …"` |
| Expanded body | gap 6, px 4, pt 2, pb 8, selectable | `"flex flex-col gap-xs px-xs pt-0.5 pb-md select-text"` |
| Code box | radius **8**, code 12/17 mono, max-height **200**, own vertical scroll | `DM="rounded-lg text-code max-h-[200px] overflow-y-auto …"` |
| Command | card px 8, py 4, radius 8, `overflow-clip`; `$ ` prompt (PowerShell `>`) select-none text-secondary; syntax-highlighted, wraps (`overflow:"wrap"`); bg `light-dark(--code-theme-*-bg, alpha-1)`; with Claude code themes a 1px `--cds-border` outline | `"epitaxy-diff epitaxy-code-card rounded-lg flex overflow-clip px-md py-xs"`, `_=n==="powershell"?">":"$"`, `S=y("var(--cds-alpha-1)")`, `--epitaxy-card-outline:0 0 0 1px var(--cds-border)` |
| Output block | bg **alpha-2**, px 8, py 5, text-primary, `whitespace-pre-wrap break-all`, auto-scrolls to bottom | `OM=DM+" bg-alpha-2 px-md py-1.25 text-primary"` |
| Fade at the code clip | not found (container scrolls; generic fade size 28 above) | — |
| Status text ("No output yet") | footnote 12, muted | `"text-footnote text-muted-as-secondary"` |
| Empty state | centred, gap 12, padding 12; icon lg shown at 28, muted; title body primary max 36ch; body footnote muted | `r="flex h-full flex-col items-center justify-center gap-md px-lg py-lg text-center"`, `i="!size-7 text-muted-as-secondary"`, `o="max-w-[36ch] … text-body text-primary"` |

## Files pane (cccc2cf0a, c621b1e2d)

| Part | Value | Source |
|---|---|---|
| Filter bar | height **32**, px 8 | `Dn="flex h-8 shrink-0 items-center px-md"` |
| Filter field | search icon sm 16 in a 16 slot; clearable; placeholder "Filter, or ? to search in files"; field height/radius (input `vs` in shared-frame): not resolved | `slotStart:…"grid size-4 shrink-0 place-items-center"…name:"Search",size:"sm"` |
| Tree container | px 4, py 5, `overflow-y-auto`, `contain:strict` | `n="px-xs py-1.25"`, `"flex-1 min-h-0 overflow-y-auto … [contain:strict]"` |
| Row height | **24** compact / 32 comfortable (scaled by root font /16) | `cw={compact:24,comfortable:32}`, row `h-control app-list-row` |
| Row | radius 6, body 13, gap 6, pe 8 | `FC=U("… gap-xs compact:px-2 … rounded text-body…")`, `f="flex items-center gap-1 h-control app-list-row pe-md rounded text-body…"` |
| Indent | padding-start **8 + depth × step**; step = half caret + 4 = **10** (caret xs 12) or 12 under panels (caret sm 16) | `n=8,r=4`, `a(){return e[i()].px/2}`, `s(){return a()+r}`, `h(e){return{paddingInlineStart:n+e*s()}}` |
| Indent guides | 1px `--cds-border` lines every step, first at x = 8 + half caret (14); shown on tree hover/focus (else only "kept" guides); toggle "Indent guides" | `v(e)…repeating-linear-gradient(…, var(--cds-border) 0 1px, transparent 1px ${t}px)`, `"--file-tree-guides-x":${o()}px`, `group-hover/file-tree:bg-(image:--file-tree-guides)` |
| Chevron / folder icon | `CaretRight` (expandable) or `Folder`, size xs 12 (panels sm 16), muted; rotate 90 open | `Te=we?"CaretRight":"Folder"`, `size:$c()`, `i(){return t("panels")?"sm":"xs"}` |
| Icon–label gap | 4 | `pw="flex flex-1 min-w-0 items-baseline gap-1 …"` |
| States | hover `fill-ghost-hover`; current file `bg-fill-control` (alpha-2); multi-selected `fill-ghost-selected` | `p="bg-alpha-0 text-primary hover:bg-fill-ghost-hover…"`, `m="bg-fill-control hover:bg-fill-control text-primary"`, `fw="bg-fill-ghost-selected…"` |
| File-type icons | coloured 16-box SVGs (xs 12 / sm 16 / md 20 / xl 28) behind gate `__gb__2954460583`; otherwise mono Icon, `text-muted-control`; per-type colours: not found (icon data) | `I={xs:12,sm:16,md:20,xl:28}`, `F="__gb__2954460583"` (c280f9bbb) |
| Label colour | primary; dimmed when matches elsewhere `text-secondary`; parent path footnote muted | `Ke=H?te?"text-secondary":"text-primary":"text-muted-as-secondary"` |
| "Go up" button | full-width ghost, px 8 (panels 6) | `"shrink-0 px-md"` / `"shrink-0 px-sm"` |
| Virtualisation | overscan 8, 5px scroll margin/padding | `uw=8`, `scrollMargin:5,scrollPaddingStart:5,scrollPaddingEnd:5` |

## Not found / not verified

Runtime state of the `panels` flag; the icon-bar divider; pane collapse-to-header and the "expand"
button's exact action (header has a layout menu with Fill/Tile, `Et`, and pop-out `WindowNew`);
how the right column divides height between panes beyond the 100px `minTileBasePx`; branch middle
truncation; PR-row kebab and checks dot; filter input height/radius; a fade on clipped code;
context category → colour mapping; file-type icon colours.
