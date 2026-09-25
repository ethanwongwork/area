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
and the resolver. Preserve the palette's light-end and neutral lightness anchors and all
gamut constraints. Chromatic dark-end lightness adjustments must remain explicit, bounded
tables so they cannot silently move surface grounds or the white-label contrast wall.

Component CSS consumes semantic colors, not numbered palette rungs. During the visual-first
phase, a measured color with no matching role may be a `light-dark()` spec literal. Tone means meaning;
treatment means emphasis. Reuse `neutral`, `accent`, `info`, `success`, `warning`,
`caution`, `danger` and `discovery` where applicable. Additional roles require a clear job.
Foreground does not change on hover. Text weight is independent of type role: 400 for text
and every title or heading; 500 only for labels on fills (buttons, segmented options,
badges, counts, avatar initials). Text uses two foreground levels, default and muted;
disabled is for disabled and placeholder text only.

Use `border-decorative` for container seams and dividers only. Required control/state
edges use `stroke-width` independently of Surface. Most controls use the shared focus
color/width/offset; editable fields use their field-focus roles. Preserve standard and
increased-contrast behavior. Never weaken thresholds or add a waiver just to pass a test.
See [Contrast](CONTRAST.md) before changing color, focus or state painting.

## CSS, manifest and React

CSS lives in `packages/styles/src/`, under `@layer area.components`. Follow `button.css`:
variants set local slots and the base rule consumes them. Size rules select tier tokens.
Every dimension traces to a token, a documented hairline or mask geometry, or, during
the current visual-first phase, a measured spec value in a private property marked
`/* spec */` (see [Building a component](COMPONENT_ADAPTATION.md#5-build)).

Update `manifest.ts` with CSS selectors, elements, modifiers and states. The parity check
runs in both directions. React helpers derive variant values from the manifest; wrappers
still need to forward native props and refs and render the right slots.

- Blocks: `.area-badge`; parts: `.area-badge__dot`; modifiers: `.area-badge--outline`.
- CSS modifiers stay kebab-case; React boolean props use camelCase (`fullWidth`).
- Keep tone, treatment, size, state, layout and composition orthogonal.
- Name public axes for what they change: `variant` for visual treatment, `tone` for
  semantic color, `size` for scale, `orientation` for direction, `layout` for
  arrangement, and `kind` for a component's interaction role. Use a boolean for an
  independent option that can combine with other choices. Values should be short and
  should not repeat the axis name in React props. A CSS modifier may keep a prefix
  when it prevents a collision with another modifier on the same block.
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
32px with 14/20px type; compact medium is 28px with 13/18px type. The UI type ramp is six
sizes with one leading each on the 4px grid: 12/16, 14/20, 16/24, and titles 20/28, 24/32,
32/40 (see [the type spec](specs/typography.md)). Read the current ramps
in `axes/density.ts` rather than copying tables into each component.

Public component size families default to `md`. Expose `sm` when a component has a real
compact-composition use case and `lg` when it needs a more prominent or touch-oriented
target; do not expose `xs`/`xl` merely because the internal token ramp contains them.
Product-wide compactness belongs to the UI-scale axis, so consumers do not have to set a
smaller size on every instance. Specialized layout/content roles such as Panel insets and
Kbd labels may use their own vocabulary because they are not interchangeable control
heights.

Do not force control heights onto labels, glyphs or containers. Badge has a dedicated
20/24/28px label ramp and pill shapes; Checkbox/Radio use the icon ramp. Switch has
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

Use Fluent's size-specific cuts and the vendored Area marks. Area-drawn icons (the pilot
set and presence status glyphs) are stroked at `--area-weight-icon`, 1.125px for Geist; see
[the icon spec](specs/icons.md). Generate with
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

### Example copy

Every demo and gallery specimen uses one placeholder vocabulary, so what a reader
compares is type, rhythm and alignment rather than a borrowed product story. Reach for
the slot's own name:

- `Button`, `Badge`, `Chip`, `Code` — a specimen that stands for itself.
- `Title`, `Label`, `Description`, `Body text` — headings, labels, supporting text and a
  message body.
- `Action`, `Secondary`, `Cancel`, `Delete`, `Undo` — buttons inside a composition.
- `Item one`, `Option one`, `Value`, `1` — repeated content, choices, values and figures.
  A control that shows every option inline (Segmented, Tabs, a chip row) uses the short
  ordinal instead (`One`, `Two`, `Item one`), so the track does not truncate.
- `Placeholder`, `Error message`, `Success message`, `Warning message` — attributes and
  validation text.

Size tiers name their tier (`Small`, `Medium`, `Large`); a treatment or tone matrix names
the value it shows. An icon-paired label (`Align top`, `Add item`) keeps the meaning the
glyph carries, and a verification fixture (long text, RTL, doubled zoom) keeps the text
that makes the failure visible. Do not invent a product, a person or a domain: an email
label, a colleague's name or a project noun dates badly and pulls attention away from
the geometry the example exists to show.

Docs CSS must not target `.area-*` or silently override shared components. It lives in
`area.base`, before components; the utilities exception is for rail visibility only.
Use `table()` and `tokenSection()` in `layout.mjs`. A backtick inside its `DOCS_CSS` or
`DOCS_SCRIPT` template literal breaks parsing, even in a comment.

Inspect default/compact, light/dark, relevant radius extremes, narrow widths and states
for visible changes. Long labels, RTL, enlargement, reduced motion and forced colors
remain verification concerns even when they are not gallery tiles. Use the checks in
[Development](DEVELOPMENT.md); record material limitations rather than claiming that
one passing screenshot or token suite proves the whole library accessible.
