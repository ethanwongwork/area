# App shell spec: Titlebar and Section heading

**Captures:** none of their own: every value is the desktop app's, owner-reviewed (apps/desktop/src/studio.css,
2026-10-12), which traced them to Cursor's bundle and to Panel.
**Peers:** Panel (its bar), Nav (tabs in the bar), Search field, Button (ghost icon)

## Owner decisions

- 2026-10-12: the app's Titlebar is 41 (Cursor's agents window bar) at Panel's bar formula; a 52 trial was put back for
  Cursor's. The traffic lights sit flush, as Cursor's: Electron `trafficLightPosition { x: 13, y: 12 }`. — The 41 is superseded 2026-10-19 (the traffic lights stand): the height is derived from the control height and insets (39 at the app's type 13 Compact), as every bar follows Density.
- 2026-10-15: "merge it, then continue working" → PRODUCT_UI.md's last open gap, "App-shell parts: Titlebar (drag
  region, traffic-light inset) and a section heading", as components.
- 2026-10-19 (review page, docs pass): the Titlebar's height follows the derived formula; the fixed 41 is superseded.

## Job and boundaries

- **Titlebar:** a window's top bar. A start (children) and an `end` group; every control the small control's
  height, one cluster space apart (8, compact 6). `variant`: `ruled` (default, a rule under the bar), `plain` (no
  rule) or `floating` (a raised plate held off the window's edges). In a frameless window the bar is the drag region
  (`app-region: drag`) and its links, buttons, fields and focusable parts stay pressable. `windowControls="macos"`
  leaves room for the system's traffic lights. Not a Toolbar (no roving focus, no overflow) and not a Panel bar (no
  title of its own).
- **Section heading:** a titled group on a page, its title and an optional lede. Not a Panel section heading
  (collapsible, in an Inspector) and not a document heading ramp (Typography's title roles).

## Decisions

| Slot · property | Value | Basis |
|---|---|---|
| Titlebar height | Panel's bar: `control-md + (10 − 4 × ui-dense) × 2 + rule` (39 at the app's 13 Compact; 47 at 13 Default; 53 at 14 Default); `plain` drops the rule's 1 | panel.css `--_bar`; log 2026-10-16 (round 28) |
| Titlebar controls | every control `control-sm` (24 at the app's scale), Nav's items included at Button sm's corner, a Nav row with actions too (Nav's `--_nav-row-height` / `--_nav-row-radius`, so a closable tab's close stays 4 in on every side, 2026-10-29); centred, 7 above and below at the app's scale | log 2026-10-16 (round 27); Cursor, ChatGPT, Notion |
| Titlebar inset (ruled, plain) | the end, and the start when the bar starts with a button or link: as far from the side as from the top and the rule, `(control-md − control-sm) / 2 + 10 − 4 × ui-dense`, 7 at the app's scale; a bar that starts with its title keeps Panel's 14; macOS 83 start (13 + 54 + 16) | Even control insets, 2026-10-18 (PRODUCT_UI.md, "The app's layout"; Figma's panel tabs 8 and 8); Cursor main.js traffic lights |
| Titlebar gap / end gap | the cluster space, `ui-cluster` (8, compact 6), box to box; a Nav keeps its own 4 | log 2026-10-16 (round 27); Cursor's 8 between groups, ChatGPT's 8 |
| Titlebar rule, ground | `ruled`: the Surface width (`border-width`, none at Borderless) in `border-decorative`; `bg-page` | the app's bar; log 2026-10-16 (round 28) |
| Titlebar `floating` | Toolbar surface's paint (`bg-surface`, `shadow-edge`, `border-float` inset edge, `shadow-float`); controls one cluster space in on every side; the plate one cluster space off the window's top and sides; corner `radius-control-sm` + that inset, concentric; macOS: starts one cluster space after the lights (67) | log 2026-10-16 (round 28); Toolbar surface |
| Section title | `text-sm` at `weight-strong`, trimmed cap / alphabetic | the app's section titles |
| Section lede | `text-sm`, `fg-muted`, 64ch, trimmed; 8 under the title | the app |

## Adoption

- The app's bar is `<Titlebar className="studio-titlebar" windowControls={isMac() ? "macos" : undefined} end={…}>`;
  the app keeps only its own rules (search width, tabs, the bar icons placed by their glyph).
- `CanvasSection` and the Components page's group, Props, Anatomy and States titles are `<SectionHeading>`; the app
  adds the Canvas margin under it (`studio-section-heading`).

## Verification

- App preview: Titlebar 39 tall at the app's scale, equal to the Canvas bar; insets 14 / 14; end group gap 12; last
  button 14 from the edge; search 240. `area-titlebar--macos` computes 83 / 13 (the Electron window itself not
  inspected). Section titles 13/18 at 500, 14 to the content, still naming their sections (`aria-labelledby`).
- `packages/react/tests/app-shell.test.mjs`.

## Review note, 2026-10-15

- **What it is:** the desktop app's top bar and its section titles, now Area components anyone can use: a Titlebar
  that lines up with Panel's bar and clears macOS's window buttons, and a Section heading with an optional lede.
- **Based on:** the app's own bar and titles, which you reviewed; nothing in the app looks different.
- **Why its own component:** Titlebar does two things nothing else does: it is the drag region of a frameless
  window (its controls stay pressable) and it clears the macOS window buttons. It only matters to desktop apps,
  as this one and a later IDE are. Section heading is the weakest case: a strong title and a muted line, with no
  behaviour, so it could be a Typography recipe instead of a component.

## Review note, 2026-10-16

- **What changed:** Titlebar: every control in the bar is one height (the tabs were 2 taller), sitting 7 from the
  top and bottom; one gap between everything (6 at the app's scale), the tabs' own 4 between tabs, and 14 at the
  ends. Section heading: approved, unchanged.
- **Why:** you asked for one size and intentional spacing. Cursor's bar holds every control at one height with 8
  between groups; ChatGPT's too.

## Review note, 2026-10-16 (round 29)

- **What changed:** Titlebar has two new variants: plain (no rule under the bar) and floating (a raised plate held
  off the window's edges, its controls the same space in, its corner rounded to match theirs). Ruled, with the rule,
  stays the default.
- **Why:** you asked for both. The height is Panel's bar formula, so a ruled or plain bar lines up with the panels
  beside it; a floating plate is sized like Toolbar's floating bar.

## Feedback log

- 2026-10-15 · owner: "merge it, then continue working" → Titlebar and Section heading, from PRODUCT_UI.md's last gap.
- 2026-10-16 · owner, review round 27 (components27) → Section heading approved → Complete. Titlebar: rethink, "the nav items look bigger than the buttons and inputs, can you make sure the size is consistent? also the gaps, inset padding, margins, etc should all be intentional" → open.
- 2026-10-29 · owner: "make sure that the inset spacing around the close button is the same distance to the backplate" → the Titlebar sets Nav's row height and corner for its horizontal Nav (`--_nav-row-height: control-sm`, `--_nav-row-radius` its corner), so a row with actions (an open tab) has the item's corner and its close is the row less 8, 4 in on every side (was sized from Nav's own row, 2 above and below). app-shell.css.
- 2026-10-16 · Titlebar, from the owner's round-27 note → every control is control-sm, Nav's items included (`.area-titlebar .area-nav--horizontal .area-nav__item`: control-sm tall, Button sm's corner; were a row, 26 beside 24), centred with equal room, 7 above and below at the app's scale; one gap, the cluster space (8, compact 6), box to box, between everything the bar and its end hold (was 12, with the app pulling icon buttons in by 4 each side to make 8 and 4; that app rule now applies only to the Canvas header); a Nav keeps its own 4. Basis: Cursor (all 22 in 35, 8 between groups), ChatGPT (all 36, 8 apart), Notion (buttons 28). Measured in the app: all 24, top 7, gaps 6 / 4, ends 14. docs/research/inset-actions-2026-10-16.md.
- 2026-10-16 · owner, review round 28 (components28) → Titlebar rethink: "how is the height of this bar calculated? is there always just an underline? is there a floating title bar variant with a backplate?" → open.
- 2026-10-16 · Titlebar, from the owner's round-28 questions → answers: the height is Panel's bar formula (control-md + the header gap above and below + the rule: 26 + 6 + 6 + 1 = 39 at the app's 13 Compact, 32 + 10 + 10 + 1 = 53 at 14 Default), so its rule lines up with the panels beside it; the rule follows the Surface width (gone at Borderless, back under More contrast). Owner picked both offered options → `variant`: `ruled` (default), `plain` (no rule; the bar loses the rule's 1 so the controls stay centred; ChatGPT's and Notion's top bars, Panel's bare bar) and `floating` (Toolbar surface's paint: `bg-surface`, `shadow-edge`, the floating edge and `shadow-float`; the controls one cluster space in from the plate on every side and the plate the same space off the window's top and sides; the corner the small control's plus that inset, concentric; on macOS the start clears the lights, which end at 67, by the same space). Measured in the app at type 13 Default: ruled 47 (controls 10 / 10 above the rule), plain 46 (10 / 10), floating 40 tall, 7 in on every side, 7 off the window, corner 13. Gallery: Variant / plain, Variant / floating.
- 2026-10-16 · owner, review round 29 (components29) → Titlebar approved (one control height, plain and floating) → Complete in `component-status.mjs`.


## Even control insets (2026-10-18)

Owner, of the app's bars: "these controls are not evenly inset, theres too much space horizontally". A docked Titlebar's
end controls (and its start control, when the bar starts with one and has no traffic lights) now sit as far from the
side as from the top and the rule: (height − rule − small control) / 2, 7 at the app's scale (was Panel's 14, and 13
beside macOS's lights). A bar that starts with its title keeps the title on Panel's 14 column; the lights' 83 stays.
Figma's panel tabs measure 8 and 8. (app-shell.css)

### 2026-10-30 · Titlebar size sm

- **What changed:** Titlebar `size` (`sm` | `md`, default `md`, Panel's md bar as before). `sm` is a region's header on the
  window's top line: the small control 7 from its top, bottom and end, 40 at type 13 / 32, as Panel's `windowBar`.
- **Why:** owner, 2026-10-30, the desktop app's three-panel shell (no bar across the window; each region its own header,
  Cursor's 40).
- **Verdict:** in review.

### 2026-10-30 · Tabs first start at the even inset

- **What changed:** a Titlebar whose first child is a row of controls (a button, a link, a Nav of tabs, a Segmented or a
  toolbar), or a wrapper that starts with one (a scrolling strip of tabs), starts at the even inset, 7 at size sm (was
  Panel's 14, kept for a bar that starts with its title).
- **Why:** owner, 2026-10-30: the desktop Canvas header's tabs started 14 in, beside 7 at its end: "it should be equal".
- **Checks:** cohesion test "a bar of controls is inset as far from its sides as from its top".
- **Verdict:** in review.
