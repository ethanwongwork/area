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
conformance on arbitrary backgrounds. See the retained
[paint measurements](../archive/docs/batches/V01/README.md) for historical results.

## Roles

- `border-decorative`: container seams, section/table rules and dividers; never the only
  control or state cue. Its design floor is not a required-indicator accessibility floor.
- `border-faint`, `border-subtle`, `border`, `border-hover`: supplementary visual definition.
- `stroke-control`, `stroke-control-hover`, `stroke-selected`: strong endpoints for
  control identification and selection.
- `stroke-width`: required edges, independent of Surface. `border-width` is decorative;
  removing a container frame must not erase a control or focus indicator.
- `edge-control`, `edge-control-hover`, `edge-selected`, `edge-accent`, `fill-toggle`:
  presentation roles selecting quiet or strong endpoints according to contrast preference.

`data-area-contrast="more"` selects strong endpoints; `standard` resets them locally.
Without a root preference, CSS follows `prefers-contrast: more`. Derivations must be
re-emitted at axis and preference boundaries. Text/invalid colors remain independent.

Components consume semantic roles. Keep palette values verbatim. Tonal supplementary
borders are measured blends of existing readable ink and canonical surface; their design
floors do not replace required-indicator checks. Keep foregrounds unchanged on hover.
Syntax colors are measured against the actual code background, including dark-mode APCA.
Never lower a floor or add a waiver to hide a failure.

## Focus

Use `focus-color`, `focus-width` and `focus-offset` for ordinary control focus. Required
focus geometry is independent of elevation. Editable fields use `field-focus-*` roles:
a neutral opaque edge and translucent halo in standard mode, returning to an accent
outline in increased contrast. Invalid inputs retain their danger edge/context.

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
