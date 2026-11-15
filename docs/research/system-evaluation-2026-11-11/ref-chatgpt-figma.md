# ChatGPT and Figma in fine detail, against Area (2026-11-11)

Finding prefix **RF**. Read-only. Nothing was launched; no user data was read.

## 1. Scope and method

| Product | Version | What was read | Where |
|---|---|---|---|
| Figma desktop | 126.9.13 (`Info.plist`) | `Contents/Resources/app.asar` → `desktop_shell.css` (584 KB, Figma's own design system "FPL", `@layer fpl`), `desktop_shell.js` (floating-ui config). The editor UI loads from figma.com and is not on disk; the shell holds the tab bar, menus, dialogs, tooltips, buttons, inputs, checkbox, switch and the full token set (`:root`, `[data-preferred-theme=dark][data-editor-theme=design]`) | extracted to `scratchpad/bundles2/figma/` with a 30-line asar reader (no packages) |
| Figma editor (rendered) | captured 2026-09-28 | `docs/research/captures/inspector/figma--{design-panel-frame,padding-row,opacity-radius-row}--rest--light.json` and `menu/figma--*`, `baseline/figma--*` | the system's baseline captures |
| ChatGPT desktop | 26.1023.51421 | `Contents/Resources/app.asar` → `webview/assets/*.css` (383 files); the token sheet `app-shared-398c891a59df.css`, component sheets (`Button-*`, `SegmentedControl-*`, `SelectControl-*`, `tooltip-*`, `app-primary-*`, `app-initial-*`, `es-5c5c6535635b.css`) and JS for timings | `scratchpad/bundles2/chatgpt/` |

Values are **declared** (read from CSS/JS) unless marked **rendered** (from a capture JSON). Rem is 16px in both.
Lengths written `Npx`. Where a token chain resolves through several variables, the resolved value is given with the
chain in the evidence column. The earlier sweep (`components-audit-2026-11-07/chat-apps.md`) listed which components
exist; this pass does not repeat it.

Not verifiable from disk: Figma's editor inspector CSS (only rendered captures exist), Figma tooltip open delay
(the editor sets it, not the shell), Figma's number-field scrub sensitivity.

---

## 2. Figma (FPL, UI3)

Evidence file for every row: `Figma.app/Contents/Resources/app.asar:desktop_shell.css` unless stated.

### 2.1 Spacing scale and jobs

`--spacer-0:0; -1:.25rem(4); -2:.5rem(8); -2-5:.75rem(12); -3:1rem(16); -4:1.5rem(24); -5:2rem(32); -6:2.5rem(40)`;
aliases `--spacer-4px … --spacer-40px`. Seven steps, no 2, 6, 10, 20.

| Job | Step | Evidence |
|---|---|---|
| Icon → label inside a button | 4 (and the icon is pulled out by −4 so a 24 icon box reads as 4 gap: `.button__md .button__icon{margin-left:calc(var(--spacer-1)*-1)}`) | `.button__md__fgTCf .button__icon__OodK0`, `.button__shortcut{padding-left:var(--spacer-1)}` |
| Button side padding | md 8, lg 12 | `.button__md{--btn-padding:0 var(--spacer-2)}`, `.button__lg{--btn-padding:0 var(--spacer-2-5)}` |
| Sibling buttons, dialog footer | 8 | `._1ymwlhzw{gap:var(--spacer-2)}` |
| Label → field (form) | md 4 (row bottom 8), lg 8 (row bottom 24) | `.form__md{gap:var(--spacer-1);margin-bottom:var(--spacer-2)}`, `.form__lg{gap:var(--spacer-2);margin-bottom:var(--spacer-4)}` |
| Helper icon → text | 4 | `.form__helper{gap:var(--spacer-1)}` |
| Menu item text inset | 8 outer + 8 inner = text 16 from the menu edge; group titles `padding:0 16` so they align with item text | `.menu__item{padding:0 var(--spacer-2)}`, `.menu__itemText{padding:4 8}`, `.menu__title{padding:0 var(--spacer-3)}` |
| Menu block padding | 8 top/bottom, 0 sides | `.menu__container{padding:var(--spacer-2) 0}` |
| Menu separator | 7 + 1 + 7 (15 block) | `--menu-separator-gap:.4375rem`, `.menu__group+*{margin-top;padding-top;border-top}`; FPL v2 menu `.hhiezw12{margin:8 0}` (17 block) |
| Menu trail (shortcut) | 16 before it | `.menu__trail{padding-left:var(--spacer-3)}` |
| Dialog body | 8 / 16 | `._1ymwlhzq{padding:var(--spacer-2) var(--spacer-3)}` |
| Dialog header / footer | min-height 40; header title margin 12 / 0 / 12 / 8 + 8 header padding = title at 16; footer `0 8 0 16` | `._1ymwlhzf{min-height:2.5rem;padding-left:8}`, `._1ymwlhzg`, `._1ymwlhzv{padding:0 8px 0 16px}` |
| Inspector row (rendered) | row `padding:0 8 0 16`, `column-gap:8`, columns `88 88 24` in a 240 panel; section title row 40; section bottom 12 | `captures/inspector/figma--padding-row…json` node 0; `figma--design-panel-frame…json` `rows--ui3OneInputOneIconRow` |
| Tooltip | 4 / 8 (4 when it leads with an icon) | `._1f9yud14{padding:var(--spacer-1) var(--spacer-2)}`, `._1f9yud13{padding-left:4}` |
| Scroll edge fade | 32 mask | `._1ymwlhzl … mask-image:linear-gradient(to right,…,black 32px,black calc(100% - 32px),…)` |

Rule visible in the scale: **inset 16 on the left, 8 on the right** for every panel row, dialog header, dialog footer
and inspector row: the start edge aligns text, the end edge aligns 24 icon buttons whose glyph sits 4–5 inside.

### 2.2 Control geometry

| Control | Height | Inline padding | Icon | Radius | Type | Evidence |
|---|---|---|---|---|---|---|
| Button md | 24 | 8 | 24 box, −4 margin | 5 (`--radius-medium:.3125rem`) | 11/16, 450, +0.055px | `.button__md`, `.button__button{font: --text-body-medium}` |
| Button lg | 32 | 12 | 24 box, −4 | 5 | 11/16 450 | `.button__lg` |
| Link button | 16 | 0; hit plate `inset:-4 -8` as `::before` | — | 5 | 11/16 | `.button__link:before{inset:calc(var(--spacer-1)*-1) calc(var(--spacer-2)*-1)}` |
| Icon button | 24 (lg 32 with 4 padding) | 0 | 24 box (16 when `--icon-button-icon-size:1rem`) | 5, or full | — | `.icon-button__iconButton{--icon-button-size:1.5rem;--icon-button-icon-size:1.5rem}`, `.icon-button__largeSize{--icon-button-size:2rem;padding:0 4}` |
| Toggle (pressed) button | 24 / 32 | 0 | 24 | 5 | — | `.toggle-button__toggleButton`, `__sizeLg` |
| Text input | `var(--height)` (24 in panels) | 4 / 8; leading/trailing slot removes the adjacent padding (`:not(:first-child){padding-left:0}`) | — | 5 | 11/16 450 | `.textarea__textarea`, `.textarea__root .textarea__textarea:not(:first-child)` |
| Text input "Alt" (bordered) | — | 4 / 7 (8 − the 1 inset ring) | — | 5 | 11/16 | `.textarea__textareaAlt{padding:var(--spacer-1) calc(var(--spacer-2) - 1px)}` |
| Menu row | min 24 | 8 (+8 menu inset) | lead pulled −4 vertically; 4 after | 5 inside a 13 menu | 11/16 400 | `.menu__itemText{min-height:1.5rem;border-radius:var(--radius-medium)}`, `.menu__lead{margin:-4 0;margin-right:4}` |
| Menu group title | 24 | 16 | — | — | 11/16 in secondary ink | `.menu__title{height:1.5rem;color:var(--color-text-secondary)}` |
| Checkbox | 16 box, 4 margin block (24 line) | — | check stroke drawn with `stroke-dasharray:12` | 2 (`--radius-small`) | — | `.manually-labeled-checkbox__root{--fpl-checkbox-size:1rem;margin:var(--spacer-1) 0}` |
| Switch | track = root minus `inset:.25rem 0` (24 root → 16 track); knob 12 × 8 rest | — | knob x 4 → 16 | full | — | `.manually-labeled-switch__visuals{inset:.25rem 0}`, `--fpl-switch-knob-w:.75rem; -h:.5rem; -x:.25rem` → `:checked{--fpl-switch-knob-x:1rem}` |
| Tab bar (window) | 38 + 1px bottom rule (translucent) | — | new-tab 24 square, radius 5, 7 margin | 5 | — | `.tab_bar--container{height:38px;border-bottom:solid 1px var(--color-bordertranslucent)}`, `.tab_bar--newTabButtonUI3` |
| Avatar | 24 | — | — | full | 12/24 upper | `.avatar--avatar---CoVE` |
| Inspector field (rendered) | 24 inside a 32 row | 24 leading icon/label slot (scrub handle), text at 24 | 12–14 glyph in a 24 box | 5 | 11/16 450, label 9/14 500 +0.27px at 50% black | `captures/inspector/figma--padding-row…json` nodes 5–14 |
| Segmented (rendered) | 24, 1px gap between segments | — | 24 | 5 | — | `figma--design-panel-frame…json` `segmented_button--root{column-gap:1px}` |

Every Figma control box is 16, 24 or 32; nothing is 20, 28 or 36.

### 2.3 Type

| Role | Size/line | Weight | Tracking | Evidence |
|---|---|---|---|---|
| body-small | 9/14 | 450 (strong 500) | +0.045px (strong +0.27px) | `--text-body-small-*` |
| body-medium (all controls) | 11/16 | 450; strong 550 | +0.055px | `--text-body-medium-*`, `:root{--font-weight-default:450;--font-weight-strong:550}` |
| body-large | 13/22 | 450; strong 550 | −0.032px | `--text-body-large-*` |
| heading-small | 13/22 strong | 550 | −0.032px | `--text-heading-small-*` |
| heading-medium | 15/25 strong | 550 | −0.075px | `--text-heading-medium-*` |
| heading-large | 24/32 strong | 550 | −0.408px | `--text-heading-large-*` |
| display | 48/56 Whyte 400 | — | −1.44px | `--text-display-*` |
| mono | 9/14, 11/16, 12/22 Roboto Mono 400 | — | as body | `--text-mono-*` |

- **Weights are in-between steps, 450 and 550** (Inter variable), one weight pair for the whole UI; the same weight in
  light and dark. Only Korean swaps to 400 / 500 (`html[lang=ko-kr]{--font-weight-default:400;--font-weight-strong:500}`),
  a per-script weight correction.
- **Tracking is per size**, positive below 12, negative from 13 up; it is never a global letter-spacing.
- **Size steps are rare inside a panel**: one 11/16 body; a section title is the same 11/16 at 550 (rendered
  `rows--ui3OneInputOneIconRow{font-weight:550}`), not a larger size. Labels above fields drop to 9/14 500 at 50%
  ink. Hierarchy is weight and ink first, size last.
- Ink ladder (light → dark): text `black-800 #000000e5` (90%) → `white-1000 #fff`; secondary `black-500 #00000080`
  (50%) → `white-500 #ffffffb2` (70%); tertiary/disabled `black-400 #0000004d` (30%) → `white-400 #fff6` (40%).
  Dark's secondary and tertiary are **stronger** alphas than light's (70 vs 50, 40 vs 30) to hold contrast on #2c2c2c.
- Icon ink uses the same three alphas as text (`--color-icon:black-800`, `-secondary:black-500`, `-tertiary:black-400`),
  separately named so a button's pressed state can drop the icon one step (`.button__primary:active{--btn-icon:var(--btn-icon-secondary)}`).

### 2.4 Shape, edges, shadows

- Radius scale: `--radius-none:0; -small:.125rem(2); -medium:.3125rem(5); -large:.8125rem(13); -full:9999px`.
  Assignment: 2 checkboxes; 5 every control, menu row, tooltip, input; 13 menus, dialogs, popovers.
  **Nesting**: a 5 row inside a 13 menu with 8 inset gives 13 − 8 = 5, exactly concentric.
- Borders: 1px everywhere (`.0625rem`), translucent black 10% (`--color-bordertranslucent:black-200`), strong 20%
  (`black-300`) for checkbox and slider tracks; opaque `grey-200 #e6e6e6` for rules inside surfaces. Secondary buttons
  draw the edge as `outline … outline-offset:-1px` so it takes no layout space (`.button__secondary`).
- Fields use **no border at rest**: fill `bg-secondary #f5f5f5`, the 1px outline appears on hover
  (`--outline: var(--outline-color)` → `#e6e6e6`) and turns blue `#0d99ff` on focus (`.textarea__textarea:hover`,
  `:focus-within`).
- Elevation recipes (light; dark adds inset white hairlines):

| Token | Light | Dark | Used by |
|---|---|---|---|
| 100 | `0 1px 3px #00000026, 0 0 .5px #0000004d` | `0 1px 3px #0006, inset 0 0 .5px #ffffff4d, inset 0 .5px 0 #ffffff1a, 0 0 .5px #00000080` | small raised |
| 200 | `0 1px 3px #0000001a, 0 3px 8px #0000001a, 0 0 .5px #0000002e` | `0 1px 3px #00000080, inset 0 0 .5px #ffffff4d, 0 3px 8px #00000059, inset 0 .5px 0 #ffffff14` | cards |
| 300 | `0 1px 3px #0000001a, 0 5px 12px #00000021, 0 0 .5px #00000026` | `… 0 5px 12px #00000059 …` | tooltips (`._1f9yud11`) |
| 400 | `0 2px 5px #00000026, 0 10px 16px #0000001f, 0 0 .5px #0000001f` | `0 2px 5px #00000059, inset 0 0 .5px #ffffff59, 0 10px 16px #00000059, inset 0 .5px 0 #ffffff14` | menus, popovers, dialogs (`--fpl-dialog-elevation`) |
| 500 | `0 2px 5px #00000026, 0 10px 24px #0000002e, 0 0 .5px #00000014` | `0 3px 5px #00000059, inset 0 0 .5px #ffffff59, 0 10px 24px #00000073, inset 0 .5px 0 #ffffff14` | modal dialogs, a menu that overlaps its trigger (`[data-fpl-menu-overlap]`) |

  Every recipe is three layers: a short contact shadow, a long soft one and a **0.5px ring** at 8–30% black that stands
  in for a border. In dark the ring becomes an **inset 0.5px white at 35%** plus a **top-only inset 0.5px white 8%**
  (a lit top edge). Popover arrows get the same layers as `drop-shadow` filters (`._1ymwlhz6`).
- Layer separation: surfaces float on shadow alone (no border on menus, dialogs, tooltips); regions inside a surface are
  split by **inset box-shadow rules** `inset 0 -1px var(--color-border)` (dialog header) and `inset 0 1px` (footer), so the
  rule never changes the box size.

### 2.5 State paint

| Element | Hover | Pressed | Focus | Selected | Disabled |
|---|---|---|---|---|---|
| Ghost / secondary button, icon button | `black-100` 5% (`--color-bg-transparent-hover`); dark `white-100` 5% | `black-200` 10% | 1px `#0d99ff` outline, **offset 1px** (`[data-show-focus]:focus-visible`) | — | ink → `black-400` 30%; edge → `grey-200` |
| Primary button | `blue-500 #0d99ff` → `blue-600 #007be5` | `blue-700 #0768cf`, **label and icon drop to their secondary ink** | as above | — | fill `grey-300 #d9d9d9`, ink white |
| Highlighted (toggle) icon button | 5% | 10% | 1px blue offset 1 | fill `blue-200 #e5f4ff`, icon `blue-600`; hover `blue-100 #f2f9ff` (lighter!) | — |
| Menu row | **full brand fill** `#0d99ff`, text white (`.menu__item:is(:focus,:hover) .menu__itemText{background:var(--color-bg-brand)}`) | — | same as hover (keyboard and pointer share one highlight) | check mark slot | 30% ink |
| Text input | 1px `#e6e6e6` outline appears | — | 1px `#0d99ff` outline (inset −1, no ring outside) | — | fill → `bg` white, outline stays |
| Checkbox | fill `grey-100` → `grey-200` | `grey-300`-ish (`bg-secondary-pressed`) | 1px blue outline offset 1 | brand fill + 10% translucent edge, edge 20% on hover | transparent, `grey-200` edge |
| Switch | track `bg-secondary-hover` | `-pressed` | 1px `blue-600` (`border-selected-strong`) offset 1 | brand; knob gets a 1px 10% black outline (`--color-controliconoutline`) | transparent + grey edge |
| Window tab | text secondary → text, icon → brand | — | 2px blue outline offset −2 | — | — |

- Focus rings are **1px, offset 1px**, the brand blue, on every control except window chrome (2px, inset). Never a
  halo or a 2–3px ring.
- `[data-fpl-group]:hover` paints the ghost child's hover when the **whole row** is hovered
  (`:where([data-fpl-group]:hover) .button__ghost`), so row actions light with the row.
- Selection is a scope: `[data-fpl-selected=true]` remaps `--color-bg`, `-text`, `-icon`, `-border` to their
  `on-selected` twins, so every child repaints without per-component rules.

### 2.6 Motion

| Token / use | Value | Evidence |
|---|---|---|
| Durations | `--duration-sm:.1s; -md:.2s; -lg:.4s` | `:root` |
| Curve | `--transition-curve:cubic-bezier(.645,.045,.355,1)` (ease-in-out-cubic); button `cubic-bezier(.65,0,.35,1)` | `:root`, `.button__button` |
| Colour changes | `color .1s, background-color .1s` (no curve on tabs) | `.tab--tab`, `.tab_bar--newTabButtonUI3` |
| Switch knob | `all .1s ease-out`; track `background .1s ease-in-out-cubic` | `.manually-labeled-switch__visuals:after` |
| Checkbox | check stroke draws in (`stroke-dashoffset 12 → 0`, .1s) only after a change (`.__changed`) | `@keyframes manually-labeled-checkbox__stroke-animate-in` |
| Button loading | label slides up 4 and fades (.2s), spinner rises from below with .1s delay | `@keyframes button__btn-text-fade-out`, `button__spinner-fade-in` |
| Tab enter / leave | rises 24 → 0 with fade; leave 80% of the run | `@keyframes tab_bar--tabEnter`, `--tabLeave` |
| Menus, dialogs, tooltips | **no enter or exit animation** in the shell CSS (no keyframes for `.menu__*`, `._1ymwlhz2`, `._1f9yud11`) | absence verified by `grep @keyframes` |
| Tab indicator | `left 70ms ease-out, width 70ms ease-out` | `transition:left 70ms ease-out,width 70ms ease-out` |

### 2.7 Behaviour

- Hover cards / tooltips on hover: `delay:{open:500,close:0}`, safe-polygon `buffer:1`, `blockPointerEvents` (`desktop_shell.js`, `lS(S,{enabled:l,move:!1,delay:{open:500,close:0},handleClose:av({requireIntent:!1,blockPointerEvents:!0,buffer:1})})`).
- Submenus: `delay:{open:1}` with a safe polygon `buffer:8` (`aa([lS(N,{enabled:_,delay:{open:1},handleClose:av({blockPointerEvents:!0,buffer:8})})`).
- Overlay offsets: popover default `offset:8` (`function ay({…offset:i=8,arrowPadding:u=0…})`); menus `offset:4` (`i_({...e,offset:4})`); a select menu that opens over its trigger keeps `minItemsVisible:4`, `referenceOverflowThreshold:20` and gets elevation 500 (`[data-fpl-menu-overlap]`).
- Scroll edge fades: a 32px mask on the scrolling axis, removed on the end the content touches (`data-fpl-scroll-x=start|end|none`), animated `.1s linear` through two `@property <color>` stops.
- Focus is shown only for keyboard (`[data-show-focus]` + `:focus-visible`); `:not([data-show-focus]){outline-width:0}`.
- Inspector (rendered, `captures/inspector/*`): 240 panel; rows on a grid `88 88 24` with `column-gap:8`; a row is 32
  tall around a 24 control; labelled rows are 18 (9/14 label + 4 top margin) + 32; the field's leading 24 slot is the
  scrub handle (cursor change, label or icon in 50% ink); fields have no border, `#f5f5f5` fill; section title row 40
  (11/16 550); section bottom padding 12. Mixed values: the slider declares `[data-mixed]` states
  (`._1byqy9f6[data-mixed]`); the editor's "Mixed" text is not on disk.

### 2.8 Composition

| Part | Value | Evidence |
|---|---|---|
| Window tab bar | 38 + 1 rule | `.tab_bar--container` |
| Dialog | radius 13, elevation 500 (400 non-modal), max-height 80vh, header 40, body 8/16, footer 40 | `._1ymwlhz2`, `._1ymwlhzf`, `._1ymwlhzq`, `._1ymwlhzv` |
| Menu | min 80 wide, radius 13, 8 block padding, rows 24, dark (`grey-900 #1e1e1e`) by default with `grey-700` rules; light menu `bg` + `grey-200` rules | `.menu__container`, `.menu__dark`, `.menu__light` |
| Tooltip | `grey-900`, radius 5, elevation 300, 4/8 padding, white 11/16 | `._1f9yud11`, `._1f9yud14` |
| Inspector | panel 240; section = title row 40 + rows of 32 + 12 after | rendered captures |

---

## 3. ChatGPT desktop (26.1023, the Codex-based client)

The shipped bundle is one webview with three token layers: the **Apps SDK UI** layer
(`:where(:root),:where([data-theme])`: `--gray-*`, `--color-*`, `--control-*`, `--menu-*`, `--tooltip-*`; this is the
published `openai/apps-sdk-ui` token set, so no network fetch was needed), the **app** layer (`:root`,
`--app-color-*`, `--padding-row-*`, `--height-token-*`) and **window-type overrides**
(`[data-codex-window-type=electron|browser|extension]`). Values below are for the desktop window (`electron`) unless a
row says `browser` (the chatgpt.com-like window, closest to the web captures in BASELINE). File for every row:
`ChatGPT.app/Contents/Resources/app.asar:webview/assets/app-shared-398c891a59df.css` unless named.

### 3.1 Spacing

`--spacing:.25rem` and everything is `calc(var(--spacing) * n)` with **quarter steps allowed**: 1.25 (5), 1.5 (6),
2.5 (10), 3.75 (15), 4.5 (18), 5.5 (22). The scale is a 4px grid with 1–2px optical exceptions, not a fixed list.

| Job | Value | Evidence |
|---|---|---|
| Icon → label in a button | 3 (3xs), 4 (2xs–sm), 6 (md and up) | `--button-gap-sm:3px; -md:4px; -lg:6px`; `Button-26a9ec0e398b.css` `[data-size=…]{--button-gap:…}` |
| Icon optical pull | the first/last icon of a labelled button moves **−1px** (−2px from 2xl) toward the edge | `:where(._Button svg…:first-child:not(:only-child)){margin-left:var(--button-icon-offset,-1px)}` |
| Button side padding (gutter) | 6 / 8 / 10 / 12 / 14 / 16 by size, ×1.33 for pills | `--control-gutter-2xs:.375rem … -xl:1rem`, `--control-gutter-pill-scaling:1.33` |
| Menu gutter (surface padding) | 4 (electron), 6 (SDK default), 8 (browser) | `--menu-gutter` per window type |
| Menu item padding | 5 / 8 (electron); 8 / 12 (SDK); 10 / 12 (browser) | `--menu-item-padding` |
| Menu item gap (icon → label) | 6 | `--menu-item-gap:calc(var(--spacing)*1.5)` |
| Menu separator | 1px, margin 4 / 8 (electron, inset to the text); SDK `6 / −6` (bleeds through the gutter to the surface edge) | `--menu-separator-gutter` |
| Sidebar row | height 30, inline 8, label inset = row height (text starts at 30: the icon sits centred in a square the row's height) | `.sidebar-navigation{--height-token-nav-row:30px;--padding-row-x:8px}`, `--sidebar-row-label-inset:var(--height-token-row)` |
| Child row indent | `(row + 16 icon)/2 + 1` = 24 | `--sidebar-child-icon-indent:calc((var(--height-token-row) + var(--icon-leading-size))/2 + var(--spacing)/4)` |
| Row padding block | 4 (`:root`), 5 (electron body) | `--padding-row-y` |
| Panel padding | 12 (`:root`), 20 (electron body); half of it for tight panels | `--padding-panel-base`, `--padding-panel:calc(var(--padding-panel-base)/2)` |
| Panel header inset | radius of the panel − radius of a toolbar button (so the button is concentric with the panel corner) | `--spacing-panel-header-inset:calc(var(--radius-2xl) - var(--radius-button-toolbar))` |
| Toolbar | height 46, padding 16 | `--height-toolbar:46px`, `--padding-toolbar:calc(var(--spacing)*4)` |
| Titlebar | 44 | `--height-titlebar:calc(var(--spacing)*11)` |
| Composer | input padding 0 12 (electron), 15 / 18 / 16 (browser); gutter 12; inline overhang 24 past the thread column | `--padding-composer-input`, `--composer-gutter`, `--composer-inline-overhang` |
| Thread column | 48rem (768) max | `[…electron] body{--thread-content-max-width:48rem}` |
| Modal outer margin | 20 | `--modal-container-inner-padding:calc(var(--spacing)*5)` |
| Switch → label | 8 | `--switch-label-gap` |

### 3.2 Control geometry

Control heights: `--control-size-4xs 20, 3xs 22, 2xs 24, xs 26, sm 28, md 32, lg 36, xl 40, 2xl 44, 3xl 48`;
icons `xs 14, sm 16, md 18, lg 20, xl 22, 2xl 24`; radius `--control-radius-sm` (radius-sm 6) for ≤ sm, `-md`
(radius-md 8, electron 8 × 1.25 = 10 rendered as a squircle) for md/lg, `-lg` 10 (×1.25) for xl, `-xl` 12 for 2xl+.

| Size | Height | Gutter | Font | Icon | Gap | Radius |
|---|---|---|---|---|---|---|
| 3xs | 22 | 6 | sm (12) | 14 | 3 | sm |
| 2xs | 24 | 8 | sm | 16 | 4 | sm |
| xs | 26 | 8 | md (13 electron / 14) | 16 | 4 | sm |
| sm | 28 | 10 | md | 18 | 4 | sm |
| md | 32 | 12 | md | 18 | 6 | md |
| lg | 36 | 12 | md | 18 | 6 | md |
| xl | 40 | 14 | md | 18 | 6 | lg |
| 2xl | 44 | 14 | lg (14 / 16) | 20 | 6 | xl |
| 3xl | 48 | 16 | lg | 20 | 6 | xl |

Evidence: `Button-26a9ec0e398b.css` `._Button_r3d2l_1:where([data-size=…])`. Notes:
- **Icon-only** (`data-uniform`): gutter 0, width = height (`[data-uniform]{--button-gutter:0;width:var(--button-size)}`).
- **Optical alignment** (`data-optically-align=start|end`): a ghost button at a column edge is pulled out by its own
  gutter (×1.33 when pill), or for icon-only by `(size − icon)/2`, so its **glyph** aligns with text above it.
- Line-height 1 on the button; the label is centred by flex, not by line box.
- Segmented: track = control size, track padding 2 (`--segmented-control-gutter:2px`), option radius = track
  radius − 2, thumb shadow `0 1px 4px -1px #0003`, track `gray-100 #ededed` / dark `gray-0 #0d0d0d`; option ink
  secondary.
- Switch: 32 × 19 track, thumb offset 3 → 13 thumb, thumb shadow `0 1px 2px #0003`; off track `gray-150 #dfdfdf`,
  hover `gray-200`; on `gray-900 #181818` light / `blue-400 #0285ff` dark (`--switch-*`).
- Tooltip: 13/18 (electron) at weight 430, tracking −0.15px, padding 5 / 12 (sm 4 / 8, lg 8 / 16), radius
  `radius-2xl × 1.25` = 20, max-width 300 (`--tooltip-*`, `Tooltip-282fa92a9623.js` `maxWidth:o=300`).
- Menu row (electron): 13 / ~18.6 text + 5 + 5 ≈ 29; radius `--radius-xl` 12 × 1.25 = 15 inside a 20 menu with a 4
  gutter (SDK rule `--menu-item-radius:calc(var(--menu-radius) - var(--menu-gutter))`, so concentric). Descriptive menu
  rows ≥ 44, gutter 6, radius 20 (`[data-variant=descriptive]`).
- Composer: min-height 44, editor line 20, radius `--radius-4xl` 24 × 1.25 = 30 (squircle), browser 28; surface
  `elevated-secondary`; shadow `0 0 0 1px #0000000a, 0 2px 8px #0000000a, 0 4px 80px 8px #00000006`
  (`--elevation-composer`); token buttons 28 (browser 36); placeholder at 50% (`--opacity-composer-placeholder:.5`).
- Message row height token 36 (`--height-token-message`); settings row 64 (`--height-token-settings-row:4rem`).

### 3.3 Type

| Token | Electron | SDK default | Evidence |
|---|---|---|---|
| `--text-base` (UI body, `--font-ui-size`) | 14 / 21 (1.5) | 14 | `:root{--text-base:14px;--text-base--line-height:calc(1.5/1)}` |
| `--text-sm` (menus, tooltips, controls md) | **13** / 18.6 | 12 | `[data-codex-window-type=electron]{--text-sm:13px}` |
| `--text-xs` | 12 / 16 | 11 | same |
| `--font-text-sm` (SDK) | 14 / 20 | | `--font-text-sm-size:.875rem;-line-height:1.25rem` |
| `--font-text-xs` | 12 / 18 | | |
| `--font-text-md` | 16 / 24 | | |
| `--font-text-lg` | 18 / 28–29 | | |
| Headings (SDK) | xs 16/24, sm 18/26, md 20/26, lg 24/28, xl 32/38 (−0.025em), 2xl 36/42 … all 600 | | `--font-heading-*` |
| Small caps | 11/15 600 +0.65px; 13/19 600 +0.6px | | `--font-small-caps-*` |
| Chat (composer, messages) | 13 by default, relaxed leading 1.625 | | `--codex-chat-font-size:var(…,13px)`, `--leading-relaxed:1.625` |

- **UI weight 430** in the desktop window (`[…electron]{--font-ui-weight:430}`), 400 elsewhere; medium 500,
  semibold 600 (590 in one catalogue surface). The same "a little above regular" idea as Figma's 450.
- Tracking: `--tracking-wide:.025em` on xs and below (2xs, 3xs, xs carry `tracking-wide`), `-.025em` from heading xl up,
  tooltips −0.15px. Small text opens up, large text closes.
- **Ink ladder** (app layer, `:where(:root:not([…extension]))`): text `#1a1c1f` light / `gray-fixed-150 #dfdfdf` dark;
  secondary = text at **70%**, tertiary = text at **50%** (dark: white at 70 / 50); icons primary = text (dark white
  90%), secondary 70%, tertiary 50%. Dark primary text is **#dfdfdf, not white**.
- SDK layer ladder: `#282828` / `#5d5d5d` / `#8f8f8f` light; `#dcdcdc` / `#afafaf` / `#8f8f8f` dark (`--color-text*`
  → `--gray-750/500/400`, dark `--gray-850/700/600`). The rendered web captures (BASELINE: rgb 13 / 93 / 143) match this
  ladder's secondary and tertiary.
- Size steps vs ink steps: rows, menus and tooltips use **one size** (`--text-sm`) and move hierarchy with ink
  (secondary 70%, tertiary 50%) and weight 430 → 500; size steps appear only at headings.

### 3.4 Shape, edges, shadows

- Radius bases: `2xs/xs 2, sm 6, md 8, lg 10, xl 12, 2xl 16, 3xl 20, 4xl 24`, each × `--corner-radius-scale`
  (= `--codex-corner-radius-scale` **1.25** when `corner-shape: superellipse(1.5)` is supported, else 1). The 1.25
  compensates for a squircle reading smaller than a circle arc of the same radius. Browser window: bases one step
  tighter (`lg .5rem, md .375rem, sm .25rem`) and scale 1, round corners.
- Concentric rule written as tokens: `--menu-item-radius = menu-radius − menu-gutter`,
  `--segmented-control-option-radius = radius − gutter`, `--spacing-panel-header-inset = radius-2xl − radius-button-toolbar`.
- Borders (app layer): `--app-color-border` text at **8%** (dark white 8%), `-light` 5% (dark 4%), `-heavy` 12%
  (dark 16%). SDK layer: border 10% / dark 12%, subtle 5 / 6, strong 15 / 20. Hairline: `.5px` where supported
  (`--hairline:.5px`, fallback 1px), colour `#0000001a` light, `#ffffff1f` dark.
- Elevation geometry (fixed) × alpha per theme: `100: 0 1px 2px -1px`, `200: 0 2px 4px -1px`,
  `300: 0 4px 8px -2px`, `400: 0 8px 16px -4px`; alpha light .08 / .08 / .10 / .12, dark .20 / .20 / .36 / .30;
  `-strong` ×1.25, `-stronger` ×1.6 (`--shadow-100…400`). The negative spread keeps the shadow under the box.
- Menu: `0 0 0 .5px var(--color-border), 0 8px 16px -4px #0000001f`; dark adds `inset 0 0 0 .5px border-subtle`;
  background `elevated-secondary` at 90% with `backdrop-filter: blur(16px)` (`--menu-box-shadow`, `--menu-background-color`,
  `--menu-backdrop-filter`; `app-primary-*.css` `._MenuList_1yz8g_2`).
- Tooltip: solid primary (`gray-900`) light / `elevated-secondary` dark, edge = its text colour at 5%,
  shadow `0 8px 18px #0f172a33` (`--tooltip-*`).
- Modal: radius `--radius-2xl` (16 × 1.25), max-width 450, shadow on a fade backdrop
  `0 8px 16px #00000012, 0 2px 6px #0000000d, 0 0 0 1px border` (dark `0 8px 16px #00000059, 0 2px 8px #0003, inset 0 0 0 1px border-subtle`);
  backdrop `#0000004d` light / `#00000080` dark, or a 1px blur over `#f2f2f280` (`app-initial-*.css` `._Modal_t8pih_2`).
- Card `0 4px 16px #0000000d`; popover `--shadow-lg 0 4px 8px -2px #0000001a`; mode toggle selected `--shadow-md`.

### 3.5 State paint

| Element | Hover | Pressed | Focus | Selected / open | Disabled |
|---|---|---|---|---|---|
| Ghost button | plate `alpha-08` (dark 12) fades in (opacity 0 → 1, .15s ease); `--scale` is unset until the first press, so the plate does not scale on hover | plate `alpha-12` (dark 16), plate **and focus ring** scale to `--scale` | 2px `--color-ring` (blue-500 `#0169cc` / dark blue-400 `#0285ff`), offset −1 (inside) | plate at 60% when `aria-expanded`, 100% when `data-selected` | bg `alpha-05`, ink `gray-400` |
| Solid primary | `gray-900 → gray-700` | `gray-600`, scale | 2px ring, offset 2 | hover paint | |
| Soft | `alpha-08 → alpha-12` (dark 12 → 16) | `alpha-16` (dark 20), scale | 2px offset 2 | hover paint | |
| Outline | border → hover border, fill hover | scale | offset −1 | | |
| Menu item | plate `alpha-08`/dark `alpha-10` (electron: ghost-hover), opacity 0 → 1 and scale .98 → 1 in 150ms `cubic-enter` | plate shrinks back to .98 | keyboard highlight = hover (`[data-highlighted]`) | open submenu keeps plate | opacity .5, no plate |
| Row with inline actions | plate drops to 40% while the pointer is on the row's own action (`:has(._ItemActions:hover):before{opacity:.4}`) | | | | |
| Settings row | the rules above and below a hovered row turn transparent (`settings-rows-*.css`) | | | | |
| Select / input | — | — | 2px ring offset 2 (outline variant −1) | | |

- **Press scale is computed per element width** (`app-shared-e9f258fd3588.js`, `Sve`): width ≤ 80 → .96, ≤ 150 → .97,
  ≤ 220 → .98, ≤ 600 → .985, > 600 → .995, × `pressableScaleMultiplier:1`, written to `--scale` on pointer-down, off
  under `prefers-reduced-motion`. Small things press visibly, wide things barely.
- Foreground does not change on hover for ghost (`--color-text-primary-ghost` = hover ink).

### 3.6 Motion

| Token / use | Value | Evidence |
|---|---|---|
| Durations | basic .15s, moderate .2s, relaxed .3s | `--transition-duration-*` |
| Curves | enter `cubic-bezier(.19,1,.22,1)` (expo-out), exit `(.8,0,.4,1)`, exit-snappy `(.65,0,.4,1)`, move `(.65,0,.35,1)`, enter-snappy `(.23,1,.32,1)`, spring-snappy as a 20-stop `linear()` | `--cubic-*`, `--ease-*` |
| Default | `.15s cubic-bezier(.4,0,.2,1)` | `--default-transition-*` |
| Menu enter / exit | opacity 0 → 1, scale .95 → 1, **150ms enter**; exit to .95 in **100ms exit curve**; origin = Radix transform origin | `._Menu_1yz8g_2[data-entering-active] ._MenuList` |
| Tooltip | scale .95 → 1 + fade, 250ms enter curve; exit to .97, 250ms | `Tooltip-dd1402a3bc02.css` `@keyframes _scale-in`, `_scale-out` |
| Modal | panel rises 20px + fades, **600ms** enter curve; exit 300ms exit curve; backdrop 600 / 400 | `._Modal_t8pih_2{--modal-out-y:20px;--modal-enter-duration:.6s;--modal-exit-duration:.3s}` |
| Button loader | label fades out .3s; spinner fades in .15s after a .1s delay; label returns .15s after .1s | `._ButtonInner_r3d2l_4`, `._ButtonLoader_r3d2l_802` |
| Tooltip trigger underline | dotted underline fades in on open (enter curve), out with exit curve, .2s | `._TriggerDecorator_453y_87` |
| Spinner | 0.8s linear, conic mask | `._LoadingIndicator_tmmik_1` |

### 3.7 Behaviour

- Tooltip: `openDelay:150`, `sideOffset:5`, `maxWidth:300`, `gutterSize:'md'`, not hoverable unless `interactive`,
  `preventUnintentionalClickToClose` (`Tooltip-282fa92a9623.js`).
- Popover `collisionPadding:15` (`popover-1778f5988cda.js`).
- Menus are Radix (typeahead and roving focus from Radix); max-height bounded by available height; min-width 300
  (`--menu-min-width,300px`).
- Sidebar header fades content scrolling under it over 16px (`--sidebar-scroll-header-fade-distance:calc(var(--spacing)*4)`).
- Row actions take no width until the row is hovered (`--sidebar-row-action-width:0 → 20`, `--sidebar-row-action-opacity`).

---

## 4. Area at shipped defaults

Defaults: type 13 (`axes/type-size.ts:127`), density 32 (level 0, `axes/density.ts:36`), radius 10
(`--area-radius-factor:.3125`, `axes/radius.ts:48`), motion 210 (`axes/motion.ts:69`), easing Subtle, elevation 8,
feedback Subtle, Selection Neutral. Values were **resolved by hand** from `packages/tokens/dist/css/tokens.css` (built
2026-11-11 01:03) and the formulas in `packages/tokens/src/emit/base.ts:457-549`; they are **derived**, not rendered (the
Electron app belongs to another session and was not touched; the app itself runs Compact, where every height is 4 less).
Key resolutions at type 13 / level 0: `ui-dense` = round((16 − 8/7·13)/4, .5) = 0.5, `ui-gap-step` = 0;
`control-xs/sm/md/lg/xl` = 22 / 26 / 30 / 38 / 46; `ui-row` 30; `gap-row` 10; `inset-surface-sm/md` 10 / 14;
`radius-control-sm/md/lg` 8 / 8 / 10; `radius-container` 16; `radius-list-row` 10; `radius-list` 14; text 11/14, 12/16,
13/18, 15/22; inks (oklch floors in `--area-layer-*`, converted) light `fg-default` #282828, `fg-muted` #666666,
`fg-disabled` #a4a4a4; dark #eeeeee, #c5c5c5, #666666; dark page L 0.0847 ≈ #020202.

## 5. Side by side: the 40 most telling values

D = declared in CSS/JS, R = rendered capture, Dv = derived by hand from declared formulas.

| # | Value | Figma | ChatGPT desktop | Area default | Note |
|---|---|---|---|---|---|
| 1 | Spacing scale | 0 4 8 12 16 24 32 40 (D) | 4px × n, quarter steps (5, 6, 10, 15, 18, 22) (D) | 0 2 4 6 8 10 12 16 20 24 32 40 48 64 80 96 (D) | Area's is the widest |
| 2 | Medium control height | 24 (lg 32) (D) | md 32, lg 36 (D) | md 30 (Dv) | Area sits between ladders |
| 3 | Button side padding, label only | 8 at 24, 12 at 32 (D) | 12 at 32/36, ×1.33 for pills (D) | 9 at 30: (h − 1cap)/2 − 1 (Dv, `inset.css:21`) | Area derives it; refs pick it |
| 4 | Side padding with a leading icon | icon box pulled −4: 4 to a 24 box (D) | gutter 12, icon nudged −1 (D) | (30 − 16)/2 − 1 = 6 (Dv) | Area tightest |
| 5 | Icon → label | 4 (+ the 24 box's own air) (D) | 3 / 4 / 6 by size (D) | 6 (`gap-md`, Dv) | match ChatGPT md |
| 6 | Control icon | 16 glyph in 24 box (D) | 18 at md (D) | 16 (`type-icon`, D) | |
| 7 | Button radius md | 5 (D) | 8 → 10 squircle (D) | 8 (Dv) | |
| 8 | Button label weight | 450 all variants (D) | `--button-font-weight` (set in JS; web R: soft/ghost 400) | 500 all variants (D, `button.css:31`) | Area louder on quiet buttons |
| 9 | UI body | 11/16 (D) | 13/18.6 menus, 14/21 base (D) | 13/18 (D) | |
| 10 | Regular weight | **450** (D) | **430** (D) | 400 (`--area-weight-regular`, D) | both refs sit above 400 |
| 11 | Strong weight | 550 (D) | 500 (D) | 500 (D) | |
| 12 | Small-text tracking | +0.055px at 11, +0.27px at 9 strong (D) | +0.025em at ≤ 12 (D) | +0.0075em at 11 (0.08px) (D) | Area has the rule, refs stronger at 9–12 |
| 13 | Heading tracking | −0.075px at 15, −0.41px at 24 (D) | −0.025em from 32 (D) | 0em at 15 (D) | |
| 14 | Ink 1 light | black 90% ≈ #1a1a1a (D) | #1a1c1f (D) | #282828 (Dv) | Area lightest |
| 15 | Ink 2 light | black 50% (#808080 on white) (D) | ink 1 at 70% (≈ #5f6062) (D) | #666666 (Dv) | |
| 16 | Ink 3 light | black 30% (#b3b3b3) (D) | ink 1 at 50% (≈ #8c8d8f) (D) | none: `fg-secondary`/`-tertiary` alias the accent; `fg-disabled` #a4a4a4 | **Area has two text rungs** |
| 17 | Ink 1 dark | #fff (D) | #dfdfdf (D) | #eeeeee (Dv) | |
| 18 | Ink 2 dark | white 70% (D) | white 70% (D) | #c5c5c5 (≈ 76%) (Dv) | |
| 19 | Dark page / panel | #2c2c2c panel, #1e1e1e menu (D) | #181818 surface, #000 under (D) | ≈ #020202 page (Dv) | Area darkest (owner's preference) |
| 20 | Hover wash light | 5% black (D) | 5% (app), 8% (SDK ghost) (D) | 5% of #141414 (D); menus/rows opaque #f3 | match |
| 21 | Pressed wash light | 10% (D) | 12% ghost, 16% soft (D) | 12.5% (D) | match |
| 22 | Hover wash dark | 5% white (D) | 8% (app), 12% (SDK) (D) | **14% white** (D, `base.ts:257`) | Area 2–3× stronger |
| 23 | Menu row | 24, radius 5 (D) | ≈ 29 (13 + 5 + 5), radius 15 squircle (D) | 30, radius 10 (Dv) | |
| 24 | Menu padding | 8 block, 0 inline; rows add 8 (D) | 4 (D) | 4 + 1px border (D) | |
| 25 | Menu radius | 13 (D) | 20 (16 × 1.25) (D) | 14 (Dv) | all concentric |
| 26 | Menu text from surface edge | 16 (D) | 12 (D) | 14 (4 + 1 + 9) (Dv) | |
| 27 | Menu icon → label (visible glyph gap; label column from the surface edge) | 4 after a 24 box = 8 visible; label at 44 (D) | 6; label at 34 (D) | 10 (`gap-row`, `inset.css:100`); label at 39 (4 + 1 + 8 + 16 + 10) (Dv) | Area's visible gap widest, column between |
| 28 | Menu separator block | 7 / 1 / 7 (D) | 4 / 1 / 4 electron, 6 / 1 / 6 SDK (D) | 5 / 1 / 5 + 1px row gaps (Dv) | |
| 29 | Menu shadow | 0 2 5 15%, 0 10 16 12%, 0 0 .5 12%; no border (D) | .5px ring + 0 8 16 −4 12% + blur 16 on 90% fill (D) | 1px border + 0 0 2 4% + 0 8 16 8% (Dv) | Area alone draws a full 1px border |
| 30 | Menu enter / exit | none (D) | 150ms (.19,1,.22,1) / 100ms (.8,0,.4,1), scale .95 (D) | 210ms / 140ms ease-out, scale .97 (D) | Area slower in, no exit curve |
| 31 | Item plate motion | none (D) | fades and scales .98 → 1, shrinks on press (D) | lands in 91ms, fades out 140 (D) | |
| 32 | Tooltip | #1e1e1e, 11/16, 4/8, r5, elev-300 (D) | 13/18 430 −0.15px, 5/12, r20, 0 8 18 20% (D) | inverse, 13/18 400, 4/9, r10, half-elevation shadow (Dv) | |
| 33 | Tooltip open delay | 500 (hover popovers; editor tooltips not on disk) (D) | **150** (D) | 500, skip window 300, close 0 (D, `Overlays.tsx:26-28`) | |
| 34 | Overlay offsets | menu 4, popover 8 (D) | tooltip 5, popover collision 15 (D) | menu 4, popover 8, tooltip 4, padding 8 (D) | match Figma |
| 35 | Focus ring | 1px blue, offset 1 (D) | 2px blue, offset 2 (solid) / −1 (ghost, outline) (D) | 2px, offset 0, neutral-solid at Selection Neutral (D) | |
| 36 | Field at rest | fill #f5f5f5, no edge; edge on hover (D) | outline variant: 1px border; soft: alpha fill (D) | surface fill + 1px control edge (D) | |
| 37 | Checkbox | 16, radius 2 (D) | — | 14 (`type-box`) (D) | |
| 38 | Switch | 24 root → 16 track, knob 12 × 8 (D) | 32 × 19, thumb 13, shadow 0 1 2 20% (D) | 30 × 18, thumb 14 (Dv) | |
| 39 | Durations | 100 / 200 / 400 (D) | 150 / 200 / 300 (D) | 140 / 210 / 280 / 350 (D) | |
| 40 | Press give | — | by width: .96 ≤ 80 … .995 > 600 (D) | by class: .96 sm, .97 md, .975 lg, .985 wide (D) | equivalent |
| 41 | Dialog | r13, header 40, body 8/16, footer 40, no border (D) | r16×1.25, max 450, rises 20px in 600ms (D) | r16, 15 + 1 padding, 480, scale .97 in 280 (D) | |
| 42 | Nav child indent | — | 24 (D) | 26 (16 + `gap-row`) (D) | |

---

## 6. Findings (most severe first)

**RF1 · inconsistency · Area has two text inks where both references have three.**
Figma: text / secondary / tertiary = black 90 / 50 / 30% (dark white 100 / 70 / 40%), with disabled = tertiary
(`desktop_shell.css :root{--color-text:var(--ramp-black-800);--color-text-secondary:var(--ramp-black-500);--color-text-tertiary:var(--ramp-black-400)}`).
ChatGPT: text, 70%, 50% (`--app-color-text-foreground-secondary/-tertiary`), SDK #282828 / #5d5d5d / #8f8f8f. Area:
`fg-default` #282828 and `fg-muted` #666666; `fg-placeholder` = muted; `fg-secondary` and `fg-tertiary` are **aliases of
the accent** (`tokens.css --area-fg-secondary:var(--area-fg-accent)`), a name collision with what every reference
means by secondary/tertiary ink; `fg-disabled` #a4a4a4 is a fixed hex outside the layer model. Consequences: a
placeholder reads as real secondary text, shortcut keys, timestamps, menu trailing text and "Empty" values have no
quieter rung, and the third rung's colour (disabled) does not move with the Neutral cast or ground. Families: Input,
Textarea, Select, Combobox, Menu (shortcut, description), Nav (trailing), Message (meta), Description list, Table, Empty
state, Kbd. Fix (rule): add one tertiary neutral ink in the Layers model (light ≈ 50% of ink 1, about #8f on white;
dark ≈ 50% white), used for placeholder, shortcut, timestamp, empty value and disabled text; held to 3:1 for non-text
and placeholder per CONTRAST.md (never for body text); rename the accent aliases so `secondary` / `tertiary` no longer
mean an accent. Visible change: placeholders and meta text step back one rung, dark disabled text tracks the ground.
Size M. Confidence high (declared values).

**RF2 · refinement · Dark hover wash is 2–3× the references'.** Area dark `bg-hover` white 14%, selected 19%, pressed
≈ 20.7% (`base.ts:148, 257-259`, `DARK_WASH.hover:0.07` × Hover step 2). Figma dark `--color-bg-transparent-hover`
white 5%, pressed 10%; ChatGPT app layer white 8% (`--app-color-background-button-secondary-hover`), tertiary 7%, SDK
ghost 12%. On Area's near-black page (#020202) a 14% white plate lands at about #262626, brighter against its ground
than any reference's plate against theirs. Families: every ghost Button, Menu, Nav, Tree view, Table row, Segmented,
Toolbar in dark. Fix: re-derive the dark wash so its contrast against the ground matches the light wash's (5% black on
white ≈ 1.1:1), which at #020202 is about 7–8% white; keep the ordering and the 22% cap (`DARK_WASH`), and re-run the
contrast tests on muted text over the plate (they gate it, so do not weaken them). Visible: dark hovers become a
gentler lift, selected stays a clear step above. Size S. Confidence medium-high (declared; perceptual claim
unverified in the app).

**RF3 · refinement · Regular text weight.** Both references set the UI's regular weight above 400: Figma 450 (strong
550), `:root{--font-weight-default:450;--font-weight-strong:550}`; ChatGPT desktop 430
(`[data-codex-window-type=electron]{--font-ui-weight:430}`), tooltips 430. Area: `--area-weight-regular:var(--area-wght-400)`,
strong 500, with Geist variable (WGHT_RAMP already has 450, `base.ts:54`). At 11–13px on light grounds a 400 face reads
thin next to 500 labels, which is one reason Area's Button weight 500 everywhere (`button.css:31`) reads loud beside 400
body. Fix: let the Typography setting's regular weight take 430–450 (keeping every option), judged in the app light and
dark; Figma also swaps weights per script (`html[lang=ko-kr]{--font-weight-default:400}`), a per-language hook worth
copying. Visible: body, menus, fields a touch firmer; the gap between regular and strong narrows from 100 to ~60. Size S.
Confidence medium (two products agree; the visual effect needs the owner's eye).

**RF4 · refinement · Overlay exits use the enter curve, and menus open slower than ChatGPT's.** Area overlays enter on
`duration-base` 210ms and leave on `fast` 140ms, both `ease-out` (`surface.css:1806-1828`; `docs/MOTION.md:55,92`).
ChatGPT: menu 150ms `cubic-enter (.19,1,.22,1)` in, **100ms `cubic-exit (.8,0,.4,1)`** out, scale .95
(`app-primary-*.css ._Menu_1yz8g_2[data-exiting-active]`); tooltip 250 / 250 with exit to .97; modal 600ms rise 20px in,
300 out on the exit curve. Figma's shell animates no menu, dialog or tooltip. An ease-out exit decelerates into
invisibility, so the last frames linger; an accelerating exit curve gets out of the way. Fix (rule): add an
`ease-exit` role (accelerating, ChatGPT's `(.8,0,.4,1)` or Area's own `ease-in`) for every anchored-surface and dialog
exit, and consider the menu's enter at `fast` rather than `base` (ChatGPT 150, Area 210). Families: Menu, Context menu,
Popover, Select picker, Combobox, Tooltip, Hover card, Dialog, Command palette, Drawer. Size S. Confidence high on the
values; the choice is the owner's (MOTION.md states the current rule).

**RF5 · opportunity · Menu row plate motion.** ChatGPT's highlighted row plate fades in **and grows from .98 to 1** in
150ms, and shrinks back to `--scale` while pressed (`._MenuItem_1yz8g_2:before{transform:scale(var(--scale,.98))}`;
`:is([data-highlighted]):before{opacity:1;transform:scale(1)}`). Area's plate lands in 91ms with no scale
(`surface.css:1316-1335`) and keyboard moves are instant (a good rule ChatGPT does not have). Fix: give the pointer
hover plate the same .98 → 1 grow on `hover-in` (none for keyboard), so pointer travel down a menu feels continuous;
the plate is a pseudo-element so the label never moves. Families: Menu, Context menu, List box, Command palette, Nav.
Size S. Confidence medium.

**RF6 · refinement · Tooltip timing and offset.** Area: open delay 500, skip window 300, close 0, offset 4
(`Overlays.tsx:19,26-28`). ChatGPT: open 150, offset 5, max-width 300, not hoverable unless interactive
(`Tooltip-282fa92a9623.js`). Figma's shell uses 500 for hover popovers (`delay:{open:500,close:0}`); its editor tooltip
delay is not on disk. 500 makes icon-only toolbars (the app's headers) feel unlabelled; ChatGPT's 150 plus Area's own
skip window would make scanning a toolbar read like a label strip. Fix: a shorter first delay for tooltips that name an
icon-only control (`describes={false}`), keeping 500 for descriptive tooltips. Size S. Confidence medium (one product).

**RF7 · refinement · Focus ring placement by variant.** ChatGPT places the 2px ring **outside** a filled control
(offset 2, `._Button:focus-visible:after{outline-offset:var(--button-ring-offset,2px)}`) and **inside** a ghost or
outline one (`[data-variant=ghost]{--button-ring-offset:-1px}`), and scales the ring with the press (`:active:after`).
Figma: 1px ring, offset 1, everywhere (`[data-show-focus]:focus-visible{outline:… solid 1px;outline-offset:1px}`).
Area: one placement per Focus ring setting (default hug: 2px, offset 0) for every variant (`button.css:184-188`).
Fix: within the chosen setting, let a ghost or plain control draw its ring inset by its own edge, so the ring never
overlaps a neighbour in a tight toolbar (24–30 controls 2–4 apart). Size S. Confidence medium.

**RF8 · refinement · Floating surfaces: a full 1px border versus a hairline ring.** Area menus, popovers and dialogs
draw `border: var(--area-border-width) solid var(--area-edge-floating)` (`surface.css:1109, 980`), so the edge takes
layout (menu inset 4 + 1). Figma draws no border: the edge is the shadow's `0 0 .5px` ring (`--elevation-400`), and in
dark an `inset 0 0 .5px #ffffff59` plus a top-only `inset 0 .5px 0 #ffffff14` lit edge. ChatGPT: `0 0 0 .5px` ring in the
shadow, dark adds `inset 0 0 0 .5px border-subtle`. Area has the Hairline stroke (`--area-device-pixel`) as a setting;
the default still paints a full CSS pixel at 2x. Fix: let the floating edge default to a device-pixel ring in the shadow
stack (layout-neutral), and adopt Figma's dark **top-lit inset** as the dark floating edge. Visible: crisper, lighter menu
edges at 2x; dark menus read as lit from above. Size M (radius-list and inset math counts the border). Confidence medium.

**RF9 · opportunity · Optical alignment of edge buttons as a prop.** ChatGPT: `data-optically-align=start|end` pulls a
button out by its own gutter (×1.33 for pills) or, icon-only, by `(size − icon)/2`, so its glyph sits on the text column
above it (`Button-26a9ec0e398b.css :where([data-optically-align=start])`). Area has `.area-button--start` /
`--end` doing the same for labelled buttons (`inset.css:328-329`); check that icon-only buttons pull by
`(size − icon)/2` rather than by a text inset, and that Panel bar and Dialog header actions use it. Size S.
Confidence medium (Area's icon-only path not traced).

**RF10 · refinement · Scroll edge fades still missing on Scroll area.** Figma masks the scrolling axis 32px at each
end that has more content, and animates the stops when an end is reached (`._1ymwlhzl[data-fpl-scroll-x=start] ._1ymwlhzo{--_1ymwlhz0:black}`
with `@property --_1ymwlhz0 <color>` and `transition-duration:var(--duration-sm)`); ChatGPT fades the sidebar under its
header over 16px. Area uses masks only in Nav, Tree view and Code (`grep mask-image`), not in Scroll area
(`scroll-area.css`). This was listed in chat-apps.md; Figma's two-`@property` recipe is the precise mechanism (no
script, transitionable per end). Size S–M. Confidence high.

**RF11 · refinement · Menu separator rhythm.** Figma 7 / 1 / 7 (15), ChatGPT desktop 4 / 1 / 4 (9) inset to the text,
SDK 6 / 1 / 6 bleeding to the surface edge; Area 5 / 1 / 5 plus the 1px row gaps either side, 8 in from both ends
(`surface.css:1491-1503`). Area's is between and consistent; the one gap is that Area's separator is inset 8 from the
surface while its text starts at 13–14, so the rule is neither text-aligned (ChatGPT electron) nor full-bleed (SDK).
Fix: align the separator's ends to the row plates' edges (4 from the surface, the plates' own inset) or to the text
column; pick one and apply it to Menu, Context menu, Select picker, Command palette. Size S. Confidence medium.

**RF12 · refinement · Small-text tracking is weaker than the references'.** Area 11px +0.0075em (0.08px), 12px +0.005em,
13px +0.0025em (`tokens.css --area-text-*-tracking`). Figma 9px +0.045px (strong +0.27px), 11px +0.055px, 13px −0.032px;
ChatGPT +0.025em at ≤ 12 (0.3px at 12). Figma also gives **strong small text more tracking than regular** (+0.27 vs
+0.045 at 9), a weight-dependent correction. Fix: let tracking depend on weight at the smallest sizes (badges, counts,
Kbd, section labels at 500–600 get +0.01–0.02em more). Size S. Confidence medium.

**RF13 · refinement · Inspector rows: Figma's 16 / 8 asymmetric inset and 9/14 field labels.** Rendered Figma inspector
rows are `padding:0 8 0 16`, grid `88 88 24` with gap 8 in a 240 panel; labels above fields 9/14 500 at 50% ink with
+0.27px; the field's leading 24 slot is the scrub handle; fields have no edge at rest (`captures/inspector/figma--padding-row--rest--light.json`).
Figma's shell repeats the 16 / 8 asymmetry for dialog headers and footers (`._1ymwlhzv{padding:0 8px 0 16px}`). Area's
panel inset is symmetric 14 (`panel.css:32`) and its smallest text is 11/14. Fix: a row rule "text edge 16, action edge 8"
for any row whose end holds a 24 icon button (the icon's glyph then sits 12–13 from the end, optically matching the 16
text start); and check Inspector field labels against 9–10px rather than 11. Size M. Confidence medium (rendered
evidence; Area inspector not re-measured).

**RF14 · opportunity · Selection as a scope.** Figma's `[data-fpl-selected=true]` remaps `--color-bg`, `--color-text`,
`--color-icon` and `--color-border` (and their secondary / tertiary) to on-selected twins, so every part inside a
selected row repaints without its own selected rule (`desktop_shell.css [data-fpl-selected=true],[data-fpl-selected=false]:hover,…`).
`[data-fpl-group]:hover` paints child ghost buttons as hovered when the whole row is hovered. Area writes selected paint
per component. Fix: a documented `data-selected` scope that re-points the ink roles (the existing selection roles are
the targets). Size M. Confidence medium.

**RF15 · refinement · Pressed solid button drops its label ink one step** (Figma `.button__primary:active{--btn-icon:var(--btn-icon-secondary);color:var(--btn-color-secondary)}`).
Area's pressed solid darkens the fill 18% (`button.css:46`) and gives 0.97, label fixed (AGENTS: foreground fixed on
hover; press is not hover). A dimmed label on press is a second, scale-free press cue that survives Feedback Off and
reduced motion. Size S. Confidence low-medium (taste).

**RF16 · refinement · Field at rest.** Figma's default field is borderless with a `#f5f5f5` fill, the 1px edge appears on
hover and turns blue on focus (`.textarea__textarea:hover{--outline:var(--outline-color)}`). Area's default Input is
outlined (`input-edge: edge-control`), with the soft variant borderless (`input-edge-soft`). Not a defect (Area
follows ChatGPT's outlined fields); note that Area's soft field shows **no** hover edge, where Figma's does, so a soft
field gives no hover feedback. Fix: soft fields take the control edge on hover. Size S. Confidence medium.

**RF17 · inconsistency · Menu icon-to-label gap differs from Button's.** Area menu rows use `gap-row` (10 at type 13) so
labels share a column with Nav (`inset.css:91-100`), while Button, Chip and Segmented use `gap-md` 6. ChatGPT uses 6 in
menus (`--menu-item-gap`), Figma 4 after a 24 box (8 visible). The column rule is deliberate (audit S11a); the
consequence is a 10px gap in a 30 row, the widest visible icon gap of the three. Fix: keep the label column but reach it
with the row's start inset rather than the gap (row inset 8 + icon 16 + gap 6 = 30, ChatGPT's sidebar label inset is
exactly the row height, `--sidebar-row-label-inset:var(--height-token-row)`), i.e. label at the row height. Size S.
Confidence medium.

**RF18 · opportunity · Squircle corners with radius compensation.** ChatGPT desktop draws controls, menus, tooltips and the
composer with `corner-shape: superellipse(1.5)` and multiplies every radius by 1.25 so the visible curve matches a round
corner (`@supports (corner-shape:superellipse(1.5)){:root{--codex-corner-radius-scale:1.25}}`). Listed in chat-apps.md;
the new detail is the compensation factor (1.25) and that tooltips go to 20 and menus to 20 under it. Size M.
Confidence high (declared).

**RF19 · refinement · Tooltip type.** ChatGPT tooltips: 13/18 at weight 430, tracking −0.15px, 5 / 12 padding, radius 20
(`--tooltip-*`); Figma 11/16 450, 4 / 8, radius 5. Area: 13/18 400, 4 / 9, radius 10. Area's tooltip is 26 tall (18 + 8)
against ChatGPT's 28; the type is the UI's. Fine as is; with RF3 it would take the regular weight change. No separate
fix. Size —. Confidence high.

**RF20 · opportunity · Size-aware press give is equivalent; keep.** ChatGPT computes the press scale from the element's
width at pointer-down (≤ 80 .96, ≤ 150 .97, ≤ 220 .98, ≤ 600 .985, > 600 .995; `app-shared-e9f258fd3588.js`); Area sets it
by class (sm .96, md .97, lg .975, wide .985; `axes/feedback.ts:32`). Area's misses one case: a wide non-full-width
control (a 400px Card-button) gives .97. Fix: optional; give `.area-button` without a size class the width rule via
container units, or leave. Size S. Confidence medium.

## 7. Already excellent (do not disturb)

- **Concentric corners as a formula.** Area's `radius-list-row` / `radius-list` derivation (`base.ts:546-548`) is the same
  rule ChatGPT writes as `--menu-item-radius: calc(var(--menu-radius) - var(--menu-gutter))` and Figma lands on by hand
  (13 − 8 = 5). Area's version also caps against pill and floors at 4.
- **Insets derived from the content box** (`inset.css:21-23`): Figma's 24 / 8 and ChatGPT's 32 / 12 both fall out of
  `(h − cap)/2`; Area is the only one of the three that states the rule rather than picking numbers.
- **Press give by size** matches ChatGPT's width-based give within 0.005 and is off for keys and reduced motion.
- **Tooltip skip window, pass-through name tooltips, the hover bridge** (`Overlays.tsx:214`, `surface.css:1835-1848`):
  neither reference's shipped CSS has all three.
- **Keyboard row highlight is instant while hover fades** (`surface.css:1336-1338`): ChatGPT animates the plate for keys too.
- **Overlay offsets** (menu 4, popover 8) equal Figma's exactly; overlay collision padding 8.
- **Light hover and pressed washes** (5% / 12.5%) equal both references.
- **Fixed spacing primitives, adaptive steps** (`base.ts:5-12`): same idea as ChatGPT's `--spacing × n`, with fewer
  half-pixel escapes.
- **Dark ink at #eeeeee rather than white** sits with ChatGPT's #dfdfdf against Figma's #fff: softer glare on near black.

## 8. Not verified

- Rendered Area values (all Area numbers are derived by hand from the built token file; the app runs Compact).
- ChatGPT's `--button-font-weight` (set in JS per call site) and tooltip padding per gutter in JS.
- Figma editor-only values (inspector CSS, tooltip delay, number scrub, "Mixed" display) beyond the 2026-09-28 captures.
- Perceptual claims (RF2, RF3, RF8) need the owner's look in the app, light and dark.
