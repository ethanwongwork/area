/** Documentation entries: actions and choices. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  button: {
    // Spec: Job and boundaries.
    instead: [
      ["Going to a place (a page, a section, a URL)", ["link", "nav", "breadcrumb"], "A Button triggers an action; navigation is a link."],
      ["Choosing one mode among siblings", ["segmented"], "A row of selected Buttons doesn't say only one can be on."],
      ["A selectable filter", ["chip"], "Chip is the selectable pill; Button is an action."],
      ["Laying out several Buttons", ["button-group", "toolbar"], "They arrange Buttons and add no Button paint of their own."],
    ],
    // Spec: Variants (justification column), Behavior and accessibility, States; source: Button.tsx JSDoc.
    practices: [
      ["Do", "Use solid for the strongest action in a view, and soft or outline for secondary actions."],
      ["Do", "Use ghost for quiet actions in toolbars, headers and message actions."],
      ["Do", "Set onColor on a Button that sits on a painted colour (a colour card): it takes the colour's ink, with plates of that ink, as Badge's onColor."],
      ["Do", "Give an icon-only Button an aria-label: it is its only name."],
      ["Do", "Set loading while an action is pending: the Button keeps focus and ignores clicks, so a submit isn't sent twice."],
      ["Do", "Show a shortcut with a Kbd as the last child: it sits one gap after the label, and set aria-keyshortcuts when the page binds the key."],
      ["Don't", "Use a Button to go somewhere. Use Link, Nav or Breadcrumb."],
      ["Don't", "Set disabled with loading to show progress: loading and disabled together is plainly disabled."],
      ["Don't", "Rely on HTML's submit default. Button is type=\"button\" unless you ask for submit."],
    ],
    // Spec: Anatomy (the area rows).
    parts: {
      root: "The native button: owns the height, the 1px border (transparent unless outline or soft), the corner and the fill.",
      icon: "The icon box, 16 at md (12 / 16 / 20 by size). A Spinner takes it while loading.",
      label: "The text, cap-trimmed so it centres on the cap height; a long label ends in an ellipsis.",
    },
    // Spec: States.
    states: {
      disabled: "Dims and ignores input; native disabled.",
      loading: "A Spinner replaces the leading icon at full ink; clicks are dropped and the cursor shows progress.",
      selected: "A toggle that is on: the selected plate holds under hover and press (solid takes its hover fill).",
    },
    // Spec: Behavior and accessibility; native button keys.
    keyboard: [
      ["Tab", "Moves focus to the Button. A loading Button stays in the Tab order."],
      ["Enter or Space", "Activates it. A toggle flips selected."],
    ],
    aria: [
      ["aria-pressed", "From selected, on a toggle."],
      ["aria-disabled, aria-busy", "While loading (not native disabled, so focus stays)."],
      ["aria-label", "Required with iconOnly."],
      ["aria-keyshortcuts", "Not set by Button: pass it when the page binds the shortcut a trailing Kbd shows. The Kbd's chord is read as part of the name."],
    ],
  },

  "button-group": {
    // Spec: Job and boundaries.
    instead: [
      ["Commands that need arrow-key movement or overflow", ["toolbar"], "Toolbar gives its commands one Tab stop with roving focus and can hide what doesn't fit."],
      ["Choosing one value among siblings", ["segmented"], "Segmented holds one selected value; a Button group's actions are independent."],
      ["A default action with related alternatives", ["split-button"], "Split button joins the action to its menu and names the trigger."],
      ["A set of toggles that share one state", ["toggle-group"], "Toggle group keeps the pressed state of its buttons together."],
    ],
    // Spec: Job and boundaries, Variants; source: ButtonGroup.tsx.
    practices: [
      ["Do", "Group only related actions that each stand alone: every child keeps its own name and Tab stop."],
      ["Do", "Use soft for quiet joined actions on a fill, and outline when the actions need a shared stroke."],
      ["Do", "Set size on the group so every child shares one height."],
      ["Do", "Give the group an aria-label when the actions' relation isn't clear from the page."],
      ["Do", "Disable a single action when only it is unavailable; the others stay usable."],
      ["Don't", "Use a Button group to pick one mode; selected Buttons don't say only one can be on. Use Segmented."],
      ["Don't", "Mix sizes or put non-Button controls inside; the joined edges assume Buttons of one size."],
    ],
    // Spec: Decisions (divider, children).
    parts: {
      root: "The group: joins its Buttons at shared edges, rounds only the outside corners and draws the full-height seam between soft buttons.",
    },
    // Native button keys; each child is a separate Tab stop.
    keyboard: [
      ["Tab or Shift+Tab", "Moves between the Buttons; each one is its own Tab stop."],
      ["Enter or Space", "Activates the focused Button."],
    ],
    aria: [
      ["role=\"group\"", "Always, on the group."],
      ["aria-label", "Optional; names the group when its purpose isn't clear from context."],
      ["aria-pressed", "On a child Button set as a toggle, from its selected prop."],
    ],
  },

  "split-button": {
    // Spec: Job and boundaries.
    instead: [
      ["A menu with no default action", ["button"], "Use a Button with a trailing chevron that opens the menu."],
      ["Choosing one mode among siblings", ["segmented"], "Segmented shows mutually exclusive modes side by side."],
      ["Commands that don't fit a bar", ["toolbar"], "Toolbar's overflow menu holds hidden commands."],
      ["Several independent actions joined", ["button-group"], "Button group joins actions that each stand alone."],
    ],
    // Spec: Variants, Behavior and accessibility; source: SplitButton.tsx JSDoc.
    practices: [
      ["Do", "Put the most common choice on the action and its alternatives in the menu, as Save beside Save as and Export."],
      ["Do", "Use solid for a primary action, soft or outline for a secondary one."],
      ["Do", "Use ghost icon-only for a tool with variants in a Toolbar, and set selected on the current tool."],
      ["Do", "Give the trigger a specific menuLabel when \"More options\" doesn't say what the menu holds."],
      ["Do", "Inside a Toolbar, leave size unset so the Split button takes the toolbar's size."],
      ["Don't", "Expect disabled to turn off only the menu: it disables both parts, and the control dims as one."],
      ["Don't", "Use ghost outside a toolbar or with a text label; it is drawn for icon-only tools."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The group: one joined shape that anchors the menu. Solid, soft and outline draw a full-height divider; ghost leaves a gap instead.",
      action: "A full Button that runs the default action; it takes the label, leading icon and selected state.",
      trigger: "A square icon-only Button with a chevron, named by menuLabel; it keeps its pressed plate while the menu is open.",
      menu: "A Menu in a native popover. Text splits hang it under the group's end edge; an icon tool hangs it from the chevron's start.",
    },
    // Spec: Behavior and accessibility; source: SplitButton.tsx key handlers, Menu.
    keyboard: [
      ["Tab or Shift+Tab", "Moves between the action and the trigger; both are in the Tab order (in a Toolbar they join its arrow keys)."],
      ["Enter or Space", "On the action, runs it. On the trigger, opens the menu on its first item."],
      ["Down or Up", "On the trigger, opens the menu on the first (Down) or last (Up) item. In the menu, moves between items and wraps."],
      ["Home or End", "In the menu, jumps to the first or last item."],
      ["Escape", "Closes the menu and returns focus to the trigger."],
      ["Tab", "In the menu, closes it."],
    ],
    aria: [
      ["role=\"group\"", "Always, on the joined control."],
      ["aria-label", "On the trigger, from menuLabel (\"More options\" by default); on an icon-only action, from its children."],
      ["aria-haspopup, aria-expanded, aria-controls", "On the trigger: a menu popup, whether it is open, and the menu's id."],
      ["aria-pressed", "On the action, when selected is set (the current tool)."],
    ],
  },

  "toggle-group": {
    // Spec: Job and boundaries.
    instead: [
      ["A choice that always has exactly one answer", ["segmented"], "Segmented always holds one value; a Toggle group can have none pressed."],
      ["Filters in a set that wraps", ["chip"], "Filter chips toggle on their own and wrap across lines."],
      ["Options in a form list", ["checkbox"], "Checkboxes label each option and submit with the form."],
      ["Independent actions with no pressed state", ["button-group"], "Button group joins actions that run once each."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; source: ToggleGroup.tsx JSDoc.
    practices: [
      ["Do", "Use multiple for styles that combine (bold, italic, underline) and single for at most one, which pressing again releases."],
      ["Do", "Use soft on its own, outline to join toggles with a stroke, and ghost to set them apart as a Toolbar group."],
      ["Do", "Name the group with aria-label, and give each icon-only toggle a name through its children or aria-label."],
      ["Do", "Inside a Toolbar, leave size unset: the group takes the toolbar's size and its toggles join the toolbar's arrow keys."],
      ["Don't", "Use single when one option must always be chosen; use Segmented."],
      ["Don't", "Keep each toggle's pressed state yourself; the group keeps the set through value or defaultValue and onValueChange."],
      ["Don't", "Stack toggles vertically; a vertical set of commands is a vertical Toolbar."],
    ],
    // Spec: Anatomy, Decisions.
    parts: {
      root: "The group: one Tab stop that keeps the pressed set. Soft draws a track with pressed toggles raised; outline joins the toggles; ghost spaces them apart.",
    },
    // Source: ToggleGroup.tsx handleKeyDown and focus handling; native button keys.
    keyboard: [
      ["Tab", "Enters the group on the toggle used last, else the first pressed one, else the first."],
      ["Right or Down", "Moves to the next toggle, wrapping; in a right-to-left layout Left moves forward."],
      ["Left or Up", "Moves to the previous toggle, wrapping."],
      ["Home or End", "Moves to the first or last enabled toggle."],
      ["Enter or Space", "Presses or releases the focused toggle."],
    ],
    aria: [
      ["role=\"group\"", "Always, on the group."],
      ["aria-label", "Set by you; names the group."],
      ["aria-pressed", "On every toggle: true when its value is in the pressed set."],
      ["disabled", "On every toggle when the group is disabled; the group then leaves the Tab order."],
    ],
  },

  toolbar: {
    // Spec: Job and boundaries.
    instead: [
      ["Choosing one value among options", ["segmented"], "Place a Segmented inside the Toolbar for a mode switch; the Toolbar itself chooses nothing."],
      ["A few related actions joined at their edges", ["button-group"], "Button group joins actions and leaves each its own Tab stop."],
      ["A set of toggles that share one state", ["toggle-group"], "Toggle group keeps the pressed set; it joins the toolbar's arrow keys when placed inside."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Toolbar.tsx.
    practices: [
      ["Do", "Use plain inside an existing surface, and surface for a bar that floats on its own over a canvas."],
      ["Do", "Wrap each plain Button, link or field in ToolbarItem so it joins the arrow keys; without it the control is a separate Tab stop."],
      ["Do", "Group related commands with ToolbarGroup and divide groups with ToolbarSeparator."],
      ["Do", "Show a toggled command with Button's selected; it keeps its fill under the pointer."],
      ["Do", "Put secondary commands in ToolbarOverflow as MenuItems, and name it with menuLabel when \"More actions\" is too vague."],
      ["Don't", "Give an icon-only command no aria-label; arrow keys land on it with nothing to announce."],
      ["Don't", "Build a one-of-several choice from toggle Buttons in a group; use Segmented in the Toolbar."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The bar: one Tab stop that owns the size tier, the inset (none when plain, an even inset when surface), the corner, fill and shadow.",
      group: "A labelled cluster of related commands, spaced apart from its neighbours.",
      separator: "A thin rule the height of the commands, turned across the toolbar's orientation.",
    },
    // Spec: Behavior and accessibility; source: Toolbar.tsx handleKeyDown, Menu.
    keyboard: [
      ["Tab", "Enters the toolbar on the command used last, else the first enabled one; Tab again leaves it."],
      ["Right or Left", "In a horizontal toolbar, moves to the next or previous command without activating it, wrapping (reversed right to left)."],
      ["Down or Up", "In a vertical toolbar, moves to the next or previous command."],
      ["Home or End", "Moves to the first or last enabled command."],
      ["Enter or Space", "Activates the focused command; on the overflow trigger, opens its menu."],
      ["Escape", "Closes the overflow menu and returns focus to its trigger."],
    ],
    aria: [
      ["role=\"toolbar\", aria-orientation", "Always, on the bar, from orientation."],
      ["role=\"group\"", "On each ToolbarGroup; add aria-label to name it."],
      ["role=\"separator\", aria-orientation", "On each ToolbarSeparator, across the toolbar's orientation."],
      ["aria-label", "On the overflow trigger, from menuLabel (\"More actions\" by default)."],
      ["aria-pressed", "On a command Button set as a toggle, from selected."],
    ],
  },

  "copy-button": {
    // Spec: Job and boundaries.
    instead: [
      ["A Copy link row in a menu", ["menu", "toast"], "A Menu item writes to the clipboard and the app confirms with a Toast."],
      ["A whole row that copies its value", ["token-row"], "Token row shares the copy behaviour across the row."],
      ["Any other action on a Button", ["button"], "Copy button only copies; everything else is a plain Button."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; source: CopyButton.tsx JSDoc.
    practices: [
      ["Do", "Use it icon-only beside the thing it copies (a message, a code block), where its default name Copy is clear."],
      ["Do", "Set label when Copy alone doesn't say what is copied, such as Copy link."],
      ["Do", "Pass value as a function when the text must be read at the moment of the click."],
      ["Do", "Use children for a visible label when the button sits apart; the label stays as written while the icon changes."],
      ["Don't", "Rename the button to Copied; the live region announces the result once and the name stays fixed."],
      ["Don't", "Add a Toast for the same copy; the check and the announcement already confirm it."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "A Button (ghost, neutral, sm by default) with Button's shell and icon box; the icon turns to a check while copied, and the width never changes.",
    },
    // Spec: States.
    states: {
      "copy-state": "copied swaps the icon for a check and announces Copied to clipboard; failed keeps the copy icon and announces Copy failed. Both return to rest after two seconds.",
    },
    // Spec: Behavior and accessibility; native button keys.
    keyboard: [
      ["Tab", "Moves focus to the button."],
      ["Enter or Space", "Copies the value; pressing again restarts the two seconds."],
    ],
    aria: [
      ["aria-label", "On an icon-only button, from label (Copy by default); it does not change after a copy."],
      ["aria-live", "Polite, on a hidden sibling that says the result once and is empty at rest."],
    ],
  },

  segmented: {
    // Spec: Job and boundaries.
    instead: [
      ["Switching between views or panels", ["tabs"], "Tabs own views and draw an underline."],
      ["Too many options for one track", ["chip", "select"], "Chips wrap across lines; a Select holds a long list."],
      ["Independent commands", ["toolbar", "button-group"], "Segmented picks a value; commands run on their own."],
      ["At most one option, or none", ["toggle-group"], "Segmented always has a value; Toggle group's single mode can be released."],
    ],
    // Spec: Job and boundaries, Variants, Behavior and accessibility; source: Segmented JSDoc.
    practices: [
      ["Do", "Use it for a small set of exclusive options that fit in one track, such as a mode or an alignment."],
      ["Do", "Name the group with aria-label; it is a radio group to assistive tech."],
      ["Do", "Use iconOnly in tight inspector rows; each option's label stays its name and shows as a tooltip."],
      ["Do", "Use fullWidth to align the track with fields on a panel row."],
      ["Do", "Set name to submit the value with a form."],
      ["Don't", "Expect an empty state: a Segmented always has a value, the first enabled option by default."],
      ["Don't", "Fit more options than one track can hold; long labels and many options belong in a Select."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The track: owns the control height, the even inset around the items, the track fill, ring and corner.",
      item: "One option as a radio button, inset inside the track; the selected one is a raised plate.",
      icon: "The option's square icon box; decorative, since the label names the option.",
      label: "The option's text. With iconOnly it is visually hidden but still names the option.",
    },
    // Spec: States.
    states: {
      selected: "The item rises as a plate with an edge and a shadow, and its ink turns default; the weight stays the same.",
      disabled: "The item dims and is skipped by the arrow keys. Disabling the group disables every option.",
    },
    // Source: Segmented onKeyDown (primitives.tsx); spec: Behavior and accessibility.
    keyboard: [
      ["Tab", "Moves focus to the selected option; the group is one Tab stop."],
      ["Right or Down", "Selects the next enabled option, wrapping (Left moves forward right to left)."],
      ["Left or Up", "Selects the previous enabled option, wrapping."],
      ["Home or End", "Selects the first or last enabled option."],
      ["Enter or Space", "Selects the focused option. Inside a Toolbar the arrows only move focus, so this is how you choose."],
    ],
    aria: [
      ["role=\"radiogroup\", aria-label", "On the track; the name comes from aria-label."],
      ["role=\"radio\", aria-checked", "On each option; aria-checked marks the selected one."],
      ["aria-disabled", "On the track when the whole group is disabled."],
    ],
  },

  checkbox: {
    // Spec: Job and boundaries.
    instead: [
      ["A setting that applies the moment it changes", ["switch"], "Switch reads as on and off and takes effect at once."],
      ["One option from an exclusive set", ["radio", "segmented"], "Radio for a form list, Segmented for a few options in one track."],
      ["A filter token in a set that wraps", ["chip"], "Filter chips toggle on their own and wrap across lines."],
    ],
    // Spec: Job and boundaries, Variants, Behavior and accessibility; source: forms.tsx JSDoc.
    practices: [
      ["Do", "Give every Checkbox a visible label; a leading visual is decoration and never names the option."],
      ["Do", "Put related options in a CheckboxGroup, which owns the legend, the group description and group validation."],
      ["Do", "Use indeterminate on a parent whose children are only partly checked."],
      ["Do", "Use the card variant for a contained option in a list or grid: row for one line, tile for a visual above the label."],
      ["Do", "Mark a single required option with invalid; put errors about the whole set on CheckboxGroup."],
      ["Don't", "Use a Checkbox for a setting that applies immediately; use Switch."],
      ["Don't", "Use indeterminate as a third choice; it only shows that a parent's children are partly checked."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The label: the whole row is the hit area, with the box, an optional visual and the label text whose first line centres on the box.",
      control: "The native checkbox, drawn as a square box with a check, or a dash when indeterminate.",
      visual: "An optional decorative icon beside the box, in muted ink; above the label in a tile card.",
    },
    // Spec: States.
    states: {
      checked: "The box fills with the selection colour and the check scales in.",
      indeterminate: "The box fills and shows a dash instead of the check, for a partial selection.",
      disabled: "The whole option dims to half and ignores input; native disabled.",
      invalid: "The edge and label turn danger; a checked invalid box becomes one danger fill.",
    },
    // Native checkbox keys.
    keyboard: [
      ["Tab", "Moves focus to the box; each Checkbox is its own Tab stop."],
      ["Space", "Checks or unchecks it."],
    ],
    aria: [
      ["aria-invalid", "On the input when invalid is set; on CheckboxGroup's fieldset when it has an error."],
      ["aria-describedby", "Points at the caption, or on CheckboxGroup at its description and validation message."],
    ],
  },

  radio: {
    // Spec: Job and boundaries.
    instead: [
      ["A few modes or views in one track", ["segmented"], "Segmented shows a short exclusive set as one compact control."],
      ["Options that can be chosen together", ["checkbox"], "Checkboxes are independent."],
      ["A long list of exclusive options", ["select"], "A Select keeps a long list out of the way until it's needed."],
    ],
    // Spec: Job and boundaries, Behavior and accessibility; source: forms.tsx (RadioGroup, Radio).
    practices: [
      ["Do", "Put every Radio in a RadioGroup: it renders the legend and shares the name, value and disabled state."],
      ["Do", "Give the group a visible label; it becomes the fieldset's legend."],
      ["Do", "Use vertical for settings stacks and horizontal for a short inline choice."],
      ["Do", "Use card layout=\"preview\" when each option is best shown as itself (a theme, a layout, a typeface): pass its picture as leadingVisual; the label stays the name."],
      ["Do", "Report a problem with the choice through the group's error, which marks every option."],
      ["Don't", "Use a single Radio on its own; once chosen it can't be cleared. Use a Checkbox."],
      ["Don't", "Give a Radio its own name inside a RadioGroup; it overrides the group's shared name and splits the set."],
    ],
    // Spec: Anatomy (shared with Checkbox).
    parts: {
      root: "The label: the whole row is the hit area, with the circle, an optional visual and the label text whose first line centres on the circle.",
      control: "The native radio, drawn as a circle; a centred dot appears when it is chosen.",
      visual: "An optional decorative icon beside the circle, in muted ink.",
    },
    // Spec: States.
    states: {
      disabled: "The option dims to half and ignores input; disabling the group disables every option.",
    },
    // Native radio keys (spec: arrow keys are the browser's).
    keyboard: [
      ["Tab", "Moves into the group on the chosen option, or the first one; the group is one Tab stop."],
      ["Up or Down or Left or Right", "Moves to the next or previous option and chooses it."],
      ["Space", "Chooses the focused option when none is chosen yet."],
    ],
    aria: [
      ["aria-describedby", "On RadioGroup's fieldset, pointing at its description and error; on a Radio, at its caption."],
      ["aria-invalid", "On RadioGroup's fieldset when it has an error."],
    ],
  },

  switch: {
    // Spec: Job and boundaries.
    instead: [
      ["A choice that is submitted later with a form", ["checkbox"], "A Checkbox records a choice; a Switch acts the moment it flips."],
      ["A choice among named modes", ["segmented"], "Segmented names each mode instead of on and off."],
      ["A pressed command in a toolbar", ["toggle-group", "button"], "A toggle Button or Toggle group keeps a command's pressed state."],
    ],
    // Spec: Variants, States, Behavior and accessibility; source: Switch.tsx.
    practices: [
      ["Do", "Use it only where flipping it changes the setting at once, with no save step."],
      ["Do", "Label it with the setting's name, not an action; the switch's position says on or off."],
      ["Do", "Put the switch at the end of settings and menu rows with labelPosition=\"end\" and fullWidth."],
      ["Do", "Set loading while the change is being saved; further changes are blocked until it ends."],
      ["Do", "Use readOnly to show a setting the user can't change here at full strength, and disabled when it doesn't apply."],
      ["Don't", "Make the user press Save after flipping a Switch; use a Checkbox in that form."],
      ["Don't", "Use tone for a custom on colour; it is ignored. Set --area-switch-color instead."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The label: the whole row is the hit area, with the track centred on the label's first line.",
      control: "The native checkbox with the switch role, invisible over the whole label; it takes focus and input.",
      track: "The pill the thumb slides along: the rail's grey when off, the selection colour when on.",
      thumb: "The raised circle that slides to the end when on and stretches while pressed.",
      text: "Holds the label and the description, beside the track.",
      label: "The setting's name; it names the switch.",
      description: "A muted line under the label that describes the switch.",
      loading: "A Spinner after the track while loading.",
    },
    // Spec: States.
    states: {
      checked: "The track fills with the on colour and the thumb slides to the end.",
      disabled: "Dims to half with a not-allowed cursor and ignores input.",
      "read-only": "Keeps full paint with no hover; clicks and keys don't change it.",
      loading: "A Spinner follows the track, changes are blocked and the cursor shows progress.",
      hover: "The track darkens one step, off or on; the ink stays fixed.",
      active: "The thumb stretches wider while the switch is pressed.",
      "focus-visible": "A focus ring wraps the track.",
    },
    // Native checkbox keys.
    keyboard: [
      ["Tab", "Moves focus to the switch."],
      ["Space", "Turns it on or off, unless it is read-only, loading or disabled."],
    ],
    aria: [
      ["role=\"switch\"", "Always, on the native checkbox; its checked state is on or off."],
      ["aria-labelledby, aria-describedby", "Point at the label and the description when they are given."],
      ["aria-readonly", "While readOnly."],
      ["aria-busy", "While loading."],
    ],
  },

  slider: {
    // Spec: Job and boundaries.
    instead: [
      ["Named options with no order", ["segmented", "chip"], "Segmented for a few in one track, Chips for a set that wraps."],
      ["A colour channel (hue, alpha)", ["color-picker"], "Color picker draws its own channel sliders."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Slider JSDoc (primitives.tsx).
    practices: [
      ["Do", "Use it for a value along an ordered range with a direction, such as radius, opacity or gap."],
      ["Do", "Give it a visible label, and a readout when the exact value matters."],
      ["Do", "Format the readout as the value reads (60%, 1.25x) with a function or string; a string readout is also what a screen reader says."],
      ["Do", "Turn on stepMarks for a short discrete range so each stop is visible."],
      ["Do", "Pass buffered for media playback, in the same units as the value, so the loaded stretch shows ahead of the playhead."],
      ["Do", "Keep the rail in dense panels and inspectors. Use track where the slider is a main control, as Figma's image adjustments, and bar where it is the one control in its row and pairs with a Button or field of the same height."],
      ["Do", "Put the label inside a bar (labelPosition inside) for a list of settings, one per row, each with its label and value inside it, as a theme or tool panel; it shows its value unless readout is false, and stepMarks show as dots."],
      ["Do", "Put an option that goes past the range, such as no limit, after the slider as a soft toggle Button at the slider's size; moving the slider releases it."],
      ["Do", "Pass origin for a range with a neutral middle, such as cool to warm, so the fill grows from it either way and is empty there."],
      ["Do", "Where an exact value matters, put a NumberField after a field bar on one value, with a Label over both and readout off, so people can drag or type it."],
      ["Do", "Apply a costly change, such as a setting that restyles a page, in onValueCommit (on release and on each key step) or once the drag rests, and keep onValueChange for the readout, so the bar follows the pointer."],
      ["Do", "Use SliderRange for a start and an end, with optional number fields either side."],
      ["Don't", "Use a Slider for named options that have no order; use Segmented or Chip."],
      ["Don't", "Build a range from two Sliders; SliderRange keeps both handles on one rail and the start never above the end."],
      ["Don't", "Mix rail, track and bar in one group of sliders; pick one treatment per panel."],
      ["Don't", "Put a button inside the slider's label; it would join the slider's name. Place it after the slider."],
      ["Don't", "Give a slider with its label inside end labels or a vertical orientation; it is horizontal and its value is the readout."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The label: lays out the label, track and readout in a row the control tier tall, or with label and readout above at labelPosition top; with the label inside, the bar itself, with the label and readout inside it.",
      label: "The visible name of the range.",
      track: "The control's place in the row, the full tier tall: the input on top and the drawing under it.",
      control: "The native range input over the whole track, transparent: keyboard, value, pointer and announcements. With the label inside it covers the bar, so any point drags it.",
      rail: "The trough, clipping the fill and the buffered stretch; on the bar, the whole bar, which takes the focus ring.",
      fill: "From the start to the thumb (from the origin, with one); eases to every change but a drag. Darkens on hover.",
      buffer: "With buffered, the loaded stretch after the fill, a step stronger than the rail; decorative.",
      thumb: "A round knob, or on the bar the fill's end with a grip, or with the label inside a thin grip line inside the fill's end. Lifts while the pointer holds it.",
      value: "The readout after the rail, in muted tabular figures; with the label inside, at the bar's end in the body ink. Hidden from assistive tech, which reads the input.",
      marks: "With stepMarks, a tick under the rail or track at each interior step, or a dot inside a bar; decorative.",
      ends: "With startLabel and endLabel, the range's two ends named under the track, such as Low and High; decorative, horizontal only.",
      end: "One end's name, under its end of the track.",
    },
    // Spec: States.
    states: {
      disabled: "The whole slider dims to half and ignores input.",
      hover: "The fill fades one step darker (with the bar's thumb, which is the fill's end); the rail and the knob stay the same. With the label inside, the grip line darkens too, as it does while it drags or holds focus.",
      "focus-visible": "A focus ring wraps the knob; on the bar it wraps the whole bar, as on a field.",
      pressed: "While the pointer holds it, the knob lifts a little (the bar's grip), by the Feedback setting; a key press never lifts it.",
      dragging: "Once the pointer moves, the thumb and fill follow it exactly; any other change (a click on the track, a key, a release onto a step) eases there.",
    },
    // Native range keys; source: Slider onKeyDown (Shift+arrow).
    keyboard: [
      ["Tab", "Moves focus to the thumb."],
      ["Right or Up", "Raises the value one step (Left raises it right to left)."],
      ["Left or Down", "Lowers the value one step."],
      ["Shift+Right or Shift+Up", "Raises the value ten steps."],
      ["Shift+Left or Shift+Down", "Lowers the value ten steps."],
      ["Home or End", "Jumps to the minimum or maximum."],
    ],
    aria: [
      ["aria-valuetext", "From the readout when it renders as a string, so the value is spoken as shown; your own aria-valuetext wins."],
      ["aria-hidden", "On the readout, since the input already announces the value."],
    ],
  },

  chip: {
    // Spec: Job and boundaries.
    instead: [
      ["A few exclusive options that fit in one track", ["segmented"], "Segmented holds exactly one value; chips toggle independently."],
      ["A label that states a value and can't be pressed", ["badge"], "Badge states a value and cannot be pressed; a Chip is interactive."],
      ["An action that isn't a filter or a value", ["button"], "A Button triggers an action; a Chip belongs to a set."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Chip JSDoc (primitives.tsx).
    practices: [
      ["Do", "Use filter for toggles that narrow a list; several can be on at once."],
      ["Do", "Use input for entered values, with onDismiss so each one can be removed."],
      ["Do", "Lay a set out in a ChipGroup named with aria-label; it wraps onto as many lines as it needs."],
      ["Do", "Set dismissLabel when the chip's label isn't plain text, so its remove button isn't just \"Remove chip\"."],
      ["Do", "Use ChipLink when the chip goes somewhere; selection and removal stay on Chip."],
      ["Don't", "Use a set of filter chips for a single required choice; use Segmented or Radio."],
      ["Don't", "Use a Chip to show status that can't be pressed; use Badge."],
    ],
    // Spec: Anatomy; source: Chip, ChipLink.
    parts: {
      root: "The chip: a button, or a wrapper when removable. It owns the control height, the edge, the pill corner, the fill and focus.",
      swatch: "A colour dot before the label; with swatchOnly it is the whole chip, which goes square.",
      icon: "A leading icon in muted ink.",
      "trailing-icon": "A ChipLink's outgoing-link icon after the label, with the icon treatment.",
      avatar: "A person or entity visual, usually an Avatar, before the label.",
      image: "A small thumbnail before the label; give it imageAlt unless the label names it.",
      label: "The chip's text; it names the chip.",
      action: "The removable chip's main button, present when it toggles or is clickable; a separate Tab stop from remove.",
      remove: "The circular dismiss button after the label, named by dismissLabel (\"Remove\" plus the label by default).",
    },
    // Spec: States, Decisions.
    states: {
      selected: "A filter chip that is on takes the selection plate, one step above hover, and keeps it under the pointer.",
      disabled: "Dims to half and ignores input, including remove.",
      invalid: "An input chip whose value wasn't recognised: danger surface, edge and ink, and a danger remove button.",
    },
    // Source: Chip onKeyDown (Backspace, Delete); native button keys.
    keyboard: [
      ["Tab", "Moves to the chip; each chip, and each remove button, is its own Tab stop."],
      ["Enter or Space", "Toggles a filter chip, or runs a clickable chip or its remove button."],
      ["Backspace or Delete", "Removes a removable chip; focus moves to the next chip, or the previous one."],
    ],
    aria: [
      ["aria-pressed", "On a filter chip, true while it is selected."],
      ["aria-label", "On the remove button, from dismissLabel or \"Remove\" plus the chip's text."],
      ["role=\"group\", aria-label", "On ChipGroup; aria-label names the set."],
    ],
  },

  "alignment-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["A choice along one axis (left, centre, right)", ["segmented"], "Segmented lays a one-dimensional choice out in one track."],
      ["A grid of colours or other options", ["color-swatch-picker"], "Alignment picker only holds the nine physical positions."],
    ],
    // Spec: Job and boundaries, Variants, Behavior and accessibility; source: AlignmentPicker.tsx.
    practices: [
      ["Do", "Use it for an inspector property that places content at one of nine points, such as auto-layout alignment."],
      ["Do", "Name it with aria-label or label; each cell is already named from top left to bottom right."],
      ["Do", "Use soft on its own and plain inside an existing inspector surface."],
      ["Do", "Size it with its parent: it fills the parent's width, and its height when the parent sets one."],
      ["Do", "Set name to submit the position with a form; an uncontrolled picker returns to defaultValue on reset."],
      ["Don't", "Mirror it for right-to-left layouts; the positions are physical, so the grid always reads left to right."],
      ["Don't", "Set size or stretch; both are ignored."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The grid: three by three cells on the field fill, with an even inset and the corner of the fields beside it.",
      cell: "One position: a native radio under a square hit area that owns the hover plate and the focus ring.",
      dot: "The cell's mark: a small dot at rest, three bars showing the alignment when chosen.",
    },
    // Spec: States, Settled questions (preview glyph).
    states: {
      preview: "The cell under the pointer shows the bars it would set, in muted ink, over a translucent plate; they swap back to the dot at once.",
    },
    // Source: AlignmentPicker move(); spec: Behavior and accessibility.
    keyboard: [
      ["Tab", "Moves focus to the chosen position; the grid is one Tab stop."],
      ["Left or Right", "Moves along the row and chooses, wrapping at its end."],
      ["Up or Down", "Moves along the column and chooses, wrapping at its end."],
      ["Home or End", "Chooses the top left or bottom right position."],
    ],
    aria: [
      ["role=\"radiogroup\", aria-label", "On the grid; the name comes from aria-label, else label."],
      ["aria-label", "On each radio, its position (top left, center, bottom right)."],
      ["aria-disabled", "On the grid when disabled; every radio is natively disabled too."],
      ["dir", "Always ltr on the grid, since the positions are physical."],
    ],
  },

  "zoom-control": {
    // Spec: Job and boundaries.
    instead: [
      ["Dragging a value continuously along a range", ["slider"], "A Slider drags; a Zoom control steps and jumps by command."],
      ["A number typed straight into a field", ["number-field"], "Number field edits a value in place; here the typed zoom lives inside the menu."],
    ],
    // Spec: Variants, Decisions, Feedback log; source: ZoomControl.tsx JSDoc.
    practices: [
      ["Do", "Use it in a canvas's panel header or toolbar to show the zoom and offer every way to change it in one menu."],
      ["Do", "Pass onZoomToFit to add the Zoom to fit row, and shortcuts so the menu shows the keys your page binds."],
      ["Do", "Add view toggles as MenuItem children with checked; they follow the zoom rows and keep the menu open."],
      ["Do", "Use stepper for a zoom out and zoom in pair either side of the percentage, which still opens the menu."],
      ["Do", "Use views and valueLabel for named ways to show the content, such as Fit, so the button says Fit instead of a number."],
      ["Don't", "Expect it to bind shortcuts; your page binds them and the menu only shows them."],
      ["Don't", "Use it for the canvas's own pinch or wheel zoom; it reports zooms you set through value and onValueChange."],
    ],
    // Spec: Anatomy; source: ZoomControl.tsx.
    parts: {
      root: "A ghost Button, small by default, showing the zoom with a trailing chevron; it opens the menu.",
      value: "The percentage in tabular figures, or valueLabel when one is set.",
      menu: "Area's Menu, aligned to the button's end: the typed field, Zoom in and out, Zoom to fit, views, presets, then your rows.",
      field: "A small soft Input at the top of the menu for a typed zoom (150, 150% or 1.5x); bad text marks it invalid.",
      stepper: "The group that holds Zoom out, the percentage and Zoom in when stepper is on; the percentage drops its chevron.",
      step: "A Zoom out or Zoom in icon Button, named in a Tooltip and disabled at the end of the range.",
    },
    // Source: ZoomControl onFieldKey, Menu; spec: Behavior and accessibility.
    keyboard: [
      ["Tab", "Moves focus to the button, and with stepper to Zoom out and Zoom in as well."],
      ["Enter or Space or Down", "On the button, opens the menu."],
      ["Enter", "In the field, applies the typed zoom and closes the menu."],
      ["Down or Up", "Moves from the field to the rows, and between the rows."],
      ["Escape", "Closes the menu."],
    ],
    aria: [
      ["aria-label", "On the button, \"Zoom\" plus the value shown (Zoom 48%); on the field, \"Zoom\"; on the step buttons, Zoom out and Zoom in."],
      ["aria-haspopup, aria-expanded", "On the button, as the menu's trigger."],
      ["role=\"group\"", "On the stepper, named Zoom unless you pass aria-label."],
      ["aria-checked", "On the preset and view rows: the current zoom or view is checked."],
    ],
  },

  kbd: {
    // Spec: Job and boundaries.
    instead: [
      ["Inline source code, a token or a file name", ["code"], "Code marks text you would type into source; Kbd marks keys you press."],
      ["A status or a count", ["badge"], "Badge states a value; Kbd only shows keys."],
      ["A full list of an app's shortcuts", ["shortcut-list"], "Shortcut list lays out actions beside their keys."],
    ],
    // Spec: When a key has a backplate, The gap between a keycap and its words, Behavior and accessibility; source: Kbd JSDoc.
    practices: [
      ["Do", "Pass keys as names (cmd, shift, enter, up); they become the platform's glyphs and a spoken chord."],
      ["Do", "Use the keycap everywhere a key shows: hints, prose, shortcut lists, Buttons, menu and palette rows; menu rows take the small one."],
      ["Do", "Use on-color on a strong fill; Tooltip, a solid Button and a menu row switch to it on their own."],
      ["Do", "Put the action's shortcut in aria-keyshortcuts on the action; inside a button, link or menu row the spoken chord is hidden."],
      ["Do", "Use KbdGroup for a sequence pressed one chord after another."],
      ["Don't", "Separate a keycap from its words with a typed space; let the container's gap set it (prose is the exception)."],
      ["Don't", "Set keys as plain text; quiet is deprecated and renders the keycap, so every key looks the same."],
      ["Don't", "Treat Kbd as the binding; it only shows the keys, and your page handles them."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "One flat keycap holding a chord's keys, with the spoken chord as hidden text; md is 20 tall for hints and Buttons, sm is 16 for dense rows.",
      key: "One key's glyph or letter, hidden from assistive tech, set a small gap from the next key.",
    },
    // Display only: no keys of its own.
    keyboard: [],
    aria: [
      ["aria-hidden", "On every key glyph; the hidden text says the chord instead, as Command plus K."],
      ["aria-keyshortcuts", "Set by you on the action the shortcut runs; Kbd itself never sets it."],
    ],
  },

  link: {
    // Spec: Job and boundaries.
    instead: [
      ["Doing something on this page", ["button"], "A Button triggers an action; a Link goes somewhere."],
      ["A trail of the pages above this one", ["breadcrumb"], "Breadcrumb links sit in a trail with a hover plate."],
      ["A labelled pill that goes somewhere", ["chip"], "ChipLink is a link drawn as a chip."],
      ["A row in an app's navigation", ["nav"], "Nav rows show where you are and take a plate."],
    ],
    // Spec: Job and boundaries, Variants, Hued inks, Behavior and accessibility; source: Link.tsx JSDoc.
    practices: [
      ["Do", "Use inline in running text, where the underline always shows, and standalone for links on their own, such as Learn more."],
      ["Do", "Leave ink as inherit so the link takes the text's own ink and size; use muted for secondary links in metadata and footers."],
      ["Do", "Use action or blue when links must stand out from the text, and a hue only to name a colour, never a status."],
      ["Do", "Set external for another site: it opens a new tab, shows the external mark and says so to assistive tech."],
      ["Do", "Use linkVariants to give a router's own anchor the same classes."],
      ["Don't", "Use a Link to run an action; use a Button."],
      ["Don't", "Disable a link; a destination that can't be reached is plain text."],
      ["Don't", "Set a size on a link; it takes the size of the text it sits in."],
    ],
    // Spec: Anatomy, Close underline.
    parts: {
      root: "The native anchor: no box of its own, the text's size and ink, and an underline set close under the letters.",
      icon: "The external mark after the text, centred on the cap height; shown with external and hidden from assistive tech.",
    },
    // Native anchor keys.
    keyboard: [
      ["Tab", "Moves focus to the link; the underline shows in full with a focus ring."],
      ["Enter", "Follows the link."],
    ],
    aria: [
      ["target, rel", "With external: _blank and noopener noreferrer, unless you set your own."],
      ["aria-hidden", "On the external mark; a hidden \"(opens in a new tab)\" text, from newTabLabel, says it instead."],
    ],
  },
};
