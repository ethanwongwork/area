# Claude Code's sectioned UI: audit for Area (2026-10-31)

The owner asked (2026-10-31): "claude code just updated its ui to be sectioned rather than panels, i like the
simplicity of the panels and the use of icon buttons to open certain panels/tabs … see what principles, visuals, etc
can be adopted into area". The owner's picks are on the review page (https://claude.ai/artifact/F8nRcyToXTGCa3XMU22Cs8,
`verdicts` collection).

## Source

Claude desktop 4.4212.0, `/Applications/Claude.app/Contents/Resources/ion-dist.asar`, extracted with
`npx @electron/asar extract`. Values are read from its CSS (`assets/v1/c6a992d55-*.css`, `.cds-root` and
`.cds-root[data-density=comfortable]`) and the `--df-*` (frame and sidebar) and `--epitaxy-*` (Code tab)
properties in its JS. rem = 16, `--cds-rem-scale` 1 on desktop. The live window wasn't measured: the Claude app
can't be driven over CDP from here. Where the bundle holds more than one value (header 48 and chrome bar 36,
rows 26 to 44), which one the Code tab uses is **unconfirmed**.

## Measured values (compact density, then comfortable)

| Token | Compact | Comfortable | Area now (type 13, Compact) |
|---|---|---|---|
| body type | 13/19 | 14 to 15 | 13/18 |
| heading | 14/18 | 15 | 13 medium (section titles) |
| footnote / caption | 12/15, 11/17 | 13, 12 | |
| title | 20/25 | 22 | |
| weights | 400 / 500 / 580 / 600 | | |
| control height | 24 | 32 | 24 (bar controls) |
| nested control | 18 | 22 | |
| icon | 16 | 20 | 16 |
| radius (control) | 6 | 8 | 10 (system default) |
| composer radius | 12 | 14 | |
| panel radius (floating) | 10 | 12 | |
| panel inset / gap (floating) | 8 / 8 | | |
| panel shadow (floating) | 1px ring + shadow-sm | | |
| panel / toolbar / header line | 0 | | no rule (2026-10-22) |
| panel header pad | 4 block, 4 inline | | 7 |
| toolbar pad | 4 block, 0 inline | | |
| ring hairline | 1px, **0.5px at 2×**, 1/3 at 3×, 1/4 at 4× | | border width setting |
| pad xs/sm/md/lg/xl | 4/6/8/12/20 | 6/8/12/16/24 | |
| gap xs/sm/md/lg/xl | 6/8/12/20/32 | 8/12/16/28/40 | |
| frame header | 48 (`--df-header-h`); chrome bar 36 | | 40 |
| traffic-light room | 74 | | 83 to the toggle |
| sidebar width | 288 | | resizable |
| sidebar rows | 26 / 28 / 30 / 32; font 13 / 14; row gap 4 or 8 | | 28 |
| row stack gap | 1.5 to 2 | | |
| group label | 12 to 13, top pad 4 to 16 | | |
| footer button | 24 / 32; pill 28 / 32 | | |
| row hover / selected | alpha 5% / 10% of neutral-900 | | |
| row name fade | mask over the last 44 + trailing controls | | Nav horizontal tabs only |
| shell surfaces light | z0 #fff, z1 96.1%, z2 92.2%, z3 87.8% (0 saturation) | | |
| shell surfaces dark | z0 3.9%, z1 10.2%, z2 14.9%, z3 20% | | |
| focus | inset 1 page-bg, 1 accent ring, 6 blur glow | | |
| durations | 60 / 120 / 200 / 300 / 450 ms | | motion axis |
| ease snap | cubic-bezier(.32,.72,0,1) | | = Area's `drawer` curve |
| button spring | linear() overshoot to 1.09 | | |

`--cds-panel-*` holds both shells: floating cards (inset 8, gap 8, radius 10, ring + small shadow) by default,
overridden to sectioned (0 gap, 0 radius, hairline seams) in the new layout. The settings dialog also has a
`sectioned` / `tabbed` layout flag.

## What the screen does (owner's screenshot)

- Three regions on one window, each with its own header on the top line; seams are hairlines; the Sidebar sits on
  the recessed grey (z1), the transcript and the side panel on the page ground.
- The side panel's header is a row of ghost **icon buttons**, one per pane (Tasks, Terminal, Diff, Browser, Files,
  More); the open pane's button holds the selected plate. Its name is in a tooltip.
- The side panel is **sections, not cards**: a heading (Environment, Context, Connectors, Changes), then rows of
  icon · label · muted value or control at the end; hairline rules between sections; a collapsed section shows its
  summary at the row's end ("Connectors ▸ … 1 connected").
- Context: one thin stacked bar of coloured segments over a legend list (square swatch · name · tokens · percent),
  numbers right-aligned in columns.
- Sidebar: action rows with icons, then a group label that is a menu ("area ▾"), then text-only session rows with a
  trailing status mark and count; the name fades under the trailing marks. Foot: avatar, name, plan and a chevron
  (one menu button), Search at the end.
- Canvas header: the session's title as a menu (title + chevron). Composer: one-line field with + and the mic; under
  it, the model, effort and mode as plain-text menus.

## Already the same in Area (no change)

Three headers with no Titlebar and no rules (2026-10-30); the recessed Sidebar ground; 24 controls with 16 icons;
13 body type; 28 rows; the drawer curve; names fading under a revealed close (tabs); near-black dark.

## Picks and what was built (2026-10-31)

| Pick | Verdict | Built |
|---|---|---|
| p1 Inspector views as icon buttons | No | Nothing; the text pills stay |
| p2 Collapsed Inspector sections show a summary | Yes | The Theme view's groups fold, "Default" / "N changed" when closed, remembered (`src/canvas-settings.tsx`) |
| p3 Hairlines at one device pixel | Yes | Stroke width › Hairline, `--area-device-pixel` (1px, 0.5px at 2x, a third at 3x; `axes/surface.ts`, `emit/css.ts`). Control and state edges (`stroke-width`) are unchanged |
| p4 Sidebar names fade under trailing marks | Yes | A vertical Nav row's name and a Tree view label fade over their last 24 instead of an ellipsis (`nav.css`, `tree-view.css`) |
| p5 Floating panels as a shell option | Yes | Settings › Appearance › Panels: Sectioned / Floating (`app-look.ts`, `studio.tsx`, `styles/app.css`) |
| p6 Segmented Meter with a legend | Yes | Already built: Meter `segmented` with a legend (2026-10-30, the Inspector panel study). The audit missed it |
