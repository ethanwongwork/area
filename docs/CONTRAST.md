# Color, stroke and focus

These are implementation and verification constraints, not a claim that every component
or custom composition is accessible. Keep the quiet appearance while preserving honest
limits and stronger indicators under increased contrast.

## Text and indicators

Small labels, placeholders and code are normal text and must meet 4.5:1. Hover does not
change that classification. The token suite also retains a supplementary APCA floor in
dark mode; APCA is not a WCAG conformance standard.

Tinted grays (Tint hue and strength, `axes/tint.ts`) keep these targets by construction: the inks are solved for
lightness as if every colour were gray, and a tint changes a colour's luminance at the same lightness, so text moves 0.25
× the tint's strength away from its ground (`INK_MARGIN`, color/layers.ts). Without it a 0.005 tint put muted text under
4.5:1 on some hues; with it every hue at every strength and every Text tint share passes the Layers gate in both modes
(docs/research/custom-neutral-2026-10-22/). An untinted gray moves 0, so Neutral is unchanged.

A tint is held inside what sRGB can show at its hue and lightness (`tintRoom`, color/layers.ts, 2026-10-23), never clipped:
Chromium clips an out-of-gamut colour per channel, which moves its luminance and hue, and from Tint 12 that tipped control
edges on red and orange pages under 3:1. On a tinted light page the hued inks (vivid and tonal) darken as if the page were
0.25 × the tint's strength darker (`HUED_INK_MARGIN`, past the Neutral setting's own Cool and Warm casts), since a tint
lowers a page's luminance at the same lightness: a red tint at 8 on a 92 page had left danger's vivid ink at 4.3:1.
`layers.test.ts` checks every vivid and tonal ink, of every named accent and every hue at full and lowest strength, on
every tinted page (hues in 15° steps, Tint 1 to 16).

Any accent the settings can make is gated too (`contrast/accents.test.ts`): every pairing that reads an accent token, on
the palette's eleven and the 72 hues, at every Accent strength, on every neutral, in both modes, and the solid pairings at
every Solid step and Label tint, and every pairing with Status colours Match at every strength, about four million
measurements. Accent strength is the mix the solvers walk with, so the gate measures what
paints (the CSS and the model agree to the channel, measured in the browser 2026-10-23).

Required boundaries and state indicators need a distinct signal against their adjacent
surfaces. Area's increased-contrast preference targets at least 3:1 for these roles.
The standard soft presentation falls below that threshold in some cases and must not be
presented as universally conforming. A token test passing is not proof of rendered
conformance on arbitrary backgrounds. Historical paint
measurements are in Git history (`archive/docs/batches/V01/`, removed after commit `2f90f2d`).

## Roles

- `border-decorative`: seams inside a container (Panel, Code block and Command palette rules, Menu
  and Toolbar separators) and the edges of filled shapes; never the only control or state cue. Its
  design floor is not a required-indicator accessibility floor. `border-float` frames floating surfaces.
- `border-divider`: rules that stand on their own (Separator, Tabs track, Table rows and frame).
- `border-faint`, `border-subtle`, `border`, `border-hover`: supplementary visual definition.
- `stroke-control`, `stroke-control-hover`, `stroke-selected`: strong endpoints for
  control identification and selection.
- `stroke-width`: required edges, independent of Surface: controls, fields, state, swatch rings,
  cutouts, joined-control seams, standalone dividers and frames with no shadow. `border-width` is
  decorative (frames of shadowed surfaces and their seams); removing a container frame must not erase
  a control or focus indicator ([Strokes](DESIGN_SYSTEM.md#strokes)).
- `edge-control`, `edge-control-hover`, `edge-selected`, `edge-accent`, `fill-toggle`:
  presentation roles selecting quiet or strong endpoints according to contrast preference.
  `input-edge-soft` (a soft field's resting edge: none, or the strong edge) and `composer-edge` (Composer's
  frame: the card edge, or the strong stroke) follow the same switch, so every field reaches 3:1 under increased
  contrast (boundary sweep, 2026-10-15).

Contrast is a level, `--area-contrast-more` from 0 to 1, in nine steps since 2026-10-22 (owner: "i want more
granularity in those options"): `data-area-contrast="0"` (Standard) to `"8"` (More), an eighth a step. The names
`"standard"` (0), `"medium"` (0.5, owner 2026-10-18: More "seems very extreme"; Material 3's Standard / Medium / High) and
`"more"` (1) stay as aliases of 0, 4 and 8. Every derivation mixes by the level, so every step sits its share of the way. It also brings Surface 0's frames back
at 1px at any raised level (`border-width` = the Surface's `frame-width`, or 1px; owner, 2026-10-15), as macOS Increase
Contrast adds borders and forced colours restore them. The soft edge (`shadow-edge`) is drawn only while no frame is,
so the returned frame replaces it rather than doubling it (audit 2026-10-18). A Hairline frame (Surface 0.5) becomes 1px at any raised level, as
no system surveyed thickens 1px to 2px for contrast (Edge and Depth research, finding 6).

The Stroke control (Edge and Depth, `axes/depth.ts`, 2026-10-18) sets where every stroke starts: its distance from the
ground is today's × n/4 (`color/layers.ts` `strokeEdge`). Contrast then moves it toward the strong stroke from there,
by the same share, so More still reaches 3:1 at every Stroke; Stroke 0 leaves strokes to Contrast alone. Shadows never strengthen with Contrast. Rails and toggle fills read the unscaled edge
(`rawEdge`), since they are fills.

Every stroke moves with the level, by the same share (owner, 2026-10-18: "some components get an obviously darker
stroke whereas some components dont visibly change at all"). Each mixes from its standard value by the level: every
neutral rest edge (`border-decorative`, `-card`, `-float`, `-faint`, `-divider`, `-subtle`, the control edges, Composer's
frame, the swatch ring, the soft Button's edge) toward `stroke-control`, every hover edge (`border`, `border-hover`, the
control hover edges) toward `stroke-control-hover`, and every tonal stroke (`<tone>-border`, `-border-strong`, written
by the axes as `<token>-rung`) toward its tone's ink (`fg-<tone>`). So at More every quiet stroke is the 3:1 stroke
(#83, 3.8:1 on white) and at Medium about 2:1, whatever it started at; the gallery sweep (2026-10-18) found all 202
light strokes under 2.8:1 moving, and in dark all but Tooltips (an inverse surface), the Video player's on-media button
and Color field's inner opacity seam. Strokes already strong (checked marks, today's ring) and cutouts stay.
(A first pass, the same day, moved seams and frames a third of the way while control edges went all of it; it read as
two settings.) A soft Button's edge mixes toward its outline's line, itself already mixed, so at Medium it goes about a
quarter of the way.
Edges are measured from the ground under them (2026-10-23; DESIGN_SYSTEM.md, Layers). A ground darker than the page
(light) or lighter than the raised layer (dark) moves every edge role, rails included, by its distance, mixed by
(1 − the Contrast level), which is exact for an OKLab mix: each level still lands where it did, and at More every edge
is the strong stroke, which is solved on the deepest ground already. `layers.test.ts` checks every edge's distance and the
frame minimum on every ground, card tone and Layers step.
Rails are fills, not strokes: `fill-track` / `fill-track-hover` (Progress, Meter, Slider, the off Switch) keep their value
at every level, since the fill or thumb on them is what has to read (under More the 3:1 rail left an accent fill 1.2:1).
Switch outlines instead, as macOS does: its edge and an off thumb's ring take the strong stroke.
Without a root preference, CSS follows `prefers-contrast: more`. Derivations must be
re-emitted at axis and preference boundaries. Text/invalid colors remain independent.

Components consume semantic roles. Keep palette values verbatim. Tonal supplementary
borders are measured blends of existing readable ink and canonical surface; their design
floors do not replace required-indicator checks. Keep foregrounds unchanged on hover.
Syntax colors are measured against the actual code background, including dark-mode APCA.
Never lower a floor or add a waiver to hide a failure.

## Focus

Use `focus-color`, `focus-width` and `focus-offset` for control focus and `focus-gap` off containers and text; the
Focus ring setting sets all three (`axes/states.ts`, 2026-10-21). Required focus geometry is independent of elevation.
Editable fields use `field-focus-*` roles: at Hug (the default, ChatGPT's) a 2px ring on the field's edge; at Halo
(audit S1, owner 2026-09-30) the 1px edge takes `focus-color` and a 2px halo of the same colour at 14%
(`field-focus-halo-color`). Increased contrast always adds the 2px outline and widens the halo.
Composer keeps the quiet neutral edge (`composer-focus-color`). Invalid inputs retain their danger edge/context.

**The indicator rung** (owner, 2026-10-21: "the vibrant blue"). `focus-color` and `stroke-selected` are the accent's
lightest step from 500 that keeps WCAG 3:1 and APCA 45 on every neutral ground and fill (page to pressed) and 3:1 on
every tone's tinted surfaces, solved at alias time (`semantic/aliases.ts` `indicatorLevel`). For blue that is 550,
#0160d9, in light (500, #006df5, is 2.66:1 on the info tint's pressed fill) and #79aeff in dark (APCA on the near-black
page). ChatGPT's #3a83f7 is 3.64:1 on white but 2.94:1 on the light pressed fill (#e7e7e7), and APCA 38 on the dark page.

Measure the actual painted opaque edge/outline against its ground. Measuring only the
source color of a translucent halo is insufficient. Preserve focus and selected/invalid
state simultaneously. Do not remove a native outline without supplying a visible replacement.

## State and forced colors

State is more than color. Use text, shape, icons and native/ARIA semantics as appropriate.
Control marks must have real positioned dimensions; do not depend on shadows alone for
selection. Foregrounds stay fixed on hover; disabled/read-only/loading remain distinct.

`packages/styles/src/forced-colors.css` uses system colors for required marks, selected
states, invalid indications and focus; Select restores its native arrow. These rules do
not replace native Windows forced-colors execution or assistive-technology testing.
Respect motion preferences without removing the meaning of loading/progress states.

## Verification

Run `npm test` and `node packages/tokens/src/contrast/report.ts` for token/color/focus/state
changes. Brand themes (`semantic/brand.ts`) can take any colour, so `contrast/brand.test.ts`
samples them: the reference brands, edge colours (near grey, white, black, neon) and 500
seeded brands over hue, chroma and lightness, every assertion plus `BRAND_ASSERTIONS` (the
accent pairings on secondary and tertiary, each supporting tone's label, brand-surface text)
in both modes, and 60 of them at Saturation 30, Shade 200 and 850, and fixed status. The report exits nonzero for failures. `npm run build` does not run this gate.
Check rendered paint and keyboard-triggered focus in the app (Inspector › Theme › Contrast at
Standard, Medium and More), plus the component's real interactions. Validate the actual foreground/background/edge combinations
introduced by a change, including nested themes and relevant contrast preferences.

Cross-browser, OS preference, forced-colors and screen-reader coverage must be reported
separately. Custom overrides, image backgrounds and other consumer compositions need their
own verification. See [Development](DEVELOPMENT.md) for the remaining release boundary.
