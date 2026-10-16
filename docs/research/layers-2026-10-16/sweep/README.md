# Layers sweep, 2026-10-16

Every Complete family (94) in the app's gallery, at 18 Layers settings. The question: do the approved components
still hold now that page, layer, control-fill and ink tones follow the Layers settings (PR #116)?

- **Light grounds:** 100, 95 and 90.
- **Dark grounds:** 0, 8 and 24.
- **Layer contrast:** 0, 4 and 8 at each ground.

Every other setting is at its default.

## How

Headless Edge runs against a static build of `main` at 4c7d9578 (`desktop-dist`, port 4410). Each combination gets a
fresh process.

1. `run.mjs` writes the Layers settings into the app's saved Canvas and reloads.
2. It opens each family page and runs `check.js` in the page.
3. `check.js` reads computed colours, composited over their ancestors.

`check.js` checks four things:
- **Text:** 4.5:1, or 3:1 for large text. Disabled, hidden and image-backed text is skipped.
- **Selected, current, pressed and checked plates:** the lightness step (ΔL, OKLab) from their ground. The bar is the
  Layers model's own: light 0.035, dark 0.07.
- **Fields:** a fill step or an edge.
- **Raised layers:** a fill step, an edge or a shadow.

`analyze.mjs` groups the findings by family and combination.

To rerun:
```
npm run build && npm run build -w @area/desktop
node docs/research/layers-2026-10-16/sweep/all.mjs out
cd docs/research/layers-2026-10-16/sweep && node analyze.mjs out
```

## Findings

No errors or timeouts. Several families fail on gray light grounds, and a few at dark 24 with contrast 8. Dark 0 and
8 pass at every contrast.

### 1. Status and syntax inks don't follow the ground (light 95 and 90)

The `-vivid` inks are fixed: `fg-danger-vivid` #e80945, `fg-success-vivid` #00853c, the syntax colours and the Box
model value blue #0160d9. They reach 4.5:1 on white only.
- On a 95 page (#eeeeee): 3.97:1. On 90 (#eaeaea): 3.83:1.
- Affected: Field, Select, Number field, Password field and OTP field validation; Checkbox and Radio invalid; Menu
  danger rows; Code block syntax; Box model values.
- The model adapts `fg-default` and `fg-muted` to the ground; these inks need the same treatment.

### 2. Muted text on pressed-depth fills (light 95 and 90, contrast 0)

`fg-muted` is solved against the hovered fill, but soft Badge and Count paint the pressed fill
(`bg-component-active`). The result is #666 on #e0e0e0, 4.35:1.
- Affected: Badge, Badge group, Count, Tabs counts, Table, Card tags, Description list.

### 3. Tinted labels on tinted plates (light gray grounds; dark 24 at contrast 8)

Tag's tints are spec literals. Board's colour badges and Tag-picker reuse them.
- In dark the plates are `color-mix` toward transparent, so they lighten with the ground while the label stays
  fixed: 3.98–4.48:1 at dark 24 + 8.
- In light the Board badges reach 4.18–4.5:1 on gray pages.

### 4. Nested steps on a gray or light-dark ground

Code block highlighted lines, Box model's neutral layer and Code block line numbers step again from an already
stepped ground: 3.3–4.3:1 at light 90 and at dark 24 + 4 or + 8.

### 5. Segmented's track vanishes at contrast 0

The track is `bg-subtle`, the recessed layer, which equals the page at contrast 0. The light thumb is `bg-surface`,
which also equals the page there. What remains is a 1.3:1 outline and the thumb's shadow
(`docs/research/captures/layers-sweep-2026-10-16/segmented-light-95-0.png`, against `segmented-light-100-4.png`).
- Affected: Segmented, Toggle group (default), Toolbar's segmented tools, Panel, Color picker views.
- The model says controls still step from their ground at Flat; the track should take a control fill.

### 6. The app's gallery tiles aren't marked raised

`.gallery-tile` paints `bg-surface` but doesn't carry `data-area-ground="raised"`. Specimens therefore step their
fills from the page, not from the tile. In dark at contrast 8, selected rows sit 0.066 off the tile
(`docs/research/captures/layers-sweep-2026-10-16/nav-dark-8-8.png`).
- Affected: Nav, List box, Tree view, Pagination, Toggle group, Button, Chip, Titlebar and others.
- This is the app's bug, not the components'. Nav's sidebar demo has the same gap: its recessed sidebar isn't marked
  recessed, so the selected row is #eeeeee on #f7f7f7 (ΔL 0.027) rather than the model's #e6e6e6.

### Already failing at the defaults (light 100 + 4)

These predate Layers:
- Code block syntax colours on highlighted (#eeeeee) and diff lines: 3.97–4.32:1.
- Chip's accent selection plate is ΔL 0.029 off white (it has a 1.31:1 edge).

### Not real

- `.area-sr-only` text.
- Field wrappers and the ghost Custom select, which are unpainted by design.
- Toggletip triggers, whose layer is closed.
- Calendar's today marker, which is a ring, not a plate.
- The Color picker's hidden channel input.

### Also seen

Card's media placeholder is a ramp rung (`neutral-25` / `neutral-800`), so it doesn't follow the Layers. It is #282828
on a #121212 card in dark.

## Fixes (same day; owner: "go with your recs, fix them in that order")

1. **The app marks its grounds.** Gallery tiles and the Stage carry `data-area-ground="raised"`, or `"recessed"` when a
   tile is scoped. Nav's sidebar demo and the floating Titlebar's backdrop carry `"recessed"`. Layers adds a third
   value, `page`, for a region painted the page tone inside a raised one. A non-floating Titlebar and a flush Panel take
   it, which was needed once tiles were raised: a Titlebar's selected tab came out lighter than the bar at 90 + 8. The
   floating Titlebar and the File upload item join the raised list.
2. **Segmented and Toggle group:** the track is `bg-component`, the control fill, so it steps from its ground.
3. **The Layers model (tokens `color/layers.ts`):**
   - Theme and Accent write each vivid and tonal ink as a rung (`fg-<role>-vivid-rung`, `fg-<role>-rung`). In light,
     the model mixes it toward black in OKLab by exactly what the page needs for 4.6:1. That mix scales luminance by
     (1 − d)³.
   - Each ink is solved against its own luminance bound: the vivid inks 0.178, which is 4.6:1 on white; the tonal inks
     0.141, the brightest in any accent (teal `fg-accent`). Both mixes are 0 on white, so the light theme as it was is
     unchanged.
   - Muted is also solved on the selected fill and on the soft mark. It is unchanged at the defaults.
   - In dark, tinted labels mix toward white:
     - by `layer-dark-tint-lift` on the page or a layer;
     - by `layer-dark-tint-lift-fill` in a field or on a hovered row.
   - Tag, Tag picker and Board read these lifts. Board's coloured text also takes the light darken.
   - `layers.test.ts` guards every case: every hued ink in every accent and neutral on every light page, and every Tag
     ink on every dark ground, field and hovered row.
4. **Nested plates:**
   - Code block's marked lines darken (light) or lift (dark) their inks: syntax colours, line numbers and diff markers.
     Its syntax already failed on highlighted lines at the defaults, 3.97:1.
   - Box model's info values solve their darken on the recessed margin. Its neutral padding takes the dark lift.

Reopened for review, round 30: Segmented, Toggle group, Code block, Box model, Tag, Tag picker and Board.

## After the fixes

- **Final run:** 94 families × 18 settings. No errors and **no text under 4.5:1**; before the fixes about 1,000 items
  in 32 families failed.
- **Left by design:**
  - Segmented's and Toggle group's white thumb on its track, light only, ΔL 0.018–0.030, with its shadow and edge.
    0.024 is the approved default.
  - Calendar's today ring.
  - Chip's accent edge.
  - Command palette's row band at light contrast 0 (ΔL 0.028, a hover-level band).
- **Review page, round 30:** change detection now also renders at each theme's Layers extreme, light 90 + 0 and dark
  24 + 8; the density modes are gone with their axis. It compares colours by what paints, so a `color-mix()` that
  equals the old `rgb()` no longer counts as a change. The page's Layers switch shows any specimen at those settings.
- **Not checked:** hover and pressed states (the sweep reads rest states only), forced colours and the Electron window
  by eye.
