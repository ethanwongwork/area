# App shell spec: Titlebar and Section heading

**Status:** in review · 2026-10-15
**Captures:** none of their own: every value is the desktop app's, owner-reviewed (apps/desktop/src/studio.css,
2026-10-12), which traced them to Cursor's bundle and to Panel.
**Peers:** Panel (its bar), Nav (tabs in the bar), Search field, Button (ghost icon)

## Owner decisions

- 2026-10-12: the app's Titlebar is 41 (Cursor's agents window bar) at Panel's bar formula; a 52 trial was put back for
  Cursor's. The traffic lights sit flush, as Cursor's: Electron `trafficLightPosition { x: 13, y: 12 }`.
- 2026-10-15: "merge it, then continue working" → PRODUCT_UI.md's last open gap, "App-shell parts: Titlebar (drag
  region, traffic-light inset) and a section heading", as components.

## Job and boundaries

- **Titlebar:** a window's top bar. A start (children) and an `end` group, 12 apart. In a frameless window the bar
  is the drag region (`app-region: drag`) and its links, buttons, fields and focusable parts stay pressable.
  `windowControls="macos"` leaves room for the system's traffic lights. Not a Toolbar (no roving focus, no overflow)
  and not a Panel bar (no title of its own).
- **Section heading:** a titled group on a page, its title and an optional lede. Not a Panel section heading
  (collapsible, in an Inspector) and not a document heading ramp (Typography's title roles).

## Decisions

| Slot · property | Value | Basis |
|---|---|---|
| Titlebar height | Panel's bar: `control-md + (10 − 4 × ui-dense) × 2 + border-width` (39 at type 13 / density 28; 41 at 14 / 32) | panel.css `--_bar`; the app's bar, Cursor's agents window bar |
| Titlebar inset | 14 each side; macOS 83 start (13 + 54 + 16), 13 end | Panel's 14; Cursor main.js traffic lights `x = s + 1`, 14 buttons on a 20 pitch from 13 |
| Titlebar gap / end gap | 12 | the app's bar (everything drawn 12 apart) |
| Titlebar rule, ground | `border-width` `border-decorative`; `bg-page` | the app's bar |
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
