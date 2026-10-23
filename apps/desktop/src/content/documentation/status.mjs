/** Documentation entries: status, feedback and labels. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  badge: {
    // Spec: Job and boundaries; Badge.tsx.
    instead: [
      ["A number or dot that belongs to another element", ["count", "indicator"], "Count sits beside its owner's label; Indicator attaches to a corner. Badge stands alone and labels content."],
      ["A selectable filter, or an entered value that is the control itself", ["chip"], "Chip is the interactive pill; a Badge only states a value."],
      ["A value someone chose or typed: a select option, a topic", ["tag"], "Tag is the value itself in body text; Badge is a caption for metadata."],
      ["A keyboard key, or a literal such as an identifier", ["kbd", "code"], "Kbd draws a chord as keycaps; Code marks source inline."],
    ],
    // Spec: Variants (justification column), Behavior and accessibility, Owner decisions; Badge.tsx.
    practices: [
      ["Do", "Use soft, the default, for status and metadata; outline for quiet labels beside dense text; solid for a state that must read at a glance."],
      ["Do", "Pick the tone for meaning (success, warning, danger) and the variant for emphasis; the two are independent."],
      ["Do", "Give a dotOnly or iconOnly Badge an aria-label; it has no visible text, and the component throws without one."],
      ["Do", "Put the meaning in the label: an avatar, flag or icon is decorative and hidden from assistive tech."],
      ["Do", "Set truncate for labels that can run long; plain-text labels keep the full text in title."],
      ["Do", "Use as=\"a\" with an href when the Badge leads to its details; it stays a native link."],
      ["Don't", "Put a dismiss on a link Badge, or use onDismiss without a dismissLabel; both throw."],
      ["Don't", "Use a Badge as a button or filter. It has no pressed or selected state; use Chip."],
    ],
    // Spec: Anatomy (the area block); manifest elements.
    parts: {
      root: "A span, or a native link with as=\"a\": owns the height, the pill or radius corner, the fill and border, and the text gutters.",
      dot: "A small coloured disc before the label, in the tone's ink. dotOnly draws the dot alone.",
      "leading-icon": "An icon before the label, centred in the Badge's rounded end. Decorative.",
      label: "The text, cap-centred on the plate; with truncate it ends in an ellipsis.",
      "trailing-icon": "An icon after the label. Decorative.",
      avatar: "A round person image before the label. Decorative: the label names the person.",
      flag: "A round locale flag before the label. Decorative.",
      dismiss: "A native button at the end with the Area dismiss glyph; its hit target is larger than the visible box.",
    },
    keyboard: [
      ["Tab", "Moves focus to a link Badge and to its dismiss button. A plain Badge is not a stop."],
      ["Enter", "Follows a link Badge."],
      ["Enter or Space", "On the dismiss button, calls onDismiss."],
    ],
    // Badge.tsx.
    aria: [
      ["role=\"img\", aria-label", "On a dotOnly or iconOnly span Badge; the name is required (aria-labelledby also works, or aria-hidden when decorative)."],
      ["aria-label", "On the dismiss button, from dismissLabel."],
      ["aria-hidden", "On the dot, icons, avatar and flag."],
      ["title", "Set to the label's text when truncate is on and the label is plain text; rich labels must pass one."],
    ],
  },

  "badge-group": {
    // Spec: Job and boundaries.
    instead: [
      ["A bar of filters someone turns on and off", ["chip"], "Chips are selectable; Badge group only lays out labels."],
      ["A stack of people", ["avatar"], "AvatarGroup overlaps avatars and counts the rest as one more Avatar."],
      ["A row of actions", ["toolbar"], "Toolbar arranges controls with its own keyboard model."],
    ],
    // Spec: Owner decisions, Variants, Behavior and accessibility; BadgeGroup.tsx.
    practices: [
      ["Do", "Omit visibleCount to wrap every badge, set a number to cap how many show, or use auto to fit one line."],
      ["Do", "Use overlay to keep the group on one line, inline to let it wrap; both open the hidden badges the same way."],
      ["Do", "Give overflowLabel words that say what is hidden (\"More labels\"); the trigger reads it with the count."],
      ["Do", "Keep every badge in the group one size; the +N trigger takes that size."],
      ["Don't", "Wrap the badges in a fragment. Pass them as direct children or an array, or the count is wrong."],
      ["Don't", "Add paint to the group. It sets the gap; the badges and the +N trigger are ordinary Badges."],
    ],
    // Spec: Anatomy (area BadgeGroup).
    parts: {
      root: "A flex row that sets one gap between badges; it wraps unless overflow is overlay.",
      item: "The wrapper around each badge, in the row or in the overflow list. It draws nothing.",
      "overflow-trigger": "A Badge-styled button reading +N, shown only when badges are hidden. It opens the overflow list.",
      "overflow-content": "A popover under the trigger listing only the hidden badges.",
    },
    // Native popovertarget and popover="auto"; BadgeGroup.tsx.
    keyboard: [
      ["Tab", "Moves to the +N trigger after the visible badges (and to any link badges)."],
      ["Enter or Space", "Opens the overflow list; focus moves into it."],
      ["Escape", "Closes the list and returns focus to the trigger. A click outside also closes it."],
    ],
    aria: [
      ["aria-label", "On the trigger: overflowLabel and the hidden count (\"More statuses, 3 more\")."],
      ["role=\"group\", aria-label", "On the overflow list, named by overflowLabel."],
    ],
  },

  count: {
    // Spec: Job and boundaries.
    instead: [
      ["A status or metadata word with a tone", ["badge"], "Badge labels content and has tone, dot and icon options; a Count only quantifies."],
      ["New activity or an unread number on a corner of a button, tab or avatar", ["indicator"], "Indicator attaches to its owner and is danger by default."],
    ],
    // Spec: Variants, States, Behavior and accessibility; Count.tsx JSDoc.
    practices: [
      ["Do", "Place a Count right after its owner's label: a nav row, a tab, a filter or a group heading."],
      ["Do", "Use plain by default; use soft where the row's hover or selected fill would swallow plain ink."],
      ["Do", "Pass label with the words the owner lacks (\"unread\"), so a screen reader hears \"Inbox 3 unread\"."],
      ["Do", "Set showZero={false} where a zero says nothing; a zero Count then renders nothing."],
      ["Don't", "Colour a Count to warn. It has no tones; use Indicator or Badge for urgency."],
      ["Don't", "Use a Count on its own. It means nothing without the label it counts for."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "An inline span holding the formatted number (max+ above max); at least as wide as it is tall, so one digit is round.",
      label: "Visually hidden words after the number, read by screen readers only.",
    },
    aria: [],
  },

  indicator: {
    // Spec: Job and boundaries.
    instead: [
      ["A status word or label that stands on its own", ["badge"], "Badge labels content with text; Indicator marks another element."],
      ["How many items a nav row, tab or heading holds, beside its label", ["count"], "Count is read as part of its owner's name and has no tone."],
    ],
    // Spec: Owner decisions, Decisions, Behavior and accessibility; Indicator.tsx.
    practices: [
      ["Do", "Attach it with IndicatorAnchor to the owner's corner, and put the status in the owner's name (\"Notifications, new activity\")."],
      ["Do", "Use a dot for unread or new activity with no number, and count for a short number; counts above max read max+."],
      ["Do", "Use status (available, away, busy…) on an avatar for a person's availability."],
      ["Do", "Set withBorder where the indicator overlaps its owner, so a surface cutout separates them."],
      ["Do", "Set hidden to remove it; disabled is a deprecated alias for the same thing."],
      ["Don't", "Rely on an attached Indicator to be read. The anchor hides it, so the owner must carry the meaning."],
      ["Don't", "Use an Indicator for a status with words; use Badge."],
    ],
    // Manifest: no elements.
    parts: {
      root: "A dot or a count pill, round at one digit, in the tone's fill. A status is drawn as a presence glyph instead.",
    },
    // Spec: States, Motion; indicator.css hooks.
    states: {
      processing: "A pulse rings out from the mark; it stops under reduced motion and when motion is off.",
      border: "A ring of the surface colour around the mark, cutting it out from the owner it overlaps.",
    },
    aria: [
      ["role=\"img\", aria-label", "On a standalone dot or count: label, or \"N notifications\", \"New activity\" or \"Processing\" by default."],
      ["aria-hidden, inert", "On the IndicatorAnchor slot, so an attached indicator is decorative."],
    ],
  },

  avatar: {
    // Spec: Job and boundaries.
    instead: [
      ["Showing availability or an unread count on an avatar", ["indicator"], "Indicator draws presence and counts; IndicatorAnchor places them on the avatar's corner."],
      ["A person named as a label inside content", ["badge"], "Badge has an avatar slot beside a visible name."],
    ],
    // Spec: Variants, Behavior and accessibility; primitives.tsx Avatar JSDoc.
    practices: [
      ["Do", "Pass alt with src (alt=\"\" beside a visible name), or aria-label: an image Avatar with neither throws."],
      ["Do", "Give fallback initials (one or two letters) or an icon, shown when there is no image or it fails to load."],
      ["Do", "Use a circle for people and square for teams, workspaces and bots; unset follows the theme's pills setting."],
      ["Do", "Set active for the current person or the one speaking; it draws a ring without changing layout."],
      ["Do", "Use AvatarGroup with max to stack several; the rest become one more Avatar named by overflowLabel."],
      ["Don't", "Make an Avatar a button by itself. It has no hover, focus or pressed state; wrap it in a control that does."],
      ["Don't", "Use tone to encode meaning. Neutral is a soft plate, inverse a solid one, for contrast with what is around it."],
    ],
    // Spec: Anatomy (area).
    parts: {
      root: "An inline span: owns the size, circle or square corner, fallback fill and ink, and the group and active rings.",
      image: "The photo, cropped to fill the shape.",
      icon: "A generic glyph shown when there is no image, in place of initials.",
    },
    aria: [
      ["role=\"img\", aria-label", "On the Avatar when it shows no image, from aria-label or alt."],
      ["alt", "On the image, from alt; empty when the Avatar itself carries an aria-label."],
      ["aria-hidden", "On initials and the fallback icon."],
      ["role=\"group\"", "On AvatarGroup."],
    ],
  },

  tag: {
    // Spec: Job and boundaries.
    instead: [
      ["A caption for metadata or a status", ["badge"], "Badge is a strong caption, a pill by default; Tag is the value itself in body text."],
      ["A selectable filter or an action someone presses", ["chip"], "Chip is a control with its own hover and selection; a Tag only carries its remove control."],
      ["Choosing or creating tags in a field", ["tag-picker"], "Tag picker lists, filters and adds them, and shows the chosen ones as Tags."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; Tag.tsx JSDoc.
    practices: [
      ["Do", "Use a Tag for a value someone chose or typed: a select option, a topic, a status property."],
      ["Do", "Pass onRemove where the value can be taken off; the remove control is named \"Remove <label>\"."],
      ["Do", "Pass removeLabel when the label isn't plain text, so the remove control still has a useful name."],
      ["Do", "Use sm (the default) in text and lists; md beside larger controls, such as a large Tag picker."],
      ["Don't", "Use tone alone to say something; the label carries the meaning."],
      ["Don't", "Use a Tag as a filter toggle. It has no selected state; use Chip."],
    ],
    // Spec: Decisions; manifest elements.
    parts: {
      root: "An inline span: owns the height, the radius corner, the tone's tint and ink, and body-size text.",
      icon: "An optional small glyph before the label. Decorative.",
      label: "The value, in the tone's ink.",
      remove: "A native button with the dismiss glyph, in the tag's ink; under the pointer it gets a plate fitted to the tag's corner.",
    },
    states: {
      disabled: "Dims the tag and hides the remove control.",
    },
    keyboard: [
      ["Tab", "Moves focus to the remove control. A Tag without one is not a stop."],
      ["Enter or Space", "On the remove control, calls onRemove."],
    ],
    aria: [
      ["aria-label", "On the remove control: removeLabel, or \"Remove <label>\" for a text label."],
      ["aria-hidden", "On the icon."],
    ],
  },

  alert: {
    // Spec: Job and boundaries.
    instead: [
      ["Reporting the outcome of an action that should pass on its own", ["toast"], "Toast floats at the screen's corner and leaves; Alert stays in place, tied to the content around it."],
      ["A decision that must be made before going on", ["dialog", "confirm-dialog"], "A Dialog blocks the page; an Alert never does."],
    ],
    // Spec: Variants, Banner, Behavior and accessibility; primitives.tsx Alert JSDoc.
    practices: [
      ["Do", "Use the tone for meaning: info, success, warning or danger; neutral, the default, for a plain notice."],
      ["Do", "Use single-line for a short message, multiline for a title over wrapping text with actions below."],
      ["Do", "Use the banner layout for a one-line announcement across a page or section, and show one at a time."],
      ["Do", "Set flush on a banner that meets its container's edges."],
      ["Do", "Remove the Alert in onDismiss: the parent owns whether a dismissed Alert stays rendered."],
      ["Don't", "Use the danger tone for anything less than a problem; it interrupts a screen reader."],
      ["Don't", "Put a long message in single-line; its title and description end in an ellipsis."],
    ],
    // Spec: Anatomy; manifest elements.
    parts: {
      root: "The bar or box: owns the inset, the tone's fill, border and ink, and the corner.",
      icon: "An optional 16px icon on the first line, in the tone's ink. Decorative.",
      content: "Holds the title and description.",
      title: "The message's lead, strong, in the tone's ink.",
      description: "The message body in muted ink; the link follows it inline.",
      link: "An underlined text link after the description; in the banner layout it ends the row.",
      actions: "Buttons for the message; in multiline they sit below the text.",
      dismiss: "A small ghost icon Button with the dismiss glyph, shown by onDismiss.",
    },
    // Native link and Button.
    keyboard: [
      ["Tab", "Moves through the link, the actions and the dismiss button in reading order."],
      ["Enter or Space", "On the dismiss button, calls onDismiss."],
    ],
    aria: [
      ["role=\"alert\"", "On a danger Alert: a screen reader announces it at once."],
      ["role=\"status\"", "On every other tone: announced at the next pause."],
      ["aria-label", "On the dismiss button, from dismissLabel (\"Dismiss alert\")."],
      ["aria-hidden", "On the icon."],
    ],
  },

  toast: {
    // Spec: Job and boundaries.
    instead: [
      ["A message tied to the content around it that stays until resolved", ["alert"], "Alert sits in place and persists; a Toast floats and leaves."],
      ["A decision that must be made before going on", ["dialog"], "A Dialog blocks; a Toast never interrupts."],
      ["Interactive content anchored to a control", ["popover"], "Popover opens from its trigger and holds focus; a Toast is a passing notice."],
    ],
    // Spec: Behavior and accessibility; Toaster.tsx JSDoc.
    practices: [
      ["Do", "Wrap the app in a Toaster and call useToaster().show(); it announces each toast, even the first."],
      ["Do", "Use the tone for the outcome; it colours the icon, and danger interrupts a screen reader."],
      ["Do", "Add an action (such as Undo) when the outcome can be reversed; a toast with an action stays until dismissed."],
      ["Do", "Pass announcement when the message or title isn't plain text, so a screen reader hears something useful."],
      ["Do", "Keep the F8 hotkey, or set hotkey to another key; it moves focus to the toasts and is part of the region's name."],
      ["Don't", "Use a Toast for a message that must stay with its content; use Alert in place."],
      ["Don't", "Render Toast directly for app notifications: on its own it has no timer, stacking or pause. Show it through the Toaster."],
    ],
    // Spec: Behavior and accessibility; manifest elements.
    parts: {
      root: "The floating surface: owns the inset, the corner, the lift and the frame.",
      icon: "An optional icon on the first line, coloured by the tone. Decorative.",
      content: "Holds the title and description, and is the live region of a standalone Toast.",
      title: "A strong first line.",
      description: "The message, in muted ink under a title.",
      action: "One Button, such as Undo.",
      dismiss: "A small ghost icon Button with the dismiss glyph, shown by onDismiss.",
    },
    // Native Button; Toaster.tsx (hotkey, F8 by default).
    keyboard: [
      ["F8", "Moves focus to the toasts from anywhere on the page (the Toaster's hotkey)."],
      ["Tab", "Moves through a toast's action and dismiss button. Focus in the stack pauses every timer."],
      ["Enter or Space", "On the dismiss button, removes the toast."],
    ],
    aria: [
      ["role=\"status\", aria-atomic", "On a standalone Toast's content; role=\"alert\" for danger. live={false} turns it off."],
      ["aria-live", "On the Toaster's polite and assertive regions, which exist before any toast; danger goes to the assertive one."],
      ["aria-label", "On the Toaster region (\"Notifications (F8)\"), and on the dismiss button from dismissLabel."],
      ["aria-hidden", "On the icon."],
    ],
  },

  progress: {
    // Spec: Job and boundaries.
    instead: [
      ["An inline wait inside a control, such as a Button", ["spinner"], "Spinner fits an icon slot; Progress is a full-width bar."],
      ["A placeholder while content loads", ["skeleton"], "Skeleton keeps the layout's shape; Progress reports a task."],
      ["A value within a known range, such as storage used", ["meter"], "Meter is a reading, not a task moving to done."],
    ],
    // Spec: Variants, States, Behavior and accessibility.
    practices: [
      ["Do", "Pass value (0 to max) when you know how far along the task is; omit it for an indeterminate bar."],
      ["Do", "Name the bar with label; it is the bar's only accessible name."],
      ["Do", "Compose any visible label and value text around the bar; they are not part of it."],
      ["Do", "Use md by default, sm in dense rows, lg where the bar is the main content."],
      ["Don't", "Use Progress for a quantity that isn't moving to done; use Meter."],
      ["Don't", "Use Progress for a short wait inside a control; use Spinner."],
    ],
    parts: {
      root: "The rail: full width, owns the thickness, the pill ends and the rail colour.",
      bar: "The fill in the Selection colour; it moves to the value with a short ease.",
    },
    states: {
      indeterminate: "No value: a segment travels along the rail. It stops under reduced motion and when motion is off.",
    },
    aria: [
      ["role=\"progressbar\"", "Always."],
      ["aria-valuemin, aria-valuemax, aria-valuenow", "0, max and the clamped value; aria-valuenow is left out when indeterminate."],
      ["aria-label", "From label."],
    ],
  },

  spinner: {
    // Spec: Job and boundaries.
    instead: [
      ["A long task shown across a page or panel", ["progress"], "Progress is a bar with room for a label; Spinner fits a small space."],
      ["A labelled reading with a description, such as usage against a limit", ["meter"], "Meter names what is measured and says what it means."],
      ["A placeholder for content that is arriving", ["skeleton"], "Skeleton holds the layout's shape until the data comes."],
    ],
    // Spec: Variants, Behavior and accessibility, Value; primitives.tsx Spinner JSDoc.
    practices: [
      ["Do", "Match the size to the icon slot it replaces: sm, md (the default) or lg."],
      ["Do", "Give a standalone Spinner a label; omit it where the host already says it is busy, as a loading Button does."],
      ["Do", "Pass value (and max) once the amount is known; the ring stops at that share instead of turning."],
      ["Do", "Set role=\"meter\" with a value for a level of something, such as context or storage used; keep progressbar for a task."],
      ["Do", "Pass valueText to announce words in place of the number (\"48% of context used\")."],
      ["Don't", "Use a Spinner for a long task across a page or panel; use Progress."],
      ["Don't", "Label a Spinner whose host already announces the wait; it is said twice."],
    ],
    // Spec: Anatomy, Value.
    parts: {
      root: "A square the size of an icon slot. With no value the arc turns; with a value it holds the ring.",
      track: "With a value: the full ring, in the arc's ink at 25%.",
      arc: "With a value: the stretch of ring that shows the value, with round ends; it moves to a new value at an even pace.",
    },
    states: {
      determinate: "A value is set: the ring stops turning and the arc shows the share of max.",
    },
    aria: [
      ["role=\"status\"", "While turning with a label; the label is visually hidden text. Without a label the Spinner is aria-hidden."],
      ["role=\"progressbar\"", "With a value; role=\"meter\" when you set it."],
      ["aria-valuemin, aria-valuemax, aria-valuenow", "With a value: 0, max and the clamped value."],
      ["aria-valuetext", "From valueText."],
      ["aria-label", "With a value, from label."],
    ],
  },

  skeleton: {
    // Spec: Job and boundaries.
    instead: [
      ["An action in progress, in a small space", ["spinner"], "Spinner says something is running; Skeleton stands in for content."],
      ["How far along a task is", ["progress"], "Progress shows a value; a Skeleton shows only shape."],
    ],
    // Spec: Owner decisions, Variants, Behavior and accessibility.
    practices: [
      ["Do", "Use block for media, icons and bars and size it yourself; text for a line of type; circle for an avatar."],
      ["Do", "Pass lines for a paragraph; the last line is shorter."],
      ["Do", "Wrap the real element with loading so the placeholder takes its size and corner and the layout doesn't move."],
      ["Do", "Announce loading on the region that holds the Skeletons (a label or busy state); the Skeleton itself is hidden."],
      ["Do", "Set animated={false} in dense lists where many shimmers would be noisy."],
      ["Don't", "Draw placeholders for Buttons and other controls; leave them out of the loading layout."],
      ["Don't", "Use a Skeleton when the layout of what's coming is unknown; show a Spinner instead."],
    ],
    // Spec: Anatomy; manifest elements.
    parts: {
      root: "The placeholder: a soft grey shape with a travelling shimmer; block fills the width, text is one em tall, circle is round.",
      lines: "The column of text lines drawn for a paragraph when lines is more than 1.",
    },
    aria: [
      ["aria-hidden", "On every Skeleton."],
      ["inert", "On a wrapped element while it is loading, so it can't be focused."],
    ],
  },

  meter: {
    // Spec: Job and boundaries; Spinner's Value section.
    instead: [
      ["A task moving to done, or work with no known end", ["progress"], "Progress is for tasks and has an indeterminate state; Meter is a reading."],
      ["A value the user sets", ["slider"], "A Meter is read, not adjusted."],
      ["A usage reading in a small space, as a ring", ["spinner"], "Spinner with a value and role=\"meter\" is the circular form."],
    ],
    // Spec: Variants, Behavior and accessibility; Meter.tsx JSDoc.
    practices: [
      ["Do", "Name what is measured with label (\"Storage\"); without one, pass aria-label."],
      ["Do", "Say what the number means in valueText (\"1.2 of 5 GB\") or description (\"Resets in 4 days\")."],
      ["Do", "Set tone to warning or danger when the value means trouble, and say so in the text as well."],
      ["Do", "Pass valueText as a string when you can; that is what a screen reader announces."],
      ["Don't", "Rely on the tone alone; colour is not read."],
      ["Don't", "Expect the tone to change on its own at a threshold; you set it, so the text can say why."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "A stack: the header, the bar, then the description, spaced as a Field.",
      header: "The row holding the label at the start and the value at the end.",
      label: "What is measured; it names the meter.",
      value: "The value as shown, the percentage by default; hidden from assistive tech, which reads the meter's own value.",
      track: "Progress's bar, filled to the share of the range in the tone's colour.",
      description: "A line under the bar that says what the number means.",
    },
    aria: [
      ["role=\"meter\"", "Always."],
      ["aria-valuemin, aria-valuemax, aria-valuenow", "From min, max and the value clamped to them."],
      ["aria-valuetext", "The shown value when it is a string (the percentage by default)."],
      ["aria-labelledby", "Points at the label when there is one."],
      ["aria-describedby", "Points at the description when there is one."],
    ],
  },

  "empty-state": {
    // Spec: Job and boundaries.
    instead: [
      ["No matches inside a listbox's own list", ["combobox", "command-palette"], "They keep a one-line no-results row in the list."],
      ["Content that is still loading", ["skeleton", "spinner"], "An empty state means there is nothing; a loading state means it is coming."],
    ],
    // Spec: Variants, Behavior and accessibility; EmptyState.tsx JSDoc.
    practices: [
      ["Do", "Say what is missing in the title in a few words, and how it fills in the line under it."],
      ["Do", "Use md for a page or main region, sm inside a panel, list or popover."],
      ["Do", "Give one or two actions, the main one first; leave them out when the region fills on its own."],
      ["Do", "Set titleAs to the page's next heading level, or p where a heading would break the outline."],
      ["Do", "Pass role=\"status\" when results empty out after a search or filter, so the change is read."],
      ["Don't", "Use it for an error or a failed load."],
      ["Don't", "Rely on the icon to explain; it is decorative and hidden from assistive tech."],
    ],
    // Spec: Anatomy; manifest elements.
    parts: {
      root: "A centred column with its own padding: owns the spacing between tile, text and actions.",
      icon: "A glyph on a soft square tile above the text. Decorative.",
      content: "Holds the title and description, at a readable measure.",
      title: "What is missing, as a heading (h2 by default).",
      description: "One or two sentences in muted ink on why it is empty or what fills it.",
      actions: "A centred row of Buttons or a Link that wraps.",
    },
    aria: [
      ["aria-hidden", "On the icon."],
      ["role=\"status\"", "Pass it when the empty state appears after a search or filter; the component doesn't announce itself."],
    ],
  },

  separator: {
    // Spec: Job and boundaries, Peers and consistency.
    instead: [
      ["Dividing items inside a Menu or Toolbar", ["menu", "toolbar"], "They draw their own lighter rules, never heavier than the surface they divide."],
      ["Short items along one line, with a mark between them", ["inline-list"], "Inline list draws the separator between items."],
    ],
    // Spec: Job and boundaries, Variants, Behavior and accessibility.
    practices: [
      ["Do", "Use it between related groups in a list, toolbar or panel."],
      ["Do", "Use spacing=\"normal\" for room around the rule between rows; none when the container's padding already gives it."],
      ["Do", "Set inset so the rule stops short of the container's edge, in line with inset content."],
      ["Do", "Set decorative when the rule doesn't split the content for assistive tech."],
      ["Don't", "Use it as a control edge or a container seam; those belong to the control or container."],
      ["Don't", "Use separators to space sections; spacing is the container's job."],
    ],
    parts: {
      root: "The rule: one line thick in the divider colour, horizontal or vertical, with optional margin.",
    },
    aria: [
      ["role=\"separator\", aria-orientation", "By default; aria-orientation follows orientation."],
      ["role=\"none\"", "With decorative: a visual rule only."],
    ],
  },

  code: {
    // Spec: Job and boundaries.
    instead: [
      ["A keyboard shortcut", ["kbd"], "Kbd draws keycaps and reads the chord aloud; Code marks a literal."],
      ["A status label", ["badge"], "Badge carries tone and status; Code is plain source."],
      ["Several lines of source, or code to copy", ["code-block"], "Code block has line numbers, a header and a copy button."],
    ],
    // Spec: Owner decisions, Variants, Feedback log; primitives.tsx Code and Token.
    practices: [
      ["Do", "Mark identifiers, commands, file names and token names inside prose or table cells."],
      ["Do", "Pass swatch with a token's var() so the colour follows the theme; a hex shows a fixed colour."],
      ["Do", "Use subtle for a quieter, derived reference beside a primary one."],
      ["Do", "Set onColor on a coloured ground; it takes the surrounding ink."],
      ["Do", "Use <Code swatch> for design tokens. Token is deprecated in its favour and renders the same."],
      ["Don't", "Size Code yourself; it follows the surrounding text."],
      ["Don't", "Use it for keyboard keys or for code longer than a line."],
    ],
    // Spec: Anatomy (area).
    parts: {
      root: "A native code element: inline, with a thin edge, padding and a small corner; both ends survive a line wrap.",
      swatch: "A square of the token's colour before the label, with a faint ring. Decorative.",
      label: "The name beside a swatch; long names end in an ellipsis.",
    },
    aria: [
      ["aria-hidden", "On the swatch."],
    ],
  },

  "code-block": {
    // Spec: Job and boundaries; copy-button.md.
    instead: [
      ["A literal inside a sentence or a table cell", ["code"], "Code marks it inline at the text's size."],
      ["Copying a single value without showing a block", ["copy-button"], "Copy button copies its value and confirms in place."],
    ],
    // Spec: Variants, Behavior and accessibility; pages.mjs example notes.
    practices: [
      ["Do", "Give a title (the filename) when the code has a paste destination; leave it out for a passing example."],
      ["Do", "Pass plain code, or html already highlighted with one line of markup per line; the block doesn't highlight."],
      ["Do", "Highlight only the lines under discussion, and mark added and removed lines rather than writing comments into the code."],
      ["Do", "Pass languages for the same sample in several languages; languageTabs shows them as tabs."],
      ["Do", "Use wrap in a fixed measure, collapsible for a long sample, and flush inside another framed surface."],
      ["Do", "Use size sm for the inspector's code well; md is the page block."],
      ["Don't", "Pass untrusted html; it is rendered as markup."],
      ["Don't", "Turn line numbers off when people refer to lines; use linkLines to make each one shareable."],
    ],
    // Spec: Anatomy; manifest elements (long list, internal grid parts described briefly).
    parts: {
      root: "The framed block: owns the edge, corner, code ground and clipping.",
      header: "The row above the code with the title, language and actions, and a rule under it.",
      title: "The filename, in mono.",
      language: "The language as a passive label.",
      languages: "The language switcher: a Select, or tabs with languageTabs.",
      select: "The Select used as the language picker.",
      actions: "Your actions and the copy button at the header's end; without a header they float on the first line.",
      body: "The scrolling code area; with language tabs it is the tab panel.",
      pre: "The preformatted element; focusable so a keyboard can scroll it.",
      code: "The code element holding the lines.",
      line: "One line of code: a gutter and the text. It can be highlighted, added or removed.",
      gutter: "The column before the text holding the line number and any diff marker.",
      linenumber: "The line's number, not selectable; with linkLines a link to that line.",
      marker: "The + or − of an added or removed line.",
      text: "The line's code; it scrolls sideways unless wrap is on.",
      toggle: "The Show code / Hide code button under a collapsible block.",
    },
    states: {
      collapsed: "Only the first lines show, fading out, and the toggle reads Show code.",
    },
    // primitives.tsx CodeBlock handlers; native Select, buttons and pre.
    keyboard: [
      ["Tab", "Moves through the language picker, the actions and copy button, the code body and the toggle. Line-number links are not stops."],
      ["Left or Right", "On language tabs, moves to the previous or next language and shows it (mirrored in right-to-left)."],
      ["Home or End", "On language tabs, moves to the first or last language."],
      ["Up or Down", "With the code body focused, scrolls it."],
      ["Enter or Space", "Copies the code from the copy button, or shows and hides the code from the toggle."],
    ],
    aria: [
      ["role=\"tablist\", aria-label", "On language tabs, named by languageLabel (\"Language\"); the Select takes the same name."],
      ["role=\"tab\", aria-selected, aria-controls", "On each language tab; only the selected one is in the Tab order."],
      ["role=\"tabpanel\", aria-labelledby, tabindex", "On the body when languageTabs is on; it stays in the Tab order so a keyboard can scroll the code."],
      ["tabindex, aria-label", "On the pre without tabs: focusable, named by a string title, else \"Code\"."],
      ["aria-label", "On each line-number link (\"Line 3\") with linkLines, and on the copy button from copyLabel."],
      ["aria-controls", "On the toggle, pointing at the code; its visible label carries the state."],
    ],
  },

  "shortcut-list": {
    // Spec: Job and boundaries.
    instead: [
      ["Commands someone runs, with their shortcuts as hints", ["menu"], "A Menu's rows act; a Shortcut list only teaches the keys."],
      ["One shortcut inline, in a label or a sentence", ["kbd"], "Kbd draws a single chord."],
    ],
    // Spec: Owner decisions, Variants, Behavior and accessibility; ShortcutList.tsx JSDoc.
    practices: [
      ["Do", "Give each group a title (\"Navigation\"); it names the list. Without one, pass aria-label."],
      ["Do", "Stack several lists for a full sheet, inside a Dialog, Popover or Panel."],
      ["Do", "Pass keys as a list of chords for alternatives; they are read with \"or\" between them."],
      ["Do", "Use shortcut with a KbdGroup for keys pressed in sequence."],
      ["Do", "Every key is a keycap; the quiet option is deprecated and ignored."],
      ["Don't", "Expect the list to bind keys. The page binds them; the list only shows them."],
      ["Don't", "Make rows editable or switchable; a key binding editor is a settings form."],
    ],
    // Spec: Anatomy (area).
    parts: {
      root: "A section for one group; it adds no side inset, so names line up with the surface's title.",
      title: "The group's name in muted ink, as a heading (h3 by default).",
      items: "The description list holding the rows.",
      item: "One row: what the shortcut does at the start, its keys at the end, a divider under all but the last.",
      label: "What the shortcut does.",
      keys: "The chord as Kbd keycaps; alternatives sit side by side.",
    },
    aria: [
      ["aria-labelledby", "On the section, pointing at the title; pass aria-label when there is no title."],
    ],
  },
};
