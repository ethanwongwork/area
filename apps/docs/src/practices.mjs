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
  code: [
    `Use Code for short commands, identifiers and literal values inside a sentence. Use CodeBlock for multiple lines.`,
    `Use Token when a reference should include a semantic color swatch. Code uses the same compact visual language without the swatch.`,
  ],
  "code-block": [
    `Pass plain text through code. The html prop inserts pre-highlighted markup directly; only supply trusted or sanitized HTML.`,
    `Actions belong in the actions slot at the upper right. The component does not implement copying; the consumer owns that behavior.`,
    `Use flush only inside an existing frame. The standard treatment supplies the surface and decorative edge.`,
  ],
  segmented: [
    `Use a segmented control for a short, exclusive set of choices. Use Select for longer labels or larger sets.`,
    `Supply an accessible label for the group and a readable label for every option. Connect onSelect to the controlled value in an application.`,
    `Current limitation: the component exposes radio semantics and click selection callbacks, but arrow-key navigation and a single tab stop are not yet implemented. The static previews do not change their controlled selection.`,
    `The size tier describes the outer track height, so it aligns with the same tier on Button, Input and Select.`,
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
    `Icons inside a field are chrome, not content: they categorise the field rather than carrying its value, so they never change colour on hover.`,
    `Use ${code("prefix")} and ${code("suffix")} for units and symbols that are not editable, such as a currency mark or a domain.`,
    `Set ${code("invalid")} rather than colouring the border yourself. It also sets ${code("aria-invalid")}, which is what assistive tech actually reads.`,
  ],
  field: [
    `Pass ${code("htmlFor")} and give the control a matching ${code("id")}. Without it the label is decorative and clicking it does nothing.`,
    `${code("error")} replaces ${code("description")} rather than stacking beneath it, so the two never compete for the same glance.`,
    `The required asterisk is ${code("aria-hidden")}. Mark the control itself ${code("required")}; the glyph is for sighted users only.`,
  ],
  badge: [
    `A Badge labels something; it is not a control. If it can be clicked or dismissed, it is a Button.`,
    `Badge is distinguished from Button by the absence of a stroke, not by its shape. Do not give it a pill radius — that reads as an interactive chip.`,
    `Use ${code("dot")} for live status, where the colour carries the meaning and the text merely names it.`,
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
    `Pass ${code("keys")} as names, not glyphs. ${code("cmd")}, ${code("shift")}, ${code("alt")}, ${code("ctrl")} and the arrows become symbols automatically.`,
    `One element per key, never a single element reading ${code("⌘K")}. A shortcut is a sequence of physical keys, and a screen reader reads a bare glyph as nothing at all.`,
    `Use ${code("quiet")} inside a menu item, where the key is chrome rather than content. The filled form is for running text and empty states.`,
    `A key is a rounded rectangle, never a pill. The shape is most of what makes it read as a key rather than as a badge.`,
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
  ],
};
