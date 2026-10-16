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

## Feedback log

- 2026-10-15 · owner: "merge it, then continue working" → Titlebar and Section heading, from PRODUCT_UI.md's last gap.
