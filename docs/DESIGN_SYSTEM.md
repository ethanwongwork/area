# Design system

Shared tokens make a broad component library coherent. Components should gain useful
capabilities without developing their own independent colors, dimensions or theme logic.
The current CSS, token definitions and manifest are the source of exact values.

## Token layers and customization

1. **Primitives:** palette, spacing, type, icon and geometric scales.
2. **Semantic roles:** foreground, background, control edge, focus, motion and elevation.
3. **Component roles:** stable, independently useful theming hooks such as
   `--area-input-inline-size` and the Badge scale.
4. **Private slots:** `--_*` properties set by a component's variants and consumed by its
   base rule. These are implementation details, not a public theme API.

Reuse a semantic role when the job is the same. Add a component token when the role has a
stable meaning and needs independent customization. Give it a sensible existing-token
fallback, a consumer and checks. Do not add aliases merely to hide unexplained literals.

The registered axes are `theme`, `neutral`, `accent`, `ui`, `radius`, `surface` and
`motion`. UI scale combines type and density. `data-area-contrast` is a separate
accessibility preference. See [Theming](THEMING.md) for inheritance and custom values.

Axis namespaces are disjoint. Interactions belong in `packages/tokens/src/emit/base.ts`;
re-emit derived values on every relevant scope boundary. Never register a derived token
or paired semantic color with `@property`: early resolution would freeze inherited values.
Validate both polarity maps and emitted maps; an exact namespace claim ends in `:`.

## Color and focus

Keep `packages/tokens/src/color/palette.json` verbatim. Hue/chroma tuning belongs in the
explicit adjustment tables in `color/curves.ts`; semantic selection belongs in `INVERSION`
and the resolver. Preserve the palette's lightness anchors and gamut constraints.

Component CSS consumes semantic colors, not numbered palette rungs. Tone means meaning;
treatment means emphasis. Reuse `neutral`, `accent`, `info`, `success`, `warning`,
`caution`, `danger` and `discovery` where applicable. Additional roles require a clear job.
Foreground does not change on hover. Text weight is independent of type role: 400 or 500.

Use `border-decorative` for container seams and dividers only. Required control/state
edges use `stroke-width` independently of Surface. Most controls use the shared focus
color/width/offset; editable fields use their field-focus roles. Preserve standard and
increased-contrast behavior. Never weaken thresholds or add a waiver just to pass a test.
See [Contrast](CONTRAST.md) before changing color, focus or state painting.

## CSS, manifest and React

CSS lives in `packages/styles/src/`, under `@layer area.components`. Follow `button.css`:
variants set local slots and the base rule consumes them. Size rules select tier tokens.
Every dimension traces to a token except documented hairlines or mask geometry.

Update `manifest.ts` with CSS selectors, elements, modifiers and states. The parity check
runs in both directions. React helpers derive variant values from the manifest; wrappers
still need to forward native props and refs and render the right slots.

- Blocks: `.area-badge`; parts: `.area-badge__dot`; modifiers: `.area-badge--outline`.
- CSS modifiers stay kebab-case; React boolean props use camelCase (`fullWidth`).
- Keep tone, treatment, size, state, layout and composition orthogonal.
- Use native state/ARIA for behavior and accessible meaning; documented `data-*`
  attributes are painting hooks. A data-disabled flag cannot disable a native button.
- Use logical properties so direction follows the enclosing scope.
- Prefer native behavior. A custom composite needs a complete keyboard, focus, value,
  dismissal and form contract before claiming that behavior.
- A controlled value is owned by the parent; uncontrolled state must synchronize with
  native input and form reset. Visible, submitted and announced values must agree.

CSS and wrappers are not both generated from the manifest. The shared contract and
checks prevent drift; they do not replace implementation or behavior tests.

## Size and shape

A control tier describes its outer row/control height where that family uses the control
ramp. Shared controls use the same tier's icon, text and gap tokens. Default medium is
32px with 14/20px type; compact medium is 28px with 13/18px type. Read the current ramps
in `axes/density.ts` rather than copying tables into each component.

Do not force control heights onto labels, glyphs or containers. Badge has a dedicated
20/24/32px label ramp and a pill identity; Checkbox/Radio use the icon ramp. Switch has
its own track geometry. Kbd and Token have separate content roles. These current
constructions do not confer completion on unrefined families.

Radius uses the named `sharp`, `subtle`, `soft`, `standard`, `round`, `rotund` and `pill`
presets in `axes/radius.ts`. Choose control, row, small or container roles and respect
the box cap. Identity circles/pills use `radius-full` deliberately; never impose the
radius axis on every shape. Nested radius is `max(0, outer radius - actual inset)`,
with the appropriate box cap. Measure painted bounds when browser clamping matters.

Keep pointer targets separate from visible glyphs. A visually compact choice control
can use its label/hit area without enlarging the glyph. Check spacing between targets.
Contained controls share their width token in standalone and Field compositions;
full-width is explicit rather than an accidental consequence of the docs grid.

## Optical insets

`packages/styles/src/inset.css` is the shared implementation.

- Icons use full square slots, not path bounds. Use one font cap-to-baseline reference
  for all text, with safety space for accents and descenders. Never nudge a glyph or word.
- For backplate height H and edge-item reference height B, outer inset is `(H - B) / 2`.
  CSS padding subtracts the border once. Calculate leading and trailing ends independently.
- Swatches, dots, avatars and nested controls use their own boxes. A parent reserves an
  action button's box; that button owns its icon inset. Do not size the action to its icon.
- Multiline icons align to the first text line, with equal top and leading insets and
  room below. Preserve line spacing; do not center an icon against the whole paragraph.
- Use matching tier icon/text/gap tokens. Menu/Nav and message content use medium UI type.
  Supporting descriptions use at least small UI type; tiny chrome text is for compact
  elements such as badges, keycaps and tooltips.
- Framework-free markup uses the same label/text slots as React. Native editable controls
  retain browser editing metrics; do not assume trimmed DOM text metrics apply to them.

## Icons and technical labels

Use Fluent's size-specific cuts and the vendored Area marks. Generate with
`node apps/docs/scripts/gen-icons.mjs`; never hand-edit generated assets or redraw a
replacement. Preserve original SVG markup, stroke attributes and both regular/filled sets.
Icons use the 12/16/24px ramp; a status dot and a keyboard glyph have different roles.

Code represents identifiers and inline source; Token is its token-name/swatch compatibility
composition. Kbd represents one simultaneous chord; KbdGroup a sequence. Badge represents
status/metadata; Chip represents an interactive compact choice. Do not merge these jobs
because they have similar silhouettes.

## Documentation and verification

Demos and snippets come from the same source. Pages begin with a standalone default,
then supported sizes/treatments, states and compositions. Gallery names and completion
rules are in [Components](COMPONENTS.md).

Docs CSS must not target `.area-*` or silently override shared components. It lives in
`area.base`, before components; the utilities exception is for rail visibility only.
Use `table()` and `tokenSection()` in `layout.mjs`. A backtick inside its `DOCS_CSS` or
`DOCS_SCRIPT` template literal breaks parsing, even in a comment.

Inspect default/compact, light/dark, relevant radius extremes, narrow widths and states
for visible changes. Long labels, RTL, enlargement, reduced motion and forced colors
remain verification concerns even when they are not gallery tiles. Use the checks in
[Development](DEVELOPMENT.md); record material limitations rather than claiming that
one passing screenshot or token suite proves the whole library accessible.
