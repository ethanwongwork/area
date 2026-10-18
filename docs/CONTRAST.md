# Color, stroke and focus

These are implementation and verification constraints, not a claim that every component
or custom composition is accessible. Keep the quiet appearance while preserving honest
limits and stronger indicators under increased contrast.

## Text and indicators

Small labels, placeholders and code are normal text and must meet 4.5:1. Hover does not
change that classification. The token suite also retains a supplementary APCA floor in
dark mode; APCA is not a WCAG conformance standard.

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

Contrast is a level, `--area-contrast-more` from 0 to 1: `data-area-contrast="standard"` (0), `"medium"` (0.5,
owner 2026-10-18: More "seems very extreme"; Material 3's Standard / Medium / High) and `"more"` (1), which selects the
strong endpoints. Every derivation mixes by the level, so Medium sits half way. It also brings Surface 0's frames back
at 1px at any raised level (`border-width` = the Surface's `frame-width`, or 1px; owner, 2026-10-15), as macOS Increase
Contrast adds borders and forced colours restore them.

Every stroke moves with the level (owner, 2026-10-18: More "doesn't seem to apply to all components evenly"; it only
moved control edges, #e2 → #83, while seams, frames and dividers stayed): each `border-*` role goes a third of the way
to `stroke-control` at More (`CONTRAST_EDGE_SHARE`, color/layers.ts), so on white a seam steps #f3 → #df → #cc, a card
frame #ee → #db → #c9, a divider #e2 → #d2 → #c1, and a control edge #e2 → #aa → #83, the order between them kept.
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

Use `focus-color`, `focus-width` and `focus-offset` for ordinary control focus. Required
focus geometry is independent of elevation. Editable fields use `field-focus-*` roles
(audit S1, owner 2026-09-30): the 1px edge takes `focus-color` and a 2px halo of the same
colour at 14% (`field-focus-halo-color`, the tone halos' alpha; ChatGPT's 1px blue focus
edge), in light and dark. Increased contrast adds the 2px outline and widens the halo.
Composer keeps the quiet neutral edge (`composer-focus-color`). Invalid inputs retain their danger edge/context.

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
changes. The report exits nonzero for failures. `npm run build` does not run this gate.
Use `contrast.html` for rendered paint and keyboard-triggered focus checks, plus the
component's real interactions. Validate the actual foreground/background/edge combinations
introduced by a change, including nested themes and relevant contrast preferences.

Cross-browser, OS preference, forced-colors and screen-reader coverage must be reported
separately. Custom overrides, image backgrounds and other consumer compositions need their
own verification. See [Development](DEVELOPMENT.md) for the remaining release boundary.
