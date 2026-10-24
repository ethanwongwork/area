/** Documentation entries: fields and text entry. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  field: {
    // Spec: Job and boundaries.
    instead: [
      ["A set of checkboxes or radios that shares one label and message", ["checkbox", "radio"], "Their groups label and validate the whole set; Field labels exactly one control."],
      ["Several values that share one shell", ["input-group"], "Input group draws the shell; wrap the group in one Field to label, disable or invalidate it."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Field.tsx JSDoc.
    practices: [
      ["Do", "Wrap exactly one control: Field wires its id, label, description and message onto that direct child."],
      ["Do", "Put lasting guidance in description and a correction in validation; both can show at once when they don't repeat each other."],
      ["Do", "Pass validationStatus=\"success\" or \"warning\" for a message that isn't an error; without a status, validation is an error."],
      ["Do", "Use horizontal for a settings or inspector row, with the label beside its control."],
      ["Do", "Hide the label with visuallyHiddenLabel only when nearby visible text already names the control; it stays the accessible name."],
      ["Do", "Turn on characterCount with a maxLength on the control where a limit matters, such as a bio or instructions."],
      ["Don't", "Look for a size on Field: it has none, and the child control sets the tier."],
      ["Don't", "Put help text in validation: an error message sets aria-invalid on the control."],
      ["Don't", "Wrap a group of checkboxes or radios; their group components carry the shared label and message."],
    ],
    // Spec: Anatomy; field.css.
    parts: {
      root: "The wrapper: a column with one gap between label, control and messages, or a two-column grid when horizontal. It has no height of its own.",
      label: "The native label, bound to the control by for and aria-labelledby; muted when horizontal, disabled or inside a Panel.",
      required: "The asterisk after the label, hidden from assistive tech; the control carries the native required.",
      description: "Lasting guidance under the control, one step smaller and muted; joined to the control's aria-describedby.",
      count: "With characterCount, the character count at the end of the line under the control, \"12 / 320\" against its maxLength, in the description's text; it shares the description's line and is read with it.",
      validation: "The message under the control and description, in the danger, success or warning ink of its status.",
      error: "The older class name for the validation message, painted the same; React renders validation.",
    },
    // Spec: States.
    states: {
      disabled: "The label mutes and the control takes its own disabled paint; description and messages stay readable.",
    },
    // Source: Field.tsx cloneElement.
    aria: [
      ["id, aria-labelledby", "Set on the child: the generated or htmlFor id, and the label's id when there is a label."],
      ["aria-describedby", "Joins the description, validation and character count ids with any the child already has."],
      ["aria-invalid, aria-errormessage", "Set on the child while the validation status is error, which is the default."],
      ["required, disabled", "Passed from the Field to the child."],
      ["data-validation-status", "Set on the child, so it paints its error, success or warning edge."],
    ],
  },

  input: {
    // Spec: Job and boundaries.
    instead: [
      ["More than one line of text", ["textarea"], "Textarea reserves rows and resizes."],
      ["A number with stepping, scrubbing or units", ["number-field"], "Number field adds arrow-key steps, drag scrubbing, units and arithmetic."],
      ["A search query or a password", ["search-field", "password-field"], "They are Inputs with the clear or reveal action and its keys built in."],
      ["Several named values in one shell", ["input-group"], "Each control keeps its own name and Tab stop inside one shell."],
    ],
    // Spec: Variants, Owner decisions; pages.mjs example notes; source: Input.tsx JSDoc.
    practices: [
      ["Do", "Wrap it in a Field for its label, description and message; a placeholder is not a label."],
      ["Do", "Use outline in forms and soft on an existing surface, such as a Panel."],
      ["Do", "Use prefix and suffix for symbols and units that aren't editable, and one leading icon only when it clarifies purpose."],
      ["Do", "Give a trailing InputAction an icon and a tooltip; the tooltip names it unless you set aria-label."],
      ["Do", "Set loading while a value is being checked: the field stays editable and announces progress."],
      ["Don't", "Pair a trailing icon with a trailing action: the action replaces it."],
      ["Don't", "Use disabled for a value people should read or copy; readOnly stays focusable and selectable."],
      ["Don't", "Show success or warning paint without text in the Field that says why."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The shell: owns the height by size, the 1px edge, corner, fill, focus halo and validation paint. className and style land here.",
      control: "The native input, stripped bare; it takes the ref and native props and fills the space between the slots.",
      icon: "A square icon slot at either end, in the muted icon ink; a Spinner takes it while loading.",
      affix: "Static prefix or suffix text, such as a currency or unit, muted; not part of the value.",
      action: "The slot at the logical end that holds one InputAction; it replaces a trailing icon.",
      "action-button": "The action's button: the field's height less 8, its corner concentric with the field's, with hover and press plates.",
      "action-icon": "The action's 16px glyph, hidden from assistive tech.",
      "action-tooltip": "The action's Tooltip, below and end-aligned, after the shared hover delay or on keyboard focus.",
    },
    // Spec: States.
    states: {
      disabled: "Field paint with disabled ink on the text, icons, affixes and action; no opacity, and not focusable.",
      invalid: "The edge and focus halo take the danger colour, kept on focus; the input gets aria-invalid.",
      success: "The edge and halo take the success colour, held through focus.",
      warning: "The edge and halo take the warning colour, held through focus.",
      "read-only": "Keeps the variant's rest paint with no hover edge and a default cursor; the value stays focusable and copyable.",
      loading: "A Spinner fills an icon slot (the leading one when there is a leading icon); aria-busy is set and the field stays editable.",
    },
    // Native input; InputAction is a native button.
    keyboard: [
      ["Tab", "Moves focus to the input, then to its InputAction, which is its own Tab stop."],
      ["Enter or Space", "On the InputAction, runs it."],
    ],
    // Source: Input.tsx, InputAction.
    aria: [
      ["aria-invalid", "Set when invalid, validationStatus=\"error\" or aria-invalid is passed; the three agree."],
      ["aria-busy", "While loading; the Spinner announces loadingText."],
      ["aria-label", "On an InputAction: its own, or the tooltip text when none is given."],
      ["aria-describedby", "On an InputAction: the tooltip only when aria-label already names it, plus any you pass."],
    ],
  },

  "input-group": {
    // Spec: Job and boundaries; Peers.
    instead: [
      ["One value with a unit or symbol", ["input"], "Input's prefix and suffix hold static text in a single field."],
      ["One number named by a letter or icon", ["number-field"], "Number field's scrub handle shows the letter and drags the value."],
      ["Padding or corner radius as four parts", ["box-field"], "Box field links the parts and splits them with a toggle."],
      ["A hex colour with its opacity", ["color-field"], "Color field with alpha builds this group and keeps one hex value."],
    ],
    // Spec: Behavior and accessibility; pages.mjs example notes.
    practices: [
      ["Do", "Name the group with aria-label or aria-labelledby, and give each control inside its own name."],
      ["Do", "Fold an InputGroupText's meaning, such as the currency or unit, into its neighbour's name: the text itself is passive."],
      ["Do", "Set size and variant on the group; the controls inside take its tier and draw no chrome of their own."],
      ["Do", "Wrap the group in a Field to label it; the Field's disabled and validation reach the Input, Number field and Select inside."],
      ["Don't", "Use it for one value with an affix; Input's prefix and suffix do that."],
      ["Don't", "Leave a control inside without a name: the group's name doesn't name its children."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The shell: one edge, corner, fill and focus ring for every child; the children's chrome is stripped and a rule sits between them.",
      text: "InputGroupText: a passive affix, letter or icon. With visual, a square as tall as the field, and the next control drops its rule.",
    },
    keyboard: [
      ["Tab", "Moves through the controls inside; each keeps its own Tab stop."],
    ],
    // Source: InputGroup.tsx.
    aria: [
      ["role=\"group\"", "Always on the shell."],
      ["aria-label, aria-labelledby", "Name the group; required."],
      ["aria-disabled", "While the group is disabled; its Input, Number field and Select are disabled with it."],
      ["aria-invalid", "On the group, marks an error that its controls paint."],
    ],
  },

  "number-field": {
    // Spec: Job and boundaries.
    instead: [
      ["A value people should see along a track", ["slider"], "Slider shows where the value sits in its range."],
      ["Several values in one shell", ["input-group"], "Input group joins Number fields and other controls under one focus ring."],
      ["Padding or corner radius", ["box-field"], "Box field edits four parts, linked or one per side."],
      ["A plain number in a form, with no stepping or scrubbing", ["input"], "Input with type=\"number\" is enough there."],
    ],
    // Spec: Variants, Behavior and accessibility, Pass 2; source: NumberField.tsx JSDoc.
    practices: [
      ["Do", "Name each field with aria-label or a Field label; a scrub letter or icon is not the accessible name."],
      ["Do", "Set min, max and step: keys, steppers, scrubbing and typed arithmetic all stay inside the range."],
      ["Do", "Pass a letter or icon to scrub in inspectors, such as X, W or rotation; true shows a grip."],
      ["Do", "Show steppers in forms where people don't drag; the arrow keys step with or without them."],
      ["Do", "Use steppers=\"split\" for a count or a quantity, minus before the value and plus after it."],
      ["Do", "Put a sizing or unit mode in trailing as a ghost Custom select, as Figma's width and height fields."],
      ["Do", "Set mixed when a multi-selection holds different values; the next step starts at zero or the nearest bound."],
      ["Don't", "Type the unit into the value; set unit, which follows the number and is read in its value text."],
      ["Don't", "Expect steppers on a read-only field: it shows the value only."],
    ],
    // Spec: Pass 2; number-field anatomy in source.
    parts: {
      root: "The shell: Input's chrome, tier and validation paint; a press on its empty space focuses the value. className and style land here.",
      control: "The text input with role spinbutton: shows the formatted number and takes typed numbers and arithmetic.",
      unit: "Static text right after the number, such as % or °; hidden while the field is empty or mixed.",
      scrub: "The leading handle, a square as wide as the field is tall: drag it to change the value one step per 8px. Hidden from assistive tech.",
      steppers: "The minus and plus pair after the value, or with split, minus before it and plus after; hidden when read-only.",
      trailing: "A control after the value, in a nested square at the field's end; a Custom select in it takes that height.",
      step: "One stepper: out of the Tab order, press and hold repeats, and it disables at its bound. A press moves focus to the value.",
    },
    // Spec: States (Input's), Behavior; source: data-* attributes.
    states: {
      disabled: "Field paint; the unit, scrub handle and steppers take disabled ink, and nothing steps.",
      "read-only": "Rest paint with no hover edge; the value is focusable and copyable, steppers are hidden and keys don't step.",
      invalid: "Danger edge and halo, and aria-invalid; also set while typed text doesn't parse, with a hidden hint to correct it.",
      success: "The success edge and halo.",
      warning: "The warning edge and halo.",
      scrubbing: "Set while a drag on the scrub handle is in progress.",
    },
    // Source: NumberField.tsx handleKeyDown and startScrub.
    keyboard: [
      ["Up or Down", "Steps the value by step, within min and max."],
      ["Shift+Up or Shift+Down", "Steps by ten steps."],
      ["Alt+Up or Alt+Down", "Steps by a tenth of a step."],
      ["Home or End", "Sets min or max, when the field has one."],
      ["Enter", "Commits typed text or arithmetic, such as 24*2; with nothing typed, it submits the form."],
      ["Escape", "Cancels typed text or a scrub in progress, restoring the value; otherwise it reaches the surrounding popover or dialog."],
    ],
    aria: [
      ["role=\"spinbutton\"", "On the input."],
      ["aria-valuenow, aria-valuemin, aria-valuemax", "From the value, min and max; no valuenow while empty or mixed."],
      ["aria-valuetext", "\"Mixed values\" when mixed, or the number with its unit."],
      ["aria-invalid", "When invalid, an error status, or typed text that doesn't parse."],
      ["aria-label", "Names the input; steppers read \"Increase\" and \"Decrease\" with it."],
    ],
  },

  "box-field": {
    // Spec: Job and boundaries.
    instead: [
      ["One number", ["number-field"], "Box field is four Number fields for one property."],
      ["Unrelated values in one shell", ["input-group"], "Input group joins controls that each edit their own value."],
    ],
    // Spec: Variants, Behavior and accessibility; source: BoxField.tsx JSDoc.
    practices: [
      ["Do", "Give it a label such as Padding or Corner radius: it names the group and every field (\"Left padding\")."],
      ["Do", "Set hideLabel when the row already shows the caption; the name stays for assistive tech."],
      ["Do", "Use kind=\"corners\" for a radius and the default sides for padding."],
      ["Do", "Turn the toggle off where the mode is fixed, as a popover that always edits each corner."],
      ["Do", "Set name to submit the four values as one CSS shorthand."],
      ["Don't", "Read Mixed as zero: a linked field shows Mixed while its parts differ, and typing writes every part it covers."],
      ["Don't", "Expect left and right to swap in right-to-left; they are physical sides, as padding values are."],
    ],
    // Source: BoxField.tsx.
    parts: {
      root: "The group, named by the label; owns the size tier and the gap between label and fields.",
      label: "The caption above the fields; names the group and each field. Visually hidden with hideLabel.",
      fields: "The grid: two fields, the toggle in the action column, then two more when split.",
      field: "A Number field with the side or corner glyph as its scrub handle; linked corners are one field across both columns.",
      toggle: "The ghost icon Button that splits or links the parts; selected while split, disabled when read-only.",
    },
    // Spec: Behavior and accessibility.
    keyboard: [
      ["Tab", "Moves through the grid: the first row, the toggle, then the second row."],
      ["Enter or Space", "On the toggle, splits or links the parts; focus stays on it."],
    ],
    aria: [
      ["role=\"group\", aria-labelledby", "The whole field, named by its label."],
      ["aria-label", "Each field: the part and the property, \"Left padding\" or \"Top left corner radius\"."],
      ["aria-pressed", "On the toggle (\"Individual padding per side\"), true while split."],
    ],
  },

  textarea: {
    // Spec: Job and boundaries.
    instead: [
      ["One line of text", ["input"], "Input holds a single line with icons, affixes and an action."],
      ["Chat entry with send and attach actions", ["composer"], "Composer is the message box with its actions."],
    ],
    // Spec: Variants, Behavior; pages.mjs example notes.
    practices: [
      ["Do", "Set rows to the expected response length; without it, four lines are reserved."],
      ["Do", "Wrap it in a Field for the label, description and messages."],
      ["Do", "Keep the default vertical resize; set none only where the surface can't grow."],
      ["Do", "Use soft on an existing surface, such as a Panel."],
      ["Don't", "Use disabled for a value people should read or copy: read-only stays focusable and is submitted."],
      ["Don't", "Show invalid paint without a Field message that says what to fix."],
    ],
    // Spec: Job and boundaries, Anatomy.
    parts: {
      root: "The native textarea, which carries its own edge, corner, fill and focus; rows set its height and resize its handle.",
    },
    // Spec: States.
    states: {
      invalid: "The edge and focus halo take the danger colour; aria-invalid is set.",
      success: "The edge and halo take the success colour.",
      warning: "The edge and halo take the warning colour.",
      disabled: "Field paint with disabled ink and no resize handle; not focusable and not submitted.",
      "read-only": "Keeps the variant's rest paint with no hover edge; focusable, copyable and submitted.",
    },
    keyboard: [
      ["Tab", "Moves focus to the textarea; Enter inside it starts a new line."],
    ],
    aria: [
      ["aria-invalid", "Set when invalid, validationStatus=\"error\" or aria-invalid is passed."],
    ],
  },

  select: {
    // Spec: Job and boundaries; custom-select.md and combobox.md boundaries.
    instead: [
      ["Options need icons, descriptions or groups with rules, or an inline look", ["custom-select"], "Custom select draws rich rows in Menu's list; Select keeps the native one."],
      ["A list long enough that people type to find a value", ["combobox"], "Combobox filters as you type and can keep or create a value."],
      ["Choosing several values", ["tag-picker"], "Tag picker shows each chosen value as a tag in the field."],
      ["Running a command rather than setting a value", ["menu"], "Menu's rows act; they hold no value."],
    ],
    // Spec: Variants, States; pages.mjs example notes.
    practices: [
      ["Do", "Use it for a short list of plain-text options in a form: it keeps the native keyboard, typeahead and form reset."],
      ["Do", "Give a long fixed list headings with optgroup."],
      ["Do", "Make an empty-value option the placeholder: chosen, it shows in placeholder ink."],
      ["Do", "Use soft wherever the neighbouring fields are soft, such as in a Panel."],
      ["Don't", "Put icons or descriptions in options; use Custom select."],
      ["Don't", "Use it for actions; use Menu."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The native select: owns the height by size, edge, corner, fill, chevron and focus; where the browser allows, the picker is styled too.",
    },
    // Spec: States.
    states: {
      invalid: "The edge and focus halo take the danger colour; aria-invalid is set.",
      success: "The edge and halo take the success colour, held through focus.",
      warning: "The edge and halo take the warning colour, held through focus.",
      disabled: "Field paint with disabled ink and chevron; no opacity. Also inherited from an Input group or Field.",
    },
    // Spec: Behavior and accessibility (native keys).
    keyboard: [
      ["Tab", "Moves focus to the Select; opening, moving, typeahead and closing are the browser's own keys."],
    ],
    aria: [
      ["aria-invalid", "Set when invalid, validationStatus=\"error\" or aria-invalid is passed."],
      ["disabled", "Native; set from the prop, or from a surrounding Input group or Field."],
    ],
  },

  "custom-select": {
    // Spec: Job and boundaries; tag-picker.md boundaries.
    instead: [
      ["Plain-text options in a form", ["select"], "Select is the native element: one node, the platform's keyboard and typeahead."],
      ["A list long enough that people type to find a value", ["combobox"], "Combobox filters as you type and can keep or create a value."],
      ["Several values shown as tags, from a list that can grow", ["tag-picker"], "Tag picker filters, creates tags and shows each choice in the field."],
      ["Running a command rather than setting a value", ["menu"], "Menu's rows act; they hold no value."],
    ],
    // Spec: Variants, Behavior and accessibility; source: CustomSelect.tsx JSDoc.
    practices: [
      ["Do", "Use it when options need an icon, a description line or groups; the chosen option's icon shows in the trigger too."],
      ["Do", "Name it with aria-label or a Field label; a string aria-label names the list as well."],
      ["Do", "Use ghost for an inline value with no chrome until hovered, as a property in a row."],
      ["Do", "Set name to submit the chosen value through a hidden input; the label is never submitted."],
      ["Do", "Use onHighlightChange to preview an option while the pointer or arrows are on it; it never chooses."],
      ["Do", "Use layout grid when each choice is best seen as a picture (a setting's look, a colour); give options a preview, or an icon for a swatch grid."],
      ["Don't", "Use the grid for long ramps of numbers or plain words; the list reads them faster and its icons carry the order."],
      ["Don't", "Use it for plain-text options in a form; Select is native and lighter."],
      ["Don't", "Use it for a long list people would rather search; use Combobox."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The wrapper: owns the variant and size, and data-open while the list shows.",
      trigger: "The button with role combobox: Select's height, edge, corner, fill and focus. Focus stays here while the list is open.",
      icon: "The chosen option's icon, in a square at the start; only when that option has one.",
      value: "The chosen label (labels, with multiple), truncated; the placeholder shows in placeholder ink.",
      chevron: "The trailing chevron in the field chevron ink; it doesn't turn.",
      listbox: "Menu's surface in the top layer, placed below the trigger and at least as wide; it scrolls when the room runs out.",
      option: "Menu's row: an icon, the label, an optional description line and a trailing check on chosen rows. The plate marks highlight only.",
      group: "Options that share a group, under its label.",
      separator: "The rule between groups.",
      grid: "In layout grid, a run of options (the list's, or a group's) in equal columns.",
      preview: "In layout grid, the option's picture in a 4:3 frame with Folder's thin edge; the selected stroke frames the chosen one.",
      caption: "In layout grid, the option's label under its picture, on one line, muted until chosen.",
    },
    // Spec: States.
    states: {
      open: "data-open is set: outline and soft hold their hover edge (focus edge and ring only from the keyboard); ghost holds its pressed plate.",
      disabled: "Select's disabled paint; ghost loses its plate. The list never opens.",
      invalid: "The danger edge and ring; aria-invalid on the trigger.",
    },
    // Source: CustomSelect.tsx handleKeyDown.
    keyboard: [
      ["Enter or Space or Down or Up", "When closed, opens the list on the chosen option; Up opens on the last when nothing is chosen."],
      ["Home or End", "Opens on, or moves to, the first or last option."],
      ["Down or Up", "When open, moves the highlight, skipping disabled options and stopping at the ends; in layout grid, to the nearest cell in the row below or above."],
      ["Right or Left", "In layout grid, moves the highlight to the next or previous cell in reading order."],
      ["PageUp or PageDown", "Moves the highlight by ten options."],
      ["Enter or Space", "Chooses the highlighted option and closes; with multiple, toggles it and the list stays open."],
      ["Tab", "Chooses the highlighted option and moves on; with multiple, closes without choosing."],
      ["Alt+Up", "Chooses the highlighted option and closes; with multiple, just closes."],
      ["Escape", "Closes without choosing."],
      ["A or Z", "Any letter: typing jumps to the next label that starts with the letters; a repeated letter cycles. When closed, it opens there."],
    ],
    aria: [
      ["role=\"combobox\", aria-haspopup", "On the trigger button, with aria-haspopup=listbox."],
      ["aria-expanded, aria-controls", "On the trigger: whether the list is open, and its id."],
      ["aria-activedescendant", "On the trigger: the highlighted option while open."],
      ["aria-selected", "On each option: true for a chosen one."],
      ["aria-multiselectable", "On the listbox, with multiple."],
      ["aria-invalid, aria-required", "On the trigger, from invalid and required."],
    ],
  },

  combobox: {
    // Spec: Job and boundaries; search-field.md and tag-picker.md boundaries.
    instead: [
      ["A short fixed list with no typing", ["select", "custom-select"], "Select for plain-text options; Custom select when options carry icons or descriptions."],
      ["Choosing several values", ["tag-picker"], "Tag picker shows each chosen value as a tag in the field."],
      ["Searching actions and places across the app", ["command-palette"], "Command palette is a search surface for actions, built on this field."],
      ["Filtering something on the page, with no value to choose", ["search-field"], "Search field holds a query, with no list or chosen value."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Combobox.tsx prop JSDoc.
    practices: [
      ["Do", "Use it when people type to find a value in a list too long to scan."],
      ["Do", "Set allowsCustomValue when any typed value is valid, such as a font size; otherwise unmatched text reverts when focus leaves."],
      ["Do", "Pass onCreate to offer a Create row, then add the new option to items: it is chosen once it arrives."],
      ["Do", "Group options with group, and add an icon or description where it helps people pick."],
      ["Do", "Set name to submit the option's value; typed text is submitted only with allowsCustomValue."],
      ["Don't", "Use it for a short fixed list; Select and Custom select need no typing."],
      ["Don't", "Put actions in the list; Command palette searches actions and places."],
    ],
    // Spec: Decisions; source: Combobox.tsx.
    parts: {
      root: "The wrapper around an Input whose chevron action shows every option; data-open while the list shows. className and style land here.",
      listbox: "Menu's surface in the top layer, below the field and at least as wide; it flips and scrolls when the room runs out.",
      option: "Menu's row: an optional icon, the label and a trailing check on the chosen option. The plate marks highlight only.",
      description: "Muted text at the row's end: a shortcut, a count or a detail.",
      empty: "\"No results\" (emptyText) when nothing matches and nothing can be created; announced through a status, not an option.",
      group: "Options that share a group, under a muted label.",
    },
    // Spec: Decisions.
    states: {
      open: "data-open is set and the list shows; focus stays in the field, which keeps Input's focus edge.",
    },
    // Source: Combobox.tsx handleKeyDown.
    keyboard: [
      ["Down", "Opens the list on the chosen option, or moves the highlight down; it wraps and skips disabled options."],
      ["Alt+Down", "Opens the list without highlighting an option."],
      ["Up", "Opens the list on the last option, or moves the highlight up."],
      ["Alt+Up", "Picks the highlighted option and closes, or just closes when none is highlighted."],
      ["Enter", "While open, picks the highlighted option or the Create row; with nothing highlighted, settles the typed text."],
      ["Tab", "Picks the highlighted option and moves on."],
      ["Escape", "Closes the list; on a closed field, clears the text and the value."],
    ],
    aria: [
      ["role=\"combobox\", aria-autocomplete", "On the input, with aria-autocomplete=list."],
      ["aria-expanded, aria-controls", "On the input and the chevron: whether the list is open, and its id."],
      ["aria-activedescendant", "On the input: the highlighted option while open."],
      ["aria-selected, aria-disabled", "On each option: the chosen one, and disabled ones."],
      ["aria-label, aria-labelledby", "Name the field; a string aria-label also names the listbox."],
    ],
  },

  "tag-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["One value", ["combobox", "custom-select"], "Combobox when people type to find it; Custom select for a short fixed list."],
      ["Filters shown all at once and toggled in place", ["chip"], "Chips stay visible and toggle where they are."],
    ],
    // Spec: Variants, Behavior and accessibility; source: TagPicker.tsx prop JSDoc.
    practices: [
      ["Do", "Use it for several values from a list that can grow, such as labels or categories."],
      ["Do", "Give each option a tone so its tag reads at a glance."],
      ["Do", "Pass onCreate when people may add tags, then add the new tag to items: it is chosen once it arrives."],
      ["Do", "Name it with aria-label or a Field label; a string aria-label names the list too."],
      ["Do", "Set name to submit one hidden value per chosen tag."],
      ["Don't", "Use it for one value; use Combobox or Custom select."],
      ["Don't", "Use it for filters people should see all at once; use Chips."],
    ],
    // Spec: Anatomy; source: TagPicker.tsx.
    parts: {
      root: "The wrapper: owns the variant and size, and data-open while the list shows.",
      field: "Input's edge, fill, corner and focus ring around the tags and the text; it grows by a row as tags wrap. A press on it focuses the text.",
      input: "The text with role combobox; its placeholder shows only while no tag is chosen.",
      listbox: "Menu's surface below the field, multi-selectable; it follows the field as it grows.",
      hint: "The list's heading, \"Select a tag or create one\" or \"Select tags\"; hint={null} hides it.",
      option: "Menu's row with the Tag, and a trailing check while it is chosen.",
      create: "The Create row with the tag it would make, when the text matches nothing and onCreate is set.",
      empty: "\"No tags\" (emptyText) when nothing matches and nothing can be created.",
    },
    // Spec: States.
    states: {
      open: "data-open is set; the field takes the focus edge and ring.",
      disabled: "Input's disabled fill; tags dim and lose their remove button, and the list never opens.",
      invalid: "The danger edge and ring.",
    },
    // Source: TagPicker.tsx handleKeyDown.
    keyboard: [
      ["Down or Up", "Opens the list, or moves the highlight; it wraps and skips disabled rows."],
      ["Enter", "Adds or removes the highlighted tag, or creates one, and keeps the list open; a search is cleared."],
      ["Backspace", "In an empty field, removes the last tag."],
      ["Escape", "Closes the list and clears the text."],
    ],
    aria: [
      ["role=\"combobox\", aria-autocomplete", "On the input, with aria-autocomplete=list, aria-expanded, aria-controls and aria-activedescendant."],
      ["aria-multiselectable", "Always on the listbox; each option carries aria-selected."],
      ["aria-label", "On each tag's remove button: \"Remove\" and the tag's name."],
      ["aria-invalid", "On the field and the input, from invalid."],
      ["role=\"status\"", "A hidden region that announces each tag added or removed."],
    ],
  },

  "date-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["A month always on the page", ["calendar"], "Calendar has no field; the month stays in view."],
      ["A span of days", ["date-range-picker"], "Date range picker shows a range and picks its start and end."],
      ["A time of day", ["time-field"], "Time field types hours and minutes in segments."],
    ],
    // Spec: Variants, Decisions; source: DatePicker.tsx prop JSDoc.
    practices: [
      ["Do", "Name it with aria-label or a Field label; the panel and month take the same name."],
      ["Do", "Use ghost for a date shown as a property value, plain until hovered."],
      ["Do", "Set min, max or isDateUnavailable: those dates can't be picked or typed."],
      ["Do", "Add the calendar icon where the field must read as a date; leave it out in property rows."],
      ["Do", "Set name to submit YYYY-MM-DD; formatOptions changes only what the field shows."],
      ["Don't", "Use it for a range; use Date range picker, and Time field for a time."],
      ["Don't", "Use it where the month should stay in view; use Calendar."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The wrapper: owns the variant and size, and data-open while the panel shows.",
      trigger: "The field: a button with Select's height, edge, corner and fill showing the date in words; ghost is plain until hovered.",
      icon: "An optional leading glyph, such as the calendar, in a square at the start.",
      value: "The date, \"October 14, 2026\" by default, or the placeholder in placeholder ink.",
      panel: "A Popover holding the typed date, the month and the Clear footer: a non-modal dialog.",
      footer: "A rule and the Clear row at Menu's inset; Clear is disabled while there is no date.",
    },
    // Spec: States.
    states: {
      open: "data-open is set; the field takes the focus edge colour, and ghost holds its pressed plate.",
      disabled: "Select's disabled paint; the panel never opens.",
      invalid: "The danger edge, with aria-invalid on the field.",
    },
    // Source: DatePicker.tsx handleTextKey; Popover; Calendar.tsx key().
    keyboard: [
      ["Enter or Space", "On the field, opens the panel with focus in the typed date, its text selected."],
      ["Enter", "In the typed date, commits it and closes; text that isn't an allowed date stays, with the invalid edge."],
      ["Tab", "Moves from the typed date to the month's arrows and days, then Clear."],
      ["Left or Right or Up or Down", "In the month, moves by day or by week."],
      ["PageUp or PageDown", "In the month, moves by month; with Shift, by year."],
      ["Home or End", "In the month, moves to the start or end of the week."],
      ["Escape", "Closes the panel; focus returns to the field."],
    ],
    aria: [
      ["aria-haspopup, aria-expanded, aria-controls", "On the field: dialog, whether the panel is open, and its id."],
      ["role=\"dialog\"", "On the panel, named by the picker's aria-label (\"Choose a date\" by default)."],
      ["aria-invalid", "On the field, from invalid."],
    ],
  },

  "date-range-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["One date", ["date-picker"], "Date picker shows one date and lets people type it."],
      ["A month always on the page", ["calendar"], "Calendar has no field; it can select a range in place."],
    ],
    // Spec: Variants, Decisions; source: DateRangePicker.tsx prop JSDoc.
    practices: [
      ["Do", "Add presets, such as Today, Last 7 days and Last 30 days, when people usually pick a common span."],
      ["Do", "Show two months (visibleMonths={2}) when ranges often cross a month's end."],
      ["Do", "Name it with aria-label or a Field label; the panel takes the same name."],
      ["Do", "Read the form values from <name>-start and <name>-end, each YYYY-MM-DD."],
      ["Don't", "Use it for one date; use Date picker."],
      ["Don't", "Wait for an Apply step: a preset or the second day sets the value and closes at once."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "Date picker's field and panel: the field shows the range short (\"Oct 4 – 10, 2026\"); the panel holds presets, a range month and Clear.",
      presets: "The group of preset rows above the month, ruled off from it; only when presets are given.",
      preset: "A Menu row that sets its range and closes; the one matching the range shows a check.",
    },
    // Source: Popover focus on open; Calendar.tsx key().
    keyboard: [
      ["Enter or Space", "On the field, opens the panel; focus moves to the first preset, or into the month."],
      ["Left or Right or Up or Down", "In the month, moves by day or week; once the start is set, the band follows focus."],
      ["PageUp or PageDown", "In the month, moves by month; with Shift, by year."],
      ["Enter or Space", "On a preset, sets its range and closes; on a day, sets the start, then the end, and closes."],
      ["Escape", "Drops a half-picked range; a second Escape closes the panel and focus returns to the field."],
    ],
    aria: [
      ["aria-haspopup, aria-expanded, aria-controls", "On the field, as Date picker's."],
      ["role=\"dialog\"", "On the panel, named by the picker's aria-label (\"Choose dates\" by default)."],
      ["role=\"group\"", "Around the presets, named Presets."],
      ["aria-pressed", "On each preset: true for the one matching the range."],
    ],
  },

  "time-field": {
    // Spec: Job and boundaries.
    instead: [
      ["A date, or a span of dates", ["date-picker", "date-range-picker"], "They hold days; Time field holds a time of day."],
      ["A plain number, such as a duration in minutes", ["number-field"], "Number field steps any number with a unit."],
    ],
    // Spec: Variants, Decisions; source: TimeField.tsx JSDoc.
    practices: [
      ["Do", "Name it with a Field label or aria-label; each segment adds its own name, such as Hour."],
      ["Do", "Leave hourCycle to the locale unless the product fixes 12 or 24 hours."],
      ["Do", "Set step, such as 15, when times usually fall on an interval; the list opens on the chosen time."],
      ["Do", "Set granularity=\"second\" only when seconds matter."],
      ["Do", "Read value as 24-hour HH:MM; it is null until every segment is filled."],
      ["Don't", "Use it for a duration or a date: it holds a time of day."],
      ["Don't", "Rely on it with phone keyboards yet: the segments don't open one."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "Input's shell, as a group, hugging its segments; an optional leading clock sits in the icon slot.",
      segments: "The row of segments in tabular numerals; the time reads as ordinary text.",
      part: "One segment with the separator before it.",
      literal: "The colon or space between segments, hidden from assistive tech.",
      segment: "An hour, minute or second spin button; digits fill it and move on once no further digit could follow. Empty shows a placeholder dash pair.",
      period: "The AM/PM segment, in a 12-hour cycle.",
      list: "With step, a Menu of times step minutes apart; the chosen one is checked and in view.",
      trigger: "With step, the trailing chevron that opens the list; out of the Tab order.",
    },
    // Source: TimeField.tsx onSegmentKey.
    keyboard: [
      ["Tab", "Moves from segment to segment; each is its own Tab stop."],
      ["Up or Down", "Steps the focused segment by one, wrapping at the ends."],
      ["PageUp or PageDown", "Steps the hour by two, or the minute or second by 15."],
      ["Home or End", "Sets the segment to its lowest or highest value."],
      ["Left or Right", "Moves to the previous or next segment."],
      ["Backspace or Delete", "Clears the segment; Backspace on an empty one moves back."],
      ["A or P", "On the period, sets AM or PM."],
      ["Alt+Down", "Opens the list of times, when step is set."],
    ],
    aria: [
      ["role=\"group\"", "On the shell, named by aria-label, aria-labelledby or a Field label."],
      ["role=\"spinbutton\"", "On each segment, named Hour, Minute, Second or AM/PM; with aria-labelledby, the field's label comes first."],
      ["aria-valuenow, aria-valuetext", "On each segment; an empty one reads Empty."],
      ["aria-invalid", "On each segment, from invalid or a Field's error."],
      ["aria-disabled, aria-readonly", "On the segments while disabled or read-only; disabled segments leave the Tab order."],
    ],
  },

  "password-field": {
    // Spec: Job and boundaries.
    instead: [
      ["A short one-time code or PIN", ["otp-field"], "OTP field shows each character in its own slot and takes a code from autofill."],
      ["Text that isn't a secret", ["input"], "Input shows its value; Password field masks it."],
    ],
    // Spec: Variants, Behavior and accessibility; source: PasswordField.tsx JSDoc.
    practices: [
      ["Do", "Set autoComplete=\"new-password\" where a password is chosen; the default, current-password, lets managers fill a sign-in."],
      ["Do", "Name the field with a Field label or aria-label; the reveal action names itself."],
      ["Do", "Change showLabel and hideLabel to fit the secret, such as Show key for an API key."],
      ["Do", "Let a form submit hide it again: onVisibleChange(false) runs on submit."],
      ["Don't", "Build a strength meter or caps-lock warning into it; compose Meter beside it if you need one."],
      ["Don't", "Use it for one-time codes; OTP field shows the code's length."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "Input's shell and paint around the masked input; the type switches between password and text.",
      reveal: "The InputAction at the end: the eye to show, the closed eye to hide. A pointer press keeps the caret in the field; there is none while disabled.",
    },
    // Source: PasswordField.tsx; native button.
    keyboard: [
      ["Tab", "Moves from the input to the reveal action, which stays in the Tab order."],
      ["Enter or Space", "On the reveal action, shows or hides the password; focus stays on the action."],
    ],
    aria: [
      ["aria-label", "On the reveal action: \"Show password\" or \"Hide password\" (showLabel, hideLabel), what a press does."],
      ["aria-controls", "On the reveal action, pointing at the input."],
      ["autocomplete", "\"current-password\" by default."],
    ],
  },

  "otp-field": {
    // Spec: Job and boundaries.
    instead: [
      ["A secret of any length", ["password-field"], "Password field masks a value of open length, with a reveal action."],
      ["A number to edit or step", ["number-field"], "Number field steps, scrubs and bounds a value."],
    ],
    // Spec: Variants, Behavior; source: OTPField.tsx JSDoc; pages.mjs example notes.
    practices: [
      ["Do", "Set length to the code's length, and groups, such as [3, 3], when the code is read out in parts."],
      ["Do", "Use onComplete to check the code, and show the result in the Field's description or error."],
      ["Do", "Name it with a Field label or aria-label: the code is one control with one name."],
      ["Do", "Set characters=\"alphanumeric\" for codes with letters; pasted spaces and dashes are dropped either way."],
      ["Don't", "Put a resend action inside it; place a Button beside it."],
      ["Don't", "Use it for passwords or secrets of open length; use Password field."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The row of slots: owns the size tier and the invalid, disabled and read-only paint.",
      group: "The slots of one group.",
      slot: "One character in Input's shell, square: the character, or a dot when masked. The active slot takes the focus edge.",
      caret: "The blinking line in the slot the code continues in.",
      separator: "The dash between groups, muted and hidden from assistive tech.",
      control: "The one real input, transparent over the whole row: it owns the value, caret, paste and autofill.",
    },
    // Spec: States.
    states: {
      invalid: "Input's danger paint on the slots; aria-invalid on the input.",
      disabled: "Input's disabled paint; the input is disabled.",
      "read-only": "Input's read-only paint; the code can be read and copied, not changed.",
    },
    // Source: OTPField.tsx handleKeyDown; native input.
    keyboard: [
      ["Tab", "One Tab stop for the whole code; focus puts the caret where the code continues."],
      ["Left or Right", "Selects the previous or next slot, so the next character replaces it."],
      ["Backspace", "Deletes as in any text input; the slots follow."],
    ],
    aria: [
      ["autocomplete", "\"one-time-code\" by default, so a code from a text message or a password manager can fill it."],
      ["inputmode", "\"numeric\" for digits, \"text\" for alphanumeric."],
      ["aria-invalid", "On the input, from invalid or a Field's error."],
      ["aria-hidden", "On the drawn slots, which repeat the input's value, so the code is read once."],
    ],
  },

  "search-field": {
    // Spec: Job and boundaries.
    instead: [
      ["Suggestions to choose a value from", ["combobox"], "Combobox lists options under the field and holds the chosen one."],
      ["Searching actions and places across the app", ["command-palette"], "Command palette is a dialog of actions and places."],
    ],
    // Spec: Variants, Behavior and accessibility; source: SearchField.tsx JSDoc.
    practices: [
      ["Do", "Use it to filter or search something on the page: a list, a panel's assets, a set of pages."],
      ["Do", "Name it with aria-label or a Field label; the Search placeholder is not a name."],
      ["Do", "Pass shortcut to show the keys that focus it while empty, and bind those keys on the page."],
      ["Do", "Set loading while results load; the Spinner takes the search glyph's place."],
      ["Don't", "Add a search button: results follow the query, and Enter calls onSubmit."],
      ["Don't", "Show a suggestion list under it; use Combobox."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "Input's shell with the search glyph in the leading slot; the input is type search.",
      clear: "The InputAction that empties the field, shown once there is text; out of the Tab order, and focus stays in the field.",
      shortcut: "The Kbd hint for the shortcut that focuses the field, shown while it is empty; hidden from assistive tech.",
    },
    // Source: SearchField.tsx handleKeyDown.
    keyboard: [
      ["Escape", "Clears the query and stops there, so a dialog around it stays open; on an empty field it reaches the page."],
      ["Enter", "Calls onSubmit with the query; a surrounding form still submits."],
    ],
    aria: [
      ["type", "search, so the input is a searchbox."],
      ["aria-keyshortcuts", "From shortcut, with cmd read as Meta; the visible Kbd is hidden."],
      ["aria-label", "On the clear action: clearLabel, \"Clear search\" by default."],
      ["tabindex", "-1 on the clear action: Escape is the keyboard path."],
    ],
  },

  "editable-text": {
    // Spec: Job and boundaries.
    instead: [
      ["A value that is always a field, as in a form", ["input"], "Input is a field at rest; Editable text is text until edited."],
      ["Several lines or formatted text", ["textarea"], "Textarea holds several lines."],
    ],
    // Spec: Variants, Owner decisions, Behavior; source: EditableText.tsx prop JSDoc.
    practices: [
      ["Do", "Give it a label, such as Layer name: it names the text and the field."],
      ["Do", "Keep the default dblclick where a click selects the row, as layer names; use click where the text is a page title."],
      ["Do", "Save in onValueChange: it runs once per committed change, not on each key."],
      ["Do", "Set fill when the name should fill its row."],
      ["Do", "Keep the hint tooltip so people learn the gesture; set hint={false} only where it is already known."],
      ["Don't", "Use it for several lines or formatting; use Textarea."],
      ["Don't", "Add save or cancel buttons beside it: Enter or leaving the field commits, and Escape cancels."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The inline wrapper: one cell holding the text and, while editing, the field; data-editing and data-disabled.",
      preview: "The text as a focusable button: the value, or the placeholder muted; the shared hover plate and the hint tooltip.",
      input: "The field, only while editing, in the same cell and inset: it appears around the text without moving it and grows with the draft.",
    },
    // Spec: States.
    states: {
      editing: "The field replaces the text in place, the whole value selected, with the field focus outline and editing surface.",
      disabled: "Disabled opacity; out of the Tab order, with no hint and no editing.",
    },
    // Source: EditableText.tsx onPreviewKey, onInputKey.
    keyboard: [
      ["Enter or Space or F2", "On the text, opens the field with the whole value selected."],
      ["Enter", "In the field, commits and returns focus to the text."],
      ["Escape", "In the field, cancels and returns focus to the text."],
      ["Tab", "Reaches the text; with activation=\"focus\", that opens the field. Leaving the field commits."],
    ],
    aria: [
      ["role=\"button\"", "On the text, named \"<label>: <value>\"."],
      ["aria-label", "On the field: the label."],
      ["aria-hidden", "On the text while the field is open."],
      ["aria-disabled", "On the text while disabled."],
    ],
  },

  "color-field": {
    // Spec: Job and boundaries.
    instead: [
      ["Choosing among fixed colours", ["color-swatch-picker"], "Color swatch picker offers a set of swatches as choices."],
      ["Editing by area, tracks and channels", ["color-picker"], "Color picker edits the colour visually."],
    ],
    // Spec: Job and boundaries, Variants, Behavior; source: ColorField.tsx JSDoc.
    practices: [
      ["Do", "Read one canonical hex from onValueChange and the form: #RRGGBB, or #RRGGBBAA with alpha."],
      ["Do", "Set alpha where opacity is edited too, as in an inspector's fill row."],
      ["Do", "Name the hex with a Field label or aria-label, and set opacityLabel when Opacity isn't the right word."],
      ["Do", "Use soft in inspector rows, alongside the other soft fields."],
      ["Don't", "Use it to pick from a fixed set of colours; use Color swatch picker."],
      ["Don't", "Expect a change on every key: drafts stay visible and commit on Enter or blur."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "Input's shell with the colour swatch in the leading slot and the hex in tabular numerals; with alpha, an Input group shell around hex and opacity.",
      opacity: "With alpha, a Number field for 0 to 100% beside the hex, ruled apart and named by opacityLabel.",
    },
    // Source: ColorField.tsx handleKeyDown; NumberField.
    keyboard: [
      ["Enter", "Commits a valid hex of 3, 4, 6 or 8 digits; a draft that doesn't parse reverts to the last value."],
      ["Escape", "Restores the last committed value."],
      ["Up or Down", "In the opacity field, steps by one percent."],
    ],
    aria: [
      ["aria-invalid", "On the hex input while the draft doesn't parse, or from invalid."],
      ["aria-label", "On the opacity field: opacityLabel, \"Opacity\" by default."],
      ["role=\"group\", aria-label", "With alpha, on the group holding hex and opacity: groupLabel, \"Color and opacity\" by default."],
    ],
  },
};
