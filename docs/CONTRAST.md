# Color, stroke and focus

These are implementation and verification constraints, not a claim that every component
or custom composition is accessible. Keep the quiet appearance while preserving honest
limits and stronger indicators under increased contrast.

## Text and indicators

Small labels, placeholders and code are normal text and must meet 4.5:1. Hover does not
change that classification. The token suite also retains a supplementary APCA floor in
dark mode; APCA is not a WCAG conformance standard.

**Three text inks, each 4.5:1** (plan A3, 2026-11-11). `fg-default`, `fg-muted` and `fg-subtle` (meta: a placeholder, a
shortcut, a timestamp, line numbers) are all text, solved in the Layers model (`color/layers.ts`) on the grounds they sit
on: muted on the deepest selected fill pressed by the press room and on the soft-mark plates, subtle on each layer, its
rest fill and its hover fill (never a selected or pressed plate, where meta reads muted). The gate asserts each on the
text surfaces, the floating ground and the hovered plates (`contrast/assertions.ts`), and the Layers gate on every ground,
Layers step, tint and Text tint (`layer-checks.ts`). Dark muted is floored at #b9b9b9 (10.6:1 on the page), down from
#c5c5c5 (12:1, only 1.49 off the default ink): the plan's 8:1 is under the dark APCA content floor (Lc 60) on the fills
muted sits on, and the floor binds, so dark's default-to-muted step is 1.70 against light's 2.5 (`layers.test.ts`, "the
ink ladder"). In dark at the defaults subtle is muted for the same reason. Past the defaults both also keep the APCA
content floor on the lightest hover fill (`DARK_INK_APCA`, plan B, 2026-11-19): the text target alone left them at Lc 54
to 58 on a hovered menu row at the Layers extremes, and at 8 + 4 muted is #bbbbbb (#b9b9b9 measured Lc 59.5 on its
hovered row); the defaults are unchanged. Disabled ink is exempt (WCAG 1.4.3) and held to 1.9:1, and in dark to Lc 20 on
the raised layer as well (a black page with flat Layers had it at Lc 19.3).

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

**Outlines, marks and dark vivid inks follow the ground too** (`HOLD`, color/layers.ts; plan B, 2026-11-19). The tone and
hue outlines (`<tone>-border` at 1.3:1, `-border-strong` at 1.9:1 and, in dark, Lc 15), the light status and label marks
(`fg-<tone>-mark`, which the hue icons read, 3:1) and the dark vivid inks (`fg-<role>-vivid`, syntax, 4.5:1 and Lc 60 on
the code ground) are palette colours solved once, so as fixed rungs they missed their floors on a gray light page, on the
recessed grounds (subtle, tile, well, at the defaults too: 1.22:1 on `bg-well`) and on a lighter or black dark page with
raised Layers (the cross-setting sweeps, `src/sweeps/`). Each now keeps its colour wherever it holds its floor on the
ground under it and moves only as far as the floor needs where it does not: in light its linear sRGB scales down for the
deepest ground it can sit on (the recessed layer, a darker card, a tile, a well), which is the hued inks' mix toward black
solved per colour; in dark it scales up for the lightest (the raised layer, a lighter card, a tile, a well, a floating
surface; the code ground for the vivid inks), then its encoded sRGB for an APCA floor, and toward white where a channel
reaches 255. At the defaults only the light tone and hue outlines move (each about 1.31 / 1.92:1 on the well, 1.40 /
2.06:1 on the surface, from 1.31 / 1.92 there); dark and the marks are unchanged. Contrast then mixes each outline toward
its ink as before. The colour sweep measures each on every ground at every combination it crosses, against the floor its
own assertion declares, and the CSS paints what the sweep's model computes (2026-11-19: 192,000 values across 3,000
combinations painted in Electron, each within one 8-bit step of the model but for one boundary case noted in the plan).

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

## Tone contrast, the one deliberate exception

Tone contrast (`axes/tone-floor.ts`, 2026-11-02) lets a theme trade contrast for colour in one place: the words of the
status and label tones (`fg-danger`, `-warning`, `-caution`, `-success`, `-info`, `-discovery`, `-pink`, `-brown`) on the
grounds they are solved on. Its default, 4.5, is AA and is what every other check here assumes. Below it, down to 2.5,
a theme is **below WCAG AA for those words**, by the owner's choice, for brighter, more saturated status colour.

- **The gate follows the floor; it is never dropped.** `contrast/tone-floor.test.ts` checks every floor at every Tone tint
  (0 to 160) in both modes, at every Status strength: each tone's ink clears the floor on its tints at rest, hover and pressed, the page, the surface
  and the subtle ground, and in dark the floor's APCA too (Lc 60 at 4.5, 8 less per point, Lc 44 at 2.5). On a gray light
  page the floor's darken (`layer-light-floor-darken`) keeps the floor at every ground and layer step, and white never
  darkens the inks.
- **What never moves:** the accent's ink (links, selection), every neutral ink, words on a solid fill, the vivid inks,
  edges, focus and indicators. All of those keep the targets above at every floor.
- **More contrast wins.** Any raised Contrast, including the OS asking for more under System, puts every tone back at
  4.5, in the inks and in their darken.
- **Dark vivid inks are as colourful as the gate allows** (plan A10.2, 2026-11-11): the status and label tones' vivid inks
  (field and choice messages, a field's state edge, syntax) keep their rung's hue and take the most chroma sRGB holds at a
  lightness that still clears 4.6:1 and APCA 61 on the code ground (`scale.ts` `luminousDarkVivid`). APCA's content floor
  near black is what stops red: danger's vivid ink is #fe999e (chroma 0.12, was #feb0b3 at 0.09); success stays #02de68
  (0.22). So danger is no longer pale beside success, but cannot match its chroma without leaving the floor.
- **Where tone words show** (the stylesheets that read a floor tone's `fg-<tone>`, 2026-11-02): Surface's tone callouts,
  Link, Citation, Button's tone variants, Badge, Calendar, Tree view, File upload, Edit summary, Chip, Turn notice, Tag,
  Stepper, Step, Queue, Color, Box model, Board and Attachment. A theme that lowers the floor lowers it for all of them.
  Field and Choice messages use the vivid inks, which never move.

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
  `input-edge-soft` (a soft field's resting edge: the Fields stroke group's, or the strong edge) and `composer-edge`
  (Composer's frame: the card edge, or the strong stroke) follow the same switch, so every field reaches 3:1 under
  increased contrast (boundary sweep, 2026-10-15).
- `edge-<group>` (the twelve stroke groups, axes/stroke-groups.ts, 2026-10-30): a decorative amount of the text colour
  at standard contrast, which a group may set to 0; the level takes each one the rest of the way to `stroke-control`
  (3:1), so More restores every group's edge whatever its amount. A required boundary never rides a group (the fixed
  list in DESIGN_SYSTEM.md, "Strokes").

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
frame minimum on every ground, card tone and Layers step. The floating ground (`bg-float`, a step above the layers in dark, plan A7.2)
is one of those grounds: edges and fills in a menu or dialog step from it, and every ink is solved on its fills too.
A floating surface draws one edge per side (plan A7.1): its frame, which in dark takes the dark rim's strength, and the
rim only where no frame is; `check:rendered` asserts one luminance step across each dark floating edge.
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
(`field-focus-halo-color`). Increased contrast always adds the outline (the 3px ring at More) and widens the halo.
Composer keeps the quiet neutral edge (`composer-focus-color`). Invalid inputs retain their danger edge/context.

**A ring never sits flush on a solid fill** (plan A6.1, 2026-11-11). At the shipped Selection the ring is the neutral
solid, a solid Button's own fill, so a hugging ring read as the button growing 2px. A solid Button or Badge link places
its ring at `focus-solid-offset`: off the fill by `focus-gap` at Hug, Halo, Gap and Bold, so the ground shows between
them; under Inset it runs inside the fill one pixel in, in the fill's own ink (`focus-solid-inside` mixes the
component's on-colour in), so it touches the fill on both sides at the on-colour's contrast. A checked Checkbox or
Radio, an on Switch and other marks too small to hold a ring inside take `focus-gap` when filled. Every Focus ring
option stays; only the placement on a solid fill changes. The ring then touches the ground or the fill's ink, never its
own colour: at least 3:1 on both sides (`tests/behaviour/suites/focus.test.mjs` reads it in the browser).

**Focus answers Contrast More** (plan A6.3): at More (the Contrast setting's top level, or the system's increased
contrast preference) every ring is the Bold preset's 3px and stands off by `focus-gap`, whatever the Focus ring option;
the levels below More keep the option's ring. `focus-width` and `focus-offset` are derived from the setting's leaves
(`focus-ring-width`, `focus-ring-offset`) and Contrast in `emit/base.ts`, so every reader follows.

**Where the ring sits** is one table (DESIGN_SYSTEM.md, "The focus ring"), held by `cohesion.test.mjs`: controls at
`focus-offset`, containers and text at `focus-gap`, rows, tabs and cells inside by their own width, one indicator per
row (a ring or a plate, never both).

**The indicator rung** (owner, 2026-10-21: "the vibrant blue"). `focus-color` and `stroke-selected` are the accent's
lightest step from 500 that keeps WCAG 3:1 and APCA 45 on every neutral ground and fill (page to pressed) and 3:1 on
every tone's tinted surfaces' rungs, solved at alias time (`semantic/aliases.ts` `indicatorLevel`; in dark those rungs are
lighter than the derived tints that paint, so a ring that clears on them clears on the paint). For blue that is 550,
#0160d9, in light (500, #006df5, is 2.66:1 on the info tint's pressed fill) and #79aeff in dark (APCA on the near-black
page). ChatGPT's #3a83f7 is 3.64:1 on white but 2.94:1 on the light pressed fill (#e7e7e7), and APCA 38 on the dark page.

**An inactive control keeps its focus indicator at full strength** (components audit V2, 2026-11-07): it is drawn as
disabled by fading its parts, never the focusable element, since an opacity on the element fades its outline with it.
Its words may sit at the disabled opacity (an inactive control, as WCAG 1.4.3 exempts), but its reason may not: the
Tooltip's text, and a Menu row's note at the muted ink, keep 4.5:1. A Menu row's label takes that muted ink too, never
lighter, so the reason is never stronger than the label (plan B7.12).

Measure the actual painted opaque edge/outline against its ground. Measuring only the
source color of a translucent halo is insufficient. Preserve focus and selected/invalid
state simultaneously. Do not remove a native outline without supplying a visible replacement.

## State and forced colors

State is more than color. Use text, shape, icons and native/ARIA semantics as appropriate.
Control marks must have real positioned dimensions; do not depend on shadows alone for
selection. Foregrounds stay fixed on hover; disabled/read-only/loading remain distinct.
Disabled text is exempt from the text target but must stay visible on every ground. A read-only value keeps 4.5:1, and
a read-only field differs from the editable one by its fill (DESIGN_SYSTEM.md, "Disabled and read-only"). The behaviour
suite `states` measures both on every ground, in light and dark, at Layer contrast 0 and 100, Edge contrast 0 and 8,
Fields stroke 0 and 8, and at the tone settings' extremes. The lowest it measured on 2026-11-14 are: a disabled field's
value 2.08:1, a toned disabled Button's label 1.93:1 (ghost discovery on the danger tint), a neutral dimmed label
2.14:1, a read-only value 8.66:1, and the read-only fill 1.02:1 from the editable one.

**The quieter selected plate has a floor** (components audit V15, 2026-11-07): a selected row in a list without focus
steps back to the hover plate and never further, so its words keep the contrast asserted on `bg-component-hover`
(`contrast/assertions.ts`) and the plate keeps Hover fill's step from its ground (25 at the least, never transparent).
The row's own mark (a List box check, a Table checkbox) still says which is selected.

**The accent's selected plate keeps a step from hover** (`SELECTED_STEP`, color/layers.ts; plan B, 2026-11-19). At
Selection Accent a selected row is the accent's soft surface, which at a low Accent strength nears grey: at 30 (and 60 in
dark) it sat within the Layers gate's smallest hover step of the hover plate (ΔE OK 0.005). The plate (and its hover) now
keeps that step plus a rounding margin (0.011 light, 0.037 dark) from each ground's hover plate: where its hue and chroma
already make it, it keeps its colour; elsewhere its lightness moves away from hover by the rest, on the side it sits on
(past hover, darker in light and lighter in dark, where it sits on it). Hover never moves. Its words hold on the moved
plate: the selection ink at 5.1:1 or more in light and Lc 66 in dark; dark muted text (a count) measures Lc 59.1 at the
lowest, above the Lc 58.7 it has on the neutral selected plate of the same ground.

`packages/styles/src/forced-colors.css` uses system colors for required marks, selected
states, invalid indications and focus; Select restores its native arrow. These rules do
not replace native Windows forced-colors execution or assistive-technology testing.
Respect motion preferences without removing the meaning of loading/progress states.

## Verification

Run `npm test` and `node packages/tokens/src/contrast/report.ts` for token/color/focus/state
changes. **Which inks meet 4.5:1 and 3:1 on which grounds** is [Contrast pairings](CONTRAST_PAIRINGS.md), generated
from this suite's own model and measure at the shipped defaults, light and dark (`contrast/pairings.ts`; plan F7,
2026-11-11). It reports, it does not grant: a supported pairing is an assertion in `contrast/assertions.ts`.
`pairings.test.ts` fails when the table is stale; a token or curve change rewrites it with
`node packages/tokens/src/contrast/pairings.ts --write`. Brand themes (`semantic/brand.ts`) can take any colour, so `contrast/brand.test.ts`
samples them: the reference brands, edge colours (near grey, white, black, neon) and 500
seeded brands over hue, chroma and lightness, every assertion plus `BRAND_ASSERTIONS` (the
accent pairings on secondary and tertiary, each supporting tone's label, brand-surface text)
in both modes, and 60 of them at Saturation 30, Shade 200 and 850, and fixed status. Data colours have their own gate,
`contrast/series.test.ts`, at every Series lightness, both modes, sRGB and Display P3: neighbours ΔE ≥ 8 under simulated
protanopia and deuteranopia (Machado 2009) and ≥ 15 under normal vision, marks at chroma ≥ 0.10 and ≥ 3:1 on every
shipped ground, a number ≥ 4.5:1 on its fill, ramps one hue with steps ≥ 0.06 apart in lightness (the dataviz
validator's thresholds; its dark lightness band is not held, by the owner's choice of luminous dark marks). The report exits nonzero for failures. `npm run build` does not run this gate.
Check rendered paint and keyboard-triggered focus in the app (Inspector › Theme › Contrast at
Standard, Medium and More), plus the component's real interactions. Validate the actual foreground/background/edge combinations
introduced by a change, including nested themes and relevant contrast preferences.

Cross-browser, OS preference, forced-colors and screen-reader coverage must be reported
separately. Custom overrides, image backgrounds and other consumer compositions need their
own verification. See [Development](DEVELOPMENT.md) for the remaining release boundary.
