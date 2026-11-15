# Cursor and Claude desktop: the fine detail, against Area (2026-11-11)

Finding prefix **RC**. Read-only. Neither app was launched; no Application Support or user data was read.

## 1. Scope and method

**Bundles read.**

| Short | Product, version | File | How it was read |
|---|---|---|---|
| `CL` | Claude 5.1231.2 | `Contents/Resources/ion-dist.asar` → `assets/v1/c6a992d55-aw-bvVUz.css` (1.87 MB, the `cds` design system and Tailwind utilities) | Extracted with a 30-line Node asar reader (no packages) to the session scratchpad; CSS split one rule per line and every `--cds-*` / `--df-*` declaration dumped with its selector |
| `CLS` | Claude | `assets/v1/shared-styles-HB_ROSgF.css` | The desktop frame (`.dframe-*`, `--df-*`: sidebar, header, rows) |
| `CLJ` | Claude | `assets/v1/shared-frame-Bz73oHR9.js` (542 KB) | The `cds` React kit: class strings per component (Button, Menu, Tooltip, Popover, Dialog, TextInput, SegmentedControl, Switch, Checkbox) and prop defaults read from destructuring |
| `CLT` | Claude | `assets/v1/shared-18-Cso_YbUl.js` | Toast |
| `CG` | Cursor 3.27.22 | `Contents/Resources/app/out/vs/workbench/workbench.glass.main.js` (49.7 MB) | Cursor's own StyleX kit. The hashed classes (`ui-1a6rlst`) were resolved to declarations from the CSS string embedded in the same file, so a value reads `CG › Menu.stylex.js base{--ui-menu-row-padding-block:3px}` |
| `CGC` | Cursor | `workbench.glass.main.css` | Readable classes (`cursor-settings-*`) and the theme-bound token block (`--cursor-*` over `--vscode-*`) |
| `CDJ` | Cursor | `workbench.desktop.main.js` | VS Code settings defaults (hover delay) |

**How values were resolved.** Claude's lengths are `calc(<rem> * var(--cds-rem-scale,1))` with rem 16, written here in px at scale 1.
Cursor's `--cursor-spacing-N` is N × 4px (`6-5` = 26). Area's values are computed from `packages/tokens/src/emit/base.ts`,
`axes/*.ts` and the built `packages/tokens/dist/css/tokens.css` at the **shipped defaults**: type 13, density 32, radius 10,
motion 210, easing Subtle, feedback Subtle, elevation 8, focus ring Hug; where the desktop app's own setting (Compact) differs,
the Compact value follows in brackets.

**What could not be verified.**
- Every value here is **declared**, not rendered. Nothing was seen on screen. Where a rendered value would differ (a font's cap
  height, a `color-mix` over an unknown ground, an `oklch()` live calc), the text says so.
- Cursor's glass kit ships its **dark** token block as the default (`--cursor-base:#F0F0F0`, `--cursor-pane:#181818`); light
  theme inks come from the user's VS Code theme at runtime (`--vscode-editor-foreground`), so Cursor light-mode hexes are not
  given, only the alpha ladder, which is the same in both.
- Claude ships an experiment flag `data-cds-fizzy-lake` (84 rule groups) that swaps the warm greys for neutral ones, alpha inks
  and flat panels. Whether it is on for the owner is user state and was not read. Values below are the un-flagged defaults,
  with the flagged value noted where it matters.
- Claude's toast motion and timeout were read; its submenu delay and menu typeahead are Base UI defaults (both products ship
  Base UI: Claude's `data-starting-style` hooks, Cursor's `MenuRoot.js`, `TooltipProvider.js` modules), not product code.
- Area's colour roles are `oklch()` calcs over the Layers model; the ink hexes below are computed from the model's anchors
  (`color/layers.ts:201-202`) and may differ by a step from the rendered value.

---

## 2. Claude desktop

### 2.1 Spacing system

Two independent scales, **pad** (inside a box) and **gap** (between boxes), both density-aware. `CL › .cds-root`:

| Step | pad | gap | Comfortable pad / gap |
|---|---|---|---|
| xs | 4 | 6 | 6 / 8 |
| sm | 6 | 8 | 8 / 12 |
| md | 8 | 12 | 12 / 16 |
| lg | 12 | 20 | 16 / 28 |
| xl | 20 | 32 | 24 / 40 |

The pad scale is also **size-scoped**: `.cds-root [data-size=xs|sm|lg]` repoints every pad step (`--cds-pad-md--sm: 6`,
`--cds-pad-md--lg: 10`), and `[data-step="1".."5"]` gives five pad ladders (step 1 pad-md 6 … step 5 pad-md 16). A component
reads `px-md`; its size decides what md means. Tailwind's `--spacing:.25rem` is used for one-off gaps (`gap-1.5` = 6, `gap-2` = 8).

Where each step is used (from `CLJ` class strings):

| Use | Value | Source |
|---|---|---|
| Icon to label in a button, field, segmented option | 6 (`gap-1.5`) | Button base `Eu`, TextInput `Nw`, SegmentedControl `uI` |
| Icon to label in a menu row | 6 (`gap-xs`) | Menu item `HT` |
| Tooltip text to shortcut | 8 (`gap-2`) | Tooltip `Up` |
| Button side padding | 8 (`px-md`), capped by `--cds-button-pad-max` 8 (xs/sm 6, lg 9) | Button `Xc` |
| Field side padding | 8 start (`ps-md`); end 3 when a nested button sits there: `(h-control − h-control-nested) / 2` | TextInput `Iw`, `Ww` |
| Textarea | 8 × 6 (`px-md py-sm`) | `Rw` |
| Menu surface padding | 4 (`--cds-menu-gutter`, default `.25rem`) | `UT`, `WT` |
| Menu row | 8 inline (compact) / 10 (comfortable); block `(h-control − leading-body) / 2` = 2.5 | `HT` |
| Popover padding | presets none / 4 / 6 / 8 / 12 (`p-xs … p-lg`) | `GM` |
| Dialog body padding | 20 (`p-xl`), 12 in a short window (`[--cds-pad-xl:var(--cds-pad-lg)]`) | `Qb`, `$b` |
| Coach mark | 12 (`p-lg`), max 280 | `tI` |
| Message bubble | 12 × 8 (`pad-lg` × `pad-md`); stacked bubbles 2 apart; turns 20 apart (compact 16) | `CL › [data-cds=UserMessage]`, `--cds-message-bubble-item-gap` |
| Panels from window edge | 8 (`--cds-panel-inset`) | `.cds-root` |
| Window content gutter | 8 (`--df-content-gutter`) | `CLS › .dframe-content-inner` |
| Prose flow | 0.75em between blocks; before h1 3×, h2 2.5×, h3 2×, after a heading 0.667× | `CL › .prose` |

### 2.2 Control geometry

Base control height `--cds-h-control` **24**, nested control (a button inside a field or chin) `--cds-h-control-nested` **18**,
icon `--cds-icon` **16**. Size-scoped: xs/sm 20 (nested 16, icon 12), lg 28 (nested 20, icon 16); comfortable density 32 / 40.

| Control | Height | Inline padding | Icon | Radius | Type | Source |
|---|---|---|---|---|---|---|
| Button (all variants) | 24 | 8 (cap 8; sm 6, lg 9); icon-only square `w-control px-0` | 16 | 6 (`--cds-radius`), lg 7 (`--cds-button-radius-add--lg` 1) | 13/19; primary/danger/brand 500, secondary/ghost/accent **400** | `CLJ` `Eu`, `Zc` |
| Button nested in a field | 18, square when icon-only | – | – | `outer − (outer h − inner h) / 2` (6 − 3 = 3) | – | `Hw`, `CL` line 13348 |
| Text input | 24 | 8 start; 3 end when an end-slot button is present | 16 slot (`size-icon`) | 6 | 13/19 400, placeholder muted | `Iw`, `Lw` |
| Menu row | 24 (`py` = (24 − 19)/2) | 8 / 10 | 16 | 6; menu 10 (`radius + gutter`) | 13/19 400; shortcut caps in muted ink | `HT`, `UT` |
| Menu surface | min 128, max 320 | 4 | – | 10 | – | `iD` |
| Segmented control | 24 track | option 8 (`px-md`) | – | track 6, option `radius − 2` = 4, thumb `radius − 1` = 5, 1px inset top/bottom | 13 400; off options secondary ink, hover primary | `uI`, `vI`, `yI` |
| Tooltip | min 24 | 8 × 3 | – | 6 | 13/18 400; max 240, `text-balance` | `hp`, `Up` |
| Switch | 16 (sm 14, lg 18) | – | – | full | – | `--cds-switch-h` |
| Checkbox | 16 (sm 14, lg 18, xxs 12) | – | glyph 16, `wght` 533 (sm 629) | 4 (lg 5, xxs 3) | – | `--cds-checkbox-*` |
| Chip | – | – | – | `h-control-nested / 4` = 4.5 | – | `.rounded-chip` |
| Avatar | xs 16, sm 20, md 28, lg 36 | – | – | full | – | `--cds-avatar-*` |
| Sidebar row | 26 (`--df-row-h`: a 20 control + 6) | 2 (`--df-row-px`) | 16 in a 24 slot (`--df-leading-slot`) | – | 13 (`--df-row-font`); group label 12 | `CLS › .dframe-root` |

**Leading icon / icon-only rule.** Claude keeps the same side padding with a leading icon (the 16 icon simply joins the 6 gap);
icon-only is `aspect-square w-control px-0`. A nested end button sets the field's end padding to `(h − nested)/2` so the button
sits equidistant from three edges. Menu descriptions on one line use `truncate py-[0.125em] -my-[0.125em]` so descenders are not
clipped by the overflow box (`CLJ` `YT`).

### 2.3 Type usage

| Role | Size / line | Weight | Ink | Source |
|---|---|---|---|---|
| Caption | 11/17 | 400 / 500 / 580 | – | `--cds-font-size-caption`, `--cds-leading-caption` |
| Footnote | 12/15 | – | – | `--cds-*-footnote` |
| Code | 12/17 mono | – | – | `--cds-*-code` |
| Body (all UI text, controls) | 13/19 | 400 | primary | `--cds-*-body` |
| Prose (chat, documents) | 14/20 (sm 13/19, lg 15/22); text-size setting 13 or 15 | 400 | primary | `--cds-*-prose` |
| Heading | 14/18 | 500 / 580 | primary | `--cds-*-heading` |
| Title | 20/25 | – | – | `--cds-*-title` |
| Page header title | 24/32 | – | – | `--cds-page-header-title-*` |
| Prose headings | h1 1.75em/1.25, h2 1.375em/1.25, h3 1.125em/1.3, h4 1em | serif option 520 | – | `.prose` |
| Tooltip | 13/18; detail 11/14 | 400 | tooltip fg | `hp` |
| Shortcut caps | 12 | – | muted (`--cds-shortcut-cap-ink`) | `Kp` |

- **Weights**: regular 400, medium 500, semibold **580**, bold 600. In dark, the variable axis drops them: `"wght" 360 / 460 / 540 /
  560` (`CL › [data-mode=dark] .cds-root`). Semibold and bold also set **`GRAD` 180 / 200**, so emphasis thickens without reflow.
- **Letter-spacing**: none on UI type (no tracking token; `letter-spacing` appears only in a few display utilities).
- **Ink ladder** (light; `CL › .cds-root` over `:where(:root)` greys): primary `neutral-900` **#0b0b0b**, secondary `neutral-600`
  **#52514e**, muted `neutral-400` **#898781**, disabled `alpha-4` = 35% of #0b0b0b. Dark: primary `gray-50` **#f0efec**,
  secondary `gray-200` **#c3c2b7**, muted `gray-400` **#898781** (the same raw grey as light), disabled 35% white. Warm greys
  (hue 40–60). Under `fizzy-lake` the inks become alpha: light #000000e6 / #000000bf / #0009, dark #ffffffed / #ffffffbf / #ffffff91.
- **Icon ink**: `--cds-opacity-icon-secondary: .3`; icons otherwise take the text ink (`Am` = `text-stays-secondary` or muted).
- **Step size vs step ink**: controls never change size for hierarchy; the menu description is footnote size (12/15) in muted
  ink, aligned by `JT`: `pb = (h − body size − footnote leading + footnote size) / 2`, an optical baseline formula.

### 2.4 Shape

- **Radius scale**: `--cds-radius` 6 (xs/sm 5, lg 7); `rounded-card` = radius + 4 = **10** (popover, dialog, menu, cards,
  message bubble); `--cds-panel-radius` 10 (comfortable 12); `--cds-radius-composer` 12; chips `nested / 4`; checkbox 4.
- **Nested rule** (stated three ways, all concentric): menu `radius + gutter` over rows at `radius` (`UT`); a nested button
  `outer − (outer h − inner h) / 2` (`Hw`); segmented option `radius − 2`, thumb `radius − 1` for its 1px inset (`uI`, `vI`).
- **Borders**: one border colour, `--cds-border` = `alpha-2` (10% of the ink). Strong 20%, stronger 40%. Fields draw it as an
  **inset 1px box-shadow** (`shadow-field-ring`), hover `border-strong` 20%, invalid danger fill.
- **Floating ring placement flips with the theme**: light draws the ring **outside** (`--cds-ring-outer:1px`, inner 0), dark
  **inside** (`outer 0, inner 1px`, colour `alpha-2`) (`CL › [data-mode=dark] .cds-root`). The dialog body then takes
  `m-[var(--cds-ring-inner)]` so scrolled content never paints over the inner ring (`ex`).
- **Hairline**: `--cds-ring-hairline` 1px, `.5px` / `1/3px` / `1/4px` at 2×/3×/4× density.
- **Shadows** (light; dark in brackets):
  - `--cds-shadow-sm` `0 1px 2px 6%, 0 2px 8px 8%` (shadow colour 24% in dark)
  - `--cds-shadow-md` `0 2px 4px 7%, 0 6px 16px 8%`; `-lg` `0 4px 8px 8%, 0 12px 28px −2px 8%`
  - `--cds-shadow-popover` `0 8px 24px #0000001f (12%), 0 2px 6px #00000014 (8%)` [`#00000052` 32%, `#0003` 20%]
  - `.shadow-panel` = ring + popover shadow (menu, popover); `.shadow-panel-lg` = ring + lg (dialog adds it);
    `--cds-panel-shadow` `0 0 0 1px border, shadow-sm` (side panels); tooltip `shadow-sm` (dark `shadow-panel-sm`).
  - Field: `inset 0 0 0 1px ring, 0 1px 2px #0000000d` (a 5% drop under every secondary button and field).
- **Surfaces**: light page `gray-20` #f9f9f7, surface-1 #fcfcfb, panels and popovers #fff; dark page `gray-900` **#0b0b0b**,
  surface-1 #151515, panel #1a1a19, popover #20201f. The tooltip renders inside a forced dark scope in both themes (`Cp`).

### 2.5 State paint

| State | Light | Dark | Source |
|---|---|---|---|
| Ghost hover (rows, menu items, ghost buttons) | `alpha-1` 5% | 7.5% | `--cds-fill-ghost-hover` |
| Ghost selected / pressed toggle | `alpha-2` 10% | 15% | `--cds-fill-ghost-selected` |
| Secondary button | `#ffffff1a` + inset 1px border ring + `0 1px 2px 5%`; hover `alpha-1` | `alpha-2` 10%, no ring; hover 14% | `qc`, `.shadow-field` |
| Primary button | `neutral-900` → hover `neutral-750` | `gray-50` → `gray-100` | `--cds-fill-primary*` |
| Press | button's paint layer `scale(.975)` (only the plate, not the label), 60ms ease-out in, 450ms spring out | same | `CL` 14943–14944 |
| Menu row press while held | `alpha-2` (`button:enabled:active .cds-btn-squish>.absolute`) | – | `CL` 13512 |
| Focus | `inset 0 0 0 1px page-bg, 0 0 0 1px accent, 0 0 6px 1px bg-accent`: a 1px ring with a 1px page-colour gap inside and a soft 6px glow | glow from `accent-600` at 60% | `--cds-focus-shadow`, `Em` |
| Focus, danger | the same in danger | – | `Dm` |
| Disabled | opacity **.4** | – | `--cds-opacity-disabled` |
| Expanded trigger (`aria-expanded`) | keeps the hover paint while its menu is open | – | every variant in `Mu` |
| **Window inactive** | primary/brand buttons turn grey (`gray-450`), sidebar ink `alpha-5`, header ink `alpha-4` | – | `CL` 15239, `CLS › :root[data-window-active=false]` |
| Danger menu row highlighted | `fill-danger` plate, on-danger ink | – | `HT` |
| Forced colours | highlighted row `outline 2px Highlight, offset −2` | – | `KT` |

### 2.6 Motion

| Token | Value |
|---|---|
| `--cds-dur-fast` / `-snap` / `-base` / `-sheet` / `-slow` | 60 / 120 / 200 / 300 / 450 ms |
| `--cds-ease-out` | `cubic-bezier(.165, .84, .44, 1)` |
| `--cds-ease-snap` | `cubic-bezier(.32, .72, 0, 1)` |
| `--cds-ease-overshoot` | `cubic-bezier(.34, 1.3, .64, 1)` |
| `--cds-btn-spring` | `linear(0, .2459, .6526, .9468, 1.0764, 1.0915, 1.0585, 1.0219, .9993, .9914, .9921, .9957, .9988, 1.0004, 1)` |

- **Hover** paint: 60ms ease-out (`Vc`, `transition-[background-color,box-shadow,color] duration-fast`).
- **Tooltip**: opacity + scale .98 from `--transform-origin`, 120ms ease-snap, in and out; `data-instant` 0 (`_p`).
- **Menu**: no enter/exit transition in its class string (`iD`): it appears at once. (Declared; Base UI adds nothing by itself.)
- **Popover / coach mark**: opacity + scale .97, 200ms ease-out (`tI`).
- **Dialog**: opacity + scale .98, 200ms ease-out; backdrop opacity 200ms; a nested dialog's backdrop goes transparent (`dx`, `fx`).
- **Sheet**: translate from `100% + 1.5rem`, 300ms; a covered sheet steps back `−translate-y-3 scale(.94)` under a backdrop fade.
- **Toast**: stacked; each one behind offsets `index × −14px` and scales `1 − index × .04`; enters from translateY(100%) + fade,
  exits scale .85 + fade, 200ms ease-out; timeout 8 s (`CLT` `UV`).
- **Disclosure**: height 200ms ease-out with a clip-path that extends 8px above (`mj`).
- **Message actions**: reveal after 100ms on hover in 120ms ease-snap, hide at once in 60ms (`--cds-message-actions-reveal-*`).
- **Card press**: `.99` scale and 2px, spring back (`--cds-card-press-*`).
- **Reduced motion**: every transition above has `motion-reduce:transition-none` and a `[data-reduce-motion=true]` app switch.

### 2.7 Behaviour (JS)

- **Overlay engine**: Base UI (`data-starting-style`, `data-side`, `--transform-origin`, `--available-height`), `positionMethod:"fixed"`.
- **Offsets**: tooltip `side:"top"`, `sideOffset` **4** default, `delay` **300** (`gm=300`) unless a group provider sets it;
  disabled-reason tooltips `sideOffset 8`, `delay 200`; combobox popup `sideOffset 6`.
- **Collision padding**: **5** on every side (`dd=5`), the top adding the window's titlebar inset (`yd`).
- **Tooltip rules**: only one open at a time (a registry closes the previous one instantly, `dp`); closes instantly when an
  ancestor scrolls (`addEventListener("scroll", …, {capture:true})`) and when its trigger's `aria-expanded` turns true
  (a MutationObserver); a `DisabledReasonTooltip` explains disabled controls; an `OverflowTooltip` names text only when cut.
- **Scroll fades**: `scroll-fade-y`/`-x` mask the scroller's ends with an 8-stop eased gradient over **28px**
  (`--cds-scroll-fade-size`), driven by `animation-timeline: scroll()` so a fade appears only on the side with more content;
  the scroller's `scroll-padding` equals the fade, so keyboard focus never lands under it (`CL` 3536–3537). Each ground sets the
  strip colour it fades into (`:where(.bg-surface-2){--cds-scroll-fade-strip-color:…}`).
- **Focus**: a menu opened by context menu focuses its first enabled `menuitem` after up to 3 animation frames; dialogs restore
  focus to the opener (`registerOpenerReturn`); a popover anchored without `finalFocus` returns focus to its trigger.
- **Live text**: status announcements are written 100ms after mount into an `aria-live=polite` span (`_u`).
- **Button busy**: a spinner replaces the label; neighbouring row actions hide after 150ms while it spins.

### 2.8 Composition

- **Window**: content gutter 8; panels inset 8 from the window, radius 10, `0 0 0 1px border, shadow-sm`; header 48
  (`--df-header-h: var(--frame-row-h,48px)`); a chrome bar 36 when window controls overlay (`--df-chrome-bar-height`).
- **Sidebar**: width 288, 8 from the window edge; rows 26 (control 20, room 6), 2 between stacked rows, side pad 2, a 24 leading
  slot with a 16 icon, 4 to the label (label column at 2 + 24 + 4 = 30), 13px; group labels 12px in muted ink, 12 above a group,
  10 band margin; nested rows indent 20; comfortable 32 rows, 24 control, 20 icon, 28 slot, 14px. Labels fade 24px before the end
  where hover actions appear (`--df-hover-mask`).
- **Toolbar** (panel header): block padding 4 → 32 tall at 24 controls; comfortable 8 → 40.
- **Chat**: bubble 85% measure, 12 × 8 padding, radius 10, 2 between stacked bubbles, turns 20 apart (compact 16); composer radius 12.
- **Dialog**: sizes 400 / 520 / 720 / 880 / 1024 / 1152; 16 from the viewport edge (`100vw − 2rem`); body 20; a header rule
  appears once the body scrolls (`scroll-timeline: --cds-dialog-scroll`).
- **Settings**: page header title 24/32; section titles in `[data-settings-section-title]` (a Windows override exists).

---

## 3. Cursor

### 3.1 Spacing system

One 4px grid with quarter steps: `--cursor-spacing-0-25 … 20` = 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
20, 22, 24, 26, 28, 30, 32 … 80, and negative twins (`ne-*`) for optical pull-backs (`CG` token block). Components pick a step;
there is no density token in the kit.

| Use | Value | Source |
|---|---|---|
| Icon to label in a button | 6 (`spacing-1-5`); pill buttons 4 | `CG › Button.stylex.js labelGroup{gap}`, `b1a.pill{gap}` |
| Icon to label in a menu row | 6 (base), 8 (md) | `Menu.stylex.js base / sizeMd{--ui-menu-row-gap}` |
| Icon to label in a sidebar row | 6 | `Sidebar.stylex.js root{gap:var(--ui-sidebar-row-gap,spacing-1-5)}` |
| Field inner gap | 4 (md), 6 (lg), 8 (xl) | `InputGroup.js sizeMd/Lg/Xl{gap}` |
| Sibling buttons in a dialog footer | 8 | `Dialog.stylex.js footer{gap:spacing-2}` |
| Title to description (dialog) | 2; title group to body 4 | `Dialog.stylex.js` header groups |
| Menu surface padding | 4 (`--ui-menu-inner-padding`), with `scroll-padding-block` 4 | `Menu.stylex.js inner` |
| Popup inset (tooltip, small popover) | 6 × 8; preview card 10 | `floating-surface.stylex.js popupInset`, `previewCardInset` |
| Dialog | header 12 × 16, body 16 (12 after a header), footer 10, close button 10 from top and end | `Dialog.stylex.js` |
| Settings page | tab 48 top and bottom; header gap 4; sections 28 apart; section list 12; cell 12 × 14, 20 between label and control, 1 between label and description; sidebar cells 1 apart, 4 × 6 | `CGC › .cursor-settings-*` |
| Chat bubble | 7 × 16 | `chat-bubble.stylex.js padding` |

### 3.2 Control geometry

Heights `--cursor-height-xs/sm/base/lg` 20 / 24 / 28 / 32; the kit's control sizes are sm 20, **md 24**, lg 28, xl 32
(`control-size.stylex.js`). Type 13/18 on sm–lg, 14/22 on xl.

| Control | Height | Inline padding | Icon | Radius | Source |
|---|---|---|---|---|---|
| Button | 20 / **24** / 28 / 32 | 6 / **8** / 10 / 12, border-box with a 1px transparent border on every variant; pill +2 | sm sm, md sm, lg base, xl lg (`control-icon-size.js`) | 4 / **6** / 8 / 8; pill full | `Button.stylex.js`, `button-root-base`, `control-radius` |
| Icon button | square 20 / 24 / 28 / 32, padding 0 | – | – | as Button; `rounded` full | `icon-button.stylex.js` |
| Icon button, content frame | negative margins −4 / −6 / −8 / −10 so the glyph sits on the text edge | – | – | – | `icon-button.stylex.js wsp` |
| Input group | md 24 (pad 4 × 5, gap 4), lg 28 (4 × 8, gap 6), xl auto (8 × 8) | – | – | 6; pill full | `InputGroup.js` |
| Input text | 13/18; placeholder **secondary** ink; mono 12 | – | – | – | `InputChrome.js` |
| Menu row | 3 + 18 + 3 = **24** (md 4 + 18 + 4 = 26) | 4 (md 8) | left column 12 × 16 (md 14 × 16) | `radius-xl − 4` = **8** | `Menu.stylex.js` |
| Menu surface | min 120, max 320 | 4 | – | 12 | `Menu.stylex.js` |
| Dialog row | 28, multiline min 48 | 8 | – | 6 | `Dialog.stylex.js row` |
| Tabs | bar 40; tab 26, 8 sides, 1 apart, max 130; inline tabs 24, 6 sides, 4 apart | – | – | 6 | `TabSystem.stylex.js` |
| Sidebar row | min 28, block 5, inset 4 | – | 20 box, 14 glyph | 8 | `Sidebar.stylex.js` |
| Switch | sm 26 × 16, regular 30 × 18, md 32 × 20, lg 38 × 24 | – | thumb shadow `0 1px 2px` 12% | full | `Switch.js` |
| Checkbox | 13 / 14 / 15 | – | – | 4 | `Checkbox.js` |
| Tooltip | – | 6 × 8 | – | 8 (`--ui-tooltip-border-radius` → `radius-lg`) | `floating-surface.stylex.js` |
| Settings sidebar cell | 4 + 16 + 4 = 24 | 6 | – | 6 | `CGC` |

**Leading icon / icon-only rule.** A button with a leading icon keeps its padding; icon-only is a separate square IconButton
with zero padding. In a `content` frame (an icon button in a row of text) the button gives its padding back with negative
margins, so its glyph lines up with the text edge.

### 3.3 Type usage

| Token | Size / line | Tracking | Source |
|---|---|---|---|
| xs | 11/14 | +0.07px | `typography.stylex.js n1a` |
| sm | 12/16 | 0 | `MU` |
| base | 13/18 | −0.08px | `TG` |
| lg | 14/22 (glass mode 15/24) | −0.15px | `m7r`, `CGC body[data-cursor-glass-mode]` |
| 17/21 | 17/21 | +0.08px | `f7r` |
| 20/22 | 20/22 | −0.46px | `i1a` |
| 22/26 | 22/26 | −0.26px | `F5h` |

Weights 400 / 500 / 600 / 700. Buttons **400**, primary 500 (`Button.stylex.js primaryWeight`). Popups set
`-webkit-font-smoothing: antialiased` on every floating surface.

- **Text inks**: `--cursor-base` at **100 / 74 / 60 / 36%** (primary, secondary, tertiary, quaternary). High-contrast themes
  raise them to 100 / 84 / 72 / 60.
- **Icon inks**: a separate, lighter ladder, **100 / 66 / 52 / 28%** (HC 100 / 76 / 64 / 52): each icon step sits 8 points
  under the text step with the same name. Tinted inks: text 78%, icons 70% of the hue.
- **Settings**: tab title 17/21 500 primary; tab description 13/18 **secondary** (same size as a cell label, a step of ink);
  section title 12/16 secondary; section description 12/16 tertiary; cell label 13/18 primary, cell description 13/18 secondary.
  Cursor steps ink, not size, for descriptions; size drops only for section headings.
- **Dialog**: description 13/18 tertiary; secondary text secondary ink.

### 3.4 Shape

- **Radius scale** `--cursor-radius-xs … 4xl`: 2, 4, **6** (base), 8 (lg), **12** (xl), 14, 16, 18, full.
- Use: buttons 4/6/8; fields 6; tabs 6; menu rows 8; sidebar rows 8; tooltips 8; menus, popovers, dialogs, trays **12**;
  chat bubbles 20 with 6 where two meet.
- **Nested rule**: menu row `radius-xl − spacing-1` (12 − 4); a bubble's inner content `max(radius-sm, 20 − 6)`; connected
  corners 6 (`chat-bubble.stylex.js`).
- **Strokes** (alpha of `--cursor-base`): primary 20%, **secondary 12%** (dialog border, popup hairline, outline button),
  **tertiary 8%** (menu header/footer rule, sidebar divider), quaternary 4% (settings cell divider, inset 12 each side).
- **Popup hairline** is an `::after` with two inset shadows, `inset 0 0 0 1px stroke-secondary, inset 0 0 0 1px bg-elevated`,
  so the line is the stroke over the surface colour, never over what lies behind (`surfaceHairline.stylex.js`).
- **Shadows**: shadow-primary 20% black, secondary 12%, tertiary 6%.
  - `--cursor-box-shadow-popup` `0 3px 8px 12%, 0 2px 5px 12%, 0 1px 1px 12%` (menus, tooltips, popovers)
  - `-sm` `0 2px 8px 12%`; `-base` `0 0 8px 2px 20%`; `-soft` `0 0 8px 2px 6%` (trays)
  - `-lg` `inset 0 0 4px #FFFFFF0D, 0 0 3px 12%, 0 16px 24px 6%`; `-xl` adds `0 0 6px 8px 12%, 0 24px 16px 6px 6%`
  - Dialog: 1px `stroke-secondary` border, `bg-elevated`, scrim `rgba(0,0,0,.5)` (fullscreen .8 + blur 4).

### 3.5 State paint

| State | Value | Source |
|---|---|---|
| Secondary button | `bg-tertiary` 8% → hover `bg-secondary` 14% | `Button` `--ui-button-bg` |
| Ghost button / icon button | transparent → `bg-tertiary` 8% | same |
| Outline button | 1px `stroke-secondary` 12%, hover `bg-tertiary` 8% | `outline` |
| Text button | no fill in either state | `text` |
| Dialog row | hover and focus-visible `bg-tertiary` 8%; selected `bg-secondary` 14% (hover unchanged) | `Dialog.stylex.js rowInteractive/rowSelected` |
| Ghost field | transparent → hover and focus-within `bg-quaternary` 6% | `InputGroup.js variantGhost` |
| Focus | outline **2px, offset 2px**, `--cursor-stroke-focus-ring` = accent #599CE7; `selfInset` variant offset −2; fields `offset −1` | `focus-ring.stylex.js` |
| Disabled | opacity .5; placeholder quaternary | `native-pressable`, `InputChrome` |
| Press | `scale(.98)` on `:active`, 1 under reduced motion | `press.stylex.js`, `interaction.stylex.js` |
| Hover ink | foreground fixed; tinted secondary buttons may take a hover ink (`--cursor-control-*-hover-foreground`) | `Button` |

### 3.6 Motion

Durations: instant 50, fast **100**, normal **150**, slow **200**, slower 300 ms. Easings: out-quint `(.16, 1, .3, 1)`,
out-strong `(.165, .84, .44, 1)`, out-cubic `(.215, .61, .355, 1)`, in-out-strong `(.77, 0, .175, 1)`, plus CSS keywords.

- **Floating surfaces** (menus, popovers, tooltips): enter from `translate 2px toward the anchor + scale(.98)`, 100ms out-quint;
  exit back to that; opacity on the positioner over the same 100ms (`floating-anchor-transition.stylex.js`).
- **Dialog**: overlay fade 200ms; panel opacity + scale .97, 200ms out-quint, exit the same (`Dialog.stylex.js` keyframes
  `ui-9ekpj0-B`, `ui-fh2zsw-B`).
- **Hover**: tray rows fill in **0s** and only a selection change transitions (100ms); dialog close button 150ms ease;
  field colour 150ms; switch 100ms; checkbox fill 100ms, its scale 50ms.
- **Disclosure**: chevron rotation 200ms out-strong; body height 200ms out-strong.
- **Tab padding** transitions 100ms when a stable tab expands.

### 3.7 Behaviour (JS)

- Base UI primitives (`TooltipProvider`, `MenuRoot`, `PopoverRoot`, `SelectRoot`, `FieldRoot` …) wrapped by the StyleX kit.
- Delays declared across the kit: `delay=300` 15×, `openDelay=400` 10×, `delay=500` 8×, `delay=800` 6×, `closeDelay=100` 3×
  (counted defaults). The VS Code editor hover is `max(editor.hover.delay ?? 300, 500)` (`CDJ`). Which one the plain kit
  Tooltip uses was not isolated.
- Sash (panel resize): hover delay 300, 4px hit, 12 on hover, accent while dragging (from 2026-11-07's audit; not repeated).
- Icon-only buttons warn in development when they lack an accessible name (`IconButton.chrome.js`).
- Menus: header/footer rows ruled by `stroke-tertiary`; a drop indicator is a 2px line inset 4; `scroll-padding-block` equals
  the menu padding so arrowing never hides a row under the edge.

### 3.8 Composition

- **Tabs bar** 40 with 26 tabs (6 container padding); inline tabs 24.
- **Sidebar**: width 180 (collapsed 48), rows 28, accessory box 20, leading glyph 14, row actions in a 24 strip with 4 padding.
- **Dialog** widths 320 / 400 / 480 / 560 / 640; 16 from the viewport edge (`100vw − 32px`).
- **Settings** as in 3.1 and 3.3: a 48-padded column, 17/21 title, sections of 12/16 secondary headings over 12×14 cells.
- **Chat**: bubbles 20 corner, 7 × 16, filled `bg-quaternary` 6%; connected bubbles 6 at the meeting corners.

---
## 4. Side by side: the 44 most telling values

Area at the shipped defaults (type 13, density 32, radius 10, motion 210, elevation 8, focus Hug, Selection Neutral);
Compact, the desktop app's own setting, in brackets. Area values are computed from `emit/base.ts:457-549` (heights, gaps,
corners), `axes/type-size.ts:56-121`, `axes/motion.ts:48-57`, `axes/feedback.ts`, `components/surface.css`, `inset.css`,
`Overlays.tsx:17-30`. Declared values throughout; a rendered cap height or `oklch()` result may differ by a pixel or a step.

| # | Value | Claude | Cursor | Area |
|---|---|---|---|---|
| 1 | UI body type | 13/19 | 13/18 | 13/18 |
| 2 | Small / secondary type | 12/15 | 12/16 | 12/16 |
| 3 | Caption | 11/17 | 11/14 | 11/14 |
| 4 | 20px title | 20/25 | 20/22, −0.46px | 20/28, −0.015em (−0.3px) |
| 5 | Tracking at 13 | 0 | −0.08px | +0.0025em (+0.03px) |
| 6 | Named text inks | 3 + disabled | 4 | **2** + disabled (fg-quiet in 3 rules) |
| 7 | Light inks | #0b0b0b / #52514e / #898781 | 100 / 74 / 60 / 36% | ≈#282828 / #666666 (anchors, `layers.ts:201`) |
| 8 | Dark inks | #f0efec / #c3c2b7 / #898781 | #F0F0F0 at 100 / 74 / 60 / 36% | ≈#eeeeee / #c5c5c5 |
| 9 | Icon ink beside text | secondary icons at .3 opacity | each step 8 points under its text step | the text's muted ink (`fg-muted`), `fg-quiet` for icon actions |
| 10 | Weight in dark | 360 / 460 / 540 / 560 (`wght`) + GRAD | unchanged | unchanged |
| 11 | Secondary / ghost button label | 400 | 400 | **500** |
| 12 | Medium control | 24 | 24 | **30** (26) |
| 13 | Small / large control | 20 / 28 | 20 / 28 (xl 32) | 26 / 38 (24 / 34) |
| 14 | Button text side | 8 | 8 (1px border included) | 10, 9 + 1 border (8) |
| 15 | Button icon side | 8 | 8 | 7, 6 + 1 (5) |
| 16 | Icon to label, button | 6 | 6 | 6 (4) |
| 17 | Medium button corner | 6 | 6 | **8** (8) |
| 18 | Field height / side | 24 / 8 | 24 / 5 inner | 30 / 10 (26 / 8) |
| 19 | Menu row | 24 | 24 (md 26) | **30** (28) |
| 20 | Menu row side | 8 | 4 (md 8) | 8 |
| 21 | Menu icon to label | 6 | 6 (md 8) | **10** (8) |
| 22 | Menu padding | 4 | 4 | 4 |
| 23 | Menu row / list corner | 6 / 10 | 8 / 12 | **10 / 14** |
| 24 | Menu width floor / cap | 128 / 320 | 120 / 320 | **224** / none |
| 25 | Popover / dialog corner | 10 / 10 | 12 / 12 | **16 / 20** |
| 26 | Tooltip | min 24, 8 × 3, corner 6 | 8 × 6, corner 8 | 26, 9 × 4 (8 × 4), corner 10 |
| 27 | Sidebar row | 26 | 28 | 30 (28) |
| 28 | Sidebar label column from row edge | 30 | 30 | 34 (32) |
| 29 | Switch height | 16 | 18 (30 × 18) | 18 |
| 30 | Checkbox | 16, corner 4 | 14, corner 4 | 14, corner 4 |
| 31 | Light hover wash | 5% | 8% of the ink | 5% (#141414) |
| 32 | Dark hover / selected wash | 7.5% / 15% | 8% / 14% | **14% / 19%** (`base.ts:148`, steps 2 / 1) |
| 33 | Disabled | opacity .4 | opacity .5 | opacity .5 |
| 34 | Focus ring | 1px accent, 1px page-colour gap inside, 6px glow | 2px outline, offset 2, accent | 2px outline, offset 0, neutral solid |
| 35 | Floating edge | 10% ring, outside in light, inside in dark | 12% hairline drawn over the surface colour | 1px border ≈12.5% of the ink; dark adds a 16% white outer ring |
| 36 | Menu shadow, light | 0 8 24 12% + 0 2 6 8% | 0 3 8 + 0 2 5 + 0 1 1, each 12% | 0 0 2 4% + 0 8 16 8% |
| 37 | Menu shadow, dark | 0 8 24 32% + 0 2 6 20% | same 12% layers on a 20% base | 0 0 2 8% + 0 8 16 16% |
| 38 | Hover transition | 60ms | 0ms in (trays), 150ms (close) | 91ms in, 140ms out |
| 39 | Menu enter | none | 100ms out-quint, .98 + 2px toward anchor | **210ms**, .97; exit 140ms |
| 40 | Tooltip delay / enter | 300 / 120ms | 300 (most common) / 100ms | **500** / 140ms |
| 41 | Dialog enter | 200ms, .98 | 200ms out-quint, .97 | **280ms**, .97; exit 210 |
| 42 | Press | the plate alone .975, 60ms in, 450ms spring out | the whole control .98 | the whole control .97, 91ms in |
| 43 | Viewport collision padding | 5 | not read | 8 |
| 44 | Scroll edge fade | 28px eased mask, scroll-driven, scroll-padding matched | menu scroll-padding = padding | none |
| – | Dark page | #0b0b0b | #181818 | ≈#020202 (ground L 0.0847) |

## 5. Findings, most severe first

Counts: 4 defects, 4 inconsistencies, 10 refinements, 5 opportunities (23).

**RC1 · inconsistency · Area's floating surfaces are rounder than both references at every level.**
Area: `radius-container` 16, `radius-list` 14, list rows 10, dialog `container + 4` = **20** (`surface.css:966`), tooltip 10,
titled toast 16 (`base.ts:531-548`). Claude 10 / 10 / 6 / 10 / 6 (`.rounded-card` = radius + 4); Cursor 12 / 12 / 8 / 12 / 8
(`--cursor-radius-xl`, `Menu.stylex.js` row `xl − 4`). Controls agree more closely (Area md 8, both 6). Families: Menu, Context
menu, Select's list, Combobox, Popover, Dialog, Command palette, Toast, Tooltip, Hover card. Fix (rule): surfaces step off the
control corner by the inset they hold, `surface = control-md + 4`, as both references do (Claude 6 + 4, Cursor 8 + 4 for rows
in a 12 list), and the dialog takes the same surface corner rather than `+4` again. At radius 10 that gives 12 surfaces,
8 rows, 12 dialogs. Visible: every overlay loses 4–8px of corner, reading crisper and less toy-like; the setting keeps its
whole range. Also the comment at `surface.css:966` says "12 + 4 = 16"; at the default it computes 20. Size M. Confidence high
(declared on both sides).

**RC2 · inconsistency · Area's controls and rows are 6px taller than both references at the same 13px type.**
Area md 30, sm 26, rows 30 at the default density, md 26 / rows 28 even at Compact (`base.ts:466,480`, room 6 and 6 at level 0).
Claude 24 / 20 / 26 rows (`--cds-h-control`, `--df-row-h`); Cursor 24 / 20 / 28 rows. Both get a 24 control from a 13/18 or
13/19 line with 3 above and below. Families: every control and row. Fix (rule): the default density's room at type 13 is the
level that makes md 24–26 (today that is Compact's 4); or keep the room and move the Density default to 28 for type ≤ 13.
This is a setting default, not a defect; it is the single largest reason Area screens read airier than the two products.
Visible: denser UI everywhere at defaults. Size S (a default) / L (re-checking every spec). Confidence high.

**RC3 · defect · Overlay motion is about twice as slow as both references.**
Area menus and popovers enter in `duration-base` 210ms and leave in 140 (`surface.css:1808-1811`); tooltips 140ms; dialogs 280
in, 210 out (`surface.css:925`); toasts 350 (`fade-slow`). Claude: menus not animated, tooltips 120 ease-snap, popovers and
dialogs 200, toasts 200. Cursor: every floating surface 100ms out-quint, dialogs 200. Fix (rule): anchored overlays enter on
`fast` and leave on `instant` or `fast`; dialogs and toasts on `base`. At motion 210 that is 140 / 0–140 / 210; or move the
Motion default to 150 (fast 100, base 150), which lands on both products' numbers. Visible: menus and tooltips feel immediate;
no lag between click and list. Size S. Confidence high.

**RC4 · inconsistency · Menus are roomier than both references on five measures at once.**
Rows 30 (28) vs 24; icon to label `gap-row` 10 (8) vs 6 (`surface.css:1257`, `base.ts:488`); corners 10 / 14 vs 6–8 / 10–12;
floor 224 vs 120–128 (`surface.css:1267`). Families: Menu, Context menu, Composer menu, Select's list, Custom select, Combobox,
Command palette, List box. Fix (rule): list rows take the control height (`control-md`), the menu's icon-to-label gap is the
control gap (`gap-md`, 6), not the Nav's label column, and the floor drops to 128 (lists still grow to the field's width). The
label column rule (36 / 34) belongs to Nav only. Visible: lists 20% shorter, labels closer to icons. Size M. Confidence high.

**RC5 · defect · The dark hover wash is twice both references'.**
`bg-hover` dark = 7% × Hover step 2 = **14%** white, selected **19%** (`base.ts:148-160, 257-259`). Claude dark ghost hover 7.5%,
selected 15% (`--cds-fill-ghost-hover`, `-selected`); Cursor 8% / 14% (`bg-tertiary`, `bg-secondary` over #F0F0F0). Light is
in agreement (5%). Families: everything that paints `bg-hover` / `bg-active` (segmented track, swatch cells, controls on rows,
selection highlight). Fix (rule): dark hover step 0.04 per Hover step (8% at the default 2), selected +6% (14%), keeping the
press room; the dark ladder then matches the light one's 5 → 7 in visual weight. Not verified rendered: the opaque row plate
(`bg-component-hover`) is a separate Layers value and may already be closer. Size S. Confidence medium.

**RC6 · defect · The Hug focus ring has no gap, so on a solid neutral button it merges with the fill.**
Area Hug: 2px outline, offset 0 (`axes/states.ts:28`), colour `neutral-solid` under the shipped Selection Neutral
(`base.ts:288`). On a solid Button (`action-solid`, the same neutral) the ring is the fill's own colour touching its edge: the
button only grows by 2px. Claude separates every ring with `inset 0 0 0 1px page-bg` plus a 1px accent ring and a 6px glow
(`--cds-focus-shadow`); Cursor offsets 2px (`focus-ring.stylex.js`). Families: Button solid, Split button, solid Badge links,
Switch on, Checkbox checked, Segmented thumb. Fix (rule): a hugging ring draws a 1px page-colour gap first (an inner
`box-shadow` of `--area-bg-page`, or `outline-offset: 1px` with a matching inset), so the ring reads on any fill; or Hug takes a
1px offset on solid fills. Not verified rendered. Size S. Confidence medium-high.

**RC7 · inconsistency · Secondary and ghost button labels are 500; both references use 400.**
Area `--_weight: var(--area-weight-strong)` on every variant (`button.css:28-30`, owner 2026-10-08). Claude secondary, ghost
and accent `font-normal` (400), primary, danger and brand 500 (`CLJ` `Eu`); Cursor 400, primary 500 (`Button.stylex.js
primaryWeight`). BASELINE.md:99-101 records the same for ChatGPT and Notion. Families: Button, Split button, Button group,
Segmented (labels), Toolbar buttons. Fix: owner decision to revisit with this evidence; if taken, the rule is "weight marks
the action: 500 on solid, 400 on quiet variants", one rule in `button.css`, and the "one label weight beside a neighbour"
argument is met by the fill difference. Visible: toolbars and dialog footers lose weight; the primary stands out. Size S.
Confidence high (on the references).

**RC8 · refinement · Area has two text inks where both references have three or four.**
Area paints `fg-default` (138 rules) and `fg-muted` (210 rules), plus `fg-disabled` (23) and `fg-quiet` (3)
(`packages/styles/src`). Claude: primary / secondary / muted (#0b0b0b / #52514e / #898781), Cursor primary / secondary / tertiary /
quaternary (100 / 74 / 60 / 36%). Both use the third step for meta that must stay quieter than a description: Cursor's settings
section description (tertiary under a secondary title, `CGC .cursor-settings-section-header-description`), dialog descriptions
(tertiary), line numbers; Claude's shortcut caps and menu descriptions (muted). Area's muted sits at ≈#666, between the
references' second and third steps, so a description and a timestamp beside it cannot differ by ink. Families: Message (meta),
Setting row, Nav section labels, Table secondary cells, Breadcrumb, Kbd, Menu shortcut and description, Timestamp. Fix (rule):
a third neutral ink, `fg-subtle`, solved in the Layers model at 3:1 (non-text and large) for meta only, never for a description;
the type-usage skill states when each of the three applies. Owner's "few type styles" preference is about sizes, not inks.
Size M. Confidence medium-high.

**RC9 · refinement · No dark-mode weight compensation.**
Claude lowers every weight in dark through the variable axis, `"wght" 360 / 460 / 540 / 560` for 400 / 500 / 580 / 600
(`CL › [data-mode=dark] .cds-root`), and uses `GRAD` 180 / 200 for semibold and bold so emphasis thickens without reflowing.
Light text on near-black reads heavier (irradiation), and Area's dark is darker than Claude's (≈#020202 vs #0b0b0b). Area
writes weights as `--area-wght-*` and never varies them by theme (no `GRAD` or theme weight in `packages/tokens/src`). Fix (rule):
a dark weight offset (−40 on `wght`) applied through `font-variation-settings` for variable faces (Geist is variable), not for
platform fonts. Visible: dark text looks the same weight as light text. Size S. Confidence medium (owner should judge on screen).

**RC10 · refinement · Press scales the whole control, label included, at a larger give.**
Area: `scale: var(--_give)`, 0.97 at md, 0.96 at sm, on the button element (`button.css:158-162`), arriving in 91ms
(`feedback-press` 0.65 × 140). Claude scales **only the paint layer** (`.cds-btn-squish`, an absolutely positioned plate) to .975,
60ms in, and releases on a 450ms spring (`--cds-btn-spring`), so the label never resamples; Cursor scales the control to .98.
Fix (rule): give the press to a plate pseudo-element (Button already has a `--_wash-*` layer), keep the label at 1, release on
a spring curve (`linear()`), and default the give to .98. Visible: no blur on the label during a press; a livelier release.
Size M. Confidence medium-high.

**RC11 · refinement · Tooltip timing and dismissal.**
Area opens after **500ms** with a 300ms skip window (`Overlays.tsx:26-28`); Claude 300 (`gm=300`), Cursor's most common 300.
Claude also closes a tooltip at once when an ancestor scrolls (a capturing `scroll` listener) and keeps a single open tooltip
through a registry; Area guards `aria-expanded` (`Overlays.tsx:270`) and leaves instantly, but no scroll dismissal was found.
Fix: delay 300; close on any ancestor scroll. Size S. Confidence high (declared).

**RC12 · refinement · The icon-to-label column in sidebars sits 4px further in than both references.**
Area Nav: 8 row inset + 16 icon + `gap-row` 10 = label at **34** (Compact 32) (`inset.css:75,97`, `base.ts:481,488`). Claude
2 + 24 slot + 4 = 30 (`--df-row-px`, `--df-leading-slot`, `--df-row-gap`); Cursor 4 + 20 box + 6 = 30 (`Sidebar.stylex.js`).
Families: Nav, Tree view, Menu with icons, Command palette. Fix (rule): a row's icon-to-label gap is the control gap (6), and
the row inset stays 8 (or 6 in a panel), for a 30 column; one value for Nav, Tree view and Menu. Size S. Confidence high.

**RC13 · refinement · Area's floating edge in dark may draw twice.**
Menus, popovers, dialogs and toasts draw `border: 1px solid var(--area-edge-floating)` (`surface.css:1109, 1740, 976`) and their
`shadow-float` / `-modal` adds `0 0 0 1px` white at 16% in dark (`tokens.css` `--area-shadow-float`). Claude moves its single
ring inside in dark (`--cds-ring-inner:1px`); Cursor's is one hairline drawn over the surface colour (two inset shadows).
Fix: one edge per theme; if the dark rim is wanted, it replaces the border's colour rather than adding a second line outside it.
Not verified rendered (the border's dark value may be designed to sit under the ring). Size S. Confidence low-medium.

**RC14 · refinement · Light menu shadow is lighter and shorter than both references.**
Area float at elevation 8: `0 0 2px 4%` + `0 8px 16px 8%` (`--area-shadow-float`, slots 1–2). Claude `0 8px 24px 12%` +
`0 2px 6px 8%`; Cursor `0 3 8` + `0 2 5` + `0 1 1`, each 12%. Both carry 12% in the near layer where Area carries 4% in a 2px
blur. The owner set Floating 8 on 2026-11-05 after a review; this is evidence for the next look, not a defect. Size S.
Confidence high (declared).

**RC15 · opportunity · Scroll edge fades.**
Claude masks any scroller's ends with an 8-stop eased gradient over 28px, only on the side with more content
(`animation-timeline: scroll()`), and sets `scroll-padding` to the fade so focused rows never sit under it (`CL` 3536-3537).
Cursor matches menu `scroll-padding-block` to the menu padding. Area's Scroll area has neither (`scroll-area.css`; the
components audit of 2026-11-07 proposed fades). Fix (rule): Scroll area gets `fade` (default on for menus, dialogs, panels'
lists), and every scroller sets `scroll-padding` equal to its padding plus any fade. Size M. Confidence high.

**RC16 · opportunity · An inactive-window state.**
Claude greys its primary and brand buttons (`gray-450`) and drops sidebar and header ink to 50% / 35% when the window loses
focus (`CL` 15239, `CLS :root[data-window-active=false]`). Area's desktop app is Electron; nothing reads window focus. Fix:
one `data-area-window="inactive"` hook in `layers.css` that quiets the solid action and the shell's inks. Size S. Confidence high.

**RC17 · refinement · Placeholder and description ink.**
Cursor's placeholder is the **secondary** ink (74%) and only disabled fields drop to quaternary (`InputChrome.js`); Claude's is
muted. Area's is muted (`base.ts:310`, `fg-placeholder` = muted). Agreement with Claude; no change, but if RC8's third ink is
added, the placeholder stays muted (it must stay readable), never the new subtle.

**RC18 · refinement · Tracking at UI sizes runs the other way from Cursor.**
Area adds +0.0025em at 13 and +0.005em at 12 (`type-size.ts:57`); Cursor −0.08px at 13, 0 at 12, −0.15px at 14; Claude none.
Different faces (Geist vs SF / Anthropic Sans) make this a weak signal. Fix: none without an on-screen check; record that both
references tighten from 13 up. Size S. Confidence low.

**RC19 · refinement · Cursor's settings cell spacing is a touch more open than Area's port of it.**
Area Setting row: 16 between text and control, 4 between label and description (`setting-row.css:21,50`). Cursor 20 and 1
(`.cursor-settings-cell{gap:20px}`, `-leading-items{gap:1px}`), and the description is the label's size in the secondary ink.
Area's 4 is the system's "text pair" rule (owner, 2026-11-06), so keep it; the 16 → 20 is worth a look. Size S. Confidence high.

**RC20 · opportunity · One-line truncation that keeps descenders.**
Claude's single-line descriptions use `truncate py-[0.125em] -my-[0.125em]` so the overflow box does not clip g, y and p
(`CLJ` `YT`). Area has 50 `text-overflow: ellipsis` rules and none pads its block (`packages/styles/src/components`). Whether
any clips depends on the line box versus Geist's descender; not verified rendered. Fix (rule, if any clip): every truncating
text box pads its block by 0.125em and takes it back with a negative margin. Size S. Confidence low-medium.

**RC21 · opportunity · Optical baseline for a secondary line in a row.**
Claude centres a two-line menu row with `pb = (h − body − footnote leading + footnote size) / 2` (`JT`), so the label and its
smaller description sit optically centred, not box-centred. Area's two-line rows (Menu `__lines`, Nav description) centre the
boxes. Worth measuring in the app. Size S. Confidence low.

**RC22 · defect · A stale corner comment.**
`surface.css:966` states the dialog corner is "12 + 4 = 16"; with `radius-container` 16 at the default it is 20. Fix with RC1;
if RC1 is declined, correct the comment. Size S. Confidence high.

**RC23 · opportunity · Toast stacking.**
Claude stacks toasts behind one another (`−14px` and `−4%` scale per index), so several toasts take one toast's room
(`CLT` `UV`); Area lists them 8 apart (`surface.css:1706`). A variant, not a default. Size M. Confidence high.

## 6. Already excellent; do not disturb

- **Concentric corners as a rule, not a value.** Area derives list rows, lists, toast controls, popover close buttons and composer
  actions from the shell less its inset (`base.ts:543-548`, `surface.css:1134-1137`), the same rule Claude states three ways
  (`radius + gutter`, `outer − (h − nested)/2`, `radius − 1` for a 1px inset) and Cursor states as `xl − 4`.
- **The inset contract** (`inset.css`): text sides from the cap height, icon sides from the icon box, borders counted once, every
  side rounded to whole pixels. Neither reference has a stated rule this exact; both hard-code per size.
- **Icon-only optical alignment** (`.area-button--start/--end` negative margins, `inset.css:328`) matches Cursor's content-frame
  rule; the nested field button reserves its own box as Claude's end slot does.
- **Overlay crispness**: arrows on whole pixels, surfaces at rest without a transform (`surface.css:1818`); neither reference
  states this.
- **Typeahead with a 1s reset, expanded-trigger guard, hover bridge, pass-through name tooltips** (`Overlays.tsx`, `surface.css:1838-1851`).
- **Disabled opacity .5 and a separate inactive state with a reason**, which Claude covers only with a tooltip.
- **Separation of setting axes** (type, density, radius, motion, feedback, focus): Claude has density and size scopes; neither
  reference exposes the rest. RC2, RC3 and RC5 are defaults on these axes, not structural problems.
