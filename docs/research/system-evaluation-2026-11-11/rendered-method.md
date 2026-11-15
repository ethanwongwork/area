# Rendered capture set: method (2026-11-11)

A rendered, measured picture of every component family, for the system evaluation's reviewers. Data only, no
findings. The capture set itself lives outside the repo (first in the session scratchpad, `rendered/out/`; since F1 in
`.cache/rendered/capture/`, ignored by git), because it is large and regenerable; this note says how it was made and
how to remake it. Paths below that say `out/` mean that folder.

## What was rendered

- **Source.** The built desktop app (`apps/desktop/dist`, built from this worktree at `e915a483`), served read-only
  by a small static server on 127.0.0.1:4473, loaded in headless Microsoft Edge (`--headless=new --guest
  --disable-features=msImplicitSignin`, a fresh `--user-data-dir` under the scratchpad, DevTools on 9473). No Area
  Electron window was used or touched, and nothing read or wrote the owner's saved systems or projects: the page made
  its own Area system in that fresh profile's localStorage.
- **Settings.** The shipped defaults: the Area system's Default theme (type 13, density 32, radius 10, every other
  setting at its default). The app's own UI and the specimens both follow `?theme=light|dark`
  (`apps/desktop/src/theme.js`), with `prefers-color-scheme` emulated to match.
- **Page.** `#system/area/components`, the Components Overview, one family section at a time (`#family-<slug>`), with
  its "Show all" toggle pressed so every tile shows in its groups (Default, Variants, Sizes, States …), and the view
  options `view:components-zoom = "1"` (100%, a true zoom) and `view:components-height = "waterfall"`. At 100% every
  tile's `.gallery-tile__stage` is `scale: 1` (checked in each measure: `stage.style`), so every length is a true CSS
  length.
- **Window.** 1440 × 900 CSS px at device scale factor 2, so PNGs are 2× (one CSS px = two image px). A section taller
  than the window is captured by making the viewport tall enough (to 4,000 CSS px) or, above that, in 4,000 px slices
  of the Canvas's scroll, stitched with sharp. A tile wider than its card in the two-column grid is laid out one card
  per row (`.studio-grid { grid-template-columns: 1fr }`, injected, families marked `oneColumn`); one still wider than
  the Canvas (Board 852, Dialog's extra large) gets a wider window, the overflow plus 48 (`windowWidth`). "Cut" means
  a painted box outside the card's frame after clipping by its own overflow ancestors (so a scroll area's content or
  a visually hidden table does not count).
- **Rest state.** Transitions and animations are stopped at their end state (`animation-duration: 0s`), reduced motion
  is emulated, the caret is hidden and the pointer is outside the page. Hover, focus and pressed tiles show the state
  their demo forces.
- **Overlays.** Where a tile shows only a closed trigger (`aria-expanded="false"`), the trigger is pressed with a real
  DevTools mouse event (right-click for Context menu, hover for Tooltip), and the tile plus what opened is captured as
  `open-<tile>-light.png` / `-dark.png` with the overlay measured (relative to the tile's view).

## What each family holds

`out/<slug>/light.png`, `dark.png`: the section (title, status, every group and tile, its caption), 8 px around it.

`out/<slug>/measure.json`: per tile, in CSS px relative to the tile's view (`.gallery-tile`, the card's frame):
`view`, `stage` (rect + inline style, showing `scale: 1`), `extent` (union of painted boxes, cut by any overflow
ancestor; `clipped` if outside the view), and `nodes`, a pre-order list of every element under the stage (to 700 per
tile): tag, class, role, aria-label, state attributes, rect, display/position, font (family, size, line-height,
weight, letter-spacing, features), color, background, borders per side (width, style, colour), radius per corner,
padding and margin per side, row/column gap, flex/grid alignment, box-shadow, outline, opacity, transform, `::before` /
`::after` boxes; `svg` nodes add viewBox, size, the ink box of their paths and the stroke width (svg children are not
listed). `texts` lists each text node's line boxes (`Range.getClientRects`), its box, and its insets from its parent's
border box and content box (top, right, bottom, left), with font and colour. Every node and text also carries the dark
theme's colours (`dark`, `darkColor`), matched by position in the tree (`darkMismatchedNodes` counts misses).

`out/index.json`: every family's slug, name, kind (the Documentation group: actions, fields, pickers, navigation,
status, content, conversation), status (`component-status.mjs`: Complete, In review, Unrefined, Deprecated), tiles (id,
label, group), files, window width and column mode; `notRendered` lists families with no Overview section.

`out/sheets/<kind>-light.png`, `-dark.png`: contact sheets, each family's page at a quarter, its top 1,400 px. An
overview only; not true scale.

## Counts

- 125 families rendered, light and dark: 1,371 tiles, 27,441 measured elements. Every tile's stage reads
  `scale: 1`, no tile is cut by its card after the column and width fixes, and every element's dark colours matched
  by position (0 mismatches). No tile reached the 700-element cap.
- 30 families laid out one card per row (`oneColumn`); two needed a wider window (`windowWidth`: Board 1548, Dialog
  1576); sections over 4,000 CSS px tall (Asset card, Radio, Button, Board …) were captured in stitched slices.
- 31 overlay captures in 24 families (light and dark): Breadcrumb ellipsis, Calendar caption menus, Color swatch icon
  slot, Combobox (2), Command palette modal, Composer stacked, Confirm dialog modal, Context menu (right-click), Custom
  select (4), Date picker, Date range picker (3), Dialog modal, Filter bar, Menu (2), Model picker, Number field
  trailing, Popover, Split button, Tag picker, Time field list, Toggletip, Toolbar overflow, Tooltip (hover), Zoom
  control.
- Not rendered (2 of the 127 `COMPONENT_PAGES`): `icon-pilot` (a docs-only page, not in the app's Overview) and
  `preview-frame` (deprecated; its link opens Asset card).
- Check: a default Button md measures 30 tall, `--area-control-md` resolves to `max(24px, 18px + 6px × 2)` = 30 at type
  13 / density 32; sm 26, lg 38.

## Limits

- Lengths come from the DOM, never from the pictures. The pictures are for looking.
- Native popups (the Select's `<select>`, the date input's calendar) are drawn by the OS and are not captured.
- Setting row's Help toggletip was not captured open: pressing it also opens the tile on the Stage (the card opens on
  click), so the page leaves the Overview. Toggletip's own capture shows the same overlay.
- In an overlay capture the pointer is moved to the window's corner after opening, so no row shows hover; Tooltip keeps
  the pointer on its trigger (hover is what opens it).
- Measures were taken in headless Edge (Chromium 157), not Electron's Chromium; font rasterisation can differ by a
  subpixel. Fonts are the app's bundled files, so metrics match.
- A tile's measures stop at 700 elements; `truncatedAt` would say so (none reached it).
- Families captured in the first pass and not re-run were measured with the first clipping check, which only ever
  over-reported cutting; none of them reported any, so their pictures and measures are unaffected.

## Remaking it

The first tools lived in the session scratchpad and were cleared. Since plan item F1 (2026-11-11) they are in the
repository, `scripts/rendered/` (`serve.mjs`, `cdp-lib.mjs`, `measure-page.js`, `capture.mjs`, `open.mjs`,
`merge.mjs`, `sheets.mjs`, and `check.mjs` with its rules), and write to `.cache/rendered/` (ignored by git). Each run
starts its own static server on a free port over a copy of `dist` and a headless Edge per theme in a fresh profile
(DevTools on a port the OS picks), and stops both. With the app built (`npm run build -w @area/desktop`):

```sh
npm run capture:rendered -- button          # .cache/rendered/capture/button/light.png, dark.png, light.json, dark.json
node scripts/rendered/open.mjs button        # overlays opened: open-<tile>-<theme>.png and .json
node scripts/rendered/merge.mjs              # measure.json per family and index.json
node scripts/rendered/sheets.mjs             # sheets/<kind>-light.png, -dark.png
npm run check:rendered                       # the rule tables, at the defaults, light and dark (docs/DEVELOPMENT.md)
```

`--set type=12 --set density=28` captures Compact (any Inspector axis; the settings seed the Area system's Default
theme in the fresh profile); `--no-png` measures only; `--layout shipped` keeps the Overview's two-column grid, as
the check does. The measure now also records each element's `scale` and `zoom`, and dark captures sample each floating
surface's edge (`edges`).
