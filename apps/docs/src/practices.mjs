/**
 * Per-component guidance.
 *
 * Kept separate from `pages.mjs` so the page definitions stay a list of examples. Each
 * entry is one sentence of the kind that is only learnable by getting it wrong: what the
 * component is for, what it is not for, and the accessibility consequence of choosing
 * badly. Nothing here restates the API table.
 */
const code = (text) => `<code class="area-code">${text}</code>`;

export const PRACTICES = {
  checkbox: [
    `Use Checkbox for independent choices. Native checked, indeterminate and focus states keep one fixed border-box; selecting fills the existing shape rather than changing its size.`,
    `Choose xs through xl on the icon ramp. Adjacent tiers may share a glyph size while their label type and spacing differ. Labels follow density rather than the prose scale.`,
    `Give a CheckboxGroup a visible, strong group label. Captions and validation messages use the small UI pairing — not microcopy — with a consistent 4px label-to-caption and 12px section rhythm.`,
    `Use red for an individually invalid Checkbox, including its checked state; do not combine an accent fill with an error edge. In a group, keep option labels neutral and put the red on the error message and unresolved option marks.`,
    `Standard mode matches the selected boundary to its fill; increased contrast restores the strong selected edge. Focus remains distinct in both modes.`,
  ],
  radio: [
    `Use RadioGroup for one choice from a short, visible set. It owns the native legend, shared name, group description and group-level error; Radio owns an individual option.`,
    `Prefer a vertical group. Use ${code('orientation="horizontal"')} only for short, immediately comparable labels with enough room to wrap the whole option without truncating it.`,
    `Give every Radio a distinct ${code("value")}. The group supports ${code("value")} / ${code("onValueChange")} for controlled use or ${code("defaultValue")} for native-like uncontrolled selection.`,
    `Use Checkbox for multiple choices, Switch for an immediate on/off setting, and Select or Combobox when the list is too long to scan.`,
    `Selection fills the existing outer circle. The five size tiers follow the same icon and label ramps as Checkbox.`,
  ],
  switch: [
    `Use Switch for settings that take effect immediately. Give it a stable label; use Checkbox for deferred submission.`,
    `The identity shape is always pill. Opt into rounded only when the themed track and concentric rectangular thumb are intentional.`,
    `Tracks are 24×12, 28×16, 40×20, 40×20 and 48×24px in both densities. Compact changes type, not track geometry. Thumb media promotes the two smallest tracks.`,
    `Promise callbacks provide optimistic uncontrolled updates and rollback. A controlled parent owns checked state and rollback. Read-only, busy and disabled-focusable controls block activation but retain native form semantics.`,
    `Keep labels stable and slots decorative. Use an accessible name when hiding the visible label; do not place links or buttons inside a Switch label. Custom colors must be supplied as a contrast-tested foreground/background pair.`,
  ],
  code: [
    `Use Code for short commands, identifiers, literal values and design-token names inside a sentence. Use CodeBlock for multiple lines.`,
    `Token is the same inline reference treatment with an optional colour swatch. Use Kbd for a keyboard key and Badge or Chip when the content is status or a choice.`,
  ],
  "code-block": [
    `Pass plain text through code. The html prop inserts pre-highlighted markup directly; only supply trusted or sanitized HTML.`,
    `Actions belong in the actions slot at the upper right. The component does not implement copying; the consumer owns that behavior.`,
    `Use flush only inside an existing frame. The standard treatment supplies the surface and decorative edge.`,
  ],
  button: [
    `Use one solid ${code("neutral")} button per view. It is the strongest call to action a neutral palette can make, and a second one halves the value of the first.`,
    `Reach for ${code("accent")} when the action should follow the accent, and ${code("neutral")} when it should stay the strongest thing on the page whatever the accent axis is set to. Emphasis is the variant\u2019s job, not the tone\u2019s: solid, outline and ghost span it on every tone.`,
    `${code("danger")} is for actions that destroy data, not for actions that merely cancel. A cancel button is ${code("ghost")}.`,
    `Give every ${code("iconOnly")} button an ${code("aria-label")}. The glyph is decorative and hidden from assistive tech.`,
    `Set ${code("loading")} rather than disabling by hand. It disables the button, swaps the leading icon for a spinner, and sets ${code("aria-busy")} — which ${code("disabled")} alone does not communicate.`,
    `Use ${code("align")} only on ${code("ghost")} buttons. It pulls the button back by its own padding so the label lines up with the text above it, which is wrong wherever there is a visible edge.`,
  ],
  input: [
    `Always pair an Input with a ${code("Field")}, or give it an ${code("aria-label")}. A placeholder is not a label — it disappears the moment someone types.`,
    `Use ${code("leadingIcon")} or ${code("trailingIcon")} for decorative context. The old ${code("icon")} prop remains a deprecated leading alias. Use ${code("InputAction")} in ${code("trailingAction")} for one named icon action: it has a density-owned square slot and an accessible hover/focus tooltip. Grouped actions belong in a separately audited input-group composition.`,
    `Use ${code("prefix")} and ${code("suffix")} for units and symbols that are not editable, such as a currency mark or a domain.`,
    `Set ${code("invalid")} or ${code("validationStatus")} rather than colouring the border yourself. Error, success, and warning keep the 1px edge and soft halo in the same context color.`,
    `Focus preserves the 1px boundary, moves it one neutral step darker, and adds a soft 2px halo. Increased contrast adds the stronger 2px accent outline.`,
    `Use ${code('variant="soft"')} on an existing surface when a quieter neutral boundary is appropriate. Area does not expose a ghost input because a field still needs a persistent affordance.`,
    `The default width is a contained 16rem measure. Use ${code("fullWidth")} when the expected value or layout genuinely needs the available column.`,
    `${code("loading")} announces progress with ${code("aria-busy")} and keeps the field editable. Use ${code("disabled")} only when input is impossible; use ${code("readOnly")} for a value that may still be selected and copied.`,
    `Use ${code("monospace")} for keys, hashes, and code-like values. Native input types, including ${code('type="file"')} and ${code('type="search"')}, continue to forward to the underlying input.`,
  ],
  textarea: [
    `Use Textarea when the expected value can wrap to multiple lines. Use Input for one-line values and a separately audited editor for rich text, syntax highlighting, or formatting commands.`,
    `Always pair a Textarea with a ${code("Field")}, or give it an ${code("aria-label")}. Placeholder text is a short example, never the durable label or instructions.`,
    `The default reserves four lines at a contained 16rem width. Set native ${code("rows")} to the approximate response volume and use ${code("fullWidth")} only when the layout calls for the available column.`,
    `Vertical resize is the default. Choose ${code('resize="none"')} only when growth would obscure or displace essential actions; horizontal and two-axis resizing are explicit opt-ins.`,
    `Use native ${code("minLength")}, ${code("maxLength")}, ${code("required")}, and ${code("readOnly")} semantics. Field owns explanatory validation text; Textarea only paints the matching error, success, or warning state.`,
    `Area does not auto-grow or render a character counter. Those behaviors need explicit height limits, controlled-value synchronization, and announced remaining-count policy in a richer composition.`,
  ],
  select: [
    `Use Select for one choice from a short, fixed list. Use Segmented for two to five immediately comparable choices, and a separately audited Combobox when filtering or freeform entry helps.`,
    `Always pair a Select with a ${code("Field")}, or give it an ${code("aria-label")}. Keep labels concise and write options in parallel construction.`,
    `The default is a contained 16rem measure. Set ${code("fullWidth")} only when the expected value or layout needs the available column.`,
    `Use native ${code("optgroup")} to organize a longer fixed list. ${code("multiple")} is intentionally not part of this single-value Select contract; use a separately audited multi-select instead.`,
    `Set ${code("invalid")} or ${code("validationStatus")} rather than colouring the edge yourself. Disabled Selects are unavailable; native Select has no read-only state.`,
  ],
  field: [
    `Give Field one direct control child. It generates a stable id and connects the label, description and validation message; an explicit child ${code("id")} or ${code("htmlFor")} still wins.`,
    `Keep ${code("description")} as durable guidance and ${code("error")} or ${code("validation")} as a concise outcome. They may appear together when they are useful and non-redundant.`,
    `${code("required")}, ${code("disabled")}, and validation status propagate to the direct control. The visible required mark remains ${code("aria-hidden")} because the control carries the semantic state.`,
    `Use ${code('orientation="horizontal"')} for compact settings panels with shared columns. Keep the default vertical layout for forms and narrow containers.`,
    `Use ${code("visuallyHiddenLabel")} only when visible context already makes the field purpose clear. A placeholder still does not replace a label.`,
    `If one page mounts multiple independent React roots, give each root a distinct ${code("identifierPrefix")}. Field uses React ${code("useId")} and prefixes prevent IDs from colliding across roots.`,
    `Field does not paint focus itself. Its Input, Select or Textarea child owns the shared editable-control focus treatment, including invalid and increased-contrast states.`,
  ],
  badge: [
    `Use Badge for status or metadata. Classification belongs to Tag; selection and removal belong to Chip. A plain Badge is a native link treatment only when rendered as an anchor; static Badge never changes on hover or acts like a button.`,
    `Dot is independent of fill. Use text or an accessible name to communicate meaning without color. Icon-only and dot-only forms require an accessible name.`,
    `Badge is always pill-shaped so static metadata remains visually distinct from Button. Its independent small / medium / large scale is 20 / 24 / 32px; medium is the default and does not follow the control-height ramp.`,
    `BadgeAnchor hides its decorative overlay from assistive technology. Put the count or status in the owning control's accessible name. Do not put interactive children in the overlay.`,
    `BadgeGroup wraps all children by default. A numeric visibleCount or auto collapses overflow into a native popover: Enter or Space opens it, Escape and outside click close it. Inline permits wrapping; overlay preserves one row. Auto needs React hydration and ResizeObserver.`,
    `Truncation supplies title for plain text; supply title explicitly for rich content. Keep the full accessible text. Important explanations should also appear in nearby visible text.`,
    `Custom tone uses --area-badge-bg and --area-badge-fg as a complete paint pair, including gradients. The consumer must check contrast across the entire gradient in each theme; built-in defaults use tested neutral tokens.`,
    `Small uses --area-badge-tracking-wide and strong weight 500. Uppercase is opt-in. Foreground remains unchanged on hover.`,
  ],
  alert: [
    `Only the ${code("danger")} tone uses ${code("role=alert")}, which interrupts a screen reader mid-sentence. Every other tone uses ${code("role=status")} and waits for a pause.`,
    `An Alert sits in the page flow. For something that reports the outcome of an action without interrupting, use Toast.`,
    `Keep the title to one line. If the description needs a paragraph, the message probably belongs in the page rather than in an Alert.`,
  ],
  avatar: [
    `Pass ${code("src")} first and fall back to ${code("fallback")} initials when the image is missing.`,
    `Keep initials to one or two characters, uppercase, derived from the entity name. No emoji and no punctuation.`,
    `Give ${code("alt")} the literal entity name — ${code("Jane Doe")}, not ${code("Avatar of Jane Doe")}. The role is already announced.`,
    `Pick a size that matches adjacent type: 24px beside ${code("text-sm")}, 32px beside ${code("text-md")}, 48px in a header.`,
  ],
  table: [
    `Set ${code("interactive")} only when a row is genuinely clickable. A hover highlight on a static table promises an affordance that is not there.`,
    `Use ${code("area-table__cell--numeric")} for numbers. It aligns to the end and switches on tabular figures, so a column lines up on the decimal.`,
    `Cells align to the top. In real data the rows are rarely the same height, and top alignment keeps a wrapped cell from pushing its neighbours off the reading line.`,
  ],
  kbd: [
    `Pass ${code("keys")} as names, not glyphs. ${code("cmd")}, ${code("shift")}, ${code("alt")}, ${code("ctrl")}, ${code("enter")} / ${code("return")} and the arrows become symbols automatically.`,
    `One flat chord contains the keys, matching Primer’s KeybindingHint. The visual symbols remain individual semantic key elements, and the chord supplies one useful spoken label.`,
    `Use ${code("quiet")} and ${code('size="small"')} inside a menu item, where the keycap is dense chrome rather than standalone content.`,
    `The chord uses a flat outline with no inset or drop shadow. Modifier symbols and letters share ${code("--area-font-keyboard")}, a native UI font, at the same size and weight; Fluent icons are unnecessary.`,
  ],
  dialog: [
    `Render it inside a native ${code("<dialog>")} and open it with ${code("showModal()")}. That supplies the focus trap, the backdrop and Escape-to-close without any JavaScript of your own.`,
    `A Dialog interrupts. If the user can reasonably ignore the message, it belongs in an Alert or a Toast.`,
    `Put the confirming action last in the footer, and make a destructive one ${code("danger")}.`,
  ],
  tabs: [
    `The active indicator is the foreground colour, not the accent. Reserving accent for genuinely actionable things keeps a row of tabs from reading as a row of buttons.`,
    `Tabs switch between views of the same thing. To pick a value, use a Segmented control — giving both a filled indicator is how the two end up indistinguishable.`,
    `Only the selected tab is in the tab order; arrow keys move between them. That is what ${code("role=tablist")} promises.`,
  ],
  segmented: [
    `A Segmented control picks a value. Tabs navigate between views. Keep the underbar for one and the raised fill for the other.`,
    `Use it for two to five options. Past that, a Select holds the list without pushing the layout around.`,
    `It is a ${code("radiogroup")}, not a row of toggle buttons — the choice is exclusive, which ${code("aria-pressed")} does not convey.`,
    `Connect ${code("onSelect")} to the controlled value. Arrow-key navigation and a single tab stop remain part of the E05 behavior work.`,
    `The size tier describes the outer track height, so it aligns with the same tier on Button, Input and Select.`,
  ],
};
